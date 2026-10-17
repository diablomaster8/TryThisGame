# Log: PA5 The Hundred-Year Sleep

File: `src/content/arcade-pa5.ts`. Exports `ARCADE_PA5`, `PA5_VARIANTS`, `ARCADE_PA5_FLAGS`, `ARCADE_PA5_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. A self-check script (scratchpad, not in the repo)
finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, done scenes ≤ 5, complete scenes ≤ 10, every quest has a choice, flags and checks
lists exact, every `childLines` key points at a real scene. Audience `all` throughout.

## Counts

- Quests: 18 (PA5-1 to PA5-18), chained by `requires`.
- Steps: 44 (2–3 per quest).
- Scenes: 115 (100 in the quests, 15 variants).
- Lines: 563, counting choice `then` lines.
- Choices: 23 choice points, 46 options. Every quest has at least one.
- Checks: 52 (44 step checks, plus 8 `find:pa5-memory:*` for the off-road memory sites).

## Lifted text

Two of the three allowed one-sentence quotes, exactly as the outline lists them (English script as quoted in Nintendo's
trailers and by Zelda Dungeon; **check both against the game before ship**):

1. "Open your eyes." Zelda's voice, `pa5-01-wake#0`. childLines: "Wake up now. It’s time."
2. "I think I can accept that." Zelda after the credits, `pa5-18-complete-hunt#6` (only after every memory).
   childLines (keyed on the variant scene, inside PA5-18): "I don’t mind. I really don’t."

No music, no song lyrics; Kass plays tunes only, described. The Korok catchphrase is not used: Koroks only giggle.

## Flags

- **Read (Grove, read-only):** `s21Done` only. Clank sits on the cabinet (`pa5-01-shed-clank`) and cheers in the field
  (`pa5-17-horse-done-clank`). Nothing else.
- **Written (cartridge save only):** `pa5-01`…`pa5-18`, `pa5-done`; `pa5-oldman` = ate | left (PA5-3);
  `pa5-memories` = all | road (PA5-5, the signature choice); `pa5-thirteenth` (PA5-15 hunt variant);
  `pa5-14-told`, `pa5-17-hold`, `pa5-18-after` (small, read by nothing outside the cartridge;
  `pa5-18-after` = look re-marks the memory sites). **No Grove flag is written.**

## Variants (`PA5_VARIANTS`)

- **s21Done:** `pa5-01-shed-clank` replaces `pa5-01-shed`; `pa5-17-horse-done-clank` replaces `pa5-17-horse-done`.
- **Off-road memories** (eight; played once each when found, with `pa5-memories` = all or after `pa5-18-after` =
  look): `pa5-mem-ceremony`, `-resentment`, `-silent-princess`, `-revali`, `-daruk`, `-urbosa`, `-spring`, `-frog`.
  With the four on-road memories (Mipha in PA5-8, shelter in PA5-12, sword in PA5-13, father in PA5-14) they make the
  twelve photographs.
- **Old man = ate:** `pa5-14-complete-ate` replaces `pa5-14-complete` (eleven quests after the choice), with a choice
  to tell Link the king is sorry, or keep it.
- **Every memory found** (`pa5-memories` = all and twelve seen): `pa5-15-impa-hunt`, `pa5-15-plain-hunt`,
  `pa5-15-complete-hunt` replace PA5-15's three scenes (the thirteenth photograph, Blatchery Plain; sets
  `pa5-thirteenth`). Then `pa5-18-complete-hunt` replaces `pa5-18-complete`: the after-credits ride out to mend.

The signature choice (PA5-5) pays off ten and thirteen quests later (PA5-15, PA5-18).

## SIM needs

- **Memory sites:** the eight off-road sites are marked on the slate map only with `pa5-memories` = all (or after
  `pa5-18-after` = look); each plays its variant once. Track a count of memories seen (on-road four + eight).
- **PA5-15 rule:** hunt variants only if `pa5-memories` = all AND all twelve seen; otherwise the scenes as written.
- **Late thirteenth:** after the road ending, if the player later sees all twelve, play `pa5-15-impa-hunt`,
  `pa5-15-plain-hunt`, `pa5-15-complete-hunt`, then `pa5-18-complete-hunt` once, from Impa's house. One-time.
- **Koroks:** twelve, hand-placed, found once, no respawn; the Nubbin giggles back within range.
- **Minigames** (all unfailable): `pa5-glide-plateau`, `pa5-flight-range` (spotting), `pa5-hold-horse` (rhythm).
- **Rewards** go to the Grove through the Arcade save, like the Atlas keepsakes: stone pot and campfire (PA5-3),
  paraglider hill feature (PA5-4), leaf-face mask (PA5-7), the twelve photographs in a frame that fills as found, and
  the high-score plate (PA5-18). `pa5-done` counts towards High Score Night (any two of PA1–PA5).

## Changes from the outline

- Rewards are spread across the quests where they are earned (pot at the old man's cabin, glider at the temple, mask
  from Hestu); the frame and plate come at the end.
- The outline names only the four on-road memories; the eight off-road ones are our own short vignettes drawn on the
  game's memory places, kept as variants.
- PA5-15's base title is "The Road to the Castle"; the notes say to show "The Thirteenth Photograph" for the hunt path.
- PA5-18's road ending gives Pixel's "go back and look" offer as a choice, so the photographs can still be finished.
- Paya appears in PA5-15 (a callback); Link never speaks and is not a declared speaker.

## For Maor

- The cartridge needs Nintendo's licence before any commercial build; every character uses the licensed design.
- Verify the two quotes against the game (both from secondary sources).
- No Learning Grove version, per the outline (licence); the childLines exist only because the house rule asks for them.
- Scratchpad note: my check script was first written to a shared scratchpad name, `chk.mts`; if another agent used
  that name, its copy may have been overwritten (mine is now also at `pa5-chk.mts`).
