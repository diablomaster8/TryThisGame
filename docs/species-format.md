# The species description format

A species in the 3D Grove is data, not a hand-made model. `src/samples/species.ts` turns a
`SpeciesSpec` into a rigged, posed, animated figure. `species-data.ts` holds the two
templates (the Nubbin and Fennel); `species-roster.ts` holds Mossling, Bolder and Wisp and
the `ROSTER` list. This page lists every field, its default, and one example taken from
those five. Positions are in body space: the creature stands on y = 0 facing +z, in units
where a standing Nubbin is about 2.7 tall.

Each table has four columns: the field, what it is, what the builder does when it is
left out, and an example as it appears in a spec.

## SpeciesSpec

| Field         | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Default                                 | Example                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| `name`        | Display name. It also seeds the ear-flick timing, so a line-up does not flick in step.                                                                                                                                                                                                                                                                                                                                                                                    | required                                | `name: 'Fennel'`                                                                       |
| `scale`       | Overall size, by eye against the standing Nubbin.                                                                                                                                                                                                                                                                                                                                                                                                                         | required                                | `scale: 0.95`                                                                          |
| `gait`        | `biped`, `quadruped`, `hover` or `spider`. Picks the pose set; `spider` drives eight legs named `leg1L`..`leg4R`.                                                                                                                                                                                                                                                                                                                                                         | required                                | `gait: 'quadruped'`                                                                    |
| `surface`     | The body material (see SurfaceOpts below): a detail kind projected along three axes for grain and bumps, plus roughness, sheen, clearcoat and glow.                                                                                                                                                                                                                                                                                                                       | required                                | `surface: { detail: 'fur', scale: 2.2, amount: 0.4, roughness: 0.78 }`                 |
| `fur`         | Shell fur over every furred part: `layers`, `length` (body units), `lift` (how far the tips stand off) and `cell` (hairs per unit).                                                                                                                                                                                                                                                                                                                                       | no shells                               | `fur: { layers: 12, length: 0.1, lift: 0.25, cell: 70 }`                               |
| `furRule`     | `(p, n, nearest) => { len, dir }`: fur length 0..1 and growth direction per surface point, baked as vertex attributes so the shells comb instead of puffing. Key it off `nearest.tag`.                                                                                                                                                                                                                                                                                    | uniform length, along the normal        | `furRule: fennelFur`                                                                   |
| `torso`       | The body as blended shapes: `prims` (see Prim), a `box` that contains them, and optional `blend` and `resolution`.                                                                                                                                                                                                                                                                                                                                                        | `blend` from the spec, `resolution` 104 | `torso: { prims: [...], box: [V(-1, 0, -1), V(1, 1.8, 1)] }`                           |
| `head`        | A PartSpec named `head`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  | required                                | `head: { name: 'head', pivot: V(0, 1.7, 0), prims, box }`                              |
| `parts`       | The limbs, ears, tail and anything else, each a PartSpec.                                                                                                                                                                                                                                                                                                                                                                                                                 | required (may be `[]`)                  | `parts: [legFL, legFR, legBL, legBR, tail, earL, earR]`                                |
| `face`        | Which part carries the eyes and mouth.                                                                                                                                                                                                                                                                                                                                                                                                                                    | `'head'`                                | `face: 'torso'` (Mossling, Wisp)                                                       |
| `hover`       | Float height for a hovering gait; asleep it sinks to about half.                                                                                                                                                                                                                                                                                                                                                                                                          | 0.5 when `gait` is `hover`              | `hover: 0.55`                                                                          |
| `extras`      | `(rig) => update?`: hand-built decorations the format has no word for (dew, spores, a smoke shell), hung on the rig's bones; may return a per-frame `(t, pose)` update.                                                                                                                                                                                                                                                                                                   | none                                    | `extras: wispExtras`                                                                   |
| `blend`       | Blend radius for the body sculpts: how softly forms melt into each other. A primitive's own `blend` overrides it.                                                                                                                                                                                                                                                                                                                                                         | required                                | `blend: 0.16`                                                                          |
| `shade`       | The light gradient baked into the vertices: `top` and `bottom` brightness and `yMax`, the height where `top` is reached.                                                                                                                                                                                                                                                                                                                                                  | required                                | `shade: { top: 1.1, bottom: 0.68, yMax: 2.6 }`                                         |
| `marks`       | Deliberate markings (see Mark), baked over the gradient. Later marks paint over earlier ones.                                                                                                                                                                                                                                                                                                                                                                             | required (may be `[]`)                  | `marks: [{ kind: 'sphere', a: V(0, 1.45, 1.5), r: 0.085, color: '#2a1a1e', soft: 0 }]` |
| `colorRules`  | `(p, nearest) => color \| null`: recolours a region of a primitive before shading (a cream muzzle, dark socks). `null` keeps the primitive's colour.                                                                                                                                                                                                                                                                                                                      | none                                    | `colorRules: (p, n) => (n.tag === 'leg' && p.y < 0.5 ? dark : null)`                   |
| `extraShades` | More vertex bakes from `creatures.ts`: `stripes`, `spots`, or a custom `Shade`.                                                                                                                                                                                                                                                                                                                                                                                           | none                                    | `extraShades: [stripes('z', 4.5, 0.18, '#c9641f', ['body'], 0.55)]`                    |
| `eyes`        | The eye pair (see Eyes below).                                                                                                                                                                                                                                                                                                                                                                                                                                            | required                                |                                                                                        |
| `mouth`       | The mouth (see Mouth below).                                                                                                                                                                                                                                                                                                                                                                                                                                              | required                                |                                                                                        |
| `poses`       | A species' own poses, keyed by pose name, each `(c: PoseContext) => void` (see PoseContext below). It replaces the stock pose of that name; the stock `carry` and `throw` just stand, so a species that wants them writes them.                                                                                                                                                                                                                                           | the stock poses                         | `poses: { pet, carry, throw: throwPose, sleep: sleepSitting }` (the Keeper)            |
| `hearts`      | Whether hearts rise from the head during `pet`. The one doing the petting turns them off.                                                                                                                                                                                                                                                                                                                                                                                 | `true`                                  | `hearts: false` (the Keeper)                                                           |
| `expressions` | Per-pose overrides of the Expression table, partial: only the fields given change.                                                                                                                                                                                                                                                                                                                                                                                        | the stock table below                   | `expressions: { eat: { squint: 0.6 } }`                                                |
| `wings`       | Translucent wings that flutter: position of the right root (mirrored for the left), `size`, `color` and `shape` (`fairy` by default, a rounded `feather` lobe, a scalloped `bat` wing).                                                                                                                                                                                                                                                                                   | none                                    | `wings: { x: 0.42, y: 1.15, z: -0.6, size: 1, color: '#f6faff' }`                      |
| `blush`       | Cheek blush colour, scaled in over 150 ms only while petted (the Chao line). | none | `blush: '#ffb3c6'` |
| `waddle`      | Walk body roll over the stance foot, radians; the head counter-rolls 0.43 of it. | 0.03 | `waddle: 0.12` |
| `ball`        | The emote ball over the head, with its own light: height, colour, `shape` (a plain `ball`, a flat `halo` ring, a `spikes` ball) and `glow`, the emissive tint that also colours its light (warm gold by default).                                                                                                                                                                                                                                                         | none                                    | `ball: { y: 3.5, color: '#ffd94a', shape: 'halo', glow: '#c08a10' }`                   |
| `hipY`        | Hip height: the body bobs, crouches and squashes from here.                                                                                                                                                                                                                                                                                                                                                                                                               | required                                | `hipY: 0.98`                                                                           |
| `stride`      | The walk step: `length` scales how far the body moves per cycle (jointed legs: 1 is one leg length, and the hips crouch as far as the step needs; unjointed legs: it widens the hip swing), `period` is the cycle in seconds, `duty` the planted share of it for jointed feet (below 0.5 the figure jogs, and crouches less). The Grove speeds the cycle up to the sim's speed (`render3d/gait.ts`, at most `GROVE3D.maxCadence`), so longer steps mean a calmer cadence. | `{ length: 1, period: 0.8, duty: 0.6 }` | `stride: { length: 2.2, period: 0.7, duty: 0.45 }` (the Keeper)                        |
| `footprint`   | Radius of the contact shadow and of the slope probes.                                                                                                                                                                                                                                                                                                                                                                                                                     | 0.85 × the torso box's half-width       | `footprint: 1.1`                                                                       |
| `notes`       | Which reference frame or pass the species was last tuned against, for the next pass. Never shown.                                                                                                                                                                                                                                                                                                                                                                         | none                                    | `notes: 'Shape pass 2026-10-15 against the Palworld roster screenshot…'`               |

