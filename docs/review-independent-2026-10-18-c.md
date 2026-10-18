# Independent review C, 2026-10-18

Reviewed `origin/main` at `07f44f5` and the deployed build at https://diablomaster8.github.io/TryThisGame/.

**How it was tested.** The Claude browser pane stayed hidden for the whole session, so it rendered at about 1 fps. It was used only for menus, settings, save import and export, the campaign opening and Reset. Everything that depends on timing was scripted in headless Edge on this PC's GTX 1080 (D3D11) against the deployed site:

- both graphics modes, at 1280×800 and at 375×812 with touch and a mobile user agent;
- 8 Nubbins, an Expedition, a race, the Hollow, Keepers, settings and a graphics switch;
- campaign chapters 1–2, the Learning Grove in both bands, Ori (Hebrew) and Hana (Japanese);
- blocked storage, a 7-day absence, a crafted share code;
- a 4× CPU throttle as a rough stand-in for a mid-range phone.

No real phone was used. Headless frame rate tops out at about 57 fps. Sound was not judged. Code was read by four Opus subagents (sim, render, UI/platform, assets), and their findings were spot-checked. Notes, plans and docs were read only after play and the code read were done.

## Verdict

Grove is a huge, working game built on a genuinely sound simulation core:

- clean sim/render split, seeded randomness, one clock;
- catch-up that runs 7 days in milliseconds;
- careful import checks.

In Pixel mode it plays smoothly, holding 57 fps even under a 4× CPU throttle, and its close-up pixel art and writing are charming. It is not close to the AAA goal. Full 3D reads as a prototype:

- near-white ground under cards of grass, and a pond that is a flat disc;
- box houses and a grey-box dungeon whose walls hide the player;
- dithered "ghost" trees when zoomed out;
- 27 fps with 8 Nubbins and 19 fps in a race under the phone-CPU stand-in, below the 30 fps floor.

Pixel mode almost certainly sends linear colour to the screen, which explains its murky, dark look. The minigames are flat colour blocks. There are also real data-safety bugs:

- the service worker never registers for a new visitor, so offline play and install are dead;
- one pasted share code permanently bricks a save;
- Reset turns a story or Learning Grove slot into a Free Grove;
- a child can erase a Learning Grove slot from the title with one OK.

**Recommendation:**

1. Fix the major items (one short pass).
2. Make Pixel/HD-2D the flagship for the AAA push: colour pipeline, lighting, water, minigame art.
3. Keep Full 3D labelled experimental until it holds 30 fps on a real mid-range phone.

## Bugs

### Major

1. **The service worker never registers, so offline play and install are broken for every new visitor.**
   - **Steps:** fresh profile → open the site → start any slot → play → `navigator.serviceWorker.getRegistrations()`.
   - **Expected:** one registration.
   - **Actual:** `[]` on the live site after a full session. `main.ts:257-261` adds a `load` listener inside `boot()`, which runs after `load` has already fired.
   - **Addressed 2026-10-18** (fix/review-c-major: `boot()` registers the worker straight away; hashed `assets/` chunks are served cache-first, the shell is precached with `cache: 'reload'`. Built site, fresh headless-Edge profile: 0 registrations on the title, 1 active and controlling after starting a Free Grove slot, and an offline reload opens the title.)
2. **A crafted share code bricks the save.**
   - **Steps:** More → Receive a Nubbin → paste a code built from `{"name":"Bare","stats":{}}` with a valid checksum (the checksum is public, `share.ts:12-19`) → reload → Continue.
   - **Expected:** "That code is not valid".
   - **Actual:** `TypeError … 'hunger'`, and the Roster stops opening. The bad Nubbin is saved on `pagehide`, and every reload throws again.
   - **Cause:**
     - `decodeNubbin` only checks `name` and `stats` (`share.ts:41-56`);
     - `frame()` has no try/catch (`game.ts:317-390`);
     - loads use the lenient `validateWorld`.
   - **Addressed 2026-10-18** (fix/review-c-major: `decodeNubbin` runs `nubbinProblem` and caps the name at 16; `receiveNubbin` refuses a broken Nubbin too; Receive is hidden in the Learning Grove; `deserialize` runs `importProblem` and turns any validator crash into a `SaveError`, so a bad save takes the unreadable-save path; `Game.frame` catches a throwing frame, keeps the loop alive, stops saving and shows a Reload card. Tests: `tests/sim/share-code.test.ts` (the `{"name":"Bare","stats":{}}` code is refused); checked in the browser.)
