import { PipelineState } from '@/types';

/**
 * Confidence thresholds for routing decisions.
 * If any agent's confidence falls below its threshold, the case is flagged for manual review.
 */
export const CONFIDENCE_THRESHOLDS = {
  // Per-agent confidence thresholds
  document_processor: 0.7,    // OCR accuracy below 70% needs human review
  identity_verifier: 0.8,     // Identity is critical — higher bar
  sanctions_screener: 0.9,    // Sanctions must be highly confident to auto-clear
  risk_scorer: 0.6,           // Risk scoring is aggregated, so lower threshold
  case_narrator: 0.5,         // Narrative quality less critical for routing

  // Global thresholds
  overall_minimum: 0.7,       // Average across all agents must exceed this
  risk_score_escalate: 50,    // Risk score above this -> manual review
  risk_score_deny: 75,        // Risk score above this -> recommend deny
} as const;

export interface ConfidenceRoutingResult {
  requires_manual_review: boolean;
  routing_reasons: string[];
  recommended_action: 'auto_review' | 'manual_review' | 'escalate';
  low_confidence_agents: string[];
  overall_confidence: number;
}

/**
 * Evaluate pipeline results against confidence thresholds.
 * Determines whether a case should be auto-reviewed or routed to manual review.
 *
 * Manual review triggers:
 * 1. Any agent confidence below its threshold
 * 2. Sanctions match detected (flagged = true)
 * 3. Identity verification failed (verified = false)
 * 4. Risk score above escalation threshold
 * 5. Any agent failed entirely (success = false)
 * 6. Overall average confidence below minimum
 */
export function evaluateConfidenceRouting(
  pipelineState: PipelineState
): ConfidenceRoutingResult {
  const reasons: string[] = [];
  const lowConfidenceAgents: string[] = [];
  const confidences: number[] = [];

  // Check each agent result
  const checks = [
    {
      name: 'document_processor',
      result: pipelineState.document_result,
      threshold: CONFIDENCE_THRESHOLDS.document_processor,
    },
    {
      name: 'identity_verifier',
      result: pipelineState.identity_result,
      threshold: CONFIDENCE_THRESHOLDS.identity_verifier,
    },
    {
      name: 'sanctions_screener',
      result: pipelineState.sanctions_result,
      threshold: CONFIDENCE_THRESHOLDS.sanctions_screener,
    },
    {
      name: 'risk_scorer',
      result: pipelineState.risk_result,
      threshold: CONFIDENCE_THRESHOLDS.risk_scorer,
    },
    {
      name: 'case_narrator',
      result: pipelineState.narrative_result,
      threshold: CONFIDENCE_THRESHOLDS.case_narrator,
    },
  ];

  for (const check of checks) {
    if (!check.result) {
      reasons.push(`${check.name}: no result (agent did not run)`);
      lowConfidenceAgents.push(check.name);
      confidences.push(0);
      continue;
    }

    confidences.push(check.result.confidence);

    // Check for agent failure
    if (!check.result.success) {
      reasons.push(`${check.name}: agent failed — ${check.result.error || 'unknown error'}`);
      lowConfidenceAgents.push(check.name);
      continue;
    }

    // Check confidence threshold
    if (check.result.confidence < check.threshold) {
      reasons.push(
        `${check.name}: confidence ${(check.result.confidence * 100).toFixed(0)}% below threshold ${(check.threshold * 100).toFixed(0)}%`
      );
      lowConfidenceAgents.push(check.name);
    }
  }

  // Check for sanctions match
  const sanctionsData = pipelineState.sanctions_result?.data;
  if (sanctionsData && 'flagged' in sanctionsData && sanctionsData.flagged) {
    reasons.push('Sanctions match detected — requires manual verification');
  }

  // Check for identity verification failure
  const identityData = pipelineState.identity_result?.data;
  if (identityData && 'verified' in identityData && !identityData.verified) {
    reasons.push('Identity verification failed — discrepancies found');
  }

  // Check risk score thresholds
  const riskData = pipelineState.risk_result?.data;
  if (riskData && 'risk_score' in riskData) {
    if (riskData.risk_score >= CONFIDENCE_THRESHOLDS.risk_score_deny) {
      reasons.push(`Risk score ${riskData.risk_score}/100 exceeds deny threshold (${CONFIDENCE_THRESHOLDS.risk_score_deny})`);
    } else if (riskData.risk_score >= CONFIDENCE_THRESHOLDS.risk_score_escalate) {
      reasons.push(`Risk score ${riskData.risk_score}/100 exceeds escalation threshold (${CONFIDENCE_THRESHOLDS.risk_score_escalate})`);
    }
  }

  // Calculate overall confidence
  const overallConfidence = confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : 0;

  if (overallConfidence < CONFIDENCE_THRESHOLDS.overall_minimum) {
    reasons.push(
      `Overall confidence ${(overallConfidence * 100).toFixed(0)}% below minimum ${(CONFIDENCE_THRESHOLDS.overall_minimum * 100).toFixed(0)}%`
    );
  }

  // Determine routing
  const requiresManualReview = reasons.length > 0;
  let recommendedAction: ConfidenceRoutingResult['recommended_action'] = 'auto_review';

  if (reasons.length > 0) {
    // Check severity
    const hasSanctionsMatch = sanctionsData && 'flagged' in sanctionsData && sanctionsData.flagged;
    const hasHighRisk = riskData && 'risk_score' in riskData && riskData.risk_score >= CONFIDENCE_THRESHOLDS.risk_score_deny;

    if (hasSanctionsMatch || hasHighRisk) {
      recommendedAction = 'escalate';
    } else {
      recommendedAction = 'manual_review';
    }
  }

  return {
    requires_manual_review: requiresManualReview,
    routing_reasons: reasons,
    recommended_action: recommendedAction,
    low_confidence_agents: lowConfidenceAgents,
    overall_confidence: overallConfidence,
  };
}
