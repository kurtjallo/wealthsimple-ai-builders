import { createServerSupabaseClient } from "./server";

const BUCKET_NAME = "documents";

/**
 * Upload a document file to Supabase Storage.
 * Returns the storage path (not a URL).
 */
export async function uploadDocument(
  caseId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<{ path: string }> {
  const supabase = createServerSupabaseClient();
  const storagePath = `${caseId}/${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  return { path: data.path };
}

/**
 * Get a signed URL for a document in storage.
 * URL expires after the specified duration (default 1 hour).
 */
export async function getDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }

  return data.signedUrl;
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
