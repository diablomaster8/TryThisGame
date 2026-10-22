# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-21)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content in `src/content/` (scripted is not shipped: `src/content/index.ts` is
read only by the checker and tests). What the game loads: campaign v2 and endings, all 31 side
stories, fun quests Q1–Q95, props and keepsakes, the Learning Grove switch, Hebrew and
Japanese, the four separate campaigns and E1–E3, Mature content, one-time gifts, and four
story worlds, each a lazy chunk with its own side save that never writes the Grove: Nova's
atlas (A1–A31), Pixel's cabinet (PA1–PA5, since 2026-10-18), the Multiverse rift (18+ only,
since 2026-10-18) and Neopia's rainbow gate (since 2026-10-18). Content: edu done wherever
audience and outline allow (none for Q66–Q95; they read their childLines); fix-mode reviews done
for Atlas A1–A10 and A22–A31 and every Atlas and S24–S31 edu version, the rest canon-audited
only (`docs/content-index.md`). Plan v4 (`plan.md`): G11 device pass, Track B writing and review
tasks; Part Z ran on 2026-10-18 (`docs/review-independent-2026-10-18.md`) and its fixes are
going in pass by pass. Review B (`docs/review-independent-2026-10-18-b.md`): Bugs 1–17 and
18–38 fixed on 2026-10-18 (both in the archive). Review C
(`docs/review-independent-2026-10-18-c.md`): major items 1–10 and minor items 11–29 fixed (both in the archive).
Maor, 2026-10-17: legal cleared, adviser sign-off given, the seven fun-quest quotes approved
as written, Pixel stays the default; 2026-10-18: ship the Arcade, the Multiverse, Neopia and
Q66–Q95. Waiting on Maor: the LB/LK decision (section "Pixel's Arcade
PA1–PA5" in `docs/progress-archive.md`). Decided 2026-10-18 (review B, item 16): original
sung verses are fine (only lyrics from existing songs are banned); Holy Grail's Q1–Q7 are one
storyline and keep all ten quotes, an exception to the three-quote cap. Backlogs: `docs/creature-improvements.md`,
`docs/content-index.md`. Maor, 2026-10-18: Full 3D is the flagship for the AAA art push (the
default renderer is not changed; passes 1 and 2 are on `main`, deployed since 2026-10-19). Review D
(`docs/review-independent-2026-10-21.md`): fixed 2026-10-21 except bugs 2–3 (share-code Eternals,
accepted by Maor). Maor, 2026-10-21: daily refreshes and free daily gifts are allowed; only
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below).

## Hollow Below art pass, items 1–45 (2026-10-21)

From `docs/hollow-graphics-recommendations-2026-10-21.md`. Agents A–H on `art/hollow-{a..h}` (plus
`c0`, the split), merged as `art/hollow`. Before and after: `docs/samples/hollow-art-before-after.jpg`.
Numbers in `DUNGEON` (`genVersion`, `layout`, `elev`, `water`, `crossing`, `vista`, `landmark`,
`special`, `explore`) and `GROVE3D.cave` (`bands`, `light`, `atmos`, `rock`, `dress`, `read`, `pixel`).
Works:
- **Layout (sim):** version-2 floors (`sim/dungeon-gen.ts`), 48×34 growing to 72×48, a great chamber,
  medium and small rooms, terraces and a pool basin (`Floor.elevation`, `elevationAt`), a landmark
  (5 kinds), vistas, bridges and stepping stones, the chest nook, rare special floors (crystal,
  flooded, glow-worm), an explored mask on the run. `DungeonRun.genVersion` keeps saved runs on
  their old floors (version-1 fingerprint test).
- **3D:** `hollow.ts` is assembly only; modules `hollow-rock` (tall leaning walls, triplanar,
  strata, edge wear, moss, wet sheen, a texture per band, floor on elevation, chunked vertex-colour
  bake), `hollow-light` (sconces with flame and halo, unlit sconces to light, instanced
  crystals and mushrooms, baked light with flicker, lamp cookie), `hollow-dress*` (landmarks,
  rounded stalagmites, arches, rails and cart, portal stairs, decals, worn path, roots and berries,
  murals, vistas, bridges, nook, crystal chimes, instanced loot), `hollow-atmos` (shafts, motes,
  water glow, drips and ripples with sound, basin fog, glow-worm stars, glow-bugs), `hollow-pop`
  (loot halos, explored-room glow). Light rig from `bandFor(depth)` (`render/cave-bands.ts`, four
  bands), bloom always on underground, cave vignette, exactly 4 point lights (`cave-lamps.ts`).
- **Governor:** underground it sheds particles, then triplanar, then bloom, aiming at 55 fps
  (`cave-shed.ts`, `GROVE3D.cave.light.governor`); render scale still only guards 30 fps. No sun
  shadow pass underground.
