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

## Round 3 · Lane E LOOK (2026-10-28, branch r3/e)

- *Works:* a cosmetics registry (`config/cosmetics.ts`): 24 wearables over hat, neck, back
  and body slots, each drawn in both modes from data (`render/sprites/cosmetic-pixel.ts`,
  `render3d/dress.ts` `registryItem`); the shop sells a hat of the day. Hatchlings wear their
  eggshell for 10 live minutes and keep it in the hat box. Quills (Sun Keeper) and Shade (Moon
  Keeper) are tier-3 race prizes with 3D accessories. First evolutions carry type tells in both
  modes (Pixel sorts by outline: `first-tells.test.ts`). A pixel cry clip. Nine more egg colours,
  three jewels, and metal and glass finishes in Pixel.
- *Stubbed:* the cry clip is not shown yet: `world-view.ts` and `actors.ts` still map `cry`
  to `sad` (lane A), and there are no 3D tears. One worn cosmetic at a time (`n.hat`); the
  per-slot `wear` field needs lane B's save. No 3D egg finish (`creature-pool.ts`, lane D).
  Normal's fuller crown and Run's lean are Pixel only. Pixel serpents still 1.0–1.6× long.
- *Known:* Pixel metal is subtle at 32 px. New egg colours show raw ids in the Roster
  (`EGG_COLOR_LABELS` lives in `strings.ts`).
- *Assumptions:* keeping the eggshell is automatic (into the hat box on hatch; it leaves the
  head after 10 min). Grove line only. The registry's "show what you get" shop option was
  taken over per-id SKUs (no `ShopItem` change).

## Round 3 · Lane B DUNG (2026-10-28, branch r3/b)

*Plan:* R0031 (Hollow platforming, generator version 4), then the sim-side items that fit one
pass: R0162, R0158, R0155, R0159, R0161. R0147 (outdoor zones, XL) and R0152 (act towns, L)
stay deferred to a pass of their own: both need new maps in both renderers. *Assumptions:*
gap rules count run depth, not the level inside an act; a saved version-3 run keeps its flat
floor and its packs (`floorOf`/`actFloor` take the run's `genVersion`); difficulty is Cosy
until DUNG-36; Act IV's ice also appears in endless depths 16–20.

- *Works:* version-4 floors (`sim/dungeon-gaps.ts`): chasm cuts and deep water, a walking
  bypass on floors 1–2, 3–5 jump-only nooks with a find from floor 3, stepping stones with
  water gaps; a Keeper standing in a gap or deep water pops back to dry ground, party Nubbins
  hop over (`dungeon-falls.ts`); 3D pit with a blue glow, Pixel and automap chasm cells.
  Strays drop a Shell trail, snatch twice a floor, can be shooed, show on the automap
  (`dungeon-strays.ts`). Packs by density with treasure guards and an 80/15/5 mix; ten cosy
  champion modifiers as data (`config/dungeon-foes.ts`, `dungeon-density.ts`); 3D plates and
  a bout-panel plate. Shrines with timed buffs, a buff ring and 3D stones
  (`dungeon-shrines.ts`, `ui/dungeon-buffs.ts`). Traps on raised tiles in both renderers,
  re-arming, none in the Learning Grove, scouts (`dungeon-traps.ts`).
- *Stubbed:* terrace ledges are still ramps (Keeper ground underground is 0 in `keeper.ts`,
  lane A). Bouncy and sticky speed need lane A to multiply by `hollowSpeed(world)`. Snuggly
  power and the modifiers' effects wait for lane C. Pixel draws no packs, plates, strays'
  trail or shrine stones (`world-view.ts`, lane A). No uniques (R0156), so 0 per level; Lucky
  Clover waits for loot tables (R0163); Gem shrine waits for charms.
- *Known bugs:* none open. The pack-placement sweep now has its own 30 s timeout (a vitest
  timeout, not a game budget) because the new generator sweeps run beside it.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

