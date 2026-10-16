# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode, and the Full 3D mode as a
Graphics setting (`src/render3d/`, worker sculpting, geometry cache, boot work, the G13
polish pass: pet state, knees, lids, tumble, shoreline, dressed visits) with the pixel mode
unchanged. Story content pack in `src/content/` with CV1 and CV2 wired (campaign v2,
endings, the runner for all 31 side stories and the fun quests, story props, keepsakes;
side stories and the campaign as lazy chunks; grass placed in a worker; the Learning
Grove's story in Little Sprouts and Grove Readers). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## CV4/CV5 Atlas, Arcade and Multiverse saves (2026-10-16)

Works:
- Side saves (canon 21, 29, 30): one device-wide save each for the Atlas, the Arcade and
  the Multiverse (`grove.side.atlas|arcade|multiverse`, `readSide`/`writeSide`/`clearSide`
  in `platform/storage.ts`), apart from the three Grove slots per mode. Versioned with a
  migration list (`sim/side-saves.ts`); broken or too-new saves read as fresh; blocked
  storage is harmless. `readGroveSaves()` reads the Free and Hazel's Grove slots, never edu.
- Atlas runner (`sim/atlas.ts`): every page keeps its own progress and flags in the Atlas
  save, so pages play in any order. Step scene → "Do it" goal → done scene → complete
  scene; `requires` chains within a page; variants picked by flag value (`<scene>-<value>`).
  A page is hidden unless its strictest quest is allowed (teen pages behind Mature 13+;
  only `all` in the Learning Grove). Pages are found by file name (`sim/atlas-catalogue.ts`,
  a lazy chunk), so A1–A10 and A22–A31 join when their scripts are committed.
- Entry points: "Nova's atlas" and "Pixel's cabinet" in the More menu (`ui/atlas.ts`
  `StoryShelf`; scenes play in the dialogue box through `Dialogue.playScene`, which answers
  the shelf, not the sim). The cabinet shows in Hazel's Grove from chapter 6 and in the
  Free Grove from the start; neither appears in the Learning Grove.
- Read-only lookups (`sim/cross-saves.ts`): a frozen `CrossSaves` snapshot with
  `atlasDone(id)` (page or quest), `atlasFlag(page, flag)`, `arcadeDone(id)`,
  `longGrassLantern()` (any Hazel's Grove save has seen `c10-dawn`). The journal shows a
  "From the atlas" shelf from it; nothing is copied into the Grove save.
- Festivals by sets of pages: the five in `docs/more-stories.md`, any two lines of a set
  (`ATLAS_FESTIVALS`, `festivalsUnlocked`). The Grove toasts each once and remembers it in
  `world.atlasFestivals` (command `atlasFestival`).
- E6 (`sim/reflection.ts`, `openLastEndgame`/`endLastEndgameEternal` in `ui/atlas.ts`): the
  oldest living Eternal across the Grove saves is reflected (name, look, age) into the
  Multiverse save only; the `eternal` ending loses only the reflection, never remade.
- Tests: `tests/sim/side-saves.test.ts` (19): key separation, Grove keys untouched by
  side writes and lookups, blocked storage, migration, pages in any order, every
  committed page plays to its end, ratings, frozen snapshot, festival thresholds, E6.

Stubbed:
- Pixel's cartridges PA1–PA5 are not scripted: the cabinet's shelf is empty (`ARCADE_CARTS`).
- Festival scenes and rewards (Remembering Tree, sailable pond, Charter board, Long Table,
  cabinet tournament): only the unlock and the toast exist.
- E6 has no caller yet: the rift and the Multiverse runner land with their own milestone.
- Atlas step goals are "Do it" buttons; no page has its own world or minigame yet.
- Atlas pages have no Learning Grove versions yet (the atlas is hidden there).

Assumptions: High Score Night unlocks with any two of PA1–PA5; the Free Grove has the atlas
and the cabinet from the start; "after chapter 5" means the campaign is in chapter 6 or later.

Known bugs: none found. Not checked in the browser pane this pass.

## CV2 Learning Grove language switch (2026-10-16)

Works:
- Bands: the title's age menu adds "7–10" (Grove Readers, minigames at age 6); `EduState`
  has `band`, `storyLanguage` (Learning / Standard), `readAloud` and `lessons`, filled into
  older saves on load. The grown-up area switches all three (`ui/edu-story.ts`).
- The story: the Learning Grove picker has a Story entry that starts the campaign with the
  first Keeper. Fun quests and side stories are offered only at audience `all` (S23 never
  opens there). `content/edu.ts` loads as its own chunk for edu saves only.
- `sceneFor` (default band from `textBandOf(world)`) returns the band's lines, choices,
  `defaultChoice` and lessons; lessons follow their line through the swaps. `sceneDone`
  still applies the original scene's flags; the dialogue sends `choiceToSend`. A scene
  with no edu version reads its quest's `childLines` in any Learning Grove save.
- Dialogue (`ui/lesson.ts`): ask = big options, the best gets a star, then the reply;
  notice = its lines; do = its lines and a card. Reader glossary words are underlined,
  tap for the meaning. Sprout bracketed prompts are styled apart and read-aloud uses the
  device voice once sound is on (prompts not spoken). Journal shows the band's chapter
  and quest goals. Grown-up progress: story lessons by area and by standard, latest
  parent notes.
- Tests `tests/sim/edu-story.test.ts`: same flags in every band, valid choices, no sprout
  Collector (static and a full run), childLines, lesson anchoring, save round trip.

Stubbed:
- `do` beats: only `edu:count:<thing>:<n>` has an interaction (tap to count); every other
  verb is one "We did it!" button. Real Grove actions behind the check strings come later.
- Band ending titles (`EduCampaign.endings`) are not shown yet; the end card uses main.

Known bugs / assumptions:
- Assumed: the Learning Grove story starts with `TRAINERS[0]` (no Keeper menu there).
- Read-aloud is the browser voice (`en-GB`), not recordings; untested on iOS in this pass.
- Not checked in the browser pane this pass; tests, lint, build and content-check pass.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

