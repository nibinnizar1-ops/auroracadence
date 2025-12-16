-- ============================================
-- Migrate Existing Zwitch Configuration (OPTIONAL)
-- ============================================
-- This migration is OPTIONAL - only run if you want to migrate existing Zwitch credentials
-- from Edge Function secrets to the payment_gateways table.
--
-- If you prefer to configure through admin panel, skip this migration.
-- The gateway types are already pre-populated by migration 20250114000006_prepopulate_gateway_types.sql
--
-- IMPORTANT: Before running this migration, you need to:
-- 1. Get your ZWITCH_ACCESS_KEY from Supabase Edge Functions → Secrets
-- 2. Get your ZWITCH_SECRET_KEY from Supabase Edge Functions → Secrets
-- 3. Replace the placeholder values below with your actual credentials

-- Update Zwitch gateway with existing credentials (if gateway already exists from prepopulate migration)
-- NOTE: Replace 'YOUR_ZWITCH_ACCESS_KEY' and 'YOUR_ZWITCH_SECRET_KEY' with actual values
UPDATE public.payment_gateways
SET
  credentials = jsonb_build_object(
    'access_key', 'YOUR_ZWITCH_ACCESS_KEY', -- Replace with actual access key
    'secret_key', 'YOUR_ZWITCH_SECRET_KEY'  -- Replace with actual secret key
  ),
  is_active = true, -- Set as active gateway (optional - you can activate via admin panel instead)
  is_test_mode = false -- Set to false for live mode, true for test mode
WHERE code = 'zwitch'
  AND (credentials = '{}'::jsonb OR credentials IS NULL); -- Only update if not already configured

-- Verify the migration
-- Run this query to check if Zwitch gateway was updated:
-- SELECT id, name, code, is_active, is_test_mode, 
--        CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
-- FROM public.payment_gateways WHERE code = 'zwitch';

