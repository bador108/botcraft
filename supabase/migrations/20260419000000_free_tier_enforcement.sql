-- ============================================================
-- BotCraft: Free tier enforcement tables + RPC functions
-- ============================================================

-- Usage tracking (per user, per month)
CREATE TABLE IF NOT EXISTS usage (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  month_year   TEXT NOT NULL,  -- format: 'YYYY-MM'
  message_count        INT DEFAULT 0,
  premium_model_count  INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);
CREATE INDEX IF NOT EXISTS idx_usage_user_month ON usage(user_id, month_year);

-- Atomický increment usage (upsert)
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id    TEXT,
  p_month_year TEXT,
  p_is_premium BOOLEAN
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, month_year, message_count, premium_model_count)
  VALUES (
    p_user_id,
    p_month_year,
    1,
    CASE WHEN p_is_premium THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, month_year) DO UPDATE SET
    message_count       = usage.message_count + 1,
    premium_model_count = usage.premium_model_count + CASE WHEN p_is_premium THEN 1 ELSE 0 END,
    updated_at          = NOW();
END;
$$ LANGUAGE plpgsql;

-- ── Response cache (free tier) ────────────────────────────────
CREATE TABLE IF NOT EXISTS response_cache (
  cache_key   TEXT PRIMARY KEY,
  chatbot_id  UUID NOT NULL,
  response    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON response_cache(expires_at);

-- Cleanup expired cache entries (volat z Supabase cron)
CREATE OR REPLACE FUNCTION cleanup_expired_cache() RETURNS VOID AS $$
BEGIN
  DELETE FROM response_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ── Rate limiting ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON rate_limits(user_id, created_at DESC);

-- Cleanup starých rate limit řádků (>1 hodina)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits() RETURNS VOID AS $$
BEGIN
  DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- ── Limit notifications (max 1x za měsíc per user) ───────────
CREATE TABLE IF NOT EXISTS limit_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL,
  month_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- ── Documents content column (free tier stuffing) ─────────────
-- Přidej content sloupec pokud chybí (free tier čte celý dokument)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content TEXT;
