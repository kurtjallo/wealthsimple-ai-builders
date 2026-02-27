# Fintech Design DNA

Compiled analysis of design patterns from three leading fintech platforms: **Mantle** (withmantle.com), **Ramp** (ramp.com), and **Wealthsimple** (wealthsimple.com). This document distills the common visual language that makes modern fintech feel clean, trustworthy, and sophisticated.

---

## 1. Mantle (withmantle.com)

**Product**: AI-powered cap table management for founders (Toronto-based fintech).

### Color Palette

| Role | Color | Notes |
|------|-------|-------|
| Primary Background | Dark / near-black | Deep, dark theme dominates the homepage |
| Accent / Brand | Green gradient | Used for CTAs, highlights, and data visualization |
| Text Primary | White / off-white | High contrast on dark backgrounds |
| Text Secondary | Gray (#9CA3AF range) | Muted supporting text |
| Surface / Cards | Dark gray with subtle borders | Elevated card surfaces against darker backgrounds |

### Typography
- Clean, modern sans-serif (geometric family)
- Large, bold hero headlines
- Generous letter-spacing on headings
- Lightweight body text for readability against dark backgrounds

### Layout & Design Patterns
- **Dark-first design**: Entire site built around dark theme, conveying tech sophistication
- **Generous whitespace**: Content breathes with ample vertical spacing between sections
- **Gradient accents**: Green gradients used as accent highlights and decorative elements
- **AI-forward visuals**: Data extraction and automation visualized with clean illustrations
- **Card-based feature showcase**: Features presented in grid cards with subtle borders

### Navigation
- Clean top navigation bar
- Minimal link count (focused navigation)
- CTA buttons (e.g., "Book a Demo") prominently placed

### Interactions
- Smooth scroll transitions
- Hover states on cards and buttons
- Clean, non-distracting animations

---

## 2. Ramp (ramp.com)

**Product**: Corporate cards, spend management, and accounts payable (NYC-based, $8B+ valuation).

### Color Palette

| Role | Hex | Color | Notes |
|------|-----|-------|-------|
| Primary Brand | `#1A3731` | Deep Teal | Hero brand element; appears on cards, UI, marketing |
| Background (Dark) | `#0D1B16` - `#111111` range | Near-black green-tinted | Dark sections |
| Background (Light) | `#FFFFFF` | White | Clean white sections |
| Surface | `#F5F5F5` - `#FAFAFA` | Off-white / light gray | Card backgrounds |
| Text Primary | `#FFFFFF` (on dark) / `#1A1A1A` (on light) | — | High contrast text |
| Accent / Constructive | Green tones | — | Success states, positive outcomes |
| Accent / Destructive | Red tones | — | Error states, negative outcomes |
| Neutral | Gray scale | — | Borders, secondary text |

### Typography
- **Brand Typeface**: TWK Lausanne (by WELTKERN) — used for identity and headlines
- **Secondary Typeface**: Burgess — used for editorial and accent typography
- **Logo**: Custom wordmark based on TWK Lausanne, lowercase, generous letter-spacing
- **Type Scale**: Established scales for various sizes from display to caption
- **Weight Usage**: Bold (700) for headlines, Regular (400) for body, Light for supporting text
- **Font Style**: Modern geometric sans-serif; clean, spacious, professional

### Layout & Design Patterns
- **"Bento Box" grid system**: Flexible grid adapting to both sparse and dense content
- **Data-forward interfaces**: Analytical dashboards and metrics prominently featured
- **High-quality photography and illustration**: Professional imagery throughout
- **Clean white sections alternating with dark teal sections**: Creates visual rhythm
- **Generous padding**: Cards and sections have significant internal spacing

### Navigation
- Sticky top navigation
- Mega-menu dropdowns for product categories
- Clean horizontal nav links with CTA button on right
- Mobile: hamburger menu

### Cards & Containers
- Clean card layouts with subtle shadows
- Rounded corners (12px-16px range)
- White/off-white card backgrounds on light sections
- Subtle border treatment (1px solid with low-opacity borders)

### Data Visualization
- Semantic color system: colors assigned by meaning (constructive = green, destructive = red)
- Clean, minimal chart styles
- Large metric numbers with supporting labels
- Delta indicators showing change (up/down arrows with color)

### Animations & Motion
- **Motion expressions defined**: Tactile interactions and spatial design
- **Scroll-triggered animations**: Elements animate in on scroll
- **Card hover effects**: Subtle lift/shadow changes
- **Page transitions**: Smooth Webflow-powered transitions
- **Loading states**: Skeleton screens and shimmer effects

### Button Styles
- **Primary**: Deep teal (`#1A3731`) background, white text, rounded (8px-12px)
- **Secondary**: White/transparent background, dark text, border
- **Ghost**: Text-only, no background, hover underline
- **CTA**: Prominent sizing, often with arrow icon

### Status Indicators
- Semantic color-coded badges
- Dot indicators for active/inactive states
- Progress bars for completion states

---

## 3. Wealthsimple (wealthsimple.com)

**Product**: Investing, trading, crypto, and financial super app (Toronto-based, Awwwards Honorable Mention).

### Color Palette

| Role | Hex | Color Name | Notes |
|------|-----|------------|-------|
| Primary Brand | `#32302F` | Dune | Near-black warm brown; primary brand identity |
| Background (Light) | `#FFFFFF` | White | Dominant background |
| Background (Warm) | `#FCFCFC` | Off-white | Subtle warm background |
| Accent Teal | `#49C5B6` | — | CTAs, interactive elements |
| Accent Gold | `#ECD06F` | — | Highlights, financial imagery |
| Accent Red | Warm red tones | — | Part of rebrand palette (rich yellows and warm reds) |
| Accent Yellow | Rich yellow tones | — | Part of rebrand palette |
| Accent Blue | Blue tones | — | Part of rebrand palette |
| Text Primary | `#32302F` (on light) / `#FFFFFF` (on dark) | Dune / White | High contrast |
| Gray Scale | Various | — | Background tints (gray-90, gray-80, etc.) |

### Typography
- **Display / Logo**: Caslon Graphique (extra-bold display serif by Leslie Usherwood) — the wordmark
- **Headings**: Futura PT (by ParaType) — geometric sans-serif for headings
- **Body / UI**: Monaco (monospace for data) + Futura PT for general text
- **Philosophy**: "Timeless Caslon and Futura convey security of money, treated in a way that is fun and approachable"
- **Weight Usage**: Bold headings, regular body text, generous sizing
- **Responsive**: Large paragraphs broken into 3-4 smaller sentences for scanability

### Layout & Design Patterns
- **Extreme whitespace**: Generous vertical spacing; content breathes
- **Minimal, uncluttered layouts**: Content density is deliberately low
- **Full-width sections**: Alternating between light and dark full-bleed sections
- **Intelligent information architecture**: Despite many products, navigation stays clear
- **Jump links**: Used on deep-scroll pages for quick navigation
- **Bold, simple type creates visual hierarchy**: Typography as design element

### Navigation
- Clean top navigation bar
- Product mega-menu for multiple offerings
- Sticky header behavior
- Orange/teal CTAs that pop against neutral backgrounds
- Accordion menus on content-heavy pages

### Cards & Containers
- **Square frames with rounded-edge buttons**: Mix of sharp containers and soft interactive elements
- **Minimal shadow usage**: Flat design with subtle elevation
- **Gradient backgrounds**: Used sparingly for feature highlights
- **Glass-like surfaces**: Some glassmorphism effects
- Clean borders when used

### Data Visualization
- **3D animations**: ManvsMachine partnership for 3D visual language
- **Real-time sliders**: Interactive tools showing potential investment returns
- **Coins and financial metaphors**: Visual storytelling through animated 3D objects
- **Bold numbers**: Large financial figures as hero elements
- **Clean charts**: Minimal chart decoration, focus on the data

### Animations & Motion
- **Cinema 4D-powered 3D animations**: Coins, objects, textures
- **Microinteractions**: Awwwards-recognized micro-animations
- **Scroll-triggered reveals**: Content animates on scroll
- **Smooth page transitions**: Between sections and pages
- **Texture and materiality**: Golden lustre, textured wood, tactile feeling

### Dark Mode
- Full dark mode support in mobile app (iOS and Android)
- Toggle between Light, Dark, and System preference
- Website primarily light theme with dark sections

### Button Styles
- **Primary**: Orange/teal background, rounded edges, high contrast
- **Secondary**: Outlined, rounded
- **Navigation**: Clean text links
- **CTAs pop against neutral backgrounds**: Deliberate contrast strategy

### Status Indicators
- Color-coded states using green (success), red (alert), yellow (warning)
- Clean badge styling from Fabric design system
- Text color mixins: `text-green`, `text-dark-green`, `text-red`, `text-yellow`

---

## Unified Fintech Design DNA

### Common Design Principles

These three fintech platforms share a set of core design principles that define what "modern fintech" looks like:

#### 1. Restrained Color Palette
All three sites use a **primary duo** (dark + white) with **minimal accent colors**:
- Mantle: Dark background + green accent
- Ramp: Deep teal `#1A3731` + white
- Wealthsimple: Dune `#32302F` + white

**Pattern**: A single dark brand color paired with white, plus 1-2 carefully chosen accent colors. Never more than 3-4 colors on screen at once.

```css
/* Recommended Base Palette */
--color-primary: #1A1E23;        /* Near-black with personality */
--color-primary-light: #2A2F36;  /* Elevated surfaces */
--color-background: #FFFFFF;      /* Clean white */
--color-surface: #F8F9FA;        /* Off-white cards */
--color-surface-dark: #1E2328;   /* Dark mode cards */
--color-accent: #1A3731;         /* Deep teal (Ramp-inspired) */
--color-accent-light: #49C5B6;   /* Bright teal (Wealthsimple-inspired) */
--color-text-primary: #32302F;   /* Warm near-black text */
--color-text-secondary: #6B7280; /* Muted gray text */
--color-text-inverse: #FFFFFF;   /* White text on dark */
```

#### 2. Semantic Color System
All three encode meaning into color rather than decoration:

```css
/* Semantic Colors */
--color-constructive: #10B981;   /* Success, positive, approved */
--color-destructive: #EF4444;    /* Error, negative, rejected */
--color-warning: #F59E0B;        /* Caution, pending review */
--color-info: #3B82F6;           /* Informational, neutral action */

/* Risk-Level Colors (KYC/AML specific) */
--color-risk-low: #10B981;       /* Green - clear */
--color-risk-medium: #F59E0B;    /* Amber - review needed */
--color-risk-high: #EF4444;      /* Red - escalation */
--color-risk-critical: #7C3AED;  /* Purple - immediate action */
```

#### 3. Typography Strategy

**The shared approach**: One geometric sans-serif for UI, optionally paired with a serif for editorial/brand content.

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Display / Hero | 48-72px | 700-800 | 1.0-1.1 | -0.02em |
| H1 | 36-48px | 700 | 1.1-1.2 | -0.015em |
| H2 | 28-36px | 600-700 | 1.2 | -0.01em |
| H3 | 22-28px | 600 | 1.3 | -0.005em |
| H4 | 18-22px | 600 | 1.4 | 0 |
| Body Large | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.5 | 0 |
| Body Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 500 | 1.4 | 0.01em |
| Monospace (Data) | 14-16px | 500 | 1.4 | 0.02em |

**Font recommendations for a similar aesthetic**:
- **Primary**: Inter, TWK Lausanne, or Futura PT (geometric sans-serif)
- **Monospace**: JetBrains Mono or SF Mono (for financial data and code)
- **Optional Serif**: Source Serif Pro or Caslon (for editorial sections)

```css
/* Typography Tokens */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
--font-display: 'Inter', sans-serif;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### 4. Spacing System (8px Base Grid)

All three sites use generous spacing. Fintech demands breathing room to convey confidence and clarity.

```css
/* Spacing Scale (8px base) */
--space-0: 0;
--space-1: 4px;     /* Tight: icon-to-text gaps */
--space-2: 8px;     /* Compact: badge padding, small gaps */
--space-3: 12px;    /* Default: input padding, card internal */
--space-4: 16px;    /* Standard: between related elements */
--space-5: 20px;    /* Between form fields */
--space-6: 24px;    /* Card padding, section gaps */
--space-7: 32px;    /* Between card groups */
--space-8: 40px;    /* Section padding */
--space-9: 48px;    /* Large section gaps */
--space-10: 64px;   /* Page section breaks */
--space-11: 80px;   /* Major section dividers */
--space-12: 96px;   /* Hero section padding */
```

**Key principle**: Fintech uses 1.5-2x more whitespace than typical SaaS. When in doubt, add more space.

#### 5. Border Radius

The trend across all three: **medium rounded corners** -- not fully rounded pills, not sharp squares.

```css
/* Border Radius Tokens */
--radius-none: 0;
--radius-sm: 4px;      /* Small elements: badges, tags */
--radius-md: 8px;      /* Default: inputs, small cards */
--radius-lg: 12px;     /* Standard: cards, containers */
--radius-xl: 16px;     /* Large cards, modal dialogs */
--radius-2xl: 20px;    /* Feature cards, hero elements */
--radius-full: 9999px; /* Pills, avatars, dots */
```

**Preferred default**: `12px` for cards, `8px` for inputs/buttons, `4px` for badges.

#### 6. Shadows

Fintech shadows are **subtle and layered**. Never harsh. The goal is gentle elevation, not dramatic depth.

```css
/* Shadow Tokens */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.06), 0 8px 10px rgba(0, 0, 0, 0.03);

