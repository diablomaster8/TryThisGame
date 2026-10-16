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
side stories and the campaign as lazy chunks; grass placed in a worker). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## G14 bundle diet: campaign chunk, sample stage split, grass in a worker (2026-10-16)

Works:
- The v2 campaign script (`content/campaign-book1..3.ts`) is its own chunk, like the side
  stories. `config/story.ts` keeps `CHAPTERS`, `SCENES`, `ENDINGS` empty until
  `registerCampaign` (sim/story-scenes.ts) fills them and adds Wisp to `SPEAKERS`;
  `loadStoryScripts()` fetches both chunks together and registers the campaign first (a
  campaign scene still wins a shared id). `main.ts` starts it during the title and awaits it
  before `boot`. Tests register both up front (`tests/setup-side-stories.ts`);
  `side-story-chunk.test.ts` checks repeat registration and `c1-letter`. The content checker
  and script book read Wisp from `CAMPAIGN_SPEAKERS`.
- `src/render3d/` and `src/samples/` load only when chosen (no static import outside them;
  checked in the build's import graph). New: the 3D chunk no longer drags in the `?aaa=`
  stage. What render3d builds with moved from `samples/aaa-styles.ts` to `samples/aaa-kit.ts`
  (textures, terrain material, grass, trees, particles, CLAMP/GRADE); the stage keeps its
  valley, props, water and `mountAaaSample` and imports the kit.
- Grass placement runs in `render3d/grass-worker.ts`: `samples/grass-place.ts` is the pure
  scatter (same three maths as before), `render3d/grass-field.ts` the Grove's keep-out field,
  `render3d/grass.ts` builds the meshes empty (colour attribute up front, so the program does
  not change) and pours the matrices in; `loadState` waits for `props.grass.ready`, so the
  veil lifts on the full meadow. Page fallback without workers. Checked tuft for tuft against
  HEAD's loop (identical matrices and colours); `tests/render/grass-place.test.ts` pins the
  checksum. Shots: `docs/samples/g14-grass-head.jpg` vs `g14-grass-worker.jpg` (same meadow).

Sizes (minified, `vite build`; before = HEAD 0a96ecc):

| Chunk | Before | After |
| --- | --- | --- |
| index (main) | 1,336.9 kB (392.2 gz) | 1,155.9 kB (331.6 gz) |
| campaign | in index | 180.9 kB (60.8 gz) |
| side-story-content | 1,065.2 kB | 1,065.3 kB |
| 3D on demand: grove-3d-scene + shared | 75.7 + aaa-styles 237.1 + BokehPass 26.0 = 338.8 kB | 76.1 + Sky 207.8 + OutputPass 18.9 = 302.8 kB |
| `?aaa=` stage | 237.1 kB | aaa-styles 30.3 kB (+ shared) |
| sculpt-worker | 432.3 kB | 252.5 kB |
| grass-worker | none | 90.6 kB |

Boot times (`vite preview`, browser pane, warm cache): title card 25–42 ms after page start
(HEAD); `?free` pixel boot 402–451 ms HEAD vs 422–460 ms now (both chunks land by ~55 ms; the
spread is noise). Grass placement was 90–111 ms of the 3D constructor (9,000 tufts × 2, timed
in Node); it now runs off the page. Full 3D veil times are not comparable in the pane (it only
draws frames while captured: HEAD read 13.4 s cold).

Stubbed / known:
- The main chunk is 1.156 MB, a little above the 1.13 MB estimate (the campaign was 181 kB,
  not 175 kB, and the index grew since that estimate). The next large piece is Three.js itself.
- Rollup names the shared 3D chunk after a module in it (`Sky-*.js`); it holds the species
  builder and the kit, not just the sky.
- `aaa-styles.ts` is 841 lines, still past the ~800 split guide.
- Not checked: the no-worker grass fallback; 3D boot on a phone.
- This section sits after the Status block, as the ones below do; literal line 12 is inside it.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

