'use client';

import { Badge } from '@/components/ui/badge';
import { StatusDot } from '@/components/ui/status-dot';
import { Shield, Bell } from 'lucide-react';

interface HeaderProps {
  systemStatus?: 'online' | 'degraded' | 'offline';
}

export function Header({ systemStatus = 'online' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold tracking-tight text-slate-900">
            KYC/AML Operations
          </h1>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal text-slate-500 border-slate-200">
            v1.0
          </Badge>
        </div>
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

        <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
          <Bell className="h-4 w-4 text-slate-500" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
          CO
        </div>
      </div>
    </header>
  );
}