/* Dark mode shadows use lighter, more diffuse glows */
--shadow-dark-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.05);
--shadow-dark-md: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.06);
--shadow-dark-lg: 0 12px 24px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.08);

/* Interactive shadow (hover state) */
--shadow-interactive: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
```

**Key principle**: Multi-layered shadows (2 box-shadow values) create realistic, soft depth. On dark backgrounds, use near-transparent white inset borders instead of shadows.

#### 7. Card & Container Design

```css
/* Light Mode Card */
.card {
  background: var(--color-background);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-lg);     /* 12px */
  padding: var(--space-6);              /* 24px */
  box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.card:hover {
  box-shadow: var(--shadow-interactive);
  transform: translateY(-1px);
}

/* Dark Mode Card */
.card-dark {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  backdrop-filter: blur(8px);
}
.card-dark:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
}
```

#### 8. Navigation Patterns

**Shared patterns across all three**:
- **Sticky top header**: Fixed at top, ~60-72px height
- **Left-aligned logo**: Brand mark on the left
- **Right-aligned CTA**: Primary action button (Sign Up / Get Started / Book Demo)
- **Centered or left-aligned nav links**: 4-6 primary links
- **Mega-menus**: For complex product offerings (Ramp, Wealthsimple)
- **Transparent-to-solid scroll transition**: Header gains background on scroll

```css
/* Navigation Token Reference */
--nav-height: 64px;
--nav-height-mobile: 56px;
--nav-bg: rgba(255, 255, 255, 0.8);
--nav-bg-scrolled: rgba(255, 255, 255, 0.95);
--nav-backdrop-blur: blur(12px);
--nav-border-bottom: 1px solid rgba(0, 0, 0, 0.06);
--nav-z-index: 50;

