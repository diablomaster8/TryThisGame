# Architecture map

Generated from the real tree on 2026-10-30 (about 1,080 `.ts` files in `src/`). Grep for names; never
browse. Line numbers drift, so search for the function name given.

## How the pieces talk

```
 input/game-input.ts ─┐                         ┌─> render/world-view.ts (WorldView, pixel)
 ui/*  (hud.ts hooks) ─┼─ game.send({kind:...}) │   render3d/grove-3d-scene.ts (Grove3dScene)
                       v                        │   ui/hud.ts hooks.onEvents / panels
 src/game.ts  Game.pending[] ──> sim/world.ts applyCommand(world, cmd, events)
              Clock.advance ──> sim/world.ts stepWorld()  (10 steps/s, sim/clock.ts)
                       │
                       └─ World (sim/types.ts) read-only ─┴─ + SimEvent[] each frame
```

- `Command` and `SimEvent` are discriminated unions in `src/sim/types.ts` (`export type Command`,
  `export type SimEvent`); `World` and `Nubbin` live there too.
- `Game.send` only queues; the frame loop in `src/game.ts` applies the queue, runs the steps,
  then hands events to the active renderer's `onEvents` and to `hooks.onEvents` (`ui/hud.ts`).
- Minigames (`src/minigames/`) and battle screens drive their own sim state (`sim/race.ts`,
  `sim/battle/`); the hosting panel reports the result as a command (e.g. `raceResult` in
  `ui/races.ts`).

## Boot sequence

1. `src/main.ts` `route()`: `?sprites`, `?style3d`, `?retro3d`, `?aaa` load sample pages lazily
   (`src/samples/*-styles.ts`); `?edu` (dev), `?free` and a Graphics-change resume skip the title.
2. Otherwise `ui/title.ts` `showTitle` picks a slot (`platform/storage.ts` `setSaveSlot`) while
   `loadStoryScripts()` prefetches the story chunks.
3. `startGame`: WebGL2 check, `ui/loading-bar.ts`, then `storyChunksBeforePlay` in
   `src/story-chunks.ts` decides which story chunks must load first.
4. Full 3D only: `import('./render3d/grove-3d-scene')`, `prewarmCreatures()`, `new Grove3dScene`.
5. `boot`: `mountHud` (`ui/hud.ts`), `new Game(...)` (`src/game.ts`), resize and FPS loops;
   in production it registers `public/sw.js` (build id stamped by `vite.config.ts`).
6. `Game` loads the slot (`sim/save.ts` `deserialize`), then offline catch-up (`sim/offline.ts`
   `catchUpInChunks`, from `runCatchUp` in `game.ts`) and the "While you were away" card.

Lazy chunks (only the story ones go through `loadOnce`, `src/sim/load-once.ts`, which retries):
- `sim/story-scenes.ts` `loadStoryScripts` (campaign, side stories, storylines) and
  `loadEduScripts(bands)` (Learning Grove per band).
- `sim/atlas.ts` `loadAtlas`, plus the Arcade, Multiverse and Neopia catalogues (plain `??=` caches).
- `ui/hud.ts` imports `debug-panel` and `tactics-screen` on demand; `ui/tactics-screen.ts` and
  `minigames/expedition/screen.ts` pull their `render3d/` views; `ui/lang-fonts.ts` the fonts.

## Folders

