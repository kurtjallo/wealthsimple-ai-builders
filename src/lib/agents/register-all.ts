import { registerRiskScorer } from './risk-scorer';
import { registerCaseNarrator } from './case-narrator';

let registered = false;

/**
 * Register all agent handlers with the orchestrator.
 * Safe to call multiple times — only registers once.
 *
 * Call this at app startup or before processing any case.
 */
export function registerAllAgents(): void {
  if (registered) return;

  registerRiskScorer();
  registerCaseNarrator();

  // Phase 3-4 agents register themselves via their own modules
  // but can also be wired here as the central entry point grows.

  registered = true;
}
