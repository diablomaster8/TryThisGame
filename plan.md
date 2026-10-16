# Plan: the remaining work, in two tracks, cut for subagents (v3, 2026-10-16)

**Track A — Graphics and the 3D mode** (Parts G11–G15) and **Track B — Story and content**
(Tasks B-R1, B-S5a…B-H). Each part is one brief you can hand to a Claude Code session on its
own: it names a model, says why, and has a prompt ready to paste. This version follows a
review of everything in the repo on 2026-10-16 (134 commits, 255 tests passing, the content
checker at `problems: 0`); the done work is listed first so nothing is briefed twice.

## Review: what is complete

| Area | Done | Evidence |
| --- | --- | --- |
| **v1 game** (M0–M5) | Scaffold, low-res pipeline, Grove, sprites, Keeper, eggs, needs, stats, grades, critters, essences, alignment, evolution with 15 forms, Sun and Moon Groves, life cycle with rebirth and departure, Eternals, Expedition, shop, races, personality, roster, hats, PWA, sound, reduced motion, debug panel; deployed on GitHub Pages | archive sections M3–M5, "Acceptance checks" |
| **Post-v1 content and systems** | Campaign "Hazel's Grove", the twenty improvements, the ten recommendations, Learning Grove (educational mode), settings and interactions, score, 540p render, three creature families (Chao-faithful Nubbins, pocket line, digital line), ten Keepers | archive 2026-10-12/13 |
| **Environment** | Organic painted Grove (buildings, hills, waterfall, lanterns, decor, collision), 96-unit field, smooth camera, tap and hover feedback | archive 2026-10-13 |
| **Digimon-inspired ten** | Village square, care slips, gym, partners and merge, curfew, rebirth memories, Keeper skills, scan and convert, guard teams, Beetle Run | commit 132e098, c02c6b0 |
| **The Hollow Below** | Procedural dungeons with party, loot, strays, chest, stairs, daily seed | commit e175cbc |
| **Save slots** | Three per mode, title Continue/New/Erase | commit 7176612 |
| **3D direction** | Five style samples, five console-era samples, the AAA stage (sky, terrain, grass, water, post), sculpted SDF creatures, five hand-built creatures | `?style3d`, `?retro3d`, `?aaa` |
| **Species format** | SDF rig with poses, expressions, anchored faces, baked AO, painted look, grounding, knee joints and planted feet, pet and sleep and breathing, eyes that look, digits and tufts, crisp marks, species notes, the Keeper, the Nubbin variant catalogue (all Chao forms, jewel facets, special forms), the "Chao World" line-up match, stride field | Parts G1–G8, G8b; `docs/species-format.md` |
| **Full-3D mode** | Graphics setting (Pixel / Full 3D), `src/render3d/` behind the same WorldView: terrain, sky, water, garden, buildings, crowd, Hollow floors, toys, weather, bursts, camera shake, picking, every species and tint, worker sculpting with a geometry cache and device grid, textures painted in workers, programs compiled ahead, terrain sampled in a worker, loading bar | Parts G9, G10, "3D boot" passes |
| **Story content pack** | Moved into `src/content/` with checker, script book and voice-over builder; campaign v2 (12 chapters, 8 endings), S1–S31, Q1–Q65, Neopia, Multiverse, readers, results, Learning Grove bands for the campaign, S1–S22 and three fun packs, Hebrew and Japanese questlines, Atlas A11–A21; fix pass of 241 items | Task B0; `docs/content-index.md` |
| **Engine CV1** | Campaign v2 wired with its sim changes, ending order from the bible, chapter holds, line swaps, variant selection, S27 buy-back, the side-story runner for S5, S9, S10, S27 and S28, journal "Do it", save migration, 25 tests; side stories as a lazy chunk (main bundle 2.0 → 1.3 MB) | Task B-C1; commits 00437ac, 4490787 |

**Scripted, wired, not yet reviewed or committed (in the working tree on 2026-10-16):** Atlas
A1–A10 and A22–A31 (twenty files, logs in `docs/logs/script-a*.md`, index and checker updated,
`problems: 0`). Task B-R1 reviews and commits them.

## Review: what is open

- **Track A.** The device pass (phones, Firefox and Safari module workers, the no-worker
  fallbacks) has never run. Grass placement still runs on the page at boot. The 3D stubs:
  no `pet` command in the sim (the pose exists only on the stage); a neighbour's Grove in
  `location:visit` is a bare floor; knees for the Nubbin, Mossling and Wisp; Fennel's lids do
  not cover its eyes asleep; Bolder's folded legs fan up; hearts and Zzz sprites are not
  occluded; a thrown Nubbin does not tumble; the Keeper walks through the pond. The main
  bundle is 1.3 MB with the v2 campaign script synchronous (another 175 kB could lazy-load).
  Whether Full 3D becomes the default is Maor's call.
- **Track B.** Review of the twenty Atlas pages; the Arcade PA1–PA5, lines LB and LK, fun packs
  Q66–Q95; Learning Grove versions of S24–S31 and of every `all` Atlas and Arcade page; quote
  verification, adviser packets, the canon audit; engine CV2–CV6 plus the rest of CV1's scope
  (the other 26 side stories run, places, props, items and rewards for them, `s28-null-minder`,
  S27's spring scene, Wisp's stray after `c10-bank-wisp`, voice clips); the Mature content
  setting; the no-chores clean-up. Known bugs B2 (debug panel in production, verify) and B3
  (panel overlaps) from 2026-10-13 are unchecked; B1 is fixed by CV1.
