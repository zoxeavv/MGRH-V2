-- Migration: Rename users table to crm_users to avoid conflict with Supabase auth.users
-- This migration handles the case where the table might already exist

-- First, check if the old 'users' table exists and rename it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) THEN
        -- Rename the table
        ALTER TABLE IF EXISTS public.users RENAME TO crm_users;
        RAISE NOTICE 'Table "users" renamed to "crm_users"';
    ELSE
        RAISE NOTICE 'Table "users" does not exist, skipping rename';
    END IF;
END $$;

-- Create the crm_users table if it doesn't exist (in case migration runs on fresh DB)
CREATE TABLE IF NOT EXISTS public.crm_users (
    id uuid PRIMARY KEY,
    email text NOT NULL UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

-- Update the trigger name if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM pg_trigger 
        WHERE tgname = 'set_public_users_updated_at'
    ) THEN
        DROP TRIGGER IF EXISTS set_public_users_updated_at ON public.crm_users;
        CREATE TRIGGER set_public_crm_users_updated_at
        BEFORE UPDATE ON public.crm_users
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
        RAISE NOTICE 'Trigger updated for crm_users table';
    END IF;
END $$;

-- Create trigger if it doesn't exist
DO $$ BEGIN
    CREATE TRIGGER set_public_crm_users_updated_at
    BEFORE UPDATE ON public.crm_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;
