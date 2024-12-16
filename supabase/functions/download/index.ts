// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "@header";
import { dbClient } from "@db";
import { PostTable } from "@post";
import {
  HttpReader,
  BlobWriter,
  ZipWriter,
  TextReader
} from "https://deno.land/x/zipjs/index.js";

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  const { postId }: {
    postId: number;
  } = await req.json();
  try {
    if (!postId || isNaN(postId)) throw 404;


    const client = dbClient(req);

    
    
    const {data: post, error: postError} = await PostTable(client).select().eq('id', postId).single()
    
    if(postError){
      throw postError
    }
    
    const path = `${post.author}/${postId}`;

    const {data: matchingFiles, error: searchError} = await client.storage.from('uploads').list(path)

    
    const zipFile = new ZipWriter(new BlobWriter("application/zip"));

    console.log("Files", matchingFiles)

    await Promise.all([...matchingFiles].map(async e => {
      if(e.name.startsWith('.')) return
      const {data, error} = await client.storage.from('uploads').getPublicUrl(`${path}/${e.name}`)
      if(error) throw error
      console.log("Zipping", data.publicUrl)
      return await zipFile.add(e.name, new HttpReader(data.publicUrl))
    }))

    const {created_at, post_content, title} = post
    
    await zipFile.add('manifest.json', new TextReader(JSON.stringify({created_at, post_content, title})))

    const blob = await zipFile.close()

    return new Response(await (await blob).arrayBuffer(), {
      headers: {
        ...corsHeaders,
        "content-type": "application/octet-stream"
      }
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify(e), {
      headers: {
        ...corsHeaders,
      },
      status: 500,
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/download' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
