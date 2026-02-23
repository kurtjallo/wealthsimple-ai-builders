# AI-Native Workflow Rebuilds Outside Finance: Cross-Industry Inspiration

## Executive Summary

The most successful AI transformations share a common thread: they **rebuild workflows from scratch around AI capabilities** rather than bolting AI onto existing processes. This research examines the best examples across healthcare, legal, insurance, logistics, HR, real estate, cybersecurity, and creative industries to extract transferable design patterns for Wealthsimple's AI Builder role.

**Key insight**: The distinction between "AI-assisted" and "AI-native" is architectural, not cosmetic. AI-assisted adds a chatbot to an existing form. AI-native asks: "If AI were always a teammate, how would this workflow look if designed from zero?"

---

## 1. What Makes AI-Native Fundamentally Different from AI-Assisted

### The Architectural Divide

| Dimension | AI-Assisted (Bolt-On) | AI-Native (Foundation-First) |
|-----------|----------------------|------------------------------|
| **Architecture** | AI added as a layer on existing systems | AI is the foundational layer; every component optimizes for it |
| **Data Flow** | Data sent to external AI for processing | Data structures designed for ML from the start |
| **Decision Model** | AI recommends, human executes | AI acts autonomously within guardrails, human provides oversight |
| **Workflow Design** | Existing process + AI speed-up | Process reimagined assuming instant generation/analysis |
| **Integration** | API calls to AI services | AI woven into every step of the workflow |
| **Feedback Loop** | Manual evaluation | Continuous, built-in improvement cycles |
| **Performance** | Incremental gains (10-20%) | Step-change improvements (2-5x or more) |

Sources: StrikeGraph, Deloitte Tech Trends 2026

### The Grammarly Framework for AI-Native Redesign

Grammarly's enterprise research (2026) identified three defining shifts:

1. **Context over capability** -- Raw AI power matters less than understanding organizational context and desired outcomes
2. **Integration as gateway** -- AI must be embedded into existing workflows, not waiting for prompts; proactively supporting work where it happens
3. **Rebuild from assumption of instant generation** -- AI-native workflows start from the assumption that generation, summarization, and analysis can happen instantly, freeing people to focus on judgment, creativity, and lived experience

**Four-step audit process for leaders:**
- Audit for friction: map highest-volume workflows
- Audit for abstraction: find where teams discuss rather than do
- Explore new collaboration surfaces where AI flows naturally
- Start from zero: design as if AI were always a teammate

Source: Grammarly Enterprise AI Blog 2026

### Deloitte's "Great Rebuild" Principles (2026)

Deloitte's Tech Trends 2026 report formally named this shift "The Great Rebuild" and identified these patterns in winning organizations:

- **AI as core collaborator, not add-on** -- embedded partner in decision-making, operations, and product development
- **Business-first modernization** -- addressing real business problems, not technology for its own sake
- **Modularity and observability** -- architectures that enable seeing, understanding, and optimizing systems
- **Human-machine fusion** -- two-thirds of organizations are piloting AI agents in integrated teams
- **Adaptive governance** -- replacing slow periodic reviews with continuous, AI-assisted oversight that preserves speed
- **"Always beta" philosophy** -- perpetual evolution embedded into organizational DNA
- **Organizational flattening** -- structures flatten as AI absorbs routine execution

**Critical distinction**: "Value comes from process redesign, not process automation." Winners aren't layering onto broken processes; they're rebuilding operations from the ground up.

Source: Deloitte "The Great Rebuild: Architecting an AI-native tech organization" (2026)

---

## 2. Best Examples by Industry

### A. Legal: Harvey AI

**What they rebuilt**: The entire legal drafting, review, and analysis workflow.

**How it was done**:
- Created a **Workflow Builder** that uses four block types: user input, AI action, logic, and output
- Lawyers describe what they want in natural language OR use a no-code interface to connect blocks
- Supports conditionals, classification, branching logic, and multi-step workflows
- Firms can share purpose-built workflows and playbooks; clients generate first drafts with lawyer oversight
- Over **18,000 custom workflows** created since June 2025 launch

**Key design pattern -- "Architect, don't consume"**: Harvey explicitly positions this as the transition from an era where legal teams "consume AI" to one where they "architect it." The AI handles the 0-80% generation; lawyers provide the judgment for the final 20%.

**Result**: Lease summary production reduced from 3-4 hours to 3-4 minutes.

**Relevance to Wealthsimple**: Financial planning, tax optimization, and investment analysis could follow the same workflow builder pattern -- let advisors/users architect AI-driven financial workflows rather than just asking chatbot questions.

