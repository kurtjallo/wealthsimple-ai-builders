import { NextResponse } from "next/server";
import { testClaudeConnectivity } from "@/lib/agents/test";

export async function POST() {
  const result = await testClaudeConnectivity();

  return NextResponse.json(result, {
    status: result.success ? 200 : 503,
  });
}
