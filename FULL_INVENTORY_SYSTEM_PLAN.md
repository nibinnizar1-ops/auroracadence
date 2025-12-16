# Full Inventory System - Implementation Plan

## 🎯 Overview

This plan outlines the implementation of a complete, automated inventory management system that tracks stock levels, validates availability, and provides alerts for low stock items.

---

## 📋 Features to Implement

### 1. Automatic Inventory Deduction ✅
**When Orders Are Placed:**
- Deduct inventory from `product_variants.inventory_quantity` when order is created
- Only deduct after payment is confirmed (not just order creation)
- Handle payment failures gracefully (restore inventory if payment fails)

**When Orders Are Cancelled:**
- Restore inventory back to `product_variants.inventory_quantity`
- Handle partial cancellations (if only some items are cancelled)

**Implementation:**
- Update `create-razorpay-order` Edge Function to deduct inventory
- Update `verify-razorpay-payment` Edge Function to handle payment success/failure
- Add database function/trigger for inventory updates
- Add rollback mechanism for failed payments

---

### 2. Stock Validation at Checkout & Cart ✅
**Before Adding to Cart:**
- Check `inventory_quantity` vs requested quantity
- Show error if insufficient stock
- Prevent adding more than available

**At Checkout:**
- Final validation before payment
- Prevent checkout if any item is out of stock
- Show clear error messages

**UI Indicators:**
- "Out of Stock" badge on products
- "Only X left" warning for low stock
- Disable "Add to Cart" button when out of stock

**Implementation:**
- Add validation in `cartStore.addItem()`
- Add validation in checkout page before payment
- Update product display components to show stock status
- Add inventory check API endpoint

---

### 3. Low Stock Alerts ✅
**Dashboard Widget:**
- Show products with `inventory_quantity < threshold` (configurable, default: 10)
- Display variant name, current stock, and link to edit
- Count of low stock items

**Product List:**
- Show "Low Stock" badge on products in admin
- Filter by low stock status
- Sort by inventory quantity (ascending)

**Implementation:**
- Query variants with low inventory
- Create dashboard widget component
- Add filter to admin products list

---

### 4. Restock on Return ✅
**When Return is Approved & Restocked:**
- Restore inventory when return item is marked as "restocked"
- Handle partial returns (only restock returned items)
- Update inventory when return status changes to "restocked"

**Implementation:**
- Update return management system
- Add inventory restoration logic in return approval
- Track which items are restocked vs refunded

---

### 5. Inventory History/Audit Trail (Optional) ⭐
**Track Changes:**
- Record when inventory changes
- Record who changed it (admin user)
- Record reason (order, return, manual, etc.)
- Show inventory history per variant

**Implementation:**
- Create `inventory_history` table
- Add triggers to log changes
- Create admin UI to view history

---

## 🗄️ Database Changes

