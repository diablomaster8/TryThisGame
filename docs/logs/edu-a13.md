# Learning Grove: Atlas A13 "The Wooden Boy" (2026-10-17)

Files: `src/content/edu-a13-sprout.ts` (`EDU_A13_SPROUT`, `EDU_A13_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a13-reader.ts` (`EDU_A13_READER`, `EDU_A13_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a13` to `eduPacks`.

Written in two sittings: the first writer finished the sprout file and most of the reader file
before a rate limit; this pass checked both, found the reader file already complete (all 20
quests and the 12 variants), shortened one 32-word reader line in `reader:a13-20-complete`, and
added a `sel` lesson to `reader:a13-06-show` so every reader quest has one.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (118 quest + 12 variants) | 130 | 130 |
| Lessons | 130 | 141 |
| sel | 41 | 38 |
| science | 32 | 38 |
| literacy | 20 | 25 |
| maths | 20 | 20 |
| social-studies | 9 | 12 |
| health | 6 | 7 |
| music | 2 | 1 |
| Kinds (ask / notice / do) | 70 / 31 / 29 | 99 / 40 / 2 |
| Think questions (no `best`) | 0 | 27 |
| Glossary entries | n/a | 31 |

Every scene has a lesson; every lesson has an approved standard; lesson ids are unique; every
`edu:` check is listed in `CHECKS`. Line caps hold (sprout ≤ 14 words, reader ≤ 30, all ≤ 160
characters). Each quest uses at least three domains and has a `sel` lesson; each reader quest has
a think question. Both files pass the brief's tsc and eslint commands.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.CC.C.6, K.G.A.1, K.G.A.2, K.MD.B.3, K.OA.A.1,
  K.OA.A.2, RF.K.2, RL.1.4, RL.2.3, RL.2.4, RL.K.3, L.2.4, K-ESS2-1, K-ESS3-1, K-LS1-1, K-PS3-1,
  1-ESS1-1, 1-LS1-2, 1-PS4-1, 1-PS4-2, 2-LS2-1, 2-PS1-1, 4-LS1-1, 4-LS1-2, K-2-ETS1-1,
  D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Language and Communication,
  Literacy, Perceptual/Motor/Physical, Scientific Reasoning, Social and Emotional), CASEL (all
  five).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.MD.B.3, 3.NF.A.1, 3.OA.A.3, 3.OA.D.8, 4.MD.A.1, 4.MD.A.2,
  4.OA.C.5, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.2.4, L.3.4, L.4.5, 1-PS4-1, 1-PS4-2, 2-LS2-1,
  2-LS2-2, 2-PS1-1, 2-PS1-4, 3-ESS2-1, 3-LS1-1, 3-LS2-1, 3-LS4-3, 3-PS2-1, 4-ESS2-2, 4-LS1-1,
  4-LS1-2, 4-PS3-2, 4-PS3-4, 5-ESS1-2, 3-5-ETS1-2, D2.Civ.8.K-2, D2.Eco.1.K-2, D2.Geo.2.K-2,
  D2.His.2.K-2, CASEL (all five).

## What the outline asked for, and where

- Where Tuscany is (Italy the boot, Tuscany in the middle, the sea to the west): both bands, A13-1
  onward. *Pinocchio* means "pine nut": both bands.
- Italian words: *babbo* and *grazie* in both bands; *burattino* in reader only (sprout keeps to
  *babbo*, *grazie* and *ciao*, which a 4-year-old can say back).
- Puppet theatre and the commedia dell'arte masks Harlequin and Punchinello: A13-6 and A13-7.
- Wood: grows a ring a year, floats (float-or-sink sorts in sprout).
- A fib grows: A13-11, gently and without shaming, in both bands.

## Care notes kept

Collodi, not Disney: no Jiminy, Monstro, Lampwick, "Blue Fairy" or Pleasure Island (grepped).
The Talking-cricket is knocked off the wall and alive on both routes; the oak is a collar tie;
the Fairy's stone says she went away missing him; the schoolboy gets up; the old watchdog is
"gone"; Candlewick's death is said plainly, with comfort straight after. No lifted text: none of
the eight Murray lines appears (grepped). The Nubbin never speaks; Clank does.

## Unmapped scenes

None. All 130 original scenes (step, done, complete and the 12 `A13_VARIANTS` scenes, including
the Grove scenes `a13-grove-clank-dusk`, `a13-grove-pixel`, `a13-grove-clank-idle`) have a
version in each band. Sprout keeps every choice (`a13-cricket`, `a13-crust` and the rest, all
reworded kindly), so no `defaultChoice` is used.

## For Maor

- Italian adviser: the outline asks for one; the Italian words, the Tuscan *babbo* and the
  commedia dell'arte notes should go in that packet.
- The sprout band softens Candlewick's death less than other lines soften theirs: it says plainly
  that he died, per EDU-STYLE. Check you are happy with that for ages 3–6.
- Not yet run: `npx tsx tests/tools/content-check.ts --warnings`, since the files are not in
  `eduPacks` until the wiring task.
