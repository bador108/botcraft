-- Vytvoří veřejný bucket pro avatary chatbotů
-- Spusť v Supabase SQL Editoru nebo přes Supabase CLI

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bot-avatars',
  'bot-avatars',
  true,
  524288,  -- 512 KB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: pouze vlastník může nahrávat, číst smí všichni (public bucket)
CREATE POLICY "Authenticated users upload own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bot-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read bot avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bot-avatars');

CREATE POLICY "Users delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bot-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
