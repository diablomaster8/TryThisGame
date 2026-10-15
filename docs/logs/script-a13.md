# Log: A13 The Wooden Boy

File: `REPO/src/content/atlas-a13.ts`. Exports `ATLAS_A13`, `A13_VARIANTS`, `ATLAS_A13_FLAGS`, `ATLAS_A13_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a13.mts`, adapted from
A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, every quest has a choice, flags and checks lists exact, every check uses an
existing verb with an `a13-` id. It also greps for Disney names and "strings": none.

## Counts

- Quests: 20 (A13-1 to A13-20), audience `all`, chained by `requires`.
- Steps: 49 (2–4 per quest).
- Scenes: 130 (118 in the quests, 12 variants).
- Lines: 831, counting choice `then` lines.
- Choices: 22 choice points, 44 options. Every quest has at least one.
- Checks: 49, all with existing verbs.

## Lifted text

**None verbatim.** Part M marks all eight Murray (1892) passages [unverified], so each beat is told in our own words:
the opening (`A1_PAGE`), the cricket's warning (`a13-03-cricket#2`), "sick of being a puppet" and the Fairy's reply
(`a13-16-water-done#2–3`), the reunion, "get on my shoulders" (`a13-19-babbo#1`, `a13-19-mouth#3`), the thanks to the
Tunny (`A19_THANKS#2`) and the last line (`A20_WAKE#6`). So no `childLines` are needed. The header lists where each one
is, so it can be swapped in if it's verified later. The A13-15 stone uses our own softened words.

## Flags

- **Read (Grove, read-only):** `s21Done` (Clank comes), `s25Done` (Clank's "next door" line).
- **Written (Atlas save only):**
  - `a13-01`…`a13-20` and `a13-done`;
  - `a13-cricket` = carried | left (A13-3, the signature choice);
  - `a13-crust` = given | kept (A13-20);
  - `a13-clank-word` = true, set by the word scenes. S25 reads it by this exact name.
- No Grove flag is written.

## Variants (`A13_VARIANTS`)

- **Clank (`s21Done`):**
  - `a13-01-page-clank` (A13-1 step 1 scene);
  - `a13-05-coat-clank` ("Is that a job?");
  - `a13-19-complete-clank` ("He doesn't have it either");
  - `a13-20-complete-clank`, then `a13-20-word`, or `a13-20-word-next-door` with `s25Done`. Both word scenes set the
    flag.
- **Cricket carried:**
  - `a13-10-doctors-done-carried` (the nod);
  - `a13-18-sea-carried` ("He was right");
  - `a13-20-hut-carried` ("And thank your friend for the hedge").
- **Grove keepsakes** (played in the Grove; they read `atlasFlag('a13-clank-word')` and write nothing):
  - `a13-grove-clank-dusk`, the once-only "Love. I'm only saying it once…";
  - `a13-grove-pixel`, the Pixel scene;
  - `a13-grove-clank-idle`, Clank's new idle pool ("just here").

The signature choice is A13-3. It pays off in A13-10 (7 quests later), A13-18 and A13-20.

## SIM needs

- The Atlas reads `s21Done` and `s25Done`. With Clank, he is drawn in every scene on the page with a fold-out ramp
  (an animation, never a puzzle).
- The Grove reads `atlasFlag('a13-clank-word')` for the three keepsake scenes and Clank's idle pool. The dusk scene
  plays once, at the first dusk when Nubbins are on him, and the Pixel scene plays once at the lantern shed.
- The Long Table festival reads `atlasDone('A13')`.
- `race:a13-assassins:white-house` and `swim:a13-alidoro:sea` can't be lost.

## Rewards

All one-time:

- Donkey-ears hat (A13-18);
- the Dog-fish's green-bottle candle (A13-19, glows at night);
- Geppetto's workbench with a half-carved wooden Nubbin (A13-20; the carving starts in A13-5);
- the Long Table Bookmark (A13-20).

## Changes from the outline, and why

- **Two outline beats merged into each of three quests.** A13-17 holds the trick, the fight, Alidoro and the Green
  Fisherman in 4 steps, with the snail and "tomorrow you'll be a boy" in its complete. A13-18 holds the Land of Toys,
  the circus and the sea. A13-20 holds the beggars, the hut, the wheel and Candlewick, and the coat money.
- **Collodi's ghost of the cricket on the night road (ch. XIV)** becomes one faint "cri" in a hedge (A13-8), so he is
  never shown dead.
- **Cut for 'all':**
  - the serpent who laughs himself to death;
  - the girl's "everyone here is dead" (she is "going away");
  - the rabbits' coffin;
  - the Cat eating the blackbird.
- **"Strings" is kept off the page.** Collodi's boys tie threads on him; here they hang caps on his nose. The hut's
  sign says "PULL THE CORD".
- **The crust's "last beat"** is the last beat of the beggars' scene: the blind Cat thanks Pinocchio for your crust.
  It is not a separate ending variant.
- **How "you" get into the Dog-fish:** the drum man lends you his boat, and it is swallowed too. The atlas "turns its
  own pages" over Collodi's time gaps.
- **No Learning Grove (edu) version in this file.** The outline wants one; it's a separate job, as with A11.

## For Maor

- **Murray quotes:** all eight are paraphrased. If someone checks them against a scan of the 1892 or 1911 text, they
  can go in verbatim, with `childLines` added.
- **Adviser:** the outline asks for an Italian adviser (names, Tuscany, the commedia masks).
- **Your call:** Candlewick's death (A13-20) is plain: he stops breathing with his head in Pinocchio's lap. Say if
  you want it gentler for the Learning Grove.
