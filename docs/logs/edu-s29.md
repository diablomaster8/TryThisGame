# Learning Grove: S29 The Gates of Dawn (sprout and reader)

Files: `src/content/edu-s29-sprout.ts` (`EDU_S29_SPROUT`, `EDU_S29_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s29-reader.ts` (`EDU_S29_READER`, `EDU_S29_READER_VARIANTS`, `CHECKS`). Not yet
registered in `edu.ts` or `eduPacks`; that's the wiring task.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes | 40 (30 in the quest + 10 variants) | 40 (30 + 10) |
| Lessons | 42 | 59 |
| science | 12 | 25 |
| sel | 13 | 16 |
| maths | 9 | 4 |
| literacy | 2 | 7 |
| social-studies | 3 | 3 |
| health | 2 | 3 |
| art | 1 | 1 |
| Glossary | none | 24 words |

Every original scene is mapped in both bands: 15 step scenes, 14 done scenes, `s29-complete` and the
10 variants (`kitchen-after`, `low-river-full`, `supper-walk`, `night-ribbon`, `night-bell`,
`ford-ribbon`, `ford-bell`, `complete-sat`, `complete-pencil`, `brock-knock`). There were no
scenes I couldn't map.

Edu checks: sprout `edu:tap:boat:bow`, `edu:clap:pattern:in-pull-out`, `edu:count:aloud:10`,
`edu:hold:still:ford`, `edu:count:strokes:5`. Reader: `edu:label:river-map:5`, `edu:draw:map:river`.

## Standards used

- **Sprout:** ELOF (Approaches to Learning; Mathematics Development; Perceptual, Motor, and
  Physical Development; Scientific Reasoning; Social and Emotional Development), CASEL
  (Relationship skills, Responsible decision-making, Self-management, Social awareness),
  D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, K-ESS3-1, K-ESS3-3, K.CC.A.1, K.CC.B.4, K.CC.B.5,
  K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.1, RL.K.3.
- **Reader:** 1-ESS1-1, 1-ESS1-2, 1-PS4-1, 1-PS4-2, 2-ESS2-2, 2-ESS2-3, 2-PS1-1, 2-PS1-4, 3-LS4-4,
  3-PS2-1, 3.MD.A.1, 3.OA.A.3, 4-ESS1-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 4.MD.A.1, 4.OA.C.5, CASEL
  (all five), D2.Geo.2.K-2, D2.His.2.K-2, K-ESS3-3, L.3.4, L.4.5, RL.2.3, RL.2.4, RL.3.3.
- The two water-safety ask lessons in reader (vests and never alone; someone on shore) have no
  standard because none on the list fits.

## What it teaches

The outline's angle: rivers (bow and stern, backwater, weir, island, ford, source to mouth, a
labelled river map), otters (fur, whiskers, webbed feet, not feeding wild animals, litter, and
otters' return to English rivers once pesticides were banned), water safety (cork vests,
sitting still, never on the water alone, someone on shore knows the plan, stay put when lost),
and homesickness and grief (naming it, staying with a friend, keeping a loved one's basket,
happy memories). Plus frost, rock layers, swallows migrating, sound, light, friction and rollers,
charcoal, and similes. Reader think questions: `lessons-done`, `turnback`, `island`, `packing`.

## Choices and hard things

- Reader keeps every choice. Sprout keeps all three gifts. In `s29-packing` it leaves out `held`
  (holding Marina by both arms while she says "let go"), with `defaultChoice: 'sat'`.
  `sprout:s29-complete` (the `held` ending) is still written, gently.
- Fossil is named only from `s29-supper`. Her death is said plainly ("Her body stopped working.
  It won't start again.") with comfort straight after. The `kitchen-after` variant doesn't name
  her.
- **The Lantern Song.** Its second line ("in their sleeping eyes") pictures the dead as sleeping,
  which EDU-STYLE rules out. Sprout narrates the verse instead of singing it. Reader sings only
  the last two lines (here / year), which also carry the rhyme lesson.
- No Grahame text: the lifted lines use the source's `childLines` or new words. The four
  [unverified] Chapter V/VII beats are paraphrased afresh. Canon: no Moss, no Linnet, Dusty is
  they/them, the otters and Nubbins never speak, and the island stays unexplained (the lessons
  there are the sunrise and mixed feelings, never what was on it).

## For Maor

1. **The otter father may be inaccurate.** In real Eurasian otters the mother raises the cubs
   alone; dog otters take no part. The main script's "old otter… and his kit" waiting at the
   ford is lovely, but it isn't typical behaviour. The edu versions keep the story but teach
   nothing about otter fathers. If you want it accurate, make the old otter a mother: about
   six pronoun changes in `side-stories-s29.ts` and in these two files.
2. **The ribbon in `s29-night-ribbon` points the wrong way.** A ribbon snagged on a reed trails
   downstream, so it can't point "upstream like a finger" as the main scene says. Reader turns
   this into a currents lesson with the right answer. Worth a one-line fix in the main script.
3. **Sleep and the Lantern Song.** Confirm that leaving out the "sleeping eyes" line in the
   Learning Grove is fine. It may come up wherever else the edu versions use the song.
4. Not run: the full `content-check.ts`, which doesn't see these files until the wiring task
   registers them. I ran a scratch copy of its edu rules on both files (coverage, ids, choices,
   `after` ranges, standards, quotes, line caps, pronouns): no problems.
