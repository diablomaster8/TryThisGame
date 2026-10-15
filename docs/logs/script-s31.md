# Log: S31 The Great Gourd

File: `REPO/src/content/side-stories-s31.ts`. Exports: `SIDE_STORY_S31`, `SIDE_STORY_S31_VARIANTS`,
`SIDE_STORY_S31_FLAGS`, `SIDE_STORY_S31_CHECKS`. tsc (strict) and eslint both pass with no errors.

## Counts

- Quests: 1 (`s31`, code `S31`), audience `all`, Tier 2.
- Steps: 14, one for each outline quest.
- Scenes: 45 in total. The quest has 28 (14 step scenes, 13 done scenes and the complete scene), and
  there are 17 variants: 12 branch scenes and 5 ambient scenes.
- Lines: 334, counting choice `then` lines.
- Choices: 13, across 5 choice points: the letter (3), the ball (3), the long grass (3), "If" (2)
  and next year (2).
- Checks: 14, all built from existing verbs: puzzle, visit, craft, watch, talk, build, place,
  choose, minigame and wait.
- Self-check: ids are unique, every `who` is declared, every line is 160 characters or fewer, and
  no narrator line runs past two sentences. Sable never speaks. The third rule is named only once.

## Lifted text

This source is copyrighted, so the line uses three one-sentence quotes, each once, exactly as the
outline lists them. Each has a `childLines` entry.

1. `s31-creed#8`, Tam: "There are three things that I've learned never to discuss with people:
   religion, politics, and the Great Gourd."
2. `s31-rock#1`, Ned: "I got a rock." It is said once, in the done scene every branch shares. The
   gag at each door is carried by the narration.
3. `s31-next-year#8`, Tam: "Well, that's nothing compared to the fury of a woman who's been
   cheated out of guising!"

The edition is the 1966 CBS special as broadcast, as checked in the outline. The outline also asks
for a check against the licensed soundtrack before ship; that is still open. There are no lyrics,
and nobody sings.

## Flags

- **Written:**
  - `s31-letter` (toys | strays | busy);
  - `s31-night` (guise | party | sat);
  - `s31-sable30` (a sim snapshot);
  - `s31Done`.
- **Read:**
  - Sable's trust at the start of Gourd Night, through `s31-sable30`;
  - `wisp` (spared | sable), at midnight;
  - `keptStone` = false after the chapter 10 dawn, as a stand-in for "the Long-Grass lantern lit
    itself".
- No campaign flag is written, and Sable's trust is never changed.

## Variants

Default scenes are in the quest. These replace them:

- **Step 9 scene:** `s31-guising-sat` and `s31-guising-party`. The default is the live round, if you
  went guising.
- **Step 11:**
  - scene: `s31-if-away`, if you went guising or to the party;
  - done: `s31-midnight-wisp`, if `wisp` is spared or sable.
- **Step 12 done:**
  - `s31-shape-sable`, if you sat and `s31-sable30` is true;
  - `s31-shape-away`, if you went guising or to the party.
- **Step 13:**
  - scene: `s31-four-sable` or `s31-four-away`;
  - done: `s31-light-sable`.
- **Step 14 done:** `s31-promise-went`, which has the SEAT FOR A KEEPER (IF) sign.
- **Complete:** `s31-complete-strays` and `s31-complete-busy`. The default is toys: the acorn.
- **Ambient (Tier 2):**
  - `s31-ambient-tam`, `-ivy`, `-ned` and `-nettie`;
  - `s31-ambient-lantern`, which plays after the chapter 10 dawn if `keptStone` is false and
    replaces Tam's usual line.

## SIM needs

These are also in the quest's notes, under "SIM:".

1. When `s31-dusk` begins, snapshot Sable's trust and set `s31-sable30` = (trust >= 30).
2. While Gourd Night is running (from `s31-dusk` until step 13 is done), don't queue `c7-close` or
   open chapter 8.
3. During steps 8 to 13, keep every Nubbin out of the frost decal, except Sable in
   `s31-shape-sable`.
4. Gourd Night staging:
   - lit gourds on the lane steps;
   - Clover's lamp lit;
   - three lanterns lit and the fourth dark.
5. Add the new reward ids:
   - `s31-gourd-lantern` (decor);
   - `s31-ace-goggles` (cosmetic);
   - `s31-rock` (item);
   - `s31-sign` (decor, after spring).
6. Gourd Night is the first dusk after step 6.

## Changes from the outline, and why

- **Merges:** none. The 14 outline quests are the 14 steps. Fern's apology from quest 3 sits in
  step 2's done scene, so that step 3 can be the carving.
- **Who it is at dawn:** in the branches where you went off, the outline has you come back "at
  first light". I made it "before it's light", so that Ivy's four o'clock (quest 13) still follows.
- **Sable stays until it's light:** Ivy comes at four while Sable is beside you, so Sable stays
  through Ivy's visit and leaves at sunrise (`s31-four-sable` and `s31-light-sable`).
- **The toffee apple:** Tam's toffee apple is an offering he sets on top of his sign "in case he's
  hungry from flying". This sets up Wisp's theft and makes "Is that him?" land.
- **The blankets:** Clover's three blankets are one each and a spare. Tam saves the spare for the
  Great Gourd, which is why Ivy's blanket for you matters in the branch where you sat.
- **Ned's rock** is given to you "for being the witness", a callback to quest 4. This is the
  keepsake reward.
- **Who's watching:** in the branches where you went off, Luna's lantern and Clover's lamp keep
  watch, to meet the care note.

## For Maor

- **Wisp will often be missing.** S2 decides `wisp` at the end of chapter 7, and Gourd Night
  usually falls before that. When it does, the Wisp beat (`s31-midnight-wisp`) doesn't play. It's
  written to play whenever the flag is already set. If you want it seen more often, S2's decision
  would have to come earlier, or S31 would have to open later.
- **The third rule** is named once: in the sit choice, by the player ("My gran had a rule for this.
  Her third one."). It doesn't appear anywhere else.
- **The Learning Grove version** from the outline (gourds, frost, turnip lanterns and waiting) is
  not in this file. Side stories don't carry edu blocks, so it needs a separate edu pass.
- **Quote 3** is assigned to Tam, as the outline says. If the soundtrack check shows the special
  gives that line to a different character, the line still works for Tam here.
