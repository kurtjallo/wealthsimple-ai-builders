'use client';

import { useMemo } from 'react';
import { AgentType, AgentRunStatus } from '@/types';
import { PipelineUpdate, AgentResultSummary } from './use-pipeline-stream';

export interface AgentStatusInfo {
  agentType: AgentType;
  label: string;
  description: string;
  status: AgentRunStatus;
  confidence: number | null;
  durationMs: number | null;
  error: string | null;
  order: number; // Pipeline order for layout
}

// Human-readable labels for each agent
const AGENT_LABELS: Record<string, { label: string; description: string; order: number }> = {
  document_processor: {
    label: 'Document Processor',
    description: 'OCR extraction and structured data parsing',
    order: 1,
  },
  identity_verifier: {
    label: 'Identity Verifier',
    description: 'Cross-reference identity fields against application',
    order: 2,
  },
  sanctions_screener: {
    label: 'Sanctions Screener',
    description: 'Screen against UN, OFAC, and PEP databases',
    order: 2, // Same order as identity (parallel)
  },
  risk_scorer: {
    label: 'Risk Scorer',
    description: 'Aggregate signals into composite risk score',
    order: 3,
  },
  case_narrator: {
    label: 'Case Narrator',
    description: 'Generate human-readable risk assessment',
    order: 4,
  },
};

// Derive agent status from the current pipeline stage
function deriveAgentStatus(
  agentType: string,
  pipelineUpdate: PipelineUpdate | null,
): { status: AgentRunStatus; result: AgentResultSummary | null } {
  if (!pipelineUpdate) {
    return { status: 'pending', result: null };
  }

  // Map agent type to its result field
  const resultMap: Record<string, AgentResultSummary | null> = {
    document_processor: pipelineUpdate.document_result,
    identity_verifier: pipelineUpdate.identity_result,
    sanctions_screener: pipelineUpdate.sanctions_result,
    risk_scorer: pipelineUpdate.risk_result,
    case_narrator: pipelineUpdate.narrative_result,
  };

  const result = resultMap[agentType];

  // If result exists, agent has completed (or failed)
  if (result) {
    return {
      status: result.success ? 'completed' : 'failed',
      result,
    };
  }

  // Determine if agent is currently running based on pipeline stage
  const stage = pipelineUpdate.stage;

  const isRunning =
    (agentType === 'document_processor' && stage === 'document_processing') ||
    (agentType === 'identity_verifier' && stage === 'parallel_verification') ||
    (agentType === 'sanctions_screener' && stage === 'parallel_verification') ||
    (agentType === 'risk_scorer' && stage === 'risk_scoring') ||
    (agentType === 'case_narrator' && stage === 'narrative_generation');

  return {
    status: isRunning ? 'running' : 'pending',
    result: null,
  };
}

export function useAgentStatus(
  pipelineUpdate: PipelineUpdate | null,
): AgentStatusInfo[] {
  return useMemo(() => {
    const agentTypes: AgentType[] = [
      'document_processor',
      'identity_verifier',
      'sanctions_screener',
      'risk_scorer',
      'case_narrator',
    ];

    return agentTypes.map((agentType) => {
      const meta = AGENT_LABELS[agentType];
      const { status, result } = deriveAgentStatus(agentType, pipelineUpdate);

      // Find error for this agent
      const agentError = pipelineUpdate?.errors.find(
        e => e.agent_type === agentType || e.agent_type.includes(agentType)
      );

      return {
        agentType,
        label: meta.label,
        description: meta.description,
        status,
        confidence: result?.confidence ?? null,
        durationMs: result?.duration_ms ?? null,
        error: agentError?.error_message ?? null,
        order: meta.order,
      };
    });
  }, [pipelineUpdate]);
}
