# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-21)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content in `src/content/` (scripted is not shipped: `src/content/index.ts` is
read only by the checker and tests). What the game loads: campaign v2 and endings, all 31 side
stories, fun quests Q1–Q95, props and keepsakes, the Learning Grove switch, Hebrew and
Japanese, the four separate campaigns and E1–E3, Mature content, one-time gifts, and four
story worlds, each a lazy chunk with its own side save that never writes the Grove: Nova's
atlas (A1–A31), Pixel's cabinet (PA1–PA5, since 2026-10-18), the Multiverse rift (18+ only,
since 2026-10-18) and Neopia's rainbow gate (since 2026-10-18). Content: edu done wherever
audience and outline allow (none for Q66–Q95; they read their childLines); fix-mode reviews done
for Atlas A1–A10 and A22–A31 and every Atlas and S24–S31 edu version, the rest canon-audited
only (`docs/content-index.md`). Plan v4 (`plan.md`): G11 device pass, Track B writing and review
tasks; Part Z ran on 2026-10-18 (`docs/review-independent-2026-10-18.md`) and its fixes are
going in pass by pass. Review B (`docs/review-independent-2026-10-18-b.md`): Bugs 1–17 and
18–38 fixed on 2026-10-18 (both in the archive). Review C
(`docs/review-independent-2026-10-18-c.md`): major items 1–10 and minor items 11–29 fixed (both in the archive).
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`. Maor, 2026-10-18: Full 3D is the flagship for the AAA art push (the
default renderer is not changed; passes 1 and 2 are on `main`, deployed since 2026-10-19). Review D
(`docs/review-independent-2026-10-21.md`): fixed 2026-10-21 except bugs 2–3 (share-code Eternals,
accepted by Maor). Maor, 2026-10-21: daily refreshes and free daily gifts are allowed; only
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below).

## Campaign graphics 3 leftovers (cg5, 2026-10-23)

The known bugs left by K1–K50 (02d0c86), fixed on branch `fix/cg5-leftovers` (worktree
`wt-cg5`). Before and after frames: `docs/samples/cg5-*.jpg` (`-before` is origin/main at
02d0c86 unless the name says `cg4`, the review round's frame).

**What works**

- **Hundred ch9 (3D):** package k's rubble (`k-fold-ruin-*`) has its own material, hooked as
  house-only, so a hidden house takes its red tiles and loose boards, flat ones included
  (`dress-k.ts`, `dress-a.ts` `HOUSE_ONLY`). The plinth tops stay, as before.
- **Guard house (3D):** the counter is desk height in Full 3D (`interiors.ts`, the lamp's
  `y3d`), so Hob reads seated on his stool. The phone room was already right at 02d0c86
  (c4's "keep interior cameras on the open side"); the after frames confirm it.
- **Logged In:** on a phone a skinned box frames a full-length portrait head and shoulders
  (`CG4_U4.box.phoneCrop`), and the terminal puts a lit panel behind it, so the Warden shows a
  face. The cut "Please" line was the typewriter caught mid-line; the full line fits.
- **Logged In ch1 pixel perf (profiled):** 60 fps at 4× throttle in headless Edge (worst second
  59, no frame over 50 ms). The top cost was `safeRect()` forcing a layout every call (6% of
  frame time); it now keeps its answer for 150 ms (`stage-api.ts`).
- **Hazel ch10 phone `-1`:** a line naming a big prop never narrows the frame to the prop
  alone: the last tier keeps the nearest person with the prop's middle (`fitTiers`,
  `STAGE4.subjectRim`; test `tests/render/stage-fit-subject.test.ts`), and the 3D phone
  push-in is skipped for that tier (`fit-shot.ts`).
- **Keepsake inspector:** flat keepsakes (the letter) turn only to 86% in the pixel card and
  flip to their back on the 3D Turn button (`CG4_U4.inspect.flat`). The pixel card already
  opened face-on at 02d0c86; the edge-on frame in `cg4-u4-box-phone.jpg` was the 3D one.
- **Kitchen Fern:** already drawn in her story look (cap, scarf, satchel), portrait included,
  in both renderers at 02d0c86 (b4's `storyId`); checked with `c1-letter` staged in the kitchen.
- **Beetle ch3 floor (pixel):** underground the pixel fill light is warm stone
  (`DUNGEON.caveAmbient`), not the night sky's blue at 1.5×.
- **Minimap:** the Hollow bar also stays hidden while a story scene is queued
  (`html.story-queued`), not only while a line is up. **Hazel ch12 phone:** the fit keeps
  `STAGE4.phoneBoxGap` (28 px) clear above the box on a phone.

**Stubbed or approximate**

- The 3D kitchen and guard-house checks used a runtime overlay (no content scene is staged in
  the kitchen yet).
- Hazel ch12 phone looks the same: the festival ring is too wide to fit, and the well and
  reeds (scenery, not cast) still reach the box's top edge.

**Known bugs**

- In Hazel ch10 `-1` on a phone the person kept is small in 3D (pushed-in framing would lose
  the pond).
- The plinth tops of hidden Fold houses stay as paving (by design since K2).

## Campaign graphics 3, items K1–K50 (2026-10-22)

Built from `docs/campaign-graphics-recommendations-2026-10-22-b.md` the same way as the second
pass: wave 0 (`f4`, Opus), seven packages in parallel (a1 poses and rig, c4 interiors and places
on Opus; a2 motion, b4 people, d4 sky and weather, e4 world detail, u4 story UI on Sonnet), a
content wave, shots and perf, two review rounds with one fix round. Branches `cg4/foundation`,
`cg4/pkg-{a1,a2,b4,c4,d4,e4,u4}` and `cg4/content` merged in `cg4/merge`. Rules and API:
`cg4-rules.md`, `cg4-api.md` (session folder). Shots: `docs/samples/cg4-*.jpg`; golden set
`docs/samples/golden/` with `tests/tools/story-shots.cjs` and `story-shots-diff.cjs` (K50).

**What works**

- **Staging (f4):** focus weights in the fit (people first, large props kept at 60%, a phone 3D
  figure never under ~40 px, a line naming a prop makes it that line's subject); shot/reverse on
  two-speaker exchanges; `grave` letterbox scenes (30); the stage inspector in `?debug`; the shot
  test over every staged scene at desktop and phone (`tests/render/story-shots.test.ts`); new
  fields `from`, `partner`, `inside-<id>`, `tale`, `grave`, `moon`, `Line.gesture`.
- **Acting (a1, a2):** sit and kneel for Keepers and Nubbins (Moss sits upright, the Keeper beside
  him), heads turn to the speaker (crowd at half), five gestures (122 lines carry one), hand and
  neck pivots for carried props, the item-get pose; walk-ons with footprints by ground type; the
  partner beside the Keeper reacting by mood.
- **People (b4):** Fern's story look (cap, scarf, satchel) in both renderers; mood portraits; tale
  grade with young Hazel (c4-tale scenes); older Hazel from ch11; speaker rim and ring in 3D;
  separate-campaign departures at their memorial spots.
- **Places (c4):** hidden buildings drop their shadows and taps; five interiors (kitchen, guard
  house, Corvin's house, crest house, Fold house); the Beetle Road's below chapters on real Hollow
  floors with a story seed (save-safe, sim test), cast kept clear of floor props.
- **Sky and weather (d4):** the Hush walks with a fog band; depth of field on close/over shots
  focused on the speaker (off on phones); light shafts (3D only), cloud shadows, moon by chapter,
  snow building through the vigil (roof caps too), path wear, puddles, one wind uniform.
- **World detail (e4):** window figures, lantern streaks on water, crop plot by season, four lantern
  heads, rising lanterns, seasonal cottage decor, birds and moths, gate frost, the Logged In boot.
- **Story UI (u4):** keepsake inspector, a box skin per campaign, readable boards, the chapter
  photo with its grade, journal thumbnails, title-card silhouettes, the campaign map, the ending
  gallery.
- **Perf** (Full 3D, 390×844, 4× throttle, mean of two runs, before → after): Hazel ch10 60.1 →
  59.0, ch11 56.7 → 56.6, ch12 56.7 → 56.8, Hundred ch9 44.1 → 55.8, Logged ch7 39.3 → 56.2,
  Logged ch4 48.9 → 43.8 (run spread ≥8), Beetle ch3 48.6 → 56.3, Beetle ch1 50.1 → 48.9, Dawn ch1
  44.1 → 56.7; pixel Beetle ch3 and Hazel ch12 unchanged. Desktop Hazel ch12 3D 57 fps in the
  final shots.

**Stubbed or approximate**

- Fern's gate lines are not split out of `c1-letter` into a kitchen scene (needs the sim and the
  edu versions to change); no Corvin's-house or crest-house scene exists to stage.
- Pixel has no light shafts; coat tails don't read the wind (no coat geometry).
- The photo offer state lives in localStorage (UI convenience), photos in IndexedDB.
- The board's final words are still a placeholder.

**Known bugs (after the second review round)**

- Fixed or checked in the cg5 pass above (Hundred ch9 debris, guard house, Logged In box and
  perf, Hazel ch10 and ch12 on phone, keepsake inspector, kitchen Fern, Beetle ch3 grade, minimap).
- Test suite: several sim/story-world tests time out under full-suite load and pass alone; watch
  the CI runner.
- No real-phone pass yet.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

