import type { Post } from "@/db/post.model";
import PostService from "@/services/Post.service";
import { defineStore } from "pinia";
import { defineStateActions, type StoreState } from "./util/StateActions.util";
import { supabase } from "@/db/index.db";

export enum BlogStoreActions {
    loading = "Loading Posts",
    loadingPost = "Loading Post",
}

const blogStoreActions = defineStateActions(BlogStoreActions);

interface BlogStoreState extends StoreState<typeof BlogStoreActions> {
    _post?: Post;
    _posts?: Post[];
}

export const useBlogStore = defineStore("BlogStore", {
    state: (): BlogStoreState => ({
        _post: undefined,
        _posts: undefined,
        ...blogStoreActions.state,
    }),
    getters: {
        latest: ({ _posts }) =>
            _posts?.sort((a, b) =>
                Date.parse(b.last_updated!) - Date.parse(a.last_updated!)
            )[0] ?? undefined,
        active: ({ _post }) => {
            return _post;
        },
        posts: ({ _posts }) =>
            _posts?.sort((a, b) =>
                Date.parse(b.publish!) - Date.parse(a.publish!)
            ) ?? [],
        ...blogStoreActions.getters,
    },
    actions: {
        loadPost(postId: number) {
            return blogStoreActions.runAction(
                this,
                "loadingPost",
                async () => {
                    const { data, error } = await supabase.functions.invoke(
                        "blog",
                        { body: { postId } },
                    );
                    if (error) throw error;
                    this._post = data;
                },
            );
        },
        loadPosts() {
            blogStoreActions.runAction(
                this,
                "loadingPost",
                async () => {
                    const lastPublish = this._posts?.length
                        ? this._posts[this._posts.length - 1]
                        : undefined;
                    const { data, error } = await supabase.functions.invoke(
                        "blog",
                        { body: { lastPublish: lastPublish?.publish } },
                    );
                    if (error) throw error;
                    if (!this._posts) this._posts = [];
                    this._posts.push(...data);
                },
            );
        },
    },
});
