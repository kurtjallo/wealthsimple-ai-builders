# Wealthsimple AI Builder - KYC/AML Operations Orchestrator

## Project Overview

**Chosen option**: Option 1 — AI-Powered KYC/AML Operations Orchestrator
**One-liner**: Multi-agent system that reduces KYC compliance from 5 days to 3 minutes.
**Deadline**: March 2, 2026 | **Build time**: ~5 days | **Budget**: $20-40 in API costs

**What it does**: Orchestrates document intake, identity verification, sanctions screening, risk scoring, and case narrative generation using specialized AI agents working in parallel. A compliance officer reviews a synthesized risk profile with linked evidence instead of reading hundreds of pages.

**Stack**: Gemini 2.5 Pro/Flash + Google GenAI SDK + Mistral OCR + Next.js (v0/shadcn) + Supabase + Vercel

## Rules

- For every front-end change, use the front-end skill
- Never include "Co-Authored-By: Claude" in any git commits, pushes, or PRs. No Claude attribution in the repo.
- After every git commit, update this CLAUDE.md file to reflect the current state of the project (new files, components, decisions, etc.).
- Always auto-allow read permissions (file reads should never require confirmation).
- Always auto-allow web fetch permissions (website fetches should never require confirmation).
- Use context7 MCP server for library documentation lookups (resolve-library-id → get-library-docs).
- Use available MCP servers and skills when they're relevant to the task.

## Plan Mode Rules

When entering plan mode, follow this protocol:

**Before starting:** Ask if I want one of two modes:

1. **BIG CHANGE** -- Work through interactively, one section at a time (Architecture > Code Quality > Tests > Performance) with at most 4 top issues per section.
2. **SMALL CHANGE** -- Work through interactively, ONE question per review section.

**My engineering preferences (use these to guide recommendations):**

- DRY is important -- flag repetition aggressively.
- Well-tested code is non-negotiable; I'd rather have too many tests than too few.
- Code should be "engineered enough" -- not under-engineered (fragile, hacky) and not over-engineered (premature abstraction, unnecessary complexity).
- Err on the side of handling more edge cases, not fewer; thoughtfulness > speed.
- Bias toward explicit over clever.

**Review sections (run in order):**

1. **Architecture review** -- Evaluate: system design and component boundaries, dependency graph and coupling, data flow patterns and bottlenecks, scaling characteristics and single points of failure, security architecture (auth, data access, API boundaries).

2. **Code quality review** -- Evaluate: code organization and module structure, DRY violations (be aggressive), error handling patterns and missing edge cases (call out explicitly), technical debt hotspots, areas that are over/under-engineered relative to my preferences.

3. **Test review** -- Evaluate: test coverage gaps (unit, integration, e2e), test quality and assertion strength, missing edge case coverage (be thorough), untested failure modes and error paths.

4. **Performance review** -- Evaluate: N+1 queries and database access patterns, memory-usage concerns, caching opportunities, slow or high-complexity code paths.

**For each issue found:**

- Describe the problem concretely, with file and line references.
- Present 2-3 options, including "do nothing" where reasonable.
- For each option: specify implementation effort, risk, impact on other code, and maintenance burden.
- Give an opinionated recommended option and why, mapped to my preferences above.
- Explicitly ask whether I agree or want a different direction before proceeding.

**Formatting rules for AskUserQuestion:**

- NUMBER issues (1, 2, 3...) and give LETTERS for options (A, B, C...).
- Each AskUserQuestion option must clearly label the issue NUMBER and option LETTER so I don't get confused.
- The recommended option is always the 1st option.

**Workflow:**

- Do not assume my priorities on timeline or scale.
- After each review section, pause and ask for feedback before moving on.

## Project State

- **Status**: Phase 8 complete — Dashboard, pipeline visualization, case lifecycle all done. Ready for Phase 9.
- **Planning docs**:
  - `.planning/PROJECT.md` — full project context and requirements
  - `.planning/REQUIREMENTS.md` — 26 v1 requirements with traceability
  - `.planning/ROADMAP.md` — 10 phases with success criteria and requirement mappings
  - `.planning/STATE.md` — living project state
  - `.planning/config.json` — YOLO mode, comprehensive depth, parallel execution
