import type { Post } from "@/db/post.model";

export const genPostMockData = (): Post => ({
    author: crypto.randomUUID(),
    post_content: [],
    title: `Mock Post ${Math.round(Math.random() * 100)}`,
    created_at: new Date(Date.now()).toISOString(),
});
