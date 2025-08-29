import * as Speech from 'expo-speech';
import { VoiceCommand, SearchQuery } from '@/types';

export class VoiceService {
  static speak(text: string) {
    Speech.speak(text, {
      language: 'en',
      pitch: 1,
      rate: 0.9,
    });
  }

  static parseVoiceCommand(transcript: string): VoiceCommand {
    const text = transcript.toLowerCase().trim();
    
    // Parse add to cart commands
    const addToCartRegex = /(?:order|add|buy)\s+(\d+)?\s*(?:packs?\s+of|pieces?\s+of)?\s*(.+)/i;
    const addMatch = text.match(addToCartRegex);
    
    if (addMatch) {
      const quantity = parseInt(addMatch[1]) || 1;
      const product = addMatch[2].trim();
      return {
        type: 'add_to_cart',
        product,
        quantity,
      };
    }

    // Parse search commands
    const searchRegex = /(?:show|find|search)\s+(?:me\s+)?(.+?)(?:\s+under\s+(\d+))?/i;
    const searchMatch = text.match(searchRegex);
    
    if (searchMatch) {
      const searchTerm = searchMatch[1].trim();
      const priceLimit = searchMatch[2] ? parseInt(searchMatch[2]) : undefined;
      
      return {
        type: 'search',
        category: this.extractCategory(searchTerm),
        priceLimit,
      };
    }

    // Parse order status commands
    const orderRegex = /(?:order|status)\s*#?(\w+)/i;
    const orderMatch = text.match(orderRegex);
    
    if (orderMatch) {
      return {
        type: 'order_status',
        orderId: orderMatch[1],
      };
    }

    // Default to search
    return {
      type: 'search',
      category: text,
    };
  }

  static extractCategory(text: string): string {
    const categoryMap: Record<string, string> = {
      'breakfast': 'breakfast',
      'lunch': 'lunch',
      'dinner': 'dinner',
      'snack': 'snacks',
      'snacks': 'snacks',
      'drink': 'beverages',
      'beverages': 'beverages',
      'spice': 'spices',
      'spices': 'spices',
      'ready': 'ready-to-eat',
      'instant': 'ready-to-eat',
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (text.includes(key)) {
        return value;
      }
    }

    return 'all';
  }

  static buildSearchQuery(command: VoiceCommand): SearchQuery {
    return {
      category: command.category,
      priceMax: command.priceLimit,
      keywords: command.product ? [command.product] : undefined,
    };
  }
}