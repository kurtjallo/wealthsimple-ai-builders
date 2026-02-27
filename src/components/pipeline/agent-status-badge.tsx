'use client';

import { Badge } from '@/components/ui/badge';
import { AgentRunStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AgentStatusBadgeProps {
  status: AgentRunStatus;
  className?: string;
}

const STATUS_CONFIG: Record<AgentRunStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}> = {
  pending: {
    label: 'Pending',
    variant: 'outline',
    className: 'border-border text-muted-foreground bg-muted',
  },
  running: {
    label: 'Running',
    variant: 'default',
    className: 'bg-primary text-primary-foreground border-primary animate-pulse',
  },
  completed: {
    label: 'Complete',
    variant: 'default',
    className: 'bg-emerald-500 text-white border-emerald-500',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    className: 'bg-red-500 text-white border-red-500',
  },
};

export function AgentStatusBadge({ status, className }: AgentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status === 'running' && (
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
      )}
      {config.label}
    </Badge>
  );
}
