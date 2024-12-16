import { computed, type Ref, ref, unref } from "vue";
import type { Database } from "./index.db";
import { supabase } from "./index.db";
import { useUserStore } from "@/stores/User.store";
import PostService from "@/services/Post.service";
import { usePostEditStore } from "@/stores/PostEditor.store";
import { usePostsStore } from "@/stores/Posts.store";

export type PostEntry = {
    title: string;
    timestamp: string;
    media: string[];
    id: string;
    index: number;
};

export type PostRow = Database["public"]["Tables"]["Posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["Posts"]["Insert"];

export type Post = Omit<PostRow | PostInsert, "post_content"> & {
    post_content: PostEntry[];
};

export const PostTable = () => supabase.from("Posts");
export const PostStorage = () => supabase.storage.from("uploads");

export type NormalizedPostEntry = PostEntry & {
    postId: number;
    author: string;
};

export const usePost = (post?: Post | Ref<Post | undefined>) => {
    const userStore = useUserStore();
    const postEntries = computed(() =>
        unref(post)?.post_content?.sort((a, b) => {
            return b.index - a.index;
        }).map((e) => (<NormalizedPostEntry> {
            ...e,
            author: unref(post)?.author,
            postId: unref(post)?.id,
        }))
    );

    const media = computed(() =>
        unref(post)?.post_content.flatMap((entry) =>
            entry.media.flatMap((media) => {
                const { data } = PostStorage().getPublicUrl(
                    [unref(post)?.author, unref(post)?.id, media]
                        .join("/"),
                );
                return { name: media, url: data.publicUrl };
            })
        )
    );

    const isAuthor = computed(() =>
        !unref(post)?.author ||
        (userStore.user && unref(post)?.author == userStore.user?.id)
    );

    return {
        postEntries,
        media,
        post: computed(() => unref(post)),
        isAuthor,
    };
};

export const useActivePost = () => {
    const postStore = usePostsStore();

    return usePost(computed(() => postStore.post));
};

export const useActivePostEntry = () => {
    const postStore = usePostEditStore();
    const post = computed(() => postStore.activePost);
    const entry = computed(() => postStore.activeEntry);
    const normalizedEntry = computed(() =>
        !postStore.activePost || !entry.value
            ? undefined
            : (<NormalizedPostEntry> {
                postId: postStore.activePost.id,
                author: postStore.activePost.author,
                ...entry.value,
            })
    );

    const { loadingMarkdown, markdown, media } = usePostEntry(normalizedEntry);

    return {
        loadingMarkdown,
        markdown,
        entry,
        post,
        media,
    };
};

export const usePostEntry = (
    entry: NormalizedPostEntry | Ref<NormalizedPostEntry | undefined>,
) => {
    const _markdown = ref<string>();
    const _markup = ref<string>();
    const loadingMarkdown = ref(false);
    const loadingMarkup = ref(false);

    const markdown = computed({
        get: () => {
            if (!unref(entry)) return "";
            if (typeof (_markdown.value) == "undefined") {
                loadingMarkdown.value = true;
                PostService.getEntryMarkdown(
                    unref(entry)!.postId,
                    unref(entry)!.id,
                )
                    .then((data) => {
                        _markdown.value = data;
                        loadingMarkdown.value = false;
                    });
            }
            return _markdown.value;
        },
        set: (nv) => {
            _markdown.value = nv;
        },
    });

    const markup = computed({
        get: () => {
            if (!unref(entry)) return "";
            if (typeof (_markup.value) == "undefined") {
                loadingMarkup.value = true;
                PostService.getEntryMarkup(
                    unref(entry)!.postId,
                    unref(entry)!.id,
                )
                    .then((data) => {
                        _markup.value = data;
                        loadingMarkup.value = false;
                    });
            }
            return _markup.value;
        },
        set: () => {
            _markup.value = undefined;
        },
    });

    const media = computed(() =>
        unref(entry)?.media.flatMap((media) => {
            const { data } = PostStorage().getPublicUrl(
                [
                    unref(entry)?.author,
                    unref(entry)?.postId,
                    media,
                ]
                    .join("/"),
            );
            return data.publicUrl;
        })
    );

    return {
        markdown,
        loadingMarkdown,
        markup,
        loadingMarkup,
        media,
    };
};
