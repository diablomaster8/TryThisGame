# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16)

Shipped and deployed: v1, the organic painted Grove, the Digimon-inspired ten, the Hollow
Below dungeons, the 96-unit field, three save slots per mode, and the Full 3D mode as a
Graphics setting (`src/render3d/`, worker sculpting, geometry cache, boot work, the G13
polish pass: pet state, knees, lids, tumble, shoreline, dressed visits) with the pixel mode
unchanged. Story content pack in `src/content/` with CV1, CV2 and CV3 wired (campaign v2,
endings, the runner for all 31 side stories and the fun quests, story props, keepsakes;
side stories and the campaign as lazy chunks; grass placed in a worker; the Learning
Grove's story in Little Sprouts and Grove Readers). In the
working tree, unreviewed and uncommitted: Atlas A1–A10 and A22–A31 (plan.md Task B-R1).
Review of everything done and open, and the v3 plan with briefs: `plan.md` (2026-10-16).
Waiting on Maor: the expansion pick E1–E3 / S1–S4, the daily-gift decision, seven
fun-quest quotes, whether Full 3D becomes the default, his phone rows in the device pass.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## CV3 language questlines: Hebrew and Japanese in the Learning Grove (2026-10-16)

Works:
- Offer: "Nova's postcard" in the Learning Grove picker (`ui/lang.ts` `LangPanel`) starts
  Ori's Hebrew (LH1–LH6) and/or Hana's Japanese (LJ1–LJ6), starting the story first if
  needed. The quests run on the side-story machine in `campaign.fun` under `langRule`
  (`sim/lang.ts`): nothing opens, steps or finishes without `world.edu`; LH1/LJ1 open at
  once, each next quest on a morning at least `LANG.nextQuestAfterMs` after the last.
  Scripts, edu versions and speakers (Ori, Hana) register from the edu chunk
  (`registerLanguageQuests`), so the main game never loads them.
- Text: `sim/lang-text.ts` splits lines into Latin/Hebrew/Japanese runs. Dialogue lines
  are `dir="ltr"`; Hebrew runs (with their own `?`/`…`) sit in `<bdi dir="rtl" lang="he">`;
  Japanese words are `lang="ja"` no-wrap spans; script lines skip the typewriter. Journal
  goals and hints use the same (`scriptParagraph`).
- Fonts (Fontsource, exact pins 5.3.0): Noto Sans Hebrew, Noto Sans JP (unicode-range
  subsets), Klee One for tracing; loaded on first script text (`ui/lang-fonts.ts`).
  Checked in the browser: Hebrew line renders isolated with niqqud; the built woff2 load.
- Words: `edu.words[id] = {heard, used}` (save fills older edu saves). Heard: course
  words in the band scene the child saw, or a tap on the word. Used: a picked choice's
  words, or the traced word (אוֹרִי, はな). Child word book per course on the postcard;
  grown-up area lists every band word with heard/used.
- Audio hooks: `platform/lang-audio.ts` maps each `VocabItem.audio` to
  `audio/lang/<id>.mp3` once listed in `RECORDED`, else `placeholder.wav` (a voiceless
  chime). Tapping a word plays it; read-aloud strips Hebrew/Japanese (`withoutScript`),
  so no synthetic voice ever says them. How to add recordings: `public/audio/lang/README.md`.
- Tracing (`ui/trace.ts`, journal "Trace it" on the four trace/write steps): kana with
  numbered strokes in school order (`ui/kana-strokes.ts`, aligned to Klee One in the
  browser), Hebrew letter by letter right to left, each started at its right side and
  passed on ink coverage (`ui/trace-check.ts`). Finishing sends `langTraced`.
- Reactions: a learned word (used, or heard 3 times) heard near the Keeper makes up to 3
  Nubbins react (`langReact`): shalom wave, toda nod, kochav look up, colours point, every
  Japanese word bow, and so on; the HUD captions the nearest one.
- Tests `tests/sim/lang.test.ts` (18): runs and bidi punctuation, whole-word matching
  (phrases, frames, two readings), no script to TTS, clip ids, main-game gating, postcard
  gating, a full Hebrew course to lh6Done, reactions, save round trip and fill, strokes.

Stubbed:
- Every clip is the placeholder until native-speaker recordings land.
- Wave/bow/etc. show the existing reaction faces plus a caption; no gesture animation.
- Non-tracing checks (count plums, sort fruit, paint the fence, …) are the journal's
  "Do it" button. LJ2's write-down option (`writing-mode: vertical-rl`) is not built.
- The tracer was not driven by hand in the browser pane; only its guides were checked.

Assumptions: words are learned per Grove, not per Nubbin; Japanese learned words all bow
(the course note: "bow … at any word they have learned").

Known bugs: none found.

## Story scene replay fix (2026-10-16)

Works:
- A finished story scene no longer plays a second time. `Dialogue.finish` sends `sceneDone`,
  which the sim applies on the next frame; at a low frame rate the HUD's 200 ms loop still
  saw the old queue head and replayed it. `ui/scene-replay-guard.ts` holds the finished id
  back until the queue head changes (tests in `tests/ui/`). Checked in the hidden browser
  pane on `?edu=4&slot=3`: c1-letter closed once and stayed closed.

Stubbed: none. Known bugs: none new.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

