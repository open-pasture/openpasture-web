# Open Pasture website design proposal

Revised 2026-09-14. A proposal for the next build pass, not an approved system.
Every factual claim on the site still has to pass the evidence rules in
`AGENTS.md`. The rendered concept is `preview/moodboard.html`.

## Concept

Open Pasture is one person building a hardware and software tool with a
mission-scale goal. The site is the place that build is documented. It should
read like a well-kept engineering notebook made public: dark, exact, unhurried,
with one product drawing and a dated status list doing the work that cards and
badges usually pretend to do.

Three references and what each contributes. SpaceX: a black canvas, titles that
stand alone, telemetry and countdowns as the only ornament. Firecrawl: a single
warm orange, monospace reserved for facts, plain technical confidence. Omarchy: a
named creator with a point of view, real screenshots over abstractions, and the
invitation to participate placed early.

## Rules

These come from Theo Browne's public critiques of AI-generated interfaces and the
catalogues of "AI slop" tells that grew out of them. The first version of this
proposal broke most of them. The rebuilt concept breaks none.

- No eyebrow labels, kickers, or all-caps mono section markers. A section gets a
  heading written as a sentence, or nothing.
- No subtitle under a heading. The hero is a headline, two links, and the status
  list. Explanation happens in body copy further down.
- No badges, pills, or chips. If something is a concept, say so in a sentence.
- No numbered sequences. The roadmap is an ordered list without numerals, with
  the current item in full color and the word "now" beside it.
- No hero followed by three matching cards. One product drawing in the hero,
  one concept frame later, prose everywhere else.
- No cream background, no serif, no sage. The current "tasteful default" is as
  recognizable as purple gradients were a year ago.
- No gradients, no glow, no colored box shadows, no radial vignettes.
- No arrow glyphs on links or buttons. No icon-in-a-square. No emoji.
- No medium-grey body text on dark. Body text is near-white. Grey is for dates
  and secondary lines only.
- No stat rows, logo clouds, testimonials, or fake numbers. The concept frame is
  the only place invented values appear, and it says so.
- No animation except what communicates state. Reduced motion disables all of it.
- Content is complete without JavaScript. No layout shift after load.

## Color

Six tokens. Dark canvas throughout, no alternating light bands.

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#0B0B0C` | Canvas. Neutral black, not blue-black. |
| `--fg` | `#EEEBE4` | All reading text. Warm white. |
| `--fg2` | `#B8B3A8` | Dates, secondary lines, footer links. |
| `--line` | `#26262A` | Hairlines, frame borders, terrain lines. |
| `--blaze` | `#FF6A2B` | One button per page, the current roadmap item, the proposed boundary. |
| `--live` | `#8FD14F` | The active boundary and animal positions. Nothing else. |
| `--red` | `#E5484D` | Hold and cancel. |

Contrast: fg on bg is above 15:1. fg2 on bg is above 8:1. Blaze on bg is 6:1.
Black text on blaze is 9:1.

Blaze survives from the current site. It is the color of ear tags and safety
vests, and it nods to Firecrawl without copying it. Pink, camo, scanlines, and
the pixel display face are retired.

## Type

Barlow for everything read, at 400 for body and 500 for headings. It is a
DIN-derived industrial grotesk with a stated reason: it is the family SpaceX's
signage face belongs to, it has real weight at display size, and it is free
under the SIL Open Font License. IBM Plex Mono, already vendored in the repo,
for dates, times, and the status list. Nothing else.

Body is 18px at line-height 1.5. Headline is `clamp(3rem, 8vw, 7rem)` at
line-height 0.95. Section headings are `clamp(1.75rem, 3.2vw, 2.75rem)` and
never exceed 24 characters per line. Prose measure is 62 characters.

## Layout

One container at 1200px. Sections are separated by a single hairline and
generous vertical space, `clamp(4rem, 9vw, 8rem)`. Most sections use a 5/7
split: heading left, content right. The hero and the two-pieces section use
6/6. Nothing is centered. Radius is zero everywhere.

## Components

**Status list.** Mono, dotted leaders, a date on top, one line per milestone.
It appears in the hero and on the collar page, and it is the only place
present-tense claims live. It replaces `partials/ledger.html`.

**Map drawing.** An SVG, not a screenshot. Three contour lines in `--line`, the
active boundary in `--live` with a faint fill, the proposed boundary in dashed
`--blaze`, animal dots in `--live`, and two small mono captions. It is the hero
image until a real photograph exists.

