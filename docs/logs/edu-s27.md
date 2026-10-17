# Learning Grove: S27 "Some Nubbin" (2026-10-16)

Files: `src/content/edu-s27-sprout.ts` (`EDU_S27_SPROUT`, `EDU_S27_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s27-reader.ts` (`EDU_S27_READER`, `EDU_S27_READER_VARIANTS`, `CHECKS`). Not yet wired into
`edu.ts` or `eduPacks`; that is the wiring task's job.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes | 38 (28 step and done scenes, 1 complete, 9 variants) | 38 |
| Lessons | 41 | 53 |
| Maths | 11 | 7 |
| Science | 9 | 17 |
| Social and emotional (sel) | 11 | 13 |
| Literacy | 6 | 13 |
| Social studies | 2 | 3 |
| Health | 2 | 0 |
| Glossary words | — | 23 |

Reader think questions, with no best answer: `s27-was-it-you` (is a kind fib ever right?) and `s27-midnight` (why
did Corvin lower his hand?).

## Standards used

- **Sprout:** ELOF (Literacy, Mathematics Development, Perceptual, Motor, and Physical Development, Scientific
  Reasoning, Social and Emotional Development); CASEL (Relationship skills, Responsible decision-making,
  Self-awareness, Social awareness); K.CC.A.1, K.CC.B.5, K.G.A.1, K.MD.A.2, K.OA.A.2; RF.K.2, SL.K.1; K-ESS2-1;
  D2.Civ.8.K-2.
- **Reader:** 1.OA.A.1, 2.OA.A.1, 3.OA.A.1, 3.OA.A.3, 3.MD.A.1, 4.MD.A.1; L.2.4, L.3.4, L.4.5, RL.1.4, RL.3.3, RL.4.2;
  K-PS3-1, K-ESS3-1, 1-PS4-2, 1-ESS1-2, 2-ESS2-3, 2-PS1-4, 3-LS1-1, 3-PS2-1, 4-LS1-1, 4-PS3-2; CASEL (all five);
  D2.Civ.8.K-2.

## Mapping

Every original scene is mapped in both bands, all 9 variants included. No scene was left unmapped.

- Sprout leaves out the `shield` choice ("Yes. It was me.", a fib) in `s27-was-it-you`, with `defaultChoice: 'frost'`.
  `s27-midnight-shield` is still written for sprout, in case a save carries `s27-truth = shield`.
- The reader keeps every choice. All choice ids and `set` values match the original, including `boughtBack` in
  `s27-home`.
- The book's two lifted lines are not used. The Keeper's line in `s27-last-evening` and the spring closing narration
  are new.
- Spindle's death is said plainly in `s27-empty-web` (both bands), offscreen with no body shown, and comfort follows
  straight away.

## Checks run

- The single-file `tsc` from the brief prints nothing.
- `eslint` on both files is clean. Prettier was run on both files.
- A scratch checker reported 0 problems and 0 warnings. It reproduces the content-check rules: coverage of every
  original scene, choice ids and `set`s, `defaultChoice`, lesson ids unique, `after` in range, approved standards,
  `do` checks listed in `CHECKS`, line caps, scene line counts, no quoted childLines text, and pronouns.

## For Maor

- **Small additions for checkable maths (reader only):**
  - Twelve people at noon, then twice as many (`s27-odd-things`).
  - Eight runners at the Show.
  - Spindle writes from nine o'clock to about five.
  - Twelve rungs, 25 cm apart.
  - Corvin counts Shells in tens.
  None of these changes the story.
- **Sprout drops the protective fib.** Should the sprout band keep "Yes. It was me." after all, framed as a kind fib?
- **Title.** The edu quest title stays "Some Nubbin", as in the main game. It is our title, not a quote.
- **Spider facts.** These are the well-established, general ones:
  - eight legs and two body parts;
  - silk from spinnerets;
  - fresh webs, and recycled silk;
  - garden spiders take on the temperature of the air around them;
  - garden spiders live about a year;
  - egg sacs that last through the winter;
  - spiderlings travel by ballooning.
