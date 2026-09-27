CREATE TABLE public.mcp_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id text NOT NULL UNIQUE,
  tool_name text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  prev_hash text NOT NULL,
  entry_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.mcp_audit_log TO anon;
GRANT SELECT, INSERT ON public.mcp_audit_log TO authenticated;
GRANT ALL ON public.mcp_audit_log TO service_role;

ALTER TABLE public.mcp_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the audit trail"
  ON public.mcp_audit_log FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can append to the audit trail"
  ON public.mcp_audit_log FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX mcp_audit_log_created_at_idx ON public.mcp_audit_log (created_at DESC);