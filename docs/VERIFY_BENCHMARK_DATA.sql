-- Verification Queries for Phase 1 Suburb Benchmark Data
-- Run these queries in Supabase SQL Editor after applying both migrations

-- ============================================
-- 1. OVERALL DATA COUNT
-- ============================================
-- Check total number of suburb-level records inserted
SELECT 
  COUNT(*) as total_suburb_records,
  COUNT(DISTINCT suburb_name) as unique_suburbs,
  COUNT(DISTINCT state) as states_covered
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true;

-- Expected: ~65+ records (some suburbs have both house and unit data)

-- ============================================
-- 2. BREAKDOWN BY STATE AND PROPERTY TYPE
-- ============================================
-- See distribution across states and property classifications
SELECT 
  state,
  property_classification,
  COUNT(*) as record_count,
  COUNT(DISTINCT suburb_name) as unique_suburbs
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
GROUP BY state, property_classification
ORDER BY state, property_classification;

-- Expected breakdown:
-- NSW: ~25 suburbs (mix of house and unit)
-- VIC: ~15 suburbs (mix of house and unit)
-- QLD: ~11 suburbs (mix of house and unit)
-- WA: ~9 suburbs (mix of house and unit)
-- SA: ~6 suburbs (mix of house and unit)
-- ACT: ~5 suburbs (mix of house and unit)

-- ============================================
-- 3. SAMPLE DATA CHECK - Specific Suburbs
-- ============================================
-- Verify data for a few key suburbs mentioned in the PDF
SELECT 
  suburb_name,
  postcode,
  property_classification,
  gross_rental_yield,
  median_weekly_rent,
  median_property_value,
  capital_growth_5yr,
  data_quality_score,
  notes
FROM benchmark_data
WHERE suburb_name IN ('Parramatta', 'Bondi', 'New Farm', 'Footscray', 'Scarborough')
  AND is_active = true
ORDER BY suburb_name, property_classification;

-- Expected: Should see Parramatta with high growth (30% for houses, 8.5% for units)
--          Bondi with premium yields (2.1% houses, 3.2% units)
--          New Farm with supply-constraint boom (15% growth)
--          Footscray with exceptional unit yield (5.78%)
--          Scarborough (WA) with anomaly (15.38% growth)

-- ============================================
-- 4. DATA QUALITY CHECK
-- ============================================
-- Verify data quality scores are within expected range
SELECT 
  data_quality_score,
  COUNT(*) as record_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
GROUP BY data_quality_score
ORDER BY data_quality_score DESC;

-- Expected: Most records should have scores 7-9, with majority at 9

-- ============================================
-- 5. CHECK FOR MISSING CRITICAL FIELDS
-- ============================================
-- Identify any records missing essential data
SELECT 
  suburb_name,
  postcode,
  property_classification,
  state,
  CASE 
    WHEN gross_rental_yield IS NULL THEN 'Missing yield'
    WHEN median_weekly_rent IS NULL THEN 'Missing rent'
    WHEN median_property_value IS NULL THEN 'Missing value'
    WHEN capital_growth_5yr IS NULL THEN 'Missing growth'
    ELSE 'OK'
  END as data_status
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
  AND (
    gross_rental_yield IS NULL 
    OR median_weekly_rent IS NULL 
    OR median_property_value IS NULL 
    OR capital_growth_5yr IS NULL
  );

-- Expected: Should return 0 rows (all critical fields should be populated)

-- ============================================
-- 6. VERIFY PROPERTY CLASSIFICATION DISTRIBUTION
-- ============================================
-- Check that we have both house and unit data where expected
SELECT 
  suburb_name,
  state,
  postcode,
  COUNT(*) as record_count,
  STRING_AGG(property_classification, ', ' ORDER BY property_classification) as classifications
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
GROUP BY suburb_name, state, postcode
HAVING COUNT(*) > 1
ORDER BY suburb_name;

-- Expected: Many suburbs should have both 'house' and 'unit' records

-- ============================================
-- 7. VALIDATE YIELD RANGES
-- ============================================
-- Check that yields are within reasonable ranges
SELECT 
  property_classification,
  MIN(gross_rental_yield) as min_yield,
  MAX(gross_rental_yield) as max_yield,
  ROUND(AVG(gross_rental_yield), 2) as avg_yield,
  COUNT(*) as count
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
  AND gross_rental_yield IS NOT NULL
GROUP BY property_classification;

-- Expected: 
-- Houses: typically 2.1% - 4.8% (premium markets lower, outer ring higher)
-- Units: typically 3.2% - 5.78% (higher yields than houses)

-- ============================================
-- 8. CHECK FOR DUPLICATES
-- ============================================
-- Verify unique constraint is working (should return 0 rows)
SELECT 
  state,
  suburb_name,
  postcode,
  property_classification,
  COUNT(*) as duplicate_count
FROM benchmark_data
WHERE suburb_name IS NOT NULL
GROUP BY state, suburb_name, postcode, property_classification
HAVING COUNT(*) > 1;

-- Expected: 0 rows (unique constraint should prevent duplicates)

-- ============================================
-- 9. SAMPLE HIGH-QUALITY RECORDS
-- ============================================
-- View a sample of high-confidence records
SELECT 
  suburb_name,
  state,
  postcode,
  property_classification,
  gross_rental_yield,
  capital_growth_5yr,
  data_quality_score,
  data_source
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
  AND data_quality_score = 9
ORDER BY state, suburb_name
LIMIT 20;

-- Expected: Should show records with "CoreLogic + SQM Research" as source

-- ============================================
-- 10. COMPARE STATE-LEVEL VS SUBURB-LEVEL
-- ============================================
-- Verify state-level benchmarks still exist and suburb-level are more granular
SELECT 
  'State-level' as data_type,
  state,
  NULL as suburb_name,
  NULL as property_classification,
  ROUND(AVG(gross_rental_yield), 2) as avg_yield
FROM benchmark_data
WHERE suburb_name IS NULL
  AND is_active = true
GROUP BY state

UNION ALL

SELECT 
  'Suburb-level' as data_type,
  state,
  NULL as suburb_name,
  property_classification,
  ROUND(AVG(gross_rental_yield), 2) as avg_yield
FROM benchmark_data
WHERE suburb_name IS NOT NULL
  AND is_active = true
GROUP BY state, property_classification

ORDER BY state, data_type, property_classification;

-- Expected: Should show both state-level and suburb-level averages
--          Suburb-level should show variation (some higher, some lower than state average)

-- ============================================
-- SUCCESS CRITERIA
-- ============================================
-- All checks should pass:
-- ✓ Total records: ~65+ suburb records
-- ✓ States covered: 6 states (NSW, VIC, QLD, WA, SA, ACT)
-- ✓ Data quality: Most records score 7-9
-- ✓ No missing critical fields
-- ✓ Both house and unit data present
-- ✓ Yields in reasonable ranges
-- ✓ No duplicates
-- ✓ High-quality sources (CoreLogic + SQM Research)




