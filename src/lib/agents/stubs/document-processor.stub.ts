import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, DocumentProcessorInput, DocumentProcessorOutput } from '@/types';

export async function documentProcessorStub(
  input: DocumentProcessorInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<DocumentProcessorOutput> {
  // Simulate processing time
  await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

  const docId = input.documents[0]?.id || 'doc-001';

  return {
    extracted_fields: [
      { field_name: 'full_name', value: 'John Michael Smith', confidence: 0.95, source_document_id: docId },
      { field_name: 'date_of_birth', value: '1985-03-15', confidence: 0.92, source_document_id: docId },
      { field_name: 'document_number', value: 'P12345678', confidence: 0.98, source_document_id: docId },
      { field_name: 'nationality', value: 'Canadian', confidence: 0.97, source_document_id: docId },
      { field_name: 'expiry_date', value: '2028-03-14', confidence: 0.94, source_document_id: docId },
      { field_name: 'address', value: '123 Bay Street, Toronto, ON M5J 2T3', confidence: 0.88, source_document_id: docId },
    ],
    raw_ocr_text: {
      [docId]: 'CANADA / PASSPORT\nSurname: SMITH\nGiven Names: JOHN MICHAEL\nDate of Birth: 15 MAR 1985\nPassport No: P12345678\nNationality: CANADIAN\nDate of Expiry: 14 MAR 2028',
    },
    document_quality: {
      [docId]: 0.91,
    },
  };
}
