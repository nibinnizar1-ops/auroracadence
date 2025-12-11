-- Storage Bucket Setup and RLS Policies
-- Note: Buckets must be created manually in Supabase Dashboard first:
-- 1. Go to Storage in Supabase Dashboard: https://supabase.com/dashboard/project/rpfvnjaggkhmucosijji/storage/buckets
-- 2. Create bucket: "product-images" (Public: Yes)
-- 3. Create bucket: "banners" (Public: Yes)
-- 
-- After creating buckets, run this migration to set up RLS policies

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access for banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete banners" ON storage.objects;

-- Policy: Allow public read access to product-images bucket
CREATE POLICY "Public Access for product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy: Allow only admins to upload to product-images
CREATE POLICY "Admin can upload product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid())
);

-- Policy: Allow only admins to update product-images
CREATE POLICY "Admin can update product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid())
);

-- Policy: Allow only admins to delete product-images
CREATE POLICY "Admin can delete product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid())
);

-- Policy: Allow public read access to banners bucket
CREATE POLICY "Public Access for banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Policy: Allow only admins to upload to banners
CREATE POLICY "Admin can upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' 
  AND public.is_admin(auth.uid())
);

-- Policy: Allow only admins to update banners
CREATE POLICY "Admin can update banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'banners' 
  AND public.is_admin(auth.uid())
);

-- Policy: Allow only admins to delete banners
CREATE POLICY "Admin can delete banners"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' 
  AND public.is_admin(auth.uid())
);

