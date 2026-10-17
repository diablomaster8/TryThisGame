# Log: A24 The Law of the Jungle

File: `src/content/atlas-a24.ts`. Exports `ATLAS_A24`, `ATLAS_A24_VARIANTS`, `ATLAS_A24_FLAGS`, `ATLAS_A24_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. A self-check script (kept in the
scratchpad, not the repo) finds 0 problems:

- ids are unique, and every `requires` resolves;
- every `who` is declared;
- every line is ≤ 160 characters, and every narrator line is ≤ 2 sentences;
- every step scene has 6–16 lines;
- every quest has a choice;
- every lifted line has a `childLines` entry, and every `childLines` key points at a lifted line;
- the flag and check lists match what the file uses exactly, all prefixed `a24-`, all with existing verbs.

The file is now registered in `index.ts`, and `content-check.ts --warnings` reports 0 problems for it (wave-M review).

## Counts

- **Quests:** 18 (A24-1 to A24-18), audience `all`, chained by `requires`.
- **Steps:** 49 (2–3 per quest).
- **Scenes:** 130 (116 in the quests, 14 variants).
- **Lines:** 756, counting choice `then` lines.
- **Choices:** 50 choice points with 102 options.
- **Checks:** 49 distinct ones.

## Lifted text

Only the eight passages the outline marks as verified, verbatim, with curly quotes. Edition: *The Jungle Book*, 1894
(Project Gutenberg #236); *The Second Jungle Book*, 1895; "The White Seal" against the Kipling Society's copies.

1. "O thou Mowgli—for Mowgli the Frog I will call thee—" Mother Wolf, `a24-01-door#9`.
2. "Now to Baloo's word I will add one bull, and a fat one, newly killed, not half a mile from here" Bagheera,
   `a24-02-council#10`. It's a fragment; closed with a full stop.
3. "We be of one blood, ye and I" Baloo `a24-03-words#5`, Mowgli to the cobras `a24-05-cistern#5`, you at the goodbye
   `a24-16-bagheera#11`. Three uses, as the outline allows wherever the Keeper uses the Words.
4. "Let them fall, Mowgli. They are only tears." Bagheera, `a24-07-tears#7`.
5. "Man goes to Man at the last, though the Jungle does not cast him out." Kaa, `a24-16-rock#5`.
6. "Good hunting on a new trail, Master of the Jungle! Remember, Bagheera loved thee." Bagheera, `a24-16-bagheera#7`.
7. "Sea Catch, our baby's going to be white!" Matkah, `a24-17-beach#8`. The tag "she said at last" is dropped.
8. "in that sea where no man comes." The end of our own sentence, `a24-18-complete#5`.

