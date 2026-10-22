# Campaign graphics recommendations (2026-10-21)

Report only: nothing in the game was changed. This covers Hazel's Grove (12 chapters) and the four
separate campaigns: The Hundred Days, Logged In, The Beetle Road and Dawn & Dusk. It covers both
renderers. The Hollow dungeon is left out because `docs/hollow-graphics-recommendations-2026-10-21.md`
already covers it.

**How this was judged.** The live build (https://diablomaster8.github.io/TryThisGame/?debug, at
origin/main 21f3c34) ran in headless Edge with `--use-angle=d3d11`, at 1280×720. I used the debug
panel's chapter jumps and took shots in both modes:

- Hazel's Grove at the openings of chapters 1, 2–4, 8–10 and 12.
- The opening scene and chapter 3 of each separate campaign.

The local clock was 18:38, which is dusk in `render/daylight.ts`. The scripted "late afternoon",
"night" and "first light" scenes therefore show what each renderer does when the text and the
clock disagree. The shots are in the session scratchpad and not in the repo. Each item below
says what its shot showed.

## Where it stands

**Pixel (default).** The pixel view is the painted Grove: a thatched cottage, a dojo, a windmill,
four lantern posts, a pond and terraced hills. It reads well by day and holds 56–60 fps at
desktop size. Its gaps:

- **No staging.** Every story scene plays in whatever the Grove looks like at that moment, at the
  real clock's hour. "The longest night. The sun gets up late and low…" (`c10-open`) showed in
  full afternoon light with Nubbins wandering.
- **A weak dusk grade.** At 18:38 the post grade (`post.ts` `tintAmount`, `PIXEL_LIGHT`) only warms
  the frame slightly. Lit windows are the only sign of evening.
- **Story places only half exist.** Corvin's garden (`buildCorvin` in `render/grove-scene.ts`)
  draws as rows of grey Nubbins in pale pens on the darkened Grove floor. It has no frost, gate,
  house or Corvin's chair.
- **The separate campaigns have no art of their own.** All four open on the stock Grove. The
  Hundred Days opens on "Past the gate, the Fold: roofs with the sky in them." over a tidy
  thatched cottage. Dawn & Dusk opens on "Four houses stand round the green." where one cottage
  stands. The Beetle Road's guard house and banners don't exist either.
- **No gate.** "The last of it is grass, and then a gate" has nothing to point at.

**Full 3D.** Since the two art passes, the 3D view has strong pieces:

- toon-lit bevelled houses;
- lamplit lanterns with ground pools;
- fireflies;
- a painted sky;
- `SceneStaging` (`render3d/staging.ts`), which reads the hour from the narration. `c10-open`
  correctly went to night.

It holds 56–60 fps here (on a desktop GPU; the phone budget is still unproven). Its gaps:

- **Night is unreadable.** At the night grade, `c10-open` and The Beetle Road's opening are almost
  black. You see silhouettes of Nubbins and Keepers, two glowing lantern heads and fireflies. You
  can't read any face or prop.
- **Framing misses the speaker.** In ch9, Corvin speaks for several lines and is not in frame,
  because `frame()` only adds speakers within `READ3D.stage.radius`. In ch4, "He is old. You can
  see it in how he sits" shows the Keeper on the path, with no Moss and no flat stone.
- **Corvin's garden floats.** The garden (`story-sets.ts`) is a flat brown plane fading into
  fog. It has no horizon, no frost, no gate and no house.
- **Story props are plain boxes.** `storyPropModel` in `garden.ts` builds each one from 2–4 unlit
  boxes. They don't match the kit-built houses beside them.
- **The separate campaigns get recolours at most.** Logged In's Sun Grove grade turns the whole
  ground flat orange, with grass cut-outs standing on it.

## Recommendations

Each item gives: **What** · **Renderer** · **Serves** · **Reference** · **How** · **Phone cost**
· **Effort**.

### Critical: scenes that are unreadable or contradict their text

**C1. Add per-scene staging data and one stager that both renderers read.**
- **Renderer:** both.
- **Serves:** every campaign.
- **Reference:**
  - *Pokémon Scarlet/Violet*: cutscenes cut to a fixed two-shot on the NPC.
  - *Legends: Arceus*: story beats move you to the right place and time first.
- **How:**
  - Add an optional `stage?: SceneStage` to `Scene` in `src/config/story.ts`. The fields are in
    "Staging data the content would need" below.
  - Move the read-and-resolve logic out of `render3d/staging.ts` into `sim`-free
    `render/scene-stage.ts`, which both scenes use.
  - Keep `hourOf()` as the fallback when `stage.hour` is absent.
  - The sim never reads it; the renderers only draw from it. The NPCs' sim positions stay as
    they are, and only the drawn positions use the stage marks, as `holds` does now.
  - Content: author `stage` for the ~60 Hazel's Grove scenes listed below, and for each
    storyline chapter's opening and closing.
- **Phone cost:** none (data).
- **Effort:** M (code) + M (content pass).

**C2. Stage the hour in the pixel renderer.**
- **Renderer:** pixel.
- **Serves:** Hazel's Grove ch2 (`c2-corvin` late afternoon), ch3 (night), ch4 (Lantern Night
  dusk), ch8 (first light), ch10 (the longest night), ch12 (`c12-close` dusk). Also Dawn & Dusk
  ("first light") and The Hundred Days (`The Hush` puts out lamps).
- **Reference:** *Teal Mask*: the Festival of Masks plays in a fixed dusk grade, whatever the
  player's clock.
