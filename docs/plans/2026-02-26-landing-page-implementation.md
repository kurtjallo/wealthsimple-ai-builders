# Sentinel Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a stunning, fintechy landing page at `/` for the Sentinel KYC/AML platform, targeting Wealthsimple AI Builders competition judges.

**Architecture:** Single-page scroll layout with 9 sections, each as a separate component in `src/components/landing/`. Light mode scoped via a `.landing` CSS class wrapper so the dark dashboard is unaffected. Animated hero pipeline using CSS keyframes + Framer Motion.

**Tech Stack:** Next.js 16 + React 19 + Tailwind CSS 4 + Framer Motion + Lucide React + shadcn/ui Button

**Design doc:** `docs/plans/2026-02-26-landing-page-design.md`

---

### Task 1: Light Mode CSS Tokens

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add landing-page-scoped light mode CSS variables**

Add this block after the existing `:root` block (before the `@keyframes`) in `src/app/globals.css`:

```css
/* Landing page light mode */
.landing {
  --background: #FAFAF8;
  --foreground: #1A1A1A;

  --card: #FFFFFF;
  --card-foreground: #1A1A1A;

  --popover: #FFFFFF;
  --popover-foreground: #1A1A1A;

  --primary: #f35c1d;
  --primary-foreground: #ffffff;

  --secondary: #F3F3F1;
  --secondary-foreground: #4B5563;

  --muted: #F3F3F1;
  --muted-foreground: #6B7280;

  --accent: #F3F3F1;
  --accent-foreground: #1A1A1A;

  --destructive: #ef4444;

  --border: #E5E5E3;
  --input: #E5E5E3;
  --ring: #f35c1d;
}
```

Also add these keyframes for the hero pipeline animation after the existing keyframes:

```css
@keyframes pipeline-flow {
  0% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 0; }
}

@keyframes node-activate {
  0% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes particle-move {
  0% { offset-distance: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}

@keyframes count-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

**Step 2: Verify the landing class scoping works**

Run: `npm run dev`
Open browser, check that `/dashboard` still uses dark mode (the `.landing` class is only applied on the landing page).

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add light mode CSS tokens for landing page"
```

---

### Task 2: Landing Navbar with Mega Dropdown

**Files:**
- Create: `src/components/landing/landing-navbar.tsx`

**Step 1: Create the navbar component**

Create `src/components/landing/landing-navbar.tsx` with:

- Sticky header (`fixed top-0 w-full z-50`)
- White background with subtle border-bottom and `backdrop-blur-md`
- Left: Shield icon + "Sentinel" wordmark
- Center: Product / Solutions / Company / Pricing nav links
- Right: "Log In" ghost link + "Try Live Demo" orange button
- Product hover: Mega dropdown panel with 5 agent types (left column) and "See it in action" (right column)
- Use `useState` for dropdown open state, `onMouseEnter`/`onMouseLeave` for hover
- Desktop only for mega dropdown, collapse to hamburger on mobile

Key details:
- Lucide icons: `Shield`, `FileSearch`, `UserCheck`, `AlertTriangle`, `BarChart3`, `FileText`, `Menu`, `X`
- Dropdown items: Document Processing, Identity Verification, Sanctions Screening, Risk Scoring, Case Narrative
- Each dropdown item: icon + title + one-line description
- All nav links are anchor links (scroll to sections) except "Try Live Demo" which goes to `/cases/new`
- "Log In" goes to `/dashboard`
- On scroll past 10px, add a subtle shadow to the navbar

**Step 2: Verify visually**

