# Roadmap: KYC/AML Operations Orchestrator

## Overview

Build a multi-agent KYC/AML compliance system in 10 phases: scaffold the project, build the agent orchestration backbone, implement each specialized agent (document processing, sanctions screening, risk scoring), build the compliance officer dashboard with real-time visualization, integrate the full case lifecycle, add regulatory compliance and audit trails, then polish with demo data and deliver.

## Phases

- [ ] **Phase 1: Foundation** - Project scaffolding, Next.js + Supabase + Google GenAI SDK setup
- [ ] **Phase 2: Agent Orchestration Core** - Multi-agent framework, agent definitions, inter-agent communication
- [ ] **Phase 3: Document Processing** - Mistral OCR integration, structured data extraction, confidence scoring
- [ ] **Phase 4: Sanctions & Identity Screening** - Real sanctions lists (UN, OFAC), identity verification, PEP screening
- [ ] **Phase 5: Risk Scoring & Case Narrative** - Aggregate agent signals into risk scores, generate case narratives
- [ ] **Phase 6: Dashboard Core** - Case queue, risk profile view, approve/deny/escalate workflow
- [ ] **Phase 7: Agent Visualization** - Real-time agent status, animations, transitions, maximum UI polish
- [ ] **Phase 8: Case Lifecycle Integration** - End-to-end flow, realistic delays, error states, confidence routing
- [ ] **Phase 9: Regulatory & Audit Trail** - Human-in-the-loop enforcement, audit logging, FINTRAC compliance
- [ ] **Phase 10: Demo Polish & Deliverables** - Demo data, deployed prototype, demo video, 500-word explanation

## Phase Details

### Phase 1: Foundation
**Goal**: Project scaffolded with all core dependencies, dev server running, Supabase connected
**Depends on**: Nothing (first phase)
**Requirements**: DEPLOY-01, DEPLOY-02
**Success Criteria** (what must be TRUE):
  1. Next.js app runs locally with no errors
  2. Supabase database connected with schema for cases, agents, audit logs
  3. Google GenAI SDK initialized and responding to test calls
  4. Project structure follows clean architecture (API routes, components, lib, types)
**Research**: Unlikely — standard stack setup
**Plans**: TBD

### Phase 2: Agent Orchestration Core
**Goal**: Multi-agent framework operational with agents communicating in parallel
**Depends on**: Phase 1
**Requirements**: ORCH-01
**Success Criteria** (what must be TRUE):
  1. Agent orchestrator can spawn and coordinate multiple agents in parallel
  2. Agents can pass structured data between each other
  3. Orchestrator handles agent failures gracefully (timeout, retry, fallback)
  4. A test case flows through the orchestration pipeline end-to-end (even with stub agents)
**Research**: Likely — Google GenAI SDK patterns for multi-agent coordination
**Research topics**: Google GenAI SDK multi-agent patterns, parallel agent execution, inter-agent communication protocols
**Plans**: TBD

### Phase 3: Document Processing
**Goal**: Real documents processed via OCR with structured data extracted and confidence scored
**Depends on**: Phase 2
**Requirements**: ORCH-02, DOC-01, DOC-02, DOC-04
**Success Criteria** (what must be TRUE):
  1. Mistral OCR processes uploaded passport/ID images and returns text
  2. Structured data (name, DOB, address, document number) extracted from OCR output
  3. Each extracted field has a confidence score
  4. Document Processor agent integrates into the orchestration pipeline
**Research**: Likely — Mistral OCR API integration, structured extraction patterns
**Research topics**: Mistral OCR API docs, document type detection, structured extraction with Gemini
**Plans**: TBD

### Phase 4: Sanctions & Identity Screening
**Goal**: Real sanctions list screening and identity verification working as agents
**Depends on**: Phase 2
**Requirements**: ORCH-03, ORCH-04, DOC-03
**Success Criteria** (what must be TRUE):
  1. UN Security Council sanctions list loaded and searchable
  2. OFAC SDN list loaded and searchable
  3. Identity Verifier agent cross-references extracted data against verification sources
  4. Sanctions Screener agent returns match/no-match with confidence and evidence links
  5. PEP (Politically Exposed Person) screening produces categorized results
**Research**: Likely — OFAC/UN sanctions list formats, fuzzy name matching
**Research topics**: OFAC SDN list API/download format, UN sanctions list format, fuzzy name matching algorithms for sanctions screening
**Plans**: TBD

