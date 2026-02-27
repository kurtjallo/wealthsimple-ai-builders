// Standardized audit action strings
export const AUDIT_ACTIONS = {
  // Agent actions
  AGENT_STARTED: 'agent.started',
  AGENT_COMPLETED: 'agent.completed',
  AGENT_FAILED: 'agent.failed',

  // Human decisions
  CASE_APPROVED: 'decision.approved',
  CASE_DENIED: 'decision.denied',
  CASE_ESCALATED: 'decision.escalated',
  STR_REFERRED: 'decision.str_referred',

  // Case lifecycle
  CASE_CREATED: 'case.created',
  CASE_STATUS_CHANGED: 'case.status_changed',
  CASE_ASSIGNED: 'case.assigned',
  DOCUMENTS_UPLOADED: 'case.documents_uploaded',

  // Pipeline events
  PIPELINE_STARTED: 'pipeline.started',
  PIPELINE_COMPLETED: 'pipeline.completed',
  PIPELINE_FAILED: 'pipeline.failed',

  // System events
  SYSTEM_ERROR: 'system.error',
  EXPORT_GENERATED: 'system.export_generated',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

// Actor type constants
export const ACTOR_TYPES = {
  SYSTEM: 'system' as const,
  AGENT: 'agent' as const,
  OFFICER: 'officer' as const,
};
