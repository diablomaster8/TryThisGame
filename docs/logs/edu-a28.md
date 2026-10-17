# Learning Grove: Atlas A28 "The Box of Stories" (2026-10-17)

Files: `src/content/edu-a28-sprout.ts` (`EDU_A28_SPROUT`, `EDU_A28_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a28-reader.ts` (`EDU_A28_READER`, `EDU_A28_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a28` to `eduPacks`. Both files
export a `CHECKS` array (the reader's is empty), so register them under different names.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (78 quest + 11 variants) | 89 | 89 |
| Lessons | 89 | 89 |
| science | 20 | 20 |
| sel | 20 | 20 |
| literacy | 20 | 20 |
| maths | 17 | 17 |
| social-studies | 12 | 12 |
| Kinds (ask / notice / do) | 65 / 10 / 14 | 89 / 0 / 0 |
| Think questions (no `best`) | 0 | 15 |
| Glossary entries | n/a | 28 |

Every scene has exactly one lesson, every lesson has an approved standard, lesson ids are unique,
and the 14 sprout `edu:` checks are all in `CHECKS`. Line caps hold (sprout <= 14 words, reader <=
30, all <= 160 characters, narration <= 2 sentences). Each quest uses at least three domains and
has a `sel` lesson, and each reader quest has a think question. No two lessons of the same domain
are ever back to back, across scenes and across quests, on the base path, with the margin note
inserted, and with each variant swapped in (checked by script). Each variant has the same domain
as the scene it replaces; the margin note (feelings) sits between a literacy scene and a science
scene. Both files pass the brief's tsc and eslint commands, Prettier, and have LF endings.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.2, 1.G.A.3, RF.K.2, RL.1.4,
  RL.2.4, RL.K.3, SL.K.1, 1-PS4-1, 2-PS1-1, 4-LS1-1, K-ESS3-1, D2.Civ.8.K-2, D2.Geo.2.K-2,
  D2.His.2.K-2, ELOF (Literacy, Mathematics Development, Scientific Reasoning, Social and Emotional
  Development), CASEL (Relationship skills, Responsible decision-making, Self-awareness,
  Self-management, Social awareness).
- **Reader:** 2.OA.A.1, 3.MD.A.1, 3.MD.C.7, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4.G.A.3, 4.MD.A.1,
  4.MD.A.2, 4.OA.C.5, L.3.4, L.4.5, RL.2.4, RL.3.3, RL.3.6, RL.4.2, 1-PS4-1, 2-LS2-2, 2-PS1-1,
  3-LS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, and the five CASEL
  codes above.

## What the outline's Learning Grove list became

- **Where Ghana is, and Jamaica:** a28-01-courtyard (Ghana in West Africa), a28-05-complete (forest
  south, savannah north), a28-08-open-done (the Atlantic between them), a28-11-yard (Jamaica, an
  island south of Cuba, Kingston).
- **Akan day names:** a28-02-road (Kwaku, Wednesday; Saturday is Kwame/Ama) and the Wisp variant
  (Kofi is Friday in reader; the days of the week in order in sprout), so both paths teach it.
- **Spider silk, and why it is sticky:** a28-02-climb (made in the body, from spinnerets),
  a28-05-web (orb webs have dry spokes and a sticky spiral), a28-06-doll-done (tree sap seals
  cuts, the sticky-things link).
- **Hornets and their nests:** a28-04-gourd-done (paper from chewed wood, colonies share work).
- **How stories travel and change:** a28-01-stool (why a teller opens that way, think question),
  a28-08-open (think question), a28-08-complete (oral tradition), a28-11-gum and a28-11-complete
  (two tellings, both right), a28-12-complete (a living tradition).

## Facts and sums checked

- Sums: 6 mats x 4 = 24 children (a28-01-stool-done), and half of 24 = 12 (a28-12-return-done); 2
  spiders x 8 legs = 16 socks; 3 rows x 4 = 12 elders; 3 m = 300 cm, 300 - 290 = 10 cm; 2 litres,
  half = 1 litre; 2/4 = 1/2; pit 3 m x 2 m = 6 square metres; thread 100 m, third knot at 75 m, 25 m
  left; 6:10 + 35 min = 6:45; 100 / 4 = 25 minutes; 12 kg / 2 = 6 kg; 7 + 9 + 10 = 26; pattern
  2, 4, 6, 8, 10; one of three equal parts = 1/3; 3 + 2 + 4 + 1 = 10.
- Akan day names: Mon Kwadwo, Tue Kwabena, Wed Kwaku, Thu Yaw, Fri Kofi, Sat Kwame, Sun Kwesi;
  Ama is a Saturday girl's name (the storyteller's placeholder name, Nana Ama, fits).
- The Gold Coast is the British name for the part of West Africa that is now Ghana. Kumasi was the
  Asante capital. The Golden Stool is the sacred symbol of the Asante nation.

## Care notes kept

- No lines from Rattray or any published telling: the storyteller's opening and closing and
  Ntikuma's idea use our own wording (the same replacements as the originals' `childLines`).
- Nyame is named respectfully as the Supreme Being of the Akan, never mocked. Every creature goes up
  alive. Ya Nsia is a guest. The funeral is warm and plain, and "died" is said plainly with comfort
  after (sprout: "Being sad is allowed. People stay close and share food.").
- The one sentence about enslaved people in the Jamaican yard is kept in both bands (sprout: people
  were taken by force, it was wrong, they kept their stories). Reader names the Gold Coast and
  enslavement plainly. Nothing is shown. No dialect spelling. No "tar baby"; the figure is a carved
  doll or "a little man of wood".
- Sprout keeps all three `a28-fairy` choices (the "leave her be" one is worded gently, no
  `defaultChoice` needed) and all other choice ids and `set` flags.

## Original scenes not mapped

None. All 78 step, done and complete scenes and all 11 variants have a version in each band.

## For Maor

- The two day-name lessons depend on the Akan advisers confirming the list above. The Jamaican
  elder's lines are still the placeholder plain-English ones from the script; the edu versions
  copy them, so Jamaican writers should check both files when they check Q11.
- The reader's a28-11-step lesson asks why Anancy mattered to enslaved people. It hedges ("storytellers
  often say") and is the one lesson I would ask the Jamaican advisers to read first.
- The sprout a28-11-step sentence about people being taken by force is deliberately short; a grown-up
  may want to read it ahead of the child.
- In the original, a28-12-tell-done always says the storyteller "taps her chin", even on the freed
  and sat paths. Both edu bands use generic lines there so they fit every path; the original could
  be fixed the same way.