3. **Reset save turns any slot into a Free Grove.**
   - **Steps:** Continue a Hazel's Grove slot → ⚙ → Reset save → OK.
   - **Expected:** a fresh Hazel's Grove.
   - **Actual:** the saved world has `campaign: null`, and the title shows "Gardener · Fig, Bibi" with no chapter. `settings.ts:453-460` calls `createWorld()`; `debug-panel.ts:158-162` does the same with no confirm. In a Learning Grove slot it becomes a main-game world.
   - **Addressed 2026-10-18** (fix/review-c-major: `sim/fresh-start.ts` `freshWorldLike` starts the slot's own mode again (Hazel's Grove or a separate campaign with the same Keeper, Dawn & Dusk keeps `dd-other-done`, a Learning Grove keeps its age and band); Settings and the debug panel both use it, and the debug reset asks first. Tests for every mode in `tests/sim/fresh-start.test.ts`; Reset in a Hazel's Grove slot checked in the browser.)
4. **A child can erase a Learning Grove slot from the title.**
   - **Steps:** title → ✕ on the Learning Grove slot.
   - **Expected:** the grown-up gate.
   - **Actual:** one `confirm("Erase slot 1? …")`. "New here" over a filled slot behaves the same (`title.ts:144-160`).
   - **Addressed 2026-10-18** (fix/review-c-major: Erase and New here over a Learning Grove slot ask the grown-up gate after the confirm; the gate dialog now sits above the title screen, where it opened hidden behind it. Checked in the browser: a wrong answer keeps the slot, the right one erases it.)
5. **The grown-up gate does not stop a 7–10 reader.**
   - **Steps:** Settings → Mature 18+ → answer "7 + 4".
   - **Expected:** a gate a child can't pass.
   - **Actual:** the gate is a single-digit sum with unlimited retries (`grown-up-gate.ts:16-17`). It is the only lock on 13+/18+ content.
   - **Addressed 2026-10-18** (fix/review-c-major: a two-digit by one-digit product (13–49, never a round ten, times 6–9), new numbers after every wrong answer, said inline as well as in a toast, and Enter must be held 1.2 s (pointer or keyboard; a tap does nothing). Numbers in `GROWN_UP_GATE`; test `tests/render/grown-up-gate.test.ts`.)
