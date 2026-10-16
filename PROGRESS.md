# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-15)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode. In progress: the full-3D
mode, now a real Graphics setting (Pixel | Full 3D) with `src/render3d/`; the pixel mode
ships unchanged. Latest pass: Part G8b, the toon stage mode and the line-up match, in progress. Waiting on Maor:
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
