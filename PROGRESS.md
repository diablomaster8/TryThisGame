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
## Round 3 · Lane A (MOVE, 2026-10-28, branch r3/a)

Per-item status in `recs-2026-10-27/STATUS.md`. Edge driver: `EXTRA=./r3a-extra.cjs node
laneA.cjs <pixel|3d> <desk|phone> 5181`; all four configurations pass, no console errors.

- *Works:* mantle onto a lip a jump just misses (R0050); jump button hold ring, air-jump pip,
  glide feather, greyed Shake (R0051); 3D orbit tilts or pulls in when a hill blocks the
  Keeper (R0052, `render3d/hill-clear.ts`, one call in the scene); Camera follows walking
  setting (R0053); co-op Keeper 2 on Keeper 1's motion (jump on Enter, Numpad 0, pad A; the
  two keep apart; R0054, R0022's leftover); Look around on rock tops and the well, one-time
  finds (R0055); walking to the flat stone meets S24's step (R0056); one-time hop lesson chip
  and a Moss line (R0058); care walks stop with the Nubbin in view (R0059); roll (R0064); Swim
  perk pond dip with one-time shells (R0065); Left-handed setting (R0014); 3D glide wings (R0027).
- *Stubbed:* R0057 (needs `DecorKind` entries in `strings.ts`, lane E's sprites and lane D's
  `garden.ts`); R0060 and R0067 (Hollow files, lane B); R0063 hop course; R0066 navmesh;
  3D roll dust and dip bubbles (they need the scene's burst system, lane D); the waterfall
  shelf stone has no story prop yet, so only the flat stone has a reach.
- *Known bugs:* at the 24° pitch hills block the orbit rarely (12 of 1,024 sweep cases, one
  5° step each), so R0052 seldom shows. In the Edge run, a Nubbin standing beside the Keeper
  once pushed it off the well rim before the chip came up.
- *Assumptions:* the mantle keeps the old reach (`JUMP.stepUp`, 0.35 u) and only makes the
  climb visible; the big rocks are now standable (needed for R0055's "big rock at (-7, 9)");
  the well counts as a lookout from its rim rather than as a standable top (standing on it
  would put the Keeper over the hole); vistas give their find on the look (no walk-to marker);
  Pixel's pitch is fixed, so Look around only zooms out; `world.viewYaw` is a UI hint the sim
  uses for care-walk stops and the pulled-down roll, never for rules.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

