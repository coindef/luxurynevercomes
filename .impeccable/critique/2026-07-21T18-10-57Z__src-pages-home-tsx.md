---
target: the front page
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-21T18-10-57Z
slug: src-pages-home-tsx
---
Method: dual-agent (A: design-review sub-agent · B: detector sub-agent)

# Front Page Critique — LuxuryNeverComes (src/pages/Home.tsx)

## Design Health Score: 27/40 (Acceptable, near Good)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Countdown promises a window nothing enforces |
| 2 | Match System / Real World | 2 | Nav dialect (Reserve/Butler/Ledger) opaque to first-timers |
| 3 | User Control and Freedom | 2 | Welcome modal had no Esc/backdrop/decline (fixed this run) |
| 4 | Consistency and Standards | 3 | Didone $ read as "S" on all card prices (fixed this run) |
| 5 | Error Prevention | 3 | Gift links/empty search handled |
| 6 | Recognition Rather Than Recall | 3 | Sections self-label; desktop nav demands decoding |
| 7 | Flexibility and Efficiency | 3 | Search/currency/arrow keys; ritual unskippable (fixed) |
| 8 | Aesthetic and Minimalist Design | 3 | Per-section restraint high; page-level volume not (fixed) |
| 9 | Error Recovery | 3 | WebGL failure silent removal; no tombstone (fixed) |
| 10 | Help and Documentation | 2 | Conceit explained only by dismissible modal |
| **Total** | | **27/40** | |

## Anti-Patterns Verdict
LLM assessment: passes — no 2026 tells; residual AI scent lives in data (product-name template "X · Y" at grid scale) and diffusion artifacts, not layout. Deterministic scan: clean — 0 findings across 46 rules on 7 files; ~88 grep hits all sanctioned exceptions (black-card hex, hero photo-overlay whites, house type scale). No browser overlay (no mutation tool exposed to sub-agent; static evidence used).

## Priority Issues (status after same-run fixes)
- [P1] Same six pieces shown twice (3D gallery + Salon grid) + three identical grids in the tail — FIXED: sections merged ("Today's Salon" = the room + a six-card strip that is also the touch label rail and WebGL tombstone); featured preview 12→8; personalization strips exclude featured; page 7,338→6,716px.
- [P1] Didone $ renders as "S" at card sizes — FIXED: PriceDigits @font-face (unicode-range digits/comma/period only); currency symbols fall to sans.
- [P2] Welcome modal was a cage — FIXED: Esc, backdrop click, and "Slip in without the card".
- [P2] Hero had no browse CTA — FIXED: "Enter the collection ›" quiet-link under search.
- [P3] Mobile Kept badge floated over captions — FIXED: docked solid above TabBar, flush right.
- Also: "rehung at midnight" joke deduplicated (salon owns it); "Book the atelier" label/destination mismatch reworded; ~350px dead white before footer removed.

## Persona Red Flags (residual)
- Jordan: nav dialect still needs one decoding pass; conceit explainer lives only in the modal.
- Casey: 9px caption floor on mobile; three.js load event mid-scroll (by design, lazy).
- Riley: countdown fiction never winks; product-name template visible at grid scale; occasional diffusion artifacts in catalog imagery (calf-in-tote class).

## Minor Observations
Product naming template at scale; atelier break photo (grimy fingertips, only warm image); sticky-nav translucency smudge over gallery; gallery texture load has no per-painting gate; three urgency devices stack in two viewports; countdown digits in price font dilute "Didone = money".

## Questions
1. Where is the green ¥0.00, display-size, on the front page? The punchline never appears at scale on the page that sells the joke.
2. Is the black card worth its toll at the door, or should it arrive after the first scroll as a reward?
3. Should product naming grammar vary by house, so the data reads as curated rather than generated?
