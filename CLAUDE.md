# Wealthsimple AI Builder - KYC/AML Operations Orchestrator

## Project Overview

**Chosen option**: Option 1 — AI-Powered KYC/AML Operations Orchestrator
**One-liner**: Multi-agent system that reduces KYC compliance from 5 days to 3 minutes.
**Deadline**: March 2, 2026 | **Build time**: ~5 days | **Budget**: $20-40 in API costs

**What it does**: Orchestrates document intake, identity verification, sanctions screening, risk scoring, and case narrative generation using specialized AI agents working in parallel. A compliance officer reviews a synthesized risk profile with linked evidence instead of reading hundreds of pages.

**Stack**: Claude Sonnet 4.6 + Claude Agent SDK + Mistral OCR + Next.js (v0/shadcn) + Supabase + Vercel

## Rules

- For every front-end change, use the front-end skill
- Never include "Co-Authored-By: Claude" in any git commits, pushes, or PRs. No Claude attribution in the repo.
- After every git commit, update this CLAUDE.md file to reflect the current state of the project (new files, components, decisions, etc.).
- Always auto-allow read permissions (file reads should never require confirmation).
- Always auto-allow web fetch permissions (website fetches should never require confirmation).
- Use context7 MCP server for library documentation lookups (resolve-library-id → get-library-docs).
- Use available MCP servers and skills when they're relevant to the task.

## Plan Mode Rules

When entering plan mode, follow this protocol:

**Before starting:** Ask if I want one of two modes:

1. **BIG CHANGE** -- Work through interactively, one section at a time (Architecture > Code Quality > Tests > Performance) with at most 4 top issues per section.
2. **SMALL CHANGE** -- Work through interactively, ONE question per review section.

**My engineering preferences (use these to guide recommendations):**

- DRY is important -- flag repetition aggressively.
- Well-tested code is non-negotiable; I'd rather have too many tests than too few.
- Code should be "engineered enough" -- not under-engineered (fragile, hacky) and not over-engineered (premature abstraction, unnecessary complexity).
- Err on the side of handling more edge cases, not fewer; thoughtfulness > speed.
- Bias toward explicit over clever.

**Review sections (run in order):**

1. **Architecture review** -- Evaluate: system design and component boundaries, dependency graph and coupling, data flow patterns and bottlenecks, scaling characteristics and single points of failure, security architecture (auth, data access, API boundaries).

2. **Code quality review** -- Evaluate: code organization and module structure, DRY violations (be aggressive), error handling patterns and missing edge cases (call out explicitly), technical debt hotspots, areas that are over/under-engineered relative to my preferences.

3. **Test review** -- Evaluate: test coverage gaps (unit, integration, e2e), test quality and assertion strength, missing edge case coverage (be thorough), untested failure modes and error paths.

4. **Performance review** -- Evaluate: N+1 queries and database access patterns, memory-usage concerns, caching opportunities, slow or high-complexity code paths.

**For each issue found:**

- Describe the problem concretely, with file and line references.
- Present 2-3 options, including "do nothing" where reasonable.
- For each option: specify implementation effort, risk, impact on other code, and maintenance burden.
- Give an opinionated recommended option and why, mapped to my preferences above.
- Explicitly ask whether I agree or want a different direction before proceeding.

**Formatting rules for AskUserQuestion:**

- NUMBER issues (1, 2, 3...) and give LETTERS for options (A, B, C...).
- Each AskUserQuestion option must clearly label the issue NUMBER and option LETTER so I don't get confused.
- The recommended option is always the 1st option.

**Workflow:**

- Do not assume my priorities on timeline or scale.
- After each review section, pause and ask for feedback before moving on.

## Project State

- **Status**: All 10 phases planned — 45 total execution plans, ready to execute Phase 1
- **Planning docs**:
  - `.planning/PROJECT.md` — full project context and requirements
  - `.planning/REQUIREMENTS.md` — 26 v1 requirements with traceability
  - `.planning/ROADMAP.md` — 10 phases with success criteria and requirement mappings
  - `.planning/STATE.md` — living project state
  - `.planning/config.json` — YOLO mode, comprehensive depth, parallel execution
- **Phase directories**: `.planning/phases/01-foundation` through `.planning/phases/10-demo-polish-deliverables`
- **Research**: `/research/` (10 files), `PROJECT_OPTIONS.md`, `RESEARCH_SYNTHESIS.md`

## Phase Plans Summary

| Phase | Plans | Waves | Key Focus |
|-------|-------|-------|-----------|
| 01 - Foundation | 3 (01-01 to 01-03) | 2 | Scaffold, Supabase schema, Claude SDK init |
| 02 - Agent Orchestration | 5 (02-01 to 02-05) | 3 | Types, base agent, orchestrator, config, registration |
| 03 - Document Processing | 6 (03-01 to 03-06) | 3 | Mistral OCR, structured extraction, confidence scoring |
| 04 - Sanctions & Identity | 6 (04-01 to 04-06) | 3 | UN/OFAC lists, fuzzy matching, PEP screening, identity verification |
| 05 - Risk Scoring & Narrative | 3 (05-01 to 05-03) | 2 | Scoring engine, risk scorer agent, case narrator agent |
| 06 - Dashboard Core | 4 (06-01 to 06-04) | 3 | Layout → Case queue + Risk profile (parallel) → Decision workflow |
| 07 - Agent Visualization | 4 (07-01 to 07-04) | 3 | SSE infrastructure → Pipeline components → Animations + UI polish |
| 08 - Case Lifecycle | 5 (08-01 to 08-05) | 3 | Upload + Processing (parallel) → Routing + Errors (parallel) → Golden path |
| 09 - Regulatory & Audit | 4 (09-01 to 09-04) | 2 | Audit logging + HITL enforcement (parallel) → Viewer + FINTRAC UI |
| 10 - Demo Polish | 5 (10-01 to 10-05) | 3 | Demo data + Deploy (parallel) → Video script + Explanation → Final QA |
