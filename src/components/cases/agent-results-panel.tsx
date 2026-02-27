'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentRun, AgentType } from '@/types';
import { cn } from '@/lib/utils';
import { AGENT_REGISTRY } from '@/lib/config/agents';
import {
  ChevronDown,
  ChevronRight,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';

interface AgentResultsPanelProps {
  agentRuns: AgentRun[];
}

export function AgentResultsPanel({ agentRuns }: AgentResultsPanelProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());

  const toggleAgent = (id: string) => {
    setExpandedAgents(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (agentRuns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4" />
            Agent Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No agents have processed this case yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" />
          Agent Results ({agentRuns.length} agents)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        {agentRuns.map((run) => {
          const agentConfig = AGENT_REGISTRY[run.agent_type as AgentType];
          const isExpanded = expandedAgents.has(run.id);
          const Icon = agentConfig?.icon || Bot;

          return (
            <div key={run.id} className="border-b last:border-b-0">
              {/* Agent header */}
              <button
                onClick={() => toggleAgent(run.id)}
                className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {agentConfig?.label || run.agent_type}
                    </span>
                    <AgentStatusBadge status={run.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {agentConfig?.description || ''}
                  </p>
                </div>
                {run.confidence !== null && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {Math.round(run.confidence * 100)}% confidence
                  </span>
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && run.output && (
                <div className="px-6 pb-4 pl-14">
                  <div className="rounded-md border bg-muted p-4">
                    <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(run.output, null, 2)}
                    </pre>
                  </div>
                  {run.error && (
                    <div className="mt-2 rounded-md border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-xs text-destructive">{run.error}</p>
                    </div>
                  )}
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    {run.started_at && (
                      <span>Started: {new Date(run.started_at).toLocaleTimeString()}</span>
                    )}
                    {run.completed_at && (
                      <span>Completed: {new Date(run.completed_at).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AgentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-600 border-emerald-200 text-xs">
          <CheckCircle2 className="h-3 w-3" />
          Complete
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="outline" className="gap-1 bg-red-50 text-red-600 border-red-200 text-xs">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    case 'running':
      return (
        <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" />
          Running
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
}
