-- Add property_classification and bedrooms columns to cost_benchmarks table
-- These fields allow benchmarks to be scoped by unit/house and number of bedrooms

-- Add property_classification column (nullable for backward compatibility)
ALTER TABLE cost_benchmarks
ADD COLUMN IF NOT EXISTS property_classification TEXT CHECK (property_classification IN ('unit', 'house'));

-- Add bedrooms column (nullable for backward compatibility)
-- 0 = Studio, 1-5 = number of bedrooms
ALTER TABLE cost_benchmarks
ADD COLUMN IF NOT EXISTS bedrooms INTEGER CHECK (bedrooms IS NULL OR (bedrooms >= 0 AND bedrooms <= 5));

-- Drop the old unique constraint
DROP INDEX IF EXISTS idx_cost_benchmarks_unique;

-- Create new unique constraint that includes property_classification and bedrooms
-- This allows multiple benchmarks for the same state/property_type/metric combination
-- with different classifications and bedroom counts
CREATE UNIQUE INDEX idx_cost_benchmarks_unique 
ON cost_benchmarks(state, property_type, property_classification, bedrooms, metric) 
WHERE is_active = true;

-- Update the lookup index to include new fields for efficient querying
DROP INDEX IF EXISTS idx_cost_benchmarks_lookup;

CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_lookup 
ON cost_benchmarks(state, property_type, property_classification, bedrooms, metric, is_active);

-- Add comments
COMMENT ON COLUMN cost_benchmarks.property_classification IS 'Property classification: unit or house. NULL for backward compatibility with existing benchmarks.';
COMMENT ON COLUMN cost_benchmarks.bedrooms IS 'Number of bedrooms: 0 for studio, 1-5 for bedrooms. NULL for backward compatibility with existing benchmarks.';










