# Plan: the remaining work, in two tracks, cut for subagents (v4, 2026-10-16 evening)

**Track A — Graphics and the 3D mode** (Parts G11, G16, G12) and **Track B — Story and
content** (Tasks B-R1 … B-H), then **Part Z, the independent full review**, which is the last
brief to run. Each part is one brief you can hand to a Claude Code session on its own: it names
a model, says why, and has a prompt ready to paste. This version follows the second review of
the repo on 2026-10-16 (then 167 commits and 377 tests; on 2026-10-18 `npm test` runs over 500,
so read the count from its output rather than from here; lint clean, the content checker at
`problems: 0`); the done work is listed first so nothing is briefed twice.

## Review: what is complete

| Area | Done | Evidence |
| --- | --- | --- |
| **v1 game** (M0–M5) | Scaffold, low-res pipeline, Grove, sprites, Keeper, eggs, needs, stats, grades, critters, essences, alignment, evolution with 15 forms, Sun and Moon Groves, life cycle with rebirth and departure, Eternals, Expedition, shop, races, personality, roster, hats, PWA, sound, reduced motion, debug panel; deployed at `https://diablomaster8.github.io/TryThisGame/` | archive M3–M5, "Acceptance checks" |
| **Post-v1 systems** | Campaign "Hazel's Grove", the twenty improvements, the ten recommendations, Learning Grove mode, settings and interactions, score, 540p render, three creature families, ten Keepers, organic painted Grove, 96-unit field, Digimon-inspired ten, the Hollow Below, three save slots per mode | archive 2026-10-12/13/15 |
| **Species format** | SDF rig with poses, expressions, anchored faces, baked AO, painted look, grounding, two-segment legs on every biped and Mossling, pet and sleep and breathing, eyes that look, digits and tufts, crisp marks, species notes, the Keeper, the Nubbin variant catalogue, the "Chao World" line-up match, stride field, lids and tucked legs fixed | Parts G1–G8, G8b, G13; `docs/species-format.md` |
| **Full-3D mode** | Graphics setting (Pixel / Full 3D); `src/render3d/` behind the same WorldView: terrain, sky, water, garden, buildings, crowd, Hollow floors, toys, weather, bursts, camera shake, picking, every species and tint, worker sculpting with a geometry cache and device grid, textures and terrain and grass in workers, programs compiled ahead, loading bar, lazy campaign and side-story chunks, the AAA stage split out; pet behaviour state, tumble on throw, shoreline stop and wading, dressed neighbour Groves, depth-tested hearts and Zzz; parity pass: reaction bubbles, portrait field of view, memorial flowers, smooth canvas scaling, item rules, event bursts, tree-crown fade | Parts G9, G10, G13, G14, G15; the two parity sections in PROGRESS.md |
| **Story content pack** | In `src/content/` with checker, script book, voice-over builder; campaign v2, S1–S31, Q1–Q95, Neopia, Multiverse, Atlas A1–A31, Arcade PA1–PA5, readers, results, Learning Grove bands for the campaign, S1–S31 and three fun packs, Hebrew and Japanese questlines, the fix pass. Scripted is not the same as shipped: the row below says what the game loads (`src/content/index.ts` is imported only by the checker and tests) | Task B0; `docs/content-index.md` |
| **Engine CV1–CV6** | CV1 campaign v2 wired (endings, holds, line swaps, variants, S27 buy-back) with the runner now driving all 31 side stories, the fun quests (Q1–Q65 then; Q66–Q95 since 2026-10-18) from their `when` texts, story props in both renderers, keepsake rewards and the journal's Memories; CV2 the Learning Grove language switch with glossary words; CV3 Hebrew and Japanese in the Learning Grove (fonts, bidi, tracing, word book, audio hooks); CV4/CV5 Atlas, Arcade and Multiverse saves with read-only lookups (the saves only: until 2026-10-18 the cabinet was empty and no Multiverse or Neopia script was in the build); CV6's Mature content setting with audience filter and rift confirmation; one-time story gifts in place of once-a-day rewards (canon 22/34), and since 2026-10-18 the request board and team missions are one-time too, while Today's Hollow is only a daily floor layout with no reward tied to it (review B, Bug 3); a finished scene no longer replays | Tasks B-C1…C7 |
| **Story worlds that ship** (2026-10-18) | What the built game loads: the Atlas A1–A31; Pixel's cabinet PA1–PA5; the Multiverse rift (nine lines and E1–E6, Mature content 18+ only, the one-time age check, E1/E6 branches, E6's reflection); Neopia's rainbow gate (the plots and six quest lines, rival faerie chains); each a lazy chunk with its own side save, rewards kept there, never in the Grove; fun quests Q66–Q95 in the Grove's fun-quest engine with their in-pack payoffs and the chapter 9–11 gate | `tests/sim/story-worlds.test.ts`, `dist/assets/{arcade,multiverse,neopia}-catalogue-*.js` |
| **Old bugs** | B1 (understudy names) fixed by CV1; B2 debug panel guarded behind `?debug` in production; B3 one panel at a time on phones with toasts in their own row | Task B-B23, `docs/device-pass.md` |

