-- Create properties tables
-- Tables for tracking user properties with transactional cost tracking

-- Create enum types (with error handling for existing types)
DO $$ 
BEGIN
    CREATE TYPE property_status AS ENUM ('active', 'sold', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE loan_type AS ENUM ('principalAndInterest', 'interestOnly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE transaction_category AS ENUM (
        'purchase_cost',
        'improvement',
        'maintenance',
        'council_rates',
        'water_rates',
        'gas',
        'electricity',
        'insurance',
        'strata_fees',
        'property_management',
        'letting_fees',
        'land_tax',
        'vacancy_fee',
        'depreciation_report',
        'accounting_fees',
        'legal_fees',
        'loan_interest',
        'loan_repayment',
        'rental_income',
        'other_income',
        'sale_cost',
        'other_expense'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE transaction_type AS ENUM (
        'income',
        'expense',
        'capital'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE TYPE recurring_frequency AS ENUM ('monthly', 'quarterly', 'annually');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Property Details (from calculation or manual entry)
  property_name TEXT,
  property_address TEXT NOT NULL,
  property_state australian_state NOT NULL,
  property_type property_type NOT NULL,
  property_classification TEXT CHECK (property_classification IN ('unit', 'house') OR property_classification IS NULL),
  bedrooms INTEGER,
  
  -- Purchase Information
  purchase_date DATE NOT NULL,
  purchase_price DECIMAL(12, 2) NOT NULL CHECK (purchase_price > 0),
  purchase_costs DECIMAL(12, 2) DEFAULT 0,
  deposit_amount DECIMAL(12, 2),
  loan_amount DECIMAL(12, 2),
  
  -- Current State
  current_value DECIMAL(12, 2),
  current_loan_balance DECIMAL(12, 2),
  interest_rate DECIMAL(5, 2),
  loan_term_years INTEGER,
  loan_type loan_type,
  
  -- Rental Information (if applicable)
  is_rental BOOLEAN DEFAULT false,
  weekly_rent DECIMAL(10, 2),
  property_management_fee_percent DECIMAL(5, 2),
  
  -- Status
  status property_status DEFAULT 'active',
  sold_date DATE,
  sale_price DECIMAL(12, 2),
  sale_costs DECIMAL(12, 2),
  
  -- Links
  source_calculation_id UUID REFERENCES saved_calculations(id) ON DELETE SET NULL,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Create indexes for properties
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_properties_purchase_date ON properties(purchase_date);
CREATE INDEX IF NOT EXISTS idx_properties_user_status ON properties(user_id, status, deleted_at) WHERE deleted_at IS NULL;

-- Create trigger for updated_at (reuse existing function)
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE properties IS 'User property records for tracking owned properties';
COMMENT ON COLUMN properties.source_calculation_id IS 'Reference to saved_calculations if property was converted from a calculation';
COMMENT ON COLUMN properties.current_value IS 'Latest property valuation';

-- Create property_transactions table
CREATE TABLE IF NOT EXISTS property_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction Details
  transaction_date DATE NOT NULL,
  category transaction_category NOT NULL,
  type transaction_type NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  
  -- Tax/Deduction Information
  is_tax_deductible BOOLEAN DEFAULT false,
  is_capital_improvement BOOLEAN DEFAULT false,
  
  -- Recurring Transaction Support
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency recurring_frequency,
  recurring_end_date DATE,
  
  -- Metadata
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Create indexes for property_transactions
CREATE INDEX IF NOT EXISTS idx_property_transactions_property_id ON property_transactions(property_id, transaction_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_property_transactions_category ON property_transactions(category);
CREATE INDEX IF NOT EXISTS idx_property_transactions_date_range ON property_transactions(property_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_property_transactions_property_category ON property_transactions(property_id, transaction_date, category) WHERE deleted_at IS NULL;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_property_transactions_updated_at ON property_transactions;
CREATE TRIGGER update_property_transactions_updated_at
  BEFORE UPDATE ON property_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE property_transactions IS 'Transactional expense and income entries for properties';
COMMENT ON COLUMN property_transactions.is_capital_improvement IS 'If true, affects cost base for CGT calculations';
COMMENT ON COLUMN property_transactions.recurring_frequency IS 'Frequency for recurring transactions (monthly, quarterly, annually)';

-- Create property_value_history table
CREATE TABLE IF NOT EXISTS property_value_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Valuation Details
  valuation_date DATE NOT NULL,
  value DECIMAL(12, 2) NOT NULL CHECK (value > 0),
  valuation_type TEXT NOT NULL CHECK (valuation_type IN ('market', 'bank', 'agent', 'user_estimate')),
  valuation_source TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for property_value_history
CREATE INDEX IF NOT EXISTS idx_property_value_history_property_id ON property_value_history(property_id, valuation_date DESC);

-- Add comments for documentation
COMMENT ON TABLE property_value_history IS 'Historical property valuations and value changes over time';
COMMENT ON COLUMN property_value_history.valuation_type IS 'Source of valuation: market, bank, agent, or user_estimate';

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_value_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role full access" ON properties;
DROP POLICY IF EXISTS "Users can manage own properties" ON properties;
DROP POLICY IF EXISTS "Allow service role full access" ON property_transactions;
DROP POLICY IF EXISTS "Users can manage transactions for own properties" ON property_transactions;
DROP POLICY IF EXISTS "Allow service role full access" ON property_value_history;
DROP POLICY IF EXISTS "Users can manage value history for own properties" ON property_value_history;

-- Properties table RLS policies
CREATE POLICY "Allow service role full access"
  ON properties FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage own properties"
  ON properties FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Property transactions table RLS policies
CREATE POLICY "Allow service role full access"
  ON property_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage transactions for own properties"
  ON property_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_transactions.property_id
      AND properties.user_id = auth.uid()
      AND properties.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_transactions.property_id
      AND properties.user_id = auth.uid()
      AND properties.deleted_at IS NULL
    )
  );

-- Property value history table RLS policies
CREATE POLICY "Allow service role full access"
  ON property_value_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage value history for own properties"
  ON property_value_history FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_value_history.property_id
      AND properties.user_id = auth.uid()
      AND properties.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_value_history.property_id
      AND properties.user_id = auth.uid()
      AND properties.deleted_at IS NULL
    )
  );

