# Database Environment Review

## Current Setup

### Environment Configuration

- **Local**: Uses `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` pointing to your local/dev Supabase project
- **Production**: Uses Vercel environment variables with `NEXT_PUBLIC_SUPABASE_URL` pointing to your production Supabase project

### Should You Have Separate Tables?

**YES - You should have separate Supabase projects (and therefore separate databases/tables) for:**

1. **Local Development** - Your local Supabase project
2. **Production** - Your production Supabase project

This is the **correct and recommended** approach.

## Issues Found

### Issue 1: Table Structure Problem

The `user_profiles` table migration has a foreign key reference that doesn't work with your custom auth:

```sql
-- CURRENT (PROBLEMATIC):
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ...
);
```

**Problem**: Your project uses **custom JWT authentication**, not Supabase Auth. The `auth.users` table doesn't exist, so this foreign key will fail.

**Solution**: Remove the foreign key reference:

```sql
-- CORRECT:
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ...
);
```

### Issue 2: User ID Generation

In `verify-code/route.ts`, when creating a new user, it doesn't specify an `id`:

```typescript
// CURRENT:
const { data: newProfile } = await supabase.from("user_profiles").insert({
  email,
  subscription_status: "free",
  calculations_count: 0,
} as never);
```

**Problem**: If the table has `id UUID PRIMARY KEY REFERENCES auth.users(id)`, this will fail because:

1. No `id` is provided
2. `auth.users` doesn't exist
3. The foreign key constraint will fail

**Solution**: Either:

- Remove the foreign key (recommended)
- Or generate a UUID and set it explicitly

## Recommended Fix

### Step 1: Fix the Migration

Update `supabase/migrations/20250112_auth_system_fixed.sql`:

```sql
-- FIXED: Remove foreign key reference to auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Changed: removed REFERENCES auth.users(id)
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    subscription_status subscription_status DEFAULT 'free' NOT NULL,
    subscription_tier TEXT,
    calculations_count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Step 2: Update RLS Policies

The RLS policies reference `auth.uid()` which won't work with custom JWT:

```sql
-- CURRENT (WON'T WORK):
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);
```

**Problem**: `auth.uid()` returns NULL with custom JWT auth.

**Solution**: RLS policies need to be updated or disabled for custom auth. Since you're using service role key in API routes, RLS is bypassed anyway, but the policies should be fixed.

### Step 3: Verify Separate Databases

**Local Environment**:

- `.env.local` should point to your **development Supabase project**
- Example: `NEXT_PUBLIC_SUPABASE_URL=https://dev-xxxxx.supabase.co`

**Production Environment**:

- Vercel environment variables should point to your **production Supabase project**
- Example: `NEXT_PUBLIC_SUPABASE_URL=https://prod-xxxxx.supabase.co`

## Why Separate Databases?

✅ **Data Isolation**: Development data doesn't affect production
✅ **Testing**: Safe to test migrations and changes
✅ **Security**: Production data is protected
✅ **Performance**: No risk of dev queries affecting production
✅ **Compliance**: Easier to manage data retention policies

## Current Problem

The error you're seeing:

```
PGRST116: The result contains 0 rows
```

This happens because:

1. User logged in **locally** → Got JWT with user ID from **local database**
2. User tries to use that JWT in **production** → Production database doesn't have that user ID
3. Session API tries to find user → **0 rows found**

## Solutions

### Solution 1: Auto-Create Profile (Already Implemented)

✅ I've already added code to auto-create the profile if missing. This will fix the immediate issue.

### Solution 2: Fix Table Structure (Recommended)

Update the migration to remove the `auth.users` foreign key reference.

### Solution 3: Ensure Separate Databases

Verify that local and production use different Supabase projects.

## Action Items

1. **Check your Supabase projects**:
   - Local `.env.local`: Which Supabase project URL?
   - Production Vercel env vars: Which Supabase project URL?
   - They should be **different projects**

2. **Fix the migration** (if not already done):
   - Remove `REFERENCES auth.users(id)` from `user_profiles` table
   - Update RLS policies to work with custom auth (or disable them)

3. **Run migration in production**:
   - Ensure the fixed migration has been run in your production Supabase project
   - Check that `user_profiles` table exists and has correct structure

4. **Test**:
   - Log in fresh in production (clear cookies)
   - Profile should be created automatically
   - Session should work

## Verification Queries

Run these in your Supabase SQL Editor to verify:

```sql
-- Check table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check if foreign key exists (should NOT exist)
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'user_profiles';

-- Check user count
SELECT COUNT(*) as user_count FROM user_profiles;
```