**Hooks must be named rules.** `furRule`, `colorRules`, `extraShades` and a part's `shades` are
functions, and the 3D mode sculpts in workers and caches by a hash of the spec, so each one
must be made by a rule registered in `src/samples/sculpt-rules.ts`: the stock `stripes`,
`spots` and `gradient` already are; a one-off is wrapped as
`namedRule('fennel.colors', (p, n) => ...)` and a parameterised one with `defineRule`. Rule
arguments must be plain data. An unnamed hook throws when the spec is serialised (the
`sculpt-spec` test serialises every species). Editing a rule's code invalidates the cached
geometry that used it; a change to a constant it closes over does not, so bump
`SCULPT_VERSION` in `sculpt-spec.ts` for that.

## PartSpec

A part is sculpted on its own and hung from the hips (or, for the head, wherever its pivot
is) as a bone. The joint segment inside it has the same shape.

| Field        | What it is                                                                                                                                                                                                                                                                                                                                    | Default                     | Example                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `name`       | A bone name the poser knows (listed below). Any other name is sculpted and hung but does not move in the stock poses.                                                                                                                                                                                                                         | required                    | `name: 'legFL'`                                                      |
| `pivot`      | Where the part hangs from, in body space: the shoulder, hip, ear root or tail root.                                                                                                                                                                                                                                                           | required                    | `pivot: V(-0.55, 1.1, 0.75)`                                         |
| `prims`      | The part's primitives (see Prim).                                                                                                                                                                                                                                                                                                             | required                    | `prims: [{ kind: 'capsule', a, b, r: 0.2, color: fur, tag: 'leg' }]` |
| `box`        | A bounding box `[min, max]` containing the whole part; the sculpt grid fills it.                                                                                                                                                                                                                                                              | required                    | `box: [V(-1, 0.4, -0.4), V(-0.2, 1.3, 0.6)]`                         |
| `blend`      | Blend radius for this part's sculpt.                                                                                                                                                                                                                                                                                                          | the spec's `blend`          | `blend: 0.12`                                                        |
| `resolution` | Grid cells per side for this part. Higher is smoother and slower to build.                                                                                                                                                                                                                                                                    | 80                          | `resolution: 56`                                                     |
| `surface`    | A material of its own when the part is not the body's surface (a mushroom cap, a flame).                                                                                                                                                                                                                                                      | the body's material         | `surface: capSurface`                                                |
| `shades`     | Extra vertex bakes for this part only.                                                                                                                                                                                                                                                                                                        | none                        | `shades: [spots(3, 0.7, '#3e8a34', ['cap'], 7)]`                     |
| `noFur`      | Leave the shell fur off this part.                                                                                                                                                                                                                                                                                                            | `false`                     | `noFur: true`                                                        |
| `joint`      | A lower segment hung from this one at a knee: `{ name, pivot, prims, box, blend?, resolution? }`. The builder sculpts it on its own, hangs its bone under the part's bone, and takes its lowest vertex as the foot the walk plants. Arms take one too (an elbow, `elbowL`/`elbowR`): it hangs and bends, and only `leg…` parts join the walk. | none (the leg swings whole) | `joint: { name: 'kneeFL', pivot: V(-0.55, 0.55, 0.8), prims, box }`  |

