# Log: S30 What Sad Is For

File: `REPO/src/content/side-stories-s30.ts`. Exports: `SIDE_STORY_S30`, `SIDE_STORY_S30_VARIANTS`,
`SIDE_STORY_S30_FLAGS`, `SIDE_STORY_S30_CHECKS`. `tsc` (the brief's flags) and `eslint` are clean.

## Counts

- Quests: 1 (`s30`, code `S30`, audience `all`).
- Steps: 14.
- Scenes: 41 in all: 14 step scenes, 14 done scenes, 1 complete scene and 12 variants.
- Lines: 315, counting choice `then` lines.
- Choices: 2 choice points with 5 options. The signature choice is `s30-ring` (3 options). There is
  also a flavour choice at the sill (2 options, no flag).
- Checks: 14, all using existing verbs: visit, watch, minigame, wait, walk, inspect, puzzle, find,
  sit and carry.
- Self-check results:
  - All ids are unique.
  - Every `who` is declared. The new speakers are `s30-dimple`, `s30-drizzle` and `s30-fidget`,
    all `kind: 'nubbin'`, and they only ever say "…".
  - No line is over 160 characters, and no narrator line has more than two sentences.
  - Both childLines keys point at the quoted lines.
  - The CHECKS and FLAGS arrays match what the quest uses.

## Lifted text

*Inside Out* (Pixar Animation Studios / Walt Disney Pictures, 2015, theatrical release). There are
two quotes, both taken exactly as the outline lists them:

1. `s30-drizzle#8`, spoken by Dusty: "I'm okay now." (Bing Bong's line.)
   - childLine: "There. That's a bit better. Not mended. Better."
2. `s30-rim#4`, spoken by Clover: "Crying helps me slow down and obsess over the weight of life's
   problems." (Sadness's line.)
   - childLine: "Crying slows me right down, so I can feel it properly. I think that's what it's for."

Nothing is quoted from *Inside Out 2*. The apostrophes are typographic (’), to match the house style.

## Flags

- **Written:**
  - `s30Done`, on completion.
  - `s30-ring` = broke | sat | helped. This is local; it picks the -helped variants.
- **Read** (through variants only):
  - `s5Done`:
    - `s30-hole-youngest`: your youngest sits too, and Dusty says "She trained you both."
    - `s30-trail-s5`: Dimple walks Fossil's walk in reverse (water, tree, cliff).
    - `s30-hollow-youngest`: your youngest climbs down too.
  - `s1Done`: `s30-wall-s1`, Moss's opening at the wall.

## Variants

| Variant | Effect |
| --- | --- |
| `s30-wall-s1` | Replaces `s30-wall` |
| `s30-hole-youngest` | Plays after `s30-drizzle` when `s5Done` |
| `s30-gone-helped` | Replaces `s30-gone` |
| `s30-trail-s5` | Replaces `s30-trail` |
| `s30-hollow-helped` | Replaces `s30-hollow` |
| `s30-hollow-youngest` | Plays after `s30-stopped` when `s5Done` |
| `s30-hill-helped` | Replaces `s30-hill` |
| `s30-complete-helped` | Replaces `s30-complete` |
| `s30-after-clover`, `s30-after-dusty`, `s30-after-byte`, `s30-after-sparks` | Tier 2 talk lines once `s30Done` is set |

The `-helped` variants play when `s30-ring` = helped. The quest's notes give the exact placement of
each one.

## SIM needs

1. Once step 10 has begun, hold chapter 9's opening until S30 completes. This is the same backlog
   rule as S5 and S27. If step 10 hasn't begun when chapter 9 opens, S30 closes unfinished.
2. **The `s1Done` read can never be true here.** S1's last step checks `chapter:9:end`, so `s1Done`
   is only set after S30's window closes.
   - Read "S1's `s1-step2` complete" instead, which means `s1-hush` (Hush's memory) has played.
   - Until the engine can do that, `s30-wall` plays for everyone, and nothing breaks.
3. "Your youngest" in the `s5Done` variants means the Nubbin that received S5's gift. It is not
   whoever is youngest now.
4. **Hush's memory page:**
   - One page per Nubbin, drawn from save events as rings, lines or both.
   - It is read-only, with no task and no timer.
5. **New art and audio:**
   - A two-colour (blue and gold) swirl for a mood ball.
   - Nubbin crying: a thin whistle and a shake.
   - Fidget's whirling ball.
   - A close-up of Hush's stone.
   - Clover's yard: a shed with an outward-opening door, a rain butt, a bucket and a washing line.

## Changes from the outline

- **Merged and split quests:** 15 outline quests became 14 steps plus the complete scene.
  - Quests 1 and 2 are step 1 (the gate, then the sill).
  - Quests 9 and 10 run across steps 8 and 9 (the hatch and the shed, then the blanket).
  - The end of quest 11 (finding her in the hollow) is step 10's done scene.
  - Quest 15 is split: the hill is step 14, and the rubbing is the complete scene.
- **Sparks's plan is seeded early.** Clover mentions the party plan in step 2, so the "help with
  Sparks's plan" option makes sense before quest 4.
- **Quest 10's "gap underneath"** is staged as a blanket hung across the open doorway. The bucket
  stands on its hem, so the door looks shut to Fidget and the Nubbins can slip out under the hem.
- **Who gives what:**
  - The rain hat is "Drizzle's spare". Clover sends it, with the cushion.
  - Sparks gives the ribbon.
- **Added:** a small flavour choice at the sill (point out the ball, or keep watching). It sets no
  flag.
- **Not in this file:** the Learning Grove edu version the outline mentions. The brief's file shape
  doesn't include one for side stories; the lesson points are listed in the quest notes.

## For Maor

- **Please check the two quotes against the licensed film.** The outline says they were only
  checked against Shmoop.
- **The `s1Done` read can't fire in chapters 6–8** (SIM note 2). Do you want the variant keyed to
  S1's wall memory instead? Otherwise it never plays.
- **The broke and sat routes play the same scenes from step 3 on**, apart from the step 2 choice
  itself. If you want them to feel different later, the cheapest place is one line in `s30-hollow`.
