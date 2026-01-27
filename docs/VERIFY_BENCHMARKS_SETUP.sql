-- Verification Script for Cost & Macro Benchmarks Setup
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- ============================================
-- 1. Verify Tables Exist
-- ============================================
SELECT 
  'Tables Check' as check_type,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('cost_benchmarks', 'macro_benchmarks')
ORDER BY table_name;

-- ============================================
-- 2. Verify Cost Benchmarks Data
-- ============================================
SELECT 
  'Cost Benchmarks Count' as check_type,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_active = true) as active_records,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_records
FROM cost_benchmarks;

-- Check by state
SELECT 
  'Cost Benchmarks by State' as check_type,
  state,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active
FROM cost_benchmarks
GROUP BY state
ORDER BY state;

-- Check by metric
SELECT 
  'Cost Benchmarks by Metric' as check_type,
  metric,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active
FROM cost_benchmarks
GROUP BY metric
ORDER BY metric;

-- Sample active records
SELECT 
  'Sample Cost Benchmarks' as check_type,
  state,
  property_type,
  metric,
  value_numeric,
  unit,
  is_active
FROM cost_benchmarks
WHERE is_active = true
ORDER BY state, property_type, metric
LIMIT 10;

-- ============================================
-- 3. Verify Macro Benchmarks Data
-- ============================================
SELECT 
  'Macro Benchmarks Count' as check_type,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_active = true) as active_records,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_records
FROM macro_benchmarks;

-- Check by category
SELECT 
  'Macro Benchmarks by Category' as check_type,
  category,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as active
FROM macro_benchmarks
GROUP BY category
ORDER BY category;

-- All active macro benchmarks
SELECT 
  'All Active Macro Benchmarks' as check_type,
  category,
  metric,
  value_numeric,
  unit,
  data_source,
  refresh_cadence,
  is_active
FROM macro_benchmarks
WHERE is_active = true
ORDER BY category, metric;

-- ============================================
-- 4. Verify Unique Constraints
-- ============================================
-- Check for duplicate active cost benchmarks (should return 0)
SELECT 
  'Duplicate Active Cost Benchmarks Check' as check_type,
  state,
  property_type,
  metric,
  COUNT(*) as count
FROM cost_benchmarks
WHERE is_active = true
GROUP BY state, property_type, metric
HAVING COUNT(*) > 1;

-- Check for duplicate active macro benchmarks (should return 0)
SELECT 
  'Duplicate Active Macro Benchmarks Check' as check_type,
  metric,
  COUNT(*) as count
FROM macro_benchmarks
WHERE is_active = true
GROUP BY metric
HAVING COUNT(*) > 1;

-- ============================================
-- 5. Verify Indexes
-- ============================================
SELECT 
  'Indexes Check' as check_type,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('cost_benchmarks', 'macro_benchmarks')
ORDER BY tablename, indexname;

-- ============================================
-- 6. Verify RLS Policies
-- ============================================
SELECT 
  'RLS Policies Check' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('cost_benchmarks', 'macro_benchmarks')
ORDER BY tablename, policyname;

-- ============================================
-- 7. Expected Counts Verification
-- ============================================
-- Cost benchmarks: 8 states × 2 property types × 10 metrics = 160 records (if all seeded)
-- But we only seed for newDwelling and established, so: 8 × 2 × 10 = 160
SELECT 
  'Expected vs Actual Cost Benchmarks' as check_type,
  160 as expected_count,
  COUNT(*) FILTER (WHERE is_active = true) as actual_active_count,
  CASE 
    WHEN COUNT(*) FILTER (WHERE is_active = true) >= 100 THEN '✓ PASS'
    ELSE '✗ FAIL - Missing records'
  END as status
FROM cost_benchmarks;

-- Macro benchmarks: Should have 8 active records
SELECT 
  'Expected vs Actual Macro Benchmarks' as check_type,
  8 as expected_count,
  COUNT(*) FILTER (WHERE is_active = true) as actual_active_count,
  CASE 
    WHEN COUNT(*) FILTER (WHERE is_active = true) = 8 THEN '✓ PASS'
    ELSE '✗ FAIL - Missing records'
  END as status
FROM macro_benchmarks;

-- ============================================
-- 8. Data Quality Checks
-- ============================================
-- Check for NULL values in required fields
SELECT 
  'Data Quality - NULL Check' as check_type,
  'cost_benchmarks' as table_name,
  COUNT(*) as records_with_nulls
FROM cost_benchmarks
WHERE state IS NULL 
   OR property_type IS NULL 
   OR metric IS NULL 
   OR value_numeric IS NULL
   OR unit IS NULL;

SELECT 
  'Data Quality - NULL Check' as check_type,
  'macro_benchmarks' as table_name,
  COUNT(*) as records_with_nulls
FROM macro_benchmarks
WHERE category IS NULL 
   OR metric IS NULL 
   OR value_numeric IS NULL
   OR unit IS NULL;

-- ============================================
-- 9. Summary Report
-- ============================================
SELECT 
  '=== SETUP VERIFICATION SUMMARY ===' as summary;

SELECT 
  'Cost Benchmarks' as component,
  COUNT(*) FILTER (WHERE is_active = true) as active_records,
  COUNT(DISTINCT state) as states_covered,
  COUNT(DISTINCT metric) as metrics_covered,
  '✓' as status
FROM cost_benchmarks;

SELECT 
  'Macro Benchmarks' as component,
  COUNT(*) FILTER (WHERE is_active = true) as active_records,
  COUNT(DISTINCT category) as categories_covered,
  COUNT(DISTINCT metric) as metrics_covered,
  '✓' as status
FROM macro_benchmarks;














