# Learning Grove: Atlas A23 "Remember Who You Are" (2026-10-17)

Files: `src/content/edu-a23-sprout.ts` (`EDU_A23_SPROUT`, `EDU_A23_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a23-reader.ts` (`EDU_A23_READER`, `EDU_A23_READER_VARIANTS`, `CHECKS`, which is
empty because the reader band has no `do` lessons). They are not registered yet: the wiring task
adds them to `edu.ts` and `a23` to `eduPacks`.

## Left out on purpose (audience `main`, no Learning Grove version)

- **A23-8 The Gorge:** `a23-08-rim`, `a23-08-rim-done`, `a23-08-zazu`, `a23-08-dust`,
  `a23-08-complete` (5 scenes).
- **A23-15 Home:** `a23-15-grey`, `a23-15-show`, `a23-15-show-done`, `a23-15-rock`,
  `a23-15-rock-done`, `a23-15-complete` (6 scenes).
- Because A23-8 is missing, `a23-09-chase` carries the bridge: it says once, plainly and gently,
  that Mufasa died in the gorge, that Scar told Simba it was his fault, and that this was not
  true. The fall itself is never told. Scar's end is never mentioned (A23-16 opens with the
  first rain, "the hard times are over").

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (64 quest + 19 variants) | 83 | 83 |
| Lessons | 83 | 101 |
| sel | 23 | 27 |
| science | 18 | 25 |
| maths | 14 | 15 |
| literacy | 10 | 21 |
| social-studies | 6 | 8 |
| music | 5 | 4 |
| art | 4 | 0 |
| health | 3 | 1 |
| Kinds (ask / notice / do) | 53 / 13 / 17 | 82 / 19 / 0 |
| Think questions (no `best`) | 0 | 16 |
| Glossary entries | n/a | 28 |

Every scene has a lesson, every lesson has an approved standard, lesson ids are unique, and every
`edu:` check is listed in `CHECKS`. Line caps hold (sprout ≤ 14 words, reader ≤ 30, all ≤ 160
characters), and no narration line has more than two sentences. Each quest has at least three
domains and a `sel` lesson, and each reader quest has a think question. Choice ids and the
`a23-path` flags are copied exactly, so no `defaultChoice` is used. Both files pass the brief's
tsc, eslint and Prettier checks.

No two lessons of the same domain are adjacent, checked across the whole play order on both the
Simba path and the Rafiki path (a script flattened every scene in play order for each path).

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.MD.B.3, K.OA.A.1, RF.K.2, RL.1.4,
  RL.2.3, RL.K.3, 1-ESS1-1, 1-LS1-2, 1-LS3-1, 1-PS4-1, 2-LS2-1, 2-PS1-1, 4-LS1-1, K-ESS3-1,
  K-LS1-1, K-PS3-1, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Approaches to Learning,
  Language and Communication, Perceptual/Motor/Physical, Scientific Reasoning, Social and
  Emotional), CASEL (all five: Self-awareness, Self-management, Social awareness, Relationship
  skills, Responsible decision-making).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4.MD.A.1, 4.MD.A.2, L.2.4, L.3.4,
  L.4.5, RL.2.4, RL.3.3, RL.3.6, RL.4.2, 1-ESS1-2, 1-LS3-1, 1-PS4-1, 1-PS4-2, 2-LS2-1, 2-LS4-1,
  2-PS1-1, 2-PS1-4, 3-ESS2-1, 3-LS1-1, 3-LS2-1, 3-PS2-1, 4-LS1-1, 5-ESS1-2, K-ESS3-1, K-ESS3-3,
  D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five).

## What the outline asked for, and where

- **Swahili words** (simba, rafiki, twiga, asante, nyota, mvua, polepole; plus karibu, pole
  sana, and hakuna matata only as an everyday phrase, worked out word by word): sprout
  `a23-01-complete`, `a23-01-page`, `a23-01-gathering`, `a23-02-paints-done`, `a23-07-complete`,
  `a23-16-rain`; reader `a23-01-page`, `a23-02-paints-done`, `a23-07-stars`, `a23-11-oasis`,
  `a23-16-rain`, `a23-10-desert-done-rafiki`.
- **How a lion pride lives, lionesses hunt together:** reader `a23-11-grubs-rafiki`; cubs and
  parents in both bands at `a23-01-presentation`.
- **The Great Migration** (Serengeti and Maasai Mara): reader `a23-05-chase`; echoed at
  `a23-11-oasis-rafiki`.
- **Dry season and rains:** sprout and reader `a23-16-rain`, `a23-16-roar-done`; drought at
  `a23-12-talk`, `a23-11-oasis-rafiki`.
- **Why every animal on the plain matters:** reader `a23-03-light` (food chain and decomposers)
  and `a23-16-green` (everything linked). Sprout carries the simple versions (shade, zebra
  stripes, warthog, thorns).
- Also taught: day and night near the equator, the Sun rising in the east, echoes, thermals,
  hyenas as hunters (a fair picture of them), the elephant graveyard as a myth, ochre as paint,
  time intervals and unit sums, and feelings: patience, secrets, fear, grief, blame, belonging.

## Care notes kept

- The land is made up; the outline's Hell's Gate National Park is named in the reader only, and
  the film's name is never used.
- No lifted line is used. Mufasa's three quoted lines are replaced by the script's own
  `childLines` words (stars) or are not used at all (clouds, "be brave when you have to be").
- Rafiki stays a dry, kind elder with a craft (paint, water, sitting beside people), not a comic
  healer. Hyenas are comic menace in sprout and are treated fairly as real animals in reader.
- Hazel is never named in the cloud scene; the margin note keeps its "H" and is paraphrased
  (`a23-margin-hazel`), not copied from S24.
- Sprout never says death is sleeping or going away. "Gone" is used only for the lost-but-alive
  Simba.

## For Maor

- **Swahili adviser:** please have a Kenyan or Tanzanian speaker check karibu (also "near"),
  polepole, twiga, asante (and asante sana), nyota, mvua, pole sana, and the word-by-word
  reading of hakuna matata (hakuna "there is no", matata "troubles"). Reader says it is an
  everyday phrase; nothing sells it.
- **Facts to double-check before ship:** more than a million wildebeest on the Great Migration;
  East Africa's long rains (about March to May) and short rains (about October to December);
  Hell's Gate has red cliffs and steam rising from cracks (it has geothermal vents); ochre use
  for tens of thousands of years; spotted hyenas hunting much of their own food and clans led by
  females; giraffe tongue nearly half a metre; day length near the equator close to 12 hours.
- **A23-9 is the only place the death is said.** Because A23-8 has no Learning Grove version,
  `a23-09-chase` says Mufasa died in both bands. Please confirm you are happy with that wording
  (sprout: "his body stopped working; it cannot start again").
- **Health standards:** there is no approved health code, so the three sprout and one reader
  health lessons use `ELOF: Perceptual, Motor, and Physical Development` or
  `CASEL: Responsible decision-making`. Sprout art lessons use `ELOF: Approaches to Learning`.
  Say if you want other codes.
- **Hazel margin note:** if S24's edu note wording is later fixed, `a23-margin-hazel` may want
  to match it.
