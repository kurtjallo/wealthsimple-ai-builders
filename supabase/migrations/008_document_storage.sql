-- Create storage bucket for case documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'case-documents',
  'case-documents',
  false,
  10485760,  -- 10MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- RLS policy: Allow authenticated users to upload (single-user demo, so permissive)
CREATE POLICY "Allow uploads to case-documents" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'case-documents');

CREATE POLICY "Allow reads from case-documents" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'case-documents');

CREATE POLICY "Allow deletes from case-documents" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'case-documents');

-- Add file_size and mime_type columns to documents table if not exists
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS mime_type TEXT;