Every lifted line has an original `childLines` replacement. Every other line is our own: I went back over the draft and
rewrote every line that tracked Kipling's unverified wording too closely (the cave, the Council, the tears, Mother
Wolf's farewell, the Bandar-log's boast, Chil's call, Messua's shoes). Kipling's set names (the Red Flower, the Free
People, the Water Truce, the Strangers' Hunting Call, "look well") are kept as names or paraphrased. No verse; nobody
sings. The poem's first line is **not** used on Baloo's lesson board (the outline's optional swap).

## Flags

**Read (read-only):**
- `s8Reunited`: `a24-02-council-done-fern` replaces `a24-02-council-done`. Fern's voice from the page's edge, one line:
  "That's what Bramble did for the strays."
- `s24Done`: `a24-17-margin-hazel` plays once after `a24-17-complete` (or on the next opening if S24 finishes later).
  It carries Hazel's note from the outline, split over two lines so each narration line stays at two sentences.

**Written (Atlas save only):**
- `a24-01`…`a24-18`;
- `a24-done` (A24-18);
- `a24-stones` = mowgli | messua (A24-10, `a24-10-road`), the signature choice.

No Grove flag is written.

## Variants (`ATLAS_A24_VARIANTS`)

| Scene | Plays when | Replaces |
| --- | --- | --- |
| `a24-02-council-done-fern` | `s8Reunited` | `a24-02-council-done` |
| `a24-10-road-done-messua`, `a24-10-complete-messua` | messua | `a24-10-road-done`, `a24-10-complete` |
| `a24-13-hut-messua`, `a24-13-hut-done-messua` | messua | `a24-13-hut`, `a24-13-hut-done` |
| `a24-13-road-messua`, `a24-13-road-done-messua` | messua | `a24-13-road`, `a24-13-road-done` |
| `a24-15-lamp-mowgli` / `a24-15-lamp-messua` | by path | plays between `a24-15-lamp-done` and `a24-15-complete` |
| `a24-16-bagheera-done-messua` | messua | `a24-16-bagheera-done` |
| `a24-16-trail-messua`, `a24-16-trail-done-messua` | messua | `a24-16-trail`, `a24-16-trail-done` |
| `a24-16-complete-messua` | messua | `a24-16-complete` |
| `a24-17-margin-hazel` | `s24Done` | plays after `a24-17-complete` |

**The signature choice** is made in Q10. It pays off in Q13 (three quests later), Q15 and Q16. On both paths Mowgli
goes to men. The last image is the trail north with four wolves (mowgli), or the lit hut with the baby asleep (messua).

## Rewards

- Kaa-Coil Cushion (A24-5).
- Fire-Pot Lantern (A24-7).
- The Council Rock (A24-11).
- The One Blood Plank (A24-16).
- White Seal Petpet (A24-18).

## SIM needs

- **Council Rock.** A decor by the long grass. Idle Nubbins sometimes sit on it in a ring when the moon is up. No timer
  and no stats.
- **White seal petpet.** It lives at the pond and flops about. No feeding and no timer.
- **One Blood Plank.** A gate decor only; it doesn't change the gate. In the Learning Grove it shows a paw print and a
  hand print instead of the words.
- **Fire-Pot Lantern.** A warm point light that needs no fuel.
- **Minigames.** `puzzle:a24-calls:glade` is a three-card match that can't be failed. `feed:a24-fire-pot:dry-sticks`
  is a feeding game with no fail state and no timer.
- **Hazel's note.** `a24-17-margin-hazel` is a once-only scene, then a drawn pencil note (the same lookup as A18 and
  A20).

## Changes from the outline

- **Q8.** The headman, not a priest, sends Mowgli to herd the buffalo, and Buldeo's ghost is "a mean old man from over
  the river", not a moneylender. That avoids a trope the advisers would likely flag.
- **Q10.** The with-Mowgli "season with the wolves" is promised in Q10's close and happens after the hide is laid.
  That keeps Kipling's same-night Council in Q11. Q11's opening works for both paths.
- **Q12.** Hathi's tale is told in our own words and shortened. The First Tiger's kill is an accident, and no human
  death is told.
- **Q13.** The mowgli path has you carry word to Hathi inside step 2 (escort, then the errand). Messua goes to "a town
  where the law will keep her safe": no mention of the English.
- **Q14.** The lone wolf who brings the news (Won-tolla) is unnamed; Grey Brother relays what he says.
- **Q17.** The seal hunters are unnamed (Kipling's names are dropped). The intro line says the Unangax̂ were brought to
  the islands and made them home. The men are shown as workers for a distant company, and the page cuts away before
  the killing grounds.

## Care notes in place

- **Nova's card** (`a24-01-page#1–3`) on Kipling and empire.
- **Villagers** are frightened, not stupid. Buldeo is never mocked by the narration. Messua is the heart.
- **The Bandar-log** are monkeys only.
- **Softened for All:** no wounds anywhere, and Shere Khan's death is dust and silence. The hide is shown only pegged
  on the rock. Akela dies gently of age, like Fossil. The stones miss. Kotick's fights are shoving.
- **The third rule** is acted out (`a24-07-tears`, `a24-14-akela`, `a24-17-drove`) and never quoted.
- **Left out:** "In the Rukh" and "The King's Ankus". No Disney.

## For Maor

- The page needs **Indian advisers** (the village, Messua's dress, names, the Cold Lairs ruin), and an **Unangax̂
  adviser** for A24-17, especially the islands line `a24-17-beach#1` and `a24-17-drove#0–3`.
- Please check the wording of **Nova's card**. It says plainly that Kipling believed Britain had the right to rule
  India and that he was wrong about that.
- The Learning Grove version (geography, the animals and their protection today, the monsoon, fur seals, Steller's sea
  cow) is a separate task. It isn't in this file.
