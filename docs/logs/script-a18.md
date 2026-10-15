# Log: A18 The Doll in the Pocket

File: `REPO/src/content/atlas-a18.ts`. Exports `ATLAS_A18`, `ATLAS_A18_VARIANTS`, `ATLAS_A18_FLAGS`, `ATLAS_A18_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a18.mts`, adapted from
A11's) finds 0 problems:
- ids are unique, and every `requires` resolves;
- every `who` is declared;
- every line is ≤ 160 characters, and narrator lines are ≤ 2 sentences;
- step scenes have 6–16 lines;
- every lifted line is keyed in `childLines`;
- the flags and checks lists are exact.

## Counts

- Quests: 16 (A18-1 to A18-16), audience `all`, chained by `requires`.
- Steps: 46 (3 per quest; A18-9 has 2).
- Scenes: 122 (108 in the quests, 14 variants).
- Lines: 677, counting the `then` lines of choices.
- Choices: 34 choice points, 81 options. Every quest has at least one.
- Checks: 46. They use only existing verbs, and every object is prefixed `a18-`.

## Lifted text (Magnus 1915, PG #62509, as Part M verified it; each one has a `childLines` entry)

1. "Vasilísushka, hear my last words. I am dying, and I will leave you my mother's blessing and this doll." Mother, `a18-01-counterpane#4`.
2. "Keep this doll always by you, but show it to nobody, and no misfortune can befall you." Mother, `a18-01-counterpane#6`.
3. "Vasilísa often ate nothing herself, and kept the tastiest morsels for the doll;" (a fragment, plus our own clause). Narration, `a18-02-cellar#2`.
4. "Dollet, eat and listen to my misery." Vasilisa, `a18-02-cellar#3` and `a18-06-ask#4`.
5. "Eat, pray, and lie down to sleep, for the morning is wiser than the evening." The doll, `a18-10-night#3`.
6. "Ask, but not every question turns out well: too knowing is too old." Baba Yaga, `a18-12-supper#3`.
7. "By my mother's blessing!" Vasilisa, `a18-12-blessing#2`. Baba Yaga's "Ah, then, get off with you…" reply is at `a18-12-blessing#4`.
8. "and the doll ever remained in her pocket." (a fragment, inside our own sentence). Narration, in `a18-16-complete#5`, `-doll#6` and `-self#6`.

Gutenberg was blocked from here too, so I couldn't recheck these myself. I used Part M's verified wording exactly, with curly
quotes. The stress accents (Vasilísa, Vasilísushka) are kept inside the quotations only; elsewhere the name is spelled
Vasilisa. Other phrases from the tale are reworded: Baba Yaga's call to her servants, the sisters' "go to Baba Yaga for
fire", and the doll's other comforts. The "Russian smell" rhyme is cut.

## Flags

- **Read (Grove, read-only):**
  - `s24Done` plays `a18-02-margin-hazel`.
  - Sable bonded plays `a18-16-sable`.
- **Written (Atlas save only):**
  - `a18-01` to `a18-16`;
  - `a18-done`;
  - `a18-crust` = nubbin | doll | self (A18-9).
- No Grove flag is written.

## Variants (`ATLAS_A18_VARIANTS`)

In each case below, the scene in the quest itself is the nubbin path.

- `a18-02-margin-hazel` plays after `a18-02-promise-done` if `s24Done` is set. Otherwise it plays the next time the page is
  opened after S24. Hazel's note is used word for word.
- `a18-10-chores-doll` and `-self` replace `a18-10-chores`.
- `a18-11-poppy-self` replaces `a18-11-poppy` (that scene covers both nubbin and doll).
- `a18-12-gate-doll` and `-self` replace `a18-12-gate`, the step 3 done.
- `a18-13-dark-doll` and `-self` replace `a18-13-dark`.
- `a18-15-loom-done-doll` and `-self` replace `a18-15-loom-done`.
- `a18-16-shirts-self` replaces `a18-16-shirts`.
- `a18-16-complete-doll` and `-self` replace `a18-16-complete`.
- `a18-16-sable` plays after `a18-16-complete*` if Sable is bonded.

**Signature choice: the crust (A18-9).** It pays off in A18-10, A18-11, A18-12, A18-13, A18-15 and A18-16, up to seven
quests later.

## SIM needs

- **Keepsakes.** The doll charm is a cosmetic pouch on a cord. The handkerchief cloth (doll path) lines your Nubbin's bed in
  the Grove. That bed lining needs a read-only `atlasFlag('a18-crust')` lookup beside `atlasDone(id)`.
- **Long Table festival.** It reads `atlasDone('A18')`. When it does, it lays one empty place with the best morsels, "for
  the doll".
- **Q16 rewards.** Grant only the keepsake that matches `a18-crust`:
  - nubbin: `a18-yaga-oats`;
  - doll: `a18-hanky-cloth`;
  - self: `a18-shirt-button`.
  The doll charm and the bookmark go to every path. All rewards are one-time.
- **Grove reads.** `s24Done` and Sable's bonded state are read for the two variants.
- **Two small minigames.** `puzzle:a18-busy:yard` and `feed:a18-doll:cellar` (laying out morsels in the dark) can't be
  failed.

## Changes from the outline, and why

- **A18-11:** the outline mixes earth "into the hay" and then has the hands carry off poppy seed. I used Afanasyev's task,
  earth mixed into Baba Yaga's poppy seed, so that the poppy-seed oil makes sense.
- **Lifted line 5** is used once (A18-10), not in A18-6 as well. In A18-6 the doll tells her to go, so a "lie down to sleep"
  line there didn't fit. The doll says it in our own words instead.
- **Keepsakes by path.** The outline lists three take-homes but doesn't say which goes with which path.
  - The doll path takes home the cloth.
  - The nubbin path takes home a bag of oats. Baba Yaga gives it with her "feeds others first" line.
  - The self path takes home the button from the shirt you sew. Its handful of wage oats is fed to your Nubbin in A18-13,
    which is "feed them first", late.
- **A18-6:** the Keeper lays out the doll's supper in the dark. This uses what Q2 taught you, and it gives the `feed` check a
  real action.
- **A18-9** has only 2 steps; it needed no more.
- **New beats.** I added the merchant's "something for my pocket" (a silver thimble she keeps in her other pocket). The
  atlas skips the years, and you never age on the page.
- **No Learning Grove (edu) versions** are in this file. The outline wants one (on flax to linen, birch forests, the
  riders as the sky's colours, and sharing food). The brief asks Atlas lines only for `childLines`, so the edu file is
  still to do.

## For Maor

- **Adviser.** Part M asks for an East Slavic folklore adviser before scripting. None has been consulted, so treat this as
  a draft pending that review. On screen, no country is named, and there are no flags or state symbols.
- **Softening.** The skull's stare drives the stepmother and sisters out in the night. They are gone, not dead, and there
  is no burning. Please check you're happy with that.
- **Your call:**
  - the doll's speaker name stays Magnus's "Dollet";
  - the stress accents are kept only inside the quoted lines.
  Say if you'd rather have "Little Doll", or no accents anywhere.