Run: `npm run dev`
Navigate to `/` (won't work yet since page.tsx still redirects — will verify in Task 11).

**Step 3: Commit**

```bash
git add src/components/landing/landing-navbar.tsx
git commit -m "feat: add landing navbar with Ramp-style mega dropdown"
```

---

### Task 3: Hero Pipeline Animation

**Files:**
- Create: `src/components/landing/hero-pipeline-animation.tsx`

**Step 1: Create the animated pipeline SVG component**

Create `src/components/landing/hero-pipeline-animation.tsx` with:

- SVG-based pipeline visualization (responsive, viewBox-based)
- 5 nodes arranged in fork/join pattern:
  - Row 1 (left): Document Processing
  - Row 2 (middle, forked): Identity Verification (top) + Sanctions Screening (bottom)
  - Row 3 (right): Risk Scoring (joined)
  - Row 4 (far right): Case Narrative
- Each node: rounded rect with icon, label, and status indicator
- Connecting SVG paths between nodes with animated dashed lines
- Animation sequence (CSS keyframes, loops every 10s):
  1. Document Processing activates (0-2s)
  2. Fork: Identity + Sanctions activate simultaneously (2-5s)
  3. Join: Risk Scoring activates (5-7s)
  4. Case Narrative activates (7-9s)
  5. All show complete briefly (9-10s), then reset
- Use `animation-delay` for sequencing
- Orange accent for active nodes, gray for inactive
- Subtle particle dots flowing along paths (CSS `offset-path` or simple circle animations)
- Responsive: scales down gracefully on mobile

Implementation approach:
- Define node positions as constants
- Draw SVG paths between nodes
- Animate with CSS classes that cycle through states
- Use Framer Motion for the initial entrance animation (fade + scale in)

**Step 2: Commit**

```bash
git add src/components/landing/hero-pipeline-animation.tsx
git commit -m "feat: add animated hero pipeline visualization"
```

---

### Task 4: Hero Section

**Files:**
- Create: `src/components/landing/landing-hero.tsx`

**Step 1: Create the hero section**

Create `src/components/landing/landing-hero.tsx` with:

- Full-width section, generous vertical padding (py-24 lg:py-32)
- Max-width container (`max-w-7xl mx-auto px-6`)
- Two-column layout on desktop (text left, animation right), stacks on mobile
- Left column:
  - Headline: "Compliance in minutes, not days." — `text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground`
  - Subtext: "AI-powered KYC/AML orchestration that processes documents, screens sanctions, verifies identities, and generates risk narratives — so compliance officers can focus on decisions, not paperwork." — `text-lg text-muted-foreground mt-6 max-w-lg`
  - CTAs (mt-8, flex gap-4):
    - "Try Live Demo" — Button component, default variant (orange), size lg, Link to `/cases/new`
    - "See How It Works" — Button component, outline variant with light-mode styling, size lg, anchor to `#how-it-works`
- Right column:
  - `<HeroPipelineAnimation />` component from Task 3
  - Framer Motion entrance: `initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}`
- Headline entrance: Framer Motion fade up

**Step 2: Commit**

```bash
git add src/components/landing/landing-hero.tsx
git commit -m "feat: add hero section with headline and CTAs"
```

---

### Task 5: Trust Bar

**Files:**
- Create: `src/components/landing/trust-bar.tsx`

**Step 1: Create the trust bar component**

Create `src/components/landing/trust-bar.tsx` with:

- Narrow section with muted background (`bg-muted/50`)
- Centered text: "Screening against global regulatory databases" — `text-sm text-muted-foreground`
- Row of 4 badges/items with subtle styling:
  - OFAC SDN (US Treasury)
  - UN Consolidated List
  - PEP Database
  - FINTRAC (Canada)
- Each badge: text with a small shield/globe icon, separated by dots or pipes
- Horizontal scroll on mobile, flex-wrap on desktop
- Framer Motion: fade in on scroll

**Step 2: Commit**

```bash
git add src/components/landing/trust-bar.tsx
git commit -m "feat: add regulatory trust bar"
```

---

### Task 6: Features Grid

**Files:**
- Create: `src/components/landing/features-grid.tsx`

**Step 1: Create the features grid component**

Create `src/components/landing/features-grid.tsx` with:

- Section with `id="features"`, white background, generous padding
- Section header: "Built for modern compliance teams" — centered, large, bold
- Section subheader: "Five specialized AI agents work in parallel to deliver comprehensive risk assessments." — centered, muted
- 3-column grid (desktop), 1-column (mobile):
  - **Document Intelligence**: `FileSearch` icon, "Mistral OCR extracts and validates passport, driver's license, and proof of address data with per-field confidence scoring."
  - **Sanctions Screening**: `ShieldAlert` icon, "Real-time screening against OFAC SDN, UN Consolidated List, and PEP databases with fuzzy name matching and Arabic variant support."
  - **Risk Scoring**: `BarChart3` icon, "Deterministic risk engine combines document, identity, sanctions, and PEP signals into a weighted composite score with full explainability."
- Below: 2-column row:
  - **Identity Verification**: `UserCheck` icon, "Cross-references name, DOB, document validity, and watchlist presence with weighted confidence scoring."
  - **Case Narrative**: `FileText` icon, "Gemini-generated compliance narrative with key findings, recommended action, and linked evidence for audit trails."
- Each card: white bg, subtle border, rounded-xl, p-6, hover:shadow-md transition
- Icon in a small colored circle (orange-tinted bg with orange icon)
- Framer Motion: staggered fade-in on scroll

**Step 2: Commit**

```bash
git add src/components/landing/features-grid.tsx
git commit -m "feat: add features grid with 5 agent cards"
```

---

### Task 7: How It Works

**Files:**
- Create: `src/components/landing/how-it-works.tsx`

**Step 1: Create the how-it-works section**

Create `src/components/landing/how-it-works.tsx` with:

- Section with `id="how-it-works"`, muted background (`bg-muted/30`)
- Section header: "How Sentinel works" — centered
- 4-step horizontal process (desktop), vertical on mobile
- Steps connected by lines/arrows:
  1. **Upload Documents** — `Upload` icon — "Drop in passport, ID, and proof of address. Drag-and-drop or click to upload."
  2. **AI Agents Process** — `Cpu` icon — "Five specialized agents analyze documents, verify identity, and screen sanctions in parallel."
  3. **Risk Profile Generated** — `BarChart3` icon — "Composite risk score with linked evidence, full audit trail, and explainable factors."
  4. **Human Decides** — `UserCheck` icon — "Compliance officer reviews the synthesized profile and approves, denies, or escalates." ← This step gets special emphasis (different card style, slight orange border) to highlight human-in-the-loop
- Each step: number circle (1-4), icon, title, description
- Connecting line between steps: dashed, gray, with an arrow head
- Framer Motion: steps animate in sequentially on scroll

**Step 2: Commit**

```bash
git add src/components/landing/how-it-works.tsx
git commit -m "feat: add how-it-works 4-step section"
```

---

### Task 8: Stats Section

**Files:**
- Create: `src/components/landing/stats-section.tsx`

**Step 1: Create the stats/impact section**

Create `src/components/landing/stats-section.tsx` with:

- Section with white background, generous padding
- 4 stats in a grid row:
  1. **"5 days → 3 min"** — "Processing time"
  2. **"5 Agents"** — "Working in parallel"
  3. **"3 Lists"** — "OFAC + UN + PEP"
  4. **"100%"** — "Auditable decisions"
- Numbers: `font-mono text-4xl lg:text-5xl font-bold text-foreground`
- Labels: `text-sm text-muted-foreground mt-2`
- Animated count-up effect using Framer Motion `useInView` + `useMotionValue` + `useTransform`
- Framer Motion: numbers animate in when section scrolls into view

**Step 2: Commit**

```bash
git add src/components/landing/stats-section.tsx
git commit -m "feat: add stats/impact section with animated numbers"
```

---

### Task 9: Testimonials (Masonry)

**Files:**
- Create: `src/components/landing/testimonials.tsx`

**Step 1: Create the testimonials masonry section**

Create `src/components/landing/testimonials.tsx` with:

- Section with muted background
- Section header: "Trusted by compliance professionals" — centered
- Masonry grid layout (CSS columns, 3 on desktop, 2 on tablet, 1 on mobile)
- 6 fictional testimonial cards:
  1. "What used to take our team an entire week of manual document review now happens in minutes. The AI agents catch things we'd miss on page 200 of a sanctions filing." — **Sarah Chen**, Head of Compliance, Pacific Digital Bank
  2. "The parallel agent architecture is brilliant. Identity verification and sanctions screening happening simultaneously means we're not just faster — we're more thorough." — **Marcus Thompson**, Chief Risk Officer, Meridian Financial
  3. "Finally, a system that understands the human must make the final call. Sentinel gives me everything I need to decide in one screen instead of hunting through twelve systems." — **Priya Sharma**, KYC Analyst, Atlas Payments
  4. "We evaluated six compliance platforms. Sentinel was the only one that could screen against OFAC, UN, and PEP databases simultaneously with fuzzy matching for Arabic name variants." — **James Okafor**, AML Operations Lead, NorthStar Neobank
  5. "The audit trail alone is worth it. Every decision is linked to evidence, every agent's reasoning is transparent. Regulators love it." — **Elena Rodriguez**, VP Compliance, Catalyst Credit Union
  6. "Onboarding went from our biggest bottleneck to our competitive advantage. Three minutes to a complete risk profile with confidence scores on every data point." — **David Kim**, COO, Horizon Fintech
- Each card: white bg, rounded-xl, p-6, quote text, then name + title + company below
- Cards have varying heights for masonry effect (longer quotes = taller cards)
- Framer Motion: staggered entrance

**Step 2: Commit**

```bash
git add src/components/landing/testimonials.tsx
git commit -m "feat: add masonry testimonials section"
```

---

### Task 10: CTA Section + Footer

**Files:**
- Create: `src/components/landing/cta-section.tsx`
- Create: `src/components/landing/landing-footer.tsx`

**Step 1: Create the CTA section**

Create `src/components/landing/cta-section.tsx` with:

- Section with white background, large padding
- Centered layout:
  - Headline: "Ready to transform your compliance workflow?" — large, bold
  - Subtext: "See how Sentinel processes a complete KYC case in under 3 minutes." — muted
  - Button: "Try Live Demo" — orange, large, Link to `/cases/new`
- Simple, spacious, impactful

**Step 2: Create the footer**

Create `src/components/landing/landing-footer.tsx` with:

- Dark section (contrast with the rest of the page) — `bg-[#1A1A1A] text-white`
- Max-width container
- Top row: Sentinel logo + "AI-Powered KYC/AML Operations"
- 4-column grid:
  - **Product**: Document Processing, Sanctions Screening, Risk Scoring, Identity Verification, Case Narrative
  - **Company**: About, Careers, Blog (all `#` links — placeholder)
  - **Resources**: Documentation, API Reference, Status (all `#` links)
  - **Legal**: Privacy Policy, Terms of Service, Security (all `#` links)
- Bottom row: "Built for Wealthsimple AI Builders 2026" + copyright
- Divider line between columns and bottom text

**Step 3: Commit**

```bash
git add src/components/landing/cta-section.tsx src/components/landing/landing-footer.tsx
git commit -m "feat: add CTA section and landing footer"
```

---

### Task 11: Assemble Landing Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace redirect with landing page**

Replace the entire content of `src/app/page.tsx` with the landing page that imports and composes all sections:

```tsx
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="landing min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <LandingHero />
        <TrustBar />
        <FeaturesGrid />
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
```

Note: The `.landing` class wrapper activates the light-mode CSS variables from Task 1.

**Step 2: Verify the full page**

Run: `npm run dev`
Navigate to `http://localhost:3000/`
Verify:
- All sections render in order
- Light mode colors applied
- Dashboard at `/dashboard` still dark mode
- Navbar sticky and mega dropdown works on hover
- Hero animation loops
- Scroll animations trigger
- "Try Live Demo" navigates to `/cases/new`
- "Log In" navigates to `/dashboard`
- Responsive layout at mobile breakpoints

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble landing page at root route"
```

---

### Task 12: Responsive Polish + Final Tweaks

**Files:**
- Modify: Various landing components as needed

**Step 1: Test all breakpoints**

Test at: 375px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop)

Fix any issues with:
- Navbar hamburger menu on mobile
- Hero text sizing and animation scaling
- Feature grid stacking
- How-it-works vertical layout on mobile
- Stats grid wrapping
- Testimonials masonry column count
- Footer column stacking

**Step 2: Performance check**

- Verify no layout shift (CLS)
- Animations don't cause jank
- Images/SVGs are optimized

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: landing page responsive polish"
```

---

## Execution Waves

**Wave 1 (parallel):** Task 1 (CSS tokens) + Task 2 (Navbar) + Task 3 (Pipeline animation)
**Wave 2 (parallel):** Task 4 (Hero) + Task 5 (Trust bar) + Task 6 (Features grid)
**Wave 3 (parallel):** Task 7 (How it works) + Task 8 (Stats) + Task 9 (Testimonials)
**Wave 4 (parallel):** Task 10 (CTA + Footer) + Task 11 (Assembly)
**Wave 5:** Task 12 (Polish)

Total: 12 tasks, 5 waves, ~10 components