- **Pixel:** walls about 2.6× taller with strata, a moss lip and sconces, a sinking strip in front
  of the Keeper, band colours on floor and walls, dust, drips and embers (`render/cave-ambience.ts`),
  all five landmarks, vista lips, terraces as tone steps.
- **UI:** minimap (`ui/hollow-map.ts`): a 44 px Map button in the floor bar, M toggles, Escape
  closes, shapes and a legend for the Keeper, stairs and chest.
- **Bugs fixed on the way:** 3D drew every Nubbin underground (now the party only, like pixel); emote
  sprites wrote depth over their whole quad.

| 375×812, 4× CPU throttle, 8 Nubbins, dev server, 10 s windows | origin/main | art/hollow |
| --- | --- | --- |
| Full 3D (great chamber after; start room before) | 45.9 / 44.8 / 41.5, 45.5 / 44.6 / 47.3 | 51.7 / 50.3 / 50.2, 54.0 / 54.7 / 54.8 |
| Pixel | 56.6 / 56.6 / 56.5 | 56.7 / 56.6 / 56.6 |

Stubbed or short: 3D misses the 55 target by about 2 fps at 4× throttle, and holds it only with
particles, triplanar and bloom shed (unthrottled, everything comes back); the next lever would be
shedding creature outlines underground, an art call for Maor. The environment is 49 draw calls in
the great chamber (the cave's own meshes about 32, the rest scene and post passes). The pixel floor
paint still runs on the main thread (about 420 ms on floor 1, up to 800 ms on 72×48). Pixel crystals
are not taller; pixel landmarks do not take the band colours; a sconce lights when the Keeper
walks up to it, not on the tap itself; the falling drip streak is brief and easy to miss. Known
bugs: the 3D light-shaft foot can end in a hard line at a wall; the pixel sinking strip has an
angular top. Not checked on a real phone.

## Review D fixes (2026-10-21)

From `docs/review-independent-2026-10-21.md`. Branches `fix/review-d-{sim,core,ui,3d,bundle,docs}`
merged as `fix/review-d`. Works (sim items tested):
- **Sim:** end-of-life checks wait while the away screen is up, then run one at a time 4 s apart
  with an `endOfLifeFocus` event the camera follows (bug 1); Eternals never degenerate and a
  reverted adult gets no second upgrade (4); catch-up fruit uses the live interval (36); saved
  Keeper intents are cleared and never run in catch-up (37); Normal critters and essences add
  Normal lean (38); symmetric alignment rounding (39); debug evolve and end of life (40);
  `joinTeam` once (41); side stories honour Mature content; lantern posts are obstacles and
  NPCs hold still while a scene is queued.
- **Core:** saved ground painted on load and on import/reset, which also resyncs the Hollow (5);
  the loop restarts after a hidden-tab catch-up (6); pointer capture, pick slop and grab cursor
  (9); the Graphics pick survives blocked storage for the session, and the Settings switch says
  why it can't reload (13); shake and CSS animations follow the in-game reduced motion via
  `html.reduce-motion` (42); audio suspends while hidden (43); fullscreen and service-worker
  cache writes are caught (44); global error watch with a gentle toast (46).
- **UI:** clearer "hatch first" toast (7); language steps complete from their scenes and the
  friend arrives before Chapter 1 (8); bugs 18, 20–35 and the UI half of 40; every control at
  least 44 px; phone Close/Leave buttons at the bottom of the panel; toasts clear of headers;
  the docked desktop sheet aims the camera past itself.
- **Full 3D:** framed shots on hatch, evolve, cocoon and rebirth with posts and trunks thinning
  (10); campaign scenes framed with the speakers, NPCs held and the hour taken from the
  narration (11, `render3d/staging.ts`); a lit Hollow with emissive stairs, chest and loot (12);
  a real memorial flower (14); kit buildings (15); a side-on race (16); gold shells and solid
  wing films in the Expedition (17); a 3D photo portrait (19); Hollow materials cached (45).
- **Load:** each Learning Grove band is its own chunk (a sprout slot needs about 1.3 MB gzip
  before play, was 4.0 MB); a Free Grove with no story boots without waiting for story chunks.
- **Rules:** CLAUDE.md, `docs/brief.md`, `docs/canon.md` (22), `docs/content-index.md`,
  `STORY-BIBLE.md`, `plan.md` and the backlog prompt now allow daily refreshes and free daily gifts.

Gate: lint clean, 623 tests (11 skipped), build. Headless Edge at 1280×800 and 375×812 in both
modes: no console errors except three's own PMREM shader warning on D3D11 (bug 48; it comes
from three.js, left), no control under 44 px. Stubbed: no gate model, so Corvin "at the gate"
can't be staged; scenes carry no `set`/`time`/`at` staging data (3D reads the hour from the
narration); buildings don't fade as occluders; Klee One tracing alignment was checked with a
fallback font only. Known bugs: bugs 2 and 3 stay by decision. Not checked on a real phone.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

