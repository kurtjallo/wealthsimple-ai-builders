'use client';

import Link from 'next/link';
import { Case } from '@/types';
import { CaseStatusBadge } from './case-status-badge';
import { CaseRiskBadge } from './case-risk-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CaseQueueTableProps {
  cases: Case[];
  emptyMessage?: string;
}

export function CaseQueueTable({ cases, emptyMessage = 'No cases found.' }: CaseQueueTableProps) {
  if (cases.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Applicant</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk Level</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((caseItem) => (
          <TableRow
            key={caseItem.id}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>
              <Link
                href={`/dashboard/cases/${caseItem.id}`}
                className="block"
              >
                <div className="font-medium">{caseItem.applicant_name}</div>
                {caseItem.applicant_email && (
                  <div className="text-xs text-muted-foreground">
                    {caseItem.applicant_email}
                  </div>
                )}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/cases/${caseItem.id}`}>
                <CaseStatusBadge status={caseItem.status} />
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/cases/${caseItem.id}`}>
                <CaseRiskBadge
                  riskLevel={caseItem.risk_level}
                  riskScore={caseItem.risk_score}
                />
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/cases/${caseItem.id}`}>
                <span className={cn(
                  'text-sm',
                  caseItem.decision ? 'font-medium' : 'text-muted-foreground'
                )}>
                  {caseItem.decision
                    ? caseItem.decision.charAt(0).toUpperCase() + caseItem.decision.slice(1)
                    : 'Pending'}
                </span>
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/dashboard/cases/${caseItem.id}`}>
                <span className="text-sm text-muted-foreground">
                  {formatDate(caseItem.created_at)}
                </span>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
