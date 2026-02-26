'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PipelineStage } from '@/types';

// Lightweight pipeline update (what SSE sends — not the full PipelineState)
export interface PipelineUpdate {
  stage: PipelineStage;
  updated_at: string;
  document_result: AgentResultSummary | null;
  identity_result: AgentResultSummary | null;
  sanctions_result: AgentResultSummary | null;
  risk_result: AgentResultSummary | null;
  narrative_result: AgentResultSummary | null;
  errors: Array<{ stage: string; agent_type: string; error_message: string }>;
}

export interface AgentResultSummary {
  success: boolean;
  confidence: number;
  duration_ms: number;
  agent_type: string;
}

export type StreamStatus = 'idle' | 'connecting' | 'connected' | 'completed' | 'error';

export interface UsePipelineStreamReturn {
  status: StreamStatus;
  pipelineUpdate: PipelineUpdate | null;
  completePipelineState: unknown | null; // Full state on completion
  error: string | null;
  startStream: (caseId: string) => void;
  stopStream: () => void;
}

export function usePipelineStream(): UsePipelineStreamReturn {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [pipelineUpdate, setPipelineUpdate] = useState<PipelineUpdate | null>(null);
  const [completePipelineState, setCompletePipelineState] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const statusRef = useRef<StreamStatus>('idle');

  // Keep statusRef in sync
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const startStream = useCallback((caseId: string) => {
    // Clean up any existing connection
    stopStream();

    setStatus('connecting');
    setError(null);
    setPipelineUpdate(null);
    setCompletePipelineState(null);

    const eventSource = new EventSource(`/api/cases/${caseId}/stream`);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('connected', () => {
      setStatus('connected');
    });

    eventSource.addEventListener('pipeline_update', (event) => {
      try {
        const data: PipelineUpdate = JSON.parse(event.data);
        setPipelineUpdate(data);
      } catch (e) {
        console.error('Failed to parse pipeline update:', e);
      }
    });

    eventSource.addEventListener('pipeline_complete', (event) => {
      try {
        const data = JSON.parse(event.data);
        setCompletePipelineState(data);
        setStatus('completed');
      } catch (e) {
        console.error('Failed to parse pipeline complete:', e);
      }
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.addEventListener('error', (event) => {
      // Check if it's an SSE error event with data
      if (event instanceof MessageEvent && event.data) {
        try {
          const data = JSON.parse(event.data);
          setError(data.message || 'Unknown error');
        } catch {
          setError('Stream error');
        }
      }
      setStatus('error');
      eventSource.close();
      eventSourceRef.current = null;
    });

    // Handle native EventSource errors (connection failures)
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        // Stream was closed normally — don't report as error if we already completed
        if (statusRef.current !== 'completed') {
          setStatus('error');
          setError('Connection lost');
        }
      }
    };
  }, [stopStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    status,
    pipelineUpdate,
    completePipelineState,
    error,
    startStream,
    stopStream,
  };
}
