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

import NotFoundView from "@/views/Common/NotFound.view.vue";
import AuthRoutes from "./Auth.routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      ...routeNames.home(),
      component: LandingView,
    },
    {
      path: "/about",
      ...routeNames.about(),
      component: LandingView,
    },
    {
      path: "",
      name: "root",
      children: [
        profileRoutes,
        ...postRoute,
        AuthRoutes,
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      ...routeNames.NotFound(),
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    try {
      await userStore.captureSession();
      if (userStore.isSignedIn) {
        return next();
      }
    } catch (e) {
      return next(routeNames.NotFound());
    }
  } else {
    next();
  }
});

export default router;