**Atlas A1–A10 and A22–A31** (scripted 2026-10-16) are reviewed in fix mode, committed and
shipped in the Atlas since 2026-10-18 (PROGRESS.md status; `docs/content-index.md`). Task B-R1
is done.

**Commit trailers:** CLAUDE.md and `docs/brief.md` forbid a `Co-Authored-By` line or any other
attribution trailer (Maor, 2026-10-16); no prompt here asks for one.

## Review: what is open

- **Track A.** The device pass has never run: no bench flag, no Playwright, no phone or
  Firefox or Safari numbers (`docs/device-pass.md` holds only the manual notes for B2 and
  B3). The Full 3D parity gaps (Part G16) closed on 2026-10-16, with the renderer brief in
  `docs/renderer-decision.md`.
- **Track B.** Lines LB and LK; Learning Grove
  versions of Q66–Q95; Learning Grove versions of S24–S31 and of every `all` Atlas and
  Arcade page; quote verification; adviser packets; the canon audit. Stubs left by the
  engine passes: voice clips (every clip is the placeholder), the LJ2 vertical writing
  option, sim checks the journal's "Do it" stands in for, no gesture animation for word
  reactions.
- **Waiting on Maor** (2026-10-18): the LB/LK points (LK8's tiger, LK's Malay and Indonesian
  word checks, LB's two Neds, LB's "inspired by Bluey" credit; `docs/progress-archive.md`,
  "Pixel's Arcade PA1–PA5"). Decided 2026-10-18: original sung verses written for the game
  (the Lantern Song, Nova's ditties, Q47's tunnel song) are fine, since only lyrics from
  existing songs are banned; Holy Grail's Q1–Q7 are one storyline and keep all ten quotes, an
  exception to the three-quote cap. The expansion pick is done:
  Maor picked all of E1–E3 and SL1–SL4, built 2026-10-17 (plan G12).
  Decided 2026-10-17: Expedition and races get 3D versions in Full 3D. "The phone view passes"
  was premature: review B (2026-10-18) measured 36 px buttons and a top-right menu at 375 px
  (its Bug 16). Online pieces (`docs/multiplayer-plan.md`) stay out of scope.

## How to use this file

1. Start a fresh Claude Code session in the repo root for each part and paste its prompt into
   the main session. Where a prompt says to start N subagents with a model, the main session
   does that; where it says "milestone", the session plans first and waits for your approval.
2. Every brief opens with context rules so the session stays near 50k tokens: CLAUDE.md
   (short), the Status block of PROGRESS.md, the one doc the part needs, and grep plus
   line-range reads instead of whole files. The full brief is `docs/brief.md`, older history
   `docs/progress-archive.md`, and the two giant content outlines
   (`docs/grove-backlog-prompt.md`, `docs/more-stories.md`) are never read whole. **Part Z is
   the one exception:** it is told to read none of those first, on purpose.
3. Parts marked **independent** can run at the same time in separate worktrees; the others name
   what they wait for. Two writers never share files. The running order at the end says what
   can overlap across the two tracks.
4. A scripting subagent uses roughly 250k–400k tokens of its own, so a 10-subagent wave is
   about 3–4M. If a usage limit cuts a wave short, re-run the same prompt and tell it which ids
   are already done.

## Which model for which part

