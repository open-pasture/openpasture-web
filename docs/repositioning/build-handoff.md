# Instructions for the next website-building agent

## Start here

Read [AGENTS.md](../../AGENTS.md), [the founder brief](founder-and-product-brief.md),
and [the website brief](website-brief.md). These supersede the older positioning
in current pages and earlier agent-kit vision documents for this web rebuild.

The user requested a brand-new website anchored in the new understanding.
This documentation task did not implement that website. Build from the new
narrative rather than lightly changing the old headline.

The founder ended the interview because enough information had been gathered.
Do not restart broad discovery. Use judgment for reversible design choices.
Resolve only genuinely missing factual inputs needed for publication, and keep
independent design/build work moving.

## Existing working tree

At handoff on 2026-09-14, this repo already had substantial uncommitted changes:
modified config, server, assets, and AGENTS.md; deleted earlier root HTML/CSS;
and new build.js, layouts, pages, partials, fonts, and animation assets.

These predate the documentation task. Inspect the actual current git status and
preserve the user's work. Do not reset, clean, or restore the repository to erase
those changes. This handoff added documentation and updated agent guidance only.

## Current implementation map

Verified by local source inspection during this documentation task. These files
include uncommitted website work that is not part of the documentation commit;
a fresh checkout may still have the older root-HTML site. Inspect actual files
and scripts before following these mechanics:

- `package.json`: `npm run build` invokes `node build.js`; `npm start` runs the
  build via prestart, then `node server.js`; `npm run dev` builds then serves.
- `build.js`: composes fragments in `pages/` using `layouts/base.html` and
  `partials/`, then writes `dist/`. Assets are copied to output.
- Fragment metadata is a leading `<!--meta ... -->` block with fields such as
  title, description, tier, and nav. Tokens use `{{key}}` and `{{> partial}}`.
- `build.js` has the `SITE` constants for public URLs and contact addresses and
  a default description that still uses the old positioning.
- Existing styling lives in `assets/op.css`; motion is in `assets/resolve.js`
  and `assets/camo.js`, with shared behavior in `assets/site.js`.
- The old homepage lives in `pages/index.html`; shared navigation/footer in
  `partials/header.html` and `partials/footer.html`.
- `partials/ledger.html` records older software status. Its content was read,
  but the stated live services and prototypes were not exercised in this task.

Existing guidance says Express serves `dist/`, `/manifesto` redirects to
`/mission`, and Railway deploys main to openpasture.dev. Inspect `server.js` and
current deployment configuration before relying on that behavior. Do not edit
generated `dist/` as source.

The current design tiers and pixel fonts are implementation details, not a
requirement to retain the old aesthetic. Vendored font subsets have glyph
limitations; verify any decorative characters if reusing them.

No framework migration is required by the brief. Prefer the simplest architecture
that supports the design and maintainable updates.

## Content migration and claim audit

| Existing surface | Required treatment |
| --- | --- |
| Homepage | Rebuild around the mission, collar-first milestone, intelligence vision, founder, progress, participation |
| Header/footer | Follow/contribute hierarchy; verified personal socials; retain useful product/docs access |
| Mission | Rewrite the argument around founder experience and a thesis to test; remove unsupported inevitability and stale vendor claims |
| Roadmap | Collar + simple boundary app first; progressively add intelligence; research farm conditional on resources |
| Agent kit | Preserve useful factual technical content after verification; do not confuse kit availability with collar readiness |
| Cloud | Verify access and capabilities before calling it live; move out of primary story if appropriate |
| Integrations | Separate working, prototype, planned, and merely possible integrations; distinguish imagery/sensors from web retrieval |
| Open source | State concrete intended freedoms and actual licenses per component; remove blanket assumptions |
| Pricing | Preserve `/pricing` compatibility with existing external docs; publish only established terms, no invented prices |
| Contact | Verify destination and contribution path; no fictional hiring or open roles |
| Ledger/status | Reconcile older software claims with current evidence; date the collar status and separate future work |
| Metadata/social preview | Update titles, descriptions, default description, and OG presentation consistently with the new story |
| Legal pages | Keep routes available; avoid inventing legal entities, licenses, payment terms, or relabeling support as charitable giving |

Specific claims to retire or qualify:

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

