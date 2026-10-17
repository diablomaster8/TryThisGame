# Learning Grove: Atlas A14 "Homecoming" (2026-10-17)

Files: `src/content/edu-a14-sprout.ts` (`EDU_A14_SPROUT`, `EDU_A14_SPROUT_VARIANTS`, `CHECKS`) and
`src/content/edu-a14-reader.ts` (`EDU_A14_READER`, `EDU_A14_READER_VARIANTS`, `CHECKS`). They are
not registered yet: the wiring task adds them to `edu.ts` and `a14` to `eduPacks`.

Every original scene has a version in both bands (134 quest scenes plus 15 variants, 149 each),
with the original choice ids kept (and the `a14-name` flags on the three choices of
`a14-08-shout`). Sprout drops no choices, so no `defaultChoice` is needed.

## Counts

| | sprout | reader |
| --- | --- | --- |
| Scenes (134 quest + 15 variants) | 149 | 149 |
| Lessons | 149 | 167 |
| sel | 36 | 46 |
| science | 33 | 38 |
| literacy | 31 | 31 |
| social-studies | 18 | 21 |
| maths | 21 | 17 |
| health | 6 | 9 |
| music | 3 | 3 |
| art | 1 | 2 |
| Kinds (ask / notice / do) | 107 / 14 / 28 | 157 / 10 / 0 |
| Think questions (no `best`) | 0 | 25 |
| Glossary entries | n/a | 22 |

Every scene has a lesson; sprout has exactly one per scene, reader one or two. Lesson ids are
unique; every `do` check is in the sprout `CHECKS`. Line caps hold (sprout 14 words, reader 30,
all under 160 characters) and no narration line has more than two sentences. No two lessons of
the same domain are ever adjacent in play order, within a quest or across quest boundaries
(checked by script, base scenes in order). Variants carry the same lesson domains as the scene
they replace. Every quest has at least three domains and a `sel` lesson, and every reader quest
has a think question. Both files pass the brief's tsc and eslint commands and are Prettier
formatted.

## Standards used

- **Sprout:** K.CC.A.1, K.CC.B.5, K.OA.A.1, K.OA.A.2, RF.K.2, RL.1.4, RL.K.3, K-ESS2-1,
  K-ESS3-1, K-LS1-1, K-PS3-1, K-2-ETS1-1, 1-ESS1-1, 1-LS1-2, 1-PS4-1, 1-PS4-2, 2-LS2-2,
  D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, and ELOF (Approaches to Learning, Language and
  Communication, Perceptual/Motor/Physical, Scientific Reasoning, Social and Emotional).
- **Reader:** 2.OA.A.1, 3.NF.A.1, 3.OA.A.1, 3.OA.A.3, 4.MD.A.1, RL.2.3, RL.3.3, RL.4.2, RL.4.3,
  L.3.4, L.4.5, 1-ESS1-1, 1-LS1-2, 1-PS4-1, 2-ESS1-1, 2-LS2-2, 2-LS4-1, 2-PS1-1, 2-PS1-4,
  3-LS1-1, 3-LS3-1, 3-LS4-3, 3-PS2-1, 3-5-ETS1-2, 4-LS1-1, 4-LS1-2, 4-PS3-2, 4-PS3-4, 5-ESS1-2,
  D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2, and CASEL (all five). Art, music and health
  lessons that have no fitting approved code leave `standard` out.

## What the outline asked for, and where

- **The Greek islands, Ithaca and the map:** A14-1 gate (both bands: an island is land with water
  all round it; reader also finds Greece, Ithaca and Troy and works out that home from Troy lies
  to the west), A14-3 proteus-done (reader: reversing a route by compass), A14-4 raft-done (reader: north on
  your left means facing east), A14-9 aeolia-done (reader: a west wind blows towards the east),
  A14-14 ship (both: Ithaca is a real island off Greece's west coast).
- **Homer's poems were sung and remembered before they were written:** A14-7 bard (rhythm and
  repeated phrases as memory aids), A14-1 stair (both: a lyre string wobbles), A14-11 complete (both: telling
  stories keeps people remembered), A14-12 sirens-done (reader: painters and bards kept stories
  alive).
- **How a loom works, warp and weft:** A14-2 antinous (reader: text and textile both come from the
  Latin for weaving), A14-2 loom (reader: warp still, weft over and under; sprout says and hops
  the over-and-under pattern), A14-2 loom-done (reader) and antinous-done (sprout): weaving and
  unpicking the same number of rows leaves none.
