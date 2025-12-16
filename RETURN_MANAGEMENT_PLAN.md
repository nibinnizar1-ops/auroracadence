# Return Management System - Comprehensive Plan

## 🎯 Overview

A complete return management system integrated into the Admin Panel that handles:
- Customer return requests
- Admin approval/rejection workflow
- Quality check (QC) tracking
- Refund processing
- Partial returns (return some items, keep others)
- Return reason tracking
- Inventory restocking

---

## 📊 Database Schema

### 1. `return_requests` Table

```sql
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Request Details
  return_number TEXT UNIQUE NOT NULL, -- AUTO: RET-000001
  request_type TEXT NOT NULL CHECK (request_type IN ('return', 'exchange', 'refund')),
  reason TEXT NOT NULL, -- "Damaged", "Wrong item", "Not as described", "Changed mind", etc.
  reason_details TEXT, -- Additional customer notes
  
  -- Status Workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',        -- Customer submitted, awaiting admin review
    'approved',       -- Admin approved, awaiting pickup
    'pickup_scheduled', -- Pickup scheduled
    'in_transit',     -- Item picked up, on way to warehouse
    'received',      -- Item received at warehouse
    'qc_pending',    -- Awaiting quality check
    'qc_passed',     -- Quality check passed
    'qc_failed',      -- Quality check failed (item damaged/used)
    'refund_processing', -- Refund being processed
    'refunded',       -- Refund completed
    'exchanged',      -- Exchange completed
    'rejected',       -- Request rejected by admin
    'cancelled'       -- Cancelled by customer
  )),
  
  -- Refund Details
  refund_method TEXT CHECK (refund_method IN ('original_payment', 'store_credit', 'exchange')),
  refund_amount DECIMAL(10,2), -- Calculated based on items returned
  refund_processed_at TIMESTAMP WITH TIME ZONE,
  refund_transaction_id TEXT, -- Payment gateway transaction ID for refund
  
  -- Exchange Details (if applicable)
  exchange_order_id UUID REFERENCES public.orders(id), -- New order created for exchange
  
  -- Admin Actions
  admin_notes TEXT, -- Internal admin notes
  rejected_reason TEXT, -- If rejected, reason for rejection
  qc_notes TEXT, -- Quality check notes
  qc_checked_by UUID, -- Admin user who did QC
  qc_checked_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 2. `return_items` Table

```sql
CREATE TABLE IF NOT EXISTS public.return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES public.return_requests(id) ON DELETE CASCADE,
  order_line_item_id UUID NOT NULL REFERENCES public.order_line_items(id),
  
  -- Item Details
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10,2) NOT NULL, -- Price when purchased
  
  -- Return Status
  return_status TEXT DEFAULT 'pending' CHECK (return_status IN (
    'pending', 'approved', 'received', 'qc_passed', 'qc_failed', 'restocked', 'disposed'
  )),
  
  -- QC Details
  qc_status TEXT CHECK (qc_status IN ('pending', 'passed', 'failed')),
  qc_notes TEXT,
  condition_on_return TEXT, -- "new", "used", "damaged", "defective"
  
  -- Restocking
  restocked BOOLEAN DEFAULT false,
  restocked_at TIMESTAMP WITH TIME ZONE,
  restocked_quantity INTEGER, -- May be less than returned if some items damaged
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3. `return_attachments` Table (for photos/videos)

