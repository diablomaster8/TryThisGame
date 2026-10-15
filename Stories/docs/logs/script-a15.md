# Log: A15 The Humbug

File: `REPO/src/content/atlas-a15.ts`. Exports `ATLAS_A15`, `ATLAS_A15_VARIANTS`, `ATLAS_A15_FLAGS` and `ATLAS_A15_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. The self-check (`script/chk-a15.mts`,
adapted from A11's) finds 0 problems:
- ids are unique, and every `requires` resolves;
- every `who` is declared;
- lines are ≤ 160 characters (the longest is 153), and narrator lines are ≤ 2 sentences;
- step scenes have 6–16 lines;
- every lifted line has a `childLines` entry;
- the flags and checks lists are exact.

## Counts

- Quests: 20 (A15-1 to A15-20), audience `all`, chained by `requires`.
- Steps: 56, with 2–3 per quest.
- Scenes: 138 (130 in the quests and 8 variants).
- Lines: 936, counting choice `then` lines.
- Choices: 57 choice points and 135 options. Every quest has at least one.
- Checks: 56, all with existing verbs.

## Lifted text

These are verbatim. Each is used once and has a `childLines` entry. They come from the 1900 George M. Hill text, as
Part M checked it against PG #55. Baum's spelling "gray" is kept inside the quotations.

1. "Once the house had been painted, … as dull and gray as everything else." (ch. I) It's narration, printed across
   the atlas page, at `a15-01-page#2`.
2. "No matter how dreary and gray our homes are, … be it ever so beautiful. There is no place like home." (ch. IV)
   Dorothy says it to the Scarecrow, split at the sentence break: `a15-03-kansas#5` and `#6`.

**Not quoted:** Part M marks passages 3–7 [unverified], so they are in our own words:
- the poor Wizard: `A14_POOR_WIZARD#0`;
- the spectacles: `a15-14-screen#11–12`;
- courage: `a15-15-courage#5`;
- the china joints: `a15-17-lamb#5`;
- Glinda and the Scarecrow: `a15-20-glinda#6`, `#8`.

I also reworded every other Baum line I had echoed too closely. A second pass caught about 60, such as "I am Oz, the
Great and Terrible. Who are you…", "Is your name Dorothy, my dear?", the Lion's "I know it", "Take me home to Aunt Em!",
"I can't come back, my dear", the slate's message and the charm words. "Humbug", "bran-new" and "Oz, the Great and
Terrible" appear only as names or single words.

From the film there is nothing at all. I also cut one near miss: "Follow the yellow brick road" became "Keep to the road
of yellow brick".

## Flags

- **Read:** the Grove flag `corvin`, read-only, at the moment the scene plays.
  - **A15-14:** the step 2 done scene. The scene in the quest is the default, for unset or any other value (the Collector
    route). Reconciled, bargained and forced each get a variant, using the outline's words split into two narrator lines.
  - **A15-16:** the balloon's done scene. Only `reconciled` gets a variant.
- **Written (Atlas save only):**
  - `a15-01`…`a15-20`;
  - `a15-done`;
  - `a15-cap` = asked | silent (A15-13, the signature choice);
  - `a15-lamb` = pocketed | returned (A15-17).
  - No Grove flag is written.

## Variants (`ATLAS_A15_VARIANTS`)

- `a15-14-screen-done-reconciled`, `-bargained` and `-forced` replace `a15-14-screen-done`.
- `a15-16-launch-done-reconciled` replaces `a15-16-launch-done`.
- `a15-20-farewell-pocketed` replaces the step 3 scene `a15-20-farewell`. This is the lamb coda before Dorothy's heels
  click: the lamb is stiff, and Glinda says to carry it home.
- The `a15-20-complete` variants are four endings in all:
  - silent and returned: the base scene;
  - asked and returned: `-asked`;
  - asked and pocketed: `-asked-pocketed`;
  - silent and pocketed: `-pocketed`.

