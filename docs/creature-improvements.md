# Creature improvements, measured against the references

The bible is the three Palworld references Maor supplied: the roster screenshot (the
overall look of the Pals), the Palworld Mobile short (how they sit in a scene) and the
"All Pet Animations" video (faces up close, how they move when petted, fed and idle).
Everything below is a gap between those and what the five sample creatures do today
(`?aaa=1&creature=all`). Items are grouped, and each group is ordered by payoff.

## 1. Face and expression

What the references do: the eyes carry the character. Big round domes, a dark pupil
filling most of the iris, one bold catchlight that never moves, and almost no liner. The
eyes stay bright even in shadow. Expression comes from the lids and brows, not the mouth:
petted Pals close their eyes into upturned arcs (Chikipi, Teafant), curious Pals widen
them, sleepy Pals droop the upper lid. Mouths are tiny: a line, a small "ω" or an "o",
with cheek blush on the cuter species. Noses are a simple dark bead on mammals.

1. **Happy closed eyes.** When petted or in the happy pose the lids close into an
   upturned arc, with a dark lash line along the arc. Today the lid only blinks or
   shuts flat for sleep. Highest payoff per hour of anything on this list.
2. **Brows.** A sculpted brow ridge per eye on a pivot: level at rest, raised for
   surprise, pulled in for eating, dropped for sleep. Gives moods without touching
   the mouth.
3. **Eyes that look.** The iris disc slides a little toward the camera or the Keeper
   (bounded, with a slow ease), and both eyes converge. Palworld Pals always look at
   you when you approach.
4. **Eyes read in shadow.** A touch of emissive on the iris and sclera so they never go
   grey under the cap or in the Wisp's own shadow (Mossling and Wisp suffer today).
5. **Lower-lid squint.** A second, lower lid that rises a little in the happy and eat
   poses, so the eye squashes instead of only closing from above.
6. **Blush.** Two soft pink marks under the eyes on Nubbin, Mossling and Fennel; the
   mark system already does soft edges.
7. **Mouth shapes per species.** A closed shape chosen per species: smile line (Nubbin),
   "ω" (Fennel, cat-like), small "o" (Mossling), grin with fangs (Wisp), mandibles only
   (Bolder). Today every closed mouth is the same arc.
8. **Nose bead** for every mammal (Fennel has one now; Nubbin should not).

## 2. Body shape and silhouette

