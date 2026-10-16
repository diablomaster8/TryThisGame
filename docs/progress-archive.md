# PROGRESS archive

Older session-log sections, moved out of PROGRESS.md on 2026-10-15 so a fresh session does not load 30k tokens of history. Newest first. Search this file; do not read it whole.

## B-C3: every side story runs; fun quests, props, keepsakes (2026-10-16)

Works:
- All 31 Grove side stories run (`sim/side-stories.ts`, rules in `side-rules-early/mid/late.ts`,
  the shared kit in `side-rule-kit.ts`): chapter windows and closes, step gates, every
  `_VARIANTS` scene chosen by its flags, scenes queued before and after steps, the holds the
  notes ask for (S30's last day and S31's Gourd Night hold the next chapter, S8's complete
  scene holds c11-close), and chapter 10's opening waits three story nights after c9-close
  (longer while S23 is moving) so S6, S14 and S23 have their window. "Chapter N begins"
  means its opening scene has played.
- Checks the sim watches on its own: waits and sits by their time words, `night:`,
  `chapter:N:end`, choices, talks with the Keeper named, visits, pets, feeds, shakes,
  crafts, races, placed decor or cosmetics, Moss's lantern walks (the Keeper near a post),
  and taps on story props. Everything else is the journal's "Do it".
- The campaign hooks the stories feed (`visitors`, `hushGarden`, `millLetter`, `cinder`,
  `wisp`, `s8Reunited`) are set by the scripts and read where the bible says; tests cover
  the lane scenes, S9's family count, the garden splice, the letter hand-over.
- CV1 left-overs: `s28-null-minder` while S7's Minder ticks, S27's spring scene on the
  first post-game morning, Wisp as a stray under the cottage step after `c10-bank-wisp`
  (`STORY.wispHome`), S6's Ember friendship. Post-game mornings now step the runner (S24).
- Props: eleven in `STORY_PROPS` (tuning) with names in strings; `sim/story-props.ts` says
  which stand; painted `prop-*` frames in `paint/decor.ts`, boxes in `render3d/garden.ts`
  (`storyPropModel`); pick kind `storyProp` sends a command that meets the matching step.
- Rewards: `grantRewards` on completion. Hats the wardrobe knows go to the inventory,
  flags are set, everything else is kept by id in `inventory.keepsakes` (save version 4)
  and listed in the journal under Memories; `storyTitles` for the profile.
- Fun quests Q1–Q65 (`sim/fun-quests.ts`, state in `campaign.fun`, journal "Capers"):
  each `when` text read as time of day, weather, season, weekday or market or festival
  day, chapter, the quests it follows and a few Grove facts; one offered at a time, a story
  day into a chapter, once only, never in chapters 9–11, Sunny behind the 18+ setting.
  They never write a campaign flag (a test checks every set).
- Line swaps in every band: `sceneFor(world, id, band)` applies the scene notes' swaps to
  the main lines or a Learning Grove band's (matched by line position), with band
  versions of the short inserts; `registerEduScenes` lets the edu chunk register its
  lookup (CV2), so the edu content stays out of the main bundle. New: S3's Fern line after
  S8, S24's kept-stone lines. Fixes a CV1 deadlock (a gate waiting on a scene the runner
  queued only after the gate).
- Tests: `side-stories-{early,mid,late}`, `story-rewards`, `story-props`, `fun-quests`,
  `line-swaps` over the driver in `tests/sim/side-driver.ts` (a chapter hold while a kept
  story moves). 331 pass; sim time is stepped directly, which is the ×100 run.

Stubbed:
- "Do it" verbs: minigame, find, walk (except lantern posts), carry, inspect, explore,
  escort, climb, build, puzzle, deliver, swim, write, tally, sneak, show, resolve, release,
  catch, listen, open, float, follow, develop, host, candle, collect, give, and `watch`
  without a time word.
- Fun-quest phrases the sim cannot see read as "any time": a shooting star, the murky
  stream, fruit gone missing, the morning after a storm, pears at the gate, bought from the
  shop; "karate unlocked" is always true; "race day" is any race run. Fun quests run in the
  campaign only (the Free Grove later). Market days are Wednesday and Saturday by the clock.
- Feature rewards (Nubbin Jobs, deep swim, rowing, the museum, the mill, river and
  snowfield sections, the Midsummer Cup, Clank as helper, night glide, Hazel's margin
  notes) are keepsakes only. Not built: Wisp's torn ear, Spindle's spiders, S29's Brock
  door, S30's after-talk lines, S31's ambient scenes, S24's lecture, S12's naming box.
  `c12-wall-garden` has no band versions (the main text is spliced). Places outside the
  Grove (the mill, the Tooth, the Workyard, the river, Clover's cottage, Fern's orchard)
  are scene text only. The props' look is unit-tested as data, not yet checked in the
  browser.

Assumptions: a "week" is three story days (`STORY.weekDays`); S2 opens the first morning
of chapter 3 (no "fruit left for Sable" fact exists); S15's market morning is any morning;
S8's three evenings of fruit are one night's "Do it"; midnight is 0.9 of the story day and
"frost" 0.95; `s31-sable30` is Sable's trust at 30 when Gourd Night begins.

Known bugs: none known.

## G13: the 3D stub list, one commit each (2026-10-16)

Checked on the stage and in Full 3D (`?free`, Graphics = Full 3D); shots `docs/samples/polish-*.jpg`.
Works:
- `pet` behaviour state (`BEHAVIOR.petMs`): `petNubbin` puts a free Nubbin into it facing the
  Keeper. The pixel clip stays `happy` with its hearts; the 3D rig holds the pet pose with the
  Keeper's right hand (`KEEPER_HAND_FROM_ELBOW` through the elbow bone) as `lookAt`, and the
  Keeper strokes for as long as the state lasts. On land the Keeper now walks to arm's length
  first; the pond's long reach applies only to a target pulled back to the shore. `polish-1`.
- Knees: the Nubbin's stubs and two new legs on the Mossling are two-segment `joint` legs with
  planted feet and short quick strides (the body crouches about 12% walking); bipeds tuck their
  knees on the happy hop. The Wisp hovers on its vapour skirt and has nothing to bend, so it
  keeps no legs (my reading of the brief). Variant looks that replace leg prims drop the joint.
  `polish-2`.
- Lids are shells that hug the dome and close by growing down it (`setLid(lid, k)`,
  `lidShell`): the old tilted cap let a tall eye's white through and bulged when shut. Fennel's
  eyes close asleep; Bolder's sleep drops the thighs level, sweeps the legs in and folds the
  knees so they tuck under. `polish-3`, `polish-3-fennel`.
- Hearts and Zzz are camera-facing quads (`glyphQuad`, depth-tested, turned in onBeforeRender).
  The stub's claim did not reproduce: Sprites were already hidden by an opaque body on the
  stage, so this is the form the brief asked for rather than a visible fix. `polish-4`.
- A thrown Nubbin rolls once about its side axis over the flight (`Actors.tumble`, the time
  from the sim's launch speed and height) and lands upright; `Rigged.lift` carries a held or
  flying body above the real ground so the shadow blob stays on the terrain. `polish-5`.
- Shoreline: direct input clamps to the shore as tap targets did (unit test in
  `world.test.ts`); with the Swim perk the 3D Keeper wades on the pond bed, at most
  `GROVE3D.wadeDepth` under the surface. `polish-6`.
- `visit:<trainer>`: `render3d/visit.ts` dresses a neighbour's Grove (grass round, three trees,
  a fence with a gate gap, the house with its roof in the neighbour's alignment colour); the
  crowd adds their Nubbins (`first-<band>-<type>` looks, or their line's recipe) and the host
  (pick `building`/`host`, as in the pixel view); the player's Nubbins and items stay home.
  `game.ts` passes the real location to the 3D scene now. `polish-7`.

Stubbed / known:
- The visit ground is one grass texture repeated and tiles visibly; the home terrain's blended
  surface is not reused. No ripple round a wading Keeper. The emote ball is still a Sprite.
- The pixel mode draws a wading Keeper as before; only the sim change (the shoreline) reaches it.
- The browser pane ran at about 1 fps, so motion (tumble, gait, petting) was judged from frames
  driven by hand with `grove.frame()`; smoothness on a real device is unverified.
- The shared working tree held another session's half-finished sim edits (`side-rules-late.ts`
  did not compile), so every gate and screenshot ran in the `.idx-check` export of HEAD plus
  this pass (`tests`: 219 sim tests pass there).

## 2026-10-16: content ratings (CV6 audience items)

**Works:** `Settings.matureContent` (`off` | `teen` | `adult`, default `off`) and `riftConfirmed`, save v3 with a migration (v2 saves get `off`/false; bad values clamp to `off`). `sim/audience.ts` holds the pure filter: Learning Grove offers only `all`; the main game offers `all` and `main`, `teen` at 13+ or 18+, `adult` at 18+; fun quests Q1-Q65 are blocked in chapters 9-11. Settings > Mature content control (hidden when the slot mode is `edu`). `confirmRift` command sets `riftConfirmed` and turns on 18+. `ui/rift-confirm.ts` is the one-time age dialog. Tests: `tests/sim/audience.test.ts`.

**Stubbed:** nothing calls `questAvailable` yet, because no fun-quest, Atlas or Multiverse offering engine exists (CV1/CV4 and later); `askRift` has no caller until the rift is built. Learning Grove comes from slot mode `edu` in the UI; the sim takes it as a parameter. Assumption: the rift confirmation lives in `settings.riftConfirmed`.

**Known bugs:** none known. Lowering the setting only hides quests; nothing stores quest progress yet to prove it end to end.

## 2026-10-16: B2 debug panel guard, B3 panel stack

**Works:** B2 was real: the debug panel mounted in the production build and opened on backtick or a triple-tap of the logo. It now mounts only when `import.meta.env.DEV` or the URL has `?debug` (`ui/hud.ts`); otherwise `debug` is null and both openers do nothing. Checked in `vite preview`: no `.debug` node without the flag, panel opens with it. B3: `ui/panel-stack.ts` keeps one full panel open at a time (menus, stats sheet, Journal; the newest wins) and refuses to open any over a running Expedition. Toasts take their row from the measured top-bar bottom (`--toast-top`), above panels, no pointer events. The Expedition counter now sits beside the close button. Checked at 375x812 in pixel and Full 3D (the HUD is shared DOM). Manual steps: `docs/device-pass.md` (no `tests/e2e/` yet).

**Stubbed:** no Playwright test; the checks are manual until G11 creates `tests/e2e/`. Story scenes, the away screen and celebrations stay outside the stack on purpose.

**Known bugs:** I could not reproduce the exact "counter under the close button" overlap at 375 wide (the old CSS had them on opposite sides); the new layout rules it out whichever way it arose. Assumption: this section sits after the Status block rather than at literal line 12, which is inside it.

## Side stories as a lazy chunk (2026-10-16)

Works:
- The side-story scripts (S1–S31 and their variants) are their own chunk,
  `src/sim/side-story-content.ts`. `story-scenes.ts` keeps the campaign scenes synchronous and
  adds the side stories through `registerSideStories`; `loadSideStories()` imports and
  registers the chunk once. `main.ts` starts the fetch while the title is up and awaits it
  before `boot`, so save.ts's queue filter knows every side-story id when a save loads.
- Tests register the chunk up front (`tests/setup-side-stories.ts`, a Vitest setup file);
  `tests/sim/side-story-chunk.test.ts` checks a queued `s9-ask` survives save and load.
  Checked in the browser too: a save queued on `s9-ask` boots straight into S9's scene.
- Main chunk: 2,022 kB → 1,304 kB minified (632 → 382 kB gzip); the side-story chunk is
  716 kB (250 kB gzip).

Stubbed / known:
- The index is still above the 1.14 MB it was before CV1: the remaining ~175 kB is the v2
  campaign script (`content/campaign-book1..3.ts`), which stays synchronous by design.
  Lazy-loading it the same way would bring the index near 1.13 MB.
- Code that runs before `loadSideStories` resolves sees an empty `GROVE_SIDE_STORIES`;
  today nothing does.

## 3D boot: terrain in a worker, the sky's first bake warmed (2026-10-16)

Works: the terrain's heights, normals and rock/dirt blend are sampled in a worker
(`render3d/terrain-worker.ts`; the samplers and `terrainArrays` moved unchanged to the pure
`terrain-shape.ts`, which `terrain.ts` re-exports). The mesh starts on a one-triangle
placeholder with the same attributes, so programs key as before, and the buffers are poured
in as a new geometry when they land. The sky's first PMREM bake linked four programs
synchronously in the first `setDaylight`: 70–115 ms (305 ms with the browser's shader cache
cold). `GroveSky` now compiles them with `compileAsync` at construction (reaching into the
pinned PMREMGenerator's internals) and holds a blank target of the same shape as the
environment until they link, then bakes (12–31 ms, no compile). `loadState` waits for both.
Measured on Maor's PC (dev build, preview, seeded free slot 3, frames driven by hand, three
warm runs each, HEAD vs this pass): constructor 393–407 ms → 189–261 ms (terrain mark
258–276 → 18–32 ms; props rose 92–95 → 132–193 ms, its height sampler is no longer warmed
by the terrain loop); first `setDaylight` 70–115 ms → 0. Look: two frozen views (11:00 and
18:30, windmill blades pinned, creatures hidden) are pixel-identical to HEAD; both builds
link the same 49 programs. Not done: props (grass placement) still on the page. Not
verified: the no-worker fallbacks; any phone. No new stubs or known bugs. The earlier boot
pass (textures in workers, compile ahead) is in `docs/progress-archive.md`.

## CV1: campaign v2, its sim changes and the side-story runner (2026-10-16)

Works:

- `config/story.ts` takes `CHAPTERS`, `SCENES`, `ENDINGS` and the speakers (Wisp, `chorus`) from
  `src/content/campaign.ts`. `UNDERSTUDY` is gone (fixes B1): the Keeper picked on the title
  only sets the player's portrait, and "you" is named You. Chorus lines show in italics with no
  portrait.
- `sim/story-scenes.ts` registers every campaign scene, every Grove side-story scene (S1–S31) and
  every `_VARIANTS` scene. `sceneFor` applies the line swaps from the notes: `c11-close` (S8's
  empty arm, the `s9-ask` evening line), `c12-open` (S26's walled garden spliced in), the S10
  letters with Open, the S6 register on loan and S17's nursery line. The dialogue box uses it.
- `sim/campaign-routes.ts` holds the scene-notes routing: chapter 4's tale, `c5-circuit` and
  `c5-considered`, `c5-sold`, `c6-open-walked`, the stillness parts, `c8-ledge(-s4)`, `c8-nova`,
  `c9-partner` and `c9-open-sold`, the four shard scenes, the whole Long Night, the chapter 11
  Moss add-ons, `c11-gate`, the chapter 12 foot and walk scenes, and `endingScenes` (body variant,
  then wisp, gate, visitors, mill, walk, cinder, told or secret, garden, then `-last`).
- The chapter 10 vigil (`stepVigil`, `STORY` in tuning): progress runs only while all four
  lanterns are lit; wave one blows out the stream lantern, wave two marks the Long-Grass one low;
  `c10-lull` halfway; `c10-falls` at dawn. No fail state. Moss leaves the world after
  `c10-bank-moss-gone` and `c10-moss-fades`; his flower goes by the flat stone.
- `endingFor` follows the bible: the Collector also comes from `keptStone`; Hazel's Grove ignores
  the final choice, and with `letThemGo` plays `end-hazels-grove-open`; `mossFaded()` includes
  "carried the stone in and did not come back".
- `sim/side-stories.ts` runs S5, S9, S10, S27 and S28: opening, step gates (story dawns and
  dusks), checks, variants, unfinished closes, S10's lapse and S9's jump to the dawn gate. The
  holds: S5 holds `c5-close`; S27 and S28's autumn steps hold chapter 9; `c11-close` waits for S9
  (or `keptStone`, or the dusk after `threeFriends`); S10's night holds chapter 12; S9's gate
  scene plays before `c12-open`; S10's letter plays before the ending.
- S27's buy-back (`applyChoice`, scene `s27-home`, pay or hat, only on the sold path) brings the
  `soldId` stray home, or sets it walking to the gate when the Grove is full. The runner path
  creates Nine as a grey stray.
- The journal lists the open side stories with their goal and hint, and a "Do it" button.
- Saves: old campaign saves gain the new fields; queued ids the v2 script lacks are dropped.
- Tests: `tests/sim/campaign-v2.test.ts` (25), including `endingFor` against the bible's order
  over every flag combination (1,000+), Open, the Long Night branches, each hold, the buy-back
  and the line swaps. The run driver moved to `tests/sim/campaign-driver.ts`.

Stubbed:

- Side-story checks the sim can't watch (carry, find, minigames) are met by the journal's "Do
  it". Places, props, items (old trowel, Hazel's lantern) and side-story rewards aren't built.
- Only these five stories run. The other `_VARIANTS` (S2, S8, S13, S19, S23–S26, S29–S31) are
  registered but not chosen. The campaign-side hooks those stories feed (`visitors`,
  `hushGarden`, `millLetter`, `cinder`, `wisp`) are read wherever their flags are set.
- `s28-null-minder` (needs S7), S27's spring scene, Wisp's stray spawn after `c10-bank-wisp`,
  and per-line voice clips (none exist yet).

Assumptions: a story day is `STORY.dayMs` (120 s) of sim time with dusk at 75%, since the sim
has no time of day of its own. `c5-circuit` plays straight after `c5-open` (the note's
fallback). S27 opens in chapter 6 rather than "the first Circuit visit". The vigil's wave
lanterns (`lantern-2` stream, `lantern-4` Long Grass) are a guessed mapping.

Known issues: the main bundle grew from 1.14 MB to 2.02 MB (minified), because the scene registry
bundles all the Grove side-story scripts. Lazy-loading them is a follow-up.

## Part G8b: matching the "Chao World" line-up (2026-10-16)

The reference is `docs/reference/chao-world-lineup.jpg` (the YouTube thumbnail, seven
figures left to right: quills, echidna, fox, dream, Eternal Neutral, shade, Eternal Moon).
Steps, newest first, one commit each:

**Split `nubbin-variants-special.ts` (no behaviour change).** The 1,132-line file is now three:
`nubbin-lineup-kit.ts` (394 lines: the shared helpers, exported), `nubbin-variants-lineup.ts`
(511: the six line-up looks as `LINEUP_LOOKS`) and `nubbin-variants-special.ts` (286: Eternals,
Shadow, and `SPECIAL_VARIANTS` spreading the looks in the same order). Checked by serialising all
ten variants (ids, order, every field, `patch` source) before and after: identical. Lint, tests
(228 pass) and build pass; the line-up URL still renders as `match-lineup.jpg` with no console
errors. Nothing stubbed, no new bugs. Commit c193b3c. The section "3D load: sculpt spec, geometry
cache, device grid, loading bar" (2026-10-16) moved to `docs/progress-archive.md` to keep this
file under 150 lines.

5. **The group shot** (`docs/samples/match-lineup.jpg`, plain stage). Two small stage flags:
   `&ids=a,b,c` in `sheetVariants` lines up exactly those variants (reversed inside, since the
   camera looks along +z and x runs right to left on screen, so the list reads left to right as
   written) and `&eye` puts a sheet's camera at the figures' eye height. View:
   `?aaa=1&creature=variants&ids=look-quills,look-echidna,look-fox,look-dream,eternal-neutral,look-shade,eternal-moon&toon&pose=happy&turn=29&eye`.
   Reads as the reference's line-up; the fox's eyes are shut by the happy pose (open in the
   thumbnail), and the stage's pastel grass and sky stay as the brief kept them. (The split of
   `nubbin-variants-special.ts` this slice flagged is done; see the entry at the top.)
   4f. **eternal-moon against slice 7** (`docs/samples/match-eternal-moon.jpg`). Flat indigo
   `#2e2660` armour, a blue crest panel down the crown between two small icy horns, white oval
   eyes under the happy arcs, icy shoulder spikes, a pale chest mark, a spiked ball, and lilac
   crystals standing round the feet (`crystalSpike` with glow, `footCrystals`, new; they replace
   `crystals`). No wings (the thumbnail has none). Still differs: the thumbnail's armour is
   a plated, textured surface with blue highlights where ours is flat indigo; its raised fists
   and wide shoulder spikes read clearly, ours are lost in the hop; its foot crystals are a
   dense jagged ring, ours a few cones; the crystals' glow does not show in toon mode.
   4e. **look-shade against slice 6** (`docs/samples/match-shade.jpg`). A near-black `#2c2a34` cat
   suit (a little lifted so the toon bands show), tall pointed ears with grey inner cones
   (`catEar`, new), three white spikes standing up behind the crown, white oval eyes with the
   white slash over the left, a small red mouth, arms folded across the chest (`foldedArm`,
   new), a white collar with a lilac diamond, white shoes on black legs, a spiked grey ball.
   Not the brief's cheek tufts: the thumbnail has none. Still differs: the thumbnail's
   figure is leaning and three-quarter, ours faces front; its ears are shorter and set
   further apart; the diamond is a rotated square, ours a lilac oval; the crown spikes sit
   at the back in the thumbnail, ours stand on top; the grey of the ball is lost (stage ball).
   4d. **eternal-neutral against slice 5** (`docs/samples/match-eternal-neutral.jpg`). A flat lime
   `#7ee02c` dragon with a yellow-green belly patch, salmon hands and toes (marks on the feet),
   a small crown spike and two small horns tipped salmon, white oval eyes with the happy ^
   (white marks under the arcs, as in the dream look), a gold chain (a torus collar plus a row
   of beads), no wings, scale back to the template's (the Eternals' 0.9 only made the stage
   crop the figure). `gloveArm` gained `hand` (glove size) and became a function declaration:
   the Eternals run `variant()` at import, before a `const` further down the file exists.
   Still differs: the chain should drape across the chest in a U, ours is a collar; the thumbnail
   body is wider and flatter with arms held out, ours has a rounder body and the happy pose
   drops the arms; the toes' gradient from green to pink is a soft mark; the pink ball is
   cropped (and the stage's ball is glassy); no scale ridges on the belly.
   4c. **look-dream against slice 4** (`docs/samples/match-dream.jpg`). Again not the brief's jester
   point: the figure is a flat magenta `#a82a8c` with an onion-shaped head (a wide dome and a
   narrow cone melted into it), tiny ear points, a gold horn on the forehead, big white oval eyes
   with the happy ^ across them (white ellipsoid marks under the arcs), a dark smudge on the
   belly, grey studded bracers (`braceletArm`, new), arms out and long pointed teardrop legs, no
   shoes. Still differs: the thumbnail's peak is lower and its head broader and flatter-bottomed;
   our ball is the stage's glassy pearl, not the reference's black one (the spec colour does
   not reach its material); the bracers' studs are two gold beads, not a row; the happy hop
   tilts the figure, which the still thumbnail does not.
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
6. **look-quills against slice 1** (`docs/samples/match-quills.jpg`, stage left, reference
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
   1–2. Toon stage mode (`&toon`) and the reference overlay (`&ref`): moved to `docs/progress-archive.md`.

## 3D boot: textures in workers, programs compiled ahead (2026-10-16)

Works: the Grove's ten painted textures paint in workers (`render3d/surface-worker.ts`,
`grove-textures.ts`; the painters moved unchanged from `aaa-styles.ts` to the pure
`samples/surface-paint.ts`). The scene gets the texture objects at once (one placeholder pixel,
the real settings) and the bytes are poured in as they land (dispose, new image, `initTexture`).
`render()` draws nothing until `compileScene` has linked the scene's and the post chain's
programs with `compileAsync` (KHR_parallel_shader_compile); `loadState` waits for both.
Measured on Maor's PC (dev build, preview, seeded Keeper + 8 Nubbins, frames driven by hand,
3 runs each): constructor 1.58–1.63 s → 0.41–0.59 s (textures were 1.1–1.2 s of it, now 2 ms);
first render 0.59–0.66 s → compile call 0.06–0.08 s + first frame 0.07–0.16 s; together
about 2.2 s → 0.57–0.81 s. Constructor start to veil lifted: 3.0 s → 1.5–1.6 s. Look: two
frozen views (11:00, creatures hidden) are pixel-identical before and after. Still paid: the
terrain heightfield (0.26–0.35 s) and props (0.1 s) in the constructor; two shadow-depth
programs and the OutputPass in the first frame; the sky's PMREM bake in the first
`setDaylight` (not measured). Not verified: the no-worker fallback (paints on the page, one per
task); any phone. No new stubs or known bugs.

