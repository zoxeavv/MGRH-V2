DO $$ BEGIN
    CREATE SCHEMA IF NOT EXISTS public;
END $$;

CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY,
    email text NOT NULL UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

DO $$ BEGIN
    ALTER TABLE public.users
        ADD CONSTRAINT users_id_fkey
        FOREIGN KEY (id)
        REFERENCES auth.users (id)
        ON DELETE CASCADE;
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'auth.users table not found; please ensure Supabase auth schema is available before adding foreign key.';
    WHEN duplicate_object THEN
        NULL;
END $$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER set_public_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;
