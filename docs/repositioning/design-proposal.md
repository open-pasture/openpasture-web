# openpasture website design, as shipped

Updated 2026-09-15. This describes the design deployed to openpasture.dev on
2026-09-15 (rebuild commit `7212a56`; tidied 2026-09-15) and is the
reference for future edits. Every factual claim on
the site still has to pass the evidence rules in `AGENTS.md`. The stylesheet
is `assets/op.css`; where this document and the stylesheet disagree, fix one
of them.

## Concept

openpasture is one person building a hardware and software tool with a
mission-scale goal. The site is the place that build is documented. It reads
like a well-kept engineering notebook made public: dark, warm, exact, and
unhurried, with drawings and a dated status list doing the work that cards and
badges usually pretend to do. Copy is one or two sentences per section; the
figures carry the argument.

Three references and what each contributed. SpaceX: a dark canvas, titles that
stand alone, telemetry as the only ornament. Firecrawl: a single warm orange,
monospace reserved for facts, plain technical confidence. Omarchy: a named
creator with a point of view and the invitation to participate placed early.

## Rules

These come from Theo Browne's public critiques of AI-generated interfaces and
the catalogues of "AI slop" tells that grew out of them. The shipped site
breaks none of them.

- No eyebrow labels, kickers, or all-caps mono section markers. A section gets
  a heading written as a sentence, or nothing.
- No subtitle under a heading. The hero is a headline, two links, and the
  status list. Explanation happens in body copy further down.
- No badges, pills, or chips. If something is a concept, say so in a sentence.
- No numbered sequences. The roadmap is a rail with the current stop in color
  and the word "now" beneath it.
- No hero followed by three matching cards. One drawing per section, one
  concept frame, prose everywhere else.
- No cream background, no serif, no sage.
- No gradients, no glow, no blurred or colored shadows, no radial vignettes;
  the one box-shadow in the stylesheet is the zero-blur offset that draws the
  section ornament's second pixel.
- No arrow glyphs on links or buttons. No icon-in-a-square. No emoji.
- No medium-grey body text on dark. Body text is near-white; `--fg2` is
  never used for reading copy. Its uses are listed in the Color table.
- No stat rows, logo clouds, testimonials, or fake numbers. The concept frame
  is the only place invented values appear, and its caption says so.
- No animation except what communicates state or arrival. Reduced motion
  disables all of it.
- Content is complete without JavaScript. No layout shift after load.

## Color

Eight color tokens and one hover tint, defined in `:root` in `assets/op.css`.
One warm dark canvas throughout, no alternating light bands.

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#0E0D0B` | Canvas. Warm near-black. Also the text color on the blaze button. |
| `--soot` | `#15130F` | One step up from the canvas: the concept frame. |
| `--fg` | `#F0EBE0` | All reading text. Warm white. The current roadmap label. |
| `--fg2` | `#B5AD9F` | Dates, secondary lines, footer links, figure captions, figure labels, later roadmap labels, placeholder text, idle header nav links, the hero's secondary link, status-list values, the notes source word, and the form's idle output line. |
| `--line` | `#2A2620` | Hairlines, frame borders, input borders, terrain lines, the pixel-grid field behind the hero. |
| `--blaze` | `#FF6A2B` | The one accent: the button, the current roadmap stop and its "now", the proposed boundary, the single colored pixel in the mark, focus rings, text selection. |
| `--blaze2` | `#FF7F4D` | The button while hovered. Nothing else. |
| `--live` | `#8FD14F` | The active boundary and animal positions in every drawing. Also the "public, AGPL-3.0" row of the status list and the form's success line. |
| `--red` | `#E5484D` | Hold in the concept frame and the form's error line. |

Contrast: `--fg` on `--bg` is above 15:1. `--fg2` on `--bg` is above 8:1.
`--blaze` and `--bg` are about 6.8:1 in either direction, so the blaze
button's dark text and blaze text on the canvas both clear AA.

Blaze survives from the earlier site. It is the color of ear tags and safety
vests, and it nods to Firecrawl without copying it.

Two deliberate exceptions. The caption under each figure is `--fg2`, not
`--fg`, because it is a caption and the drawing above it is the content.
`--live` marks the status list's "public, AGPL-3.0" row as the one item that
exists today; apart from the form's success message, that is its only use
outside the drawings.

## Type

Barlow for everything read: 400 for body, 500 for headings, bold, the brand,
and the button. IBM Plex Mono at 400 for dates, times, the status list, the
countdown, and figure labels. Both are self-hosted as latin-subset
woff2 files in `assets/fonts/` and declared with `font-display: swap`; all
three files are preloaded from `layouts/base.html`. Nothing else is loaded.

