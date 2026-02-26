'use client';

import { useEffect, useState, useCallback } from 'react';
import { Case } from '@/types';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { CaseQueueTable } from '@/components/cases/case-queue-table';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

// Status groups for tabs
const STATUS_GROUPS = {
  'in-progress': {
    label: 'In Progress',
    statuses: 'pending,processing',
    emptyMessage: 'No cases currently being processed.',
  },
  'review': {
    label: 'Ready for Review',
    statuses: 'review',
    emptyMessage: 'No cases awaiting review.',
  },
  'completed': {
    label: 'Completed',
    statuses: 'approved,denied,escalated',
    emptyMessage: 'No completed cases yet.',
  },
} as const;

type StatusGroup = keyof typeof STATUS_GROUPS;

interface CaseResponse {
  cases: Case[];
  total: number;
}

export default function CaseQueuePage() {
  const [activeTab, setActiveTab] = useState<StatusGroup>('review');
  const [casesByGroup, setCasesByGroup] = useState<Record<StatusGroup, Case[]>>({
    'in-progress': [],
    'review': [],
    'completed': [],
  });
  const [countsByGroup, setCountsByGroup] = useState<Record<StatusGroup, number>>({
    'in-progress': 0,
    'review': 0,
    'completed': 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all three groups in parallel
      const results = await Promise.all(
        (Object.keys(STATUS_GROUPS) as StatusGroup[]).map(async (group) => {
          const response = await fetch(
            `/api/cases?status=${STATUS_GROUPS[group].statuses}&limit=50`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch ${group} cases`);
          }
          const data: CaseResponse = await response.json();
          return { group, cases: data.cases, total: data.total };
        })
      );

      const newCases: Record<StatusGroup, Case[]> = {
        'in-progress': [],
        'review': [],
        'completed': [],
      };
      const newCounts: Record<StatusGroup, number> = {
        'in-progress': 0,
        'review': 0,
        'completed': 0,
      };

      for (const result of results) {
        newCases[result.group] = result.cases;
        newCounts[result.group] = result.total;
      }

      setCasesByGroup(newCases);
      setCountsByGroup(newCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return (
    <DashboardShell
      title="Case Queue"
      description="Review and manage KYC/AML compliance cases"
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StatusGroup)}>
        <TabsList>
          {(Object.keys(STATUS_GROUPS) as StatusGroup[]).map((group) => (
            <TabsTrigger key={group} value={group} className="gap-2">
              {STATUS_GROUPS[group].label}
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {countsByGroup[group]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading cases...</span>
          </div>
        ) : error ? (
          <Card className="mt-4">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={fetchCases}
                className="mt-2 text-sm text-primary underline"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        ) : (
          (Object.keys(STATUS_GROUPS) as StatusGroup[]).map((group) => (
            <TabsContent key={group} value={group}>
              <Card>
                <CardContent className="p-0">
                  <CaseQueueTable
                    cases={casesByGroup[group]}
                    emptyMessage={STATUS_GROUPS[group].emptyMessage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))
        )}
      </Tabs>
    </DashboardShell>
  );
}
