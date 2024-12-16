import { supabase } from "@/db/index.db";

type AvailableEndpoint = {
    "markdown"(args: {
        postId: number;
        entryId: string;
    }): string;
    "markup"(args: { postId: number; entryId: string }): string;
    "download"(args: {
        postId: number;
    }): Blob;
    "upload"(args: FormData): void;
};

export const api = async <t extends keyof AvailableEndpoint>(
    endpoint: t,
    opts?: Parameters<AvailableEndpoint[t]>[0],
): Promise<ReturnType<AvailableEndpoint[t]>> => {
    const { data, error } = await supabase.functions.invoke(endpoint, {
        body: opts,
    });
    if (error) throw error;
    return data;
};
