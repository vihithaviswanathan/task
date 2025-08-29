import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { CartService } from '@/services/cartService';
import { OrderService } from '@/services/orderService';
import { CartItem } from '@/types';
import CartItemCard from '@/components/CartItemCard';
import AuthScreen from '@/components/AuthScreen';

export default function CartScreen() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCartItems();
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      const items = await CartService.getCartItems(user.id);
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      const success = await CartService.updateQuantity(itemId, quantity);
      if (success) {
        loadCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const success = await CartService.removeFromCart(itemId);
      if (success) {
        loadCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;
    
    setLoading(true);
    
    try {
      const order = await OrderService.createOrder(user.id, cartItems);
      if (order) {
        await CartService.clearCart(user.id);
        setCartItems([]);
        Alert.alert(
          'Order Placed!',
          `Your order #${order.id.slice(-8).toUpperCase()} has been placed successfully.`
        );
      } else {
        Alert.alert('Error', 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order');
    }
    
    setLoading(false);
  };

  if (!user) {
    return <AuthScreen />;
  }

  const total = CartService.calculateTotal(cartItems);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag color="#D1D5DB" size={80} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious items to get started
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItemCard
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            )}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.checkoutContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{total.toFixed(0)}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, loading && styles.buttonDisabled]}
              onPress={handleCheckout}
              disabled={loading}
            >
              <LinearGradient
                colors={['#8B5CF6', '#3B82F6']}
                style={styles.gradientButton}
              >
                <Text style={styles.checkoutButtonText}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  cartList: {
    padding: 16,
    paddingBottom: 120,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  checkoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});