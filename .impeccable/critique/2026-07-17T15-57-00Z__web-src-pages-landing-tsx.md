---
target: web/src/pages/Landing.tsx
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-07-17T15-57-00Z
slug: web-src-pages-landing-tsx
---
# Critique — `web/src/pages/Landing.tsx`

Method: dual-agent (A: a051e0665c7fa72f3 · B: ae57e598ec5a3664b)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Session-aware CTA swap is good; no scroll progress, no section-active state, no current-location cue |
| 2 | Match Between System and Real World | 2 | Vocabulary is generic productivity-speak ("Capture / Organize / Build") rather than the "private archive / second brain / library" mental model PRODUCT.md demands |
| 3 | User Control and Freedom | 2 | WebGL mouse-warp has no `prefers-reduced-motion` opt-out; no mobile menu; no skip-to-content |
| 4 | Consistency and Standards | 2 | Navbar session CTA uses `border-[#2A2A2A]` instead of system `border-subtle`; two `rounded-[32px]` "deliberate exceptions" on one page; pill menu `shadow-lg` (layered-shadow tell) |
| 5 | Error Prevention | 2 | Footer "Privacy" / "Terms" are `<span>`s, not links. Looks like a link, isn't. |
| 6 | Recognition Rather Than Recall | 3 | Icon + label on every card; lifecycle visual is concrete |
| 7 | Flexibility and Efficiency of Use | 2 | Mobile has no nav (pill menu is `hidden lg:flex`); marquee pills aren't deep-links |
| 8 | Aesthetic and Minimalist Design | 2 | ~9 sections, ~70 elements, hero has 8 things competing at first paint. PRODUCT.md says five elements and air is more premium than twenty and a gradient. |
| 9 | Error Recovery | 3 | N/A for a Landing |
| 10 | Help and Documentation | 2 | Dead Privacy/Terms; no FAQ; marquee pills aren't deep-links; only path to learn more is Get Started |
| **Total** | | **23/40** | **Acceptable** |

## Anti-Patterns Verdict

**Does this look AI-generated?** Yes — first impression is "premium dark SaaS landing painted with a classical brush on top." First-order tells avoided (no gradient CTAs, no exclamation marks, dark neutral base, no fake testimonial counts). Second-order reflex hit hard: 9 sections in canonical 2023 second-brain template.

**Deterministic scan** (14 findings, exit 2):
- 1 `gradient-text` warning at line 87 → false positive (wordmark lockup, the one accepted gradient-text use)
- 12 `design-system-font-size` advisories → 8 are `text-[11px]` card body strings (lines 464, 475, 486, 497, 524, 538, 552, 566); 4 are `text-[8px]` "Coming Soon" pills (lines 519, 533, 547, 561)
- 1 `design-system-radius` advisory at `index.css:165` → false positive (scrollbar thumb is browser chrome)

**Visual overlays**: unavailable (no browser tool). LLM read of source carries the visual load.

**What the LLM caught that the detector didn't**:
- 7-section eyebrow + 2px-left-border repetition on lines 204, 226, 297, 398, 450, 507 (the "2023 SaaS tell" forbidden by DESIGN.md)
- `bg-radial-accent` indigo/purple glow on line 76, off-brand for the Greco-Roman register
- `accent-gold` `#C9A961` used zero times on the Landing
- Two `rounded-[32px]` "deliberate exceptions" on one page (lines 222, 625)
- Three glassmorphism tells (auth card, idea-card hover, CTA `bg-white/5 blur-[80px]` on line 627)
- "Coming Soon" `bg-white text-black` pill on lines 519, 533, 547, 561 — not in the system
- Footer Privacy / Terms `<span>`s on lines 665-666
- 30s marquee + WebGL shader have no `prefers-reduced-motion` opt-out
- Line 664: footer GitHub links to `https://github.com` root
- Line 80: `linear-gradient` grid overlay is the same family as the forbidden `repeating-linear-gradient` stripe

## Overall Impression

The page delivers "premium dark theme SaaS landing" rather than the archival / philosophical / Greco-Roman register PRODUCT.md and DESIGN.md call for. The dark base, Geist type, no-exclamation-marks copy, and wordmark gradient are correct; everything structural is the template the brand is trying to escape. The single biggest opportunity is cutting the page in half.

