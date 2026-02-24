import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentResult, AgentConfig, AgentType } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/** Type for an agent handler function */
export type AgentHandler<TInput, TOutput> = (
  input: TInput,
  config: AgentConfig,
) => Promise<AgentResult<TOutput>>;

/** Core execution wrapper — handles timing, errors, retries */
export async function runAgent<TInput, TOutput>(
  agentType: AgentType,
  input: TInput,
  config: AgentConfig,
  handler: (input: TInput, client: GoogleGenerativeAI, config: AgentConfig) => Promise<TOutput>,
): Promise<AgentResult<TOutput>> {
  const startTime = Date.now();
  let lastError: string | null = null;

  for (let attempt = 0; attempt <= config.retry_count; attempt++) {
    try {
      // Manual abort controller for timeout (not AbortSignal.timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout_ms);

      const data = await Promise.race([
        handler(input, genAI, config),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error(`Agent ${agentType} timed out after ${config.timeout_ms}ms`));
          });
        }),
      ]);

      clearTimeout(timeoutId);

      return {
        success: true,
        data,
        error: null,
        confidence: 1.0, // Handler should override this
        duration_ms: Date.now() - startTime,
        agent_type: agentType,
        metadata: { attempt },
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.error(`Agent ${agentType} attempt ${attempt + 1} failed:`, lastError);

      // Don't retry on last attempt
      if (attempt < config.retry_count) {
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  return {
    success: false,
    data: null,
    error: lastError,
    confidence: 0,
    duration_ms: Date.now() - startTime,
    agent_type: agentType,
    metadata: { attempts: config.retry_count + 1 },
  };
}
