-- Macro Benchmarks Table
-- Stores global benchmarks for investment comparisons, tax rates, financing rates

-- Ensure enums exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'macro_category') THEN
    CREATE TYPE macro_category AS ENUM (
      'investment',
      'tax',
      'financing'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'macro_metric') THEN
    CREATE TYPE macro_metric AS ENUM (
      'asx_total_return',
      'term_deposit_rate',
      'bond_rate',
      'savings_rate',
      'cgt_withholding',
      'default_marginal_tax_rate',
      'default_interest_rate',
      'inflation_rate'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'macro_unit') THEN
    CREATE TYPE macro_unit AS ENUM (
      'percent',
      'percentage_points',
      'basis_points'
    );
  END IF;
END $$;

-- Create macro_benchmarks table
CREATE TABLE IF NOT EXISTS macro_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Classification
  category macro_category NOT NULL,
  metric macro_metric NOT NULL,
  
  -- Value
  value_numeric DECIMAL(12, 4) NOT NULL,
  unit macro_unit NOT NULL DEFAULT 'percent',
  
  -- Metadata
  data_source TEXT,
  refresh_cadence TEXT, -- e.g., 'monthly', 'quarterly', 'annually'
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_macro_benchmarks_category ON macro_benchmarks(category);
CREATE INDEX IF NOT EXISTS idx_macro_benchmarks_metric ON macro_benchmarks(metric);
CREATE INDEX IF NOT EXISTS idx_macro_benchmarks_active ON macro_benchmarks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_macro_benchmarks_lookup ON macro_benchmarks(category, metric, is_active);

-- Create unique constraint (one active benchmark per metric)
CREATE UNIQUE INDEX IF NOT EXISTS idx_macro_benchmarks_unique 
ON macro_benchmarks(metric) 
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
DROP TRIGGER IF EXISTS update_macro_benchmarks_updated_at ON macro_benchmarks;

-- Create trigger for updated_at
CREATE TRIGGER update_macro_benchmarks_updated_at
  BEFORE UPDATE ON macro_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE macro_benchmarks IS 'Stores global benchmarks for investment comparisons, tax rates, and financing rates';
COMMENT ON COLUMN macro_benchmarks.category IS 'Category of benchmark (investment, tax, financing)';
COMMENT ON COLUMN macro_benchmarks.metric IS 'Specific metric name (asx_total_return, term_deposit_rate, etc.)';
COMMENT ON COLUMN macro_benchmarks.refresh_cadence IS 'Recommended refresh frequency (monthly, quarterly, annually)';

-- Row Level Security (RLS)
ALTER TABLE macro_benchmarks ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (idempotent)
DROP POLICY IF EXISTS "Allow public read of active macro benchmarks" ON macro_benchmarks;
DROP POLICY IF EXISTS "Allow admin to manage macro benchmarks" ON macro_benchmarks;

-- Policy: Anyone can read active benchmarks (for calculator)
CREATE POLICY "Allow public read of active macro benchmarks"
  ON macro_benchmarks
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policy: Only admins can insert/update/delete
CREATE POLICY "Allow admin to manage macro benchmarks"
  ON macro_benchmarks
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






