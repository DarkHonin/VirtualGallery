import { supabase } from "@/db/index.db";
import {
    type Post,
    type PostEntry,
    PostStorage,
    PostTable,
} from "@/db/post.model";
import { api } from "./index.service";
import { useUserStore } from "@/stores/User.store";
import { DEBUG_POST_EDIT } from "@/utils/Flags.list";
import { useDebugLogger } from "@/utils/Debug.logger";
import { debugTimeout } from "@/utils/Timeout.debug";
import { MACK_DATA, useEnvironmentFlag } from "@/utils/env.flags";
import { genPostMockData } from "./mock.data";

const log = useDebugLogger(DEBUG_POST_EDIT);

type FieldFetchObject<t extends (keyof Post)> = {
    [k in t]: Post[k];
};

export default {
    createPost: async (title: string): Promise<Post> => {
        log(`Creating post \\w title: ${title}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        const userStore = useUserStore();
        const newPost: Post = {
            title,
            author: userStore.user!.id,
            post_content: [],
        };

        const { data, error } = await PostTable().insert(newPost).select()
            .single();
        if (error) throw error;

        return <Post> data;
    },

    getPosts: async () => {
        log(`Fetching all post by ID`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        const { data, error } = await PostTable().select().order("created_at", {
            ascending: false,
        });
        if (error) {
            throw error;
        }
        return <Post[]> data;
    },

    getPost: async (id: number): Promise<Post> => {
        log(`Fetching post by ID: ${id}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        if (MACK_DATA) return genPostMockData();

        const { data, error } = await PostTable().select().eq("id", id)
            .single();
        if (error) throw error;

        return <Post> data;
    },

    getPostField: async <t extends (keyof Post)>(id: number, ...args: t[]) => {
        const { data, error } = await PostTable().select(
            [...args, "id"].join(", "),
        ).eq(
            "id",
            id,
        ).single();

        if (error) throw error;

        return data as any as FieldFetchObject<t | "id">;
    },

    getLatest: async (): Promise<Post> => {
        log(`Fetching Latest post`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);
        const { data, error } = await PostTable().select().order("created_at", {
            ascending: false,
        }).limit(1)
            .single();
        if (error) throw error;

        return <Post> data;
    },

    savePost: async (post: Post) => {
        log(`Saving post: ${post.id}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        const { data, error } = await PostTable().update(post).eq(
            "id",
            post.id!,
        ).select()
            .single();
        if (error) throw error;

        return <Post> data;
    },

    deletePost: async (postId: number) => {
        log(`Deleting post: ${postId}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        const { data, error } = await PostTable().delete().eq(
            "id",
            postId!,
        ).select();
        if (error) throw error;
    },

    getEntryMarkdown: async (postId: number, entryId: string) => {
        log(`Fetching markdown for: ${postId} -> ${entryId}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        return api("markdown", { postId, entryId });
    },

    getEntryMarkup: async (postId: number, entryId: string) => {
        log(`Fetching markup for: ${postId} -> ${entryId}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        return api("markup", { postId, entryId });
    },

    saveEntryMarkdown: async (filePath: string, markdown: string) => {
        log(`Saving markdown for: ${filePath}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);
        await PostStorage().upload(
            filePath,
            new Blob([markdown], {
                type: "text/markdown",
            }),
            { contentType: "text/markdown", upsert: true },
        );
    },

    createPostEntry: async (post: Post) => {
        const entryId = crypto.randomUUID();

        log(`Creating entry to post: ${post.id}`);
        await debugTimeout(DEBUG_POST_EDIT, 5000);

        const entry: PostEntry = {
            timestamp: new Date(Date.now()).toISOString(),
            media: [],
            title: "",
            id: crypto.randomUUID(),
            index: post.post_content.length,
        };

        const userStore = useUserStore();

        const path = [userStore.user!.id, post.id!, entryId].join("/");

        const { data: fileCreate, error: fileCreateError } = await PostStorage()
            .upload(path, "", {
                contentType: "text/markdown",
            });
        if (fileCreateError) throw fileCreateError;

        const { data, error } = await PostTable().update({
            post_content: [...post.post_content, entry],
        }).eq(
            "id",
            post.id!,
        ).select();

        if (error) throw error;

        console.log(data);

        return entry;
    },
};
