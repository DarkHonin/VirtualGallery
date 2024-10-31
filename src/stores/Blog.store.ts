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
    _posts: {
        [id: number]: Post;
    };
}

export const useBlogStore = defineStore("BlogStore", {
    state: (): BlogStoreState => ({
        _post: undefined,
        _posts: {},
        ...blogStoreActions.state,
    }),
    getters: {
        latest: ({ _posts }) =>
            Object.values(_posts).sort((a, b) =>
                Date.parse(b.publish!) - Date.parse(a.publish!)
            )[0] ?? [],
        active: ({ _post }) => {
            return _post;
        },
        posts: ({ _posts }) =>
            Object.values(_posts).sort((a, b) =>
                Date.parse(b.publish!) - Date.parse(a.publish!)
            ) ?? [],
        ...blogStoreActions.getters,
    },
    actions: {
        loadPost(postId?: number) {
            return blogStoreActions.runAction(
                this,
                "loadingPost",
                async () => {
                    const { data, error } = await supabase.functions.invoke<
                        Post
                    >(
                        "blog/post",
                        { body: { postId } },
                    );
                    if (error || !data) throw error;
                    this._post = data;
                    this._posts[data.id] = this._post;
                },
            );
        },
        loadPosts() {
            blogStoreActions.runAction(
                this,
                "loadingPost",
                async () => {
                    const { data, error } = await supabase.functions.invoke<
                        Post[]
                    >(
                        "blog/posts",
                        {
                            body: { lastPublish: this.latest.publish },
                        },
                    );
                    if (error || !data) throw error;
                    data.forEach((i) => this._posts[i.id] = i);
                },
            );
        },
    },
});
