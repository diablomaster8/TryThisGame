# Learning Grove: S30 What Sad Is For (2026-10-16)

Files: `src/content/edu-s30-sprout.ts` (`EDU_S30_SPROUT`, `EDU_S30_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s30-reader.ts` (`EDU_S30_READER`, `EDU_S30_READER_VARIANTS`, `CHECKS`). Not yet
registered in `edu.ts` or `eduPacks` (the wiring task does that).

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes | 41 (29 quest + 12 variants) | 41 (29 quest + 12 variants) |
| Lessons | 43 | 52 |
| sel | 13 | 13 |
| maths | 12 | 9 |
| science | 10 | 11 |
| literacy | 3 | 13 |
| health | 2 | 2 |
| art | 2 | 2 |
| social-studies | 1 | 2 |
| Glossary | none (sprout) | 27 words |

Every original scene has a version in both bands: the 14 step scenes, 14 done scenes, the complete
scene, the 8 flag variants (`-s1`, `-s5`, `-youngest`, `-helped`) and the 4 afterwards talk scenes.
Lesson ids are unique, every `after` is in range, sprout lines are at most 14 words and reader
lines at most 30, and every line is under 160 characters. Both bands keep all choices
(`tell`/`watch`; `broke`/`sat`/`helped`), so neither needs a `defaultChoice`.

## Standards used

- **Sprout:** ELOF Social and Emotional Development, ELOF Scientific Reasoning, ELOF Mathematics
  Development, ELOF Perceptual, Motor, and Physical Development; CASEL Relationship skills,
  Self-management, Social awareness; K.CC.B.4, K.CC.B.5, K.CC.C.6, K.OA.A.1, K.G.A.1, K.G.A.2,
  K.MD.B.3; RF.K.2, RL.K.3; 1-PS4-1, K-ESS2-2, K-ESS2-1, 1-ESS1-1, 2-ESS2-3; D2.His.2.K-2.
- **Reader:** L.4.5, L.3.4, RL.2.3, RL.3.3, RL.4.2; 2.MD.D.10, 3.NF.A.1, 3.MD.A.1, 3.MD.B.3,
  4.MD.A.1, 4.MD.A.2, 4.OA.C.5, 1.G.A.3; 2-LS2-2, 2-ESS2-2, 2-ESS2-3, 1-ESS1-1, 1-ESS1-2,
  1-PS4-1, 3-LS1-1, 3-PS2-1, 4-ESS1-1, 4-PS3-2, 3-5-ETS1-2; D2.His.2.K-2; CASEL Self-awareness,
  Social awareness, Relationship skills. Health and art lessons carry no standard.
- **Think question (reader):** `reader:s30-path-l2`. Why does Dimple smile all day but not alone
  on the hill? It has four options, none marked best, and every reply honours the child's reason.
  The closing "which mark for today?" (`s30-complete`) is also open.

## Unmapped scenes

None.

## For Maor

- **Quotes.** The two lifted film lines are not used. In their place are original lines built
  from the quest's own `childLines`. Dusty's "I'm okay now" is never used, in any form.
- **Fossil's death** is said plainly once per band (sprout `s30-smile`, reader `s30-smile`), with
  her flower and the remembering straight after. Moss's White Year becomes "a very long, cold
  winter" in sprout, where some Nubbins died and Hush sat with them so they weren't alone.
- **Ember's "after Ash"** is changed to "for a whole year, once". I couldn't confirm from canon
  that Ash faded, so the line no longer implies it either way.
- **Hazel** is only spoken of in the past tense, as in the original; nothing says where she is.
- **Short talk scenes.** I padded the reader versions of the four afterwards talk scenes and
  `s30-hollow-youngest` to 6 lines to meet EDU-STYLE's 6–16 range. The new lines are small,
  original and flag-free: Dusty's striped pebble, Byte's twice-drawn column, Sparks's boiled egg.
- **New `edu:` checks** need sim support: sprout `edu:count:toys:4`, `edu:hum:hand-on-throat`,
  `edu:tap:shape:ring-with-line`, `edu:place:blanket:over-door`, `edu:order:toys:reel-cone-peg`,
  `edu:wait:breathe:3`, `edu:pull:rope:hand-over-hand`, `edu:draw:shape:ring-with-line`,
  `edu:sort:balls:gold-blue-both` and `edu:sit:still:count-10`; reader
  `edu:chart:bar:dimple-ball`, `edu:tally:five-things:0-of-5`, `edu:breathe:slow:4-in-4-out`
  and `edu:rub:texture:hush-stone`.
- **Standard fit.** `4.OA.C.5` (patterns with a rule) is a loose fit for reversing Fossil's walk
  in `reader:s30-trail-s5`. Drop it if you want only tight matches.
