import type { RiskScorerOutput, CaseNarratorOutput } from '@/types/agents';

/**
 * Lightweight runtime shape-check for agent outputs.
 * Returns null if the data doesn't match the expected shape,
 * so components render their "not available" states gracefully.
 */

export function parseRiskScorerOutput(output: unknown): RiskScorerOutput | null {
  if (!output || typeof output !== 'object') return null;
  const o = output as Record<string, unknown>;

  if (typeof o.risk_score !== 'number') return null;
  if (typeof o.risk_level !== 'string') return null;
  if (!Array.isArray(o.risk_factors)) return null;

  return output as RiskScorerOutput;
}

export function parseCaseNarratorOutput(output: unknown): CaseNarratorOutput | null {
  if (!output || typeof output !== 'object') return null;
  const o = output as Record<string, unknown>;

  if (typeof o.narrative !== 'string') return null;
  if (!Array.isArray(o.key_findings)) return null;

  return output as CaseNarratorOutput;
}
