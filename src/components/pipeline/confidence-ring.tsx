'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfidenceRingProps {
  confidence: number; // 0-1
  size?: number;      // px, default 48
  strokeWidth?: number; // px, default 3
  className?: string;
}

export function ConfidenceRing({
  confidence,
  size = 48,
  strokeWidth = 3,
  className,
}: ConfidenceRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - confidence * circumference;

  // Color based on confidence level (Tailwind color tokens)
  const strokeClass =
    confidence >= 0.9 ? 'stroke-emerald-500' :
    confidence >= 0.7 ? 'stroke-blue-500' :
    confidence >= 0.5 ? 'stroke-amber-500' :
    'stroke-red-500';

  const textClass =
    confidence >= 0.9 ? 'text-emerald-500' :
    confidence >= 0.7 ? 'text-blue-500' :
    confidence >= 0.5 ? 'text-amber-500' :
    'text-red-500';

  const percentage = Math.round(confidence * 100);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-border"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn('fill-none', strokeClass)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1], // ease-out cubic
            delay: 0.2,
          }}
        />
      </svg>
      {/* Center text */}
      <motion.span
        className={cn('absolute text-xs font-bold', textClass)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {percentage}%
      </motion.span>
    </div>
  );
}
