# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, currently as samples behind `?aaa=1` with the five-creature roster in the species
format. Latest pass: crisp marks, reference notes and the format doc rewrite. Waiting on Maor:
the pick from expansions E1–E3 and campaigns S1–S4, and his device pass. Subagent briefs
with model picks: `plan.md`. Improvement backlog against the Palworld references:
`docs/creature-improvements.md`. Story content pack: `src/content/`, `script-book/`,
`voiceover/`; backlog index (CV1–CV6, B1–B3, OW, F, S, Q, Multiverse, Neopia, Atlas, Part M):
`docs/content-index.md`.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

## Crisp marks, reference notes, format doc (2026-10-15)

Item 35 of `docs/creature-improvements.md` and the format doc. `Mark.soft: 0` is a crisp edge: `markShade` now takes the
sculpt's vertex spacing (the box's longest side × 1.08 over the grid, the same number
`sculpt` uses) and ramps a zero-soft mark over one cell centred on its edge, so a face
patch, sock or belly split reads sharp without stair-steps. Fennel's nose and chest patch
use it (`docs/samples/marks-fennel.jpg`, `?aaa=1&creature=3&closeup`). `SpeciesSpec.notes`
(optional string, never shown) records which reference frame and pass each species was
last tuned against; filled for all five from the 2026-10-15 passes (the Palworld roster
screenshot for the shape pass, the All Pet Animations video for eyes, petting and the
walk). `docs/species-format.md` rewritten: one row per field of `SpeciesSpec`, `PartSpec`,
`Prim`, `Mark`, `SurfaceOpts`, the eyes, the mouth and `Expression`, each with its default
and an example, plus the stock expression table and the pose table. Lint, 210 tests and
build pass; no console errors on the Fennel closeup.

Not verified: the crisp edge on the other species (none uses `soft: 0` yet) and at the
far camera distance, where one cell is under a pixel. Known: the closeup frames the face,
so the chest patch is only half in `marks-fennel.jpg`.

## Shape pass: digits, per-form blend, tufts (2026-10-15)

Items 9–15 and 32. New: `Prim.blend` (a primitive's own blend radius, in `sculpted.ts`;
`onSurface` honours it too) and `src/samples/species-kit.ts` (`digits`, `tuft`, `tuftRow`).

