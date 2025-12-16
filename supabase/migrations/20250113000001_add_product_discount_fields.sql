-- Add product-level discount fields to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', NULL)),
ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10,2) CHECK (discount_value IS NULL OR discount_value >= 0),
ADD COLUMN IF NOT EXISTS discount_valid_from TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS discount_valid_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS eligible_for_coupons BOOLEAN DEFAULT true;

-- Add index for discount queries
CREATE INDEX IF NOT EXISTS idx_products_discount_valid ON public.products(discount_valid_from, discount_valid_until)
WHERE discount_type IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.products.discount_type IS 'Type of discount: percentage or fixed amount';
COMMENT ON COLUMN public.products.discount_value IS 'Discount value (percentage or fixed amount)';
COMMENT ON COLUMN public.products.discount_valid_from IS 'Discount start date';
COMMENT ON COLUMN public.products.discount_valid_until IS 'Discount end date';
COMMENT ON COLUMN public.products.eligible_for_coupons IS 'Whether product is eligible for site-wide coupons';

