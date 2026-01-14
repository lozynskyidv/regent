-- Migration: Fix ALL foreign key constraints to auth.users for GDPR-compliant deletion
-- Purpose: Ensure all tables can handle auth.users deletion properly

-- Fix backups table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'backups') THEN
    -- Drop existing constraints
    ALTER TABLE public.backups DROP CONSTRAINT IF EXISTS backups_user_id_fkey;
    ALTER TABLE public.backups DROP CONSTRAINT IF EXISTS fk_backups_user;
    
    -- Recreate with ON DELETE CASCADE
    ALTER TABLE public.backups 
    ADD CONSTRAINT backups_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Updated backups table foreign key constraint to ON DELETE CASCADE';
  END IF;
END $$;

-- Double-check users table constraint (in case previous migration didn't fully apply)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    -- Drop ALL possible constraint names
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey CASCADE;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey1 CASCADE;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS fk_users_auth CASCADE;
    ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey2 CASCADE;
    
    -- Recreate with ON DELETE CASCADE
    ALTER TABLE public.users 
    ADD CONSTRAINT users_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Re-verified users table foreign key constraint ON DELETE CASCADE';
  END IF;
END $$;

-- Fix any other tables that might reference auth.users
-- This query will find and fix them dynamically
DO $$
DECLARE
    r RECORD;
    constraint_name TEXT;
    table_name TEXT;
    column_name TEXT;
BEGIN
    FOR r IN 
        SELECT DISTINCT
            tc.table_name as tbl,
            tc.constraint_name as constraint,
            kcu.column_name as col
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        JOIN information_schema.referential_constraints AS rc
          ON rc.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            AND ccu.table_name = 'users'
            AND ccu.table_schema = 'auth'
            AND rc.delete_rule != 'CASCADE'
            AND rc.delete_rule != 'SET NULL'
    LOOP
        table_name := r.tbl;
        constraint_name := r.constraint;
        column_name := r.col;
        
        -- Drop the restrictive constraint
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I CASCADE', table_name, constraint_name);
        
        -- Recreate with CASCADE (for data tables) or SET NULL (for audit/logging tables)
        -- Use CASCADE for most tables, SET NULL only for codes/invites
        IF table_name LIKE '%code%' OR table_name LIKE '%invite%' THEN
            EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE SET NULL', 
                table_name, constraint_name || '_fixed', column_name);
            RAISE NOTICE 'Fixed %.%: ON DELETE SET NULL', table_name, constraint_name;
        ELSE
            EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE CASCADE', 
                table_name, constraint_name || '_fixed', column_name);
            RAISE NOTICE 'Fixed %.%: ON DELETE CASCADE', table_name, constraint_name;
        END IF;
    END LOOP;
END $$;
