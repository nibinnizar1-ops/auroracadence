# Fix: "Failed to upload image" Error

If you've created the bucket but still getting upload errors, check these:

## 1. Verify RLS Policies Are Applied

After creating the bucket, you need to ensure RLS policies are set up. Run this migration:

```sql
-- Run this in Supabase SQL Editor
-- This sets up the RLS policies for the product-images bucket

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product-images" ON storage.objects;

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
```

## 2. Verify You're Logged In as Admin

Make sure:
- You're logged into the admin panel
- Your user ID is in the `admin_users` table
- Check by running: `SELECT * FROM admin_users;` in SQL Editor

## 3. Check Bucket Settings

In Supabase Dashboard → Storage → Buckets → product-images:
- ✅ **Public bucket**: Should be enabled (toggle ON)
- ✅ **File size limit**: Should be set (e.g., 50 MB)
- ✅ **Allowed MIME types**: Should include image types

## 4. Check Browser Console

Open browser DevTools (F12) → Console tab, and look for detailed error messages when uploading.

## 5. Common Error Messages & Solutions

### "new row violates row-level security policy"
- **Solution**: RLS policies not applied. Run the SQL above.

### "Bucket not found"
- **Solution**: Bucket doesn't exist. Create it in Supabase Dashboard.

### "JWT expired" or "Invalid JWT"
- **Solution**: Log out and log back in.

### "Permission denied"
- **Solution**: Your user is not in `admin_users` table. Add it.

## 6. Quick Test

Try uploading a small image file (< 1MB) first to rule out file size issues.

