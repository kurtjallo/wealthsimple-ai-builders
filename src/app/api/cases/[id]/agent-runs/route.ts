import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const supabase = createServerSupabaseClient();

    // Verify case exists
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Fetch all agent runs for this case
    const { data: agentRuns, error } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch agent runs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agent_runs: agentRuns || [],
      case_id: caseId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