```sql
CREATE TABLE IF NOT EXISTS public.return_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES public.return_requests(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video')),
  uploaded_by UUID REFERENCES auth.users(id), -- Customer or admin
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 4. Update `orders` Table

```sql
-- Add return tracking columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_eligible_until TIMESTAMP WITH TIME ZONE, -- 3 days from delivery
ADD COLUMN IF NOT EXISTS has_return_request BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS return_count INTEGER DEFAULT 0; -- Track number of return requests
```

---

## 🔄 Return Workflow

### Customer Flow:
1. **Request Return** → Customer submits return request with reason
2. **Awaiting Approval** → Admin reviews request
3. **Approved** → Admin approves, schedules pickup
4. **Pickup Scheduled** → Courier scheduled
5. **In Transit** → Item picked up
6. **Received** → Item received at warehouse
7. **QC Pending** → Quality check initiated
8. **QC Passed/Failed** → Quality check result
9. **Refund Processing** → Refund initiated
10. **Refunded** → Refund completed

### Admin Actions:
- **Approve/Reject** return request
- **Schedule pickup** (manual or auto)
- **Mark as received** when item arrives
- **Perform QC** (pass/fail with notes)
- **Process refund** (original payment or store credit)
- **Restock inventory** (if QC passed)
- **Handle exchanges** (create new order)

---

## 🎨 Admin Panel Features

### 1. Return Requests Dashboard
- **List View**: All return requests with filters
  - Status filter (pending, approved, received, etc.)
  - Date range filter
  - Order number search
  - Return number search
- **Stats Cards**:
  - Total return requests
  - Pending approvals
  - QC pending
  - Refunds processed (today/week/month)
  - Return rate %

### 2. Return Request Detail Page
- **Order Information**: Link to original order
- **Customer Information**: Name, email, phone
- **Return Items**: List of items being returned
- **Return Reason**: Customer's reason + details
- **Attachments**: Photos/videos uploaded by customer
- **Status Timeline**: Visual workflow progress
- **Admin Actions**:
  - Approve/Reject button
  - Schedule Pickup
  - Mark as Received
  - Perform QC
  - Process Refund
  - Add Admin Notes
  - Update Status

### 3. QC (Quality Check) Interface
- **Item-by-item QC**:
  - Check each returned item
  - Mark as Pass/Fail
  - Add condition notes
  - Upload QC photos
- **Bulk Actions**: Mark all items as passed/failed
- **Restock Decision**: Auto-restock if QC passed

### 4. Refund Processing
- **Refund Calculator**: 
  - Show original amount
  - Calculate refund (minus shipping if applicable)
  - Choose refund method (original payment/store credit)
- **Refund Gateway Integration**: 
  - Process via Razorpay/Zwitch
  - Store transaction ID
  - Mark as processed
- **Store Credit**: 
  - Issue store credit code
  - Link to coupon system

### 5. Exchange Management
- **Exchange Flow**:
  - Select items to exchange
  - Choose replacement products
  - Create new order
  - Link exchange order to return request
  - Process price difference

### 6. Return Analytics
- **Return Rate**: % of orders with returns
- **Return Reasons**: Most common reasons
- **QC Pass/Fail Rate**: Quality metrics
- **Refund Processing Time**: Average time
- **Return by Product**: Which products returned most

---

## 👤 Customer-Facing Features

### 1. Return Request Form (in Profile/Order History)
- **Select Order**: From order history
- **Select Items**: Choose items to return (partial returns)
- **Return Reason**: Dropdown + text field
- **Upload Evidence**: Photos/videos (damaged items, etc.)
- **Submit Request**: Creates return request

### 2. Return Status Tracking
- **Return Status Page**: 
  - Current status
  - Timeline of status changes
  - Expected refund amount
  - Refund method
  - Tracking updates

### 3. Return History
- **Past Returns**: List of all return requests
- **Refund History**: Completed refunds
- **Exchange History**: Completed exchanges

---

## 🔐 RLS Policies

```sql
-- Return requests: Customers can view their own, admins can view all
CREATE POLICY "Users can view their own return requests"
ON public.return_requests FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Return requests: Customers can create, admins can update
CREATE POLICY "Users can create return requests"
ON public.return_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update return requests"
ON public.return_requests FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Return items: Same as return requests
CREATE POLICY "Users can view their return items"
ON public.return_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND (return_requests.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);
```

---

## 📋 Implementation Checklist

### Phase 1: Database Setup
- [ ] Create `return_requests` table
- [ ] Create `return_items` table
- [ ] Create `return_attachments` table
- [ ] Update `orders` table with return columns
- [ ] Create indexes
- [ ] Set up RLS policies
- [ ] Create return number generator function

### Phase 2: Admin Panel - Return Management
- [ ] Return requests list page
- [ ] Return request detail page
- [ ] Approve/Reject functionality
- [ ] Status update functionality
- [ ] QC interface
- [ ] Refund processing UI
- [ ] Exchange management UI
- [ ] Return analytics dashboard

### Phase 3: Customer-Facing Features
- [ ] Return request form (in Profile page)
- [ ] Return status tracking page
- [ ] Return history in Profile
- [ ] File upload for attachments

### Phase 4: Integration
- [ ] Payment gateway refund API integration
- [ ] Email notifications (optional)
- [ ] Inventory restocking automation
- [ ] Store credit system integration

---

## 💡 Benefits

1. **Streamlined Process**: Centralized return management
2. **Better Tracking**: Complete audit trail
3. **Faster Processing**: Clear workflow reduces delays
4. **Data Insights**: Analytics help improve products/policies
5. **Customer Satisfaction**: Transparent return process
6. **Inventory Management**: Auto-restock on QC pass
7. **Compliance**: Follows your 3-day return policy

---

## 🎯 Next Steps

1. **Review this plan** - Does this match your needs?
2. **Confirm workflow** - Any changes to the status flow?
3. **Start Phase 1** - Create database tables
4. **Build Admin UI** - Return management interface
5. **Add Customer UI** - Return request form

**Ready to implement?** 🚀

