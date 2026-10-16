# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode, and the Full 3D mode as a
Graphics setting (`src/render3d/`, worker sculpting, geometry cache, boot work, the G13
polish pass: pet state, knees, lids, tumble, shoreline, dressed visits) with the pixel mode
unchanged. Story content pack in `src/content/` with CV1 wired (campaign v2,
endings, the runner for S5, S9, S10, S27, S28; side stories as a lazy chunk). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

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

## 2026-10-16: B2 debug panel guard, B3 panel stack

**Works:** B2 was real: the debug panel mounted in the production build and opened on backtick or a triple-tap of the logo. It now mounts only when `import.meta.env.DEV` or the URL has `?debug` (`ui/hud.ts`); otherwise `debug` is null and both openers do nothing. Checked in `vite preview`: no `.debug` node without the flag, panel opens with it. B3: `ui/panel-stack.ts` keeps one full panel open at a time (menus, stats sheet, Journal; the newest wins) and refuses to open any over a running Expedition. Toasts take their row from the measured top-bar bottom (`--toast-top`), above panels, no pointer events. The Expedition counter now sits beside the close button. Checked at 375x812 in pixel and Full 3D (the HUD is shared DOM). Manual steps: `docs/device-pass.md` (no `tests/e2e/` yet).

**Stubbed:** no Playwright test; the checks are manual until G11 creates `tests/e2e/`. Story scenes, the away screen and celebrations stay outside the stack on purpose.

**Known bugs:** I could not reproduce the exact "counter under the close button" overlap at 375 wide (the old CSS had them on opposite sides); the new layout rules it out whichever way it arose. Assumption: this section sits after the Status block rather than at literal line 12, which is inside it.

## 2026-10-16: content ratings (CV6 audience items)

**Works:** `Settings.matureContent` (`off` | `teen` | `adult`, default `off`) and `riftConfirmed`, save v3 with a migration (v2 saves get `off`/false; bad values clamp to `off`). `sim/audience.ts` holds the pure filter: Learning Grove offers only `all`; the main game offers `all` and `main`, `teen` at 13+ or 18+, `adult` at 18+; fun quests Q1-Q65 are blocked in chapters 9-11. Settings > Mature content control (hidden when the slot mode is `edu`). `confirmRift` command sets `riftConfirmed` and turns on 18+. `ui/rift-confirm.ts` is the one-time age dialog. Tests: `tests/sim/audience.test.ts`.

**Stubbed:** nothing calls `questAvailable` yet, because no fun-quest, Atlas or Multiverse offering engine exists (CV1/CV4 and later); `askRift` has no caller until the rift is built. Learning Grove comes from slot mode `edu` in the UI; the sim takes it as a parameter. Assumption: the rift confirmation lives in `settings.riftConfirmed`.

**Known bugs:** none known. Lowering the setting only hides quests; nothing stores quest progress yet to prove it end to end.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

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
