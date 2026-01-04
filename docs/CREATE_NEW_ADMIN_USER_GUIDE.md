# Guide: Creating a New Admin User for Production

This guide outlines the steps required to create a new admin user who can update benchmarks on production.

## Prerequisites

- Access to Supabase production database (SQL Editor)
- The email address of the user you want to make an admin
- The user should have logged in at least once (to create their profile)

## Step-by-Step Process

### Step 1: Verify Database Schema

First, ensure the `role` column exists in the `user_profiles` table. If it doesn't exist, run this migration:

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

**Location**: This migration is in `supabase/migrations/20250118_add_role_to_user_profiles.sql`

### Step 2: Find the User's Email and Profile

Run this query in Supabase SQL Editor to check if the user exists:

```sql
-- Check if user profile exists
SELECT 
    id, 
    email, 
    role,
    created_at,
    last_login_at
FROM user_profiles
WHERE email = 'user@example.com';  -- Replace with actual email
```

**If the user doesn't exist**, they need to:
1. Log in to the production site at least once
2. This will automatically create their profile in `user_profiles` table
3. Then proceed to Step 3

### Step 3: Set Admin Role

#### Option A: User Profile Already Exists (Recommended)

If the user profile exists, simply update their role:

```sql
-- Set admin role for existing user
UPDATE user_profiles
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'user@example.com';  -- Replace with actual email

-- Verify the update
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'user@example.com';
```

#### Option B: Create Profile and Set Admin Role

If the user profile doesn't exist but you have their user ID from `auth.users`:

```sql
-- First, find their user ID from auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'user@example.com';  -- Replace with actual email

-- Then create profile with admin role (replace USER_ID_HERE with the ID from above)
INSERT INTO user_profiles (id, email, role, subscription_status, calculations_count, created_at, updated_at)
VALUES (
    'USER_ID_HERE',  -- Replace with actual user ID from auth.users
    'user@example.com',  -- Replace with actual email
    'admin',
    'free',
    0,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
    role = 'admin',
    updated_at = NOW();

-- Verify
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'user@example.com';
```

#### Option C: Create Profile by Email Only (Simplest)

If you only know the email and the user hasn't logged in yet:

```sql
-- This will create a profile when they first log in, but you can pre-create it
-- Note: You'll need to get the user ID from auth.users first, or wait for them to log in

-- First, check if they exist in auth.users
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- If they exist in auth.users, use their ID:
INSERT INTO user_profiles (id, email, role, subscription_status, calculations_count, created_at, updated_at)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'user@example.com'),  -- Get ID from auth.users
    'user@example.com',
    'admin',
    'free',
    0,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET 
    role = 'admin',
    updated_at = NOW();
```

### Step 4: Verify Admin Access

After setting the admin role:

1. **Have the user log out and log back in** to refresh their session
2. **Verify in database**:
   ```sql
   SELECT id, email, role 
   FROM user_profiles 
   WHERE email = 'user@example.com';
   ```
   Should show `role = 'admin'`

3. **Test admin access**:
   - User should navigate to: `https://www.propertycosts.com.au/en/admin/benchmarks`
   - Should see the admin dashboard with three tabs:
     - Market Benchmarks
     - Cost Benchmarks  
     - Macro Benchmarks
   - If redirected to `/dashboard`, the admin role isn't working (see troubleshooting)

## Complete Example

Here's a complete example for creating an admin user with email `admin@example.com`:

```sql
-- Step 1: Check if user exists
SELECT id, email, role FROM user_profiles WHERE email = 'admin@example.com';

-- Step 2: If user exists, set admin role
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'admin@example.com';

-- Step 3: Verify
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'admin@example.com';
```

## Troubleshooting

### User Still Can't Access Admin Panel

1. **Check role is set correctly**:
   ```sql
   SELECT id, email, role FROM user_profiles WHERE email = 'user@example.com';
   ```
   - Should show `role = 'admin'` (not `'user'` or `NULL`)

2. **Check if user is logged in**:
   - User must be logged in to the production site
   - Check browser DevTools → Application → Cookies for Supabase session

3. **Clear cache and re-login**:
   - User should log out completely
   - Clear browser cache/cookies
   - Log back in
   - Try accessing `/en/admin/benchmarks` again

4. **Check server logs**:
   - Look for errors in `requireAdmin()` function
   - Check Supabase logs for database errors

### Profile Doesn't Exist

If the user profile doesn't exist:

1. **User must log in first** - This automatically creates the profile
2. **Then run the UPDATE query** to set role to 'admin'
3. **User logs out and back in** to refresh session

### Role Column Doesn't Exist

If you get an error about the `role` column not existing:

1. Run the migration from Step 1
2. Then proceed with setting the admin role

## Security Notes

⚠️ **Important Security Considerations**:

- Only grant admin role to trusted users
- Admin users can modify all benchmark data (market benchmarks, cost benchmarks, macro benchmarks)
- Admin users can access sensitive data
- Consider implementing additional security measures for production:
  - IP whitelisting for admin routes
  - Two-factor authentication for admin users
  - Audit logging for admin actions

## Admin Capabilities

Once a user has the `admin` role, they can:

- ✅ Access `/en/admin/benchmarks` dashboard
- ✅ View all benchmark data
- ✅ Update macro benchmarks (interest rates, tax rates, market data)
- ✅ Update cost benchmarks (property management fees, maintenance costs, etc.)
- ✅ Update market benchmarks (rental yields, capital growth rates)
- ✅ Manage benchmark data sources and refresh cadence

## Related Files

- `lib/auth/admin.ts` - Admin authentication logic
- `app/api/admin/macro-benchmarks/` - Admin API routes
- `components/admin/` - Admin UI components
- `supabase/migrations/20250118_add_role_to_user_profiles.sql` - Role column migration

## Quick Reference

**Simplest method** (if user has already logged in):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'user@example.com';
```

Then have the user log out and log back in.










