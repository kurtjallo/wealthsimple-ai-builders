---
phase: 04-sanctions-identity-screening
plan: 04
status: complete
---

# Plan 04-04 Summary: Unified Screening Service

## What was built

**Screening service** (`src/lib/sanctions/screening-service.ts`) — the query layer that combines Supabase database searches with fuzzy matching to produce scored, evidence-linked screening results across OFAC, UN, and PEP lists.

## Artifacts

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/sanctions/screening-service.ts` | Unified sanctions screening service | ~230 |
| `src/lib/sanctions/__tests__/screening-service.test.ts` | Unit tests with mocked Supabase | ~180 |

## Key exports

- **`screenName(name, options?)`** — Screen a name against all sanctions lists. Returns matches with confidence scores, match types, and risk classification.
- **`screenIdentity(request)`** — Extended screening with DOB and nationality secondary verification. Adjusts scores based on biographical data matching.
- **`ScreeningResult`** — Result type with `screened_name`, `screening_date`, `total_matches`, `matches`, `risk_level`, `summary`.
- **`ScreeningRequest`** — Input type with `fullName`, optional `dateOfBirth`, `nationality`, `documentNumber`.

## Implementation details

### screenName flow
1. Normalize input name using `normalizeName()` + `normalizeArabicName()`
2. Query `sanctions_entries` via Supabase ILIKE on `primary_name`, `first_name`, `last_name`
3. Query `sanctions_aliases` with joined `sanctions_entries`
4. Additional token-based query (first/last name tokens) for better recall
5. Apply `fuzzyMatchName()` from fuzzy-match engine to refine candidates
6. Match against primary_name, full_name (first+last), and alias names
7. Deduplicate by entry ID, keeping highest score
8. Classify risk: `clear` (no matches >= 0.6), `potential_match` (0.6-0.85), `strong_match` (> 0.85)
9. Generate human-readable summary with source breakdown

### screenIdentity flow
1. Calls `screenName()` internally
2. DOB verification: exact match (+0.1), same year (+0.05), mismatch (-0.1)
3. Nationality verification: match (+0.05), mismatch (no change)
4. Re-sort and re-classify after adjustments
5. Summary appended with verification notes

### Source filtering
- Optional `sources` parameter filters to specific lists (e.g., `['PEP']`, `['OFAC_SDN', 'UN_SECURITY_COUNCIL']`)
- Applied at database query level for efficiency

## Test results

17/17 tests passing:
- Result structure validation (all required fields, ISO timestamp, screened_name)
- Clear results for unknown names
- Edge cases (empty string, single character, very long name)
- screenIdentity with DOB and nationality
- Source filtering with single and multiple sources
- Custom threshold support
- Full identity screening with all fields

## Dependencies

- `src/lib/sanctions/types.ts` — SanctionsEntry, SanctionsSearchResult, etc.
- `src/lib/sanctions/fuzzy-match.ts` — fuzzyMatchName() for score refinement
- `src/lib/sanctions/name-normalizer.ts` — normalizeName(), normalizeArabicName()
- `src/lib/supabase/server.ts` — createServerSupabaseClient()
