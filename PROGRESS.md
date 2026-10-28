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

## Pass 2: MOVE jump, bridge and stream (2026-10-27, branch pass/2, not pushed)

Plan: the jump core first (R0012, R0013, R0015), since the bridge, the stream and the fence
jump stand on it; then R0002, R0001, R0014 with R0022. R0011 and R0016+ left for Pass 3.

**What works**
- The Keeper has a height (R0012): `y`, `vy`, `grounded`, `airJumps`, coyote and buffer
  timers, `jumpHeld`; save v7 migrates v6 with the feet on the ground. Command
  `{ kind: 'jump', down }`; events `keeperJumped` / `keeperLanded`. Hop and standable
  colliders block only below `top − stepUp` (`colliderTopY`); walls, trunks and rails
  always block. Benches and logs can be landed on (`standTopAt`); fences are jumped (the
  R0007 leftover).
- `JUMP` (R0013, in `tuning-sim.ts`): held apex 0.95, double 0.75, short hop, coyote 120 ms,
  buffer 150 ms, fall ×1.5; `kidFloat` in a Learning Grove or with the new Gentle jumps
  setting. Table-driven tests at both tunings (`tests/sim/jump.test.ts`, 22 tests).
- 60 Hz Keeper substeps (R0015): `updateKeeper` runs 6 per sim step; game.ts runs them
  between steps on its own accumulator (`stepKeeperMotion`, never more than a step ahead);
  both renderers interpolate the Keeper on that clock (`keeperAlpha`, `snapshotKeeper`).
  Same command log → same positions however the substeps split. Edge: Space to y rising
  6–16 ms.
- Bridge (R0002): `deckY` deck box at `BRIDGE_YAW` with 0.4 u ramps; 3D planks placed from
  `bridgeDeckTop()`; two solid rail segments in `grove-layout.ts`. Feet within 0.000 u of
  the planks in Edge, both modes; a sideways walk stops at the rail.
- Stream (R0001): feet sink to the bed (max 0.35 under the surface), 0.55× speed while
  wading, a running jump clears it dry. Pixel sinks the sprite under the painted ground and
  rings ripples every 300 ms instead of dust; 3D stands the rig on the sim footing.
- Phone jump button (R0014): 76 px round, above the camera buttons, `touch-action: none`,
  jumps on pointerdown, hidden on fine pointers and under dialogue. Space jumps, X shakes;
  with an egg or Nubbin in hand Space and the button shake (🥚) instead (R0022).

**Stubbed or deferred**
- Deferred to Pass 3: R0011 (terraces, XL), R0016 onward; from R0014 the Left-handed
  setting, moving ⤢ into More, gamepad A; from R0022 pad Y and Keeper 2's keys; from R0012
  `lastSafe` (R0025), `keeper2Jump` (R0054) and ceilings (no overhangs exist yet).
- `airControl` and `landSquashMs` are in `JUMP` but unused until R0020/R0021.
- No 3D ripples or splash sound for the wading Keeper; no jump animation (R0021).

**Known bugs and assumptions**
- The drawn stream bed is only about 0.15–0.2 u under the water, so the wade reads
  ankle-deep, not knee-deep; deepening it means changing the 3D mesh (left alone).
- Coyote and buffer are ms counters on the Keeper (`coyoteMs`, `bufferMs`), not absolute
  times: substeps are finer than `world.timeMs`.
- The rails also stop a Keeper wading along the stream under the bridge (pilings).
- The full-life timing test ran 3.09 s once under full-suite load before the idle Keeper
  skipped its pace lookups; alone it is 1.26 s.
- Pixel draws the rails' line nowhere: its bridge is a flat painted plank sprite.
- The dev server for the Edge checks ran from Bash: the browser pane reads another
  folder's launch.json.

## Pass 1: MOVE collision foundations (2026-10-27, branch pass/1, not pushed)

R0001 (stream wade) and R0002 (bridge deck) need sim heights and the jump, so this pass laid
those foundations first (R0003–R0010) and left both for Pass 2.

**What works**
- `config/grove-layout.ts` is the one table of Grove solids (R0004): hills, fruit and wild
  trees, houses as boxes the size of the 3D walls, the well, the windmill footing, rocks, all
  five lanterns, the cave lips, the stalls (only once unlocked) and the 66 wild props, which
  the pixel `SCENERY` and the 3D stalls now read. A test checks drawn ↔ collider both ways.
- `sim/obstacles.ts` resolves circles, oriented boxes and segments through a 4 u grid (R0005);
  walkers are `keeper`, `nubbin` or `hopper` (Run or Fly 20+). Bushes, beds and thickets are
  soft: the Keeper walks through at half speed and eases out once it stops (R0006).
- Decor collides by kind from `DECOR.colliders` (R0007); pieces turn in eighths (the
  placing chip's ↻ Turn button, saved as `placed[].yaw`); fences join end to end; a 4×4 pen
  holds a Nubbin for 10 sim minutes, a Run-20 Nubbin hops it.
- `placeRefusal` (R0003) keeps pieces off colliders, the pond and stream, the bridge, story
  props, visitor homes, egg spots and anyone standing there, with a toast saying why.
- `sim/nav.ts` (R0008): 0.5 u grid with pocket labels, A* (shared `sim/astar.ts`), string
  pulling; 120/120 random taps arrive, median path ratio ≤ 1.10, plan p95 about 2 ms alone.
  Shut-in taps walk to the nearest reachable point; care walks with nothing in reach say
  `cantReach` at once.
- Hollow A* (R0009, `sim/dungeon-nav.ts`): 360/360 taps arrive; the party plans its own paths.
- `sim/terrain.ts` (R0010): the 3D height model and the pixel tier table now live in the sim;
  `groundAt` returns y and surface; the 3D mesh is unchanged.

**Stubbed or deferred**
- Deferred to Pass 2: R0001, R0002, R0011–R0015 (terraces, jump, phone button, substep),
  then P1+ from R0016.
- `hop` and `standable` pieces block the Keeper until the jump lands (MOVE-10).
- No red placement ghost: a refused piece toasts its reason instead. No R key for turning.
- Story props (shed, benches, chair) still have no colliders: that is R0016.
- `sweep.ts` was not rerun; the Vitest sweeps stand in for it.

**Known bugs and assumptions**
- Pixel decor is a front-facing billboard, so a turned fence collides along its turn but is
  drawn square to the camera. 3D draws the turn.
- The windmill collides as its round footing (r 1.95), not a box; the cottage box leaves out
  the roof overhang, so the Keeper can tuck under the eaves.
- Hollow tap paths avoid water without the Swim perk (DUNG-01's ×1.5 water cost not used).
- The nav timing test asserts median < 1.5 ms and p95 < 10 ms so a loaded CI runner passes.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

