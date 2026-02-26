'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-slate-200', className)} />
  );
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-4 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function TableRowSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4 px-4 py-3 border-b', className)}>
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-20 ml-auto" />
    </div>
  );
}

export function TextBlockSkeleton({
  lines = 3,
  className,
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <Skeleton className="h-9 w-9 rounded-full" />
            {i < 4 && <Skeleton className="h-0.5 w-8" />}
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md"><CardSkeleton /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-md"><CardSkeleton /></div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-md"><CardSkeleton /></div>
        </div>
      </div>
    </div>
  );
}
