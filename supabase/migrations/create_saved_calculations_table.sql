-- Create saved_calculations table
-- Run this in Supabase SQL Editor if the table doesn't exist

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if user_profiles exists, if not create it first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) THEN
        -- Create subscription_status enum if it doesn't exist
        DO $$ BEGIN
            CREATE TYPE subscription_status AS ENUM ('free', 'trial', 'paid');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;

        -- Create user_profiles table
        CREATE TABLE user_profiles (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
            last_login_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
            subscription_status subscription_status DEFAULT 'free' NOT NULL,
            subscription_tier TEXT,
            calculations_count INTEGER DEFAULT 0 NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        );

        -- Enable RLS on user_profiles
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create saved_calculations table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    calculation_data JSONB NOT NULL,
    property_address TEXT,
    property_value NUMERIC,
    eligibility_status TEXT,
    calculation_name TEXT,
    is_favorite BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id ON saved_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_created_at ON saved_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_is_favorite ON saved_calculations(is_favorite) WHERE is_favorite = TRUE;

-- Create or replace function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_saved_calculations_updated_at ON saved_calculations;
CREATE TRIGGER update_saved_calculations_updated_at
    BEFORE UPDATE ON saved_calculations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service role full access" ON saved_calculations;
DROP POLICY IF EXISTS "Users can manage own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Service role has full access to calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can read own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can insert own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can update own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can delete own calculations" ON saved_calculations;

-- Create RLS policies
-- Service role can do everything (used by API routes)
CREATE POLICY "Allow service role full access"
    ON saved_calculations FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users can only access their own calculations
CREATE POLICY "Users can manage own calculations"
    ON saved_calculations FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to increment calculations count (if user_profiles table exists)
CREATE OR REPLACE FUNCTION increment_calculations_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if user_profiles table exists and has the column
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'calculations_count'
    ) THEN
        UPDATE user_profiles
        SET calculations_count = calculations_count + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to increment calculations count
DROP TRIGGER IF EXISTS on_calculation_created ON saved_calculations;
CREATE TRIGGER on_calculation_created
    AFTER INSERT ON saved_calculations
    FOR EACH ROW
    EXECUTE FUNCTION increment_calculations_count();

-- Add comments
COMMENT ON TABLE saved_calculations IS 'User saved FIRB calculator results';
COMMENT ON COLUMN saved_calculations.calculation_data IS 'Full JSON of form state and results';

