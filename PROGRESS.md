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
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below). Play review of
2026-10-24 (`docs/review-play-2026-10-24.md`, run on a stale checkout): fixed 2026-10-25 on
branch `fix/r1025-merge`, not pushed until Maor OKs (section in `docs/progress-archive.md`).

## Round 5 · Lane C FIGHT (2026-10-29, branch r5/c)

- *Plan:* finish R0248 (job on the stats sheet), R0250 (AI combos, pile-on flash), R0253
  (draw count) and R0254 (Full 3D board, new `render3d/tactics-3d.ts`, instanced tiles,
  disposed on exit); then R0258–R0283 in order, skipping R0256, R0257's Hollow hand-off, R0260,
  R0269, R0271, R0275, R0276, R0281, R0282 (other lanes). Sim items go to helpers with their
  own files; shared files get self-contained blocks only. No save bump.
- *Works:* Full 3D tactics board (`render3d/tactics-3d.ts` on a `MiniStage`: instanced tiles per
  kind, one overlay set, pool rigs through the Grove's `CreatureLod`; 56 draws, 216k tris at
  375×812; memory flat over 10 bouts), job on the stats sheet, AI "Together!" combos, pile-on
  jostle, 8 grid-only charged moves (line4, scatter3, landing; Keeper+ AI steps out), the
  Keeper's untargetable piece (Snack toss, Cheer, Whistle; in the rumble room). Turn mode:
  shared move content lint and `tests/tools/battle-table.ts`, bout points by move used, one-time
  rewards (`world.battleOnce`, `battleSpoils`), seeded quips (en/he/ja), real rival species,
  doubles, timing flag (sweet/plain/steady), balance harness, Command mode (ATB, obedience,
  gags, hidden-tab pause), pre-bout sheet (party, mode, Gentle/Normal/Spicy), Settings → Bouts
  with Skip (`autoResolve`), inspect card and seen matchups, aria-live log, Steady hands,
  keyboard play, Debug → Battle (replay paste).
- *Stubbed:* Pixel board still 1 + units `drawImage` a frame (R0253 wants ≤3 WebGL draws);
  champion-pack prefixes and rumble chest; doubles stage draws one combatant a side; bout lean
  not read by `decidePersonality` (lane A); move cards not in the Collection book (lane E).
- *Known bugs / assumptions:* a Command-mode replay stamps orders at send time but they apply on
  the next step, so exactness isn't guaranteed (turn bouts are exact). The 60-point cap is per
  stat per bout. First-win hats reuse shop hats. Snack toss uses 3 packed snacks, not the
  inventory. Balance: Champion runs 30 bouts (2,000 doesn't fit 3 s); Sprout's median is ~32
  turns, so it isn't asserted. Stalemate guard skips encounters (Hollow replays unchanged).
  `battle-screen.ts` is ~1,075 lines (split next). No axe-core installed, so no axe run.
  Lane B hand-over: side-session note `r5-lane-c-handover.md`.

## Round 5 · Lane A FUN (2026-10-29, branch r5/a)

Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver: `node r5a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`. R0317 (lane E) and R0326 (lane B) skipped.

- *Works:* the opening's stuck gate is played (hold, push, sticks once, gives) and the cup
  sets `c1-cup-turned`, which adds a line to c12-close (R0304, `Line.act`, `ui/line-act.ts`);
  no fun quest before chapter 2's closing (R0306); slip toasts say what helps, with a minute's
  warning in a new save (R0307); sprout toasts icon-first, no mechanics, read aloud (R0308,
  `ui/fun-toasts.ts` wraps the toaster); `content-check --comedy` and book 1's 74 gags tagged
  (R0309); sound words read with their sounds, a bubbly face, ~70% of non-grave campaign and
  S1–S22 sprout scenes covered (R0310); pet toasts in three physical lines per band (R0311);
  one hatch card with Pet (R0312); Fern's cairn by the signpost in both modes, one stone a
  chapter, tappable, finale line (R0313); Byte's stopwatches on the race card (R0314); 25 joke
  badges, titles in `config/strings-badges.ts`, Silly filter (R0315); a seeded away diary,
  three headlines then "+N more" (R0316); 60 gated tips on the veil and stage loaders (R0318);
  chip caps in the checker, chapter 1–2 how-to steps tick live (R0319); sprout wrong replies
  open with a silly picture, checker warning (R0320); sprout peekaboo under Play (R0321); tap
  squeak toy (R0322); Say it! on 21 refrains (R0323); Keeper routines, three stations a story
  day with lines and prop icons (R0296); 90 chatter exchanges for 15 pairs (R0297); R0294's
  verb map covers every check, with balance, hunt and catch playable from the Atlas and Journal.
- *Stubbed:* R0294's escort, climb, puzzle, survive and explore games (the button stays) and
  the Skip-this setting; R0296's prop sprites (soot face, guilty sapling: the bubble icon is
  the gag for now); R0313's Journal Friends line and side-story callback; R0316's 30 s
  highlight of changed Nubbins; R0321's shy-Nubbin peekaboo idles; R0310 outside campaign and
  S1–S22 (17.7% of all sprout scenes); R0318's Atlas loader; R0322's crown spin is a dizzy face.