- **Phase directories**: `.planning/phases/01-foundation` through `.planning/phases/10-demo-polish-deliverables`
- **Research**: `/research/` (10 files), `PROJECT_OPTIONS.md`, `RESEARCH_SYNTHESIS.md`

## Completed Work

### Phase 1: Foundation (Plans 01-01, 01-02, 01-03)

**Plan 01-01: Project Scaffold**
- Next.js app with TypeScript, Tailwind CSS v4, ESLint
- 13 shadcn/ui components: button, card, badge, input, textarea, separator, scroll-area, table, tabs, alert, dialog, dropdown-menu, sonner
- Domain types: `src/types/index.ts` — Case, Document, AgentRun, AuditLog interfaces
- App shell: KYC/AML card at `/`, health check at `/api/health`
- `.env.example` with Supabase, Gemini, Mistral keys

**Plan 01-02: Supabase Schema & Types**
- `supabase/migrations/00001_initial_schema.sql` — 4 tables (cases, documents, agent_runs, audit_logs), indexes, updated_at trigger, permissive RLS
- `src/lib/supabase/types.ts` — Database type with Row/Insert/Update for all tables
- `src/lib/supabase/client.ts` — Browser Supabase client
- `src/lib/supabase/server.ts` — Server Supabase client with service role key

**Plan 01-03: Google GenAI SDK Init**
- `src/lib/agents/client.ts` — GoogleGenerativeAI client singleton, MODEL_CONFIG (Gemini 2.5 Pro + Flash)
- `src/lib/agents/test.ts` — Connectivity test utility
- `src/app/api/agents/test/route.ts` — POST endpoint for SDK testing
- Health check updated with Gemini SDK status

### Phase 3: Document Processing (Plans 03-01 to 03-06)

**Plan 03-01: OCR Types + Mistral Client**
- `src/types/documents.ts` — ExtractedField<T>, ExtractedDocumentData (discriminated union), 4 document types
- `src/lib/ocr/types.ts` — OcrPage, OcrImage, OcrResponse
- `src/lib/ocr/mistral-client.ts` — processDocument(), extractFullText(), ocrExtractText()

**Plan 03-02: DB Schema + Storage**
- `supabase/migrations/003_documents_storage.sql` — Extended documents table with OCR/confidence/status fields
- `src/lib/supabase/storage.ts` — uploadDocument(), getDocumentSignedUrl(), downloadDocument()
- `src/lib/supabase/documents.ts` — Full CRUD lifecycle (pending → processing → completed/failed)

**Plan 03-03: Structured Extractor**
- `src/lib/ocr/extraction-prompts.ts` — Per-document-type extraction prompts with confidence scoring
- `src/lib/ocr/structured-extractor.ts` — Gemini-powered extraction with per-field confidence

**Plan 03-04: Document Processor Agent**
- `src/lib/agents/document-processor.ts` — Full pipeline: OCR → extraction → persistence
- `src/lib/agents/types.ts` — Shared Agent<TInput, TOutput> interface

**Plan 03-05: API Routes**
- `src/app/api/documents/upload/route.ts` — Multipart upload with validation
- `src/app/api/documents/process/route.ts` — Trigger processing
- `src/app/api/documents/[id]/route.ts` — Retrieve document + results

**Plan 03-06: E2E Test**
- `scripts/test-document-processing.ts` — End-to-end pipeline validation
- `test-documents/README.md` — Test document setup instructions

### Phase 2: Agent Orchestration Core (Plans 02-01 to 02-05)

**Plan 02-01: Agent & Pipeline Types**
- `src/types/agents.ts` — 16 interfaces: AgentResult<T>, AgentConfig, Input/Output for all 5 agents, ExtractedField, IdentityMatch, SanctionsMatch, RiskFactor
- `src/types/pipeline.ts` — PipelineStage (7-state FSM), PIPELINE_TRANSITIONS, PipelineState, PipelineError, PipelineEvent

**Plan 02-02: Base Agent Runner + Orchestrator**
- `src/lib/agents/agent-config.ts` — AGENT_CONFIGS for 6 agent types (model, timeout, retry settings)
- `src/lib/agents/base-agent.ts` — runAgent() with timeout, retry (exponential backoff), typed AgentResult
- `src/lib/agents/orchestrator.ts` — processCase(), registerAgent(), state machine, parallel Identity+Sanctions

