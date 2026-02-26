import { Badge } from '@/components/ui/badge';
import { RISK_LEVEL_CONFIG } from '@/lib/constants';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface CaseRiskBadgeProps {
  riskLevel: RiskLevel | null;
  riskScore?: number | null;
  className?: string;
}

export function CaseRiskBadge({ riskLevel, riskScore, className }: CaseRiskBadgeProps) {
  if (!riskLevel) {
    return (
      <Badge variant="outline" className={cn('text-muted-foreground', className)}>
        Not Scored
      </Badge>
    );
  }

  const config = RISK_LEVEL_CONFIG[riskLevel];

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'gap-1.5 font-medium', className)}
    >
      <div className={cn('h-2 w-2 rounded-full', config.dotColor)} />
      {config.label}
      {riskScore !== null && riskScore !== undefined && (
        <span className="ml-1 opacity-70">({riskScore})</span>
      )}
    </Badge>
  );
}
