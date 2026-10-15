# Log: S27 Some Nubbin (*Charlotte's Web*), Grove side story, Tier 1

File: `REPO/src/content/side-stories-s27.ts`. Exports: `SIDE_STORY_S27`, `SIDE_STORY_S27_VARIANTS`,
`SIDE_STORY_S27_FLAGS` and `SIDE_STORY_S27_CHECKS`. tsc (strict) and eslint both pass with no errors.

## Counts

- **Quests:** 1 (`s27`, code `S27`), audience `all`.
- **Steps:** 14.
- **Scenes:** 38: 14 step scenes, 14 done scenes, 1 complete scene and 9 variants.
- **Lines:** 335, counting choice `then` lines. The longest is 127 characters, and no narrator line runs past two
  sentences.
- **Choices:** 8 options in 3 choice points: the naming of Nine (3), "Was it you?" (3) and the buy-back (2).
- **Checks:** 14, all on existing verbs (find, talk, sit, collect, watch, carry, wait, escort).

## Self-checks

- Ids are unique.
- No `requires` field is used.
- Every `who` is declared: campaign ids, plus `s27-spindle` (declared, never speaks), `s27-tam`, `s27-tull`, and the
  shared ids `wisp` and `clank`.
- The checks list and the flags list match what the file uses.
- Every step scene has 6–16 lines.

## Lifted text (*Charlotte's Web*, E. B. White, Harper & Brothers, 1952; under copyright)

Two one-sentence quotes, exactly as the outline lists them, each with a `childLines` replacement:

1. "You have been my friend." The Keeper says it to Spindle (`s27-last-evening#6`).
2. "It is not often that someone comes along who is a true friend and a good writer." This is the last narration
   of the spring scene, followed by our own line "Spindle was both." (`s27-spring#9`, `s27-spring-wisp#9`). Both
   spring variants carry it, and only one of them ever plays.

All the web words are new: EVENING, WAIT, the name, SOMEBODY'S, WARM, HOME, plus ABOVE, PLEASE and WELL. None of
White's four words appears.

## Flags

- **Read:**
  - `soldNubbin`, `soldId` and `boughtBack` choose the path.
  - `wisp` (spared or sable) chooses who carries the egg sac, and gates step 12.
  - `s21Done` brings Clank in to hold the ladder.
- **Written:**
  - `boughtBack: true`: set by either choice in `s27-home`, on the sold path only.
  - `s27Done`.
  - `s27-truth`: shield, frost or silent.
  - `s27-nine-name`: Tansy, Button or a name you type (runner path).
  - `s27-paid`: shells or hat.
  - `s27-carrier`: nubbin or wisp.

## Variants (`SIDE_STORY_S27_VARIANTS`)

- **Sold path:**
  - `s27-row-sold` replaces `s27-row`.
  - `s27-words-sold` replaces `s27-words` (no naming choice).
  - **`s27-home` replaces `s27-letgo`.** This is the campaign hook (the buy-back): Corvin asks 200 Shells, and you
    can pay or let the Keepers pass a hat.
  - `s27-gate-sold` replaces `s27-gate`.
- **Truth payoff:** `s27-midnight-shield` replaces `s27-midnight` when `s27-truth` is shield.
- **Egg-sac carrier:** `s27-carry-wisp` plays if Wisp was spared (or sable), and `s27-carry-clank` if `s21Done`.
  Otherwise `s27-carry` plays.
- **Post-game spring:** `s27-spring` or `s27-spring-wisp`, chosen by `s27-carrier`.

## SIM needs (in full in the quest notes, under "SIM:")

1. An `applyChoice` side effect for `s27-home` (pay or hat), guarded by `soldNubbin && !boughtBack` before the
   choice's flags are applied:
   - **Pay:** take 200 Shells (floored at 0).
   - **Hat:** no Shells change.
   - Then bring the `soldId` stray home exactly as `c9-open`'s bargain does: remove it from `strays`, set trust to
     20, set `stray` to false, set it to sit, and push it to `nubbins`.
2. **If the Grove is full:** leave the Nubbin in `strays` with trust 20 and `returnsAtMs` set to now. The existing
   loop in `trust.ts` then brings it to the gate as soon as there's room.
3. **If there is no `soldId` stray:** still set `boughtBack` and take the Shells, but skip the homecoming.
4. **Runner path:**
   - After `s27-letgo`, spawn Nine: adult, grey, trust 20, named from `s27-nine-name`. Push it to `strays` with
     `returnsAtMs` set to now, so it arrives as a stray you can recruit.
   - The "own" choice opens the existing naming box. A blank name falls back to Tansy.
5. **Names in art:** the rail art and the Frost-Web Window render the name, since dialogue has no name placeholder.
6. **Ambient extras:** Spindle's three (ambient spider sprites in the Grove lantern shed, with no care needs), and
   the empty web in the Circuit shed window.
7. **Gating:**
   - Step 9 waits for `c7-open`.
   - Step 12 waits for `wisp` to be set, or for chapter 8 to open.
   - If `c8-close` has played before step 11 is done, the line closes unfinished and the campaign is unchanged.

## Changes from the outline, and why

- **18 quests merged into 14 steps,** inside the brief's 10–16 range:
  - 6 and 7 are merged.
  - 8 is split across steps 7 and 8, and step 8's done scene is quest 9.
  - 10 and 11 are merged.
  - 12 and quest 13's night are merged.
  - Quest 13's morning and 14 are merged.
  - 18 is a post-game variant, because the line has to close before chapter 9.
- **Your sold Nubbin is painted "9" too.** `c5-sold` gives it an unnumbered painted number, so Tam calls the
  end-of-row runner Nine on both paths. That lets most scenes be shared between paths.
- **Flag names:** the outline's `s27Truth` and `s27Carrier` became `s27-truth` and `s27-carrier`, to match the repo's
  local-flag style. I also added `s27-nine-name` and `s27-paid`.
- **"Nobody but you ever knows about Spindle"** (shield path) is narrowed to "Corvin never learns". Sparks named her
  and four Keepers gave her words, so the valley knows about her; only Corvin doesn't.
- **Wisp's line is written "mine. warm. mine."** in S2's lowercase half-voice, not the outline's capitals.
- **Byte's word gets a small payoff.** Spindle writes ABOVE on his stopwatch strap ("It isn't accurate. I'm
  keeping it.").
- **The Keepers' words:** Fern gives SOMEBODY'S (Bramble, the Nubbin she lost), Clover gives WARM, and Luna gives
  HOME.
- **Rewards:**
  - The three rewards from the outline are kept.
  - "Spindle's three" is added as a `feature`, because the bible lists "Spindle's daughters" as a reward.
  - `boughtBack` is added as a `flag` reward, as S13 did for `millLetter`.
- **The Learning Grove `EduQuest`** isn't in this file, because the brief only asks for edu blocks for LB and LK. The
  outline's edu points are in the notes for whoever writes the edu side files.
- **Old Tobin** is left out of the crowd, because S13 introduces him in chapter 7.

## For Maor

- On the sold path, S27 now gives a story way out of the Collector ending: Spindle's HOME, then a choice to pay 200
  Shells or pass the hat. Keeping the stone still leads there.
- The signature choice ("Yes, it was me" / "Ask the frost" / say nothing) pays off four steps later, in the night
  when HOME is written: either Corvin's "Spell it right, then", or Corvin watching you all night and never learning
  about Spindle.
- **Please check:** I used White's narrator line in the spring scene, then our own "Spindle was both."
- **Please check:** Corvin keeps Fern's button in "his coat pocket: not the breast pocket, the other one."
