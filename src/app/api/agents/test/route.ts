import { NextResponse } from "next/server";
import { testGeminiConnectivity } from "@/lib/agents/test";

export async function POST() {
  const result = await testGeminiConnectivity();

  return NextResponse.json(result, {
    status: result.success ? 200 : 503,
  });
}
