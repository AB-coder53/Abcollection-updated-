-- Idempotent setup for Reserve Interest / customer leads
CREATE TABLE IF NOT EXISTS public.prelaunch_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  city TEXT,
  products TEXT[] NOT NULL DEFAULT '{}',
  preferred_size TEXT,
  preferred_color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  whatsapp_optin BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  discount_code TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS prelaunch_leads_mobile_unique
  ON public.prelaunch_leads (mobile);

CREATE UNIQUE INDEX IF NOT EXISTS prelaunch_leads_email_unique
  ON public.prelaunch_leads (lower(email))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS prelaunch_leads_created_at_idx
  ON public.prelaunch_leads (created_at DESC);

GRANT ALL ON public.prelaunch_leads TO service_role;

ALTER TABLE public.prelaunch_leads ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS; anon/authenticated have no access.
DROP POLICY IF EXISTS "Service role full access" ON public.prelaunch_leads;
CREATE POLICY "Service role full access"
  ON public.prelaunch_leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
