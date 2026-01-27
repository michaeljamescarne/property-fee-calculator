# Database Migration Checklist

## Quick Check: What Migrations Have Been Run?

Run this SQL script in Supabase SQL Editor to check your database state:

**File**: `docs/CHECK_DATABASE_STATE.sql`

Or copy the contents and run in Supabase → SQL Editor.

## Required Migrations (In Order)

### 1. ✅ Create user_profiles table

**File**: `supabase/migrations/20250112_auth_system_fixed.sql`

**Status Check**:

```sql
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
);
```

**If FALSE**: Run `20250112_auth_system_fixed.sql` first!

### 2. ✅ Add role column to user_profiles

**File**: `supabase/migrations/20250118_add_role_to_user_profiles.sql`

**Status Check**:

```sql
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
    AND column_name = 'role'
);
```

**If FALSE**: Run `20250118_add_role_to_user_profiles.sql`

### 3. ⚠️ Create cost_benchmarks table (Optional for admin access)

**File**: `supabase/migrations/20250118_create_cost_benchmarks.sql`

**Status Check**:

```sql
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'cost_benchmarks'
);
```

### 4. ⚠️ Create macro_benchmarks table (Optional for admin access)

**File**: `supabase/migrations/20250118_create_macro_benchmarks.sql`

**Status Check**:

```sql
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'macro_benchmarks'
);
```

## Migration Order

**CRITICAL**: Run migrations in this exact order:

1. ✅ `20250112_auth_system_fixed.sql` - Creates `user_profiles` table
2. ✅ `20250118_add_role_to_user_profiles.sql` - Adds `role` column
3. ⚠️ `20250118_create_cost_benchmarks.sql` - Creates cost benchmarks table
4. ⚠️ `20250118_create_macro_benchmarks.sql` - Creates macro benchmarks table
5. ⚠️ `20250118_seed_cost_benchmarks.sql` - Seeds cost benchmark data
6. ⚠️ `20250118_seed_macro_benchmarks.sql` - Seeds macro benchmark data

## Quick Diagnostic

Run this to see what's missing:

```sql
-- Quick check
SELECT
    'user_profiles table' as item,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING - Run 20250112_auth_system_fixed.sql'
    END as status
UNION ALL
SELECT
    'role column',
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'role')
        THEN '✅ EXISTS'
        ELSE '❌ MISSING - Run 20250118_add_role_to_user_profiles.sql'
    END
UNION ALL
SELECT
    'cost_benchmarks table',
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cost_benchmarks')
        THEN '✅ EXISTS'
        ELSE '⚠️ MISSING - Optional'
    END
UNION ALL
SELECT
    'macro_benchmarks table',
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'macro_benchmarks')
        THEN '✅ EXISTS'
        ELSE '⚠️ MISSING - Optional'
    END;
```

## Your Current Error

Based on your diagnostic output:

```
error: 'column user_profiles.role does not exist'
```

This means:

- ✅ `user_profiles` table EXISTS (otherwise you'd get "relation does not exist")
- ❌ `role` column DOES NOT EXIST

**Solution**: Run `20250118_add_role_to_user_profiles.sql`

## If user_profiles Table Doesn't Exist

If you get "relation user_profiles does not exist", then you need to run:

1. **First**: `20250112_auth_system_fixed.sql` - Creates the table
2. **Then**: `20250118_add_role_to_user_profiles.sql` - Adds the role column
3. **Then**: Set your role to admin:

```sql
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'michaeljamescarne@gmail.com';
```

## Verification After Running Migrations

```sql
-- 1. Check table exists
SELECT * FROM user_profiles LIMIT 1;

-- 2. Check role column exists
SELECT id, email, role FROM user_profiles WHERE email = 'michaeljamescarne@gmail.com';

-- 3. Verify your admin role
SELECT
    email,
    role,
    CASE
        WHEN role = 'admin' THEN '✅ You are an admin'
        ELSE '❌ Role is: ' || COALESCE(role, 'NULL')
    END as status
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';
```











