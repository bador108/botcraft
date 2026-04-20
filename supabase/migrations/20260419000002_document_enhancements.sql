-- ============================================================
-- BotCraft: Document enhancements — file metadata + status
-- ============================================================

-- Přidej sloupce pro metadata souboru a status zpracování
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS file_type TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ready';

-- Existující záznamy jsou ready (byly zpracovány starým endpointem)
UPDATE documents SET status = 'ready' WHERE status IS NULL OR status = '';

-- Index pro filtrování podle statusu
CREATE INDEX IF NOT EXISTS idx_documents_user_status ON documents(user_id, status);
