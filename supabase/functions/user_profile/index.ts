// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "jsr:@supabase/supabase-js@2";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Database } from "../database_types.ts";
import { corsHeaders } from "../_shared/corsHeaders.ts";
import { getUser } from "../_shared/user.ts";
import { setup_user_profile } from "./table_setup.ts";
import { dbClient } from "../_shared/db.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method == "OPTIONS") {
    return new Response("", {
      headers: corsHeaders,
    });
  }

  const client = dbClient(req);

  try {
    const profile = await setup_user_profile(client);
    return new Response(
      JSON.stringify(profile),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (e) {
    console.error(e);
    console.trace(e);
    return new Response(JSON.stringify(e), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/user_profile' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjU0MzIxL2F1dGgvdjEiLCJzdWIiOiJhZDkzNDE5NC1lOTEyLTQwMjMtOTI1NC03OTFlMDI2MmZkYTMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzI4ODExODQ1LCJpYXQiOjE3Mjg4MDgyNDUsImVtYWlsIjoiZGdtb24ubWFpbEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcyODgwODI0NX1dLCJzZXNzaW9uX2lkIjoiZDBiYTdjMTQtMjdkYy00NDkyLTk4YWQtZTA3NjA3MDVlNzkzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.RXDTPVmeBA1EIi6LWnnNqhwIelccmSBNa46tVkYw5KA' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'


access_token:""

*/
