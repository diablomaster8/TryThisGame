# PROGRESS.md

Read this with CLAUDE.md at the start of every session. Keep it under 150 lines: when a
new pass goes in at line 12 and the file is long, move the oldest section to
`docs/progress-archive.md` (newest first there too).

## Status (2026-10-16, evening)

Shipped and deployed (https://diablomaster8.github.io/TryThisGame/): v1, the organic
painted Grove, the Digimon-inspired ten, the Hollow Below, the 96-unit field, three save
slots per mode, and the Full 3D mode as a Graphics setting (`src/render3d/`, workers and
caches, the G13 polish, the G14 bundle diet, the G15 and G16 parity fixes) with the pixel mode
unchanged. Story content pack in `src/content/`; engine CV1–CV6 wired (campaign v2 and
endings, all 31 side stories and the fun quests running, props and keepsakes, the Learning
Grove switch, Hebrew and Japanese, Atlas/Arcade/Multiverse saves, Mature content setting,
one-time gifts). Atlas A1–A31 all scripted; A1–A10 and A22–A31 reviewed and fixed (plan
Task B-R1; reports `docs/logs/review-wave-L.md` and `review-wave-M.md`). Plan v4
(`plan.md`): G11 device pass, Track B writing and review tasks, and Part Z, the
independent full review that runs last. Maor picked all of E1–E3 and S1–S4 (plan G12, in progress below). Waiting on Maor:
seven fun-quest quotes, Full 3D as default (brief: `docs/renderer-decision.md`), his phone
rows, the Atlas quote, adviser and audience items in the two wave reports, and
the Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## G12 X6: S3 "The Beetle Road" with fusion (2026-10-17)

The third separate campaign, in the `beetle` save mode. Script
`src/content/storyline-beetle.ts` (8 chapters, 3 endings; Hob the quartermaster and
Ottoline Vane), rule `sim/storyline-rules-beetle.ts`, and the new `sim/fusion.ts`.

Works:
- Goals on the existing systems: join a guard team (`team:joined`), a Beetle Run
  (`tank:runs`), Hollow floors 2 and 4 (`hollow:best`), two door keepers as dojo wins
  while chapters 4 and 8 are open, the lever choice, and the fusion chapter, whose goal is
  `fused:>=1|flag:b-fusion:refused`: the Fuse button or the Do-it refusal both move on.
- Fusion (`canFuse`, `fuse`, command `fuse` on the two partners, event `fused`): both
  adults, affection 80 and trust 60 each, never an Eternal. The one that stays keeps the
  higher points and the better grade of every stat, fills empty part slots from the other,
  adds its type lean, gains affection, goes up a generation, and remembers the other in
  `genes.fusedFrom` and its ancestry. The other leaves the roster; partners and any merge
  are cleaned up. `FUSION` in tuning.
- Endings: the Open Sky (lever down), Two As One (lever down after a fusion), Steady Rain
  (machine left running).
- Tests: `tests/sim/fusion.test.ts` (consent rules, what is kept, the command) and
  `tests/sim/storyline-beetle.test.ts` (fused, refused and steady-rain runs).

Stubbed: the door keepers are the ordinary dojo rivals with the chapter’s framing; the
weekly guard missions are not goals (they would be a chore), so the “leader’s errands” are
narrated. No stats-sheet line for `fusedFrom` yet (`fusedFrom()` is ready for it).

## G12 X5: S2 "Logged In" with party bouts (2026-10-17)

The second separate campaign, in the `logged` save mode. Script
`src/content/storyline-logged.ts` (8 chapters, 3 endings; Warden, Juno and Root), rule
`sim/storyline-rules-logged.ts`, and a new minigame: the turn-based party bout.

Works:
- Setup: three starter eggs rolled from the chosen Keeper’s line are the party (flag
  `party`); both Grove recolours are unlocked so the Day and Night servers are the Sun and
  Moon Groves (Where To: Day Grove, Night Grove; the night one refuses until chapter 4).
- `sim/party-bout.ts`: three partners against three seeded foes, one move each per round
  (strike, guard halves the next hit, rally heals the party 15%), foes strike the weakest
  or guard; karate’s stat maths (Power, Stamina, Run). `ui/party-bout.ts` is a plain DOM
  panel opened from the journal’s Fight a bout button (`StoryAction.ui` + `Journal.openers`,
  wired in hud.ts) and reports `partyBoutResult`; won bouts count (`count:partyBout`) and
  pay shells by tier (`PARTY_BOUT`).
- Goals: hatch three; bouts 1, 3, 5 (two of them after crossing to the night server), the
  board (Do-it), 8, the root-node choice, 10. The sibling-and-company thread is a
  `mature:teen` beat (`l-c5-thread`), so it never plays with the setting Off.
- Endings: Everyone Wakes (Root’s word, party intact), the Quiet Exit (the company’s word),
  One Short (Root’s word after a partner departed).
- Tests: `tests/sim/party-bout.test.ts` (seeded, strong wins, weak loses, turn order, guard
  and rally) and `tests/sim/storyline-logged.test.ts` (setup, the mature gate both ways,
  all three endings).

Stubbed: the bout panel is text rows and buttons, no sprites or animation; the "card-like
format" is the move set, not drawn cards. Other locked-in players are narrated (Juno),
not NPCs on the map.

## G12 X4: S1 "The Hundred Days" (2026-10-17)

The first separate campaign, in the `hundred` save mode (title screen → The Hundred Days →
pick a Keeper). Script `src/content/storyline-hundred.ts` (10 chapters, 4 endings, Ida
Brack and Sorrel), rule `sim/storyline-rules-hundred.ts`, registered through
`sim/storyline-content.ts` (the script chunk) and `sim/storyline-rules-index.ts` (imported
by campaign.ts for its side effects).

Works:
- Setup: the roster becomes one egg, named partner, `spanScale` 72 so its adult span is
  about fifteen real days (`STORYLINES.hundredSpanScale`; ×10 to ×1000 in the debug panel).
- Six areas from the journal’s Where To: meadow and shore are the Grove, the cave starts a
  Hollow run, the mountain is the story Hollow set, the mire is Corvin’s garden in rain,
  the mill the same set in clear weather. Arriving spawns one wild visitor of the area’s
  habitat pool, so each area has something to win over for the Fold.
- Goals: hatch; recruits 1, 2, 3 (shore), a Hollow run, the partner’s evolution, recruits
  5 (mire), prosperity 60 at the mill, the Hush (a dojo win during chapter 9), the last
  day. Two choices (naming, the loft lamp) are flagged for later use.
- Endings: Bright Fold (prosperity 100, no moody partner), the Fold, Quiet Fold
  (prosperity under 60), a Grey Lamp (a moody or Shadow partner).
- Tests: `tests/sim/storyline-hundred.test.ts` plays all ten chapters to each of the four
  endings through the real commands (`storyArea`, `leaveDungeon`, `karateResult`,
  `debugHatchNow`), with `tests/sim/storyline-driver.ts` shared by the S2–S4 tests.

Stubbed: the Hush is the ordinary top-tier dojo rival with the chapter’s framing (no
colossus sprite or special fighter); the length is a session, not the brief’s 8–10 hours,
and a writing pass could add beats between the recruit goals. The chapter-9 bout counts a
win anywhere, not only at the mountain.

## G12 X1–X3: expansions E1 The Square, E2 Nova’s Season, E3 The Twine (2026-10-17)

Three post-ending add-ons to Hazel’s Grove, written as side stories on the existing runner
(`src/content/expansion-e{1,2,3}.ts`, rules in `sim/side-rules-expansions.ts`), opening on
post-game mornings. Their checks use the storyline grammar, so the sim meets them on its
own and the journal’s Do-it only appears for E1’s first walk.

Works:
- E1 (7 steps): Hazel’s second page, Old Pell on the square; steps 2–7 follow prosperity
  (first recruit, stall 20, gym 40, bathhouse 60, fortune 80, festival 100). On the
  `hazels-grove` ending with Corvin reconciled, step 5’s done scene is
  `e1-attendant-corvin`: Corvin comes back as an NPC and a recruit of species `keeper`.
  Title: Square Warden.
- E2 (5 steps): Nova’s egg from a short line. The rule spawns Dandy with
  `spanScale` 2.2 so the whole life is twelve days of the lifespan clock; visits gate on
  day 4, 8 and 11 (`dayCount`); the day-4 scene swaps for two or more care slips, the
  day-8 scene for a moody evolution; the complete scene is the rebirth or the departure
  one by what happened. Title: Twelve Days.
- E3 (5 steps): feed a Hollow stray, name two partners, buy twine, merge, then the
  bracket: three dojo wins after it goes up (`EXPANSIONS.tournamentWins`), with a merged
  variant of the done scene. Title: Twine Champion.
- Engine: `StoryRule.sceneDone` hook; command events now reach the campaign counters
  (`noteCampaignEvents` in `applyCommand`), so karate wins, merges and conversions count
  for storyline goals too; grammar gains `twine:` and `partners:set`.
- Tests: `tests/sim/expansions.test.ts` (script sanity, E1 to the festival with Corvin,
  E2 both outcomes at day eleven, E3 through the merged bracket).

Stubbed: E3’s “ten Keepers” are narrated as rounds; the dojo fights its usual rivals. E1–E3
are not yet in `content/index.ts` or `tests/tools/content-check.ts` (both files are mid-edit
by the Learning Grove session); the expansions test covers the same checks for them.
No render work: the square, Nova and the bracket use the existing scenes, NPCs and dojo.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

