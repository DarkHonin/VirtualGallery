# !/bin/sh
echo on
supabaseTarget=supabase/functions/_shared/database_types.ts

supabase gen types --workdir src --local --lang typescript > $supabaseTarget
