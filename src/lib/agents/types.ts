import type { AgentType } from '@/types/index';
import type { AgentResult } from '@/types/agents';

/**
 * Standard input provided to agents by the orchestrator.
 */
export interface AgentInput {
  case_id: string;
  [key: string]: unknown;
}

/**
 * Agent interface — all specialized agents implement this contract.
 * The orchestrator calls run() and expects an AgentResult back.
 *
 * TInput: the specific input shape for this agent
 * TOutput: the data payload returned inside AgentResult<TOutput>
 */
export interface Agent<
  TInput extends AgentInput = AgentInput,
  TOutput = Record<string, unknown>,
> {
  type: AgentType;
  name: string;
  description: string;
  run(input: TInput): Promise<AgentResult<TOutput>>;
}

// Re-export AgentResult for convenience
export type { AgentResult, AgentType };
