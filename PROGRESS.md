# PROGRESS.md

Read this with CLAUDE.md at the start of every session.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

## Current milestone: M1 Grove and first Nubbin — COMPLETE (2026-10-12)

**Done when:** from a fresh load you can hatch, pet and feed a Nubbin within 60 s, and a
reload restores the game exactly. Both verified (desktop browser pane + Vitest). Lint,
format, typecheck, 74 tests and the build pass.

**Live:** https://diablomaster8.github.io/TryThisGame/ (repo
https://github.com/diablomaster8/TryThisGame, Pages source: GitHub Actions).

## Art direction (Maor, 2026-10-12)

The Nubbins are Chao-faithful fan art (CLAUDE.md was updated). The full Chao catalogue
and where it lands:

| Forms                                                             | Count            | Milestone |
| ----------------------------------------------------------------- | ---------------- | --------- |
| Eggs: normal + shop colour variants                               | 1 + ~20          | M1 / M4   |
| Child: Neutral, Hero-leaning, Dark-leaning                        | 3                | M1 ✓      |
| Adult first evolution: Neutral/Hero/Dark × Normal/Swim/Fly/Run/Power | 15            | M2        |
| Adult second evolution: type-pair overlays                        | 60 (75 total)    | M2        |
| Chaos Chao: Light, Dark, Neutral                                  | 3                | M3        |
| Character Chao (Tails, Knuckles, Amy, NiGHTS…)                    | ~6 unlockables   | M5        |
| Shiny, jewel, two-tone colour variants                            | palette layers   | M4        |

The art is drawn in code from memory (`src/render/sprites/chao.ts`), never from copied
assets. Reference images dropped into the project would let the drawer be matched closer.
Check any sheet at `?sprites` (developer gallery).

## What works (M0 + M1)

- **Scaffold / pipeline / camera / controls** (M0): see git history. Camera now re-applies
  its pose every frame and follows the Keeper.
- **Sim core** (`src/sim/`, no DOM, no Three.js, ESLint-guarded):
  - `types.ts` plain-data world with the v2 future fields (`genes`, `skills`,
    `karateRecord`) empty by default.
  - `rng.ts` mulberry32, one serialisable state word, stored in the world.
  - `clock.ts` fixed 100 ms steps, time scale ×1–×1000, per-frame step cap with coarse
    overflow.
  - `world.ts` commands in, events out. Trees drop fruit, items fall, Keeper intents.
  - `needs.ts` hunger 20 min, energy 40 min, naps 3 min, happiness −100..100 with drift,
    affection 0..100; moods for the face and emote ball.
  - `stats.ts` grades E–S with multipliers, 99-level cap. `alignment.ts` ±0.01 nudges,
    bands at ±0.5, type-lean winner with the 15 % margin.
  - `lifecycle.ts` egg → child (60 min) → cocoon (30 s) → adult; evolution picks the form.
  - `behavior.ts` wander, find food, eat, nap, sit, greet, cry, swim, react, held,
    carried, thrown. Throws arc with gravity; landing hurts.
  - `keeper.ts` walk by tap target or input vector, intents (pet, pick up, feed, shake
    tree, collect) executed on arrival, carrying above the head.
  - `save.ts` v1 with an (empty) migration table, validation/defaulting, fingerprint.
  - `offline.ts` catch-up: fine steps under 3 min, 1-minute coarse steps beyond; modes
    indefinite/capped/off; Nubbins eat tree fruit while away; evolutions reported.
- **Sprites** (`src/render/sprites/`): index-buffer PixelCanvas, atlas builder,
  8-view angle table (5 drawn + 3 mirrored), Chao child with 8 clips + 3 stills in neutral
  / Sun / Moon palettes, adult recolours for all 15 first evolutions, 6 egg colours with
  wobble/crack frames, cocoon, Sun/Moon Keeper, fruit, flower, emote ball shapes.
  `SheetCache` keyed by style; `sheetFromImage` for hand-drawn sheets later.
- **Render**: Grove scene (grass, pond, hills, 2 trees, waterfall, bushes), SpriteView
  billboards with UV frames and ground shadows, WorldView with step interpolation.
