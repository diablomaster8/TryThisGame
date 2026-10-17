# Script log: A2 The Monkey and the Monk (Journey to the West)

File: `src/content/atlas-a02.ts` (exports `ATLAS_A02`, `ATLAS_A02_VARIANTS`, `ATLAS_A02_FLAGS`,
`ATLAS_A02_CHECKS`). Audience `all`.

Written from the agent's hand-back report; the agent was told to edit only its own file.

## Counts

- 19 quests (`a02-01`…`a02-19`, A2-1…A2-19, each requiring the one before), 59 steps, 107 scenes plus 2
  variants, about 626 lines, 50 choices, 59 checks.
- The quests follow the novel's order as fixed in `docs/atlas.md`. You are the "fifth disciple" who carries
  the luggage; from A2-10 you share a pole with Sandy. Monkey calls your Nubbin "Cousin".

## Lifted text

None. No line needs `childLines`.

## Flags

- **Read:** none. **Written:** `a02-01`…`a02-19`, `a02-done`, `a02-believed`.
- Signature choice, A2-12: believe Monkey or the monk, setting `a02-believed` = monkey | monk. It pays off in
  A2-15 (with `monkey` the monk asks which Monkey is his; with `monk` Monkey asks you, variant
  `a02-15-which-monk`; saying plainly that you can't tell is the answer that gets thanked) and in A2-19, which
  has `a02-19-complete` and the variant `a02-19-complete-monk`.

## Rewards

Immortal peach tree (decor, A2-5, given freely by the Queen Mother after your Nubbin refused the stolen
peaches); golden band hat (cosmetic, A2-19); cloud-somersault fast travel (feature, A2-19), usable any time
with no limit.

## Changes from the outline

A2-12 has a fourth step for the return, condensing chapters 28–31. A2-13, A2-16 and A2-17 condense several
chapters each.

## Softened from the novel

Bandits are chased off, not killed. The White Bone Demon's three disguises crumple like empty coats, leaving a
small chalky heap of bones. Monkey spares the six-eared macaque. Red Boy's lotus seat closes gently instead of
being made of blades. Left out: the abbot's fate, Sandy's necklace, the spiders' bathing pool, the monk's old
body floating away. The ginseng fruit's baby shape is said once, plainly, as the monk's reason for refusing it.

## For Maor

- The Buddhist and Daoist titles at the end aren't named on screen; the adviser should check that part.
- Prettier flags the file; A11 and A22 don't pass it either, so it was left matching them.
