-- Database State Check Script
-- Run this in Supabase SQL Editor to check what migrations have been applied

-- 1. Check if user_profiles table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) THEN '✅ user_profiles table EXISTS'
        ELSE '❌ user_profiles table DOES NOT EXIST - Need to run: 20250112_auth_system_fixed.sql'
    END as table_check;

-- 2. Check if role column exists in user_profiles
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'role'
        ) THEN '✅ role column EXISTS'
        ELSE '❌ role column DOES NOT EXIST - Need to run: 20250118_add_role_to_user_profiles.sql'
    END as role_column_check;

-- 3. Check user_profiles table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 4. Check if cost_benchmarks table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'cost_benchmarks'
        ) THEN '✅ cost_benchmarks table EXISTS'
        ELSE '❌ cost_benchmarks table DOES NOT EXIST - Need to run: 20250118_create_cost_benchmarks.sql'
    END as cost_benchmarks_check;

-- 5. Check if macro_benchmarks table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'macro_benchmarks'
        ) THEN '✅ macro_benchmarks table EXISTS'
        ELSE '❌ macro_benchmarks table DOES NOT EXIST - Need to run: 20250118_create_macro_benchmarks.sql'
    END as macro_benchmarks_check;

-- 6. Check your user profile (if table exists)
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) THEN (
            SELECT 
                CASE 
                    WHEN COUNT(*) > 0 THEN '✅ Profile EXISTS for michaeljamescarne@gmail.com'
                    ELSE '❌ Profile DOES NOT EXIST - Need to create profile'
                END
            FROM user_profiles
            WHERE email = 'michaeljamescarne@gmail.com'
        )
        ELSE '⚠️ Cannot check - user_profiles table does not exist'
    END as profile_check;

-- 7. Check your role (if profile exists)
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) AND EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'role'
        ) THEN (
            SELECT 
                CASE 
                    WHEN role = 'admin' THEN '✅ Role is ADMIN'
                    WHEN role = 'user' THEN '⚠️ Role is USER (not admin)'
                    WHEN role IS NULL THEN '❌ Role is NULL'
                    ELSE '⚠️ Role is: ' || role
                END
            FROM user_profiles
            WHERE email = 'michaeljamescarne@gmail.com'
        )
        ELSE '⚠️ Cannot check - table or role column missing'
    END as role_check;

-- 8. List all migrations that should be run (summary)
SELECT 
    'Migration Checklist' as section,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles')
        THEN '✅ 20250112_auth_system_fixed.sql (user_profiles table)'
        ELSE '❌ 20250112_auth_system_fixed.sql (user_profiles table) - REQUIRED'
    END as migration_1,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'role')
        THEN '✅ 20250118_add_role_to_user_profiles.sql (role column)'
        ELSE '❌ 20250118_add_role_to_user_profiles.sql (role column) - REQUIRED'
    END as migration_2,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cost_benchmarks')
        THEN '✅ 20250118_create_cost_benchmarks.sql'
        ELSE '⚠️ 20250118_create_cost_benchmarks.sql (optional for admin page)'
    END as migration_3,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'macro_benchmarks')
        THEN '✅ 20250118_create_macro_benchmarks.sql'
        ELSE '⚠️ 20250118_create_macro_benchmarks.sql (optional for admin page)'
    END as migration_4;