- **Waiting on Maor:** the pick from expansions E1–E3 and campaigns S1–S4; the daily-gift
  decision for B-C7; the seven fun-quest quotes; whether Full 3D is the default; his own
  device pass. Online pieces (logins, cloud save, visiting; `docs/multiplayer-plan.md`) stay
  out of scope until he says otherwise.

## How to use this file

1. Start a fresh Claude Code session in the repo root for each part and paste its prompt into
   the main session. Where a prompt says to start N subagents with a model, the main session
   does that; where it says "milestone", the session plans first and waits for your approval.
2. Every brief opens with context rules so the session stays near 50k tokens: CLAUDE.md
   (short), the Status block of PROGRESS.md, the one doc the part needs, and grep plus
   line-range reads instead of whole files. The full brief is `docs/brief.md`, older history
   `docs/progress-archive.md`, and the two giant content outlines
   (`docs/grove-backlog-prompt.md`, `docs/more-stories.md`) are never read whole.
3. Parts marked **independent** can run at the same time in separate worktrees; the others name
   what they wait for. Two writers never share files. The running order at the end says what
   can overlap across the two tracks.
4. A scripting subagent uses roughly 250k–400k tokens of its own, so a 10-subagent wave is
   about 3–4M. If a usage limit cuts a wave short, re-run the same prompt and tell it which ids
   are already done.

## Which model for which part

| Model | Use it for | Why |
| --- | --- | --- |
| **Fable 5.1** | Anything judged by eye or held whole in one mind: the 3D polish against the references, the renderer-default decision brief, the whole-canon audit (B-V3). | The top tier: it looks at a render or a canon and changes the right thing. The most expensive. |
| **Opus 5.5** | Engineering with a clear spec and a testable outcome (the device pass fixes, the bundle diet, engine milestones B-C2…C6) and writing at the campaign's quality bar (Atlas and Arcade scripting, Learning Grove versions, the reviews). | Strong and careful; does not need taste decisions or the whole canon at once. |
| **Sonnet 5.5** | Well-specified work from a template: wiring, docs, tests, fun packs, edu drafts, quote verification with the web, the device checklist rows. | Fast and cheap when the template exists. |
| **Haiku 5.5** | Mechanical upkeep: script-book regeneration, status tables, moving screenshots. | Not worth more. |

Model names and prices change; check the current list before a wave. If Fable is not on your
plan, use Opus wherever this file says Fable.

## The checks

- **Track A (code):** `npm run lint`, `npm test`, `npm run build` before every push. The 3D
  game runs at `http://localhost:5173/?free` with Graphics set to Full 3D (or `?free&slot=3`
  seeded); the creature stage is `?aaa=1&creature=all&pose=idle`, single creatures with
  `&creature=1..5&closeup&pose=idle|happy|walk|eat|sleep|pet&turn=<degrees>`, variants with
  `&creature=variants&family=<f>` and `&toon`.
- **Track B (content):** the three content checks (`npx tsc --noEmit -p .`,
  `npx eslint src/content tests/tools`, `npx tsx tests/tools/content-check.ts --warnings` with
  `problems: 0`), plus the Track A gate for anything that touches `src/sim/` or `src/ui/`.

Common tail for every brief (already inside each prompt): run the checks; log the pass at line
12 of `PROGRESS.md` (keep it under 150 lines, moving the oldest section to the archive); put
screenshots in `docs/samples/` named by pass; commit with an imperative title and the line
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`; push to `main`; report with the
screenshot or log names and anything left out.

---

# Track A — Graphics and the 3D mode

Done: G1 grounding, G2 knees, G3 petting and sleep, G4 eyes that look, G5 shape pass, G6 crisp
marks and format doc, G7 the Keeper, G8 the variant catalogue, G8b the "Chao World" line-up
match, G9 the real 3D mode, G10 worker sculpting and the geometry cache, plus the two 3D boot
passes. Left: the device pass, the 3D polish backlog, the bundle diet, the renderer decision,
and the expansions when Maor picks.

| Part | Task | Model | After | Size |
| --- | --- | --- | --- | --- |
| G11 | Device pass: phones, Firefox and Safari, workers, both renderers | Opus, then Sonnet rows | none | one day plus Maor's phones |
| G13 | 3D polish: the stub list against the references | Fable | none | one to two days |
| G14 | Bundle diet: lazy campaign script, chunking, grass placement in a worker | Opus | none | half a day |
| G15 | Pixel versus Full 3D parity audit and the default-renderer brief | Fable | G11, G13 | half a day |
| G12 | Expansions E1–E3 and campaigns S1–S4 | Fable | Maor's pick | large |

## Part G11 — Device pass across both renderers

**Model:** Opus 5.5 for the automation and the fixes it finds; Sonnet 5.5 can fill the desktop
rows. **Independent.**

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24).

Context rules: read CLAUDE.md and the Status block of PROGRESS.md, then the "Platform and accessibility" and "Acceptance checks" sections of docs/brief.md (grep for them). Never read a source file over 400 lines whole; grep for names from CLAUDE.md's "Where things are" table. Do not open creatures-legacy.ts or docs/progress-archive.md except by grep.

Task: the device pass, in both graphics modes (Pixel and Full 3D).
1. Automation first: a `?bench` flag that drives the game for 10 s with 8 Nubbins and logs average and worst frame time, first-frame time and (in Full 3D) Keeper-on-screen time to the debug panel and the console; a Playwright smoke test (tests/e2e/) that loads, hatches, pets, feeds, opens the journal, switches Graphics, and reloads, in both modes, asserting no console errors.
2. Firefox and Safari: module workers (render3d/sculpt-worker.ts, terrain-worker.ts, the texture workers, render/ground.worker.ts) and their no-worker fallbacks. Fix what breaks; the fallbacks must produce the same picture.
3. Write docs/device-pass.md: a checklist for iPhone Safari (browser and home screen), Android Chrome, desktop Chrome, Firefox and Safari, both modes: frame rate with 8 Nubbins, first load and second load times, portrait and landscape, one-thumb reach of every control, blocked storage, reduced motion, no console errors, the three save slots. Fill the desktop rows yourself with the bench numbers; leave the phone rows for Maor with exact steps and the URLs to open.
4. Fix anything the desktop rows fail, in small commits.
Run npm run lint, npm test, npm run build. Log at line 12 of PROGRESS.md. Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>", push to main. Report the bench numbers per browser and the rows left for Maor.
```