- **Input**: tap ground to walk, tap Nubbin to select, tap fruit to collect, tap tree to
  shake, drag Nubbin to lift / throw, shake by reversals, WASD/arrows relative to the
  camera, space shakes a carried egg. Two-finger gestures still rotate/zoom.
- **UI**: top bar (logo, Shells, fruit, Settings), stats sheet (meters with icon+label,
  stats with grades, Pet / Pick up / Put down / Feed / Shake, rename), Settings (Aging
  while closed with validation, departures toggle disabled when mode is off, export /
  import / reset save), While you were away, debug panel (` or triple-tap logo), toasts,
  carry chip, catch-up overlay.
- **Game loop** (`src/game.ts`): autosave every 30 s and on hide/pagehide, catch-up on
  load and on tab show, storage failures only toast.
- **Tests**: 74 Vitest cases (sim rules, world determinism, save round-trip, offline
  modes incl. the 7-day < 3 s check, sprite math).

## What's stubbed

- Adult forms are recolours of the child shape; the real adult silhouettes, the part
  slots (critter parts) and the second-evolution overlays are M2.
- `play` behavior waits for toys (M4). Critters/essences buttons in the debug panel are
  M2 placeholders.
- End of life, rebirth, departure, Eternal: M3 (`debugForceEndOfLife` only jumps the
  stage timer).
- Sun/Moon Grove recolours, grade upgrade at evolution: M2.
- Sound, PWA, reduced-motion beyond the camera snap: M5.

## Known bugs / open items

- The Keeper walks straight through the pond to reach a swimming Nubbin. Add a shoreline
  stop or let the Keeper wade visibly (M2 polish).
- The Claude desktop browser pane throttles `requestAnimationFrame` to 0–3 fps, so
  time-based checks there were driven by calling `grove.frame()` from the console. On a
  normal browser the loop runs at the display rate.
- Portrait phones get a 125 px-wide frame. Revisit once the Grove is busier.
- Non-integer CSS upscaling can give uneven pixel columns; the render-target fallback is
  still the documented option in `pipeline.ts`.

## Assumptions made (not stated in CLAUDE.md)

- Camera is orthographic; billboards tilt back by the pitch (see M0 notes).
- Dragging lifts the Nubbin under the pointer without the Keeper; the Keeper carries via
  the sheet's Pick up button. Both are "pick up"; the sheet route is the kid-friendly one.
- Feeding uses the fruit inventory (collected by tapping fruit on the ground). A hungry
  Nubbin also eats ground fruit on its own.
- Happiness drifts toward 0 by 0.5/min so moods fade. Starving costs 2/min.
- The adult form rule (band × winning type) already runs in M1 so catch-up can report
  evolutions; the grade upgrade and Grove unlocks join it in M2.
- `src/platform/storage.ts` is a small folder outside the CLAUDE.md tree for the
  localStorage wrapper; sim/ must not touch storage.
- TypeScript stays at 6.0.3 until typescript-eslint supports 6.1+.

## Toolchain notes (this machine, 2026-10-12)

- Git 2.55 at `C:\Program Files\Git\cmd`; Node 24.21.0 via fnm at
  `%APPDATA%\fnm\node-versions\v24.21.0\installation`. Both on the user PATH; the Claude
  shell needs `$env:Path` prefixed with them.
- GitHub pushes work non-interactively (Git Credential Manager has the token).
- `npm run dev` then `http://localhost:5173/` (game) or `/?sprites` (gallery). In dev the
  game is exposed as `window.grove` for console poking.

## Next steps

1. **M2 Growth** (see CLAUDE.md): stats sheet already shows levels/grades; add critters
   (15 species, parts, type lean), essences, Keeper switching, evolution with all 15
   forms drawn properly + the 60 second-evolution overlays, grade upgrade with a
   celebration, Sun/Moon Grove recolours, unit tests. Done when a scripted ×100 run of
   critters and actions produces the predicted adult form.
2. Then M3, M4, M5 per CLAUDE.md, under the standing approval above.
