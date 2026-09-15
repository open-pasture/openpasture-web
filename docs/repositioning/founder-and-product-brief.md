# Founder and product brief

Source: founder interview, September 14, 2026. Facts below are founder-reported
unless explicitly labeled as existing repo context. Product descriptions mostly
express intent, not shipped capability.

## 1. Mission and thesis

**Mission: Move animal agriculture onto pasture.**

The founder explicitly chose this as the outcome. Two supporting ideas explain
how Open Pasture hopes to achieve it:

- Make pasture-raised meat affordable enough to become the default.
- Build tools that let pasture-based farms compete at any scale.

The thesis is that automating animal movement can reduce the labor burden of
grazing management, help farmers scale, and support more productive, profitable
pasture-based operations. Open Pasture intends to test that thesis in practice.

The founder's interest in regenerative grazing includes animal quality of life,
land improvement, carbon storage, meat quality, carrying capacity, reproductive
success, and parasite management. These are motivations and hoped-for benefits.
They are not established outcomes of Open Pasture's technology, nor universal
claims to publish without relevant evidence and qualification.

## 2. Origin story

Cody wanted to raise animals and became interested in regenerative grazing and
working with natural systems. He bought two sheep to help reclaim a heavily
overgrown piece of land in his backyard. His intention was to use their grazing
to clear undergrowth while benefiting the land.

The land lacked a perimeter fence. He tried to contain and rotate the sheep with
electric netting. The incline made setup difficult, moving the netting took too
much time, and he struggled with grounding and keeping the setup working. The
practical bottleneck became his own ability to manage animal movement.

He looked into virtual fencing and wanted a collar he could buy as a tool and
write software against. The offerings he investigated did not give him the
ownership and integration arrangement he wanted. That prompted the decision to
build a collar with open interfaces.

Tell this as his experience. Do not turn it into an unverified current claim that
every virtual-fencing vendor lacks APIs or disables hardware on cancellation.

## 3. Who is building it

Open Pasture is currently Cody Menefee alone. It should have its own project voice
while remaining visibly small and personal.

Founder background, as described in the interview:

- Technical sales lead at Firecrawl focused on partnerships and integrations.
- Previously a product architect in wealth management, leading development of
  large multi-tenant platforms and deep third-party integrations. Confirm exact
  title/product wording if a detailed professional biography needs it.
- A blue-collar kid from Kentucky who grew up around farms, though not on a farm.
- Experience as a mechanic and tinkerer, bartender, electrician, and in other
  practical summer jobs.

He enjoys his job at Firecrawl and intends to pursue Open Pasture alongside work,
travel, and family. Do not frame the website as a full-time company launch, an
active investment round, or a transition away from Firecrawl.

He can lead the project and architecture, but wants experienced hardware and
software engineers to take on implementation. His candid description is that he
is learning and is out of his depth in parts of the work. Communicate that as a
specific invitation to contribute expertise, not as a claim of established
hardware expertise or an invented team.

Mentioning his employer is biography only. It does not imply employer funding,
endorsement, resources, partnership, or ownership of this project.

## 4. Current stage and first milestone

As of this interview:

- Components for the first collar prototype have been ordered on Cody's personal
  card and are in transit to his home.
- He intends to assemble it in his garage in his spare time.
- No working physical collar or field-proven containment was reported.
- Software exists in the surrounding repositories; the interview does not
  establish which features currently work end to end.
- There is no collar available to buy and no delivery date or price was agreed.
- A working research farm is an aspiration, not an existing project asset.

**First personal success criterion:** put a prototype collar on his Great
Pyrenees, train the dog to respect its tones, keep it in a defined space, and move
that space through his application. After that, have an agent operate the boundary.

This is a proposed early experiment, not proof of suitability for sheep or other
livestock. The website must not imply completed animal testing, validated safety,
reliable containment, or proven welfare outcomes. Do not invent stimulation
parameters, training protocols, or technical safety claims.

## 5. Development sequence

No dates are committed. These are milestones and increasing capability, not a
delivery schedule.

1. **Collar and simple boundary application.** Make the physical tool work with a
   straightforward GIS/map interface for drawing and changing boundaries. The
   immediate focus is making it exist, not sales or market penetration.
2. **Agent integration.** Let software operate the collar through documented,
   open interfaces. Add farm context and useful movement recommendations.
