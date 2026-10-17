# Learning Grove: Atlas A25 "The Nothing", Part One, reader band (2026-10-17)

File: `src/content/edu-a25-reader.ts` (`EDU_A25_READER`, `EDU_A25_READER_VARIANTS`, `CHECKS`). Not
registered yet: the wiring task adds it to `edu.ts` and `a25` to `eduPacks`. Reader band only, and
Part One only (quests A25-1 to A25-14, ending at "Moon Child"), as the outline says. There is no
sprout file.

## Counts

| | reader |
| --- | --- |
| Quests | 14 |
| Scenes (74 quest + 1 variant) | 75 |
| Lessons | 80 |
| literacy | 17 |
| science | 19 |
| sel | 22 |
| maths | 11 |
| social-studies | 10 |
| health | 1 |
| Kinds (ask / notice / do) | 60 / 20 / 0 |
| Think questions (no `best`) | 16 |
| Glossary entries | 28 |

Every scene has one or two lessons, every lesson has an approved standard, lesson ids are unique,
and every quest has a think question, at least three domains and (A25-1 to A25-12, A25-14) a `sel`
lesson (A25-13 has none, but its Empress scene is a feelings and family-story think question). No
two lessons of the same domain are ever back to back, across scenes, quests and the variant path
(`a25-13-empress-ash` has the same domain as the scene it replaces). Line caps hold (<= 30 words,
<= 160 characters, narration <= 2 sentences). LF line endings, Prettier clean, tsc and eslint clean.
There are no `do` lessons, so `CHECKS` is empty.

## Standards used

1-PS4-1, 2-ESS1-1, 2-LS4-1, 2-PS1-1, 2.MD.D.10, 3-LS2-1, 3-PS2-1, 3.MD.A.1, 3.OA.A.1, 3.OA.A.3,
4-ESS2-1, 4-LS1-1, 4-LS1-2, 4-PS3-2, 4.G.A.3, 4.MD.A.2, 4.OA.C.5, K-2-ETS1-1, K-LS1-1, RL.2.3,
RL.2.4, RL.3.3, RL.3.6, RL.4.2, RL.4.3, L.3.4, L.4.5, D2.Civ.8.K-2, D2.Geo.2.K-2, D2.His.2.K-2,
and CASEL (all five).

## What it teaches (the outline's list)

- **Two colours, two stories:** the red attic and green Fantastica, and that printing in two colours
  means the paper goes through the press once per colour (a25-01-attic).
- **Turtles live long:** a tortoise's shell is part of its skeleton, and giant tortoises can live
  well over a hundred years (a25-06-shell).
- **Sphinxes:** the Egyptian stone guardian (the Great Sphinx at Giza, about 4,500 years old) and the
  Greek riddle-setter (a25-09-sphinx). The snake biting its tail (ouroboros) is an Egyptian and
  Greek sign over 3,000 years old (a25-01-shop-done).
- **German words:** Mond, Kind and Buch, and how German joins words into one (Mondenkind) (a25-14-name).
- **A name is a gift:** names and family stories (a25-04-amulet, a25-13-empress and its Ash variant),
  naming a fear (a25-02-gap-done), and the theme question that closes the quest (a25-14-complete).
- Around them: compass directions and winds, sound and pitch, reflection and symmetry, forces and
  flight, sinking and floating, sums with time, distance and groups, rhyme, simile and metaphor, and
  feelings (guilt, fear, grief, asking for help, courage, the cost of wishes).

## Care notes kept

- Bastian is drawn with affection; the Magic Mirror lesson asks how a good friend sees "a round boy
  in a blanket" and the best answer is "a real person worth liking".
- Artax's death (a25-05-artax) is one quiet scene, in plain words ("Artax has died. His body has
  stopped, and it will not start again."), with a grief think question straight after, a health
  note and a "stay beside someone" lesson following. It is never recapped.
- Gmork's end is offscreen (Atreyu's face is what we see), said plainly in one line. Ygramul's sting
  is a jolt of light. Atreyu's people appear only through a grassland habitat note and a community
  think question; no stereotype, nothing invented about their culture.
- The Nothing is missing pieces of the picture; the blind-spot note keeps it gentle.
- No lifted text: no AURYN inscription or refrain appears in Part One, and nothing from Ende's text,
  any film or any translation is quoted.

## Original scenes left out

Everything from A25-15 onwards (Part Two, outline: "Part One only"):

- Quests 15 to 20, all scenes: a25-15 (Perelin and Goab), a25-16 (Amarganth), a25-17 (Xayide),
  a25-18 (The Ivory Tower Falls), a25-19 (The Long Way Back) and a25-20 (The Water of Life), with
  every step, done and complete scene in them (a25-15-* to a25-20-*).
- Variants: a25-16-worry-yourself, a25-16-worry-notebook, a25-18-attic-truth, a25-19-page-notebook,
  a25-19-ask-yourself, a25-20-water-ash, a25-20-complete-yourself, a25-20-complete-notebook,
  a25-margin-hazel and a25-grove-ember.

Only `a25-13-empress-ash` of the 11 variants falls inside Part One, and it is covered. In the
Learning Grove the page therefore ends at a25-14-complete. That scene is rewritten to close the
story ("This is where this part of the story ends...") and promises nothing further. The original
promise ("a whole world waits for him to wish") is dropped.

## Differences from the original (reader only)

- a25-02-fire-done: adds eighteen pebbles to share (maths). a25-04-camp-done: adds a count of twelve
  tents of three people. a25-07-complete: adds "three weeks of walking". a25-09-complete: adds three
  rows of eight columns. a25-11-complete: adds sunset at seven and sunrise at five. a25-01-run:
  adds the clock at twenty-five past nine. All are story-sized details for the sums.
- a25-06-complete: Atreyu says ten thousand miles is "years of walking" (to agree with the
  1,000-day sum in a25-06-ask-done) instead of "my whole life".
- a25-07-bargain: Ygramul's sting "sends you anywhere, then you need a long rest" (no "dinners" line).

## For Maor

- Wiring: add `reader:a25` quests and `EDU_A25_READER_VARIANTS` to `edu.ts`, and `a25` to `eduPacks`
  in `tests/tools/content-check.ts` (reader band only; there is no sprout version to register).
  The Learning Grove must stop the page at a25-14 (no "Part Two" card, no A25-15).
- The Egyptian and Greek sphinx, ouroboros, German and tortoise facts are all well established, but
  a quick read by an adviser on the sphinx note would suit the Atlas's culture-sensitive pages.
- The note in a25-04-camp (grassland names: prairie, steppe, savanna, pampas) is deliberately
  geographic only; Atreyu's people still want the adviser pass the outline asks for.
