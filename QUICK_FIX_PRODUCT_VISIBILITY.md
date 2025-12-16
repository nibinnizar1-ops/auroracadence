# Quick Fix: Product Not Showing on Website

## The Problem
Products only show on the website if they have:
1. ✅ Status = "Active" (not "Draft")
2. ✅ At least one variant (with Size, Price, Inventory)
3. ✅ Variant must have `available = true`

## Quick Check

### Option 1: Check in Admin Panel
1. Go to `/admin/products`
2. Find your product
3. Check the status badge:
   - 🟢 **Green "Active"** = Will show on website
   - 🟡 **Yellow "Draft"** = Hidden from website
   - 🔴 **Red "Archived"** = Hidden from website

### Option 2: Check with SQL
Run this in Supabase SQL Editor:

```sql
-- Check your product status and requirements
SELECT 
  p.id,
  p.title,
  p.status,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT pi.id) as image_count,
  COUNT(DISTINCT CASE WHEN pv.available = true THEN pv.id END) as available_variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.title ILIKE '%YOUR_PRODUCT_NAME%'  -- Replace with your product name
GROUP BY p.id, p.title, p.status;
```

## Quick Fixes

### Fix 1: Change Status to Active
**In Admin Panel:**
1. Go to `/admin/products`
2. Click "Edit" on your product
3. Change Status from "Draft" to "Active"
4. Click "Save & Continue"
5. Refresh website

**Or with SQL:**
```sql
-- Make specific product active (replace PRODUCT_ID)
UPDATE products 
SET status = 'active' 
WHERE id = 'YOUR_PRODUCT_ID';
```

### Fix 2: Ensure Product Has Variants
Products **must** have at least one variant to display:

1. Go to product edit page
2. Scroll to "Product Variants" section
3. Click "Add Variant" if none exist
4. Fill in:
   - **Size** (required) - e.g., "Small", "Medium", "Large"
   - **Price** (required) - e.g., 1000
   - **Inventory Quantity** (required) - e.g., 10
   - **Inventory Policy** - "Deny" or "Continue"
5. Save the product

### Fix 3: Check Variant Availability
Variants must have `available = true`:

```sql
-- Check variant availability
SELECT 
  p.title as product,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID';

-- Make all variants available
UPDATE product_variants 
SET available = true 
WHERE product_id = 'YOUR_PRODUCT_ID';
```

## Complete Checklist

Before a product shows on the website, verify:

- [ ] **Status = "Active"** (not Draft or Archived)
- [ ] **At least one variant exists**
- [ ] **Variant has Size** (not empty)
- [ ] **Variant has Price** (greater than 0)
- [ ] **Variant has Inventory Quantity** (can be 0, but should be set)
- [ ] **Variant.available = true** (default, but check)
- [ ] **Product has images** (recommended, but not required)

## Why Products Are Hidden

The frontend code filters products:
```typescript
.eq('status', 'active')  // Only active products
```

And RLS policies also restrict:
```sql
USING (status = 'active')  -- Only active products visible
```

This is **by design** - draft products are hidden until you publish them.

## Most Common Issue

**99% of the time**, the issue is:
- Product status is "Draft" instead of "Active"

**Quick fix:**
1. Edit product in admin
2. Change status to "Active"
3. Save
4. Refresh website

## Still Not Showing?

If product is Active but still not showing:

1. **Check browser console** (F12) for errors
2. **Check Network tab** - see if API call is failing
3. **Verify RLS policies** - make sure public can read active products
4. **Check variants** - product needs at least one variant
5. **Hard refresh** - Ctrl+Shift+R or Cmd+Shift+R

