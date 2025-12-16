-- Fix infinite recursion in storage RLS policies
-- The issue: Storage policy checks admin_users, but admin_users RLS blocks the check
-- Solution: Use the is_admin() function instead, or make admin_users readable during policy checks

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product-images" ON storage.objects;

-- Fix: Use is_admin() function which is SECURITY DEFINER and bypasses RLS
-- This function can read admin_users even if RLS would normally block it
CREATE POLICY "Admin can upload product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid()) = true
);

CREATE POLICY "Admin can update product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid()) = true
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid()) = true
);

CREATE POLICY "Admin can delete product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid()) = true
);

-- Also ensure the is_admin function is working correctly
-- It should be SECURITY DEFINER which allows it to bypass RLS
DO $$
BEGIN
  -- Verify the function exists and is SECURITY DEFINER
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname = 'is_admin'
    AND p.prosecdef = true  -- SECURITY DEFINER
  ) THEN
    RAISE NOTICE 'is_admin function may not be SECURITY DEFINER. Recreating...';
    
    -- Recreate the function to ensure it's SECURITY DEFINER
    CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE admin_users.user_id = is_admin.user_id
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;
  END IF;
END $$;

