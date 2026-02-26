'use client';

import { PipelineStage } from '@/types';
import { cn } from '@/lib/utils';
import {
  FileText,
  Users,
  BarChart3,
  FileEdit,
  CheckCircle2,
} from 'lucide-react';

interface PipelineStageIndicatorProps {
  currentStage: PipelineStage | null;
  className?: string;
}

const STAGES: Array<{
  id: PipelineStage;
  label: string;
  icon: typeof FileText;
}> = [
  { id: 'document_processing', label: 'Documents', icon: FileText },
  { id: 'parallel_verification', label: 'Verification', icon: Users },
  { id: 'risk_scoring', label: 'Risk Scoring', icon: BarChart3 },
  { id: 'narrative_generation', label: 'Narrative', icon: FileEdit },
  { id: 'completed', label: 'Complete', icon: CheckCircle2 },
];

const STAGE_ORDER: Record<string, number> = {
  initialized: 0,
  document_processing: 1,
  parallel_verification: 2,
  risk_scoring: 3,
  narrative_generation: 4,
  completed: 5,
  failed: -1,
};

export function PipelineStageIndicator({
  currentStage,
  className,
}: PipelineStageIndicatorProps) {
  const currentOrder = currentStage ? (STAGE_ORDER[currentStage] ?? 0) : 0;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {STAGES.map((stage, index) => {
        const stageOrder = STAGE_ORDER[stage.id] ?? index + 1;
        const isActive = currentStage === stage.id;
        const isCompleted = currentOrder > stageOrder;
        const isPending = currentOrder < stageOrder;

        const Icon = stage.icon;

        return (
          <div key={stage.id} className="flex items-center">
            {/* Stage node */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500',
                  isActive && 'border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-100',
                  isCompleted && 'border-emerald-500 bg-emerald-50 text-emerald-600',
                  isPending && 'border-slate-200 bg-slate-50 text-slate-400',
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isActive && 'text-blue-600',
                  isCompleted && 'text-emerald-600',
                  isPending && 'text-slate-400',
                )}
              >
                {stage.label}
              </span>
            </div>

            {/* Connector line between stages (except last) */}
            {index < STAGES.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 mx-1 mt-[-16px] transition-colors duration-500',
                  isCompleted ? 'bg-emerald-400' : 'bg-slate-200',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
