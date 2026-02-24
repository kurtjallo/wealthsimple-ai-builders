# Plan 04-05 Summary: Sanctions Screener Agent

## Status: COMPLETE

## What Was Built

**Sanctions Screener agent** (`src/lib/agents/sanctions-screener.ts`) — a real agent handler that replaces the Phase 2 stub, screening applicants against OFAC SDN, UN Security Council, and PEP sanctions lists using fuzzy name matching and Gemini-powered analysis.

## Architecture Decisions

### Single-file agent (not separate directory)
The plan suggested `src/agents/sanctions-screener/` with separate `index.ts`, `tools.ts`, and `prompt.ts` files. Instead, followed the **existing Phase 2 pattern** established by `src/lib/agents/document-processor.ts` — a single file in `src/lib/agents/` that exports a handler function compatible with the orchestrator's `registerAgent()` system.

### Direct DB screening (no separate screening-service.ts dependency)
Since Plan 04-04 (unified screening service) was still in progress, the agent implements its own screening logic directly:
1. Queries `sanctions_entries` and `sanctions_aliases` from Supabase per source
2. Runs `fuzzyMatchName()` from `src/lib/sanctions/fuzzy-match.ts` against all candidates
3. Uses configurable threshold (0.6) to catch medium and high confidence matches

### Gemini for summary generation, not screening decisions
The screening logic (DB queries + fuzzy matching) is deterministic. Gemini is used only for generating the human-readable `screening_summary` field — it reasons about the results to produce actionable text for compliance officers. If Gemini fails, a fallback summary is generated from the raw match data.

## Key Deliverable

```typescript
// Handler signature compatible with orchestrator's registerAgent()
export async function sanctionsScreenerHandler(
  input: SanctionsScreenerInput,
  client: GoogleGenerativeAI,
  config: AgentConfig,
): Promise<SanctionsScreenerOutput>
```

### Registration
```typescript
import { sanctionsScreenerHandler } from './sanctions-screener';
registerAgent('sanctions_screener', sanctionsScreenerHandler);
```

## Pipeline

1. **Resolve name** — Prefers `full_name` from extracted_fields (if confidence > 0.5), falls back to `applicant_name`
2. **Screen all sources** — Queries OFAC_SDN, UN_SECURITY_COUNCIL, PEP entries + aliases from Supabase
3. **Fuzzy match** — Runs `fuzzyMatchName()` (Levenshtein + phonetic + Arabic variant normalization) against each candidate
4. **Generate summary** — Gemini produces human-readable screening summary with recommendations
5. **Return structured output** — `SanctionsScreenerOutput` with `flagged`, `matches`, `lists_checked`, `screening_summary`

## Files

| File | Purpose |
|------|---------|
| `src/lib/agents/sanctions-screener.ts` | Sanctions Screener agent handler (NEW) |

## Types Used (existing)

- `SanctionsScreenerInput` / `SanctionsScreenerOutput` from `src/types/agents.ts`
- `SanctionsEntry`, `SanctionsAlias`, `SanctionsListSource` from `src/lib/sanctions/types.ts`
- `fuzzyMatchName()` from `src/lib/sanctions/fuzzy-match.ts`
- `AgentConfig` from `src/types/agents.ts`

## Integration Points

- **Orchestrator**: Drop-in replacement for `sanctionsScreenerStub` via `registerAgent('sanctions_screener', sanctionsScreenerHandler)`
- **Supabase**: Reads `sanctions_entries` and `sanctions_aliases` tables
- **Fuzzy matching**: Uses Phase 4 fuzzy matching engine (Levenshtein + Double Metaphone + Arabic normalization)
- **Gemini**: Uses model from `AGENT_CONFIGS.sanctions_screener` (gemini-2.5-flash) for summary generation

## Verification

- TypeScript compiles cleanly with `npx tsc --noEmit`
- Handler signature matches orchestrator's `AgentHandler<SanctionsScreenerInput, SanctionsScreenerOutput>` contract
- Output type matches `SanctionsScreenerOutput` from `src/types/agents.ts`
