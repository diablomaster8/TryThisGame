# Review: edu-atlas-3 (Learning Grove Atlas A25–A31, sprout and reader), fix mode

Date: 2026-10-17. Brief: `docs/briefs/review.md`. Files: `src/content/edu-a25-reader.ts`, `edu-a26-sprout.ts`,
`edu-a26-reader.ts`, `edu-a27-sprout.ts`, `edu-a27-reader.ts`, `edu-a28-sprout.ts`, `edu-a28-reader.ts`,
`edu-a29-reader.ts`, `edu-a30-sprout.ts`, `edu-a30-reader.ts`, `edu-a31-sprout.ts` and `edu-a31-reader.ts`
(12 files; A25 and A29 are reader-only). Each storyline was read in full against `docs/canon.md`, the "Story and
content" section of `CLAUDE.md`, `EDU-STYLE.md`, its original (`atlas-aNN.ts`), its outline section in
`docs/more-stories.md` and the writer's notes `docs/logs/edu-aNN.md`. One reviewer per storyline applied the fixes
to that storyline's files only. The coordinator fixed the a26 tsc error.

All 12 files are LF and Prettier-clean. Nothing is committed. Earlier batches' files, `src/sim`, `src/ui`, the main
scripts, `types.ts`, `tsconfig.json` and `tests/tools/content-check.ts` were not touched.

## 1. Verdict

A sound batch, and cleaner going in than the last two waves. In every storyline each in-scope original scene and
variant has a version in each band, and every choice id and `set` matches the original. Each signature choice
still pays off: `a26-humbaba`, `a27-feather`, `a28-fairy`, `a29-sleeve`, `a30-order`, and `a31-rat`/`a31-corn`.
No Grove flag is written, and no Nubbin or animal speaks outside the canon exceptions. Every lesson already had an
approved standard, so this wave had none of the 145 missing standards the last one found. No `CHECKS` string
changed in any file.

The real problems were these:
- **The build.** `npx tsc` failed with TS2322 in both a26 files: `after: map[b.after]` is `number | undefined`
  under `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. Both files now use a small `mapped()` helper
  that returns a number and throws at load on an out-of-range index. `types.ts` and `tsconfig` are unchanged.
- **Lifted text.**
  - A26 had about fifteen reader lines (four in sprout), inherited from `atlas-a26.ts`, that track the copyrighted
    George and Speiser translations. Among them were Siduri's stock speech, "whatever we do is wind" and "bread fit
    for a god".
  - A28's Sky-god speech borrowed Gail Haley's epithets, and a near-verbatim Rattray opening was in the reader.
  - A27 had two close paraphrases of Zimmern.
  - A31 had a near variant of the banned grief line. "Grief is love with nowhere to go" itself appears nowhere.
  - No lyrics or song titles anywhere, A29 included.
- **Wrong facts and sums.**
  - Morla as a tortoise (she is a turtle).
  - A27's nest count.
  - A29's "five words" (there are nine).
  - "Dried clay is waterproof" in A31.
  - A disputed moth fact taught as settled in A28.
  - Emet stressed "EH-met" (it is eh-MET).
  - "Mem, from the middle" in five places in A30, now "near the middle" or "one from the middle", framed as the old
    teachers' saying.
  - A25's writer-added story numbers (9:25, eighteen pebbles, twelve tents and others) contradict neither the
    original nor the novel, and every sum is right. One distance sum was recast in miles to fit the
    thousand-miles road.
- **Death said as sleep or absence.** A26 had "he will not wake up" and "A guardian is gone", and A30 had "as if
  from a nap". All are now said plainly.
- **Safeguarding.**
  - A29: you now "don't promise anything" to Jinu instead of keeping quiet, and the sword is no longer "at his
    throat".
  - A30: the child no longer lights the lantern (the flame rule from the last wave).
  - A28: the tricks are never sold as good.
- **Continuity and diegesis.**
  - Things shown before they happen: A25's candle in the mirror, and A30's "Why truth?" before truth is named.
  - Sprout gaps where lines had been cut: A26's handprint, A27's riddle answer and Sindokht's reply, A31's corn
    and Xquic.
  - Variant "done" scenes that read wrongly after a variant: A26's sleeping Nubbin, A28's buttercup and beaming
    Nubbin.
  - A30 had two maths lessons in a row on the help path, hidden by a mis-tagged heart-rate sum.
- **Caps and splitter damage.** A31 had 55 three-sentence reader narration lines. Grown-up prompts were split
  inside brackets in A26, A27, A30 and A31.
- **The known items.**
  - **A26 retitle:** "Bread and Barley" is kept. It is consistent with every line, and the barley drink is
    historically true.
  - **The a27 timer warning:** a false positive (a science fact, not a chore), so the wording is kept.
  - **The pa2 pronoun warnings:** outside this batch.
  - **A25's closing:** it now stands alone. It says a whole land can begin again from the grain, and it promises
    no later scene.
  - **A29's coverage:** full, as intended.

All of these are fixed. After the fixes, the three checks end at 0 problems.

Counts: **47 must fix (47 done), 119 should fix (119 done)**.

| storyline | must fix | should fix |
| --- | --- | --- |
| A25 The Nothing (reader only, Part One) | 3/3 | 14/14 |
| A26 The Wall of Uruk | 24/24 | 23/23 |
| A27 The White-Haired Prince | 2/2 | 21/21 |
| A28 The Box of Stories | 3/3 | 9/9 |
| A29 The Honmoon (reader only) | 2/2 | 12/12 |
| A30 The Word on the Brow | 8/8 | 21/21 |
| A31 The Hero Twins | 5/5 | 19/19 |
| **Total** | **47/47** | **119/119** |

The A26 must-fix count includes the coordinator's tsc fix.

### Per storyline

**A25 The Nothing (reader only, Part One).** A careful, warm and well-built file. The structure was already sound:
- all 74 quest scenes of A25-1 to A25-14 and the one Part One variant (`a25-13-empress-ash`) have a version;
- every choice id matches the original, Part One sets no flags, and no Grove flag is written;
- every lesson had an approved standard, and no two lessons of the same domain are adjacent on either play path;
- line caps hold;
- `CHECKS` is correctly empty, because there are no `do` lessons.

Artax's death is one plain, gentle scene ("Artax has died. His body has stopped, and it will not start again."), followed by a think question and comfort, and it is never recapped. Gmork's end is offscreen. There is no quote from Ende, any translation or the films. "Grief is love with nowhere to go" and its variants are absent. The real problems were small:
- a wrong animal (Morla is a turtle in the novel and the main script, not a tortoise);
- a candle shown in the mirror at A25-9 that Bastian only lights at A25-11;
- replies that refer to things that haven't happened yet;
- one quest (A25-13) without a `sel` lesson;
- two glossary entries pointing at the wrong scene or none;
- a distance sum whose units and speed didn't fit the "thousand miles" road;
- a close that still talked about "this part of the story".

Every writer-added story number was checked against the original and the novel, and every sum is right.

**A26 The Wall of Uruk.** A warm, careful pair with a sound structure. Every one of the 96 quest scenes and 15 variants has a version in both bands. Choice ids and `set` flags match the original, no Grove flag is written, nobody speaks who mustn't, and every lesson already had an approved standard. The Humbaba choice (`a26-humbaba`) still pays off in A26-13, A26-14 and A26-18 on all three paths. The sprout band leaves out "agreed" with `defaultChoice: 'silent'`. The real problems were these:
- lifted wording: the reader inherited about fifteen lines from `atlas-a26.ts` that closely follow the copyrighted modern translations (George, Speiser), not Thompson. These include Siduri's stock speech, "Men's days are numbered… whatever we do is wind", the goats with triplets, "bread fit for a god", "In grief, and in pain, in cold and in heat", sleep "like a mist" and "For whom did I…". The sprout band had four of them.
- death said through sleep or absence: "he will not wake up", "He cannot wake up", "A guardian is gone", "I will lie down, and not get up".
- broken continuity: the sprout closing lesson says Gilgamesh pressed the handprint; both Moss variants of `a26-16-siduri-done` ask about a sleeping Nubbin that never fell asleep; the reader has Gilgamesh "carry" a star he could not lift.
- prompts that the split helper broke across lines inside brackets or quotes, plus some small fact slips.

All of these are fixed. The "Bread and Barley" retitle is consistent and right for the band (see For Maor). The page is now in good shape for the adviser packets.

**A27 The White-Haired Prince.** A gentle, well-made pair that honours the outline and the care notes. Every scene and
variant has a version in both bands (123 each). The choice ids and the `a27-feather` flags match the original, and no
Grove flag is written. Only the Simurgh and Shahnameh people speak; the chicks, the horses, Sable and your Nubbin never
do. Every lesson already had an approved standard. The albinism lesson (`a27-01-birth`) is plain, kind and accurate, and
it is kept apart from greying with age. The abandonment is age-fit: help is promised at once in sprout, and the wrong
is named as wrong in both bands. The feather pays off in A27-9, A27-14 and A27-17 on all three paths. The fixes were
small: one wrong sum (reader, the nest count after Zal leaves), a split that broke a grown-up prompt in two (sprout),
sprout continuity gaps where lines had been cut (why Zal refuses Mehrab, Sindokht's missing reply, the riddle answer,
the word "shame"), two close paraphrases of Zimmern in the reader, a few loose facts and replies, and glossary entries
pointing at the wrong scene.

**A28 The Box of Stories.** A strong, careful pair. Both bands follow the page closely: every scene and variant is there, the signature `a28-fairy` choice pays off in A28-9, A28-10 and A28-12 on all three paths, and Wisp's trade still lands in the last story. The writer had already handled the hard parts well. The tricks are never sold as good: each one is followed by a lesson on truth, promises or how the tricked one feels, and the reader band asks real think questions about fairness. The enslavement sentence is short and plain, Nyame is treated with respect, and every creature goes up alive. The structural checks were clean before any fix. What I found:
- the reader's Sky-god speech borrowed the epithets from Gail Haley's copyrighted *A Story, A Story*;
- a moth fact taught as settled when it is disputed;
- a near-verbatim Rattray opening in the reader;
- two "done" scenes, inherited from the original, that read wrongly after a variant (the buttercup after Wisp's trade, and "your Nubbin is beaming" after the Wisp and driven stories);
- some small sprout continuity and read-aloud slips.

All are fixed.

**A29 The Honmoon (reader only).** A strong, careful page that already did most things right. Every original scene and all 17 variants have a version. The choice ids and the `a29-sleeve` sets match the original, no Grove flag is written, and nobody speaks who mustn't (Derpy, Sussie, your Nubbin and Sable never do; Luna is a person). Every lesson has an approved standard, and no ELOF code is used. There are no same-domain pairs on any of the 18 play paths. The rules hold too: no lyrics, no song titles (the harsh song and Rumi's song stay nameless, "gold" is never used), no film quotes, and the softening is kept ("cheer", never "soul"). The Korean facts check out: the peninsula, Seoul on the Han, hangul about 580 years ago, han + geul, hanji from paper mulberry, the Joseon gat of horsehair and bamboo, the jeoseung saja, the city wall (more than 600 years, about 18 km, four hills), Namsan, ondol, maru, jangma, and minhwa's magpie and tiger. Every sum is right. The fixes were small:
- one wrong count, the margin note's "five words" (it has nine);
- a lesson quoting a line that only plays in one later choice, and a reply that leans on a line from one choice only;
- a few loose science replies;
- one age-fit softening (the sword "at his throat");
- one secrecy beat, where you now "don't promise anything" to Jinu.
The closing makes sense on all three sleeve paths, and the grief line for Jinu ("gone, and he will not come back", then comfort) is right for 7 to 10.

**A30 The Word on the Brow.** A careful, warm pair that handles a hard legend well. Nothing was missing from the
structure: all 54 quest scenes and 20 variants have a version in each band. Every choice id and the `a30-order`
sets match the original, no Grove flag is written, Ori leads, and neither the Nubbin nor Yossele speaks. Every lesson
had an approved standard, and reader uses no ELOF code. The care notes hold: the Name is never written, the rumour
is never named (in reader, "it always finds people who want it" is as close as it gets to the blood-libel
background, which is right for 7 to 10), nobody is hurt, the clay "falls, soft as sand", and the genizah is treated
with respect. The real faults were in the Hebrew and in continuity:
- "mem, from the middle" in five places;
- the stress of emet given as "EH-met" (it is eh-MET; the hataf vowel can't take stress);
- a "Why truth?" choice offered before anyone had said the word was truth;
- a heart-rate multiplication tagged `health`, which hid two maths lessons in a row on the help path;
- three grown-up prompts cut in half across their brackets by the sprout splitter.

A handful of wording fixes followed for safeguarding (the child no longer lights the lantern), for the
no-spell care note ("says one word" is now "Stop"), and for sleep-as-death (the clay now opens its eyes instead of
waking "as if from a nap").

**A31 The Hero Twins.** A careful, warm and respectful pair. Its structure was already sound: all 81 original scenes and variants have a version in each band, the choice ids and the `a31-rat` and `a31-corn` flags match, no Grove flag is written, every lesson has an approved code (no ELOF in reader), the sprout CHECKS match the `do` checks, and the corn payoff lands on both branches. Every sum is right, including the Maya numbers (7 is a bar and two dots, 20 × 20 = 400, five dots make a bar). No same-domain pair was found on any of the 12 paths (go or stay, three rat choices, ribbons on or off, Hazel's note), with the mid-scene inserts placed where the main script plays them. The kitchen is a real kitchen today, there is no ceremony on the page, and no Spence, Tedlock or Christenson line is quoted. The real problems were:
- one wrong fact (dried clay "is waterproof"), and one reply that claims something the script never shows;
- three continuity gaps where lines had been cut or never said (the corn's "dries" half in sprout, Xquic's "My heart is mine" in sprout, "the house that fell" in reader);
- a near variant of the banned grief line;
- 55 reader narration lines of three sentences, several lessons that gave away their own answer, and the usual sprout splitter breaks inside brackets.

All of these are fixed.

## 2. Must fix

### A25 The Nothing (reader only, Part One)

File: `src/content/edu-a25-reader.ts`. I read it in full against `docs/canon.md`, `EDU-STYLE.md`, `STYLE.md`, the original `atlas-a25.ts`, the outline (`docs/more-stories.md`, "## A25. The Nothing") and the writer log `docs/logs/edu-a25.md`. A script imported both modules and printed every scene in play order with its lessons inline. It checked:
- caps: 160 characters, 30 words, two sentences of narration;
- that every lesson has a standard, and that lesson ids are unique and `after` indices are in range;
- same-domain adjacency on the base path and with the Ash variant swapped in;
- that choice ids match the original's and that no original scene in scope has a `set`;
- missing and extra scenes, the grief line and em dashes (none);
- that each glossary word appears in its scene.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a25-reader | `a25-06-shell-l1` | Wrong fact against the source: "The mountain is a giant tortoise’s shell." Morla is a turtle in the outline, in the main script's notes ("Morla is a giant turtle whose shell is the mountain") and in the novel, and she lives in a swamp. | "The mountain is a giant turtle’s shell. A real turtle or tortoise can’t step out of its shell like a house." / "Turtles and tortoises are among the longest-lived animals. Some giant tortoises live well over a hundred years." The skill and parent note now say "turtle’s or tortoise’s". | done |
| edu-a25-reader | `a25-09-mirror` #3, `a25-09-mirror-l1` prompt, `a25-09-mirror-done-l1` best option | Continuity: the mirror shows "the candle", the lesson says "reading by candlelight" and the best note lists "candle". But Bastian only pockets the candle at A25-3 and lights it at A25-11 ("In the attic, Bastian has lit his candle"). The main script carries the same slip. | "…the round boy, the blanket, the gym mats." / "…a round boy in a blanket, reading in the half-dark." / "“Round boy, grey blanket, gym mats, attic, reading.”" | done |
| edu-a25-reader | `a25-09-mirror-l1`, "As nobody special" reply | "Atreyu stopped and stared at him, and you wrote him down." The lesson plays before you write in the notebook (`a25-09-mirror-done`). | "Atreyu stopped and stared at him, and so did you. He is somebody." | done |

### A26 The Wall of Uruk

Date: 2026-10-17. Brief: `docs/briefs/review.md` (fix mode), batch edu-atlas-3. Files: `src/content/edu-a26-sprout.ts` and `src/content/edu-a26-reader.ts`. I read them in full against `docs/canon.md`, `EDU-STYLE.md`, `STYLE.md`, `atlas-a26.ts`, the outline (`docs/more-stories.md`, "## A26.") and the writer log `docs/logs/edu-a26.md`. To read them, I used a scratch dump of every scene in play order with the lessons inline. Nothing is committed, and no other file was touched. I left the `mapped()` helper alone.

Scripted checks, run before and after the fixes, over both bands and every variant:
- **Coverage:** 111 scenes each, with ids matching `<band>:<of>`.
- **Choices:** ids and `set` flags match the original, and `defaultChoice` is valid.
- **Line caps:** no line over 160 characters, no sprout line over 14 words, no reader line over 30, and no narration line over two sentences. This covers lesson prompts, replies and choice `then` lines.
- **Lessons:** lesson ids are unique, every `after` is in range, every lesson has an approved standard, and no ELOF code appears in reader.
- **CHECKS:** sprout `CHECKS` equals its 11 `do` checks, and reader has none.
- **Domains:** no same-domain adjacency on the base path, and none with any variant swapped in.
- **Em dashes:** none.

All checks report 0 problems after the fixes. I also ran a manual pass for lifted text against the stock translations (George 1999, Speiser in ANET 1950, Thompson 1928, Kovacs).

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a26-sprout | `a26-18-complete-l1` (shared `COMPLETE_BEAT`, also in `-moss` and `-moss-spoke`) | "Gilgamesh pressed a handprint in a brick so he would be remembered." It was you and your Nubbin. | "You pressed your hand into a brick, so people will remember you." / "How do friends remember each other?" | done |
| edu-a26-sprout | `a26-16-siduri-done-moss` | The sleep lesson says "Your Nubbin is fast asleep", but this variant replaces the only line where the Nubbin falls asleep. | Added N "Your Nubbin climbs into your lap and falls fast asleep." as the last line, and set the lesson `after` from 5 to 6. | done |
| edu-a26-sprout | `a26-16-siduri#5` | "Eat. Wash. Dance. Hug the people who hold your hand." is Siduri's stock list, ending on the stock "the little one who holds your hand". | SI "Eat your supper. Wash your face. Sing, and hug the people you love." | done |
| edu-a26-sprout | `a26-12-complete#2` | "Who is the finest of men?" is George's line almost word for word. | GI "Whose names do we shout tonight?" | done |
| edu-a26-sprout | `a26-17-test#2` | "Sleep comes over him like a mist" is the stock simile. | "He sits down on the sand. At once, he is fast asleep." | done |
| edu-a26-sprout | `a26-17-snake-done#0`, `a26-17-snake-done-hazel#0` | "For whom did I walk so far?" is the stock "For whom…" lament. | GI "All that way. And a snake has it." | done |
| edu-a26-sprout | `a26-14-death#5` | "That means he will not wake up" ties death to sleep, right after "closes his eyes" (EDU-STYLE, "Hard things"). | "That means his body will not start again. It is not like sleeping." | done |
| edu-a26-sprout | `a26-17-snake-done-hazel` | The split helper cut Hazel's note mid-quote: "You know the hand. “Lost the plant." / "Kept the wall. Good trade.”" | Three lines: "You know the hand." / "“Lost the plant. Kept the wall.”" / "“Good trade.”". Lesson `after` 4 → 6, still after "H.". | done |
| edu-a26-reader | `a26-16-siduri#5–6` and `-l1` prompt | Siduri's speech is the stock translation: "why do you run so far? The gods kept life for themselves, when they made people. You will not find it." / "So eat. Wash your hair. Dance… be glad of the people who are beside you". | SI "Gilgamesh, when people were first made, dying was made with them. Everyone gets a share of it, even kings." / SI "So have your supper while it is hot. Get clean. Sing badly, if you like. And look properly at whoever is next to you." Prompt: "Siduri says: eat, get clean, sing, and look properly at the people next to you." Theme and options unchanged. | done |
| edu-a26-reader | `a26-08-plan#1` | "Men’s days are numbered, and whatever we do is wind" is Speiser's "numbered are their days; whatever they achieve is but the wind". | GI "Enkidu. Only the gods last for ever. A person gets a short life, and then it is over." | done |
| edu-a26-reader | `a26-08-plan#4` | "Humbaba’s voice is the flood. His breath is fire." is the stock "his roar is the Deluge, his mouth is fire". | "…Humbaba is as old as the mountains. When he shouts, the cedars bend." | done |
| edu-a26-reader | `a26-11-offer#2` | "Your goats will have triplets. Your ewes, twins." is George's line. | "Kings will kneel to you. Your flocks will double every spring. You will want for nothing." | done |
| edu-a26-reader | `a26-12-complete#1` | "Who is the finest of men? Who is the bravest?" is George and Speiser. | GI "Whose names do we shout tonight? Whose?" | done |
| edu-a26-reader | `a26-13-door#4–5` | "bread fit for a god" is the stock phrase. Also, "when you go, he will weep for you" is a going-away euphemism for death. | "She gave you your first bread. She gave you clothes to wear." / "…And when you die, he will weep for you…" | done |
| edu-a26-reader | `a26-13-door-done#0–1` | Enkidu's blessing follows the stock text ("Let kings love you, and princes… gold and lapis"). "Let nobody ever leave you" also reverses the source. | "Shamhat. I take it back. I wish you a warm house, and a full table, and friends at your door." / "You found me in the grass and brought me home. I bless you." | done |
| edu-a26-reader | `a26-15-gate#5` | "In grief, and in pain, in cold and in heat" is Speiser's line. | GI "I will go anyway. Nothing in your dark is worse than what I carry. Open the gate." | done |
| edu-a26-reader | `a26-17-test#2` | "sleep breathes over him like a mist" is the stock simile. | "…Before he has finished yawning, he is fast asleep." | done |
| edu-a26-reader | `a26-17-plant#2` | "a secret of the gods… thorns like a rose" is the stock wording. | UT "Gilgamesh. I will tell you something hidden. There is a plant at the bottom of the sea, and its thorns are sharp." | done |
| edu-a26-reader | `a26-17-snake-done#0`, `a26-17-snake-done-hazel#0` | "For whom did I tear my hands? For whom did I walk all that way?" is the stock lament. | GI "All that way. My hands torn to pieces. And now a snake has it. I have given it to a snake." | done |
| edu-a26-reader | `a26-10-plea-done#3` | "A guardian is gone". Humbaba's death is never said plainly in the reader; "gone" is the word EDU-STYLE rules out. | "Humbaba has died, and it cannot be undone. Whatever you chose, it is all right to feel uneasy." | done |
| edu-a26-reader | `a26-14-death#8` | "He cannot wake up." ties death to sleep, after "closes his eyes". | "It is not like sleep." | done |
| edu-a26-reader | `a26-14-statue#5` | "I will lie down, and not get up, for ever" is the stock "Shall I not lie down like him, never to rise", and it ties death to lying down. | GI "I am going to die too, like him. One day my body will stop, and that will be the end of me. I cannot bear it." | done |
| edu-a26-reader | `a26-16-siduri-done-moss` | The same continuity gap as sprout: the sleep lesson has no sleeping Nubbin. | Added N "Your Nubbin climbs into your lap and goes to sleep there, warm and heavy." as the last line, and set the lesson `after` from 5 to 6. | done |
| edu-a26-reader, edu-a26-sprout | `sc()`, lessons `.map` (reader 161, sprout 189) | `npx tsc --noEmit -p .` fails with TS2322: `after: map[b.after]` is possibly undefined, not assignable under `exactOptionalPropertyTypes` (with `noUncheckedIndexedAccess`). | Added `mapped(map, at, of)` in both files, which returns the split index and throws at load if the index is out of range; the lessons now use `after: mapped(map, b.after, of)`. `types.ts` and `tsconfig` unchanged. Fixed by the coordinator. | done |

