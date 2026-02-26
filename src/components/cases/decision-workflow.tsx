'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Scale,
  AlertCircle,
} from 'lucide-react';

type DecisionType = 'approved' | 'denied' | 'escalated';

interface DecisionWorkflowProps {
  caseId: string;
  onDecisionMade: (decision: DecisionType, justification: string) => void;
}

const DECISION_OPTIONS: Array<{
  value: DecisionType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  buttonVariant: 'default' | 'destructive' | 'outline';
  confirmClass: string;
  dialogTitle: string;
  dialogDescription: string;
}> = [
  {
    value: 'approved',
    label: 'Approve',
    description: 'Clear the applicant — all checks passed',
    icon: CheckCircle2,
    buttonVariant: 'default',
    confirmClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    dialogTitle: 'Approve This Case',
    dialogDescription: 'You are approving this KYC application. The applicant will be cleared for account opening. This decision is final and will be recorded in the audit trail.',
  },
  {
    value: 'denied',
    label: 'Deny',
    description: 'Reject the application — significant concerns identified',
    icon: XCircle,
    buttonVariant: 'destructive',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
    dialogTitle: 'Deny This Case',
    dialogDescription: 'You are denying this KYC application. The applicant will not be cleared for account opening. This decision is final and will be recorded in the audit trail.',
  },
  {
    value: 'escalated',
    label: 'Escalate',
    description: 'Refer to senior compliance — further review needed',
    icon: AlertTriangle,
    buttonVariant: 'outline',
    confirmClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    dialogTitle: 'Escalate This Case',
    dialogDescription: 'You are escalating this case to senior compliance for further review. Please provide context explaining why escalation is needed.',
  },
];

export function DecisionWorkflow({ caseId, onDecisionMade }: DecisionWorkflowProps) {
  const [selectedDecision, setSelectedDecision] = useState<DecisionType | null>(null);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedOption = DECISION_OPTIONS.find(o => o.value === selectedDecision);

  const handleSelectDecision = (decision: DecisionType) => {
    setSelectedDecision(decision);
    setJustification('');
    setError(null);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedDecision) return;

    if (justification.trim().length < 10) {
      setError('Please provide a meaningful justification (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/cases/${caseId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: selectedDecision,
          justification: justification.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to submit decision');
      }

      // Success
      setDialogOpen(false);
      onDecisionMade(selectedDecision, justification.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit decision');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDialogOpen(false);
      setSelectedDecision(null);
      setJustification('');
      setError(null);
    }
  };

  return (
    <>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="h-4 w-4" />
            Officer Decision
          </CardTitle>
          <CardDescription>
            Review the evidence above and make your compliance decision. A written justification is required for audit purposes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {DECISION_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={option.buttonVariant}
                  className={cn(
                    'h-auto flex-col gap-2 py-4',
                    option.value === 'approved' && 'border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700',
                    option.value === 'escalated' && 'border-purple-200 hover:bg-purple-50 hover:text-purple-700',
                  )}
                  onClick={() => handleSelectDecision(option.value)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs font-normal opacity-70 text-center">
                    {option.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedOption && (
                <>
                  <selectedOption.icon className="h-5 w-5" />
                  {selectedOption.dialogTitle}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedOption?.dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="justification"
                className="block text-sm font-medium mb-2"
              >
                Justification <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="justification"
                placeholder="Explain your reasoning for this decision. Reference specific evidence from the risk profile and agent findings..."
                value={justification}
                onChange={(e) => {
                  setJustification(e.target.value);
                  if (error) setError(null);
                }}
                rows={4}
                className="resize-none"
                disabled={isSubmitting}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {justification.trim().length}/10 minimum characters
                {justification.trim().length >= 10 && (
                  <span className="ml-1 text-emerald-600">
                    <CheckCircle2 className="inline h-3 w-3" /> Meets minimum
                  </span>
                )}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || justification.trim().length < 10}
              className={cn(
                selectedOption?.confirmClass,
                'gap-1.5',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Confirm {selectedOption?.label}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
