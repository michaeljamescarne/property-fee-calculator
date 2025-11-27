-- Migration: Create leads table for email capture
-- Created: 2025-01-15
-- Purpose: Simple email capture for lead generation before calculator launch

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public inserts (for email capture forms)
CREATE POLICY "Allow public email insert" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy: Allow admins to read all leads
CREATE POLICY "Allow admin read leads" ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy: Allow service role to read all leads (for CRM export)
CREATE POLICY "Allow service role read leads" ON leads
  FOR SELECT
  TO service_role
  USING (true);

-- Add comment to table
COMMENT ON TABLE leads IS 'Simple email capture for lead generation. Leads exported to CRM for customer engagement.';

-- Add comment to columns
COMMENT ON COLUMN leads.id IS 'Unique identifier for lead';
COMMENT ON COLUMN leads.email IS 'Email address of lead (unique constraint)';
COMMENT ON COLUMN leads.created_at IS 'Timestamp when lead was captured';

