# Log: A22 The Candle

File: `REPO/src/content/atlas-a22.ts`. Exports `ATLAS_A22`, `A22_VARIANTS`, `ATLAS_A22_FLAGS`, `ATLAS_A22_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. A scratch self-check (kept outside the repo) finds 0
problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2 sentences, step
scenes 6–16 lines, flags and checks lists exact, every check uses an existing verb with an `a22-` id, both `childLines`
keys point at the quoted lines. Not yet registered in `index.ts` (task W), so `content-check.ts` hasn't seen it.

## Counts

- Quests: 16 (A22-1 to A22-16), audience `all`, chained by `requires`.
- Steps: 37 (2–3 per quest).
- Scenes: 97 (74 in the quests, 23 variants).
- Lines: 644, counting choice `then` lines.
- Choices: 41 choice points, 90 options. Every quest has at least one.
- Checks: 41 (37 step checks plus 4 used only by the ears and hands variants in A22-9 and A22-15).

## Lifted text

Two of the outline's lines are used. They're copyrighted and come from Save the Cat's beat sheet. They haven't been checked against the licensed film yet; the outline asks for that before ship. Each line is used once and has a `childLines` replacement.

1. `a22-03-door#4`, Abuela, remembered: "Whatever Gift awaits will be just as special as you."
2. `a22-14-pedro#10`, Mirabel at the river: "We were given a miracle because of you."

Mirabel's line in A22-4, "Yours didn't. Something is wrong with ours.", is the outline's own original line, not a quote. No songs are used. No lyrics, no song titles, no humming. The silence about Bruno is shown, never sung.

## Flags

- **Read (Grove, read-only, live, never stored):**
  - `longGrassLantern()`, read at A22-1 (the lamp), A22-4, A22-13 and A22-16, and by the Grove keepsake.
  - `keptStone`, read at A22-14.
  - `s24Done` (S24), read after A22-14 for Hazel’s margin note (`a22-margin-hazel`).
- **Written (Atlas save only):**
  - `a22-01`…`a22-16`;
  - `a22-done`;
  - `a22-job` = eyes | ears | hands (A22-5, the signature choice).
  - No Grove flag is written.

## Variants (`A22_VARIANTS`)

- **The lantern.** The scenes as written are the `dark` path. In the dark path Abuela lights your empty lamp from the candle on your first night, so the lamp carries the candle's flame. That makes the outline's "it shudders with the candle" and "it goes out too" literal.
  - A22-1: `a22-01-lamp-flicker`, `-lit` and `-warm`. With `flicker`, Abuela adds her flame beside your thin blue one.
  - A22-4: `a22-04-lamp-flicker` (both flames shudder), `-lit` and `-warm` (the lamp holds, and Mirabel says "Yours didn't…").
  - A22-13: `a22-13-lamp-flicker` (the candle's flame dies, your own blue one stays), `-lit` (the only light in the ruins) and `-warm` (the oddly warm night).
  - A22-16: `a22-16-stub-flicker`, `-lit` and `-warm`.
- **The kept-stone line.** `a22-14-pedro-done-kept`: Abuela takes your cold hands in hers without a word, and keeps them there.
- **The job** (pays off 3 to 11 quests after A22-5):
  - Ears only: `a22-08-prep-done-ears`, where Dolores tells you first.
  - `a22-09-ears` and `a22-09-hands`. Eyes is as written.
  - `a22-15-ears` and `a22-15-hands`. Eyes is as written.
  - `a22-16-photo-ears` and `a22-16-photo-hands`. The photo partner is Mirabel plus Dolores or Luisa; on the eyes path it's Mirabel with the crack map.
- **The Grove keepsake.** `a22-grove-candle` (unlit) and `a22-grove-candle-lit` play once, on the first return after A22-16.
- **Hazel’s margin note** (`s24Done`): `a22-margin-hazel`, beside the river, after A22-14’s complete scene (or the first time the atlas is open at the river once `s24Done` is set). Its text matches S24’s notes.

## SIM needs

- **`longGrassLantern(): 'flicker' | 'dark' | 'lit' | 'warm'`.** A read-only helper over Grove state. It's evaluated when a lamp scene is about to play and is never copied into the Atlas save. Priority order:
  1. `keptStone` → `dark`;
  2. `cinder` set (S19) → `warm`;
  3. chapter 10's dawn reached → `lit`;
  4. chapter 4's close reached → `dark`;
  5. otherwise → `flicker`.
- **`keptStone`** is read at A22-14's step 2 done scene.
- **Job-path checks.** The `a22-job` value swaps the step check in A22-9 (`escort:a22-dolores:courtyard`, `carry:a22-table:dining-room`) and in A22-15 (`build:a22-walls:listening`, `carry:a22-bricks:ruins`).
- **The candle-holder** comes through `atlasDone('A22')` and hangs on the Long-Grass post. It's drawn unlit for `flicker`/`dark` and lit for `lit`/`warm`. It's decor only. The Long Table festival also reads `atlasDone('A22')`.
- **The belt lamp** is drawn on the Keeper on this page only.

## Rewards (all one-time)

- **A22-12:** Mirabel's embroidered skirt or waistcoat (cosmetic). The player picks the cut once.
- **A22-14:** the yellow-butterfly ambient (feature).
- **A22-16:**
  - the painted tin candle-holder (decor);
  - the butterfly doorknob (decor);
  - the Long Table Bookmark (item).

## Changes from the outline, and why

- **The page opens painted.** A22-1 plays as a painting of the night before Mirabel's ceremony, ten years ago. Then the page turns to Antonio's day. That's how "Abuela tells little Mirabel, and you" fits with "you step in on the day of Antonio's ceremony".
- **The dark lamp is lit by Abuela** (see Variants above). Without this, a dark lamp couldn't shudder or go out.
- **Mirabel sleeping alone moves to A22-4's complete scene.** The outline has it in A22-3 ("that night"), but the party in A22-4 is the same night.
- **A22-3's complete scene adds the film's photo** with Mirabel waved out of it. A22-16's photo, with you beside her, answers it.
- **The war is never named.** The flight is "trouble in the land where we lived". Pedro "did not come"; at the river Abuela "waited until the sun came up".
- **Bruno's door:** a hooded figure, as licensed. Camilo turns into "a hooded figure" at dinner instead of doing an impression, which keeps the moment off the film's song.

## For Maor

- **Licence.** This page can't ship without a Disney licence. The characters, Casita and the animals must be the licensed designs.
- **Colombian advisers needed before ship** (commissioned, as for A5, A7 and A10). The header's care notes are written for them.
  - A historian of early-20th-century Colombia (the flight, the riders, the village).
  - Afro-Colombian and Indigenous advisers, including Zenú, for dress, names and the village's faces. The Learning Grove's sombrero vueltiao especially needs this.
  - Someone from a family that has lived through displacement, to read A22-1 and A22-14.
  - A Colombian Spanish reader for the family words and the food.
- **The two quotes** need checking against the licensed film.
- **Your call: `keptStone` with `cinder`.** The bible says S19 makes the lantern "burn warm" either way. The outline says kept-stone stays dark. I gave `keptStone` priority (dark). Flip the first two rules if warm should win.
- **No Learning Grove (edu) versions** are in this file. The outline wants a softened one: the map, arepas and buñuelos, family words, the tiple, the sombrero vueltiao, and families who have to leave home. That's still to do, under Plan item 2.

## Resolved (2026-10-15)

- **`keptStone` with `cinder`:** this can't happen. S19 only runs if the stone was unmade (STORY-BIBLE, S19 row), so the order of the two rules doesn't matter. Noted in the A22-1 SIM note.
