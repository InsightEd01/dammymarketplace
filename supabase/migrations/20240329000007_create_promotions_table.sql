-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Enable row-level security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Promotions are viewable by everyone" ON promotions;
CREATE POLICY "Promotions are viewable by everyone"
  ON promotions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
CREATE POLICY "Admins can manage promotions"
  ON promotions
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin'
    )
  );

-- Add to realtime publication
alter publication supabase_realtime add table promotions;