## Part G8b, steps 1–2 (2026-10-16)

Moved from the "Part G8b" section of PROGRESS.md, which keeps steps 3 onward.

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

## 3D load: sculpt spec, geometry cache, device grid, loading bar (2026-10-16)

Works: each surface goes to a worker as plain data (`samples/sculpt-spec.ts`); hooks are
named rules (`sculpt-rules.ts`, row note in species-format.md). Workers read IndexedDB
(`render3d/sculpt-cache.ts`, key look#index@res, version = code hash + spec hash) and the
page writes in one batch after loading. `sculpt()` now welds before baking (17 MB cache, was 79) and fills far blocks of the grid (exact: tested on 852 surfaces). `settings.sculptRes`
comes from a boot benchmark (`sculpt-res.ts`, `SCULPT_RES`); saved creatures start in
`prewarm.ts` before the scene is built; a veil with a bar waits for every figure.
Measured on Maor's PC, hidden pane, frames driven by hand, Keeper + 8 Nubbins (7 looks):
before 4.2 s from first frame to all rigged (about 5.9 s from page start); now fresh device
(grid 104) 4.05 s and second load 3.17 s from page start; grid 64: 3.32 s and 2.95 s.
Every load still pays the scene constructor (1.65 s) and its first render (0.7 s).
Not verified: any phone. The phone grid (64) assumes a phone 4x slower; the done-when
(4 s fresh, 1 s second load on a 2022 phone) is not met on the page as a whole.

## Longer strides in the species format (2026-10-16)

New field `stride?: { length, period, duty }` on `SpeciesSpec` (row in
`docs/species-format.md`). Jointed legs: `length` scales the step from one leg length, the
hips crouch as far as its extremes need, `duty` is the planted share (below 0.5 a jog, less
crouch). Unjointed legs (every Nubbin) now report the stride their hip swing really covers
(2π · hip height · swing) and `length` widens the swing. `Rigged.strideLength` is in rig
units now (gait.ts was undercounting any spec with `scale` ≠ 1, the Nubbin by 0.78).
Keeper `{ 2.2, 0.7 s, 0.45 }`: 21% crouch, no slip, 2.45x its pace at KEEPER.speed (was
6.2x, capped at 4), 3.5 Hz. Nubbin `{ length: 1.3 }`: 1.8x at walkSpeed (adults 1.6-1.7x).
`maxCadence` stays 4: walking no longer reaches it, and Fennel (3.9x) needs it; the running
Keeper (4.4x) and Mossling (5.6x) still cap. Checked with side-view renders and a foot-slip
probe, not live in the Grove (the pane was hidden). Known: the pool's scale replaces
`spec.scale`, so a Nubbin draws 1.28 tall, not `GROVE3D.nubbinHeight`.

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

## Special forms after the "Chao World" line-up (2026-10-16)

Maor sent a line-up of seven character forms as the target ("get models closer"). The
looks are now built like toys in `nubbin-variants-special.ts`: `dress()` gives every look
bigger mitts and feet with gloves and shoes in their own colours; `roundEar`, `pointEar`,
`twinTail`, `bigQuills` (five rounded quills), `goggles` (strap and lenses), `crystals`
(glowing cone spikes on head and torso) and `chestMark` are the shared pieces. Fox: orange,
goggles, pointed ears, twin white-tipped tails, red shoes. Echidna look is now the rose-red
one: big round white ears, a white headband, white gloves, a green ball. Rose: pink with
round ears, red headband and bow. Dream: purple and magenta with a tall swept point, a pale
eye mask and a chest star. Quills: blue with five big quills, white gloves, red striped
shoes. Shade: a black cat with pointed ears, white cheek tufts and chest, slanted green
eyes. Eternal Neutral is a lime dragon (orange horns, claws, a long tail), Eternal Moon deep
purple with glowing lilac crystals, Eternal Sun as before with chunkier hands. Headbands and
the goggle strap hug the skull (torus radius 0.62). Shots: `variants-looks.jpg`,
`variants-eternals.jpg`, `variants-special.jpg`. Lint, 216 tests and build pass.

## Jewel facets (2026-10-16)

The last variant placeholders are gone. `facet` is a sixth surface detail kind in
`creatures.ts` (`paintDetail`): a jittered, seamlessly tiling lattice of cells, each a flat
plane with its own tilt so the baked normal breaks at every cell edge, and a bright line
along the edges; row added to the `SurfaceOpts` table in `docs/species-format.md`. The
seven `jewel-*` entries in `nubbin-variants-colour.ts` wear it at `scale` 0.55 (about four
facets per body unit; 2.4 read as glitter) with a hard clearcoat. Shots:
`docs/samples/variants-jewel-closeup.jpg` (`?aaa=1&creature=variant:jewel-ruby&closeup`) and
`variants-colour.jpg` re-shot. Lint, 216 tests and build pass.

## The full-3D mode, for real (2026-10-15)

**Graphics setting** (Pixel | Full 3D, default Pixel): a select on the title screen and in
Settings. It is a device-wide preference (`grove.graphics` in localStorage, read before any
save is open) mirrored into `settings.graphics` on load; changing it in Settings saves and
reloads. The pixel path is unchanged: `Game` takes `(canvas, hooks, graphics, scene3d)` and
only branches on `scene3d`; `main.ts` lazy-loads the 3D chunk. **`src/render3d/`:**
`Grove3dScene` (the WorldView members the Game drives plus `render`/`resize`): a heightfield
from GROVE's hills with the pond and stream cut in and a rim at the edge (`terrain.ts`),
slope-and-path blended material, 9 000 instanced grass tufts with `PUSHERS`, leaf-card fruit
trees from the sim's tree list (tappable), physical water for the pond, the stream ribbons and
the waterfall sheet, the cottage, school, dojo, well and windmill (sails turn), rocks, the
four lantern posts (same ids as the pixel scene, lit by the same rule), the bridge and the
cave mouth (`props.ts`); a Preetham sky with a PMREM environment re-baked when the sun moves
(`sky.ts`), sun elevation from the hour, lamps and fireflies at night, rain as the sample's
particles, bloom only below 16° (`GROVE3D.bloomBelowDeg`), SMAA. `CreaturePool` builds each
look once with `buildSpecies`, scales it to `GROVE3D.{keeper,nubbin,adult}Height` and reuses
rigs; `Actors` maps behaviour states to poses (held/carried/petted → `pet`, nap → `sleep`,
eat, play/greet/court/perform/fetch → `happy`, moving → `walk`), eggs and cocoons as shells,
fruit/toys/notebooks as props, memorial flowers, the pixel emote ball as a sprite over the
head, a highlight ring and tap sparkles. Lakitu camera: the OrbitCamera's yaw snaps and two
zoom levels map to orbit and `GROVE3D.distance`, eased, never under the ground; ground taps
ray-march the heightfield (`Picker3d`); creatures pick by sphere. Screenshots
`docs/samples/mode3d-{noon,golden,title}.jpg`. **Frame time on this PC** (1024×768, dpr 1,
gl.finish loop; the browser pane pauses rAF while hidden so the FPS counter is not usable
there): 2.9 ms full, 1.6 ms without shadows, 1.4 ms without water, 1.6 ms without grass.
First builds on the main thread: Keeper 2.8–4.1 s, child 1.1–1.6 s, base Nubbin 1.1–1.5 s
(the known stall at first load; worker sculpting is the next step).
**Stubs** (each logs `[3d stub] …` once): `species:<id>` (pocket and digital lines draw as
the base Nubbin), `form:<band-type>` (no variant found), `look:shiny-or-tone`, `pose:sad`
(cry), `pose:swim`, `item:toy` (every toy a red ball), `weather:snow` (falls as rain),
`dungeon:floor` and `location:<hollow|corvin|dungeon>` (a bare dark floor under the Grove
sky), `event:tilePainted`, `event:decorPlaced`, `event:treeShaken`, `event:landed` (no
bursts), `npcs`, `strays`, `plants`, `decor:placed`, `tiles`, `grove:<sun|moon>` (main
colours). **Known limits:** no camera shake in 3D; walking feet slide (sim speed and stride
differ); the Hollow has no rooms; the sim's ground is flat so hill-top taps land a little
short; no device pass yet. One sim touch: `Settings.graphics` with its default and
migration.

## Variants after the references (2026-10-15)

Maor supplied three reference pages (the neutral evolution chart, a filled-gardens shot and
a community tier list) and approved the four-step pass plus the pixel palette. Type colours
corrected in `TYPE_COLORS` (`nubbin-variants.ts`): Normal cyan, Swim green, Fly pink, Run
blue, Power orange-red; `adultColors` in `render/sprites/chao.ts` realigned the same way (Sun
forms pale with the hue in the shade, Moon forms dark with the hue in the body). Type tells:
`applyType` now sets the crown and adds quills (Run), a crest with side fins and flipper arms
(Swim), a long crown with bigger tinted wings (Fly), horns with a wider body (Power); `accent`
colours the tells and `mixHex` blends hues. Sun forms keep a white body with pastel accents,
Moon forms a black body with deepened accents and slanted eyes (`bandColors` in the first
family file). Second evolutions blend the two type colours (0.4 toward the second) in place of
the belly patch. Special: the Eternals retuned (swept crown and a green cast; navy with quills
and horns; cyan-green crest) and six modelled looks (fox, echidna, rose, dream, quills, shade)
replace the four palette placeholders, so only the seven jewels remain placeholders (flat
gloss). Tests: the tells, `mixHex`, and a geometry sanity sweep over all 116 variants.
Screenshots re-shot: `variants-first.jpg`, `variants-second.jpg`, `variants-special.jpg`.
Same day, at Maor's "fix it": the blend raised to 0.55 with the half-strength tells in the
second type's own colour, and the Sun accents lifted only 10% toward white, so both read on
the sheets; `variants-first.jpg` and `variants-second.jpg` re-shot. Lint, 216 tests and build pass.

## The Nubbin variants as specs (2026-10-15)

Part G8. `src/samples/nubbin-variants.ts`: `variant(base, name, overrides)` deep-copies a
spec and changes only what the overrides name: colours by role (every colour the base uses
is swapped, and a variant of a variant works because each derived spec remembers its
palette), the crown (`point`, `tall`, `hook`, `fin`, `stub`, `droop`, `none` or custom
prims), the ball and wings (merge, or `null` to remove), the four part slots, hint marks,
the type silhouette (`type` at full strength, `second` at half: head fins, bigger wings,
longer legs by lifting the body, a wider body and bigger hands) and a `patch` hook. Two spec
fields added with rows in the format doc: `ball.shape` (`halo`, `spikes`) with `ball.glow`,
and `wings.shape` (`feather`, `bat`). Templates: the child (neutral, Sun-leaning and
Moon-leaning as colour hints), the Sun adult (white and blue, spire, halo, feathered wings),
the Moon adult (black and purple, hooked crown, spiked ball, bat wings), the Neutral adult
(mint, nodding crown). Families: `nubbin-variants-first.ts` (15), `-second.ts` (60: a first
evolution with the second type at half strength and a belly patch in its colour),
`-special.ts` (three Eternals with custom crowns and a glassy finish, the Shadow stray, four
character looks), `-colour.ts` (7 egg colours × plain, two-tone and shiny, plus 7 jewels);
`nubbin-variant-catalogue.ts` lists them (114 ids, unique by test). Stage:
`&creature=variant:<id>`, and `&creature=variants&family=…&filter=…&max=…` lines a family
up in staggered rows of eight with the camera rising per row and capped before the hills.
Screenshots `docs/samples/variants-{templates,child,first,second,special,colour}.jpg`.
**Placeholders:** the four `look-*` entries (palette only, no head accessory yet) and the
seven `jewel-*` entries (a flat gloss; no facet detail kind yet). **Known limits:** two
palette roles sharing one colour value swap together (Sun Fly sets its belly and sheen apart
for this); the type silhouettes are first approximations by eye, not yet tuned against
references; a 28-figure sheet sculpts for about a minute. Lint, 215 tests and build pass; no
console errors on the sheets.

## The Keeper in the species format (2026-10-15)

`src/samples/keeper-spec.ts`: `keeperSpec(colours)` builds the Keeper as a `SpeciesSpec`;
`KEEPER_SPEC` (Sun) and `KEEPER_MOON_SPEC` are the same figure in two colour sets. Proportions
from `sculptedKeeper` (head about 39% of the height, soft and friendly); jointed arms
(`elbowL`/`elbowR`) and legs, hands with four fingers and a thumb, hair as sculpted tufts with
goggles pushed up on it (a torus band and two lenses), and the outfit after the three
kid-adventurer references Maor sent mid-pass (tee under an open vest, shorts, wristbands,
chunky sneakers) as colour splits between primitives plus crisp marks. Format additions:
`SpeciesSpec.poses` (a species' own pose functions over a `PoseContext`: `set`, `bend`, hips,
head, look, mouth), `SpeciesSpec.hearts`, the pose names `carry` and `throw` (stock: stand;
`ALL_POSES` has all eight, `POSES` stays the creature cycle), and elbow joints on arms. The
Keeper's own poses: pet reaches to `lookAt` with the right hand and strokes; carry is a hug
hold; throw is a 3.6 s cycle (`KEEPER_THROW`); sleep sits cross-legged and nods off; idle and
walk are stock. Stage: `?aaa=1&creature=keeper` (or `keeper-moon`) puts the Keeper beside a
Nubbin that answers each pose (leans to the hand, rides in the arms, flies the arc and lands,
eases back home). Screenshots `docs/samples/keeper-idle.jpg`, `keeper-pet.jpg`, `keeper-45.jpg`.
Lint, 215 tests and build pass; no console errors on the Keeper stage. Stubbed: the Keeper is
not in `ROSTER` or the pixel game. Known: the thrown Nubbin stays upright (no tumble) and its
shadow blob rides with it in flight; the Keeper's contact points are the standing soles, so a
posed foot is not re-planted (fine for the sit, which is flat).

## Crisp marks, reference notes, format doc (2026-10-15)

Item 35 of `docs/creature-improvements.md` and the format doc. `Mark.soft: 0` is a crisp edge: `markShade` now takes the
sculpt's vertex spacing (the box's longest side × 1.08 over the grid, the same number
`sculpt` uses) and ramps a zero-soft mark over one cell centred on its edge, so a face
patch, sock or belly split reads sharp without stair-steps. Fennel's nose and chest patch
use it (`docs/samples/marks-fennel.jpg`, `?aaa=1&creature=3&closeup`). `SpeciesSpec.notes`
(optional string, never shown) records which reference frame and pass each species was
last tuned against; filled for all five from the 2026-10-15 passes (the Palworld roster
screenshot for the shape pass, the All Pet Animations video for eyes, petting and the
walk). `docs/species-format.md` rewritten: one row per field of `SpeciesSpec`, `PartSpec`,
`Prim`, `Mark`, `SurfaceOpts`, the eyes, the mouth and `Expression`, each with its default
and an example, plus the stock expression table and the pose table. Lint, 210 tests and
build pass; no console errors on the Fennel closeup.

Not verified: the crisp edge on the other species (none uses `soft: 0` yet) and at the
far camera distance, where one cell is under a pixel. Known: the closeup frames the face,
so the chest patch is only half in `marks-fennel.jpg`.

## Shape pass: digits, per-form blend, tufts (2026-10-15)

Items 9–15 and 32. New: `Prim.blend` (a primitive's own blend radius, in `sculpted.ts`;
`onSurface` honours it too) and `src/samples/species-kit.ts` (`digits`, `tuft`, `tuftRow`).

