# PROGRESS.md

Read this with CLAUDE.md at the start of every session.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

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