## Part G13 — 3D polish: the stub list against the references

**Model:** Fable 5.1. **Independent** (touches `src/samples/species*.ts`, `src/render3d/`, and
one sim command).

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24).

Context rules: read CLAUDE.md and the Status block of PROGRESS.md, then docs/species-format.md and docs/creature-improvements.md. Never read a source file over 400 lines whole; grep for names from CLAUDE.md's "Where things are" table. Judge every visual change by eye against the Palworld references named in CLAUDE.md and the "Chao World" line-up at docs/reference/.

Task: work down the 3D stub list, one commit each, checking each on the stage and in the Full 3D game (`?free`, Graphics = Full 3D):
1. `pet` in the sim: a `pet` command and behaviour state so the 3D (and pixel) Nubbin reaches the pet pose when the Keeper pets it, with the Keeper's hand as the lookAt point; hearts rise. The pixel mode keeps its existing petting feedback.
2. Knees for the Nubbin, Mossling and Wisp (the format's two-segment legs), folded in sleep and happy.
3. Fennel's lids cover its eyes asleep; Bolder's folded legs tuck under instead of fanning up.
4. Hearts and Zzz as depth-tested quads in world space so a body in front hides them.
5. A thrown Nubbin tumbles (one slow roll about its side axis, upright on landing); its shadow blob stays on the ground under it.
6. The Keeper stops at the shoreline or wades visibly (sim change in src/sim/behavior.ts or the Keeper mover; both modes).
7. `location:visit`: a neighbour's Grove gets a simple dressed set (ground, three trees, a fence, the neighbour's building) instead of a bare floor.
Screenshots: docs/samples/polish-<item>.jpg for each. Add any new spec field to docs/species-format.md with one species using it. Run lint, test, build; log at line 12 of PROGRESS.md; commit per item with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.
```

## Part G14 — Bundle diet and the last boot work

**Model:** Opus 5.5. **Independent.**

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24).

Context rules: read CLAUDE.md and the Status block of PROGRESS.md, then the "Side stories as a lazy chunk" section of PROGRESS.md. Never read a source file over 400 lines whole; grep for names (`loadSideStories`, `registerSideStories`, `src/content/campaign-book1..3.ts`, `config/story.ts`, `render3d/props`, `terrain-worker.ts`).

Task:
1. Lazy-load the v2 campaign script (src/content/campaign-book1..3.ts) the way the side stories are, keeping the campaign scenes available before boot finishes (fetch during the title, await before `boot`), so the main chunk drops to about 1.13 MB minified. Tests register it up front like tests/setup-side-stories.ts.
2. Chunking: the 3D renderer (src/render3d/) and the samples (src/samples/) load only when chosen; verify with `npm run build` output and list the chunk sizes before and after in PROGRESS.md.
3. Grass placement off the page: move the instanced grass placement loop in render3d (height sampling and transforms) into the terrain worker or its own worker, pouring in the instance matrices when ready; the first frame must look the same as HEAD.
Run lint, test, build; log at line 12 of PROGRESS.md with the measured sizes and boot times; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report the numbers.
```

## Part G15 — Pixel versus Full 3D parity audit and the default-renderer brief

**Model:** Fable 5.1. **After:** G11 and G13.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24).

Context rules: read CLAUDE.md and the Status block of PROGRESS.md, then docs/device-pass.md. Never read a source file over 400 lines whole; grep for names from CLAUDE.md's "Where things are" table.

Task: play the same seeded save (`?free&slot=3`) in Pixel and in Full 3D for twenty minutes each at x10 and list every difference a player would notice: things drawn in one mode and not the other (emote balls, halos, sparkles, toasts, dungeon props, race and Expedition screens, the Learning Grove and campaign scenes), picking and controls, readability on a phone-sized window (375x812), frame times from docs/device-pass.md. Fix the small gaps (under an hour each) in their own commits; list the rest with an estimate. Finish with docs/renderer-decision.md: a one-page brief for Maor on whether Full 3D should become the default, with the evidence, the risks (phones, bundle, workers) and a recommendation. Run lint, test, build; log at line 12 of PROGRESS.md; commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report the recommendation in one paragraph.
```

## Part G12 — Expansions and campaigns (waiting for Maor's pick)

**Model:** Fable 5.1. **Blocked** until Maor picks from E1–E3 and S1–S4 in PROGRESS.md.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the Digimon-inspired list in PROGRESS.md (expansions E1–E3, campaigns S1–S4). Maor has picked [PICK]. Before writing code, give a short plan with the sim changes (new types, commands, events, save migration), the UI, the render needs in both modes, and the tests, then build it in milestone-sized commits with the usual checks and a PROGRESS.md section per milestone. Commit with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push. Report.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.
```