### A27 The White-Haired Prince

Date: 2026-10-17. Brief: `docs/briefs/review.md` (fix mode). Files: `src/content/edu-a27-sprout.ts` and
`src/content/edu-a27-reader.ts`. I read both in full, through a scratch dump of every scene in play order with the
lessons inline. I checked them against `docs/canon.md`, `EDU-STYLE.md`, `STYLE.md`, `atlas-a27.ts`, the outline
(`docs/more-stories.md`, "## A27.") and the writer log `docs/logs/edu-a27.md`. Nothing is committed, and no other file
was touched.

Scripted checks, run on both bands before and after the fixes:
- Coverage: every original scene and variant has a version, with no extras.
- Choices: ids and `set` flags match the original on every scene.
- Lines: none over 160 characters, no sprout line over 14 words, no reader line over 30, and no narration line over
  two sentences. No em dashes.
- Lessons: every lesson has a standard, and there is no ELOF code in reader. Lesson ids are unique and every `after`
  is in range.
- Sprout `CHECKS` matches the 19 `do` checks exactly. Reader has no `do` lessons and an empty `CHECKS`.
- Same-domain neighbours: none on any of 36 play paths (told, sat or night; margin note on or off; Corvin line on or
  off; Sable none, bonded or wary).
- Brackets and quotes: balanced in every line.
- Glossary: every entry's word appears in its scene.

Quotes: no Zimmern or Ferdowsi quote is left in either band. Hazel's margin note is the game's own S24 text, kept
exactly. There are no song lyrics, and no "Grief is love with nowhere to go" or anything like it.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a27-reader | `a27-08-complete-l1` | "Before he leaves there are 4 chicks, Zal, you and your Nubbin: 7 in all. After Zal goes, how many are in the nest?" → 6, and the reply says "Only one person leaves: Zal." That's wrong: the Simurgh carries you and your Nubbin down with him (`a27-09-descent`, "carries you both down"). | "There are 4 chicks, Zal, you and your Nubbin in the nest: 7 in all. When Zal, you and your Nubbin go down, how many are left?" Answers: 4 (best, "7 take away 3 is 4: the four chicks."); 6 ("That takes away only Zal. You and your Nubbin go too…"); 10 ("Nobody joins, so the number goes down…"). Skill and parent note updated. | done |
| edu-a27-sprout | `a27-14-complete-l1` | The line splitter broke the grown-up prompt at the full stop inside the brackets, leaving "(Pretend to eat one." and "Yum!)" as two lines with unbalanced brackets. | Two lines instead: "People there love their juicy red seeds." / "(Pretend to eat one: yum!)" | done |

### A28 The Box of Stories

