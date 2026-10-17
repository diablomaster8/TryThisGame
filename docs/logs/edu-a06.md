# Learning Grove versions of A6 Seven Voyages (`a06`)

Files: `src/content/edu-a06-sprout.ts` (`EDU_A06_SPROUT`, `EDU_A06_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a06-reader.ts` (`EDU_A06_READER`, `EDU_A06_READER_VARIANTS`, `CHECKS`). Not yet
registered in `edu.ts` or `eduPacks` (the wiring task does that).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Quests | 16 | 16 |
| Scenes (45 step, 34 done, 16 complete, 7 variants) | 103 | 103 |
| Lessons, quest scenes only | 96 | 118 |
| Lessons, variants | 7 | 7 |
| Think questions (ask, no `best`) | none (sprout asks always teach) | 17 (one or more per quest) |
| Glossary entries | none | 64 (4 per quest) |

Lessons by domain, quest scenes only (variants add 1 each):

| Domain | sprout | reader |
| --- | --- | --- |
| maths | 19 | 18 |
| science | 22 | 31 |
| literacy | 18 | 21 |
| social-studies | 8 | 11 |
| sel | 28 | 37 |
| art | 1 | 0 |

Every quest uses at least three domains and has at least one `sel` lesson, in both bands.

## Standards used

- Sprout: ELOF (Approaches to Learning, Language and Communication, Literacy, Social and Emotional
  Development); CASEL (all five); K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, K.MD.B.3; RF.K.2,
  RL.K.3, RL.1.4, RL.2.4, SL.K.1; NGSS 1-ESS1-1, 1-LS1-2, 1-PS4-2, 2-LS2-1, 2-PS1-1, K-ESS2-1,
  K-ESS3-1, K-ESS3-3, K-LS1-1; C3 D2.Civ.8, D2.Eco.1, D2.Geo.2, D2.His.2.
- Reader: CASEL (all five); 2.MD.D.10, 2.OA.A.1, 3.MD.A.1, 3.MD.D.8, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3,
  3.OA.D.8, 4.G.A.3, 4.MD.A.1, 4.MD.A.2; L.3.4, L.4.5, RL.1.4, RL.2.3, RL.3.3, RL.3.6, RL.4.2; NGSS
  1-LS1-2, 1-LS3-1, 1-PS4-2, 2-ESS2-2, 2-LS2-1, 2-LS4-1, 2-PS1-1, 3-ESS2-1, 3-LS2-1, 3-LS4-3,
  3-LS4-4, 3-PS2-1, 4-ESS2-1, 4-ESS2-2, 4-LS1-1, 4-LS1-2, 4-PS3-2, 5-ESS1-2; C3 D2.Civ.8, D2.His.2.
- Lessons with no fitting code leave `standard` out (one sprout science lesson on rivers).

## What each band teaches (the outline's list, blended into the story)

- Monsoon winds and dhows: A6-2 (triangular sail, sewn planks), A6-13 (why the monsoon reverses, in
  reader; sprout: wind changes direction), A6-15 (sails and wind direction).
- Abbasid House of Wisdom: A6-1 (paper from China, scholars, translating), A6-13 (translation, numbers
  from India), A6-16 (oral storytelling).
- Trade routes on a map: A6-11 (Serendib is Sri Lanka, Basra to Serendib by sea), A6-8 (compass
  directions), A6-12 (cinnamon, trade and letters), A6-13 (5,000 km at 100 km a day = 50 days).
- How stories travel between cultures: A6-5 (the valley legend told in many lands), A6-16 (Persian
  frame, Arabic, French, English; whose story is it).
- Elephants' memory and conservation: A6-14 (herds led by the oldest female, real elephants and the
  bones of their dead, long memories, ivory trade bans, rangers and reserves).

## Hard things and care notes kept

- A6-8: Sinbad's wife's death is said plainly ("died") with comfort straight after. The custom is
  "a hard rule" that sends him alone into a cave, as in the original's `childLines`; nothing in the
  cave is described.
- A6-13: pirates and capture said once. Sprout uses the original `childLines` (carried far away, made
  to work, not allowed to leave). Reader adds a notice naming slavery as real, unjust and illegal today.
- A6-6: the giant is a sleepy fairy-tale threat; the pepper plan harms nobody. A6-7, A6-9, A6-10: no
  one is eaten or hurt (the serpent only circles, the chick is fine, the Old Man is left sulking).
- A6-14: no elephant is shot or hurt; no ivory is a prize, decoration or item in either band or branch.
- The four faiths on Sri Pada are named equally and briefly in the reader band (the farmer's "some
  say"). Sprout says only that people believe different things and share the steps.
- Baghdad is shown as a city of learning; Harun al-Rashid speaks only in A6-13 and is dry and
  dignified. Hazel's margin note (`a06-margin-hazel`) is paraphrased in sprout and kept in reader.
- No quotes from any text; every line is original.

## Original scenes I could not map

None. All 103 original scenes (45 step scenes, 34 done scenes, 16 complete scenes, 7 variants) have
a version in each band. Choice ids and `set` flags match the original exactly in both bands (checked by
script): `a06-stone` (taken or left) and `a06-ivory` (told or kept) still work in sprout.

## Checks run

- `tsc` (single-file strict command) and `eslint` on both files: no output.
- A script checked: every original scene id has a version in each band; lesson ids are unique; every
  scene has at least one lesson (sprout at most two); line caps (sprout 14 words, reader 30); choice
  ids and `set`; goal keys match the original step ids; every `do` check is in `CHECKS`.
- Sprout uses a `fit` helper inside `sc` that splits any line over 14 words at a sentence break and
  shifts the lesson `after` index to match, so authored lines may be longer than they play.

## For Maor

- The scratchpad is shared by parallel agents. Two of my early scratch files were overwritten by
  another agent's work and rewritten. Nothing in the repo was touched except my two files and this log.
- Facts worth a quick adult check: Basra to Serendib "about 5,000 km" and "100 km a day" (round
  teaching numbers); "40 km a day for 11 days" for the Basra to Baghdad road in the `kept` variant;
  the monsoon explanation in A6-13 (land and sea heat at different rates); "real elephants have no
  secret graveyard but do investigate bones" (A6-14, reader).
- The Arab, Persian and Sri Lankan adviser sign-off listed in `atlas-a06.ts` still applies to these
  versions (names, dress, the round city, the House of Wisdom, the faiths on Sri Pada, how slavery is
  mentioned in A6-13).
- Two sprout lesson `do` checks and nine reader ones are new check strings; the content-check tool
  will need them registered when the wiring task adds the `a06` pack.
