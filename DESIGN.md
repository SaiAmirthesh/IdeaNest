---
version: alpha
name: IdeaNest — Archival Premium Dark
description: Dark editorial theme for a personal second-brain app. Near-black base, neutral grey ramp, restrained gold-leaf micro-accent. Classical proportion; calm motion.
colors:
  ink: "#030303"
  surface: "#0A0A0A"
  surface-raised: "#111111"
  surface-elevated: "#1A1A1A"
  border-subtle: "#262626"
  border-strong: "#525252"
  text-primary: "#F5F5F5"
  text-secondary: "#A3A3A3"
  text-muted: "#737373"
  text-disabled: "#525252"
  focus-ring: "#525252"
  accent-gold: "#C9A961"
  accent-gold-dim: "#8A7340"
  destructive: "#7F1D1D"
  destructive-foreground: "#FCA5A5"
  status-seed: "#A3E635"
  status-thinking: "#60A5FA"
  status-building: "#FBBF24"
  status-dormant: "#9CA3AF"
  status-completed: "#34D399"
  status-archived: "#71717A"
typography:
  display-xl:
    fontFamily: "Geist Variable"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  display-lg:
    fontFamily: "Geist Variable"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  display-md:
    fontFamily: "Geist Variable"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  heading-lg:
    fontFamily: "Geist Variable"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  heading-md:
    fontFamily: "Geist Variable"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  heading-sm:
    fontFamily: "Geist Variable"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: "Geist Variable"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "Geist Variable"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  label-lg:
    fontFamily: "Geist Variable"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  label-md:
    fontFamily: "Geist Variable"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.08em
    fontFeature: "ss01"
  micro:
    fontFamily: "Geist Mono"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.12em
  micro-tight:
    fontFamily: "Geist Mono"
    fontSize: 9px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.16em
rounded:
  none: 0
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  card: 16px
  surface: 24px
  pill: 9999px
spacing:
  px: 1px
  0.5: 2px
  1: 4px
  1.5: 6px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
  28: 112px
components:
  button-primary:
    backgroundColor: "{colors.text-primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: none
  button-primary-hover:
    backgroundColor: "#EAEAEA"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.text-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 10px 16px
    border: 1px solid {colors.border-subtle}
  button-outline-hover:
    backgroundColor: "{colors.surface-raised}"
    border: 1px solid {colors.border-strong}
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    border: 1px solid {colors.border-subtle}
    padding: 20px
  card-elevated:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    border: 1px solid {colors.border-subtle}
    padding: 24px
  card-hover:
    border: 1px solid {colors.border-strong}
    backgroundColor: "{colors.surface-raised}"
  input-default:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-muted}"
    border: 1px solid {colors.border-subtle}
    rounded: "{rounded.lg}"
    padding: 10px 14px
    typography: "{typography.body-md}"
  input-focus:
    border: 1px solid {colors.border-strong}
  badge-status:
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: 4px 8px
    border: 1px solid transparent
  eyebrow-label:
    typography: "{typography.micro-tight}"
    textColor: "{colors.text-secondary}"
    borderLeft: 2px solid {colors.border-strong}
    paddingLeft: 8px
  section-divider:
    borderTop: 1px solid {colors.border-subtle} at 20% opacity
---

# Design

## Overview

IdeaNest is a personal second-brain app treated as a **private library** rather than a productivity tool. The visual identity is **archival premium dark**: a near-black editorial canvas, a neutral grey ramp for typography and structure, a single restrained gold accent reserved for moments of importance, and a serif-of-geometry (Geist) type system with classical proportion. The feel is "leather notebook in a quiet study", not "modern SaaS dashboard". The register is brand-led (the Landing page sets the bar), but every product surface inside `/app` must hold the same restraint — no productivity-SaaS reflex inside the dashboard either.

The current implementation already uses these tokens in `web/src/index.css` (shadcn `radix-nova` style, neutral base, Geist). DESIGN.md is the source of truth going forward; the CSS variables should be re-checked against it during every audit pass.

## Colors

**Strategy: committed dark editorial.** The base is the brand — a near-black canvas at `#030303` is the surface, not a fallback. Neutrals form a tight 5-step grey ramp from `#0A0A0A` (raised surface) to `#737373` (muted text), with `#525252` as the border-strong / focus-ring midpoint. One accent, `accent-gold` (`#C9A961`), appears on ≤ 5% of any given surface — never as a CTA, never as a fill, almost always as a hairline or a single character.

