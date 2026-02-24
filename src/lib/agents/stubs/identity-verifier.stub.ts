import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AgentConfig, IdentityVerifierInput, IdentityVerifierOutput } from '@/types';

export async function identityVerifierStub(
  input: IdentityVerifierInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<IdentityVerifierOutput> {
  await new Promise(r => setTimeout(r, 400 + Math.random() * 400));

  const nameFromDocs = input.extracted_fields.find(f => f.field_name === 'full_name')?.value || 'Unknown';

  return {
    verified: true,
    matches: [
      { field_name: 'full_name', expected: input.applicant_name, actual: nameFromDocs, match: true, confidence: 0.94 },
      { field_name: 'date_of_birth', expected: '1985-03-15', actual: '1985-03-15', match: true, confidence: 0.98 },
      { field_name: 'nationality', expected: 'Canadian', actual: 'Canadian', match: true, confidence: 0.96 },
    ],
    discrepancies: [],
    verification_summary: `Identity verified for ${input.applicant_name}. All document fields match application data with high confidence. No discrepancies found.`,
  };
}