---


---


---

# Track B — Story and content (Hazel's Grove)

The content pack lives in `src/content/` with its checker (`tests/tools/content-check.ts`),
the script book (`script-book/`) and the voice-over builder (`voiceover/`). Rules, in order of
authority: `docs/canon.md` → `src/content/STORY-BIBLE.md` → the "Story and content" section of
CLAUDE.md and `docs/brief.md` → `STYLE.md` and `EDU-STYLE.md`.

**The three content checks** (all must pass after every content task):

```
npx tsc --noEmit -p .
npx eslint src/content tests/tools
npx tsx tests/tools/content-check.ts --warnings    # must print "problems": 0
```

**Context rules for this track.** `docs/grove-backlog-prompt.md` (700 KB) and
`docs/more-stories.md` (470 KB) are never read whole: grep for the id or the "CV" heading and
read that range. **After every scripting task, run B-W (wiring), then B-R (review).** Do not
start the next wave until B-R reports 0 must-fix items. Engine tasks (B-C2…C7) are milestones:
plan first and wait for Maor's approval.

## Where the content stands (2026-10-16)

- **Scripted, wired, checked and committed:** campaign v2; S1–S31; Q1–Q65; Neopia; the
  Multiverse; readers and results; Atlas A11–A21; Learning Grove versions of the campaign,
  S1–S22 and the Python, Bean and Avatar quests; the Hebrew and Japanese questlines; the fix
  pass. Engine: CV1 (campaign v2, endings, holds, line swaps, variants, S27 buy-back, the runner
  for S5, S9, S10, S27, S28), side stories as a lazy chunk.
- **Scripted and wired, uncommitted, unreviewed:** Atlas A1–A10 and A22–A31 (`src/content/atlas-a01..a10.ts`, `atlas-a22..a31.ts`, logs in `docs/logs/`). Task B-R1 first.
- **Outlined, not scripted:** Arcade PA1–PA5, lines LB and LK, fun packs Q66–Q95
  (`docs/more-stories.md`).
- **Not in the engine yet:** CV2–CV6, the rest of CV1's scope (26 side stories that are
  registered but never chosen; places, props, items and rewards; `s28-null-minder`; S27's
  spring scene; Wisp's stray after `c10-bank-wisp`; voice clips), the Mature content setting,
  the no-chores clean-up. Bugs B2 and B3 unchecked.
- **Open decisions for Maor:** the once-a-day gifts in `sim/daily.ts` and
  `sim/neighbourhood.ts`; the seven fun-quest quotes (B-V1 reports them).

## Task list

| ID | Task | Model | After | Size |
| --- | --- | --- | --- | --- |
| B-R1 | Review and commit the twenty Atlas pages now in the working tree | Opus | none | medium |
| B-S5a | Script Arcade PA1–PA5 and lines LB, LK | Opus ×7 | B-R1 | large |
| B-S5b | Script fun packs Q66–Q95 | Sonnet ×3 | B-R1 | medium |
| B-W | Wire new files (index, checker, edu registry, script book) | Sonnet | each S/E task | small |
| B-R | Review a wave, fix mode | Opus | each W | medium |
| B-E1 | Learning Grove versions of S24–S31 | Opus ×8 | none | large |
| B-E2 | Learning Grove versions of the `all` Atlas and Arcade pages | Sonnet ×N, then Opus R | B-R1, B-S5a | large |
| B-V1 | Verify the public-domain quotes | Sonnet (web) | any | medium |
| B-V2 | Cultural-adviser review packets | Sonnet | after scripting | small |
| B-V3 | Whole-canon continuity audit | Fable | all S and E | large |
| B-C2 | Engine: audiences and the Mature content setting | Sonnet | none | small |
| B-C3 | Engine: every side story runs; fun-quest triggers; places, props, items, rewards | Opus | B-C2 | large |
| B-C4 | Engine: the Learning Grove mode (CV2) | Opus | B-C3 | large |
| B-C5 | Engine: the language questlines (CV3) | Opus | B-C4 | medium |
| B-C6 | Engine: Atlas, Arcade and Multiverse saves; cross-save reads (CV4, CV5) | Opus | B-C3 | large |
| B-C7 | Engine: no-chores clean-up | Sonnet | Maor's decision | small |
| B-B23 | Bugs B2 and B3: debug panel in production, panel overlaps | Sonnet | none | small |
| B-H | Housekeeping (script book, content index, PROGRESS status) | Haiku | anytime | small |

---

## Task B-R1. Review and commit the twenty Atlas pages

**Model:** Opus. **Independent.** Twenty scripted pages sit uncommitted in the working tree
with their logs; the wiring is in place and the checker passes.