**Semantic token names map 1:1 to the existing CSS variables** in `index.css`. When `index.css` is updated, update here first and propagate.

- **Ink** (`#030303`): the canvas. The body background. Never used as a foreground.
- **Surface** (`#0A0A0A`): the default card / panel surface. The single most-used background.
- **Surface raised** (`#111111`): inputs, secondary buttons, and one-step-elevated cards.
- **Surface elevated** (`#1A1A1A`): hover and selected states, the lifecycle stage cards on the Landing page.
- **Border subtle** (`#262626`): every default border. The single most-used line.
- **Border strong** (`#525252`): hover, focus, and active borders. Also the focus ring.
- **Text primary** (`#F5F5F5`): the default foreground. Headings, primary labels, primary icons.
- **Text secondary** (`#A3A3A3`): body copy on the Landing page, secondary labels.
- **Text muted** (`#737373`): the current "muted-foreground" — **the single biggest contrast risk in the codebase**. Body text on `#030303` at `#737373` is below WCAG AA. Every place it's used as body text must be either lifted to `#A3A3A3` or moved to a label role with a stronger color.
- **Text disabled** (`#525252`): disabled state, placeholder, never body.
- **Accent gold** (`#C9A961`) / **Accent gold dim** (`#8A7340`): editorial accent. Used as a 1px hairline under a section number, as a dot in a single "first" status badge, or as a max 2-character ornament. Never as a fill on a card or button.
- **Destructive** (`#7F1D1D` + foreground `#FCA5A5`): destructive actions only (delete, archive confirm). Never decorative.
- **Status colors** are kept as a per-lifecycle color but are **always paired with the label text** (`SEED`, `THINKING`, etc.) — the status must never be communicated by color alone.

**Anti-tells in the current palette to fix over time:**
- The `bg-radial-accent` indigo/purple radial on the dashboard is the only "color" in the system and reads as off-brand for a Greco-Roman register. Replace with a single faint warm-radial (very low alpha `#C9A961` over `#030303`) or remove.
- The "Knowledge Synapses" widget uses lime / amber / blue status colors purely decoratively. Move those to actual status indicators or remove.

## Typography

**Single family, three voices.** Geist Variable covers everything (sans + mono variant). The variation comes from **size, weight, and tracking**, not from font switches. Serifs and display faces are deliberately not used — Geist's geometric clarity keeps the editorial register without slipping into "magazine cosplay".

**The hierarchy follows a 1.25 modular scale from 9px to 72px** (micro → body-md → heading-sm → heading-md → heading-lg → display-md → display-lg → display-xl). The biggest jump is between `display-md` (36px) and `display-lg` (56px) so the hero headline reads as a single beat, not a paragraph.

**Display rules** (in addition to the global rules in `CLAUDE.md`):
- `display-xl` is reserved for the Landing hero h1 only. Nothing inside `/app` should ever use it.
- `display-lg` and `display-md` are the Landing page section headings.
- `heading-lg` is the page-title voice inside the dashboard (e.g. "Dashboard Overview", "Ideas Vault").
- `body-lg` is the Landing page body copy.
- `body-md` is the dashboard body copy and the form labels.
- `label-lg` is the button voice.
- `label-md` and `micro` carry the editorial cadence: section eyebrows, lifecycle badge labels, breadcrumb text, "Auto-saved to store" hints.
- `micro-tight` is the most-tracked, smallest voice — used for `STEP 01`, `+4.2% MoM`, ID labels. Treat as ornament, not as text.

**Letter-spacing floors:** display text never tighter than `-0.03em`; body text never looser than `0.08em`; the mono micro voices carry `0.08em` to `0.16em` and are the only places that feel "tracked".

**`text-wrap: balance`** is applied to every h1 and h2. **`text-wrap: pretty`** is applied to body copy on the Landing page.

## Layout

**One grid system: 8px scale with a 4px half-step.** All padding, margin, and gap values resolve to one of the tokens in the `spacing` table. The full range `2px` to `112px` is available; the most-used values are `16`, `20`, `24`, and `32`.

