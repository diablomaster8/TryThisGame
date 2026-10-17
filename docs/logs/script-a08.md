# Script log: A8 The Twelve Tasks (Asterix)

File: `src/content/atlas-a08.ts` (exports `ATLAS_A08`, `ATLAS_A08_CHECKS`, `ATLAS_A08_FLAGS`,
`ATLAS_A08_VARIANTS`). Audience `all`.

## Counts

- 14 quests (A8-1 to A8-14), 30 steps, 68 scenes (including 3 variants), 412 lines, 47 choices.
- The task order is the verified one: Asbestos I, Verses II, Cilindric III, Isle IV, Iris V, Mannekenpix VI,
  Cave VII, Permit A38 VIII, Ravine IX, Old Man X, Haunted Plain XI, Circus Maximus XII.

## Lifted text

None. All dialogue is original, and none of the source's catchphrases is used. "Permit A38" and
"Permit A39" are plot details, not quotes. There are no lyrics, because the bard never sings. So there are
no `childLines`.

## Flags

- **Read:** none (the outline asks for no Grove reads).
- **Written (Atlas save only):** `a08-01`…`a08-14`, `a08-done`, `a08-09-form-made`, and
  `a08-form` = loop | boar | plain (the signature choice).

## Variants

`a08-14-bard-loop`, `a08-14-bard-boar` and `a08-14-useful`. Play one of them, chosen by `a08-form`,
after `a08-14-tie-done` and before `a08-14-complete`. If the flag is unset, the default is `loop`.

## SIM needs

- The wax tablet: a page UI with XII lines, ticked once per task.
- The potion cauldron: one sprint per race, for any number of races. It never raises stats and has
  no timer.
- `atlasDone('A8')` from `a08-done`, for the Price of Power festival.

## Changes from the outline

- **A8-9 (Permit A38)** has 4 steps: the door, the counters, designing the form, and A39. The
  signature choice is in step 3. The A39 trick wins on every path; your form is the extra spanner.
- **A8-8 (the Beast)** stays mostly offscreen and turns out to be shy. Hazel's third rule is acted
  out here, never quoted.
- **A8-10:** there is no rope. Obelix punches an already-fallen pine into a bridge, out of respect
  for Dogmatix's love of trees.
- **A8-11:** the riddle is an advert for the Old Man's own goat's-milk soap. The soap is our invention.
- **A8-12:** the "permit" complaint and the ghost eyeing your tablet are a light nod to the form,
  the same on every path.
- **A8-13:** the champions from tasks I–VI cheer from the stands. This is our addition.
- **Rewards:** the outline's three, plus the Price of Power Bookmark, as on A20.

## For Maor

- A licence is needed to ship this page (Les Éditions Albert René).
- Please check the observer's name "Caius Pupus" against the English version you want.
- Before ship, someone should read each champion with the care notes in mind, to make sure every
  national joke stays affectionate.
