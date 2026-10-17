# Log: A26 The Wall of Uruk

File: `src/content/atlas-a26.ts`. It exports `ATLAS_A26`, `A26_VARIANTS`, `ATLAS_A26_FLAGS` and `ATLAS_A26_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. A self-check script (kept in the scratchpad,
not the repo) found 0 problems. It checked that:

- ids are unique and every `requires` resolves;
- every `who` is declared, and every declared speaker speaks;
- lines are ≤ 160 characters and narrator lines are ≤ 2 sentences;
- step scenes have 6–16 lines;
- the flag and check lists match the file exactly;
- every check uses an existing verb and an `a26-` object;
- there are no straight apostrophes in text and no em dashes.

## Counts

- **Quests:** 18 (A26-1 to A26-18), audience `all`, chained by `requires`.
- **Steps:** 44, with 2–4 per quest and one check each (44 distinct checks).
- **Scenes:** 111 (96 in the quests, 15 variants).
- **Lines:** 634, counting choice `then` lines.
- **Choices:** 44 choice points and 92 options. Every quest has at least one.

## Lifted text

R. Campbell Thompson, *The Epic of Gilgamish* (1928), verse translation, from the sacred-texts copy as Part M gives it.
The file uses exactly the outline's eight passages, each once, and each has a `childLines` entry. On screen, "Erech" is
Uruk and "Gilgamish" is Gilgamesh. Where the outline joins two verse lines with "/", they are set as two lines from the
same speaker.

1. Tablet I, Enkidu with the gazelles: `a26-03-herd#3`, `#4` (narration).
2. Tablet I, "Of Uruk, the high-wall'd,": `a26-01-tablet#4`, a fragment inside the brickmaker's sentence.
3. Tablet X, "O Enkidu, he was my comrade,": `a26-14-death#9`, then our own words.
4. Tablet X, Siduri, "why runnest thou…": `a26-16-siduri#6`, `#7`, with the bracketed "(inasmuch as)" dropped.
5. Tablet X, Siduri, "Cherish the little one…": `a26-16-siduri#9`.
6. Tablet X, Uta-Napishtim, "Shall we for ever build houses…": `a26-17-tale#3`.
7. Tablet XI, the plant's name: `a26-17-plant-done#1`, a fragment.
8. Tablet XI, "Do thou, Ur-Shanabi…": `a26-18-wall#7`, `#8`. Line #9 finishes the passage in our own words.

The copyright caveat is in the header. Thompson's translation is public domain in the UK, the EU and the US, but may still be
in copyright in longer-term countries such as Mexico (to the end of 2041). It needs a legal check, with Jastrow and Clay
(1920) or our own words as the fallback. The childLines already are our own words.

## Flags

- **Read (Grove, read-only):**
  - **For Moss:** the chapter, `mossFaded` and the ending id. Moss comes only if c4-out has been seen, `mossFaded` is
    false and the ending is not `moss-sleeps`. This is read when each quest starts.
  - **`s24Done`:** Hazel's margin note in A26-17.
  - **The Grove keepsake:** Moss's faded state and the ending pick the brick scene.
- **Written (Atlas save only):** `a26-01`…`a26-18`, `a26-done`, and `a26-humbaba` = spoke | silent | agreed (A26-10's
  signature choice). The page writes no Grove flag.

## Variants (`A26_VARIANTS`)

- **Moss comes:**
  - `a26-01-page-moss`: he climbs on to your shoulder.
  - `a26-03-herd-done-moss`: "Nothing wrong with him. He just hasn't met anyone yet."
  - `a26-14-death-done-moss`: he says nothing at all, all night.
  - `a26-16-siduri-done-moss`: he agrees with Siduri.
  - `a26-18-complete-moss`: the outline's closing line.
  - `a26-18-complete-moss-spoke`: the same, plus "And somebody let a tree live."
  - Without Moss, the scenes play as written, and your Nubbin takes his beats: it sits silent in Gilgamesh's lap
    in A26-14, and rides on your shoulder, looking at the wall, in A26-18.
- **Humbaba (A26-10 → 13, 14, 18).** The scenes as written are the silent path.
  - `a26-13-dream-done-spoke` and `a26-13-dream-done-agreed`.
  - `a26-14-sickbed-done-spoke` (the cedar seed) and `a26-14-sickbed-done-agreed` (the shepherds).
  - `a26-18-foot-spoke` (the cedar sapling; "I should have listened") and `a26-18-foot-agreed` ("We both learned it
    late").
- **`s24Done`:** `a26-17-snake-done-hazel`.
- **The Grove keepsake:** `a26-grove-brick` (by the flat stone), or `a26-grove-brick-flower` (by his flower, if Moss
  has faded or the ending is `moss-sleeps`).

## SIM needs

- **Moss's presence check, at each quest's start:** c4-out seen && !mossFaded && ending != 'moss-sleeps'. While Moss
  is present, draw him on your shoulder through the page.
- **The keepsake scene** plays once, on the first return to the Grove after A26-18 (`atlasDone('A26')`). It places:
  - the handprint brick by Moss's flat stone (by his flower if he has faded);
  - the cedar tablet box on the cottage shelf.
- **The reed boat** (A26-17) is pond decor that Nubbins can push about.
- **The lion-skin cloak** (A26-15) is a Nubbin cosmetic.
- **No timers:** every reward is one-time.

## Changes from the outline, and why

- **The guide on the wall** is an old brickmaker (our own). She bookends the page: she shows you the box in Q1, and in Q18
  she presses your handprint into the brick and gives the heritage line about taken and returned tablets (in
  `a26-18-foot-done`, so every player hears it).
- **The Waters of Death crossing** is A26-16's complete scene rather than a step in A26-17. That keeps A26-17 at four steps
  (tale, sleep test, plant, snake).
- **Ninsun's dreams (A26-6)** are told by Gilgamesh in her hall, where you carry the cups. In the epic, Shamhat retells
  them to Enkidu.
- **The ale (A26-5)** is kept in one line, and nobody is shown drunk. His song has no words.
- **The traveller (A26-5) and the door (A26-7)** lose the brides material, as the care notes ask.
- **The number of punting poles** is left vague, because the versions differ.
- **The cedar tablet box** is made from the offcuts of the great door. Gilgamesh gives it to you at A26-18.
- **Lifted line 3** keeps the words "he was" without brackets, which is how I read "drop the brackets". Line 4 drops the
  bracketed words, as the outline says. Line 6 drops the brackets and keeps the words ("houses", "to contract").
- **No Learning Grove (edu) version** is in this file. The other Atlas files leave it out too, and plan.md item 2 covers
  it.

## For Maor

- **Legal check on Thompson 1928.** The page is ready to swap to Jastrow and Clay or to our own words if needed. The
  childLines are already original.
- **Advisers:** an Iraqi adviser and an Assyriologist, before ship. The care notes in the header are written for them.
- **Softened for All:** Humbaba and the Bull are offscreen, and Enkidu's death is gentle. If you want the fights played
  straight, rate the page `teen`.
- **Line 3's on-screen wording** is your call: "O Enkidu, he was my comrade," as written, or "O Enkidu, my comrade,".
