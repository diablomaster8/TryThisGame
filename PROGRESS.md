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
repetitive daily quests are out. Hollow art backlog: `docs/hollow-graphics-recommendations-2026-10-21.md`.

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

## Full 3D art push 2: Hollow, buildings, sky, particles, rain (2026-10-19)

Branch `art/3d-pass-2` (off `art/3d-flagship`, not merged; ask Maor before `main`). Before and
after: `docs/samples/art3d-pass2-before-after.jpg`. Numbers in `GROVE3D.cave`, `.sky`,
`.heightFog`, `.rain`. Works:
- **Hollow (`hollow.ts`):** rock blocks bent by a world-space noise (shared corners move
  together, so no gaps) and flat-shaded, the rock texture laid on from the world position, moss
  on the tops; an earth floor darkened where it meets the rock; loose stones and spikes along
  the walls; pools in the painted water with a foam shore. Walls between the camera and the
  party now sink and rise smoothly instead of snapping.
- **Buildings and props (`building-kit.ts`, `props.ts`, `village.ts`):** bevelled walls on
  stone plinths, timber corners and eave bands, roofs with real overhangs, ridge caps and barge
  boards, framed windows with sills and painted shutters, framed doors with a step, a cottage
  chimney. The well has a turned rim and a windlass. The windmill has a footing, door, window
  and lattice sails; lanterns are framed, the bridge is planked and railed, the cave mouth is
  an arch of stones. All of it is toon-lit like the creatures, smooth pieces outlined (one
  shared hull), merged by material (Grove draw calls 207 → 195). Pools of lamplight spill on
  the ground at night (`buildSpills`, one additive mesh).
- **Sky (`sky.ts`):** a painted dome in place of Preetham: a horizon-to-zenith gradient per
  hour (day, golden, night, rain), a sun disc and halo, a two-tone cloud layer that drifts, and
  stars. The PMREM warm-up is kept (same material in the bake scene). Height fog is patched
  into three's exp² fog chunks (Grove and stage samples only). The fog takes the horizon's
  colour. Golden hour is warm and bright, no longer muddy red; env fill was raised to match the
  darker painted map.
- **Particles (`quad-particles.ts`):** one instanced-quad program for everything, with analytic
  shapes, rotation and soft fade, and additive and normal particles in one draw:
  - bursts (one draw, was three) and falling leaves tumble;
  - tap sparkles are stars;
  - rain streaks and snow fall in the vertex shader (no per-frame CPU loop over 2,500 points);
  - fireflies glow and wander on the GPU.
- **Emotes (`emote-vector.ts`):** vector frames at 128 px with mipmaps. Pre-existing bug fixed:
  the emote sat 0.48 above the head bone, inside the head, so the depth test hid it; it now
  floats above the creature's height.
- **Rain:** grade tint 0.96/0.98/1.02 (was 0.85/0.9/1), saturation 1.1, a clearer blue-grey
  fog, sun 1.05. It reads as wet, not washed out.
- **Waterfall (filmed this time):** it was a pale sheet hanging through the air (pass 1's
  unverified item). It is now a cascade ribbon that hugs the hillside into the stream, with
  the grass kept off it (grass checksum updated in `tests/render/grass-place.test.ts`).
- **Numbers** (headless Edge, `vite preview` production builds, 375×812 at 4× CPU throttle,
  10 s windows, interleaved, three pairs on the final build): day 51.5 → 53.0 fps, zoomed out
  37.7 → 48.3, night 43.8 → 47.7. Run-to-run spread is about 10 fps. Earlier builds of this
  pass, 8–14 runs each, gave day and zoomed out flat and night about 3% down; the final
  build's partial uploads for particles are in the numbers above. 583 tests, lint and build pass.

Stubbed: the cave's walls fade by sinking, not by dithering; the night spills are all on or all
off (a single lit campaign lantern lights its glass but not its pool). Known bugs: none new.
Not checked on a real phone. The minigames' `GroveSky` gets the painted dome too, but it is not
filmed there.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

