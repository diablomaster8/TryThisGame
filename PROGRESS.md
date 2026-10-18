# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16, evening)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content pack in `src/content/`; engine CV1–CV6 wired (campaign v2 and
endings, all 31 side stories and the fun quests running, props and keepsakes, the Learning
Grove switch, Hebrew and Japanese, Atlas/Arcade/Multiverse saves, Mature content setting,
one-time gifts). Atlas A1–A31 all scripted; A1–A10 and A22–A31 reviewed and fixed (plan
Task B-R1; reports `docs/logs/review-wave-L.md` and `review-wave-M.md`). Plan v4
(`plan.md`): G11 device pass, Track B writing and review tasks, and Part Z, the
independent full review that runs last. Plan G12 is built and pushed (2026-10-17): the storyline engine, expansions E1–E3 and the four separate campaigns SL1–SL4, sections below and in the archive. Maor, 2026-10-17: legal cleared,
adviser sign-off given, the seven fun-quest quotes approved as written, Pixel stays the default
(Full 3D remains a setting); the Atlas quote and audience items in the two wave reports are fine;
the phone view passes; Expedition and races get 3D versions in Full 3D. Waiting on Maor: the
Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## G17: 3D Expedition and races (2026-10-17)

In Full 3D the Expedition and the races draw in 3D; Pixel is untouched. Each screen now
owns only its flow and hands frames to a view: `minigames/expedition/view.ts` +
`pixel-view.ts` (the old drawing, moved) and `render3d/expedition-3d.ts`; the same for the
race (`minigames/race/view.ts`, `pixel-view.ts`, `render3d/race-3d.ts`). `selectMinigameView`
(`render3d/minigame-layout.ts`, pure, tested with the track and camera maths in
`tests/render/minigame-3d.test.ts`) picks 3D only when `settings.graphics === '3d'` and the
scene is loaded; the 3D views are lazy chunks (about 20 kB, `expedition-3d`, `race-3d`,
`minigame-stage`). `render3d/minigame-stage.ts` is what both stand on: the Grove's renderer
drawing into the game canvas under a see-through overlay, `GroveSky`, the painted
`terrainMaterial` strips, `buildTree`, `buildGrass`, `Bursts`, rigs from the shared
`CreaturePool` (the player as its real look, rivals as `first-<band>-<type>`), the Grove's
post chain less bloom. Tunables `EXPEDITION3D` and `RACE3D`; strings `stageLoading`,
`SECTION_LABELS`. Screenshots `docs/samples/g17-*.jpg`.

Works: chase camera framing `height` world units top to bottom (`frameCamera`; the lens
widens in portrait to `minSpan`), so the runner is about a sixth of the screen; a
screen-space gradient backdrop (the Preetham dome only lights the scene); parallax hill
rows, a recycled tree ring and tiled grass behind the runner, ground reaching past the
frame; shells, essences, critter bubbles, rocks, logs and bushes as props; the rig walking
and hopping with the gait clock, hit blink, dust and sparkle bursts and a camera kick (off
under reduced motion). Race sections as grass, worn earth, a sunk water channel, a rock
gully to fly over and a rock ramp that stays up, all on painted earth skirts and walls
down past the frame; signs that slide to stay whole on screen; finish posts and banner;
name tags laid out each frame so none overlap (screen-space nudge, nearest lane first);
the player's stamina bar; rest as the sleep pose; cheer sparkles; the camera leaning
toward the leader but keeping the player in the left half. Rival rigs are discarded from
the pool when a race ends (`CreaturePool.discard`). Frame times on Maor's PC, hand-driven
frames with `gl.finish` (polish pass): Expedition 1024x640 p50 1.7 ms / p95 3.3 ms,
375x812 (563x1218 backing) p50 1.4 / p95 2.3; race (6 rigs) 1024x640 p50 4.2 / p95 5.1 to
6.9, portrait p50 3.6 / p95 4.4. Exit frees everything the stage made (checked at the GL
level with a `createTexture` hook: nothing survives a cycle); geometries settle across
repeated races. No console errors.
- **Stubbed:** no toon outline pass (the Grove has none either); the minigame water has no
  refraction (a transmission pass leaks a full-size target per camera in three 0.186 and
  doubles the draw); no Zz over a resting racer; the Expedition's Hollow theme is only the
  night gradient; the emote ball does not ride along.
