# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, now a real Graphics setting (Pixel | Full 3D) with `src/render3d/`; the pixel mode
ships unchanged; it now sculpts in workers and draws every species, place and stub
(see "The 3D mode carried forward" in docs/progress-archive.md). Latest pass: Part G8b, the toon stage mode and the line-up match, in progress. Waiting on Maor:
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

4b. **look-fox against slice 3** (`docs/samples/match-fox.jpg`, idle pose: the reference's eyes are open
   and our happy pose shuts them). The line-up's third figure is not the orange fox the brief
   described: it is a black hood edged by a pink V over a cream face, big navy eyes, an orange
   crown with a white stripe, goggles pushed up on the right, an orange vest with black sides
   and a gold bell, white gloves and cream shoes; the look follows the image. New:
   `gogglesUp` (rim, glass, highlight, as prims and as marks), the V as short capsule marks that
   follow the dome (a straight chord cuts inside the skin and paints nothing; marks paint
   every surface, so the goggle marks are re-laid after the hood), eyes with a cream `lidColor`.
   Still differs: the hood's top is a flat black mass where the thumbnail shows orange and
   white stripes; the V is thinner and the cream chin shorter; no hood side flaps; our eyes
   keep the glossy sky catchlight; the twin tails are kept (not visible from the front).
4a. **look-echidna against slice 2** (`docs/samples/match-echidna.jpg`). Crimson `#b8344f`; head
   ×1.2 with a wide low dome (1.12 × 0.8 × 0.92), a white muzzle ellipsoid, five white tuft
   spikes (the crown slot; `crownShade` white so the baked crown ring does not stain them),
   `bigEar` (new: a pale disc over a body-coloured lobe), a green `halo` ball, a white belly
   patch with a green dot, `gloveArm` (new `y`, `reach`) and `mechLegs` (new `size`) with white
   shoes. Still differs: no headband (the reference has none; the brief's was a misread of the
   tuft); the eyes are our dark arcs, the thumbnail's are pale crescents; the ears sit a little
   wider and rounder; the gloves hang where the happy pose drops them, the reference's are raised.
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
