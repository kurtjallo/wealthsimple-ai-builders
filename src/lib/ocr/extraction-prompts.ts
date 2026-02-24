import { DocumentType } from '@/types/index';

/**
 * Get the extraction prompt for a specific document type.
 * Each prompt instructs Claude to extract fields and assign confidence scores.
 */
export function getExtractionPrompt(documentType: DocumentType): string {
  const prompts: Record<DocumentType, string> = {
    passport: PASSPORT_PROMPT,
    drivers_license: DRIVERS_LICENSE_PROMPT,
    utility_bill: UTILITY_BILL_PROMPT,
    bank_statement: UTILITY_BILL_PROMPT, // Same structure as utility bill
    corporate_doc: CORPORATE_DOC_PROMPT,
  };

  return prompts[documentType];
}

const CONFIDENCE_INSTRUCTIONS = `
For each field, assign a confidence score between 0.0 and 1.0:
- 1.0: Text is clearly legible and unambiguous
- 0.8-0.9: Text is legible but minor formatting issues
- 0.6-0.7: Text is partially legible or requires interpretation
- 0.3-0.5: Text is difficult to read, educated guess
- 0.1-0.2: Very uncertain, minimal evidence
- 0.0: Field not found in document

For the "source" field, quote the relevant text from the OCR output that you extracted the value from. If the field is not found, set source to "not found in document".

IMPORTANT: Always include ALL fields even if not found. Set value to empty string and confidence to 0.0 for missing fields. Never omit a field.
`.trim();

const PASSPORT_PROMPT = `
Extract the following fields from this passport OCR text. Return ONLY valid JSON matching the schema below.

${CONFIDENCE_INSTRUCTIONS}

Required JSON schema:
{
  "full_name": { "value": "string", "confidence": number, "source": "string" },
  "date_of_birth": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "nationality": { "value": "string", "confidence": number, "source": "string" },
  "passport_number": { "value": "string", "confidence": number, "source": "string" },
  "expiry_date": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "gender": { "value": "string (M/F/X)", "confidence": number, "source": "string" },
  "issuing_country": { "value": "string", "confidence": number, "source": "string" },
  "mrz_line1": { "value": "string", "confidence": number, "source": "string" },
  "mrz_line2": { "value": "string", "confidence": number, "source": "string" }
}

Respond with ONLY the JSON object. No markdown, no explanation.
`.trim();

const DRIVERS_LICENSE_PROMPT = `
Extract the following fields from this driver's license OCR text. Return ONLY valid JSON matching the schema below.

${CONFIDENCE_INSTRUCTIONS}

Required JSON schema:
{
  "full_name": { "value": "string", "confidence": number, "source": "string" },
  "date_of_birth": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "address": { "value": "string (full address)", "confidence": number, "source": "string" },
  "license_number": { "value": "string", "confidence": number, "source": "string" },
  "expiry_date": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "class": { "value": "string (license class/type)", "confidence": number, "source": "string" },
  "issuing_province_state": { "value": "string", "confidence": number, "source": "string" }
}

Respond with ONLY the JSON object. No markdown, no explanation.
`.trim();

const UTILITY_BILL_PROMPT = `
Extract the following fields from this utility bill OCR text. Return ONLY valid JSON matching the schema below.

${CONFIDENCE_INSTRUCTIONS}

Required JSON schema:
{
  "account_holder_name": { "value": "string", "confidence": number, "source": "string" },
  "service_address": { "value": "string (full address)", "confidence": number, "source": "string" },
  "account_number": { "value": "string", "confidence": number, "source": "string" },
  "bill_date": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "utility_provider": { "value": "string", "confidence": number, "source": "string" }
}

Respond with ONLY the JSON object. No markdown, no explanation.
`.trim();

const CORPORATE_DOC_PROMPT = `
Extract the following fields from this corporate registration document OCR text. Return ONLY valid JSON matching the schema below.

${CONFIDENCE_INSTRUCTIONS}

Required JSON schema:
{
  "company_name": { "value": "string", "confidence": number, "source": "string" },
  "registration_number": { "value": "string", "confidence": number, "source": "string" },
  "incorporation_date": { "value": "string (YYYY-MM-DD format)", "confidence": number, "source": "string" },
  "registered_address": { "value": "string (full address)", "confidence": number, "source": "string" },
  "directors": { "value": ["string array of director names"], "confidence": number, "source": "string" },
  "jurisdiction": { "value": "string (province/state/country)", "confidence": number, "source": "string" },
  "company_type": { "value": "string (e.g., Corporation, LLC, Partnership)", "confidence": number, "source": "string" }
}

Respond with ONLY the JSON object. No markdown, no explanation.
`.trim();
