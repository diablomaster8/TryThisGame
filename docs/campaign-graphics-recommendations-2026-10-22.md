# Campaign graphics recommendations (2026-10-22)

The second graphics review of the campaigns. It is a report only: no game code changed. It covers Hazel's
Grove (12 chapters) and the four separate campaigns (The Hundred Days, Logged In, The Beetle Road,
Dawn & Dusk), in both renderers. The Hollow dungeon is left out.

**This review starts from origin/main at 8be70bf**, after the first review
(`campaign-graphics-recommendations-2026-10-21.md`, items 1–50) was built. Several gaps listed in
the brief for this review are already closed there:

- **Staging data:** scenes now carry `Scene.stage` (`SceneStage` in `config/story.ts`). 159 scenes are
  staged in `config/scene-stages*.ts`, and the marks are in `config/stage-marks.ts`.
- **Pixel staging:** the pixel renderer now stages the hour and pans to the scene.
- **The gate:** a gate model exists in both renderers.
- **Occlusion:** the 3D renderer fades buildings and tree crowns that sit on a sight line to a framed subject.

So this review looks at what the screen shows now, and does not re-propose that work.

**Method:** headless Edge (playwright-core, `--use-angle=d3d11`, 1280×720) on the live site
`?debug`. Each scene was reached with the debug panel's chapter jumps, in both renderers:

- **Hazel's Grove:** chapters 1, 4, 9, 10, 11 and 12.
- **The Hundred Days:** chapters 1 and 9.
- **Logged In:** chapters 4 and 7.
- **The Beetle Road:** chapters 1 and 3.
- **Dawn & Dusk:** chapters 1 and 6, Dawn half.

That makes 64 frames. They are in the session scratchpad and are not committed.

**One caution about the method:** the debug jump skips the location moves that chapters make on the way. A 9 → 11 jump stays in Corvin's garden, so those
frames were re-shot by way of chapter 10 (see H1).

## Where it stands

**Pixel (default).**

- **Hazel's Grove reads well.** Corvin's garden has its frost, the numbered pens and the grey gate. Chapter 11 frames Hazel at the gate. Chapter 12 has bunting and a picnic, and nights have warm lamp halos.
- **Where the text and the picture disagree:**
  - **Chapter 4:** "the grey shape" on the hill is a bright green Nubbin.
  - **Chapter 10:** "a skin of ice on the water" plays over open, rippling water.
  - **Winter trees:** the snow caps still read as pale clouds hovering over the trees.
- **The separate campaigns are where pixel falls apart.**
  - **All four play on the unchanged Grove map,** with Hazel's cottage, the dojo and the bathhouse.
  - **Their people never appear,** and Dawn & Dusk's Marigold talks with the player's own Gardener portrait.
  - **Logged In's "white room"** is a white blob in the middle of a sunny meadow.
  - **The Beetle Road's "Hollow Below"** is the Grove with the lights down.

**Full 3D.**

- **What works:** Hazel's Grove is clearly staged now. Moss sits on the flat stone, there is a festival
  picnic, the night grade has a story key, and Corvin's frost garden is atmospheric. It held 56–60 fps on this desktop GPU in every scene.
- **The gate model has become a liability.** At `c11-open` it reads as a broken lean-to, and the
  occluder dithers half of it away, even though it is the framed subject.
- **Wide shots leave the cast tiny,** and big foreground lamp posts crowd the frame corners.
- **The separate campaigns have the same gaps as in pixel:**
  - The places are not built: there is no Root Node room, no dungeon floor and no guard house in frame.
  - None of their people appear.
  - Logged In's "Night Grove" renders as a bright afternoon.
  - The Dawn grade turns every path brick red.

**The common root:** the separate campaigns got only openings and closings staged, with no `cast` at all. Their places are mostly
aliases for the Grove (`stage-marks`, `scene-stages-{hundred,logged,beetle,dawndusk}.ts`).

## Recommendations

**How to read each item:**

- **What**, then **Renderer** and **Serves** (which campaign or chapter).
- **Ref:** the reference game and the thing to borrow.
- **How:** the file and technique.
- **Phone cost**, then **Effort**: S is under a day, M is 1–3 days, L is more.

### Critical: scenes that are unreadable or contradict their text

**C1. Put the separate campaigns' people on screen.**

- **Renderer:** both.
- **Serves:** all four separate campaigns.
- **The problem:** Ida and Sorrel (Hundred Days), Hob and Vane (Beetle Road), Marigold, Ash and Vask (Dawn & Dusk), and Warden, Juno and Root (Logged In) speak but never appear. `storyline-rules-*.ts` never calls `spawnNpc`, and no `scene-stages-*` entry has a `cast`.
- **Ref:** Scarlet/Violet cutscenes, where the speaking NPC is always physically in the shot.
- **How:**
  - **Stage actors are render-only:** both renderers draw any `stage.cast` entry whose `who` is a storyline speaker. Pixel uses a keeper-style sheet (`sheets.keeper`). 3D uses the keeper `SpeciesSpec` with look overrides, through the `actors.ts` pool.
  - **The sim stays untouched,** so the save format doesn't change.
  - **Content:** cast entries on every storyline scene (see C2 for the looks).
