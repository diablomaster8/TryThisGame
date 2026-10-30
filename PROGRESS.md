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

## Round 8 · Lane A SOUL (2026-10-30, branch r8/a)

Plan: SOUL items from R0521 on, picking the ones that could be done properly in both
renderers, then round-7 partials. Text in `config/strings-soul-r8.ts`, numbers in
`config/tuning-soul-r8.ts` (one re-export line in `tuning.ts`). New idle acts live in
`sim/soul-idle.ts` and `sim/antics.ts` and run before the weighted pick in `chooseIdle`;
their looks go through `PetBeats` (`render/soul-looks.ts`), so Pixel and Full 3D share one
table. No save bump: every new field is optional. Edge: `node r8a.cjs <pixel|3d>
<desk|phone> 5181` in `recs-2026-10-27/tools`, all pass in the four, no console errors.

**Works**
- HOT-1 (Maor, top priority): clicking a Nubbin now centres it in the part of the screen the
  stats sheet leaves clear, in Pixel and Full 3D, desktop and phone. Cause: the sheet kept the
  camera on the Keeper and pushed it a fixed 17% right or 22% up. Now the camera aims at the
  Nubbin and `render/view-shift.ts` shifts the projection to the clear strip measured from the
  sheet; it glides (capped ease step) and cuts under reduced motion. `tools/hot1.cjs` proves it.
- R0536 favourite and disliked fruit rolled from `n.seed` (`sim/likes.ts`, cached); yum and
  bleh beats, ±happiness only, a disliked fruit is left until starving, a favourite is worth
  a 1.5× walk; the sheet shows ♥/✗ as "?" until seen, a first-taste toast. Plain is never
  disliked, so hand-feeding never gets a face.
- R0537 favourite toy ×3, boredom, ten-minute novelty (`sim/toy-soul.ts`); 120 min with two
  toys gives play 17–23% for every personality, the favourite 86–93% of it.
- R0532 Grumpy harrumphs with its back to the Keeper (puff emote), greets ×0.6, turns down
  30% of high fives; Sleepy yawns, nods off standing, naps ×1.6; 30 min above +40 clears it
  with a toast; a sheet chip says what softens it.
- R0535 `world.phase` from the curfew's wall clock (same hours as `daylight.ts`, a test
  checks every quarter hour); dawn stretch, dusk fireflies (≥10% of choices at 19:30, none
  at noon), night stargazing.
- R0534 rain by personality: stomps and raindrop-catching near the Keeper, shelter by the
  tree nearest the Keeper, never more than half at once; sheltering huddles (sit, shiver)
  instead of the sleep pose.
- R0542 Sun adults comfort crying or sad Nubbins (19/20 seeds within 60 s), Moon ones say boo
  from behind; children with a strong hint at half, ×1.5 in their own Grove.
- R0544 trips, sneezes by flowers (×2 in spring), hiccups after two fruits in a minute, a
  child's tail chase; hashed per second, so seeded days are unchanged; ≥15 antics of ≥3 kinds
  in 30 min with six Nubbins. R0552 synth sounds for them and the soul moments.
- R0551 pet and landing beats by personality (bounce, blush, wiggle, melt; wheee, teary,
  tongue, flop). R0549 emote balls 1.5× at the far zoom or with Big mood bubbles (default on
  in the Learning Grove), a reaction pops 2× for 300 ms; 27 CSS px on a 375×812 phone.
- R0575 none of the new acts start during catch-up. R0593 Settings → Liveliness (calm,
  normal, lively; sprouts default lively) scales antics, phase quirks and pranks.
- R0563 a diary of the last five things and a "Recently" box on the sheet. R0579 roster
  personality chips (a child's leaning faded) and a filter row with 44 px chips.
- R0539 (r7 partial) a buddy away is missed (`n.missing`) and gets a reunion hug and a
  toast when it comes back.

**Stubbed / not done**
- R0542: no fruit sharing, tidying or hoarding yet. R0544: no clumsy/sneezy trait multipliers
  (traits, R0528, not started), no fall-asleep-standing. R0552: no snore loop or chat voices.
- R0551: picked-up variants are not done (the held moods from LOOK-50 still apply).
- R0549: the selected Nubbin is not drawn bigger (the renderers do not know the selection).
- R0535: the renderer still computes its own phase (from the same hours; a test pins them).
- Not started: R0525, R0528, R0529, R0533, R0538, R0540, R0541, R0543, R0545–R0548, R0550,
  R0554–R0562, R0564–R0574, R0576, R0577, R0580–R0592; FUN R0345, R0356, R0361, R0364,
  R0366, R0367; round-7 partials R0344, R0346, R0527 (cottage hiding), R0553.

**Known bugs / notes**
- Full 3D on a 375×812 phone (headless Edge) stalls about 0.7 s on the first stats-sheet open;
  the camera glide now rides it out, but the stall itself is a perf follow-up (lane D).
- Assumption: R0537's boredom fades 9 a minute, not the recommended 0.2 (which pins every
  toy at the floor after a minute of play and drops play to 6–11%).
