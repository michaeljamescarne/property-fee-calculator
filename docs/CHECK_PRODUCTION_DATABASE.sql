-- ============================================
-- DIAGNOSTIC QUERIES FOR PRODUCTION DATABASE
-- Run these in your PRODUCTION Supabase SQL Editor
-- ============================================

-- 1. Check if role column exists
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
AND column_name = 'role';

-- Expected result: Should show one row with role column
-- If no rows: Column doesn't exist - you need to run the migration

-- 2. Check all columns in user_profiles table
SELECT 
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. Check your user profile
SELECT 
    id, 
    email, 
    role,
    created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- 4. Check if role column exists (alternative method)
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'role'
) as role_column_exists;

-- If role_column_exists = false, you MUST run the migration:
-- supabase/migrations/20250118_add_role_to_user_profiles.sql













