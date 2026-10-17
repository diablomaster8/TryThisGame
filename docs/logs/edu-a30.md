# Learning Grove: Atlas A30 "The Word on the Brow" (2026-10-17)

Files: `src/content/edu-a30-sprout.ts` (`EDU_A30_SPROUT`, `EDU_A30_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a30-reader.ts` (`EDU_A30_READER`, `EDU_A30_READER_VARIANTS`, `CHECKS`). Not registered
yet: the wiring task adds them to `edu.ts` and `a30` to `eduPacks`. Both export `CHECKS`, so register
them under different names. Ori leads (he reads the atlas over the child's shoulder).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (54 quest + 20 variants) | 74 | 74 |
| Lessons | 74 | 75 |
| literacy | 18 | 18 |
| sel | 22 | 23 |
| science | 11 | 11 |
| social-studies | 10 | 10 |
| maths | 10 | 10 |
| health | 3 | 3 |
| Think questions (no `best`) | n/a | 13 (one per quest) |
| Glossary entries | n/a | 10 |

Every scene has a lesson, every lesson has an approved standard, ids are unique, and line caps hold
(sprout <= 14 words, reader <= 30, all <= 160 characters, narration <= 2 sentences). Every quest has
at least three domains and a `sel` lesson. A script walked all 24 variant paths (3 orders x cinder x
keptStone x Moss quiet) and found no two lessons of the same domain in a row, across scenes, quests
and variants. Both files pass the brief's tsc and eslint commands and Prettier, with LF endings.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.G.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.K.3, RL.2.3, RL.2.4, L.2.4,
  1-ESS1-1, 1-LS1-2, 1-PS4-2, 2-PS1-1, 2-PS1-4, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF
  (Language and Communication, Literacy, Perceptual/Motor/Physical, Scientific Reasoning, Social and
  Emotional), CASEL (all five).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.MD.C.7, 3.MD.D.8, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 1-LS1-2, 1-PS4-2,
  2-PS1-1, 2-PS1-4, 3-5-ETS1-2, 3-LS4-1, 4-LS1-1, 4-PS3-2, 5-ESS1-2, L.3.4, L.4.5, RL.2.3, RL.2.4,
  RL.3.3, RL.4.2, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five).
  Nearest-code picks: the Hebrew letters use ELOF: Literacy (sprout) and L.3.4 (reader); health
  lessons use ELOF Perceptual/Motor (sprout), CASEL: Self-management and 4-LS1-1 (reader).

## What it teaches (the outline's list)

Alef, mem and tav, read right to left (sprout: point to them; reader: order them); the word emet
(truth), and in the reader band the word met (alef taken away; "plane" to "lane" as the English
parallel); alef first, mem near the middle (13th of 22; 22 - 13 = 9 follow), tav last; Prague and the
Vltava on a map (wavy blue line, why towns grow by rivers), Chelm east of Prague (compass direction);
the Sabbath as a day of rest (Friday sunset to Saturday after dark; 25 hours in a worked example),
candles, bread, three stars. Around them: counting, take-away, area, perimeter, equal groups, time;
clay, light, heat and energy, drying, stars and daylight, fossil prints, the heart; similes,
metaphors, theme, vocabulary; oral tradition; fairness; feelings.

## Care notes kept

- The Divine Name is never written or hinted at; the rabbi says tellings differ (reader keeps his
  "holy name on a slip of paper, we leave that where it belongs"; sprout leaves it out).
- The rumour is "a story about us that is not true" and some talk beyond the gate. Never named or shown.
- The clay man is not alive like a person: sprout says "lies down to rest", "only clay", never
  "sleeping" or "dead" (the outline's "goes to sleep" is avoided, per EDU-STYLE). Reader says met
  means "dead" once, plainly, with the comfort "the clay is only clay". The rabbi's "I tell myself he
  sleeps" became "I only know that he is clay again". Nobody is hurt, said plainly.
- No lines from the 1904 encyclopedia or the psalms: the childLines of the original are the guide.
  Psalm 92 is named in the reader band and called "the Sabbath song" in sprout; no words printed.
- Rabbi Loew is a real teacher and the golem a legend (Ori says so on the first page).

## Unmapped originals

None. All 54 quest scenes and all 20 variants have a version in each band.

## For Maor

- **Vetted list.** Both Hebrew words, אֱמֶת (emet, "EH-met") and מֵת (met), need adding to the vetted
  list and recording by a native speaker. The sprout band teaches only emet.
- **Ori's line.** The outline wants "You know alef. The quiet one goes first." only if LH2 is done. The
  scene text cannot branch, so both bands say "Alef. The quiet one goes first." in a30-06-letters. The
  wiring task can swap in the LH2 variant if it wants the exact line.
- **"Middle" letter.** Mem is the 13th of 22, so "the middle" is loose; the reader band says "near the
  middle" in its maths and the traditional phrase in the rabbi's mouth. Advisers to confirm.
- **Adviser read.** The Hebrew, the Sabbath details (candles lit, blessings, three stars, the 25-hour
  worked example uses invented clock times) and the genizah wording should go to the Jewish advisers.
- **Hazel's margin note** is kept as the game's own text in both bands (shortened in sprout).
