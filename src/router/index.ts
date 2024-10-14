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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      ...routeNames.home(),
      component: LandingView,
    },
    {
      path: "/auth",
      ...routeNames.auth(),
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
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

router.beforeEach((to, from, next) => {
  useUserStore().preflight();
  next();
});

export default router;
