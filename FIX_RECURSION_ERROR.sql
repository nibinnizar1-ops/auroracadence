-- Fix: Infinite Recursion Error in Storage RLS
-- Problem: Storage policy checks admin_users, but admin_users RLS also checks admin_users
-- Solution: Use is_admin() function which is SECURITY DEFINER and bypasses RLS

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product-images" ON storage.objects;

-- Step 2: Recreate policies using is_admin() function (which bypasses RLS)
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

-- Step 3: Ensure is_admin() function is SECURITY DEFINER (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;

