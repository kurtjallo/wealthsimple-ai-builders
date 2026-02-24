import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

/** Helper to get a specific Gemini model instance */
export function getModel(modelName: string) {
  return getGeminiClient().getGenerativeModel({ model: modelName });
}

// Default model configuration for the project
export const MODEL_CONFIG = {
  // Primary reasoning model
  reasoning: "gemini-2.5-pro" as const,
  // Fast routing model
  routing: "gemini-2.5-flash" as const,
  // Max tokens for standard responses
  maxTokens: 4096,
} as const;
