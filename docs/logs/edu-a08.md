# Learning Grove: A8 "The Twelve Tasks" (2026-10-17)

Files: `src/content/edu-a08-sprout.ts` (`EDU_A08_SPROUT`, `EDU_A08_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a08-reader.ts` (`EDU_A08_READER`, `EDU_A08_READER_VARIANTS`, `CHECKS`). Not
registered yet: the wiring task adds them to `edu.ts` and `a08` to `eduPacks`. Fourteen quests
(`a08-01` to `a08-14`) per band, `of` = the quest id.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (65 quest + 3 variants) | 68 | 68 |
| Lessons | 70 | 77 |
| maths | 21 | 21 |
| literacy | 17 | 16 |
| sel | 15 | 18 |
| science | 9 | 10 |
| social-studies | 5 | 11 |
| music / art / health | 1 / 1 / 1 | 0 / 0 / 1 |
| Glossary entries | – | 28 |

Maths is high because the outline asks for Roman numerals I to XII, one per task, in each complete
scene. No two maths lessons sit in the same scene; every quest has at least three domains and a
`sel` lesson. Every reader quest has a think question (an `ask` with no `best`).

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.K.3,
  1-PS4-1, 1-PS4-2, K-ESS3-3, K-2-ETS1-1, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Approaches
  to Learning; Language and Communication; Literacy; Mathematics Development; Perceptual, Motor, and
  Physical Development; Scientific Reasoning; Social and Emotional Development), CASEL (Relationship
  skills, Self-awareness, Self-management, Social awareness). Several numeral notices have no standard.
- **Reader:** 2.OA.A.1, 3.OA.A.3, 3.OA.D.8, 3.NF.A.1, 3.MD.A.1, 4.MD.A.1, 4.MD.A.2, 4.OA.C.5,
  L.3.4, L.4.5, RL.3.3, RL.3.6, RL.4.2, RL.4.3, 2-ESS1-1, 3-PS2-1, 3-5-ETS1-2, 4-LS1-2, 4-PS3-2,
  D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, CASEL (Relationship skills, Responsible decision-making,
  Self-awareness, Self-management, Social awareness). Some notices (I, II, III, mist) have none.

The outline's five angles are all in: Roman Gaul on a map (A8-1 map lesson, A8-7 Belgae); Latin
phrases (salve, vale, gratias, aqua, amicus, unus/duo/tres, with English words from them); Roman
numerals I to XII (the complete scenes of A8-1 to A8-13, with the IV/IX subtraction rule in the
reader band); the Olympic Games' Greek origins (A8-2, with "stadium" from the Greek stadion);
what a bureaucracy is, gently (A8-9, door and form scenes). Extras: floating, gravity, aqueducts,
stalactites, mist, the eye in dim light, the Roman legion and centuries, unit prices, fractions.

## Choices, care notes, hard things

- Every choice keeps its original id and `set` in both bands, so `a08-form` (loop / boar / plain)
  still works and picks the right Banquet variant. No sprout `defaultChoice` was needed: none of
  A8's choices is cruel or bleak.
- Care notes kept: the champions are proud and good losers, no accents or jokes about looks, faith or
  history; the Isle is cakes and cushions; the Beast is only scared; Obelix fells no living tree; no
  song is sung; nobody is hurt. The reader band notes honestly that the real Circus Maximus was a
  chariot track and that lion shows belong to other arenas (the Colosseum, built long after Caesar).
- No lines from the film or books. Source names appear only as speaker ids.

## Original scenes not mapped

None. All 65 scenes (step, done and complete) and the 3 variants (`a08-14-bard-loop`,
`a08-14-bard-boar`, `a08-14-useful`) have a version in each band.

## For Maor

- Facts worth a glance: the Olympic dates (776 BC traditional, revived 1896), "about 6 °C colder per
  1,000 m", a legion of about five thousand with centuries of about eighty, the Colosseum's date.
- The numeral "V as an open hand" and "X as two Vs" are offered as ideas ("some people think"), not
  as settled facts.
- The `edu:` checks are the standard shape; the engine needs no new check types.
