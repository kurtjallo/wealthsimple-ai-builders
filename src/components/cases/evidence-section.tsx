import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EvidenceLink {
  claim: string;
  source: string;
  confidence: number;
}

interface EvidenceSectionProps {
  evidenceLinks: EvidenceLink[];
}

export function EvidenceSection({ evidenceLinks }: EvidenceSectionProps) {
  if (evidenceLinks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Evidence Links ({evidenceLinks.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {evidenceLinks.map((link) => (
            <div
              key={`${link.source}-${link.claim}`}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{link.claim}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Source: {link.source}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'flex-shrink-0 text-xs',
                  link.confidence >= 0.8 && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  link.confidence >= 0.5 && link.confidence < 0.8 && 'bg-amber-50 text-amber-600 border-amber-200',
                  link.confidence < 0.5 && 'bg-red-50 text-red-600 border-red-200',
                )}
              >
                {Math.round(link.confidence * 100)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
