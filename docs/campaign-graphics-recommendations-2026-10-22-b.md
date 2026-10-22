# Campaign graphics recommendations, round 3 (2026-10-22)

This is the third list of campaign graphics recommendations: fifty new items for both renderers. Like the first two, it is a report only and changes no code.

**What it builds on.** The material from earlier today, with no new screenshots:

- 168 frames from the two shot rounds of the second pass (`final` and `final2`, both renderers, desktop and phone, reduced motion);
- the two review rounds on those frames;
- the stubbed list and the known bugs in PROGRESS.md after the `cg3` fix round (59e714b).

**What it leaves out.** The 95 items already built: the first list (C1–N7 of 2026-10-21) and the second (C1–N7 of `campaign-graphics-recommendations-2026-10-22.md`). Where an item builds on one of those, it says so.

**Scope.**

- **Campaigns:** Hazel's Grove plus The Hundred Days, Logged In, The Beetle Road and Dawn & Dusk. The Hollow dungeon is left out.
- **Constraints:**
  - No death imagery; departures fade gently.
  - Colour is never the only cue.
  - Under reduced motion there is a still form and no pulsing.
  - 3D uses instancing, baked light and emissive with bloom rather than new lights.
  - Phones need 30 fps or more at 4× CPU throttle.

**Item format.** Each item gives:

- **What** it is and the **renderer**;
- **Serves:** which campaign or chapter it helps;
- **Ref:** the reference and the thing to borrow;
- **How:** files and technique;
- **Phone:** the cost on a phone;
- **Effort:** S is under a day, M is 1–3 days, L is more.

## Where it stands

**Pixel.**

- **Story scenes now:**
  - stage the hour, place and cast, and push in on the first spoken line;
  - hide Grove-only buildings in the separate campaigns;
  - thin buildings that cover the cast.
