# Research Synthesis: Wealthsimple AI Builders Submission

## Context

**Deadline**: March 2, 2026
**Deliverables**: Working AI prototype + 2-3 min demo video + 500-word explanation
**Explanation must cover**: What the human can now do that they couldn't before; what AI is responsible for; where AI must stop; what would break first at scale

---

## Key Insights Across All Research

### What Wealthsimple Values (Non-Negotiable Alignment)
1. **"AI changes the how, not the why"** -- They explicitly reject AI for AI's sake
2. **Domain understanding over tool expertise** -- CTO Diederik van Liere: "The most valuable skill isn't expertise in a specific tool or framework. It's a deep understanding of the problem spaces we work in"
3. **Simplicity wins** -- They celebrate code deletion in an "unshipping Slack channel"
4. **Maker-owner mentality** -- Identify problem, build solution, own outcome end-to-end
5. **Business alignment over SOTA chasing** -- They went through their own AI hype cycle and came out valuing pragmatic impact
6. **Ship it** -- Bias toward execution, working product over perfect plan

### What Other Applicants Will Build (Avoid These)
- **Tier 1 (100+ identical submissions)**: Financial chatbots, RAG over documents, portfolio analyzers
- **Tier 2 (30-80 similar)**: Expense trackers, stock sentiment analyzers, fraud detection
- **Critical**: Wealthsimple already has Willow (AI chatbot) and 30+ ML models doing fraud/recommendations. Building toy versions of their existing products signals zero research.

### Regulatory Constraints (Must Demonstrate Awareness)
- **Investment suitability determinations MUST remain human** -- CIRO requires "sound professional judgment" by an Approved Person
- **OSFI E-23 flags agentic AI executing material transactions** as systemic risk
- **Human-in-the-loop required** for: suitability decisions, STR filing, high-impact consumer decisions
- **AI CAN handle**: KYC document verification, transaction monitoring, research generation, tax optimization within parameters, customer onboarding

### Design Patterns That Win (From Cross-Industry AI-Native Rebuilds)
- **Augment, don't replace** -- Morgan Stanley (98% advisor adoption), Bloomberg, JPMorgan COiN
- **Clone your best performer** -- EvenUp's Mirror Mode, Harvey's Workflow Builder
- **Ambient capture + linked provenance** -- Abridge (clinical docs with traceable sources)
- **Autonomous processing with quality gates** -- CodaMetrix, Lemonade
- **Collapse workflow stages** -- Wiz (detect + analyze + decide + act become continuous)
- **Cautionary tale**: Klarna replaced humans wholesale, quality degraded, had to rehire

---

## Top 3 Project Recommendations

### #1 RECOMMENDATION: AI-Powered KYC/AML Operations Orchestrator

**What it does**: A multi-agent system that orchestrates the entire KYC/AML workflow -- from document intake and identity verification through risk scoring and compliance checks -- reducing what currently takes days of manual back-and-forth to minutes of AI-orchestrated processing with human oversight at decision points.

**Why this wins**:
- **Differentiation**: Falls squarely in the "whitespace" -- almost no applicants will build operational/infrastructure tooling. Most will build consumer chatbots.
- **Impressiveness**: Multi-agent orchestration is the 2026 industry direction (Gartner: 40% of enterprise apps will feature AI agents by 2026). AWS reports 200-2000% productivity gains for agentic KYC/AML.
- **Feasibility (5 days)**: CrewAI or Claude Agent SDK for multi-agent orchestration + Mistral OCR for document processing + Claude Sonnet for reasoning/classification + Streamlit or Next.js for dashboard UI. Stack B from the tools research gets you there.
- **WS alignment**: Directly addresses their stated priorities -- they already use ML for "optimizing onboarding experiences" and fraud detection. This builds on their engineering blog themes. Shows systems thinking, not just API wrapping.
- **Regulatory savvy**: Demonstrates clear understanding of where AI can act autonomously (document verification, risk scoring, data extraction) and where humans must decide (STR filing, account freeze decisions, enhanced due diligence escalation). FINTRAC/PCMLTFA compliance awareness is a differentiator.
- **Demo-ability**: Visually compelling workflow -- show documents flowing in, agents processing in parallel, risk scores populating, human decision points clearly marked. The "before: 5 days / after: 15 minutes" contrast is powerful in a 2-min demo.

**Human's role**: Reviews AI-generated risk assessments, makes final approve/deny/escalate decisions, handles edge cases requiring judgment (complex corporate structures, PEP determinations). The human goes from "reading 50 pages of documents" to "reviewing a synthesized risk profile with linked evidence."

