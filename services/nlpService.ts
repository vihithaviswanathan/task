import { SearchQuery, VoiceCommand } from '@/types';

export class NLPService {
  static parseSearchQuery(query: string): SearchQuery {
    const text = query.toLowerCase().trim();
    const result: SearchQuery = { text: query };

    // Extract price constraints
    const priceRegex = /under\s+(\d+)|below\s+(\d+)|less\s+than\s+(\d+)|max\s+(\d+)/i;
    const priceMatch = text.match(priceRegex);
    if (priceMatch) {
      const price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]);
      result.priceMax = price;
    }

    // Extract categories
    const categories = [
      'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 
      'spices', 'ready-to-eat', 'instant', 'traditional'
    ];
    
    for (const category of categories) {
      if (text.includes(category)) {
        result.category = category;
        break;
      }
    }

    // Extract specific food items
    const foodItems = [
      'dosa', 'idli', 'batter', 'chutney', 'sambar', 'rasam', 
      'rice', 'dal', 'curry', 'masala', 'powder'
    ];
    
    const keywords = foodItems.filter(item => text.includes(item));
    if (keywords.length > 0) {
      result.keywords = keywords;
    }

    return result;
  }

  static extractIntent(text: string): 'search' | 'add_to_cart' | 'order_status' | 'checkout' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('order') && (lowerText.includes('status') || lowerText.includes('track'))) {
      return 'order_status';
    }
    
    if (lowerText.includes('checkout') || lowerText.includes('place order') || lowerText.includes('buy now')) {
      return 'checkout';
    }
    
    if (lowerText.includes('add') || lowerText.includes('order') || lowerText.includes('buy')) {
      return 'add_to_cart';
    }
    
    return 'search';
  }

  static extractQuantityAndProduct(text: string): { quantity: number; product: string } {
    const quantityRegex = /(\d+)\s*(?:packs?\s+of|pieces?\s+of|bottles?\s+of)?\s*(.+)/i;
    const match = text.match(quantityRegex);
    
    if (match) {
      return {
        quantity: parseInt(match[1]),
        product: match[2].trim()
      };
    }
    
    return {
      quantity: 1,
      product: text
    };
  }
}