**Payoffs:** the signature choice (Q13) pays off in Q20, seven quests later. The lamb (Q17) pays off in Q20, three
quests later.

## SIM needs

- **Green screen tint** on this page, while the spectacles are locked on: from `a15-09-spectacles#8` to A15-10's
  complete, and from A15-13's complete to A15-16's complete. The Green Spectacles cosmetic gives the same tint, and the
  player can switch it off.
- **Reading `corvin`:** the Atlas needs read-only access to the Grove flag `corvin` to pick the A15-14 and A15-16
  variants.
- **Price of Power festival:** it reads `atlasDone('A15')`.
- **Page-only props** (Atlas save, never in the Grove):
  - the oil-can at your hip, from A15-4 to A15-20;
  - a lump in your pocket while `a15-lamb` = pocketed, from A15-17 to A15-20, with your Nubbin checking the pocket in
    its idle animations;
  - your Nubbin's green lenses, which it keeps on.
- **Rewards (all one-time):**
  - Golden Cap hat for your Nubbin (A15-12);
  - Green Spectacles (A15-16);
  - Silver Shoes for the Keeper (A15-20 step 2). They do nothing.
  - Monkey Feather (A15-20, only if `a15-cap` = asked);
  - the Price of Power Bookmark (A15-20).
- **`puzzle:a15-joints:woodman`:** the order is neck, then arms, then legs. A wrong order gets one polite line, and
  the step can't be failed.

## Changes from the outline, and why

- **Golden Cap hat (Q12).** The Winkie tinsmiths make it. The real Cap has to go to Glinda and then to the Monkey King,
  so the hat needed its own maker.
- **Green spectacles (Q16).** The Guardian lets you and your Nubbin keep a pair when you leave the City.
- **Q13 adds the Queen of the Field Mice** before the Cap, as in Baum's ch. XIV. Dorothy calls her (Baum gives her a
  whistle). You read the Cap's lining, since your job is reading signs.
- **Q11 merges** the wolves, crows, bees and Winkies into one step, one line each. The "forty" is dropped for the crows
  and wolves, to keep it gentle.
- **Q20's order.** Glinda says where each friend will go, then the goodbyes, then Dorothy's farewell (with the lamb coda
  if pocketed). Dorothy leaves first, as in Baum, and the Monkeys carry the friends afterwards, in the complete. The lamb
  wakes over the wall after Dorothy has gone, because that is the trip home.
- **Q20, the Lion's walk** (silent and pocketed). The Lion lets the Monkeys go without him and walks you to the wall.
  His call goes unspent, and the King gets the Cap all the same.
- **Q20, the lamb you left behind.** In both returned endings, the page carries you home past the china wall, where the
  lamb waits.
- **Softening.**
  - Oz says "put an end to her", never "kill".
  - The Kalidahs, the wildcat, the wolves, the crows, the bees and the spider all happen just off the page.
  - The Witch melts "like sugar in hot tea", with one line and no screaming.
  - The Witch of the East dries up like a dewdrop between two looks.
  - The mice wear their strings round their middles.
- **Glinda's throne is "red"**, not rubies, to stay well clear of the film.
- **Every quest has a choice**, beyond the outline's two. Only Q13 and Q17 set flags. The keep-his-secret choice (Q14)
  sets nothing.
- **No Learning Grove (edu) version** is in this file. The outline wants one, but the script brief asks Atlas lines only
  for `childLines` (as with A11).

## For Maor

- **Unverified passages.** Baum's passages 3–7 are paraphrased. If you can check them against PG #55, they can be
  swapped in verbatim, with `childLines` added.
- **Your call on "There is no place like home."** It's Baum's verified chapter IV sentence, used once mid-journey and
  never at the end, but players will hear the film in it. Say if you'd rather it went to `childLines`-style wording in
  the main game too.
- **Please check the Lion's walk.** He skips his Monkey call so that he can walk you to the wall. That's a small
  deviation from Glinda spending all three calls.
