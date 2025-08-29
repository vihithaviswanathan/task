import { supabase } from '@/lib/supabase';
import { Order, CartItem } from '@/types';

export class OrderService {
  static async createOrder(userId: string, cartItems: CartItem[]): Promise<Order | null> {
    const totalAmount = cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return null;
    }

    return order;
  }

  static async getOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  }

  static getStatusMessage(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': '📋 Order received and being processed',
      'confirmed': '✅ Order confirmed and being prepared',
      'preparing': '👨‍🍳 Your order is being prepared',
      'out_for_delivery': '🚚 Out for delivery',
      'delivered': '🎉 Order delivered successfully',
      'cancelled': '❌ Order cancelled',
    };

    return statusMap[status] || 'Unknown status';
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    return !error;
  }
}