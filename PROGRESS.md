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

Open, with estimates:
1. Event bursts: 3D has only tree leaves and landing dust; no sparkle, hearts, crumbs or
   petals for hatch, evolve, rebirth, Eternal, cocoon, eating, chests; no squash. 2-3 h.
2. Hollow Below entry stall in 3D (its lamps recompile every material, by design):
   compile asynchronously behind a fade. 1.5-2 h.
3. Camera inside tree crowns at the close zoom hides the Keeper; fade crowns between
   camera and Keeper. 1-2 h.
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

Stubbed: none new. Known bugs: items 2, 3 and 10 above.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

