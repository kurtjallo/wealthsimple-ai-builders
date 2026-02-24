---
phase: 03-document-processing
plan: 01
status: complete
---

# Plan 03-01 Summary: OCR Types + Mistral Client

## What was built

### 1. Document processing types (`src/types/documents.ts`)
- `ExtractedField<T>` — generic field wrapper with value, confidence (0-1), and source text
- `PassportData` — 9 fields (full_name, date_of_birth, nationality, passport_number, expiry_date, gender, issuing_country, mrz_line1, mrz_line2)
- `DriversLicenseData` — 7 fields (full_name, date_of_birth, address, license_number, expiry_date, class, issuing_province_state)
- `UtilityBillData` — 5 fields (account_holder_name, service_address, account_number, bill_date, utility_provider)
- `CorporateDocData` — 7 fields (company_name, registration_number, incorporation_date, registered_address, directors as `ExtractedField<string[]>`, jurisdiction, company_type)
- `ExtractedDocumentData` — discriminated union over all four document types
- `DocumentProcessingResult` — complete result with document_id, document_type, ocr_raw_text, extracted data, overall_confidence, processing_time_ms, warnings

### 2. OCR-specific types (`src/lib/ocr/types.ts`)
- `OcrPage`, `OcrImage`, `OcrPageDimensions` — page-level OCR response types
- `OcrResponse` — full OCR response with pages array, model, and usage info
- `OcrDocumentInput` — input type supporting 'url' and 'base64' document sources

### 3. Mistral OCR client wrapper (`src/lib/ocr/mistral-client.ts`)
- `processDocument(input)` — sends document to Mistral OCR API, returns raw `OcrResponse`
- `extractFullText(response)` — concatenates all page markdown from OCR response
- `ocrExtractText(input)` — convenience function combining processDocument + extractFullText
- Uses `@mistralai/mistralai` SDK v1 with `client.ocr.process()`
- Supports both URL (`document_url` type) and base64 (`image_url` type with data URI) inputs
- Client created per-request (serverless-friendly, not singleton)
- API key read from `process.env.MISTRAL_API_KEY`

## Verification
- All three files compile with `npx tsc --noEmit` (zero errors in these files)
- No hardcoded API keys
- `ExtractedField` generic properly defaults to `string` but allows `string[]` override for directors

## Dependencies added
- `@mistralai/mistralai` — Mistral AI TypeScript SDK
