import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

interface CreateCaseRequest {
  applicant_name: string;
  applicant_email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCaseRequest = await request.json();

    if (!body.applicant_name || !body.applicant_email) {
      return NextResponse.json(
        { error: 'applicant_name and applicant_email are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const caseId = randomUUID();

    const { data: newCase, error } = await supabase
      .from('cases')
      .insert({
        id: caseId,
        applicant_name: body.applicant_name,
        applicant_email: body.applicant_email,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create case: ${error.message}`);
    }

    // Log case creation to audit trail
    await supabase.from('audit_logs').insert({
      case_id: caseId,
      action: 'case_created',
      actor_type: 'officer',
      actor_id: 'demo-officer',
      details: {
        applicant_name: body.applicant_name,
        applicant_email: body.applicant_email,
      },
    });

    return NextResponse.json({ case: newCase }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create case' },
      { status: 500 }
    );
  }
}
