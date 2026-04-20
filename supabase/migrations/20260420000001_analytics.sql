-- ============================================================
-- BotCraft: Analytics — rozšíření messages tabulky + view
-- ============================================================

-- Rozšíř messages tabulku o analytics sloupce
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS user_id TEXT,
  ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  ADD COLUMN IF NOT EXISTS model_tier TEXT,
  ADD COLUMN IF NOT EXISTS response_time_ms INT,
  ADD COLUMN IF NOT EXISTS token_count INT,
  ADD COLUMN IF NOT EXISTS rating SMALLINT,
  ADD COLUMN IF NOT EXISTS matched_chunks JSONB,
  ADD COLUMN IF NOT EXISTS is_unanswered BOOLEAN DEFAULT FALSE;

-- Indexy pro výkon
CREATE INDEX IF NOT EXISTS idx_messages_chatbot_created ON messages(chatbot_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);

-- Materialized view pro denní agregaci
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily AS
SELECT
  user_id,
  chatbot_id,
  DATE(created_at) AS date,
  COUNT(*) FILTER (WHERE role = 'user')      AS user_messages,
  COUNT(*) FILTER (WHERE role = 'assistant') AS assistant_messages,
  COUNT(DISTINCT session_id)                 AS unique_sessions,
  AVG(response_time_ms) FILTER (WHERE role = 'assistant') AS avg_response_ms,
  COUNT(*) FILTER (WHERE rating = 1)         AS positive_ratings,
  COUNT(*) FILTER (WHERE rating = -1)        AS negative_ratings,
  COUNT(*) FILTER (WHERE is_unanswered)      AS unanswered_count,
  COUNT(*) FILTER (WHERE model_tier = 'fast')     AS fast_count,
  COUNT(*) FILTER (WHERE model_tier = 'balanced') AS balanced_count,
  COUNT(*) FILTER (WHERE model_tier = 'premium')  AS premium_count
FROM messages
WHERE user_id IS NOT NULL
GROUP BY user_id, chatbot_id, DATE(created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_daily_unique
  ON analytics_daily(user_id, chatbot_id, date);

-- Refresh funkce
CREATE OR REPLACE FUNCTION refresh_analytics_daily() RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily;
END;
$$ LANGUAGE plpgsql;

-- limit_notifications tabulka (pokud neexistuje)
CREATE TABLE IF NOT EXISTS limit_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL,
  month_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);
