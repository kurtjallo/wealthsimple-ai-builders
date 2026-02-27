'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, Loader2, AlertCircle,
  ArrowRight, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/cases/document-upload';
import { ProcessingErrorDisplay } from '@/components/cases/processing-error-display';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import type { PipelineErrorDisplay as PipelineErrorType } from '@/lib/pipeline/error-recovery';

type WorkflowStep = 'applicant' | 'documents' | 'processing' | 'complete' | 'error';

interface ProgressEvent {
  type: string;
  stage?: string;
  agent_type?: string;
  status?: string;
  message?: string;
  confidence?: number;
  duration_ms?: number;
}

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState<WorkflowStep>('applicant');
  const [caseId, setCaseId] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pipelineResult, setPipelineResult] = useState<any>(null);
  const [errors, setErrors] = useState<PipelineErrorType[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Step 1: Create case
  const handleCreateCase = useCallback(async () => {
    if (!applicantName || !applicantEmail) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/cases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: applicantName,
          applicant_email: applicantEmail,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create case');
      }

      const data = await response.json();
      setCaseId(data.case.id);
      setStep('documents');
    } catch (error) {
      console.error('Failed to create case:', error);
    } finally {
      setIsCreating(false);
    }
  }, [applicantName, applicantEmail]);

  // Step 2: After documents uploaded
  const handleDocumentsUploaded = useCallback(() => {
    // Documents uploaded, ready to process
  }, []);

  // Step 3: Start processing
  const handleStartProcessing = useCallback(async () => {
    if (!caseId) return;

    setIsProcessing(true);
    setStep('processing');
    setProgressEvents([]);

    // Connect to SSE for real-time progress
    const eventSource = new EventSource(`/api/cases/${caseId}/progress`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data: ProgressEvent = JSON.parse(event.data);

      if (data.type === 'progress') {
        setProgressEvents(prev => [...prev, data]);
      }

      if (data.type === 'done') {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Trigger processing
    try {
      const response = await fetch(`/api/cases/${caseId}/process`, {
        method: 'POST',
      });

      const result = await response.json();
      setPipelineResult(result);

      if (result.success) {
        setStep('complete');
      } else {
        setStep('error');
      }
    } catch {
      setStep('error');
    } finally {
      setIsProcessing(false);
      eventSource.close();
    }
  }, [caseId]);

  // Handle retry
  const handleRetry = useCallback(async () => {
    if (!caseId) return;

    setIsProcessing(true);
    setStep('processing');
    setProgressEvents([]);

    try {
      const response = await fetch(`/api/cases/${caseId}/retry`, {
        method: 'POST',
      });

      const result = await response.json();
      setPipelineResult(result);

      if (result.success) {
        setStep('complete');
      } else {
        setStep('error');
      }
    } catch {
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [caseId]);

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const stepIndex = ['applicant', 'documents', 'processing', 'complete'].indexOf(step);

  return (
    <DashboardShell
      title="New Case"
      description="Create a new case and run AI-powered compliance checks"
      actions={
        <Link href="/dashboard/cases">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to Queue
          </Button>
        </Link>
      }
    >
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(['applicant', 'documents', 'processing', 'complete'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === s ? 'bg-primary text-primary-foreground' :
                (stepIndex > i || step === 'error')
                ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
            `}>
              {i + 1}
            </div>
            {i < 3 && <div className="w-12 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Step 1: Applicant Info */}
      {step === 'applicant' && (
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
            <CardDescription>Enter the applicant details to begin the KYC review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="e.g. John Michael Smith"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                placeholder="e.g. john.smith@example.com"
                type="email"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateCase}
              disabled={!applicantName || !applicantEmail || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <><span className="mr-2"><Loader2 size={16} strokeWidth={1.5} className="animate-spin" /></span> Creating Case...</>
              ) : (
                <>Create Case <span className="ml-2"><ArrowRight size={16} strokeWidth={1.5} /></span></>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Document Upload */}
      {step === 'documents' && caseId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload identity documents for {applicantName}. Supported: passport, driver&apos;s license, utility bill, bank statement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DocumentUpload
              caseId={caseId}
              onAllUploaded={handleDocumentsUploaded}
            />
            <Separator />
            <Button
              onClick={handleStartProcessing}
              className="w-full"
              size="lg"
            >
              Start AI Processing
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Processing */}
      {step === 'processing' && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Case</CardTitle>
            <CardDescription>
              AI agents are analyzing {applicantName}&apos;s documents in parallel...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progressEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  {event.status === 'completed' ? (
                    <span className="text-emerald-600 mt-0.5 shrink-0"><CheckCircle2 size={16} strokeWidth={1.5} /></span>
                  ) : event.status === 'failed' ? (
                    <span className="text-red-600 mt-0.5 shrink-0"><AlertCircle size={16} strokeWidth={1.5} /></span>
                  ) : (
                    <span className="text-primary mt-0.5 shrink-0"><Loader2 size={16} strokeWidth={1.5} className="animate-spin" /></span>
                  )}
                  <div>
                    <p className="text-sm">{event.message}</p>
                    {event.confidence !== undefined && event.confidence > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Confidence: {(event.confidence * 100).toFixed(0)}%
                        {event.duration_ms ? ` | ${(event.duration_ms / 1000).toFixed(1)}s` : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                  <span className="text-sm">Agents working...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && pipelineResult && (
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50 rounded-t-xl">
            <CardTitle>Processing Complete</CardTitle>
            <CardDescription>
              All AI agents have completed their analysis for {applicantName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {pipelineResult.pipeline_state?.risk_result?.data && (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-3xl font-bold">
                    {pipelineResult.pipeline_state.risk_result.data.risk_score}/100
                  </p>
                </div>
                <Badge variant={
                  pipelineResult.pipeline_state.risk_result.data.risk_level === 'low' ? 'secondary' :
                  pipelineResult.pipeline_state.risk_result.data.risk_level === 'medium' ? 'outline' :
                  'destructive'
                }>
                  {pipelineResult.pipeline_state.risk_result.data.risk_level?.toUpperCase()}
                </Badge>
              </div>
            )}
            <Separator />
            <Button
              onClick={() => router.push(`/dashboard/cases/${caseId}`)}
              className="w-full"
            >
              View Full Risk Profile &amp; Make Decision
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {step === 'error' && (
        <div className="space-y-4">
          <ProcessingErrorDisplay
            caseId={caseId || ''}
            title="Processing Encountered Issues"
            errors={errors}
            canRetry={true}
            overallSeverity="error"
            onRetry={handleRetry}
            isRetrying={isProcessing}
          />
          {pipelineResult?.pipeline_state?.risk_result?.data && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Some agents completed before errors occurred. Partial results available.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/cases/${caseId}`)}
                >
                  View Partial Results
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
