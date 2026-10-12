# PROGRESS.md

Read this with CLAUDE.md at the start of every session.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

## Current milestone: M5 Races, personality, polish — BUILT (2026-10-12, tag `m5`)

**Done when:** every acceptance check in CLAUDE.md passes. The automated ones do (see
"Acceptance checks" below). The manual device pass is Maor's: iPhone Safari (browser and
home screen), Android Chrome, desktop Chrome/Safari/Firefox, 60 fps with 8 Nubbins,
blocked storage, no console errors. The build is deployed for that pass.

## M4 Expedition and shop — COMPLETE (2026-10-12, tag `m4`)

**Done when:** a run is fun on a phone and its rewards reach the Grove. Rewards verified
in the browser (results screen → Shells, Essences and Critters in the inventory) and in
`tests/sim/expedition.test.ts`; the run logic is deterministic, a tap jumps and a hold
jumps higher, obstacles cost Shells and never end the run. The "fun on a phone" half
still needs Maor's thumb on the deployed build (see Next steps). 109 tests, lint, build
pass.

## M3 Life cycle — COMPLETE (2026-10-12, tag `m3`)

**Done when:** egg → adult → rebirth → adult keeps everything correctly, and Eternal
follows the rules exactly. Verified by `tests/sim/lifecycle.test.ts` (a full life at
×1000: name, 10 % of points, grades, affection and rebirth count kept, heart greeting;
departure leaves a memorial; Eternal only with 2+ rebirths, Normal type and alignment
> 0.8 / < −0.8 / within 0.1 of 0, and never otherwise; Eternals never age; offline end
of life waits with departures off, departs with it on, rebirths always happen) and in
the browser (forced end of life → fading cocoon → flower; loved adult → golden cocoon →
egg → hatch with a heart). 97 tests, lint, build pass.

Earlier the same day: M1 (tag `m1`) and M2 (tag `m2`), see the sections below.

**Live:** https://diablomaster8.github.io/TryThisGame/ (repo
https://github.com/diablomaster8/TryThisGame, Pages source: GitHub Actions).

## Art direction (Maor, 2026-10-12)

The Nubbins are Chao-faithful fan art (CLAUDE.md was updated). The full Chao catalogue
and where it lands:

| Forms                                                             | Count            | Milestone |
| ----------------------------------------------------------------- | ---------------- | --------- |
| Eggs: normal + shop colour variants                               | 1 + ~20          | M1 / M4   |
| Child: Neutral, Hero-leaning, Dark-leaning                        | 3                | M1 ✓      |
| Adult first evolution: Neutral/Hero/Dark × Normal/Swim/Fly/Run/Power | 15            | M2 ✓      |
| Adult second evolution: type-pair overlays                        | 60 (75 total)    | M2 ✓      |
| Chaos Chao: Light, Dark, Neutral (the Eternals)                   | 3                | M3 ✓      |
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
- **Growth (M2)**: `sim/critters.ts` with the 15 species (3 per type, each with its
  part slots), `giveCritter` / `giveEssence`, type lean; `lifecycle.ts` evolution with
  the permanent grade upgrade, Sun/Moon Grove unlocks and the second evolution an hour
  into adult life; `world.grove` + `setGrove`; swimming trains Swim lean slowly.
- **Sprites (M2)**: `layout.ts` (shared geometry + `ChaoShape`), `parts.ts` (parametric
  ears/tail/arms/back for every species at all five angles), type silhouettes (Swim
  head fins, Fly big wings, Run legs, Power wide body and hands), second-evolution
  lighter touches; sheet keys include type, second and parts.
- **UI (M2)**: Give section on the stats sheet (critters and essences from the
  inventory), Keeper switch (☀/☾) and Grove switcher in the top bar (shown once a Grove
  is unlocked), evolution celebration card, debug +critters / +essences.
- **Life cycle (M3)**: `lifecycle.ts` runs the end-of-life check at 5 h of adult life
  (`runEndOfLife`): rebirth cocoon → `rebirth()` (egg again, same name, 10 % points,
  grades + upgrades, affection, rebirths +1, heart greeting on hatch) or departure
  cocoon → `depart()` (removed, memorial flower at its spot). `eternalBandFor` applies
  the Eternal rules at evolution; Eternals skip aging. Offline: `awaitingKeeper` freezes
  the adult at the check when departures are off; live play re-runs the check on screen
  (a Nubbin loved in the meantime is reborn instead). `TYPE_LEAN.minToCount` (20) keeps
  incidental pond time from making Swim types.
- **Art/UI (M3)**: three cocoon looks (evolve / rebirth glow / depart fade), Chaos-form
  palettes with great wings for Eternal Sun / Moon / Neutral (+ a star emote), memorial
  flower sprites, toasts and away-screen lines for cocoons, rebirths, departures,
  Eternals and waiting Nubbins; the sheet shows ✦ Eternal and "Waiting for you".
