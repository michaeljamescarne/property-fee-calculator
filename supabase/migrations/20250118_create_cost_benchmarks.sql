-- Cost Benchmarks Table
-- Stores state/property-type scoped cost benchmarks (council rates, insurance, maintenance, etc.)

-- Ensure enums exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'australian_state') THEN
    CREATE TYPE australian_state AS ENUM (
      'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    CREATE TYPE property_type AS ENUM (
      'newDwelling', 'established', 'vacantLand', 'commercial'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cost_metric') THEN
    CREATE TYPE cost_metric AS ENUM (
      'council_rate_percent',
      'insurance_percent',
      'maintenance_percent',
      'vacancy_rate_percent',
      'management_fee_percent',
      'letting_fee_weeks',
      'rent_growth_percent',
      'interest_rate_percent',
      'selling_costs_percent',
      'loan_cost_basis_points',
      'strata_fee_percent'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cost_unit') THEN
    CREATE TYPE cost_unit AS ENUM (
      'percent',
      'percent_of_value',
      'weeks',
      'currency',
      'basis_points',
      'percentage_points'
    );
  END IF;
END $$;

-- Create cost_benchmarks table
CREATE TABLE IF NOT EXISTS cost_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Scoping
  state australian_state NOT NULL,
  property_type property_type NOT NULL,
  metric cost_metric NOT NULL,
  
  -- Value
  value_numeric DECIMAL(12, 4) NOT NULL,
  unit cost_unit NOT NULL DEFAULT 'percent',
  
  -- Metadata
  data_source TEXT,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_state ON cost_benchmarks(state);
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_property_type ON cost_benchmarks(property_type);
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_metric ON cost_benchmarks(metric);
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_active ON cost_benchmarks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_lookup ON cost_benchmarks(state, property_type, metric, is_active);

-- Create unique constraint for active records (partial unique index for querying)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cost_benchmarks_unique 
ON cost_benchmarks(state, property_type, metric) 
WHERE is_active = true;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS update_cost_benchmarks_updated_at ON cost_benchmarks;

-- Create trigger for updated_at
CREATE TRIGGER update_cost_benchmarks_updated_at
  BEFORE UPDATE ON cost_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE cost_benchmarks IS 'Stores cost benchmarks by state and property type (council rates, insurance, maintenance, etc.)';
COMMENT ON COLUMN cost_benchmarks.metric IS 'The type of cost metric (council_rate_percent, insurance_percent, etc.)';
COMMENT ON COLUMN cost_benchmarks.value_numeric IS 'The numeric value of the benchmark';
COMMENT ON COLUMN cost_benchmarks.unit IS 'The unit of measurement (percent, currency, weeks, etc.)';

-- Row Level Security (RLS)
ALTER TABLE cost_benchmarks ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (idempotent)
DROP POLICY IF EXISTS "Allow public read of active cost benchmarks" ON cost_benchmarks;
DROP POLICY IF EXISTS "Allow admin to manage cost benchmarks" ON cost_benchmarks;

-- Policy: Anyone can read active benchmarks (for calculator)
CREATE POLICY "Allow public read of active cost benchmarks"
  ON cost_benchmarks
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Only admins can insert/update/delete
CREATE POLICY "Allow admin to manage cost benchmarks"
  ON cost_benchmarks
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

