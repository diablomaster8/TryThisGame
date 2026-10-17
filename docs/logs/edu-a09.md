# Learning Grove versions: A9 The Comet (a09)

Files: `src/content/edu-a09-sprout.ts` (`EDU_A09_SPROUT`, `EDU_A09_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a09-reader.ts` (`EDU_A09_READER`, `EDU_A09_READER_VARIANTS`, `CHECKS`).
Source: `src/content/atlas-a09.ts`, audience `all`. Outline: `docs/atlas.md`, section A9.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Quests | 12 | 12 |
| Scenes (step, done, complete, 3 variants) | 79 | 79 |
| Lessons | 79 (exactly 1 per scene) | 103 (1 to 2 per scene) |
| Glossary entries | none (sprout) | 30 |
| `do` checks | 15 | 4 |

Lessons by domain:

| Domain | sprout | reader |
| --- | --- | --- |
| maths | 19 | 19 |
| science | 15 | 26 |
| sel | 20 | 23 |
| literacy | 11 | 20 |
| social-studies | 6 | 9 |
| health | 4 | 4 |
| music | 2 | 2 |
| art | 2 | 0 |

## Standards used

Sprout: 1-ESS1-1, 1-PS4-1, 1.MD.B.3, 2-PS1-1, 3-LS1-1, K-ESS2-1, K-ESS3-1, K-LS1-1, K.CC.A.1,
K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.1, RF.K.2, RL.1.4, RL.2.3, RL.2.4, RL.K.3, D2.Civ.8.K-2,
D2.Eco.1.K-2, D2.Geo.2.K-2, four CASEL codes, and ELOF: Language and Communication, Literacy,
Perceptual Motor and Physical Development, Social and Emotional Development.

Reader: 1-PS4-1, 2.OA.A.1, 3-LS1-1, 3-PS2-1, 3.MD.A.1, 3.MD.C.7, 3.MD.D.8, 3.NF.A.1, 3.OA.A.1,
3.OA.A.3, 3.OA.D.8, 4-ESS2-1, 4-LS1-1, 4-PS3-2, 4.G.A.3, 4.MD.A.1, 4.MD.A.2, K-ESS3-1, L.3.4, L.4.5,
RL.1.4, RL.3.3, RL.3.6, RL.4.2, RL.4.3, D2.Civ.8.K-2, D2.Eco.1.K-2, five CASEL codes, and ELOF:
Language and Communication, Literacy. Lessons with no matching approved code have no `standard`.

## What the outline asked for, and where it is taught

- Comets and why tails point away from the Sun: sprout `a09-01-complete`; reader `a09-01-hammock-done`
  (also tail length in `a09-04-telescope`, why a comet shines in `a09-08-complete`, real comets and
  Halley in `a09-12-night`).
- Telling time to the minute (8:42): reader `a09-04-telescope` (18 minutes to nine), `a09-11-arrive-done`
  (7:30 to 8:42), `a09-11-dark` (twenty to nine); sprout `a09-04-telescope` (nearly nine),
  `a09-11-arrive-done` (half past) and `a09-11-dark-done`.
- Finland and its two languages: sprout `a09-01-valley-done`; reader `a09-01-valley-done` (hei and hej,
  Tove Jansson wrote in Swedish) and `a09-12-complete` (kiitos and tack).
- Naming worries and talking about them: `a09-02-complete`, `a09-03-sky`, `a09-04-step`,
  `a09-06-meeting-done`, `a09-08-shore-done`, `a09-11-dark`, `a09-12-dawn-done` in both bands.

## Hard things and care notes

- The comet stays a mystery in the sky, never a threat. The bush, octopus and tornado are a bump or a
  fright, with comfort straight after. Nobody is hurt; the octopus goes home unharmed.
- The stranded fish in `a09-08-shore` is "waiting in a puddle that is just enough" in both bands; no dying.
- Both Hemulens are "he", the dress is never the joke, and the book's gentle national humour is not used.
- Every choice keeps its original id and `set`. All sprout choices are kind, so none were dropped and no
  `defaultChoice` is needed. `a09-answer` (dunno / home) and `a09-brought` still work.
- No lines are lifted from the books or translations. The harmonica tune is only ever hummed.

## Think questions (reader, no `best`)

`a09-01-hammock`, `a09-02-launch`, `a09-03-fire`, `a09-04-step`, `a09-05-bush-done`, `a09-06-snork`,
`a09-07-butterfly-done`, `a09-08-shore-done`, `a09-09-octopus-done`, `a09-10-tornado-done`,
`a09-11-door`, `a09-12-dawn-done`. Every quest has at least one.

## Original scenes that could not be mapped

None. All 79 original scene ids (33 step, 31 done, 12 complete, 3 variants) have a version in each band.

## Checks run

- `npx tsc --noEmit --ignoreConfig --strict ... edu-a09-sprout.ts edu-a09-reader.ts`: clean.
- `npx eslint src/content/edu-a09-*.ts`: clean.
- By hand (script): every original id has a version in each band; scene ids and lesson ids unique;
  every lesson `after` is inside its scene; sprout lines at most 14 words and reader lines at most 30;
  every quest has at least three domains and a `sel` lesson; no two maths lessons are adjacent.

## For Maor

- Wiring still to do: register `EDU_A09_SPROUT` / `EDU_A09_READER` (and the two `_VARIANTS` arrays) in
  `edu.ts`, add `a09` to `eduPacks` in `tests/tools/content-check.ts`, and add the 19 check strings in
  the two `CHECKS` exports to wherever `edu:` checks are collected. Both files export `CHECKS`, as the
  format models do.
- Sprout done scenes and the three variants run 3 to 4 lines, under the 4 to 10 guide, because the
  originals' done scenes are one to three lines. Lesson text is separate and not counted.
- Reader done scenes run 2 to 3 lines for the same reason.
- Sprout `a09-12-dawn` teaches tides in general terms; the Baltic has very small tides, so the real-world
  note says "real seas" and not "the Finnish sea".
- The story's comet fills the sky, which no real comet does. The lessons keep real facts separate from
  the story's own events ("in real life...").
- Cultural adviser: the Finnish and Swedish words (hei, hej, kiitos, tack) and the Tove Jansson note
  are short and standard, but a Finnish reader should confirm them before release.