Files: `src/content/edu-a28-sprout.ts`, `src/content/edu-a28-reader.ts`. I read them in full, through a scratch dump of every scene in play order with the lessons inline, against `docs/canon.md`, `EDU-STYLE.md`, `STYLE.md`, `atlas-a28.ts`, the outline (`docs/more-stories.md`, "## A28.") and `docs/logs/edu-a28.md`. Scripted checks over both bands, run before and after the fixes:
- every original scene and variant has a version (78 quest scenes + 11 variants);
- choice ids and `set` flags match the original on every scene;
- no line is over 160 characters, no sprout line is over 14 words and no reader line is over 30;
- no narration line runs over two sentences;
- every lesson has an approved standard, and the reader band has no ELOF codes;
- every `after` is in range;
- sprout `CHECKS` matches its `do` checks exactly;
- no two lessons of the same domain are adjacent on any of the 18 paths (Wisp none/came/driven × fairy left/freed/sat × margin note on/off).

Nothing is committed, and no other file was touched.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a28-reader.ts | reader:a28-02-price #7–8, and the lesson reply in reader:a28-02-price-done | "the hornets that sting like fire", "the fairy whom nobody sees" (and "teeth like spears") echo Gail E. Haley's epithets in *A Story, A Story* (1970, in copyright). That is lifted text, and the Learning Grove allows none. | "Mmoboro, the hornets, the whole cross nest of them" / "Osebo, the leopard, the strongest hunter in the forest. And bring me Mmoatia, the fairy who is never caught." The reply now says "Mmoboro means hornets, the ones in the paper nest." | done |
| edu-a28-reader.ts | reader:a28-12-return, lesson 1 | It taught as fact that "moths steer by the Moon, and bright lights muddle them". That is a disputed hypothesis (recent work points to a dorsal-light response instead), so it is not a well-established fact. | Replaced with a 2-PS1-4 science lesson that grows from the low fire: "Could the ash ever turn back into wood?" Burning cannot be undone, unlike melting. It is still science, so the domain order holds. | done |
| both | sprout:/reader:a28-08-debt-done | On the Wisp path (a28-08-debt-wisp replaces a28-08-debt), this done scene still says Ananse tucks "the buttercup" into his hatband, but no buttercup was traded on that path. The original has the same bug. | Made it path-neutral. Sprout: "Ananse sits back on his step, very pleased. / Buttercups grow all round the step." Reader: "Ananse sits back against his door, looking very pleased with his side of the bargain. So, oddly, does everyone else. / Buttercups grow thick round his step…". The petal and pollination lessons are unchanged. | done |

### A29 The Honmoon (reader only)

Date: 2026-10-17. File: `src/content/edu-a29-reader.ts`. I read it in full, as a play-order dump, against `docs/canon.md`, `EDU-STYLE.md`, `STYLE.md`, the original `atlas-a29.ts`, the outline (`docs/more-stories.md`, "## A29. The Honmoon") and the writer log `docs/logs/edu-a29.md`. A script in the scratch folder:
- printed every scene in play order with lessons inline;
- checked the caps (160 characters, 30 words, two narration sentences) on lines, prompts, replies and choices;
- checked for missing and ELOF standards and for `after` indexes out of range;
- counted lessons per scene (1–2);
- matched every scene id, choice id and `set` with the original;
- checked same-domain adjacency over all 18 paths (Sable none/hid/heel × the three sleeve paths × margin note on/off, with the Luna scene);
- compared `CHECKS` with the `do` checks used (none; `CHECKS` is `[]`).
Every scripted check was clean before and after the fixes. Separately, I grepped for the film's song titles and well-known lyric phrases, and found none.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a29-reader | `a29-01-margin-hazel-l1` prompt | Wrong count: "Hazel’s note is only five words long." "Never been. Nova says it’s all singing. I’d hum." is nine words. | "Hazel’s note is only nine words long. What does it show about her?" | done |
| edu-a29-reader | `a29-12-find-away-l1` (prompt and the "Guess" reply) | The lesson plays after line 4, before the choice, but quotes "which kind of kind", which Rumi says only in the later `yes` choice; on `quiet` the child never hears it. The reply "Guessing can work, as it did for you" assumes an outcome. | Prompt: "You looked away that night to be kind, and Rumi still isn’t sure what you saw. How can you find out what kind of kindness someone needs?" Reply: "Guessing can work, but it can also leave someone unsure. Asking is more certain." | done |

### A30 The Word on the Brow

Date: 2026-10-17. Files: `src/content/edu-a30-sprout.ts`, `src/content/edu-a30-reader.ts`. Read in full against
`docs/canon.md`, `docs/briefs/review.md`, `EDU-STYLE.md`, `STYLE.md`, `atlas-a30.ts`, the outline
(`docs/more-stories.md`, `## A30.` to the next section) and `docs/logs/edu-a30.md`. A scratch script loaded both
modules and the original, then printed every scene in play order with its lessons inline. It checked:
- coverage of every scene and variant;
- `EduScene` ids, choice ids and `set` flags against the original;
- a standard on every lesson, and no ELOF code in reader;
- lesson ids and `after` indices;
- line caps (160 characters; 14 words in sprout, 30 in reader) and narration of at most two sentences;
- em dashes and US spellings;
- that CHECKS matches the `do` checks;
- same-domain adjacency on all 30 play paths (3 orders × cinder × keptStone × s24Done × the three Grove scenes,
  with keptStone only when cinder is off).

Every scripted check passed before and after the fixes. The faults below came from reading the dump. Both files
are LF before and after (0 carriage returns, counted in Python).

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a30-sprout | `a30-06-letters` #4 | "Mem, מ, from the middle." Mem is the 13th of 22 letters, not the middle one. | "Mem, מ, from near the middle. And tav, ת, the very last letter." | done |
| edu-a30-sprout | `a30-grove-tile-quiet-l1`, Mem reply | "Mem is in the middle." | "Mem is near the middle. Tav is the last." | done |
| edu-a30-sprout | file header | Says alef, mem and tav are "the first, the middle and the last" letters. | "…the first, a letter near the middle (the old teachers’ “middle”; mem is the 13th of 22) and the last…" | done |
| edu-a30-reader | `a30-06-letters` #4 | "Mem, מ, from the middle of the alef-bet." | "Mem, מ, from near the middle of the alef-bet." | done |
| edu-a30-reader | `a30-06-letters` #6 | "The first letter, the middle and the last." states it as fact. | "Emet. Truth. The first letter, one from the middle, and the last. The old teachers liked that: truth stands on all of it." (the old teaching stays in the old teachers' mouths) | done |
| edu-a30-reader | `a30-06-letters` #7 | Pronunciation "EH-met" puts the stress on the hataf vowel. אֱמֶת is stressed on the last syllable. | "Say it: eh-MET." | done |
| edu-a30-sprout | `a30-06-tellings` #7, choice `why` | The choice "Why truth?" comes before anyone says the word is truth (it is first named in `a30-06-letters`). | "Here, I will write one plain word on his brow: truth. A word anyone can read. Three letters." | done |
| edu-a30-reader | `a30-06-tellings` #5, choice `why` | Same continuity gap. | "Here it will be a plain word on the brow, one that anyone may read: the word for truth. Three letters. Watch which ones." | done |

### A31 The Hero Twins

Files: `src/content/edu-a31-sprout.ts` and `src/content/edu-a31-reader.ts`. Read in full: both files (as a scripted dump of every scene in play order with lessons inline), the original `src/content/atlas-a31.ts` (header, A31-1, A31-9, the quest notes and every variant), the A31 outline in `docs/more-stories.md`, the writer log `docs/logs/edu-a31.md`, `docs/canon.md`, `docs/briefs/review.md`, `EDU-STYLE.md` and `STYLE.md`. Scripted checks (run before and after the fixes): every original scene has a version in both bands; choice ids and `set` flags match; every lesson `after` is in range; every lesson has a standard, with no ELOF in reader; line caps (160 characters, 14 words in sprout, 30 in reader); narration of at most two sentences, lesson lines included; em dashes and US spellings; same-domain adjacency on all 12 paths with the inserts in place; and sprout CHECKS against the `do` checks.

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a31-reader | `a31-09-roof-l1`, best option and reply | Wrong fact: "Clay is waterproof once it dries… That is how many jars have been mended." Unfired clay softens again in water, and the band's own `a31-08-earthquake-l1` says so ("Sun-dried clay can be soaked soft again"). | Option: "Press a lump of wet clay firmly into the hole." Reply: "Yes: wet clay is sticky and packs tight into a small hole, so it stops the leak. It fixes the cause, not just the drip." | done |
| edu-a31-reader | `a31-03-road-l1`, best reply | "Missing someone is a kind of love." is a near variant of the banned "Grief is love with nowhere to go". | "Yes: a big feeling is easier to carry when it is shared. Saying their name and telling their stories keeps them close." | done |
| edu-a31-reader | `a31-12-dark-stay-l1`, third reply | The reply says Xmucane "notices, and says so in the morning". She never does: `a31-12-dark-done-stay` has only "Still green." | "Perhaps a little, but Xmucane notices you there all night. Sitting together helps both of you." | done |
| edu-a31-sprout | `a31-10-corn` #2 | The splitter's source line kept only the "stays green" half ("If the corn stays green, we are doing well."), so Xmucane's "And if it does both?" points at a "dries" half the band never says. The stay branch depends on it: the corn dries in `a31-14-oven-stay`, and Xquic quotes "if it does both" there. | "If the corn goes dry, we are in trouble. If it stays green, we are doing well." (two lines; the lesson's `after` follows through the split map). | done |
| edu-a31-sprout | `a31-04-owls` #5 | "Then do not. My heart is mine." answers a demand for her heart that sprout leaves out (the father wants "proof, to show she was gone"). | "Then do not. We will make him some pretend proof." The sap heart that follows is the pretend proof. | done |

## 3. Should fix

### A25 The Nothing (reader only, Part One)

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a25-reader | `a25-14-complete` #1 | The close. "This is where this part of the story ends" hints at parts the band never reaches. "A boy has given a name, and the Empress has her new one" is clumsy. And after "This is all that’s left of it", a child who never plays Part Two isn't told that Fantastica will come back. | "This is where your page ends." / "A boy has given the Empress her new name, and from one grain of sand a whole land can begin again." It is hopeful and complete, and it promises no further scene. The lesson still follows the vial line. | done |
| edu-a25-reader | A25-13 (`a25-13-empress-done`) | The quest had no `sel` lesson (EDU-STYLE: at least one per quest; the writer log admits the gap). | Added a first lesson, `reader:a25-13-empress-done-l1`: an ask, `sel`, `CASEL: Self-awareness`, on being kind to yourself after a setback. Its prompt is "Atreyu thinks he failed. The Empress says he has done more than anyone." The best answer is "I tried my hardest, and that counts." The sleep notice is now `-l2`. Order: social studies, sel, science, literacy, science, maths, literacy, then sel in A25-14. Nothing is adjacent, with or without the Ash variant. | done |
| edu-a25-reader | `a25-03-maps-done-l1` | "Cairon gallops 25 kilometres every day", stated as fact. At that speed, the "thousand miles" river road of `a25-03-maps` would take about 64 days, against "the road east goes on for days". It also mixes km into a page that uses miles. | "Say Cairon gallops 100 miles every day." The sum is now 4 × 100 = 400 miles. The distractors 104 and 300 have matching replies, and the skill and note are updated. | done |
| edu-a25-reader | `a25-01-attic-l1`, best reply | "For each colour, the paper has to pass through the printing press once more." Modern presses print several colours in one pass. | "On a simple press, each colour needs its own run through the machine." | done |
| edu-a25-reader | `a25-09-sphinx-l1` | The auto-splitter cut a quoted note mid-quote: "“In ancient Egypt… a human head." / "The Great Sphinx at Giza is about 4,500 years old.”" | Two lines, each in its own quotation marks. | done |
| edu-a25-reader | `a25-14-name-l2` prompt | "Mond" + "Kind" doesn't make "Mondenkind", and a sharp reader will notice. | "Joined, with a little “en” in the middle, they make Mondenkind. What name does that give in English?" | done |
| edu-a25-reader | `a25-05-artax` #2 | "When he walks on, he doesn’t look back, because Artax asked him not to", but Artax only says "Don’t stay". This is inherited from the main script. | Artax: "Go on without me, and don’t look back. If you stay, it will get you too." | done |
| edu-a25-reader | `a25-07-bargain-l1`, second option | The option ("Ygramul never really needed to give anything") and its reply ("hard to say it is a gift if the price is high") don't match. | Option: "It isn’t fair: a real gift shouldn’t come with a price." Reply: "That’s a fair answer. It’s hard to call something a gift when the price is so high." | done |
| edu-a25-reader | `a25-11-flight-l1` #2 | "When they are equal, it glides along level." Gliding loses height; level flight is when lift equals weight. | "…it flies along level." | done |
| edu-a25-reader | `a25-11-storm-l1`, best reply | "You and your Nubbin did just that." The lesson plays before you hold on (line 4). | "That is just what Falkor is telling you to do." | done |
| edu-a25-reader | `a25-11-search-l1`, third reply | "Falkor is tired and not singing." The lesson plays before "you notice he isn’t singing any more". | "That’s a wise answer. Even a luckdragon gets tired. Resting can be part of not giving up." | done |
| edu-a25-reader | `a25-13-climb-l1` prompt | "The Old Man will write “the traveller bows” as you bow." This presumes the `bow` choice, which follows the lesson; on `stay` he writes something else. | "The Old Man writes everything as it happens. If you bow, he writes “the traveller bows”, not “I bow”." | done |
| edu-a25-reader | `a25-13-empress-ash` #7 | The Nubbin "comes out from behind your knee" (#11), but the variant never put it there. The base scene does. This is inherited from the main variant. | "Then she looks past Atreyu, at your Nubbin, who is half-hidden behind your knee, and then at you, for a long moment." | done |
| edu-a25-reader | glossary | "oracle" pointed to `a25-10-voice`, where the word never appears; it first appears in `a25-06-ask-done` ("The Southern Oracle"). "pavilion" pointed to `a25-13-climb`, and the word is in no scene. | Moved "oracle" to A25-6's glossary with scene `a25-06-ask-done`. Removed "pavilion". The glossary now has 27 entries. | done |

