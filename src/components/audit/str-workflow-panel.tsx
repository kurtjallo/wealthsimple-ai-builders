'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, FileText, Shield, User, ExternalLink } from 'lucide-react';
import { ComplianceBadge, HumanOnlyIndicator, RecordRetentionNotice } from './compliance-badge';

interface STRWorkflowPanelProps {
  caseId: string;
  riskLevel?: string;
  riskScore?: number;
  officerId?: string;
  officerName?: string;
  onSTRFiled?: () => void;
}

interface FintracContext {
  regulation: string;
  requirement: string;
  summary: string;
  human_only_rationale: string;
  filing_deadline: string;
  record_keeping: string;
}

export function STRWorkflowPanel({
  caseId,
  riskLevel,
  riskScore,
  officerId,
  officerName,
  onSTRFiled,
}: STRWorkflowPanelProps) {
  const [reason, setReason] = useState('');
  const [indicators, setIndicators] = useState<string[]>([]);
  const [newIndicator, setNewIndicator] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fintracContext, setFintracContext] = useState<FintracContext | null>(null);

  useEffect(() => {
    async function loadContext() {
      try {
        const response = await fetch(`/api/cases/${caseId}/str`);
        if (response.ok) {
          const data = await response.json();
          setFintracContext(data.regulatory_context);
        }
      } catch {
        // Context is informational
      }
    }
    loadContext();
  }, [caseId]);

  const addIndicator = () => {
    if (newIndicator.trim()) {
      setIndicators(prev => [...prev, newIndicator.trim()]);
      setNewIndicator('');
    }
  };

  const removeIndicator = (index: number) => {
    setIndicators(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!officerId) {
      setError('Officer identification required. Please log in as a compliance officer.');
      return;
    }
    if (reason.trim().length < 20) {
      setError('Please provide a detailed reason (at least 20 characters) explaining the suspicious indicators.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cases/${caseId}/str`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: officerId,
          officer_name: officerName,
          reason: reason.trim(),
          suspicious_indicators: indicators,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit STR referral');
        return;
      }

      setSuccess(true);
      onSTRFiled?.();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-amber-300 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <h3 className="font-semibold text-amber-900">STR Referral Recorded</h3>
            <p className="text-sm text-amber-700">
              This case has been referred for STR filing. The referral has been logged
              in the audit trail. FINTRAC filing must be completed within 30 days.
            </p>
            <RecordRetentionNotice />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Suspicious Transaction Report</CardTitle>
          </div>
          <HumanOnlyIndicator action="STR Filing" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fintracContext && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Shield className="h-3.5 w-3.5" />
              Regulatory Context
            </div>
            <p className="text-muted-foreground">{fintracContext.summary}</p>
            <p className="text-muted-foreground italic">{fintracContext.human_only_rationale}</p>
            <div className="flex items-center gap-1 text-amber-700">
              <ExternalLink className="h-3 w-3" />
              <span>{fintracContext.regulation} — {fintracContext.requirement}</span>
            </div>
          </div>
        )}

        {(riskLevel || riskScore != null) && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Risk:</span>
            {riskScore != null && <Badge variant="outline">{riskScore}/100</Badge>}
            {riskLevel && (
              <Badge variant={riskLevel === 'critical' || riskLevel === 'high' ? 'destructive' : 'secondary'}>
                {riskLevel}
              </Badge>
            )}
          </div>
        )}

        <Separator />

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Filing Officer:</span>
          <span className="font-medium">{officerName || officerId || 'Not identified'}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Reason for STR Referral <span className="text-red-500">*</span>
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe the suspicious indicators and why this case warrants an STR filing..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            Minimum 20 characters. Document the specific suspicious indicators observed.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Suspicious Indicators</label>
          <div className="flex gap-2">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add an indicator..."
              value={newIndicator}
              onChange={(e) => setNewIndicator(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIndicator()}
              disabled={loading}
            />
            <Button variant="outline" size="sm" onClick={addIndicator} disabled={loading || !newIndicator.trim()}>
              Add
            </Button>
          </div>
          {indicators.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {indicators.map((ind, i) => (
                <Badge key={i} variant="secondary" className="text-xs cursor-pointer" onClick={() => removeIndicator(i)}>
                  {ind} x
                </Badge>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700"
            onClick={handleSubmit}
            disabled={loading || !officerId || reason.trim().length < 20}
          >
            {loading ? 'Submitting...' : 'Refer Case for STR Filing'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            This action will be recorded in the audit trail and cannot be undone.
            FINTRAC filing must be completed within 30 days.
          </p>
        </div>

        <RecordRetentionNotice />
      </CardContent>
    </Card>
  );
}
