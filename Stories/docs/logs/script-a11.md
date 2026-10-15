# Log: A11 The Enchanted Place

File: `REPO/src/content/atlas-a11.ts`. Exports `ATLAS_A11`, `A11_VARIANTS`, `ATLAS_A11_FLAGS`, `ATLAS_A11_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a11.mts`) finds 0
problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2 sentences,
step scenes 6–16 lines, every lifted line keyed in `childLines`, flags and checks lists exact.

## Counts

- Quests: 20 (A11-1 to A11-20), audience `all`, chained by `requires`.
- Steps: 54 (2–3 per quest).
- Scenes: 130 (119 in the quests, 11 variants).
- Lines: 797, counting choice `then` lines.
- Choices: 23 choice points, 63 options. Every quest has at least one.
- Checks: 54, all with existing verbs.

## Lifted text (verbatim, each used once, each with a `childLines` entry)

1. "Here is Edward Bear, coming downstairs now, bump, bump, bump, on the back of his head, behind Christopher Robin." (WtP I) `a11-01-page#2`, narration.
2. "For I am a Bear of Very Little Brain, and long words Bother me." (WtP IV) `a11-04-owl#6`, Pooh.
3. "Silly old Bear, … what were you doing?" (WtP III) `a11-03-count-done#1`, Christopher Robin. The tag "he said" is dropped. "were" is italic in the source, and a note asks the UI to italicise it if it can.
4. "Tiggers don't like honey." (HAPC II) `a11-12-breakfast#1`, Tigger.
5. "you can't help respecting anybody who can spell TUESDAY" (HAPC V, a fragment inside our own sentence) `a11-15-owl#5`, Rabbit.

Editions: the 1926 and 1928 Methuen texts, as Part M checked them against PG #67098 and #73011. They're set with the
game's curly quotes.

**Not quoted (Part M marks them [unverified]):**
- "It rained and it rained and it rained." It's paraphrased at `a11-09-rain#0`.
- The promise exchange: our own version at `a11-20-knight#8–11`, "grown up and enormous" / "just the right size".
- The last line: our own version in `A20_END`.

Each of these has a note on where to swap in Milne's words if they're verified later. Poems, hums and the Rissolution
are described and never given. I also steered clear of other famous Milne lines in chapters I–VII that the outline
doesn't list (Crustimoney Proseedcake, "Pathetic", the Backson note, "So that's what Tiggers like!", and so on): they
are reworded or left out.

## Flags

- **Read:** one Grove fact, read-only: whether the campaign is finished (`CampaignState.ending` set, so chapter 12's
  finalChoice and Hazel's walk have both played). It plays `a11-margin-hazel`, and the pencil note stays on the page
  afterwards. It never shows before the walk.
- **Written (Atlas save only):**
  - `a11-01`…`a11-20`;
  - `a11-done`;
  - `a11-gift` = ribbon | thistle | sat (Q6);
  - `a11-mist` = rabbit | tigger (Q17).
  - No Grove flag is written.

## Variants (`A11_VARIANTS`)

- `a11-11-door-thistle` and `a11-11-door-sat` replace the Q11 step 3 done, `a11-11-door` (ribbon).
- `a11-16-bounced-sat` replaces the Q16 step 3 done, `a11-16-bounced` (sat only).
- `a11-17-mist-rabbit` and `a11-17-found-rabbit` replace the Q17 step 2 scene and done (rabbit).
- `a11-19-signed-rabbit` replaces the Q19 step 1 done (rabbit).
- `a11-19-scroll-thistle` and `a11-19-scroll-sat` replace the Q19 step 2 scene.
- `a11-20-complete-thistle` and `a11-20-complete-sat` replace the Q20 complete.
- `a11-margin-hazel`: Hazel's note, verbatim from the outline, split over three narrator lines. It plays after
  `a11-20-complete*` if the campaign is finished then, or otherwise the first time the atlas opens at the last page
  after the ending.

The signature choice is Q6, the gift. It pays off in Q11 (5 quests later), Q16, Q19 and Q20, and on the Grove bridge.
The Q17 choice pays off in Q19.

## SIM needs

- The **Poohsticks bridge** is a new Grove feature over the stream. Unlimited play, no prizes: the fast side of the
  current wins, with a seeded wobble.
- The bridge needs a read-only `atlasFlag('a11-gift')` lookup beside `atlasDone(id)`, to draw its detail: a ribbon on
  the rail, a thistle at the far end, or a worn place on the parapet.
- The **Long Table festival** reads `atlasDone('A11')`.
- The Atlas reads `CampaignState.ending` for the margin note. It's the same read S24 uses, and it waits for the walk.
- **`minigame:a11-poohsticks:bridge`** inside the page can't be lost.
- Your Nubbin's blue bow is shown on this page only, from Q1 until Q6 (ribbon). It's a prop, not a reward.

## Rewards

- The Useful Pot (decor, Q6).
- The Expotition Pole hat-stand (decor, Q8).
- The Poohsticks Bridge (feature, Q20).
- The Long Table Bookmark (item, Q20).

All are one-time.

## Changes from the outline, and why

- **Q18 merges HAPC VIII and IX**, as the outline's own Q18 does.
- **The ribbon is set up in Q1.** The outline's "its ribbon" in Q6 needs one, so Christopher Robin ties a blue
  "Friend" ribbon on your Nubbin in the Q1 complete. In the ribbon route, Christopher Robin gives it back on the way to
  Galleons Lap, so it can be tied to a tree there.
- **Q7: Rabbit's "pocket" is a pillowcase he has sewn into one.** Milne's Rabbit has no pocket.
- **Q20: the sat ending.** "A flattened round in the grass where you and Eeyore sat" can't happen literally at
  Galleons Lap. Your Nubbin makes a round there like the one by Eeyore's step.
- **Piglet's balloon is green.** Milne gives no colour, and green keeps clear of Disney's red.
- **The trigger reads "Nova's atlas: the Enchanted Place page".** The template would have given "the The Enchanted
  Place page".
- **No Learning Grove (edu) versions are in this file.** The outline wants a Little Sprouts version. The script brief
  asks Atlas lines only for `childLines`, so the edu file is still to do.

## For Maor

- **UK hold.** The header and the A11-1 trigger both say not to ship this page in the UK before 1 January 2027. It
  still wants a legal check on the Disney trade marks: the name is kept out of the title, and the designs are all
  original.
- **Three [unverified] Milne passages** (ch. IX rain, ch. X promise, ch. X last line) are paraphrased. If you can
  check them against PG #67098 and #73011, they can be swapped in verbatim, with `childLines` added.
- **Your call:** Hazel's margin note uses the outline's exact words, "the summer they stayed". It makes the player
  the "little one" she read to. Say if you'd rather it stayed ambiguous.
