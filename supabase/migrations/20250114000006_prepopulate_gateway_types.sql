-- ============================================
-- Pre-populate Payment Gateway Types
-- ============================================
-- This migration creates entries for all supported payment gateway types
-- Admin can then configure credentials for each gateway through the admin panel

-- Insert all supported gateway types (without credentials - admin will configure)
INSERT INTO public.payment_gateways (
  name,
  code,
  is_active,
  is_test_mode,
  credentials,
  supported_currencies,
  supported_methods,
  config
) VALUES
  -- Razorpay
  (
    'Razorpay',
    'razorpay',
    false, -- Not active by default
    true, -- Test mode by default
    '{}'::jsonb, -- Empty credentials - admin will configure
    ARRAY['INR'],
    ARRAY['card', 'upi', 'netbanking', 'wallet'],
    jsonb_build_object(
      'api_base_url', 'https://api.razorpay.com/v1/',
      'sdk_url', 'https://checkout.razorpay.com/v1/checkout.js'
    )
  ),
  -- PayU
  (
    'PayU',
    'payu',
    false,
    true,
    '{}'::jsonb,
    ARRAY['INR'],
    ARRAY['card', 'upi', 'netbanking', 'wallet'],
    jsonb_build_object(
      'api_base_url_test', 'https://test.payu.in/',
      'api_base_url_live', 'https://secure.payu.in/',
      'sdk_url', 'https://secure.payu.in/_payment'
    )
  ),
  -- Cashfree
  (
    'Cashfree',
    'cashfree',
    false,
    true,
    '{}'::jsonb,
    ARRAY['INR'],
    ARRAY['card', 'upi', 'netbanking', 'wallet'],
    jsonb_build_object(
      'api_base_url_test', 'https://sandbox.cashfree.com/pg',
      'api_base_url_live', 'https://api.cashfree.com/pg',
      'sdk_url', 'https://sdk.cashfree.com/js/v3/cashfree.js'
    )
  ),
  -- Zwitch
  (
    'Zwitch',
    'zwitch',
    false, -- Not active by default (admin will activate after configuring)
    true, -- Test mode by default
    '{}'::jsonb, -- Empty credentials - admin will configure
    ARRAY['INR'],
    ARRAY['card', 'upi', 'netbanking', 'wallet'],
    jsonb_build_object(
      'api_base_url', 'https://api.zwitch.io/v1/',
      'sdk_url', 'https://payments.open.money/layer'
    )
  )
ON CONFLICT (code) DO NOTHING; -- Don't overwrite if already exists

-- Verify the migration
-- Run this query to check all gateways:
-- SELECT id, name, code, is_active, is_test_mode, 
--        CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
-- FROM public.payment_gateways ORDER BY name;

