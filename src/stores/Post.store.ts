import type { Session } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { supabase } from "@/db/index.db";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import { api } from "@/services/index.service";
import type { Database } from "@/db/database.types";
import {
  type Post as Post,
  type PostPreview,
  PostStorage,
  PostTable,
} from "@/db/post.model";
import { useUserStore } from "./User.store";
import PostService from "@/services/Post.service";
import PostEditService from "@/services/Post.service";
import { useMediaStore } from "./Media.store";

export const PostStoreActions = {
  loading: "Loading Posts",
  loadingArtwork: "Loading Post",
  save: "Saving Post",
  upload: "Uploading Image",
  deleteMedia: "Deleting media",
  delete: "Deleting Post",
};

const artworkStoreStateActions = defineStateActions(PostStoreActions);

interface PostStore extends StoreState<typeof PostStoreActions> {
  _activePost?: Post;
  _cachedPost?: Post;
  _markup?: string;
}

export const usePostStore = defineStore("Post Edit Store", {
  state: (): PostStore => ({
    _activePost: undefined,
    _cachedPost: undefined,
    _markup: undefined,
    ...artworkStoreStateActions.state,
  }),
  getters: {
    post: ({ _activePost }) => (_activePost as any ?? {}) as Post,
    ...artworkStoreStateActions.getters,
  },
  actions: {
    clearPost() {
      delete this._markup;
      delete this._activePost;
      delete this._cachedPost;
    },
    loadPost(id: Post["id"] | "new") {
      return artworkStoreStateActions.runAction(
        this,
        "loadingArtwork",
        async () => {
          try {
            const { data, error } = await PostTable().select().eq("id", id)
              .single();
            if (error || !data) throw error || "Could not find artwork";

            // @ts-ignore
            this._activePost = data;
            this._cachedPost = JSON.parse(JSON.stringify(data));

            await useMediaStore().fetchMediaForPost(this._activePost.id);
            return data;
          } catch (err) {
            this.clearPost();
            throw err;
          }
        },
      );
    },
    savePost() {
      if (!this.post) throw "No active artwork to save";
      return artworkStoreStateActions.runAction(this, "save", async () => {
        await new Promise((y) => setTimeout(y, 1000));

        const mediaStore = useMediaStore();

        if (this.post!.id) {
          this.post.last_updated = new Date().toISOString();
          const newMedia = await mediaStore.publishNewMedia(this.post.id);
          if (!this.post.media) this.post.media = [];
          this.post.media = this.post.media.concat(newMedia);

          const removed = await mediaStore.deleteRemovedMedia();
          this.post.media = this.post.media.filter((e) => !removed.includes(e));

          const update = await PostTable().update(this.post!).eq(
            "id",
            this.post!.id,
          );

          if (update.error) {
            throw update.error ?? "Something went wrong during the save";
          }

          return this.loadPost(this.post!.id);
        } else {
          const newMedia = await mediaStore.publishNewMedia(NaN);
          if (!this.post.media) this.post.media = [];
          this.post.media = this.post.media.concat(newMedia);
          this.post.author = useUserStore().user!.id;
          this.post.last_updated = new Date().toISOString();
          const update = await PostTable().insert(this.post!).select()
            .single();
          if (update.error || !update.data) {
            throw update.error ?? "Something went wrong during the save";
          }
          mediaStore.clearMediaCache(NaN);
          return this.loadPost(update.data.id);
        }
      });
    },
    addPostMedia(file: File) {
      if (!this.post) {
        throw "No active artwork to bind file to";
      }
      return artworkStoreStateActions.runAction(this, "upload", async () => {
        const artifactPath = `posts/${file.name}`;
        const { error } = await PostStorage().upload(artifactPath, file);
        if (error) {
          throw error;
        }

        if (!this.post.media) this.post.media = [];
        this.post!.media.push(artifactPath);
        await this.savePost();
      });
    },
    deletePost() {
      return artworkStoreStateActions.runAction(this, "delete", async () => {
        if (!this._activePost) throw "No active post";
        const mediaStore = useMediaStore();

        if (!this._activePost.media) this._activePost.media = [];
        this._activePost.media.forEach((media) => {
          mediaStore.removeMedia(this._activePost!.id, media);
        });

        await mediaStore.deleteRemovedMedia();

        await PostEditService.deletePost(this._activePost.id);

        this.clearPost();
      });
    },
  },
});
