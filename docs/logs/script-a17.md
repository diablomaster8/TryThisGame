# Log: A17 The Camphor Tree

File: `REPO/src/content/atlas-a17.ts`. Exports `ATLAS_A17`, `A17_VARIANTS`, `ATLAS_A17_FLAGS`, `ATLAS_A17_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a17.mts`, adapted from
A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, flags and checks lists exact, every check uses an existing verb with an `a17-` id.

## Counts

- Quests: 16 (A17-1 to A17-16), audience `all`, chained by `requires`.
- Steps: 39 (2–3 per quest).
- Scenes: 97 (77 in the quests, 20 variants).
- Lines: 685, counting choice `then` lines (549 in the quests, 136 in the variants).
- Choices: 41 choice points (33 in the quests, 8 in the variants), 93 options. Every quest has at least one.
- Checks: 39, one per step.

## Lifted text

None. Part M lists two one-sentence lines from the Disney 2005 dub (Granny on the soot sprites, A17-2; the father on
meeting the spirit, A17-6), both still [unverified] against the licensed track. As with every other line's
[unverified] text, both beats are told in our own words: `a17-02-granny#6` and `a17-06-found#9`. The notes on each say
where a verified line may go, with a `childLines` entry. That stays within the "at most three, from the outline"
rule. No songs, no lyrics, no humming; the music in A17-11 is described only. So no `childLines` are needed.

## Flags

- **Read (Grove, read-only):**
  - `s1Done`, once, when A17-11's second step begins: it picks the charm-planting variants and the oak.
  - The ending id, only to tell `moss-sleeps` apart, for the Grove oak scene.
- **Written (Atlas save only):**
  - `a17-01`…`a17-16`;
  - `a17-done` (A17-16);
  - `a17-tunnel` = hunt | wait (A17-6, the signature choice);
  - `a17-tree` = oak | camphor (A17-11's complete scene).
  - No Grove flag is written.

## Variants (`A17_VARIANTS`)

- **Tunnel = hunt** (A17-6 → A17-9, 14, 15, 16; the scenes as written are the wait path):
  - `a17-09-wait-hunt` replaces the Q9 step 2 scene: you see only two enormous feet. The done scene was made neutral,
    so both paths share it.
  - Q14: `a17-14-tunnel-hunt`, `a17-14-tunnel-hunt-done`, `a17-14-call-hunt`, `a17-14-call-hunt-done` and
    `a17-14-complete-hunt`. The hedge stays a hedge for you, and you search with Kanta on his uncle's bicycle.
  - Q15: `a17-15-statues-hunt`, `a17-15-sign-hunt`, `a17-15-sign-hunt-done` and `a17-15-complete-hunt`. You reach
    the statues as the Catbus leaves, and Kanta can't see it.
  - Q16: `a17-16-window-hunt`, `a17-16-corn-hunt`, `a17-16-corn-hunt-done` and `a17-16-complete-hunt`. You watch
    from the road below, and the father lifts a hand to you.
- **s1Done:** `a17-11-dance-charm` replaces `a17-11-dance`, and `a17-11-complete-oak` replaces `a17-11-complete`.
- **Grove keepsake** (on the first return to the Grove after A17-11):
  - `a17-grove-oak`, then `a17-grove-oak-acorn`: Moss's line, verbatim from the outline, and the first acorn back
    on the string;
  - `a17-grove-oak-sleeps`, for the `moss-sleeps` ending: the oak over his flower, Nubbins asleep in its shade;
  - `a17-grove-camphor`, without s1Done.

The signature choice (Q6) pays off at Q9, three quests later, and again in Q14, Q15 and Q16.

## SIM needs

- **The keepsake** appears on the next return to the Grove after A17-11 (not after A17-16). It is read through the
  `atlasFlag('a17-tree')` lookup that A11 already asks for, beside `atlasDone(id)`.
  - Oak: a full-grown oak on the western hill by Moss's flat stone. If chapter 10 has begun and no ending is set yet,
    the oak appears but its scene waits until the ending is known.
  - Camphor: a potted decoration.
  - Each Grove scene plays once.
- **The acorn charm** loses its acorn at A17-11 (the empty string stays) and gets the oak's first acorn back in the
  oak scene.
- **The Long Table festival** reads `atlasDone('A17')`.
- **The bus-stop bench** is decor only: no bus, no timer.
- The seed-bed waiting is narrated, not a daily check.

## Rewards (all one-time)

- Big-leaf umbrella hat (cosmetic, Q9).
- The oak on the hill (feature) or the potted camphor tree (decor), Q11, by `s1Done`.
- Country bus-stop bench (decor), ear of corn (decor) and the Long Table Bookmark (item), Q16.

## Changes from the outline, and why

- **No quotes** (see Lifted text above).
- **Without s1Done the spirits leave a small black camphor seed, not an acorn.** An acorn can't come home as a
  camphor tree; the seed keeps the outline's "potted camphor".
- **The oak appears after A17-11, not after the whole page.** That's when it is planted, and "when you step back into
  the Grove" reads best straight after the dance.
- **Moss's autumn acorn is folded into the oak scene** (`a17-grove-oak-acorn`). The atlas opens in early autumn
  (chapter 8), so the scene already plays in autumn or later, and a separate seasonal trigger would be a timer.
- **The spirit's name is never used.** Mei says he told her "a big rumbly one". It's a Ghibli trade mark, and the
  outline avoids it too.
- **Kanta lives with Granny**, so you lodge in his house, and the telephone is at his uncle's big house, as the
  outline says.
- **Q12's third step is "sit with the sisters"**, so Satsuki crying in Granny's lap carries a choice: Mei, Satsuki,
  or the kettle. Hazel's third rule is acted there, at the seed bed and at the oak, and never quoted.
- **Q16's "To Mother"** is scratched by Mei's hand guided by Satsuki's (Mei is four). The Catbus's paw sets the corn
  on the sill.
- **The oak stands by Moss's flat stone on the western hill, not by the pond.** The task note said "by the pond",
  but the outline (twice), canon 15 and the bible all put Moss's flat stone and flower on the hill. The `moss-sleeps`
  version needs the oak over his flower. If it should be by the pond after all, change `a17-grove-oak*` line 1 and the
  A17-11 reward text.

## For Maor

- **Licence.** This page can't ship without a Studio Ghibli licence. The spirits, the Catbus and the soot sprites
  must be the licensed designs or not appear. The header says so.
- **Japanese advisers.** Part M asks for them on the shrine, the Jizo, the house, the bath and the family words
  before ship. The care notes in the header and in each quest's notes are written to hand to them.
- **The two dub lines.** If someone checks them against the licensed Disney 2005 track, they can go in at
  `a17-02-granny#6` and `a17-06-found#9`, each with a `childLines` entry.
- **Your call: the oak's place.** The hill by Moss's stone (as written), or the pond (as the task note said).
- **No Learning Grove (edu) versions** are in this file, as for A11. Part M wants one (acorns to trees, kusunoki,
  1950s countryside, onee-chan and obaa-chan, the rainy season). It's still to do.