**Container widths:**
- **Landing page**: `max-w-7xl` (`1280px`) for the main content rail; section internals constrained to `max-w-4xl` for prose and `max-w-2xl` for hero subcopy.
- **Dashboard**: `max-w-7xl` for the main content area (already set in `DashboardLayout`); page content never exceeds 3 columns of cards.
- **Auth screen**: `max-w-[420px]` for the form card on the left, `max-w-[460px]` for the quote card on the right.

**Page-level rhythm:**
- Section vertical padding on the Landing page is `py-28` (112px top + 112px bottom). Hero section is `pt-12 pb-24` to compress the first beat.
- Dashboard page content uses `space-y-8` between major blocks and `space-y-6` between related blocks.
- Section dividers on the Landing page are a single `border-t` at 20% opacity of `border-subtle` — never a heavy `border-b` underneath a card.

**Responsive strategy:** single column on mobile (`<640px`), two columns on `md` (`≥768px`), three or four columns on `lg` (`≥1024px`). Grids use `repeat(auto-fit, minmax(280px, 1fr))` only when card content has no fixed minimum height; otherwise explicit `grid-cols-N` with breakpoints.

**Flexbox for 1D** (the auth card, the form row, the navbar, the breadcrumb). **Grid for 2D** (the Landing sections, the dashboard stats row, the idea card grid). Never both for the same component.

## Elevation & Depth

**Flat with hairline borders, not layered shadows.** The system uses **borders, not shadows**, for hierarchy. Every surface has a 1px `border-subtle` outline. Elevation changes the background tone (one step up the grey ramp) and the border color, never the shadow.

**The only shadow allowed in the system** is a `0 8px 24px rgba(0,0,0,0.4)` (or weaker) drop on:
- The auth screen's form card (line 142 of `Login.tsx`: `shadow-2xl`)
- The CTA card on the Landing page (line 625: `shadow-2xl`)

…and a single soft white-glow `0 0 30px rgba(255,255,255,0.02)` on the glass-card hover state. Anything else is a codex tell.

**The `glass-card` utility** (defined in `index.css` with `backdrop-filter: blur(16px)` and `rgba(10,10,10,0.75)` fill) is **the single deliberate glassmorphism moment in the system**. It belongs on the auth card surface and the idea card hover only. It is not a default surface treatment.

## Shapes

**Corner radius is restrained.** The system tops out at `24px` (`surface` token) for the CTA and lifecycle stage sections; cards sit at `16px` (`card` token); inputs and inner panels at `12px` (`lg`); buttons and small chips at `8px` (`md`). Pills are `9999px`. Anything above `24px` is a codex "over-rounded" tell.

**The `32px` radius on the Landing page CTA card and lifecycle section background** is the single deliberate exception — it is the moment of "this is the most important card on the page" and earns the larger radius by being the one place the radius can breathe. The `rounded-[32px]` is intentional, not a default.

**Sharp corners are also deliberate.** Section dividers, the breadcrumb separators, and the activity timeline bullet-line on the Idea Details page use sharp 0px corners. The mix of `rounded-md` cards and `rounded-none` dividers is the editorial signature — soft inside, sharp between.

## Components

**The current components, in order of importance to lock down:**

- **Buttons.** `button-primary` (white fill, dark text) is the single high-emphasis CTA. `button-outline` is the secondary voice. Hover state changes the fill tone one step; never the size, never the radius. Disabled state uses `text-disabled`. Three heights: `h-8` (chip), `h-9` (form row), `h-11` (page CTA).

- **Inputs.** `input-default` uses `surface-raised` background, `border-subtle` border, `text-muted` placeholder. On focus, the border steps to `border-strong` and the placeholder color is unchanged (focus must not erase the placeholder; it must intensify the border). Error state: border steps to `destructive` + 1 line of `destructive-foreground` text underneath. The current codebase uses `placeholder-[#737373]/80` and `placeholder-[#737373]` in places; these must hit contrast 4.5:1 against `surface-raised` (`#111111`) — `text-muted` (`#737373`) at 80% opacity does not.

- **Cards.** `card-surface` is the default. `card-elevated` is for the Landing page's lifecycle stage sub-cards. Hover states step to `card-hover`. Never both a 1px border and a soft drop shadow on the same card. The current dashboard cards use `shadow-lg shadow-white/5` plus a 1px `border-subtle` — drop the shadow, keep the border.

