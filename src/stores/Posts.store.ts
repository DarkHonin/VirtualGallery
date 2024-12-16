import { defineStore } from "pinia";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import { type Post, usePost } from "@/db/post.model";
import PostService from "@/services/Post.service";

import type { FileObject } from "@supabase/storage-js";

export const postsStoreActions = {
    loadingPost: "Loading Post",
    loadingPosts: "Loading Posts",
    syncingPost: "Syncing Post",
};

const postEditStoreStateActions = defineStateActions(postsStoreActions);

interface PostsStoreState extends StoreState<typeof postsStoreActions> {
    _activePost?: Post;
    _posts?: Post[];
    _activePostMedia?: FileObject[];
}

export const usePostsStore = defineStore("PostsStore", {
    state: (): PostsStoreState => ({
        ...postEditStoreStateActions.state,
    }),
    getters: {
        ...postEditStoreStateActions.getters,
        posts: ({ _posts }) => _posts,
        post: ({ _activePost }) => _activePost,
        latestPosts: ({ _posts }) =>
            _posts?.sort((a, b) => {
                return (new Date(a.updated_at!).getTime() -
                    new Date(b.updated_at!).getTime());
            }).slice(0, 3),
        isAuthor: ({ _activePost }) => {
            const { isAuthor } = usePost(_activePost);
            return isAuthor.value;
        },
    },
    actions: {
        getPosts() {
            return postEditStoreStateActions.runAction(
                this,
                "loadingPosts",
                async () => {
                    this._posts = await PostService.getPosts();
                },
            );
        },
        clearActivePost() {
            this._activePost = undefined;
        },
        getPost(postId?: number) {
            return postEditStoreStateActions.runAction(
                this,
                "loadingPost",
                async () => {
                    if (postId) {
                        return this._activePost = await PostService.getPost(
                            postId,
                        );
                    }
                    this._activePost = await PostService.getLatest();
                },
            );
        },
        async syncPostFields(postId?: number, ...fields: (keyof Post)[]) {
            return postEditStoreStateActions.runAction(
                this,
                "syncingPost",
                async () => {
                    const targetId = this._activePost?.id ?? postId ??
                        undefined;
                    if (!targetId) throw "No active post ID to consume";

                    const retrievedData =
                        await (PostService.getPostField(targetId, ...fields));
                    if (!this._activePost) this._activePost = {} as Post;

                    Object.assign(this._activePost, retrievedData);
                },
            );
        },
    },
});
