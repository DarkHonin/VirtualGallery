import { defineStore } from "pinia";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import {
    type NormalizedPostEntry,
    type Post,
    type PostEntry,
    PostStorage,
} from "@/db/post.model";
import PostService from "@/services/Post.service";
import { useUserStore } from "./User.store";

import type { FileObject } from "@supabase/storage-js";
import { usePostsStore } from "./Posts.store";

export const postEditStoreActions = {
    loading: "Loading Post(s)",
    creatingPost: "Creating Post",
    savingPost: "Saving Post",
    creatingEntry: "Creating Entry",
    editEntry: "Editing Entry",
    saveEntry: "Saving Entry",
    deletePost: "Deleting post",
};

const postEditStoreStateActions = defineStateActions(postEditStoreActions);

interface PostEditStore extends StoreState<typeof postEditStoreActions> {
    _activeEntry?: PostEntry;
    _activePostMedia?: FileObject[];
}

export const usePostEditStore = defineStore("PostEditStore", {
    state: (): PostEditStore => ({
        ...postEditStoreStateActions.state,
        _activeEntry: undefined,
        _activePostMedia: undefined,
    }),
    getters: {
        ...postEditStoreStateActions.getters,
        activePost: () => {
            const postStore = usePostsStore();
            return postStore.post;
        },
        activeEntry: ({ _activeEntry }) => _activeEntry,
        postEntries: () => {
            const postStore = usePostsStore();
            return postStore.post?.post_content?.sort((a, b) => {
                return Date.parse(b.timestamp) - Date.parse(a.timestamp);
            }) ?? [];
        },

        postFolder: () => {
            const postStore = usePostsStore();
            return `${postStore.post?.author}/${postStore.post?.id}`;
        },
    },
    actions: {
        async createPost(title: string) {
            return postEditStoreStateActions.runAction(
                this,
                "creatingPost",
                async () => {
                    const postStore = usePostsStore();

                    const newPost = await PostService.createPost(
                        title,
                    );

                    await postStore.getPosts();

                    postStore._activePost = undefined;
                    return newPost;
                },
            );
        },

        createPostEntry() {
            return postEditStoreStateActions.runAction(
                this,
                "creatingEntry",
                async (): Promise<PostEntry> => {
                    const updated = await PostService.createPostEntry(
                        this.activePost!,
                    );

                    this.activePost!.post_content.push(updated);

                    this._activeEntry = updated;
                    return updated;
                },
            );
        },

        savePostEntry(markdown: string) {
            return postEditStoreStateActions.runAction(
                this,
                "saveEntry",
                async (): Promise<Post> => {
                    const path = [
                        this.activePost!.author,
                        this.activePost!.id,
                        this._activeEntry!.id,
                    ].join("/");

                    await PostService.saveEntryMarkdown(path, markdown);

                    const entryIndex = this.activePost?.post_content.findIndex(
                        (e) => e.id == this._activeEntry!.id,
                    );
                    if (entryIndex === undefined) {
                        this.activePost!.post_content.push(this._activeEntry!);
                    } else {this.activePost!.post_content[entryIndex] = this
                            ._activeEntry!;}

                    delete this._activeEntry;
                    return await PostService.savePost(this.activePost!);
                },
            );
        },

        async editPostEntry(entry: PostEntry) {
            return postEditStoreStateActions.runAction(
                this,
                "editEntry",
                async (): Promise<PostEntry> => {
                    this._activeEntry = entry;
                    return this._activeEntry;
                },
            );
        },

        async deleteEntry(entry: PostEntry) {
            this.activePost!.post_content = this.activePost!.post_content
                .filter((e) => e.id !== entry.id);
            await this.savePost();
            this._activeEntry = undefined;
        },
        async savePost(post?: Post) {
            const target = post ?? this.activePost;
            if (!target) throw "No post to save";
            return postEditStoreStateActions.runAction(
                this,
                "savingPost",
                async (): Promise<Post> => {
                    await PostService.savePost(
                        target!,
                    );
                    return this.activePost!;
                },
            );
        },

        async deletePost(postId: number) {
            return postEditStoreStateActions.runAction(
                this,
                "deletePost",
                async () => {
                    const postStore = usePostsStore();
                    await PostService.deletePost(postId);
                    await postStore.getPosts();
                },
            );
        },
    },
});
