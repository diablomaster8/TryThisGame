# Log: S25 Real (Grove side story, Tier 2)

File: `REPO/src/content/side-stories-s25.ts`. Exports `SIDE_STORY_S25`, `SIDE_STORY_S25_VARIANTS`,
`SIDE_STORY_S25_FLAGS` and `SIDE_STORY_S25_CHECKS`. tsc (strict) and eslint are both clean.

## Counts

- **Quests:** 1 (`s25`, code `S25`).
- **Steps:** 13, covering the outline's 16 quests: Q1+Q2, Q4+Q5 and Q5's Sable beat+Q6 are merged, and Q16 becomes the coda variants.
- **Scenes:** 46 in total.
  - The quest has 27: 13 step scenes, 13 done scenes and 1 complete scene.
  - There are 19 variants: 10 branch scenes, 6 coda scenes and 3 idle scenes.
- **Lines:** 319, counting choice `then` lines.
- **Choices:** 8, in three choice points:
  - the name (3 options);
  - what to ask Moss (3);
  - the bundle (2).
- **Checks:** 13. Each one uses an existing verb: inspect, craft, sit, give, find, visit, watch, carry, wait and talk.
- **Self-check:**
  - no duplicate ids;
  - every `who` is either a campaign speaker or `clank`, which is declared;
  - no line is over 160 characters;
  - no narrator line has more than two sentences;
  - every set flag appears in FLAGS;
  - every check appears in CHECKS.

## Lifted text

Source: *The Velveteen Rabbit*, 1922 text, Project Gutenberg #11757. These are the outline's 8 rechecked passages, each used verbatim except quote 2, which is adapted as the outline marks.

| # | Scene and line | Who says it | Passage |
| --- | --- | --- | --- |
| 1 | `s25-real#10` | Moss | "Real isn't how you are made… It's a thing that happens to you." |
| 2 | `s25-real#11` | Moss | "When someone loves you…", with "a child" changed to "someone" |
| 3 | `s25-hurt#0` | Moss | "Sometimes. When you are Real you don't mind being hurt." |
| 4 | `s25-hurt#1` | Moss | "It doesn't happen all at once… It takes a long time." |
| 5 | `s25-hurt#2` | Moss | "…break easily, or have sharp edges, or who have to be carefully kept." |
| 6 | `s25-page#1` and `s25-page-found#1` | You, reading aloud | "…only toys, and would never turn into anything else." |
| 7 | `s25-fern#5` | You | "He isn't a toy. He's REAL!" |
| 8 | `s25-shabby#6` | Moss | "…when you are Real shabbiness doesn't matter." |

- The Skin Horse's "said the Skin Horse" tags are dropped.
- All 9 occurrences have new `childLines` written for the Learning Grove.
- The book is never named on screen.

## Flags

- **Written:**
  - `s25Done`;
  - local flags `s25-name` (button | bobble | mister), `s25-ask` (hurt | when | sit) and `s25-toy` (gone | kept).
  - No Grove flag beyond `s25Done`. No affection, trust, rebirth, evolution or alignment change.
- **Read:**
  - `s21Done`: Clank asks the question; without it, Byte does.
  - `a13-clank-word`, from the Atlas save: if A13's "Clank's word" scene has played, Clank has already found his word.
  - Sable's trust (20 or more) and whether she is present: step 4 only.
  - c4-open, c4-close, c6-close and c8-nova having played: these set the step timing.

## Variants

| Variant | Plays | Instead of |
| --- | --- | --- |
| `s25-sill-late` | If step 2 finishes after c4-open: Moss is named, but stays silent | `s25-sill` |
| `s25-storm-nosable` | If Sable's trust is under 20, or she is gone | `s25-storm` |
| `s25-page-found` | If `s21Done` and A13's word scene has played | `s25-page` |
| `s25-byte` + `s25-page-byte` | Without `s21Done` | `s25-clank` + `s25-page` |
| `s25-shed-kept` | `s25-toy` = kept | `s25-shed` |
| `s25-line` + `s25-line-dry` | `s25-toy` = kept | `s25-dew` + `s25-gap` |
| `s25-falls-kept` + `s25-twice-kept` | `s25-toy` = kept | `s25-falls` + `s25-twice` |

- **Coda:** `s25-coda-wild-{button|bobble|mister}` or `s25-coda-coat-{…}`. It plays in the first spring after the campaign, after any ending, and Moss is not in it.
- **Idle scenes:** `s25-moss-kept` and `s25-moss-gone` play once on tapping Moss after `s25Done`. `s25-clank-next-door` plays once on tapping Clank.

## SIM needs

1. A carryable toy item that a Nubbin holds and sleeps curled round.
2. A rare "Velveteen" coat colour that only this story gives.
3. On the gone branch: a Velveteen wild Nubbin at the edge of the long grass in the coda spring.
   - It follows the ordinary stray rules.
   - It is an ordinary child: zero rebirths, no stat bonus, no Eternal status.
4. On the kept branch: a knitted Velveteen coat cosmetic.
5. Read `a13-clank-word` from the Atlas save.
6. Read Sable's trust at step 4, read-only.
7. Hold step 8 while S21 is open and before chapter 6. Step 8 also waits for c4-close, where Byte is first met.
8. Step 4's storm is one cosmetic night of weather. Step 10's chill is narration only: no sim illness.
9. "Your Nubbin" is the toy's holder: your youngest Nubbin at step 4, passed to the next youngest if it leaves.

## Changes from the outline, and why

- **Merges.**
  - Q1 and Q2 are one step: the name choice is the parcel's done scene.
  - Q4 and Q5 are one step: Moss's answers to the toy are the done scene, and your question is a choice.
  - Q5's Sable beat opens Q6's storm scene, because it has no action of its own.
  - Q16 became coda variants, so `s25Done` and the journal land in chapter 8 and don't wait for the post-game.
- **Moss and chapter 4.** Moss never speaks or is named before c4-open. In steps 1–2 he is "the little grey one", and there is a late variant for when step 2 plays after c4-open.
- **Who hears Moss.** Only you hear him, as in the campaign. Clank, Byte, Fern and Clover never do, so you pass his lines on in Q10.
- **Hazel's book.** It is in the parcel. That explains how Moss knows the horse's words: Hazel read it under his ledge. It also gives Q10 a page to read.
- **Button-eye charm.** It is the loose eye found in the grass (gone), or Clover's matching spare button (kept), so both branches earn it.
- **Clank with A13 done.** He says he found his word already "next to a wooden boy", and Moss says Real "lives next door to it. He's already knocked."
- **Not in the outline.** The toy turns from "it" to "he" in the narration after "He isn't a toy". The Velveteen wild one hops twice in the coda, answering "he can't hop" from Q9.
- **The window.** The story closes unfinished if chapter 9 opens first, which keeps the outline's ch3 → ch8 window.

## For Maor

- **Two hooks for other scripts.**
  - The A13 scriptwriter should set an Atlas-save flag `a13-clank-word` in Clank's word scene, or tell Claude the real name to map.
  - S21's Clank speaker id (`clank`) is reused unchanged.
- **The let-go branch** is deliberately unexplained: a light from the dew goes into the long grass, and a wild one turns its head at the toy's name in spring.
  - Nothing says the toy became a Nubbin.
  - Nothing touches `eternalRaised`.
  - The journal says only: "Twice round, and loved the whole way, and settled in itself." This matches the sim's Eternal rule: at least two rebirths, Normal type, and a strong or balanced alignment.
- **Learning Grove.** The edu versions (sprout and reader) are still to do as a separate job; the childLines cover all the lifted lines.
