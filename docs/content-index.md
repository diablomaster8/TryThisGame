# Recommendations backlog (2026-10-13, for review)

The one-line index of every item in the story and recommendations backlog. The full text is in
`docs/grove-backlog-prompt.md` (about 9,200 lines: grep it, never read it whole). The scripts
are in `src/content/` (readable screenplays in `script-book/`), and the canon is
`docs/canon.md` → `src/content/STORY-BIBLE.md`. Linked from the Status block of PROGRESS.md.

## Design rule (Part A, Maor 2026-10-13)

No repetitive daily quests: no daily or weekly quests, rotating tasks or grind loops. Items that
refresh daily and free daily gifts are fine (Maor, 2026-10-21). Side stories
are written once and make sense inside the campaign; about 20–35% of them change it (now 8 of
31: S2, S9, S10, S13, S19, S23, S26, S27), and the rest reward items and cosmetics. Optional
fun quests are one-time and never set campaign flags. Fun quests may quote the original films
and shows, except in the Learning Grove. No song lyrics. Art suggestions only for cosmetic
rewards. Decided 2026-10-21: the visitor gift (`sim/daily.ts`, `sim/neighbourhood.ts`),
Saturday lantern night, Today's Hollow and the season festivals are allowed (daily refreshes
and free gifts); the Requests board and team missions are one-time.

## Engine backlog (CV)

- **CV1** Swap in the campaign v2 and its sim changes (Part I; also fixes B1).
- **CV2** Wire in the Learning Grove language switch (Part J), after CV1.
- **CV3** Wire in the Hebrew and Japanese questlines (Part K), after CV2.
- **CV4** The Atlas (Part L): gate, own save slot, reads Grove state only.
- **CV5** Part M's forty storylines: Grove side stories S23–S31, Atlas A11–A31, Pixel's Arcade.
- **CV6** The engine backlog from the fix pass (grep "Engine backlog from the fix pass"), done with CV1.

## Part B. Bugs found in play

- **B1** The understudy swaps the speaker but not the Keeper names in the text.
- **B2** The debug panel ships in production.
- **B3** Panels stack and overlap (Journal over stats sheet, toasts over HUD, Expedition counter under ✕).

## Part C. Open world and RPG (OW1–OW25)

OW1 A guided start · OW2 A goal on screen · OW3 Labelled controls · OW4 Actions beside the
creature · OW5 A Keeper choice that means something · OW6 Dialogue controls · OW7 Several
regions, not one garden · OW8 Hand-placed discoveries · OW9 A real map and a minimap · OW10
Gentle guidance · OW11 Borrowed moves for getting around · OW12 Evolution hints · OW13
Companion reactions · OW14 A small party in the world · OW15 Items that change play · OW16
Systems that interact · OW17 Side stories woven into the campaign · OW18 NPC lives that move
with the story · OW19 Choices that change the world · OW20 A deeper Expedition · OW21 The
Keepers as champions · OW22 A post-campaign epilogue and completion tracker · OW23 Release
hygiene · OW24 Accessibility · OW25 An expandable sandbox built section by section

## Part D. Features (F1–F10)

F1 Every goal has more than one answer · F2 A finite calendar of evenings · F3 Beliefs you
take on · F4 The Long Night as a loyalty finale · F5 Clues you learn instead of keys you carry ·
F6 Lore lines on everything · F7 The game remembers across campaigns · F8 Last wishes before
a farewell · F9 A Keeper's journal and a world that talks back · F10 Playable memories, found
out of order

## Part E. Side stories (S1–S22; S23–S31 under Part M)

S1 The Wardens' Walk · **S2 Wisp** · S3 The Cycle · S4 The Wellspring · S5 Fossil's Last Walk ·
S6 Ash's True Name · S7 Unverified · S8 The Warren in the Hollow · **S9 The Gate That Sticks** ·
**S10 Fourteen Months** · S11 The Blight · S12 The Hum · **S13 The Mill Cellar** · S14 Tilly's
Tabletop · S15 Lucky Eggs · S16 The Workyard · S17 Nightjar · S18 The Grove Museum · **S19
Cinder's Last Light** · S20 Fort Night · S21 CL-4NK · S22 The Climb (bold: changes the campaign)

## Fun quests (Q1–Q65)

