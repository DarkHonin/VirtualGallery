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
import { Client } from "../user_profile/common/common.ts";

console.log("Hello from Functions!");

export const imageParser = (client: Client) => ({
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
    const { data } = client.storage.from("uploads").getPublicUrl(
      [`posts`, href].join("/"),
    );

    return `<img src="${
      Deno.env.get("ENV") == "local"
        ? data.publicUrl.replace(
          "http://kong:8000",
          "http://127.0.0.1:54321",
        )
        : data.publicUrl
    }" alt="${text}" />`;
  },
});

Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", {
      headers: corsHeaders,
    });
  }
  try {
    const client = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const { lastPublish, postId } = await req.json();

    marked.use({
      extensions: [
        imageParser(client),
      ],
    });

    if (postId) {
      const { data, error } = await client.from("Posts").select("*").eq(
        "id",
        postId,
      ).lte(
        "publish",
        lastPublish ?? new Date().toISOString(),
      ).single();

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          ...data,
          content: marked.parse(data.content),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
          status: 200,
        },
      );
    } else {
      const { data, error } = await client.from("Posts").select("*").lte(
        "publish",
        lastPublish ?? new Date().toISOString(),
      ).limit(10).order("publish");

      if (error) {
        throw error;
      }

      data.forEach((post) => {
        post.content = marked.parse(post.content);
      });

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 200,
      });
    }
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

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/blog' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
