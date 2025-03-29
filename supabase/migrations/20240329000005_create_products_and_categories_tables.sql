-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, category_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  old_price DECIMAL(10, 2) CHECK (old_price >= 0),
  image_url TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  SELECT stock_quantity INTO current_stock FROM products WHERE id = p_id;
  
  IF current_stock >= amount THEN
    RETURN current_stock - amount;
  ELSE
    RETURN 0; -- Prevent negative stock
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable row-level security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Create policies for subcategories
DROP POLICY IF EXISTS "Subcategories are viewable by everyone" ON subcategories;
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage subcategories" ON subcategories;
CREATE POLICY "Admins can manage subcategories"
  ON subcategories
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Create policies for products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
  ON products
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Cashiers can update product stock" ON products;
CREATE POLICY "Cashiers can update product stock"
  ON products
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'cashier'
    )
  )
  WITH CHECK (stock_quantity IS NOT NULL);

-- Add to realtime publication
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table subcategories;
alter publication supabase_realtime add table products;
