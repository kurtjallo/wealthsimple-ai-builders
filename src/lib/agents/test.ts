import { getGeminiClient, MODEL_CONFIG } from "./client";

export async function testGeminiConnectivity(): Promise<{
  success: boolean;
  model: string;
  response?: string;
  error?: string;
  latencyMs: number;
}> {
  const start = Date.now();
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: MODEL_CONFIG.routing });
    const result = await model.generateContent("Respond with exactly: CONNECTED");

    const text = result.response.text();

    return {
      success: true,
      model: MODEL_CONFIG.routing,
      response: text.trim(),
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      success: false,
      model: MODEL_CONFIG.routing,
      error: e instanceof Error ? e.message : "Unknown error",
      latencyMs: Date.now() - start,
    };
  }
}