```text
Content task, not a milestone. Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/review.md; then only the twenty files listed and their logs in docs/logs/script-a*.md. Do not read docs/more-stories.md or docs/atlas.md whole; grep an id when you need its outline.

First, `git status`: confirm the uncommitted set is src/content/atlas-a01.ts … atlas-a10.ts and atlas-a22.ts … atlas-a31.ts, their docs/logs entries, and the wiring edits to src/content/index.ts, tests/tools/content-check.ts, docs/content-index.md and script-book/. If anything else is modified, stop and report it before touching it.

Then start two subagents with model "opus", one per wave, each following docs/briefs/review.md in "fix" mode: batch "wave-L" (A1–A10) and batch "wave-M" (A22–A31). When both finish, run the three content checks, regenerate the script book (npx tsx tests/tools/script-book.ts script-book), and commit the whole set in two commits (one per wave) with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>". Push to main. Update docs/content-index.md's status and the Status block of PROGRESS.md (keep it under 150 lines). Report the counts, the "For Maor" items and the check results.
```

## Task B-S5a. Script Pixel's Arcade PA1–PA5 and lines LB and LK

**Model:** Opus, 7 subagents. **After:** B-R1.

```text
This is a content task, not a milestone. Start 7 subagents in parallel, each with model "opus".
Give each one this prompt, filling in the placeholders from the table:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md, docs/briefs/script.md and, for LB and LK, docs/briefs/edu-new.md and src/content/EDU-STYLE.md. Find your outline and "Pixel's Arcade (the frame)" in docs/more-stories.md by grep.
Follow docs/briefs/script.md exactly. Your line is <ID>; its outline is in docs/more-stories.md,
and Pixel's Arcade frame is under "Pixel's Arcade (the frame)". Pixel is she/her and sits at the
controls as player two. Cartridges never write Grove flags.
File: src/content/<FILE>   NAME: <NAME>   Audience: <AUD>
<EXTRAS>
---

| ID | FILE | NAME | AUD | EXTRAS |
| PA1 The Chao Altar (Sonic Adventure) | arcade-pa1.ts | ARCADE_PA1 | main | It reads cinder. At most 2 quotes (Tikal's prayer), marked for checking against the English script. Sega rights note. |
| PA2 The Clone Island (Pokémon: The First Movie) | arcade-pa2.ts | ARCADE_PA2 | all | It reads s7Done (Byte watches). At most 3 quotes. |
| PA3 The Hollow Kingdom (Hollow Knight) | arcade-pa3.ts | ARCADE_PA3 | all | 12 grubs. At most 3 quotes. |
| PA4 Mercy (Undertale) | arcade-pa4.ts | ARCADE_PA4 | all | Sparing everyone is the only path; the kill-everyone route doesn't exist. It reads wisp. At most 3 quotes. |
| PA5 The Hundred-Year Sleep (Breath of the Wild) | arcade-pa5.ts | ARCADE_PA5 | all | The thirteenth memory plays only if you hunted every memory. At most 3 quotes. |
| LB1–LB12 Play (inspired by Bluey) | lines-lb.ts | LINE_LB | all | An original family, the Larkins. Never quote Bluey or use its characters. Write the main quests AND both Learning Grove bands, following docs/briefs/edu-new.md for the edu part: lesson-first, using the approved standards in EDU-STYLE.md. |
| LK1–LK10 Mouse-Deer (Sang Kancil) | lines-lk.ts | LINE_LK | all | Shadow-puppet storytellers, one Malaysian and one Indonesian. Counting crocodiles in Malay and Indonesian is the maths centrepiece. Write the main quests AND both bands, as for LB. Malay and Indonesian cultural care. |

When all 7 have finished, report each reply and log path, then run the three checks.
```

## Task B-S5b. Script the fun packs Q66–Q95

**Model:** Sonnet, 3 subagents. **After:** B-R1.

```text
This is a content task, not a milestone. Start 3 subagents in parallel, each with model "sonnet".
Give each one this prompt, filling in the placeholders:

---
Context rules: read CLAUDE.md ("Story and content"), docs/briefs/script.md ("Fun packs") and src/content/quests-python.ts as the format model. Find your pack's outline in docs/more-stories.md by grep.
Follow docs/briefs/script.md exactly (the "Fun packs" format). Your pack is <PACK>; its outline is in
docs/more-stories.md. Each Q is one Quest with 1–3 steps, a complete scene, rewards and childLines
for every quoted line. The trigger is never daily and "never during Chapters 9–11". Packs never
set or need any flag. Public-domain quotes: only the ones the outline marks as verified, word for word.
File: src/content/<FILE>   NAME: <NAME>
---

| PACK | FILE | NAME |
| Q66–Q75 Down the Rabbit-Hole (Alice) | quests-alice.ts | QUESTS_ALICE |
| Q76–Q85 The Hound of the Grove (Sherlock Holmes) | quests-holmes.ts | QUESTS_HOLMES |
| Q86–Q95 The Hodja's Donkey (Nasreddin Hodja) | quests-hodja.ts | QUESTS_HODJA |

Rename Q5's "White Rabbit critter" if it clashes with Carroll's White Rabbit, and say so.
```

## Task B-W. Wire new files in

**Model:** Sonnet. Run after every S and E task.

