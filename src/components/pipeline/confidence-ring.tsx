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

  // Color based on confidence level
  const color =
    confidence >= 0.9 ? '#10b981' : // emerald-500
    confidence >= 0.7 ? '#3b82f6' : // blue-500
    confidence >= 0.5 ? '#f59e0b' : // amber-500
    '#ef4444'; // red-500

  const percentage = Math.round(confidence * 100);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
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
        className="absolute text-xs font-bold"
        style={{ color }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {percentage}%
      </motion.span>
    </div>
  );
}
