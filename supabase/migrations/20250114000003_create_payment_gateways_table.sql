-- ============================================
-- Payment Gateways Management System
-- ============================================

-- Drop table if exists (for clean re-run - comment out if you want to preserve data)
-- DROP TABLE IF EXISTS public.payment_gateways CASCADE;

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- Display name: "Razorpay", "PayU", "Cashfree", "Zwitch"
  code TEXT NOT NULL UNIQUE, -- Internal code: "razorpay", "payu", "cashfree", "zwitch"
  is_active BOOLEAN NOT NULL DEFAULT false, -- Only one can be active at a time
  is_test_mode BOOLEAN NOT NULL DEFAULT true, -- Test/Live mode toggle
  credentials JSONB NOT NULL DEFAULT '{}', -- Encrypted gateway-specific credentials
  webhook_secret TEXT, -- For verifying webhook calls
  supported_currencies TEXT[] DEFAULT ARRAY['INR'], -- Default: ["INR"]
  supported_methods TEXT[] DEFAULT ARRAY['card', 'upi', 'netbanking', 'wallet'], -- Payment methods
  config JSONB DEFAULT '{}', -- Additional gateway-specific configuration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_gateways_code ON public.payment_gateways(code);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_active ON public.payment_gateways(is_active) WHERE is_active = true;

-- Function to ensure only one active gateway at a time
-- Using CREATE OR REPLACE to handle re-runs
CREATE OR REPLACE FUNCTION ensure_single_active_gateway()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new/updated row is being set to active
  IF NEW.is_active = true THEN
    -- Deactivate all other gateways
    UPDATE public.payment_gateways
    SET is_active = false, updated_at = now()
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (for re-running migration)
DROP TRIGGER IF EXISTS ensure_single_active_gateway_trigger ON public.payment_gateways;

-- Create trigger to ensure only one active gateway
CREATE TRIGGER ensure_single_active_gateway_trigger
BEFORE INSERT OR UPDATE ON public.payment_gateways
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION ensure_single_active_gateway();

-- Function to update updated_at timestamp
-- Using CREATE OR REPLACE to handle re-runs
CREATE OR REPLACE FUNCTION update_payment_gateways_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for re-running migration)
DROP TRIGGER IF EXISTS update_payment_gateways_updated_at_trigger ON public.payment_gateways;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_gateways_updated_at_trigger
BEFORE UPDATE ON public.payment_gateways
FOR EACH ROW
EXECUTE FUNCTION update_payment_gateways_updated_at();

-- Enable RLS
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can view active gateway (for frontend)
CREATE POLICY "Anyone can view active payment gateway"
ON public.payment_gateways
FOR SELECT
USING (is_active = true);

-- Admins can view all gateways
CREATE POLICY "Admins can view all payment gateways"
ON public.payment_gateways
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) = true);

-- Admins can manage payment gateways
CREATE POLICY "Admins can manage payment gateways"
ON public.payment_gateways
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Grant permissions
GRANT SELECT ON public.payment_gateways TO anon, authenticated;
GRANT ALL ON public.payment_gateways TO authenticated;

-- Comments
COMMENT ON TABLE public.payment_gateways IS 'Stores configuration for payment gateways (Razorpay, PayU, Cashfree, Zwitch, etc.)';
COMMENT ON COLUMN public.payment_gateways.code IS 'Internal code identifier: razorpay, payu, cashfree, zwitch';
COMMENT ON COLUMN public.payment_gateways.credentials IS 'Encrypted JSONB storing gateway-specific credentials (key_id, key_secret, merchant_key, etc.)';
COMMENT ON COLUMN public.payment_gateways.is_active IS 'Only one gateway can be active at a time (enforced by trigger)';
COMMENT ON COLUMN public.payment_gateways.is_test_mode IS 'Toggle between test/sandbox and live/production mode';

