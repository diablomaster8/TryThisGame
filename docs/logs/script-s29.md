# Log: S29 The Gates of Dawn

File: `REPO/src/content/side-stories-s29.ts`. Exports: `SIDE_STORY_S29`, `SIDE_STORY_S29_VARIANTS`,
`SIDE_STORY_S29_FLAGS`, `SIDE_STORY_S29_CHECKS`. tsc (strict, the brief's flags) and eslint are both clean.
A self-check script (`SCRATCH/checks/s29-check.mjs`) confirms: unique ids, every `who` declared, lines of 160
characters or fewer, narrator lines of two sentences or fewer, every step scene 6–16 lines, CHECKS matching the
steps, and every `childLines` key pointing at the lifted line.

## Counts

- Quests: 1 (`s29`, code S29, audience `all`).
- Steps: 15.
- Scenes: 40. That is 15 step scenes, 14 done scenes, 1 complete scene and 10 variants.
- Lines: 414, including choice `then` lines.
- Choices: 2 choice points with 3 options each, so 6 options. Step 4 sets `s29-gift`; step 14 sets `s29-wayfarer`.
- New speakers: `granny-brock`, `s29-seafarer` and `s29-children`. The otters are not speakers.

## Lifted text

Source: Grahame, *The Wind in the Willows*, Methuen 1908. These are verbatim, as verified in Part M. I could
not recheck them myself because gutenberg.org is blocked from here.

1. "Bother! O blow!": Dusty, `s29-digging#4`.
2. "Hang digging!" (adapted from "Hang spring-cleaning!"): Dusty, `s29-digging#7`.
3. "Believe me, my young friend, there is nothing—absolute nothing—half so much worth doing as simply messing
   about in boats.": Marina, `s29-boats#6`. The notes ask for "nothing" in italics.
4. "O stop, stop! This is too much!": Dusty, `s29-picnic#3`.
5. "Then the faces began.": narration, `s29-wildwood#6`.
6. The fragment "nothing half so—": Dusty's callback in `s29-packing#5`.

Each of these has a `childLines` replacement (6 in all).

The four lines Part M marks [unverified] are paraphrased in our own words: the capital little house, Portly
missing again, "on the chance", and "Afraid! Of HIM?". The carol is replaced by one verse of the bible's Lantern
Song, as written.

## Flags

- **Read:** `s4Done` (step 8, the river's height), `s5Done` (step 10, the Fossil memory), and the chapter
  state: whether c6-open has played (step 6's kitchen line).
- **Written:** `s29Done`, plus the local flags `s29-gift` and `s29-wayfarer`. No campaign flags.

## Variants

| Variant | Replaces | When |
| --- | --- | --- |
| `s29-kitchen-after` | `s29-kitchen` | After c6-open |
| `s29-low-river-full` | `s29-low-river` | `s4Done` is set |
| `s29-supper-walk` | `s29-supper` | `s5Done` is set |
| `s29-night-ribbon`, `s29-night-bell` | `s29-night` (the bead version) | By `s29-gift` |
| `s29-ford-ribbon`, `s29-ford-bell` | `s29-ford` (the bead version) | By `s29-gift` |
| `s29-complete-sat`, `s29-complete-pencil` | `s29-complete` (the held version) | By `s29-wayfarer` |
| `s29-brock-knock` | (ambient) | Granny Brock's door, by day, after the line |

## SIM needs

These are listed in the notes under "SIM:".

1. A rowing mini-game with two courses: the weir, which has a carry segment when `s4Done` is false, and the
   night search, which has the gift cue. Neither course can be failed.
2. Marina's boat as a rowing feature from step 4. After the line ends, her flat winter boat takes over.
3. The river section map, with the otters as ambient wildlife that never comes within reach. The island is never
   landable outside `s29-island`.
4. Granny Brock's door in the Wild Wood.
5. Dusty's home moves back to the cliff house after `s29-supper`.
6. Reading the chapter state for the kitchen variant.

## Changes from the outline, and why

- **Merged quests.** I merged Q2 with Q3, Q7 with Q8, and Q15 with Q16, giving 15 steps.
- **Low River moved.** Q6 (the Low River) now comes after the Wild Wood chain and after c6-close. S4 opens only
  after c5-close, so a chapter 5 read of `s4Done` would always come back false. Marina's line becomes "Cold. In
  August." / "It was cold in July, too.", which echoes S4.
- **Vests from the first trip.** Everyone wears cork vests from step 2, to meet the care note "water scenes always
  have vests". Q5 now hands out your Nubbin's own vest, which is the cosmetic reward.
- **Gift pays off twice.** Portly's gift pays off in step 12 (the night search) and again in step 13, when Portly
  returns it with a pebble. That gives the keepsake three versions.
- **Night search.** You and Marina row, as the outline says. Dusty sits with the old otter at the ford.
- **Afraid line paraphrased.** It is not quoted, so it doesn't name Dusty.
- **Kitchen variant added.** Chapter 5 is short (c5-close starts chapter 6 at once), so the Wild Wood chain can
  land after Fossil's farewell. The variant covers that case.
- **Winter boat added.** After the boat is laid up, Marina's winter boat keeps the rowing reward usable before
  spring.
- **Island placement.** The island sits just above the weir, where the river splits round it, and is reached by a
  slipway. This follows Grahame.
- **Third rule.** The "sit" choice acts out Hazel's third rule without quoting it.
- **Extra reward entry.** The river section gets its own feature entry, as Tier 2 and the bible table list it.

## For Maor

- **Unverified quotes.** If someone verifies the four Chapter V and VII lines against #27805, they can replace
  the paraphrases (in `s29-cliffhouse#1`, `s29-missing#2–4`, `s29-ford-watch#2` and `s29-island#5–7`). Each would
  then need a childLine.
- **Learning Grove version.** The outline says yes to a Learning Grove version, but it isn't in this file. It
  needs a reader file and a sprout file, covering rivers, otters and water safety, and homesickness.
- **Shepard illustrations.** E. H. Shepard's 1931 illustrations are still in copyright in the UK. The art should
  take nothing from them.
- **Closing at chapter 8.** The line closes when chapter 8 opens. A player who reaches `sableTrust45` quickly
  could miss Wayfarers and Laid Up. Consider holding c7-close while steps 14–15 are open, as S5 does with c5-close.
- **Island staging.** The island must show no figure, footprint, pipe or melody, and the camera never looks up.
  Please hold the art and audio teams to this; it keeps the presence ambiguous and out of canon.
