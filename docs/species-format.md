# The species description format

A species in the 3D Grove is data, not a hand-made model. `src/samples/species.ts`
turns a `SpeciesSpec` into a rigged, posed, animated figure; `species-data.ts` holds
the first two (the Nubbin and Fennel) as the templates. Everything below is what a
spec says and what the builder does with it.

## What a spec contains

| Field                                         | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`, `scale`, `gait`                       | Display name, overall size, and `biped`, `quadruped` or `hover`, which picks the pose set; `spider` drives eight legs named `leg1L`..`leg4R`.                                                                                                                                                                                                                                                                                                                      |
| `surface`                                     | The physical material: a detail kind (`fur`, `scale`, `leaf`, `plate`, `smooth`) projected along the three axes for grain and bumps, roughness, sheen, clearcoat, glow strength.                                                                                                                                                                                                                                                                                   |
| `fur`, `furRule`                              | Shell fur over every part (layers, length, lift, cell size), and a rule giving fur length and growth direction per surface point, baked as vertex attributes so the shells comb instead of puffing.                                                                                                                                                                                                                                                                |
| `torso`, `head`, `parts`                      | The body as blended shapes: each is a list of primitives (sphere, capsule, ellipsoid, round cone, torus) with a colour and a tag, a bounding box, a blend radius and a sculpt resolution. `head` and every part have a `pivot` and a bone `name` the poser knows. Each part may also carry its own `surface` material, extra `shades`, and `noFur`.                                                                                                                |
| `shade`, `marks`, `colorRules`, `extraShades` | Colour baked into the vertices: a top-to-underside light gradient; deliberate markings as shapes with a colour and a soft edge; rules that recolour a region of a primitive (a cream muzzle on the head, dark socks on the legs); extra bakes such as stripes.                                                                                                                                                                                                     |
| `eyes`                                        | Position (projected onto the skin by the builder, aimed along the surface normal), size, `tall` (height over width; 1 is round), iris colour, lid colour, extra yaw and pitch, how far the lid sits, and the iris disc size. `extra` lists small bead eyes (a spider's row). Each eye is a glossy dome, a painted iris bent onto it (big pupil, ring lit from below, two catchlights), a thin liner and a lid that blinks and closes for sleep.                    |
| `mouth`                                       | Position (projected onto the skin like the eyes) and width, lip colour, whether it has teeth, tongue colour. `shape` picks the closed look: `smile`, `o` or `omega`. The mouth is modelled: a dark interior that opens, a tongue and teeth that appear as it does, and a lip that lifts.                                                                                                                                                                           |
| `wings`, `ball`, `hipY`                       | Species extras (translucent wings that flutter, the emote ball with its own light) and the hip height the body bobs from.                                                                                                                                                                                                                                                                                                                                          |
| `face`, `hover`, `extras`                     | `face: 'torso'` puts the eyes and mouth on the body instead of the head part; `hover` is the float height for a hovering gait; `extras(rig)` hangs hand-built decorations on the rig (bones, meshes, the material) and may return a per-frame update.                                                                                                                                                                                                              |
| `blend` (on a primitive)                      | A blend radius of its own for that form, used instead of the part's or the body's: a small value (0.04 to 0.07) keeps an ear, horn, cap rim or fur tuft standing off the body with a crisp edge, while the body and belly keep the soft default. Nubbin crown, Mossling rim and sprout, Fennel cheeks and tufts, Bolder horns and palps use it.                                                                                                                    |
| `digits` (builder)                            | `digits(at, { count, spread, length, r, color, dir?, style?, pad?, glow?, tag? })` returns capsule primitives fanned out from an ankle or wrist, plus an optional flat pad ellipsoid on the underside. `style` is `toes`, `fingers` (longer, thinner) or `mitt` (wide blend, one rounded paw). One line per limb: Nubbin feet and mitts, Fennel paws, Mossling roots and hands, Bolder claws, Wisp glowing fingers.                                                |
| `tuft`, `tuftRow` (builders)                  | Sculpted fur clumps: short cones along a direction with a tight blend, so they read on the outline. `tuftRow(from, to, n, dir, len, r, color, taper)` stamps a row (chest ruff, tail tip, crown crest). Tag them `tuft` or `crest` so the fur rule keeps shells short there. Both live in `src/samples/species-kit.ts` and return plain `Prim[]` to spread into `prims`.                                                                                           |
| `joint` (on a `leg…` part)                    | A second segment under a knee: `{ name, pivot, prims, box, blend?, resolution? }`. The builder sculpts it on its own, hangs its bone under the part's bone, and takes its lowest vertex as the foot. Put a ball at the knee in both segments (the lower one a touch larger) so the join stays round as it bends. A straight leg at rest bends with the knee forward; give the knee a small offset to choose the bend (behind on a front leg, ahead on a hind leg). |
| `footprint`                                   | Radius of the contact shadow and of the slope probes, in body units; defaults to 0.85 × the torso box half-width. Grounding needs no other field: the builder measures the figure at rest (its lowest vertex per 0.3-unit cell of the ground plan) and, given the stage's `ground` sampler, drops the root until the lowest contact point sits 0.02 into the grass, tilts the body to the slope, and lays the shadow blob over the terrain.                        |
| `expressions`                                 | Per-pose face overrides: `lid` (0..1 shut), `squint` (lower lid), `brow` (tilt, + soft / - knitted), `browLift`, `arc` (the ^ ^ lash line over shut eyes). Defaults: happy and pet shut the eyes into arcs, eat squints and knits, sleep shuts and drops the brows.                                                                                                                                                                                                |

## Bone names the poser knows

`hips` (the torso), `head`, `armL`/`armR`, `legL`/`legR` (bipeds), `legFL`/`legFR`/
`legBL`/`legBR` (quadrupeds), `leg1L`..`leg4R` (spiders), `tail`, `earL`/`earR`,
`wingL`/`wingR`, and under a jointed leg its knee: `kneeL`/`kneeR`, `kneeFL`/`kneeFR`/
`kneeBL`/`kneeBR`, `knee1L`..`knee4R`. A part with any other name is still sculpted and
hung from the hips; it just does not move in the stock poses.

## The walk and the stride

A jointed leg plants its foot. Each leg is on the ground for a share of the cycle (0.6
for bipeds and quadrupeds, 0.5 for spiders; diagonal pairs and the alternating tetrapod
step together), sliding back under the body at the body's speed, then swings forward on
an arc. Hip and knee are solved together so the foot lands where asked, and the hips
crouch just enough that the step's extremes stay in reach. The rig exposes
`strideLength` (world units per cycle) and `stridePeriod` (seconds): move the root by
`strideLength / stridePeriod` per second while the pose is `walk` and nothing slides.
The stage does this for `&creature=N&pose=walk`, the camera walking along. A foot the
walk placed is also checked against `ground`, so a slope never swallows one. Legs
without a joint (the Nubbin's stubs) keep the old swing at the hip.

## The poses

`idle`, `happy`, `pet`, `walk`, `eat`, `sleep`, chosen with `setPose()`. The sim's
states map onto these: wander and findFood → walk, greet and play → happy, petting →
pet, eat → eat, nap → sleep, everything else → idle. On top of every pose: blinking, a
slow breath (the chest scales 1.5% at 0.25 Hz, slower and deeper asleep; the torso sits
in its own `chest` group so the head and feet stay put), ear sways with a flick at
irregular intervals (from a generator seeded by the species name, so a line-up does not
flick in step), wing flutter and the ball's bob.

- `pet` is the Keeper's hand: the creature turns to `lookAt` (below), leans its head in
  with a tilt and a slow nuzzle, shuts its eyes into the ^ ^ arcs, folds its ears back a
  little, wags fast, and seven painted heart sprites (canvas textures, no assets) rise
  and fade from the crown, one every 0.22 s.
- `happy` hops with squash and stretch (the hips 1.06 tall and 0.94 wide at the top of
  the hop, 0.94 tall and 1.06 wide on landing, the hips moved with the scale so the feet
  stay on the ground) and curls the tail up over the back.
- `eat` chomps with the whole head, which stretches forward and thins a little on each
  bite, volume kept.
- `sleep` lies down fully: the belly comes to the grass (the builder measures it from
  the torso sculpt), quadrupeds fold their legs with the knees bent, bipeds curl forward
  over theirs, hovering species sink to half their float; a Zzz of three painted glyphs
  drifts up from the head every 3.2 s.

## What the rig exposes

`Rigged` adds to a built creature: `setPose(pose)`, `bones`, `ground` (set by the
stage), `strideLength` / `stridePeriod` (the walk), `lookAt` (a world point, or null,
that the `pet` pose turns and leans the head toward, the yaw and pitch clamped to 0.7
and 0.4 rad; the stage sets it to a hand in front of the camera) and `face(yaw)`, which
turns the creature to a world yaw over 0.4 s with a lean into the turn instead of a snap
of `rotation.y`. The stage calls `face` every frame with the creature's resting yaw
(the pet pose turns it to the camera and back), and `window.groveStage.turnTo(deg)`
turns the whole stage from the console to watch the ease.

## How to write a new species

1. Block out the torso and head as two or three ellipsoids, standing on y = 0 with
   the feet at the bottom. Put a neck stub in the torso that sits inside the head, so
   the join stays soft when the head turns.
2. Add limbs as parts with a pivot at the joint (shoulder, hip) and a bounding box
   that contains the whole limb.
3. Tag primitives (`head`, `muzzle`, `leg`, `paw`, `tail`, …): colour rules, marks and
   the fur rule key off tags.
4. Place two or three deliberate marks (a mask, a chest patch, a ring) rather than
   relying on noise.
5. Set the eyes and the mouth on the face; check `happy` for the open mouth and
   `sleep` for the lids.
6. Pick a surface and, for furred species, a fur rule.

A Chao-line evolution is the Nubbin spec with different colours, a different crown
shape and extra parts (halo, spikes, tails): the format is meant to express that as
a small diff on the base spec.

## Where it is seen

`?aaa=1&creature=1..5` on the AAA stage, cycling through the poses every few seconds;
`&pose=happy` (or `idle`, `pet`, `walk`, `eat`, `sleep`) holds one. Fennel (`3`) and Bolder
(`4`) have jointed legs; the Nubbin, Mossling and Wisp do not.
