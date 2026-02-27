import { PipelineState, PipelineError } from '@/types';
import { formatAgentName } from '@/lib/config/agents';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface PipelineErrorDisplay {
  title: string;
  description: string;
  severity: ErrorSeverity;
  agent_name: string;
  can_retry: boolean;
  suggested_action: string;
  technical_details?: string;
}

export interface RecoveryStrategy {
  can_retry: boolean;
  retry_message: string;
  alternative_actions: string[];
  requires_human_intervention: boolean;
}

/**
 * Map pipeline errors to user-facing display objects.
 * Transforms technical error details into compliance-officer-friendly messages.
 */
export function classifyPipelineError(error: PipelineError): PipelineErrorDisplay {
  const agentName = formatAgentName(error.agent_type);
  const errorMsg = error.error_message.toLowerCase();

  // OCR-specific errors
  if (error.agent_type === 'document_processor' || errorMsg.includes('ocr')) {
    if (errorMsg.includes('empty') || errorMsg.includes('blank') || errorMsg.includes('unreadable')) {
      return {
        title: 'Document Unreadable',
        description: 'The uploaded document could not be read. The image may be too dark, blurry, or the file may be corrupted.',
        severity: 'error',
        agent_name: agentName,
        can_retry: true,
        suggested_action: 'Re-upload a clearer image of the document, then retry processing.',
        technical_details: error.error_message,
      };
    }
    if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
      return {
        title: 'Document Processing Timeout',
        description: 'The document processing service took too long to respond. This is usually temporary.',
        severity: 'warning',
        agent_name: agentName,
        can_retry: true,
        suggested_action: 'Wait a moment and retry. If the issue persists, try uploading a smaller file.',
        technical_details: error.error_message,
      };
    }
    return {
      title: 'Document Processing Failed',
      description: 'The document processor encountered an error while analyzing the uploaded document.',
      severity: 'error',
      agent_name: agentName,
      can_retry: true,
      suggested_action: 'Retry processing. If the error persists, try re-uploading the document.',
      technical_details: error.error_message,
    };
  }

  // Identity verification errors
  if (error.agent_type === 'identity_verifier') {
    return {
      title: 'Identity Verification Error',
      description: 'The identity verification agent was unable to complete its analysis. The case will require manual identity review.',
      severity: 'warning',
      agent_name: agentName,
      can_retry: true,
      suggested_action: 'Retry processing. Manual identity review may be required.',
      technical_details: error.error_message,
    };
  }

  // Sanctions screening errors — CRITICAL
  if (error.agent_type === 'sanctions_screener') {
    return {
      title: 'Sanctions Screening Error',
      description: 'The sanctions screening agent encountered an error. IMPORTANT: The applicant has NOT been cleared against sanctions lists. Manual screening is required.',
      severity: 'critical',
      agent_name: agentName,
      can_retry: true,
      suggested_action: 'Retry processing immediately. If retry fails, perform manual sanctions screening before making any decisions.',
      technical_details: error.error_message,
    };
  }

  // API/network errors (generic)
  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return {
      title: `${agentName} Timeout`,
      description: `The ${agentName.toLowerCase()} service did not respond in time. This is usually a temporary issue.`,
      severity: 'warning',
      agent_name: agentName,
      can_retry: true,
      suggested_action: 'Wait 30 seconds and retry processing.',
      technical_details: error.error_message,
    };
  }

  if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
    return {
      title: `${agentName} Rate Limited`,
      description: `The ${agentName.toLowerCase()} service is temporarily rate limited. Processing will succeed on retry.`,
      severity: 'warning',
      agent_name: agentName,
      can_retry: true,
      suggested_action: 'Wait 60 seconds and retry processing.',
      technical_details: error.error_message,
    };
  }

  // Default error
  return {
    title: `${agentName} Error`,
    description: `The ${agentName.toLowerCase()} encountered an unexpected error during processing.`,
    severity: 'error',
    agent_name: agentName,
    can_retry: error.recoverable,
    suggested_action: error.recoverable
      ? 'Retry processing. If the issue persists, escalate for technical review.'
      : 'This error requires technical investigation. Escalate the case for manual review.',
    technical_details: error.error_message,
  };
}

/**
 * Get user-facing error summary for the entire pipeline state.
 */
export function getUserFacingError(pipelineState: PipelineState): {
  title: string;
  errors: PipelineErrorDisplay[];
  can_retry: boolean;
  overall_severity: ErrorSeverity;
} {
  const errors = pipelineState.errors.map(classifyPipelineError);
  const hasCritical = errors.some(e => e.severity === 'critical');
  const canRetry = errors.some(e => e.can_retry);

  const completedAgents = [
    pipelineState.document_result?.success,
    pipelineState.identity_result?.success,
    pipelineState.sanctions_result?.success,
    pipelineState.risk_result?.success,
    pipelineState.narrative_result?.success,
  ].filter(Boolean).length;

  const totalAgents = 5;

  let title: string;
  if (completedAgents === 0) {
    title = 'Processing Failed';
  } else if (completedAgents < totalAgents) {
    title = `Partial Processing (${completedAgents}/${totalAgents} agents completed)`;
  } else {
    title = 'Processing Complete with Warnings';
  }

  return {
    title,
    errors,
    can_retry: canRetry,
    overall_severity: hasCritical ? 'critical' : errors.length > 0 ? 'error' : 'info',
  };
}

/**
 * Get recovery strategy for current pipeline state.
 */
export function getRecoveryStrategy(pipelineState: PipelineState): RecoveryStrategy {
  const errors = pipelineState.errors;
  const canRetry = errors.some(e => e.recoverable);

  const sanctionsError = errors.find(e => e.agent_type === 'sanctions_screener');
  const requiresHuman = !!sanctionsError;

  const alternatives: string[] = [];
  if (canRetry) alternatives.push('Retry processing');
  if (requiresHuman) alternatives.push('Perform manual sanctions screening');
  alternatives.push('Escalate case for senior review');
  alternatives.push('Request additional documents from applicant');

  return {
    can_retry: canRetry,
    retry_message: canRetry
      ? 'Retrying will re-run all failed agents. Previously successful results are preserved.'
      : 'Automated retry is not available. Manual review required.',
    alternative_actions: alternatives,
    requires_human_intervention: requiresHuman,
  };
}