Do not transfer unrelated changes or licenses into the sibling agent-kit or
cloud repositories as part of a marketing-site rebuild without task scope.

## Missing inputs and how to handle them

| Input | Status and next action |
| --- | --- |
| LinkedIn and X profile URLs | Not supplied in interview. Verify from reliable project/account context or ask for exact URLs before publishing. Never guess handles. |
| Initial posts/articles | Not selected. Use actual supplied/verified material; no fabricated dates or articles. |
| Founder/field/prototype photos | Not supplied. Use available verified assets or clear illustrative design; do not invent personal imagery. |
| Hardware repository | Not established as public. Verify readiness and URL before a source/contribution CTA. |
| Contribution workflow/contact | Founder welcomes engineers; exact route not selected. Existing `SITE.contactEmail` is a candidate to verify, not proof the inbox is monitored. |
| Financial/in-kind support destination | No provider, account, or payment URL established. Keep working links factual; omit a transactional button until there is a real authorized destination. |
| Licensing | Hardware/firmware terms undecided. Existing software licenses remain in force; do not silently change them. |
| Current software capability | Read the relevant repo and validate any capability published as live; local old copy alone is insufficient. |
| Visual design | Omarchy inspiration is established; exact color/type/photo choices are open. Exercise design judgment. |
| Research farm | No property, funding, flock, results, or dates established. Future/conditional language only. |

An unresolved payment mechanism or asset choice need not block the rest of the
site. Do not ship broken placeholder links or invent answers to make a page
look complete. Document material omissions in the build delivery.

## Recommended execution sequence

1. Inspect current working tree, routes, assets, and any newer project status.
2. Translate this brief into concise page copy and a coherent visual system.
3. Build the new homepage and shared navigation, then supporting pages and
   minimal Field Notes capability.
4. Reconcile all remaining pages, metadata, status labels, and old commercial
   claims. Preserve routes or deliberately redirect where compatible; retain
   `/pricing` for known external links.
5. Verify real social/contact/source destinations and current product claims.
6. Build and visually inspect desktop and mobile layouts. Exercise navigation,
   Field Notes links, forms if retained, and reduced-motion behavior.
7. Report what was built, what was verified, and any missing assets/accounts.
   Distinguish local preview from deployment. Do not infer authorization to
   commit, push, or publish from this documentation-only handoff.

## Acceptance criteria for the rebuilt website

### Story and truthfulness

- A new visitor can explain the mission, first collar milestone, and eventual
  intelligence layer without learning agent-framework terminology.
- It is clear the project is currently founder-led and in development.
- The founder's practical origin story is recognizable and accurate.
- Current progress is dated and distinguished from intent and concept UI.
- Hardware ownership, repairability goals, and software choice are explained
  alongside the for-profit components/collars/subscription business model.
- No new license, safety result, price, customer, partner, farm, or environmental
  outcome is invented.
- Farmers appear as decision-makers and collaborators in the product experience.

### Participation and publishing

- Follow the build and help build it are prominent, functioning paths.
- LinkedIn/X links point to verified personal profiles; external posts are labeled.
- Updates support both social links and occasional local technical articles.
- Support copy is transparent and uses only a real configured destination.
- The site does not imply an active investment round or Firecrawl sponsorship.

### Design and implementation

- The design is crisp, readable, distinctive, and grounded in pasture/farm work.
- Mobile navigation and narrow-screen reading work without overflow.
- Keyboard focus, headings, link labels, contrast, image alt text, and
  reduced-motion behavior are checked.
- Meaningful content remains available if decorative JavaScript fails.
- The build passes; generated output is not edited by hand.
- Existing important routes, docs links, contact behavior, and app access are
  preserved or intentionally reconciled.
- Rendered pages are visually inspected; a successful build alone is not treated
  as proof of a finished design.

## Handoff prompt

> Rebuild the Open Pasture website using AGENTS.md and docs/repositioning/README.md
> as your entry points. Read the linked founder, website, and build briefs. Use
> the new collar-first mission and community positioning, preserve existing user
> work, distinguish future capabilities from verified progress, and make sensible
> design choices without restarting discovery. Build and visually verify the
> website, and report any remaining factual inputs or publication dependencies.
