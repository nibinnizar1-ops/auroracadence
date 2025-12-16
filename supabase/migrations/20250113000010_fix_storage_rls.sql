-- Fix Storage RLS Policies for product-images bucket
-- This migration fixes the "new row violates row-level security policy" error

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product-images" ON storage.objects;

-- Recreate policies with better error handling
-- Policy: Allow public read access to product-images bucket
CREATE POLICY "Public Access for product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users who are admins to upload
-- Using a more explicit check
CREATE POLICY "Admin can upload product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    -- Check if user is admin via admin_users table
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
    -- Fallback: also allow if is_admin function returns true
    OR public.is_admin(auth.uid()) = true
  )
);

-- Policy: Allow authenticated users who are admins to update
CREATE POLICY "Admin can update product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
    OR public.is_admin(auth.uid()) = true
  )
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
    OR public.is_admin(auth.uid()) = true
  )
);

-- Policy: Allow authenticated users who are admins to delete
CREATE POLICY "Admin can delete product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
    OR public.is_admin(auth.uid()) = true
  )
);

