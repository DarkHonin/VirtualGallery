import { computed, type Ref, unref } from "vue";
import type { Database } from "./database.types.ts";
import { supabase } from "./index.db";
import { usePostStore } from "@/stores/Post.store";

export type Post = Database["public"]["Tables"]["Posts"]["Row"];

export type PostPreview = Pick<Post, "id" | "created_at" | "title" | "media">;
export type PostReadOnly = PostPreview | { markup: string };

export const PostTable = () => supabase.from("Posts");
export const PostStorage = () => supabase.storage.from("uploads");

export const useActivePost = () => {
  const artworkStore = usePostStore();

  const activePost = computed({
    get: () => artworkStore.post,
    set: (nv: Post) => (artworkStore._activePost = nv),
  });

  const title = computed({
    get: () => unref(activePost).title ?? undefined,
    set: (nv: string | undefined) => (unref(activePost).title = nv ?? null),
  });

  return {
    activePost,
    title,
  };
};

export const usePost = (post: Ref<Post> | Post) => {
  const media = computed(() => {
    return unref(post)?.media?.map((path) => {
      const { data } = PostStorage().getPublicUrl(path);
      return {
        url: data.publicUrl,
        path,
      };
    }) ?? [];
  });

  return {
    media,
  };
};
