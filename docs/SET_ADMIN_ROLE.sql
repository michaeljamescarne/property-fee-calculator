-- Set Admin Role for User
-- Run this in your production Supabase SQL Editor

-- Replace 'michaeljamescarne@gmail.com' with your actual email
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'michaeljamescarne@gmail.com';

-- Verify the update
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- If the role column doesn't exist, run the migration first:
-- supabase/migrations/20250118_add_role_to_user_profiles.sql



