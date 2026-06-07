# Jane Stark — SMM & Operations Agents

Working notes from the design conversation. Not committed to the repo by
default — move/commit as you see fit.

## North star

Jane focuses on value creation (services themselves: kirtans,
constellations, voice, painting, poetry). A small team of AI agents
runs the operations layer: listener growth, event booking, sales
pipeline, and secondary comms. Each agent reconfirms with Jane in its
early phase; trust + autonomy grow as track record accumulates.

## The four agents

| # | Agent | Codename | Goal | KPI |
|---|---|---|---|---|
| 1 | Spotify Growth | **Reach** | Grow monthly listeners | Monthly listeners + saves-per-stream ratio |
| 2 | Kirtan Booking | **Gather** | Fill Jane's calendar at preferred rate | Events booked, $/event, lead time |
| 3 | Constellations Sales | **Hold** | Sustain 6-week cohort fill + steady 1:1 bookings | Cohort fill %, LTV per participant |
| 4 | Personal Assistant | **Voice** | Keep secondary comms moving; no participant falls through cracks | Median response time, % drafts approved unedited |

Each agent has: skills, scheduled loop, self-improvement loop, approval
gates (relax over time), and a per-agent **playbook** (markdown doc
agents propose edits to, Jane approves, behavior updates).

### Agent 1 — Reach (Spotify Growth)

**Standard channels.** Independent curator pitches (SubmitHub, Groover,
direct DM), Spotify for Artists editorial pitches (7+ days pre-release),
pre-save campaigns, collaborator outreach, UTM-tagged off-platform
links so we can see which channel converts to saves.

**B2B venue play** (added in conversation). Music played on loop for
captive audiences = full-track listens, repeated exposure, context-perfect
discovery. Legitimate via Soundtrack Your Brand or Spotify for Business
(plays count + royalties flow). Venues to target:

- Yoga studios (heated / gentle / restorative / yin), pilates studios
- Sound-bath / gong-bath venues, floatation tanks, sauna lounges
- Massage therapists, acupuncture / energy-work / reiki clinics
- Vegetarian / vegan / Ayurvedic restaurants, tea houses, cacao ceremonies
- Spas and boutique wellness hotels with curated property playlists
- Doula / midwife / birth-center playlists (birthing music is underexplored)
- Hospice and palliative care (deeply receptive, humanly meaningful)
- Meditation / mindfulness centers, conscious-dance / 5Rhythms / ecstatic dance