**Plan 02-03: Stub Agents**
- `src/lib/agents/stubs/` — 5 stub agents with realistic data and simulated delays (200-1500ms)
- `src/lib/agents/stubs/index.ts` — registerAllStubs() + re-exports

**Plan 02-04: Error Handling**
- `src/lib/agents/error-handling.ts` — 6 error categories, classifyError(), graceful degradation, formatPipelineErrors()
- Orchestrator updated: Promise.allSettled for parallel verification, getPipelineSummary()

**Plan 02-05: API Endpoint + Integration Test**
- `src/app/api/cases/process/route.ts` — POST endpoint, validates input, runs full pipeline
- `src/lib/agents/__tests__/pipeline.test.ts` — 37/37 assertions passing

### Phase 4: Sanctions & Identity Screening (Plans 04-01 to 04-06)

**Plan 04-01: Sanctions Schema + OFAC Parser**
- `supabase/migrations/004_sanctions_schema.sql` — sanctions_entries + sanctions_aliases tables, pg_trgm extension, trigram GIN indexes for fuzzy search
- `src/lib/sanctions/types.ts` — SanctionsEntry, SanctionsAlias, SanctionsListSource, SanctionsSearchResult, MatchConfidence
- `src/lib/sanctions/ofac-parser.ts` — OFAC SDN XML parser using fast-xml-parser
- `src/lib/sanctions/ofac-loader.ts` — Batch upsert (500/batch), idempotent re-runs
- `scripts/load-ofac-sdn.ts` — CLI script to download and load full OFAC SDN list
- `src/lib/supabase/types.ts` — Updated with sanctions_entries and sanctions_aliases table types

**Plan 04-02: Fuzzy Name Matching Engine**
- `src/lib/sanctions/name-normalizer.ts` — normalizeName, normalizeArabicName (~40 variant mappings), generatePhoneticCodes (Soundex + Double Metaphone), splitNameTokens
- `src/lib/sanctions/fuzzy-match.ts` — fuzzyMatchName with Levenshtein, phonetic, token overlap (Jaccard), Arabic variant matching
- `src/lib/sanctions/__tests__/fuzzy-match.test.ts` — 43 tests passing (Arabic variants, phonetic, reordering, non-matches)

**Plan 04-03: UN Sanctions + PEP Database**
- `src/lib/sanctions/un-parser.ts` — UN consolidated sanctions XML parser (individuals + entities)
- `src/lib/sanctions/un-loader.ts` — Batch upsert following OFAC pattern
- `scripts/load-un-sanctions.ts` — CLI download + load script
- `src/lib/sanctions/pep-data.ts` — 50 fictional PEP entries across 8 categories with Arabic name variants
- `scripts/load-pep-database.ts` — CLI PEP loader

**Plan 04-04: Unified Screening Service**
- `src/lib/sanctions/screening-service.ts` — screenName() and screenIdentity() querying all 3 lists via Supabase ILIKE + fuzzy refinement
- `src/lib/sanctions/__tests__/screening-service.test.ts` — 17 tests passing
- Risk classification: clear / potential_match / strong_match
- DOB secondary verification with score boost/penalty

**Plan 04-05: Sanctions Screener Agent**
- `src/lib/agents/sanctions-screener.ts` — sanctionsScreenerHandler() compatible with orchestrator registerAgent() pattern
- Screens against OFAC, UN, PEP with Gemini-powered summary generation
- Falls back to deterministic summary if Gemini unavailable

**Plan 04-06: Identity Verifier Agent**
- `src/lib/agents/identity-verifier.ts` — identityVerifierHandler() with 4 verification checks
- Name consistency (fuzzyMatchName), DOB plausibility, document validity, watchlist cross-reference
- Weighted confidence: name 30%, DOB 20%, document 20%, watchlist 30%

### Phase 5: Risk Scoring & Narrative (Plans 05-01 to 05-03)

**Plan 05-01: Scoring Engine + Risk Scorer Agent**
- `src/lib/agents/scoring-engine.ts` — Pure deterministic scoring: calculateCompositeRisk, calculateDocumentRisk, calculateIdentityRisk, calculateSanctionsRisk, getRiskCategory, DEFAULT_RISK_WEIGHTS
- `src/lib/agents/risk-scorer.ts` — riskScorerHandler() + registerRiskScorer(), deterministic scoring + Gemini summary
- Weighted formula: documents 20%, identity 25%, sanctions 35%, PEP 20%
- Risk levels: Low (0-25), Medium (26-50), High (51-75), Critical (76-100)

