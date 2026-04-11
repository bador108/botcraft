-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  message_count_month INT DEFAULT 0,
  message_count_reset_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbots
CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🤖',
  system_prompt TEXT DEFAULT 'You are a helpful assistant.',
  model TEXT DEFAULT 'llama-3.1-8b-instant',
  theme_color TEXT DEFAULT '#6366f1',
  welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
  allowed_domains TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  message_count_month INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  chunk_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chunks (pgvector)
CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Similarity search function
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1536),
  match_chatbot_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE(content TEXT, similarity FLOAT)
LANGUAGE SQL STABLE
AS $$
  SELECT
    content,
    1 - (embedding <=> query_embedding) AS similarity
  FROM chunks
  WHERE chatbot_id = match_chatbot_id
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies (service role bypasses all)
CREATE POLICY "Users own data" ON users FOR ALL USING (auth.uid()::text = id);
CREATE POLICY "Users own chatbots" ON chatbots FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users own documents" ON documents FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users own chunks" ON chunks FOR ALL USING (
  chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()::text)
);
CREATE POLICY "Users own messages" ON messages FOR ALL USING (
  chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid()::text)
);
