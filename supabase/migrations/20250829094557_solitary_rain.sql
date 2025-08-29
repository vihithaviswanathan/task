/*
  # Create Orders and Order Items Tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_amount` (numeric, order total)
      - `status` (text, order status)
      - `created_at` (timestamptz, creation timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer, item quantity)
      - `price` (numeric, item price at time of order)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to access their own orders

  3. Indexes
    - Index on user_id for fast order lookups
    - Index on order_id for order items
*/

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed', 
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);