| Model | Use it for | Why |
| --- | --- | --- |
| **Fable 5.1** | Anything judged by eye or held whole in one mind: the independent full review (Part Z), the whole-canon audit (B-V3), the expansion (G12). | The top tier: it looks at a game, a render or a canon and finds what is wrong. The most expensive. |
| **Opus 5.5** | Engineering with a clear spec and a testable outcome (the device pass, the parity gaps) and writing at the campaign's quality bar (Atlas and Arcade scripting, Learning Grove versions, the reviews). | Strong and careful; does not need taste decisions or the whole canon at once. |
| **Sonnet 5.5** | Well-specified work from a template: wiring, fun packs, edu drafts, quote verification with the web, adviser packets, the device checklist rows. | Fast and cheap when the template exists. |
| **Haiku 5.5** | Mechanical upkeep: script-book regeneration, status tables. | Not worth more. |

Model names and prices change; check the current list before a wave. If Fable is not on your
plan, use Opus wherever this file says Fable.

## The checks

- **Track A (code):** `npm run lint`, `npm test`, `npm run build` before every push. The game
  runs at `http://localhost:5173/?free` (seeded: `?free&slot=3`) with Graphics set to Pixel or
  Full 3D; the Learning Grove at `?edu=4&slot=3`; the creature stage at
  `?aaa=1&creature=all&pose=idle`, single creatures with
  `&creature=1..5&closeup&pose=idle|happy|walk|eat|sleep|pet&turn=<degrees>`, variants with
  `&creature=variants&family=<f>` and `&toon`. The hidden browser pane pauses
  `requestAnimationFrame`, so drive frames with `grove.frame()` when measuring.
- **Track B (content):** the three content checks (`npx tsc --noEmit -p .`,
  `npx eslint src/content tests/tools`, `npx tsx tests/tools/content-check.ts --warnings` with
  `problems: 0`), plus the Track A gate for anything that touches `src/sim/` or `src/ui/`.

Common tail for every brief (already inside each prompt): run the checks; log the pass at line
12 of `PROGRESS.md` (keep it under 150 lines, moving the oldest section to the archive); put
screenshots in `docs/samples/` named by pass; commit with an imperative title; push to `main`;
report with the screenshot or log names and anything left out.

---

# Track A — Graphics and the 3D mode

Done: G1–G10, G8b, G13 (the 3D polish stubs), G14 (bundle diet and grass in a worker), G15
(the parity pass and its first fixes), G16 (the remaining parity gaps and the renderer brief,
2026-10-16). Left: the device pass and the expansions when Maor picks.

