import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>KYC/AML Operations Orchestrator</CardTitle>
            <Badge variant="secondary">v0.1</Badge>
          </div>
          <CardDescription>
            Multi-agent AI system for KYC/AML compliance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Foundation ready. Dashboard coming soon.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
