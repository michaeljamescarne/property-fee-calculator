-- Phase 1 Suburb Benchmarks Data Insertion
-- Based on Property Market Data Expansion analysis (2025)
-- Contains 65 priority suburbs across major capital cities
-- Data includes separate House and Unit benchmarks where available

-- Note: This migration requires the property_classification field added in 20250120_add_property_classification_to_benchmarks.sql

-- IMPORTANT NOTES:
-- 1. capital_growth_5yr uses 12-month growth data from PDF as proxy (will be refined with actual 5yr averages)
-- 2. capital_growth_10yr is NULL (not provided in Phase 1 data)
-- 3. net_rental_yield is NULL (not explicitly provided, can be calculated as ~75-80% of gross yield)
-- 4. Data quality scores: 9 = High confidence (triangulated), 8 = Medium-high, 7 = Medium confidence

-- NSW Suburbs
INSERT INTO benchmark_data (
  state,
  suburb_name,
  postcode,
  property_classification,
  gross_rental_yield,
  net_rental_yield, -- NULL for now, can be calculated as ~75-80% of gross
  median_weekly_rent,
  median_property_value,
  capital_growth_5yr, -- Using 12-month growth as proxy (from PDF "12m Growth" column)
  capital_growth_10yr, -- NULL (not available in Phase 1 data)
  data_source,
  last_updated,
  data_quality_score,
  notes,
  is_active,
  version
) VALUES
  -- Sydney Inner City
  ('NSW', 'Surry Hills', '2010', 'house', 2.80, NULL, 850, 1575000, 8.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Surry Hills', '2010', 'unit', 3.50, NULL, 650, 965000, 5.20, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Bondi', '2026', 'house', 2.10, NULL, 1200, 2970000, 4.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Premium market, yield compression', true, 1),
  ('NSW', 'Bondi', '2026', 'unit', 3.20, NULL, 750, 1218000, 6.80, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Affordable luxury unit market', true, 1),
  ('NSW', 'Mosman', '2088', 'house', 2.10, NULL, 1200, 2970000, 1.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Affordability ceiling reached', true, 1),
  ('NSW', 'Mosman', '2088', 'unit', 3.50, NULL, 750, 1114000, 4.20, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Substitution effect from houses', true, 1),
  ('NSW', 'Parramatta', '2150', 'house', 3.20, NULL, 750, 1218000, 30.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Ripple effect, high growth', true, 1),
  ('NSW', 'Parramatta', '2150', 'unit', 5.50, NULL, 550, 520000, 8.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High yield signature', true, 1),
  ('NSW', 'Penrith', '2750', 'house', 3.80, NULL, 550, 752000, 6.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'Outer ring growth corridor', true, 1),
  ('NSW', 'Maroubra', '2035', 'house', 2.80, NULL, 900, 1671000, 5.50, NULL, 'Domain House Price Report (2024-2025)', CURRENT_DATE, 7, 'Medium confidence, extrapolated', true, 1),
  ('NSW', 'North Sydney', '2060', 'unit', 3.80, NULL, 700, 958000, 4.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Chatswood', '2067', 'house', 2.50, NULL, 1000, 2080000, 3.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Premium market', true, 1),
  ('NSW', 'Chatswood', '2067', 'unit', 3.20, NULL, 650, 1056000, 5.20, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Manly', '2095', 'house', 2.40, NULL, 1100, 2383000, 4.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Lifestyle premium market', true, 1),
  ('NSW', 'Manly', '2095', 'unit', 3.50, NULL, 750, 1114000, 5.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Newtown', '2042', 'house', 2.90, NULL, 850, 1525000, 7.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Newtown', '2042', 'unit', 3.80, NULL, 600, 821000, 6.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Paddington', '2021', 'house', 2.30, NULL, 1100, 2487000, 3.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Premium inner city', true, 1),
  ('NSW', 'Paddington', '2021', 'unit', 3.40, NULL, 750, 1147000, 5.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Pyrmont', '2009', 'unit', 3.60, NULL, 700, 1011000, 5.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High density investment hub', true, 1),
  ('NSW', 'Potts Point', '2011', 'unit', 3.80, NULL, 650, 890000, 4.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Coogee', '2034', 'house', 2.60, NULL, 950, 1900000, 5.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Coogee', '2034', 'unit', 3.50, NULL, 700, 1040000, 6.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Randwick', '2031', 'house', 2.70, NULL, 900, 1733000, 5.20, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('NSW', 'Randwick', '2031', 'unit', 3.40, NULL, 650, 994000, 5.80, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),

  -- Victoria Suburbs
  ('VIC', 'Hawthorn', '3122', 'house', 2.50, NULL, 900, 1872000, 2.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Affordability ceiling reached', true, 1),
  ('VIC', 'Hawthorn', '3122', 'unit', 3.80, NULL, 650, 889000, 5.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Substitution effect from houses', true, 1),
  ('VIC', 'Box Hill', '3128', 'house', 2.80, NULL, 750, 1393000, -19.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Significant correction', true, 1),
  ('VIC', 'Box Hill', '3128', 'unit', 4.20, NULL, 550, 681000, 3.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'Footscray', '3011', 'house', 3.50, NULL, 600, 891000, 8.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'Footscray', '3011', 'unit', 5.78, NULL, 450, 404000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Exceptional yield, high growth', true, 1),
  ('VIC', 'Carlton', '3053', 'house', 2.90, NULL, 700, 1255000, -5.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Investor tax exodus impact', true, 1),
  ('VIC', 'Carlton', '3053', 'unit', 5.20, NULL, 500, 500000, 2.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Decade high yields, low vacancy', true, 1),
  ('VIC', 'Southbank', '3006', 'unit', 5.10, NULL, 550, 561000, 3.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Decade high yields, 1.1% vacancy', true, 1),
  ('VIC', 'Richmond', '3121', 'house', 2.60, NULL, 800, 1600000, 3.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'Richmond', '3121', 'unit', 4.00, NULL, 600, 780000, 5.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'St Kilda', '3182', 'house', 2.80, NULL, 750, 1393000, 4.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'St Kilda', '3182', 'unit', 4.20, NULL, 550, 681000, 6.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('VIC', 'Werribee', '3030', 'house', 4.50, NULL, 450, 520000, 8.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'Affordability play, outer ring', true, 1),
  ('VIC', 'Werribee', '3030', 'unit', 5.20, NULL, 380, 380000, 9.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'High yield, growth corridor', true, 1),

  -- Queensland Suburbs
  ('QLD', 'New Farm', '4005', 'house', 3.20, NULL, 900, 1462500, 15.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Supply-constraint boom, luxury market', true, 1),
  ('QLD', 'New Farm', '4005', 'unit', 4.50, NULL, 650, 750000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('QLD', 'Fortitude Valley', '4006', 'unit', 5.20, NULL, 550, 550000, 15.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Supply-constraint boom', true, 1),
  ('QLD', 'Scarborough', '6019', 'unit', 4.98, NULL, 550, 575000, 15.38, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Supply-constraint boom anomaly', true, 1),
  ('QLD', 'North Lakes', '4509', 'house', 4.80, NULL, 550, 595000, 10.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'High yield, high growth dynamics', true, 1),
  ('QLD', 'North Lakes', '4509', 'unit', 5.50, NULL, 450, 425000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'Outer Brisbane corridor', true, 1),
  ('QLD', 'South Brisbane', '4101', 'unit', 4.80, NULL, 550, 595000, 10.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('QLD', 'Teneriffe', '4005', 'house', 3.00, NULL, 950, 1647000, 14.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Premium inner city', true, 1),
  ('QLD', 'Teneriffe', '4005', 'unit', 4.20, NULL, 650, 805000, 11.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('QLD', 'West End', '4101', 'house', 3.50, NULL, 700, 1040000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('QLD', 'West End', '4101', 'unit', 4.80, NULL, 550, 595000, 10.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),

  -- Western Australia Suburbs
  ('WA', 'Scarborough', '6019', 'house', 4.20, NULL, 700, 867000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Supply-constraint boom', true, 1),
  ('WA', 'Scarborough', '6019', 'unit', 4.98, NULL, 550, 575000, 15.38, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Supply-constraint boom anomaly', true, 1),
  ('WA', 'Fremantle', '6160', 'house', 4.50, NULL, 650, 751000, 10.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('WA', 'Fremantle', '6160', 'unit', 5.20, NULL, 500, 500000, 12.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('WA', 'Subiaco', '6008', 'house', 3.80, NULL, 750, 1026000, 8.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('WA', 'Subiaco', '6008', 'unit', 4.50, NULL, 600, 693000, 9.50, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('WA', 'Northbridge', '6003', 'unit', 5.00, NULL, 550, 572000, 11.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('WA', 'Cottesloe', '6011', 'house', 2.80, NULL, 1000, 1857000, 6.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Premium beachside', true, 1),
  ('WA', 'Cottesloe', '6011', 'unit', 4.00, NULL, 700, 910000, 8.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),

  -- South Australia Suburbs
  ('SA', 'Norwood', '5067', 'house', 2.60, NULL, 670, 1562500, 25.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Luxury market re-rating', true, 1),
  ('SA', 'Norwood', '5067', 'unit', 4.04, NULL, 610, 690000, 2.60, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'High confidence triangulated data', true, 1),
  ('SA', 'Glenelg', '5045', 'house', 2.34, NULL, 650, 1406500, -10.90, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Luxury correction, flight to value', true, 1),
  ('SA', 'Glenelg', '5045', 'unit', 3.86, NULL, 550, 641000, 7.06, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Affordable units showing growth', true, 1),
  ('SA', 'Adelaide', '5000', 'unit', 5.50, NULL, 500, 457944, 7.60, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'CBD high yield', true, 1),
  ('SA', 'North Adelaide', '5006', 'house', 2.80, NULL, 650, 1210000, 18.30, NULL, 'Domain House Price Report (2024-2025)', CURRENT_DATE, 7, 'Medium confidence', true, 1),

  -- ACT Suburbs
  ('ACT', 'Braddon', '2612', 'house', 3.34, NULL, 785, 1195000, -14.80, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 8, 'Post-hype correction', true, 1),
  ('ACT', 'Braddon', '2612', 'unit', 5.71, NULL, 600, 572500, 3.75, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 9, 'Resilient unit market, income play', true, 1),
  ('ACT', 'Kingston', '2604', 'unit', 5.40, NULL, 620, 600000, 1.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 7, 'Stable, diplomatic workforce', true, 1),
  ('ACT', 'Dickson', '2602', 'house', 3.10, NULL, 750, 1250000, 3.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 7, 'Medium confidence', true, 1),
  ('ACT', 'Griffith', '2603', 'unit', 5.20, NULL, 650, 650000, 2.00, NULL, 'CoreLogic + SQM Research (2024-2025)', CURRENT_DATE, 7, 'Medium confidence', true, 1)

ON CONFLICT (state, COALESCE(suburb_name, ''), COALESCE(postcode, ''), COALESCE(property_classification, ''))
DO UPDATE SET
  gross_rental_yield = EXCLUDED.gross_rental_yield,
  net_rental_yield = EXCLUDED.net_rental_yield,
  median_weekly_rent = EXCLUDED.median_weekly_rent,
  median_property_value = EXCLUDED.median_property_value,
  capital_growth_5yr = EXCLUDED.capital_growth_5yr,
  capital_growth_10yr = EXCLUDED.capital_growth_10yr,
  data_source = EXCLUDED.data_source,
  data_quality_score = EXCLUDED.data_quality_score,
  notes = EXCLUDED.notes,
  last_updated = EXCLUDED.last_updated,
  updated_at = NOW(),
  is_active = EXCLUDED.is_active,
  version = benchmark_data.version + 1;

-- Add comment
COMMENT ON TABLE benchmark_data IS 'Phase 1 suburb benchmarks added 2025-01-20. Includes 65 priority suburbs with House and Unit classifications.';

