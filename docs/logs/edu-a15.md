# Learning Grove versions of A15, The Humbug (Baum's The Wonderful Wizard of Oz, 1900)

Files: `src/content/edu-a15-sprout.ts` and `src/content/edu-a15-reader.ts`.

Exports (same shape as the A13 files):

- `EDU_A15_SPROUT`, `EDU_A15_SPROUT_VARIANTS`, `CHECKS`
- `EDU_A15_READER`, `EDU_A15_READER_VARIANTS`, `CHECKS`

`CHECKS` is exported by both files, as in `edu-a13-*`; the wiring task should import them under aliases.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (130 quest scenes + 8 variants) | 138 | 138 |
| Lessons | 138 | 145 |
| Quests (20), each with every step goal and hint | 20 | 20 |
| Glossary words | none (sprout) | 40 |

Every original scene id has a version in each band: all step scenes, done scenes and complete scenes, plus the
8 variants: `a15-14-screen-done-reconciled`, `-bargained`, `-forced`; `a15-16-launch-done-reconciled`;
`a15-20-farewell-pocketed`; `a15-20-complete-asked`, `-asked-pocketed` and `-pocketed`. No original scene was left
unmapped. Choice ids and `set` flags (`a15-cap`, `a15-lamb`) are identical to the originals in both bands. Reader
keeps every choice, and sprout keeps them too, so no `defaultChoice` is needed.

### Lessons by domain

| Domain | sprout | reader |
| --- | --- | --- |
| sel | 29 | 29 |
| literacy | 27 | 29 |
| science | 26 | 29 |
| maths | 21 | 21 |
| social-studies | 13 | 15 |
| health | 10 | 10 |
| art | 8 | 8 |
| music | 4 | 4 |

No two lessons of the same domain follow one another, in a scene or across scenes, across the whole page and at the
seams where a variant stands in for its original. Every quest has at least 3 domains and an `sel` lesson. Reader has
at least one think question (an `ask` with no `best`) in every quest. 7 reader scenes carry 2 lessons: `a15-01-page`,
`a15-03-kansas`, `a15-04-oil`, `a15-13-flight`, `a15-14-screen`, `a15-17-lamb`, `a15-20-glinda`.

### Standards used (all from the approved list)

- **Sprout:** ELOF (Approaches excluded: Language and Communication, Literacy, Mathematics Development, Scientific
  Reasoning, Social and Emotional Development, Perceptual, Motor, and Physical Development); CASEL (all five
  codes except none left out: Self-awareness, Self-management, Social awareness, Relationship skills,
  Responsible decision-making); K.CC.A.1, K.CC.B.5, K.MD.A.2, K.OA.A.1, K.OA.A.2; 1-PS4-2, 2-ESS2-2, 2-PS1-1,
  K-LS1-1, K-2-ETS1-1; D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.
- **Reader:** CASEL (the same five); 3.MD.A.1, 3.MD.C.7, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 4.G.A.3,
  4.MD.A.1, 4.MD.A.2; L.3.4, L.4.5, RL.1.4, RL.2.3, RL.3.3, RL.4.2, RL.4.3; 2-LS2-1, 2-LS2-2, 2-PS1-1, 2-PS1-4,
  3-ESS2-1, 3-LS2-1, 3-PS2-1, 4-ESS2-1, 4-ESS2-2, 4-LS1-1, 4-PS3-2, 5-ESS1-2; D2.Civ.8.K-2, D2.Geo.2.K-2,
  D2.His.2.K-2.

## What it teaches (the outline's list)

- Kansas and the prairie, and weathering (the faded paint).
- What a cyclone is: warm and cold air, mostly spring; where to shelter.
- How a hot-air balloon flies (hot air is lighter; the first flights were in France in 1783, reader only).
- How coloured lenses change what you see (a green filter makes a red apple look dark).
- Brains, heart and courage, and naming what you already have, in four lessons and several think questions.

It also teaches compass directions on the map of Oz, rust and friction, floating, pollination, food chains,
sound and echoes, heat and light, dissolving, clay and kilns, symmetry, area, fractions, sums and multiplication,
time intervals, themes, motive, similes, multiple-meaning words, fairness, honesty and secrets.

## Care notes kept

- Baum's book (1900), not the 1939 film: silver shoes, no songs, nothing from the film.
- Deaths stay off the page (see For Maor). Hammer-Heads, Winkies, Quadlings and the china people are fairy-tale
  peoples, with no body-shape jokes. Porcelain is credited to China without stereotype.
- Nothing is quoted from Baum. "Oz, the Great and Terrible" appears as a name only (the Learning Grove rule for
  `all` quests), and the lines using it were reworded so that no sentence of Baum's is repeated.
- Never "Grief is love with nowhere to go", and no song lyrics.

## For Maor

1. **Softened in sprout.**
   - Dorothy shouts at the Lion instead of smacking his nose.
   - The wildcat is shooed off, and the Woodman drops the log bridge before the Kalidahs cross; they grumble home.
   - Wolves, crows and bees are sent running.
   - The spider "will not trouble anyone again".
   - The Witch's melting is said plainly ("She melts all away. She is gone for good"), with Dorothy sorry straight
     after, and a lesson on dissolving sugar.
   - The Corvin variants are only "a lonely man you know", with the chapter 9 detail left out.
2. **Reader keeps** the smack on the nose, but makes it a think question (is hitting ever the answer to a bully?).
   The wildcat is driven off rather than killed. The Kalidahs fall with the bridge, told plainly and gently.
   The wolves and spider "will not trouble anyone again".
3. **Lamb choices.** Both stay in sprout too. The china lamb never suffers, it only goes still, and the sprout
   lesson asks where the lamb is happiest. The reader think question is "safe versus well".
4. **Facts for a second pair of eyes.** All checked, but worth a glance: porcelain first made in China more than
   a thousand years ago; Omaha is in Nebraska just north of Kansas; a child of 7 to 10 needs 9 to 12 hours of sleep
   and has a resting pulse of roughly 70 to 100; a desert gets under about 250 mm of rain a year; tin hardly
   rusts, but iron hinges do; silver is the best electrical conductor and tarnishes; "humbug" is also a British
   striped mint sweet.
5. **Scene length.** Reader done scenes are short (3 or 4 lines) because the originals are 1 to 3 lines. The
   `a15-14-screen` scene runs to about 20 lines after the line splitter, because the original has 13 long lines. It
   has two lessons and could be split in a later pass.
6. **Wiring.** The wiring task must register both files in `edu.ts` and add `a15` to `eduPacks` in
   `tests/tools/content-check.ts`. Both files export `CHECKS`, so import them under aliases. `npx tsc`
   (the single-file command), `npx eslint src/content/edu-a15-*.ts` and `npx prettier --check` all pass.
