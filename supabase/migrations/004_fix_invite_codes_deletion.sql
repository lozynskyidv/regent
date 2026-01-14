-- Migration: Fix invite codes constraint for GDPR-compliant account deletion
-- Purpose: Allow nullifying used_by_user_id even when used_at is set
-- 
-- Root Cause: The CHECK constraint "used_requires_user" prevents setting
-- used_by_user_id to NULL when the code has been used (used_at is set).
-- This blocks account deletion because the foreign key can't be nullified.
--
-- Solution: Drop the restrictive CHECK constraint and rely on the foreign key
-- with ON DELETE SET NULL to handle user deletion properly.

DO $$ 
BEGIN
  -- Drop the problematic CHECK constraint
  ALTER TABLE public.invite_codes 
  DROP CONSTRAINT IF EXISTS used_requires_user;
  
  RAISE NOTICE 'Dropped "used_requires_user" constraint - allows nullifying used_by_user_id for GDPR deletion';
  
  -- Note: We keep the ON DELETE SET NULL foreign key constraints
  -- They will automatically nullify user references when users are deleted
  -- The constraint was too restrictive for GDPR compliance
END $$;

-- Verify the constraint is gone
DO $$
DECLARE
  constraint_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'invite_codes' 
    AND constraint_name = 'used_requires_user'
  ) INTO constraint_exists;
  
  IF constraint_exists THEN
    RAISE EXCEPTION 'Constraint still exists! Migration failed.';
  ELSE
    RAISE NOTICE '✅ Verified: used_requires_user constraint has been removed';
  END IF;
END $$;

-- Add a comment explaining the design decision
COMMENT ON TABLE public.invite_codes IS 
'Stores invite codes for exclusive access. Foreign keys use ON DELETE SET NULL to allow GDPR-compliant user deletion. 
When a user is deleted, their invite codes remain (for audit trail) but user references are nullified.';
