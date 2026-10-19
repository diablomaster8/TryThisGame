# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-18)

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
default renderer is not changed; passes 1 and 2 below, both on branches awaiting Maor's merge).

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

## Full 3D art push 1: toon creatures, ground, water, governor (2026-10-18)

Branch `art/3d-flagship`. Before and after: `docs/samples/art3d-before-after.jpg`. Works:
- **Toon creatures:** the Grove's rigs build with the line-up toon bands (`GROVE3D.toon`):
  - a stepped light rim;
  - a share of the sky's diffuse light (without it they went near black);
  - no sun shadow on themselves (speckle at this scale);
  - screen-sized outlines on parts of 2,500+ triangles (`render3d/toon-outline.ts`, one
    shared hull material).
  `surfaceMaterial`/`toonMaterial` now carry `customProgramCacheKey`: toon and physical shared
  one program before.
- **Light:** the sky map is soft fill (0.38 by day, was 0.7, which washed the meadow mint) and
  the hemisphere carries the fill (0.6). Night has more moon and fill, exposure 0.6.
- **Ground and foliage (`aaa-kit.ts`, opt-in so the stage samples keep their look):**
  - the meadow is painted toward lush and dry greens with an anti-tiling second sample
    (`GROVE3D.terrainLook`);
  - tufts are dark at the root, lit like the ground, and sink away 34–46 units from the
    camera (`grassFade`);
  - the field frays over its last 5 units (grass golden hash updated);
  - canopies shade as rounded masses and sway in the wind; crowns.ts chains its dither
    after that patch.
- **Water (`render3d/water.ts`, rewritten):** unlit painted shader on fine grids that carry
  the bed's depth:
  - turquoise to deep blue, with foam tracing the real shoreline;
  - procedural ripples with stepped crests, a sky fresnel and a hard sun spark;
  - the stream gets its own thin foam, and the waterfall has its own falling streaks;
  - the race's swim strips use it too (`paintedWater`, `channelGeometry`, opaque).
- **CPU:**
  - Ground height is now a lazily built 0.25-unit tile grid (`terrain-shape.ts`). The exact
    sum, which had been 20% of a throttled frame, now only builds the mesh and the grass.
  - The governor steps through CPU savings once fewer pixels stop helping:
    1. outlines;
    2. the second grass pass and bloom;
    3. shadows every fourth frame.
    Savings come back before sharpness, and one that was needed stays.
- **Numbers (headless Edge, GTX 1080, 375×812 at 4× CPU throttle, two 10 s runs each, main →
  this):** day 44.6/40.1 → 53.7/51.4 fps, zoomed out 42.2/42.5 → 44.7/43.1, night
  46.7/42.5 → 49.7/47.3. Desktop holds 57 (headless cap). 583 tests, lint and build pass.

Stubbed: the waterfall was not filmed close up (its streaks and foam are unverified on
screen); rain still greys the grade; the Hollow, buildings, props, sky and particles are
untouched (next passes); visit-set trees do not sway (no clock there). Known bugs: none new.
Not checked on a real phone.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

