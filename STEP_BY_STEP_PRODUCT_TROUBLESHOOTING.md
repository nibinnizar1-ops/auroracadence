# Step-by-Step: Fix Product Not Showing

Follow these steps in order to identify and fix why your product isn't showing.

---

## Step 1: Check Product in Database

### 1.1 Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### 1.2 Find Your Product
Copy and paste this SQL:

```sql
-- Find your product
SELECT 
  id,
  title,
  handle,
  status,
  created_at
FROM products
ORDER BY created_at DESC
LIMIT 10;
```

**What to check:**
- ✅ Does your product appear in the list?
- ✅ What is the `handle` value? (Note it down)
- ✅ What is the `status` value? (Should be 'active')

**If product not found:** The product wasn't saved. Go back to admin and create it again.

---

## Step 2: Check Product Status

### 2.1 Verify Status is 'active'
Run this SQL (replace `YOUR_PRODUCT_ID` with the ID from Step 1):

```sql
-- Check product status
SELECT 
  id,
  title,
  status,
  handle
FROM products
WHERE id = 'YOUR_PRODUCT_ID';
```

**Expected result:**
- `status` should be `'active'` (not 'draft' or 'archived')

**If status is NOT 'active':**
```sql
-- Fix: Make product active
UPDATE products 
SET status = 'active' 
WHERE id = 'YOUR_PRODUCT_ID';
```

---

## Step 3: Check Product Variants

### 3.1 Check if Product Has Variants
Run this SQL:

```sql
-- Check variants
SELECT 
  p.title as product_title,
  p.status,
  pv.id as variant_id,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  CASE 
    WHEN pv.id IS NULL THEN '❌ NO VARIANTS'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ NO PRICE'
    WHEN pv.available = false THEN '❌ NOT AVAILABLE'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ NO SIZE'
    ELSE '✅ OK'
  END as variant_status
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID';
```

**What to check:**
- ✅ Does the product have at least one variant?
- ✅ Is `price` greater than 0?
- ✅ Is `available` = true?
- ✅ Does `variant_size` (title) have a value?

**If variant is missing or invalid:**
```sql
-- Fix: Add/Update variant
-- First, check if variant exists
SELECT id FROM product_variants WHERE product_id = 'YOUR_PRODUCT_ID';

-- If no variant exists, you need to add one in the admin panel
-- If variant exists but has issues, fix it:
UPDATE product_variants 
SET 
  available = true,
  price = 1000,  -- Set your actual price
  title = 'Default'  -- Set size (e.g., 'Small', 'Medium', 'Default')
WHERE product_id = 'YOUR_PRODUCT_ID' 
  AND (price IS NULL OR price = 0 OR available = false OR title IS NULL OR title = '');
```

---

## Step 4: Check Product Handle

### 4.1 Check Handle Format
Run this SQL:

```sql
-- Check handle
SELECT 
  id,
  title,
  handle,
  CASE 
    WHEN handle LIKE '% %' THEN '❌ HAS SPACES (should use hyphens)'
    WHEN handle = '' THEN '❌ EMPTY'
    ELSE '✅ OK'
  END as handle_status
FROM products
WHERE id = 'YOUR_PRODUCT_ID';
```

**What to check:**
- ✅ Does handle have spaces? (e.g., "irani Chain")
- ✅ Handle should be URL-friendly (e.g., "irani-chain")

**If handle has spaces:**
```sql
-- Fix: Convert spaces to hyphens
UPDATE products 
SET handle = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '--', '-'), '---', '-'))
WHERE id = 'YOUR_PRODUCT_ID';

-- Or manually set it:
UPDATE products 
SET handle = 'irani-chain'  -- Replace with your desired handle
WHERE id = 'YOUR_PRODUCT_ID';
```

---

## Step 5: Check Browser Console

### 5.1 Open Browser DevTools
1. Open your website: `http://localhost:8080`
2. Press **F12** (or **Cmd+Option+I** on Mac)
3. Click the **Console** tab