- **What still reads as "a map with people on it" rather than a scene:**
  - People stand in one pose at all times.
  - Nobody walks on or off.
  - Every line looks the same whether it is a joke or a turning point.
  - Indoor lines ("behind the counter", Hazel's kitchen) are played outdoors.
- **The portraits** are the strongest storytelling tool the pixel view has, and they never change expression.

**Full 3D.**

- **Staging is now strong:**
  - fitted shots, side two-shots and push-ins;
  - clean occlusion, real sets for the white room and the cave;
  - campaign kits.
- **The gap has moved from places to acting:**
  - Figures don't sit, kneel, gesture or look at the speaker.
  - The camera doesn't cut on speaker changes.
  - There's no depth cue in close shots.
- **The stubs** are now the most visible faults:
  - hidden buildings still cast shadows;
  - the cave is drawn over the Grove.

## Recommendations

### Critical: the picture contradicts the text

**K1. Real sit and kneel poses for stage actors, Moss and NPC Keepers.**

- **Renderer:** both.
- **Serves:** Hundred ch1 ("an old woman sits on the one whole step"), Beetle ch1 ("behind the counter sits a man"), Hazel ch4 and ch11 (Moss sits; `pose: 'sit'` on Hazel at the pond), every `pose` in the stage files.
- **The problem:** today, actors stand, and Moss's "sit" is the sleep pose with the Zzz.
- **Ref:** Animal Crossing's villagers sitting on benches and stumps.
- **How:**
  - **3D:** add `sit` and `kneel` to the keeper poses in `samples/keeper-spec.ts`. Hips drop to a seat height taken from the mark (`stage-marks.ts` gains `seatY`), and the knees bend through the existing knee joints. Moss gets a `sit` pose in the species format (one row in `docs/species-format.md`), so he stops showing the sleep Zzz.
  - **Pixel:** add a 2-frame `sit` and a 1-frame `kneel` per angle to the keeper sheet layers (`render/sprites/keeper.ts`), and a sit frame to the Nubbin sheet.
- **Phone:** none (a pose swap).
- **Effort:** M.

**K2. Hidden 3D buildings must stop casting shadows and stop catching taps.**

- **Renderer:** 3D.
- **Serves:** every staged scene that hides a building (Dawn & Dusk ch1/ch6, Hazel ch10–12, Hundred ch9).
- **The problem:** the hide box discards fragments, but the shadow pass still draws the house, so a roof-shaped shadow falls over the cast with nothing above it, and taps still select the invisible building.
- **Ref:** none; a fix.
- **How:**
  - **Shadows:** apply the same `OCCLUDE.hide*` box test in the shadow depth material (`customDepthMaterial` with the same `onBeforeCompile` hook) in `render3d/building-kit.ts`.
  - **Taps:** skip picks whose world point falls in a hide box (`ctx.pickables` filter in `dress-x.ts`).
- **Phone:** none.
- **Effort:** S.

**K3. People before props in the phone fit.**

- **Renderer:** both.
- **Serves:** Hazel ch10 on a phone held upright, where the pixel shot keeps the pond whole and loses the Keeper (known bug); any fit with a large prop in focus.
- **Ref:** Scarlet/Violet's phone-safe cutscene framing (people always in).
- **How:**
  - **Weighting:** in `fitPixel` and the 3D `fitShot`, give focus points a weight (cast 1, prop 0.5, place 0.3). When everything can't fit, drop the lowest weights first and keep the speaker.
  - **Big props:** add `pondCentre`-style props as "keep at least 60% in" rather than "keep whole".
- **Phone:** none.
- **Effort:** S.

**K4. Fern must never look like the player.**

- **Renderer:** both.
- **Serves:** Hazel ch1 and every Fern line.
- **The problem:** as a stage actor she wears the Gardener look, and a player who chose Gardener sees two of themselves.
- **Ref:** Legends: Arceus's villagers, who never share the player's outfit.
- **How:** give Fern a story-only look in `config/npc-looks.ts` (satchel, a different hat brim shape and a scarf). Add a check in `content-check.ts`: no speaker's look may equal any selectable trainer look.
- **Phone:** none.
- **Effort:** S.

### High

**K5. Walk-on and walk-off.**

- **Renderer:** both.
- **Serves:** every scene with arrivals: Corvin at the gate (c2, c11-gate), Hazel's return (c11-open), Ida and Hob at their posts, festival arrivals (c12).
- **The problem:** today actors pop in on their marks.
- **Ref:** Scarlet/Violet's NPCs walking into a cutscene.
- **How:** add `cast[].from?: string` (a mark). The actor walks from that mark to its own over `STAGE` seconds with the walk clip. Under reduced motion they appear on the mark at once. It's render-only, the same as the H7 Keeper hold.
- **Phone:** low.
- **Effort:** M.

**K6. Heads turn to whoever is talking.**

- **Renderer:** both.
- **Serves:** every multi-person scene (the ch12 ring, the D&D green, the Fold square).
- **Ref:** Palworld and Animal Crossing's look-at on the speaker.
- **How:**
  - **3D:** each cast figure's head yaw eases (clamped ±60°) toward the current line's speaker. A neck pivot exists in the keeper rig; Nubbins use their head part.
  - **Pixel:** pick the sprite angle facing the speaker for listeners.
  - **Reduced motion:** the turn snaps.
- **Phone:** negligible.
- **Effort:** S–M.

**K7. A line gesture: nod, shrug, point, look down, hands to chest.**

- **Renderer:** both.
- **Serves:** dialogue-heavy scenes (Marigold ch6, Vane, Corvin c9, Hazel ch11).
- **Ref:** Scarlet/Violet's canned NPC gestures in conversations.
- **How:**
  - **The data:** add `Line.gesture?` in `content/types.ts` (content optional; the default comes from `mood`: `sad` gives look-down, `happy` a nod).
  - **3D:** five short additive pose clips on the keeper rig.
  - **Pixel:** one held frame per gesture on the keeper sheet.
  - **Content:** gestures on about 1 line in 5.
- **Phone:** none.
- **Effort:** M.

**K8. Portraits that change with mood.**

- **Renderer:** both (the DOM dialogue box).
- **Serves:** every campaign; the pixel view most of all.
- **The problem:** `mood` already exists on lines, but `portraitFrame` always uses the idle frame.
- **Ref:** Animal Crossing's expressive dialogue portraits.
- **How:** in `ui/dialogue.ts` map `mood` to an expression frame on the keeper sheet (smile, frown, surprised, eyes closed), drawn as a face layer in `render/sprites/keeper.ts`. The face shape changes, not only colour.
- **Phone:** none.
- **Effort:** M.

**K9. Cut on a speaker change: shot and reverse shot.**

- **Renderer:** 3D, and pixel through pan.
- **Serves:** two-person exchanges (Corvin and Hazel at the gate, Marigold and the Keeper, Hob at the counter).
- **The problem:** the two-shot holds for the whole exchange.
- **Ref:** Scarlet/Violet's alternating over-the-shoulder cutscene shots.
- **How:**
  - **The data:** add `shot.kind: 'over'` (already in `ShotKind`, little used) as an automatic alternation: when consecutive lines alternate between two speakers, cut to an over-the-shoulder of the listener.
  - **The rule:** keep the 180° line (both shots from the same side) in the 3D shot code.
  - **Pixel:** a small pan toward the speaker.
  - **Reduced motion:** cuts only.
- **Phone:** none.
- **Effort:** M.

**K10. Interior sets for indoor lines.**

- **Renderer:** both.
- **Serves:** Hazel's kitchen and keepsake shelf (c1, c11), the guard house counter (Beetle ch1–2), Corvin's house (c9), a crest-house front room (D&D ch6), the Fold's whole house (Hundred ch5 "a roof with a hole in it").
- **Ref:** the Legends: Arceus Galaxy Hall interiors; the Animal Crossing house view.
- **How:**
  - **The mechanism:** reuse the `exclusive` set mechanism with `place: 'inside-<id>'`.
  - **3D:** a three-wall box (the camera-side wall removed) built from `building-kit` panels, with furniture from `prop-kit.ts`, and the window glow as emissive.
  - **Pixel:** a painted room card (back wall, floor, two furniture sprites) in `render/paint/` and a mark grid inside.
  - **Content:** the staging per indoor scene.
- **Phone:** cheaper than outdoors.
- **Effort:** L.

**K11. Moss's tales in a tale grade, with young Hazel.**

- **Renderer:** both.
- **Serves:** Hazel ch4 ("Moss Remembers") and every scene that tells of the past (Moss's winter beside young Hazel, Briar's flower).
- **The problem:** tale lines are drawn over today's cast and props.
- **Ref:** the Legends: Arceus flashback vignette; Tears of the Kingdom's memory-scene tint.
- **How:**
  - **The data:** add `stage.tale: true`, giving a warm desaturated grade with a soft vignette (`post.ts` in pixel; the `CAMPAIGN_LOOK` grade in 3D) and swapping the cast to a `young-hazel` look (a smaller scale and a plain shawl). Present-day actors other than Moss are hidden.
  - **Content:** mark the tale scenes.
- **Phone:** none.
- **Effort:** M.

**K12. A keepsake you can turn in your hands.**

- **Renderer:** 3D, plus a pixel card.
- **Serves:** keepsakes and story items (the letter, the stone, the notebook, Vane's notebook, the recording).
- **Ref:** Tears of the Kingdom's item close view; Animal Crossing's item reveal.
- **How:**
  - **3D:** extend the M9 item card into an inspect view. Tap the card and the prop-kit model renders live in a small offscreen view, turned by drag, with the item's one-line description underneath.
  - **Pixel:** the 3× card with two angle sprites.
  - **Reduced motion:** no idle spin.
- **Phone:** one small extra render only while open.
- **Effort:** M.

**K13. Hand-held props on real hand bones.**

- **Renderer:** 3D.
- **Serves:** every `carry` (lanterns, broom, notebook, keys, bag), from both passes.
- **The problem:** today the hand lantern and the new carry props sit at a computed hand offset and float when the arm moves.
- **Ref:** Palworld's held tools.
- **How:** expose a `hand.R` pivot in the keeper rig (`samples/keeper-spec.ts`), and parent carry props to it in `render3d/dress-e.ts` and the P carry code.
- **Phone:** none.
- **Effort:** S–M.

**K14. Speakers lift out of busy scenes: a contact ring and a light rim.**

- **Renderer:** 3D.
- **Serves:** crowded frames: the ch12 festival, the D&D green with the crest houses behind, the Fold square at night.
- **Ref:** Palworld's character rim against busy bases.
- **How:**
  - **The rim:** add a soft rim term to the speaking actor's material (the toon outline's colour brightens a step).
  - **The ring:** a 1-draw contact ring decal under their feet in a neutral pale tone.
  - **Not colour alone:** it pairs with the chevron.
- **Phone:** negligible.
- **Effort:** S.

**K15. Grave moments get a letterbox and a slower pace.**

- **Renderer:** both.
- **Serves:** the turning points: Hazel ch10's falls stopping, ch11 "she is smaller than you remember", every ending's last line, departures.
- **Ref:** the Scarlet/Violet ending cutscenes.
- **How:**
  - **The data:** add `stage.grave: true`. It gives letterbox bars (the N1 postcard bars, held), the HUD hidden, and a 25% longer auto-advance delay where auto-advance exists.
  - **3D:** a slow 2 s push (a cut under reduced motion).
  - **Content:** about 15 scenes.
- **Phone:** none.
- **Effort:** S.

**K16. Real dungeon floors for the Beetle Road's Hollow Below.**

- **Renderer:** both.
- **Serves:** Beetle ch3, ch4, ch6, ch7 and ch8.
- **The problem:** the `below` set is a cave drawn over the Grove (a stub from the second pass).
- **Ref:** the Palworld dungeon interiors.
- **How:** `storyline-rules-beetle.ts` calls `setLocation(world, 'dungeon')` with a fixed story seed and a depth per domain. `STORY_HOME` gives those chapters `dungeon`. The `below` set stays as the fallback for scenes staged outside the floor.
  - **Content:** marks on the floor (via the seeded floor's room centres).
- **Phone:** the same as the Hollow (already measured).
- **Effort:** M–L.

**K17. A Hush you can see coming.**

- **Renderer:** both.
- **Serves:** The Hundred Days ch9, beyond the cg3 hooded card.
- **Ref:** Tears of the Kingdom's Gloom silhouettes against fog.
- **How:**
  - **The walk:** the figure moves from the `hush` mark toward the Fold over the scene, along a path of marks.
  - **The trail:** a low ground-fog band follows it (instanced cards). It reaches each lantern as that lantern goes out.
  - **Reduced motion:** it sits at its final place for the line.
- **Phone:** low.
- **Effort:** M.

**K18. Night silhouettes behind lit windows.**

- **Renderer:** both.
- **Serves:** night scenes in the Fold (Hundred ch9–10), dusk on the D&D green, Corvin's one lit window (c9).
- **Ref:** Palworld's lantern-lit bases; the Jubilife evening.
- **How:**
  - **3D:** an emissive window texture with a figure cut-out that changes per house at story beats (no animation).
  - **Pixel:** a 2-frame window sprite with a figure.
  - **Content:** `props.windowFigures: 'show'`.
- **Phone:** none.
- **Effort:** S.

**K19. Water reflects the lanterns.**

- **Renderer:** both.
- **Serves:** the ch10 vigil (before the ice), Hundred ch9 at the jetty and well, the Logged In Night Grove board.
- **Ref:** the Mossui lanterns over water at the Teal Mask festival.
- **How:**
  - **3D:** for each lit lantern within reach of the water, add a stretched emissive streak card on the water surface (instanced, one draw), dropped when the lantern is out.
  - **Pixel:** dithered vertical streaks in the pond layer under each lit lamp.
  - **Reduced motion:** still streaks.
- **Phone:** one draw.
- **Effort:** S.

**K20. A per-campaign dialogue box skin.**

- **Renderer:** both (the DOM).
- **Serves:** each separate campaign's identity.
- **Ref:** the Legends Z-A district UI accents.
- **How:** a frame and corner ornament per storyline in CSS, each recognisable by its shape:
  - **Logged In:** a terminal bevel and a blinking caret (still under reduced motion).
  - **Beetle Road:** a stamped ledger corner.
  - **Dawn & Dusk:** a half sun or half moon by the half.
  - **The Hundred Days:** a small day tally in the corner.
  - **The data:** a `CAMPAIGN_LOOK.box` key.
- **Phone:** none.
- **Effort:** S.

### Medium

**K21. Depth of field in close shots.**

- **Renderer:** 3D.
- **Serves:** `close` and `over` shots (Hazel ch11, Moss ch4, Root ch7).
- **Ref:** Scarlet/Violet's soft background in close-ups.
- **How:** a cheap two-tap blur of the background past the focus distance in the post chain, only for `close` and `over`, disabled by the frame governor below 45 fps and on phones by default (`STAGE2.dof`).
- **Phone:** off by default.
- **Effort:** S–M.

**K22. Morning god-rays and dust motes.**

- **Renderer:** 3D, with pixel cards.
- **Serves:** the `crisp` ch12 morning, Dawn half openings, Hundred ch10's last morning.
- **Ref:** the Legends: Arceus morning light through the trees.
- **How:**
  - **3D:** two or three additive light-shaft cards through the tree line, aimed along the sun, with an emissive gradient.
  - **Motes:** an instanced dust quad set (static under reduced motion).
  - **Pixel:** dithered diagonal bands.
- **Phone:** low.
- **Effort:** S.

**K23. Moving cloud shadows on the ground.**

- **Renderer:** 3D.
- **Serves:** day scenes in every campaign. Without them, wide shots feel static.
- **Ref:** the Legends: Arceus open plains.
- **How:** a scrolling noise term in the terrain shader darkens the ground slowly. It is off under reduced motion, and off at night and in exclusive sets.
- **Phone:** about one texture fetch.
- **Effort:** S.

**K24. Moon phase and stars by chapter.**

- **Renderer:** both.
- **Serves:** night chapters (Hazel ch3, ch10's Long Night; Logged In ch4–5; Hundred ch9).
- **Ref:** the Animal Crossing night sky.
- **How:**
  - **The data:** add `stage.moon?: 'new'|'crescent'|'half'|'full'` (default from the chapter number).
  - **3D:** a sky dome sprite and a star field brightened when the moon is new.
  - **Pixel:** a moon sprite at the sky edge of the low-res target.
  - **Content:** the Long Night is new-moon dark.
- **Phone:** none.
- **Effort:** S.

**K25. Snow builds through the Long Night.**

- **Renderer:** both.
- **Serves:** Hazel ch10, from the first vigil wave to the dawn.
- **Ref:** the Animal Crossing snow accumulation.
- **How:**
  - **3D:** a snow-cover amount (0–1) driven by the vigil wave from `stageFlags`, feeding the terrain frost term and the roof caps.
  - **Pixel:** three ground repaint levels, switched at wave changes (no per-frame cost).
- **Phone:** none per frame; pixel repaints happen on wave changes.
- **Effort:** S–M.

**K26. Paths wear in with play.**

- **Renderer:** both.
- **Serves:** the sense of time across Hazel's twelve chapters and the Hundred Days.
- **Ref:** Animal Crossing's worn grass paths.
- **How:** a per-chapter wear amount on the main paths (wider, more bare earth), set from the chapter number in the ground painters (`ground.worker.ts`, the 3D terrain splat). It's render-only, from `stageFlags`.
- **Phone:** none.
- **Effort:** S.

**K27. The crop plot tells the season.**

- **Renderer:** both.
- **Serves:** the Grove plot across Hazel's chapters (sowing in ch1, green in summer, harvest at ch6–7, bare in winter).
- **Ref:** the Legends: Arceus farm plots.
- **How:** four plot sprite states in `render/paint/decor.ts` and four instanced crop meshes in 3D, chosen by the staged season.
- **Phone:** none.
- **Effort:** S.

**K28. Lantern owners shown by shape, not only colour.**

- **Renderer:** both.
- **Serves:** Hazel ch3 and ch10 (the four named lanterns).
- **Ref:** Palworld's distinct lamp models.
- **How:** each of the four posts gets its own head shape (round, square, hex, tall) and a small hung tag sprite. Lit, out and flicker read from both glow and shape.
- **Phone:** none.
- **Effort:** S.

**K29. Readable message boards.**

- **Renderer:** both.
- **Serves:** Logged In ch5 (the message board), the request board, the Beetle guard house notices.
- **Ref:** the Galaxy Hall notice board in Legends: Arceus.
- **How:** the board's lines render from `strings.ts` into its texture (3D) or sprite (pixel), so a close shot can read them. A `close` shot on the board uses the item card's 3× path in pixel.
- **Phone:** one texture update per scene.
- **Effort:** S.

**K30. The chapter photo includes the grade.**

- **Renderer:** both.
- **Serves:** N6's chapter photos (a stub today: canvas only).
- **Ref:** none; a fix.
- **How:** composite the DOM grade layers (title-card tint, split grade) onto the captured canvas with `globalCompositeOperation` in `src/game.ts` `captureFrame`, and save the offer state in the save's UI block.
- **Phone:** none.
- **Effort:** S.

**K31. Chapter thumbnails in the journal.**

- **Renderer:** both.
- **Serves:** the journal's chapter list in all five campaigns.
- **Ref:** Scarlet/Violet's story recap pages.
- **How:** reuse the chapter photo capture to store a 160×90 thumbnail per closed chapter in IndexedDB (in try/catch, like the sculpt cache), and show it beside the chapter title in the journal.
- **Phone:** one small image per chapter.
- **Effort:** M.

**K32. A landmark silhouette on each campaign's title card.**

- **Renderer:** both.
- **Serves:** the separate campaigns' chapter postcards (N1).
- **Ref:** Legends Z-A's district title stingers.
- **How:** a vector silhouette per campaign drawn by the title card in `ui/title-card.ts`:
  - **The Hundred Days:** the Fold's mill.
  - **Logged In:** the board.
  - **The Beetle Road:** the cart.
  - **Dawn & Dusk:** four roofs.
  - **Hazel's Grove:** the gate.
- **Phone:** none.
- **Effort:** S.

**K33. A campaign map view with set landmarks.**

- **Renderer:** both.
- **Serves:** the Map screen while a separate campaign runs.
- **The problem:** it shows the Grove's landmarks.
- **Ref:** the Legends Z-A district map.
- **How:** the map reads `stage-sets.ts` and the campaign kit's landmark list, hides Grove-only icons and adds the campaign's (the well, the guard house, the green, the board).
- **Phone:** none.
- **Effort:** S–M.

**K34. Rain that tells the story: puddles grow and dry.**

- **Renderer:** both.
- **Serves:** Hazel ch6 ("Rain on the Hill"), Hundred ch7 (the Mire), Beetle ch6–7.
- **Ref:** the Legends: Arceus wet ground.
- **How:**
  - **3D:** puddle decals (instanced) scale with a `wetness` amount from the scene's time in rain, and the ground darkens. They dry over the next scene.
  - **Pixel:** puddle sprites appear in three steps.
- **Phone:** one draw.
- **Effort:** S.

**K35. Wind you can see.**

- **Renderer:** 3D, plus pixel bushes.
- **Serves:** `weather: 'wind'` scenes, Corvin's coat (c9), banners (Beetle).
- **Ref:** the Tears of the Kingdom grass wind.
- **How:** a wind direction and strength uniform shared by grass, bunting, banners and coat tails (a vertex bend). In pixel, a 2-frame sway on bushes and banners.
- **Reduced motion:** still, leaning.
- **Phone:** negligible.
- **Effort:** S.

**K36. Footsteps for walk-ons in snow, mud and sand.**

- **Renderer:** both.
- **Serves:** K5 walk-ons in Hazel ch9–12, Hundred ch7 and the Beetle lane.
- **Builds on:** the first pass's frost footprints (N3), extended to every actor that walks on, including stage actors.
- **How:** the actor's walk drops footprint decals from the existing pool. The decal's tint follows the ground type (snow, mud, sand).
- **Phone:** pooled.
- **Effort:** S.

**K37. Departure staging in the separate campaigns.**

- **Renderer:** both.
- **Serves:** Dawn & Dusk (the reverting), Hundred's Quiet and Grey Lamp endings.
- **Ref:** none; it follows the game's own gentle fade.
- **How:** stage departures with the soft fading cocoon at the campaign memorial spot (N7), a held `grave` shot (K15), and the flower growing at the end of the scene. No other imagery.
- **Content:** the staging for those scenes.
- **Phone:** none.
- **Effort:** S.

**K38. Hazel ages.**

- **Renderer:** both.
- **Serves:** Hazel ch11 ("smaller than you remember"), endings, tales (K11).
- **Ref:** none.
- **How:** two story looks, `hazel` (ch11 on: patched coats, M13, a slight stoop as a pose offset, a stick) and `young-hazel` (tales). Chosen from the chapter and `stage.tale`.
- **Phone:** none.
- **Effort:** S.

### Nice-to-have

**K39. An Item-get pose.**

- **Renderer:** both.
- **Serves:** picking up a story item (the letter, the notebook, the stone).
- **Ref:** Zelda's and Animal Crossing's held-aloft item pose.
- **How:** the Keeper raises the item for 1 s with the item card. It's a pose in the keeper spec, plus a held frame in pixel.
- **Reduced motion:** the pose is held without the raise.
- **Phone:** none.
- **Effort:** S.

**K40. Nubbin partners react to scenes.**

- **Renderer:** both.
- **Serves:** every staged scene with your partner present.
- **Ref:** Palworld pets reacting near the player.
- **How:** the partner takes a mark beside the Keeper (`cast` default `partner`) and plays happy, sad or surprised by the line's `mood`, through the existing emote ball. It's render-only.
- **Phone:** none.
- **Effort:** S.

**K41. Crowd Nubbins look at the action.**

- **Renderer:** 3D.
- **Serves:** ch12 and the Hazel endings' ring.
- **How:** K6's head turn applied to crowd Nubbins toward the speaker, at half strength.
- **Phone:** negligible.
- **Effort:** S.

**K42. Rising lanterns at the ch12 festival's close.**

- **Renderer:** both.
- **Serves:** Hazel `c12-close` and `hazels-grove`.
- **Ref:** the Teal Mask festival lanterns.
- **How:**
  - **3D:** instanced paper lanterns rise slowly (emissive with bloom).
  - **Pixel:** glow cards drift up.
  - **Reduced motion:** a static field of lanterns in the sky.
- **Phone:** one draw.
- **Effort:** S.

**K43. Seasonal bunting and wreaths on Hazel's cottage.**

- **Renderer:** both.
- **Serves:** Hazel's Grove by season.
- **Ref:** the Animal Crossing seasonal decorations.
- **How:** door wreaths in winter, flower boxes in spring, and gourds in autumn on the cottage, chosen by the staged season.
- **Phone:** none.
- **Effort:** S.

**K44. Night insects and day birds as ambient life.**

- **Renderer:** both.
- **Serves:** wide shots in every campaign.
- **Ref:** the Legends: Arceus ambient fauna.
- **How:** a few instanced bird silhouettes cross the sky by day, and moths gather at lit lamps at night (only lit ones, so H13's "out" state reads by shape too). Static under reduced motion. None in exclusive sets.
- **Phone:** one draw.
- **Effort:** S.

**K45. A frost bloom on the gate when Corvin returns.**

- **Renderer:** both.
- **Serves:** `c11-gate`.
- **Ref:** Tears of the Kingdom's frost spreading.
- **How:** a frost decal grows on the lychgate's posts during the scene. It reuses `frost-fx.ts` and, in pixel, a dithered white overlay on the gate sprite.
- **Phone:** none.
- **Effort:** S.

**K46. A booting-up effect for the Logged In opening.**

- **Renderer:** both.
- **Serves:** Logged In ch1 "Log In".
- **Ref:** the Legends Z-A holographic wild-zone fences.
- **How:** the meadow resolves from the grid outward (a radial reveal in the terrain shader; a pixel dither reveal) over 1.5 s. Under reduced motion it is a cut.
- **Phone:** none.
- **Effort:** S.

**K47. An ending gallery.**

- **Renderer:** both.
- **Serves:** all 8 Hazel endings and the 12 storyline endings.
- **Ref:** the Scarlet/Violet ending stills.
- **How:** each ending's last staged frame is captured (the K30 path) to a gallery page in the journal, greyed until reached. Colour is not the only cue: the unreached ones show a lock icon.
- **Phone:** none.
- **Effort:** M.

**K48. A stage inspector in the debug panel.**

- **Renderer:** both.
- **Serves:** the people building every staging fix.
- **How:**
  - **The overlay:** draws marks, focus points with their weights (K3), `safeRect`, hide boxes and the camera's chosen yaw.
  - **The readout:** the resolved stage's JSON for the current scene, with "copy as overlay entry".
  - **Gating:** `?debug` only.
- **Phone:** none (dev only).
- **Effort:** S–M.

**K49. A shot test in the test suite.**

- **Renderer:** both.
- **Serves:** keeping fixed scenes fixed.
- **How:** a Vitest test that resolves every staged scene's fit with `fitPixel` and a pure version of the 3D fit at 1280×720 and 390×844, and fails if a speaker's projected point falls outside `safeRect`. No browser needed.
- **Phone:** none.
- **Effort:** M.

**K50. A golden screenshot set with a perceptual diff.**

- **Renderer:** both.
- **Serves:** future graphics passes.
- **How:** commit the 84-frame `final2` recipe as `tests/tools/story-shots.cjs` with a small reference set (16 frames). Add a local script that re-shoots and flags frames whose SSIM falls below 0.9, for a human to look at. It is not in CI, because GPU output varies.
- **Phone:** none.
- **Effort:** M.

## Staging data these need

| Field | Type | Items |
| --- | --- | --- |
| `cast[].pose` | adds working `'sit' \| 'kneel'` with mark `seatY` | K1 |
| `cast[].from` | mark id to walk on from | K5, K36 |
| `cast` default | `partner` beside the Keeper | K40 |
| `Line.gesture` | `'nod' \| 'shrug' \| 'point' \| 'down' \| 'chest'` | K7 |
| `place` | `'inside-<id>'` interiors | K10 |
| `tale` | boolean | K11, K38 |
| `grave` | boolean | K15, K37 |
| `moon` | `'new' \| 'crescent' \| 'half' \| 'full'` | K24 |
| `props` keys | `windowFigures`, `risingLanterns`, `wreath` | K18, K42, K43 |
| focus weights | cast 1, prop 0.5, place 0.3; props may be "keep 60%" | K3 |
| `CAMPAIGN_LOOK.box` | dialogue-box skin per storyline | K20 |

## Sources

- Pokémon Legends: Arceus, Jubilife Village and Galaxy Hall: https://SEREBII.NET/legendsarceus/jubilifevillage.shtml and https://bulbapedia.bulbagarden.net/wiki/Galaxy_Hall
- The Teal Mask, Mossui Town and the Festival of Masks: https://bulbapedia.bulbagarden.net/wiki/Mossui_Town and https://bulbapedia.bulbagarden.net/wiki/Festival
- Pokémon Legends: Z-A wild zones and districts: https://serebii.net/legendsz-a/wildzones.shtml and https://bulbapedia.bulbagarden.net/wiki/Jaune_District
- Palworld building, lamps and torches: https://palworld.wiki.gg/wiki/Building and https://palworld.wiki.gg/wiki/Lamp
- Animal Crossing: New Horizons seasonal decoration: https://play.nintendo.com/news-tips/tips-tricks/island-holiday-decoration-tips-animal-crossing/

**References from general knowledge:** the Scarlet/Violet cutscene grammar (over-the-shoulder alternation, canned gestures, soft-background close-ups), the Tears of the Kingdom effects (memory tint, Gloom silhouettes, item close view, grass wind) and Animal Crossing's portraits, sitting villagers and worn paths come from general knowledge of those games. I found no pages that document them, so treat them as descriptions rather than cited facts.
