# AGENTS.md

This repository is the closed Open Pasture website at openpasture.dev.

## Required reading: September 2026 repositioning

Start with [docs/repositioning/README.md](docs/repositioning/README.md), then read
its linked founder/product brief, website brief, and build handoff before
rebuilding the site or revising its messaging.

These documents capture the founder's September 14, 2026 discovery interview.
They supersede the August 2026 positioning formerly in this file and conflicting
copy in the current pages, as well as older sibling-repo vision/voice documents
for this website. They do not change licenses or establish shipped capability.

### Core direction

- **Mission:** Move animal agriculture onto pasture.
- **Immediate work:** Build an open, repairable collar and a simple map-boundary
  application. Prototype components were ordered and in transit at the interview.
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
- **Design:** Crisp and beautiful with Omarchy inspiration; exact styling is open.
  The old camo/pixel system is not a constraint on the new design.

## Evidence and editorial rules

- Future tense describes intent. Present tense requires current evidence.
- The interview is the source for founder intent and reported September status.
  `partials/ledger.html` is historical software context, not automatically verified
  current truth. Reconcile it with evidence during the rebuild.
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
- The agent kit was described as AGPL-3.0; verify its actual license before claims.
  This repo remains closed. The website task does not authorize relicensing.
- Keep useful docs and app links accessible. `/pricing` has known external docs
  links and should remain available; do not invent prices or commercial terms.
- Verify profile, contact, repo, and support destinations; no guessed handles,
  fake posts, dead CTA placeholders, or unconfigured payment flows.

## Preserve existing work

The repo had substantial uncommitted implementation work before this documentation
handoff. Inspect git status and preserve it. Do not reset or clean the working
tree. See the build handoff for the snapshot and migration checklist.

## Existing implementation mechanics

These describe the local, uncommitted website implementation inspected during
the interview, not necessarily the committed checkout. The documentation commit
does not include that implementation. Inspect available files before using these
commands, and verify routing/deployment configuration. The visual design is open.

- **There is a build step.** `build.js` composes `layouts/base.html` with
  fragments in `pages/` and partials in `partials/`, then writes `dist/`.
  `npm run build` runs on `prestart`. Express serves `dist/` only.
- Author pages as fragments in `pages/`. Never edit `dist/` — it is generated
  and gitignored.
- Fragment metadata sits in a leading `<!--meta ... -->` comment: `title`,
  `description`, `tier`, `nav`. Template tokens are `{{key}}` for site
  constants and `{{> name}}` for partials. Site-wide URLs live in the `SITE`
  object in `build.js`.
- **Design tiers** are set per page via `tier` and applied as `data-tier` on
  `<body>`: 1 = full-bleed camo (`/` only), 2 = camo hero band then solid,
  3 = no camo, for dense reading (`/docs`, `/privacy`, `/terms`). Press Start 2P
  is display-only and gets more restricted as pages get denser.
- **Fonts are latin-subset woff2 files vendored in `assets/fonts/`.** Block,
  shade, and arrow characters (U+2500 and up) are NOT in them and will fall back
  to a system font. Never put one inside a text run — especially not in the
  motion charset, where equal advance width is what keeps the decode free of
  layout shift. Isolated decorative glyphs are fine.
- Motion lives in `assets/resolve.js` (text decode, scanline, tile-in) and the
  boot pass in `assets/camo.js`. Every animated element ships its real content
  in the HTML; the script scrambles and restores. If JS never runs the page is
  complete. Budget is ~900ms, once per session, and
  `prefers-reduced-motion: reduce` skips all of it.
- `/manifesto` 301-redirects to `/mission`. Railway auto-deploys `main` to
  openpasture.dev.
