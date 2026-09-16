# AGENTS.md

This repository is the closed openpasture website at openpasture.dev.

## Required reading

Start with [docs/repositioning/README.md](docs/repositioning/README.md), then read
its linked founder and product brief, website brief, and design proposal before
revising the site or its messaging. The README also carries the table of
unresolved inputs (profile URLs, contact inbox, support destination, hardware
license). Do not invent answers to those.

These documents capture the founder's September 14, 2026 discovery interview.
They superseded the August 2026 positioning formerly in this file and the copy
of the earlier site, as well as older sibling-repo vision and voice documents
for this website. They do not change licenses or establish shipped capability.

### Core direction

- **Mission:** Move animal agriculture onto pasture.
- **Immediate work:** Build an open, repairable collar and a simple map-boundary
  application. Prototype components were ordered and in transit at the
  September 14, 2026 interview.
- **Longer-term product:** Farm intelligence using farm context, external telemetry,
  and the user's choice of model. Begin with farmer-approved moves; optional
  scheduled automation and more adaptive grazing come later.
- **Business:** For-profit components, kits, assembled collars, and optional
  intelligence subscriptions. Hardware/software bundles are acceptable. Owners
  should remain able to integrate other software and repair their equipment.
- **Openness:** The founder accepts commercial manufacture by others. Do not
  invent commercial-use fees, new licenses, or already-published hardware designs.
- **Current identity:** Cody alone, building in spare time alongside his Firecrawl
  job and family. No implied employer endorsement or active investment round.
- **Website priority:** Follow the build, attract hardware/software engineering
  contributors, and provide transparent support paths when configured.
- **Updates:** Personal LinkedIn/X posts and occasional technical articles.
- **Voice:** Project-led, personal, precise, optimistic, and empathetic to farmers.
- **Design:** Settled in
  [docs/repositioning/design-proposal.md](docs/repositioning/design-proposal.md),
  which describes the site as shipped. The earlier camo and pixel-display
  system was retired in the September 14, 2026 rebuild; only the pixel mark
  survived.

## Evidence and editorial rules

- Future tense describes intent. Present tense requires current evidence.
- The interview is the source for founder intent and reported September status.
  Present-tense progress claims are dated: the status list in
  `partials/status.html`, dated by `SITE.statusDate` and `SITE.statusDateIso`
  in `build.js`, and dated entries on `/notes`. Copy elsewhere may restate
  them only in the same terms and must be revisited when the status list
  changes.
- The dog prototype milestone is distinct from livestock validation and from
  demonstrated pasture or economic outcomes.
- The research farm is conditional on resources. No farm purchase, flock, or
  performance result was established.
- The within-$1-per-pound grocery comparison is a long-term like-for-like retail
  ambition, not a price promise. Define the benchmark before measuring it.
- No unsupported environmental, animal-welfare, containment, cost, or market
  superiority claims. Do not prescribe a universal daily movement schedule.
- Competitor claims require current evidence. Subscriptions are not inherently
  opposed to the business; software choice and ownership are the distinction.
- Firecrawl and outside telemetry/model providers are possible or planned
  integrations unless verified. Never imply an unestablished partnership.
- Do not promise zero external service costs or blanket hosted/self-hosted parity.
- The agent kit is AGPL-3.0, verified 2026-09-15 against its `LICENSE`,
  `pyproject.toml`, and the GitHub repository. This repo remains closed. The
  website task does not authorize relicensing anything.
- Keep `/docs` and `/pricing` as real pages. `/docs` carries the agent kit's
  GitHub source and docs-source links; `/pricing` states that nothing is for
  sale and must not gain prices or commercial terms. No app link exists until
  `app.openpasture.dev` resolves.
- Verify profile, contact, repo, and support destinations; no guessed handles,
  fake posts, dead CTA placeholders, or unconfigured payment flows.

## Implementation mechanics

Rebuilt September 14, 2026 and deployed September 15, 2026 (commit `7212a56`)
to the design in
[docs/repositioning/design-proposal.md](docs/repositioning/design-proposal.md).

