-- ============================================
-- SET ADMIN ROLE FOR YOUR USER
-- Run this in your Supabase SQL Editor
-- ============================================

-- Step 1: Check if your user exists in user_profiles
SELECT 
    id, 
    email, 
    role,
    created_at,
    last_login_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- Step 2: If the user exists, set their role to admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'michaeljamescarne@gmail.com';

-- Step 3: Verify the update worked
SELECT 
    id, 
    email, 
    role,
    created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- You should see role = 'admin' in the result

-- ============================================
-- If the user doesn't exist, they will be created
-- automatically when they log in next time.
-- After they log in, run the UPDATE query above
-- to set their role to admin.
-- ============================================


