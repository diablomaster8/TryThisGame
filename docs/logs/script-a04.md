# Script log: A4 The Waterfall Prince (Baahubali)

File: `src/content/atlas-a04.ts` (exports `ATLAS_A04`, `ATLAS_A04_VARIANTS`, `ATLAS_A04_FLAGS`,
`ATLAS_A04_CHECKS`). Audience `teen` (13+), behind Mature content.

## Counts

- Quests: 16 (A4-1 to A4-16, chained by `requires`).
- Steps: 43. Scenes: 94 (92 in quests, 2 variants). Lines: 526, counting choice `then` lines. Choices: 45.
- Checks: 43, all from the existing verbs.

## Validation

- Single-file `tsc` (the brief's command) and `eslint src/content/atlas-a04.ts`: clean.
- `npx tsc --noEmit -p .` and `npx eslint src/content tests/tools`: no errors in this file. The only error is a parse
  error in `atlas-a06.ts`, which is another task's file in progress.
- `content-check.ts --warnings`: `problems: 0`, `warnings: 0`. It doesn't see this file until task W registers it.
- A self-check script found no problems: ids are unique, every `requires` exists, every `who` is declared, no line is over
  160 characters, no narrator line has three or more sentences, there are no em dashes, the flag and check lists match
  what the file uses, and every step scene has 6 to 16 lines.

## Lifted text

None. The films are copyrighted and the outline lists no approved quotes. Sivagami's oath on her word, the famous
question about Kattappa, and Amarendra's last words are carried by new lines. The crowd only calls the name.

## Flags

- **Grove flags read:** none (the outline asks for none). **Grove flags written:** none.
- **Atlas flags written:**
  - `a4-01` to `a4-16`, and `a4-done` (read by the Price of Power festival).
  - `a4-words` = hands | forgave | stay: the signature choice, made in A4-13 (`a4-13-rain`) and paid off in A4-16.
  - `a4-mask` = returned | told (A4-3): art only.

## Variants (`ATLAS_A04_VARIANTS`)

- `a4-16-words-forgave` and `a4-16-words-stay` replace `a4-16-words` (the base, for hands). In each, Kattappa says your
  words from the rain to Mahendra.

## SIM needs

- **The Waterfall Climb:** an unlimited climbing route up the Grove falls, unlocked by `atlasDone('A4')`. Your Nubbin finds
  the handholds first.

## Changes from the outline

- **Frame:** Kattappa's telling pulls you into the past (A4-7 to A4-14), so you can speak to him in the rain the night it
  happens. In A4-15 the old man recognises you, unaged. That gives the payoff 25 years to land.
- **A4-14** closes at A4-1's river, seen from the other bank.
- **Devasena is retaken** while Kattappa tells the story (reported in `a4-15-fire`, as in the second film), so A4-16 finds
  her in the courtyard again. **Devasena learns who Amarendra is** on the Kuntala road (`a4-11-gifts-done`).
- **The Kuntala war** of the second film becomes one line in A4-11, to keep the page at sixteen quests.
- **A4-12's court scene** is softened. Devasena strikes the man's hand away, and Amarendra brings him before the throne.
  The commander's fate is never shown. The film's finger-cutting and beheading are not used.
- **A4-3's romance** is rewritten: Shivudu and Avanthika meet as equals. The film's secret marking of her hand and the
  armour scene are not used.
- **Rewards:** the bow (a practice bow) comes in A4-10, the banner in A4-15 and the climb in A4-16.
- **The shrine-stone and temple scenes** are left out (see the header's RELIGION note).

## For Maor

- **Indian (Telugu and Tamil) advisers** for:
  - the names (Telugu cut used; the Tamil version calls the tyrant Palvaal Thevan);
  - "Amma", dress and the court;
  - the gesture of the foot on the head (A4-6);
  - whether Kattappa's oath should use the films' plainer word, "slave", instead of "sworn".
- **The Kalakeyas** are a proud, disciplined army, with no invented language or darkened skin. Their chief never speaks.
- **Violence:** Amarendra dies while the screen shows only rain. Bhallaladeva's end is offscreen: the camera holds on
  Devasena's face. The pyre is the tyrant's, and nothing reads as her harming herself.
