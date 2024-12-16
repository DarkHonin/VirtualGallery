// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { dbClient } from "@db";
import { corsHeaders } from "@header";
import { getUserSession } from "@user";
import { PostTable } from "@post";
console.log("Hello from Functions!");



Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  const { postId, entryId }: {
    postId: number;
    entryId: string;
  } = await req.json();
  try {
    if (!postId || isNaN(postId) || !entryId) throw 404;


    const client = dbClient(req);

    const {data: post, error: postError} = await PostTable(client).select().eq('id', postId).single()

    if(postError){
      throw postError
    }

    const path = `${post.author}/${postId}`;

  
    const {data: matchingFiles, error: searchError} = await client.storage.from('uploads').list(path)
    console.log(path, matchingFiles)


    if(searchError) throw searchError
    if(!(<any[]>matchingFiles).some(e => e.name == entryId)) throw (404)

    const {data: download, error: downloadError} = await client.storage.from('uploads').download(`${path}/${entryId}`)
    if(downloadError) throw downloadError

    return new Response(
      await download.text(),
      { headers: { "Content-Type": "text/markdown", ...corsHeaders } },
    );
  } catch (e) {
    if (typeof(e) == "number") {
      if(e == 404)
        return new Response("", {
          headers: {
            ...corsHeaders,
          },
        });    
      return new Response("", {
        headers: {
          ...corsHeaders,
        },
        status: e,
      });
    }
    else
    return new Response(JSON.stringify(e), {
      headers: {
        ...corsHeaders,
      },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/markdown' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
