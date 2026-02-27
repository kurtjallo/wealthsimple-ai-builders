import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileStack, Clock, CheckCircle2, AlertTriangle, Bot, ShieldCheck, ScanSearch, FileText, BrainCircuit } from 'lucide-react';

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
          icon={<FileStack className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Pending Review"
          value="--"
          description="Awaiting officer decision"
          icon={<Clock className="h-4 w-4 text-amber-600" />}
        />
        <StatsCard
          title="Approved"
          value="--"
          description="Cases approved"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
        <StatsCard
          title="Escalated"
          value="--"
          description="Cases requiring escalation"
          icon={<AlertTriangle className="h-4 w-4 text-purple-600" />}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>Sentinel Command Center</CardTitle>
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
              <Bot className="h-3 w-3" />
              5 AI Agents
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
            <AgentIndicator icon={<FileText className="h-4 w-4" />} label="Document Processor" />
            <AgentIndicator icon={<ShieldCheck className="h-4 w-4" />} label="Identity Verifier" />
            <AgentIndicator icon={<ScanSearch className="h-4 w-4" />} label="Sanctions Screener" />
            <AgentIndicator icon={<BrainCircuit className="h-4 w-4" />} label="Risk Scorer" />
            <AgentIndicator icon={<FileStack className="h-4 w-4" />} label="Case Narrator" />
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
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function AgentIndicator({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