6. **Full 3D falls below the 30 fps floor on a phone-class CPU.**
   - **Steps:** 375×812, Full 3D, 4× CPU throttle, 8 Nubbins, then a race.
   - **Expected:** ≥30 fps.
   - **Actual:**
     - Grove: 27 fps (p95 53 ms);
     - race: 19 fps (p95 71 ms, max 89 ms);
     - zoomed out: 13 fps on the HUD counter.
   - **Comparison:** Pixel holds 57 fps under the same throttle.
   - **Addressed 2026-10-18** (fix/review-c-major: the Grove's per-lantern and per-window point lights are replaced by a four-light `LampPool` given to the lit lamps nearest the camera, hidden by day (its own light set, warmed in the background); the Hollow uses four lamps; no transmission on the water, lantern glass, cocoons or creature wings and dew in the game; clamp, tone mapping, sRGB and grade are one `FinishPass` (the clamp runs separately only ahead of bloom); a `FrameGovernor` lowers the render scale while frames run slow and undoes any step that buys no time; creature face parts no longer cast shadows; the shadow map redraws every second frame while the governor is under strain; ground heights are cached. 375×812, 3× DPR, touch and mobile UA, 4× CPU throttle, 8 Nubbins, headless Edge on the dev server: Grove 38 fps, race 35, night 39, Hollow 42 (origin/main on the same harness: 18–23, 23, 27, 22). Zoomed out was not measured.)
7. **Pixel mode outputs linear colour (by code; not pixel-probed).**
   - **Steps:** compare any palette colour with the screen.
   - **Expected:** palette colours shown as designed.
   - **Actual:**
     - textures are flagged sRGB and rendered into a default 8-bit linear target;
     - the post shader has no `colorspace_fragment` or gamma step (`post.ts:107-115`; `grep` finds none in `src/render`);
     - the result is the dark, low-contrast Grove in every screenshot.
   - **Addressed 2026-10-18** (fix/review-c-major: the post pass renders into a half-float target and ends with `colorspace_fragment`; the day light rig is lifted by `PIXEL_LIGHT.dayGain` 1.35 (night 0.85) so noon ground sits near its painted colours. Before and after: `docs/samples/review-c-colour-before.jpg`, `-after.jpg`, `-night.jpg`.)
8. **Evolutions during catch-up, or at ×1000, never reach the Collection book.**
   - **Steps:** raise a Nubbin to adult at ×1000 (or while away), then open More → Collection book.
   - **Expected:** the adult form counts as seen.
   - **Actual:** the book says "1 of 70 seen" after an adult Neutral Fly. `stepCollection` runs only inside `stepWorld` (`world.ts:865`); `coarseStep` (`offline.ts:35`, `game.ts:336-337`) emits `evolved` but never records it. Badges that count `world.seen` are affected too.
   - **Addressed 2026-10-18** (fix/review-c-major: `coarseStep` folds its own events into the book with `stepCollection(world, events, from)`, so catch-up and the high-speed fallback both record hatches, evolutions, rebirths and Eternals. Tests in `tests/sim/away-fairness.test.ts`.)
9. **The well-raised bonus can upgrade the stat evolution just upgraded** (`lifecycle.ts:111-119`).
   - **Steps:** swim 150 and fly 199 points, both C, no slips → evolve. Proved by the sim subagent with a tsx script.
   - **Expected:** two different stats go up one grade each.
   - **Actual:** swim goes C→A and fly stays C.
   - **Addressed 2026-10-18** (fix/review-c-major: `evolve()` returns the stat it raised and the bonus takes the highest-points stat that is not that one and not S. Test: swim 150 and fly 199, both C, ends B and B.)
10. **In 3D, the Hollow hides the player.**
    - **Steps:** enter the Hollow, then switch Graphics to Full 3D.
    - **Expected:** the party is visible.
    - **Actual:** untextured blue blocks fill the view, with the Keeper and party behind walls. There is no occlusion fade.
    - **Addressed 2026-10-18** (fix/review-c-major: walls between the camera and the Keeper or a party Nubbin are cut down to a stub (rewritten only when that set changes), and the blocks are shaded stone with a dark foot, a pale lip and a tone per block. Four camera angles, before and after: `docs/samples/review-c-hollow-before-after.jpg`.)

### Minor

11. **Storage blocked:** the only warning is one passing toast at the first failed autosave, up to 30 s in (`hud.ts:1000`). The title says nothing, and after a reload every slot is empty with no reason given.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the title says saving is blocked above the slots, and the HUD keeps a "⚠ Not saving" chip (tap for why) from load or the first failed save (`storageAvailable`, `.storage-chip`, `.title-storage`).)
12. **Catch-up indicator:** it never paints, because it is shown and hidden inside one synchronous call (`game.ts:239-242`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: catch-up runs after the HUD is bound, in chunks (`catchUpInChunks`), yielding a frame once a slice passes 60 ms, so the indicator paints; no steps or saves happen until it ends.)
13. **No cap on simulated time:**
    - a missing `savedAtWallMs` means a 56-year gap;
    - 365 days takes 1.1 s on desktop (`offline.ts:101`, `save.ts:116`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: every mode stops at 30 days (`SIM.maxAwayMs`, `allowedSpan`); a save with no `savedAtWallMs` has no gap.)
