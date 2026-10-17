# Script log: A28 The Box of Stories (Anansi)

File: `src/content/atlas-a28.ts` (exports `ATLAS_A28`, `ATLAS_A28_VARIANTS`, `ATLAS_A28_FLAGS`,
`ATLAS_A28_CHECKS`). Audience `all`.

## Counts

- Quests: 12 (A28-1 to A28-12, chained by `requires`).
- Steps: 35. Scenes: 89 (78 in quests, 11 variants). Lines: 493, counting choice `then` lines. Choices: 47.
- Checks: 35, all from the existing verbs.

## Validation

- `tsc` (the brief's single-file command): clean. `eslint`: clean.
- A self-check script found no problems: ids are unique, every `requires` exists, every `who` is declared, no line is over 160 characters, no narrator line has three or more sentences, there are no em dashes, the flag and check lists match what the file uses, and every step scene has 6 to 16 lines.

## Lifted text (Rattray, *Akan-Ashanti Folk-Tales*, Clarendon Press, 1930)

On 2026-10-15 I checked all six of the outline's passages again myself, against the Internet
Archive OCR text (item `akanashantifolkt0000ratt`). All six match. Each line has a `childLines`
replacement.

1. The preface's disclaimer: `a28-01-stool#1`.
2. "They say that Kwaku, the Spider, was there,": `a28-09-sweep#1` and `a28-12-return#3`.
3. Ntikuma's line, split over two lines for the 160-character cap, with "(for shame)" dropped: `a28-09-tree#5` and `#6`.
4. "Clear out, you and your old-fashioned sayings.": `a28-09-tree#8`.
5. The "tesee!" fragment, with a capital "And": `a28-09-scatter#3`.
6. The closing formula, with "(or)" set plain: `a28-12-complete#1`.

The Sky-god's price and blessing (A28-2 and A28-7) are retold in our own words. The book's
illustrations are not used.

## Flags

- **Grove flags read:**
  - `wisp`: spared or sable brings Wisp; driven and unset are handled separately.
  - `stoneUnmadeBy`: art only. When it is `wisp`, Wisp doesn't tremble.
  - `s24Done`: Hazel's margin note.
- **Grove flags written:** none.
- **Atlas flags written:**
  - `a28-01` to `a28-12` and `a28-done`.
  - `a28-fairy` (freed, left or sat): the signature choice, made in A28-6 and paid off in A28-9, A28-10 and A28-12.
  - `a28-wisp` (came).
  - `a28-trade` (wisp or nubbin).
  - `a28-gate` (unknown or back), only in the driven variant.

## Variants (`ATLAS_A28_VARIANTS`)

- `a28-margin-hazel` (s24Done).
- `a28-02-road-wisp` (wisp spared or sable). It sets `a28-wisp` and strikes the trade.
- `a28-08-debt-wisp`: the last hornet and Fern's old left glove ("warm. was warm."). The base scene is the buttercup trade for one word ("Ananse").
- `a28-09-scatter-done-freed` and `-sat`. The base scene is for left.
- `a28-10-dance-done-freed` (Mmoatia tips the hat off herself) and `-sat` (a cool leaf afterwards). The base scene is for left.
- `a28-12-tell-freed` ("a clever one") and `-sat` ("a kind one"). The base scene is "a true one".
- `a28-12-last-wisp` (the story of the grey thief with the cold stone, which Wisp carries away) and `a28-12-last-driven` (the gate; "I don't know" or "He comes back").
- The base `a28-12-last`, for Wisp unset, pays off the buttercup trade.

## SIM needs (in the notes above the variants block)

- **The story box:** a feature by the cottage hearth, turned on by `atlasDone('A28')`. When opened in the evening it plays a finished Atlas page in Nubbin mime. The page is picked with the seeded random generator. It is unlimited and never once a day.
- **Wisp's ambient:** with `a28-trade` = wisp, his spot under the step shows the stone and the empty hornet gourd, stoppered (not the glove: Wisp traded it to Ananse in `a28-08-debt-wisp`). Sometimes (seeded) he drags the box to the step.
- **The gourd decoration:** tips over now and then (seeded) and spills sparkles.

## Changes from the outline

- **Quest order, merges and splits:** unchanged. Each quest has 2 to 3 steps.
- **Rewards:**
  - The doll cushion comes from A28-6.
  - Ya Nsia gives the shawl in A28-7.
  - The gourd comes from A28-9.
  - The story box comes from A28-12.
- **Mmoatia returns in A28-9 and A28-10** after going up in A28-7. A28-7's complete scene adds one line: "Fairies are hard to keep." That way the fairy payoffs make sense, and Nyame is not shown breaking his word.
- **With Wisp driven,** the A28-8 trade is your Nubbin's (the base scene). The outline names only spared and unset.
- **A28-12's last story:** with Wisp unset, the storyteller tells a short buttercup story, so the base scene has a payoff. The outline gives the unset case no Q12 scene.
- **Margin note timing:** it plays after A28-1's complete scene. The outline doesn't say when.

## For Maor

- **Akan advisers, for these placeholders:**
  - The storyteller's name, "Nana Ama".
  - The children's call-back, "Tell it anyway!", and the closing reply, "Some come back!".
  - The funeral (A28-10).
  - Nyame's court, which is shown only as a voice and a light.
  - The odum tree.
  - Mmoatia's look.
  - Cloth and dress.
- **Jamaican writers:**
  - A28-11's elder ("Miss Ivy") and the boy are placeholder plain English. A Jamaican writer should write those lines, or they ship plain.
  - The single sentence about slavery is `a28-11-step#5`.
- **The words "tar baby"** appear nowhere. The doll is a plain carved wooden doll.

Sources checked: [Rattray 1930, Internet Archive OCR text](https://archive.org/stream/akanashantifolkt0000ratt/akanashantifolkt0000ratt_djvu.txt), [the item page](https://archive.org/details/akanashantifolkt0000ratt).
