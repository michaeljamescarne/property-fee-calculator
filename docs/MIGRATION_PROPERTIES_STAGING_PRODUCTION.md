# Properties Tables Migration Guide - Staging & Production

This guide provides step-by-step instructions for running the Properties tables migration in both staging and production environments.

## Migration File

**File**: `supabase/migrations/20250121_create_properties_tables.sql`  
**Size**: 282 lines  
**What it creates**:
- 5 enum types (property_status, loan_type, transaction_category, transaction_type, recurring_frequency)
- 3 tables (properties, property_transactions, property_value_history)
- 8 indexes
- 2 triggers
- 6 RLS policies

## Prerequisites

Before running this migration, ensure these dependencies exist:

### Required Tables
- ✅ `user_profiles` - Must exist (created by earlier migrations)
- ✅ `saved_calculations` - Must exist (optional, but referenced for `source_calculation_id`)

### Required Functions
- ✅ `update_updated_at_column()` - Must exist (created by `create_saved_calculations_table.sql` or `20250110_create_firb_calculations.sql`)

### Required Enum Types
- ✅ `australian_state` - Must exist (created by earlier migrations)
- ✅ `property_type` - Must exist (created by earlier migrations)

**Verification Query**:
```sql
-- Check prerequisites
SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') AS user_profiles_exists;
SELECT EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') AS function_exists;
SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'australian_state') AS state_enum_exists;
SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'property_type') AS property_type_enum_exists;
```

## Migration Safety Features

This migration is **idempotent** and **safe to run multiple times**:

✅ **Enum Types**: Uses `DO $$ ... EXCEPTION WHEN duplicate_object` to handle existing types  
✅ **Tables**: Uses `CREATE TABLE IF NOT EXISTS`  
✅ **Indexes**: Uses `CREATE INDEX IF NOT EXISTS`  
✅ **Triggers**: Uses `DROP TRIGGER IF EXISTS` before creating  
✅ **Policies**: Uses `DROP POLICY IF EXISTS` before creating  

## Step-by-Step: Staging Environment

### Step 1: Backup (Recommended)

While the migration is safe, it's good practice to backup before migrations:

1. In Supabase Dashboard → **Settings** → **Database**
2. Note the backup schedule (Supabase automatically backs up)
3. For manual backup, use Supabase CLI:
   ```bash
   supabase db dump -f staging-backup-$(date +%Y%m%d).sql
   ```

### Step 2: Access Staging Database

1. Go to your **Staging Supabase Project** dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**

### Step 3: Review Migration File

