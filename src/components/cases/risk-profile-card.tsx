import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RISK_LEVEL_CONFIG } from '@/lib/constants';
import { getRiskScoreColor } from '@/lib/config/risk';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface RiskFactor {
  factor_name: string;
  weight: number;
  score: number;
  explanation: string;
}

interface RiskProfileCardProps {
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  riskFactors: RiskFactor[];
  requiresManualReview: boolean;
  scoringSummary?: string;
}

export function RiskProfileCard({
  riskScore,
  riskLevel,
  riskFactors,
  requiresManualReview,
  scoringSummary,
}: RiskProfileCardProps) {
  if (riskScore === null || riskLevel === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Risk Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Risk scoring has not been completed for this case.
          </p>
        </CardContent>
      </Card>
    );
  }

  const config = RISK_LEVEL_CONFIG[riskLevel];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Risk Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score Display */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full border-4',
              riskLevel === 'low' && 'border-emerald-500 text-emerald-600',
              riskLevel === 'medium' && 'border-amber-500 text-amber-600',
              riskLevel === 'high' && 'border-orange-500 text-orange-600',
              riskLevel === 'critical' && 'border-red-500 text-red-600',
            )}>
              <span className="text-xl font-bold">{riskScore}</span>
            </div>
            <span className="mt-1 text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="flex-1">
            <Badge
              variant="outline"
              className={cn(config.className, 'mb-2 gap-1.5')}
            >
              <div className={cn('h-2 w-2 rounded-full', config.dotColor)} />
              {config.label}
            </Badge>
            {requiresManualReview && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600">
                <AlertTriangle size={16} strokeWidth={1.5} />
                Manual review required
              </div>
            )}
          </div>
        </div>

        {/* Scoring Summary */}
        {scoringSummary && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scoringSummary}
            </p>
          </>
        )}

        {/* Risk Factors Breakdown */}
        {riskFactors.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {riskFactors.map((factor) => (
                  <div key={factor.factor_name} className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {formatFactorName(factor.factor_name)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {factor.score}/100
                          <span className="ml-1 text-xs">
                            (weight: {Math.round(factor.weight * 100)}%)
                          </span>
                        </span>
                      </div>
                      {/* Score bar */}
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all',
                            getRiskScoreColor(factor.score),
                          )}
                          style={{ width: `${Math.min(factor.score, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {factor.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function formatFactorName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
