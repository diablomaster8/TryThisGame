# Script log: PA4 Mercy (Undertale)

File: `src/content/arcade-pa4.ts` (exports `ARCADE_PA4`, `ARCADE_PA4_CHECKS`, `ARCADE_PA4_FLAGS`,
`ARCADE_PA4_VARIANTS`). Audience `all`.

## Counts

- 19 quests (PA4-1 to PA4-19), 44 steps, 115 scenes (27 of them variants), 640 lines, 50 choices.
- 44 distinct checks, all with existing verbs (inspect, explore, talk, choose, puzzle, minigame, sit, walk,
  visit, carry, craft, watch, deliver).

## Lifted text

Two of the three allowed quotes (Undertale, © Toby Fox), exactly as the outline lists them, each with a `childLines` replacement:

1. Flowey: "In this world, it's kill or be killed." (`pa4-02-flower#7`, used once).
2. Papyrus's laugh "NYEH HEH HEH!" (`pa4-06-gauntlet#2`, `pa4-07-capture#2`), counted as one quote.

All other dialogue is original. A drafting pass removed several near-paraphrases of the game's own lines
(Toriel's and Napstablook's especially). No music is used, not even a hum.

## Flags

- **Read (Grove, read-only):** `wisp` (spared | sable | driven | unset) and `s21Done`.
- **Written (cartridge save only):** `pa4-01`…`pa4-19`, `pa4-done`, `pa4-candy` = left | be (the signature
  choice), and the friend flags `pa4-blook` = lie | joke, `pa4-papyrus` = puzzles | pasta,
  `pa4-undyne` = hot | low, `pa4-mettaton` = pose | encore. The cartridge writes no Grove flag.

## Variants

- **Wisp:** `pa4-01-vent-warm` / `pa4-01-vent-quiet` (PA4-1), `pa4-18-wisp-warm` / `pa4-18-wisp-driven`
  (PA4-18), and `pa4-end-wisp-asleep` (after the cartridge).
- **Clank (s21Done):** `pa4-01-clank`, `pa4-end-clank`.
- **Candy (the signature choice, PA4-2):** `pa4-17-candy`, `pa4-18-candy`, and the last frame,
  `pa4-19-flower-turns` / `pa4-19-flower-still`.
- **Friends:** `pa4-17-<friend>-<value>` and `pa4-19-<friend>-<value>` for Napstablook, Papyrus, Undyne and
  Mettaton, which makes 16 one-line scenes.

Each quest's `notes` says exactly where each variant plays.

## SIM needs

- **The ACT/MERCY fight box:** two buttons only, with no FIGHT button ever drawn. Fights can't be lost.
  Mettaton has a ratings bar.
- **PA4-14:** the MERCY button breaks, and Pixel's "load save" returns you to the golden corridor.
- **PA4-18:** a SAVE button replaces MERCY for the Asriel fight.
- **PA4-18, Wisp driven:** the cabinet switches off for a minute.
- **High Score Night:** `pa4-done` counts towards it (any two of PA1–PA5).
- **Rewards,** one-time and delivered to the Grove inventory:
  - the Burnt Saucepan (PA4-10);
  - the Taped MERCY Button (PA4-14);
  - the Striped Jumper, the Golden Flower Pot and the Mercy High-Score Plate (PA4-19).

## Changes from the outline

- **PA4-14/15:** the reload puts you back before the corridor, and Pixel sends you back for the letter. In
  the game the friends come before the king; here PA4-15 is framed as "something we missed".
- **PA4-14:** Pixel's own physical MERCY button cracks when Asgore breaks his. This gives the taped-button
  reward a story.
- **PA4-6:** the dog with the long neck and the puzzles are our own versions, and none is named after the
  source's.
- **PA4-12:** Napstablook's call is unchanged. The notes add an optional extra line if `pa4-blook` = joke.
- **Credits note** (required by the care notes): "The neutral ending is not shown in this cartridge."

## For Maor

- This cartridge needs Toby Fox's licence before a commercial build.
- The source characters keep their names (Flowey, Toriel, Sans and so on), as on the licensed Atlas pages.
  If you want to rename them, it's a `name` change only.
- `npx tsc` and `npx eslint` pass on the file. `content-check.ts` will only see it once task W registers it
  in `index.ts`.
