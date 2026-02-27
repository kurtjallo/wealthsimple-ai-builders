import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/types';

type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const supabase = createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('event_type');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Determine the actor_type filter based on event_type query param
    let actorTypeFilter: string | null = null;
    if (eventType === 'agent_action') {
      actorTypeFilter = 'agent';
    } else if (eventType === 'human_decision') {
      actorTypeFilter = 'officer';
    } else if (eventType === 'system_event') {
      actorTypeFilter = 'system';
    }

    const baseQuery = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('case_id', caseId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: auditLogs, error, count } = actorTypeFilter
      ? await baseQuery.eq('actor_type', actorTypeFilter)
      : await baseQuery;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch audit trail: ' + error.message },
        { status: 500 },
      );
    }

    const enrichedLogs = ((auditLogs || []) as AuditLogRow[]).map(log => ({
      ...log,
      actor_label: getActorLabel(log.actor_type, log.actor_id),
      action_label: getActionLabel(log.action),
      summary: getEventSummary(log),
      timestamp_formatted: new Date(log.created_at).toLocaleString('en-CA', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }),
    }));

    return NextResponse.json({
      case_id: caseId,
      audit_trail: enrichedLogs,
      total_count: count || 0,
      limit,
      offset,
      fintrac_notice: 'This audit trail meets FINTRAC/PCMLTFA record-keeping requirements. Records must be retained for 5+ years.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}

function getActorLabel(actorType: string, actorId: string): string {
  switch (actorType) {
    case 'agent': {
      const agentNames: Record<string, string> = {
        document_processor: 'Document Processor Agent',
        identity_verifier: 'Identity Verifier Agent',
        sanctions_screener: 'Sanctions Screener Agent',
        risk_scorer: 'Risk Scorer Agent',
        case_narrator: 'Case Narrator Agent',
        orchestrator: 'Orchestrator',
      };
      return agentNames[actorId] || `Agent: ${actorId}`;
    }
    case 'officer':
      return `Officer: ${actorId}`;
    case 'system':
      return 'System';
    default:
      return actorId;
  }
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    'agent.started': 'Agent Started',
    'agent.completed': 'Agent Completed',
    'agent.failed': 'Agent Failed',
    'decision.approved': 'Case Approved',
    'decision.denied': 'Case Denied',
    'decision.escalated': 'Case Escalated',
    'decision.str_referred': 'STR Referral',
    'case.created': 'Case Created',
    'case.status_changed': 'Status Changed',
    'case.assigned': 'Case Assigned',
    'case.documents_uploaded': 'Documents Uploaded',
    'pipeline.started': 'Pipeline Started',
    'pipeline.completed': 'Pipeline Completed',
    'pipeline.failed': 'Pipeline Failed',
    'system.error': 'System Error',
    'system.export_generated': 'Audit Export Generated',
  };
  return labels[action] || action;
}

function getEventSummary(log: AuditLogRow): string {
  const details = log.details as Record<string, unknown> | null;
  if (!details) return String(log.action);

  const eventType = details.event_type;

  if (eventType === 'agent_action') {
    const success = details.success ? 'completed' : 'failed';
    const confidence = typeof details.confidence === 'number'
      ? ` (confidence: ${(details.confidence as number * 100).toFixed(0)}%)`
      : '';
    return `${details.agent_type} ${success}${confidence}. ${details.output_summary || ''}`.trim();
  }

  if (eventType === 'human_decision') {
    return `Officer ${details.officer_id} ${details.decision}: "${details.justification}"`;
  }

  if (eventType === 'system_event' || eventType === 'case_lifecycle') {
    return String(details.description || log.action);
  }

  return String(log.action);
}
