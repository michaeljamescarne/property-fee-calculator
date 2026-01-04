-- Quick Database State Check
-- Run this in Supabase SQL Editor to see what's missing

-- Check 1: Does user_profiles table exist?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) THEN '✅ user_profiles table EXISTS'
        ELSE '❌ user_profiles table MISSING - Run: 20250112_auth_system_fixed.sql FIRST!'
    END as check_1;

-- Check 2: Does role column exist?
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'role'
        ) THEN '✅ role column EXISTS'
        ELSE '❌ role column MISSING - Run: 20250118_add_role_to_user_profiles.sql'
    END as check_2;

-- Check 3: Does your profile exist?
SELECT 
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles'
        ) THEN '⚠️ Cannot check - table does not exist'
        WHEN EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE email = 'michaeljamescarne@gmail.com'
        ) THEN '✅ Your profile EXISTS'
        ELSE '❌ Your profile MISSING - Need to create it'
    END as check_3;

-- Check 4: What's your current role? (if column exists)
SELECT 
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'role'
        ) THEN '⚠️ Cannot check - role column does not exist'
        WHEN NOT EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE email = 'michaeljamescarne@gmail.com'
        ) THEN '⚠️ Cannot check - profile does not exist'
        ELSE (
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
    END as check_4;

-- Summary: What needs to be done?
SELECT 
    '=== MIGRATION STATUS ===' as summary,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles')
        THEN '✅ Step 1: user_profiles table - DONE'
        ELSE '❌ Step 1: Run 20250112_auth_system_fixed.sql'
    END as step_1,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'role')
        THEN '✅ Step 2: role column - DONE'
        ELSE '❌ Step 2: Run 20250118_add_role_to_user_profiles.sql'
    END as step_2,
    CASE WHEN EXISTS (SELECT 1 FROM user_profiles WHERE email = 'michaeljamescarne@gmail.com')
        THEN '✅ Step 3: Your profile exists - DONE'
        ELSE '❌ Step 3: Create your profile (will be auto-created on next login, or run INSERT)'
    END as step_3,
    CASE WHEN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE email = 'michaeljamescarne@gmail.com' 
        AND role = 'admin'
    ) THEN '✅ Step 4: You are admin - DONE'
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_profiles' 
            AND column_name = 'role'
        ) THEN '⚠️ Step 4: Set role to admin (run UPDATE statement)'
        ELSE '⚠️ Step 4: Cannot set - role column missing'
    END as step_4;