Sources: Harvey.ai Blog, Paul Weiss Partnership Announcement

### B. Legal: EvenUp

**What they rebuilt**: Personal injury claims processing from intake to resolution.

**How it was done**:
- Built a **Claims Intelligence Platform** that generates any document (medical summaries, complaints, demand letters, interrogatory responses) in minutes from case files
- **Mirror Mode**: first-of-its-kind feature that replicates a firm's best work across documents, matching style, structure, and tone from a winning draft
- **Smart Workflows**: automated rules determine when documents should be submitted based on case data
- AI drafts pull directly from case files and adapt to each firm's unique approach

**Key design pattern -- "Clone your best performer"**: Rather than generic AI output, Mirror Mode captures the institutional knowledge of top performers and scales it across all work.

**Result**: Firms tripled drafting output and cut settlement timelines by a month without adding headcount. Over 2,000 firms, 10,000+ cases processed weekly, $10B+ in settlements.

**Relevance to Wealthsimple**: The "clone your best advisor" pattern could transform financial planning -- capture top advisors' reasoning and scale it to every client interaction.

Sources: EvenUp Law, BusinessWire, Lightspeed Venture Partners

### C. Healthcare: Abridge

**What they rebuilt**: Clinical documentation from manual note-taking to ambient AI capture.

**How it was done**:
- AI listens to natural clinician-patient conversations and generates structured medical notes
- **Linked Evidence**: every AI-generated statement is traceable to the source conversation, enabling easy verification
- Designed to fit into how care teams already work, not requiring behavior change
- Extending beyond documentation to downstream workflows: coding, risk adjustment, prior authorization, nursing workflows

**Key design pattern -- "Ambient capture + linked provenance"**: The AI is invisible during the core interaction (doctor-patient conversation) but creates a complete, traceable artifact afterward. Trust is built through transparent sourcing.

**Result**: Adopted by Kaiser Permanente, Mayo Clinic, Johns Hopkins, Emory Healthcare. Six years of clinical AI refinement.

**Relevance to Wealthsimple**: Client-advisor conversations could be ambient-captured, generating financial plans with linked evidence to specific client statements, market data, and regulatory requirements.

Sources: Abridge.com, Fierce Healthcare, Contrary Research

### D. Healthcare: CodaMetrix

**What they rebuilt**: Medical billing/coding from manual human review to autonomous AI processing.

**How it was done**:
- ML, deep learning, and NLP continuously learn from clinical evidence in the EHR
- Automatically extracts data from documentation, assigns medical codes, runs quality assurance
- Creates a longitudinal patient view, coding at the first opportunity so no data is left behind
- Integrates directly with EHR systems and billing software

**Key design pattern -- "Autonomous processing with quality gates"**: The system doesn't assist human coders; it replaces the manual coding step entirely while maintaining quality through automated checks and continuous learning.

**Result**: 60% reduction in claims denials, 50% savings on coding costs.

**Relevance to Wealthsimple**: Tax categorization, transaction classification, and compliance checks could follow this autonomous-with-quality-gates pattern.

Sources: CodaMetrix.com, AVIA Marketplace

### E. Insurance: Lemonade

**What they rebuilt**: The entire insurance lifecycle -- from sign-up to claims processing.

**How it was done**:
- Built AI-native from inception (not retrofitted)
- **AI Maya** handles customer service and sign-ups through conversational interface
- **AI Jim** automates claims: assesses submitted information, cross-references policy details, runs anti-fraud checks
- Claims process is entirely reimagined: submit claim via app, AI processes, pays out -- no human agent needed for straightforward claims

**Key design pattern -- "AI-first business model"**: Lemonade didn't automate an insurance company; they built an insurance company where AI IS the operating system. The entire business model (low overhead, fast payouts, transparent pricing) only works because AI is foundational.

**Result**: World record 2-second claim settlement. ~40% of claims processed instantly by AI. 25% improvement in processing speed.

**Relevance to Wealthsimple**: The purest example of "rebuild from scratch" -- Lemonade proves that AI-native companies can fundamentally change the economics and user experience of a regulated financial industry.

Sources: Lemonade.com, AI Magazine, Volt Equity, Claims Journal

### F. Customer Service: Sierra AI (Bret Taylor)

**What they rebuilt**: Enterprise customer experience from ticket-based support to conversational AI agents.

**How it was done**:
- Founded on the thesis that every company's primary digital interface will be an AI agent
- AI agents are the "atomic unit of enterprise software" -- just as websites defined web and apps defined mobile
- Focus on vertical specialists with deep domain expertise, not general-purpose bots
- Consistency designed into the system rather than depending on individual heroics

