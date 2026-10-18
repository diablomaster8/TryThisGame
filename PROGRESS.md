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
independent full review that runs last. Plan G12 is built and pushed (2026-10-17): the storyline engine, expansions E1–E3 and the four separate campaigns SL1–SL4, sections below and in the archive. Maor, 2026-10-17: legal cleared,
adviser sign-off given, the seven fun-quest quotes approved as written, Pixel stays the default
(Full 3D remains a setting); the Atlas quote and audience items in the two wave reports are fine;
the phone view passes; Expedition and races get 3D versions in Full 3D. Waiting on Maor: the
Arcade and LB/LK decisions (section "Pixel's Arcade PA1–PA5" in `docs/progress-archive.md`).
Backlogs: `docs/creature-improvements.md`, `docs/content-index.md`.

## Canon audit and fixes (2026-10-17)

Audit report `docs/logs/review-canon-audit.md` (report mode, whole canon; Maor's decisions in its
section 9). Fixed: the Multiverse (one signature choice per line paid off in 3+ later quests,
`MV_*_VARIANTS`; Nubbin lines in MK/SP narrated) and Neopia (`np-05-stance` pays off in NP9,
NP11, NP13; NQ flags read in their own completes; the faerie side/colours rewards split into
one key per chain, `neo-side-*` / `neo-colours-*`); PA1 is `all` with childLines and new
`edu-pa1-sprout.ts` / `edu-pa1-reader.ts`; S24's speaker is `augusta`; the separate campaigns
are SL1–SL4; the hive's S26 return is now canon (canon 17/31, bible, brief); Moss's Hush
memory is told new in S26 and S30; the minor tone and repetition fixes from section 4.
New variant arrays are exported from `src/content/index.ts` and covered by content-check.
- **Stubbed:** no sim catalogue plays the Multiverse or Neopia variants yet; when CV6 builds
  it, pick variant arrays per line (two files carry two each), and note `variantFor` matches
  bare flag values (three MV signature values were prefixed to avoid clashes).
- **Known bugs:** two tests fail and failed before this pass (checked at HEAD):
  `line-swaps` "c12-open splices the walled garden in every band" and `edu-story` "applies
  childLines to an all-audience quest scene without an edu version". About 16 lines in
  `storyline-*.ts` exceed 160 characters; content-check does not cover the storylines.

## G12 writing pass: beats for SL1–SL4 and the expansions (2026-10-17)

The separate campaigns were a session long each; the brief asked for 4–10 hours. This pass
adds `StorylineChapter.beats` between the openings and the goals (no goal check changed),
and deepens the expansions' scenes.

Works:
- S1 (30 beats): Ida and Sorrel on the story clock (`days:` from the chapter's start), the
  first visitor and feed, the care slips (`partner:slips`), fondness and trust, the cave's
  stairs, strays and chest (a new flagged choice, `h-drawing`, paid off on the hundredth
  day), the cocoon, the mire's rain, the stall and yard, the loft lamp at the mountain, the
  naming choice and a moody partner on the last day.
- S2 (19 beats): Warden's tips as the eggs hatch, Juno's meal-count talks (a new choice,
  `l-told`, paid off at the board), night bouts, the bout counts between ranks, a lost
  partner (`count:departed`, chapter 6 only), a second teen beat (`l-c6-wage`), and Juno's
  reaction to the chosen word.
- S3 (20 beats): the banners and ledger, the leader's errands (`count:missionDone`), the
  first stair, a torch choice (`b-torch`, paid off on the third floor), the two partners and
  Vane's own fusion, the second run, and chapter 8 reading the fusion and the lever.
- S4 (16 beats per half, from the template): the other twin when `dd-other-done`, the Book's
  visitor and settler, the egg that must not be hatched, the second page, Vask between
  belts, the grown one sitting by the egg, and the day after the cause.
- E1–E3: fuller visits and one real choice each (`e1-hazel`, `e2-asked`, `e3-pick`), voice
  only for now. E1–E3 and S1–S4 are now exported from `content/index.ts`, and the three
  expansion packs are in `tests/tools/content-check.ts` (problems: 0).
- Every `_CHECKS` list now includes the beat checks, so the grammar is covered.

Stubbed: no engine change. The `days:` beats use the two-minute story day, so at ×1 they
land minutes into a chapter, not hours. The expansions' new choices set flags nothing reads
yet. Nothing in S1–S4 is in the content checker (it checks `Quest` packs, not storylines);
the storyline tests and a line-length sweep stand in.

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

## Standing approval (Maor, 2026-10-12)

"When you finish, proceed straight through to the next development. I'm approving it. Keep
going until you hit the session limit." So after each milestone passes its done-when
checks, start the next one without waiting. Still plan each one briefly in the session
log before coding, still keep the per-milestone commits and checks.

