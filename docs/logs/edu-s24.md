# Learning Grove: S24 "The Adventure Book" (2026-10-16)

Files: `src/content/edu-s24-sprout.ts` (`EDU_S24_SPROUT`, `EDU_S24_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-s24-reader.ts` (`EDU_S24_READER`, `EDU_S24_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `s24` to `eduPacks`.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (31 quest + 23 variants) | 54 | 54 |
| Lessons | 61 | 64 |
| maths | 20 | 5 |
| science | 19 | 24 |
| sel | 10 | 14 |
| literacy | 9 | 17 |
| social-studies | 3 | 4 |
| Glossary entries | – | 22 |

Every original scene (15 step scenes, 15 done scenes, `s24-home`, and all 23 variants: the three
tea scenes, `moss-kept`, `lantern-corvin`, `stowaway-knows`, `bun-moss`, `eternal-watch`, the two
collector bird scenes, three nest payoffs, three lights scenes, `shelf-moss`, `shelf-sable`, two
tick scenes, `home-eternal`, `home-corvin` and `lecture`) has a version in both bands. None
unmapped. Sprout's maths count is high because the shared nest, lights and bird builders repeat
their counting lesson in each variant; along any one play path, maths never comes twice in a row.

## Standards used

- **Sprout:** K.CC.B.5, K.CC.C.6, K.G.A.1, K.MD.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.K.3, SL.K.1,
  K-ESS3-1, K-ESS3-3, K-PS3-1, K-2-ETS1-1, 1-LS1-2, 1-PS4-2, D2.His.2.K-2, D2.Geo.2.K-2, ELOF
  (Literacy; Scientific Reasoning; Social and Emotional Development), CASEL (Self-management,
  Relationship skills, Responsible decision-making).
- **Reader:** 1.OA.A.1, 3.OA.A.1, 4.MD.A.1, 4.MD.A.2, RL.2.3, RL.3.3, RL.3.6, RL.4.2, L.3.4, L.4.5,
  1-ESS1-2, 2-ESS2-2, 3-ESS2-1, 3-LS1-1, 3-PS2-1, 4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 5-ESS1-2,
  K-ESS3-1, K-ESS3-3, D2.His.2.K-2, D2.Civ.8.K-2, CASEL (all five). One reader lesson (estimating
  365 × 50 in `s24-proof`) has no standard, as nothing on the list fits.

The outline's four angles are all in: old people were young once (`s24-pages`, `s24-camp`); a memory
book (`s24-back-pages`); why we don't cage wild birds and how nests work (`s24-cage`, `s24-proof`,
the nest scenes, `s24-lecture`); finding east for sunrise (`s24-shelf`, plus why high places light
first in the lights scenes).

## Checks

- Single-file `tsc` (brief's command, and again with `--exactOptionalPropertyTypes
  --noUncheckedIndexedAccess`): clean. `eslint src/content/edu-s24-*.ts`: clean.
- By script, using content-check's own rules: every original scene id mapped in each band; scene and
  lesson ids unique; every `after` inside the scene; every standard on the approved list; choice
  ids and `set` flags identical to the originals in both bands (no `defaultChoice` needed); sprout
  ≤ 14 words and reader ≤ 30 words on every line, including prompts, replies and choice lines;
  every line ≤ 160 characters; neither lifted line (nor its text) appears anywhere.

## Canon and care

- Nubbins and the tall bird never speak. Moss speaks only in the post-game Moss variants (he is an
  Eternal); Sable is narrated ("Sable says nothing. Her ears stay up."). No Linnet.
- Hazel's and Moss's deaths are said plainly once ("died", "faded… That means he died"), with the
  flower and the remembering straight after. Nova's tears run long in both bands; the reader
  lesson in `s24-back-pages` plays early so it never interrupts them.
- Tilly is out of sight for one beat, heard whistling throughout, and found safe; her note from Hazel
  stays unopened. Sprout drops "towards the drop" and adds "Tilly is safe" in `s24-net`.
- Hazel's third rule is acted (you sit and wait) but never quoted or named.
- The two quoted lines are replaced by the quest's own `childLines` wording in both bands.

## For Maor

- Sprout keeps every choice (all are kind), so no `defaultChoice` anywhere.
- For the maths, the edu versions add numbers the script doesn't give: five buns in Fern's bag
  (sprout), tracks about two metres apart, 200 postcards at about 5 g, a 3 km/h uphill pace, and a
  page of 20 lines (reader).
- The main quest's keptStone line swaps (the stilled Nubbin walks instead of runs) are text
  replacements on main-game lines; the edu scenes keep the running Nubbin. If the engine applies
  those swaps by line index or text, the Learning Grove versions need their own swap list.
