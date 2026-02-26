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

    // Verify case exists and is in processable state
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, status')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (caseData.status === 'processing') {
      return NextResponse.json(
        { error: 'Case is already being processed' },
        { status: 409 }
      );
    }

    if (['approved', 'denied'].includes(caseData.status)) {
      return NextResponse.json(
        { error: `Case has already been ${caseData.status}. Cannot reprocess.` },
        { status: 400 }
      );
    }

    // Verify documents exist
    const { count } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('case_id', caseId);

    if (!count || count === 0) {
      return NextResponse.json(
        { error: 'No documents uploaded. Upload at least one document before processing.' },
        { status: 400 }
      );
    }

    // Run the full pipeline (waits for completion in demo mode)
    const pipelineState = await processCaseLifecycle(caseId);

    return NextResponse.json({
      success: pipelineState.stage === 'completed',
      pipeline_state: pipelineState,
      message: pipelineState.stage === 'completed'
        ? 'Case processed successfully. Ready for officer review.'
        : `Processing completed with status: ${pipelineState.stage}`,
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
