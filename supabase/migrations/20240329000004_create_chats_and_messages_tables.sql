-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  rep_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('open', 'assigned', 'closed')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'rep', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chats
DROP POLICY IF EXISTS "Customers can view their own chats" ON chats;
CREATE POLICY "Customers can view their own chats"
  ON chats
  FOR SELECT
  USING (customer_id IN (SELECT id FROM customer_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view all chats" ON chats;
CREATE POLICY "Staff can view all chats"
  ON chats
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service')
    )
  );

DROP POLICY IF EXISTS "Staff can update chats" ON chats;
CREATE POLICY "Staff can update chats"
  ON chats
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service')
    )
  );

-- Create policies for chat_messages
DROP POLICY IF EXISTS "Customers can view messages from their chats" ON chat_messages;
CREATE POLICY "Customers can view messages from their chats"
  ON chat_messages
  FOR SELECT
  USING (
    chat_id IN (
      SELECT id FROM chats WHERE customer_id IN (
        SELECT id FROM customer_profiles WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Customers can send messages to their chats" ON chat_messages;
CREATE POLICY "Customers can send messages to their chats"
  ON chat_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'customer' AND
    sender_id = auth.uid() AND
    chat_id IN (
      SELECT id FROM chats WHERE customer_id IN (
        SELECT id FROM customer_profiles WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Staff can view all chat messages" ON chat_messages;
CREATE POLICY "Staff can view all chat messages"
  ON chat_messages
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service')
    )
  );

DROP POLICY IF EXISTS "Staff can send messages" ON chat_messages;
CREATE POLICY "Staff can send messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (
    sender_type = 'rep' AND
    sender_id = auth.uid() AND
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'customer_service')
    )
  );

-- Add to realtime publication
alter publication supabase_realtime add table chats;
alter publication supabase_realtime add table chat_messages;
