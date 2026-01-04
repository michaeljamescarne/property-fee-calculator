# Quick Fix: Add Role Column to user_profiles

## Problem

You're getting: `column user_profiles.role does not exist`

This means the `role` column migration hasn't been run on your production database yet.

## Solution: Run the Migration

### Step 1: Go to Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your **production project** (not local/staging)
3. Navigate to **SQL Editor** (left sidebar)

### Step 2: Run the Migration

1. Click **"New Query"** button
2. Copy and paste this entire SQL script:

```sql
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
```

3. Click **"Run"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
4. ✅ Should see: "Success. No rows returned"

### Step 3: Set Yourself as Admin

After the migration runs, set your role to admin:

```sql
-- Set your email as admin
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'michaeljamescarne@gmail.com';

-- Verify the update
SELECT id, email, role, created_at, updated_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';
```

**Expected result**: Should show `role = 'admin'`

### Step 4: Test Again

1. **Log out** of the website (important - to refresh your session)
2. **Log back in**
3. **Run the test again** in browser console:

```javascript
fetch("/api/admin/check")
  .then((r) => r.json())
  .then(console.log);
```

**Expected result**:

```json
{
  "loggedIn": true,
  "hasProfile": true,
  "role": "admin",
  "isAdmin": true,
  "message": "You are an admin"
}
```

### Step 5: Access Admin Page

Once `isAdmin: true`, navigate to:
https://www.propertycosts.com.au/en/admin/benchmarks

Should now work! ✅

## Verification Queries

Run these to verify everything is set up:

```sql
-- Check if role column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'role';

-- Check your profile
SELECT id, email, role, created_at, updated_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';

-- Check all profiles and their roles
SELECT id, email, role, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

## Troubleshooting

### Migration Fails

If you get an error, try running just the essential part:

```sql
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;
```

### Still Getting "column does not exist"

- Make sure you're running the migration on the **production database** (not local)
- Check you're in the correct Supabase project
- Verify the table exists: `SELECT * FROM user_profiles LIMIT 1;`

### Role Still Shows as "user" After Update

- Make sure you ran the UPDATE statement
- Check for typos in the email address
- Verify with: `SELECT * FROM user_profiles WHERE email = 'michaeljamescarne@gmail.com';`









