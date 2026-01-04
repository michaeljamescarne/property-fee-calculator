# Production Migration Guide

## Issue: Admin Access Failing - Missing `role` Column

The error `column user_profiles.role does not exist` indicates the migration hasn't been run in production.

## Step 1: Run the Migration

1. **Go to your Supabase Production Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your production project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Copy the entire contents of: `supabase/migrations/20250118_add_role_to_user_profiles.sql`
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify the Migration**
   - Run this query to confirm the column exists:

   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = 'user_profiles'
   AND column_name = 'role';
   ```

   - You should see a row with `role`, `text`, and `'user'::text`

## Step 2: Set Your Admin Role

After the migration, set your user as admin:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'michaeljamescarne@gmail.com';

-- Verify it worked
SELECT id, email, role, created_at
FROM user_profiles
WHERE email = 'michaeljamescarne@gmail.com';
```

You should see `role: 'admin'` in the result.

## Step 3: Test Admin Access

1. Refresh your browser
2. Navigate to: `https://www.propertycosts.com.au/en/admin/benchmarks`
3. You should now have access!

## Troubleshooting

### If migration fails with "column already exists"

- The migration uses `IF NOT EXISTS`, so it's safe to run multiple times
- If you get this error, the column already exists - skip to Step 2

### If you see "permission denied"

- Make sure you're using the SQL Editor in the Supabase dashboard (not a local client)
- The dashboard has full permissions

### If admin access still fails after migration

- Check server logs for the exact error
- Verify the role was set correctly: `SELECT role FROM user_profiles WHERE email = 'your-email@example.com';`
- Make sure you're logged in with the correct account









