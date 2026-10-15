# Log: A19 The Dragon Who Fell

File: `REPO/src/content/atlas-a19.ts`. Exports `ATLAS_A19`, `A19_VARIANTS`, `ATLAS_A19_FLAGS`, `ATLAS_A19_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a19.mts`, adapted
from A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator
lines ≤ 2 sentences, step scenes 6–16 lines, both lifted lines keyed in `childLines`, flags and checks lists exact.

## Counts

- Quests: 18 (A19-1 to A19-18), audience `all`, chained by `requires`.
- Steps: 52 (2–3 per quest).
- Scenes: 99 (91 in the quests, 8 variants).
- Lines: 662, counting choice `then` lines.
- Choices: 25 choice points, 68 options. Every quest has at least one.
- Checks: 52, all with existing verbs, all prefixed `a19-`.

## Lifted text (2010 film; two of the allowed three; each used once, each with a `childLines` entry)

1. "It's twelve days north of Hopeless, and a few degrees south of Freezing to Death." Hiccup, `a19-01-arrive#6`
   (the film's opening narration, said here to you on the jetty).
2. "I wouldn't kill him, because he looked as frightened as I was." Hiccup, `a19-14-astrid#5`.

Source: the film as widely quoted (Sideshow's list), as Part M gives them. Both must be checked against the licensed
script. Everything else is original. I steered clear of famous film lines at the same beats ("go for the kill",
"kill on sight", "I'm not one of them", "I looked at him and I saw myself", the disowning and "proud to call you my
son", "occupational hazard", "I could've sworn you had…", "probably something stupid", Fishlegs's shot limits,
"Welcome to dragon training").

## Flags

- **Read (Grove, read-only):** `sableFirst`.
  - Q8 step 2: slow → `a19-08-hand-slow`, grab → `a19-08-hand-grab`, unset → the base `a19-08-hand` (no memory line).
  - Q18: slow or grab → the complete scene carries "Some things come back if you wait. Some things you have to wait
    for twice."; unset → the `-unset` complete variants, without it.
- **Written (Atlas save only):** `a19-01`…`a19-18`; `a19-done` (Q18); `a19-first` = crouch | ran (Q4,
  `a19-04-bound`). No Grove flag is written.

## Variants (`A19_VARIANTS`)

- `a19-08-hand-slow`, `a19-08-hand-grab` replace `a19-08-hand` (sableFirst).
- `a19-08-near-ran` replaces `a19-08-near` (a19-first = ran).
- `a19-11-turn-ran` replaces `a19-11-turn` (ran).
- `a19-18-village-done-ran` replaces `a19-18-village-done` (ran).
- `a19-18-complete-ran` replaces `a19-18-complete` (ran, sableFirst set).
- `a19-18-complete-unset` (crouch) and `a19-18-complete-ran-unset` (ran) replace it when sableFirst is unset.

The signature choice (Q4: crouch or run) pays off in Q8 (4 later), Q11 (7 later) and Q18 (14 later). The last image
is Toothless's fish at your Nubbin's feet (crouch) or the long wait on the cliff that ends with him sitting down
beside you (ran). The saddle is given either way.

## SIM needs

- **Great Voyage festival** reads `atlasDone('A19')` (A2, A6, A9, A10, A12, A14, A19; any two).
- The Atlas reads Grove `sableFirst` across saves (read-only), as Part M's `atlasDone` read does in reverse.
- **Tail-fin saddle** is a Nubbin cosmetic wearable in the Grove.
- `minigame:a19-bellows:forge` can't be lost. `choose:a19-match:pens` is a small matching puzzle with a fixed answer
  (Nadder–Astrid, Nightmare–Snotlout, Zippleback–twins, Gronckle–Fishlegs).
- S24's margin note for this page ("I'd have fed the dragon…") sits on Q7; S24 owns it, and it isn't scripted here.

## Rewards (all one-time)

- Hiccup's sketch of Toothless (decor, Q6).
- Hiccup's fish basket (decor, Q7; it goes by the pond).
- Dragon-scale shield (decor, Q10, from Gobber; it goes over the cottage door).
- Tail-fin saddle (cosmetic, Q18).
- Great Voyage bookmark (item, Q18).

## Changes from the outline, and why

- **Q8 splits its two reads.** Step 2 (the hand) reads `sableFirst`, and step 3 (Toothless and your Nubbin) reads
  Q4's choice. That way all four combinations work with three variants instead of six.
- **Q12 is the next evening, and you ride.** The outline has you "quiet with them on the flight home", so you have to
  be on Toothless. To keep Q11's payoff intact (in the ran path Toothless won't let your Nubbin ride), Q11's flights
  happen without you, and Q12 opens the next evening. Toothless grudgingly carries four, and your Nubbin rides
  buttoned inside your coat.
- **Q11's Nubbin flight is a short extra round** after Astrid's flight, so that the payoff (Nubbin in Hiccup's lap,
  or Toothless watching from the ground) is its own beat.
- **Reward placement.** The outline lists the rewards without quests. The sketch is in Q6, where Hiccup draws, the
  basket in Q7, the fish, the shield in Q10, from Gobber "for the help", and the saddle and bookmark in Q18. The
  small saddle is set up by Gobber nearly catching the forge work in Q9.
- **Stoick's disowning is narrated** (one line, no words given), for the care note and to avoid the film's line.
- **The Red Death is the quest title only.** In dialogue it's "the thing from the pit". The great dragon's end is
  seen from far down the beach.
- **The trigger reads "the Dragon Who Fell page"**, following A11.
- **No Learning Grove (edu) versions are in this file.** As with A11, the outline wants one, but the script brief asks
  Atlas lines only for `childLines`. The edu file is still to do.

## For Maor

- **Licence.** This page can't ship without a licence from DreamWorks Animation (Universal). The character names
  are also Cowell's. Both are flagged in the header.
- **Check both lifted lines** against the licensed script. If either is off, swap it, or drop it and use the
  `childLines` text, which is original.
- **The waking scene (Q18)** wants a review by an adviser with a limb difference before ship. The care note is in
  the header and the quest notes.
- **Your call:** in Q12 the Keeper rides along to the nest (the outline implies it). If you'd rather the Keeper
  never rides Toothless, Q12 would need retelling from the cove.
