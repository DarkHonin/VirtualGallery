import type { Post } from "@/db/post.model";

import {
  type RouteLocationAsPathGeneric,
  type RouteLocationAsRelativeGeneric,
  useRoute,
} from "vue-router";

export const NotFound = () => ({ name: "NotFound" });

export const home = () => ({ name: "home" });
export const about = () => ({ name: "About" });
export const auth = (
  returnTo?: string,
): RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric => ({
  name: "Auth",
  query: { returnTo },
});

export const login = (returnTo?: string) => ({
  name: "Login",
  query: { returnTo },
});

export const registerPage = (returnTo?: string) => ({
  name: "Register",
  query: { returnTo },
});

export const posts = () => ({ name: "posts" });
export const postView = (postId?: Post["id"] | "new") => ({
  name: "postView",
  ...(postId ? { params: { postId } } : {}),
});

export const profile = () => ({ name: "profile" });

export const isRoute = (
  b: RouteLocationAsRelativeGeneric,
) => {
  const a = useRoute();
  return a?.name == b.name;
};
