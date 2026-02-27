# Frontend Redesign — Context Handoff

**Created**: 2026-02-26
**Purpose**: Continue the "Dark Observatory" frontend redesign across all dashboard components.

---

## What's Done (Wave 1 Complete)

- Installed `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/jetbrains-mono`
- Rewrote `src/app/globals.css` — dark-first theme using oklch colors, Tailwind theme tokens only
- Rewrote `src/app/layout.tsx` — fonts loaded via @fontsource CSS imports, added Sonner Toaster with dark theme
- Updated `src/app/dashboard/layout.tsx` — removed hardcoded `bg-[#f5f4f2]`, uses `bg-background`
- Build verified: `npm run dev` compiles cleanly

---

## What's Left (Start Here)

### Wave 2: Shell Components (DO THIS FIRST)

**Use the frontend-design skill for EVERY file change.**

1. **`src/components/layout/sidebar.tsx`** — Complete dark redesign:
   - Remove ALL hardcoded hex values: `#1a1a1a`, `#333`, `#f35c1d`, `#a8a29e`, `#6b6560`
   - Use Tailwind semantic classes: `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`
   - Active nav item: `bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-l-primary`
   - Inactive: `text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground`
   - Agent health section: keep StatusDot, update colors to dark theme
   - Keep the nav items and structure, just restyle

2. **`src/components/layout/header.tsx`** — Minimal dark header:
   - Remove 6 hardcoded hex values
   - Use: `bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40`
   - Product name "Sentinel" instead of "KYC/AML Operations"
   - Status dot, notification bell, avatar — all using semantic colors
   - Give it the product a brand identity, not generic compliance tool vibes

3. **`src/components/layout/dashboard-shell.tsx`** — Typography update:
   - `text-[#2e2c29]` → `text-foreground`
   - Title: `text-2xl font-semibold tracking-tight text-foreground`
   - Description: `text-sm text-muted-foreground`

4. **`src/lib/constants.ts`** — Dark-theme badge classes:
   ```
   STATUS_CONFIG className pattern: 'bg-{color}-500/10 text-{color}-400 border border-{color}-500/20'
   RISK_LEVEL_CONFIG: same pattern with risk-appropriate colors
   DECISION_CONFIG: same pattern

   Specific mappings:
   - pending:    bg-zinc-500/10 text-zinc-400 border-zinc-500/20
   - processing: bg-blue-500/10 text-blue-400 border-blue-500/20
   - review:     bg-amber-500/10 text-amber-400 border-amber-500/20
   - approved:   bg-emerald-500/10 text-emerald-400 border-emerald-500/20
   - denied:     bg-red-500/10 text-red-400 border-red-500/20
   - escalated:  bg-purple-500/10 text-purple-400 border-purple-500/20

   Risk levels:
   - low:      bg-emerald-500/10 text-emerald-400 border-emerald-500/20, dotColor: bg-emerald-500
   - medium:   bg-amber-500/10 text-amber-400 border-amber-500/20, dotColor: bg-amber-500
   - high:     bg-orange-500/10 text-orange-400 border-orange-500/20, dotColor: bg-orange-500
   - critical: bg-red-500/10 text-red-400 border-red-500/20, dotColor: bg-red-500
   ```

### Wave 3: Pages (after Wave 2)

1. **`src/app/dashboard/page.tsx`** — Dark dashboard overview:
   - Metric cards with `bg-card border border-border rounded-xl`
   - Stats showing "--" but with proper dark styling
   - Replace generic welcome card with something that has personality

2. **`src/app/dashboard/cases/page.tsx`** — Dark case queue:
   - Tabs with dark styling, active tab: `border-b-2 border-primary text-foreground`
   - Badge counts on tabs
   - Loading: use TableRowSkeleton instead of spinner

3. **`src/app/dashboard/cases/[id]/page.tsx`** — Dark case detail:
   - All Card components will inherit dark card styling
   - Remove hardcoded badge colors, use DECISION_CONFIG

