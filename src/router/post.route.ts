import { usePostStore } from "@/stores/Post.store";
import type { RouteRecordRaw } from "vue-router";
import * as routeNames from "./routes";
import { useUserStore } from "@/stores/User.store";

export default {
    path: "/posts",
    ...routeNames.posts(),
    component: () => import("../views/Post/Posts.view.vue"),
    async beforeEnter(from, to, next) {
        const artworkStore = usePostStore();
        artworkStore.preflight();
        next();
    },
    children: [
        {
            path: "i/:postId",
            ...routeNames.post(),
            component: () => import("../views/Post/Post.edit.vue"),
            beforeEnter(from, to, next) {
                const artworkStore = usePostStore();
                artworkStore.clearPost();
                const param = <string> (to.params.postId ?? from.params.postId);
                if (param !== "new") {
                    const id = parseInt(
                        <string> (to.params.postId ?? from.params.postId),
                    );
                    artworkStore.loadPost(id);
                }
                next();
            },
        },
    ],
} as RouteRecordRaw;
