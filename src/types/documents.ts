import { DocumentType } from './index';

// A single extracted field with its confidence score
export interface ExtractedField<T = string> {
  value: T;
  confidence: number; // 0.0 to 1.0
  source: string; // which part of the OCR text this came from
}

// Passport extracted data
export interface PassportData {
  full_name: ExtractedField;
  date_of_birth: ExtractedField;
  nationality: ExtractedField;
  passport_number: ExtractedField;
  expiry_date: ExtractedField;
  gender: ExtractedField;
  issuing_country: ExtractedField;
  mrz_line1?: ExtractedField; // Machine Readable Zone
  mrz_line2?: ExtractedField;
}

// Driver's license extracted data
export interface DriversLicenseData {
  full_name: ExtractedField;
  date_of_birth: ExtractedField;
  address: ExtractedField;
  license_number: ExtractedField;
  expiry_date: ExtractedField;
  class: ExtractedField;
  issuing_province_state: ExtractedField;
}

// Utility bill extracted data
export interface UtilityBillData {
  account_holder_name: ExtractedField;
  service_address: ExtractedField;
  account_number: ExtractedField;
  bill_date: ExtractedField;
  utility_provider: ExtractedField;
}

// Corporate registration document extracted data
export interface CorporateDocData {
  company_name: ExtractedField;
  registration_number: ExtractedField;
  incorporation_date: ExtractedField;
  registered_address: ExtractedField;
  directors: ExtractedField<string[]>;
  jurisdiction: ExtractedField;
  company_type: ExtractedField;
}

// Union type for all extracted data
export type ExtractedDocumentData =
  | { type: 'passport'; data: PassportData }
  | { type: 'drivers_license'; data: DriversLicenseData }
  | { type: 'utility_bill'; data: UtilityBillData }
  | { type: 'corporate_doc'; data: CorporateDocData };

// Overall document processing result
export interface DocumentProcessingResult {
  document_id: string;
  document_type: DocumentType;
  ocr_raw_text: string;
  extracted: ExtractedDocumentData;
  overall_confidence: number; // average of all field confidences
  processing_time_ms: number;
  warnings: string[]; // e.g., "Low image quality", "Partial text extraction"
}
