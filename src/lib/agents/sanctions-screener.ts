import type { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AgentConfig,
  AgentResult,
  SanctionsScreenerInput,
  SanctionsScreenerOutput,
  SanctionsMatch,
  ExtractedField,
} from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { fuzzyMatchName } from '@/lib/sanctions/fuzzy-match';
import type {
  SanctionsEntry,
  SanctionsAlias,
  SanctionsListSource,
  MatchConfidence,
} from '@/lib/sanctions/types';

// ---- Screening Logic ----

/** All sources we screen against */
const ALL_SOURCES: SanctionsListSource[] = ['OFAC_SDN', 'UN_SECURITY_COUNCIL', 'PEP'];

/** Confidence thresholds for match scoring */
function scoreToConfidence(score: number): MatchConfidence {
  if (score >= 0.85) return 'high';
  if (score >= 0.6) return 'medium';
  return 'low';
}

/** Source display names */
const SOURCE_DISPLAY_NAME: Record<SanctionsListSource, string> = {
  OFAC_SDN: 'OFAC SDN List',
  UN_SECURITY_COUNCIL: 'UN Security Council Consolidated List',
  PEP: 'PEP Database',
};

interface ScreeningCandidate {
  entry: SanctionsEntry;
  matchedField: string;
  matchedValue: string;
}

/**
 * Screen a name against all sanctions entries in the database.
 * Fetches entries from Supabase and runs fuzzy matching locally.
 */
