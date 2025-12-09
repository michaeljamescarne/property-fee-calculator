-- ============================================
-- INSERT MACRO BENCHMARKS - Production Ready
-- Run this in your PRODUCTION Supabase SQL Editor
-- ============================================
-- Data collected: January 2025
-- ============================================

-- Step 1: Deactivate any existing benchmarks (to avoid conflicts)
UPDATE macro_benchmarks 
SET is_active = false 
WHERE is_active = true;

-- Step 2: Insert new benchmark values

INSERT INTO macro_benchmarks (
    category,
    metric,
    value_numeric,
    unit,
    data_source,
    refresh_cadence,
    last_updated,
    notes,
    is_active
) VALUES
    -- Investment Category
    (
        'investment',
        'asx_total_return',
        12.80,
        'percent',
        'S&P/ASX 200 Accumulation Index tracker performance',
        'quarterly',
        CURRENT_DATE,
        'Based on recent 5-year average total return data from S&P/ASX 200 Accumulation Index',
        true
    ),
    (
        'investment',
        'term_deposit_rate',
        5.00,
        'percent',
        'Average of highest advertised 1-year rates from comparison sites',
        'monthly',
        CURRENT_DATE,
        'Average of highest advertised 1-year rates from comparison sites (e.g., Heartland/Judo)',
        true
    ),
    (
        'investment',
        'bond_rate',
        4.56,
        'percent',
        'Australian 10-year Government Bond yield',
        'monthly',
        CURRENT_DATE,
        'Yield for the Australian 10-year bond as of early December 2025',
        true
    ),
    (
        'investment',
        'savings_rate',
        5.00,
        'percent',
        'Highest current promotional rate on Canstar/RateCity',
        'monthly',
        CURRENT_DATE,
        'Highest current promotional rate (e.g., Rabobank, Westpac Life)',
        true
    ),
    
    -- Tax Category
    (
        'tax',
        'cgt_withholding',
        15.0,
        'percent',
        'ATO',
        'annually',
        CURRENT_DATE,
        'ATO rate for contracts signed on or after 1 January 2025 (increased from 12.5%)',
        true
    ),
    (
        'tax',
        'default_marginal_tax_rate',
        37.0,
        'percent',
        'ATO',
        'annually',
        CURRENT_DATE,
        'The tax bracket structure changed under Stage 3 cuts, but using 37% as the default marginal rate for high-income calculations',
        true
    ),
    
    -- Financing Category
    (
        'financing',
        'default_interest_rate',
        6.5,
        'percent',
        'Standard variable mortgage rates (Big 4 average)',
        'monthly',
        CURRENT_DATE,
        'Standard variable owner occupier rate - average of lower end Big 4 packaged rates and higher non-packaged rates to represent typical standard rate',
        true
    ),
    (
        'financing',
        'inflation_rate',
        3.8,
        'percent',
        'ABS',
        'quarterly',
        CURRENT_DATE,
        'Latest annual All Groups CPI increase for the 12 months to October 2025 (ABS monthly CPI)',
        true
    );

-- Step 3: Verify the inserts

SELECT 
    category,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated,
    is_active
FROM macro_benchmarks
WHERE is_active = true
ORDER BY category, metric;

-- Expected output: 8 rows
-- - 4 investment metrics
-- - 2 tax metrics  
-- - 2 financing metrics




