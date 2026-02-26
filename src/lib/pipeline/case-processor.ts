import { createServerSupabaseClient } from '@/lib/supabase/server';
import { processCase } from '@/lib/agents/orchestrator';
import { registerAllAgents } from '@/lib/agents/register-all';
import { PipelineState, PipelineStage } from '@/types';
import { createProgressEmitter, removeProgressEmitter } from './progress-emitter';
import { simulateAgentDelay } from './delay-simulator';
import { evaluateConfidenceRouting } from './confidence-router';
import type { Database } from '@/lib/supabase/types';

type CaseRow = Database['public']['Tables']['cases']['Row'];
type DocumentRow = Database['public']['Tables']['documents']['Row'];

// Ensure agents are registered
registerAllAgents();

/**
 * Process a case through the full agent pipeline.
 * This is the main entry point for the case lifecycle.
 *
 * Steps:
 * 1. Load case and documents from Supabase
 * 2. Update case status to 'processing'
 * 3. Run the orchestrator pipeline with progress callbacks
 * 4. Persist each agent result to agent_runs table
 * 5. Update case with final risk score, narrative, status
 * 6. Return the final pipeline state
 */
export async function processCaseLifecycle(caseId: string): Promise<PipelineState> {
  const supabase = createServerSupabaseClient();
  const emitter = createProgressEmitter(caseId);

  try {
    // 1. Load case data
    const { data: caseDataRaw, error: caseError } = await supabase
      .from('cases')
      .select('id, applicant_name, applicant_email, status')
      .eq('id', caseId)
      .single();

    if (caseError || !caseDataRaw) {
      throw new Error(`Case not found: ${caseId}`);
    }
    const caseData = caseDataRaw as Pick<CaseRow, 'id' | 'applicant_name' | 'applicant_email' | 'status'>;

    // 2. Load documents for this case
    const { data: docsRaw, error: docsError } = await supabase
      .from('documents')
      .select('id, file_url, file_path, file_name, type')
      .eq('case_id', caseId);

    if (docsError || !docsRaw || docsRaw.length === 0) {
      throw new Error('No documents found for this case. Upload documents before processing.');
    }
    const documents = docsRaw as Pick<DocumentRow, 'id' | 'file_url' | 'file_path' | 'file_name' | 'type'>[];

    // 3. Update case status to processing
    await supabase
      .from('cases')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', caseId);

    emitter.emit({
      stage: 'initialized',
      status: 'started',
      message: `Starting case processing for ${caseData.applicant_name} with ${documents.length} document(s)`,
    });

    // Log processing start to audit trail
    await supabase.from('audit_logs').insert({
      case_id: caseId,
      action: 'processing_started',
      actor_type: 'system',
      actor_id: 'orchestrator',
      details: { document_count: documents.length },
    });

    // 4. Run the orchestrator pipeline
    const pipelineState = await processCase(
      {
        case_id: caseId,
        documents: documents.map(d => ({
          id: d.id,
          file_url: d.file_url || d.file_path || '',
          file_name: d.file_name,
          type: d.type as 'passport' | 'drivers_license' | 'utility_bill' | 'bank_statement' | 'corporate_doc',
        })),
        applicant_name: caseData.applicant_name,
        applicant_email: caseData.applicant_email || '',
      },
      // Progress callback — emit events for each stage transition
      (state: PipelineState) => {
        emitter.emit({
          stage: state.stage,
          status: state.stage === 'failed' ? 'failed' : state.stage === 'completed' ? 'completed' : 'started',
          message: getStageMessage(state.stage, caseData.applicant_name),
        });
      }
    );

    // 5. Persist agent results to agent_runs table
    const agentResults = [
      { type: 'document_processor', result: pipelineState.document_result },
      { type: 'identity_verifier', result: pipelineState.identity_result },
      { type: 'sanctions_screener', result: pipelineState.sanctions_result },
      { type: 'risk_scorer', result: pipelineState.risk_result },
      { type: 'case_narrator', result: pipelineState.narrative_result },
    ];

    for (const { type, result } of agentResults) {
      if (result) {
        // Emit "started" event
        emitter.emit({
          stage: pipelineState.stage,
          agent_type: type,
          status: 'started',
          message: `${formatAgentName(type)} processing...`,
        });

        // Simulate processing time if the real agent was too fast (< 2s)
        if (result.duration_ms < 2000) {
          await simulateAgentDelay(type);
        }

        await supabase.from('agent_runs').insert({
          case_id: caseId,
          agent_type: type,
          status: result.success ? 'completed' : 'failed',
          started_at: new Date(Date.now() - result.duration_ms).toISOString(),
          completed_at: new Date().toISOString(),
          input: {} as never,
          output: (result.data ?? null) as never,
          confidence: result.confidence,
          error: result.error,
        });

        emitter.emit({
          stage: pipelineState.stage,
          agent_type: type,
          status: result.success ? 'completed' : 'failed',
          message: `${formatAgentName(type)} ${result.success ? 'completed' : 'failed'}`,
          confidence: result.confidence,
          duration_ms: result.duration_ms,
        });
      }
    }

    // 5b. Evaluate confidence routing
    const routing = evaluateConfidenceRouting(pipelineState);

    // Persist routing result to audit trail
    await supabase.from('audit_logs').insert({
      case_id: caseId,
      action: 'confidence_routing_evaluated',
      actor_type: 'system',
      actor_id: 'confidence-router',
      details: {
        requires_manual_review: routing.requires_manual_review,
        routing_reasons: routing.routing_reasons,
        recommended_action: routing.recommended_action,
        low_confidence_agents: routing.low_confidence_agents,
        overall_confidence: routing.overall_confidence,
      },
    });

    if (routing.requires_manual_review) {
      emitter.emit({
        stage: pipelineState.stage,
        status: 'completed',
        message: `Case flagged for manual review: ${routing.routing_reasons.length} concern(s) detected`,
      });
    }

    // 6. Update case with final results
    if (pipelineState.stage === 'completed') {
      const riskData = pipelineState.risk_result?.data;
      const narrativeData = pipelineState.narrative_result?.data;

      await supabase
        .from('cases')
        .update({
          status: 'review',
          risk_score: riskData?.risk_score ?? null,
          risk_level: riskData?.risk_level ?? null,
          narrative: narrativeData?.narrative ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId);

      emitter.emit({
        stage: 'completed',
        status: 'completed',
        message: `Case processing complete. Risk: ${riskData?.risk_level?.toUpperCase() ?? 'UNKNOWN'} (${riskData?.risk_score ?? 0}/100). Ready for review.`,
        confidence: riskData?.risk_score ? riskData.risk_score / 100 : 0,
      });

      // Audit log
      await supabase.from('audit_logs').insert({
        case_id: caseId,
        action: 'processing_completed',
        actor_type: 'system',
        actor_id: 'orchestrator',
        details: {
          risk_score: riskData?.risk_score,
          risk_level: riskData?.risk_level,
          requires_manual_review: riskData?.requires_manual_review,
          recommended_action: narrativeData?.recommended_action,
        },
      });
    } else {
      // Pipeline failed
      await supabase
        .from('cases')
        .update({
          status: 'review', // Even on failure, route to review so officer sees the errors
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId);

      emitter.emit({
        stage: 'failed',
        status: 'failed',
        message: `Processing encountered errors. ${pipelineState.errors.length} error(s). Case routed to manual review.`,
      });
    }

    return pipelineState;

  } finally {
    // Clean up emitter after a delay (let SSE clients catch up)
    setTimeout(() => removeProgressEmitter(caseId), 30000);
  }
}

function getStageMessage(stage: PipelineStage, applicantName: string): string {
  switch (stage) {
    case 'initialized':
      return `Initializing case processing for ${applicantName}...`;
    case 'document_processing':
      return 'Processing documents with OCR and extracting structured data...';
    case 'parallel_verification':
      return 'Running identity verification and sanctions screening in parallel...';
    case 'risk_scoring':
      return 'Calculating composite risk score from all agent signals...';
    case 'narrative_generation':
      return 'Generating case narrative and risk assessment...';
    case 'completed':
      return 'All agents completed. Case ready for officer review.';
    case 'failed':
      return 'Processing encountered errors. Routing to manual review.';
    default:
      return `Pipeline stage: ${stage}`;
  }
}

function formatAgentName(agentType: string): string {
  const names: Record<string, string> = {
    document_processor: 'Document Processor',
    identity_verifier: 'Identity Verifier',
    sanctions_screener: 'Sanctions Screener',
    risk_scorer: 'Risk Scorer',
    case_narrator: 'Case Narrator',
  };
  return names[agentType] || agentType;
}
