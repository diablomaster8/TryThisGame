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

## Round 3 · Lane D (2026-10-28, branch r3/d)

Plan: phone 3D perf first (break the draws down per category, merge the wild props, creature
LOD R0079, finish R0078/R0081), then WORLD in R order from R0074 (deferring lane A's files).

- *Works:* creature LOD (R0079): past 8 u a rig is one skinned stand-in on the 48 grid
  (`render3d/lod-proxy.ts`), past 20 u a cell in a 4 MB atlas drawn as one instanced quad
  (`impostor-creature.ts`, 2 cells redrawn a frame); hulls stop at 14 u, sun shadows at 20 u.
  Kit trees are 3 draws, not 9. Phone probe 6/19 → 16/19 under budget, median 314 → 161 calls,
  414k → 336k tris; 8 Nubbins at the heart: creatures 38 draws, 245k tris. Spare rigs capped by
  tier, trimmed when hidden, parts behind a stand-in free their buffers (geo 466 → 271). Fast
  travel with iris, carry and partners (R0074); Grove collectibles (R0091); per-region hour
  (R0092) and seeded per-region weather (R0094). `PROBE_BREAKDOWN=1 PROBE_SPOTS=…` on the probe.
- *Stubbed:* postcard unlocks and the old key's secret (R0091); region hours and weather only
  show once a second region is drawn; R0093 signposts (need lane A's pixel files).
- *Known:* far creatures animate at 7.5 fps; at westHill, farOrchard and cornerSE the draws
  sit at 186–228, spread over many small scenery kits. Assumption: the iris centres on the
  view's middle (the camera keeps the Keeper there), not on the Keeper's exact pixel.

## Round 2 · Lanes A–E (2026-10-28, merged on r2/d, one push)

The 2026-10-27 recommendations, round 2, five lanes at once. Full write-ups are in
`docs/progress-archive.md`; per-item status in `recs-2026-10-27/STATUS.md`.

- **A MOVE.** *Works:* Nubbin hops onto tops by stat and personality, thrown Nubbins land on
  tops, NPC routing round solids, 3D wild props, slope slowdown, auto-run, path dots, surface
  footfalls, race hurdles, partner slots. *Stubbed:* Pixel ramp lean, 3D flap on hops, pad
  glyphs. *Known:* a nav/ledge pocket near (28, -33); hops cost the full-life test about 6%.
- **B DUNG.** *Works:* Hollow packs fight on the battle core; save v9 (act seeds with a daily
  reroll, waypoints, the Homing Acorn, remembered levels); solid landmark; fog and automap.
  *Stubbed:* outdoor zones and towns; Pixel waypoint stones, fog and packs (need
  `world-view.ts`). *Known:* a fresh pair loses to three or more foes (pack size capped).
- **C FIGHT.** *Works:* derived battle stats, one damage formula, grade traits, the type loop,
  Puff, statuses and moods, 62 moves as data, four slots per Nubbin, choose-then-resolve turns.
  *Stubbed:* battle items, the 3D dojo view (R0219). *Known:* old turn bouts close as draws; on
  a phone the last move row sits under Leave until scrolled.
- **D WORLD.** *Works:* 3D terrain drawn by view chunk; creature shadows and hulls culled by
  view and geometry level; grass by device tier; memory readout and debug World row; portrait
  walking lead; jump metrics checked against the real jump; the Wood laid out as data; twelve
  world traces. Phone 3D probe: 6/19 spots under budget (5 before). *Stubbed:* creature LOD
  (R0079) is what the other spots need; the Wood and the traces are not drawn. *Known:* a double
  jump can't climb two terrace levels.
- **E LOOK.** *Works:* the legs-out sit, more vivid 3D colours, serpents and 27 four-legged
  species in both modes, Greymon kit extras, signature parts sized for the game camera, arm
  rest, toon ramp without the black collar. *Stubbed:* `quad.tailSet`, band-tinted bubbles.
  *Known:* pixel serpents reach only 1.0–1.6× long.
- **All lanes.** Under load the full-life, sculpt and nav timing tests can fail in a full run;
  each passes alone. No budget was loosened.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

