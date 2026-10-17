# Learning Grove versions of A7, The Marigold Bridge

Files: `src/content/edu-a07-sprout.ts` (`EDU_A07_SPROUT`, `EDU_A07_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a07-reader.ts` (`EDU_A07_READER`, `EDU_A07_READER_VARIANTS`, `CHECKS`). Not yet
registered in `edu.ts` or `eduPacks` (the wiring task does that).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (78 quest scenes + 7 variants = all 85 originals) | 85 | 85 |
| Lessons | 87 | 114 |
| social-studies | 5 | 10 |
| literacy | 13 | 37 |
| science | 9 | 17 |
| maths | 19 | 12 |
| sel | 32 | 32 |
| health | 2 | 2 |
| art | 3 | 2 |
| music | 4 | 2 |

Do-lesson `edu:` checks: 21 in sprout, 2 in reader (all listed in each file's `CHECKS`).

## Standards used

Sprout: ELOF (Language and Communication, Literacy, Mathematics Development, Scientific Reasoning,
Social and Emotional Development, Perceptual/Motor/Physical), CASEL (Self-awareness, Social awareness,
Relationship skills, Responsible decision-making), K.CC.A.1, K.CC.B.5, K.CC.C.6, K.OA.A.1, K.OA.A.2,
K.MD.A.2, K.MD.B.3, K.G.A.1, K.G.A.2, RF.K.2, RL.K.3, RL.1.4, K-LS1-1, 1-PS4-1, 1-PS4-2, 1-ESS1-1,
D2.Geo.2.K-2, D2.His.2.K-2.

Reader: CASEL (all five), 2.OA.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 3.MD.A.1, 3.NF.A.1, 4.OA.C.5,
4.G.A.3, L.3.4, L.4.5, RF.K.2, RL.2.3, RL.3.3, RL.3.6, RL.4.2, 2-LS2-2, 2-LS4-1, 2-PS1-1, 3-LS3-1,
3-PS2-1, 4-PS3-2, 4-LS1-2, 4-ESS2-1, 5-ESS1-2, 1-PS4-2, D2.Geo.2.K-2, D2.His.2.K-2, D2.Civ.8.K-2.

## What the outline asked for, and where

- Día de Muertos traditions: ofrenda (A7-1 photo), cempasúchil (A7-1 petals), pan de muerto
  (A7-1 petals-done, A7-11), papel picado (A7-7), calaveras (A7-7), vigil (A7-3), petal paths (reader A7-4).
- Alebrijes: A7-4 (Pedro Linares, Mexico City, 1930s; carved copal-wood craft of Oaxaca; spirit guides
  named as this story's idea), A7-10.
- Spanish: hola, mucho gusto, gracias/de nada, mamá, papá, tía, tío, abuela/abuelita, uno to cinco.

## Unmapped originals

None. Every one of the 85 original scenes (all step, done, complete and variant scenes) has a version in each
band. `a7-07-s3` has no done scene in the original, so none was written.

## Choices and hard things

- Reader keeps all choice ids and `set` flags (`a7-name`, `a7-plea`); sprout keeps them too, since no A7 choice
  is cruel, so no `defaultChoice` was needed. Both bands were checked by script against the original.
- Chicharrón's fade, Héctor's death and Mamá Coco's death are said plainly, once, with comfort straight after.
  Héctor's poisoning is "something in his drink" in reader and "an unkind trick" in sprout; nothing is shown.
- No quotes or lyrics from the film.

## For Maor

1. Done scenes are short (2 to 3 lines) because the originals are; some fall under the 4 line sprout and 6 line
   reader guide. Say if you want them padded.
2. Cultural facts to have the Mexican consultants confirm before ship: the Linares and Oaxaca alebrije history,
   the "tíos" usage, mariachi origins, the ofrenda levels (two, three or seven), and the vigil line.
3. Some sprout lessons use the generic "sel" ask (breathing, waiting, telling a grown-up). Fine to vary once
   registered.
4. Nothing was registered in `edu.ts` or `eduPacks` (the wiring task's job).