**What AI handles**: Document OCR and data extraction, identity verification against databases, sanctions/PEP screening orchestration, transaction pattern analysis, risk score generation, case narrative drafting, workflow routing.

**Critical human decision**: Whether to file a Suspicious Transaction Report -- this requires "reasonable grounds to suspect" which implies human assessment under FINTRAC rules.

**What breaks at scale**: Agent coordination complexity -- as the number of concurrent cases grows, orchestration latency and error propagation between agents become the bottleneck. Need robust error handling, retry logic, and circuit breakers. Also, OCR accuracy on non-standard documents degrades, requiring human fallback pipelines.

**Rough tech stack**:
- **LLM**: Claude Sonnet 4.6 (reasoning/classification) + Claude Haiku 4.5 (routing/triage)
- **Agents**: CrewAI (fastest to prototype multi-agent) or Claude Agent SDK
- **Document processing**: Mistral OCR + LlamaIndex for structured extraction
- **UI**: Next.js via v0 (polished dashboard) or Streamlit (faster)
- **Backend**: Supabase (DB + auth + vector search)
- **Deploy**: Vercel or Railway

---

### #2: AI Financial Life Event Orchestrator (Proactive, Event-Driven)

**What it does**: An AI system that detects major life events (job change, marriage, home purchase, new baby, approaching retirement) from financial data patterns and automatically generates a personalized action plan spanning all Wealthsimple products -- adjusting RRSP contributions, TFSA strategy, FHSA usage, insurance needs, tax implications, and portfolio allocation -- with the human approving each recommended action.

**Why this wins**:
- **Differentiation**: Novel paradigm -- proactive/agentic rather than reactive. Aligns with 2026 wealthtech predictions about "agentic AI that anticipates needs." Almost no applicants will think beyond the "user asks a question" model.
- **Impressiveness**: Demonstrates the "collapse workflow stages" pattern from Wiz and the "event-driven lifecycle" pattern from Rippling. Shows cross-product thinking that mirrors WS's own vision of "seamless product integration" (CEO Katchen's stated goal).
- **Feasibility (5 days)**: Simulate life events with synthetic data. Claude Sonnet for reasoning across financial scenarios. Single-agent with structured tool use. UI showing timeline of detected events -> generated plans -> approval workflow.
- **WS alignment**: CEO Katchen explicitly values "making products work together so the value of doing something with Wealthsimple gets better." This is exactly that. Addresses the "financial planning gaps" pain point (no holistic tool connecting all accounts). Democratizes advice currently gated at $100K+.
- **Regulatory fit**: Clean human-in-the-loop model -- AI generates recommendations, human approves. Suitability determination remains with the human. Explainable: every recommendation links to the detected event and specific financial reasoning.
- **Demo-ability**: Highly visual -- show a life event detected, watch cascading recommendations populate across products, human reviews and approves. The "before: scattered manual research across 5 products / after: unified action plan in seconds" is compelling.

**Human's role**: Confirms life event detection is accurate, reviews and approves/modifies each recommended action, makes final suitability judgment on investment changes.

**What AI handles**: Pattern detection in financial data (income changes, large deposits, new recurring payments), scenario modeling across tax/investment/savings products, generating personalized action plans with explanations, cross-product optimization calculations.

**Critical human decision**: Approving the investment reallocation and contribution strategy -- this is a suitability determination requiring human professional judgment under CIRO rules.

**What breaks at scale**: Life event detection accuracy -- false positives (detecting a "job change" from a one-time freelance payment) trigger unnecessary plans and erode trust. Needs a confidence scoring system and thresholds that improve with feedback. Also, cross-product optimization becomes computationally expensive as the number of products and tax scenarios grows.

**Rough tech stack**:
- **LLM**: Claude Sonnet 4.6 (scenario modeling and plan generation)
- **Agents**: Claude Agent SDK (structured tool use for financial calculations)
- **UI**: Next.js via v0 (timeline + approval workflow UI)
- **Backend**: Supabase (user data + event history)
- **Financial data**: Simulated Plaid-like data for demo
- **Deploy**: Vercel

---

### #3: AI Compliance Testing & LLM Evaluation Framework for Financial Services

**What it does**: A developer tool that automatically generates and runs compliance test suites against any LLM-powered financial service -- testing for regulatory violations (unsuitable recommendations, missing disclosures, PII leakage, hallucinated financial data), bias in financial advice, and factual accuracy of financial claims. Think "pytest for financial AI compliance."

