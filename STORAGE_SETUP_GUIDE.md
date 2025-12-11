# Supabase Storage Setup Guide

## Step 1: Create Storage Buckets

You need to create the storage buckets manually in the Supabase Dashboard:

### 1. Go to Supabase Dashboard
- Navigate to: https://supabase.com/dashboard/project/rpfvnjaggkhmucosijji
- Click on **Storage** in the left sidebar

### 2. Create `product-images` Bucket
1. Click **"New bucket"** button
2. **Bucket name**: `product-images`
3. **Public bucket**: ✅ **Enable** (check this box - important!)
4. **File size limit**: Leave default or set to 10MB
5. **Allowed MIME types**: Leave empty (allows all image types)
6. Click **"Create bucket"**

### 3. Create `banners` Bucket
1. Click **"New bucket"** button again
2. **Bucket name**: `banners`
3. **Public bucket**: ✅ **Enable** (check this box - important!)
4. **File size limit**: Leave default or set to 5MB
5. **Allowed MIME types**: Leave empty (allows all image types)
6. Click **"Create bucket"**

## Step 2: Run the Migration

After creating the buckets, run the migration to set up RLS policies:

```bash
# The migration file is already created:
# supabase/migrations/20250101000008_setup_storage_buckets.sql
```

You can apply it via:
- Supabase Dashboard → SQL Editor → Run the migration SQL
- Or via Supabase CLI: `supabase db push`

## Step 3: Verify Setup

After running the migration, verify:
1. Buckets are created and public
2. RLS policies are active
3. You can upload test images

## Storage Structure

### Product Images Structure:
```
product-images/
  └── products/
      └── {product_id}/
          ├── main.jpg
          ├── variant-{variant_id}.jpg
          └── gallery/
              └── {image_id}.jpg
```

### Banners Structure:
```
banners/
  └── {section}/
      └── {banner_id}.jpg
```

## Next Steps

Once storage is set up, we'll:
1. ✅ Create product API functions
2. ✅ Migrate frontend components
3. ✅ Add image upload functionality

