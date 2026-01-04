-- Add property_classification field to benchmark_data table
-- This allows distinguishing between House and Unit benchmarks

-- Add property_classification column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'benchmark_data' 
    AND column_name = 'property_classification'
  ) THEN
    ALTER TABLE benchmark_data 
    ADD COLUMN property_classification TEXT CHECK (property_classification IN ('house', 'unit', NULL));
    
    COMMENT ON COLUMN benchmark_data.property_classification IS 'Property type: house or unit. NULL for combined/unspecified benchmarks.';
  END IF;
END $$;

-- Drop the old unique index
DROP INDEX IF EXISTS idx_benchmark_data_unique_location;

-- Create new unique index that includes property_classification
CREATE UNIQUE INDEX IF NOT EXISTS idx_benchmark_data_unique_location 
ON benchmark_data(
  state, 
  COALESCE(suburb_name, ''), 
  COALESCE(postcode, ''),
  COALESCE(property_classification, '')
);

-- Create index for property_classification queries
CREATE INDEX IF NOT EXISTS idx_benchmark_data_property_classification 
ON benchmark_data(property_classification) 
WHERE property_classification IS NOT NULL;