/* Dark variant */
--nav-bg-dark: rgba(15, 15, 15, 0.8);
--nav-bg-dark-scrolled: rgba(15, 15, 15, 0.95);
--nav-border-bottom-dark: 1px solid rgba(255, 255, 255, 0.06);
```

#### 9. Button Styles

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);     /* Dark brand color */
  color: white;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-md);       /* 8px */
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: all 150ms ease;
}
.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.25);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  transition: all 150ms ease;
}
.btn-ghost:hover {
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.04);
}

/* Accent / CTA Button (Wealthsimple style) */
.btn-accent {
  background: var(--color-accent);
  color: white;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  transition: all 200ms ease;
}
.btn-accent:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 55, 49, 0.3);
}
```

#### 10. Status Indicators & Badges

```css
/* Status Dot */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  display: inline-block;
}
.status-dot--active {
  background: var(--color-constructive);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  animation: pulse 2s ease-in-out infinite;
}
.status-dot--warning {
  background: var(--color-warning);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}
.status-dot--error {
  background: var(--color-destructive);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-sm);       /* 4px */
  line-height: 1.4;
}
.badge--success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}
.badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #D97706;
}
.badge--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
}
.badge--info {
  background: rgba(59, 130, 246, 0.1);
  color: #2563EB;
}
.badge--neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #4B5563;
}
```

