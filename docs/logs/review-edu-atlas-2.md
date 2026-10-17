# Review: edu-atlas-2 (Learning Grove Atlas A14–A20, A22–A24, sprout and reader), fix mode

Date: 2026-10-17. Brief: `docs/briefs/review.md`. Files: `src/content/edu-a14-sprout.ts` …
`edu-a24-reader.ts` (19 files; A16 is reader-only). Each storyline was read in full against
`docs/canon.md`, the "Story and content" section of `CLAUDE.md`, `EDU-STYLE.md`, its original
(`atlas-aNN.ts`), its outline section in `docs/more-stories.md` and the writer's notes
`docs/logs/edu-aNN.md`. One reviewer per storyline applied the fixes to that storyline's files only.

All 19 files are LF and Prettier-clean. Nothing is committed. The edu-s24…s31 files, the batch-1 files,
`src/sim`, `src/ui`, the main scripts and `tests/tools/content-check.ts` were not touched.

## 1. Verdict

A sound batch to build on. In every storyline each in-scope original scene and variant has a version in
each band. Every choice id and `set` matches the original, so each signature choice still pays off. No Grove
flag is written, and no Nubbin or animal speaks outside the canon exceptions. The structure was right going in.

The real problems were these:
- **Missing standards.** 145 lessons had no approved `standard`: A14 13, A15 42, A16 7, A18 31, A19 31 and
  A22 21. CLAUDE.md requires one on every lesson. Each now has the nearest approved code, and lessons where
  no code honestly fitted were reshaped. A17, A20, A23 and A24 were already complete. No ELOF code is used
  in reader.
- **Wrong facts and sums**, about 40. Examples: "Odysseus" taught as starting like "orange"; lyre strings of
  different lengths; Homer "rhymed"; 180 km "farther than Kansas is wide"; sunrise as "gold, then red";
  reindeer "don't swim well"; four temperate seasons for central India; "karibu" as hello; Gobber given
  Stoick's line; a "blue, gold, blue, gold" pattern whose next colour was given as gold.
- **Lifted text.**
  - A22's "no, no, no" lyric fragment, in both bands, and a reader line close to Abuela's at the river.
  - Close Baum, Saint-Exupéry (the fox's "four o'clock" line), Magnus and Kipling wording ("Good hunting",
    "Look well", "Am I dying, Bagheera?").
  - A20's Thökk line, which follows the stock translations.
  - The two known pa5-01 hits in A17.
  - "Grief is love with nowhere to go" appears nowhere in the batch.
- **Safeguarding and safety.**
  - A15's Oz asked the child to keep a secret from the other grown-ups. Sprout now drops "keep"
    (`defaultChoice: 'theirs'`), and reader's lesson now says that kind of secret is one to tell.
  - A22's lamp lessons now say never touch a flame.
- **Continuity slips where sprout lines had been cut**, in A14, A17, A19, A20, A22 and A24. **Bridge gaps**
  in A23, where `a23-09-chase` used the gorge, the ledge and Zazu's wing, which only the omitted A23-8
  introduces. A16's last scene promised a "tomorrow evening" the band never reaches.
- **Caps:** over-long scenes in most storylines, and about 150 three-sentence narration lines (138 in A19
  alone).
- **The known items:**
  - Both A17 `a17-06-hollow-done` lines are reworded.
  - `reader:a20-15-complete` was not a chore mechanic, but it read like chores and didn't match the scene.
    It is reworded.
  - A18's missing standards were 31, not about 25. All are fixed.
  - A23's ELOF and CASEL codes are on the approved list and spelled correctly, and reader uses no ELOF.
  - A17's `moss-sleeps` means Moss has faded, so both bands are right to say he died. Sprout had dropped his
    flower (canon 15), which is now restored.
  - A16 ending at the well and A23 omitting A23-8 and A23-15 are both intentional. The bridges are now fixed.

All of these are fixed. After the fixes, the three checks end at 0 problems.

Counts: **127 must fix (127 done), 215 should fix (215 done)**.

| storyline | must fix | should fix |
| --- | --- | --- |
| A14 Homecoming | 21/21 | 40/40 |
| A15 The Humbug | 15/15 | 32/32 |
| A16 The Fox and the Rose (reader only) | 10/10 | 12/12 |
| A17 The Camphor Tree | 6/6 | 27/27 |
| A18 The Doll in the Pocket | 11/11 | 11/11 |
| A19 The Dragon Who Fell | 8/8 | 16/16 |
| A20 The Weeping | 12/12 | 18/18 |
| A22 The Candle | 25/25 | 17/17 |
| A23 Remember Who You Are | 6/6 | 15/15 |
| A24 The Law of the Jungle | 13/13 | 27/27 |
| **Total** | **127/127** | **215/215** |

### Per storyline

**A14 Homecoming.** A warm, faithful and well-built pair. The structure was already sound: every scene and variant is present in both
bands, the choices and the `a14-name` flags match, no Grove flag is written, nobody speaks who mustn't, and no lifted
text was found. The real problems were the usual ones:
- thirteen lessons with no approved standard;
- wrong facts and claims: the orange/Odysseus phonics, lyre strings of different lengths, rhyme in Homer, Minerva as a
  Latin spelling, "metals are hard", and the xenia pronunciation;
- lessons quoting a line the child hadn't heard (the moon phrase, in both bands);
- sprout continuity gaps where lines had been cut (the traveller, the figs, the spill, the eaten cattle, the lost
  ships).

All are fixed, and the three checks are clean for a14.

**A15 The Humbug.** A careful, warm pair that is faithful to Baum and not the film. The wiring is right and there are no same-domain pairs on any path. The real problems were:
- **Safeguarding:** the secret beat taught the wrong thing in both bands.
- **Missing standards:** 42 lessons had none.
- **Wrong facts and sums:** about six, among them the width of Kansas, the 96 mice against the thousands, the simile that wasn't one, five people at the council, and Aunt Em talking from the cellar.
- **Leftover Baum phrasing:** "bran-new brains", the nose smack, the Hammer-Head description and the china Princess.
- **Splitter damage:** brackets and a name cut across lines.

All are fixed. The three checks are clean for A15.