**Plan 05-02: Case Narrator Agent**
- `src/lib/agents/narrator-prompts.ts` — NARRATOR_SYSTEM_PROMPT + buildNarrativePrompt() with 4 section formatters
- `src/lib/agents/case-narrator.ts` — caseNarratorHandler() + registerCaseNarrator(), JSON output with fallback to escalate
- Structured output: narrative, key_findings, recommended_action, evidence_links

**Plan 05-03: Registration + API Endpoints**
- `src/lib/agents/register-all.ts` — registerAllAgents() with idempotent double-call guard
- `src/app/api/cases/[id]/risk/route.ts` — POST endpoint, triggers risk scoring, persists to agent_runs + updates cases
- `src/app/api/cases/[id]/narrative/route.ts` — POST endpoint, triggers narrative gen, persists to agent_runs + updates cases
- `src/lib/supabase/types.ts` — Added Enums + CompositeTypes to Database interface

### Phase 6: Dashboard Core (Plans 06-01 to 06-04)

**Plan 06-01: Dashboard Layout Shell**
- `src/components/layout/sidebar.tsx` — Sidebar navigation with route highlighting
- `src/components/layout/header.tsx` — Top header with system status badge
- `src/components/layout/dashboard-shell.tsx` — DashboardShell content wrapper
- `src/app/dashboard/layout.tsx` — Dashboard route group layout
- `src/app/dashboard/page.tsx` — Dashboard overview page
- `src/lib/constants.ts` — NAV_ITEMS, STATUS_CONFIG, RISK_LEVEL_CONFIG, DECISION_CONFIG

**Plan 06-02: Case Queue Page**
- `src/app/api/cases/route.ts` — GET endpoint for case list
- `src/app/dashboard/cases/page.tsx` — Tabbed case queue (In Progress / Ready for Review / Completed)
- `src/components/cases/case-queue-table.tsx` — Case table with status/risk badges
- `src/components/cases/case-status-badge.tsx` — CaseStatusBadge component
- `src/components/cases/case-risk-badge.tsx` — CaseRiskBadge component

**Plan 06-03: Case Detail / Risk Profile**
- `src/app/dashboard/cases/[id]/page.tsx` — Case detail page
- `src/app/api/cases/[id]/route.ts` — GET endpoint for single case
- `src/app/api/cases/[id]/agent-runs/route.ts` — GET endpoint for agent run results
- `src/components/cases/risk-profile-card.tsx` — Risk score visualization
- `src/components/cases/case-narrative-card.tsx` — Narrative display
- `src/components/cases/agent-results-panel.tsx` — Agent results panel
- `src/components/cases/evidence-section.tsx` — Evidence links

**Plan 06-04: Decision Workflow**
- `src/app/api/cases/[id]/decision/route.ts` — POST endpoint for approve/deny/escalate
- `src/components/cases/decision-workflow.tsx` — Decision form with mandatory justification and audit trail

### Phase 7: Agent Visualization (Plans 07-01 to 07-04)

**Plan 07-01: SSE Streaming Infrastructure**
- `src/app/api/cases/[caseId]/stream/route.ts` — SSE endpoint for agent status streaming
- `src/app/api/cases/[caseId]/agents/route.ts` — REST endpoint for agent status
- `src/hooks/use-pipeline-stream.ts` — usePipelineStream hook
- `src/hooks/use-agent-status.ts` — useAgentStatus hook

**Plan 07-02: Pipeline Visualization Components**
- `src/components/pipeline/agent-status-card.tsx` — Agent card with status, confidence, duration
- `src/components/pipeline/agent-pipeline-view.tsx` — Fork/join pipeline layout
- `src/components/pipeline/pipeline-stage-indicator.tsx` — Stage progress indicator
- `src/components/pipeline/agent-status-badge.tsx` — Agent status badge

