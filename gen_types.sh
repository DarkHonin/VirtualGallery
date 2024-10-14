# !/bin/sh
echo on
supabaseTarget=supabase/functions/database_types.ts
vueTarget=src/db/database.types.ts

supabase gen types --local --lang typescript > $supabaseTarget
cat $supabaseTarget > $vueTarget