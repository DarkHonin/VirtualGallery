import { supabase } from "@/db/index.db";

type AvailableEndpoint =
    | "user_profile"
    | "markdown_gen"
    | "vue-signin"
    | "tumblr_oauth";

export const api = async (
    endpoint: AvailableEndpoint,
    opts?: any,
) => {
    const { data, error } = await supabase.functions.invoke(endpoint, {
        body: opts,
    });
    if (error) throw error;
    return data;
};
