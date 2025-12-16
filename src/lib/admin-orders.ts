import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address: any;
  items: any;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  status: string;
  notes: string | null;
  coupon_id: string | null;
  discount_amount: number;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all orders for admin
 */
export async function getAllOrdersForAdmin(filters?: {
  status?: string;
  payment_status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}): Promise<Order[]> {
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }

    if (filters?.search) {
      query = query.or(`order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllOrdersForAdmin:', error);
    return [];
  }
}

/**
 * Get order by ID for admin
 */
export async function getOrderByIdForAdmin(orderId: string): Promise<{
  order: Order;
  line_items: any[];
} | null> {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return null;
    }

    const { data: lineItems } = await supabase
      .from('order_line_items')
      .select('*')
      .eq('order_id', orderId);

    return {
      order: order as Order,
      line_items: lineItems || [],
    };
  } catch (error) {
    console.error('Error in getOrderByIdForAdmin:', error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  notes?: string
): Promise<{ data: Order | null; error: Error | null }> {
  try {
    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as Order, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalReturns: number;
  pendingReturns: number;
  activeCoupons: number;
  totalRevenue: number;
}> {
  try {
    // Get product counts
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get order counts
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get revenue (sum of paid orders)
    const { data: paidOrders } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid');
    
    const totalRevenue = paidOrders?.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0) || 0;

    // Get return counts
    const { count: totalReturns } = await supabase
      .from('return_requests')
      .select('*', { count: 'exact', head: true });
    
    const { count: pendingReturns } = await supabase
      .from('return_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get active coupon count
    const { count: activeCoupons } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_paused', false);

    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalReturns: totalReturns || 0,
      pendingReturns: pendingReturns || 0,
      activeCoupons: activeCoupons || 0,
      totalRevenue: totalRevenue,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalReturns: 0,
      pendingReturns: 0,
      activeCoupons: 0,
      totalRevenue: 0,
    };
  }
}

