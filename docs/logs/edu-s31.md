# Learning Grove versions: S31 The Great Gourd

Files: `src/content/edu-s31-sprout.ts` (`EDU_S31_SPROUT`, `EDU_S31_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s31-reader.ts` (`EDU_S31_READER`, `EDU_S31_READER_VARIANTS`, `CHECKS`). They are not
registered yet: the wiring task adds them to `edu.ts` and adds S31 to `eduPacks` in `content-check.ts`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (27 step/done + complete + 17 variants) | 45 | 45 |
| Lessons | 46 | 52 |
| science | 14 | 14 |
| sel | 15 | 11 |
| maths | 8 | 10 |
| literacy | 2 | 11 |
| social-studies | 2 | 3 |
| health | 2 | 2 |
| art | 2 | 0 |
| music | 1 | 1 |
| Glossary words | none | 19 |

Every original scene has a version in each band, including the five ambient lines. Lesson ids are
unique. Every line is within the cap (sprout ≤ 14 words, reader ≤ 30) and under 160 characters.
Every choice id and `set` is kept in both bands, so neither band needs a `defaultChoice`. None of
S31's choices is cruel or bleak.

## Standards used

- **Sprout:** ELOF Social and Emotional Development, ELOF Scientific Reasoning, ELOF Approaches to
  Learning, ELOF Perceptual, Motor, and Physical Development; CASEL Social awareness; K.CC.A.1,
  K.CC.B.5, K.OA.A.1, 1.MD.B.3; RF.K.2; K-PS3-1, K-ESS2-1, 1-PS4-2; D2.His.2.K-2, D2.Civ.8.K-2.
- **Reader:** CASEL Social awareness, Relationship skills, Responsible decision-making,
  Self-awareness, Self-management; 1.OA.A.1, 2.OA.A.1, 2.MD.D.10, 3.OA.A.3, 3.MD.A.1, 4.MD.A.1,
  4.MD.A.2, 4.G.A.3; L.2.4, L.3.4, L.4.5, RL.2.3, RL.3.3, RL.3.6, RL.4.2; K-PS3-1, 1-ESS1-2, 2-LS2-2,
  2-PS1-1, 2-PS1-4, 2-ESS2-3, 3-PS2-1, 3-LS1-1, 3-LS4-3, 4-LS1-1, 4-LS1-2; D2.His.2.K-2, D2.Civ.8.K-2.

The outline's angle is covered in both bands:

- how gourds grow (seed, vine, flowers, bees);
- why frost ends the season (the reader band explains that ice crystals break tender leaves);
- being a friend to someone who believes something you don't;
- waiting, and how long a night is (sprout counts midnight to four o'clock; reader works out six
  in the evening to four in the morning, 10 hours);
- turnip lanterns in Scotland and Ireland.

The reader band has 8 think questions.

## Unmapped scenes

None.

## Canon and care

- The three lifted lines never appear. Lines that were quoted have new, original wording, and the
  quote check against the `childLines` keys passes.
- The third rule is named only in the `sat` choice of each band's `s31-long-grass`.
- Nubbins and animals never speak. Sable is narrated only ("Her ears stay up."). Wisp's ear is torn.
- Moss speaks one line (chapter 7, so after chapter 4).
- Tam's faint: he comes round at once and falls asleep. Sprout says plainly that he is fine. The
  reader band adds a short health note on fainting.
- The sprout carve scene has Mum lend Ivy the knife. The reader carve scene has Mum keep an eye on
  it. This is a small safety addition that isn't in the original.

## For Maor

- **Invented numbers.** Some numbers in the reader band were made up for the sums, and the main
  game doesn't state them:
  - the fourth post is 15 m from the first;
  - Tam is 120 cm tall and the gourd is 50 cm;
  - Tam sat down at six o'clock;
  - each rock weighs 200 g;
  - the strays' heap is six plums.
- **Rock count.** In the sprout guising scene, Ned gets a rock at five doors. The main scene names
  four doors, but the variants say five rocks, so five keeps the count consistent.
- **Check strings.** The `do` lessons use these new check strings:
  - `edu:act:fly:arms`
  - `edu:act:sit:still`
  - `edu:clap:tempo:fast-slow`
  - `edu:tally:times:11`

  The engine needs to accept the verbs `act` and `tally`.
