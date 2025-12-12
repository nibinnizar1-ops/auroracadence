# How to Check if Storage Buckets Exist

## Quick Check in Supabase Dashboard

### Step 1: Go to Storage Section

1. Open your Supabase Dashboard
2. Go to: https://supabase.com/dashboard/project/rpfvnjaggkhmucosijji/storage/buckets
3. Or navigate: **Storage** → **Buckets** (in left sidebar)

### Step 2: Check Bucket List

You should see a list of buckets. Look for:

- ✅ **`product-images`** - Should be listed
- ✅ **`banners`** - Should be listed

### Step 3: Verify Bucket Settings

Click on each bucket to check:

**For `product-images`:**
- ✅ **Public bucket**: Should be **enabled** (green toggle)
- ✅ **File size limit**: Should be set (default or custom)
- ✅ **Created date**: Should show when it was created

**For `banners`:**
- ✅ **Public bucket**: Should be **enabled** (green toggle)
- ✅ **File size limit**: Should be set (default or custom)
- ✅ **Created date**: Should show when it was created

---

## If Buckets Don't Exist

If you don't see the buckets, you need to create them:

### Create `product-images` Bucket:

1. Click **"New bucket"** button
2. **Bucket name**: `product-images`
3. **Public bucket**: ✅ **Enable** (toggle ON - very important!)
4. **File size limit**: Leave default or set to 10MB
5. **Allowed MIME types**: Leave empty (allows all image types)
6. Click **"Create bucket"**

### Create `banners` Bucket:

1. Click **"New bucket"** button again
2. **Bucket name**: `banners`
3. **Public bucket**: ✅ **Enable** (toggle ON - very important!)
4. **File size limit**: Leave default or set to 5MB
5. **Allowed MIME types**: Leave empty (allows all image types)
6. Click **"Create bucket"**

---

## Check via SQL (Alternative Method)

You can also check via SQL Editor:

```sql
SELECT name, id, public, created_at 
FROM storage.buckets 
WHERE name IN ('product-images', 'banners');
```

**Expected Result:**
- If buckets exist: You'll see 2 rows (one for each bucket)
- If buckets don't exist: You'll see 0 rows

---

## Current Status

Based on our setup:
- ✅ **Migration file created**: `20250101000008_setup_storage_buckets.sql`
- ⏳ **Buckets**: Need to be created manually in Dashboard
- ⏳ **RLS Policies**: Will be set up after buckets are created

---

## Next Steps After Creating Buckets

Once buckets are created:

1. **Run the storage migration**:
   - Go to **SQL Editor**
   - Run: `supabase/migrations/20250101000008_setup_storage_buckets.sql`
   - This sets up RLS policies for admin access

2. **Test upload**:
   - Try uploading a test image
   - Verify it appears in the bucket
   - Check that the URL is accessible

---

## Quick Checklist

- [ ] Go to Storage → Buckets in Dashboard
- [ ] Check if `product-images` bucket exists
- [ ] Check if `banners` bucket exists
- [ ] Verify both are set to **Public**
- [ ] If missing, create them using steps above
- [ ] Run storage migration after creating buckets

---

**Let me know what you see in the Dashboard!** 📊