14. **Backlog at ×1000:** more than 400 steps run the offline rules in live play (`game.ts:336-337`). Slips are logged "while away", and campaign, quests and weather are skipped.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: live play never runs the offline rules: the backlog stays as fine steps for later frames, and only time past `SIM.maxLiveBacklogMs` (2 sim minutes) is dropped (`Clock.capBacklog`).)
15. **Minigame headers:** the HUD chip and ✕ cover the runner's name in the Expedition and "GROVE · TIER 1" in races (both modes).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the pixel Expedition and race canvases start below the ✕ and chip row (`minigames/play-area.ts`), so the runner name and "GROVE · TIER 1" are clear; checked in Pixel at 1280×800 and 375×812 (the 3D header is DOM and already sat below the row; checked in the 3D race).)
16. **Story text and toasts collide:**
    - The campaign opens with "Late spring…" while a toast says "Autumn harvest: fruit falls twice as fast" (real-world season).
    - "While you were away" and the opening dialogue are drawn on top of each other.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: a season festival toast waits until no story scene is open or waiting; the away screen opens at once after catch-up, and scenes wait while it or the catch-up is up.)
17. **Sprout script typo:** "Hum, hum, go the eggs." (`edu-campaign-1-sprout.ts:124`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the three sprout lines now read "Listen, they go hum, hum!" and "The eggs go hum, hum, close by." (script book too).)
18. **Learning Grove picker:** it offers 7–10 readers the same preschool games (letter names, little sums).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the reader band (7–10) gets Sums (to 20, take-aways, missing numbers, 2/5/10 tables), Spelling and Rhymes & beats (`reader-games.ts`); colours, shapes and animals are not offered to readers (`gamesForBand`).)
19. **Debug draw-call readout:** it reports 1 draw call (and 0 sprites in 3D), because `info.autoReset` counts only the last pass (`debug-panel.ts:188,200`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: `info.autoReset` is off and reset once per frame in both renderers, so the readout sums every pass; it adds triangles, and Full 3D shows its Nubbins instead of "sprites 0".)
20. **3D race:** runners Pip and Dot wander on the grass beside the track, and the name tags overlap ("Mochi" over "Bramble").
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: 3D run and stamina sections are a dirt or cobble track with chalk lane lines, so runners read in their lanes; the tags stayed apart at both sizes (the stacker was already in).)
21. **Zoom and canopies:**
    - Pixel at far zoom shows the ground as a floating diamond over a pale void.
    - Full 3D at far zoom dithers whole trees into dotted ghosts (`crowns.ts:66-82`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: Pixel has a wild-wood ground past the field, so far zoom shows no void; Full 3D crowns and trunks thin only inside a circle round the Keeper on screen (`HOLE` in `crowns.ts`), never whole trees.)
22. **Stats sheet:**
    - It covers the Nubbin, so Pet and Hug reactions can't be seen.
    - Feeding critters and essences shows no visible progress, because points appear only in debug.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the sheet docks to the right on wide screens; on phones it is shorter and the camera lifts the Keeper and Nubbin into the clear top part (`Game.cameraLift`); each stat has a bar toward its next level and shows "+N" for a moment after a gain.)
23. **HUD icons:**
    - Expedition uses 🏃, the same icon as the Run button.
    - The keeper picker lists names only.
    - The "←" button has no label.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: Expedition is 🧭; the title Keeper picker shows side and what hatches under each look; "←" is labelled Back.)
