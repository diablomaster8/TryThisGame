# Log: PA3 The Hollow Kingdom

File: `src/content/arcade-pa3.ts`. Exports `ARCADE_PA3`, `PA3_VARIANTS`, `ARCADE_PA3_FLAGS` and `ARCADE_PA3_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` pass with no output. A scratch self-check, kept outside the repo, finds 0 problems. It checks that:

- ids are unique and every `requires` resolves;
- every `who` is declared;
- lines are ≤ 160 characters and narrator lines are at most two sentences;
- step scenes have 6–16 lines;
- the flag and check lists are exact, and every check uses an existing verb with a `pa3-` id;
- all three `childLines` keys point at the quoted lines.

The file isn't registered in `index.ts` yet (that's task W).

## Counts

- Quests: 18 (PA3-1 to PA3-18), audience `all`, chained by `requires`.
- Steps: 41 (2–3 per quest).
- Scenes: 109 (95 in the quests, 14 variants).
- Lines: 593, counting choice `then` lines.
- Choices: 22 choice points with 44 options. Every quest has at least one.
- Checks: 41.
- Grubs: 12 (`collect:pa3-grub:01`…`12`), at set places in PA3-2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14 and 15. Each is found once. The 12th is too tired to burrow, so you carry it home in PA3-17, and its jar becomes the grub-jar lantern.

## Lifted text

There are three lines, © Team Cherry, exactly the outline's three. Each is used once and has a `childLines` replacement. The source is the outline's wiki transcription of the 2017 English script. **Check all three against the game.**

1. `pa3-04-hornet#3`, Hornet: "Come no closer, ghost."
2. `pa3-07-plaque#6`, the plaque, read aloud by Pixel: "Through its sacrifice Hallownest lasts eternal."
3. `pa3-13-memory#5`, the Pale King: "No cost too great."

Every other line is new, including the husks' and Dreamers' dream-words. There's no music and no lyrics, and every hum is tuneless.

## Flags

- **Read (Grove, read-only):** `s21Done` only. It adds the three Clank variants.
- **Written (Arcade save only):**
  - `pa3-01`…`pa3-18` and `pa3-done`;
  - `pa3-hornet` = back | stood (PA3-4);
  - `pa3-quirrel` = sat | passed (PA3-5);
  - `pa3-abyss` = waited | hurried (PA3-14);
  - `pa3-ending` = home | late | sealed, which the sim derives in PA3-18.
  - No Grove flag is written.

## Variants (`PA3_VARIANTS`)

- **Clank:** `pa3-01-clank`, `pa3-07-clank` (he goes quiet at "vessel") and `pa3-13-clank`.
- **The flower breaking:** `pa3-09-broken`, which can play at any point from PA3-9 to PA3-12.
- **Hornet = stood:**
  - `pa3-11-den-stood` and `-done-stood`, where her needle stays between you and she tells you to go;
  - `pa3-15-test-stood` and `-done-stood`, where she never speaks to you.
- **Quirrel = passed:** `pa3-16-shore-passed`, a shorter scene without the "tell someone I was here" request.
- **Abyss = hurried:** `pa3-14-complete-hurried`, with no Void Heart.
- **Endings:**
  - `pa3-18-end-late` and `-done-late` ("I promised myself. Not you.");
  - `pa3-18-end-sealed` and `pa3-18-complete-sealed`, which offers the return to the save from before the Abyss.

## SIM needs

- **Grubs.** A one-time grub tally (12 jars) and a HUD jar icon while grub 12 is carried (PA3-15 to PA3-17).
- **The Delicate Flower.** A carried state from PA3-9 to PA3-12. A hit, a fall, the stag or a dream-gate breaks it: play `pa3-09-broken`, send the player back to the grey house and give a new flower. Nothing else is lost. Dream scenes never break it.
- **The ending.** `pa3-ending` is derived from `pa3-abyss` and `pa3-hornet` when PA3-18's step 2 begins.
- **The Abyss save.** A cartridge save point taken when PA3-14 opens. Going back clears `pa3-abyss` and `pa3-14`…`pa3-18` and keeps the grubs. One-time rewards are never given twice.
- **PA3-13's palace.** A rhythm call-out minigame on Pixel's cues. Missing a call costs nothing but a retry.

## Changes from the outline

- **Quest 12 is split** into three steps (the tenth grub in the thorns, the grave, the White Lady) to give the grub its own step.
- **Grub placement.** The outline puts no grub in particular places, so I placed all twelve along the road. Grub 11 is at the Ancient Basin rim, at the start of PA3-14. Grub 12 is in the ash, in PA3-15, which makes "with the twelfth grub" in quest 17 literal.
- **Hornet in quest 18.** The outline's "Hornet trusts you" maps to `pa3-hornet = back`.
- **The Knight's nail charm** is called the Void Heart only once the charm turns black, after waiting at the lighthouse.
- **Rewards are placed in the story:**
  - the flower pot comes from the White Lady's seed (PA3-12);
  - Quirrel's nail is Pixel's wooden copy from Workyard offcuts, because the real one stays in the sand (PA3-16);
  - the grub-jar lantern is grub 12's jar (PA3-17);
  - the mask is carved by Elderbug, and the high-score plate comes with it (PA3-18).

## For Maor

- **The three quotes** need checking against the game before ship.
- **The licence.** A commercial build needs Team Cherry's licence; without one, rename everything.
- **Learning Grove.** The audience is `all`, but the outline says there's no Learning Grove version because of the licence. The `childLines` exist anyway, as the brief requires.
- **Clank.** He appears only through the speaker, on top of the cabinet. His "vessel" beat is in PA3-7, with an echo in PA3-13.
