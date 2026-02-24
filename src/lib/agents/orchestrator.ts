import type {
  PipelineState,
  PipelineStage,
  DocumentProcessorOutput,
  IdentityVerifierOutput,
  SanctionsScreenerOutput,
  RiskScorerOutput,
  CaseNarratorOutput,
  DocumentProcessorInput,
  IdentityVerifierInput,
  SanctionsScreenerInput,
  RiskScorerInput,
  CaseNarratorInput,
} from '@/types';
import { PIPELINE_TRANSITIONS } from '@/types';
import { runAgent } from './base-agent';
import { AGENT_CONFIGS } from './agent-config';
import {
  classifyError,
  createPipelineError,
  createDegradedResult,
  shouldContinueAfterParallelFailure,
  formatPipelineErrors,
} from './error-handling';

// Agent handler registry — populated by registerAgent()
// Each agent registers its handler here. Stubs are used until real agents are built.
type AnyAgentHandler = (input: any, client: any, config: any) => Promise<any>;

const agentHandlers: Map<string, AnyAgentHandler> = new Map();

export function registerAgent(agentType: string, handler: AnyAgentHandler): void {
  agentHandlers.set(agentType, handler);
}

function getHandler(agentType: string): AnyAgentHandler {
  const handler = agentHandlers.get(agentType);
  if (!handler) {
    throw new Error(`No handler registered for agent type: ${agentType}`);
  }
  return handler;
}

// State machine transition validation
function canTransition(from: PipelineStage, to: PipelineStage): boolean {
  return PIPELINE_TRANSITIONS[from].includes(to);
}

function transition(state: PipelineState, to: PipelineStage): PipelineState {
  if (!canTransition(state.stage, to)) {
    throw new Error(`Invalid transition: ${state.stage} -> ${to}`);
  }
  return {
    ...state,
    stage: to,
    updated_at: new Date().toISOString(),
  };
}

/** Create initial pipeline state */
export function createPipelineState(caseId: string): PipelineState {
  return {
    case_id: caseId,
    stage: 'initialized',
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    document_result: null,
    identity_result: null,
    sanctions_result: null,
    risk_result: null,
    narrative_result: null,
    errors: [],
    retry_count: 0,
  };
}

/** Pipeline stage callback for real-time updates */
export type PipelineCallback = (state: PipelineState) => void;

