# Learning Grove: S26 "The Walled Garden" (2026-10-16)

Files: `src/content/edu-s26-sprout.ts` (`EDU_S26_SPROUT`, `EDU_S26_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s26-reader.ts` (`EDU_S26_READER`, `EDU_S26_READER_VARIANTS`, `CHECKS`, empty in the
reader band). They are not registered yet: the wiring task adds them to `edu.ts` and `s26` to
`eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (25 quest + 15 variants) | 40 | 40 |
| Lessons | 42 | 56 |
| science | 16 | 23 |
| sel | 12 | 11 |
| maths | 10 | 4 |
| literacy | 1 | 14 |
| social-studies | 3 | 4 |
| Glossary entries | – | 24 |

Every original scene has a version in both bands: the 24 step and done scenes (steps 5 and 13 have
no done scene), `s26-complete`, and all 15 variants (`s26-door-thrums`, `s26-ramp-1..3`,
`s26-lift-1..3`, `s26-tobin-bench-cellar`, `s26-snowdrops-lifted`, `s26-complete-post`,
`s26-complete-door`, and the campaign hooks `c12-wall-garden`, `end-moss-sleeps-garden`,
`end-epi-garden`, `end-epi-garden-cold`). None unmapped. The four campaign hooks are not covered by
the campaign edu files, so they are here.

Reader think questions (no `best`): `s26-steps` (ramp or lift: today, or on your own every day?),
`s26-moss-wall`, `s26-hush`, `s26-tobin-finds` (is safe the same as well?), `s26-key-choice`,
`end-epi-garden`, `end-epi-garden-cold`.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.CC.C.6, K.G.A.1, K.G.A.2, K.MD.A.2, K.OA.A.1, RF.K.2, K-LS1-1,
  K-ESS2-1, K-ESS2-2, K-ESS3-3, 1-ESS1-1, 1-PS4-1, 2-ESS2-3, 2-LS2-2, K-2-ETS1-1, D2.His.2.K-2,
  D2.Civ.8.K-2, ELOF (Approaches to Learning; Mathematics Development; Scientific Reasoning; Social
  and Emotional Development), CASEL (Relationship skills, Self-awareness, Self-management, Social
  awareness).
- **Reader:** 3.MD.D.8, 3.NF.A.1, 3.OA.A.3, 3.OA.D.8, RL.1.4, RL.3.3, RL.4.2, L.3.4, L.4.5, K-LS1-1,
  K-PS3-1, K-ESS2-2, K-ESS3-1, K-ESS3-3, 1-ESS1-2, 1-LS3-1, 1-PS4-1, 2-LS2-1, 2-LS2-2, 3-LS1-1,
  3-PS2-1, 4-LS1-1, 5-ESS1-2, K-2-ETS1-1, 3-5-ETS1-2, D2.His.2.K-2, D2.Civ.8.K-2, CASEL
  (Responsible decision-making, Self-awareness, Self-management, Social awareness).

Outline angles covered: bulbs and the seasons (both bands, `s26-beds`, `s26-snowdrops`), how robins
live (colour, food, following diggers, territory), how pruning helps roses (`s26-pruned`), and
ramps and gardens built for everyone (raised beds, steps vs slope, the real problem is the steps,
3 × 15 cm = 45 cm and the one-in-twelve rule 45 × 12 = 540 cm in the reader ramp preludes).

## Checks

- Single-file `tsc` (brief's command): clean. `eslint src/content/edu-s26-*.ts`: clean. Prettier:
  clean.
- By script (mirroring content-check's edu rules): every original scene mapped in each band; scene
  and lesson ids unique; every `after` inside the scene; every standard on the approved list; choice
  ids and `set` flags identical to the originals in both bands (no `defaultChoice` needed); sprout
  ≤ 14 words and reader ≤ 30 words on every line, including prompts, replies and choice lines; every
  line ≤ 160 characters; no edu line contains a main line that the quest swaps out with
  `childLines`; no Dusty or Sparks pronoun warnings; scene lengths inside the band ranges.

## Canon and care

- Moss speaks (steps 6–8, chapter 6 onwards); he is absent from steps 11–13 as in the original.
- The robin and your Nubbin never speak. The Thrums (S12's hive) speak as one chorus, as in the main
  game. Hazel is silent in `c12-wall-garden`.
- Linnet: never cured, pitied, "brave" or "inspiring" (script-checked for those words); her
  sourness is from being kept; nobody touches her chair or lifts her without asking; every fix is
  to the place. The snow scene and its lesson say the steps are the problem. Lessons about her are
  about access and about anyone's feelings (being kept, independence), not about her body.
- Death: the last still Nubbin, Hush and Moss fade, said plainly as dying, with comfort straight
  after. Hush "letting herself fade" is softened to "faded too" in both bands.
- No lifted text from Burnett. The patch-of-earth request, the still garden, "the first person to
  speak in here" and the valley word "wick" are all rewritten ("living", "dormant"); "wick" is not
  used at all, since the main game's childLines drop it.

## For Maor

- The sprout `end-epi-garden-cold` (Collector) keeps the meaning ("safe is not the same as happy")
  but drops Linnet going home early and not coming back, ending on "the door is still open". The
  reader band keeps it in full plus one reflective line.
- The reader one-in-twelve ramp rule is given as "builders often use" (UK and US guidance for
  wheelchair ramps); worth a glance from the disability advisers along with the rest of Linnet's
  beats, as the main quest's notes already ask.
- Reader `end-epi-garden` and some short originals gained a few lines to reach the band's six-line
  minimum (for example, the robin sometimes nesting in the ivy, "nobody remembers the steps").
