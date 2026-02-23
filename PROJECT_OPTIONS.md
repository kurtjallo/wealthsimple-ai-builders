# Wealthsimple AI Builder - Project Options

**Deadline**: March 2, 2026 | **Build time**: ~5 days | **Budget**: $20-40 in API costs

---

## Option 1: AI-Powered KYC/AML Operations Orchestrator (Recommended)

**One-liner**: Multi-agent system that reduces KYC compliance from 5 days to 3 minutes.

**What it does**: Orchestrates document intake, identity verification, sanctions screening, risk scoring, and case narrative generation using specialized AI agents working in parallel. A compliance officer reviews a synthesized risk profile with linked evidence instead of reading hundreds of pages.

**Why it wins**:
- Maximum differentiation (almost no applicants build operational tooling)
- Multi-agent orchestration = 2026 industry direction
- Strong regulatory story (FINTRAC, PCMLTFA, OSFI E-23)
- Visually compelling demo with clear before/after
- References WS's engineering blog and stated priorities

**Human's role**: Reviews AI-generated risk assessments, makes approve/deny/escalate decisions, files STRs
**AI handles**: Document OCR, identity verification, sanctions/PEP screening, risk scoring, case narratives
**Critical human decision**: Whether to file a Suspicious Transaction Report (FINTRAC legal requirement)
**Breaks at scale**: Agent coordination complexity, OCR accuracy on non-standard docs

**Stack**: Claude Sonnet + CrewAI + Mistral OCR + Next.js (v0) + Supabase + Vercel
**Build time**: 4-5 days

---

## Option 2: AI Financial Life Event Orchestrator

**One-liner**: Detects life events from financial data and generates cross-product action plans.

**What it does**: Monitors financial patterns to detect major life events (job change, marriage, home purchase, new baby) and automatically generates a personalized action plan spanning RRSP, TFSA, FHSA, insurance, tax, and portfolio allocation. Human approves each action.

**Why it wins**:
- Novel proactive/agentic paradigm (most projects are reactive "ask a question" models)
- Aligns with CEO Katchen's vision of cross-product integration
- Democratizes advice gated behind $100K+ in assets
- Clean human-in-the-loop model

**Human's role**: Confirms life event detection, reviews/approves each recommended action
**AI handles**: Pattern detection, scenario modeling, cross-product optimization, plan generation
**Critical human decision**: Investment reallocation approval (CIRO suitability requirement)
**Breaks at scale**: Life event detection false positives erode trust

**Stack**: Claude Sonnet + Claude Agent SDK + Next.js (v0) + Supabase + Vercel
**Build time**: 3-4 days

---

## Option 3: AI Compliance Testing & LLM Evaluation Framework

**One-liner**: "pytest for financial AI" - automatically tests LLM outputs for regulatory violations.

**What it does**: Generates adversarial test suites against any LLM-powered financial service, checking for regulatory violations, unsuitable recommendations, PII leakage, hallucinated financial data, and bias. Displays results in a dashboard with severity scores and remediation suggestions.

**Why it wins**:
- Virtually zero applicants will build developer infrastructure tooling
- Directly targets WS's LLM Gateway (500 daily users)
- Shows production/engineering maturity
- Encodes actual regulations (CSA 11-348, OSFI E-23, CIRO) as test cases

**Human's role**: Defines compliance rules, interprets edge cases, sets deployment thresholds
**AI handles**: Test generation, response evaluation, violation classification, remediation suggestions
**Critical human decision**: What compliance threshold is "good enough" for production
**Breaks at scale**: Test coverage can never be comprehensive; LLM-judging-LLM creates recursive trust issues

**Stack**: Claude Sonnet + Python/pytest + Streamlit + Supabase + Railway
**Build time**: 2-3 days

---

## Comparison Matrix

| Criterion | #1 KYC/AML | #2 Life Events | #3 Compliance Testing |
|-----------|-----------|----------------|----------------------|
| Impressiveness | Very High | High | High |
| Feasibility | Medium-High | High | Highest |
| WS Alignment | Very High | Very High | Very High |
| Differentiation | Very High | High | Highest |
| Demo Impact | Very High | High | Medium-High |
| Regulatory Depth | Very High | High | Very High |

---

## Research Files

All supporting research is in `/research/`:
- `01_wealthsimple_products.md` - WS product suite, pain points, AI efforts
- `02_legacy_workflows.md` - 12 legacy financial workflows analyzed
- `03_standout_submissions.md` - What makes demos stand out, WS leadership views
- `04_ai_tools_apis.md` - Tech stack options, pricing, speed comparisons
- `05_regulatory_constraints.md` - Canadian fintech regulatory landscape
- `06_ai_finance_examples.md` - Real AI-in-finance case studies and patterns
- `07_ws_culture_tech.md` - WS engineering culture and hiring signals
- `08_differentiation_analysis.md` - What others will build, whitespace analysis
- `09_ainative_rebuilds.md` - AI-native workflow patterns across industries
- `10_demo_video_guide.md` - Demo video recording best practices

Full synthesis with build plans: `RESEARCH_SYNTHESIS.md`
