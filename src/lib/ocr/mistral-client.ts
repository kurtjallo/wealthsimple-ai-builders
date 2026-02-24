import { Mistral } from '@mistralai/mistralai';
import type { OcrResponse, OcrDocumentInput } from './types';

const MODEL = 'mistral-ocr-latest';

function getMistralClient(): Mistral {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY environment variable is not set');
  }
  return new Mistral({ apiKey });
}

/**
 * Process a document through Mistral OCR.
 * Accepts either a URL to the document or a base64-encoded document.
 * Returns the raw OCR response with page-level markdown text.
 */
export async function processDocument(input: OcrDocumentInput): Promise<OcrResponse> {
  const client = getMistralClient();

  const document = input.type === 'url'
    ? { type: 'document_url' as const, documentUrl: input.content }
    : { type: 'image_url' as const, imageUrl: `data:${input.mime_type || 'image/jpeg'};base64,${input.content}` };

  const response = await client.ocr.process({
    model: MODEL,
    document,
  });

  return response as unknown as OcrResponse;
}

/**
 * Extract concatenated text from all pages of an OCR response.
 * Joins page markdown with double newlines.
 */
export function extractFullText(response: OcrResponse): string {
  return response.pages
    .map((page) => page.markdown)
    .join('\n\n');
}

/**
 * Process a document and return the full extracted text.
 * Convenience function combining processDocument + extractFullText.
 */
export async function ocrExtractText(input: OcrDocumentInput): Promise<{
  raw_text: string;
  page_count: number;
  model: string;
}> {
  const response = await processDocument(input);
  return {
    raw_text: extractFullText(response),
    page_count: response.pages.length,
    model: response.model,
  };
}
