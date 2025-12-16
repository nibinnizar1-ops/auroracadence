# Quick Fix: Apply Migration Despite API Error

## 🎯 Problem
Getting "Failed to fetch (api.supabase.com)" error when running migrations.

## ✅ Solution: Direct Copy-Paste Method

### Step 1: Open SQL Editor
1. Go to Supabase Dashboard
2. Click **"SQL Editor"** (left sidebar)
3. Click **"New Query"**

### Step 2: Copy Migration Content
1. Open the migration file in your code editor
2. **Select ALL** text (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)

### Step 3: Paste and Run
1. **Paste** into Supabase SQL Editor (Ctrl+V / Cmd+V)
2. **Click "Run"** button (or press Ctrl+Enter)
3. Wait for success message

---

## 🔧 If That Doesn't Work: Break It Down

For the problematic migration (`20250113000008`), I've created a broken-down version.

### Use This File Instead:
`MIGRATION_20250113000008_BROKEN_DOWN.sql`

**Run each part separately:**

1. **Run PART 1** (Create Table) → Click Run
2. **Click "New Query"**
3. **Run PART 2** (Create Index) → Click Run
4. **Click "New Query"**
5. **Run PART 3** (Create Trigger) → Click Run
6. Continue for all 7 parts...

---

## 📋 For All Other Migrations

The other 7 migrations should work fine with direct copy-paste:

1. `20250113000001_add_product_discount_fields.sql` ✅
2. `20250113000002_create_banners_table.sql` ✅
3. `20250113000003_create_category_showcase.sql` ✅
4. `20250113000004_create_luxury_moods.sql` ✅
5. `20250113000005_create_gift_guide.sql` ✅
6. `20250113000006_create_influencer_showcase.sql` ✅
7. `20250113000007_create_store_locations.sql` ✅
8. `20250113000008_create_social_media_links.sql` ⚠️ (Use broken-down version)

---

## 🚀 Quick Steps Summary

**For migrations 1-7:**
- Copy entire file → Paste in SQL Editor → Run ✅

**For migration 8:**
- Use `MIGRATION_20250113000008_BROKEN_DOWN.sql`
- Run each part separately (7 parts total)

---

## ⚠️ Important Notes

1. **Make sure you're logged in** to Supabase Dashboard
2. **Use SQL Editor**, not the migration runner
3. **Run migrations in order** (1 through 8)
4. **Wait for success** before moving to next

---

**Try the direct copy-paste method first - it usually works even with API restrictions!** 🎯

