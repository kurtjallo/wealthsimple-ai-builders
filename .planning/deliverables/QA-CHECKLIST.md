# QA Checklist — KYC/AML Operations Orchestrator

**Version**: 1.0
**Created**: 2026-02-27
**Purpose**: Comprehensive quality assurance checklist for final demo readiness. Each item is specific and verifiable by someone who did not build the app.

---

## 1. Production Health

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 1.1 | `GET /api/health` returns 200 | JSON with `"status": "ok"` and `checks.server`, `checks.database`, `checks.gemini` all `"ok"` | [ ] |
| 1.2 | Landing page (`/`) loads under 3 seconds | Full paint in < 3s on broadband connection | [ ] |
| 1.3 | Dashboard (`/dashboard`) loads under 3 seconds | Full paint in < 3s, sidebar and header render | [ ] |
| 1.4 | No 500 errors on any page load | Visit `/`, `/dashboard`, `/dashboard/cases`, `/cases/new` — no 5xx responses in Network tab | [ ] |
| 1.5 | No console errors on any page | Open DevTools Console on each page — zero red errors (warnings acceptable) | [ ] |
| 1.6 | HTTPS valid on deployed URL | Green lock icon in browser, no mixed content warnings | [ ] |
| 1.7 | `npm run build` completes with zero errors | Exit code 0, no TypeScript or compilation errors | [ ] |

---

## 2. Landing Page

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 2.1 | Navbar renders | Logo, navigation links, and "Launch Dashboard" CTA visible | [ ] |
| 2.2 | Hero section renders | Headline, subheadline, CTA buttons visible | [ ] |
| 2.3 | Pipeline animation renders | Animated agent pipeline visualization in hero area | [ ] |
| 2.4 | Trust bar renders | Partner/compliance logos or trust indicators visible | [ ] |
| 2.5 | Features grid renders | Feature cards with icons and descriptions | [ ] |
| 2.6 | How It Works section renders | Step-by-step process explanation | [ ] |
| 2.7 | Stats section renders | Key metrics (e.g., "5 days to 3 minutes") | [ ] |
| 2.8 | Testimonials section renders | Testimonial cards visible | [ ] |
| 2.9 | CTA section renders | Call-to-action with button to dashboard | [ ] |
| 2.10 | Footer renders | Footer links and copyright | [ ] |
| 2.11 | Navigation to dashboard works | Clicking "Launch Dashboard" or equivalent navigates to `/dashboard` | [ ] |

---

## 3. Case Queue (`/dashboard/cases`)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 3.1 | 5 demo cases visible across all tabs | Total of 5 cases when summing In Progress + Ready for Review + Completed tabs | [ ] |
| 3.2 | Tab counts match | "In Progress" badge shows 1, "Ready for Review" shows 2, "Completed" shows 2 | [ ] |
| 3.3 | Completed tab: 1 approved case | Sarah Chen with "Approved" status badge (emerald/green) | [ ] |
| 3.4 | Completed tab: 1 escalated case | Viktor Petrov with "Escalated" status badge (purple) | [ ] |
| 3.5 | Review tab: 2 review cases | Amara Okafor and Maria Gonzalez-Rivera with "Ready for Review" status badge (amber) | [ ] |
| 3.6 | In Progress tab: 1 processing case | James Oduya with "Processing" status badge (blue) | [ ] |
| 3.7 | Risk badges display correct colors | Low=emerald/green, Medium=amber/yellow, High=orange, Critical=red | [ ] |
| 3.8 | Clicking a case row navigates to detail | Click Sarah Chen row -> navigates to `/dashboard/cases/{id}` | [ ] |
| 3.9 | Loading state shown while fetching | Spinner visible briefly before cases appear | [ ] |
| 3.10 | Default tab is "Ready for Review" | Page opens with "Ready for Review" tab active | [ ] |

---

