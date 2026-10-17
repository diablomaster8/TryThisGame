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
the Arcade and LB/LK decisions in the section below.
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

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

## G12 X0: the storyline engine for the separate campaigns (2026-10-17)

Maor picked everything on the Digimon-inspired list: expansions E1–E3 and campaigns
S1–S4 (plan Part G12). X0 is the engine they all run on; X1–X3 add the expansions,
X4–X7 the campaigns, one commit each.

Works:
- `content/types.ts` `Storyline`: chapters with an opening scene, a goal check string, a
  closing scene and optional beats (a scene that plays once when its check is met), plus
  endings and extra scenes. `sim/storyline.ts` runs them through the campaign state the
  dialogue box, journal and away screen already read (`CampaignState.storyline`), so a
  separate campaign needs no new UI for its scenes. Endings register as `<id>-<ending>`
  in ENDINGS so the end card finds `end-<id>-<ending>`.
- `sim/storyline-checks.ts`: the goal grammar (`recruits:>=3`, `prosperity:40`,
  `partner:adult`, `area:cave&act:light`, `days:>=1`, `count:converted:2`, `|` and `&`).
  Counters fold from events as `n:<kind>` flags; `act:<label>` is the journal's Do-it.
- `sim/storyline-rules.ts`: the per-campaign code hook (setup, onChapter, onScene,
  onEvent, onArea, holdsClose, variant, endingFor, actions). Commands `storylineStart`,
  `storyArea`, `storyAct`; events `storylineStarted`, `areaChanged`.
- Save version 5 (`campaign.storyline`), four new save modes with three slots each
  (`hundred`, `logged`, `beetle`, `dawndusk`) on the title screen; Dawn & Dusk asks for a
  side and locks Dusk until Dawn has an ending in any slot (`storylineFinished`). The
  journal shows either campaign through `journalView` (goal, Do-it, travel, actions,
  the storyline's own Paths). `Nubbin.spanScale` stretches an adult span (S1's partner).
- Tests: `tests/sim/storyline-engine.test.ts` drives a three-chapter test storyline end
  to end (counters, areas, beats, acts, days, a choice-driven ending, save round trip,
  the v4→v5 migration, the check grammar).

Stubbed: `sim/storyline-content.ts` is empty until X4–X7, so the four title modes start
without a script (the slot plays as a Free Grove). Render: no new scenery; areas map to
the locations, Grove recolours and weather both renderers already draw.

Known bugs: `tests/sim/edu-story.test.ts` and `line-swaps.test.ts` fail at HEAD before
this pass (the Learning Grove A-series session is mid-edit in `src/content/edu.ts`); the
gate for this commit ran in a clean worktree with only these files copied in.

## Pixel's Arcade PA1–PA5 and lines LB, LK scripted (2026-10-16)

Seven script agents, one file each: `src/content/arcade-pa1.ts` … `arcade-pa5.ts`,
`lines-lb.ts`, `lines-lk.ts` (LB and LK carry both Learning Grove bands in the same file).
All seven are registered in `index.ts`. tsc, eslint and content-check pass with
`problems: 0` (882 quests). Logs: `docs/logs/script-{pa1..pa5,lb,lk}.md`. Not committed.
`content-check.ts` has a new commented exemption for one quote clash it flagged by mistake.

Decisions waiting on Maor:
- LK8: "the King in the river" became a tiger, so no king who could be read as the
  Prophet Sulaiman is pictured. Confirm.
- LK: Malay and Indonesian advisers for words, counting audio, clothes, lamp, puppets
  and food; Siti and Wulan's evening idle lines are still to write with them.
- LB: Ned Larkin (4) shares a name with S31's valley boy Ned (9). Keep both or rename?
- LB: is "inspired by Bluey" the credit wanted?
- Quotes to verify: PA1 Tikal's prayer x2 (English script), PA2 Mewtwo's "circumstances
  of one's birth" (art book), PA3's three, PA4 Flowey's "kill or be killed" and Papyrus's
  laugh, PA5 "Open your eyes." and "I think I can accept that." (the game).
- PA4 credits: note that the neutral ending is not shown. (All licences approved (Maor, 2026-10-17).)
- Byte is "he" in PA2 (two pronoun warnings); confirm against canon.

SIM needs (details in the logs): PA1-17's other check when the gate was locked; PA2's
name box for the clone, its sprite and a lasting attract screen; PA3's breakable flower,
the save before the Abyss and how the ending is chosen; PA5's memory-site tracking and the
one-time thirteenth memory.

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

