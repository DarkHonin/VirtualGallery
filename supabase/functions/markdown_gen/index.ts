// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import {
  marked,
  Renderer,
} from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database_types.ts";

import { corsHeaders } from "../headers.ts";

console.log("Hello from Functions!");

const imageParserRegex = /!\[(?<alt_text>.+?)\]\((?<src>.+?)\)/;

export const imageParser = (media: { [mediaName: string]: string }) => ({
  name: "image",
  level: "inline", // Is this a block-level or inline-level tokenizer?
  renderer(
    {
      href,
      text,
      title,
    }: {
      href: string;
      text: string;
      title: string;
    },
  ) {
    return `<img src="${media[href]}" alt="${text}" />`;
  },
});

Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", {
      headers: corsHeaders,
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
    const { postId } = await req.json();
    const { data, error } = await supabase.from("Posts").select("*").eq(
      "id",
      postId,
    ).single();

    if (error || !data.content) {
      throw error;
    }

    const media = Object.fromEntries(data.media.map((name) => {
      const { data } = supabase.storage.from("uploads").getPublicUrl(
        [`posts`, name].join("/"),
      );
      return [
        name,
        Deno.env.get("ENV") == "local"
          ? data.publicUrl.replace(
            "http://kong:8000",
            "http://127.0.0.1:54321",
          )
          : data.publicUrl,
      ];
    }));

    marked.use({
      extensions: [
        imageParser(media),
      ],
    });

    return new Response(JSON.stringify(marked.parse(data.content)), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/markgown_gen' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
