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

