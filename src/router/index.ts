import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { useUserStore } from "@/stores/User.store";

import * as routeNames from "./routes";
import LandingView from "@/views/Landing.view.vue";
import postRoute from "./post.route";
import profileRoutes from "./profile.routes";
import { useBlogStore } from "@/stores/Blog.store";
import NotFoundView from "@/views/Common/NotFound.view.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      ...routeNames.home(),
      beforeEnter(to, from, next) {
        useBlogStore().loadPosts();
        next();
      },
      component: LandingView,
    },
    {
      path: "/auth",
      ...routeNames.auth(),
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/Auth/Login.view.vue"),
    },

    {
      path: "/",
      name: "root",
      children: [
        profileRoutes,
        postRoute,
      ],
    },
    {
      path: "/",
      ...routeNames.NotFound(),
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    await userStore.preflight();
    if (userStore.user) {
      return next();
    }
    return next(routeNames.NotFound());
  } else {
    next();
  }
});

export default router;
