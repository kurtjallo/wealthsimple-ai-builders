'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AgentStatusBadge } from './agent-status-badge';
import { ConfidenceRing } from './confidence-ring';
import { ProcessingTimer } from './processing-timer';
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
  pending: 'border-border',
  running: 'border-primary',
  completed: 'border-emerald-500',
  failed: 'border-red-500',
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{
        opacity: status === 'pending' ? 0.6 : 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-500',
          STATUS_BORDER[status],
          status === 'running' && 'ring-2 ring-primary/30 ring-offset-1 ring-offset-background animate-glow-pulse',
          className,
        )}
      >
        {/* Progress bar for running state */}
        {status === 'running' && (
          <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-primary/10">
            <div className="h-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
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
                status === 'pending' && 'bg-muted text-muted-foreground',
                status === 'running' && 'bg-primary/10 text-primary',
                status === 'completed' && 'bg-emerald-50 text-emerald-600',
                status === 'failed' && 'bg-red-50 text-red-600',
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
            <motion.div
              className="flex items-center gap-4 text-xs text-muted-foreground"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {confidence !== null && (
                <div className="flex items-center gap-2">
                  <ConfidenceRing confidence={confidence} size={36} strokeWidth={2.5} />
                  <span>confidence</span>
                </div>
              )}
              {durationMs !== null && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-muted-foreground">
                    {durationMs < 1000
                      ? `${durationMs}ms`
                      : `${(durationMs / 1000).toFixed(1)}s`}
                  </span>
                  <span>elapsed</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Running state: show processing indicator */}
          {status === 'running' && (
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 text-xs text-primary">
                <div className="flex gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                </div>
                <span>Processing...</span>
              </div>
              <ProcessingTimer isRunning={true} />
            </motion.div>
          )}

          {/* Failed state: show error */}
          {status === 'failed' && error && (
            <motion.p
              className="text-xs text-red-600 truncate"
              title={error}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              {error}
            </motion.p>
          )}

          {/* Pending state: show waiting message */}
          {status === 'pending' && (
            <p className="text-xs text-muted-foreground">Waiting to start...</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
