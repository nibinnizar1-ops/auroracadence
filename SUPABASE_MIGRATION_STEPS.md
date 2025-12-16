# Supabase Migration Steps

## ✅ Step-by-Step Guide to Apply Migrations

### Step 1: Access Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project: **Aurora-Tes** (or your project name)

### Step 2: Navigate to Migrations
1. In the left sidebar, click **"SQL Editor"**
2. Or go to **"Database"** → **"Migrations"**

### Step 3: Apply Product Discount Migration
1. Click **"New Query"** or **"Create Migration"**
2. Copy the entire contents of: `supabase/migrations/20250113000001_add_product_discount_fields.sql`
3. Paste into the SQL editor
4. Click **"Run"** or **"Execute"**
5. Wait for success message (should take 1-2 seconds)

### Step 4: Apply Banners Migration
1. Click **"New Query"** again
2. Copy the entire contents of: `supabase/migrations/20250113000002_create_banners_table.sql`
3. Paste into the SQL editor
4. Click **"Run"** or **"Execute"**
5. Wait for success message

### Step 5: Verify Migrations
1. Go to **"Database"** → **"Tables"**
2. Check that you see:
   - ✅ `products` table (should have new discount columns)
   - ✅ `banners` table (new table)

### Step 6: Test
1. Go to your admin panel: `/admin/products`
2. Try creating/editing a product - you should see discount fields
3. Go to `/admin/banners` - you should see the banners page

---

## ⚠️ Important Notes

- **Backup First**: If you have production data, export it before running migrations
- **No Data Loss**: These migrations only ADD columns/tables, they don't delete anything
- **RLS Policies**: The migrations include Row Level Security policies for admin access

---

## 🐛 Troubleshooting

**Error: "column already exists"**
- The migration already ran - this is fine, skip it

**Error: "permission denied"**
- Make sure you're logged in as the project owner
- Check that RLS policies are set correctly

**Error: "table already exists"**
- The table was already created - this is fine, skip it

---

## ✅ After Migrations

Once migrations are applied:
1. ✅ Product discount fields will be available
2. ✅ Banner management will work
3. ✅ Frontend will fetch banners from database

