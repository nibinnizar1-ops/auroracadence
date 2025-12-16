-- ============================================
-- Inventory Management System
-- ============================================

-- Function to deduct inventory when order is placed
CREATE OR REPLACE FUNCTION deduct_inventory(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_order_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_current_qty INTEGER;
  v_policy TEXT;
  v_result JSONB;
BEGIN
  -- Get current inventory and policy
  SELECT inventory_quantity, inventory_policy
  INTO v_current_qty, v_policy
  FROM product_variants
  WHERE id = p_variant_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Variant not found'
    );
  END IF;

  -- Check if sufficient stock (if policy is 'deny')
  IF v_policy = 'deny' AND v_current_qty < p_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock',
      'available', v_current_qty,
      'requested', p_quantity
    );
  END IF;

  -- Deduct inventory
  UPDATE product_variants
  SET 
    inventory_quantity = GREATEST(0, inventory_quantity - p_quantity),
    available = CASE
      WHEN inventory_policy = 'deny' AND (inventory_quantity - p_quantity) <= 0
      THEN false
      ELSE available
    END,
    updated_at = now()
  WHERE id = p_variant_id;

  RETURN jsonb_build_object(
    'success', true,
    'quantity_before', v_current_qty,
    'quantity_after', GREATEST(0, v_current_qty - p_quantity)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to restore inventory (for cancellations, returns, etc.)
CREATE OR REPLACE FUNCTION restore_inventory(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_reason TEXT DEFAULT 'return',
  p_order_id UUID DEFAULT NULL,
  p_return_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_current_qty INTEGER;
  v_result JSONB;
BEGIN
  -- Get current inventory
  SELECT inventory_quantity
  INTO v_current_qty
  FROM product_variants
  WHERE id = p_variant_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Variant not found'
    );
  END IF;

  -- Restore inventory
  UPDATE product_variants
  SET 
    inventory_quantity = inventory_quantity + p_quantity,
    available = true, -- Mark as available when inventory is restored
    updated_at = now()
  WHERE id = p_variant_id;

  RETURN jsonb_build_object(
    'success', true,
    'quantity_before', v_current_qty,
    'quantity_after', v_current_qty + p_quantity
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check inventory availability
CREATE OR REPLACE FUNCTION check_inventory_availability(
  p_variant_id UUID,
  p_requested_quantity INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_current_qty INTEGER;
  v_policy TEXT;
  v_available BOOLEAN;
  v_result JSONB;
BEGIN
  -- Get current inventory and policy
  SELECT inventory_quantity, inventory_policy, available
  INTO v_current_qty, v_policy, v_available
  FROM product_variants
  WHERE id = p_variant_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'available', false,
      'error', 'Variant not found'
    );
  END IF;

  -- If policy is 'continue', always allow (backorders allowed)
  IF v_policy = 'continue' THEN
    RETURN jsonb_build_object(
      'available', true,
      'quantity', v_current_qty,
      'policy', v_policy,
      'allows_backorder', true
    );
  END IF;

  -- If policy is 'deny', check if sufficient stock
  IF v_policy = 'deny' THEN
    IF v_current_qty >= p_requested_quantity AND v_available THEN
      RETURN jsonb_build_object(
        'available', true,
        'quantity', v_current_qty,
        'policy', v_policy,
        'allows_backorder', false
      );
    ELSE
      RETURN jsonb_build_object(
        'available', false,
        'quantity', v_current_qty,
        'requested', p_requested_quantity,
        'policy', v_policy,
        'allows_backorder', false,
        'error', CASE 
          WHEN v_current_qty < p_requested_quantity THEN 'Insufficient stock'
          WHEN NOT v_available THEN 'Product not available'
          ELSE 'Out of stock'
        END
      );
    END IF;
  END IF;

  -- Default: not available
  RETURN jsonb_build_object(
    'available', false,
    'error', 'Unknown policy'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to deduct inventory for all items in an order
CREATE OR REPLACE FUNCTION deduct_order_inventory(
  p_order_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_result JSONB;
  v_success_count INTEGER := 0;
  v_fail_count INTEGER := 0;
  v_errors TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Loop through all order line items
  FOR v_item IN 
    SELECT variant_id, quantity
    FROM order_line_items
    WHERE order_id = p_order_id
      AND variant_id IS NOT NULL
  LOOP
    -- Deduct inventory for this item
    v_result := deduct_inventory(v_item.variant_id, v_item.quantity, p_order_id);
    
    IF (v_result->>'success')::boolean THEN
      v_success_count := v_success_count + 1;
    ELSE
      v_fail_count := v_fail_count + 1;
      v_errors := array_append(v_errors, 
        format('Variant %s: %s', v_item.variant_id, v_result->>'error')
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', v_fail_count = 0,
    'success_count', v_success_count,
    'fail_count', v_fail_count,
    'errors', v_errors
  );
END;
$$ LANGUAGE plpgsql;

-- Function to restore inventory for all items in an order
CREATE OR REPLACE FUNCTION restore_order_inventory(
  p_order_id UUID,
  p_reason TEXT DEFAULT 'cancellation'
) RETURNS JSONB AS $$
DECLARE
  v_item RECORD;
  v_result JSONB;
  v_success_count INTEGER := 0;
  v_fail_count INTEGER := 0;
  v_errors TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Loop through all order line items
  FOR v_item IN 
    SELECT variant_id, quantity
    FROM order_line_items
    WHERE order_id = p_order_id
      AND variant_id IS NOT NULL
  LOOP
    -- Restore inventory for this item
    v_result := restore_inventory(
      v_item.variant_id, 
      v_item.quantity, 
      p_reason, 
      p_order_id
    );
    
    IF (v_result->>'success')::boolean THEN
      v_success_count := v_success_count + 1;
    ELSE
      v_fail_count := v_fail_count + 1;
      v_errors := array_append(v_errors, 
        format('Variant %s: %s', v_item.variant_id, v_result->>'error')
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', v_fail_count = 0,
    'success_count', v_success_count,
    'fail_count', v_fail_count,
    'errors', v_errors
  );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION deduct_inventory(UUID, INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_inventory(UUID, INTEGER, TEXT, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_inventory_availability(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_order_inventory(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_order_inventory(UUID, TEXT) TO authenticated;

-- Note: These functions will be called by Edge Functions using service role key
-- So they don't need RLS, but we grant to authenticated for potential admin UI use