```text
Content task, not a milestone. Use one subagent with model "sonnet". Context rules: read CLAUDE.md ("Story and content"); open only src/content/index.ts, src/content/edu.ts, tests/tools/content-check.ts, tests/tools/script-book.ts and the new files' export lists (grep "^export const").

Wire every new file in src/content/ that isn't yet exported from src/content/index.ts. Find them by
comparing the files with index.ts. For each one:

1. index.ts: export every exported const the file has (the main array, _VARIANTS, _FLAGS,
   _CHECKS, and any _EDU or edu arrays).
2. tests/tools/content-check.ts:
   - Add each storyline's main Quest[] to the `packs` map, with a short key (a22, pa1, alice…).
   - Add its _VARIANTS to NEW_VARIANTS.
   - Once a storyline has Learning Grove files (edu-<id>-*.ts, or LB/LK's built-in edu), add its
     pack key to `eduPacks` so coverage is enforced, and add its variants to `mainScenes`
     alongside the others.
3. src/content/edu.ts: import and add any new edu arrays to EDU_QUESTS[band], and their variants
   to EDU_VARIANTS[band].
4. tests/tools/script-book.ts: add a chapter per new storyline, numbered after the existing ones
   (atlas, arcade, fun packs, lines), and a matching edu section if it has one. Then regenerate:
   npx tsx tests/tools/script-book.ts script-book

Don't change any storyline's content. Run the three checks. If content-check reports problems,
list them grouped by file. Fix only wiring mistakes; leave content problems for Task B-R.
```

## Task B-R. Review a wave (fix mode)

**Model:** Opus.

```text
Content task, not a milestone. Use one subagent with model "opus". Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/review.md; open only the files listed. Follow docs/briefs/review.md in "fix" mode.

Batch name: <wave, e.g. wave3>. Files to review:
<list the new src/content files from the last S or E task>

When it's done, show me the counts, the "For Maor" items and the three check results.
```

## Task B-E1. Learning Grove versions of S24–S31

**Model:** Opus, 8 subagents. **Independent.** S23 is `main`, so it gets none.

```text
Content task, not a milestone. Start 8 subagents in parallel, each with model "opus". Give each one
this prompt, with <ID> = s24 … s31 and <FILE> = side-stories-s24.ts … side-stories-s31.ts:

---
Context rules: read CLAUDE.md ("Story and content"), docs/canon.md, docs/briefs/edu-new.md, src/content/EDU-STYLE.md and your script file. Find your outline in docs/more-stories.md by grep.
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE> and
its outline is in docs/more-stories.md. Watch the canon closely: pronouns, Moss speaking only from
chapter 4, Linnet in S26, and Nubbins never speaking.
---

When all 8 have finished, run Task B-W, then Task B-R in fix mode with batch name "edu-s24-s31".
```

## Task B-E2. Learning Grove versions of the `all` Atlas and Arcade pages

**Model:** Sonnet drafts, then Opus reviews (B-R). **After:** the matching S task.

```text
Content task, not a milestone. Find every Atlas or Arcade file in src/content (atlas-*.ts and
arcade-*.ts) that has audience 'all' and no edu-<id>-*.ts files yet. Start one subagent per
storyline, with model "sonnet", at most 10 at a time. Give each one this prompt:

---
Context rules: read CLAUDE.md ("Story and content"), docs/briefs/edu-new.md, src/content/EDU-STYLE.md and your script file. Find the outline's "Learning Grove version" list in docs/atlas.md or docs/more-stories.md by grep.
Follow docs/briefs/edu-new.md exactly. Your storyline is <ID>; its script is src/content/<FILE>,
and its outline (with its "Learning Grove version" list) is in docs/atlas.md or
docs/more-stories.md. Teach what the outline lists, blended into the story. Keep the cultural
care notes.
---

After each batch, run Task B-W, then Task B-R (fix mode) with model opus.
```

## Task B-V1. Verify the public-domain quotes

**Model:** Sonnet, with web access. **Independent.**

```text
Use one subagent with model "sonnet" and web access. Context rules: grep docs/atlas.md and docs/more-stories.md for "[unverified]" and "recheck" and read only those passages; never read either file whole.

In docs/atlas.md and docs/more-stories.md, find every lifted-text passage marked [unverified] or
"recheck". For each one:
1. Find the named edition on Project Gutenberg, Standard Ebooks or Wikisource.
2. Fix any wording or punctuation, and mark it verified (with the URL), or not found.

Then, in each matching script (src/content/*.ts), where a verified passage was paraphrased, you
may swap the exact text back in. Add childLines for 'all' quests, and keep each line under 160
characters (split it if needed).

Also check these seven fun-quest quotes against reliable transcripts. Report them only; don't
change them:
- "It's only wafer-thin." (Q11)
- "Teddy!" (Q21)
- "Wildcard, bitches!" (Q31)
- "I am a golden god!" (Q35)
- "Can I offer you a nice egg in this trying time?" (Q36)
- "Bird law in this country is not governed by reason." (Q38)
- "There is no Carol in HR!" (Q42)
- and the Q15 Cheese Shop line

Run the three checks. Write docs/logs/quotes.md.
```

## Task B-V2. Cultural-adviser review packets

**Model:** Sonnet. **After:** scripting.

```text
Use one subagent with model "sonnet". Context rules: read CLAUDE.md ("Story and content"); for each storyline, grep its outline's care notes rather than reading the outline files whole.

For each storyline whose outline names advisers (A2–A7, A10, A12, A17–A20, A22–A23, A27–A31, LK and
any others you find), write docs/advisers/<id>.md:
- a half-page summary of the storyline;
- every scene that touches the culture or faith, quoted with its scene id;
- the specific questions the outline's care notes raise;
- a sign-off table (reviewer, date, approved or changes).
Don't change any content.
```

