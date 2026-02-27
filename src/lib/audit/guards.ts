/**
 * Human-in-the-loop guard functions for regulatory compliance.
 *
 * FINTRAC/PCMLTFA requires that ALL compliance decisions are made by human officers.
 * AI agents may recommend but NEVER decide. These guards enforce that at the API layer.
 */

export class DecisionValidationError extends Error {
  public readonly statusCode: number;
  public readonly field?: string;

  constructor(message: string, statusCode: number = 400, field?: string) {
    super(message);
    this.name = 'DecisionValidationError';
    this.statusCode = statusCode;
    this.field = field;
  }
}

export interface DecisionRequest {
  officer_id?: string;
  officer_name?: string;
  decision?: string;
  justification?: string;
}

export interface STRReferralRequest {
  officer_id?: string;
  officer_name?: string;
  reason?: string;
  suspicious_indicators?: string[];
}

const VALID_DECISIONS = ['approved', 'denied', 'escalated'] as const;
const MIN_JUSTIFICATION_LENGTH = 10;

/**
 * Validate that a decision request comes from a human officer with proper justification.
 */
export function validateHumanDecision(request: DecisionRequest): {
  officer_id: string;
  decision: 'approved' | 'denied' | 'escalated';
  justification: string;
  officer_name?: string;
} {
  if (!request.officer_id || request.officer_id.trim().length === 0) {
    throw new DecisionValidationError(
      'REG-02 violation: All compliance decisions require a human officer. Provide officer_id to identify the decision-maker.',
      400,
      'officer_id',
    );
  }

  const suspiciousActors = ['system', 'agent', 'ai', 'bot', 'auto', 'orchestrator'];
  if (suspiciousActors.some(s => request.officer_id!.toLowerCase().includes(s))) {
    throw new DecisionValidationError(
      'REG-02 violation: AI agents and automated systems cannot make compliance decisions. Only human officers may approve, deny, or escalate cases.',
      403,
      'officer_id',
    );
  }

  if (!request.decision || !VALID_DECISIONS.includes(request.decision as typeof VALID_DECISIONS[number])) {
    throw new DecisionValidationError(
      `Invalid decision. Must be one of: ${VALID_DECISIONS.join(', ')}. AI recommendations are advisory only — the human officer selects the final decision.`,
      400,
      'decision',
    );
  }

  if (!request.justification || request.justification.trim().length < MIN_JUSTIFICATION_LENGTH) {
    throw new DecisionValidationError(
      `REG-04 violation: FINTRAC requires documented justification for all compliance decisions. Provide at least ${MIN_JUSTIFICATION_LENGTH} characters explaining the reasoning.`,
      400,
      'justification',
    );
  }

  return {
    officer_id: request.officer_id.trim(),
    decision: request.decision as 'approved' | 'denied' | 'escalated',
    justification: request.justification.trim(),
    officer_name: request.officer_name?.trim(),
  };
}

/**
 * Validate that an STR filing referral comes from a human officer.
 */
export function validateSTRAuthority(request: STRReferralRequest): {
  officer_id: string;
  officer_name?: string;
  reason: string;
  suspicious_indicators: string[];
} {
  if (!request.officer_id || request.officer_id.trim().length === 0) {
    throw new DecisionValidationError(
      'REG-03 violation: STR filing is exclusively a human responsibility under FINTRAC/PCMLTFA. A designated compliance officer must initiate all STR referrals.',
      400,
      'officer_id',
    );
  }

  const suspiciousActors = ['system', 'agent', 'ai', 'bot', 'auto', 'orchestrator'];
  if (suspiciousActors.some(s => request.officer_id!.toLowerCase().includes(s))) {
    throw new DecisionValidationError(
      'REG-03 violation: AI systems CANNOT file or initiate Suspicious Transaction Reports. Under PCMLTFA, only a designated human compliance officer may determine "reasonable grounds to suspect" and file an STR with FINTRAC.',
      403,
      'officer_id',
    );
  }

  if (!request.reason || request.reason.trim().length < 20) {
    throw new DecisionValidationError(
      'FINTRAC requires detailed reasoning for STR referrals. Provide at least 20 characters explaining the suspicious indicators and why this case warrants an STR.',
      400,
      'reason',
    );
  }

  return {
    officer_id: request.officer_id.trim(),
    officer_name: request.officer_name?.trim(),
    reason: request.reason.trim(),
    suspicious_indicators: Array.isArray(request.suspicious_indicators)
      ? request.suspicious_indicators.filter(s => typeof s === 'string' && s.trim().length > 0)
      : [],
  };
}
