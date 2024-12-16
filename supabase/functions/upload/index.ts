// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "@header";
import { dbClient } from "@db";
import { multiParser, Form, FormFile } from 'https://deno.land/x/multiparser/mod.ts'
import {
  BlobReader,
  BlobWriter,
  ZipReader,
  TextReader,
  TextWriter
} from "https://deno.land/x/zipjs/index.js";
import { Database } from "@types";
import { PostTable } from "@post";



console.log("Hello from Functions!")



Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  const client = dbClient(req);
  const {
    data: {user},
  } = await client.auth.getUser();
  if(!user) throw 401

  const form = await multiParser(req)
  if(!form || !form.files) throw "No file"
  const archive = (<FormFile>form.files['file'])
  const zipBlob = new BlobReader(new Blob([archive.content], {type: archive.contentType}));
  const zipFileReader = new ZipReader(zipBlob)

  const enrties = Object.fromEntries((await zipFileReader.getEntries()).map(e => [e.filename, e]))
  if(!enrties['manifest.json']) throw "No Manifest found"

  
  const textWriter = new TextWriter()

  const manifsetData: Database['public']['Tables']['Posts']['Insert'] = await (async () => {
    const rawJson = await enrties['manifest.json'].getData!(textWriter)
    delete enrties['manifest.json'];
    return <Database['public']['Tables']['Posts']['Insert']>JSON.parse(rawJson)
  })()

  const {data: post, error} = await PostTable(client).insert({...manifsetData, author: user.id}).select().single()
  if(error) throw error

  console.log(post)

  await Promise.all(Object.entries(enrties).map(async ([filename, file]) => {
    const blobWriter = new BlobWriter()
    const blob = await file.getData!(blobWriter)
    const path = `${user.id}/${post.id}/${filename}`

    const {data, error} = await client.storage.from('uploads').upload(path, blob)
    if(error) throw error
    console.log(filename, data)
  }))

  await zipFileReader.close()

  return new Response("OK", {
    headers: corsHeaders
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/upload' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
