import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/productService';
import { CartService } from '@/services/cartService';
import { VoiceService } from '@/services/voiceService';
import { NLPService } from '@/services/nlpService';
import { Product, SearchQuery } from '@/types';
import SearchHeader from '@/components/SearchHeader';
import ProductCard from '@/components/ProductCard';
import AuthScreen from '@/components/AuthScreen';

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const searchQuery = NLPService.parseSearchQuery(query);
      const searchResults = await ProductService.searchProducts(searchQuery);
      setProducts(searchResults);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleVoiceCommand = async (transcript: string) => {
    try {
      const command = VoiceService.parseVoiceCommand(transcript);
      
      if (command.type === 'search') {
        const searchQuery = VoiceService.buildSearchQuery(command);
        const results = await ProductService.searchProducts(searchQuery);
        setProducts(results);
        VoiceService.speak(`Found ${results.length} products`);
      } else if (command.type === 'add_to_cart' && command.product) {
        const product = await ProductService.findProductByName(command.product);
        if (product) {
          await handleAddToCart(product, command.quantity || 1);
          VoiceService.speak(`Added ${command.quantity || 1} ${product.name} to cart`);
        } else {
          VoiceService.speak(`Product ${command.product} not found`);
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    }
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    if (!user) return;
    
    try {
      const success = await CartService.addToCart(user.id, product.id, quantity);
      if (success) {
        Alert.alert('Success', `${product.name} added to cart!`);
      } else {
        Alert.alert('Error', 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <SearchHeader onSearch={handleSearch} onVoiceCommand={handleVoiceCommand} />
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={(product) => handleAddToCart(product)}
          />
        )}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No products found' : 'Loading products...'}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productList: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});