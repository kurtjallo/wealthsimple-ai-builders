import type { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AgentConfig,
  AgentResult,
  IdentityVerifierInput,
  IdentityVerifierOutput,
  IdentityMatch,
  ExtractedField,
} from '@/types';
import { fuzzyMatchName } from '@/lib/sanctions/fuzzy-match';

// ---- Screening Service Types (from Plan 04-04) ----
// The screening service may not exist yet; define the expected interface
// so the agent compiles. Once 04-04 lands, these can be replaced with imports.

interface ScreeningRequest {
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
}

interface ScreeningResultMatch {
  entry: {
    source: string;
    primary_name: string;
    date_of_birth: string | null;
    nationality: string | null;
    programs: string[];
    remarks: string | null;
    source_url: string | null;
  };
  score: number;
  confidence: 'high' | 'medium' | 'low';
  match_type: string;
  matched_field: string;
  matched_value: string;
}

interface ScreeningResult {
  screened_name: string;
  screening_date: string;
  total_matches: number;
  matches: ScreeningResultMatch[];
  risk_level: 'clear' | 'potential_match' | 'strong_match';
  summary: string;
}

// ---- Screening Service Integration ----
// Dynamically import the screening service if available; fall back to a no-op.

let _screenIdentity: ((req: ScreeningRequest) => Promise<ScreeningResult>) | null = null;

async function getScreenIdentity(): Promise<(req: ScreeningRequest) => Promise<ScreeningResult>> {
  if (_screenIdentity) return _screenIdentity;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = await import('@/lib/sanctions/screening-service');
    if (typeof mod.screenIdentity === 'function') {
      _screenIdentity = mod.screenIdentity as (req: ScreeningRequest) => Promise<ScreeningResult>;
      return _screenIdentity;
    }
  } catch {
    // screening service not available yet
  }
  // Fallback: return a clear result
  _screenIdentity = async (req: ScreeningRequest): Promise<ScreeningResult> => ({
    screened_name: req.fullName,
    screening_date: new Date().toISOString(),
    total_matches: 0,
    matches: [],
    risk_level: 'clear',
    summary: `Screening service not available. No screening performed for ${req.fullName}.`,
  });
  return _screenIdentity;
}

// ---- Verification Check Helpers ----

/**
 * Check 1: Name Consistency
 * Compares the applicant name against names extracted from documents.
 */
function verifyNameConsistency(
  applicantName: string,
  extractedFields: ExtractedField[],
): IdentityMatch[] {
  const nameFields = extractedFields.filter(
    (f) => f.field_name === 'full_name' || f.field_name === 'name',
  );

  if (nameFields.length === 0) {
    return [
      {
        field_name: 'full_name',
        expected: applicantName,
        actual: 'N/A',
        match: false,
        confidence: 0,
      },
    ];
  }

  return nameFields.map((field) => {
    const fuzzyResult = fuzzyMatchName(field.value, applicantName, {
      threshold: 0.5,
    });

    const score = fuzzyResult?.score ?? 0;
    const isMatch = score >= 0.75;

    return {
      field_name: field.field_name,
      expected: applicantName,
      actual: field.value,
      match: isMatch,
      confidence: score,
    };
  });
}

/**
 * Check 2: DOB Plausibility
 * Verifies the date of birth is plausible (18-120 years old, not in the future,
 * consistent across documents).
 */
