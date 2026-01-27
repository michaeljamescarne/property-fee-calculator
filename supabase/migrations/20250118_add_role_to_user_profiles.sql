-- Add role column to user_profiles table
-- This migration adds the role column needed for admin access control

-- Add role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;
        
        -- Create index for role lookups
        CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
        
        -- Add check constraint to ensure role is either 'user' or 'admin'
        ALTER TABLE user_profiles 
        ADD CONSTRAINT check_role_value 
        CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Update RLS policy to allow admins to read all profiles (for admin panel)
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles"
    ON user_profiles FOR SELECT
    USING (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile"
    ON user_profiles FOR UPDATE
    USING (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Comment for documentation
COMMENT ON COLUMN user_profiles.role IS 'User role: "user" (default) or "admin" (full access)';














