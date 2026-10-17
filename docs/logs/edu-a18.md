# Learning Grove: Atlas A18 "The Doll in the Pocket" (2026-10-17)

Files: `src/content/edu-a18-sprout.ts` (`EDU_A18_SPROUT`, `EDU_A18_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a18-reader.ts` (`EDU_A18_READER`, `EDU_A18_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a18` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (108 quest + 14 variants) | 122 | 122 |
| Lessons | 122 | 123 |
| sel | 24 | 24 |
| maths | 22 | 21 |
| science | 22 | 24 |
| literacy | 21 | 20 |
| social-studies | 12 | 15 |
| health | 11 | 10 |
| music | 5 | 4 |
| art | 5 | 5 |
| Kinds (ask / notice / do) | 50 / 28 / 44 | 106 / 1 / 0 |
| Think questions (no `best`) | 0 | 16 (every quest has one) |
| Glossary entries | n/a | 21 |

Every scene has a lesson; lesson ids are unique; every `edu:` check is listed in `CHECKS` (the
reader band has no `do` lessons, so its list is empty). Line caps hold (sprout at most 14 words,
reader at most 30, all at most 160 characters, narration at most two sentences). No two lessons of
the same domain sit next to each other, checked across scenes, quests, and with each variant swapped
in at its position (and the margin note and Sable scene in their slots). Each quest has at least three
domains and a `sel` lesson. Both files pass the brief's `tsc` and `eslint` commands and Prettier.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.CC.C.6, K.G.A.1, K.MD.A.2, K.MD.B.3, K.OA.A.1, K.OA.A.2,
  1.G.A.3, 1.OA.A.1, RF.K.2, RL.K.3, RL.1.4, RL.2.4, SL.K.1, K-LS1-1, 1-ESS1-1, 1-ESS1-2,
  1-PS4-1, 1-PS4-2, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Language and Communication,
  Literacy, Mathematics Development, Perceptual/Motor/Physical, Scientific Reasoning, Social and
  Emotional), CASEL (all five). Left out where none fits: art (5), music (2) and one
  social-studies lesson.
- **Reader:** 2.OA.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 3.MD.A.1, 3.NF.A.1, 4.MD.A.1, 4.MD.A.2,
  4.OA.C.5, L.3.4, L.4.5, RL.3.3, RL.4.2, RL.4.3, 1-ESS1-2, 1-PS4-2, 2-LS2-1, 2-PS1-1, 3-LS1-1,
  3-PS2-1, 4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 5-ESS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2,
  D2.Geo.2.K-2, D2.His.2.K-2, CASEL (five). Left out where none fits: 23 lessons (art 5, music 4,
  literacy 4, science 5, health 5).

## What the outline asked for, and where

- **Flax to linen** (pull, ret, spin, weave, bleach in the sun): flax and pulling in A18-15 step 1
  done; the over-and-under weave in A18-15 step 2; the ordered steps in `a18-15-loom-done` (and
  its self variant); sun whitening cloth in `a18-15-bleach`. Sprout keeps three steps (pull,
  spin, weave) and the sun lesson; "ret" is reader only (glossary).
- **Birch woods of eastern Europe:** `a18-05-move` (cool northern lands), `a18-12-question-done`
  (white bark, betulin, writing on bark).
- **Day, sunrise and night as the three riders:** A18-7 (why dawn and sunrise look milky and
  red: scattering of light, reader only; the Earth turning, both bands), A18-10 night-done
  (shadows), A18-12 (the riders as bright day, red sun, dark night).
- **The same tale told in many places:** `a18-12-supper`, the oral tradition lesson. Both bands name
  Ukrainian, Belarusian, Polish and Russian stories; the reader band also names Afanasyev.
- **Why sharing your food is care:** `a18-02-promise-done` (both bands), `a18-09-crust` (reader think
  question; sprout notice), and Hazel's rule in the crust choice.

## Care notes kept

Softened for All and said so: the skull is "a lantern with a face" in sprout and "a skull" in
reader; the stepmother's house is driven out by a steady light, nobody burned, nobody hurt (sprout
says "Nobody is hurt" outright); the fence is white sticks with lanterns (sprout) or old bones like
driftwood (reader). The mother's death is one plain, gentle scene in each band ("her body stopped
working, and it will not start again"), with the comfort straight after, and the illness is never
named. Baba Yaga is big and grumpy and fair in sprout, frightening and fair in reader; the "Russian
smell" rhyme is not used. The mother's blessing is "love"; the doll's "pray" is left out. No flags,
state symbols or country in the story itself; the countries are named only in the oral tradition
fact box. No lifted text: none of the eight Magnus lines appears, and none of the original
`childLines` source lines appears in any edu line (checked by a script that mirrors the content-check
rule). No "Grief is love with nowhere to go". Sprout keeps every choice (none is cruel), so no
`defaultChoice` is used; reader keeps every choice and every `set` flag.

## Unmapped scenes

None. All 122 original scenes (step, done, complete, and the 14 `ATLAS_A18_VARIANTS` scenes,
including `a18-02-margin-hazel` and `a18-16-sable`) have a version in each band.

## For Maor

- **Adviser:** the outline asks for an East Slavic folklore adviser before final. The packet should
  cover the oral-tradition box (which languages and countries are named), the "Tsar of the tale"
  note, the stove-sleeping fact, and kvass.
- **Speaker names:** the skull's speaker is still named "The Skull" in `atlas-a18.ts`, so sprout
  children will see that name above the "lantern with a face" lines. Renaming the speaker would be
  a change to the source file, which this task didn't touch.
- **Reader hard question:** `a18-14-stare` is a think question about whether unkind people deserve
  a fright, and `a18-09-crust` asks who should have the crust. Check you are happy with both.
- **Standards:** art, music and a few health lessons have no approved standard that fits, so they
  have none, as EDU-STYLE allows.
- Not yet run: `npx tsx tests/tools/content-check.ts --warnings`, since the files are not in
  `eduPacks` until the wiring task.
