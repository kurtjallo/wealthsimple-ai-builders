# UI Reskin: Warm Mantle + Bold Wealthsimple

**Date**: 2026-02-26
**Status**: Approved
**Scope**: Full reskin — every visible surface

## Design Direction

Blend Mantle's warm earthy palette with Wealthsimple's bold confidence. Dark sidebar, warm off-white backgrounds, orange accent, Inter Display headings.

## Color System

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#f5f4f2` | Page background |
| `--bg-card` | `#ffffff` | Cards, panels |
| `--text-primary` | `#2e2c29` | Headings, body |
| `--text-secondary` | `#6b6560` | Muted text |
| `--text-tertiary` | `#9c9690` | Placeholders |
| `--sidebar-bg` | `#1a1a1a` | Sidebar |
| `--sidebar-text` | `#a8a29e` | Sidebar inactive |
| `--sidebar-active` | `#ffffff` | Sidebar active |
| `--accent` | `#f35c1d` | CTAs, active indicators |
| `--accent-hover` | `#e04d10` | Hover state |
| `--border` | `#e8e5e1` | Card borders |
| `--border-subtle` | `#f0ede9` | Dividers |

Status colors: emerald (success), amber (warning), red (danger), purple (escalated) — kept with warmer badge tinting.

## Typography

- Headings: Inter weight 600-700, tracking-tight
- Body: Inter 400/500, 14px base
- Mono: IBM Plex Mono 500 (scores, IDs)
- Page titles: 28px semibold
- Section headers: 18px semibold
- Small labels: 12px medium uppercase

## Layout

- Sidebar: 240px, dark (#1a1a1a), orange active indicator
- Header: white, sticky, warm border, minimal
- Content: #f5f4f2 background, 24px padding, 1200px max-width
- Cards: white, #e8e5e1 border, 12px radius, subtle shadow

## Components

- **Buttons**: Orange primary, warm border secondary, semantic decision buttons
- **Badges**: Pill shape, 10% tinted bg, 20% border, full color text
- **Cards**: White on warm bg, subtle hover lift
- **Tables**: Warm borders, warmer row hover
- **Pipeline**: Orange glow for running, keep Framer Motion
- **Agent cards**: Orange glow-pulse replacing blue

## Agent Work Breakdown

### Agent 1: Theme Foundation
- globals.css: new color tokens, CSS variables
- Tailwind theme config via @theme inline
- Add IBM Plex Mono font
- Base component token updates (card, badge, button, input)

### Agent 2: Shell & Navigation
- sidebar.tsx: dark sidebar, orange indicators, warm text
- header.tsx: minimal white header, warm border
- dashboard-shell.tsx: warm background, max-width
- dashboard/layout.tsx: updated layout integration

### Agent 3: Dashboard Pages
- cases/page.tsx: warm table, updated badges
- cases/[id]/page.tsx: warm cards, updated risk profile
- case-queue-table.tsx, case-status-badge.tsx, case-risk-badge.tsx
- risk-profile-card.tsx, case-narrative-card.tsx, evidence-section.tsx

### Agent 4: Pipeline & Interactive
- agent-status-card.tsx: orange glow, warm styling
- agent-pipeline-view.tsx: warm backgrounds
- pipeline-stage-indicator.tsx: orange active states
- confidence-ring.tsx: warmer color thresholds
- decision-workflow.tsx: warmer decision cards
- document-upload.tsx: warm drag-drop zone
- processing-error-display.tsx: warm error cards
- Golden path page (cases/new/page.tsx)