## Task B-V3. Whole-canon continuity audit

**Model:** Fable (or Opus). **After:** all S and E tasks. This is the one job that needs one mind
holding the whole canon: 12 chapters, 31 side stories, 50 storylines and both bands. Expect it to
use a large context by design.

```text
Use one subagent with model "fable" (or "opus" if fable isn't available). Read CLAUDE.md ("Story and content"), docs/canon.md and src/content/STORY-BIBLE.md, then work through src/content file by file. Follow docs/briefs/review.md in "report" mode, with batch name "canon-audit", but across the whole canon.

Scope: the campaign; S1–S31; every Atlas, Arcade, fun pack and line; both Learning Grove bands.

Focus on: contradictions between storylines (names, timelines, who knows what when, flags read
and written, rewards that clash); choices that never pay off; repeated beats across storylines;
tone drift from CLAUDE.md's tone decisions.

Group your findings by storyline, and give an exact fix for each.
```

---

## Engine tasks (code)

These are milestones: plan first and wait for approval. The specs are in
`docs/grove-backlog-prompt.md` (CV1–CV6: grep the "CV" headings and read that range only) and the
bible's "Sim changes". They touch `src/sim/`, `src/ui/` and the title and settings screens, so
run them one at a time; G13 lands first because it also touches the sim's behaviour states.

### B-C2. Audiences and the Mature content setting

**Model:** Sonnet. **Independent.** Small, and it unblocks safe testing, so do it first.

```text
Milestone: content ratings. Context rules: read CLAUDE.md, docs/canon.md (items 20 and 37) and only the audience items in the CV6 section of docs/grove-backlog-prompt.md (grep "CV6" then "audience"). Give me a plan, then wait.

Scope:
- Setting: add a "Mature content" setting with the positions Off, 13+ and 18+, defaulting to Off. Save it with a migration.
- Filtering: teen quests show only at 13+ or higher, and adult quests only at 18+; main, teen and adult quests never show in the Learning Grove; fun quests never trigger during chapters 9–11.
- Rift confirmation: a one-time confirmation before the Multiverse rift opens.

Add tests. npm test and npm run build must pass. Commit with the Co-Authored-By line.
```

### B-C3. Every side story runs; fun-quest triggers; places, props, items and rewards

**Model:** Opus. **After:** B-C2. CV1 built the runner for five stories; this finishes the
scope: the other 26 stories, the fun-quest triggers, and the things the stories point at.

```text
Milestone: side stories, complete. Context rules: read CLAUDE.md, docs/canon.md, the "CV1" section of PROGRESS.md or docs/progress-archive.md (grep "side-story runner"), the bible's side-story table (grep src/content/STORY-BIBLE.md) and the side-story items in CV6 (grep docs/grove-backlog-prompt.md for "CV6"). Grep src/sim/side-stories.ts and src/sim/story-scenes.ts for the functions you extend rather than reading them whole. Give me a plan, then wait.

Scope:
- Story windows and steps for the 26 stories the runner does not drive yet (S1–S4, S6–S8, S11–S26, S29–S31): open and close by chapter window, step gates, checks (stub any verb the sim cannot watch yet and list them; the journal's "Do it" stays as the fallback), sNDone and each story's flags; pick their _VARIANTS by flag and apply their line swaps in both Learning Grove bands.
- The campaign-side hooks those stories feed (`visitors`, `hushGarden`, `millLetter`, `cinder`, `wisp`) set where the bible says.
- The left-overs from CV1: `s28-null-minder` (needs S7), S27's spring scene, Wisp's stray spawn after `c10-bank-wisp`.
- Places, props and items the stories name (the old trowel, Hazel's lantern, the flat stone, the walled garden, and the rest from the bible's list): data in tuning and strings, drawn in both renderers (pixel painters in src/render/paint, 3D in src/render3d/garden.ts or props), picked where a step needs a tap.
- Side-story rewards delivered (items, cosmetics, memories) through the existing inventory and journal.
- Fun quests Q1–Q65 triggered by their `when` text rules with requires chains, never daily and never in chapters 9–11; they never set campaign flags.

Tests for each story's window and at least one full run per story at x100 in a Vitest driver; npm test and npm run build must pass. Commit per group of stories with "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"; push.
```

### B-B23. Bugs B2 and B3

**Model:** Sonnet. **Independent.**

```text
Milestone: two old bugs. Context rules: read CLAUDE.md and the Status block of PROGRESS.md; grep src/ui/hud.ts for the debug panel guard and src/ui for the journal, stats sheet, toasts and the Expedition counter. Give me a plan, then wait.

B2: confirm the debug panel never mounts in a production build (`npm run build && npm run preview`, open the site, press backtick and triple-tap the logo); if it does, guard it behind import.meta.env.DEV and a `?debug` flag.
B3: panel overlaps on a 375x812 portrait viewport: the Journal over the stats sheet, toasts over the HUD, the Expedition counter under the close button. Fix with a single panel stack (one open panel at a time, toasts in their own safe-area row). Check both renderers.
Add a Playwright check for each in tests/e2e/ if G11 has created that folder, otherwise a manual note in docs/device-pass.md. Lint, test, build; log at line 12 of PROGRESS.md; commit with the Co-Authored-By line; push.
```

