# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, currently as samples behind `?aaa=1` with the five-creature roster in the species
format. Latest pass: petting, sleep and the life pass (items 23–28). Waiting on Maor:
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

## Story pack moved into the repo (2026-10-15, Task B0)

- Works: `Stories/` moved by `git mv` to `src/content/`, `tests/tools/content-check.ts` and
  `script-book.ts`, `script-book/`, `voiceover/`, and `docs/` (atlas, canon, more-stories,
  fix-changelog, grove-backlog-prompt, briefs, logs). The 11 duplicate tools were identical
  and dropped; the pack's CLAUDE.md, plan.md and README.md were dropped (already folded in).
- Backlog prompt steps 2–4: index in `docs/content-index.md`; the no-chores rule was already in
  CLAUDE.md. Step 5 (the "Already have" audit against the code) is left for CV1.
- Known bugs, reported 2026-10-13 and not re-checked: **B1** the understudy swaps the speaker
  but not Keeper names in the text; **B2** the debug panel in production (`ui/hud.ts` now has
  a `DEV` guard nearby, verify); **B3** panels overlap (Journal over stats sheet, toasts over
  the HUD on portrait, Expedition counter under ✕).

## Grounding verified (2026-10-15)

Items 29, 30, 31 of `docs/creature-improvements.md`, checked in the browser (plan.md Part 1).
What was wrong and what changed:

- The grass vertex shader did not compile: the push loop's bound was empty (`i < ;`, a
  `${}` lost to a shell heredoc), so no grass drew at all. Fixed; the push is now a true
  world-space offset (it used to scale with the blade's instance scale squared).
- The slope tilt used the default XYZ Euler order, so pitch and roll turned about the
  world axes after the yaw. The root now rotates `YXZ`. The signs were right: a higher
  front pitches the nose up (checked numerically on the stage).
- The blob sat below the sampled ground and was a flat card, while the terrain curves up to
  0.07 across a footprint and its mesh is a chord up to 0.035 above the height function:
  it z-fought, floated on one side or was cut off on the other. It is now an 8×8 grid
  pinned flat in world space whose vertices take the ground height under them plus 0.05.
  It lightens to about 0.85 on the hop and 0.6 under the hovering Wisp, and shrinks.
- Feet: the specs' lowest points are not at y = 0 (Bolder's leg tips 0.2 below, Mossling
  0.03 above, Nubbin 0.05 below), and a plane through four probes misses the curvature
  under a wide belly or a wide leg span. `buildSpecies` now measures the figure at rest:
  the lowest vertex per 0.3-unit cell of the ground plan is a contact point, and each
  frame the root drops until the lowest contact point (carried by yaw and tilt only, so a
  hop still leaves the ground) sits 0.02 into the grass. Measured sink on the single stage
  at turns 0–270°: 0.02 for Nubbin, Mossling and Fennel, 0.027 for Bolder (its idle roll),
  the Wisp hovering 0.45 above.
- Bolder's idle leg sway is lift-only now; the dip put its tips 0.13 into the ground.
- `window.groveStage` exposes the stage (scene, cast, creature, groundHeight) so a console
  can measure creatures in place; the checks above were done that way.
- Left for the knee-joint pass: on bumpy ground a rigid body touches at its lowest point
  and the other feet can float a little; the Wisp's light trail dips under the ground.

Shots: `docs/samples/ground-roster.jpg`, `ground-fennel.jpg`, `ground-wisp.jpg`.

## Painted look (2026-10-15)

Items 16, 17, 18, 20, 21 of `docs/creature-improvements.md`, on every creature at once.

- `sculpt()` bakes ambient occlusion into the vertex colours (`ao` option, on by
  default): four probes out along the normal measure how much the field closes in, and
  creases go up to 55% darker. Fur shells share the geometry so the fur darkens too.
- Speckle: the Nubbin's two fine shell layers (cell 220) were the salt-and-pepper; a Chao
  is smooth, so the Nubbin has no shells now, a lower detail amount and a matte, velvety
  surface (roughness 0.66, sheen 0.7, no clearcoat). Fennel's fur grain is calmer under
  the shells (amount 0.4, bump 0.4).
- Fur tips are lit lighter and warmer in the shell shader.
- The creature stage grades at saturation 1.05 instead of 1.2 so the grass stops
  washing the creatures.
- Shots: `docs/samples/paint-nubbin.jpg`, `paint-fennel.jpg`, `paint-roster.jpg`.
