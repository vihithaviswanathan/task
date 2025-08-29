import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Order } from '@/types';
import { OrderService } from '@/services/orderService';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const statusMessage = OrderService.getStatusMessage(order.status);
  const orderDate = new Date(order.created_at).toLocaleDateString();
  
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(order)}>
      <View style={styles.header}>
        <Text style={styles.orderId}>
          Order #{order.id.slice(-8).toUpperCase()}
        </Text>
        <Text style={styles.date}>
          {orderDate}
        </Text>
      </View>
      
      <Text style={styles.status}>
        {statusMessage}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.total}>
          ₹{order.total_amount.toFixed(0)}
        </Text>
        <ChevronRight color="#6B7280" size={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  status: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
});