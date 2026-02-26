'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { StatusDot } from '@/components/ui/status-dot';
import {
  LayoutDashboard,
  FileStack,
  Activity,
  FileText,
  Settings,
  Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Case Queue', href: '/dashboard/cases', icon: FileStack },
  { label: 'New Case', href: '/cases/new', icon: Activity },
  { label: 'Audit Trail', href: '/dashboard/audit', icon: FileText },
];

const AGENT_SYSTEMS = [
  { name: 'Document OCR', status: 'online' as const },
  { name: 'Identity Verification', status: 'online' as const },
  { name: 'Sanctions Screening', status: 'online' as const },
  { name: 'Risk Scoring', status: 'online' as const },
  { name: 'Case Narrator', status: 'online' as const },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-slate-50/50">
      {/* Branding */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">KYC/AML Orchestrator</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Agent system health */}
      <div className="px-3 py-4">
        <h3 className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Agent Systems
        </h3>
        <div className="space-y-2">
          {AGENT_SYSTEMS.map((system) => (
            <div key={system.name} className="flex items-center gap-2 px-3 py-1">
              <StatusDot status={system.status} size="xs" />
              <span className="text-xs text-slate-500">{system.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-3 py-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