## 4. Case Detail — Sarah Chen (Approved, Low Risk)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 4.1 | Applicant name in header | "Sarah Chen" displayed prominently | [ ] |
| 4.2 | Case status badge | "Approved" with emerald/green styling | [ ] |
| 4.3 | Risk score displayed | 12/100 (or close to 12) | [ ] |
| 4.4 | Risk level badge | "Low Risk" with emerald/green badge | [ ] |
| 4.5 | All 5 agents completed | Document Processor, Identity Verifier, Sanctions Screener, Risk Scorer, Case Narrator — all show "completed" (green) status | [ ] |
| 4.6 | Document results: passport | Passport document with confidence score displayed (expect > 0.85) | [ ] |
| 4.7 | Document results: utility bill | Utility bill document with confidence score displayed | [ ] |
| 4.8 | Identity verification: verified | Identity Verifier agent shows verified status, 0 discrepancies | [ ] |
| 4.9 | Sanctions screening: no matches | Sanctions Screener agent shows "no matches" or "clear" result | [ ] |
| 4.10 | Narrative text present | Multi-paragraph case narrative visible in the narrative card | [ ] |
| 4.11 | Narrative mentions low risk | Text references clean record, no sanctions hits, verified identity | [ ] |
| 4.12 | Decision displayed | "Approved" badge shown in Officer Decision section | [ ] |
| 4.13 | Decision justification present | Text justification visible below the decision badge | [ ] |
| 4.14 | Audit trail: complete lifecycle | Audit trail entries showing: case created -> agents started -> agents completed -> decision made | [ ] |
| 4.15 | "Back to Queue" button works | Clicking navigates back to `/dashboard/cases` | [ ] |

---

## 5. Case Detail — Viktor Petrov (Escalated, Critical Risk)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 5.1 | Applicant name in header | "Viktor Petrov" displayed prominently | [ ] |
| 5.2 | Case status badge | "Escalated" with purple styling | [ ] |
| 5.3 | Risk score displayed | 87/100 (or close to 87) | [ ] |
| 5.4 | Risk level badge | "Critical Risk" with red badge | [ ] |
| 5.5 | Sanctions match detected | Sanctions Screener shows OFAC SDN match | [ ] |
| 5.6 | Sanctions match confidence | ~94% similarity score displayed | [ ] |
| 5.7 | Sanctions match program | SDGT (Specially Designated Global Terrorist) program referenced | [ ] |
| 5.8 | Narrative warns about sanctions | Case narrative explicitly references sanctions match and recommends escalation | [ ] |
| 5.9 | Decision displayed | "Escalated" badge shown in Officer Decision section | [ ] |
| 5.10 | Decision justification mentions STR | Justification references STR (Suspicious Transaction Report) filing | [ ] |
| 5.11 | Audit trail shows escalation | Audit entries include escalation decision with officer justification | [ ] |
| 5.12 | Risk factors listed | Risk profile card shows sanctions-related risk factors | [ ] |

---

## 6. Case Detail — Amara Okafor (In Review, Medium Risk)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 6.1 | Applicant name in header | "Amara Okafor" displayed prominently | [ ] |
| 6.2 | Case status badge | "Ready for Review" with amber styling | [ ] |
| 6.3 | Risk score displayed | 45/100 (or close to 45) | [ ] |
| 6.4 | Risk level badge | "Medium Risk" with amber/yellow badge | [ ] |
| 6.5 | Low confidence on driver's license | Document Processor shows driver's license with confidence ~0.62 | [ ] |
| 6.6 | Identity discrepancy flagged | Identity Verifier flags a discrepancy (e.g., name mismatch or DOB issue) | [ ] |
| 6.7 | Decision section: empty/actionable | No existing decision — Approve/Deny/Escalate buttons visible | [ ] |
| 6.8 | Decision workflow card present | "Officer Decision" card with 3 action buttons visible | [ ] |
| 6.9 | Narrative mentions concerns | Case narrative references the low confidence and identity discrepancy | [ ] |

---

