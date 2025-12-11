# Migration Order Guide

## ⚠️ Important: Run Migrations in This Order

Migrations must be run in the correct order because some depend on others.

---

## ✅ Step-by-Step Migration Order

### 1. First: Create Profiles Table
**File**: `supabase/migrations/20250101000006_create_profiles_table.sql`

This creates the `profiles` table that stores user information.

**Run this first!**

---

### 2. Second: Add Admin Support
**File**: `supabase/migrations/20250101000009_add_admin_support.sql`

This adds the `is_admin` field to the profiles table.

**⚠️ Requires**: Profiles table must exist (from step 1)

---

### 3. Third: Setup Storage Buckets
**File**: `supabase/migrations/20250101000008_setup_storage_buckets.sql`

This sets up storage policies for product images and banners.

**⚠️ Requires**: 
- Profiles table (from step 1)
- Admin support (from step 2)
- Storage buckets must be created manually first (see `STORAGE_SETUP_GUIDE.md`)

---

## 🚀 Quick Start

### If you haven't run any migrations yet:

1. **Run profiles migration**:
   ```sql
   -- Copy and run: 20250101000006_create_profiles_table.sql
   ```

2. **Run admin support migration**:
   ```sql
   -- Copy and run: 20250101000009_add_admin_support.sql
   ```

3. **Create storage buckets** (in Dashboard):
   - Go to Storage → Create `product-images` bucket (Public: Yes)
   - Go to Storage → Create `banners` bucket (Public: Yes)

4. **Run storage policies migration**:
   ```sql
   -- Copy and run: 20250101000008_setup_storage_buckets.sql
   ```

---

## 🔍 Check Which Migrations You've Run

### Check if profiles table exists:
```sql
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'profiles'
);
```

### Check if is_admin column exists:
```sql
SELECT EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'is_admin'
);
```

---

## ❌ Common Errors

### Error: "relation public.profiles does not exist"
**Solution**: Run `20250101000006_create_profiles_table.sql` first!

### Error: "column is_admin does not exist"
**Solution**: Run `20250101000009_add_admin_support.sql` after profiles migration!

### Error: "bucket does not exist"
**Solution**: Create storage buckets in Dashboard first (see `STORAGE_SETUP_GUIDE.md`)!

---

## 📋 Complete Migration List (Chronological Order)

1. ✅ `20250101000001_create_coupons_tables.sql`
2. ✅ `20250101000002_create_products_tables.sql`
3. ✅ `20250101000003_create_collections_tables.sql`
4. ✅ `20250101000004_create_categories_tables.sql`
5. ✅ `20250101000005_create_order_line_items.sql`
6. ✅ `20250101000006_create_profiles_table.sql` ← **Run this before admin migration!**
7. ✅ `20250101000007_create_user_data_tables.sql`
8. ✅ `20250101000009_add_admin_support.sql` ← **Run after profiles!**
9. ✅ `20250101000008_setup_storage_buckets.sql` ← **Run after admin support!**

---

**Need help? Check the individual migration files for specific requirements!**

