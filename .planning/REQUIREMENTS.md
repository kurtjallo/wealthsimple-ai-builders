# Requirements: KYC/AML Operations Orchestrator

## Version: v1

### Agent Orchestration (ORCH)

- [v1] **ORCH-01**: Multi-agent system using Claude Agent SDK with specialized agents working in parallel
- [v1] **ORCH-02**: Document Processor agent — Mistral OCR for real document extraction, structured data output
- [v1] **ORCH-03**: Identity Verifier agent — cross-reference extracted identity data against verification sources
- [v1] **ORCH-04**: Sanctions Screener agent — screen against real sanctions lists (UN, OFAC) and PEP databases
- [v1] **ORCH-05**: Risk Scorer agent — aggregate signals into composite risk score with confidence levels
- [v1] **ORCH-06**: Case Narrator agent — generate human-readable risk assessment with linked evidence

### Document Processing (DOC)

- [v1] **DOC-01**: Real OCR via Mistral OCR API on actual documents (passports, utility bills, corporate docs)
- [v1] **DOC-02**: Structured data extraction from OCR output (name, DOB, address, document numbers)
- [v1] **DOC-03**: Real sanctions list integration (UN Security Council, OFAC SDN list)
- [v1] **DOC-04**: Confidence scoring on all extracted data points

### Dashboard UI (DASH)

- [v1] **DASH-01**: Case queue showing pending, in-review, and completed cases
- [v1] **DASH-02**: Real-time agent status visualization — each agent processing in parallel with live updates
- [v1] **DASH-03**: Risk profile view with synthesized assessment, linked evidence, and drill-down
- [v1] **DASH-04**: Approve / Deny / Escalate decision workflow with mandatory justification
- [v1] **DASH-05**: Audit trail logging every agent action and human decision
- [v1] **DASH-06**: Animations, transitions, and professional UI via v0/shadcn

### Case Lifecycle (CASE)

- [v1] **CASE-01**: Upload documents → agents activate in parallel → risk profile populates → officer reviews → decision recorded → audit trail complete
- [v1] **CASE-02**: Realistic processing delays showing agents working (not instant, not slow)
- [v1] **CASE-03**: Error states and confidence thresholds that route uncertain cases to manual review

### Regulatory Compliance (REG)

- [v1] **REG-01**: Human-in-the-loop at all decision points (approve/deny/escalate/STR filing)
- [v1] **REG-02**: AI never makes final account decisions — always defers to human
- [v1] **REG-03**: STR filing remains exclusively human (FINTRAC requirement)
- [v1] **REG-04**: Audit trail meets FINTRAC/PCMLTFA record-keeping requirements

### Deployment (DEPLOY)

- [v1] **DEPLOY-01**: Next.js application deployed to Vercel
- [v1] **DEPLOY-02**: Supabase backend (PostgreSQL + auth)
- [v1] **DEPLOY-03**: Demo data — realistic sample cases for demo video

### Deliverables (DELIV)

- [v1] **DELIV-01**: Working prototype accessible via URL
- [v1] **DELIV-02**: 2-3 minute demo video (Screen Studio)
- [v1] **DELIV-03**: 500-word explanation covering: what human can do, what AI handles, where AI stops, what breaks at scale

## Out of Scope (v2+)

- Real banking integrations or Plaid connections
- User authentication / multi-tenant
- Real identity verification APIs (Jumio, Onfido)
- Mobile responsive design
- Batch processing / queue management at scale
- Integration with real WS systems
- Payment processing or account creation

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ORCH-01 | Phase 2 | Pending |
| ORCH-02 | Phase 3 | Pending |
| ORCH-03 | Phase 4 | Pending |
| ORCH-04 | Phase 4 | Pending |
| ORCH-05 | Phase 5 | Pending |
| ORCH-06 | Phase 5 | Pending |
| DOC-01 | Phase 3 | Pending |
| DOC-02 | Phase 3 | Pending |
| DOC-03 | Phase 4 | Pending |
| DOC-04 | Phase 3 | Pending |
| DASH-01 | Phase 6 | Pending |
| DASH-02 | Phase 7 | Pending |
| DASH-03 | Phase 6 | Pending |
| DASH-04 | Phase 6 | Pending |
| DASH-05 | Phase 9 | Pending |
| DASH-06 | Phase 7 | Pending |
| CASE-01 | Phase 8 | Pending |
| CASE-02 | Phase 8 | Pending |
| CASE-03 | Phase 8 | Pending |
| REG-01 | Phase 9 | Pending |
| REG-02 | Phase 9 | Pending |
| REG-03 | Phase 9 | Pending |
| REG-04 | Phase 9 | Pending |
| DEPLOY-01 | Phase 1 | Pending |
| DEPLOY-02 | Phase 1 | Pending |
| DEPLOY-03 | Phase 10 | Pending |
| DELIV-01 | Phase 10 | Pending |
| DELIV-02 | Phase 10 | Pending |
| DELIV-03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26 ✓
- Unmapped: 0 ✓
