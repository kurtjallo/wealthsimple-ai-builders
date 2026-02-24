import { createServerSupabaseClient } from '../supabase/server';
import type {
  SanctionsEntry,
  SanctionsAlias,
  SanctionsListSource,
  SanctionsSearchResult,
  MatchConfidence,
} from './types';
import { fuzzyMatchName } from './fuzzy-match';
import { normalizeName, normalizeArabicName } from './name-normalizer';

// ---- Public Types ----

export interface ScreeningRequest {
  fullName: string;
  dateOfBirth?: string; // ISO date string
  nationality?: string;
  documentNumber?: string; // passport/ID number for future use
}

export interface ScreeningResult {
  screened_name: string;
  screening_date: string; // ISO timestamp
  total_matches: number;
  matches: SanctionsSearchResult[];
  risk_level: 'clear' | 'potential_match' | 'strong_match';
  summary: string;
}

export interface ScreenNameOptions {
  sources?: SanctionsListSource[];
  threshold?: number;
}

// ---- Constants ----

const DEFAULT_THRESHOLD = 0.6;
const STRONG_MATCH_THRESHOLD = 0.85;
const CANDIDATE_LIMIT = 100;

// DOB adjustment constants
const DOB_EXACT_BOOST = 0.1;
const DOB_YEAR_BOOST = 0.05;
const DOB_MISMATCH_PENALTY = 0.1;
const NATIONALITY_BOOST = 0.05;

// ---- Core Functions ----

/**
 * Screen a name against all sanctions lists (OFAC, UN, PEP).
 * Uses Supabase pg_trgm for pre-filtering, then fuzzy matching for refinement.
 */
