import { registerAgent } from '../orchestrator';
import { documentProcessorStub } from './document-processor.stub';
import { identityVerifierStub } from './identity-verifier.stub';
import { sanctionsScreenerStub } from './sanctions-screener.stub';
import { riskScorerStub } from './risk-scorer.stub';
import { caseNarratorStub } from './case-narrator.stub';

export function registerAllStubs(): void {
  registerAgent('document_processor', documentProcessorStub);
  registerAgent('identity_verifier', identityVerifierStub);
  registerAgent('sanctions_screener', sanctionsScreenerStub);
  registerAgent('risk_scorer', riskScorerStub);
  registerAgent('case_narrator', caseNarratorStub);
}

// Re-export individual stubs for testing
export { documentProcessorStub } from './document-processor.stub';
export { identityVerifierStub } from './identity-verifier.stub';
export { sanctionsScreenerStub } from './sanctions-screener.stub';
export { riskScorerStub } from './risk-scorer.stub';
export { caseNarratorStub } from './case-narrator.stub';
