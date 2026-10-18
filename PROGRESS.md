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
18–38 fixed on 2026-10-18 (section below; Bugs 1–17 in the archive). Review C
(`docs/review-independent-2026-10-18-c.md`): minor items 11–29 fixed (section below).
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`.

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

## Review B, Bugs 18–38 and the notes: minor bugs (2026-10-18)

From the Minor section and "What the notes get wrong" of `docs/review-independent-2026-10-18-b.md`.
Branch `fix/review-minors`, rebased onto the Bugs 1–17 merge. Works (sim items tested):
- **Sim:** memorials keep `band:type` / `eternal:band` (`memorialForm`; old `:` forms dropped
  on load) (18). Fun quests wait for the first hatch and chapter 2 (21). Moss keeps to his
  seat on the western hill, off the roster and its cap, until `c7-stillness` and room bring
  him down (`mossOnHill`, `rosterNubbins`, flag `mossDown`); story Nubbins are never traded;
  a campaign restart no longer doubles him (23, 24). Expedition rewards always hold the
  Shells so far (32). `gatherReadyMs` lives in the world (34). The clock keeps remainders
  under a coarse step (`takeOverflowMs(unit)`) (35). Loads coerce inventory counts, refuse a
  junk clock, and `setSettings` keeps a valid cap (`sanitizeOfflineAging`) (36).
- **Story:** quest speakers show their declared names (`speakerNameIn`: owning quest, family,
  any quest) in the Grove and the Atlas; content-check fails an unmapped `who`, including
  Learning Grove scenes and variants (20). Keeper looks are named for the look (Gardener,
  Tide-pooler...; `KEEPER_LOOK_NAMES`), the You portrait wears your side-trimmed outfit, Ori
  and Hana have their own looks (22, 30). Japanese writes long i as ii (ojiichan); the
  primer adds the six katakana of ピンク and オレンジ; the Hebrew trace goal names its two
  letters (31).
- **UI:** debug chapter buttons read "Ch 1"…"Ch 12" (26). The 3D race looks down at 38° over
  1.5-unit lanes, so every racer and tag is clear, and runs on real time up to 1 s a frame
  (27). A Graphics change returns to the same slot (`markResumeSlot`) (28). A reader slot
  says "Age 7–10" (29). Learning Grove: no keyboard hint, the grown-up sum before Settings,
  Hebrew set larger than its romanisation (30). Another tab writing the slot stops this
  tab's autosave with a notice; storage that recovers warns again (33, 37). "(M4)" gone (19);
  canvas label "The Grove", distinct slot button names, settings boxes stay 22 px (37). The
  narrow-band sculpt test has a 30 s budget (38).
- **Notes:** CLAUDE.md (3D location, test count, current plan, no-chores wording), plan.md
  (count, Atlas row, G12, phone view, Waiting on Maor, CV6 row), `docs/brief.md`; `CREDITS.md`
  with the licence texts deployed from `public/licences/`. The sw.js comment was fixed with
  Bug 2.
- **Checked in the browser pane** (hidden pane, frames driven by screenshots): the 3D race at
  1280×800 and 375×812 (`docs/samples/rb-race-3d-*.jpg`), Settings at 375 (`rb-settings-375`),
  Hebrew and Ori (`rb-hebrew-ori-1280`), the Fern and You portraits, the Learning Grove gate
  and hint, the Graphics reload, slot labels and the Keeper picker.

Stubbed or not done:
- Bug 25 did not reproduce here (1280 and 375, ×1000, panel open: the scene keeps taking
  taps); a comment keeps the debug panel out of the wait list. Race results already closed
  on Escape in both modes; not reproduced either.
- The You and the villager's sprites differ only in trim colours; a stronger difference is an
  art call. The Learning Grove settings gate is per tap, not remembered.
- The parent folder's stray `CLAUDE.md` (outside the repo) still says "Open decisions: none".

Known bugs: none new. Assumption: Moss "comes down" in `c7-stillness` (the scene that says
so); before then he is the hill's watcher, as chapter 1 describes.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

