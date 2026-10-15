# Log: S28 Please Look After This Nubbin

File: `REPO/src/content/side-stories-s28.ts`. Exports: `SIDE_STORY_S28`, `SIDE_STORY_S28_VARIANTS`,
`SIDE_STORY_S28_FLAGS`, `SIDE_STORY_S28_CHECKS`. tsc and eslint are clean.

## Counts

- Quests: 1 (`s28`, code `S28`), audience `all`, no `requires`.
- Steps: 13. Each has a scene and a done scene. The complete scene follows step 13.
- Scenes: 37. That is 27 in the quest (13 step scenes, 13 done scenes and the complete scene) plus 10 in
  `_VARIANTS`. One of the 10, `s28-byte-barks`, is a bark pool rather than a scene that plays.
- Lines: 337. This count includes the choices' `then` lines.
- Choices: 4 choice points with 11 options in all:
  - told or kept (step 1 done);
  - the log's column (step 4 done);
  - the offer to Mr Grue (step 8 done);
  - sit beside Parcel or hang back (step 10 done).
- Checks: 13, all using existing verbs (escort, carry, minigame, watch, walk, find, craft, sit, deliver).
- Self-check results:
  - No duplicate ids.
  - Every `who` is declared.
  - No line is over 160 characters.
  - No straight apostrophes.
  - The only narrator line the checker flags is the jar label in `s28-one-jar`. It is a single sentence that
    quotes the label, so I left it as written.

## Lifted text

Each quote appears exactly once and each has a `childLines` entry.

1. **The tag.** `s28-cart#6`: "Please look after this one. Thank you."
   - Source: adapted from Bond's label in *A Bear Called Paddington* (Collins, 1958, chapter 1).
   - Child line: "Please be kind to this small one. It has come a long way."
2. **The recipe card.** `s28-kitchen#6`: "If we're kind and polite, the world will be right."
   - Source: *Paddington 2* (2017). Byte reads it off the back of Hazel's recipe card and says that
     "Somebody's quoting somebody."
   - Child line: "Be gentle, say thank you, and share what you've got."

All other dialogue is original. Hazel's line, "You count things, love. I needed someone who'd count this one.", is the
outline's own words.

## Flags

- **Read:**
  - `s7Done` in step 6. I also read `s7-stopped` and whether S7's Minder step has been met; see "Changes".
  - `s8Reunited` in step 11, for colour only.
- **Written:**
  - `s28-told` (true or false);
  - `s28-column` (good, unverified or none);
  - `s28-offer` (jar, weed or stare);
  - `s28Done`.
- S28 writes no campaign flag.

## Variants

| Variant | Replaces | When |
| --- | --- | --- |
| `s28-null-minder` | `s28-null` | The Minder is still ticking |
| `s28-logged-unverified` / `-none` | `s28-logged` | By `s28-column` |
| `s28-bench-bramble` | `s28-bench` | `s8Reunited` is set |
| `s28-why-untold` | `s28-why` | `s28-told` is false |
| `s28-grue-back-weed` / `-stare` | `s28-grue-back` | By `s28-offer` |
| `s28-complete-unverified` / `-none` | `s28-complete` | By `s28-column` |
| `s28-byte-barks` | Nothing; it is not played as a scene | Byte's idle lines after `s28Done` |

## SIM needs (also in the quest notes)

1. Byte's house becomes a place you can visit from step 1. Parcel lives there as an NPC Nubbin that can't be owned.
2. Mr Grue and his glasshouse join the valley at step 3.
3. Optional, with no lines: show Parcel beside Byte in `c10-vigil` if step 3 is done.
4. After `s28Done`, Byte uses the bark pool at his house.
5. Marmalade can be made at Byte's kitchen from Mr Grue's oranges, as often as you like. It is never required.
6. Byte's log becomes a journal page showing the columns the player chose.
7. Hold `c9-open` while S28 is between step 1 and the end of step 10. This is the same backlog rule used for
   `c5-close` with S5 and `c11-close` with S9.
   - If the player hasn't started S28 by `c9-open`, it is withdrawn.
   - If `c12-open` arrives before step 13 is done, S28 closes unfinished. Rewards already given stay, and
     `s28Done` is not set.
8. Step 8 waits for the first winter day on the game clock.
9. The mop-up mini-game has no fail state.

## Changes from the outline, and why

- **Quests merged and split.** The outline's 15 quests became 13 steps:
  - quests 4 and 5 are now step 4 (the stare, then the log);
  - quests 9 and 10 are now step 8 (the graph, then the glasshouse);
  - quests 13 and 14 are spread over steps 11 and 12: the crust, then the bench, then "why me".
- **The told choice moved.** It is now at Byte's door (`s28-for-byte`), where you actually tell him, instead of at
  the cart.
- **Flag names.** `s28Told`, `s28Column` and `s28Offer` became `s28-told`, `s28-column` and `s28-offer`, to follow
  the brief's rule that every flag carries the line prefix.
- **How `s7Done` is read.** The Minder version plays only if S7 has reached its Minder and neither `s7Done` nor
  `s7-stopped` is set. Otherwise `s28-null` plays. This covers S7 being half-finished or never reaching the Minder,
  and it avoids showing the Minder before S7 reveals it.
- **The thin grey Nubbin.** It is in Hazel's arm on every route, so Parcel shares its sandwich with it on every route.
  The `s8Reunited` variant only names it as Bramble's youngest.
- **The shoelace joke.** Byte can't hear Moss until `c10-moss-stays`, so Moss speaks to you and Byte reads your face.
  Moss plays the Mr Gruber role here: elevenses, the duck story, and "precious things... held a lot". He gives the
  evacuee echo one warm line.
- **Moss in chapter 11.** He is kept out of the chapter 11 scenes, so they work whatever happened to him. Steps 11
  to 13 also work on every route, including when the stone was kept.
- **Dot's gift jar.** It is apricot, because Mr Grue's tree is the valley's only bitter orange.
- **The tag reward.** The tag is lettered by Byte: "RECEIVED". Neither the reward nor anything else repeats the tag's
  wording.
- **Hazel's rule.** Her first rule is referred to, not quoted, in step 8.

## For Maor

- *Paddington* needs a licence before this ships, as Part M already says.
- **New canon details to approve:**
  - Mr Grue's first name is Horace, which Byte mentions in `s28-why-untold`.
  - Mr Grue's mother carried the orange pip over the pass and grew it in a teacup.
  - The market stallholder is called Dot Amblin.
  - Byte's crust happens "three hours and twelve minutes in, the third cold" of the vigil.
- **Engine rule to approve:** holding `c9-open` for S28 extends the existing backlog rule.
- **No `requires`:** S28 opens on the morning after `c8-close`, by its trigger.
