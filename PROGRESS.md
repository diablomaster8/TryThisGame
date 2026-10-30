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
## Round 6 · Lane E LOOK (2026-10-29, branch r6/e)

- *Works:* the in-training Digimon hop (three a metre, stretch 1.15, squash 0.75; Pixel walk
  frames, 3D `hop` spec field). The child hint fades in from |alignment| 0.2 to 0.5: ice white
  and blue for Sun, dusky violet with a red tip for Moon (two Pixel steps, four 3D blends,
  `render/sprites/child-hint.ts`). Eyes follow the Keeper within 5 m (3D irises; Pixel glance
  frames by screen side). Held Nubbins hug (heart), dangle or flail (swirl) by affection, a
  Moon adult squirms for a Sun Keeper (`render/held-mood.ts`). A gold brow star per rebirth,
  a ring at 4+. Family egg patterns (Chao speckle band, pocket two-tone, digital big spots)
  and a 3D egg that rocks when shaken and cracks at 20 s and 5 s (`render3d/egg-crack.ts`).
  Shadow Nubbins: ember eyes glow 0.4 in 3D, the unbonded hold their head low, a bonded one
  gets a warm rim (Pixel orange rim, 3D aura by trust, `render3d/bond-glow.ts`). Every line
  wears the shop hats (Pikachu, Agumon and Snorlax tested).
- *Stubbed:* the remembrance flower hat (R0424's second half); the egg's top lifting off;
  Pixel glance on the creature drawer (Chao only); a hat dye on creatures; the Shadow's slower
  walk; hats sit at the Chao's size on very big or very small creatures.
- *Works (second half):* personality gags play in place every 40–90 s, children at half rate
  and wobbly (`render/gag-play.ts`, both modes). A dry line for every shop item, critter,
  essence and wearable (`FLAVOUR`, 67 lines). Hazel's field notes on the Grove line's book
  pages. Photo mode: 3 in 20 photos are photobombed, 1 in 10 blinks (Try again or Keep it
  anyway), every photo has a caption (`ui/photo-comedy.ts`). Fifteen curiosities, logged once
  in `world.curiosities` (optional field), seven spotted in play (`ui/curiosities.ts`). A
  wardrobe with an eight-view live preview on each roster row (`ui/wardrobe.ts`). The
  evolution reveal: cocoon shake, white flash (none under reduced motion), landing spin. Four
  rarity tiers with roster frames and Grove glints (`render/rarity.ts`). Birthmarks for about
  one in five Chao, read from the seed, in both modes (`render/birthmark.ts`).
- *Stubbed (second half):* gags that travel (ball push, stream float); field notes for the
  pocket and digital lines; 8 of 15 curiosities have no in-game trigger yet (cup, lantern,
  Fern's stone, robot, stopwatch, scarf, back to back, upside-down egg); 3D rare glint.
- *Known:* the 3D hop ear flop is a head nod (the blobs' ears are sculpted into the head). The
  glance frames drop the idle breath for that moment.
- *Assumptions:* the Sun child's tips go sky blue (not yellow), per the spec; Tokomon keeps its
  stub feet tucked while hopping; the 3D bonded rim is an additive aura behind the body.

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

## Round 6 · Lane C FIGHT (2026-10-29, branch r6/c)

- *Plan:* R0269–R0289 not started, then the partials (R0250, R0253, R0272, R0274, R0256,
  R0217, R0218, R0234, R0236), C's share of R0260, R0333 if it fits. New sim files under
  `sim/battle/`, text in `strings-battle-r6.ts`, numbers in `tuning-battle-r6.ts`; shared files
  got self-contained blocks only. No save bump: new world fields are optional.
- *Works:* Dojo Ladder (5 belts × 3 bouts on `karateRecord`, kept through rebirth, Black Belt
  hat), Fusion burst in doubles (bond 80, 3 turns, splits at the fusing HP ratio), story-world
  bouts in a cloned Grove (`world-bout.ts`, results to the side save only), pass-and-play
  (`friendly`, share-code guests are copies, sticker only), the placement map
  (`contexts.ts`), six story bouts wired to the scenes' choices (dojo "Story bouts" list,
  `storyBout` command, `world.storyBouts`), the floor-5 guardian (`startGuardian`, keepsake),
  Circuit pre/post scenes, Play-fight Day (first Gentle bouts, Learning Grove), chapter 5 goal
  takes a ribbon, resume prompt and "Call it a draw", party needs held during a live bout
  (live and offline), Battle Book in the Collection, battle/circuit/calm songs and per-type
  hit sounds, personality idles (turn screen, Pixel and 3D boards, gallery row), 12 trial maps
  with par hats and a BFS solver test, merged partners as one tall tactics unit, replay codes
  and Save as postcard, dead karate/party-bout keys deleted, Neopia/Atlas `karate:survive:*`
  steps as real survive bouts fought by copies (R0340), slapstick (5 % fumbles, the dizzy
  spiral, pond pushes) and `docs/fight-design.md` (R0363). Edge: Pixel and 3D at desk and
  375×812 all pass, 0 console errors, axe 0 issues on the battle screen, turn mode 55.8–56.6
  fps and a 16×16 tactics board 56.5 fps at 4× CPU throttle.
- *Stubbed:* Pixel board still 13 `drawImage` a frame (R0253 wants ≤3 via WebGL). Story bouts
  are offered from the dojo list, not yet at their campaign beats; the skip-everything
  8-endings replay was not run. The guardian waits on lane B to call `startGuardian` on floor
  5. Fusion has a log line and no transform animation. Sprite gallery idles are Pixel only.
  No Circuit race (R0333, lane A's races). Survive bosses use stand-in species (no Chia art)
  and the NP1 bout was checked in the sim, not clicked through in Edge. Balance harness unchanged (Sprout median ~32).
- *Known bugs / assumptions:* the trials modal is not on the HUD's panel stack (Escape
  doesn't close it; use Close). "S-grade-only trait refresh" read as: the black belt clears the
  moody trait of a Nubbin with an S grade. A load with an unfinished turn bout holds the party's
  needs until it is resumed or drawn. `battle-screen.ts` is ~1,195 lines (split next).
  Hand-over: side-session note `r6-lane-c-handover.md`.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