| Path | Purpose |
| --- | --- |
| `src/main.ts`, `src/game.ts` | Boot and routing; the `Game` loop, command queue, saves, catch-up. |
| `src/story-chunks.ts` | Which story chunks a slot needs before its first frame. |
| `src/sim/` | Game rules only: no DOM, no Three.js, seeded `rng.ts`. ~230 files. |
| `src/sim/battle/`, `battle/tactics/` | Battle core (`index.ts`), moves, foes, ladder; the tactics grid. |
| `src/sim/dungeon*.ts`, `dungeon-pieces/` | The Hollow Below (generation, party, traps, towns). |
| `src/config/` | Every tunable (`tuning*.ts`), string (`strings*.ts`), staging (`scene-stages*.ts`). |
| `src/content/` | Story scripts as data (`types.ts`, `STYLE.md`, `STORY-BIBLE.md`, `EDU-STYLE.md`). |
| `src/render/` | Pixel renderer: `pipeline.ts` (low-res target), `grove-scene.ts`, `world-view.ts`. |
| `src/render/sprites/` | Code-drawn pixel sprites: palette, parts, angles, animations, atlases. |
| `src/render/paint/` | Painters for ground, buildings, interiors and story art. |
| `src/render3d/` | Full 3D mode (a Graphics setting): scene, actors, dressing, workers. |
| `src/samples/` | 3D species format and builders (`species.ts`, `sculpted.ts`) used by render3d. |
| `src/ui/` | HTML/CSS over the canvas; `hud.ts` mounts everything. |
| `src/input/` | Pointer, keys, camera gestures, shake; sends commands. |
| `src/platform/` | Browser glue: storage, IndexedDB mirror, audio, haptics, error watch. |
| `src/minigames/` | Expedition, race, micro, tank, tactics and battle playback views. |
| `tests/sim/`, `tests/render/`, `tests/ui/` | Vitest suites (`tests/**/*.test.ts`). |
| `tests/tools/` | `content-check.ts`, `script-book.ts`, bundle budget, probes, sample generators. |
| `public/` | `sw.js`, `manifest.webmanifest`, icons, audio, sprite manifest, licences. |
| `docs/`, `script-book/` | Design docs and reviews; readable screenplays generated from `src/content/`. |

## Pass codes in file names

Campaign graphics work items carry ids C/M/H/N (packages 1 and 2) and K (package 4) in headers.
- `a`, `b`, `c`, `d`, `e`, `f`: campaign-graphics package (1st set). a light and grade, b gate and
  landmarks, c story places, d props and items, e people and lanterns, f looks, cards, sets.
- `k`, `p`, `s`, `u`, `w`, `x`, `y`: campaign-graphics-2 packages (k landmark kits, s Root Node
  and digital sets, w winter/water/Hush, x lychgate and occluder, y light and grade). `f2` is
  its wave 0 (shared staging).
- `a1`, `a2`, `b4`, `c4`, `d4`, `e4`, `u4`: campaign-graphics-4 packages (a1 poses, a2 walk-ons,
  b4 people, c4 interiors, d4 weather and wind, e4 world detail, u4 story UI). `f4` is its wave 0.
  No "graphics-3" package code appears in file names.
- `dress-<pkg>.ts`: that package's story dressing, one per renderer (`render/` and `render3d/`),
  plugged into the registries in `render/dressings.ts` and `render3d/dressings.ts`.
- `kit-*`, `*-kit.ts`: merged-mesh model kits (render3d) or shared helpers (`sim/payoff-kit.ts`,
  `content/edu-kit.ts`, `config/scene-stages-kit.ts`). Not a pass code.
- `sets-s.ts`, `stage-sets.ts`, `dress-f-sets.ts`: which story set a frame draws.
- `scene-stages-pkg-<pkg>.ts`: one package's stage data by scene id, merged in `config/scene-stages.ts`.
- `tuning-<pkg>.ts`, `strings-<pkg>.ts`: that package's numbers or text, re-exported from
  `tuning.ts` / `strings.ts`. `tuning-pkb.ts` is egg odds from agent pkB (pocket line).
- `-r5` .. `-r8`: recommendation rounds 5 to 8 ("Lane A round 8 (SOUL)", "lane C round 5" etc.).
- `tuning-px.ts`: pixel renderer fixes of 2026-10-25 (imported directly, not re-exported).
- Content ids are a separate scheme: `atlas-aNN` (Atlas pages), `arcade-paN`, `expansion-eN`,
  `side-stories-sNN`, `edu-<id>-sprout|reader` (Learning Grove bands). `atlas-a1` is not package a1.