- **Phone cost:** low. Pixel adds 1–3 sprites per scene. 3D adds 1–3 pooled figures, which are already cached by the sculpt farm.
- **Effort:** M.

**C2. Give every story speaker their own look and portrait.**

- **Renderer:** both. The portrait is the shared DOM dialogue box.
- **Serves:** the separate campaigns. Also Fern in Hazel's Grove, whose look matches the player's when the player picks Gardener.
- **The problem:** `portraitFrame` (`ui/dialogue.ts:456`) falls back to `sheets.keeper(who)`. For an unknown id, `trainerLook` returns the default Gardener, so Marigold Penhallow speaks with the player's own outfit.
- **Ref:** Legends: Arceus, where every Jubilife villager has a distinct outfit silhouette.
- **How:**
  - **Looks:** add `STORY_NPC_LOOKS` next to `NPC_LOOKS` in `config/npc-looks.ts`. Each entry has hair, hat, coat, accessory and palette. `trainerLook` and `npcLookOf` read it.
  - **A check:** `content-check.ts` fails any speaker with no look.
  - **Telling them apart:** each look also carries a distinct accessory shape (Vane's notebook, Hob's apron, Ida's broom, the Warden's visor), so a portrait never depends on colour alone.
- **Phone cost:** none. The portraits are cached sheets.
- **Effort:** S.

**C3. Build the Root Node's white room.**

- **Renderer:** both.
- **Serves:** Logged In, ch7 ("a white room with one chair").
- **The problem:** `place: 'rootNode'` has no handler in either renderer. The meadow, the cottage and the pond stay in view, with a white ellipse on the grass.
- **Ref:** the Scarlet/Violet Area Zero "white void" transitions; the Legends: Arceus photo studio's plain backdrop.
- **How:** a new "void set" flag, `stage.exclusive: true`.
  - **3D:** hide the Grove root group (`grove-3d-scene.ts`), set the scene fog and background to near-white, and show an unlit white floor disc, one kit chair (`prop-kit.ts`) and a faint soft contact shadow.
  - **Pixel:** fill the low-res target white and draw only the chair, the Keeper and the partner, plus a 1 px horizon line so the floor reads as a room.
- **Phone cost:** it saves frame time, because the Grove isn't drawn.
- **Effort:** M.

**C4. Play the Beetle Road's "Hollow Below" scenes underground.**

- **Renderer:** both.
- **Serves:** the Beetle Road, chapters 3, 4, 6, 7 and 8.
- **The problem:** the scenes are staged `place: 'guardhouse'` with the `beetle-below` grade. The frame shows the Grove (cottage, pond, terraces) at night, while the text says "the second floor down: wider, wetter, with torches".
- **Ref:** the Palworld dungeon entrances and their torch-lit interiors.
- **How:**
  - **Preferred:** make `storyline-rules-beetle.ts` call `setLocation(world, 'dungeon', …)` with a fixed story seed and depth per domain. The first review deferred this, but the Hollow renderers already draw floors.
  - **Cheaper fallback:** add a `below` set. 3D hides the Grove group and stands a cave shell from `hollow-dress-kit` around the guard-house marks. Pixel masks the screen to a torch-lit oval and swaps the ground to the dungeon floor texture (`render/paint/dungeon.ts`).
  - **Weather:** add the rain in `weather: 'rain'` scenes as drips, not sky rain.
- **Phone cost:** the same as the Hollow, which is already measured.
- **Effort:** M for the sim location, L for the set.

**C5. Make Logged In's Night Grove a night.**

- **Renderer:** 3D for the grade, pixel for the windows.
- **Serves:** Logged In, ch4–5.
- **The problem:**
  - **In 3D,** `l-c4-open` (hour 23, lanterns out) renders as a bright green afternoon. The grade or hour is lost. The HUD shows "Sun Grove" active, so the Sun Grove tint is the suspect.
  - **In pixel,** the night is right, but the cottage windows glow warm while the text says "the lights off".
- **Ref:** Palworld's strong day/night colour grade.
- **How:**
  - **3D:** check that `stage.hour` reaches `sky.ts` when a storyline's Sun/Moon Grove tint is on. The tint must multiply the night grade, never replace it. `dress-a.ts`'s luminance-keeping tint is the likely spot.
  - **Both:** add `windows` to `stage.lights`, so `lights: { windows: 'out' }` dims the window emissive in 3D and the window lamp sprites in pixel.
- **Phone cost:** none.
- **Effort:** S.

**C6. Draw Moss grey while he is "the grey shape".**

- **Renderer:** both.
- **Serves:** Hazel's Grove, ch3–4 (`c4-*`: "The grey shape has come down from the top of the hill").
- **The problem:** Moss is an Eternal Neutral, and that look is bright green in both renderers.
- **Ref:** Tears of the Kingdom's weathered, desaturated statues, which come back to colour when woken.
- **How:**
  - **The data:** add `cast[].tint: 'weathered'`. Or, simpler, the renderer greys Moss while `campaign.flags.mossDown !== true`.
  - **3D:** add a uniform on the creature material that lerps the albedo towards a moss-grey (keeping its luminance) and adds a stone speckle.
  - **Pixel:** palette-swap the sheet through a grey ramp; `sheets.forNubbin` takes a variant key.
  - **When it ends:** the colour comes back in one step when he comes down (no pulse under reduced motion).
