# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, currently as samples behind `?aaa=1` with the five-creature roster in the species
format. Latest pass: knee joints and planted feet (item 22). Waiting on Maor:
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

## Face group on the Nubbin (2026-10-15)

Maor: "make a full list of improvements ... use the references I sent you as a bible"
→ `docs/creature-improvements.md` (35 items, six groups). Then "do it for one and then
report back": the face group (items 1, 2, 4, 5, 6, 7) on the Nubbin.

- `eye()` now returns an `EyeRig`: upper lid, a lower lid hinged from below (squint),
  an upturned lash arc shown over a closed happy eye, and a brow ridge (skin colour,
  tilts and lifts). The iris and white carry a little emissive so eyes stay bright in
  shadow.
- `species.ts`: an `Expression` per pose (lid, squint, brow tilt, brow lift, arc) with
  defaults (`EXPRESSIONS`) and a per-species `expressions` override; eased in over 0.3 s
  (1.2 s for sleep). Happy = eyes shut into ^ ^ arcs, squint, brows soft; eat = squint
  and knitted brows; sleep = shut, brows dropped.
- `mouth.shape`: `smile` (default), `o`, `omega` closed shapes; the closed shape gives
  way to the open ring past 30% open.
- Nubbin: blush marks under the eyes.
- Shots: `docs/samples/expr-nubbin-idle/happy/eat/sleep.jpg`, `expr-nubbin-happy-35.jpg`.
- Fix (Maor: happy frames "look weird"): the lids over the dome left the iris peeking out
  under a floating arc. A happy shut eye now hides the whole eyeball and lids so the
  head's skin shows, and the lash arc sits on the skin (`EyeRig.ball`).
- Fix (Maor: "fix the mouth too"): the open mouth was a 3D interior sphere, a flipping
  lip ring and a tongue blob, which at 0.2 units read as a scribble. It is now drawn on
  the skin like the reference: a dark half-disc opening under a straight upper lip that
  grows downward with the open amount, a rim, a tongue half-disc and flat teeth.
  `expr-fennel-happy.jpg` shows it with teeth.
- Still open in the face group: eye tracking (item 3). The other four creatures get the
  same rig automatically but have not been tuned (brows on Bolder/Wisp may want hiding).
