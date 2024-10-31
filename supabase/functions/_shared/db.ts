import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database_types.ts";

export type Client = SupabaseClient<Database>;

export const dbClient = (req: Request) => {
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
