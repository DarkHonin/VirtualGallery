import type { Post } from "@/db/artwork.model";
import type { Slot } from "@/db/slot.model";
import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";

export const home = () => ({ name: "home" });
export const auth = (
  returnTo?: string,
): RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric => ({
  name: "auth",
  query: { returnTo },
});
export const profile = () => ({ name: "profile" });
export const posts = () => ({ name: "posts" });
export const post = (postId?: Post["id"] | "new") => ({
  name: "artwork_view",
  ...(postId ? { params: { postId } } : {}),
});
export const slots = () => ({ name: "slots" });
export const slot = (slotId?: Slot["id"]) => ({
  name: "slot_view",
  ...(slotId ? { params: { artworkId: slotId } } : {}),
});
