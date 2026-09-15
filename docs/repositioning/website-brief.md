# Website strategy and creative brief

Read [the founder brief](founder-and-product-brief.md) first. The following is a
recommended design and editorial translation of the interview. Sample copy and
page names are proposals, not final approved text. The site was built from
this brief and deployed 2026-09-15. Where a proposal here differs from
[design-proposal.md](design-proposal.md) or [AGENTS.md](../../AGENTS.md),
those describe what shipped and take precedence.

## Job of the new website

Make it easy to understand why openpasture exists, what is being built, how early
it is, and how to follow or help. Give the project a durable home as its thinking
and implementation evolve.

The first visit should answer:

- What is openpasture trying to change?
- Why start with a collar?
- What makes ownership and integration different here?
- What exists today and what comes next?
- Who is behind it?
- Where can I follow progress or contribute?

The homepage should primarily serve interested followers and prospective
contributors. Farmers should recognize real work and decisions in the story.
Potential supporters and funders should find enough clarity and candor to
understand it, without an investor pitch becoming the main experience.

## Messaging hierarchy

| Role | Recommended wording / meaning |
| --- | --- |
| Mission | Move animal agriculture onto pasture. |
| Headline | Farm like you're in the future. |
| Category | An intelligence layer for pasture-based farming. |
| Concrete build | Open, repairable livestock collars and the software to manage grazing. |
| Immediate work | First, make a collar work with simple map-drawn boundaries. |
| Ownership | Repair your collar. Choose your software. Build on the designs. Phrase as intended freedoms until available. |
| Business | Components, collars, and optional intelligence software; earn the customer through the complete experience. |
| Proof | Build and test, then demonstrate agricultural and economic outcomes on a working farm. |
| Invitation | Follow the build. Help build it. |

The founder likes the future-facing tagline family. The exact wording above was
recommended in discovery, not separately approved as a final brand line.

## Recommended homepage sequence

### 1. A clear promise and a concrete starting point

Candidate hero:

> Farm like you're in the future.
>
> We're building open, repairable livestock collars and an intelligence layer
> for pasture-based farming. Starting with a collar you can control from a map.
> Working toward a farm that helps you decide where the animals should graze next.
>
> Follow the build · Explore the project

Pair with a compact, dated development update. Initial factual copy can say:

> September 2026: first prototype components ordered. Garage assembly is next.

Refresh `partials/status.html` and `SITE.statusDate` when new evidence exists.
Do not imply the components have arrived just because time has passed.

### 2. The problem, rooted in two sheep

Use the overgrown backyard and electric-netting experience to explain the labor
problem. A short founder attribution makes this personal without turning the
whole website into a personal portfolio.

Candidate copy:

> openpasture began with two sheep, an overgrown slope, and too much time spent
> moving electric netting. Cody wanted a collar he could own and write software
> for. Now he's building one, alongside his work and family.

Link to the fuller origin story. Avoid assuming all regenerative grazing problems
are solved simply by replacing fences.

### 3. Two connected pieces

**The collar:** the physical tool, basic boundary control, repairability, published
design intentions, and independent software integration.

**The intelligence:** farm context, grazing knowledge, outside telemetry, and the
user's chosen model, working toward better movement decisions.

Make the relationship explicit: the collar acts in the pasture; the intelligence
layer plans what should happen. The immediate build starts with basic control.
Do not recreate three equal product cards for Agent Kit / Cloud / Integrations.

### 4. Show a future day on the farm

A clearly labeled concept can show:

- A focused farm summary.
- A proposed destination on a paddock map.
- A scheduled move and countdown.
- Hold / choose preset / edit boundary controls.
- A request for a pasture photo or field note.

Label illustrative UI as a product concept, not a live dashboard. Never invent
measured farm scores, animal counts, telemetry, or savings and present them as
real. Use the approval-first path and eventual optional automation accurately.

The mental model: "Here's how the farm is doing. Here's the next planned move.
Here's what needs your attention."

### 5. Explain ownership plainly

Describe intended rights and design goals using practical examples: replacing a
battery, assembling a kit, connecting different software, or using another
connectivity provider where supported.

Software subscriptions and hardware bundles can coexist with this promise. Do
not imply all subscriptions are bad or that the intelligence software must be
free. Do not claim a finalized hardware license.

### 6. State the ambition and the path to proof

Mission first, with a brief account of the proposed research farm and sheep-first
agricultural focus. Broader cattle and poultry applications can appear here or
on the project page.

Candidate copy:

> Our mission is to move animal agriculture onto pasture. We want to build tools
> that help pasture-based farms grow, and test the economics by running a farm
> ourselves.

The $1-per-pound ambition is optional deeper-page material. It is not a hero
promise, current price, or validated commercial forecast.

### 7. Field Notes

Show a small number of genuine, dated updates with clear destinations. A note may
be a social link, brief local update, photo, or longer article. If none have been
selected, use the real development status and profile links rather than fake
posts or an invented publication history.

