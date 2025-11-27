-- Phase 4: Seed Initial Benchmark Data
-- Populates state-level rental yield and capital growth benchmarks
-- Based on 2024-2025 market data and historical averages

-- Insert state-level benchmarks for all Australian states and territories
-- Note: suburb_name and postcode are NULL for state-level data

INSERT INTO benchmark_data (
  state,
  suburb_name,
  postcode,
  gross_rental_yield,
  net_rental_yield,
  capital_growth_5yr,
  capital_growth_10yr,
  data_source,
  last_updated,
  data_quality_score,
  notes,
  is_active,
  version
) VALUES
  -- New South Wales (NSW)
  (
    'NSW',
    NULL, -- State-level benchmark
    NULL,
    3.20, -- 3.2% gross rental yield (Sydney metro average)
    2.50, -- ~2.5% net yield (after expenses)
    5.50, -- 5.5% average annual capital growth (5-year)
    5.80, -- 5.8% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Sydney and NSW regional averages. Sydney metro yields typically 2.8-3.5%, regional areas 4-6%.',
    true,
    1
  ),
  
  -- Victoria (VIC)
  (
    'VIC',
    NULL,
    NULL,
    3.40, -- 3.4% gross rental yield (Melbourne metro average)
    2.60, -- ~2.6% net yield
    5.20, -- 5.2% average annual capital growth (5-year)
    5.50, -- 5.5% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Melbourne and VIC regional averages. Melbourne metro yields typically 3.0-3.8%, regional areas 4-5.5%.',
    true,
    1
  ),
  
  -- Queensland (QLD)
  (
    'QLD',
    NULL,
    NULL,
    4.50, -- 4.5% gross rental yield (Brisbane metro average)
    3.50, -- ~3.5% net yield
    4.80, -- 4.8% average annual capital growth (5-year)
    5.00, -- 5.0% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Brisbane and QLD regional averages. Brisbane metro yields typically 4.0-5.0%, regional areas 5-7%.',
    true,
    1
  ),
  
  -- Western Australia (WA)
  (
    'WA',
    NULL,
    NULL,
    4.20, -- 4.2% gross rental yield (Perth metro average)
    3.30, -- ~3.3% net yield
    3.50, -- 3.5% average annual capital growth (5-year)
    3.80, -- 3.8% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Perth and WA regional averages. Perth metro yields typically 3.8-4.8%, regional areas 5-7%.',
    true,
    1
  ),
  
  -- South Australia (SA)
  (
    'SA',
    NULL,
    NULL,
    4.10, -- 4.1% gross rental yield (Adelaide metro average)
    3.20, -- ~3.2% net yield
    4.50, -- 4.5% average annual capital growth (5-year)
    4.70, -- 4.7% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Adelaide and SA regional averages. Adelaide metro yields typically 3.8-4.5%, regional areas 5-6%.',
    true,
    1
  ),
  
  -- Tasmania (TAS)
  (
    'TAS',
    NULL,
    NULL,
    4.80, -- 4.8% gross rental yield (Hobart metro average)
    3.70, -- ~3.7% net yield
    5.20, -- 5.2% average annual capital growth (5-year)
    5.40, -- 5.4% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    7,
    'Based on Hobart and TAS regional averages. Hobart metro yields typically 4.5-5.2%, regional areas 5-7%.',
    true,
    1
  ),
  
  -- Australian Capital Territory (ACT)
  (
    'ACT',
    NULL,
    NULL,
    3.80, -- 3.8% gross rental yield (Canberra average)
    2.90, -- ~2.9% net yield
    5.00, -- 5.0% average annual capital growth (5-year)
    5.20, -- 5.2% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    8,
    'Based on Canberra averages. Yields typically 3.5-4.2%. Strong rental demand due to stable government employment.',
    true,
    1
  ),
  
  -- Northern Territory (NT)
  (
    'NT',
    NULL,
    NULL,
    5.50, -- 5.5% gross rental yield (Darwin average)
    4.30, -- ~4.3% net yield
    2.50, -- 2.5% average annual capital growth (5-year)
    2.80, -- 2.8% average annual capital growth (10-year)
    'CoreLogic / Domain Research (2024-2025)',
    CURRENT_DATE,
    7,
    'Based on Darwin and NT regional averages. Higher yields but lower capital growth. Yields typically 5.0-6.5%.',
    true,
    1
  )
ON CONFLICT (state, COALESCE(suburb_name, ''), COALESCE(postcode, '')) 
DO UPDATE SET
  gross_rental_yield = EXCLUDED.gross_rental_yield,
  net_rental_yield = EXCLUDED.net_rental_yield,
  capital_growth_5yr = EXCLUDED.capital_growth_5yr,
  capital_growth_10yr = EXCLUDED.capital_growth_10yr,
  data_source = EXCLUDED.data_source,
  data_quality_score = EXCLUDED.data_quality_score,
  notes = EXCLUDED.notes,
  last_updated = EXCLUDED.last_updated,
  updated_at = NOW(),
  is_active = EXCLUDED.is_active,
  version = EXCLUDED.version + 1;

-- Add comment
COMMENT ON TABLE benchmark_data IS 'State-level benchmarks seeded on 2025-01-17. Suburb-level data can be added via admin interface.';