## 7. Case Detail — Maria Gonzalez-Rivera (In Review, High Risk)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 7.1 | Applicant name in header | "Maria Gonzalez-Rivera" displayed prominently | [ ] |
| 7.2 | Case status badge | "Ready for Review" with amber styling | [ ] |
| 7.3 | Risk score displayed | 68/100 (or close to 68) | [ ] |
| 7.4 | Risk level badge | "High Risk" with orange badge | [ ] |
| 7.5 | PEP match detected | Sanctions/PEP screening shows politically exposed person match (diplomat) | [ ] |
| 7.6 | Narrative mentions enhanced due diligence | Case narrative explicitly recommends enhanced due diligence (EDD) | [ ] |
| 7.7 | Decision section: empty/actionable | No existing decision — Approve/Deny/Escalate buttons visible | [ ] |
| 7.8 | Risk factors include PEP | Risk profile card lists PEP-related risk factor | [ ] |

---

## 8. Case Detail — James Oduya (Processing)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 8.1 | Applicant name in header | "James Oduya" displayed prominently | [ ] |
| 8.2 | Case status badge | "Processing" with blue styling | [ ] |
| 8.3 | No risk score yet | Risk score shows as null/empty/not available | [ ] |
| 8.4 | Mixed agent statuses | Some agents show "completed", some "running" (with timer), some "pending" | [ ] |
| 8.5 | No decision section | Decision workflow buttons not displayed for processing cases | [ ] |
| 8.6 | Pipeline visualization active | Agent pipeline view shows the processing state with active indicators | [ ] |

---

## 9. Agent Visualization

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 9.1 | Pending state visual | Agents in "pending" state show muted/gray styling | [ ] |
| 9.2 | Running state visual | Agents in "running" state show blue/active styling with pulse animation | [ ] |
| 9.3 | Completed state visual | Agents in "completed" state show green/success styling with checkmark | [ ] |
| 9.4 | Failed state visual | Agents in "failed" state show red/error styling (if applicable) | [ ] |
| 9.5 | Pipeline layout: fork/join | Document Processor at top, Identity Verifier and Sanctions Screener side-by-side in middle, Risk Scorer below, Case Narrator at bottom | [ ] |
| 9.6 | Connector lines between stages | Vertical and horizontal connector lines visible between pipeline stages | [ ] |
| 9.7 | Connector line color changes | Lines turn green as stages complete | [ ] |
| 9.8 | Confidence ring displays | Completed agents show circular confidence indicator with percentage | [ ] |
| 9.9 | Processing timer | Running agents show elapsed time counter | [ ] |
| 9.10 | Entrance animations | Agent cards animate in with staggered timing on page load | [ ] |

---

## 10. Decision Workflow

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 10.1 | Three decision buttons visible | "Approve" (green), "Deny" (red), "Escalate" (purple) buttons on review cases | [ ] |
| 10.2 | Clicking Approve opens dialog | Confirmation dialog appears with title "Approve This Case" | [ ] |
| 10.3 | Clicking Deny opens dialog | Confirmation dialog appears with title "Deny This Case" | [ ] |
| 10.4 | Clicking Escalate opens dialog | Confirmation dialog appears with title "Escalate This Case" | [ ] |
| 10.5 | Justification required | Submit button disabled until justification has >= 10 characters | [ ] |
| 10.6 | Character counter visible | Shows current count vs. 10 minimum characters | [ ] |
| 10.7 | "Meets minimum" indicator | Green checkmark appears once 10+ characters entered | [ ] |
| 10.8 | Submit updates case status | After confirming, case status changes (e.g., review -> approved) | [ ] |
| 10.9 | Decision recorded in audit trail | New audit entry appears with decision type, officer, and justification | [ ] |
| 10.10 | Decision buttons disappear after decision | Once decided, decision workflow card replaced by Officer Decision display | [ ] |
| 10.11 | Cancel button closes dialog | Clicking "Cancel" in dialog returns to decision card without submitting | [ ] |
| 10.12 | Only human officers can decide | No AI/agent actor can trigger decision — buttons require human interaction | [ ] |

---

