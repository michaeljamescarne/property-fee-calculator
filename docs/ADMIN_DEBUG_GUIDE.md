# Admin Access Debugging Guide

If you've set up the role column and assigned yourself as admin but are still being redirected, follow these steps:

## Step 1: Run Diagnostic Endpoint

1. **Make sure you're logged in** on https://www.propertycosts.com.au
2. **Open browser DevTools** (F12)
3. **Go to Console tab**
4. **Run this command**:

```javascript
fetch("/api/admin/debug")
  .then((r) => r.json())
  .then(console.log);
```

Or visit directly: https://www.propertycosts.com.au/api/admin/debug

## Step 2: Check Diagnostic Results

The diagnostic will show:

### ✅ Expected Results (Working)

```json
{
  "hasSession": true,
  "sessionUser": {
    "id": "your-user-id",
    "email": "your-email@example.com"
  },
  "profileQuery": {
    "hasProfile": true,
    "profile": {
      "id": "your-user-id",
      "email": "your-email@example.com",
      "role": "admin"
    }
  },
  "roleColumn": {
    "exists": true
  },
  "isAdmin": true
}
```

### ❌ Common Issues

#### Issue 1: No Session

```json
{
  "hasSession": false,
  "error": "No session found"
}
```

**Solution**: Log in first, then try again.

#### Issue 2: No Profile

```json
{
  "hasSession": true,
  "profileQuery": {
    "hasProfile": false,
    "error": "..."
  }
}
```

**Solution**: Create a profile in `user_profiles` table:

```sql
INSERT INTO user_profiles (id, email, role)
VALUES (
  'YOUR_USER_ID_FROM_SESSION',
  'your-email@example.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

#### Issue 3: Role Column Missing

```json
{
  "roleColumn": {
    "exists": false
  }
}
```

**Solution**: Run the migration to add the role column:

```sql
-- Run: supabase/migrations/20250118_add_role_to_user_profiles.sql
```

#### Issue 4: Role Not Set to Admin

```json
{
  "profileQuery": {
    "hasProfile": true,
    "profile": {
      "role": "user" // or null
    }
  },
  "isAdmin": false
}
```

**Solution**: Update your role:

```sql
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE id = 'YOUR_USER_ID';
```

#### Issue 5: User ID Mismatch

If the `sessionUser.id` doesn't match the profile `id`, there's a mismatch between your session and database.

**Solution**:

1. Check if you're using the correct user ID
2. Verify the profile exists with that ID
3. You may need to log out and log back in

## Step 3: Manual Database Check

Run these queries in Supabase SQL Editor:

### Check Your User ID

```sql
-- Find your user by email
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Check Your Profile

```sql
-- Check your profile
SELECT id, email, role, created_at, updated_at
FROM user_profiles
WHERE email = 'your-email@example.com';
```

### Verify Role Column Exists

```sql
-- Check if role column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
  AND column_name = 'role';
```

### Check All Profiles

```sql
-- See all profiles and their roles
SELECT id, email, role, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

## Step 4: Common Fixes

### Fix 1: Clear Browser Cache and Cookies

1. Open DevTools (F12)
2. Go to Application tab
3. Clear all cookies for propertycosts.com.au
4. Clear site data
5. Log out and log back in

### Fix 2: Force Session Refresh

1. Log out completely
2. Clear browser cache
3. Log back in
4. Try accessing admin page again

### Fix 3: Verify Database Connection

Check that your production environment variables are set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Fix 4: Check Server Logs

Look at Vercel deployment logs or server console for:

- `console.error("Admin check failed - no profile:")`
- `console.log("Admin check failed - user is not admin:")`

These will show exactly why the redirect is happening.

## Step 5: Test After Fixes

1. Run diagnostic endpoint again
2. Verify `isAdmin: true`
3. Try accessing `/en/admin/benchmarks`
4. Should now work!

## Still Not Working?

If after all these steps it still redirects:

1. **Check the exact error** in browser console
2. **Check server logs** in Vercel dashboard
3. **Verify**:
   - Migration was run on production database (not just local)
   - Your user ID matches between session and database
   - Role is exactly `'admin'` (not `'Admin'` or `'ADMIN'`)
   - You're logged in with the same email you set as admin











