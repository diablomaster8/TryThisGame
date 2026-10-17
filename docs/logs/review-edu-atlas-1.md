# Review: edu-atlas-1 (Learning Grove Atlas A2, A5–A13, sprout and reader), fix mode

Date: 2026-10-17. Brief: `docs/briefs/review.md`. Files: `src/content/edu-a02-sprout.ts` …
`edu-a13-reader.ts` (20 files). Each pair was read in full against `docs/canon.md`, `STORY-BIBLE.md`,
`STYLE.md`, `EDU-STYLE.md`, its original (`atlas-aNN.ts`), its outline section (`docs/atlas.md` for
A2–A10, `docs/more-stories.md` for A11–A13), `docs/logs/script-aNN.md` and the writer's notes
`docs/logs/edu-aNN.md`. One reviewer per storyline applied the fixes to its two files only.

Eight writer files (a06, a07, a12, a13) weren't Prettier-formatted. They are now, so their diffs are
larger than the content changes. All 20 files keep LF line endings. Nothing is committed; the
uncommitted edu-s24…s31 work was not touched.

## 1. Verdict

A strong, faithful batch. In every storyline, each original scene and variant has a version in both
bands, every choice id and `set` matches the original (so each signature choice still pays off), no
Grove flag is written, and no Nubbin or animal speaks outside the canon exceptions.

The real problems were these:
- **Same-domain lessons back to back** on some play path, in every storyline. Every maths pair is
  gone, which is the only EDU-STYLE rule. Most reviewers also cleared non-maths pairs (see For Maor).
- **Wrong lesson facts and sums**, about 40 across the batch. Examples: Manding/Mali, a sum where
  42 m was "a hundred times too big", "shell" starting with /s/, Héctor's silent h, the comet that
  "reflects sunlight like the Moon", "Roman Empire" in 50 BC, dog-fish taught as whales, polar night
  "days or weeks".
- **Lifted text:** "Grief is love with nowhere to go" twice (A5 and A10 reader). Milne phrases carried
  over from the main script into both A11 bands. The two content-check quote hits.
- **Continuity slips** where lines had been cut in sprout and what was left stopped making sense
  (A2, A5, A12, A13).
- **Caps:** about 25 reader lines over 160 characters, and over 250 three-sentence narration lines.
- **The known items:** `sprout:a06-05-lift-done` now reads "(Make big round eyes!)".
  `reader:a11-14-tunic` now reads "It isn't sagging. It's having a little sit-down."; sprout had the
  same echo and was reworded too. Both a13 `grove-pixel` lines now say "puts Clank's nose back on".
  `tests/tools/content-check.ts` was not changed.

All of these are fixed. After the fixes, the three checks end at 0 problems.

Counts: **130 must fix (130 done), 267 should fix (267 done)**.

| storyline | must fix | should fix |
| --- | --- | --- |
| A2 The Monkey and the Monk | 8/8 | 39/39 |
| A5 The Lion of Mali | 19/19 | 17/17 |
| A6 Seven Voyages | 9/9 | 35/35 |
| A7 The Marigold Bridge | 17/17 | 24/24 |
| A8 The Twelve Tasks | 9/9 | 34/34 |
| A9 The Comet | 17/17 | 13/13 |
| A10 The Heart of the Island | 19/19 | 20/20 |
| A11 The Enchanted Place | 14/14 | 44/44 |
| A12 The Mirror Shard | 10/10 | 17/17 |
| A13 The Wooden Boy | 8/8 | 24/24 |
| **Total** | **130/130** | **267/267** |

## 2. Must fix

### A2 The Monkey and the Monk

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a02-sprout | `a02-10-moksa` #0 | "Moksa. She carries a small red gourd." Moksa (Hui'an) is Guanyin's male disciple, son of Li Jing. | "Monkey comes back with Moksa. He carries a small red gourd." | done |
| edu-a02-sprout | `a02-10-complete-l1` → `a02-11-temple-l1` | Two maths lessons in a row (count to 6, then count to 2). | Dropped temple-l1, the weak "count the helpers" do; the "No thank you" lesson remains. Removed `edu:count:helpers:2` from CHECKS. | done |
| edu-a02-sprout | `a02-18-complete-l1` → `a02-19-turtle-l1` | Two maths lessons in a row (count to 10, then count in tens to 80). | Dropped turtle-l1; the sel lesson about being forgotten remains. Removed `edu:count:tens:80` from CHECKS. | done |
| edu-a02-reader | `a02-09-complete-l1` → `a02-10-river-l1` | Two maths lessons in a row (12 − 9, then 800 li → km). | complete-l1 is now social-studies (D2.His.2.K-2): "Which animal comes just before the Pig?" The answer is the Dog ("Rooster, Dog, Pig"). | done |
| edu-a02-reader | `a02-18-complete-l1` → `a02-19-turtle-l1` | Two maths lessons in a row (compare 5,048 with 5,110, then 9 × 9). | Dropped turtle-l1 ("Nine is a number the story likes" was thin anyway). | done |
| edu-a02-reader | `a02-03-pine-l1`, `a02-05-mountain-l1`, `a02-10-complete-l2`, `a02-13-complete-l1`, `a02-17-cottage-l1`, `a02-17-out-l2` | Six lesson lines are over 160 characters (172, 185, 172, 171, 172 and 168). | Each split into two lines at its sentence break; mountain-l1 now ends "Five peaks for five elements: the mountain's name is chosen with care." | done |
| edu-a02-reader | `a02-06-road-l1` #2 | "That is sixteen years of walking." This is false: Xuanzang spent years studying in India, at Nalanda and elsewhere. | "He was away for sixteen years, many of them spent studying in India." | done |
| edu-a02-reader | `a02-11-mend-l2`, option "50" | The reply "That would be 50 × 50" is wrong maths. | "50 is the size of the little cup, not how many." / "250 ÷ 50 = 5." | done |

