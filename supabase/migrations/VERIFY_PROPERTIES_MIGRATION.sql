-- Verification Queries for Properties Tables Migration
-- Run these AFTER running 20250121_create_properties_tables.sql
-- Copy and paste each section into Supabase SQL Editor

-- ============================================
-- 1. Verify Tables Exist
-- ============================================
SELECT 
    table_name,
    '✅ Table exists' AS status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_transactions', 'property_value_history')
ORDER BY table_name;

-- Expected: 3 rows (properties, property_transactions, property_value_history)

-- ============================================
-- 2. Verify Enum Types Exist
-- ============================================
SELECT 
    typname AS enum_name,
    '✅ Enum exists' AS status
FROM pg_type 
WHERE typname IN (
    'property_status', 
    'loan_type', 
    'transaction_category', 
    'transaction_type', 
    'recurring_frequency'
)
ORDER BY typname;

-- Expected: 5 rows

-- ============================================
-- 3. Verify Indexes Exist
-- ============================================
SELECT 
    indexname,
    tablename,
    '✅ Index exists' AS status
FROM pg_indexes 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Expected: 8 rows

-- ============================================
-- 4. Verify RLS is Enabled
-- ============================================
SELECT 
    tablename,
    rowsecurity AS rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS enabled'
        ELSE '❌ RLS NOT enabled'
    END AS status
FROM pg_tables 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public'
ORDER BY tablename;

-- Expected: All 3 tables with rowsecurity = true

-- ============================================
-- 5. Verify Triggers Exist
-- ============================================
SELECT 
    trigger_name,
    event_object_table AS table_name,
    '✅ Trigger exists' AS status
FROM information_schema.triggers 
WHERE event_object_table IN ('properties', 'property_transactions')
ORDER BY trigger_name;

-- Expected: 2 rows (update_properties_updated_at, update_property_transactions_updated_at)

-- ============================================
-- 6. Verify RLS Policies Exist
-- ============================================
SELECT 
    tablename,
    policyname,
    '✅ Policy exists' AS status
FROM pg_policies 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
ORDER BY tablename, policyname;

-- Expected: 6 rows (2 policies per table: service_role and authenticated)

-- ============================================
-- 7. Verify Foreign Key Constraints
-- ============================================
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    '✅ FK constraint exists' AS status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('properties', 'property_transactions', 'property_value_history')
ORDER BY tc.table_name, kcu.column_name;

-- Expected: 
-- properties: user_id -> user_profiles(id), source_calculation_id -> saved_calculations(id)
-- property_transactions: property_id -> properties(id)
-- property_value_history: property_id -> properties(id)

-- ============================================
-- 8. Verify update_updated_at_column Function Exists
-- ============================================
SELECT 
    proname AS function_name,
    '✅ Function exists' AS status
FROM pg_proc 
WHERE proname = 'update_updated_at_column';

-- Expected: 1 row

-- ============================================
-- Summary Query
-- ============================================
SELECT 
    'Tables' AS category,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) = 3 THEN '✅' ELSE '❌' END AS status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_transactions', 'property_value_history')

UNION ALL

SELECT 
    'Enum Types' AS category,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) = 5 THEN '✅' ELSE '❌' END AS status
FROM pg_type 
WHERE typname IN ('property_status', 'loan_type', 'transaction_category', 'transaction_type', 'recurring_frequency')

UNION ALL

SELECT 
    'Indexes' AS category,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) >= 8 THEN '✅' ELSE '❌' END AS status
FROM pg_indexes 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')
AND schemaname = 'public'

UNION ALL

SELECT 
    'RLS Policies' AS category,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) = 6 THEN '✅' ELSE '❌' END AS status
FROM pg_policies 
WHERE tablename IN ('properties', 'property_transactions', 'property_value_history')

UNION ALL

SELECT 
    'Triggers' AS category,
    COUNT(*) AS count,
    CASE WHEN COUNT(*) = 2 THEN '✅' ELSE '❌' END AS status
FROM information_schema.triggers 
WHERE event_object_table IN ('properties', 'property_transactions');

-- Expected: All categories showing ✅ status

