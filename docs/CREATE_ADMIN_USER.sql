-- ============================================
-- MANUALLY CREATE ADMIN USER PROFILE
-- Run this in your Supabase SQL Editor
-- ============================================
-- Use this if automatic profile creation isn't working
-- ============================================

-- Step 1: Create the user profile with admin role
INSERT INTO user_profiles (
    id,
    email,
    subscription_status,
    calculations_count,
    role,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(), -- Generate a new UUID for the user
    'michaeljamescarne@gmail.com',
    'free',
    0,
    'admin', -- Set as admin immediately
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
    role = 'admin',
    updated_at = NOW();

-- Step 2: Verify the user was created
SELECT 
    id, 
    email, 
    role,
    subscription_status,
    created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- You should see your user with role = 'admin'

-- ============================================
-- Note: After creating the profile, you'll need to:
-- 1. Log in using the magic code
-- 2. The session will use the email to find your profile
-- 3. Admin access should work
-- ============================================