- **Phone cost:** none. It is one more cached sheet and a uniform.
- **Effort:** S.

**C7. Freeze the pond in chapter 10.**

- **Renderer:** both.
- **Serves:** Hazel's Grove, ch10 ("a skin of ice on the water, thin as a page").
- **The problem:** neither renderer has pond ice. Both show open, rippling water.
- **Ref:** Animal Crossing's winter (frozen edges, a pale sheen); Legends: Arceus's Alabaster Icelands water.
- **How:**
  - **The data:** add `props.pondIce: 'show'`.
  - **3D:** a flat opaque ice disc just above the water plane (a pale blue-white, a baked crack normal map, a low roughness glint). Hide the ripple shader, and keep the shoreline foam as a rime ring.
  - **Pixel:** the ground worker repaints the pond tiles with an ice painter in `paint/terrain.ts` (pale fill, white crack lines, the same shoreline). Add a static texture variant, not a per-frame effect.
  - **Content:** stage `c10-*` scenes from the frost line onward.
- **Phone cost:** 3D adds 1 draw and removes the water's transmission pass, so it is cheaper. Pixel needs one extra ground repaint (about 0.8 s, behind the placeholder).
- **Effort:** M.

**C8. Make the Hush visible when the text says it comes.**

- **Renderer:** both.
- **Serves:** The Hundred Days, ch9 ("a shape made of every quiet the valley kept").
- **The problem:**
  - **In pixel,** the colossus shows as a pale blue blotch sitting on the mill wheel's hub, unreadable.
  - **In 3D,** it stands at `HUSH.origin` (0,−22), outside the shot, and the camera frames the Keeper.
  - **In both,** the lamps are still lit at the line "where it walks, lamps go out".
- **Ref:** Tears of the Kingdom's landmark silhouettes (a big shape read against fog at a distance).
- **How:**
  - **Framing:** add a `hush` mark and put it in `shot.focus` for `h-c9-open` and `h-c9-mountain`.
  - **Pixel:** draw the colossus as a tall, soft-edged grey silhouette on the far layer, behind buildings, so it never overlaps the wheel. Use a dithered top edge and no outline.
  - **3D:** keep the grey card, sized against the treeline, and add a fog-coloured rim.
  - **Timing:** start the lantern "out" ring when the line shows, not from the scene's start.
  - **The 3D lamp bug:** fix the known bug where "out" lanterns keep their lamp-pool light (PROGRESS.md); otherwise the lamps can't visibly go out.
- **Phone cost:** none to low.
- **Effort:** S–M.

**C9. Give the 3D gate a readable shape, and never fade the subject.**

- **Renderer:** 3D.
- **Serves:** Hazel's Grove `c2-*` (Corvin's first visit), `c11-open` and `c11-gate`; The Hundred Days ch1 ("the gate with no fence").
- **The problem:** the current gate reads as one post with a tilted roof plane. The sight-line occluder dithers its other half and the roof into a mesh-shaped ghost.
- **Ref:** the Teal Mask's torii-style gate at Mossui Town (a symmetric, chunky, instantly read silhouette); Palworld's bevelled wooden structures.
- **How:**
  - **Rebuild the gate** in `dress-b.ts` as a symmetric lychgate: two bevelled posts (`bevelBox`), a tie beam, a small pitched roof and two leaves. Keep the shut, open and overgrown states.
  - **Exclude from the fade** (`dress-a.ts` occluder) any mesh tagged with a place or prop named in the stage's focus or place.
- **Phone cost:** none. Merge it into 2 draws.
- **Effort:** M.

### High

**H1. Make the debug chapter jump arrive in the right place, and warn when a stage cannot be honoured.**

- **Renderer:** both (it is a tool).
- **Serves:** all campaigns and every future screenshot pass.
- **The problem:** `debugChapter` only calls `beginChapter` for the target chapter. A jump from 9 to 11 skips ch10's `setLocation('grove')`, so ch11's homecoming and ch12's festival play in Corvin's frozen garden.
- **Ref:** none; it is tooling.
- **How:**
  - **`sim/campaign.ts`:** give each chapter a `homeLocation`, and have the debug jump `setLocation` to it before `beginChapter`. Do the same in `applyStorylineCommand`.
  - **`render/scene-stage.ts`:** in dev builds, log when the location that `stage.place` belongs to differs from `world.location`.
- **Phone cost:** none.
- **Effort:** S.

**H2. Stage the separate campaigns' beats and extra scenes, not only openings and closings.**

- **Renderer:** both.
- **Serves:** all four separate campaigns.
- **The problem:**
  - **Coverage:** each `scene-stages-*` file stages two scenes per chapter. The four scripts hold 63, 48, 48 and about 30 scene ids (Hundred, Logged, Beetle, Dawn & Dusk).
  - **The Beetle Road's c1** opens on "The guard house is a shed with ambitions" with the guard house out of frame in both renderers.
- **Ref:** Scarlet/Violet's cutscene framing, where every beat chooses its subject.
- **How:**
  - **Content:** add `place`, `hour`, `shot.kind` and `shot.focus` for every beat and extra scene, plus `cast` from C1.
  - **Fallback:** `resolveStage` can inherit place and hour from the chapter's opening so a missing beat is never "Keeper at the pond".
