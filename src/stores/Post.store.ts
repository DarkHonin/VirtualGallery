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
import PostService from "@/services/PostEdit.service";
import PostEditService from "@/services/PostEdit.service";
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
  _posts?: PostPreview[];
  _activePost?: Post;
  _cachedPost?: Post;
  _markup?: string;
}

export const usePostStore = defineStore("ArtworkStore", {
  state: (): PostStore => ({
    _posts: undefined,
    _activePost: undefined,
    _cachedPost: undefined,
    _markup: undefined,
    ...artworkStoreStateActions.state,
  }),
  getters: {
    posts: ({ _posts: _artworks }) => _artworks ?? [],
    post: ({ _activePost }) => _activePost ?? <Post> {},
    ...artworkStoreStateActions.getters,
  },
  actions: {
    preflight(uid?: string) {
      return artworkStoreStateActions.runAction(this, "loading", async () => {
        await new Promise((y) => setTimeout(y, 1000));

        return this._posts = await PostService.readPosts();
      });
    },
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

            if (!this._posts) this._posts = [];

            const found = this._posts?.find((e, i, arr) => {
              if (e.id == id) return Boolean(this._posts![i] = e);
            });

            if (!found) this._posts?.push(<Post> data);

            this._activePost = <Post> data;
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
          const newMedia = await mediaStore.publishNewMedia(this.post.id);
          this.post.media = this.post.media.concat(newMedia);

          const removed = await mediaStore.deleteRemovedMedia();
          console.log(removed);
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

        console.log(this._activePost.media);

        this._activePost.media.forEach((media) => {
          mediaStore.removeMedia(this._activePost!.id, media);
        });

        await mediaStore.deleteRemovedMedia();

        await PostEditService.deletePost(this._activePost.id);

        this._posts = this._posts?.filter((e) => e.id != this._activePost!.id);
        this.clearPost();
      });
    },
  },
});