24. **Share codes:** Receive uses native `prompt()` and `alert()`. Names have no length cap, and Receive is also offered in the Learning Grove (`hud.ts:360`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: Receive opens a dialog with a code box and an inline error; it is hidden in the Learning Grove (the name cap comes with the share-code fix, item 2).)
25. **Erase buttons:** all three title Erase buttons are labelled "Erase Slot 1" for screen readers.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: each Erase is labelled with its mode and slot.)
26. **Tap targets:** these are 40 px tall (`style.css:718,874,1466`): `.roster-hat`, `.field-row input` and `.map-grid .btn`.
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: `.roster-hat`, `.field-row input` and `.map-grid .btn` are 44 px.)
27. **UI handlers:**
    - Escape misses the Atlas, cabinet, rift, Neopia, dungeon and tank panels (`hud.ts:509-533`).
    - The co-op select runs two handlers (`settings.ts:232`).
    - A failed font load is cached for good (`lang-fonts.ts:11-18`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: Escape closes the Atlas, cabinet, rift, Neopia, Hollow menu and party bout (the Beetle Run handles its own); the co-op select runs only `applyCoop`; a failed font load is retried next time.)
28. **Sim command path:**
    - Catch-up hatching ignores `hatchSpeed` (`offline.ts:80`).
    - Race results trust the UI: no tier check and duplicate hats (`world.ts:395-417`).
    - The race seed is `Date.now()`, so a race can be retried for a better result (`ui/races.ts:79`).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: catch-up hatching uses `hatchSpeed`; `raceResult` checks the course and that the tier is open, caps Shells at the placement prize, gives a hat only for a win and never twice; the race seed comes from the world (`raceSeedFor`, fixed until a result is recorded).)
29. **Flaky test:** `side-saves.test.ts` "every Atlas page" timed out once in the full run (5 s) and passed on the rerun (549/549).
    - **Addressed 2026-10-18** (branch `fix/review-c-minor`: the Atlas chunk loads in a `beforeAll` with 60 s and the test has 30 s.)

## Missing against the goals

| Goal | Missing                                                                                                                                                                                                                                                                   | Evidence                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1    | Offline play and install-to-home-screen for new visitors                                                                                                                                                                                                                  | Bug 1                                                     |
| 1    | Any frame-rate number from a real phone                                                                                                                                                                                                                                   | Device pass G11 still open; CPU-throttle numbers in Bug 6 |
| 1    | A first-run path. The title shows 21 empty slots across 7 modes with no description. In the Learning Grove nothing points a pre-reader to 🎓, and no story starts by itself.                                                                                              | Title text; edu runs idle until 🎓                        |
| 1    | A clear next step in the campaign. After chapter 2 opened, about 6 minutes passed with no objective shown in the HUD.                                                                                                                                                     | Campaign run log                                          |
| 2    | 3D ground and foliage. The splat base reads as white or grey, with separate saturated grass cards on it. There is no grass on the ground texture, no distance fade and no canopy wind (the comment at `props.ts:315` claims sway; the leaf material has no vertex patch). | 3D screenshots, `aaa-kit.ts:166-345`                      |
| 2    | Water in 3D: an opaque pale disc with no shoreline, depth tint or reflection. The waterfall is one plane that shares the pond's scroll.                                                                                                                                   | `water.ts:8-43,113-136`                                   |
| 2    | Environment kit: houses and props are boxes and cones, there are no bevels, trims or decals, and the 3D Hollow is grey-box.                                                                                                                                               | `props.ts:55-200`                                         |
| 2    | Creature shading per the art bible (outlined, toon). The toon ramp and outline exist but are off. Parts are rigid, with no spring bones and no skinning.                                                                                                                  | `creatures.ts:187-275`, `species.ts:800-870`              |
| 2    | Pixel HD-2D finish: correct colour, lit sprites, cast shadows, real depth of field, reflective water. Bloom is an 8-tap blur, tilt-shift is a fixed screen blur, and shadows are blobs.                                                                                   | `post.ts:36-75`, `world-view.ts:317-379`                  |
| 2    | Minigame art. The Expedition has three flat sky bands with hard edges and flat hills; races are coloured blocks with a big empty sky.                                                                                                                                     | Expedition and race screenshots                           |
| 2    | Quality tiers and adaptive resolution. Pixel ratio is read once and there is no frame-time governor.                                                                                                                                                                      | `grove-3d-scene.ts:193-206`                               |