3. **Farmer-approved planning.** Present proposed moves for explicit approval.
4. **Optional scheduled automation.** Plan moves in advance, show a countdown,
   and let the farmer intervene before execution.
5. **Research-farm validation.** As resources permit, operate a working sheep farm
   to test the technology and economics. This may overlap with development; it
   is not a funded or scheduled acquisition.
6. **Broader and more adaptive grazing.** Eventually support more frequent moves,
   additional livestock, and coordinated ruminant/poultry systems.

Sheep are the initial agricultural focus; cattle follow. Poultry movement would
involve other hardware such as mobile coops rather than assuming collars suit
every species. The founder referenced Pasturebird as an inspiration, not a
partner. The long-term vision includes sheep, cattle, goats, chickens, quail,
and turkeys in appropriate configurations on shared pasture. Do not promise
support for these species today or impose an unagreed detailed release order.

## 6. Product: collar and components

The ambition is to build excellent, inexpensive, easily repairable collars with
excellent integrations. Claims such as "best" or "cheapest on the market" are
competitive aspirations, not supported present-tense copy.

Intended approach:

- Begin with readily available, off-the-shelf components where practical.
- Publish information that lets farmers build collars themselves.
- Eventually sell assembled collars, assembly kits, and individual components.
- Welcome other providers assembling and selling collars from the designs.
- Support replaceable batteries and repairability as far as the design permits.
- Develop custom components, such as a PCB, if needed.
- Prefer reusable and swappable components while practical; a more integrated
  design may eventually make engineering or economic sense.
- Preserve the open software integration layer even if physical integration
  increases.
- Allow owners to use their own software and, where technically supported, their
  own SIM/connectivity provider.

The enduring commitment is ownership and integration choice. Do not promise a
specific connector, modem, Linux/Android architecture, battery, radio, cellular
coverage, or bill of materials before it is established. Android/Linux were
analogies for openness, not settled firmware decisions.

## 7. Product: farm intelligence

The intelligence layer is an agent harness: the instructions, farm context,
memory/state, tools, and triggers around a capable model that make it useful for
farm management. Explain its job in everyday language on the public homepage.

Intended inputs include:

- Farm and paddock context, management goals, and grazing knowledge.
- Collar telemetry and animal observations.
- Satellite and other external pasture telemetry.
- Farmer field notes and photographs.
- External information retrieved through integrations.

Users should be able to bring their choice of LLM. Open Pasture does not intend
to build a foundation model or its own satellites. It expects to use outside
providers. No foundation-lab partnership is established by this interview.

Firecrawl is a likely context-retrieval integration. Describe it as planned until
implemented and verified. It is not automatically a source of satellite imagery
or a substitute for direct sensor and imagery integrations. Do not imply that
web retrieval alone can establish actual pasture conditions.

### Intended farmer experience

The founder likes the focused product experience of fitness trackers such as
WHOOP: an accessible summary, relevant metrics, and a clear next action. This is
a product-design reference, not an endorsement of mandatory hardware/software
bundling or an instruction to copy that company's visual identity.

The application should eventually answer:

1. How is the farm doing?
2. Where and when is the next planned animal move?
3. What needs the farmer's attention?

Farmers can begin by explicitly approving every move. The preferred eventual
automatic mode plans ahead (midnight was an illustrative planning time), based
on current conditions. It shows a live countdown until the proposed move, with
a minimum notice period so the farmer knows what to expect. The notice duration
is not yet defined.

During the countdown, the farmer can:

- Hold the animals where they are / cancel the move.
- Choose a preset destination.
- Edit the proposed boundary.

With automation enabled, the system executes the scheduled move if the farmer
has not intervened and the applicable operating controls permit it. This is a
future interaction concept; offline behavior, validation, stale telemetry, and
other execution controls are not yet specified. Do not equate an LLM output
directly with an unconditional physical action.

The agent may also ask the farmer to visit a particular paddock or animal, take
photos, or provide field notes. These tasks collect missing context. Describe
the farmer as contributing judgment and observations rather than publicly
reducing them to a "sensor."

Much later, the system may plan several moves per day as conditions justify,
balancing feeding and pasture recovery. Three to five moves per day were an
example of possible future behavior, not a recommendation or fixed target.

