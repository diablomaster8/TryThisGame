# Script log: A6 Seven Voyages (Sinbad)

File: `src/content/atlas-a06.ts` (exports `ATLAS_A06`, `A06_VARIANTS`, `ATLAS_A06_FLAGS`,
`ATLAS_A06_CHECKS`). Audience `all`.

Written from the agent's hand-back report; the agent was told to edit only its own file.

## Counts

- 16 quests (A6-1 to A6-16, chained by `requires`), 45 steps, 103 scenes, 590 lines, 36 choice points, 45 checks.

## Lifted text

None. A few `childLines` soften voyage 3, voyage 4 and the line about the pirates selling the crew.

## Frame

You are the porter's friend and help him carry paper to the House of Wisdom. When the old sailor tells a
voyage, you and your Nubbin step into it beside the young Sinbad while the porter stays on his cushion. Voyage 4
is told mostly from the cushion; you step in only for the dark cave and the tunnel out to the sea.

## Flags

- **Written:** `a06-01`…`a06-16`, `a06-done`. Signature choices: `a06-stone` (taken | left, A6-5) and
  `a06-ivory` (told | kept, A6-14).
- **Read:** only `s24Done`, for Hazel's margin note (`a06-margin-hazel`). No Grove flag written.
- The stone choice in A6-5 pays off 11 quests later in A6-16. In both A6-14 branches no elephant is hunted
  again, and both scenes say so.

## Variants (7)

The margin note; A6-5's complete when you took nothing; A6-14's complete when you kept the secret; both A6-15
scenes when kept (poor and late; the porter feeds the old sailor); A6-16's opening when you took nothing ("I had
nothing, so I listened."); A6-16's last line when kept ("paid for in a season").

## Rewards

Roc feather cosmetic (A6-4), dhow-sail decoration (A6-15), storyteller's cushion (A6-16).

## Changes from the outline

- **Voyage 3:** the giant is beaten by a pepper sneeze, not blinded; nobody is eaten; the serpent only circles
  the tree.
- **Voyage 4:** the death and the burial custom are each said once, plainly, by the old sailor. No bodies in
  the cave; the source's killings are cut; a little striped animal shows the way out.
- **Voyage 5:** the roc chick lives (the merchants only crack the egg); the Old Man of the Sea is tricked off
  with a fig branch.
- **Voyage 6:** the lost shipmates go over the mountain and their fate is never known.
- **Voyage 7:** Sinbad misses the elephants on purpose, every time. No ivory is ever a reward, decoration or item.
- **Baghdad as a city of learning:** House of Wisdom, round city and gates, a translator at Harun al-Rashid's
  court. The Caliph is dignified and appears only in A6-13.
- **A6-12:** Sri Pada (Adam's Peak) is named for four faiths equally, as the farmer's "some say".
- **A6-16:** its last two steps play in the Grove and write nothing there. Nova closes the page with a gentle
  mention of the Nights' Persian frame.

## SIM needs

The cushion's Nubbin ring is an idle behaviour, never a timed event. The dhow sail swings with the wind. The
Great Voyage festival reads `atlasDone('A6')` from `a06-done`.

## For Maor

- Arab and Persian heritage advisers must approve names, dress, Caliph and court, greetings, the call to prayer
  as background sound, the porter's home and Nova's lines on the Persian frame. Sri Lankan and faith advisers
  must approve A6-12.
- Placeholders: the translator, the porter's unnamed daughter, the Harun-era House of Wisdom wording.
- A6-14 has a run of "Every morning…" narration lines. It is a story beat, not a timer, but the timer warning
  may flag it once the file is registered.
