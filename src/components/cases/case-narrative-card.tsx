import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaseNarrativeCardProps {
  narrative: string | null;
  keyFindings: string[];
  recommendedAction: string | null;
}

export function CaseNarrativeCard({
  narrative,
  keyFindings,
  recommendedAction,
}: CaseNarrativeCardProps) {
  if (!narrative) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Case Narrative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Case narrative has not been generated yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const ActionIcon = recommendedAction === 'approve'
    ? CheckCircle2
    : recommendedAction === 'deny'
      ? XCircle
      : AlertTriangle;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Case Narrative
          </CardTitle>
          {recommendedAction && (
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5',
                recommendedAction === 'approve' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                recommendedAction === 'deny' && 'bg-red-50 text-red-600 border-red-200',
                recommendedAction === 'escalate' && 'bg-purple-50 text-purple-600 border-purple-200',
              )}
            >
              <ActionIcon className="h-3 w-3" />
              AI Recommends: {recommendedAction.charAt(0).toUpperCase() + recommendedAction.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Narrative Text */}
        <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground">
          {narrative.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Key Findings */}
        {keyFindings.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Key Findings</h4>
              <ul className="space-y-1.5">
                {keyFindings.map((finding) => (
                  <li key={finding} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