**Concept frame.** One bordered panel showing the farmer's screen as prose and
a small map: a status sentence, the countdown in mono, three plain buttons
(Hold in red, Preset, Redraw), a hairline, and one request for the farmer. The
adjoining copy states in a sentence that the values are made up.

**Roadmap list.** Hairline rows, no numerals. Current item in `--fg` with "now"
in `--blaze`. Everything else in `--fg2`.

**Notes list.** Date in mono, title, and the source as a plain word. No chips.

**Mark.** The `OP` monogram on a 5x5 pixel grid with one blaze cell, at 22px in
the header and as the favicon. The only pixel that survives.

## Pages

```
/            Home. The concept page, top to bottom.
/project     The intelligence layer, how the pieces relate, the roadmap list,
             research farm in conditional language, verified software links.
/collar      Full status list, design goals, intended freedoms without license
             claims, a plain list of what is not decided, and an invitation
             to hardware engineers.
/notes       Reverse-chronological list. Local articles at /notes/<slug>.
/about       Mission, origin story, founder background, what this is not.
/involved    Follow, help build, support. Support is text only until a real
             destination exists.
/docs /pricing /privacy /terms /404   Kept.
```

Redirects: `/mission` and `/manifesto` to `/about`. `/roadmap` to `/project`.
`/agent-kit`, `/cloud`, `/integrations`, `/open-source` to `/project` or
`/collar` after their verified content moves. `/contact` to `/involved`.

Header: mark and wordmark, four links, one blaze button reading "Get involved".
Sign in and Get started leave the header until the collar exists. Footer: two
rows of plain links.

## Home, top to bottom

1. Headline. Two underlined links. The status list. The map drawing on the right.
2. "It started with two sheep and a slope." Two paragraphs.
3. "The collar acts in the pasture. The intelligence layer decides what should
   happen." Two columns of prose with a bold lead-in each.
4. "Three questions the app should answer." Prose on the left, the concept frame
   on the right, with the honesty sentence in grey.
5. "What comes next, in order." The roadmap list.
6. "Ownership is the point." Two paragraphs including the mission.
7. "Notes from the build." Three rows.
8. "One person, so far." One paragraph with the contact and profile links.
9. Footer.

## Tokens for implementation

```css
:root {
  --bg: #0B0B0C; --fg: #EEEBE4; --fg2: #B8B3A8; --line: #26262A;
  --blaze: #FF6A2B; --live: #8FD14F; --red: #E5484D;
  --sans: 'Barlow', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --w: 1200px; --gx: clamp(1.25rem, 4vw, 4rem);
}
```

Vendor Barlow 400 and 500 as latin-subset woff2 next to the existing Plex Mono
files. Drop the tier system and the camo, resolve, and scanline scripts.

## Not decided here

Final hero copy beyond the brief's candidate. Photographs. Profile URLs, the
contact route, and any support destination. Collar license wording. The build
pipeline stays as it is; this needs a new stylesheet and new partials, not a
framework.

## Revision, September 15, 2026

Copy was cut to one or two sentences per section and diagrams carry the
argument instead. Five SVG figures live as partials: `fig-netting` (netting by
hand versus a boundary on a phone), `fig-system` (inputs, intelligence layer,
your model, boundary app, collars), `fig-rotation` (graze, next, resting with
recovery bars), `fig-rail` (the roadmap as a rail), and `fig-collar` (the
collar as replaceable parts). Every figure is drawn in the six site colors with
mono labels and states nothing measured. Body text on figure sections is a
single caption in `--fg2` under the drawing.

## Revision, September 15, 2026, later

Home reordered into one line of argument: the problem (netting), first the
collar, then the software, you stay in control, ownership, where it stands,
who is building it. The rotation figure moved to Project.

The pixel mark is now the thread through the site: a two-pixel ornament at the
top-left of every section rule, a faint pixel-grid field behind the hero's
right half, square animal markers drawn with crisp edges in every figure, and
the mark at 40px as the footer sign-off. Neutrals warmed: bg `#0E0D0B`, panel
`--soot #15130F`, line `#2A2620`, text `#F0EBE0` and `#B5AD9F`. The concept
frame and code blocks sit on `--soot` for depth.

Motion, all CSS, all off under reduced motion: the mark's pixels fill in on
load, hero elements rise in sequence, the proposed boundary marches slowly,
animal pixels blink out of phase, the current roadmap pixel pulses, and
sections fade up once on scroll with a timed fallback so nothing stays hidden.