- **Phone cost:** none.
- **Effort:** M (content).

**H3. Give each separate campaign its own place, not the Grove with props.**

- **Renderer:** both.
- **Serves:** all four separate campaigns.
- **The problem:** every one shows Hazel's cottage, the Japanese-style dojo and bathhouse, the kindergarten gate and the terraces.
- **Ref:** Legends Z-A's Lumiose districts (each district has its own palette, street furniture and landmark) and its wild-zone markers.
- **How:** add a `set` per storyline that hides Grove-only buildings (the visibility masks in `village.ts`/`kit-buildings.ts` and `render/paint/buildings.ts`) and adds a small landmark kit for each campaign:
  - **The Fold:** ruined stone cottages that mend by chapter, the mill and a well square.
  - **Logged In:** a grid-lined ground decal, holo boards and the wireframe fence ring.
  - **The Beetle Road:** the road with ruts and milestones, the guard house and banner poles.
  - **Dawn & Dusk:** the four crest houses round a green, with a sundial at the centre.
- **Phone cost:** neutral (some buildings swap for others). Keep each kit under 10 draws, merged or instanced.
- **Effort:** L.

**H4. Fit the establishing shot to its subjects, inside the HUD-safe area.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk c1/c3, The Hundred Days c1, the Beetle Road c1, and Hazel ch12.
- **The problem:**
  - **3D, Dawn & Dusk c1:** one crest house's blank side wall fills the top of the frame.
  - **Pixel:** the four houses sit under the HUD buttons (a known bug).
- **Ref:** Scarlet/Violet's town-arrival shots, which keep the whole plaza in frame with the UI cleared.
- **How:**
  - **The math:** for `establish` and `wide`, compute the bounds of all `focus` marks and solve the distance and pan so the bounds sit inside the canvas minus the HUD bar and the dialogue box (read their DOM rects). 3D does this in its shot code next to `staging.ts`; pixel in `scene-stage.ts`'s pan.
  - **Fade the in-between:** any wall between the camera and the bounds centre joins the occluder fade.
- **Phone cost:** none.
- **Effort:** M.

**H5. Push in after the establishing line.**

- **Renderer:** 3D, and pixel through its zoom levels.
- **Serves:** Hazel ch10 (`c10-open`, where the Keeper is about 20 px tall), and every `establish` scene.
- **The problem:** wide shots hold for the whole scene, so faces and props are unreadable on a phone.
- **Ref:** Scarlet/Violet cutscenes, which open wide and cut to a two-shot on the first spoken line.
- **How:**
  - **The data:** add `shot.then?: ShotKind`, defaulting to `two` for `establish`.
  - **3D:** ease the camera over 0.8 s on the first line advance. Under reduced motion it is a cut.
  - **Pixel:** step to the closer zoom level.
- **Phone cost:** none.
- **Effort:** S.

**H6. Show who is talking, in the world.**

- **Renderer:** both.
- **Serves:** every campaign, and crowded scenes most of all (Hazel ch1 and ch12).
- **The problem:** in Hazel ch1, Fern talks while six villagers mill about. It is hard to tell which figure is speaking.
- **Ref:** Palworld's and Scarlet/Violet's speaker markers above the head; Animal Crossing's speech bob.
- **How:**
  - **The pip:** a small downward chevron in the speaker's name colour above the speaking actor, plus the shape itself, so colour isn't the only signal. 3D draws it as a sprite on the actor; pixel as a 5×4 sprite.
  - **Motion:** a 2 px bob that is still under reduced motion.
- **Phone cost:** negligible.
- **Effort:** S.

**H7. Put the Keeper on a mark and turn speakers to the camera.**

- **Renderer:** 3D mostly.
- **Serves:** Hazel `c11-open` (Hazel faces away; the Keeper isn't in frame) and every `two` shot.
- **The problem:** `face: 'you'` aims at the Keeper wherever they happen to be, often behind the camera.
- **Ref:** Scarlet/Violet's over-the-shoulder two-shots.
- **How:**
  - **The Keeper's mark:** add `you` to `cast` by default (the place's `keeper` mark), and put the Keeper there for the scene (render-only; the sim position comes back after).
  - **The two-shot camera:** frame it from the side, so both faces show three-quarter.
- **Phone cost:** none.
- **Effort:** S–M.

**H8. Make winter read in the Grove.**

- **Renderer:** both.
- **Serves:** Hazel ch9–12, The Hundred Days ch9–10 and Dawn & Dusk (late chapters).
- **The problem:**
  - **Pixel:** the snow caps are pale dithered ellipses that look like clouds, and the Grove ground stays lush green in "the longest night".
  - **3D:** at `c11-open` (winter) the grass stands knee-high and summer-thick.
- **Ref:** Animal Crossing's seasonal ground and snow-laden trees; Legends: Arceus's painterly snow palette.
- **How:**
  - **Pixel trees:** paint a snow-crown overlay per tree sprite in `paint/scenery.ts`. The white follows the canopy's top edge, with a 1 px blue shade.
  - **Pixel ground:** pass `season` to `ground.worker.ts`, which desaturates the grass and adds frost speckle.
  - **3D:** scale the grass field's blade height by season (a uniform in `grass-field.ts`, ×0.35 in winter) and tint it towards frost. Corvin's `frostify` can be reused on the meadow.
