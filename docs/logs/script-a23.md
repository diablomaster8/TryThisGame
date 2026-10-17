# Log: A23 Remember Who You Are

File: `src/content/atlas-a23.ts`. Exports `ATLAS_A23`, `A23_VARIANTS`, `ATLAS_A23_FLAGS`, `ATLAS_A23_CHECKS`.
`tsc` (strict, with the brief's flags) and `eslint` both pass with no output. A self-check script (kept in the
session scratchpad, adapted from A21's) finds 0 problems:

- ids are unique, and every `requires` resolves;
- every `who` is declared;
- every line is ≤ 160 characters, and every narrator line is ≤ 2 sentences;
- there are no em dashes;
- every step scene has 6–16 lines, every complete scene 4–10, and every done scene ≤ 5;
- every quest has a choice;
- the flag and check lists match what the file uses exactly, and every check uses an existing verb;
- every variant replaces a scene that exists.

Prettier isn't applied, to match A11 and A21 (neither is Prettier-formatted).

## Counts

- **Quests:** 16 (A23-1 to A23-16), audience `all`, chained by `requires`.
- **Steps:** 38 (2–3 per quest).
- **Scenes:** 94 (75 in the quests, 19 variants).
- **Lines:** 727, counting choice `then` lines.
- **Choices:** 43 choice points with 95 options.
- **Checks:** 38 distinct ones.

## Lifted text

All three outline lines are used, each once and verbatim, with curly apostrophes. Each has a `childLines` entry.

1. "I'm only brave when I have to be." Mufasa, `a23-07-stars#1`.
2. "The great kings of the past look down on us from those stars." Mufasa, `a23-07-stars#7`.
3. "Remember who you are." Mufasa in the clouds, `a23-14-clouds#7`.

The source is Wikiquote, as the outline gives. The lines have **not** been checked against the licensed film.

Every other line is original. Famous film lines are avoided or reworded: "circle of life", "long live the king",
"it is time", "the one true king", "he lives in you", "I laugh in the face of danger", "only the bravest lions",
"I'm the king, I can do whatever I want", "you're not the Simba I remember", "here, kitty kitty", "a monkey's
uncle" and the hula. Rafiki's lesson with the stick is in our own words.

There are no lyrics. The songs' scenes are told as action: the herd chase (Q5), the years passing (Q11) and the
hyena decoy (Q15). Rafiki's humming is wordless. *Hakuna matata* appears only as the ordinary phrase, glossed by
Pumbaa (Q11) and echoed in Q12. It's never sung, never used as a title, and never put on a reward.

## Swahili, for the East African adviser

These words are used:
- *karibu* (welcome);
- *polepole* (slowly), Rafiki's running word;
- *twiga* (giraffe);
- *asante* (thank you);
- *pole sana* (I'm so sorry, said in sympathy, when Rafiki wipes the cub off his wall on the Rafiki path);
- *mvua* (rain);
- *hakuna matata*.

The adviser should also check:
- the names as Swahili words (Simba, Rafiki, Sarabi, Shenzi, Banzai, Pumbaa);
- Rafiki's voice: dry, exact, kind, a craftsman and an elder, never a comic healer or "broken English";
- the plants and landscape (baobab, fig, thorn scrub, the gorge).

## Flags

**Read (read-only):**
- The campaign being finished (`CampaignState.ending` set) picks `a23-14-clouds-done-after`.
- `s24Done` (S24) shows Hazel's margin note, `a23-margin-hazel`, beside the pool in A23-14.
- From the Grove, `atlasDone('A23')` drives the painting keepsake, the roar emote and the Night of Remembering.

**Written (Atlas save only):**
- `a23-01`…`a23-16`;
- `a23-done`;
- `a23-path` = simba | rafiki (Q9).

No Grove flag is written.

## Variants (`A23_VARIANTS`)

The quests show the Simba-path scenes. Each `-rafiki` scene replaces the scene with the same id, minus the suffix,
when `a23-path` = rafiki.

| Quest | Rafiki-path scenes |
| --- | --- |
| A23-10 | `a23-10-desert-rafiki`, `-desert-done-rafiki`, `-help-rafiki`, `-complete-rafiki` |
| A23-11 | `a23-11-oasis-rafiki`, `-oasis-done-rafiki`, `-grubs-rafiki`, `-complete-rafiki` |
| A23-12 | `a23-12-hunt-rafiki`, `-hunt-done-rafiki`, `-complete-rafiki` (step 2 is shared) |
| A23-13 | `a23-13-ridge-rafiki`, `-ridge-done-rafiki`, `-wind-rafiki`, `-complete-rafiki` |
| A23-16 | `a23-16-complete-rafiki` |

There are three more variants:
- `a23-14-clouds-done-after` plays if the campaign is finished. Your Nubbin looks from the clouds to you, and Rafiki
  puts a hand on your shoulder and says nothing. Hazel is never shown or named.
- `a23-grove-painting` is the Grove keepsake. It plays once, the first time you look into the crooked tree's hollow
  after `atlasDone('A23')`.
- `a23-margin-hazel` is Hazel's margin note (S24), read-only on `s24Done`. It plays after `a23-14-complete`, or the
  first time the atlas is open at the pool once `s24Done` is set. Its text is exactly S24's: "He saw his father in
  the pool. They stay, you know. In the face. Usually the chin. H."

**The signature choice.** It's made in Q9. It changes Q10, Q11, Q12 (opening and close), Q13, and your place at
the last presentation in Q16, seven quests later. On the Simba path, Timon and Pumbaa pull you in to stand with
them. On the Rafiki path, Rafiki hands you the gourd to crack.

## SIM needs

- **Rafiki's painting.** A fixed prop in the crooked tree's hollow. It's painted from your current Nubbin when A23-16
  completes, always with the red brow mark. The keepsake scene plays once.
- **Sunset roar.** An idle emote any Nubbin may pick at dusk now and then. It's seeded, never a timer or a task,
  and has no stat effect.
- **Tiny gourd** (Q2): a cosmetic. **Baobab-bark bench**: decor. **Bookmark**: an atlas item. All are one-time.
- **The Night of Remembering** reads `atlasDone('A23')`.
- **Branch steps.** On the branched quests, the goals, hints and checks are written to fit both paths, so only the
  scenes swap. No step needs a per-path check.

## Changes from the outline, and why

- **Q12 on the Rafiki path.** The outline doesn't branch Q12, but on that path you're at the baobab in Q11 and
  again in Q13. So Rafiki sends you with Nala at the end of Q11. You see the meeting with her (`a23-12-hunt-rafiki`),
  then she sends you home with the news (`a23-12-complete-rafiki`). That's why Q13's Rafiki path opens with you
  arriving at the baobab.
- **Q13 on the Simba path** ends with Rafiki finding you in the night. That bridges into Q14, which is shared.
- **Q6: Mufasa keeps you with him** ("Rafiki would never forgive me if I lost you"), so that you're present, a little
  way off, for Q7, as the outline places you.
- **Q8 is three steps:** the rim, Zazu's wing, and the dust settling. You bind the wing with your gourd's string.
- **Zazu.** On the Simba path he limps home. On the Rafiki path he walks back to the rock out of duty (Q10). Either
  way Scar cages him, and you free him in Q15 during the decoy. The outline doesn't place Zazu after Q9.
- **Q15:** Sarabi says "It was never your fault" plainly, as the care notes ask. You first try to say it in Q13.
- **Q16: the new cub is never gendered or named.**
- **The third rule** is acted out by Rafiki in Q14 (he sits beside Simba and waits). It's also offered as a choice
  in Q10 and Q13. It's never quoted.
- **The quest title "Look Harder"** is the outline's. Nobody says the phrase aloud.

## For Maor

- **Licence.** *The Lion King* is fully in copyright (Disney). The page needs a licence before ship, and the art
  must be the licensed designs. Only the 1994 film is used.
- **The three quotes still need checking** against the licensed film.
- **The adviser packet** (East African Swahili speakers) should cover every Swahili word above, Rafiki's voice and
  the landscape.
- **Your call: the audience.** It's `all`, as the outline says, with `childLines` on the three quotes, as in A16.
  The Learning Grove's own savanna version (no retelling of the death) is the separate task. If the Learning Grove
  mode would otherwise surface these main-game quests, consider setting Q8 and Q15 to `main`.
- **Your call: "dumpling".** Timon's running nickname for your Nubbin (Q10, Q15, Q16) is our own joke. Cut it if it
  grates.

## Resolved (2026-10-15)

- **Audience:** A23-8 (the gorge) and A23-15 (Scar) are now `main`, so they can never be adapted into the Learning Grove. Both stay in the main game for every player as before. Neither holds a lifted line, so no `childLines` change was needed.

## Review fixes (2026-10-16)

- **Hazel's margin note added** (`a23-margin-hazel`, read-only on `s24Done`), as S24 promises for every Atlas page.
- **`a23-06-bones#4`:** "dusty and furious" is now "covered in dust and furious" (it read for a moment as Dusty).
- **A23-16's gourd:** the shared `a23-16-green#5` no longer cracks a gourd (the cub sneezes, as Simba did). The brow
  mark moves to `a23-16-complete#0` on the Simba path, so on the Rafiki path the gourd you crack is the only one.
- **Near-verbatim film lines reworded** (they went past the three-quote budget): Scar's "forgive me if I don't leap"
  (`a23-04-ledge#4`), Zazu's "very real danger" (`a23-06-bones#5`), Simba's "trying to be brave like you" and "not
  scared of anything" (`a23-07-dusk#6`, `#8`), "Stampede! In the gorge!" (`a23-08-rim#9`), Scar's "What have you
  done?" (`a23-08-dust#4`), "Lions eat guys like us" (`a23-10-help#6`), the outcast exchange (`a23-10-complete#2`–`#6`),
  "Welcome to our humble home" (`a23-11-oasis#1`), "It means no worries" (`a23-11-oasis#6`, now "Roughly: no worries",
  which also keeps clear of the song), "Who told you something like that?" (`a23-11-complete#3`), "You said you'd always
  be there" (`a23-13-ridge#5`, now an echo of Mufasa's own "look up" line in Q7), "That's not my father"
  (`a23-14-pool#4`), "I'm not who I used to be" (`a23-14-clouds#4`), Sarabi and Scar's "we must leave" / "we're not
  going anywhere" (`a23-11-grubs-rafiki#3`, `#4`) and "No. It's me." (`a23-15-rock#6`). Line counts are unchanged, so
  no index moved. Checked from memory of the 1994 script; the quote check against the licensed film should cover them.
