export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  stock: number;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  product?: Product;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface SearchQuery {
  text?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  keywords?: string[];
}

export interface VoiceCommand {
  type: 'search' | 'add_to_cart' | 'order_status' | 'checkout';
  product?: string;
  quantity?: number;
  category?: string;
  priceLimit?: number;
  orderId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}