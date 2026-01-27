# Database Migration Setup for Cost & Macro Benchmarks

## Quick Fix for Internal Server Error

If you're seeing an Internal Server Error when accessing the admin benchmarks page, it's likely because the database tables haven't been created yet.

## Step 1: Run Database Migrations

You need to run these SQL migrations in your Supabase database:

### Option A: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:

#### 1. Create Cost Benchmarks Table

```sql
-- Copy and paste contents of: supabase/migrations/20250118_create_cost_benchmarks.sql
```

#### 2. Create Macro Benchmarks Table

```sql
-- Copy and paste contents of: supabase/migrations/20250118_create_macro_benchmarks.sql
```

#### 3. (Optional) Seed Initial Data

```sql
-- Copy and paste contents of: supabase/migrations/20250118_seed_cost_benchmarks.sql
-- Copy and paste contents of: supabase/migrations/20250118_seed_macro_benchmarks.sql
```

### Option B: Via Supabase CLI

If you have Supabase CLI installed:

```bash
cd property-fee-calculator
supabase db push
```

This will run all pending migrations.

### Option C: Manual SQL Execution

Copy the SQL from each migration file and execute in your database:

1. `supabase/migrations/20250118_create_cost_benchmarks.sql`
2. `supabase/migrations/20250118_create_macro_benchmarks.sql`
3. `supabase/migrations/20250118_seed_cost_benchmarks.sql` (optional)
4. `supabase/migrations/20250118_seed_macro_benchmarks.sql` (optional)

## Step 2: Verify Tables Exist

Run this query in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('cost_benchmarks', 'macro_benchmarks');

-- Should return 2 rows
```

## Step 3: Verify RLS Policies

Check that RLS policies are enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('cost_benchmarks', 'macro_benchmarks');

-- Both should have rowsecurity = true
```

## Step 4: Test the Interface

After running migrations:

1. Refresh the admin benchmarks page
2. The error should be gone
3. You should see empty tables (or seeded data if you ran seed migrations)

## Troubleshooting

### Error: "relation does not exist"

- **Solution**: Run the create table migrations first

### Error: "permission denied"

- **Solution**: Check that your user has admin role in `user_profiles` table
- **Solution**: Verify RLS policies allow admin access

### Error: "type does not exist"

- **Solution**: The enum types should be created automatically by the migration
- If not, check that `australian_state`, `property_type`, `cost_metric`, etc. exist:
  ```sql
  SELECT typname FROM pg_type WHERE typname IN (
    'australian_state',
    'property_type',
    'cost_metric',
    'cost_unit',
    'macro_category',
    'macro_metric',
    'macro_unit'
  );
  ```

### Tables exist but still getting errors

- Check browser console for specific error messages
- Check Supabase logs for database errors
- Verify your Supabase connection string is correct in `.env.local`

## Quick Verification Query

Run this to verify everything is set up correctly:

```sql
-- Verify setup
SELECT
  'cost_benchmarks' as table_name,
  COUNT(*) as row_count,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = 'cost_benchmarks') as column_count
FROM cost_benchmarks
UNION ALL
SELECT
  'macro_benchmarks' as table_name,
  COUNT(*) as row_count,
  (SELECT COUNT(*) FROM information_schema.columns
   WHERE table_name = 'macro_benchmarks') as column_count
FROM macro_benchmarks;
```

Expected results:

- Both tables should exist
- Row counts depend on whether you ran seed migrations
- Column counts should be > 10 for each table











