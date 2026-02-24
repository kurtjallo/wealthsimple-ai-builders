import type { RiskLevel } from '@/types/index';
import type {
  RiskScorerInput,
  RiskFactor,
  AgentResult,
  DocumentProcessorOutput,
  IdentityVerifierOutput,
  SanctionsScreenerOutput,
} from '@/types/agents';

// ---- Constants ----

export const DEFAULT_RISK_WEIGHTS = {
  documents: 0.20,
  identity: 0.25,
  sanctions: 0.35,
  pep: 0.20,
} as const;

// ---- Helpers ----

export function getRiskCategory(score: number): RiskLevel {
  if (score <= 25) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'high';
  return 'critical';
}

function cap(value: number, max = 100): number {
  return Math.min(Math.max(0, value), max);
}

// ---- Component Scoring Functions ----

export function calculateDocumentRisk(
  docResult: AgentResult<DocumentProcessorOutput>,
): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];

  if (!docResult.success || !docResult.data) {
    factors.push({
      factor_name: 'document_processing_failure',
      weight: DEFAULT_RISK_WEIGHTS.documents,
      score: 50,
      explanation: 'Document processing failed — unable to assess document quality.',
    });
    return { score: 50, factors };
  }

  const data = docResult.data;
  let score = 0;

  // Document quality assessment (invert: low quality = high risk)
  const qualityValues = Object.values(data.document_quality);
  if (qualityValues.length > 0) {
    const avgQuality = qualityValues.reduce((sum, q) => sum + q, 0) / qualityValues.length;
    const qualityRisk = Math.round((1 - avgQuality) * 60); // 0-60 range
    score += qualityRisk;
    factors.push({
      factor_name: 'document_quality',
      weight: DEFAULT_RISK_WEIGHTS.documents,
      score: qualityRisk,
      explanation: `Average document quality: ${(avgQuality * 100).toFixed(0)}%. ${avgQuality < 0.5 ? 'Poor quality increases risk.' : 'Acceptable quality.'}`,
    });
  }

  // Low overall confidence
  if (docResult.confidence < 0.5) {
    score += 20;
    factors.push({
      factor_name: 'low_document_confidence',
      weight: DEFAULT_RISK_WEIGHTS.documents,
      score: 20,
      explanation: `Overall document confidence is low (${(docResult.confidence * 100).toFixed(0)}%).`,
    });
  }

  // Missing or low-confidence extracted fields
  const lowConfFields = data.extracted_fields.filter((f) => f.confidence < 0.7);
  if (lowConfFields.length > 0) {
    const fieldPenalty = Math.min(lowConfFields.length * 5, 30);
    score += fieldPenalty;
    factors.push({
      factor_name: 'low_confidence_fields',
      weight: DEFAULT_RISK_WEIGHTS.documents,
      score: fieldPenalty,
      explanation: `${lowConfFields.length} field(s) extracted with low confidence (<0.7): ${lowConfFields.map((f) => f.field_name).join(', ')}.`,
    });
  }

  return { score: cap(score), factors };
}

export function calculateIdentityRisk(
  idResult: AgentResult<IdentityVerifierOutput>,
): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];

  if (!idResult.success || !idResult.data) {
    factors.push({
      factor_name: 'identity_verification_failure',
      weight: DEFAULT_RISK_WEIGHTS.identity,
      score: 60,
      explanation: 'Identity verification failed — unable to confirm applicant identity.',
    });
    return { score: 60, factors };
  }

  const data = idResult.data;
  let score = 0;

  // Unverified identity
  if (!data.verified) {
    score += 50;
    factors.push({
      factor_name: 'identity_unverified',
      weight: DEFAULT_RISK_WEIGHTS.identity,
      score: 50,
      explanation: 'Applicant identity could not be verified across submitted documents.',
    });
  }

  // Discrepancies
  if (data.discrepancies.length > 0) {
    const discrepancyPenalty = data.discrepancies.length * 15;
    score += discrepancyPenalty;
    factors.push({
      factor_name: 'identity_discrepancies',
      weight: DEFAULT_RISK_WEIGHTS.identity,
      score: discrepancyPenalty,
      explanation: `${data.discrepancies.length} discrepancy(ies) found: ${data.discrepancies.slice(0, 3).join('; ')}${data.discrepancies.length > 3 ? '...' : ''}.`,
    });
  }

  // Low match confidence
  const lowConfMatches = data.matches.filter((m) => m.confidence < 0.5);
  if (lowConfMatches.length > 0) {
    const matchPenalty = lowConfMatches.length * 10;
    score += matchPenalty;
    factors.push({
      factor_name: 'low_match_confidence',
      weight: DEFAULT_RISK_WEIGHTS.identity,
      score: matchPenalty,
      explanation: `${lowConfMatches.length} identity match(es) with low confidence (<0.5): ${lowConfMatches.map((m) => m.field_name).join(', ')}.`,
    });
  }

  return { score: cap(score), factors };
}

