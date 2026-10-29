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
  198→162, cornerSE 183→141 calls; all 19 now ≤ 175 calls). R0072 the outer ring's five places, 34 pieces plus 6
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
## Round 3 · Lane C (2026-10-28, branch r3/c)

- *Works:* dojo, story (Logged In) and Circuit bouts are singles with a bench: Swap at
  priority +3 (the incoming one takes the queued hit), a pick after a tuck-in, all tuckered is
  a snack-break loss; the last party is kept in `world.battlePrefs`. Items from the inventory
  (fruit, toys; flavoured fruit from the new optional `inventory.pocketFruit`), paid only on a
  result. Wild foes have Calm and come home as children (or fill the scan and leave Shells);
  Shadow strays take no HP. The ten Keepers' Circuit: fixed teams per save, field rules,
  ribbons, hats, skill points, Champion rematches. Sprout/Keeper/Champion AI plus personality.
  Gentle bouts (Learning Grove or the dojo switch) never lose. One full-screen battle screen
  with playback, phone layout, party sheet and Power swing. Arena colliders (MOVE-62) and the
  reserved grid data (MOVE-61, `docs/tactics-grid.md`).
- *Stubbed:* the Circuit's 10 pre/post scenes and the chapter 5 goal alternative; the
  Learning Grove "Play-fight Day" scenes; he/ja bout lines; nothing fills `pocketFruit` yet;
  the Gentle switch lives in the dojo menu, not Settings; old `party` bouts stay all-at-once
  (no screen opens them now); encounters are singles only when the caller asks.
- *Known:* Champion beats Keeper 70.6% in the 500-bout mirror test, just over the 70% bar;
  the battle screen draws pixel sheets in Full 3D (R0219); the full-life and 8-Nubbin timing
  tests fail in a loaded full run and pass alone (1.6 s, 1.4 s).
## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

