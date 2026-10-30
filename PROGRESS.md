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
repetitive daily quests are out. Hollow art pass: built 2026-10-21 (below). Play review of
2026-10-24 (`docs/review-play-2026-10-24.md`, run on a stale checkout): fixed 2026-10-25 on
branch `fix/r1025-merge`, not pushed until Maor OKs (section in `docs/progress-archive.md`).

## Round 8 · Lane E LOOK + KIDS (2026-10-30, branch r8/e)

- *Works:* **KIDS.** R0682 a skills ladder per game (`EDU_LADDER`; counting climbs count to
  3/5/10, more-or-fewer, sums to 5/10; others by age level): three first-try rights up a rung,
  two shown answers down one, once a sitting, never for readers; the grown-up area says where
  each game is. R0683 per-item mastery (`EduState.items`, `letter:G`, `count:7`…): weaker items
  come up more (seeded weights, recency halved); a 26-letter grid and number/colour/shape strips,
  green ✓ / amber dashed / grey. R0685 "My Book": 60 stickers on six pages in a fixed order (no
  draws; a save's count names its stickers, so old saves need no migration), pixelated art, tap
  to hear, swipe or ◀ ▶; the results card flies the new sticker into the book. R0680 ⋯ in a
  Learning Grove opens Places, 120 px picture tiles (My Book, My Nubbins, Decorate, Photo,
  Play-fight on; Kindergarten, Map, Beetle Run off), hold to hear, grown-up toggles. R0692 an
  edu shop sells from a three-egg shelf that changes daily, each bought once, hatching exactly
  that colour as a Nubbin (no rare/jewel/shine roll). R0695 limits: minutes a day, quiet hours
  (local clock, across midnight), "Open straight into this Grove" (boot lock key
  `grove.kidsLock`, `?title` skips it); a sleeping-Grove card with a gated 30-minute unlock.
  R0703 tracing: misses stay grey 0.8 s then fade, a ghost finger on open and after two misses,
  the stroke finishes itself after four, green start dot spoken, a 15 ms buzz, radius 20 at
  3–4 / 16 at 5–6 / 14 readers. R0712 sprout letter and sound pictures show their words only
  after the answer. R0713 age-4 Animals mixes name/sound/home; Sounds is phonics only. R0714
  count cues in five-frames; after the answer each icon lights as its number is said. R0719
  `{child}` / `{child's}` in Learning Grove lines (c1's letter), "Hello, Maya!" before the entry
  question. **LOOK.** R0425 every saved photo goes to an IndexedDB album (24 newest, 12 kept),
  persisting across reloads; a memorial card shows the Nubbin's newest photo. R0441 twelve
  photo stickers (both modes, the 3D portrait included).
- *Stubbed:* R0441's "With me" Keeper selfie; R0685's milestone stickers (the order is the
  only rule); R0680's Glow Cave, Fun Run and Atlas tiles (those modes do not exist yet);
  R0692's rare colours as sticker or story gifts; R0703's glyph clip on completion (needs
  recorded clips); R0719's "how to say it" field; readers' rounds carry no mastery item.
- *Bugs / notes:* none known. No save version bump: `skills`, `items`, `places`, `eggShelf`,
  `limits` are optional EduState fields. Smoke: `recs-2026-10-27/tools/lane-e-r8.cjs` and
  `lane-e-r8-photo.cjs` (port 5197) in Pixel, Full 3D, phone and reader: 0 console errors. With
  `node_modules` as a junction, Vite 403s the Hebrew/Japanese font files unless `server.fs.allow`
  covers the junction target (a local, uncommitted config did); not a game bug.

## Round 7 · Lane A MOVE/FUN/SOUL (2026-10-30, branch r7/a)

Plan: finish the two MOVE live-bug partials, then the FUN items not started (R0342 on), then
SOUL from R0521 in order, as many as could be done properly. New text in
`config/strings-fun-r7.ts`, numbers in `config/tuning-fun-r7.ts` (one re-export line in
`tuning.ts`). Edge: `node r7a.cjs <pixel|3d> <desk|phone> 5181` in `recs-2026-10-27/tools`,
14/14 in all four, no console errors.

**Works**
- MOVE: R0001 the stream wade is knee-deep (0.35 at the centre line, the bed hides the feet),
  3D ripple rings round the Keeper (`render3d/wade-ripple.ts`) and a soft slosh step.
  R0003 decor never squashes a crop or sapling (`crop` refusal); on a desktop the placing chip
  turns red with the reason before the click (`placeHint`).
- FUN: R0342 read-aloud per speaker (`VOICE_TTS`), shouted words lowercased with a pitch bump,
  best voice picked once, karaoke word light (CSS highlights), a beat after "!".
  R0343 "Read to me" opt-in for Grove Readers. R0344 `Line.id`/`Line.vo`, the VO exporter
  (`tests/tools/vo-export.ts`) and `docs/vo-casting.md`. R0346 `docs/playtest-funny.md`.
  R0348 canon keep-jokes table (`docs/canon.md`) checked by content-check; Gerald restored
  in reader c4-close. R0350 Sable's refusals by trust band. R0351 the egg's own wobble, a
  late hop, the third-shake foot (both renderers) and a muffled "hey". R0352/R0355 the idle
  Keeper reads the letter, sits at 40 s, the nearest Nubbin sits beside it (rule-three
  affection) and leans, dozes and snores a bubble; live play only (wall clock, ×1, visible,
  no scene queued). R0353 Moss's dry reactions from chapter 4. R0354 the after-card turn,
  wobble and sit with a quip per type. R0357 rename dialog with a silly-name button (sprout:
  picture buttons). R0360 30+ dry sheet captions (main band). R0365 Slapstick setting
  (full/gentle/off); screen shake now covers the story's nudges.
- SOUL: R0522 personality chip with pixel icons, blurb and a tendencies card. R0523 a child's
  leaning (the lock rule, at half strength in idle odds). R0524 the everyday idle pick is one
  weighted table (`sim/idle-choice.ts`, `IDLE_ACTIONS`), odds in the debug panel. R0526 the
  fortune uses the real rule. R0527 Learning Grove throws are a toss and catch, trust floor
  30. R0530 every kind of care counts (`touches`, `tucks`). R0531 the lock line on the
  evolution card. R0539 friends away fade slowly; a departed buddy's flower gets visits.
  R0553 behaviour histogram in the debug panel and a distinctness test. R0578 the forming
  meter.

**Stubbed / partial**
- R0001 the 3D stream screenshot was taken mid-scene (staged); the sink is verified in sim.
- R0003 no world-space ghost; the hint is the chip, desktop only (a phone tap still toasts).
- R0344 ids are computed, not frozen into the script; no clip playback (no recordings).
- R0345 not started (XL). R0346 no sessions logged yet. R0351 no upside-down squeak.
- R0353 no pre-chapter-4 hill silhouette. R0364, R0366, R0361, R0356, R0367 not started.
- R0527 no "hiding in the cottage" (the trust floor means it never runs).
- R0539 no reunion hug for a returning stray. R0553: cheerful/mischievous and shy/lazy are
  still under 0.25 apart (`it.fails` records it; needs SOUL-04/SOUL-10 quirks).
- R0524's bases reproduce the old shares with every action open; seeded days moved, so
  `pair-play` uses seed 23 and `dungeon-acts` (lane B's test) brings the boss to the Keeper's
  dry spot after a fall.

**Known bugs**
- Timing tests (lifecycle full life, nav, world 8-Nubbin hour, battle balance) fail under the
  four-lane load and pass alone; budgets unchanged.
- New save fields are optional with defaults (no version bump): `keeper.idleMs/sitWith/
  sitBesideMs`, `nubbin.eggShakes`, `childCare.touches/tucks/lastCareMs`, `remembered`,
  `edu.readToMe`, `settings.slapstick`.

## Round 7 · Lane C CAMP + FIGHT (2026-10-30, branch r7/c)

Plan: the campaign engine first (R0594–R0596 as one story book), then the CAMP items that
build on it, then the FIGHT partials. **Save v13** (`lines: {}`); a v12 save from main loads
unchanged (`tests/sim/story-book.test.ts`).

- **Works:** `world.lines` (new `sim/story-book.ts`): in Hazel's Grove (chapter 3 on) the four
  separate campaigns run *beside* the spine, two at a time, each with its own chapter, flags,
  counters (from zero at its start), stats and cast. Their scenes go through `campaign.queue`,
  which the dialogue box, stage and renderers already play; a line only queues onto an empty
  spine queue after the side-story gap, ahead of the side runner but never ahead of Hazel's
  opening or met goal (R0597, R0631). `sceneDone` routes a line's scene to the line's flags.
  Line chapter toasts name the line; a line ends on its own (`lineEnded`, its own end card),
  then the Grove's recolour and partner slots are put back (R0600, R0601). Line Nubbins count
  toward `STORY_BOOK.lineCastMax` (4), not the roster (R0594); Dawn & Dusk beside Hazel brings
  its own Nubbin and reverts only it; Logged In beside Hazel never touches `unlocks`. Lines
  hold in Hazel's chapters 9–11 and the vigil (R0612). Journal "Other roads": Begin (or why
  not), goal, Do-it, areas, actions, Leave and Restart (R0643), plus the story bout waiting at
  its beat (R0275). `spine:<flag>` check term and a content-check rule that a line's checks
  name only its own flags (R0595, `tests/tools/line-flags.ts`). In-game confirm card
  (`ui/confirm.ts`) replaces every `confirm()` (title, settings, debug) (R0647). Debug panel
  "Lines" row (R0644). BroadcastChannel slot claim: a newer tab on the same slot takes it and
  the older one holds its saves; other slots are unaffected (R0658). `storage.persist()`, a
  one-time iPhone Home Screen card and a fortnightly post-ending backup chip (R0624).
- **Stubbed:** no regions yet (R0605): line Nubbins and scenes live in the Grove and the
  storyline renderer dressings (servers, the Fold) only show in separate-campaign saves.
  Legacy separate-campaign saves stay their own mode (R0598 stage A/B not done). No offers,
  boards or pace settings (R0602–R0604, R0606–R0611, R0613–R0623). Bring-home choice at a
  line's end, the Valley Fair epilogue and per-line rewards not built.
- **Bugs / notes:** `world.test.ts` "survives 8 Nubbins for an hour" takes ~5 s on origin/main
  too (checked in a clean worktree at 76eb8b1), so not this branch. Line goals that read world
  state (`recruits`, `team:joined`) may be met already in a long Hazel save. Drivers:
  `recs-2026-10-27/tools/lane-c-r7.cjs <px|3d> <desk|phone>`, `lane-c-r7-tabs.cjs`,
  `lane-c-r7-ios.cjs`. Hand-over: side-session note `r7-lane-c-handover.md`.

## Round 6 · Lane D (2026-10-29, branch r6/d)

Plan: riding and the swim tow (R0085, R0088) first, then the cheap WORLD P2s, R0359, partials.
The XL region builds (R0096–R0098, R0086, R0108) need a second drawn region and stay unstarted.

- **Works:** R0085 riding (`sim/ride.ts`, `RIDE`): Ride / Get down / Cheer on on the stats sheet
  for an adult with affection 60 and a level-30 stat; pace by type (Run 2.0, 2.6 running);
  twice the walking drain until it asks to get down at 0.2; Lazy sits 2 s every 40 s until
  cheered, Mischievous hops aside on 10% of turns, Shy slows near people, Cheerful bounces; a
  Learning Grove rides anything hatched (a child tows by the hand), free. The carrier walks
  under the Keeper, who sits on its back at 0.8 scale (`render/ride-pose.ts`; Pixel `sit`
  frame, no x-ray through the carrier; 3D `sit` pose, `render3d/ride-scale.ts`). Run adult
  edge to edge ≤ 14 s (test). R0088 swim tow (`sim/swim-tow.ts`): a Swim-30 partner or carrier
  tows the Keeper through the pond's water at ×1.2, paddling ahead; without one the shore
  stops it and a hint says a good swimmer could help (once a minute). R0119 path and deck ×1.15
  (`sim/surface-pace.ts`; grass vs path 14 u differ 13–17%). R0123 the 4 u collider grid
  proved against a full scan on 10,000 points; 1,000 extra obstacles leave queries and a 7-day
  catch-up as cheap. R0124 `regionLeftMs` + `regionAwayMs`: only the Grove steps in catch-up.
  R0129 four Grove gags (`content/world-gags.ts`) on two new signposts, the scarecrow and the
  hive, in turn after a piece's own line. R0359 a four-line festival vignette per season
  (`content/festival-gags.ts`), once per save, recorded by `festivalGagSeen` (never by
  catch-up), not before the first hatch, in a Learning Grove or chapters 9–11. R0107 camera
  holds 0.6 s on a found landmark. R0104 Chunk grid button (`render/debug-chunks.ts`).
  content-check's sentence count now matches whitespace (it matched a literal "s"), which
  caught one three-sentence trace line (fixed).
- **Stubbed:** ride pose checked at 8 yaws in Edge but with the stock `sit` frame (no straddle
  frame); the tow is a placement plus the `swim` clip, not a hand-hold rig. Deep water is the
  pond only (no lagoon until the shore). Gags have no per-gag animation (the scarecrow does not
  turn). Festival vignettes are dialogue-box only, no staging. Not started: R0096–R0098, R0086,
  R0108–R0118, R0120–R0122, R0125–R0128, R0130–R0141 (R0116 is mostly MOVE-44's tap dots,
  lane A's files).
- **Known bugs / assumptions:** `resolve` scans the walker's starting cell only, so a point
  shoved several units out of a hill in one call could miss a collider in the next cell; no
  walker moves that far in a step (test notes it). Riding persists through a reload; the
  ridden Nubbin skips its own behaviour, so it cannot eat while carrying (it asks down at 0.2
  energy). Full-suite runs on this loaded machine fail the timing tests (full life, nav, world
  hour, battle balance); each passes alone, as on main. Phone probe: 0/38 over in the second run;
  the first had 3D farOrchard at 186 calls (budget 180), and two isolated farOrchard runs peaked
  at 161 and 168: the count swings with where the NPCs stand (round 5 saw 176–178).
  After merging main (192f8fa) farOrchard read 185–189 in two probes (main alone 170–178), so the
  four lantern posts' 16 draws now fall to a 4-draw instanced batch when far (`far-lanterns.ts`,
  the far-tree rule); two probes after: 0/38 over, farOrchard 172 and 161.
## Round 6 · Lane B DUNG (2026-10-29, branch r6/b)

- *Works:* boss floors (R0160): every act's boss sits on its 'boss' piece (60/60 seeds); the
  first win opens a big chest (a Legendary at the boss's level), shows the celebration card
  and wakes the next act's camp waypoint; a boss loss rests the party fully. The haul sack
  (R0175): gear finds ride in `run.sack` and bank at a waypoint, camp, acorn or home with a
  "Bank it!" card; no path shrinks what is owned (test). Stash (R0174): satchel overflow lands
  in `gear.stash`, listed rarest-first at the camp stash with Take. Tumble home (R0362): all
  party energy 0 rolls everyone home, half the sack to the satchel, half to the stash. Mystery
  Basket stall (R0176) at the camp vendor, odds within ±1% over 100k. Warm losses (R0180):
  half energy, "Sneak past?" after 3 losses, pack looks away 60 s. Sleepy packs (R0203): ~20%
  doze, walking by pays a tiptoe bonus, running wakes them, a Lazy Nubbin may yawn one awake.
  End trip confirm (R0184); chest and stray seeds without the roster (R0186); today's results
  on the cave-mouth menu and Journal (R0185 part, R0165 part); rolling stats in the debug
  panel (R0211); Stray King and rotating stray lines (R0326); co-op `keepers: []` and a
  replay test (R0209); `docs/hollow-design.md` (R0171). Save v12: `gear.stash`,
  `hollow.bossChests`, `hollow.today`, `hollow.stats` (test).
- *Stubbed:* boss `phases` are in the `EncounterSpec` but lane C's core ignores them; no
  sealing arena door or anteroom (retry is from the stairs); no Zzz, tiptoe or crown art
  (lane E); the Journal page has no request-board ties (adding templates needs strings.ts and
  the no-chores cap) and today's floors are the daily seed, not a fixed 5-level act chain;
  stash has no tabs or search; the floor-5 guardian (R0260) waits for lane C's r6 merge.
- *Known:* the boss chest is Legendary until sets exist (R0172); a bout lost to the act boss
  still teleports to the level's stairs up.
- *Assumptions:* banked = satchel or stash; the tumble's "half" moves to the stash instead of
  being lost; today's best time is the quickest daily trip to today's deepest level.


## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

