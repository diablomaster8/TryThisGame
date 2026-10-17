# Learning Grove versions: A31 The Hero Twins

Files: `src/content/edu-a31-sprout.ts` (`EDU_A31_SPROUT`, `EDU_A31_SPROUT_VARIANTS`) and
`src/content/edu-a31-reader.ts` (`EDU_A31_READER`, `EDU_A31_READER_VARIANTS`). Each also exports `CHECKS`.
Nothing else was edited; `edu.ts` and `eduPacks` in `tests/tools/content-check.ts` still need wiring.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Quests | 17 | 17 |
| Scenes (39 step, 2 done, 17 complete, 23 variants) | 81 | 81 |
| Lessons | 81 | 82 |
| maths | 14 | 15 |
| science | 21 | 22 |
| sel | 19 | 19 |
| literacy | 14 | 13 |
| social-studies | 8 | 9 |
| music | 2 | 2 |
| art | 2 | 1 |
| health | 1 | 1 |

Reader has 7 think questions (no `best`): `a31-01-page-done`, `a31-05-door`, `a31-06-complete`,
`a31-10-complete`, `a31-13-game`, `a31-15-curtain`, `a31-17-hearth`. Reader glossary: 16 words, on the quests.
Sprout `do` checks: `edu:clap:thock:3`, `edu:count:bumps:5`, `edu:count:people:3`, `edu:count:owls:4`,
`edu:clap:syllables:macaw`, `edu:count:corn-teeth:5`, `edu:tap:shape:circle`, `edu:count:fingers-toes:20`,
`edu:clap:beat:ball`, `edu:count:bows:3`, `edu:count:days:5`, `edu:clap:beat:drum-dance`, `edu:share:tortilla:halves`,
`edu:count:ribbon-colours:3`, `edu:count:leaves:7`, `edu:count:leaves:3`, `edu:order:story-events:3`,
`edu:point:east:sunrise`. Reader has no `do` lessons.

## Standards used

- Sprout: 1-ESS1-1, 1-PS4-1, 1-PS4-2, 1.G.A.3, 2-LS2-1, 2-LS4-1, 2-PS1-1, 3-LS1-1, 4-LS1-1, 4-LS1-2, K-2-ETS1-1,
  K-LS1-1, K.CC.A.1, K.CC.B.5, K.CC.C.6, K.G.A.1, K.G.A.2, K.MD.A.2, RF.K.2, RL.2.3, RL.2.4, RL.K.3, CASEL (all five),
  D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, and ELOF: Approaches to Learning, Language and Communication,
  Perceptual, Motor, and Physical Development, Social and Emotional Development.
- Reader: 1-ESS1-1, 1-PS4-1, 2-LS2-1, 2-PS1-1, 2-PS1-4, 2.OA.A.1, 3-5-ETS1-2, 3-LS1-1, 3-LS4-3, 3.MD.A.1, 3.NF.A.1,
  3.OA.A.1, 3.OA.A.3, 4-LS1-1, 4-LS1-2, 4-PS3-2, 4.G.A.3, 4.OA.C.5, 5-ESS1-2, L.3.4, RL.2.3, RL.2.4, RL.3.3,
  RL.4.2, RL.4.3, CASEL (Relationship skills, Responsible decision-making, Self-awareness, Self-management, Social
  awareness), D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.
- Nearest-code choices: Maya dot-and-bar numbers use 4.OA.C.5 (a number rule); rhythm patterns in the music
  lessons use 4.OA.C.5 and 3.OA.A.1; the sprout art and music lessons use ELOF codes.

## What was checked

- Every original scene id (step, done, complete, variant) has a version in each band, with the same choice ids and
  the same `set` flags (`a31-rat`, `a31-corn`). Every step id has a goal. All lesson ids are unique. Sprout lines are
  at most 14 words and reader lines at most 30; narration is at most two sentences; no line is over 160 characters.
- A script walked all 12 paths (go or stay, three rat choices, ribbons on or off), with the inserts in their
  place, and found no two lessons of the same domain in a row.
- Sums and facts: 7 + 5 = 12; 3 x 3 = 9; 4 x 2 = 8; 36 / 4 = 9; 4 + 6 = 10; seven = a bar and two dots; 20 x 20 = 400;
  3 x 4 = 12 (twice); 6 pm to 6 am = 12 hours; 6 + 7 = 13; 5 x 24 = 120; the 8th beat of stomp, stomp, clap is a
  stomp; 3 x 7 = 21; the 7th colour of gold, silver, green is gold. A turn right from east faces south.

## Not mapped

None. Every original scene has a version in both bands.

## Choices made on softening

- Seven Macaw takes a blowgun, not an arm. The bat takes a hat, not a head, and the squash is a pretend hat. The
  oven is "a glow" and the river hides the twins as catfish. The dancers' wonders are a house that vanishes in smoke and
  a dog that lies down and gets up. The lords' end is a curtain and empty seats (reader: "were gone, and didn't
  come back", sprout: "will not bother anyone again"). The cigars are candles.
- The fathers "stayed there"; nobody dies on the page except the Four Hundred Boys, said plainly in both bands with the stars
  after. The reader keeps Xquic's father's order about "her heart in a bowl"; the sprout band says "proof, to show
  she was gone".
- No copal, prayer or ceremony. Xquic "asks softly, the way you ask friends for a favour". Xmucane puts a log on the
  fire in the vigil.
- The margin lines are new, not Spence's words and not the game's `childLines`. Hazel's note is reworded ("won by being
  cheeky to a pair of grumpy lords") so it holds in the Learning Grove. Byte's line is the outline's.

## For Maor

1. K'iche' advisers should read both files before they ship, as for the main page. Items to look at: the "more than
   twenty Mayan languages" line, jade from the Motagua valley (reader), the milpa, the nixtamal (soaking corn in lime)
   line in the stay scene, and the sprout line that "people in Guatemala still carve jade". All are accurate to my
   knowledge but are claims about a living culture.
2. The stay-branch journal text from the original's notes ("Sit up with Xmucane...") is merged into one goal per step
   ("Stand by the twins, or stay beside Xmucane"). If the engine can pick a goal by branch, split them.
3. `WHICH_SUN` is reworded ("My gran told me which one is which...") in both bands. The advisers decide the real answer.
4. The reader `think` question in `a31-13-game` asks whether tricking an unfair opponent is cheating. If it is too sharp for
   the Learning Grove, swap it for the sprout's "ask for help" question.
5. Wiring: register `EDU_A31_SPROUT`, `EDU_A31_SPROUT_VARIANTS`, `EDU_A31_READER`, `EDU_A31_READER_VARIANTS` in
   `edu.ts`, add `a31` to `eduPacks`, and merge both `CHECKS`.
