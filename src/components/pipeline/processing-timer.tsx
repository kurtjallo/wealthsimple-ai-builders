'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ProcessingTimerProps {
  isRunning: boolean;
  className?: string;
}

export function ProcessingTimer({ isRunning, className }: ProcessingTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      setElapsed(0);

      const tick = () => {
        if (startTimeRef.current) {
          setElapsed(Date.now() - startTimeRef.current);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    } else {
      // Stop timer but keep the final elapsed value
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [isRunning]);

  // Format elapsed time
  const seconds = (elapsed / 1000).toFixed(1);

  return (
    <motion.div
      className={cn(
        'flex items-center gap-1.5 text-xs font-mono',
        isRunning ? 'text-primary' : 'text-muted-foreground',
        className,
      )}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Clock className={cn(
        'h-3 w-3',
        isRunning && 'animate-spin [animation-duration:3s]',
      )} />
      <span>{seconds}s</span>
    </motion.div>
  );
}
