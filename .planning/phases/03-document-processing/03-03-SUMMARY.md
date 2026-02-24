---
phase: 03-document-processing
plan: 03
status: complete
---

## Plan 03-03: Structured Extractor — COMPLETE

### What was built

**Task 1: Extraction Prompts** (`src/lib/ocr/extraction-prompts.ts`)
- `getExtractionPrompt(documentType)` returns document-type-specific prompts for Gemini
- Covers all 5 document types: passport, drivers_license, utility_bill, bank_statement, corporate_doc
- bank_statement reuses utility_bill prompt (same field structure)
- Shared `CONFIDENCE_INSTRUCTIONS` block ensures consistent confidence scoring across all types
- Prompts instruct Gemini to return strict JSON only (no markdown wrapping)

**Task 2: Structured Extractor** (`src/lib/ocr/structured-extractor.ts`)
- `extractStructuredData(ocrText, documentType)` — main export
- Calls Gemini 2.5 Pro with type-specific prompts to parse OCR text into structured data
- Returns `{ extracted: ExtractedDocumentData, overall_confidence: number, warnings: string[] }`
- Per-field confidence scores clamped to [0, 1]
- Missing fields degrade gracefully: low confidence + warnings (never throws)
- JSON response cleanup strips markdown code fences if Gemini adds them
- Overall confidence = mean of all field confidences, rounded to 2 decimal places

### Key decisions
- Creates its own GoogleGenerativeAI client instance (not the singleton from `client.ts`) to stay self-contained
- Model hardcoded to `gemini-2.5-pro` matching project stack
- `buildTypedExtraction` validates and maps raw JSON to typed interfaces from `@/types/documents`
- Optional fields (e.g., MRZ lines on passport) only included if present in Gemini's response

### Verification
- `npx tsc --noEmit` — zero errors in plan 03-03 files
- All type imports resolve correctly against `@/types/documents` and `@/types/index`

### Files created
- `src/lib/ocr/extraction-prompts.ts`
- `src/lib/ocr/structured-extractor.ts`
