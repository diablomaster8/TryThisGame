# Log: A16 The Fox and the Rose

File: `REPO/src/content/atlas-a16.ts`. Exports `ATLAS_A16`, `ATLAS_A16_VARIANTS`, `ATLAS_A16_FLAGS`, `ATLAS_A16_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a16.mts`) finds 0
problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160 (longest 147), narrator lines ≤ 2
sentences, step scenes 6–16 lines, every lifted line keyed in `childLines`, flags and checks lists exact, no straight
quotes. A scan finds no "die", "dead", "bite" or "poison" in any player-facing line.

## Counts

- Quests: 17 (A16-1 to A16-17), audience `all`, chained by `requires`.
- Steps: 40 (2–3 per quest).
- Scenes: 102 (83 in the quests, 19 variants).
- Lines: 678, counting choice `then` lines.
- Choices: 33 choice points with 82 options (28 points and 68 options in the quests, the rest in Sable and globe
  variants that repeat a scene's choices). Every quest has at least one.
- Checks: 40, all with existing verbs.

## Lifted text (copyrighted; three one-sentence lines, the limit, each used once, each with a `childLines` entry)

All three are the fox's, from ch. XXI. Each is one dialogue line: the French original as Part M lists it, then Part M's
own English. Set with curly apostrophes and guillemets with no-break spaces. No Woods or Howard wording is used.

1. «L'essentiel est invisible pour les yeux.» / "What matters most can't be seen with the eyes." `a16-13-secret#9`.
2. «C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante.» / "It's the time you gave your rose
   that makes your rose so important." `a16-13-secret#11`.
3. «Tu deviens responsable pour toujours de ce que tu as apprivoisé.» / "You become responsible, forever, for what you
   have tamed." `a16-13-secret#13`.

Edition: the French text of 1943 (Reynal & Hitchcock; Gallimard, 1946), as Part M checked it on 2026-10-14 against a
course copy of ch. XXI. Every other line is original. I steered clear of the book's other famous lines (the sheep "gone
to sleep", "grown-ups are very odd", the drinker's question-and-answer circle, the businessman's sums and star total,
"orders are orders", the geographer's "ephemeral" and "good reputation", the wheat speech, "only the children know
what they are looking for", "it is like a lamp", the laughing-stars speech, "I am responsible for my rose", "it will
look as if I were dead"). The beats are told in our own words, or left out.

## Flags

- **Read (Grove, read-only): Sable's stage**, when A16-1, A16-13, A16-15 and A16-16 start, and when you step out
  after A16-17.
  - none: no Sable in the Grove.
  - t20: present, not bonded, trust under 45 (this includes 10–19).
  - t45: trust 45 or more, not bonded.
  - bonded.
- **Written (Atlas save only):**
  - `a16-01`…`a16-17`;
  - `a16-done`;
  - `a16-strap` = asked | left (A16-2);
  - `a16-globe` = free | glass (A16-5);
  - `a16-sable` = came (the Sable variants of A16-1 and A16-13).
  - No Grove flag is written.

## Variants (`ATLAS_A16_VARIANTS`, 19)

- **Sable:**
  - `a16-01-desert-t45` and `-bonded` replace `a16-01-desert`.
  - `a16-13-fox-t45` and `-bonded` replace `a16-13-fox`. The bonded one has the fox's "That one's already tamed. Look
    how she watches you."
  - `a16-13-hour-t45` replaces `a16-13-hour`: the lesson plays twice, and Sable steps one step nearer at each hour.
  - `a16-13-hour-done-t20`, `-t45` and `-bonded` replace `a16-13-hour-done`. The base is for none: "the hill where
    something small and grey once watched".
  - `a16-15-well-done-bonded` replaces `a16-15-well-done`: Sable drinks first.
  - `a16-16-lean-bonded` is inserted after `a16-16-wall-done`: she leans on your shin.
- **Strap:** `a16-16-muzzle-left` replaces `a16-16-muzzle` (asked).
- **Globe:**
  - `a16-13-secret-done-glass`: the fox turns to you as well.
  - `a16-16-stars-glass` replaces `a16-16-stars` (petal).
- **The last page:** `a16-17-complete` is free and asked. The variants are `-free-left`, `-glass-asked` and
  `-glass-left`.
- **The Grove, after the page:**
  - `a16-grove-t20`: Sable a little nearer the cottage.
  - `a16-grove-luna`: Luna's line, verbatim from the outline. It reads `a16-sable`.
  - `a16-grove-sparks`: "How's it wired?" It plays the first dusk after the lamp is placed.

The signature choice is A16-2's strap. It pays off fourteen quests later, in A16-16 and A16-17. The globe (A16-5) pays
off in A16-13, A16-16 and A16-17.

## SIM needs

- **The Lamplighter's Lamp** is a Grove feature on the hill. It is lit at dusk and out at dawn on the Grove's clock, with
  no interaction.
  - It is not a lantern post. It never counts for `lanternsLit`, chapter goals, Lantern Night or the Long Night.
- **Sable's stage** is a read-only lookup from the Atlas, at quest start. The Grove scenes need
  `atlasFlag('a16-sable')` and `atlasDone('A16')`, beside A11's `atlasFlag`.
- **`a16-grove-t20`** is one-time staging. For that scene, Sable's idle spot is shown a few tiles nearer the cottage.
  There's no trust change and no Grove flag.
- **The page clock** for A16-4's sunsets, A16-9's minute-long days and A16-13's same hour runs inside the page only.
  - A16-13: about two minutes per page day. The hour is the apple tree's shadow on a white stone.
  - There's no fail state, and never a real-time wait.
- **The parent note before A16-16** shows once, for under-10 profiles. The text is in A16-16's notes.
- **The Night of Remembering** reads `atlasDone('A16')`.
- **One reward is granted by flag.** A16-16 lists both the Pressed Petal and the Glass Globe; grant only the one that
  matches `a16-globe`.

## Rewards (all one-time)

- Box with Holes (decor, A16-2).
- The Lamplighter's Lamp (feature, A16-9).
- The Long Scarf (cosmetic, A16-15): the pilot's scarf, so not the prince's.
- The Pressed Petal or the Glass Globe (decor, A16-16).

## Changes from the outline, and why

- **The muzzle in A16-2.** "Ask him to draw a muzzle now": he draws it then, with a strap, but the prince says not
  yet, so the pilot keeps it folded in his notebook. That is how "he remembers the strap" in A16-16. With "leave it",
  the prince asks in A16-16 and the pilot draws it there and then, without a strap, as in the book.
- **The globe's journey.** The petal and globe have to reach the wall in A16-16, so A16-5 sets them up:
  - free: he leaves the globe beside her and pockets a fallen petal;
  - glass: he takes the globe with him, so that it isn't "sitting there looking at her".
  - She refuses the globe either way, as the outline says.
- **"Sable is gone"** is read as no Sable in the Grove. Trust 10–19 counts as the t20 stage: she doesn't come, and she
  sits nearer afterwards. The outline only gave none, 20, 45 and bonded.
- **The Luna and Sparks lines are Grove scenes** in the variants, read from the Atlas save. The Atlas writes no Grove
  flag.
- **The speaker is "The Prince"**, not "The Little Prince": the trade mark stays off on-screen labels. The trigger
  reads "the Fox and the Rose page", as A11 dropped its "The".
- **The scarf reward** is the pilot's flying scarf, given in A16-15, not the prince's. This keeps clear of the book's
  golden muffler and of any hint at the wall.
- **No Learning Grove (edu) version is in this file.** The outline wants a reader-band version that ends at the well.
  It is still to do, and A16-15's notes mark the cut.
- **No Night of Remembering bookmark item.** The outline's rewards don't list one; the festival reads `atlasDone`.
  Other lines in that festival do give a bookmark, so say if you want one added.

## For Maor

- **Licence.** Part M says this page needs a licence to ship, because the quote limit covers the words, not the
  characters. The header marks it and the A16-1 trigger holds it. It still wants a legal check, including the
  trade-mark question of the prince's name.
- **The snake scene.** At the wall, the snake is only a gold line in the sand, and the bite is never shown. The
  camera lifts to the stars, and comes down on the boy lying softly in the sand. Nothing follows that shot until
  morning. Please read A16-16 and A16-17 yourself before it goes to review: it's the one place on the page where
  tone matters most.
- **Your call: the voice.** I've asked for the French to be voiced by a French actor, with our English after it in
  the same voice. Say if you'd rather have the English only, with the French shown on screen.
