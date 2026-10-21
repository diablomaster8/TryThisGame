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
