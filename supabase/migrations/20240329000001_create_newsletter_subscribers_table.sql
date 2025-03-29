-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable row level security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow insert for everyone" 
  ON newsletter_subscribers FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" 
  ON newsletter_subscribers FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" 
  ON newsletter_subscribers FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE newsletter_subscribers;