### B-C4. The Learning Grove mode (CV2)

**Model:** Opus. **After:** B-C3.

```text
Milestone CV2. Context rules: read CLAUDE.md, src/content/EDU-STYLE.md, src/content/edu.ts and only the CV2 section of docs/grove-backlog-prompt.md (grep "CV2."). Give me a plan, then wait.

Scope: the band switch (sprout and reader); eduSceneFor in place of the original scene, still applying the original's flags; lesson UI for ask, notice and do; glossary taps; read-aloud for sprout; grown-up progress by standard; childLines swaps.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C5. The language questlines (CV3)

**Model:** Opus. **After:** B-C4.

```text
Milestone CV3. Context rules: read CLAUDE.md, src/content/lang-hebrew.ts, src/content/lang-japanese.ts and only the CV3 section of docs/grove-backlog-prompt.md (grep "CV3."). Give me a plan, then wait.

Scope: right-to-left Hebrew with niqqud; kana rendering, with a font chosen and pinned; course vocab and the word lists; audio hooks for native-speaker recordings (use placeholder clips); Learning Grove-only gating.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C6. Atlas, Arcade and Multiverse saves; cross-save reads (CV4, CV5)

**Model:** Opus. **After:** B-C3.

```text
Milestone CV4/CV5. Context rules: read CLAUDE.md, docs/canon.md (items 21, 29 and 30), src/platform/storage.ts (the save slots) and only the "How to build it (backlog item CV4)" and "(CV5)" sections of docs/grove-backlog-prompt.md by grep. Give me a plan, then wait.

Scope:
- Saves: a separate save for the Atlas (pages in any order) and for the Arcade, alongside the Multiverse slot; they must coexist with the three slots per mode in storage.ts.
- Entry points: Nova's atlas item, and Pixel's cabinet after chapter 5.
- Cross-save reads: read-only lookups such as atlasDone(id), atlasFlag(id, flag), arcadeDone(id) and longGrassLantern(), so the Grove can show keepsakes. They never write.
- E6: the Multiverse uses a reflection of your Eternal.
- Festival unlocks by sets of pages.

Tests and build must pass. Commit with the Co-Authored-By line.
```

### B-C7. The no-chores clean-up

**Model:** Sonnet. **After:** Maor decides what the daily gifts become.

```text
Milestone: no chores. Context rules: read CLAUDE.md, docs/canon.md (items 22 and 34), src/content/results.ts, src/sim/daily.ts and src/sim/neighbourhood.ts. Give me a plan, then wait.

Scope:
- Neopia freebies per src/content/results.ts: one-time or unlimited.
- sim/daily.ts and sim/neighbourhood.ts currently give "once a day" gifts. Convert them to <Maor's decision: one-time story gifts / unlimited visits with no reward timer / remove>.
- A grep for any other timer-gated reward, with a report on what you find.

Tests and build must pass. Commit with the Co-Authored-By line.
```

## Task B-H. Housekeeping

**Model:** Haiku. **Anytime.**

```text
Use one subagent with model "haiku". Context rules: read only the Status block of PROGRESS.md, docs/content-index.md and docs/logs/.
1. Regenerate the script book: npx tsx tests/tools/script-book.ts script-book
2. Update the content status (scripted / edu done / reviewed) for every storyline in docs/content-index.md, using docs/logs/ as the source, and the one-line summary in PROGRESS.md's Status block. Keep PROGRESS.md under 150 lines.
3. Run the three checks and report the results.
Don't change any content.
```

---


---

# Running order across both tracks

The tracks touch different files and run side by side: Track A in `src/samples/`, `src/render3d/`
and the device docs; Track B in `src/content/`, `tests/tools/`, `docs/` and, for the engine
tasks, `src/sim/` and `src/ui/`. Overlaps to sequence: G13 item 1 (the `pet` command) and
B-C3 both touch `src/sim/behavior.ts`, so land G13 before B-C3 starts; B-B23 and G15 both
touch `src/ui/` panels, so B-B23 first; B-C6 and any further save work share
`src/platform/storage.ts`. Give every parallel session its own worktree and merge in this order.

1. **Now, in parallel:** B-R1 (Opus) · G11 (Opus) · G13 (Fable) · G14 (Opus) · B-C2 (Sonnet) ·
   B-B23 (Sonnet) · B-E1 (Opus ×8) · B-V1 (Sonnet, web).
2. **Content waves:** B-S5a + B-S5b → B-W → B-R; then B-E2 in batches of ten → B-W → B-R.
   B-V2 once scripting is done; B-V3 once scripting and edu are done.
3. **Engine, one at a time after G13 lands:** B-C3 → B-C6 → B-C4 → B-C5 → B-C7 (once Maor
   decides the daily gifts).
4. **Graphics close-out:** G15 after G11 and G13, then Maor's renderer decision.
5. **B-H** after each content batch. **G12** when Maor picks from E1–E3 and S1–S4.

## What Maor decides

- The daily gifts (B-C7): one-time story gifts, unlimited visits with no timer, or removed.
- The seven fun-quest quotes B-V1 reports.
- Whether Full 3D becomes the default (G15's brief).
- The expansion pick: E1 The Square, E2 Nova's Season, E3 The Twine; campaigns S1 "The
  Hundred Days", S2 "Logged In", S3 "The Beetle Road", S4 "Dawn & Dusk".
- The phone rows of `docs/device-pass.md`.
