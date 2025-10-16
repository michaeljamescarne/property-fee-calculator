-- Authentication System Migration (Fixed Version)
-- Creates tables for user profiles, saved calculations, and magic codes
-- Handles existing types gracefully

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types only if they don't exist
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('free', 'trial', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. User Profiles Table
-- Extends Supabase Auth with custom profile data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_login_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    subscription_status subscription_status DEFAULT 'free' NOT NULL,
    subscription_tier TEXT,
    calculations_count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Magic Codes Table
-- Stores temporary authentication codes
CREATE TABLE IF NOT EXISTS magic_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    code TEXT NOT NULL, -- Will store hashed code
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    used BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT max_attempts CHECK (attempts <= 3)
);

-- 3. Saved Calculations Table
-- Stores user's FIRB calculations
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

-- Indexes for performance (only create if they don't exist)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_magic_codes_email ON magic_codes(email);
CREATE INDEX IF NOT EXISTS idx_magic_codes_code ON magic_codes(code);
CREATE INDEX IF NOT EXISTS idx_magic_codes_expires_at ON magic_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id ON saved_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_created_at ON saved_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_is_favorite ON saved_calculations(is_favorite) WHERE is_favorite = TRUE;

-- Triggers for updated_at (only create if they don't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_calculations_updated_at ON saved_calculations;
CREATE TRIGGER update_saved_calculations_updated_at
    BEFORE UPDATE ON saved_calculations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Magic codes accessible via service role only" ON magic_codes;
DROP POLICY IF EXISTS "Users can read own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can insert own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can update own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can delete own calculations" ON saved_calculations;

-- User Profiles Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Magic Codes Policies
-- No direct access - only via service role in API routes
CREATE POLICY "Magic codes accessible via service role only"
    ON magic_codes FOR ALL
    USING (FALSE);

-- Saved Calculations Policies
-- Users can read their own calculations
CREATE POLICY "Users can read own calculations"
    ON saved_calculations FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own calculations
CREATE POLICY "Users can insert own calculations"
    ON saved_calculations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own calculations
CREATE POLICY "Users can update own calculations"
    ON saved_calculations FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own calculations
CREATE POLICY "Users can delete own calculations"
    ON saved_calculations FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Function to cleanup expired magic codes (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_magic_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM magic_codes
    WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment calculations count
CREATE OR REPLACE FUNCTION increment_calculations_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET calculations_count = calculations_count + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_calculation_created ON saved_calculations;
CREATE TRIGGER on_calculation_created
    AFTER INSERT ON saved_calculations
    FOR EACH ROW
    EXECUTE FUNCTION increment_calculations_count();

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profile data linked to Supabase Auth';
COMMENT ON TABLE magic_codes IS 'Temporary authentication codes for passwordless login';
COMMENT ON TABLE saved_calculations IS 'User saved FIRB calculator results';
COMMENT ON COLUMN magic_codes.code IS 'Hashed 6-digit authentication code';
COMMENT ON COLUMN saved_calculations.calculation_data IS 'Full JSON of form state and results';



