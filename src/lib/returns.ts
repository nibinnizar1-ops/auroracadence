import { supabase } from "@/integrations/supabase/client";

export interface ReturnRequest {
  id: string;
  order_id: string;
  user_id: string | null;
  return_number: string;
  request_type: 'return' | 'exchange' | 'refund';
  reason: string;
  reason_details: string | null;
  status: ReturnStatus;
  refund_method: 'original_payment' | 'store_credit' | 'exchange' | null;
  refund_amount: number | null;
  refund_processed_at: string | null;
  refund_transaction_id: string | null;
  exchange_order_id: string | null;
  admin_notes: string | null;
  rejected_reason: string | null;
  qc_notes: string | null;
  qc_checked_by: string | null;
  qc_checked_at: string | null;
  requested_at: string;
  approved_at: string | null;
  pickup_scheduled_at: string | null;
  received_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ReturnStatus =
  | 'pending'
  | 'approved'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'received'
  | 'qc_pending'
  | 'qc_passed'
  | 'qc_failed'
  | 'refund_processing'
  | 'refunded'
  | 'exchanged'
  | 'rejected'
  | 'cancelled';

export interface ReturnItem {
  id: string;
  return_request_id: string;
  order_line_item_id: string;
  product_id: string | null;
  variant_id: string | null;
  quantity: number;
  price_at_purchase: number;
  return_status: string;
  qc_status: 'pending' | 'passed' | 'failed' | null;
  qc_notes: string | null;
  condition_on_return: string | null;
  restocked: boolean;
  restocked_at: string | null;
  restocked_quantity: number | null;
  created_at: string;
}

export interface ReturnAttachment {
  id: string;
  return_request_id: string;
  file_url: string;
  file_type: 'photo' | 'video';
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface CreateReturnRequestInput {
  order_id: string;
  request_type: 'return' | 'exchange' | 'refund';
  reason: string;
  reason_details?: string;
  return_items: {
    order_line_item_id: string;
    quantity: number;
  }[];
  attachments?: {
    file_url: string;
    file_type: 'photo' | 'video';
  }[];
}

/**
 * Create a new return request
 */
export async function createReturnRequest(
  input: CreateReturnRequestInput
): Promise<{ data: ReturnRequest | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Create return request
    const { data: returnRequest, error: returnError } = await supabase
      .from('return_requests')
      .insert({
        order_id: input.order_id,
        user_id: user.id,
        request_type: input.request_type,
        reason: input.reason,
        reason_details: input.reason_details || null,
        status: 'pending',
      })
      .select()
      .single();

    if (returnError || !returnRequest) {
      return { data: null, error: returnError || new Error('Failed to create return request') };
    }

    // Get order line items to get prices
    const { data: orderItems } = await supabase
      .from('order_line_items')
      .select('id, price')
      .in('id', input.return_items.map(item => item.order_line_item_id));

    // Create return items
    const returnItemsData = input.return_items.map(item => {
      const orderItem = orderItems?.find(oi => oi.id === item.order_line_item_id);
      return {
        return_request_id: returnRequest.id,
        order_line_item_id: item.order_line_item_id,
        quantity: item.quantity,
        price_at_purchase: orderItem?.price || 0,
      };
    });

    const { error: itemsError } = await supabase
      .from('return_items')
      .insert(returnItemsData);

    if (itemsError) {
      // Rollback return request
      await supabase.from('return_requests').delete().eq('id', returnRequest.id);
      return { data: null, error: itemsError };
    }

    // Create attachments if provided
    if (input.attachments && input.attachments.length > 0) {
      const attachmentsData = input.attachments.map(att => ({
        return_request_id: returnRequest.id,
        file_url: att.file_url,
        file_type: att.file_type,
        uploaded_by: user.id,
      }));

      await supabase.from('return_attachments').insert(attachmentsData);
    }

    return { data: returnRequest as ReturnRequest, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get return requests for a user
 */
export async function getUserReturnRequests(userId: string): Promise<{
  data: ReturnRequest[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('return_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    return { data: data as ReturnRequest[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get all return requests (admin only)
 */
export async function getAllReturnRequests(filters?: {
  status?: ReturnStatus;
  date_from?: string;
  date_to?: string;
  order_number?: string;
  return_number?: string;
}): Promise<{
  data: ReturnRequest[] | null;
  error: Error | null;
}> {
  try {
    let query = supabase
      .from('return_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters?.return_number) {
      query = query.ilike('return_number', `%${filters.return_number}%`);
    }

    if (filters?.order_number) {
      // Need to join with orders table
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .ilike('order_number', `%${filters.order_number}%`);

      if (orders && orders.length > 0) {
        query = query.in('order_id', orders.map(o => o.id));
      } else {
        // No matching orders, return empty
        return { data: [], error: null };
      }
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error };
    }

    return { data: data as ReturnRequest[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get return request by ID with full details
 */
export async function getReturnRequestById(returnRequestId: string): Promise<{
  data: (ReturnRequest & {
    return_items: ReturnItem[];
    attachments: ReturnAttachment[];
    order: any;
  }) | null;
  error: Error | null;
}> {
  try {
    const { data: returnRequest, error: returnError } = await supabase
      .from('return_requests')
      .select('*')
      .eq('id', returnRequestId)
      .single();

    if (returnError || !returnRequest) {
      return { data: null, error: returnError || new Error('Return request not found') };
    }

    // Get return items
    const { data: returnItems, error: itemsError } = await supabase
      .from('return_items')
      .select('*')
      .eq('return_request_id', returnRequestId);

    if (itemsError) {
      return { data: null, error: itemsError };
    }

    // Get attachments
    const { data: attachments, error: attachmentsError } = await supabase
      .from('return_attachments')
      .select('*')
      .eq('return_request_id', returnRequestId)
      .order('uploaded_at', { ascending: false });

    if (attachmentsError) {
      return { data: null, error: attachmentsError };
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', returnRequest.order_id)
      .single();

    return {
      data: {
        ...(returnRequest as ReturnRequest),
        return_items: (returnItems || []) as ReturnItem[],
        attachments: (attachments || []) as ReturnAttachment[],
        order: order || null,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update return request status (admin only)
 */
export async function updateReturnRequestStatus(
  returnRequestId: string,
  updates: {
    status?: ReturnStatus;
    admin_notes?: string;
    rejected_reason?: string;
    qc_notes?: string;
    refund_method?: 'original_payment' | 'store_credit' | 'exchange';
    refund_amount?: number;
    refund_transaction_id?: string;
    exchange_order_id?: string;
  }
): Promise<{ data: ReturnRequest | null; error: Error | null }> {
  try {
    const updateData: any = {};

    if (updates.status) {
      updateData.status = updates.status;
      
      // Set timestamp based on status
      if (updates.status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (updates.status === 'received') {
        updateData.received_at = new Date().toISOString();
      } else if (updates.status === 'refunded') {
        updateData.refund_processed_at = new Date().toISOString();
      }
    }

    if (updates.admin_notes !== undefined) updateData.admin_notes = updates.admin_notes;
    if (updates.rejected_reason !== undefined) updateData.rejected_reason = updates.rejected_reason;
    if (updates.qc_notes !== undefined) {
      updateData.qc_notes = updates.qc_notes;
      updateData.qc_checked_at = new Date().toISOString();
    }
    if (updates.refund_method !== undefined) updateData.refund_method = updates.refund_method;
    if (updates.refund_amount !== undefined) updateData.refund_amount = updates.refund_amount;
    if (updates.refund_transaction_id !== undefined) updateData.refund_transaction_id = updates.refund_transaction_id;
    if (updates.exchange_order_id !== undefined) updateData.exchange_order_id = updates.exchange_order_id;

    const { data, error } = await supabase
      .from('return_requests')
      .update(updateData)
      .eq('id', returnRequestId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ReturnRequest, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update return item QC status
 */
export async function updateReturnItemQC(
  returnItemId: string,
  updates: {
    qc_status: 'passed' | 'failed';
    qc_notes?: string;
    condition_on_return?: string;
    restocked?: boolean;
    restocked_quantity?: number;
  }
): Promise<{ data: ReturnItem | null; error: Error | null }> {
  try {
    const updateData: any = {
      qc_status: updates.qc_status,
      return_status: updates.qc_status === 'passed' ? 'qc_passed' : 'qc_failed',
    };

    if (updates.qc_notes !== undefined) updateData.qc_notes = updates.qc_notes;
    if (updates.condition_on_return !== undefined) updateData.condition_on_return = updates.condition_on_return;
    if (updates.restocked !== undefined) {
      updateData.restocked = updates.restocked;
      if (updates.restocked) {
        updateData.restocked_at = new Date().toISOString();
        updateData.restocked_quantity = updates.restocked_quantity || updates.restocked_quantity;
      }
    }

    const { data, error } = await supabase
      .from('return_items')
      .update(updateData)
      .eq('id', returnItemId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ReturnItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Cancel return request (user only, for pending requests)
 */
export async function cancelReturnRequest(
  returnRequestId: string
): Promise<{ data: ReturnRequest | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('return_requests')
      .update({ status: 'cancelled' })
      .eq('id', returnRequestId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ReturnRequest, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Check if order is eligible for return (within 3 days of delivery)
 */
export async function isOrderEligibleForReturn(orderId: string): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('delivered_at, return_eligible_until, has_return_request, status')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return { eligible: false, reason: 'Order not found' };
    }

    // Check if order is delivered
    if (order.status !== 'delivered' && !order.delivered_at) {
      return { eligible: false, reason: 'Order not yet delivered' };
    }

    // Check if already has active return request
    if (order.has_return_request) {
      return { eligible: false, reason: 'Order already has an active return request' };
    }

    // Check if within return window
    const now = new Date();
    const eligibleUntil = order.return_eligible_until 
      ? new Date(order.return_eligible_until)
      : order.delivered_at 
        ? new Date(new Date(order.delivered_at).getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
        : null;

    if (!eligibleUntil) {
      return { eligible: false, reason: 'Return eligibility period not set' };
    }

    if (now > eligibleUntil) {
      return { eligible: false, reason: 'Return window has expired (3 days from delivery)' };
    }

    return { eligible: true };
  } catch (error) {
    return { eligible: false, reason: 'Error checking eligibility' };
  }
}



