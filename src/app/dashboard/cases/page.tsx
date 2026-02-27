'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Case } from '@/types';
import { fetcher } from '@/lib/swr/fetcher';
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

  const { data: inProgressData, error: inProgressError } = useSWR<CaseResponse>(
    `/api/cases?status=${STATUS_GROUPS['in-progress'].statuses}&limit=50`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const { data: reviewData, error: reviewError } = useSWR<CaseResponse>(
    `/api/cases?status=${STATUS_GROUPS['review'].statuses}&limit=50`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const { data: completedData, error: completedError } = useSWR<CaseResponse>(
    `/api/cases?status=${STATUS_GROUPS['completed'].statuses}&limit=50`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const loading = (!inProgressData && !inProgressError)
    || (!reviewData && !reviewError)
    || (!completedData && !completedError);

  const error = inProgressError || reviewError || completedError;

  const casesByGroup: Record<StatusGroup, Case[]> = {
    'in-progress': inProgressData?.cases ?? [],
    'review': reviewData?.cases ?? [],
    'completed': completedData?.cases ?? [],
  };

  const countsByGroup: Record<StatusGroup, number> = {
    'in-progress': inProgressData?.total ?? 0,
    'review': reviewData?.total ?? 0,
    'completed': completedData?.total ?? 0,
  };

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
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : 'Failed to load cases'}
              </p>
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
