# Log: A31 The Hero Twins

File: `src/content/atlas-a31.ts`. Exports `ATLAS_A31`, `A31_VARIANTS`, `ATLAS_A31_FLAGS`, `ATLAS_A31_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. Prettier isn't applied, to match the
other atlas files, which keep long lines. A self-check (scratchpad `chk-a31.mts`) finds 0 problems:

- ids are unique, and every `requires` resolves;
- every `who` is declared;
- every line is ≤ 160 characters, every narrator line is ≤ 2 sentences, and there are no em dashes;
- every step scene, including the stay-branch replacements, has 6–16 lines;
- every quest has 2–3 steps and a choice;
- every lifted line has a `childLines` key, and every key points at a lifted line;
- the flag and check lists match what the file uses, and every check uses an existing verb.

## Counts

- **Quests:** 17 (A31-1 to A31-17), audience `all`, chained by `requires`.
- **Steps:** 39.
- **Scenes:** 81 (58 in the quests, 23 variants).
- **Lines:** 658, counting choice `then` lines.
- **Choices:** 51 choice points with 104 options.
- **Checks:** 51 distinct ones. There are 39 step checks and 12 replacement checks for the stay branch.

## Lifted text

From Lewis Spence, *The Popol Vuh* (David Nutt, 1908), Project Gutenberg #56550. I checked each passage word for word
against the eBook text on 2026-10-15. Each one is printed "in brown type" in the atlas's margin, and each has a
`childLines` entry.

1. "The head of Hun Hunahpu was, however, suspended from a tree, which speedily became covered with gourds…" is at
   `a31-03-tree#2`. The name is adapted from Spence's "Hunhun-Ahpu".
2. "…the maiden stretched out her hand, and the gourd spat into the palm." is at `a31-04-xquic#6`. "The gourd"
   stands in for Spence's "the head of Hunhun-Ahpu".
3. "Their bones were beaten to powder and thrown into the river, where they sank, and were transformed into young
   men." is verbatim. It's at `a31-14-river#1` (go) or `a31-14-river-stay#6` (stay).
4. "The game of ball was forbidden them, they were to perform menial tasks…" is verbatim, at `a31-15-complete#1`.
5. **Not used.** In Spence, "who now mounted to heaven and became the sun and moon" describes the twins' **father
   and uncle**, not the twins. Quoting it over the twins would misquote him, so Q16 says it in our own words.
6. "…whilst the Four Hundred Boys slain by Zipacna became the stars." is at `a31-16-rise#6` (go) or
   `a31-16-rise-stay#5` (stay). "The Four Hundred Boys" stands in for Spence's "four hundred youths".

Corn, not canes: the grandmother says the English book says canes, "We say corn" (`a31-10-corn#5`).

## Flags

