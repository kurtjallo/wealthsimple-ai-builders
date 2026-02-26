import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from '@/lib/constants';
import { CaseStatus } from '@/types';
import { cn } from '@/lib/utils';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <Badge
      variant="outline"
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  );
}
