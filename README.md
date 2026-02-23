# KYC/AML Operations Orchestrator

A multi-agent AI system that reduces KYC compliance review from **5 days to 3 minutes**. Specialized agents handle document processing, identity verification, sanctions screening, risk scoring, and case narrative generation in parallel — while a compliance officer makes the final call.

Built for the [Wealthsimple AI Builders](https://www.wealthsimple.com/) program.

## How It Works

```
Document Upload
       |
       v
  +-----------+
  | Orchestrator |
  +-----+-----+
        |
   +----+----+----+
   |    |    |    |
   v    v    v    v
 [DOC] [ID] [SAN] [PEP]    <-- Agents run in parallel
   |    |    |    |
   +----+----+----+
        |
        v
  [Risk Scorer]              <-- Aggregates all signals
        |
        v
  [Case Narrator]            <-- Generates human-readable assessment
        |
        v
  Risk Profile + Evidence
        |
        v
  Compliance Officer          <-- Human makes the decision
  (Approve / Deny / Escalate)
```

**Before**: A compliance officer manually reviews hundreds of pages of documents, cross-references sanctions lists, and writes up their assessment. Takes 4+ hours per case.

**After**: The AI orchestrator processes everything in parallel, presents a synthesized risk profile with linked evidence, and the officer reviews and decides in minutes.

## Agents

| Agent | Role | Technology |
|-------|------|------------|
| **Document Processor** | OCR on passports, IDs, utility bills; extracts structured data with confidence scores | Mistral OCR |
| **Identity Verifier** | Cross-references extracted identity data against verification sources | Claude Sonnet |
| **Sanctions Screener** | Screens against real UN Security Council and OFAC SDN sanctions lists | Claude Sonnet + fuzzy matching |
| **Risk Scorer** | Aggregates all agent signals into a composite risk score (0-100) | Deterministic engine |
| **Case Narrator** | Generates a human-readable risk assessment narrative with linked evidence | Claude Sonnet |

## Tech Stack

- **LLM**: Claude Sonnet 4.6 via Claude Agent SDK
- **OCR**: Mistral OCR API
- **Frontend**: Next.js 15, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account (free tier)
- Anthropic API key
- Mistral API key

### Setup

```bash
# Clone the repo
git clone https://github.com/kurtjallo/wealthsimple-ai-builders.git
cd wealthsimple-ai-builders

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your API keys in .env.local:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ANTHROPIC_API_KEY
# - MISTRAL_API_KEY

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Design Decisions

**Human-in-the-loop by design.** AI never makes final account decisions. Approve, deny, and escalate actions are exclusively available to the compliance officer. STR (Suspicious Transaction Report) filing remains human-only per FINTRAC requirements.

**Real data, not simulations.** Documents are processed through actual Mistral OCR. Sanctions screening runs against real UN and OFAC lists. No mock APIs.

**Deterministic scoring.** The risk scoring engine is a pure function — same inputs always produce the same score. The LLM only generates the qualitative narrative, not the numbers. Fully auditable.

**Defense in depth for compliance.** Human-in-the-loop is enforced at three layers: UI (buttons disabled for AI), API (server-side guards reject unauthorized decisions), and audit (every action logged with timestamp, actor, and justification).

## Regulatory Compliance

- **FINTRAC/PCMLTFA**: Audit trail meets record-keeping requirements. STR filing is exclusively human.
- **OSFI E-23**: AI assists but never executes material decisions.
- **CIRO**: Human suitability determinations preserved.

## Project Structure

```
src/
  app/                    # Next.js app router
    api/                  # API routes (cases, agents, audit)
    dashboard/            # Compliance officer dashboard
  components/
    ui/                   # shadcn/ui components
    cases/                # Case queue, risk profile, decisions
    pipeline/             # Agent visualization components
    audit/                # Audit trail viewer
    layout/               # Dashboard shell, sidebar, header
  lib/
    agents/               # Agent implementations (orchestrator, processors)
    pipeline/             # Case processing pipeline
    audit/                # Audit logging system
    supabase/             # Database client and helpers
    demo/                 # Demo data seeding
  types/                  # TypeScript domain types
```

## License

MIT