- **Known bugs:** `renderer.info.memory.textures` reads one higher after each minigame
  (a target disposed before its first upload; no GL texture leaks); a tag of a racer just
  off the screen's edge clips there; the sky's environment target is now disposed in
  `sky.ts` (it was never freed before).
- Device numbers are PC only; the G11 phone pass still owns the 60/30 fps check.

## Canon audit and fixes (2026-10-17)

Audit report `docs/logs/review-canon-audit.md` (report mode, whole canon; Maor's decisions in its
section 9). Fixed: the Multiverse (one signature choice per line paid off in 3+ later quests,
`MV_*_VARIANTS`; Nubbin lines in MK/SP narrated) and Neopia (`np-05-stance` pays off in NP9,
NP11, NP13; NQ flags read in their own completes; the faerie side/colours rewards split into
one key per chain, `neo-side-*` / `neo-colours-*`); PA1 is `all` with childLines and new
`edu-pa1-sprout.ts` / `edu-pa1-reader.ts`; S24's speaker is `augusta`; the separate campaigns
are SL1–SL4; the hive's S26 return is now canon (canon 17/31, bible, brief); Moss's Hush
memory is told new in S26 and S30; the minor tone and repetition fixes from section 4.
New variant arrays are exported from `src/content/index.ts` and covered by content-check.
- **Stubbed:** no sim catalogue plays the Multiverse or Neopia variants yet; when CV6 builds
  it, pick variant arrays per line (two files carry two each), and note `variantFor` matches
  bare flag values (three MV signature values were prefixed to avoid clashes).
- **Known bugs:** the two older test failures are fixed (2026-10-17): the sprout band now
  splices the walled garden after its own "Gran Hazel walks" line (`spliceScene` takes a
  per-band anchor), and the childLines test hides edu copies to exercise the fallback. About 16 lines in
  `storyline-*.ts` exceed 160 characters; content-check does not cover the storylines.

## G12 writing pass: beats for SL1–SL4 and the expansions (2026-10-17)

The separate campaigns were a session long each; the brief asked for 4–10 hours. This pass
adds `StorylineChapter.beats` between the openings and the goals (no goal check changed),
and deepens the expansions' scenes.

Works:
- S1 (30 beats): Ida and Sorrel on the story clock (`days:` from the chapter's start), the
  first visitor and feed, the care slips (`partner:slips`), fondness and trust, the cave's
  stairs, strays and chest (a new flagged choice, `h-drawing`, paid off on the hundredth
  day), the cocoon, the mire's rain, the stall and yard, the loft lamp at the mountain, the
  naming choice and a moody partner on the last day.
- S2 (19 beats): Warden's tips as the eggs hatch, Juno's meal-count talks (a new choice,
  `l-told`, paid off at the board), night bouts, the bout counts between ranks, a lost
  partner (`count:departed`, chapter 6 only), a second teen beat (`l-c6-wage`), and Juno's
  reaction to the chosen word.
- S3 (20 beats): the banners and ledger, the leader's errands (`count:missionDone`), the
  first stair, a torch choice (`b-torch`, paid off on the third floor), the two partners and
  Vane's own fusion, the second run, and chapter 8 reading the fusion and the lever.
- S4 (16 beats per half, from the template): the other twin when `dd-other-done`, the Book's
  visitor and settler, the egg that must not be hatched, the second page, Vask between
  belts, the grown one sitting by the egg, and the day after the cause.
- E1–E3: fuller visits and one real choice each (`e1-hazel`, `e2-asked`, `e3-pick`), voice
  only for now. E1–E3 and S1–S4 are now exported from `content/index.ts`, and the three
  expansion packs are in `tests/tools/content-check.ts` (problems: 0).
- Every `_CHECKS` list now includes the beat checks, so the grammar is covered.

Stubbed: no engine change. The `days:` beats use the two-minute story day, so at ×1 they
land minutes into a chapter, not hours. The expansions' new choices set flags nothing reads
yet. Nothing in S1–S4 is in the content checker (it checks `Quest` packs, not storylines);
the storyline tests and a line-length sweep stand in.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