### A5 The Lion of Mali

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a05-sprout | `a05-01-page-l1` | "You are in a place called Mali. It is a country in Africa." The story is set in Manding, and Niani lies in today's Guinea. | "You are in a land called Manding. It is in West Africa." / "Manding will grow into a great kingdom called Mali." Skill and parentNote updated. | done |
| edu-a05-reader | `a05-01-page-l1` | "This page is set in Mali, a country in West Africa": same error. | "This page is set in Manding, in West Africa, south of the Sahara desert. Today its lands lie in Mali and Guinea." / "The story tells how the Mali Empire began, about 800 years ago. Today's Mali is named after it, and griots across the region still tell it." | done |
| edu-a05-reader | `a05-04-stand-l1` prompt | "Gravity pulls the rod down. For Sundiata to lift himself up on it…": gravity on the rod is irrelevant. | "Gravity pulls Sundiata down towards the ground. For him to pull himself up the rod, what must be true?" | done |
| edu-a05-sprout | `a05-03-house-done` → `a05-03-leaves` | Two science lessons in a row. | leaves-l1 becomes a literacy ask (RF.K.2): "Baobab starts with a "b" sound… Which word starts like baobab?" (Ball / Sun / Moon). `edu:point:plant:leaf` removed from CHECKS. | done |
| edu-a05-sprout | `a05-06-garden-done` → `a05-06-sent` | Two sel lessons in a row. | garden-done becomes literacy (RL.1.4): ""Ashamed" is a feeling word. It means you feel bad about something you did." | done |
| edu-a05-sprout | `a05-08-mat` → `-mat-done` → `-complete` | Three sel lessons in a row. | mat-l1 becomes a science notice (1-ESS1-1, after line 0): the sun crosses the sky, so Sogolon's shade moves. complete-l1 becomes literacy (SL.K.1, "telling a short memory out loud"); the grief lesson stays sel. | done |
| edu-a05-sprout | `a05-09-sosso` → `-sosso-done` | Two maths lessons in a row (count, then positions). | sosso-done becomes a literacy sound-word ask (RL.1.4): "Balla pushes the old door. What sound does it make?" (Creeeak! / Moo! / Splash!). | done |
| edu-a05-sprout | `a05-09-chamber` → `-chamber-done` | Two science lessons in a row. | chamber-done lesson (long keys low, short keys high) is retagged music. | done |
| edu-a05-sprout | `a05-09-chamber-done-lullaby` → `a05-09-march` | Two sel lessons in a row on the lullaby path. | Variant lesson (a tune brings back a loved one) is retagged music. | done |
| edu-a05-sprout | `a05-14-assembly` → `-assembly-done` | Two social-studies lessons in a row. | assembly-l1 becomes sel (CASEL: Social awareness, "a kind rule: welcome guests"). | done |
| edu-a05-reader | `a05-02-gate-done` → `a05-02-complete` | Two literacy lessons in a row. | complete-l1 (Sogolon's dignity) is retagged sel, CASEL: Self-awareness. | done |
| edu-a05-reader | `a05-05-lesson` | Two music lessons back to back in one scene. The tempo lesson also carried a CASEL standard. | l1 (gourd resonators, 4-PS3-2) is retagged science. l2 (tempo) is written as a lesson object with no `standard`, because none on the list fits. | done |
| edu-a05-reader | `a05-08-mat` → `-mat-done` | Two sel lessons in a row. | mat-l1 becomes a science ask (5-ESS1-2): "Sogolon's shade moves round her as the day goes. Why does it move?" (the Earth turns, so the Sun seems to cross the sky). | done |
| edu-a05-reader | `a05-09-chamber` → `-chamber-done` | Two science lessons in a row. | chamber-done-l1 (a bigger balafon means lower notes) is retagged music. | done |
| edu-a05-reader | `a05-09-chamber-done-lullaby` → `a05-09-march` | Two sel lessons in a row on the lullaby path. | Variant lesson is retagged music (see the should-fix for its text). | done |
| edu-a05-reader | `a05-10-basket` → `-basket-done` | Two literacy lessons in a row. | basket-done-l1 is retagged sel, CASEL: Relationship skills ("He values friendship over keeping his army"). | done |
| edu-a05-reader | `a05-12-watch-done` → `a05-12-list` (×2) | Three literacy lessons in a row. | list-l1 (retell in order, a `do`) becomes social-studies, D2.His.2.K-2, "oral history: griots retell events in order". list-l2 stays literacy. | done |
| edu-a05-reader | `a05-14-assembly` | Two social-studies lessons back to back. | assembly-l1 (guests and messengers) is retagged sel, CASEL: Responsible decision-making. The Manden Charter notice stays social-studies. | done |
| edu-a05-reader | `a05-14-ask` → `a05-14-complete` (and `-lullaby`) | Two social-studies lessons in a row (jeli notice, then Mansa Musa). | The Sosso-Bala notice (music) now plays first: base after 9 and Mansa after 10; variant after 10 and Mansa after 11. | done |

### A6 Seven Voyages

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a06-sprout | `a06-05-lift-done-l1`, best reply | Content-check: quotes pa5-01, "(Open your eyes wide!)" | "Yes! Amazed means very surprised. (Make big round eyes!)" | done |
| edu-a06-sprout | `a06-16-telling-done-kept-l1` | "How many seasons are in one year? Four." Wrong for the story's own land (the variant says "a dry season, then the rains") and not true everywhere | Replaced with a sel ask (CASEL: Self-management), "Sinbad waited a whole dry season, and then the rains. That is a long wait! What helps when you have to wait a long time?", best "Doing something nice while you wait." | done |
| edu-a06-reader | `a06-11-complete-l1` #1 | Route is wrong: ships from Basra do not sail "round Arabia" to reach India | "Ships from Basra sailed down the Gulf, out past Oman, across the Arabian Sea to India’s coast, and south to the island." | done |
| edu-a06-reader | `a06-05-valley-l1` #1 | Contradicts itself: warm snakes are fast, "that's why these are asleep in the morning light" (and the scene is after noon) | "A warm snake can move fast, and a cold one is sluggish. These are dozing in the sun, so tread softly and don’t wake them." | done |
| edu-a06-reader | lesson lines in `04-left-l1`, `09-boulders-l2`, `09-boulders-done-l1`, `11-raft-l1`, `13-complete-l2`, `14-herd-l1`, `14-complete-l1`, `15-street-l1`, `16-telling-l1`, `16-complete-l2` | 162 to 180 characters, over the 160 cap | Trimmed; the two think-question prompts now end "…?" with a separate line, "There’s no single right answer." | done |
| edu-a06-sprout | `a06-01-complete` → `a06-02-telling` | Two maths lessons in a row (count to 7, then triangle) | 01-complete: the finger-count prompt line is now "The old man smiles at you and your Nubbin."; the lesson is now social studies (D2.His.2.K-2): "Long ago, many people could not read. So they told stories out loud." / "Families still tell stories at bedtime. Does somebody tell you one?" | done |
| edu-a06-sprout | `a06-07-island-done` → `a06-07-box` | Two maths lessons in a row | island-done becomes a sel ask (CASEL: Responsible decision-making), "Sinbad has a big problem. What can friends do with a big problem?", best "Think of a plan together." | done |
| edu-a06-sprout | `a06-16-grove` → `a06-16-grove-done` | Two maths lessons in a row | grove becomes science (K-PS3-1): "Is the shade cooler or warmer than the sunny grass?", best "Cooler." | done |
| edu-a06-reader | `a06-13-monsoon-l2` → `a06-13-monsoon-done` | Two maths lessons in a row (50 days, then 71 days) | monsoon-done becomes literacy (RL.3.3): "“Tell your Caliph I am reading.” It’s only five words. What else is the king saying to the Caliph?" | done |

### A7 The Marigold Bridge

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a07-sprout | a7-12-home, line 3 | "Papá, Mamá, Abuelita and a cousin" is 4 people, but the child counts "uno… cinco" | "Papá, Mamá, Abuelita and two cousins run to hug him." | done |
| edu-a07-sprout | a7-12-coco-done-l1 | Teaches "Héctor starts with the sound huh": H is silent in Spanish (EK-tor) | Replaced with a first-sound lesson on Coco /k/: "Coco starts with the sound cuh. Which word starts with cuh?" Cat (best) / Hat / Sun | done |
| edu-a07-sprout | a7-02-guitar-l1 → guitar-done-l1 | sel then sel (and the notice told the child the third rule before they act it out) | guitar-l1 is now a literacy RL.1.4 feelings ask: "Miguel hides his face in his knees. How does he feel?" | done |
| edu-a07-sprout | a7-05-queue-l1 → queue-done-l1 | maths then maths | queue-done clap pattern re-domained to music ("clap a repeating rhythm pattern") | done |
| edu-a07-sprout | a7-11 backstage-done → screens → screens-done → blessing | four sel lessons in a row | screens-l1 is now science 1-PS4-1 (the bell shakes to make sound; "Tap a pan lid with a spoon. Bong! Touch it to stop it."); blessing-l1 kind wish is now literacy, ELOF: Language and Communication | done |
| edu-a07-reader | a7-10-dark-l2 prompt | 164 characters (cap 160) and awkward grammar ("says he “thought I was…”") | "Héctor thought he was “just unlucky”. When we don’t know the real reason for something, what stories do we tell ourselves?" + "(There is no one right answer.)" | done |
| edu-a07-reader | a7-01-plaza → plaza-done → petals | literacy→literacy, then science→science | mucho gusto ask moved to after=3, so the order is science, literacy, science, literacy | done |
| edu-a07-reader | a7-02-guitar-l1 → guitar-done-l1 | sel then sel | guitar-l1 is now literacy RL.3.3: "Why might she do something she seems to regret?" | done |
| edu-a07-reader | a7-04-gate-done → complete | literacy then literacy | gate-done ask is now sel, CASEL: Social awareness | done |
| edu-a07-reader | a7-05-run → run-done → complete → a7-06-alley | literacy→literacy, then sel→sel | run-done is now maths 3.OA.A.3 (4 rows of 7 posters = 28); complete is a literacy L.4.5 ask on the writer's own metaphor "anger is fear wearing a coat"; the stray "…" became "." | done |
| edu-a07-reader | a7-07-stage-done → row | literacy then literacy | stage-done is now sel, CASEL: Social awareness (mixed feelings in Imelda's shout) | done |
| edu-a07-reader | a7-08-pool-done → complete → a7-09-films | sel→sel→sel (and the two notices said the same thing) | complete-l1 is now a literacy think question on foreshadowing: "Everyone claps for Ernesto except you and your Nubbin. Writers sometimes plant a small clue like this." | done |
| edu-a07-reader | a7-09-toast-done → complete → a7-10-dark | science→science→science | toast-done is now sel, "Dante… barks for help. What could you do if you saw a friend in trouble?" (tell a trusted grown-up); the cenote notice moved to after=8 so literacy plays first | done |
| edu-a07-reader | a7-10 dark → dark-done → water (and water-promise) → water-done | four literacy lessons in a row | dark-done is now social-studies D2.His.2.K-2 (counting generations); water-done is now sel, CASEL: Social awareness | done |
| edu-a07-reader | a7-11-screens-done → blessing | sel then sel | the two screens-done asks swapped (sel, then the science transparency ask), with a comment saying why; skill renamed "transparent and opaque materials" because translucent is never taught | done |
| edu-a07-reader | a7-11-complete → a7-12-home → home-done | literacy→literacy→literacy | home-l1 is now sel, CASEL: Social awareness | done |
| edu-a07-reader | a7-12-coco-promise | two sel lessons inside one scene | the "some very old people forget" notice is now health in both a7-12-coco and a7-12-coco-promise | done |

### A8 The Twelve Tasks

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a08-sprout | `a08-02-complete` → `a08-03-field` | Two maths lessons in a row. | field-l1 → the first-sound lesson for "Swift" (literacy, RF.K.2, after 3). field-done → compare lengths "long, longer, longest" (maths, K.MD.A.2). The javelin count is dropped. CHECKS updated. | done |
| edu-a08-sprout | `a08-05-complete` → `a08-06-tent` | Two maths lessons in a row. | tent-l1 → trace the letter I for Iris, "It looks just like the Roman one" (literacy, ELOF: Literacy, `edu:trace:letter:i`). | done |
| edu-a08-sprout | `a08-09-complete` → `a08-10-edge` | Two maths lessons in a row. | edge-l1 → "Crocodile starts with a c sound… Which word starts the same?" Cake/Dog (literacy, RF.K.2, after 4). | done |
| edu-a08-reader | `a08-14-tie-done` → `a08-14-bard-loop` | Two maths lessons in a row on the loop path. | The 42-verses sum moves to `a08-14-tie` (after 2, before the think question). tie-done → a lesson on the two meanings of "bound" (literacy, L.3.4), with a new line: "Bound in official papers? I am a bard, not a book!" This replaces the quiz-like narration. | done |
| edu-a08-reader | `a08-01-square-l1` #1 | "“Referee” is not [from Latin]" is false: refer comes from Latin *referre*. | "English is full of Latin words. “Vocabulary” and “audience” both come from Latin." | done |
| edu-a08-reader | `a08-02-complete-l1` #0 | "It is the start of every Roman number" is false (V, X…). | "I is a single stroke, like one finger held up. It is the smallest Roman numeral." | done |
| edu-a08-reader | `a08-13-rome-l1` #1, file header | "Fights with lions were held in other arenas" is false: the Circus Maximus held wild-animal shows (venationes) too. | "Wild-animal shows were held there sometimes too. Later the Colosseum, built over a hundred years after Caesar, became the famous place for them." The parentNote and the header comment now match. | done |
| edu-a08-reader | `a08-09-door-l1` #1 | "The Roman Empire" in 50 BC: Rome was still a Republic. | "Rome needed officials and records to collect taxes and count its people." | done |
| edu-a08-sprout | `a08-14-complete` #0–3 | Getafix gives "a tiny cauldron, a winged helmet and a small menhir". The original has the chief give the helmet and Obelix the menhir, and Obelix's next line assumes he gave it. | "The feast goes on, late into the starry night." / "Getafix gives you a tiny cauldron. The chief gives you a winged helmet." / O: "And a menhir! My smallest one. It has a face!" | done |

### A9 The Comet

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a09-sprout | `a09-04-telescope-done` → `a09-04-step` | Two sel lessons in a row. | telescope-done lesson → literacy (RL.2.3): "Moomintroll hears big news. What does he do next?" / "He hurries home to tell Mamma". | done |
| edu-a09-sprout | `a09-04-complete` → `a09-05-crevice` | Two maths lessons in a row across the quest boundary (counting days, then circle). | crevice lesson → first sound of "ring" (literacy, RF.K.2). Moomintroll's line is now "What is it for? It is too small for a crown." | done |
| edu-a09-sprout | `a09-12-dawn-done` / `-garnet` → `a09-12-gate` | Two sel lessons in a row (relief or giving, then saying thank you). | gate lesson → maths (K.OA.A.1): "Snufkin gives you a hat. Mamma gives you a stove. How many gifts?" The reply keeps the thank-yous ("Two gifts, and two thank-yous!"). | done |
| edu-a09-sprout | `a09-12-dawn` → `a09-12-dawn-done-shell` | Two science lessons in a row (tides, then the shell sound). | Shell lesson → music `do` "listening closely to quiet sounds", check `edu:listen:quiet-sounds` (added to CHECKS). It keeps the line "A shell catches tiny sounds and makes them sound like waves." | done |
| edu-a09-sprout | `a09-09-octopus` #1 | "It has one big, sad eye." teaches a wrong fact (octopuses have two eyes, and the reader's light choice says "both eyes"). | "An octopus lifts its head. It looks at him with one big, sad eye." | done |
| edu-a09-reader | `a09-02-launch-done` → `a09-02-river` | Two science lessons in a row (compass, then animals leaving). | River science ask moved to after the last line, so the sel note plays first. | done |
| edu-a09-reader | `a09-06-snork` l2 → `a09-06-snork-done` | Two social-studies lessons in a row. | The think question "is a meeting always best?" re-tagged sel, CASEL: Responsible decision-making. | done |
| edu-a09-reader | `a09-07-complete` → `a09-08-shore` | Two maths lessons in a row across the quest boundary (symmetry, then days saved). | Tides note moved to after line 1 ("The sea has gone"), so it plays before the 3 − 1 sum. | done |
| edu-a09-reader | `a09-09-deep` → `a09-09-deep-done` | Two sel lessons in a row. | deep lesson re-tagged social-studies, D2.Civ.8.K-2 (rules keep us safe). | done |
| edu-a09-reader | `a09-09-octopus` l1 → l2 | Two science lessons in a row in one scene. The reflection ask was also meta ("In one choice, you hold up the pink shell…") before the choice is made. | Replaced with maths (1.OA.A.1): "Two of the octopus’s eight arms are holding Moomintroll. How many arms are not holding anything?" (8 − 2 = 6). The `reflection` gloss is removed. | done |
| edu-a09-reader | `a09-12-dawn-done` l1 → l2 | Two sel lessons in a row. The think question also lived only in the base scene, so the shell and garnet paths had no think question in A9-12. | The think question moved into `a09-12-dawn` after Snufkin's "mostly" line, as literacy RL.3.6 ("Would you rather hear…"). | done |
| edu-a09-reader | `a09-12-dawn` → `-dawn-done-shell` → `a09-12-gate` | Science, then science, then science on the shell path. | Fixed by the move above, and by moving the migration note from `gate` into `a09-12-gate-done` (after line 0, "already at the bend in the road"). The `migrate` gloss scene was updated. | done |
| edu-a09-reader | `a09-12-gate` migration note | 173 characters (cap 160). The gloss word "migrate" never appeared in the text. | Split into two lines: "Snufkin goes south for the winter. Many birds of the north migrate that way too." / "Swallows that nest in Finland spend the winter in southern Africa, many thousands of kilometres away." | done |
| edu-a09-reader | `a09-08-complete` note | A comet "reflects sunlight from its icy surface… much as the Moon does". In fact the nucleus is very dark; the light comes from sunlight on the dust and from gas glowing in sunlight. | "A comet has no fire inside. Sunlight bounces off its dust, and its gas glows when sunlight hits it." Skill and parentNote updated. | done |
| edu-a09-reader | `a09-10-run-done` best reply | "comets look small even when they are very bright and near, because they are so far away" contradicts itself, and great comets' tails can span much of the sky. | "Yes. Distance changes how big an object looks. Real comets stay millions of kilometres away, so none ever fills the sky like this one." | done |
| edu-a09-reader | A9-7 glossary `chrysalis` | "The hard case a caterpillar makes around itself" describes a moth's cocoon. A chrysalis is the pupa itself. | "The resting stage, inside a hard skin, when a caterpillar turns into a butterfly." | done |
| edu-a09-reader | `a09-07-meadow` note #3 | "A rare butterfly… is one that has reached the last stage and survived" is not what "rare" means. | "This change of body shape is called metamorphosis. The Hemulen only ever hunts the last stage, the one with wings." | done |

### A10 The Heart of the Island

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a10-sprout | `a10-02-breakers-done-l1` | Phonics error: "sea, sand, shell" all start with "s", but shell starts with /sh/. | Changed to "sea, sand, sun" in the prompt, both replies and the parent note. | done |
| edu-a10-sprout | `a10-05-bedside-l1` → `a10-05-bedside-done-l1` | Two sel lessons in a row. | bedside-done is now literacy, `SL.K.1` ("saying a kind thing out loud to someone you love"); same check and lines. | done |
| edu-a10-sprout | `a10-10-practice-done-l1` → `a10-10-story-l1` | Two sel lessons in a row. | practice-done is now a literacy notice (ELOF Language and Communication): "Maui is frustrated. That means cross, because something will not work." / "Say it with me: frus-trat-ed. Have you ever felt frustrated?" | done |
| edu-a10-sprout | `a10-13-spiral-done-l1` → `a10-13-walk-l1` | Two sel lessons in a row. | spiral-done is now a literacy ask (`RL.K.3`): "Moana knows a secret now. Who is the fiery giant, really?" (best: "Te Fiti, without her heart"). The "hurting can look scary" idea moved into the walk-l1 prompt: "Te Kā is not bad. She is hurting, and hurting can look scary." | done |
| edu-a10-sprout | `a10-03-complete-l1` → `a10-04-falls-l1` | Two maths lessons in a row across the quest join (count tries, then position words). | a10-03-complete is now a sel notice (`CASEL: Relationship skills`): "You gave Gramma a hand up, and nobody made a fuss." / "Quiet help is kind. It lets people feel strong, not silly." Check `edu:count:tries:3` removed from CHECKS. | done |
| edu-a10-sprout | `a10-04-complete-l1` → `a10-05-council-l1` | Two sel lessons in a row across the quest join. | a10-04-complete is now a literacy recall ask (`RL.K.3`): "Gramma kept the green stone safe. Who gave it to Moana, long ago?" (best: "The sea"). This left A10-4 with no sel lesson, so `a10-04-falls-done-l1` (light) became a sel notice: "A friend nearby helps you feel brave." | done |
| edu-a10-reader | `a10-12-light-done-l1` | "Missing someone is love with nowhere to go" lifts a well-known modern quote; the Learning Grove allows no quotes. | "Missing someone is one of the ways we go on loving them." | done |
| edu-a10-reader | `a10-11-gap-done-l1`, distractor | Wrong sum: "6 is 20 ÷ 3 rounded" (it rounds to 7). | Option is now "20 minutes" with the reply "20 minutes is one kilometre. There are three, so 3 × 20 = 60." | done |
| edu-a10-reader | `a10-08-birds-l2` → `a10-08-birds-done-l1` | Two social-studies lessons in a row. The reply "Swap two turns and you end up somewhere else" is also false for dead reckoning: swapping legs gives the same end point. | Now a maths ask (`4.MD.A.2`): "If Moana sails east for 3 hours at 6 kilometres an hour, how far east has she come?" (18 km). Reply: "3 × 6 = 18. Keeping count of direction, speed and time like this is called dead reckoning." | done |
| edu-a10-reader | `a10-01-turtle-l1` → `a10-01-turtle-done-l1` | Two science lessons in a row. | turtle-done is now sel, `CASEL: Responsible decision-making` ("caring for wildlife responsibly"); lines unchanged. | done |
| edu-a10-reader | `a10-05-bedside-l1` → `a10-05-bedside-done-l1` | Two sel lessons in a row. | bedside-done (`edu:write:kind-words`) is now literacy, with no standard (no writing code is approved). | done |
| edu-a10-reader | `a10-04-complete-l1` → `a10-05-council-l1` | Two sel lessons in a row across the quest join. | council-l1 ("Is fear a good reason to make a rule?") is now social-studies, `D2.Civ.8.K-2`. | done |
| edu-a10-reader | `a10-07-escape-done-l1` → `a10-07-complete-l1` | Two social-studies lessons in a row. | escape-done is now a literacy ask (`L.3.4`) on the many meanings of "cross": "The pirates drift off “drumming crossly.” … Which one fits here?" (best: grumpy and annoyed). | done |
| edu-a10-reader | `a10-09-lair-done-l1` → `a10-09-complete-l1` → `a10-10-practice-l1` | Three science lessons in a row (crab, geyser, gills), across the quest join. | The geyser lesson is now literacy (`L.3.4`), the prefix un- in "undignified", which is Tamatoa's own word. Added a glossary entry, "undignified". | done |
| edu-a10-reader | `a10-12-complete-l1` → `a10-13-run-l1` | Two maths lessons in a row across the quest join. | a10-12-complete is now a science ask (`5-ESS1-2`): "Why does the Sun seem to rise every morning?" (best: the Earth spins). | done |
| edu-a10-reader | `a10-13-spiral-done-l1` → `a10-13-walk-l1` | Two sel lessons in a row. | spiral-done is now a science notice (`1-ESS1-1`): low tide can uncover sandbar paths, and tides are mostly the Moon's pull. The "someone scary may be hurting" thought moved into walk-l1's prompt: "Te Kā frightens you, but she is hurting. When is a gift, a word, or quiet walking with open hands the best way to reach someone like that?" | done |
| edu-a10-reader | `a10-13-complete-l1` → `-l2` | Two science lessons in a row (succession, then reefs). | Dropped the succession notice. The reef lesson (an outline angle) stays as the scene's single lesson. | done |
| edu-a10-reader | `a10-14-home-done-l1` → `a10-14-bow-l1` | Two social-studies lessons in a row. It also says "Each stone is added by a different person", which isn't true of cairns in general. | Now a literacy vocabulary notice (`L.2.4`): "A cairn is a pile of stones built as a marker or memorial. Here each chief has added a stone, so it holds a whole line of leaders." | done |
| edu-a10-reader | `a10-01-story-l1`, `a10-03-sand-done-l1`, `a10-06-maui-l1`, `a10-08-stars-l1`, `a10-08-birds-done-l1`, `a10-09-lair-l1`, `a10-14-farewell-done-l1`, `a10-05-complete-l1` | Lines of 161–171 characters, over the 160 cap. | Each trimmed or split; for example, the birds-done line is now "…with no compass and no map." / "Its navigator, Mau Piailug of Satawal in Micronesia, shared his knowledge with Hawaiian sailors, who have carried it on ever since." | done |

### A11 The Enchanted Place

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a11-reader | `a11-14-tunic` #2 | content-check: quotes q12's lifted line ("It's resting."). | `P('It isn’t sagging. It’s having a little sit-down.')` | done |
| edu-a11-sprout | `a11-14-tunic` #3 | Same Dead Parrot echo, paraphrased ("It is resting."), so the check doesn't catch it. | `P('It is not sagging. It is having a little sit-down.')` | done |
| edu-a11-reader | `a11-04-gloomy-done` #1 | "You’re a real friend. Not like some." is Milne's Eeyore line (WtP ch. IV). | "…You’re a real friend. Better than most." | done |
| edu-a11-reader | `a11-04-owl` #5 | "Customary Procedure" is Owl's phrase in Milne. | "…there is a Proper Procedure. First, one Issues a Notice." (keeps the glossary word *procedure*) | done |
| edu-a11-sprout | `a11-04-owl` #4 | Same "Customary Procedure". | `O('There is a Proper Way. First, one Puts Up a Notice.')` | done |
| edu-a11-reader | `a11-06-presents` #6 | "a Useful Pot to Keep Things In" is Milne's exact phrase. | "I shall give him a Useful Pot, for keeping things in." | done |
| edu-a11-reader | `a11-07-bath` #5, `a11-12-malt` #0 | "Strengthening Medicine" is Milne's. | "…a big spoonful of medicine, to make him strong." / "Roo is having his medicine." | done |
| edu-a11-reader | `a11-02-stuck` #11, `a11-02-stuck-done` lesson | "a Sustaining Book" is Milne's coinage. | "A sustaining sort of book, for a Bear in a Tight Place." The lesson now says "Pooh asked for a sustaining sort of book." The glossary word *sustaining* stays. | done |
| edu-a11-reader | `a11-10-complete` #0 | The pencils "B, for Bear, and HB, for Helping Bear, and BB, for Brave Bear" are near-verbatim Milne (ch. X). | "Inside are pencils with letters on them, B and HB and BB, and Pooh is sure every letter is about him." | done |
| edu-a11-sprout | `a11-10-table-done` lesson | Phonics error: "E says “eh”. Eh, eh, Eeyore." Eeyore starts with a long /iː/. | `N('Here E says “ee”, like the start of Eeyore. (Can you find an E?)')` | done |
| edu-a11-reader | `a11-11-complete` lesson, option "42 metres" | "That is a hundred times too big." 42 m is ten times 4.2 m. | "That is ten times too big. 420 cm is 4.2 m." | done |
| edu-a11-reader | `a11-02-week-done` lesson | Wrong physics: "For six days the door held Pooh as hard as the friends pulled." Nobody pulled until day 7. | "All week the door gripped Pooh tightly. That grip, between surfaces rubbing together, is called friction." / "By the seventh day Pooh was thinner, so the grip was weaker, and the long line of friends pulled harder than it held. Unbalanced forces: out he popped." | done |
| edu-a11-reader | `a11-15-owl-done` → `a11-15-a` | Two maths lessons in a row (time, then symmetry). | In `a11-15-a`, the sel ask now plays after=3 (just after "Eeyore’s ears go down") and the symmetry notice after=5 (just after "look at the A properly"). | done |
| edu-a11-reader | `a11-20-climb` → `a11-20-knight` | Two maths lessons in a row (the tree count, then factors). | In `a11-20-climb`, the tree-count do lesson now plays after=9 and the "doing Nothing" think question after=10. The scene now ends on sel. | done |

### A12 The Mirror Shard

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a12-sprout | `a12-06-garden-done-l1`, "Milk" reply | "Milk is for kittens" is wrong advice (cow's milk is bad for cats). | "Plants drink water. Milk is for people, not plants!" | done |
| edu-a12-sprout | `a12-16-found-l1` | Says Gerda cries "because she is so glad", straight after "He doesn't know her". | Replaced with a science ask after #6: "Gerda's tears are warm. What does warm do to ice?" (It melts it / It makes it bigger), 2-PS1-4. | done |
| edu-a12-sprout | `a12-04-complete` #2 | The town's river story was cut, so Gerda's "He would never go near the river" comes from nowhere. | "People in the town say Kay fell in the river." | done |
| edu-a12-sprout | FREE lines (`a12-10-free`, `-free-night`) | The loaves were cut, but `a12-10-complete` counts "two loaves, then one". | "Two loaves for the road. And don't cry. Look happy!" | done |
| edu-a12-reader | `a12-02-frost` #1 | "Copper carries heat well, so the coin stays hot" gets the physics backwards. | "Copper passes heat on quickly, so the coin melts the ice fast." | done |
| edu-a12-reader | `a12-09-castle-l1` | "grow back, bigger, every year" isn't true (antlers shrink again with age). | "Antlers fall off and grow back every year." | done |
| edu-a12-reader | `a12-13-bush-l2` | Polar night "for days or weeks": on Svalbard it lasts months. Also three sentences. | "You are far north of the Arctic Circle, where in midwinter the Sun doesn't rise for weeks, or even months. That's called polar night." | done |
| edu-a12-reader | `a12-17-doe-l2` | Midnight sun "for days or even weeks": the same error. | "…doesn't set at all for days, weeks or even months." | done |
| edu-a12-reader | `a12-15-puzzle-l1` | "That's how a lake can crack into matching pieces" presents the magic lake as real. | "Some shapes, like squares, triangles and hexagons, fit together with no gaps. Bees build honeycomb that way, and the lake is cracked like floor tiles." | done |
| edu-a12-reader | `a12-09-complete-l1` best reply | "Just as the robber girl said": she never said a hundred (the narrator did). | "Yes. Ten groups of ten is a hundred, the same hundred you saw asleep on the perches." | done |

### A13 The Wooden Boy

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a13-sprout | `a13-grove-pixel` #6 | "Pixel laughs, and puts his nose back on." Pixel is she/her, so "his" reads as Pixel's own nose (content-check pronoun warning). It is Clank's wick-winder nose. | "Pixel laughs, and puts Clank’s nose back on." | done |
| edu-a13-reader | `a13-grove-pixel` #7 | Same "puts his nose back on". | "…didn’t know they were carrying, and puts Clank’s nose back on." | done |
| edu-a13-sprout | `a13-02-street` | The crowd beat was cut, and "If that is how he treats his babbo, he can come with me" makes the carabineer arrest Pinocchio. The next scene then says Geppetto is led away. | Added "The crowd thinks the old man is being unkind to the puppet."; carabineer: "You, old man. You can come with me."; babbo notice now opens "Geppetto is Pinocchio’s babbo." (`after` 4). | done |
| edu-a13-sprout | `a13-07-harlequin` #1 | "He likes being called Your Excellency" follows "Have pity, Sir!", so nobody has said it. | "Have pity, Your Excellency!" | done |
| edu-a13-sprout | `a13-11-medicine-done-l1` | The sum is "two lumps + one more = 3", but the scene shows one lump and then a second. | 1 + 1 = 2: "Pinocchio ate one lump of sugar. Then he asked for one more." / "One lump, and one more. Count them: one, two lumps!"; check `edu:add:sugar-lumps:2` (CHECKS updated). | done |
| edu-a13-sprout | `a13-13-court-done-l1` | "Four months… Spring. Summer. Autumn. Winter." This teaches four months as the four seasons. | "Four months. Hold up four fingers and count them: one, two, three, four." / "Four months is a long, long time. Winter can turn into spring!" | done |
| edu-a13-sprout | `HUT` (`a13-20-hut`, `a13-20-hut-carried`) | The lesson's best answer is "He says sorry", but sprout cut his apology. The original has "Throw one at me. I deserve it." | Added P: "I am sorry about the mallet. Please forgive me."; cricket: "I forgive you. I only wanted to remind you."; lesson `after` moved to 4 and 5. | done |
| edu-a13-sprout | `a13-09-sacks-done` #1 and lesson | "Out pops a cat’s paw. It is only a cartoon paw!" A bitten-off paw is too much for ages 3–6, and "cartoon" breaks the frame. | "A sack grabs Pinocchio’s chin. Chomp! Pinocchio bites hard." / "The sack yowls just like a cat, and lets go."; rhyme lesson is now chin/pin. The later tucked paw still reads as a sore paw. | done |


## 3. Should fix

### A2 The Monkey and the Monk

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a02-sprout | A2-1 `hatch-done` → `heaven` | Two science lessons in a row. | hatch-done-l1 is now literacy (RF.K.2): "Gold! Gold rhymes with old and cold. Can you think of another?" | done |
| edu-a02-sprout | A2-5 `furnace` → `furnace-done` | Two sel lessons in a row. | furnace-l1 is now health: "The furnace is very hot. What do we do near a hot fire?" (Stay well back.) The waiting now sits in line 1: "Your Nubbin waits, like a good friend." | done |
| edu-a02-sprout | A2-6 `band-l2` → `complete-l1` | Two sel lessons in a row; complete has two lessons in five lines. | Dropped the complete-l1 notice ("We cannot be perfect…"); the count of five travellers remains. | done |
| edu-a02-sprout | A2-7 `guanyin` → `dragon` | Two sel lessons in a row. | guanyin-l1 is now science: "Willow trees love water. They often grow beside streams and ponds." | done |
| edu-a02-sprout | A2-8 `bear-l2` → `complete` | Two sel lessons in a row; bear has two lessons in six lines. | Dropped bear-l2; the "sorry about his tummy" choice already carries the kindness. | done |
| edu-a02-sprout | A2-11 `temple-l2` → `tree-l1` | Two sel lessons in a row. | Dropped tree-l1 (the truth ask); the "own" choice covers honesty, and the roots notice remains. | done |
| edu-a02-sprout | A2-12 `return` → `return-done` → `complete` | Three sel lessons in a row. | return-l1 is now literacy (RF.K.2), using the scene's own line: "Too and two sound the same!" complete-l1 is now maths: count the hands (Monkey's one and the monk's two make three), `edu:count:hands:3`, added to CHECKS. | done |
| edu-a02-sprout | A2-13 `swap-done` → `complete` | Two sel lessons in a row. | complete-l1 (give the gourd back) is re-tagged social-studies, which matches its D2.Civ.8.K-2 standard. | done |
| edu-a02-sprout | A2-14 `fire` → `fire-done` | Two sel lessons in a row. | fire-l1 is now maths, a do: carry the bucket three times, `edu:count:buckets:3`, added to CHECKS. Line 6 is now "You run with a bucket, three times." | done |
| edu-a02-sprout | A2-15 `twins-l2` → `which-l1` / `which-monk-l1` | Two sel lessons in a row on both paths. | Dropped twins-l2; line 7 now says "It cries, and that is okay." | done |
| edu-a02-sprout | A2-18 `road-l2` → `boat-l1` | Two sel lessons in a row. | Dropped road-l2 (two feelings at once); the Xuanzang notice remains. | done |
| edu-a02-sprout | A2-19 `turtle` → `turtle-done`, `rock` | Two sel lessons in a row. | turtle-done-l1 is now science ("Some turtles and tortoises live for more than a hundred years."). Dropped rock-l1 (drying), which would have made science twice in a row; the drying is now in line 0. | done |
| edu-a02-reader | A2-2 `stream-done` → `leap-l1`; `leap-done` → `king-l1` | Literacy twice and science twice in a row. | leap-l1 (Chinese characters) re-tagged social-studies. leap-done-l1 is now a literacy ask (L.3.4): what "shoot" means in "wet monkeys shoot in". | done |
| edu-a02-reader | A2-3 `pine-l1` → `pine-l2` | Two science lessons in a row. | pine-l1 (shadow-puppet theatre) re-tagged art, with no standard. | done |
| edu-a02-reader | A2-5 `palm-l1` → `palm-done-l1` | Two sel lessons in a row; palm-l1 carried a literacy code (RL.3.6) on a sel lesson. | palm-l1's standard is now CASEL: Social awareness. palm-done-l1 is now science: "evidence tests a claim" (the writing on the finger). | done |
| edu-a02-reader | A2-6 `road-l2` → `road-done` → `seal-l1`; `seal-done` → `band` | Science three times and sel twice in a row. | road-done-l1 is now a literacy inference: "a voice you know", so whose voice is it? Line 1 was "You feel it in your chest, a moment after you hear it", which is wrong physics; it is now "It sounds like someone who has been shouting at nobody for five hundred years." seal-done-l1 re-tagged literacy (RL.3.3). | done |
| edu-a02-reader | A2-7 `guanyin-l2` → `dragon-l1` | Two sel lessons in a row. | dragon-l1 is now a literacy ask on "ashamed" from the scene's own line. The amends point stays in the best reply. | done |
| edu-a02-reader | A2-8 `bear-l1` → `complete-l1` | Two sel lessons in a row. | complete-l1 is now literacy: what "the one" and "the other" refer to in Guanyin's line. | done |
| edu-a02-reader | A2-10 `under-done` → `moksa` | Two science lessons in a row. | under-done-l1 is now literacy (L.4.5), personification in "Your lungs feel very glad to be lungs". Glossary gains "personification". | done |
| edu-a02-reader | A2-11 `temple-l2` → `tree-l1` | Two sel lessons in a row. | Dropped tree-l1 (the "own" choice covers honesty). | done |
| edu-a02-reader | `a02-11-complete` → `a02-12-girl`; `a02-13-complete-l2` → `a02-14-pine` | Literacy twice and sel twice in a row across quests. | girl-l1 re-tagged sel (CASEL: Responsible decision-making). girl-done-l1 is now literacy (RL.2.3): what Monkey's silence shows. Dropped 13-complete-l2; gourd-l2 is still A2-13's sel think question. | done |
| edu-a02-reader | A2-14 `lotus-l2` → `complete-l1` | Two sel lessons in a row. | Dropped lotus-l2; the lotus science notice remains. | done |
| edu-a02-reader | A2-15 `which-l2` / `which-monk-l2` → `named-l1` | Two science lessons in a row on both paths. | Dropped both "scientists say we don't know yet" notices and folded the idea into which-l1's "say it plainly" reply. | done |
| edu-a02-reader | A2-17 `cottage-l2` → `cottage-done-l1` | Two science lessons in a row. | cottage-l2 is now maths: 7 spiders × 8 legs = 56, and the reply keeps the spider-or-insect fact. | done |
| edu-a02-reader | A2-19 `turtle-done` → `rock-l1` | Two science lessons in a row. | turtle-done-l1 is now social-studies, on oral history: Monkey's tales were told in teahouses and on stages before and after the novel. This is theme 4. | done |
| edu-a02-reader | about 40 lines, e.g. `a02-01-page-done-l1`, `-hatch-l1`, `-complete-l1/l2`, `a02-05-furnace-l1`, `-palm-l1`, `-palm-done-l1`, `a02-06-band-l1`, `a02-07-stream-l1`, `a02-09-backhouse-done-l1`, `a02-12-girl-l1`, `a02-14-fire-l1`, `a02-16-ask-l2`, `-ask-done-l1`, `-fake-l2`, `a02-17-web-l2`, `a02-18-scriptures-l2`, `-complete-l1`, `a02-15-which-monk-l1` | Narration of three sentences. | Merged with "and", "but", "because", a colon or a semicolon, or split into two lines. Example: "Fifty thousand li is about 25,000 kilometres, and the Earth is about 40,000 kilometres round. Has Monkey flown…" | done |
| edu-a02-sprout | about 15 lines, e.g. `a02-01-complete-l1`, `a02-04-garden` #4, `-stables-done-l1`, `a02-05-mountain` #1, `-palm-done-l1`, `a02-07-complete-l1`, `a02-12-girl-done`, `a02-15-snatch` #0, `a02-16-fake` #4, `-real` #4, `a02-17-web` #3 | Narration of three full sentences. Interjections like "Crack!" and "Yes!" don't count, so short read-aloud refrains were kept. | Merged and kept at 14 words or fewer, e.g. "Monkey is under it. He is not hurt, only stopped." and "Round three rocks, under a root, to a peg at the back." | done |
| edu-a02-sprout | `a02-03-lesson-l1`, `a02-08-fire-done-l1`, `a02-19-complete-monk-l1` | Lesson plays before what it is about: before the name Wukong is said, before the robe is gone, and before the monk says "both a little right". | `after` 0 → 1, 0 → 2 and 3 → 4. | done |
| edu-a02-reader | `a02-12-girl-l1`, `a02-07-stream-done-l1` | Same problem: the girl ask quotes Pigsy's claim before he makes it, and the headband ask comes before Monkey mutters. stream-done-l1's best option also named Guanyin before the next scene reveals her. | `after` 7 → 8 and 0 → 1. Option is now "The old woman on the road, who gave the cap"; the wrong reply ends "That points to the old woman with the cap." | done |
| edu-a02-sprout | `a02-04-banquet` / `a02-04-complete` | Continuity: the maidens are never frozen in sprout, yet "wake up" in complete. | banquet #4 now reads "He makes the maidens freeze like statues." and #5 "Then he eats the whole feast, and the magic pills too." complete #3 now reads "The fairy maidens unfreeze at last and see the empty trees." | done |
| edu-a02-sprout | `a02-19-home` | Continuity: sprout never says Monkey became a buddha, or that the band went, yet complete opens "Gone." | #4 is now "The Buddha gives each of them a new name. Monkey is a buddha now!" Added #7: "Monkey touches his head. The band is gone!" | done |
| edu-a02-reader | `a02-01-page-l2`, option "72 metres" | "Close in the digits. 2 × 7 is 14. Seven twos…" makes no sense. | "That puts the 7 and the 2 side by side." / "Two trips of seven metres is 2 × 7 = 14 metres." | done |
| edu-a02-reader | `a02-05-mountain-l2` | Moss spreading on a stone is not an Earth change, and "real moss takes years too" is weak. | "Some changes to the Earth are fast, like a rockfall. Others are very slow, like a river carving out a valley." / "Monkey's mountain will sit there for five hundred years, slowly gathering grass and moss." | done |
| edu-a02-reader | `a02-13-complete-l2`, best reply | "he also owns a lot of fuss" was muddled. Later dropped for the cross-quest run (see above). | Rewrote it first; the lesson then went. | done |
| edu-a02-sprout | `a02-09-backhouse-done-l1` | "Flowers need water and light", said of picked flowers. | "Picked flowers still need water. Your Nubbin finds a cup for them." (K-LS1-1). | done |
| edu-a02-sprout | `a02-04-garden-l2`, `a02-05-complete-l1` | Wrong standards (2-LS2-1 for a seed in fruit, 2-ESS1-1 for a seed growing), and garden-l2 never says the seed grows, though its parent note claims it. | Both standards are now ELOF: Scientific Reasoning. Added "The seed can grow into a new peach tree." | done |
| edu-a02-sprout | `a02-04-complete-l1` | The music beat had five sentences, with the grown-up's prompt outside brackets. | "A helmet can ring like a drum." / "(Tap softly on the table. Now tap loudly. Can you hear the difference?)" | done |
| edu-a02-sprout | `a02-01-complete` #5, `-06-road-l2`, `-08-bear` choice, `-10-under-l1`, `-11-mend-l2`, `-14-fire-done-l1`, `-16-complete-l1`, `-17-cottage` #3 | "Nubbin" without "your", which reads as a name. | "your Nubbin" throughout. | done |
| edu-a02-sprout | `a02-08-fire` #1, `a02-10-moksa` #1 | "lit a fire to hide a robe trick" is clumsy; "The monk you wait for" is a tense slip. | "Greedy monks lit the fire. They want to keep the robe." / "The monk you were waiting for is on the bank." | done |

Counts: **8 must fix (8 done), 39 should fix (39 done)**.

### A5 The Lion of Mali

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a05-sprout | `a05-02-fire` | Sprout cut the versions, so the choice "Ask which one Balla believes" had nothing to point to. | Added Balla line 7: "Some say the old woman was the buffalo. Some say she was Sogolon's aunt." | done |
| edu-a05-sprout | `a05-03-house` #6 | "His son is the king now." is ambiguous, because Mari Djata is also the old king's son. | "I'm very sad. His older son, Dankaran, is king now." | done |
| edu-a05-sprout | `a05-07-djedeba` choice `count` | "He liked the company." slips out of present tense. | "You count under your breath, and Sundiata nods. He likes the company." | done |
| edu-a05-sprout | `a05-07-wagadou-done` #2 | "(Goat rhymes with boat.)" gives the answer away just before the rhyme question. | "(Think of the two men and their goat.)" | done |
| edu-a05-sprout | `a05-08-army-l1` | Promises "count to twenty" but counts in fives ("Five, ten, fifteen, twenty!"), which is too hard for 3–6. | "One, two, three… all the way to twenty!" | done |
| edu-a05-sprout | `a05-12-watch-done-l1` | sel lesson tagged with an English standard (RL.1.4). | ELOF: Social and Emotional Development. | done |
| edu-a05-sprout | `a05-14-complete` | 11 lines, over the sprout maximum of 10. | Lines 2–3 merged: "Your Nubbin plays the hunters' tune. The whole ring stamps along!" The lesson now comes after line 2. The lullaby variant got the same merge (12 → 11). | done |
| edu-a05-sprout | 37 narrator lines | Three-sentence narration, mostly fragment runs ("Dust! Round houses! Smoke!", "Months of road. Thorn trees. Dry river beds. A huge sky."). | Joined with colons and commas: "You step into the page: dust, round houses, smoke!", "Months of road: thorn trees, dry river beds, a huge sky." Every line is still at most 14 words. | done |
| edu-a05-reader | `a05-01-court-l1` | social-studies lesson tagged L.3.4. | D2.His.2.K-2. | done |
| edu-a05-reader | `a05-01-page-done-l1`, `a05-05-complete-l1` | Balla speaks of himself in the third person ("Even Balla would say he's not sure", "Balla has said he'll tell us which door"). | "That's a fair answer. To be honest, I'm not sure myself." / "That's a good hunch. I did say I'd tell you which door." | done |
| edu-a05-reader | `a05-03-house-l1` | "the dry season is the time for harvest and rest": the harvest comes as the rains end. | "The rains grow the crops, which are harvested as the dry season begins." | done |
| edu-a05-reader | `a05-08-mat-done-l1` | "Grief is love with nowhere to go" is a well-known saying, not our line. | "Grief comes from love, and it softens with company." | done |
| edu-a05-reader | `a05-09-chamber-done-lullaby-l1` | "Music is processed close to the memory and feeling parts of the brain" is shaky neuroscience. | "Music and memory are closely linked: a tune heard long ago can bring back a person, a place and a whole feeling, years later." | done |
| edu-a05-reader | `a05-12-list-l2` | A keystone arch is out of place in mud-brick, thatched Niani. | "The first line of a telling is like the centre pole of a tent. Everything else hangs from it." (They are in Sundiata's camp.) | done |
| edu-a05-reader | `a05-14-complete-l*` (both variants) | The Sosso-Bala lesson was tagged 4-PS3-2 (energy). It also missed the best link in the page. | Standard changed to D2.His.2.K-2. Added: "Tradition says it is Soumaoro's own great balafon, the one Balla played in the tower." | done |
| edu-a05-reader | glossary | "heir" (`a05-08-army-done`, `a05-10-basket`) and "intangible cultural heritage" (`a05-14-assembly`) are used without entries. | Added both entries. `a05-14-assembly` now has two words, which is within the cap. | done |
| edu-a05-reader | 29 narrator lines | Three-sentence narration, mostly "Yes. 7 × 12 = 84. Comment." and "Fact. Fact. Question?" | "Yes: 7 × 12 = 84. …". Facts are joined with "and" or a semicolon, for example "Sogolon waited for years, and now Sundiata waits for Balla. How are the two waits alike?" | done |

### A6 Seven Voyages

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a06-sprout | `02-island-done` → `02-tub` | Science twice in a row; the tub's pitch lesson also had the wrong standard (K-LS1-1) | Tub lesson is now music, "high and low sounds", with no standard | done |
| edu-a06-sprout | `08-telling-done` → `08-dark` | Science twice in a row | telling-done is now literacy (ELOF: Language and Communication): "Dark and light are opposites…" / "Dark and light. Big and small. Can you think of another pair?" The dark lesson's standard K-ESS2-1 (weather) becomes ELOF: Scientific Reasoning | done |
| edu-a06-sprout | `07-complete` → `08-telling` | Sel twice in a row | 07-complete is now maths: "Three voyages so far! Hold up a finger for each one: one, two, three." Check `edu:count:fingers:3` replaces the now-unused `edu:count:fingers:7` in CHECKS | done |
| edu-a06-sprout | `09-complete` → `10-bank` | Sel twice in a row | The good-listening ask is retagged literacy, SL.K.1 | done |
| edu-a06-sprout | `12-complete` → `13-palace` | Literacy twice in a row | 12-complete is now a sel notice: "A sailor washed up, and two kings became friends." / "Friendships can start in surprising ways. How did you meet a friend?" | done |
| edu-a06-sprout | `14-herd-done` → `14-gate` | Sel twice in a row, and the auto-split left a lowercase line, "who might be helped?" | Now a health ask (ELOF: Perceptual, Motor, and Physical Development) on Sinbad's ankle: "Rest it, and ask a grown-up for help." | done |
| edu-a06-sprout | `08-telling` | The wife's death had no comfort straight after (EDU-STYLE, hard things) | New line after the death line: S "I held her hand at the end. I still remember her with love." (soft). Lesson `after` moves 6 → 7 | done |
| edu-a06-sprout | `01-hall` #3–4 | "Sit, sit! Eat first." / "You heard me say that?" doesn't follow, because sprout has no line for him to have heard | "Sit, sit! Eat first. Lamb is better than grumbling." / "You heard me grumble?" | done |
| edu-a06-sprout | `04-left-done-l1` | Compares the tree with "the little bush", which isn't in the scene | Line 1: "From the top, you can see everything. The bushes below look tiny!"; the lesson now says "the bushes" | done |
| edu-a06-sprout | `05-meat-l1` | "Sinbad took lots of stones", but sprout never shows him taking any | "Sinbad wants lots of stones. You can take a little, or take none." | done |
| edu-a06-sprout | `10-coconuts-l1`, wrong reply | Auto-split mid-sentence: "The sea is nearby," / "but it is…" | "The sea is close by. But food and a safe place matter most." | done |
| edu-a06-sprout | `11-coast-l1` | "Water always rolls down"; the line also clashes with this river running into a cave | "Rivers flow downhill. Most run all the way to the sea." / "Water always flows down, not up, like a ball rolling down a slope." | done |
| edu-a06-sprout | `15-street-kept`, choice `nubbin` | Auto-split left "wrong." alone on a line | "She feeds it lentils, one at a time." / "She tells it the whale story, all wrong, and very proudly." | done |
| edu-a06-sprout | 17 scene narration lines (01-street #1, 02-tub #3, 02-tub-done #0, 03-harbour #0, 04-left #4, 04-dome #2, 04-dome-done #1, 04-leg #4 and choice `look`, 05-valley choice `breath`, 05-valley-done #0, 05-meat #0, 06-castle #4, 06-gate-done #1, 06-raft #2, 07-box #2, 08-tunnel #2, margin-hazel) | Narration of three or four sentences | Merged into two, e.g. "You touch the river and, whoosh, you are in a busy lane!", "A day goes by, then a night, then another day." | done |
| edu-a06-reader | `01-bench` → `01-bench-done` | Sel twice in a row | The fairness think question is retagged social studies, D2.Civ.8.K-2 (fairness) | done |
| edu-a06-reader | `01-hall-done-l1` | Literacy twice in a row. It also teaches "as if it might send him a bill" as a "simile-like joke", which muddles simile | Replaced with a sel ask (CASEL: Social awareness), "He feels out of place. What could help him feel welcome?", best "The host saying “eat first” and sharing his own name." | done |
| edu-a06-reader | `02-island` → `02-island-done` | Science twice in a row; `02-tub-done` also repeated A6-6's balanced-forces float lesson | island-done is now literacy (L.3.4): what "shudders" means from context. The whales-are-mammals notice moves to tub-done, replacing the duplicate float lesson, and the `mammal` gloss moves with it. island-l1's unfitting 4-LS1-1 is dropped | done |
| edu-a06-reader | `05-lift-done` → `05-complete-left` | Sel twice in a row (stone left) | The wise-or-silly think question is retagged social studies, D2.Eco.1.K-2 (scarcity means choosing) | done |
| edu-a06-reader | `07-complete` → `08-telling` | Sel twice in a row | 07-complete is now literacy (RL.2.4): why "Never again" keeps coming back, best "It’s a running joke: he always swears it, and always sails again." | done |
| edu-a06-reader | `08-telling-l1` → `-l2` → `08-telling-done` | Three sel lessons in a row | The custom think question (l2) is retagged social studies, D2.Civ.8.K-2 (rules) | done |
| edu-a06-reader | `08-dark` → `08-dark-done` | Science twice in a row | dark-done is now a literacy ask (RL.4.3): "“It has the walk of somebody who knows the way home.” What is the writer hinting…?" The whiskers-and-smell fact is kept in the best reply | done |
| edu-a06-reader | `09-egg-l2` → `09-egg-done` | Science twice in a row | The warning lesson moves to `after: 5`, so sel sits between the two science lessons | done |
| edu-a06-reader | `09-complete` → `10-bank` | Sel twice in a row | Reframed as character (RL.3.3): "What do his words show about him?", best "He is honest about his own part, without taking all the blame." | done |
| edu-a06-reader | `13-palace-l1` → `-l2` → `13-palace-done` | Three literacy lessons in a row | l2 becomes sel (CASEL: Relationship skills): is the Caliph's tease kind or unkind? Best "Kind: Sinbad can laugh too, and nobody is made small." | done |
| edu-a06-reader | `14-herd-done` → `14-gate` | Sel twice in a row | herd-done becomes a health notice on a sprained ankle (rest, keep weight off, cool it, get it checked) | done |
| edu-a06-reader | `14-complete` → `15-quay` | Science twice in a row (told path) | The load-line notice moves to `after: 5`, after the sel homecoming question | done |
| edu-a06-reader | `15-quay-kept-l2` → `15-street-kept` | Sel twice in a row (kept path) | The contentment notice is retagged literacy, L.3.4 (word meaning) | done |
| edu-a06-reader | `15-complete-l2` → `16-telling` / `-telling-nothing` → `16-telling-done` | Literacy three times in a row | Both oral-storytelling notices are retagged social studies, D2.His.2.K-2 ("oral history and how stories carry the past"). The nothing variant is rewritten to match: "“I had nothing, so I listened” is how every teller starts…" | done |
| edu-a06-reader | `16-tell` → `16-complete` | Sel twice in a row | The whose-story think question moves to `after: 5`, so the social-studies notice plays first | done |
| edu-a06-reader | `14-tree-done-l1` | A moral think question had a `best` marked, although both replies are "a fair answer" | `best` removed; it is now a true think question | done |
| edu-a06-reader | `14-complete-l1` | "Today most countries ban trading in new ivory" is loose | "Selling ivory across borders has been banned since 1989." (CITES) | done |
| edu-a06-reader | `03-proof-l2` #1 | The jeans-fading explanation is muddled | "Indigo clings to the outside of each thread instead of soaking right in, so it rubs off bit by bit. That’s why blue jeans fade." | done |
| edu-a06-reader | `03-shore-done-l1` #1 | Overclaims that harbour lists are how we know Indian Ocean trade | "Old lists, letters and accounts like these are how we know about trade across the Indian Ocean a thousand years ago…" | done |
| edu-a06-reader | `16-complete-l2` | "first written in Arabic, with a Persian-style frame" is fuzzy | "…the Thousand and One Nights was written down in Arabic. Its frame story came from an older Persian book." / "Sinbad’s tales joined it, and it was later translated into French, English and many other languages." | done |
| edu-a06-reader | glossary | `quay` points to `03-harbour`, where the word doesn't appear; `quay` (A6-15) and `habitat` (A6-10) are duplicates | 03-harbour #1: "One morning a dhow ties up at the quay…". The A6-15 entry is now `load-line`; the A6-10 entry is now `temper` (from "pebbles and a bad temper") | done |

### A7 The Marigold Bridge

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a07-sprout | a7-01-petals, line 6 | "The smell helps families find their way home": the custom is that it guides the loved ones who have died | "They are bright, and they smell strong." / "That helps loved ones who have died find their way home." | done |
| edu-a07-sprout | a7-02-hideout-done, line 2 | "The attic is above the shop. The shop is below." gives the answer just before the above/below ask | "Down, down, down. Now you are in the shoe shop." | done |
| edu-a07-sprout | a7-04-bridge-done-l1 | "carve them from wood" leaves out papier-mâché, which is how alebrijes began | "Artists in Mexico make them from paper or wood." | done |
| edu-a07-sprout | a7-04-complete-l1 | a weak ordinal lesson ("one, two… second floor"), and maths running into the a7-05 maths across the quest join | replaced with science K-LS1-1 about the glowing petal: "What does a plant need to grow?" Sun, water and soil | done |
| edu-a07-sprout | a7-05-complete-l1 → a7-06-alley-l1 | sel then sel across the quest join | the worry/tight-tummy notice re-domained to health | done |
| edu-a07-sprout | a7-06-alley, choice `trust` | "I’ll do my best" then "Miguel shakes his hand anyway": the "anyway" no longer makes sense, and the honesty beat is lost | "Honestly? Not always. But I will help you, amigo." / "Miguel likes that he told the truth. They shake hands." | done |
| edu-a07-sprout | a7-06-shantytown, lines 5–6 | "that means he has died" said of a skeleton who is already dead confuses 3–6s, and the comfort is weak ("nobody was scared") | "Chicharrón has faded. That means he is gone, and won’t come back." / "He wasn’t hurt. He went laughing at his favourite song." | done |
| edu-a07-sprout | a7-06-name-done | the standard RL.1.4 sits on a sel lesson, and line 2 states the answer ("You can tell he is happy") | standard → ELOF: Social and Emotional Development; line 2 → "Look at his face. Look at that big smile." | done |
| edu-a07-sprout | a7-07-row, choice `follow` | "because you promised": the player only promised on the `keep` path of a7-05-run | "You go after Miguel, because Mamá Imelda asked you to." | done |
| edu-a07-sprout | a7-08-gate-l1 | "strum and blow" piles, but violins are bowed, not strummed | piles "strings and blow"; check renamed `edu:sort:instruments:strings-blow` in the lesson and in CHECKS | done |
| edu-a07-sprout | a7-12-complete and all 5 epilogue variants (`E_COCO`) | drops the original's comfort beat (Coco crossing the bridge with her papá) straight after the death | E_COCO: "Mamá Coco died in the spring, with her family round her." / "That means her body stopped working, and it won’t start again." / "Her photo is on the ofrenda now, beside her papá’s." / "Tonight she crosses the marigold bridge to visit, holding his hand." The lesson now plays after=5 and no longer repeats the body line | done |
| edu-a07-sprout | E_FREE | "lets him play" has no antecedent | "lets Miguel play as long as he likes" | done |
| edu-a07-sprout | a7-01-complete:1, a7-05-queue:1, a7-08-gate-done:1 | narration of three sentences | "Nobody hums, and nobody taps a spoon. The house is oddly quiet." / "You take a ticket that says 5. The board says 3." / "He is tall, in a white suit. Your Nubbin is small." | done |
| edu-a07-sprout, edu-a07-reader | file header | "all 7 variants": there are 8 | "all 8"; the sprout header's Chicharrón note updated to match | done |
| edu-a07-reader | a7-01-plaza-l1 | "north of Guatemala" leaves out Belize | "north of Guatemala and Belize" | done |
| edu-a07-reader | a7-01-petals-l1 | "strong scents attract bees": a marigold's sharp smell is better known for keeping pests off, so the claim is shaky | "Why are marigolds so bright?" / "Bright petals help attract bees and butterflies…" | done |
| edu-a07-reader | a7-02-hideout:4, a7-11-screens:3 | narration of three sentences | "He plucks a string, and a note hangs in the air. Your Nubbin sways…" / "Every screen in the stadium is showing his face, and thousands of the dead have heard every word. He has confessed…" | done |
| edu-a07-reader | a7-02-square | "The mariachi Miguel was borrowing from" refers to a set-up line the reader cut; the glossary placed "mariachi" in a7-08, not where the word first appears | restored "A mariachi with a kind face lets Miguel try his guitar on a bench."; line 4 → "The mariachi suddenly remembers…"; lesson after 4→5; glossary moved to a7-02-square with the meaning "…or one of its musicians" | done |
| edu-a07-reader | a7-03-visitors-done-l1 reply | "A tíos pair can mean aunts and uncles together" is unclear | "The plural, tíos, can mean uncles, or aunts and uncles together." | done |
| edu-a07-reader | a7-06-shantytown, line 7 | "he has died" said of a skeleton | "Chicharrón has faded, which in this story means he is gone for good." | done |
| edu-a07-reader | a7-07-stage-l2 | standard 4-PS3-2 (energy) on a clap-the-beat lesson doesn't fit | standard removed | done |
| edu-a07-reader | a7-07-row, choice `follow`; a7-09-complete, line 0 | assumes the a7-05-run `keep` promise | "…because Mamá Imelda asked you to." / "You jump after them, because you are not letting Miguel go alone." | done |
| edu-a07-reader | a7-09-toast, lines 3–4 | a meta narration line ("That is the hard part of this story, and it is said once and plainly"); the script's note asks the Learning Grove to soften the poisoning further, but "you put something in his drink" was kept | Miguel: "You… you did something to him. You stopped him going home." Narrator: "Héctor died that night, long ago. That is why he never came back to his family." Header comment updated | done |
| edu-a07-reader | a7-12-song-done and -promise, line 1 | "is one quarter of the whole photograph" gives the fraction away before the ask; "cut into 4 equal parts" isn't true (the photo was torn) | "Imagine folding the photo in half, and in half again. Coco’s corner would fill exactly one of the equal parts." Prompt: "Folded in half twice, a photo has 4 equal parts…" | done |

### A8 The Twelve Tasks

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a08-sprout | `a08-02-track-done` → `a08-02-race` | Two literacy lessons in a row. | track-done-l1 → count down "Three, two… What comes next?" One!/Four (maths, ELOF: Mathematics Development). | done |
| edu-a08-sprout | `a08-08-mouth` → `a08-08-mouth-done` | Two science lessons in a row. The mouth lesson also repeated A8-6's light lesson (1-PS4-2). | mouth-l1 → say the sound word "rumble", low and slow (literacy, RL.1.4, `edu:say:sound-word:rumble`, after 2). | done |
| edu-a08-sprout | `a08-12-ghosts` → `a08-12-ghosts-done` | Two literacy lessons in a row. | ghosts-done-l1 → "Say 'clank' loudly, now softly… Near sounds are loud. Far sounds are quiet, and the ghosts are far off!" (science, ELOF: Scientific Reasoning). | done |
| edu-a08-sprout | `a08-14-tie-done` → `-bard-boar` / `-useful` → `a08-14-complete` | Literacy three times in a row on the boar and plain paths. | bard-boar-l1 → make a knuckle print like Obelix's boar signature (art, ELOF: Perceptual, Motor…, `edu:print:knuckle:paper`). useful-l1 → "Your form did not win, but it is useful. How can you feel?" (sel, CASEL: Self-awareness). | done |
| edu-a08-reader | `a08-01-map-done` → `a08-01-square` | Two literacy lessons in a row. | map-done-l1 reframed as "Why might a big person move gently near someone small?" (sel, CASEL: Social awareness). | done |
| edu-a08-reader | `a08-02-track-done` → `a08-02-race` | Two literacy lessons in a row. | track-done-l1 → units: "The stade at Olympia was about 192 metres. Five stades would be 960 metres, nearly a kilometre." (maths, 4.MD.A.1). The "stadium" origin moves into the narration. | done |
| edu-a08-reader | `a08-09-a39` → `a08-09-a39-done` | Two sel lessons in a row. | The a39 think question is re-tagged social-studies, D2.Civ.8.K-2 (fairness of systems). | done |
| edu-a08-reader | `a08-13-arena` → `a08-13-arena-done` | Two sel lessons in a row. | arena-done-l1 → what "It will be a new experience" says about Caesar (literacy, RL.3.3). The good-loser idea is kept in the best reply. | done |
| edu-a08-reader | `a08-14-useful` → `a08-14-complete` | Two literacy lessons in a row. | useful-l1 → a think question, "How do you feel when a good idea loses on the day?" (sel, CASEL: Self-awareness). The clear-writing point is kept in one reply. | done |
| edu-a08-sprout | `a08-09-form` choice `boar` label | 16 words, over the sprout cap of 14. | "The Pink-and-Blue Form: Proof You Are Not a Boar, signed by a boar." | done |
| edu-a08-sprout | `a08-01-square` choice `yes` | Grammar: "A referee who is nobody's side!" | "A referee who is on nobody's side!" | done |
| edu-a08-sprout | `a08-03-complete` #0 | Swift is "her"; the original uses "its" (only the saved javelin is "her"). | "Verses wraps Swift up in its silk again." | done |
| edu-a08-sprout | `a08-07-feast` #4 and lesson | "You share a crust with your Nubbin and the dog" clashes with the `scraps` choice ("There are no scraps. Obelix gives them each a crust"). | "Your Nubbin and the dog look at the clean plates. Hungry!" The ask becomes "What kind thing could we do?" Share/Eat it all ourselves. | done |
| edu-a08-sprout | `a08-09-form-done-l1` #1 | "A says ah, like Asterix" is the wrong phonics: the A in Asterix and apple is short. | "A makes the sound at the start of apple and Asterix: a, a, a!" | done |
| edu-a08-sprout | `a08-13-arena` #1 | Counts "the lions" to three in Latin, but the scene never says how many lions there are. | "Three lions come out. Big lions!" The prompt becomes "(Count the lions in Latin: unus, duo, tres. One, two, three!)" | done |
| edu-a08-sprout | 11 scene and choice narration lines, 8 lesson lines | Three-sentence narration, e.g. "He turns. He tucks. He turns again.", "V is five. I before it takes one away. IV is four!" and "It is not growling. It is trembling. It is scared." | Merged to two sentences each. For example: "He turns and tucks, and turns again." / "Four tasks done. Only eight to go!" / "It is not growling. It is trembling, because it is scared." | done |
| edu-a08-sprout | `a08-02-complete-l1` skill | The skill reads "one more and count to 12"; the lesson only shows I. | "I is one". | done |
| edu-a08-reader | `a08-01-map` #3, `a08-08-beast` #1, `a08-10-complete` #4 | Three-sentence narration. | "You touch the green dot, and it is warm and smells faintly of roast boar. Then…" / "It is not growling but shaking. Whatever it is…" / "You scratch a ninth mark: IX, which is X, ten, with an I in front. One less than ten is nine." | done |
| edu-a08-reader | `a08-02-track-done` #1 | Pupus, a Roman, compares the stade to football pitches, and "about two" overstates it (192 m against about 210 m). | Now narration: "The road is one stade long: the length of a Greek running track, nearly two football pitches end to end." | done |
| edu-a08-reader | `a08-03-field-l1` #0 | "clever mathematicians" isn't a well-established fact for ancient Persia. | "It was famous for its long roads, fast messengers and fine gardens." | done |
| edu-a08-reader | `a08-05-complete` #3 and lesson | "not IIII, but IV": the Romans often wrote IIII. | "You scratch a fourth mark on the tablet: IV. Pupus nods." The lesson adds: "Romans sometimes wrote IIII too, but IV is the usual way today." | done |
| edu-a08-reader | `a08-09-complete-l1` #0 | "Never more than three of the same symbol" was stated as absolute. | "The usual rule is never more than three of a symbol in a row, so next comes IX." | done |
| edu-a08-reader | `a08-06-stare-done-l1` prompt | "'a mind like a sieve'" comes from nowhere, and "which of these" was ambiguous. | "Iris's eyes “glowed like embers”. That uses “like”, so it is a simile. Which of these is a metaphor instead?" | done |
| edu-a08-reader | `a08-07-kitchen-l1` #0 | "among the bravest" understates Caesar (Gallic War 1.1). | "Caesar himself wrote that they were the bravest of all the Gauls." | done |
| edu-a08-reader | `a08-08-mouth-l1` #1 | "a few centimetres in a hundred years" is high for typical stalactite growth. | "Many stalactites grow only about a centimetre in a hundred years." | done |
| edu-a08-reader | `a08-05-isle` #6 | "Is there any boar? So no boar, then." merges the hostess's reply and loses the joke. | The hostess's line is back ("We have honey, and figs, and peaches, and little cakes with…"), then O: "So no boar." The lesson `after` moves to 8. | done |
| edu-a08-reader | `a08-11-complete-l1` | States "Two Vs make X" as fact, contrary to the writer log, and the tally theory was muddled. | "Nobody is sure where it came from. One idea is tally sticks, where every tenth notch was marked with a cross." / "Another idea is two Vs joined point to point… A neat sum, if it is true." | done |
| edu-a08-reader | `a08-12-camp-done` #1 | Pupus gives the legion facts in the scene, then the notice repeats them. | "A whole legion, with a centurion at the front. Or what is left of them." The glossary words stay in the scene. | done |
| edu-a08-reader | `a08-11-climb-l1` #1 | "a 20 °C valley has a summit about 14 °C at 1,000 metres up" is muddled. | "So if the valley is 20 °C (68 °F), a spot 1,000 metres higher is about 14 °C (57 °F)." | done |
| edu-a08-reader | `a08-14-square` #3 | Pupus says "amicable" just before the lesson asks which word comes from *amicus*. | "Amicus is Latin for friend. I should like to be yours, if a Roman is allowed." | done |
| edu-a08-reader | `a08-14-tie` think question, option 3 reply | "better than a trick, and a net": the net only exists on the `plain` path, and this plays before the variant. | "…it usually works better than tying anybody up." | done |
| edu-a08-reader | `a08-02-race-done` think question | Two replies scold instead of honouring the child's reasoning (EDU-STYLE). | "A kind wish. But he would know it was not true, and honest praise lasts longer." / "A fair answer. Some people want space after losing. A kind word can still help later." | done |
| edu-a08-reader | `a08-04-complete-l1` standard | 3.OA.D.8 (two-step) on a one-step 12 − 3. | 2.OA.A.1. | done |
| edu-a08-sprout | header | Lists "panis", which is never taught. | Removed. | done |

### A9 The Comet

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a09-sprout | `a09-01-valley-done` lesson | The outline's "Finland and its two languages" was missing from sprout (only Finland was taught). | "The Moomin books come from Finland. Tove Jansson wrote them." / "Finland has two languages: Finnish and Swedish." parentNote updated. | done |
| edu-a09-sprout | `a09-01-hammock` lesson prompt | "The Muskrat says a comet is a star with a tail" reinforces the misconception in a teaching line. | "A comet is not really a star, but it shines like one." | done |
| edu-a09-sprout | `a09-01-complete` lesson | "Near the Sun, a comet warms up and glows. The glow is its tail." is loose. | "Near the Sun, it warms up. Gas and dust stream off it." / "The Sun lights them up. That shining stream is its tail." | done |
| edu-a09-sprout | `a09-01-shore` #4 | "a beach of round stones. There are five." is odd (a beach has many stones). | "The path comes out on a stony beach. Five big stones sit there." The lesson now says "Five big stones by the water." | done |
| edu-a09-sprout | `a09-10-run` #2 | "Seven friends, and a Nubbin. Nobody missing!" drops the cousin, who is there. | "Seven friends, a Nubbin and a cousin. Nobody missing!" (the count of seven is unchanged) | done |
| edu-a09-sprout | `a09-02-build` #5, `a09-02-river` #7 and its quick choice, `a09-04-climb` #2, `a09-08-stilts` #6, `a09-11-door` garnet choice, `a09-11-complete` #2 | Three-sentence narration (rule: at most two). | Merged with "and" or a comma, e.g. "The path zigzags up. Snufkin goes first, and Sniff goes last."; "Boom, rumble! The ground shakes, softly." | done |
| edu-a09-reader | `a09-03-camp` l1, `a09-07-butterfly-done` l2, `a09-12-gate-done` l1 | ELOF standards (Head Start, ages 3–5) on reader-band lessons. | `standard` removed (no approved 7–10 code fits). | done |
| edu-a09-reader | `a09-06-meeting` l1 | Tagged 3.OA.D.8 "two-step", but 6 + 2 is one step. | Skill "adding to count a vote", standard 1.OA.A.1. | done |
| edu-a09-reader | `a09-08-stilts` l1 | 90 − 30 tagged 4.MD.A.1 (sizes of units). | 2.OA.A.1. | done |
| edu-a09-reader | A9-6 glossary `chairman` | Scene `a09-06-snork`, but the word first appears in `a09-06-snork-done`. | Scene → `a09-06-snork-done`. | done |
| edu-a09-reader | `a09-05-complete` #4 and lesson | "Her basket still holds twelve sandwiches": the basket is not hers, and A9-1 packed six sandwiches (3 × 2), which were eaten in A9-2. | "Moominmamma’s basket still holds twelve buns." The prompt now says "Twelve buns…". | done |
| edu-a09-reader | `a09-10-run-done` #3 | "the way a bus does as it comes up the road" is out of place in Moominvalley. | "the way a cart does as it comes up the lane" | done |
| edu-a09-reader | `a09-07-complete` #6 | "Fold one down the middle" asks you to fold a butterfly (kindness to animals). | "Fold a picture of one down the middle…" | done |

### A10 The Heart of the Island

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a10-sprout | `a10-05-bedside` #2 | "Old people get tired." Right before Gramma dies, this links tiredness to dying, which EDU-STYLE warns against. | "Do not fuss. I am very old, and very poorly." | done |
| edu-a10-sprout | `a10-11-gap` #0 | "Maui flies as a hawk to lure her away" reads as luring Moana, and calls Te Kā "her" before A10-13's reveal. | "Moana turns for the gap. Maui, as a hawk, leads Te Kā away." | done |
| edu-a10-sprout | `a10-11-gap-done-l1` | "A big wave can throw a boat far. That is why sails get torn": the cause doesn't follow. | "Strong wind and big waves push hard. That is how the sail got torn." | done |
| edu-a10-sprout | `a10-01-complete-l1` | "One shell. Two shells. One green stone. How many gifts? Three!" restarts the count at one. | "A shell, a shell, a green stone: one, two, three. Three gifts!" | done |
| edu-a10-sprout | `a10-09-lair-done-l1` | "They walk sideways" is not true of all crabs. | "Most crabs walk sideways." | done |
| edu-a10-sprout | HOKULEA beat (`a10-14-bow`, `-bow-wave`) | "Hokulea", "Hawaii": the reader band and the outline use Hōkūleʻa and Hawaiʻi. | "In 1976 a canoe called Hōkūleʻa sailed from Hawaiʻi to Tahiti." | done |
| edu-a10-sprout | `a10-14-bow`, `-bow-wave` #1 | "Pua supervises" isn't a word a 4-year-old knows. | "You carry an oar, and your Nubbin carries Heihei. Pua bosses everyone." | done |
| edu-a10-sprout | `a10-14-complete-walk` #9 | "Nubbin stands in one" drops "Your". | "Two pairs of footprints are painted on the deck. Your Nubbin stands in one." | done |
| edu-a10-sprout | 40 lines (scene narration, lesson lines and replies) | Three-sentence narration, over the two-sentence cap. Single sound words such as "Splash!" weren't counted, as read-aloud craft. | Joined with "and", commas or colons, e.g. "Gramma Tala has died. Her body stopped working, and it will not start again." Ten joins that went over 14 words were reworded again. | done |
| edu-a10-reader | `a10-06-storm-l2` | The temperature has no °F (EDU-STYLE rule). | "about 26.5 °C (80 °F) or more" | done |
| edu-a10-reader | `a10-01-story-l1` | "For most of history, Pacific peoples had no writing" frames the culture by what it lacked. | "For centuries, Pacific peoples kept stories, family histories and star paths by learning them and telling them aloud." | done |
| edu-a10-reader | `a10-12-light-l1` | "by flapping their wing-like fins" clashes with the next lesson, which defines gliding as moving without flapping. | "They “fly” through the water with slow beats of their wing-like fins, gliding between beats, and they eat plankton." | done |
| edu-a10-reader | `a10-07-escape-l1` | The claim that crab-claw sails "work well in strong wind" is uncertain. | "Sailors balance that push against the water’s grip on the hulls, trimming the sheet as the wind changes." | done |
| edu-a10-reader | `a10-09-lair-done-l1` | "Many crabs cover their shells…" overstates it; this is decorator crabs. | "…some crabs, called decorator crabs, really do stick seaweed and sponges on their shells as camouflage." | done |
| edu-a10-reader | `a10-13-complete-l2` | "protecting the water’s temperature" is unclear, and the line has three sentences. | "…corals can turn white (bleaching), and may recover if it cools." / "People help reefs by fishing carefully, keeping the sea clean and slowing the warming of the oceans." | done |
| edu-a10-reader | `a10-14-farewell-done-l1` | "settled every habitable island" is too absolute. | "settled nearly every habitable island in a huge triangle…" | done |
| edu-a10-reader | `a10-14-bow-l2`, `-bow-wave-l2` | "with good winds" isn't sourced. | "Hōkūleʻa took about 34 days in 1976, so it sailed a little faster." | done |
| edu-a10-reader | `a10-08-stars` #4 (Maui) | "how high it’s climbed … tells you how far north you are": only a star's highest point gives latitude. | "Your hand tells you how high it climbs at its highest, and that tells you how far north you are." | done |
| edu-a10-reader | `a10-02-lagoon-done-l1` option | The label "Take away 12 each day, so 6 − 12 fish next" is clumsy. | "Take away 12 each day" | done |
| edu-a10-reader | 25 prompts and replies | Three-sentence narration, mostly a trailing "Think about it." | Dropped the tag, or joined the sentences. One kept on purpose is below. | done |

Counts: **must fix 19/19 done, should fix 20/20 done.**

### A11 The Enchanted Place

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a11-sprout | A11-1 `balloon` → `balloon-done` | Two science lessons in a row. The balloon lesson's standard (K-PS3-1, sunlight) didn't fit either. | The balloon lesson is now a maths ask on above and below (K.G.A.1): "(Point up, then down.) Is Pooh above you, or below you?" | done |
| edu-a11-sprout | A11-3 `count-done` → `complete` | Two sel lessons in a row. | Added the original's beat "Piglet walks a long way round your Nubbin. Then a shorter way." The complete lesson is now a maths ask on long and short (K.MD.A.2). | done |
| edu-a11-sprout | A11-4 `nail-done` → `complete` | Two sel lessons in a row. | The nail-done lesson is now literacy, the sound word *swish* (RL.1.4). | done |
| edu-a11-sprout | A11-5 `dig-done` → `night` → `night-done` → `morning` | Four science lessons in a row. | night is now a maths ask on inside and outside the lantern's light (K.G.A.1). morning is now a maths ask: "The big head is round. Which shape is round?" (K.G.A.2). | done |
| edu-a11-sprout | A11-7 `bath-done` → `complete` | Two sel lessons in a row. The complete lesson also carried a social-studies standard (D2.Civ.8.K-2). | The complete lesson's domain is now social-studies. | done |
| edu-a11-sprout | A11-9 `rain` → `rain-done` | Two science lessons in a row. | The rain ask ("weather words: flood") is now literacy, ELOF: Language and Communication. It is a vocabulary lesson. | done |
| edu-a11-sprout | A11-11 `missing-done` → `wind` → `door-thistle`; `door`/`door-sat` → `complete` | Science twice in a row and sel twice in a row. | wind is now a maths ask on *here* and *there*, keyed to Eeyore's "It is here. And I built it there." complete is now a maths ask on big and small footprints. | done |
| edu-a11-sprout | A11-12 `malt-done` → `complete` | Two sel lessons in a row. | complete is now a literacy do lesson: clap the syllables Tig-ger, Pooh, Kan-ga, bounce (RF.K.2, `edu:clap:syllables:tigger`, added to CHECKS). | done |
| edu-a11-sprout | A11-16 `cone` → `game` | Two science lessons in a row. | Added a social-studies notice before the stream lesson in `game`: "Everybody drops on “now”. Nobody gets a head start." (D2.Civ.8.K-2). The stream lesson's standard 2-ESS2-3 is now ELOF: Scientific Reasoning. | done |
| edu-a11-sprout | A11-17 `found-rabbit` → `complete` | Two sel lessons in a row (rabbit path). | complete is now literacy: characters can change, "First Rabbit was cross with Tigger. Now he is glad of him." (RL.K.3). | done |
| edu-a11-sprout | A11-18 `house-done` → `complete` | Two sel lessons in a row, and a D2.Civ standard under sel. | The complete lesson's domain is now social-studies. | done |
| edu-a11-sprout | A11-19, all paths | sel twice in a row (meeting → signed-rabbit, signed-rabbit → scroll-sat, scroll-sat → scroll-done) and literacy twice in a row (signed → scroll). | meeting now has the rhyme notice (after=5) and then the sad-goodbye ask (after=7). signed-rabbit is now literacy, the word *grateful*. scroll (ribbon) is now sel, keeping a gift safe. scroll-done is now a maths count-down from five to one. The goodbye ask moved into complete. | done |
| edu-a11-reader | A11-1 `balloon` → `balloon-done` | Two science lessons in a row. | balloon-done is now literacy: working out *suspicious* from context (L.2.4). The glossary entry *colony* is now *suspicious*. | done |
| edu-a11-reader | A11-3 `count` → `count-done` → `complete` | sel three times in a row. | In `count`, the think question now plays after=3, on Christopher Robin's line, before the hypothesis notice. complete is now literacy, "actions show a character’s feelings" (Piglet's shortening path, RL.3.3). | done |
| edu-a11-reader | A11-4 `owl` → `owl-done` | Two literacy lessons in a row. | owl-done is now social-studies: returning what you find (D2.Civ.8.K-2). | done |
| edu-a11-reader | A11-5 `dig-done` → `night` | Two science lessons in a row. | dig-done is now the inference lesson (literacy, RL.3.3): Pooh looking at his last honey. The glossary entry *inference* moved to that scene. | done |
| edu-a11-reader | A11-7 `plan` → `plan-done` | Two sel lessons in a row. The newcomers ask also carried D2.Civ.8.K-2 under sel. | The newcomers ask's domain is now social-studies. The plan-done personal-safety notice's domain is now health. | done |
| edu-a11-reader | A11-11 `missing-done` → `wind`; `wind` → `door-sat` | Science twice in a row and sel twice in a row. | missing-done is now literacy, dramatic irony (RL.3.6). The glossary entry *insulate* is now *dramatic irony*. door-sat is now literacy, reading between the lines of "Not that you have to." | done |
| edu-a11-reader | A11-15 `note` → `owl`; `a-done` → `complete` | Literacy twice in a row, two times. | The owl lesson (weekday names) and the complete lesson (spelling not fixed until the 1700s) are now social-studies, D2.His.2.K-2. | done |
| edu-a11-reader | A11-16 `cone` (science twice in one scene) → `game` | Science four times in a row. | The upstream/downstream ask is now social-studies (D2.Geo.2.K-2). In `game`, the fairness ask is now social-studies (D2.Civ.8.K-2) and the fast-water do lesson moved to after=7, with standard 2-ESS2-3 dropped. | done |
| edu-a11-reader | A11-17 `found-rabbit` → `complete` | Two sel lessons in a row (rabbit path). | complete is now literacy, how a character changes: "the one who has changed is Rabbit" (RL.3.3). | done |
| edu-a11-reader | A11-19 `meeting` → `signed`, `signed` → `scroll-sat`, `scroll-sat` → `scroll-done` | sel twice in a row on several paths. | signed is now literacy, "what characters do not say". It keeps the honest-comfort line. scroll-done is now literacy, how pace sets a mood (RL.4.3). | done |
| edu-a11-sprout | `a11-06-complete` #0–1 | "He cuts it in two", but then everyone gets a slice. The halves lesson contradicted the scene. | "Christopher Robin arrives with a cake. First he cuts it in half." / "Then more slices, one for everyone. Eeyore gets the most icing." The lesson now plays after=0. | done |
| edu-a11-sprout | `a11-08-setoff` lesson l1 | The lesson talks about Eeyore being told "not properly", but that line was cut from the scene. | Restored `E('Nobody told me. Well, somebody did. Not properly.', 'sad')`. The two lessons now play after=5 and after=7. | done |
| edu-a11-sprout | `a11-08-pole` lesson | "P-O-L-E. Some letters wobbled": the spelling shown had no wobble. | "Pole is spelled P-O-L-E. He might write P-O-L, and that is fine." / "Sounding out is how we all start." | done |
| edu-a11-sprout | `a11-09-rain` #1 | "That is a flood." gave the answer one line before the ask. | "The stream grows big. It spills over its banks." | done |
| edu-a11-sprout | `a11-17-mist-rabbit` #4 | Rabbit's "Nonsense" answered a Pooh line that had been cut. | Added `P('We keep coming back to this pit.', 'think')` before it. | done |
| edu-a11-sprout | `a11-19-meeting` #0 | Awkward line: "Christopher Robin will be somewhere new, more of the time." | "Soon Christopher Robin will be somewhere else, most of the time." | done |
| edu-a11-sprout | `a11-20-complete` #2 | The ribbon was given to Eeyore in A11-6, then reappears with no explanation. | "Christopher Robin gave back the blue ribbon. Your Nubbin ties it on a tree." | done |
| edu-a11-sprout | `a11-margin-hazel` | Three-sentence line. The note's "a lap, a voice" memory, its heart, was cut. | Split the note into "They asked where Christopher Robin went." and "Somewhere, I said. Not away." (soft). Added "Maybe you remember a little: a lap, a voice, a turning page." The lesson now plays after=7. | done |
| edu-a11-sprout | header comment | Says the borrowed Roo is "(Kanga is told)". She isn't. | Removed the parenthesis. | done |
| edu-a11-sprout | 33 scene and choice narration lines (`a11-01-page`:decide, `bees`:lip, `week-done` #4, `gloomy`:sit, `nail` #4, #6, `dig` #3, `morning` #1, #5, `presents` #6, `presents-done` #1, `gift` #5, gift:sat, `gift-done` #1, `bath` #5, #6, `roo` #1, `bear` #3, snow:wide, `11-wind` #2, `small` #1, `tunic` #4, #6, note:again, `cone` #1, `16-eeyore` #8, `18-wind` #4, wind:check, `letterbox` #4, `meeting` #5, climb:count, `scroll-sat` #3) | Three sentences on one narration line. | Each merged to two sentences with "and", "but" or a comma (e.g. "Piglet digs and Pooh watches. You do most of it."). | done |
| edu-a11-sprout | standards: `a11-08-roo-done`, `a11-08-pole-done`, `a11-09-bear-done` | The stream lesson had 2-ESS2-3 (solid and liquid). The North Pole and island lessons were geography lessons carrying a science standard. | ELOF: Scientific Reasoning; D2.Geo.2.K-2; D2.Geo.2.K-2. | done |
| edu-a11-sprout | `a11-10-complete` | Domain sel with a D2.Civ standard. | Domain is now social-studies. | done |
| edu-a11-reader | `a11-01-page` #2 | Two lines in a row open with "Across the top". | "It is the start of a story about a bear who comes downstairs in a very bumpy way." | done |
| edu-a11-reader | `a11-02-visit-done` lesson | "Pooh … is 45 cm round" is a circumference, compared with a door width. | "…is 45 cm across." | done |
| edu-a11-reader | `a11-05-night` lesson | "glass round his head": the honey jar's material is never given. | "the jar round his head" | done |
| edu-a11-reader | `a11-09-umbrella` lesson | "Pooh has two boats", but the umbrella is Christopher Robin's. | "There are two boats now: …" | done |
| edu-a11-reader | `a11-12-night-done` lesson | "how many tries make a full jar?" is unclear: Tigger eats the honey, he doesn't fill the jar. | "…how many tries would empty the jar?" | done |
| edu-a11-reader | `a11-12-malt` lesson | Malt extract was described as "dried and cooked down", which is inaccurate. | "…soaked until they sprout, then dried: that is malt." / "Soak the malt in hot water, boil the sweet liquid down, and you get a thick, sticky syrup: the extract…" | done |
| edu-a11-reader | `a11-15-owl` lesson | "Tiw, an old English god" can read as "Old English", the language. | "Tiw, a god of war the early English believed in." | done |
| edu-a11-reader | `a11-11-door-thistle` lesson | Talks about seeds resting, but Eeyore planted the plant. | "Many plants rest through winter, and grow again when the ground warms." The skill and parentNote match. | done |
| edu-a11-reader | `a11-17-mist` lesson | "Rabbit walks off alone in the mist", which is not shown on the Tigger path. | "Rabbit is lost somewhere in the mist. …" | done |
| edu-a11-reader | `a11-13-complete` | Domain sel with an English standard (RL.3.3). | Standard is now CASEL: Social awareness. | done |

### A12 The Mirror Shard

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a12-reader | `a12-03-kick-l1`, `-l2` | Two sel lessons in a row. | l2 is now literacy (RL.3.3): "Look at Gerda: she holds her book tight against her chest. Writers often show a feeling through what a character does." + "She is hurt, and that's allowed. When someone is unkind, it helps to be near a friend." | done |
| edu-a12-reader | `a12-10-pigeons-l1`, `-l2` | Two social-studies lessons in a row; l1's standard (2-ESS2-2) is NGSS anyway. | l1 domain → science. | done |
| edu-a12-reader | `a12-16-tears` → `-tears-done` → `-word` (×2) → `-word-done` | Five literacy lessons in a row, two of them inside `a12-16-word`. | `tears-l1` → sel (CASEL: Self-awareness, "naming relief"); the letter-count `do` in `word` → a maths ask after #2: eight letters × six pieces of ice = 48 (3.OA.A.1); meaning ask moved after #3. `edu:count:letters:8` dropped from reader CHECKS. One lit→lit pair remains (`word` → `word-done`). | done |
| edu-a12-reader | `a12-17-rider-night-l1`, `-l2` | Two sel lessons in a row. | l2 → literacy (RL.4.2): "The black thread is a symbol: a small thing that stands for something big. Hers stands for remembering him." The grief comfort line stays. | done |
| edu-a12-reader | `a12-01-show-l1` | Domain literacy with a C3 history standard. | Domain → social-studies. | done |
| edu-a12-reader | glossary "Arctic" | The word never appeared in `a12-10-pigeons`. | `pigeons-l2`: "Lapland is the far north of Norway, Sweden and Finland, much of it inside the Arctic. …" | done |
| edu-a12-reader | `a12-03-glass-l1` | "Every snowflake has six" overclaims. | "Snow crystals almost always have six." | done |
| edu-a12-reader | `a12-10-complete` #0 | "Each loaf was cut into four" slips out of present tense. | "Gerda cuts each loaf into four equal pieces, but the bread runs out, and then the ham." | done |
| edu-a12-reader | `a12-18-complete` #6 | "Not one of them could have done it alone" says the wrong thing. | "She couldn't have done it alone, and she never had to." | done |
| edu-a12-reader | `a12-04-chase` #6, `a12-12-chimney-done` #2 | Three-sentence narration. | "…times tables: six sevens are… six sevens are…"; "You sit. The soup bubbles, and the letter, it seems, has said its piece." | done |
| edu-a12-reader | `a12-09-keep-l1` prompt | Four sentences. | "Saying "no" kindly sets a boundary; saying "one night" gives trust, and neither is wrong. What matters most when you answer?" | done |
| edu-a12-reader | three-sentence lesson lines: `01-shards-l1` prompt, `02-frost-done-l1`, `03-arch-done-l1`, `03-kick-l1`, `03-kick-done-l1`, `03-glass-done-l1`, `04-complete-l1`, `06-cherries-l2`, `06-garden-l1`, `06-flowers-done-l1`, `07-avenue-l1`, `08-gifts-l1`, `09-forest-l2`, `09-castle-l2`, `09-keep-l1` reply, `10-morning-done-l1` (prompt and reply), `10-free-l1`, `12-power-l1`, `12-ask-l2`, `15-south-l2`, `15-south-done-l1`, `16-tears-done-l1`, `16-word-done-l1`, `18-complete-l1`, `04-kept-l1`, `12-ember-forgiven-l1`, `17-rider-night-l1` | Three full sentences of narration. | Joined with a colon, comma or "and"/"but", wording otherwise kept. (Lines of the shape "Yes. A. B." were left: the "Yes." is a reply, not a sentence of narration.) | done |
| edu-a12-sprout | `a12-01-shards` #3 | `shards-l1` asks about "a grain of sand", which the sprout scene never mentions. | "It broke into more pieces than people. Some were as small as sand." | done |
| edu-a12-sprout | `a12-02-night-done-l1` | "Frost is tiny ice that grows on very cold glass" is vague about where the water comes from. | "Frost is ice. Water from the air freezes on the cold glass." | done |
| edu-a12-sprout | `a12-05-boat` #0 | "A long way out" makes the jump impossible (the original says a yard). | "The boat is already a step from the bank, and gliding." | done |
| edu-a12-sprout | `a12-08-gifts-done` #0 | "The prince's and princess's arms shine on the door" reads as body arms to a 3–6-year-old. | "The coach is pure gold. A golden star shines on the door." | done |
| edu-a12-sprout | `a12-16-word-l1` | "E, E, eternity!" teaches a first sound that isn't there (eternity opens on a weak /ɪ/). | Letter-recognition `do`: "(The word starts with the letter E. Draw a big E in the air!)", ELOF: Literacy, check `edu:trace:letter:e` (CHECKS updated). | done |

### A13 The Wooden Boy

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a13-sprout | `a13-02-carve` #2 | The scene says the pine-nut fact, and then the lesson says it again straight after. | "Geppetto smiles. It is a good name for a pine puppet." | done |
| edu-a13-sprout | `a13-03-cricket` #5 | "He should not have said that." Said what? "Wooden head" was cut. | "Oh! I did not mean to!" | done |
| edu-a13-sprout | `a13-08-road` | "How do you know my name?" gets no answer. | Added Fox: "I know your babbo. I saw him shivering at his door." (lesson `after` 6). | done |
| edu-a13-sprout | `a13-09-complete` #0 | "You try a stone, and your shoulders." doesn't make sense. | "You cannot reach the branch, even standing on a stone." | done |
| edu-a13-sprout | `a13-14-trap` #7, `a13-14-complete` #2 | "My old dog is gone" / "Melampo has gone": the euphemism for death that EDU-STYLE forbids. | "My old dog Melampo died this morning. He was very old. You can be my watchdog tonight." / "Melampo was a good old dog. Let him keep his good name. It costs nothing." | done |
| edu-a13-reader | `a13-14-trap` #8, `-martens` #5–6, `-complete` #2 and lesson | Same "He’s gone" / "Gone? Poor beast" / "be gone with a good name". | "He died this morning." / "He died. This morning." / "Died? Poor beast." / "Melampo has died. Let him keep his good name."; the lesson prompt now quotes "keep his good name". | done |
| edu-a13-sprout | `a13-16-island` #3, #5 | "give you forty" (forty what?); "The bricklayer says, carry bricks, and have supper." reads badly. | "…I will give you forty pennies." / "A bricklayer says he can carry bricks for his supper." | done |
| edu-a13-sprout | `a13-16-water-done` #1 | "I am the day I was carved." doesn't make sense. | "I am the same as the day I was carved." | done |
| edu-a13-sprout | `SEA` (`a13-18-sea`, `-sea-carried`), `a13-18-circus` | "He was only a sort of coat!" and "A man buys him for a drum" hint at the hide without explaining it, which only confuses a 4-year-old. | "The sea washed the donkey off. I am a puppet again!" / "A drum-maker buys him." | done |
| edu-a13-sprout | `a13-18-complete-l1` | A whale lesson on the Dog-fish, which is Collodi's shark (Disney's is the whale). | "A dog-fish is a kind of shark. Real dog-fish are small, as long as a grown-up’s arm." / "The biggest shark is as long as a bus. It eats only tiny sea creatures!" | done |
| edu-a13-reader | `a13-18-complete-l1`, glossary | Same: the lesson was about blue whales and baleen. | The whale shark, the biggest fish, gulps sea water and strains out plankton through its gills. The glossary has `plankton` in place of `baleen`. | done |
| edu-a13-sprout | `a13-19-babbo-done` | "Geppetto would say ciao". He doesn't say it, so the lesson isn't part of the scene. | Geppetto: "Ciao, traveller. You came all this way."; notice: "Geppetto says ciao…" | done |
| edu-a13-sprout | `a13-19-complete-l1` | "GRAT-see-ay" misleads: grazie ends in a short "eh", not "ay". | "Say it: GRAHT-see-eh." | done |
| edu-a13-sprout | `a13-20-wheel` #1 | Giangio's "Then turn my water-wheel" has nothing to answer: the line saying Pinocchio has no penny was cut. | "…has milk at a penny a glass. Pinocchio has no penny." | done |
| edu-a13-reader | `a13-02-carve-done-l1`, glossary `burattino` | "worked by a hand inside it or a rod": a burattino is a glove puppet, not a rod puppet. | "worked by a hand inside it, not by strings" in both places. | done |
| edu-a13-reader | `a13-14-trap-done-l1` | Dogs hear "nearly twice as high", but 45,000 against 20,000 is more than twice. | "more than twice as high" | done |
| edu-a13-reader | `a13-16-island-l1` #4 | "“busy as a bee” is a compliment in Collodi’s Italy" is an English idiom passed off as Italian. | "That is why Collodi named an island of hard workers after bees." | done |
| edu-a13-reader | `a13-16-school-l1` | The bar graph counts caps from Monday to Thursday, but the scene says he puts up with it "for a morning". | "…that first morning: 8 at nine o’clock, 5 at ten, 2 at eleven, and none at noon." / "Draw one bar for each hour…" (check unchanged) | done |
| edu-a13-reader | `a13-18-candlewick-done-l1` | "tamed in Africa about five thousand years ago": recent genetic work puts it nearer 7,000 years. | "more than five thousand years ago" | done |
| edu-a13-reader | `a13-18-circus` #9–10 | "wants a donkey’s hide to make a drum… to soak the hide soft" spells out drowning a donkey to skin it, which is too much for 7–10. | "sells him for a few pennies to a drum-maker." / "ties a rope to him and lowers him off a rock into the sea." | done |
| edu-a13-reader | `a13-18-sea-l2` | 350 g of salt is "more than a mugful", but it is about one mugful. | "about a mugful" | done |
| edu-a13-reader | `a13-19-belly-l1` | "A single flame can be seen from many kilometres": measured visibility is about 1–3 km. | "On a dark night, one candle flame can be seen from more than a kilometre away." | done |
| edu-a13-reader | `a13-19-mouth-done-l1` | "Many can cruise at 40 km/h" is doubtful; "This one has stopped" contradicts "must keep moving" two lines earlier. | "Some can sprint at more than 60 kilometres an hour." / "This one keeps swimming, with two passengers." | done |
| edu-a13-reader | `a13-20-wheel-l2` | "A water-wheel, or windlass" treats the two as the same thing. | "Giangio’s water-wheel works like a windlass: a wheel and axle." | done |


## 4. Nice to have

### A2 The Monkey and the Monk

- Twelve sprout scenes keep two lessons in 5–9 lines, where EDU-STYLE says one per scene and two only in a big scene: `a02-03-lesson`,
  `-04-garden`, `-06-road`, `-06-band`, `-09-cave`, `-11-mend`, `-14-lotus`, `-15-named`, `-16-ask`, `-17-out`,
  `-18-scriptures` and `-19-home`. I left them where no domain run forced a cut.
- Done scenes are shorter than the scene-length guide because the originals are one or two lines (e.g. `a02-01-page-done`,
  `-04-stables-done`, `-12-girl-done`, `-17-cottage-done`, `-18-boat-done`). Following precedent, they are left unpadded.
- A few standard codes still don't match their domain: reader `a02-03-night-l2` (social-studies, 4.MD.A.1), `a02-07-complete-l1`
  (social-studies, 4.OA.C.5), `a02-12-old-woman-l1` (health, 4-LS1-2), `a02-11-temple-l1` and `a02-13-gourd-l1`
  (2-LS2-1); in sprout, `a02-06-road-l1` teaches that the sun sets in the west under social-studies/D2.Geo, which is really 1-ESS1-1.
- The reader maths leans heavily on equal-groups multiplication (2×7, 4×6, 5×12, 4×4, 6×5, 7×8, 7×9). One could become a bar chart (the
  hardships by kind) or a time interval.
- "There is no single right answer. Think about it, then choose." is repeated in about 20 think questions. It could be varied.
- Sprout `a02-04-banquet` #1 is a grown-up counting prompt inside the scene lines, not a lesson. It's harmless, but it is a second
  maths beat that the lesson list doesn't show.

### A5 The Lion of Mali

- Short done scenes (1–3 lines) mirror one- and two-line originals. Following precedent, they were left as they are, not padded.
- `sprout:a05-14-complete-lullaby` is still 11 lines. Cutting more would lose either the balafon gift or the closing line.
- The outline asks for "the Mali Empire on a map", but neither band has an actual map beat. A sprout `do` (tap West Africa on the atlas) and a reader ask on the map would make it literal.
- `reader:a05-01-court-done-l1` is literacy with a CASEL standard. `reader:a05-11-battle-done-l1` is social-studies with 4-ESS2-2. Both are acceptable but loose.
- `reader:a05-10-market-l2` has the messengers buying four bunches at 8 Shells. It's charming, but men who have searched every market are unlikely to stop and shop. "Say the four men each bought…" would flag it as a what-if.
- `sprout:a05-10-basket-done`, "be kind to us, so this never happens", keeps a soft veiled threat. It's fine, but "please give his mother a resting place" would be gentler.
- `reader:a05-09-sosso-l2` slightly re-reads Balla's "where it happened, and where it's told" as "as tellers before him told it".

### A6 Seven Voyages

- Many done scenes are shorter than the EDU-STYLE guide (sprout 4–10 lines, reader 6–16) because the original done scenes are only one or two lines. Following precedent, they were not padded.
- Reader lesson lines often run to three sentences (e.g. `05-meat-l1`, `07-island-done-l1`). Precedent only fixes scene narration, so they were left alone. A later pass could trim the longest prompts.
- Reader `08-tunnel-done-l1` (a `do` lesson) asks which way the ship must be if the cliff is east of the beach, but never gives the answer (west). Add a reply once the do-lesson UI shows one.
- Sprout `14-tree` #0: "When the elephants pass, shoot." This is the story beat, since Sinbad misses on purpose, but "shoot your arrows" might read gentler aloud to a 3-year-old.
- Reader `12-bank-l2`'s third option label, "One fourth of four (4/4)", is clumsy. "All of it (4/4)" would be clearer.
- Sprout margin note: the closing quote mark now sits on the second auto-split line. Harmless, but the note reads better as one quoted line if it is shortened to 14 words.

### A7 The Marigold Bridge

- Most done scenes are 2–3 lines, under the guide (4 for sprout, 6 for reader), because the originals are that short. Following precedent they are left as they are, not padded.
- Sprout sound-word lines with three or more tiny sentences ("Fireworks go up. Boom! Pop! Fizz!", "Dante sees you go. Woof! Woof! Woof!", "A big bell drops. Bonk!…", and 5 more) are read-aloud refrains. They are left in, but a strict reading of the two-sentence rule would merge them.
- Some reader lesson replies run to three short sentences in the narrator's teaching voice (for example the a7-03-window-done echo notice). Fine to tighten.
- Reader 6 × 8 = 48 appears twice (candles in a7-02-complete, stitches in a7-06-name-done). Vary one, for example 7 stitches a letter = 42.
- Sprout check `edu:sing:song:slow-soft` asks the child to hum. Rename it to `edu:hum:…` for consistency.
- Reader a7-01-petals-done says "Three people take…", which counts the Nubbin as a person. Consider "three of you".
- The reader dog-senses notice (4-LS1-2) was replaced by the help-seeking sel beat. It could come back on a scene that has no lesson clash.
- The writer log `docs/logs/edu-a07.md` is out of date. It says "78 quest scenes + 7 variants" (the real count is 77 + 8), and it says the files are not registered, but `a07` is already in content-check's `eduPacks`.

### A8 The Twelve Tasks

- Many lesson prompts and replies run to three short sentences in the narrator's voice ("A fair
  answer. …", "Yes! … …"). This is the house formula across the edu files, so I left them. Scene
  narration is now at most two sentences everywhere.
- Some scenes are shorter than the EDU-STYLE length guide: sprout done scenes have 3 lines, and
  reader done scenes have 2 (`a08-03-field-done`, `-05-boat-done`, `-06-stare-done`,
  `-08-mouth-done`, `-09-door-done`, `-09-counters-done`, `-09-form-done`, `-11-climb-done`,
  `-12-ghosts-done`, `-13-arena-done`, `-14-square-done`). The original done scenes are 1–2 lines,
  so I left them rather than pad them.
- The reader glossary word "amicable" now appears only inside the lesson, not in the scene's lines.
- Reader `a08-12-ghosts-l1` uses standard RL.4.3. It's a loose fit for "specific complaints work
  better"; no listed code fits closely.
- Reader `a08-13-arena` drops the original's Nubbin-and-Dogmatix-chase-a-lion-cub beat. It would
  be a nice line to restore.
- Sprout pronunciations ("SAL-weh", "WAH-leh") are classical. A grown-up saying "SAL-vay" or
  "VAH-lay" is fine too, and a parentNote could say so.
- Sprout `a08-09-counters-done` #2 and its notice say the same thing twice ("try another way").
- `docs/logs/edu-a08.md` (not mine to edit) is now out of date:
  - Reader lessons are 78, with 22 maths, 15 literacy, 18 sel, 12 social-studies, 10 science and
    1 health.
  - Sprout has 20 maths, 16 literacy, 16 sel, 5 social-studies, 9 science and 2 art.
  - Its line "lion shows belong to other arenas" is wrong.

### A9 The Comet

- Short done scenes and variants (sprout 3–4 lines, reader 1–3) are under the EDU-STYLE scene-length guide because the originals are one to three lines. Following precedent, they are left as they are and not padded.
- Many lesson prompts and replies (in both bands) run to three short sentences in the teaching voice, e.g. sprout "Yes! Sss, sss, Sniff. The snake sound." Precedent (review-edu-s24-s31) applies the two-sentence rule to scene narration only, so these are left. A future pass could tighten the longest reader replies (for example `a09-11-arrive` l1, 151 characters).
- sprout `a09-06-meeting`: the scene says "Your Nubbin puts up two" right before asking how many paws. A lighter version would be "Your Nubbin puts up both paws."
- reader `a09-06-complete`: a tent folded to a 6 cm square is very small, even for the Snork. It works as comedy, but "a square, six hand-spans a side" would be gentler maths.
- reader `a09-12-night` irony ask: RL.3.3 (character) fits better than RL.3.6.
- reader `a09-11-dark-done` asks why "this scene is just one short sentence". That is a little meta, but it is a fair craft question.
- reader `a09-01-hammock`: the Muskrat's "a star with a tail" is corrected only implicitly by the comet note in `-hammock-done`. A clause there ("not really a star at all") would make it explicit.
- Tides (both bands) are framed as "real coasts", which is right, since the Baltic around Finland has almost no tide. Keep it that way.

### A10 The Heart of the Island

- Many done scenes are 1–3 lines in both bands, below the guide's scene length, because the original is
  that short. I left them unpadded, following precedent.
- Some no-`best` think questions open one reply with "Yes." (`a10-13-walk-l1`, `a10-08-swell-done-l1`,
  `a10-14-complete-l1`, `-complete-word-l1`, `-complete-walk-l1`). That hints at a right answer; "That fits…"
  would honour every reply equally.
- Reader `a10-05-complete-l2` repeats the manta's 7 m wingspan from `a10-12-light-l1`. One of them could
  teach something else, such as mantas' large brains or their cleaning stations.
- Factual lessons about the figure from tradition, such as Scorpius as his fishhook (`a10-06-storm-l1`),
  could spell him Māui, as the source header does. The speaker name Maui can stay.
- Reader `a10-03-point-l1`: "a coconut … does not rush ashore" is true in open water, but not in breaking
  surf at the shore where Gramma dances.
- Reader `a10-08-swell-done-l1`'s prompt quotes Maui's three short sentences. I kept them as a single quoted
  utterance.
- Reader `a10-03-point-done-l1` is tagged `art` with a C3 history standard. That's allowed, but slightly
  mismatched.

### A11 The Enchanted Place

- **Domain repeats across quest boundaries remain.** These are separate quests, so I left them. Sprout: A11-1→2 sel, A11-11→12 maths, A11-13→14 sel, A11-14→15 literacy. Reader: A11-4→5 maths, A11-10→11 science, A11-15→16 social-studies, A11-19→20 maths.
- **Three-sentence lesson prompts and replies.** About 45 in sprout and 37 in reader, e.g. "Pop! Ow! Whoosh! These are sound words." and many three-sentence reader question set-ups. Following the s24–s31 precedent, only scene narration was merged.
- **Short scenes, left as precedent.** Many reader done scenes are 1–2 lines because the original is (e.g. `a11-02-stuck-done`, `a11-03-tracks-done`, `a11-05-night-done`, `a11-07-plan-done`, `a11-11-snow-done`, `a11-12-night-done`, `a11-15-owl-done`, `a11-17-plan-done`, `a11-18-wind-done`). Most sprout done scenes are 3 lines. None is thin enough to pad.
- **The reader band is almost a verbatim copy of the main script.** Every line is within 30 words, but syntax was barely simplified. A light pass on the longest narration lines (25–30 words) would help 7-year-olds.
- **Facts dropped for variety.** The reader's honey-keeps fact and bee-colony fact were swapped out for variety. Pollination stays in `a11-02-visit`. Either could come back in a later scene.
- **Reader `a11-14-complete`.** A 2 m × 2 m tunic is implausible for a boy. A 1.5 m side would make an area of 2.25 m², which is harder maths; or call it "a very big tunic".
- **Reader `a11-09-complete`.** Division with a remainder is grade-4 content filed under 3.OA.D.8. It is accurate.
- **Milne's coined terms kept as names:** "friends-and-relations", "Big Boots", "Special Pencil Case", "Floating Bear", "Brain of Pooh". "It goes in and out" sits close to Milne but is plain description. I judged all of these acceptable.
- **Sprout A11-17.** The hide-and-seek softening makes Piglet's "That is not very kind" land more softly than the original. It still works with the plan-done lesson.

### A12 The Mirror Shard

- **Same-domain pairs across scene boundaries.** No two maths lessons sit together on any play path, in either
  band, which is the EDU-STYLE rule (and the s24–s31 review's precedent). Non-maths pairs remain across scene
  edges: 28 in sprout, 32 in reader, mostly sel→sel and science→science, a few runs of three (sprout `02-night` →
  `-night-done` → `-complete` and `14-prayer` → `-prayer-done` → `-complete`, all science; reader `17-complete` →
  `18-bells` → `-bells-done`, science). Within-scene repeats are all fixed. Retagging sixty lessons would mean
  bending standards or swapping good lessons, so they were left. A rule decision would settle it.
- Sprout narration of three short read-aloud fragments ("Drip, drip! A drop falls on Kay's head. He pretends…")
  is common (about 90 lines), as in earlier edu files. It reads well aloud and was left, per precedent.
- Many sprout done scenes have 1–3 lines and many reader scenes 1–5 lines, because the originals are that short.
  Left, not padded.
- Sprout `a12-06-flowers-l1`: the best reply opens "Yes." after an option that begins "No.". "Right." reads
  better aloud.
- Sprout `a12-06-flowers` #1: "He isn't here" softens the roses' "He isn't dead" but loses the logic (they were
  under the earth). It's fine for 3–6.
- Reader `a12-05-boat-done-l1`: "every river flows… towards a lake or the sea". A few end inland. The prompt's
  "downhill" is the real point.
- Reader `a12-15-south-l1` (2-ESS1-1) and `a12-05-river-l1` (3-PS2-1) are loose standard fits.
- Reader `a12-17-rider-night-l2` introduces "symbol". Variants have no quest glossary, so it isn't glossed; it's
  defined in the line.

### A13 The Wooden Boy

- **Sprout narration with three short sentences.** About 28 scene lines are fragment runs ("One step. Two steps. Then
  Pinocchio is running!"), and the `split` helper's ≤ 14-word grouping makes them on purpose. They read well aloud,
  and the edu-s24–s31 review left the same pattern, so these were left too. The reader band's scene narration is
  clean; three-sentence lines there are all in lesson replies, as in other reviewed reader files.
- **Same-domain lessons back to back (none are maths).**
  - Sprout: `03-cricket` → `-cricket-done` (sel), `04-storm` → `-storm-done` (science), `08-road-done` → `08-inn`
    (science), `20-road-done` → `20-hut` (literacy), `01-page-clank` → `01-page-done` (science), and
    `20-coat-done` → `20-complete-clank` (sel).
  - Reader: `02-carve` → `-carve-done`, `10-doctors` → `-doctors-done(-carried)`, `20-road-done` → `20-hut` and
    `20-coat-done` → `20-complete` (literacy); `04-hungry` → `-hungry-done`, `15-pigeon-done` → `15-complete` and
    `19-mouth-done` → `19-complete-clank` (science); `06-road-done` → `06-show` (social-studies). Worst is
    `19-babbo-done` → `19-mouth` → `19-mouth-done`, three science notices in a row; one could become a sel beat.
- **Short scenes.** Short done scenes (sprout about 45 under 4 lines, reader about 60 under 6) mirror the original's
  1–3-line scenes. Left, not padded, per precedent.
- **Sprout word choice.**
  - "Good morning, Master Antonio" never explains that Antonio is Master Cherry.
  - The Polendina joke loses its polenta set-up.
  - "Carabineer", "kindling", "glass-less spectacles" and "unfortunates" are hard words for ages 3–6.
- **Sprout `a13-15-stone-l1`.** The P-for-Pinocchio phonics question plays in the grief beat, just before the stone is
  read. A calmer spot, such as the pigeon scene, would sit better.
- **Sprout `a13-01-page-done-l1`.** "grows one new ring inside" would be more exact as "just under its bark".
- **`a13-12-oak-done` (both bands, and the main script).** "Hens with no crests": in English a hen has a comb.
- **Reader standards.** `08-inn-l1` (Italian courses) and `13-prison-l1` use `D2.His.2.K-2`, which is a loose fit.
- **Reader `a13-16-school`.** "he kicks a few shins… and after that they like him very much" is Collodi, and kept
  from the main script. It is worth a thought for 7–10, since violence is what wins the boys over.


## 5. Best moments to protect

### A2 The Monkey and the Monk

- Reader `a02-02-king-l1`: "Trees, monkeys and people all do. It is a hard thing to feel, and it is allowed to make you sad." This is the
  Learning Grove's honesty about endings, done gently.
- Sprout `a02-15-which-l1`: "“I do not know” is a true and brave thing to say." The signature payoff lands for 3–6 year olds without
  losing its point.
- Reader `a02-17-web-l2`: "Patience found the peg, and a single stroke of force finished the job." This think question respects both answers.
- Sprout `a02-16-real` (kept from the main script): "My boy would have wanted the fire. I think I want the rain."

### A5 The Lion of Mali

- Reader, `a05-03-house-done` think reply: "A seed isn't behind a tree. It's a seed."
- Sprout, `a05-08-mat-done`: "That night, Sogolon dies." / "Her body has stopped working, and it won't start again." This is plain, and the comfort follows straight after.
- Sprout, `a05-03-house` choice `ask`: "I don't pull up seedlings to make them grow."
- Reader, `a05-13-fakoli-l2`: "Loyalty and betrayal look different from different places."

### A6 Seven Voyages

- Reader `a06-08-telling-l1`: "The sadness I felt was love with nowhere to go." This is grief said plainly, in the sailor's own voice, with comfort built in.
- Sprout `a06-08-tunnel-l1`: "You did not fix anything. You sat beside him. That helps a lot." The third rule, landed for a four-year-old without naming it.
- Reader `a06-01-street-done-l1`: "It’s porter’s work, really. Only with words." Translation, the House of Wisdom and the porter's dignity in one line.
- Reader `a06-14-herd-l1`: "real elephants have no secret graveyard, but they do stop at the bones of elephants that have died". It is honest about the legend and true about the animals.

### A7 The Marigold Bridge

- Reader a7-05-complete: "Sometimes anger is fear wearing a coat." It is now the heart of the metaphor lesson.
- Sprout a7-03-cemetery: "A bit sad. Mostly a party. They’re visiting!" The custom in a line a 4-year-old can hold.
- Reader a7-04-bridge-done-l1: "Spirit guides are this story’s idea, not an alebrije belief." This is exactly the cultural care the outline asks for.
- Reader a7-07-paint-l1: "Painting a face this way is a respectful art, not a costume party."

### A8 The Twelve Tasks

- Sprout `a08-08-beast`: "A soft nose sniffs your Nubbin. Your Nubbin sniffs back." Hazel's third
  rule acted out, never named, in words a three-year-old can hold.
- Reader `a08-09-form-done`: "“Fair copy” means a neat, final copy, with no mistakes. It has
  nothing to do with being fair, or with a fair full of rides." A diegetic vocabulary beat that
  lands the joke too.
- Reader `a08-14-useful`: "Sensible things often lose on the day. Then people use them for years."
  It keeps the signature choice's quiet payoff in both bands.
- Reader `a08-08-beast-l2` reply: "If everyone knew, people might come to stare or to hurt it. Some
  kindness is quiet."

### A9 The Comet

- reader `a09-04-step`, the think question with no best answer: "An honest “I don’t know”, said gently, can be more trustworthy than a promise you cannot keep." It sets up the signature payoff without tilting the choice.
- sprout `a09-11-dark` lesson: "(Hold hands with the grown-up reading, and take three slow breaths.)" This acts out the third rule for the child, and it is never named.
- reader `a09-01-valley-done`: "Hello is “hei” in Finnish and “hej” in Swedish. They look nearly the same, but the languages are very different." It is accurate, light and memorable.
- sprout `a09-06-meeting-done` keeps "Under “Any other business” he has written: Sniff is worried." A worry made official and kind is the page's heart.

### A10 The Heart of the Island

- Sprout `a10-05-complete`: "Gramma Tala has died. Her body stopped working, and it will not start again."
  The glowing manta comes straight after. It is exactly the EDU-STYLE register.
- Sprout `a10-10-story-l1`: "Every child is loved just for being them, not for what they do." This lands
  Maui's abandonment for a 4-year-old without frightening them.
- Reader `a10-03-sand-l1`: "Is being safe the same as being well?" The theme of the whole campaign, as a
  real think question.
- Reader `a10-07-fog-l2`: 5 boats × 8 Kakamora = 40, which pays off in the next line's "Forty coconuts wave
  back".

### A11 The Enchanted Place

- Sprout `a11-19-signed`: "(Grown-up: you can say, “I do not know, but he loves you all.”)". It is honest comfort, exactly the EDU-STYLE line on hard things.
- Reader `a11-04-gloomy` think question: "“Nobody minds” is often a quiet way of hoping somebody does."
- Reader `a11-12-breakfast`: "It is safe. But Tigger would have gone hungry. Safe is not always the same as well." It lands theme 5 without preaching.
- Sprout `a11-15-note`: "Yes! Back soon! Christopher Robin spelled it by sound." It turns the Backson joke into the child's own discovery.

### A12 The Mirror Shard

- Sprout `a12-04-kept` #5: "Nothing would hurt there. But nothing would be warm, either." The Heartstone theme in
  ten words a four-year-old can hold.
- Reader `a12-05-winter` #2: "Dead would mean his body had stopped working, for ever. But nobody saw that happen,
  and Gerda doesn't believe it." This is the canon death wording, used to carry hope.
- Reader `a12-15-south-l2`: "The whole world, and never being told what to do, if Kay stays cold and feels
  nothing. Would that be a good deal?" Safe is not the same as well, asked honestly.
- Sprout `a12-03-complete` #3: "You wait with her. Waiting together is a kind of help." The third rule, landed
  without naming it.

### A13 The Wooden Boy

- Sprout `a13-20-wheel` and `-wheel-done`: "Candlewick puts his head in Pinocchio’s lap. Then Candlewick dies." Then
  "Being sad is all right. Remembering him is a way to love him still." It is plain and gentle, exactly as EDU-STYLE
  asks.
- Reader `a13-06-road-done-l1`: "The four pennies were the price, but the coat was the cost, and it was paid in cold and
  love."
- Sprout `a13-05-coat-clank`: "He sold his coat. For a puppet that kicked his nose." / "Is that a job?" / "No. It is not
  a job."
- Sprout `a13-20-word-l1`: "That is fine. Love is often small and quiet. Look out for it today."


## 6. For Maor

### Across the batch

- **Same-domain rule.** EDU-STYLE bans only two *maths* lessons in a row. A2, A5, A6, A7, A9 and A10
  cleared every same-domain pair on every play path. A8 and A11 cleared them within quests. A12 and
  A13 cleared only maths pairs and pairs inside a scene, leaving about 60 cross-scene non-maths pairs
  in A12 and some in A13 (the worst is three science notices across A13-19 in reader). Decide whether
  "no two lessons of the same domain in a row" becomes the rule. If it does, A12, A13 and the earlier
  edu files need a pass.
- **"Grief is love with nowhere to go"** turned up twice more (A5 and A10 reader), after S27. Consider
  adding it to content-check's quoted list, so writers can't reuse it.
- **Sprout `CHECKS` strings changed** in A2, A5, A6, A7, A8, A10 and A13 (listed per storyline below).
  The engine handlers need updating to match.
- **Writer logs out of date:** `docs/logs/edu-a07.md`, `edu-a08.md` and `edu-a13.md` (counts,
  content-check status, and one wrong fact in A8). They were not edited.
- **Main-script fixes** are suggested for `atlas-a02`, `a05`, `a06`, `a07`, `a08`, `a10`, `a11`, `a12`
  and `a13` (below). None were edited. A9's script had no errors.
- **Licences and advisers** are still open, as before: Disney (A7, A10, and A11/Shepard, where
  `more-stories.md` and the `atlas-a11.ts` header disagree), Les Éditions Albert René (A8), and the
  cultural advisers for A2, A5, A6, A7, A10, A12 (Sámi), A13 (Italian) and A9 (Finnish), each with
  additions to their packet.

### A2 The Monkey and the Monk

- **Main-script error (atlas-a02.ts, not edited).** In `a02-14-fire` the cold stream "knocks him flat", then Sandy calls for "Water.
  More water, cold. Not too fast." The step goal is "Carry cold water to Monkey at Fire Cloud Cave." (line 1666). Both contradict the cure:
  in the novel the cold stops his heart and Pigsy massages him back. Suggested fix: goal "Carry water to Monkey at Fire Cloud Cave."
  and Sandy (line 1676): "Water. To drink, not to swim in. And slowly." The sprout already softened this to "Water, not too cold, not
  too fast."
- **Writer-log items, weighed.** These hold up:
  - The li conversion (half a kilometre in modern use) and the comparisons with the Earth.
  - The 3,600 peach trees as three groups of 1,200, which matches the novel.
  - The zodiac order, and the hedge "in an old race".
  - Turpan and the Flaming Mountains.
  - The Great Wild Goose Pagoda in Xi'an, built to house Xuanzang's texts.
  - The 645 − 629 = 16 years sum, against the novel's fourteen.

  The reader no longer calls the 16 years "walking". Dates of 627 for the departure also appear in some sources; the adviser may want a
  single convention.
- **History note for the adviser.** The novel's monk is sent by the emperor (kept). The real Xuanzang left against an imperial travel ban.
  The reader notice at `a02-06-road-l1` doesn't contradict this, but it could add one line if the adviser wants the distinction drawn.
- **Adviser packet (Buddhism, Daoism, Chinese culture).** These are all written respectfully; please have the adviser glance at:
  - Guanyin as "the bodhisattva of compassion… many people pray to her for kindness and help" (reader `a02-07-guanyin-l1`).
  - Alms and "begging" (reader `a02-17-cottage-l1`).
  - Laozi and Lord Lao (reader `a02-13-complete-l1`).
  - The five phases (reader `a02-05-mountain-l1`).
  - The "blank scrolls are truest" think question (reader `a02-18-scriptures-l2`).
  - The un-named buddha titles at the end, which the script log already flags.
- **New CHECKS strings for the wiring task.**
  - Sprout adds `edu:count:hands:3` and `edu:count:buckets:3`, and drops `edu:count:helpers:2` and `edu:count:tens:80`.
  - The reader's three checks are unchanged.
- **Moksa.** The sprout had made Moksa "she". The main script uses no pronoun, which is fine. If the speaker card or art ever needs one,
  Moksa is male in the novel.

### A5 The Lion of Mali

- **Islam.** The reader band's one mention is factual and brief: Mansa Musa's "celebrated journey to Mecca", in `a05-14-complete` and its variant. My view is to keep it. The outline names Mansa Musa, and leaving out the hajj would be the odd choice. The advisers should still confirm the wording.
- **Advisers** (Mande / West African, ideally a jeli). Beyond the writer log's list, please also check:
  - Manding's lands lying "in Mali and Guinea" (Niani's site is itself debated);
  - "wori" (other forms are wari and awalé);
  - smithing and griotry as hereditary family crafts;
  - the Sosso-Bala being kept by a Kouyaté family (the Dökala) in Niagassola;
  - the new line "Tradition says it is Soumaoro's own great balafon".
- **Writer-log items, weighed.**
  - The sprout `do` checks still need engine handlers. There are now 23 strings, because `edu:point:plant:leaf` went with the leaves lesson.
  - The invented sums are fine: each is labelled "say" or given in the question.
  - The compass lessons only teach "the sun sets in the west" and "west's opposite is east", so they stay true.
- **Main-script notes for `atlas-a05.ts`.** I did not edit it.
  - `a05-08-mat-done` #0: "That night Sogolon goes to sleep and doesn't wake up." The main game is also `all`, and EDU-STYLE warns against the sleep framing for young children. Suggested replacement: "That night, quietly, Sogolon dies."
  - `a05-10-complete` #3: "the road west is open". Mema lies north-east of Niani, so the road home runs south-west. Suggested replacement: "Then the horses are saddled, and the road home is open, and Sundiata is going home." The edu reader keeps "road west" verbatim and teaches nothing from it.
  - The header comment still says the Learning Grove version "is a separate file still to do". It should point to `edu-a05-sprout.ts` and `edu-a05-reader.ts`.
- **Checks.**
  - `prettier --write` ran on both files.
  - `tsc --noEmit -p .` and `eslint` on both files are clean.
  - `content-check --warnings` reports no problem or warning with an a05 id. The single problem reported, `reader:a11-14-tunic`, belongs to another reviewer.
  - Both files are still LF.

### A6 Seven Voyages

- **Writer-log facts, weighed:**
  - Basra to Serendib "about 5,000 km" is a fair round figure; the real route is roughly 4,500–5,500 km depending on the coast-hugging.
  - "100 km a day" is a conservative round number. A dhow before a good monsoon often made more, but it is fine for teaching.
  - "40 km a day × 11 days = 440 km" is close to the Basra–Baghdad river road, about 450–550 km.
  - The monsoon explanation (land and sea heat and cool at different rates) is correct at this level.
  - The elephant-bones line is correct, from field studies of elephants examining their dead.
  - The 71-day follow-on sum was removed (it caused the maths-in-a-row clash), so only the 50-day sum remains.
- **Advisers:** the outline's Arab/Persian and Sri Lankan advisers still apply to both bands. Points to add to their packet:
  - The reader sabil note ("in many cities of the old Islamic world, the rich paid for public fountains, called sabils").
  - The new reader lesson on the Caliph's "kind teasing", which needs a check that it keeps Harun dignified.
  - The slavery notice in `13-complete`.
  - The reader four-faith line on Sri Pada, where sprout says only "People come for different reasons".
  - The porter's unnamed daughter.
- **Margin note:** sprout paraphrases Hazel's margin note ("Seven trips, and he still came home to tell it to a friend…"), while the main script uses S24's text word for word. I left it as a band choice. Confirm you're happy with a paraphrase for 3–6.
- **Main-script notes (`atlas-a06.ts`, not edited):**
  - `a06-13-palace#0` sends Sinbad "straight to the palace of the Green Dome". The Green Dome was al-Mansur's palace at the round city's centre; by Harun's reign the caliphs mostly lived at al-Khuld, outside the walls. If the advisers want it exact, use: "Sinbad comes home through the Basra Gate of the round city, and goes straight to the Caliph’s palace."
  - The writer already flagged that the "House of Wisdom" in Harun's time was the palace library, and it flourished as an academy under al-Ma'mun. That wording placeholder stands.
- **Checks:** sprout CHECKS now lists `edu:count:fingers:3` in place of `edu:count:fingers:7`. The wiring task should register it with the other new a06 check strings.

### A7 The Marigold Bridge

- **Main-script continuity in `atlas-a07.ts` (not edited).** Two lines assume you chose `keep` ("I’ll stay with him") in a7-05-run. On the `why` path you never said it.
  - a7-07-row choice `follow` then: "You go after Miguel, because you told Mamá Imelda you would." Suggested: "You go after Miguel, because Mamá Imelda asked you to."
  - a7-09-complete line 0: "…You jump after them, because you said you would stay with Miguel." Suggested: "…You jump after them, because you are not letting Miguel go alone."
- **Writer-log items weighed.**
  1. Short done scenes: left as they are, per precedent.
  2. Consultant list. The Linares history checks out (papier-mâché in Mexico City in the 1930s; Oaxaca's copal carving came later), and sprout now says "paper or wood". The "tíos" line is reworded. Mariachi from Jalisco is accurate. Ofrenda levels (two, three or seven) are commonly cited but should still be confirmed. The vigil line is hedged ("some families", "customs differ"), which is right.
  3. Generic sel asks: several are now varied by the domain fixes.
  4. Registration: already done in content-check; the log is stale.
- **Adviser notes (outline: Mexican consultants).** Still needed before ship for the customs, the Spanish and accents, and the cemetery vigil. Add to their packet:
  - the sprout pronunciation guide "Sem-pa-SOO-cheel";
  - the calavera face-paint framing;
  - the Xoloitzcuintli inherited-trait notice;
  - Imelda's "bring your papá Héctor home" wording.
  - Licence: still open, as the script log says.
- **Softening decision.** Following the main script's own note ("For the Learning Grove version, soften further"), the reader no longer says "something in his drink". Ernesto "did something to him", and the death is still said plainly. Revert if you want the reader band to keep the original line.

### A8 The Twelve Tasks

- **Writer-log facts checked:**
  - Olympic dates (traditional 776 BC; revived in Athens, 1896): correct.
  - About 6 °C colder per 1,000 m: fine as a rough guide (the standard figure is about 6.5).
  - A legion of about 5,000, with centuries of about 80: correct.
  - The Colosseum (opened AD 80) came more than a hundred years after Caesar: correct.
  - V as a hand and X as two Vs: now hedged as ideas in the reader band. Sprout only says V
    "looks like" an open hand.
- **Corrected beyond the log:**
  - The Circus Maximus did host wild-animal shows. Caesar and Pompey staged them there.
  - IIII was common Roman usage.
  - Rome in 50 BC was a Republic.
  - "Referee" does come from Latin.
- **Main script, `atlas-a08.ts` (not edited):** no errors of fact found. One small oddity:
  `a08-02-race` #4, "A gust knocks Pupus's laurel wreath sideways". A laurel wreath was an honour
  (Caesar wears one in A8-13), not an observer's everyday wear. Suggested: "A gust tugs Pupus's toga
  sideways. Down at the far end, two dots become one dot, and then that dot is Asterix."
- **New `edu:` checks for the wiring task:** `edu:trace:letter:i`, `edu:say:sound-word:rumble` and
  `edu:print:knuckle:paper` (sprout). Retired: `edu:count:javelins:3` and `edu:write:name:finger`.
  All are the standard shape.
- **Advisers:** none needed. The Persia, Egypt and Belgae notices are respectful and factual; no
  faith or looks jokes; Iris's headdress stays costume. The licence (Les Éditions Albert René) is
  still needed before ship, as the script log says.

### A9 The Comet

- **Writer log, wiring:** already done. `edu.ts` and `index.ts` register both bands, the two `_VARIANTS` arrays and both `CHECKS`, and `a09` is in content-check's `eduPacks`. The sprout CHECKS gains one string, `edu:listen:quiet-sounds`.
- **Writer log, short scenes:** accepted under precedent (see Nice to have).
- **Adviser (Finnish):** hei / hej / kiitos / tack and "Tove Jansson, a Swedish-speaking Finn, wrote the books in Swedish" are correct to my knowledge. A Finnish reader should still sign off before release, as the writer log asks. Sprout now also says "Finland has two languages: Finnish and Swedish."
- **Main script, octopus staging (atlas-a09.ts A9-9, open item from script-a09):** the lantern swung into its eye is the script writer's own staging. From memory, unverified: in the book the Snork Maiden dazzles the octopus with light from her little mirror. If the named edition confirms this, a suggested in-house replacement for `a09-09-octopus` #6–#8 is: "The Snork Maiden is already moving. She snatches the little mirror from her fringe-bag and turns it to the comet." / SM "Let him GO!" / "A blade of red light flashes off the glass into the octopus’s eye." The edu versions would then need the matching one-line change (sprout #6–#8, reader #6–#8). The `light` choice (the shell throwing light back) still works with either version.
- **Main script, ankle ring:** fits the book's anklet as I remember it. No change suggested.
- **No main-script errors found** in atlas-a09.ts. The day count (four days from the Observatory to the seventh), the party count ("Seven, and a Nubbin, and a cousin"), the times (7:30, 8:40, 8:42) and both variant wirings all check out.
- **Learning Grove facts to keep an eye on:** reader `a09-12-night-done` uses the 9–12 hours of sleep figure for ages 6–12 (AASM). Reader `a09-12-gate-done` says barn swallows from Finland winter in southern Africa. Both are standard, but name the source if an educator review wants citations.

### A10 The Heart of the Island

- **Writer-log adviser items, weighed:**
  - "lalo" = below and "tai" = sea (Samoan, A10-9).
  - The hongi (Aotearoa) and honi (Hawaiʻi) greetings (A10-13).
  - tatau / tā moko / kākau (A10-6).
  - waʻa kaulua and the 32-house Hawaiian star compass (A10-4, A10-8).
  - Hōkūleʻa = Arcturus, "star of gladness", a zenith star for Hawaiʻi; Hōkūpaʻa = the North Star (A10-14).
  - Mau Piailug of Satawal; 1976, about 4,000 km, about 34 days.

  All of these match standard sources as far as I can check, but each still needs Pacific Islander adviser
  sign-off, as the outline's care notes ask.
- **New facts this pass added, also for the advisers:**
  - Scorpius as Māui's hook (Hawaiian Ka Makau Nui o Māui, Māori Te Matau a Māui). The writer had this;
    I left it.
  - Sandbars at low tide and the Moon's pull on tides (reader A10-13).
  - Sunrise caused by the Earth's spin (reader A10-12).
  - Decorator crabs (reader A10-9).
- **Open decisions (unchanged):**
  - The Disney licence for this page.
  - Adviser sign-off on the wayfinding, the cave, Gramma's song, Maui, and the names "Te Fiti", "Te Kā" and
    "Lalotai".
- **Wiring:** sprout `CHECKS` lost `edu:count:tries:3` and now lists 18 strings. Reader `CHECKS` is
  unchanged. Reader A10-9 has a new glossary word, "undignified".
- **Main-script notes for `atlas-a10.ts` (not edited):**
  - **`a10-05-complete`:** the narration says Gramma "has died, quietly, in her sleep", and
    `a10-05-bedside-done` has "Go on. I'm only resting." The page is `all`, so young children meet it in
    the main game too, and both bands already avoid this wording. Suggested lines:
    - "Gramma Tala has died, quietly, with her family round her. Moana sees the light go, and knows."
    - "Go on. I'm so proud of you."
  - **`a10-08-stars`, Maui:** "Your hand tells you how high it's climbed, and that tells you how far north
    you are." Only a star's highest point gives latitude. Suggested line: "Your hand tells you how high it
    climbs at its highest, and that tells you how far north you are."
- **Checks:**
  - `npx prettier --write` on both files: run.
  - `npx tsc --noEmit -p .`: clean.
  - `npx eslint` on both files: clean.
  - `npx tsx tests/tools/content-check.ts --warnings`: no problem or warning mentions an a10 id. The one
    remaining problem is `reader:a11-14-tunic`, which belongs to another reviewer.

### A11 The Enchanted Place

- **Main-script errors in `atlas-a11.ts` (not edited):**
  1. `a11-14-tunic#2`: `P('It isn’t sagging. It’s resting.')` echoes q12's lifted Dead Parrot line. Suggest `P('It isn’t sagging. It’s having a little sit-down.')`.
  2. `a11-04-gloomy-done#1`: "You’re a real friend. Not like some." is very close to Milne's Eeyore in WtP ch. IV, and it isn't in the lifted-text list. Check it against PG #67098, or use "You’re a real friend. Better than most."
  3. `a11-10-complete#0`: "pencils marked B, for Bear, and HB, for Helping Bear, and BB, for Brave Bear" is near-verbatim Milne, ch. X, which is past the Gutenberg cut-off, so unverified. Either list it as lifted (with `childLines`) or use "Inside are pencils with letters on them, B and HB and BB, and Pooh is sure every letter is about him."
  4. Four more Milne phrases appear unlisted: "Customary Procedure" (`a11-04-owl#5`), "a Useful Pot to Keep Things In" (`a11-06-presents#6`), "Strengthening Medicine" (`a11-07-bath#5`, `a11-12-malt#0`) and "A Sustaining Book" (`a11-02-stuck#11`). They are harmless in the main game, where the text is public domain in the US, but the lifted-text log should list them or the script should reword them. The edu wording above can be reused.
- **Writer-log items:**
  - The UK hold applies to both edu files: agreed.
  - The sprout A11-17 hide-and-seek softening: I recommend keeping it. Your call stands.
  - The two facts the writer flagged are fine. Tuesday/Tiw, Wednesday/Woden and Thursday/Thor are standard. "English spelling fixed around the 1700s" (Johnson's Dictionary, 1755) is a fair simplification. The Tiw line is reworded for clarity.
  - The script log's open question still stands: whether Hazel's note should say "the summer they stayed".
- **Conflict for you to settle (not an edu issue):** more-stories now says the Disney licence and the Shepard designs were approved on 2026-10-17. The `atlas-a11.ts` header still forbids any Disney or Shepard design. Settle which one is current.
- **Advisers:** none needed for A11. No living tradition or faith is involved.

### A12 The Mirror Shard

- **Sámi adviser (from the writer log, still open).**
  - Reader: Sápmi across four countries; several Sámi languages, North Sámi the most widely spoken and taught in
    schools; herders using snowmobiles as well as skis, and most Sámi working other jobs; Sámi National Day on
    6 February with the flag.
  - Sprout `a12-17-south-done-l1`: the North Sámi greeting "buorre beaivi" (spelling and whether to use it at
    all).
  - The definition "Lapland is the far north of Norway, Sweden and Finland, much of it inside the Arctic". Some
    Sámi find "Lapland" an outsider's word; it's used here only as Andersen's place name.
  - Whether "the Finnish woman" stays.

  All the facts above check out as far as I can tell.
- **Facts checked.** Andersen was born in 1805 in Odense; *The Snow Queen* came out in 1844; Germany is
  Denmark's only land border; swallows winter in Africa; female reindeer grow antlers; Spitsbergen is part of
  Svalbard (Norway); Etna and Vesuvius get snow; a yard is 91 cm; two miles is about 3 km. Every sum in both bands
  was rechecked.
- **Kisses (writer-log question).** The reader keeps the Snow Queen's forehead kiss, now "touches his forehead
  with a kiss colder than ice", and Gerda's kisses on Kay's cheeks, eyes and hands. Both are Andersen's and not
  romantic. The sprout band turns them into a wrap and a hug. My advice is to keep the reader as it is.
- **Paraphrase watch.** Two reader lines reuse the main script's own versions of lifted passages: Kay's "Where
  did you go? Where did I go?" (`a12-16-tears` #2) and "They're grown up, and they're children too, in the place
  where it counts" (`a12-18-roses` #4). They aren't Andersen's words, so the Learning Grove rule holds. If #1597
  is verified and the main script swaps in Andersen verbatim, these edu lines must not follow.
- **ETERNITY (writer-log question).** Both bands name the word. The reader glosses it ("time that goes on for
  ever"), with no nod to the Grove's Eternals. This is your call, as the script log says.
- **Small slips in `atlas-a12.ts` (not edited).**
  - `a12-02-frost#3`: "Downstairs, Grandmother is watching the snow come down past the window." Kay talks
    straight to her in the next lines, so "downstairs" puts her in the wrong room. Suggest: "By the stove,
    Grandmother is watching the snow come down past the window."
  - `a12-17-doe#3`: "I'm sorry about the face I did at you." British idiom is "pulled". Suggest: "I'm sorry
    about the face I pulled at you." (The edu bands already say "pulled".)
- **Checks.** From the repo root, both files are Prettier-clean, and `tsc --noEmit -p .` and eslint on the two
  files report nothing. `content-check --warnings` lists no problem or warning with an a12 id. Its one problem
  (`reader:a11-14-tunic`) and its other warnings belong to other reviewers' files. LF line endings are kept.

### A13 The Wooden Boy

- **Main-script ambiguity in `atlas-a13.ts`, `a13-grove-pixel` #7.** The original has the same "…and puts his nose back
  on." Clank is the only male in the scene, so it can be read correctly, but "his" right after "Pixel laughs" invites
  the wrong reading. Suggested replacement: "Pixel laughs, the way people do when they are let off something they
  didn’t know they were carrying, and puts Clank’s nose back on." Not edited.
- **Quote check, main script `a13-11-nose` #10.** "Some lies have short legs, and some have long noses. Yours are the
  long-nosed kind." follows Collodi's wording (and Murray's) closely. It is not one of the eight listed Murray
  passages, and "le bugie hanno le gambe corte" is also a common Italian proverb. The reader band reuses the line and
  quotes "Some lies have short legs" in `reader:a13-11-nose-l2`. Worth including in the quote-verification pass. If it
  counts as lifted text, the Learning Grove version needs new wording.
- **Writer-log item: Candlewick's death in sprout.** I weighed it and recommend keeping it. It follows EDU-STYLE to the
  letter: the plain word, what it means, "It did not hurt", then sitting together and remembering in the next scene.
  Softening it further would mean a euphemism, which the guide forbids. For the same reason, both bands now say
  Melampo "died" where they said "gone".
- **Main script, optional.** `a13-14-*` uses "gone" for Melampo. That is fine for the main game; the edu versions now
  say "died".
- **Italian adviser packet.** Add these:
  - *babbo* as Tuscan/central Italian for dad;
  - *pinocchio* as the Tuscan word for pine nut (standard *pinolo*);
  - *burattino* as a glove puppet;
  - *pescecane*;
  - *ciao*, and the pronunciation of *grazie* (now "GRAHT-see-eh" in sprout);
  - Pulcinella from Naples;
  - commedia dell'arte from the 1500s;
  - the order of courses (antipasto, primo, secondo, dolce);
  - hill towns built for defence;
  - Collodi's war service and the 1861 unification.
- **Writer-log item resolved.** The writer's "content-check not yet run" note is out of date: both files are now in
  `eduPacks`, and content-check reports no a13 problems or warnings.
- **Checks.** Run from the repo root after Prettier:
  - `npx tsc --noEmit -p .` is clean.
  - `npx eslint` on both files is clean.
  - `npx tsx tests/tools/content-check.ts --warnings` reports `problems: 1`, `warnings: 7`, and none of them mention a13.
    The one problem is `reader:a11-14-tunic`, another reviewer's file.
  - Both files are still LF.

## 7. Checks (after the fixes, from the repo root)

- `npx tsc --noEmit -p .`: no errors.
- `npx eslint src/content tests/tools`: no errors or warnings.
- `npx tsx tests/tools/content-check.ts --warnings`: **problems: 0**, warnings 2 (both `pa2-*` pronoun
  lines in Pixel's Arcade, outside this batch).
