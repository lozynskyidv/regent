-- Migration: Create invite_codes table for invite-only system
-- Purpose: Replace RevenueCat paywall with exclusive invite-based access
-- Each user gets 5 invite codes to share

-- Create invite_codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT code_format_check CHECK (code ~ '^RGNT-[A-Z0-9]{6}$'),
  CONSTRAINT used_requires_user CHECK (
    (used_at IS NULL AND used_by_user_id IS NULL) OR 
    (used_at IS NOT NULL AND used_by_user_id IS NOT NULL)
  )
);

-- Add invites_remaining column to users table (if it exists)
-- If users table doesn't exist yet, this will be handled when it's created
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS invites_remaining INTEGER DEFAULT 5;
  END IF;
END $$;

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_created_by ON public.invite_codes(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_used_by ON public.invite_codes(used_by_user_id);
CREATE INDEX IF NOT EXISTS idx_invite_codes_active ON public.invite_codes(is_active) WHERE is_active = TRUE;

-- Row Level Security (RLS) Policies
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can validate codes (read-only for unused codes)
CREATE POLICY "Anyone can validate unused codes"
  ON public.invite_codes
  FOR SELECT
  USING (is_active = TRUE AND used_by_user_id IS NULL);

-- Policy: Users can see codes they created
CREATE POLICY "Users can see their own codes"
  ON public.invite_codes
  FOR SELECT
  USING (auth.uid() = created_by_user_id);

-- Policy: Users can see codes they used
CREATE POLICY "Users can see codes they used"
  ON public.invite_codes
  FOR SELECT
  USING (auth.uid() = used_by_user_id);

-- Policy: Only service_role can insert/update/delete (via Edge Functions)
-- No INSERT/UPDATE/DELETE policies for regular users - Edge Functions handle this

-- Seed initial founder codes (10 codes to start)
INSERT INTO public.invite_codes (code, is_active, created_at) VALUES
  ('RGNT-F0UND1', TRUE, NOW()),
  ('RGNT-F0UND2', TRUE, NOW()),
  ('RGNT-F0UND3', TRUE, NOW()),
  ('RGNT-F0UND4', TRUE, NOW()),
  ('RGNT-F0UND5', TRUE, NOW()),
  ('RGNT-F0UND6', TRUE, NOW()),
  ('RGNT-F0UND7', TRUE, NOW()),
  ('RGNT-F0UND8', TRUE, NOW()),
  ('RGNT-F0UND9', TRUE, NOW()),
  ('RGNT-F0UNDA', TRUE, NOW())
ON CONFLICT (code) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE public.invite_codes IS 'Stores invite codes for exclusive access. Each user gets 5 codes to share.';
COMMENT ON COLUMN public.invite_codes.code IS 'Format: RGNT-XXXXXX (6 alphanumeric chars, no confusing 0/O or 1/I)';
COMMENT ON COLUMN public.invite_codes.created_by_user_id IS 'User who generated this code (NULL for founder codes)';
COMMENT ON COLUMN public.invite_codes.used_by_user_id IS 'User who redeemed this code (NULL if unused)';
COMMENT ON COLUMN public.invite_codes.is_active IS 'FALSE if code is revoked/expired';
