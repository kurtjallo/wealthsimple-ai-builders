import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { validateHumanDecision, DecisionValidationError } from '@/lib/audit/guards';
import { logHumanDecision } from '@/lib/audit/logger';
import { CaseStatus } from '@/types';
import { Database } from '@/lib/supabase/types';

type CaseRow = Database['public']['Tables']['cases']['Row'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const body = await request.json();

    // REGULATORY GUARD: Validate human-in-the-loop (REG-01, REG-02)
    const validated = validateHumanDecision(body);

    const supabase = createServerSupabaseClient();

    const { data, error: caseError } = await supabase
      .from('cases')
      .select('id, status, risk_score, risk_level, decision')
      .eq('id', caseId)
      .single();
    const caseData = data as CaseRow | null;

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const decidableStatuses: CaseStatus[] = ['review', 'processing', 'escalated'];
    if (!decidableStatuses.includes(caseData.status as CaseStatus)) {
      return NextResponse.json(
        {
          error: `Case cannot be decided in current status: ${caseData.status}. Case must be in review, processing, or escalated status.`,
        },
        { status: 409 },
      );
    }

    const statusMap: Record<string, CaseStatus> = {
      approved: 'approved',
      denied: 'denied',
      escalated: 'escalated',
    };
    const newStatus = statusMap[validated.decision];

    const { error: updateError } = await supabase
      .from('cases')
      .update({
        status: newStatus,
        decision: validated.decision,
        decision_justification: validated.justification,
        officer_id: validated.officer_id,
      })
      .eq('id', caseId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update case: ' + updateError.message },
        { status: 500 },
      );
    }

    await logHumanDecision(caseId, {
      decision: validated.decision,
      justification: validated.justification,
      officer_id: validated.officer_id,
      officer_name: validated.officer_name,
      case_risk_score: caseData.risk_score ?? undefined,
      case_risk_level: caseData.risk_level ?? undefined,
      previous_status: caseData.status as CaseStatus,
      new_status: newStatus,
    });

    return NextResponse.json({
      success: true,
      case_id: caseId,
      decision: validated.decision,
      new_status: newStatus,
      officer_id: validated.officer_id,
      timestamp: new Date().toISOString(),
      message: `Case ${validated.decision} by officer ${validated.officer_id}`,
    });
  } catch (error) {
    if (error instanceof DecisionValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          field: error.field,
          regulatory_requirement: true,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
