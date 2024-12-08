import { computed, type Ref, unref } from "vue";
import type { Database } from "./database.types.ts";
import { supabase } from "./index.db";
import { usePostStore } from "@/stores/Post.store";
import { useMediaStore } from "@/stores/Media.store.js";

export type Post = Database["public"]["Tables"]["Posts"]["Row"];

export type PostPreview = Pick<Post, "id" | "created_at" | "title" | "media">;
export type PostReadOnly = PostPreview | { markup: string };

export const PostTable = () => supabase.from("Posts");
export const PostStorage = () => supabase.storage.from("uploads");

export const useActivePost = () => {
  const artworkStore = usePostStore();
  const mediaStore = useMediaStore();

  const activePost = computed({
    get: () => artworkStore.post,
    set: (nv: Post) => (artworkStore._activePost = nv),
  });

  const title = computed({
    get: () => unref(activePost).title ?? undefined,
    set: (nv: string | undefined) => (unref(activePost).title = nv ?? null),
  });

  const media = computed(() => mediaStore.media(activePost.value.id ?? NaN));
  return {
    activePost,
    title,
    media,
  };
};

export const usePost = (post: Ref<Post | undefined> | Post) => {
  const mediaStore = useMediaStore();

  const media = computed(() => {
    return unref(post)?.media?.map((name) => {
      return {
        url: mediaStore.publicUrl(name),
        name,
      };
    }) ?? [];
  });

  const coverImage = computed(() => {
    if (!unref(post) || !unref(post)!.media) return undefined;
    if (!unref(post)!.cover_image) return media.value[0];
    const cover_image_name = unref(post)!.media!.find((name) =>
      name == unref(post)!.cover_image!
    )!;
    return {
      url: mediaStore.publicUrl(cover_image_name),
      cover_image_name,
    };
  });

  const lastUpdate = computed(() =>
    (!unref(post)?.last_updated)
      ? undefined
      : new Date(Date.parse(unref(post)!.last_updated!)).toLocaleString()
  );
  const publicationDate = computed(() =>
    (!unref(post)?.publish)
      ? undefined
      : new Date(Date.parse(unref(post)!.publish!)).toLocaleString()
  );

  return {
    coverImage,
    media,
    post,
    lastUpdate,
    publicationDate,
  };
};