### A26 The Wall of Uruk

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a26-sprout | `a26-03-complete-l1`, `a26-08-complete-l1`, `a26-10-forest-l1`, `a26-17-tale-l1` | The split helper broke three-sentence prompts mid-bracket, e.g. "(On Nova’s map, find the wiggly blue line. That is the river." / "The road runs beside it.)" | Split by hand: the grown-up prompt alone in brackets, the rest as plain lines. "(Clap the parts of the king’s name: Gil-ga-mesh.)" / "How many claps? Three!". "(Find Lebanon on Nova’s map.)" / "Cedar trees grow on its mountains. The forest in the story may have been like it." The 1872 note now has no brackets. | done |
| edu-a26-sprout | `a26-01-tablet#4` | "People pressed those marks into wet clay", said of the lapis (stone) tablet. | "That is writing! People pressed marks like these into wet clay with a reed." | done |
| edu-a26-sprout | `a26-10-plea-done-l1` | A cheerful "What is wind?" quiz sits between "the winds drop" and "Humbaba has died". The tone is wrong for ages 3–6. | Replaced with a health ask after the comfort line (`after` 5): "Something sad happened. What helps when we feel sad?" Options: "A cuddle, and telling a grown-up" (best) and "Pretending it did not happen". Standard `CASEL: Self-awareness`. Domains around it are still sel → health → maths. | done |
| edu-a26-sprout | `a26-17-tale#7` | "He sent out a dove… Then a raven". The epic's swallow is skipped, so "then" is wrong. | "He sent out a dove, then a swallow. Both came back. Then a raven, which did not." | done |
| edu-a26-sprout | `a26-18-foot-done#0` | "taken from their places, a long time ago" contradicts the outline's care note (looted "in living memory"; the reader says so). | "Some tablets were taken away from their places." | done |
| edu-a26-sprout | `a26-15-gate#5` | "It is dark for twelve double-hours." "Double-hours" means nothing at 3–6. | "It is dark for a long, long way." (The count to twelve that follows is unchanged.) | done |
| edu-a26-reader | `a26-01-page-l1` (and `-moss`) | "both run south through Iraq towards the sea". They run south-east, to the Gulf. | "…both run south-east through Iraq to the sea." | done |
| edu-a26-reader | `a26-01-tablet#4` | "A scribe pressed a reed into wet clay", said of a lapis tablet. | "That is cuneiform. Scribes pressed a reed into wet clay, and every press left a wedge. This one was cut into stone, to last." | done |
| edu-a26-reader | `a26-01-tablet-l1` | "One scribe might use a single reed for years" is unverified. "Wedges in different groups meant different words" is half true: signs stood for words and for sounds. | "You can see the corner of the reed in every mark." / "Groups of wedges made signs, some for words and some for sounds. People wrote like this more than four thousand years ago." | done |
| edu-a26-reader | `a26-02-games-done-l1` | The prompt says "the first kind thing in a month". The woman said "since the new moon". | "…the first kind thing since the new moon." The reply says "for weeks". | done |
| edu-a26-reader | `a26-03-complete-l1`, `a26-10-forest-l1`, `a26-18-wall-done-l1`, `a26-17-snake-done-hazel-l1` | Brackets or quotes were split across two prompt lines by the helper. | Each split by hand so that every line closes its own bracket or quote. | done |
| edu-a26-reader | `a26-08-elders#4` | "a heart that never rests" is close to the stock "restless heart". | "Shamash, my son cannot sit still, and you made him so. Now he is going a long way, to a fight he does not know." | done |
| edu-a26-reader | `a26-09-fire#4` | "Did you call me? Why am I awake?" is the stock wording of the dream speech. | "Enkidu! Was that you? Something woke me, and I am cold all over. I dreamed a mountain fell on me…" | done |
| edu-a26-reader | `a26-12-fight#6` | "If I could reach you, I would do the same to you!" is the stock line, and a threat of what was softened offscreen. | EN "Go home! Leave our city alone! And take your storms with you!" | done |
| edu-a26-reader | `a26-09-watch` choice `you` | "I have got you up, keeping the fire." reads as garbled. | "I have you, sitting up with the fire." | done |
| edu-a26-reader | `a26-13-complete#1` | "as easily as he once carried a star in a dream". In `a26-06-cups` he could not lift it. | "as gently as he once held a star in a dream." | done |
| edu-a26-reader | `a26-13-door-l1` | "no Sunlight". | "no sunlight". | done |
| edu-a26-reader | `a26-14-statue-l1` | Think option "but the person is gone". | "but the person has died". | done |
| edu-a26-reader | `a26-15-road#2` | "Of lying down. Of not getting up." equates death with lying down and echoes the stock line. | "Now I am afraid of everything, and most of all of dying." | done |
| edu-a26-reader | `a26-17-tale#8` | "flat as a roof" is the stock simile. | "Then there was only water, flat and grey, as far as anyone could see." | done |
| edu-a26-reader | `a26-17-test-done#2` | Six loaf states listed for seven loaves ("hard, leathery, soggy, furry, grey, and one still warm"). | "Then he sees the row: dry, leathery, soggy, furry with mould, grey, fresh, and one still warm." (seven, as in the epic) | done |
| edu-a26-reader | `a26-18-wall#7` | "And the temple, which is mine." The temple is Ishtar's, half a square mile. | "Town, orchards and clay-pits, a square mile of each. And half a square mile for Ishtar’s temple. That is what I made." (The lesson prompt already defines a square mile.) | done |
| edu-a26-reader | `a26-18-complete-l1` (shared, also in both Moss variants) | "came home to a wall and a handprint in a brick" reads as if the print were his. "More than four thousand years later" overstates it: the Standard Babylonian epic is about 3,200 years old, the Old Babylonian about 3,800 and the Sumerian poems about 4,100. | "…and came home to his wall, where you pressed your hand into a brick." / "You are reading it about four thousand years later." | done |

### A27 The White-Haired Prince

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a27-sprout | `a27-02-order-done-l1` | "Shame begins with sh…" uses a word the sprout scenes never say. Sprout's Sam only says he is afraid people will laugh. | Now built on the quiet hall: "Shh! Shh begins with sh, sh, sh. Which starts like shh: ship or sun?", with the replies changed to match. | done |
| edu-a27-sprout | `a27-04-feed`, choice `chick` | "The smallest chick gets least." reads oddly aloud. | "The smallest chick is always at the back. It swallows the fig, very politely." | done |
| edu-a27-sprout | `a27-06-dream` #4 | The rider says "Your beard is white too." and the narrator repeats it straight away: "Sam's beard is white now, too." | "Sam touches his own beard. It is white, like his son's hair." | done |
| edu-a27-sprout | `a27-11-tents` | Zal turns Mehrab down with no reason given. Later, `a27-14-embassy` asks about blaming someone "for what their grandpa did", a family past sprout never mentions. | Added a narrator line after Zal's refusal: "Long ago, a cruel king was in Mehrab's family. Zal's father would not like it." The embassy prompt now reads "…for what their family did long ago?" (Zahhak is a distant ancestor, not a grandfather). | done |
| edu-a27-sprout | `a27-14-stars` #1, `a27-14-stars-done` #0 | "I have two hard choices." names choices it never gives, and "It is silly" is sharper than the main game's "folly", which is about a hard match, not about being silly. | "A girl from Kabul. What will come of it? What should I do?" and "It is a big surprise, but I gave my word. So it shall be done." | done |
| edu-a27-sprout | `a27-15-riddles`, all three choices | Zal answers "The moon!", but the `moon` choice says "You were nearly right". The original's answer is the days of the month, so here the line contradicts itself. | Zal now says "The days of the month! The moon gets thin, then comes back round." in all three choices, as in the original. | done |
| edu-a27-sprout | `a27-16-arrival` | Sam's "Anything you like! Name it." answers a question nobody asked, because Sindokht's line was cut. | Added SK (happy): "Hide her? She is our sun. What will you give to see her?" between Sam's two lines. | done |
| edu-a27-reader | `a27-02-rocks-l1` replies | "The Red Sea is far to the west." It is south-west. "The Black Sea is further west, past Turkey." It lies north of Turkey. | "…far to the south-west." / "…further west, north of Turkey." | done |
| edu-a27-reader | `a27-04-feed`, choice `chick` | "The smallest chick, who got least at breakfast" contradicts line 6 just before it ("When the four chicks have had equal shares"), which the 25 ÷ 4 lesson sets up. | "The smallest chick, who is always last to the figs, takes it very politely and swallows it whole." | done |
| edu-a27-reader | `a27-04-night-l1` prompt | "In the morning there is frost on top of her wings…" plays at night, and `a27-04-night-done` then opens with the same morning line. | "On nights like this, frost can form on top of her wings but not underneath. Feathers insulate: they trap a layer of air." | done |
| edu-a27-reader | `a27-05-words-l1`, best reply | "We meet one in the next scene." The next scene is `a27-05-words-done`; the caravan comes after that. | "We will meet one soon." | done |
| edu-a27-reader | `a27-08-feather` #4 | "He weeps. He has never met a single person, though he has learned how people talk." keeps the shape of Zimmern's lifted line 3 ("…never gazed upon men, though he had learned their speech"). The Learning Grove allows no quotes, and this is a close paraphrase. | "Tears run down his face. Apart from you, he has never met a single person." | done |
| edu-a27-reader | `a27-08-feather` #3 | "…try your fortune in it" sounds like a translation, and nobody has checked it against Zimmern (see For Maor). | "Go down and see the world, my son, and find your own way in it." | done |
| edu-a27-reader | `a27-13-roof` #2 | "Here is a rope with no flaw in it" is Zimmern's "cord without flaw", only lightly reworded (the main script's notes say so). | "Here is a rope that will hold you. Take hold and climb." | done |
| edu-a27-reader | `a27-08-feather-done-l1`, option "Sun, wood and sand" | The reply "Close to a camp-fire list, but…" doesn't explain anything. | "Wood is a fuel, but sun and sand are not what a fire needs. The three needs are fuel, heat and air." | done |
| edu-a27-reader | `a27-09-descent-done-l1`, best reply | "Nothing balances it, so the Nubbin keeps going." But it stops at Sam's boot. | "Yes. Gravity pulls everything towards the Earth. On a slope nothing balances that pull, so the Nubbin rolls until something stops it: Sam's boot." | done |
| edu-a27-reader | `a27-10-banquet-l1` | "Your Nubbin eats a dish by itself, and then two more." The lesson plays before the choice to "stop your Nubbin starting a second dish", so it tells the outcome in advance and clashes with that choice. | "If your Nubbin ends up eating three dishes by itself, how many people's worth of rice is that?" (the sum, 24, is unchanged). | done |
| edu-a27-reader | `a27-14-letter-l1` prompt | It sums up the letter as "you left me, but I forgive you, so come", but the letter never says "I forgive you", and the lesson plays before "Come with me now". | "Zal's letter says hard things: you left me on a mountain, and now I ask you for one thing." (the sat and night variants already use neutral wording). | done |
| edu-a27-reader | `a27-14-stars-l1` | It calls "caught between fire and water" an idiom. It isn't an English idiom: it's the source's image. | "It is a figure of speech, like “between a rock and a hard place”." Skill, wrong-answer reply and note are now "figure of speech" / "figurative language". | done |
| edu-a27-reader | glossary `nameh`, `humble` | These words never appear in their entries' scenes (`a27-14-letter`, `a27-07-foot`), so they would never be underlined (`eduGlossary` underlines only in the entry's scene). "Humble" is first used at `a27-11-praise` ("Generous and humble"). | `nameh` → `a27-01-page-done`. `humble` → `a27-11-praise`, with the meaning "Not proud or boastful about yourself. Zal bows low, as the Simurgh did." | done |
| edu-a27-reader | glossary `mobed`, `brazier` | Each entry points at a later scene than the one where the word first comes up (`a27-06-dream-done` "Call the mobeds"; `a27-01-birth` "by the brazier"). | Moved to `a27-06-dream-done` and `a27-01-birth`. | done |

