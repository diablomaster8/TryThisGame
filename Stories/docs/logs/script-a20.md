# Log: A20 The Weeping

File: `REPO/src/content/atlas-a20.ts`. Exports `ATLAS_A20`, `ATLAS_A20_VARIANTS`, `ATLAS_A20_FLAGS`, `ATLAS_A20_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a20.mts`, adapted from
A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, every lifted line keyed in `childLines`, flags and checks lists exact.

## Counts

- Quests: 17 (A20-1 to A20-17), audience `all`, chained by `requires`.
- Steps: 47 (2–3 per quest).
- Scenes: 94 (80 in the quests, 14 variants).
- Lines: 593, counting choice `then` lines.
- Choices: 20 choice points (19 in the quests, one in a variant), 59 options. Every quest has at least one.
- Checks: 47, all with existing verbs, all objects prefixed `a20-`.

## Lifted text (Brodeur, *The Prose Edda*, 1916, Gylfaginning; verbatim, each used once, each with `childLines`)

Only the five passages Part M checked against the sacred-texts copy of Brodeur:

1. "He is so fair of feature, and so bright, that light shines from him." (ch. XXII) `a20-01-hall#3`, narration.
2. "There grows a tree-sprout alone westward of Valhall: it is called Mistletoe; I thought it too young to ask the oath
   of." (ch. XLIX) `a20-05-talk#5`, Frigg.
3. "But when the Æsir tried to speak, then it befell first that weeping broke out, so that none might speak to the
   others with words concerning his grief." (ch. XLIX) `a20-06-fall#5`, narration.
4. "If all things in the world, quick and dead, weep for him, then he shall go back to the Æsir;" (ch. XLIX)
   `a20-10-hall#6`, Hel. Our own words finish her sentence at `#7`.
5. "and all men did this … into the heat." (ch. XLIX) It's split over `a20-11-stones#5` and `#6` to stay under 160
   characters. `#5` opens with an ellipsis to mark the excerpt, and Brodeur's double hyphen is set as an em dash.

**Not quoted:** passages 6–8 (ch. LI, the Fimbulwinter; ch. LIII, the green earth and Baldr and Hödr from Hel). Part M
checked those only through a course reader, so I treated them as unverified. Their beats are in our own words at
`a20-15-plain#1`, `a20-17-green#0–1` and `a20-17-old-ground#4–5`, and the notes say where to swap Brodeur in once
they're checked. I couldn't recheck anything myself: the sandbox proxy blocks sacred-texts.com. Thökk's verse is left
out, and she refuses in plain speech.

## Flags

- **Read (Grove, read-only):**
  - `cinder` (forgiven | remembered);
  - `keptStone`;
  - `s24Done`.
- **Written (Atlas save only):**
  - `a20-01`…`a20-17`;
  - `a20-done`;
  - `a20-thokk` = plead | sat | walked (A20-12).
  - No Grove flag is written.

## Variants (`ATLAS_A20_VARIANTS`, 14)

- **`cinder` inserts:**
  - `a20-01-ember`: after `a20-01-page`'s choice.
  - `a20-11-ember`: after `a20-11-stones`. The ember sets the frost weeping faster.
  - `a20-15-ember-forgiven` (burns steady) or `a20-15-ember-remembered` (flickers, never goes out): after
    `a20-15-company`'s choice.
  - `a20-17-ember`: after `a20-17-green`. Líf asks where the ember came from; you can say "From someone who held on
    too tight, once." or say nothing. No flag.
- **`keptStone` inserts:**
  - `a20-12-kept`: after `a20-12-cave`'s choice. Thökk says "You understand." and "Keep what you have."
  - `a20-15-kept`: at the same point as the ember insert. The stone hums *safe*, and the pair sit further off.
  - `cinder` and `keptStone` can't both hold, because S19 needs the stone unmade.
- **`s24Done`:** `a20-margin-hazel`, Hazel's note beside the cave. Its text matches S24's notes exactly, split over two
  quoted lines plus "And under it, one letter: H.", in A11's style.
- **`a20-thokk` replacements** (the default scenes are for plead):
  - `a20-14-bowl-sat` / `-walked`;
  - `a20-16-edge-sat` / `-walked`;
  - `a20-17-complete-sat` / `-walked`.

The signature choice is A20-12. It pays off in A20-14 (two quests later), A20-16 and A20-17, which meets "three or more
later". The A20-17 complete decides who sits closest to Hödr: you (plead), Baldr (sat, with his line "You sat with the
one who wouldn't weep. Someone should."), or no one at first (walked).

## SIM needs

- **Price of Power festival:** it reads `atlasDone('A20')` from `a20-done`.
- **The Weeping Stone** (decor by the pond): it shows a drip-and-sparkle while the Grove's sun is on it, and is dry
  otherwise. No timer, no yield.
- **Atlas reads (read-only):** `cinder`, `keptStone` and `s24Done`. The margin note stays drawn on the page once it
  has played.
- **Your Nubbin's little lantern** with Cinder's Ember is a prop on this page only.
- **The intro card** (`a20-01-page#1–3`) and the **content card** (`a20-06-field#0`) are shown as cards, not dialogue.

## Rewards (all one-time)

- Frigg's Spindle (decor, A20-3).
- The Weeping Stone (decor, A20-11).
- At A20-17:
  - the Mistletoe Sprig (a cosmetic, whose description tells its story in two plain lines);
  - the Golden Game Piece (decor);
  - the Price of Power Bookmark (item).

## Changes from the outline, and why

- **A20-7's order.** Snorri's Hermódr rides off at once, and the funeral is told while he's away. Here he waits to see
  the ship off and rides at first light, so you can be at the shore in A20-8 and ride behind him in A20-9.
- **Small inventions**, all noted in the file:
  - Frigg spins a thread for each promise. This is where the spindle reward comes from.
  - Fulla speaks.
  - Hödr is at the shore.
  - You can lay a gift on the ship.
  - Sigyn has a second bowl for the sat path.
  - Thor makes one small joke while they knot the net.
- **Loki is named first in A20-13.** The old woman and the voice at Hödr's elbow are never given a face. Sigyn's sat
  line ("the one who sat down, in the cave mouth") hints at who Thökk was without saying it.
- **No Learning Grove edu version is in this file.** The outline wants one: softened, with no lifted text. The script
  brief asks Atlas lines only for `childLines`, so the edu version is still to do, as it is for A11.
- **No quests were merged or split.**

## For Maor

- **The Heathen adviser was not consulted.** The care notes ask for an adviser from an inclusive Heathen organisation
  *before scripting*. I couldn't do that from here, so the header asks for their read before ship. Treat the script as
  a draft until then.
- **Three Brodeur passages (ch. LI and LIII) are paraphrased.** If you can check them against Brodeur, they can go in
  verbatim with `childLines`. Passages 1–5 also rest on Part M's check; I couldn't reach sacred-texts to recheck them.
- **Your call:** in A20-12, Thökk calls her refusal weeping "with dry eyes". That's the idea of her verse, not its
  wording. Say if you'd rather she didn't echo the verse at all until it's checked.