- **Monty Python (Q1–Q20):** Two Shrubberies · None Shall Cross · The Bridge of Three
  Questions · Clip-Clop · The Rabbit at the Ledge · The Wooden Rabbit · It's Only a Model ·
  What Has the Aqueduct Done for Us? · The Gourd and the Shoe · Haggle · Wafer-Thin · Just
  Resting · Ministry of Silly Walks · The Comfy Chair · The Fruitless Fruit Stall · The
  Argument Booth · The Fish-Slapping Dance · Self-Defence Against Fresh Fruit · Upper-Class
  Twit of the Year · And Now, the Larch
- **Mr. Bean (Q21–Q30):** Bear Comes Too · The Armchair Drive · Pumpkin Head · The Exam · The
  High Dive · The Park Bench Sandwich · The Ruined Portrait · Do-It-Yourself · Mind the Egg ·
  The Three-Wheeler
- **It's Always Sunny (Q31–Q45, `adult`, Q31 carries the gate):** Kitten Mittens · Charlie Work ·
  Fight Milk · Green Man · Chardee MacDennis · Rum Ham · The Night Keeper Cometh · Bird Law ·
  Project Badass · The Gang Goes to the Water Park · The Gang Wrestles for the Troops · Pepe
  Silvia · Lethal Weapon 5 · Milk Steak · The Gang Goes Bowling
- **Avatar (Q46–Q65, Part H):** My Cabbages! · The Secret Tunnel · The Great Divide · Flameo,
  Hotman · The Jasmine Dragon · Cactus Juice · Puffin's Lost Days · The Fan Warriors · The
  Sword Master · The Ember Bay Players · Earth Rumble · The Painted Lady · The Fortuneteller ·
  The Waterbending Scroll · The Winged Lemur · Avatar Day · Penguin Sledding · King Rumbold's
  Challenges · Hello, Kaito Here · The White Lotus

## Part F. Multiverse campaign (93 storylines, 6 endgames, `adult`)

Lines: Iron Man IM1–IM15 (15) · Captain America CA1–CA10 (10) · Doctor Doom and the Fantastic
Four FF1–FF10 (10) · Ultron UL1–UL10 (10) · Moon Knight MK1–MK8 (8) · Spawn SP1–SP8 (8) ·
Dragon Ball DB1–DB20 (20) · Toy Story TS1–TS12 (12).
Endgames: E1 Civil War · E2 Secret Wars · E3 Armageddon · E4 The 23rd Budokai · E5 So Long,
Partner · E6 The Last Ultron (final). Full text: grep "Part F." in the backlog prompt.

## Part G. Neopia (retro Neopets)

- **Neopia line:** NP1 The Hunt for the Battledome · NP2 The Tyrannian Invasion · NP3 The Ski
  Lodge Mystery · NP4 The Usurper · NP5 Champions of Meridell · NP6 The Volcano Mystery · NP7
  The Battle for Meridell · NP8 The Curse of Maraqua · NP9 The Lost Desert Plot · NP10 The Tale
  of Woe · NP11 Journey to the Lost Isle · NP12 Altador · NP13 The Return of Dr. Sloth
- **Lands:** the classic lands as OW25 sandbox sections.
- **Species:** the Neo family in `sim/species.ts` format.
- **Paint brushes:** colour changes mapped to `variantColors`.
- **Items:** food, toys, books and codestones, adapted.
- **Freebies and dailies:** adapted to one-time rewards (several conflict with Part A; for Maor).
- **Games Room:** the classic minigames, adapted.
- **Quests:** the faerie quests, characters and events.

## Parts I–K. Campaign v2 and the Learning Grove

- **Part I:** the story bible and campaign v2 (12 chapters, 8 endings): `src/content/STORY-BIBLE.md`, `campaign*.ts`.
- **Part J:** the Learning Grove language switch, sprout and reader bands: `src/content/edu*.ts`, `EDU-STYLE.md`.
- **Part K, Hebrew (LH1–LH6):** Shalom, Ori! · Right to Left · Counting Plums · Colours of the
  Orchard · Savta's Letters · The New Year of the Trees
- **Part K, Japanese (LJ1–LJ6):** Konnichiwa, Hana! · The Hiragana Pond · Counting Koi ·
  Colours and Lunchboxes · Obāchan's Letters · Floating Lanterns

## Part L. The Atlas (A1–A10, quest counts; outline in `docs/atlas.md`)

