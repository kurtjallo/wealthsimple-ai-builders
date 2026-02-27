import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AgentType } from '@/types';
import {
  AgentAuditPayload,
  HumanDecisionAuditPayload,
  SystemAuditPayload,
  AuditLogInsert,
  AuditEventType,
} from './types';
import { AUDIT_ACTIONS, ACTOR_TYPES, AuditAction } from './constants';

/**
 * Log an agent action to the audit trail.
 */
export async function logAgentAction(
  caseId: string,
  agentType: AgentType,
  payload: Omit<AgentAuditPayload, 'event_type' | 'agent_type'>,
): Promise<void> {
  const action = payload.success
    ? AUDIT_ACTIONS.AGENT_COMPLETED
    : AUDIT_ACTIONS.AGENT_FAILED;

  const fullPayload: AgentAuditPayload = {
    event_type: 'agent_action',
    agent_type: agentType,
    ...payload,
  };

  await logAuditEvent({
    case_id: caseId,
    action,
    actor_type: ACTOR_TYPES.AGENT,
    actor_id: agentType,
    details: fullPayload,
    event_type: 'agent_action',
  });
}

/**
 * Log a human compliance officer decision to the audit trail.
 */
export async function logHumanDecision(
  caseId: string,
  payload: Omit<HumanDecisionAuditPayload, 'event_type'>,
): Promise<void> {
  let action: AuditAction;
  switch (payload.decision) {
    case 'approved':
      action = AUDIT_ACTIONS.CASE_APPROVED;
      break;
    case 'denied':
      action = AUDIT_ACTIONS.CASE_DENIED;
      break;
    case 'escalated':
      action = AUDIT_ACTIONS.CASE_ESCALATED;
      break;
    case 'str_referral':
      action = AUDIT_ACTIONS.STR_REFERRED;
      break;
    default:
      action = AUDIT_ACTIONS.CASE_ESCALATED;
  }

  const fullPayload: HumanDecisionAuditPayload = {
    event_type: 'human_decision',
    ...payload,
  };

  await logAuditEvent({
    case_id: caseId,
    action,
    actor_type: ACTOR_TYPES.OFFICER,
    actor_id: payload.officer_id,
    details: fullPayload,
    event_type: 'human_decision',
  });
}

/**
 * Log a system or case lifecycle event to the audit trail.
 */
export async function logSystemEvent(
  caseId: string,
  action: AuditAction,
  payload: Omit<SystemAuditPayload, 'event_type'>,
  actorId: string = 'system',
): Promise<void> {
  const eventType: AuditEventType = action.startsWith('case.')
    ? 'case_lifecycle'
    : 'system_event';

  const fullPayload: SystemAuditPayload = {
    event_type: eventType,
    ...payload,
  };

  await logAuditEvent({
    case_id: caseId,
    action,
    actor_type: ACTOR_TYPES.SYSTEM,
    actor_id: actorId,
    details: fullPayload,
    event_type: eventType,
  });
}

/**
 * Low-level audit event writer. All other log functions delegate to this.
 * NEVER throws — audit logging should not break calling operations.
 */
export async function logAuditEvent(entry: AuditLogInsert): Promise<void> {
  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from('audit_logs').insert({
      case_id: entry.case_id,
      action: entry.action,
      actor_type: entry.actor_type,
      actor_id: entry.actor_id,
      details: entry.details as unknown as Record<string, never>,
    });

    if (error) {
      console.error('[AUDIT] Failed to write audit log:', {
        case_id: entry.case_id,
        action: entry.action,
        error: error.message,
      });
    }
  } catch (err) {
    console.error('[AUDIT] Exception in audit logger:', {
      case_id: entry.case_id,
      action: entry.action,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

// Re-export constants for convenience
export { AUDIT_ACTIONS, ACTOR_TYPES } from './constants';
