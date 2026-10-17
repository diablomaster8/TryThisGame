# Log: PA1 The Chao Altar

File: `src/content/arcade-pa1.ts`. It exports `ARCADE_PA1`, `PA1_VARIANTS`, `ARCADE_PA1_FLAGS` and `ARCADE_PA1_CHECKS`.
Audience `main`, so it has no childLines and no Learning Grove version (the licence question is still open). `tsc` (strict,
with the brief's flags) and `eslint` both pass with no output. A scratch self-check found 0 problems: ids are unique,
every `requires` resolves, every `who` is declared, lines are 160 characters or fewer, narrator lines are at most two
sentences, step scenes are 6 to 16 lines, there are no straight quotes, and the flag and check lists match exactly.

## Counts

- Quests: 18 (PA1-1 to PA1-18), chained by `requires`.
- Steps: 40. Most quests have 2; PA1-5, PA1-8, PA1-11 and PA1-12 have 3.
- Scenes: 107 (98 in the quests and 9 variants).
- Lines: 551, counting the choices' `then` lines.
- Choices: 18 choice points with 41 options. Every quest has at least one.
- Checks: 41, all using existing verbs. `escort:pa1-chao:puddle` is used only by the locked-gate route.

## Lifted text

There are two one-sentence lines, both from Tikal's prayer. Each is exactly as Part M lists it, and both are marked
QUOTE CHECK in the notes:

1. "The servers are the seven Chaos." It is at `pa1-07-prayer#3`. [unverified: Chao Island's wiki prints "7".]
2. "Chaos is power... Power enriched by the heart." It is at `pa1-13-charge#6`. [unverified: this is the wiki wording
   as corrected on 2026-10-14.]

Both need checking against the game's English script before ship. If either is wrong, use the script's one-sentence
wording or a paraphrase of our own. All other dialogue is new. Tails's "use the good" idea is said in our own words.
Pixel says the first two lines of Cinder's rhyme from the Story Bible in `pa1-18-rhyme`. That rhyme is our own skipping
rhyme, not a song lyric.

The Sega rights note is in the header. A commercial build needs a Sega licence. Without one, rename everything and keep
only the shape of the story. Every speaker's Sega name is held in one place, so renaming is a single table.

## Flags

- **Read (Grove, read-only):**
  - `s21Done` plays `pa1-01-clank`.
  - `cinder` (forgiven, remembered or unset) decides PA1-18 step 2's done scene.
- **Written (cartridge save only):**
  - `pa1-01` to `pa1-18`.
  - `pa1-done`, which High Score Night counts.
  - `pa1-gate`, set to `locked` or `open` in PA1-2. This is the signature choice.
  - `pa1-stood`, set to `true` or `false` in PA1-10.
  - No Grove flag is written.

## Variants (`PA1_VARIANTS`, 9)

- `pa1-01-clank` plays straight after `pa1-01-shed-done` when `s21Done` is set.
- `pa1-17-chao-locked` replaces `pa1-17-chao` when `pa1-gate` is `locked`. You wade back and open the gate, and Pixel
  says "Safe isn't the same as well, is it." This pays off fifteen quests after the choice.
- `pa1-18-stood` plays after `pa1-18-return-done` when `pa1-stood` is true. It gives Tikal one more line.
- `pa1-18-cinder-forgiven` and `pa1-18-cinder-remembered` replace `pa1-18-rhyme`. When `cinder` is unset, Pixel
  half-chants the rhyme instead.
- The last image plays straight after `pa1-18-complete`. It is exactly one of four scenes: `pa1-18-last-open-stood`,
  `pa1-18-last-open`, `pa1-18-last-locked-stood` or `pa1-18-last-locked`. An unset gate counts as open, and an unset
  stood counts as false.

## SIM needs

- PA1-17 step 2 uses a different check when `pa1-gate` is locked: `escort:pa1-chao:puddle` instead of
  `watch:pa1-chao:puddle`. The bracketed half of its hint should only show on that route.
- Variant selection works as listed above.
- Pixel's lines are spoken through the speaker throughout (a tinny filter and a speaker badge).
- When `s21Done` is set, Clank is drawn on top of the cabinet.
- The Nubbin swims in PA1-15 whatever its Swim stat.
- The spanner from PA1-5 is a carried prop only.
- Rewards are one-time: the crown (cosmetic), the shrine pool (decor) and the score plate (feature). The plate gets a
  name once High Score Night unlocks.

## Changes from the outline

- PA1-3 ends with the first sight of the rosy light, so that PA1-4 can start by following it.
- PA1-6 reaches the island by Tails's plane. The outline gives no route.
- In PA1-8, Gamma lets the bird go in the garden. Amy is taken onto the Egg Carrier offscreen, and Tails says so in
  PA1-11. This keeps the hiding meaningful.
- PA1-11 folds Chaos 4 and Chaos 6 into a single growth.
- PA1-12 has an extra step, the plane ride, so that the bird flying free is the last image. The Keeper leaves before
  Gamma's end, and nothing about that end is shown or said.
- In PA1-15 you rescue street Chao and people. The garden Chao are kept for PA1-17 so that the gate choice pays off
  there.
- The fishing in PA1-9 is a sit-still beat rather than a minigame. No hook is used.

## For Maor

- Two prayer quotes are waiting to be checked against the English script (see Lifted text).
- The line needs a Sega licence to ship under these names. If there is no licence, it needs a full rename.
- Care points:
  - Chaos is never called evil.
  - The charge and Gamma's end are both offscreen.
  - Nobody drowns.
  - "Tikal" and "Pachacamac" are used only as names, as Sega uses them.
  - The murals and the clan add no real sacred material.
