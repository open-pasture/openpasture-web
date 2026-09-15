# Open Pasture positioning: source of record

Updated 2026-09-15. Source: the founder's website discovery interview of
September 14, 2026.

Rebuilt and deployed 2026-09-15. The website these documents describe was
rebuilt on September 14 and deployed to openpasture.dev on September 15, 2026
(commit `7212a56`). The live site is the visual reference; these documents are
the positioning and editorial reference behind it.

Read in order:

1. [Founder and product brief](founder-and-product-brief.md): the decisions and
   context established by the founder, including the origin story, commercial
   model, openness, product experience, research farm, and development sequence.
2. [Website brief](website-brief.md): audience, narrative, candidate copy,
   information architecture, design direction, updates, and contribution paths,
   as recorded at the interview.
3. [Design proposal](design-proposal.md): the design as shipped: palette, type,
   components, figures, motion, and the page order.

Also read [AGENTS.md](../../AGENTS.md) before editing the site. It holds the
evidence and editorial rules and the implementation mechanics.

## The story in one paragraph

Open Pasture's mission is to move animal agriculture onto pasture. It is a
founder-led, spare-time, for-profit project starting with an open, repairable
livestock collar and a simple application for drawing virtual boundaries. The
longer-term product is an intelligence layer that brings together farm context,
grazing knowledge, external telemetry, and the farmer's chosen AI model to plan
animal movement, request observations, and eventually automate moves within
farmer-defined controls. The business aims to win through the complete experience:
components, assembled collars, and optional intelligence software. Farmers should
remain free to repair their collars and use competing software. A future working
research farm would test the agricultural and economic thesis by raising and
selling animals and meat. Today, the first collar prototype's components have
been ordered; the website's job is to help people follow and contribute to the
build.

## Decisions versus proposals

- **Founder-established:** facts, intentions, and preferences explicitly expressed
  in the interview. These appear in the founder brief. Intentions remain future
  tense until demonstrated.
- **Recommended:** site structure, sample copy, and visual choices synthesized
  during discovery. The website brief records them as proposals; the design
  proposal records what was actually built.
- **Unresolved:** the inputs in the table below. Do not invent them.

## Unresolved inputs

Both this table and the claims list below were folded in from the September 14
build handoff (`build-handoff.md`), removed in the 2026-09-15 cleanup; git
history before that commit has the original. Updated 2026-09-15 against the
shipped site.

| Input | Status and next action |
| --- | --- |
| LinkedIn and X profile URLs | Not supplied. The site links no profiles; `/involved` says posts are "linked as they land." Ask Cody for the exact URLs before publishing any. Never guess handles. |
| Initial posts and articles | None selected. `/notes` carries one dated local entry (September 14, 2026). Add only real, dated material; no fabricated posts or publication history. |
| Founder, field, and prototype photos | Not supplied. The site uses SVG drawings instead. Do not present generated or stock imagery as Cody's farm, dog, animals, or prototype. |
| Hardware repository | Not public. `/involved` says a public collar repo comes once there is something to contribute to; only the agent kit is on GitHub. Verify readiness and URL before adding a hardware source or contribution link. |
| Contact inbox and sending domain | `SITE.contactEmail` in `build.js`, shown on `/involved`, `/privacy`, and `/terms`, is `cody@openpasture.dev`: the `CONTACT_EMAIL` the Railway service already delivers form submissions to, read on 2026-09-15. The earlier `hello@openpasture.com` was dropped because openpasture.com has no MX record and mail to it did not deliver. Confirm the Namecheap forwarding rule for `cody@openpasture.dev` reaches a mailbox Cody reads, or choose a different local part and change `build.js` and Railway together. `RESEND_API_KEY` and `CONTACT_EMAIL` are set on Railway; `RESEND_FROM` is not, so the server sends as Resend's test sender, which only delivers to the Resend account owner. Verify a sending domain in Resend and set `RESEND_FROM` to lift that limit. |
| Support destination | No provider, account, or payment URL exists. `/involved` says so in text and shows no button. Add a transactional link only once a real, authorized destination exists. |
| Hardware and firmware license | Undecided. `/collar` lists it under "Not decided." Do not name a license or carry the software license over to hardware. |
| Current software capability | Verified 2026-09-15 from the agent kit's README, LICENSE, and pyproject.toml: version 0.1.0-alpha, AGPL-3.0; SQLite-backed farm state, an optional Convex-backed store (`OPENPASTURE_STORE=convex`), portable skills, a morning brief that returns MOVE, STAY, or NEEDS_INFO (the site renders NEEDS_INFO as "ask" on `/project` and `/terms`), a CLI, and an MCP connector. It has no collar integration. None of `/project`, `/docs`, `/privacy`, or `/terms` claims more than this; re-verify against the kit before adding anything. The kit's `docs-site/` still advertises a hosted cloud beta and an `app.openpasture.dev` sign-up that does not resolve; that content must be fixed in the kit repo, and until it is, the "Docs source on GitHub" link on `/docs` points readers at stale claims. |
| Research farm | No property, funding, flock, results, or dates. Conditional language only. |
| Railway service settings | The repo holds no deployment config, so the service's build and start commands cannot be read from here. The live site deploys from `main` with the Node defaults, `npm run build` then `npm start`. If the service's Settings page overrides either, update the Deploy section of the repo [README](../../README.md). |

## Claims to retire or qualify

The shipped site makes none of these; keep it that way when adding copy.

- "We automate livestock movement" as a current accomplished capability.
- "No hardware work until later" as the development sequence.
- Universal daily moves or a fixed every-24-hours agronomic rule.
- "Labor is the only barrier" and inevitable cost/carrying-capacity improvements.
- A guaranteed zero-cost self-hosted experience with nothing lost; external
  services and offering details need qualification.
- Attacks on subscriptions as such; subscriptions and bundles are part of the
  founder's intended business too.
- Claims of present customers, commercial deployments, research-farm results,
  or direct-to-consumer meat sales without evidence.
- "Best" / "cheapest" as established competitive rankings.
- Firecrawl, foundation labs, imagery suppliers, or Pasturebird as partners
  without evidence of such a relationship.

## What changed

| Earlier website | Shipped direction |
| --- | --- |
| Agent Kit / Cloud / Integrations as the primary story | Mission, open collar, farm intelligence, and a visible build journey |
| Software, then telemetry, then hardware | First make the collar and basic boundary app work; progressively add intelligence |
| Product acquisition and hosted signup dominate | Follow the build and help build it dominate |
| A broad, mature-sounding platform | A candid account of one person building a prototype and inviting engineering help |
| Hardware subscriptions presented as the fundamental problem | Subscriptions and bundles are acceptable; continued hardware ownership and software choice are essential |
| Fixed daily moves and broad economic claims | Condition-dependent grazing decisions and economic outcomes to be tested |
| Hardware largely relegated to a future roadmap | Collar development is the immediate focus |
