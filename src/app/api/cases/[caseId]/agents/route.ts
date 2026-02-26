import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

type AgentRunRow = Database['public']['Tables']['agent_runs']['Row'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params;
  const supabase = createServerSupabaseClient();

  const result = await supabase
    .from('agent_runs')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });
  const agentRuns = (result.data || []) as AgentRunRow[];

  if (result.error) {
    return NextResponse.json(
      { error: `Failed to fetch agent runs: ${result.error.message}` },
      { status: 500 },
    );
  }

  // Build per-agent status map
  const agentStatus: Record<string, {
    status: string;
    confidence: number | null;
    duration_ms: number | null;
    error: string | null;
    started_at: string | null;
    completed_at: string | null;
  }> = {};

  const allAgentTypes = [
    'document_processor',
    'identity_verifier',
    'sanctions_screener',
    'risk_scorer',
    'case_narrator',
  ];

  for (const agentType of allAgentTypes) {
    const run = agentRuns.find(r => r.agent_type === agentType);
    agentStatus[agentType] = run
      ? {
          status: run.status,
          confidence: run.confidence,
          duration_ms: run.completed_at && run.started_at
            ? new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()
            : null,
          error: run.error,
          started_at: run.started_at,
          completed_at: run.completed_at,
        }
      : {
          status: 'pending',
          confidence: null,
          duration_ms: null,
          error: null,
          started_at: null,
          completed_at: null,
        };
  }

  return NextResponse.json({
    case_id: caseId,
    agents: agentStatus,
    total: agentRuns.length,
    timestamp: new Date().toISOString(),
  });
}
