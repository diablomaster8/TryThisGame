# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, currently as samples behind `?aaa=1` with the five-creature roster in the species
format. Latest pass: grounding applied but not rendered (plan.md Part 1). Waiting on Maor:
the pick from expansions E1–E3 and campaigns S1–S4, and his device pass. Subagent briefs
with model picks: `plan.md`. Improvement backlog against the Palworld references:
`docs/creature-improvements.md`.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

## Grounding applied, unverified (2026-10-15)

Contact shadow blob (`shadowBlob`, `spec.footprint`, `root.userData.footprint`), a `ground`
sampler on `Rigged` that tilts the body to the slope, and grass parting (`PUSHERS` →
`uPush` in the grass vertex shader) are applied and typecheck, but were not rendered in
the browser before Maor asked for the planning documents. `plan.md` Part 1 verifies them.
Also added: CLAUDE.md sections on decisions, constraints, standards and the current plan;
`plan.md` with twelve subagent briefs and model picks.

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

## The whole roster in the species format (2026-10-15)

Maor: "keep going on fixes for the whole batch of 5 as next sample". Mossling, Bolder and
Wisp now come from specs too (`src/samples/species-roster.ts`, `ROSTER` = all five), so
every creature has the anchored round eyes, a modelled mouth in the skin and the five poses.

- Builder additions in `species.ts`: a part can have its own `surface`, extra `shades`
  and `noFur`; `face: 'torso'` puts the eyes and mouth on the body (Mossling's cap is its
  "head", Wisp's flame crown too); `eyes.extra` adds small bead eyes set in the skin
  (Bolder's row of six); gait `spider` (legs `leg1L..leg4R`, weight-shift idle,
  alternating-tetrapod walk, front legs raised to eat, tucked to sleep); gait `hover` bobs
  the hips at `hover` height; `extras(rig)` hangs hand-built decorations (dew, gills,
  leaves, spores; mandibles and the ember light; the smoke shell, motes, ring, trail,
  inner light) and returns a per-frame update.
- Stage: every `&creature=N` builds from `ROSTER`; `&creature=all` lines the five up
  facing the camera (`&pose=`, `&turn=` still apply). `buildCreature` (hand-built) is no
  longer used by the stage but stays in `creatures.ts` as reference.
- A stale-console lesson: the browser pane keeps console errors across page loads, so an
  old shader error (the `uCell` one) looked current. Reload and read the tail of the log
  in order before chasing it.
- Shots: `docs/samples/roster-idle.jpg`, `roster-happy.jpg`, `face-mossling.jpg`,
  `face-mossling-happy.jpg`, `face-bolder.jpg`, `face-bolder-walk.jpg`, `face-wisp.jpg`,
  `face-wisp-40.jpg`.

## Faces anchored to the surface, round pupil eyes (2026-10-15)

Reference: Maor's Palworld pet-animation video (Tanzee, Foxparks, Chikipi, Teafant frames).
What the reference shows: round eyes sitting proud of the face, a big iris that is mostly
dark pupil with a thin white ring around it, one bold catchlight, hardly any liner, and a
tiny mouth drawn in the skin low on the face.

- `species.ts` `onSurface(prims, blend, from)`: walks the head's signed distance field to the
  nearest surface point and its normal. Eyes and the mouth are placed there and aimed along
  the normal (eyes pulled 45% toward straight ahead), so nothing floats or sinks whatever
  the head shape. Spec `eyes.yaw`/`pitch` and `mouth.pitch` are now extra tilt only.
- `creatures.ts` `eye()`: a flattened dome eyeball with its centre behind the face; the iris
  and the catchlight are discs of concentric rings bent onto the dome (a flat fan hid behind
  the dome, found with a red-disc test), a thin liner at the top rim, lid as before; new
  `tall` parameter (1.2 default) replaces the fixed 1.45 almond.
- `irisTexture`: 128 px, pupil to 56% of the iris with a soft edge, iris ring lit from below,
  two catchlights.
- `buildMouth`: lip line half-buried in the skin; the lower lip is hidden when closed and
  offset so it no longer z-fights the upper one (the "falling off" flicker).
- Data: Nubbin eyes r 0.25, irisScale 0.8, lid 0.12, tall 1.12, mouth width 0.2; Fennel
  eyes r 0.21, irisScale 0.8, tall 1.3, mouth width 0.2.
- Shots: `docs/samples/face-nubbin.jpg`, `face-fennel.jpg`.
- Fix (Maor: "mouth on fox is off"): the Fennel mouth point sat under the muzzle, so the
  projection landed on its underside facing down. It now starts ahead of and below the
  muzzle tip and lands on the tip's front underside, with a dark nose mark above it.
- Angles (`&turn=<degrees>` on the stage): at three-quarter and side views the eye domes
  stood off the head, so the dome now sits deeper (centre 0.42 r behind the skin, 0.28 r
  proud) and aims only 22% toward straight ahead; liner shrunk to the visible rim. Shots
  `face-fennel-45.jpg`, `face-fennel-side.jpg`, `face-fennel-happy.jpg`, `face-nubbin-40.jpg`.

