# Learning Grove versions: A5 The Lion of Mali

Files: `src/content/edu-a05-sprout.ts` (`EDU_A05_SPROUT`, `EDU_A05_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a05-reader.ts` (`EDU_A05_READER`, `EDU_A05_READER_VARIANTS`, `CHECKS`). They are not
registered yet: the wiring task adds them to `edu.ts` and adds A5 to `eduPacks` in `content-check.ts`.
Each export is 14 `EduQuest`s (ids `sprout:a05-01` ... `reader:a05-14`, goals keyed by the original step ids).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (75 step/done/complete + 2 lullaby variants) | 77 | 77 |
| Lessons | 77 | 95 |
| maths | 17 | 13 |
| literacy | 11 | 28 |
| science | 14 | 18 |
| sel | 24 | 18 |
| social-studies | 7 | 14 |
| music | 4 | 4 |
| Think questions (ask, no `best`) | 0 | 14 (one per quest) |
| Glossary words | none | 19 |

Every original scene has a version in each band; every `id` is `<band>:<original id>`, every lesson id is
unique, and every line is within the cap (sprout at most 14 words, reader at most 30, all under 160
characters). Checked by script against `atlas-a05.ts`. `tsc` (the single-file command) and `eslint` print nothing.

## Standards used

- **Sprout:** ELOF Approaches to Learning, Language and Communication, Mathematics Development, Perceptual,
  Motor, and Physical Development, Scientific Reasoning, Social and Emotional Development; CASEL Relationship
  skills, Self-awareness, Self-management, Social awareness; K.CC.A.1, K.CC.B.5, K.CC.C.6, K.G.A.1, K.G.A.2,
  K.MD.B.3, K.OA.A.1, K.OA.A.2; RF.K.2, RL.1.4, RL.K.3, SL.K.1; K-LS1-1, K-2-ETS1-1, 1-ESS1-1, 1-PS4-1,
  1-PS4-2, 2-PS1-4; D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.
- **Reader:** CASEL Relationship skills, Responsible decision-making, Self-awareness, Self-management, Social
  awareness; 1.OA.A.1, 2.OA.A.1, 2.OA.C.3, 3.OA.A.3, 4.MD.A.1, 4.MD.A.2, 4.OA.C.5; L.3.4, L.4.5, RL.1.4, RL.2.3,
  RL.3.3, RL.3.6, RL.4.2; 1-ESS1-1, 1-PS4-1, 1-PS4-2, 2-LS4-1, 2-PS1-4, 3-5-ETS1-2, 3-ESS2-1, 3-LS4-3, 3-PS2-1,
  4-ESS2-2, 4-LS1-1, 4-LS1-2, 4-PS3-2, 4-PS3-4; D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.

The outline's angle is covered in both bands:

- the Mali Empire on a map (A5-1; West Africa, about 800 years ago, still told today);
- griots and oral history (A5-1, A5-4, A5-9, A5-10, A5-12, A5-14: memory tricks, tellings that differ, point of
  view, historians comparing sources, jeli families as a living tradition);
- the balafon and West African music (vibration and pitch, resonators, tempo, the Sosso-Bala in Niagassola);
- the Manden Charter at Kurukan Fuga, listed by UNESCO as intangible cultural heritage (A5-14);
- the later Mali of Mansa Musa and Timbuktu's libraries (reader only, A5-14 complete scenes).

Extras woven into the story: forging iron and forces, baobabs, owls, echoes, wori, the Sahel, wet and dry
seasons, money-style sums in Shells (A5-10 market, reader), time intervals and centuries.

## Hard things and care notes

- **Death.** The old king (A5-3) and Sogolon (A5-8) die, said plainly in both bands, with comfort straight
  after (stay close, crying is allowed, remembering). The "goes to sleep and doesn't wake" wording in the
  original is not used anywhere. The old rooster in A5-12 "died of old age".
- **Soumaoro** is never a monster: the sprout version has him as a grumpy king who loves music, and drops
  "I have killed kings for less". Battles are dust, horns and banners; the arrow at Kirina only brushes him.
- **Sprout choices.** None is cruel or bleak, so every choice keeps its id and `set` (including `a05-tune` and
  `a05-remember`), and no `defaultChoice` is needed.
- **Cultural care kept.** A living tradition (Kouyaté jeli families, the Sosso-Bala); tellings that differ are
  named; Sogolon is strong and the court is wrong to laugh; Fakoli is "traitor" or "hero" by point of view.
  Never "myth" as dismissal.
- Nubbins and animals never speak. No line is lifted from Niane's telling or Eisner's book; no song lyrics.

## Any original scene I couldn't map

None. All 75 scenes plus both lullaby variants are covered in each band.

## For Maor

- **Islam.** The script's care note leaves Islam off screen and asks advisers to judge whether a line belongs in
  the Learning Grove file. The reader band has one factual mention: Mansa Musa's "celebrated journey to Mecca"
  in `a05-14-complete` (and its lullaby variant). Cut it if the advisers prefer.
- **Facts to have the advisers confirm:** Wagadou as "the name the Soninke gave" (a05-07-wagadou); smithing and
  griotry as hereditary Mande crafts (a05-13-fakoli); the Sosso-Bala kept by Kouyaté families in Niagassola
  (a05-14-complete). Numbers such as "800 years" and "less than a hundred years after Sundiata" are rounded on purpose.
- **In-story sums.** A few sums use invented but plausible numbers (15 kg each apprentice, 3 km an hour,
  8 Shells a bunch, a 3 cm spur). They are labelled "say" or given in the question.
- **Sprout lesson `do` checks** (24 `edu:` strings, listed in `CHECKS`) need the engine's check handlers, such as
  `edu:act:breath:slow` and `edu:say:memory:one`, which are acted or spoken rather than tapped.
- **Compass facts** follow the script's own directions (west gate out, road west home). Sprout and reader only
  teach "the sun sets in the west" and "the opposite of west is east", so they stay true whatever the real
  map between Niani and Mema is.
