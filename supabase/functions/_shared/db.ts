import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js";
import type { Database } from "./database_types.ts";

export type Client = SupabaseClient<Database>;

export const dbClient = (req: Request): Client => {
    return createClient<Database>(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        },
    );
};
