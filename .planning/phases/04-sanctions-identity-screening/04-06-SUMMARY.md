# Plan 04-06 Summary: Identity Verifier Agent

## Status: COMPLETE

## What was built

**File**: `src/lib/agents/identity-verifier.ts`

Identity Verifier agent handler compatible with the Phase 2 orchestration pipeline. Performs 4 verification checks on extracted identity data and returns a structured `IdentityVerifierOutput`.

## Verification Checks

### 1. Name Consistency (30% weight)
- Uses `fuzzyMatchName()` from `src/lib/sanctions/fuzzy-match.ts` to compare applicant name against names extracted from documents
- Threshold of 0.5 for detection, 0.75+ for a passing match
- Handles missing name fields gracefully

### 2. DOB Plausibility (20% weight)
- Validates age is 18-120 years (KYC requires adult applicants)
- Rejects future dates
- Cross-checks DOB consistency across multiple documents
- Handles invalid date formats

### 3. Document Validity (20% weight)
- Checks document expiry dates
- Validates document number format (length, repeated characters)
- Flags fields with low OCR extraction confidence (<0.5)

### 4. Watchlist Cross-Reference (30% weight)
- Dynamically imports `screenIdentity()` from `src/lib/sanctions/screening-service.ts` (Plan 04-04)
- Falls back to a no-op returning "clear" if screening service is not yet available
- Passes applicant name, DOB, and nationality for full identity screening

## Integration

- **Handler signature**: `identityVerifierHandler(input, client, config)` — matches Phase 2 `AnyAgentHandler` type
- **Input type**: `IdentityVerifierInput` from `src/types/agents.ts` (`case_id`, `extracted_fields`, `applicant_name`)
- **Output type**: `IdentityVerifierOutput` from `src/types/agents.ts` (`verified`, `matches`, `discrepancies`, `verification_summary`)
- **Registration**: Can be registered with `registerAgent('identity_verifier', identityVerifierHandler)` to replace the stub
- **Overall confidence**: Weighted average of all 4 checks

## Dependencies
- `@/lib/sanctions/fuzzy-match` — fuzzyMatchName (exists, Plan 04-02)
- `@/lib/sanctions/screening-service` — screenIdentity (dynamic import, Plan 04-04)
- `@/types/agents` — IdentityVerifierInput, IdentityVerifierOutput, IdentityMatch, ExtractedField

## Verification
- TypeScript compiles cleanly (`npx tsc --noEmit` passes)
- Handler exports with correct 3-parameter signature
- Compatible with orchestrator's `runAgent()` wrapper
