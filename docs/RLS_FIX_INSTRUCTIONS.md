# RLS Policy Fix - Instructions

## Problem

The `saved_calculations` table has RLS policies that block service role from inserting rows because `auth.uid()` returns NULL when using custom JWT authentication instead of Supabase Auth.

**Error**: `new row violates row-level security policy for table "saved_calculations"`

## Solution

Apply the new migration that creates proper RLS policies for service role access.

## Steps to Apply Fix

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20250114_fix_rls_policies.sql`
5. Click **Run** to execute the migration
6. Verify success - you should see "Success. No rows returned"

### Option 2: Via Supabase CLI (if installed)

```bash
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator
supabase db push
```

### Option 3: Manual SQL Execution

Connect to your database and run:

```sql
-- The SQL from the migration file
-- (See supabase/migrations/20250114_fix_rls_policies.sql)
```

## Verification

After applying the migration, test the save functionality:

1. Go to http://localhost:3000/en/firb-calculator
2. Complete a calculation
3. Click "Save Calculation" button
4. Should see success message (not RLS error)
5. Check dashboard to see saved calculation

## What the Fix Does

The new policies:
- Grant service role (used by API routes) full access to all tables
- Ensure authenticated users can only access their own data
- Maintain security while allowing our custom auth system to work

## Rollback (if needed)

If something goes wrong, you can revert by running:

```sql
-- Drop new policies
DROP POLICY IF EXISTS "Allow service role full access" ON saved_calculations;
DROP POLICY IF EXISTS "Users can manage own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Allow service role full access to profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

-- Restore original policies (from 20250112_auth_system.sql)
-- (Run the original RLS policy statements)
```

## Next Steps

Once this is fixed, the following will work:
- ✅ Users can save calculations from the calculator
- ✅ Dashboard will populate with saved calculations
- ✅ No more RLS policy errors in logs




