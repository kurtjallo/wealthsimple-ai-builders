/**
 * Per-agent delay configuration (milliseconds).
 * These create the visual effect of agents "working" in the dashboard.
 *
 * Timing strategy for demo:
 * - Document processing: longest (OCR is slow in reality)
 * - Parallel verification: medium (runs concurrently, so wall-clock time is max of both)
 * - Risk scoring: fast (deterministic math)
 * - Narrative generation: medium (LLM generation)
 *
 * Total target: 12-18 seconds for full pipeline. Long enough to see each stage,
 * short enough to not bore the viewer during a 2-3 minute demo video.
 */
export const AGENT_DELAY_CONFIG: Record<string, { min: number; max: number }> = {
  document_processing: { min: 3000, max: 5000 },
  identity_verifier: { min: 2000, max: 3500 },
  sanctions_screener: { min: 2500, max: 4000 },
  risk_scoring: { min: 1500, max: 2500 },
  narrative_generation: { min: 2000, max: 3500 },
};

/**
 * Simulate realistic agent processing delay.
 * Adds a randomized delay within the configured range for the given stage/agent.
 *
 * In production, real agents have natural latency. For the demo,
 * we inject delays to make processing visible in the UI.
 */
export async function simulateAgentDelay(
  stageOrAgent: string,
  options?: { skipDelay?: boolean }
): Promise<number> {
  if (options?.skipDelay) return 0;

  const config = AGENT_DELAY_CONFIG[stageOrAgent];
  if (!config) return 0;

  const delay = config.min + Math.random() * (config.max - config.min);
  await new Promise(resolve => setTimeout(resolve, delay));
  return Math.round(delay);
}

/**
 * Calculate the expected total pipeline duration range.
 * Useful for progress bars and time estimates.
 */
export function getExpectedDuration(): { min: number; max: number } {
  // Parallel verification: take the max of identity + sanctions
  const parallelMin = Math.max(
    AGENT_DELAY_CONFIG.identity_verifier.min,
    AGENT_DELAY_CONFIG.sanctions_screener.min
  );
  const parallelMax = Math.max(
    AGENT_DELAY_CONFIG.identity_verifier.max,
    AGENT_DELAY_CONFIG.sanctions_screener.max
  );

  return {
    min: AGENT_DELAY_CONFIG.document_processing.min + parallelMin +
         AGENT_DELAY_CONFIG.risk_scoring.min + AGENT_DELAY_CONFIG.narrative_generation.min,
    max: AGENT_DELAY_CONFIG.document_processing.max + parallelMax +
         AGENT_DELAY_CONFIG.risk_scoring.max + AGENT_DELAY_CONFIG.narrative_generation.max,
  };
}