#### 11. Table & List Design

Fintech tables prioritize scanability and data density without clutter:

```css
/* Table */
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.table th {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
  position: sticky;
  top: 0;
  background: var(--color-background);
}
.table td {
  font-size: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  vertical-align: middle;
}
.table tr:hover td {
  background: rgba(0, 0, 0, 0.02);
}

/* Monospace for financial data in tables */
.table .numeric {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
```

#### 12. Data Visualization Patterns

**How all three display numbers and metrics**:

```css
/* Metric Card */
.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.metric__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.metric__value {
  font-size: 32px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}
.metric__delta {
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.metric__delta--positive {
  color: var(--color-constructive);
}
.metric__delta--negative {
  color: var(--color-destructive);
}
```

**Pattern**: Big number first, small label above or below, delta (change) indicator with arrow. Always use `tabular-nums` for financial figures so digits align vertically.

#### 13. Animation & Transition Patterns

```css
/* Transition Tokens */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* Entrance Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Stagger delay helper (for Framer Motion or CSS) */
/* Use 50-100ms stagger between sibling elements */

/* Pulse animation for active/processing states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer for skeleton loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0.02) 50%,
    rgba(0, 0, 0, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}
```

**Shared animation philosophy**:
- **Subtle over dramatic**: Animations serve clarity, never distract
- **Fast default**: 150-200ms for interactive elements
- **Staggered reveals**: Lists and card grids animate in sequentially (50-100ms stagger)
- **Transform-based**: Prefer `transform` and `opacity` for 60fps performance
- **Reduced motion respect**: Always support `prefers-reduced-motion: reduce`

