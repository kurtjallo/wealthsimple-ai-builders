import { AgentType } from '@/types';
import {
  FileSearch,
  UserCheck,
  ShieldAlert,
  BarChart3,
  FileText,
  Bot,
} from 'lucide-react';

/**
 * Centralized agent registry — single source of truth for all agent metadata.
 * Import from here instead of defining local copies.
 */

export interface AgentMeta {
  type: AgentType;
  label: string;
  description: string;
  sidebarName: string;
  icon: typeof FileSearch;
  order: number;
}

/**
 * Pipeline agent types (excludes orchestrator which is internal-only).
 */
export const PIPELINE_AGENT_TYPES: AgentType[] = [
  'document_processor',
  'identity_verifier',
  'sanctions_screener',
  'risk_scorer',
  'case_narrator',
];

/**
 * Full registry keyed by agent type.
 */
export const AGENT_REGISTRY: Record<AgentType, AgentMeta> = {
  orchestrator: {
    type: 'orchestrator',
    label: 'Orchestrator',
    description: 'Pipeline coordination',
    sidebarName: 'Orchestrator',
    icon: Bot,
    order: 0,
  },
  document_processor: {
    type: 'document_processor',
    label: 'Document Processor',
    description: 'OCR extraction and structured data parsing',
    sidebarName: 'Document OCR',
    icon: FileSearch,
    order: 1,
  },
  identity_verifier: {
    type: 'identity_verifier',
    label: 'Identity Verifier',
    description: 'Cross-reference identity fields against application',
    sidebarName: 'Identity Verification',
    icon: UserCheck,
    order: 2,
  },
  sanctions_screener: {
    type: 'sanctions_screener',
    label: 'Sanctions Screener',
    description: 'Screen against UN, OFAC, and PEP databases',
    sidebarName: 'Sanctions Screening',
    icon: ShieldAlert,
    order: 2,
  },
  risk_scorer: {
    type: 'risk_scorer',
    label: 'Risk Scorer',
    description: 'Aggregate signals into composite risk score',
    sidebarName: 'Risk Scoring',
    icon: BarChart3,
    order: 3,
  },
  case_narrator: {
    type: 'case_narrator',
    label: 'Case Narrator',
    description: 'Generate human-readable risk assessment',
    sidebarName: 'Case Narrator',
    icon: FileText,
    order: 4,
  },
};

/**
 * Format an agent_type string to its human-readable label.
 * Single source — replaces duplicated formatAgentName() functions.
 */
export function formatAgentName(agentType: string): string {
  const meta = AGENT_REGISTRY[agentType as AgentType];
  return meta?.label ?? agentType;
}

/**
 * Get pipeline agents sorted by execution order.
 */
export function getPipelineAgents(): AgentMeta[] {
  return PIPELINE_AGENT_TYPES.map(t => AGENT_REGISTRY[t]);
}
