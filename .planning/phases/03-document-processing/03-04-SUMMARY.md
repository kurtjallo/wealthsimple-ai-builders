---
phase: 03-document-processing
plan: 04
status: completed
---

## Summary

Built the Document Processor agent and shared agent interface types.

### Files Created

**`src/lib/agents/types.ts`** — Shared agent interface types
- `AgentInput`: base input with `case_id` + extensible fields
- `Agent<TInput, TOutput>`: interface all specialized agents implement (type, name, description, run method)
- Re-exports `AgentResult` and `AgentType` for convenience

**`src/lib/agents/document-processor.ts`** — Document Processor agent
- `DocumentProcessorInput`: extends AgentInput with document_id, document_type, and three source options (file_path, file_url, file_base64)
- `DocumentProcessorOutput`: document_id, document_type, extracted data, overall_confidence, ocr_text_length, page_count
- `documentProcessorAgent`: implements `Agent<DocumentProcessorInput, DocumentProcessorOutput>`
  - Pipeline: resolve input -> Mistral OCR -> Gemini extraction -> confidence scoring -> database persistence
  - Never throws — returns `AgentResult` with `success: false` on failure
  - Persists failure state to database on error
  - Supports three document sources: Supabase Storage path (signed URL), direct URL, base64
- `processAllCaseDocuments(caseId)`: convenience function to process all pending documents for a case

### Key Decisions

- Used existing `AgentResult` shape from `src/types/agents.ts` (with `success: boolean`, `data: T | null`) rather than introducing a competing type
- Agent catches all errors and returns failure result — orchestrator never receives unhandled exceptions
- Document source resolution is internal to the agent (resolveDocumentInput helper)

### Verification

- `npx tsc --noEmit` passes with no errors
