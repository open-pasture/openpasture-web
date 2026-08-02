# AGENTS.md

This repository is the closed OpenPasture marketing site: a manifesto-led
argument for automated land management, plus early-access capture.

## Posture (changed August 2026 — read this before "fixing" copy)

The site's positioning changed deliberately. It now argues for a future of
automated land management: ruminant herds guided by open, repairable radio
collars and an open-source decision layer that learns the farm. Earlier
guidance in `../openpasture-agent-kit/docs/vision.md` and
`docs/voice-and-boundaries.md` (which listed collars under "not building
first" and forbade autonomy framing) predates this change and is superseded
for THIS repo. Do not revert the site toward agent-integration-only,
farmer-lead-gen copy. Those agent-kit docs need updating separately; flag the
conflict, don't inherit it.

## Audience and voice

- Audience: technical and open-source readers (Hacker News, open hardware,
  right-to-repair, AI-for-climate) — movement backers, not farmer lead-gen.
- Voice: technical rigor grounded in real farm detail. No folksiness, no
  marketing gloss, no hype. Lowercase display headings are house style.
- The manifesto (`manifesto.html`) is the centerpiece and the shareable
  artifact. The landing page distills it.

## The no-fiction rule (non-negotiable)

- Future tense describes intent. Present tense is reserved for what verifiably
  exists. Never describe unbuilt capability in present tense.
- The "state of the project" ledger (on both pages) is the source of truth
  for what exists. Keep it current; when something ships, update the ledger
  in the same change.
- Say "our prototypes ingest Planet imagery" — never "partnered with Planet"
  or any phrasing implying a commercial relationship that does not exist.
- Quantitative claims must carry a citation (see manifesto sources) or be
  explicitly marked as targets/positions. Do not invent numbers.
- Name competitors (Halter, Nofence, Vence, Gallagher eShepherd) factually
  and respectfully. Differentiate on business model (open vs lock-in), never
  on capability — they ship, we don't yet.

## Content rules

- Animal welfare leads as a pillar, never appears as a defense. Daily fresh
  feed is the point; audio-first cues and published pulse metrics are the
  mechanism. Do not remove or bury the welfare section.
- The farmer is not removed from the loop — the fence is. The farmer teaches
  the system and makes the crucial calls. Keep that framing exact.
- No pricing, no "try the cloud," no product CTAs until a product exists.
  The only conversion is early-access signup (`POST /api/contact`,
  `source: "early-access"`).
- Keep licensing language consistent with the source repos: agent kit is
  AGPL-3.0; this repo is closed.

## Mechanics

- Static HTML + Express (`server.js`), no build step. Shared styles in
  `assets/site.css`, shared behavior in `assets/site.js`.
- `/mission` and `/pricing` 301-redirect to `/manifesto` and `/#early-access`;
  the old pages are deleted. Don't resurrect them.
- Railway auto-deploys `main` to openpasture.dev.