**Read (Grove, read-only):**
- `s3Done`: the ribbons drawn on your Nubbin, plus `a31-01-ribbons` (the setup), `a31-16-ribbons` (the girl points
  at the two colours) and `a31-grove-byte` (Byte's line, verbatim).
- `s24Done`: `a31-margin-hazel` (Hazel's note, verbatim, beside the empty seats of Xibalba).

**Written (Atlas save only):**
- `a31-01`…`a31-17` and `a31-done`;
- `a31-rat` = share | twins | come (Q9);
- `a31-corn` = stay | go (Q10).

No Grove flag is written.

## Variants (`A31_VARIANTS`)

| Scene | Plays when | Replaces |
| --- | --- | --- |
| `a31-11-road-stay`, `a31-11-lords-stay` | `a31-corn` = stay | the A31-11 step scenes |
| `a31-12-dark-stay`, `-dark-done-stay`, `-houses-stay` | stay | the A31-12 step scenes and the done scene |
| `a31-13-bats-stay`, `a31-13-game-stay` | stay | the A31-13 step scenes |
| `a31-14-oven-stay`, `a31-14-river-stay` | stay | the A31-14 step scenes |
| `a31-15-dancers-stay`, `a31-15-curtain-stay` | stay | the A31-15 step scenes |
| `a31-16-father-stay`, `-rise-stay`, `-complete-stay` | stay | all of A31-16 |
| `a31-17-complete-stay` | stay | `a31-17-complete` (green corn, not golden) |
| `a31-13-rat-coati` / `-rat-court` | go + `a31-rat` share / come | inserts |
| `a31-13-rat-coati-told` / `-rat-court-told` | stay + share / come | inserts (the falcon tells it) |
| `a31-01-ribbons`, `a31-16-ribbons` | `s3Done` | inserts |
| `a31-margin-hazel` | `s24Done` | after `a31-15-complete` |
| `a31-grove-byte` | `s3Done` + `atlasDone('A31')` | Grove keepsake, once |

The completes of A31-11 to A31-15 are the grandmother's voice-over, shared by both branches. Each quest's notes give
the exact insert points and the stay branch's replacement checks.

**The signature choice.** It is made in Q10. It pays off in Q16, six quests later (the sunrise from the ballcourt or
from Xmucane's doorway, with her outline line). It pays off again in Q17 (the corn is golden or green), and in the
Grove (the corn on the cottage beam).

## SIM needs

- **Branch-dependent steps.** On the stay branch, the A31-11 to A31-16 steps use the replacement checks, journal
  goals and hints listed in each quest's notes ("STAY JOURNAL"). If the sim prefers one check per step, the stay
  checks can be mapped onto the default check strings, but the goal and hint text must still follow the branch.
- **Ear of corn.** A fixed decor on the cottage's middle beam, coloured by `atlasFlag('a31-corn')`.
- **Rubber ball and hip-ball.** An idle behaviour by the pond: Nubbins bump the ball with their hips and bellies,
  never their paws. It has no score, no timer and no reward.
- **Mosquito petpet and jade pendant.** Both are one-time cosmetics.
- **Byte keepsake.** It reads `s3Done` and `atlasDone('A31')`, and plays once at dusk by the pond.
- **Parent note.** An optional card before A31-13. Its text is in A31-13's notes.

## Changes from the outline, and why

- **Lift 5 is dropped** because of the misattribution in Spence (see above).
- **The stay branch needs a messenger.** The falcon from Q10's relay brings the news to Xmucane's door in
  Q11–Q16. Without it, the stay branch wouldn't learn what happened below.
- **Q9's trick uses a small jar.** You take the twins' small jar down, and the mosquito holes Xmucane's big one. That
  gives you a carry step. The mosquito's cameo here sets up Q11.
- **The rat-come branch.** If you stay and the rat came, the rat goes down in Hunahpu's pocket instead of on your
  Nubbin.
- **Where the rewards are.** The mosquito petpet comes in Q11. The pendant comes in Q16: from the twins on go, from
  Xmucane on stay. The rubber ball comes in Q17, from the granddaughter. The outline names the rewards but doesn't
  place them.
- **Softening.** The rat is held upside down, not over the fire. Seven Macaw loses his shine but lives. The arm
  hangs by its sleeve from a beam. Hunahpu's head is only ever "the bat's prize". Your Nubbin minds the curtain
  rope, but Xbalanque lowers the curtain.
- **Grandmother's last line.** The outline's "Eat a tortilla. Go home." is kept as written.

## For Maor

- **Which twin becomes the Sun is never said.** The only slot is `WHICH_SUN`. In it the grandmother says her own
  grandmother told her which, and that she'll tell the girl one day. The K'iche' advisers can replace that one line.
- **Names.** The page uses the familiar forms (Hunahpu, Xbalanque, Xmucane…). The header lists the modern K'iche'
  forms for the advisers to confirm; they are my best knowledge, not settled. The frame grandmother and
  granddaughter are unnamed, and the advisers name them. No K'iche' or Spanish words are guessed.
- **For adviser review:**
  - Xquic's call to the guardians of food (one line);
  - Xmucane's copal before dawn (stay branch);
  - the grandmother's "We are made of corn" (`a31-10-corn#5`);
  - her line about the monkey brothers as artists' patrons (`a31-06-laugh#6`).
- **The Learning Grove version** (both bands) is not in this file. It is the plan's next task. Its softening
  should also cut the cigars (they could become candles).