Put a ball at the knee in both segments (the lower one a touch larger) so the join stays
round as it bends. A straight leg at rest bends with the knee forward; give the knee a
small offset to choose the bend (behind on a front leg, ahead on a hind leg).

## Prim

A primitive in a `prims` list, from `sculpted.ts`. Marks use the same shapes.

| Field   | What it is                                                                                                      | Default          | Example                      |
| ------- | --------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------- |
| `kind`  | `sphere`, `capsule`, `ellipsoid`, `cone` or `torus`.                                                            | required         | `kind: 'ellipsoid'`          |
| `a`     | Centre, or the start of a capsule or cone.                                                                      | required         | `a: V(0, 1.2, 0)`            |
| `b`     | The other end of a capsule or cone.                                                                             | none             | `b: V(0, 0.4, 0.1)`          |
| `r`     | Radius; for a cone, the radius at `a`; for a torus, the ring radius.                                            | required         | `r: 0.22`                    |
| `r2`    | For a cone, the radius at `b`; for a torus, the tube radius.                                                    | none             | `r2: 0.05`                   |
| `radii` | Per-axis radii of an ellipsoid.                                                                                 | none             | `radii: V(0.78, 0.68, 0.66)` |
| `color` | Base colour before rules and shades.                                                                            | required         | `color: '#f0893a'`           |
| `tag`   | A region label: colour rules, the fur rule and the kit's tufts key off it.                                      | none             | `tag: 'muzzle'`              |
| `blend` | A blend radius of its own, used instead of the part's or body's: 0.04 to 0.07 keeps an ear, horn or tuft crisp. | the part's blend | `blend: 0.05`                |
| `glow`  | Emissive strength written to the `glow` vertex attribute.                                                       | 0                | `glow: 1`                    |

The kit in `species-kit.ts` returns `Prim[]` to spread into a list:
`digits(at, { count, spread, length, r, color, dir?, style?, pad?, glow?, tag? })` fans toes,
fingers or a mitt from an ankle or wrist; `tuft(at, dir, len, r, color, taper?)` is one
fur clump; `tuftRow(from, to, n, dir, len, r, color, taper)` stamps a row (chest ruff,
tail tip, crest). Tag tufts `tuft` or `crest` so the fur rule keeps shells short there.

## Mark

A marking baked into the vertex colours: a shape in body space, a colour and an edge.
It paints every part the shape touches, so a chest patch can cross from torso to leg.

