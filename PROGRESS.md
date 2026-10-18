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
18–38 fixed on 2026-10-18 (sections below). Review C (`docs/review-independent-2026-10-18-c.md`): the ten major bugs fixed on 2026-10-18; the 19 minor ones are open. Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven
fun-quest quotes approved as written, Pixel stays the default; 2026-10-18: ship the Arcade, the
Multiverse, Neopia and Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
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
CPU throttle on the dev server. Review C's minor items 11–29 are still open.

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

