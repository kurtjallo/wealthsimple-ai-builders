'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CaseStats {
  total: number;
  pendingReview: number;
  completed: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<CaseStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/cases?limit=100');
        if (!res.ok) return;
        const data = await res.json();
        const cases = data.cases || [];
        const total = data.total || cases.length;
        const pendingReview = cases.filter(
          (c: { status: string }) => c.status === 'review'
        ).length;
        const completed = cases.filter(
          (c: { status: string }) =>
            c.status === 'approved' || c.status === 'escalated' || c.status === 'denied'
        ).length;
        setStats({ total, pendingReview, completed });
      } catch {
        // silently fail — cards will stay at "--"
      }
    }
    fetchStats();
  }, []);

  return (
    <DashboardShell
      title="Overview"
      description="Sentinel KYC/AML command center"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cases"
          value={stats ? String(stats.total) : '--'}
          description="All cases in system"
        />
        <StatsCard
          title="Pending Review"
          value={stats ? String(stats.pendingReview) : '--'}
          description="Awaiting officer decision"
        />
        <StatsCard
          title="Cases Completed"
          value={stats ? String(stats.completed) : '--'}
          description="Approved, denied, or escalated"
        />
        <StatsCard
          title="Active Agents"
          value="5"
          description="Agent types in pipeline"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Agent Pipeline</CardTitle>
            <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
              5 agents
            </Badge>
          </div>
          <CardDescription className="mt-2 max-w-2xl leading-relaxed">
            Your multi-agent pipeline orchestrates document processing, identity verification,
            sanctions screening, risk scoring, and case narrative generation in parallel --
            reducing KYC compliance review from days to minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <AgentIndicator label="Document Processor" />
            <AgentIndicator label="Identity Verifier" />
            <AgentIndicator label="Sanctions Screener" />
            <AgentIndicator label="Risk Scorer" />
            <AgentIndicator label="Case Narrator" />
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

function StatsCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function AgentIndicator({ label }: { label: string }) {
  return (
    <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
      {label}
    </div>
  );
}