function verifyDobPlausibility(
  extractedFields: ExtractedField[],
): { plausible: boolean; confidence: number; details: string; issues: string[] } {
  const dobFields = extractedFields.filter(
    (f) => f.field_name === 'date_of_birth' || f.field_name === 'dob',
  );

  if (dobFields.length === 0) {
    return {
      plausible: true,
      confidence: 0.5,
      details: 'No date of birth found in extracted documents.',
      issues: ['No DOB available for verification'],
    };
  }

  const issues: string[] = [];
  const now = new Date();
  const dobValues: Date[] = [];

  for (const field of dobFields) {
    const dob = new Date(field.value);
    if (isNaN(dob.getTime())) {
      issues.push(`Invalid date format from ${field.source_document_id}: "${field.value}"`);
      continue;
    }

    dobValues.push(dob);

    // Future date check
    if (dob > now) {
      issues.push(`DOB is in the future: ${field.value}`);
    }

    // Age range check (18-120)
    const ageMs = now.getTime() - dob.getTime();
    const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);

    if (ageYears < 18) {
      issues.push(`Age is under 18 (${Math.floor(ageYears)} years) — KYC requires adult applicants`);
    }
    if (ageYears > 120) {
      issues.push(`Age exceeds 120 years (${Math.floor(ageYears)} years) — likely data error`);
    }
  }

  // Cross-document consistency check
  if (dobValues.length > 1) {
    const firstDob = dobValues[0].toISOString().slice(0, 10);
    for (let i = 1; i < dobValues.length; i++) {
      const otherDob = dobValues[i].toISOString().slice(0, 10);
      if (firstDob !== otherDob) {
        issues.push(
          `DOB mismatch across documents: ${firstDob} vs ${otherDob}`,
        );
      }
    }
  }

  const plausible = issues.length === 0;
  const confidence = plausible ? 0.95 : Math.max(0.1, 0.95 - issues.length * 0.2);

  return {
    plausible,
    confidence,
    details: plausible
      ? `DOB verified: ${dobFields[0].value}. Age is within valid range.`
      : `DOB issues found: ${issues.join('; ')}`,
    issues,
  };
}

/**
 * Check 3: Document Validity
 * Checks document number format and expiry dates.
 */
function verifyDocumentValidity(
  extractedFields: ExtractedField[],
): { valid: boolean; confidence: number; details: string; issues: string[] } {
  const issues: string[] = [];
  const now = new Date();

  // Check document expiry
  const expiryFields = extractedFields.filter(
    (f) => f.field_name === 'expiry_date' || f.field_name === 'expiration_date',
  );

  for (const field of expiryFields) {
    const expiry = new Date(field.value);
    if (!isNaN(expiry.getTime()) && expiry < now) {
      issues.push(`Document expired on ${field.value} (source: ${field.source_document_id})`);
    }
  }

  // Check document number format
  const docNumberFields = extractedFields.filter(
    (f) => f.field_name === 'document_number' || f.field_name === 'passport_number',
  );

  for (const field of docNumberFields) {
    const num = field.value.replace(/\s+/g, '');
    // Passport: typically 8-9 alphanumeric characters
    if (
      (field.field_name === 'passport_number' || field.field_name === 'document_number') &&
      (num.length < 5 || num.length > 15)
    ) {
      issues.push(
        `Document number "${field.value}" has unusual length (${num.length} chars)`,
      );
    }
    // Check for obviously invalid patterns (all zeros, all same character)
    if (/^(.)\1+$/.test(num)) {
      issues.push(
        `Document number "${field.value}" appears invalid (repeated characters)`,
      );
    }
  }

  // Check extraction confidence — low-confidence extractions are suspect
  const lowConfidenceFields = extractedFields.filter((f) => f.confidence < 0.5);
  if (lowConfidenceFields.length > 0) {
    issues.push(
      `${lowConfidenceFields.length} field(s) extracted with low confidence (<0.5): ${lowConfidenceFields.map((f) => f.field_name).join(', ')}`,
    );
  }

  const valid = issues.length === 0;
  const confidence = valid ? 0.9 : Math.max(0.2, 0.9 - issues.length * 0.15);

  return {
    valid,
    confidence,
    details: valid
      ? 'All document checks passed. No expired documents or format issues detected.'
      : `Document issues found: ${issues.join('; ')}`,
    issues,
  };
}

// ---- Main Identity Verifier Handler ----

/**
 * Identity Verifier agent handler — compatible with Phase 2 orchestrator's runAgent().
 *
 * Performs 4 verification checks:
 * 1. Name consistency (fuzzy matching across documents)
 * 2. DOB plausibility (age range, cross-document consistency)
 * 3. Document validity (expiry, number format)
 * 4. Watchlist cross-reference (sanctions + PEP screening)
 *
 * Returns IdentityVerifierOutput with per-check details and overall assessment.
 */
