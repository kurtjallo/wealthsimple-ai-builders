# Fintech Regulatory Constraints for AI Systems in Canada

## Executive Summary

Canada's regulatory landscape for AI in financial services is evolving rapidly but remains fragmented across multiple regulators. The key takeaway: **investment suitability determinations are the critical decision that must remain human** -- Canadian securities law explicitly requires "sound professional judgment" by an Approved Person, and registrants cannot outsource this registerable activity to AI systems. This is the strongest, most clearly articulated regulatory constraint on AI autonomy in Canadian fintech.

---

## 1. OSFI Guideline E-23: Model Risk Management (Effective May 2027)

### What It Is
OSFI published its final Guideline E-23 on September 11, 2025, imposing comprehensive model risk management requirements on federally regulated financial institutions (FRFIs). This is the most significant Canadian regulatory development for AI in finance.

### Key Requirements
- **Principles-based approach**: Risk-based policies proportional to institution size and complexity
- **Full lifecycle governance**: Policies covering model development, validation, deployment, monitoring, and decommissioning
- **Explainability**: Models must be transparent and explainable; "black box" approaches require alternative controls
- **Human-in-the-loop**: Explicitly required for high-risk decisions, including trading models and autonomous AI
- **Board accountability**: Boards must actively question assumptions, allocate resources, and oversee high-impact AI use cases
- **Bias monitoring**: Must address model bias, fairness, and privacy risks
- **Multi-disciplinary teams**: Legal, ethics, and diverse functional expertise required

### Critical Constraint: Autonomous AI
OSFI explicitly flags that "the ability of agentic AI to execute material transactions without a human in the loop" is a potential contributor to systemic risk. FRFIs must have strong governance for autonomous decision-making and autonomous re-parametrization.

### The EDGE Framework (FIFAI)
OSFI, Department of Finance, and Global Risk Institute established four guiding principles:
- **Explainability**: Must be considered at model design; reasoning must be clear and comprehensible
- **Data**: Alignment of business and data strategies; data accuracy, consistency, completeness
- **Governance**: Holistic, clear roles, defined risk appetite, flexible as adoption matures
- **Ethics**: Context-dependent fairness; no universal definition -- requires ongoing assessment