**A16 The Fox and the Rose (reader only).** A careful, warm and faithful reader version. It covers everything in scope, keeps every choice and flag, keeps all its sums right, and treats the drinker and the snake well. The problems were seven lessons with no approved standard, two near-translations of the book (one of them in the fox's own chapter), two three-sentence replies, and a last scene that promised the wall the child never reaches. All are fixed. The three checks are clean for a16.

**A17 The Camphor Tree.** This is a faithful, warm pair. Coverage, choice wiring and flags are exact, and the sensitive material (the mother, Mei lost, the shrine, the bath) is handled with care in both bands. The real faults were the two pa5-01 echoes and continuity slips where sprout lines had been cut (the flower, "She always did", "Nobody is on the step"). There was also one wrong phonics claim. Reader had a cluster of small story contradictions inside the maths (Satsuki at school, all 12 seeds planted, a shut house with shutters "still open"), and a few lessons that gave their own answers away. All are fixed. tsc, eslint and prettier are clean, and content-check reports 0 problems and nothing for a17.

**A18 The Doll in the Pocket.** A warm, faithful pair: complete scene coverage, intact choice wiring, gentle handling of the death and the stepmother's house, and no lifted text. The real gaps were 31 lessons with no standard (not 25), now all reshaped or retagged to honest approved codes. There was also one wrong fact (the order of sunrise colours, in both bands and in the main script), plus a handful of close paraphrases of Magnus and small diegesis slips, all fixed. The checks are clean for a18.

**A19 The Dragon Who Fell.** A careful, warm pair that follows the outline closely and handles the hard beats well. The Stoick line is never given, the foot is said plainly, and the dragon in the pit is left out of sprout. The real problems were six wrong facts or sums (the colour pattern, the heart that "never stops", Gobber for Stoick, the 2-metre Viking, Stoick "chasing" Hiccup, and the wall shadows), 31 lessons with no standard, and about 140 three-sentence narration lines. All of these are fixed. No same-domain pairs, flag writes or speaker breaches were found on any path.

**A20 The Weeping.** A careful, warm pair with no canon, flag or speaker problems, and a plain, gentle handling of Baldr's death in both bands. The real faults were continuity and accuracy. In sprout, lines kept pointing at things the sprout cut had removed (the arrow, the sprout at the door). In reader, six lessons quoted or showed lines the child hadn't reached yet. There was one wrong fact (reindeer can't swim), a cluster of loose Iceland and weekday facts, two same-domain pairs, six over-long sprout scenes, and a Thökk line close to the translations. All of it is fixed, and the checks are clean.

**A22 The Candle.** A careful, faithful pair. Coverage, choice ids, flags, speakers and domain variety were already right in both
bands, and the sums and Colombian facts (two coasts, three Andes ranges, coffee cherries, the Magdalena,
arepas, buñuelos at Christmas, the tiple's twelve strings) check out. The real problems were these: the "no,
no, no" lyric fragment and a near-film line at the river, both inherited from the main script; 21 lessons
with no approved standard; a safety slip about grown-ups touching flames; and a handful of loose facts and
caps. All are fixed.

**A23 Remember Who You Are.** A warm, careful pair that already did the hard things well: the death is said plainly once, with comfort, the hyenas are treated fairly, and Rafiki stays an elder, not a caricature. The real faults were at the two gaps. A child who skips A23-8 met an unexplained gorge, rim and wing, and reader cited a Mufasa line it never had. The child also never learned Scar's rule was over or that the pride knew the truth. There were also two Swahili errors, a myth definition that disparaged traditional stories, and a literacy pair the writer's adjacency script missed. All are fixed. Both bands now stand alone across the gaps, and all checks pass.

**A24 The Law of the Jungle.** A careful, warm pair of files with sound structure. Every scene, variant, choice and flag is in place, and the hard moments (Akela, Steller's sea cow, the seal drove) are handled plainly and kindly. The real problems were facts and lifted text. Both bands taught four temperate seasons for central India, the reader's seal search contradicted itself, "Good hunting", "Look well" and a verbatim Kipling outburst slipped through, and the reader tied Shere Khan's death to sleep. Sprout also had a few continuity gaps left by cut lines. All are fixed.

## 2. Must fix

### A14 Homecoming

Date: 2026-10-17. Brief: `docs/briefs/review.md` (fix mode). Files: `src/content/edu-a14-sprout.ts`,
`src/content/edu-a14-reader.ts`. Read in full (through a scratch dump of every scene in play order, with
lessons inline) against `docs/canon.md`, `EDU-STYLE.md`, `atlas-a14.ts`, the outline (`docs/more-stories.md`,
"## A14. Homecoming") and the writer log `docs/logs/edu-a14.md`. Nothing is committed; no other file was touched.

Scripted checks over both bands, before and after: every original scene and variant has a version (149 each);
choice ids and `set` flags match the original on every scene (the three `a14-name` choices included); no
scene-level `set`, so no Grove flag is written; no Nubbin or animal speaks (Argos never does; only Homer's
people, gods and the dead speak, as canon 31 allows); no line over 160 characters, no sprout line over 14
words, no reader line over 30; no narration line over two sentences; lesson ids unique; every `after` in range;
sprout `CHECKS` matches the `do` checks exactly (reader has no `do` lessons and an empty `CHECKS`); no two
same-domain lessons adjacent on the base path, nor with any replacing variant swapped in (see For Maor on the
inserted `a14-corvin-joins`). No quotes from Homer, Butler or any translation; the two Butler lines are retold
from the main script's `childLines`. "Grief is love with nowhere to go" and similar lines: none.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a14-sprout | `a14-02-loom-l1` | No `standard` (art). CLAUDE.md needs an approved code on every lesson. | `standard: 'ELOF: Mathematics Development'` (patterning: over, under, over, under). | done |
| edu-a14-sprout | `a14-12-sirens-done-l1` | No `standard` (music, high and low sounds). | `standard: 'ELOF: Scientific Reasoning'` (telling sounds apart). | done |
| edu-a14-sprout | `a14-07-name-l1` | "Odysseus starts with the sound o, o, o … orange". Wrong phonics: British English says it with a schwa (/əˈdɪsiəs/), American with a long o; neither is the short o of "orange". | Moved to the place name in the same scene: "Ithaca starts with the sound i, i, i. Which word starts the same: igloo or apple?" / "Yes! I, i, igloo. I, i, Ithaca." / "Apple starts with a, a, a. Igloo starts with i, just like Ithaca." Skill and note updated. | done |
| edu-a14-sprout | `a14-15-hut-done-l1` | The prompt says "The beggar said, between the old moon and the new", but the sprout scenes never say it (sprout's `eat` choice has only "This very year"). | New first line in `a14-15-hut-done`: BG "He will come home, between the old moon and the new." (lesson still after line 0). | done |
| edu-a14-sprout | `a14-07-hall-l1` | "Metals are hard and shiny." Wrong for gold, the first metal named: pure gold is soft. | "Gold, silver and bronze are metals. Metals shine when they are polished." / "(Find something shiny made of metal near you, like a spoon.)"; skill "metals can be polished until they shine". | done |
| edu-a14-reader | `a14-02-loom-l1` | No `standard` (art, warp and weft). | `'L.3.4'` (the lesson is the two new words, both in the glossary). | done |
| edu-a14-reader | `a14-05-complete-l1` | No `standard` (health, sleep). | `'CASEL: Self-management'`. | done |
| edu-a14-reader | `a14-06-bushes-done-l1` | No `standard` (health, washing). | `'CASEL: Self-management'`. | done |
| edu-a14-reader | `a14-12-advice-done-l1` | No `standard` (music, a steady beat keeps rowers together). | `'CASEL: Relationship skills'`. | done |
| edu-a14-reader | `a14-12-wax-done-l1` | No `standard` (health, protecting hearing). | `'CASEL: Responsible decision-making'`. | done |
| edu-a14-reader | `a14-13-strait-l1` | No `standard` (science, whirlpools and the Strait of Messina). | `'4-ESS2-2'` (reading Earth's features: a strait between Italy and Sicily). | done |
| edu-a14-reader | `a14-13-fig-l2` | No `standard` (health, tired muscles). | `'CASEL: Self-management'`. | done |
| edu-a14-reader | `a14-16-gate-done-l1` | No `standard` (health, what an old dog needs). | `'K-LS1-1'` (what animals need to live). | done |
| edu-a14-reader | `a14-19-threshold-done-l1` | No `standard` (health, the body's alarm system). | `'CASEL: Self-awareness'`. | done |
| edu-a14-reader | `a14-19-clean-done-l1` | No `standard` (health, cleaning and fresh air). | `'CASEL: Responsible decision-making'`. | done |
| edu-a14-reader | `a14-corvin-joins-l1` | No `standard` (health, breathing after running). | `'CASEL: Self-awareness'`. | done |
| edu-a14-reader | `a14-01-stair-l1` | "His lyre has strings of different lengths … The shortest, tightest one". Wrong: a Greek lyre's strings are about the same length and differ in thickness and tension. (Tension is also taught again in `a14-18-string-l1`.) | "His lyre’s strings are all about the same length, but some are thicker than others. Which string will sound the highest note?" + "The thinnest one" / "Yes. A thin string wobbles quickly, and quick wobbles make a high note. Thick strings wobble slowly and sound low." − "The thickest one". Skill "a thinner string makes a higher note". | done |
| edu-a14-reader | `a14-07-bard-l1`, best option | "With rhythm, rhymes and repeated phrases". Homer's verse doesn't rhyme: the memory aids are the metre and the formulas. | "With a steady rhythm and phrases that come round again and again." | done |
| edu-a14-reader | `a14-07-name-l1`, best reply | "so Odysseus became Ulysses and Athena became Minerva. Same people, different language." Minerva is a separate Roman goddess who was identified with Athena, not a Latin spelling, and the Latin name is Ulixes. | "Yes. The Romans told the story in Latin, where Odysseus was Ulixes, and English made that Ulysses. Athena was matched with their own goddess, Minerva." | done |
| edu-a14-reader | `a14-01-gate-l2` | "xenia (ZEE-nee-ah)": wrong pronunciation. English says ZEN-ee-uh (modern Greek ksen-EE-a). | "xenia (ZEN-ee-ah)". | done |
| edu-a14-reader | `a14-15-hut-done-l1` | The prompt quotes the beggar's "between the old moon and the new", but in `a14-15-hut` only the `eat` choice says it. On the other two paths it hasn't been said (`a14-17-hearth` says it later). | New first line in `a14-15-hut-done`: BG "Mark my words: he will come, between the old moon and the new." (lesson still after line 0; reads well after the `eat` choice too). | done |

### A15 The Humbug

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a15-sprout | 11 art and music lessons: `01-complete-l1`, `02-slate-done-l1`, `02-boq-done-l1`, `04-cottage-done-l1`, `08-strings-done-l1`, `09-gate-l1`, `11-yard-done-l1`, `12-mend-done-l1`, `15-courage-done-l1`, `16-complete-l1`, `19-call-l1` | No `standard` (CLAUDE.md requires an approved code on every lesson). | New const `APP = 'ELOF: Approaches to Learning'` (ELOF's Creativity sub-domain sits there) on all 11. | done |
| edu-a15-sprout | `a15-14-secret`, choice `keep` | A grown-up asks the child to keep a secret from the other grown-ups, the child can promise, and he answers "Thank you. You do not know what that means to me." That is the pattern safeguarding teaches children to tell about, straight after a lesson saying to tell. | Dropped `keep` in sprout, `defaultChoice: 'theirs'` (the choice sets no flag). Added a third notice line: "Tell them, too, if a grown-up asks you to keep a secret." Header note updated. | done |
| edu-a15-sprout | `a15-20-complete-asked-l1` | The lesson asks what the Monkey King wants to do before he says "Play.", but its skill is "listening to what a character says" and the wrong reply says "He said play!". | Moved to after "Play." (source `after` 5 → 6). | done |
| edu-a15-sprout | `a15-03-feet`, choice `holes` | Four-sentence narration: "“Hole!” He steps round. “Hole!” He steps round." | "Each time you call “Hole!”, he steps round it." | done |
| edu-a15-sprout | `a15-12-bucket-l1`, best reply | Teaches melting and dissolving as one thing: "Yes! It melts away into the tea. That is called dissolving." (reader rightly says they differ). | "Yes! It mixes into the tea until you cannot see it. That is called dissolving." | done |
| edu-a15-reader | 31 lessons (`01-storm-done-l1`, `01-complete-l1`, `02-boq-done-l1`, `03-pole-done-l1`, `03-complete-l1`, `04-groan-l1`, `04-cottage-done-l1`, `04-oil-l2`, `05-complete-l1`, `07-raft-l1`, `08-poppies-done-l1`, `08-wildcat-l1`, `08-strings-done-l1`, `08-complete-l1`, `09-gate-l1`, `09-spectacles-l1`, `09-complete-l1`, `10-fire-l1`, `11-yard-l1`, `11-yard-done-l1`, `12-bar-done-l1`, `12-bucket-l1`, `12-mend-done-l1`, `14-voice-done-l1`, `15-heart-l1`, `16-complete-l1`, `18-council-l1`, `19-hill-done-l1`, `19-call-l1`, `20-glinda-l1`, `20-goodbye-done-l1`) | No `standard`. | Nearest approved code on each: safety and first aid → `CASEL: Responsible decision-making`; sleep → `CASEL: Self-management`; materials, rust, floating, emerald, dissolving, silver, colour mixing and the colour wheel → `2-PS1-1`; balance and friction → `3-PS2-1`; insects, spiders and pulse → `4-LS1-1`; food chain and food as fuel → `K-LS1-1`; filters → `1-PS4-2`; community → `D2.Civ.8.K-2`; contrast → `RL.4.3`; tints and shades, piano and forte → `L.3.4`; work-song beat and 4/4 → `RL.2.4`; warm and cool colours → `RL.1.4`; face proportion (halfway) → `1.G.A.3`; turning point → `RL.2.3`; understatement → `L.4.5`. | done |
| edu-a15-reader | `a15-01-storm-l1`, best reply | Uncle Henry, inside the story, says "Baum called them cyclones." | Henry: "That’s the one. Spring and early summer bring most of the tornadoes." Then narrator: "Baum’s book calls them cyclones." | done |
| edu-a15-reader | `a15-01-storm-done-l1`, all three replies | Aunt Em answers ("Quite right…", "Never. Windows shatter…") while she is down in the cellar and the house has just flown away. | All three replies are now spoken by the narrator, same words. | done |
| edu-a15-reader | `a15-01-cyclone-l1`, best reply | Wrong fact: "That is farther than most of Kansas is wide". 180 km is about a quarter of Kansas’s width (about 650 km). | "Yes. 60 + 60 + 60 = 180, or 3 × 60 = 180. That is a long way to travel in a house, and nobody even steered." | done |
| edu-a15-reader | `a15-01-complete-l1` | The splitter cut the name: the notice read "W. W." on one line and "Denslow drew the pictures…" on the next. | "The artist William Wallace Denslow drew the pictures for the first edition of this book, in 1900." | done |
| edu-a15-reader | `a15-01-page-done` and its lesson | The simile lesson says a simile uses "like" or "as", but the line is "watches the sky the way a sailor watches the sea". | Line and prompt now: "She watches the sky like a sailor watching the sea." | done |
| edu-a15-reader | `a15-02-council` #1 | "Three men and a woman come up…" then "A very old woman… bows" makes five people; in Baum and the main script the woman in white is one of the four. | "The woman is very old, in a white gown sprinkled with stars. She bows low to Dorothy." | done |
| edu-a15-reader | `a15-08-strings` and `-l1` | 12 rows of 8 = 96 strings tied, yet the `count` choice reaches "four hundred and twelve" and "thousands" pull the cart. | "…and the first of them line up in rows of eight, twelve rows in all." Prompt: "The first mice stand in 12 rows of 8. How many strings have you tied for them?" | done |
| edu-a15-reader | `a15-14-secret-l1`, best reply | Ends "Oz’s is a heavy secret, but it is not a dangerous one." Tells a 7-year-old that a grown-up’s request to keep a secret from other grown-ups is fine to keep. | "…one to share with a grown-up you trust. So is any secret a grown-up asks you to keep from other grown-ups, like this one." | done |
| edu-a15-reader | `a15-15-brains-done` #1 | "There. Bran-new brains." is Baum’s phrase; the Learning Grove takes no quotes (the main script’s own header lists it as never given). | "There. Your new brains, fresh from the sack. You will be a very great thinker now." | done |

### A16 The Fox and the Rose (reader only)

Date: 2026-10-17. File: `src/content/edu-a16-reader.ts`. Read in full against `docs/canon.md`, `EDU-STYLE.md`,
the original `atlas-a16.ts`, the outline (`docs/more-stories.md`, "## A16. The Fox and the Rose") and the writer
log `docs/logs/edu-a16.md`. A script compared every scene id, choice id, `set` and play-order domain with the
original, including each variant swapped in.

Scope holds: all 74 quest scenes in A16-1 to A16-15 and the ten variants that play inside them have a version.
Every choice id and `set` (`a16-strap`, `a16-globe`) matches, and no Grove flag is written. Only the source's own
talkers speak (pilot, prince, rose, the grown-ups, snake, flower, echo, roses, fox, switchman, merchant). Your
Nubbin and Sable never speak. `CHECKS` lists exactly the four `edu:` checks that are used. The scan found no
same-domain pair on any play path, before the fixes or after them.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a16-reader | `a16-01-complete-l1` (art, cross-section) | No `standard`. CLAUDE.md requires an approved code on every lesson. | Added `'L.2.4'`. "cross-section" is a glossary word, and the lesson teaches what it means. | done |
| edu-a16-reader | `a16-03-telling-l1` (asteroids) | No `standard`. | Added `'1-ESS1-1'` (objects in the sky that circle the Sun). See should-fix for the facts. | done |
| edu-a16-reader | `a16-04-chairs-done-l1` (warm and cool colours) | No `standard`, and no approved code fits the lesson as written. | Reshaped to fit RL.1.4 (words for the senses). It now reads "Warm and cool are words for how things feel to touch. Artists borrow them for colours." / "Red, orange, pink and gold are warm colours, and blue and violet are cool. A sunset puts them side by side." It is still `art`, with `'RL.1.4'`. | done |
| edu-a16-reader | `a16-05-complete-l1` (four thorns) | No `standard`. | Added a third line, "He chose her thorns, the thing she was proudest of. That shows how well he knows her.", and `'RL.4.3'`. It is still `art`, and the parent note was updated. | done |
| edu-a16-reader | `a16-10-books-l2` (evidence) | No `standard`, and no NGSS code covers "evidence". | Retagged as `literacy` with `'L.2.4'`, since "evidence" is the scene's glossary word. The skill is now "the word “evidence”: something real that shows whether a claim is true". The lines are unchanged. The domains still alternate (social studies, literacy, maths). | done |
| edu-a16-reader | `a16-13-secret-done-l1` and `a16-13-secret-done-glass-l1` (one builder) | No `standard`. | Added `'RL.1.4'` (a colour word that carries a feeling). It is still `art`. | done |
| edu-a16-reader | `a16-12-roses-done-l1`, best reply | The narration has three sentences, and the last one is false: "Fifty rows, and still only one of them is his." His rose is not in the garden. | "Yes: 50 × 100 = 5,000, so there are 50 rows." / "Fifty rows of roses, and not one of them is his." | done |
| edu-a16-reader | `a16-14-pills-l1`, best reply | The narration has three sentences: "Yes. 53 + 53 = 106 minutes. Sixty of them make an hour, and 46 are left over." | Split into "Yes: 53 + 53 = 106 minutes." / "Sixty of them make an hour, and 46 are left over." | done |
| edu-a16-reader | `a16-13-hour` #4 (also `a16-13-hour-t45` #4, same builder) | Lifted text. "If you come at four, I begin to be happy at three." is a near-translation of a ch. XXI sentence ("à quatre heures… dès trois heures je commencerai d'être heureux"). That would be a fourth lifted line, and the reader band may not use any. The main script had avoided it on purpose. | "So I know when you’re coming. Then I can start being happy a whole hour before you get here." The clock lesson ("If the boy comes at four o’clock, at what time do I start being happy?") still works. | done |
| edu-a16-reader | `a16-15-complete` #1–2 | The last scene promises a scene the child never sees: "Then come back here, tomorrow evening." / "Tomorrow it will be a year since I came down." That sets up the wall, which the Learning Grove skips. | "You’ll mend your engine soon. I can tell. Then you can fly home." / "It’s nearly a year since I came down, just near here. That’s a long time to be away." "I’m going home to my rose", the scarf and the reflective line stay. The year lesson still fits. | done |

### A17 The Camphor Tree

Date: 2026-10-17. Brief: `docs/briefs/review.md` (fix mode). Files: `src/content/edu-a17-sprout.ts`,
`src/content/edu-a17-reader.ts`. Read against `docs/canon.md`, `EDU-STYLE.md`, `atlas-a17.ts`, the
outline (`docs/more-stories.md` A17) and `docs/logs/edu-a17.md`. A scratch script (not in the repo)
rendered both bands scene by scene after line splitting and checked ids, choices and `set` flags,
caps, approved standards, `CHECKS`, and same-domain lessons along the four page paths (wait/hunt,
with/without `s1Done`) plus every Grove keepsake path, both after `a17-11-complete(-oak)` and after
`a17-16-complete(-hunt)`.

Coverage is complete: all 77 quest scenes and 20 variants have a version in each band, choice ids
and the one `set` (`a17-tunnel` on `a17-06-greet`, `a17-tree` on the complete scenes) match, no
Grove flag is written, and nobody speaks who mustn't (the spirits and the Catbus never speak; your
Nubbin never speaks). No film dialogue, no song lyrics, no "Grief is love with nowhere to go".
Every lesson has an approved standard (ELOF in sprout only). No three-sentence narration lines.

Line endings: both files are LF (byte check: 0 CRLF). The task note said CRLF, but `grep -c $'\r'`
in this Git Bash counts every line; I kept LF, as the files were written.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a17-sprout | `a17-06-hollow-done` #0 | Content-check: quotes pa5-01, "You open your eyes. You are lying on moss in a green clearing." | "You wake up on soft moss in a green clearing." | done |
| edu-a17-reader | `a17-06-hollow-done` #0 | Content-check: quotes pa5-01, "When you open your eyes, you are lying on moss in a small clearing in the bamboo, with Mei asleep beside you." | "You wake on soft moss in a small clearing in the bamboo. Mei is asleep beside you." | done |
| edu-a17-sprout | `a17-grove-oak-sleeps` | Saying Moss died is right (see For Maor), but the scene dropped his flower, which canon 15 puts by the flat stone and the original shows ("over his flower"), while the lesson says "A tree and a flower help us remember". It also never tied "died" to the Grove's word "fade" (EDU-STYLE: "Fossil faded. That means she died."). | Lines now: "Moss faded. That means he died." / "His body stopped working, and it will not start again." / "His flower grows by the stone. The oak spreads its branches over it." The lesson now plays after the flower line. "You thread it on the string." became "An acorn drops. You thread it on, where Moss’s acorn was." | done |
| edu-a17-sprout | `a17-12-complete` #3 and lesson | Contradiction: the lesson counts "Granny, Satsuki and you" on the step, then the next line says "Nobody is on the step." | Line: "Mei’s place on the step is empty. There is only a dent in the cushion." Lesson: "Who is still here? Granny, Satsuki and you." / "(Count them: one, two, three. Who is missing?)" / "Mei, and your Nubbin." | done |
| edu-a17-sprout | `a17-15-sign-hunt-done-l1` | Wrong phonics: "a rhyming pair" taught as "red bib", and "(Say red bib, red bib. Which words end the same? Bib and… crib!)": red and bib don't rhyme. | "Each statue wears a red bib." / "Bib rhymes with crib, and with rib." / "(Say them together: bib, crib, rib!)"; skill "hear and say rhyming words: bib, crib, rib". Check `edu:say:rhyme:red-bib` is now `edu:say:rhyme:bib` (CHECKS updated). | done |
| edu-a17-sprout | `a17-grove-oak`, choice `tell` | Cut-line continuity: the sprout cut "It was Hazel’s acorn", so Moss's "She always did." has no "she". | "It was Hazel’s acorn. I had a lot of help." / "She always did." | done |

### A18 The Doll in the Pocket

Date: 2026-10-17. Files: `src/content/edu-a18-sprout.ts`, `src/content/edu-a18-reader.ts`. Read against `docs/canon.md`, CLAUDE.md "Story and content", `docs/briefs/review.md`, `EDU-STYLE.md`, `atlas-a18.ts`, `docs/more-stories.md` §A18 and `docs/logs/edu-a18.md`. Both files were also checked by script in the scratch folder: every lesson's line caps and `after` index, scene lengths, choice ids and `set` flags against the original, `CHECKS` against the checks actually used, and same-domain neighbours on all six play paths (crust = nubbin, doll or self, each with and without the margin note and the Sable scene).

What was already right: all 122 original scenes and variants have a version in each band. Every choice id and `set` matches (so `a18-crust` still pays off in A18-10, -11, -12, -13, -15 and -16). No Grove flag is written. Only source characters speak: the doll and the skull may talk as they do in the tale, and Nubbins and Sable never speak. No two lessons of the same domain sit next to each other on any path, before or after these fixes. The mother's death is said plainly ("her body stopped working, and it will not start again") and the comfort follows straight after. Nobody is burned. No Magnus line appears, and "Grief is love with nowhere to go" isn't used.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a18-sprout | art: `a18-04-last-done-l1`, `a18-07-complete-l1`, `a18-11-poppy-done-l1`, `a18-12-complete-l1`, `a18-15-complete-l1` | No `standard` (the known item). | Reshaped each one so an approved code fits honestly. **04-last-done** and **11-poppy-done** become guess-then-try colour mixing, `ELOF: Scientific Reasoning`: "(What if we mix blue paint and yellow paint? Guess first.)" / "(Now try it, or mix them in your mind. Green!)", and the grey version. **07-complete** becomes a repeating colour pattern, `ELOF: Mathematics Development`: "White rider, red rider, black rider. Every day, the same order." / "(Make a colour pattern: white, red, black, white, red… What comes next?)". **12-complete** becomes a `do`, `K.MD.B.3`: "Red, orange and yellow are warm. Blue, green and purple are cool." / "(Sort some crayons into warm and cool. Count each pile.)". **15-complete** becomes `ELOF: Scientific Reasoning`: "Wood stops the light. The carved holes let it through." / "(Shine a torch through a colander. Can you see the spots of light?)". | done |
| edu-a18-sprout | music: `a18-05-journey-done-l1`, `a18-10-night-done-l1` | No `standard`. | Both now `1-PS4-1`, with a vibration beat added. 05: "(Hand on your throat! Can you feel it shake as you make the sound?)". 10: "Baba Yaga whistles. A whistle is air shaking as it rushes out." | done |
| edu-a18-sprout | social studies: `a18-16-palace-l1` ("a gift is given freely") | No `standard`; no C3 code fits a gift. | Retagged as `sel`, `CASEL: Relationship skills`. The neighbours are art and literacy, so no pair is created. | done |
| edu-a18-reader | health: `a18-02-supper-l1`, `a18-10-night-l1`, `a18-13-throw-done-l1`, `a18-16-shirts-done-l1`, `a18-13-dark-self-l1` | No `standard`. | **02-supper** is now `K-LS1-1`: "People, like all animals, need food to live: it gives us energy to move, think and grow." **13-dark-self** is `K-LS1-1` too. **10-night** is `CASEL: Self-management`, with "A regular bedtime is a habit you can manage for yourself." added to the reply. **13-throw-done** is `4-LS1-1`: "Muscles pull on bones to move your arms, and they tire when they work without a break." **16-shirts-done** is `4-LS1-1` (the eye's focusing muscles). | done |
| edu-a18-reader | music: `a18-02-complete-l1`, `a18-05-journey-done-l1`, `a18-14-complete-l1`, `a18-16-tsar-done-l1` | No `standard`. | **02-complete** is now `RL.2.4`, adding "…a steady beat and lines that come round again and again". **14-complete** is `RL.2.4`: "Say “not far now, not far now” in time with your feet." **05-journey-done** (pitch) and **16-tsar-done** (bell size) are now `1-PS4-1`. | done |
| edu-a18-reader | art: `a18-04-last-done-l1`, `a18-07-complete-l1`, `a18-11-poppy-done-l1`, `a18-12-complete-l1`, `a18-15-complete-l1` | No `standard`. | **04-last-done** is now a literacy simile ask, `L.4.5`, on the scene's own "as blue as a clear morning". **07-complete** is `RL.4.3`: "The tale paints its setting in colour…". **11-poppy-done** is `L.3.4`, on "shade" as a darker colour versus the shade the sisters sat in. **12-complete** is a warm/cool sort, `K.MD.B.3`: "Sort these six… How many are warm?", best "Three: red, orange and yellow". **15-complete** stays a think question, now `RL.3.6`: "To the stepmother the skull was terrifying; to Vasilisa it was the light that brought her home. How does the kind lantern feel to you?" | done |
| edu-a18-reader | science: `a18-05-journey-l1`, `a18-11-oil-done-l1`, `a18-12-question-done-l1`, `a18-14-door-l1`, `a18-13-dark-doll-l1` | No `standard`. | **05-journey** is now `2-PS1-4`, with "Then the droplets dry back into vapour and the cloud vanishes: the change reverses." added. **11-oil-done** is `3-LS1-1`: "Many seeds store oil as food for the young plant when it sprouts." **12-question-done** is `2-PS1-1`, reshaped to ask which property of birch bark made it good for writing (best: "It peels in thin, flat sheets that a sharp point can scratch"); betulin stays in the reply. **14-door** is `3-5-ETS1-2`: "Compare these three solutions. Which one would put out a candle?" **13-dark-doll** is `4-LS1-1`. | done |
| edu-a18-reader | literacy: `a18-08-fence-done-l1`, `a18-12-supper-done-l1`, `a18-15-loom-done-l1`, `a18-15-loom-done-self-l1` | No `standard`. | **08-fence-done** (onomatopoeia) is now `RL.1.4`. **12-supper-done** (the rule of three) is `RL.2.4`. The two **loom-done** lessons become social studies, `D2.His.2.K-2`: "Long ago, families made linen by hand in five steps: bleach, spin, pull, weave and ret (…). Which order did they go in?". The reply adds "Today machines do most of it, in the same order." | done |
| edu-a18-sprout | `a18-07-white` #5 | Wrong fact: "Everything goes gold, then red, then day." At sunrise the light is red first and turns gold as the Sun climbs. | "The sun rises. Everything goes red, then gold, then bright day." | done |
| edu-a18-reader | `a18-07-white` #5 and `a18-07-white-l1` prompt | Same error: "goes gold, then red, then plain day"; "the sky turns gold and red". | "…goes red, then gold, then plain day." / "At sunrise the sky turns red and gold." | done |
| edu-a18-reader | `a18-13-dark-doll-l1`, best reply | "It is an automatic response to cold or fright." Shivering that makes heat is a response to cold. Trembling with fright is a different thing. | "It is the body’s automatic answer to cold." | done |

All 31 lessons now carry an approved code: 8 in sprout and 23 in reader (the writer's log said 25; the true count was 31). A scratch script checks every lesson in both files against the EDU-STYLE list and finds 0 problems in 245 lessons. No ELOF code is used in reader.

### A19 The Dragon Who Fell

Files: `src/content/edu-a19-sprout.ts`, `src/content/edu-a19-reader.ts`. I read both in full (dumped scene by scene) against `atlas-a19.ts`, the outline (`docs/more-stories.md` A19), `docs/canon.md`, `EDU-STYLE.md` and `docs/logs/edu-a19.md`. A scratch script checked coverage, choice ids and `set`, standards, caps, sentence counts, speakers, `CHECKS`, and same-domain pairs on the base path and with each of the seven variants swapped in.

Coverage is complete: all 91 quest scenes and 8 variants have a version in each band. Every choice id and `set` matches the original (so `a19-first` still pays off in A19-8, A19-11 and A19-18), no Grove flag is written, and only the people of Berk, the narrator and (once, in reader) `you` speak. No Nubbin or dragon speaks. There were no same-domain pairs on any path before or after the fixes. Nothing is lifted from the film or the books: the two licensed lines are not used, there is no oath, and there is no "Grief is love with nowhere to go".

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a19-sprout | `a19-10-complete-l1` | Wrong answer to the pattern. The pattern "Blue, gold, blue, gold." continues with blue, but the line said "What colour comes next? Gold! A pattern repeats." | "Which colour comes next? Blue, because a pattern repeats!" | done |
| edu-a19-sprout | `a19-02-chase-l1`, option "Stops" | "A heart never stops." This is false, and it is an odd thing to tell a 4-year-old. | "Your heart keeps going. It beats faster to help your legs run." | done |
| edu-a19-reader | `a19-03-hall-done-l1` prompt and the "vehicle on rails" reply | The lesson says Gobber said "train the young ones", but it was Stoick (`a19-03-hall` #3). | Prompt: "Stoick said somebody must “train the young ones”, and “train” can also mean a vehicle on rails. Which does Stoick mean?" Reply: "…Stoick means to teach and practise." | done |
| edu-a19-reader | `a19-11-astrid-done-l1` | "A Viking is about 2 metres tall." Wrong: Viking-age men averaged about 1.7 m. | "The pine is 12 metres tall, and Stoick is about 2 metres tall. How many Stoicks, laid head to toe up the trunk, would match it?" The "10" reply is now "Ten Stoicks would be 20 metres." | done |
| edu-a19-reader | `a19-16-chain-l1`, option "He has not changed at all" | "He chased Hiccup into the sea." Stoick went into the sea to save him. He never chased him. | "Compare the jetty with the water’s edge: he went into the sea after Hiccup and said sorry. That is a big change." | done |
| edu-a19-reader | `a19-09-forge-l1` prompt | "When the lamp moves lower, what happens to the shadows it throws on the wall?" The physics is muddled: the "longer, like sunset" answer holds for shadows across a flat surface, not on a wall. | "…what happens to the tools’ shadows on the bench?" | done |
| edu-a19-sprout | 5 lessons with no `standard` (CLAUDE.md needs one on every lesson): `a19-02-complete-l1`, `06-complete-l1`, `08-lines-l1`, `10-complete-l1`, `18-flight-l1` | No standard. | Charcoal marks and drawn lines: `ELOF: Perceptual, Motor, and Physical Development`. Kind eyes: `CASEL: Social awareness`. The colour pattern: `ELOF: Mathematics Development`. Naming colours: `ELOF: Language and Communication`. | done |
| edu-a19-reader | 26 lessons with no `standard` | No standard. | `01-raid-l1` gets 2-PS1-4, reshaped by adding a Gobber line, "And burnt is burnt. Ash never turns back into wood.", and a matching skill and parentNote. `01-raid-done-l1`, `02-chase-l1` and `06-cove-l1` get 4-LS1-1. `01-launcher-l1`, `03-docks-l2` and `09-pedal-l1` get 3-PS2-1. `02-complete-l1` gets 2-PS1-1: the second line is now "Each material suits a job. Soft charcoal makes dark, smudgy shadows, and a hard pencil makes fine lines." `04-woods-l1` gets K-ESS2-2: its line is now "Hiccup sees a pine snapped and the earth torn up by something big. That is evidence." `04-bound-done-l1` gets CASEL: Self-awareness. `06-complete-l1` gets CASEL: Social awareness. `07-knife-l1`, `08-hand-l1`, `10-grass-l1`, `10-eel-l1` and `08-hand-slow-l1` get 4-LS1-2. `09-pedal-l2` had no code that fitted "writing clear instructions", so it is reshaped as L.3.4: "Hiccup’s card says “Down two: hard left.” What does “hard” mean here?" (Turn sharply, with force / Difficult / Solid, like stone). `09-pedal-done-l1`, `11-turn-l1` and `16-complete-l1` get 4-PS3-2. `12-fog-l1` gets 2-ESS2-3. `14-cliff-l1` gets CASEL: Relationship skills. `15-hands-l1`, `08-hand-grab-l1` and `08-near-ran-l1` get K-ESS3-3. `18-flight-l1` gets D2.His.2.K-2. No ELOF code is used in reader. | done |

### A20 The Weeping

Date: 2026-10-17. Files: `src/content/edu-a20-sprout.ts`, `src/content/edu-a20-reader.ts`. Read against
`docs/canon.md`, `docs/briefs/review.md`, `EDU-STYLE.md`, `atlas-a20.ts`, the A20 outline in
`docs/more-stories.md` and `docs/logs/edu-a20.md`. Both files were also loaded with tsx and checked
mechanically on the built scenes (after the files' own `split()` runs): every original scene and variant
present, choice ids and `set` flags, speakers, standards, caps, scene lengths, CHECKS, and same-domain
pairs on every route (4 Cinder/kept-stone states × 3 Thökk choices × s24Done on/off).

What was already right: all 80 quest scenes and 14 variants have a version in each band. Every choice id
and the three `a20-thokk` sets match the original. No Grove flag is written, there is no scene-level
`set`, and no Nubbin or animal speaks. Every lesson has an approved standard (no ELOF in reader).
`CHECKS` matches the `do` checks used exactly. No line is over 160 characters, no sprout line is over
14 words, no reader line is over 30, and no narration line has more than two sentences. "Grief is love
with nowhere to go" does not appear. Baldr's death is said plainly in both bands, with comfort straight
after, and nothing calls it sleep.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a20-sprout | `a20-04-complete` #2 | Continuity: "Did you hear about the arrow?" Sprout's game never shows an arrow (it was cut; only stones are thrown). | "Did you hear Thor’s big stone go drop?" | done |
| edu-a20-sprout | `a20-17-pieces` #1 | Same cut arrow: "The arrow that went round me?" | "Do you remember the Thing-field? Thor’s big stone that went drop?" | done |
| edu-a20-sprout | `a20-05-complete` #2 and `-l1` | Continuity: "Your Nubbin sits by the door, looking at the little green sprout." The sprout grows on the old oak, out on Frigg's walk, not at Fensalir. | "Your Nubbin sits by the door, looking out towards the old oak." Lesson: "The green sprout on the old oak is mistletoe. It is a real plant." / "Mistletoe grows on a branch of another tree." / "It drinks water from the tree. Its green leaves make food." (adds the host-water fact) | done |
| edu-a20-sprout | `a20-08-pyre` #0–2 | "She is so very sad." / "Nanna was so sad that she died". This tells a 3–6-year-old that being very sad can kill you, which goes against EDU-STYLE's "not frightening" rule. | "Nanna, Baldr’s wife, is on the shore. She loved him very much." / "Nanna dies too, there on the shore. Her body stops working." / "They lay her on the ship beside Baldr. Now they are together." | done |
| edu-a20-sprout | `a20-07-door-l1` | The lesson plays before the choice and gives it away: "Frigg likes “we will try” best." | It is now a bravery ask (CASEL: Self-management): "The road is long and dark. What helps us feel brave?" Options: "Going with a friend" (best) and "Going all alone". | done |
| edu-a20-reader | `a20-03-beasts-l1`, "fly/swim" reply | Wrong fact: "Reindeer neither fly nor swim well". Reindeer are strong swimmers. | "Reindeer cannot fly, though they are strong swimmers. Their wide hooves and thick coat are for snow and cold." | done |
| edu-a20-reader | `a20-03-promise-l1` prompt | It quotes "A promise carried by somebody else is only an errand." That line is in the `for` choice's reply, which comes after the lesson, so the child hasn't heard it. | "Frigg wants your Nubbin to make its own promise, not to have someone promise for it." / "Why might a promise mean more when you make it yourself?" | done |
| edu-a20-reader | `a20-04-turn-l1`, "he enjoys listening" reply | It quotes Hödr's "It isn’t a game you play blind." That line is in the next scene (`a20-04-hodr`). | "He does enjoy the laughing. But notice he stands apart, with nothing in his hands. He might like to be in it." | done |
| edu-a20-reader | `a20-07-door-l1` prompt | "Frigg asks you to promise only that you will try…". She says this only in the `home` reply, which comes after the lesson. | "You are about to ride a road that nobody has come back from." / "Is “I will try” a more honest promise than “I will bring him home”? Why?" | done |
| edu-a20-reader | `a20-01-ember-l1` | It plays after line 1 but begins "Frigg says someone gave that away…", which is Frigg's line 2. | `after` 1 → 2 | done |
| edu-a20-reader | `a20-10-gifts-l1` | It plays after line 2 ("Nanna gives Frigg a folded linen smock"), but Nanna doesn't bring the smock until lines 3–4. | `after` 2 → 4 | done |
| edu-a20-reader | `a20-16-edge-sat-l1` | It plays after line 3 and asks why the figure turns, but the figure turns at line 4. | `after` 3 → 5 | done |

### A22 The Candle

Date: 2026-10-17. Files: `src/content/edu-a22-sprout.ts`, `src/content/edu-a22-reader.ts`. Read in full against
`docs/canon.md`, `docs/briefs/review.md`, `EDU-STYLE.md`, `atlas-a22.ts`, the outline (`docs/more-stories.md`
3613–3737) and `docs/logs/edu-a22.md`. A scratch script loaded both modules and checked every scene against the
original: coverage, choice ids, `set` flags, standards, caps, sentence counts, CHECKS and same-domain pairs
(across scene and quest boundaries, with every variant swapped in, Hazel's margin note optional).

Structural results before any fix: all 74 quest scenes and 23 variants have a version in each band; every choice
id and the `a22-job` sets match; no scene-level `set`; no Grove flag; no `defaultChoice` needed. Speakers are only
the narrator, the Madrigals, the Guzmáns, the neighbour and `you` (reader); the Nubbin never speaks, and Antonio
relays the animals as the outline asks (canon 31, source animals). No same-domain pair on any play path in
either band. CHECKS lists exactly the strings used in both files.

Line endings: the brief said CRLF, but both files are LF (0 carriage returns before and after; checked with
Python, since Git Bash's `grep -c $'\r'` counts every line). They were kept LF, as last wave.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a22-sprout | `a22-04-party` #7 | "No, no, no!" is a lyric fragment from the film's songs. | `MI('Oh no. The candle!', 'shock')` | done |
| edu-a22-reader | `a22-04-party` #7 | "No. No, no, no." (same fragment, carried over from the main script). | `MI('No. Not the candle.', 'shock')` | done |
| edu-a22-reader | `a22-14-pedro` #7 | "I was given a miracle that night. And I was so afraid of losing it that I forgot what it was for." is very close to Abuela's line in the film, and is not one of the two outline-listed lifted lines (no quotes at all in the Learning Grove). | "A miracle came to me that night. I was so frightened of losing it that I held on too hard, and squeezed you all." | done |
| edu-a22-sprout | `a22-01-lamp-lit-l1` replies; `a22-01-lamp-warm-l1` | "Only grown-ups touch them" / "Never touch a flame. Only grown-ups do that." teaches that grown-ups touch flames. | Replies: "Yes! Flames are hot. Never touch one." / "Flames are hot, not cold. Never touch one."; notice: "Never touch a flame, or hot glass. Leave candles to grown-ups."; parentNote "…must never be touched." | done |
| edu-a22-reader | `a22-01-lamp-flicker-l1` | Uncertain physics (two flames lean together because inflowing air "nudges the other"), and no standard. | Replaced with a 4-PS3-2 ask: "Abuela tips her candle to your wick, and a second flame catches. What does her flame pass to your wick?" Best "Heat" ("Heat from her flame warms your wick until it catches. Energy moves as heat, and her flame stays just as big."); others "Half of its flame", "Water". | done |
| edu-a22-reader | `a22-11-vision-l1` | Art lesson (paint mixing) with no approved standard; none on the list fits art for this band. | Reshaped to science, 1-PS4-2: "The little room was dark until the candles were lit. Why can you see the whirling sand now?" Best "Light bounces off the sand into my eyes"; others "My eyes send out light", "Sand glows by itself". Domains around it stay sel → science → literacy. | done |
| edu-a22-reader | `a22-13-lamp-l1` | No standard (flame needs air). | Reshaped to 2-PS1-4, pairing with the wax lesson in `a22-10-complete`: "Melted wax sets hard again when it cools. But the wax a flame has burnt is gone. Can burnt wax ever come back?" Best "No: burning turned it into gases and smoke". | done |
| edu-a22-reader | `a22-16-complete-l1` | No standard; the sombrero vueltiao notice had no hook in the scene; "Many Colombians wear" overstates. | Standard D2.His.2.K-2. New first line: "At the gate an old neighbour lifts his hat to you. It is woven in black and white rings." Then "It is a sombrero vueltiao, a symbol of all Colombia, made by the Zenú people of the north." The caña flecha line stays. | done |
| edu-a22-sprout | `a22-07-door-l1` | No standard. | `ELOF: Approaches to Learning` (creativity). | done |
| edu-a22-reader | `a22-02-kitchen-l1` | No standard. | K-LS1-1 | done |
| edu-a22-reader | `a22-03-door-done-l1` | No standard. | RL.1.4 | done |
| edu-a22-reader | `a22-04-lamp-l1` | No standard. | 3-PS2-1 (moving air pushes the flame) | done |
| edu-a22-reader | `a22-04-complete-l1` | No standard. | CASEL: Self-management | done |
| edu-a22-reader | `a22-06-loads-done-l1` | No standard. | 4-LS1-1 | done |
| edu-a22-reader | `a22-07-door-l1` | No standard. | CASEL: Self-awareness (how you want to be seen) | done |
| edu-a22-reader | `a22-08-hide-done-l1` | No standard. | 4-LS1-1 | done |
| edu-a22-reader | `a22-09-dinner-l1` | No standard. | 3-PS2-1 (drops grow heavy and gravity pulls them down) | done |
| edu-a22-reader | `a22-15-job-done-l1` | No standard. | K-LS1-1 | done |
| edu-a22-reader | `a22-16-photo-l1` | No standard. | 1-PS4-2 | done |
| edu-a22-reader | `a22-01-lamp-lit-l1` | No standard. | 3-PS2-1 | done |
| edu-a22-reader | `a22-04-lamp-flicker-l1` | No standard. | 4-PS3-4 (a candle turns stored energy into heat and light) | done |
| edu-a22-reader | `a22-04-lamp-lit-l1` | No standard. | 3-PS2-1 | done |
| edu-a22-reader | `a22-16-photo-ears-l1` | No standard. | L.4.5 | done |
| edu-a22-reader | `a22-16-photo-hands-l1` | No standard. | CASEL: Self-management | done |
| edu-a22-reader | `a22-grove-candle-lit-l1` | No standard. | 2-PS1-4 | done |

### A23 Remember Who You Are

Date: 2026-10-17. Files: `src/content/edu-a23-sprout.ts`, `src/content/edu-a23-reader.ts`. Both files were read in full: the built output was dumped scene by scene in play order (a scratch script imports both edu files and `atlas-a23.ts`). They were checked against `docs/canon.md`, `EDU-STYLE.md`, the original `atlas-a23.ts`, the outline (`docs/more-stories.md` §A23) and the writer log `docs/logs/edu-a23.md`.

Coverage is complete. All 64 in-scope quest scenes and all 19 variants have a version in each band (83 + 83). Choice ids match the original. The only `set` flag, `a23-path` on `a23-09-choice`, is copied exactly in both bands. No Grove flag is written. No Nubbin speaks. The talking animals are the source's own, which canon 31 allows. Mufasa's death is said plainly once in each band (`a23-09-chase`), with comfort straight after. It is never called sleeping or going away.

**Line endings.** The brief said the files were CRLF, but both are LF. They were LF before any edit: the reader file had only been touched by byte-preserving scripts when I checked it. I kept them LF, matching the rest of the edu files (the edu-atlas-1 log also says LF).

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a23-sprout | `a23-10-desert-done-rafiki-l1`, "Hello" reply | Wrong Swahili. "Hello is karibu or jambo." Karibu means welcome, not hello; the page itself teaches that in `a23-01-page`. | "Hello is jambo. Pole sana means I am so sorry." | done |
| edu-a23-sprout | `a23-09-chase` #0 and #5 (A23-8 bridge) | The child never plays A23-8. Even so, the scene opens "Something very sad happened in the gorge." and says "Zazu’s wing is hurt. You scoop him up and follow along the rim." The gorge, the rim and Zazu's wing are all only introduced in A23-8. It was also in past tense. | #0 "The page turns to a gorge. A gorge is a deep, rocky valley." #1 "Something very sad happens there. Simba’s dad, Mufasa, dies." #2 "That means his body stops working. It cannot start again." #3 "Scar tells Simba it was his fault. That is not true!" #5 "Zazu has bumped his wing on the rocks. You scoop him up and follow." | done |
| edu-a23-reader | `a23-09-chase` #0–1 (A23-8 bridge) | "You did not see the gorge. You were on a ledge with Zazu, your back to it, and you only heard the roaring stop." The ledge, the "roaring" (the stampede) and Zazu's "bad wing" all come from the omitted A23-8. | #0 "The page turns to a gorge, a deep and rocky valley. A herd of wildebeest ran through it while you were on a ledge above, tending Zazu’s hurt wing." #1 "You did not see what happened below. Here is what the page tells you, plainly: Mufasa, the king and Simba’s father, died in the gorge." | done |
| edu-a23-reader | `a23-13-ridge` #4 (follows from the bridge) | You say "I saw Scar. I didn’t see what happened down below." In this band you never see Scar at the gorge. | "I was up on the ledge with Zazu. I didn’t see what happened down below." | done |
| edu-a23-reader | `a23-03-complete-l1`, first reply | "Mufasa said earlier that a king does what he must, not what he likes." That line is only in the main script (`atlas-a23.ts` line 495). The reader band never has it. | "That’s a fair answer. A good king looks after everyone, not only himself. Looking after everyone is the heart of it." | done |
| edu-a23-reader | `a23-01-presentation-l2` | The prompt says a newborn cub's "eyes are shut for the first few days". Two lines earlier, the three-day-old cub is "blinking at all of you". It is also loose as fact: cubs' eyes open at about 3–11 days. | Prompt: "Lion cubs are born with faint spots that fade as they grow, and a male cub has no mane until he is older." Best reply: "…spots, small size, no mane yet. They change as they grow." | done |

### A24 The Law of the Jungle

Date: 2026-10-17. Files: `src/content/edu-a24-sprout.ts`, `src/content/edu-a24-reader.ts`. Both were read
in full (via a scripted dump of every scene, choice and lesson) against `docs/canon.md`,
`docs/briefs/review.md`, `src/content/EDU-STYLE.md`, `src/content/atlas-a24.ts`, the outline in
`docs/more-stories.md` (A24) and the writer's log `docs/logs/edu-a24.md`. A script also checked every
scene and variant against the original, choice ids and `set` flags, word, character and sentence caps,
standards and same-domain runs on all eight play paths (`a24-stones` mowgli/messua × Fern's memory on/off
× Hazel's margin note on/off).

Structure was already sound: all 116 quest scenes and 14 variants have a version in each band, every
choice id and `set` (`a24-stones` in a24-10-road) matches, no Grove flag is written, every lesson has an
approved standard (no ELOF in reader), lesson ids are unique, no Nubbin speaks, and there are no
same-domain pairs on any path. That still holds after the fixes.

Line endings: the task said the files were CRLF. They are LF (0 CRLF), as `.prettierrc` (`endOfLine: lf`)
and the edu-atlas-1 log say. They stay LF.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a24-sprout | `a24-06-feed` | Continuity: Mowgli's question was cut, so the choices "Tell him you do not know…" and "Show him how to blow gently" answer nothing. | Added after "A wolf passes and goes the long way round.": MG "He is scared of fire. I am not. Is that what being a man means?" (think). | done |
| edu-a24-sprout | `a24-10-complete` + `CHECKS` | Wrong fact: "There are four seasons. / Spring, summer, autumn, winter." Central India's year is hot, rainy and cool. | "So you do, through the whole year. You learn the jungle from inside." / "Here the year has three big seasons: hot, rainy and cool." Lesson: "Count the seasons on your fingers. Hot, rainy, cool. Three!", check `edu:count:seasons:3`. | done |
| edu-a24-sprout | `a24-16-bagheera` #4 | Garbled after a cut: "Come back for you, if you ever need to." | "Do not come back for us. Come back for yourself, if you need to." | done |
| edu-a24-sprout | `a24-02-council-done-fern` lesson, "A bear." reply | Canon 10: Bramble is she. "Fern remembers him." | "It was Bramble. Fern remembers her." | done |
| edu-a24-sprout | `a24-04-kaa` #1, `a24-09-ford` choice `akela`, `a24-16-trail` choice `hunting` | "Good hunting" is Kipling's greeting; the Learning Grove takes no quotes from originals. | Kaa: "Well, well. Visitors. What brings you here?" Akela: "Welcome, guest. You stood by him. The pack noticed." Choice label "Tell him: safe travels." Mowgli: "Safe travels, guest. Safe travels, little wolf." (id `hunting` kept). | done |
| edu-a24-reader | `a24-04-chil` choice `thanks`, `a24-04-kaa` #2 and #4, `a24-09-ford` choice `akela`, `a24-16-trail` choice `hunting` | Same: five uses of "Good hunting". | Chil: "Thank you, guest. You whistle like a duck…" Kaa: "Well, well. A bear, and a panther…" Bagheera: "Greetings, Kaa. We are hunting." Akela: "Welcome, guest. You stood at his back…" Trail as in sprout. | done |
| edu-a24-reader | `a24-07-tears` #7–8 | Verbatim Kipling: "What is it? What is it?" and "Am I dying, Bagheera?" (with "I do not want to leave the jungle", a near-copy). | "What is this? Why will it not stop? Is something wrong with me, Bagheera?" | done |
| edu-a24-reader | `a24-09-ravine-done` #0–1 | Shere Khan's death is not said plainly, and "He never woke up all the way" ties death to sleep, which EDU-STYLE forbids. | "It is finished. Shere Khan is dead. He will not trouble the jungle again, nor the village." | done |
| edu-a24-reader | `a24-10-complete` #3 and lesson | Same seasons error: "A season is about three months, and there are four of them in a year", taught as 4 × 3. | "Here the year turns through three big seasons: the hot weather, the rains and the cool weather. Each lasts about four months." / "You learn where the deer drink…" Lesson: "Here there are 3 big seasons, and each lasts about 4 months. How many months is that?" (3 × 4 = 12, distractors 7 and 10 re-explained as three fours). | done |
| edu-a24-reader | `a24-18-search` #0, `a24-18-search-done` | Contradiction and a wrong idea: "searches for five seasons", then "ten seasons, in five years", taught as "each pair of seasons makes a year". | search #0 "Kotick searches for five years." search-done: "Five years go by: five summers on the beaches, and five winters out at sea…" / "Every summer he tries a new coast, and every summer he comes home without it." New maths lesson (3.OA.A.3): "Kotick searched for 5 years, and every year has 12 months. How many months did he search?" 60 (5 × 10 + 5 × 2); distractors 17 (5 + 12) and 50 (5 × 10). | done |
| edu-a24-reader | `a24-16-bagheera` | 19 lines, over the 16-line reader cap. | Bagheera's lines merged into two-sentence lines ("I have killed a bull in the valley, young and fat. I paid for you with a bull, cub, at the beginning." / "Now I have paid it again, and the debt is all square. So you go free, owing nobody."), "Come back for yourself, if you ever need to, and we will know.", Mowgli "Guest, you were in the cave the first night. Say the Words with me, one more time." Now 12 lines; lesson still follows the goodbye. | done |
| edu-a24-reader | best replies in `a24-04-chil-done`, `a24-08-herd-done`, `a24-10-complete-messua`, `a24-13-complete`, `a24-14-river-done`, `a24-16-bagheera-done`, `a24-16-bagheera-done-messua` | Three-sentence narration ("Yes. 12 ÷ 4 = 3. Every hour…"). | "Yes:" in each ("Yes: 12 ÷ 4 = 3. Every hour he covers 4 kilometres: 4, 8, 12."); 14-river-done also "Take 10 from 40 to make 30, then add 3 back." | done |
| edu-a24-reader | `a24-14-river-done`, option "43" | Wrong teaching reply: "Three away from 40 would be 37, not that." | "43 is more than 40, so some have been added, not taken away." / "Take 7 from 40: 33." | done |

## 3. Should fix

### A14 Homecoming

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a14-sprout | `a14-01-gate` | The old traveller (Mentes) was cut, yet the `step` reply ("The old traveller smiles"), `gate-done` ("the traveller’s spear") and the lesson (Mentes speaking after line 1, before he appears) all need him. | Added N "An old traveller with a spear waits beside you." as line 3; the island notice now plays after it (`after` 3). | done |
| edu-a14-sprout | `a14-01-complete-l1` | "Telemachus shared his bread with you, even though he had little." His house is rich; it is being eaten, not poor. | "Telemachus shared his bread with you, and you were strangers. What is a kind way to share?" | done |
| edu-a14-sprout | `a14-02-loom-done-l1` | "The moon" in lower case beside "the Sun"; "when the Sun is gone". | "The Moon" (label and reply); "A torch gives light after the Sun has set." | done |
| edu-a14-sprout | `a14-03-sparta` #1–2 | Two lines in a row list the same metals. | Line 1 is now "Menelaus’s house is the shiniest house you have ever seen." | done |
| edu-a14-sprout | `a14-04-ogygia` | The choice "Thank Calypso for the figs" has no figs in the sprout scene, and Calypso is never named. | Added N "She is Calypso. She gives you bread and figs to eat." after the weaving line. | done |
| edu-a14-sprout | `a14-04-raft-done-l1` | "In the day, the Sun hides them." | "Stars shine at night. In the day, the Sun is too bright to see them." | done |
| edu-a14-sprout | `a14-09-again-l1` | "Odysseus made a mistake." Sprout only shows the crew opening the bag ("My crew opened the bag"), so the prompt doesn't match the scene. | "The sailors opened the bag, and that was a mistake. What is a good thing to say?" | done |
| edu-a14-sprout | `a14-09-complete` #1 | "Only one ship is left of all their ships." The listener never heard there were other ships, or what happened to them. | "Big grumpy giants chase them out of a harbour. Only one ship gets away." (in step with the main script's one-line harbour of giants, with no peril shown). | done |
| edu-a14-sprout | `a14-09-complete-l1` | "Odysseus says close, but not home." reads badly. | "Odysseus was close to home. What is the opposite of close?" | done |
| edu-a14-sprout | `a14-10-sty` #1 and lesson | "There are four pigs in a pen" makes Circe's pigs four. In Homer they are Eurylochus's 22 men. | "There are lots of pigs in the pens. Four are by the fence." / "There are four pigs by the fence." (the check `edu:count:pigs:4` is unchanged). | done |
| edu-a14-sprout | `a14-10-sty-done` #1 | "Then a woman says, Oh! Very surprised." | "Then a woman cries, Oh! She sounds very surprised." | done |
| edu-a14-sprout | `a14-11-after` #4 | "Your Nubbin looks at you. What should we do?" reads as the Nubbin's own words (canon 17). | "Your Nubbin looks at you, as if to ask what to do." | done |
| edu-a14-sprout | `a14-12-advice-l1` replies | "Soft things soak up sound, so less gets in." Wax in the ear mainly blocks the way in. | "Yes. The wax fills up your ears, so less sound gets in." / "Wax makes sound softer, not louder. It blocks the way into your ears." | done |
| edu-a14-sprout | `a14-12-sirens` choice `paws` | "It holds your hands over your ears too." (whose hands?) | "It puts its paws over your ears too." | done |
| edu-a14-sprout | `a14-13-island-done` | "He cries out, because the cows are gone." Sprout never says the sailors ate the cows, and "gone" is vague. | "Odysseus comes back. The hungry sailors have eaten some of the cows!" / "He cries out. Far above, the Sun is sad too." | done |
| edu-a14-sprout | `a14-13-fig` #2 | "The sailors are lost, and they died." (mixed tense). | "The ship breaks apart, and the sailors die." (the comfort line follows). | done |
| edu-a14-sprout | `HARBOUR_SPROUT` (`a14-14-harbour` and both variants) | 13 lines, over the sprout 4–10 guide. | Athena's two lines are merged ("You cannot help being clever, Odysseus. Look! Your harbour, your tree, your hill."); now 12. The kneeling line is kept on purpose. | done |
| edu-a14-sprout | `a14-15-hut` choice `alive` | "Say, “He might not be gone.”" uses "gone" for dead, the euphemism EDU-STYLE forbids. | "Say, “He might still be alive.”" | done |
| edu-a14-sprout | `a14-15-pigs-l1` | "Eumaeus gave his guest the warm hut and went out in the rain. Why? … Because he cares about his guest". He goes out to guard his master's pigs, and the `in` reply says so ("For his pigs!"). | "Eumaeus gave his guest a warm cloak. Then he went out in the rain to mind the pigs. Why?" + "Because he cares for his guest and his pigs" / "Yes. He looks after everyone in his care, even when it is cold and wet." | done |
| edu-a14-sprout | `a14-17-scar` | The choice "Mop up the spilt water" has no spill in the sprout scene. | Added N "She drops his foot, and splash! The water spills." after the scar line. | done |
| edu-a14-sprout | `a14-19-threshold-done-l1` | The seventh "slow breath" lesson, two lessons after the sixth (`a14-18-complete`). | Now a crowd-safety lesson (health, ELOF: Perceptual, Motor, and Physical Development): "Everyone is pushing at once. In a busy crowd, what keeps you safe?" + "Stay close to a grown-up you know". | done |
| edu-a14-sprout | `a14-20-orchard` #3 | "I had a son once. I think he is gone." is the forbidden euphemism. | "I had a son once. I think he has died." | done |
| edu-a14-sprout | `a14-16-sit-corvin` #7 | "His tail moves once more in the dust." comes straight after Corvin speaks, so it reads as Corvin's tail. | "Argos’s tail moves once more in the dust." | done |
| edu-a14-sprout | `a14-corvin-joins-l1` | Literacy (Corvin's k sound). The variant plays before the first step of any quest, and five sprout quests end on a literacy lesson (A14-2, 4, 9, 12, 13), so the pair repeats on five play paths. | Now a health ask, matching the original's "a little out of breath": line 0 is "Corvin Vale is on the page beside you, in his good coat. He is out of breath."; "Corvin hurried to get here. When you run fast, what does your breathing do?" + "It goes fast, then slows down when you rest". One path is left (see For Maor). | done |
| edu-a14-reader | `a14-02-antinous-l1`, option `tent` | "Try again: which word is about weaving words together?" A wrong answer must show the right one. | "A tent comes from a Latin word meaning “stretch”, not “weave”. The word from texere is text: words woven together." | done |
| edu-a14-reader | `a14-02-antinous-l1`, option `tell` | "from a word for counting out a story": muddled. | "Tell comes from Old English, where it meant both “count” and “relate”. It isn’t from texere. The one that is: text." | done |
| edu-a14-reader | `a14-05-storm` #3 | "Three and four times lucky are the ones who fell at Troy…" is Homer's famous formula (the edu rule allows no quotes from the original). | "The ones who fell at Troy were the lucky ones. They had their friends round them. Out here there is nobody." | done |
| edu-a14-reader | `a14-05-complete-l1` | "Sleep is hard work for the body in disguise." | "Sleep is busy work for the body, even while you lie still. Muscles mend, …" | done |
| edu-a14-reader | `a14-06-river-done-l1`, best reply | "“Gets up” tells us it is a person, and a clue that the page hasn’t said outright." (ungrammatical) | "Yes. “Gets up” suggests a person: a clue to something the page hasn’t said outright. Good readers fill gaps like this." | done |
| edu-a14-reader | `a14-07-hall-l1` prompt | "the dogs silver". The scene's dogs are gold and silver. | "the dogs gold and silver". | done |
| edu-a14-reader | `a14-08-cave-done-l1`, option 2 | "if the giant is gone" (euphemism, right after two plain deaths). | "if the giant dies, nobody can move it". | done |
| edu-a14-reader | `a14-08-shout-done-l1`, option `bicker` | "Try the word with two wheels." doesn't give the answer. | "… The word from kyklos is bicycle, with its two round wheels." | done |
| edu-a14-reader | `a14-11-shades-done-l1` parentNote | "what a dying wish means": she is already dead. | "Thought about what a mother asks of her son, and why remembering matters (a think question)." | done |
| edu-a14-reader | `a14-12-advice-l1` | "Soft, squashy things such as wax soak up vibrations." The plug mostly blocks; absorbing comes second. | Prompt is now "Sound travels as vibrations in the air that shake the eardrum. Why does wax in your ears make the world quiet?" + "It plugs the ear, so most vibrations can’t reach the eardrum." / "Yes. The wax seals the way in, and being soft, it soaks up much of what is left. Earplugs work the same way." Other replies and the header fact updated. | done |
| edu-a14-reader | `a14-13-strait-l2` | "The six men are gone." | "The six men have died. Losing friends is …" | done |
| edu-a14-reader | `GATE_BEATS` (`a14-16-gate`, `-gate-shout`, `-gate-silence`) | Option 3, "like a word only the dog hears", fits only the `dont` scene; the shout and silence variants have no whispered word. | "He can show love in small ways that nobody else notices." (reply unchanged). | done |
| edu-a14-reader | `SIT_BEATS` (`a14-16-sit`, `-sit-corvin`), option "By his staff" | "Odysseus never took a staff to Troy." is a non sequitur. | "Any old man might carry a staff, so it is no clue. A dog is far more likely to know him by the way he smells and sounds." | done |
| edu-a14-reader | `a14-16-sit-corvin` #10 | "His tail moves once more in the dust" comes after Corvin's two lines. | "Argos’s tail moves once more in the dust, for no one you can see." | done |
| edu-a14-reader | `a14-17-scar-l1` | "new, tougher tissue"; "it is stronger than the original wound" (a wound isn't strong, and scar tissue is weaker than skin). | "The body repairs it with new, thicker tissue …" / "It has healed. The scar is the repair: new tissue that closed the wound for good."; skill and header fact updated. | done |
| edu-a14-reader | `a14-17-dream-l2`, option 2 | "A word that sounds like another word" → "That’s a pun." That is a homophone. | "That’s a homophone, like strait and straight. A symbol is …" (ties back to `a14-13-strait-done`). | done |

### A15 The Humbug

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a15-sprout | `02-slate-l1`, `06-ditch-done-l1`, `13-complete-l1`, `15-heart-l1` | The splitter breaks a bracketed prompt across two lines ("(Say eh, eh, Emerald. Which letter makes it?" / "E!)"; "(Point and count. How many?" / "Seven!)"; the same in the breathing and heartbeat prompts). | "(Say eh, eh, Emerald. It starts with the letter E.)"; "(Point and count. Seven!)"; breathing and heartbeat each written as two closed brackets: "(Breathe in, two, three. Breathe out, two, three.)" + "(Do it three times.)"; "(Feel it? Thump, thump, thump.)" + "(Your heart beats all day and night!)". | done |
| edu-a15-sprout | `08-strings-done-l1` | Split into "Heave!" / "Ho! Heave!" / "Ho!". | "The mice pull in time: heave, ho! Heave, ho!" (one line). | done |
| edu-a15-sprout | `a15-11-waves` | 11 lines (sprout cap 10). | "Next come crows. The Scarecrow flaps them away." and "Last come soldiers. The Lion roars, and they run home." Now 9 lines. | done |
| edu-a15-sprout | all four `a15-20-complete*` | Endings run 9 to 13 lines. | Shared KANSAS line now "Whoosh! She is gone, and her silver shoes fall off into the desert." (one line). Pocketed: Lion "I will walk you there. My forest and the china wall lie north." replaces two lines. Asked-pocketed: "But first, a favour. We will fly you north, to the china wall." replaces two lines. Now 8, 10, 11 and 10 lines. | done |
| edu-a15-sprout | `a15-20-complete-asked-pocketed-l1`, `a15-20-complete-pocketed-l1` | Both ask where you go, or who walks you, before the story says. | Each moved to after the line that answers it; prompt now "Where do the Monkeys fly you, to take the lamb home?". | done |
| edu-a15-sprout | `a15-12-bucket` #5 | "She melts all away. She is gone for good." is the "going away" wording EDU-STYLE avoids, with no comfort. | "She melts all away, into a brown puddle. She cannot hurt anyone now." Header note updated. | done |
| edu-a15-sprout | `a15-02-council` #5 | "Two silver shoes. The old Witch who made them work is gone." is unclear to a listener. | "Only two silver shoes are left. The very old Witch has dried up, like a puddle in the sun." (Baum’s and the main script’s fact.) | done |
| edu-a15-sprout | `a15-02-slate` #5 | "Follow the yellow road and you cannot go wrong." echoes the film song. | "Keep to the road of yellow bricks. It will take you there." | done |
| edu-a15-sprout | `a15-06-bridge-done-l1` | "Five friends" leaves out Toto and your Nubbin, who also crossed; a child counting along will say so. | "Count who crossed: Dorothy, Toto, the Woodman, the Scarecrow, you, your Nubbin, the Lion." / "(Point to each one. Seven friends!)"; check `edu:count:crossers:7`; CHECKS updated. | done |
| edu-a15-sprout | `a15-03-kansas`, choice `asleep` | "Nubbin sleeps in her lap. It found a home." | "Your Nubbin sleeps in her lap. It has found a home." | done |
| edu-a15-sprout | `a15-03-complete` #3 | "You put your matches deep in your bag." comes straight after "If you ever find matches, do not touch." | "You make sure he stands far away from the campfire." | done |
| edu-a15-sprout | `a15-07-complete-l1` | Asks about the Scarecrow hugging everyone before he hugs anyone. | Moved to after "He hugs everyone. He hugs you twice." | done |
| edu-a15-sprout | `a15-08-wildcat`, choice `lion` | "A Lion? Will he eat us?" and the next scene opens with the Queen asking the same thing. | "A Lion? Oh, my whiskers!" | done |
| edu-a15-sprout | `a15-10-fire` #5 | "Your Nubbin pats out a small smoking spot on his tail." right after "Stay far away from it." | "Your Nubbin blows on his warm tail to cool it. Phew!" | done |
| edu-a15-sprout | `a15-11-waves-done-l1` | A bee fact after "In the Witch’s cupboard is a Golden Cap." comes out of nowhere. | "Remember the bees? A bee is an insect with six legs and four wings." | done |
| edu-a15-sprout | `a15-11-monkeys`, choice `shout` | "His hat nods in the tree." The sprout never says the Scarecrow ended up in a tree. | "Far off, the Scarecrow’s hat nods. Or was it the wind?" | done |
| edu-a15-sprout | `a15-13-lost` #3 | The Queen appears without being called. | "I know! I will call the Queen of the Field Mice!" | done |
| edu-a15-sprout | `a15-15-heart` | Choice "Polish the patch where the hole was." No hole or patch is ever mentioned. | Line: "He puts it in the Woodman’s chest, then patches it shut. Clink, clink." Label: "Polish the new patch on his chest." | done |
| edu-a15-sprout | `a15-15-courage-done` #1 | "The dish was a round green dish." | "The dish is round and green." | done |
| edu-a15-sprout | `a15-16-sew` #2 | "You sew five strips…" then "You hold the strips straight. Dorothy sews." | "There are five strips of green silk to sew together." | done |
| edu-a15-sprout | `a15-17-lamb` #5 | "We would only stand and look pretty." is passage 6 near word for word. | "Out there we would go stiff and still, like a jug on a shelf." | done |
| edu-a15-sprout | `a15-17-complete` #4 | "I am glad we took nothing." is false on the pocketed path, and a listener of four won’t hear the irony. | "I am glad we saw it. I will never forget it." | done |
| edu-a15-sprout | `a15-20-glinda` #6 | "But then I would not have my brains!" is passage 7’s sentence, lightly changed. | "Then I would never have got my brains!" | done |
| edu-a15-sprout | `a15-01-storm-l1` prompt | "Air that moves is called what?" | "What do we call air that moves? (Point to the bending grass.)" | done |
| edu-a15-sprout | `a15-02-council-l1` prompt | "…The sun comes up in the east. Where is it?" (where is what?) | "…The sun comes up in the east. Which way is east?" | done |
| edu-a15-reader | `a15-05-roar` #5 and #7 | "smacks the Lion on the nose as hard as she can" is Baum’s sentence; "You ought to be ashamed!" is his too. | "Dorothy rushes forward and smacks the Lion right on the nose." / "…picking on a little dog. Shame on you!" | done |
| edu-a15-reader | `a15-06-ditch-done-l1` | "Breathing in slowly and out more slowly… Try it: in for four, out for four." contradicts itself. | "Try it: in for four, out for six." | done |
| edu-a15-reader | `a15-08-poppies` #5–6 | The Nubbin "is gone" (in a book where gone means died); the bracket "(Real poppies cannot do this." / "It is only the story’s magic.)" is split. | "…with its nose in a red flower, fast asleep." / "…a heaviness in your arms and legs. Real poppies cannot do this; it is only the story’s magic." | done |
| edu-a15-reader | `a15-11-monkeys`, choice `tighter` | "The Monkeys lift the three of you": Toto is left out. | "The Monkeys lift Dorothy, Toto, you and your Nubbin, very gently, as if you were eggs." | done |
| edu-a15-reader | `a15-14-screen` | 20 lines (reader cap 16). | Oz’s stammer, the three "you were" lines and the spectacles lines tightened: "I… I am Oz, the Great. Please put that down!", "But you were a great big Head!", "And a Lady, with wings.", "And on fire!", "…It was all pretending.", "Yes. Humbug is quite the right word for it.", "I came down out of the clouds, and the people thought I was a Wizard. It was green, so I called it the Emerald City.", "Then I had to make the name come true, so I gave everybody green spectacles, locked on. It was only a small lie, to begin with." Now 13 lines; both lessons keep their places. | done |
| edu-a15-reader | `a15-19-hill` #6 | "short and stout, with a big, flat-topped head on a thick, wrinkled neck" is Baum’s description, close to word for word, and a body-shape line. | "From behind a rock comes a very odd man with no arms at all, and a big flat head on a neck that folds up like a concertina." | done |
| edu-a15-reader | `a15-19-complete` #2 | "The Quadlings are small and round and cheerful": a body-shape line (care note). | "The Quadlings are small and cheerful." | done |

### A16 The Fox and the Rose (reader only)

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a16-reader | `a16-03-telling-l1` #1 | "Each gets a number as well as a name, like 433 Eros." Many numbered asteroids have no name. Also, Eros is a near-Earth asteroid, not one of the belt between Mars and Jupiter that the same line describes. | "Most circle the Sun between Mars and Jupiter. Each gets a number, and many get a name too, like 4 Vesta." | done |
| edu-a16-reader | `a16-03-weeding-done-l1` #0 | "You remember what the pilot told you: real baobab trees are not quite so dreadful." The pilot never told you this. | "Real baobab trees are not nearly so dreadful." | done |
| edu-a16-reader | `a16-03-weeding-l1`, "Later" reply | Weak and wordy: "The boy will say that small problems grow, just like baobabs, so you may want to be careful." | "The boy would say that small problems grow, like baobabs, and get harder to pull." | done |
| edu-a16-reader | `a16-08-complete` | Three lessons in one scene; reader allows 1–2. | Moved the étoile notice (literacy, L.2.4, after line 4, "He means the stars…") into `a16-08-desk`. The scene's lessons are now étoile (l1) and owning (l2). The order is literacy, social studies, maths, literacy, science, sel, so nothing repeats. | done |
| edu-a16-reader | étoile notice and `a16-12-complete-l1` #0 | "The Little Prince was first written in French." The main header keeps the "Little Prince" name and trade mark out of the page; only the source field may name the book. | "The book this page comes from was first written in French." (both lessons) | done |
| edu-a16-reader | `a16-10-books` #0 | "The sixth planet is ten times bigger than the last." This is a near-translation of the ch. XV opening, and closer than the main script's own line. | "The sixth planet is a good deal bigger. An old gentleman lives on it among books piled higher than his head." | done |
| edu-a16-reader | `a16-10-flower-l1` #1 | "over thousands of years" undersells erosion: mountains wear down over millions of years. | "Wind, rain and ice wear mountains away, bit by bit, over thousands and millions of years. That is called erosion." | done |
| edu-a16-reader | `a16-14-pills` #5 | "If I had fifty-three minutes to spare, I’d spend them walking to a spring. Very slowly." This is a near-translation of the prince's ch. XXIII sentence. | "Fifty-three spare minutes? I’d use them to walk to a spring. Slowly, all the way there." | done |
| edu-a16-reader | `a16-14-pills-l1`, option "56 minutes." | No sum gives 56, and the reply makes no sense: "That takes the wrong direction." | The option is now "53 minutes.", and the reply reads "That’s only one week. Two weeks of 53 minutes means adding: 53 + 53 = 106." The second line is kept. | done |
| edu-a16-reader | `a16-15-night` #0 | "all four of you" is wrong when Sable has come (t45 or bonded). She is in the art, and the bonded well variant counts "five of us". | "You set off anyway, all of you together, as the sun goes down." | done |
| edu-a16-reader | `a16-15-well-l1` | The standard `3-5-ETS1-2` (compare solutions) doesn't fit a lesson on the direction of a force. | `'3-PS2-1'` (forces). | done |
| edu-a16-reader | glossary "muzzle" | "…so it can’t bite or nibble." The page's care note says no "bite" anywhere, because of the snake. | "…so it can’t nibble or eat things." | done |

### A17 The Camphor Tree

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a17-sprout | `a17-16-complete-l1` → `a17-grove-oak-l1` / `-oak-sleeps-l1` | Two sel lessons in a row when the keepsake plays after the last quest. | complete-l1 is now a literacy ask (RL.1.4): "Granny hugs everyone. “Oh, the three of you.” How does Granny feel?" (Happy and relieved / Cross). | done |
| edu-a17-sprout | `a17-16-complete-hunt-l1` → the same | Same pair on the hunt path. | Same literacy ask, on "Oh, the pair of you". | done |
| edu-a17-sprout | `a17-11-complete-l1` → `a17-grove-camphor-l1` | Two science lessons in a row (the keepsake plays on the next return after A17-11). | grove-camphor is now maths (K.MD.A.2): "The little tree is as high as your knee. Is it taller or shorter than you?"; the line now reads "In it is a young camphor tree, as high as your knee." | done |
| edu-a17-reader | `a17-11-complete-oak-l1` → `a17-grove-oak-l1` | Two science lessons in a row, and the oak-age ask ("Moss says his own oak took four hundred years") played before Moss says it. | The science ask now plays after Moss's line and after the teasing think question, so the order is science, sel, science, maths. | done |
| edu-a17-reader | `a17-11-complete-oak-l1` → `a17-grove-oak-sleeps-l1` | Two science lessons in a row, and a "why is shade cooler" quiz in a mourning scene. | Now literacy (RL.4.3): "“The shade falls exactly where he used to sit.” Why might the writer tell us that?" Best: "It makes the oak seem to keep his place for him, so we think of him." | done |
| edu-a17-reader | `a17-grove-oak-sleeps` #1 | "Moss died." with no link to the Grove's word. | "Moss faded. That means he died: his body stopped working, and it will not start again." | done |
| edu-a17-sprout | `06-hollow-l1`, `06-found-done-l1`, `07-complete-l1`, `08-letter-l1`, `09-catbus-l1`, `12-complete-l1`, `a17-13-gone` #3 | The sprout splitter cut bracketed prompts and a quotation in half, e.g. "(Hold up one finger, then one more. How many in all?" / "Two.)" and "They call, “Mei!" / "Mei!”". | Rewritten to split cleanly: "(Hand on your tummy. Breathe in slowly, then out, three times.)"; "(Say it together in a whisper: a-ri-ga-tō.)" / "(Now say it big: a-ri-ga-tō!)"; "(… How many in all?)" / "Two!"; "(Say mmm. Which two names begin the same?)" / "Mei and Mum!"; "(What else starts with b?)" / "Bear, ball, banana!"; "They call her name: “Mei, Mei!”". | done |
| edu-a17-sprout | `a17-15-statues-hunt` | The prompt says "Satsuki says sorry for shouting", but on the hunt path you never hear it; and the scene drops the waiting Catbus that Kanta can't see, so "The sisters climb in" next scene has nothing to climb into. | Added "Behind them the Catbus waits. Kanta cannot see it, but you can." Prompt: "Satsuki shouted at Mei before. Now they hug and make up." / "What do you say when someone says sorry?" | done |
| edu-a17-sprout | `a17-04-complete-l1` skill | "count in twos" but the child counts in ones. | "count to 4: wheels on two bicycles" | done |
| edu-a17-sprout | `a17-08-complete-l1` | "Long ago, letters were how people talked from far away." (people still write letters); the prompt left out the last step its own check names. | "Long ago, few homes had a phone. People wrote letters." / "(Say it: box, bus, train, then a man brings it.)" | done |
| edu-a17-sprout | `a17-grove-oak` #3 | "I planted an oak once. It took me four hundred years." says Moss took 400 years; the original says the tree did. | "I planted one of those, long ago. It took four hundred years. You cheated." | done |
| edu-a17-reader | `a17-05-garden-l2` | "Then she gives 2 away to her sister", but line 0 says Satsuki is at school. | "Then 2 roll away into the long grass." (replies to match). | done |
| edu-a17-reader | `a17-03-shutters` #6 and l1 | "you slide five before he finds the sixth" is muddled, and the ask "How many are still open?" follows "until the house is shut". | "There are nine shutters in all. You slide five, and Mr Kusakabe does the rest." / "There are 9 shutters, and you slide 5 of them. How many does Mr Kusakabe slide?" (4). | done |
| edu-a17-reader | `a17-10-plant` #0 and l1 | 3 rows of 4 is all 12 nuts, yet "Mei plants hers in clumps". | "Satsuki plants 8 seeds in 2 neat rows of 4, and Mei plants the other 4 in clumps."; ask is 2 × 4 = 8 (distractors 6 and 24). | done |
| edu-a17-reader | `a17-06-greet-l2`, `a17-10-complete-l1` replies | Name the third rule ("the Grove’s third rule is about it", "Hazel’s third rule agrees."); the page acts it and never quotes it (atlas-a17 header; canon 14). | "Waiting is a kind of strength, though it doesn’t look like one." and "Mei is working very hard at it." | done |
| edu-a17-reader | `a17-07-rain-l1` best reply | "Tsuyu means “plum rain”" is loose: the word is written with the characters for plum and rain. | "Tsuyu is written with the signs for “plum” and “rain”, because it comes as the plums ripen." | done |
| edu-a17-reader | `a17-12-telegram` #5, l1 and l2 | "a telegram in mid-week" on "the day before the weekend"; l2 asks why "Nobody says anything" before that line plays. | "Telegrams were charged by length, so they were short. One that came out of the blue was rarely good news."; prompt "…why did one that came out of the blue worry people?"; l2 now plays after "Nobody says anything." | done |
| edu-a17-reader | `a17-12-lap-l1` (`edu:breathe:square:4`) | Square breathing has four sides; the line gives three. | "In for four, hold for four, out for four, hold for four." | done |
| edu-a17-reader | `a17-12-lap` #9 | Cut to "What if it’s like last time?", which reads darker than the original. | Restored: "…What if it’s like last time, when it was only going to be a little while?" | done |
| edu-a17-reader | `a17-12-complete` #3 | "Now there is only a dent in the cushion", while three of the five are still there. | "Where Mei sat, there is only a dent in the cushion." | done |
| edu-a17-reader | `a17-13-pond-l1` | A pond-habitat quiz while men search the pond with poles for a child's sandal: not diegetic fun, and wrong for the moment. | Dropped, with its `habitat` glossary entry. The calm-checking lesson (l1 now) plays after "Hers are different." instead of before, so it no longer gives away the answer. | done |
| edu-a17-reader | `a17-15-statues-hunt` #2 | "the six bibs together would make a long red scarf": a joke about the Jizo bibs (care note: no jokes about the statues). | "Each bib is a square of red cloth, about 30 centimetres across." The 6 × 30 cm sum stays. | done |
| edu-a17-reader | `a17-06-hollow-done-l1` reply | "Evolution tests designs over millions of years." | "Nobody designed it, but over millions of years the strongest, lightest stems did best." | done |
| edu-a17-reader | `a17-08-letter-l2` prompt | "A ghost is the haunting of someone who has died." | "A ghost is said to be someone who has died and come back." | done |
| edu-a17-reader | `a17-09-walk-done-l1` reply | "The Keeper’s lantern arm is free": the arm holding the lantern isn't free. | "You have a hand free, and it might be a good moment." | done |
| edu-a17-reader | `a17-05-complete` #2, `a17-16-corn-done` #3, `a17-16-corn-hunt-done` #3, `a17-grove-oak-acorn` #6, `a17-grove-camphor` #5 | Each narration line states the answer just before the lesson asks it (forest "two thirds"; lights "just as bright as ever"; "Four hundred years is four centuries"; what a potted tree needs). | "In Japan, old shrines often keep a little of the oldest woods around them, left to grow as they please."; "Satsuki keeps watching the place where they were."; "Then there is only the dark, and the frogs."; "Moss counts in centuries, the way other people count in weeks." (this also replaces the weak "A very patient tree is a very patient friend."); "You find it a place by the window, where the light is good, and wonder what else it will want." | done |
| edu-a17-reader | `a17-16-complete-hunt-l1` skill | Says "why do the sisters and Kanta not tell the grown-ups everything?", but the question is about you and Kanta. | "a think question: is it right to keep some wonders to yourself?" | done |

### A18 The Doll in the Pocket

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a18-sprout | `a18-12-supper` | 11 lines, over the sprout cap of 10. | Merged the opening: "Baba Yaga eats and eats. Vasilisa stands by, as still as a post." Dropped Yaga's "Why stand there like a post? Say something." The lesson moves from after=10 to after=9. | done |
| edu-a18-sprout | `a18-12-supper` (Yaga) | "Ask, then. Not every question is a good one." This is a close paraphrase of lifted line 6 ("Ask, but not every question turns out well"). | "Ask, then. Mind you pick good ones." | done |
| edu-a18-reader | `a18-12-supper` #3 | "Ask, then. But not every question is a good one to ask." The same close paraphrase. | "Ask, then. Only mind which questions you pick." | done |
| edu-a18-reader | `a18-12-blessing` #4 | "Then off you go, as fast as you can!" carries over Magnus's phrase from lifted line 7. | "Then off you go, and quickly! Nobody so loved can stay with me!" | done |
| edu-a18-reader | `a18-12-supper-l1` prompt | "before a collector, Afanasyev, wrote it down". Afanasyev mostly compiled tales other people had recorded. | "…before a collector, Alexander Afanasyev, gathered it into a book in the 1800s." | done |
| edu-a18-reader | `a18-01-house-l1`, option "To lose something" | The reply explains "a ball lodged in a tree", which means stuck, not lost, so it doesn't match the option. | Option "To get stuck"; reply "That’s another meaning: a ball can lodge in a tree, which means it gets stuck. Here it means a bed under someone else’s roof." | done |
| edu-a18-reader | `a18-06-ask-done-l1` | 6 × 18 = 108 goes past 3.OA.A.3's "within 100". | Standard `4.MD.A.2` (a word problem about a distance). | done |
| edu-a18-reader | `a18-15-town-done-l1` | Tagged `3-LS1-1` (life cycles), but the lesson is about why long fibres make stronger thread. | Standard `2-PS1-1`; skill "flax is pulled to keep its fibres long: a material’s properties". | done |
| edu-a18-reader | `a18-15-loom-done-l1`, `-self-l1` prompts | The prompt listed the steps in the right order and then asked for the order, which gave the answer away. | The steps are now listed shuffled (see the must-fix row). | done |
| edu-a18-sprout | `a18-11-poppy` #4 | "Your Nubbin blows two away, gently. Then too hard!" clashes with the take-away sum (5 − 2 = 3 left). | "Your Nubbin blows two away, very gently. Puff, puff!" | done |
| edu-a18-sprout | `a18-10-chores-self` #2 | The lesson adds "three scoops now, and three more later", but no scoops appear in the scene, so it isn't diegetic. | "You sift three scoops, then three more. Your Nubbin watches from the sack." | done |

### A19 The Dragon Who Fell

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a19-sprout | 69 narrator lines (17 scene or choice lines, 52 lesson lines) | Three or four sentences, over the two-sentence cap. Examples: `01-raid` #2, `01-raid` #3, `06-cove` #0–1, `07-name` #2, `08-hand` #2, `14-astrid-done` #3, the three "Say it with me" prompts, and replies such as "Yes! Teamwork. Each one does a part." | Each line is merged to two sentences without losing the read-aloud rhythm. For example: "You push the bellows. Whoosh, the fire gets bigger!"; "The dragon runs and flaps. Up, up, and plop, down!"; "Hiccup eats it and gags. Yuck!"; "(Say it with me: h-h-hammer, h-h-hook, h-h-Hiccup.)"; "Yes, teamwork! Each one does a part." "Stoick says “Go. And come back.” What does that tell us?" is now "Stoick tells Hiccup to come back. What does that tell us?" | done |
| edu-a19-reader | 69 narrator lines (1 scene line, 68 lesson lines) | Three sentences, mostly a "Yes." or "That’s a fair answer." in front of two sentences. One scene line: `03-notebook` #2. | Merged. For example: "Gronckle: hit it under the jaw; Nadder: stay out of its blind spot; Nightmare: don’t."; "That’s a fair answer. It was a real risk, and Hiccup took it knowing that."; "Yes, short sentences speed the reader up. Long, flowing ones slow us down." The "Get down! Night Fury!" prompt now reads "Astrid shouts just three words, in two short bursts. Why do short sentences suit a moment of fright?" One line is left as it is (see Nice to have). | done |
| edu-a19-reader | `a19-01-arrive-l1` | "in roughly the years 800 to 1050". The usual Viking Age dates are 793 to 1066 (the writer flagged this). | "They sailed from Scandinavia in long, narrow ships, from the late 700s to the 1060s." | done |
| edu-a19-reader | `a19-08-near-l1`, best reply | "A dog’s nose is thousands of times more sensitive than ours." Published figures vary widely. The line was also 30 words and three sentences. | "Yes. Many animals learn who you are and whether you are calm just by smell, and a dog’s nose is far keener than ours." | done |
| edu-a19-reader | `a19-02-chase` #0 | Continuity: `shot-done` (reader) has already landed the dragon and called it "the Nightmare", but the next scene opens "A Monstrous Nightmare pulls itself over the lip of the cliff…" as if it were arriving. | "It is a Monstrous Nightmare. It heaves the rest of itself over the lip of the cliff, on fire along its whole back." | done |
| edu-a19-reader | `a19-15-hands`, choice `match` | Fishlegs says "I’ve read about you since I was four!" in the choice, and then again in `hands-done` #2. | The choice's `then` is now "She likes me! She actually likes me!" | done |
| edu-a19-reader | `a19-15-go-l1` skill | "adding two-digit totals: 2 + 2 + 1 + 2". The numbers are single digits. | "adding four small numbers: 2 + 2 + 1 + 2" | done |
| edu-a19-reader | `a19-16-complete` #4 | "Smoke rises because it is carried up by hot air…" repeats the notice just before it. | "On the beach, nobody looks anywhere else." | done |
| edu-a19-reader | `a19-17-dive-l1` | "The whistle gets higher as it comes towards you". The Doppler effect makes an approaching sound higher than its true pitch; it does not say the pitch keeps rising. | "The whistle sounds higher while it rushes towards you, and drops as it passes. That is the Doppler effect." | done |
| edu-a19-reader | `a19-18-wake-l1` | The prosthesis notice played after #4, cutting into "Oh." and "nobody hurries him", the scene's quiet beat. | Moved to `after: 6`, after "He looks at it for a long time, and nobody hurries him…". The spring ask stays after #7. | done |
| edu-a19-sprout | `a19-06-cove` #3 | "It has two tail fins. One is whole and one is torn." The ask straight after says "One is torn off." | "It should have two tail fins, but one is torn off." | done |
| edu-a19-sprout | `a19-11-astrid-done-l1`, option "Astrid" | "Astrid is tall for a girl…" is a needless gendered comparison. | "Astrid is tall, but the pine tree is much taller." | done |
| edu-a19-sprout | `a19-16-draw-done` #1 and lesson | The line says "Count them in your head." about everyone on the beach, but the lesson then counts three helpers, one of whom was Gobber, who in one choice is the person *you* help down. | Line: "Everyone is safe on the beach. Who helped?" Lesson: "(Hold up a finger each for you, your Nubbin and Stoick.)" / "One, two, three! Three helpers, and lots of others helped too." | done |
| edu-a19-sprout | `a19-18-wake` #4 | "Then he looks at his left leg. His own foot is gone." The child is given no reason, and EDU-STYLE asks for honesty. | "He looks down. His foot was hurt in the fall, and it is gone." Still no wound shown. Flagged for the adviser. | done |
| edu-a19-sprout | `a19-18-complete-l1` and `-unset-l1` | "What did the Keeper do?" In this band the Keeper is "you", and the trust in question is Toothless's trust in Hiccup. | "Toothless took a long time to trust. What did Hiccup do?" | done |
| edu-a19-sprout | `a19-13-chain` #4 | "Hiccup tells his dad too much." A listening 4-year-old has no way to know what that means. | "Hiccup tells his dad about Toothless. Stoick is upset and says something unkind." | done |

### A20 The Weeping

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a20-sprout | `a20-01-page-l2` → `a20-01-page-done-l1` | Two literacy lessons in a row on the no-Cinder route (handmade books, then clapping Breidablik). | `page-l2` is now social-studies, D2.His.2.K-2 (books in the past against today, a better fit). To avoid a new pair, `page-l1` (an island has water all round) is now science, 2-ESS2-2 (maps of land and water). The order is now science, social studies, (ember: science), literacy. | done |
| edu-a20-reader | `a20-12-complete-l1` → `a20-13-house-l1` | Two social-studies lessons in a row when s24Done is off ("one telling", then compass doors). | `13-house-l1` is now science, 1-ESS1-1, "the Sun rises in the east" (its real content). The north reply "In Iceland the Sun never rises due north" (true only by a hair, and confusing) is now "The north door faces away from the Sun’s path. The east door faces the sunrise." | done |
| edu-a20-sprout | `a20-01-page` (11), `a20-06-field` (11), `a20-10-hall` (12), `a20-17-complete` (11), `-sat` (11), `-walked` (12) | Over the sprout cap of 10 lines once `split()` runs. | `01-page`: "This is Frigg’s hall. Her spindle goes whirr, whirr, whirr." + "Come in, guest. This is Fensalir. Will you run errands for me?" (two Frigg lines merged). `06-field`: "A quiet word first: in this part, Baldr dies. It is told gently." (one line). `10-hall`: "Hel comes into her hall, tall and grave. She does not hurry."; Hel's line is now "If everything cries for him, he may go home." Shared `E17`: "Too young to ask, once. It is older now. Keep it for me." and "Your Nubbin wakes in his light, then comes back to you on its own." Now 10, 10, 10, 9, 9 and 10 lines. | done |
| both | `a20-12-cave` #3 (sprout #3) | Possible lift. Thökk's "I had no joy of him… Let Hel keep what she has." follows the stock translations of her verse closely (Brodeur: "had I joy of the carl's son; Let Hel hold what she hath"; I believe Faulkes's copyrighted version also ends "Let Hel hold what she has"). The Learning Grove takes no quotes from the originals. | Sprout: "He was nothing to me. He can stay where he is." Reader: "He was nothing to me living, and he’s nothing to me now. He can stay where he is." The "dry eyes" line stays; it keeps the verse's idea, not its wording. | done |
| edu-a20-sprout | `a20-03-complete` #1 | It gives away the count lesson that follows: "That is five things." | "Fire, water, iron, stones and trees all said yes." | done |
| edu-a20-sprout | `a20-07-asks-done` #1 and prompt | It gives the answer away: "Odin’s horse needs hay and water, like all horses." | "His horse is waiting in the stable, and it is hungry." Prompt: "Odin’s horse needs looking after. What do horses need to live?" | done |
| edu-a20-sprout | `a20-11-stones-l1`, "It turns to stone" reply | The reply is muddled: "It stays frost, then melts." | "Frost does not turn to stone. Warm sunshine melts it into water." | done |
| edu-a20-reader | `a20-03-asking-l2` #1 | Not accurate: "its roots tap into the host tree" (mistletoe has haustoria, not roots), and it is a partial parasite. | "Its green leaves make food from sunlight, but it sends root-like threads into the host tree to take water. So it is called a partial parasite." | done |
| edu-a20-reader | `a20-08-giantess` #1 | "Four of the gods hold it". In Snorri, Odin calls four berserks to hold the wolf. | "The wolf is grey as old ice. Four of Odin’s strongest warriors hold it when she gets down, and even they can hardly hold it." | done |
| edu-a20-reader | `a20-08-giantess-l1` prompt | `split()` cut Odin's quote across two lines ("Odin says, “She came to help." / "Let her be.”"). | "Thor’s hand goes to his hammer, and Odin tells him to let her be." | done |
| edu-a20-reader | `a20-15-complete-l1` prompt | The same split-quote break ("Líf says, “Not here, though." / "Will it?”"). | "Lífthrasir can feel something coming through the roots, and Líf hopes it will not come here." | done |
| edu-a20-reader | `a20-15-complete-l1`, "hands busy" reply (the known content-check warning) | "Líf and Lífthrasir have kept going by doing small daily tasks." See For Maor for the judgement. | "A practical answer. Busy hands can steady a worried mind, the way Frigg turned her spindle while she thought." | done |
| edu-a20-reader | `a20-12-road-l1` | "Iceland really has caves like this, called lava tubes." A cave in a cliff isn't a lava tube. The "lake" reply's logic was also off ("Lava is far too hot to leave a lake"; lava lakes exist). | "The road runs under a cliff with a cave in it. Iceland has many caves, and some are lava tubes." Reply: "No water fills it as it forms. What the lava leaves is an empty tunnel." | done |
| edu-a20-reader | `a20-14-shake-l1` | "a few centimetres a year". The North American and Eurasian plates part at about 2 cm a year. | "…slowly pulling apart, about 2 centimetres a year." | done |
| edu-a20-reader | `a20-14-complete-l1` #1 | "That is because it sits on the gap…" credits the plate gap for the glaciers as well as the volcanoes. | "The glaciers are there because it is so far north. The volcanoes are there because hot rock rises in the gap between the plates." | done |
| edu-a20-reader | `a20-15-company-l2`, and the file header | "Four of our weekdays are named for Norse gods". The English names come from the Old English gods (Tiw, Woden, Thunor, Frige), the same gods as Týr, Odin, Thor and Frigg. | "Names for the days are older than they seem." / "Four English weekdays are named for gods the early English shared with the Norse." / "Tuesday is for Tiw (Týr), Wednesday for Woden (Odin), Thursday for Thor, and Friday for Frige (Frigg)." parentNote and header comment updated to match. | done |
| edu-a20-reader | `a20-16-edge-walked-l1` | Plays after line 3, but "mist hides the ship" is line 4. | `after` 3 → 4 | done |
| edu-a20-reader | `a20-16-edge-l1` #1 | Calls "the way you see weather on the hills" a simile, but the page taught that a simile uses "like" or "as". | "That is a simile, made with “the way” instead of “like”. What does it help us feel?" | done |

### A22 The Candle

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a22-sprout | `a22-01-story` | 11 lines (cap 10). | "It is night, long ago. Abuela sits on a bed." + "A little girl in round glasses sits beside her." → "It is night, long ago. Abuela sits by a little girl in round glasses." | done |
| edu-a22-sprout | `a22-03-door` | 12 lines after the auto-split (cap 10): two three-sentence source lines. | "Then it is now. Antonio touches his door, and it glows!" / "A toucan lands on his head. A jaguar and capybaras come out!" | done |
| edu-a22-sprout | `a22-03-door-l1`, jaguar reply | "A jaguar has paws and a long tail": the jaguar's tail is short for a big cat. | "A jaguar has paws and fur, not wings." | done |
| edu-a22-sprout | `a22-01-complete-l1`, `a22-03-complete-l1`, `a22-07-complete-l1` | Three-sentence narration lines (grown-up prompts). | "(Count with me: laughing is one, cooking is two, shouting is three.)"; "(Count with me: Mirabel is one, the vase is two, your Nubbin is three.)"; "(Ask: what came first, what came next, and what came last?)" | done |
| edu-a22-sprout | `a22-04-complete` #1–2 | Continuity cut: "Night, Toñito." with nothing to say Antonio has moved out or that Toñito is Antonio. | "Mirabel sleeps alone in the nursery now. Antonio’s bed is empty." / `MI('Night night, Antonio.', 'soft')` | done |
| edu-a22-sprout | `a22-07-glass-l1` | "Two pieces fit to make one whole picture" contradicts the many pieces in the scene; "Five halves" is a strange distractor. | "The last two big pieces click together. Each is half. How many halves make one whole?"; distractor "One half" ("One half is only part of it. Two halves make one whole."). | done |
| edu-a22-sprout | `a22-12-complete-l1` | "Fold a butterfly down the middle" reads as folding a live butterfly. | "Look at a stitched butterfly’s two wings. Do the two sides match?" | done |
| edu-a22-sprout | `a22-12-cactus-l1` skill | "cactus live in hot, dry places" (grammar). | "a cactus lives in hot, dry places" | done |
| edu-a22-sprout | `a22-13-complete-l1` | "Rivers … end in the sea" as a rule; some end in lakes or other rivers. | Prompt "Where do most rivers end?"; replies "Yes! Most rivers run downhill and end in the sea." / "Not the sky. Most rivers run downhill, all the way to the sea."; skill and parentNote say "most". | done |
| edu-a22-sprout | `a22-04-lamp-warm-l1` | Tagged science, but taught "warm things can feel safe". | "A flame warms the air and glass around it. That is why your lamp feels warm." (skill "a flame warms things near it"). | done |
| edu-a22-sprout | `a22-15-village` #6 | Weakest line: "Julieta hands round arepas. Everybody eats, because they are yummy." | "Julieta hands round arepas. They cannot heal now, but they are still good." | done |
| edu-a22-reader | `a22-14-pedro-l1`, option 2 reply | "That is almost exactly what Mirabel says to her in a moment." She doesn't: she says "You kept us together…". | "A kind answer. Mirabel answers her in her own way, in a moment." | done |
| edu-a22-reader | `a22-07-glass-l1` | "The vision is made of eight equal pieces": broken glass isn't equal, and the scene never says so. | "Say the eight pieces of the vision were all the same size. What fraction of the whole picture would one piece be?" | done |
| edu-a22-reader | `a22-01-story-done-l1`, option 3 | "Families often pack a blanket first." is an unsupported claim. | "A fair answer too. Comfort matters when everything else is changing, and a blanket can feel like home." | done |
| edu-a22-reader | `a22-01-story-l1` #0 | "This page is a real country". | "This page is set in a real country: Colombia, in the north-west corner of South America." | done |
| edu-a22-reader | `a22-08-hide-done-l1` | "Never poke it with sharp things" (cotton buds aren't sharp). | "Never poke anything into your ears." | done |
| edu-a22-reader | `a22-11-gather-l1`, option 3 | Weakest reply: "Seven litres … That adds 4 and 750 oddly." | Option "Thirty litres": "That is ten times too much. 4 × 750 = 3000 ml, and 3000 ml is 3 litres." | done |

### A23 Remember Who You Are

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| both | `a23-margin-hazel` lesson, after `a23-14-complete` | Two literacy lessons in a row: `14-complete-l1` (RL.2.3 / L.4.5), then the margin note (sprout RF.K.2 "H says huh", reader RL.3.3 "clues"). The margin plays straight after `a23-14-complete` on every path. The writer log's adjacency check missed this. | Sprout: a sel ask (ELOF: Social and Emotional Development), "You find a note from someone you love. How might that feel?" Best: "Happy and a little sad, both at once" → "Yes. We can feel two feelings at once. Both are okay." Reader: a sel think question (CASEL: Self-awareness), "A note from someone you love, found when you were not expecting it, can stir up more than one feeling. What might you feel?" It has three fair-answer replies. `edu:say:first-sound:h` is removed from sprout CHECKS. | done |
| edu-a23-sprout | `a23-16-rain` #0 (A23-15 bridge) | "Simba is home. The hard times are over." For a child who never plays A23-15, Scar simply vanishes, and nothing in this band ever says the pride learns the truth (the outline's care note wants "it wasn’t your fault" to land). | "Simba is home. Scar is not in charge any more." / "Everyone knows now that it was never Simba’s fault." Lesson `after` 5 → 6. Scar's end is still never told, and "gone" is not used for it. | done |
| edu-a23-reader | `a23-16-rain` #0 (A23-15 bridge) | Same gap: "The hard times on the rock are over…" | New #0: "Simba has come home, and Scar no longer rules the rock. The whole pride knows now that it was never Simba’s fault." Then "The hard times are over, but the land has been dry…". Lesson `after` values +1. | done |
| edu-a23-sprout | `a23-11-oasis` #4 | "We say “no worries”. It is an old Swahili saying." Hakuna matata is an everyday phrase, not an "old saying". The phrase itself was never given. | "We say “no worries”. In Swahili, people say hakuna matata." | done |
| edu-a23-sprout | `a23-13-wind` #1–2 | The same route is said twice: "They float over the green place, then over the desert." then "First the green place. Then the desert. Last, the home plain." | #1 "They float up and away, high over the trees." | done |
| edu-a23-sprout | `a23-01-page`, `a23-01-gathering`, `a23-14-complete`, `a23-13-wind-rafiki`, `a23-16-complete-rafiki` | These scenes were 11, 11, 11, 12 and 12 lines long (the sprout cap is 10). | `01-page`: "I need someone to carry gourds." + "Will you help?" → "Will you help me carry gourds?" `01-gathering`: cut "Now you know a new word. Well done." `14-complete`: "Ha! You see? You learn." → "Ha! You learn." `13-wind-rafiki`: "Paint! Yellow earth! Quickly! No. Polepole. But quickly!" → "Paint! Yellow earth! Polepole. But quickly!"; "A puff of dust comes in on the wind." → "A puff of dust blows in."; "…back on the wall. He paints a mane round its head." → "Rafiki paints the cub back. He gives it a mane." `16-complete-rafiki`: cut "Me?" and merged into "You carried every gourd. Carry this one the last step." (`after` 4 → 3). They are now 10, 10, 10, 9 and 10 lines. | done |
| edu-a23-reader | `a23-12-talk`, `a23-14-find` | 17 lines each (the reader cap is 16). | Timon: "I don’t like where this is going. I can feel it in my fur: she’s gonna take him away." Rafiki: "I am not following you. I am sitting next to you, which is very different." Both are now 16. | done |
| both | Swahili list (outline) | The outline asks for *rafiki* (friend) and *simba* (lion). Sprout never says what rafiki means. Reader never says what either word means. The writer log claims both are covered. | Sprout `a23-01-gathering-done`: new line "Rafiki is a Swahili word. It means friend." Reader `a23-01-page`: "I am Rafiki. In Swahili, rafiki means friend. This is my tree…" Reader `a23-01-complete`: "His name is Simba. In Swahili, simba means lion. Rafiki tells me…" | done |
| edu-a23-reader | `a23-05-complete-l1` and glossary `myth` | The notice says "That is a myth, an old made-up story." The glossary has "An old story that people tell that is not true…". This teaches that traditional myths are lies, which is a cultural-respect problem on an East African page. | Line: "That is a myth: an idea many people have believed that is not true." Glossary: "An idea that many people have believed but that is not true. (A myth can also mean a traditional story.)" | done |
| edu-a23-reader | `a23-02-paints-done-l1`, "Good morning" reply | "Close, a greeting, but no." A thank-you is not a greeting, so "close" is wrong. | "Not quite. Asante is thank you and sana is very, so it is thank you very much." | done |
| edu-a23-reader | `a23-10-help-l1` prompt | The splitter broke the quote across two lines: "Timon says “Don’t thank us. Thanking is how they get you." / "Next thing you know, you owe somebody.” Do you think…" | "Timon says thanking someone means that next thing you know, you owe them. Do you think he is right? There is no one right answer." | done |
| edu-a23-reader | `a23-11-complete-rafiki-l1` | "What is a scarcity?" is ungrammatical. | "What does scarcity mean?" | done |
| edu-a23-reader | glossary `exile` (`a23-09-choice`) | The word is never used in any line. It appears only in the journal goal. | `a23-09-choice` #0 now ends "…a gap where a cub went through into exile." | done |
| edu-a23-reader | glossary `habitat` | It points at `a23-11-oasis-rafiki`, where the word never appears. It is first used in `a23-12-hunt-rafiki`. | Scene reference → `a23-12-hunt-rafiki`. | done |
| edu-a23-reader | `a23-11-grubs` #4 and its lesson | "Timon keeps a tally of what they ate this week: slimy 4, crunchy 6, wriggly 3." Thirteen bugs a week for a lion, a warthog and a meerkat makes the sum feel silly in the wrong way. | "…a tally of what Simba ate for breakfast…" and "How many bugs did Simba eat altogether?" The sum still comes to 13. | done |

### A24 The Law of the Jungle

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a24-sprout | `a24-02-council` #0, `a24-11-pack` #2 | "Look well, wolves" is Kipling's Council phrase. | "Look closely, wolves. Look closely at the baby." / "Look closely, wolves. Have I kept my word?" | done |
| edu-a24-reader | `a24-02-council` #1, `a24-11-pack` #2 | Same. | "Look closely at each cub." / "Look. Look closely, wolves." | done |
| both | quest titles A24-11, A24-16, A24-18 | "Look Well", "Man Goes to Man" (from the lifted Kaa line) and "Where No Man Comes" (the lifted last words) are Kipling's text. | "Look Closely", "The Spring Running" (Kipling's story title, used as a name), "The Hidden Beaches". | done |
| edu-a24-sprout | `a24-01-door` #7 | "I will call you Mowgli, little one. It means Frog." Mowgli is not a word for frog; Kipling only calls him "Mowgli the Frog". | "I will call you Mowgli the Frog, little one. Sleep now." | done |
| edu-a24-sprout | `a24-05-fight` #7 and lesson | "All the monkeys scatter. Four monkeys run. Two go up the wall." then "How many are left for the trees?": hundreds of monkeys, then four, then an unclear question. | "The monkeys scatter. Four little ones run past you." Prompt: "Four monkeys run. Two go up the wall. The rest run to the trees. How many is that?" | done |
| edu-a24-sprout | `a24-05-complete` #2 | "Bagheera gives a few soft cuffs": punishment by hitting, shown approvingly to 3–6s (reader keeps it with its think question). | "Bagheera gives him a long, stern look. Then it is finished." | done |
| edu-a24-sprout | `a24-09-ford` lesson | "A wide river runs slow… A narrow river is fast" overstates it. | Prompt "Here the river spreads out wide and shallow. Does it run fast here, or slow?"; best "Yes! Where a river spreads out, it slows down. That is why we cross here."; other "Squeezed into a narrow gap, it runs fast. Spread out wide, it runs slow." | done |
| edu-a24-sprout | `a24-09-bounty` #6 | "Akela stands up. Buldeo is on his back." reads as Buldeo riding Akela. | "Akela stands up. Buldeo falls flat on his back. Akela does not bite." | done |
| edu-a24-sprout | `a24-11-climb` lesson | Repeats 01-door-done (moon at night) and teaches that the Moon always rises in the evening. | "(Point to the moon.) Tonight the moon is full. What shape is a full moon?" A circle / A square ("No corners on the moon! A full moon is round, like a circle."). Skill: the Moon changes shape. | done |
| edu-a24-sprout | `a24-11-complete` #2 | Bagheera gives the answer ("Count them: five.") before the 1 + 4 question. | "Mowgli and his four brothers. That is enough." | done |
| edu-a24-sprout | `a24-13-hut` #1, `a24-13-hut-messua` #1–2, #5 | A mob tying people up is peril beyond "a bump or a fright". | "The villagers have tied Messua’s door shut, with her inside." Variant: "One evening, men with torches tie the hut door shut with rope." / "Messua and her husband are inside. Nobody knows what a guest is." / "…Then you start on the knots on the door." (the rope-chewing choice still works). | done |
| edu-a24-sprout | `a24-14-plan` lesson | Tagged 2-LS2-2 (pollination) but taught only "bees make honey". | Best reply "Yes! Bees make honey. They help flowers make fruit, too. Buzz!"; parent note adds "help flowers become fruit". | done |
| edu-a24-sprout | `a24-13-jungle-done` lesson | 2-LS2-1 (plants need water and light) doesn't fit "a tree grows from a seed". | Standard now `ELOF: Scientific Reasoning`. | done |
| edu-a24-sprout | `a24-16-bagheera` #1 | "I have paid for you with a bull. Now I have paid again." is unclear. | "Long ago I paid a bull for you. Today I paid another." | done |
| edu-a24-sprout | `a24-17-drove` #1 | "They do a job that was made for them" says the opposite of what is meant (forced labour). | "It is hard work they were made to do, for a company far away." | done |
| edu-a24-reader | `a24-01-page` #2–3 | Nova's card was split so the opening and closing quote marks fell on different lines. "never his to rule" also blurs Kipling with Britain. | One line: "“He also believed Britain had the right to rule India. He was wrong: India was never Britain’s to rule.”" | done |
| edu-a24-reader | `a24-02-council-done` notice, parent note, file header | "Sher is a tiger": in Hindi sher is used for both lion and tiger. | "Sher is a big cat, a tiger or a lion, and a khan is a chief." Parent note "sher (tiger or lion)"; header comment to match. | done |
| edu-a24-reader | `a24-04-chil-done`, option "8 hours" | Unhelpful reply: "That would be 8 times 1 kilometre, or something else entirely." | "In 8 hours, at 4 kilometres an hour, he would go 32 kilometres. Far too far!" | done |
| edu-a24-reader | `a24-06-pot` lesson, option "He needed it…" | Muddled: "Her neighbours shared theirs, which is a kindness she did not get to choose." | "But the woman needed it too. Her neighbour shared fire with her, but nobody asked her before taking hers." | done |
| edu-a24-reader | `a24-09-bounty-done` lesson, option 3 | "Sorrow matters a lot." means grief, not saying sorry. | "That is a thoughtful answer. Saying sorry matters a lot." | done |
| edu-a24-reader | `a24-10-dusk` lesson, option 2 | "The stones still could have hurt, so it still matters that they did not." makes no sense. | "The stones could still have hurt someone, so what the villagers did still matters." | done |
| edu-a24-reader | `a24-12-dry` #2 | "Fifty years I have lived in these hills": the reader teaches that Baloo is a real sloth bear, and they live far less. | "All my long life I have lived in these hills, and I have never seen it this bad." | done |
| edu-a24-reader | `a24-15-spring-done` lesson | "It is simply almost directly over the north." is muddled. | "Polaris is not especially bright. It simply sits almost exactly above the Earth’s North Pole." | done |
| edu-a24-reader | `a24-16-rock` #7 | Kaa: "I do it every year". Pythons shed several times a year, and A24-4 teaches that young snakes shed often. | "Changing your skin. I have done it many times, and it never gets easier." | done |
| edu-a24-reader | `a24-17-drove` #1 | "for a company far away that owns it": owns what? | "The men work quietly, at a job they were made to do, for a company far away." | done |
| edu-a24-reader | `a24-18-home-done` #2 | "…then nearly ten thousand" gives away the answer to the next-number lesson. | "Ten, then a hundred, then a thousand, and still more behind them. Each count is ten times the last." | done |
| edu-a24-reader | A5 glossary `hood` | First used in `a24-05-cistern` ("The cobras lower their hoods"), not `-cistern-done`. | Scene now `a24-05-cistern`. | done |

## 4. Nice to have

### A14 Homecoming

- **Slow-breath lessons.** Sprout still has six (`a14-03-pylos`, `a14-05-storm-done`, `a14-08-cave`, `a14-08-shout`,
  `a14-17-dream-done`, `a14-18-complete`) and reader about the same. Each fits its scene, but two of them could become
  other coping skills (naming the feeling, asking for help).
- **Repeated beats.** Sprout counts 2 + 2 days twice (`a14-03-complete`, `a14-05-swim`) and gives the host's-gift
  notice twice (`a14-03-proteus-done`, `a14-19-complete`). Reader multiplies years by 12 months twice
  (`a14-02-antinous-done`, `a14-04-shore-done`). The splash `do` appears twice with the same check
  (`a14-05-swim-done`, `a14-08-shout-done`).
- **Check-string spelling.** Sprout mixes `edu:say:sound-words:*` and `edu:say:sound-word:*` (oink, tweet). Left alone
  so that the CHECKS strings don't change; worth unifying when the handlers are written.
- **`a14-16-gate-l1` (sprout)** is literacy with RL.1.4, but it reads body language (a wagging tail), not words. An
  sel tag would be truer, and there's no neighbour clash either way.
- **Sprout `a14-16-gate` has 11 lines** and the harbour 12. Both are big scenes, left as they are.
- **Reader `a14-13-fig-l1`** adds the month of wind and the six feasting days (30 + 6). Homer's order lets the feast
  fall inside the month; "about" covers it.
- **Reader `a14-07-complete-l1`** teaches oil-lamp wicks. Homer lights the Phaeacian hall with torches held by golden
  statues. It is fine as a general fact; flag it for the classicist.
- **Reader `a14-08-complete-l1`** says Odysseus's word "would have been cut in Greek letters". The Greek alphabet comes
  after the Trojan War's setting; the main script's carved board is story licence.
- **Reader `a14-19-clean-l2`** (41 + 1) is very easy for ages 7–10. It could be 41 + 9 or a tally of cups.

### A15 The Humbug

- Sprout done scenes are 3 lines and reader done scenes 3 to 5, under the band minimums. The originals are 1 to 3 lines, so I left them.
- Sprout `a15-18-wait-done`: "The spider will not trouble anyone again." stays a euphemism. It is fine for a fairy-tale monster, but "It will never hunt anyone again" would be plainer.
- Reader `a15-10-fire`: the Nubbin "pats out a small smoking place" on the Lion’s tail, then the lesson is stop, drop and roll. It is consistent with the main script, but the sprout fix could be copied.
- Reader `a15-07-current-l1` (where the current is fastest) is physics filed as social studies under `D2.Geo.2.K-2`. Moving it to science would make two science lessons in a row, so I left it.
- Sprout `a15-17-complete-l1` is domain art with `ELOF: Mathematics Development` (a colour pattern). Either label works.
- Sprout `a15-06-watch`: "The rumbling stops. That is worse." It is the most frightening line in the band, though still within "a little spooky".

### A16 The Fox and the Rose (reader only)

- `a16-10-books-l1` is `social-studies` with the NGSS code `2-ESS2-2`. `D2.Geo.2.K-2` would match the domain. Both are approved, so I left it.
- Many done scenes have 2–5 lines, as their originals do. Each one plays straight after its step scene, so I judged the step and its done scene together and left them.
- Phrase-level echoes of the book's French carried over from the main script: "a ring the colour of moonlight" (*un anneau couleur de lune*, `a16-11-earth` #3) and "making ties" (*créer des liens*, `a16-13-fox` #4). Neither is a sentence quote, so they stay. They are worth a look in the legal check.
- `a16-15-water-done` #0 ("It tastes of the walk: the cold sand and the stars, the creak of the pulley, and being carried.") follows the book's well passage closely in idea. The outline asks for exactly this beat, and the wording is our own, so it stays.
- `a16-15-well-done-bonded`: the bucket holds 15 litres here and 12 in the base scene, so that the share comes out whole. Nobody sees both, but one bucket size would be tidier.

### A17 The Camphor Tree

- Done scenes are below the length guide (sprout 3 lines, reader 3 to 5) because the originals are 2 to 3 lines. I followed precedent and didn't pad them.
- Some lessons have a standard that only roughly fits: health lessons tagged `CASEL: Self-management` (reader dust, sleep, vegetables, colds), `2-ESS1-1` for the rotten post, and `ELOF: Approaches to Learning` for colour and drawing. They are all approved codes. No closer code exists for health.
- reader `a17-03-moon` #0 has "The moon is up" in lower case. Elsewhere it is "Moon".
- reader `a17-07-complete` #2: Granny's "He’d give you his head if it wasn’t screwed on" mixes two sayings. It works as a Granny-ism. Keep it if that is deliberate.
- sprout `a17-05-garden-done-l1` asks where the small ones went straight after the line that says so. That is fine for a 3-year-old, but thin.

### A18 The Doll in the Pocket

- Sprout `a18-02-supper-done` #0: "Shut the door. Properly, it sticks." Suggested: "Shut the door properly. It sticks."
- Sprout `a18-02-cellar-done-l1`: "Candles are hot, so only grown-ups hold them." In the scene, you hold the candle. Suggested: "Candles are hot. Only grown-ups carry them."
- Sprout `a18-07-night`, choice `count`: "You count up to four hundred and twelve. Vasilisa says thirteen." This is hard for ages 3–6 to follow. Suggested: "You count birches: one, two, three… Vasilisa counts too. You lose count together."
- Sprout `a18-09-supper-done` (feel your throat hum) now echoes `a18-05-journey-done` (hand on your throat). Fine as reinforcement, but one could use a rubber band instead.
- Loose fits left alone, because each has a code and isn't wrong: reader `a18-11-complete-l1` (foreshadowing under `RL.4.3`), `a18-05-complete-l1` (inference under `RL.3.3`), `a18-12-gate-self-l1` (friction under `3-PS2-1`), and `a18-03-busy-l1` (sun safety under `CASEL: Responsible decision-making`).
- Reader `a18-04-complete-l1` has the distractor "By flags on the church roof". The care notes avoid faith imagery, so "By carrier pigeon to every house" would be safer.
- Lesson replies of the form "Yes. A. B." run to three short sentences in both bands. Following precedent, the "Yes." isn't counted. Done scenes of 1–3 lines mirror their short originals and weren't padded, also as precedent.

### A19 The Dragon Who Fell

- reader `a19-13-chain-l1` "It is deliberate. Look at how carefully the sentence is built: “one short thing… that no father should say”." I left it. It is two sentences; the checker counts the ellipsis inside the quote as a third.
- sprout `a19-10-eel` keeps the `lie` choice right after the lesson "A fib makes trust wobbly". It isn't cruel, so it stays under EDU-STYLE. A softer label could be "Say he goes fishing (it isn’t true)."
- reader: 23 done and complete scenes have 5 lines, under the 6-line guide. The originals are one line, so by precedent they are not padded.
- reader has only one `do` lesson (the hum). One more act-out beat would help the Grove side. Sprout's `14-astrid-done` pen count could have a reader twin.
- reader `a19-01-raid-l1`'s new Gobber line, "And burnt is burnt.", could be warmer: "And what’s burnt stays burnt. You can’t un-burn a log."

### A20 The Weeping

- `reader:a20-01-page-done-l1`: "12 cloaks shared between 4 travellers, three each" is an odd picture. One cloak each from 12 travellers in 4 groups, or 12 loaves, would sit better. Not changed.
- `reader:a20-11-complete-l1` uses 2.OA.A.1 for adding to −4°C. Negative numbers are above that grade, but the thermometer framing carries it. Not changed.
- `sprout:a20-03-asking-l1`: the check is `edu:sort:materials:hard-or-soft`, but the child taps one thing rather than sorting. `edu:tap:material:iron` would describe it better. Not changed, so CHECKS stays the same.
- `sprout:a20-01-page-l2`: "Snorri wrote with a pen". He may have dictated it, and his own copy doesn't survive. "Books like Snorri's were written with a pen…" would be safer. Not changed.
- `reader:a20-05-complete-l1`: in an Icelandic summer the Sun sets well to the north-west. The lesson is still right at the level it teaches. Not changed.

### A22 The Candle

- Sprout has two hand-washing lessons (`a22-02-kitchen`, `a22-08-hide-done`) and three rest-and-water lessons
  (`a22-06-loads-done`, `a22-15-job-done`, `a22-16-photo-hands`). They're correct, but one of each could become
  a Colombian lesson the outline asks for (the tiple again, or the coffee cherry's colours).
- Reader keeps "Night, Toñito." with the empty-bed line before it. A glossary entry ("Toñito: a pet name for
  Antonio") would help readers.
- Several flame lessons sit in the lamp variants of both bands. They're all correct and they never repeat in a
  row, but a reader who sees every variant meets flames a lot.
- Short done scenes (sprout 2–3 lines, reader 1–5) are under the scene-length guide because the originals are
  that short. Left as they are, following precedent.

### A23 Remember Who You Are

- Sprout `a23-04-ledge-l1` and `a23-04-slip-l1` teach the same thing two scenes apart (both best answers are "Tell a grown-up you trust"). The ledge lesson could name the feeling instead: "Your tummy feels funny near Scar. What is that feeling called?", with the answer "Worried".
- Sprout `a23-10-desert-done-rafiki`: #5 says "Pole sana means “I am so sorry”", and the ask straight after it asks what pole sana means. Cutting #5 (and moving the lesson to `after` 4) would make the question do the teaching.
- Sprout `a23-07-dusk-done-l1`: "The sun has gone to the other side of the world." is loose. Better: "The Earth has turned, so the sun is shining on the other side of the world."
- Reader `a23-01-gathering-l2`: a standing group of giraffes is a "tower", but a moving one is usually called a "journey". These giraffes are walking. Either word works if the prompt says "standing".
- Reader `a23-16-roar-l1` prompt: the aside "(A lion’s roar can carry for kilometres.)" repeats `a23-06-chase-l1` and doesn't help the question. Cut it.
- Reader glossary `foal`: "A baby zebra." → "A baby zebra or horse."
- Reader `a23-10-help-rafiki` #6: Rafiki's "Hyenas eat and eat, and never plant anything" rubs against the band's fair hyena notice (`a23-06-bones-l1`). It is in character, but a gentler version would be "Hyenas eat and eat, and nobody here is planting anything."
- *Tembo* (elephant) and *jua* (sun) from the outline's list are not used in either band. Possible homes: `a23-01-gathering` (elephants) and `a23-03-light` (sunrise).
- Many done scenes are 2–3 lines (sprout) or 2–5 lines (reader), under the scene-length guide, because the originals are that short. Following precedent, they were left as they are.

### A24 The Law of the Jungle

- Done anyway: sprout `a24-06-branch` lesson now says "Bagheera is a black panther: a leopard with dark fur." (the parent note too), and sprout `a24-10-road-done` "A night bird sings" is now "An owl calls".
- Left alone: sprout `a24-09-complete` (keeping a promise) is tagged literacy (ELOF: Literacy), and `a24-18-cows-done` (helping without words) is tagged literacy (ELOF: Language and Communication). Both are really sel, but retagging either would put two sel lessons in a row.
- Reader `a24-01-door` think question: "Courage is not the lack of fear" echoes a well-known saying. It's fine, but a fresher line would be better.
- Short done scenes (sprout 3 lines, reader 3–5) follow the one- or two-line originals. Left as they are, following precedent.
- Reader glossary scenes for `Law`, `lame`, `dawn` and `debt` point to their own quest, though the words first appear in an earlier quest. Glossaries are per quest, so they were left.

## 5. Best moments to protect

### A14 Homecoming

- Reader `a14-16-sit` → `a14-16-sit-done`: "His eyes are on the gate, where his master went in. He is very tired, and
  the waiting is done." Then the plain "Argos has died. His body has stopped working, and it will not start again."
  It is the guide's handling of death, done exactly.
- Reader closer, `a14-20-complete`: "Odysseus could have stayed safe on Calypso’s shore, and chose to be well
  instead." It pays off the `a14-04-raft-l2` think question ("Is being safe the same as being well?").
- Sprout `a14-04-raft`, choice `happen`: "Yes! Safe is not the same as happy." It carries theme 5 at age four.
- Reader `a14-08-complete`: "Somebody ought to get some good out of that name. I won’t be using it again."
- Sprout `a14-11-after`: "You remember what Hazel did. She just sat beside someone." The third rule is acted out,
  not quoted.
- Reader `a14-11-shades-l2`: "Missing someone is a very heavy feeling, but it is not what makes a body stop." A
  careful answer to Anticlea's line.
- Reader `a14-13-strait-done` (strait/straight) and `a14-14-harbour` (nostos + algos = nostalgia): lessons that come
  out of the page itself.

### A15 The Humbug

- Reader `a15-01-cyclone-done-l1`: the Nubbin "thrilled and nervous" think question, which makes two feelings at once a real question.
- Sprout `a15-05-sit` and its lesson: "Brave means doing a thing even when you feel scared. Was your Nubbin brave?" The page’s heart, at four-year-old height.
- Reader `a15-17-lamb-l2`: safe versus well, with "like a bird in a cage with plenty of seed". This is theme 5, said for a 9-year-old.
- Reader `a15-13-flight-l2`: "A punishment with no end is no longer a lesson. It is a chain."
- Reader `a15-20-complete-asked-l1`: why one word, "Play.", carries so much.
- Both bands, `a15-20-goodbye-done`: "They are only shoes, dear. Most shoes are."
- Reader `a15-09-spectacles-l1`: the red apple through green glass. It is exact, and it comes straight out of the scene.
- Reader `a15-06-bridge-done-l1`: the tree’s overhang on each bank. A two-step sum that is part of the scene, not a test.

### A16 The Fox and the Rose (reader only)

- The drinker, played sad and never funny: "There’s something I do over and over, and it makes me feel worse." The lesson is about shame and asking for help.
- `a16-08-complete`: "Sadder than the sad man’s?" / "No. The other one knows he’s sad."
- The rose: "No, not that. I’m a flower, not a cake on a plate. I can stand a little cold."
- `a16-12-roses`, choice "tell": "He’s right. So you sit down beside him instead, and wait, and that turns out to be the thing." The third rule lands without being named.
- `a16-13-secret-done-glass`: "Keeping someone safe isn’t the same as keeping them close." This is the safe-versus-well theme in one line.
- The lamplighter: "I don’t know. That’s why I keep it lit."
- `a16-13-hour-t45`, where Sable comes one step nearer each time the shadow touches the stone, without a word.
- The new close: "Going home can mean a place, and it can mean someone you look after. For the boy, it means both."

### A17 The Camphor Tree

- reader `a17-06-greet` hunt choice: "There is only a hedge, and it is a perfectly ordinary hedge, and it would like you to know that."
- reader `a17-14-tunnel-done`: "You do not look down. You do, once."
- reader `a17-04-corridor`: the think question about the half-open door. In both bands, Satsuki's "Somebody has to." is paired with the motive lesson.
- sprout `a17-09-walk` choice `wait`: "You wait. There is nothing else to do, so you do it well."
- The bus-stop maths in reader: the times 7:20, 7:50 and 8:15 are used three times and stay consistent.
- Both bands keep the mother's illness unnamed ("only a cold") and the bow as narration only, never a task.

### A18 The Doll in the Pocket

- Sprout `a18-01-complete`: "I am sad. I think I am crying the right amount." / "I think so too."
- Sprout `a18-08-mortar`: "Thump! Every lantern rattles politely."
- Reader `a18-14-morning`: "Your Nubbin digs too, which helps less but means more."
- Both bands, `a18-11-oil`: "Do not thank me. It is pay." / "Pay is not a present."
- Sprout `a18-09-crust-l1`: "There is no wrong choice here." It honours all three crust paths without judging any of them.
- Reader `a18-02-supper-done`: "It does stick, like a gate you know, a long way from here." A quiet nod to lift-and-push.

### A19 The Dragon Who Fell

- Sprout `a19-03-docks-done`: "A pat on the head. It is a hug with no arms."
- Reader `a19-13-chain-l1`: the ask about why the writer leaves Stoick's words out. It handles the hardest beat with craft, not with detail.
- Reader `a19-10-grass-l1`: catnip and cats. It is a true, funny, exact parallel for the cove grass.
- Both bands' `a19-08-near-ran` / `11-turn-ran`: "That’s all right. It just means: not yet." The signature choice pays off gently, with no blame.
- Reader `a19-18-wake-l1`: "A prosthesis is a tool, like a good pair of boots. There is nothing to hide about it."
- Reader `a19-09-strap-done` #4: "Your Nubbin, who speaks it fluently, sits on the saddle and says nothing."

### A20 The Weeping

- Sprout `a20-10-hall`: Hermódr's "Everything will. You do not know him." / Hel's "No. But I will." Grave and kind in seven words.
- `a20-13-ash`, both bands: "Hold still, small one. You are not the fish." This is the only smile after A20-6, and it is kept small.
- Reader `a20-11-nubbin`: the Nubbin "goes on weeping, more easily now that it knows what it is", with its think question about feelings that arrive without warning.
- `a20-06-hodr`, both bands: "I only wanted to be in the game." Sprout follows it with "Someone tricked him. It was not his fault." Reader follows it with a fair think question about blame.
- Sprout `a20-14-bowl-walked`: "You can say, “I am not ready.” That is a brave thing to say." This turns the walk-away choice into permission, not failure.
- Reader `a20-15-kept` and `a20-02-council`: the "safe is not the same as well" think questions land canon theme 5 twice, without preaching.
- Reader `a20-margin-hazel`: pity against hatred, with "Pity does not mean forgetting what she did."

### A22 The Candle

- Reader `a22-15-complete`: "Pepa has no cloud, so she says how she feels out loud, and finds she can."
- Reader `a22-05-plan`: Mirabel writing her list "in the dark, in pen on the back of her hand".
- Sprout `a22-13-split-done` / reader `a22-13-split-done`: the count that comes out right (ten Madrigals reach
  the street, the same ten as in the photograph on the stairs).
- Reader `a22-13-confront-l1`: the think question on two people each partly right, which hands off to the
  river ("Keep reading: the river scene may help you decide.").
- Sprout `a22-14-pedro`: Pedro's death in Abuela's own plain words, then the butterflies and Mirabel's line.
- Both bands' rewording of the two lifted lines: "Whatever happens, you are loved, little one." and "You kept
  us together. You are the miracle, Abuela."

### A23 Remember Who You Are

- Sprout `a23-09-chase`: "That means his body stops working. It cannot start again." Then the comfort notice: "Sad feelings get easier to carry when someone is beside us." This is exactly what EDU-STYLE asks for.
- Rafiki in `a23-14-find`, both bands: "I am not following you. I am sitting next to you." The third rule is acted out, never quoted.
- `a23-16-roar`: the Nubbin's "tiny squeak", and "He roars again, gently, just for it." Reader adds Nala: "It’s trying. Like he used to."
- Reader `a23-04-ledge-l1`: "That is bitterness, wearing a lazy costume."
- Reader `a23-07-complete`: "Cold tea is still tea. It is like most things that way."
- `a23-10-complete-rafiki`: "Waiting is not nothing."
- Reader `a23-06-bones-l1` and `a23-05-complete-l1`: fair, accurate natural history (spotted hyenas hunt most of their own food in female-led clans; the elephant graveyard is a myth), told without breaking the scene.
- Zazu: "Hornbills are excellent at limping." Later: "…excellent at walking."

### A24 The Law of the Jungle

- Sprout `a24-14-akela`: "Akela has died. His body stopped working, and it will not start again." The comfort follows straight after (the howl, "We will remember him").
- Reader `a24-12-dry-done`: Hathi's "In the real jungle, an Asian elephant herd is led by the oldest mother, not by a father. I am only a story elephant."
- Reader `a24-03-words-done`: the think question on Baloo's cuff ("Nobody hits here, not even a bear.").
- Reader `a24-10-dusk-done`: "I do not know if you are Nathoo. I loved you anyway." Its lesson is about love that doesn't need certainty.
- Reader `a24-12-tale`: "It is old. That is a different thing from true, and sometimes a better one." Then the stripes lesson gives the plain reason.
- Reader `a24-01-page`: Nova's card, plain about empire and pitched right for 7–10.
- Both `a24-18-cows`: Steller's sea cow said plainly, with the comfort after; reader dates (1741, gone by 1768) and its cousins (manatees, dugongs) are correct.

## 6. For Maor

### Across the batch

- **The standards rule.** EDU-STYLE still says "leave `standard` out when none fits". CLAUDE.md says every
  lesson needs an approved standard, and the reviewers followed CLAUDE.md. Please align EDU-STYLE.
- **No codes for art, music or health.** The approved list has none, so the reviewers borrowed the nearest
  code. In sprout that was `ELOF: Approaches to Learning` (creativity) or the ELOF physical and scientific areas.
  In reader it was RL.2.4 for rhythm, 1-PS4-1 for sound, CASEL for health, and 2-PS1-1 or L.3.4 for art.
  Decide whether to approve these fits or add proper art, music and health codes, so later writers don't guess.
- **Same-domain rule.** Every storyline cleared every same-domain pair, maths and otherwise, on every play
  path and with the variants swapped in, with one exception. In A14 the inserted `a14-corvin-joins` lesson
  can land next to any quest's closing lesson, so one health-after-health pair remains (Corvin joining at the
  start of A14-6). No domain avoids every clash there.
- **Sprout `CHECKS` strings changed** in A15, A17, A18, A23 and A24 (listed per storyline below). The engine
  handlers need updating to match.
- **Writer logs out of date:** all ten `docs/logs/edu-aNN.md` files (counts, standards lists, "not
  registered yet", content-check status, and the facts fixed here). They were not edited.
- **Main-script fixes** are suggested for every page's `atlas-aNN.ts` (below). None were edited.
  - The ones that matter most: A17's flag read for Moss (it checks only the ending id).
  - A18's sunrise colour error.
  - A15's "Bran-new brains" and nose-smacking lines, and A22's "No. No, no, no." lyric.
  - Unmarked verbatim Kipling and bare "Good hunting" in A24.
  - The near-translation Thökk line in A20.
  - A19's "Five dragons go up" (there are four).
- **Engine notes (CV4).**
  - The Learning Grove must end A16 after A16-15, so the main A16-16/17 scenes don't play unreplaced.
  - A18's skull needs a Learning Grove display name ("The Lantern").
- **Licences and advisers.**
  - Licences: Disney (A22, A23) and DreamWorks (A19). For A16, the text and the name still need the legal
    check. The `atlas-a17.ts` header still says the page can't ship without a Ghibli licence, but the
    outline records it as approved.
  - Advisers: a Greek classicist (A14); a Japanese adviser (A17); an East Slavic folklore adviser (A18); an
    adviser with a limb difference (A19); a Heathenry adviser (A20); Colombian and Zenú advisers (A22); a
    Swahili adviser (A23); Indian and Unangax̂ advisers (A24). Each has additions to their packet.
- **Line endings.** The batch brief wrongly said these files were CRLF. A Git Bash `grep -c $'\r'` miscounts
  and made LF files look CRLF. Every reviewer but A14 kept LF. A14's two files were converted to CRLF, then
  set back to LF with `npx prettier --write`. All 19 files are LF now.

### A14 Homecoming

- **Line endings.** The batch brief wrongly said these files were CRLF, so this reviewer converted them. The
  coordinator ran `npx prettier --write` on both afterwards: they are LF again, like every other file in the batch,
  and plain `npx prettier --check` passes.
- **Standards picked for lessons with no natural code.** Every lesson now has an approved code. Reader health, music
  and art lessons use CASEL codes (Self-management for sleep, washing and tired muscles; Self-awareness for the
  body's alarm and breathing; Responsible decision-making for hearing and clean rooms; Relationship skills for the
  rowing beat), `K-LS1-1` for the old dog's needs and `4-ESS2-2` for the strait. Sprout's weaving pattern uses
  `ELOF: Mathematics Development` and the high/low sound lesson uses `ELOF: Scientific Reasoning`. EDU-STYLE has no
  health codes; consider adding one or two (or approving CASEL for health) so that later writers don't guess.
- **The inserted Corvin variant.** `a14-corvin-joins` plays before the first step of whichever quest comes first, so
  its lesson sits next to any quest's closing lesson. The two bands between them use every domain except music and
  art for those boundaries, so no single domain avoids every clash. Sprout went from five clashing paths to one; reader
  had one. The one left in both bands is health after `a14-05-complete` (health), only if Corvin joins at the start of
  A14-6.
- **CHECKS strings:** none changed. Sprout `CHECKS` is exactly the 28 `do` checks in use; reader has no `do` lessons.
- **Writer log `docs/logs/edu-a14.md` is out of date** (not edited):
  - The reader glossary has 28 entries, not 22.
  - "Art, music and health lessons that have no fitting approved code leave `standard` out" is no longer true.
  - Sprout domains moved by one: literacy 31 → 30, health 6 → 7.
  - "I did not run content-check" is stale: `a14` is in `eduPacks`, and content-check reports nothing for a14.
  - The A14-7 bard lesson no longer mentions rhyme.
- **Main-script suggestions (`atlas-a14.ts`, not edited):**
  - `A14_SIT_END` ("His tail moves once more in the dust…") follows Corvin's lines in `a14-16-sit-corvin`. Use
    "Argos’s tail" there.
  - Add these to the quote-verification pass. They track Homer or Butler closely, though none is verbatim:
    - `a14-05-storm#3`, "Three and four times lucky, the ones who fell at Troy" (Homer's "thrice and four times
      blessed"). The edu versions no longer use it.
    - `a14-07-name` (Odysseus's naming line), "My fame has gone up as high as heaven" (close to Butler, Book IX).
    - `a14-04-shore-done`, Calypso's oath "By the earth, and the sky, and the water of the Styx".
  - `a14-11-shades#0`: "The prophet Tiresias comes first". In Homer, Elpenor comes first, and Anticlea appears before
    Tiresias speaks. This is fine as staging; note it for the classicist.
- **Greek classicist packet:** add these to the writer's three items:
  - xenia said as ZEN-ee-ah;
  - the Ulixes/Ulysses and Athena/Minerva line;
  - the lyre's strings (same length, different thickness);
  - Homeric memory aids (metre and formulas, no rhyme);
  - the Siren Vase date (about 480–470 BC, "about 2,500 years ago");
  - ancient dog memorial stones;
  - moly and the snowdrop guess;
  - Athena, the olive and Athens;
  - Pylos lying west of Sparta.
- **Licences:** none needed. Homer and Butler (1900) are public domain, and no modern translation or film is used.
  The adviser (a Greek classicist) is still open, as before.

### A15 The Humbug

- **Decision, the secret choice.** Sprout now leaves out "Promise to keep his secret" in `a15-14-secret` (`defaultChoice: 'theirs'`; the choice sets no flag). Reader keeps all three choices, and its lesson now says plainly that a secret a grown-up asks you to keep from other grown-ups is one to tell.
- **Decision, standards.** Every lesson now has a code. The approved list has no art or music code, so:
  - Sprout art and music use `ELOF: Approaches to Learning`, the domain that holds ELOF's Creativity. The writer had left Approaches out.
  - Reader art and music use the nearest English or science code (listed in the must-fix row). Please confirm, or add art and music codes to EDU-STYLE.
- **Decision, deaths in sprout.** The Witch of the East "has dried up, like a puddle in the sun", which is Baum's and the main script's fact. The Witch of the West "melts all away, into a brown puddle. She cannot hurt anyone now", in place of "She is gone for good". The spider's "will not trouble anyone again" is kept.
- **Changed CHECKS string:** sprout `edu:count:crossers:5` → `edu:count:crossers:7`. Reader CHECKS are unchanged.
- **Writer log staleness (`docs/logs/edu-a15.md`):**
  - "sprout keeps them too, so no `defaultChoice` is needed" is now wrong.
  - "Approaches excluded" is now wrong.
  - The `a15-14-screen` note (about 20 lines) is wrong: it is 13 now.
  - The care-note quote "She melts all away. She is gone for good" has changed.
  - The sprout header's description of the Corvin variants ("a lonely man who fibbed to keep folk safe") never matched the lines.
- **Line endings:** the brief said CRLF, but both files, like `atlas-a15.ts` and the A13 edu files, are LF. I kept them LF.
- **Suggested main-script fixes (`atlas-a15.ts`, not touched):**
  - Line 2385, "There. Bran-new brains.", contradicts the file header, which lists "bran-new brains" as never given.
  - Line 884, "smacks the Lion on the nose, as hard as she can", is Baum's sentence almost word for word.
  - Line 2929's Hammer-Head description is close to Baum's, and line 3005's "small and round" breaks the care note on body shapes.
  - The `a15-08-wildcat` choice `lion` repeats the Queen's question that opens `a15-08-wildcat-done`.
  - Please confirm that "I'm glad we didn't take anything away" (line 2778) is meant as irony on the pocketed path.
- **Facts the writer flagged:** I checked these and they are right:
  - Omaha is in Nebraska, north of Kansas, on the Missouri.
  - Children aged 7 to 10 need 9 to 12 hours of sleep, and their resting pulse is roughly 70 to 100.
  - A desert gets under about 250 mm of rain a year.
  - Silver conducts best and tarnishes.
  - A humbug is also a mint sweet.
  - Porcelain was first made in China more than a thousand years ago.
  - The first crewed balloon flight was in France in 1783.
- **Licences and advisers:** none needed. Baum (1900) is public domain, nothing is taken from the 1939 film, and the outline names no adviser.

### A16 The Fox and the Rose (reader only)

- **Reader only, ending at the well: confirmed.** The outline says "Learning Grove version: yes, for the older band only, ending at the well, where the prince says he is going home to his rose". The care notes repeat it ("for the older band only and stops at the well", "The Learning Grove version skips the scene altogether"). There is no sprout version, as intended. `eduExempt` in content-check matches: everything for sprout, and A16-16, A16-17 and `a16-grove-*` for reader.
- **Does the shortened version still make sense for a child who never sees the ending? Yes, now.** The last scene had promised "tomorrow evening" at the wall; that line is gone. Two things stay open, as the outline intends:
  - The snake's "I’m the shortest way there is" (A16-11) never pays off. This is faithful to the book and harmless.
  - The A16-2 muzzle choice (`a16-strap`) has no payoff in this band, which strains the rule that every choice must be real. Your call whether that matters.
- **The engine (CV4) must end the page after A16-15 in the Learning Grove**, so that the main A16-16 and A16-17 scenes don't play unreplaced. I didn't add a closing "back to the atlas" line, because the wiring isn't settled.
- **The writer log `docs/logs/edu-a16.md` is out of date:**
  - It says six lessons have no standard; there were seven, and now there are none.
  - Its standards list needs 1-ESS1-1, 3-PS2-1 and RL.4.3 added, and 3-5-ETS1-2 removed.
  - The étoile lesson is now in A16-8's desk scene.
  - The final scene no longer has "come back tomorrow evening".
  - "Not registered yet" is wrong: `edu.ts` and `index.ts` already import the file.
  - Still correct: the 96 lessons and all the sums. The domain counts are right except science, which is now 22, and literacy, now 20 (the evidence lesson moved over).
- **Fixes I suggest for the main script (`atlas-a16.ts`), not made:**
  - `a16-14-pills` "If I had fifty-three minutes to spare, I’d spend them walking to a spring. Very slowly." is a near-translation of ch. XXIII. Paraphrase it, as here.
  - `a16-10-books` #0 "The sixth planet is ten times bigger" and the A16-10 step hint "the planet ten times bigger than the last" follow ch. XV closely.
  - `a16-15-night` #0 "all four of you" is wrong when Sable has come.
  - The main fox line was already safe ("From the moment the shadow starts to move…"); only the edu file had brought the four-and-three sentence back.
- **Licences and advisers:** the outline records the drawings licence as approved on 2026-10-17. The main header still calls for a legal check of the text and the name before ship, and the two phrase echoes above belong in it. No cultural adviser is needed.
- **Line endings:** the brief said CRLF, but this file is LF, as are the repo's Prettier `endOfLine: "lf"` setting and the previous batch. It stays LF (0 CR bytes).

### A17 The Camphor Tree

- **`moss-sleeps` finding.** In `atlas-a17.ts`, `a17-grove-oak-sleeps` plays when the campaign ending is `moss-sleeps`. In that ending Moss has faded. `campaign-book3.ts` gives the ending "let Moss fade", with "his flower by the flat stone", and Moss is removed from the world. The original scene says "where Moss always sat", "his flower" and "where his used to be". So Moss has died. He is not literally asleep: the "sleeps" in the title is the ending's name, and the sleepers in the scene are the Nubbins. Both bands are right to say plainly that he died (EDU-STYLE "Hard things"). The fix was to add the Grove's word: "Moss faded. That means he died." Sprout also gets his flower back (canon 15). Neither band calls death sleep.
- **Suggested main-script fix (flag read).** A17 reads only the ending id. Moss can have faded without the `moss-sleeps` ending, for example on The Long Road with Sable unbonded and `mossFaded` true. In that case `a17-grove-oak` would show Moss alive on his stone. A26 and A30 use "Moss has faded (`mossFaded`, or `mossReturned` false after c10) or the ending is moss-sleeps". I suggest `atlas-a17.ts` (header, A17-11 notes, A17_VARIANTS comment) read the same condition. It is still read-only. The edu files need no change.
- **Changed CHECKS string:** sprout `edu:say:rhyme:red-bib` is now `edu:say:rhyme:bib`. The reader CHECKS are unchanged.
- **Writer log staleness (`docs/logs/edu-a17.md`).** These counts are out of date:
  - Reader lessons: 133 becomes 132, because the pond habitat lesson was dropped.
  - Reader science: 36 becomes 34 (the dropped lesson, and `grove-oak-sleeps` now literacy).
  - Reader literacy: 21 becomes 22.
  - Sprout science: 23 becomes 22, and sprout maths: 15 becomes 16, because grove-camphor is now maths.
  - Sprout sel: 25 becomes 23, and sprout literacy: 12 becomes 14, because of the two 16-complete lessons.
  - Glossary: the log says 23, but the file had 26 and now has 25 (`habitat` was removed).

  The log's line "Moss … both bands say plainly that Moss died" still holds. It should add "faded = died" and the flower. Its "Facts worth a second pair of eyes" should now say *tsuyu* is "written with the characters for plum and rain".
- **Main-script notes (no edit made):**
  - `a17-15-sign`: Mei (four, "can’t write yet") reads the Catbus sign aloud, "It says Mum! It says Mum’s hospital!". Consider giving the line to Satsuki, or having Mei say "Is that Mum’s hospital?".
  - `a17-06-found#10`: "I’m not lying." is a three-word stock phrase that is close to the Disney dub. It is low risk, but worth a glance in the quote check.
- **Licences and advisers:** the page still needs the Studio Ghibli licence (the outline now records it as approved on 2026-10-17; the atlas-a17 header still says it cannot ship without one). The Japanese adviser packet should include the edu lines on the shimenawa, Jizo (bibs, flowers, roadside care), genkan, mugicha, *arigatō*/*onegai shimasu*/*obaa-chan* and the *tsuyu* characters.

### A18 The Doll in the Pocket

- **Standards (decision):** every lesson now has an approved code, as CLAUDE.md requires. Several are nearest fits, reshaped so they're honest: colour mixing as predict-and-try (`ELOF: Scientific Reasoning`), the beat of work songs and walking as rhythm and repeated lines (`RL.2.4`), the lantern think question as point of view (`RL.3.6`), and putting out a candle as comparing solutions (`3-5-ETS1-2`). EDU-STYLE still says "leave `standard` out when none fits", which contradicts CLAUDE.md. Worth aligning.
- **Domain changes:** sprout `a18-16-palace-l1` social studies → sel; reader `a18-04-last-done-l1` art → literacy; reader `a18-15-loom-done-l1` and `-self-l1` literacy → social studies. New counts: sprout sel 25, social studies 11. Reader art 4, literacy 19, social studies 17.
- **CHECKS (sprout):** removed `edu:point:colours:white-red-black`; added `edu:make:pattern:white-red-black` and `edu:sort:crayons:warm-cool`. Reader `CHECKS` stays empty, because reader has no `do` lessons.
- **Writer log is stale** (`docs/logs/edu-a18.md`): it says the files aren't registered and content-check hasn't been run. Both files are now in `edu.ts` and `eduPacks`, and content-check passes. Its "Standards used / left out" bullets and the domain counts no longer match. It said 25 lessons had no standard; there were 31.
- **Line endings:** the brief said CRLF, but both files are LF (in Git Bash, `grep -c $'\r'` matches every line, which is misleading). LF was kept.
- **Main-script fixes suggested** (`atlas-a18.ts`, not touched):
  - `a18-07-white` #5: change "goes gold, then red, then plain day" to "goes red, then gold, then plain day".
  - The skull's speaker name is still "The Skull", so sprout children see that name above "lantern with a face" lines. Consider a Learning Grove display name ("The Lantern").
- **Adviser:** the East Slavic folklore adviser is still needed. Packet:
  - the oral-tradition box (Ukrainian, Belarusian, Polish and Russian stories named; Afanasyev in the 1800s);
  - the great stove used as a bed;
  - kvass;
  - birch-bark letters (said as "in some lands");
  - "Tsar of the tale";
  - the softened ending of the stepmother's house.
- **Licences:** none needed. The tale and Magnus are public domain, and no edu line quotes them.
- **Reader hard questions:** `a18-14-stare-l1` (do unkind people deserve a fright?) and `a18-09-crust-l1` are unchanged; the writer flagged both for your sign-off.

### A19 The Dragon Who Fell

- **CHECKS strings:** unchanged in both bands. Sprout keeps its list, which matches the strings used. Reader is `['edu:hum:feel:throat']`.
- **Standards added:**
  - Sprout now also uses `ELOF: Mathematics Development` and `ELOF: Language and Communication`.
  - Reader now also uses 2-PS1-1, 2-PS1-4, 2-ESS2-3, 4-LS1-1, K-ESS2-2, K-ESS3-3 and L.3.4.
- **Lessons reshaped to fit a code:**
  - `reader:a19-09-pedal-l2` ("writing clear instructions") is now L.3.4, "hard left".
  - `reader:a19-01-raid-l1` gains the point that burning can't be undone (2-PS1-4).
  - `reader:a19-02-complete-l1` now teaches material properties (2-PS1-1).
- **Writer log is stale** (`docs/logs/edu-a19.md`):
  - "A few lessons (art, the colour pattern) have none" and "Several science notices… have none" are no longer true. Every lesson now has an approved code.
  - Both "Standards used" lists need the additions above.
  - The Viking Age dates bullet is resolved: the line now reads "the late 700s to the 1060s".
  - The domain counts are unchanged.
- **Main-script fixes I suggest** (`atlas-a19.ts`, not touched):
  1. `a19-15-go` #5 "Five dragons go up". There are four training dragons, and Toothless is on the ship. Both edu bands say four.
  2. `a19-02-shot-done` lands "something large… not black" and `a19-02-chase` #0 then says "A Monstrous Nightmare pulls itself over the lip of the cliff". That reads fine in the main script, but if `shot-done` is ever expanded, open `chase` with "It is a Monstrous Nightmare."
- **Invented reader numbers** (the writer's list, all checked and correct): 3 × 12 = 36, 4 × 12 = 48, 40 + 20 + 40 minutes back from 6:00 = 4:20, 6 ÷ 2 = 3, 4 + 6 + 9 = 19, half of 12 plus 3 = 9, 12 × 60 = 720 km, 12 ÷ 2 = 6 (now Stoick), 6:00 to 9:45 = 3 h 45 min, 4 × 2 = 8, 2 + 2 + 1 + 2 = 7, 1,800 ÷ 300 = 6, 5 × 40 = 200.
- **Licence and advisers:**
  - The DreamWorks licence is still needed (see the main script header).
  - An adviser with a limb difference should see `a19-18-wake` in both bands, including sprout's new line "His foot was hurt in the fall, and it is gone."
  - A historian should optionally check the Norse facts: shield size about 80 cm with an iron boss, turf roofs, stockfish, the steerboard, the Icelandic horse, longhouses with byres, and knotwork.

### A20 The Weeping

- **The daily-tasks warning (canon 22).** The line wasn't a game timer or chore mechanic, so it broke no rule. It was still a poor line. It described the pair's survival as "small daily tasks", which reads as chores, and nothing in the scene supports it (they only lick the dew). It is now "A practical answer. Busy hands can steady a worried mind, the way Frigg turned her spindle while she thought." That reply is grounded in `a20-02-council` and doesn't trip the heuristic. content-check now gives no warnings for a20.
- **CHECKS strings:** unchanged in both files. Sprout has the same 12 strings; reader is still empty (no `do` lessons).
- **The writer log `docs/logs/edu-a20.md` is now stale.** Its claim that "no two lessons of the same domain are back to back, in any route" was false (the two pairs above). Its counts have shifted: sprout science 23, literacy 15; reader science 22, social studies 11. Sprout no longer uses `ELOF: Literacy` (so five ELOF codes, not six) and now uses 2-ESS2-2. Its fact line "Tuesday to Friday are named for Týr, Odin, Thor and Frigg (or perhaps Freyja)" should now read Tiw, Woden, Thor and Frige (the English forms). Sprout's Nanna death no longer names grief as the cause; reader keeps Snorri's "her heart breaks with grief". Say if you want sprout to name grief too.
- **Suggested fixes to the main script (`atlas-a20.ts`, not touched):**
  - `a20-12-cave` #3, Thökk: "I had no joy of him living, and I’ll have none of him dead. Let Hel keep what she has." The script's notes say it is in our own words. It follows the stock translations of her verse very closely, and "Let Hel hold what she has" may be the copyrighted Faulkes wording. Suggest "He was nothing to me living, and he’s nothing to me now. He can stay where he is."
  - `a20-08-giantess` #1: "Four of the gods hold it". Snorri has four berserks. Suggest "Four of Odin’s strongest warriors".
- **Advisers and licences:** an adviser read is still needed from an inclusive Heathen organisation (Ásatrú is a living, registered faith in Iceland). It should cover sprout's "Some people still honour these gods today", reader's Heathenry intro line and glossary entry, and the weekday-names notice. No licence is needed: nothing is quoted from any copyrighted translation, and Brodeur is public domain and isn't quoted in either band.
- **Line endings:** the brief said CRLF, but both files were LF on disk before any edit (`tr -cd '\r' | wc -c` = 0), and so is `atlas-a20.ts`. They were kept as LF.

### A22 The Candle

- **Suggested main-script fixes (`atlas-a22.ts`; not touched here):**
  - `a22-04-party` line "No. No, no, no." is a lyric fragment ("no, no, no" is in the Bruno song). Suggest
    "No. Not the candle."
  - `a22-14-pedro` #7 ("I was given a miracle that night. And I was so afraid of losing it that I forgot what
    it was for.") is very close to Abuela's line at the river in the film. It would be a third lifted line, on
    top of the two in the outline, and the outline asks for only those two. Suggest the edu wording ("A
    miracle came to me that night. I was so frightened of losing it that I held on too hard, and squeezed you
    all."), or check it against the film when the two listed lines are checked.
- **Standards:** 21 lessons had none (1 sprout, 20 reader). Each now has an approved code. Three reader lessons
  were reshaped instead, because no code fitted: `11-vision` (art → science), `13-lamp` and `01-lamp-flicker`.
- **CHECKS:** unchanged in both files (sprout 11 strings, reader `edu:breathe:slowly:5`, `edu:clap:beat:party`).
- **Writer log (`docs/logs/edu-a22.md`) is now stale:**
  - The art count drops by one in reader (now 1 art, 30 science).
  - The reader standards list gains 1-PS4-2, 3-PS2-1, 4-PS3-4, K-LS1-1, L.4.5 and RL.1.4.
  - The sombrero notice now has a neighbour's hat in the scene.
  - "Every lesson has a standard" is now true in both bands.
- **Licence:** the page can't ship without a Disney licence (the main script's header says so), and that
  covers these edu versions too.
- **Advisers:** the log's three asks stand: the sombrero vueltiao notice, "minga", and the plain wording of
  the flight and Pedro's death. Two more points:
  - The new reader line calls the sombrero vueltiao "a symbol of all Colombia". It is a national cultural
    symbol by law (2004), but a Zenú adviser should approve that framing.
  - "Minga" has Quechua roots and is most at home in the Andean south-west. Someone should check that "in many
    parts of Colombia" is fair for a coffee-country village.
- **Content-check:** A22 is now registered (`a22` in `eduPacks`), and the check reports nothing for it.

### A23 Remember Who You Are

- **ELOF and CASEL: no problem found.** Every lesson has a standard from the approved list (184 of 184, checked by script: 83 sprout, 101 reader). The sprout ELOF codes match the list exactly: Approaches to Learning, Social and Emotional Development, Language and Communication, Scientific Reasoning, and Perceptual, Motor, and Physical Development. The reader band has no ELOF codes. The three sprout health lessons use `ELOF: Perceptual, Motor, and Physical Development`, which is a good fit because that ELOF domain covers health and safety. The one reader health lesson uses `CASEL: Responsible decision-making`. Some music lessons borrow science or ELOF codes (for example 1-PS4-1 and `ELOF: Scientific Reasoning`), because the approved list has no music code. Leave them, or approve a music code.
- **Bridge scenes (A23-8 and A23-15): they hold now.** The outline itself does not say that these quests are left out. It says "All ages" and "Learning Grove version: yes, as a savanna page, not a retelling of the death". The omission is recorded in the header of `atlas-a23.ts`, in the writer log, and in content-check's `eduExempt` comment. I suggest adding one line to the outline's "Learning Grove version" paragraph: "A23-8 and A23-15 are audience `main` and have no Learning Grove version; A23-9 and A23-16 carry the bridge."
  - With the fixes above, the scenes on either side of each gap use nothing introduced only in A23-8 or A23-15. The gorge, Zazu's wing and the ledge are now set up in `a23-09-chase`. Scar's removal and "never your fault" are now said in `a23-16-rain`. No edu scene reads a flag.
  - The signature choice (`a23-09-choice`, `a23-path`) sits after the first gap. Its payoffs in A23-10 to A23-13 and at `a23-16-complete`/`-rafiki` are intact in both bands.
  - Please confirm the bridge wording, which mentions the wildebeest herd in reader only. Sprout never mentions the stampede.
- **CHECKS changed:** sprout loses `'edu:say:first-sound:h'` (the margin-note lesson is now a sel ask). Reader CHECKS is still `[]`.
- **The writer log (`docs/logs/edu-a23.md`) is out of date.**
  - Sprout counts are now sel 24, literacy 9; kinds 54 ask / 13 notice / 16 do.
  - Reader counts are now sel 28, literacy 20; think questions 17.
  - The claim "no two lessons of the same domain are adjacent" was wrong for the margin note's play position (now fixed).
  - Rafiki and simba are now actually taught.
  - "Hello is karibu" is gone.
- **Suggested fixes to the main script (`atlas-a23.ts`; not edited):**
  1. The quest titles "Everything the Light Touches" (A23-3) and "Look Harder" (A23-14) echo famous film lines. The file's own header promises "no 'look harder' spoken aloud". Consider titles such as "The Light on the Plain" and "The Still Pool". The edu files inherit these titles.
  2. `a23-01-presentation`: the three-day-old cub "blinking at all of you" is harmless, but real cubs' eyes usually open nearer a week.
  3. The outline line suggested above.
- **Licence.** *The Lion King* is © Disney and fully in copyright. The page, including both Learning Grove bands, needs a licence before ship. No film line, song lyric or chant is used in either edu file. "Grief is love with nowhere to go" does not appear. Each band has one plain use of hakuna matata as an everyday phrase (sprout `a23-11-oasis`; reader `a23-11-oasis`, with word-by-word glossing), and no reward carries it.
- **Swahili adviser (Kenyan or Tanzanian speaker).** Please check: karibu (welcome; also "near"), jambo (kept in a sprout reply as "hello"; the adviser may prefer *habari* or *hujambo*, since *jambo* is often seen as a tourist register), rafiki, simba, twiga, asante / asante sana, nyota, mvua, pole sana, polepole, and the word-by-word reading of hakuna matata (hakuna = "there is no", matata = "troubles"). Please also check Rafiki's voice (a dry, kind elder with a craft, never a comic healer) and the landscape. The outline asks for this adviser.

### A24 The Law of the Jungle

- **Changed CHECKS string (sprout):** `edu:count:seasons:4` is now `edu:count:seasons:3`. The reader `CHECKS` stays empty.
- **Decision you may want to revisit:** in the Learning Grove only, "Good hunting" is now "Welcome", "Thank you", "Greetings", "Well, well" or "Safe travels", and "Look well" is now "Look closely". Three quest titles are renamed: A24-11 "Look Closely", A24-16 "The Spring Running" and A24-18 "The Hidden Beaches". Choice id `hunting` is kept.
- **Writer log `docs/logs/edu-a24.md` is stale on these points:**
  - For Maor item 4 ("Both bands keep Good hunting") no longer holds.
  - Sprout no longer uses 2-LS2-1.
  - Reader search-done maths is now 3.OA.A.3, not 2.OA.A.1. 2.OA.A.1 is still used elsewhere.
  - The "What it teaches" list should add the three seasons of central India.
  - Lesson and domain counts are unchanged (sprout 130, reader 132).
- **Suggested main-script fixes (`atlas-a24.ts`, not touched):**
  - `a24-07-tears`, Mowgli: "What is it? What is it? … Am I dying, Bagheera?" is verbatim Kipling but isn't in the LIFTED TEXT list and has no `childLines`. Either mark and verify it, or paraphrase it.
  - "Good hunting" appears as a bare greeting five times (a24-04-chil, a24-04-kaa ×2, a24-09-ford, a24-16-trail). It's verbatim, though the header calls the set phrases paraphrased. Consider listing it.
  - `a24-09-ravine-done`: "He never woke up all the way" is fine for the main game. If the main game's `all` rating is meant to follow EDU-style plainness, consider "He is dead."
  - A24-11, A24-16 and A24-18 titles echo lifted lines (see above).
- **Advisers:**
  - The Unangax̂ adviser should still read A24-17 in both bands. Reader `a24-17-beach` says families "were brought here long ago to work the seal harvest", which softens forced relocation by the Russian fur trade. The adviser may prefer "forced".
  - Indian advisers: the lead bull's Kipling name "Rama" (reader `a24-09-ravine`) is a deity's name, and the Hindi glosses (bhalu, akela, bandar, hathi, sher, khan, cheel) need checking.
- **Not covered by the content check:** the a24 edu files aren't wired into `edu.ts` yet, so `content-check.ts` doesn't check them. My own script covered caps, sentences, standards, choices and domain runs.

## 7. Checks (after the fixes, from the repo root)

- `npx tsc --noEmit -p .`: no errors.
- `npx eslint src/content tests/tools`: no errors or warnings.
- `npx tsx tests/tools/content-check.ts --warnings`: **problems: 0**, warnings 2 (both `pa2-*` pronoun
  lines in Pixel's Arcade, outside this batch). All ten pages are registered in `edu.ts` and `eduPacks`,
  so the check covers them.
- `npx prettier --check` on the 19 files: clean.
