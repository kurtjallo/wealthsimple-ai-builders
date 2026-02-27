'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Bot,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ComplianceBadge, HumanOnlyIndicator } from './compliance-badge';

interface DecisionPanelProps {
  caseId: string;
  caseStatus: string;
  riskScore?: number;
  riskLevel?: string;
  aiRecommendation?: string;
  aiRecommendationReason?: string;
  officerId?: string;
  officerName?: string;
  onDecision?: (decision: string) => void;
  onSTRReferral?: () => void;
}

export function DecisionPanel({
  caseId,
  caseStatus,
  riskScore,
  riskLevel,
  aiRecommendation,
  aiRecommendationReason,
  officerId,
  officerName,
  onDecision,
  onSTRReferral,
}: DecisionPanelProps) {
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAIDetail, setShowAIDetail] = useState(false);

  const decidableStatuses = ['review', 'processing', 'escalated'];
  const canDecide = decidableStatuses.includes(caseStatus);
  const isDecided = ['approved', 'denied'].includes(caseStatus);

  const hasOfficer = !!officerId;
  const hasJustification = justification.trim().length >= 10;
  const canSubmit = canDecide && hasOfficer && hasJustification && !loading;

  const handleDecision = async (decision: 'approved' | 'denied' | 'escalated') => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cases/${caseId}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: officerId,
          officer_name: officerName,
          decision,
          justification: justification.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Decision failed');
        return;
      }

      setSuccess(decision);
      onDecision?.(decision);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const successConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
      approved: { icon: CheckCircle, color: 'text-green-600', label: 'Approved' },
      denied: { icon: XCircle, color: 'text-red-600', label: 'Denied' },
      escalated: { icon: AlertTriangle, color: 'text-amber-600', label: 'Escalated' },
    };
    const config = successConfig[success] || successConfig.escalated;
    const Icon = config.icon;

    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Icon className={`h-8 w-8 mx-auto ${config.color}`} />
            <h3 className="font-semibold">Case {config.label}</h3>
            <p className="text-sm text-muted-foreground">
              Decision by {officerName || officerId} has been recorded in the audit trail.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDecided) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="text-center space-y-2 text-muted-foreground">
            <Shield className="h-6 w-6 mx-auto" />
            <p className="text-sm">
              Case has been {caseStatus}. Decision recorded in audit trail.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Compliance Decision
          </CardTitle>
          <ComplianceBadge variant="compact" />
        </div>
        <HumanOnlyIndicator action="Final compliance decision" />
      </CardHeader>
      <CardContent className="space-y-4">
        {aiRecommendation && (
          <div className="rounded-lg border bg-blue-50/50 border-blue-200 p-3 space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAIDetail(!showAIDetail)}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-800">
                  AI Recommendation: <span className="capitalize">{aiRecommendation}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                  Advisory Only
                </Badge>
                {showAIDetail ? (
                  <ChevronUp className="h-4 w-4 text-blue-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-400" />
                )}
              </div>
            </div>
            {showAIDetail && aiRecommendationReason && (
              <p className="text-xs text-blue-700 mt-2 leading-relaxed">
                {aiRecommendationReason}
              </p>
            )}
            <p className="text-[11px] text-blue-500 italic">
              Per REG-02: AI recommendations are advisory. The compliance officer makes the final determination.
            </p>
          </div>
        )}

        {(riskLevel || riskScore != null) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Risk Assessment:</span>
            {riskScore != null && <Badge variant="outline">{riskScore}/100</Badge>}
            {riskLevel && (
              <Badge
                variant={
                  riskLevel === 'critical' ? 'destructive' :
                  riskLevel === 'high' ? 'destructive' :
                  riskLevel === 'medium' ? 'secondary' : 'outline'
                }
              >
                {riskLevel}
              </Badge>
            )}
          </div>
        )}

        <Separator />

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deciding Officer:</span>
          {hasOfficer ? (
            <span className="font-medium">{officerName || officerId}</span>
          ) : (
            <span className="text-red-500 text-xs">Officer identification required</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Decision Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Document the reasoning for this compliance decision. This is required for FINTRAC record-keeping..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            disabled={loading || !canDecide}
          />
          <p className="text-xs text-muted-foreground">
            {justification.trim().length < 10
              ? `${10 - justification.trim().length} more characters required (FINTRAC record-keeping)`
              : 'Justification meets minimum requirements'}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleDecision('approved')}
              disabled={!canSubmit}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDecision('denied')}
              disabled={!canSubmit}
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Deny
            </Button>
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => handleDecision('escalated')}
              disabled={!canSubmit}
            >
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              Escalate
            </Button>
          </div>

          {!hasOfficer && (
            <p className="text-xs text-center text-red-500">
              Buttons disabled: Officer identification required (REG-01)
            </p>
          )}
          {hasOfficer && !hasJustification && (
            <p className="text-xs text-center text-amber-600">
              Buttons disabled: Written justification required (REG-04)
            </p>
          )}
          {canSubmit && (
            <p className="text-xs text-center text-muted-foreground">
              Your decision will be permanently recorded in the compliance audit trail.
            </p>
          )}
        </div>

        {riskLevel && ['high', 'critical'].includes(riskLevel) && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="w-full text-amber-700 hover:text-amber-800 hover:bg-amber-50"
              onClick={onSTRReferral}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Refer for STR Filing
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
