# Admin User Setup Guide

## Problem

The admin benchmarks page (`/en/admin/benchmarks`) is redirecting to `/en/dashboard` because the `requireAdmin()` function checks:

1. User is logged in
2. User has a profile in `user_profiles` table
3. User's role is set to `"admin"`

## Prerequisites

**IMPORTANT**: First, you need to add the `role` column to the `user_profiles` table if it doesn't exist.

### Step 1: Add Role Column (If Not Already Added)

Run this migration in Supabase SQL Editor:

```sql
-- File: supabase/migrations/20250118_add_role_to_user_profiles.sql
-- Copy and paste the entire contents of that file into Supabase SQL Editor
```

Or run this SQL directly:

```sql
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

        CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

        ALTER TABLE user_profiles
        ADD CONSTRAINT check_role_value
        CHECK (role IN ('user', 'admin'));
    END IF;
END $$;
```

## Solution: Set Up Admin User

### Option 1: Via Supabase Dashboard (Recommended)

1. **Log in to your account** on https://www.propertycosts.com.au
   - Make sure you're logged in with the email you want to make admin

2. **Get your User ID**
   - Open browser DevTools (F12)
   - Go to Application/Storage → Local Storage
   - Look for Supabase auth token or session
   - Or check the Network tab when logging in to see your user ID
   - **Alternative**: Go to Supabase Dashboard → Authentication → Users to find your user ID

3. **Run SQL in Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to **SQL Editor**
   - Run this SQL (replace `YOUR_USER_ID` and `your-email@example.com`):

```sql
-- First, ensure user_profiles table exists (should already exist from migrations)
-- If not, run the auth system migration first

-- Insert or update user profile with admin role
INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  'YOUR_USER_ID',  -- Replace with your actual user ID from auth.users
  'your-email@example.com',  -- Replace with your email
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id)
DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verify the update
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'your-email@example.com';
```

### Option 2: Find Your User ID First

If you don't know your user ID, run this query first:

```sql
-- Find your user by email
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';
```

Then use the `id` from the result in the INSERT statement above.

### Option 3: Set Admin Role for All Existing Users (Development Only)

⚠️ **WARNING: Only use this in development/staging, NOT production!**

```sql
-- Set all existing user profiles to admin (for testing)
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE role IS NULL OR role != 'admin';
```

### Option 4: Create Admin User via API (If you have access)

If you have direct database access, you can also create the profile via the signup flow and then update the role.

## Verification

After setting up the admin user:

1. **Log out and log back in** to refresh your session
2. **Navigate to**: https://www.propertycosts.com.au/en/admin/benchmarks
3. **Expected**: Should see the admin benchmarks page with three tabs:
   - Market Benchmarks
   - Cost Benchmarks
   - Macro Benchmarks

## Troubleshooting

### Still Redirecting?

1. **Check if profile exists**:

   ```sql
   SELECT * FROM user_profiles WHERE email = 'your-email@example.com';
   ```

2. **Check if role is set correctly**:

   ```sql
   SELECT id, email, role FROM user_profiles WHERE email = 'your-email@example.com';
   ```

   - Should show `role = 'admin'`

3. **Check if you're logged in**:
   - Make sure you're logged in on the website
   - Check browser DevTools → Application → Cookies for Supabase session

4. **Clear browser cache and cookies**:
   - Sometimes the session needs to be refreshed
   - Log out and log back in

5. **Check server logs**:
   - Look for console errors in the `requireAdmin` function
   - Check Supabase logs for any database errors

### Common Issues

**Issue**: "No profile found"

- **Solution**: Run the INSERT statement to create the profile

**Issue**: "Role is not admin"

- **Solution**: Run the UPDATE statement to set role to 'admin'

**Issue**: "User not logged in"

- **Solution**: Make sure you're logged in on the website first

## Security Note

- Only grant admin role to trusted users
- Admin users can modify all benchmark data
- Consider implementing additional security measures for production
