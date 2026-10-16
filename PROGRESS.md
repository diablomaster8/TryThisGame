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
endings, the runner for all 31 side stories and the fun quests, story props, keepsakes;
side stories as a lazy chunk). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