- **How:**
  - In `render/grove-scene.ts`, where `setDaylight` is fed from `currentHour()`, feed it
    `daylightAt(stage.hour ?? hourOf(lines) ?? clock)` while a scene is queued.
  - Blend over ~1 s. Under reduced motion, cut instead of blending.
  - Restore the clock's hour when the queue empties.
- **Phone cost:** none.
- **Effort:** S.

**C3. Make 3D night readable: a character key light and a raised night floor.**
- **Renderer:** 3D.
- **Serves:** ch3 `c3-open`, ch4 `c4-tale`, ch10 (the whole Long Night), The Beetle Road's
  opening at night, and the Logged In Night Grove.
- **Reference:**
  - *Palworld*: night bases are lit warm, and the land beyond goes blue rather than black.
  - *Scarlet/Violet*: at night, characters keep a moonlit rim.
- **How:**
  - Raise the night `hemiIntensity` and the sky env share in `GROVE3D.sky`/`sky.ts` so that
    unlit ground sits at ~18–22% luminance in a blue-violet tint, not ~5%.
  - Add a `nightRim` uniform to the creatures' and Keepers' toon shader: a cool rim term,
    already shaped by `TOON.rim`.
  - While a scene is staged, put one of the `LampPool` slots on the framed speakers as a soft,
    shadowless "story key".
- **Phone cost:** low. The rim is a few ALU ops, and the pool slot already exists.
- **Effort:** S.