## 11. Audit Trail

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 11.1 | Audit trail visible on decided cases | Sarah Chen and Viktor Petrov show populated audit trail | [ ] |
| 11.2 | Entries in chronological order | Oldest entries at top/bottom (consistent ordering) with timestamps | [ ] |
| 11.3 | Timestamp displayed per entry | Each audit entry shows formatted date/time | [ ] |
| 11.4 | Action label displayed | Each entry shows a human-readable action (e.g., "Agent Completed", "Case Approved") | [ ] |
| 11.5 | Actor type badge | Entries show "Agent", "Officer", or "System" badge per actor type | [ ] |
| 11.6 | Actor type icons | Bot icon for agents, User icon for officers, Monitor icon for system | [ ] |
| 11.7 | Confidence shown for agent actions | Agent action entries display confidence percentage badge | [ ] |
| 11.8 | Justification shown for decisions | Human decision entries show justification text | [ ] |
| 11.9 | Tab filtering works | "All Events", "Agent Actions", "Decisions", "System" tabs filter entries correctly | [ ] |
| 11.10 | Entry count badge | Total entry count displayed next to "Audit Trail" title | [ ] |
| 11.11 | CSV export button present | "Export CSV" button visible in audit trail header | [ ] |
| 11.12 | CSV export downloads file | Clicking "Export CSV" triggers file download with `.csv` extension | [ ] |
| 11.13 | FINTRAC compliance footer | Footer text mentions "FINTRAC/PCMLTFA compliant audit trail" and 5+ year retention | [ ] |

---

## 12. HITL (Human-in-the-Loop) Enforcement

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 12.1 | AI never makes final decisions | No agent run output contains a binding decision — all decisions require human action | [ ] |
| 12.2 | Decision API requires officer_id | `POST /api/cases/{id}/decide` rejects requests without `officer_id` | [ ] |
| 12.3 | Decision API requires justification | `POST /api/cases/{id}/decide` rejects requests without `justification` | [ ] |
| 12.4 | STR filing human-only | `POST /api/cases/{id}/str` endpoint requires human officer, rejects AI actors | [ ] |
| 12.5 | AI recommendations marked advisory | If AI recommendation shown, it is labeled "Advisory Only" (not binding) | [ ] |
| 12.6 | Compliance badges visible | FINTRAC compliance indicators present on relevant UI components | [ ] |

---

## 13. New Case Wizard (`/cases/new`)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 13.1 | Page loads | `/cases/new` renders without errors | [ ] |
| 13.2 | Step 1: Applicant info form | Name and email fields visible | [ ] |
| 13.3 | Step 2: Document upload | Drag-and-drop upload area visible | [ ] |
| 13.4 | Step 3: Processing | Pipeline visualization shown during processing | [ ] |
| 13.5 | Step 4: Completion | Success state shown after processing completes | [ ] |

---

## 14. Dashboard Overview (`/dashboard`)

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 14.1 | Page loads | Dashboard overview renders without errors | [ ] |
| 14.2 | Sidebar navigation | Sidebar shows "Overview" and "Case Queue" links | [ ] |
| 14.3 | Active route highlighted | Current page highlighted in sidebar navigation | [ ] |
| 14.4 | Header renders | Sticky header with logo, system status badge | [ ] |
| 14.5 | Navigation works | Clicking "Case Queue" in sidebar navigates to `/dashboard/cases` | [ ] |

---

## 15. UI Polish

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 15.1 | No broken layouts | All pages render without overlapping elements or broken grids | [ ] |
| 15.2 | Text readable | All text has sufficient contrast, no text clipping or overflow | [ ] |
| 15.3 | Loading states present | Spinner/skeleton shown while data fetches on case queue and case detail | [ ] |
| 15.4 | Empty states handled | Empty tabs show "No cases..." messages (not blank space) | [ ] |
| 15.5 | Consistent typography | Font sizes, weights, and spacing consistent across pages | [ ] |
| 15.6 | Badge colors consistent | Risk level, status, and decision badges use consistent color system from `constants.ts` | [ ] |
| 15.7 | Animations smooth | Framer Motion animations run at 60fps, no janky transitions | [ ] |
| 15.8 | Scrollbar styling | Custom scrollbar styles on scrollable areas (audit trail, etc.) | [ ] |
| 15.9 | Card hover states | Interactive cards show hover feedback | [ ] |
| 15.10 | Error states styled | Error messages use red/destructive styling, not unstyled text | [ ] |
| 15.11 | Icons consistent | Lucide React icons used consistently throughout (no mixed icon libraries) | [ ] |

