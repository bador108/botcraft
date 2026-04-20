-- ============================================================
-- BotCraft: Cohere Embeddings — změna dimenzí 768 → 1024
-- POZOR: Tato migrace smaže všechna stávající embeddings!
-- Spusť pouze pokud nemáš produkční data, nebo spusť reprocessing
-- všech dokumentů ihned po migraci.
-- ============================================================

-- Smaž stávající vektor index (blokuje ALTER COLUMN)
DROP INDEX IF EXISTS chunks_embedding_idx;

-- Změň dimenzi vektoru
ALTER TABLE chunks
  ALTER COLUMN embedding TYPE vector(1024)
  USING NULL; -- reset embeddings, musí se přepočítat

-- Znovu vytvoř ivfflat index s novou dimenzí
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
  ON chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Přepočti match_chunks RPC s novou dimenzí
CREATE OR REPLACE FUNCTION match_chunks(
  query_embedding vector(1024),
  match_chatbot_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE(
  id UUID,
  content TEXT,
  similarity FLOAT,
  document_id UUID
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    content,
    1 - (embedding <=> query_embedding) AS similarity,
    document_id
  FROM chunks
  WHERE chatbot_id = match_chatbot_id
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
