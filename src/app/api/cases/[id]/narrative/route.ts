import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { registerAllAgents } from '@/lib/agents/register-all';
import { runAgent } from '@/lib/agents/base-agent';
import { AGENT_CONFIGS } from '@/lib/agents/agent-config';
import { caseNarratorHandler } from '@/lib/agents/case-narrator';
import type { CaseNarratorInput, AgentResult } from '@/types';
import type { Database, Json } from '@/lib/supabase/types';

type CaseRow = Database['public']['Tables']['cases']['Row'];
type AgentRunRow = Database['public']['Tables']['agent_runs']['Row'];

// Ensure agents are registered
registerAllAgents();

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: caseId } = await params;

  try {
    const supabase = createServerSupabaseClient();

    // 1. Load case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single() as { data: CaseRow | null; error: { message: string } | null };

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // 2. Load all completed upstream agent results
    const { data: agentRuns } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('case_id', caseId)
      .in('agent_type', ['document_processor', 'identity_verifier', 'sanctions_screener', 'risk_scorer'])
      .eq('status', 'completed')
      .order('completed_at', { ascending: false }) as { data: AgentRunRow[] | null; error: unknown };

    const docRun = agentRuns?.find((r) => r.agent_type === 'document_processor');
    const idRun = agentRuns?.find((r) => r.agent_type === 'identity_verifier');
    const sanctionsRun = agentRuns?.find((r) => r.agent_type === 'sanctions_screener');
    const riskRun = agentRuns?.find((r) => r.agent_type === 'risk_scorer');

    if (!riskRun) {
      return NextResponse.json(
        { error: 'Risk scoring must complete before narrative generation.' },
        { status: 400 },
      );
    }

    // 3. Build AgentResult objects from stored runs
    const buildResult = <T>(run: AgentRunRow | undefined): AgentResult<T> => ({
      success: run?.status === 'completed',
      data: (run?.output as T) ?? null,
      error: run?.error ?? null,
      confidence: run?.confidence ?? 0,
      duration_ms: 0,
      agent_type: (run?.agent_type ?? 'orchestrator') as AgentResult<T>['agent_type'],
      metadata: {},
    });

    const narrativeInput: CaseNarratorInput = {
      case_id: caseId,
      applicant_name: caseData.applicant_name,
      document_result: buildResult(docRun),
      identity_result: buildResult(idRun),
      sanctions_result: buildResult(sanctionsRun),
      risk_result: buildResult(riskRun),
    };

    // 4. Run case narrator
    const result = await runAgent(
      'case_narrator',
      narrativeInput,
      AGENT_CONFIGS.case_narrator,
      caseNarratorHandler,
    );

    // 5. Persist agent run
    await supabase.from('agent_runs').insert({
      case_id: caseId,
      agent_type: 'case_narrator',
      status: result.success ? 'completed' : 'failed',
      started_at: new Date(Date.now() - result.duration_ms).toISOString(),
      completed_at: new Date().toISOString(),
      input: narrativeInput as unknown as Json,
      output: result.data as unknown as Json,
      confidence: result.confidence,
      error: result.error,
    });

    // 6. Update case with narrative and set to review
    if (result.success && result.data) {
      const terminalStatuses = ['approved', 'denied'];
      await supabase.from('cases').update({
        narrative: result.data.narrative,
        status: terminalStatuses.includes(caseData.status) ? caseData.status : 'review',
      }).eq('id', caseId);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 },
    );
  }
}
