-- Quick Fix for Trigger Error
-- Run this if you get "trigger already exists" error

-- Drop existing triggers
DROP TRIGGER IF EXISTS ensure_single_active_gateway_trigger ON public.payment_gateways;
DROP TRIGGER IF EXISTS update_payment_gateways_updated_at_trigger ON public.payment_gateways;

-- Recreate triggers
CREATE TRIGGER ensure_single_active_gateway_trigger
BEFORE INSERT OR UPDATE ON public.payment_gateways
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION ensure_single_active_gateway();

CREATE TRIGGER update_payment_gateways_updated_at_trigger
BEFORE UPDATE ON public.payment_gateways
FOR EACH ROW
EXECUTE FUNCTION update_payment_gateways_updated_at();

-- Verify triggers are created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'payment_gateways';