Learning over time and improved pasture outcomes are intended capabilities to
develop and measure, not existing results.

## 8. Openness and commercial intent

**Open Pasture is intended to be a for-profit endeavor.**

The founder is comfortable with all of these scenarios:

- A farmer builds 100 collars for their own flock.
- A local shop assembles the design and sells collars to farmers.
- A large company manufactures thousands from the design under its own brand,
  with proper attribution.

Earlier in the interview he considered commercial restrictions, but explicitly
accepted these scenarios later. Do not reinstate revenue thresholds or a
requirement that every user buy hardware from Open Pasture.

He wants protection against misappropriation and a viable business, but accepts
commercial competition. No license can be represented as guaranteeing that a
competitor cannot undercut the business.

Intended sources of revenue:

- Individual components and repair parts.
- Kits and assembled collars.
- Optional farm-intelligence software subscriptions.
- Potential bundles that subsidize hardware through software commitments.

Bundles and subscriptions are acceptable. The distinction is that collars remain
openly integrable with other software. The bet is to earn customers through the
best complete solution, even when they can choose other suppliers for its parts.

Owners should be able to operate the collar through their own or third-party
software without subscribing to Open Pasture's intelligence product. That does
not promise free cellular service, inference, imagery, hosting, or universal
feature parity between hosted and self-managed offerings.

### Licensing status

No new license was selected in this interview. Hardware designs, firmware,
application software, documentation, and brand assets may require separate
decisions. The existing agent kit was described in repo guidance as AGPL-3.0;
verify its actual license before publication. This web repository is closed.
Do not relicense anything as part of the website rebuild.

Apache was initially mentioned with a mistaken expectation of commercial fees
above a threshold. Apache permits commercial use without that threshold; the
founder subsequently accepted commercial manufacture by others. Reference:
[Apache licensing FAQ](https://www.apache.org/foundation/license-faq.html).

Tesla was cited as inspiration for others learning from shared implementation.
It is not a selected legal model, evidence of a particular patent grant, or a
reason to claim this project has published open-source hardware already.

Until licenses and publication status are established, explain planned freedoms
concretely. Avoid blanket statements that all designs and software are already
open source, public domain, or available without conditions.

## 9. Research farm and economic proof

If resources allow, the founder wants to purchase a farm and a small breeding
flock, probably Katahdin or Dorper sheep. Neither breed is a final commitment.

The farm would be a working business that lives out the thesis:

- Use collars and progressively more intelligent movement management.
- Improve the land while raising animals.
- Sell breeding stock and meat animals, and packaged meat directly to local
  consumers.
- Measure labor savings, production, land outcomes, and economics.
- Reduce costs through operating efficiencies while testing whether the approach
  can support a profitable farm and faster scaling.

**Long-term retail ambition:** pasture-raised meat priced within $1 per pound of
the cheapest like-for-like grocery option: lamb against lamb, chicken against
chicken, beef against beef. This is not lamb against the cheapest meat of any
species. It is not an achieved result, forecast, or guaranteed price.

Before using that target as an empirical comparison, define geography, date,
cut/product, processing and packaging basis, promotions, and the cost/profit
accounting. The interview did not establish these measurement details.

The long-term farm could coordinate ruminants and poultry on the same land.
Automated poultry movement extends the thesis beyond collars.

## 10. Community, support, and publishing

Current website priorities:

1. Build interest and a community of people following the work.
2. Attract hardware and software engineers who can help implement it.
3. Allow voluntary support for components, development, and AI usage.

The founder welcomes contributions and, when repositories are ready, pull
requests. He wants genuine implementation help and can manage the project.
Do not imply open maintainer roles, contribution workflows, or public collar
repositories are already established.

He is comfortable with financial support, donated equipment/components, or AI
credits if handled transparently. No payment provider, recipient structure,
sponsorship tier, rewards, or tax treatment has been selected. Present support
for a for-profit build accurately; do not describe it as a charitable deduction,
investment, preorder, or product entitlement.

Potential funding could accelerate collar development and a research farm, but
the site should not foreground an active raise or imply he is leaving Firecrawl.

Updates will primarily be personal LinkedIn and X posts, with occasional
technical write-ups. Open Pasture should provide a home for those updates and
links to his personal profiles. No publication cadence was promised.
