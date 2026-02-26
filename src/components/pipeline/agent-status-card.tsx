'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AgentStatusBadge } from './agent-status-badge';
import { cn } from '@/lib/utils';
import { AgentRunStatus } from '@/types';
import {
  FileText,
  UserCheck,
  ShieldAlert,
  BarChart3,
  FileEdit,
  type LucideIcon,
} from 'lucide-react';

interface AgentStatusCardProps {
  label: string;
  description: string;
  agentType: string;
  status: AgentRunStatus;
  confidence: number | null;
  durationMs: number | null;
  error: string | null;
  className?: string;
}

// Icon mapping for each agent type
const AGENT_ICONS: Record<string, LucideIcon> = {
  document_processor: FileText,
  identity_verifier: UserCheck,
  sanctions_screener: ShieldAlert,
  risk_scorer: BarChart3,
  case_narrator: FileEdit,
};

// Border color based on status
const STATUS_BORDER: Record<AgentRunStatus, string> = {
  pending: 'border-slate-200',
  running: 'border-blue-400 shadow-blue-100 shadow-md',
  completed: 'border-emerald-400 shadow-emerald-100 shadow-sm',
  failed: 'border-red-400 shadow-red-100 shadow-sm',
};

export function AgentStatusCard({
  label,
  description,
  agentType,
  status,
  confidence,
  durationMs,
  error,
  className,
}: AgentStatusCardProps) {
  const Icon = AGENT_ICONS[agentType] || FileText;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-500',
        STATUS_BORDER[status],
        status === 'running' && 'ring-2 ring-blue-200 ring-offset-1',
        status === 'pending' && 'opacity-60',
        className,
      )}
    >
      {/* Progress bar for running state */}
      {status === 'running' && (
        <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-blue-100">
          <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
      )}

      {/* Success bar for completed state */}
      {status === 'completed' && (
        <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
      )}

      {/* Error bar for failed state */}
      {status === 'failed' && (
        <div className="absolute top-0 left-0 h-1 w-full bg-red-500" />
      )}

      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              status === 'pending' && 'bg-slate-100 text-slate-400',
              status === 'running' && 'bg-blue-100 text-blue-600',
              status === 'completed' && 'bg-emerald-100 text-emerald-600',
              status === 'failed' && 'bg-red-100 text-red-600',
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-none">{label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          <AgentStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3 pt-0">
        {/* Completed state: show confidence and duration */}
        {status === 'completed' && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {confidence !== null && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-emerald-600">
                  {(confidence * 100).toFixed(0)}%
                </span>
                <span>confidence</span>
              </div>
            )}
            {durationMs !== null && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-slate-600">
                  {durationMs < 1000
                    ? `${durationMs}ms`
                    : `${(durationMs / 1000).toFixed(1)}s`}
                </span>
                <span>elapsed</span>
              </div>
            )}
          </div>
        )}

        {/* Running state: show processing indicator */}
        {status === 'running' && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <div className="flex gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
            </div>
            <span>Processing...</span>
          </div>
        )}

        {/* Failed state: show error */}
        {status === 'failed' && error && (
          <p className="text-xs text-red-600 truncate" title={error}>
            {error}
          </p>
        )}

        {/* Pending state: show waiting message */}
        {status === 'pending' && (
          <p className="text-xs text-muted-foreground">Waiting to start...</p>
        )}
      </CardContent>
    </Card>
  );
}