A1 The Brothers' Bargain (17) · A2 The Monkey and the Monk (15) · A3 Forty-Nine Days (11) · A4
The Waterfall Prince (16) · A5 The Lion of Mali (14) · A6 Seven Voyages (16) · A7 The Marigold
Bridge (12) · A8 The Twelve Tasks (14) · A9 The Comet (11) · A10 The Heart of the Island (14)

## Part M. Forty more storylines, ranked (`docs/more-stories.md`)

1 S23 Three Visitors · 2 A11 The Enchanted Place · 3 A12 The Mirror Shard · 4 S24 The Adventure
Book · 5 S25 Real · 6 S26 The Walled Garden · 7 A13 The Wooden Boy · 8 A14 Homecoming · 9 A15 The
Humbug · 10 A16 The Fox and the Rose · 11 A17 The Camphor Tree · 12 S27 Some Nubbin · 13 S28
Please Look After This Nubbin · 14 PA1 The Chao Altar · 15 S29 The Gates of Dawn · 16 A18 The
Doll in the Pocket · 17 PA2 The Clone Island · 18 A19 The Dragon Who Fell · 19 S30 What Sad Is
For · 20 A20 The Weeping · 21 Q66–Q75 Down the Rabbit-Hole · 22 Q76–Q85 The Hound of the Grove ·
23 A21 The Flower Field · 24 A22 The Candle · 25 LB1–LB12 Play · 26 A23 Remember Who You Are ·
27 A24 The Law of the Jungle · 28 A25 The Nothing · 29 A26 The Wall of Uruk · 30 A27 The
White-Haired Prince · 31 PA3 The Hollow Kingdom · 32 PA4 Mercy · 33 A28 The Box of Stories · 34
A29 The Honmoon · 35 PA5 The Hundred-Year Sleep · 36 S31 The Great Gourd · 37 A30 The Word on
the Brow · 38 Q86–Q95 The Hodja's Donkey · 39 LK1–LK10 Mouse-Deer · 40 A31 The Hero Twins

## Content pack status (2026-10-18, from `docs/logs/`)

Everything in the backlog is now scripted in `src/content/`. The whole canon was audited in
report mode on 2026-10-17 (`review-canon-audit.md`: canon holds, `problems: 0`); "Reviewed"
below means a fix-mode review of that storyline. "Edu" is the Learning Grove version in both
bands (sprout and reader) unless it says otherwise; "n/a" means the audience or the outline
rules one out.

| Storylines | Scripted | Edu | Reviewed |
| --- | --- | --- | --- |
| Campaign v2, S1–S22, Q1–Q65, Neopia, Multiverse, readers, LH, LJ | yes | campaign, S1–S22, Python, Bean, Avatar; LH and LJ are Learning Grove lines; n/a for Sunny, Neopia, Multiverse | earlier fix pass (`docs/fix-changelog.md`, no log here); canon audit |
| S23 Three Visitors | yes | n/a (`main`) | canon audit only |
| S24–S31 | yes | done | edu: `review-edu-s24-s31.md`; main scripts: canon audit only |
| A1, A3, A4 | yes | n/a (`teen`) | `review-wave-L.md` |
| A2, A5–A10 | yes | done | main: `review-wave-L.md`; edu: `review-edu-atlas-1.md` |
| A11–A13 | yes | done | edu: `review-edu-atlas-1.md`; main scripts: canon audit only |
| A14, A15, A17–A20 | yes | done | edu: `review-edu-atlas-2.md`; main scripts: canon audit only |
| A16 | yes | reader only | edu: `review-edu-atlas-2.md`; main script: canon audit only |
| A21 | yes | n/a (`main`) | canon audit only |
| A22–A24 | yes | done | main: `review-wave-M.md`; edu: `review-edu-atlas-2.md` |
| A25, A29 | yes | reader only (A25 Part One) | main: `review-wave-M.md`; edu: `review-edu-atlas-3.md` |
| A26–A28, A30, A31 | yes | done | main: `review-wave-M.md`; edu: `review-edu-atlas-3.md` |
| PA1 | yes | done (`edu-pa1-*.ts`, no edu log; its script log still says `main`, no edu) | canon audit only |
| PA2–PA5 | yes | n/a (licence, per the outline) | canon audit only |
| Q66–Q95 (`quests-alice.ts`, `quests-holmes.ts`, `quests-hodja.ts`) | yes, no script log | none logged | canon audit only |
| LB1–LB12 | yes | built in (`LINE_LB_EDU`) | canon audit only |
| LK1–LK10 | yes | Learning Grove only | canon audit only |

