# Log: A14 Homecoming

File: `REPO/src/content/atlas-a14.ts`. Exports `ATLAS_A14`, `A14_VARIANTS`, `ATLAS_A14_FLAGS`, `ATLAS_A14_CHECKS`.
`tsc` (strict, the brief's flags) and `eslint` pass with no output. The self-check (`script/chk-a14.mts`, adapted from
A11's) finds 0 problems: ids unique, every `requires` resolves, every `who` declared, lines ≤ 160, narrator lines ≤ 2
sentences, step scenes 6–16 lines, no straight quotes, every lifted line keyed in `childLines`, flags and checks lists
exact, every check uses an existing verb with an `a14-` object.

## Counts

- Quests: 20 (A14-1 to A14-20), audience `all`, chained by `requires`. No quest merged or split.
- Steps: 60 (3 per quest; A14-8 has 4, A14-14 has 2).
- Scenes: 149 (134 in the quests, 15 variants).
- Lines: 967, counting choice `then` lines.
- Choices: 40 choice points in the quests (113 options), plus the Argos choices repeated in one variant. Every quest
  has at least one.
- Checks: 60, all with existing verbs.

## Lifted text (verbatim, each used once, each with a `childLines` entry)

Butler's 1900 prose translation, Project Gutenberg #1727, Book II, as Part M rechecked it on 2026-10-14. Both are
Antinous's words in Homer, and he speaks them here.

1. "She set up a great tambour frame in her room, and began to work on an enormous piece of fine needlework."
   `a14-02-antinous#1`.
2. "but at night she would unpick the stitches again by torchlight." A fragment inside our own sentence ("We saw her at
   her great web all day long, but at night …"), `a14-02-loom#0`, as a voice-over.

**Not quoted (Part M marks them [unverified]):** Nobody (`a14-08-wine#5`), his mother (`a14-11-shades#10`), the wax
(`a14-12-advice#3`), Scylla (`a14-13-strait#2`), Argos (`a14-16-gate#6`) and the olive (`a14-20-bed#5–6`). Each is told
in our own words. I couldn't reach Gutenberg from here (the proxy refused it), so nothing beyond the two verified lines
was checked again. No modern translation was used, and no song words appear: Demodocus and the Sirens are described.

## Flags

- **Read (Grove, read-only):**
  - `corvinGate`. It only exists from S9's dawn scene on the morning of chapter 12, so before then the page has no
    Corvin. With `family`, Corvin joins (`a14-corvin-joins`, once, before the first quest begun after that), sits with
    Argos, speaks in A14-19, and walks you out. With `guest`, he's at the stuck gate when you shut the atlas. With
    `shut`, the lane is empty and the gate sticks. With `unset`, nothing changes.
  - Campaign finished (`CampaignState.ending`, after Hazel's walk). This plays Hazel's note on the Argos page,
    verbatim from the outline, with "I came back. C." under it if `corvinGate` = family. It's the same read A11 uses.
- **Written (Atlas save only):** `a14-01`…`a14-20`, `a14-done`, `a14-name` = dont | shout | silence (A14-8), and
  `a14-corvin`. No Grove flag is written.

## Variants (`A14_VARIANTS`, 15)

- `a14-corvin-joins` sets `a14-corvin`.
- `a14-14-harbour-shout` and `-silence` replace the A14-14 step 2 scene. The shown scene is the "dont" one.
- `a14-16-gate-shout` and `-silence` replace the A14-16 step 2 scene.
- `a14-16-sit-corvin` replaces the A14-16 step 3 scene.
- `a14-19-aegis-done-corvin` replaces the A14-19 step 2 done.
- `a14-20-bed-shout` and `-silence` replace the A14-20 step 2 scene.
- `a14-20-complete-silence` replaces the A14-20 complete.
- `a14-close-family`, `-guest` and `-shut` play straight after the A14-20 complete.
- `a14-margin-hazel` and `-family` play after the A14-16 complete, or the first time the Argos page is opened after
  the ending.

The signature choice is A14-8's shout (dont, shout with him, or silence). It pays off in A14-14 (6 quests later),
A14-16 and A14-20, with all three of the outline's beats.

## SIM needs

- **Penelope's loom.** A cottage decoration whose cloth grows one band for each finished Atlas page. It reads
  `atlasDone(id)` across pages and never grows from chores or time.
- **Great Voyage festival.** It reads `atlasDone('A14')`.
- **Atlas reads Grove state.** The Atlas reads `corvinGate` and `CampaignState.ending`, read-only.
- **Corvin's join.** It is decided at quest start, and `a14-corvin` is kept in the Atlas save.
- **Sirens silence.** In A14-12 the audio is ducked to silence, with an optional rumble for the oars.
- **Content line.** A14-11 offers a "leave and come back" control alongside its content line.

## Rewards (all one-time)

- "Nobody" Nameplate (decor, A14-8).
- The Great Bow, Unstrung (decor, A14-19). It is given as a guest-gift, because in Homer the bow was itself a
  guest-gift from a friend.
- Penelope's Loom (decor, A14-20).
- The Bed-Tree Olive (decor, A14-20).
- Great Voyage Bookmark (item, A14-20).

## Changes from the outline, and why

- **The "dont" payoff at the bed is "first time since the giant's island", not "first time in the line".** He names
  himself in the Phaeacian hall (A14-7, as Homer has it) and shouts it in A14-8, so the literal version can't be
  true. After A14-8 he never says his own name until the bed. In A14-19 the narration points out that he doesn't.
- **A14-14 gives the shout and silence routes a line too.** The outline only specifies "dont". The other two get a
  short line in the same place ("Not a word this time"; "I'm counting on it").
- **Story-within-story frame.** The atlas lets you step into a story when someone tells it (Antinous, Menelaus,
  Odysseus). This is how you can be there for the torch, the Cyclops and the Sirens. A14-13's complete scene brings
  you back to the hall.
- **Tiresias is kept in A14-11.** He gives the warning about the Sun's cattle and the "late, alone" prophecy, so
  A14-13 makes sense. Circe's advice gets a scene of its own in A14-12, step 1.
- **The A14-19 softening goes one step further.** Odysseus's first arrow knocks the cup from Antinous's hand, and no
  one is hit. Phemius and Medon are spared on screen, as in Homer. The maids help clear the hall.
- **Small additions.** Argos is buried under an olive. Your Nubbin isn't offered Circe's cup.
- **Cut or reduced, to keep the cast small and keep it `all`:**
  - Melanthius is an unnamed goatherd, seen kicking at the beggar and never punished.
  - Philoetius, Irus and Euryalus are cut, and so are the games.
  - The Phaeacian ship turned to stone is cut.
  - Eurycleia's offer to name the false maids is cut.
  - The Laestrygonians are reduced to one line.
  - Odysseus thinking of jumping overboard (Book X) becomes lying down with his face covered.
  - The Pylos sacrifice is shown as a feast that you only watch.
- **No Learning Grove (edu) file.** As with A11, the brief asks Atlas lines only for `childLines`. The outline's edu
  version (islands, oral poetry, warp and weft, *xenia*, *nostos*, dog memory) is still to do.

## For Maor

- **A classicist read.** The care notes ask a Greek classicist to read the script before ship, because Hellenic
  polytheism is a living religion. The gods speak only as Homer has them (Athena, Hermes, Calypso, Ino). Zeus and
  Poseidon never speak. The player only ever thanks a god and never prays or makes an offering.
- **Six unverified Butler passages.** They are paraphrased. If you want any verbatim, check them against #1727
  Books IX to XXIII, and add `childLines` when you swap them in.
- **Your call on Corvin at Argos.** He says "Nobody waited for me like that. … No. That isn't true, is it. Somebody
  did." It leans on canon 12 (Hazel stood at his gate for an hour) without saying it outright.