- **Status badges.** `badge-status` uses the lifecycle color as text + 20% background + 20% border, with a 6px status dot to the left of the label. The text label is the primary signal; the color is the secondary signal. Spacing: `px-2 py-0.5`, `micro` typography, `rounded-pill`. The current `IdeaStatusBadge` implementation is correct in structure but its `bg-opacity-40` is dead Tailwind v4 class — remove.

- **Eyebrow labels.** `eyebrow-label` is the cadence voice: a 2px gold `accent-gold` left border, a `micro-tight` text, a 4px inner padding. Reserved for section openings on the Landing page and major card titles inside the dashboard. Never used twice in a row on the same screen.

- **Section dividers.** `section-divider` is a single 1px `border-subtle` at 20% opacity, applied as a `border-t` between major Landing page sections. No accompanying shadow, no accompanying eyebrow above, no label inside.

- **Navbar / Sidebar / Layouts.** Fixed sidebar at `w-64` on the left of the dashboard; sticky top navbar at `h-16`. Both use `surface` background with `border-subtle` borders. The sidebar's active-state indicator is a 2px `border-strong` left border on the active item (already in `Sidebar.tsx`) — keep this; it's one of the few "side-stripe" cases where it works because it is a navigation indicator, not a card decoration.

- **The auth screen's left "Glass Quote Card"** (line 311 of `Login.tsx`) is the single moment glassmorphism earns its place in this system. The corner highlight hairlines (`w-8 h-px` + `w-px h-8` top-left gradient) are a deliberate classical "corner ornament" that should stay.

- **Marquee rows** (Landing page, lines 363-391) use the existing `marquee-ltr` / `marquee-rtl` animations at `30s linear infinite` with a `mask-image` gradient at the edges. They are the single motion element on the Landing page that uses auto-scrolling; everything else is entrance-only.

## Do's and Don'ts

**Do:**
- Use `surface` for the default card and `surface-raised` for inputs. The step-up is the elevation.
- Use `border-subtle` for the default border and `border-strong` for hover, focus, and active. The border is the focus ring.
- Treat the gold accent as a hairline, never a fill. One occurrence per surface, max two per page.
- Use Geist for everything; vary by weight and tracking, not by family.
- Apply `text-wrap: balance` to every h1 and h2. Apply `text-wrap: pretty` to long body copy.
- Cap body line length at 65-75ch on the Landing page prose. The current `max-w-2xl` setting on subcopy is correct.
- Run every interactive element through keyboard reachability. Visible focus state on every focusable.
- Run every status indicator through the "color + text + shape" triple (color is decorative; text and dot carry the meaning).
- Respect `prefers-reduced-motion`: every transition becomes an instant crossfade or no change at all.

**Don't:**
- Don't pair a 1px border with a soft drop shadow on the same element. Pick one. (Codex ghost-card tell.)
- Don't round any card, section, or input above `24px`. The Landing page CTA is the single exception.
- Don't use `bg-clip-text` with a gradient background on any text. Single solid colors only. (Codex gradient-text tell.)
- Don't use `repeating-linear-gradient` stripes as background decoration. (Codex tell.)
- Don't put a 2px colored left border on a card, callout, or list item for visual emphasis. The sidebar nav active state is the only acceptable case.
- Don't use the gold accent as a fill on a button, card, or chip. Hairline only.
- Don't use indigo, purple, or blue as accent colors anywhere in the system. The current `bg-radial-accent` is the one place they appear and it is on the watchlist to replace.
- Don't use a tracked uppercase eyebrow above every section. One named kicker as a deliberate system is voice; an eyebrow on every section is the 2023 SaaS tell. Use it on the Landing page section headings (4-5 of them) and nowhere else.
- Don't add a "01 / 02 / 03" numbered marker above every section. The Landing page's `Step 01` on the dashboard widget is the one acceptable use because it is a literal progression indicator inside a card, not a section scaffold.
- Don't use a multi-color gradient text on any heading, button, or label. The current `bg-gradient-to-r from-[#F5F5F5] to-[#737373] bg-clip-text` on the IdeaNest wordmark is the one acceptable use (logo lockup) — don't repeat the pattern elsewhere.
- Don't add a focus ring color different from `border-strong` (`#525252`). The neutral charcoal focus ring is the system.
- Don't animate layout properties (width, height, padding) on state change. Animate `transform`, `opacity`, `background-color`, `border-color`, and `color` only.
