-- ============================================================
-- BotCraft: API Keys + Webhooks + Account Deletions
-- ============================================================

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        TEXT NOT NULL,
  name           TEXT NOT NULL,
  key_prefix     TEXT NOT NULL,
  key_hash       TEXT NOT NULL UNIQUE,
  scopes         TEXT[] DEFAULT ARRAY['read']::TEXT[],
  last_used_at   TIMESTAMPTZ,
  expires_at     TIMESTAMPTZ,
  revoked_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              TEXT NOT NULL,
  name                 TEXT NOT NULL,
  url                  TEXT NOT NULL,
  events               TEXT[] NOT NULL,
  secret               TEXT NOT NULL,
  enabled              BOOLEAN DEFAULT TRUE,
  last_triggered_at    TIMESTAMPTZ,
  last_status_code     INT,
  consecutive_failures INT DEFAULT 0,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_user ON webhooks(user_id);

-- Webhook Deliveries
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id    UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,
  payload       JSONB NOT NULL,
  status_code   INT,
  response_body TEXT,
  duration_ms   INT,
  succeeded     BOOLEAN,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_webhook_created
  ON webhook_deliveries(webhook_id, created_at DESC);

-- Account Deletions (grace period)
CREATE TABLE IF NOT EXISTS account_deletions (
  user_id      TEXT PRIMARY KEY,
  delete_after TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
