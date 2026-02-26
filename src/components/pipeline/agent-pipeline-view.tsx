'use client';

import { AgentStatusCard } from './agent-status-card';
import { PipelineStageIndicator } from './pipeline-stage-indicator';
import { AgentStatusInfo } from '@/lib/hooks/use-agent-status';
import { PipelineUpdate, StreamStatus } from '@/lib/hooks/use-pipeline-stream';
import { cn } from '@/lib/utils';

interface AgentPipelineViewProps {
  agents: AgentStatusInfo[];
  pipelineUpdate: PipelineUpdate | null;
  streamStatus: StreamStatus;
  className?: string;
}

export function AgentPipelineView({
  agents,
  pipelineUpdate,
  streamStatus,
  className,
}: AgentPipelineViewProps) {
  // Group agents by execution order/wave
  const docProcessor = agents.find(a => a.agentType === 'document_processor');
  const identityVerifier = agents.find(a => a.agentType === 'identity_verifier');
  const sanctionsScreener = agents.find(a => a.agentType === 'sanctions_screener');
  const riskScorer = agents.find(a => a.agentType === 'risk_scorer');
  const caseNarrator = agents.find(a => a.agentType === 'case_narrator');

  const currentStage = pipelineUpdate?.stage ?? null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Pipeline stage progress bar */}
      <div className="flex justify-center">
        <PipelineStageIndicator currentStage={currentStage} />
      </div>

      {/* Stream status indicator */}
      {streamStatus === 'connecting' && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          Connecting to pipeline...
        </div>
      )}

      {/* Agent cards in pipeline layout */}
      <div className="space-y-4">
        {/* Stage 1: Document Processing (single agent, full width) */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {docProcessor && (
              <AgentStatusCard
                label={docProcessor.label}
                description={docProcessor.description}
                agentType={docProcessor.agentType}
                status={docProcessor.status}
                confidence={docProcessor.confidence}
                durationMs={docProcessor.durationMs}
                error={docProcessor.error}
              />
            )}
          </div>
        </div>

        {/* Connector arrow from doc processor to parallel stage */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              'h-6 w-0.5',
              (currentStage && ['parallel_verification', 'risk_scoring', 'narrative_generation', 'completed'].includes(currentStage))
                ? 'bg-emerald-400'
                : 'bg-slate-200',
            )} />
            {/* Fork indicator for parallel */}
            <div className={cn(
              'h-0.5 w-48',
              (currentStage && ['parallel_verification', 'risk_scoring', 'narrative_generation', 'completed'].includes(currentStage))
                ? 'bg-emerald-400'
                : 'bg-slate-200',
            )} />
          </div>
        </div>

        {/* Stage 2: Parallel Verification (two agents side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {identityVerifier && (
            <AgentStatusCard
              label={identityVerifier.label}
              description={identityVerifier.description}
              agentType={identityVerifier.agentType}
              status={identityVerifier.status}
              confidence={identityVerifier.confidence}
              durationMs={identityVerifier.durationMs}
              error={identityVerifier.error}
            />
          )}
          {sanctionsScreener && (
            <AgentStatusCard
              label={sanctionsScreener.label}
              description={sanctionsScreener.description}
              agentType={sanctionsScreener.agentType}
              status={sanctionsScreener.status}
              confidence={sanctionsScreener.confidence}
              durationMs={sanctionsScreener.durationMs}
              error={sanctionsScreener.error}
            />
          )}
        </div>

        {/* Connector arrow from parallel stage to risk scoring */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className={cn(
              'h-0.5 w-48',
              (currentStage && ['risk_scoring', 'narrative_generation', 'completed'].includes(currentStage))
                ? 'bg-emerald-400'
                : 'bg-slate-200',
            )} />
            <div className={cn(
              'h-6 w-0.5',
              (currentStage && ['risk_scoring', 'narrative_generation', 'completed'].includes(currentStage))
                ? 'bg-emerald-400'
                : 'bg-slate-200',
            )} />
          </div>
        </div>

        {/* Stage 3: Risk Scoring (single agent) */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {riskScorer && (
              <AgentStatusCard
                label={riskScorer.label}
                description={riskScorer.description}
                agentType={riskScorer.agentType}
                status={riskScorer.status}
                confidence={riskScorer.confidence}
                durationMs={riskScorer.durationMs}
                error={riskScorer.error}
              />
            )}
          </div>
        </div>

        {/* Connector arrow from risk scoring to narrative */}
        <div className="flex justify-center">
          <div className={cn(
            'h-6 w-0.5',
            (currentStage && ['narrative_generation', 'completed'].includes(currentStage))
              ? 'bg-emerald-400'
              : 'bg-slate-200',
          )} />
        </div>

        {/* Stage 4: Case Narrative (single agent) */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {caseNarrator && (
              <AgentStatusCard
                label={caseNarrator.label}
                description={caseNarrator.description}
                agentType={caseNarrator.agentType}
                status={caseNarrator.status}
                confidence={caseNarrator.confidence}
                durationMs={caseNarrator.durationMs}
                error={caseNarrator.error}
              />
            )}
          </div>
        </div>
      </div>

      {/* Error summary */}
      {pipelineUpdate && pipelineUpdate.errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 max-w-2xl mx-auto">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Pipeline Errors</h4>
          <ul className="space-y-1">
            {pipelineUpdate.errors.map((err, i) => (
              <li key={i} className="text-xs text-red-700">
                [{err.stage}] {err.agent_type}: {err.error_message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