### Phase 5: Risk Scoring & Case Narrative
**Goal**: Risk scores aggregated from all agents, human-readable case narratives generated
**Depends on**: Phase 3, Phase 4
**Requirements**: ORCH-05, ORCH-06
**Success Criteria** (what must be TRUE):
  1. Risk Scorer agent aggregates signals from Document Processor, Identity Verifier, and Sanctions Screener
  2. Composite risk score calculated with weighted factors and confidence level
  3. Case Narrator agent generates a clear, readable risk assessment narrative
  4. Narrative includes linked evidence (which document, which sanctions list, which verification)
**Research**: Unlikely — standard LLM reasoning + aggregation
**Plans**: TBD

### Phase 6: Dashboard Core
**Goal**: Compliance officer can view cases, review risk profiles, and make decisions
**Depends on**: Phase 1
**Requirements**: DASH-01, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. Case queue displays pending, in-review, and completed cases with status indicators
  2. Risk profile view shows synthesized assessment with drill-down into evidence
  3. Officer can Approve, Deny, or Escalate with mandatory justification field
  4. Decision is recorded and case status updates immediately
**Research**: Unlikely — standard Next.js + shadcn dashboard patterns
**Plans**: TBD

### Phase 7: Agent Visualization
**Goal**: Real-time visualization of agents processing, maximum UI polish
**Depends on**: Phase 6
**Requirements**: DASH-02, DASH-06
**Success Criteria** (what must be TRUE):
  1. Each agent's processing status visible in real-time (pending → running → complete/error)
  2. Parallel agent execution visually represented (multiple agents working simultaneously)
  3. Smooth animations and transitions throughout the dashboard
  4. Professional, polished UI that looks like a real compliance platform (not a prototype)
**Research**: Unlikely — Framer Motion / CSS animations with shadcn
**Plans**: TBD

### Phase 8: Case Lifecycle Integration
**Goal**: Complete end-to-end flow from document upload to decision, with error handling
**Depends on**: Phase 5, Phase 6, Phase 7
**Requirements**: CASE-01, CASE-02, CASE-03
**Success Criteria** (what must be TRUE):
  1. Upload documents → agents activate in parallel → risk profile populates → officer reviews → decision recorded → audit complete
  2. Processing shows realistic delays (agents appear to work, not instant)
  3. Low-confidence results route to manual review instead of auto-processing
  4. Error states handled gracefully (OCR failure, API timeout) with clear user feedback
**Research**: Unlikely — integration work
**Plans**: TBD

### Phase 9: Regulatory & Audit Trail
**Goal**: Full regulatory compliance with audit logging and human-in-the-loop enforcement
**Depends on**: Phase 8
**Requirements**: REG-01, REG-02, REG-03, REG-04, DASH-05
**Success Criteria** (what must be TRUE):
  1. Every agent action logged with timestamp, input, output, and confidence
  2. Every human decision logged with timestamp, officer ID, justification, and outcome
  3. AI cannot make final account decisions — approve/deny buttons only available to human
  4. STR filing workflow clearly marked as human-only with regulatory context
  5. Audit trail exportable/viewable for compliance review
**Research**: Unlikely — logging and UI enforcement
**Plans**: TBD

### Phase 10: Demo Polish & Deliverables
**Goal**: Deployed prototype with demo data, recorded demo video, and written explanation
**Depends on**: Phase 9
**Requirements**: DEPLOY-03, DELIV-01, DELIV-02, DELIV-03
**Success Criteria** (what must be TRUE):
  1. 3-5 realistic demo cases loaded (mix of clean, suspicious, and edge cases)
  2. Prototype deployed and accessible via public Vercel URL
  3. 2-3 minute demo video recorded showing full case lifecycle
  4. 500-word explanation covers: what human can do, what AI handles, where AI stops, what breaks at scale
**Research**: Unlikely — demo preparation and content creation
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Done | 2026-02-23 |
| 2. Agent Orchestration Core | 5/5 | Done | 2026-02-24 |
| 3. Document Processing | 6/6 | Done | 2026-02-24 |
| 4. Sanctions & Identity Screening | 0/TBD | Not started | - |
| 5. Risk Scoring & Case Narrative | 0/TBD | Not started | - |
| 6. Dashboard Core | 0/TBD | Not started | - |
| 7. Agent Visualization | 0/TBD | Not started | - |
| 8. Case Lifecycle Integration | 0/TBD | Not started | - |
| 9. Regulatory & Audit Trail | 0/TBD | Not started | - |
| 10. Demo Polish & Deliverables | 0/TBD | Not started | - |
