# Fix: "Bucket not found" Error

The error occurs because the `product-images` storage bucket doesn't exist in your Supabase project.

## Quick Fix: Create Bucket in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Go to Storage**
   - Click on "Storage" in the left sidebar
   - Click on "Buckets"

3. **Create New Bucket**
   - Click "New bucket" button
   - **Bucket name**: `product-images`
   - **Public bucket**: ✅ **Enable this** (toggle ON)
   - **File size limit**: 50 MB (or your preferred limit)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`
   - Click "Create bucket"

4. **Verify RLS Policies**
   - After creating the bucket, the RLS policies from migration `20250101000008_setup_storage_buckets.sql` should apply automatically
   - If not, you can run that migration again

## Alternative: Create via SQL (if you have access)

If you prefer to create it via SQL, you can run this in the Supabase SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
```

**Note**: Some Supabase projects may require buckets to be created via the dashboard first.

## After Creating the Bucket

Once the bucket is created, try uploading an image again from the admin panel. The error should be resolved!