- **Nubbin.** Before: feet and hands were blobs. After: three yellow toes and a pad on each
  foot, a three-finger mitt on each hand, a crisper crown (blend 0.14 against the body's 0.22).
- **Mossling.** Before: the cap overhung and could hide the eyes in nods. After: cap radius
  1.2 × 1.05 (was 1.4), raised 0.12 and set back 0.2 (`CAP_Z`), rim and sprout crisp; dew
  and gills follow it. Root toes and hand mitts come from `digits`.
- **Fennel.** Before: small head, close-set eyes, fuzzy cheek cones. After: head radii 0.78 ×
  0.68 × 0.66 (was 0.64 × 0.56 × 0.56), eyes wider (x 0.36) and lower (y 1.78), ears
  spread, crisp cheek, crest, chest-ruff and tail-tip tufts (`tuftRow`), three toes and a
  pad per paw. Shells remain for the short underfur.
- **Bolder.** Before: 0.9 scale, a leg span wider than the whole line-up, a seam between
  head and thorax. After: scale 0.72 (big by design: widest, not tallest), the head's
  ellipsoid also sits in the torso sculpt so the thorax blends into it (no seam), horns and
  palps crisp (0.04), two-toed claws from `digits`.
- **Wisp.** Before: the core ellipsoid lay inside the body and never showed. After: it sits
  on the belly, poking 0.27 through, plus a mesh with its own emissive material (pulsing,
  not tone-mapped); glowing three-finger hands.
- **Tried and dropped:** repeating the thorax in the head sculpt for the neck made the
  horns vanish; the torso-side fillet alone does the job.
- **Grove unit** is the standing Nubbin (about 2.7 world units tall). Scales are by eye
  against that; the roster line-up is `docs/samples/shape-roster.jpg`.
- Screenshots: `docs/samples/shape-<name>.jpg` (turn 30°) and `shape-roster.jpg`.
- Not verified: every pose at all three angles by eye (done for idle, happy and the 0, 30,
  45 and 90 degree turns on a subset); no device test. At turn 30 Fennel's far brow juts
  past the cheek (pre-existing).
- `npm run lint` and the `tsc` half of `npm run build` fail on `src/content/atlas-a01.ts`
  and `atlas-a06.ts`, untracked files from the content sessions (not mine, not committed);
  `eslint src/samples`, `npm test` (210 pass) and `vite build` are clean.

## Eyes that look (2026-10-15)

Item 3 of the brief: the irises follow. `eye()` returns `iris` (the disc in its own group;
the catchlight stays in the eye group as a reflection). In `buildSpecies`, each frame every
eye takes `Rigged.lookAt` in its own frame and eases its iris toward it at 6 per second,
at most 0.22 of the eye radius, dropping with the dome so it never floats; per-eye aiming
makes the pair converge on a near point. With no `lookAt` the iris wanders slowly.
`lookAt` already existed (null or a Vector3, head turn still gated to the `pet` pose); the
stage now sets it to the camera for closeup and lineup views. Check:
`?aaa=1&creature=1&closeup&pose=idle&turn=30`, `docs/samples/look-nubbin.jpg`. Lint,
210 tests and build pass. Not checked: the other four species by eye.

## Petting, sleep and the life pass (2026-10-15)

Items 23–28 of `docs/creature-improvements.md`, after the Palworld "All Pet Animations"
reference. A `pet` pose: the creature turns to `Rigged.lookAt` (the stage sets it to a
hand in front of the camera), leans the head in with a tilt, shuts the eyes into arcs,
folds its ears back, wags, and seven painted heart sprites (canvas textures, no assets)
rise and fade from the crown. Squash and stretch on the happy hop (hips 1.06/0.94 at the
top, 0.94/1.06 on landing, the hips moved so the feet stay planted) and a forward head
stretch on the eat chomp. Breathing is a chest scale (1.5% at 0.25 Hz; the torso now
sits in its own `chest` group so the head and feet do not move with it), slower and
deeper asleep. Sleep lies down fully: the belly drops to the grass (measured from the
torso sculpt), quadrupeds fold their legs with the knees bent, bipeds curl over theirs,
and a Zzz of three painted glyphs drifts up every 3.2 s. `Rigged.face(yaw)` eases the
facing over 0.4 s with a lean into the turn; the stage calls it every frame (the pet pose
turns each creature to the camera and back) and `groveStage.turnTo(deg)` turns the
line-up from the console. Ear flicks fire at irregular intervals from a generator seeded
by the species name; the happy tail curls up over the back. Pose timing now runs on the
stage clock (`setPose` compared `performance.now()` with the stage's relative `t`
before, so every ease-in started a fraction late). Screenshots:
`docs/samples/pet-roster.jpg`, `sleep-roster.jpg`, `pet-nubbin.jpg`. Format doc updated.

Stubbed: the sim has no `pet` command yet, so the pose is reached only on the stage
(`&pose=pet`), and the hand is a point in front of the camera, not a Keeper. Known bugs:
Fennel's lids do not cover its eyes asleep (they turn the stock 1.9 rad but sit higher
than the Nubbin's; the same before this pass); Bolder's folded legs fan upward rather
than tuck under; the hearts and Zzz are plain sprites, so a creature standing between
them and the camera does not hide them.

## Knee joints and planted feet (2026-10-15)

Item 22 of `docs/creature-improvements.md`: the walk rotated whole legs at the hip, so
the feet slid. Now a `PartSpec` may carry `joint: { name, pivot, prims, box }`, a lower
segment sculpted on its own and hung under the part's bone (`kneeFL`.., `kneeL/R`,
`knee1L`..`knee4R`). Each jointed leg's foot is the lowest vertex of its shin; the walk
keeps the foot still for the stance share of the cycle (0.6, spiders 0.5) while the
body advances, then swings it forward on an arc, with hip and knee solved together
(two-bone, bending about the rest chain's plane) and a crouch sized so the step's
extremes stay in reach. `Rigged` exposes `strideLength` and `stridePeriod`; the stage
moves a `&pose=walk` creature at that speed and the camera walks with it, lapping every
ten units. Each placed foot is also checked against `ground` so a slope cannot swallow
it. Fennel and Bolder are ported (knee a touch behind the line on a front leg, ahead on a
hind leg; Bolder's knee ball in both segments). Checked in the browser by sampling every
foot's world position per frame: Bolder's eight feet move under 0.0005 units per frame
while planted with the body moving 0.024; Fennel's the same in the fast-frame bursts the
pane managed. Shots: `docs/samples/walk-fennel.jpg`, `walk-bolder.jpg`.

**Stubbed:** the Nubbin, Mossling and Wisp keep the hip-only swing; knees stay straight
in the other poses (sleep and happy would look better folded). **Known:** the browser
pane runs this stage at 3–15 fps, so its frame gaps can hold a whole swing; a frame
longer than 0.5 s is clamped by the stage and lets the feet creep by that much. The sim
does not yet drive the body by the stride (the 3D mode is not wired to the sim).

## Story pack moved into the repo (2026-10-15, Task B0)

- Works: `Stories/` moved by `git mv` to `src/content/`, `tests/tools/content-check.ts` and
  `script-book.ts`, `script-book/`, `voiceover/`, and `docs/` (atlas, canon, more-stories,
  fix-changelog, grove-backlog-prompt, briefs, logs). The 11 duplicate tools were identical
  and dropped; the pack's CLAUDE.md, plan.md and README.md were dropped (already folded in).
- Backlog prompt steps 2–4: index in `docs/content-index.md`; the no-chores rule was already in
  CLAUDE.md. Step 5 (the "Already have" audit against the code) is left for CV1.
- Known bugs, reported 2026-10-13 and not re-checked: **B1** the understudy swaps the speaker
  but not Keeper names in the text; **B2** the debug panel in production (`ui/hud.ts` now has
  a `DEV` guard nearby, verify); **B3** panels overlap (Journal over stats sheet, toasts over
  the HUD on portrait, Expedition counter under ✕).

## Grounding verified (2026-10-15)

Items 29, 30, 31 of `docs/creature-improvements.md`, checked in the browser (plan.md Part 1).
What was wrong and what changed:

- The grass vertex shader did not compile: the push loop's bound was empty (`i < ;`, a
  `${}` lost to a shell heredoc), so no grass drew at all. Fixed; the push is now a true
  world-space offset (it used to scale with the blade's instance scale squared).
- The slope tilt used the default XYZ Euler order, so pitch and roll turned about the
  world axes after the yaw. The root now rotates `YXZ`. The signs were right: a higher
  front pitches the nose up (checked numerically on the stage).
- The blob sat below the sampled ground and was a flat card, while the terrain curves up to
  0.07 across a footprint and its mesh is a chord up to 0.035 above the height function:
  it z-fought, floated on one side or was cut off on the other. It is now an 8×8 grid
  pinned flat in world space whose vertices take the ground height under them plus 0.05.
  It lightens to about 0.85 on the hop and 0.6 under the hovering Wisp, and shrinks.
- Feet: the specs' lowest points are not at y = 0 (Bolder's leg tips 0.2 below, Mossling
  0.03 above, Nubbin 0.05 below), and a plane through four probes misses the curvature
  under a wide belly or a wide leg span. `buildSpecies` now measures the figure at rest:
  the lowest vertex per 0.3-unit cell of the ground plan is a contact point, and each
  frame the root drops until the lowest contact point (carried by yaw and tilt only, so a
  hop still leaves the ground) sits 0.02 into the grass. Measured sink on the single stage
  at turns 0–270°: 0.02 for Nubbin, Mossling and Fennel, 0.027 for Bolder (its idle roll),
  the Wisp hovering 0.45 above.
- Bolder's idle leg sway is lift-only now; the dip put its tips 0.13 into the ground.
- `window.groveStage` exposes the stage (scene, cast, creature, groundHeight) so a console
  can measure creatures in place; the checks above were done that way.
- Left for the knee-joint pass: on bumpy ground a rigid body touches at its lowest point
  and the other feet can float a little; the Wisp's light trail dips under the ground.

Shots: `docs/samples/ground-roster.jpg`, `ground-fennel.jpg`, `ground-wisp.jpg`.

## Painted look (2026-10-15)

Items 16, 17, 18, 20, 21 of `docs/creature-improvements.md`, on every creature at once.

- `sculpt()` bakes ambient occlusion into the vertex colours (`ao` option, on by
  default): four probes out along the normal measure how much the field closes in, and
  creases go up to 55% darker. Fur shells share the geometry so the fur darkens too.
- Speckle: the Nubbin's two fine shell layers (cell 220) were the salt-and-pepper; a Chao
  is smooth, so the Nubbin has no shells now, a lower detail amount and a matte, velvety
  surface (roughness 0.66, sheen 0.7, no clearcoat). Fennel's fur grain is calmer under
  the shells (amount 0.4, bump 0.4).
- Fur tips are lit lighter and warmer in the shell shader.
- The creature stage grades at saturation 1.05 instead of 1.2 so the grass stops
  washing the creatures.
- Shots: `docs/samples/paint-nubbin.jpg`, `paint-fennel.jpg`, `paint-roster.jpg`.

## Face group on the Nubbin (2026-10-15)

Maor: "make a full list of improvements ... use the references I sent you as a bible"
→ `docs/creature-improvements.md` (35 items, six groups). Then "do it for one and then
report back": the face group (items 1, 2, 4, 5, 6, 7) on the Nubbin.

- `eye()` now returns an `EyeRig`: upper lid, a lower lid hinged from below (squint),
  an upturned lash arc shown over a closed happy eye, and a brow ridge (skin colour,
  tilts and lifts). The iris and white carry a little emissive so eyes stay bright in
  shadow.
- `species.ts`: an `Expression` per pose (lid, squint, brow tilt, brow lift, arc) with
  defaults (`EXPRESSIONS`) and a per-species `expressions` override; eased in over 0.3 s
  (1.2 s for sleep). Happy = eyes shut into ^ ^ arcs, squint, brows soft; eat = squint
  and knitted brows; sleep = shut, brows dropped.
- `mouth.shape`: `smile` (default), `o`, `omega` closed shapes; the closed shape gives
  way to the open ring past 30% open.
- Nubbin: blush marks under the eyes.
- Shots: `docs/samples/expr-nubbin-idle/happy/eat/sleep.jpg`, `expr-nubbin-happy-35.jpg`.
- Fix (Maor: happy frames "look weird"): the lids over the dome left the iris peeking out
  under a floating arc. A happy shut eye now hides the whole eyeball and lids so the
  head's skin shows, and the lash arc sits on the skin (`EyeRig.ball`).
- Fix (Maor: "fix the mouth too"): the open mouth was a 3D interior sphere, a flipping
  lip ring and a tongue blob, which at 0.2 units read as a scribble. It is now drawn on
  the skin like the reference: a dark half-disc opening under a straight upper lip that
  grows downward with the open amount, a rim, a tongue half-disc and flat teeth.
  `expr-fennel-happy.jpg` shows it with teeth.
- Still open in the face group: eye tracking (item 3). The other four creatures get the
  same rig automatically but have not been tuned (brows on Bolder/Wisp may want hiding).

## The whole roster in the species format (2026-10-15)

Maor: "keep going on fixes for the whole batch of 5 as next sample". Mossling, Bolder and
Wisp now come from specs too (`src/samples/species-roster.ts`, `ROSTER` = all five), so
every creature has the anchored round eyes, a modelled mouth in the skin and the five poses.

- Builder additions in `species.ts`: a part can have its own `surface`, extra `shades`
  and `noFur`; `face: 'torso'` puts the eyes and mouth on the body (Mossling's cap is its
  "head", Wisp's flame crown too); `eyes.extra` adds small bead eyes set in the skin
  (Bolder's row of six); gait `spider` (legs `leg1L..leg4R`, weight-shift idle,
  alternating-tetrapod walk, front legs raised to eat, tucked to sleep); gait `hover` bobs
  the hips at `hover` height; `extras(rig)` hangs hand-built decorations (dew, gills,
  leaves, spores; mandibles and the ember light; the smoke shell, motes, ring, trail,
  inner light) and returns a per-frame update.
- Stage: every `&creature=N` builds from `ROSTER`; `&creature=all` lines the five up
  facing the camera (`&pose=`, `&turn=` still apply). `buildCreature` (hand-built) is no
  longer used by the stage but stays in `creatures.ts` as reference.
- A stale-console lesson: the browser pane keeps console errors across page loads, so an
  old shader error (the `uCell` one) looked current. Reload and read the tail of the log
  in order before chasing it.
- Shots: `docs/samples/roster-idle.jpg`, `roster-happy.jpg`, `face-mossling.jpg`,
  `face-mossling-happy.jpg`, `face-bolder.jpg`, `face-bolder-walk.jpg`, `face-wisp.jpg`,
  `face-wisp-40.jpg`.

## Faces anchored to the surface, round pupil eyes (2026-10-15)

Reference: Maor's Palworld pet-animation video (Tanzee, Foxparks, Chikipi, Teafant frames).
What the reference shows: round eyes sitting proud of the face, a big iris that is mostly
dark pupil with a thin white ring around it, one bold catchlight, hardly any liner, and a
tiny mouth drawn in the skin low on the face.

- `species.ts` `onSurface(prims, blend, from)`: walks the head's signed distance field to the
  nearest surface point and its normal. Eyes and the mouth are placed there and aimed along
  the normal (eyes pulled 45% toward straight ahead), so nothing floats or sinks whatever
  the head shape. Spec `eyes.yaw`/`pitch` and `mouth.pitch` are now extra tilt only.
- `creatures.ts` `eye()`: a flattened dome eyeball with its centre behind the face; the iris
  and the catchlight are discs of concentric rings bent onto the dome (a flat fan hid behind
  the dome, found with a red-disc test), a thin liner at the top rim, lid as before; new
  `tall` parameter (1.2 default) replaces the fixed 1.45 almond.
- `irisTexture`: 128 px, pupil to 56% of the iris with a soft edge, iris ring lit from below,
  two catchlights.
- `buildMouth`: lip line half-buried in the skin; the lower lip is hidden when closed and
  offset so it no longer z-fights the upper one (the "falling off" flicker).
- Data: Nubbin eyes r 0.25, irisScale 0.8, lid 0.12, tall 1.12, mouth width 0.2; Fennel
  eyes r 0.21, irisScale 0.8, tall 1.3, mouth width 0.2.
- Shots: `docs/samples/face-nubbin.jpg`, `face-fennel.jpg`.
- Fix (Maor: "mouth on fox is off"): the Fennel mouth point sat under the muzzle, so the
  projection landed on its underside facing down. It now starts ahead of and below the
  muzzle tip and lands on the tip's front underside, with a dark nose mark above it.
- Angles (`&turn=<degrees>` on the stage): at three-quarter and side views the eye domes
  stood off the head, so the dome now sits deeper (centre 0.42 r behind the skin, 0.28 r
  proud) and aims only 22% toward straight ahead; liner shrunk to the visible rim. Shots
  `face-fennel-45.jpg`, `face-fennel-side.jpg`, `face-fennel-happy.jpg`, `face-nubbin-40.jpg`.

## The species format: rig, poses, marks, mouths, directional fur (2026-10-16)

Maor: "what other improvements can we make before we apply it to others" → the list
(poses and a rig, markings with intent, mouths that open, directional fur, grounding,
material tuning, eye tracking), then "go". Built the first four on the Nubbin and
Fennel as templates, and the format the roster will be written in.

- **`src/samples/species.ts`**: a `SpeciesSpec` describes a creature as data (torso,
  head and limb parts as blended shapes with pivots and bone names, surface, fur and a
  fur rule, baked shade, marks, colour rules, eyes, mouth, wings, the ball). The
  builder sculpts each part, hangs it from its pivot (the head and limbs from the
  hips), adds eyes and a modelled mouth to the head, shells the furred parts, and
  returns a `Rigged` creature with `setPose()`.
- **Poses**: idle, happy (hop, arms or front legs up, open mouth), walk (alternating
  legs, counter-swinging arms or diagonal pairs, a bob), eat (head down, hands to the
  mouth, chomping), sleep (lies down, lids close, slow breathing). Blinks, ear
  twitches, wing flutter and the ball run on top. The stage cycles them every few
  seconds; `&pose=happy` holds one.
- **Mouths**: a dark interior that opens, a tongue and (for Fennel) teeth that appear
  as it does, a lip that lifts. Lids are now half-shells hinged at the eye, tilted back
  by the species' lid amount and swung down to blink or sleep (the earlier scaled cap
  never covered the eye).
- **Marks with intent**: shapes with a colour and a soft edge, baked per vertex: the
  Nubbin has a heart on its belly, a star on its brow and a crown that darkens to the
  point; Fennel a mask across the eyes, a chest patch and a tail ring.
- **Directional fur**: the sculptor bakes fur length and growth direction as vertex
  attributes from a rule (long on the ruff, chest and tail; short on the muzzle and
  legs; combed down and back) and the shells follow them (`FUR_DIR` define) instead
  of puffing straight out.
- **`docs/species-format.md`** documents the format and how to write a species; a
  Chao-line evolution is meant to be a small diff on the Nubbin spec.
- `?aaa=1&creature=1` and `&creature=3` now come from the specs; Mossling, Bolder and
  Wisp stay hand-built until ported. Screenshots: `docs/samples/pose-*.jpg`.

**Eyes and mouths, redone against the reference** (Maor: "the eyes look nothing like the
image I provided … the mouth also looks like its falling off"). The eye is now set
into the face: a flattened eyeball sunk into the head with only its front showing, a
tall almond, the iris disc filling almost the whole eye, a dark liner hugging the
top lid (thicker toward the outer corner), a faint lower line, a soft wet highlight
across the upper eye, and the hinged lid tilted well back at rest. Eyes are bigger
and tilted to follow the face (`pitch`). The mouth sits in the surface: a thin lip
line on the face, the dark interior behind the surface so it only shows as the mouth
opens, the lower lip dropping into a ring, the whole mouth tilted down and out to
follow the face (`pitch`). Shots: `pose-nubbin-idle/happy/sleep.jpg`,
`pose-fennel-idle.jpg`.

**Still to do from the list**: grounding (contact shadows, grass parting), material
tuning per species, eyes that track a point, and then the port of the other three
and the Keeper.

## Five creatures at a modern-console finish (2026-10-15, for Maor's pick)

Maor, with a Palworld roster screenshot: "do the character animation this detailed.
provide 5 samples." `?aaa=1&creature=1..5` (`src/samples/creatures.ts`) puts one
creature on the AAA stage, framed close and idling; screenshots in
`docs/samples/creature-*.jpg`.

**How they are made.** Each is a sculpted single surface (`sculpted.ts`, now with
round cones and tori as primitives) with:

- a surface detail map projected along the three axes (no UVs): fur strands clumped
  by a slower field, scales, leaf veins, riveted armour plates, or a smooth grain;
  each gives albedo grain and a normal map through a small injection into three's
  physical shader, on top of the vertex-colour regions;
- big cartoon eyes built from a white, an iris, a pupil, two catchlights and an upper
  lid of body colour that sets the expression;
- articulated pieces hung from pivots (ears, tail, cap, wings, motes) that
  idle-animate, plus a breathing scale on the body;
- material per species: velvet sheen for the Nubbin, full sheen for fur, clearcoat
  for shell and cap, emissive glow where the `glow` vertex attribute is set (ember
  seams, the Wisp's core).

**The five**

1. **Nubbin** (`creature-1-nubbin.jpg`): the Chao-faithful hero, velvet-smooth,
   yellow tips, wings that flutter, the ball bobbing.
2. **Mossling** (`creature-2-mossling.jpg`): a round sprout with a pale belly under a
   spotted mushroom cap that tilts, a collar of leaves that stir.
3. **Fennel** (`creature-3-fennel.jpg`): a fox pup, orange fur with a cream bib and
   muzzle, tall ears with pink insides that twitch, a bushy tail that sways.
4. **Bolder** (`creature-4-bolder.jpg`): a six-legged beetle in riveted blue-grey
   plates with two horns, mandibles that work, and ember seams that glow.
5. **Wisp** (`creature-5-wisp.jpg`): a hovering violet spirit with a glowing core,
   wisp arms and flame tips, a tail that trails, motes orbiting, a light of its own.

**Second pass** (Maor: "getting much better but still not there"). What was flat is now
baked and layered: a top-to-underside light gradient and markings (stripes, spots)
baked into the sculpt colours through a `shade` hook; shell fur on the fox (the body
drawn ten more times, each shell pushed out along the normal and thinned by a 3D
hash, so the silhouette breaks into strands); painted anime irises (limbal ring, lit
crescent, radial streaks, two catchlights) on a disc under a glossy cornea; a cool rim
light on the stage; and a lot more secondary shape per creature: a ruff of fur tufts, a
head crest, dark socks, striped back and tufted tail on Fennel; moss tufts, root toes,
gills under the cap, a sprout and nine collar leaves on Mossling; three overlapping
shell segments, ridged horns, jointed legs with claws, a third horn and an ember light
on Bolder; four swaying flame crests, lit arm tips, fangs and an orbit ring on Wisp; a
lighter belly and a velvet sheen on the Nubbin. Lesson: the marching-cubes add-on
returns raw gradient normals, not unit vectors; everything downstream (the gradient
bake, the shell offsets) needs them normalised.

**Third pass, Bolder and Wisp** (Maor: "I like what you did with spider and purple, keep
going"). Bolder is now a true spider: a cephalothorax and a big abdomen with an ember
hourglass baked across its back, plate ridges, two horns with ridge bumps, pedipalps,
spinnerets, eight jointed legs as separate sculpted parts (hip to knee rising, knee to
foot dropping, a claw) on hip pivots that shift their weight in turn, short bristles
(three fine shells), two big amber eyes over a row of six small glowing ones, working
mandibles, and an ember light inside; the seam glow pulses through the material's
uniforms. Wisp gained a drifting vapour shell (the body drawn once more, pushed out
and breathing, shown only at the silhouette through a Fresnel term and broken up by
moving 3D noise), a marbled surface at two scales, horn tufts curling back, a brow
ridge, cheek flares, a sixth flame crest, a skirt of six hanging wisps on their own
pivots, more motes and a pulsing core. `creature-4-bolder(-golden).jpg`,
`creature-5-wisp(-golden).jpg`. The creature camera backs off on 4:3 panes.

**Fourth pass, all five** (Maor: "keep going and carry over to all 5 samples"). Every
creature now blinks (the lids drop and lift every few seconds, each on its own
rhythm). The Nubbin has a velvet fuzz (two very short, very fine shells), lashes, the
yellow tips fading into the body, veined wings and a glowing, orbiting ball with its
own light. Mossling has mossy fuzz on its back, a vine winding round it with small
leaves, arms on shoulder pivots that sway, dew drops on the cap and spores drifting
up from the gills. Fennel has twelve finer fur shells, furred ears, cheek tufts,
real whiskers, cream flecks on its back, a periodic ear twitch and a slow look
around. Bolder steps: each leg lifts in turn at the top of its cycle; its bristles are
gone, they read as speckle on the plates. Wisp trails a line of fading motes behind its tail.
The stage records each creature's facing so idle turns add to it instead of replacing
it.

**What this says for the real build.** A species is a short description: a list of
blended shapes with colour rules and a detail kind, plus which pieces move. The
current catalogue (~100 looks across the Chao, pocket and digital lines) becomes data
of that shape, generated at load, instead of a hundred hand-made models; the
Chao-line evolutions are mostly colour and part swaps on one body, which this handles
directly. Animation would move from clip names to pose rigs: the same pivots driven by
the sim's states (walk, happy, sleep, eat, swim, flap).

## The HD port at a AAA finish (2026-10-15, for Maor's pick)

Maor: "step in the right direction. continue to refine. give me examples like a triple
A game." `?aaa=1..3` (`src/samples/aaa-styles.ts`, lazy-loaded) is the console-era
valley rebuilt the way a current console game builds a scene, in three moods;
screenshots in `docs/samples/aaa-*.jpg`.

**What is in the frame**

- A physical sky (Preetham, `three/addons` Sky) lights the whole scene through an
  environment map; the sun is a directional light with soft 4k shadow maps; fog takes
  the sky's colour.
- The valley is a heightmap mesh (192×192) whose material blends grass, dirt and rock
  by slope and by the path, each with its own painted 512px albedo and a normal map
  derived from a painted height field, through a small injection into three's
  standard shader. The cliffs are the same mesh rising past the rim.
- Twelve thousand instanced grass tufts (alpha cards) sway in the wind; five trees
  are bark-mapped trunks with branches and canopies of 170 leaf cards each, lit tops
  lighter, shaded bottoms darker, casting alpha-tested shadows; fruit has clearcoat.
- The cobbled mound is normal-mapped and roughened; the cottage has plaster, a tiled
  roof, a chimney and windows that light up (with point lights) after noon.
- The pond is physical water with refraction and a scrolling normal map.
- The modelled Keeper and Nubbins wear cloth (sheen) and clearcoat materials.
- Post: screen-space ambient occlusion, a clamp, bloom, depth of field, ACES filmic
  tone mapping, a grade with vignette, SMAA anti-aliasing.

**The moods**: `aaa-1-noon.jpg` (high sun, light haze), `aaa-2-golden.jpg` (sun at
7°, long warm shadows, fireflies, lit windows, stronger bloom), `aaa-3-rain.jpg`
(overcast, wet clearcoat ground and stone, drizzle, lit windows, desaturated grade).
`&closeup` frames the characters from the front.

**Lesson learned**: bloom in a scene lit above 1.0 in linear light needs its threshold
set above the sunlit ground (2.8 here), or the whole frame glows; the first pass of
this sample was a white haze for that reason. Debug switches stay on the URL:
`nobloom`, `nossao`, `nodof`, `nofog`.

**Sculpted characters** (Maor: "characters still too shapey"). `src/samples/sculpted.ts`
builds each figure as one surface instead of a stack of primitives: a signed-distance
field of spheres, capsules and ellipsoids joined with a smooth minimum is polygonised
with marching cubes (the three add-on, 112³), so the head flows into the neck, the arms
into the shoulders and the crown into the head like a clay maquette; vertex colours
come from the nearest primitive (with a few region rules: the overalls' bib, the hair
behind the face), so cloth, skin and yellow tips stay crisp. The cap, eyes with irises
and catchlights, brows, mouth, straps, buttons, cheeks, wings and the emote ball sit on
top as their own glossy pieces. The AAA samples use these; the console samples keep the
assembled ones for comparison.

**Cost**: this is desktop-class (SSAO, DoF, 4k shadows, 12k grass instances) and
would need a quality ladder for phones: no SSAO, 2k shadows, a third of the grass,
smaller textures. The art pipeline it implies for the real build: painted PBR texture
sets (albedo, normal, roughness) per material from the existing noise painters, leaf
and tuft cards, lathe-and-primitive characters with physical materials, one scene
per place (Grove, Hollow floors, race courses) behind the same view interface.

## Five console-era 3D directions (2026-10-15, for Maor's pick)

Maor, after the first five: "try again with better, think like this" with a Super
Mario 64 screenshot (Bob-omb Battlefield): a low camera behind the character, chunky
textured terrain walled by cliffs, a cobbled mound, billboard trees, vertex lighting,
soft filtered textures, blob shadows. Five new samples in that spirit, live Three.js at
`?retro3d=1..5` (`src/samples/retro-styles.ts`, lazy-loaded), screenshots in
`docs/samples/retro-*.jpg`. Same valley every time; what changes is how the machine
would have drawn it.

1. **N64** (`retro-1-n64.jpg`). 320×240 upscaled with the console's soft bilinear
   blur, Gouraud lighting baked per vertex, 64×64 filtered textures, blob shadows,
   camera-facing tree sprites, the Lakitu camera. The reference's own look; the
   cheapest to run, and the simple shapes suit the Nubbins.
2. **PlayStation** (`retro-2-ps1.jpg`). Same resolution but no texture filtering,
   vertices snapped to the screen grid, affine (warping) texture mapping through a
   custom shader, ordered dithering down to 15-bit colour. Grittier and more
   "crunchy"; the jitter is part of the charm and part of the eye strain.
3. **Nintendo DS** (`retro-3-ds.jpg`). 256×192, two-step toon light with the DS's
   dark edge marking, tiny unfiltered textures, strong colours. Reads as a cartoon
   and keeps the pixel sprites' outlines; the lowest fidelity of the five.
4. **Dreamcast** (`retro-4-dreamcast.jpg`). 640×480, smoother higher-poly shapes,
   per-pixel Phong with specular highlights on the Nubbins, mipmapped textures,
   soft real shadows, bright skies. The Chao Garden's own generation, so the closest
   match to the creatures' home; moderate cost.
5. **HD port** (`retro-5-hdport.jpg`). The N64 scene's simple shapes and bold colours
   at native resolution: crisp 256px textures with anisotropy, per-pixel light, soft
   shadow maps, tone mapping, widescreen. What a modern remaster does with the same
   assets; the most polished, and the one that scales best to phones and desktops.

The toggle plan stands from the earlier write-up: a Graphics choice on the title and
in Settings, a second scene behind the same view interface, sim untouched; the
Lakitu camera would follow the Keeper with the same Q/E orbit steps and a shoulder
offset, with the top-down camera kept as a third option. Recommendation: build the
geometry and textures once at N64 simplicity (1), then ship 5 as the default look
with 1 and 2 as selectable "retro" filters, since they are post-processing on the
same scene.

Maor liked 5 but found the character "too blocky, not a great sprite". The HD port (and
the Dreamcast sample) now carry modelled characters (`nubbinFine`, `keeperFine` in
`retro-styles.ts`): the Keeper is a cartoon head on lathe-built shirt and overalls
with straps and buttons, a cap with a badge and brim, sideburns and a fringe, eyes
with pupils and catchlights, a nose, ears, a smile, gloves and rounded shoes; the
Nubbins are Chao-faithful, a round belly tucking in at the neck, a head drawn up to
the pointed crown, big dark almond eyes with a catchlight, cheeks, a smile, yellow
tips on hands and feet, wings and the emote ball. `?retro3d=5&closeup` frames them
from the front (`docs/samples/retro-5-closeup.jpg`); the Lakitu view is
`retro-5-hdport.jpg` again.

## Five directions for a full-3D Grove (2026-10-15, for Maor's pick)

Maor: "conceptualize an upgrade to the graphics. Leave the existing assets, add a toggle
at the start for full 3D. Same story, fully 3D (not necessarily pixelated). Five
options with a small quick sample of each."

The samples are live Three.js scenes, not paintings: `?style3d=1..5` on the dev server
builds the same little Grove (ground, a terraced hill, the pond, three fruit trees, the
cottage, the well, two Nubbins and the Keeper) with each direction's geometry,
materials, light rig and post, slowly orbiting. `src/samples/three-styles.ts`,
lazy-loaded so the game bundle does not carry it. Screenshots in `docs/samples/3d-*.jpg`.

1. **Low-poly, flat-shaded** (`3d-1-lowpoly.jpg`). Faceted icosahedron canopies,
   six-sided trunks, a gently bumpy floor, flat shading, soft shadows, pastel sky
   and fog. Reads instantly as "3D indie cosy", runs on anything, and the Nubbins'
   round-but-faceted bodies suit the toddler proportions. Least art per asset: every
   model is a handful of primitives, so the whole species catalogue is quick to
   build. The risk is looking generic.
2. **Toon with outlines** (`3d-2-toon.jpg`). Three-step cel shading (a gradient
   map), saturated colours, an inverted-hull dark outline on every prop and creature,
   no cast shadows. The closest to the Chao Garden spirit and to the current pixel
   sprites' chunky outlines, so the two modes would feel like one game. Outlines
   need per-model tuning (thin parts, wings) and the flat look wants more texture
   detail on big surfaces.
3. **Cosy stylised PBR** (`3d-3-cozy.jpg`). Smooth high-segment shapes, physically
   based materials with ACES tone mapping, soft PCF shadows, a warm key and a cool
   sky fill plus a rim light, bloom and a touch of depth of field for a diorama
   feel, transmissive water with a glint. The most "modern cosy" (Animal Crossing,
   Tiny Glade) and the most work: it rewards real surface detail (grass tufts,
   wood grain, roof tiles) that the sample does not have, and it costs the most on
   phones (post passes, shadow maps).
4. **Painterly textures on 3D** (`3d-4-painterly.jpg`). The organic painted
   direction Maor picked for the 2D Grove, wrapped onto geometry: the same noise
   painters make tiling grass, bark, leaf, roof-tile, stone and water textures and
   the meshes carry them with simple Lambert light. Continuous with the current
   look, so the toggle feels like the same world stepping into depth; cheap to run.
   The sample's tiles repeat visibly at this scale and the models are plain; it
   needs painted detail maps per model and softer edges to shine.
5. **Voxel** (`3d-5-voxel.jpg`). Everything built from little cubes with hard
   shadows and an orthographic camera: the pixel sprites' honest 3D cousin. Every
   current sprite converts almost mechanically (each pixel a voxel), so the whole
   catalogue of species, hats and buildings comes across fast and stays
   recognisable. Chunky and charming, but it is the least "upgrade" of the five
   and the ground reads flat without height variation.

**How the toggle would work**: a Graphics choice on the title screen (and in
Settings), saved per device, not per slot. The sim is untouched; `render/` gets a
second scene implementation behind the same `WorldView` interface (positions,
clips, events in; pixels out), so the story, the Hollow, races and every system
run the same. Sprites keep their pick ids; 3D picks come from raycasts. The
species catalogue is the long pole in every direction: ~100 looks, hats and parts,
so directions 1, 2 and 5 (primitives, toon primitives, voxels) finish months
earlier than 3 and 4.

**Recommendation**: 2 (toon) for the look that matches the game's soul, built on 1's
cheap geometry so it ships; 4 if the painted world should stay the star; 5 only if
the goal is maximum reuse of the existing pixel art.

## Save slots, three per mode (2026-10-15)

Maor: "Add feature for multiple save slots for each game mode."

- **Storage** (`platform/storage.ts`): a slot is `{ mode, index }` with three per mode
  (Hazel's Grove, the Free Grove, the Learning Grove). Slot 1 of each mode keeps the
  key the game used before (`grove.save.v1`, `grove.save.campaign`, `grove.save.edu`),
  so every existing Grove shows up in slot 1; slots 2 and 3 are `grove.save.<mode>.<n>`.
  `summarize(json)` reads a save's headline without loading it (names of the first
  three Nubbins, count, Keeper and chapter for the campaign, the age for the Learning
  Grove, when it was saved); `copySlot` is there for later.
- **Title screen** (`ui/title.ts`): a section per mode with a row per slot. A filled
  slot shows Continue with its summary ("Momo, Pebble · yesterday", "Fern · Chapter 4 ·
  …", "Age 4 · …") plus New (confirm, then the Keeper or age question as before) and ✕
  Erase (confirm). An empty slot starts new. The old mode-level confirms are gone;
  each slot confirms for itself.
- **Settings** shows which slot is playing ("Playing Free Grove, slot 2."); Back to
  title returns to the slot list. `?free&slot=2` and `?edu=4&slot=3` pick a slot for
  dev links.

Tests: `tests/sim/slots.test.ts` (legacy keys for slot 1, nine distinct keys, index
clamping, the summary from a serialized world). Full suite green, lint clean, build
OK; seen in the browser: a new Free Grove in slot 2 saved under its own key, the
Settings line, and the title's Continue row with its summary and buttons.

## The field, four times the area (2026-10-13)

Maor: "Expand the area again 4x." `GROVE.size` 48 → 96 (`SIM.worldHalf` 46). The old
48-unit heart keeps every position (buildings, pond, stream, hills, trees, NPC homes,
lanterns, the cave mouth); the new outer ring is wilder, in four regions:

- **The north wood** (north-west): nine wild trees (`wild-1..4`, a darker, bluer
  canopy painted with the same branching tree), bushes, a log, rocks, a shaded floor
  and mushrooms; a track from the school.
- **The east ridge**: the biggest hill (r 8), scree pebbles, hardy trees, rocks; a
  track from the dojo.
- **The south marsh**: the stream now runs on to the far south edge; the ground is
  darker and muddier with puddles, reeds and tall grass along it; a track from the
  well.
- **The west meadow**: lusher grass thick with daisies and bluebells, a low hill and the
  fifth fruit tree; a track from the cottage. A sixth fruit tree stands in the far
  orchard corner (south-east) at the end of the dojo's southern track.

Also: six new hills, seven new tappable rocks, five new landmarks for the map
(north wood, east ridge, south marsh, west meadow, far orchard), decoration counts
scaled by area, tall grass along the longer edges. Older saves gain the two fruit
trees on load.

**The ground paints in a worker.** The 1536² floor painting took about two seconds on
this PC, which would freeze the first frames on a phone. `paintGround` is now a pure
pixel pass; `ground.worker.ts` runs it off the main thread (a 96 kB chunk, three.js
tree-shaken out) and the scene swaps the texture in when it arrives, showing a
quarter-resolution painting (about 0.15 s) until then. Tile painting goes through the
same path. Path and bank distance tests now skip segments by bounding box.

Tests: `tests/sim/field.test.ts` (size and walkable half, nothing overlaps or leaves
the field, the new landmarks stand on open ground, older saves get the trees). Full
suite green, lint clean, build OK; seen in the browser: all four regions and the
worker swap.

## The Hollow Below: procedural dungeons, built (2026-10-13)

Maor: "do item 11." The last system of the Digimon-inspired list is in: a seeded cave
under the Grove, explored in the world with the Keeper and a party of two, painted in
the organic style.

**What works**

- **The cave mouth** (`caveMouth` in the painted scenery, in the south face of the
  north-west hill, east face; also More → 🕳 The Hollow Below). Tapping it opens the menu: today's
  Hollow (one seed for every Keeper, from the day key) or a fresh one, who comes along,
  the deepest floor so far.
- **Floors** (`sim/dungeon.ts`, pure, memoised per seed and depth): cellular-automata
  rock with rooms carved in and wobbly corridors joining them, only what the first room
  reaches kept; water pockets from a value-noise field; torches on walls that face the
  floor, crystals in dead-end nooks; the stairs up where you arrive, the chest and the
  stairs down in the last room. Floors grow (34×24 cells at depth 1 up to 54×36) and
  darken with depth; floor 20 has no way down. Loot per floor grows too: Shells, stone,
  seeds, essences, lost critters, and from floor 2 the odd lost egg.
- **Exploring**: the Keeper walks with grid collision (`resolveDungeon`); a tap in the
  rock is dropped. The party (partners first, then the first two Nubbins awake, plus
  whoever is carried) follows at a short distance and fetches any loot within four
  units, each pickup a sparkle and a toast naming the finder. Tapping the chest or a
  stair marker walks there and uses it on arrival; a new tap elsewhere cancels. The
  stairs up, or Head home on the floor bar, return everyone to where they stood in the
  Grove with the whole haul (nothing is ever lost by leaving).
- **Shadow strays** wander the floor; one that bumps the Keeper snatches five Shells and
  runs. Tap one with a fruit in the bag and the Keeper walks over, feeds it, and it moves
  into the village square as a recruit (system 1).
- **A wild creature** waits in a nook; creeping up on it fills its scan bar (system 8).
- **The request board** has a new daily ask, "Go down n floors in today's Hollow".
- **Rendering** (`render/paint/dungeon.ts`, `GroveScene.setDungeon`): the floor is one
  painted texture at 12 texels per unit (flagstones with cracks and joints, dust at the
  walls, moss by the water, the rock faces with a lit lip fading to black, torch and
  crystal light baked in). Rock cells within two of the floor are blocks: tops carry
  the same painting, faces the cliff texture. A point light follows the Keeper and five
  more sit on the nearest torches. Torches flicker, crystals pulse, loot bobs, strays
  interpolate between steps. The Hollow song plays; weather and fireflies stay above.
- **Saves**: the run (seed, depth, party, taken loot, strays, haul) is in the save; the
  floor is regenerated from the seed. A save underground without its run lands in the
  Grove. Catch-up steps never move strays or count pickups.

Also fixed in passing: the species sprite cache keyed every species the same
(`species::-`), so every wild visitor and neighbour pet wore the first species' look;
the key now includes the id. And taps now test the texel under the finger instead of a
sprite's whole box, so a tree's empty corner no longer steals a tap meant for the cave
mouth (or anything else) behind it.

Tests: `tests/sim/dungeon.test.ts` (10 cases: determinism and connectivity, growth
with depth, collision, the daily seed, a full run with pickup and return, party
fetching and following, chest and stairs and the daily depth, strays snatching and
settling, the wild scan, saves and catch-up). Full suite green, lint clean, build OK;
seen in the browser: the cave, pickups, the chest, the stairs, feeding a stray, home.

**Known gaps**: the party does not fight anything and nothing hurts them; strays only
take Shells. Floors are not themed by depth yet (the same palette throughout).

## The Digimon-inspired ten, built (2026-10-13)

Maor: "Go through the next 10 upgrades on the list now." Systems 1–10 of the list below
are playable; 11 (procedural dungeons) and the campaigns remain.

1. **Village square** (`sim/town.ts`, Profile → Village square): settled wild visitors,
   returned strays and beaten race or karate rivals move in as recruits; prosperity
   (12 per recruit, 120 max) opens the stall (shop prices −10%), the gym coach (+20%
   training), the bathhouse attendant, free fortunes and a standing festival (+15% race
   prizes). Painted stalls appear by the cottage as the square grows.
2. **Care slips** (`sim/slips.ts`): a need ignored for two minutes (hungry, exhausted,
   lonely after the first ten minutes, out in the rain) logs a slip with a toast; the
   stats sheet shows the count and the last three. Each slip trims the adult span 5%
   (floor 75%); at evolution, three or more mark the Grumpy or Sleepy tag, none at all
   earns the well-raised bonus (a second stat steps up a grade). Slips never count
   during offline catch-up.
3. **Gym** (`sim/gym.ts`, `ui/gym.ts`, More → Gym): four stations, one per stat; a
   twenty-second timing bar (tap in the zone); hits × 6 points, × 1.5 when fed and
   rested, × 1.2 with the square's coach; costs energy.
4. **Partners and the merge** (`sim/partners.ts`, Profile → Partners): two chosen
   Nubbins keep near the Keeper and bond faster; two bonded adults merge with a twine
   (shop, 120 Shells) for a minute: race and karate levels become the pair's best + 2,
   and the merged pair glows.
5. **Curfew** (`sim/curfew.ts`): after 22:00 real time Nubbins prefer to nap and tire
   faster unless lanterns are lit; toasts at dusk and dawn; the sheet shows "Day n of
   about m" from the line's span.
6. **Rebirth memories** (`sim/inheritance.ts`, stats sheet → "Rebirth keeps"): a grade
   (best stat steps up), its parts, its lessons (default) or its accessories; each life
   is written into the family line ("Past lives: sun swim → …"); three lives earn the
   heirloom look (shiny).
7. **Keeper skills** (`sim/skills.ts`, Profile → Keeper skills): 24 nodes in Care,
   Garden, Games and Story, bought with points from badges and claimed requests; wired:
   faster hatching, fruit sooner, bigger expedition hauls and an extra seed, race prize
   bonus, karate HP, cheaper lessons, an extra plot.
8. **Scan and convert** (`sim/scans.ts`, Collection Book): wild arrivals (+25), their
   stay (+2/min) and neighbours' pets (+10/visit) fill a scan bar per species; at 100%
   the Book converts it into an egg.
9. **Guard teams** (`sim/teams.ts`, Profile → Guard team): Dawn, Dusk or Dew; a weekly
   seeded mission (expeditions, Shells, race or karate wins); points and ranks; a
   seeded board of four rivals.
10. **Beetle Run** (`sim/tank.ts`, `minigames/tank/screen.ts`, More → Beetle Run): a
    cart through a seeded cave on three lanes, dodging spores, rocks and acid, picking
    up shells, wood and stone into a limited cargo, through the boss door for a bonus;
    six hits ends the run; leaving early keeps the haul.

Also fixed in passing: the four Grove lanterns had lost their sprites in the earlier
lantern change (the script's anchor had moved); they draw and tap again.

The first deploy of this failed on the GitHub runner: the full-life timing test took
3.08 s against its 3 s budget (1.8 s locally). A CPU profile showed the per-step cost
was mostly old: the collection book rebuilt its key list every step for two badge
checks, the obstacle list was rebuilt per walker per step, landmarks and world-state
badges were checked every step. Those are now cached or gated (book keys built once,
fixed obstacles built once and placed ones cached, landmarks only when the Keeper
moved, state badges once a sim second, squared-distance early-out in `resolve`). The
test runs in about 0.5 s now.

Tests: `tests/sim/ten.test.ts` (12 cases). Full suite green, lint clean, build OK;
seen in the browser: the toasts for every system, the profile sections, the gym and the
cave.

## Play-through and debug pass (2026-10-13)

Maor: "Run through the game and debug." Driven in the browser pane from a cleared save:
title → Free Grove, walking and tap-to-move, tree shake, hatching, pet, feed, pick up,
put down, hug, call, grab/throw, the shop, kindergarten lesson and services, hats,
renaming, decorating, painting, planting and watering, toys and catch, the workshop and
dyes, gathering, requests, the profile (plots, title), the map (teleport), a
neighbour visit and gift, a race, a karate bout, an Expedition, every panel open and
close, a save round trip, a two-hour offline gap, the campaign's first chapter and
journal, with a window error hook watching the whole way.

**Fixed:**

- **Buying an unknown shop item emptied the purse.** `buy()` subtracted an undefined
  price, Shells became NaN, and the HUD's purchase toast threw. The sim now refuses an
  item with no price and the toast tolerates it. (Regression test added.)
- **Requests ignored anything done by command.** The board counted only events produced
  inside a sim step; visits, crafting, watering and gathering by tap come from commands,
  so those requests never advanced. Command events are now queued and counted on the
  next step (`queueQuestEvents` in `sim/quests.ts`). (Regression test added.)
- **Leaving a karate bout early counted as a loss.** Quitting now abandons the bout: no
  result, no record, a "Left the dojo" toast.

**Checked and fine:** no uncaught errors anywhere in the run; the save round trip is
exact; obstacles stop the Keeper; the hover halo and tap sparkles; all twelve panels;
the campaign opens on chapter 1 with its goal in the journal.

**Noted, not changed:** shaking a tree only hurries the next fruit (by design in
CLAUDE.md) and sometimes gives wood, so a fresh Grove's first fruit comes from the shop
or a wait; fast-travel to the well lands beside it because the well is solid; karate
takes the selected Nubbin or, with none selected, the first in the roster.

## Painted decor props and solid obstacles (2026-10-13)

Maor: "Upgrade the decor props to the new art too" and "make sure I can't walk through
the elements like a hill".

- **Props** (`src/render/paint/decor.ts`, `buildPaintedProps`): every small thing is
  painted now at 32 texels per unit: fruit and the seven flavoured fruits, the memorial
  flower, the ball, notebook, radio, blocks, mirror and little TV; the ground dressing
  (tufts, daisies, bluebells, pebbles, mushrooms, stumps, signs, reeds, tall grass,
  lily pads); the placed pieces (fence, flower bed, bench, statue, path stone, garden
  lantern, rock pile, thicket); orchard trees and crop rows at their four stages. The
  path fence posts use the painted post from the scenery sheet. The old pixel prop
  sheet remains only for the shadow blob.
- **Obstacles** (`src/sim/obstacles.ts`): hills, the four trees, the buildings (their
  footprints now live in `GROVE.buildings` with a radius; `render/scenery.ts` derives its
  placements from them), the big rocks (`GROVE.rocks`) and placed buildings (nursery,
  bathhouse, workshop) are solid circles. The Keeper, the second Keeper, visiting
  Keepers and hatched Nubbins are pushed out along the edge each step, so nobody
  walks through a hill; a tap target inside an obstacle is dropped so the Keeper does
  not push against it forever. The pond still works through the shoreline rule (wading
  with the perk). Tests: `tests/sim/obstacles.test.ts`. Nubbins pass trees (they eat the fruit
  under the canopy; the Keeper stops at the trunk), and the third tree moved from the
  west hill's slope to (-12, 7) so its fruit is reachable; old saves snap their trees to
  the layout on load.

## Hills, waterfall and lanterns in the new art; smooth camera; tap and hover feedback (2026-10-13)

Maor: "Upgrade the hills, waterfall and lantern posts to the new art too", "when I move
around the graphics are jittery", "when you can interact with something make sure it has
a clear indicator like sparkles or a border when clicking/hovering".

- **Hills** (`paint/terrain.ts`): each terrace is a ring whose radius wanders with warped
  noise (`terraceSide`, `terraceTop`), so the plateaus are no longer circles; the cliff
  face is a painted tile (undulating strata, ridged cracks, a lit lip, moss at the foot,
  lichen) repeated by circumference; the tops use a painted grass tile that wraps.
- **Waterfall**: a painted scrolling tile of streaks and foam (`paintWaterfallTexture`),
  the splash pool a noise-edged shape.
- **Lantern posts**: the four 3D posts and glow spheres are gone; the view draws the
  painted `lanternPost` sprite, swapping to `lanternPost-lit` at dusk or once the Keeper
  lights one, tappable as before (`lantern` is now a sprite pick kind). The scene keeps
  their positions (`lanternSpots`, `lanternStates`) and the shared point light.
- **Jitter**: the camera followed the Keeper's sim position, which moves ten times a
  second, while the Keeper sprite is drawn interpolated between steps, so the two
  disagreed every step. The camera now follows the drawn position
  (`WorldView.keeperDrawPos`). The camera rig is also snapped to the low-res frame's
  pixel grid along its own screen axes (`OrbitCamera.applyPose`), so sprites never sit
  between pixels and shimmer while the view glides.
- **Feedback**: with a mouse, the thing under the pointer gets a pulsing bright halo
  (the same frame drawn larger and brighter behind it, `SpriteBatch.highlight`) and a
  pointer cursor; any tap on a tappable thing (Nubbins, items, Keepers, buildings,
  trees, plants, wild visitors, lanterns, pieces) bursts sparkles where it landed and
  shows the halo for a moment (touch has no hover, so the tap halo is the signal).

Checks: tests, lint and build green; seen in the browser by day and at dusk.

## The organic art direction, in the game (2026-10-13)

Maor: "go forward on art. Use the art we designed in the latest - the way the dojo and
windmill were upgraded." The painted kit from the samples is now the Grove's art.

**What changed:**

- `src/render/paint/`: the sample code moved into the renderer. `raster.ts` (full-colour
  raster with a coverage mask, boundary rims, `toTexture`), `noise.ts` (value noise, fbm,
  domain warping, ridged), `buildings.ts` (wall and roof painters), `props.ts` (branching
  trees, bushes, rocks, logs, fence posts, lantern posts, the well), `shore.ts` (the
  pond's noise shoreline, cached per angle), `atlas.ts` (packs rasters of any size into
  one RGBA sheet), `scenery.ts` (paints every scenery frame once at start: four seeded
  trees, three bushes, logs, rocks, the cottage, school hut, dojo, well, windmill,
  nursery, bathhouse, workshop, lantern and fence posts, plus lit variants of the
  buildings for dusk).
- `render/ground.ts` is repainted in the organic style at 16 texels per unit (768²):
  warped green drifts and dry patches (coarse fields sampled bilinearly for speed),
  blades and flower drifts, paths with wandering widths and edges, ruts and stones,
  stream banks, the noise shoreline with a wet band, hill scree, stone pads, the crop
  plot, painted tiles. About 0.8 s on this machine; repainted only when tiles change.
- `render/grove-scene.ts`: the pond, its rim, shallows and foam are polygons that follow
  the noise shoreline (`pondOutline`); the old 3D rocks are painted sprites with hidden
  tappable pads for gathering; four point lamps (cottage window and lantern, dojo,
  school) come on at dusk; the hill tops are tinted to sit with the new ground.
- `render/world-view.ts`: scenery sprites keep their painted aspect (`size` is the
  width), get a ground shadow blob, use the `-lit` frame when the lamps are on, and are
  brightened near lamps (`lightAt`), as are placed buildings and fence posts.
- `render/scenery.ts`: placements by painted kind, a windmill at (-16, -5) (tappable,
  a line of flavour text), painted rocks and a lantern post by the cottage door.
- The tool tests import the painters from `src/render/paint`.

**Checks:** full suite green, lint clean, build OK; seen in the browser by day and at
dusk (lit windows, lamps, the sprite lift near them).

**Left for later:** (the props, hills, waterfall and lanterns followed in the next sections); the ground paint could be
faster still (the path distance loop) and could move to a worker.

## Roof redone and five more buildings (2026-10-13, for Maor's pick)

Maor: "try again on the roof art so it's clear what's roof and what is floor. Then
create 5 other building samples that we can use for other places."

**The roof.** The old thatch was the same value and the same stroke texture as the
grass, so the two merged. The new `roofThatch` in `tests/tools/buildings.ts` paints
courses stepped down the slope, each lit at its top with a dark, ragged underside; a
lit slope and a shaded slope split at the middle; a woven ridge cap with spars; a
fringe that hangs below the eave line; and `eaveShadow` throws a dark band onto the
wall under the eave. The cottage in `fractal-day.png` / `fractal-dusk.png` uses it.

**Five buildings** (`tests/tools/buildings.test.ts`, `PREVIEW_BUILDINGS=dir`;
`docs/samples/building-1.png` … `building-5.png`, `buildings-all.png`), each a
different wall and roof material so places read differently at a glance:

1. **The school hut** (kindergarten): a round stone wall curving away at the sides, a
   scalloped slate cone, a bell gable, a painted sign, flower boxes.
2. **The dojo**: a timber hall on a raised floor with shoji panels, a dark entry with a
   blue noren and two red lanterns, two tiers of curved ceramic tile roof with heavy
   ridge beams and upturned ends.
3. **The workshop**: a plank barn with an open front showing the bench, a shelf of
   tools and a vice, doors folded open, a barrel and a log pile, a staggered wood
   shingle roof weathering grey toward the eave, a stone chimney with smoke.
4. **The bathhouse**: rounded river stones, a cornice, a copper dome gone green with
   seams and patches of bare copper, a round window, a glowing window, a steaming tub
   and a towel on a rail.
5. **The windmill**: a tapering stone tower, a plank drum with a shingled cap, four
   lattice sails on a hub, a small window, sacks and flowers at the door.

Shared painters in `tests/tools/buildings.ts`: plaster, stone (square or rounded,
light or dark), plank walls; thatch, slate, tile, shingle and dome roofs; windows with
wavy glass, plank doors, stone steps, flower boxes, ground shadows, the eave shadow.
Every building is tracked for the boundary rim. After Maor's review: the school sign got a fixed dark
frame, the dojo got three stone steps up to its raised entry, and the windmill's sails
became solid cloth in wooden frames with a dark outline all round. These are the kit for the campaign
places and the Digimon-style town if those are picked.

## Organic samples and a procedural dungeon (2026-10-13, for Maor's pick)

Maor: "try again with samples that aren't exactly shape based. Not too triangular or
circular - more like real life which is fractal. Then make a sample as well of a
'dungeon' that is procedurally generated. Add procedural generated dungeons
recommendation to the list of improvements."

**Organic scene** (`tests/tools/env-fractal.test.ts`, `PREVIEW_FRACTAL=dir`;
`docs/samples/fractal-day.png`, `fractal-dusk.png`). Nothing is a primitive:

- Trees grow by recursive branching (six segments per branch, two or three children,
  angles and lengths from the seed, bark from ridged noise, a lit side), and the canopy
  is a cloud of leaf dabs hung on the twigs with its silhouette eaten by a noise field,
  so every tree is different and ragged. Bushes the same way, low.
- The ground is three greens blended by domain-warped noise with dry patches, 16,000
  blades where a finer field is high, flower drifts in another.
- The path's width and edge wander along its length and per pixel; ruts and stones
  come from a wear field; a trodden fringe fades into the grass.
- The pond's shoreline is a noise function of the angle; the bank and the wet band
  follow it; ripples are a stretched field; reeds lean; lily pads are noise-cut blobs.
- Rocks are blobs displaced by ridged noise, shaded by a guessed normal, mossy below.
- The cottage: warped plaster with cracks, timbers that bend, a stone footing of
  individual stones, a thatch with a sagging ridge and ragged eaves built from 2,600
  strokes, wavy old glass, a chimney of stacked stones, a crooked lantern post, a
  sagging fence. The far treeline is a fractal silhouette.
- Boundaries: every object (rocks, trees, bushes, fence, cottage, well, Keeper,
  Nubbin, the water) is tracked into a coverage mask while it is painted, and
  `rimObjects` in `tests/tools/raster.ts` darkens each object's edge pixels and, more
  softly, the background just outside, so each thing reads as a separate thing (Maor,
  after the first render: "add contrast to the borders of each object"). The green that
  showed through the roof in that first render was the near tree's canopy drawn over
  the cottage; objects are now drawn back to front and the tree sits clear of the roof.
- Shadows in the dusk pass are noise-eaten shapes too. Same light pass and HD-2D
  frame as the combined sample. Shared noise code: `tests/tools/noise.ts` (value noise,
  fbm, domain warping, ridged).

**Procedural dungeon** (`tests/tools/dungeon.test.ts`, `PREVIEW_DUNGEON=dir`;
`docs/samples/dungeon-7.png`, `dungeon-2026.png`, and `dungeon-map-*.png` for the
grid). Seeded and pure (`generate(seed)` uses the sim's `Rng`), with a test that the
same seed gives the same dungeon and that every floor cell reaches the stairs:

- A 70×42 cave from cellular automata (52% fill, five smoothing passes), four rooms
  with chipped corners carved in, wobbly corridors joining them, the largest connected
  region kept, water pockets where a noise field is low, torches on walls that face
  floor, crystals in dead-end nooks, stairs in the first room, a chest in the last.
- Rendered per pixel through the grid warped by noise, so the rock faces wander off
  the cells: a lit lip where rock meets floor, deep rock fading to black, flagstones
  with dark joints and cracks, dust gathered at the walls, moss near water and in
  damp corners, pebbles and bones; torches warm and crystals cool as point lights with
  falloff, dimmed through walls; dust motes in the light; fog in the far corners.

**Recommendation 11 (added to the Digimon-inspired list):** _Procedural dungeons._ A
"Hollow Below" entrance in the Grove (and the cave domains of S3 "The Beetle Road"):
each run generates a seeded cave of rooms and corridors with water, torches,
crystals, a chest and a way down; Nubbins explore with the Keeper, find materials,
seeds, essences and lost eggs, meet wild creatures and Shadow strays, and can turn
back any time. Floors get bigger and darker; a daily seed gives everyone the same
dungeon for the request board. The generator above is the seed of `sim/dungeon.ts`;
rendering would reuse the ground painter and the light pass.

## Bigger sample: directions 3 and 5 combined (2026-10-13, for Maor's pick)

Maor: "Do a bigger example of 3 and 5 combined." `tests/tools/env-combo.test.ts`
(`PREVIEW_COMBO=dir npx vitest run tests/tools/env-combo.test.ts`) paints a wider scene
(560×330, written at 2×): the thatched cottage, a lantern post, a big near tree and two
far trees, a fence, a well, three bushes, a winding path, a larger pond with lily pads,
and the Keeper with a Nubbin for scale. `docs/samples/combo-day.png` is the painterly
albedo with the HD-2D frame only (light shafts, tilt-shift, bloom, grade, vignette);
`docs/samples/combo-dusk.png` adds the light pass first (dusk ambient, a low sun from
the left with long cast shadows for every prop, window and lantern point lights with
falloff, fireflies, the lights and the sky reflected in the water), then the same
frame tuned warmer. The shared raster and post code lives in `tests/tools/raster.ts`.

What it would take in the game: the painterly props are the art cost of direction 2
(every prop repainted with tone ramps, roughly one to two weeks for the Grove); the
light pass is a light-map texture drawn per frame from the sun angle and the placed
lights (windows, lanterns, fireflies) and multiplied over the scene, plus a shadow
sprite per prop (about a week); the HD-2D frame is tuning of the existing `PostPass`
(two to three days). The real-clock day cycle and weather already drive the hour, so
the dusk look would appear every evening by itself.

## Five environment art directions (2026-10-13, second attempt, for Maor's pick)

Maor: "Try again on the graphics. Not just additional detail but fundamentally upgraded
each time", pointing at the best-of pixel-art game lists (Octopath Traveler, Eastward,
Owlboy, Hyper Light Drifter, Celeste, Sea of Stars, Stardew Valley, CrossCode). Each
sample is a different way of making the scene, rendered in full colour by
`tests/tools/env-directions.test.ts` (`PREVIEW_DIRECTIONS=dir npx vitest run
tests/tools/env-directions.test.ts`), PNGs in `docs/samples/dir-1.png` … `dir-5.png`.

1. **Tile-grid 16-bit** (Stardew Valley, Link's Awakening). A real 16 px tileset:
   autotiled dirt with rounded corners, water tiles with foam on their open sides, a
   sand ring, the house assembled from wall / roof / window / door tiles, bright
   saturated colours, dark outlines on objects and none on the ground. Engineering:
   a tile layer and autotile rules in `ground.ts`, roughly a week; art is fast after
   that because every scene is tiles.
2. **Painterly hi-bit** (Owlboy, Eastward). No grid, no outlines; forms carried by value
   and colour, six-tone ramps, a canopy of 2,600 leaf dabs lit from the upper left,
   gradient walls, a thatched roof in brush strokes, soft shadows, haze at the top.
   The most expensive in art time (every prop is a painting) and it needs the palette
   opened up from 48 colours to per-material ramps; one to two weeks for the Grove.
3. **HD-2D** (Octopath Traveler, the Dragon Quest remakes). Crisp tile sprites inside a
   photographic frame: tilt-shift depth of field, bloom, diagonal light shafts, a warm
   grade, a vignette. Our `PostPass` already has bloom, tilt and grade, so this is two
   to three days of tuning plus the light shafts and cast shadows.
4. **Chunky limited palette** (Hyper Light Drifter, Celeste). Half the resolution, twelve
   colours, no outlines; silhouettes, a hard rim light from one side, dithered sky,
   teal shadows and magenta accents. Cheapest to produce and strongest identity, but
   it is a change of the whole look (the 64 px Chao would be redrawn at 32 px, which
   is the design grid we already draw on). About a week.
5. **Dynamically lit dusk** (Sea of Stars). The painterly scene as an albedo layer with a
   real light pass: a dusk ambient, a low warm sun with long cast shadows, point lights
   from the windows and a lantern with falloff and water reflections, fireflies, bloom.
   Needs a light map in the renderer (one draw of lights into a texture multiplied over
   the scene) and shadow shapes per prop; one to two weeks, and it pays off most with
   the real-clock day cycle we already have.

My recommendation: 5 built on 2 if the goal is "best looking"; 3 if the goal is the
biggest change for the least time; 1 if the plan is many more areas (the Digimon-style
campaigns), because tiles scale.

## Five environment graphics samples at rising effort (2026-10-13, for Maor's pick)

Maor: "provide 5 different samples of upgraded graphics for the environment/buildings/etc.
at various levels of effort and a quick blurb of each." Rendered from one vignette
(cottage, tree, path, pond corner, fence, bushes) by `tests/tools/env-samples.test.ts`
(`PREVIEW_ENV=dir npx vitest run tests/tools/env-samples.test.ts`); the PNGs are in
`docs/samples/env-1.png` … `env-5.png` and the strip `env-all.png`.

1. **Flat clean-up (about half a day).** Today's shapes with the palette ramps tidied:
   flat grass, a plain path, a two-tone roof, simple windows. The baseline.
2. **Texture pass (one to two days).** Grass drifts in three tones with tufts and
   clover, path rims with a pale worn centre, roof tile rows, wall beams, window
   mullions, lobe highlights on trees and bushes, ground pads under buildings.
3. **Fine-grid detail (three to four days).** Uses the 64 px grid fully: individual
   shingles and a chimney, a stone base course, plaster speckle and braces, shutters
   and flower boxes, a plank door with a step, pebbles on the path, leaf clusters and
   fruit in the canopy, berries on bushes, a shallows ring and wave crests on the pond.
4. **Light and shadow (plus two to three days).** A sun from the upper left: a lit and
   a shaded roof half, shade under the eaves and on the far wall, cast shadows for the
   tree, house and fence, dapple under the canopy, glass reflections and a warm window
   glow, sky reflections on the water. This is the step that makes the scene read as a
   place rather than a sticker sheet.
5. **Hero set dressing (plus three to five days, ongoing).** Living detail: chimney
   smoke, a lantern, a crate, a swing, birds, foam at the bank, lily pads and reeds,
   flagstones laid into the path, grass blades over its edge, wildflower drifts. The
   reference-tileset look; the cost is drawing time per prop and a little draw time.

Each level is cumulative; the renderer already supports all of it (the same palette,
`PixelCanvas` and the one sprite batch), so the choice is art time, not engineering.
Recommendation: 4 for the whole Grove, with 5 reserved for the cottage, the square and
the campaign places.

## Next list: inspired by Digimon World and its sequels (2026-10-13, for review)

Maor: "take for inspiration digimon world and the sequels. Recommend multiple campaign
expansions or alternates (some completely separate, not add ons to the original)."
Sources: the Wikipedia pages for Digimon World, Digimon World 2, 3, Re:Digitize, Next
Order, World DS and Dawn/Dusk, plus guides (speedrun.com, Grindosaur, RPGFan). The
mechanics that define the line: one partner raised through a short lifespan with hidden
care mistakes deciding its next form; a ruined town rebuilt by recruiting the creatures
you meet (prosperity); training gyms run by recruits; a real clock with curfews and
sleep; death and rebirth as an egg with a little carried over; later games add a second
partner, a merged form, town materials, tamer skill trees, a data-scanning farm, guard
teams and dungeon tanks, and an MMO-trapped-online story.

**Systems (ten):**

1. **Prosperity and recruits.** A ruined village square beyond the cottage. Every wild
   visitor, stray and neighbour's Nubbin you befriend (fed, raced against, beaten at
   karate) can be _recruited_: it moves in, raises a prosperity meter and opens something
   (a stall, a gym, a bathhouse attendant, a fortune teller). Files-City-style: the
   town fills in visibly as the meter climbs.
2. **Care mistakes, made visible.** A gentle version of the hidden counter: ignoring a
   mood bubble for too long (hungry, sleepy, needs the pond, lonely) logs a "slip"; the
   stats sheet shows the last few. Slips weight the evolution toward the Grumpy or
   Sleepy forms (new lower-tier looks per type) and shorten the lifespan a little; a
   clean childhood unlocks the "well-raised" bonus grade.
3. **Training gym with mini-games.** Recruits run four stations (Swim lane, Fly rings,
   Run track, Power rocks): 20-second timing/rhythm games that give points to one stat,
   cost energy, and give _more_ when the Nubbin is rested and fed (so the daily routine
   matters, like Digimon World's "train while hungry = mistake").
4. **Two partners and a merged form.** Pick a _partner pair_ that follows the Keeper;
   both gain bond; at full bond with a bought "twine" they can merge for sixty seconds
   into a glowing ExE-style form for races and karate, then split (stats shared,
   nothing lost).
5. **Lifespan clock and curfew.** Nubbins sleep at night by the real clock unless the
   Keeper lights the lanterns; late play tires them (energy drains faster after
   midnight); a short "day count" on the sheet shows the age in days and what the
   typical span is for that line, so rebirth stops being a surprise.
6. **Rebirth inheritance tree.** Each rebirth keeps a chosen _memory_ (one grade, one
   part, one lesson, one accessory) and records the lineage in a family tree on the
   profile; three generations of the same line unlock a heirloom look.
7. **Keeper skill tree.** Tamer-style points from achievements and quests buy small
   permanent perks (hatch 10% faster, fruit lasts longer, lessons cost less, a second
   carry slot), 24 nodes in four branches: Care, Garden, Games, Story.
8. **Scan and convert (DigiFarm-style).** Meeting the same wild species repeatedly fills
   a scan bar in the Collection Book; at 100% the Book can _convert_ the scan into an
   egg of that species, so every species is reachable without luck.
9. **Guard-team expeditions.** Three teams (Dawn, Dusk, Dew) with a leader each; join
   one for weekly missions in the Expedition minigame with team-coloured rewards, a
   team rank, and a rivalry leaderboard (local, seeded).
10. **The tank run.** A Digi-Beetle-style vehicle minigame: drive a little cart through
    a seeded cave with hazards (spores, loose rocks, acid puddles), a limited cargo of
    items, and a boss door at the end; shells and materials come home.
11. **Procedural dungeons.** A "Hollow Below" entrance in the Grove (and the cave domains
    of S3): every run generates a seeded cave of rooms, corridors, water, torches,
    crystals, a chest and a way down; Nubbins explore with the Keeper, find materials,
    seeds, essences and lost eggs, meet wild creatures and Shadow strays, and can turn
    back any time. Floors get bigger and darker; a daily seed gives everyone the same
    dungeon for the request board. The generator in `tests/tools/dungeon.test.ts` is
    the seed of `sim/dungeon.ts`; see "Organic samples and a procedural dungeon".

**Campaign expansions (add-ons to Hazel's Grove):**

- **E1. The Square.** A chapter after the ending: Hazel's letter mentions the old
  village square; rebuilding it (system 1) is the arc, with Corvin returning as a
  reformed recruit if the Corvin ending was earned.
- **E2. Nova's Season.** A twelve-day side story told through the lifespan clock
  (system 5): a Nubbin with a short span that the Keeper raises right or wrong; both
  outcomes are written, with a memorial or a rebirth epilogue.
- **E3. The Twine.** A short arc that teaches the two-partner merge (system 4) through
  the Hollow's strays; it ends with a karate tournament against the ten Keepers.

**Separate campaigns (new slots, not add-ons):**

- **S1. "The Hundred Days".** A Digimon World-style single-partner campaign: one egg,
  one real-time lifespan of ~15 days (or ×10 debug), a ruined village to refill by
  recruiting wild creatures across six areas (meadow, shore, cave, mountain, mire, the
  old mill), prosperity gates the story, care mistakes shape the partner, and a
  Machinedramon-style final threat (a Shadow colossus at the mountain). Ending by the
  partner's final form and the town's prosperity. 8–10 hours.
- **S2. "Logged In".** A Digimon World 3-style story: the Keeper is a child inside a
  "Grove Online" game that locks everyone in; three partners in a party, turn-based
  bouts in a card-like format reusing karate strikes, two mirrored "servers" (Day Grove
  and Night Grove maps), a mystery about who runs the game (an adult-themed thread
  about a company and a missing sibling is allowed). 6–8 hours.
- **S3. "The Beetle Road".** A Digimon World 2-style expedition campaign: a guard
  team, the tank run (system 10) through seeded cave domains with bosses, DNA-style
  fusing of two Nubbins into one (a careful, consented version with the breeding sim),
  a team leader's missions, and a reveal about the Grove's "weather machine". 5–6 hours.
- **S4. "Dawn & Dusk".** Two mirrored short campaigns picked at the start (Sun Keeper
  team or Moon Keeper team), each with four species families to serve quests for, tamer
  rank tests in the dojo, scan-and-convert (system 8) as the collection engine, and a
  degeneration mystery (Nubbins reverting to eggs) that both sides solve from their
  angle; the other half unlocks after one is finished. 4 hours each.

Suggested order if all approved: systems 1, 2, 3, 5, 6 with E1 and E2; then S1 as the
first separate campaign (it reuses the most); then 4, 7, 8 with E3; then S4, S2, S3 and
systems 9, 10.

## Learning Grove: the educational mode, built (2026-10-13)

Maor: "finish the 20 then educational mode. Edu mode should give you recommendations on
the content but you should be able to add/remove specific mini games at will to
personalize." Built on the ten recommendations above.

**What works:**

- **Title → Learning Grove (ages 3–6)**: pick the age (big 3 / 4 / 5 / 6 buttons); the
  mode has its own save slot (`grove.save.edu`, `?edu=4` for dev). It is a Free Grove
  underneath: the same garden, Nubbins, shop and care, with races and karate hidden and
  the 🏃 button replaced by 🎓 Play & learn.
- **Six games** (`minigames/edu/games.ts`, pure and seeded; `ui/edu.ts` draws them):
  Colours (find it, then "which is not"), Letters (names → first letters of picture words
  → big/small; the child's own name's letter comes up often), Counting (count icons to
  3 / 5 / 10, more or fewer, little sums at 6), Shapes (three at 3, up to eight at 6, "how
  many sides" at 6), Sounds & rhymes (animal sounds at 3, first sounds at 4, rhymes at 5,
  syllable claps at 6), Animals (names → sounds → homes → babies). Three options at age 3,
  four above. Five rounds per play; no timers; three tries, then the answer is shown with
  a teaching line and the round still counts. Stars 3/2/1 by tries, Shells per star, a
  fruit for a perfect round, a sticker every nine stars.
- **Recommendations plus personalisation** (`config/edu.ts` `EDU_RECOMMENDED`,
  `sim/edu.ts`): each age starts with its recommended set; the grown-up area has a
  checkbox per game tagged "Recommended for age N", any game can be switched on or off,
  "Reset to recommended", and changing the age re-applies the recommendations.
- **Grown-up area** (More → Grown-ups, behind a sum gate): age, child's name, session
  length (10–60 minutes), the game toggles, progress by learning area (Thinking & maths,
  Letters & reading, Listening & sounds, Animals & nature), stickers, a co-play prompt.
- **Break screen** after the session length; a grown-up can extend it from the screen.
- Toasts for stars and stickers. Everything offline, no ads, no external links.

**Checks:** `tests/sim/edu.test.ts` (recommended sets and personalisation, Shells and
stickers, session clamp and break, save round trip and old-save default, every game at
every age generates valid rounds, age-3 limits, syllables). Full suite green, lint clean,
build OK. Verified in the browser pane: title age picker, the picker, a Counting round
with feedback and Next, the gate, the grown-up panel.

**Known gaps:** the games use emoji for pictures (platform assets, not in-house pixel
art); there is no read-aloud voice (text only, a grown-up reads); the campaign is not
offered in the Learning Grove rather than rewritten for it.

## The twenty improvements, built (2026-10-13)

Maor: "Let's move forward to all 20 of the pending items on our improvement list next",
then "finish the 20 then educational mode". The sim layer landed first (commit `a6c7156`);
this entry is the render, UI and audio layer on top. Everything below is playable.

**What works:**

- **Orchard and crops** (Decorate → Orchard & crops): seeds by flavour from Expeditions and
  harvests; plant a tree or a crop row on the grass; four growth stages drawn from the prop
  sheet (`treeStage0–3`, `cropStage0–3`); grown trees drop flavoured fruit (tinted frames
  `fruit-<flavor>`); tap a plant to water it, tap a ripe crop to harvest. Dry plants draw
  darker.
- **Toys** (Decorate → Toys): ball, radio, blocks, mirror, little TV, each with a prop
  sprite and its own idle effect; placed with a ground tap.
- **Paint tiles** (Decorate → Paint tiles): dirt, water, flowers, stone, grass to erase;
  painted into the ground texture (`makeGroundTexture(seed, tiles)`, repainted on
  `tilePainted`). Water tiles are swimmable.
- **Workshop** (Decorate → Workshop, or tap the workshop): wood from shaken trees, stone
  from a tap on a rock, reeds from a tap on the stream bank; recipes for every garden
  piece, the three buildings, a ball and dyes (colour picker). Materials shown in the tab.
- **Buildings as placed pieces**: nursery (bred eggs are laid beside it), bathhouse
  (glum Nubbins go for a soak: happiness and energy, splash particles), workshop. Drawn
  from the scenery sheet at 3.6 units, tappable.
- **Habitats and wild visitors**: rock piles and thickets as props; a wild creature of the
  pocket or digital line visits a complete patch with a "?" over its head, hops when fed;
  tap it with fruit in your pocket (`feedWild`, `wildFed` toast); after enough visits or one
  feeding it settles into the roster.
- **Requests** (More → Requests): three daily asks with progress and a Claim button; the
  board refreshes on a new real day; rewards in Shells and sometimes an egg.
- **Keeper profile** (More → Keeper profile): title picker from earned badges, garden plots
  (roster room), borrowed moves from loved adults, a badge grid for the twenty-one
  achievements.
- **Neighbourhood** (More → Neighbourhood): visit any other Keeper's Grove; their pets are
  generated from their id and drawn read-only with the host standing by; tap the host (or
  the panel button) for a daily gift; "Go home". Your own Nubbins, pieces and items stay
  home while you visit.
- **Map** (More → Map): found landmarks on a 6×6 grid laid out like the field; tap one to
  fast-travel.
- **Accessories** (stats sheet): dye the hat or a scarf with workshop dyes, toggle glasses;
  drawn on the Chao sprite in every angle (`DYE_COLORS`, recolour of the hat, a scarf
  under the chin, round frames over the eyes) and keyed into the sheet cache.
- **Local co-op** (Settings → Second Keeper): a second Keeper with a chosen look; IJKL
  moves, U pets, O feeds; the first gamepad's left stick and A/B do the same.
- **Jukebox and ambience** (Settings): pick any piece of the score or leave it automatic;
  an ambient layer with birds by day, crickets at night, rain hiss and the stream when
  the Keeper is near the water or the falls (`setAmbience` in `platform/audio.ts`).
- **Species chirps**: Chao, pocket and digital lines each have a small voice on reactions
  and when a wild one arrives (`playChirp`).
- **Sled spray** in snow, **festival** and every other new event has a toast.
- Photo mode reports the species to the sim for photo requests.

**Checks:** 170 tests pass (5 skipped), lint clean, build OK. Verified in the browser pane:
plants, toys, buildings, tiles, the wild visitor, the second Keeper, Fern's Grove, the
accessory photo, the Decorate tabs, Requests, Profile, Map, the Settings additions.

**Known gaps:** the map grid is schematic rather than a drawn map; neighbours' Groves reuse
the home layout; gamepad input is polled only while the game tab has focus.

## Educational mode: review and recommendations (2026-10-13)

Maor asked for an educational mode (age 3–6, age-appropriate mini-games: matching,
colours, letters, sounds, animals) and a review of leading materials first. Sources read:
the Head Start Early Learning Outcomes Framework (five domains: Approaches to Learning,
Social-Emotional, Language and Literacy, Cognition, Perceptual/Motor), kindergarten
readiness checklists (Kansas City schools, Idaho libraries, Pennsylvania TFEC), app
roundups naming Khan Academy Kids, PBS Kids Games, Endless Alphabet, ABCmouse, Montessori
apps, and Sesame Workshop's Play to Learn findings. The ten recommendations are in the
chat log of 2026-10-13 and summarised here:

1. Age bands 3 / 4 / 5 / 6 with a skills ladder per band, not one difficulty slider.
2. Guided play: every lesson is a Grove activity (feed by colour, call the Nubbin whose
   name starts with the letter), never a worksheet.
3. Letters: names first, then sounds, then first-letter matching (readiness benchmarks:
   10–15 letters by 5, the child's own name first).
4. Numbers: count objects up to 5 at age 3, 10 at 5; more/less; shapes circle, square,
   triangle, then rectangle.
5. Colours: 5 at age 3, 8 by 5; sort by colour, shape and size.
6. Phonological awareness: rhyme pairs, first sounds, clapping syllables; the Nubbins'
   chirps as the sound bank.
7. Animals and nature: identify by sound and silhouette; the three species lines and the
   Grove's weather and seasons as the content.
8. Social-emotional and self-regulation: turn taking, naming feelings (the Nubbins'
   moods), kindness choices (trust is already a mechanic).
9. Adaptive difficulty with no fail state: three tries, then a demonstration; stars
   and stickers, no timers for ages 3–4.
10. Grown-up gate and co-play: a parent area for age, session length (20–40 minutes),
    progress by domain, with co-viewing prompts; everything offline and ad-free.

## Bigger field, stream, water, hills, run (2026-10-13)

Maor: "water graphics and some of the hills aren't up to the standard. Keep upgrading and
increase the size of the field." Plus "give a run option".

- **Field** 32 → 48 units (`GROVE.size`, `SIM.worldHalf` 22). New layout: pond at (7, 6)
  r 5; four trees; four hills (the big one at (16, -16) carries the waterfall); cottage
  (-7, 14), school (-3, -18), dojo (18, -4), well (3, 10); NPC homes, bushes, logs and
  decor spread to match; particle ranges follow the size.
- **Stream** (`GROVE.river`): an inflow from the waterfall pool into the pond and an
  outflow to the south edge, built as ribbon meshes (`ribbon()` in `grove-scene.ts`)
  with UVs along the flow so the wave tile scrolls downstream; painted banks (sand, wet
  band, dark grass edge) in the ground texture; a plank bridge (`GROVE.bridge`) where the
  path to the dojo crosses.
- **Water**: `makeWaterTexture16` (crests with lit tops and dark troughs, deeper patches),
  a transparent `makeWaterGlintTexture` layer drifting the other way, a lit shallows ring
  at the bank; the same materials on the pond and the stream.
- **Hills**: three tiers with `makeCliffTexture` (strata, jutting rocks, cracks, moss, a
  grass lip) repeated by each tier's circumference, `makeGrassTopTexture` on top, scree
  painted at the foot.
- **Run**: `keeper.running` (saved), `setRunning` command, `KEEPER.runMultiplier` 1.8, a
  🏃 Run toggle bottom-left and Shift hold on keyboards, a faster walk cycle.
- The path network now reaches every building, the bridge and the far tree.

## Graphics upgrade toward 16-bit top-down RPG art (2026-10-13)

Maor's reference: a professional top-down RPG tileset (dense multi-tone grass, rounded
dirt paths with rims and pebbles, layered round tree canopies with highlight clusters,
terraced cliffs, shore bands, cottages with tiled roofs, fences, crop rows, chunky outlined
characters). What changed:

- **Scenery as pixel sprites** (`render/sprites/scenery.ts`, placements in
  `render/scenery.ts`): two tree variants (layered lobes, dark underside, highlight
  clusters, fruit), two bushes, a cottage with a tiled roof, chimney, flower boxes and a
  round door, the kindergarten hut with a bell gable and sign, the dojo with a double roof,
  round window and noren curtains, a well, logs. Billboarded through the one sprite batch;
  trees sway; trees and buildings are tappable (tree → shake; school → Kindergarten,
  dojo → Karate, cottage → Pocket mode). The 3D lobed trees and bushes are gone from the
  Grove (the Hollow keeps its dark 3D wood).
- **Ground** (`render/ground.ts` rewritten): three-tone grass drifts with 1,400 fine tufts,
  flower and clover clusters, rounded paths with a pale centre, a dark rim and a grass edge,
  a sand shore with a wet band around the pond and the pool, stone pads under the
  buildings, a crop plot of soil rows and sprouts by the cottage, shade under trees and
  bushes, pebbles along the paths and shore, fence posts along the main path.
- **Hills** are terraced plateaus: two tiers with a strata cliff texture on the sides and
  grass on top, instead of smooth spheres.
- **Keeper sprites**: pants seam, lit boot soles, shirt highlight and shade, collar, belt
  with a buckle, cuffs, hair under the hat and over the ears, eyes with whites, brows, a
  mouth and a jaw shadow.
- **Water**: wave crests with lit arcs and dark troughs.
- Decor placement keeps clear of the buildings and the crop plot.
- `PREVIEW_SCENERY=path.png npx vitest run tests/tools` renders every scenery piece and a
  Keeper strip.

**Still thinner than the reference:** no cliff tiles painted into the ground (the hills are
3D), no roof-side perspective on the buildings (billboards face the camera), the Nubbin
sprites were not touched in this pass.

## Everything that was left, the ten recommendations, settings and interactions (2026-10-13)

Maor: "Complete what is not built yet. Then do all 10." Plus mid-turn: settings sliders and
missing settings, more Nubbin interactions, and a logins/multiplayer plan (plan only).

**Built (what works):**

- **Weather** (`sim/weather.ts`): clear spells, rain, snow in winter; seasons from the real
  calendar. In rain most Nubbins shelter under a tree (`shelter` state, a little happiness),
  swimmers go to the pond and gain Swim lean. Rain streaks and splashes, snow flakes that
  settle, a cooler grade and a darker rig. Debug: `debugWeather`.
- **Breeding** (`sim/breeding.ts`): heart fruit in the shop (80 Shells) or from a visitor;
  feed it to an adult with affection 30+ (never an Eternal); it courts for 90 s and makes an
  egg with any adult within 2.5 units. The egg takes a parent's colour and lineage, mixes
  grades (the better one half the time), has a shine chance, records parents and
  generation. Roster cap applies.
- **Kindergarten** (`sim/kindergarten.ts`, More → Kindergarten): four lessons at 25 Shells,
  45 s each, three levels; a schooled Nubbin performs idly (star ball). Doctor (15) prints
  the hidden numbers; fortune teller (20) reads the likely adult form, personality and
  whether rebirth is in the cards.
- **Karate** (`sim/karate.ts`, More → Karate): a timing-bar bout on a dojo canvas; Power,
  Stamina and Run decide damage, HP and dodges; three tiers, belts, prizes; per-Nubbin and
  per-Grove records; Leave/Escape; own music.
- **Collection book** (`sim/collection.ts`, More → Collection): every species and Chao
  form seen, silhouettes for the rest, toasts on first sightings.
- **Decorating** (`sim/decorate.ts`, More → Decorate): fence, flower bed, bench, statue,
  path stone, garden lantern; buy, then tap the grass to place (snaps to half units, keeps
  off the pond and trees), tap a piece to pick it up; a placing chip with Done.
- **Daily rhythm** (`sim/daily.ts`): once per real day a Keeper visits with a gift (Shells,
  fruit, an egg, a heart fruit) and potters about; Saturday is lantern night.
- **Share codes and trades** (`sim/share.ts`): roster → Share code copies a checksummed
  code; Trade away sends the Nubbin off for good; More → Receive pastes one in (fresh id,
  free name, roster cap).
- **Photo mode** (More → Photo): a framed pixel snapshot with name, form, age and date,
  saved as PNG. **Memorial cards**: tap a flower to read who it was, what they grew into,
  how long they lived, rebirths, and how long ago they moved on.
- **Pocket mode** (More → Pocket, or `?pocket`): one Nubbin close up with meters and
  quick actions, a picker for the others.
- **Campaign places**: chapter 8 moves to the Hollow (dark wood, fireflies, strays, Hazel's
  notebook on a flat stone to tap; the Expedition runs through the Hollow theme), chapter 9
  to Corvin's garden (pale pens, thirty grey rows, Corvin and Ember). Back to the Grove at
  chapter 10. Hidden scenery cannot catch taps.
- **Per-chapter music**: sorrow (6, 11, ending), tense (5, 9, Corvin's garden), hollow,
  karate; four new pieces in `platform/audio.ts`.
- **Bitmap font** (`render/sprites/font.ts`): a 5×7 pixel font for the race, Expedition,
  karate, photo and pocket canvases. The DOM HUD keeps the system font.
- **Hats** got fine-grid weave, jewels and ribs. Species eyes were done in the previous pass.
- **Interactions** (stats sheet, pocket mode): tickle, hug, brush, high five, praise, tuck
  in (only when tired), call (the Nubbin, or everyone, comes running), play catch (throws
  the ball, the Nubbin fetches it back), heart fruit. A wary Shadow refuses the touchy ones.
- **Settings**: music and effects volume sliders, story text speed, screen shake, particle
  density, reduced-motion override, fullscreen, back to title.
- Tests: 170 Vitest cases.

**Not built, by design:** logins, cloud save and online visiting need a backend; the plan
is in `docs/multiplayer-plan.md` (Supabase, optional accounts, cloud save by newest,
read-only visiting with a mailbox, escrowed trades, leaderboards).

**Known gaps:** the pocket mode is a panel, not a home-screen widget; decorations are
sprites, not collidable; the doctor and fortune teller show their reading in the panel
right away (the Shells are taken by the sim). The desktop browser pane kept executing a
stale `kindergarten.ts` after the save-compat fix; the dev server was restarted.

## Score, settings, environment and eye pass (2026-10-13, after the 540p move)

- **Music** (`platform/audio.ts`): an original score on a small Web Audio sequencer. Six
  pieces in a readable note notation: `grove` (garden waltz, day), `night` (music box),
  `title` (rising brass motif), `race`, `expedition`, `story` (under dialogue). Synth
  voices: lead, pluck, bass, pad, bell, brass, kick, snare, hat, through an echo, a
  generated hall and a compressor. The HUD loop picks the piece (dialogue > minigame >
  hour). Written in the spirit of the cozy-garden and big-adventure scores Maor named;
  nothing quoted.
- **Settings:** Music and Sound effects are separate switches (`settings.music`, defaulted
  in `validateWorld`, no save version bump). A ✕ Leave button (and Escape) exits the
  Expedition or a race at any time; an early leave keeps the shells collected so far and
  counts a race as last place with no prize.
- **Environment:** gradient sky textures per phase with pixel clouds by day; trees are a
  bark-textured tapered trunk with roots and a crown of seven leaf-textured lobes (two
  greens); bushes are leaf-textured lobes; mossy rocks at the hill feet; tall grass along
  the edges, reeds on the pond rim, lily pads on the water; the ground texture gained
  blade clusters, clover, damp shade around the water and worn path rims.
- **Eyes/glitch pass:** angry creature eyes are a narrowed eye with a brow, iris and
  glint; dot eyes a bead with a glint. `PREVIEW_ANGLES=path.png npx vitest run tests/tools`
  renders every angle and clip for a few looks; nothing stray showed at 64 px.

## What is not built yet

Only the server-side pieces: logins, cloud save, online visiting (see
`docs/multiplayer-plan.md`). Everything else from the earlier list is built as of 2026-10-13.

## Recommendations (from the games this one grows out of)

1. **Kindergarten lessons (Chao Garden):** drawing, singing, dance and instrument classes
   that teach a Nubbin a skill it performs idly in the Grove. Cheap to add on the existing
   `skills` field and the idle state machine; big charm return.
2. **Karate tournament (Chao Garden):** a third minigame on the race screen's bones, with
   Power and Stamina deciding the bouts and belts as prizes; `karateRecord` is waiting.
3. **Breeding with genes (Chao Garden, Monster Rancher):** two adults near a heart fruit
   produce an egg inheriting colour, shiny and stat grades; the `genes` field exists and
   the catalogue already has 60+ looks to recombine.
4. **Collection book (Pokémon's dex, Digimon's field guide):** a page per species and
   Chao form seen, with hatch and evolution hints; turns the 100+ looks into a goal.
5. **Garden decorating (Animal Crossing, Viva Piñata):** buy and place fences, paths,
   flowers and toys; the decor layer and shop are ready, placement needs a drag mode.
6. **Daily rhythm and events (Animal Crossing, Neko Atsume):** visiting Keepers with
   gifts on real-clock days, a weekly lantern night, seasonal fruit; the real-clock
   daylight and NPC system already carry most of it.
7. **Weather (Stardew Valley):** rain that fills the pond, makes Nubbins shelter under the
   trees and raises Swim lean; snow in winter; a few particle kinds and a grade tint.
8. **Doctor and fortune teller (Chao Garden):** a hidden-stats readout for Shells and a
   naming/personality reading; both are small UI panels over existing data.
9. **Share codes (Tamagotchi's connection, Digimon's battles):** export a Nubbin as a
   short code a friend can import as a race rival or a visiting guest, no server needed.
10. **Photo mode and memorial garden:** a framed snapshot with the Nubbin's name and
    form, and a spot where memorial flowers can be visited and read; the departures are
    the game's most emotional moments and deserve a place.

## Ten more recommendations, from Pokémon Pokopia (2026-10-13)

Pokopia (Switch 2, March 2026) is a combat-free life-sim sandbox: you play a Ditto in human
form, gather wood, stone and fibre, craft furniture, fences, paths and buildings, terraform
blocks into habitats (forest, water, rocky slope, open field) that attract specific
Pokémon, borrow their moves (Water Gun waters crops, Leafage grows grass, Cut and punch
clear trees and rocks, Surf and Glide for travel), farm crops that feed residents, take
requests from residents (repair a bridge, fix a building), and play drop-in with up to
four people on a real-time day-night cycle with weather.

1. **Habitats that invite species:** shape patches of the Grove (pond edge, rocky corner,
   flower meadow, dark thicket) and have wild pocket- and digital-line creatures wander in
   to settle when the patch suits them, instead of only hatching from eggs.
2. **Gathering and crafting:** wood from shaken trees, stone from the hill rocks, reeds
   from the pond, turned into the decor pieces, toys and hats at a workbench, so Shells are
   not the only economy.
3. **Terraforming tiles:** a tile painter for grass, dirt, water and flowers on a grid, so
   the pond and paths can be reshaped; the ground texture already renders from a grid.
4. **Borrowed moves (Chao-style):** a bonded adult lends its Keeper an ability: a Swim
   type lets you wade the pond, a Fly type glides off the hills, a Power type shakes whole
   trees at once, a Run type sprints. Ties the stats to how you play.
5. **Crops:** till a plot, plant seeds from Expeditions, water it (or let rain do it), harvest
   stat fruit; Nubbins with a watering lesson help.
6. **Resident requests:** a board of small asks from Nubbins and visiting Keepers (bring
   three fruit, fix the fence, find my lost ball), paid in Shells and friendship.
7. **Buildings:** a workshop, a nursery for eggs and a bathhouse that each unlock features
   (crafting, faster hatching, grooming), placed like decor and built over sim time.
8. **Real-time weather tied to activities:** rainy-day lessons, snow-day sledding on the
   hill, dry-spell watering chores; the weather system already runs.
9. **Drop-in local co-op on one screen:** a second Keeper on a gamepad or touch split,
   sharing the Grove; no server needed and a bridge to the multiplayer plan.
10. **Photo spots and a world map:** landmarks to discover (the stone in the Hollow, the
    waterfall ledge), each a photo-mode backdrop and a fast-travel point once found.

## Campaign mode and the graphics upgrade (2026-10-13)

Maor approved the plan ("go now"): graphics first, then a full story campaign with at
least six endings and a treat-them-well mechanic. Resolution stays 270p (32 px sprites);
**Decision (Maor, 2026-10-13): 64 px (540p).** Done the cheap way: every drawer keeps its
32 px design coordinates and `PixelCanvas` rasterises them on a 2× grid (`PX` in
`pixel-canvas.ts`): curves come out smooth, outlines and highlights are one fine pixel
wide, and drawers add detail on the fine grid (`dot`, `thinLine`, fractional ellipses).
The Chao face got an iris, pupil and two glints, a thin smile, cheeks and a belly
highlight; big and cute creature eyes got an iris too. Frame height 540, pixels per unit
16/32, mega atlas 4096², post-pass blur radii doubled, minigame canvases draw at 2× with
art scaled back to design size. The 32 px look remains reachable by setting `PX = 1`.
The earlier samples (`chao-hires.ts`) were removed once the real drawers hit 64 px.

**Graphics passes (what works):**

- HD-2D post pass (`render/post.ts`): bloom, tilt-shift, vignette, colour grade, all at
  frame resolution. Time of day from the real clock (`render/daylight.ts`): dawn/day/
  dusk/night sky, light rig, grade, lanterns and fireflies; debug buttons force an hour.
- Particles (`render/particles.ts`, one draw call through the sprite batch): dust on
  landing and footsteps, hearts on petting, sparkles for hatch/evolve/Eternal, crumbs,
  leaves and petals from shaken trees, ripples under swimmers, fireflies at night,
  drifting leaves by day, waterfall spray. Reduced motion drops the ambient layer.
  Sprites dim with the darkness of the hour.
- Motion: eight-frame breathing idle with a blink, six-frame walk (contact / push-off /
  passing with lift and squash), draw-time landing squash and hatch/evolve pop.
- Environment: one 256×256 ground texture with grass patches, ragged dirt paths from the
  start to the pond and trees, pebbles and flowers; seeded decorations (tufts, daisies,
  bluebells, pebbles, mushrooms, stumps, a signpost) drawn as sprites.
- Pixel UI: 2 px borders, stepped corners and bevels on every panel and button.
- Palette grew to 48 colours with hue-shifted ramps; every generated sprite gets a light
  pass and a coloured outline.

**Campaign "Hazel's Grove" (what works):**

- Own save slot (`grove.save.campaign`); the title screen offers Campaign / Free Grove,
  Continue or New, and the Keeper choice for a new campaign. `?free` skips the title.
- Trust per Nubbin (`sim/trust.ts`, tuning `TRUST`): pets +3, hand-feeds +4, throws −8,
  drops −3, starving −1.5/min, crying −0.5/min. Under 15 → **Shadow** (grey coat, ember
  eyes, dark emote ball, keeps 4 units from the Keeper, never greets; for life). Shadow
  gains trust at 60% until it **bonds** at 70 (dark heart ball, loves again). Under 5
  for ten minutes → **runs away** into `world.strays`; strays return to the Grove edge
  after twenty minutes with `stray: true` and settle when fed or petted. Stats sheet
  shows a Trust meter and a Shadow / bonded / Stray tag.
- `sim/campaign.ts`: twelve chapters (`config/story.ts`), each an opening scene, a goal
  and a closing scene; triggered scenes (first Shadow, run-away, stray return, Sable
  bonding, first pet of Moss); NPC Keepers (`sim/npcs.ts`: the nine other trainers plus
  Corvin and Hazel) who potter near a home spot and face you; tap to talk. Lantern posts
  are tappable (`lightLantern`) and glow once lit. Moss (Eternal Neutral) and Sable (a
  Shadow stray) are real Nubbins in the roster. Eight endings decided from flags; see
  `docs/campaign-endings.md` for how to reach each one (also on the Journal's Paths
  page).
- UI: dialogue box with portraits (Keeper sheets, Moss and Sable's own sprites),
  typewriter text (instant under reduced motion), tap/space to advance, choice buttons;
  Journal (📖) with goal, hint, Sable/Moss trust, friends, chapter list, Paths; ending
  card; story toasts; debug buttons for chapter jumps, campaign start and Trust −40.
- Save v2 with a 1→2 migration (trust fields, strays, npcs, campaign).
- Tests: 155 Vitest cases, including trust/Shadow/run-away/return, the migration, every
  ending driven through the state machine, story data integrity.

**Stubbed / left out:** parallax sky and weather; a bitmap font (the system font stays);
Corvin's garden and the Hollow are told in dialogue rather than built as scenes; the
expedition is not reskinned for chapter 8; music does not change per chapter.

**Known bugs / notes:** the browser pane sometimes grabs a cleared frame right after a
burst of console-driven frames (a blank blue screenshot); a second screenshot is fine.
Two stale "500" console errors in the pane came from mid-edit HMR, not from the app.

**Assumptions:** the ten trainers double as the story cast; the player's own Keeper hands
their lines to an understudy (`UNDERSTUDY` in `config/story.ts`). Adult themes were
allowed by Maor: Hazel's illness and death, Corvin's cruelty, grief and guilt, no gore.

## After v1: optimisation, optional items, three creature families, ten Keepers (2026-10-12)

Maor's follow-up ask, done in order:

1. **Optimised for PC web and Android.** One mega atlas (2048²) and one `SpriteBatch`
   mesh draw every sprite in a single draw call (`render/sprite-batch.ts`); CPU picking
   over projected quads; integer pixel scaling (`computeTargetSize` picks the frame so
   the CSS upscale is a whole number, e.g. 390×844 → 130×282 at ×3); no tap highlights;
   F toggles fullscreen on PC; debug shows draw calls and a "Fill roster" button.
2. **Optional items.** The Keeper stops at the shoreline (`shoreline()` in keeper.ts);
   an on-screen joystick (Settings, off by default); a quiet procedural music loop under
   the Sound setting.
3. **Pocket line** (`sim/species.ts`, family `pocket`): the baby lines Pichu, Cleffa,
   Igglybuff, Togepi, Tyrogue (branches by type), Smoochum, Elekid, Magby, Azurill,
   Wynaut with their evolutions, and the fossils Omanyte, Kabuto, Aerodactyl, Lileep,
   Anorith with theirs: 35 species.
4. **Digital line** (family `digi`): the 1997 Ver.1 pet, Botamon → Koromon → Agumon /
   Betamon → seven champions → MetalGreymon / Mamemon / Monzaemon: 14 species. Branches
   by type; poor care (negative lifetime happiness) gives the slug.
5. **Ten Keepers** (`sim/trainers.ts`): Fern, Marina, Sparks, Clover, Pixel (Sun) and
   Luna, Ember, Byte, Dusty, Nova (Moon). Each has a look (hat style + palette) and an
   egg table by family with a favourite type; new eggs follow the active Keeper. Dusty
   only hatches fossil lines. The Keepers menu (☀/☾ button) replaces the Sun/Moon toggle.

**How the extra lines map onto the life cycle.** An egg hatches as the line's hatchling.
A hatchling with a second baby form (Botamon → Koromon) grows into it after 10 minutes.
Evolution (child → adult) gives the grown form, the second evolution an hour later the
next one (Pikachu → Raichu, Agumon → Greymon), and champions take their final form three
hours into adult life (Greymon → MetalGreymon). Rebirth returns to the lineage's
hatchling. Chao-line rules (bands, types, parts, grades, Eternal) still apply to stats;
other families change species instead of form.

**Art.** `render/sprites/creature.ts` is a generic chibi drawer (body plans round,
biped, tall, shell, serpent, slug, stalk + parametric ears, tails, crests, wings, arms,
legs, eyes, markings); `species-art.ts` holds the 49 specs. They are approximations by
colour and silhouette, not traced sprites. Preview every species to a PNG with
`PREVIEW_SPECIES=path.png npx vitest run tests/tools`, or open `?sprites`.

**Names.** In-game species names are original (`SPECIES_LABELS` in strings.ts); the
inspiration is data in `species.ts`. Switching to the real names is a strings change.

**Risk noted to Maor.** Nintendo and Bandai are not Sega: public fan games using Pokémon
have been taken down before. The build is public on GitHub Pages at Maor's decision.

## M5 Races, personality, polish — BUILT (2026-10-12, tag `m5`)

**Done when:** every acceptance check in CLAUDE.md passes. The automated ones do (see
"Acceptance checks" below). The manual device pass is Maor's: iPhone Safari (browser and
home screen), Android Chrome, desktop Chrome/Safari/Firefox, 60 fps with 8 Nubbins,
blocked storage, no console errors. The build is deployed for that pass.

## M4 Expedition and shop — COMPLETE (2026-10-12, tag `m4`)

**Done when:** a run is fun on a phone and its rewards reach the Grove. Rewards verified
in the browser (results screen → Shells, Essences and Critters in the inventory) and in
`tests/sim/expedition.test.ts`; the run logic is deterministic, a tap jumps and a hold
jumps higher, obstacles cost Shells and never end the run. The "fun on a phone" half
still needs Maor's thumb on the deployed build (see Next steps). 109 tests, lint, build
pass.

## M3 Life cycle — COMPLETE (2026-10-12, tag `m3`)

**Done when:** egg → adult → rebirth → adult keeps everything correctly, and Eternal
follows the rules exactly. Verified by `tests/sim/lifecycle.test.ts` (a full life at
×1000: name, 10 % of points, grades, affection and rebirth count kept, heart greeting;
departure leaves a memorial; Eternal only with 2+ rebirths, Normal type and alignment

> 0.8 / < −0.8 / within 0.1 of 0, and never otherwise; Eternals never age; offline end
> of life waits with departures off, departs with it on, rebirths always happen) and in
> the browser (forced end of life → fading cocoon → flower; loved adult → golden cocoon →
> egg → hatch with a heart). 97 tests, lint, build pass.

Earlier the same day: M1 (tag `m1`) and M2 (tag `m2`), see the sections below.

**Live:** https://diablomaster8.github.io/TryThisGame/ (repo
https://github.com/diablomaster8/TryThisGame, Pages source: GitHub Actions).

## Art direction (Maor, 2026-10-12)

The Nubbins are Chao-faithful fan art (CLAUDE.md was updated). The full Chao catalogue
and where it lands:

| Forms                                                                | Count         | Milestone |
| -------------------------------------------------------------------- | ------------- | --------- |
| Eggs: normal + shop colour variants                                  | 1 + ~20       | M1 / M4   |
| Child: Neutral, Hero-leaning, Dark-leaning                           | 3             | M1 ✓      |
| Adult first evolution: Neutral/Hero/Dark × Normal/Swim/Fly/Run/Power | 15            | M2 ✓      |
| Adult second evolution: type-pair overlays                           | 60 (75 total) | M2 ✓      |
| Chaos Chao: Light, Dark, Neutral (the Eternals)                      | 3             | M3 ✓      |
| Character looks (fox, echidna, rose, dream)                          | 4 unlockables | M5 ✓      |
| Egg colours, shiny and two-tone colour variants                      | 5 colours × 3 | M5 ✓      |

The art is drawn in code from memory (`src/render/sprites/chao.ts`), never from copied
assets. Reference images dropped into the project would let the drawer be matched closer.
Check any sheet at `?sprites` (developer gallery).

## What works (M0 + M1)

- **Scaffold / pipeline / camera / controls** (M0): see git history. Camera now re-applies
  its pose every frame and follows the Keeper.
- **Sim core** (`src/sim/`, no DOM, no Three.js, ESLint-guarded):
  - `types.ts` plain-data world with the v2 future fields (`genes`, `skills`,
    `karateRecord`) empty by default.
  - `rng.ts` mulberry32, one serialisable state word, stored in the world.
  - `clock.ts` fixed 100 ms steps, time scale ×1–×1000, per-frame step cap with coarse
    overflow.
  - `world.ts` commands in, events out. Trees drop fruit, items fall, Keeper intents.
  - `needs.ts` hunger 20 min, energy 40 min, naps 3 min, happiness −100..100 with drift,
    affection 0..100; moods for the face and emote ball.
  - `stats.ts` grades E–S with multipliers, 99-level cap. `alignment.ts` ±0.01 nudges,
    bands at ±0.5, type-lean winner with the 15 % margin.
  - `lifecycle.ts` egg → child (60 min) → cocoon (30 s) → adult; evolution picks the form.
  - `behavior.ts` wander, find food, eat, nap, sit, greet, cry, swim, react, held,
    carried, thrown. Throws arc with gravity; landing hurts.
  - `keeper.ts` walk by tap target or input vector, intents (pet, pick up, feed, shake
    tree, collect) executed on arrival, carrying above the head.
  - `save.ts` v1 with an (empty) migration table, validation/defaulting, fingerprint.
  - `offline.ts` catch-up: fine steps under 3 min, 1-minute coarse steps beyond; modes
    indefinite/capped/off; Nubbins eat tree fruit while away; evolutions reported.
- **Sprites** (`src/render/sprites/`): index-buffer PixelCanvas, atlas builder,
  8-view angle table (5 drawn + 3 mirrored), Chao child with 8 clips + 3 stills in neutral
  / Sun / Moon palettes, adult recolours for all 15 first evolutions, 6 egg colours with
  wobble/crack frames, cocoon, Sun/Moon Keeper, fruit, flower, emote ball shapes.
  `SheetCache` keyed by style; `sheetFromImage` for hand-drawn sheets later.
- **Render**: Grove scene (grass, pond, hills, 2 trees, waterfall, bushes), SpriteView
  billboards with UV frames and ground shadows, WorldView with step interpolation.
- **Input**: tap ground to walk, tap Nubbin to select, tap fruit to collect, tap tree to
  shake, drag Nubbin to lift / throw, shake by reversals, WASD/arrows relative to the
  camera, space shakes a carried egg. Two-finger gestures still rotate/zoom.
- **UI**: top bar (logo, Shells, fruit, Settings), stats sheet (meters with icon+label,
  stats with grades, Pet / Pick up / Put down / Feed / Shake, rename), Settings (Aging
  while closed with validation, departures toggle disabled when mode is off, export /
  import / reset save), While you were away, debug panel (` or triple-tap logo), toasts,
  carry chip, catch-up overlay.
- **Game loop** (`src/game.ts`): autosave every 30 s and on hide/pagehide, catch-up on
  load and on tab show, storage failures only toast.
- **Growth (M2)**: `sim/critters.ts` with the 15 species (3 per type, each with its
  part slots), `giveCritter` / `giveEssence`, type lean; `lifecycle.ts` evolution with
  the permanent grade upgrade, Sun/Moon Grove unlocks and the second evolution an hour
  into adult life; `world.grove` + `setGrove`; swimming trains Swim lean slowly.
- **Sprites (M2)**: `layout.ts` (shared geometry + `ChaoShape`), `parts.ts` (parametric
  ears/tail/arms/back for every species at all five angles), type silhouettes (Swim
  head fins, Fly big wings, Run legs, Power wide body and hands), second-evolution
  lighter touches; sheet keys include type, second and parts.
- **UI (M2)**: Give section on the stats sheet (critters and essences from the
  inventory), Keeper switch (☀/☾) and Grove switcher in the top bar (shown once a Grove
  is unlocked), evolution celebration card, debug +critters / +essences.
- **Life cycle (M3)**: `lifecycle.ts` runs the end-of-life check at 5 h of adult life
  (`runEndOfLife`): rebirth cocoon → `rebirth()` (egg again, same name, 10 % points,
  grades + upgrades, affection, rebirths +1, heart greeting on hatch) or departure
  cocoon → `depart()` (removed, memorial flower at its spot). `eternalBandFor` applies
  the Eternal rules at evolution; Eternals skip aging. Offline: `awaitingKeeper` freezes
  the adult at the check when departures are off; live play re-runs the check on screen
  (a Nubbin loved in the meantime is reborn instead). `TYPE_LEAN.minToCount` (20) keeps
  incidental pond time from making Swim types.
- **Art/UI (M3)**: three cocoon looks (evolve / rebirth glow / depart fade), Chaos-form
  palettes with great wings for Eternal Sun / Moon / Neutral (+ a star emote), memorial
  flower sprites, toasts and away-screen lines for cocoons, rebirths, departures,
  Eternals and waiting Nubbins; the sheet shows ✦ Eternal and "Waiting for you".
- **Expedition (M4)**: `src/minigames/expedition/run.ts` is pure, seeded, fixed-step
  logic (scroll with a gentle speed ramp, variable-height jump, patterns of shells,
  obstacles with shell arcs, essences, critters in bubbles). `screen.ts` draws it on a
  low-res 2D canvas (height 270, width from the aspect, letterboxed) with parallax
  clouds, hills, a grassy ground row; the runner is the selected Nubbin's own side-view
  walk/flap frames. Tap or hold the canvas, or space/↑/W. Results screen → `addRewards`.
  The Grove keeps simulating underneath with rendering paused.
- **Shop (M4)**: `sim/shop.ts` (fruit, egg with a 15 % rare colour chance and the roster
  cap of 8, hat into the collection, ball toy with a cap of 3) and `ui/shop.ts`.
- **Toys (M4)**: `play` behavior: walk to the ball, bat it around, a little happiness.
- **Races (M5)**: `sim/race.ts` with 3 courses built from swim / fly / run / climb /
  stamina-stretch sections, each checking its stat; stamina drains into a 1.5 s rest;
  3 tiers with 4–8 seeded rivals whose levels scale with the tier; cheer boost (×1.45
  for 1.2 s, once per 3 s); prizes 20/10/5 Shells × tier and a hat on a win; winning a
  tier unlocks the next (`world.races`). `minigames/race/screen.ts` draws a side view
  with lanes stacked in depth on the same low-res canvas style, a big Cheer button
  (space on desktop), live placement and the player's stamina bar.
- **Personality (M5)**: `sim/personality.ts` decides Cheerful / Shy / Mischievous /
  Lazy at evolution from childhood pets, throws and feeds, and only shifts idle odds
  (greet, play, sit, swim).
- **Roster (M5)**: `ui/roster.ts` with portraits, rename, stats with grades, age,
  rebirths, alignment word + icon, personality, hat picker ("wearHat"), Go to.
- **Hats (M5)**: five styles drawn on the crown at all angles (straw, crown, beanie,
  flower, bucket); bought in the shop or won in races.
- **Sound (M5)**: `platform/audio.ts` synthesizes blips (no audio assets); muted until
  the first tap or click; a Sound toggle in Settings lives in the save.
- **PWA (M5)**: `public/manifest.webmanifest`, generated icons (`tests/tools/
make-icons.test.ts` with `MAKE_ICONS=1`), hand-rolled `public/sw.js` (stale-while-
  revalidate, offline shell), registered only on the built site.
- **Reduced motion**: instant camera snaps, no toast/celebration animation, no meter
  transition.
- **Tests**: 119 Vitest cases (+1 skipped icon writer).

## Acceptance checks (CLAUDE.md v1)

Automated, all green in `npm test`: grade multipliers; the 99 level cap; 10 % carried
over on rebirth; type-lean and alignment thresholds; a full life at ×1000; Eternal when
met and never otherwise; save export → import identical (round-trip fingerprint);
older saves migrate (the table is empty at v1, the loader defaults missing fields);
aging while closed in all three modes; the 7-day indefinite catch-up under 3 s; with
departures off no departure during catch-up and the check runs live.

Manual (Maor): iPhone Safari in the browser and installed to the home screen; Android
Chrome; desktop Chrome, Safari, Firefox; 60 fps with 8 Nubbins; blocked storage does
not crash (the storage wrapper swallows errors and toasts once); no console errors; no
names, art or audio from an existing franchise (the Nubbins are Chao-faithful fan art
by Maor's decision; names, music and sound are original).

- **Colour variants and looks (M5 polish)**: an egg's colour is the Nubbin's body colour
  for life (`variantColors`), kept through evolution with Sun/Moon adjustments; rare
  shop eggs can be two-tone (belly and tips from a second colour) or shiny (sparkles,
  white outline). Four character looks (fox, echidna, rose, dream) are palette + head
  accessory sets worn like hats and won at race tier 3. The roster shows all of it.
- **Preview tooling**: `PREVIEW_OUT=path.png npx vitest run tests/tools` renders a
  contact sheet of looks to a PNG (no browser needed); `tests/tools/png.ts` is the
  encoder shared with the icon writer.

## What's stubbed

- `vite-plugin-pwa` 2.0 supports Vite 8 but pulls in workbox; a 40-line service worker
  does the job for v1. Swap if precache manifests are wanted.
- An on-screen joystick (optional per CLAUDE.md) is not built; tap-to-move covers phones.
- The character looks use original names (fox, echidna, rose, dream) and silhouettes;
  closer likenesses are a palette tweak away in `CHARACTER_LOOKS` if wanted.

## Known bugs / open items

- The Keeper walks straight through the pond to reach a swimming Nubbin. Add a shoreline
  stop or let the Keeper wade visibly (M2 polish).
- The Claude desktop browser pane throttles `requestAnimationFrame` to 0–3 fps, so
  time-based checks there were driven by calling `grove.frame()` from the console. On a
  normal browser the loop runs at the display rate.
- Portrait phones get a 125 px-wide frame. Revisit once the Grove is busier.
- Non-integer CSS upscaling can give uneven pixel columns; the render-target fallback is
  still the documented option in `pipeline.ts`.

## Assumptions made (not stated in CLAUDE.md)

- Camera is orthographic; billboards tilt back by the pitch (see M0 notes).
- Dragging lifts the Nubbin under the pointer without the Keeper; the Keeper carries via
  the sheet's Pick up button. Both are "pick up"; the sheet route is the kid-friendly one.
- Feeding uses the fruit inventory (collected by tapping fruit on the ground). A hungry
  Nubbin also eats ground fruit on its own.
- Happiness drifts toward 0 by 0.5/min so moods fade. Starving costs 2/min.
- The adult form rule (band × winning type) already runs in M1 so catch-up can report
  evolutions; the grade upgrade and Grove unlocks join it in M2.
- `src/platform/storage.ts` is a small folder outside the CLAUDE.md tree for the
  localStorage wrapper; sim/ must not touch storage.
- TypeScript stays at 6.0.3 until typescript-eslint supports 6.1+.

## Toolchain notes (this machine, 2026-10-12)

- Git 2.55 at `C:\Program Files\Git\cmd`; Node 24.21.0 via fnm at
  `%APPDATA%\fnm\node-versions\v24.21.0\installation`. Both on the user PATH; the Claude
  shell needs `$env:Path` prefixed with them.
- GitHub pushes work non-interactively (Git Credential Manager has the token).
- `npm run dev` then `http://localhost:5173/` (game) or `/?sprites` (gallery). In dev the
  game is exposed as `window.grove` for console poking.

## Next steps

0. ~~Resolution decision~~ Done: 64 px / 540p (see the 2026-10-13 section). Remaining from
   that: a visual pass on any species whose fine-grid eyes read oddly.
1. **Device test pass (Maor):** open https://diablomaster8.github.io/TryThisGame/ on
   Android Chrome and desktop browsers (PC web and Android are the targets now). Check
   fps with 8 creatures (debug "Fill roster"), the Expedition's tap/hold feel, a race
   in portrait, the joystick if wanted, and that nothing logs to the console.
2. Likeness pass on the pocket and digital species if any read wrong on a phone: each is
   a few lines in `species-art.ts`; the species preview PNG makes it quick.
3. Tests: 155 Vitest cases.