| Part | Task | Model | After | Size |
| --- | --- | --- | --- | --- |
| G11 | Device pass: phones, Firefox and Safari, workers, both renderers | Opus, then Sonnet rows | none | one day plus Maor's phones |
| G16 | Full 3D parity: the remaining gaps and the renderer brief (done 2026-10-16) | Opus | none | 12–17 h |
| G12 | Expansions E1–E3 and campaigns SL1–SL4 | Fable | done 2026-10-17 (X0–X7) | large |

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
Run npm run lint, npm test, npm run build. Log at line 12 of PROGRESS.md. Commit, push to main. Report the bench numbers per browser and the rows left for Maor.
```

## Part G16 — Full 3D parity: the remaining gaps

**Model:** Opus. **Independent.** The event bursts and the crown fade from the parity list are done; the twelve rows below were what was left, one commit each; each checked in the browser pane on
`?free&slot=3` with Graphics set to Full 3D at 375x812 against the same view in Pixel.
**Done 2026-10-16**, all twelve (commits in the PROGRESS.md section "Full 3D parity gaps, plan
Part G16"; shots `docs/samples/parity2-*.jpg`). The last row stays Maor's.

| # | Gap a player notices | Where | Size |
| --- | --- | --- | --- |
| ✓ G16.1 | Entering the Hollow Below stalls 3.3 s the first time: its four lamps recompile every material. Compile asynchronously behind a fade on the stairs | `render3d/hollow.ts` (lamps), `grove-3d-scene.ts` (`compileScene`) | 1.5–2 h |
| ✓ G16.2 | Only Nubbins and items get the tap highlight; the pixel view also rings lanterns, trees, buildings, decor, plants, NPCs, wild ones, strays, memorials, stairs, chests and loot | `render3d/actors.ts` (highlight ring); pixel `SpriteBatch.highlight` | 1–2 h |
| ✓ G16.3 | The story Hollow and Corvin's garden are a plain floor and a colour in 3D | pixel `buildHollow`, `buildCorvin` in `render/grove-scene.ts`; `grove-3d-scene.ts` location sets | 3–4 h |
| ✓ G16.4 | Hollow Below dressing: no Keeper lamp, loot as generic shapes, no "?" over an unfed wild one (the Grove's wild visitor too) | `render3d/hollow.ts`, `crowd.ts`; pixel `render/paint/dungeon.ts`, `drawCave` | 1.5–2 h |
| ✓ G16.5 | Village square stalls (`townUnlocks`) and the path fence posts are missing | pixel `render/world-view.ts`; `render3d/props.ts` | 1–1.5 h |
| ✓ G16.6 | No merged glow, no cocoon fade, every fruit the same orange sphere | pixel `world-view.ts` (`isMerged`, cocoon opacity, fruit flavour frames); `render3d/actors.ts` | 1–1.5 h |
| ✓ G16.7 | Weather ignores intensity and reduced motion; no daytime leaves, no fireflies in the story Hollow, no rain or snow grade | pixel `world-view.ts` particles, `game.ts` `updateDaylight`; `grove-3d-scene.ts` rain | 1 h |
| ✓ G16.8 | A trunk can still hide a Keeper standing right behind it | `render3d/crowns.ts` | 30–60 min |
| ✓ G16.9 | The dressed visit gardens build trees without the crown fade | `render3d/visit.ts` | 30 min |
| ✓ G16.10 | Both modes: the race screen in portrait starts with runners and names clipped at the left edge | `ui/races.ts`, the race screen | 30–60 min |
| ✓ G16.11 | Story scenes, the away screen and the photo panel leave the 3D render running behind them (battery on phones) | `game.renderPaused` callers in `src/ui/` | 15–30 min |
| ✓ G16.12 | `docs/renderer-decision.md`: the one-page brief for Maor on Full 3D as the default (evidence from G15 and G16, risks: phones, bundle, workers; recommendation) | new doc | 30 min |
| ✓ G17 | Expedition and races in 3D inside Full 3D (`render3d/minigame-stage.ts`, `expedition-3d.ts`, `race-3d.ts`; the screens split into flow and view, Pixel unchanged); PROGRESS "G17" | done 2026-10-17 | — |

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24).

Context rules: read CLAUDE.md and the Status block of PROGRESS.md, then the two parity sections of PROGRESS.md ("Pixel vs Full 3D parity pass" and "Full 3D: event bursts and tree crowns"). Never read a source file over 400 lines whole; grep for the names in plan.md Part G16's table.

Task: close the Full 3D parity gaps in plan.md Part G16, G16.1 to G16.11 in table order, one commit each, each matching the pixel view on the same seeded save (`?free&slot=3`, Graphics Full 3D, 375x812; the hidden browser pane pauses rAF, so drive `grove.frame()` by hand). Keep 3D work inside src/render3d/; the sim never learns which renderer is on. Stop and list what is left if an item runs past twice its estimate. Then write G16.12, docs/renderer-decision.md. The checkout is shared: build each commit from HEAD in a scratch `git checkout-index` export and stage and commit in one command. Screenshots in docs/samples/parity2-<item>.jpg. Run lint, test, build; log at line 12 of PROGRESS.md and tick the items off in Part G16; commit; push. Report what closed, what is left, and the recommendation in one paragraph.
```

## Part G12 — Expansions and campaigns (done 2026-10-17, X0–X7; see PROGRESS.md and the archive)

**Model:** Fable 5.1. **Blocked** until Maor picks from E1–E3 and S1–S4 in PROGRESS.md.

```
You are working in the Grove repo at C:\Users\God\Downloads\Test Des\Test Des. Read CLAUDE.md and the Digimon-inspired list in PROGRESS.md (expansions E1–E3, campaigns SL1–SL4). Maor has picked [PICK]. Before writing code, give a short plan with the sim changes (new types, commands, events, save migration), the UI, the render needs in both modes, and the tests, then build it in milestone-sized commits with the usual checks and a PROGRESS.md section per milestone. Commit; push. Report.

Context rules: keep your context small. Read CLAUDE.md and the Status block at the top of PROGRESS.md, then only the doc this brief names. Never read a source file over 400 lines whole: grep for the function or field named here and read that line range (the "Where things are" table in CLAUDE.md maps names to files). Do not open creatures-legacy.ts or docs/progress-archive.md. Aim for under 50k tokens of context before your first edit.
```

