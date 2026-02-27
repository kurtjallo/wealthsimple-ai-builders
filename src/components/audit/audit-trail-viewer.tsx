'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Bot,
  User,
  Monitor,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
} from 'lucide-react';

interface AuditEntry {
  id: string;
  case_id: string;
  action: string;
  actor_type: string;
  actor_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
  actor_label: string;
  action_label: string;
  summary: string;
  timestamp_formatted: string;
}

interface AuditTrailViewerProps {
  caseId: string;
}

export function AuditTrailViewer({ caseId }: AuditTrailViewerProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [totalCount, setTotalCount] = useState(0);
  const [exporting, setExporting] = useState(false);

  const fetchAuditTrail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterParam = filter !== 'all' ? `?event_type=${filter}` : '';
      const response = await fetch(`/api/cases/${caseId}/audit${filterParam}`);
      if (!response.ok) {
        throw new Error('Failed to load audit trail');
      }
      const data = await response.json();
      setEntries(data.audit_trail || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [caseId, filter]);

  useEffect(() => {
    fetchAuditTrail();
  }, [fetchAuditTrail]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/cases/${caseId}/audit/export`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${caseId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export audit trail');
    } finally {
      setExporting(false);
    }
  };

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'agent': return <Bot className="h-4 w-4" />;
      case 'officer': return <User className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('completed') || action.includes('approved')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (action.includes('failed') || action.includes('denied')) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (action.includes('escalated') || action.includes('str')) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    if (action.includes('started') || action.includes('created')) {
      return <Clock className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const getActorBadgeVariant = (actorType: string): 'default' | 'secondary' | 'outline' => {
    switch (actorType) {
      case 'agent': return 'secondary';
      case 'officer': return 'default';
      case 'system': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Audit Trail</CardTitle>
          <Badge variant="outline" className="text-xs">
            {totalCount} entries
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          disabled={exporting || entries.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="agent_action">Agent Actions</TabsTrigger>
            <TabsTrigger value="human_decision">Decisions</TabsTrigger>
            <TabsTrigger value="system_event">System</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Loading audit trail...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-500">
                {error}
              </div>
            ) : entries.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No audit entries found
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-1">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex gap-3 py-3 border-b border-border/50 last:border-0"
                    >
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center pt-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                          {getActorIcon(entry.actor_type)}
                        </div>
                        {index < entries.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>

                      {/* Entry content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getActionIcon(entry.action)}
                          <span className="font-medium text-sm">
                            {entry.action_label}
                          </span>
                          <Badge variant={getActorBadgeVariant(entry.actor_type)} className="text-xs">
                            {entry.actor_label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {entry.summary}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {entry.timestamp_formatted}
                        </p>

                        {/* Show confidence for agent actions */}
                        {(() => {
                          const d = entry.details as Record<string, unknown> | null;
                          if (d && typeof d.confidence === 'number') {
                            return (
                              <div className="mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Confidence: {(d.confidence * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Show justification for human decisions */}
                        {(() => {
                          const d = entry.details as Record<string, unknown> | null;
                          if (d && d.justification) {
                            return (
                              <div className="mt-1 text-xs bg-muted/50 rounded px-2 py-1">
                                <span className="font-medium">Justification:</span>{' '}
                                {String(d.justification)}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        {/* FINTRAC compliance footer */}
        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground/60 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          FINTRAC/PCMLTFA compliant audit trail. Records retained for 5+ years.
        </div>
      </CardContent>
    </Card>
  );
}
