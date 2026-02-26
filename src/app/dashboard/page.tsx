import { DashboardShell } from '@/components/layout/dashboard-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileStack, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <DashboardShell
      title="Overview"
      description="KYC/AML case processing dashboard"
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
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatsCard
          title="Approved"
          value="--"
          description="Cases approved"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <StatsCard
          title="Escalated"
          value="--"
          description="Cases requiring escalation"
          icon={<AlertTriangle className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Compliance Dashboard</CardTitle>
          <CardDescription>
            Navigate to the Case Queue to review pending KYC/AML cases. Each case includes
            AI-generated risk assessments, identity verification results, and sanctions screening reports.
          </CardDescription>
        </CardHeader>
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
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