---


---


---


---

# Track B — Story and content (Hazel's Grove)

The content pack lives in `src/content/` with its checker (`tests/tools/content-check.ts`),
the script book (`script-book/`) and the voice-over builder (`voiceover/`). Rules, in order of
authority: `docs/canon.md` → `src/content/STORY-BIBLE.md` → the "Story and content" section of
CLAUDE.md and `docs/brief.md` → `STYLE.md` and `EDU-STYLE.md`. The engine side (CV1–CV6) is
built; what remains is writing, review and verification.

**The three content checks** (all must pass after every content task):

```
npx tsc --noEmit -p .
npx eslint src/content tests/tools
npx tsx tests/tools/content-check.ts --warnings    # must print "problems": 0
```

**Context rules for this track.** `docs/grove-backlog-prompt.md` (700 KB) and
`docs/more-stories.md` (470 KB) are never read whole: grep for the id and read that range.
**After every scripting task, run B-W (wiring), then B-R (review).** Do not start the next wave
until B-R reports 0 must-fix items.

## Where the content stands (2026-10-16 evening)

- **Scripted, wired, checked, committed and running in the game:** campaign v2; S1–S31; Q1–Q65;
  Neopia; the Multiverse; readers and results; Atlas A11–A21; Learning Grove versions of the
  campaign, S1–S22 and the Python, Bean and Avatar quests; the Hebrew and Japanese questlines.
- **Scripted and wired, uncommitted, unreviewed:** Atlas A1–A10 and A22–A31. Task B-R1 first.
- **Outlined, not scripted:** Arcade PA1–PA5, lines LB and LK, fun packs Q66–Q95.
- **Not written:** Learning Grove versions of S24–S31 and of the new `all` Atlas and Arcade
  pages; quote verification; adviser packets; the canon audit; native-speaker recordings.
- **Open decisions for Maor:** none (the seven fun-quest quotes approved as written, advisers signed off, 2026-10-17).

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
| B-H | Housekeeping (script book, content index, PROGRESS status) | Haiku | anytime | small |

---

## Task B-R1. Review and commit the twenty Atlas pages

**Model:** Opus. **Independent.** Twenty scripted pages sit uncommitted in the working tree
with their logs; the wiring is in place and the checker passes.

