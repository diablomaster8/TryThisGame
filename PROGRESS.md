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

## Lane B: DUNG, the Hollow Below (2026-10-28, branch lane/b, not pushed)

R0142–R0146 in R order; next open is R0147. Save version 7 → 8 (`world.hollow.acts`).

- **Works.** R0142: the boot veil holds the floor still (`setLoading` from main.ts, never
  saved), says "Lighting the Hollow…" underground, and an 8 s arrival grace follows every
  entry, descent and veil lift. R0143/R0144: generator v3 (`sim/dungeon-gen-v3.ts`) on a
  12-cell slot grid: a branching walk with 1–3 loops, 29 authored Rootways pieces
  (`sim/dungeon-pieces/`, turned to fit, ≤ 3 of one per floor), tunnels between sockets,
  cave rock as one-tunnel side caves, v2's dressing shared through `dressFloor`; levels small,
  standard, big in `config/tuning-dungeon.ts`; new non-story runs use v3 (`HOLLOW.genVersion`),
  v1/v2 pinned by a snapshot test. R0146: packs (`sim/dungeon-encounters.ts`) notice, chase at
  0.8× and leash; a bump hands a 9×7 board to `EncounterHandler` (default: a seeded
  auto-resolve stub; lane C swaps in with `setEncounterHandler`, or answers later with the
  `encounterDone` command); win = poof and Shells, loss = giggles and back to the stairs with
  the haul. Packs drawn in Full 3D (`render3d/crowd.ts`). R0145: `config/dungeon-acts.ts`
  (five acts, 3–4 levels), boss room and boss pack on each act's last level, the boss gates
  the way on and opens the next act, act list in the cave-mouth menu.
- **Stubbed.** Fights (auto-resolve until FIGHT). Acts II–V use the Rootways pieces (their
  tilesets are not drawn); no act towns, outdoor zones or side dungeons (DUNG-07, -12); the
  boss is one big pack with no look or phases of its own (DUNG-20); no "!" emote or sparkle
  poof yet (3D uses a hop); pack loot is Shells only (DUNG-23).
- **Known gaps.** Pixel view does not draw packs: it needs a call in `render/world-view.ts`
  (lane A's file). Standard-level full-clear tour is in 750–1,100 u on ~85% of seeds, not
  95% (test allows 20 misses).
- **Assumptions.** The stairs band is measured against the farthest room, not the farthest
  cell (side caves wind on past every room). Tour bands per level: small 500–950, standard
  750–1,100, big 1,000–1,750 u (small opens an act, big closes it). Story floors stay on v2.
  The endless v3 Hollow has no sealed bottom. Packs only on v3 floors.

## Pass 3: MOVE terraces, props, bodies, motion (2026-10-28, branch pass/3, not pushed)

Plan: R0011 terraces first (sim height model, cliff gate, nav, Pixel and 3D meshes, hill-0
path on the ramp); then R0016, R0020, R0017 and R0023 here, with R0018 (3D occluder fade)
and R0019 (Pixel x-ray) built in helper worktrees and merged. R0021 onward left for Pass 4.

**What works**
- Terraces (R0011): each hill is `ceil(h / 0.9)` tiers (2–5), steps 0.67–0.87, top tier
  0.4 r across, built by `hillTerrace` in `sim/terrain.ts` (`TERRACES`, `TERRACE` in
  `tuning-sim.ts`, `ramp: { from, to }` per hill in `GROVE.hills`). `hillHeight(x, z, soft)`
  gives the drawn (eased 0.5 u inside each rim) or hard (upright) shelves; the 3D mesh and
  grass sample the soft one, Pixel builds cylinders and `rampGeometry` sheets from the hard
  one. The ramp climbs along the foot of each next tier, leg by leg, 1.2 u wide with
  walkable banks. The Keeper is held at a cliff by `ledgeY` (a step may rise `stepUp` over its
  feet or shelf) and slides round the ring; a jump clears one tier. Hill colliders are
  `nubbinOnly` now (Nubbins keep off); hill 1's waterfall face is a solid segment. Nav treats
  cliffs as walls between cells (`step`, sampled once; `astar` takes a `pass` option), so
  120/120 random taps arrive and every hill top is reached by tap. Hill 0's worn path (3D
  ribbon, Pixel dabs) follows `rampPath`; `hill-path` is the ramp foot. Edge, both modes:
  ramp walk to Briar, a jump onto tier 0, a walk at the face stays at the foot.
