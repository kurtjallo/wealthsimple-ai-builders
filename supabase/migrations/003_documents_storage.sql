-- Extend documents table for OCR processing pipeline
-- The documents table was created in 00001_initial_schema.sql with basic columns.
-- This migration adds columns needed for the document processing pipeline:
-- storage path, raw OCR text, confidence scoring, processing lifecycle, and warnings.

-- Add file_path for Supabase Storage bucket path (separate from file_url)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Rename ocr_output -> ocr_raw_text for clarity (raw markdown from Mistral OCR)
-- Note: We add the new column and keep the old one for backward compatibility.
-- The data access layer will use ocr_raw_text going forward.
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_raw_text TEXT;

-- Rename confidence -> overall_confidence for clarity
ALTER TABLE documents ADD COLUMN IF NOT EXISTS overall_confidence REAL;

-- Processing lifecycle columns
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed'));
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_error TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER;

-- Warnings array for non-fatal issues during processing
ALTER TABLE documents ADD COLUMN IF NOT EXISTS warnings TEXT[];

-- Updated_at timestamp (cases has it, documents didn't)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Make file_url nullable (it gets populated after upload/signed URL generation)
ALTER TABLE documents ALTER COLUMN file_url DROP NOT NULL;

-- Additional indexes for processing queries
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON documents(processing_status);

-- Auto-update updated_at trigger for documents
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS documents_updated_at ON documents;
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();

-- Note: Create a 'documents' storage bucket via the Supabase dashboard or CLI:
--   supabase storage create documents --public=false
-- Storage policies should allow authenticated uploads and signed URL generation.