**Why this wins**:
- **Differentiation**: Maximum whitespace -- virtually zero applicants will build developer infrastructure tooling. This targets Wealthsimple's engineering/ops teams as the audience rather than end consumers, which is the highest-differentiation strategy identified in the research.
- **Impressiveness**: Shows deep understanding of production AI challenges. Wealthsimple runs an LLM Gateway serving 500 daily users -- they need exactly this kind of tooling. Their AI strategy blog says "human-friendly codebases are AI-friendly codebases" -- this extends that to "well-tested AI is trustworthy AI."
- **Feasibility (5 days)**: Generate test scenarios programmatically (regulatory edge cases, PII injection attempts, hallucination probes). Run them against a target LLM endpoint. Score results. Display in a dashboard. The core is prompt engineering + evaluation logic + reporting UI.
- **WS alignment**: Directly references their engineering blog priorities. Shows engineering maturity and production thinking. Their LLM Gateway already has PII redaction -- this is the natural next step. Aligns with OSFI E-23's requirement for model validation and monitoring.
- **Regulatory fit**: IS the regulatory compliance tool. Demonstrates awareness of CSA 11-348, OSFI E-23, PIPEDA, and CIRO suitability rules by encoding them as test cases.
- **Demo-ability**: "Watch me find 12 compliance violations in Wealthsimple's hypothetical AI advisor in 30 seconds" -- then show the dashboard with categorized failures, severity scores, and remediation suggestions. The "red/green test results" UI is universally understood.

**Human's role**: Defines compliance rules and acceptable thresholds, interprets edge-case test results, decides whether flagged outputs are genuinely problematic or acceptable, updates test suites as regulations change.

**What AI handles**: Generating adversarial test prompts, evaluating LLM responses against compliance criteria, classifying violation types and severity, producing remediation suggestions, running regression test suites automatically.

**Critical human decision**: Determining the compliance threshold -- what level of accuracy/safety is "good enough" for production deployment. This is a judgment call that requires understanding both regulatory requirements and business risk tolerance.

**What breaks at scale**: Test coverage completeness -- the space of possible financial queries is infinite, so the test suite can never be truly comprehensive. Also, evaluation accuracy: using one LLM to judge another's compliance creates a recursive trust problem. At scale, you need human-validated ground truth sets that grow with each regulatory change.