- Story props (R0016): `STORY_PROP_COLLIDERS` by kind in `grove-layout.ts` (shed and barn
  walls, benches/chair/flat stone standable, shelf solid); live only while
  `storyPropMask(world)` says the prop stands (in the collider and nav cache keys).
- Ground feel (R0020): `KEEPER_ACCEL`; stick speed in ~0.12 s, stop in ≤ 0.11 s, a reversal
  skids once (`keeperSkid`, Pixel dust), speed into walls is lost, tap walks ease in over
  0.6 u. 3D turns at 900°/s, Pixel holds a new heading 60 ms.
- Bodies (R0017): `sim/separation.ts` after the NPC step; overlap rate under 0.1% with 8
  Nubbins (0.77% without), the Keeper walks through a crowd of 8, carried ones untouched.
- Cameras (R0023): `CAMERA_FOLLOW`; Pixel follows the drawn ground (terrace, bench, bridge)
  and holds through jumps, both lead by 0.6 u, 3D nods 0.06 u on landing (not under reduced
  motion). Edge: Keeper at NDC y 0.05 (Pixel) / −0.11 (3D) after the climb.
- 3D occluder fade (R0018, agent, 54a6b12): `render3d/occluders.ts`; Keeper visible 256/256
  frames (4 buildings × 8 yaws × 8 ring spots) at desktop and phone.
- Pixel x-ray (R0019, agent, 9fe216c): `sprite-batch.ts` draws marked quads again through a
  `GreaterDepth` child mesh at 45%, tinted by the trim colour, with a 1-texel outline (1 extra
  draw call, none when nothing is marked); the Keeper and the highlighted Nubbin are marked;
  scenery and orchard quads nearer than the Keeper and over its head fade to 55%.
  Sweep (Keeper on a 0.8–1 u ring, desk): trees 96/96, cottage and cave 64/64, but the same
  without the x-ray: Pixel's older dither round the Keeper already clears these spots, so the
  x-ray's own share is unproven (partial).

**Stubbed or deferred**
- Deferred to Pass 4: R0021 onward (jump/land frames, auto-hop, falls, jump unlocks, glide,
  joystick, Nubbin heights...). Nubbins still never climb terraces (R0030).
- R0017: NPCs do not pause and walk round when the Keeper blocks their target (they already
  stop within 2.5 u of the Keeper). R0018: flat silhouette, not a 1 px outline; story-set
  cabins and the visit garden not boxed. R0016: the garden door has no collider.
- R0011's leftovers: no ledge-y camera avoidance (R0052); the outer ring props near hills
  were checked only for the colliders' centres.

**Known bugs and assumptions**
- Assumption: "3 tiers" in R0011 became 2–5 so every step stays in the 0.6–0.9 band.
- Ramp angles were picked by a scan clear of colliders and the stream; hill 1's ramp leaves
  93–153° free for the waterfall. Moved off the terraces: the rock and its sprite at
  (-13, 12) → (-10, 10), the log at (-24, 12) → (-26, 12.5), bush-3 at (-33, -36) →
  (-31, -36.8). `flat-stone` marks moved in to 0.55 r, the crest tree to (1.2, 1.0).
- A Nubbin can still walk up the first ramp leg (it is outside the hill's collider).
- `ledgeY` uses the full height sum near hills (the tile cache smears a cliff over 0.25 u).
- The terrain test skips mesh cells across a cliff face and allows 40 (was 20) samples off by
  more than 0.05 u: the ramps' banks are steep for half-unit cells. Grass checksum updated.
- Full-life timing test: 1.17–1.21 s alone (1.12–1.16 s before), 2.49 s in the final full
  `npm test`; it once hit 3.04 s while helper agents' Edge sweeps loaded the machine. The
  collider table's cache key is now a number (8936f4b), which won back about 50 ms.
- R0019: the x-ray head point is a fixed y 1.7, so on a terrace the fade test aims low.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