### 5.2 Look for Product Logs
You should see messages like:
- `[getProducts] Found X products with valid variants out of Y total`
- `[Product ...] - No variants found` (if there's an issue)
- `[Product ...] - Invalid variant: available=false, price=0`

**What to check:**
- ✅ Do you see `[getProducts] Found X products`?
- ✅ Are there any warning messages about your product?
- ✅ Are there any red error messages?

**If you see warnings:**
- Note down the exact warning message
- Go back to Step 3 and fix the variant issue

---

## Step 6: Check Product Grid on Homepage

### 6.1 Visit Homepage
1. Go to: `http://localhost:8080`
2. Scroll down to **"Our Collection"** section
3. Look for your product

**What to check:**
- ✅ Does your product appear in the grid?
- ✅ If not, do you see "No Products Found" message?

**If product doesn't appear:**
- Check Step 5 (console) for warnings
- Verify Steps 2, 3, and 4 are all ✅

---

## Step 7: Check Product Detail Page

### 7.1 Try to Access Product Directly
1. Get the handle from Step 4
2. Try these URLs:
   - `http://localhost:8080/product/irani-chain` (if handle is "irani-chain")
   - `http://localhost:8080/product/irani%20Chain` (if handle has spaces)

**What to check:**
- ✅ Does the product page load?
- ✅ Or do you see "Product Not Found"?

**If "Product Not Found":**
1. Check browser console (F12) for:
   - `[getProductByHandle] Looking for handle: ...`
   - `[getProductByHandle] Found with ... handle: ...`
2. Verify the handle in database matches what you're using in URL

---

## Step 8: Complete Product Check

### 8.1 Run Complete Diagnostic
Run this SQL to check everything at once:

```sql
-- Complete product check
WITH product_check AS (
  SELECT 
    p.id,
    p.title,
    p.handle,
    p.status,
    COUNT(DISTINCT pv.id) as variant_count,
    COUNT(DISTINCT CASE 
      WHEN pv.available = true 
        AND pv.price > 0 
        AND pv.title IS NOT NULL 
        AND pv.title != '' 
      THEN pv.id 
    END) as valid_variant_count,
    COUNT(DISTINCT pi.id) as image_count,
    MIN(CASE WHEN pv.available = true AND pv.price > 0 THEN pv.price END) as min_price
  FROM products p
  LEFT JOIN product_variants pv ON p.id = pv.product_id
  LEFT JOIN product_images pi ON p.id = pi.product_id
  WHERE p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
  GROUP BY p.id, p.title, p.handle, p.status
)
SELECT 
  *,
  CASE 
    WHEN status != 'active' THEN '❌ ISSUE: Status is "' || status || '" (must be "active")'
    WHEN variant_count = 0 THEN '❌ ISSUE: No variants'
    WHEN valid_variant_count = 0 THEN '❌ ISSUE: No valid variants (check price, available, title)'
    WHEN handle LIKE '% %' THEN '⚠️ WARNING: Handle has spaces (should use hyphens)'
    ELSE '✅ Product should be visible!'
  END as diagnosis
FROM product_check;
```

**This will tell you exactly what's wrong!**

---

## Step 9: Quick Fixes (If Needed)

### Fix All Issues at Once
If the diagnostic shows issues, run these fixes:

```sql
-- Fix 1: Make product active
UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';

-- Fix 2: Fix handle (spaces to hyphens)
UPDATE products 
SET handle = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '--', '-'), '---', '-'))
WHERE id = 'YOUR_PRODUCT_ID';

-- Fix 3: Fix variant
UPDATE product_variants 
SET 
  available = true,
  price = 1000,  -- Set your actual price
  title = COALESCE(NULLIF(title, ''), 'Default')  -- Set size if empty
WHERE product_id = 'YOUR_PRODUCT_ID';
```

---

## Step 10: Verify Everything Works

### 10.1 Hard Refresh Browser
1. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)
2. This clears cache and reloads everything

### 10.2 Check Again
1. ✅ Homepage shows product in grid
2. ✅ Product detail page loads
3. ✅ Browser console shows no errors
4. ✅ Product has image, price, and "Add to Cart" button

---

## Still Not Working?

If you've completed all steps and product still doesn't show:

1. **Share the console output** - Copy all messages from browser console
2. **Share the SQL diagnostic result** - From Step 8
3. **Share the product ID** - So I can check the exact data

---

## Quick Checklist

Before asking for help, verify:
- [ ] Product exists in database (Step 1)
- [ ] Status = 'active' (Step 2)
- [ ] Product has at least one variant (Step 3)
- [ ] Variant has price > 0 (Step 3)
- [ ] Variant has available = true (Step 3)
- [ ] Variant has title/size not empty (Step 3)
- [ ] Handle is URL-friendly (no spaces) (Step 4)
- [ ] Browser console shows no errors (Step 5)
- [ ] Hard refreshed browser (Step 10)

If all checked ✅ but still not working, share the details and I'll help!

