import { CaseStatus, RiskLevel, DecisionType } from '@/types';

// Navigation items for the sidebar
export const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: 'LayoutDashboard',  // lucide-react icon name
    description: 'Dashboard overview',
  },
  {
    label: 'Case Queue',
    href: '/dashboard/cases',
    icon: 'FileStack',
    description: 'Review pending cases',
  },
] as const;

// Status display configuration — maps CaseStatus to visual properties
export const STATUS_CONFIG: Record<CaseStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
}> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    className: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  },
  processing: {
    label: 'Processing',
    variant: 'secondary',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  review: {
    label: 'Ready for Review',
    variant: 'default',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  approved: {
    label: 'Approved',
    variant: 'default',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  denied: {
    label: 'Denied',
    variant: 'destructive',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  escalated: {
    label: 'Escalated',
    variant: 'default',
    className: 'bg-purple-50 text-purple-700 border border-purple-200',
  },
};

// Risk level display configuration
export const RISK_LEVEL_CONFIG: Record<RiskLevel, {
  label: string;
  className: string;
  dotColor: string;
}> = {
  low: {
    label: 'Low Risk',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium Risk',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High Risk',
    className: 'bg-orange-50 text-orange-700 border border-orange-200',
    dotColor: 'bg-orange-500',
  },
  critical: {
    label: 'Critical Risk',
    className: 'bg-red-50 text-red-700 border border-red-200',
    dotColor: 'bg-red-500',
  },
};

// Decision type display
export const DECISION_CONFIG: Record<DecisionType, {
  label: string;
  className: string;
  icon: string;
}> = {
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: 'CheckCircle2',
  },
  denied: {
    label: 'Denied',
    className: 'bg-red-50 text-red-700 border border-red-200',
    icon: 'XCircle',
  },
  escalated: {
    label: 'Escalated',
    className: 'bg-purple-50 text-purple-700 border border-purple-200',
    icon: 'AlertTriangle',
  },
};

// Validation constants
export const MIN_JUSTIFICATION_LENGTH = 10;