4. **`src/app/cases/new/page.tsx`** — Dark new case wizard:
   - Integrate with DashboardShell (currently doesn't use it)
   - Dark step indicator
   - Remove hardcoded text-[#2e2c29] and text-[#6b6560]

### Wave 4: Components (can parallel with Wave 3)

**Case components** — all need dark theme + remove hardcoded hex:
- `src/components/cases/case-queue-table.tsx` — `hover:bg-[#faf9f7]` → `hover:bg-muted/50`
- `src/components/cases/risk-profile-card.tsx` — Dark progress bars, use ConfidenceRing
- `src/components/cases/case-narrative-card.tsx` — `bg-[#f35c1d]` bullets → `bg-primary`
- `src/components/cases/agent-results-panel.tsx` — `hover:bg-[#faf9f7]` → `hover:bg-muted/50`, dark code blocks
- `src/components/cases/evidence-section.tsx` — Dark badge colors
- `src/components/cases/decision-workflow.tsx` — `border-[#f35c1d]/20` → `border-primary/20`

**Pipeline components**:
- `src/components/pipeline/agent-status-card.tsx` — 5 hardcoded hex → Tailwind tokens
- `src/components/pipeline/agent-pipeline-view.tsx` — Connector line colors → semantic
- `src/components/pipeline/confidence-ring.tsx` — Hardcoded hex stroke colors → Tailwind color vars
- `src/components/pipeline/pipeline-stage-indicator.tsx` — `#f35c1d` → primary, `#e8e5e1` → border
- `src/components/pipeline/agent-status-badge.tsx` — `bg-[#f35c1d]` → `bg-primary`
- `src/components/pipeline/processing-timer.tsx` — `text-[#f35c1d]` → `text-primary`

---

## Design Direction

**Aesthetic**: "Dark Observatory" — compliance officer's command center
**Theme**: Dark-first with oklch color system
**Accent**: `#f35c1d` (orange) — surgical use only: active states, CTAs, running indicators
**Fonts**: Plus Jakarta Sans (sans), JetBrains Mono (mono) — via @fontsource-variable
**Principles**:
- NO hardcoded hex — use Tailwind semantic tokens everywhere
- NO raw CSS classes — all Tailwind utilities
- NO AI slop — no generic shield icons, no cookie-cutter layouts, unique & beautiful
- Opacity-based semantic colors for badges: `bg-{color}-500/10 text-{color}-400 border-{color}-500/20`
- Generous whitespace, `rounded-xl` (12px) border radius, subtle shadows
- `font-mono tabular-nums` for all scores, IDs, financial data
- Framer Motion for animations (already installed)

## Color Mappings (set in globals.css :root)

```
Background:     oklch(0.145 0.005 286)  ≈ #09090b (near-black)
Card:           oklch(0.21 0.006 286)   ≈ #18181b (zinc-900)
Border:         oklch(0.285 0.006 286)  ≈ #27272a (zinc-800)
Input:          oklch(0.37 0.013 286)   ≈ #3f3f46 (zinc-700)
Muted fg:       oklch(0.55 0.013 286)   ≈ #71717a (zinc-500)
Secondary fg:   oklch(0.71 0.013 286)   ≈ #a1a1aa (zinc-400)
Foreground:     oklch(0.985 0 0)        ≈ #fafafa (near-white)
Primary:        #f35c1d                  (brand orange)
Sidebar:        oklch(0.12 0.005 286)   ≈ #050506 (darkest)
```

## Research Available
- `docs/FINTECH_DESIGN_DNA.md` — Full design DNA from Mantle, Ramp, Wealthsimple with CSS values
- Agent research covered: dark glassmorphism, risk badge systems, Framer Motion configs, shadcn/ui dark theming

## Rules (from CLAUDE.md)
- For every front-end change, use the frontend-design skill
- Never include "Co-Authored-By: Claude" in commits
- After every git commit, update CLAUDE.md
- Use Tailwind only, no custom CSS classes
