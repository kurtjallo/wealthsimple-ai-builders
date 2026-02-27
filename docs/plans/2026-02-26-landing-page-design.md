# Sentinel Landing Page Design

**Date:** 2026-02-26
**Status:** Approved
**Audience:** Wealthsimple AI Builders competition judges + executive interview panel

## Context

Sentinel is an AI-Powered KYC/AML Operations Orchestrator that reduces compliance from 5 days to 3 minutes using 5 specialized AI agents. This landing page is the front door for the demo video submission (2-3 min) and must immediately communicate product value while looking production-grade.

## Design Direction

**Inspiration:** Mantle (clean off-white, editorial typography, masonry testimonials), Ramp (mega dropdown nav), Wealthsimple (fintech polish, trading UI cards)

**Approach:** Sectioned scroll with animated hero pipeline, light mode throughout.

## Color Palette (Light Mode — Landing Only)

| Token | Value | Use |
|-------|-------|-----|
| Background | `#FAFAF8` | Off-white, warm |
| Surface | `#FFFFFF` | Cards, nav, dropdowns |
| Text primary | `#1A1A1A` | Headlines |
| Text secondary | `#6B7280` | Body text, descriptions |
| Accent | `#f35c1d` | Wealthsimple orange (primary CTA, active states) |
| Accent hover | `#e04d10` | Darker orange for hover |
| Border | `#E5E5E3` | Subtle warm gray borders |
| Muted | `#F3F3F1` | Section backgrounds for alternating contrast |

## Typography

- **Headlines:** Plus Jakarta Sans, 800 weight, tracking tight
- **Body:** Plus Jakarta Sans, 400 weight
- **Mono (stats):** JetBrains Mono for numbers/metrics
- Existing fonts — no new dependencies

## Route

- Landing page at `/` (replacing current redirect to `/dashboard`)
- Dashboard remains at `/dashboard`

## Sections (Scroll Order)

### 1. Sticky Navbar

- **Left:** Sentinel logo (shield icon + "Sentinel" wordmark)
- **Center:** Product / Solutions / Company / Pricing
- **Right:** "Log In" text link + "Try Live Demo" orange button
- **Hover behavior (Ramp-style mega dropdown):**
  - "Product" dropdown: Left column lists 5 agent types with icons (Document Processing, Identity Verification, Sanctions Screening, Risk Scoring, Case Narrative). Right column: "See it in action" with mini pipeline graphic.
  - Other items: Simple dropdown or anchor links
- **Styling:** White background, subtle bottom border, backdrop blur on scroll
- **Sticky:** Fixed to top, z-50

### 2. Hero Section

- **Headline:** "Compliance in minutes, not days." — large, bold, serif-weight feel
- **Subtext:** "AI-powered KYC/AML orchestration that processes documents, screens sanctions, verifies identities, and generates risk narratives — so compliance officers can focus on decisions, not paperwork."
- **CTAs:** "Try Live Demo" (orange filled) → `/cases/new`, "Watch Video" (outline) → scroll to How It Works
- **Right side / below:** Animated pipeline visualization
  - 5 agent nodes arranged in fork/join pattern
  - Document Processing → (fork) Identity Verification + Sanctions Screening → (join) Risk Scoring → Case Narrative
  - CSS animation: nodes light up sequentially with flowing particle dots
  - Orange accent color for active/completed nodes
  - Subtle connecting lines between nodes
- **Background:** Off-white `#FAFAF8` with subtle radial gradient

### 3. Trust Bar

- "Powering next-generation compliance" text centered
- Row of compliance-relevant badges/icons: FINTRAC, OFAC SDN, UN Consolidated List, PEP Database
- These are data source badges (not fake company logos) — shows regulatory coverage
- Muted gray styling, small

### 4. Features Grid

- 3-column grid on desktop, stacks on mobile
- **Card 1: Document Intelligence**
  - Icon: document/scan icon
  - "Mistral OCR extracts and validates passport, driver's license, and proof of address data with per-field confidence scoring."
- **Card 2: Sanctions Screening**
  - Icon: shield/search icon
  - "Real-time screening against OFAC SDN, UN Consolidated List, and PEP databases with fuzzy name matching and Arabic variant support."