### A28 The Box of Stories

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a28-reader.ts | reader:a28-09-sweep #1 | "Long ago, they say, the spider Kwaku Ananse was there," is the original's childLines line, but it is a near-verbatim rearrangement of Rattray's "They say that Kwaku, the Spider, was there". The Learning Grove takes no quotes from the originals. | "Long ago, they say, there was a spider called Kwaku Ananse," (the sprout already used this wording). | done |
| edu-a28-reader.ts | reader:a28-04-rain lesson, best reply | "A trick works best when it fits what the victim can already see and feel" reads as advice on how to fool people. | "Yes. They are wet, so “it is raining” sounds right to them. / Noticing why someone was fooled helps you spot a trick yourself." | done |
| both | sprout:/reader:a28-12-last-done | "Your Nubbin beams / is beaming… the children laugh anyway" also plays after a28-12-last-wisp (Wisp leaves "carrying something full") and a28-12-last-driven (an open, sad ending). It only fits the base story. | Sprout: "The children are quiet for a moment. Then they stretch and yawn." Reader: "For a moment nobody says anything. Then the children stretch, and yawn, and shuffle closer to the fire." | done |
| edu-a28-sprout.ts | sprout:a28-10-complete #4 | The lesson asks "why is the spider bald?", but the sprout scene never says "bald". It ended "That is why spiders keep to the grass today." | "That is why the spider is bald, and keeps to the grass." | done |
| edu-a28-sprout.ts | sprout:a28-08-debt #5 | Ananse says "It has a beginning, a middle and an end. They are all the same word." in the scene, then says it again in the `fair` choice. | The scene line is now "All the stories are about me now. Very handy." (the original's idea). The `fair` choice keeps the joke. | done |
| edu-a28-sprout.ts | sprout:a28-04-stopper and sprout:a28-10-funeral-done, do lessons | The 14-word splitter broke a bracketed grown-up prompt across two lines ("(Breathe in slowly. Breathe out slowly." / "Do it three times.)", and the same with the drum tap). | "(Breathe in slowly, then out slowly, three times.)" and "(Tap a table with your hand. Can you feel it shake a tiny bit?)" | done |
| edu-a28-sprout.ts | sprout:a28-05-fall, choice `look` | "spoil heap" is not a word a 3–6-year-old knows, and sprout has no glossary. | "Look anywhere but at the pile of earth." (The id is unchanged.) | done |
| edu-a28-sprout.ts | sprout:a28-07-complete lesson prompt | "A python lies on a warm shelf. Why? Snakes need warmth. Where would a python like to lie?" gives the answer away and asks a "Why?" that the options don't answer. | "Snakes need to keep warm. Where would a python like to lie?" | done |
| edu-a28-sprout.ts | sprout:a28-12-tell #5 | The storyteller keeps "the chin", but the sprout retelling said "she went up proud" and never mentioned a chin. | "She went up to the sky caught. But she went up with her chin high." (This echoes the chin in a28-06-wait/left and a28-06-complete.) | done |

### A29 The Honmoon (reader only)

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a29-reader | `a29-01-scroll` #2 | The auto-splitter cut Nova's card mid-quote into two narrator lines (“This is Korea. / Find it on the big map…”), which reads as broken quotation. | One line: "A card from Nova is tucked into the page. It says to find Korea on the big map before you step in." | done |
| edu-a29-reader | `a29-02-complete-l1`, "Pink light is hotter" reply | "Colour does not tell you how hot a light is" is false in general (red-hot vs white-hot). | "A filter doesn’t make light hotter. It only picks which colours get through." | done |
| edu-a29-reader | `a29-03-kitchen-l1`, "5 cups" reply | "Five is how many people there are": four people and a Nubbin. | "Five is how many of you there are, but the hunters want two each." | done |
| edu-a29-reader | `a29-03-kitchen-done` #0 | Hangul is described as "curls and lines and circles". Hangul has no curls, and the next lesson teaches its shapes. | "…neat little blocks of writing, all lines, corners and small circles." | done |
| edu-a29-reader | `a29-05-debut-l1`, best reply | "A device that changes one kind of energy into another is a tiny power converter." is a made-up term, and wrong for a screen. | "Lots of devices change energy from one form into another. A screen changes electricity into light." | done |
| edu-a29-reader | `a29-06-fight` #3 | "Her sword is at his throat": a sharper image than this band needs. The outline says no one is hurt on screen. | "Her sword is up between them, and his hand has caught her wrist." | done |
| edu-a29-reader | `a29-07-complete-l1`, best reply | "Rumi laughed because she knew you": she has known you a few days. | "Rumi laughed because she had guessed, and because the break was small." | done |
| edu-a29-reader | `a29-10-complete` #1 | Safeguarding. A grown-up puts a finger to his lips and says "You didn’t hear that", and "You don’t say anything" models agreeing to keep the secret. | "You don’t promise anything. You hand him the umbrella, because he hasn’t got one." The beat and the lesson still work. | done |
| edu-a29-reader | `a29-13-courtyard-l1`, best reply | "A metaphor says one thing is another thing" doesn't describe "the half of me you could look at", which is figurative but not an X-is-Y metaphor. | "Words used as a picture, not exactly, are called figurative language. They make a feeling clear." (L.4.5 still fits.) | done |
| edu-a29-reader | `a29-13-complete-l1`, "Maybe nothing" reply | "She stopped being a fist and started pouring tea" leans on "slowly stop being fists", which plays only in the `wait2` choice. | "But Celine noticed. She came back with tea." | done |
| edu-a29-reader | `a29-15-strike-l1`, "Rumi’s kindness" reply | "Rumi hid nothing from him, and he did not hide from her" is false: Jinu told her a kinder version of his story (A29-8), and she hid her marks from everyone. | "Rumi offered him a way out, and nobody had done that in four hundred years." | done |
| edu-a29-reader | `a29-16-complete-l1`, "Someone who accepts" reply | "Rumi found that in three friends, and a nubbin.": "nubbin" is lower case, and "three friends" is muddled (Mira, Zoey and you). | "Rumi found that in Mira and Zoey, and in you." | done |

