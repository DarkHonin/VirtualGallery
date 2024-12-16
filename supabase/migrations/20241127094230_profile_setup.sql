create table "public"."Profiles" (
    id UUID REFERENCES auth.users NOT NULL,
    PRIMARY KEY (id)
);

alter table "public"."Profiles" enable row level security;

CREATE POLICY
  "Can only view own profile data."
  ON public."Profiles"
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY
  "Can only update own profile data."
  ON public."Profiles"
  FOR UPDATE
  USING (auth.uid() = id);


CREATE FUNCTION
  public.create_profile_for_new_user()
  RETURNS TRIGGER AS
  $$
  BEGIN
    raise log 'Creating new profile for %', NEW.id;
    INSERT INTO public."Profiles" ( id )
    VALUES (NEW.id);

    insert into storage.objects
    (bucket_id, name)
    values
    ('uploads', NEW.id || '/.temp');

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TRIGGER
  create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.create_profile_for_new_user();