Body is 18px at line-height 1.5. The home headline is `clamp(3rem, 8vw, 7rem)`
at line-height 0.95, capped at 12 characters per line. Inner page titles are
`clamp(2.5rem, 5.5vw, 4.5rem)` at line-height 1. Section headings are
`clamp(1.75rem, 3.2vw, 2.75rem)` and never exceed 24 characters per line; note
entry titles are the exception described under Notes list below.
Prose measure is 62 characters; leads and captions are 56.

## Layout

One container at 1200px. Sections are separated by a single hairline in
`--line` and generous vertical space, `clamp(4rem, 9vw, 8rem)`. Most sections
use a 5/7 split: heading left, content right. The hero uses 6/6. Nothing is
centered. Radius is zero everywhere. Under 900px every grid collapses to one
column and the header nav wraps onto its own row. Under 600px the five wide
drawings keep a 640px minimum width and scroll sideways inside a `.scroll`
wrapper, so their labels stay at reading size, and the hero map's labels scale
up to 24 user units. Header and footer links carry vertical padding for a
tap area of at least 36px.

## Components

**Mark.** The `OP` monogram on a 5x5 pixel grid with one blaze cell, at 22px
in the header, at 40px as the footer sign-off, as the favicon, and in the
corner of the share image. The header and footer both include
`partials/mark.html`. The pattern lives in four places that must be kept
identical: `assets/favicon.svg`, `partials/mark.html`, `scripts/og-source.svg`
(rendered to `assets/og.png`), and the rows array in
`scripts/render-images.js`, which draws the PNG favicons and the Apple touch
icon. It is the pixel thread through the site: a two-pixel
ornament (`--fg2`, a gap, `--blaze`) sits at the top-left of every section
rule, a faint pixel-grid field in `--line` sits behind the hero's right half,
and every drawing uses square animal markers with crisp edges.

**Status list.** Mono, dotted leaders, a date on top, one line per milestone.
It appears in the hero and on the collar page. Present-tense progress claims
are dated: this list, dated by `SITE.statusDate` and `SITE.statusDateIso` in
`build.js`, and the dated entries on `/notes`. Copy elsewhere may restate them
only in the same terms and must be revisited when the list changes. The rows
are `partials/status.html`.

**Map drawing.** `partials/map.html`, an SVG, not a screenshot. Three contour
lines in `--line`, the active boundary in `--live` with a faint fill, the
proposed boundary in dashed `--blaze`, square animal markers in `--live`, and
two small mono captions. It is the hero image until a real photograph exists.

**Concept frame.** One bordered panel on `--soot` showing the farmer's screen
as prose and a small map: a status sentence, the countdown in mono, three plain
outlined buttons (Hold in `--red`, Preset, Redraw), a hairline, and one request
for the farmer. The caption beside it says the values are made up.

**Figures.** Five SVG partials, each drawn in the site colors with mono
labels (except `fig-rail`, whose stop names are Barlow so they read as
headings; only its "now" is mono), each stating nothing measured, each
followed by a single caption in `--fg2`:

- `fig-netting`: moving electric netting by hand versus drawing a boundary on
  a phone. Home and About.
- `fig-collar`: the collar as replaceable parts. Home and Collar.
- `fig-system`: inputs, the intelligence layer, your model, the boundary app,
  the collars. Home and Project.
- `fig-rotation`: graze, next, and resting paddocks with recovery bars.
  Project only.
- `fig-rail`: the roadmap as a rail. The current stop is a filled `--blaze`
  circle with its label in `--fg` and "now" in mono blaze beneath; later stops
  are outlined and labeled in `--fg2`. Milestones, not dates. Home and
  Project. Its caption on both pages names the stops in words, so the rail's
  small labels are never the only copy of them.

Every paint in the figures, the map drawing, and the concept frame is a `k-`
class in `assets/op.css` bound to one of the tokens above: `k-line`, `k-fg`,
`k-fg2`, `k-blaze`, `k-live`, `k-bg`, with a `-stroke` or `-fill` suffix for a
token's other role. The SVG carries no hex literals, so a palette change
reaches the drawings. `scripts/og-source.svg` paints with `var()` for the same
reason; `scripts/render-images.js` inlines it with the `:root` block, so the
share image takes the palette from `op.css` too. Hex values are repeated in
three places only, because none can read a stylesheet: `assets/favicon.svg`,
the `theme-color` meta in `layouts/base.html`, and the pixel-grid data URI on
`.hero .px` in `op.css`. Each carries a comment naming the token it mirrors.

