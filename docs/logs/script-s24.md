# Log: S24 "The Adventure Book"

File: `REPO/src/content/side-stories-s24.ts`
Exports: `SIDE_STORY_S24`, `SIDE_STORY_S24_VARIANTS`, `SIDE_STORY_S24_FLAGS` and `SIDE_STORY_S24_CHECKS`.
Validation: `tsc` (the brief's flags) and `eslint` are clean, and the file is Prettier-formatted. A self-check script
confirmed these:

- scene ids are unique;
- every `who` is declared;
- no line is over 160 characters;
- no narrator line has more than two sentences;
- both `childLines` keys point at the quoted lines;
- every check and every set flag is listed in its export.

## Counts

| | Count |
| --- | --- |
| Quests | 1 (S24, audience `all`) |
| Steps | 15 |
| Scenes | 54: 31 in the quest (15 step scenes, 15 done scenes and the complete scene) and 23 variants |
| Lines | 428 scene lines (229 in the quest, 199 in the variants), plus 41 choice `then` lines |
| Choices | 22 options at 9 choice points (12 options at 5 points in the quest, 10 at 4 in the variants) |
| Checks | 15, one per step, all existing verbs |

## Lifted text

*Up* (Pixar, 2009) is copyrighted. These are the two single lines Part M lists; each is used once and each has
`childLines`.

1. "Adventure is out there!" Tilly says it at the top of the falls (`s24-falls-top#3`). In the story it is Augusta
   Fairweather's old motto, which reached Tilly through Hazel's childhood Young Explorers badge.
2. "Thanks for the adventure – now go have a new one!" Hazel's last line in the back of the book
   (`s24-back-pages#13`).

All other words are original. The film's book title and page headings are not used.

## Flags

**Read:**

- `walk`, `hazel` and the ending id, as briefed.
- `s14Done` and `s18Done`, from the outline.
- `keptStone`, added (see the changes below).

**Written:** `s24Done`, plus three local flags: `s24-bird` (fed | waited), `s24-cairn` (cup | scarf | book) and `s24-page`
(shelf | tea | here). No campaign flag is written.

## Variants (23 scenes, all in `SIDE_STORY_S24_VARIANTS`)

- **Step 1, by `walk`:** `s24-tea-moss`, `s24-tea-moss-stayed` (`keptStone`) and `s24-tea-sable`. Insert:
  `s24-moss-kept` (`keptStone` and `walk` is not moss).
- **Step 3:** `s24-lantern-corvin`.
- **Step 4:** `s24-stowaway-knows` (`s14Done`).
- **Before step 5, by ending:** the inserts `s24-bun-moss` (moss-sleeps) and `s24-eternal-watch` (eternal-dawn).
- **Step 6, collector ending:** `s24-bird-collector` and `s24-bird-collector-kept`.
- **Step 12 done:** `s24-nest-waited`, `s24-nest-fed-collector` and `s24-nest-waited-collector` (the default is
  `s24-nest-fed`).
- **Step 14 done, by `hazel` and `keptStone`:** `s24-lights-told`, `s24-lights-kept` and `s24-lights-told-kept`. Inserts:
  `s24-shelf-moss` and `s24-shelf-sable`.
- **Step 15, by `s24-cairn`:** `s24-tick-scarf` and `s24-tick-book`.
- **Complete:** `s24-home-eternal`. Insert: `s24-home-corvin`.
- **Later:** `s24-lecture`, at the museum, when `s18Done` is set.

The quest's notes give the exact selection rule and play point for each. They also give a six-line substitution table
for `keptStone` runs, where your Nubbin walks instead of running.

## SIM needs (also in the notes, under "SIM")

- The trigger is the first post-game spring. If post-game time has no seasons, it is the first post-game morning.
- The ending id is read from `CampaignState.ending`.
- The atlas item gains a margin-note layer, shown once `s24Done` is set, and a last page.
- New: the Sunrise Shelf viewpoint section.
- New: Fairweather as a resident NPC.
- The tall bird and her chicks visit the pond in spring. This is ambient only, with no interaction.
- Hazel's lantern is staged on its hook even if `s10Done` is false.
- The hold-still wait has no timer, no fail and no music.

## Hazel's margin notes (as data in the notes)

There are 29 notes, one per Atlas page except A11 and A14. Those two pages keep their own earlier notes, and S24 adds
nothing to them. Each note is anchored to a named quest.

- **New, written for this line (19):** A1–A10, A12, A13, A15, A16, A17, A19 and A21–A23. The outline's examples are used
  on A19 ("I'd have fed the dragon.") and A8 ("Ha. Typical."). `s24-home` quotes both, so the pages must match.
- **Copied verbatim from Part M's own outlines (10):** A18, A20 and A24–A31.

## Changes from the outline, and why

- **Merged and split steps.** Q5 (the heavy pack) and Q6 (beside the falls) are merged into one step. Q10 is split in
  two: giving the lantern, then the reading and the wait. That makes 15 steps.
- **`keptStone` read.** It isn't in the brief's read list, but it is needed for three things:
  - Telling `end-epi-walk-moss` (Moss came down) from `-moss-stayed` (his flower). The ending id alone can't do it,
    because the collector ending can come from either route.
  - The cold hands. They exist only on the kept route; in the collector ending reached by selling, Tilly notices
    something else instead.
  - Keeping canon with `end-collector-kept`: Moss sits with his back to the Grove, the Nubbins are stilled, and the
    Long-Grass post flickers.
- **Moss's flower.** The outline says it is "a little way from" Hazel's. Canon (`end-epi-walk-moss-stayed`) says the two
  flowers are "very close together", and canon wins. Nova tucks her knees up to sit between them.
- **Where the lantern hangs.** The outline puts it on a "pond hook" for `walk = corvin`. Canon (`end-epi-walk-corvin`,
  S10's letter) has it on the hook by the cottage door in every route, so that is where it hangs. Corvin trims its wick
  on a Sunday (the family gate), and on the return an insert has him see it come back lit.
- **Nova's cairn.** "What Nova leaves in the cairn" became a player choice: keep the tin cup, keep the scarf, or keep
  only the book. It pays off at the Shelf. Hazel's lantern stays yours.
- **Tilly's badge.** The pencil stub on a string goes to Tilly, as the outline says. The reward, "Tilly's pencil-stub
  badge", is a cardboard badge she letters for you with it: HELPING SOMEONE SAD (ADVANCED).
- **The striped-feather hat.** The feather is Fairweather's own, the one the papers laughed at. She gives it to you at
  the nest.
- **Tilly in the dark.** She is out of sight from the net to the nest, but heard throughout: Hazel's two-finger supper
  whistle, and one shouted "I'M FINE". Your Nubbin goes to her and comes back calm. This keeps the beat safe for
  children.
- **Fire.** The care note says "Fire is not used". I read that as no fire as a danger or a plot device: there is no
  campfire at Fairweather's camp and no burning. Hazel's lantern is still lit, as all the valley's lanterns are.

## For Maor

- **The title.** "The Adventure Book" is close to the film's book title, which we said we wouldn't use. In-world the book
  is never named. Keep the title, or try "Places I'll Go"?
- **The ending is gentle grief, as you'll see in step 10.** Nova reads the back pages. In them, Hazel nearly told her and
  didn't ("She'd have stayed, and hated it, and so would I."), and Nova cries for a hold-still beat with no music. The
  illness is never named.
- **Nova's line from Hazel.** It is a line in the back of the book, not a letter, so canon 8 (one letter, to you) still
  holds.
- **Three margin notes to check for tone:** A10 ("The grandmother goes first and tells her to go…"), A21 ("Look at them
  properly.") and A23 ("Usually the chin."). They are the closest to Hazel's own death.
- **The last page.** I left a free-text option for it out of the content. The page holds the line chosen in step 15. Say
  if you want free text in the main game.
- **Learning Grove versions** for both bands still need writing, in the edu side-story files.
