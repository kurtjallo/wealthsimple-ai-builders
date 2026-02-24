import { distance } from 'fastest-levenshtein';
import {
  normalizeName,
  normalizeArabicName,
  generatePhoneticCodes,
  splitNameTokens,
} from './name-normalizer';

// ---- Types ----

export interface FuzzyMatchResult {
  score: number; // 0-1 overall similarity
  matchType: 'exact' | 'normalized_exact' | 'fuzzy' | 'phonetic';
  details: {
    levenshteinScore: number; // 0-1
    phoneticMatch: boolean;
    nameVariantMatch: boolean; // Arabic normalization matched
    tokenOverlap: number; // fraction of name tokens that overlap
  };
}

export interface FuzzyMatchOptions {
  threshold?: number; // Minimum score to return a result (default 0.6)
}

// ---- Scoring Constants ----

const DEFAULT_THRESHOLD = 0.6;
const PHONETIC_BOOST = 0.15;
const VARIANT_BOOST = 0.05;

// ---- Core Matching ----

/**
 * Compare a query name against a candidate name using multiple matching strategies.
 * Returns null if the combined score is below the threshold.
 */
export function fuzzyMatchName(
  query: string,
  candidate: string,
  options?: FuzzyMatchOptions
): FuzzyMatchResult | null {
  const threshold = options?.threshold ?? DEFAULT_THRESHOLD;

  // Normalize both names
  const normQuery = normalizeName(query);
  const normCandidate = normalizeName(candidate);

  // 1. Exact match after normalization
  if (normQuery === normCandidate) {
    return {
      score: 1.0,
      matchType: 'exact',
      details: {
        levenshteinScore: 1.0,
        phoneticMatch: true,
        nameVariantMatch: false,
        tokenOverlap: 1.0,
      },
    };
  }

  // 2. Normalized exact after Arabic variant normalization
  const arabicQuery = normalizeArabicName(normQuery);
  const arabicCandidate = normalizeArabicName(normCandidate);
  const variantMatch = arabicQuery !== normQuery || arabicCandidate !== normCandidate;

  if (arabicQuery === arabicCandidate) {
    return {
      score: 0.95,
      matchType: 'normalized_exact',
      details: {
        levenshteinScore: 1.0,
        phoneticMatch: true,
        nameVariantMatch: true,
        tokenOverlap: 1.0,
      },
    };
  }

  // 3. Levenshtein distance on full normalized+arabic strings
  const maxLen = Math.max(arabicQuery.length, arabicCandidate.length);
  const levenshteinScore = maxLen === 0 ? 1.0 : 1 - distance(arabicQuery, arabicCandidate) / maxLen;

  // 4. Token overlap (Jaccard similarity) - handles name reordering
  const queryTokens = splitNameTokens(arabicQuery);
  const candidateTokens = splitNameTokens(arabicCandidate);
  const tokenOverlap = jaccardSimilarity(queryTokens, candidateTokens);

  // 5. Phonetic matching
  const queryPhonetic = generatePhoneticCodes(arabicQuery);
  const candidatePhonetic = generatePhoneticCodes(arabicCandidate);
  const phoneticMatch = comparePhoneticCodes(queryPhonetic.metaphone, candidatePhonetic.metaphone);

  // Combine scores
  const baseScore = Math.max(levenshteinScore, tokenOverlap);
  const phoneticBoost = phoneticMatch ? PHONETIC_BOOST : 0;
  const variantBoost = variantMatch ? VARIANT_BOOST : 0;
  const finalScore = Math.min(1.0, baseScore + phoneticBoost + variantBoost);

  if (finalScore < threshold) {
    return null;
  }

  // Determine match type based on dominant contributor
  let matchType: FuzzyMatchResult['matchType'];
  if (phoneticMatch && phoneticBoost > 0 && baseScore < threshold) {
    matchType = 'phonetic';
  } else {
    matchType = 'fuzzy';
  }

  return {
    score: finalScore,
    matchType,
    details: {
      levenshteinScore,
      phoneticMatch,
      nameVariantMatch: variantMatch,
      tokenOverlap,
    },
  };
}

/**
 * Match a query name against multiple candidates.
 * Returns only matches above threshold, sorted by score descending.
 */
export function fuzzyMatchNames(
  query: string,
  candidates: string[],
  options?: FuzzyMatchOptions
): (FuzzyMatchResult & { candidate: string })[] {
  const results: (FuzzyMatchResult & { candidate: string })[] = [];

  for (const candidate of candidates) {
    const result = fuzzyMatchName(query, candidate, options);
    if (result) {
      results.push({ ...result, candidate });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

// ---- Utilities ----

function jaccardSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1.0;
  if (a.length === 0 || b.length === 0) return 0;

  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;

  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }

  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compare two arrays of metaphone codes.
 * Returns true if a majority of the shorter array's codes match any code in the longer array.
 */
function comparePhoneticCodes(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false;

  const shorter = a.length <= b.length ? a : b;
  const longer = a.length <= b.length ? b : a;
  const longerSet = new Set(longer);

  let matches = 0;
  for (const code of shorter) {
    if (longerSet.has(code)) matches++;
  }

  // Majority of shorter codes must match
  return matches >= Math.ceil(shorter.length / 2);
}