1. Open `supabase/migrations/20250121_create_properties_tables.sql`
2. Review the structure (it's safe, but good to understand what it creates)
3. Note: The migration references existing tables (`user_profiles`, `saved_calculations`)

### Step 4: Run Migration

1. **Copy the entire migration file content**
2. **Paste into SQL Editor**
3. **Click "Run"** (or press Cmd+Enter / Ctrl+Enter)
4. **Wait for completion** (should complete in < 5 seconds)

Expected output: "Success. No rows returned"

### Step 5: Verify Migration

Run these verification queries in SQL Editor:

```sql
-- 1. Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_transactions', 'property_value_history')
ORDER BY table_name;
-- Expected: 3 rows

-- 2. Check enum types exist
SELECT typname 
FROM pg_type 
WHERE typname IN ('property_status', 'loan_type', 'transaction_category', 'transaction_type', 'recurring_frequency')
ORDER BY typname;
-- Expected: 5 rows

-- 3. Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public'
ORDER BY indexname;
-- Expected: 8 rows

-- 4. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public';
-- Expected: All 3 tables with rowsecurity = true

-- 5. Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN ('properties', 'property_transactions')
ORDER BY trigger_name;
-- Expected: 2 rows

-- 6. Check RLS policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
ORDER BY tablename, policyname;
-- Expected: 6 rows
```

### Step 6: Test Basic Operations (Staging)

Test that the tables work correctly:

```sql
-- Test 1: Check table structure
\d properties;
\d property_transactions;
\d property_value_history;

-- Test 2: Verify foreign key constraints
SELECT
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
AND tc.table_name IN ('properties', 'property_transactions', 'property_value_history');
```

### Step 7: Monitor Application Logs

1. Check your staging application logs
2. Verify no errors related to the new tables
3. Test the Properties API endpoints (if deployed)

## Step-by-Step: Production Environment

**⚠️ IMPORTANT: Production requires extra caution!**

### Pre-Production Checklist

- [ ] Migration successfully tested in staging
- [ ] All verification queries passed in staging
- [ ] Application tested with new tables in staging
- [ ] Database backup confirmed/created
- [ ] Rollback plan prepared (see below)
- [ ] Team notified of migration window
- [ ] Low-traffic window scheduled (if possible)

### Step 1: Create Production Backup

**CRITICAL**: Always backup production before migrations!

1. In Supabase Dashboard → **Settings** → **Database**
2. Verify **Point-in-Time Recovery (PITR)** is enabled
3. For manual backup:
   ```bash
   supabase db dump -f production-backup-$(date +%Y%m%d-%H%M%S).sql
   ```

### Step 2: Access Production Database

1. Go to your **Production Supabase Project** dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**

### Step 3: Run Migration

1. **Copy the entire migration file content** from `supabase/migrations/20250121_create_properties_tables.sql`
2. **Paste into SQL Editor**
3. **Double-check** you're in the production project (verify project name)
4. **Click "Run"**
5. **Monitor for errors** (should complete in < 5 seconds)

Expected output: "Success. No rows returned"

### Step 4: Verify Migration (Production)

Run the same verification queries from Step 5 above.

**If any verification fails**, check error messages and refer to troubleshooting section.

### Step 5: Monitor Production

1. **Watch application error logs** (first 5-10 minutes)
2. **Monitor database performance** (check query times)
3. **Test critical user flows** that use properties
4. **Verify API endpoints** are responding correctly

### Step 6: Post-Migration Testing

Test that the Properties feature works:

1. Test creating a property via API
2. Test listing properties
3. Test creating transactions
4. Test performance calculations

## Rollback Plan

If you need to rollback the migration:

```sql
-- ⚠️ WARNING: This will DELETE ALL DATA in these tables!
-- Only run if you're certain you want to rollback

BEGIN;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS property_value_history CASCADE;
DROP TABLE IF EXISTS property_transactions CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- Drop enum types (only if not used elsewhere)
-- Note: CASCADE will drop if used by other tables
DROP TYPE IF EXISTS recurring_frequency CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_category CASCADE;
DROP TYPE IF EXISTS loan_type CASCADE;
DROP TYPE IF EXISTS property_status CASCADE;

COMMIT;
```

**Alternative**: Use Supabase Point-in-Time Recovery to restore to a time before the migration.

## Troubleshooting

### Error: "function update_updated_at_column() does not exist"

**Cause**: Prerequisite function not created  
**Solution**: Run `create_saved_calculations_table.sql` or `20250110_create_firb_calculations.sql` first, or create the function manually:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Error: "relation 'user_profiles' does not exist"

**Cause**: Prerequisite table not created  
**Solution**: Ensure `user_profiles` table exists. Check your earlier migrations.

### Error: "type 'australian_state' does not exist"

**Cause**: Prerequisite enum not created  
**Solution**: Ensure earlier migrations that create `australian_state` enum have been run.

### Error: "relation already exists"

**Cause**: Tables already created  
**Solution**: This is fine! The migration uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does, the tables may have been created manually. Check if they exist and have the correct structure.

### Error: "duplicate key value violates unique constraint"

**Cause**: Policy or index already exists  
**Solution**: The migration uses `DROP POLICY IF EXISTS` and `CREATE INDEX IF NOT EXISTS`, so this shouldn't happen. If it does, the migration may have partially run. Check what exists and manually clean up if needed.

## Environment-Specific Notes

### Staging Environment

- ✅ Safe to test multiple times
- ✅ Good place to verify migration works
- ✅ Can test rollback procedures
- ✅ Lower risk - can experiment

### Production Environment

- ⚠️ **Always backup first!**
- ⚠️ Run during low-traffic periods if possible
- ⚠️ Have rollback plan ready
- ⚠️ Monitor closely after migration
- ⚠️ Test critical features immediately
- ⚠️ Keep team informed

## Verification Checklist

After running in each environment, verify:

- [ ] All 3 tables created
- [ ] All 5 enum types created
- [ ] All 8 indexes created
- [ ] All 2 triggers created
- [ ] RLS enabled on all tables
- [ ] All 6 RLS policies created
- [ ] Foreign key constraints working
- [ ] Application can connect to tables
- [ ] No errors in application logs
- [ ] API endpoints work correctly

## Next Steps

After successful migration:

1. ✅ Update application deployment (if needed)
2. ✅ Test Properties API endpoints
3. ✅ Test creating properties via UI (when implemented)
4. ✅ Monitor error logs for 24-48 hours
5. ✅ Document any issues encountered

## Support

If issues persist:

1. Check Supabase Dashboard → **Logs** → **Postgres Logs**
2. Review application error logs
3. Verify all prerequisite migrations have been run
4. Check that foreign key references are valid
5. Contact Supabase support if database-level issues

## Migration Summary

| Item | Count | Status |
|------|-------|--------|
| Enum Types | 5 | ✅ |
| Tables | 3 | ✅ |
| Indexes | 8 | ✅ |
| Triggers | 2 | ✅ |
| RLS Policies | 6 | ✅ |
| Lines of SQL | 282 | ✅ |
| Idempotent | Yes | ✅ |
| Safe for Production | Yes | ✅ |