**Rough tech stack**:
- **LLM**: Claude Sonnet 4.6 (test generation + evaluation)
- **Framework**: Python + pytest architecture (familiar to WS's engineering team)
- **Test generation**: Programmatic scenario builder + Claude for adversarial prompt generation
- **UI**: Streamlit (dashboard with test results, trends, drill-downs)
- **Backend**: Supabase (test history + results storage)
- **Deploy**: Railway or Streamlit Cloud

---

## Ranking Summary

| Criterion | #1 KYC/AML Orchestrator | #2 Life Event Orchestrator | #3 Compliance Testing Framework |
|-----------|------------------------|---------------------------|-------------------------------|
| **Impressiveness** | Very High -- multi-agent, real operational impact | High -- novel paradigm, cross-product | High -- infrastructure thinking, production-grade |
| **Feasibility (5 days)** | Medium-High -- CrewAI accelerates, OCR is mature | High -- single agent, simulation-friendly | Highest -- core is prompt eng + eval logic |
| **WS Alignment** | Very High -- operational tooling, blog themes | Very High -- CEO's product vision, client value | Very High -- engineering blog, LLM Gateway |
| **Differentiation** | Very High -- operational whitespace | High -- proactive paradigm is rare | Highest -- virtually zero competitors |
| **Demo Impact** | Very High -- visual workflow, clear before/after | High -- timeline UI, cascading recommendations | High -- red/green tests, violation dashboard |
| **Regulatory Depth** | Very High -- FINTRAC, PCMLTFA, E-23 | High -- suitability, cross-product compliance | Very High -- IS the compliance tool |
| **Overall Rank** | **1st** | **2nd** | **3rd** |

---

## Final Recommendation: Build #1 -- KYC/AML Operations Orchestrator

**Rationale**: It hits the highest combination of impressiveness, differentiation, WS alignment, and demo-ability. It shows:

1. **Systems thinking** -- multi-agent orchestration, not a single API call
2. **Domain understanding** -- deep awareness of KYC/AML workflows, FINTRAC requirements, and compliance constraints
3. **Production thinking** -- human-in-the-loop at the right decision points, error handling, audit trails
4. **Wealthsimple-specific awareness** -- references their ML models, onboarding optimization, and engineering blog priorities
5. **The "AI expands human capability" story** -- one compliance officer can now handle the volume that previously required a team, with better accuracy and full audit trails
6. **Clear regulatory boundaries** -- AI handles the cognitive drudgery (reading documents, cross-referencing databases), humans make the judgment calls (is this suspicious? should we file an STR?)

The demo video narrative writes itself: "A compliance officer gets a new account application. Instead of spending 4 hours manually reviewing documents, cross-referencing databases, and writing a risk assessment -- the AI orchestrator does it in 3 minutes, presenting a complete risk profile with linked evidence. The officer reviews, makes the decision, and moves to the next case. One person now handles what used to require a team."

---

## Demo Video Strategy

**Tool**: Screen Studio ($89) for polished-casual screen recording with auto-zoom
**Structure** (2:30 target):
```
[0:00-0:10]  HOOK: "KYC compliance takes 5 days and 95% of alerts are false positives.
              I built a system that does it in 3 minutes."
[0:10-0:25]  PROBLEM: Show the manual workflow -- scattered documents, multiple systems,
              back-and-forth emails
[0:25-0:40]  SOLUTION: "An AI orchestrator that coordinates document verification,
              identity checks, and risk scoring -- with humans making the final call"
[0:40-1:40]  LIVE DEMO: Walk through a complete case -- document upload -> agents
              processing in parallel -> risk profile generated -> human review interface
[1:40-2:00]  TECHNICAL DEPTH: 10-second architecture diagram showing agent coordination,
              5-second code snippet of the orchestration logic
[2:00-2:15]  RESULTS: "3 minutes vs 5 days. Zero missed sanctions matches.
              Full audit trail for regulators."
[2:15-2:30]  VISION: "This is what AI should do in finance -- handle the cognitive
              drudgery so humans can focus on judgment."
```

---

## 500-Word Explanation Framework

**What the human can now do**: A single compliance officer can process KYC/AML cases at 10x the volume with higher accuracy -- reviewing synthesized risk profiles with linked evidence instead of manually reading hundreds of pages across disconnected systems. They go from "document reader" to "risk decision-maker."

**What AI is responsible for**: Document OCR and data extraction, identity verification orchestration, sanctions/PEP screening, transaction pattern analysis, risk score calculation, case narrative generation, and workflow routing between specialized agents.

**Where AI must stop**: Filing Suspicious Transaction Reports (requires human "reasonable grounds to suspect" under FINTRAC), making final account approval/denial decisions (regulatory requirement for human judgment), handling enhanced due diligence for complex entity structures (requires human understanding of corporate relationships and beneficial ownership), and any decision that could deny a person access to financial services.

**What would break first at scale**: Agent coordination complexity -- as concurrent cases grow into thousands, the orchestration layer becomes the bottleneck. Error propagation between agents (e.g., OCR misread -> wrong risk score -> wrong routing) creates cascading failures. The fix is circuit breakers, human fallback pipelines, and confidence thresholds that route uncertain cases to manual review rather than letting errors compound.

---

## Tech Stack Summary (Chosen Project)

```
LLM:           Claude Sonnet 4.6 (reasoning) + Claude Haiku 4.5 (routing)
Agents:        CrewAI or Claude Agent SDK
Documents:     Mistral OCR ($0.001/page) + LlamaIndex for extraction
UI:            Next.js via v0 + Vercel AI SDK (polished dashboard)
Backend:       Supabase (PostgreSQL + pgvector + auth)
Deploy:        Vercel
Demo recording: Screen Studio
Estimated cost: $20-40 total
Timeline:       4-5 days
```

---

## Build Sequence (5-Day Plan)

**Day 1**: Core agent architecture -- define agents (Document Processor, Identity Verifier, Risk Scorer, Case Narrator), set up CrewAI/Claude SDK orchestration, get basic agent-to-agent communication working.

**Day 2**: Document processing pipeline -- Mistral OCR integration, structured data extraction with LlamaIndex, identity verification mock (simulate sanctions/PEP database lookups), risk scoring logic.

**Day 3**: Dashboard UI -- Next.js via v0 for the compliance officer's review interface. Case queue, risk profile view with linked evidence, approve/deny/escalate workflow, audit trail.

**Day 4**: Integration and polish -- Connect all agents end-to-end, handle error cases and edge cases, add confidence scores and human fallback routing, populate with realistic demo data.

**Day 5**: Demo video and written explanation -- Record with Screen Studio, practice script, film 3-5 takes, edit to 2:30. Write 500-word explanation. Deploy live demo to Vercel.

---

*Synthesis compiled from 10 research reports covering: Wealthsimple products & pain points, legacy financial workflows, standout AI submissions, available tools/APIs, regulatory constraints, real AI finance examples, WS engineering culture, differentiation analysis, AI-native workflow patterns, and demo video best practices.*
