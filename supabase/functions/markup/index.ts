
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { dbClient } from "@db";
import { corsHeaders } from "@header";
import { getUserSession } from "@user";
import { PostTable } from "@post";
import {marked} from '@markdown'
import { Client } from "@db";


export const imageParser = (folder: string, client: Client) => ({
  // name: "image",
  // level: "inline", // Is this a block-level or inline-level tokenizer?
  image(
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
    console.log("AAAAAAH")
    const { data } = client.storage.from("uploads").getPublicUrl(
      [folder, href].join("/"),
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



// Expects post and entry id's

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


    if(searchError) throw searchError
    if(!(<any[]>matchingFiles).some(e => e.name == entryId)) throw (404)

    const {data: download, error: downloadError} = await client.storage.from('uploads').download(`${path}/${entryId}`)
    if(downloadError) throw downloadError

    const raw = await download.text()

    marked.use({renderer: imageParser(path, client)})

    return new Response(
      await marked.parse(await raw),
      { headers: { "Content-Type": "text/html", ...corsHeaders } },
    );
  } catch (e) {
    console.error(e)
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

