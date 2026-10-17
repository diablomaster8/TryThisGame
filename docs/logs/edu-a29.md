# Learning Grove: Atlas A29 "The Honmoon" (2026-10-17)

File: `src/content/edu-a29-reader.ts` (`EDU_A29_READER`, `EDU_A29_READER_VARIANTS`, `CHECKS`). It is
not registered yet: the wiring task adds it to `edu.ts` and `a29` to `eduPacks`.

**Reader band only. There is no sprout file**, because the outline says "for the reader band
only, softened". The demons "steal people's cheer"; there is no soul-eating anywhere, and the
film's word for the sealed Honmoon is never used ("sealed for good", "every colour").

## Counts

|                                 | reader                                     |
| ------------------------------- | ------------------------------------------ |
| Scenes (81 quest + 17 variants) | 98                                         |
| Lessons                         | 100                                        |
| science                         | 19                                         |
| sel                             | 33                                         |
| literacy                        | 23                                         |
| maths                           | 12                                         |
| social-studies                  | 13                                         |
| Kinds (ask / notice / do)       | 89 / 11 / 0                                |
| Think questions (no `best`)     | 18 (at least one in each of the 16 quests) |
| Glossary entries                | 21                                         |

Every original scene (every step scene, done scene, complete scene and all 17 variants) has a
version; every choice keeps its id and `set` (`a29-sleeve` on the three sleeve choices). The
Sable variants' `a29-sable` flag is set by the original scene, as `EduScene` has no scene-level
`set`. Every lesson has an approved standard, ids are unique, and the line caps hold (<= 30 words,
<= 160 characters, narration <= 2 sentences). No two lessons of the same domain are ever back to
back, checked over all 18 paths (Sable none/hid/heel, the three `a29-sleeve` paths, with and
without the Hazel margin note, and the Luna scene). Each quest has at least three domains and
a `sel` lesson. The file passes the brief's tsc and eslint commands and Prettier, with LF endings.

## Standards used

D2.Geo.2.K-2, D2.His.2.K-2, D2.Civ.8.K-2, CASEL (Self-awareness, Self-management, Social
awareness, Relationship skills, Responsible decision-making), 1-PS4-1, 1-PS4-2, 2-PS1-1,
2-PS1-4, 3-ESS2-1, 4-LS1-2, 4-PS3-2, 4-PS3-4, 5-ESS1-2, K-LS1-1, K-PS3-1, 1.OA.A.1, 2.OA.A.1,
3.MD.A.1, 3.OA.A.1, 3.OA.A.3, 3.OA.D.8, 4.MD.A.2, RF.K.2 (syllable blocks of hangul, nearest
code), RL.1.4, RL.2.3, RL.3.3, L.3.4, L.4.5.

## What it teaches (the outline list)

- Korea is a peninsula in East Asia, water on three sides; Seoul is its capital on the Han River
  (A29-1, A29-7).
- Hangul: made by King Sejong's scholars about 580 years ago so everyone could read; letters stack
  in syllable blocks (A29-3, at the noodle shop).
- The tiger and the magpie in Korean folk painting (minhwa): the magpie brings good news, the
  tiger is often silly, and the pictures show everyday wishes (A29-7, A29-16).
- Seoul places: the old city wall (more than 600 years, about 18 km; with a distance, speed and
  time sum), Namsan and its tower, the hanok (tiled roof, hanji doors, ondol, maru) (A29-4,
  A29-8, A29-12, A29-13).
- Everyone has something they think they should hide: A29-4 (gate), A29-6 (the sleeve think
  question), A29-12 to A29-14 and the A29-16 ending, in all three sleeve versions.
- Also: sound and vibration, echoes and foam, harmony, light and colour, rainbow, shadows, steam,
  seasonal rain (jangma), time intervals, equal groups and division, similes and metaphors, motive,
  voting and fair bargains, asking before sharing someone's private things.

## Care notes kept

Rumi's marks are never ugly or an illness, and nobody "fixes" them; Celine is afraid for Rumi and
is never the villain; the jeoseung saja are the serious messengers of old stories (death said
plainly: "after they die") and the demons only borrow their look; the gat is described with
respect; Derpy and Sussie are silly and bright, never menacing; Jinu's end is light, said
plainly ("Jinu is gone, and he will not come back"), with comfort straight after (A29-15
complete); Gwi-Ma is huge and slow; no one is hurt on screen; there are no lyrics, song titles
or lifted text.

## Original scenes I couldn't map

None.

## For Maor

- Lines I adapted from the main script rather than copied: the Gwi-Ma threat in A29-10 ("quiet the
  voices in your head"), Jinu's "the demon king kept the best part of me" (A29-8), and the
  "cheer" wording throughout.
- Facts to have a Korean adviser confirm: hangul dates (1443 made, 1446 announced, "about 580
  years ago"), "24 letters", ondol and maru descriptions, the "four hills" of old Seoul, jangma
  dates (late June into July), and that families hung tiger-and-magpie pictures at New Year.
- Invented story numbers (checked): 9 flights x 10 steps = 90; 3 bags x 4 costumes = 12; 60 bottles
  in packs of 12 = 5; 18 km at 3 km an hour = 6 hours; 30th to 18th = 12 places.
- The hangul lesson uses RF.K.2 as the nearest approved code; swap it if you prefer another.