## Risks

- **Performance:**
  - Full 3D is CPU-bound on phones (Bug 6).
  - 19 point lights are always in the scene at intensity 0 (`props.ts:90,238`), and water and lantern use transmission (an extra scene pass).
  - There is a 64 MB atlas re-upload mid-play (`mega-atlas.ts:47-55`) and per-frame allocations (`grove-3d-scene.ts:593,627`; `sprite-batch.ts:252`).
  - Download size: `dist` is 40 MB, the edu chunk is 9.4 MB (3.1 MB gzip), the entry chunk is 1.26 MB, and there are 252 font files.
  - Once the service worker works, its stale-while-revalidate rule re-downloads every hashed file on each load (`sw.js:52-67`).
- **IP:** legal was cleared by Maor on 2026-10-17. This is bookkeeping only:
  - every shipped third-party file is recorded, with matching versions;
  - there is no in-game credits or licences screen;
  - `docs/reference/chao-world-lineup.jpg` is committed but not in CREDITS;
  - species `ref` strings and the unused `ETERNAL_REFS` ship in the bundle;
  - the cartridge title "The Chao Altar" is visible to players (`strings.ts:1258`), against the project's own "inspiration never shown" rule;
  - the voice-over pip packages are not recorded.
- **Kid safety:**
  - free-text names in share codes have no cap or filter, and Receive is open in the Learning Grove;
  - the gate before 18+ content is trivial (Bug 5);
  - `?debug` turns on the full debug panel on the live site (reset with no confirm, force end of life);
  - the Learning Grove shows care-slip lines ("felt lonely. (A slip.)") to 4-year-olds.
- **Data loss:** Bugs 2, 3, 4 and 11, plus any exception in a sim system, which stops the loop and then saves the half-stepped world on hide.

## Improvements, ranked by value against cost

| #   | Improvement                           | Value | Cost | Recommendation                                                                                                                          |
| --- | ------------------------------------- | ----- | ---- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Register the service worker at boot   | High  | S    | Call `register()` directly in `boot()`, cache hashed chunks cache-first, and fetch the shell with `cache:'reload'`.                     |
| 2   | Make saves robust                     | High  | S    | Validate shared Nubbins with `importProblem`, wrap `stepWorld` in try/catch with a recovery card, and run the strict validator on load. |
| 3   | Fix the pixel colour pipeline         | High  | S    | Add `colorspace_fragment` to the post shader (or use an sRGB/half-float target), then re-tune the palette by eye.                       |
| 4   | Reset and erase per mode              | High  | S    | Reset re-runs the slot's own start (campaign, edu, storyline); title erase of a Learning Grove slot needs the gate.                     |
| 5   | Choose a flagship renderer            | High  | S    | Make Pixel/HD-2D the AAA target; put Full 3D behind an "experimental" label until it passes a phone fps gate.                           |
| 6   | 3D light and pass budget              | High  | S    | At most 4 nearest point lights, at night only; drop transmission; fold the clamp and grade passes into OutputPass.                      |
| 7   | HD-2D lighting pass                   | High  | L    | Add sprite normal maps, lamps that light sprites, alpha-tested sprite shadows, depth-buffer DOF and water reflections.                  |
| 8   | Minigame art pass                     | High  | M    | Painted parallax layers and props for the Expedition, track dressing and depth lanes for races, and a HUD that never covers names.      |
| 9   | Stylised creature shading in 3D       | High  | M    | Turn on the existing toon ramp and outline per the art bible, and add rim and wrap lighting.                                            |
| 10  | Quality tiers and adaptive resolution | High  | M    | A frame-time governor that drops resolution, fur layers, grass density and shadows on slow devices.                                     |
| 11  | 3D ground, foliage and water          | High  | M    | Grass-coloured terrain under the tufts, distance fade, canopy wind and bent normals, and a stylised water shader with foam.             |
| 12  | A real device pass                    | High  | S    | Measure fps on one iPhone and one mid-range Android in both modes before any new art lands.                                             |
| 13  | World edges                           | Med   | S    | A horizon skirt or backdrop in both modes, and clamp zoom so the void is never seen.                                                    |
| 14  | Animation polish                      | High  | L    | Spring bones on ears, tails and wings, squash and stretch, pose blending; later, skinned meshes.                                        |
| 15  | Onboarding                            | Med   | S    | One line per mode on the title, a pulsing 🎓 for pre-readers, and an always-visible campaign objective.                                 |
| 16  | Painted sky and atmosphere            | Med   | M    | Replace Preetham with a painted gradient, a cloud layer, height fog and sun shafts.                                                     |
| 17  | Environment kit                       | Med   | L    | Bevelled modular buildings and rocks, trim sheets, anti-tiling and decals.                                                              |
| 18  | Particles                             | Med   | M    | Instanced quads with rotation, flipbooks and soft fade; vector emote bubbles in 3D.                                                     |

