# Properties Tables Migration Guide

This guide explains how to run the Properties tables migration (`20250121_create_properties_tables.sql`) in staging and production environments.

## Overview

The migration creates three new tables:
1. `properties` - User property records
2. `property_transactions` - Transactional expense/income entries
3. `property_value_history` - Property valuation history

It also creates enum types, indexes, triggers, and RLS policies.

## Migration File

**File**: `supabase/migrations/20250121_create_properties_tables.sql`

## Pre-Migration Checklist

Before running the migration, verify:

- [ ] Database backup completed (for production)
- [ ] Migration file reviewed and tested locally (if possible)
- [ ] All enum types don't conflict with existing types
- [ ] RLS policies follow the project's security patterns
- [ ] Foreign key constraints reference existing tables (`user_profiles`, `saved_calculations`)

## Migration Safety Features

The migration includes several safety features for idempotent execution:

1. **Enum Types**: Uses `DO $$ ... EXCEPTION WHEN duplicate_object` blocks to handle existing types
2. **Tables**: Uses `CREATE TABLE IF NOT EXISTS` to prevent errors if tables already exist
3. **Indexes**: Uses `CREATE INDEX IF NOT EXISTS` for safe index creation
4. **Triggers**: Uses `DROP TRIGGER IF EXISTS` before creating triggers
5. **Policies**: Uses `DROP POLICY IF EXISTS` before creating RLS policies

## Running the Migration

### Option 1: Supabase Dashboard (Recommended for Staging/Production)

1. **Login to Supabase Dashboard**
   - Staging: [Your staging project URL]
   - Production: [Your production project URL]

2. **Navigate to SQL Editor**
   - Go to SQL Editor in the left sidebar

3. **Run the Migration**
   - Copy the entire contents of `supabase/migrations/20250121_create_properties_tables.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Success**
   - Check for any errors in the output
   - Verify tables exist: `SELECT * FROM properties LIMIT 1;` (should return empty or error if table doesn't exist)
   - Verify RLS is enabled: Check table settings in Dashboard

### Option 2: Supabase CLI (If configured)

```bash
# For staging
supabase db push --db-url $STAGING_DATABASE_URL

# For production
supabase db push --db-url $PRODUCTION_DATABASE_URL
```

### Option 3: Direct psql Connection

```bash
# For staging
psql $STAGING_DATABASE_URL -f supabase/migrations/20250121_create_properties_tables.sql

# For production (be very careful!)
psql $PRODUCTION_DATABASE_URL -f supabase/migrations/20250121_create_properties_tables.sql
```

## Post-Migration Verification

After running the migration, verify:

### 1. Tables Created

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_transactions', 'property_value_history');
```

### 2. Enum Types Created

```sql
-- Check enum types exist
SELECT typname 
FROM pg_type 
WHERE typname IN ('property_status', 'loan_type', 'transaction_category', 'transaction_type', 'recurring_frequency');
```

### 3. Indexes Created

```sql
-- Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public';
```

### 4. RLS Enabled

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public';
```

### 5. Triggers Created

```sql
-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN ('properties', 'property_transactions');
```

### 6. Test RLS Policies

```sql
-- As a test user, verify you can only see your own properties
-- (This should be tested with actual authenticated users)
SELECT COUNT(*) FROM properties; -- Should only return user's own properties
```

## Rollback Plan

If you need to rollback the migration:

```sql
-- WARNING: This will delete all data in these tables!
-- Only run if you're sure you want to rollback

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS property_value_history CASCADE;
DROP TABLE IF EXISTS property_transactions CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- Drop enum types (only if not used elsewhere)
DROP TYPE IF EXISTS recurring_frequency CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_category CASCADE;
DROP TYPE IF EXISTS loan_type CASCADE;
DROP TYPE IF EXISTS property_status CASCADE;
```

**Note**: The `CASCADE` keyword will drop dependent objects. Be careful in production!

## Environment-Specific Notes

### Staging Environment

- Safe to test the migration multiple times
- Good place to verify the migration works correctly
- Can test rollback procedures here first

### Production Environment

- **Always backup first!**
- Run during low-traffic periods if possible
- Monitor application logs after migration
- Have rollback plan ready
- Test critical application features immediately after migration

## Troubleshooting

### Error: "type already exists"

**Solution**: The migration uses `DO $$ ... EXCEPTION WHEN duplicate_object` blocks to handle this. If you still see this error, the enum type may exist with a different definition. Check existing types first.

### Error: "relation already exists"

**Solution**: The migration uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does, the table may have been created manually. Check if tables already exist before running.

### Error: "function update_updated_at_column does not exist"

**Solution**: This function should be created by earlier migrations. Check if `create_saved_calculations_table.sql` or `20250110_create_firb_calculations.sql` has been run, as they create this function.

### Error: "foreign key constraint violation"

**Solution**: Verify that the `user_profiles` table exists and the referenced tables (`saved_calculations`) exist before running this migration.

## Next Steps

After successful migration:

1. Verify application can connect to new tables
2. Test API endpoints for properties
3. Test creating a property via the UI (once implemented)
4. Monitor error logs for any issues
5. Update application deployment if needed

## Support

If you encounter issues:
1. Check the Supabase Dashboard logs
2. Review application error logs
3. Verify all prerequisite migrations have been run
4. Check that foreign key references are valid