Left to review in fix mode: S23–S31 main scripts, A11–A21 main scripts, PA1–PA5, Q66–Q95, LB
and LK. `script-book/` (regenerated 2026-10-18) prints everything above except Q66–Q95.

## Suggested order

1. Fix the bugs: B1, B2, B3.
2. Foundations: OW23, OW1, OW2, OW4.
3. Story spine: CV1 with CV6; then S2, S9, S10, S13, S19; then the fun side stories with F1,
   F2, F3, F8 as needed; CV2 once CV1 is in; CV3 after CV2 (book native-speaker recordings early).
4. World: OW7, OW25, OW11, OW9 and F5, then OW8 and F6 for lore.
5. Fun quests Q1–Q65: any time, as light breaks between story work.
6. The Multiverse after the Hazel's Grove story work: gate and save slot first, then one line
   end to end (Iron Man suggested).
7. Neopia alongside OW25: the Neo family and paint brushes, then the lands, then the line.
8. CV5's side stories S23–S31 once CV1 is in; then CV4, the Atlas and Pixel's Arcade, after the
   Multiverse gate and save slot exist. Book cultural advisers early; build one line end to end
   (A8 or A9 suggested) first.
9. When a quest or story is built, wire its script from `src/content/` rather than writing new
   dialogue. Readers replace `FORTUNE_LINES` and the doctor's raw numbers.
10. Everything else after Maor reviews.

## Quests per region (R0071)

Generated by `npx tsx tests/tools/where-report.ts`; the table is `src/content/where-map.ts`.

