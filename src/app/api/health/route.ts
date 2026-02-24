import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, string> = {
    server: "ok",
  };

  // Check Supabase connectivity
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("cases").select("id").limit(1);
    checks.database = error ? `error: ${error.message}` : "ok";
  } catch (e) {
    checks.database = e instanceof Error ? `error: ${e.message}` : "error: unknown";
  }

  // Check Gemini SDK connectivity
  try {
    const { getGeminiClient } = await import("@/lib/agents/client");
    getGeminiClient();
    checks.gemini = "ok";
  } catch (e) {
    checks.gemini = e instanceof Error ? `error: ${e.message}` : "error: unknown";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json({
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    checks,
  });
}
