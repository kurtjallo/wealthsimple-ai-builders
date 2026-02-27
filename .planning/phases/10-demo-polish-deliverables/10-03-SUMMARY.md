# Plan 10-03 Summary: Demo Video Script

## What was done
Created the complete demo video script at `.planning/deliverables/DEMO-SCRIPT.md` — a scene-by-scene, second-by-second guide for recording the 2-minute demo video with Screen Studio.

## Artifacts created
- `.planning/deliverables/DEMO-SCRIPT.md` — Full demo script with recording setup, pre-recording checklist, 5 scenes with narration and screen actions, timing summary, talking points checklist, contingency plan, and post-recording steps.

## Key details
- **Total duration**: ~2:20 (under 2:30 target)
- **Structure**: Intro (15s) + 3 case scenes (35s + 40s + 30s) + Outro (20s)
- **Three story arcs**:
  1. Sarah Chen — Clean case, low risk (12/100), approved. Shows the fast track: 5 agents in parallel, 95% OCR confidence, no sanctions matches, officer approved in seconds.
  2. Viktor Petrov — Sanctions catch, critical risk (87/100), escalated. Shows AI value: 94% OFAC SDN match, 11,000 entry database searched in seconds, AI recommends but human decides, STR filing is human-only per FINTRAC.
  3. Amara Okafor — Edge case, medium risk (45/100), awaiting review. Shows AI limits: 62% OCR confidence, name discrepancy flagged, AI defers to human instead of guessing.
- **AI vs human handoffs explicitly called out** at every decision point
- **Key talking points**: 11 specific messages mapped to scenes with a checklist for recording verification
- **Contingency section** covers: page load failure, missing demo data, long recording, narration stumbles, audio issues
- **Post-recording steps** include zoom effects on key moments and export verification

## Dependencies
- Requires Plan 10-01 (demo data seed) to be complete — the script references 5 seeded cases
- References production Vercel URL from Plan 10-02 (deploy)
