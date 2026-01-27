-- ============================================
-- INSERT BENCHMARK DATA - State-Level
-- Run this in your PRODUCTION Supabase SQL Editor
-- ============================================
-- Data collected: January-March 2025
-- ============================================

-- Step 1: Deactivate any existing state-level benchmarks (to avoid conflicts)
UPDATE benchmark_data 
SET is_active = false 
WHERE is_active = true 
AND suburb_name IS NULL;

-- Step 2: Insert state-level benchmark data

INSERT INTO benchmark_data (
    state,
    suburb_name,
    postcode,
    gross_rental_yield,
    net_rental_yield,
    median_weekly_rent,
    capital_growth_5yr,
    capital_growth_10yr,
    median_property_value,
    data_source,
    last_updated,
    data_quality_score,
    notes,
    is_active
) VALUES
    -- NSW
    (
        'NSW',
        NULL,
        NULL,
        3.20,
        2.00,
        650.00,
        5.50,
        6.70,
        1193228.00,
        'CoreLogic/PropTrack/Domain, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        8,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- VIC
    (
        'VIC',
        NULL,
        NULL,
        3.50,
        2.30,
        580.00,
        4.00,
        4.90,
        772317.00,
        'CoreLogic/PropTrack, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        8,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- QLD
    (
        'QLD',
        NULL,
        NULL,
        3.90,
        2.70,
        600.00,
        8.50,
        7.50,
        893592.00,
        'CoreLogic/PropTrack, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        9,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- SA
    (
        'SA',
        NULL,
        NULL,
        4.00,
        2.80,
        550.00,
        10.00,
        7.20,
        819363.00,
        'CoreLogic/PropTrack, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        9,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- WA
    (
        'WA',
        NULL,
        NULL,
        4.40,
        3.20,
        650.00,
        12.00,
        3.50,
        809870.00,
        'CoreLogic/PropTrack, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        9,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- TAS
    (
        'TAS',
        NULL,
        NULL,
        3.90,
        2.70,
        539.00,
        4.50,
        10.00,
        777000.00,
        'Cotality/SQM Research/Aussie, Apr 2025 (Hobart House)',
        CURRENT_DATE,
        7,
        'State-wide averages for established dwellings - Hobart House data',
        true
    ),
    
    -- ACT
    (
        'ACT',
        NULL,
        NULL,
        4.30,
        3.10,
        620.00,
        5.00,
        4.80,
        965910.00,
        'CoreLogic/REIA/PropTrack, Jan-Mar 2025 (Capital City)',
        CURRENT_DATE,
        8,
        'State-wide averages for established dwellings - Capital City data',
        true
    ),
    
    -- NT
    (
        'NT',
        NULL,
        NULL,
        5.80,
        4.60,
        669.00,
        -1.50,
        3.10,
        603669.00,
        'CoreLogic/NT Economy, Mar/Aug 2025 (Darwin House)',
        CURRENT_DATE,
        7,
        'State-wide averages for established dwellings - Darwin House data. Note: Negative 5-year growth reflects recent market conditions.',
        true
    );

-- Step 3: Verify the inserts

SELECT 
    state,
    gross_rental_yield,
    net_rental_yield,
    median_weekly_rent,
    capital_growth_5yr,
    capital_growth_10yr,
    median_property_value,
    data_source,
    data_quality_score,
    is_active
FROM benchmark_data
WHERE is_active = true
AND suburb_name IS NULL
ORDER BY state;

-- Expected output: 8 rows (one for each state)












