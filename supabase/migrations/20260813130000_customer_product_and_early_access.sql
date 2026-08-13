-- Product details on reserve-interest rows + early access email list

ALTER TABLE public.prelaunch_leads
  ADD COLUMN IF NOT EXISTS product_details JSONB;

CREATE TABLE IF NOT EXISTS public.early_access_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS early_access_subscribers_email_unique
  ON public.early_access_subscribers (lower(email));

CREATE INDEX IF NOT EXISTS early_access_subscribers_created_at_idx
  ON public.early_access_subscribers (created_at DESC);

GRANT ALL ON public.early_access_subscribers TO service_role;

ALTER TABLE public.early_access_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.early_access_subscribers;
CREATE POLICY "Service role full access"
  ON public.early_access_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