| Field   | What it is                                                                                                                                                                                           | Default  | Example                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------- |
| `kind`  | `ellipsoid`, `sphere` or `capsule`.                                                                                                                                                                  | required | `kind: 'ellipsoid'`                       |
| `a`     | Centre, or the start of a capsule.                                                                                                                                                                   | required | `a: V(0, 0.95, 0.6)`                      |
| `b`     | The other end of a capsule.                                                                                                                                                                          | none     | `b: V(0, 1.75, -2.05)`                    |
| `r`     | Radius of a sphere or capsule.                                                                                                                                                                       | 0        | `r: 0.085`                                |
| `radii` | Per-axis radii of an ellipsoid.                                                                                                                                                                      | none     | `radii: V(0.3, 0.26, 0.2)`                |
| `color` | The mark's colour.                                                                                                                                                                                   | required | `color: '#fff3e0'`                        |
| `soft`  | Edge width in body units: the colour fades out over this distance past the shape. `0` is a crisp edge, anti-aliased over one vertex spacing of the sculpt, for face patches, socks and belly splits. | 0.06     | `soft: 0` (Fennel's nose and chest patch) |

## SurfaceOpts

The material, from `creatures.ts`. A part may carry its own.

| Field          | What it is                                                                                                                                   | Default    | Example                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| `detail`       | `fur`, `scale`, `leaf`, `plate`, `smooth` or `facet` (a lattice of flat tilted cells with bright edges, for gemstones): the triplanar grain. | required   | `detail: 'fur'`         |
| `scale`        | Grain size.                                                                                                                                  | 1.6        | `scale: 2.2`            |
| `amount`       | Grain strength in the colour.                                                                                                                | 0.6        | `amount: 0.4`           |
| `bump`         | Grain strength in the normal.                                                                                                                | 0.6        | `bump: 0.4`             |
| `roughness`    | Physical roughness.                                                                                                                          | 0.6        | `roughness: 0.78`       |
| `sheen`        | Fabric-like sheen strength.                                                                                                                  | 0.3        | `sheen: 0.5`            |
| `sheenColor`   | Sheen tint.                                                                                                                                  | white      | `sheenColor: '#ffe0c0'` |
| `clearcoat`    | Glossy coat strength (shells, plates, the cap).                                                                                              | 0.08       | `clearcoat: 0.6`        |
| `glowStrength` | How bright the `glow` vertex attribute renders.                                                                                              | 0          | `glowStrength: 2`       |
| `toon`         | Flat two-band toon shading for this surface (grain, bump, sheen, clearcoat and specular off); the stage's `&toon` flag when left out.        | stage flag | `toon: true`            |

## Eyes

`eyes` on the spec. The pair is placed at `±x`; each eye is projected onto the face part's
skin and aimed along the surface normal there, so it sits in the skin whatever the head's
shape. Each is a glossy dome, a painted iris bent onto it (big pupil, ring lit from below,
two catchlights), a thin liner and a lid that blinks and closes for sleep. The irises
follow `lookAt` when the stage sets it.

| Field       | What it is                                                               | Default  | Example                                        |
| ----------- | ------------------------------------------------------------------------ | -------- | ---------------------------------------------- |
| `x`         | Half the distance between the eyes.                                      | required | `x: 0.36`                                      |
| `y`, `z`    | Height and depth of the pair before projection onto the skin.            | required | `y: 1.78, z: 1.08`                             |
| `r`         | Eye radius.                                                              | required | `r: 0.23`                                      |
| `iris`      | Iris colour.                                                             | required | `iris: '#4a9a3a'`                              |
| `lidColor`  | Lid colour, usually the skin or fur colour.                              | required | `lidColor: fur`                                |
| `yaw`       | Extra outward turn of each eye, radians.                                 | required | `yaw: 0`                                       |
| `lid`       | How far the upper lid sits over the eye at rest, 0..1.                   | required | `lid: 0.18`                                    |
| `irisScale` | Iris disc size as a fraction of the eye.                                 | required | `irisScale: 0.8`                               |
| `pitch`     | Extra tilt of each eye beyond the face normal, radians.                  | 0        | `pitch: 0`                                     |
| `tall`      | Height over width; 1 is round.                                           | 1.2      | `tall: 1.3`                                    |
| `brow`      | `false` leaves the brow ridge off (the line-up figures have none).       | on       | `brow: false`                                  |
| `style`     | `chao` solid dark oval, two glints, no sclera or brows; `dot` bead; `cute` flat iris, thin rim. | `anime`  | `style: 'chao'` |
| `roll`      | Roll of each eye, outer end up, radians (a slanted angry eye).            | 0        | `roll: 0.44` |
| `extra`     | Small bead eyes set in the skin (a spider's row): `{ x, y, z, r }` each. | none     | `extra: [{ x: 0.5, y: 0.7, z: 1.4, r: 0.07 }]` |

## Mouth

`mouth` on the spec. Projected onto the skin like the eyes. The mouth is modelled: a thin
lip line on the surface and behind it a dark interior that only shows as it opens, with a
tongue and teeth that appear as it does. `happy` and `eat` open it.

| Field    | What it is                                                                  | Default            | Example             |
| -------- | --------------------------------------------------------------------------- | ------------------ | ------------------- |
| `x`      | Sideways offset; 0 for a centred mouth.                                     | required           | `x: 0`              |
| `y`, `z` | Height and depth before projection. Put it ahead of and below a muzzle tip. | required           | `y: 1.31, z: 1.62`  |
| `width`  | Half-width of the lip line.                                                 | required           | `width: 0.17`       |
| `lip`    | Lip colour.                                                                 | required           | `lip: '#3a2420'`    |
| `teeth`  | Whether teeth show as it opens.                                             | required           | `teeth: true`       |
| `tongue` | Tongue colour.                                                              | required           | `tongue: '#ff8a9a'` |
| `pitch`  | Tilt to follow the face, radians; down and out by default.                  | 0                  | `pitch: 0`          |
| `shape`  | The closed look: `smile`, a small round `o`, or a cat-like `omega`.         | `'smile'`          | `shape: 'omega'`    |
| `line`   | The toon mode's line colour for this mouth (a painted red `o`).             | the outline colour | `line: '#d8302a'`   |

## Expression

One face state. The stock table below gives one per pose; `expressions` on the spec
overrides any field of any pose.

| Field      | What it is                                                                     | Example          |
| ---------- | ------------------------------------------------------------------------------ | ---------------- |
| `lid`      | Upper lids closed, 0 open to 1 shut.                                           | `lid: 1`         |
| `squint`   | Lower lid raised, 0..1.                                                        | `squint: 0.45`   |
| `brow`     | Brow tilt in radians: positive raises the outer end (soft), negative knits it. | `brow: -0.3`     |
| `browLift` | Brow lift in eye radii: up for surprise, down for sleep.                       | `browLift: 0.12` |
| `arc`      | Draw the upturned ^ ^ lash arc once the lids are shut (a happy closed eye).    | `arc: true`      |
| `frown`    | Turns the closed mouth's smile over into a frown, 0..1.                        | `frown: 1`       |
| `gape`     | Rounds the mouth open into an O, 0..1 (surprise, a tumble).                    | `gape: 1`        |
| `spin`     | Rolls the irises round in circles (dizzy).                                     | `spin: true`     |

The stock table:

| Pose        | `lid` | `squint` | `brow` | `browLift` | `arc`   |
| ----------- | ----- | -------- | ------ | ---------- | ------- |
| `idle`      | 0     | 0        | 0      | 0          | `false` |
| `happy`     | 1     | 0.3      | 0.3    | 0.12       | `true`  |
| `pet`       | 1     | 0.35     | 0.35   | 0.1        | `true`  |
| `walk`      | 0     | 0        | 0.05   | 0          | `false` |
| `eat`       | 0.1   | 0.45     | -0.3   | -0.08      | `false` |
| `sleep`     | 1     | 0        | -0.1   | -0.12      | `false` |
| `carry`     | 0.15  | 0.2      | 0.2    | 0.04       | `false` |
| `throw`     | 0     | 0.3      | -0.25  | 0.06       | `false` |
| `sad`       | 0.45  | 0.1      | -0.4   | 0.1        | `false` |
| `dizzy`     | 0.25  | 0        | -0.2   | 0.04       | `false` |
| `surprised` | 0     | 0        | 0.15   | 0.28       | `false` |
| `love`      | 1     | 0.3      | 0.3    | 0.12       | `true`  |
| `tumble`    | 0     | 0        | -0.25  | 0.22       | `false` |
| `flap`      | 0.1   | 0.25     | 0.15   | 0.04       | `false` |
| `swim`      | 0.1   | 0.3      | 0.1    | 0.02       | `false` |

On top of those: `sad` has `frown: 1`, `dizzy` `frown: 0.4` and `spin`, `surprised` and
`tumble` `gape: 1`.

## PoseContext

What a species' own pose (`poses` on the spec) gets each frame. The builder has already put
every bone back at rest and worked out the look; the pose adds to that, as the stock ones do.

| Field     | What it is                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `t`, `dt` | Stage time in seconds, and the time since this pose began (for an ease-in or a cycle).                 |
| `set`     | `set(bone, x, y, z)`: turn a bone from its rest rotation by radians; unknown names are ignored.        |
| `bend`    | `bend(leg, angle)`: bend a jointed leg's knee, by its hip bone name, in its natural direction.         |
| `hips`    | The hips group: move `position.y` to bob or sit, turn `rotation` to lean.                              |
| `head`    | The head bone; `headRest` is its rest position, so the head slides by adding to `head.position`.       |
| `look`    | `lookAt` as a head `yaw` and `pitch` in hip space, with its ease-in `k` (0 when nothing is looked at). |
| `mouth`   | `mouth(open)`: how far the mouth opens, 0..1.                                                          |
| `add`     | `add(bone, x, y, z)`: turn a bone further from where the pose left it (the gesture layer uses it).     |
| `seat`    | The seat under a `sit`, in body units above the feet (0 on the ground); from `Rigged.seat`.            |
| `still`   | Reduced motion: hold a pose's still form (no nod, no raise).                                           |

**`gestures`** (spec field, campaign graphics 4, K7): `{ nod, shrug, point, down, chest }`, each
`(c, k, t) => void`, laid over whatever pose the body holds with weight `k` (eased in over 0.3 s,
held 1.6 s, eased out; `down` holds while set) at `t` seconds in; write them with `c.add`.
Without one, `nod` and `down` still tip the head. The Keeper writes all five (`keeper-spec.ts`).

## Bone names the poser knows

`hips` (the torso), `head`, `armL`/`armR`, `legL`/`legR` (bipeds), `legFL`/`legFR`/
`legBL`/`legBR` (quadrupeds), `leg1L`..`leg4R` (spiders), `tail`, `earL`/`earR`,
`wingL`/`wingR`, and under a jointed leg its knee: `kneeL`/`kneeR`, `kneeFL`/`kneeFR`/
`kneeBL`/`kneeBR`, `knee1L`..`knee4R`, and under a jointed arm its elbow: `elbowL`/`elbowR`.

## The poses

Chosen with `setPose()`. The sim's states map onto these (`poseFor` in `render3d/actors.ts`,
which follows the pixel view's `clipFor`): wander and findFood → walk, or `flap` for an adult
strong in Fly (`flaps` in `sim/stats.ts`); swim → `swim` for an adult strong in Swim
(`swimsStroke`), otherwise walk, wading belly-deep; greet and play → happy, petting → pet,
eat → eat, nap → sleep; cry, or a low or hungry mood at rest → `sad`; react → its reaction
(`dizzy`, `surprised`, `love`); thrown → `tumble`; everything else → idle.

| Pose        | What it does                                                                                                                                                                                                |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `idle`      | Stands; the irises wander slowly when nothing is looked at.                                                                                                                                                 |
| `happy`     | Hops with squash and stretch (hips 1.06 tall and 0.94 wide at the top, 0.94 and 1.06 on landing, moved so the feet stay planted); the tail curls up over the back; the mouth opens.                         |
| `pet`       | Turns to `lookAt`, leans the head in with a tilt and a slow nuzzle, shuts the eyes into arcs, folds the ears back, wags fast; seven painted hearts rise from the crown, one every 0.22 s.                   |
| `walk`      | Jointed legs plant their feet: on the ground for 0.6 of the cycle (0.5 for spiders), sliding back at the body's speed, then swinging forward on an arc. The rig exposes `strideLength` and `stridePeriod`.  |
| `eat`       | Chomps with the whole head, which stretches forward and thins a little on each bite.                                                                                                                        |
| `sleep`     | Lies down: the belly comes to the grass, quadrupeds fold their legs, bipeds curl forward, hovering species sink to half their float; a Zzz of three glyphs drifts up every 3.2 s.                           |
| `carry`     | Holding a creature. The stock pose just stands; the Keeper's (`keeper-spec.ts`) brings both arms forward and a little in, elbows barely bent, head tipped down to the bundle.                               |
| `throw`     | A toss. The stock pose just stands; the Keeper's is a 3.6 s cycle (`KEEPER_THROW`): hold, swing the arms back and dip, swing through and release at 1.45 s, settle, and lift back to the hold.              |
| `sad`       | Head down, ears and arms drooping, a slow sway; brows up at the inner ends, lids half down, a frown.                                                                                                        |
| `dizzy`     | A wobbling stagger with the irises rolling round.                                                                                                                                                           |
| `surprised` | A hop back with wide eyes and an O mouth.                                                                                                                                                                   |
| `love`      | The happy bounce with hearts rising from the crown.                                                                                                                                                         |
| `tumble`    | Limbs flailing under the thrown body's spin (the actor's `tumble` turns the whole figure).                                                                                                                  |
| `flap`      | Arms out and wings fluttering fast, the body lifted a little.                                                                                                                                               |
| `swim`      | A paddling stroke, the body sunk to the shoulders.                                                                                                                                                          |
| `sit`       | K1: sits awake on `Rigged.seat` (or the ground): the belly settles, the legs reach forward with soft knees, hands at the sides; eyes open and no Zzz (Moss's seat in the story, which used `sleep` before). |
| `kneel`     | K1: the stock form is a lower `sit`; the Keeper's drops onto the left knee with the right foot planted.                                                                                                     |
| `itemGet`   | K39: both arms high, chin up. The Keeper's lifts a found thing overhead in 0.3 s (held at once under reduced motion).                                                                                       |

The Keeper (`src/samples/keeper-spec.ts`, `KEEPER_SPEC` and `KEEPER_MOON_SPEC` from one
`keeperSpec(colours)`) writes its own `pet` (reaching out to `lookAt` with the right hand,
leaning after it, the hand stroking) and `sleep` (sits down cross-legged and nods off),
`sit` (on a seat of 0.4 body units or more the thighs reach out and the shins hang; lower, it
sits cross-legged, awake), `kneel`, `itemGet` and the five `gestures`, and turns `hearts` off.
Its `extras` name two pivots: `hand.R` (under the right elbow at the hand's centre, where carry
props hang, K13) and `neck` (the head bone, which turns at the neck). Its outfit is colour splits between primitives (tee sleeve, bare forearm,
shorts, bare shin, sneaker) plus crisp marks (vest panels and trim, stripes, wristbands, soles).

On top of every pose: blinking, a slow breath (the chest scales 1.5% at 0.25 Hz, slower
and deeper asleep; the torso sits in its own `chest` group so the head and feet stay put),
ear sways with a flick at irregular intervals, wing flutter and the ball's bob. Legs
without a joint keep the old swing at the hip; every roster biped and quadruped has knees now.

## What the rig exposes

`Rigged` adds to a built creature: `setPose(pose)`, `bones`, `ground` (set by the stage:
height at a world x,z; the builder drops the root until the lowest contact point sits 0.02
into the grass, tilts the body to the slope, and lays the shadow blob over the terrain),
`strideLength` / `stridePeriod`, `lift` (set by the stage: how far a held or flying body is
carried above the ground, in world units; the body rises by it after the grounding and the
shadow blob stays down on the terrain, fainter the higher it is), `lookAt` (a world point or null; the `pet` pose turns and
leans the head toward it, the yaw and pitch clamped to 0.7 and 0.4 rad, and the irises
follow it in every pose) and `face(yaw)`, which turns the creature to a world yaw over
0.4 s with a lean into the turn. Campaign graphics 4 adds `attend` (`{ x, z, k }` or null: the
head turns toward a world point, clamped to 60 degrees and scaled by `k`, eased, or snapped
when `still`), `gesture` (a `gestures` name, played from when it changes), `seat` (world units)
and `still` (reduced motion); the stage sets them through `render3d/stage-pose3d.ts`. `window.groveStage.turnTo(deg)` turns the whole stage
from the console.

## How to write a new species

1. Block out the torso and head as two or three ellipsoids, standing on y = 0 with the feet
   at the bottom. Put a neck stub in the torso that sits inside the head, so the join stays
   soft when the head turns.
2. Add limbs as parts with a pivot at the joint and a bounding box that contains the whole
   limb. Give legs a `joint` if the feet should plant in the walk.
3. Tag primitives (`head`, `muzzle`, `leg`, `paw`, `tail`, …): colour rules, marks and the
   fur rule key off tags.
4. Place two or three deliberate marks (a mask, a chest patch, a ring) rather than relying
   on noise. Use `soft: 0` where the edge should be sharp.
5. Set the eyes and the mouth on the face; check `happy` for the open mouth and `sleep` for
   the lids.
6. Pick a surface and, for furred species, a fur rule.
7. Write `notes` saying which reference the species was tuned against.

A Chao-line evolution is the Nubbin spec with different colours, a different crown shape
and extra parts (halo, spikes, tails): the format is meant to express that as a small diff
on the base spec.

## Variants as diffs

`src/samples/nubbin-variants.ts` turns a spec into a variant without copying it:
`variant(base, name, overrides)` deep-copies the base and changes only what the overrides name.
`colors` swaps every colour by role (body, tip, pad, belly, blush, star, crownShade, iris, lip,
tongue, wing, sheen; a variant of a variant keeps working because each derived spec remembers
its palette), `crown` picks a stock crown (`point`, `tall`, `hook`, `fin`, `stub`, `droop`,
`none`) or takes custom primitives, `ball` and `wings` merge fields or remove the extra with
`null`, `slots` replaces the ears, tail, arms or back parts, `hints` adds marks, `type` and
`second` apply a type's tells at full and half strength (after the neutral evolution chart:
Swim a crest, side fins and flipper arms; Fly a long crown and bigger wings; Run quills and
longer legs; Power horns, a wider body and bigger hands; at full strength the type also sets
the crown), `accent` is the colour those tells take (the body by default; Sun and Moon forms
pass a tint of the type colour from `TYPE_COLORS`, and the second evolutions blend two type
colours with `mixHex`), `headScale` grows everything above the neck about the head's pivot (its
primitives and box, the eyes, mouth and ball, ears and marks above the neck; the `eyes` and `mouth`
overrides and `patch` run after it, written for the grown head), and `patch` does the rest. One known limit: two roles that share a colour
value swap together, so give them different values. The templates (child, Sun, Moon and
Neutral adults) are in that file; the families (first and second evolutions, special forms,
colours) are in `nubbin-variants-*.ts` and meet in `nubbin-variant-catalogue.ts`. The special
family is split three ways: `nubbin-variants-special.ts` (the Eternals and the Shadow, then the
looks), `nubbin-variants-lineup.ts` (the six line-up character looks) and `nubbin-lineup-kit.ts`
(the shared pieces: ears, tails, gloves, goggles, quills, crystals, `widen`, `dress`).

