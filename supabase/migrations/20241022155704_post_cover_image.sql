alter table "public"."Posts" add column "author" uuid not null;

alter table "public"."Posts" add column "cover_image" varchar;

alter table "public"."Posts" add constraint "Posts_author_fkey" FOREIGN KEY (author) REFERENCES auth.users(id) not valid;

alter table "public"."Posts" validate constraint "Posts_author_fkey";

alter table "public"."Posts" add column "last_updated" timestamp with time zone;

alter table "public"."Posts" alter column "cover_image" set data type text using "cover_image"::text;
