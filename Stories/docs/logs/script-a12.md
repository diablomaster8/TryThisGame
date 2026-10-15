# Log: A12 The Mirror Shard

File: `REPO/src/content/atlas-a12.ts`. Exports `ATLAS_A12`, `A12_VARIANTS`, `ATLAS_A12_FLAGS`, `ATLAS_A12_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a12.mts`, adapted from
A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, no straight quotes, flags and checks lists exact, no lifted phrase anywhere.

## Counts

- Quests: 18 (A12-1 to A12-18), audience `all`, chained by `requires`.
- Steps: 50 (3 per quest; 2 in A12-13, A12-14, A12-15 and A12-18).
- Scenes: 130 (118 in the quests, 12 variants).
- Lines: 782, counting choice `then` lines.
- Choices: 53 choice points, 132 options. Every quest has at least one.
- Checks: 50, all with existing verbs.

## Lifted text

**None verbatim.** Part M marks all eight Snow Queen passages [unverified] against PG #1597 (the page was cut off
before the story), and the task note says to lift only verified passages. Each beat is told in our own words:

1. Opening, "let us begin": `a12-01-show#6`.
2. The heart "like a lump of ice": our own image, a stone in a frosty field, `a12-01-shards#7`.
3. Bae, "Who should know better than I?": `a12-10-morning#2`.
4–5. The Finnish woman on Gerda's power and her heart: `a12-12-power#8–9`.
6. The Snow Queen's promise (your own master, the world, new skates): `a12-15-south#7–8`.
7. Kay, "where have you been… where have I been": `a12-16-tears#2`.
8. "grown up, and yet children": `a12-18-roses#4`.

The self-check searches for each passage's key phrase and finds none. I also reworded two of my own lines that used
"lump of ice". Used as names only: "Mirror of Understanding" (which Part M confirmed against #1597 on BookRags) and
Andersen's word ETERNITY in the ice. The rose hymn, Gerda's prayer and Grandmother's Bible reading are narrated and
never quoted. Because nothing is lifted, there are no `childLines`.

## Flags

- **Read (Grove, read-only):**
  - `keptStone`: A12-4, A12-14 and A12-18.
  - `cinder` (forgiven or remembered): A12-1, A12-12 and A12-13.
  - The two are exclusive, because S19 needs the stone unmade.
- **Written (Atlas save only):**
  - `a12-01`…`a12-18`;
  - `a12-done`;
  - `a12-nubbin` = no | night (A12-9, the signature choice).
  - No Grove flag is written.

## Variants (`A12_VARIANTS`, 12)

- `a12-01-ember-forgiven` / `-remembered`: after `a12-01-arrive-done` (cinder).
- `a12-04-kept`: after `a12-04-square-done` (keptStone). Her sledge stops, "You keep things too", and she offers the
  bearskin. Choice: refuse, or step back. No kiss.
- `a12-10-free-night`: replaces `a12-10-free` (night). She gives the Nubbin back unasked: "if I can give one back, I
  can give two".
- `a12-12-ember-forgiven` / `-remembered`: after `a12-12-chimney-done` (cinder). This has the outline's "right size
  for a fire" line.
- `a12-13-wait-forgiven` / `-remembered`: replace `a12-13-wait` (cinder). The ember keeps you from freezing.
- `a12-14-prayer-kept`: replaces `a12-14-prayer` (keptStone). The snowflakes part for you, the stone hums, and you
  don't go in.
- `a12-17-rider-night`: replaces `a12-17-rider` (night). The pigeons are untied. "Mostly."
- `a12-18-pocket`: after `a12-18-roses-done` (keptStone). Grandmother asks why your hand is always on your pocket.
- `a12-18-complete-night`: replaces `a12-18-complete` (night). An untied pigeon lands on the roses. The "no" base has
  your Nubbin alone among them.

The signature choice (A12-9) pays off in A12-10, A12-17 (8 quests later), A12-18 and the Grove petpet's cap.

## SIM needs

- **Cinder's ember on this page.** It's shown in a little lantern carried by your Nubbin. It reads S19's decor
  read-only and is never moved out of the Grove.
- **Rose boxes.** A new decor pair: the cottage sill and the lantern shed, with a plank between. The roses bloom by
  season with no watering chore.
- **Reindeer petpet.** It wears a red cap if `atlasFlag('a12-nubbin') = night`. This needs the same read-only
  `atlasFlag` lookup that A11 asked for.
- **Great Voyage festival.** It reads `atlasDone('A12')`.
- **Cut-paper art style** for the whole page. The frost "window" device is used in A12-15 and A12-16.
- **Checks that can't fail.** The race (A12-4) can't be lost, and the waits (A12-13) have no real-time timer.

## Rewards (all one-time)

- Reindeer petpet and the red cap (A12-17).
- Gerda's rose boxes and the Great Voyage bookmark (A12-18).

## Changes from the outline, and why

- **The frame.** Q1's shadow-show is Grandmother's paper-cut show on the attic wall, with you holding the candle. That
  makes "lodger" concrete from the first scene.
- **Seen from the bush.** Q15 and Q16 are watched through a patch your Nubbin breathes in the frost, where the atlas
  shows the next page. The outline keeps you outside, so you needed a way to see in.
- **Q4.** The keptStone scene sits between Kay's knot and the chase, on the sledge's second round of the square. The
  outline doesn't fix the timing.
- **Q10.** You ride Bae behind Gerda. It's an Atlas liberty, which Bae remarks on.
- **Q12.** Gerda falls asleep by the stove, so her boots and mittens are left behind as in Andersen.
- **Q17.** The Finnish woman gives the boots and mittens back on the way home.
- **The red cap.** Rewards and consequences didn't quite agree, so the robber girl tosses a spare cap to your Nubbin on
  both paths. On the night path, the petpet also wears one.
- **Q6.** The flowers' tales are trimmed to the bindweed, snowdrop, buttercup and narcissus. Andersen's tiger-lily
  (a funeral pyre) and hyacinths (dead sisters) are cut for `all`.
- **Q10.** The pigeons' nest is "cold for a long time", not lost (Andersen kills their siblings).
- **The word in the ice.** Andersen's ETERNITY is named in Q16. Nobody points out the echo of the Grove's Eternals.
- **No Learning Grove edu version is in this file**, as with A11.

## For Maor

- **Lifted text.** All eight Snow Queen passages are paraphrased, because none is verified. If #1597 can be checked in
  full, lines 3 to 8 (which matched Lit2Go) can be swapped in verbatim at the keys above, each with a `childLines`
  entry.
- **The Sámi adviser.** These are open before art:
  - the Sámi woman's dress and house;
  - how the Finnish woman is drawn, and whether that name stands;
  - the petpet design.

  The script never describes the gákti, and both women are unnamed, as in Andersen.
- **Your call on ETERNITY.** It quietly rhymes with Eternals. Say if you'd rather the word stayed unread, seen from
  too far off.
