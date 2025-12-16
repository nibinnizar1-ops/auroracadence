# Step-by-Step Migration Guide

## 🎯 Overview

You need to apply **8 migrations** to Supabase. Each migration takes about 10-30 seconds.

**Total Time**: ~5-10 minutes

---

## 📋 Prerequisites

- ✅ You're logged into Supabase Dashboard
- ✅ You have access to SQL Editor
- ✅ You have at least one admin user in `admin_users` table

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: **Aurora-Tes**
3. In the **left sidebar**, click **"SQL Editor"**
4. You should see a blank SQL editor window

---

### Step 2: Apply Migration #1 - Product Discount Fields

1. **Open the file**: `supabase/migrations/20250113000001_add_product_discount_fields.sql`
2. **Select ALL** contents (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)
4. **Go back to Supabase SQL Editor**
5. **Paste** into the editor (Ctrl+V / Cmd+V)
6. **Click "Run"** button (or press Ctrl+Enter / Cmd+Enter)
7. **Wait for success message** (should say "Success. No rows returned" or similar)
8. ✅ **Migration #1 Complete!**

---

### Step 3: Apply Migration #2 - Banners Table

1. **Click "New Query"** button in SQL Editor (or clear the editor)
2. **Open the file**: `supabase/migrations/20250113000002_create_banners_table.sql`
3. **Select ALL** contents and **Copy**
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success message**
7. ✅ **Migration #2 Complete!**

---

### Step 4: Apply Migration #3 - Category Showcase

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000003_create_category_showcase.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #3 Complete!**

---

### Step 5: Apply Migration #4 - Luxury Moods

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000004_create_luxury_moods.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #4 Complete!**

---

### Step 6: Apply Migration #5 - Gift Guide

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000005_create_gift_guide.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #5 Complete!**

---

### Step 7: Apply Migration #6 - Influencer Showcase

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000006_create_influencer_showcase.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #6 Complete!**

---

### Step 8: Apply Migration #7 - Store Locations

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000007_create_store_locations.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #7 Complete!**

---

### Step 9: Apply Migration #8 - Social Media Links

1. **Click "New Query"** (or clear editor)
2. **Open**: `supabase/migrations/20250113000008_create_social_media_links.sql`
3. **Copy ALL** contents
4. **Paste** into SQL Editor
5. **Click "Run"**
6. **Wait for success**
7. ✅ **Migration #8 Complete!**

---

## ✅ Verification Steps

After applying all migrations, verify they worked:

### Option 1: Check Tables in Dashboard

1. Go to **Table Editor** in left sidebar
2. You should see these **new tables**:
   - ✅ `banners`
   - ✅ `category_showcase_items`
   - ✅ `luxury_mood_categories`
   - ✅ `gift_guide_items`
   - ✅ `influencer_showcase_items`
   - ✅ `store_locations`
   - ✅ `social_media_links`

3. Check `products` table - it should have new columns:
   - `discount_type`
   - `discount_value`
   - `discount_valid_from`
   - `discount_valid_until`
   - `eligible_for_coupons`

### Option 2: Run Verification Query

In SQL Editor, run:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'banners',
  'category_showcase_items',
  'luxury_mood_categories',
  'gift_guide_items',
  'influencer_showcase_items',
  'store_locations',
  'social_media_links'
)
ORDER BY table_name;
```

You should see **7 rows** returned.

---

## 🎉 Success!

If all migrations completed successfully, you're done! 

**Next Steps:**
1. Go to `/admin` in your app
2. You should see all new media management sections
3. Start adding content!

---

## ⚠️ Troubleshooting

### Error: "relation already exists"
- **Meaning**: Table already created
- **Solution**: Skip that migration, it's already done

### Error: "column already exists"
- **Meaning**: Column already added
- **Solution**: Skip that migration, it's already done

### Error: "function does not exist: is_admin"
- **Meaning**: Admin function not found
- **Solution**: Make sure you ran `20250101000010_create_admin_users_table.sql` first

### Error: "permission denied"
- **Meaning**: You don't have permission
- **Solution**: Make sure you're logged in as project owner/admin

---

## 📝 Quick Reference

**Migration Order:**
1. Product Discount Fields
2. Banners Table
3. Category Showcase
4. Luxury Moods
5. Gift Guide
6. Influencer Showcase
7. Store Locations
8. Social Media Links

**Files Location:**
```
supabase/migrations/
├── 20250113000001_add_product_discount_fields.sql
├── 20250113000002_create_banners_table.sql
├── 20250113000003_create_category_showcase.sql
├── 20250113000004_create_luxury_moods.sql
├── 20250113000005_create_gift_guide.sql
├── 20250113000006_create_influencer_showcase.sql
├── 20250113000007_create_store_locations.sql
└── 20250113000008_create_social_media_links.sql
```

---

**Ready to start? Begin with Step 1!** 🚀
