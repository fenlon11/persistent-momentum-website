-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service_interest TEXT NOT NULL CHECK (service_interest IN ('business', 'marketing', 'both')),
  message TEXT NOT NULL,
  sms_consent BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  ip_address TEXT,
  opted_out BOOLEAN DEFAULT false,
  opted_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on phone for faster lookups and opt-out tracking
CREATE INDEX IF NOT EXISTS idx_contact_submissions_phone ON contact_submissions(phone);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anon users (for form submissions)
CREATE POLICY "Allow form submissions" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow service role to read all data (for admin access)
CREATE POLICY "Service role can read all" ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Create policy to allow service role to update (for opt-out tracking)
CREATE POLICY "Service role can update all" ON contact_submissions
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Add comment to table
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions with A2P compliant SMS consent tracking';
