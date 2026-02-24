---
phase: 03-document-processing
plan: 05
status: completed
---

# Plan 03-05 Summary: Document Processing API Routes

## What was done

Created three API routes that expose the document processing pipeline to the frontend and orchestrator:

### 1. Document Upload — `POST /api/documents/upload`
**File**: `src/app/api/documents/upload/route.ts`
- Accepts multipart/form-data with fields: `file`, `case_id`, `document_type`
- Validates: file presence, case_id, document_type (must be valid DocumentType), file MIME type (JPEG/PNG/WebP/PDF), file size (max 10MB)
- Uploads to Supabase Storage via `uploadDocument()`
- Creates a pending document record via `createDocument()`
- Returns 201 with `document_id`, `file_name`, `document_type`, `processing_status`

### 2. Document Processing Trigger — `POST /api/documents/process`
**File**: `src/app/api/documents/process/route.ts`
- Accepts JSON body with `document_id`
- Checks if document exists (404 if not)
- Returns early if already `completed` or currently `processing`
- Invokes `documentProcessorAgent.run()` (Mistral OCR -> Gemini extraction -> DB persistence)
- Returns: `document_id`, `success`, `confidence`, `duration_ms`, `error`, `extracted`, `warnings`
- Synchronous processing (suitable for demo; production would use async jobs)

### 3. Document Retrieval — `GET /api/documents/[id]`
**File**: `src/app/api/documents/[id]/route.ts`
- Fetches document by ID via `getDocument()`
- Returns full document record: type, processing_status, ocr_raw_text, extracted_data, overall_confidence, processing_time_ms, processing_error, warnings, timestamps
- Uses Next.js 15 dynamic route params pattern (`params` is a Promise)

## Key decisions
- Process route adapted to match actual `AgentResult` interface (`success`, `confidence`, `duration_ms`, `metadata.warnings`) rather than plan's draft which assumed different field names
- All routes use consistent error shape: `{ error: string }` with appropriate HTTP status codes (400, 404, 500)
- File validation happens before any Supabase operations to fail fast

## Verification
- `npx tsc --noEmit` passes for all three route files (existing errors in `scripts/test-document-processing.ts` are from another plan)
- All routes follow the existing pattern from `src/app/api/cases/process/route.ts`
