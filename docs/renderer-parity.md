# Renderer parity checklist (TECH-13)

Two renderers must show the same game: Pixel 2.5D (`src/render/`) and Full 3D
(`src/render3d/`). This is the single list of what has to match. A row is **checked** when a
test asks both renderers the same question; **open** rows name what is missing.

The shared vocabulary is `src/render-common/visual-state.ts` (`VisualState`). Pixel's
`clipFor` and 3D's `poseFor` each map into it, and `tests/render/parity.test.ts` compares them on
200 seeded Nubbin states. Known disagreements are listed in that test (`KNOWN_GAPS`, shrink
only) and in the table below.

| Feature | Pixel | 3D | Test / status |
| --- | --- | --- | --- |
| Body motion states (idle, walk, flap, swim, sleep, eat, sit, sad, cry, happy, love, dizzy, surprised, tumble, held) | `clipFor` | `poseFor` | checked: `tests/render/parity.test.ts` (200 seeds). Gap: while being petted Pixel plays `happy`, 3D leans in (`pet`) |
| Every `ClipName` has a state | `animations.ts` | n/a | checked: parity.test.ts |
| Emote balls (5) | `emoteFor` | `emoteFor` (same function, shared) | shared code; `tests/render/emote-spring.test.ts` |
| Alignment hints | sprites | `actors.ts` | open: no shared test |
| 15 + 60 forms | `render/sprites/*` | `samples/species*.ts` | `tests/render/digi-art.test.ts` and the species tests cover each side; open: no cross-check |
| Jewel, shiny, two-tone | `gem-finish` | `gem-finish` | `tests/render/gem-finish.test.ts` (shared module) |
| Hats and accessories | `cosmetics` | `cosmetics` | `tests/render/cosmetics.test.ts` |
| Keeper and grandchild look | `sprites/keeper.ts` | `samples/keeper-spec.ts` | open |
| NPCs and story guests | `b4-people` | `actors.ts` | `tests/render/b4-people.test.ts` (Pixel side) |
| Held, thrown, asleep | `clipFor` | `poseFor` | checked: parity.test.ts |
| Weather, seasons, night palette | `grove-scene` | `grove-3d-scene` | open: needs the visual goldens (TECH-12) |
| Hollow floors | `world-view` | `hollow-*` | `tests/render/hollow-*.test.ts` per side; open: cross-check |
| Race and Expedition framing | `race-scene` | `race-scene` | open |
| Reduced motion, particles off | `reduceMotion` | `reduceMotion` | `tests/render/bursts-calm.test.ts` (Pixel); open for 3D |
| Highlight and tap feedback | `world-view` | `actors.ts` | open |

Visual goldens (`npm run test:visual`, `tests/e2e/visual.cjs`) are the check for the rows
marked open once the frame is deterministic (TECH-12).
