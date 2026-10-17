# Learning Grove: A11 "The Enchanted Place" (2026-10-17)

Files: `src/content/edu-a11-sprout.ts` (`EDU_A11_SPROUT`, `EDU_A11_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a11-reader.ts` (`EDU_A11_READER`, `EDU_A11_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a11` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (119 quest scenes + 11 variants) | 130 | 130 |
| Lessons | 132 | 145 |
| sel | 44 | 44 |
| science | 36 | 42 |
| maths | 25 | 25 |
| literacy | 18 | 24 |
| social-studies | 3 | 7 |
| health | 6 | 3 |
| Lesson kinds (ask / notice / do) | 38 / 68 / 15 | 58 / 73 / 3 |
| Think questions (ask with no `best`) | – | 20 (one per quest) |
| Glossary entries | – | 33 |

Every original scene has a version in both bands: all 20 quests' step scenes, done scenes and
complete scenes, plus the 11 variants (`a11-11-door-thistle`, `a11-11-door-sat`,
`a11-16-bounced-sat`, `a11-17-mist-rabbit`, `a11-17-found-rabbit`, `a11-19-signed-rabbit`,
`a11-19-scroll-thistle`, `a11-19-scroll-sat`, `a11-20-complete-thistle`, `a11-20-complete-sat`,
`a11-margin-hazel`). None unmapped. Choice ids and `set` flags (`a11-gift`, `a11-mist`) are
identical to the originals in both bands; the reader keeps every choice and the sprout band keeps
them too (none is cruel), so no `defaultChoice` was needed. Every lesson id is unique; line caps
hold (sprout 14 words, reader 30).

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.1, 1.G.A.3, RF.K.2,
  RL.K.3, RL.1.4, RL.2.4, L.2.4, K-ESS2-1, K-ESS2-2, K-ESS3-1, K-LS1-1, K-PS3-1, 1-ESS1-1, 1-LS1-2,
  1-PS4-1, 1-PS4-2, 2-ESS2-2, 2-ESS2-3, 2-LS2-1, 2-LS4-1, 2-PS1-1, 3-PS2-1, 4-LS1-1, 3-5-ETS1-2,
  D2.Civ.8.K-2, D2.Geo.2.K-2, ELOF (Approaches to Learning; Language and Communication; Literacy;
  Mathematics Development; Perceptual, Motor, and Physical Development; Scientific Reasoning; Social
  and Emotional Development), CASEL (all five). The stream-direction lesson (`a11-16-cone`), the
  beetle-legs count and the pressed-thistle lesson carry no standard, as none fits.
- **Reader:** 1.OA.A.1, 2.OA.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 3.MD.A.1, 3.MD.C.7, 3.MD.D.8,
  3.NF.A.1, 4.OA.C.5, 4.MD.A.1, 4.MD.A.2, 4.G.A.3, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.2.4, L.3.4,
  L.4.5, 1-LS1-2, 2-ESS2-2, 2-ESS2-3, 2-LS2-1, 2-LS2-2, 2-LS4-1, 2-PS1-1, 3-ESS2-1, 3-LS1-1,
  3-LS2-1, 3-PS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 5-ESS1-2, 3-5-ETS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2,
  D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five). A number of reader lessons (tracks, honey keeping, balloon burst, tally, upstream, thistle press, circle marker, hare's form, malt) carry no standard, as none fits.

The outline's five angles are all in. A stream's direction and why the fast side wins: A11-8 (water
runs downhill), A11-16 (`a11-16-cone`, `a11-16-game` with a do lesson, reader also fair tests and
upstream/downstream). Spelling wobbles and sounding out: A11-8 (`a11-08-pole`), A11-15
(`a11-15-note`, `a11-15-owl`, `a11-15-complete`). Counting sixty-something trees: A11-20 (mark
the first tree, groups of seven, and a closing "why a marker" lesson). Weather words: snow (A11-11),
flood (A11-9), mist (A11-17), blustery and gale (A11-18). Sitting with someone gloomy: A11-4, 6, 10,
16 (sat), 19 and the sat variants.

## Notes on care

- No text from the books: the five lifted lines are replaced (the reader uses the quest's own
  `childLines`, and `a11-01-page#2` and `a11-20-knight#8` were reworded so they stay clear of
  Milne's wording). Pooh's hums, Eeyore's poem and the Rissolution are described only. "Backson"
  is treated as a child's invented spelling of "back soon", which the sprout lesson reveals on
  purpose (the sounding-out lesson is the joke's punchline for the child).
- Rabbit's plan in A11-7 (swap Roo) and A11-17 (lose Tigger in the mist) are softened in sprout to
  a borrowed Roo and a game of hide-and-seek, each followed by a safety beat ("tell your grown-up",
  "if lost, stay still and call out"). The reader keeps them as written and asks a think question.
- Nothing dies on this page. The goodbye is gentle and unexplained; nobody says "school". The
  sprout margin note says only that Gran Hazel wrote it long ago; the reader lesson is about being
  remembered. Hazel's death is not mentioned in either band.
- Facts used: kangaroo joeys and tendons, honey bee colonies and pollination, how honey keeps, the
  water cycle, mist, a stream flowing fastest in the middle, gale speeds (about 60 to 75 km/h),
  pencil grades, how malt is made, owls nesting in tree holes, two-ear sound direction, hare forms,
  thistle seeds, Brazil, the real North Pole on sea ice, weekday names from old gods.

## For Maor

- The UK hold (A11 may not ship in the UK before 1 January 2027) applies to the Learning Grove
  versions too: they retell the same page.
- Sprout A11-17 turns "lose Tigger in the mist" into hide-and-seek. If you would rather keep Rabbit's
  original plan in sprout (with the `a11-mist` flag unchanged), say so.
- The reader quest titles reuse the script's, except A11-1, which is "A Bear on the Stairs" (the
  script's title echoes Milne's line).
- The weekday-names fact (Tuesday from Tiw) and the "English spelling fixed around the 1700s" fact
  are widely taught but worth a second pair of eyes before ship.