- Tests moved on purpose: `features.test.ts` rain now accepts the rain games;
  `clip-for.test.ts` shelter is a sit. Timing tests flake under the four-lane load and pass
  alone; budgets untouched (the 8-Nubbin hour and full life measured equal to ce12521b).
- Full 3D in headless Edge was often still on "Shaping the Grove" when shots were taken, so
  the 3D looks were checked by the sim and the pose tests, not by eye.

## Round 7 · Lane E LOOK + KIDS (2026-10-30, branch r7/e)

Plan: the three KIDS live bugs, then the cheap unstarted LOOK items, then KIDS from R0674 in
order where a proper job fitted. Shared files got self-contained blocks only; no save version
bump (new fields are optional: `Nubbin.hideBelt`, `EduState.alwaysReborn`, `roundsPerGame`).

- *Works (KIDS):* in a Learning Grove ⚙ opens a kid-safe sound sheet (on/off, one big volume
  slider) with no gate; its "Grown-up settings" asks the sum gate first, and Reset save asks the
  gate before the confirm (`ui/kid-sheet.ts`, pure `routeSettingsTap`/`resetAllowed`). Settings
  no longer copies the age/band/read-aloud switches; it links to the grown-up area. The break
  card tucks in the child's own Nubbin asleep (never Sable), leads three spoken stretches and a
  drink, and "All done for now" says goodnight and stays locked. A moon fills in the corner two
  minutes before the break with one spoken warning, and a round, scene or tracing still open may
  finish first (3 min grace, `eduBreakShouldStart`). Sprout chapter goals carry `goalIcon` and
  `goalSay`; the What's next card shows and says them, and its "Show me" (and 20 s of no
  progress) points a bouncing hand at the egg, Nubbin, tree or fruit and pulses Pick up, Shake,
  Put down, Pet or Feed on the sheet (`ui/guide.ts`; a test follows only the hand from a fresh
  age-4 world and hatches and pets within 90 s). The minigames read aloud for sprouts (prompt,
  reply, score; emoji said as words), 🔊 replays for any band, holding an option says it and
  counts icons. Story choices and lesson options in the sprout band are numbered picture rows,
  72 px, read out as a set, said on a hold (`icon?` on `Choice`/`LessonOption`; chapter 1 has
  icons, content-check counts the rest as `sproutNoIcon`). The picker speaks, shows stars per
  game, bounces the tile while saying its name, fills a tablet in three columns. Sprout rounds:
  rhymes and first sounds keyed by sound (`firstSound`, whale rhymes with snail), the sum cue is
  two groups and a ➕, "There is 1", no repeat target in a session (`roundKey`, `avoid`).
  Results card: the Nubbin cheering, stars popping with chimes, "+35 🐚", two 96 px picture
  buttons, spoken praise; no reward toasts over a round, and a sprout's notices wait until the
  activity closes (festivals dropped in edu, `ui/kid-notice.ts`). Misses keep their colour with
  a 💭 and a wobble, the answer pulses after two; sprouts leave a game by holding 🏡. The sprout
  HUD hides Run, Keeper, Shop, the Grove switch and the camera buttons and grows to 72/80 px
  (`body.edu-sprout`). Sprout Nubbins are always reborn (reader: grown-up toggle). The age
  picker has four 🌱 tiles and a wide Reader tile, its own subtitle, and speaks the question;
  chapter cards are spoken and the chip hides under them; rounds per game by age (3/5/5/6,
  reader 8) or a grown-up's pick.
- *Works (LOOK):* Dojo Ladder belts worn round the middle in both renderers, white to black,
  with a Wardrobe switch (`render/belt.ts`). One hat per real season (sprout cap, sun visor,
  leaf crown, woolly hat) leads the shop in its season and is kept for good. A species listed
  in `public/sprites/manifest.json` uses a hand-drawn sheet in Pixel, missing frames filled from
  the nearest (`render/sprites/sprite-source.ts`, `docs/sprite-sheets.md`; proved in Edge with
  a routed sheet).
- *Stubbed:* the race headband (R0437); the seasonal free gift (R0438); glTF for 3D (R0439);
  recorded animal and phoneme clips (R0675, not started); sprout icons for the other 7,220
  choices and options; the reader age select stays hidden instead of offering 7–10; the
  "Nubbins yawn" in the Grove before a break.
- *Bugs / notes:* the smoke driver is `recs-2026-10-27/tools/lane-e-r7.cjs <pixel|3d> [phone]
  [grove [sheet]]` on port 5193 (5185 is held by an old r2 server); 0 console errors in Pixel
  and Full 3D, desktop and 375×812, Learning Grove and Grove. Timing tests (full life, nav,
  world hour, battle budget) failed under the parallel lanes' load and passed alone.
- *Merge:* origin/main ce12521b (lane C r7, save v13; lane A r7) merged in. Reset save keeps the
  grown-up gate and now confirms with lane C's `confirmModal`; the three optional fields
  round-trip through v13 (test in `tests/sim/lifecycle-edu.test.ts`).

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