**Key design pattern -- "Outcomes-based pricing"**: Sierra charges only when the AI agent autonomously resolves an issue. If escalation to a human is needed, it's free. This aligns incentives perfectly and fundamentally changes the business model of customer service.

**Result**: $4.5B valuation. Growing rapidly with enterprise customers.

**Relevance to Wealthsimple**: Outcome-based pricing for AI advisory services could be transformative -- charge based on portfolio performance or goals achieved rather than AUM.

Sources: Sierra.ai, TechCrunch, Sequoia Capital Podcast, Pigment Perspectives

### G. Customer Service Cautionary Tale: Klarna

**What happened**: Klarna's AI assistant handled 2.3M conversations/month (2/3 of all service), equivalent to 700 agents. Resolution in 2 minutes vs. 11 minutes. 25% fewer repeat inquiries.

**The reversal**: By May 2025, Klarna reversed course -- CEO acknowledged AI produced "lower quality" output. Resumed hiring human agents.

**Current approach**: Hybrid model with AI handling 2/3 of inquiries but humans handling quality-sensitive interactions. "Uber-style" flexible workforce.

**Key lesson**: Pure AI replacement without quality feedback loops degrades over time. The AI-native approach requires human-in-the-loop for quality calibration, not just automation. Speed without quality is a losing proposition.

**Relevance to Wealthsimple**: Financial advice requires even higher quality standards than customer service. The hybrid model (AI handles routine, humans handle complex/sensitive) is essential in regulated finance.

Sources: Klarna.com, OpenAI, CX Dive, Entrepreneur

### H. Real Estate: Opendoor

**What they rebuilt**: Home buying/selling from agent-dependent process to AI-powered marketplace.

**How it was done**:
- AI-powered pricing intelligence engine trained on millions of photos, agent notes, and home visit records
- "Cash offer" and "Cash Plus" hybrid models powered by AI valuation
- Key Agent app creates a data flywheel: agent assessments feed back into the AI, improving predictions
- Conversion rates 2x traditional flows

**Key design pattern -- "Data flywheel"**: Every transaction, every agent assessment, every photo improves the AI. The more the system is used, the better it gets, creating a compounding competitive advantage.

**Relevance to Wealthsimple**: Investment recommendations could follow this flywheel -- every user action, market outcome, and portfolio adjustment improves the AI for all users.

Sources: Yahoo Finance, Nasdaq, FinancialContent

### I. Enterprise Knowledge: Glean

**What they rebuilt**: Enterprise search and knowledge management from keyword search to AI-powered understanding.

**How it was done**:
- Built on a knowledge graph powered by RAG (Retrieval-Augmented Generation)
- Searches across 100+ tools in one place with real-time, permissions-aware results
- Autonomous agents that interpret instructions, make decisions, adapt, and communicate reasoning
- No rigid workflows or low-level scripting -- agents figure out how to accomplish goals

**Key design pattern -- "Universal knowledge layer"**: Instead of building AI into individual tools, Glean creates a unified intelligence layer that spans all enterprise tools, maintaining context and permissions.

**Relevance to Wealthsimple**: A unified knowledge layer across all financial data (accounts, tax records, market data, regulatory rules) could power truly holistic AI-native financial planning.

Sources: Glean.com, TechCrunch, Geodesic Capital

### J. Logistics: Flexport + FourKites

**What they rebuilt**: Supply chain management from manual tracking to AI-orchestrated logistics.

**Flexport's approach**:
- Flexport Intelligence: natural language queries about supply chain performance
- Control Tower: real-time visibility across entire logistics network, even freight not managed by Flexport
- AI Voice Agents deployed for carrier operations

**FourKites' approach**:
- Evolution from visibility platform to AI-enabled orchestration
- "Digital Workers" handle unstructured chaos: messy emails, inconsistent formats, partner quirks
- AI agents reduce manual tasks by up to 95%

**Key design pattern -- "Tame the unstructured"**: The biggest AI-native wins in logistics come from handling the messy, unstructured data that humans previously had to interpret manually.

**Relevance to Wealthsimple**: Financial data is full of unstructured chaos -- transaction descriptions, tax documents, scattered account statements. AI-native financial tools should tame this unstructured data automatically.

Sources: Flexport Press Release, FourKites Blog, Logistics Viewpoints

### K. HR: Rippling

**What they rebuilt**: The entire employee lifecycle as a unified, automated flow.

**How it was done**:
- Approving headcount instantly opens requisitions
- Offboarding jumpstarts backfills
- Signing an offer triggers full onboarding automatically
- AI-powered candidate identification, interview scheduling, and feedback summarization
- Interview feedback flows directly into offer letters and onboarding workflows

