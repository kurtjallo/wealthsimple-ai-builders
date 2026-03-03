import { registerDocumentProcessor } from './document-processor';
import { registerIdentityVerifier } from './identity-verifier';
import { registerSanctionsScreener } from './sanctions-screener';
import { registerRiskScorer } from './risk-scorer';
import { registerCaseNarrator } from './case-narrator';

let registered = false;

/**
 * Register all agent handlers with the orchestrator.
 * Safe to call multiple times -- only registers once.
 *
 * All 5 pipeline agents must be registered here:
 * 1. document_processor - OCR + structured extraction
 * 2. identity_verifier - Name/DOB/doc validity checks
 * 3. sanctions_screener - OFAC/UN/PEP screening
 * 4. risk_scorer - Composite risk calculation
 * 5. case_narrator - LLM narrative generation
 */
export function registerAllAgents(): void {
  if (registered) return;

  registerDocumentProcessor();
  registerIdentityVerifier();
  registerSanctionsScreener();
  registerRiskScorer();
  registerCaseNarrator();

  registered = true;
}
