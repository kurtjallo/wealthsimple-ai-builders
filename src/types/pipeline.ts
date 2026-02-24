import type {
  AgentResult,
  DocumentProcessorOutput,
  IdentityVerifierOutput,
  SanctionsScreenerOutput,
  RiskScorerOutput,
  CaseNarratorOutput,
} from './agents';

// Pipeline stages as a finite state machine
export type PipelineStage =
  | 'initialized' // Case created, ready to process
  | 'document_processing' // DocumentProcessor running
  | 'parallel_verification' // IdentityVerifier + SanctionsScreener running in parallel
  | 'risk_scoring' // RiskScorer aggregating signals
  | 'narrative_generation' // CaseNarrator producing assessment
  | 'completed' // All agents done, ready for review
  | 'failed'; // Pipeline failed (unrecoverable)

// Valid transitions
export const PIPELINE_TRANSITIONS: Record<PipelineStage, PipelineStage[]> = {
  initialized: ['document_processing'],
  document_processing: ['parallel_verification', 'failed'],
  parallel_verification: ['risk_scoring', 'failed'],
  risk_scoring: ['narrative_generation', 'failed'],
  narrative_generation: ['completed', 'failed'],
  completed: [],
  failed: ['initialized'], // Can retry from start
};

// Full pipeline state — tracks all agent results as they complete
export interface PipelineState {
  case_id: string;
  stage: PipelineStage;
  started_at: string;
  updated_at: string;

  // Agent results (null until that stage completes)
  document_result: AgentResult<DocumentProcessorOutput> | null;
  identity_result: AgentResult<IdentityVerifierOutput> | null;
  sanctions_result: AgentResult<SanctionsScreenerOutput> | null;
  risk_result: AgentResult<RiskScorerOutput> | null;
  narrative_result: AgentResult<CaseNarratorOutput> | null;

  // Error tracking
  errors: PipelineError[];
  retry_count: number;
}

export interface PipelineError {
  stage: PipelineStage;
  agent_type: string;
  error_message: string;
  timestamp: string;
  recoverable: boolean;
}

// Events that drive pipeline transitions
export type PipelineEvent =
  | { type: 'START'; case_id: string }
  | { type: 'DOCUMENT_PROCESSING_COMPLETE'; result: AgentResult<DocumentProcessorOutput> }
  | { type: 'IDENTITY_VERIFICATION_COMPLETE'; result: AgentResult<IdentityVerifierOutput> }
  | { type: 'SANCTIONS_SCREENING_COMPLETE'; result: AgentResult<SanctionsScreenerOutput> }
  | { type: 'PARALLEL_VERIFICATION_COMPLETE' }
  | { type: 'RISK_SCORING_COMPLETE'; result: AgentResult<RiskScorerOutput> }
  | { type: 'NARRATIVE_COMPLETE'; result: AgentResult<CaseNarratorOutput> }
  | { type: 'AGENT_FAILED'; error: PipelineError }
  | { type: 'RETRY' };
