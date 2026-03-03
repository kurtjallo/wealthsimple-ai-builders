'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, Loader2, AlertCircle,
  ArrowRight, ArrowLeft, User, FileText, Cpu, CircleCheck, Shield, X,
} from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/cases/document-upload';
import { ProcessingErrorDisplay } from '@/components/cases/processing-error-display';
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

const STEPS = [
  { key: 'applicant' as const, label: 'Applicant details', icon: User },
  { key: 'documents' as const, label: 'Upload documents', icon: FileText },
  { key: 'processing' as const, label: 'AI processing', icon: Cpu },
  { key: 'complete' as const, label: 'Review results', icon: CircleCheck },
];

const STEP_TITLES: Record<WorkflowStep, string> = {
  applicant: 'Applicant details',
  documents: 'Upload documents',
  processing: 'AI processing',
  complete: 'Review results',
  error: 'Processing error',
};

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState<WorkflowStep>('applicant');
  const [caseId, setCaseId] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantDob, setApplicantDob] = useState('');
  const [applicantNationality, setApplicantNationality] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pipelineResult, setPipelineResult] = useState<any>(null);
  const [errors, setErrors] = useState<PipelineErrorType[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  const currentStepIndex = STEPS.findIndex(s => s.key === step);
  // When step is 'error', findIndex returns -1; keep it on the processing step (index 2)
  const stepNumber = (step === 'error' ? 2 : currentStepIndex) + 1;

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

    try {
      const response = await fetch(`/api/cases/${caseId}/process`, {
        method: 'POST',
      });

      const result = await response.json();
      setPipelineResult(result);

      if (result.success) {
        setStep('complete');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        setStep('error');
      }
    } catch {
      setErrors([{
        title: 'Unexpected Error',
        description: 'An unexpected error occurred during processing.',
        severity: 'error',
        agent_name: 'Pipeline',
        can_retry: true,
        suggested_action: 'Retry processing. If the issue persists, escalate for technical review.',
      }]);
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
        if (result.errors) {
          setErrors(result.errors);
        }
        setStep('error');
      }
    } catch {
      setErrors([{
        title: 'Unexpected Error',
        description: 'An unexpected error occurred during processing.',
        severity: 'error',
        agent_name: 'Pipeline',
        can_retry: true,
        suggested_action: 'Retry processing. If the issue persists, escalate for technical review.',
      }]);
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [caseId]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#EDEDEB] p-4 sm:p-6 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-[960px] mt-4 sm:mt-8">
        {/* Outer card wrapper */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/60 overflow-hidden flex flex-col sm:flex-row min-h-[600px]">

          {/* ── Left sidebar ── */}
          <div className="w-full sm:w-[280px] shrink-0 bg-[#FAFAF8] border-b sm:border-b-0 sm:border-r border-border/60 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <Shield size={20} strokeWidth={1.5} className="text-primary" />
              <span className="text-[15px] font-semibold text-foreground tracking-tight">New KYC Case</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-8">
              Create a compliance case and run automated identity, sanctions, and risk checks.
            </p>

            {/* Step nav */}
            <nav className="flex flex-col gap-1 flex-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = step === s.key || (step === 'error' && s.key === 'processing');
                const isCompleted = currentStepIndex > i;
                const isUpcoming = !isActive && !isCompleted;

                return (
                  <div
                    key={s.key}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150
                      ${isActive ? 'bg-card shadow-sm border border-border/60' : ''}
                      ${isCompleted ? 'text-foreground' : isUpcoming ? 'text-muted-foreground' : ''}
                    `}
                  >
                    <span className={`shrink-0 ${isCompleted ? 'text-emerald-500' : isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                      {isCompleted ? (
                        <CheckCircle2 size={18} strokeWidth={1.5} />
                      ) : (
                        <Icon size={18} strokeWidth={1.5} />
                      )}
                    </span>
                    <span className={`text-[13px] ${isActive ? 'font-medium text-foreground' : ''}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </nav>

            {/* Bottom progress */}
            <div className="mt-auto pt-6">
              <p className="text-[12px] text-muted-foreground mb-2.5">
                Step {stepNumber} of {STEPS.length}
              </p>
              <div className="h-1 bg-border/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(stepNumber / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Right content ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Content header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">
                {STEP_TITLES[step]}
              </h2>
              <Link href="/dashboard/cases">
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <X size={18} strokeWidth={1.5} />
                </button>
              </Link>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">

              {/* ── Step 1: Applicant Info ── */}
              {step === 'applicant' && (
                <div className="space-y-6">
                  {/* Name fields */}
                  <fieldset>
                    <legend className="text-[13px] font-medium text-foreground mb-3">Full legal name</legend>
                    <div className="bg-[#FAFAF8] rounded-xl border border-border/60 p-4">
                      <Input
                        placeholder="e.g. John Michael Smith"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="bg-card border-border/80 h-10 text-[14px] placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </fieldset>

                  {/* Contact */}
                  <fieldset>
                    <legend className="text-[13px] font-medium text-foreground mb-3">Contact information</legend>
                    <div className="bg-[#FAFAF8] rounded-xl border border-border/60 p-4 space-y-3">
                      <div>
                        <label className="text-[12px] text-muted-foreground mb-1.5 block">Email address</label>
                        <Input
                          placeholder="john.smith@example.com"
                          type="email"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          className="bg-card border-border/80 h-10 text-[14px] placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Additional details */}
                  <fieldset>
                    <legend className="text-[13px] font-medium text-foreground mb-3">Additional details</legend>
                    <div className="bg-[#FAFAF8] rounded-xl border border-border/60 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[12px] text-muted-foreground mb-1.5 block">Date of birth</label>
                          <Input
                            type="date"
                            value={applicantDob}
                            onChange={(e) => setApplicantDob(e.target.value)}
                            className="bg-card border-border/80 h-10 text-[14px] placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] text-muted-foreground mb-1.5 block">Nationality</label>
                          <Input
                            placeholder="e.g. Canadian"
                            value={applicantNationality}
                            onChange={(e) => setApplicantNationality(e.target.value)}
                            className="bg-card border-border/80 h-10 text-[14px] placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}

              {/* ── Step 2: Document Upload ── */}
              {step === 'documents' && caseId && (
                <div className="space-y-5">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Upload identity documents for <span className="font-medium text-foreground">{applicantName}</span>.
                    Supported formats: passport, driver&apos;s license, utility bill, bank statement.
                  </p>
                  <div className="bg-[#FAFAF8] rounded-xl border border-border/60 p-4">
                    <DocumentUpload
                      caseId={caseId}
                      onAllUploaded={handleDocumentsUploaded}
                    />
                  </div>
                </div>
              )}

              {/* ── Step 3: Processing ── */}
              {step === 'processing' && (
                <div className="space-y-4">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    AI agents are analyzing <span className="font-medium text-foreground">{applicantName}</span>&apos;s documents in parallel.
                  </p>

                  {progressEvents.length === 0 && isProcessing && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-primary" />
                      </div>
                      <span className="text-[13px] text-muted-foreground">Initializing agents...</span>
                    </div>
                  )}

                  {progressEvents.length > 0 && (
                    <div className="bg-[#FAFAF8] rounded-xl border border-border/60 divide-y divide-border/60">
                      {progressEvents.map((event, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3">
                          <span className="mt-0.5 shrink-0">
                            {event.status === 'completed' ? (
                              <CheckCircle2 size={16} strokeWidth={1.5} className="text-emerald-500" />
                            ) : event.status === 'failed' ? (
                              <AlertCircle size={16} strokeWidth={1.5} className="text-red-500" />
                            ) : (
                              <Loader2 size={16} strokeWidth={1.5} className="animate-spin text-primary" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-foreground">{event.message}</p>
                            {event.confidence !== undefined && event.confidence > 0 && (
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                    style={{ width: `${event.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                                  {(event.confidence * 100).toFixed(0)}%
                                  {event.duration_ms ? ` \u00b7 ${(event.duration_ms / 1000).toFixed(1)}s` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isProcessing && (
                        <div className="flex items-center gap-2 px-4 py-2.5 text-muted-foreground">
                          <Loader2 size={12} strokeWidth={2} className="animate-spin" />
                          <span className="text-[12px]">Agents working...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Complete ── */}
              {step === 'complete' && pipelineResult && (
                <div className="space-y-5">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    All AI agents have completed analysis for <span className="font-medium text-foreground">{applicantName}</span>.
                  </p>

                  {pipelineResult.pipeline_state?.risk_result?.data && (
                    <div className="bg-[#FAFAF8] rounded-xl border border-border/60 p-5">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Risk Score</p>
                          <p className="text-3xl font-bold tabular-nums text-foreground">
                            {pipelineResult.pipeline_state.risk_result.data.risk_score}
                            <span className="text-base text-muted-foreground font-normal">/100</span>
                          </p>
                        </div>
                        <Separator orientation="vertical" className="h-10" />
                        <div>
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Risk Level</p>
                          <Badge
                            className="text-[13px]"
                            variant={
                              pipelineResult.pipeline_state.risk_result.data.risk_level === 'low' ? 'secondary' :
                              pipelineResult.pipeline_state.risk_result.data.risk_level === 'medium' ? 'outline' :
                              'destructive'
                            }
                          >
                            {pipelineResult.pipeline_state.risk_result.data.risk_level?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-xl border border-emerald-200/60 p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} strokeWidth={1.5} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-emerald-900">Case ready for review</p>
                      <p className="text-[12px] text-emerald-700 mt-0.5">
                        A compliance officer can now review the full risk profile and make a decision.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Error State ── */}
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
                    <div className="bg-amber-50 rounded-xl border border-amber-200/60 p-4 flex items-start gap-3">
                      <AlertCircle size={18} strokeWidth={1.5} className="text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[13px] font-medium text-amber-900">Partial results available</p>
                        <p className="text-[12px] text-amber-700 mt-0.5">
                          Some agents completed before errors occurred.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Bottom action bar ── */}
            <div className="border-t border-border/60 px-6 py-4 flex items-center justify-between bg-card">
              <div>
                {step === 'applicant' && (
                  <Link href="/dashboard/cases">
                    <Button variant="ghost" size="sm" className="text-[13px] text-muted-foreground hover:text-foreground gap-1.5">
                      <ArrowLeft size={15} strokeWidth={1.5} />
                      Cancel
                    </Button>
                  </Link>
                )}
                {step === 'documents' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] text-muted-foreground hover:text-foreground gap-1.5"
                    onClick={() => setStep('applicant')}
                  >
                    <ArrowLeft size={15} strokeWidth={1.5} />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {step === 'applicant' && (
                  <Button
                    onClick={handleCreateCase}
                    disabled={!applicantName || !applicantEmail || isCreating}
                    className="text-[13px] h-9 px-5 gap-1.5"
                  >
                    {isCreating ? (
                      <><Loader2 size={14} strokeWidth={2} className="animate-spin" /> Creating...</>
                    ) : (
                      <>Continue</>
                    )}
                  </Button>
                )}

                {step === 'documents' && caseId && (
                  <Button
                    onClick={handleStartProcessing}
                    className="text-[13px] h-9 px-5 gap-1.5"
                  >
                    Start Processing
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Button>
                )}

                {step === 'complete' && (
                  <Button
                    onClick={() => router.push(`/dashboard/cases/${caseId}`)}
                    className="text-[13px] h-9 px-5 gap-1.5"
                  >
                    View Risk Profile
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Button>
                )}

                {step === 'error' && pipelineResult?.pipeline_state?.risk_result?.data && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/cases/${caseId}`)}
                    className="text-[13px] h-9 px-5"
                  >
                    View Partial Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