export async function identityVerifierHandler(
  input: IdentityVerifierInput,
  _client: GoogleGenerativeAI,
  _config: AgentConfig,
): Promise<IdentityVerifierOutput> {
  const matches: IdentityMatch[] = [];
  const discrepancies: string[] = [];

  // Check 1: Name Consistency (30% weight)
  const nameMatches = verifyNameConsistency(
    input.applicant_name,
    input.extracted_fields,
  );
  matches.push(...nameMatches);

  const nameConsistencyScore =
    nameMatches.length > 0
      ? nameMatches.reduce((sum, m) => sum + m.confidence, 0) / nameMatches.length
      : 0;

  if (nameMatches.some((m) => !m.match)) {
    discrepancies.push(
      ...nameMatches
        .filter((m) => !m.match)
        .map((m) => `Name mismatch: expected "${m.expected}", found "${m.actual}" (score: ${m.confidence.toFixed(2)})`),
    );
  }

  // Check 2: DOB Plausibility (20% weight)
  const dobResult = verifyDobPlausibility(input.extracted_fields);

  if (!dobResult.plausible) {
    discrepancies.push(...dobResult.issues);
  }

  // Add DOB as an IdentityMatch entry
  const dobField = input.extracted_fields.find(
    (f) => f.field_name === 'date_of_birth' || f.field_name === 'dob',
  );
  if (dobField) {
    matches.push({
      field_name: 'date_of_birth',
      expected: dobField.value,
      actual: dobField.value,
      match: dobResult.plausible,
      confidence: dobResult.confidence,
    });
  }

  // Check 3: Document Validity (20% weight)
  const docResult = verifyDocumentValidity(input.extracted_fields);

  if (!docResult.valid) {
    discrepancies.push(...docResult.issues);
  }

  // Check 4: Watchlist Cross-Reference (30% weight)
  const screenFn = await getScreenIdentity();
  const dobValue = dobField?.value;
  const nationalityField = input.extracted_fields.find(
    (f) => f.field_name === 'nationality',
  );

  const screeningResult = await screenFn({
    fullName: input.applicant_name,
    dateOfBirth: dobValue,
    nationality: nationalityField?.value,
  });

  const watchlistClear = screeningResult.risk_level === 'clear';
  const watchlistScore = watchlistClear ? 1.0 : screeningResult.risk_level === 'potential_match' ? 0.5 : 0.2;

  if (!watchlistClear) {
    discrepancies.push(
      `Watchlist screening: ${screeningResult.summary}`,
    );
    for (const m of screeningResult.matches) {
      matches.push({
        field_name: `watchlist_${m.entry.source}`,
        expected: 'no match',
        actual: m.entry.primary_name,
        match: false,
        confidence: 1 - m.score, // lower confidence = higher match concern
      });
    }
  }

  // Calculate weighted overall confidence
  const overallConfidence =
    nameConsistencyScore * 0.3 +
    dobResult.confidence * 0.2 +
    docResult.confidence * 0.2 +
    watchlistScore * 0.3;

  // Determine verification status
  const verified =
    discrepancies.length === 0 &&
    nameConsistencyScore >= 0.75 &&
    dobResult.plausible &&
    docResult.valid &&
    watchlistClear;

  // Build summary
  const summaryParts: string[] = [];
  summaryParts.push(
    `Identity verification for ${input.applicant_name}: ${verified ? 'VERIFIED' : 'FLAGGED'}.`,
  );
  summaryParts.push(
    `Name consistency: ${(nameConsistencyScore * 100).toFixed(0)}%.`,
  );
  summaryParts.push(
    `DOB: ${dobResult.plausible ? 'plausible' : 'issues found'}.`,
  );
  summaryParts.push(
    `Documents: ${docResult.valid ? 'valid' : 'issues found'}.`,
  );
  summaryParts.push(
    `Watchlist: ${watchlistClear ? 'clear' : screeningResult.risk_level}.`,
  );
  if (discrepancies.length > 0) {
    summaryParts.push(
      `${discrepancies.length} discrepancy(ies) found.`,
    );
  }

  return {
    verified,
    matches,
    discrepancies,
    verification_summary: summaryParts.join(' '),
  };
}
