-- ============================================
-- INSERT MACRO BENCHMARKS
-- Run this in your PRODUCTION Supabase SQL Editor
-- ============================================
-- Data collected: January 2025
-- ============================================

-- Clear existing macro benchmarks (optional - only if you want to start fresh)
-- Uncomment the line below if you want to delete existing benchmarks first:
-- DELETE FROM macro_benchmarks WHERE is_active = true;

-- Insert Investment Category Benchmarks

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
    -- ASX Total Return
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
    
    -- Term Deposit Rate
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
    
    -- Bond Rate
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
    
    -- Savings Rate
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
    
    -- CGT Withholding
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
    
    -- Default Marginal Tax Rate
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
    
    -- Default Interest Rate
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
    
    -- Inflation Rate
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
    )
-- Note: If records already exist, you may need to deactivate old ones first
-- Or delete existing records, then run this INSERT

-- Alternative: If you want to update existing records, first deactivate old ones:
-- UPDATE macro_benchmarks SET is_active = false WHERE is_active = true;

-- Then insert new records (above INSERT will work as-is)

-- Verify the inserts
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

-- Expected output: 8 rows (4 investment, 2 tax, 2 financing)

