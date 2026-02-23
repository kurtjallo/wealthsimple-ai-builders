import { getAnthropicClient, MODEL_CONFIG } from "./client";

export async function testClaudeConnectivity(): Promise<{
  success: boolean;
  model: string;
  response?: string;
  error?: string;
  latencyMs: number;
}> {
  const start = Date.now();
  try {
    const client = getAnthropicClient();
    const message = await client.messages.create({
      model: MODEL_CONFIG.routing,
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: "Respond with exactly: CONNECTED",
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return {
      success: true,
      model: message.model,
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
