-- IMPORTANT: Make sure you've run migration 20250101000006_create_profiles_table.sql first!
-- This migration adds admin support to the profiles table.

-- Add is_admin field to profiles table (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
    
    -- Create index for admin lookup
    CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;
  ELSE
    RAISE EXCEPTION 'Profiles table does not exist. Please run migration 20250101000006_create_profiles_table.sql first!';
  END IF;
END $$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

