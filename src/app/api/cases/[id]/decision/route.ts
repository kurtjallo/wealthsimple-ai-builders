import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const VALID_DECISIONS = ['approved', 'denied', 'escalated'] as const;
type Decision = typeof VALID_DECISIONS[number];

interface DecisionRequest {
  decision: Decision;
  justification: string;
  officer_id?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const supabase = createServerSupabaseClient();

    // Parse and validate request body
    const body: DecisionRequest = await request.json();

    // Validate decision
    if (!body.decision || !VALID_DECISIONS.includes(body.decision)) {
      return NextResponse.json(
        {
          error: 'Invalid decision',
          details: `Decision must be one of: ${VALID_DECISIONS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate justification — MANDATORY
    if (!body.justification || body.justification.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Justification required',
          details: 'A written justification is mandatory for all compliance decisions.',
        },
        { status: 400 }
      );
    }

    // Minimum justification length
    if (body.justification.trim().length < 10) {
      return NextResponse.json(
        {
          error: 'Justification too short',
          details: 'Justification must be at least 10 characters. Please provide a meaningful explanation for your decision.',
        },
        { status: 400 }
      );
    }

    const officerId = body.officer_id || 'compliance-officer-1';

    // Verify case exists and is in a reviewable state
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, status, decision')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Prevent decisions on cases not in review
    if (caseData.status !== 'review') {
      return NextResponse.json(
        {
          error: 'Case not reviewable',
          details: `Case is in '${caseData.status}' status. Only cases in 'review' status can receive decisions.`,
        },
        { status: 409 }
      );
    }

    // Prevent duplicate decisions
    if (caseData.decision) {
      return NextResponse.json(
        {
          error: 'Decision already made',
          details: `This case already has a decision: ${caseData.decision}. Decisions cannot be changed.`,
        },
        { status: 409 }
      );
    }

    // Map decision to case status
    const newStatus = body.decision;

    // Update case with decision
    const { error: updateError } = await supabase
      .from('cases')
      .update({
        status: newStatus,
        decision: body.decision,
        decision_justification: body.justification.trim(),
        officer_id: officerId,
      })
      .eq('id', caseId);

    if (updateError) {
      console.error('Error updating case:', updateError);
      return NextResponse.json(
        { error: 'Failed to record decision' },
        { status: 500 }
      );
    }

    // Create audit log entry
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        case_id: caseId,
        action: `case_${body.decision}`,
        actor_type: 'officer',
        actor_id: officerId,
        details: {
          decision: body.decision,
          justification: body.justification.trim(),
          previous_status: caseData.status,
          new_status: newStatus,
          timestamp: new Date().toISOString(),
        },
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
    }

    // Return updated case
    const { data: updatedCase } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    return NextResponse.json({
      success: true,
      case: updatedCase,
      message: `Case ${body.decision} successfully.`,
    });
  } catch (error) {
    console.error('Decision API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