- **Nubbin.** Before: feet and hands were blobs. After: three yellow toes and a pad on each
  foot, a three-finger mitt on each hand, a crisper crown (blend 0.14 against the body's 0.22).
- **Mossling.** Before: the cap overhung and could hide the eyes in nods. After: cap radius
  1.2 × 1.05 (was 1.4), raised 0.12 and set back 0.2 (`CAP_Z`), rim and sprout crisp; dew
  and gills follow it. Root toes and hand mitts come from `digits`.
- **Fennel.** Before: small head, close-set eyes, fuzzy cheek cones. After: head radii 0.78 ×
  0.68 × 0.66 (was 0.64 × 0.56 × 0.56), eyes wider (x 0.36) and lower (y 1.78), ears
  spread, crisp cheek, crest, chest-ruff and tail-tip tufts (`tuftRow`), three toes and a
  pad per paw. Shells remain for the short underfur.
- **Bolder.** Before: 0.9 scale, a leg span wider than the whole line-up, a seam between
  head and thorax. After: scale 0.72 (big by design: widest, not tallest), the head's
  ellipsoid also sits in the torso sculpt so the thorax blends into it (no seam), horns and
  palps crisp (0.04), two-toed claws from `digits`.
- **Wisp.** Before: the core ellipsoid lay inside the body and never showed. After: it sits
  on the belly, poking 0.27 through, plus a mesh with its own emissive material (pulsing,
  not tone-mapped); glowing three-finger hands.
- **Tried and dropped:** repeating the thorax in the head sculpt for the neck made the
  horns vanish; the torso-side fillet alone does the job.
- **Grove unit** is the standing Nubbin (about 2.7 world units tall). Scales are by eye
  against that; the roster line-up is `docs/samples/shape-roster.jpg`.
- Screenshots: `docs/samples/shape-<name>.jpg` (turn 30°) and `shape-roster.jpg`.
- Not verified: every pose at all three angles by eye (done for idle, happy and the 0, 30,
  45 and 90 degree turns on a subset); no device test. At turn 30 Fennel's far brow juts
  past the cheek (pre-existing).
- `npm run lint` and the `tsc` half of `npm run build` fail on `src/content/atlas-a01.ts`
  and `atlas-a06.ts`, untracked files from the content sessions (not mine, not committed);
  `eslint src/samples`, `npm test` (210 pass) and `vite build` are clean.

## Eyes that look (2026-10-15)

Item 3 of the brief: the irises follow. `eye()` returns `iris` (the disc in its own group;
the catchlight stays in the eye group as a reflection). In `buildSpecies`, each frame every
eye takes `Rigged.lookAt` in its own frame and eases its iris toward it at 6 per second,
at most 0.22 of the eye radius, dropping with the dome so it never floats; per-eye aiming
makes the pair converge on a near point. With no `lookAt` the iris wanders slowly.
`lookAt` already existed (null or a Vector3, head turn still gated to the `pet` pose); the
stage now sets it to the camera for closeup and lineup views. Check:
`?aaa=1&creature=1&closeup&pose=idle&turn=30`, `docs/samples/look-nubbin.jpg`. Lint,
210 tests and build pass. Not checked: the other four species by eye.

## Petting, sleep and the life pass (2026-10-15)

Items 23–28 of `docs/creature-improvements.md`, after the Palworld "All Pet Animations"
reference. A `pet` pose: the creature turns to `Rigged.lookAt` (the stage sets it to a
hand in front of the camera), leans the head in with a tilt, shuts the eyes into arcs,
folds its ears back, wags, and seven painted heart sprites (canvas textures, no assets)
rise and fade from the crown. Squash and stretch on the happy hop (hips 1.06/0.94 at the
top, 0.94/1.06 on landing, the hips moved so the feet stay planted) and a forward head
stretch on the eat chomp. Breathing is a chest scale (1.5% at 0.25 Hz; the torso now
sits in its own `chest` group so the head and feet do not move with it), slower and
deeper asleep. Sleep lies down fully: the belly drops to the grass (measured from the
torso sculpt), quadrupeds fold their legs with the knees bent, bipeds curl over theirs,
and a Zzz of three painted glyphs drifts up every 3.2 s. `Rigged.face(yaw)` eases the
facing over 0.4 s with a lean into the turn; the stage calls it every frame (the pet pose
turns each creature to the camera and back) and `groveStage.turnTo(deg)` turns the
line-up from the console. Ear flicks fire at irregular intervals from a generator seeded
by the species name; the happy tail curls up over the back. Pose timing now runs on the
stage clock (`setPose` compared `performance.now()` with the stage's relative `t`
before, so every ease-in started a fraction late). Screenshots:
`docs/samples/pet-roster.jpg`, `sleep-roster.jpg`, `pet-nubbin.jpg`. Format doc updated.

Stubbed: the sim has no `pet` command yet, so the pose is reached only on the stage
(`&pose=pet`), and the hand is a point in front of the camera, not a Keeper. Known bugs:
Fennel's lids do not cover its eyes asleep (they turn the stock 1.9 rad but sit higher
than the Nubbin's; the same before this pass); Bolder's folded legs fan upward rather
than tuck under; the hearts and Zzz are plain sprites, so a creature standing between
them and the camera does not hide them.

## Knee joints and planted feet (2026-10-15)

Item 22 of `docs/creature-improvements.md`: the walk rotated whole legs at the hip, so
the feet slid. Now a `PartSpec` may carry `joint: { name, pivot, prims, box }`, a lower
segment sculpted on its own and hung under the part's bone (`kneeFL`.., `kneeL/R`,
`knee1L`..`knee4R`). Each jointed leg's foot is the lowest vertex of its shin; the walk
keeps the foot still for the stance share of the cycle (0.6, spiders 0.5) while the
body advances, then swings it forward on an arc, with hip and knee solved together
(two-bone, bending about the rest chain's plane) and a crouch sized so the step's
extremes stay in reach. `Rigged` exposes `strideLength` and `stridePeriod`; the stage
moves a `&pose=walk` creature at that speed and the camera walks with it, lapping every
ten units. Each placed foot is also checked against `ground` so a slope cannot swallow
it. Fennel and Bolder are ported (knee a touch behind the line on a front leg, ahead on a
hind leg; Bolder's knee ball in both segments). Checked in the browser by sampling every
foot's world position per frame: Bolder's eight feet move under 0.0005 units per frame
while planted with the body moving 0.024; Fennel's the same in the fast-frame bursts the
pane managed. Shots: `docs/samples/walk-fennel.jpg`, `walk-bolder.jpg`.

**Stubbed:** the Nubbin, Mossling and Wisp keep the hip-only swing; knees stay straight
in the other poses (sleep and happy would look better folded). **Known:** the browser
pane runs this stage at 3–15 fps, so its frame gaps can hold a whole swing; a frame
longer than 0.5 s is clamped by the stage and lets the feet creep by that much. The sim
does not yet drive the body by the stride (the 3D mode is not wired to the sim).

