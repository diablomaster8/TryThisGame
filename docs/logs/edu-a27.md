# Learning Grove: Atlas A27 "The White-Haired Prince" (2026-10-17)

Files: `src/content/edu-a27-sprout.ts` (`EDU_A27_SPROUT`, `EDU_A27_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a27-reader.ts` (`EDU_A27_READER`, `EDU_A27_READER_VARIANTS`, `CHECKS`, empty). They
are not registered yet: the wiring task adds them to `edu.ts` and `a27` to `eduPacks`, under
different names for the two `CHECKS` arrays.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (111 quest + 12 variants) | 123 | 123 |
| Lessons | 123 | 124 |
| maths | 26 | 27 |
| sel | 29 | 29 |
| literacy | 25 | 25 |
| science | 21 | 21 |
| social-studies | 15 | 15 |
| art | 4 | 4 |
| health | 2 | 2 |
| music | 1 | 1 |
| Kinds (ask / notice / do) | 98 / 6 / 19 | 124 / 0 / 0 |
| Think questions (no `best`) | 11 | 23 |
| Glossary entries | n/a | 35 |

All 17 quests are covered, and every step, done, complete and variant scene has a version in
each band (the only scene with two lessons is the reader's `a27-01-page`). Every lesson has an
approved standard, lesson ids are unique, and the 19 sprout `edu:` checks are all in `CHECKS`.
Line caps hold (sprout <= 14 words, reader <= 30, all <= 160 characters, narration <= 2
sentences). Each quest uses at least three domains and has a `sel` lesson, and each reader quest
has a think question. No two lessons of the same domain are back to back, across scenes, quests
and the told, sat and night paths. Each feather variant has the same domain as the scene it
replaces; the margin note and the Corvin line (feelings) differ from their neighbours; the two
Sable closes are both feelings lessons, after `a27-17-complete` (literacy). Both files pass the
brief's tsc and eslint commands and Prettier, with LF line endings.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.CC.C.6, K.OA.A.2, K.MD.A.2, K.G.A.1, K.G.A.2,
  1.G.A.3, RF.K.2, RL.1.4, RL.K.3, SL.K.1, 1-ESS1-1, 1-LS1-2, 1-PS4-1, 2-LS2-1, 4-LS1-1, K-ESS2-1,
  K-2-ETS1-1, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Approaches to Learning,
  Language and Communication, Literacy, Mathematics Development, Perceptual/Motor/Physical,
  Scientific Reasoning), CASEL (all five).
- **Reader:** 2.OA.A.1, 2.MD.A.1, 3.OA.A.3, 3.OA.D.8, 3.MD.A.1, 3.MD.D.8, 4.MD.A.1, 4.MD.A.2,
  4.OA.C.5, 4.G.A.3, L.3.4, L.4.5, RL.1.4, RL.3.3, RL.4.2, RL.4.3, 1-ESS1-1, 1-ESS1-2, 1-LS1-2,
  2-LS2-2, 2-PS1-4, 3-5-ETS1-2, 3-ESS2-1, 3-LS1-1, 3-LS3-1, 3-LS4-3, 3-PS2-1, 4-ESS2-2, 4-LS1-1,
  4-LS1-2, 4-PS3-2, 5-ESS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all
  five).

Nearest-code choices (no exact match in the approved list): the Simurgh painting lesson uses
RL.4.3 (reader) and ELOF: Approaches to Learning (sprout); how to write a hard letter uses
RL.3.3; rain over mountains uses 3-ESS2-1; babies copying sounds uses 3-LS1-1; hair greying uses
3-LS1-1.

## Scenes I could not map

None.

## What it teaches (from the outline)

- **Where Iran is, and the Shahnameh:** Iran as a country (sprout); Persian as Farsi, Dari and
  Tajik across Iran, Afghanistan and Tajikistan; shah (king) plus nameh (book); Ferdowsi's thirty
  years and the date 1010 (reader).
- **The Simurgh in Persian painting:** colour and tail (a27-03-nest, both bands).
- **Albinism:** said plainly and kindly in `a27-01-birth`: inherited, not catchable, never a curse,
  sun care and eyesight named, "just like everyone else". Kept apart from hair greying with age
  (`a27-06-return`) so the two are not confused.
- **Writing a letter to say something hard:** `a27-14-letter` and its sat and night variants.

## For Maor

- **Quotes:** every Zimmern line is reworded in both bands. Sam's oath, the Simurgh's feather
  speech, Zal's "no" on the roof, the nest's "heart stirred" line and Zal's tears are all new
  wording (the first pass was too close to Zimmern's text). Hazel's margin note is kept exactly,
  as it is the game's own text from S24.
- **Softening for sprout:** Zal's arrow lands among the roses (no bird is hurt); Mehrab's threat
  and the burn-Kabul order are cut; Rudaba's hair is held gently and the night is only talking;
  Sam's wrong act is named wrong, and the narrator says help is coming.
- **Facts to double-check before ship:** the old Persian year of 12 x 30 days plus 5; "pomegranates
  grown in Iran for thousands of years"; the sofreh wedding spread and Yalda as modern customs
  attached to a thousand-year-old story; the 25 figs, the 2 m footprint and the 24 m wingspan are
  story numbers for maths, not facts, and the lessons say so ("in this story").
- **Reviewers named in the care notes** (Iranian adviser, Afghan adviser, albinism organisation)
  should read these two files as well as the main script, especially `a27-01-birth`.