- **Expedition (M4)**: `src/minigames/expedition/run.ts` is pure, seeded, fixed-step
  logic (scroll with a gentle speed ramp, variable-height jump, patterns of shells,
  obstacles with shell arcs, essences, critters in bubbles). `screen.ts` draws it on a
  low-res 2D canvas (height 270, width from the aspect, letterboxed) with parallax
  clouds, hills, a grassy ground row; the runner is the selected Nubbin's own side-view
  walk/flap frames. Tap or hold the canvas, or space/↑/W. Results screen → `addRewards`.
  The Grove keeps simulating underneath with rendering paused.
- **Shop (M4)**: `sim/shop.ts` (fruit, egg with a 15 % rare colour chance and the roster
  cap of 8, hat into the collection, ball toy with a cap of 3) and `ui/shop.ts`.
- **Toys (M4)**: `play` behavior: walk to the ball, bat it around, a little happiness.
- **Races (M5)**: `sim/race.ts` with 3 courses built from swim / fly / run / climb /
  stamina-stretch sections, each checking its stat; stamina drains into a 1.5 s rest;
  3 tiers with 4–8 seeded rivals whose levels scale with the tier; cheer boost (×1.45
  for 1.2 s, once per 3 s); prizes 20/10/5 Shells × tier and a hat on a win; winning a
  tier unlocks the next (`world.races`). `minigames/race/screen.ts` draws a side view
  with lanes stacked in depth on the same low-res canvas style, a big Cheer button
  (space on desktop), live placement and the player's stamina bar.
- **Personality (M5)**: `sim/personality.ts` decides Cheerful / Shy / Mischievous /
  Lazy at evolution from childhood pets, throws and feeds, and only shifts idle odds
  (greet, play, sit, swim).
- **Roster (M5)**: `ui/roster.ts` with portraits, rename, stats with grades, age,
  rebirths, alignment word + icon, personality, hat picker ("wearHat"), Go to.
- **Hats (M5)**: five styles drawn on the crown at all angles (straw, crown, beanie,
  flower, bucket); bought in the shop or won in races.
- **Sound (M5)**: `platform/audio.ts` synthesizes blips (no audio assets); muted until
  the first tap or click; a Sound toggle in Settings lives in the save.
- **PWA (M5)**: `public/manifest.webmanifest`, generated icons (`tests/tools/
  make-icons.test.ts` with `MAKE_ICONS=1`), hand-rolled `public/sw.js` (stale-while-
  revalidate, offline shell), registered only on the built site.
- **Reduced motion**: instant camera snaps, no toast/celebration animation, no meter
  transition.
- **Tests**: 119 Vitest cases (+1 skipped icon writer).

## Acceptance checks (CLAUDE.md v1)

Automated, all green in `npm test`: grade multipliers; the 99 level cap; 10 % carried
over on rebirth; type-lean and alignment thresholds; a full life at ×1000; Eternal when
met and never otherwise; save export → import identical (round-trip fingerprint);
older saves migrate (the table is empty at v1, the loader defaults missing fields);
aging while closed in all three modes; the 7-day indefinite catch-up under 3 s; with
departures off no departure during catch-up and the check runs live.

Manual (Maor): iPhone Safari in the browser and installed to the home screen; Android
Chrome; desktop Chrome, Safari, Firefox; 60 fps with 8 Nubbins; blocked storage does
not crash (the storage wrapper swallows errors and toasts once); no console errors; no
names, art or audio from an existing franchise (the Nubbins are Chao-faithful fan art
by Maor's decision; names, music and sound are original).

## What's stubbed

- Shiny / jewel / two-tone body colour variants: not drawn yet (egg colours are).
- Character Chao looks (Tails, Knuckles, Amy, NiGHTS…): not drawn yet; they would be
  hat-like overlays once Maor wants them.
- `vite-plugin-pwa` 2.0 supports Vite 8 but pulls in workbox; a 40-line service worker
  does the job for v1. Swap if precache manifests are wanted.
- An on-screen joystick (optional per CLAUDE.md) is not built; tap-to-move covers phones.

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

1. **Device test pass (Maor):** open https://diablomaster8.github.io/TryThisGame/ on
   iPhone Safari (and Add to Home Screen), Android Chrome and the desktop browsers.
   Check fps with 8 Nubbins (buy eggs in the shop with debug Shells), the Expedition's
   tap/hold feel, a race in portrait, and that nothing logs to the console.
2. Polish backlog after the pass: body colour variants, character looks, Keeper
   pond-wading, a joystick if tap-to-move feels wrong on a phone.
