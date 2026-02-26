'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, XCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { PipelineErrorDisplay, ErrorSeverity } from '@/lib/pipeline/error-recovery';

interface ProcessingErrorDisplayProps {
  caseId: string;
  title: string;
  errors: PipelineErrorDisplay[];
  canRetry: boolean;
  overallSeverity: ErrorSeverity;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const severityConfig: Record<ErrorSeverity, {
  icon: typeof AlertCircle;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeVariant: 'secondary',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badgeVariant: 'outline',
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeVariant: 'destructive',
  },
  critical: {
    icon: AlertCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    badgeVariant: 'destructive',
  },
};

export function ProcessingErrorDisplay({
  caseId,
  title,
  errors,
  canRetry,
  overallSeverity,
  onRetry,
  isRetrying = false,
}: ProcessingErrorDisplayProps) {
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set());
  const config = severityConfig[overallSeverity];
  const Icon = config.icon;

  const toggleError = (index: number) => {
    setExpandedErrors(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Card className={`${config.borderColor} border-2`}>
      <CardHeader className={`${config.bgColor} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <CardTitle className="text-base">{title}</CardTitle>
            <Badge variant={config.badgeVariant}>
              {errors.length} {errors.length === 1 ? 'issue' : 'issues'}
            </Badge>
          </div>
          {canRetry && onRetry && (
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry Processing'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {errors.map((error, index) => {
          const errorConfig = severityConfig[error.severity];
          const ErrorIcon = errorConfig.icon;
          const isExpanded = expandedErrors.has(index);

          return (
            <div
              key={index}
              className={`rounded-lg border ${errorConfig.borderColor} p-3`}
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleError(index)}
              >
                <div className="flex items-start gap-2">
                  <ErrorIcon className={`h-4 w-4 mt-0.5 ${errorConfig.color}`} />
                  <div>
                    <p className="text-sm font-medium">{error.title}</p>
                    <p className="text-xs text-muted-foreground">{error.agent_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={errorConfig.badgeVariant} className="text-xs">
                    {error.severity}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pl-6 space-y-2">
                  <p className="text-sm text-muted-foreground">{error.description}</p>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">Suggested Action</Badge>
                    <p className="text-sm">{error.suggested_action}</p>
                  </div>
                  {error.technical_details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Technical Details
                      </summary>
                      <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                        {error.technical_details}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
