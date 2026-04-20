-- ============================================================
-- BotCraft: Billing tables — subscriptions, billing_info, invoices
-- ============================================================

-- Subscription tracking (zrcadlí Stripe subscription, primární zdroj plánu)
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               TEXT NOT NULL UNIQUE,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan                  TEXT NOT NULL DEFAULT 'hobby',
  status                TEXT NOT NULL DEFAULT 'active',
  billing_cycle         TEXT DEFAULT 'monthly',
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  trial_end             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- Fakturační údaje uživatele (propíšou se do Stripe invoice)
CREATE TABLE IF NOT EXISTS billing_info (
  user_id       TEXT PRIMARY KEY,
  company_name  TEXT,
  ico           TEXT,
  dic           TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city          TEXT,
  postal_code   TEXT,
  country       TEXT DEFAULT 'CZ',
  invoice_email TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Historie faktur (synchronizováno ze Stripe invoice events)
CREATE TABLE IF NOT EXISTS invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT NOT NULL,
  stripe_invoice_id   TEXT UNIQUE,
  amount_cents        INT NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'CZK',
  status              TEXT NOT NULL,
  invoice_pdf         TEXT,
  hosted_invoice_url  TEXT,
  period_start        TIMESTAMPTZ,
  period_end          TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at DESC);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users see own billing"
  ON billing_info FOR SELECT
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users update own billing"
  ON billing_info FOR UPDATE
  USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users insert own billing"
  ON billing_info FOR INSERT
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users see own invoices"
  ON invoices FOR SELECT
  USING (user_id = auth.jwt() ->> 'sub');
