-- Create enum types for FIRB calculations
CREATE TYPE citizenship_status AS ENUM (
  'australian',
  'permanent',
  'temporary',
  'foreign'
);

CREATE TYPE property_type AS ENUM (
  'newDwelling',
  'established',
  'vacantLand',
  'commercial'
);

CREATE TYPE australian_state AS ENUM (
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'ACT',
  'NT'
);

CREATE TYPE entity_type AS ENUM (
  'individual',
  'company',
  'trust'
);

-- Create the main firb_calculations table
CREATE TABLE firb_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Shareable URL functionality
  share_url_slug TEXT UNIQUE NOT NULL,
  
  -- Citizenship data
  citizenship_status citizenship_status NOT NULL,
  visa_type TEXT,
  is_ordinarily_resident BOOLEAN,
  
  -- Property data
  property_type property_type NOT NULL,
  property_value DECIMAL(12, 2) NOT NULL CHECK (property_value > 0),
  property_state australian_state NOT NULL,
  property_address TEXT,
  is_first_home BOOLEAN DEFAULT false,
  deposit_percent DECIMAL(5, 2) CHECK (deposit_percent >= 0 AND deposit_percent <= 100),
  entity_type entity_type NOT NULL DEFAULT 'individual',
  
  -- Calculated results (stored as JSONB for flexibility and querying)
  eligibility_result JSONB NOT NULL,
  cost_breakdown JSONB NOT NULL,
  
  -- Metadata
  user_email TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'zh')),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_firb_calculations_created_at ON firb_calculations(created_at DESC);
CREATE INDEX idx_firb_calculations_share_url_slug ON firb_calculations(share_url_slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_firb_calculations_user_email ON firb_calculations(user_email) WHERE user_email IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_firb_calculations_property_state ON firb_calculations(property_state);

-- Create GIN index for JSONB columns for better query performance
CREATE INDEX idx_firb_calculations_eligibility_result ON firb_calculations USING GIN (eligibility_result);
CREATE INDEX idx_firb_calculations_cost_breakdown ON firb_calculations USING GIN (cost_breakdown);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_firb_calculations_updated_at
  BEFORE UPDATE ON firb_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE firb_calculations IS 'Stores FIRB (Foreign Investment Review Board) fee calculations with shareable URLs';
COMMENT ON COLUMN firb_calculations.share_url_slug IS 'Unique slug for shareable calculation URLs (e.g., /results/abc123)';
COMMENT ON COLUMN firb_calculations.eligibility_result IS 'JSONB object containing eligibility determination and requirements';
COMMENT ON COLUMN firb_calculations.cost_breakdown IS 'JSONB object containing detailed fee breakdown, totals, and annual costs';
COMMENT ON COLUMN firb_calculations.is_ordinarily_resident IS 'For temporary residents: whether they ordinarily reside in Australia';

-- Create view for public sharing (excludes email)
CREATE VIEW firb_calculations_public AS
SELECT
  id,
  created_at,
  share_url_slug,
  citizenship_status,
  property_type,
  property_value,
  property_state,
  is_first_home,
  entity_type,
  eligibility_result,
  cost_breakdown,
  locale
FROM firb_calculations
WHERE deleted_at IS NULL;

-- Row Level Security (RLS) policies
ALTER TABLE firb_calculations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for anonymous calculations)
CREATE POLICY "Allow anonymous inserts"
  ON firb_calculations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Anyone can read their own calculation by share_url_slug
CREATE POLICY "Allow read by share URL"
  ON firb_calculations
  FOR SELECT
  TO anon
  USING (deleted_at IS NULL);

-- Policy: Only authenticated users can update their own calculations
CREATE POLICY "Users can update own calculations"
  ON firb_calculations
  FOR UPDATE
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email')
  WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Policy: Only authenticated users can soft delete their own calculations
CREATE POLICY "Users can delete own calculations"
  ON firb_calculations
  FOR UPDATE
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email')
  WITH CHECK (deleted_at IS NOT NULL);

-- Create function to generate unique share URL slug
CREATE OR REPLACE FUNCTION generate_share_url_slug()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER := 0;
  random_index INTEGER;
BEGIN
  -- Generate 8 character random string
  FOR i IN 1..8 LOOP
    random_index := floor(random() * length(chars) + 1);
    result := result || substr(chars, random_index, 1);
  END LOOP;
  
  -- Check if exists, regenerate if needed
  WHILE EXISTS (SELECT 1 FROM firb_calculations WHERE share_url_slug = result) LOOP
    result := '';
    FOR i IN 1..8 LOOP
      random_index := floor(random() * length(chars) + 1);
      result := result || substr(chars, random_index, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Create trigger to auto-generate share_url_slug if not provided
CREATE OR REPLACE FUNCTION set_share_url_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_url_slug IS NULL OR NEW.share_url_slug = '' THEN
    NEW.share_url_slug := generate_share_url_slug();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_share_url_slug_on_insert
  BEFORE INSERT ON firb_calculations
  FOR EACH ROW
  EXECUTE FUNCTION set_share_url_slug();


