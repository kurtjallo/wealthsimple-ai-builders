# KYC/AML Operations Orchestrator

## What This Is

A multi-agent AI system that orchestrates the entire KYC/AML compliance workflow — from document intake and identity verification through sanctions screening, risk scoring, and case narrative generation. A compliance officer reviews a synthesized risk profile with linked evidence instead of reading hundreds of pages. Built as a submission for the Wealthsimple AI Builders program.

## Core Value

One compliance officer processes KYC cases in 3 minutes instead of 5 days, with higher accuracy and a full audit trail — AI handles the cognitive drudgery, humans make the judgment calls.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Agent Orchestration**
- [ ] Multi-agent system using Claude Agent SDK with specialized agents working in parallel
- [ ] Document Processor agent: Mistral OCR for real document extraction, structured data output
- [ ] Identity Verifier agent: Cross-reference extracted identity data against verification sources
- [ ] Sanctions Screener agent: Screen against real sanctions lists (UN, OFAC) and PEP databases
- [ ] Risk Scorer agent: Aggregate signals from all agents into a composite risk score with confidence levels
- [ ] Case Narrator agent: Generate human-readable risk assessment narrative with linked evidence

**Document Processing (Max Realism)**
- [ ] Real OCR via Mistral OCR API on actual documents (passports, utility bills, corporate docs)
- [ ] Structured data extraction from OCR output (name, DOB, address, document numbers)
- [ ] Real sanctions list integration (UN Security Council, OFAC SDN list)
- [ ] Confidence scoring on all extracted data points

**Compliance Officer Dashboard (Maximum Polish)**
- [ ] Case queue showing pending, in-review, and completed cases
- [ ] Real-time agent status visualization — show each agent processing in parallel with live updates
- [ ] Risk profile view with synthesized assessment, linked evidence, and drill-down capability
- [ ] Approve / Deny / Escalate decision workflow with mandatory justification
- [ ] Audit trail logging every agent action and human decision
- [ ] Animations, transitions, and professional UI via v0/shadcn — this IS the demo

**Full Case Lifecycle (Demo Golden Path)**
- [ ] Upload documents -> agents activate in parallel (visible to user) -> risk profile populates -> officer reviews -> decision recorded -> audit trail complete
- [ ] Realistic processing delays showing agents working (not instant, not slow)
- [ ] Error states and confidence thresholds that route uncertain cases to manual review

**Regulatory Compliance**
- [ ] Clear human-in-the-loop at all decision points (approve/deny/escalate/STR filing)
- [ ] AI never makes final account decisions — always defers to human
- [ ] STR (Suspicious Transaction Report) filing remains exclusively human (FINTRAC requirement)
- [ ] Audit trail meets FINTRAC/PCMLTFA record-keeping requirements

### Out of Scope

- Real banking integrations or Plaid connections — simulated financial data only
- User authentication / multi-tenant — single-user demo
- Real identity verification APIs (Jumio, Onfido) — simulated with realistic responses
- Mobile responsive design — desktop dashboard only
- Batch processing / queue management at scale — demo handles individual cases
- Integration with real WS systems — standalone prototype
- Payment processing or account creation — compliance review workflow only

## Context

**Submission context**: Wealthsimple AI Builders program. Deadline March 2, 2026. Deliverables: working prototype + 2-3 min demo video + 500-word explanation. The explanation must cover: what the human can now do, what AI handles, where AI must stop, what breaks at scale.

**Why KYC/AML**: Falls in the "whitespace" — almost no applicants will build operational tooling. Most will build consumer chatbots or portfolio analyzers (which WS already has via Willow and 30+ ML models). Multi-agent orchestration is the 2026 industry direction. AWS reports 200-2000% productivity gains for agentic KYC/AML.

**WS alignment**: WS uses Claude/Anthropic internally, values domain understanding over tool expertise, celebrates code deletion, and prizes the maker-owner mentality. CTO: "The most valuable skill is deep understanding of the problem space." This project demonstrates systems thinking, regulatory depth, and production awareness.

**Regulatory landscape**: FINTRAC requires human judgment for STR filing ("reasonable grounds to suspect"). OSFI E-23 flags agentic AI executing material transactions. PCMLTFA mandates record-keeping. CIRO requires human suitability determinations. AI can legally handle: document verification, sanctions screening, risk scoring, case narrative generation.

**Demo narrative**: "A compliance officer gets a new account application. Instead of spending 4 hours manually reviewing documents — the AI orchestrator does it in 3 minutes, presenting a complete risk profile with linked evidence. The officer reviews, decides, and moves on."

## Constraints

- **Timeline**: 7 days to working prototype + demo video + written explanation (March 2, 2026 deadline)
- **Budget**: $20-40 in API costs total (Claude Sonnet, Mistral OCR, Supabase free tier, Vercel free tier)
- **Stack**: Claude Sonnet 4.6 (reasoning) + Claude Haiku 4.5 (routing) + Claude Agent SDK (orchestration) + Mistral OCR (documents) + Next.js/v0/shadcn (UI) + Supabase (backend) + Vercel (deploy)
- **Demo format**: 2-3 minute video recorded with Screen Studio, must show working product not slides
- **Single developer**: Solo build, Claude assists

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Claude Agent SDK over CrewAI | Native Claude integration, simpler dependency tree, tighter coupling with LLM | — Pending |
| Claude over Gemini for LLM | WS uses Claude internally — signals alignment with their stack | — Pending |
| Max realism (real OCR, real sanctions lists) | Proves the system actually works, not just a simulation. Stronger demo. | — Pending |
| Maximum UI polish | The dashboard IS the demo — real-time agent visualization, animations, transitions sell the story | — Pending |
| Next.js + v0/shadcn over Streamlit | Professional product feel vs. developer tool feel. Dashboard needs to look like a real compliance platform. | — Pending |
| Full case lifecycle as golden path | Shows the complete before/after transformation in one continuous flow | — Pending |

---
*Last updated: 2026-02-23 after initialization*
