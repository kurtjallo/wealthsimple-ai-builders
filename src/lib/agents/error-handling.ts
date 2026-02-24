import type { PipelineError, PipelineStage, AgentResult } from '@/types';

// Error categories for classification
export type ErrorCategory = 'timeout' | 'rate_limit' | 'api_error' | 'invalid_response' | 'network' | 'unknown';

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  recoverable: boolean;
  should_retry: boolean;
}

// Classify an error into a category with recovery guidance
export function classifyError(error: unknown): ClassifiedError {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('timed out') || message.includes('timeout') || message.includes('abort')) {
    return { category: 'timeout', message, recoverable: true, should_retry: true };
  }

  if (message.includes('429') || message.includes('rate limit') || message.includes('too many requests')) {
    return { category: 'rate_limit', message, recoverable: true, should_retry: true };
  }

  if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('internal server error')) {
    return { category: 'api_error', message, recoverable: true, should_retry: true };
  }

  if (message.includes('ECONNREFUSED') || message.includes('ENOTFOUND') || message.includes('fetch failed') || message.includes('network')) {
    return { category: 'network', message, recoverable: true, should_retry: true };
  }

  if (message.includes('invalid') || message.includes('parse') || message.includes('JSON') || message.includes('unexpected token')) {
    return { category: 'invalid_response', message, recoverable: false, should_retry: false };
  }

  return { category: 'unknown', message, recoverable: false, should_retry: false };
}

// Create a PipelineError from a classified error
export function createPipelineError(
  stage: PipelineStage,
  agentType: string,
  error: ClassifiedError,
): PipelineError {
  return {
    stage,
    agent_type: agentType,
    error_message: `[${error.category}] ${error.message}`,
    timestamp: new Date().toISOString(),
    recoverable: error.recoverable,
  };
}

// Create a "degraded" result when an agent fails but pipeline should continue
export function createDegradedResult<T>(
  agentType: string,
  errorMessage: string,
): AgentResult<T> {
  return {
    success: false,
    data: null,
    error: errorMessage,
    confidence: 0,
    duration_ms: 0,
    agent_type: agentType as AgentResult<T>['agent_type'],
    metadata: { degraded: true },
  };
}

// Determine if the pipeline should continue after a parallel stage
// Rule: Continue if at least one verification agent succeeded
export function shouldContinueAfterParallelFailure(
  results: Array<AgentResult<unknown>>,
): boolean {
  return results.some(r => r.success);
}

// Format errors for logging/display
export function formatPipelineErrors(errors: PipelineError[]): string {
  if (errors.length === 0) return 'No errors';
  return errors
    .map((e, i) => `${i + 1}. [${e.stage}] ${e.agent_type}: ${e.error_message} (${e.recoverable ? 'recoverable' : 'fatal'})`)
    .join('\n');
}
