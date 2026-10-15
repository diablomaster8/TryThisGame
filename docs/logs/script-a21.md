# Log: A21 The Flower Field

File: `REPO/src/content/atlas-a21.ts`. Exports `ATLAS_A21`, `A21_VARIANTS`, `ATLAS_A21_FLAGS`, `ATLAS_A21_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. The self-check (`script/chk-a21.mts`,
adapted from A11's) finds 0 problems:

- ids are unique, and every `requires` resolves;
- every `who` is declared;
- every line is ≤ 160 characters, and every narrator line is ≤ 2 sentences;
- every step scene has 6–16 lines;
- every choice point has at least one option, and every quest has a choice;
- the flag and check lists match what the file uses exactly.

## Counts

- **Quests:** 20 (A21-1 to A21-20), audience `main`, chained by `requires`.
- **Steps:** 49 (2–3 per quest).
- **Scenes:** 128 (115 in the quests, 13 variants).
- **Lines:** 868, counting choice `then` lines.
- **Choices:** 52 choice points with 124 options. Every quest has at least one.
- **Checks:** 49 distinct ones, all using existing verbs.

## Lifted text

All three outline lines are used, each once and verbatim. They're set with curly apostrophes. Audience `main` needs no
`childLines`.

1. "Why didn't I try to get to know him better?" Frieren, `a21-02-burial#6`.
2. "I pose for these statues so you won't feel alone in the future." Himmel in flashback, `a21-13-statues#9`.
3. "I wouldn't have been able to see this sunrise if I'd been on my own." Frieren, `a21-09-sunrise#12`.

The edition is the English subtitles of the first anime season, as quoted by Reactor. They have **not** been checked
against the licensed Crunchyroll track, which the outline asks for. Every other line is original. Source spell names
aren't used, and the odd spells in A21-6 are our own.

## Flags

**Read (read-only):**
- `s8Reunited` picks Bramble's presence (Q1), the ghost (Q11) and Keeper Fern's line to Kraft (Q15).
- The campaign state picks Keeper Fern's funeral line (Q2): before chapter 10's dawn, Hazel home, or the campaign
  finished (`CampaignState.ending`).
- From the Grove: `atlasDone('A21')`, `mossFaded` and the Atlas flag `a21-search`, for the keepsake scenes.

**Written (Atlas save only):**
- `a21-01`…`a21-20`;
- `a21-done`;
- `a21-search` = with | ahead (Q7).

No Grove flag is written.

## Variants (`A21_VARIANTS`)

| Scene | Plays when | Replaces |
| --- | --- | --- |
| `a21-01-page-done-bramble` | `s8Reunited` | `a21-01-page-done` |
| `a21-02-burial-done-home` | Hazel is home (chapter 10's dawn to the ending) | `a21-02-burial-done` |
| `a21-02-burial-done-after` | the campaign is finished | `a21-02-burial-done` |
| `a21-07-wait`, `a21-07-wait-done` | `a21-search` = ahead | `a21-07-search`, `a21-07-search-done` |
| `a21-11-ghost-hazel`, `a21-11-sit-hazel` | `s8Reunited` | `a21-11-ghost`, `a21-11-sit` |
| `a21-15-hut-done-hazel` | `s8Reunited` | `a21-15-hut-done` |
| `a21-16-complete-ahead` | ahead | `a21-16-complete` |
| `a21-20-complete-ahead` | ahead | `a21-20-complete` |

**Grove keepsakes.** These play in the Grove and write nothing:
- `a21-grove-moss`: Keeper Fern sits with Moss. It carries the outline's Moss line about elves and birthdays.
- `a21-grove-moss-faded`: if Moss has faded, she sits by his flower instead.
- `a21-grove-moonweed`: the first spring flowering in the search branch.

**The signature choice.** It is made in Q7 and pays off in Q16 (9 quests later) and Q20 (13 later), and in the Grove.

## SIM needs

- **Moon-weed.** A decor plant fixed by the cottage gate that flowers each spring (search branch). The pressed flower
  is a journal item (ahead branch). Grant one or the other, by `a21-search`.
- **Mimic chest.** A one-time decor. The first time it's opened it plays a nip animation on the nearest Nubbin (no
  harm, no stat change). After that it's an ordinary chest.
- **Fern's purple coat.** A cosmetic for Keeper Fern only. She's drawn in it on some days (seeded), and the player
  can't put it on her. It is never a daily reward.
- **Keepsake scenes.** The Grove reads `atlasDone('A21')`, `mossFaded` and `atlasFlag('a21-search')` (the same
  lookup as A11's bridge). Keeper Fern is sometimes drawn beside Moss on the hill after `a21-grove-moss`.
- **The Night of Remembering** reads `atlasDone('A21')`.
- **Page props.** Your Nubbin rides in Stark's cloak from Q12 to Q20. If `s8Reunited`, Bramble is drawn at Keeper
  Fern's heel throughout. Both are props, not rewards.

## Changes from the outline, and why

- **Q2: a third state for Keeper Fern's line**, "Hazel's home…". It covers chapter 10's dawn through to the ending,
  where "gone since the snow" would be false.
- **Q7 has three steps:** the choice, the six months, and the wreath. Step 2 has the same check in both branches;
  only the scenes swap.
- **Q16 echoes the signature choice** (the ring search), and young Fern gives Keeper Fern the purple coat there. The
  outline names the coat but gives it no scene.
- **Q15: Frieren declines Kraft's praise because Heiter promised to praise her himself,** later. That's how I read
  "Heiter once said the same".
- **Mimics.** The gag starts in Q6 (your Nubbin learns to hate them) and returns in Q18, which gives the chest reward.
- **Q10: Eisen names Stark,** to bridge into Q12.
- **Q11: young Fern briefly sees Heiter's shape too.** That keeps her as the one who destroys it, as the outline says.
- **Q13: Lügner's blood magic is "thin red threads".** The outline's care notes rule out blood.
- **Q17: Denken is beaten plainly, without detail.** I'm unsure of the source's exact fight, so it stays vague.
- **Q20, search branch: a fresh sprig and a seed.** The outline says she "presses" them into your hand, which I read
  as handing over. The ahead branch gets a flower that is literally pressed flat.
- **Heiter's death is never shown or narrated.** He asks them to leave first.
- **`source` fields cite story beats, not episode numbers.** I couldn't verify the numbers.

## For Maor

- **Licence.** *Frieren* is fully in copyright (Yamada and Abe / Shogakukan; the anime's committee; VIZ and
  Crunchyroll in English). The page needs a licence before ship, and the art must be the licensed designs.
- **The three quotes still need checking** against the licensed Crunchyroll subtitles.
- **Rating.** It's `main` as set. The outline offers `teen` like A1, and nothing in the text would need to change.
- **Your call: Moss's birthday.** In `a21-grove-moss`, Keeper Fern gives Moss "the first warm day after the thaw" as a
  birthday. It's new lore, though it never contradicts canon. Cut those two lines if you'd rather not.
- **Two nameplates read "Fern".** That's the joke, and narration always says "Keeper Fern" or "young Fern". If
  playtesters mix them up, the apprentice's plate could become "Fern (Frieren's)".
