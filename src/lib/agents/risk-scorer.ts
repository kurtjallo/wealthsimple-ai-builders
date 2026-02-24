import type { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, RiskScorerInput, RiskScorerOutput } from '@/types';
import { calculateCompositeRisk } from './scoring-engine';
import { registerAgent } from './orchestrator';

/**
 * Risk Scorer agent handler.
 *
 * Uses deterministic scoring engine for numbers + Gemini for human-readable summary.
 * Compatible with Phase 2 orchestrator's runAgent() pattern.
 */
export async function riskScorerHandler(
  input: RiskScorerInput,
  client: GoogleGenerativeAI,
  config: AgentConfig,
): Promise<RiskScorerOutput> {
  // Step 1: Deterministic scoring
  const scores = calculateCompositeRisk(input);

  // Step 2: LLM-generated summary
  let scoringSummary: string;
  try {
    const model = client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        maxOutputTokens: config.max_tokens,
        temperature: config.temperature ?? 0,
      },
    });

    const prompt = `You are a KYC/AML risk scoring analyst. Analyze the following risk assessment and write a 2-3 sentence scoring summary suitable for a compliance officer.

Risk Score: ${scores.risk_score}/100 (${scores.risk_level})
Requires Manual Review: ${scores.requires_manual_review}

Risk Factors:
${scores.risk_factors.map((f) => `- ${f.factor_name} (weight: ${f.weight}, score: ${f.score}/100): ${f.explanation}`).join('\n')}

Write a concise summary explaining the key risk drivers and whether this case warrants closer scrutiny. Be specific about which factors contributed most.`;

    const result = await model.generateContent(prompt);
    scoringSummary = result.response.text() || 'Unable to generate scoring summary.';
  } catch (error) {
    // Fallback: deterministic summary if Gemini fails
    const topFactors = [...scores.risk_factors]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    scoringSummary = `Risk score: ${scores.risk_score}/100 (${scores.risk_level}). ` +
      `Key factors: ${topFactors.map((f) => `${f.factor_name} (${f.score})`).join(', ')}. ` +
      `${scores.requires_manual_review ? 'Manual review required.' : 'Automated clearance possible.'}`;
  }

  return {
    ...scores,
    scoring_summary: scoringSummary,
  };
}

/** Register the Risk Scorer agent with the orchestrator. */
export function registerRiskScorer(): void {
  registerAgent('risk_scorer', riskScorerHandler);
}
