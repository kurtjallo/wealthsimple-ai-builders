import { createServerSupabaseClient } from "./server";
import type { Database, Json } from "./types";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

export type { DocumentRow };

/**
 * Create a new document record (initially pending processing).
 */
export async function createDocument(params: {
  case_id: string;
  type: string;
  file_name: string;
  file_path?: string;
  file_url?: string;
}): Promise<DocumentRow> {
  const supabase = createServerSupabaseClient();

  const insert: DocumentInsert = {
    case_id: params.case_id,
    type: params.type,
    file_name: params.file_name,
    file_path: params.file_path ?? null,
    file_url: params.file_url ?? null,
    processing_status: "pending",
  };

  const { data, error } = await supabase
    .from("documents")
    .insert(insert)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create document: ${error.message}`);
  }

  return data as unknown as DocumentRow;
}

/**
 * Get a document by ID.
 */
export async function getDocument(
  documentId: string
): Promise<DocumentRow | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(`Failed to get document: ${error.message}`);
  }

  return data as unknown as DocumentRow;
}

/**
 * Get all documents for a case.
 */
export async function getDocumentsByCase(
  caseId: string
): Promise<DocumentRow[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to get documents: ${error.message}`);
  }

  return (data ?? []) as unknown as DocumentRow[];
}

/**
 * Update a document with OCR results and extracted data.
 */
export async function updateDocumentResults(
  documentId: string,
  results: {
    ocr_raw_text: string;
    extracted_data: Record<string, unknown>;
    overall_confidence: number;
    processing_status: "completed" | "failed";
    processing_error?: string;
    processing_time_ms: number;
    warnings?: string[];
  }
): Promise<DocumentRow> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("documents")
    .update({
      ocr_raw_text: results.ocr_raw_text,
      extracted_data: results.extracted_data as unknown as Json,
      overall_confidence: results.overall_confidence,
      processing_status: results.processing_status,
      processing_error: results.processing_error ?? null,
      processing_time_ms: results.processing_time_ms,
      warnings: results.warnings ?? [],
    })
    .eq("id", documentId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update document: ${error.message}`);
  }

  return data as unknown as DocumentRow;
}

/**
 * Update document processing status (used to mark as 'processing' before OCR).
 */
export async function updateDocumentStatus(
  documentId: string,
  status: "pending" | "processing" | "completed" | "failed"
): Promise<void> {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("documents")
    .update({ processing_status: status })
    .eq("id", documentId);

  if (error) {
    throw new Error(`Failed to update document status: ${error.message}`);
  }
}
