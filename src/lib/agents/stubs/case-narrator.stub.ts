import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, CaseNarratorInput, CaseNarratorOutput } from '@/types';

export async function caseNarratorStub(
  input: CaseNarratorInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<CaseNarratorOutput> {
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

  const riskLevel = input.risk_result.data?.risk_level || 'unknown';
  const riskScore = input.risk_result.data?.risk_score || 0;
  const sanctionsFlagged = input.sanctions_result.data?.flagged || false;
  const identityVerified = input.identity_result.data?.verified || false;

  const docQualityKeys = Object.keys(input.document_result.data?.document_quality || {});
  const docQualityValue = docQualityKeys.length > 0
    ? input.document_result.data?.document_quality[docQualityKeys[0]!] || 0
    : 0;

  const narrative = [
    `## KYC/AML Assessment: ${input.applicant_name}`,
    '',
    `**Risk Level:** ${riskLevel.toUpperCase()} (Score: ${riskScore}/100)`,
    '',
    '### Document Verification',
    `Documents were processed and ${input.document_result.data?.extracted_fields.length || 0} data fields were extracted. ` +
    `Overall document quality rated at ${(docQualityValue * 100).toFixed(0)}%.`,
    '',
    '### Identity Verification',
    identityVerified
      ? 'All identity fields match between the application and submitted documents. No discrepancies detected.'
      : 'Identity verification flagged discrepancies between application data and document fields. Manual review recommended.',
    '',
    '### Sanctions Screening',
    sanctionsFlagged
      ? 'WARNING: Potential sanctions list match detected. Immediate manual review required before proceeding.'
      : 'No matches found against UN Security Council Consolidated List, OFAC SDN List, or PEP databases.',
    '',
    '### Recommendation',
    riskLevel === 'low' ? 'Recommend APPROVAL — low risk profile with clean verification across all checks.'
      : riskLevel === 'medium' ? 'Recommend REVIEW — moderate risk indicators present. Officer review advised before decision.'
      : 'Recommend ESCALATION — elevated risk profile requires senior compliance officer review.',
  ].join('\n');

  return {
    narrative,
    key_findings: [
      `Risk score: ${riskScore}/100 (${riskLevel})`,
      identityVerified ? 'Identity verified — all fields match' : 'Identity verification — discrepancies found',
      sanctionsFlagged ? 'Sanctions match detected' : 'Sanctions screening — clear',
      `${input.document_result.data?.extracted_fields.length || 0} document fields extracted`,
    ],
    recommended_action: riskLevel === 'low' ? 'approve' : riskLevel === 'medium' ? 'escalate' : 'deny',
    evidence_links: [
      { claim: 'Document extraction completed', source: 'DocumentProcessor agent', confidence: input.document_result.confidence },
      { claim: `Identity ${identityVerified ? 'verified' : 'unverified'}`, source: 'IdentityVerifier agent', confidence: input.identity_result.confidence },
      { claim: `Sanctions ${sanctionsFlagged ? 'flagged' : 'clear'}`, source: 'SanctionsScreener agent', confidence: input.sanctions_result.confidence },
      { claim: `Risk: ${riskLevel}`, source: 'RiskScorer agent', confidence: input.risk_result.confidence },
    ],
  };
}
