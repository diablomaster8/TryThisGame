# Log: S23 Three Visitors

File: `REPO/src/content/side-stories-s23.ts`. Exports: `SIDE_STORY_S23`, `SIDE_STORY_S23_VARIANTS`,
`SIDE_STORY_S23_FLAGS`, `SIDE_STORY_S23_CHECKS`. tsc (strict) and eslint are both clean. Self-check: ids are
unique (and don't clash with anything in `src/`), every `who` is declared or is a campaign speaker, no line is over 160
characters, no narrator line runs past two sentences, and every scene is within 2–16 lines.

## Counts

- Quests: 1 (`s23`, code `S23`). Audience `main`.
- Steps: 14.
- Scenes: 50. The quest has 22 (14 step scenes, 7 done scenes and the complete scene). `_VARIANTS` has 28: 21 story
  variants and add-ons, 3 chapter 10 hooks and 3 epilogues.
- Lines: 437, counting choice `then` lines.
- Choices: 2 decisions (Q4 and Q15), each with 3 options. They appear in 4 scenes, because both decisions have a
  variant scene, so that's 12 options in all.
- Checks: 14 (talk, visit, sit, wait, walk, watch).

## Lifted text (*A Christmas Carol*, 1843 text, Project Gutenberg #46)

These are quoted verbatim; all were verified in the outline.

1. "I wear the chain I forged in life. I made it link by link, and yard by yard." Aldous says it in
   `s23-caller-aldous`. The end punctuation is made into full stops.
2. "No. Your past." Briar says it in `s23-briar`, and Scrooge's "Long Past?" becomes "Long ago?".
3. "Look upon me!" Hush says it, very quietly, in `s23-hush`.
4. "Your lip is trembling. And what is that upon your cheek?" Briar says it in `s23-cold-one`.
5. "The happiness she gives, is quite as great as if it cost a fortune." Corvin says it in `s23-lantern-night`. The
   comma is Dickens's.
6. "Another idol has displaced me." Young Hazel says it in `s23-cold-one`. The adapted "What idol?" / "A cold one."
   follows it.

**Paraphrased.** The outline marks lines 6–8 [unverified], so these are in our own words:

- "Men's courses…" becomes Corvin's plea in `s23-pass`.
- "I will live in the Past, the Present, and the Future" becomes the vow in `s23-complete*`.
- "keep Christmas well" becomes `end-epi-visitors*`.

Cinder's rhyme is the bible's own, with Corvin's name put in. Audience is `main`, so no `childLines`.

## Flags

- **Read:**
  - `corvin`
  - `soldNubbin` and `boughtBack` (Collector route = `soldNubbin && !boughtBack`)
  - `s13Done`
  - `millLetter`
  - `s6Done`
  - `s8Reunited`
  - `keptStone`
  - `cinder` (epilogue only)
  - The hooks also read `visitors`.
- **Written:**
  - `visitors` and `s23Done`, both on completion;
  - local flags: `s23-stay` (step | home | insist) and `s23-answer` (maybe | keep-on | sat).
- **Signature choice:** Q4 (step, home or insist) pays off in Q16, twelve quests later, in `s23-drip*`. Q15 shapes
  Corvin's closing reply in `s23-complete*`.

## Variants (all in `SIDE_STORY_S23_VARIANTS`; the exact rules are in the quest notes)

**Replacements:**

- `s23-note-bargained`, `-forced` and `-collector`;
- `s23-dusk-bargained` and `-forced`;
- `s23-caller-aldous`;
- `s23-briar-collector`;
- `s23-cold-one-aldous`;
- `s23-stove-collector`;
- `s23-ash-named`;
- `s23-root-ear`;
- `s23-cloak-collector`;
- `s23-pass-collector`;
- `s23-drip-home` and `-insist`;
- `s23-complete-keep-on` and `-sat`.

**Add-ons:**

- `s23-coat-letter` and `s23-letter-back` (when `millLetter` = kept);
- `s23-window` (Q6, when `s13Done`);
- `s23-partner` (the Collector's warning);
- `s23-ember-soup` (Ember's talk pool from chapter 11).

**Campaign hooks:**

- `c10-vigil-corvin`: after `c10-vigil`, or after `c10-vigil-wisp` when that plays, and before the timed vigil step.
- `c10-dawn-lane`: after `c10-dawn` and before the Moss scene, when the stone was unmade.
- `c10-kept-lane`: after `c10-kept` and before `c10-close`, when the stone was kept.

**Epilogues:** `end-epi-visitors`, `-cinder` and `-kept`. Exactly one plays, after `end-epi-gate-*` and before
`end-epi-mill-*`.

## SIM needs

1. Add the flags `visitors` and `s23Done` (already approved), plus the local flags `s23-stay` and `s23-answer`.
2. The nights are story nights, so they advance on checks and never on a timer.
   - If `c10-open` comes before step 13's check, S23 closes unfinished: no rewards, and `visitors` stays unset.
   - Once step 13 is done, `c10-open` waits for `s23-drip*` and `s23-complete*`.
3. Variant and add-on selection works as listed in the notes.
4. Corvin's railings change art state after `s23Done`: they drip, then they're plain iron. This happens even before the
   stone is unmade.
5. `s23-ember-soup` goes into Ember's chapter 11 talk pool.
6. S9's sixth family condition already counts `visitors` (S9's notes), so nothing new is needed there.

## Changes from the outline, and why

- **Merged or split quests:**
  - The 16 outline quests became 14 steps.
  - Q1 and Q2 are step 1 (the note, then the dusk garden) and step 2 (the chairs).
  - Q3 and Q4 are step 3.
  - Q6 is an add-on, because it only plays with `s13Done`.
  - Q11 is the shed scene plus the pond-chair done scene.
  - Q12 is the root scene plus the cloak done scene.
- **The Collector route's Q10.** The outline kept Ash in Corvin's garden, with an empty basket. The new chapter 9 has Ash
  leave in every branch and arrive with Ember at the vigil on every route. So Ash is by the stove here, and the visitor
  turns to you through Ember's line instead: "I hope he's cold. Him, and his partner."
- **The Collector route's Q12.** The outline put your sold Nubbin "in a grey row in his garden". On the new Collector
  route, chapter 9 is either reconciled (`c9-shard-reconciled`: "The garden is empty") or forced (the pens scattered).
  - So Hush shows it in the Hollow instead: numbered, as in `c9-open-sold`'s second row, and standing "in a row of one",
    waiting to be told it may move.
  - The thin grey under the root stays Hazel's dawn Nubbin, as the care notes require.
  - This fits `end-collector-sold` ("You never went looking for the first one when the pens opened").
  - Corvin's line there is the outline's: "Ask me after. I can't do it cold."
- **Gardens by route.** Reconciled is empty, bargained still has its grey rows, and forced is wrecked. This follows the
  chapter 9 scenes.
- **Q1's "Something came."** This now means a knock at Corvin's nailed back door on the night of `c9-close`. The first
  real caller comes the next midnight.
- **Q4 logistics.** All three answers still witness night one: Briar's light fetches you from the lane, the step or the
  chair.
  - Night one's vision ends at 2.15, so the step payoff works: he found you asleep on his step at three in the morning.
  - On the home route he leaves the door unlatched for nights two and three.
- **The mill letter.** S13 stores the kept letter in the tin box under your bed, and S9's `s13-letter-given` fetches it
  from there. So S23 takes it out into your coat for the three nights (`s23-coat-letter`) and puts it back
  (`s23-letter-back`).
- **`end-epi-visitors-cinder`** is a full replacement (the base lines plus the red-flower line), not an extra scene, so
  exactly one visitors epilogue plays.
- **Hazel's pond chair.** S23 uses only Hazel's own chair, with her cushion. It adds no second chair, so S9's "a chair
  appears" stays true.

## For Maor

- **Stave Four and Five lines.** If the three Stave Four and Five lines are checked against #46, they could go back in
  verbatim:
  - in `s23-pass`'s `PASS_PLEA`;
  - in the `VOW` const;
  - and in the second epilogue line.

  The paraphrases are written to take them.
- **S6's trigger is out of date.** It still says "Never offered on the collector route", but chapter 9 now frees Ash on
  every branch, the Collector route included.
  - S23 handles both cases: `s23-ash-named` only plays with `s6Done`.
  - But S6's trigger may want updating.
- **S1's count.** `s1-cinder` calls `c9-close`'s evening "Three nights before the longest night", while S23 runs its
  three nights after it. This is a small count mismatch in S1, not a conflict in play.
- **The sold Nubbin.** S23 shows your sold Nubbin in the Hollow, but doesn't make it recruitable, following the
  outline's "S23 never buys anyone back". If you'd rather the player could go and fetch it after S23, that would be a
  new SIM hook, and it would change the meaning of `end-collector-sold`.
- **Corvin can't feel.** He never feels anything in S23. Cinder's paw is "warm: the only warm thing in three nights",
  and the narration never says he feels it, so the Long Night keeps the landing.
