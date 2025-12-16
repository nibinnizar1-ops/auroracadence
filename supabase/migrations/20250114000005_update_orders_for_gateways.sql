-- ============================================
-- Update Orders Table for Payment Gateways
-- ============================================

-- Add payment_gateway_id column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_gateway_id UUID REFERENCES public.payment_gateways(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_gateway_id ON public.orders(payment_gateway_id);

-- Migrate existing orders to use Zwitch gateway
-- This assumes Zwitch gateway exists (from previous migration)
UPDATE public.orders
SET payment_gateway_id = (
  SELECT id FROM public.payment_gateways WHERE code = 'zwitch' LIMIT 1
)
WHERE payment_gateway_id IS NULL
  AND payment_method = 'zwitch'
  AND EXISTS (SELECT 1 FROM public.payment_gateways WHERE code = 'zwitch');

-- Add generic gateway payment ID columns (for backward compatibility, we keep razorpay_* columns)
-- These can be used by any gateway
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT;

-- Migrate existing razorpay_* columns to generic columns
UPDATE public.orders
SET 
  gateway_order_id = razorpay_order_id,
  gateway_payment_id = razorpay_payment_id
WHERE gateway_order_id IS NULL 
  AND (razorpay_order_id IS NOT NULL OR razorpay_payment_id IS NOT NULL);

-- Comments
COMMENT ON COLUMN public.orders.payment_gateway_id IS 'Reference to the payment gateway used for this order';
COMMENT ON COLUMN public.orders.gateway_order_id IS 'Generic gateway order ID (replaces gateway-specific columns)';
COMMENT ON COLUMN public.orders.gateway_payment_id IS 'Generic gateway payment ID (replaces gateway-specific columns)';