- **Xenia and nostos:** xenia in A14-1 gate, A14-15 hut (a shared rule makes a community
  safer), A14-17 hearth-done (washing a guest's feet) and the close-guest variant (knocking and
  waiting); nostos and nostalgia in A14-14 harbour. Reader glossary has both.
- **Why a dog can remember someone for years:** A14-16 sit (a dog's nose and ears are far keener
  than ours and a loved scent stays in memory; the reader scene also says real dogs live ten to
  fifteen years, so "twenty" is the poem's way of saying a very long wait) and gate (sprout reads
  body language: a wagging tail).
- **Around those (mostly reader):** word roots (protean, Cyclops and bicycle, strait and straight, texere,
  alphabet), similes and symbols, sound and vibration (wax in the ears), wind and the Beaufort
  scale, floating, evaporation, olive trees, scars, swallows, bees, cuttings, and feelings
  (homesickness, mixed feelings, grief, mercy, keeping promises, honesty, second chances).

## Care notes kept

- **No lifted text.** Nothing is quoted from Homer, Butler or any translation or film. The two
  lifted lines in the main script (Penelope's frame and unpicking) are not used; both bands
  retell them in new words, starting from the script's own `childLines`.
- **The gods.** Spoken of with dignity, never as a gag. Reader notes in A14-3 pylos-done and
  A14-4 ogygia-done, and the sprout equivalent, say that some people in Greece honour these gods
  today. No offering or prayer is a player action (Odysseus's offering stays out of sight).
- **The suitors.** Driven out, nobody hurt. Sprout calls them "bad guests" and the aegis scene
  is "whoosh, they run away".
- **Deaths.** Said plainly and gently, with comfort straight after: the two men in the Cyclops's
  cave (reader: "die", offscreen; sprout: no deaths, the giant has "a sore eye" and cannot see),
  Scylla's six and the crew after the Sun's cattle (reader: "lost", plus a comfort notice in
  A14-13 strait and a held-hands line in fig; sprout: "they died" once with comfort), Argos
  (both bands: "Argos has died. His body has stopped working, and it will not start again", then
  the memorial and a lesson on what helps after a pet dies) and Odysseus's mother (see below).
- **A14-11.** Opens with a soft note for the grown-up in both bands. Reader adds a lesson that
  missing someone is a heavy but normal feeling and that it is not what makes a body stop, and
  puts Anticlea's line as "It was missing you… It wore me out" instead of the source's "that
  was what I died of". Sprout says only that her body stopped working and she is a memory in
  the mist.
- **Corvin.** In sprout he is the lonely man who did a wrong thing and can say sorry ("I opened
  a gate"). In reader the close-family variant asks a think question about second chances.
- **Hazel's margin note.** Kept in both bands as a close restatement, with a cause-and-effect
  question about why the gate sticks.

## Not mapped

None. Every step scene, done scene, complete scene and variant (corvin-joins, the harbour,
gate, bed and complete variants, sit-corvin, aegis-done-corvin, the three closers and both
margin notes) has a version in each band.

## For Maor

- **Ask a Greek classicist to read the learning pages too.** They add three small claims about
  the old Greek stories (the gods each had a job, Athena and the olive tree and Athens, a dim
  place for the dead) and the Siren Vase fact (about 2,500 years old). Each is framed as "in
  the old stories".
- **Anticlea's line is softened** in both bands (see above). Say if you want the source's wording
  restored for reader.
- **Real-dog lifespan.** The reader Argos lesson says a real dog lives ten to fifteen years, so
  twenty years is the poem's way of saying "a very long time". It spoils nothing, but it is the
  one place a lesson corrects the story.
- **Hazel appears in A14-11 after** (both bands), as "what Hazel did" (sitting beside someone). I
  followed the main script; check it against how Gran Hazel's illness is handled in the
  Learning Grove if the order of play allows A14-11 early.
- **Sprout done scenes are short** (1 to 3 lines, as in the main script), under the 4-line guide.
  I kept them short rather than pad them.
- **Wiring:** `EDU_A14_SPROUT`, `EDU_A14_SPROUT_VARIANTS`, `EDU_A14_READER` and
  `EDU_A14_READER_VARIANTS` go into `edu.ts`, and `a14` into `eduPacks` in
  `tests/tools/content-check.ts`. I did not run `content-check.ts`, since the files are not
  registered yet.
