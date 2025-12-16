-- Create return_requests table
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

-- Create return_items table
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

-- Create return_attachments table (for photos/videos)
CREATE TABLE IF NOT EXISTS public.return_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID NOT NULL REFERENCES public.return_requests(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video')),
  uploaded_by UUID REFERENCES auth.users(id), -- Customer or admin
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for return_requests
CREATE INDEX IF NOT EXISTS idx_return_requests_order_id ON public.return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_user_id ON public.return_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON public.return_requests(status);
CREATE INDEX IF NOT EXISTS idx_return_requests_return_number ON public.return_requests(return_number);
CREATE INDEX IF NOT EXISTS idx_return_requests_requested_at ON public.return_requests(requested_at);

-- Create indexes for return_items
CREATE INDEX IF NOT EXISTS idx_return_items_return_request_id ON public.return_items(return_request_id);
CREATE INDEX IF NOT EXISTS idx_return_items_order_line_item_id ON public.return_items(order_line_item_id);
CREATE INDEX IF NOT EXISTS idx_return_items_product_id ON public.return_items(product_id);
CREATE INDEX IF NOT EXISTS idx_return_items_variant_id ON public.return_items(variant_id);

-- Create indexes for return_attachments
CREATE INDEX IF NOT EXISTS idx_return_attachments_return_request_id ON public.return_attachments(return_request_id);

-- Create function to generate return number
CREATE OR REPLACE FUNCTION generate_return_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INT;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.return_requests;
  new_number := 'RET-' || LPAD(counter::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate return_number
CREATE OR REPLACE FUNCTION set_return_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.return_number IS NULL OR NEW.return_number = '' THEN
    NEW.return_number := generate_return_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_return_number_trigger
BEFORE INSERT ON public.return_requests
FOR EACH ROW
EXECUTE FUNCTION set_return_number();

-- Create trigger to update updated_at for return_requests
CREATE TRIGGER update_return_requests_updated_at
BEFORE UPDATE ON public.return_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for return_requests
-- Users can view their own return requests, admins can view all
CREATE POLICY "Users can view their own return requests"
ON public.return_requests FOR SELECT
USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Users can create return requests
CREATE POLICY "Users can create return requests"
ON public.return_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins can update return requests
CREATE POLICY "Admins can update return requests"
ON public.return_requests FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Users can update their own pending requests (to cancel)
CREATE POLICY "Users can cancel their pending return requests"
ON public.return_requests FOR UPDATE
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (status = 'cancelled');

-- RLS Policies for return_items
-- Users can view their return items
CREATE POLICY "Users can view their return items"
ON public.return_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND (return_requests.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

-- Users can create return items (when creating return request)
CREATE POLICY "Users can create return items"
ON public.return_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND return_requests.user_id = auth.uid()
  )
);

-- Admins can update return items
CREATE POLICY "Admins can update return items"
ON public.return_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_items.return_request_id
    AND public.is_admin(auth.uid())
  )
);

-- RLS Policies for return_attachments
-- Users can view attachments for their return requests
CREATE POLICY "Users can view their return attachments"
ON public.return_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_attachments.return_request_id
    AND (return_requests.user_id = auth.uid() OR public.is_admin(auth.uid()))
  )
);

-- Users can upload attachments for their return requests
CREATE POLICY "Users can upload return attachments"
ON public.return_attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.return_requests
    WHERE return_requests.id = return_attachments.return_request_id
    AND return_requests.user_id = auth.uid()
  )
);

-- Admins can upload attachments
CREATE POLICY "Admins can upload return attachments"
ON public.return_attachments FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));



