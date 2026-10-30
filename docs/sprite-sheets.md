# Hand-drawn sprite sheets (LOOK-71)

The Pixel renderer draws every creature in code. A species can instead use a hand-drawn
sheet, with no code change:

1. Put the image in `public/sprites/` (PNG, transparent background, no smoothing).
2. Beside it, `public/sprites/<species id>.json`:

   ```json
   {
     "image": "chao.png",
     "cell": [64, 64],
     "frames": {
       "idle:front:0": [0, 0, 64, 64],
       "idle:frontQuarter:0": [64, 0, 64, 64]
     }
   }
   ```

3. Add the species id to `public/sprites/manifest.json`: `{ "species": ["chao"] }`.

The species id is the `id` in `src/sim/species.ts` (`chao`, and the pocket and digital ids).

## Frame keys

`<clip>:<angle>:<index>`, as in `src/render/sprites/animations.ts`:

| Clip | Frames | Clip | Frames |
| --- | --- | --- | --- |
| idle | 8 | eat | 3 |
| walk | 6 | swim | 2 |
| happy | 2 | flap | 2 |
| sad | 2 | love | 2 |
| sleep | 2 | tumble | 4 |

Angles: `front`, `frontQuarter`, `side`, `backQuarter`, `back`. Side views face right; the
renderer mirrors them for the other three directions. A cell is 64×64 for a Nubbin (the
32 px design grid at 2×), with the feet on the bottom row.

Frames may be left out. A missing frame borrows the same clip's first frame at that angle,
then the idle frame at that angle, then the front idle (`completeFrameMap`), so a sheet with
only the five idle angles already works.

## What stays generated

Eggs and cocoons, the hats and accessories drawn onto generated frames (a hand-drawn sheet
is used as it is), and the Full 3D figures. A glTF path for 3D is not built yet.

A missing or broken file is ignored and the generated art stays; nothing is logged.
