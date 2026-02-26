import { createServerSupabaseClient } from './server';

const BUCKET_NAME = 'case-documents';

/**
 * Upload a document file to Supabase Storage.
 * Files are stored under: {case_id}/{document_id}/{filename}
 */
export async function uploadDocument(
  caseId: string,
  documentId: string,
  file: File,
): Promise<{ path: string; url: string }> {
  const supabase = createServerSupabaseClient();

  // Sanitize filename: replace spaces, keep extension
  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${caseId}/${documentId}/${sanitized}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return {
    path: data.path,
    url: storagePath,
  };
}

/**
 * Get a signed URL for a stored document (valid for 1 hour).
 */
export async function getDocumentSignedUrl(storagePath: string): Promise<string> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 3600); // 1 hour expiry

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a document from Supabase Storage.
 */
export async function deleteDocument(storagePath: string): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }
}

/**
 * Download a document from storage as a Buffer.
 * Useful for passing to OCR APIs that need base64 input.
 */
export async function downloadDocument(storagePath: string): Promise<Buffer> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(storagePath);

  if (error) {
    throw new Error(`Failed to download document: ${error.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
