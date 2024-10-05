import { supabase } from "@/db/index.db";
import { type Post, type PostPreview, PostTable } from "@/db/post.model";
import { api } from "./index.service";

export default {
    updatePost: (post: Post) => {
        if (!post.id) {
            return PostTable().insert(post);
        }
        return PostTable().update(post).eq("id", post.id);
    },
    readPost: async (target: number | PostPreview): Promise<Post> => {
        const { data, error } = await PostTable().select().eq(
            "id",
            typeof target == "number" ? target : target.id,
        )
            .single();

        if (error) throw error;
        return data;
    },
    readPosts: async (): Promise<PostPreview[]> => {
        const { data, error } = await PostTable().select(
            "id,title, created_at, media",
        );

        if (error) throw error;
        return data;
    },
    deletePost: async (id: number) => {
        const { data, status, error } = await PostTable().delete().eq("id", id);
        if (status !== 204) throw error;
        return true;
    },
    renderContent: async (postId: number): Promise<string> => {
        const data = await api("markgown_gen", {
            body: JSON.stringify({ postId }),
        });
        console.log(data);
        return data;
    },
};
