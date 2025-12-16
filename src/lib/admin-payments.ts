import { supabase } from "@/integrations/supabase/client";

export interface PaymentTransaction {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  payment_method: string;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  order_status: string;
}

/**
 * Get all payment transactions for admin
 */
export async function getAllPaymentTransactions(filters?: {
  payment_status?: string;
  payment_method?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}): Promise<PaymentTransaction[]> {
  try {
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        payment_method,
        payment_status,
        razorpay_order_id,
        razorpay_payment_id,
        total as amount,
        currency,
        status as order_status,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (filters?.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }

    if (filters?.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }

    if (filters?.search) {
      query = query.or(
        `order_number.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,razorpay_payment_id.ilike.%${filters.search}%`
      );
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching payment transactions:', error);
      throw error;
    }

    return (data || []).map((order: any) => ({
      id: order.id,
      order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      payment_method: order.payment_method || 'zwitch',
      payment_status: order.payment_status || 'pending',
      razorpay_order_id: order.razorpay_order_id,
      razorpay_payment_id: order.razorpay_payment_id,
      amount: parseFloat(order.amount?.toString() || '0'),
      currency: order.currency || 'INR',
      created_at: order.created_at,
      updated_at: order.updated_at,
      order_status: order.order_status || 'pending',
    }));
  } catch (error) {
    console.error('Error in getAllPaymentTransactions:', error);
    return [];
  }
}

/**
 * Get payment statistics
 */
export async function getPaymentStats(): Promise<{
  totalTransactions: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  todayRevenue: number;
}> {
  try {
    // Get all orders
    const { data: allOrders } = await supabase
      .from('orders')
      .select('payment_status, total, created_at');

    if (!allOrders) {
      return {
        totalTransactions: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        totalRevenue: 0,
        todayRevenue: 0,
      };
    }

    const totalTransactions = allOrders.length;
    const successfulPayments = allOrders.filter(
      (o) => o.payment_status === 'paid' || o.payment_status === 'completed' || o.payment_status === 'confirmed'
    ).length;
    const pendingPayments = allOrders.filter(
      (o) => o.payment_status === 'pending'
    ).length;
    const failedPayments = allOrders.filter(
      (o) => o.payment_status === 'failed'
    ).length;

    const totalRevenue = allOrders
      .filter((o) => o.payment_status === 'paid' || o.payment_status === 'completed' || o.payment_status === 'confirmed')
      .reduce((sum, o) => sum + parseFloat(o.total?.toString() || '0'), 0);

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = allOrders
      .filter(
        (o) =>
          (o.payment_status === 'paid' || o.payment_status === 'completed' || o.payment_status === 'confirmed') &&
          new Date(o.created_at) >= today
      )
      .reduce((sum, o) => sum + parseFloat(o.total?.toString() || '0'), 0);

    return {
      totalTransactions,
      successfulPayments,
      pendingPayments,
      failedPayments,
      totalRevenue,
      todayRevenue,
    };
  } catch (error) {
    console.error('Error in getPaymentStats:', error);
    return {
      totalTransactions: 0,
      successfulPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      totalRevenue: 0,
      todayRevenue: 0,
    };
  }
}

