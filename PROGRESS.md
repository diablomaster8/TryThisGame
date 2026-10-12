# PROGRESS.md

Read this with CLAUDE.md at the start of every session.

## Current milestone: M0 Foundation — built and verified locally, waiting on deploy + phone check

**Done when:** the deployed test scene runs at 60 fps on a phone. Lint, format, typecheck,
tests and build all pass on this machine (2026-10-12). The scene was smoke-tested in the
desktop browser pane: rotate (buttons and Q/E), zoom toggle, portrait re-fit, no console
errors. The first deploy and the 60 fps phone check are still to do (see "Next steps").

## What works

- **Scaffold.** Vite 8 + TypeScript (strict) + Three.js 0.186.1 (exact pins, no `^`/`~`),
  Vitest, ESLint (flat config) and Prettier. Scripts: `dev`, `build`, `preview`, `test`,
  `lint`, `format`, `format:check`, `typecheck`. Folder layout from CLAUDE.md, with only
  the M0 files.
- **Architecture guard.** ESLint forbids Three.js, DOM globals and `Math.random` inside
  `src/sim/**` (the folder is still empty; the rule is ready for M1).
- **Low-res pipeline** (`src/render/pipeline.ts`). The canvas backing store is 270 px tall
  with width from the viewport aspect; CSS stretches it with `image-rendering: pixelated`.
  Pixel ratio capped at 1. Resize, rotation and `visualViewport` changes re-size the frame.
  Verified: 1280×720 viewport → 480×270 frame; 375×812 portrait → 125×270.
- **Orbit camera** (`src/render/camera.ts`). Orthographic, 35° pitch, 45° yaw steps with a
  180 ms eased snap (instant under `prefers-reduced-motion`). Two zoom levels defined as
  8 and 16 low-res pixels per world unit, so pixel art stays on integer ratios.
- **Controls** (`src/input/camera-controls.ts`, `src/ui/camera-buttons.ts`). Q/E or [ ]
  rotate, +/- and mouse wheel zoom, three 48 px on-screen buttons, two-finger swipe rotates,
  pinch zooms (one gesture per touch session).
- **Test scene** (`src/render/test-scene.ts`). Code-generated 8×8 grass tile on a 32×32
  ground, low-poly tree (cylinder + icosahedron, flat shaded), one 32×32 code-drawn
  placeholder sprite on a bottom-anchored billboard that faces the camera.
- **FPS counter** (`src/ui/fps.ts`), rendering paused while the tab is hidden.
- **Tests.** 13 Vitest cases for the frame-size math and camera math (`tests/render/`).
- **Deploy workflow.** `.github/workflows/deploy.yml` lints, tests, builds and publishes to
  GitHub Pages on every push to `main`.

## What's stubbed

- The sprite is a placeholder blob. The real layered Nubbin generator, the 5 angles and
  animations are M1 (`src/render/sprites/`).
- `src/sim/`, Keeper movement, HUD, debug panel, settings: not started (M1).
- No texture atlas yet; one sprite, one draw call, so it does not matter until M1.
- The repo is not on GitHub yet, so the deploy workflow has not run.

## Known bugs / open items

- The Claude desktop browser pane throttles `requestAnimationFrame`, so the FPS counter
  reads 0–4 there. That is the pane, not the pipeline. Check fps in a normal browser.
- Portrait phones get a 125 px-wide frame (spec: 270 px tall, width from aspect). It looks
  very chunky in portrait. If that is too coarse, change `RENDER.targetHeight` or add a
  minimum-width rule in `computeTargetSize`; it is one function. Decision deferred to the
  phone check.
- Non-integer CSS upscaling can give slightly uneven pixel columns on some screens. The
  fallback (render to a `WebGLRenderTarget`, blit through a full-screen quad) is contained
  in `pipeline.ts`.

## Assumptions made (not stated in CLAUDE.md)

- Camera is **orthographic**. It keeps every sprite pixel the same size, which suits the
  pixel-art look. Switching to perspective is a small change in `camera.ts`.
- Billboards rotate around Y to face the camera **and** tilt back by the camera pitch, so the
  sprite plane is perpendicular to the view and never foreshortened. With a fixed pitch this
  looks the same as "face the camera around the vertical axis only". Kept on purpose after
  review (2026-10-12); switch to Y-only in `billboard.ts` if the tilt causes problems in M1.
- **TypeScript is pinned at 6.0.3**, not 7.x: typescript-eslint 8.71 supports TypeScript
  `<6.1`. Bump when typescript-eslint catches up.
- **Static host: GitHub Pages** via GitHub Actions (no extra account needed).
- `image-rendering: pixelated` alone is enough; the `crisp-edges` override was removed because
  it took precedence in Firefox and Safari and is not needed for nearest-neighbor.

## Toolchain notes (this machine, 2026-10-12)

- The project folder was copied from another machine; the git history came with it but the
  tools did not. Installed via winget (community source, no msstore agreements):
  - Git 2.55 at `C:\Program Files\Git\cmd` (the installer elevated despite `--scope user`).
  - fnm 1.39 at `%LOCALAPPDATA%\Microsoft\WinGet\Links`, Node 24.21.0 at
    `%APPDATA%\fnm\node-versions\v24.21.0\installation`.
- Both directories were appended to the **user** PATH. Shells opened before that need
  `$env:Path = "$env:APPDATA\fnm\node-versions\v24.21.0\installation;C:\Program Files\Git\cmd;$env:Path"`.
- `.claude/launch.json` only attaches to `http://localhost:5173`; start `npm run dev` yourself.

## Next steps (to finish M0)

1. **First deploy:** create an empty GitHub repo, then
   `git remote add origin <url>` and `git push -u origin main`. In the repo settings,
   Pages → Build and deployment → Source: **GitHub Actions**. The workflow publishes to
   `https://<user>.github.io/<repo>/`.
2. **Phone check:** open the Pages URL on a phone (or `npm run dev -- --host` on Wi-Fi and
   open the Network URL). Confirm the FPS counter reads 60, rotation and pinch work, and
   rotating the phone re-fits the frame.
3. Confirm 60 fps from the deployed link, then tag: `git tag m0 && git push --tags`.
