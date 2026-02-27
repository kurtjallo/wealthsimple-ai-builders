import { cn } from '@/lib/utils';

interface DashboardShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
  className,
  actions,
}: DashboardShellProps) {
  return (
    <div className={cn('flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
