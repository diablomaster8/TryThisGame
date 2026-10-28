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

## Round 2 · Lane B (DUNG, 2026-10-28, branch r2/b)

- *Works:* Hollow packs fight on lane C's battle core (`battleHandler`, a `battleEnd` hook in
  `applyCommand`, the self-opening `ui/dungeon-bout.ts`; at most the party's size of a pack joins).
  Save v9: act seeds with a daily "New paths" reroll (R0149), waypoint stones with a travel panel
  (R0148), the Homing Acorn portal home and back with one free acorn a run (R0150), remembered
  levels and stairs up that climb inside an act (R0151). The landmark is solid to bodies and nav
  (R0032). Fog of war in both renderers and the Tab/🗺 automap overlay (R0153, R0154).
- *Stubbed:* outdoor zones (R0147) and towns (R0152) not started; Pixel doesn't draw the waypoint
  stone, fog the sprites, or draw packs (all need `render/world-view.ts` `drawCave`, lane A); no
  Grove-side portal sprite; acorns are bought at the cave mouth, not the shop screen; cart and arch
  posts still walk-through (their placement lives in `render3d/hollow-dress-set.ts`).
- *Assumptions:* waypoints on act level 1 and every 2nd level, never the boss level; ids are
  `<act>.<level>`; the acorn always lands in the Grove; a forfeit or draw flees a pack and loses to
  a boss; crystals stay soft (solid ones walled walkers out of one-cell nooks).
- *Known:* a fresh pair loses to three or more foes every time (hence the cap; balance is lane C's);
  a chasing pack can slip out of 3D sight for a moment (aggro 5 cells, sight 4).

## Lanes A–E (2026-10-28, merged on lane/d, one push)

The 2026-10-27 recommendations were worked by five lanes at once. Full write-ups are in
`docs/progress-archive.md`, and per-item status is in `recs-2026-10-27/STATUS.md`.

- **A MOVE.** *Works:* jump and landing feel in both modes, pad mapping (X pet, B feed, Y
  shake), auto-hop on tap paths, Fly-perk glide, the floating analogue joystick, Nubbin
  steering, thrown bodies that bonk off solids, collider/nav/ground-y debug overlays and a
  collision sweep. *Stubbed:* 3D knees on crouch, 3D wings, Keeper 2's jump, tap markers,
  fall recovery (MOVE-31). *Known:* a thrown Nubbin can't land on a bench top.
- **B DUNG.** *Works:* save v8; the boot veil and arrival grace; generator v3 with loops and
  29 Rootways pieces; packs that chase and start encounters; five acts with boss rooms.
  *Stubbed:* act tilesets and towns; a boss look; pack loot (Shells only). *Known:* the Pixel
  view doesn't draw packs (needs `world-view.ts`); the standard tour band hits about 85%.
- **C FIGHT.** *Works:* a seeded battle core (`src/sim/battle/`) runs the dojo and SL2's
  party bout, with the party panel. *Stubbed:* the 3D dojo view (R0219), rival species, the
  Hollow `encounter` wiring. *Known:* old `karateResult` trusts `won`; fast weak taps beat
  tier 2 (R0280).
- **D WORLD.** *Works:* the region graph (13 regions, paired exits, the `travel` command,
  discovery events); every quest mapped to an area (`noArea: 0`); the drawn map with
  "you are here", travel and region tabs; compass and minimap (Off/On/Auto); Full 3D
  `PERF_BUDGET` with a governor `geoLevel`; the chunk grid and Pixel off-screen culling
  (793 → ≤ 138 sprites); a World line in the debug panel; POI spacing and
  `npm run probe:world`. *Stubbed:* quests in the map sheet, maps for non-Grove regions, the
  compass objective tick, 3D streaming. *Known:* Full 3D is still over the phone budget at
  most spots until creature and scenery LOD (R0078/R0079). The region is derived from
  `location`.
- **E LOOK.** *Works:* Chao crown, tip, eyes, head ratio, wings, mitts, waddle and mouths in
  both modes; Moon adult hues; per-species 3D eyes; multi-head and ghost species; the
  likeness test suite. *Stubbed:* crown spring bone, toon rim light, slit pupils, the
  part-grow at evolution. *Known:* wing cream `#fff1c9` awaits Maor's OK.
- **All lanes.** Under load, the full-life, `species-gen1a-art` sculpt and nav timing tests
  can fail in a full run. Each passes when run alone; no budget was loosened.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

