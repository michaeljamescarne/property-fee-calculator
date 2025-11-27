-- Phase 4: Benchmark Data System
-- Creates benchmark_data table for state/suburb-level rental yield and capital growth benchmarks

-- Ensure australian_state enum exists (from Phase 2)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'australian_state') THEN
    CREATE TYPE australian_state AS ENUM (
      'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'
    );
  END IF;
END $$;

-- Create benchmark_data table
CREATE TABLE IF NOT EXISTS benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geographic Identification
  state australian_state NOT NULL,
  suburb_name TEXT, -- NULL for state-level data
  postcode TEXT,
  
  -- Rental Yield Benchmarks
  gross_rental_yield DECIMAL(5, 2), -- Percentage (e.g., 4.50 for 4.5%)
  net_rental_yield DECIMAL(5, 2), -- Percentage
  median_weekly_rent DECIMAL(10, 2), -- AUD
  
  -- Capital Growth Benchmarks
  capital_growth_5yr DECIMAL(5, 2), -- Percentage per annum (e.g., 6.00 for 6%)
  capital_growth_10yr DECIMAL(5, 2), -- Percentage per annum
  median_property_value DECIMAL(12, 2), -- AUD
  
  -- Data Quality
  data_source TEXT,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  data_quality_score INTEGER CHECK (data_quality_score >= 1 AND data_quality_score <= 10),
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_benchmark_data_state ON benchmark_data(state);
CREATE INDEX IF NOT EXISTS idx_benchmark_data_suburb ON benchmark_data(suburb_name) WHERE suburb_name IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_benchmark_data_postcode ON benchmark_data(postcode) WHERE postcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_benchmark_data_active ON benchmark_data(is_active) WHERE is_active = true;

-- Create unique constraint using unique index (handles NULL values properly)
CREATE UNIQUE INDEX IF NOT EXISTS idx_benchmark_data_unique_location 
ON benchmark_data(state, COALESCE(suburb_name, ''), COALESCE(postcode, ''));

-- Create trigger function if it doesn't exist (from Phase 2)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS update_benchmark_data_updated_at ON benchmark_data;

-- Create trigger for updated_at
CREATE TRIGGER update_benchmark_data_updated_at
  BEFORE UPDATE ON benchmark_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE benchmark_data IS 'Stores rental yield and capital growth benchmarks by state/suburb';
COMMENT ON COLUMN benchmark_data.suburb_name IS 'NULL for state-level benchmarks, populated for suburb-level';
COMMENT ON COLUMN benchmark_data.gross_rental_yield IS 'Gross rental yield percentage (annual rent / property value * 100)';
COMMENT ON COLUMN benchmark_data.capital_growth_5yr IS '5-year average capital growth rate percentage per annum';
COMMENT ON COLUMN benchmark_data.capital_growth_10yr IS '10-year average capital growth rate percentage per annum';

-- Row Level Security (RLS)
ALTER TABLE benchmark_data ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (idempotent)
DROP POLICY IF EXISTS "Allow public read of active benchmarks" ON benchmark_data;
DROP POLICY IF EXISTS "Allow admin to manage benchmarks" ON benchmark_data;

-- Policy: Anyone can read active benchmarks (for calculator)
CREATE POLICY "Allow public read of active benchmarks"
  ON benchmark_data
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Only admins can insert/update/delete
CREATE POLICY "Allow admin to manage benchmarks"
  ON benchmark_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