#### 14. Dark Mode Strategy

All three platforms support or use dark themes in some form:

```css
/* Dark Mode Variables */
:root[data-theme="dark"] {
  --color-background: #0A0A0B;
  --color-surface: #141416;
  --color-surface-elevated: #1C1C1F;
  --color-text-primary: #F5F5F5;
  --color-text-secondary: #9CA3AF;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.15);
}

/* Dark mode avoids pure black (#000) -- uses #0A0A0B or #111111 */
/* Dark mode uses semi-transparent white borders instead of shadows */
/* Dark mode cards use subtle glass effects (backdrop-filter) */
```

**Pattern**: Dark backgrounds are never pure `#000000`. They are warm or cool near-blacks (`#0A0A0B`, `#111111`, `#0D1B16`). Borders replace shadows in dark mode. Use `rgba(255, 255, 255, 0.06-0.12)` for border colors.

---

## Summary: What Makes It Feel "Fintech"

1. **Restrained palette**: 2-3 colors max. Dark brand color + white + one accent.
2. **Generous whitespace**: 1.5-2x more than typical SaaS. White space = confidence.
3. **Geometric sans-serif type**: Inter, Lausanne, Futura -- clean, modern, trustworthy.
4. **Tabular numbers**: Always `font-variant-numeric: tabular-nums` for financial data.
5. **Subtle shadows**: Multi-layered, low-opacity. Never harsh drop shadows.
6. **12px border radius**: The sweet spot -- rounded but not bubbly.
7. **Semantic color**: Green = good, red = bad, amber = caution. No decorative color.
8. **Dark mode done right**: Near-black (not pure black), glass borders, subtle glow.
9. **Motion with purpose**: 200ms transitions, staggered reveals, transform-only animations.
10. **Data-forward layout**: Big numbers, small labels, delta indicators, clean tables.
11. **Trust signals everywhere**: Clean design itself is a trust signal. Professional = trustworthy.
12. **Monospace for money**: Financial figures in monospace or tabular-nums fonts.

