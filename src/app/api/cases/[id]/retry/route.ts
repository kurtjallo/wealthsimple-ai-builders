import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { processCaseLifecycle } from '@/lib/pipeline/case-processor';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const supabase = createServerSupabaseClient();

    // Verify case exists
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, status')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Can only retry cases in 'review' or 'pending' status
    if (!['review', 'pending'].includes(caseData.status)) {
      return NextResponse.json(
        { error: `Cannot retry case with status '${caseData.status}'` },
        { status: 400 }
      );
    }

    // Reset case status to pending for reprocessing
    await supabase
      .from('cases')
      .update({
        status: 'pending',
        risk_score: null,
        risk_level: null,
        narrative: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', caseId);

    // Log retry to audit trail
    await supabase.from('audit_logs').insert({
      case_id: caseId,
      action: 'processing_retried',
      actor_type: 'officer',
      actor_id: 'demo-officer',
      details: { previous_status: caseData.status },
    });

    // Re-run the pipeline
    const pipelineState = await processCaseLifecycle(caseId);

    return NextResponse.json({
      success: pipelineState.stage === 'completed',
      pipeline_state: pipelineState,
      message: pipelineState.stage === 'completed'
        ? 'Retry successful. Case reprocessed and ready for review.'
        : `Retry completed with status: ${pipelineState.stage}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Retry failed' },
      { status: 500 }
    );
  }
}