**Notes list.** Date in mono, title, and the source as a plain word. No chips.
Notes are one page, `/notes`, with dated anchors; there are no per-note routes.
On `/notes` each entry is a section of its own: a mono dateline in the left
column, and on the right an `h2.entry` title at 1.25rem with a 56-character
measure followed by a lead paragraph. Entry titles are the one h2 that is not
a section heading.

**Form.** On `/involved`: name, email, message, one blaze button, and a mono
output line that turns `--live` on success and `--red` on error. It posts to
`/api/contact`. Without JavaScript the same form posts as HTML and comes back
to `/involved#sent` or `/involved#failed`, which reveals the matching line in
the same colors. A `mailto:` link sits beneath it as the fallback.

## Pages

```
/            Home. The argument, top to bottom.
/project     How the pieces fit (fig-system); approve first, automate later
             (fig-rotation); the roadmap rail; the research farm in
             conditional language; the software that exists today.
/collar      Status list; parts you can replace (fig-collar); what is not
             decided; the dog as the first test; an invitation to hardware
             engineers.
/notes       Dated entries on one page, newest first.
/about       Mission, why, how it started (fig-netting), who, what this is not.
/involved    Help build (the form), follow, support. Support is text only until
             a real destination exists.
/docs        The agent kit: what it is, source and docs links, and where the
             README quickstart is.
/pricing     Nothing is for sale yet: what is free today, what may come later.
/privacy /terms /404   Plain pages.
```

Header: mark and wordmark, four links (Project, Collar, Notes, About), one
blaze button reading "Get involved". Footer: the mark at 40px, then plain
links in two groups, the site pages plus GitHub on the left and Pricing,
Privacy, Terms on the right, wrapping to stacked rows on narrow screens. There
is no sign-in or "get started"; `app.openpasture.dev`
does not resolve.

Redirects live in the `REDIRECTS` map in `server.js`: `/manifesto` and
`/mission` to `/about`; `/landing` to `/`; `/roadmap`, `/agent-kit`, `/cloud`,
`/integrations`, and `/open-source` to `/project`; `/contact` to `/involved`.

## Home, top to bottom

One line of argument: the problem, first the collar, then the software, you
stay in control, ownership, where it stands, who is building it.

- Hero. "Farm like you're in the future." Two underlined links (Follow the
  build, Explore the project), the status list, and the map drawing on the
  right over the pixel-grid field.
- "Moving animals is the hard part." `fig-netting` and a caption.
- "So, first: a collar you own." `fig-collar` and a caption linking to
  `/collar`.
- "Then, software that plans the move." `fig-system` and a caption linking to
  `/project`.
- "You stay in control." The caption with the honesty sentence on the left,
  the concept frame on the right.
- "Yours to repair, run, and build on." One lead paragraph.
- "Where it stands." `fig-rail`, then the notes list.
- "Who is building it." One lead sentence with the link to `/involved`.
- Footer.

## Motion

All CSS, all inside `@media (prefers-reduced-motion: no-preference)`, so
reduced motion turns every bit of it off.

- The mark's pixels fill in on load, row by row.
- Hero elements rise in sequence: headline, links, status list, map.
- Status rows rise in sequence.
- The proposed boundary's dashes march slowly, in the map and in the concept
  frame.
- Animal pixels blink out of phase.
- The two loops above pause while their drawing is off screen.
  `assets/site.js` toggles a `paused` class from an IntersectionObserver;
  the stylesheet maps it to `animation-play-state: paused`.
- Section content fades up once as it scrolls into view. `assets/site.js`
  adds the `reveal` class and an IntersectionObserver flips it to `in`; a
  1.5-second timer adds `in` to everything so nothing stays hidden if the
  observer never fires. The script skips this under reduced motion, and the
  content is visible without the script.
- Links and the button transition color over 150ms.

## Tokens for implementation

```css
:root {
  --bg: #0E0D0B; --soot: #15130F; --fg: #F0EBE0; --fg2: #B5AD9F; --line: #2A2620;
  --blaze: #FF6A2B; --blaze2: #FF7F4D; --live: #8FD14F; --red: #E5484D;
  --sans: 'Barlow', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --w: 1200px; --gx: clamp(1.25rem, 4vw, 4rem); --gap: clamp(2rem, 5vw, 5rem);
}
```

## Not decided here

Photographs. Profile URLs, the contact inbox, and any support destination.
Collar license wording. See the unresolved-inputs table in
[README.md](README.md). The build pipeline is `build.js`, a stylesheet, and
partials; no framework.