export async function screenName(
  name: string,
  options?: ScreenNameOptions
): Promise<ScreeningResult> {
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;
  const supabase = createServerSupabaseClient();

  // Normalize input for consistent matching
  const normalized = normalizeArabicName(normalizeName(name));

  // Step 1: Database pre-filter — query sanctions_entries
  let entryQuery = supabase
    .from('sanctions_entries')
    .select('*')
    .or(`primary_name.ilike.%${normalized}%,first_name.ilike.%${normalized}%,last_name.ilike.%${normalized}%`);

  if (options?.sources && options.sources.length > 0) {
    entryQuery = entryQuery.in('source', options.sources);
  }

  entryQuery = entryQuery.limit(CANDIDATE_LIMIT);

  // Step 2: Also search aliases
  const aliasQuery = supabase
    .from('sanctions_aliases')
    .select('*, entry:sanctions_entries(*)')
    .ilike('alias_name', `%${normalized}%`)
    .limit(CANDIDATE_LIMIT);

  const [entryResult, aliasResult] = await Promise.all([
    entryQuery,
    aliasQuery,
  ]);

  // Also try with individual name tokens for better recall
  const tokens = normalized.split(/\s+/).filter(Boolean);
  let tokenEntries: SanctionsEntry[] = [];
  if (tokens.length >= 2) {
    const lastToken = tokens[tokens.length - 1];
    const firstToken = tokens[0];
    let tokenQuery = supabase
      .from('sanctions_entries')
      .select('*')
      .or(`last_name.ilike.%${lastToken}%,first_name.ilike.%${firstToken}%`);

    if (options?.sources && options.sources.length > 0) {
      tokenQuery = tokenQuery.in('source', options.sources);
    }

    const tokenResult = await tokenQuery.limit(CANDIDATE_LIMIT);
    tokenEntries = (tokenResult.data ?? []) as unknown as SanctionsEntry[];
  }

  // Collect all candidate entries
  const candidateMap = new Map<string, SanctionsEntry>();

  // From direct entry matches
  for (const entry of (entryResult.data ?? []) as unknown as SanctionsEntry[]) {
    candidateMap.set(entry.id, entry);
  }

  // From token matches
  for (const entry of tokenEntries) {
    candidateMap.set(entry.id, entry);
  }

  // From alias matches — extract the joined entry
  type AliasWithEntry = SanctionsAlias & { entry: SanctionsEntry };
  const aliasRows = (aliasResult.data ?? []) as unknown as AliasWithEntry[];
  const aliasMap = new Map<string, string>(); // entry_id -> alias_name that matched

  for (const row of aliasRows) {
    if (row.entry) {
      // Apply source filter for alias results
      if (options?.sources && options.sources.length > 0) {
        if (!options.sources.includes(row.entry.source as SanctionsListSource)) {
          continue;
        }
      }
      candidateMap.set(row.entry.id, row.entry);
      aliasMap.set(row.entry.id, row.alias_name);
    }
  }

  // Step 3: Fuzzy match refinement
  const scoredMatches: SanctionsSearchResult[] = [];

  for (const [entryId, entry] of Array.from(candidateMap.entries())) {
    let bestScore = 0;
    let bestMatchType: SanctionsSearchResult['match_type'] = 'fuzzy';
    let bestMatchedField = 'primary_name';
    let bestMatchedValue = entry.primary_name;

    // Match against primary_name
    const primaryResult = fuzzyMatchName(name, entry.primary_name, { threshold });
    if (primaryResult) {
      if (primaryResult.score > bestScore) {
        bestScore = primaryResult.score;
        bestMatchType = mapMatchType(primaryResult.matchType);
        bestMatchedField = 'primary_name';
        bestMatchedValue = entry.primary_name;
      }
    }

    // Match against "first_name last_name" if available
    if (entry.first_name && entry.last_name) {
      const fullName = `${entry.first_name} ${entry.last_name}`;
      const fullResult = fuzzyMatchName(name, fullName, { threshold });
      if (fullResult && fullResult.score > bestScore) {
        bestScore = fullResult.score;
        bestMatchType = mapMatchType(fullResult.matchType);
        bestMatchedField = 'full_name';
        bestMatchedValue = fullName;
      }
    }

    // Match against alias if this entry came via alias
    const aliasName = aliasMap.get(entryId);
    if (aliasName) {
      const aliasResult = fuzzyMatchName(name, aliasName, { threshold });
      if (aliasResult && aliasResult.score > bestScore) {
        bestScore = aliasResult.score;
        bestMatchType = 'alias';
        bestMatchedField = 'alias';
        bestMatchedValue = aliasName;
      }
    }

    if (bestScore >= threshold) {
      scoredMatches.push({
        entry,
        match_type: bestMatchType,
        confidence: scoreToConfidence(bestScore),
        score: bestScore,
        matched_field: bestMatchedField,
        matched_value: bestMatchedValue,
      });
    }
  }

  // Step 4: Sort by score descending
  scoredMatches.sort((a, b) => b.score - a.score);

  // Step 5: Classify risk level
  const riskLevel = classifyRisk(scoredMatches, threshold);

  // Step 6: Generate summary
  const summary = generateSummary(name, scoredMatches, riskLevel);

  return {
    screened_name: name,
    screening_date: new Date().toISOString(),
    total_matches: scoredMatches.length,
    matches: scoredMatches,
    risk_level: riskLevel,
    summary,
  };
}

/**
 * Screen an identity with secondary verification (DOB, nationality).
 * Extends screenName with score adjustments based on biographical data.
 */
