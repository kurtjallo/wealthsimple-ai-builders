import { ActorType, AgentType, DecisionType, CaseStatus } from '@/types';

// Broad category of audit event
export type AuditEventType = 'agent_action' | 'human_decision' | 'system_event' | 'case_lifecycle';

// Structured payload for agent action audit logs
export interface AgentAuditPayload {
  event_type: 'agent_action';
  agent_type: AgentType;
  input_summary: string;
  output_summary: string;
  confidence: number;
  duration_ms: number;
  success: boolean;
  error_message?: string;
  model_used?: string;
}

// Structured payload for human decision audit logs
export interface HumanDecisionAuditPayload {
  event_type: 'human_decision';
  decision: DecisionType | 'str_referral';
  justification: string;
  officer_id: string;
  officer_name?: string;
  case_risk_score?: number;
  case_risk_level?: string;
  previous_status: CaseStatus;
  new_status: CaseStatus;
}

// Structured payload for system events
export interface SystemAuditPayload {
  event_type: 'system_event' | 'case_lifecycle';
  description: string;
  metadata?: Record<string, unknown>;
}

// Union type for all audit payloads
export type AuditPayload = AgentAuditPayload | HumanDecisionAuditPayload | SystemAuditPayload;

// What gets inserted into the audit_logs table
export interface AuditLogInsert {
  case_id: string;
  action: string;
  actor_type: ActorType;
  actor_id: string;
  details: AuditPayload;
  event_type?: AuditEventType;
}
