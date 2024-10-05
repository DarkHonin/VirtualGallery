import * as imagescript from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "./DBTypes.ts";

const mosaicImages = (imagePaths: string[]) => {
    const supabase = createClient<Database>(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {},
        },
    );
};