export async function screenIdentity(
  request: ScreeningRequest
): Promise<ScreeningResult> {
  const result = await screenName(request.fullName);

  if (result.matches.length === 0) {
    return result;
  }

  // Apply DOB and nationality adjustments
  for (const match of result.matches) {
    let adjustment = 0;

    // DOB verification
    if (request.dateOfBirth && match.entry.date_of_birth) {
      const queryDob = request.dateOfBirth;
      const entryDob = match.entry.date_of_birth;

      if (queryDob === entryDob) {
        adjustment += DOB_EXACT_BOOST;
      } else if (getYear(queryDob) === getYear(entryDob)) {
        adjustment += DOB_YEAR_BOOST;
      } else {
        adjustment -= DOB_MISMATCH_PENALTY;
      }
    }

    // Nationality verification
    if (request.nationality && match.entry.nationality) {
      const normQuery = request.nationality.toLowerCase().trim();
      const normEntry = match.entry.nationality.toLowerCase().trim();
      if (normQuery === normEntry) {
        adjustment += NATIONALITY_BOOST;
      }
      // Different nationality -> no change (people have multiple nationalities)
    }

    // Apply adjustment, clamp to [0, 1]
    match.score = Math.max(0, Math.min(1, match.score + adjustment));
    match.confidence = scoreToConfidence(match.score);
  }

  // Re-sort after adjustments
  result.matches.sort((a, b) => b.score - a.score);

  // Re-classify
  result.risk_level = classifyRisk(result.matches, DEFAULT_THRESHOLD);
  result.total_matches = result.matches.filter((m) => m.score >= DEFAULT_THRESHOLD).length;

  // Update summary with verification details
  const verificationNotes: string[] = [];
  if (request.dateOfBirth) verificationNotes.push('DOB verification applied');
  if (request.nationality) verificationNotes.push('nationality verification applied');

  result.summary = generateSummary(
    request.fullName,
    result.matches,
    result.risk_level
  );
  if (verificationNotes.length > 0) {
    result.summary += ` (${verificationNotes.join(', ')})`;
  }

  // Remove matches that fell below threshold after adjustments
  result.matches = result.matches.filter((m) => m.score >= DEFAULT_THRESHOLD);
  result.total_matches = result.matches.length;

  return result;
}

// ---- Internal Helpers ----

function mapMatchType(
  fuzzyType: 'exact' | 'normalized_exact' | 'fuzzy' | 'phonetic'
): SanctionsSearchResult['match_type'] {
  switch (fuzzyType) {
    case 'exact':
    case 'normalized_exact':
      return 'exact';
    case 'phonetic':
      return 'phonetic';
    case 'fuzzy':
    default:
      return 'fuzzy';
  }
}

function scoreToConfidence(score: number): MatchConfidence {
  if (score >= 0.85) return 'high';
  if (score >= 0.7) return 'medium';
  return 'low';
}

function classifyRisk(
  matches: SanctionsSearchResult[],
  threshold: number
): ScreeningResult['risk_level'] {
  const validMatches = matches.filter((m) => m.score >= threshold);
  if (validMatches.length === 0) return 'clear';

  const highestScore = validMatches[0].score;
  if (highestScore > STRONG_MATCH_THRESHOLD) return 'strong_match';
  return 'potential_match';
}

function generateSummary(
  name: string,
  matches: SanctionsSearchResult[],
  riskLevel: ScreeningResult['risk_level']
): string {
  if (riskLevel === 'clear' || matches.length === 0) {
    return `No matches found for "${name}" across OFAC, UN, PEP lists`;
  }

  // Group matches by source
  const bySource = new Map<string, SanctionsSearchResult[]>();
  for (const m of matches) {
    const source = m.entry.source;
    if (!bySource.has(source)) bySource.set(source, []);
    bySource.get(source)!.push(m);
  }

  const parts: string[] = [];
  for (const [source, sourceMatches] of Array.from(bySource.entries())) {
    const topScore = sourceMatches[0].score;
    const matchLabel = topScore > STRONG_MATCH_THRESHOLD ? 'strong' : 'potential';
    const sourceName = formatSourceName(source as SanctionsListSource);
    parts.push(
      `${sourceMatches.length} ${matchLabel} match${sourceMatches.length > 1 ? 'es' : ''} on ${sourceName} (score: ${topScore.toFixed(2)})`
    );
  }

  return parts.join(', ');
}

function formatSourceName(source: SanctionsListSource): string {
  switch (source) {
    case 'OFAC_SDN':
      return 'OFAC SDN';
    case 'UN_SECURITY_COUNCIL':
      return 'UN Security Council';
    case 'PEP':
      return 'PEP';
    default:
      return source;
  }
}

function getYear(dateStr: string): string {
  return dateStr.substring(0, 4);
}