```text
Content task, not a milestone. Context rules: read CLAUDE.md ("Story and content"), docs/canon.md and docs/briefs/review.md; then only the twenty files listed and their logs in docs/logs/script-a*.md. Do not read docs/more-stories.md or docs/atlas.md whole; grep an id when you need its outline.

First, `git status`: confirm the uncommitted set is src/content/atlas-a01.ts … atlas-a10.ts and atlas-a22.ts … atlas-a31.ts, their docs/logs entries, and the wiring edits to src/content/index.ts, tests/tools/content-check.ts, docs/content-index.md and script-book/. If anything else is modified, stop and report it before touching it.

Then start two subagents with model "opus", one per wave, each following docs/briefs/review.md in "fix" mode: batch "wave-L" (A1–A10) and batch "wave-M" (A22–A31). When both finish, run the three content checks, regenerate the script book (npx tsx tests/tools/script-book.ts script-book), and commit the whole set in two commits (one per wave). Push to main. Update docs/content-index.md's status and the Status block of PROGRESS.md (keep it under 150 lines). Report the counts, the "For Maor" items and the check results.
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
| PA1 The Chao Altar (Sonic Adventure) | arcade-pa1.ts | ARCADE_PA1 | all | It reads cinder. At most 2 quotes (Tikal's prayer), each with childLines, marked for checking against the English script. Sega licence approved and audience all (Maor, 2026-10-17); Learning Grove versions edu-pa1-sprout.ts and edu-pa1-reader.ts. |
| PA2 The Clone Island (Pokémon: The First Movie) | arcade-pa2.ts | ARCADE_PA2 | all | It reads s7Done (Byte watches). At most 3 quotes. |
| PA3 The Hollow Kingdom (Hollow Knight) | arcade-pa3.ts | ARCADE_PA3 | all | 12 grubs. At most 3 quotes. |
| PA4 Mercy (Undertale) | arcade-pa4.ts | ARCADE_PA4 | all | Sparing everyone is the only path; the kill-everyone route doesn't exist. It reads wisp. At most 3 quotes. |
| PA5 The Hundred-Year Sleep (Breath of the Wild) | arcade-pa5.ts | ARCADE_PA5 | all | The thirteenth memory plays only if you hunted every memory. At most 3 quotes. |
| LB1–LB12 Play (inspired by Bluey) | lines-lb.ts | LINE_LB | all | The Larkins family; Bluey's characters may be used (licence approved (Maor, 2026-10-17)). Write the main quests AND both Learning Grove bands, following docs/briefs/edu-new.md for the edu part: lesson-first, using the approved standards in EDU-STYLE.md. |
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


---

# Running order across both tracks

The tracks touch different files and run side by side: Track A in `src/render3d/`, `src/ui/`
(race screen, render pause) and the device docs; Track B in `src/content/`, `tests/tools/`
and `docs/`. Give every parallel session its own worktree and merge in this order. Part Z runs
last, alone, on a clean `main` with everything else merged.

1. **Now, in parallel:** B-R1 (Opus) · G11 (Opus) · G16 (Opus) · B-E1 (Opus ×8) · B-V1
   (Sonnet, web).
2. **Content waves:** B-S5a + B-S5b → B-W → B-R; then B-E2 in batches of ten → B-W → B-R.
   B-V2 once scripting is done; B-V3 once scripting and edu are done.
3. **Close-outs:** B-H after each content batch; Maor's phone rows in `docs/device-pass.md`;
   Maor's renderer decision from G16.12.
4. **Part Z, the independent full review**, once 1–3 have landed. Its findings become plan v5.
5. **G12** is done: Maor picked all of E1–E3 and S1–S4, and they were built on 2026-10-17.

## What Maor decides

- Decided 2026-10-17: the seven fun-quest quotes stand as written; Pixel stays the default,
  Full 3D stays a setting; Expedition and races get 3D versions inside Full 3D; the wave
  reports' quote and audience items are fine; the phone view passes (review B, 2026-10-18,
  found it does not yet: 36 px buttons at 375 px, its Bug 16).
- The expansion pick: E1 The Square, E2 Nova's Season, E3 The Twine; campaigns SL1 "The
  Hundred Days", SL2 "Logged In", SL3 "The Beetle Road", SL4 "Dawn & Dusk".
- Native-speaker recordings for the language questlines (`public/audio/lang/README.md`).

---

# Part Z — The independent full review

**Model:** Fable 5.1 as the main reviewer, with Opus 5.5 subagents allowed for the deep
reads it delegates. **After:** everything above has merged. **Size:** one to two days.

**Why this brief is different.** Every other brief here hands the session our context so it
can work fast. This one withholds it on purpose. The reviewer gets the goals and nothing else,
so it judges the game as a player and the code as a stranger would, and finds what the people
who built it have stopped seeing. It reads the project's own notes only at the end, to report
where the notes and the product disagree. It changes nothing; the findings become the next
plan.

```
You are reviewing a browser game. The repository is at C:\Users\God\Downloads\Test Des\Test Des (Git Bash, fnm Node 24; `npm install`, `npm run dev -- --port 5173`, `npm test`, `npm run build`). The deployed build is https://diablomaster8.github.io/TryThisGame/.

Rules for this review:
- Do NOT open CLAUDE.md, PROGRESS.md, plan.md, anything under docs/ or docs/logs/, script-book/, or any commit message until step 5. They would anchor you. If a tool shows you one, do not read past its title.
- You are not here to fix anything. Report only. Do not edit files other than your report.
- Judge against the goals below and against what a careful player and a careful engineer would expect. Nothing else counts as a requirement.

