import { PipelineStage } from '@/types';

export interface ProgressEvent {
  case_id: string;
  stage: PipelineStage;
  agent_type?: string;
  status: 'started' | 'completed' | 'failed';
  message: string;
  confidence?: number;
  timestamp: string;
  duration_ms?: number;
}

type ProgressListener = (event: ProgressEvent) => void;

/**
 * Simple event emitter for pipeline progress.
 * Used to bridge the orchestrator's state callbacks to SSE/polling endpoints.
 */
export class ProgressEmitter {
  private listeners: ProgressListener[] = [];
  private events: ProgressEvent[] = [];
  readonly caseId: string;

  constructor(caseId: string) {
    this.caseId = caseId;
  }

  on(listener: ProgressListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  emit(event: Omit<ProgressEvent, 'case_id' | 'timestamp'>): void {
    const fullEvent: ProgressEvent = {
      ...event,
      case_id: this.caseId,
      timestamp: new Date().toISOString(),
    };
    this.events.push(fullEvent);
    this.listeners.forEach(l => l(fullEvent));
  }

  getEvents(): ProgressEvent[] {
    return [...this.events];
  }
}

// In-memory store of active pipelines (single-server demo)
const activePipelines = new Map<string, ProgressEmitter>();

// Track creation times for TTL-based cleanup
const emitterTimestamps = new Map<string, number>();
const EMITTER_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanupIfNeeded(): void {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [caseId, createdAt] of emitterTimestamps) {
      if (now - createdAt > EMITTER_TTL_MS) {
        activePipelines.delete(caseId);
        emitterTimestamps.delete(caseId);
      }
    }
    // Stop interval if no more emitters to avoid keeping the process alive
    if (activePipelines.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }, 60_000);
}

export function createProgressEmitter(caseId: string): ProgressEmitter {
  const emitter = new ProgressEmitter(caseId);
  activePipelines.set(caseId, emitter);
  emitterTimestamps.set(caseId, Date.now());
  startCleanupIfNeeded();
  return emitter;
}

export function getProgressEmitter(caseId: string): ProgressEmitter | undefined {
  return activePipelines.get(caseId);
}

export function removeProgressEmitter(caseId: string): void {
  activePipelines.delete(caseId);
  emitterTimestamps.delete(caseId);
}