## Look keys and the Dresser (Full 3D)

The 3D Grove names every look with a string key (`render3d/looks.ts`), so the sculpt workers
can rebuild the spec from it. The base is `variant:<id>`, `nubbin`, `keeper-sun|moon`,
`roster:<name>` or `art:<species>`; modifiers follow, joined with `~`, applied in this order:

| Modifier                                 | What it does                                                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npc:<trainer>`                          | On a Keeper: the trainer's outfit by the one Keeper look rule (`render/keeper-look.ts` `keeperOutfit`: the outfit, its trim tinted Sun or Moon). The pixel view keys its Keeper sheet the same way.                       |
| `look:<look id>`                         | A character look's palette over an adult or Eternal's own shape. A child wears the look's whole figure instead (`variant:look-fox`).                                                                                      |
| `egg:<colour>`, `tone:<colour>`, `shiny` | Egg colour, two-tone, shiny. A jewel (`egg:ruby` ... `egg:onyx`) gives the gem palette and `JEWEL_FINISH` on any form.                                                                                                    |
| `parts:<ears>,<tail>,<arms>,<back>`      | Critter parts (`-` for an empty slot), one sculpted shape per `PartStyle.shape` from `samples/nubbin-critter-parts.ts`, coloured from the part's colour and accent. A back part replaces the wings, as in the pixel view. |
| `shadow`                                 | The Shadow's ash grey, any species.                                                                                                                                                                                       |

What a Nubbin wears rather than is (hat with its dye, scarf, glasses, a character look's head
accessory) is not in the key: `render3d/dress.ts` `Dresser` hangs plain meshes on the head and
hip bones, shares geometry per item kind and materials per colour, and skips the work when a
rig's dress signature (on `userData`) has not changed. The pool stamps `userData.lookKey` on
each rig so the Dresser knows the body under the clothes.

## Generated species: the serpent plan

The pocket and digital lines are generated from the pixel recipe (`render/sprites/species-art*.ts`,
`render3d/art-species.ts`). A recipe with `plan: 'serpent'` may carry a `serpent` block, read by
both renderers (LOOK-05):

| Field      | What it does                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------ |
| `segments` | Discs (pixel) and spine nodes (3D), 7–10; 8 by default.                                          |
| `taper`    | The tail's radius as a share of the neck's; 0.35 by default.                                     |
| `rise`     | How many segments stand up under the head; 2 by default (Gyarados 4, Airdramon 5).               |
| `belly`    | A belly stripe in the belly colour.                                                              |
| `fin`      | A dorsal fin in the accent colour on segments 2 and 5 (Gyarados).                                |

In 3D the neck is sculpted into the torso and each lying segment is a part named `seg<i>`, re-hung
bone under bone (`render3d/art-serpent.ts`); the walk is a travelling yaw wave on the gait clock.
With the `boulders` part, every segment is a rock (Onix).

## Generated species: the quad plan

A recipe with `plan: 'quad'` may carry a `quad` block (`creature-kit-digi.ts` `quadOf`, LOOK-06), read
by both renderers. Babies (size under 0.95) keep a head a third bigger.

| Field     | What it does                                                                                  |
| --------- | --------------------------------------------------------------------------------------------- |
| `stance`  | `dog` (default), `horse`, `toad` (low and wide), `seal` (flippers, no legs), `sit` (Snorlax). |
| `legLen`  | Leg length, 0.4–1.0 (dog 0.6, horse 0.9).                                                     |
| `neck`    | How far the head stands up and forward on a neck, 0–0.6.                                      |
| `snout`   | Muzzle length, 0–0.5.                                                                         |
| `tailSet` | `high` or `low`; read by neither renderer yet.                                                |

## Where it is seen

`?aaa=1&creature=1..5` on the AAA stage; `&creature=variant:<id>` stages one Nubbin variant and `&creature=variants&family=child|first|second|special|colour|templates` lines up a family (`&filter=<id part>`, `&max=<n>`, rows of eight), cycling through the poses every few seconds;
`&toon` is the flat outlined look of the "Chao World" line-up and `&ref=<file>&refx=<n>` (`&split`) lays a reference image from `docs/reference/` over or beside the stage (see `mountReference`);
`&pose=happy` (or `idle`, `pet`, `walk`, `eat`, `sleep`) holds one; `&closeup` frames the
face; `&turn=<deg>` turns the creature. The Nubbin (`1`), Mossling (`2`), Fennel (`3`) and
Bolder (`4`) have jointed legs; the Wisp hovers on a vapour skirt and has none. `&creature=keeper` (or `keeper-moon`) is the Keeper
stage: the Keeper beside a Nubbin, cycling idle, walk, pet, carry, throw and sleep, the Nubbin
answering each (leaning to the hand, riding in the arms, flying the arc and landing);
`&pose=carry` or `throw` holds one (`docs/samples/keeper-idle.jpg`, `keeper-pet.jpg`,
`keeper-45.jpg`).