The goals, in full:
1. An original virtual-pet garden game that runs in phone and desktop browsers as a static site with no server. You hatch a creature (a "Nubbin"), raise it, shape how it grows, race it, and it ages and is either reborn or gently departs. Cosy and kid-friendly; no death imagery.
2. Depth like the classic 3D-platformer pet gardens: stats, grades, critters and essences that shape type and parts, alignment that shapes form, personality from how it was treated, rebirth that keeps a little, a rare immortal form that must never happen by accident.
3. Two graphics modes chosen by the player, a 2.5D pixel-art mode and a full 3D mode, with the same game, content, controls and feedback in both.
4. Looks: the Nubbins are recognisable fan art of Sega's Chao in every variant, plus two more creature families drawn in code; the 3D creatures aim at the finish of a modern creature-collector game. Every IP licence is approved (Maor, 2026-10-17): official names, art, music and sound may be used in full.
5. Performance: 60 fps on a mid-range 2022 phone with 8 creatures, 30 fps as the floor; fast loads; works in portrait and landscape with every control reachable by one thumb; tap targets at least 44 px; colour is never the only signal; reduced motion is respected; sound starts muted; no console errors in normal play.
6. Saves: autosave, three slots per mode, survive reload exactly, export and import, keep working when storage is blocked; time passes while the game is closed according to a player setting (unlimited, capped hours, or off), with a "while you were away" summary, and departures while away only if the player allowed them.
7. Story: a campaign ("Hazel's Grove", twelve chapters, several endings) with side stories that can change it, optional fun quests, and separate story worlds (an Atlas of world tales, an Arcade, a Multiverse, a retro pet world) that read the garden's state but never change it. Audience ratings: content for everyone, for the main game only, for 13+ and for 18+, the last two behind a parental "Mature content" setting that is off by default. No repeatable chores, no daily or timed rewards; every reward is one-time or unlimited.
8. A Learning Grove mode for children aged 3–6 (read aloud) and 7–10 with a lesson in every scene and no quotes from the originals, plus beginner Hebrew and Japanese questlines with correct script rendering and tracing.
9. Writing: plain, warm, specific, dry humour; every line short enough for a phone; choices that pay off; quotations from copyrighted sources at most three sentences per storyline; public-domain text quoted only when verified; no song lyrics.
10. Engineering: TypeScript strict, a simulation that never touches the DOM or the renderer, seeded randomness, fixed-step time with one clock, tests for the rules, lint and build clean, small and readable modules.

Do this, in order, and keep notes as you go:
1. Play as a new player, twice: once in each graphics mode, on a desktop window and on a 375x812 phone-sized window, at least 45 minutes each at raised speed (there is a debug panel on `?debug`; use its time controls). Hatch, raise, feed, pet, race, run an Expedition, let one creature reach the end of its life, visit every screen, switch Keepers, enter the dungeon, start the campaign and play two chapters, open the Learning Grove in both bands, try the Hebrew or Japanese questline, change every setting, export and import a save, block storage (DevTools) and reload. Note every bug with exact steps, every moment of confusion, every control you could not reach with one thumb, every frame hitch you felt, and every place the two modes differ.
2. Read the code as a stranger: structure, the boundary between simulation and rendering, randomness and time handling, save versioning and migrations, the worker and cache code, error handling, accessibility in the UI code, bundle sizes from `npm run build`, test coverage and what the tests do not cover. Run the tests and the lint. Delegate deep reads to Opus subagents by folder if you like; they follow the same rules.
3. Read a sample of the story content: two campaign chapters, three side stories, two fun quests, two Atlas pages, one Learning Grove scene in each band, the Hebrew and Japanese scripts. Judge tone, length, kid safety, quoting rules, and whether choices matter.
4. Check the asset record: every imported file comes from Maor's licensed sources (all IP licences approved (Maor, 2026-10-17)), and no lyrics from existing songs appear anywhere (original sung verses are fine, Maor, 2026-10-18).
5. Only now read CLAUDE.md, PROGRESS.md, plan.md and docs/. List every place where what they claim differs from what you found, and every open item they do not know about.

Write docs/review-independent-2026-10-XX.md (today's date) with these sections: a one-paragraph verdict; Bugs (each with steps, expected, actual, severity: blocker, major, minor); Missing against the goals (goal number, what is missing, evidence); Risks (performance, IP, kid safety, data loss); Improvements ranked by value against cost, with a one-line recommendation each; What the notes get wrong; and What surprised you for the better. Keep each entry short and concrete. Do not fix anything. Commit only the report, push, and give me the verdict paragraph and the top ten findings.
```