- **There is a build step.** `build.js` composes `layouts/base.html` with
  fragments in `pages/` and partials in `partials/`, then writes `dist/`.
  `npm run build` runs on `prestart`. Express serves `dist/` only. The build
  fails on a missing partial or an unresolved `{{token}}`. One token is
  computed per page rather than read from `SITE`: `{{monoPreload}}`, which
  `layouts/base.html` places after the two Barlow preload links. `build.js`
  sets it to a preload link for the IBM Plex Mono file when the page's
  composed content uses `.mono`, `.status`, `.big`, `.d` or an inline IBM
  Plex Mono font-family, and to an empty string otherwise, so pages that
  never paint the face (legal, docs, pricing, involved, 404) do not fetch it
  ahead of their first paragraph. It is computed for every fragment, the 404
  page included, so the token always resolves.
- Author pages as fragments in `pages/`. Never edit `dist/`; it is generated
  and gitignored.
- Fragment metadata sits in a leading `<!--meta ... -->` comment: `title`,
  `description`, `nav`. Tokens are `{{key}}` for site constants and
  `{{> name}}` for partials. Site-wide URLs and the status date live in the
  `SITE` object in `build.js`.
- Ten partials: `header`, `footer`, `mark` (the pixel monogram both of them
  include), `status` (the dated build status list), `map` (the concept
  drawing in the hero), and five figures: `fig-netting`,
  `fig-collar`, `fig-system`, `fig-rotation`, `fig-rail`. Figures are inline
  SVG drawn in the site colors with mono labels, except `fig-rail`, whose stop
  names are Barlow so they read as headings; only its "now" is mono. They
  state nothing measured. Every paint in the drawings, the map, and the
  concept frame is a `k-` class from `assets/op.css` bound to a palette
  token; the SVG carries no hex literals. `k-lead` (`--fg2` at 45% stroke
  opacity) is for connectors that carry meaning, leaders, inputs and tracks;
  `k-line` stays for contours. Each figure partial wraps its SVG in a
  `.scroll` wrapper (`role="group"`, an `aria-label` naming the drawing,
  `tabindex="0"`) that scrolls sideways under 760px instead of shrinking the
  labels; the map in the hero has no wrapper because it scales.
- One stylesheet, `assets/op.css`. Barlow 400 and 500 for all reading text,
  IBM Plex Mono 400 for dates, times, status, and figure labels. Each web
  font has a local stand-in `@font-face` (`Barlow Fallback`, `Barlow Fallback
  Roboto`, `IBM Plex Mono Fallback`) with `size-adjust` and metric overrides
  measured against this site's copy so the swap moves nothing; measures are
  in em rather than ch for the same reason. Re-measure them when a font file
  changes. Eight color tokens in `:root`: `--bg`, `--soot`, `--fg`, `--fg2`,
  `--line`, `--blaze`, `--live`, `--red`, plus `--blaze2`, the button's hover
  and press tint, and one derived tint, the form's field borders (`--fg2`
  mixed 55% into `--bg` with `color-mix`, `--line` as the fallback). No
  gradients, glows, badges, eyebrow labels, subtitles under headings,
  numbered sequences, arrow glyphs, emoji, or card grids. Section headings
  are plain sentences. Body text is near-white. Phone rules live in the
  `max-width` media blocks near the end of the file (1100, 900, 760, 600 and
  360px); desktop rules are unscoped. Hover styles sit inside
  `@media (hover: hover)` and each has an `:active` equivalent outside it, so
  never add an affordance that exists only on hover. A `@media print` block
  at the end of `op.css` swaps the palette to white paper and unrolls the
  drawings.
- The palette has one source. `scripts/og-source.svg` paints with `var()`
  and is inlined by `scripts/render-images.js` together with the `:root`
  block from `op.css`. Hex values are repeated in three places, because
  none can read a stylesheet: `assets/favicon.svg`, the `theme-color` meta in
  `layouts/base.html`, and the pixel-grid data URI on `.hero .px` in
  `op.css`. Each carries a comment naming the token it mirrors; change them
  when the token changes.
