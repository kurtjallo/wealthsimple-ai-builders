# Wealthsimple Engineering Culture, Tech Stack, and AI Strategy

## Executive Summary

Wealthsimple is a Canadian fintech company valued at CAD $10B with $100B+ AUA, profitable and scaling rapidly. Their engineering culture centers on six core values with a strong "maker-owner" mentality. They are deeply invested in AI across both internal productivity tooling and client-facing products. Their engineering org is consolidating from 150+ microservices down to ~15 domain-aligned services, reflecting a philosophy that **simplicity wins**. They value engineers who understand problem domains deeply over those with narrow tool expertise.

---

## 1. Core Company Values

From Wealthsimple's official culture manual, six foundational values guide everything:

1. **"The client, the client, the client"** - Obsessive focus on user experience. "If what we're working on isn't going to make things better for our clients, we're doing it wrong."
2. **"Ship it"** - Bias toward action over perfection. "Empowering people to move fast" and building excellence through iteration.
3. **"We are maker-owners"** - Every employee owns problems end-to-end. "There are no problems that aren't your problem."
4. **"Naive ambition"** - Ask "how can we do this?" not "can we?" Transformative work requires bold thinking and challenging the status quo.
5. **"Be human"** - Compassion, honesty, directness. "The best idea winning" matters more than personal credit.
6. **"Keep it simple"** - "Simple is better. Simple is hard, but it's our job." Applies to products, processes, and communication.

