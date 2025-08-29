import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.category}>
          {product.category}
        </Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>
            ₹{product.price.toFixed(0)}
          </Text>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(product)}
          >
            <Plus color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});