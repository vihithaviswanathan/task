import { supabase } from '@/lib/supabase';
import { Product, SearchQuery } from '@/types';

export class ProductService {
  static async searchProducts(query: SearchQuery): Promise<Product[]> {
    let supabaseQuery = supabase.from('products').select('*');

    if (query.category && query.category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', query.category);
    }

    if (query.priceMax) {
      supabaseQuery = supabaseQuery.lte('price', query.priceMax);
    }

    if (query.priceMin) {
      supabaseQuery = supabaseQuery.gte('price', query.priceMin);
    }

    if (query.keywords && query.keywords.length > 0) {
      const searchTerm = query.keywords.join(' ');
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    if (query.text) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query.text}%,description.ilike.%${query.text}%,category.ilike.%${query.text}%`
      );
    }

    const { data, error } = await supabaseQuery.limit(20);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data || [];
  }

  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(50);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  }

  static async findProductByName(name: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${name}%`)
      .limit(1)
      .single();

    if (error) {
      console.error('Error finding product by name:', error);
      return null;
    }

    return data;
  }
}