-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_address TEXT,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
CREATE POLICY "Customers can view their own orders"
  ON orders
  FOR SELECT
  USING (customer_id IN (SELECT id FROM customer_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view all orders" ON orders;
CREATE POLICY "Staff can view all orders"
  ON orders
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service', 'cashier')
    )
  );

DROP POLICY IF EXISTS "Staff can update orders" ON orders;
CREATE POLICY "Staff can update orders"
  ON orders
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service', 'cashier')
    )
  );

DROP POLICY IF EXISTS "Cashiers can create orders" ON orders;
CREATE POLICY "Cashiers can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'cashier')
    )
  );

-- Create policies for order_items
DROP POLICY IF EXISTS "Customers can view their own order items" ON order_items;
CREATE POLICY "Customers can view their own order items"
  ON order_items
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customer_profiles WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Staff can view all order items" ON order_items;
CREATE POLICY "Staff can view all order items"
  ON order_items
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service', 'cashier')
    )
  );

DROP POLICY IF EXISTS "Staff can manage order items" ON order_items;
CREATE POLICY "Staff can manage order items"
  ON order_items
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'cashier')
    )
  );

-- Create policies for payment_records
DROP POLICY IF EXISTS "Customers can view their own payment records" ON payment_records;
CREATE POLICY "Customers can view their own payment records"
  ON payment_records
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id IN (
        SELECT id FROM customer_profiles WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Staff can view all payment records" ON payment_records;
CREATE POLICY "Staff can view all payment records"
  ON payment_records
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service', 'cashier')
    )
  );

DROP POLICY IF EXISTS "Staff can manage payment records" ON payment_records;
CREATE POLICY "Staff can manage payment records"
  ON payment_records
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'cashier')
    )
  );

-- Add to realtime publication
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
alter publication supabase_realtime add table payment_records;
