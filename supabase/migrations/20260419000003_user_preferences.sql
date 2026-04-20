-- ============================================================
-- BotCraft: User preferences + audit log
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id               TEXT PRIMARY KEY,
  timezone              TEXT DEFAULT 'Europe/Prague',
  language              TEXT DEFAULT 'cs',
  email_notifications   JSONB DEFAULT '{
    "limit_80": true,
    "limit_100": true,
    "weekly_summary": true,
    "failed_payment": true,
    "product_updates": false
  }'::jsonb,
  data_retention_days   INT DEFAULT 365,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences"
  ON user_preferences FOR ALL
  USING (user_id = auth.jwt() ->> 'sub');

-- Audit log pro bezpečnostní události
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id, created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own audit log"
  ON audit_log FOR SELECT
  USING (user_id = auth.jwt() ->> 'sub');