- Recs ids `R0nnn`, `TECH-nn`, `FIGHT-nn`, `SOUL-nn` in comments index `docs/` recommendation lists.

## Where do I add...

- **A sim command**: add a member to `Command` in `src/sim/types.ts`, a `case` in `applyCommand`
  (`src/sim/world.ts`), then call `game.send({ kind: ... })` from `ui/` or `input/`.
- **A SimEvent**: add it to `SimEvent` in `src/sim/types.ts`, push it in the sim; react in a
  renderer's `onEvents` or `ui/hud.ts` `onEvents`.
- **A tunable**: `src/config/tuning.ts` or the lane's `tuning-*.ts` (add `export * from` in
  `tuning.ts`); newer lanes (`tuning-px.ts`) are imported directly from their own file.
- **A player-facing string**: `src/config/strings.ts` or a `strings-*.ts` re-exported from it.
- **A sound**: add a `SoundName` and its `case` in `playSound` (`src/platform/audio.ts`); trigger it
  from an event handler in `ui/hud.ts`. Music is `playSong`.
- **A story scene or script**: data in `src/content/` per `STYLE.md`; register side stories in
  `sim/side-story-content.ts`, storylines in `sim/storyline-content.ts`, Atlas pages in
  `sim/atlas-catalogue.ts`. Validate with the three checks in CLAUDE.md plus `script-book.ts --check`.
- **A save field**: the type in `src/sim/types.ts`; bump `SAVE_VERSION` and append to `MIGRATIONS`
  in `src/sim/save.ts`; check `validateWorld` and `tests/sim/` save tests.
- **A UI panel**: a class in `src/ui/` built with `ui/dom.ts`, constructed in `mountHud`
  (`ui/hud.ts`) and registered with the panel stack (`ui/panel-stack.ts`).
- **A test**: `tests/sim/<topic>.test.ts` for rules (no DOM), `tests/render/` or `tests/ui/` for
  pure helpers; `npm test` runs `tests/**/*.test.ts`.

## Find it fast

| Question | Where |
| --- | --- |
| Where are race rivals generated? | `src/sim/race.ts` `createRace` (count and levels from `RACE.rivals` / `RACE.rivalLevels` in `config/tuning.ts`; seed `raceSeedFor`). |
| Race screen and track | `src/minigames/race/screen.ts`, `view.ts`, `pixel-track.ts`; results `ui/race-results.ts`. |
| Which adult form evolves? | `sim/lifecycle.ts` `evolve` -> `sim/species.ts` `nextSpecies`; `alignment.ts` `bandOf`, `winningType`. |
| Rebirth, departure, Eternal | `sim/lifecycle.ts` `runEndOfLife`, `rebirth`, `depart`, `eternalBandFor`. |
| Offline catch-up | `sim/offline.ts` (`allowedSpan`, `catchUpInChunks`, `coarseStep`); called from `game.ts` `runCatchUp`. |
| Save migrations | `sim/save.ts` `MIGRATIONS`, `SAVE_VERSION`; slots `platform/storage.ts`; mirror `platform/save-mirror.ts`. |
| Behaviour state machine | `sim/behavior.ts` `updateBehavior`; idle weights `sim/idle-choice.ts`; `sim/personality.ts`. |
| Debug panel | `ui/debug-panel.ts` (`DebugPanel`), lazy-mounted in `ui/hud.ts` (dev or `?debug`); FPS `ui/fps.ts`. |
| Service worker | `public/sw.js`, registered in `src/main.ts`; update card `ui/update-notice.ts`. |
| Stats sheet | `ui/stats-sheet.ts` (`StatsSheet`); grades and levels `sim/stats.ts`. |
| Settings, "While you were away" | `ui/settings.ts`, `ui/away-screen.ts`. |
| Needs, fruit, critters | `sim/needs.ts`, `sim/world.ts`, `sim/critters.ts`. |
| Shop and economy | `sim/shop.ts`, `sim/economy.ts`, `ui/shop.ts`. |