- **Card 3: Risk Scoring**
  - Icon: chart/gauge icon
  - "Deterministic risk engine combines document, identity, sanctions, and PEP signals into a weighted composite score with full explainability."
- Cards have white background, subtle border, hover lift effect
- Below the 3 cards: a 2-column row with:
  - **Identity Verification:** Cross-references name, DOB, document validity, watchlist presence
  - **Case Narrative:** Gemini-generated compliance narrative with key findings and recommended action

### 5. How It Works

- Horizontal 4-step process (desktop), vertical on mobile
- **Step 1:** Upload Documents — "Drop in passport, ID, proof of address"
- **Step 2:** AI Agents Process — "5 specialized agents work in parallel"
- **Step 3:** Risk Profile Generated — "Composite score with linked evidence"
- **Step 4:** Human Decides — "Compliance officer approves, denies, or escalates"
- Connected by lines/arrows with step numbers
- Step 4 emphasized differently (human-in-the-loop is key to the WS application criteria)
- Alternating background `#F3F3F1`

### 6. Stats / Impact Section

- 4 large stats in a row:
  - **"5 days → 3 min"** — Processing time reduction
  - **"5 AI Agents"** — Working in parallel
  - **"3 Sanctions Lists"** — OFAC + UN + PEP
  - **"100% Auditable"** — Full decision trail
- Numbers in JetBrains Mono, large
- Brief description below each
- White background

### 7. Testimonials (Masonry Layout)

- Masonry grid like Mantle screenshot 3
- 4-6 fictional compliance officer quotes:
  - Head of Compliance, Regional Bank
  - KYC Analyst, Payment Processor
  - Chief Risk Officer, Digital Bank
  - AML Operations Lead, Neobank
- Each card: quote text, name, title, company (all fictional)
- Staggered heights for visual interest
- White cards on muted background

### 8. CTA Footer Section

- "Ready to transform your compliance workflow?"
- "Try Live Demo" orange button → `/cases/new`
- Clean, spacious, off-white background

### 9. Footer

- Sentinel logo
- Column links: Product, Company, Legal, Resources
- "Built for Wealthsimple AI Builders 2026"
- Minimal, dark text on off-white

## Animation Details

### Hero Pipeline Animation (CSS-only, no heavy libraries needed)

- Nodes are rounded rectangles with icon + label
- Connecting lines are SVG paths
- Animation sequence (loops every ~8 seconds):
  1. Document Processing node activates (orange border + glow)
  2. Particle dots flow along line to fork point
  3. Identity + Sanctions nodes activate simultaneously
  4. Particles flow to join point
  5. Risk Scoring activates
  6. Particle flows to Case Narrative
  7. All nodes show "complete" state briefly
  8. Reset and loop
- Uses CSS `@keyframes` + `animation-delay` for sequencing
- Framer Motion already in project — can use for entrance animations on scroll

### Scroll Animations

- Sections fade in on scroll (Framer Motion `whileInView`)
- Stats count up when visible
- Feature cards stagger in
- Keep it subtle — fintech, not flashy

## Technical Decisions

- **Single file:** `src/app/page.tsx` as the main landing page component
- **Component extraction:** Navbar, Hero, Features, HowItWorks, Stats, Testimonials, Footer as separate components in `src/components/landing/`
- **No new dependencies** — uses existing Framer Motion, shadcn/ui, Tailwind
- **Light mode scoping:** Landing page uses its own color tokens via CSS classes (doesn't affect dashboard dark mode)
- **Responsive:** Mobile-first, breakpoints at sm/md/lg/xl

## File Structure

```
src/
  app/
    page.tsx                          # Landing page (replaces redirect)
  components/
    landing/
      landing-navbar.tsx              # Sticky nav with mega dropdown
      landing-hero.tsx                # Hero section with pipeline animation
      hero-pipeline-animation.tsx     # Animated SVG pipeline
      trust-bar.tsx                   # Compliance badges
      features-grid.tsx               # 5 feature cards
      how-it-works.tsx                # 4-step process
      stats-section.tsx               # Impact numbers
      testimonials.tsx                # Masonry testimonial grid
      cta-section.tsx                 # Final CTA
      landing-footer.tsx              # Footer
```
