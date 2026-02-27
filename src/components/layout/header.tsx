'use client';

import { Badge } from '@/components/ui/badge';
import { StatusDot } from '@/components/ui/status-dot';
import { Bell } from 'lucide-react';

interface HeaderProps {
  systemStatus?: 'online' | 'degraded' | 'offline';
}

export function Header({ systemStatus = 'online' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          Sentinel
        </h1>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground border-border">
          v1.0
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusDot status={systemStatus} size="sm" />
          <span className="hidden sm:inline">
            {systemStatus === 'online' && 'System Online'}
            {systemStatus === 'degraded' && 'Degraded'}
            {systemStatus === 'offline' && 'Offline'}
          </span>
        </div>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground">
          <Bell size={20} strokeWidth={1.5} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
          CO
        </div>
      </div>
    </header>
  );
}