---

## 16. API Endpoints Verification

All expected API routes exist and respond:

| # | Endpoint | Method | Expected Response | Pass |
|---|----------|--------|-------------------|------|
| 16.1 | `/api/health` | GET | 200 with status JSON | [ ] |
| 16.2 | `/api/cases` | GET | 200 with cases array | [ ] |
| 16.3 | `/api/cases/create` | POST | 201 with new case | [ ] |
| 16.4 | `/api/cases/{id}` | GET | 200 with case object | [ ] |
| 16.5 | `/api/cases/{id}/agent-runs` | GET | 200 with agent_runs array | [ ] |
| 16.6 | `/api/cases/{id}/decision` | POST | 200 with updated case | [ ] |
| 16.7 | `/api/cases/{id}/decide` | POST | 200 (HITL-enforced decision) | [ ] |
| 16.8 | `/api/cases/{id}/audit` | GET | 200 with audit_trail array | [ ] |
| 16.9 | `/api/cases/{id}/audit/export` | GET | 200 with CSV blob | [ ] |
| 16.10 | `/api/cases/{id}/str` | POST/GET | 200 (STR workflow) | [ ] |
| 16.11 | `/api/cases/{id}/process` | POST | 200 (trigger pipeline) | [ ] |
| 16.12 | `/api/cases/{id}/progress` | GET | SSE stream | [ ] |
| 16.13 | `/api/cases/{id}/stream` | GET | SSE stream | [ ] |
| 16.14 | `/api/cases/{id}/retry` | POST | 200 (retry failed) | [ ] |
| 16.15 | `/api/cases/{id}/risk` | POST | 200 with risk score | [ ] |
| 16.16 | `/api/cases/{id}/narrative` | POST | 200 with narrative | [ ] |
| 16.17 | `/api/cases/{id}/agents` | GET | 200 with agent statuses | [ ] |
| 16.18 | `/api/cases/{id}/documents/upload` | POST | 200/201 with document | [ ] |

---

## 17. Project Structure Verification

All expected source files exist:

| # | File/Directory | Purpose | Pass |
|---|----------------|---------|------|
| 17.1 | `src/app/page.tsx` | Landing page | [ ] |
| 17.2 | `src/app/dashboard/page.tsx` | Dashboard overview | [ ] |
| 17.3 | `src/app/dashboard/layout.tsx` | Dashboard layout shell | [ ] |
| 17.4 | `src/app/dashboard/cases/page.tsx` | Case queue | [ ] |
| 17.5 | `src/app/dashboard/cases/[id]/page.tsx` | Case detail | [ ] |
| 17.6 | `src/app/cases/new/page.tsx` | New case wizard | [ ] |
| 17.7 | `src/components/cases/` (8 files) | Case UI components | [ ] |
| 17.8 | `src/components/pipeline/` (6 files) | Pipeline visualization | [ ] |
| 17.9 | `src/components/audit/` (4 files) | Audit trail + compliance | [ ] |
| 17.10 | `src/components/layout/` (3 files) | Dashboard layout | [ ] |
| 17.11 | `src/components/landing/` (9 files) | Landing page sections | [ ] |
| 17.12 | `src/lib/agents/` | Agent implementations | [ ] |
| 17.13 | `src/lib/sanctions/` | Sanctions screening | [ ] |
| 17.14 | `src/lib/audit/` | Audit logging system | [ ] |
| 17.15 | `src/lib/pipeline/` | Case processing pipeline | [ ] |
| 17.16 | `src/types/` | TypeScript type definitions | [ ] |
| 17.17 | `supabase/migrations/` | Database migrations | [ ] |

