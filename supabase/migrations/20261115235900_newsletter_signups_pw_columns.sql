-- Persistent Workforce as a second newsletter destination (fenlon11/pmOS#2706). Same shape as the
-- HubSpot pair. RLS stays on with no policies: service role only, as before.
ALTER TABLE public.newsletter_signups ADD COLUMN IF NOT EXISTS pw_status INTEGER;
ALTER TABLE public.newsletter_signups ADD COLUMN IF NOT EXISTS pw_error TEXT;