```
grove: 91
  Q1 Q2 Q5 Q7 Q8 Q9 Q10 Q11 Q12 Q13 Q14 Q15 Q16 Q17 Q19 Q20 Q22 Q23 Q24 Q25 Q26 Q27 Q34 Q36 Q40 Q41 Q46 Q47 Q48 Q49 Q50 Q51 Q52 Q53 Q54 Q56 Q62 Q65 S2 S9 S10 S1 S3 S4 S5 S7 S11 S16 S12 S17 S13 S19 S14 S21 E6 S24 S25 S26 S28 S29 S30 S31 Q68 Q70 Q72 Q79 Q80 Q81 Q82 Q85 Q86 Q87 Q88 Q89 Q90 Q92 Q94 Q95 LB10 LK1 LK2 LK3 LK4 LK5 LK6 LK7 LK8 LK9 LK10 E1 E2
lane: 29
  Q6 Q21 Q28 Q29 S15 S18 S20 S23 S27 Q66 Q67 Q76 Q77 Q78 Q83 Q84 Q91 Q93 LB1 LB2 LB3 LB4 LB5 LB6 LB7 LB8 LB9 LB11 LB12
village: 13
  Q31 Q32 Q33 Q35 Q37 Q38 Q39 Q42 Q44 Q45 Q58 Q59 Q61
shore: 3
  Q55 Q57 S6
wood: 6
  Q18 Q43 Q69 Q73 Q74 Q75
ridge: 3
  Q3 Q30 Q63
peaks: 1
  S22
ruins: 1
  Q64
hollow: 2
  S8 E3
story-world: 751
  NP1 NP2 NP3 NP4 NP5 NP6 NP7 NP8 NP9 NP10 NP11 NP12 NP13 NQ1 NQ2 NQ3 NQ4 NQ5 NQ6 NQ7 NQ8 NQ9 NQ10 NQ11 NQ12 NQ13 NQ14 NQ15 NQ16 NQ17 NQ18 NQ19 NQ20 NQ21 NQ22 NQ23 NQ24 NQ25 NQ26 NQ27 NQ28 NQ29 NQ30 NQ31 NQ32 IM1 IM2 IM3 IM4 IM5 IM6 IM7 IM8 IM9 IM10 IM11 IM12 IM13 IM14 IM15 CA1 CA2 CA3 CA4 CA5 CA6 CA7 CA8 CA9 CA10 FF1 FF2 FF3 FF4 FF5 FF6 FF7 FF8 FF9 FF10 FF-EP UL1 UL2 UL3 UL4 UL5 UL6 UL7 UL8 UL9 UL10 MK1 MK2 MK3 MK4 MK5 MK6 MK7 MK8 SP1 SP2 SP3 SP4 SP5 SP6 SP7 SP8 DB1 DB2 DB3 DB4 DB5 DB6 DB7 DB8 DB9 DB10 DB11 DB12 DB13 DB14 DB15 DB16 DB17 DB18 DB19 DB20 TS1 TS2 TS3 TS4 TS5 TS6 TS7 TS8 TS9 TS10 TS11 TS12 E1 E2 E3 E4 E5 A1-1 A1-2 A1-3 A1-4 A1-5 A1-6 A1-7 A1-8 A1-9 A1-10 A1-11 A1-12 A1-13 A1-14 A1-15 A1-16 A1-17 A1-18 A1-19 A1-20 A2-1 A2-2 A2-3 A2-4 A2-5 A2-6 A2-7 A2-8 A2-9 A2-10 A2-11 A2-12 A2-13 A2-14 A2-15 A2-16 A2-17 A2-18 A2-19 A3-1 A3-2 A3-3 A3-4 A3-5 A3-6 A3-7 A3-8 A3-9 A3-10 A3-11 A3-12 A3-13 A3-14 A4-1 A4-2 A4-3 A4-4 A4-5 A4-6 A4-7 A4-8 A4-9 A4-10 A4-11 A4-12 A4-13 A4-14 A4-15 A4-16 A5-1 A5-2 A5-3 A5-4 A5-5 A5-6 A5-7 A5-8 A5-9 A5-10 A5-11 A5-12 A5-13 A5-14 A6-1 A6-2 A6-3 A6-4 A6-5 A6-6 A6-7 A6-8 A6-9 A6-10 A6-11 A6-12 A6-13 A6-14 A6-15 A6-16 A7-1 A7-2 A7-3 A7-4 A7-5 A7-6 A7-7 A7-8 A7-9 A7-10 A7-11 A7-12 A8-1 A8-2 A8-3 A8-4 A8-5 A8-6 A8-7 A8-8 A8-9 A8-10 A8-11 A8-12 A8-13 A8-14 A9-1 A9-2 A9-3 A9-4 A9-5 A9-6 A9-7 A9-8 A9-9 A9-10 A9-11 A9-12 A10-1 A10-2 A10-3 A10-4 A10-5 A10-6 A10-7 A10-8 A10-9 A10-10 A10-11 A10-12 A10-13 A10-14 A11-1 A11-2 A11-3 A11-4 A11-5 A11-6 A11-7 A11-8 A11-9 A11-10 A11-11 A11-12 A11-13 A11-14 A11-15 A11-16 A11-17 A11-18 A11-19 A11-20 A12-1 A12-2 A12-3 A12-4 A12-5 A12-6 A12-7 A12-8 A12-9 A12-10 A12-11 A12-12 A12-13 A12-14 A12-15 A12-16 A12-17 A12-18 A13-1 A13-2 A13-3 A13-4 A13-5 A13-6 A13-7 A13-8 A13-9 A13-10 A13-11 A13-12 A13-13 A13-14 A13-15 A13-16 A13-17 A13-18 A13-19 A13-20 A14-1 A14-2 A14-3 A14-4 A14-5 A14-6 A14-7 A14-8 A14-9 A14-10 A14-11 A14-12 A14-13 A14-14 A14-15 A14-16 A14-17 A14-18 A14-19 A14-20 A15-1 A15-2 A15-3 A15-4 A15-5 A15-6 A15-7 A15-8 A15-9 A15-10 A15-11 A15-12 A15-13 A15-14 A15-15 A15-16 A15-17 A15-18 A15-19 A15-20 A16-1 A16-2 A16-3 A16-4 A16-5 A16-6 A16-7 A16-8 A16-9 A16-10 A16-11 A16-12 A16-13 A16-14 A16-15 A16-16 A16-17 A17-1 A17-2 A17-3 A17-4 A17-5 A17-6 A17-7 A17-8 A17-9 A17-10 A17-11 A17-12 A17-13 A17-14 A17-15 A17-16 A18-1 A18-2 A18-3 A18-4 A18-5 A18-6 A18-7 A18-8 A18-9 A18-10 A18-11 A18-12 A18-13 A18-14 A18-15 A18-16 A19-1 A19-2 A19-3 A19-4 A19-5 A19-6 A19-7 A19-8 A19-9 A19-10 A19-11 A19-12 A19-13 A19-14 A19-15 A19-16 A19-17 A19-18 A20-1 A20-2 A20-3 A20-4 A20-5 A20-6 A20-7 A20-8 A20-9 A20-10 A20-11 A20-12 A20-13 A20-14 A20-15 A20-16 A20-17 A21-1 A21-2 A21-3 A21-4 A21-5 A21-6 A21-7 A21-8 A21-9 A21-10 A21-11 A21-12 A21-13 A21-14 A21-15 A21-16 A21-17 A21-18 A21-19 A21-20 A22-1 A22-2 A22-3 A22-4 A22-5 A22-6 A22-7 A22-8 A22-9 A22-10 A22-11 A22-12 A22-13 A22-14 A22-15 A22-16 A23-1 A23-2 A23-3 A23-4 A23-5 A23-6 A23-7 A23-8 A23-9 A23-10 A23-11 A23-12 A23-13 A23-14 A23-15 A23-16 A24-1 A24-2 A24-3 A24-4 A24-5 A24-6 A24-7 A24-8 A24-9 A24-10 A24-11 A24-12 A24-13 A24-14 A24-15 A24-16 A24-17 A24-18 A25-1 A25-2 A25-3 A25-4 A25-5 A25-6 A25-7 A25-8 A25-9 A25-10 A25-11 A25-12 A25-13 A25-14 A25-15 A25-16 A25-17 A25-18 A25-19 A25-20 A26-1 A26-2 A26-3 A26-4 A26-5 A26-6 A26-7 A26-8 A26-9 A26-10 A26-11 A26-12 A26-13 A26-14 A26-15 A26-16 A26-17 A26-18 A27-1 A27-2 A27-3 A27-4 A27-5 A27-6 A27-7 A27-8 A27-9 A27-10 A27-11 A27-12 A27-13 A27-14 A27-15 A27-16 A27-17 A28-1 A28-2 A28-3 A28-4 A28-5 A28-6 A28-7 A28-8 A28-9 A28-10 A28-11 A28-12 A29-1 A29-2 A29-3 A29-4 A29-5 A29-6 A29-7 A29-8 A29-9 A29-10 A29-11 A29-12 A29-13 A29-14 A29-15 A29-16 A30-1 A30-2 A30-3 A30-4 A30-5 A30-6 A30-7 A30-8 A30-9 A30-10 A30-11 A30-12 A30-13 A31-1 A31-2 A31-3 A31-4 A31-5 A31-6 A31-7 A31-8 A31-9 A31-10 A31-11 A31-12 A31-13 A31-14 A31-15 A31-16 A31-17 PA1-1 PA1-2 PA1-3 PA1-4 PA1-5 PA1-6 PA1-7 PA1-8 PA1-9 PA1-10 PA1-11 PA1-12 PA1-13 PA1-14 PA1-15 PA1-16 PA1-17 PA1-18 PA2-1 PA2-2 PA2-3 PA2-4 PA2-5 PA2-6 PA2-7 PA2-8 PA2-9 PA2-10 PA2-11 PA2-12 PA2-13 PA2-14 PA2-15 PA2-16 PA2-17 PA2-18 PA3-1 PA3-2 PA3-3 PA3-4 PA3-5 PA3-6 PA3-7 PA3-8 PA3-9 PA3-10 PA3-11 PA3-12 PA3-13 PA3-14 PA3-15 PA3-16 PA3-17 PA3-18 PA4-1 PA4-2 PA4-3 PA4-4 PA4-5 PA4-6 PA4-7 PA4-8 PA4-9 PA4-10 PA4-11 PA4-12 PA4-13 PA4-14 PA4-15 PA4-16 PA4-17 PA4-18 PA4-19 PA5-1 PA5-2 PA5-3 PA5-4 PA5-5 PA5-6 PA5-7 PA5-8 PA5-9 PA5-10 PA5-11 PA5-12 PA5-13 PA5-14 PA5-15 PA5-16 PA5-17 PA5-18
anywhere: 15
  Q4 Q60 LH1 LH2 LH3 LH4 LH5 LH6 LJ1 LJ2 LJ3 LJ4 LJ5 LJ6 Q71
```
