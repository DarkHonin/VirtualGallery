import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useUserStore } from "@/stores/User.store";
import { usePostStore } from "@/stores/Post.store";
import { useSlotStore } from "@/stores/Slots.store";
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
        {
          path: "/slots",
          ...routeNames.slots(),
          component: () => import("../views/Slots/Slots.view.vue"),
          async beforeEnter(from, to, next) {
            const slotStore = useSlotStore();
            slotStore.preflight();
            next();
          },
          meta: {
            title: "Slots",
          },
          children: [
            {
              path: "i/:slotId",
              ...routeNames.slot(),
              component: () => import("../views/Slots/Slot.view.vue"),
              beforeEnter(from, to, next) {
                // if (!(to.params.artworkId ?? from.params.artworkId)?.length)
                //   return next({ name: 'artworks' })
                const slotStore = useSlotStore();
                slotStore.clearCurrentSlot();
                const param = <string> (to.params.slotId ?? from.params.slotId);
                if (param !== "new") {
                  const id = parseInt(
                    <string> (to.params.slotId ?? from.params.slotId),
                  );
                  slotStore.loadSlot(id);
                }
                next();
              },
            },
          ],
        },
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