### 8. A specific invitation

- **Follow:** personal LinkedIn and X profiles and recent posts, once the
  profile URLs in the unresolved-inputs table in README.md are supplied. Until
  then the site links none.
- **Help build:** hardware and software implementation; link to actual tasks or
  a verified contact route.
- **Support:** components, equipment, and development/AI costs once a real support
  channel exists. Keep this secondary and transparent.

Do not introduce sales funnels, preorders, investment solicitations, donation
progress bars, or commitments unsupported by the founder's instructions.

## Recommended information architecture

Keep the site small; sections can be consolidated if separate pages would be
thin. Recommended primary navigation:

**The Project · Open Collar · Field Notes · About · Get Involved**

| Destination | Content |
| --- | --- |
| Home | Concise complete story and current build status |
| The Project | Intelligence experience, system relationship, milestone roadmap, research-farm ambition, current software links |
| Open Collar | Build status, modularity goals, integration promise, eventual designs and component details |
| Field Notes | Chronological social links and local technical articles |
| About | Mission, founder background, two-sheep origin, for-profit/spare-time identity |
| Get Involved | Specific engineering help, following, contact, support when configured |

Existing documentation, GitHub, application access once `app.openpasture.dev`
resolves (see [AGENTS.md](../../AGENTS.md)), legal pages, and pricing should
remain discoverable through relevant sections and the footer. Preserve
existing URLs or map deliberate redirects; see the `REDIRECTS` map in
`server.js` and the unresolved-inputs table in [README.md](README.md).

## Voice

Established preference: the project has its own voice, but feels small and
personal. Use "openpasture" and a natural project "we," with a clear founder
credit so readers are not misled about team size. Signed first-person notes are
appropriate for Cody's updates.

Write with optimism, precision, and respect for farmers. Ground the technology in
recognizable work: moving animals, checking paddocks, replacing parts, noticing
conditions, and deciding what to do next.

Avoid:

- Fake rustic language, developer-only jokes, and corporate grandeur.
- Treating farmers as obsolete or incapable.
- Promising inevitable market dominance or ecological improvements.
- "AI-first agentic harness" as an unexplained homepage value proposition.
- Treating openness as a guarantee that all running costs disappear.
- Universal fresh-grass-every-24-hours prescriptions.
- Repeating tentative architecture choices as settled implementation.

Use farmer-facing explanations first. Technical readers can follow links to
architecture, firmware, model integration, and source documentation.

## Visual direction

This section is the interview record. The September 14, 2026 rebuild retired
the camouflage, scanning, and text-scramble effects of the earlier site; the
live site at openpasture.dev is now the visual reference, and
[design-proposal.md](design-proposal.md) documents it as shipped.

### Established preferences

- Crisp, beautiful, well-designed, and future-facing.
- Inspired by Omarchy, with empathy for farmers and less developer-heavy styling.
- The site at the time was already moving toward that aesthetic.
- No final palette, type system, photo selection, or attachment to the
  then-current camo/pixel/pink elements was established before the interview
  ended.

Reference: [Omarchy](https://omarchy.org/). Discovery checked its homepage text,
which connects a strong project point of view, a visible creator, and ways to
participate. A fresh visual inspection is needed before deriving detailed design
choices; this brief is not a rendered visual audit of that site.

### Recommended starting direction, open to design judgment

- Generous space, strong typographic hierarchy, and concise sections.
- Warm off-white, deep charcoal, pasture green, and one bright accent are one
  possible palette, not a requirement.
- Readable main typography with monospace in small labels, dates, and specs.
- A restrained pixel detail could preserve continuity with the existing identity.
- Real pasture, animal, workbench, or prototype imagery when available.
- An explanatory pasture map rather than a wall of technical product cards.
- Reduce the dominance of the then-current full-screen camouflage, scanning,
  and text-scrambling effects if they distract from the story.
- Subtle motion, good contrast, accessible controls, and a strong mobile layout.

Do not claim generated or stock photography depicts Cody's farm, dog, animals,
or actual prototype. Photos and visual assets were not supplied in the interview.

## Publishing approach

"Field Notes" is a recommended flexible name, not a demand to run a formal blog.
LinkedIn and X are the primary publishing channels; local technical write-ups
are occasional. No newsletter, CMS, social-feed API, or editorial schedule is
required for the first build.

A minimal entry model can include:

- Title and publication date.
- A short summary.
- Kind: external social post or local article.
- Destination URL or local slug.
- Optional image with alt text and author credit.

Clearly label "Read on LinkedIn" / "Read on X" when linking out. Prefer simple
links over embedded feeds initially. Do not publish private drafts or scrape and
republish full social content without establishing the intended source material.

Visible founder credit appears on About and in the footer. Personal social
links belong there too, once the profile URLs in the unresolved-inputs table
in README.md are supplied; until then the site links none.