export function calculateSanctionsRisk(
  sanctionsResult: AgentResult<SanctionsScreenerOutput>,
): { score: number; pepScore: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];

  if (!sanctionsResult.success || !sanctionsResult.data) {
    factors.push({
      factor_name: 'sanctions_screening_failure',
      weight: DEFAULT_RISK_WEIGHTS.sanctions,
      score: 70,
      explanation: 'Sanctions screening failed — cannot clear applicant without screening.',
    });
    return { score: 70, pepScore: 0, factors };
  }

  const data = sanctionsResult.data;
  let score = 0;
  let pepScore = 0;

  // Separate PEP matches from sanctions matches
  const pepMatches = data.matches.filter((m) => m.list_name.includes('PEP'));
  const sanctionsMatches = data.matches.filter((m) => !m.list_name.includes('PEP'));

  // Sanctions scoring
  if (sanctionsMatches.length > 0) {
    score += 60; // Base flag penalty
    factors.push({
      factor_name: 'sanctions_flagged',
      weight: DEFAULT_RISK_WEIGHTS.sanctions,
      score: 60,
      explanation: `Flagged against ${sanctionsMatches.length} sanctions list match(es).`,
    });

    for (const match of sanctionsMatches) {
      let matchPenalty = 0;
      if (match.match_score > 0.9) matchPenalty = 40;
      else if (match.match_score > 0.7) matchPenalty = 25;
      else if (match.match_score > 0.5) matchPenalty = 15;

      if (matchPenalty > 0) {
        score += matchPenalty;
        factors.push({
          factor_name: `sanctions_match_${match.list_name.replace(/\s+/g, '_').toLowerCase()}`,
          weight: DEFAULT_RISK_WEIGHTS.sanctions,
          score: matchPenalty,
          explanation: `Match "${match.matched_name}" on ${match.list_name} (score: ${(match.match_score * 100).toFixed(0)}%).`,
        });
      }
    }

    // Multiple matches penalty
    if (sanctionsMatches.length > 1) {
      const multiPenalty = (sanctionsMatches.length - 1) * 10;
      score += multiPenalty;
      factors.push({
        factor_name: 'multiple_sanctions_matches',
        weight: DEFAULT_RISK_WEIGHTS.sanctions,
        score: multiPenalty,
        explanation: `${sanctionsMatches.length} total sanctions matches — multiple hits increase risk.`,
      });
    }
  } else if (data.flagged && sanctionsMatches.length === 0 && pepMatches.length > 0) {
    // Only PEP matches, no sanctions — base sanctions score stays 0
  }

  // PEP scoring (same logic but separate score)
  if (pepMatches.length > 0) {
    pepScore += 60;
    factors.push({
      factor_name: 'pep_flagged',
      weight: DEFAULT_RISK_WEIGHTS.pep,
      score: 60,
      explanation: `Flagged against ${pepMatches.length} PEP match(es).`,
    });

    for (const match of pepMatches) {
      let matchPenalty = 0;
      if (match.match_score > 0.9) matchPenalty = 40;
      else if (match.match_score > 0.7) matchPenalty = 25;
      else if (match.match_score > 0.5) matchPenalty = 15;

      if (matchPenalty > 0) {
        pepScore += matchPenalty;
        factors.push({
          factor_name: 'pep_match',
          weight: DEFAULT_RISK_WEIGHTS.pep,
          score: matchPenalty,
          explanation: `PEP match "${match.matched_name}" (score: ${(match.match_score * 100).toFixed(0)}%).`,
        });
      }
    }

    if (pepMatches.length > 1) {
      const multiPenalty = (pepMatches.length - 1) * 10;
      pepScore += multiPenalty;
      factors.push({
        factor_name: 'multiple_pep_matches',
        weight: DEFAULT_RISK_WEIGHTS.pep,
        score: multiPenalty,
        explanation: `${pepMatches.length} total PEP matches.`,
      });
    }
  }

  return { score: cap(score), pepScore: cap(pepScore), factors };
}

// ---- Composite Risk Aggregation ----

export function calculateCompositeRisk(
  input: RiskScorerInput,
  weights = DEFAULT_RISK_WEIGHTS,
): {
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
  requires_manual_review: boolean;
} {
  const docRisk = calculateDocumentRisk(input.document_result);
  const idRisk = calculateIdentityRisk(input.identity_result);
  const sanctionsRisk = calculateSanctionsRisk(input.sanctions_result);

  const compositeScore = Math.round(
    docRisk.score * weights.documents +
    idRisk.score * weights.identity +
    sanctionsRisk.score * weights.sanctions +
    sanctionsRisk.pepScore * weights.pep,
  );

  const riskScore = cap(compositeScore);

  const anyAgentFailed =
    !input.document_result.success ||
    !input.identity_result.success ||
    !input.sanctions_result.success;

  const anyComponentCritical =
    docRisk.score > 75 || idRisk.score > 75 || sanctionsRisk.score > 75 || sanctionsRisk.pepScore > 75;

  const requiresManualReview = riskScore > 50 || anyComponentCritical || anyAgentFailed;

  return {
    risk_score: riskScore,
    risk_level: getRiskCategory(riskScore),
    risk_factors: [...docRisk.factors, ...idRisk.factors, ...sanctionsRisk.factors],
    requires_manual_review: requiresManualReview,
  };
}