- **Phone cost:** cheaper in 3D (shorter grass means less overdraw). Pixel needs one ground repaint per season change.
- **Effort:** M.

**H9. Gather the festival crowd and keep the bunting out of the camera.**

- **Renderer:** both.
- **Serves:** Hazel ch12 ("Every Keeper is here, and every Nubbin").
- **The problem:** a handful of NPCs are scattered across the Grove, and the bunting lines in 3D cut diagonally through the frame from a foreground lamp.
- **Ref:** the Teal Mask's Festival of Masks (stalls, paper lanterns and a crowd around a focal space) at dusk.
- **How:**
  - **The crowd:** add a `festival` mark ring round the picnic with every Hazel Keeper in `cast`, and Nubbins on the near half (use the crowd module, `crowd.ts`).
  - **The bunting:** in 3D, anchor it at least 3 units from the camera path, or fade lines within 4 units of the camera.
  - **Pixel:** pan to fit the ring (H4).
- **Phone cost:** 3D has about 12 pooled figures, so measure it at 4× throttle. Pixel's cost is low.
- **Effort:** M.

**H10. Fix the dithered rectangles on the 3D ground.**

- **Renderer:** 3D.
- **Serves:** every 3D story scene.
- **The problem:** in Hazel ch1 a dark dithered square lies on the path. At `c11-open`, a green dithered slab stands beside the gate. These are flat meshes (crown shadows or roof planes) caught by the occluder dither and drawn as screen-door rectangles.
- **Ref:** none; it is a fix.
- **How:** the occluder fade in `dress-a.ts` should skip ground-hugging meshes and shadow-only proxies, and use the same screen-circle dither mask that `crowns.ts` already uses (`HOLE`), so the fade is a soft round hole rather than the mesh's own rectangle.
- **Phone cost:** none.
- **Effort:** S.

**H11. Calm the Dawn grade.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk, the Dawn half.
- **The problem:** at hour 6.5, paths and soil turn brick-red, and in pixel the tilled plot reads as lava.
- **Ref:** the Teal Mask's dusk festival grade: warm highlights, cool shadows, and ground hues held.
- **How:**
  - **The grade:** split-tone instead of multiply in the `CAMPAIGN_LOOK` grade (and pixel `post.ts`). Warm the key and sky, cool the shadows, and clamp the shift in ground hue (about 12° at most).
  - **The direction cue:** long shadows from the east are a better "dawn" cue than red ground.
- **Phone cost:** none.
- **Effort:** S.

**H12. Fade pixel buildings that hide the cast.**

- **Renderer:** pixel.
- **Serves:** every campaign. In Hazel ch4 the Keeper and Fern sit half under the cottage roof.
- **The problem:** only 3D has the sight-line fade.
- **Ref:** Animal Crossing's and Legends: Arceus's see-through rooflines when the player walks behind.
- **How:**
  - **The test:** in `world-view.ts`, test each building sprite's screen rect against the screen rects of cast and speakers. If it covers one, draw that sprite with a checkerboard dither inside a circle round the subject.
  - **Under reduced motion,** it is a straight swap.
- **Phone cost:** negligible (rect tests over fewer than 20 buildings).
- **Effort:** S–M.

**H13. Make 3D "out" lanterns go dark.**

- **Renderer:** 3D.
- **Serves:** Hazel ch10 (the vigil), The Hundred Days ch9 (the Hush), and Logged In ch4–5.
- **The problem:** a known bug (PROGRESS.md). The host builds lamp-pool light and ground spill for every post regardless of state, so "lamps go out" never shows.
- **Ref:** Palworld's bases at night, where a lit and an unlit lamp read differently at a distance.
- **How:** `lamp-pool.ts` reads the same `lanternState` that `dress-e.ts` uses. An `out` post drops its pool, spill and emissive; a `flicker` post steps between two levels, held still under reduced motion.
- **Phone cost:** cheaper.
- **Effort:** S.

**H14. Clear foreground clutter from story shots.**

- **Renderer:** 3D.
- **Serves:** Hazel ch1 and ch12, The Hundred Days ch9, and Logged In ch4.
- **The problem:** lamp posts and huts within a few units of the camera cut into the frame corners at giant scale.
- **Ref:** Scarlet/Violet's cutscenes, which clear near props.
- **How:** during a staged scene, fade (screen-circle dither) any prop or building within 5 units of the camera that isn't a cast member or a focus mark. It is the same pass as the occluder.
- **Phone cost:** none.
- **Effort:** S.

### Medium

**M1. Give each of Hazel's Keepers a silhouette.**

