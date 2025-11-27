# Admin Setup Guide

This guide explains how to set up an admin user to access the admin dashboard.

## Prerequisites

1. You must have a user account (logged in via the magic code system)
2. The `user_profiles` table must exist (from Phase 2 migrations)
3. You need access to Supabase SQL Editor

## Step 1: Find Your User ID

1. Log in to the application using the magic code system
2. After logging in, check your browser's developer console (F12)
3. Or, go to Supabase Dashboard → Authentication → Users
4. Find your user email and copy the User ID (UUID)

## Step 2: Set Admin Role in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. **EASIEST METHOD** - Update by email (replace `your@email.com` with your actual email):

```sql
-- Update by email (easiest!)
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your@email.com';
```

**OR** if you prefer to use the user ID:

```sql
-- First, find your user ID (replace your@email.com)
SELECT id, email FROM user_profiles WHERE email = 'your@email.com';

-- Then update using the ID from above (replace YOUR_ACTUAL_USER_ID with the UUID)
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'YOUR_ACTUAL_USER_ID';
```

**OR** if the user_profiles record doesn't exist yet:

```sql
-- First get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Then insert (replace YOUR_ACTUAL_USER_ID with the UUID from above)
INSERT INTO user_profiles (id, email, role)
VALUES ('YOUR_ACTUAL_USER_ID', 'your@email.com', 'admin')
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

## Step 3: Verify Admin Role

Run this query to verify:

```sql
SELECT id, email, role
FROM user_profiles
WHERE role = 'admin';
```

You should see your user listed with `role = 'admin'`.

## Step 4: Access Admin Dashboard

1. Make sure you're logged in
2. Navigate to: `http://localhost:3000/en/admin/benchmarks` (or `http://localhost:3000/zh/admin/benchmarks` for Chinese)
3. You should now see the admin dashboard instead of being redirected

## Troubleshooting

### Still Getting Redirected?

1. **Check if you're logged in:**
   - Try accessing `/en/dashboard` - if you get redirected, you're not logged in
   - Log in first, then try the admin route

2. **Check your user_profiles record:**

   ```sql
   SELECT * FROM user_profiles WHERE email = 'your@email.com';
   ```

   - If no record exists, create one with the INSERT statement above
   - If record exists but `role` is NULL or 'user', update it to 'admin'

3. **Check the session:**
   - Clear your browser cookies and log in again
   - The session might be stale

4. **Check browser console:**
   - Open Developer Tools (F12) → Console
   - Look for any error messages

### Common Issues

**Issue:** "Admin check failed - no profile"

- **Solution:** Your user doesn't have a `user_profiles` record. Create one using the SQL above.

**Issue:** "Admin check failed - user is not admin"

- **Solution:** Your user's role is not set to 'admin'. Update it using the SQL above.

**Issue:** Getting redirected to `/en/firb-calculator?login=true`

- **Solution:** You're not logged in. Log in first, then try the admin route.

## Security Note

⚠️ **Important:** Only grant admin access to trusted users. Admin users can:

- View all benchmark data
- Create, edit, and delete benchmarks
- Modify critical system data

## Next Steps

Once you have admin access:

1. Test creating a new benchmark
2. Test editing an existing benchmark
3. Test deleting a benchmark
4. Verify filters work correctly
