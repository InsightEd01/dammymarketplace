-- Create customer_profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Customers can view and edit their own profiles" ON customer_profiles;
CREATE POLICY "Customers can view and edit their own profiles"
  ON customer_profiles
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all customer profiles" ON customer_profiles;
CREATE POLICY "Staff can view all customer profiles"
  ON customer_profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service', 'cashier')
    )
  );

DROP POLICY IF EXISTS "Staff can update customer profiles" ON customer_profiles;
CREATE POLICY "Staff can update customer profiles"
  ON customer_profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service')
    )
  );

-- Add to realtime publication
alter publication supabase_realtime add table customer_profiles;
