import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import { useUserStore } from "@/stores/User.store";

import * as routeNames from "./routes";
import LandingView from "@/views/Landing.view.vue";
import postRoute from "./post.route";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
        {
          path: "/profile",
          ...routeNames.profile(),
          component: () => import("../views/Profile.view.vue"),
          async beforeEnter(from, to, next) {
            const store = useUserStore();
            if (!store.user) next({ name: "auth" });
            else next();
          },
        },
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

export default router;
