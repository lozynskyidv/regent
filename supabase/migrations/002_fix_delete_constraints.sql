-- Migration: Fix foreign key constraints for account deletion
-- Purpose: Allow GDPR-compliant account deletion by removing restrictive constraints

-- Check if users table exists and fix foreign key constraint
DO $$ 
BEGIN
  -- If the users table has a foreign key to auth.users with ON DELETE RESTRICT,
  -- we need to change it to ON DELETE CASCADE
  
  -- First, check if the constraint exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
    AND constraint_type = 'FOREIGN KEY'
  ) THEN
    -- Drop existing foreign key constraints on users.id
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey1;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS fk_users_auth;
    
    -- Recreate with ON DELETE CASCADE
    ALTER TABLE public.users 
    ADD CONSTRAINT users_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Updated users table foreign key constraint to ON DELETE CASCADE';
  END IF;
END $$;

-- Ensure invite_codes constraints are correct (should already be ON DELETE SET NULL)
DO $$
BEGIN
  -- Drop and recreate invite_codes foreign keys if needed
  ALTER TABLE public.invite_codes DROP CONSTRAINT IF EXISTS invite_codes_created_by_user_id_fkey;
  ALTER TABLE public.invite_codes DROP CONSTRAINT IF EXISTS invite_codes_used_by_user_id_fkey;
  
  ALTER TABLE public.invite_codes 
  ADD CONSTRAINT invite_codes_created_by_user_id_fkey 
  FOREIGN KEY (created_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  
  ALTER TABLE public.invite_codes 
  ADD CONSTRAINT invite_codes_used_by_user_id_fkey 
  FOREIGN KEY (used_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  
  RAISE NOTICE 'Updated invite_codes foreign key constraints';
END $$;
