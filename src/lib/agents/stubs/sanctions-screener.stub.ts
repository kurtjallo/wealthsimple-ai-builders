import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, SanctionsScreenerInput, SanctionsScreenerOutput } from '@/types';

export async function sanctionsScreenerStub(
  input: SanctionsScreenerInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<SanctionsScreenerOutput> {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

  return {
    flagged: false,
    matches: [],
    lists_checked: ['UN Security Council Consolidated List', 'OFAC SDN List', 'PEP Database'],
    screening_summary: `No sanctions matches found for ${input.applicant_name}. Screened against UN Security Council Consolidated List, OFAC SDN List, and PEP database. All clear.`,
  };
}
