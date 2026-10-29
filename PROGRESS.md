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
## Round 4 · Lane C FIGHT tactics (2026-10-29, branch r4/c)

- *Plan:* a pure, seeded grid-tactics core in `src/sim/battle/tactics/` beside the turn mode,
  which stays untouched (R0243 map, R0244 field map, R0245 path, R0246 CT, R0247 facing,
  R0248 jobs, R0249 terrain, R0250 range and combos, R0251 objectives, R0252 AI), then the
  R0257 slice as `world.tactics` behind a debug-panel button, then a Pixel view and phone bar
  (R0253, R0255) in new files. R0254, R0256, R0219, R0239 later.
- *Works:* `sim/battle/tactics/` (pure, seeded, JSON state, map as base64): Hollow-room and
  open-field maps (cottage, trees, lanterns blocked; `config/battle-maps.ts` overrides), Move
  and Jump from Run/Fly, deep water for swimmers, CT turns with Move (before or after the Act,
  undoable until it), Act, Wait and facing, charged moves, facing/height factors shared by
  preview and hit, 7 jobs plus Sunny/Moony layers and the Keeper aura, 8 terrains, arcs and
  line shots, 11 "Together!" combos at friendship 60, 8 objectives, Sprout/Keeper/Champion AI
  (0.4 ms a decision, Champion 40/40 over Sprout). The rumble room (R0257): debug panel →
  "Rumble room (3v3 tactics)", a 10×10 Hollow crop, calm the Old Shadow, Shells and a crystal;
  kept in `world.tactics` (optional, no save bump) and reopened after a reload. Pixel iso
  board (`minigames/tactics/pixel-view.ts`, also over Full 3D) and the one-thumb bar
  (`ui/tactics-bar.ts`, `ui/tactics-screen.ts`, `tactics.css`). The turn-mode API is unchanged
  (`moveDamage` now calls `damageWith`, same dice order).
- *Stubbed:* no move animations (the log line and a hurt flash only); the AI never calls a
  combo; Copycat and Doodle Decoy act as plain moves on the grid (Decoy is greyed out); fused
  partners are not one 2-tile unit; lane B's rumble-room flag (see the hand-over note).
- *Known bugs / assumptions:* the AI's 8 ms cap is an evaluation count (2500), not a clock, so
  replays stay exact. The board is Canvas 2D: 1 blit for the map plus 1 per unit (13 for 12
  units), not the ≤3 WebGL draws of R0253; it holds 60 fps at a 4× throttle. Water touching
  dry ground is shallow, the rest deep; combos need the pair side by side (diagonals count).

## Round 4 · Lane A (MOVE + FUN, 2026-10-29, branch r4/a)

Plan: the Hollow roll bug first, then R0057, R0063, R0066, then FUN R0290–R0305 in order
(R0293, R0298 to lane E). Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver:
`EXTRA=./r4a-extra.cjs node laneA.cjs <pixel|3d> <desk|phone> 5181`; all four pass.

- *Works:* no roll underground, so a chasm lip faced toward the camera jumps; spring mushroom
  (bounce 2.2×, squash, boing, Nubbins play on it) and hay bale in the decor shop (R0057);
  hop course: 12 flags, timer chip, ghost, Hop Hat once, best time in a per-slot side save
  `<slot key>.hop` (R0063); Q1 asks for a placed flower bed (R0291); hint-verb check in
  content-check and 25 hints rewritten (R0292); Keeper barks in a bubble (R0295,
  `content/barks.ts`); a throw splats on trunks and walls (R0299); fruit on heads (R0300);
  comic sounds plus a debug row (R0301); typewriter beats and voice blips, with a setting
  (R0302); `beat`, `sfx`, `shake`, `gag` on script lines (R0303); goal-done chip per chapter (R0305).
- *Stubbed:* R0066 navmesh (deferred, field still 96 u); R0294 micro-games, R0296 routines,
  R0297 chatter, R0304 gate beat (not started); R0292's Do-it-honest pass over the other
  unmet-verb hints; R0299 walking bonks; R0303 stage-actor reactions and the spark particle;
  R0305's comic micro-moment (waits on R0293); barks have no separate edu lists (all lines are `all`).
- *Known bugs:* none found. Under a loaded machine the full-life and 8-Nubbin timing tests
  failed once in the full suite; alone they take 2.1 s and 1.8 s (main: 1.8–1.9 s).
- *Assumptions:* the course opens once the hop lesson is done (no new saved field); the Hop
  Hat is a `prize` entry in `config/cosmetics.ts`; the hat is the run's only Grove write;
  fruit can land on heads from any drop, shaken or not; the mushroom's Nubbin bounce is
  drawn only (the sim keeps `y` at 0).

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

