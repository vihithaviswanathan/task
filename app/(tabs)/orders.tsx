import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, ShoppingBag } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { OrderService } from '@/services/orderService';
import { VoiceService } from '@/services/voiceService';
import { Order, ChatMessage } from '@/types';
import OrderCard from '@/components/OrderCard';
import ChatMessageComponent from '@/components/ChatMessage';
import AuthScreen from '@/components/AuthScreen';

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    if (showChat && !messages.length) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: "👋 Hi! I'm your order tracking assistant. You can ask me about any order by saying something like 'What's the status of order #ABC123?' or simply provide an order ID.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [showChat]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const userOrders = await OrderService.getOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setShowChat(true);
    
    const statusMessage = OrderService.getStatusMessage(order.status);
    const orderInfo: ChatMessage = {
      id: Date.now().toString(),
      text: `Order #${order.id.slice(-8).toUpperCase()}\n${statusMessage}\nTotal: ₹${order.total_amount.toFixed(0)}\nPlaced: ${new Date(order.created_at).toLocaleDateString()}`,
      isUser: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, orderInfo]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Process the message
    const response = await processOrderQuery(inputText);
    
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setInputText('');
  };

  const processOrderQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();
    
    // Extract order ID from query
    const orderIdMatch = query.match(/#?([a-zA-Z0-9]{6,})/);
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      try {
        const order = await OrderService.getOrderById(orderId);
        if (order) {
          const statusMessage = OrderService.getStatusMessage(order.status);
          return `${statusMessage}\nOrder Total: ₹${order.total_amount.toFixed(0)}`;
        } else {
          return `Sorry, I couldn't find an order with ID #${orderId}. Please check the order ID and try again.`;
        }
      } catch (error) {
        return `There was an error looking up that order. Please try again.`;
      }
    }
    
    if (lowerQuery.includes('latest') || lowerQuery.includes('recent')) {
      if (orders.length > 0) {
        const latestOrder = orders[0];
        const statusMessage = OrderService.getStatusMessage(latestOrder.status);
        return `Your latest order #${latestOrder.id.slice(-8).toUpperCase()}:\n${statusMessage}`;
      } else {
        return `You don't have any orders yet. Place your first order from the home screen!`;
      }
    }
    
    return `I can help you track your orders! Please provide an order ID (like #ABC123) or ask about your latest order.`;
  };

  if (!user) {
    return <AuthScreen />;
  }

  if (showChat) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setShowChat(false)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle}>Order Tracking</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessageComponent message={item} />}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.chatInput}>
          <TextInput
            style={styles.input}
            placeholder="Ask about your order..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Send color="#8B5CF6" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => setShowChat(true)}
        >
          <Text style={styles.chatButtonText}>💬 Track Orders</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ShoppingBag color="#D1D5DB" size={80} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your order history will appear here
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  chatButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  chatHeader: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
    marginRight: 16,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatList: {
    flex: 1,
    paddingVertical: 16,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
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
});