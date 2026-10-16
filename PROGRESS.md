# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, now a real Graphics setting (Pixel | Full 3D) with `src/render3d/`; the pixel mode
ships unchanged; it now sculpts in workers and draws every species, place and stub
(see "The 3D mode carried forward"). Latest pass: Part G8b, the toon stage mode and the line-up match, in progress. Waiting on Maor:
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

## Part G8b: matching the "Chao World" line-up (2026-10-16)

The reference is `docs/reference/chao-world-lineup.jpg` (the YouTube thumbnail, seven
figures left to right: quills, echidna, fox, dream, Eternal Neutral, shade, Eternal Moon).
Steps, newest first, one commit each:

3. **look-quills against slice 1** (`docs/samples/match-quills.jpg`, stage left, reference
   right). New in the format: `headScale` on `variant()` grows everything above the neck about
   the head's pivot (primitives, box, eyes, mouth, ball, ears, marks) before the `eyes`,
   `mouth` and `patch` overrides; `eyes.brow: false` leaves the brow ridge off; `mouth.line`
   is the toon line colour for a mouth (the painted red `o`). The look: head ×1.25 and the
   dome reshaped wider than tall (radii 1.0 × 0.8 × 0.9), eyes r 0.34 with no brows, a
   peach muzzle ellipsoid raised off the face, the quill ball as five rounded cones in a
   darker navy with underside shade marks (`quillCluster`, `quillShades`) plus yellow ear
   tips, the body a small ball held clear of the legs with the mech emblem (yellow ring,
   dark disc) on the belly patch, arms straight out ending in glove balls with a cuff ball
   (`gloveArm`), mech lower legs as grey capsules with a red torus ring under red shoes a
   third larger with the white stripe as a flattened ellipsoid standing proud of the top
   (`mechLegs`), and a flat baked shade (top 1.0, bottom 0.94). Toon lighting fix found
   here by zeroing each light in turn from the console: the sky's environment map carries
   the sun disc, so even a twentieth of it washed every flat to pastel and no band showed;
   the toon shader now drops `lights_fragment_maps` (no image-based light at all; the
   material's `envMapIntensity` made no difference), the sun alone draws the bands (lit
   0.95, shade 0.62 below a 0.3 dot product, nothing from lights behind the surface) and
   the hemisphere light is the fill. Still differs from the reference: the dome's top is
   rounder than the line-up's flattened one; the quill ball sits on the dome rather than
   behind it; the closed happy eyes are our dark arcs where the thumbnail shows white
   crescents; the emblem is a disc, not a hexagon; the ball above the head stays (the
   reference crops it); the muzzle's edge is softer than the flat-shaded original.
2. **Reference overlay.** `mountReference` in `aaa-styles.ts`: `&ref=<file>` lays an image
   from `docs/reference/` over the stage at 45% (served from the repo in dev, never built);
   `&refx=<n>` crops it to the n-th of seven equal-width slices and scales that figure to
   about the size the stage draws one (the line-up's figures stand 0.4 of the image tall
   with their middle at 0.7 of its height), `&refz=<k>` zooms it, `&refc=<0..1>` moves the
   slice centre when a figure is off its seventh (the thumbnail's figures sit at about
   0.10, 0.23, 0.36, 0.49, 0.62, 0.75 and 0.90); `&split` gives the stage the left half of
   the window and the reference the right, opaque, for the side-by-side shots. Tuning
   view: `?aaa=1&creature=variant:look-quills&toon&pose=happy&ref=chao-world-lineup.jpg&refx=1`.
