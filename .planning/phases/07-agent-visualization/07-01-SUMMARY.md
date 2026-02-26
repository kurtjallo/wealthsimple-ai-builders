# Plan 07-01 Summary: SSE Infrastructure + React Hooks

## What was built

### SSE Streaming Endpoint
- `src/app/api/cases/[caseId]/stream/route.ts` — Server-Sent Events endpoint that streams pipeline state changes in real-time
- Loads case + documents from Supabase, triggers `processCase()` with `onStateChange` callback wired to SSE
- Streams `connected`, `pipeline_update`, and `pipeline_complete` events
- Persists agent run results to `agent_runs` table via upsert
- Updates case status on completion (processing → review) or failure (→ pending)

### Agent Status REST Endpoint
- `src/app/api/cases/[caseId]/agents/route.ts` — Returns current agent_runs for a case from Supabase
- Builds per-agent status map for all 5 agents (pending if no run exists)
- Fallback for page refresh resilience when SSE stream isn't active

### React Hooks
- `src/lib/hooks/use-pipeline-stream.ts` — `usePipelineStream()` hook manages EventSource lifecycle
  - States: idle → connecting → connected → completed/error
  - Auto-cleanup on unmount, manual `startStream`/`stopStream` controls
- `src/lib/hooks/use-agent-status.ts` — `useAgentStatus()` hook derives per-agent status from pipeline state
  - Pure/composable: takes `PipelineUpdate` as parameter, not internally subscribed
  - Includes labels, descriptions, pipeline order, confidence, duration

## Key decisions
- SSE over WebSockets: works natively with Next.js API routes, simpler for unidirectional flow
- `useAgentStatus` is intentionally pure — parent subscribes once, passes update down
- Identity verifier and sanctions screener both show `order: 2` (parallel stage)
- Used `statusRef` to avoid stale closure in EventSource error handler