**Source**: [Wealthsimple Culture Manual](https://www.wealthsimple.com/en-ca/culture)

---

## 2. Engineering Culture Deep Dive

### What They Look For in Engineers

CTO Diederik van Liere is explicit: **"The most valuable skill isn't expertise in a specific tool or framework. It's a deep understanding of the problem spaces we work in, like payments, ledgers, and financial systems."**

Key traits they hire for:
- **Maker-owner mentality** combined with "naive ambition"
- Problem solvers, not task takers
- Engineers who want speed, autonomy, and vertical ownership
- People who make smart decisions about architecture, user impact, scope trade-offs
- Cross-functional collaborators (product, design, operations, compliance)

**Source**: [Beyond the Code: CTO Interview](https://engineering.wealthsimple.com/beyond-the-code-cto-diederik-van-liere-on-engineering-at-wealthsimple)

### How They Work

- **8-week planning cycles** with engineers involved early in discovery, often pitching ideas
- **Continuous Deployment** for most systems - "shortening time between when a developer makes a change and when a bug is found makes bugs cheaper and easier to fix"
- **Weekly release cycle** for mobile: Build Mon-Wed, Test Thu, Release Fri-Mon
- **Phased rollouts** - gradually release to user subsets each day
- **Dogfooding** - employees test nightly builds internally before public release
- **"Wealthsimple Presents"** - biannual live events showcasing new products, energizing teams
- **"Unshipping Slack channel"** - gamified celebration of code deletion and simplification

**Source**: [How Wealthsimple Ships New Features](https://engineering.wealthsimple.com/how-wealthsimple-ships-new-features), [Fearless Development](https://engineering.wealthsimple.com/fearless-development)

### Fearless Development Philosophy

- Distinguish between **reversible and irreversible decisions** - don't over-analyze reversible ones
- **Timeboxing**: allocate fixed time to explore uncertain approaches, discard if unsuccessful
- **Active production monitoring**: 15-20 minutes watching dashboards, logs, and devices after each deploy
- **Supportive incident culture**: responding to incidents is a learned skill, not something to fear
- "Fear is a good thing" when handling financial products - but focus on what you control

### Reliability Culture

- **Observability**: Datadog APM, SLOs, continuous monitoring
- **Incident response**: PagerDuty for alerts, Rootly for structured workflows in Slack
- **On-call rotation**: dozens of trained Incident Commanders, 24-hour shifts
- **SLO-driven**: Terraform framework for teams to create and monitor SLOs
- **Regular load testing**: simulate surges especially during "Market Open"
- **Post-incident retrospectives**: weekly review meetings sharing learnings across org

**Source**: [Building a Culture of Reliability](https://engineering.wealthsimple.com/building-a-culture-of-reliability-at-wealthsimple)

### Glassdoor Signal (4.2/5 stars, 83% recommend)

**Positives**: collaborative atmosphere, fair benefits, interesting projects, inclusive culture, small-enough teams for ownership, leadership approachable and open to new ideas, 4.4/5 for culture and values.

**Challenges**: work-life balance varies by team, pressure to ship fast, diversity gaps at senior levels (staff/principal engineers and management).

---

## 3. Tech Stack

### Backend
- **Ruby on Rails** (~50% of services)
- **Java/Kotlin** (~50% of services)
- **Python** (select teams, ML/data)
- **GraphQL** API layer
- **Temporal** for workflow orchestration

### Frontend
- **React** (TypeScript) - primary
- **Angular** (legacy, some areas)

### Infrastructure & DevOps
- **AWS** (primary cloud): RDS, Aurora, SQS, SNS, S3, EKS
- **Kafka** for event streaming
- **Datadog** for observability (APM, SLOs, monitoring)
- **PagerDuty** for incident management
- **Rootly** for incident workflows
- **Terraform** for infrastructure as code
- **NVIDIA A10G GPUs** on AWS for ML inference
- **NVIDIA Triton Inference Server** (99.999% uptime for ML models)

### Architecture Direction
- **Consolidating from ~150 microservices down to ~15 domain-aligned services** (already reduced to ~120 in 12-15 months)
- CTO van Liere: microservices "went through a similar hype cycle" - fewer, bigger services aligned to business domains work better
- Focus on proper data modeling (advocating return to Kimball/Inmon methodologies)

### Open Source
- 103 public repos on GitHub (github.com/wealthsimple)
- Primary languages: Ruby, TypeScript, JavaScript, Go, Python
- Focus areas: financial domain tools (SIN parser, bank account validators), developer infrastructure (Rubocop extensions, encryption gems, Backstage plugins)
- Many repos archived, indicating transition of public work

**Sources**: [StackShare](https://stackshare.io/wealthsimple/wealthsimple), [Himalayas Tech Stack](https://himalayas.app/companies/wealthsimple/tech-stack), [GitHub](https://github.com/wealthsimple)

---

## 4. AI Strategy - The Big Picture

### Internal AI Philosophy (Five First Principles)

1. **Engineering fundamentals remain paramount** - Critical thinking, problem-solving, and code comprehension stay essential despite AI capabilities
2. **"AI changes the 'how,' not the 'why'"** - Same rigor as any new tool; easy onboarding, accessible dev environments
3. **Human-friendly codebases are AI-friendly** - Clean code, coherent design, clear test outputs, good docs, informative logging help AI agents work effectively. Verbose test outputs caused AI agents to generate unrealistic solutions.
4. **Maker-owners mentality for AI** - Experimentation encouraged, developers try different tools and select what works
5. **Simplicity wins** - Don't use AI where grep or git commands suffice

**Source**: [Wealthsimple's Engineering AI Strategy](https://engineering.wealthsimple.com/wealthsimples-engineering-ai-strategy)

### AI Tooling Adoption (Internal)

| Tool/Platform | Status | Details |
|---|---|---|
| **LLM Gateway** | Production (since Apr 2023) | Internal platform, 500+ daily users, 72,000+ requests processed. Unified interface to OpenAI, Cohere, and others. PII redaction, audit trail. |
| **GitHub Copilot** | 85% adoption | 30% suggestion acceptance rate, 20% faster PR cycle times |
| **Cursor** | 50% onboarded | AI-powered code editor, used for major migration projects |
| **Zed, Cline, Aider** | Available via Gateway | Secure access through LLM Gateway |
| **Amazon Bedrock** | Select features | Added in 2024 refinements |
| **Self-hosted models** | Production | Llama, Mistral, OpenAI Whisper on internal infrastructure |
| **Boosterpack** | Internal tool | Personal assistant supporting private and company-wide knowledge bases |
| **RAG** | Production | Vector database-powered retrieval augmented generation |

### LLM Usage Breakdown
- **40%** code generation
- **30%** content generation
- **27%** information retrieval
- **80%** of LLM usage goes through the LLM Gateway
- **50%** of all employees use AI tools monthly
- **2,200+** messages sent daily across AI tools
- Nearly universal reports of productivity improvement

### Key Insight: Hype Cycle Evolution
At the beginning of 2024, the team felt they hit a low point in the LLM hype cycle. Not all bets paid off. They shifted from chasing state-of-the-art models to **focusing on business alignment** and higher-level trends. Users preferred a single integrated tool over fragmented alternatives. Tools are "most valuable when injected in the places you do work."

**Sources**: [QCon SF Talk by Mandy Gu](https://www.infoq.com/news/2024/11/qcon-sf-genai-productivity/), [LLM Gateway Blog](https://engineering.wealthsimple.com/get-to-know-our-llm-gateway-and-how-it-provides-a-secure-and-reliable-space-to-use-generative-ai)

---

## 5. AI in Practice - Key Projects

### AI-Powered Code Migrations
- Migrated legacy systems to Financial-Activity-Model (FAM) using Cursor
- Manual migrations: 1.5-2 months per activity
- AI-assisted migrations: **completed in days**
- Innovation: had AI document its own process, then converted docs into reusable 6-7 step templates
- Three-tier code review: developer, AI bot, human reviewer
- AI excelled at repetitive transformations, boilerplate, naming conventions
- Humans remained essential for complex business logic, multi-step workflows, edge cases

**Source**: [A Journey to AI-Powered Migrations](https://engineering.wealthsimple.com/a-journey-to-ai-powered-migrations)

### Machine Learning at Scale
- **30+ AI models** in production generating **247 million predictions/year**
- Applications: fraud detection, suspicious transaction analysis, onboarding optimization, institutional transfer routing
- Model deployment reduced from **months to 15 minutes** using NVIDIA AI inference platform
- Model developers can deploy without engineering support (ML-as-a-service)
- Uptime improved from 95% to **99.999%** with Triton Inference Server

**Source**: [NVIDIA Case Study](https://www.nvidia.com/en-us/customer-stories/machine-learning-models-and-inference/)

### Client-Facing AI: Willow Chatbot
- AI chatbot named "Willow" powered by Decagon (replaced Ada in Jan 2025)
- Handles **60-70%** of customer inquiries without human intervention
- Trained on curated help center documents (prevents hallucination)
- Natural language instruction understanding - managers tweak without coding
- Cannot access customer account info (security architecture constraint)
- Transparent escalation: tells users when it doesn't know, connects to humans
- Customers can request live agent anytime

**Source**: [Investment Executive](https://www.investmentexecutive.com/news/tech-roundup-how-wealthsimples-ai-chatbot-works/)

### AI Security
- Blog post on "AI-powered static analysis" for application security
- PII redaction model built in-house for the LLM Gateway
- Heuristics-based sensitive information detection
- Audit trail for all external data transmissions

---

## 6. Leadership Voices on AI

### Diederik van Liere (CTO)
- "We're at an inflection point where you can build products that truly impact millions of Canadians."
- "You can make and build more than you ever could before" with AI
- Bullish on AI transforming engineering from code writing to "higher-level problem solving"
- Emphasizes maintaining "the right guardrails to ensure product quality remains high and data remains secure"
- Predicts closer collaboration between engineering, product, and design with AI
- Future: integrated workspaces reducing tool fragmentation

### Mandy Gu (Senior Software Dev Manager, ML & Data Engineering)
- Led the LLM Gateway initiative and QCon SF 2024 talk
- Key lesson: tools are "most valuable when injected in the places you do work"
- Shifted from chasing SOTA models to business alignment
- Focus on practical productivity gains, not AI hype

### Sam Talasila (Head of Large Language Models)
- Oversees chatbot and client-facing AI strategy
- Pragmatic about AI limitations - chatbot restricted to curated information
- Exploring email automation but won't launch until quality meets standards

### Mike Katchen (CEO)
- Sees room for NLP and generative AI in research capabilities
- Any client-facing AI tools must "pass rigorous testing for accuracy" with "right safeguards"
- Acquired Fey (Montreal) for AI-powered investment research dashboard
- Vision: Wealthsimple as the only fintech combining investing, banking, tax, crypto, and mortgages

---

## 7. What This Means for the AI Builders Application

### What Wealthsimple Will Respond To

1. **Practical impact over technical flash** - They value business alignment and real user impact over impressive-but-impractical demos. They learned this from their own hype cycle experience.

2. **Maker-owner mentality** - Show you can identify a problem, build a solution, and own the outcome end-to-end. Don't wait for specifications.

3. **Simplicity** - "Simple is better. Simple is hard." A clean, focused solution beats an over-engineered one. They literally celebrate code deletion.

4. **Speed and iteration** - They ship weekly. Show you can move fast and iterate. A working prototype beats a perfect plan.

5. **Understanding their domain** - The CTO explicitly says domain understanding > tool expertise. Show you understand finance, payments, ledgers, client trust.

6. **AI with guardrails** - They care deeply about security, PII protection, hallucination prevention, and transparent AI limitations. Build with safety in mind.

7. **Human + AI collaboration** - Their AI migration project succeeded because humans handled complex logic while AI handled repetitive tasks. They don't want full automation - they want augmented humans.

8. **Client-centricity** - "The client, the client, the client." Everything traces back to making things better for their users.

### Red Flags to Avoid

- Over-engineered solutions without clear user benefit
- AI for AI's sake without business alignment
- Ignoring security/privacy in financial contexts
- Building things that are impressive technically but don't solve real problems
- Presenting work without clear ownership or end-to-end thinking
- Using AI where simpler tools would suffice (their own principle #5)

### Strongest Alignment Signals

- They built their own LLM Gateway before using it - shows they value infrastructure thinking
- They shifted from hype to pragmatism - they want to see mature AI thinking
- They value "naive ambition" - boldness in vision combined with practical execution
- The migration project shows they love when AI turns months of work into days
- Reliability and trust are non-negotiable in financial services

---

## 8. Hiring and Organizational Context

### Current Focus (2026)
- "Bold investments across Engineering organization"
- Growing teams within core pillars: **Banking, Investing, and Financial Operating System (FOS)**
- AI Experiences team: responsible for end-to-end AI-powered solutions in CX Operations
- Intern positions open for AI Experiences (Winter 2026)

### Key Engineering Leaders
| Name | Role | Focus |
|---|---|---|
| Diederik van Liere | CTO | Overall engineering vision, simplification, AI strategy |
| Dominique Simoneau-Ritchie | VP Engineering | Engineering org, diversity, talent |
| Mandy Gu | Senior SDM, ML & Data | LLM Gateway, ML infrastructure, AI productivity |
| Sam Talasila | Head of LLMs | Client-facing AI, chatbot, LLM applications |

### Company Vitals
- **Valuation**: CAD $10B (Oct 2025, $750M raise)
- **AUA**: $100B+ (doubled in one year)
- **Profitable** and growing
- **3M+ Canadian clients**
- **CIX Innovator of the Year 2026**
- Products: Investing, Banking, Tax, Crypto, Mortgages, Credit Card (300K waitlist)

---

## Key Takeaway

Wealthsimple wants builders who combine **bold vision with practical execution**, who **deeply understand the problem domain**, and who build **simple, secure, client-focused solutions** using AI as a force multiplier rather than a replacement. They have been through the AI hype cycle and come out the other side valuing **business-aligned, pragmatic AI** that makes real work faster and better. The winning submission will demonstrate exactly this mindset.
