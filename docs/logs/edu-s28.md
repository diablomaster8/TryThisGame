# Learning Grove: S28 Please Look After This Nubbin (2026-10-16)

Files: `src/content/edu-s28-sprout.ts` (`EDU_S28_SPROUT`, `EDU_S28_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s28-reader.ts` (`EDU_S28_READER`, `EDU_S28_READER_VARIANTS`, `CHECKS`, which is
empty because the reader band has no `do` lessons). Not yet registered in `edu.ts` or `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes | 37 (27 in the quest, 10 variants) | 37 (27 + 10) |
| Lessons | 41 | 43 |
| maths | 11 | 7 |
| science | 10 | 9 |
| sel | 12 | 9 |
| literacy | 5 | 14 |
| social-studies | 3 | 4 |
| Glossary | none | 17 words |

The 37 scenes are the 13 step scenes, 13 done scenes, `s28-complete` and all 10 variants, including
the `s28-byte-barks` idle pool, so that coverage holds if the wiring adds the variants to the
check.

## Standards used

- **Sprout:** ELOF: Literacy, ELOF: Scientific Reasoning, ELOF: Mathematics Development, ELOF:
  Social and Emotional Development; RF.K.2, RL.K.3; K.CC.A.1, K.CC.B.4, K.CC.B.5, K.MD.A.2,
  K.MD.B.3; K-PS3-1, K-ESS2-1, K-LS1-1; D2.His.2.K-2, D2.Geo.2.K-2, D2.Eco.1.K-2; CASEL:
  Relationship skills, Social awareness, Responsible decision-making, Self-awareness.
- **Reader:** L.2.4, L.3.4, L.4.5, RL.2.3, RL.3.3, RL.3.6, RL.4.2; 2.MD.C.7, 2.OA.A.1, 3.OA.A.3,
  4.MD.A.2; 1-PS4-1, 2-PS1-1, 2-PS1-4, 3-LS1-1, 4-PS3-4; D2.Geo.2.K-2, D2.His.2.K-2,
  D2.Eco.1.K-2, D2.Civ.8.K-2; CASEL: Relationship skills, Social awareness, Self-management,
  Self-awareness, Responsible decision-making.

## Checks

- Every original scene id has a version in each band, and every step has a goal in each band.
- Lesson ids are unique, every `after` is in range, and every standard is on the approved list.
- Every line is within its cap (sprout 14 words, reader 30, all under 160 characters), and
  scene lengths are within 4–10 (sprout) and 6–16 (reader).
- Every choice keeps its original id and `set`. No band drops a choice, so there is no
  `defaultChoice`.
- `tsc` (the single-file command) and `eslint` are clean.

## Unmapped scenes

None.

## For Maor

- **No lifted text.** The tag reads "Please be kind to this small one" (sprout) or uses the
  quest's own `childLines` wording (reader). The back of the recipe card has new lines in both
  bands. The reader's line is "Mind your manners, mind your neighbours, and always save some for
  the next one."
- **The evacuees.** Moss's "label and a small case" line gets a warm note in both bands. In
  reader it names 1939 and the word "evacuee". In sprout it says only that the big towns "weren't
  safe for a while". Nothing in either band is sad for effect.
- **Story numbers (reader).** Byte's plan is 15 spoons a jar, so 6 × 15 = 90 days, and the
  last spoon goes on day 60 (90 − 60 = 30 days short). The original only says "six jars, one
  spoon a day, midwinter". These numbers aren't canon, so please check they don't clash with
  anything planned.
- **Real-world facts:** setting point 104.5 °C (about 220 °F); Seville oranges are bitter and
  rich in pectin; sugar preserves fruit; layers trap air; a wound mainspring stores energy.
- **Canon:**
  - Parcel never speaks.
  - Moss speaks only to you, and Byte reads your face.
  - Hazel appears only in the chapter 11 scenes. She is "very poorly", said plainly, with the
    canon line about waking up for the good bits.
  - Linnet doesn't appear.
- **Sprout wording.** The "Unverified" column is called "NOT SURE YET". The flag value stays
  `unverified`.
- **Reader think questions** (no best answer):
  - Is keeping a guess to yourself lying? (`s28-for-byte`)
  - Is Parcel a thief? (`s28-glasshouse`)
  - Is Null's schedule fair? (`s28-null-minder`)
  - Why did Hazel choose Byte? (`s28-why`)