/** Main orchestration function — processes a case through the full pipeline */
export async function processCase(
  input: {
    case_id: string;
    documents: DocumentProcessorInput['documents'];
    applicant_name: string;
    applicant_email: string;
  },
  onStateChange?: PipelineCallback,
): Promise<PipelineState> {
  let state = createPipelineState(input.case_id);
  const notify = (s: PipelineState) => { if (onStateChange) onStateChange(s); };

  notify(state);

  try {
    // Stage 1: Document Processing
    state = transition(state, 'document_processing');
    notify(state);

    const docResult = await runAgent<DocumentProcessorInput, DocumentProcessorOutput>(
      'document_processor',
      { case_id: input.case_id, documents: input.documents },
      AGENT_CONFIGS.document_processor,
      getHandler('document_processor'),
    );
    state = { ...state, document_result: docResult, updated_at: new Date().toISOString() };

    if (!docResult.success) {
      return handleFailure(state, 'document_processing', 'document_processor', docResult.error || 'Unknown error');
    }

    // Stage 2: Parallel Verification (Identity + Sanctions run concurrently)
    state = transition(state, 'parallel_verification');
    notify(state);

    const verificationResults = await Promise.allSettled([
      runAgent<IdentityVerifierInput, IdentityVerifierOutput>(
        'identity_verifier',
        {
          case_id: input.case_id,
          extracted_fields: docResult.data!.extracted_fields,
          applicant_name: input.applicant_name,
        },
        AGENT_CONFIGS.identity_verifier,
        getHandler('identity_verifier'),
      ),
      runAgent<SanctionsScreenerInput, SanctionsScreenerOutput>(
        'sanctions_screener',
        {
          case_id: input.case_id,
          applicant_name: input.applicant_name,
          extracted_fields: docResult.data!.extracted_fields,
        },
        AGENT_CONFIGS.sanctions_screener,
        getHandler('sanctions_screener'),
      ),
    ]);

    // Extract results, creating degraded results for rejected promises
    const identityResult = verificationResults[0].status === 'fulfilled'
      ? verificationResults[0].value
      : createDegradedResult<IdentityVerifierOutput>('identity_verifier', (verificationResults[0] as PromiseRejectedResult).reason?.message || 'Unknown error');

    const sanctionsResult = verificationResults[1].status === 'fulfilled'
      ? verificationResults[1].value
      : createDegradedResult<SanctionsScreenerOutput>('sanctions_screener', (verificationResults[1] as PromiseRejectedResult).reason?.message || 'Unknown error');

    state = {
      ...state,
      identity_result: identityResult,
      sanctions_result: sanctionsResult,
      updated_at: new Date().toISOString(),
    };

    // Track individual agent errors
    if (!identityResult.success) {
      const classified = classifyError(new Error(identityResult.error || 'Unknown'));
      state.errors.push(createPipelineError('parallel_verification', 'identity_verifier', classified));
    }
    if (!sanctionsResult.success) {
      const classified = classifyError(new Error(sanctionsResult.error || 'Unknown'));
      state.errors.push(createPipelineError('parallel_verification', 'sanctions_screener', classified));
    }

    // Only fail if BOTH agents failed
    if (!shouldContinueAfterParallelFailure([identityResult, sanctionsResult])) {
      return handleFailure(state, 'parallel_verification', 'identity_verifier+sanctions_screener', 'Both verification agents failed');
    }

    // Stage 3: Risk Scoring
    state = transition(state, 'risk_scoring');
    notify(state);

    const riskResult = await runAgent<RiskScorerInput, RiskScorerOutput>(
      'risk_scorer',
      {
        case_id: input.case_id,
        document_result: docResult,
        identity_result: identityResult,
        sanctions_result: sanctionsResult,
      },
      AGENT_CONFIGS.risk_scorer,
      getHandler('risk_scorer'),
    );
    state = { ...state, risk_result: riskResult, updated_at: new Date().toISOString() };

    if (!riskResult.success) {
      return handleFailure(state, 'risk_scoring', 'risk_scorer', riskResult.error || 'Unknown error');
    }

    // Stage 4: Narrative Generation
    state = transition(state, 'narrative_generation');
    notify(state);

    const narrativeResult = await runAgent<CaseNarratorInput, CaseNarratorOutput>(
      'case_narrator',
      {
        case_id: input.case_id,
        applicant_name: input.applicant_name,
        document_result: docResult,
        identity_result: identityResult,
        sanctions_result: sanctionsResult,
        risk_result: riskResult,
      },
      AGENT_CONFIGS.case_narrator,
      getHandler('case_narrator'),
    );
    state = { ...state, narrative_result: narrativeResult, updated_at: new Date().toISOString() };

    if (!narrativeResult.success) {
      return handleFailure(state, 'narrative_generation', 'case_narrator', narrativeResult.error || 'Unknown error');
    }

    // Pipeline complete
    state = transition(state, 'completed');
    notify(state);
    return state;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    state = {
      ...state,
      stage: 'failed',
      errors: [...state.errors, {
        stage: state.stage,
        agent_type: 'orchestrator',
        error_message: errorMsg,
        timestamp: new Date().toISOString(),
        recoverable: false,
      }],
      updated_at: new Date().toISOString(),
    };
    notify(state);
    return state;
  }
}

function handleFailure(
  state: PipelineState,
  stage: PipelineStage,
  agentType: string,
  errorMessage: string,
): PipelineState {
  const classified = classifyError(new Error(errorMessage));
  return {
    ...state,
    stage: 'failed',
    errors: [...state.errors, createPipelineError(stage, agentType, classified)],
    updated_at: new Date().toISOString(),
  };
}

/** Human-readable pipeline status summary */
export function getPipelineSummary(state: PipelineState): string {
  const lines: string[] = [
    `Pipeline: ${state.case_id}`,
    `Stage: ${state.stage}`,
    `Started: ${state.started_at}`,
    `Updated: ${state.updated_at}`,
    `Errors: ${state.errors.length}`,
  ];

  if (state.errors.length > 0) {
    lines.push('', 'Error Details:');
    lines.push(formatPipelineErrors(state.errors));
  }

  if (state.stage === 'completed') {
    lines.push('', 'Results:');
    lines.push(`  Document: ${state.document_result?.success ? 'OK' : 'FAILED'}`);
    lines.push(`  Identity: ${state.identity_result?.success ? 'OK' : 'FAILED/DEGRADED'}`);
    lines.push(`  Sanctions: ${state.sanctions_result?.success ? 'OK' : 'FAILED/DEGRADED'}`);
    lines.push(`  Risk: ${state.risk_result?.success ? 'OK' : 'FAILED'}`);
    lines.push(`  Narrative: ${state.narrative_result?.success ? 'OK' : 'FAILED'}`);
  }

  return lines.join('\n');
}
