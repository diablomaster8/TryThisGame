# Learning Grove: A12 "The Mirror Shard" (2026-10-17)

Files: `src/content/edu-a12-sprout.ts` (`EDU_A12_SPROUT`, `EDU_A12_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a12-reader.ts` (`EDU_A12_READER`, `EDU_A12_READER_VARIANTS`, `CHECKS`). Not
registered yet: the wiring task adds them to `edu.ts` and `a12` to `eduPacks`. Eighteen quests
(`a12-01` to `a12-18`) per band, `of` = the quest id. The sprout file was started by an earlier
writer; this pass checked it, found it complete and clean, and left it unchanged. The reader file
uses the same builders.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (118 quest + 12 variants) | 130 | 130 |
| Lessons | 130 | 157 |
| science | 37 | 45 |
| sel | 37 | 45 |
| literacy | 16 | 29 |
| maths | 22 | 19 |
| social-studies | 6 | 9 |
| health | 8 | 9 |
| music / art | 3 / 1 | 1 / 0 |
| Glossary entries | – | 37 |

Every quest in both bands has at least three domains and a `sel` lesson; every reader quest has a
think question (an `ask` with no `best`). Lesson ids are unique, and every lesson's `after` is in
range. Line caps hold: no sprout line over 14 words, no reader line over 30, none over 160 characters.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.2, RF.K.2, RL.K.3,
  RL.1.4, RL.2.3, RL.2.4, K-LS1-1, K-ESS2-1, K-ESS3-1, 1-ESS1-1, 1-PS4-1, 1-PS4-2, 2-ESS2-3, 2-PS1-4,
  4-LS1-1, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, ELOF (Language and Communication; Literacy;
  Mathematics Development; Perceptual, Motor, and Physical Development; Scientific Reasoning; Social
  and Emotional Development), CASEL (all five).
- **Reader:** 1.OA.A.1, 1.MD.B.3, 3.OA.A.1, 3.OA.A.3, 3.NF.A.1, 3.MD.A.1, 4.G.A.3, 4.MD.A.1,
  4.MD.A.2, RF.K.2, RL.K.3, RL.1.4, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.2.4, L.3.4, L.4.5, K-ESS2-1,
  K-ESS3-1, K-PS3-1, 1-ESS1-1, 1-ESS1-2, 1-PS4-1, 1-PS4-2, 2-ESS1-1, 2-ESS2-2, 2-ESS2-3, 2-LS2-1,
  2-PS1-1, 2-PS1-4, 3-LS1-1, 3-LS2-1, 3-PS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, D2.Eco.1.K-2,
  D2.Geo.2.K-2, D2.His.2.K-2, CASEL (all five). A few notices have none (northern lights, dried
  fish, fire, tessellating shapes, warming cold hands, rereading).

The outline's angles are all in: Denmark on the map and Hans Christian Andersen (A12-1); six-armed
snowflakes and their six lines of symmetry (A12-3); how frost forms and grows (A12-2), breath in
cold air (A12-14); the northern lights (A12-10), polar night (A12-13), the midnight sun (A12-17),
the Arctic Circle and the Pole Star; the Sámi today (A12-11, A12-17: Sápmi across Norway, Sweden,
Finland and Russia, reindeer herding as a living job, several Sámi languages, Sámi National Day);
and the seasons turning on Gerda's road (A12-2, 5, 6, 17, 18, and the closing round-the-year note).

## Choices, care notes, hard things

- Every choice keeps its original id and `set` in both bands, so `a12-nubbin` (no / night) still
  picks the A12-10, A12-17 and A12-18 variants. No `defaultChoice` was needed: all of A12's choices
  are kind and safe, and the signature choice frames both answers as honest.
- Care notes kept: always "the Sámi woman" and "the Finnish woman", never "Lapp"; the Sámi woman is a
  practical, warm host with no magic; the Finnish woman casts no spells; no gákti, drum or sacred item
  is described; Bae is "Bae". Gerda's prayer and Grandmother's Bible are narrated, never quoted or
  commented on; the rose hymn is only hummed. The old robber woman makes no threats, the knife stays
  in the wall (a health lesson says knives are for grown-ups), and no kiss is offered to the player.
- The raven's death is said plainly in both bands ("his body stopped working"), with comfort straight
  after (a long, good life; the black thread to remember him; a grief lesson). The town's "he's dead"
  about Kay is explained in the reader band and answered by Gerda's hope.
- No lifted text: none of the outline's eight passages appears, nor "Mirror of Understanding" beyond
  its use as a name. The reader band reuses the script's own (original) lines, simplified.
- Small reader additions to carry lessons: the clock "strikes ten" (A12-1), sums for the boat's
  drift, sugar plums, loaf quarters, berry bunches (six of five, so the wait choice now says
  "Thirty again"), the walk across the hall, and the four-to-ten wait. The Snow Queen's "end of him"
  line is cut from the reader's A12-4.

## Original scenes not mapped

None. All 118 quest scenes (step, done and complete) and the 12 variants have a version in each band.

## For Maor

- **For the Sámi adviser:** the Sámi facts in A12-11 and A12-17 (Sápmi in four countries; several
  languages, North Sámi the most widely spoken and taught in schools; herders using snowmobiles as
  well as skis; most Sámi in other jobs; Sámi National Day on 6 February with the flag). Also the
  line defining Lapland as the far north of Norway, Sweden and Finland, and whether "the Finnish
  woman" stays as her name.
- **Facts worth a glance:** Andersen born 1805 in Odense, *The Snow Queen* 1844; Denmark's only land
  border is Germany; swallows winter in Africa; reindeer are the only deer whose females grow antlers;
  Spitsbergen is part of Svalbard (Norway); Etna and Vesuvius named as the "black pots" (the script's
  notes allow it).
- The reader band keeps the Snow Queen's two forehead kisses as cold touches; the sprout band turns
  them into a wrap in the fur. Say if you want the reader to match the sprout.
