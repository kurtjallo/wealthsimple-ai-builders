import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentType } from '@/types/index';
import {
  ExtractedField,
  ExtractedDocumentData,
  PassportData,
  DriversLicenseData,
  UtilityBillData,
  CorporateDocData,
} from '@/types/documents';
import { getExtractionPrompt } from './extraction-prompts';

const MODEL = 'gemini-2.5-pro';

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Extract structured data from raw OCR text using Gemini.
 * Returns typed extracted data with per-field confidence scores.
 */
export async function extractStructuredData(
  ocrText: string,
  documentType: DocumentType
): Promise<{
  extracted: ExtractedDocumentData;
  overall_confidence: number;
  warnings: string[];
}> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: MODEL });
  const prompt = getExtractionPrompt(documentType);

  const result = await model.generateContent(
    `Here is the OCR text extracted from a ${documentType.replace('_', ' ')} document:\n\n---\n${ocrText}\n---\n\n${prompt}`
  );

  // Extract text content from Gemini's response
  const responseText = result.response.text();

  // Parse JSON response - strip any markdown code fences if Gemini adds them
  const cleanJson = responseText
    .replace(/^```json?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim();

  const parsed = JSON.parse(cleanJson);

  // Build typed extraction based on document type
  const { extracted, warnings } = buildTypedExtraction(documentType, parsed);

  // Calculate overall confidence as average of all field confidences
  const overall_confidence = calculateOverallConfidence(extracted);

  return { extracted, overall_confidence, warnings };
}

/**
 * Build typed extraction from parsed JSON, validating field structure.
 */
function buildTypedExtraction(
  documentType: DocumentType,
  parsed: Record<string, unknown>
): { extracted: ExtractedDocumentData; warnings: string[] } {
  const warnings: string[] = [];

  function extractField<T = string>(
    obj: Record<string, unknown>,
    key: string,
    fieldName: string
  ): ExtractedField<T> {
    const field = obj[key] as Record<string, unknown> | undefined;
    if (!field) {
      warnings.push(`Missing field: ${fieldName}`);
      return { value: '' as unknown as T, confidence: 0, source: 'not found in extraction' };
    }
    return {
      value: (field.value ?? '') as T,
      confidence: typeof field.confidence === 'number' ? Math.max(0, Math.min(1, field.confidence)) : 0,
      source: (field.source as string) || 'not specified',
    };
  }

  switch (documentType) {
    case 'passport': {
      const data: PassportData = {
        full_name: extractField(parsed, 'full_name', 'Full Name'),
        date_of_birth: extractField(parsed, 'date_of_birth', 'Date of Birth'),
        nationality: extractField(parsed, 'nationality', 'Nationality'),
        passport_number: extractField(parsed, 'passport_number', 'Passport Number'),
        expiry_date: extractField(parsed, 'expiry_date', 'Expiry Date'),
        gender: extractField(parsed, 'gender', 'Gender'),
        issuing_country: extractField(parsed, 'issuing_country', 'Issuing Country'),
        mrz_line1: parsed.mrz_line1 ? extractField(parsed, 'mrz_line1', 'MRZ Line 1') : undefined,
        mrz_line2: parsed.mrz_line2 ? extractField(parsed, 'mrz_line2', 'MRZ Line 2') : undefined,
      };
      return { extracted: { type: 'passport', data }, warnings };
    }

    case 'drivers_license': {
      const data: DriversLicenseData = {
        full_name: extractField(parsed, 'full_name', 'Full Name'),
        date_of_birth: extractField(parsed, 'date_of_birth', 'Date of Birth'),
        address: extractField(parsed, 'address', 'Address'),
        license_number: extractField(parsed, 'license_number', 'License Number'),
        expiry_date: extractField(parsed, 'expiry_date', 'Expiry Date'),
        class: extractField(parsed, 'class', 'License Class'),
        issuing_province_state: extractField(parsed, 'issuing_province_state', 'Issuing Province/State'),
      };
      return { extracted: { type: 'drivers_license', data }, warnings };
    }

    case 'utility_bill':
    case 'bank_statement': {
      const data: UtilityBillData = {
        account_holder_name: extractField(parsed, 'account_holder_name', 'Account Holder Name'),
        service_address: extractField(parsed, 'service_address', 'Service Address'),
        account_number: extractField(parsed, 'account_number', 'Account Number'),
        bill_date: extractField(parsed, 'bill_date', 'Bill Date'),
        utility_provider: extractField(parsed, 'utility_provider', 'Utility Provider'),
      };
      return { extracted: { type: 'utility_bill', data }, warnings };
    }

    case 'corporate_doc': {
      const data: CorporateDocData = {
        company_name: extractField(parsed, 'company_name', 'Company Name'),
        registration_number: extractField(parsed, 'registration_number', 'Registration Number'),
        incorporation_date: extractField(parsed, 'incorporation_date', 'Incorporation Date'),
        registered_address: extractField(parsed, 'registered_address', 'Registered Address'),
        directors: extractField<string[]>(parsed, 'directors', 'Directors'),
        jurisdiction: extractField(parsed, 'jurisdiction', 'Jurisdiction'),
        company_type: extractField(parsed, 'company_type', 'Company Type'),
      };
      return { extracted: { type: 'corporate_doc', data }, warnings };
    }

    default:
      throw new Error(`Unsupported document type: ${documentType}`);
  }
}

/**
 * Calculate the overall confidence as the mean of all field confidences.
 */
function calculateOverallConfidence(extracted: ExtractedDocumentData): number {
  const fields = Object.values(extracted.data) as ExtractedField[];
  if (fields.length === 0) return 0;

  const totalConfidence = fields.reduce((sum, field) => {
    if (typeof field === 'object' && field !== null && 'confidence' in field) {
      return sum + (field as ExtractedField).confidence;
    }
    return sum;
  }, 0);

  return Math.round((totalConfidence / fields.length) * 100) / 100;
}
