import type {
  CaseNarratorInput,
  AgentResult,
  DocumentProcessorOutput,
  IdentityVerifierOutput,
  SanctionsScreenerOutput,
  RiskScorerOutput,
} from '@/types/agents';

export const NARRATOR_SYSTEM_PROMPT = `You are the Case Narrator agent in a KYC/AML compliance system. Your job is to synthesize the results from multiple specialized agents into a clear, structured risk assessment narrative for a compliance officer.

Your output must be STRUCTURED and EVIDENCE-LINKED:
- Every factual claim must reference a specific source (document, verification, screening result)
- Use precise language suitable for regulatory documentation
- Do not speculate — only report what the agents found
- Clearly distinguish between verified facts and uncertain findings
- Always provide a recommended action with reasoning

You write for a senior compliance officer who needs to make an approve/deny/escalate decision within minutes. Be concise but complete.`;

export function buildNarrativePrompt(input: CaseNarratorInput): string {
  const sections: string[] = [];

  // Applicant context
  sections.push(`=== APPLICANT ===
Case ID: ${input.case_id}
Applicant Name: ${input.applicant_name}`);

  // Document Processing Results
  sections.push(formatDocumentResults(input.document_result));

  // Identity Verification Results
  sections.push(formatIdentityResults(input.identity_result));

  // Sanctions Screening Results
  sections.push(formatSanctionsResults(input.sanctions_result));

  // Risk Scoring Results
  sections.push(formatRiskResults(input.risk_result));

  // Output instructions
  sections.push(`=== INSTRUCTIONS ===
Based on the above agent results, produce a JSON object with this exact structure (no markdown code fences, no preamble — ONLY the JSON object):

{
  "narrative": "A 2-3 paragraph risk assessment narrative suitable for a compliance officer. Reference specific evidence from agent results.",
  "key_findings": ["Finding 1 with source reference", "Finding 2 with source reference"],
  "recommended_action": "approve or deny or escalate",
  "evidence_links": [
    { "claim": "Specific factual claim from the narrative", "source": "Agent name — specific data point", "confidence": 0.95 }
  ]
}

Rules:
- Every key_finding must reference a specific agent result
- Every evidence_link must tie a narrative claim to a source
- recommended_action must be exactly one of: approve, deny, escalate
- When in doubt, recommend escalate (safest for compliance)
- If any agent failed, note the data gap and factor it into your recommendation`);

  return sections.join('\n\n');
}

function formatDocumentResults(result: AgentResult<DocumentProcessorOutput>): string {
  if (!result.success || !result.data) {
    return `=== DOCUMENT PROCESSING ===
Status: FAILED
Error: ${result.error || 'Unknown error'}
Note: Document data is unavailable. This gap should be reflected in the risk assessment.`;
  }

  const data = result.data;
  const fields = data.extracted_fields;
  const qualityEntries = Object.entries(data.document_quality);

  return `=== DOCUMENT PROCESSING ===
Status: Completed (confidence: ${(result.confidence * 100).toFixed(0)}%)
Documents processed: ${qualityEntries.length}
${qualityEntries.map(([docId, quality]) => `  - ${docId}: quality ${(quality * 100).toFixed(0)}%`).join('\n')}

Extracted fields (${fields.length}):
${fields.map((f) => `  - ${f.field_name}: "${f.value}" (confidence: ${(f.confidence * 100).toFixed(0)}%, source: ${f.source_document_id})`).join('\n')}

Low confidence fields: ${fields.filter((f) => f.confidence < 0.7).map((f) => f.field_name).join(', ') || 'None'}`;
}

function formatIdentityResults(result: AgentResult<IdentityVerifierOutput>): string {
  if (!result.success || !result.data) {
    return `=== IDENTITY VERIFICATION ===
Status: FAILED
Error: ${result.error || 'Unknown error'}
Note: Identity verification data is unavailable. This gap should be reflected in the risk assessment.`;
  }

  const data = result.data;

  return `=== IDENTITY VERIFICATION ===
Status: ${data.verified ? 'VERIFIED' : 'NOT VERIFIED'}
Confidence: ${(result.confidence * 100).toFixed(0)}%
Summary: ${data.verification_summary}

Matches (${data.matches.length}):
${data.matches.map((m) => `  - ${m.field_name}: expected "${m.expected}" vs actual "${m.actual}" — ${m.match ? 'MATCH' : 'MISMATCH'} (confidence: ${(m.confidence * 100).toFixed(0)}%)`).join('\n')}

Discrepancies (${data.discrepancies.length}):
${data.discrepancies.length > 0 ? data.discrepancies.map((d) => `  - ${d}`).join('\n') : '  None'}`;
}

function formatSanctionsResults(result: AgentResult<SanctionsScreenerOutput>): string {
  if (!result.success || !result.data) {
    return `=== SANCTIONS SCREENING ===
Status: FAILED
Error: ${result.error || 'Unknown error'}
Note: Sanctions screening data is unavailable. This is a critical gap — applicant cannot be cleared without screening.`;
  }

  const data = result.data;

  return `=== SANCTIONS SCREENING ===
Status: ${data.flagged ? 'FLAGGED' : 'CLEAR'}
Lists checked: ${data.lists_checked.join(', ')}
Summary: ${data.screening_summary}

Matches (${data.matches.length}):
${data.matches.length > 0
    ? data.matches.map((m) => `  - ${m.matched_name} on ${m.list_name} (score: ${(m.match_score * 100).toFixed(0)}%) — ${m.details}`).join('\n')
    : '  No matches found'}`;
}

function formatRiskResults(result: AgentResult<RiskScorerOutput>): string {
  if (!result.success || !result.data) {
    return `=== RISK SCORING ===
Status: FAILED
Error: ${result.error || 'Unknown error'}
Note: Risk scoring data is unavailable. Manual risk assessment required.`;
  }

  const data = result.data;

  return `=== RISK SCORING ===
Composite Score: ${data.risk_score}/100
Risk Level: ${data.risk_level.toUpperCase()}
Requires Manual Review: ${data.requires_manual_review ? 'YES' : 'NO'}
Scoring Summary: ${data.scoring_summary}

Risk Factors (${data.risk_factors.length}):
${data.risk_factors.map((f) => `  - ${f.factor_name} (weight: ${f.weight}, score: ${f.score}/100): ${f.explanation}`).join('\n')}`;
}
