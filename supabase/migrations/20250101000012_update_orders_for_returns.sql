-- Update orders table with return tracking columns
DO $$ 
BEGIN
  -- Add return_eligible_until column (3 days from delivery)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'return_eligible_until'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN return_eligible_until TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Add has_return_request column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'has_return_request'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN has_return_request BOOLEAN DEFAULT false;
  END IF;

  -- Add return_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'return_count'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN return_count INTEGER DEFAULT 0;
  END IF;

  -- Add delivered_at column (if not exists) - needed to calculate return_eligible_until
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'delivered_at'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN delivered_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create index for return eligibility
CREATE INDEX IF NOT EXISTS idx_orders_return_eligible_until ON public.orders(return_eligible_until);
CREATE INDEX IF NOT EXISTS idx_orders_has_return_request ON public.orders(has_return_request);

-- Create function to update has_return_request and return_count
CREATE OR REPLACE FUNCTION update_order_return_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the order's return status when return request is created/updated
  IF TG_OP = 'INSERT' THEN
    UPDATE public.orders
    SET has_return_request = true,
        return_count = return_count + 1
    WHERE id = NEW.order_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If return request is cancelled, decrement count
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE public.orders
      SET return_count = GREATEST(0, return_count - 1),
          has_return_request = CASE 
            WHEN return_count - 1 > 0 THEN true 
            ELSE false 
          END
      WHERE id = NEW.order_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update order return status
CREATE TRIGGER update_order_return_status_trigger
AFTER INSERT OR UPDATE ON public.return_requests
FOR EACH ROW
EXECUTE FUNCTION update_order_return_status();



