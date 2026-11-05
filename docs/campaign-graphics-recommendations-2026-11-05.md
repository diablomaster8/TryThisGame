# Campaign graphics recommendations, round 4 (2026-11-05)

Report only: no game code changed. Scope: the story scenes of Hazel's Grove (12 chapters) and
the four separate campaigns (The Hundred Days, Logged In, The Beetle Road, Dawn & Dusk), in
both renderers. The Hollow dungeon is left out.

Three earlier rounds (`campaign-graphics-recommendations-2026-10-21.md`, `-2026-10-22.md`,
`-2026-10-22-b.md`, 150 items) are built. This round starts from fresh screenshots of the
deployed build and lists what is still wrong or still missing. Items are numbered **V1–V50**
so they don't clash with the C/H/M/N/K numbers of the earlier rounds. V49 and V50 were found
last and filed under their tiers, out of numeric order.

**The brief's "known gaps" are out of date.** All five are closed on `main` (4a005742):
`Scene.stage` exists (`SceneStage` in `src/config/story.ts`, data in
`src/config/scene-stages*.ts`); one stager serves both renderers (`src/render/scene-stage.ts`;
`render3d/staging.ts` is a 5-line re-export); the gate is built (`render3d/gate-x.ts`, the
pixel gate in the c1 frame); buildings fade (`scenery-hide.ts`, H9/H12); story props exist in
both renderers. This round looks at how well that machinery is used.

