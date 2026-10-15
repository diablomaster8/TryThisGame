# The species description format

A species in the 3D Grove is data, not a hand-made model. `src/samples/species.ts`
turns a `SpeciesSpec` into a rigged, posed, animated figure; `species-data.ts` holds
the first two (the Nubbin and Fennel) as the templates. Everything below is what a
spec says and what the builder does with it.

## What a spec contains

| Field | What it is |
| --- | --- |
| `name`, `scale`, `gait` | Display name, overall size, and `biped`, `quadruped` or `hover`, which picks the pose set. |
| `surface` | The physical material: a detail kind (`fur`, `scale`, `leaf`, `plate`, `smooth`) projected along the three axes for grain and bumps, roughness, sheen, clearcoat, glow strength. |
| `fur`, `furRule` | Shell fur over every part (layers, length, lift, cell size), and a rule giving fur length and growth direction per surface point, baked as vertex attributes so the shells comb instead of puffing. |
| `torso`, `head`, `parts` | The body as blended shapes: each is a list of primitives (sphere, capsule, ellipsoid, round cone, torus) with a colour and a tag, a bounding box, a blend radius and a sculpt resolution. `head` and every part have a `pivot` and a bone `name` the poser knows. |
| `shade`, `marks`, `colorRules`, `extraShades` | Colour baked into the vertices: a top-to-underside light gradient; deliberate markings as shapes with a colour and a soft edge; rules that recolour a region of a primitive (a cream muzzle on the head, dark socks on the legs); extra bakes such as stripes. |
| `eyes` | Position (projected onto the skin by the builder, aimed along the surface normal), size, `tall` (height over width; 1 is round), iris colour, lid colour, extra yaw and pitch, how far the lid sits, and the iris disc size. Each eye is a glossy dome, a painted iris bent onto it (big pupil, ring lit from below, two catchlights), a thin liner and a lid that blinks and closes for sleep. |
| `mouth` | Position (projected onto the skin like the eyes) and width, lip colour, whether it has teeth, tongue colour. The mouth is modelled: a dark interior that opens, a tongue and teeth that appear as it does, and a lip that lifts. |
| `wings`, `ball`, `hipY` | Species extras (translucent wings that flutter, the emote ball with its own light) and the hip height the body bobs from. |

## Bone names the poser knows

`hips` (the torso), `head`, `armL`/`armR`, `legL`/`legR` (bipeds), `legFL`/`legFR`/
`legBL`/`legBR` (quadrupeds), `tail`, `earL`/`earR`, `wingL`/`wingR`. A part with
any other name is still sculpted and hung from the hips; it just does not move in
the stock poses.

## The poses

`idle`, `happy`, `walk`, `eat`, `sleep`, chosen with `setPose()`. The sim's states
map onto these: wander and findFood → walk, greet and play → happy, eat → eat, nap →
sleep, everything else → idle. Blinking, ear twitches, wing flutter and the ball's bob
run on top of every pose; sleep closes the lids instead.

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

`?aaa=1&creature=1` (Nubbin) and `&creature=3` (Fennel) on the AAA stage, cycling
through the poses every few seconds; `&pose=happy` (or `idle`, `walk`, `eat`, `sleep`)
holds one. Mossling, Bolder and Wisp are still hand-built in `creatures.ts` and will
be ported to the format next.
