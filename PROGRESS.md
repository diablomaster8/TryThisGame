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
independent full review that runs last. Plan G12 is built and pushed (2026-10-17): the storyline engine, expansions E1–E3 and the four separate campaigns S1–S4, sections below and in the archive. Waiting on Maor:
seven fun-quest quotes, Full 3D as default (brief: `docs/renderer-decision.md`), his phone
rows, the Atlas quote, adviser and audience items in the two wave reports, and
the Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## G12 X7: S4 "Dawn & Dusk" with the reverting (2026-10-17)

The fourth separate campaign, in the `dawndusk` save mode: two mirrored halves built from
one template (`src/content/storyline-dawndusk.ts`, 7 chapters and 3 endings each; the
Penhallow twins and Teodor Vask), rules for both in `sim/storyline-rules-dawndusk.ts`, and
the new `sim/degeneration.ts`.

Works:
- The title asks Dawn or Dusk; Dusk is locked until Dawn has an ending in any slot
  (`storylineFinished`), and a half started after the other finished is told so
  (`storylineStart.flags` → `dd-other-done`), which opens the Whole Day ending.
- Goals on the collection engine and the dojo: a full scan, a second scan plus one
  conversion (`count:converted`), the three rank tests as belts (`karate:belt`), and the
  cause choice, which differs by half (lamp or scanner by day; bell or mist by night).
- Degeneration: when chapter 3 opens the oldest grown Nubbin reverts to its own egg
  (name, stats, grades and rebirths kept; form and age stashed in `genes.degenerated`).
  Naming the real cause restores it if it is still that egg; the wrong cause lets it
  hatch small and grow again. Events `degenerated` and `restored` with HUD toasts.
- Endings per half: First Light / Last Light, a Fixed Shadow (wrong cause), the Whole Day.
- Tests: `tests/sim/storyline-dawndusk.test.ts` (degenerate and restore, both halves to
  their endings, the other-half flag).

Stubbed: the four houses are narrated; serving them is the scan count, not four named
species. The twins never appear on the map.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

