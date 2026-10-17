# Learning Grove: Atlas A20 "The Weeping" (2026-10-17)

Files: `src/content/edu-a20-sprout.ts` (`EDU_A20_SPROUT`, `EDU_A20_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a20-reader.ts` (`EDU_A20_READER`, `EDU_A20_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a20` to `eduPacks`.

The storyline is `all`, so it has a Learning Grove version. Reader scene lines are the main game's
own words (the script's `childLines` replace the five lines that quoted Brodeur; the line that
introduced the two quoted lines in `a20-11-stones` is reworded; one plain line is added after
Baldr's fall: "Baldr is dead. His body has stopped working, and it will not start again.").
Sprout is written fresh, in the sprout voice. Both files keep every choice id and the `a20-thokk`
`set` flags, so the variant scenes still work. Both files are Prettier-formatted and pass the
brief's tsc and eslint commands.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (80 quest + 14 variants) | 94 | 94 |
| Lessons | 95 | 104 |
| sel | 28 | 27 |
| science | 22 | 21 |
| literacy | 16 | 27 |
| maths | 15 | 17 |
| social-studies | 8 | 12 |
| health | 3 | 0 |
| art | 2 | 0 |
| music | 1 | 0 |
| Kinds (ask / notice / do) | 72 / 11 / 12 | 94 / 10 / 0 |
| Think questions (no `best`) | 4 | 28 |
| Glossary entries | n/a | 18 |

Every scene has a lesson; sprout has one per scene (two in `a20-01-page`); reader has one or two.
Lesson ids are unique, every `standard` is on the approved list, every `edu:` check is listed in
`CHECKS`, and line caps hold (sprout 14 words, reader 30, all 160 characters; narration at most
two sentences). No two lessons of the same domain are back to back, in any route through the
variants (checked across all 3 x 3 x 3 x 3 combinations of the Thökk and Cinder variants). Every
quest has at least three domains and a `sel` lesson; every reader quest has a think question.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.5, K.G.A.1, K.MD.A.2, K.OA.A.1, K.OA.A.2, RF.K.2, RL.1.4, RL.K.3,
  K-ESS3-1, K-LS1-1, K-PS3-1, 1-ESS1-1, 1-ESS1-2, 1-PS4-1, 1-PS4-2, 2-ESS1-1, 2-ESS2-3, 2-LS2-1,
  2-PS1-1, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, five CASEL and six ELOF codes.
- **Reader:** 1.OA.A.1, 2.OA.A.1, 3.MD.A.1, 3.MD.C.7, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4.MD.A.1,
  4.MD.A.2, L.3.4, L.4.5, RL.2.3, RL.3.3, RL.3.6, RL.4.2, K-LS1-1, 1-ESS1-1, 1-PS4-1, 1-PS4-2,
  2-ESS1-1, 2-ESS2-3, 2-LS2-1, 2-PS1-1, 2-PS1-4, 3-LS1-1, 3-PS2-1, 4-ESS2-2, 4-LS1-1, 4-LS1-2,
  4-PS3-2, 4-PS3-4, 5-ESS1-2, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, five CASEL codes.

## What the outline's Learning Grove list became

- **Where Iceland is, and Snorri about 800 years ago:** `a20-01-page`, both bands (sprout: an island
  with water all around; a pen and handmade book. Reader: north-west of Scotland, and vellum).
- **Why cold things "weep":** `a20-11-stones` (sprout: sunshine melts frost. Reader: melting
  against condensation against evaporation, and why "weeping stones" is personification). Dew
  (`a20-15-company`, reader) is condensation again.
- **Mistletoe grows on other trees:** `a20-05-complete` (sprout) and `a20-03-asking` (reader).
- **The solstice and long winters in the far north:** `a20-15-plain` (sprout: short winter days.
  Reader: Earth's tilt, the solstice, and about four hours of daylight in Reykjavík).
- **Some people still honour these gods today:** named in `a20-01-page`, both bands (reader adds
  "Heathenry" to the glossary). Reader also teaches that four weekday names are Norse (`a20-15-company`).

## Facts to check against the script

- Weekday names: Friday is "Frigg (or perhaps Freyja)" because scholars differ.
- Reader numbers (all checked): 12 / 4 = 3; half of a half is 1/4; 4 km x 6 h = 24 km; 8 am to 8 pm
  = 12 h; 8 x 3 = 24; 8 litres = 8000 ml; 2 x 8 = 16 legs; nine nights from Monday morning end
  on Tuesday; 9 + 9 = 18; a third of 30 = 10; -4 + 7 = 3 degrees C (about 37 degrees F); 100 - 1 = 99;
  10 x 6 = 60; two summers between three winters; 3 x 6 = 18; 40 x 25 = 1000 m2; 18 / 6 = 3.

## Original scenes I couldn't map

None. All 80 quest scenes and all 14 variants have a version in both bands.

## For Maor

- **Adviser read still needed** for the Heathenry framing (the page's care notes ask for an
  inclusive Heathen organisation). The Learning Grove only names the religion, says Snorri's book is
  "one telling", and teaches facts (weekday names, the Althing, ship burials). It asks for a look
  at the sprout "some people still honour these gods today" line and the reader glossary entry.
- **Sprout softening beyond the main game:** Loki's binding keeps no snake or venom (drops fall
  from the rock and Sigyn catches them in a bowl); Ragnarok is "tiny wolves", a far-off ship and a
  red glow; Hel's hall is "the quiet hall, where those who have died stay". Baldr's and Nanna's
  deaths are said plainly with comfort straight after. Say if you want any of this closer to the
  main game.
- **Reader additions to the main script:** one plain death line after Baldr's fall
  (`reader:a20-06-fall`, line 5), and a reworded intro for the stones' print (`reader:a20-11-stones`,
  line 5). No other line differs from the main script except the five `childLines` swaps.
- **Sprout keeps all three Thökk choices** (ask again, sit, walk away), because each is kind and
  safe for the age. No `defaultChoice` is needed.
- The reader `CHECKS` export is empty on purpose (no `do` lessons in the reader band).
