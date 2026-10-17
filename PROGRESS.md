# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16, evening)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content pack in `src/content/`; engine CV1–CV6 wired (campaign v2 and
endings, all 31 side stories and the fun quests running, props and keepsakes, the Learning
Grove switch, Hebrew and Japanese, Atlas/Arcade/Multiverse saves, Mature content setting,
one-time gifts). Atlas A1–A31 all scripted; A1–A10 and A22–A31 reviewed and fixed (plan
Task B-R1; reports `docs/logs/review-wave-L.md` and `review-wave-M.md`). Plan v4
(`plan.md`): G11 device pass, Track B writing and review tasks, and Part Z, the
independent full review that runs last. Waiting on Maor: the expansion pick E1–E3 / S1–S4,
seven fun-quest quotes, Full 3D as default (brief: `docs/renderer-decision.md`), his phone
rows, and the Atlas licence, quote, adviser and audience items in the two wave reports.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## Full 3D parity gaps, plan Part G16 (2026-10-16)

Closes G16.1 to G16.11 and writes G16.12. Each checked in the browser pane on `?free&slot=3`,
Full 3D against Pixel, 375x812, frames driven by hand from a HEAD export (`.idx-g16`); one
commit each; shots `docs/samples/parity2-<item>.jpg` (pixel left, 3D right where both apply).

Works:
- G16.1 (a440e86, 814b356): the cave and plain light sets link in the background after the
  Grove compiles (hidden samples for the floor's material kinds, the shadow depth programs
  and the emote sprites); a place still linking holds the last frame behind a dim. First
  trip down the stairs: 695 ms first frame here (3.3 s in G15) to 47 ms.
- G16.2 (fef9994): buildings, lanterns, decor and trees get a pixel-style rim (`halo.ts`);
  memorials, visitors, wild ones, strays, plants, story props, stairs, chests and loot the
  ground ring sized to their reach.
- G16.3 (505b0d5): the story Hollow and Corvin's garden sets (`story-sets.ts`).
- G16.4 (60139a6): the Keeper's lamp underground, pixel-shaped loot, the "?" over unfed wild
  ones; a floor's wild one goes once scanned, as in the pixel view.
- G16.5 (41db953): market stalls by `townUnlocks` (`village.ts`). The path fence rule is in,
  but `fenceSpots()` is empty on today's layout, so neither view draws posts.
- G16.6 (dd1ead6): merged glow, cocoon fade and shimmer, fruit flavour colours (`glow.ts`).
- G16.7 (af9b708): weather moved to `weather.ts` (the scene was past 800 lines): pixel gates
  for reduced motion, density and intensity; daytime leaves; story-Hollow fireflies; grade.
- G16.8 and G16.9 (3efc6eb, 24bf933): trunks thin when they hide the Keeper; the visit
  gardens' trees fade too (`treeOf` in `crowns.ts`).
- G16.10 (3a83021): the race camera starts before the line; tags sit on their lane rows.
- G16.11 (429ddee, 73dac41): `ui/render-hold.ts` pauses Full 3D behind story scenes, the away
  screen and the photo panel, once the opening load is done (the away screen opens at boot).
- G16.12: `docs/renderer-decision.md`. Recommendation: Pixel stays the default until G11's
  phone rows pass, then Full 3D by device. Render-only frame now p50 2.4 ms, p95 3.1 ms.

Stubbed: none new. Known: coming home from a visit still links some Grove-only programs (one
frame of about 170 ms); leaf cards get no halo; the merged aura is soft in daylight. This
PC's browser reports prefers-reduced-motion, so under 'system' the pane shows no weather.
The full suite once timed out the "every Atlas page" test at 5 s under load (1.1 s alone).

## Full 3D: event bursts and tree crowns (2026-10-16)

Closes parity items 1 and 3 below. Checked in the browser pane on `?free&slot=3`, Full 3D,
375x812, frames driven by hand from a HEAD export.

Works:
- Event bursts as in the pixel `burstFor` (8089255): sparkles for hatch, rebirth, growth,
  evolution (with petals), Eternal, cocoons and the find sparkle for dungeons and chests;
  hearts for love, sparkles for dizzy, crumbs for meals, dust for a shaken egg, a sparkle
  where an item is collected; the squash on landing and the pop on hatch, evolve and
  rebirth (pixel timings). `render3d/bursts.ts` draws three point clouds (dots, glowing
  stars, hearts). Heights are fractions of the body, feet to head. Like the pixel side,
  bursts ignore reduced motion. Shots `docs/samples/parity-3d-bursts-{evolve,love}.jpg`.