## What the notes get wrong

- **Service worker:** PROGRESS ("Loading (2): per-build service worker cache, network-first pages…") implies offline play and install work. For new visitors the worker never registers (Bug 1).
- **Known bugs:** PROGRESS says "Known bugs: none new". This review found ten major bugs.
- **Creature render style:** CLAUDE.md says the Nubbins match a "flat-shaded, hard-edged, outlined render style, through a toon stage mode". The Grove ships PBR with the toon path off.
- **3D race:** PROGRESS says the 3D race "looks down at 38°… so every racer and tag is clear". In the 1280×800 run, runners left the track and tags overlapped.
- **Slot button names:** PROGRESS says "distinct slot button names (37)". The Erase buttons still share one label.
- **Well-raised bonus:** PROGRESS Bug 7 says the bonus is recorded and fixed. It can now double-upgrade one stat (Bug 9).
- **Code comments:** `props.ts:315` says leaf cards sway in their shader, and `water.ts` says the waterfall scrolls faster. Neither is true.
- **Browser-pane checks:** "Checked in the browser pane (hidden pane, frames driven by…)" is offered as verification. A hidden pane runs at about 1 fps, so it can't show frame rate, minigame feel or animation. No phone fps exists anywhere in the notes.
- **Tap targets:** "`.btn-small` is 44 px" is right, but other controls are still 40 px.

## What surprised me for the better

- **Sim boundary:** `src/sim` has no DOM, Three.js, `Math.random` or `Date.now`. All randomness goes through mulberry32, and the UI writes the world directly in only one place (`settings.ts:381`).
- **Catch-up:**
  - 7 days ran in about 34 ms and showed a clear "While you were away" screen.
  - With departures off, Nubbins at end of life waited for the Keeper as promised.
- **Saves:**
  - imports are size-capped, mode-checked and deep-validated, and ask before replacing;
  - unreadable saves are backed up;
  - a second tab stops autosave.
- **Pixel mode performance:** one draw call for about 700 sprites, and 57 fps with 8 Nubbins even at 4× CPU throttle. The pixel Hollow, lit by its lanterns, looks lovely.
- **Writing:**
  - The campaign opening (the gate, the upturned cup, "Don't be dramatic about it") is strong.
  - The reader band handles death plainly, with comfort straight after.
  - Ori and Hana's courses tag Hebrew and Japanese with `lang`, transliteration and pronunciation.
- **Kid-friendly touches:** read-aloud through the browser voice for 3–6, a "Time for a break" card with a grown-up override, and a parental gate on Mature content.
- **Clean runs and records:** no console errors during Pixel play, no external network calls, no `innerHTML` with game data, and a complete record for every shipped third-party file.