What the references do: every Pal reads from its outline alone. One big primary form,
two or three secondary forms (ears, tail, belly), and small tertiary details (toes,
tufts, a leaf). Edges between forms are crisp where the character needs them (Pengullet's
face patch, Lamball's face in its wool) and soft only where fur meets fur. Hands and feet
exist: Tanzee has fingers, Foxparks has toes and paw pads.

9. **Hands and feet.** Toes on every foot, fingers or mitts on hands, paw pads underneath.
   Ours end in blobs. A `digits` helper in the spec would stamp them from one line.
10. **Sharper secondary forms.** Lower the blend radius where a form should stand off the
    body (ears, horns, the Mossling cap, the Bolder horns) and keep the soft blend only
    for fur and bellies. Today one blend value serves the whole body.
11. **Silhouette tufts.** Sculpted fur clumps (short cones that follow the fur direction)
    along the outline: cheek tufts, chest ruff, tail tip, crown. The reference wool and
    fur are clumps, not fuzz. Shells stay for the short underfur only.
12. **Proportions pass.** Heads about 40% of body height for the small species, eyes
    set wide and low on the face, limbs short. Fennel's head is a little small; Bolder is
    out of scale with the rest of the roster (see 27).
13. **Bolder's neck crease.** The head is a separate part now and shows a seam against the
    thorax. Overlap a collar primitive across the join, or blend the head into the torso
    sculpt and keep only the jaws on the head bone.
14. **Mossling's cap.** It hides the face from above and from the camera's usual angle.
    Tilt it back, raise it a little, and shrink its radius so the eyes always show.
15. **Wisp's core.** The inner glow lost its brightness in the port. Return the glow
    strength and give the core its own emissive material.

## 3. Surface and colour

What the references do: smooth, saturated colour with a soft top-to-underside gradient,
painted darkening in every crease, a clean two-tone body/belly split, and a matte skin
with a faint sheen. Fur has visible clumps and a soft lit edge. Nothing is noisy; nothing
looks like plastic except eyes, claws and beaks.

16. **Painted ambient occlusion in the vertex colours.** Sample the body's own distance
    field along the normal and darken creases (under the chin, where legs meet body,
    inside ears). This is the single biggest step toward the reference's painted look.
17. **Drop the speckle.** The triplanar detail noise reads as salt and pepper on Nubbin
    and the Wisp. Keep the normal-map grain for scales and plate; for skin and fur use a
    much larger, softer pattern or none.
18. **Matte skin, glossy accents.** Roughness up on skin and fur, clearcoat off; keep
    gloss for eyes, claws, the Bolder's plates and the Mossling cap.
19. **Crisp markings where the species needs them.** A `soft: 0` mark with an anti-aliased
    edge, for face patches, socks and belly splits.
20. **Fur lit edge.** Tint the shell tips lighter and warmer so fur has the reference's
    soft rim, and comb the shells a little flatter.
21. **Colour grade for creatures.** The stage's grass runs neon and washes the Pals. A
    gentler saturation on the environment and a touch more on the creatures.

## 4. Animation

What the references do: Pals breathe, blink, and look at you while idle. When petted they
turn to face the Keeper, lean into the hand, close their eyes, and hearts rise. Walking
plants the feet; nothing slides. Eating chews with the whole head. Sleeping lies down with
slow breathing and "Zzz". Everything has squash and stretch.

22. **Planted feet.** The walk cycle today rotates the legs at the hip, so the feet slide.
    Move the body with the stride and lift each foot on an arc, so the planted foot stays
    where it is.
23. **Petting reaction.** A `pet` pose: turn toward the Keeper, lean the head in, close
    the eyes (item 1), tail wag, rising heart particles. This is the signature moment in
    the reference video.
24. **Squash and stretch.** Scale the hips 1.06/0.94 on the hop and the landing, and
    stretch the head forward on the eat chomp.
25. **Breathing.** A slow chest scale on every pose, not just a hip bob.
26. **Sleep.** Lie down fully (quadrupeds fold their legs, bipeds curl), slow the breath,
    add a soft "Zzz" above the head.
27. **Turn in place.** A short pivot when the facing changes, with a lean, instead of a
    snap.
28. **Tail and ear life.** Idle tail sways exist; add ear flicks at random intervals and
    a tail curl when happy, for every species with a tail.

## 5. Grounding and scene

What the references do: Pals stand on the ground. A soft contact shadow sits under the
body, the feet sink a hair into grass, and grass bends away from them.

29. **Contact shadow.** A soft dark blob under each creature, sized to the body, in
    addition to the sun shadow.
30. **Feet on the ground.** Sample the terrain height under each foot and drop the hips
    so the lowest foot touches; today bodies float on slopes.
31. **Grass parting.** Push the instanced grass away from each creature's feet in the
    vertex shader.
32. **One scale for the roster.** Bolder towers over the others in the line-up. Pick a
    "Grove unit" and scale every spec to it; big species are big by design, not by
    accident.

## 6. The format itself

33. **Spec fields for all of the above:** `brows`, `blush`, `nose`, `mouthShape`,
    `digits`, `tufts`, `ao`, `lookAt`, per-form `blend`, `scaleUnit`. Each new field
    should come with one species using it, so the format stays data-driven.
34. **Expression table.** A small per-pose table in the spec (lid, lowerLid, brow, mouth)
    so a species can be shy or bold without new code.
35. **Reference notes in the data.** Each spec keeps a `notes` string naming which
    reference frame it was tuned against, for the next pass.

## Order I would do them in

1. Faces (1, 2, 5, 6, 7, 4): one day of work, and the petting moment depends on it.
2. Painted look (16, 17, 18, 20): changes every creature at once.
3. Grounding (29, 30, 22): the line-up stops floating.
4. Petting and sleep (23, 24, 26): the moments Maor filmed.
5. Shape fixes (9, 10, 11, 13, 14, 15, 32).
6. The rest.