- **Renderer:** both.
- **Serves:** Hazel ch1, ch7 and ch12, and every visit.
- **The problem:** only Corvin, Marina, Fern and Hazel have `NPC_LOOKS`. Sparks, Clover, Pixel, Luna, Ember, Byte, Dusty and Nova fall back to trainer looks that read alike at a distance (in 3D, several have the same blond spiky hair).
- **Ref:** Palworld's clear silhouettes at a distance; the Jubilife villagers.
- **How:** give each an accessory with its own outline (Sparks's goggles, Clover's basket, Pixel's headphones, Luna's long scarf, Ember's apron, Byte's cap, Dusty's wide hat, Nova's satchel), defined in `config/npc-looks.ts` and drawn by `npc-accessories.ts` and the pixel keeper layers.
- **Phone cost:** low.
- **Effort:** M.

**M2. Make the Fold's ruin read at a glance in 3D.**

- **Renderer:** 3D.
- **Serves:** The Hundred Days, ch1–10.
- **The problem:** at `h-c1-open` the 3D Fold houses look whole and freshly painted. The pixel version shows bare rafters.
- **Ref:** the half-built camps and repair states of Legends: Arceus.
- **How:** per-chapter mending states in `dress-b.ts`:
  - **Ch1–3:** roof holes as missing tile strips (open rafters), boarded windows and an instanced rubble pile per house.
  - **From ch4:** tiles return chapter by chapter, and a lit window appears in ch10.
- **Phone cost:** low, with instancing.
- **Effort:** M.

**M3. Give Logged In a digital set language.**

- **Renderer:** both.
- **Serves:** Logged In, ch1–8.
- **The problem:** the wireframe fence works. The rest is the Grove.
- **Ref:** Legends Z-A's wild-zone holographic fences and numbered gates.
- **How:** a faint grid ground decal (3D: one projected texture in the terrain shader behind a uniform; pixel: a 1 px grid painted into the ground when the set is on), holo-edged boards, pixel-sparkle egg glints, and a `l-door` prop (a plain freestanding door) for ch6.
- **Phone cost:** low.
- **Effort:** M.

**M4. Build the Beetle Road's guard house dressing.**

- **Renderer:** both.
- **Serves:** the Beetle Road, ch1–2 and 5.
- **The problem:** the three team banners and the beetle cart under its tarp are named in the text, but they aren't framed or readable.
- **Ref:** Palworld's crafted props with bevelled edges.
- **How:**
  - **The banners:** three cloth cards on poles, each with a crest shape (a sun disc, a crescent and a drop) as well as a colour.
  - **The cart:** a kit-built beetle cart (`prop-kit.ts`) with a tarp in `b-c2` and the tarp off in `b-c5`.
  - **Content:** `props: { banners: 'show', cart: 'shut' | 'open' }`.
- **Phone cost:** low.
- **Effort:** M.

**M5. Put the carved creatures over the Dawn & Dusk doors.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk, ch1 ("a flier, a runner, a swimmer, a thicket thing").
- **Ref:** Lumiose's district signage.
- **How:**
  - **3D:** a relief plaque per crest house: an extruded silhouette with a baked vertex AO.
  - **Pixel:** a 12×8 carved sign sprite.
  - **Readability:** the silhouettes have to read at the establishing distance (H4).
- **Phone cost:** none.
- **Effort:** S.

**M6. Tell the two halves of Dawn & Dusk apart by more than the hour.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk.
- **Ref:** Legends: Arceus's time-of-day colour shifts.
- **How:**
  - **Dawn:** dew sparkle on the grass (still under reduced motion), shutters opening, smoke rising from one chimney.
  - **Dusk:** lit windows, shutters closing, long shadows from the west, and fireflies at the green's edge (the existing `fireflies` fx).
  - **Content:** `props: { shutters: 'open' | 'shut' }`.
- **Phone cost:** low.
- **Effort:** M.

**M7. Put the mill wheel in the stream.**

- **Renderer:** pixel.
- **Serves:** The Hundred Days ch8–10, and the Grove.
- **The problem:** the wheel stands on the lawn, touching the water only at its foot.
- **Ref:** the waterwheel by the Kitakami rice paddies (Teal Mask).
- **How:** move the pixel wheel's anchor onto the stream bank with a wooden sluice sprite and a white foam strip under the paddles (static under reduced motion). Its painter is in `render/dress-b.ts`.
- **Phone cost:** none.
- **Effort:** S.

**M8. Feather the edge of Corvin's backdrop hill.**

- **Renderer:** pixel.
- **Serves:** Hazel ch9–10.
- **The problem:** the snowy backdrop hill on the left ends in a hard horizontal line in the middle of the field.
- **Ref:** none; it is a fix.
- **How:** extend the band to the screen edge, or fade its lower edge with a dithered gradient into the snow (the `render/dress-c.ts` backdrop painter).
- **Phone cost:** none.
- **Effort:** S.

**M9. Add a close-up cutaway for story items.**

- **Renderer:** both, as a DOM card.
- **Serves:** Hazel's letter (ch1), Hazel's notebook (ch8), the stone (ch10), Vane's notebook (Beetle Road) and the Root Node recording (Logged In).
- **The problem:** these are a few pixels in the world when the text is about them.
- **Ref:** Animal Crossing's item pop-up on pickup; Tears of the Kingdom's item glint and close view.
- **How:**
  - **The data:** add `stage.item: '<kit id>'`.
  - **The card:** a small card above the dialogue box shows the item. 3D renders it to a cached offscreen image from `prop-kit.ts`; pixel draws it at 3× from the props sheet.
  - **Motion:** it fades in over 0.2 s, and under reduced motion it simply appears.
