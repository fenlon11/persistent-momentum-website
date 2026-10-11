-- Newsletter signups (fenlon11/pmOS#682). HubSpot portal 247620603 is the system of record;
-- this table is the backup so a HubSpot failure never loses an address. Written only by the
-- site's server route with the service-role key: RLS on and no policies, so anon and
-- authenticated roles can neither read nor write.
CREATE TABLE IF NOT EXISTS public.newsletter_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  firstname TEXT,
  page_uri TEXT,
  hubspot_status INTEGER,
  hubspot_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON public.newsletter_signups (created_at DESC);

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.newsletter_signups FROM anon, authenticated;

COMMENT ON TABLE public.newsletter_signups IS 'persistentmomentum.com newsletter signups; backup of HubSpot form submissions. Service role only.';
