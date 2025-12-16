# Testing Guide - Enhanced Product Management System

## ✅ What's Been Completed

1. **Database Structure**
   - Product categories junction table for many-to-many relationships
   - Migration to move existing categories to new structure

2. **Product Form Enhancements**
   - Auto-generate handle from title
   - Multiple category selection with checkboxes
   - Auto-map product type to filter category (Necklace → Necklaces)
   - Clear zeros from price/inventory inputs on focus
   - Minimum 3 images validation

3. **Product Display**
   - Description display on product page
   - Coupon badge (when assigned)
   - Product discount with strikethrough pricing

4. **Category Filtering**
   - Updated to use junction table with legacy fallback

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Apply Database Migrations

You need to apply two new migration files:

1. **Go to Supabase Dashboard**
   - Navigate to: SQL Editor (left sidebar)
   - Click "New Query"

2. **Apply First Migration** (`20250114000001_create_product_categories_junction.sql`)
   - Copy the entire contents of: `supabase/migrations/20250114000001_create_product_categories_junction.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - ✅ Should see "Success. No rows returned"

3. **Apply Second Migration** (`20250114000002_migrate_existing_categories.sql`)
   - Copy the entire contents of: `supabase/migrations/20250114000002_migrate_existing_categories.sql`
   - Paste into SQL Editor
   - Click "Run"
   - ✅ Should see "Success" with number of rows inserted

**Alternative: If you prefer using Supabase CLI:**
```bash
cd "/Users/nibin.nizar/Aurora main/auroracadence"
npx supabase db push
```

---

### Step 2: Verify Database Structure

Run this SQL in Supabase SQL Editor to verify:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'product_categories';

-- Check if existing categories were migrated
SELECT COUNT(*) as total_categories 
FROM product_categories;

-- View sample data
SELECT * FROM product_categories LIMIT 5;
```

✅ Expected: Table exists, categories are migrated

---

## 🧪 Testing Checklist

### Test 1: Product Form - Auto-Generate Handle

1. Go to: `http://localhost:8080/admin/products/new`
2. Enter a product title: `"Gold Necklace Set"`
3. **Expected**: Handle field auto-fills with `"gold-necklace-set"`
4. ✅ **Pass** / ❌ **Fail**

---

### Test 2: Product Form - Multiple Categories

1. In the product form, scroll to "Categories (Multiple Selection)"
2. Check multiple categories (e.g., "Office Wear", "Necklaces", "New Arrivals")
3. **Expected**: 
   - All selected categories show checkmarks
   - "Selected: Office Wear, Necklaces, New Arrivals" appears below
4. ✅ **Pass** / ❌ **Fail**

---

### Test 3: Product Form - Auto-Map Product Type

1. In product form, select Product Type: `"Necklace"`
2. **Expected**: 
   - "Necklaces" category is automatically added
   - Toast notification: "Auto-added 'Necklaces' category"
   - "Necklaces" checkbox is checked with "Auto-added" badge
3. Try other types:
   - "Ring" → auto-adds "Rings"
   - "Earrings" → auto-adds "Earrings"
   - "Bracelet" → auto-adds "Bracelets"
4. ✅ **Pass** / ❌ **Fail**

---

### Test 4: Product Form - Variant Inputs (Clear Zeros)

1. In variant section, click on "Price" input that shows "0"
2. **Expected**: Input clears to empty (no "0" visible)
3. Enter a price: `1500`
4. Click on "Compare at Price" input
5. **Expected**: Can clear and enter value normally
6. Click on "Inventory Quantity" input
7. **Expected**: Can clear and enter value normally
8. ✅ **Pass** / ❌ **Fail**

---

### Test 5: Product Form - Minimum Images Validation

1. Create a new product with:
   - Title, description, handle
   - At least one variant
   - **Less than 3 images** (or no images)
2. Click "Create & Add Images"
3. **Expected**: 
   - Error toast: "Please upload at least 3 images. Currently: X/3"
   - Save button is disabled (if editing existing product)
   - Image count shows: "Images: X/3" in red
4. Upload 3+ images, then try saving again
5. **Expected**: Product saves successfully
6. ✅ **Pass** / ❌ **Fail**

---

### Test 6: Product Detail - Description Display

1. Go to any product page (e.g., `/products/irani-chain`)
2. Scroll to description section
3. **Expected**: 
   - Product description is displayed
   - Text is properly formatted (preserves line breaks if any)
4. ✅ **Pass** / ❌ **Fail**

---

### Test 7: Product Detail - Coupon Badge

1. Create/edit a product in admin
2. In "Assign Coupon" dropdown, select an active coupon
3. Save the product
4. View the product on frontend
5. **Expected**: 
   - Coupon badge appears below product title
   - Shows: "Use Code: [COUPON_CODE] - X% OFF" or "₹X OFF"
   - Badge has primary color styling
6. ✅ **Pass** / ❌ **Fail**

---

### Test 8: Product Detail - Discount Display

1. Create/edit a product with:
   - Product-level discount (percentage or fixed)
   - Valid discount dates (or leave null for always valid)
2. Set variant with compare_at_price > price
3. View product on frontend
4. **Expected**: 
   - Shows: Selling price (large, bold)
   - Shows: Original price (strikethrough, smaller)
   - Shows: Discount percentage badge (e.g., "25% OFF")
5. ✅ **Pass** / ❌ **Fail**

---

### Test 9: Category Filtering

1. Create a product with multiple categories:
   - Select: "Office Wear", "Necklaces"
2. Save product
3. Go to category pages:
   - `/office-wear` - Should show the product
   - `/collections?category=Necklaces` - Should show the product
4. **Expected**: Product appears in both category views
5. ✅ **Pass** / ❌ **Fail**

---

### Test 10: Product Type Mapping to Filters

1. Create products with different types:
   - Product A: Type "Necklace" → Should appear in "Necklaces" filter
   - Product B: Type "Ring" → Should appear in "Rings" filter
   - Product C: Type "Earrings" → Should appear in "Earrings" filter
2. Go to frontend collections/filters
3. **Expected**: Products appear in corresponding filter categories
4. ✅ **Pass** / ❌ **Fail**

---

## 🔧 Troubleshooting

### Issue: "Could not find the 'product_categories' table"

**Solution**: Migration not applied. Go back to Step 1 and apply migrations.

---

### Issue: "Failed to save product - categories error"

**Solution**: 
1. Check if `product_categories` table exists
2. Verify RLS policies are set correctly
3. Check browser console for specific error

---

### Issue: "Product not showing in category pages"

**Solution**:
1. Verify product has categories assigned in junction table:
   ```sql
   SELECT * FROM product_categories WHERE product_id = 'YOUR_PRODUCT_ID';
   ```
2. Check product status is "active"
3. Verify category name matches exactly (case-sensitive)

---

### Issue: "Auto-mapping not working"

**Solution**:
1. Check browser console for errors
2. Verify product type is exactly: "Necklace", "Ring", "Earrings", or "Bracelet" (case-sensitive)
3. Check if category already exists in selected categories

---

## 📝 Notes

- **Categories are case-sensitive**: "Necklaces" ≠ "necklaces"
- **Product type mapping only works for**: Necklace, Ring, Earrings, Bracelet
- **Minimum 3 images** validation only applies when editing existing products (new products go to preview page first)
- **Legacy category field** is still supported as fallback

---

## ✅ Ready to Test?

1. Apply migrations (Step 1)
2. Verify database (Step 2)
3. Run through testing checklist (Tests 1-10)
4. Report any issues or unexpected behavior

Let me know what you find! 🚀

