import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { validateSTRAuthority, DecisionValidationError } from '@/lib/audit/guards';
import { logHumanDecision, logSystemEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { CaseStatus } from '@/types';
import { Database } from '@/lib/supabase/types';

type CaseRow = Database['public']['Tables']['cases']['Row'];

const FINTRAC_STR_CONTEXT = {
  regulation: 'Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA)',
  requirement: 'Section 7 — Reporting of suspicious transactions',
  summary: 'A reporting entity must submit a Suspicious Transaction Report (STR) to FINTRAC when there are reasonable grounds to suspect that a transaction or attempted transaction is related to the commission or attempted commission of a money laundering or terrorist activity financing offence.',
  human_only_rationale: 'The determination of "reasonable grounds to suspect" requires human judgment and cannot be delegated to automated systems. OSFI Guideline E-23 explicitly flags AI-driven compliance decisions as requiring human oversight.',
  filing_deadline: 'STRs must be filed with FINTRAC within 30 days of the determination.',
  record_keeping: 'All STR-related records must be retained for at least 5 years from the date of the last business transaction or activity.',
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const body = await request.json();

    const validated = validateSTRAuthority(body);

    const supabase = createServerSupabaseClient();

    const { data, error: caseError } = await supabase
      .from('cases')
      .select('id, status, risk_score, risk_level, applicant_name')
      .eq('id', caseId)
      .single();
    const caseData = data as CaseRow | null;

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('cases')
      .update({
        status: 'escalated' as CaseStatus,
        decision: 'escalated',
        decision_justification: `STR REFERRAL: ${validated.reason}`,
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
      decision: 'str_referral',
      justification: validated.reason,
      officer_id: validated.officer_id,
      officer_name: validated.officer_name,
      case_risk_score: caseData.risk_score ?? undefined,
      case_risk_level: caseData.risk_level ?? undefined,
      previous_status: caseData.status as CaseStatus,
      new_status: 'escalated',
    });

    if (validated.suspicious_indicators.length > 0) {
      await logSystemEvent(caseId, AUDIT_ACTIONS.STR_REFERRED, {
        description: `STR referral initiated by ${validated.officer_id}. Suspicious indicators: ${validated.suspicious_indicators.join('; ')}`,
        metadata: {
          suspicious_indicators: validated.suspicious_indicators,
          officer_id: validated.officer_id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      case_id: caseId,
      str_referral: {
        officer_id: validated.officer_id,
        reason: validated.reason,
        suspicious_indicators: validated.suspicious_indicators,
        timestamp: new Date().toISOString(),
        status: 'referred_for_str_filing',
      },
      regulatory_context: FINTRAC_STR_CONTEXT,
      message: 'Case referred for STR filing. This action has been recorded in the audit trail. FINTRAC filing must be completed within 30 days.',
    });
  } catch (error) {
    if (error instanceof DecisionValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          field: error.field,
          regulatory_requirement: true,
          regulatory_context: FINTRAC_STR_CONTEXT,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  const supabase = createServerSupabaseClient();

  const { data: caseData } = await supabase
    .from('cases')
    .select('id, status, risk_score, risk_level, applicant_name')
    .eq('id', caseId)
    .single();

  return NextResponse.json({
    case_id: caseId,
    case_summary: caseData ? {
      applicant_name: caseData.applicant_name,
      status: caseData.status,
      risk_score: caseData.risk_score,
      risk_level: caseData.risk_level,
    } : null,
    regulatory_context: FINTRAC_STR_CONTEXT,
    notice: 'STR filing is exclusively a human responsibility. AI systems have flagged potential indicators, but the determination of "reasonable grounds to suspect" must be made by a designated compliance officer.',
  });
}
