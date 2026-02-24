import type { AgentConfig, AgentType } from '@/types';

export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  orchestrator: {
    model: 'gemini-2.5-pro',
    max_tokens: 4096,
    timeout_ms: 120000, // 2 min
    retry_count: 2,
    temperature: 0,
  },
  document_processor: {
    model: 'gemini-2.5-pro',
    max_tokens: 4096,
    timeout_ms: 60000, // 1 min
    retry_count: 2,
    temperature: 0,
  },
  identity_verifier: {
    model: 'gemini-2.5-flash', // Lighter model for verification
    max_tokens: 2048,
    timeout_ms: 30000, // 30 sec
    retry_count: 2,
    temperature: 0,
  },
  sanctions_screener: {
    model: 'gemini-2.5-flash',
    max_tokens: 2048,
    timeout_ms: 30000,
    retry_count: 2,
    temperature: 0,
  },
  risk_scorer: {
    model: 'gemini-2.5-pro', // Needs reasoning
    max_tokens: 4096,
    timeout_ms: 45000,
    retry_count: 1,
    temperature: 0,
  },
  case_narrator: {
    model: 'gemini-2.5-pro',
    max_tokens: 4096,
    timeout_ms: 60000,
    retry_count: 1,
    temperature: 0.3, // Slight creativity for narrative
  },
};
