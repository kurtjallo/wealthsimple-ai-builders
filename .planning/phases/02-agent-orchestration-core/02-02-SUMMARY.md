---
phase: 02-agent-orchestration-core
plan: 02
status: complete
---

## Plan 02-02: Base Agent Runner & Pipeline Orchestrator

### What was built

**`src/lib/agents/agent-config.ts`** — Default configurations for all 6 agent types:
- orchestrator, document_processor, identity_verifier, sanctions_screener, risk_scorer, case_narrator
- Each config specifies model, max_tokens, timeout_ms, retry_count, and temperature
- Lighter agents (identity_verifier, sanctions_screener) use gemini-2.5-flash; reasoning agents use gemini-2.5-pro

**`src/lib/agents/base-agent.ts`** — Core agent execution wrapper:
- `runAgent<TInput, TOutput>()` — generic function that wraps any agent handler with timing, timeout (manual AbortController + setTimeout), and retry with exponential backoff
- Returns typed `AgentResult<TOutput>` with success/error/confidence/duration
- GoogleGenerativeAI client instantiated once at module level (reads GEMINI_API_KEY from env)
- Exports `AgentHandler<TInput, TOutput>` type

**`src/lib/agents/orchestrator.ts`** — Pipeline orchestrator with state machine:
- `registerAgent()` / `getHandler()` — agent handler registry pattern
- `createPipelineState()` — initializes pipeline state for a case
- `processCase()` — drives case through all 5 stages: initialized → document_processing → parallel_verification → risk_scoring → narrative_generation → completed
- Identity + Sanctions agents run in parallel via `Promise.all()`
- Graceful degradation: if one parallel agent fails but the other succeeds, pipeline continues
- `PipelineCallback` type for real-time state change notifications
- `handleFailure()` helper — accumulates errors with recoverability flag

### Key design decisions
- **Agent registry pattern**: Agents register handlers via `registerAgent()`, decoupling orchestrator from implementations
- **State machine transitions**: Validated against `PIPELINE_TRANSITIONS` — invalid transitions throw
- **Parallel execution**: IdentityVerifier and SanctionsScreener run concurrently; both must fail to stop pipeline
- **Callback-driven updates**: `onStateChange` fires on every stage transition for real-time UI

### Verification
- `npx tsc --noEmit` passes with zero errors
- All types flow correctly from `src/types/agents.ts` and `src/types/pipeline.ts`
