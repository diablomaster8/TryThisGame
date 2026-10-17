# Learning Grove: Atlas A26 "The Wall of Uruk" (2026-10-17)

Files: `src/content/edu-a26-sprout.ts` (`EDU_A26_SPROUT`, `EDU_A26_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a26-reader.ts` (`EDU_A26_READER`, `EDU_A26_READER_VARIANTS`, `CHECKS`). Not registered
yet: the wiring task adds them to `edu.ts` and `a26` to `eduPacks`. Both files export a `CHECKS` array
(the reader's is empty), so register them under different names.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (96 quest + 15 variants) | 111 | 111 |
| Lessons | 111 | 112 |
| science | 26 | 26 |
| sel | 27 | 28 |
| literacy | 19 | 19 |
| maths | 18 | 18 |
| social-studies | 13 | 13 |
| health | 8 | 8 |
| Kinds (ask / notice / do) | 96 / 4 / 11 | 106 / 6 / 0 |
| Think questions (no `best`) | 0 | 23 |
| Glossary entries | n/a | 26 |

Every scene has a lesson (the reader's `a26-09-watch` has two: time intervals, then a think question
about a kind untruth). Every lesson has an approved standard, lesson ids are unique, and the 11 sprout
`edu:` checks are all in `CHECKS`. Line caps hold (sprout <= 14 words, reader <= 30, all <= 160
characters, narration <= 2 sentences, enforced by a split helper plus hand edits). Each quest uses at
least three domains and has a `sel` lesson; each reader quest has a think question (also the Humbaba
plea, the two Humbaba-path notes in A26-13, the Hazel margin note and the Moss variants of A26-18).
No two lessons of the same domain are ever back to back, across scenes, quests and every variant
path (Moss, Humbaba, Hazel, the Grove keepsake); each variant keeps the domain of the scene it
replaces, except `a26-14-sickbed-done-agreed` (history, not science) and the Hazel note (literacy, not
feelings), which still differ from both neighbours. Both files pass the brief's tsc and eslint
commands, and Prettier; line endings are LF.

## Standards used

- **Sprout (35):** 1-ESS1-1, 1-PS4-1, 1-PS4-2, 2-PS1-1, 4-LS1-1, 4-LS1-2, K-ESS2-1, K-ESS3-1,
  K-ESS3-3, K-LS1-1, K.CC.B.4, K.CC.B.5, K.CC.C.6, K.MD.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.1.4,
  RL.2.3, RL.K.3, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Language and
  Communication, Literacy, Mathematics, Perceptual/Motor/Physical, Scientific Reasoning, Social and
  Emotional), CASEL (Relationship skills, Responsible decision-making, Self-awareness,
  Self-management, Social awareness).
- **Reader (40):** 1-ESS1-1, 1-PS4-2, 2-LS2-1, 2-PS1-1, 2-PS1-4, 2.OA.A.1, 3-LS1-1, 3-LS2-1, 3-LS4-4,
  3-PS2-1, 3.MD.A.1, 3.MD.C.7, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2,
  4-PS3-4, 4.MD.A.1, 4.MD.A.2, 4.OA.C.5, 5-ESS1-2, L.3.4, L.4.5, RL.1.4, RL.3.3, RL.3.6, RL.4.2,
  RL.4.3, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five).

## What it teaches (the outline's list)

- **Geography:** Uruk beside a river in Mesopotamia, "between the rivers" (the Tigris and the
  Euphrates), now Iraq; why cities grew by rivers; green land beside rivers and dry steppe away from
  them; cedars still growing in the mountains of Lebanon (with "nobody knows exactly where").
- **Cuneiform:** wedge-shaped writing pressed into wet clay with a reed (A26-1), and clay soft when
  wet and hard when dry (A26-2).
- **Sun-dried and kiln-fired bricks:** the knock test, a kiln as a very hot oven (A26-1), and why
  kiln-fired brick outlasts sun-dried brick in the rain (A26-18; weathering in the reader).
- **The flood tablet read again in 1872:** A26-17 (George Smith, the British Museum, "more than two
  thousand years" in the reader, "a very long time" in the sprout).
- **How friends remember each other:** A26-14 (statue, stories, the shepherds), A26-18 (handprint in
  a brick, what lasts); Hazel's margin note as a theme question.
- Also: counting, adding and taking away, sharing, rhymes and first sounds (sprout); multiplication,
  division, area, time intervals, units, doubling, fractions (reader); sound, forces, light and
  shadows, fire, wind, steam, scorpions, snakes, the Moon, reeds, seeds (both); similes, theme,
  motive, vocabulary (both); water and rest, washing, slow breathing, sleep, grief, honesty, fairness.

## Hard things and care notes

- **No lifted text.** None of the eight Thompson passages appears. Where the outline's `childLines`
  give a safe replacement, those lines are reused or paraphrased. No song lyrics.
- **Shamhat** is "a woman from the city" who teaches Enkidu words and songs, and nothing more; her
  scenes are all kept, with the outline's respectful treatment. Ishtar asks Gilgamesh to stay with her
  and be her king; her old friends are one plain line ("Everyone you loved ended up sad").
- **Humbaba:** the sprout offers "speak for him" and "say nothing" (`defaultChoice: 'silent'`, so the
  `agreed` choice is left out); the reader keeps all three. Humbaba's death is said once, plainly,
  offscreen, with comfort. The Bull of Heaven is stopped in a cloud of dust and nobody is hurt.
- **Enkidu's death** is said plainly in both bands (his body stopped working and will not start
  again), followed straight away by the Nubbin in Gilgamesh's lap, the statue and the remembering.
  "Gone", "sleeping" and "went away" are never used for death.
- **Iraq's heritage:** the tablet stays in its box; tablets taken from their places, some returned
  (A26-18, with a fairness question in the reader). No war imagery, no modern politics. The barley
  drink is "barley drink", and the quest is retitled "Bread and Barley". The flood is told as
  Uta-Napishtim's own story with no claim about which flood story is older.
- Moss's beats are kept in every variant (pairs: A26-1, 3, 14, 16, 18, plus the Grove keepsakes).

## Original scenes not mapped

None. All 96 step, done and complete scenes and all 15 variants have a version in both bands, and
every original choice id and `set` flag is kept (the sprout drops only `agreed` in `a26-10-plea`).

## For Maor

- The adviser packets (an Iraqi adviser and an Assyriologist) should look at: the wording of the
  cuneiform and 1872 lessons, "Mesopotamia means between the rivers", the cedar-forest note, and the
  heritage lesson in `a26-18-foot-done`.
- The reader's `a26-10-plea` is a think question with no best, followed by all three original
  choices; the sprout's version leads the child gently towards mercy ("say something kind") while
  still offering "say nothing". Say if you want it more neutral.
- The Q5 title change ("Bread and Barley") is for the Learning Grove only; the main game keeps
  "Bread and Ale".
