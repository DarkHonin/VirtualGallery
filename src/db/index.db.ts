import type { Database } from "+/database_types.ts";
import { createClient } from "@supabase/supabase-js";
export type { Database };

export const supabase = createClient<Database>(
    import.meta.env["VITE_SUPABASE_URL"],
    import.meta.env["VITE_SUPABASE_ANNON_KEY"],
);
