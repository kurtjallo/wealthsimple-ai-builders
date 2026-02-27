# Demo Video Script: KYC/AML Operations Orchestrator

## Recording Setup

**Tool**: Screen Studio (macOS)
**Resolution**: 1920x1080 (record at 2x on Retina, export at 1080p)
**Browser**: Chrome or Arc, zoomed to 110% for readability
**Settings**:
- Screen Studio: Enable cursor highlighting, smooth cursor movement
- Hide browser bookmarks bar
- Close all other tabs
- Use the production Vercel URL (not localhost)
- Dark mode OFF (light theme for video clarity)
- Disable all notifications / Do Not Disturb mode ON

**Audio**: Record narration via Screen Studio built-in mic, or record separately and overlay. If recording separately, use a quiet room and speak slowly and clearly.

**Export**: MP4, 1080p, 30fps, high quality. Target file size under 100MB.

**Total duration target**: 2:00 - 2:30

---

## Pre-Recording Checklist

- [ ] Production Vercel URL loaded and working
- [ ] Demo data seeded (5 cases visible in queue) — run `npx tsx scripts/seed-demo-data.ts` if needed
- [ ] Browser zoomed to 110%, bookmarks bar hidden, single tab only
- [ ] Screen Studio recording area set to browser window
- [ ] Cursor highlighting enabled in Screen Studio
- [ ] All notifications silenced (macOS Do Not Disturb ON)
- [ ] Practice run completed at least once
- [ ] Read through the script out loud once for timing

---

## Script

### INTRO — The Problem (0:00 - 0:15)

**Screen**: Browser open to the case queue dashboard at `/dashboard/cases`, showing 5 cases with various statuses and risk badges.

**Actions**:
1. Start with the case queue already loaded. The viewer sees all 5 cases at a glance:
   - Sarah Chen — Approved, Low Risk (green)
   - Viktor Petrov — Escalated, Critical Risk (red)
   - Amara Okafor — In Review, Medium Risk (yellow)
   - Maria Gonzalez-Rivera — In Review, High Risk (orange)
   - James Oduya — Processing (spinner/blue)
2. Let the queue sit for 2-3 seconds so viewers can read the case list.

**Narration**:
> "KYC compliance is one of the most time-consuming processes in financial services. A single case can take a compliance officer four to five hours — reading documents, screening sanctions lists, cross-referencing identities, writing up a risk assessment. This system does it in under three minutes."

**Timing note**: Keep it brisk. This sets the stage — don't linger.

---

### SCENE 1 — Clean Case: The Fast Track (0:15 - 0:50)

**Screen**: Click into Case 1 — Sarah Chen.

**Actions**:
1. Click on Sarah Chen's row in the case queue.
2. The case detail page loads. Risk score **12/100** with a green "Low Risk" badge is prominent.
3. Slowly scroll down through the risk profile, agent results, and narrative.

**Narration** (as the page loads):
> "Let's start with a straightforward case. Sarah Chen — Canadian citizen, opening a personal investment account. The system processed her application by running five specialized agents in parallel."

**Actions** (continued):
4. Point the cursor toward the agent results section, showing all 5 agents with green "Completed" badges.
5. Briefly hover over the Document Processor result.

**Narration** (over agent results):
> "The Document Processor used Mistral OCR to extract her passport and utility bill — name, date of birth, address — all at 95% confidence. The Identity Verifier cross-referenced those fields and found zero discrepancies. The Sanctions Screener checked her against OFAC, UN, and PEP databases — no matches."

**Actions** (continued):
6. Scroll to the risk score and narrative section.

**Narration** (over risk profile and narrative):
> "The Risk Scorer aggregated all those signals into a composite score of 12 out of 100 — low risk. And the Case Narrator wrote up a plain-English assessment for the officer. She reviewed it, agreed, and approved — the whole thing took seconds."

**Actions** (continued):
7. Show the decision section: "Approved" badge with officer justification text visible.
8. Briefly show the audit trail — a few timestamped entries scrolling by.

**Transition**: Click the browser back button or the "Cases" breadcrumb to return to the case queue.

---

### SCENE 2 — Sanctions Catch: Where AI Shines (0:50 - 1:30)

**Screen**: Click into Case 2 — Viktor Petrov.

**Actions**:
1. Click on Viktor Petrov's row.
2. The case detail page loads. Risk score **87/100** with a red "Critical Risk" badge.
3. Let the score sit on screen for a beat — the red is visually striking.

**Narration** (as the page loads):
> "Now the interesting case. Viktor Petrov — the system flagged him immediately."

**Actions** (continued):
4. Scroll to the sanctions screening results. The OFAC SDN match is highlighted with match details visible.

**Narration** (over sanctions results):
> "The Sanctions Screener found a high-confidence match on the OFAC SDN list — a 94% name similarity score against a sanctioned individual in the SDGT program. That's the kind of match that would take a human analyst thirty minutes to find manually in a database of over eleven thousand entries. The system found it in seconds."

**Actions** (continued):
5. Scroll to the risk score breakdown showing sanctions as the primary risk driver.
6. Then scroll to the case narrative.

**Narration** (over narrative and decision):
> "The Risk Scorer pushed his score to 87 — critical. But here's what matters: the AI doesn't make the call. It surfaces the evidence, scores the risk, and recommends escalation. The compliance officer reviewed the match, confirmed it warranted enhanced due diligence, and escalated to senior compliance."

**Actions** (continued):
7. Show the decision section: "Escalated" badge with officer justification mentioning the OFAC match.
8. Scroll to the audit trail. Pause briefly on the escalation and STR-related entries.

