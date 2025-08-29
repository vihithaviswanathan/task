/*
  # Create Products Table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `price` (numeric, product price)
      - `category` (text, product category)
      - `description` (text, product description)
      - `image_url` (text, product image URL)
      - `stock` (integer, available stock)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access to products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert products (for admin functionality)
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample products
INSERT INTO products (name, price, category, description, image_url, stock) VALUES
('Idli Batter', 120, 'breakfast', 'Fresh idli batter made with premium urad dal and rice. Makes 20-25 soft idlis.', 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=500', 50),
('Dosa Batter', 150, 'breakfast', 'Traditional dosa batter with perfect fermentation. Makes 15-20 crispy dosas.', 'https://images.pexels.com/photos/5792329/pexels-photo-5792329.jpeg?auto=compress&cs=tinysrgb&w=500', 30),
('Sambar Powder', 180, 'spices', 'Authentic sambar powder with traditional spices. Perfect for making restaurant-style sambar.', 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg?auto=compress&cs=tinysrgb&w=500', 100),
('Coconut Chutney', 80, 'ready-to-eat', 'Fresh coconut chutney with curry leaves and green chilies. Ready to serve.', 'https://images.pexels.com/photos/6419712/pexels-photo-6419712.jpeg?auto=compress&cs=tinysrgb&w=500', 25),
('Rasam Powder', 200, 'spices', 'Traditional rasam powder with tamarind and aromatic spices. Makes authentic South Indian rasam.', 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg?auto=compress&cs=tinysrgb&w=500', 75),
('Ready Rice', 160, 'ready-to-eat', 'Pre-cooked basmati rice, ready to heat and serve. Perfect for quick meals.', 'https://images.pexels.com/photos/793759/pexels-photo-793759.jpeg?auto=compress&cs=tinysrgb&w=500', 40),
('Upma Mix', 90, 'breakfast', 'Instant upma mix with vegetables and spices. Just add hot water.', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500', 60),
('Pickle Combo', 250, 'ready-to-eat', 'Assorted South Indian pickles - mango, lime, and mixed vegetables.', 'https://images.pexels.com/photos/4202336/pexels-photo-4202336.jpeg?auto=compress&cs=tinysrgb&w=500', 35),
('Filter Coffee', 300, 'beverages', 'Premium South Indian filter coffee powder. Rich aroma and authentic taste.', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=500', 80),
('Masala Tea', 180, 'beverages', 'Traditional Indian masala chai blend with cardamom, cinnamon, and ginger.', 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=500', 90)
ON CONFLICT DO NOTHING;