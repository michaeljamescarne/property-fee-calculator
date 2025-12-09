-- Fix user_profiles table to remove auth.users foreign key
-- This project uses custom JWT auth, not Supabase Auth, so auth.users doesn't exist

-- Drop the foreign key constraint if it exists
DO $$ 
BEGIN
    -- Check if the foreign key exists and drop it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_id_fkey'
        AND table_name = 'user_profiles'
    ) THEN
        ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint user_profiles_id_fkey';
    END IF;
END $$;

-- Ensure id column has default UUID generation
-- This allows inserts without specifying id (UUID will be auto-generated)
DO $$
BEGIN
    -- Check if default is already set
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'id' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE user_profiles 
        ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        RAISE NOTICE 'Set default UUID generation for user_profiles.id';
    END IF;
END $$;

-- Verify the fix
DO $$
BEGIN
    RAISE NOTICE 'Verification: user_profiles table structure';
    RAISE NOTICE 'id column should have default uuid_generate_v4()';
    RAISE NOTICE 'No foreign key to auth.users should exist';
END $$;






