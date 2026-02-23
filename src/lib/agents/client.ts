import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing ANTHROPIC_API_KEY environment variable");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

// Default model configuration for the project
export const MODEL_CONFIG = {
  // Primary reasoning model
  reasoning: "claude-sonnet-4-6-20250514" as const,
  // Fast routing model
  routing: "claude-haiku-4-5-20251001" as const,
  // Max tokens for standard responses
  maxTokens: 4096,
} as const;
