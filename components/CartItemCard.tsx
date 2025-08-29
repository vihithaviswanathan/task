import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Minus, Trash2 } from 'lucide-react-native';
import { CartItem } from '@/types';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product } = item;
  
  if (!product) return null;

  const subtotal = product.price * item.quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.price}>
          ₹{product.price.toFixed(0)} each
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus color="#8B5CF6" size={16} />
            </TouchableOpacity>
            
            <Text style={styles.quantity}>
              {item.quantity}
            </Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus color="#8B5CF6" size={16} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtotal}>
            ₹{subtotal.toFixed(0)}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Trash2 color="#EF4444" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 12,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  removeButton: {
    padding: 8,
  },
});