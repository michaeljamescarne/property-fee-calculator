-- Fix RLS Policies for Service Role Access
-- The previous policies blocked service role from inserting because auth.uid() returns NULL
-- Service role operations should bypass RLS entirely, but we need proper policies

-- Drop existing policies for saved_calculations
DROP POLICY IF EXISTS "Users can read own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can insert own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can update own calculations" ON saved_calculations;
DROP POLICY IF EXISTS "Users can delete own calculations" ON saved_calculations;

-- Create new policies that allow service role and authenticated users
-- Service role (used by API routes) can do everything
CREATE POLICY "Service role has full access to calculations"
    ON saved_calculations FOR ALL
    USING (
        -- Service role can access everything
        auth.jwt() ->> 'role' = 'service_role'
        OR
        -- Regular users can only access their own
        auth.uid() = user_id
    )
    WITH CHECK (
        -- Service role can insert/update anything
        auth.jwt() ->> 'role' = 'service_role'
        OR
        -- Regular users can only insert/update their own
        auth.uid() = user_id
    );

-- Alternative: Simpler approach - allow service role full access
-- This is safe because our API routes validate session before using service role
DROP POLICY IF EXISTS "Service role has full access to calculations" ON saved_calculations;

CREATE POLICY "Allow service role full access"
    ON saved_calculations FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can manage own calculations"
    ON saved_calculations FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Update user_profiles policies similarly
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Allow service role full access to profiles"
    ON user_profiles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can manage own profile"
    ON user_profiles FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Magic codes should remain service role only
-- No changes needed there

-- Add helpful comments
COMMENT ON POLICY "Allow service role full access" ON saved_calculations IS 
    'Service role can manage all calculations. Used by API routes after validating custom JWT session.';
COMMENT ON POLICY "Users can manage own calculations" ON saved_calculations IS 
    'Authenticated users can only access their own calculations via auth.uid().';