**Key design pattern -- "Event-driven lifecycle automation"**: Every HR event triggers a cascade of automated actions. No human needs to remember the next step -- the system drives the workflow forward.

**Relevance to Wealthsimple**: Client lifecycle events (new account, life change, tax season, retirement) could trigger cascading automated financial workflows.

Sources: Rippling.com, Best AI HR Source

### L. Cybersecurity: Wiz

**What they rebuilt**: Security operations from reactive alert handling to AI-orchestrated investigation.

**How it was done**:
- AI collapses the gap between detection, investigation, and remediation
- Automatically collects evidence, builds narratives, and grounds fixes in real code
- "Agentic Security" with AI agents conducting initial triage and investigation
- Wiz Remote MCP Server exposes the Security Graph through Model Context Protocol
- AI isn't a separate destination -- it's woven into how teams build, secure, and operate

**Key design pattern -- "Collapse the workflow stages"**: Instead of detect -> alert -> investigate -> decide -> remediate as separate stages, AI collapses these into a continuous, near-instantaneous flow.

**Relevance to Wealthsimple**: Financial monitoring could collapse detect -> alert -> analyze -> decide -> act into a continuous AI-driven flow for portfolio rebalancing, risk management, and compliance.

Sources: Wiz.io, AWS Machine Learning Blog

### M. Creative: Runway ML

**What they rebuilt**: Video production and post-production workflows.

**How it was done**:
- Text-to-video generation replaces weeks of traditional production
- Workflows give granular control over every step with customizable pipelines
- Templates for consistent team-wide production
- Audio generation nodes (Text to Speech, SFX, Voice Dubbing) integrated into visual pipelines

**Key design pattern -- "Composable AI pipelines"**: Users chain AI capabilities together like building blocks, creating custom creative workflows. Each node is AI-powered, and the pipeline is AI-orchestrated.

**Relevance to Wealthsimple**: Financial analysis, reporting, and client communication could be built as composable AI pipelines -- chain data analysis, insight generation, visualization, and personalized delivery.

Sources: RunwayML.com, Simplify AI Tools

---

## 3. Emerging Design Patterns for AI-Native Workflow Rebuilds

From analyzing these examples, seven core patterns emerge:

### Pattern 1: "Start from Zero"
**Principle**: Design the workflow as if it were being created today with AI as a given, not as an optimization of an existing process.
**Examples**: Lemonade (insurance), Grammarly's framework, Sierra AI
**Anti-pattern**: Klarna initially (replace humans with AI without redesigning the workflow)

### Pattern 2: "Ambient Capture + Linked Provenance"
**Principle**: AI operates invisibly during the core interaction, capturing everything, then produces traceable artifacts afterward.
**Examples**: Abridge (clinical conversations), Harvey (legal document analysis)
**Application to finance**: Client conversations generate financial plans with every recommendation linked to specific client statements, market data, and regulatory requirements

### Pattern 3: "Clone Your Best Performer"
**Principle**: Capture institutional knowledge from top performers and scale it across the organization through AI.
**Examples**: EvenUp (Mirror Mode), Harvey (Shared Workflows)
**Application to finance**: Best advisors' reasoning patterns, portfolio construction approaches, and client communication styles become the baseline for all AI-generated outputs

### Pattern 4: "Autonomous Processing with Quality Gates"
**Principle**: AI handles end-to-end processing autonomously but passes through automated quality checkpoints. Humans intervene only on exceptions.
**Examples**: CodaMetrix (medical coding), Lemonade (claims processing), FourKites (logistics)
**Application to finance**: Tax optimization, rebalancing, and compliance checks run autonomously with automated quality gates and human review only for edge cases

### Pattern 5: "Data Flywheel"
**Principle**: Every interaction improves the system. Usage begets better AI, which begets more usage.
**Examples**: Opendoor (pricing intelligence), Wiz (security graph), Glean (knowledge graph)
**Application to finance**: Every portfolio decision, market outcome, and client feedback improves the AI for all users

### Pattern 6: "Collapse the Workflow Stages"
**Principle**: Stages that were sequential become simultaneous or near-instantaneous. Detection, analysis, decision, and action merge.
**Examples**: Wiz (security operations), Rippling (HR lifecycle), Harvey (legal drafting)
**Application to finance**: Portfolio monitoring, analysis, decision, and rebalancing become a continuous, near-real-time process instead of periodic reviews

