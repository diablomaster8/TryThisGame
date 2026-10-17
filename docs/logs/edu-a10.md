# Learning Grove: Atlas A10 "The Heart of the Island" (2026-10-17)

Files: `src/content/edu-a10-sprout.ts` (`EDU_A10_SPROUT`, `EDU_A10_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a10-reader.ts` (`EDU_A10_READER`, `EDU_A10_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a10` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (98 quest + 4 variants) | 102 | 102 |
| Lessons | 102 | 123 |
| maths | 19 | 17 |
| science | 21 | 31 |
| sel | 29 | 30 |
| literacy | 14 | 25 |
| social-studies | 14 | 18 |
| health | 3 | 0 |
| music | 1 | 0 |
| art | 1 | 2 |
| Think questions (no `best`) | 0 | 19 |
| Glossary entries | n/a | 23 |

## Standards used

- **Sprout:** K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, RF.K.2, RL.1.4, RL.2.3, RL.K.3, K-ESS2-1,
  K-ESS3-1, K-ESS3-3, K-LS1-1, 1-ESS1-1, 1-PS4-1, 1-PS4-2, 2-ESS1-1, 2-ESS2-2, D2.Civ.8.K-2,
  D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Approaches to Learning, Language and Communication, Literacy,
  Mathematics Development, Perceptual/Motor/Physical, Scientific Reasoning, Social and Emotional),
  CASEL (all five).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4.MD.A.2, 4.OA.C.5, L.3.4, L.4.5,
  RL.2.3, RL.2.4, RL.3.3, RL.3.6, RL.4.2, RL.4.3, 2-ESS1-1, 2-ESS2-2, 2-LS4-1, 3-ESS2-1, 3-LS1-1,
  3-LS4-3, 3-LS4-4, 3-PS2-1, 4-ESS2-1, 4-ESS2-2, 4-LS1-1, 4-PS3-2, 5-ESS1-2, K-ESS3-3, D2.Civ.8.K-2,
  D2.Eco.1.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five). Two reader lessons have no standard
  where none fits (food drying; spirals in art).

## The outline's four angles

- **Polynesian navigation (star compass, swells, birds):** A10-8 in full (stars and the 32-house
  compass, a fist as 10 degrees, swells and how islands bend them, terns and noddies at dusk, the
  green glow under a lagoon cloud, dead reckoning). Sprout has the same three clues in simple form.
  Also Maui's fishhook (Scorpius) in A10-6 and the steady star, Hokupaa, in A10-14.
- **Hokulea, 1976 voyage to Tahiti:** A10-8 done scene (Mau Piailug of Satawal), A10-14 bow scene
  (the name, 4,000 km, 34 days). Sprout has the voyage in the A10-14 bow scene and its wave variant.
- **Coral reefs:** A10-2 (reef and lagoon, polyps build reefs), A10-13 (bleaching and recovery in
  reader; clean clear water in sprout).
- **The Pacific on a map:** A10-1 (largest ocean), A10-14 (Polynesian Triangle in reader; biggest
  ocean in sprout).

## Original scenes not mapped

None. Every step scene, done scene, complete scene and all four variants (`a10-12-manta-wave`,
`a10-14-bow-wave`, `a10-14-complete-word`, `a10-14-complete-walk`) have a version in both bands.
Every choice keeps its id and `set`, so `a10-step` and `a10-approach` still work in both bands. No
sprout choice is dropped: all of A10's choices are kind and safe.

## Care notes kept

- Maui is shown as a revered figure; tattoo is described as sacred and personal in the reader band
  and never as something to copy; sprout says only that "pictures of great deeds" are on his skin.
- No chant, haka, prayer or Gramma's song is written out. No film lines, songs or titles.
- Death: Gramma Tala's death is plain in both bands ("her body stopped working"), with the manta and
  remembering straight after; "in her sleep" and "only resting" are changed. Tui's friend "died".

## For Maor

- Facts to have the Pacific advisers check: "lalo" and "tai" as Samoan word parts for Lalotai
  (reader, A10-9); the hongi and honi greeting names (A10-13); the tatau, ta moko, kakau trio
  (A10-6); waʻa kaulua and the 32-house Hawaiian star compass (A10-4, A10-8); Hokupaa as the
  Hawaiian name of the North Star and Hokulea as Arcturus (A10-14).
- Other facts rest on well-established sources: 1976 voyage about 4,000 km in 34 days, Mau
  Piailug navigating, Marshall Islands stick charts, coral polyps and bleaching, a fist as about
  10 degrees of sky, chickens' gizzard stones, the coconut crab, tropical cyclones forming over
  water of about 26.5 degrees Celsius or warmer.
- Reader lessons use `edu:balance:lean:hold` and `edu:write:kind-words`; sprout has 19 check strings
  (listed in each file's `CHECKS`). The wiring task should add them to the edu checks list.
- The `_VARIANTS` exports follow the S24 naming (`EDU_A10_SPROUT_VARIANTS`, `EDU_A10_READER_VARIANTS`).
