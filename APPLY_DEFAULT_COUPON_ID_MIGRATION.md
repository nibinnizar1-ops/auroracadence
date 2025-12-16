# Apply default_coupon_id Migration

## Error
"Could not find the 'default_coupon_id' column of 'products' in the schema cache"

## Solution
The migration `20250113000013_add_product_coupon_id.sql` needs to be applied to add the `default_coupon_id` column to the `products` table.

## Steps to Apply Migration

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Click on **SQL Editor** in the left sidebar

2. **Run the Migration**
   - Click **"New Query"**
   - Copy the entire contents of: `supabase/migrations/20250113000013_add_product_coupon_id.sql`
   - Paste into the SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)
   - Wait for success message

3. **Verify**
   - The migration should complete successfully
   - You should see: "Success. No rows returned"

## Migration Content

```sql
-- Add default_coupon_id to products table
-- This allows assigning a specific coupon to a product
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS default_coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL;

-- Create index for coupon queries
CREATE INDEX IF NOT EXISTS idx_products_default_coupon_id ON public.products(default_coupon_id);

-- Add comment
COMMENT ON COLUMN public.products.default_coupon_id IS 'Default coupon assigned to this product (optional)';
```

## After Applying

1. **Refresh your browser** - The error should be gone
2. **Try creating a product again** - It should work now
3. **Test coupon assignment** - You can now assign coupons to products

## Note

I've also updated the code to handle this more gracefully, but you still need to apply the migration for the feature to work properly.

