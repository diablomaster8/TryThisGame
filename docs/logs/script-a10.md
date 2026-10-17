# Script log: A10 The Heart of the Island (Moana)

File: `src/content/atlas-a10.ts` (exports `ATLAS_A10`, `A10_VARIANTS`, `ATLAS_A10_FLAGS`,
`ATLAS_A10_CHECKS`). Audience `all`.

Written from the agent's hand-back report; the agent was told to edit only its own file.

## Counts

- 14 quests (A10-1 to A10-14, chained with `requires`), 42 steps (3 per quest), 102 scenes (4 variants),
  527 lines, 29 choices at 14 choice points (one or more in every quest), 42 checks. The 20 choices added in the
  review pass (2026-10-16) are flagless moments at the edges; only `a10-step` and `a10-approach` set flags.

## Lifted text

None (0 of the 3 allowed quotes), so no `childLines`. No film songs, lyrics or titles; Gramma's song is
described, never written out. About 20 lines that sat too close to the film's script or songs were rewritten
(opening legend, Tala's goodbye, Moana's demand to Maui and her declaration, her words to Te Kā).

## Frame

You arrive as Gramma Tala's guest. Your Nubbin stows away in the canoe's hull with Heihei in A10-5, and the
ocean then lifts you aboard after it. Moana stays the hero. Maui is boastful but never mocked: his deeds come
from Polynesian tradition and his grief is real. Tala's death is said plainly once, followed straight away by
the comfort of the manta.

## Flags

- **Written (Atlas save only):** `a10-01`…`a10-14`, `a10-done`. No Grove flags read or written.
- `a10-step` = glide | wave (A10-3): pays off in A10-12 when the manta moves in the step, in A10-14 when your
  Nubbin dances it at the bow, and in the Grove canoe's idle animation.
- `a10-approach` = gift | word | walk (A10-13): pays off in Te Fiti's answer, in A10-14's closing scene and in
  the Grove canoe's prow detail. It can only pay off one quest later because of where the outline puts it.
- **Variants:** `a10-12-manta-wave`, `a10-14-bow-wave`, `a10-14-complete-word`, `a10-14-complete-walk`.

## Review pass (2026-10-16)

- Added a small choice to each of A10-2, 4, 5, 6, 7, 8, 10, 11, 12 and 14 (scenes a10-02-coconuts, a10-04-canoes,
  a10-05-pack, a10-06-maui, a10-07-fog, a10-08-swell, a10-10-story, a10-11-gap, a10-12-light, a10-14-farewell).
- Gift route: the shell stays with Te Fiti, so the canoe now has a spiral shell *painted* on its prow (it was "lashed").
- Moana's demand to Maui and her declaration in A10-12 moved further from the film's lines.
- Header notes S24's margin note beside A10-5 (engine data) and the variant defaults (glide, gift).

## Rewards

Woven-sail cosmetic (A10-8); voyaging-canoe decoration and the star compass on the hill (A10-14); Great Voyage
Bookmark (A10-14), so the festival can read `atlasDone('A10')`. The "SIM:" engine needs are in A10-14's notes.

## For Maor

- A Disney licence is needed.
- Pacific Islander advisers should check the wayfinding lines in A10-8, the cave of canoes, Gramma's song, Maui
  and his tattoos, and the use of "Te Fiti", "Te Kā" and "Lalotai".
- No haka or chant text: Maui's words at the Lalotai pillar are left unwritten on purpose.
