# Learning Grove: Atlas A24 "The Law of the Jungle" (2026-10-17)

Files: `src/content/edu-a24-sprout.ts` (`EDU_A24_SPROUT`, `EDU_A24_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a24-reader.ts` (`EDU_A24_READER`, `EDU_A24_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a24` to `eduPacks`. Both files
export a `CHECKS` array (the reader's is empty), as the a13 files do, so register them under
different names.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (116 quest + 14 variants) | 130 | 130 |
| Lessons | 130 | 132 |
| science | 34 | 36 |
| sel | 27 | 27 |
| literacy | 24 | 24 |
| maths | 21 | 21 |
| social-studies | 19 | 19 |
| health | 5 | 5 |
| Kinds (ask / notice / do) | 112 / 3 / 15 | 122 / 10 / 0 |
| Think questions (no `best`) | 0 | 19 |
| Glossary entries | n/a | 35 |

Every scene has a lesson, every lesson has an approved standard, lesson ids are unique, and the
15 sprout `edu:` checks are all in `CHECKS`. Line caps hold (sprout <= 14 words, reader <= 30, all
<= 160 characters, narration <= 2 sentences). Each quest uses at least three domains and has a
`sel` lesson; each reader quest has a think question (the 19th is the Hazel margin note). No two
lessons of the same domain are ever back to back, across scenes and across quests. Each variant
has the same domains as the scene it replaces, so the order also holds on both `a24-stones`
paths; the margin note (feelings) differs from `a24-17-complete` (science) and `a24-18-search`
(literacy). Both files pass the brief's tsc and eslint commands, and Prettier.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.OA.A.1, K.OA.A.2, 1.G.A.3, RF.K.2, RL.K.3, RL.1.4,
  RL.2.4, L.2.4, K-ESS2-1, K-ESS3-1, K-ESS3-3, K-LS1-1, 1-ESS1-1, 1-ESS1-2, 1-LS1-2, 1-LS3-1,
  1-PS4-1, 2-LS2-1, 2-LS2-2, 3-LS1-1, 3-LS3-1, 3-LS4-3, 4-LS1-1, 4-LS1-2, D2.Civ.8.K-2,
  D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Language and Communication, Literacy,
  Mathematics, Perceptual/Motor/Physical, Scientific Reasoning, Social and Emotional), CASEL
  (all five).
- **Reader:** 1.MD.B.3, 2.OA.A.1, 2.OA.C.3, 3.OA.A.1, 3.OA.A.3, 3.MD.A.1, 3.MD.B.3, 3.NF.A.1,
  4.MD.A.2, 4.OA.C.5, RL.1.4, RL.2.3, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.3.4, L.4.5, 1-ESS1-1,
  1-LS1-2, 1-PS4-1, 2-LS2-2, 3-ESS2-1, 3-LS1-1, 3-LS2-1, 3-LS3-1, 3-LS4-3, 3-LS4-4, 3-PS2-1,
  4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 5-ESS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2,
  D2.His.2.K-2, CASEL (all five).

## What it teaches (the outline's list)

Where Seoni is (central India, with the real Pench park nearby); the Hindi words behind the names
(reader); real animals of the books and how they are protected today: tigers (stripes, Project
Tiger 1973), sloth bears (Baloo), leopards (the black panther), rock pythons (shedding skin),
dholes (endangered), Indian elephants (herds, Project Elephant 1992), langurs and macaques
(troops), giant rock bees; the monsoon and a drought, the water cycle, dew; northern fur seals,
the Bering Sea and the Pribilof Islands (variation, migration, the 1911 treaty); and Steller's sea
cow (found 1741, hunted, gone by 1768), said plainly with the comfort after. Also fire (fuel,
heat, air, safety), moon phases, the Pole Star, rivers and currents, and sums with time, distance,
groups and fractions.

## Care notes kept

- Nova's card on Kipling and empire is kept in both bands (sprout: he loved India, believed some
  unfair things, and we can think for ourselves).
- The villagers are frightened, never stupid; in sprout the stones become a pebble that bumps
  along the road. The Bandar-log are monkeys only.
- The Unangax̂ are named as the people of the Pribilofs, are never villains, and the scene cuts
  away; the reader's last answer in A24-17 says Unangax̂ communities help look after the seals.
- No line from Kipling's text: the Master Words use the childLine "family" wording, and the other
  lifted passages use the childLines or are rewritten.
- Hard things: Akela's death is said plainly in both bands, with comfort straight after (the
  howl, remembering, a hug and a rest). Shere Khan's end is dust and quiet; the sprout version
  has Akela say plainly that he died. Messua's son Nathoo "died long ago" in sprout.

## Original scenes I could not map

None. All 116 quest scenes and 14 variants have a version in each band.

## For Maor

1. Both `CHECKS` exports share one name, as in a13; the wiring task needs aliases when it imports
   them.
2. Facts worth a second pair of eyes: Project Elephant (1992), the 1911 fur seal treaty, "Unangax̂
   communities help look after the seals", and the Hindi glosses (bhalu, akela, bandar, hathi,
   sher, khan).
3. The Unangax̂ adviser should still read A24-17 in both bands, as the main script requires.
4. Both bands keep the phrase "Good hunting" (the main script uses it as a set phrase); say if you
   want it replaced in the Learning Grove.
