# Fix "default_coupon_id column not found" Error

## Error Message
"Could not find the 'default_coupon_id' column of 'products' in the schema cache"

## Cause
The migration that adds the `default_coupon_id` column to the `products` table hasn't been applied yet.

## Solution

### Step 1: Apply the Migration

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Click **SQL Editor** in the left sidebar

2. **Run the Migration**
   - Click **"New Query"**
   - Copy and paste this SQL:

```sql
-- Add default_coupon_id to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS default_coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL;

-- Create index for coupon queries
CREATE INDEX IF NOT EXISTS idx_products_default_coupon_id ON public.products(default_coupon_id);

-- Add comment
COMMENT ON COLUMN public.products.default_coupon_id IS 'Default coupon assigned to this product (optional)';
```

3. **Click "Run"** (or press Ctrl+Enter / Cmd+Enter)
4. **Wait for success** - You should see "Success. No rows returned"

### Step 2: Refresh Browser

After applying the migration:
1. Refresh your browser (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. Try creating a product again
3. The error should be gone

## What This Migration Does

- Adds `default_coupon_id` column to `products` table
- Allows linking products to specific coupons
- Creates an index for faster queries
- Sets up foreign key relationship with `coupons` table

## Code Changes Made

I've also updated the code to handle this more gracefully:
- ✅ `createProduct()` - Conditionally includes `default_coupon_id` only if provided
- ✅ `updateProduct()` - Conditionally includes `default_coupon_id` only if provided
- ✅ `ProductForm.tsx` - Handles missing column gracefully

However, **you still need to apply the migration** for the coupon assignment feature to work properly.

## Verification

After applying the migration, you should be able to:
- ✅ Create products without errors
- ✅ Assign coupons to products
- ✅ See coupon dropdown in product form

## Migration File Location

The migration file is at:
`supabase/migrations/20250113000013_add_product_coupon_id.sql`

You can also copy the SQL from that file if you prefer.

