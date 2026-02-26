'use client';

import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'online' | 'degraded' | 'offline' | 'pending' | 'running' | 'completed' | 'failed';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  pulse?: boolean;
}

const SIZE_MAP = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
};

const COLOR_MAP: Record<string, string> = {
  online: 'bg-emerald-500',
  completed: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  running: 'bg-blue-500',
  pending: 'bg-slate-400',
  offline: 'bg-red-500',
  failed: 'bg-red-500',
};

const PULSE_COLOR_MAP: Record<string, string> = {
  online: 'bg-emerald-400',
  completed: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  running: 'bg-blue-400',
  pending: 'bg-slate-300',
  offline: 'bg-red-400',
  failed: 'bg-red-400',
};

export function StatusDot({
  status,
  size = 'sm',
  className,
  pulse,
}: StatusDotProps) {
  const shouldPulse = pulse ?? (status === 'running' || status === 'online');

  return (
    <span className={cn('relative inline-flex', className)}>
      {shouldPulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            PULSE_COLOR_MAP[status] || 'bg-slate-300',
          )}
        />
      )}
      <span
        className={cn(
          'relative inline-flex rounded-full',
          SIZE_MAP[size],
          COLOR_MAP[status] || 'bg-slate-400',
        )}
      />
    </span>
  );
}
