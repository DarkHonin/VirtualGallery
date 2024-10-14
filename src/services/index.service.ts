import { supabase } from "@/db/index.db";

type AvailableEndpoint = "user_profile" | "markdown_gen" | "vue-signin";

export const api = async (
    endpoint: AvailableEndpoint,
    opts?: any,
) => {
    const { data, error } = await supabase.functions.invoke(endpoint, opts);
    if (error) throw error;
    return data;
};