---

## 18. Deliverables

| # | Check | Expected | Pass |
|---|-------|----------|------|
| 18.1 | Prototype URL accessible | Vercel deployment URL loads without errors | [ ] |
| 18.2 | Demo video recorded | 2-3 minute video showing full case lifecycle | [ ] |
| 18.3 | Demo video shows document upload | Video includes uploading documents for a new case | [ ] |
| 18.4 | Demo video shows agent processing | Video shows agents working in parallel with live visualization | [ ] |
| 18.5 | Demo video shows risk profile | Video shows synthesized risk assessment with evidence | [ ] |
| 18.6 | Demo video shows officer decision | Video shows compliance officer approving/escalating a case | [ ] |
| 18.7 | Demo video shows audit trail | Video shows audit trail with logged actions | [ ] |
| 18.8 | 500-word explanation complete | `.planning/deliverables/EXPLANATION.md` exists with >= 450 words | [ ] |
| 18.9 | Explanation covers: what human can do | Text describes officer's workflow and capabilities | [ ] |
| 18.10 | Explanation covers: what AI handles | Text describes agent responsibilities (OCR, screening, scoring, narrative) | [ ] |
| 18.11 | Explanation covers: where AI stops | Text describes HITL boundaries and FINTRAC compliance | [ ] |
| 18.12 | Explanation covers: what breaks at scale | Text discusses scaling limitations and production considerations | [ ] |

---

## Bug Log

| # | Date | Page/Component | Description | Severity | Status |
|---|------|----------------|-------------|----------|--------|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

**Severity levels**: P0 (blocker), P1 (critical), P2 (major), P3 (minor), P4 (cosmetic)

---

## Automated Check Results

### Build Status
- `npm run build`: **PASS** (compiled successfully in 3.4s, 0 errors)
- TypeScript: **PASS** (no type errors)
- Static pages generated: 14/14

### Route Verification
All 23 API routes confirmed present:
- `/api/health`
- `/api/cases` (list)
- `/api/cases/create`
- `/api/cases/process`
- `/api/cases/[id]` (detail)
- `/api/cases/[id]/agent-runs`
- `/api/cases/[id]/agents`
- `/api/cases/[id]/audit`
- `/api/cases/[id]/audit/export`
- `/api/cases/[id]/decide`
- `/api/cases/[id]/decision`
- `/api/cases/[id]/documents/upload`
- `/api/cases/[id]/narrative`
- `/api/cases/[id]/process`
- `/api/cases/[id]/progress`
- `/api/cases/[id]/retry`
- `/api/cases/[id]/risk`
- `/api/cases/[id]/str`
- `/api/cases/[id]/stream`
- `/api/documents/[id]`
- `/api/documents/process`
- `/api/documents/upload`
- `/api/agents/test`

### Page Route Verification
All 5 page routes confirmed present:
- `/` (landing page)
- `/dashboard` (overview)
- `/dashboard/cases` (case queue)
- `/dashboard/cases/[id]` (case detail)
- `/cases/new` (new case wizard)

### Component Verification
- Cases components: 8 files confirmed
- Pipeline components: 6 files confirmed
- Audit components: 4 files confirmed
- Layout components: 3 files confirmed
- Landing components: 9 files confirmed
- UI components: 14 files confirmed

---

## Sign-off

- [ ] **Developer QA**: All sections verified by developer
- [ ] **Visual QA**: All pages visually inspected at 1440px width
- [ ] **API QA**: All API endpoints return expected responses
- [ ] **Demo Path QA**: Full golden path (upload -> process -> review -> decide) works end to end
- [ ] **Audit QA**: Audit trail complete for all decided cases
- [ ] **Deliverables QA**: Video, explanation, and deployed URL ready for submission
- [ ] **Final Sign-off**: Ready for Wealthsimple AI Builders submission (March 2, 2026 deadline)