### Pattern 7: "Outcome-Based Value Model"
**Principle**: Pricing and value measurement shift from time/effort to outcomes achieved.
**Examples**: Sierra AI (pay per resolution), Lemonade (instant payouts reduce cost)
**Application to finance**: Advisory fees based on financial outcomes achieved rather than assets under management or transactions completed

---

## 4. What Makes the Best AI-Native Rebuilds Succeed

### They solve for the full workflow, not just one step
The best examples (Harvey, Rippling, Lemonade) reimagine the entire end-to-end process, not just the most painful step. Optimizing one step in a broken workflow just moves the bottleneck.

### They build trust through transparency
Abridge's Linked Evidence, Harvey's source citations, and Wiz's reasoning narratives all share a pattern: the AI shows its work. In regulated industries (healthcare, legal, finance), this is non-negotiable.

### They make AI invisible to the end user
Abridge's ambient capture, Rippling's event-driven automation, and Lemonade's conversational claims process all hide the AI complexity. The user interacts naturally; the AI does the heavy lifting behind the scenes.

### They create compounding advantages through data flywheels
Opendoor, Glean, and Wiz all get better with every interaction, creating defensible moats that grow over time. Static AI implementations eventually become commoditized.

### They maintain human judgment for high-stakes decisions
Even Lemonade (the most automated example) keeps humans in the loop for complex claims. Klarna's reversal proves that pure AI replacement without quality loops degrades. The right model: AI handles the 0-80%, humans provide the judgment for the final 20%.

### They align business models with AI capabilities
Sierra's outcome-based pricing, Lemonade's low-overhead model, and CodaMetrix's cost-per-claim all show that AI-native isn't just a technology shift -- it enables entirely new business models.

---

## 5. Implications for Wealthsimple AI Builder Projects

### Most Transferable Patterns

1. **Harvey's Workflow Builder for Finance**: Let users architect multi-step financial workflows (tax planning, estate planning, retirement analysis) with AI handling each step and human judgment at decision points

2. **Abridge's Ambient Capture for Client Conversations**: AI listens to advisor-client conversations and generates financial plans with linked evidence (client goals, market data, regulatory constraints)

3. **EvenUp's Mirror Mode for Advisory Quality**: Capture best advisors' reasoning and scale it to every client interaction, adapting to individual client context

4. **Lemonade's Full-Stack Reimagination**: Rebuild a specific financial workflow (e.g., claims, tax filing, account opening) entirely around AI, changing the economics and UX

5. **Wiz's Collapsed Stages for Portfolio Management**: Merge monitoring, analysis, decision, and action into a continuous AI-driven flow for portfolio management

6. **Rippling's Event-Driven Lifecycle**: Life events (marriage, new job, home purchase, retirement) automatically trigger cascading financial workflow adjustments

### Critical Success Factors

- **Transparency is non-negotiable in finance**: Every AI recommendation must show its reasoning and sources (like Abridge's Linked Evidence)
- **Hybrid model essential**: AI handles routine processing; human advisors handle complex/sensitive decisions (Klarna's lesson)
- **Regulatory compliance by design**: Build compliance into the AI's core architecture, not as a bolt-on check (like CodaMetrix's autonomous-with-quality-gates)
- **Data flywheel creates defensibility**: Design for compounding improvement from day one

---

## Sources

- Harvey AI: https://www.harvey.ai/blog/introducing-workflow-builder
- EvenUp: https://www.evenuplaw.com/products/workflow-processes
- Abridge: https://www.abridge.com/product
- CodaMetrix: https://www.codametrix.com
- Lemonade: https://www.lemonade.com/blog/lemonades-claim-automation/
- Sierra AI: https://sierra.ai/about
- Klarna: https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/
- Opendoor: https://www.nasdaq.com/articles/opendoor-quietly-becoming-real-estates-ai-commerce-engine
- Glean: https://www.glean.com/product/overview
- Flexport: https://www.prnewswire.com/news-releases/flexport-unveils-20-tech-and-ai-powered-products-to-modernize-global-supply-chains-302383593.html
- FourKites: https://www.fourkites.com/fourkites-ai/agentic-ai/
- Rippling: https://www.rippling.com/platform/workflows
- Wiz: https://www.wiz.io/blog/wiz-ai-agents
- Runway ML: https://runwayml.com/workflows
- Grammarly Enterprise: https://www.grammarly.com/blog/enterprise-ai/rebuild-legacy-workflows/
- Deloitte Tech Trends 2026: https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/ai-future-it-function.html
- StrikeGraph AI-Native vs AI-Powered: https://www.strikegraph.com/blog/ai-native-vs-ai-powered
- Cohere: https://cohere.com/