- **Phone cost:** none in the frame loop.
- **Effort:** M.

**M10. Make morning feel cold and bright.**

- **Renderer:** both.
- **Serves:** Hazel ch12 opening ("Cold and very bright").
- **The problem:** it renders as a warm summer day.
- **Ref:** Legends: Arceus's snowlands key light.
- **How:**
  - **The data:** add a `crisp` grade (cool shadows, high-key whites, a slight bloom on the snow).
  - **The world:** winter ground (H8), and `fx: ['breath']` on the cast.
- **Phone cost:** none.
- **Effort:** S.

**M11. Let one shared lantern string cue every festival and ending.**

- **Renderer:** both.
- **Serves:** Hazel ch12, Hundred Days ch10 ("the Fold's lamps lit"), and the Logged In ending at first light.
- **Ref:** the Teal Mask's paper lanterns at Mossui Town.
- **How:**
  - **One prop:** a `lanternString` (instanced paper lanterns on a catenary).
  - **3D:** emissive plus bloom, with no real lights.
  - **Pixel:** small glow cards, the same additive halos as the lamps.
  - **The data:** `props: { lanternString: 'lit' }`.
- **Phone cost:** 3D adds 1 instanced draw.
- **Effort:** S–M.

**M12. Shoot the separate campaigns on a phone too.**

