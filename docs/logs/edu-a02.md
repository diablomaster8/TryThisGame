# Learning Grove versions: A2 The Monkey and the Monk

Files: `src/content/edu-a02-sprout.ts` (`EDU_A02_SPROUT`, `EDU_A02_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a02-reader.ts` (`EDU_A02_READER`, `EDU_A02_READER_VARIANTS`, `CHECKS`). Each has 19
`EduQuest`s (`<band>:a02-01` to `a02-19`, `of` the original id) and 2 variant scenes
(`a02-15-which-monk`, `a02-19-complete-monk`). Not registered in `edu.ts` or `eduPacks` (wiring task).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (59 step, 27 done, 19 complete, 2 variants) | 107 | 107 |
| Lessons | 127 | 150 |
| maths | 27 | 22 |
| science | 24 | 41 |
| social-studies | 9 | 17 |
| sel | 47 | 42 |
| literacy | 12 | 24 |
| health | 6 | 2 |
| art | 1 | 2 |
| music | 1 | 0 |
| `do` checks | 34 | 3 |
| Glossary entries | none (sprout has none) | 25 |

Every original scene (step, done, complete, variant) has a version in each band; none unmapped.
Every quest has at least three domains and a `sel` lesson; every reader quest has at least one
think question (an `ask` with no `best`). No two maths lessons in a row. Choice ids and the
`a02-believed` sets (monkey, monk) are copied exactly in both bands; sprout keeps all choices, so no
`defaultChoice` is needed.

## Standards used

Sprout: ELOF (Approaches to Learning, Language and Communication, Literacy, Perceptual Motor and
Physical Development, Scientific Reasoning); CASEL (all five); K.CC.A.1, K.CC.B.4, K.CC.B.5, K.G.A.1,
K.G.A.2, K.MD.A.2, K.MD.B.3, K.OA.A.1; RF.K.2, RL.1.4, RL.2.3, RL.K.3; K-LS1-1, 1-ESS1-1, 1-PS4-1,
1-PS4-2, 2-ESS1-1, 2-LS2-1, 2-PS1-1; D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2.

Reader: CASEL (all five); 1.OA.A.1, 2.OA.A.1, 3.MD.A.1, 3.OA.A.1, 3.OA.A.3, 4.G.A.3, 4.MD.A.1,
4.MD.A.2, 4.OA.C.5; L.3.4, L.4.5, RL.3.3, RL.3.6, RL.4.2; 1-PS4-1, 1-PS4-2, 2-ESS1-1, 2-LS2-1,
2-LS2-2, 2-PS1-1, 2-PS1-4, 3-LS1-1, 3-LS4-3, 3-PS2-1, 4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2,
5-ESS1-2; D2.Geo.2.K-2, D2.His.2.K-2; ELOF: Approaches to Learning (shadow puppet).

## Outline angles covered

- Real Xuanzang and the Silk Road: A2-6 road (reader), A2-12 complete (his travel book), A2-16 ask
  (the real Flaming Mountains, Turpan), A2-18 road (reader and sprout), A2-18 scriptures (his
  translating), A2-19 home (Chang'an is Xi'an).
- Map-reading and compass: A2-1 hatch (four directions; reader turns clockwise), A2-6 (west, and
  morning shadows), A2-19 (east, sunrise shadows).
- Zodiac stories: A2-1 complete (the twelve animals, Monkey ninth), A2-7 (Dragon fifth, Horse
  seventh), A2-9 (the Pig twelfth), A2-7 complete (12-year cycle).
- Shadow-puppet theatre: A2-3 pine (reader: light, screen, shadow size), A2-19 complete (do: a hand
  monkey shadow, reader only).

## Care notes kept

Buddha and Guanyin wise, kind, never mocked; real religious facts (alms, bodhisattva, the Five
Elements, Lord Lao from Laozi) stated plainly and respectfully. Sprout softening: fights are taps
and puffs of dust; the guest-hall fire is a wrong by greedy people and everyone gets out; Monkey is
"stopped", not hurt, with a friend beside him; the White Bone Demon is a trickster and the bones a
chalky heap; Red Boy's fire is smoky and shivery. Reader keeps the original beats with one
reflective line in the think questions. No quote from any translation, film or comic.

## For Maor

- The reader notes call a li "about half a kilometre in modern use (old li varied)". 108,000 li
  (54,000 km) and 50,000 li (25,000 km) are compared with the Earth (about 40,000 km).
- Real-history claims to have the adviser glance at: Xuanzang left in 629 and returned in 645
  (16 years; the novel says 14), translated texts for the rest of his life, wrote a travel record;
  the Great Wild Goose Pagoda in Xi'an held his scrolls; he passed through the Turpan region.
- Invented sums are flagged with "suppose" in the lines (egg laps of 7 m, 4 rows of 6 beds, 5
  baskets of 12 fruits, 250 ml cups, 5 litre buckets, spiders with 9 m of thread). The only
  story-given numbers used are 3,600 trees (three equal groups of 1,200), 49 days, 800 li, 700
  robes, 5,048 rolls and 81 hardships.
- The sprout Pig fact is "twelfth and last" in the zodiac; the "Great Race" order is the common
  retelling, and versions vary, so the lines say "in the old race" and not "the" race.
- Sprout drops the novel's torn-open details (the bear's tummy stays a comic ache) but keeps every
  choice; the signature choice sets `a02-believed` in both bands.
- `CHECKS` exports are `edu:`-prefixed strings (sprout 34, reader 3) for the wiring task to
  register.
