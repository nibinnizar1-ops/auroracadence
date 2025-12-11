-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Discount Type
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Usage Limits
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0),
  max_uses_per_user INTEGER DEFAULT 1 CHECK (max_uses_per_user > 0),
  
  -- Minimum Requirements
  minimum_order_amount DECIMAL(10,2) CHECK (minimum_order_amount IS NULL OR minimum_order_amount >= 0),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false,
  
  -- Applicability
  applicable_to TEXT DEFAULT 'all' CHECK (applicable_to IN ('all', 'categories', 'products', 'collections')),
  applicable_ids JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coupon_usage table
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Store discount applied at time of use
  discount_amount DECIMAL(10,2) NOT NULL,
  order_total_before_discount DECIMAL(10,2) NOT NULL,
  order_total_after_discount DECIMAL(10,2) NOT NULL
);

-- Create indexes for coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active, is_paused);
CREATE INDEX IF NOT EXISTS idx_coupons_validity ON public.coupons(valid_from, valid_until);

-- Create indexes for coupon_usage
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON public.coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON public.coupon_usage(user_id);

-- Create trigger to update updated_at for coupons
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons (public read, admin write)
CREATE POLICY "Anyone can view active coupons" 
ON public.coupons 
FOR SELECT 
USING (is_active = true AND is_paused = false);

-- RLS Policies for coupon_usage (users can view their own usage)
CREATE POLICY "Users can view their own coupon usage" 
ON public.coupon_usage 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