## What's Working

1. **Hero h1 + sub-paragraph** (lines 156-168). "Capture Every Idea Before It's Gone." lands the fear; supporting sentence is one declarative beat.
2. **Lifecycle dual-pipeline** (lines 221-293). Seed → Thinking → Building → Completed with parallel Dormant → Archived track.
3. **Session-aware navigation** (lines 102-115, 176-195). "Go to Dashboard" for returning visitors.

## Priority Issues

- **[P0] SaaS-template skeleton betrays the archival register.** Sections 5/8/9 should be deleted; 6+7 collapsed; "Get Started" → "Open the Archive" or "Begin"; "Coming Soon" badges dropped. → `$impeccable distill`
- **[P0] Marquee rows are anti-register and cognitive overload.** Delete both rows; air is the product. → `$impeccable quieter`
- **[P1] Indigo/purple radial on hero is off-brand.** Replace with single faint warm radial using `accent-gold` at very low alpha; delete `bg-radial-green-accent`. → `$impeccable colorize`
- **[P1] 7-section eyebrow + 2px-left-border pattern is forbidden.** Use gold on 2-3 sections only, drop the rest. → `$impeccable shape`
- **[P2] Gold accent is missing entirely.** One occurrence: 1px hairline under first section's eyebrow, or single `·` ornament. → `$impeccable colorize`

## Persona Red Flags

**Jordan the first-timer**: hero lands; features+marquee = 30+ "feature" pills, decision paralysis; "How It Works" = 3rd restatement of same pitch; "Coming Soon" cards = vaporware risk; "100% Private" = unsubstantiated security claim, trust erodes; testimonials = "— Beta User" attribution, final erosion.

**Riley the stress tester**: footer Privacy/Terms `<span>`s, not links; marquee+WebGL no `prefers-reduced-motion`; two `rounded-[32px]` exceptions; navbar border `border-[#2A2A2A]` ≠ system `border-subtle`; marquee pills use `font-mono` for non-mono-natural labels; footer GitHub → root; "Coming Soon" `bg-white text-black` not in system.

**Casey the mobile user**: no mobile menu (pill menu `hidden lg:flex`); WebGL renders on mobile (GPU cost); hero h1 60px on small viewports wraps 3-4 lines; lifecycle arrows `hidden sm:block` collapse on mobile; marquee full-width on mobile, no `prefers-reduced-motion`.

**Maya the developer** (project-specific): "Second Brain" = 100× heard; wants sync/export/API, gets none; "Secure Sync" is the only technical signal; footer GitHub bounces to explore.

**Sam the entrepreneur** (project-specific): hero confirms individual use; wants Collaboration/Sharing/Export — not present; "100% Private" is a hard wall for a founder thinking about co-founder sharing.

## Minor Observations

- Line 75: comment "Background Accent Radial Glows (Keep original glows)" — meta-comment that reads as "I copied this from somewhere." Remove.
- Line 86: logo `h-20` in `h-20` navbar fills entire vertical navbar; wordmark gradient next to it (line 87) says the same thing twice.
- Line 656: footer brand mark uses `Brain` icon; hero has no brand mark. Inconsistency.
- Line 627: third glassmorphism tell (after auth card + idea-card hover).
- Line 80: `linear-gradient` grid overlay is the same family as the forbidden `repeating-linear-gradient` stripe.

## Questions to Consider

1. What if the Landing had 4 sections, not 9? Hero → Lifecycle → single editorial moment (pull-quote or framed screenshot) → CTA.
2. What if the brand register is "rare book publisher" not "premium SaaS"? Penguin Classics colophon, NYRB masthead, library catalog.
3. What if AI is not on the Landing at all? Move to a separate `/roadmap` page.

## Run Notes

- target slug: `web-src-pages-landing-tsx`
- ignore list: none
- assessment independence: A and B ran as two isolated sub-agents
- CLI detector: ran successfully; 14 findings
- browser visibility: not attempted (no tool exposed)
- overlay injection: not attempted
- live-server: not started
- temp files: none created
