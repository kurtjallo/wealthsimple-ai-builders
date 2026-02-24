import type { Agent, AgentInput, AgentResult } from './types';
import { ocrExtractText } from '@/lib/ocr/mistral-client';
import { extractStructuredData } from '@/lib/ocr/structured-extractor';
import type { OcrDocumentInput } from '@/lib/ocr/types';
import type { ExtractedDocumentData } from '@/types/documents';
import type { DocumentType } from '@/types/index';
import {
  updateDocumentStatus,
  updateDocumentResults,
  getDocumentsByCase,
} from '@/lib/supabase/documents';
import { getDocumentSignedUrl } from '@/lib/supabase/storage';

/**
 * Input for the Document Processor agent.
 */
export interface DocumentProcessorInput extends AgentInput {
  case_id: string;
  document_id: string;
  document_type: DocumentType;
  // Provide ONE of the following:
  file_path?: string; // Supabase Storage path (will generate signed URL)
  file_url?: string; // Direct URL to document
  file_base64?: string; // Base64-encoded document
  mime_type?: string; // Required for base64 input
}

/**
 * Output from the Document Processor agent.
 */
export interface DocumentProcessorOutput {
  document_id: string;
  document_type: DocumentType;
  extracted: ExtractedDocumentData;
  overall_confidence: number;
  ocr_text_length: number;
  page_count: number;
}

/**
 * Resolve the document source into an OcrDocumentInput for Mistral.
 */
async function resolveDocumentInput(
  input: DocumentProcessorInput
): Promise<OcrDocumentInput> {
  if (input.file_url) {
    return { type: 'url', content: input.file_url };
  }

  if (input.file_path) {
    const signedUrl = await getDocumentSignedUrl(input.file_path);
    return { type: 'url', content: signedUrl };
  }

  if (input.file_base64) {
    return {
      type: 'base64',
      content: input.file_base64,
      mime_type: input.mime_type || 'image/jpeg',
    };
  }

  throw new Error(
    'No document source provided — need file_url, file_path, or file_base64'
  );
}

/**
 * Document Processor Agent.
 *
 * Pipeline: Document -> Mistral OCR -> Gemini Extraction -> Confidence Scoring -> Database
 *
 * This agent handles the complete document processing lifecycle:
 * 1. Resolves document source (Storage path -> signed URL, or direct URL/base64)
 * 2. Sends to Mistral OCR for text extraction
 * 3. Sends OCR text to Gemini for structured data extraction with confidence
 * 4. Persists results to Supabase
 * 5. Returns structured output for the orchestration pipeline
 */
export const documentProcessorAgent: Agent<
  DocumentProcessorInput,
  DocumentProcessorOutput
> = {
  type: 'document_processor',
  name: 'Document Processor',
  description:
    'Extracts structured data from documents using Mistral OCR and Gemini, with per-field confidence scoring.',

  async run(
    input: DocumentProcessorInput
  ): Promise<AgentResult<DocumentProcessorOutput>> {
    const startTime = Date.now();
    const metadata: Record<string, unknown> = {};

    try {
      // Mark document as processing
      await updateDocumentStatus(input.document_id, 'processing');

      // Step 1: Resolve document input for OCR
      const ocrInput = await resolveDocumentInput(input);

      // Step 2: Run Mistral OCR
      const ocrResult = await ocrExtractText(ocrInput);

      if (!ocrResult.raw_text || ocrResult.raw_text.trim().length === 0) {
        throw new Error(
          'OCR returned empty text — document may be blank or unreadable'
        );
      }

      const warnings: string[] = [];
      if (ocrResult.raw_text.length < 20) {
        warnings.push(
          'Very short OCR output — document may be partially readable'
        );
      }

      // Step 3: Claude structured extraction with confidence scoring
      const extraction = await extractStructuredData(
        ocrResult.raw_text,
        input.document_type
      );

      warnings.push(...extraction.warnings);
      metadata.warnings = warnings;

      // Step 4: Persist results to database
      const processingTimeMs = Date.now() - startTime;
      await updateDocumentResults(input.document_id, {
        ocr_raw_text: ocrResult.raw_text,
        extracted_data: extraction.extracted as unknown as Record<
          string,
          unknown
        >,
        overall_confidence: extraction.overall_confidence,
        processing_status: 'completed',
        processing_time_ms: processingTimeMs,
        warnings,
      });

      // Step 5: Return structured result
      return {
        success: true,
        data: {
          document_id: input.document_id,
          document_type: input.document_type,
          extracted: extraction.extracted,
          overall_confidence: extraction.overall_confidence,
          ocr_text_length: ocrResult.raw_text.length,
          page_count: ocrResult.page_count,
        },
        error: null,
        confidence: extraction.overall_confidence,
        duration_ms: Date.now() - startTime,
        agent_type: 'document_processor',
        metadata,
      };
    } catch (error) {
      const processingTimeMs = Date.now() - startTime;
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error during document processing';

      // Persist failure state
      try {
        await updateDocumentResults(input.document_id, {
          ocr_raw_text: '',
          extracted_data: {},
          overall_confidence: 0,
          processing_status: 'failed',
          processing_error: errorMessage,
          processing_time_ms: processingTimeMs,
          warnings: [],
        });
      } catch {
        // If we can't even update the status, note it in metadata
        metadata.db_update_failed = true;
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
        confidence: 0,
        duration_ms: processingTimeMs,
        agent_type: 'document_processor',
        metadata,
      };
    }
  },
};

/**
 * Convenience: Process all documents for a case.
 * Returns results for each document, skipping already-completed ones.
 */
export async function processAllCaseDocuments(
  caseId: string
): Promise<AgentResult<DocumentProcessorOutput>[]> {
  const documents = await getDocumentsByCase(caseId);
  const results: AgentResult<DocumentProcessorOutput>[] = [];

  for (const doc of documents) {
    if (doc.processing_status === 'completed') {
      continue;
    }

    const result = await documentProcessorAgent.run({
      case_id: caseId,
      document_id: doc.id,
      document_type: doc.type as DocumentType,
      file_path: doc.file_path || undefined,
      file_url: doc.file_url || undefined,
    });

    results.push(result);
  }

  return results;
}
