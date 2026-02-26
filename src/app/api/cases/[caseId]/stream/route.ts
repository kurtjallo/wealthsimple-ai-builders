import { NextRequest } from 'next/server';
import { processCase } from '@/lib/agents/orchestrator';
import { registerAllStubs } from '@/lib/agents/stubs';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PipelineState } from '@/types';
import type { Database } from '@/lib/supabase/types';

type CaseRow = Database['public']['Tables']['cases']['Row'];
type DocumentRow = Database['public']['Tables']['documents']['Row'];

// Register agents (stubs until real agents replace them)
registerAllStubs();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params;

  // Set up SSE response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send SSE events
      function sendEvent(event: string, data: unknown) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      try {
        // Load case from Supabase to get processing input
        const supabase = createServerSupabaseClient();
        const caseResult = await supabase
          .from('cases')
          .select('*')
          .eq('id', caseId)
          .single();
        const caseData = caseResult.data as CaseRow | null;

        if (caseResult.error || !caseData) {
          sendEvent('error', { message: `Case not found: ${caseId}` });
          controller.close();
          return;
        }

        // Load documents for this case
        const docsResult = await supabase
          .from('documents')
          .select('*')
          .eq('case_id', caseId);
        const documents = (docsResult.data || []) as DocumentRow[];

        // Update case status to processing
        await supabase
          .from('cases')
          .update({ status: 'processing' })
          .eq('id', caseId);

        sendEvent('connected', { case_id: caseId, timestamp: new Date().toISOString() });

        // Process the case with real-time callbacks
        const pipelineState = await processCase(
          {
            case_id: caseId,
            documents: documents.map(doc => ({
              id: doc.id,
              file_url: doc.file_url || '',
              file_name: doc.file_name,
              type: doc.type as 'passport' | 'drivers_license' | 'utility_bill' | 'bank_statement' | 'corporate_doc',
            })),
            applicant_name: caseData.applicant_name,
            applicant_email: caseData.applicant_email || '',
          },
          (state: PipelineState) => {
            // Stream each state change to the client
            sendEvent('pipeline_update', {
              stage: state.stage,
              updated_at: state.updated_at,
              document_result: state.document_result ? {
                success: state.document_result.success,
                confidence: state.document_result.confidence,
                duration_ms: state.document_result.duration_ms,
                agent_type: state.document_result.agent_type,
              } : null,
              identity_result: state.identity_result ? {
                success: state.identity_result.success,
                confidence: state.identity_result.confidence,
                duration_ms: state.identity_result.duration_ms,
                agent_type: state.identity_result.agent_type,
              } : null,
              sanctions_result: state.sanctions_result ? {
                success: state.sanctions_result.success,
                confidence: state.sanctions_result.confidence,
                duration_ms: state.sanctions_result.duration_ms,
                agent_type: state.sanctions_result.agent_type,
              } : null,
              risk_result: state.risk_result ? {
                success: state.risk_result.success,
                confidence: state.risk_result.confidence,
                duration_ms: state.risk_result.duration_ms,
                agent_type: state.risk_result.agent_type,
              } : null,
              narrative_result: state.narrative_result ? {
                success: state.narrative_result.success,
                confidence: state.narrative_result.confidence,
                duration_ms: state.narrative_result.duration_ms,
                agent_type: state.narrative_result.agent_type,
              } : null,
              errors: state.errors,
            });

            // Also update agent_runs table in Supabase for persistence
            updateAgentRuns(supabase, caseId, state).catch(console.error);
          },
        );

        // Send final complete event with full pipeline state
        sendEvent('pipeline_complete', pipelineState);

        // Update case with final results
        if (pipelineState.stage === 'completed' && pipelineState.risk_result?.data) {
          await supabase
            .from('cases')
            .update({
              status: 'review',
              risk_score: pipelineState.risk_result.data.risk_score,
              risk_level: pipelineState.risk_result.data.risk_level,
              narrative: pipelineState.narrative_result?.data?.narrative || null,
            })
            .eq('id', caseId);
        } else if (pipelineState.stage === 'failed') {
          await supabase
            .from('cases')
            .update({ status: 'pending' })
            .eq('id', caseId);
        }

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        sendEvent('error', { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  });
}

// Helper: update agent_runs table based on pipeline state
async function updateAgentRuns(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  caseId: string,
  state: PipelineState,
) {
  const agentResults = [
    { type: 'document_processor', result: state.document_result },
    { type: 'identity_verifier', result: state.identity_result },
    { type: 'sanctions_screener', result: state.sanctions_result },
    { type: 'risk_scorer', result: state.risk_result },
    { type: 'case_narrator', result: state.narrative_result },
  ];

  for (const { type, result } of agentResults) {
    if (result) {
      await supabase
        .from('agent_runs')
        .upsert(
          {
            case_id: caseId,
            agent_type: type,
            status: result.success ? 'completed' : 'failed',
            started_at: state.started_at,
            completed_at: new Date().toISOString(),
            output: result.data as any,
            confidence: result.confidence,
            error: result.error,
          },
          { onConflict: 'case_id,agent_type', ignoreDuplicates: false }
        );
    }
  }

  // Create 'running' entries for agents in current stage that haven't completed
  const runningAgents = getRunningAgents(state.stage);
  for (const agentType of runningAgents) {
    const existing = agentResults.find(a => a.type === agentType && a.result);
    if (!existing) {
      await supabase
        .from('agent_runs')
        .upsert(
          {
            case_id: caseId,
            agent_type: agentType,
            status: 'running',
            started_at: new Date().toISOString(),
          },
          { onConflict: 'case_id,agent_type', ignoreDuplicates: false }
        );
    }
  }
}

function getRunningAgents(stage: string): string[] {
  switch (stage) {
    case 'document_processing': return ['document_processor'];
    case 'parallel_verification': return ['identity_verifier', 'sanctions_screener'];
    case 'risk_scoring': return ['risk_scorer'];
    case 'narrative_generation': return ['case_narrator'];
    default: return [];
  }
}
