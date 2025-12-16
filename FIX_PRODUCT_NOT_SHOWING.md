# Fix: Product Not Showing on Website

## Issue
Product created in admin panel but not visible on the website.

## Common Causes

### 1. Product Status is "Draft" (Most Common)
**Problem:** Frontend only shows products with `status = 'active'`

**Solution:**
1. Go to Admin Panel → Products
2. Find your product
3. Click "Edit"
4. Change Status from "Draft" to "Active"
5. Save the product
6. Refresh the website

### 2. Product Has No Variants
**Problem:** Products need at least one variant to be displayed

**Solution:**
1. Go to Admin Panel → Products
2. Edit your product
3. Make sure you have at least one variant with:
   - Size (required)
   - Price (required)
   - Inventory Quantity (required)
4. Save the product

### 3. Product Has No Images
**Problem:** Products without images might not display properly

**Solution:**
1. After creating product, go to Preview page
2. Upload at least one product image
3. Set product status to "Active"

## Quick Check SQL

Run this in Supabase SQL Editor to check your product:

```sql
-- Check product status and details
SELECT 
  id,
  title,
  handle,
  status,
  (SELECT COUNT(*) FROM product_variants WHERE product_id = products.id) as variant_count,
  (SELECT COUNT(*) FROM product_images WHERE product_id = products.id) as image_count
FROM products
ORDER BY created_at DESC
LIMIT 10;
```

## Quick Fix SQL

If your product is "draft", make it active:

```sql
-- Make all draft products active (for testing)
UPDATE products 
SET status = 'active' 
WHERE status = 'draft';
```

**Note:** Only do this if you want all draft products to be visible!

## Step-by-Step Fix

1. **Check Product Status:**
   - Go to `/admin/products`
   - Find your product
   - Check the status badge (should be "Active")

2. **If Status is "Draft":**
   - Click "Edit"
   - Change Status dropdown to "Active"
   - Click "Save & Continue"

3. **Check Variants:**
   - In product edit page
   - Scroll to "Product Variants" section
   - Make sure you have at least one variant
   - Each variant needs: Size, Price, Inventory Quantity

4. **Check Images:**
   - After saving, go to Preview page
   - Upload at least one product image
   - This helps with display

5. **Refresh Website:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Product should now appear

## Verification Checklist

- [ ] Product status is "Active"
- [ ] Product has at least one variant
- [ ] Variant has Size, Price, and Inventory Quantity
- [ ] Product has at least one image (recommended)
- [ ] Browser cache cleared (hard refresh)
- [ ] Product appears in `/admin/products` list

## Why Products Need to be Active

The frontend query filters products:
```typescript
.eq('status', 'active')  // Only shows active products
```

This is by design - draft products are hidden from customers until you're ready to publish them.

## Next Steps

1. Check product status in admin panel
2. Change to "Active" if needed
3. Verify variants exist
4. Refresh website
5. Product should appear!

