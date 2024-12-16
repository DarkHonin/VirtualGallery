import type { RouteRecordRaw } from "vue-router";
import * as routeNames from "./routes";
import { useUserStore } from "@/stores/User.store";
import { usePostsStore } from "@/stores/Posts.store";

export default [
    {
        path: "/projects",
        ...routeNames.posts(),
        component: () => import("../views/Post/Posts.view.vue"),
    },
    {
        path: "/project/:postId",
        ...routeNames.postView(),
        component: () => import("../views/Post/Post.view.vue"),
        beforeEnter: (to, from, next) => {
            const postStore = usePostsStore();
            if (<string> to.params.postId == "new") {
                postStore.clearActivePost();
            } else {
                postStore.getPost(parseInt(<string> to.params.postId));
            }
            next();
        },
    },
] as RouteRecordRaw[];
