'use client';

import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

export function ComplianceBadge({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'detailed';
}) {
  if (variant === 'compact') {
    return (
      <Badge variant="outline" className="text-xs gap-1 font-normal text-green-700 border-green-300 bg-green-50">
        <Shield className="h-3 w-3" />
        FINTRAC
      </Badge>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2">
        <Shield className="h-4 w-4 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">FINTRAC/PCMLTFA Compliant</p>
          <p className="text-xs text-green-600">
            Full audit trail with human-in-the-loop enforcement
          </p>
        </div>
      </div>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 font-normal text-green-700 border-green-300 bg-green-50">
      <Shield className="h-3.5 w-3.5" />
      FINTRAC/PCMLTFA Compliant
    </Badge>
  );
}

export function RecordRetentionNotice() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs">
      <Clock className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
      <div className="text-amber-800">
        <span className="font-medium">Record Retention:</span>{' '}
        PCMLTFA requires all compliance records to be retained for a minimum of 5 years
        from the date of the last business transaction or activity.
      </div>
    </div>
  );
}

export function HumanOnlyIndicator({ action }: { action: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-amber-700">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>
        <span className="font-medium">{action}</span> requires human officer authorization
      </span>
    </div>
  );
}
