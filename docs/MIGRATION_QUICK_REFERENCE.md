# Properties Migration - Quick Reference

## File Location
`supabase/migrations/20250121_create_properties_tables.sql`

## Quick Steps

### Staging
1. Open Staging Supabase Dashboard → SQL Editor
2. Copy entire migration file
3. Paste and Run
4. Run verification queries from `VERIFY_PROPERTIES_MIGRATION.sql`

### Production  
1. ⚠️ **BACKUP FIRST!**
2. Open Production Supabase Dashboard → SQL Editor
3. Copy entire migration file
4. Paste and Run
5. Run verification queries
6. Monitor application logs

## What Gets Created
- 5 enum types
- 3 tables (properties, property_transactions, property_value_history)
- 8 indexes
- 2 triggers
- 6 RLS policies

## Safety
✅ Idempotent (safe to run multiple times)  
✅ Uses IF NOT EXISTS  
✅ Handles existing objects gracefully

## Full Guide
See `MIGRATION_PROPERTIES_STAGING_PRODUCTION.md` for detailed instructions
