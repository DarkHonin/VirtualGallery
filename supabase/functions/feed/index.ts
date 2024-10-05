// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../DBTypes.ts";
import { corsHeaders } from "../headers.ts";
console.log("Hello from Functions!");

interface QueryParams {
  title?: string;
  startTime?: string;
  endTime?: string;
}

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Unsupported Method", {
      status: 400,
    });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );
    const { data, error } = await supabase.from("Posts").select("*");

    if (error || !data) {
      throw error;
    }

    const generated = data.map((e) => ({
      ...e,
      markup: marked.parse(e.content),
    }));

    console.log(data);

    return new Response(JSON.stringify(generated), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      status: 200,
    });
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/posts' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
