import type { RouteRecordRaw } from "vue-router";
import * as routeNames from "./routes";
import { ProfileLinks } from "@/utils/ProfileLinks";

export default {
    path: "/profile",
    ...routeNames.profile(),
    meta: {
        requiresAuth: true,
    },
    component: () => import("../views/profile/Profile.view.vue"),
    children: [
        {
            name: "tumblr-link",
            path: "tumblr",
            component: import("../views/profile/Profile.link.vue"),
            props: {
                service: ProfileLinks.tumblr,
            },
            meta: {
                requiresAuth: true,
            },
        },
    ],
} as RouteRecordRaw;
