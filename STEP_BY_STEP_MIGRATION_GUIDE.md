# Step-by-Step Migration Guide

## 🎯 What You Need to Do

You need to copy each migration SQL file and run it in the Supabase SQL Editor. Follow these steps:

---

## 📝 Step 1: Open the First Migration File

1. In your code editor (VS Code/Cursor), open:
   ```
   supabase/migrations/20250101000001_create_coupons_tables.sql
   ```

2. **Select ALL** the content (Ctrl+A or Cmd+A)
3. **Copy** it (Ctrl+C or Cmd+C)

---

## 📝 Step 2: Paste into Supabase SQL Editor

1. Go back to your Supabase Dashboard (the SQL Editor you have open)
2. Click in the large white text area (where it says "Hit CMD+K to generate query...")
3. **Paste** the SQL code (Ctrl+V or Cmd+V)
4. You should see the SQL code appear in the editor

---

## 📝 Step 3: Run the Migration

1. Click the green **"Run"** button (top right, or press Ctrl+Enter / Cmd+Enter)
2. Wait for it to complete
3. You should see a success message like "Success. No rows returned" or similar
4. If you see errors, let me know!

---

## 📝 Step 4: Repeat for Each Migration

Do the same for each migration file **in this exact order**:

1. ✅ **First**: `20250101000001_create_coupons_tables.sql`
2. ✅ **Second**: `20250101000002_create_products_tables.sql`
3. ✅ **Third**: `20250101000003_create_collections_tables.sql`
4. ✅ **Fourth**: `20250101000004_create_categories_tables.sql`
5. ✅ **Fifth**: `20250101000005_create_order_line_items.sql`

**Important**: Run them one at a time, in order!

---

## 🎯 Quick Visual Guide

```
1. Open migration file in your code editor
   ↓
2. Select All (Ctrl+A / Cmd+A)
   ↓
3. Copy (Ctrl+C / Cmd+C)
   ↓
4. Go to Supabase SQL Editor
   ↓
5. Paste (Ctrl+V / Cmd+V)
   ↓
6. Click "Run" button
   ↓
7. Wait for success
   ↓
8. Repeat for next migration
```

---

## ✅ How to Verify It Worked

After running all migrations:

1. In Supabase Dashboard, click **"Table Editor"** in the left sidebar
2. You should see all these new tables:
   - ✅ coupons
   - ✅ coupon_usage
   - ✅ products
   - ✅ product_variants
   - ✅ product_images
   - ✅ product_options
   - ✅ collections
   - ✅ collection_products
   - ✅ categories
   - ✅ category_products
   - ✅ order_line_items

3. Click on the **"orders"** table
4. Check that it has these new columns:
   - ✅ coupon_id
   - ✅ discount_amount
   - ✅ user_id

---

## 🆘 If You Get Errors

**Common Issues:**

1. **"relation already exists"** - The table already exists, that's okay! Skip that migration or drop the table first.

2. **"permission denied"** - Make sure you're running as the project owner/admin.

3. **"syntax error"** - Check that you copied the entire SQL correctly (no missing parts).

4. **"function does not exist"** - Make sure you ran the migrations in order (the first one creates functions used by later ones).

**If you see any errors, copy the error message and let me know!**

---

## 💡 Pro Tip

After pasting each migration, you can:
- Click the **"Save"** button to save the query for later
- Give it a name like "Create Coupons Tables" for easy reference

---

**Start with the first migration file and let me know when you're done or if you need help!**