- `server.js` sends a strict Content-Security-Policy (`style-src 'self'`,
  `script-src 'self'`, `img-src 'self' data:`,
  `require-trusted-types-for 'script'`). No style attributes, `<style>`
  blocks, or inline scripts in pages or partials; styling goes in `op.css`,
  behavior in `site.js`. The `data:` allowance exists for the hero's
  pixel-grid background. `require-trusted-types-for 'script'` means
  `site.js`, and any future script, must build DOM with `textContent`,
  `createElement` and `setAttribute`, never `innerHTML`,
  `insertAdjacentHTML`, `document.write` or `DOMParser` with a plain string;
  Chrome throws on those. `server.js` also gzips text responses (HTML, CSS,
  JS, SVG, JSON) through the `compression` package, mounted before the static
  handlers and the 404 page, because Railway's edge passes responses through
  uncompressed; woff2 and PNG are already compressed and are left alone.
- `server.js` redirects `www.openpasture.dev` to the apex so every page has
  one URL.
- Under 900px the header's inline links are replaced by a native
  `details` menu in `partials/header.html` (summary "Menu"/"Close" with a
  three-pixel mark, a panel of the four page links plus Get involved). No
  hamburger icon. It works without JavaScript; `site.js` only closes it on
  Escape, outside taps, and link choice. The phone rules for it live in the
  900px block of `op.css`.
- The only script is `assets/site.js`. It submits the form on `/involved` to
  `/api/contact`, fades section content up once as it scrolls into view with
  a timed fallback so nothing stays hidden, pauses the drawings' looping
  animations while they are off screen, registers an empty passive
  `touchstart` listener so iOS Safari paints the `:active` press states that
  `op.css` carries, and keeps `tabindex` on the drawings' `.scroll` wrappers
  in step with overflow: each wrapper ships `tabindex="0"` in its partial,
  the script removes it while the whole drawing fits and restores it when
  the viewport narrows, through a `ResizeObserver` (a `resize` listener
  where that is missing), and leaves a wrapper that currently has focus
  alone. Neither motion behavior runs under `prefers-reduced-motion`. Every
  page is complete without the script: the form also posts as a plain HTML
  form and lands back on `/involved#sent` or `/involved#failed`, and a
  drawing that overflows is still reachable by keyboard through the shipped
  `tabindex`. Above 760px that shipped `tabindex` is inert without the
  script: the wrapper stays focusable but paints nothing, because the track
  and thumb under a drawing are drawn only inside the 760px block, the one
  range where a drawing can overflow. So the cost of running without the
  script there is an idle tab stop per drawing, never a stray track.
- `assets/og.png` and the three icon PNGs are written by
  `scripts/render-images.js`. `og.png` is rendered from
  `scripts/og-source.svg`; the three icon PNGs are drawn from the pixel
  pattern hard-coded in the script. The mark's pattern lives in four places
  that must be kept identical: `assets/favicon.svg`, `partials/mark.html`,
  `scripts/og-source.svg`, and the rows array in `scripts/render-images.js`.
  Edit those sources and rerun the script; do not edit the PNGs by hand.
  Their URLs carry the `?v=` hash that `build.js` computes over everything in
  `assets/`, so a re-render shows up on the next deploy without renaming
  anything. The font files are the one exception: `op.css` and the preload
  links reference them without a version, so a changed font needs a new
  filename, and its stand-in `@font-face` in `op.css` re-measured.
- Redirects from earlier routes are the `REDIRECTS` map in `server.js`.
  `/pricing`, `/docs`, `/privacy`, and `/terms` remain real pages. Unknown
  routes return `dist/404.html` with status 404.
- `robots.txt` and `sitemap.xml` are written to `dist/` by `build.js` from the
  page list, so the sitemap always lists the ten public pages and nothing has
  to be edited by hand when a page is added or removed.
- `POST /api/contact` sends a plain-text email through Resend from
  `RESEND_FROM` to `CONTACT_EMAIL`. Without `RESEND_API_KEY` it logs the
  submission locally and answers 503 in production. `.env.example` lists
  every variable `server.js` reads.
- `docs.openpasture.dev` and `app.openpasture.dev` did not resolve at rebuild
  time, so the site links to the GitHub repository for docs and does not
  offer sign-in. Restore those links only after verifying the hosts are live.
- The earlier pages, the ledger partial, and the camo, resolve, and pixel-font
  assets were retired in the rebuild and exist only in git history. Do not
  restore or link to them.
- Railway auto-deploys `main` to openpasture.dev. There is no deployment
  config file in the repo; environment variables are set on the Railway
  service.
