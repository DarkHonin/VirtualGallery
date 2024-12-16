import type { RouteRecordRaw } from "vue-router";
import * as routeNames from "./routes";
import { ProfileLinks } from "@/utils/ProfileLinks";
import { ENABLE_LOGIN, ENABLE_REGISTER } from "@/utils/env.flags";

export default {
    path: "auth",
    ...routeNames.auth(),
    children: [
        ...(ENABLE_LOGIN
            ? [{
                ...routeNames.login(),
                path: "",
                component: import("../views/Auth/Login.view.vue"),
            }]
            : []),
        ...(ENABLE_REGISTER
            ? [
                {
                    ...routeNames.registerPage(),
                    path: "register",
                    component: import("../views/Auth/Register.view.vue"),
                },
            ]
            : []),
    ],
} as RouteRecordRaw;