### New Table: `inventory_history` (Optional)
```sql
CREATE TABLE inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL, -- Positive for additions, negative for deductions
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'order', 'return', 'manual', 'cancellation'
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  return_id UUID REFERENCES return_requests(id) ON DELETE SET NULL,
  admin_user_id UUID, -- If manual change
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Database Functions Needed:
1. **`deduct_inventory(variant_id, quantity, order_id)`**
   - Deducts inventory and logs change
   - Returns success/error

2. **`restore_inventory(variant_id, quantity, reason, order_id)`**
   - Restores inventory and logs change
   - Returns success/error

3. **`check_inventory_availability(variant_id, requested_quantity)`**
   - Checks if sufficient stock available
   - Returns boolean

---

## 🔧 Implementation Steps

### Phase 1: Core Inventory Functions
1. ✅ Create database functions for inventory operations
2. ✅ Add inventory deduction to order creation
3. ✅ Add inventory restoration on order cancellation
4. ✅ Add inventory restoration on payment failure

### Phase 2: Stock Validation
1. ✅ Add inventory check API endpoint
2. ✅ Update cart store to validate stock
3. ✅ Update checkout page to validate stock
4. ✅ Add UI indicators (out of stock badges)

### Phase 3: Low Stock Alerts
1. ✅ Create low stock query function
2. ✅ Add dashboard widget
3. ✅ Add filter to products list
4. ✅ Add "Low Stock" badges

### Phase 4: Return Restock
1. ✅ Update return management to restore inventory
2. ✅ Add restock status tracking
3. ✅ Update return detail page

### Phase 5: Inventory History (Optional)
1. ⭐ Create `inventory_history` table
2. ⭐ Add triggers to log changes
3. ⭐ Create admin UI for history view

---

## 📊 Database Schema Updates

### Update `product_variants` table:
- ✅ Already has `inventory_quantity` and `inventory_policy`
- ✅ Already has `available` flag

### New Functions:
```sql
-- Function to deduct inventory
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
    RETURN jsonb_build_object('success', false, 'error', 'Variant not found');
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
  SET inventory_quantity = GREATEST(0, inventory_quantity - p_quantity),
      available = CASE
        WHEN inventory_policy = 'deny' AND (inventory_quantity - p_quantity) <= 0
        THEN false
        ELSE available
      END
  WHERE id = p_variant_id;

  -- Log to history (if table exists)
  -- INSERT INTO inventory_history ...

  RETURN jsonb_build_object(
    'success', true,
    'quantity_before', v_current_qty,
    'quantity_after', GREATEST(0, v_current_qty - p_quantity)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to restore inventory
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
    RETURN jsonb_build_object('success', false, 'error', 'Variant not found');
  END IF;

  -- Restore inventory
  UPDATE product_variants
  SET inventory_quantity = inventory_quantity + p_quantity,
      available = true
  WHERE id = p_variant_id;

  -- Log to history (if table exists)
  -- INSERT INTO inventory_history ...

  RETURN jsonb_build_object(
    'success', true,
    'quantity_before', v_current_qty,
    'quantity_after', v_current_qty + p_quantity
  );
END;
$$ LANGUAGE plpgsql;
```

---

## 🎨 UI/UX Updates

### Frontend Components:
1. **Stock Status Badge**
   - "Out of Stock" (red)
   - "Low Stock" (orange) - when < 10
   - "In Stock" (green) - when >= 10

2. **Cart Validation**
   - Show error toast when adding out-of-stock items
   - Disable "Add to Cart" button when out of stock
   - Show available quantity in error message

3. **Checkout Validation**
   - Show warning if any item is low stock
   - Prevent checkout if any item is out of stock
   - Show clear error messages

4. **Admin Dashboard**
   - Low Stock Widget
   - Quick stats (Total Products, Low Stock Count, Out of Stock Count)

5. **Admin Products List**
   - Low Stock badge
   - Filter by stock status
   - Sort by inventory quantity

---

## 🔄 Workflow Examples

### Order Placement Flow:
1. User adds item to cart → Check stock available
2. User proceeds to checkout → Final stock validation
3. Payment initiated → Create order (don't deduct yet)
4. Payment confirmed → Deduct inventory
5. Payment failed → Don't deduct (or restore if already deducted)

### Return Flow:
1. User requests return → No inventory change
2. Admin approves return → No inventory change yet
3. Admin marks item as "restocked" → Restore inventory
4. Admin marks item as "refunded" → No inventory change

### Cancellation Flow:
1. Order cancelled → Restore inventory for all items
2. Partial cancellation → Restore inventory for cancelled items only

---

## ⚙️ Configuration

### Settings (can be stored in database or config):
- **Low Stock Threshold**: Default 10 (configurable)
- **Out of Stock Threshold**: 0
- **Enable Inventory History**: true/false (optional feature)

---

## 🧪 Testing Checklist

- [ ] Add item to cart with sufficient stock → Should work
- [ ] Add item to cart with insufficient stock → Should show error
- [ ] Add item to cart when out of stock → Should prevent
- [ ] Checkout with sufficient stock → Should proceed
- [ ] Checkout with insufficient stock → Should prevent
- [ ] Order placed → Inventory should deduct
- [ ] Order cancelled → Inventory should restore
- [ ] Payment failed → Inventory should not deduct (or restore)
- [ ] Return restocked → Inventory should restore
- [ ] Low stock alert → Should show in dashboard
- [ ] Out of stock badge → Should show on products

---

## 📝 Notes

1. **Payment Confirmation**: Inventory should only be deducted after payment is confirmed, not just when order is created.

2. **Concurrency**: Handle multiple orders for the same variant simultaneously (use database transactions).

3. **Backorders**: If `inventory_policy = 'continue'`, allow orders even when stock is 0.

4. **Manual Adjustments**: Admins can still manually adjust inventory in the product form.

5. **Inventory History**: Optional feature - can be added later if needed.

---

## 🚀 Implementation Order

1. **Step 1**: Create database functions for inventory operations
2. **Step 2**: Update order creation to deduct inventory (after payment confirmed)
3. **Step 3**: Add stock validation to cart and checkout
4. **Step 4**: Add UI indicators (badges, warnings)
5. **Step 5**: Add low stock alerts to dashboard
6. **Step 6**: Add restock on return
7. **Step 7**: (Optional) Add inventory history

---

## ✅ Success Criteria

- ✅ Inventory automatically deducts when orders are placed
- ✅ Inventory restores when orders are cancelled
- ✅ Users cannot add out-of-stock items to cart
- ✅ Users cannot checkout with insufficient stock
- ✅ Low stock items are highlighted in admin
- ✅ Returns restore inventory when restocked
- ✅ All inventory changes are logged (if history enabled)

---

**Ready to implement?** Let's start with Phase 1! 🎯



