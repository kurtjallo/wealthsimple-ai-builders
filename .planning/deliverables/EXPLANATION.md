# KYC/AML Operations Orchestrator

## What the Human Can Do

A compliance officer opens a new account application and sees a complete risk profile — synthesized from five AI agents that ran in parallel — instead of a stack of raw documents. Every data point links to its source with a confidence score. The officer reviews the plain-English case narrative, checks sanctions results, and clicks Approve, Deny, or Escalate with mandatory justification. The entire review takes about 3 minutes.

Before this system, that same case took 4-5 days. An analyst would manually read passport scans, cross-reference sanctions databases, pull PEP lists, and write a case summary. With the orchestrator, the officer skips data gathering and focuses on judgment. STR filings come pre-assembled with evidence links. Every action is timestamped and exportable as CSV for FINTRAC audits.

## What the AI Handles

Five agents execute in parallel through the Google GenAI SDK orchestrator:

**Document Processor** — Mistral OCR extracts text from passports, utility bills, and corporate filings. Gemini 2.5 Pro performs structured extraction, pulling name, DOB, address, and document numbers with per-field confidence scores.

**Sanctions Screener** — Queries 11,000+ OFAC SDN entries, the UN Security Council list, and a PEP database. Name matching uses PostgreSQL trigram similarity, Levenshtein distance, phonetic codes (Soundex + Double Metaphone), and Arabic transliteration normalization for variants like Mohammed/Muhammad/Mohamed.

**Identity Verifier** — Cross-references fields across documents, catching discrepancies in names, dates of birth, and document numbers. Weighted confidence: name 30%, DOB 20%, document validity 20%, watchlist 30%.

**Risk Scorer** — Deterministic weighted formula: documents 20%, identity 25%, sanctions 35%, PEP 20%. No LLM in the scoring math — the composite score is reproducible and auditable. Risk bands: Low (0-25), Medium (26-50), High (51-75), Critical (76-100).

**Case Narrator** — Gemini generates a plain-English assessment with key findings, recommended action, and evidence links to specific documents and screening results.

The orchestrator manages timeouts, retries with exponential backoff, and graceful degradation — if an agent fails, partial results are flagged for review.

## Where the AI Stops

AI never makes final decisions. Approve/Deny/Escalate requires a human officer ID and written justification — the API rejects requests missing these fields or from AI actors. OSFI Guideline E-23 flags autonomous AI executing material financial decisions. CIRO requires human suitability determinations. This is enforced at the code level, not just the UI.

STR filing is exclusively human. FINTRAC's "reasonable grounds to suspect" standard under the PCMLTFA requires human judgment — an algorithm cannot form suspicion. The system assembles evidence and flags indicators, but the filing decision belongs to the officer.

When OCR confidence drops below threshold, the system routes to manual review rather than guessing. AI recommendations are labeled "Advisory Only" — the officer sees what the system found, then decides independently.

## What Breaks at Scale

**API throughput** — Gemini and Mistral rate limits cap concurrency. At 100+ simultaneous cases, the system needs a job queue (Bull/BullMQ) with backpressure. Currently processes cases synchronously.

**Cost** — ~$0.15-0.30 per case. At 10,000 cases/day, $1,500-3,000 daily. Production needs Gemini Flash for low-risk triage and response caching.

**Sanctions freshness** — OFAC updates regularly. Production needs daily sync with change detection and retroactive re-screening.

**Name matching** — Trigram similarity handles Latin scripts but struggles with Chinese and Korean. Phonetic matching is English-biased. Production needs script-aware tokenization.
