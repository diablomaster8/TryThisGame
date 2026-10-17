# Learning Grove: Atlas A17 "The Camphor Tree" (2026-10-17)

Files: `src/content/edu-a17-sprout.ts` (`EDU_A17_SPROUT`, `EDU_A17_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a17-reader.ts` (`EDU_A17_READER`, `EDU_A17_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a17` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (77 quest + 20 variants) | 97 | 97 |
| Lessons | 97 | 133 |
| sel | 25 | 32 |
| science | 23 | 36 |
| maths | 15 | 19 |
| literacy | 12 | 21 |
| health | 8 | 9 |
| social-studies | 7 | 13 |
| music | 4 | 3 |
| art | 3 | 0 |
| Kinds (ask / notice / do) | 35 / 33 / 29 | 118 / 12 / 3 |
| Think questions (no `best`) | 0 | 20 |
| Glossary entries | n/a | 23 |

The 20 variants are the 14 hunt-path scenes (A17-9, 11, 14, 15, 16), the two `s1Done` oak scenes
and the four Grove keepsake scenes (oak, oak-acorn, oak-sleeps, camphor); the counts above
include them. Every scene has a lesson; every lesson has an approved standard; lesson ids are
unique; every `edu:` check is listed in `CHECKS`. Both files pass the brief's tsc command,
eslint and `prettier --check`.

## Checks run (scratch script, not in the repo)

- Every original scene id (steps, dones, completes, all `A17_VARIANTS`) has a version in each
  band, with identical choice ids and `set` flags (`a17-tunnel` on `a17-06-greet`).
- Caps: sprout lines at most 14 words, reader at most 30, all at most 160 characters. Every
  narration line, lesson line and reply is at most two sentences (the sprout builder splits to
  enforce it).
- **Domain order:** no two lessons of the same domain in a row, within a scene or across scenes,
  checked along four whole-page play paths (wait or hunt, with or without `s1Done`) and along the
  three Grove keepsake paths. Each quest uses at least three domains and has a `sel` lesson, on
  every path. Every reader quest has a think question.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.G.A.1, K.OA.A.1, RF.K.2, RL.1.4, RL.2.4, RL.K.3, SL.K.1,
  K-ESS2-2, K-LS1-1, K-2-ETS1-1, 1-ESS1-1, 1-PS4-1, 1-PS4-2, 2-LS2-1, 2-PS1-1, D2.Civ.8.K-2,
  D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Approaches to Learning, Language and Communication,
  Literacy, Mathematics Development, Perceptual/Motor/Physical, Scientific Reasoning), CASEL (all
  five).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.OA.A.1, 3.OA.A.3, 4.MD.A.1, 4.MD.A.2, 4.OA.C.5, RL.1.4,
  RL.2.4, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.3.4, L.4.5, K-PS3-1, 1-ESS1-1, 1-PS4-1, 1-PS4-2,
  2-ESS1-1, 2-LS2-1, 2-LS2-2, 2-LS4-1, 2-PS1-1, 2-PS1-4, 3-ESS2-1, 3-LS1-1, 3-PS2-1, 4-LS1-1,
  4-PS3-2, 4-PS3-4, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five).

## What the outline asked for, and where

- **How an acorn becomes a tree, and why you wait for seeds:** A17-5 (acorn to oak, 3-LS1-1),
  A17-10 (what a seed holds, a fair test, patience), A17-11 (real growth is slow; the root grows
  first; birds spread camphor berries), the Grove oak scenes (an oak lives for centuries).
- **Camphor trees (*kusunoki*) and old trees honoured at shrines:** A17-1 (evergreen, aromatic
  oil), A17-6 (the shimenawa rope, told as a custom with meaning that you only watch).
- **The 1950s countryside:** rice paddies (A17-1), forest cover (A17-5), telegram, crank
  telephone, letters by bus and train, hand pump (A17-2, 8, 12, 16).
- **Family words:** *obaa-chan* is taught (any older woman you love) in A17-1 reader; *onee-chan* (big sister) appears in the scenes but has no lesson. Also in
  reader: *arigatō* and *onegai shimasu* (A17-6).
- **Rainy season:** *tsuyu*, about June into July, in reader A17-7.
- Maths and science woven into the story: equal groups (lorry wheels, pickles, statues and
  flowers, seed rows), time intervals at the bus stop, sound and vibration, light and shadow,
  steam, friction, gravity, moonlight.

## Care notes kept

- Mrs Kusakabe's illness is never named. She "has a cold", rests, and is getting better; the
  telegram is a delay. Sprout says "a cold is a small illness that goes away"; reader says a
  cold is caused by a virus.
- Mei lost (A17-13) stays short: the sandal is not Mei's at once, and the lesson is "stay put,
  find a trusted grown-up".
- Jizo and the shrine: respect and no jokes; nobody climbs on them. The bow is narration only,
  never a choice, check or reward. The family bath is not described (sprout says "a bath at the
  back"; reader mentions steam, taught from the bath in general).
- Customs (shoes off at the genkan, hand pump, sliding shutters) are everyday life, not quaint.
  No generic "old Japan" mix: everything is 1950s.
- Moss in the Grove scenes: when the ending is `moss-sleeps`, both bands say plainly that Moss
  died ("his body stopped working and it will not start again"), then the comfort (the oak, the
  flower, remembering). The word "sleeps" is never used for death.
- No quotes from the film or either English dub, and no song lyrics. The original scenes
  already told those beats in the script's own words; these are new again.

## Original scenes not mapped

None. All 77 quest scenes and all 20 variants have a version in both bands.

## For Maor

- **Japanese adviser pass:** the new teaching lines about the shimenawa, Jizo, genkan, mugicha
  (barley tea) and the words *arigatō*, *onegai shimasu*, *obaa-chan* and *tsuyu* should go in the
  same adviser packet as the main page.
- **Facts worth a second pair of eyes:** forest is about two thirds of Japan; *tsuyu* runs about
  June into July and means "plum rain"; barley tea (mugicha) has no caffeine; telegrams were
  charged by length; the speed of sound is taken as 340 m/s; an oak often takes 20 to 50 years to
  make acorns.
- **Invented numbers in the edu lines** (not in the main script): the lorry has 3 wheels, 9 rain
  shutters, a bus due at 7:50 and arriving at 8:15, 12 nuts in the bundle, a 24 m camphor, 6 statues
  with 2 flowers each. The lorry and the six statues match the script ("three-wheeled lorry" and
  "six statues"); the rest are sums for the lesson and change nothing else.
- Sprout lines have the *Catbus* by name (as the script does); the great spirit is only ever "the
  great one" or "a great spirit". The licensed Ghibli designs are untouched.
- Some `done` scenes are only 3 to 4 lines, because the originals are 2 lines; I added one or two short lines
  and did not pad further.
