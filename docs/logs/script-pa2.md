# Log: PA2 The Clone Island

File: `src/content/arcade-pa2.ts`. Exports `ARCADE_PA2`, `ARCADE_PA2_VARIANTS`, `ARCADE_PA2_FLAGS`, `ARCADE_PA2_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. A scratch self-check finds 0 problems: ids unique,
every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2 sentences, step scenes 6–16 lines,
2–4 steps per quest, flags and checks lists exact, every check uses an existing verb with a `pa2-` id, the one
`childLines` key points at the quoted line.

## Counts

- Quests: 18 (PA2-1 to PA2-18), audience `all`, chained by `requires`.
- Steps: 43 (2–3 per quest), one check each (43 distinct checks).
- Scenes: 99 (91 in the quests, 8 variants).
- Lines: 610, counting choice `then` lines.
- Choices: 22 choice points, 50 options. Every quest has at least one (PA2-13's main choice is in its variant).

## Lifted text

One line of the three allowed: Mewtwo, PA2-16, "I see now that the circumstances of one's birth are irrelevant."
(4Kids English dub, as printed in *The Art of Pokémon, The First Movie*), at `pa2-16-understand#3`, with a
`childLines` replacement. No songs, no lyrics. All other dialogue is new; well-known film lines were avoided, not
paraphrased.

## Flags

- **Read (Grove, read-only):**
  - `s7Done`: Byte goes silent at the title (PA2-1), stays silent behind the chair (PA2-4), and says the Null line
    in PA2-15 while Pixel holds his sleeve. Without it he goes for a biscuit in PA2-1, is absent in PA2-4 and comes
    back chewing in PA2-15.
  - `s21Done` (the frame's rule): Clank on the cabinet, PA2-1 only.
- **Written (Arcade save only):** `pa2-01`…`pa2-18`, `pa2-done`, `pa2-name` = own | borrowed (PA2-9, signature),
  `pa2-late` = named | unnamed (PA2-16, borrowed path only). No Grove flag is written.

## Variants (`ARCADE_PA2_VARIANTS`)

- `pa2-01-shed-clank` (s21Done) replaces `pa2-01-shed`.
- `pa2-01-title-s7`, `pa2-04-complete-s7`, `pa2-15-tears-s7` (s7Done) replace `pa2-01-title`, `pa2-04-complete`,
  `pa2-15-tears`.
- `pa2-13-nubbins-borrowed` replaces `pa2-13-nubbins` (the clone shoves; your Nubbin never shoves back).
- `pa2-16-name-borrowed` replaces `pa2-16-go` (Mewtwo says the name was taken; last chance; sets `pa2-late`).
- `pa2-18-complete-late` and `pa2-18-complete-nameless` replace `pa2-18-complete`.

The signature choice (PA2-9) pays off in PA2-13, PA2-16 and PA2-18 (four, seven and nine quests later).

## SIM needs

- **Name entry** for the clone on `pa2-name = own` and on `pa2-late = named`: the hatchling name box, stored as
  `pa2-clone-name` in the Arcade save; blank input falls back to a seeded name, never the player Nubbin's.
- **The clone's sprite:** the player Nubbin's own sprite, markings mirrored, one shade darker, ball grey until named.
- **The attract screen** keeps the PA2-18 image for good: the clone on the mountain with its stored name, or a
  blank plate if nameless. Shown whenever the cabinet is idle.
- **Rewards:** Miranda's storm lantern (PA2-6), pink-bubble emote (PA2-12), tuft-of-fluff locket and the
  high-score plate (PA2-18). `pa2-done` counts towards High Score Night.
- PA2-15 is offered straight after PA2-14 (Ash's stone must not be left as a cliffhanger in a menu).

## Changes from the outline

- PA2-12: the outline has Mewtwo's blast at Mew hit Ash. Here it bursts the bubble Ash is still in, and Brock
  catches him; the tag game comes first so it is the last nice moment, as the outline says.
- PA2-6 and PA2-8: Neesha, Fergus and Corey are met at the wharf (as in the film) before they wait in the hall.
- The soft content line before PA2-2 is Pixel reading the back of the label (`pa2-01-complete`).
- Mewtwo is "he" (as the outline writes him); the clone Nubbin is "it", like every Nubbin.

## For Maor

- This cartridge cannot ship commercially without a licence from The Pokémon Company; without one, rename
  everything and keep only the story's shape. The outline does not mark the quote [unverified], so it is used;
  the quote-verification pass should still check it against the printed art book, or swap in the `childLines`
  text everywhere.
- No Learning Grove version, per the outline (licence).
