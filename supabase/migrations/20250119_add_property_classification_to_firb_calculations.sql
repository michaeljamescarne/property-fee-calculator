-- Add property_classification and bedrooms columns to firb_calculations table
-- These fields store the user's selections for saved calculations

-- Add property_classification column (nullable)
ALTER TABLE firb_calculations
ADD COLUMN IF NOT EXISTS property_classification TEXT CHECK (property_classification IS NULL OR property_classification IN ('unit', 'house'));

-- Add bedrooms column (nullable)
-- 0 = Studio, 1-5 = number of bedrooms
ALTER TABLE firb_calculations
ADD COLUMN IF NOT EXISTS bedrooms INTEGER CHECK (bedrooms IS NULL OR (bedrooms >= 0 AND bedrooms <= 5));

-- Add index for querying by these fields
CREATE INDEX IF NOT EXISTS idx_firb_calculations_property_classification 
ON firb_calculations(property_classification) WHERE property_classification IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_firb_calculations_bedrooms 
ON firb_calculations(bedrooms) WHERE bedrooms IS NOT NULL;

-- Add comments
COMMENT ON COLUMN firb_calculations.property_classification IS 'Property classification: unit or house. Only used for established properties.';
COMMENT ON COLUMN firb_calculations.bedrooms IS 'Number of bedrooms: 0 for studio, 1-5 for bedrooms. Only used for established properties.';












