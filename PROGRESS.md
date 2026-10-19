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
(`docs/review-independent-2026-10-18-c.md`): major items 1–10 (section below) and minor items 11–29 (in the archive) fixed.
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`. Maor, 2026-10-18: Full 3D is the flagship for the AAA art push (the
default renderer is not changed; section below).

## Full 3D art push 1: toon creatures, ground, water, governor (2026-10-18)

Branch `art/3d-flagship`. Before and after: `docs/samples/art3d-before-after.jpg`. Works:
- **Toon creatures:** the Grove's rigs build with the line-up toon bands (`GROVE3D.toon`):
  - a stepped light rim;
  - a share of the sky's diffuse light (without it they went near black);
  - no sun shadow on themselves (speckle at this scale);
  - screen-sized outlines on parts of 2,500+ triangles (`render3d/toon-outline.ts`, one
    shared hull material).
  `surfaceMaterial`/`toonMaterial` now carry `customProgramCacheKey`: toon and physical shared
  one program before.
- **Light:** the sky map is soft fill (0.38 by day, was 0.7, which washed the meadow mint) and
  the hemisphere carries the fill (0.6). Night has more moon and fill, exposure 0.6.
- **Ground and foliage (`aaa-kit.ts`, opt-in so the stage samples keep their look):**
  - the meadow is painted toward lush and dry greens with an anti-tiling second sample
    (`GROVE3D.terrainLook`);
  - tufts are dark at the root, lit like the ground, and sink away 34–46 units from the
    camera (`grassFade`);
  - the field frays over its last 5 units (grass golden hash updated);
  - canopies shade as rounded masses and sway in the wind; crowns.ts chains its dither
    after that patch.
- **Water (`render3d/water.ts`, rewritten):** unlit painted shader on fine grids that carry
  the bed's depth:
  - turquoise to deep blue, with foam tracing the real shoreline;
  - procedural ripples with stepped crests, a sky fresnel and a hard sun spark;
  - the stream gets its own thin foam, and the waterfall has its own falling streaks;
  - the race's swim strips use it too (`paintedWater`, `channelGeometry`, opaque).
- **CPU:**
  - Ground height is now a lazily built 0.25-unit tile grid (`terrain-shape.ts`). The exact
    sum, which had been 20% of a throttled frame, now only builds the mesh and the grass.
  - The governor steps through CPU savings once fewer pixels stop helping:
    1. outlines;
    2. the second grass pass and bloom;
    3. shadows every fourth frame.
    Savings come back before sharpness, and one that was needed stays.
- **Numbers (headless Edge, GTX 1080, 375×812 at 4× CPU throttle, two 10 s runs each, main →
  this):** day 44.6/40.1 → 53.7/51.4 fps, zoomed out 42.2/42.5 → 44.7/43.1, night
  46.7/42.5 → 49.7/47.3. Desktop holds 57 (headless cap). 583 tests, lint and build pass.

Stubbed: the waterfall was not filmed close up (its streaks and foam are unverified on
screen); rain still greys the grade; the Hollow, buildings, props, sky and particles are
untouched (next passes); visit-set trees do not sway (no clock there). Known bugs: none new.
Not checked on a real phone.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

