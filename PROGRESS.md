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
one-time gifts). Content (2026-10-18): every storyline scripted, Q66–Q95, PA1–PA5, LB and LK
included; edu done wherever audience and outline allow (none logged for Q66–Q95); fix-mode reviews done for Atlas A1–A10 and A22–A31
and every Atlas and S24–S31 edu version, the rest canon-audited only (`docs/content-index.md`). Plan v4
(`plan.md`): G11 device pass, Track B writing and review tasks, and Part Z, the
independent full review that runs last. Plan G12 is built and pushed (2026-10-17): the storyline engine, expansions E1–E3 and the four separate campaigns SL1–SL4, sections below and in the archive. Maor, 2026-10-17: legal cleared,
adviser sign-off given, the seven fun-quest quotes approved as written, Pixel stays the default
(Full 3D remains a setting); the Atlas quote and audience items in the two wave reports are fine;
the phone view passes; Expedition and races get 3D versions in Full 3D. Waiting on Maor: the
Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## Review fix: panels over story scenes, Beetle Run (2026-10-18)

Bug 3 of `docs/review-independent-2026-10-18.md`, with its neighbour bug 20.

Works:
- Panels, sheets and notices (`.modal`, `.sheet`, `.pocket`, `.celebrate`, `.catching`,
  `.debug`) sit at z-index 16, above the dialogue (15), so a tap on them never lands on it.
- `Dialogue.waitWhile` (wired in `hud.ts`): while any stacked panel, a running minigame, the
  away summary, a celebration, the memorial card, the Learning Grove screens or the catch-up
  veil is open, the scene waits on its line (class `waiting`: dimmed, `pointer-events: none`,
  Space/Enter ignored) and resumes when the last one closes. `mountPanelStack` now returns
  `anyOpen()` and calls back on every settle, so the wait starts the moment a panel opens.
- Beetle Run, the race, karate and gym screens are pinned panels in the stack: a menu opened
  over one (Races over Beetle Run) is shut at once, so results never stack over a dialog.
  Escape quits Beetle Run to its results (keeping the cargo), and a second Escape closes them.
  Escape also closes the away summary. Scenes do not start over the gym or Beetle Run.
- Checked in the browser pane at 1280x800 and 375x812, in Pixel and Full 3D: after a 4-minute
  `resume()`, `elementFromPoint` at Continue returns the button and one tap closes it; the
  stats sheet, settings, shop, roster, journal, races, atlas and cabinet all wait the scene
  with no button hitting `.dialogue`, and the line never moves; Space, Enter and a tap on the
  box do nothing while a panel is open; a tap advances it again after. Screenshots
  `docs/samples/bug3-away-over-scene-{3d,pixel}-{1280,375}.jpg`.

Stubbed: no DOM test environment, so there is no unit test; the checks above are manual.

Known: with a scene waiting under the stats sheet (no backdrop), taps outside the sheet reach
the Grove as usual. Anything that opens a panel mid-scene pauses the story until it closes.

## Save safety: review bugs 4, 5, 29 (2026-10-18)

From `docs/review-independent-2026-10-18.md`. Works:
- `?edu` erases a Learning Grove slot only in dev builds; on the built site it opens the title
  with the Learning Grove slots in view (`showTitle(…, focusMode)`). `?free` never erased.
- A save that fails to load is copied to `<slotKey>.unreadable.1|2` (newest first, same text
  not re-pushed; `backupUnreadable`/`readUnreadable` in `platform/storage.ts`, count in
  `SAVE_SAFETY`) before the fresh start, with a toast. If the copy fails, `Game.holdSaves`
  stops every autosave until an import or reset. Settings shows "Export the save that could
  not be opened" while a copy exists.
- Import: refuses files over 5 MB, Nubbins missing what the sim and renderers read
  (`nubbinProblem`/`importProblem` in `sim/save.ts`; load stays lenient), and saves of another
  mode (`modeOfWorld`); asks before replacing the named slot; comes back with Mature content
  Off and the rift unconfirmed. Tests: `tests/sim/save-safety.test.ts` (9).
- **Stubbed:** checked by tests and typecheck only, not in the browser (the preview entry needs
  the shared parent `launch.json`). The kept copies are never pruned except by rotation.
- **Assumption:** a save's mode is read from its world (edu, then storyline, then campaign);
  a Free Grove where the debug panel started the story reads as Hazel's Grove.
- **Known bugs:** `replaceWorld` does not re-sync tiles, lanterns or the dungeon until reload.

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
name tags and section signs laid out each frame against the camera so no two screen
rectangles intersect (`stackTags`, projected and measured in pixels, two passes);
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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