**Cross-agent synergy:** every venue **Gather** contacts becomes a
warm intro for **Reach** ("would you play this playlist between
events?"). One outreach, two payoffs.

**Self-improvement.** Subscribed RSS (Music Ally, Hypebot, Spotify for
Artists blog). Quarterly study of 5 peer-artist releases. Per-pitch
outcome tracking so framings update over time.

**Real talk.** Slowest agent to show results (months, not weeks).
Strictly legitimate channels — no bot streams, no fake-playlist services
(Spotify bans).

### Agent 2 — Gather (Kirtan Booking)

**Skills.** Venue CRM (yoga studios, retreat centers, festivals,
meditation centers, sound-bath communities). Tailored cold pitches with
EPK (bio, photos, video, testimonials, technical rider, rate). Calendar
holds against Google Calendar. Tour-routing-friendly date clustering.
Festival application cycles (Sep–Dec deadlines for following year).

**Post-event ops.** Trigger testimonial / photo / video collection;
hand assets to Reach + future SMM pipeline.

**Real talk.** Most likely first-90-days revenue lift. Cold outreach to
yoga studios with personal voice + good EPK converts ~3–8% to booked
event.

### Agent 3 — Hold (Constellations Sales)

**Skills.** Lead capture from every channel (website, IG DMs, Telegram,
Facebook, referrals). Qualification script (what they want, urgency,
prior experience). Discovery-call scheduling. Pre-call brief to Jane
(~3-line context card). Post-call sequencing (1:1 link / group page /
"not now" stay-in-touch). Cohort fill management. Onboarding
sequences. Referral + testimonial harvesting at completion.

**Self-improvement.** Logs every discovery-call objection + how Jane
handled it; objection-handling playbook rewrites itself over time.

**Real talk.** Sales conversations carry Jane's voice more than any
other agent. Most conservative voice-fidelity policy — lean toward
"drafts for Jane, she sends in 30 seconds" rather than autonomous.

### Agent 4 — Voice (Personal Assistant, Telegram bot)

**Skills.** Triage inbound on Telegram: known contact / stranger; topic
detection (logistics / support / sales inquiry / fan mail / urgent /
weird). Routing rules:

- **Strangers** → polite ack + FAQ + offer call if relevant
- **Active participants** → context-aware response from cohort history
- **Past participants** → warm, route to referral flow if relevant
- **Urgent / personal / unclear** → escalate to Jane with brief

Plus: proactive reminders to cohort, kirtan attendee countdown, weekly
"stalled threads" sweep with drafts for Jane to approve.

**Self-improvement.** Learns Jane's voice from 30–50 seed past
replies; logs every edit Jane makes pre-send and updates the playbook.

**Real talk.** Voice fidelity is the bottleneck. Plan for 4–6 weeks of
"every draft reviewed" before any category relaxes. High-stakes
threads (emotional support, money, scheduling commitments) stay human
indefinitely.

## Shared backbone

**Jane Brain** — single source of truth, queryable by every agent:

- Identity: bio (3 lengths), voice samples, brand kit
- Services: each offering with description, real price, FAQ, "won't do" list
- People (CRM): past + current participants, leads, venue contacts, curators
- Calendar: Google Calendar (read access for agents)
- Assets: indexed, not migrated — manifest of where things live
- Playbooks: one per agent, version controlled
- Decisions log: "decided once, don't re-decide" rules

**Approval inbox** — one Telegram channel where all agents post
requests with Approve / Edit / Reject buttons. Bot retries once after
24 h, drops with a flag if no response in 48 h.

**Learning log** — one per agent: weekly "I tried X, got Y, recommend
Z". Jane reviews monthly. Cross-agent opportunities posted to a shared
channel.

## Stack decisions made

| Decision | Choice | Notes |
|---|---|---|
| Publisher | **Publer** | Covers all 6 of Jane's channels (2× IG, FB, TikTok, YouTube, Telegram); API access on paid Business tier |
| VK | **Not covered by Publer** | Separate tool needed if VK becomes important (SMMplanner / Postoplan / direct VK API) |
| Per-platform media reshape | **Pipeline-side** | Publer's API does not auto-reshape; we ship pre-cut variants. 50–80 line ffmpeg wrapper. |
| CRM | **Notion (proposed)** | Decision pending — see open questions |
| Calendar | **Google Calendar** | Already in use |
| Asset library | **Index, don't migrate** | Stays wherever it lives today |
| Build target | **Claude Agent SDK + custom tools** | LLM + tools + memory + cron scheduler |

## Phasing (agreed)

1. **Weeks 1–2 — Jane Brain (data layer).** *Paused as of this doc.*
2. **Weeks 3–4 — Voice (Personal Assistant).** Immediate hours-back-to-Jane payoff; voice-fidelity work seeds future agents.
3. **Weeks 5–8 — Gather (Kirtan Booking).** Highest near-term revenue lift.
4. **Weeks 9–12 — Hold (Constellations Sales).** Reuses voice work from Phase 2.
5. **Month 4+ — Reach (Spotify Growth).** Slowest-to-payoff, lowest-stakes if it underperforms.

## Current status

- **Conceptual design complete.** Four agents scoped, shared backbone
  defined, stack picked, phasing agreed, B2B venue insight folded in.
- **Phase 1 (Jane Brain) not yet started.** Two questions need answers
  before scaffolding begins (below).
- **No code written.** No Notion workspace created. No accounts opened.
- **Paused** at user's request — context switching back to nebo.music
  landing improvements.

## Open questions (resolve before resuming)

1. **CRM tool — Notion, Airtable, or Google Sheets?**
   Recommendation: Notion. Lower friction, one tool for notes + DB +
   docs, official API. Move to Airtable later only if pipelines outgrow
   it (~200 active rows in a single table).
2. **Asset geography — where does her content live today?**
   Need 2–3 sentences on photos, audio masters, video clips,
   testimonials. We don't migrate; we just build a manifest. Need this
   precise enough to structure the manifest.
3. **Tooling budget.** Rough order: Publer ~$20–60/mo, Notion free or
   $10/mo, Canva Pro $13/mo, optional services $0–50/mo. Total
   ~$50–150/mo all-in once running.
4. **Who's actually building this.** User (Jane's husband, technically
   capable) presumably with Claude in the loop. Confirm before kicking
   off.
5. **Jane's time budget per week** for the early "every draft reviewed"
   phases. Approval loop only works if Jane processes the inbox daily
   for the first ~90 days.

## Immediate steps when resuming

1. Answer the two open questions (CRM + asset geography).
2. I generate paste-ready markdown for the Notion workspace: pages,
   database schemas, voice-samples collection template,
   services-doc template, decisions-log starter.
3. Block 2–3 hours of Jane's focused conversation time, spread across
   2 weeks, for the "tell me what you actually do" interviews.
4. Inventory existing assets — build the manifest.
5. Collect 30–50 voice samples (Jane forwards real past replies).
6. Document services, bio, FAQ, testimonials.
7. Connect Google Calendar (read access).
8. **Then proceed to Phase 2 — Voice (Personal Assistant).**

## Honest caveats to remember

- "Self-sufficient" is the north star but realistically 90 days of daily
  human review before any agent runs unattended. Plan for that as a
  feature, not a failure.
- Voice fidelity is the hardest problem, especially for Hold and Voice.
- Every platform integration is a maintenance liability. Budget ~1 hour
  per integration per month for "the platform broke / changed".
- TikTok and Instagram have a real (variable-magnitude) native-vs-API
  reach penalty. Mitigation: API publish everything routine; native
  upload for launch-day Reels.
- Pricing changes, public statements, contracts, refunds: always Jane,
  forever. These don't relax.

## Loose ideas worth keeping (not promised)

- After Phase 5, an "Album Producer Agent" that handles the full release
  cycle: pre-save campaign, editorial pitch, content pipeline trigger,
  curator pitch, B2B venue notification ("new album live, here's the
  playlist URL"), post-launch analytics.
- A "Retreat Operations Agent" — once a kirtan/constellation retreat is
  booked, an agent handles participant comms, payment, dietary forms,
  travel coordination, post-event testimonial collection.
- A "Newsletter Agent" — Jane has implied she sends "letters from Jane"
  when there's something to say. Could be drafted by an agent with
  monthly review.