async function screenAgainstDatabase(
  applicantName: string,
  sources: SanctionsListSource[] = ALL_SOURCES,
): Promise<SanctionsMatch[]> {
  const supabase = createServerSupabaseClient();
  const matches: SanctionsMatch[] = [];

  for (const source of sources) {
    // Fetch entries for this source
    const { data: entries, error } = await supabase
      .from('sanctions_entries')
      .select('id, source, source_id, entry_type, primary_name, first_name, last_name, date_of_birth, nationality, programs, remarks, source_url')
      .eq('source', source)
      .eq('entry_type', 'individual');

    if (error) {
      console.error(`Error fetching ${source} entries:`, error.message);
      continue;
    }

    if (!entries || entries.length === 0) continue;

    // Build candidates: primary_name for each entry
    const candidates: ScreeningCandidate[] = entries.map((e) => ({
      entry: e as unknown as SanctionsEntry,
      matchedField: 'primary_name',
      matchedValue: e.primary_name,
    }));

    // Also fetch aliases for these entries and add as candidates
    const entryIds = entries.map((e) => e.id);
    const { data: aliases } = await supabase
      .from('sanctions_aliases')
      .select('entry_id, alias_name, alias_type, alias_quality')
      .in('entry_id', entryIds.slice(0, 500)); // Limit to avoid query size issues

    if (aliases && aliases.length > 0) {
      const entryMap = new Map(entries.map((e) => [e.id, e]));
      for (const alias of aliases) {
        const entry = entryMap.get(alias.entry_id);
        if (entry) {
          candidates.push({
            entry: entry as unknown as SanctionsEntry,
            matchedField: `alias (${alias.alias_type ?? 'aka'})`,
            matchedValue: alias.alias_name,
          });
        }
      }
    }

    // Run fuzzy matching against all candidates
    for (const candidate of candidates) {
      const matchResult = fuzzyMatchName(applicantName, candidate.matchedValue, {
        threshold: 0.6,
      });

      if (matchResult) {
        matches.push({
          list_name: SOURCE_DISPLAY_NAME[source],
          matched_name: candidate.matchedValue,
          match_score: matchResult.score,
          entry_id: candidate.entry.id,
          details: buildMatchDetails(candidate, matchResult.matchType),
        });
      }
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.match_score - a.match_score);
}

function buildMatchDetails(
  candidate: ScreeningCandidate,
  matchType: string,
): string {
  const entry = candidate.entry;
  const parts: string[] = [];

  parts.push(`Match type: ${matchType}`);
  parts.push(`Matched field: ${candidate.matchedField}`);

  if (entry.programs && entry.programs.length > 0) {
    parts.push(`Programs: ${entry.programs.join(', ')}`);
  }
  if (entry.nationality) {
    parts.push(`Nationality: ${entry.nationality}`);
  }
  if (entry.date_of_birth) {
    parts.push(`DOB: ${entry.date_of_birth}`);
  }
  if (entry.remarks) {
    parts.push(`Remarks: ${entry.remarks.substring(0, 200)}`);
  }

  return parts.join(' | ');
}

// ---- Gemini Screening Summary ----

const SANCTIONS_SCREENER_PROMPT = `You are a Sanctions Screening Agent in a KYC/AML compliance system.

Your role: Analyze sanctions screening results and produce a structured assessment.

IMPORTANT RULES:
- Report ALL matches, even low-confidence ones — let the human compliance officer decide
- Never dismiss a potential match — false negatives are worse than false positives
- Include the source list for every match
- If a name has common variations (e.g., Mohammed/Muhammad), note this
- Confidence interpretation:
  - High (score >= 0.85): Strong match — likely the same person, requires immediate attention
  - Medium (score 0.6-0.85): Potential match — could be the same person, needs manual review
  - Low (score < 0.6): Weak match — probably coincidental, included for completeness

You will be given the applicant's name and the raw screening results. Produce a JSON response with:
{
  "screening_summary": "Human-readable 2-3 sentence summary of the screening findings",
  "recommendations": ["Array of recommended next steps for the compliance officer"]
}

If there are no matches, the summary should confirm the individual was screened against all lists and found clear.
If there are matches, the summary should highlight the highest-confidence match and recommend appropriate review.`;

/**
 * Use Gemini to generate a human-readable screening summary and recommendations.
 */
async function generateScreeningSummary(
  client: GoogleGenerativeAI,
  config: AgentConfig,
  applicantName: string,
  matches: SanctionsMatch[],
  listsChecked: string[],
): Promise<{ screening_summary: string; recommendations: string[] }> {
  const model = client.getGenerativeModel({
    model: config.model,
    generationConfig: {
      maxOutputTokens: config.max_tokens,
      temperature: config.temperature ?? 0,
    },
  });

  const prompt = `Applicant name: ${applicantName}
Lists checked: ${listsChecked.join(', ')}
Number of matches: ${matches.length}

${matches.length > 0
    ? `Matches found:\n${matches.map((m, i) => `${i + 1}. ${m.matched_name} (list: ${m.list_name}, score: ${m.match_score.toFixed(2)}, ${m.details})`).join('\n')}`
    : 'No matches found against any sanctions list.'
  }

Produce your JSON assessment.`;

  try {
    const result = await model.generateContent([
      { role: 'user', parts: [{ text: SANCTIONS_SCREENER_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood. I will analyze the screening results and provide a structured JSON assessment.' }] },
      { role: 'user', parts: [{ text: prompt }] },
    ] as never);

    const text = result.response.text();
    // Extract JSON from the response (may be wrapped in markdown code block)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        screening_summary: parsed.screening_summary || `Screening completed for ${applicantName}.`,
        recommendations: parsed.recommendations || [],
      };
    }
  } catch (error) {
    console.error('Gemini screening summary generation failed:', error);
  }

  // Fallback if Gemini fails
  if (matches.length === 0) {
    return {
      screening_summary: `No sanctions matches found for ${applicantName}. Screened against ${listsChecked.join(', ')}.`,
      recommendations: ['No further sanctions review required.'],
    };
  }

  const highMatches = matches.filter((m) => m.match_score >= 0.85);
  return {
    screening_summary: `${matches.length} potential match(es) found for ${applicantName}. ${highMatches.length} high-confidence match(es) require immediate review.`,
    recommendations: [
      'Manual review of flagged matches required.',
      highMatches.length > 0
        ? 'Escalate high-confidence matches to senior compliance officer.'
        : 'Review medium/low-confidence matches for false positives.',
    ],
  };
}

// ---- Agent Handler ----

/**
 * Sanctions Screener agent handler.
 *
 * Compatible with the Phase 2 orchestrator's runAgent() pattern.
 * Screens an applicant against OFAC SDN, UN Security Council, and PEP lists.
 *
 * Pipeline:
 * 1. Extract applicant name (from input or extracted_fields)
 * 2. Query Supabase sanctions_entries + aliases
 * 3. Run fuzzy matching against all candidates
 * 4. Use Gemini to generate screening summary and recommendations
 * 5. Return structured SanctionsScreenerOutput
 */
export async function sanctionsScreenerHandler(
  input: SanctionsScreenerInput,
  client: GoogleGenerativeAI,
  config: AgentConfig,
): Promise<SanctionsScreenerOutput> {
  // Resolve the best name to screen
  const nameToScreen = resolveApplicantName(input);

  // Screen against all sanctions lists
  const matches = await screenAgainstDatabase(nameToScreen);

  const listsChecked = ALL_SOURCES.map((s) => SOURCE_DISPLAY_NAME[s]);
  const flagged = matches.length > 0;

  // Generate Gemini-powered summary
  const { screening_summary, recommendations } = await generateScreeningSummary(
    client,
    config,
    nameToScreen,
    matches,
    listsChecked,
  );

  return {
    flagged,
    matches,
    lists_checked: listsChecked,
    screening_summary,
  };
}

/**
 * Resolve the best applicant name from input.
 * Prefers extracted_fields full_name, falls back to applicant_name.
 */
function resolveApplicantName(input: SanctionsScreenerInput): string {
  // Check extracted_fields for full_name with higher confidence
  if (input.extracted_fields && input.extracted_fields.length > 0) {
    const fullNameField = input.extracted_fields.find(
      (f) => f.field_name === 'full_name' && f.confidence > 0.5,
    );
    if (fullNameField) {
      return fullNameField.value;
    }
  }

  return input.applicant_name;
}
