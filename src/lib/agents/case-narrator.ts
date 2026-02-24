import type { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, CaseNarratorInput, CaseNarratorOutput } from '@/types';
import { NARRATOR_SYSTEM_PROMPT, buildNarrativePrompt } from './narrator-prompts';
import { registerAgent } from './orchestrator';

function validateAction(action: unknown): string {
  const validActions = ['approve', 'deny', 'escalate'];
  if (typeof action === 'string' && validActions.includes(action)) {
    return action;
  }
  return 'escalate'; // Default to escalate — safest for compliance
}

/**
 * Case Narrator agent handler.
 *
 * Synthesizes all agent results into a structured risk assessment narrative
 * with evidence-linked findings and a recommended action.
 *
 * Compatible with Phase 2 orchestrator's runAgent() pattern.
 */
export async function caseNarratorHandler(
  input: CaseNarratorInput,
  client: GoogleGenerativeAI,
  config: AgentConfig,
): Promise<CaseNarratorOutput> {
  const prompt = buildNarrativePrompt(input);

  const model = client.getGenerativeModel({
    model: config.model,
    generationConfig: {
      maxOutputTokens: config.max_tokens,
      temperature: config.temperature ?? 0.3,
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: NARRATOR_SYSTEM_PROMPT,
  });

  const responseText = result.response.text() || '';

  // Parse JSON response from Gemini
  try {
    // Strip potential markdown code fences
    const jsonStr = responseText.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const parsed = JSON.parse(jsonStr);

    return {
      narrative: parsed.narrative || 'Unable to generate narrative.',
      key_findings: Array.isArray(parsed.key_findings) ? parsed.key_findings : [],
      recommended_action: validateAction(parsed.recommended_action),
      evidence_links: Array.isArray(parsed.evidence_links)
        ? parsed.evidence_links.map((link: Record<string, unknown>) => ({
            claim: String(link.claim || ''),
            source: String(link.source || ''),
            confidence: typeof link.confidence === 'number' ? link.confidence : 0,
          }))
        : [],
    };
  } catch {
    // JSON parse failed — use raw text as narrative, default to escalate
    return {
      narrative: responseText || 'Unable to generate narrative — LLM response was not valid JSON.',
      key_findings: ['Narrative generation encountered a formatting issue. Raw assessment available above.'],
      recommended_action: 'escalate',
      evidence_links: [],
    };
  }
}

/** Register the Case Narrator agent with the orchestrator. */
export function registerCaseNarrator(): void {
  registerAgent('case_narrator', caseNarratorHandler);
}
