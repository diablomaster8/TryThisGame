# Log: A30 "The Word on the Brow" (the Golem of Prague)

File: `src/content/atlas-a30.ts`
Exports: `ATLAS_A30`, `ATLAS_A30_VARIANTS`, `ATLAS_A30_FLAGS` and `ATLAS_A30_CHECKS`.
Validation: `tsc` (with the brief's flags) and `eslint` are both clean. The file is not Prettier-formatted, which matches
`atlas-a20.ts` and `atlas-a21.ts`. `content-check.ts` has not been run, because the file is not in `index.ts` yet
(that is task W). A throwaway self-check script, now deleted, confirmed these:

- ids are unique, and every `requires` points to a real code;
- every `who` is declared, either as a campaign speaker or in the quest's `speakers`;
- no line is over 160 characters, and no narrator line has more than two sentences;
- each step scene has 6 to 16 lines;
- all five `childLines` keys point at the lifted lines;
- every check used is listed in `ATLAS_A30_CHECKS`, and the list has nothing extra.

## Counts

| | Count |
| --- | --- |
| Quests | 13 (A30-1 to A30-13), audience `all` |
| Steps | 30 |
| Scenes | 74: 54 in the quests (30 step scenes, 11 done scenes, 13 complete scenes) and 20 variants |
| Lines | 413, including the choices' `then` lines |
| Choices | 14 choice points with 33 options. Every quest has at least one choice point, and `a30-13-kept` has another. |
| Checks | 30, one per step, all with existing verbs |

## Lifted text

All five passages are the outline's verified ones. Each is used once, verbatim, and each has a `childLines`
replacement.

1. *Jewish Encyclopedia* (1904), "Golem": "The Shem was written on a piece of paper and inserted either in the mouth or
   in the forehead of the golem." Used as narration at `a30-06-tellings#3`. The rabbi follows it with the outline's
   adapted line, "Some say the word goes in the mouth, some say on the brow", in his own words. This gives both
   versions of the legend.
2. *Jewish Encyclopedia* (1904): "Once the rabbi forgot to extract the Shem, and feared that the golem would desecrate
   the Sabbath." Narration, `a30-10-psalm#5`.
3. *Jewish Encyclopedia* (1904), about the golem of Chełm: "Finally he extracted the Shem from the forehead of his
   golem, which returned to dust." Spoken by the rabbi, `a30-13-bench#6`.
4. *Jewish Encyclopedia* (1904), a fragment: "…its remains are said to be still among the débris in the attic of the
   synagogue." Narration, `a30-12-stars#8`.
5. Psalm 139:16, JPS 1917, a fragment: "Thine eyes did see mine unformed substance…" Spoken by the rabbi,
   `a30-02-question#3`, followed by "That is a psalm." in our own words on the same line. He then explains *golmi*.

The Talmud story (Sanhedrin 65b) is retold in our own words. Psalm 92 is named but never sung or printed. Everything
else is original.

## Flags

**Read** (the page never writes a Grove flag):

- `cinder`: the ember lantern inserts `a30-01-ember`, `a30-10-ember` and `a30-10-ember-settle`, and Moss's Grove line.
- `keptStone`: the insert `a30-13-kept`, where the rabbi asks what is in your pocket.
- `s24Done`: Hazel's margin note, `a30-margin-hazel`.
- The campaign chapter, `mossFaded` and the ending id, read only to tell whether Moss is there to speak (as A26 does).

**Written** (Atlas save only):

- `a30-01` to `a30-13`, and `a30-done`.
- `a30-order` = `safe` | `help` | `sit`. This is the signature choice, made in A30-7. It pays off in A30-9, A30-10 and
  A30-13: the rabbi's words, the tile's pawprint, and the last image.

## Variants (20)

- **A30-9 order inserts:** `a30-09-order-safe`, `-help` and `-sit`.
- **A30-10 order inserts:** `a30-10-grow-safe`, `-help` and `-sit`.
- **A30-13 order inserts:** `a30-13-order-safe`, `-help` and `-sit`.
- **A30-13 pawprint:** `a30-13-tile-paw` (sit only).
- **A30-13 complete scenes:** the main scene is the safe one (the barred shutter); `a30-13-complete-help` (the broom)
  and `a30-13-complete-sit` (the clay bird) cover the others.
- **Cinder:** `a30-01-ember`, `a30-10-ember` and `a30-10-ember-settle`.
- **keptStone:** `a30-13-kept`.
- **Hazel's margin note:** `a30-margin-hazel`.
- **Grove keepsake:** `a30-grove-tile` (Moss: "Truth, and then one letter less…"), `a30-grove-tile-cinder` (Moss: "She'd
  have liked him…") and `a30-grove-tile-quiet` (Moss not there or faded, including `moss-sleeps`; no Moss).

Each quest's `notes` say exactly where its variants play.

## SIM needs

- The Price of Power festival reads `atlasDone('A30')` from `a30-done`.
- The Grove keepsake scene plays the first time you enter the cottage after the page is done. It plays
  `a30-grove-tile-quiet` unless the campaign is past chapter 4, `mossFaded` is false and the ending is not `moss-sleeps`
  (review fix: checked first, so a `cinder` save with Moss faded never gets his line); then the `cinder` scene; otherwise
  `a30-grove-tile`.
- The Night-Round Lantern is an unlimited idle behaviour: your Nubbin walks a short round at dusk. It is not a timer.
- The dialogue box needs bidirectional text handling for lines that mix Hebrew and English (isolate each Hebrew run).
- אמת and מת should be drawn large as art in A30-6, A30-9 and A30-13.

## Changes from the outline

- **A30-1:** opens with an intro card (lines #1 to #4). It says this is a legend, that Rabbi Loew was real and the golem
  was attached to him later, and that the page follows the 1904 encyclopedia.
- **Invented characters:** the caretaker's family (Avram, Dvora, Rivka, Shmuel and Mirele) and Hannah the baker. The
  rabbi's helpers are Isaac (his son-in-law) and Jacob (his pupil), as in later tellings.
- **A30-10:** the rabbi is called away to a birth, and the baby is a girl. The quest is split into three steps:
  called away, the psalm, and the fetch.
- **A30-11:** adds a short Sabbath table scene. The player does no work in it.
- **A30-9:** the outline gives no Q9 beat for the help order. I added one: he sweeps one step over and over, and moves
  chairs nobody asked him to move.
- **A30-9:** the rabbi does not say Moss's line ("one letter less"). That line is kept for Moss in the Grove.
- **A30-12:** Avram's unknown key from A30-1 fits the attic door. This is a small invention.
- **Rewards:** they are spread across the page. The apron comes in A30-7 (after the flood), the lantern in A30-8, and
  the tile, the clay bird and the bookmark in A30-13. Rivka makes the clay bird, which ties it to the sit ending.
- **New Grove scene:** I added `a30-grove-tile-quiet` for whenever Moss is not there (before chapter 4, faded
  in any ending, or `moss-sleeps`), so Moss never speaks after he has faded.

## For Maor

- **Advisers:** Jewish advisers need to read the whole script before it ships. Please flag these for them:
  - the Sabbath details (`a30-10-psalm`, `a30-11-table`, and carrying the clay only after three stars, in A30-12);
  - the wording of the Talmud retelling;
  - how the psalm being said twice is described today;
  - the first, middle and last letters teaching;
  - the Prague and Old-New Synagogue details;
  - the call to use *emet* rather than the Name.
- **The Name:** it is never written or shown. The rabbi says only that some tellings use "a holy Name, written on a
  slip of paper", and that "we will leave that where it belongs".
- **Legal:** the outline asks legal to confirm the UK status of the 1904 and 1917 texts.
- **Learning Grove version:** the version led by Ori, in both bands, is not in this file (the brief asks Atlas pages
  for `childLines` only). אֱמֶת and מֵת need adding to the vetted word list, with native-speaker recordings.
