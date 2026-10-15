# Log: S26 The Walled Garden

File: `REPO/src/content/side-stories-s26.ts`
Exports: `SIDE_STORY_S26`, `SIDE_STORY_S26_VARIANTS`, `SIDE_STORY_S26_FLAGS`, `SIDE_STORY_S26_CHECKS`.
Validation: tsc (strict) clean, eslint clean, prettier applied. A self-check script
(`SCRATCH/chk-s26/chk.mts`) confirmed that ids are unique, every `who` is declared, every check is
listed, every flag set is listed, the childLines keys resolve, every line is 160 characters or
fewer, and no narrator line runs past two sentences.

## Counts

- Quests: 1 (`s26`, code S26, audience `all`).
- Steps: 13.
- Scenes: 40. That is 25 in the quest (13 step scenes, 11 done scenes and 1 complete scene) plus
  15 variants.
- Lines: 355, counting choice `then` lines.
- Choices: 6 choice points with 16 options (steps 2, 5, 7, 9, 10 and 13).
- Checks: 13, all built on existing verbs (feed, talk, find, escort, choose, wait, explore, sit,
  place, walk).
- childLines: 8.

## Lifted text

None is quoted. The outline marks all eight Burnett passages (Gutenberg #113) as [unverified], so
each one is paraphrased in our own words:

- "a bit of earth" and Moss's reply: Linnet and Moss in `s26-earth-ask`.
- "How still it is" and the first voice in years: Linnet in `s26-inside`.
- "wick": Dusty in `s26-wick`. Only the valley word "wick" survives.
- The rose and thistle couplet: replaced by an original saying from Tobin's old gaffer ("put a rose
  where your worry sits…").

As a precaution, the closest echoes still carry childLines that move further from the source:
`s26-inside` lines 3 and 4, `s26-wick` line 4, and `s26-earth-ask` lines 4, 6, 8, 9 and 10. There
are no lyrics.

## Flags

- **Read:**
  - `s12Done`: plays `s26-door-thrums`.
  - `s13Done`: plays `s26-tobin-bench-cellar`.
  - The ending id: The Collector gets `end-epi-garden-cold`.
  - Its own local flags `s26-steps` and `s26-key`.
- **Written:**
  - `hushGarden` and `s26Done`, through quest `sets` on completion in chapter 11.
  - Local flags: `s26-hello`, `s26-steps` (ramp or lift), `s26-plot`, `s26-bulbs`, `s26-tobin`,
    `s26-key` (linnet, post or door).

## Variants (15)

- **`s26-door-thrums`:** replaces `s26-door` if `s12Done`.
- **`s26-ramp-1`/`-2`/`-3` or `s26-lift-1`/`-2`/`-3`:** preludes that play immediately before
  `s26-pruned`, `s26-earth-ask` and `s26-bench`, chosen by `s26-steps`.
- **`s26-tobin-bench-cellar`:** replaces `s26-tobin-bench` if `s13Done`.
- **`s26-snowdrops-lifted`:** replaces `s26-snowdrops` if `s26-steps` = lift. This is the payoff of
  the step 5 signature choice.
- **`s26-complete-post` and `s26-complete-door`:** replace `s26-complete`, chosen by `s26-key`.
- **`c12-wall-garden`** (campaign, `hushGarden`): plays inside `c12-open`, after line 8 ("Hazel
  walks the Grove… touches each lantern post…") and before line 9 ("At the fourth post…").
  - It is narration only. Hazel never speaks in it.
  - She goes in, stands among the roses, and leaves with a rosehip in her buttonhole.
  - Back outside, she touches the post a little longer than the others.
- **`end-moss-sleeps-garden`:** plays straight after `end-moss-sleeps`.
- **`end-epi-garden`:** plays in every ending except The Collector, after the other epilogue
  variants and before `end-<id>-last`. `end-epi-garden-cold` takes its place in The Collector.

## SIM

- New flags: `hushGarden` (bool) and `s26Done`.
- New pattern: a "prelude" variant that plays immediately before a step's own scene.
- Art states that persist:
  - the steps, then the ramp;
  - the snow in chapter 11;
  - the snowdrops scattered where the Nubbin hid bulbs.
- **The walled garden section:** plants grow with the seasons, with no watering and no timers.
- **The robin petpet.**
- **Linnet as a summer visitor:** after the campaign, talk only.
- **Tobin's garden tales:** added to his S13 tale pool, or told at his cottage gate if S13 is
  not done.
- **The three campaign insertions** listed under Variants.
- **Closing rules:**
  - If chapter 9 opens before step 10 is done, the story closes unfinished.
  - If chapter 12 opens before step 13, it closes unfinished.
  - In both cases `hushGarden` stays unset.

## Changes from the outline, and why

- **15 quests became 13 steps.**
  - Q3 (Key) and Q4 (Door) are merged into step 3.
  - Q5 (How Still) and Q6 (Wick) are merged into step 4.
  - Each pair is one walk, and one scene sets up the next.
- **Q7's three ramp evenings became preludes to steps 6–8.** The lift route gets three matching
  preludes, which show what lifting costs (Sparks is late, then has to leave). This is why the
  payoff in Q13 lands.
- **Q13's "build the ramp now" is played out in the done scene.** It is not a separate build check,
  because step checks cannot depend on a flag.
- **Positioning.** Linnet stays at the top of the steps through steps 6–7 on the ramp route, so
  those scenes are written to work from either position.
- **Sparks's reason to be there.** She arrives in Q7 with wire for the old wall lantern, so her
  offer to lift has a reason.
- **Fern** gets two lines in step 1, so the robin scene has a voice.
- **Rewards follow the outline's list.** The bible's "Linnet's bench" is now Hush's bench decor,
  which Dusty makes from the dug-out steps.
- **Linnet's mum has no name.** She isn't on canon 28's list of new characters.
- **The epilogue drafts gained a line each.** The Collector version adds Linnet leaving a week
  early after she is told the Nubbins are "safe".

## For Maor

1. **Tobin is met twice.** S26 always meets Tobin first (chapter 6), but S13's opener (`s13-tobin`,
   chapter 7) introduces him again ("Tobin. I lit the lamps…"). It reads as Tobin forgetting,
   which suits him. A one-line S13 variant would make it clean.
2. **Moss's seed over the wall plays only in Moss Sleeps**, as the outline says. Canon 15 is wider:
   Moss can also have faded in Empty Lantern or Long Road. Do you want `end-moss-sleeps-garden` to
   play whenever Moss has faded?
3. **Hard close.** Is it right that the story closes unfinished if chapter 9 opens before step 10?
   The alternative is resuming steps 9–10 in chapter 11, which would need winter rewrites.
4. **Disabled advisers.** Linnet's movement, the ramp gradient and the snow beat need review by
   disabled advisers and wheelchair users, as the care notes ask.