- *Known bugs:* none found. Timing tests (full life, nav, 8 Nubbins) fail under a loaded
  machine; alone see the round's report. `TEN_TEXT.slipToast` in `strings.ts` is now unused.
- *Assumptions:* routines and chatter state is not saved (read from the clock, kept beside the
  world); joke-badge counts in optional `world.funCounts` (no save bump); the cup and gate
  flags live in campaign flags; R0311 leaves lane E's per-personality lines (R0298) as the
  main band's success toasts once merged; NPC wandering now draws fewer dice (routine trips
  skip the wander pick), so seeded replays differ from before but stay deterministic.

## Round 4 · Lane D (2026-10-29, branch r4/d)

Plan: phone perf first (the three spots over budget), then WORLD in R order; skip R0085,
R0086, R0088 (lane A's keeper/behavior) and R0102 (save.ts).

- **Works:** far trees drawn in three shared batches (`render3d/far-trees.ts`) and memorial
  flowers baked to three draws: phone draw calls under budget at 19/19 (westHill 169→137, farOrchard
  198→162, cornerSE 183→141 calls). After merging main (lanes A, B, C, E): 18/19 under,
  farOrchard 178–191 calls across runs; phone impostor redraws halved, beacon beam single-sided. R0072 the outer ring's five places, 34 pieces plus 6
  north-wood trees in both views from `config/outer-ring.ts`, each with a tappable piece.
  R0073 survey zoom (index −1, 8 ppu, 23.5 u across a portrait phone, 3D at 26 u; "Zoom out
  when running"). R0099 the Learning Grove's fenced 40×40 play area, fence and Home button.
  R0100 the objective beacon, edge arrow, compass tick and minimap star (`sim/beacon.ts`).
  R0101 fun quests offered only in their region (`sim/quest-areas.ts`). R0106 the bar tucks
  while walking on phones. Probe: `PROBE_BREAKDOWN=all`, `PROBE_SURVEY=1`.
- **Stubbed:** R0072 orchard trees are not droppable, the boardwalk is not walkable, the
  telescope answers with a line (no camera pan), no fairy-ring chime. R0073 the Keeper and
  NPCs are not tokenised (Nubbins are, 1.5×), tokens' hit area is about 24 CSS px, not 44.
  R0099 no kid-safe signposts or glowing trail; entrances outside the fence are not hidden
  sprites. R0100 only Hazel chapter 1 and the Grove suggestions have places (CAMP fills
  `OBJECTIVE_POIS`). R0101 no offer-on-entering or signpost offers; regions open for their
  own offers are listed in `WORLD_QUESTS.ownOffers` (grove, hollow). R0095–R0098 not started.
- **Known bugs / assumptions:** triangles at the busy middle spots swing with where the
  Nubbins wander: heart 408–472k and bridge 399–464k across runs (budget 450k; creatures are
  ~350k of it), so one of them is often just over. At the survey zoom southBend reads 177 calls;
  the near zoom (index 1) at the heart reads about 530k triangles, over 450k (pre-existing,
  not probed by default). The lane counts as built but only as Corvin's set, so its quests
  stay offered from the Grove. The pixel chip and the "Tap to walk" hint overlap (pre-existing).

## Round 4 · Lane E LOOK (2026-10-29, branch r4/e)

- *Works:* the emote ball trails the point on a spring (squash on landing, pop on a new shape);
  three swim strokes by Swim level (paddle < 20, breaststroke, crawl > 60) with per-stroke
  ripples; cocoons in the Nubbin's own silhouette, band-tinted to evolve, pink to be reborn,
  grey-lilac to depart, breathing at 0.8 Hz; Eternal signatures (Sun halo, Moon bat wings and
  spade tail, Neutral orbiting motes, all float); jewel, metal and shiny finishes in 3D, a
  shiny glint and star catchlight in Pixel; legs, horn, face and wings part slots, 24 wild
  critters plus phoenix and dragon, parts sized by stat level; `&creature=art` stage route and
  `tests/tools/contact-sheet.cjs`; slit pupils; eight Gen-1 and two digital likeness fixes;
  each pet action plays its own beat and toast in both modes.
- *Stubbed:* R0392 flight needs a sim height flag in `behavior.ts` (lane A). The phoenix and
  dragon have no Hollow drop yet (lane B). No 3D splash dots or rebirth petals (actors has no
  bursts). 3D shiny keeps round catchlights. `fusion.ts` merges only the first four slots.
- *Known:* commits 61c8d6d to 982e3b3 have a mis-assembled `chao.ts` that fails tsc;
  c8b4c0d repairs it. Crawl and breaststroke differ little in Pixel.
- *Assumptions:* Eternal signatures went in without Maor's per-form sign-off (the item asks
  for it). Turtle and koala replace the duplicate seal pup. Children paddle in the pond now
  instead of wading.

## Round 4 · Lane B DUNG (2026-10-29, branch r4/b)

- *Works:* acts start at their camp (R0152, `sim/dungeon-towns.ts`, map in
  `config/dungeon-zones.ts`): stash (Shells safe from strays), vendor (fruit, acorns),
  quest-giver (one-time reward once the boss is down), crafting, gamble and hire keepers cast
  from the trainers plus one local per act, waypoint, no combat. The gate leads to the act's
  128×96 field (R0147, `sim/dungeon-outdoor.ts`): 16×16 tiles over biome noise, a road to the
  act gate, 2–3 cave mouths onto one-level side caves, 10–14 packs, wildlife, shrines; level 1's
  stairs up come back out at the gate. Both renderers draw camps and fields as Hollow floors
  under an open sky (`bandForFloor`, no fog of war, daylight). Named uniques, three per act
  (R0156); cave-mouth party picker (R0168); from Acts II–V the acorn lands at the camp (R0150);
  contract tests (R0169). Save v10: `hollow.camp`, `uniquesBeaten`, `lastParty`.
- *Stubbed:* crafting, gambling and hiring only talk (DUNG-33, -34, -38). One camp map for
  all acts. No 3×3 sector streaming in 3D (the field loads in ~0.5 s and holds ~55 fps
  headless without it). Pixel still draws no packs, so uniques show by plate in 3D and the
  bout panel. Walking camp gate to act gate is about 1.5 min, not 2–3.
- *Known:* act runs saved mid-level before v10 pick up their uniques on the next visit to
  that level.
- *Assumptions:* the cave-mouth menu's act button starts at the camp; waypoints still go
  straight to their level. R0060's jump-up trims and R0067's ladders wait for real ledges
  (underground ground is flat in `keeper.ts`, lane A).
## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