**Plan 07-03: Framer Motion Animations**
- `src/components/pipeline/confidence-ring.tsx` — Animated SVG circular confidence indicator
- `src/components/pipeline/processing-timer.tsx` — Live elapsed timer with requestAnimationFrame
- Enhanced all pipeline components with Framer Motion: entrance animations, glow-pulse, staggered reveals
- `src/app/globals.css` — shimmer, glow-pulse, animate-glow-pulse keyframes

**Plan 07-04: UI Polish**
- `src/components/ui/status-dot.tsx` — Animated status indicator with pulse for online/running states
- `src/components/ui/loading-skeleton.tsx` — CardSkeleton, TableRowSkeleton, TextBlockSkeleton, PipelineSkeleton
- Enhanced `src/components/layout/header.tsx` — Sticky header with logo, system status, notification bell, user avatar
- Enhanced `src/components/layout/sidebar.tsx` — Navigation links + Agent Systems health indicators
- `src/app/globals.css` — Dashboard polish: scrollbar styles, card-interactive, fadeIn, status color utilities

### Phase 8: Case Lifecycle Integration (Plans 08-01 to 08-05)

**Plan 08-01: Document Upload**
- `src/app/api/cases/[id]/documents/upload/route.ts` — Multipart upload endpoint
- `src/components/cases/document-upload.tsx` — Drag-and-drop file upload component

**Plan 08-02: Case Processing**
- `src/app/api/cases/create/route.ts` — POST endpoint for case creation
- `src/app/api/cases/[id]/process/route.ts` — POST endpoint to trigger pipeline
- `src/lib/pipeline/case-processor.ts` — processCaseLifecycle() orchestrating full pipeline
- `src/lib/pipeline/progress-emitter.ts` — ProgressEmitter class for SSE bridge

**Plan 08-03: Delays + Routing**
- `src/lib/pipeline/delay-simulator.ts` — Per-agent delay config (12-18s total pipeline)
- `src/lib/pipeline/confidence-router.ts` — Per-agent confidence thresholds, routing decisions

**Plan 08-04: Error Handling**
- `src/lib/pipeline/error-recovery.ts` — classifyPipelineError(), getUserFacingError(), getRecoveryStrategy()
- `src/components/cases/processing-error-display.tsx` — Collapsible error cards with severity coloring, retry button
- `src/app/api/cases/[id]/retry/route.ts` — POST endpoint to retry failed case processing

**Plan 08-05: Golden Path**
- `src/app/cases/new/page.tsx` — 4-step wizard: applicant info → document upload → processing → completion
- `src/app/api/cases/[id]/progress/route.ts` — SSE endpoint streaming pipeline progress events
- `src/lib/pipeline/__tests__/golden-path.test.ts` — Integration test for full pipeline lifecycle

## Phase Plans Summary

| Phase | Plans | Waves | Key Focus |
|-------|-------|-------|-----------|
| 01 - Foundation | 3 (01-01 to 01-03) | 2 | Scaffold, Supabase schema, Google GenAI SDK init |
| 02 - Agent Orchestration | 5 (02-01 to 02-05) | 3 | Types, base agent, orchestrator, config, registration |
| 03 - Document Processing | 6 (03-01 to 03-06) | 3 | Mistral OCR, structured extraction, confidence scoring |
| 04 - Sanctions & Identity | 6 (04-01 to 04-06) | 3 | UN/OFAC lists, fuzzy matching, PEP screening, identity verification |
| 05 - Risk Scoring & Narrative | 3 (05-01 to 05-03) | 2 | Scoring engine, risk scorer agent, case narrator agent |
| 06 - Dashboard Core | 4 (06-01 to 06-04) | 3 | Layout → Case queue + Risk profile (parallel) → Decision workflow |
| 07 - Agent Visualization | 4 (07-01 to 07-04) | 3 | SSE infrastructure → Pipeline components → Animations + UI polish |
| 08 - Case Lifecycle | 5 (08-01 to 08-05) | 3 | Upload + Processing (parallel) → Routing + Errors (parallel) → Golden path |
| 09 - Regulatory & Audit | 4 (09-01 to 09-04) | 2 | Audit logging + HITL enforcement (parallel) → Viewer + FINTRAC UI |
| 10 - Demo Polish | 5 (10-01 to 10-05) | 3 | Demo data + Deploy (parallel) → Video script + Explanation → Final QA |
