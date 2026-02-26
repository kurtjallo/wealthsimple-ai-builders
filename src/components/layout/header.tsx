import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground">
          Compliance Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          System Online
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <Shield className="h-3 w-3" />
          Compliance Officer
        </Badge>
      </div>
    </header>
  );
}