**Source**: [OSFI Guideline E-23](https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/guideline-e-23-model-risk-management-2027) | [Blakes Analysis](https://www.blakes.com/insights/osfi-releases-final-guideline-e-23-for-model-risk-management-and-ai-use-by-frfis/) | [OSFI FIFAI Report](https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/financial-industry-forum-artificial-intelligence-canadian-perspective-responsible-ai)

---

## 2. OSFI-FCAC Joint Report on AI Risks (September 2024)

### Key Findings
- AI adoption among FRFIs: ~30% in 2019 -> 50% in 2023 -> projected 70% by 2026
- AI increasingly used for core functions: underwriting, claims, trading, liquidity management, credit risk, compliance
- Generative AI creates new cybersecurity attack vectors
- Third-party AI concentration risk (dependency on large tech firms)
- Model discrimination risk: AI bias can deny access to financial products

### Consumer Harm Risks Flagged
- Unintentional release of consumer data via LLMs customized on internal data
- Discriminatory bias in credit and pricing decisions
- Reduced transparency in automated decision-making

**Source**: [OSFI-FCAC Risk Report](https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/osfi-fcac-risk-report-ai-uses-risks-federally-regulated-financial-institutions) | [McMillan Analysis](https://mcmillan.ca/insights/ai-use-by-financial-institutions-osfi-and-fcac-recommendations-for-sound-risk-management/)

---

## 3. Securities Regulation: CSA and CIRO

### CSA Staff Notice 11-348 (December 2024)
The Canadian Securities Administrators issued guidance on AI in capital markets:
- **Technology-neutral**: Securities laws apply regardless of technology used
- **Human-in-the-loop**: Recommended for monitoring AI systems to ensure they operate as intended
- **Explainability**: Market participants should implement AI with high levels of explainability
- **Disclosure**: AI use affecting registerable services must be disclosed in registration filings
- Comment period closed March 31, 2025

### THE CRITICAL HUMAN DECISION: Suitability Determinations

**This is the single most important regulatory constraint for any AI system at Wealthsimple or similar firms.**

Under Canadian securities law (enforced by CIRO, formerly IIROC):
- **Suitability determinations cannot be outsourced to AI** -- they are "registerable activities" that require human judgment
- An Approved Person must use "sound professional judgment" to identify appropriate investments for each client
- KYC information gathering must amount to a **"meaningful interaction"** between client and registrant
- AI can assist with KYC research, data gathering, and making processes more efficient
- But the **final suitability determination must involve human judgment**
- Firms remain accountable for outcomes of AI-assisted processes
- Registrable activities cannot be outsourced to third-party AI service providers

### Why This Must Remain Human
1. **Legal requirement**: CIRO rules explicitly require human professional judgment for suitability
2. **Fiduciary-like duty**: The advisor-client relationship involves trust and personalized assessment
3. **Context AI cannot capture**: Life circumstances, emotional state, unstated goals, family dynamics
4. **Accountability**: A human must be answerable when advice goes wrong
5. **Liability**: No regulatory framework exists for AI-as-advisor liability
6. **Explainability**: Clients have the right to understand why specific investments were recommended

**Source**: [CSA Staff Notice 11-348](https://www.osc.ca/en/securities-law/instruments-rules-policies/1/11-348/csa-staff-notice-and-consultation-11-348-applicability-canadian-securities-laws-and-use-artificial) | [CIRO Suitability Guidance](https://www.ciro.ca/newsroom/publications/know-your-client-and-suitability-determination-retail-clients) | [Dentons Analysis](https://www.dentons.com/en/insights/articles/2024/december/19/canadian-securities-administrators-release-guidance)

---

## 4. Privacy: PIPEDA and the CPPA (Bill C-27)

### Current State: PIPEDA
- No express provisions for automated decision-making
- Principle-based and technology-neutral
- OPC guidance: profiling leading to unfair/discriminatory treatment is inappropriate under PIPEDA
- Organizations must be transparent about data collection and use

### Proposed: Bill C-27 / CPPA / AIDA (Terminated but Influential)
Bill C-27 was terminated when Parliament was prorogued on January 5, 2025. However, its themes will shape future regulation:

**Consumer Privacy Protection Act (CPPA) would have required:**
- General account of use of automated decision systems (publicly available)
- Explanation to affected individuals on request
- Profiling functions deactivated by default
- Penalties up to $10M or 3% of gross global revenue for non-compliance

**Artificial Intelligence and Data Act (AIDA) would have:**
- Classified credit decisions, insurance, and financial product pricing as "high-impact" AI systems
- Required risk assessments, bias mitigation, and monitoring for high-impact systems
- Created specific obligations for financial AI systems

### Current Status (February 2026)
Minister Evan Solomon confirmed AIDA will not return in its old form. The government is pursuing a "light, tight, right" approach. Canada still operates under PIPEDA (enacted in 2000) with no federal AI-specific legislation. However, the direction of travel is clear: automated financial decisions affecting consumers will face increased scrutiny.

**Source**: [OPC AI Framework](https://www.priv.gc.ca/en/about-the-opc/what-we-do/consultations/completed-consultations/consultation-ai/reg-fw_202011/) | [McInnes Cooper on AIDA](https://www.mcinnescooper.com/publications/the-demise-of-the-artificial-intelligence-and-data-act-aida-5-key-lessons/) | [Xenoss AI Regulation Overview](https://xenoss.io/blog/ai-regulation-canada)

---

## 5. KYC/AML: FINTRAC and PCMLTFA

### Current Framework
- Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA)
- Enforced by FINTRAC
- Reporting entities must comply with KYC and AML requirements

### AI in KYC/AML
- AI is permitted and increasingly used for: identity verification, transaction monitoring, anomaly detection, risk assessment
- Biometric authentication, facial recognition, OCR for document verification are allowed
- FINTRAC plans to implement AI-assisted scorecard systems for real-time feedback to FIs

### Penalties (December 2024 Amendments)
- 40x increase in penalties proposed
- Up to C$4 million for individuals, C$20 million for companies per violation

### Human Oversight Still Required
While AI can automate many KYC/AML processes, Suspicious Transaction Reports (STRs) and escalation decisions still require human judgment. The "reasonable grounds to suspect" standard implies human assessment.

**Source**: [PayCompliance KYC Guide](https://paycompliance.com/2025/01/24/navigating-kyc-compliance-in-canada-your-2025-regulatory-guide/) | [McCarthy AI in Financial Services](https://www.mccarthy.ca/en/insights/blogs/techlex/ai-canadian-financial-services-industry)

---

## 6. Human Rights and Anti-Discrimination

### Existing Protections
- Canadian Human Rights Act and provincial human rights codes apply to AI-driven decisions
- Federal and provincial human rights commissions can provide redress for AI-caused discrimination
- Discriminatory AI outcomes can lead to orders for damages and corrective measures

### The Bias Testing Dilemma
Testing for AI bias in financial services creates a fundamental data paradox: accurate bias testing requires collecting sensitive data on protected attributes (race, religion, etc.), which itself increases privacy risks even with consent. This means financial institutions must:
- Continuously monitor AI models impacting customers (especially pricing/credit)
- Ensure data representativeness
- Involve diverse, multidisciplinary teams

**Source**: [Fasken AI Landscape](https://www.fasken.com/en/knowledge/2023/11/artificial-intelligence-in-financial-services-the-canadian-regulatory-landscape) | [OSFI-FCAC Risk Report](https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/osfi-fcac-risk-report-ai-uses-risks-federally-regulated-financial-institutions)

---

## 7. Federal Government: Directive on Automated Decision-Making

While this applies to federal government institutions (not private sector directly), it signals regulatory direction:
- Algorithmic Impact Assessment required before deploying automated decision systems
- Tiered impact levels with corresponding human oversight requirements
- Higher impact = more human involvement required
- Transparency and explanation obligations

**Source**: [Canada.ca Directive on Automated Decision-Making](https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592)

---

## Summary: Regulatory Constraints That Matter for AI Builders

### What AI CAN Do (With Appropriate Controls)
1. Automate KYC document verification and identity checks
2. Monitor transactions for AML/fraud patterns
3. Generate investment research and portfolio analysis
4. Provide financial education and general information
5. Automate tax-loss harvesting and portfolio rebalancing (within pre-set parameters)
6. Streamline customer onboarding workflows
7. Power chatbots for general customer service inquiries

### What AI CANNOT Do Autonomously
1. **Make final suitability determinations** (securities law: requires human "sound professional judgment")
2. **Execute material transactions without human-in-the-loop** (OSFI E-23: systemic risk concern)
3. **Deny credit or financial services** without explainability and recourse mechanisms
4. **File Suspicious Transaction Reports** without human assessment of "reasonable grounds"
5. **Override human oversight** in high-impact decisions affecting consumers

### The One Critical Decision That Must Remain Human

**Investment suitability determination -- the decision of whether a specific financial product or strategy is appropriate for a specific client.**

**Why:**
- **Legal mandate**: CIRO rules require an Approved Person's "sound professional judgment" -- this is a registerable activity that cannot be delegated to or outsourced to AI
- **Fiduciary responsibility**: The advisor-client relationship carries obligations that presuppose human understanding and accountability
- **Contextual judgment**: Suitability requires understanding nuances that go beyond quantifiable data -- a client going through a divorce, approaching retirement, or facing health issues may need advice that contradicts what their risk tolerance questionnaire suggests
- **Regulatory accountability**: When something goes wrong, regulators need a human who made the decision and can explain their reasoning
- **Consumer trust**: Canadians entrust their financial futures to institutions; the final decision-maker should be answerable to them as a person, not as an algorithm
- **Bias safeguard**: Human review is the last line of defense against systematic AI bias in financial recommendations

This constraint does NOT mean AI has no role -- it means AI should augment the human advisor's capabilities, surface insights, flag risks, and automate routine tasks so the human can make better suitability determinations with more information and less administrative burden. This is the "AI expands what humans can do" philosophy that regulators want to see.

---

## Implications for Wealthsimple AI Builders Application

1. **Design for human-in-the-loop**: Any AI system touching investment decisions should keep humans in the decision chain
2. **Prioritize explainability**: Build systems where AI reasoning can be traced and explained to customers and regulators
3. **Document bias monitoring**: Show awareness of fairness requirements and how you would test for bias
4. **Leverage regulatory awareness as a differentiator**: Most applicants will ignore regulatory context. Naming specific regulations (E-23, CSA 11-348, PIPEDA) demonstrates real-world readiness
5. **Frame AI as advisor augmentation, not replacement**: This aligns perfectly with both regulatory requirements and Wealthsimple's mission of democratizing financial services
6. **Build for transparency**: Any demo should show how decisions are made, not just what decisions are made