- **Renderer:** both.
- **Serves:** all four separate campaigns.
- **The problem:** the first pass's phone set covered Hazel's Grove. The separate campaigns' portrait framing is unchecked, and the HUD covers the top band.
- **How:** add the four campaigns to the screenshot script at 390×844 with reduced motion, and fail any frame where a focus mark's projection sits under the HUD or dialogue rects (the same math as H4).
- **Phone cost:** none (it's tooling).
- **Effort:** S.

**M13. Show Hazel's arrival and her coat up close.**

- **Renderer:** both.
- **Serves:** Hazel ch11 ("her coats are patched at the elbows").
- **Ref:** Scarlet/Violet's close-ups on NPC reveals.
- **How:**
  - **The shot:** a `close` on Hazel for `c11-open`'s second line, with H7 so she faces the camera.
  - **Her look:** add patch accessories to Hazel's look in `npc-looks.ts` (two darker squares on the sleeves in pixel; two decals in 3D).
- **Phone cost:** none.
- **Effort:** S.

**M14. Let the Hush leave a trail.**

- **Renderer:** both.
- **Serves:** The Hundred Days, ch9.
- **Ref:** the way frost spreads in Tears of the Kingdom.
- **How:** as each lantern goes out, a grey frost decal grows under it: 3D reuses `frost-fx.ts`, and pixel uses a dithered grey ellipse. It stays for the chapter, so the path of the Hush is readable afterwards.
- **Phone cost:** low.
- **Effort:** S.

**M15. Add a sunrise to Logged In's last frame.**

- **Renderer:** both.
- **Serves:** Logged In, ch8 close ("the board takes the word at first light").
- **How:** hour 6 is staged. Add the sky gradient's first-light band, and the board's final message drawn bigger on the board sprite or mesh, as a `props.board: 'final'` state.
- **Phone cost:** none.
- **Effort:** S.

### Nice-to-have

**N1. Chapter postcards.**

- **Renderer:** both.
- **Serves:** every chapter opening.
- **Ref:** the Legends: Arceus area-arrival title shot.
- **How:** hold the first frame of each chapter's opening for 1.5 s in letterbox with the chapter title card (it already exists in `CAMPAIGN_LOOK`) before the first line. Under reduced motion it is a static hold.
- **Phone cost:** none.
- **Effort:** S.

**N2. Give each ending its own tableau.**

- **Renderer:** both.
- **Serves:** the 8 Hazel endings and each storyline's 3–4 endings.
- **Ref:** the posed group shots at the end of Scarlet/Violet.
- **How:** stage every ending scene with a full `cast` arranged for a last wide shot, plus `props` for that ending (the grey lamp, the open sky, the whole day).
- **Phone cost:** none.
- **Effort:** M (content).

**N3. Give the cast props in their hands.**

- **Renderer:** both.
- **Serves:** Sorrel's broom (Hundred ch2), Ida's eggs, Vane's notebook and Marigold's keys.
- **How:** extend `StageCast.carry` with `broom`, `notebook`, `egg` and `keys`, using the hand offset the hand lanterns use. 3D builds them with `prop-kit.ts`; pixel adds a layer in the keeper sheet.
- **Phone cost:** low.
- **Effort:** S.

**N4. Add chimney smoke and a weather vane as time and wind cues.**

- **Renderer:** both.
- **Serves:** the Fold, Hazel's cottage and Corvin's house.
- **Ref:** the chimney smoke in Jubilife.
- **How:** soft smoke cards from the chimneys, still under reduced motion. Their direction follows `weather: 'wind'`.
- **Phone cost:** low (quad particles).
- **Effort:** S.

**N5. Let the Hundred Days' calendar show in the Fold.**

- **Renderer:** both.
- **Serves:** The Hundred Days.
- **How:** tally marks on the square's well post that grow with the day count, and wreaths on houses after ch6.
- **Phone cost:** none.
- **Effort:** S.

**N6. Make photo mode stage-aware.**

- **Renderer:** both.
- **Serves:** keepsakes.
- **Ref:** the Legends: Arceus photo studio.
- **How:** after a chapter closes, offer a photo of its `stage` (cast and props restored).
- **Phone cost:** none.
- **Effort:** M.

**N7. Add memorial flowers in the separate campaigns.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk (the reverting) and The Hundred Days (the Quiet and Grey Lamp endings).
- **The problem:** departures there have no place to be remembered.
- **How:** reuse `memorial.ts` and the pixel memorial flower on a campaign-specific mark (the green's edge, or the Fold's well). Departures still fade gently, with no other imagery.
- **Phone cost:** none.
- **Effort:** S.

## Staging data the content would need

These are additions to `SceneStage` (`config/story.ts`). Everything stays optional, and "missing" still
means "do as today".

| Field | Type | Used by |
| --- | --- | --- |
| `cast[].who` | any storyline speaker id (not only Hazel's) | C1 |
| `cast[].tint` | `'weathered'` | C6 |
| `cast[].carry` | adds `'broom' \| 'notebook' \| 'egg' \| 'keys'` | N3 |
| `place` | `rootNode` (implemented), `below`, `festival` | C3, C4, H9 |
| `exclusive` | `boolean`: draw only the set, not the Grove | C3, C4 |
| `set` | `'fold' \| 'logged' \| 'beetle' \| 'dawndusk'`: campaign landmark kit, Grove-only buildings hidden | H3 |
| `shot.then` | `ShotKind`: the push-in after the first line | H5 |
| `shot.fit` | `boolean`, default true for `establish`/`wide`: fit focus bounds inside the HUD-safe area | H4 |
| `lights.windows` | `'lit' \| 'out'` | C5, M6 |
| `props` keys | `pondIce`, `hush`, `banners`, `cart`, `chair`, `shutters`, `lanternString`, `board`, `door` | C7, C8, M4, C3, M6, M11, M15, M3 |
| `item` | a kit id for the close-up cutaway | M9 |
| `grade` | adds `crisp`; the Dawn grade becomes split-tone | M10, H11 |
| `hold` | seconds: the postcard hold before the first line | N1 |

**Coverage the content still needs:**

- **Separate-campaign beats:** every beat and extra scene in the four storylines gets `place`, `hour`, `shot` and
  `cast` (H2).
- **Stage marks:** add, per place, marks for each storyline speaker (`fold-well`, `fold-door-1..4`,
  `guardhouse-bench`, `banner-1..3`, `green-centre`, `house-1..4-door`, `board`, `rootNode-chair`,
  `hush`, `festival-1..12`).
- **Story looks:** `STORY_NPC_LOOKS` for the ten storyline speakers, checked by `content-check.ts` (C2).
- **Chapter home locations:** each chapter gets `homeLocation` (Hazel and every storyline), used by the debug jump and the dev warning (H1).

## Sources

- Pokémon Legends: Arceus, Jubilife Village: https://SEREBII.NET/legendsarceus/jubilifevillage.shtml
- Jubilife Village facilities (photo studio, Galaxy HQ notice board): https://samurai-gamers.com/pokemon-legends-arceus/jubilife-village-facilities-guide/
- Galaxy Hall: https://bulbapedia.bulbagarden.net/wiki/Galaxy_Hall
- The Teal Mask, Mossui Town: https://bulbapedia.bulbagarden.net/wiki/Mossui_Town
- Kitakami Hall, the Festival of Masks venue: https://SEREBII.NET/pokearth/kitakami/kitakamihall.shtml
- Festival of Masks: https://bulbapedia.bulbagarden.net/wiki/Festival
- Pokémon Legends: Z-A, Lumiose districts: https://bulbapedia.bulbagarden.net/wiki/Jaune_District and https://bulbapedia.bulbagarden.net/wiki/Vert_District
- Pokémon Legends: Z-A map: https://www.dexerto.com/wikis/pokemon-legends-z-a/pokemon-legends-z-a-map-guide
- Pokémon Legends: Z-A wild zones: https://serebii.net/legendsz-a/wildzones.shtml and https://bulbapedia.bulbagarden.net/wiki/Wild_zone
- Pokémon Scarlet/Violet picnics and Tera crystals: https://rpgamer.com/2022/10/pokemon-scarlet-violet-show-further-terastallization-picnics-more/
- Palworld building: https://palworld.wiki.gg/wiki/Building
- Palworld Wall Torch and Lamp: https://palworld.wiki.gg/wiki/Wall_Torch and https://palworld.wiki.gg/wiki/Lamp
- Animal Crossing: New Horizons seasonal decoration: https://play.nintendo.com/news-tips/tips-tricks/island-holiday-decoration-tips-animal-crossing/

**References from general knowledge:** the Tears of the Kingdom references (weathered statues, landmark silhouettes, item glints, spreading frost)
and the Scarlet/Violet cutscene framing (speaker always in shot, wide-then-two-shot, over-the-shoulder) come from
general knowledge of those games. I found no page that documents them, so treat them as
descriptions rather than cited facts.