- Tree crowns (fb96dd3): `render3d/crowns.ts` dithers a crown out when the camera is inside
  it and thins it to `GROVE3D.crownFade.blocked` when it stands between the camera and the
  Keeper (middle and head), hiding branches and fruit below half. A per-crown uniform, so
  no recompile; the shadow stays. Shots `parity-3d-crown-{before,after,blocked}.jpg`.

Stubbed: none. Known bugs: a trunk could still hide a Keeper standing right behind it; the
dressed visit gardens built trees without the fade (both closed in G16.8 and G16.9).

## Pixel vs Full 3D parity pass (2026-10-16)

Method: one seeded Free Grove save (`?free&slot=3`, snapshot reloaded for each mode) played
in the browser pane at 375x812, driven by hand at x10: 15 actions (hatch, give, pet, feed,
shake tree, hug, pick up, put down, Moon Keeper, snow, force evolve, Hollow Below in and
out, end of life), 12,000 frames per mode (twenty minutes at x10), plus an Expedition, a
race, a campaign scene and the Learning Grove (`?edu=4&slot=3`). Both runs fired the same
events (hatch, evolve, second evolve, departure); they started 36 game minutes apart, so
positions differ. Frame times (`gl.finish` round each frame, this PC, dpr 1): Pixel p50
0.7 ms, p95 1.1 ms; Full 3D p50 3.0 ms, p95 5.3 ms. Entering the Hollow Below: Pixel
484 ms, Full 3D 3,261 ms the first time (about 400 ms later). `docs/device-pass.md` holds
no frame times; the only earlier figure is the archive's 2.9 ms for Full 3D at 1024x768.

Works (fixed, one commit each):
- 3D reaction bubbles (heart, !, ?, spiral) via shared `bubbleFor`, the two-frame emote
  flip and the plum Shadow sheet (dcf72b9).
- 3D portrait view: vertical field of view widens to keep `GROVE3D.minHFovDeg` (34)
  across; at 375x812 it was about 20 degrees and Nubbins sat off the edge (1af54fe).
- 3D memorial flowers only in the Grove and removed with their memorial (d48cb1f).
- 3D canvas scales smoothly, not nearest-neighbour (landed inside 0867344: another
  session's CV3 commit took the staged file during a git lock clash; the change is right).
- 3D items follow the pixel rule: no Grove fruit in the Hollow Below, notebooks only in
  story places (778e471).
- Same in both (checked): HUD, toasts, panels, camera buttons and gestures, picking (every
  kind; 3D uses coarse spheres); Expedition, races, Beetle Run and the Learning Grove
  minigames pause the 3D render.

Open, with estimates (all tracked in plan.md Part G16; 2-10 closed in the G16 pass above):
1. Done (8089255): event bursts, squash and pop in 3D (section above).
2. Hollow Below entry stall in 3D (its lamps recompile every material, by design):
   compile asynchronously behind a fade. 1.5-2 h.
3. Done (fb96dd3): crowns between the camera and the Keeper fade (section above).
4. Highlight on non-creature picks (lantern, tree, building, stairs, chest, loot). 1-2 h.
5. Story Hollow and Corvin's garden sets (a plain floor and a colour in 3D). 3-4 h.
6. Hollow Below: no Keeper lamp, generic loot, no "?" over wild ones (Grove too). 1.5-2 h.
7. Village stalls and path fence posts missing in 3D. 1-1.5 h.
8. Merged glow, cocoon fade, fruit flavours missing in 3D. 1-1.5 h.
9. 3D weather ignores intensity and reduced motion; no leaves, no grade. 1 h.
10. Both modes: the race screen in portrait starts with runners and names clipped at the
    left edge. 30-60 min.
11. Expedition and races are pixel art in both modes: a style jump in Full 3D (Maor's call).

Shots: `docs/samples/parity-hollow-{pixel,3d}.png`, `parity-3d-portrait.png` (after the
field-of-view fix), `parity-3d-crown.png` (item 3).

Stubbed: none new. Known bugs: items 2 and 10 above (both closed in G16).

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

