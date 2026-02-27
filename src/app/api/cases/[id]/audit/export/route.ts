import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logSystemEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { Database } from '@/lib/supabase/types';

type AuditLogRow = Database['public']['Tables']['audit_logs']['Row'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const supabase = createServerSupabaseClient();

    const { data: auditLogs, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch audit trail: ' + error.message },
        { status: 500 },
      );
    }

    if (!auditLogs || auditLogs.length === 0) {
      return NextResponse.json(
        { error: 'No audit trail found for this case' },
        { status: 404 },
      );
    }

    const csvHeaders = [
      'Timestamp',
      'Actor Type',
      'Actor ID',
      'Action',
      'Event Type',
      'Details Summary',
      'Confidence',
      'Justification',
      'Case ID',
      'Audit Log ID',
    ];

    const csvRows = (auditLogs as AuditLogRow[]).map(log => {
      const details = log.details as Record<string, unknown> | null;
      const eventType = details?.event_type || '';
      const confidence = details?.confidence != null ? String(details.confidence) : '';
      const justification = details?.justification || details?.description || '';
      const summary = getExportSummary(log);

      return [
        log.created_at,
        log.actor_type,
        log.actor_id,
        log.action,
        String(eventType),
        summary,
        confidence,
        String(justification),
        log.case_id,
        log.id,
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);
    });

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(',')),
    ].join('\n');

    const fintracHeader = `"# FINTRAC/PCMLTFA Audit Trail Export - Case ${caseId} - Generated ${new Date().toISOString()} - Records must be retained for 5+ years"`;
    const fullCsv = fintracHeader + '\n' + csvContent;

    await logSystemEvent(caseId, AUDIT_ACTIONS.EXPORT_GENERATED, {
      description: `Audit trail exported as CSV. ${auditLogs.length} entries.`,
      metadata: { format: 'csv', entry_count: auditLogs.length },
    });

    return new NextResponse(fullCsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audit-trail-${caseId}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}

function getExportSummary(log: AuditLogRow): string {
  const details = log.details as Record<string, unknown> | null;
  if (!details) return String(log.action);

  if (details.event_type === 'agent_action') {
    return `${details.agent_type}: ${details.output_summary || (details.success ? 'completed' : 'failed')}`;
  }
  if (details.event_type === 'human_decision') {
    return `${details.decision}: ${details.justification}`;
  }
  return String(details.description || log.action);
}
