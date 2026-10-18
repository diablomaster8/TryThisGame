# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-18)

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
(`docs/review-independent-2026-10-18-c.md`): major items 1–10 and minor items 11–29 fixed (sections below).
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`.

## Review C, the ten major bugs (2026-10-18)

From the Major section of `docs/review-independent-2026-10-18-c.md` (each item has an
"Addressed" note there). Branch `fix/review-c-major`. Works:
- **Service worker (1):** registered straight from `boot()`; hashed `assets/` chunks
  cache-first, the shell precached with `cache: 'reload'`. Built site, fresh profile: one
  active registration after starting a slot, offline reload opens the title.
- **Share codes and loop (2):** a code must pass `nubbinProblem` (name capped at 16);
  Receive is hidden in the Learning Grove; `deserialize` runs `importProblem`, so a broken
  save goes down the unreadable path; a frame that throws keeps the loop alive, stops all
  saving and shows a Reload card (`showCrashCard`).
- **Reset (3):** `sim/fresh-start.ts` restarts the slot's own mode (campaign or storyline
  with the same Keeper, Learning Grove age and band); the debug reset asks first.
- **Gate (4, 5):** erasing or starting over a Learning Grove slot on the title asks the gate,
  which now opens above the title; the gate asks a two-digit × one-digit product
  (`GROWN_UP_GATE`), new numbers after a miss, and a held Enter.
- **Full 3D frame rate (6):** four pooled night lights (`render3d/lamp-pool.ts`, light set
  `groveNight`), four in the Hollow; no transmission in the game (water, lantern glass,
  cocoons, wings and dew stripped in the pool); one `FinishPass` for clamp, tone map, sRGB
  and grade; `FrameGovernor` (render scale, undoes a step that buys nothing); face parts cast
  no shadow (`casterMinTris`); half-rate shadow map under strain; cached ground heights.
  375×812, 4× CPU throttle, 8 Nubbins, headless Edge, dev server: Grove 38 fps, race 35,
  night 39, Hollow 42 (origin/main: 18–23, 23, 27, 22).
- **Pixel colour (7):** half-float scene target and the sRGB encode in `render/post.ts`; day
  light lifted (`PIXEL_LIGHT`). Shots `docs/samples/review-c-colour-*.jpg`.
- **Collection book (8):** `coarseStep` records hatches, evolutions, rebirths, Eternals.
- **Well-raised bonus (9):** never the stat `evolve()` just raised.
- **3D Hollow (10):** walls between the camera and the party cut to stubs; shaded stone
  blocks. Shot `docs/samples/review-c-hollow-before-after.jpg`.

Stubbed: the governor only scales pixels and shadow cadence; it does not drop grass, SMAA or
creature detail, and the zoomed-out 3D view (13 fps in the review) was not measured. The
first visit caches hashed chunks only from the second load on (the worker takes control
then).

Known bugs: none new. Not checked on a real phone; frame rates are from headless Edge with a
CPU throttle on the dev server. Review C's minor items 11–29 are fixed in the pass below.

## Review C, items 11–29: minor bugs (2026-10-18)

From the Minor section of `docs/review-independent-2026-10-18-c.md` (each item has an
"Addressed" note). Branch `fix/review-c-minor`; the majors (1–10) are a separate pass. Works:
- **Sim (tested in `tests/sim/review-c-minor.test.ts`):** catch-up runs after the HUD is bound,
  in chunks that yield a frame (`catchUpInChunks`, `Game.catchUpOnLoad`), so its indicator
  paints; no steps or saves until it ends (12). Every mode stops at 30 days (`SIM.maxAwayMs`);
  a save without `savedAtWallMs` has no gap (13). Live play keeps the live rules past 400 steps
  a frame: the backlog runs as fine steps later, time past 2 sim minutes is dropped
  (`Clock.capBacklog`) (14). Catch-up hatching uses `hatchSpeed`; `raceResult` checks course
  and open tier, caps Shells at the prize, never repeats a hat; the race seed is
  `raceSeedFor(world, course, tier)`, fixed until a result is recorded (`World.raceRuns`) (28).
- **UI:** blocked storage shows on the title and as a HUD chip (11); pixel minigame canvases
  sit below the ✕ row (`minigames/play-area.ts`) (15); festival toasts wait for story scenes,
  the away screen opens before any scene (16); the stats sheet docks right on wide screens,
  lifts the camera on phones (`Game.cameraLift`, `CAMERA.sheetLift`) and shows level bars and
  "+N" gains (22); 🧭 Expedition, Keeper picker blurbs (`KEEPER_LOOK_BLURBS`), "Back" label
  (23); Receive dialog, hidden in the Learning Grove (24); Erase labels name the mode (25);
  44 px hat select, field inputs, map buttons (26); Escape for the shelves, Hollow menu and
  party bout, one co-op handler, font retry (27).
- **Render:** draw calls sum every pass (`autoReset` off) (19); 3D run and stretch sections are
  dirt/cobble with chalk lanes (20); a wild-wood skirt past the pixel field, and 3D crowns thin
  only in a circle round the Keeper (21).
- **Content:** sprout egg-hum lines fixed (17); readers (7–10) play Sums, Spelling and Rhymes &
  beats (`minigames/edu/reader-games.ts`, `EDU_READER_*`), preschool games hidden (18).
- **Tests:** the every-Atlas-page test loads its chunk in `beforeAll` (60 s) (29).
- **Checked** in headless Edge (playwright-core) at 1280×800 and 375×812: sheet, gains,
  minigames in both modes, far zoom both modes, crowns, title and HUD with storage blocked,
  Keeper picker, reader picker and a Spelling round, Receive.
- **Assumption:** the 30-day cap also applies to `indefinite` (the brief says "all the time
  that passed"); the away report still shows the real gap.
- **Stubbed / known:** the 3D tag overlap (20) did not reproduce; the stacker was left as is.
  The Learning Grove still shows the season festival toast.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

