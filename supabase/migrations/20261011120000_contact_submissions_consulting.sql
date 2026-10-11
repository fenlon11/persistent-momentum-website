-- Consulting inquiries land in contact_submissions (fenlon11/pmOS#683).
-- The site's prod Supabase (klrr) never received 20250101000000_create_contact_submissions.sql
-- (to_regclass('public.contact_submissions') was null on 2026-10-11), so create the table here
-- in the shape the /api/contact route writes, then add the consulting columns. Every step is
-- idempotent so it is also correct on a database that has the 2025 table.

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS company_size TEXT,
  ADD COLUMN IF NOT EXISTS need TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT;

-- The 2025 shape required phone and service_interest; neither form collects them now.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'contact_submissions' AND column_name = 'phone') THEN
    ALTER TABLE public.contact_submissions ALTER COLUMN phone DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'contact_submissions' AND column_name = 'service_interest') THEN
    ALTER TABLE public.contact_submissions ALTER COLUMN service_interest DROP NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);

-- Written only by the site's API routes with the service role.
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.contact_submissions FROM anon, authenticated;
