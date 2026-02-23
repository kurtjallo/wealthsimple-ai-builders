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

- **Status**: Initialized — PROJECT.md and config.json created
- **Planning**: `.planning/PROJECT.md` (full requirements), `.planning/config.json` (YOLO mode, comprehensive depth, parallel execution)
- **Files**: Research docs in `/research/`, project options in `PROJECT_OPTIONS.md`, synthesis in `RESEARCH_SYNTHESIS.md`
