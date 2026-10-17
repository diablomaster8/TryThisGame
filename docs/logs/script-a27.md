# Log: A27 The White-Haired Prince

File: `src/content/atlas-a27.ts`. Exports `ATLAS_A27`, `ATLAS_A27_VARIANTS`, `ATLAS_A27_FLAGS`, `ATLAS_A27_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output; the file is Prettier-formatted. A self-check
(scratchpad `chk-a27.mts`, not in the repo) finds 0 problems: ids unique, every `requires` resolves, every `who`
declared, lines ≤ 160, narrator lines ≤ 2 sentences, step scenes 6–16 lines, every quest has a choice, every lifted
line keyed in `childLines`, and the flags and checks lists are exact. Registered in `index.ts` and in
`tests/tools/content-check.ts`.

## Counts

- Quests: 17 (A27-1 to A27-17), audience `all`, chained by `requires`.
- Steps: 47 (2–4 per quest).
- Scenes: 123 (111 in the quests, 12 variants).
- Lines: 633, counting choice `then` lines.
- Choices: 21 choice points, 57 options. Every quest has at least one.
- Checks: 47, all existing verbs, all objects prefixed `a27-`.

## Lifted text (Zimmern, *The Epic of Kings*, T. Fisher Unwin, 1883; verbatim, each used once, each with `childLines`)

All eight of the outline's passages were checked word for word against the archive.org scan of the 1883 edition
(identifier `epickingsstorie00zimmgoog`, pp. 33–69). The MIT Classics copy named in the outline now redirects to its
home page, and sacred-texts is behind a bot check, so the 1883 scan was used instead. It is the primary edition.

1. "Then it came to pass that a son was born unto him … like unto that of an aged man." (p. 33) `a27-01-birth#2–3`,
   narration, split to stay under 160 characters.
2. "But when she had brought him her heart was stirred within her for compassion." (p. 35) `a27-03-nest#6`.
3. "When the youth had heard her words … though he had learned their speech." (p. 37) `a27-08-feather#3–4`, split.
4. "…bear with thee this feather from her breast." / "And in the day of thy need … deliver thee from danger."
   (pp. 37–38) The Simurgh, `a27-08-feather#7–8`. The leading ellipsis marks the excerpt.
5. "never again will I harden my heart towards thee" (p. 38), a fragment. Sam, `a27-09-oath#4`. Our own words open
   his sentence ("I swear it, before the one who made us both:").
6. "Not so, O fair one, it would beseem me ill to do thee hurt." (p. 48) Zal, `a27-13-roof#6`.
7. "A clear spring shall issue into the day … there shall not be his like in Iran." (p. 51) The mobed,
   `a27-14-stars#5`.
8. "O my son, wherefore art thou troubled, and why are the eyes of this lion wet with tears?" (p. 69) The Simurgh,
   `a27-17-wings#3`.

No lifted passage contains a name, so none needed respelling. Zimmern's verse riddles, the dream rider's rebuke, the
mobeds' rebuke, Rudaba's "cord without flaw" and Sindokht's "what will you give me to see the sun?" are all
paraphrased. Warner and Warner isn't used.

## Flags

- **Read (Grove, read-only):**
  - Sable's trust stage, at the close;
  - `corvinGate` = family, in A27-7;
  - `s24Done`, for the margin note.
- **Written (Atlas save only):**
  - `a27-01`…`a27-17`;
  - `a27-done`;
  - `a27-feather` = told | sat | night (A27-8, `a27-08-feather`).
  - No Grove flag is written.

## Variants (`ATLAS_A27_VARIANTS`, 12)

- **`s24Done`:** `a27-margin-hazel`. It plays after `a27-04-complete`, or the first time the atlas is next open at the
  nest. The text matches S24's notes ("White hair at birth. I'd have kept him." and "And under it, one letter: H."),
  in A20's style.
- **`corvinGate` = family:** `a27-07-corvin`, one line inserted after `a27-07-foot#5`.
- **`a27-feather` replacements** (the defaults are for told):
  - `a27-09-descent-sat` / `-night`. In the default he runs the last bit. With sat he walks down slowly and his
    father waits; with night Sam has prayed all night and his voice is gone.
  - `a27-14-letter-sat` / `-night`, with the outline's three letter lines.
  - `a27-17-fire-sat` / `-night`. With told Zal burns the feather himself; with sat he hands it to you (the third rule
    landing); with night he burns it hoping she has "one more night in her".
  - `a27-17-complete-sat` / `-night`. The last image is Zal with the baby (told), Sam with the silk doll (sat), or the
    Simurgh circling after "You were right to give him the night." (night).
- **Sable:** `a27-close-sable-bonded` (asleep under the feather on the mantel) or `a27-close-sable-wary` (the feather
  on the floor by the long grass, and she watches it). Nothing plays if Sable isn't in the Grove yet.

The signature choice is in A27-8. It pays off in A27-9, A27-14 and A27-17, as the outline asks.

## Rewards (one-time)

- White-Crested Cap (cosmetic, A27-5).
- The Great Nest (decor, in the big tree by the pond, A27-8).
- Rose-Garden Bed (decor, A27-12).
- Zal's Lasso (decor, A27-13).
- Simurgh Feather in its glass (decor, cottage mantel, A27-17).

## SIM needs

- The Great Nest: Nubbins may choose to sleep in it. No timer, no yield.
- The Simurgh Feather: a mantel decoration that does nothing.
- Atlas reads (read-only): Sable's trust stage, `corvinGate` and `s24Done`. The margin note stays drawn once it has
  played.
- Speaker swap: the youth is `a27-youth` ("The Youth") until his father names him in `a27-09-oath`, then `a27-zal`.

## Changes from the outline, and why

- **Your arrival.** The outline makes you both a guest (Q1) and a foundling (the role note). Here you arrive as a guest,
  follow the baby up in the storm (Q2), and are carried up with him (Q3). That reconciles the two.
- **Sam's dream (Q6).** To be present, you ride down with a caravan and are in the hall when Sam wakes. Sam asks you if
  the boy lives; your answer has no flag. Then you run back up ahead of the army.
- **Kabul (Q11).** Zal sends you into the city with a gift so that Mehrab isn't shamed by his refusal, and Rudaba asks
  you about Zal. In Zimmern a noble praises Rudaba to Zal; here the praise goes both ways through you.
- **Letters (Q14), four steps.** The Shah's order arrives as news in Kabul, and Sam's letter to the Shah is told in the
  complete scene. That merges Zimmern's order (Shah, Zal's plea, Sam's letter, Sindokht) so you stay in the scenes. The
  Shah's order and Mehrab's threat are one line each, as the care notes ask.
- **Riddles (Q15).** Five of Zimmern's six riddles, all in our own words. The two cypresses are cut for length.
- **Crown (Q16).** Zal crowns Rudaba in Sistan after the wedding, as Zimmern has it.
- **Our inventions, kept small:** the old servant (Q2, Q6, Q9, Q10), the words you teach the youth (Q5), and the porter
  on his round (Q13).

## For Maor

- The outline's MIT Classics link is dead (it redirects to the home page). The quotes are checked against the 1883
  scan, so they're safe. Please update the source line in `docs/more-stories.md` if you want it to name the copy used.
- Care follow-ups before ship:
  - an Iranian adviser and an Afghan adviser for names, pronunciation (the guide is in A27-1's notes) and art;
  - an albinism organisation to read the script, as the outline asks.
- The Learning Grove edu version (both bands) is still to do. This file gives only `childLines`.
