# PROGRESS.md

Read this with CLAUDE.md at the start of every session.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

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

**Recommendation 11 (added to the Digimon-inspired list):** *Procedural dungeons.* A
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
   karate) can be *recruited*: it moves in, raises a prosperity meter and opens something
   (a stall, a gym, a bathhouse attendant, a fortune teller). Files-City-style: the
   town fills in visibly as the meter climbs.
2. **Care mistakes, made visible.** A gentle version of the hidden counter: ignoring a
   mood bubble for too long (hungry, sleepy, needs the pond, lonely) logs a "slip"; the
   stats sheet shows the last few. Slips weight the evolution toward the Grumpy or
   Sleepy forms (new lower-tier looks per type) and shorten the lifespan a little; a
   clean childhood unlocks the "well-raised" bonus grade.
3. **Training gym with mini-games.** Recruits run four stations (Swim lane, Fly rings,
   Run track, Power rocks): 20-second timing/rhythm games that give points to one stat,
   cost energy, and give *more* when the Nubbin is rested and fed (so the daily routine
   matters, like Digimon World's "train while hungry = mistake").
4. **Two partners and a merged form.** Pick a *partner pair* that follows the Keeper;
   both gain bond; at full bond with a bought "twine" they can merge for sixty seconds
   into a glowing ExE-style form for races and karate, then split (stats shared,
   nothing lost).
5. **Lifespan clock and curfew.** Nubbins sleep at night by the real clock unless the
   Keeper lights the lanterns; late play tires them (energy drains faster after
   midnight); a short "day count" on the sheet shows the age in days and what the
   typical span is for that line, so rebirth stops being a surprise.
6. **Rebirth inheritance tree.** Each rebirth keeps a chosen *memory* (one grade, one
   part, one lesson, one accessory) and records the lineage in a family tree on the
   profile; three generations of the same line unlock a heirloom look.
7. **Keeper skill tree.** Tamer-style points from achievements and quests buy small
   permanent perks (hatch 10% faster, fruit lasts longer, lessons cost less, a second
   carry slot), 24 nodes in four branches: Care, Garden, Games, Story.
8. **Scan and convert (DigiFarm-style).** Meeting the same wild species repeatedly fills
   a scan bar in the Collection Book; at 100% the Book can *convert* the scan into an
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
of life waits with departures off, departs with it on, rebirths always happen) and in
the browser (forced end of life → fading cocoon → flower; loved adult → golden cocoon →
egg → hatch with a heart). 97 tests, lint, build pass.

Earlier the same day: M1 (tag `m1`) and M2 (tag `m2`), see the sections below.

**Live:** https://diablomaster8.github.io/TryThisGame/ (repo
https://github.com/diablomaster8/TryThisGame, Pages source: GitHub Actions).

## Art direction (Maor, 2026-10-12)

The Nubbins are Chao-faithful fan art (CLAUDE.md was updated). The full Chao catalogue
and where it lands:

| Forms                                                             | Count            | Milestone |
| ----------------------------------------------------------------- | ---------------- | --------- |
| Eggs: normal + shop colour variants                               | 1 + ~20          | M1 / M4   |
| Child: Neutral, Hero-leaning, Dark-leaning                        | 3                | M1 ✓      |
| Adult first evolution: Neutral/Hero/Dark × Normal/Swim/Fly/Run/Power | 15            | M2 ✓      |
| Adult second evolution: type-pair overlays                        | 60 (75 total)    | M2 ✓      |
| Chaos Chao: Light, Dark, Neutral (the Eternals)                   | 3                | M3 ✓      |
| Character looks (fox, echidna, rose, dream)                       | 4 unlockables    | M5 ✓      |
| Egg colours, shiny and two-tone colour variants                   | 5 colours × 3    | M5 ✓      |

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
