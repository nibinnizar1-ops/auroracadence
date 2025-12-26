-- ============================================
-- Zwitch Payment Gateway Setup Verification
-- ============================================
-- Run these queries to verify your Zwitch setup

-- 1. Check if payment_gateways table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'payment_gateways'
) as table_exists;

-- 2. Check if Zwitch gateway exists
SELECT 
  id, 
  name, 
  code, 
  is_active, 
  is_test_mode,
  created_at
FROM payment_gateways 
WHERE code = 'zwitch';

-- 3. Check if orders table has payment_gateway_id column
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_gateway_id', 'gateway_order_id', 'gateway_payment_id');

-- 4. Check Zwitch gateway configuration (if configured)
SELECT 
  code, 
  name, 
  is_active, 
  is_test_mode,
  CASE 
    WHEN credentials->>'access_key' IS NOT NULL THEN '✅ Configured' 
    ELSE '❌ Not Configured' 
  END as status,
  CASE 
    WHEN credentials->>'access_key' LIKE 'ak_live_%' THEN 'LIVE Key'
    WHEN credentials->>'access_key' LIKE 'ak_test_%' THEN 'TEST Key'
    ELSE 'Unknown'
  END as key_type,
  LEFT(credentials->>'access_key', 20) as access_key_prefix,
  CASE 
    WHEN credentials->>'secret_key' IS NOT NULL THEN '✅ Has Secret Key' 
    ELSE '❌ Missing Secret Key' 
  END as secret_key_status
FROM payment_gateways 
WHERE code = 'zwitch';

-- 5. Check if Zwitch is active
SELECT 
  CASE 
    WHEN is_active = true THEN '✅ Active' 
    ELSE '❌ Not Active' 
  END as activation_status,
  CASE 
    WHEN is_test_mode = false THEN '✅ LIVE Mode' 
    WHEN is_test_mode = true THEN '⚠️ TEST Mode' 
    ELSE '❓ Unknown'
  END as mode_status
FROM payment_gateways 
WHERE code = 'zwitch';

-- 6. Summary check (all in one)
SELECT 
  'Payment Gateways Table' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'payment_gateways'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status
UNION ALL
SELECT 
  'Zwitch Gateway Entry' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM payment_gateways WHERE code = 'zwitch'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status
UNION ALL
SELECT 
  'Zwitch Gateway Active' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM payment_gateways WHERE code = 'zwitch' AND is_active = true
  ) THEN '✅ Active' ELSE '❌ Not Active' END as status
UNION ALL
SELECT 
  'Zwitch Credentials Configured' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM payment_gateways 
    WHERE code = 'zwitch' 
    AND credentials->>'access_key' IS NOT NULL 
    AND credentials->>'secret_key' IS NOT NULL
  ) THEN '✅ Configured' ELSE '❌ Not Configured' END as status
UNION ALL
SELECT 
  'Zwitch in LIVE Mode' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM payment_gateways 
    WHERE code = 'zwitch' 
    AND is_active = true 
    AND is_test_mode = false
  ) THEN '✅ LIVE Mode' ELSE '⚠️ Not LIVE Mode' END as status
UNION ALL
SELECT 
  'Orders Table Updated' as check_item,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_gateway_id'
  ) THEN '✅ Updated' ELSE '❌ Not Updated' END as status;