**How the frames were taken.** The repo's own recipe, `tests/tools/story-shots.cjs`, against
`https://diablomaster8.github.io/TryThisGame/?debug`, with headless Edge
(`--use-angle=d3d11`), 1280×720, frame 0 after a debug chapter jump and frame 1 after one
advance. Two local patches were needed and are worth taking into the tool: the deployed title
labels Hazel's slots `New story in Hazel's Grove, Slot 1` (the recipe looks for `Start a new
… in empty slot 1`), and the separate campaigns sit in a closed `<details>` ("Separate
stories") that has to be opened before the click. Frames taken: Hazel's Grove c1, c4, c10, c12
in both renderers; The Hundred Days c1, Logged In c4, The Beetle Road c1 and Dawn & Dusk c1 in
both renderers. Everything was at desktop size. Phone framing was not re-shot this round.

## Where it stands

**Pixel (default).** The pixel renderer now honours most of `SceneStage`: hours and grades, the
gate, sets that hide the Grove's buildings, interiors, the festival, the Logged In skin on the
dialogue box. The frames look good from far away. Up close they still go wrong in four ways:
1. A long scene keeps one stage while its text moves from place to place.
2. Cast poses and hand props in the stage data aren't drawn: Ida stands and has no broom, and
   the Keeper stands while the text says "you sit down".
3. Speakers end up behind props: Fern behind the gate, Juno behind the request board.
4. The Grove's own furniture stays in every campaign: eggs on the paths, the terraced memorial
   hill, the pond and jetty, the request board.

Night water stays daytime blue. Fading trees turn into orange checkerboards that read as a
glitch. Intimate two-shots are still framed wide.

**Full 3D.** Faces, materials and the festival crowd read well. The cast is now on screen and
facing each other. The remaining faults are placement and leftovers:
- Floating black slabs: pieces of hidden buildings, or unlit boards, seen by day in the Fold
  and at night in ch10.
- The Keeper standing inside a bush.
- A two-shot whose camera looks straight down the line between Moss and the Keeper, so they
  merge into one shape. A tree trunk cuts across the same frame.
- Foreground grass blades taller than the Keeper's head.
- A dithered grey rectangle on the ground under Ida.
- A morning described as "cold and very bright" drawn in grey fog.
- Only two of Dawn & Dusk's "four houses", with grey footprints where the other two should
  be.

Frame rates held 55–60 fps on desktop, except one push-in to a two-shot in Logged In that read
27 fps (V49). The phone cost notes below are estimates
against the 30 fps floor.

**Shared by both.** Region-opened toasts signed "Hazel" and the chapter-name toast both play
over story scenes, including in chapter 10 while Hazel is "up the hill". The kitchen, Corvin's
house and the crest house interiors are built (`INTERIOR_IDS` in `config/stage-marks.ts`,
furniture in `render/interior-layout.ts`), but no scene stages them. Only `inside-fold` and
`inside-guardhouse` are used.

## Recommendations

Each item gives: **what**, renderer, campaign or chapter, the reference, how to build it here,
the phone cost, and effort (S, M or L).

### Critical: the picture contradicts the text, or the scene can't be read

**V1. Let a stage change on a given line, so long scenes can move between places.**
- **Renderer:** both. **Serves:** Hazel c1-letter first; any long scene.
- **Seen:** `c1-letter` is staged at the gate (`scene-stages-hazel.ts:60`). Its text moves to
  the signpost, then into the kitchen ("The kettle is on the stove, cold"; "one cup … turned
  upside down", with the `cup` act), then out to the step. The cup choice plays over the gate,
  with no cup anywhere on screen.
- **Reference:** Scarlet/Violet cutscenes cut to a new set-up at each beat instead of holding
  one wide shot.
- **How:** add `beats?: Record<number, SceneStage>` to `SceneStage`, keyed by line index. In
  `SceneStager`, layer the beat over the scene's stage when the line index reaches the key,
  with `transition: 'fade'` by default. For c1-letter: 7 → signpost close; 11 → `inside-kitchen`
  with `item: 'cup'`; 17 → `step`.
- **Content-check:** a beat key past the scene's last line is an error.
- **Phone cost:** none at draw time. A set swap costs about one interior build, the same as
  K10.
- **Effort:** M.

**V2. Stage the three interiors that are built but never used.**
- **Renderer:** both. **Serves:** Hazel c1, c12 (Hazel's "The cup by the stove. The one that's
  turned upside down.", `campaign-book3.ts:1015`), ch8 Nova lighting her lantern "at your
  kitchen fire" (`campaign-book2.ts:622`), Corvin's house, the Dawn & Dusk crest house.
- **Reference:** Animal Crossing interiors read from one fixed angle because every object is
  big and has its own colour.
- **How:** in `ROOM_FURNITURE.kitchen` add a `cup` piece, a `coatHook` (empty in c1, coat
  hanging in c12) and an `eggshells` row on the sill. Each is a few rectangles in
  `paint/dress-props.ts` and a kit piece in `render3d/dress-shapes.ts`. Then stage the kitchen
  for c1 (through V1), c12's cup line and Nova's lantern. Stage `inside-corvin` for Corvin's
  indoor lines and `inside-crest` for Dawn & Dusk's house scenes.
- **Phone cost:** an interior is exclusive, so the draw count falls.
- **Effort:** S–M.

**V3. Give chapter 10's opening the hour its first line names.**
- **Renderer:** both. **Serves:** Hazel c10-open.
- **Seen:** the stage has `hour: 22.5`. Line 1 says "The sun gets up late and low, and doesn't
  try very hard". Both renderers draw full night.
- **Reference:** Legends: Arceus' low winter sun over snow: long blue shadows and a pale gold
  rim.
- **How:** set `hour: 8.5` with `grade: 'crisp'` and `weather: 'frost'`. Let the Long Night's
  darkness arrive with the later scenes that are actually at night.
- **Lint:** add a test in `tests/render/` that runs `hourOf()` over each staged scene's first
  narration line and fails when it disagrees with `stage.hour` by more than 4 hours. That
  catches this class of bug for good.
- **Phone cost:** none. **Effort:** S.

**V4. Make chapter 12's "Morning. Cold and very bright." look bright.**
- **Renderer:** both. **Serves:** Hazel c12-open.
- **Seen:** 3D draws a grey-teal fog over the whole festival, and pixel a grey-green wash.
  Neither looks bright.
- **Reference:** Scarlet/Violet's snowy Glaseado daylight: a white sky, high exposure, sharp
  blue shadows.
- **How:** `c12-open` takes `weather: 'clear'` from the override at `scene-stages-hazel.ts:721`
  but keeps `season: 'winter'`, and the winter fog wins. Add `grade: 'crisp'` (M10's grade),
  and in 3D turn the fog density down when the grade is `crisp` (`render3d/sky.ts`). In pixel,
  lift `post.ts`'s exposure for `crisp`.
- **Phone cost:** none. **Effort:** S.

**V5. Hold region toasts while a scene plays, and never sign them as a Keeper who is away.**
- **Renderer:** both (UI). **Serves:** Hazel ch9–11, all four campaigns.
- **Seen:** after a jump to ch10, "Hazel: The shrine on the green has started catching the
  morning", "…the evening too", "Hazel: Something is moving on the Hollow stairs" and
  "Chapter 10: The Long Night" stack over the opening line. Hazel is "up the hill" in ch10.
- **How:** in `ui/region-chip.ts` `onEvents`, queue `storyRegionOpened` toasts while a story
  scene is open, and flush them after it closes. In `strings-camp10a.ts`, choose the signer by
  chapter: Fern, or no name, while Hazel is absent. Show the chapter name as the title card
  only, never as a toast over the grave opener.
- **Note:** seen after a debug jump. In normal play these fire on their own chapter's progress,
  but nothing stops one landing mid-scene.
- **Phone cost:** none. **Effort:** S.

**V6. Never let a prop hide a speaker.**
- **Renderer:** both; seen in both. **Serves:** Logged In c4, Hazel c1.
- **Seen:**
  - Logged In ch4: Juno says "Fight here. Then come and look at the board with me", but she is
    behind the request board. Pixel shows only her feet; 3D shows half of her.
  - Hazel c1: Fern stands on `gate-inside`, behind the pixel gate. Only her cap shows above its
    roof.
- **Reference:** Scarlet/Violet's cutscene framing never puts a set piece between the camera
  and whoever is talking.
- **How:**
  - In `SceneStager`, after the fit (`render/stage-fit.ts`), project each speaker's bounding box
    and every building or prop drawn in front of it. If more than 40% is covered, fade that
    prop with the existing scenery fade.
  - In pixel, sort `gate-inside` behind the gate's front face or move the mark 1 unit forward.
    For Juno, move the `board` mark beside the board, not behind it.
  - Add the coverage check to the K49 shot test.
- **Phone cost:** one rectangle test per cast member per shot change. **Effort:** M.

**V7. Draw the poses and hand props the stage already asks for, in pixel.**
- **Renderer:** pixel. **Serves:** The Hundred Days c1, Hazel c4, all of them.
- **Seen:**
  - Hundred Days c1: the stage gives Ida `pose: 'sit'` and `carry: 'broom'`
    (`scene-stages-hundred.ts:45`), and the text says she "sits on the one whole step with a
    broom across her knees". She is drawn standing, with no broom.
  - Hazel c4: the stage sits the Keeper beside Moss ("You sit down next to him, because that is
    the rule"), but the Keeper stands.
  - Hundred Days c1 says "the egg under your arm", but nobody carries anything.
- **How:**
  - Make `render/stage-pose.ts` apply `sit` and `kneel` to the Keeper sprite and to NPC Keepers,
    not only to Moss and the stage actors.
  - Draw `carry` as a held-item layer in `render/sprites/keeper.ts`: broom, lantern, bucket,
    bag, pie, notebook, egg and keys, each about 10×10 on the 32 px grid.
  - Add `carry: 'egg'` for `you` in the Hundred Days ch1 and ch2.
- **Phone cost:** one extra sprite layer per carrier. **Effort:** M.

**V8. 3D two-shots must not look down the line between the pair.**
- **Renderer:** 3D. **Serves:** Hazel c4 and every `two` shot.
- **Seen:** c4 frames Moss on the flat stone and the Keeper beside him with `yaw: -1.0`. The
  camera looks almost along the line from one to the other, so the Keeper's body overlaps
  Moss. A curved tree trunk also runs across the middle of the frame.
- **Reference:** Scarlet/Violet's over-the-shoulder and side two-shots, at 60–90° to the line
  between the pair.
- **How:** in the 3D shot solver, when `kind` is `two`, clamp the yaw so the angle between the
  pair's axis and the view direction is at least 50°. Use the stage's yaw as a preference, not
  an order. Add trunks and canopies whose screen box overlaps the pair's box to the occluder
  fade, as buildings already are.
- **Phone cost:** none. **Effort:** M.

**V9. Clear bushes and tall grass off every cast mark during a scene.**
- **Renderer:** both; seen in 3D. **Serves:** Hazel c1 and everywhere.
- **Seen:** in 3D c1 the Keeper stands waist-deep inside a faceted low-poly bush. Elsewhere,
  grass blades in front of the camera stand taller than the Keeper's head.
- **How:**
  - While a scene plays, hide scenery instances within 0.8 units of each resolved cast spot.
    For instanced bushes, scale the instance to zero; for the pixel view, hide the sprite.
  - Clip grass blades inside the story camera's near band. In `grass-field.ts`, add a shader
    uniform for "camera near fade" that shrinks blades within ~3 units of the camera.
- **Phone cost:** a uniform; no extra draws. **Effort:** S.

**V10. Remove the floating black slabs in 3D.**
- **Renderer:** 3D. **Serves:** The Hundred Days (Fold), Hazel ch10, and probably every set
  with `set` or hidden buildings.
- **Seen:**
  - Hundred Days c1, by day: flat black boards on the hill's flank, beside the ruined houses,
    and one in mid-air above the hill.
  - Hazel c10, at night: four black planks on the ground.
  - They sit where the cottage and the garden buildings stood. They are probably doors,
    shutters, signs or bench boards whose material escaped the K2 hide (`building-kit.ts:99`,
    `:195`), or unlit materials that go black where `TOON.sky` is missing.
- **How:**
  - Log every mesh that stays visible inside a hidden building's grown footprint.
  - Hide by parent group, not by material bucket.
  - Give any material without `TOON.sky` a minimum ambient.
  - Add a pixel-sum probe for pure-black clusters to the golden-shot diff
    (`tests/tools/story-shots-diff.cjs`).
- **Phone cost:** none. **Effort:** S–M.

**V11. Keep the festival ring off the frozen pond, and keep the bunting off faces.**
- **Renderer:** both. **Serves:** Hazel c12-open and the c12 festival scenes.
- **Seen:** in both renderers, Keepers and Nubbins of the ring stand on the pond's ice, and a
  lamp post stands in the ice (pixel). The star bunting runs straight through heads.
- **Cause:** `festival(i)` in `stage-marks.ts:87` puts 12 marks on a 5.5-unit circle round the
  picnic, and the east arc crosses the pond.
- **How:**
  - Make the ring a horseshoe that stops at the pond bank, or shift `PICNIC` west 1.5 units.
  - Snap a mark off water to the nearest bank.
  - Raise the bunting's catenary 0.6 units, or hang it between the lamp posts behind the ring
    instead of across it.
- **Phone cost:** none. **Effort:** S.

**V50. Draw all four Dawn & Dusk houses, and never fade the houses the line is about.**
- **Renderer:** 3D. **Serves:** Dawn & Dusk c1 and every `green` establish.
- **Seen:**
  - The text says "Four houses stand round the green", but only the back two are drawn.
  - Where the front two should stand there are two grey dithered slabs: the footprints of
    hidden boxes.
  - The right-hand house, one of the subjects, is drawn dithered and half-transparent by the
    occluder fade.
- **Reference:** Legends Z-A's district framing keeps the landmark buildings that name a place
  solid in shot.
- **How:**
  - The crest houses stand where the cottage, school and dojo stood
    (`config/stage-sets.ts`), so the K2 hide is probably taking two crest houses along with
    the stock houses they replace. Hide by building id, not by footprint.
  - Mark the crest houses as `HOUSES` focus subjects (the stage already passes
    `focus: HOUSES`) and exempt focus objects from the occluder fade, as C9 did for the gate.
  - Pull the camera back or raise it so all four fit (`fit: true`).
- **Phone cost:** none. **Effort:** S–M.

### High

**V12. Pixel water takes the hour's grade.**
- **Renderer:** pixel. **Serves:** every night scene: Logged In ch4, Hazel ch3, ch6, ch9–11.
- **Seen:** Logged In c4 ("the meadow with the lights off") has a saturated daytime-blue pond
  under a night sky.
- **Reference:** Palworld's night: water goes near-black, and lantern light makes it glow.
- **How:** in `paint/terrain.ts`, multiply the water ramp by the daylight tint the ground
  already uses (`render/daylight.ts`). At night, add one warm streak below each lit lamp on the
  water (K19 does this in 3D).
- **Phone cost:** the water tiles repaint once per phase change. **Effort:** S.

**V13. Clear the Grove's loose eggs and idle villagers out of story shots.**
- **Renderer:** both. **Serves:** every campaign.
- **Seen:** eggs as big as a Keeper lie on the paths in Hazel c12, Hundred c1, Logged c4 and
  Dawn c1. Unrelated villagers wander through the backgrounds of Hazel c4 and c10.
- **How:** while a scene plays, hide eggs and ambient NPCs not in `cast` within the shot's
  frustum. This extends H14's foreground clearing to egg items and the ambient crowd
  (`render/ambient-life.ts`, `render3d/crowd.ts`).
- **Phone cost:** fewer sprites. **Effort:** S.

**V14. Push the pixel camera in for `two` and `close` shots.**
- **Renderer:** pixel. **Serves:** Hazel c4, Logged In ch4, Hundred Days ch1, and all quiet
  scenes.
- **Seen:** Hazel c4's `two` shot of Moss and the Keeper on the flat stone shows the whole
  hill, the cottage, the crop plot and both paths. The pair is about 40 px tall, and frame 1
  is the same shot.
- **How:** `stage-fit.ts` picks the tightest zoom step that fits. The pixel view has two zoom
  steps, so add a third story-only step at 1.5× on the 64 px tier (nearest-neighbour, integer
  aligned).
- **Phone cost:** none; fewer tiles visible. **Effort:** M.

**V15. Swap the Grove's landmarks out of the separate campaigns.**
- **Renderer:** both. **Serves:** The Hundred Days, Logged In, Dawn & Dusk.
- **Seen:**
  - Hundred Days c1 in the Fold: the terraced memorial hill, the Grove's well, pond, jetty and
    crop plot are all still there.
  - Logged In: the wooden Grove gate and the request board.
  - Dawn & Dusk: the memorial hill rises behind the four houses, and a Logged In blue "data
    block" sits at the bottom-right edge.
- **Reference:** Legends Z-A: each Lumiose district reads at a glance from its own furniture.
- **How:** add a `swaps` table to `STAGE_SET_HIDES` (`config/stage-sets.ts`): Fold:
  hill → overgrown slope with a broken wall, pond and jetty → reed bed. Logged: request board →
  hidden, gate → glowing portal frame. Dawn & Dusk: hill → shrine knoll. Also track down the
  Logged In block that leaks into the Dawn & Dusk set (`dress-y-shared.ts`/`e4-shared.ts` list
  `'logged'`).
- **Phone cost:** a swap replaces geometry, so it is neutral. **Effort:** M.

**V16. Fade trees with an alpha ramp, not an orange checkerboard.**
- **Renderer:** pixel. **Serves:** every staged shot near trees, especially Dawn & Dusk c1.
- **Seen:** autumn canopies in the cast's way turn into coarse orange-and-transparent
  checkerboards, three to six per frame in Dawn & Dusk and The Hundred Days. They read as a
  rendering fault.
- **Reference:** Legends: Arceus and Animal Crossing fade occluding foliage to a soft
  silhouette.
- **How:** in the pixel post, replace the 2×2 checker with a 4×4 ordered (Bayer) dither at 50%.
  Better still, draw the faded canopy at 35% alpha with a one-pixel dark outline kept at full
  alpha, so the tree stays readable as a tree.
- **Phone cost:** none. **Effort:** S.

**V17. Make Dawn & Dusk's "first light" look like dawn.**
- **Renderer:** pixel (3D's amber haze already reads as first light). **Serves:** Dawn & Dusk, the dawn half.
- **Seen:** `DAWN_HOUR = 6.5` falls in the dawn phase at t = 0.25 (`daylight.ts:89`), but the
  frame reads as noon.
- **Reference:** Scarlet/Violet's sunrise grade: warm peach horizon, lilac shadows, long
  shadows.
- **How:** after H11 calmed the dawn grade, raise the dawn half's saturation of the warm key
  and lengthen shadows (pixel `shadow-len` by phase; 3D sun elevation 8°). Add a low mist band
  over the green (`fx: ['mist']`, a still sprite under reduced motion).
- **Phone cost:** none. **Effort:** S.

**V18. Make the carved creatures over the Dawn & Dusk doors read as creatures.**
- **Renderer:** pixel. **Serves:** Dawn & Dusk c1 ("a flier, a runner, a swimmer, a thicket
  thing").
- **Seen:** the plaques read as a sun, a moon, a seed and a fish. At 12×8 the silhouettes are
  too small, and they look like the alignment icons.
- **How:** in `paint/campaign-k.ts`, grow the plaque to 20×12, draw a side-view silhouette with
  one pose cue each (wings up, legs mid-stride, a fin and wave, a leafy bush with eyes), and
  give it a lighter rim. Use the same silhouettes on the 3D plaques.
- **Phone cost:** none. **Effort:** S.

**V19. Collapse the HUD during story scenes.**
- **Renderer:** both. **Serves:** every campaign.
- **Seen:** ten top-bar buttons, the shells and fruit counters, the "Sun Grove" chip (Logged
  In), the FPS box and the compass all stay up. Nubbins and bunting in c12 are cut off under
  the bar.
- **How:** while a scene is open, show only a single "⋯" button and the Skip button. K15 hides
  the HUD for `grave` scenes only; make that the default for all story scenes.
- **Phone cost:** none. **Effort:** S.

**V20. Build the festival as a festival: lantern lines, stalls and an entry arch.**
- **Renderer:** both. **Serves:** Hazel ch12 (`festival` place), and endings that reuse it.
- **Seen:** the festival is a picnic cloth, bunting and a crowd. Nothing says "festival" from
  across the Grove.
- **Reference:** Kitakami's Festival of Masks in The Teal Mask: a night festival with stalls
  (Ogre Oustin' among them), lanterns and masks. Use its lantern lines and stall rhythm, not
  its shrine architecture.
- **How:**
  - Add three stalls with cloth awnings (fruit, shells, egg-painting) on the ring's west arc.
  - Hang a lantern line from post to post round the ring.
  - Put a timber entry arch on the path from the cottage, original and not a torii.
  - 3D: build from `building-kit.ts` boxes with bevelled edges. Lanterns are emissive and
    instanced, with bloom and no real lights.
  - Pixel: three 32×32 billboards and a lantern string painter.
  - Lantern bodies get shapes as well as colours (round, tall and box), so colour is not the
    only signal.
- **Phone cost:** 3D about 4 draws, instanced; pixel about 6 sprites. **Effort:** M.

**V21. Turn the festival's establishing shot so the crowd faces the camera.**
- **Renderer:** both; seen in 3D. **Serves:** Hazel c12-open.
- **Seen:** the ring faces the picnic, and the camera is south of it, so the near half of the
  crowd shows the backs of their heads.
- **Reference:** Scarlet/Violet's group cutscenes stand the crowd in an open arc toward the
  camera.
- **How:** leave a 90° gap in the ring on the camera side (V11's horseshoe does this), and let
  `establish` pick the yaw that looks into the gap.
- **Phone cost:** none. **Effort:** S.

**V22. Give exclusive interiors a backdrop and keep stray Grove bits out.**
- **Renderer:** both. **Serves:** The Beetle Road's guard house; every `inside-*` set.
- **Seen:**
  - Pixel: the guard house floats in a navy void, and Grove decals still show in it: an orange
    dithered disc, grass tufts and white specks.
  - 3D: the room sits in pure black at 25% of the frame. In 3D the Dew banner's drop reads as
    a second moon.
- **How:** for `exclusive` stages, also skip ground decals, particles and ambient life. Paint
  a soft vignette instead of the flat void: warm lamplight falling off to dark. Show the room
  at 1.25× so it fills 45% of the frame, not 25%.
- **Phone cost:** less drawing. **Effort:** S.

**V23. Put Ida on a step, and the Fold's step on screen.**
- **Renderer:** 3D. **Serves:** The Hundred Days c1–c2.
- **Seen:** 3D Ida stands small in the meadow, on a dithered grey rectangle (H10's dither
  patch is back, under the Fold's ruin footprint). The step she "sits on" isn't drawn, and the
  no-fence gate is drawn side-on from above, so it doesn't read as a gate.
- **How:**
  - Build "the one whole step" as one stone slab at the `STEP` mark, from the item kit.
  - Remove the footprint's dither (the K2 floor of a hidden box).
  - Yaw the establish so the gate is seen square-on with the Fold behind it, as Legends:
    Arceus frames Jubilife's gate.
- **Phone cost:** none. **Effort:** S.

**V24. Fade foreground buildings at the bottom of the frame as well as in the middle.**
- **Renderer:** both. **Serves:** Hazel c4, c10.
- **Seen:**
  - Pixel c4: the gate's red roof sits half under the dialogue box.
  - 3D c10: a big dark roof crops into the bottom-right corner.
- **How:** extend the occluder test to anything whose screen box intersects the lower 25% band,
  above the dialogue box (the HUD-safe area of H4). Fade it, or shift the aim up.
- **Phone cost:** none. **Effort:** S.

**V25. Move the lamp post off the pond.**
- **Renderer:** pixel. **Serves:** Hazel ch10–12 (frozen pond).
- **Seen:** a lamp post stands in the middle of the ice in c10 and c12. When the pond is water,
  it is a pole in the water.
- **How:** if it is `lantern-3` or the pond's own post, set it on a short jetty end, or 0.6
  units onto the bank (`stage-marks.ts` `byPost('lantern-3')`).
- **Phone cost:** none. **Effort:** S.

**V26. Unlit 3D boards go black at night: give every material a floor.**
- **Renderer:** 3D. **Serves:** all night scenes.
- **How:** this is the material half of V10. Set a minimum emissive or ambient term (0.06) on
  the building and prop kit materials, and wire `TOON.sky` into every kit material, not only
  the creatures. Night stays dark but never pure black.
- **Phone cost:** none. **Effort:** S.

**V49. Keep the shot change above the frame floor.**
- **Renderer:** 3D. **Serves:** Logged In ch4, and any cut from `establish` to `two`.
- **Seen:** the push-in from the Night Grove establish to Juno's two-shot read **27 fps on a
  desktop GTX 1080**. Every other frame held 55–57 fps. On a phone this is the scene where the
  30 fps floor breaks.
- **Likely cause:** the cut brings near grass, the grid overlay and the fireflies into the near
  band at once, possibly with a shader warm-up for the closer LOD.
- **How:**
  - Pre-warm the next shot's LOD and programs during the establish hold (`hold` or the first
    line).
  - Cap firefly sprites in `close` and `two` shots.
  - Profile with the CDP 4× throttle recipe.
- **Phone cost:** this item *is* the cost fix. **Effort:** M.

### Medium

**V27. Story items glint and bob where they lie.**
- **Renderer:** both. **Serves:** Hazel's letter on the signpost (c1), the stone on the hill,
  the Beetle Road notebook, the Logged In recording.
- **Reference:** Tears of the Kingdom: items you can pick up sparkle slightly where they lie
  (Nintendo's own tip). Palworld's pickups glow and bob.
- **How:** `glint-3d.ts` and the pixel glint exist. Apply them to every stage `item` while it is
  in the world, not only in the close-up cutaway. The bob is 2 px or 0.05 units at 0.5 Hz.
  Under reduced motion, use a still star with no bob.
- **Phone cost:** one quad per item. **Effort:** S.

**V28. Give each campaign a skyline landmark you can see from anywhere in it.**
- **Renderer:** both. **Serves:** all five.
- **Landmarks:** Hazel: the hill's crown tree. Fold: the stopped mill wheel. Logged In: a server
  mast with a slow beacon (still under reduced motion). Beetle Road: the guard-house lookout.
  Dawn & Dusk: the shrine's roof.
- **Reference:** Tears of the Kingdom's landmark silhouettes, and Palworld's readable base
  silhouettes at distance.
- **How:** one low-poly mesh each at the set's edge (3D, on the far ring), or one tall
  billboard (pixel), drawn in the fog colour so it holds as a silhouette.
- **Phone cost:** one draw. **Effort:** M.

**V29. Warm lantern pools in every night camp.**
- **Renderer:** both. **Serves:** Fold ch9–10, Beetle Road nights, Logged In ch4 ("lights off"
  ends), Hazel ch3 and ch6.
- **Reference:** Palworld's lantern-lit bases at night.
- **How:** reuse `lamp-pool.ts` (a decal disc, no light) under each lit lamp, window and fire.
  Pixel: a one-tile radial warm overlay. Tie it to `lights` in the stage, so `out` really
  darkens the pool.
- **Phone cost:** 3D one instanced decal draw; pixel a sprite per lamp. **Effort:** S.

**V30. Region threshold markers for the separate campaigns.**
- **Renderer:** both. **Serves:** entering the Fold, the Server, the Hollow stairs and the
  green.
- **Reference:** Legends Z-A: wild zones are fenced areas with clear markers. Borrow the
  "bounded area, numbered post" idea.
- **How:** a carved post with the campaign's glyph plus a ground ring at each entry, using the
  region's own shape, not only its colour. Pixel 32×48; 3D a bevelled post from
  `building-kit.ts`. The glyph lights at night with emissive.
- **Phone cost:** 1 draw per region. **Effort:** S.

**V31. The Fold rebuilds over the hundred days.**
- **Renderer:** both. **Serves:** The Hundred Days ch2–10.
- **Reference:** Legends: Arceus' Jubilife Village grows as the story goes on.
- **How:** three ruin states per Fold house (open rafters → patched roof → whole roof),
  chosen from the chapter. Data: `stage.props.foldRoofs: 'ruin' | 'patched' | 'whole'`. The
  houses already exist in package b (`dress-b*.ts`).
- **Phone cost:** none (a swap). **Effort:** M.

**V32. A camp set for the Hundred Days and the Beetle Road.**
- **Renderer:** both. **Serves:** Hundred ch5 (the cave), Beetle Road ch2 (`b-c2-tarp`), ch6.
- **Reference:** Legends: Arceus base camps: tent, crate stack, cook pot on a fire ring.
- **How:** a kit group of tarp, two crates, a bedroll and a fire ring with an emissive ember
  (instanced; the flame is still under reduced motion). Pixel: two billboards. Stage key:
  `props: { camp: 'show' }`.
- **Phone cost:** 3–4 draws. **Effort:** M.

**V33. Hazel's coat hook and boots tell her story across the campaign.**
- **Renderer:** both. **Serves:** Hazel c1 ("Her coat is not on its hook. Her boots are not by
  the door"), and c12.
- **Reference:** Animal Crossing: objects that change with the story are big and placed where
  you always look.
- **How:** an outdoor peg by the cottage door plus the indoor hook (V2). Empty from c1 to c11,
  with the coat and boots back when Hazel returns. Stage prop key: `coat: 'show' | 'hide'`.
- **Phone cost:** none. **Effort:** S.

**V34. The eggshell row on the sill as a keepsake.**
- **Renderer:** both. **Serves:** Hazel c1, and later hatches.
- **How:** each hatched egg adds a dated shell to the kitchen sill and the cottage's outside
  sill (read from the save's hatch count, render only). Pixel 3×4 px per shell; 3D an
  instanced half-egg.
- **Phone cost:** one instanced draw. **Effort:** S.

**V35. Logged In's world edge looks digital.**
- **Renderer:** both. **Serves:** Logged In.
- **Seen:** the grid lines and the cube walls sell the "game world", but past them it is the
  Grove's grass and trees.
- **How:** at the set's edge, fade the terrain to a dark ground with a scrolling grid. Under
  reduced motion the grid holds still. Draw trees beyond the edge as flat voxel cut-outs. Pixel:
  a palette-swapped far ring.
- **Phone cost:** none. **Effort:** M.

**V36. The Beetle Road's banners on the road, not only in the guard house.**
- **Renderer:** both. **Serves:** The Beetle Road ch1 (`b-c1-banners`), ch7.
- **Seen:** the three team banners (Dawn, Dusk and Dew) read well inside in pixel, with sun, moon
  and drop glyphs plus colour. In 3D the drop is an oval and reads as a second moon.
- **How:** give the 3D drop a pointed top. Repeat them on poles along the road and over the guard-house door, using the same
  glyphs.
- **Phone cost:** instanced cloth quads. **Effort:** S.

**V37. Window glow and snow caps for winter chapters.**
- **Renderer:** both. **Serves:** Hazel ch10–12, Hundred ch9–10.
- **Reference:** Animal Crossing's winter: snow on roofs and lit windows.
- **How:** a white roof-cap mesh or sprite layer per building when the season is winter.
  Window panes go emissive from 16:00 (3D bloom; pixel a palette swap).
- **Phone cost:** 1 extra draw per building, or merged. **Effort:** M.

**V38. A shot for the item-get beat.**
- **Renderer:** both. **Serves:** Hazel's letter, the Hundred Days box, the Beetle notebook.
- **Reference:** Scarlet/Violet's close cut on a held key item.
- **How:** K39's item-get pose exists. Pair it with a `close` shot on the Keeper's hands for
  the line that has `item`, followed by the cutaway.
- **Phone cost:** none. **Effort:** S.

**V39. Corvin's garden needs his house in shot.**
- **Renderer:** both. **Serves:** Hazel ch2 onward (`corvin` place), Hundred ch8.
- **How:** check that each `corvin` establish includes his door. Stage his first visit inside
  (`inside-corvin`, V2), so his grey Nubbins are seen against warm light.
- **Phone cost:** none. **Effort:** S.

**V40. The memorial hill's path stones should look like stepping stones.**
- **Renderer:** 3D. **Serves:** Hazel ch4, ch12, and every hill scene.
- **Seen:** the stones are big white low-poly lumps scattered on the slope. They read as rubble,
  or as eggs.
- **How:** flatten them to 0.08 units high, set them into the grass, and use a warm grey with
  a moss tint.
- **Phone cost:** none. **Effort:** S.

**V41. Bring the oversized flower on the hill down to scale.**
- **Renderer:** 3D. **Serves:** Hazel ch4.
- **Seen:** a pink flower in the left foreground stands taller than the Keepers.
- **How:** if it is a memorial flower, scale it to knee height and cluster it. If it is decor,
  drop it from the story shot's near band.
- **Phone cost:** none. **Effort:** S.

**V42. A Long Night colour script you can see at a glance.**
- **Renderer:** both. **Serves:** Hazel ch9–11.
- **How:** H18 gave ch9–11 a grey-blue grade. Strengthen it with one warm accent per scene
  (lanterns only) and desaturate everything else to 40%. Pixel: limit the palette to 12 cold
  colours plus the lantern ramp.
- **Phone cost:** none. **Effort:** S.

### Nice-to-have

**V43. Ending tableaux with the season's decoration.**
- **Renderer:** both. **Serves:** the endings of all campaigns.
- **How:** N2's tableau, dressed with the K43 wreath and the V20 lantern lines in the colours
  of that ending.
- **Effort:** S.

**V44. A dawn mist and dusk fireflies to tell Dawn & Dusk's halves apart.**
- **Renderer:** both. **Serves:** Dawn & Dusk.
- **How:** in addition to M6: a still mist sprite for dawn and fireflies for dusk (a still
  glow under reduced motion).
- **Effort:** S.

**V45. Photo mode remembers the stage's grade.**
- **Renderer:** both. **Serves:** all campaigns.
- **How:** K30 does this for the chapter photo; extend it to manual photos taken during a
  scene.
- **Effort:** S.

**V46. A picnic set in the Fold for the Hundred Days' finale.**
- **Renderer:** both. **Serves:** Hundred ch10.
- **Reference:** Scarlet/Violet picnics: a cloth, a table and the partner Pokémon round it.
- **How:** reuse the c12 picnic cloth with Ida's broom against the step.
- **Effort:** S.

**V47. The shot test checks coverage and black.**
- **Renderer:** tools. **Serves:** all campaigns.
- **How:** K49 plus V6's speaker-coverage check and V10's black-cluster probe, run on the
  golden set. Fold the deployed-title label and the `<details>` patch into
  `tests/tools/story-shots.cjs`.
- **Effort:** S.

**V48. Re-shoot the separate campaigns at phone size.**
- **Renderer:** both. **Serves:** all four separate campaigns.
- **How:** this round shot desktop only. Run the recipe's phone jobs once V1–V11 land.
- **Effort:** S.

## Staging data the content would need

New fields on `SceneStage` (`src/config/story.ts`), all optional, all render-only:

| Field | Type | For |
| --- | --- | --- |
| `beats` | `Record<number, SceneStage>`, keyed by line index | V1: a stage change mid-scene |
| `props.cup`, `props.coat`, `props.eggshells` | `'show' \| 'hide'` | V2, V33, V34 |
| `props.foldRoofs` | `'ruin' \| 'patched' \| 'whole'` | V31 |
| `props.camp`, `props.stalls`, `props.lanternLine`, `props.arch` | `'show' \| 'lit' \| 'out'` | V20, V32 |
| `props.marker` | `'show'` | V30 |
| `fx: 'mist'` | still under reduced motion | V17, V44 |
| `cast[].carry: 'egg'` for `you` | existing type, new use | V7 |
| `shot.minPairAngle` | degrees, default 50 for `two` | V8 |

New data outside `SceneStage`:
- `ROOM_FURNITURE.kitchen` gets the cup, the coat hook and the eggshells (V2).
- `STAGE_SET_SWAPS` in `config/stage-sets.ts` (V15).
- The festival ring becomes a horseshoe, in `stage-marks.ts` (V11, V21).
- Region toasts get a signer chosen by chapter (V5).

Content changes, as data only, in `scene-stages-*.ts`:
- `c1-letter` beats at lines 7, 11 and 17.
- `c10-open` hour 8.5 with grade `crisp`.
- `c12-open` grade `crisp`.
- Hundred Days ch1–2 `carry: 'egg'` for `you`.
- Kitchen stagings for c12's cup line and Nova's lantern.
- `inside-corvin` and `inside-crest` scenes.

## Sources

- Festival of Masks (Kitakami): https://bulbapedia.bulbagarden.net/wiki/Festival_of_Masks
- Kitakami: https://bulbapedia.bulbagarden.net/wiki/Kitakami
- Kitakami Ogre Clan (festival masks): https://bulbapedia.bulbagarden.net/wiki/Kitakami_Ogre_Clan
- Scarlet/Violet picnics: https://serebii.net/scarletviolet/picnic.shtml
- Scarlet/Violet Terastallization and picnics preview: https://rpgamer.com/?p=120538
- Legends Z-A wild zones: https://bulbapedia.bulbagarden.net/wiki/Wild_zone
- Legends Z-A wild zones guide: https://allthings.how/pokemon-legends-z-a-wild-zones-how-they-work-and-where-to-start/
- Legends Z-A Lumiose map: https://www.gamesradar.com/games/pokemon/full-pokemon-legends-z-a-map-and-all-locations
- Jubilife Village: https://SEREBII.NET/legendsarceus/jubilifevillage.shtml
- Jubilife Village grows with the story: https://gamesradar.com/jubilife-village-is-the-only-settlement-in-pokemon-legends-arceus-but-it-will-evolve
- Legends: Arceus art: https://creativeuncut.com/art_pokemon-legends-arceus_b.html
- Palworld lamps: https://palworld.wiki.gg/wiki/Lamp
- Palworld wall torch: https://palworld.wiki.gg/wiki/Wall_Torch
- Palworld structures: https://palworld.wiki.gg/wiki/Structure
- Tears of the Kingdom tips (pickup sparkle): https://play.nintendo.com/news-tips/tips-tricks/hyrule-tips-and-tricks-tears-of-the-kingdom/
- Tears of the Kingdom cues for movable and breakable objects: https://siliconera.com/?p=962514
