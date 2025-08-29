import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types';

export class CartService {
  static async getCartItems(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    return data || [];
  }

  static async addToCart(userId: string, productId: string, quantity: number = 1): Promise<boolean> {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      return !error;
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
        });

      return !error;
    }
  }

  static async updateQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    return !error;
  }

  static async removeFromCart(cartItemId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    return !error;
  }

  static async clearCart(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    return !error;
  }

  static calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }
}