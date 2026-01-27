-- ============================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR
-- ============================================
-- This will add the role column and set your account as admin
-- ============================================

-- Step 1: Add role column if it doesn't exist
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
        
        RAISE NOTICE 'Role column added successfully';
    ELSE
        RAISE NOTICE 'Role column already exists';
    END IF;
END $$;

-- Step 2: Set your account as admin
-- Replace 'michaeljamescarne@gmail.com' with your actual email if different
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'michaeljamescarne@gmail.com';

-- Step 3: Verify it worked
SELECT 
    id, 
    email, 
    role, 
    created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- You should see a row with role = 'admin'
-- If you see role = 'user' or NULL, the UPDATE didn't work - check your email address