### A30 The Word on the Brow

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a30-reader | `a30-10-fetch-l1` | A maths lesson (30 × 4 = 120 beats) tagged `health`. On the help path, cinder off, it follows `a30-10-grow-help`'s 4 × 3, so two multiplications sit in a row. | Now a real health ask, still 4-LS1-1: "Your heart is thumping after the run. Why does a heart beat faster when you run?" Best: "Working muscles need more oxygen, so it pumps blood faster". Other options: "It is trying to stop" and "It is tired of beating". The header's fact list is updated to match. | done |
| edu-a30-sprout | `a30-04-lantern-l1` lines | The splitter cut the prompt across its brackets ("…straight. (Blow softly on your hand." / "Feel the air move.)"). | "The air is still, so the flame stands straight." / "(Blow softly on your hand, and feel the air move.)" | done |
| edu-a30-sprout | `a30-06-letters` #8–9 | The same bracket split ("(Put your finger on the right. Slide it left." / "Touch alef…)"). | One line: "(Put your finger on the right, and slide it left: alef, mem, tav.)" | done |
| edu-a30-sprout | `a30-10-psalm-l1` lines | The same bracket split ("…How many claps?" / "Two!)"). | "(Clap the word Sabbath with me: Sab-bath.)" / "(How many claps? Two!)" | done |
| edu-a30-sprout | `a30-04-lantern` #0 | "You carry the lantern up to the loft window and light it." The child-identified Keeper lights a flame in the 3–6 band (last wave's candle fixes, A22). | "Dvora lights the lantern, and you carry it up to the loft window." | done |
| edu-a30-reader | `a30-04-lantern` #0; `a30-04-complete` #0 | Same, and the complete scene said "You lit the lantern". | "Dvora lights the lantern, and you carry it up to the loft window. The flame stands up straight in the still air."; "The lantern was lit at six in the evening." (the 6-hour sum is unchanged) | done |
| edu-a30-sprout | `a30-07-flood` #7 | "The rabbi says one word, and Yossele puts the bucket down." Next to a story about a word on the brow, it reads as a magic word (care note: no spell). | "Then the rabbi says, “Stop,” and Yossele puts the bucket down." | done |
| edu-a30-reader | `a30-07-flood` #8 | Same. | "…with his sleeves wet to the elbow, and says, “Stop.” Yossele sets the bucket down." | done |
| edu-a30-sprout | `a30-09-rest` #4 | "He reaches up and rubs out…" just after Yossele lies down, so "he" reads as Yossele. | "The rabbi rubs out the first letter, the alef. It comes away like flour." | done |
| edu-a30-reader | `a30-09-rest` #3 | Same. | "The rabbi reaches over and rubs out the first letter, the alef…" | done |
| edu-a30-reader | `a30-09-rest-done` #0 | "Yossele sits up as if from a nap." Two lines earlier the band was told met means "dead", and this ties dead to sleep (EDU-STYLE, Hard things). | "…the rabbi writes the alef again. Yossele opens his eyes and sits up." | done |
| edu-a30-reader | `a30-02-question` #4 | "In Hebrew, “unshaped clay” is one old word: golem." The psalm's word is golmi ("my golem"), and it means an unshaped mass, not clay. | "The Hebrew word there is golmi, “my golem”: me, a lump not yet shaped. So every one of us was clay once, and somebody saw it." | done |
| edu-a30-reader | `a30-02-question` #3 | "There’s a song in the Bible that says…" introduces a paraphrased verse as a song, in a band with a no-lyrics rule. | "There’s a psalm in the Bible, a kind of prayer, that says: before I was even made, you saw me." | done |
| edu-a30-sprout | `a30-02-question` #3 | "An old song says: before I was made, you saw me." (the same) | "An old prayer says: before I was made, you saw me." | done |
| edu-a30-sprout | `a30-13-bench` #5 | "Long ago, in a town called Chełm…" The Chełm rabbi (died 1583) was nearly Loew's contemporary, and it is a legend. | "In Chełm, people say, a rabbi made a clay man before me. It grew and grew." (the original's framing) | done |
| edu-a30-sprout | `a30-grove-tile-cinder` #2 | Moss's "She would have liked him" never names Cinder in the sprout scene, so a 3 to 6 year old can't tell who "she" is. | "Cinder would have liked him. That is the trouble with her." | done |
| edu-a30-sprout | `a30-13-order-sit-l1`, best option | "He put Nubbin down gently" (missing "your"). | "He put your Nubbin down gently" | done |
| edu-a30-sprout | `a30-05-clay` #4 | "Isaac goes down to the river with his hands, but it is slow." The child isn't told what he is carrying. | "The wind dries the clay. Isaac carries water up from the river in cupped hands, but it is slow." | done |
| edu-a30-reader | `a30-07-flood-done-l1`, wrong replies | "she thanks you" (she doesn't), and "She says you will need it again in this house" quotes a line that plays after the lesson. | "Look again: she gives you a gift. That is kindness, not anger."; "Look again: she has just handed you a gift. People don’t give aprons to guests they want gone." | done |
| edu-a30-reader | `a30-11-table-l1`, "A loud party with music" | The reply "The Sabbath table is peaceful and quiet" misdescribes a living custom: families sing at the table. | Option "A loud party with a band"; reply "Not a band. The Sabbath table has blessings and shared bread, and families often sing together." | done |
| edu-a30-sprout | `a30-02-study-done` #1 | "Like dough that must rest before you cut it." It is bread you rest before cutting (the reader band has it right). | "It is like bread that must rest before you cut it." | done |

### A31 The Hero Twins

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-a31-reader | 55 narrator lines in lessons (prompts, notice lines and replies) across `01-page-done`, `01-complete`, `02-court`, `03-road`, `04-xquic`, `04-owls`, `04-sap`, `04-complete`, `05-door`, `05-complete`, `06-born`, `06-complete`, `07-macaw`, `08-earthquake`, `09-night`, `09-roof`, `10-relay`, `10-corn`, `10-complete`, `11-lords`, `12-dark-done`, `12-complete`, `13-rat-coati`, `13-game`, `14-river`, `15-dancers`, `15-curtain`, `margin-hazel`, `16-rise`, `16-ribbons`, `17-hearth`, `17-ball`, `13-rat-court`, `11-lords-stay`, `12-dark-done-stay`, `13-game-stay`, `14-oven-stay`, `14-river-stay`, `15-curtain-stay`, `16-rise-stay`, `17-complete-stay` | Three or four sentences, over the two-sentence cap. Most are a "Yes." or "That's a fair answer." in front of two sentences. | Merged to two sentences. Examples: "Yes: refusing is brave, and finding another way is wise. The owls do both."; "Four owls fly away, and each owl has two wings. How many wings is that altogether?"; the One Monkey prompt is now "One Monkey wants the babies put outside, because they cry and he is composing. What does that tell us about him?"; the macaw notice is now "A bird's beak is light, strong and shaped for its food; a macaw's curved beak cracks nuts. Inside, a muscular stomach called the gizzard does the grinding." Two weak replies were reworded on the way: `02-court-l1` "Nearly. Count on from 7 by five" is now "One too many: count on five from 7, and you get 8, 9, 10, 11, 12."; `17-hearth-l1` "The girl would say it works anyway, since the girl has stopped asking" is now "Still, it works, because the girl stops asking." | done |
| edu-a31-reader | `a31-07-complete` #5 | The grandmother says "Seven is a bar and two dots" one line before the lesson asks how to write 7. | "Seven Macaw's name has a seven in it. The Maya wrote their numbers with dots and bars." (The prompt still explains dot = 1 and bar = 5.) | done |
| edu-a31-reader | `a31-08-complete` #3–4 | "Twenty twenties made four hundred. So the Four Hundred Boys are twenty groups of twenty." comes just before the lesson asks for 20 × 20. | #3 "The Maya counted in twenties, not tens: fingers and toes."; #4 "Now: somebody has to go down to Xibalba. You know who." | done |
| edu-a31-reader | `a31-12-dark-done-l2`, prompt | The prompt repeats line 3 word for word ("The twins were shut in at six in the evening…"). | "How many hours were the twins shut in the Dark House?" | done |
| edu-a31-reader | `a31-10-relay-l1` | The lesson plays after #3, before the toad, snake and falcon appear, yet it asks about "five messengers". It also says "telephone" (the US name for the game). | Moved to after #5 (the falcon coughs up the snake), so all five messengers have been seen (the owls, louse, toad, snake and falcon). The reply now says "as anyone who has played a whispering game knows". | done |
| edu-a31-reader | `a31-16-rise` #4 | "the boys from the house that fell": the band never says a house fell (A31-8 says only that Zipacna was cruel to them and they died). | "You'd know them anywhere: the Four Hundred Boys." | done |
| edu-a31-reader | `a31-11-road-stay-l1` #0 | "We soak the dry corn in water with a little lime first": a British child reads "lime" as the fruit. | "We soak the dry corn in water with lime, a white powder made from stone, not the fruit. It softens the corn and makes it better for you." | done |
| both | `a31-15-dancers`, line spoken by `a31-lords` | The lords speak about themselves in the third person: "The lords want a show." | Reader: "Who are those two? Bring them here. We want a show." Sprout: "Who are those two? We want a show!" | done |
| both | `a31-15-complete` #1 (reader) and #2 (sprout) | "The lords could never play ball again, and had to do the chores instead." is the main script's `CHILD_FORBIDDEN` line, a close paraphrase of Spence's lifted fragment ("The game of ball was forbidden them, they were to perform menial tasks"). The Learning Grove takes nothing from the original texts. | "After that, the lords had no more ball games. They had jobs to do, like everyone else." | done |
| both | `a31-01-ribbons` | The girl asks "Why's it got two colours?", and the lesson then counts three (gold, silver, green). | Sprout #0: "The girl sees your Nubbin's ribbons: gold and silver, sewn with green thread." Reader #2: "She counts the colours anyway, thread and all, under her breath: gold, silver, green, and round again." | done |
| edu-a31-reader | `a31-16-ribbons` #3 | "the same on both sides" contradicts the ribbon (gold on one side of the stitching, silver on the other). | "Each ribbon is a long rectangle with green stitches down its middle." | done |
| edu-a31-reader | `a31-08-crab-l1`, second line | "That is why ours has a stick for a claw and a lot of dignity" assumes the `claw` choice before it is made, and repeats that choice's "a lot of dignity". | "It walks on the other eight, mostly sideways. Ours will have to manage with leaves and a stick." | done |
| edu-a31-reader | glossary `ravine` | The scene is given as `a31-08-zipacna`, but the word first appears in `a31-08-crab` #6. | Scene changed to `a31-08-crab`. | done |
| edu-a31-sprout | `a31-03-road-l1`, prompt | "Xmucane will miss her sons." names Xmucane before the band has said who she is (`02-complete` only says "their mum"). | "Their mum, Xmucane, will miss them. What helps when we miss someone?" | done |
| edu-a31-sprout | `a31-13-game-l1`, prompt | "The lords wanted to kick Hunahpu's hat." It is a hip-and-shoulder game, and the scene says "use that hat for a ball". | "The lords wanted to play ball with Hunahpu's hat." | done |
| edu-a31-sprout | `a31-15-curtain-stay-l1`, prompt | "she knows some of the people who begged" plays before the falcon says anyone begged (#5). | "Xquic is quiet. She grew up down there, and she knows people there. How might she feel?" | done |
| edu-a31-sprout | `07-healers-l1`, `08-complete-l1`, `12-houses-stay-l1`, `15-dancers-stay-l1`, `17-ball-l1` | The splitter breaks a bracketed prompt across two lines ("Macaw. (Clap the parts: ma-caw." / "How many claps? Two!)", and the same in the other four). | Each is written as closed brackets: "Macaw. (Clap the parts: ma-caw.)" + "(How many claps? Two!)"; "(Count all your fingers and toes together: ten and ten.)" + "(How many? Twenty!)"; "(Count six leaves on one ear. Count seven on the other.)" + "(Which ear has more?)"; "A leaf a day!" + "(Count three days of leaves: 1, 2, 3. How many leaves?)"; "(Each part is a half.)" + "(One half for you, and one half for your Nubbin.)". | done |
| edu-a31-sprout | `a31-margin-hazel` #2–3 | Hazel's note (15 words) is split into "“Two boys who won by being cheeky to the grumpy lords." and "My kind of boys.”", with the quotation marks broken across two lines. | One line of 14 words: "“Two boys who won by being cheeky to grumpy lords. My kind of boys.”" | done |
| edu-a31-sprout | `a31-17-complete` #3, `a31-17-complete-stay` #3 | Each narrator line says the lesson's fact one beat before the grandmother says it again ("Long ago, people in this part of the world first grew corn."; "Green corn is still growing. Later it turns golden."). | "It is light, and it rattles a little when you lift it." and "It is soft, and it smells like a field after rain." | done |

## 4. Nice to have

### A25 The Nothing (reader only, Part One)

- `a25-01-run`, the clock at 9:25 and "School began at nine": the novel gives no time as far as I know. German schools usually start at eight, but nothing in the original contradicts nine. I left it.
- The maths test comes from the main script (`a25-01-run`). I can't confirm it is in the novel rather than the 1984 film. It is harmless either way.
- `a25-09-mirror-done`, the notebook line ("It seems like the sort of thing somebody ought to write down") sets up the Part Two mirror choice, which this band never reaches. Like A16's snake, it is harmless and faithful, and it reads as a small, complete beat on its own.
- `a25-14-dark`, "It will grow from your wishes. Go carefully. Wishes are hungrier than they look." This points towards Part Two. It is the book's own Part One beat, the think question makes it stand alone, and the new close resolves it hopefully, so it stays.
- The file header's "facts used" note still says "a tortoise’s shell"; it is still true. The writer log is now out of date (see For Maor).

### A26 The Wall of Uruk

- **Reader `a26-10-plea-done-l1`** still asks "What causes wind?" just before "Humbaba has died". That is fine for ages 7–10, but it could move after the last line or become a feelings beat, as in sprout.
- **Repeated beats.** Reader does 3 × 4 = 12 twice (`a26-01-complete`, `a26-06-cups`). Both bands teach "cities grow beside rivers" twice (`a26-01-page`, `a26-07-gate`).
- **Sprout `a26-02-games-done-l1`** says "The boy’s mum smiles at you". On the `water` path she has never been shown; only `sit` names her.
- **Sprout `a26-13-door-done-l1`.** The best option is "He said sorry and thank you", but he says "I take it back. I bless you." Better: "He took back his cross words and said kind ones."
- **Sprout `a26-08-plan-done#0`** pours the water again on the `water` choice path.
- **Reader `a26-07-gate-done#1`.** "Five people follow at the gate." reads oddly. Better: "Five people follow you from the gate."
- **Reader `a26-12-bull#1`.** "the river leaps its banks": in the epic the Euphrates drops. This is harmless licence.
- **Reader `a26-04-road-l1`** asks about sharing the dates before Shamhat says she will share them. The line could move ahead of the lesson.
- **Sprout `a26-10-forest#6`.** "a face like wool" is odd (the reader has "a coil of wool").

### A27 The White-Haired Prince

- **Repeated beats in sprout.**
  - "Parents feed and keep their young safe" (1-LS1-2) is taught twice, at `a27-04-complete` and `a27-06-mobeds`.
  - Two moon riddles come back to back, at `a27-15-riddles-l1` and `a27-15-hardest-l1` ("I am round, and I light the
    night"). The second could be a different riddle.
- **Domains that don't match their codes.** Sprout `a27-09-road-done` (art, ELOF Mathematics) and reader
  `a27-09-road-done` (art, 4.OA.C.5) are colour-pattern maths. Reader `a27-16-arrival` (art, 4.G.A.3) is symmetry.
  Sprout `a27-16-arrival` (art, K.G.A.2) is shapes. Relabelling them maths would cause no clash with their
  neighbours, but the writer kept art so the art count held.
- **Stretched codes.** Reader `a27-04-complete-l1` (babies learn to speak by copying) and `a27-06-return-l1` (greying
  hair) both use 3-LS1-1, life cycles. That was the nearest approved code, and the writer log says so.
- **Two odd beats.** Sprout `a27-08-telling-l1` compares feet while the Simurgh sits down, which is a slightly random
  thing to compare. Sprout `a27-13-watch-l1` gives away its answer in the prompt ("Last comes morning. What comes
  last?").
- **The timer warning (content-check).** `timer? reader:a27-13-complete: Yes. Earth spins once a day.` is a false
  positive. It's a science fact about Earth's rotation, not a chore or a reset. I kept it word for word, as the brief
  asks.

### A28 The Box of Stories

- sprout:a28-07-mother-done counts "four climbers". On the Wisp path the art shows Wisp in your bag, so a child pointing at the picture may count five. The line names the four, so I left it.
- sprout and reader: the `cover` choice in a28-10-beans ("Step in front of him, so the cousin can't see") has the Keeper help hide a broken promise. It is comic and it fails ("the steam is tall"), and the lesson just before it is about keeping promises, so I kept it. A gentler label would be "Stand in front of him and hope."
- reader:a28-10-dance-done-freed: the heat lesson plays before the line that explains it ("The hot beans heated his hat…", now at the end). Moving that line up to sit before the lesson would read better.
- reader glossary "sap: carries water and food" is fine for the band, but the wound-sealing gum in a28-06-doll-done is closer to resin. One clause would cover both.

### A29 The Honmoon (reader only)

- `a29-05-debut` #7: Bobby's "Nobody debuts at the top of the chart." doesn't match the Saja Boys entering at 30th. It works as Bobby exaggerating; "Nobody debuts that high!" would be tidier. It is the same in the main script.
- `a29-08-story` #7: "A poor musician with a lute". A Korean adviser may prefer the instrument named, or "a stringed instrument", for a Joseon street player.
- `a29-02-complete` #1: Bobby's "Runner, you didn’t see any of this. What did you see?" is a comic employer's line to an adult runner. I left it, but it is the second "keep it quiet" beat on the page.
- `a29-03-pans-hid-l1` says spicy food upsets "a pet’s tummy". Sable is a stray Nubbin, not a pet; "a small creature’s tummy" would be more exact.
- `a29-14-complete-l1` (harmony) uses `4-PS3-2`; `1-PS4-1` (vibrations make sound) would also fit. Both are approved.
- `a29-03-kitchen-done-l1` (hangul) uses `RF.K.2`, as the writer noted. It is the nearest code for syllable blocks, and a K-level code in a reader lesson.

### A30 The Word on the Brow

- Sprout `a30-03-rumour-done`: line 2 "(Count the shutters with your finger…)" says the same thing as the `do` lesson
  straight after it, so the count is prompted twice. Cutting the line means moving the lesson's `after`.
- Sprout `a30-10-called`: "A baby is coming, and the family is worried." A 3 to 6 year old with a sibling on the
  way may take this to heart. "A baby is coming! The family would like you there." would be softer.
- Reader `a30-11-again-l1` (refrain): the synagogue repeats the whole psalm, which is not a refrain, so the link to
  the scene is loose. A lesson on why people repeat things that matter would fit better.
- Reader: the Old-New Synagogue is never named. One clause in `a30-11-again` #4 ("In the Old-New Synagogue, they
  say that psalm twice…") would give readers the real place, which still stands.
- Reader `a30-12-stars` #6, "the way you’d tuck in a child": a soft piece of sleep imagery for the clay. It is
  fine for 7 to 10. Watch it if the band rules tighten.
- Sprout `a30-10-fetch` says "Nobody is hurt" twice in three lines. It reads as deliberate reassurance; keep it
  unless it sounds odd read aloud.

### A31 The Hero Twins

- Sprout `a31-02-court-l1`: the splitter makes the bump count "Hip! Hip!" / "Shoulder! Hip!" / "Hip!". It still counts to five and reads as rhythm, so I left it.
- Both bands, `a31-09-tools-l1`: seeds "sleep… until water and sun wake them". Most seeds need water and warmth rather than light; "water and warmth" would be more exact. Left, as a fair simplification for the band.
- Reader `a31-02-fetch-l1`: "Left alone, it dries into something stretchy that bounces." It is true of latex. A line saying that Mesoamerican makers mixed it with morning-glory juice to make it bounce better would add a well-established fact.
- Reader `a31-08-complete-l1` uses `3.OA.A.3` (within 100) for 20 × 20 = 400. It is the nearest approved code, but it is out of its range.
- Sprout `a31-13-complete`, `a31-14-complete` (shared on the stay branch): "Far away… two ears of corn" reads oddly when you are sitting beside the corn. The line is the main script's, shared by both branches.
- Sprout `a31-17-complete`: the grandmother's voice gives the corn fact after you are back at your own table. It works as the page's voice-over, but a narrator line would sit better.

## 5. Best moments to protect

### A25 The Nothing (reader only, Part One)

- `a25-05-reeds`: "You don’t pick it up and you don’t pull. You sit down in the reeds beside it, close enough that it knows." The third rule lands without being named, and Atreyu's "I didn’t know you could just… wait like that" pays it off.
- `a25-05-artax`, plain and gentle: "The swamp closes over Artax, gently. Artax has died." The think question after it treats crying, remembering and sitting nearby all as fair.
- `a25-05-artax-done`: "Bastian is crying, and he doesn’t mind. Nobody can see him, and it was Artax."
- `a25-06-complete`: "He says it the way you might tie a bootlace: plainly, and then getting on with it." The simile lesson grows straight out of it.
- The mirror lesson's best answer, which treats the round boy as worth liking. This is the care note exactly.
- Falkor: "Luck is just not giving up for longer than the bad luck lasts."
- Uyulala's "I’m only a song, and a song can be sung again", with the metaphor lesson.
- `a25-13-empress`, where the Empress says your Nubbin's own name ("the one you gave it on the first night"). The Ash variant's "Everyone here hears a name when it is given back" is the S6 echo done quietly.

### A26 The Wall of Uruk

- Reader `a26-15-road`: "At night he lies awake and looks at the stars as if they owed him money."
- Reader `a26-17-snake-done-hazel`: "At the very edge of the sky, where a page would have its margin, there is writing in pencil".
- Sprout `a26-14-death-done`: "It makes no sound all night. It is the kindest thing anyone does." Moss's silent variant matches the outline exactly.
- Reader `a26-09-watch-l2`: the think question on Enkidu's kind untruth ("Honesty and kindness can pull in different directions").
- Reader `a26-07-complete`: Ninsun's "You were the star. You were the axe."
- Both bands, `a26-16-poles`: "Some work is a kind of talking."
- Reader `a26-18-foot-done`: the heritage lesson ("in living memory", return what was taken), which honours the care note without any war imagery.
- Sprout `a26-13-dream-l1`: "Secrets can make a scary feeling bigger. Telling helps." It is the right safeguarding line for a bad dream.

### A27 The White-Haired Prince

- Reader `a27-01-birth-l1`: albinism said plainly and kindly. It's inherited, you can't catch it, it's not a curse,
  sun hats and eyesight are named, and "they are just like everyone else". Sprout's "Their bodies make less colour.
  It is just how they are made." is the same lesson at age four.
- Reader `a27-09-oath-l1`: "Nothing about the hair changed. What changed was how Sam saw it." Theme 2 ("the grey
  stays, and can be loved") in two lines.
- The sat path. In `a27-17-fire-sat`, "You put it on. You sat with me at the edge until I could stand. Sit with me
  now." acts out the third rule without quoting it, and sprout keeps it whole.
- Reader `a27-margin-hazel-l1`: "What does “keeping” someone mean, beyond keeping them safe?" Theme 5, framed as a
  thinking question.
- Sprout `a27-14-kabul-done`: Rudaba says sorry for keeping the secret, and the lesson names a trusted grown-up. The
  hidden romance is handled safely for the age.
- Reader `a27-10-banquet-done-l1`: shah, shahanshah, Shahnameh and "checkmate" from shah mat. The lesson grows out of
  the page.
- Reader `a27-06-mobeds-l1`: a crocodile mother carrying her hatchlings in her mouth answers the mobed's own words.

### A28 The Box of Stories

- The three fairy retellings in A28-12 ("a true one / a clever one / a kind one"), and the reader's theme lessons that name each one ("Sometimes being there matters more than fixing things").
- reader:a28-11-step: "It is not a secret, and it is not the story: it is where the story stands." The sprout version is just as good in three short lines: taken by force, it was wrong, they kept their stories.
- The run of trick lessons that never excuse the trick: sprout "Being tricked feels bad", "Is that telling the truth?", "Is that keeping a promise?"; reader "A weakness can explain a trick without excusing it."
- Mmoatia handled with dignity in both bands: scared but never hurt, chin up, and she gets the last laugh with the hat on the freed path. The reader's Twi note treats "Mmoatia" correctly as the plural word for the little people of Akan belief.
- The Akan day-name lessons on both Wisp paths (Kwaku Wednesday, Kwame/Ama Saturday, Kofi Friday, Kwesi Sunday, Kwadwo Monday), all correct.

### A29 The Honmoon (reader only)

- Celine's courtyard and the sit: "Long enough for the courtyard stones to cool, and for a cat to cross the wall and change its mind." Then the tea with no thanks, and "I thought I was keeping her safe." The third rule is acted and never quoted.
- Rumi's "I didn’t lie. I just didn’t say." / Zoey: "That’s the same, Rumi. That’s exactly the same." This leads into a think question with three honest answers.
- Jinu's two versions of his story (A29-8 → A29-12), taught as a comparison lesson; the tell is "he looks away" when he says "to feed them".
- The jeoseung saja handled with respect, in Zoey's voice ("My grandma’s stories… They’re not the bad guys.").
- Jinu's end: "not falling, not hurt, only light, all at once, like a window opening", then "Jinu is gone, and he will not come back. That is plain, and it is all right to feel sad about it."
- The fan in daylight: "Is that rude?" / "It’s not rude. Look as long as you like." And "Zoey signs a forehead, with permission."
- Luna's hid line, new and good: "Hiding still counts as going."

### A30 The Word on the Brow

- Sprout and reader `a30-09-complete`: "You have good hands for it. Slow ones." (reader adds "Most people hurry the
  slow things."). The game's heart, said exactly where it lands.
- Reader `a30-03-rumour`: "I won’t tell you what it is. Saying it again is how it travels." It keeps the lie
  unnamed and teaches a child something true about rumours.
- Reader `a30-09-rest-l1`: "plane" to "lane" as the English parallel for emet to met.
- Reader `a30-13-bench`: "a thing that only obeys has no brakes of its own… And hands forget." Then the
  think question on who should hold the brakes.
- Both bands' `a30-10-grow-sit` / `a30-13-order-sit`: he put your Nubbin down first, the only thing in him nobody
  put there.
- Reader `a30-08-street-end`: the lanterns go away up the hill "the way lanterns go when people decide they are
  tired". This is protection with no violence.
- Sprout `a30-12-steps`: "So you sit down next to it, and wait." The third rule, shown without being named.

### A31 The Hero Twins

- The stay branch as a whole in both bands: "Still green." becoming a refrain the child joins, and Xmucane's "You watched the corn with me. That is the hard part."
- Sprout `a31-08-crab`: the Four Hundred Boys' death, said once and plainly ("That means their bodies stopped working"), with the stars straight after. This is exactly EDU-STYLE's model.
- Reader `a31-01-page-l1`: "It is not a language from a book. It is the one I scold you in." K'iche' is a living language, without a lecture.
- `a31-13-game`: "That is cheating!" / "That is squash." Both bands, untouched.
- `a31-14-complete`: "Did she know they would come back?" / "No. That is why it counts."
- `a31-17-hearth`: the grandmother's answer stays the outline's, and the reader think question leaves belief to the family.
- The sprout safeguarding replies: "Doing what we are told is good, but not when it is unkind." (owls) and "Ask a grown-up or a friend for help" (the hat).

## 6. For Maor

### Across the batch

- **Judgement calls on the known items:**
  - The A26 Learning Grove title "Bread and Barley" is kept in both bands. The main game keeps "Bread and Ale" and
    the seven jugs; that one is your call.
  - `timer? reader:a27-13-complete` is a false positive and stays. It will keep showing in `--warnings` runs.
    Consider teaching the regex that "once a day" after "spins" is a fact, not a timer.
  - A25 and A29 coverage matches `eduExempt`. The engine (CV4) must stop A25 after `a25-14-complete` in the
    Learning Grove.
- **No `CHECKS` strings changed** in any file. Lesson ids moved in A25: `reader:a25-13-empress-done-l1` is a new
  sel lesson, and the old one is now `-l2`.
- **Writer logs out of date:** all seven `docs/logs/edu-a25…a31.md`. Each still says "not registered yet", and the
  counts and facts changed here are listed per storyline below. They were not edited.
- **Main-script fixes are suggested for every page's `atlas-aNN.ts`** (below). None were edited. The ones that
  matter most:
  - A26's roughly fifteen lines that track George and Speiser, including the `a26-16-siduri#9` `childLines`.
  - A28's Haley epithets, and the Rattray `childLines` at `a28-09-sweep#1` and `a28-12-return#3`.
  - A30's "Mem, from the middle", stated as fact, and "Why truth?" offered before truth is named.
  - A29's sword "at his throat", and "You don't say anything" to Jinu.
  - A25's candle in the A25-9 mirror.
  - A31's "the house that fell", which has no setup.
- **Check against the film:** Rumi's "But only the half of me you could look at" (A29-13), in both the edu file
  and the main script.
- **Canon look:** A30's kept-stone "hums one word, safe". Can the Heartstone "say" a word under canon 17?
- **Advisers:**
  - An Iraqi adviser and an Assyriologist (A26).
  - Iranian and Afghan advisers, and an albinism organisation (A27).
  - Akan and Jamaican advisers (A28). They should confirm the kept closing formula, which follows Rattray's shape
    but is the tradition's own.
  - A Korean adviser (A29).
  - Jewish advisers, including a native-speaker recording of "eh-MET" (A30).
  - K'iche' Maya advisers (A31). They may prefer the K'iche' forms of "Wing", "Packstrap" and "Razor House".
  - Each has additions to their packet, listed below.
- **Licences:** none are needed for the edu files as they stand. Ende (A25) is recorded as approved, and the
  Derpy/Sussie licence for A29 is recorded as approved, but the `atlas-a29.ts` header still says a film licence is
  needed to ship.

### A25 The Nothing (reader only, Part One)

- **Does the close make sense without Part Two? Yes, now.** The page ends on the name, the dark, the grain and the vial. It now says outright that a whole land can begin again from the grain, so a child isn't left thinking Fantastica is gone. Nothing promises a later scene. Two lines still lean forward ("It will grow from your wishes", and the notebook line): both are faithful to the book, and both stand on their own. The engine (CV4) must still stop the page after `a25-14-complete` in the Learning Grove. `eduExempt` in content-check already matches (A25-15 onward, `a25-margin-hazel` and `a25-grove-ember`).
- **The story numbers against the original and the novel:**
  - The clock at 9:25: invented, and no conflict known.
  - Eighteen pebbles for six (four messengers, you and your Nubbin): consistent with the scene.
  - Twelve tents of three: invented.
  - Ten thousand miles: from the outline and the novel. The 10 miles a day is framed as "Say", and 1,000 days is "nearly three years", which agrees with "years of walking" in `a25-06-complete`.
  - Three weeks to the Dead Mountains: consistent with the main script's "Weeks pass".
  - Three rows of eight columns: invented.
  - Sunset at seven and sunrise at five: invented, and the night is 10 hours.
  - Cairon's distance is now a "Say" sum in miles.
  - Every sum is correct: 25 minutes, 18 ÷ 6 = 3, 4 × 100 = 400, 12 × 3 = 36, 10,000 ÷ 10 = 1,000, 3 × 7 = 21, 5 − 3 = 2, 3 × 8 = 24, 10 hours, and the 10th step of shop, attic, forest, tower is the attic.
- **No CHECKS strings changed.** `CHECKS` is still `[]`.
- **Lesson ids changed:** `reader:a25-13-empress-done-l1` is now the new sel lesson, and the sleep notice is `-l2`.
- **The writer log `docs/logs/edu-a25.md` is out of date:**
  - The counts are now 81 lessons, 23 sel, 27 glossary entries and 61 asks.
  - "A25-13 has none [sel]" is no longer true.
  - The tortoise wording should now say turtle.
  - The close's new wording.
  - The Cairon sum is now 4 × 100 miles.
  - "Not registered yet" is wrong: `edu.ts` imports the file, and `a25` is in `eduPacks`.
- **Fixes I suggest for the main script (`atlas-a25.ts`), not made:**
  - `a25-09-mirror` shows "the candle" before Bastian lights it (A25-11). The notebook text and the Part Two "candle" choice also say "by candlelight"; that works for Part Two, but the A25-9 mirror line doesn't fit.
  - In `a25-05-artax`, the narration says Artax asked him not to look back, but Artax only says "Don’t stay".
  - `a25-13-empress-ash` #10 has the Nubbin come "out from behind your knee" without ever putting it there.
- **Licences and advisers:** the outline records the licence for the emblem and cover art as approved on 2026-10-17. The adviser read of the sphinx note and of Atreyu's people (grassland note only, nothing invented about their culture) still stands, as the writer log asks.
- **No lifted text found.** I checked closely against what I know of Ende's text, the Manheim translation and the 1984 film (the Coreander, Morla, Gmork and Artax exchanges). No sentence is a quote or a close paraphrase. Names and plot facts (the Magnolia Pavilion, the egg-shaped house, "the Glory") are not text.

### A26 The Wall of Uruk

- **"Bread and Ale" → "Bread and Barley" (Learning Grove only).** My judgement: keep it.
  - **Consistency:** it is consistent with every line. Sprout has "a jug of barley drink" and reader "a jug of thick barley drink", and neither band uses "ale" or "beer" anywhere. Both cut the seven jugs. Enkidu sings after *eating*, so nobody drinks and nobody is merry from drink. The journal hint's "jugs" still fits, and Siduri is only "a tavern" keeper.
  - **Fidelity:** the cost is small and honest. Mesopotamian beer was a thick barley drink, so the line is true without naming alcohol to a 3–10-year-old.
  - **Age-fit:** the barley glossary entry and the grain-to-bread lesson make the new title earn its place.
  - **Main game:** the page (`all`) keeps "ale" and the seven jugs. That is your call; it shows no drunkenness.
- **Siduri** is rewritten in our own words in both bands. I did not reuse the main script's `childLines` for `a26-16-siduri#9` ("Love the little one who holds your hand"), because that line is itself the stock translation.
- **Main-script suggestions (`atlas-a26.ts`, not edited).** These narration and dialogue lines are not marked as quotes, but they track copyrighted modern translations (George 1999, Speiser 1950) closely. Rewrite them, or add them to the quote-verification pass:
  - line 910 (days numbered, all is wind)
  - line 913 (Humbaba's voice the flood)
  - line 947 (a heart that never rests)
  - line 1037 ("Did you call me? Why am I awake?")
  - line 1307 (triplets, twins)
  - line 1410 ("I'd do the same to you")
  - line 1432 ("finest of men")
  - line 1505 ("bread fit for a god")
  - line 1644 ("lie down, and not get up")
  - line 1740 ("In grief, and in pain, in cold and in heat")
  - line 1975 ("flat as a roof", which the notes call the epic's)
  - line 2010 (sleep like a mist)
  - line 2054 ("a secret of the gods… thorns, like a rose")
  - lines 2114 and 2389 ("For whom…")
  - the `childLines` at `a26-16-siduri#9`
- **Similes the outline asks for.** Reader `a26-14-death` keeps "like a bride’s veil" and "like a lioness who has lost her cubs", because the outline asks for both. They are single images, not sentences; list them for the Assyriologist.
- **Approved `childLines` the reader reuses** track Thompson (public domain) closely: `a26-17-tale#3` ("Do we build houses to stand for ever?…") and `a26-18-wall#6` ("Walk the top of this wall… baked hard in the fire"). That is allowed as approved replacements; flag them if you want the Learning Grove fully free of the translation's shape.
- **CHECKS strings:** none changed. Sprout keeps 11, reader 0.
- **Sprout domain change:** `a26-10-plea-done-l1` is now health (`CASEL: Self-awareness`), not science. Sprout counts move: science 26 → 25, health 8 → 9.
- **Writer log `docs/logs/edu-a26.md` is out of date** (not edited):
  - "Not registered yet" is wrong: both files are imported in `edu.ts`, and `a26` is in `eduPacks`.
  - The sprout domain counts are as above.
  - The sprout `a26-10-plea-done` lesson is no longer about wind.
- **Adviser packets (an Iraqi adviser and an Assyriologist).** Add these to the writer's list:
  - cuneiform signs standing for both words and sounds, and the Latin *cuneus*;
  - the lapis tablet "cut into stone";
  - the rivers running south-east to the Gulf;
  - George Smith, the British Museum and 1872, with "more than two thousand years" buried;
  - the Lebanon cedar note ("nobody knows exactly where");
  - half a square mile for Ishtar's temple;
  - the Babylonian double-hour as two hours;
  - the reed houses of the southern Iraqi marshes (a living tradition, so word it with care);
  - "taken in living memory", which sprout now keeps vague;
  - "about four thousand years" for how old the story is.
- **Licences:** none needed for these files now. Thompson (1928) is public domain in the UK, EU and US, as the outline says. No line in either band now follows George or Speiser closely.

### A27 The White-Haired Prince

- **CHECKS strings:** none changed. Sprout `CHECKS` is still exactly the 19 `do` checks.
- **The timer warning:** `timer? reader:a27-13-complete: Yes. Earth spins once a day.` I judged it a false positive (a
  science fact, not a chore) and kept the wording. It will keep showing up in `--warnings` runs. Content-check
  otherwise reports nothing for a27.
- **Reworded lines that may lean on Zimmern, for the quote-verification pass:** "try your fortune in it" (main
  `a27-08-feather` #3, not marked as lifted) and "a rope with no flaw" (main `a27-13-roof` #1, which the notes already
  call a paraphrase of "cord without flaw"). The edu versions no longer use either.
- **Writer log `docs/logs/edu-a27.md` is out of date (not edited):**
  - It says the files "are not registered yet". Content-check now reports a27 lines, so they are wired.
  - The reader glossary scenes for `nameh`, `humble`, `mobed` and `brazier` have moved.
  - Sprout `a27-02-order-done-l1` now teaches "shh", not "shame".
- **Main-script suggestions (`atlas-a27.ts`, not edited):**
  - Look again at `a27-08-feather` #3, "try your fortune in it" (see above).
  - Nothing else: the main script's riddle answers and Sindokht's line are fine. The sprout gaps came from cutting.
- **Facts for the Iranian and Afghan advisers:**
  - "Rostam means delivered" comes from the poem's own wordplay on *rastam* ("I am freed"). Both bands give it as the
    name's meaning, and a "the story says" frame would be safer.
  - "Zal means the old one."
  - Shah mat → checkmate.
  - "Mah" means both moon and month.
  - The old Persian year of 12 × 30 days + 5.
  - Yalda with pomegranates; the wedding sofreh.
  - Dari and Tajik as forms of Persian.
  - Sistan lies in south-eastern Iran and south-western Afghanistan.
- **Albinism organisation:** the care note asks one to read both files, especially `a27-01-birth` in each band.
- **Licences:** none needed. Zimmern (1883) is public domain and there are no lifted lines left in either edu band.
  Warner and Warner is not used.

### A28 The Box of Stories

- **Main script (atlas-a28.ts, not edited):**
  - a28-02-price #7–8 uses Haley's epithets ("hornets that sting like fire", "the fairy whom nobody sees", close to her "fairy-whom-men-never-see"). Reword them there too.
  - a28-08-debt-done says "the buttercup" after a28-08-debt-wisp.
  - a28-12-last-done ("Your Nubbin is beaming… laugh anyway") also follows the Wisp and driven variants.
  - The writer log already notes a28-12-tell-done ("taps her chin") on the freed and sat paths.
  - The childLines for a28-09-sweep#1 and a28-12-return#3 ("Long ago, they say, the spider Kwaku Ananse was there,") are still a near-verbatim Rattray line. Suggested replacement: "Long ago, they say, there was a spider called Kwaku Ananse,".
- **Judgement call: the closing formula.** a28-12-complete in both bands keeps the childLines paraphrase: "If you liked it, or if you did not, take a bit of it with you, and bring a bit back to me." Its shape follows Rattray's translation, but it is the tradition's own customary closing, and the quest is named for it. I kept it, and the Akan advisers should confirm it.
- **Writer log out of date (docs/logs/edu-a28.md, not edited):**
  - reader:a28-12-return now teaches "burning cannot be undone" (2-PS1-4), not moths (4-LS1-2). Add 2-PS1-4 to the reader standards list. 4-LS1-2 is still used elsewhere.
  - The debt-done and last-done scenes are now path-neutral in both bands.
- **CHECKS:** no `CHECKS` strings changed (sprout still 14; reader empty).
- **Advisers:**
  - The Akan advisers should confirm the day-name list (regional spellings vary: Kwasi/Kwesi, Kwame/Kwamena), "sem" glossed as "story or matter" (asɛm), and the funeral lesson.
  - The Jamaican advisers should read reader:a28-11-step's think question first, as the writer log says.
- **Checks:** `npx tsc --noEmit -p .` clean. `npx eslint` on both files clean. `npx tsx tests/tools/content-check.ts --warnings` reports problems: 0, with no warnings on A28 (the three warnings are in pa2 and a27, not mine). Both files are LF and Prettier-formatted.

### A29 The Honmoon (reader only)

- **Reader only: confirmed.** The outline says "for the reader band only, softened". `eduExempt` in content-check exempts every `a29-` scene for sprout, and nothing for reader, so coverage is full.
- **No CHECKS strings changed.** There are no `do` lessons, and `CHECKS` is `[]`.
- **Check against the film (main script too):** Rumi's "But only the half of me you could look at" (`a29-13-courtyard`, in `atlas-a29.ts` as well). I can't verify it either way, and the A29-13 confrontation is a famous scene, so it may be close to a film line. If it is, paraphrase it in both files; the edu metaphor lesson would need its quote changed to match.
- **Main-script suggestions for `atlas-a29.ts` (not edited):**
  - `a29-06-fight`: "Her sword is at his throat" (as fixed here).
  - `a29-10-complete`: "You don’t say anything" → "You don’t promise anything", for the same safeguarding reason, if the main game wants it.
- **The writer log `docs/logs/edu-a29.md` is out of date:**
  - "It is not registered yet" is wrong: `edu.ts`, `index.ts` and `eduPacks` already include it.
  - The counts and standards are otherwise still correct. No lesson moved or changed its domain.
- **Advisers:** the writer's list still stands: the hangul dates, ondol and maru, the "four hills", the jangma dates, and the New Year tiger-and-magpie pictures. Add the lute (above). The licence for Derpy and Sussie is recorded as approved (2026-10-17); the main header still says a film licence is needed to ship.
- **Line endings:** LF (0 CR bytes), and Prettier is clean.

### A30 The Word on the Brow

- **CHECKS:** unchanged in both files: sprout lists its 7 `do` strings, and reader lists `edu:order:letters:alef-mem-tav`.
- **Suggested main-script fixes (`atlas-a30.ts`; not touched here):**
  - `a30-06-tellings`: the choice "Why truth?" comes before the rabbi has said the word is truth. Suggest adding
    "…one that anyone may read: the word for truth." to the last line.
  - `a30-06-letters` #3 and #5: "Mem, מ, from the middle of the alef-bet" and "The first letter, the middle and
    the last" state as fact what is the old teachers' saying. Suggest "from near the middle" and "one from the
    middle", as in the edu files.
  - `a30-09-rest` #3: "He reaches up" reads as Yossele. Suggest "The rabbi reaches over".
  - `a30-07-flood`, last line: "says one word". Optional, but "says, “Stop.”" removes any hint of a magic word.
- **Writer log (`docs/logs/edu-a30.md`) is now out of date:**
  - The vetted-list note gives "EH-met". It should be "eh-MET" (stress on the last syllable). The native-speaker
    recording should confirm it.
  - The "Middle letter" note: both bands now say "near the middle" or "one from the middle", and sprout no longer
    says "the middle" anywhere.
  - The reader facts list no longer includes "pulse × 4": the heart lesson is about oxygen to the muscles now.
  - Domain counts are unchanged in both bands.
- **Advisers (Jewish advisers, as the log already asks):**
  - The reader line "In some it is a holy Name, written on a slip of paper. We will leave that where it belongs."
    mentions the Name without writing it. It comes from the original, so confirm it is acceptable.
  - The paraphrase of Psalm 139:16 ("before I was made, you saw me"), now called a prayer or psalm, not a song.
  - The golmi gloss, "my golem: me, a lump not yet shaped".
  - "families often sing together" at the Sabbath table.
  - The 25-hour worked example: the clock times are invented and framed with "Say…".
- **Judgement calls:**
  - The lantern change follows last wave's flame rule. The main script still has you light it, which is fine for
    the main game.
  - The kept-stone choice "it hums one word, safe" stays in both bands, as in the original. It is worth a canon
    look at whether the Heartstone may "say" a word (canon 17).
  - Reader `a30-13-complete-sit` says Rivka "only had enough clay for one" bird. She has also made the Nubbin's
    bird, so the sill bird may read as a second bird. Check this against the main script's intent.

### A31 The Hero Twins

- **No CHECKS strings changed** in either band.
- **Decision, the oven, the bat and the show.** The outline says the Learning Grove cuts these three; the writer kept softened versions instead, as EDU-STYLE requires a version of every scene: a hat and a pretend squash hat; the twins "take hands and walk into the glow" after a five-day promise; a curtain and empty seats. I kept them. They are gentle, and the return comes one scene later. If you want the oven out of sprout, `a31-14-oven` could end at Hunahpu's promise and cut to the river.
- **Reader keeps "bring back her heart in a bowl"** (`a31-04-owls`), the father's order. It is tense but not graphic, as the reader band allows. The writer flagged it too.
- **Lifted-text risk, names.** "Wing" and "Packstrap" (reader `a31-11-lords`, and the main script) are the English renderings of the lords Xic and Patan used by Tedlock and Christenson, and so are house names like "Razor House". Names are low risk, but the advisers may prefer the K'iche' forms. Change both files and `atlas-a31.ts` together.
- **Adviser items** (adding to the writer log's list): the nixtamal line now says "lime, a white powder made from stone"; and reader `a31-06-laugh` "Ask anyone here who paints or carves who looks after them" claims that the monkey brothers are still honoured by artists. The main script says the same.
- **Main-script suggestion (`atlas-a31.ts`, not edited):** `a31-16-rise` #4, "the boys from the house that fell", has no setup in the main script either. Either A31-8 should say that Zipacna brought their house down, or the line should read "the Four Hundred Boys".
- **Writer log (`docs/logs/edu-a31.md`) out of date:**
  - Sprout Hazel's note is now "won by being cheeky to grumpy lords".
  - Both bands' `a31-15-complete` line is new.
  - Reader `a31-10-relay-l1` now plays after line 5.
  - The reader's 09-roof fix no longer says clay is waterproof.

## 7. Checks (after the fixes, from the repo root)

- `npx prettier --check` on the 12 files: all match Prettier code style. All 12 are LF (0 CR bytes each).
- `npx tsc --noEmit -p .`: clean (exit 0). It failed with two TS2322 errors in a26 before the fix.
- `npx eslint src/content tests/tools`: clean (exit 0).
- `npx tsx tests/tools/content-check.ts --warnings`: **problems: 0**, warnings 3:
  - `pronoun? pa2-01-title` and `pronoun? pa2-15-tears` are outside this batch.
  - `timer? reader:a27-13-complete: Yes. Earth spins once a day.` is judged a false positive and kept.
