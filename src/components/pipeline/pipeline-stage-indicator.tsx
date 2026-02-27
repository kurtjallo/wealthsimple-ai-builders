'use client';

import { motion } from 'framer-motion';
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
          <motion.div
            key={stage.id}
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Stage node */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-500',
                  isActive && 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10',
                  isCompleted && 'border-emerald-500 bg-emerald-500/5 text-emerald-600',
                  isPending && 'border-border bg-muted text-muted-foreground',
                )}
                animate={{
                  scale: isActive ? [1, 1.15, 1] : 1,
                }}
                transition={{
                  scale: {
                    duration: 0.5,
                    ease: 'easeInOut',
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 1,
                  },
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} strokeWidth={1.5} />
                ) : (
                  <Icon size={16} strokeWidth={1.5} />
                )}
              </motion.div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isActive && 'text-primary',
                  isCompleted && 'text-emerald-600',
                  isPending && 'text-muted-foreground',
                )}
              >
                {stage.label}
              </span>
            </div>

            {/* Connector line between stages (except last) */}
            {index < STAGES.length - 1 && (
              <motion.div
                className={cn(
                  'h-0.5 w-8 mx-1 mt-[-16px]',
                  isCompleted ? 'bg-emerald-500' : 'bg-border',
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
