-- Add default_coupon_id to products table
-- This allows assigning a specific coupon to a product
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS default_coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL;

-- Create index for coupon queries
CREATE INDEX IF NOT EXISTS idx_products_default_coupon_id ON public.products(default_coupon_id);

-- Add comment
COMMENT ON COLUMN public.products.default_coupon_id IS 'Default coupon assigned to this product (optional)';

