import SupabaseClient from "https://jsr.io/@supabase/supabase-js/2.45.4/src/SupabaseClient.ts";
import { Database } from "../../database_types.ts";

export type Client = SupabaseClient<Database>;
