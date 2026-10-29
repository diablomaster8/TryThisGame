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

## Round 5 · Lane E LOOK (2026-10-29, branch r5/e)

- *Works:* adults at Fly 50+ fly about a third of their wander legs: they rise 0.6 m, cruise
  at 1.4× and glide down (`sim/flight.ts`, a pure seeded height like `shroomHopY`), with a
  Pixel `glide` frame and a 3D held-wing glide; the shadow shrinks below. 40 pocket
  favourites play one of 16 signature idles every 8–15 s (`render/signature.ts`, both modes).
  The book has 654 keys over seven tabs (second evolutions, colours, jewels, looks, parts,
  hats) with lazy thumbnails, a turning page, first-seen time, who showed it, and a one-time
  tab record. Gag frames (peek, wave, clap) and a 16-gag look table (`render/gag-looks.ts`).
  The 3D waddle scales by personality; an evolving body grows from 0.8 in 3D.
- *Stubbed:* the gag sim state is lane A's (nothing plays the gags yet). The book's 3D
  turntable (Pixel figures in both modes) and the golden frame (only `world.bookTabs`). No 3D
  signature particles. R0409 (48 px canvas) not started.
- *Known:* the 3D flight was not seen in Edge (the flier was still sculpting). The book's
  "seen all" badges now count all 654 keys.
- *Assumptions:* flights pick 35% of legs; children never fly; 3D wings keep the walk-flap
  rate (28) rather than 10 Hz.

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

