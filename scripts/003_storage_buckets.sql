-- Configuracao de Storage Buckets para Igreja ERP
-- Execute este script no SQL Editor do Supabase

-- Criar bucket para uploads gerais
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para o bucket uploads
-- Permitir leitura publica
CREATE POLICY "uploads_public_read" ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');

-- Permitir upload para usuarios autenticados
CREATE POLICY "uploads_authenticated_insert" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Permitir update para usuarios autenticados
CREATE POLICY "uploads_authenticated_update" ON storage.objects
FOR UPDATE
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- Permitir delete para usuarios autenticados
CREATE POLICY "uploads_authenticated_delete" ON storage.objects
FOR DELETE
USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');
