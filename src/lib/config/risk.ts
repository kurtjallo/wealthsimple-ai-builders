import type { RiskLevel } from '@/types';

/**
 * Risk score thresholds — single source of truth.
 * Used by scoring-engine.ts AND risk-profile-card.tsx color logic.
 */
export const RISK_THRESHOLDS = {
  low: 25,
  medium: 50,
  high: 75,
} as const;

/**
 * Get the risk category for a numeric score.
 */
export function getRiskCategory(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.low) return 'low';
  if (score <= RISK_THRESHOLDS.medium) return 'medium';
  if (score <= RISK_THRESHOLDS.high) return 'high';
  return 'critical';
}

/**
 * Get the Tailwind color class for a risk score (used by bar charts).
 */
export function getRiskScoreColor(score: number): string {
  if (score <= RISK_THRESHOLDS.low) return 'bg-emerald-500';
  if (score <= RISK_THRESHOLDS.medium) return 'bg-amber-500';
  if (score <= RISK_THRESHOLDS.high) return 'bg-orange-500';
  return 'bg-red-500';
}
