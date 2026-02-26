'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Case, AgentRun, RiskScorerOutput, CaseNarratorOutput } from '@/types';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { RiskProfileCard } from '@/components/cases/risk-profile-card';
import { CaseNarrativeCard } from '@/components/cases/case-narrative-card';
import { AgentResultsPanel } from '@/components/cases/agent-results-panel';
import { EvidenceSection } from '@/components/cases/evidence-section';
import { CaseStatusBadge } from '@/components/cases/case-status-badge';
import { CaseRiskBadge } from '@/components/cases/case-risk-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, User, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch case and agent runs in parallel
      const [caseResponse, runsResponse] = await Promise.all([
        fetch(`/api/cases/${caseId}`),
        fetch(`/api/cases/${caseId}/agent-runs`),
      ]);

      if (!caseResponse.ok) {
        throw new Error('Case not found');
      }

      const caseResult = await caseResponse.json();
      const runsResult = runsResponse.ok
        ? await runsResponse.json()
        : { agent_runs: [] };

      setCaseData(caseResult);
      setAgentRuns(runsResult.agent_runs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load case');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract agent-specific results from agent_runs
  const riskScorerRun = agentRuns.find(r => r.agent_type === 'risk_scorer' && r.status === 'completed');
  const narratorRun = agentRuns.find(r => r.agent_type === 'case_narrator' && r.status === 'completed');

  const riskOutput = riskScorerRun?.output as unknown as RiskScorerOutput | null;
  const narratorOutput = narratorRun?.output as unknown as CaseNarratorOutput | null;

  if (loading) {
    return (
      <DashboardShell title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading case details...</span>
        </div>
      </DashboardShell>
    );
  }

  if (error || !caseData) {
    return (
      <DashboardShell title="Error">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-destructive">{error || 'Case not found'}</p>
            <Link href="/dashboard/cases">
              <Button variant="link" className="mt-2">
                Back to Case Queue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={caseData.applicant_name}
      description={`Case ID: ${caseData.id}`}
      actions={
        <Link href="/dashboard/cases">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Queue
          </Button>
        </Link>
      }
    >
      {/* Case Header Info */}
      <Card>
        <CardContent className="flex items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{caseData.applicant_name}</span>
          </div>
          {caseData.applicant_email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{caseData.applicant_email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(caseData.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <CaseStatusBadge status={caseData.status} />
          <CaseRiskBadge
            riskLevel={caseData.risk_level}
            riskScore={caseData.risk_score}
          />
        </CardContent>
      </Card>

      {/* Two-column layout: Left = risk profile + narrative, Right = agent results */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <RiskProfileCard
            riskScore={caseData.risk_score}
            riskLevel={caseData.risk_level}
            riskFactors={riskOutput?.risk_factors || []}
            requiresManualReview={riskOutput?.requires_manual_review ?? false}
            scoringSummary={riskOutput?.scoring_summary}
          />

          <CaseNarrativeCard
            narrative={caseData.narrative}
            keyFindings={narratorOutput?.key_findings || []}
            recommendedAction={narratorOutput?.recommended_action || null}
          />

          <EvidenceSection
            evidenceLinks={narratorOutput?.evidence_links || []}
          />

          {/* Decision section placeholder — built in Plan 04 */}
          {caseData.status === 'review' && !caseData.decision && (
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Decision workflow will appear here when the case is ready for review.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show existing decision if made */}
          {caseData.decision && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Officer Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge
                  variant="outline"
                  className={
                    caseData.decision === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : caseData.decision === 'denied'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                  }
                >
                  {caseData.decision.charAt(0).toUpperCase() + caseData.decision.slice(1)}
                </Badge>
                {caseData.decision_justification && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {caseData.decision_justification}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <AgentResultsPanel agentRuns={agentRuns} />
        </div>
      </div>
    </DashboardShell>
  );
}