**Narration** (over audit trail):
> "And if an STR needs to be filed, that's a human decision. FINTRAC regulations require it — AI can surface the evidence, but the filing authority belongs to a compliance officer. Every action is logged with timestamps, officer IDs, and justifications."

**Transition**: Click back to the case queue.

---

### SCENE 3 — Edge Case: Where AI Stops (1:30 - 2:00)

**Screen**: Click into Case 3 — Amara Okafor.

**Actions**:
1. Click on Amara Okafor's row.
2. The case detail page loads. Risk score **45/100** with a yellow "Medium Risk" badge.

**Narration** (as the page loads):
> "This is where the system shows it knows its own limits. Amara Okafor — her driver's license came through with poor image quality."

**Actions** (continued):
3. Scroll to the Document Processor results. The confidence score of **62%** stands out against the other agents' higher scores.
4. Move to the Identity Verifier results showing the name discrepancy flag.

**Narration** (over agent results):
> "OCR confidence dropped to 62% on the license. And there's a name discrepancy — 'Amara Okafor' on the license versus 'A. Okafor' on the utility bill. Probably just an abbreviation, but the system isn't sure."

**Actions** (continued):
5. Scroll to the case narrative.

**Narration** (over narrative):
> "No sanctions matches, identity is probably fine. But the AI isn't confident enough to recommend approval. Instead, it flags the case for manual review and suggests requesting a clearer copy of the license. That's the right behavior — when the AI isn't sure, it says so."

**Actions** (continued):
6. Scroll to the decision section. It's **empty** — no decision has been made. This case is waiting for a human.
7. Let the empty decision section sit on screen for a beat.

**Narration** (over empty decision):
> "No decision yet. This one's waiting for a compliance officer to review the evidence and make the call."

---

### OUTRO — The Value Proposition (2:00 - 2:20)

**Screen**: Return to the case queue showing all 5 cases.

**Actions**:
1. Click back to the case queue.
2. Let the full queue be visible — all 5 cases with their status badges.
3. Optionally, if Case 5 (James Oduya) shows a "Processing" state with agent indicators, hover briefly to show the live visualization.

**Narration**:
> "Five cases across the full risk spectrum. The AI orchestrator handles the cognitive drudgery — document processing, sanctions screening, risk scoring — in minutes instead of hours. The compliance officer reviews synthesized risk profiles with linked evidence, makes the judgment calls that regulations require, and moves on to the next case. AI handles the analysis. Humans make the decisions."

**Actions** (continued):
4. Let the case queue sit on screen for 3 seconds. No mouse movement.
5. Recording ends.

---

## Timing Summary

| Scene | Duration | Running Total |
|-------|----------|---------------|
| Intro — The Problem | 15s | 0:15 |
| Scene 1 — Clean Case (Sarah Chen) | 35s | 0:50 |
| Scene 2 — Sanctions Catch (Viktor Petrov) | 40s | 1:30 |
| Scene 3 — Edge Case (Amara Okafor) | 30s | 2:00 |
| Outro — The Value Proposition | 20s | 2:20 |
| **Total** | **~2:20** | |

---

## Key Talking Points Checklist

Use this to verify all critical messages land during recording:

- [ ] "Four to five hours... under three minutes" (intro)
- [ ] "Five specialized agents running in parallel" (scene 1)
- [ ] "95% confidence" on document extraction (scene 1)
- [ ] "94% name similarity on OFAC SDN" (scene 2)
- [ ] "Eleven thousand entries... found it in seconds" (scene 2)
- [ ] "AI doesn't make the call" (scene 2)
- [ ] "STR... that's a human decision. FINTRAC regulations require it" (scene 2)
- [ ] "62% OCR confidence" (scene 3)
- [ ] "When the AI isn't sure, it says so" (scene 3)
- [ ] "Waiting for a compliance officer to review" (scene 3)
- [ ] "AI handles the analysis. Humans make the decisions." (outro)

---

## If Something Goes Wrong

**Page doesn't load**: Switch to `http://localhost:3000` as backup. Have `npm run dev` running in a terminal before recording.

**Demo data missing**: Run `npx tsx scripts/seed-demo-data.ts` and refresh the browser. Wait 5 seconds for Supabase to sync.

**Risk scores look wrong**: The seed script is idempotent. Run it again with `npx tsx scripts/seed-demo-data.ts` to reset all data.

**Recording is running long**: Cut Scene 3 shorter. The sanctions catch (Scene 2) is the money shot — protect its full 40 seconds. Scene 3 can be compressed to 20 seconds by skipping the narrative scroll and going straight to the empty decision section.

**Narration stumble**: Screen Studio allows you to pause and resume recording. Pause, collect yourself, resume from the last clean sentence. You can trim the pause in post.

**Audio issues**: Record the video with no audio first. Then record the narration separately using Screen Studio's audio overlay feature, or use QuickTime audio recording and sync in post. The video stands on its own even with slightly rough audio.

---

## Post-Recording

1. Open the recording in Screen Studio
2. Trim dead air or false starts at the beginning and end
3. Add zoom effects on key moments if time allows:
   - Zoom on the **87/100 critical risk score** when it first appears (Scene 2)
   - Zoom on the **OFAC SDN match details** — 94% similarity score (Scene 2)
   - Zoom on the **empty decision section** in Scene 3 (the "AI stops here" moment)
4. Verify total duration is between 2:00 and 2:30
5. Export as MP4, 1080p, 30fps
6. Watch the final export once end-to-end to verify:
   - Audio is clear and synced
   - Text on screen is readable at 1080p
   - No notification pop-ups or personal info visible
   - Transitions between scenes feel natural
7. File size should be under 100MB