---

## Sources

### Mantle (withmantle.com)
- [Mantle | Cap Table Management for Founders](https://withmantle.com/)
- [Mantle Launches Free AI Cap Table Management](https://ncfacanada.org/mantle-launches-free-ai-cap-table-management/)

### Ramp (ramp.com)
- [Ramp Logo and Brand Colors](https://logotyp.us/logo/ramp/)
- [Ramp Brand Assets - Brandfetch](https://brandfetch.com/ramp.com)
- [Ramp | Red Antler](https://www.redantler.com/work/ramp)
- [Ramp Bakken & Baeck Case Study](https://bakkenbaeck.com/case/ramp)
- [Ramp identity - Fonts In Use](https://fontsinuse.com/uses/38468/ramp-identity)
- [Ramp 2023 campaign - Fonts In Use](https://fontsinuse.com/uses/56961/ramp-2023-campaign)
- [Bootstrapping a UI component library - Ramp Builders Blog](https://builders.ramp.com/post/bootstrapping-a-ui-component-library)
- [Ramp | Webflow](https://webflow.com/customers/ramp)
- [Ramp Landing Page UI - Figma](https://www.figma.com/community/file/1384920394922831829/ramp-landing-page-ui-web-to-figma)

### Wealthsimple (wealthsimple.com)
- [Wealthsimple Brand Color Palette - Mobbin](https://mobbin.com/colors/brand/wealthsimple)
- [Wealthsimple Brand Colors - ColorFYI](https://colorfyi.com/brands/wealthsimple/)
- [Colors - Fabric (Wealthsimple Design System)](https://fabric.wealthsimple.com/colors/)
- [Wealthsimple Design System 2025 - Figma](https://www.figma.com/community/file/1553208141755439461/wealthsimple-design-system-2025-ui-kit)
- [Wealthsimple Rebrand - New Wealthsimple](https://www.wealthsimple.com/en-ca/magazine/new-wealthsimple-15)
- [Rebranding Wealthsimple - Joonas Virtanen](https://www.joonasvirtanen.com/project/rebranding-wealthsimple-for-a-new-era)
- [Wealthsimple - Awwwards Honorable Mention](https://www.awwwards.com/sites/wealthsimple-com-1)
- [Wealthsimple - CSS Design Awards](https://www.cssdesignawards.com/sites/wealthsimple/42078/)
- [Wealthsimple Design - DesignRush](https://www.designrush.com/best-designs/websites/wealthsimple)
- [Wealthsimple Logo Font](https://fontsherlock.com/wealthsimple-logo-font/)
- [Wealthsimple - Matt Whitewood](https://www.mattwhitewood.com/wealthsimple)

### General Fintech Design
- [Fintech Design Guide 2026 - Eleken](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Top 10 Fintech UX Design Practices 2026 - Onething Design](https://www.onething.design/post/top-10-fintech-ux-design-practices-2026)
- [Best Fintech Website Designs 2026 - Azuro Digital](https://azurodigital.com/fintech-website-examples/)
- [Fintech Dashboard Design - Merge Rocks](https://merge.rocks/blog/fintech-dashboard-design-or-how-to-make-data-look-pretty)
- [Fintech Design Breakdown - Phenomenon Studio](https://phenomenonstudio.com/article/fintech-design-breakdown-the-most-common-design-patterns/)
- [Fintech UX Best Practices 2026 - Code Theorem](https://codetheorem.co/blogs/fintech-ux-design/)
