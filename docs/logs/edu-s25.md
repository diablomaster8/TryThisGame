# Learning Grove: S25 "Real" (2026-10-16)

Files: `src/content/edu-s25-sprout.ts` (`EDU_S25_SPROUT`, `EDU_S25_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s25-reader.ts` (`EDU_S25_READER`, `EDU_S25_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `s25` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (27 quest + 19 variants) | 46 | 46 |
| Lessons | 48 | 50 |
| maths | 13 | 10 |
| science | 13 | 19 |
| sel | 11 | 8 |
| literacy | 9 | 9 |
| health | 2 | 2 |
| social-studies | 0 | 2 |
| Glossary entries | – | 12 |

Every original scene (13 steps × scene and done, the complete scene, and all 19 variants: sill-late,
storm-nosable, page-found, byte, page-byte, shed-kept, line, line-dry, falls-kept, twice-kept, the
six spring codas and the three idle scenes) has a version in both bands. None unmapped.

## Standards used

- **Sprout:** K.CC.B.4, K.CC.B.5, K.G.A.1, K.G.A.2, K.MD.A.2, RF.K.2, RL.K.3, RL.1.4, K-ESS2-1,
  K-ESS3-1, K-PS3-1, 1-PS4-2, 1-ESS1-1, ELOF (Literacy; Scientific Reasoning; Social and Emotional
  Development; Perceptual, Motor, and Physical Development), CASEL (Self-management, Relationship
  skills, Social awareness).
- **Reader:** 3.OA.A.1, 3.OA.A.3, 3.MD.A.1, 3.MD.B.3, 4.MD.A.1, 4.OA.C.5, RL.3.3, RL.3.6, RL.4.2,
  L.3.4, L.4.5, 2-PS1-1, 2-PS1-4, 2-LS2-2, 3-LS4-3, 4-LS1-2, 4-PS3-2, 4-PS3-4, 5-ESS1-2, 1-ESS1-2,
  K-PS3-1, 3-5-ETS1-2, D2.His.2.K-2, D2.Civ.8.K-2, CASEL (Self-management, Self-awareness, Social
  awareness, Relationship skills, Responsible decision-making).

## Checks

- Single-file `tsc` (brief's command): clean. `eslint src/content/edu-s25-*.ts`: clean.
- By script: every original scene id mapped in each band; scene and lesson ids unique; every
  `after` inside the scene; choice ids identical to the originals in both bands (no
  `defaultChoice` needed); sprout ≤ 14 words and reader ≤ 30 words on every line, including
  lesson prompts, replies and choice lines; every line ≤ 160 characters.

## Canon and care

- Moss: silent and unnamed ("a little grey one") in `s25-sill` (chapter 3), named and silent in
  `s25-sill-late`, speaking from `s25-real` on, heard only by you.
- Nubbins, wild Nubbins and Sable never speak; Moss reads the wild ones' manner. No Linnet.
- No lifted text from the book in either band; the eight lifted lines are rewritten (the
  original's `childLines` guided the replacements). The `when` choice label is reworded to
  "does it happen quickly?" to keep clear of the book's own question.
- The chill is said plainly, with comfort straight after; nothing dies in this story.

## For Maor

- Sprout keeps both fates of the toy (`gone`, `kept`): neither is bleak, so no `defaultChoice`.
- Some original scenes are short (2–5 lines: the idle lines, `s25-shed`, `s25-darned`), so a few
  edu scenes sit under the band's usual scene length rather than padding them.
- The idle and coda scenes have lessons too, as the brief asks for every variant.
