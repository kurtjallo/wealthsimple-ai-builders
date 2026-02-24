import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, RiskScorerInput, RiskScorerOutput, RiskLevel } from '@/types';

export async function riskScorerStub(
  input: RiskScorerInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<RiskScorerOutput> {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  // Calculate risk based on upstream results
  const docConfidence = input.document_result.confidence;
  const identityVerified = input.identity_result.data?.verified ?? false;
  const sanctionsFlagged = input.sanctions_result.data?.flagged ?? false;

  let riskScore = 15; // Base low risk
  const factors: RiskScorerOutput['risk_factors'] = [];

  // Document quality factor
  factors.push({
    factor_name: 'document_quality',
    weight: 0.25,
    score: docConfidence * 100,
    explanation: `Document processing confidence: ${(docConfidence * 100).toFixed(0)}%`,
  });

  // Identity verification factor
  if (!identityVerified) {
    riskScore += 30;
  }
  factors.push({
    factor_name: 'identity_verification',
    weight: 0.3,
    score: identityVerified ? 10 : 70,
    explanation: identityVerified
      ? 'Identity verified — all fields match'
      : 'Identity NOT verified — discrepancies found',
  });

  // Sanctions screening factor
  if (sanctionsFlagged) {
    riskScore += 50;
  }
  factors.push({
    factor_name: 'sanctions_screening',
    weight: 0.35,
    score: sanctionsFlagged ? 95 : 5,
    explanation: sanctionsFlagged
      ? 'SANCTIONS MATCH FOUND — requires immediate review'
      : 'No sanctions matches — clear on all lists',
  });

  // Agent reliability factor
  const agentFailures = [input.identity_result, input.sanctions_result]
    .filter(r => !r.success).length;
  factors.push({
    factor_name: 'agent_reliability',
    weight: 0.1,
    score: agentFailures > 0 ? 60 : 5,
    explanation: agentFailures > 0
      ? `${agentFailures} verification agent(s) failed — degraded confidence`
      : 'All agents completed successfully',
  });

  const riskLevel: RiskLevel = riskScore <= 25 ? 'low'
    : riskScore <= 50 ? 'medium'
    : riskScore <= 75 ? 'high'
    : 'critical';

  return {
    risk_score: Math.min(100, riskScore),
    risk_level: riskLevel,
    risk_factors: factors,
    requires_manual_review: riskLevel === 'high' || riskLevel === 'critical' || agentFailures > 0,
    scoring_summary: `Risk assessment: ${riskLevel.toUpperCase()} (${riskScore}/100). ${factors.length} factors evaluated.`,
  };
}
