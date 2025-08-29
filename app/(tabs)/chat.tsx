import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Mic } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { OrderService } from '@/services/orderService';
import { VoiceService } from '@/services/voiceService';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { ChatMessage } from '@/types';
import ChatMessageComponent from '@/components/ChatMessage';
import VoiceButton from '@/components/VoiceButton';
import AuthScreen from '@/components/AuthScreen';

export default function ChatScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { isListening, transcript, startListening, clearTranscript } = useVoiceRecognition();

  useEffect(() => {
    if (user) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: "👋 Hi! I'm your AI shopping assistant. You can ask me about orders, search for products, or place orders using voice commands. Try saying 'Show me breakfast items under 200' or 'What's the status of order #ABC123?'",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInputText(transcript);
      clearTranscript();
    }
  }, [transcript, isListening]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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
    const response = await processMessage(inputText);
    
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setInputText('');
    
    // Speak the response
    VoiceService.speak(response);
  };

  const processMessage = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Check for order status queries
    const orderIdMatch = message.match(/#?([a-zA-Z0-9]{6,})/);
    if (orderIdMatch || lowerMessage.includes('order') && lowerMessage.includes('status')) {
      if (orderIdMatch) {
        const orderId = orderIdMatch[1];
        try {
          const order = await OrderService.getOrderById(orderId);
          if (order) {
            const statusMessage = OrderService.getStatusMessage(order.status);
            return `${statusMessage}\nTotal: ₹${order.total_amount.toFixed(0)}\nPlaced: ${new Date(order.created_at).toLocaleDateString()}`;
          } else {
            return `I couldn't find an order with ID #${orderId}. Please check the order ID and try again.`;
          }
        } catch (error) {
          return `There was an error looking up that order. Please try again.`;
        }
      }
      return `Please provide an order ID to check the status, like "What's the status of order #ABC123?"`;
    }
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm here to help you with your shopping. You can ask me to search for products, check order status, or place orders using voice commands.`;
    }
    
    // Check for help requests
    if (lowerMessage.includes('help')) {
      return `I can help you with:
      
🛍️ Search products: "Show me breakfast items under 200"
📦 Track orders: "What's the status of order #ABC123?"
🛒 Add to cart: "Order 2 packs of dosa batter"
💬 General questions about shopping

What would you like to do?`;
    }
    
    // Parse as voice command
    const command = VoiceService.parseVoiceCommand(message);
    
    if (command.type === 'search') {
      return `I'd be happy to help you search for products! Please go to the Home tab to see search results, or try a more specific search like "Show me breakfast items under 200".`;
    }
    
    if (command.type === 'add_to_cart') {
      return `To add items to your cart, please use the Home tab to browse products, or try saying something like "Order 2 packs of dosa batter".`;
    }
    
    return `I understand you're looking for help with shopping. You can ask me about orders, search for products, or get general assistance. What would you like to do?`;
  };

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>Your voice-powered shopping helper</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessageComponent message={item} />}
        style={styles.chatList}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything about your orders..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <VoiceButton
            isListening={isListening}
            onPress={startListening}
            size={36}
          />
          
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Send color="#8B5CF6" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
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
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});