1. **Toon stage mode, `&toon`.** `TOON` in `creatures.ts` is set by the stage before any
   creature is built. `surfaceMaterial` (and `SurfaceOpts.toon` per surface) then drops the
   triplanar grain, bump, sheen, clearcoat and specular, takes less of the sky's ambient
   (`TOON_ENV`), and `toonShader` patches the physical shader so direct light falls in two
   bands (`TOON_BAND`: lit 0.6, shade 0.33 at a 0.38 dot product; the lit band sits under
   full sun so the flats keep their colour) with the vertex colours a touch more saturated.
   `toonMaterial` flattens the eye white, lids, brow, liner, arc and lips the same way; the
   lash line and happy arc are thick (tube 0.11 of the eye radius) and the mouth one solid
   line, both in `TOON_OUTLINE.color` (#1a1026). `outline(group)` adds an inverted-hull
   back-face copy of every opaque mesh (0.025 world units, pushed in view space so the
   width is the same whatever the part's scale); the stage adds it after the figures are
   measured, so the hulls never count toward the feet. Post: SSAO, bloom, depth of field,
   fog and the grade off; exposure 0.85; sky and grass unchanged. Without the flag nothing
   changes. Tuning view: `?aaa=1&creature=variant:look-quills&toon&pose=happy`.

## The 3D mode carried forward (2026-10-16)

Plan: (1) sculpt in workers with a geometry cache and stand-ins; (2) work down the stub
list; (3) foot sliding and hill-top taps. One commit per step.
**Step 1, worker sculpting.** `buildSpecies(spec, sculpted?)` takes surfaces marched
elsewhere, in `speciesSurfaces(spec)` order (`sculptSurface` marches one). `SculptFarm`
(`render3d/sculpt-farm.ts`) fans each look's surfaces across up to four workers
(`sculpt-worker.ts` rebuilds the spec from its look key via `looks.ts`) and caches the
result by key, so a second Nubbin with a look never marches; with no workers it marches on
the page, one surface per task. `CreaturePool.acquire` returns null until a look is ready
(Actors shows a soft breathing capsule), builds at most one rig a frame, compiles the
rig's programs with `compileAsync` against the composer's target before first draw, and
strips the emote ball's point light (each one changed the light count and recompiled
every material in the Grove: the 500-900 ms hitch at every hatch). `?free` in Full 3D, this PC:
Keeper back from the workers in 1.5-2.7 s, rigs 100-220 ms on the page, worst frame after
the first 227 ms (was 900 ms; the first frame's own compile is 650 ms). `?aaa=` stages still
build synchronously.
**Step 2a, looks.** Look keys take tint modifiers (`~egg:<colour>`, `~tone:<colour>`,
`~shiny`, `~shadow`; `looks.ts`) that recolour any Nubbin spec the way the pixel
`variantColors` does (Sun keeps a white belly, Moon a dark crown shade; shiny wears
`SHINY_FINISH`); `~shadow` ashes any species. Eternals use `variant:eternal-<band>`; second
evolutions already resolved. The pocket and digital lines sculpt from the pixel drawer's
recipe (`render3d/art-species.ts`: plan, ears, crest, tail, arms, legs, wings, eyes, marks,
palette), scaled by the recipe's size. Egg shells wear the egg colour. Shots
`docs/samples/mode3d-forward-{species,tints}.jpg`.
**Step 2b, motion and weather.** `cry` lays a droop over idle (head hung, arms in, a
sob; undone each frame before `animate`); `swim` paddles with the walk at 0.6 speed, sunk
to the shoulders over deep water with a ring spreading round it. Toys by kind
(`render3d/toys.ts`: striped ball, radio, blocks, hand mirror, glowing TV). Snow is its own
slow, drifting white cloud. `Bursts` (`render3d/bursts.ts`) throws leaves and petals from a
shaken tree and dust where a Nubbin lands; both shake the 3D camera (`GROVE3D.shake`, off
with the Settings switch). Shot `docs/samples/mode3d-forward-poses.jpg`.
**Step 2c, places and people.** `Crowd` (`render3d/crowd.ts`) draws everyone besides the
Keeper and the Nubbins from the shared pool: visiting Keepers (`keeper-<band>~npc:<trainer>`,
clothes dyed to the trainer's shirt), wild visitors and the Hollow's wild one (art looks),
the Shadow strays (`variant:shadow`, sad when still) and the grey Nubbins of the story
Hollow and Corvin's rows at the pixel view's spots. `Garden` (`garden.ts`) builds placed
decor (all eleven kinds, the three buildings at the pixel widths), plants by stage (dry
ones yellow, fruit when ready) and painted tiles (instanced quads, flowers dotted),
rebuilt on a signature check. `Hollow` (`hollow.ts`) builds a floor from `sim/dungeon.ts`:
edge walls, water, stairs up and down, the chest (lid opens), torches with four roaming
lamps, crystals and loot (hidden once taken). Underground the sky goes dark. Sun, Moon and
Corvin are grades (`GROVE3D.groveTint`). Picks cover npc, wild, stray, memorial, decor,
building, plant, stairs, chest and loot. Shots `mode3d-forward-{garden-moon,hollow}.jpg`.
**Still stubbed:** `location:visit` (a neighbour's Grove is a bare floor);
`form:<band-type>` only if a variant id is ever missing. Known: the Sun/Moon grade follows
`setDaylight`, so it changes on the next sim step; a crowd of one new look (Corvin's 30)
rigs one per frame, 100-200 ms each.
**Step 3, known limits.** Feet: each rig keeps its own animation clock (`gait.ts`) that
runs at real speed off the walk and at the sim's speed over the format's stride
(`strideLength * scale / stridePeriod`) on it, capped at `GROVE3D.maxCadence` (4x): the
figures' strides are short for the sim (the Keeper walks 6x its natural pace, a child 9x),
so feet still slip a little at full speed; a stride-length field in the format would close
it. Hill-top taps: measured, not a bug any more: `Picker3d` marches the heightfield, worst
error 0.04 units over a 20x20 grid of taps against a 0.01-step march (the sim's flat
ground only means walks ignore slope). **Final numbers, this PC, `?free` in Full 3D:**
first frame 650-900 ms (scene programs), worst frame after it 228 ms with three children,
a wild visitor and an NPC rigging in; Keeper on screen 1.5-3 s after load (stand-in until
then). Not checked: a phone, Firefox and Safari module workers (the farm falls back to the
page if a worker cannot start).
