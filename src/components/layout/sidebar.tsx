'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { StatusDot } from '@/components/ui/status-dot';
import {
  LayoutDashboard,
  FileStack,
  Activity,
} from 'lucide-react';
import { getPipelineAgents } from '@/lib/config/agents';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Case Queue', href: '/dashboard/cases', icon: FileStack },
  { label: 'New Case', href: '/cases/new', icon: Activity },
];

const AGENT_SYSTEMS = getPipelineAgents().map(a => ({
  name: a.sidebarName,
  status: 'online' as const,
}));

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Branding */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-foreground font-semibold text-sm tracking-tight">Sentinel</span>
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
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-r-lg',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-l-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
              )}
            >
              <span className="flex-shrink-0"><Icon size={20} strokeWidth={1.5} /></span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 h-px bg-sidebar-border" />

      {/* Agent system health */}
      <div className="px-3 py-4">
        <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Agent Systems
        </h3>
        <div className="space-y-2">
          {AGENT_SYSTEMS.map((system) => (
            <div key={system.name} className="flex items-center gap-2 px-3 py-1">
              <StatusDot status={system.status} size="xs" />
              <span className="text-xs text-sidebar-foreground">{system.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <span className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
          Sentinel v1.0
        </span>
      </div>
    </aside>
  );
}