**C4. Build a gate model for the Grove's entrance, in both renderers.**
- **Renderer:** both.
- **Serves:**
  - `c1-letter` (the stuck gate; the letter on the signpost);
  - `c2-corvin` (it swings open for him);
  - `c8-open` (Nova at the gate; Fern's bag);
  - `c11-gate` (Corvin's return), and the ending epilogues that hinge on the gate;
  - The Hundred Days ("a gate with no fence either side of it").
- **Reference:**
  - *Teal Mask*: a torii-style timber gate as the landmark where the road meets the settlement.
  - *Tears of the Kingdom*: landmark silhouettes.
- **How:**
  - **3D:** a kit-built wooden field gate in `building-kit.ts` style: two bevelled posts, a
    cross-braced leaf, a hinge side, a small roof cap and a lantern hook. Place it at the main
    path's outer end (`fenceSpots` in `village.ts` already lines that path).
  - **Gate states:** an `openness` 0–1 (a stuck, part-open leaf) and an `overgrown` flag (ivy
    cards on the posts, set in ch1).
  - **Pixel:** paint it in `paint/decor.ts` as two frames (shut and open) plus an ivy overlay.
  - The Hundred Days uses a variant with no fence either side.
- **Phone cost:** 2–3 draw calls.
- **Effort:** M.

**C5. Frame the speaker even when they are far away: move them or move the shot.**
- **Renderer:** 3D (and pixel, through C14).
- **Serves:** ch9 (Corvin is off-frame), ch4 `c4-open` (Moss at the flat stone), and every NPC
  arrival at the gate.
- **Reference:** *Scarlet/Violet*: cutscenes place the NPC on a mark next to the player before the
  first line.
- **How:**
  - In `SceneStaging`, use `stage.cast` marks (C1). With no marks, an NPC beyond
    `READ3D.stage.radius` is drawn at a spot 2–3 units from the Keeper, facing them.
  - The draw position fades out and back in over 0.4 s, or cuts under reduced motion.
  - Drop the `near()` gate for anyone named in the current line.
- **Phone cost:** none.
- **Effort:** S.

**C6. Give The Hundred Days the ruined Fold.**
- **Renderer:** both.
- **Serves:** The Hundred Days, all chapters: "roofs with the sky in them", the stopped mill
  wheel, the bathhouse that steams on the Hundredth Day.
- **Reference:** *Legends: Arceus*: Jubilife Village is wooden and pastoral, and it visibly grows
  as the story goes on.
- **How:**
  - Add a `ruin` level (0–3) per building to the kit:
    - a roof with missing courses (skip quads in `house()`'s roof bucket);
    - open rafters;
    - boarded windows;
    - moss on the plinth.
  - A sim-side number `hundred.mended` (a count of chapters cleared) picks each building's level.
    The renderers only read it.
  - The windmill's sails stop at level ≥ 2, the mill wheel stops, and the bathhouse steam card is
    off until the last chapter.
  - Pixel: paint the ruin variants as extra frames for each building sheet in
    `paint/buildings.ts` (gapped thatch, open rafters).
- **Phone cost:** none (the variants are baked).
- **Effort:** L.

**C7. Give Dawn & Dusk its four houses round a green.**
- **Renderer:** both.
- **Serves:** Dawn & Dusk, all chapters ("Four houses stand round the green", each with a carved
  creature over its door; the shrine; the dojo).
- **Reference:**
  - *Legends: Z-A*: Lumiose gives each district its own identity.
  - *Teal Mask*: Mossui Town as one small, readable settlement.
- **How:**
  - A `dawndusk` dressing set: four `kitHouse`s round a mown circle, each with its own roof colour
    and a carved crest board over the door.
  - The crest is a shape, not just a colour: sun, moon, leaf and wave silhouettes in relief.
  - Swap the cottage and the school for it while the save is in `dawndusk` mode.
  - Pixel: four painted house sprites from `paint/buildings.ts`, placed on the existing house
    spots plus two new ones.
- **Phone cost:** about four draw calls, merged by material.
- **Effort:** M.

**C8. Make Corvin's garden a place: frost, a horizon, a gate and a house.**
- **Renderer:** both.
- **Serves:** Hazel's Grove ch9: "the valley road in frost, nearly midwinter"; pens of grey
  Nubbins with painted numbers; the pens left open.
- **Reference:**
  - *Legends: Arceus*: camps sit in a painterly terrain palette with a clear skyline.
  - *Tears of the Kingdom*: landmark silhouettes.
- **How:**
  - **3D, in `story-sets.ts`:**
    - Ring the plane with a cheap backdrop of instanced frosted trees and a low hill card, so the
      fog meets land, not void.
    - Add a frost term to the earth material: white noise on the upward normals.
    - Add Corvin's grey kit house with one lit window and the C4 gate in a grey variant.
    - Give the pens a gate leaf each that swings when `c9` sets them open.
  - **Pixel, in `buildCorvin`:** a frost overlay texture over the floor, a painted house sprite
    and a gate.
  - Add the numbers (C15).
- **Phone cost:** about four draw calls.
- **Effort:** M.

### High

**H1. Stage the season per chapter.**
- **Renderer:** both.
- **Serves:** Hazel's Grove:
  - late spring (ch1);
  - high summer (ch5: wasps in the plum tree);
  - autumn (ch8);
  - frost and midwinter (ch9–11);
  - a cold, bright morning (ch12).
- **Reference:** *Animal Crossing: New Horizons*: seasonal ground and tree colour carries the
  calendar at a glance.
- **How:**
  - Add a `stage.season` field. Both renderers already have seasons (the weather and seasons
    system). While a scene is queued, the scene's season overrides the calendar's season for
    drawing only: leaf tint, grass tint, frost and snow cover.
- **Phone cost:** none.
- **Effort:** S.

**H2. Stage the weather per scene.**
- **Renderer:** both.
- **Serves:** ch6 (three days of rain on the hill), ch7 (frost round the fourth post, white
  grass), `c4-out` (a cold wind), The Hundred Days' "The Mire" (rains).
- **Reference:** *Scarlet/Violet*: overworld weather is reused as the set dressing for story
  beats.
- **How:**
  - Add `stage.weather` (`rain`, `snow`, `frost`, `wind`, `clear`). Feed it to `GroveWeather.set`
    and to the pixel `particles.ts` env while the scene is up.
  - `frost` is a ground tint with no particles.
  - Reduced motion already removes the particles; keep the ground tint so the cue stays.
- **Phone cost:** the same as live weather.
- **Effort:** S.

**H3. Script Lantern Night: the four posts lit by name, and the vigil's waves.**
- **Renderer:** both.
- **Serves:** `c4-close` (four posts lit: pond, stream, old wall, long grass; the long-grass one
  flickers) and `c10-vigil` (lanterns go out in waves; Keepers hold their own).
- **Reference:**
  - *Teal Mask*: the Festival of Masks lanterns at dusk.
  - *Palworld*: warm lamplit bases.
- **How:**
  - Add `stage.lights: { 'lantern-1'..'lantern-4': 'lit' | 'out' | 'flicker' }`.
  - **3D:** the lamp head's emissive goes up for `lit`. The `LampPool` takes the lit posts first
    (no new lights).
  - **Flicker:** an emissive wobble that is off under reduced motion, where it shows as a steady,
    dimmer glow.
  - **Pixel:** add `lit`/`out` frames to `lanternPost()` and a halo sprite.
  - The vigil's waves come from the sim's existing wave timer (`campaign.ts` :363-388). The
    renderers only read it.
- **Phone cost:** none.
- **Effort:** S.

**H4. Hand lanterns for NPC Keepers in night scenes.**
- **Renderer:** both.
- **Serves:** `c10-vigil` (Keepers holding their own), `c12` (Hazel walks up the hill with her
  lantern), the Long Night.
- **Reference:** *Palworld*: carried light reads as warmth at a distance.
- **How:**
  - **3D:** attach `storyPropModel('handLantern')`, rebuilt per H10, to the NPC's hand bone. Give
    it an emissive head and one billboard glow card, with no real light.
  - **Pixel:** a 2-frame hand-lantern overlay in `sprites/keeper.ts`, drawn when
    `stage.cast[i].carry === 'lantern'`.
- **Phone cost:** one instanced card per lantern.
- **Effort:** S.

**H5. Build the Hollow camp and the ledge behind the falls.**
- **Renderer:** both.
- **Serves:**
  - ch8 `c8-close`: a cold fire, a dozen bowls, grey shapes, Hazel's notebook on a flat stone;
  - `c8-ledge`;
  - ch10 `c10-ledge`: the stone glowing blue.
- **Reference:** *Legends: Arceus*: base camps, with a ring of stones, packs and a cold firepit.
- **How:**
  - Add to `StorySets.buildHollow`:
    - a stone fire ring with grey ash and no flame;
    - twelve small instanced bowls in a loose arc;
    - the notebook on the flat stone (the C10 glint on it).
  - Grey shapes: Shadow Nubbins from the creature pool, tinted to the Shadows' grey and seated.
  - The ledge: a rock shelf mesh behind the waterfall plane, at the falls' foot, with the
    waterfall's alpha layer in front.
  - Pixel: the same pieces as `paint/decor.ts` sprites in `buildHollow`.
- **Phone cost:** about three draw calls (the bowls are instanced).
- **Effort:** M.

**H6. Stage the Long Night's set pieces: the falls stop, the blue stone, the gold water.**
- **Renderer:** both.
- **Serves:** `c10-falls`, `c10-ledge`, `c10-safe-*` (warm water with gold light), `c10-dawn`
  (first light at the falls).
- **Reference:**
  - *Tears of the Kingdom*: one landmark changing state carries a whole story beat.
  - *Scarlet/Violet*: Tera crystals as glowing accents.
- **How:**
  - Add `stage.fx: ['fallsStill', 'stoneGlow', 'goldWater']`.
  - **3D:**
    - `fallsStill`: freeze the waterfall shader's scroll uniform and swap in a frosted tint.
    - `stoneGlow`: blue emissive on the flat stone, plus a bloom card.
    - `goldWater`: lerp the `paintedWater` colours to gold.
  - **Pixel:** the waterfall texture stops scrolling and gets an icy palette shift. The stone gets
    a halo sprite. The pond uses a gold palette.
  - Every one of these is a held state with no pulsing, so it is safe under reduced motion.
- **Phone cost:** none (uniforms).
- **Effort:** S.

**H7. Dress the memorial hill: the flat stone halfway up, a path and a crest.**
- **Renderer:** both.
- **Serves:**
  - `c4-open` (the flat stone halfway up the hill, with Moss);
  - ch6 (Dusty and Fossil on the hill; the flower comes up);
  - canon: Briar's flower was the first on the hill;
  - `c12-walk-*` (Hazel's walk up the hill path; the turf at the top overlooking the Grove).
- **Reference:** *Tears of the Kingdom*: a hilltop landmark seen from the whole map.
- **How:**
  - A worn path decal winding up `hill[0]`, the `flatStone` story prop placed halfway up, and a
    single crest tree or a wind-bent hawthorn at the top as the silhouette.
  - Briar's flower: an older, larger `memorialFlower()` variant with a stone ring. The
    difference is shape and size, so colour isn't the only cue.
  - Pixel: path tiles on the terrace tops in `paint/terrain.ts`, plus a tree sprite.
- **Phone cost:** 1–2 draw calls.
- **Effort:** M.

**H8. Give the 3D story camera shot types, framed above the dialogue box.**
- **Renderer:** 3D.
- **Serves:** every scene. In every 3D shot the dialogue box covers the bottom 22% of the frame,
  and the Keeper stands at its top edge.
- **Reference:** *Scarlet/Violet*: cutscenes use a two-shot and an over-the-shoulder shot on the
  NPC.
- **How:**
  - Add `stage.shot`: `wide` | `two` | `close` | `over` | `establish`, with an optional `yaw`.
  - In the 3D camera, compute the target from the framed points, then offset the look-at down by
    the dialogue box's height in screen space, so the subjects sit in the upper two-thirds.
  - `close` uses the near zoom level. `establish` is a slow 2 s dolly that becomes a cut under
    reduced motion.
- **Phone cost:** none.
- **Effort:** M.

**H9. Fade buildings, trees and crowns that block the camera.**
- **Renderer:** 3D.
- **Serves:** every scene near the cottage, windmill or dojo. In the shots, the windmill and the
  cottage crop the top of every frame.
- **Reference:** *Animal Crossing: New Horizons* and *Legends: Arceus*: occluders dither out
  around the player.
- **How:**
  - Reuse the crown dither (`HOLE` in `crowns.ts`) in `buildingMaterial`: a screen-space circle
    around each framed point, dithered (no alpha sort).
  - Turn it on per building when a ray from the camera to any framed point hits that building's
    pick box.
- **Phone cost:** low (one branch in the fragment shader).
- **Effort:** M.

**H10. Rebuild the 3D story props from the building kit.**
- **Renderer:** 3D.
- **Serves:** all eleven `STORY_PROPS`:
  - the trowel, hatch register, Hazel's lantern, sunrise shelf and flat stone;
  - two old benches (Hazel's bench and the hush bench) and Corvin's chair;
  - the lantern shed, old barn and walled-garden door.
- **Reference:** *Palworld*: chunky crafted props with bevelled edges, readable at a distance.
- **How:**
  - Replace `box()` in `storyPropModel` (`garden.ts`) with `bevelBox` and `buildingMaterial`.
  - Add one detail each:
    - a curved handle on the trowel;
    - a ledger with ruled pages on the register;
    - a wire cage and an emissive glass on the lantern;
    - dated eggshells on the shelf;
    - lichen speckle on the stone;
    - a carved back on Corvin's chair.
  - Merge each prop by material.
- **Phone cost:** none (the same draw calls).
- **Effort:** M.

**H11. Make story items glint, and bob them with motion on.**
- **Renderer:** both.
- **Serves:** Hazel's notebook (ch8), the shard tin (ch9), keepsake rewards, the visor (Logged
  In), Vane's notebook and the lever (The Beetle Road), and the shrine lamp, scanner lens and old
  bell (Dawn & Dusk).
- **Reference:**
  - *Legends: Arceus*: ground items sparkle.
  - *Palworld*: pickups glow and bob.
  - *Tears of the Kingdom*: item glints.
- **How:**
  - **3D:** one instanced star-glint card per item, plus a 0.06-unit bob. Under reduced motion,
    the glint is a static four-point star and nothing bobs.
  - **Pixel:** the existing `view.sparkle`, held steady under reduced motion.
  - Shape is the cue (a star), so colour isn't the only signal.
- **Phone cost:** one instanced draw.
- **Effort:** S.

**H12. Give the NPC Keepers silhouettes you can tell apart.**
- **Renderer:** both.
- **Serves:** Hazel's Grove's cast:
  - Corvin: the man in the grey coat.
  - Hazel: back in ch11, smaller.
  - Marina: a bucket.
  - Fern: a bag at the gate.
  - Dusty, with Fossil.
  - Nova, Ember and Sable's Keeper.
- **Reference:**
  - *Scarlet/Violet*: every named NPC has one silhouette prop.
  - *Palworld*: silhouettes stay clear at a distance.
- **How:**
  - Add `npcLooks` in `config/` with a per-NPC accessory: Corvin's long coat (a skirt flare on the
    torso), Marina's bucket, Fern's satchel, Hazel's shawl and a smaller scale.
  - **3D:** accessory meshes on the existing Keeper rig.
  - **Pixel:** overlay frames in `sprites/keeper.ts` on a 32-px grid.
  - Corvin's grey coat must differ in shape, not only in grey.
- **Phone cost:** none.
- **Effort:** M.

**H13. Build a festival set for `c12-open`.**
- **Renderer:** both.
- **Serves:** Hazel's Grove ch12: the gathering, the collapsed glowing cake, lantern buns, Marina's
  feet in the pond.
- **Reference:**
  - *Teal Mask*: stalls at Kitakami Hall's Festival of Masks, paper lanterns, a dusk grade.
  - *Scarlet/Violet*: picnic set dressing.
- **How:**
  - Turn on the `village.ts` festival stalls.
  - String paper-lantern bunting between the four posts: one instanced emissive sphere-quad per
    lantern on a catenary.
  - Add picnic cloths with the cake (emissive icing) and buns on a tray.
  - Pixel: a bunting sprite strip and a cloth sprite.
- **Phone cost:** about three draw calls.
- **Effort:** M.

**H14. Pan and zoom the pixel camera to the scene.**
- **Renderer:** pixel.
- **Serves:** every scene. Today the pixel camera stays on the Keeper and shows the whole map.
- **Reference:** *Scarlet/Violet*: framing on NPCs.
- **How:**
  - In `render/camera.ts`, while a scene is queued, ease the orbit target to the centroid of
    `stage.cast`, or of the framed speakers, and use the near zoom for `two` and `close` shots.
  - The frame is pixel-snapped, as the follow camera already does.
  - Under reduced motion, cut instead of easing.
- **Phone cost:** none.
- **Effort:** S.

**H15. Show the numbers on Corvin's grey Nubbins.**
- **Renderer:** both.
- **Serves:** ch9: grey Nubbins carrying painted numbers.
- **Reference:** *Legends: Z-A*: wild zones have big numbered gates as markers.
- **How:**
  - **3D:** a decal card on the back of each penned Nubbin, using a 1–40 number atlas (one
    texture, instanced UV offsets).
  - **Pixel:** a 2-digit overlay sprite on the back angle.
  - Take the numbers from the sim's pen order.
- **Phone cost:** one instanced draw.
- **Effort:** S.

**H16. Give Logged In a "game world" look.**
- **Renderer:** both.
- **Serves:** Logged In:
  - the Day Grove lobby with its scoreboard;
  - the Night Grove ("the meadow with the lights off");
  - the message board;
  - the white room with one chair at the Root Node.
- **Reference:** *Legends: Z-A*: wild zones use green holographic fences and numbered gates.
- **How:**
  - **3D:**
    - a scoreboard billboard by the pond (canvas texture);
    - holographic fence panels round the play area: emissive scanline shader, static under
      reduced motion;
    - a faint grid overlay in the post grade;
    - the Root Node room: a white unlit dome with one chair (`storyPropModel('chair')`) and a
      hard white key.
  - **Pixel:** the same as painted sprites, with an ordered-dither grid on the floor in `post.ts`.
  - Also fix the Sun Grove grade, which washes the ground flat orange in the Logged In 3D shot:
    cap the tint amount on the terrain so the grass stays green.
- **Phone cost:** low.
- **Effort:** M.

**H17. Build The Beetle Road's guard house and banners.**
- **Renderer:** both.
- **Serves:** The Beetle Road's opening ("a shed with ambitions. Three team banners hang on the
  wall: Dawn, Dusk and Dew"), the Beetle cart under a tarp, and the weather machine.
- **Reference:** *Palworld*: chunky base structures.
- **How:**
  - A `kitCabin` (it already exists in `kit-buildings.ts`) with three cloth banners.
  - Each banner has its own emblem shape (sun, moon, droplet), so the emblems don't rely on
    colour. The cloth moves with a vertex-shader wave that is off under reduced motion.
  - A tarp-covered cart: a box under a draped cloth mesh.
  - The weather machine: a kit-built tower of pipes and a rotating vane (static under reduced
    motion).
  - Pixel: painted sprites of the same.
- **Phone cost:** about three draw calls.
- **Effort:** M.

**H18. Give each campaign a colour script and a chapter title card.**
- **Renderer:** both.
- **Serves:** all five campaigns.
- **Reference:**
  - *Teal Mask*: Kitakami has its own dusk palette.
  - *Legends: Arceus*: a painterly palette per region.
- **How:**
  - Add a `CAMPAIGN_LOOK` table in `config/`: a grade tint, saturation, shadow colour and a
    title-card motif for each campaign:
    - Hazel's Grove: warm honey, then grey-blue from ch9;
    - The Hundred Days: bleached straw, moving to green as it is mended;
    - Logged In: cool cyan grid;
    - The Beetle Road: amber torchlight;
    - Dawn & Dusk: rose dawn or violet dusk.
  - It feeds `post.ts` in pixel and the grade pass in 3D.
  - Each chapter opens on a title card: the chapter name and a one-line motif drawn in canvas,
    which fades or cuts under reduced motion.
- **Phone cost:** none.
- **Effort:** M.

### Medium

**M1. A cottage-step vignette for `c1-letter`.**
- **Renderer:** both.
- **Serves:** ch1: a cold kettle, one upturned cup, a windowsill of dated eggshells, the step.
- **Reference:** *Animal Crossing: New Horizons*: furniture that reads at a glance.
- **How:**
  - Place the `sunrise-shelf` prop under the cottage window with eggshell meshes or sprites.
  - Add a kettle and a cup on the step as small kit props.
  - Show them through `stage.props`.
- **Phone cost:** one draw call.
- **Effort:** S.

**M2. A signpost with a letter under a stone.**
- **Renderer:** both.
- **Serves:** ch1. The pixel Grove has a small sign by the pond, but no letter.
- **Reference:** *Tears of the Kingdom*: item glint (H11) on the letter.
- **How:** a signpost prop by the C4 gate, with a letter card and a pebble on it. It shows while
  `c1` is unread.
- **Phone cost:** none.
- **Effort:** S.

**M3. Plum tree with wasps (ch5).**
- **Renderer:** both.
- **Serves:** `c5-open`, high summer, Ember at the gate.
- **Reference:** *Animal Crossing: New Horizons*: seasonal fruit trees.
- **How:**
  - Pick one fruit tree to carry plums (a recolour of the fruit).
  - Add a 5-dot wasp particle loop, using the same gating as the fireflies. Under reduced motion
    there are no wasps; the fallen plums stay as the cue.
- **Phone cost:** none.
- **Effort:** S.

**M4. Dress the story race (ch5 `c5-circuit`).**
- **Renderer:** both.
- **Serves:** "The valley road climbs to the race; the rails are cold", and the grey runners in a
  row.
- **Reference:** *Scarlet/Violet*: stadium bunting.
- **How:**
  - The race scene gets a `storyRace` look: frosted rails (a tint), Corvin's grey runners in
    numbered bibs (the H15 atlas), and spectators in the stands, drawn as NPC Keeper billboards.
  - Read-only from the race state.
- **Phone cost:** low.
- **Effort:** M.

**M5. Fireflies on the walk back, and a pale drifting seed.**
- **Renderer:** both.
- **Serves:** `c8-nova` (fireflies on the walk back) and `c10-moss-light` (a pale seed drifting
  down).
- **Reference:** *Tears of the Kingdom*: a single motes-of-light moment.
- **How:**
  - Add `stage.fx: ['fireflies', 'seed']`. The fireflies reuse `GroveWeather`.
  - The seed is one soft glow card on a slow spline. Under reduced motion it is a still card at
    the end point, with no fall.
  - Gentle and non-funereal, as the canon asks.
- **Phone cost:** none.
- **Effort:** S.

**M6. Moss sits.**
- **Renderer:** both.
- **Serves:** `c4-open` ("how he sits: carefully"), `c7` (Moss walks down) and `c11-moss-*`.
- **Reference:** *Palworld*: per-creature idle poses.
- **How:**
  - Add `stage.cast[{who:'moss', pose:'sit'}]`.
  - **3D:** the species `sleep` pose without closed lids, or a new `sit` pose in `species.ts`.
  - **Pixel:** use the sprite's `sleep` frame with its eyes open.
- **Phone cost:** none.
- **Effort:** S.

**M7. The keepsake shelf in the cottage.**
- **Renderer:** both.
- **Serves:** the keepsakes across the side stories:
  - the tale pages, pearl egg and fossil seed;
  - Dusty's trowel, the letter and the knitted toy;
  - the marmalade, the rock and the rest.
- **Reference:** *Animal Crossing: New Horizons*: displayed furniture reads at a glance.
- **How:**
  - A shelf prop on the cottage wall, inside a window, or as a bench outside.
  - Each keepsake id maps to a small mesh or sprite in an `KEEPSAKE_LOOKS` table, and appears
    once earned (it reads `inventory.keepsakes`).
  - The journal's Memories uses the same icons.
- **Phone cost:** one draw call (merged).
- **Effort:** M.

**M8. Window and lantern glow with emissive and bloom instead of point lights.**
- **Renderer:** 3D.
- **Serves:** every night scene (ch3, ch4, ch10, The Beetle Road).
- **Reference:** *Palworld*: warm windows on a cold field.
- **How:**
  - Extend `buildSpills`: give every lit window an emissive pane above the bloom threshold, plus
    an additive ground-spill decal (they already exist).
  - Keep the `LampPool` for the nearest four only.
  - Bloom is already in the pipeline at night.
- **Phone cost:** low.
- **Effort:** S.

**M9. Shore and jetty for The Hundred Days' "The Shore".**
- **Renderer:** both.
- **Serves:** The Hundred Days ch4: grey sand and a broken jetty.
- **Reference:** *Legends: Arceus*: a coastal camp.
- **How:**
  - A sand tint on the pond's shore band, using the existing `shore` painter.
  - A jetty of kit planks with two missing boards that are mended in a later chapter.
- **Phone cost:** one draw call.
- **Effort:** S.

**M10. The Mill: a stopped wheel that later turns.**
- **Renderer:** both.
- **Serves:** The Hundred Days: "The Mill" (a stopped wheel) and "The Hundredth Day" (the wheel
  turning).
- **Reference:** *Tears of the Kingdom*: landmark state change.
- **How:**
  - Put a water wheel on the existing windmill or on the stream by the bridge.
  - The rotation speed comes from a flag. Under reduced motion it turns very slowly, or the cue
    is the water flowing over it.
- **Phone cost:** one draw call.
- **Effort:** S.

**M11. The Hush: lamps going out in a ring.**
- **Renderer:** both.
- **Serves:** The Hundred Days: "The Hush" (a Shadow colossus that puts out lamps).
- **Reference:** *Palworld*: base lights as safety.
- **How:**
  - The H3 light states, driven outward from a point.
  - The colossus is a large, soft grey silhouette card at the edge of the fog. It is a fog-shaped
    mass, not a monster, and has no death imagery.
- **Phone cost:** none.
- **Effort:** S.

**M12. Shrine lamp and bell for Dawn & Dusk.**
- **Renderer:** both.
- **Serves:** Dawn & Dusk: the shrine lamp and cracked scanner lens (dawn), and the old bell with
  its new rope (dusk).
- **Reference:**
  - *Teal Mask*: Mossui shrine dressing.
  - *Scarlet/Violet*: Tera crystals as glowing accents.
- **How:**
  - A small kit shrine (a stone base, a roof cap and an emissive lamp) and a bell frame with a
    rope.
  - The lamp glows once lit; the bell's new rope is a lighter, thicker mesh.
- **Phone cost:** two draw calls.
- **Effort:** S.

**M13. Dawn & Dusk: a dawn half and a dusk half.**
- **Renderer:** both.
- **Serves:** Dawn & Dusk ("First Light" or "Last Light", depending on the half).
- **Reference:** *Teal Mask*: a fixed festival grade.
- **How:** while in `dawndusk` mode, pin the hour to 6:30 or 19:00 (C2) according to the
  storyline's half. The two halves then look different at a glance; the crest shapes (C7) carry
  the same cue.
- **Phone cost:** none.
- **Effort:** S.

**M14. The Beetle Road's Hollow Below torches.**
- **Renderer:** both.
- **Serves:** The Beetle Road ch3: "with torches someone keeps lit and nobody admits to".
- **Reference:** *Palworld*: wall torches.
- **How:**
  - This is a dungeon dressing flag only (the dungeon art itself is covered elsewhere):
    `dungeon.torches = true`.
  - Wall-torch sprites or cards with an emissive head. The flame flicker is off under reduced
    motion.
- **Phone cost:** none (the light pool is reused).
- **Effort:** S.

**M15. The Sun and Moon Grove grades shouldn't flatten the ground.**
- **Renderer:** 3D.
- **Serves:** Logged In, and Hazel's Grove whenever a Sun or Moon Grove scene plays.
- **Reference:** *Legends: Arceus*: a palette shift that keeps the value contrast.
- **How:** in the grove-kind recolour, apply the tint in a hue-shift that preserves luminance
  rather than as a multiply, and lower it on the terrain.
- **Phone cost:** none.
- **Effort:** S.

**M16. A distant skyline ring for the Grove.**
- **Renderer:** 3D.
- **Serves:** every wide or establishing shot. The 3D shots show a black or empty edge beyond the
  windmill.
- **Reference:** *Tears of the Kingdom*: landmark silhouettes.
- **How:**
  - A cylinder of painted hill and treeline cards at fog distance, in 2–3 layers.
  - Night swaps in a darker layer with a few window points.
- **Phone cost:** 1–2 draw calls.
- **Effort:** S.

**M17. Make the cottage's door step and porch the default story mark.**
- **Renderer:** both.
- **Serves:** `c3-open` (sitting on the step with cold tea), `c9-close` (Fern's pie on the step),
  and other step scenes.
- **Reference:** *Scarlet/Violet*: framing on NPCs.
- **How:**
  - Add a named mark `step` in the stage marks table (see below).
  - Add a porch light emissive.
  - Put a pie or a teacup prop there through `stage.props`.
- **Phone cost:** none.
- **Effort:** S.

### Nice-to-have

**N1. Corvin's chair by his door, and Hazel's bench on the hill.**
- **Renderer:** both.
- **Serves:** ch9, ch11, and S9 (`s9-chair`).
- **Reference:** *Animal Crossing: New Horizons*: furniture.
- **How:** place the H10 props on story marks.
- **Phone cost:** none.
- **Effort:** S.

**N2. Breath puffs in the frost.**
- **Renderer:** 3D.
- **Serves:** ch9–11.
- **Reference:** *Tears of the Kingdom*: cold-region breath.
- **How:** a small soft puff card every 3 s at each framed head. It is off under reduced motion.
- **Phone cost:** none.
- **Effort:** S.

**N3. Footprints in frost and snow.**
- **Renderer:** 3D.
- **Serves:** ch9 and ch10.
- **Reference:** *Animal Crossing: New Horizons*: footprints in snow.
- **How:** an instanced decal trail behind the Keeper, capped at 30 prints.
- **Phone cost:** one draw call.
- **Effort:** S.

**N4. A message board prop for Logged In and the request board.**
- **Renderer:** both.
- **Serves:** Logged In's message board, and the Grove's Requests.
- **Reference:** *Legends: Arceus*: Laventon's request board.
- **How:** a kit board with pinned paper cards. Each card is shown when a post exists.
- **Phone cost:** none.
- **Effort:** S.

**N5. Picnic set in the meadow.**
- **Renderer:** both.
- **Serves:** The Hundred Days' "Meadow Days".
- **Reference:** *Scarlet/Violet*: picnic set.
- **How:** reuse the H13 cloth and a basket.
- **Phone cost:** none.
- **Effort:** S.

**N6. Bunting colours that track the ending.**
- **Renderer:** both.
- **Serves:** the ch12 endings.
- **Reference:** *Animal Crossing: New Horizons*: seasonal decoration.
- **How:**
  - The ending picks the bunting's pattern and shape: stars, leaves or moons. The shape carries
    the cue, so colour isn't the only signal.
- **Phone cost:** none.
- **Effort:** S.

**N7. The Hundred Days' day counter carved into a post.**
- **Renderer:** both.
- **Serves:** The Hundred Days.
- **Reference:** *Legends: Z-A*: numbered markers.
- **How:** tally marks on the gate post (C4), drawn from the day count as a decal.
- **Phone cost:** none.
- **Effort:** S.

## Staging data the content would need

These are optional fields on `Scene` (`src/config/story.ts`), with a per-storyline-chapter
default. The sim never reads them; both renderers read them only for drawing. A missing field
means "do as today".

```ts
interface SceneStage {
  /** Where: a named mark set, so scripts never carry coordinates. */
  place?: 'grove' | 'hollow' | 'corvin' | 'hill' | 'gate' | 'step' | 'pond' | 'falls' | 'ledge'
        | 'fold' | 'green' | 'guardhouse' | 'rootNode';
  /** Hour 0–24 to draw at (C2); else hourOf(narration); else the clock. */
  hour?: number;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';            // H1
  weather?: 'clear' | 'rain' | 'snow' | 'frost' | 'wind';        // H2
  /** Who stands where, facing whom, doing what (C5, M6, H4). */
  cast?: Array<{ who: string; mark: string; face?: string; pose?: 'stand' | 'sit' | 'kneel' | 'walk';
                 carry?: 'lantern' | 'bucket' | 'bag' | 'pie' }>;
  /** Camera (H8, H14). `focus` defaults to the speakers. */
  shot?: { kind: 'establish' | 'wide' | 'two' | 'close' | 'over'; focus?: string[]; yaw?: number };
  /** Props to show or set (story props, the gate, the shelf, bowls…). */
  props?: Record<string, 'show' | 'hide' | 'open' | 'shut' | 'lit' | 'out'>;
  /** Named lights (H3): lantern-1..4, windows, the porch. */
  lights?: Record<string, 'lit' | 'out' | 'flicker'>;
  /** Held effects (H6, M5): no pulsing; each has a still form under reduced motion. */
  fx?: Array<'fallsStill' | 'stoneGlow' | 'goldWater' | 'fireflies' | 'seed' | 'breath'>;
  /** Campaign look override (H18), e.g. ch9–11 grey-blue. */
  grade?: string;
  /** How to arrive: cut (default) or a short fade. */
  transition?: 'cut' | 'fade';
}
```

**Marks.** Put the marks in one table per place in `config/`, as `{ x, z, yaw }` beside the
`GROVE` numbers. The minimum set is:

- gate, gate-outside, signpost;
- step, porch, window;
- pond-lantern, stream-lantern, wall-lantern, grass-lantern;
- hill-path, flat-stone, hill-top, briar;
- falls-foot, ledge;
- Hollow: hollow-camp, hollow-stone;
- Corvin's garden: corvin-gate, corvin-door, pen-1..3;
- The Hundred Days: fold-square, mill, shore-jetty;
- Dawn & Dusk: green-centre, house-1..4, shrine, bell;
- The Beetle Road: guardhouse, cart;
- Logged In: lobby, board, root-chair.

**Where to author it first:** the scenes the shots showed going wrong.

- `c1-letter` (gate, signpost; late spring)
- `c2-corvin` (gate; 17:00)
- `c3-open` (step; night)
- `c4-open` (flat-stone; Moss sits)
- `c4-close` (four lanterns lit, grass flicker; dusk)
- `c6-open` (hill; rain)
- `c7-open` (frost)
- `c8-open` (gate; first light; autumn)
- `c8-close` (hollow-camp)
- `c9-open` (corvin; frost; winter)
- `c10-open` and `c10-vigil` (night; waves)
- `c10-falls`, `c10-ledge`, `c10-safe-*`, `c10-dawn` (fx)
- `c11-gate`
- `c12-open` (festival; morning)
- `c12-walk-*` (hill-path; lantern; dusk)
- each storyline chapter's opening

## Sources

- Pokémon Legends: Arceus, Galaxy Hall and Jubilife Village: https://bulbapedia.bulbagarden.net/wiki/Galaxy_Hall
- Galaxy Team (Laventon's request board): https://bulbapedia.bulbagarden.net/wiki/Galaxy_Team
- The Teal Mask, Mossui Town: https://bulbapedia.bulbagarden.net/wiki/Mossui_Town
- Kitakami Hall, the Festival of Masks venue with food stalls: https://SEREBII.NET/pokearth/kitakami/kitakamihall.shtml
- Festival disambiguation (Festival of Masks): https://bulbapedia.bulbagarden.net/wiki/Festival
- Pokémon Legends: Z-A wild zones (holographic fences, numbered gates): https://pokejungle.net/pokemon-legends-z-a/wild-zones/
- Pokémon Legends: Z-A wild zones (Serebii): https://serebii.net/legendsz-a/wildzones.shtml
- Wild zone (Bulbapedia): https://bulbapedia.bulbagarden.net/wiki/Wild_zone
- Pokémon Scarlet/Violet picnics and Tera crystals: https://rpgamer.com/2022/10/pokemon-scarlet-violet-show-further-terastallization-picnics-more/
- Pokémon Scarlet/Violet Tera Raid and crystals: https://www.nintendo.com/au/news-and-articles/new-details-revealed-for-pokemon-scarlet-and-pokemon-violet-including-tera/
- Palworld building and structures: https://palworld.wiki.gg/wiki/Building
- Palworld Wall Torch: https://palworld.wiki.gg/wiki/Wall_Torch
- Palworld Lamp: https://palworld.wiki.gg/wiki/Lamp
- Animal Crossing: New Horizons seasonal decoration: https://play.nintendo.com/news-tips/tips-tricks/island-holiday-decoration-tips-animal-crossing/
- Animal Crossing: New Horizons winter items: https://animalcrossingworld.com/2022/12/9-new-winter-christmas-features-to-experience-in-december-for-animal-crossing-new-horizons

The Tears of the Kingdom references (item glints, landmark silhouettes, breath in the cold) and
the Scarlet/Violet cutscene framing come from general knowledge of those games. My searches found
no page that documents them, so treat those as descriptions rather than cited facts.
