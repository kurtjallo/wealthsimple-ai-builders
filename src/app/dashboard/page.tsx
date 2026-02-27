import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardOverview() {
  return (
    <DashboardShell
      title="Overview"
      description="Sentinel KYC/AML command center"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Cases"
          value="--"
          description="All cases in system"
        />
        <StatsCard
          title="Pending Review"
          value="--"
          description="Awaiting officer decision"
        />
        <StatsCard
          title="Approved"
          value="--"
          description="Cases approved"
        />
        <StatsCard
          title="Escalated"
          value="--"
          description="Cases requiring escalation"
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
