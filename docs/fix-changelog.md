# Hazel's Grove: fix-pass change log (2026-10-14 to 15)

Every item from the quality review (38 must, 116 should, 87 nice) was **fixed, adapted or
explained**, and a regression review then checked the work. All 111 campaign and side-story items
pass. The 13 new problems the regression pass found, and its 9 code findings, are also fixed.
Every check is clean: `tsc`, `eslint`, and `content-check` (0 problems).

## How the work was done

1. **The canon sheet** (`fix/canon.md`) settled the contested facts first. The story bible's
   "Settled details" section now carries them.
2. **The originals were fixed by area:**
   - the campaign;
   - side stories S1–S22;
   - the fun quests, readers, results and types;
   - the Multiverse and Neopia.
3. **The Learning Grove was brought level** with the fixed originals, in both bands. Every new
   scene got a sprout and a reader version. The Hebrew and Japanese questlines were fixed.
4. **The checker gained lint rules.** It now fails on:
   - original quotes in the Learning Grove;
   - non-`all` quests in Learning Grove packs;
   - speaker ids that mean different characters across audiences.

   It warns on pronouns, timers and line caps.
5. **The master prompt and new outlines were updated:**
   - 101 prompt edits applied and 7 adapted.
   - Part I now carries the new bible.
   - Parts L and M were rebuilt.
   - A new CV6 engine backlog was added (29 items).
   - The 15 Part M outlines were reviewed, and the other 25 storylines outlined.
6. **The regression review** found 0 unfixed items and 22 new small problems, all now fixed.

## Rulings Claude made under the canon (Maor can overrule any of them)

- **Freebies.** Each is one-time per save or unlimited. Coltzan's Shrine and the Lab Ray are
  once per Nubbin, ever.
- **Talking characters.** These keep their voices: talking Nubbins in fun quests, S12's hive
  chorus, S18's Professor Delve and S15's clockwork parrot.
- **New characters renamed** to avoid clashes: S26's girl is Linnet (S20 has a Wren), and S23's
  echo is Thimble (S15 has a Pip).
- **Night of Remembering.** Its reward is now the Remembering Tree, so it no longer duplicates
  A7's ofrenda.
- **Learning Grove.** Neopia and the Multiverse aren't offered there.
- **Hazel's notebook** keeps "Day 300-something" (a protected verbatim line).
- **The content setting** is "Mature content" (Off, 13+, 18+).

## Still for Maor

- **Seven fun-quest quotes** (approved as written by Maor, 2026-10-17): "It's only wafer-thin.", "Teddy!",
  "Wildcard, bitches!", "I am a golden god!", the egg line, the bird-law line and "There is no
  Carol in HR!". Also check the Q15 Cheese Shop wording.
- **The game's existing daily gifts** (`sim/daily.ts`, `sim/neighbourhood.ts`) are "once a day",
  which breaks the no-chores rule. This is CV6 item 22.
- **49 public-domain quotes in the Part M outlines** are still marked [unverified], because
  Project Gutenberg was blocked from here. Recheck them before scripting.
- **Voice-over:** `you` lines stay unvoiced.

---

The per-area logs follow.

---

# log-campaign
## Fix log: campaign (2026-10-14)

Files: `REPO/src/content/campaign-book1.ts`, `campaign-book2.ts`, `campaign-book3.ts`, `campaign.ts`.
Review: `SCRATCH/part-m/review-campaign.md`, plus the campaign halves of three cross items from
`review-side.md` and canon item 24. Originals are backed up in `SCRATCH/fix/campaign-bak/`.

`campaign.ts` needed no change: it spreads `BOOK3_SPEAKERS` into `CAMPAIGN_SPEAKERS`, so the new
`chorus` speaker reaches Book One too.

## 1. Items

M = must fix, S = should fix, N = nice to have, X = cross item, C = canon sheet (extra). Line
numbers in the review were stale; every fix was found by text.

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| M1 | c4-out: Sparks "He…him…he" | book1 | fixed | "She is asleep again before anyone can tell her nobody thought she had." |
| M2 | c10-dawn: Pixel calls Sparks "he"; note says "his sleep-talk" | book3 | fixed | "She didn't. I was watching her hands…"; note now "her sleep-talk". |
| M3 | Ending hole: bonded Sable + reconciled + Open falls to long-road | book3 | fixed | Canon 24. New body variant `end-hazels-grove-open` (title + the canon first line + shared `HAZELS_GROVE_BODY`), played in place of `end-hazels-grove` when `letThemGo`. `BOOK3_ENDINGS['hazels-grove'].how` no longer asks for "A home". Ending-order note gives the rule, the replacement and wild-grove's precedence. Bible lines verified (already updated). `endingFor` and tests: Engine backlog E1. `long-road` text left as is: a bonded Sable can no longer reach it. |
| M4 | Collector route: confront → shard "gift" is incoherent; sold Nubbin never shown; end-collector-sold | book3 | adapted | (a) The sold Nubbin line lives in a new variant `c9-open-sold` (c9-open split into shared `C9_ARRIVE`, `C9_GARDEN`, `C9_CHOICE`; same pattern as c6-open-walked), not inline. (b) Collector + reconciled plays `c9-shard-reconciled`. (c) Collector + bargained can't happen (bargain sets `boughtBack`), so `c9-shard-collector` now only ever follows *force*; its opening was rewritten to fit that ("Quick. Nobody asked them… That's my method, partner. You've just used it on me."), keeping "With this, they'll never leave you." (d) end-collector-sold: "You never went looking for the first one when the pens opened…", split in two lines. |
| M5 | Moss and Hazel's winter told three ways | book2, book3 | fixed | c7-stillness-3 "quiet" and `MOSS_GOES_IN` now as suggested. Also c4-tale-3 "a bag too big for her" → "in a coat too big for her, with a chin like yours" (canon 1). c4 and c11 already matched. |
| M6 | c4-tale "ask-loved": a flower older than Briar's | book1 | adapted | Canon 2 wording instead of the reviewer's: "She was gone long before the hill had flowers. When Briar's came up by the big stone, I planted one for her beside it." + "I still go and sit with them both." Note added to c4-tale. |
| M7 | Corvin walk: he carries the lantern down, yet c12-close has it burning on the hilltop | book3 | adapted | No c12-close variant. In `c12-walk-corvin` he leaves the lantern burning at the top with her, like every other walk ("his hands are empty"), and keeps "He is getting better at it." `end-epi-walk-corvin`: he fetches it down at first light; it hangs by the **cottage door**. This also meets review-side's request to align with S10's letter, which the side fixer has already changed to "Somebody brought it down at first light." |
| M8 | c9-sable: "never waited at the gate before" | book3 | fixed | Two lines: "She waited here once before, the morning you went to the Hollow." / "This time she gets up and comes to meet you." |
| M9 | Forced route: Ash scatters, then arrives in c10 | book3 | fixed | Line added at the end of `c9-shard-forced`, and also of `c9-shard-collector` (which now always follows force). |
| M10 | Chapter 11 crammed into one day | book3 | fixed | `c11-close` opens "Days go by like that. Hazel sleeps a lot, and wakes up for the good bits." (canon 4); end-epi-told "on the day she went up". Bible verified. The hold is Engine backlog E2. |
| M11 | Season slips | book1, book2 | fixed | c3-close "Not for months yet."; c7-stillness "at midsummer". |
| M12 | Prompt Part I out of date | prompt | adapted | Prompt edits P1. The counts say 22 scripted and 5 changing, then name Part M's three (S23, S26, S27) so they match the bible's 8 of 31. |
| M13 | Prompt Part J "It Sunny" | prompt | fixed | Prompt edits P2. |
| S1 | c2-corvin refuse repeats "never once done for you" | book1 | fixed | "He goes. The gate swings shut behind him on its own." |
| S2 | c4-open "about a week" | book1 | fixed | "You have managed a morning. Not bad." |
| S3 | c4-open vanishing joke | book1 | fixed | "Hazel has never vanished in her life. She leaves notes." |
| S4 | "the lantern night" | book1 | fixed | "Tonight is Lantern Night." See also C1. |
| S5 | c4-out "and there isn't" | book1 | fixed | "…and it is gone." |
| S6 | c5-open: did Ash come back or not | book2 | fixed | As suggested. |
| S7 | c5-circuit "Cold? Is it." answers nothing | book2 | fixed | Inserted "Your breath smokes in the August air. Corvin sees it." |
| S8 | c7-open Luna vs c3-close | book2 | fixed | As suggested. |
| S9 | c7-stillness-2 "cinder" re-explains cinder-love | book2 | fixed | As suggested. |
| S10 | c7-close: duplicate "heavy"; SABLE speaks | book2 | fixed | "She is heavier than she looks…"; `N('Sable says nothing. Her ears stay up.')`. Unused `SABLE` const removed (lint). Note says Sable is narrated. |
| S11 | Wellspring "never freezes" vs the frozen rim | book2, book3 | fixed | Marina: "The water never freezes. Only the rim, once…" (the old second sentence kept as its own line). `BANK_DAWN`: "Steam rises off the spring again." `c10-kept`: "A rim of frost stays round the spring." (canon 6). Note on c10-kept. |
| S12 | Nova "For a year" | book2 | fixed | "Since the end of the winter." / "Since the snow." (canon 13). |
| S13 | Where Hazel was, autumn to midwinter | book3 | fixed | Corvin's line added to c9-open's shared `C9_GARDEN` (canon 12). |
| S14 | "He didn't. You did." wrong in the reconciled route | book3 | fixed | c9-close (Moss) and c11-open (Hazel) as suggested. |
| S15 | c10-bearer-sable "nothing left in her to take" | book3 | fixed | As suggested; this also removes the second "That is the terrible thing" (N3). |
| S16 | c10-ledge "nobody else small enough" | book3 | fixed | As suggested. |
| S17 | c10-ledge "without anyone telling you" | book3 | fixed | As suggested. |
| S18 | c10-dawn: fourth lantern never shown going out | book3 | adapted | "The fourth is dark. Ember has her arms round it anyway." ("anyway", so the later "Ember is still holding the long-grass post" doesn't repeat it). |
| S19 | c10-wisp "a grey face" reads as Wisp's | book3 | fixed | As suggested. |
| S20 | Three torn ears | book3 | fixed | c10-bramble: "The way it folds over at the tip"; Hazel's "Torn ear" dropped; "touches the folded ear" (canon 10). Wisp's torn-ear lines kept. |
| S21 | "under a root" twice; "with nobody" | book3 | fixed | c11-open: "This one I found the night before last. She'd stopped eating." |
| S22 | Moss's flower "in the long grass"; end-moss-sleeps timing | book3 | fixed | c10-moss-mourned and end-moss-sleeps as suggested (canon 15). Notes updated. |
| S23 | Fades-route payoff missed in c11 | book3 | fixed | New `c11-moss-passed` ("I passed him on the path. He told me I was late."); it shares `MOSS_GONE_TAIL` with c11-moss-gone. |
| S24 | Keep route: cosy Moss reunion; two Moss fates | book3 | fixed | New `c11-moss-kept` (Moss stays on the hill, back to the Grove; he and Hazel only look; "Hello, old thing. Like that, is it."). `c11-moss-here` is now unmade routes only. end-collector-kept as suggested. The walk epilogue is X3. |
| S25 | c11-sable wrong after "grab"; `corvinOffer` = considered never read | book3, book2 | adapted / fixed | c11-sable: route-neutral wording instead of a variant ("You think of the first night, and of every night since. You nod."). New tail `c5-considered` after c5-circuit ("Still thinking? Good. The offer stands."). `corvinOffer` added to BOOK2_FLAGS. |
| S26 | c11-open "love" twice | book3 | fixed | "Go on. Go and talk to them. Properly. Not about me." |
| S27 | end-hazels-grove "she" reads as Pixel | book3 | fixed | "Sable makes a small sound…" (now in `HAZELS_GROVE_BODY`). |
| S28 | Bible: S3 opens ch4 or ch5 | bible | skipped | Already fixed in the bible (S3 "ch4 → ch11"; chapter 4 "Opens S1 and S3"). c4-out's note already agrees. Verified only. |
| S29 | c11-close "Verbatim" Ember line isn't verbatim | book3 | fixed | Restored the `story.ts:859` wording: "Sparks likes everyone, that doesn't count, but Ember likes you…". The note now says it is the story.ts wording, split over two lines. |
| S30 | Lantern Song vs the voice-over rule | book1, book3 | fixed | New speaker `chorus` ("Everyone", kind other) in `BOOK3_SPEAKERS`. c4-close: Luna sings the first line alone, chorus the rest. c10-vigil: Luna's half-line stays hers, chorus answers from the second line on. Notes updated. Voice-over: Prompt edits P4. UI: Engine backlog E5. |
| S31 | c10-close "too glad to" on the keep route | book3 | adapted | Neutral wording instead of a 12-line variant: "too tired to go home and not one of them willing to." |
| S32 | c9-close Marina flat line | book3 | fixed | As suggested. |
| S33 | end-eternal-dawn-moss "learning not to" | book3 | fixed | "learning how". |
| S34 | Wisp under the bathhouse step | book3 | fixed | "cottage step" (canon 16). Note updated. |
| N1 | c3-open "Whose is she?" | book1 | fixed | "Whose is it?" |
| N2 | "I'll figure it out" | book3 | fixed | "I'll work it out." (canon 19). No other Americanisms found. |
| N3 | "The best part" ×5; "That is the terrible thing" ×2 | book3 | fixed | Cut c11-close's "It is the best part." (note updated). The second "terrible thing" went with S15. |
| N4 | Why not unmade back then; why only the fourth | book3 | adapted | Both Moss lines added to c9-close, reordered so the beat lands: "The other three sleep…" before "Only a grey one…", and "None of us was grey, then. We could only break it, and keep watch." just before "…I am grey enough." |
| N5 | c7-stillness-2 skipping rhyme at dawn | book2 | fixed | "Somewhere over the wall, Fern is humming a skipping rhyme to the hens." |
| N6 | c10-moss-light "down the valley" | book3 | adapted | The scene plays after both the fades (hill) and mourned (Wellspring) routes, so it now reads "drifting down on the morning air", which fits both. Note updated. |
| N7 | Hazel owns the letter's "gone up the hill" | book3 | fixed | c11-open, after "I'm not staying long…": "I wrote that I'd gone up the hill. I was optimistic about the timing." |
| N8 | end-epi-gate-none "before you were born" | book3 | fixed | "Hazel put it there years ago." |
| N9 | Part J: "Moss Sleeps" title in the edu bands | edu | skipped | Already done: both bands title it "Moss's Flower" (edu-campaign-3-sprout.ts l.13 and l.2755; edu-campaign-3b-reader.ts l.1322). Verified only. |
| N10 | Part K: tōrō nagashi; Dumpling's bowing | prompt | fixed | Prompt edits P3 (and For Maor). |
| N11 | Voice-over: "…" vs "..."; are `you` lines voiced | prompt | fixed | Prompt edits P4. |
| X1 | `c11-gate`: a return on the eve of ch12; no second "Leave him… till morning" (canon 5) | book3 | fixed | Rewritten: "he is back at the gate", tries the latch once "for form's sake, and it sticks". Hazel's stance matches s9-yours: "Don't look at me, love. I've done my part. It's your gate now." and "He said till first light…" (this matches the side fixer's new s9-ask line). Cut "twenty-two years getting to that gate" and the discovery lines. Ids, labels and the gate-tea cup payoff kept; gate-cruel's answer rewritten so Hazel isn't the one making him wait. Note: plays after c11-close only if s9-ask has been seen. `s9Started` flag comment updated. |
| X2 | c10-bramble / c11-open wording for S8 | book3 | fixed | c10-bramble keeps Hazel's "Her mother runs the place… I gather you've met" as the only copy (the side fixer's `s8-complete-dawn` skips it); ear wording per canon 10; c11-open drops "under a root, with nobody". Note on c10-bramble names s8-complete-dawn. |
| X3 | `end-epi-walk-moss-stayed` vs S10's walk options | book3 | fixed | The rule is now: walk = moss → `-moss-stayed` if `keptStone`, else `-moss`. S10 offers Moss on the keep route whether or not he faded. Text: he walks her up and turns to face the Grove for the first time since the Long Night, then the two flowers (it no longer repeats end-collector-kept's "never came down"). Notes on c12-walk-moss and both epilogues. **Side half: hand-off H1** (the side fixer's current note sends keep + not-faded to `-moss`, which contradicts end-collector-kept). |
| X4 | Canon 24: `end-hazels-grove-open` | book3 | fixed | See M3. Engine backlog E1. |
| C1 | Canon 18: "On lantern nights" ×2 | book3 | fixed | end-eternal-dawn-last and end-empty-lantern → "On Lantern Night"; note too. |
| C2 | Canon 1: coat too big | book1 | fixed | Part of M5. |

Counts: **fixed 53, adapted 9, skipped 2**. That is 64 rows: 13 must, 34 should, 11 nice to have,
4 cross items and 2 canon extras. Hand-offs: 3. H1 and H3 need changes; H2 is a confirmation only.

## 2. Scenes changed (for the Learning Grove mirror)

**New scenes (both bands need an entry; these are the 10 content-check problems):**
`c5-considered`, `c9-open-sold`, `c11-moss-kept`, `c11-moss-passed`, `end-hazels-grove-open`.

**Speaker change only:** `c4-close` (song lines are now `luna` then `chorus`), `c10-vigil` (the song lines
after Luna's first half-line are now `chorus`). Text is unchanged.

**Text changed:**

- Book One: `c2-corvin` (refuse branch), `c3-open`, `c3-close`, `c4-open`, `c4-tale` (ask-loved, one line
  became two), `c4-tale-3`, `c4-out`.
- Book Two: `c5-open`, `c5-circuit`, `c7-open`, `c7-stillness` (sable branch), `c7-stillness-2` (cinder
  branch), `c7-stillness-3` (quiet branch), `c7-close`, `c8-ledge` and `c8-ledge-s4` (Marina's Wellspring
  line, now two lines), `c8-open`, `c8-close` (feed branch).
- Book Three: `c9-open` (Corvin's autumn line; Ember "work it out"), `c9-shard-forced`, `c9-shard-collector`
  (mostly rewritten), `c9-sable`, `c9-close`, `c10-bearer-sable`, `c10-ledge`, `c10-kept`, `c10-wisp`,
  `c10-bank-wisp`, `c10-bank-moss-returned`, `c10-bank-moss-gone` (all three via `BANK_DAWN`),
  `c10-moss-walks`, `c10-moss-walks-bearer` (both via `MOSS_GOES_IN`), `c10-dawn`, `c10-moss-mourned`,
  `c10-moss-light`, `c10-close`, `c10-bramble`, `c11-open`, `c11-sable`, `c11-close`, `c11-gate` (rewritten;
  same choice ids), `c12-walk-corvin`, `end-hazels-grove`, `end-eternal-dawn-moss`, `end-eternal-dawn-last`,
  `end-moss-sleeps`, `end-empty-lantern`, `end-collector-sold`, `end-collector-kept`, `end-epi-wisp-spared`,
  `end-epi-gate-none`, `end-epi-walk-moss-stayed`, `end-epi-walk-corvin`, `end-epi-told`.
- Unchanged text, refactored only: `c11-moss-gone` (its tail is now the shared `MOSS_GONE_TAIL`).

## 3. Hand-offs

**H1. `side-stories-main.ts`, S10 notes, variant (3) (the walk = moss half of X3).** Moss is offered on
the keep route whether or not he faded, and walk = moss on the keep route always ends in
`end-epi-walk-moss-stayed`. `end-collector-kept` (which plays in every keep run) says he never came
down again, so `end-epi-walk-moss` (he comes down in the spring) must not play there.

Old:
```
'(3) The done scene: build the id as s10-foot plus a dash and the letters, in order, m if Moss is still in the ' +
'world (the same test as c11-moss-here: mossReturned true, or the wisp route with mossFaded false, or the keep ' +
'route), s if Sable is ' +
'bonded, c if corvinGate = family; with none, plain s10-foot (only “Just me”). On the keep route (keptStone) Moss ' +
'stays in the world even when mossFaded is true; walk = moss there ends in end-epi-walk-moss-stayed ' +
'(campaign-book3.ts), and with mossFaded false in end-epi-walk-moss. The quest lists s10-foot-msc (all ' +
```
New:
```
'(3) The done scene: build the id as s10-foot plus a dash and the letters, in order, m if Moss is still in the ' +
'world (mossReturned true, or the wisp route with mossFaded false, or the keep route, where he stays on the hill: ' +
'c11-moss-here or c11-moss-kept), s if Sable is ' +
'bonded, c if corvinGate = family; with none, plain s10-foot (only “Just me”). On the keep route (keptStone) Moss ' +
'stays in the world even when mossFaded is true, and walk = moss there always ends in end-epi-walk-moss-stayed ' +
'(campaign-book3.ts), faded or not; on unmade routes it ends in end-epi-walk-moss. The quest lists s10-foot-msc (all ' +
```

**H2. `side-stories-main.ts`, S10 / S9 (confirmation only, no change needed).** Checked against the
side fixer's current text. `S10_LETTER` ("Somebody brought it down at first light.") now holds in
every walk: in the Corvin walk the epilogue says he fetched it at first light. There is no need to
"align c12-walk-corvin to the cottage-door hook": its lantern stays at the top, and only the epilogue
names the hook. `s9-ask` "I'll stand here till first light…" is what `c11-gate`'s "He said till first
light" relies on. If that line is ever reverted, `c11-gate` must change too.

**H3. Learning Grove (`edu-*.ts`, both bands).** Add entries for the 5 new scenes above. Mirror the
text changes listed. `chorus` is a declared campaign speaker, so mirrored song lines can keep it.
`c9-open-sold` has the same choices as `c9-open`. `end-hazels-grove-open` differs from
`end-hazels-grove` only in its second line. Until this is done, content-check reports these 10
problems: `edu sprout|reader: missing c5-considered, c9-open-sold, c11-moss-kept, c11-moss-passed,
end-hazels-grove-open`.

## 4. Prompt edits (`/mnt/user-data/outputs/grove-backlog-prompt.md`)

**P1. Part I intro and CV1** (around lines 1356–1374).

- Old: `- **Side stories:** three of the ten change the campaign; the other seven are for fun.`
  New: `- **Side stories:** 22 are scripted. Five change the campaign (S2, S9, S10, S13, S19); the other 17 are for fun. Part M adds S23–S31, three of which (S23, S26, S27) also change it: 8 of 31 in all.`
- Old:
  ```
  - **Scripts:** the full scripts are in the content pack: `campaign-book1.ts`–`campaign-book3.ts`,
    `campaign.ts`, and the three side-story files.
  ```
  New:
  ```
  - **Scripts:** the full scripts are in the content pack: `campaign-book1.ts`–`campaign-book3.ts`,
    `campaign.ts`, and the seven side-story files (`side-stories-main`, `-fun`, `-fun-2`, `-new-1` to `-new-4`).
  ```
- Old:
  ```
  2. Add `CAMPAIGN_SPEAKERS` (Wisp) to `SPEAKERS`.
  ```
  New:
  ```
  2. Add `CAMPAIGN_SPEAKERS` (Wisp, and `chorus` for the Lantern Song) to `SPEAKERS`.
  ```
- Old:
  ```
  5. Wire S2, S9 and S10 next, because the campaign reads their flags. A missing flag must fall back
     to the "never met / not started / walk alone" lines.
  6. Add tests for `endingFor`, one per ending, and one each for the Long Night branches: Wisp,
     Moss returns, Moss doesn't, and kept stone.
  ```
  New:
  ```
  5. Wire S2, S9, S10, S13 and S19 next, and set `s4Done`, `s5Done` and `s8Reunited`, because the
     campaign reads them. A missing flag must fall back to the "never met / not started / walk alone"
     lines.
  6. Add tests for `endingFor`, one per ending, and one each for the Long Night branches: Wisp,
     Moss returns, Moss doesn't, and kept stone. Include Hazel's Grove with "Open": bonded Sable,
     loved Moss, reconciled Corvin and `letThemGo` give `hazels-grove` and play
     `end-hazels-grove-open`.
  7. Chapter 11 spans a few days. Hold `c11-close` until `threeFriends` is met and S9 has had its
     chance (`s9-ask` seen, or `keptStone`), so it falls on the eve of chapter 12. Then `c11-gate`
     plays (only if `s9-ask` was seen), then S10's night scene, then chapter 12.
  ```

**P2. Part J** (around line 1805). Old: `It Sunny stays\nadults only and has none;` New:
`It's Always Sunny stays\nadults-only and has no educational version;`

**P3. Part K** (around lines 1883–1906).

- Running-gag cell, old: `Dumpling, a Nubbin who bows at everything, including the moon`
  New: `Dumpling, a Nubbin who copies whatever Hana does, badly (one bow, once, to the moon; never a habit)`
- Quests cell, old: `LJ6 Floating Lanterns (tōrō nagashi)`
  New: `LJ6 Floating Lanterns (Hana's family's tōrō nagashi for her ojīchan)`
- Hard things, old: `It's said plainly, and in LJ6 she floats a\nlantern to remember him.`
  New: `It's said plainly, and in LJ6 she floats a\nlantern to remember him, as her family does at Obon. Tōrō nagashi is a Buddhist rite for the dead, so it is shown as Hana's family custom, which the player is invited to share, never as a game activity, a minigame or a reward.`
- Add at the end of "How accuracy was protected": `- Verified in review: Ori means "my light"; the alef-bet has 22 letters plus 5 final forms; Tu BiShvat and the Hepburn macrons are correct.`

**P4. Voice-over** (after the "Rule: only characters speak." bullet, around line 1934). Add:
```
- **Hesitations.** The scripts use the single character "…" (U+2026). The pipeline treats "…" and "..." the same, as a hesitation; a line that is only "…" is a silent beat.
- **The player is not voiced.** Lines spoken by `you` stay on screen as text and become a short beat in audio, because the player's voice is never set.
- **Songs are music cues.** Lines whose speaker is `chorus` (the Lantern Song in `c4-close` and `c10-vigil`), together with Luna's sung lead-in line, are one music cue in `voiceover/script.json` (for example `"cue": "lantern-song"`), not voiced lines.
```

## 5. Engine backlog

**E1. `endingFor` and ending scenes (canon 24), in `src/sim/campaign.ts`.**

- Order unchanged: collector → empty-lantern → eternal-dawn → wild-grove → hazels-grove →
  moss-sleeps → shadow-keeper → long-road.
- `collector`: `(soldNubbin && !boughtBack) || keptStone`. The current code lacks `keptStone`.
- `hazels-grove`: `bonded && corvin === 'reconciled' && !mossFaded`. It must **not** test
  `finalChoice`; the current code already doesn't, so keep it that way. `mossFaded` = affection
  under 40 at the start of chapter 10, or Moss carried the stone in and `mossReturned` is false.
- Ending scene: when the ending is `hazels-grove` and `letThemGo` is set, queue
  `end-hazels-grove-open` instead of `end-hazels-grove`, then the epilogues and
  `end-hazels-grove-last` as usual (see the `end-hazels-grove` note).
- Tests (`tests/sim/campaign.test.ts`, "decides endings from flags in priority order", plus a run test):
  1. Bonded Sable, `corvin` reconciled, `mossFaded` false, `finalChoice` free and `letThemGo` true →
     `hazels-grove`, and the scene seen is `end-hazels-grove-open`, not `end-hazels-grove`.
  2. The same with `keep` → `hazels-grove` via `end-hazels-grove`.
  3. `freedByForce` and `letThemGo` with a bonded Sable → `wild-grove` (checked before hazels-grove).
  4. A bonded Sable can never reach `long-road`: bargained → `shadow-keeper`; faded → `moss-sleeps`.
  5. `keptStone` → `collector`.

**E2. Chapter 11 close (canon 4).** In `stepCampaign`, for chapter 11, don't queue `c11-close` when
`threeFriends` is met unless S9 has had its chance: `s9-ask` is in `seen`, or `keptStone` is true. The
goal is to make `s9-ask`, `s9-word`, `c11-close` and `c11-gate` fall on one evening (the eve of chapter
12). So also don't offer S9's step-2 dusk check (`talk:corvin:gate:dusk-2`) until `threeFriends` is
met. While chapter 11 is held, the journal hint should point at S9's current step.

**E3. `c11-gate` condition.** Play `c11-gate` after `c11-close` only if `s9-ask` has been seen. It no
longer keys on `s9Started` alone. After it, S10's `s10-night` / `s10-night-told`, then chapter 12.
S9's dawn gate scene still plays before `c12-open`.

**E4. Variant routing (new ids; full rules are in the notes).**

- Chapter 9 opening: on the Collector route (`soldNubbin && !boughtBack`), use `c9-open-sold` in place
  of `c9-open`. In `applyChoice`, run the `c9-open` bargain side effect for `c9-open-sold` too.
- Shard scene: `corvin` reconciled → `c9-shard-reconciled` (Collector route included); bargained →
  `-bargained`; forced → `-collector` on the Collector route, otherwise `-forced`.
- `c5-considered`: queue straight after `c5-circuit` (before the race) if `corvinOffer === 'considered'`.
- Chapter 11 Moss add-on: keep route → `c11-moss-kept`; Moss in the world on an unmade route →
  `c11-moss-here`; `c10-moss-fades` played → `c11-moss-passed`; `c10-bank-moss-gone` played →
  `c11-moss-gone`.
- Walk epilogue: walk = moss → `end-epi-walk-moss-stayed` if `keptStone`, else `end-epi-walk-moss`.

**E5. `chorus` speaker.** `CAMPAIGN_SPEAKERS` now includes `chorus` (name "Everyone", kind other). In
`ui/dialogue.ts`, show chorus lines with no portrait, in italics, and give them no per-line voice
clip (P4).

## 6. For Maor

- **content-check reports `problems: 10`** after my changes (it was 0 before). All 10 are
  "edu missing" for the 5 new variant scenes, in both bands. The Learning Grove pass clears them (H3).
  tsc and eslint pass.
- **Adaptations worth a look:**
  - In the Corvin walk, Hazel's lantern now stays burning on the hill, as in every other walk, and
    Corvin fetches it down at first light. This keeps c12-close as one scene.
  - `c9-shard-collector` now only ever follows *force*. That is the only Collector case left: reconciled
    gets the remorseful scene, and bargaining leaves the route. It was rewritten so Corvin sees his own
    method in you.
  - `c10-close`, `c11-sable` and `c10-moss-light` use route-neutral wording instead of new variants.
- **Decision proposed (P4):** `you` lines are not voiced. Say if you'd rather voice them.
- **Part K (P3):** changing Dumpling's gag and framing LJ6 as Hana's family custom also needs a
  check of `lang-japanese.ts`, which I didn't touch or review.
- **Conflict with the side fixer (H1):** its S10 note sends keep route + not-faded Moss to
  `end-epi-walk-moss`, where he "came down in the spring". That contradicts `end-collector-kept`. My
  rule is keptStone → `-moss-stayed`.
- **Unverified quotes:** none of the seven is in the campaign review, so there is nothing to list from this area.

---

# log-side
## Fix log: side stories (S1–S22)

Files (all in `REPO/src/content/`): `side-stories-main.ts`, `side-stories-fun.ts`, `side-stories-fun-2.ts`,
`side-stories-new-1.ts` to `side-stories-new-4.ts`. Review: `SCRATCH/part-m/review-side.md`.
Originals are backed up in `SCRATCH/fix/side-orig/`.

Counts: **38 fixed, 9 adapted, 0 skipped** (47 review items), plus 7 canon alignments the review did not raise.

## 1. Items

### Must fix

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| M1 | Moss choosing young Hazel told twice, and the two versions disagree | fun (S1 `s1-hazel`), main (S10 `s10-wish3`) | fixed | Used the reviewer's three lines. Coat is now "too big for her" and his first words are "You'll do." Young Hazel no longer demands that he speak. I also added "She fidgeted the whole time, and never once asked me to." (canon 1). S10 now says "A young woman". The pair "She thinks she invented it" / "I thought I'd made it up" is kept. |
| M2 | Corvin's first arrival happens twice; `s9-ask` timing; S9 can be lost | main (S9) | adapted | My side: `s9-ask` now has "I'll stand here till first light. If it's still shut then…". I added an exit line ("He lets go of the bar and steps back into the lane… He doesn't go far.") so that `c11-gate`'s "he is back at the gate" is literally true. The S9 notes now say `s9-dusk` is his first arrival, and set out the eve-of-chapter-12 sequence. The campaign half is in hand-off H1. Holding `c11-close` is engine backlog E1. |
| M3 | S10 "told" night has the Keepers sleeping by the pond | main (`S10_NIGHT_TOLD`) | adapted | Used the reviewer's first two lines. The last line is now "Down the lane, somebody is crying…" instead of "At the gate". That night Corvin stands at the gate (canon 5), so the reviewer's wording would put the crier next to him. |
| M4 | S8's ending repeats `c10-bramble`; Hazel's surprise; ordering | fun-2 (S8) | adapted | New variant `s8-complete-dawn`, built from the reviewer's opening (split into two lines). Both versions now share `S8_COMPLETE_TAIL`. The file had no variants export, so I added `SIDE_STORIES_FUN_2_VARIANTS` on the main/new-3 pattern (index wiring is hand-off H2). Timing: the reviewer said "only after `c11-close`". Canon 4 puts S8's close inside chapter 11's few days, and `c11-close` is now the eve of chapter 12, so S8 closes **before** `c11-close`. `c11-close` then needs a variant line for an empty arm (hand-off H3). |
| M5 | Ember's age: 12 should be 15 | fun-2 (S6) | fixed | `s6-register` and `s6-complete`. A note line was added too. |
| M6 | S21 names Moss before chapter 4 | new-4 (S21) | fixed | Used the reviewer's lines. Two of the lines became too long, so I split them: "…full kettle is Clank." / "He is holding the little grey watcher from the hill out in front of him, like a pie."; "Clank goes over the edge." / "The little grey one leaves his hands…". "Older than the trees" is gone. The notes now say the narration never names him. |
| M7 | S14 "a letter, same as everyone" | new-4 (S14) | fixed | Used the reviewer's line. `s14-gate` now says "takes the note out of her welly, still folded". The notes now say Hazel left one letter (to you) and Tilly a short note (canon 8). |

### Should fix

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| S1 | `s10-wish2` "never once watched one" contradicts S3 | main | fixed | Reviewer's line, verbatim. |
| S2 | Hazel's lantern hook in `S10_LETTER` | main | adapted | Now "Her lantern is back on the hook by the cottage door. Somebody brought it down at first light." / "You haven't lit it yet." I used "at first light" instead of "in the night" because `c12-close` has the lantern burning on the hill all night. The campaign fixer has already moved `end-epi-walk-corvin` to the cottage door and rewritten `c12-walk-corvin` (he leaves the lantern burning with her), so it matches. |
| S3 | `s10-night` plays too early | main | fixed | The S10 notes now say step 4's scene plays on the eve of chapter 12, after `c11-close` (and after `c11-gate`), as an exception to the timing rule. Engine backlog E3. |
| S4 | S18 "register" choice puts the register in the museum | new-2 (S18), main (S10), fun-2 (S6) | fixed | Added Delve's "On loan. It goes home the moment the family wants it. I'll carry it myself." The S18 notes explain the loan. The S10 notes add the reviewer's hint variant. The S6 notes add the same hint, plus line variants for Fern's last line in `s6-fern` (index 8) and the opening line of `s6-register` (index 0), since both mention the jam shelf. Engine backlog E8. |
| S5 | `s13-letter-given`: "in your coat" against the tin box | new-3 | fixed | Reviewer's line, verbatim. |
| S6 | `s19-question`: "the way you skipped to it" | new-3 | fixed | Reviewer's line, verbatim. |
| S7 | S19 never opens when Moss is gone and Sable is not bonded | new-3 | fixed | Took the reviewer's first option, a third short version with you and Marina only. Five new variants: `s19-warmth-alone` (sets `s19-with = alone`), `s19-climb-alone`, `s19-hollow-alone`, `s19-question-alone` and `s19-fade-alone`, plus `S19_CHOICES_ALONE`. You answer "No." / "They're well." yourself, and "Badly. With great enthusiasm." is kept. Notes, header and flag comment are updated. Engine backlog E4. |
| S8 | Nova's history and the youngest's timing in S8 | fun-2 | fixed | All three reviewer lines, verbatim. Added a NOVA note (canon 9). |
| S9 | S7's tied shoelace closes a joke that has to stay open | fun-2 | fixed | Reviewer's line. Both notes passages are updated so the joke stays open for chapter 10 and S10's letter. |
| S10 | "Dew" at a midwinter dawn in `S9_GATE_OPEN` | main | adapted | The reviewer's text, split into two lines to keep each to two sentences: "Corvin is at the gate. He has been there all night." / "There is frost on his shoulders, the ordinary kind that melts." |
| S11 | `S9_FAMILY_EXTRA` "People have been coming up to my gate" | main | fixed | Reviewer's line. The notes now say the lines hold for any two conditions. |
| S12 | S22 "as far as the Ridge once" against the three-stone cairn | new-3 | fixed | Reviewer's line, verbatim. |
| S13 | S22 summit copies `s9-ask` | new-3 | fixed | Reviewer's line, verbatim. |
| S14 | S17 ordinary frost in chapter 7 | new-2 | fixed | Reviewer's line. Added a SEASON note. |
| S15 | S3 "Ten heads" | fun | fixed | Now "Five heads… five". |
| S16 | S11's ladybirds appear from nowhere | new-1 | fixed | Added the reviewer's Clover line after Byte's "It can be contained." I also changed the payoff line in `s11-ladybirds` to "Off you go. Every egg you can find. Be as rude as you like." so it doesn't repeat the setup. |
| S17 | S4 and S5 both open at the gate after `c5-close` | fun (S4, S5), new-1 (S11, S15 triggers) | adapted | `c5-close` starts chapter 6 at once (`sim/campaign.ts`, `beginChapter`), and `c6-open` is Fossil's farewell. That makes the reviewer's "morning after `c5-close`" too late for S5. S5 now opens "the first morning after `c5-open`" and must finish before `c5-close`. S4 opens after `c5-close`, once `c6-open` has played. S11 and S15 now wait for a later morning than S5. Notes are updated. Engine backlog E6 includes an optional hold on `c5-close` while S5 is open. |
| S18 | S5 "She's thinning. Not the glow. The other one." | fun | fixed | Reviewer's line, verbatim. |
| S19 | 46 long narration lines | main, new-1 to new-4 | fixed | A script split every narrator line with three or more sentences and over 110 characters at the sentence boundary nearest the middle. That covered 44 lines. I split Dashwood's card line by hand, keeping the quoted card whole, and split the two S21 lines in M6. A re-scan now finds 0. Index-based notes were checked: S20's `#5` note now names `#6` as well. S3's index-5 note is in `fun`, which was not split. |
| S20 | The third rule is quoted in 9 stories; S14's choices are not real choices | all | adapted | Canon 14 caps it at about four, so it is now in exactly four: S1 (`s1-hazel`), S9 (`s9-yours`), S10 (`s10-wish3`) and S14 (the "sit" choice only). Removed the name from S5 (`s5-secret`), S6 (`s6-kitchen`), S7 (choice label), S9 (`s9-trowel` "sit" choice), S12 (step 3 hint), S19 (`s19-fade`, `s19-fade-sable`) and S21 (choice label and line; it now reads "No. I'm just here." / "Here for what?"). In S14, "roll" now ends with Tilly reading the torn die ("The dice says… the dragon allows it."). "Ask" ends with Tilly working it out herself ("…She wants someone to sit with her. Fine. FINE."). So the choice decides who ends the game: you, the dice or Tilly. Tilly's own "Rule three: there are snacks" is her game's rule and is kept. |
| S21 | `end-epi-walk-moss-stayed` can never play | main (S10 notes) | fixed | Took the reviewer's second option. The `m` letter for `s10-foot-*` now uses `c11-moss-here`'s test: `mossReturned`, or the wisp route with `mossFaded` false, or the keep route. On the keep route Moss is in the world even when faded, so `walk = moss` there reaches `-moss-stayed`. The campaign note already says "possible only on the keep route", so that file needs no change. |

### Nice to have

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| N1 | main.ts header says "three" | main | fixed | Now points to S13/S19 in new-3 and to the Part M stories. Also adds `visitors` to the family list. |
| N2 | S2 "So is the fruit from the night before" | main | fixed | Sentence cut. |
| N3 | "is sat" in narration | new-3 | fixed | Changed at l.245, 601, 1106 and 1141 ("sits" / "were sitting"). Tobin's "found him sat" is speech, so it is kept. |
| N4 | Repeated simile | new-1 (S16) | fixed | Now "like a flag left out all summer". |
| N5 | S3 Moot "bench in the gap" | fun | adapted | Now "on the bench by the pond, between the two groups. Sun and Moon come to look, and then everyone." I shortened it so it stays one line and S3's index-5 note still holds. |
| N6 | S3 truce "After the longest night" | fun | fixed | "After midwinter." |
| N7 | S14 "twenty-two pence" | new-4 | fixed | "two Shells, two, two, two… forever." |
| N8 | "HERE BE GRAN" | new-4 | fixed | "HERE BE HAZEL. SHE IS ALOWED." Also changed in the tabletop reward description. |
| N9 | S14 gate "It never does, for anybody" | new-4 | fixed | "It hardly ever does." |
| N10 | S17 "Grief doesn't keep a calendar" | new-2 | fixed | "Grief keeps a better calendar than I do." It stays in Luna's line, which now ends with "What do we do?". |
| N11 | S17 nursery choice never pays off | new-2 | adapted | new-2 has no variants array, so I followed `fun.ts`'s S3 pattern: a notes-level line insertion after index 2 of `s17-complete`. With open: "On the nursery roof a lantern burns every night now. Some nights a grey shape sits beside it, very still." With shut: "Some nights a grey shape sits on the cottage roof and looks down the chimney. Luna leaves a mouse on the step." Engine backlog E9. |
| N12 | S12 Queen-Mother "Don't choose for it" | new-2 | fixed | The labels are now Solo's decisions ("Solo goes home to the hum. You nod." etc.). Added a narration line before the choices: "You don't tell it. You sit down on the bank beside the teacup, and wait for it to choose." In "gaps", Solo now speaks the hum line instead of you. Choice ids are unchanged. |
| N13 | Bramble borrows Sable's lean | fun-2 | fixed | "Bramble sits down on Fern's boots, both of them, and stays there." |
| N14 | S5 "oldest" against "first" tree | fun | fixed | Now "first" (matches the check `shake:tree:hazels-first`). |
| N15 | S6 register cover "EGGS. Given away." | fun-2 | fixed | Cover is "EGGS." A new line follows: "Halfway through, a section starts under a heading underlined twice: “Given away.”" |
| N16 | S20 Bodge replacement for line #3 | new-4 | fixed | Added `s20-declaration#3 → “Sparks’s other cousin has come for the winter holidays…”` to the notes. |
| N17 | S22 post-game close rule | new-3 | fixed | Now closes in chapter 11. If unfinished when chapter 12 begins, it closes with no rewards. |
| N18 | Reward ids equal to scene ids | main, fun-2, new-1 | fixed | `s10-letter-reward`, `s6-whistle-reward`, `s11-ladybirds-reward`, `s15-jackpot-reward`. No code outside the content files refers to them; the `edu-*` copies are for the mirror pass. |
| N19 | Pip and the painted egg | new-1 | fixed | `s15-complete` gains "Dashwood pressed the painted egg into Pip's hands on his way out. She hasn't put it down since." Notes updated. |

### Canon alignments the review did not raise

| # | Item | File | Status | Note |
| --- | --- | --- | --- | --- |
| C1 | Canon 10, ears: Bramble had a "torn ear" | fun-2 (S8) | fixed | `s8-ring`, `s8-reunion`, `s8-complete` / tail and notes now say her left ear folds over at the tip. `s8-edge` now gives the youngest the same fold ("like hers"), which sets up Fern knowing the ear at dawn. Wisp keeps his torn ear. |
| C2 | Canon 11: S3 opens in chapter 4 | fun (S3) | fixed | Trigger, header and notes updated. The quest opens at `c4-close`, where the two knots seed the feud (journal only). `s3-stands` still waits for the Circuit in chapter 5. Engine backlog E7. |
| C3 | Canon 27: S9 family count includes `visitors` | main | fixed | Header, notes ("six conditions") and the flags list. Engine backlog E11. |
| C4 | Canon 16: Wisp lives under the cottage step | main (S2) | fixed | Reward description and a HOME note. The bathhouse lines stay, now marked as optional decor. |
| C5 | Canon 22: no daily limits | new-1 (S11), new-3 (S13) | fixed | Grafting cuttings: "as many as you like; no daily limit". Tobin's tales: "as often as you like". |
| C6 | Canon 6: the Wellspring's water never freezes | fun (S4 notes) | fixed | "frost on the spring's rim (the water itself never freezes)". |
| C7 | Canon 1 detail | fun (S1) | fixed | "She fidgeted the whole time, and never once asked me to." (part of M1). |

## 2. Scenes changed (for the Learning Grove mirror)

Text changed (lines edited, added or split; choice labels count):

- **side-stories-main.ts:** `s2-fruit`, `s9-trowel`, `s9-ask`, `s9-gate`, `s9-gate-family` (both via `S9_GATE_OPEN`; `-family` also via `S9_FAMILY_EXTRA`), `s10-step`, `s10-wish2`, `s10-wish3`, `s10-night-told`, `s10-letter`, `s10-letter-told` (both via `S10_LETTER`).
- **side-stories-fun.ts:** `s1-hazel`, `s3-stands`, `s3-truce`, `s3-moot`, `s5-list`, `s5-secret`.
- **side-stories-fun-2.ts:** `s6-kitchen`, `s6-register`, `s6-complete`, `s7-week` (choice label only), `s7-complete`, `s8-further`, `s8-ring`, `s8-edge`, `s8-gap`, `s8-reunion`, `s8-one-short`, `s8-complete`.
- **side-stories-new-1.ts:** `s11-ember`, `s11-jar`, `s11-beetle`, `s11-dusk`, `s11-ladybirds`, `s15-wagon`, `s15-tally`, `s15-complete`, `s16-yard`, `s16-notes`, `s16-question`, `s16-week`, `s16-complete`.
- **side-stories-new-2.ts:** `s12-settled` (labels, a new line, the gaps line), `s17-missing`, `s17-wild`, `s17-feathers`, `s18-fossils`, `s18-heart`, `s18-door`. Step hint changed: `s12-step3`.
- **side-stories-new-3.ts:** `s13-tobin`, `s13-letter-given`, `s13-settled-grave`, `s19-warmth`, `s19-hollow`, `s19-question`, `s19-fade`, `s19-complete`, `s19-warmth-sable`, `s19-hollow-sable`, `s19-question-sable`, `s19-fade-sable`, `s22-foot`, `s22-chimney-top`, `s22-summit`, `end-epi-mill-burned`, `end-epi-mill-grave`, `end-epi-cinder-forgiven`, `end-epi-cinder-remembered`.
- **side-stories-new-4.ts:** `s14-bog`, `s14-toad`, `s14-sparks`, `s14-gate`, `s14-lair`, `s14-dragon`, `s14-complete`, `s20-declaration`, `s20-blizzard`, `s20-count`, `s21-help`, `s21-moss`, `s21-shed`, `s21-down`, `s21-complete`.

**New scene ids:**

- `s8-complete-dawn` (fun-2, `SIDE_STORIES_FUN_2_VARIANTS`).
- `s19-warmth-alone`, `s19-climb-alone`, `s19-hollow-alone`, `s19-question-alone`, `s19-fade-alone` (new-3, `SIDE_STORIES_NEW_3_VARIANTS`).

New flag value: `s19-with = alone`. Choice ids are unchanged everywhere.

The content-check now reports the five `s19-*-alone` ids as missing in both bands: 10 problems until the mirror pass adds them. `s8-complete-dawn` will show up as missing too, once H2 and E5 wire it in.

## 3. Hand-offs

**H1. campaign-book3.ts, `c11-gate` (canon 5), for the campaign fixer.** My side assumes this:

- `c11-gate` plays only on the night of `s9-ask` (the eve of chapter 12), after `c11-close`.
- It is a return, not a discovery. It opens "When you look up from the pond, he is back at the gate." He tries the latch once, for form's sake, and it sticks.
- Hazel says it's your gate now and she has done her part, not "Leave him… till morning".
- Corvin stays at the gate till first light, matching `s9-ask` ("I'll stand here till first light") and `s9-gate` ("He has been there all night." / "frost on his shoulders").
- No flags; the gate stays shut in every branch.
- `s9-ask` now ends with Corvin stepping back into the lane, "He doesn't go far", so "back at the gate" is literally true.

I checked the current campaign file, and it already matches this (l.831–837: "He tries the latch once, for form's sake, and it sticks… Don't look at me, love. I've done my part. It's your gate now." / "He said till first light."). No change needed, provided it stays that way.

**H2. index.ts (content), export the new variants array.**

- Old: `export { SIDE_STORIES_FUN_2 } from './side-stories-fun-2';`
- New: `export { SIDE_STORIES_FUN_2, SIDE_STORIES_FUN_2_VARIANTS } from './side-stories-fun-2';`

**H3. campaign-book3.ts, `c11-close`, the thin Nubbin after S8.** S8's complete scene now plays inside chapter 11's days, before `c11-close`, and you carry the youngest home to the ring. So `c11-close` needs a variant line for when `s8Done` is true:

- Old (when `s8Done`): `N('The thin grey Nubbin wakes, looks at you, and goes back to sleep.'),`
- New (when `s8Done`): `N('Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.'),`

The original line stays when S8 is not done. The note for `c11-close` should mention the swap.

**H4. campaign-book3.ts, `c10-bramble` (canon 10 and S8).** I assume:

- `c10-bramble` plays at dawn only if `s8Reunited`.
- Fern knows the youngest by the ear that folds over at the tip, not a torn ear.
- Hazel gives her "Found her at the edge of the ring… Her mother runs the place… I gather you've met" there.

`s8-complete-dawn` therefore never repeats that account or Hazel's surprise. I checked the current campaign file, and it already matches this (l.737–741). No change needed.

Already aligned, no action: `end-epi-walk-corvin` and `c12-walk-corvin` (the lantern hook). The campaign fixer moved the hook to the cottage door, and Corvin leaves the lantern burning on the hill.

## 4. Prompt edits

None needed. I checked the bible rows for S3 (ch4 → ch11), S8, S9 (six family conditions), S10, S19 ("only if the stone was unmade", which now holds in every such run thanks to the alone version) and S22 (closes in ch11). All of them already agree with the fixed files.

## 5. Engine backlog

1. **E1. Chapter 11's close waits for S9 (canon 4).** In `sim/campaign.ts`, chapter 11's step-1 → step-2 transition must not queue `c11-close` until `threeFriends` is met **and** either `s9-ask` has been seen, or S9 cannot start (`keptStone` true).
2. **E2. `c11-gate` sequencing.** Queue `c11-gate` straight after `c11-close`, only when `s9-ask` has been seen (and so `s9Started` is set). Never with `keptStone`.
3. **E3. S10 step 4's scene.** `s10-night` (with `hazel = secret`) or `s10-night-told` (with `hazel = told`) does not play when step 3's check is met. Hold it until `c11-close` (and `c11-gate`, if queued) has been seen on the eve of chapter 12, then play it before chapter 12 begins. If S10 is still on wishes 1–3 at that point, the wishes lapse and this scene plays anyway.
4. **E4. S19's window and version.** Open S19 in chapter 11 whenever `keptStone` is false. Pick the version as follows:
   - **moss** if Moss is in the world (`mossReturned`, or the wisp route with `mossFaded` false). Play the scenes as written; `s19-warmth` sets `s19-with = moss`.
   - Otherwise **sable**, if Sable is bonded: play the `-sable` variants.
   - Otherwise **alone**: play the `-alone` variants, replacing `s19-warmth`, `s19-climb`, `s19-hollow`, `s19-question` and `s19-fade`.
   - `s19-marina`, `s19-sit`, `s19-after` and `s19-complete` are shared.
5. **E5. S8's complete scene.**
   - Play `s8-complete-dawn` instead of `s8-complete` when `c10-bramble` has been seen.
   - Play either one inside chapter 11, before `c11-close`.
   - Wire `SIDE_STORIES_FUN_2_VARIANTS` into the side-story runner's variant lookup, and into `tests/tools/content-check.ts`: the variant-clash loop (l.61), the `mainScenes` map (l.86) and the campaign-clash check.
6. **E6. Chapter 5/6 openings.**
   - S5 triggers on the first morning after `c5-open`.
   - S11 and S15 trigger on later mornings, not S5's.
   - S4 triggers after `c5-close`, once `c6-open` has been seen.
   - Optional, for Maor: hold `c5-close` while S5 is open, since `c6-open` is Fossil's farewell and would end S5 unfinished.
7. **E7. S3 opening.** Activate S3 (journal entry) at `c4-close`. Its first scene, `s3-stands`, waits for the player's arrival at the Circuit after `c5-open`.
8. **E8. The register on loan.** When `s18-centre = register` and S6 step 2 or S10 step 1 starts:
   - Place the register on the cottage table.
   - Use the hint "Professor Delve has brought the register back from the museum. It's on the cottage table."
   - For S6, swap `s6-fern` line 8 and `s6-register` line 0 as the S6 notes give them.
9. **E9. S17 nursery payoff.** In `s17-complete`, insert one narrator line after index 2, chosen by `s17-nursery`; the texts are in the S17 notes.
10. **E10. S10's walk choices.** Moss's letter `m` in `s10-foot-*` uses `c11-moss-here`'s "Moss in the world" test (see the S10 notes, variant 3), including the keep route when `mossFaded` is true.
11. **E11. S9 family count.** Count six conditions: `corvin` = reconciled, `s3Done`, `s6Done`, `s8Done`, `millLetter` = kept and `visitors`. Two or more plays `s9-gate-family`.
12. **E12. Reward ids.** If any runtime code keys on reward ids, use the renamed ones: `s6-whistle-reward`, `s10-letter-reward`, `s11-ladybirds-reward` and `s15-jackpot-reward`.
13. **E13. Wisp's home.** If spared or Sable's choice, Wisp's stray spot is under the cottage step once S2 completes.

## 6. For Maor

1. **Checks.**
   - `tsc` passes. `eslint` passes on all seven files; I removed an unused `Y` in new-2 that one of my edits left behind.
   - `content-check` reports **problems: 20**:
     - 10 are mine: the five new `s19-*-alone` scenes missing from both Learning Grove bands, until the mirror pass adds them.
     - 10 come from the campaign fixer's new scenes (`c5-considered`, `c9-open-sold`, `c11-moss-kept`, `c11-moss-passed`, `end-hazels-grove-open`), also missing in both bands.
   - When I started, it reported 7 problems ("campaign c4-close: undeclared speaker chorus"). Those have since been fixed by another pass.
2. **Canon 17 (animals and Nubbins don't speak) clashes with three stories the review didn't flag.** I left them alone, since fixing them would mean rewriting the stories:
   - S12's Thrums, Solo and the Queen-Mother are Nubbins and speak whole sentences.
   - S18's Professor Delve is a talking mole.
   - S15's Jackpot is a talking parrot, though a brass, clockwork one.

   Nightjar only hoots, which is fine. Do you want S12 and S18 reworked, or an exception added to canon 17?
3. **Name collisions with the Part M cast (canon 28).** S20 has **Wren**, a small child in the snow-fort war, while S26's Wren is Tobin's granddaughter. S15 has **Pip**, a valley girl, while S23's Pip is an echo. I haven't renamed them; the Learning Grove copies use them too. Rename the S15/S20 ones, or make S20's Wren the S26 Wren?
4. **S5's timing.** The engine starts chapter 6 the moment `c5-close` plays, and `c6-open` is Fossil's farewell. So S5 can't open "after `c5-close`" as the review suggested; it now opens the first morning after `c5-open`. Would you like the engine to hold `c5-close` while S5 is open (E6)?
5. **S8's close goes before `c11-close`, not after** (M4), because canon 4 lists it inside chapter 11's days. That needs the small `c11-close` line swap in H3.
6. **The third rule is now in exactly four side stories:** S1, S9 (`s9-yours`), S10 and S14. S5, S6, S7, S12, S19 and S21 still show the behaviour (someone sits and waits) but no longer name it.
7. **"HERE BE GRAN" is now "HERE BE HAZEL. SHE IS ALOWED."** That is one of the protected best moments, renamed as the review suggested.
8. **Unverified quotes:** this review lists none.

---

# log-fun
## Fix log: fun quests (Python, Bean, Sunny, Avatar), readers, results, types

Review: `part-m/review-fun.md`. Files edited, all in `REPO/src/content/`: quests-python.ts,
quests-bean.ts, quests-sunny.ts, quests-avatar.ts, readers.ts, results.ts, types.ts.
Nothing else in the repo was edited (content-check.ts was not touched; it didn't need to be).

**Checks** (run from REPO, before and after; all passed before I started):

- `npx tsc --noEmit -p .`: passes, no errors.
- `npx eslint` on my seven files: passes, no warnings.
- `npx tsx tests/tools/content-check.ts`: `problems: 0`. Lines went from 11379 to 11383 and results from 370 to 371.

Status key: **fixed** = done as suggested; **adapted** = done with a change (reason in the
note); **skipped** = no edit, with the reason; **handed off** = the item sits wholly outside my
files, so the exact text is under Prompt edits or Hand-offs.

## 1. Items

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| 1 | Q62: Pemba "wakes from an iceberg" as if new | quests-avatar.ts | fixed | Now a mishap: Nalu says "Pemba’s inside! He was meditating on the pond last night and… kept going."; done line "Hi! Did I miss breakfast? Do you have any penguins?"; the three origin lines are replaced with the reviewer's lines. Also changed the goal to "Break Pemba out of the ice.", Tuk's choice line ("if he’s a monster" became "I’m telling him whose fault this was"), Tuk's "frozen for who knows how long" (now "frozen solid all night"), Pemba's "as I was falling asleep" (now "while I was meditating") and the complete line "The sad things can come tomorrow…" (now "Thanks for getting me out. And for the penguin. Mostly the penguin."). Added a note. The trigger changed from "The first snow day" to "Any snow day", because the first snow lands near midwinter, inside the chapter 9–11 block, and the quest could otherwise be lost. Table row: Prompt edit P8. |
| 2 | Avatar quests have no `requires` | quests-avatar.ts | fixed | Q47–Q65 `requires: ['Q46']`; Q49 `['Q46','Q64']`; Q55 `['Q46','Q56','Q64']`; Q64 `['Q46','Q56']`. Added the "Order:" line to the header. |
| 3 | Chapter 9–11 rule only on Python | quests-bean.ts, quests-sunny.ts, quests-avatar.ts | fixed | `WHEN_SUFFIX` is appended to all 45 triggers (Bean 10, Sunny 15, Avatar 20). Bean and Avatar use `' (never during Chapters 9–11)'`, as Python does. Sunny's `when` strings are full sentences ending in a full stop, so its suffix is `' Never during Chapters 9–11.'`. Each header now mentions the rule. Part H sentence: Prompt edit P9. |
| 4 | Sunny adults-only not enforced | quests-sunny.ts, types.ts | adapted | Q31 `when` now reads "…and only if Settings › Content › “Mature content” is set to 18+ (off by default)…". I named one shared content setting rather than the reviewer's pack-only "Puddle’s Pub" toggle, because canon 20 puts all teen and adult content behind *a* content setting. Q31 notes say "Q32–Q45 inherit this gate through requires: ['Q31']", and the header has a Rating paragraph. Toggle: Engine backlog E1. Part A step 5: Prompt edit P5. |
| 5 | Speaker id `mags` in two packs | quests-python.ts | fixed | `id: 'old-mags'` and `say('old-mags')`. Documented in the Q8 notes. The edu mirrors still say `mags`: Hand-off H1. |
| 6 | "Original quotes" table uses wrong Sunny names | prompt | handed off | Prompt edit P4. |
| 7 | Q35 Dabney contradicts himself | quests-sunny.ts | fixed | "Rook’s, though. That was a strong truth. Keeper? Beat it." |
| 8 | Q36 and Q38 need Q32's goose | quests-sunny.ts | fixed | `requires: ['Q31', 'Q32']` on both. Their `when` text now says "after Q32" to match. |
| 9 | Q40 "forty damp Keepers" | quests-sunny.ts | fixed | Both lines as suggested. I also changed Dabney's "We sold tickets. Forty of them." to "Every one we printed." so the scale is consistent. |
| 10 | Q8 intro assumes Q7 and Q1 are done | quests-python.ts | fixed | Drawbridge and fence-post lines. |
| 11 | Part H quotes paragraph contradicts itself | prompt | handed off | Prompt edit P7. |
| 12 | Parts D–E intro numbering sentence | prompt | handed off | Prompt edit P1. |
| 13 | "Bohdi" reads as "Bodhi" | quests-avatar.ts | fixed | `sp('rumbold', 'King Rumbold', 'Bumi')`, with the const `RUMBOLD` and `say('rumbold')`. Title, emote label and every in-text "King Bohdi" changed. For consistency I also renamed check `fetch:bohdi-key` to `fetch:rumbold-key` and reward id `q63-bohdi-laugh` to `q63-rumbold-laugh`; nothing else references either. Part H: Prompt edit P6. Edu mirrors: Hand-off H2. |
| 14 | Island Mystic kitsch (drums, island time, totem, tiki) | readers.ts | fixed | Intro and `im-12`/`im-37` as suggested. The other drum lines (`im-03`, `im-32`) weren't flagged and were left. |
| 15 | `dr-child` implies gentle throwing is fine | readers.ts | fixed | |
| 16 | `rf-28` says "three times" for `rested:>2` | results.ts | fixed | Used the reworded text. |
| 17 | No `eternal:neutral` evolution line | results.ts | fixed | Added `ev-21`. |
| 18 | Neopia freebies "once per visit" can be farmed | results.ts | fixed | Canon 22 ("nothing once per visit") settles this, so it isn't left as an open question for Maor. Every freebie set is now once per Nubbin per life: header doc, section comment, each `screen` label and all 13 `taken` lines ("…this life" / "One spin per Nubbin, per life."). `mc-10` lost "come back next time". The Soup Kitchen is labelled "no limit", since it is need-based and isn't a reward loop. neopia-quests.ts still says once per visit: Hand-off H4. |
| 19 | Q29 backwards "T" | quests-bean.ts | fixed | "upside down" in the line, the reward and the notes. |
| 20 | Q60 "Welcome home, Lumi" before he is named | quests-avatar.ts | adapted | Added the naming line first in `q60-complete`. Pemba's optional `name` choice used to name him too, so he would have been named twice. That choice now says "Hmm. Let’s get to know it first. A name should fit." The choice id is unchanged, and the notes are updated. |
| 21 | Q53 line states the lesson | quests-avatar.ts | fixed | |
| 22 | Q51 line is awkward and states the moral | quests-avatar.ts | fixed | |
| 23 | Q20 "And now… the larch." stitches two lines | quests-python.ts | adapted | Both uses are now the attested "The larch.", said after "Number one." and after "Correct. Number two." The `childLines` swaps (#4, #9) are kept at the same indices, and the notes are updated. Quote row: Prompt edit P3. Flagged for Maor. |
| 24 | Q15 cheese-shop wording unconfirmed | quests-python.ts | skipped | Left as written for Maor to check against Flying Circus S3E7. |
| 25 | Seven quotes the reviewer couldn't verify | python, bean, sunny | skipped | Left as written, per the brief. Listed under For Maor. |
| 26 | Q9 "We can all think for ourselves!" riff | quests-python.ts | adapted | The line is in a choice's `then`, which `childLines` can't key (keys index `scene.lines` only). I rewrote it for both modes instead: "The whole crowd nods, together, in perfect time. Then it waits for you to say what to think." |
| 27 | Q37 "SUN KEEPER!" cadence | quests-sunny.ts | skipped | The reviewer says to keep it as written. |
| 28 | Q14 "Next Thursday" promises a return | quests-python.ts | fixed | Cut in both places. In `q14-sentence` the line is now "Ha! Keepers are not under investigation today. Bring us a Nubbin."; in `q14-complete` it is "Keep the chair, then. It will wait for you. Chairs are very good at waiting." |
| 29 | Q26 butter never unpacked; line explains a feeling | quests-bean.ts | fixed | |
| 30 | Q23 eyeholes cut with a spoon | quests-bean.ts | fixed | "…then cuts two neat eyeholes and a wider neck with a butter knife from his sock." |
| 31 | Q20 "Have one." | quests-python.ts | fixed | "Here. Grow your own." |
| 32 | Q59 extra line spells out the point | quests-avatar.ts | fixed | |
| 33 | Q33 Rook didn't throw up either | quests-sunny.ts | adapted | Rook is the speaker, so it reads: "Everyone threw up. Except Corky. And me. I definitely didn’t." |
| 34 | Uncle Tenzo is close to Tenzin and to the Zen title | quests-avatar.ts | skipped | For information only, with no fix proposed. Listed for Maor. |
| 35 | Mr Fennick (Q44) vs Mr Fenwick Mull (Q12) | quests-sunny.ts | adapted | Renamed to **Mr Tallis**, not "Mr Pellow", because Avatar Q50 already has Old Mr Pell. "Tallis" isn't used anywhere else in src. |
| 36 | "Character names stay original" is ambiguous | quests-python.ts + prompt | fixed | The Python file header now says "newly invented". The prompt line is Prompt edit P2. |
| 37 | toward/towards; learned/learnt | readers.ts, quests-avatar.ts | fixed | 4 × "toward" changed to "towards" in readers.ts; the fifth was in the replaced Island Mystic intro. I picked "learned", which is used 191 times game-wide against 34 for "learnt", and changed Avatar's 6 "learnt" to "learned". |
| 38 | Nubbin pronouns in results.ts | results.ts | fixed | `rf-18` "its own", `ev-03` "itself", `me-02` "it". |
| 39 | `ex-28` "two shells" | results.ts | fixed | "a few shells". |
| 40 | `wen-weather-5` rewrites Q58 | readers.ts | fixed | Added "(The Keeper helped. A bit.)". |
| 41 | Weak jokes `gok-03`, `gok-16` | readers.ts | fixed | `gok-03` uses the reviewer's turnip joke. `gok-16` is a new one: "What's a knight's favourite fish? A swordfish. Obviously." |
| T1 | Task: `Audience` type | types.ts | fixed | `'all' \| 'main' \| 'teen' \| 'adult'`, with the requested doc comment. The `childLines` convention comment now says only `all` reaches the Learning Grove. tsc passes with no other changes. |
| T2 | Task: Q31 gate wording | quests-sunny.ts | adapted | Same as #4. Q31–Q45 stay `adult`. |
| T3 | Task: 9–11 on Bean, Sunny, Avatar | 3 files | fixed | Same as #3. |
| T4 | Task: Avatar `requires` | quests-avatar.ts | fixed | Same as #2. |
| T5 | Task: `mags` → `old-mags` | quests-python.ts | fixed | Same as #5. |

## 2. Scenes changed (for the Learning Grove mirror)

Text changed in these scenes (Python, Bean and Avatar have edu versions):

- **Python:**
  - `q08-intro`: lines 3 and 4.
  - `q09-mother`: the `themselves` choice `then`, line 1.
  - `q14-sentence`: the `volunteer` choice `then`.
  - `q14-complete`: the `busy` choice `then`, line 1.
  - `q20-intro`: lines 4 and 9 are now "The larch.". The childLines are unchanged.
  - `q20-complete`: line 3.
- **Bean:**
  - `q23-complete`: line 2.
  - `q26-bench`: line 3.
  - `q26-complete`: line 1.
  - `q29-complete`: line 1.
  - Reward `egg-cosy` description.
- **Avatar:**
  - `q51-complete`: line 6.
  - `q53-complete`: line 0.
  - `q54-lessons-done`: "learned".
  - `q59-complete`: "learned" and the cut sentence.
  - `q60-thief`: the `name` choice `then`.
  - `q60-friends`: "learned".
  - `q60-complete`: **a new line 0**, so every later line shifts by one.
  - `q62-iceberg`, `q62-iceberg-done`, `q62-sled` and `q62-complete`: rewritten as above.
  - `q65-complete`: "learned".
  - **All Q63 scenes** (`q63-throne`, `q63-throne-done`, `q63-pet`, `q63-pet-done`, `q63-opponent`, `q63-opponent-done`, `q63-complete`): speaker id `bohdi` → `rumbold` and "King Bohdi" → "King Rumbold". This includes the `q63-opponent` choice label "Choose King Rumbold himself".
- **Goals and titles:**
  - Step `q62-s1` goal: "Break Pemba out of the ice."
  - Step `q63-s3` goal: "…with King Rumbold."
  - Q63 title: "King Rumbold’s Challenges".
- **Sunny** (adult, no edu mirror):
  - `q33-complete`, `q35-truths`, `q40-stuck-done` (and its `q40-honour` choice), `q44-arrive` and `q44-loyal`: Mr Fennick → Mr Tallis.

## 3. Hand-offs, prompt edits, engine backlog

### Hand-offs (other content and test files)

**H1. Old Mags speaker id, in two edu files:**

- `edu-fun-python-1-reader.ts:115`
- `edu-fun-python-bean-sprout.ts:117`

Old: `const MG = say('mags');` New: `const MG = say('old-mags');`

**H2. King Rumbold, in two edu files.**

In `edu-fun-avatar-2-reader.ts`:

- Line 40: `const BU = say('bohdi');` → `const BU = say('rumbold');`
- Lines 11, 1775 and 1780: `King Bohdi’s Challenges` → `King Rumbold’s Challenges`.
- Lines 1791, 1802, 1947, 1972 and 1982: `King Bohdi` → `King Rumbold`.

In `edu-fun-avatar-sprout.ts`:

- Line 33: `say('bohdi')` → `say('rumbold')`.
- Line 3199: the title becomes `King Rumbold’s Challenges`.
- Line 3348: `'Pick King Bohdi'` → `'Pick King Rumbold'`.

**H3. Canon 20: Neopia's war and dark plots become `main`.** `adult` is now 18+ behind the content setting, which is not what these plots mean.

In `neopia-line.ts`:

- `audience: 'adult',` → `audience: 'main',` for NP2, NP5, NP7, NP8, NP9 and NP10 (lines 242, 857, 1242, 1446, 1624 and 1829).
- Header lines 11–13: `'adult' (here meaning "kept out of the Learning Grove", not crude) for the war and dark plots NP2, NP5, NP7, NP8, NP9, NP10.` → `'main' (main game only, never the Learning Grove) for the war and dark plots NP2, NP5, NP7, NP8, NP9, NP10.`
- The notes on lines 453, 1044, 1433, 1611, 1817 and 2005 say "Audience adult:". Change each to "Audience main:".

In `neopia-quests.ts`:

- `audience: 'adult',` → `audience: 'main',` at lines 1562, 1625, 1690, 1757, 1821 and 1989 (NQ22–NQ26 and NQ28).
- Header lines 12–13: `Audience 'adult'` → `Audience 'main'`, and `('adult')` → `('main')`.
- Notes on lines 1616 and 2081: "Audience adult" → "Audience main".

**H4. Canon 22: no "once per visit", in `neopia-quests.ts`.** This matches results.ts, which now says once per Nubbin per life.

- Line 127: `(one per visit)` → `(one per Nubbin per life)`.
- Line 1681: `a once-per-visit freebie` → `a once-per-Nubbin-per-life freebie`.
- Line 2349: `Sneak into the Ice Caves once per visit to Neopia` → `Sneak into the Ice Caves once per Nubbin per life`.
- Line 2354: `(brief: once per visit, chilled not hurt)` → `(once per Nubbin per life, chilled not hurt)`.
- Line 2439: `one jelly per visit to Neopia` → `one jelly per Nubbin per life`.

**H5. `tests/tools/content-check.ts` audience checks.** Today the check never reads `audience`. Learning Grove membership is the hard-coded `eduPacks` list, so a `main`, `teen` or `adult` quest in an edu pack would pass silently. Add:

- After line 85 (`for (const k of Object.keys(eduPacks)) … mainScenes.set(s.id, s);`):
  ```ts
  // only audience 'all' reaches the Learning Grove; 'main', 'teen' and 'adult' never do
  for (const k of Object.keys(eduPacks)) for (const q of packs[k]!) if (q.audience !== 'all') problems.push(`${q.id}: audience ${q.audience} in a Learning Grove pack`);
  ```
- In the `C.EDU_QUESTS[band]` loop, after `if (!orig) { … continue; }` (line 133):
  ```ts
  if (orig.audience !== 'all') problems.push(`edu ${q.id}: ${q.of} is audience ${orig.audience}, not allowed in the Learning Grove`);
  ```

I ran no other audience check and none was needed: tsc compiles unchanged.

**H6. `script-book/*.md` are generated** by `tests/tools/script-book.ts`. That file only prints `q.audience` and needs no change. Regenerate it so 02-fun-python, 03-fun-bean, 04-fun-sunny and 05-fun-avatar pick up the new triggers, `requires` and names.

### Prompt edits (grove-backlog-prompt.md; line numbers from `baseline/`)

**P1** (line 152)

Old:

> The fun quests are already numbered 1–45 across three tables (Monty Python 1–20, Mr. Bean 21–30, It's Always Sunny 31–45); refer to them as Q1–Q65.

New:

> The fun quests are already numbered 1–45 across three tables (Monty Python 1–20, Mr. Bean 21–30, It's Always Sunny 31–45); the Avatar quests Q46–Q65 are in Part H. Refer to all of them as Q1–Q65.

**P2** (line 434)

Old:

> Character names stay original, and songs are newly written.

New:

> Character names are newly invented, and songs are newly written.

**P3** (line 533)

Old:

> `| 20 | And Now, the Larch | "And now… the larch." | Flying Circus |`

New:

> `| 20 | And Now, the Larch | "The larch." (from "Number one. The larch.") | Flying Circus |`

**P4** (lines 535–542): replace the quest name in the second column only.

| Row | Old name | New name |
| --- | --- | --- |
| 31 | Nubbin Mittens | Kitten Mittens |
| 33 | Brawl Juice | Fight Milk |
| 34 | The Green Suit | Green Man |
| 35 | Mind, Body, Soul Night | Chardee MacDennis |
| 36 | The Picnic Ham | Rum Ham |
| 38 | Nubbin Law | Bird Law |
| 41 | Tag-Team Night | The Gang Wrestles for the Troops |
| 42 | The Mail Room | Pepe Silvia |

Row 31's note "(Corky never learns the product's new name)" stays. The Sunny table's Q38 reward "A 'Nubbin Law' page" (line 489) matches the code and stays.

**P5** (Part A step 5, line 33)

Old:

> quests Q31–Q45 never appear in the Learning Grove. In the main game they are adults-only and faithful to the show (drinking, gross-outs, insults), with no jokes about race or sexual coercion;

New:

> quests Q31–Q45 never appear in the Learning Grove. In the main game they are adults-only (audience `adult`: offered only when Settings › Content › "Mature content" is set to 18+, which is off by default; Q31 carries the gate and Q32–Q45 require Q31), never during Chapters 9–11, and faithful to the show (drinking, gross-outs, insults), with no jokes about race or sexual coercion;

**P6** (Part H)

- Cast row (line 1266) old: `| King Bohdi | Bumi | Mad old earth king who laughs like a donkey |`
  New: `| King Rumbold | Bumi | Mad old earth king who laughs like a donkey |`
- Q63 row (line 1300): `King Bohdi's Challenges` → `King Rumbold's Challenges`, and `King Bohdi's laugh as an emote` → `King Rumbold's laugh as an emote`.

**P7** (Part H approved quotes, lines 1272–1276)

Old, from:

> "Hello, Zuko here." (Q64 — said by Kaito as "Hello, Kaito here." is NOT allowed; … if you adapt it, no childLines is needed for it).

New:

> "Hello, Zuko here." (Q64) is adapted to "Hello, Kaito here.", an original line with no childLines swap.

**P8** (Part H Q62 row, line 1299): replace the "What you do" cell.

Old:

> A boy wakes up in an iceberg and only wants to go penguin sledding. Race down the snow hill on penguins.

New:

> Pemba meditates too long and freezes into the pond. Break him out; he only wants to go penguin sledding. Race down the snow hill on penguins.

**P9** (Part H intro)

After "They never set campaign flags. Rewards are cosmetics or features." add:

> Like the other fun quests, they never trigger during Chapters 9–11. They play in order: Q46 opens the line (every later quest requires it), Q56 introduces Bao (Q55 and Q64 require it), and Q64 brings Kaito into the group (Q49 and Q55 require it).

### Engine backlog

**E1. Content setting (next to CV2).** Add a grown-up setting, Settings › Content › "Mature content", with values **Off** (default), **13+** and **18+**.

- Store it in the save (`sim/save.ts`) as, for example, `matureContent: 'off' | 'teen' | 'adult'`.
- Show the control in `ui/settings.ts`. Never show it in a Learning Grove save.
- Lowering the setting hides teen or adult quests that are in progress but keeps their progress.
- Q31's trigger text names this setting. The Multiverse and Atlas (teen) should read the same setting.

**E2. Audience filter** for the content quest loader. No sim or UI code reads `Quest.audience` today: I grepped `src/` and `tests/`. The only reader is `tests/tools/script-book.ts`, which prints it. When fun quests and side stories are wired in:

- **Learning Grove:** offer only `audience === 'all'`. `main`, `teen` and `adult` count as "not in the Learning Grove".
- **Main game:** always offer `all` and `main`. Offer `teen` only when `matureContent` is `teen` or `adult`, and `adult` only when it is `adult`.

**E3. Fun-quest chapter block (canon 23).** Never offer, start or advance Q1–Q65 while the campaign chapter is 9, 10 or 11. Every trigger's `when` now ends with that rule, but the sim must enforce it.

**E4. `requires`** on fun quests holds quest codes (`'Q46'`, `'Q31'`, `'Q32'`, `'Q56'`, `'Q64'`). A quest is offered only after every listed code is complete.

**E5. Neopia freebies:** each is once per Nubbin per life. The Soup Kitchen has no limit; it stays need-based.

**E6. Noticed outside my area, for awareness.** These read as "once a day" against canon 22. I didn't change them:

- `sim/daily.ts` (header: "once a day a Keeper visits with a gift").
- `sim/neighbourhood.ts` (lines 10 and 96: "a gift once per real day per neighbour").

## 4. For Maor

- **Seven quotes the reviewer couldn't verify, left as written:**
  - "It's only wafer-thin." (Q11)
  - "Teddy!" (Q21)
  - "Wildcard, bitches!" (Q31)
  - "I am a golden god!" (Q35)
  - "Can I offer you a nice egg in this trying time?" (Q36)
  - "Bird law in this country is not governed by reason." (Q38)
  - "There is no Carol in HR!" (Q42)
- **Q15:** please check "Not much of a cheese shop, is it?" against Flying Circus S3E7. Transcripts also give "…cheese shop really, is it?".
- **Q20:** I swapped the stitched "And now… the larch." for the attested "The larch." in both places. Say if you'd rather keep the original line.
- **Content setting name:** I used one shared setting, "Mature content" (Off / 13+ / 18+), instead of a Puddle's Pub-only toggle. Other fixers may have named it differently, so pick one name.
- **Uncle Tenzo** sits close to *Korra*'s Tenzin, and "tenzo" is the Zen title for a monastery cook. It's apt for a tea uncle; I left it.
- **Mr Tallis**, not the reviewer's "Mr Pellow", because Avatar already has Old Mr Pell.
- **Neopia and `all`:** Part G/J says "Neopia and the Multiverse are not offered in the Learning Grove" (prompt line 1806). Canon 20 defines `all` as "the Learning Grove and the main game", and several Neopia plots are `all`. Neopia isn't in content-check's `eduPacks`. Please decide whether those Neopia plots should be `main`, or whether Neopia is a Learning Grove exception at the section level.
- **Freebies:** I read canon 22 as "once per Nubbin per life" for every Neopia freebie, as Coltzan's and the Lab Ray already were. If you'd rather make them strictly one-time per save, the `taken` lines need one more pass.
- **Q55** is "Any summer evening" and now also needs Q64 and Q56. A player who finishes Q64 in autumn waits until the next summer in the Free Grove. That's fine, but worth knowing.

---

# log-mv
## Fix log: Multiverse and Neopia (review-mv-atlas.md)

Files: `src/content/mv-cap.ts`, `mv-doom-ultron.ts`, `mv-dragonball.ts`, `mv-endgames.ts`,
`mv-ironman.ts`, `mv-moonknight-spawn.ts`, `mv-toystory.ts`, `neopia-line.ts`, `neopia-quests.ts`.
Pre-edit copies: `SCRATCH/fix/mv-orig/`. Edit scripts: `SCRATCH/fix/mvtools/`.

Status key: **fixed** (reviewer's fix, or near it), **adapted** (changed to fit canon, code or
continuity), **skipped** (with reason), **prompt** (outside my files; exact text under Prompt edits).

## 1. Items

### Must fix

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| M1 | `adult` isn't adults-only; Neopia misuses it; Atlas needs 13+; NQ24 grog | mv-*.ts, neopia-line.ts, neopia-quests.ts; types.ts; prompt F/G/L | fixed | types.ts already reads `'all' \| 'main' \| 'teen' \| 'adult'` (other agent). Multiverse stays `adult` (100/100 quests); endgames header now says 18+, behind the content setting. Neopia NP2, NP5, NP7–NP10 → `main`; header and notes rewritten ("Nothing in Neopia is teen or adult"). Also retagged Edna's Quests NQ22–NQ26 and the Esophagor NQ28 (the "darker Haunted Woods" content, described as not crude) → `main`. NQ24: grog swapped for pirate pepper sauce (see Scenes). Age-confirmation toggle → Engine backlog. Atlas `teen` and the prompt text → Prompt edits. |
| M2 | E6 removes an Eternal from another save | mv-endgames.ts | fixed | Canon 21. Notes: the Eternal is a reflection made when E6 opens, living only in the Multiverse save; only that save loses it; no other save is ever written. The core choice now shows it in-world ("Or its reflection is… as true as a face in still water."). Reviewer's optional "memorial card in its own Grove" not done: it would write another save. |
| M3 | FF7: Doom wins the title, then asks a boon of himself | mv-doom-ultron.ts; Part F | fixed | `mv-ff07-won` lines and step goal as suggested; note added. Part F → Prompt edits. |
| M4 | Learning Grove can't reach NP3, NP4, NP6, NP11–NP13 | neopia-line.ts | adapted | Took the reviewer's data option: `np03` requires NP1, `np06` NP4, `np11` NP6 (triggers say "in the main game, after NP2/NP5/NP10"). Main-game number order is kept by an engine rule (Engine backlog). Added both childLines (`np04-feast#0`, `np13-broadcast#2`). Header explains the order. |
| M5 | E1 repeats CA10's resurrection | mv-endgames.ts | adapted | CA10's "mend, not change" exists only on the `healed` choice, so Kobik's lines are worded to fit both paths: "I promised not to change anything. So I didn't. I only caught him while he was falling." / "Was that allowed? Catching isn't changing…". Steve's line no longer says "a long time". Note updated. |
| M6 | MK8 and E3 run the same sky/lantern beats | mv-moonknight-spawn.ts, mv-endgames.ts; Part F | fixed | MK8 now ends before the descent: Marc frees the powers, Khonshu drops him onto the Mission roof ("Then go, my fist. Go and be small." … "You will come back to me"). `mv-mk-lantern` retired; its choice replaced by `mv-mk-sky` (cages \| stood), cosmetic (new choice ids `cages`, `stand`). Title description changed. E3 keeps the lantern descent; E3 notes and both headers updated. Part F re-source → Prompt edits. |
| M7 | Part L A2: cloud somersault "once a day" | Part L | prompt | Already applied in SCRATCH/part-l.md ("usable any time"); listed so nothing is lost. |

### Should fix

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| S1 | Goku fights Shen twice (DB20, E4) | mv-endgames.ts, mv-dragonball.ts; Part F | adapted | E4 s1: Tien beats Tao, Shen beats Yamcha, Goku beats Tien in the semi-final. Tien won the 22nd Budokai in DB14, so the reviewer's "I lost to you once" became "I won last time by a hair. I wanted to know if it was luck. It was." Shen's "I am sorry for what comes next" kept, from ringside. DB20 bracket adds Chi-Chi and Mercenary Tao; Shen's spar line no longer promises a rematch. Notes in both files. |
| S2 | Ultron thinks Eternals never end | mv-endgames.ts; Part F | fixed | `mv-e6-endeternal`: "It does not hold on. It lasts because something remembers it. I cannot compute being remembered." The next narration ("Endless life…") became "A life made of being loved…". Ultron's earlier "does not end" lines are kept as his error (noted). |
| S3 | "Stark is gone" while Tony is alive | mv-doom-ultron.ts | fixed | FF-EP line as suggested. E2 l.745 already reads "Stark is not using it at present", so it needed no change. |
| S4 | Present-day Doom claims far-future memories | mv-endgames.ts | fixed | Both lines as suggested (`mv-e6-worlds`, `mv-e6-doomally`; "I was." dropped). |
| S5 | Doom's time-platform disc never used | mv-endgames.ts | fixed | Spent in `mv-e6-trap`: a conditional insert (mv-doom = ally) in E6 notes, in the file's existing line-swap style. |
| S6 | UL10: "Pym tried to hide it" | mv-doom-ultron.ts | fixed | "Your creature smells of it." |
| S7 | SP3/SP4 out of order; SP7 Redeemer mis-sourced | mv-moonknight-spawn.ts, mv-endgames.ts; Part F | fixed | Full swap: Overt-Kill is now SP3 (`mv-sp03`, scene ids `mv-sp03-*`), Angela SP4 (`mv-sp04`, `mv-sp04-*`); triggers, requires, SP5 trigger, MK7 requires (`SP4`), MK7 trigger/notes, headers and E3's Bobby note updated. SP7 re-sourced "Spawn #16–18 (1994), the first Redeemer, and the later Redeemers", stays after SP6 as a later Redeemer ("Not the first one."). |
| S8 | NP9: Jazan's turn has no cause | neopia-line.ts | fixed | As suggested, plus "Then Jazan is gone, pulled through a door…" so the exit fits his surprise. Amira's curse line inserted in `np09-nabile` before "Jazan hears". |
| S9 | NQ7: Kreludor called a separate moon | neopia-quests.ts | fixed | As suggested. |
| S10 | Per-visit freebie loops (NQ31, NQ32, Part G) | neopia-quests.ts; Part G | fixed | Canon 22, one-time. NQ31: no repeatable sneak; the feature reward became a title, "Snowager's Hoard: one sneak, one prize, ever" (id `nq31-hoard`); the guide's line changed. NQ32: Giant Jelly is a one-time item granted when the Neopia line completes. NQ1's note no longer calls the Omelette "one per visit". Header states the rule. Part G → Prompt edits; results.ts conflict → For Maor. |
| S11 | Part G keeps wagering games | Part G | prompt | |
| S12 | Part G "20 lands, two jokes" | Part G | prompt | |
| S13 | Part G "in release order"; NP2's Sloth voice | Part G | prompt | |
| S14 | Part G 55 vs 54 species | Part G | prompt | |
| S15 | Mr. Popo's servile third-person speech; "Touched Popo" | mv-dragonball.ts | fixed | All six Popo lines in the first person; title "Brushed the Sleeve"; note added. His name stays "Mr. Popo". |
| S16 | Part E S9 "Family" list lacks `millLetter` | Part E | prompt | |
| S17 | Prompt step counts and commit message | Prompt | prompt | Adapted to the current prompt (step 1 already says seven files; step 9 still says five). |
| S18 | OW18 "nine NPCs" | Part C | prompt | |
| S19 | Parts D–E stale counts | Parts D–E | prompt | |
| S20 | Sunny names differ between tables; quote sources | Part E | prompt | Adapted: uses the code's titles (quests-sunny.ts) in both tables, so quest 35 is "Chardee MacDennis". |
| S21 | Part L A2 quest order | Part L | prompt | |
| S22 | Part L A6 not a real choice | Part L | prompt | |
| S23 | Part L "each page is a separate save" | Part L | prompt | Canon 30 wording. |
| S24 | Part L advisers miss A3 and A6 | Part L | prompt | |
| S25 | 11 `expedition:mv-*` checks with no verb | mv-moonknight-spawn.ts | fixed | All 11 (and CHECKS) now `expedition:clear:mv-…[:detail]`. |

### Nice to have

| # | Item (short) | File | Status | Note |
| --- | --- | --- | --- | --- |
| N1 | E2 "Do not spare me again" unclear | mv-endgames.ts | fixed | |
| N2 | Jessie gets the star twice | mv-endgames.ts | adapted | "Woody unpins his sheriff's star. This time it is his to give, not Bonnie's." / "He pins it on Jessie…" (kept to two sentences per line). |
| N3 | Forky's "I'm trash" too close to the film | mv-endgames.ts | fixed | "Back to the bin! Kidding. I'm Bonnie's. I was kidding about the bin." |
| N4 | Gabby "since before you were made" | mv-endgames.ts | fixed | |
| N5 | "I find I would like it to be me" twice | mv-doom-ultron.ts | fixed | FF-EP keeps it; UL10 now "Doom does not leave a thing half finished." |
| N6 | Johnny says Ben's "pal" | mv-doom-ultron.ts | fixed | "Rocky." |
| N7 | Mr / Mr. mixed | mv-cap, mv-moonknight-spawn, mv-toystory, neopia-line | fixed | British style: Dr Erskine, Dr Emmett, Dr Alraune, Mr Simmons, Dr Sid, Mr Krawley, Mr Henley. Kept as names: Mr. Popo, Dr. Sloth, Mr. Knight, Mr./Mrs. Potato Head, Dr. Slump, Ms. Marvel. `basedOn` fields untouched. |
| N8 | Completion flags inconsistent | mv-ironman, mv-doom-ultron, mv-moonknight-spawn, mv-endgames | fixed | Every line quest now sets its own id (`mv-im01`…`mv-sp08`, `mv-ff-epilogue`), like CA/DB/TS; each line's last quest sets `mv-<line>-complete`. SP8 `mv-sp: 'complete'` → `mv-sp-complete: true` (nothing read `mv-sp`). Endgames header documents it. |
| N9 | "Yodeling" | mv-toystory.ts | fixed | "Yodelling". |
| N10 | Neopian Times headlines vs reward labels | neopia-line.ts | fixed | NP1 reward → DOME SWEET DOME; NP3 → COLD CASE CLOSED; NP11 published route prints THE ISLAND IS REAL, secret route keeps IS IT REAL? (reward description and notes say so). |
| N11 | NP12 "last star" then "Start with the King" | neopia-line.ts | fixed | Archivist: "That one's the King's. Now, or last?"; choices "Save the King's star for last." / "Put the King's star in now." |
| N12 | NQ15 "quiet" line plays when mentioned | neopia-quests.ts | fixed | Line swap in notes for `nq-15-book` = mentioned. |
| N13 | NQ12 hint vs scene | neopia-quests.ts | fixed | Hint: "You carry the sack; your Nubbins supervise." |
| N14 | NQ1 Fire Faerie joke twice | neopia-quests.ts | adapted | Kept the line (it carries her motive) and cut only the charcoal joke: "I want something warm that I didn't heat myself. Just once." |
| N15 | Part L typos and swaps | Part L | prompt | |
| N16 | Part L A3 care note | Part L | prompt | |
| N17 | Part L A4 Telugu and Tamil | Part L | prompt | |
| N18 | Part L festivals overlap; cross-slot reads | Part L | prompt | |
| N19 | Part F CA5 issues; UL8 "stops Pym" | mv-cap.ts; Part F | adapted | Code too: CA5 `source` → "Captain America #169–180 (1974–75)", note updated. UL8's code already has Logan killing Hank off screen. Part F text → Prompt edits. |
| N20 | Parts D–E "refer to them as Q1–Q65" | Parts D–E | prompt | |

**Counts:** 52 items. Fixed 27, adapted 6, skipped 0, prompt-only 19. Hand-offs 0.

## 2. Scenes changed

The Learning Grove edu files don't cover the Multiverse or Neopia (content-check's coverage
scope leaves them out), so nothing needs mirroring into `edu-*.ts`. For completeness:

- **mv-cap.ts:** none (CA1 step goal "Dr Erskine"; CA5 source and notes).
- **mv-doom-ultron.ts:** `mv-ff01-isle`, `mv-ff07-won`, `mv-ffep-face`, `mv-ul10-final`, `mv-ul10-complete`.
- **mv-dragonball.ts:** `mv-db18-staff-done`, `mv-db18-kami`, `mv-db18-popo`, `mv-db20-shen-done`, `mv-db20-complete`.
- **mv-endgames.ts:** `mv-e1-complete`, `mv-e2-power`, `mv-e4-bracket`, `mv-e4-bracket-done`, `mv-e5-voicebox`, `mv-e5-voicebox-done`, `mv-e5-goodbye`, `mv-e6-worlds`, `mv-e6-doomally`, `mv-e6-corescene`, `mv-e6-endeternal`.
- **mv-moonknight-spawn.ts:** `mv-mk06-ward`, `mv-mk08-sky`, `mv-mk08-complete`, `mv-sp07-light`, `mv-sp08-mammon`. Renamed by the SP3/SP4 swap (text unchanged): `mv-sp04-cog`, `mv-sp04-cog-done`, `mv-sp04-angela`, `mv-sp04-angela-done`, `mv-sp04-complete` (were `mv-sp03-*`); `mv-sp03-hunted`, `mv-sp03-hunted-done`, `mv-sp03-rage`, `mv-sp03-rage-done`, `mv-sp03-complete` (were `mv-sp04-*`). Reward ids swapped the same way.
- **mv-toystory.ts:** `mv-ts03-sid`.
- **neopia-line.ts:** `np09-refused`, `np09-nabile` (one line inserted at #6), `np10-neovia`, `np10-neovia-done`, `np10-gilly`, `np10-complete`, `np11-complete`, `np12-stars2`. New childLines: `np04-feast#0`, `np13-broadcast#2`.
- **neopia-quests.ts:** `nq01-ask`, `nq07-ask-done`, `nq24-ask`, `nq24-ask-done`, `nq24-complete`, `nq26-ask`, `nq26-complete`, `nq31-complete`.

New flags and ids: `mv-mk-sky` (cages | stood; choice ids `cages`, `stand`, replacing `lantern`,
`hand`); per-quest flags `mv-im01`…`mv-im15`, `mv-ff01`…`mv-ff10`, `mv-ff-epilogue`,
`mv-ul01`…`mv-ul10`, `mv-mk01`…`mv-mk08`, `mv-sp01`…`mv-sp08`; `mv-sp-complete`; reward ids
`nq31-hoard`. Retired: `mv-mk-lantern`, `mv-sp` = 'complete', `nq31-sneak-unlock`.
Changed check strings: 11 × `expedition:clear:mv-…`; `give:item:dubloon-pepper-sauce:edna` (was
`dubloon-grog`).

## 3. Hand-offs

None. (results.ts touches the freebie rule; it is a decision, so it's under For Maor.)

## 4. Prompt edits

Old text is quoted from `SCRATCH/baseline/grove-backlog-prompt.md` as it stands today; Part L
text is from `SCRATCH/part-l.md`.

### Prompt header (steps 1 and 9)

- l.57, step 9: "**Commit everything** in one commit: the five docs files," → "**Commit everything** in one commit: the seven docs files,"
- l.57, commit message: "Add recommendations backlog, story bible and campaign v2, Learning Grove story language, Multiverse campaign, Neopia and full script content pack for review" → "Add recommendations backlog, story bible and campaign v2, Learning Grove story language, Multiverse campaign, Neopia, the Atlas, more storylines and full script content pack for review"

### Part C

- l.127: "Introduce the nine NPCs chapter by chapter." → "Introduce the ten Keepers chapter by chapter."

### Parts D–E

- l.152: "The fun quests are already numbered 1–45 across three tables (Monty Python 1–20, Mr. Bean 21–30, It's Always Sunny 31–45); refer to them as Q1–Q65." → "The fun quests are already numbered 1–45 across three tables (Monty Python 1–20, Mr. Bean 21–30, It's Always Sunny 31–45): call them Q1–Q45 here, and Q46–Q65 are the Avatar quests in Part H."
- l.158: "Ten new feature ideas and ten one-time side stories for Hazel's Grove" → "Ten new feature ideas and twenty-two one-time side stories for Hazel's Grove"
- l.165: "Three of the ten (S2, S9, S10) change the campaign; the other seven are for fun and give rewards." → "Five of the twenty-two (S2, S9, S10, S13, S19) change the campaign; the other seventeen are for fun and give rewards."
- l.168: "None of this repeats the 24 items already on the open-world list" → "None of this repeats the 25 items already on the open-world list"
- l.205: "Three of the ten side stories (30%) change the campaign:" → "Five of the 22 side stories (23%) change the campaign:"
- l.316–317: "You're offered "Family" only when at least two of these are true: `corvin` = reconciled, S3 done,\nS6 done, S8 done." → "You're offered "Family" only when at least two of these are true: `corvin` = reconciled, S3 done,\nS6 done, S8 done, `millLetter` = kept (S13)." (Canon 27 also adds `visitors` (S23); the Part I/M owners may want it here too.)
- Original quotes table (l.534–542), rename the quests to the code's titles: "| 31 | Nubbin Mittens |" → "| 31 | Kitten Mittens |"; "| 33 | Brawl Juice |" → "| 33 | Fight Milk |"; "| 34 | The Green Suit |" → "| 34 | Green Man |"; "| 35 | Mind, Body, Soul Night |" → "| 35 | Chardee MacDennis |"; "| 36 | The Picnic Ham |" → "| 36 | Rum Ham |"; "| 38 | Nubbin Law |" → "| 38 | Bird Law |"; "| 41 | Tag-Team Night |" → "| 41 | The Gang Wrestles for the Troops |"; "| 42 | The Mail Room |" → "| 42 | Pepe Silvia |".
- Same table: "\"I am a golden god!\"" → "\"I am a golden god!\" (different episode)"; "\"Can I offer you a nice egg in this trying time?\"" → "\"Can I offer you a nice egg in this trying time?\" (Frank, different episode)".

### Part F (Multiverse)

- l.566: "- **Who can play.** Rated for adults. The Spawn and Moon Knight lines keep their violence and horror, adapted to the game's look. The campaign is not offered in the Learning Grove." → "- **Who can play.** Rated 18+ (`audience: 'adult'`): main game only, behind the adult content setting, which is off by default, and the player confirms their age before the rift first opens. The Spawn and Moon Knight lines keep their violence and horror, adapted to the game's look. The campaign is never offered in the Learning Grove. It has one save slot of its own; it may read the Grove saves and never writes them."
- l.582: "FF7 opens the road into Spawn's hell. SP3 unlocks MK7." → "FF7 opens the road into Spawn's hell. SP4 unlocks MK7."
- l.630 (CA5): "(*Captain America \#169–176*)" → "(*Captain America \#169–180*)"
- l.658 (FF7): "Doom wins a contest of sorcerers and calls in Doctor Strange's debt: once a year he gets to attempt his mother's rescue from Mephisto's realm." → "Doom comes second in a contest of sorcerers, and the winner, Strange, owes the runner-up a boon: help to free his mother from Mephisto's realm, which Doom may attempt once a year."
- l.686 (UL8): "Two of them go back in time and stop Pym from ever building him" → "Two of them go back in time and kill Pym before he can build him"
- l.708 (MK7): "**Needs SP3.**" → "**Needs SP4.**"
- l.710 (MK8): "Marc has to choose between the god who saved him and the world. **Completes the Moon Knight line.**" → "Marc has to choose between the god who saved him and the world. He frees the stolen powers, and Khonshu throws him out of the sky palace onto the Mission roof: \"You will come back to me.\" (The walk down by the Mission lantern belongs to E3.) **Completes the Moon Knight line.**"
- l.720–722, swap SP3 and SP4: "3.  **Angela** (*Spawn \#9*). … **Unlocks MK7.**" becomes item 4, and "4.  **Overt-Kill** (*Spawn \#5–7*). …" becomes item 3, text unchanged, in this order:
  "3.  **Overt-Kill** (*Spawn \#5–7*). The mob sends the cyborg Overt-Kill after Spawn. It is the first time Spawn fights back with everything, and the first time he sees what the suit does with anger.\n\n4.  **Angela** (*Spawn \#9*). The old man Cogliostro explains the rules: Spawn is one of many Hellspawn, built to lead Hell's army. Then Angela, Heaven's bounty hunter, comes to collect. **Unlocks MK7.**"
- l.728 (SP7): "7.  **The Redeemer** (*Spawn \#50–100*). Heaven sends its own soldier to kill Spawn" → "7.  **The Redeemer** (*Spawn \#16–18 and later Redeemers*). After Malebolgia's fall, Heaven sends its latest Redeemer to kill Spawn"
- l.774 (DB20): "In the preliminaries Goku meets Chi-Chi again, keeps the promise to marry her that he didn't understand, and fights a stranger hiding Kami. A man in a cloak, Ma Junior, is in the bracket." → "Goku meets Chi-Chi again in the ring and keeps the promise to marry her that he didn't understand, and spars once with a stranger hiding Kami. The bracket: Goku, Chi-Chi, Tien, Mercenary Tao, Krillin, Yamcha, Shen and a man in a cloak, Ma Junior."
- E1 step 5: "5.  **Epilogue.** On the courthouse steps Steve is shot. Then, through the CA line's Cube thread, he comes back." → "5.  **Epilogue.** On the courthouse steps Steve is shot. Then, through the CA line's Cube thread, he comes back: Kobik, keeping her promise not to change anything, only caught him as he fell."
- E3 heading source (l.844): "*Spawn \#150–164; Avengers vol. 8 \#32–38, Age of Khonshu.*" → "*Original, after Spawn \#150–164 and Age of Khonshu.*"
- E4 step 1: "1.  **The bracket.** Tien faces a rebuilt, half-cyborg Mercenary Tao and wins. Kami, fighting in a borrowed body, tests Goku and loses on purpose." → "1.  **The bracket.** Tien beats a rebuilt Mercenary Tao; the stranger Shen (Kami in a borrowed body) beats Yamcha; Goku beats Tien in the semi-final."
- E6 step 1: "He has learned what Eternals are: Nubbins that never age. Ultron wants an Eternal body, organic and endless, and he means to take one." → "He has learned what Eternals are: Nubbins that never age. He doesn't understand that they fade unless they are loved. Ultron wants an Eternal body, organic and endless, and he means to take one."
- E6 step 5, third bullet: "Your Eternal goes into Ultron, and the endless life in it is the one thing he can't compute. Both are lost." → "A reflection of your oldest Eternal, made for the Multiverse save, goes into Ultron, and being remembered is the one thing he can't compute. Both are lost. Only the Multiverse save loses it; your real Eternal stays in its Grove."

### Part G (Neopia)

- l.927: "It covers 20 lands, the 13 site plots as the Neopia line (NP1–NP13), all 55 species as a new Neo creature family," → "It covers 19 lands, the 13 site plots as the Neopia line (NP1–NP13), the 54 retro species (plus the optional Vandagyre) as a new Neo creature family,"
- l.927: "the freebies (adapted to the no-chores rule, Maor to decide)," → "the freebies (each one-time or unlimited, never per visit),"
- l.931: "That means its lands, 13 site plots, all 55 species, the paint brushes, the items, the freebies, the Games Room and the faeries. Unlike the Multiverse campaign, it is for all ages." → "That means its lands, 13 site plots, the 54 retro species (plus the optional Vandagyre), the paint brushes, the items, the freebies, the Games Room and the faeries. Unlike the Multiverse campaign, nothing in it is adults-only: most of it is `all`, and the war plots and darker Haunted Woods stories are `main` (main game only)."
- l.939: "The 55 species join the Chao" → "The 54 retro species join the Chao"
- l.941 ("One story line"): "Dr. Sloth runs through them and is beaten for good in the last one." → "Dr. Sloth runs through them and is beaten for good in the last one. The main game plays them in number order; the Learning Grove plays only the `all` plots (NP1, NP3, NP4, NP6, NP11, NP12, NP13), each requiring the previous one available in that mode."
- l.943: "- **Who can play.** All ages. The Learning Grove gets the lands, pets, paint brushes, shops and gentle games. The war plots and the darker Haunted Woods stories stay out of it." → "- **Who can play.** All ages, apart from the war plots and the darker Haunted Woods stories (NP2, NP5, NP7–NP10, Edna's Quests and the Esophagor), which are `main`: main game only, not crude. The Learning Grove gets the lands, pets, paint brushes, shops and gentle games."
- l.945: "- **To decide: freebies and dailies.** Classic Neopets ran on dailies such as the Giant Omelette, the Snowager and the Tombola, and Maor's rule is no repeatable chores. Each freebie below is adapted so it has no timer, no streak and no penalty for skipping, and Maor decides whether that is acceptable or whether each should be a one-time event instead." → "- **Freebies and dailies.** Classic Neopets ran on dailies such as the Giant Omelette, the Snowager and the Tombola. Maor's rule is no repeatable chores: nothing is once a day, once per visit or reset by leaving, so each freebie below is either one-time or unlimited."
- l.949: "Neopia has 20 lands, including two jokes." → "Neopia has 19 lands, including one joke (Jelly World) and one secret (Lutari Island)."
- l.977: "These are the 13 classic site plots from 2000 to 2008, in release order." → "These are the 13 classic site plots from 2000 to 2008, in order of their conclusion."
- l.981 (NP2): "A voice, surely Sloth's, swears to return." → "A voice, surely Sloth's, swears to return (the Grove's addition)."
- l.1007: "All 55 Neopets species become the Neo family." → "The 54 retro Neopets species become the Neo family, and the Vandagyre is optional."
- l.1109 (Lucky items): "| Shells only. Not in the Learning Grove |" → "| Shells only, no stake. Not in the Learning Grove |"
- l.1115: "Each classic daily becomes a place you can use once per visit to Neopia. A visit ends when you go back through the gate. There is no clock, no streak, and nothing is lost by skipping. Maor decides whether this is acceptable or each should be a one-time event." → "Each classic daily becomes either a one-time event with a fixed prize or a place you can use without limit. Nothing is once a day, once per visit or reset by leaving, and nothing is lost by skipping."
- Freebie table, "Grove version" column: Giant Omelette "One slice per visit. It shrinks as you take slices and is a fresh omelette on the next visit" → "Unlimited slices, one at a time; it never runs out (Fire Faerie's quest needs one)"; Giant Jelly "One jelly per visit, from the land that doesn't exist" → "One-time: the Official leaves one jelly the day you finish the Neopia line (NQ32)"; Tombola "One ticket per visit" → "One-time: one ticket, one fixed prize. Not in the Learning Grove"; Fruit Machine "One spin per visit" → "One-time: one spin, one fixed prize. Not in the Learning Grove"; Snowager "Sneak in once per visit. If he wakes, the pet is chilled, not hurt" → "One-time: one sneak, one prize, ever (NQ31)"; Wheels "One spin of each per visit" → "One-time: one spin of each wheel, one fixed prize. Not in the Learning Grove"; Underwater Fishing "One cast per visit. Fishing skill grows" → "Unlimited casts, no prizes beyond fish; fishing skill grows"; Anchor Management, Deserted Tomb, Meteor Crash Site "Once per visit" → "One-time, one fixed prize"; Advent Calendar "Optional, and only if Maor allows calendar events" → "Left out: a door a day is a calendar timer"; Bank interest "Interest added when you come back, capped" → "Left out: interest is a timer". (If Maor keeps results.ts's "once per Nubbin per life" model instead, use that wording throughout; see For Maor.)
- Games table: Dice-a-Roo "| Dice game on Roo Island |" → "| Dice game on Roo Island, for points and a trophy only |"; Kiss the Mortog "| Luck game in Meridell |" → "| Luck game in Meridell, for a trophy only. Not in the Learning Grove |"; Poogle Racing "| Your Nubbins race the Poogles. Shells only |" → "| Your Nubbins race the Poogles. No bets; a trophy for a win |"; Bilge Dice "| Pirate dice on Krawk Island |" → "| Pirate dice on Krawk Island, for points and a trophy only |".
- l.1162: "Scorchy Slots and the other gambling games are left out." → "Scorchy Slots and the other wagering games are left out. Nothing here takes a stake. The Fruit Machine, the Wheels, the Tombola, Kiss the Mortog and the lucky items stay out of the Learning Grove."
- Quests list, add after the Edna's Quests bullet: "Edna's grog is pirate pepper sauce, so nothing in Neopia is boozy."
- Seasonal events (l.1199): "These conflict with the no-rotating-content rule unless Maor allows calendar events." → "Left out: calendar events rotate content, which the no-repeatable-chores rule forbids."

### Part L (the Atlas; another agent owns SCRATCH/part-l.md)

- Table l.20, 22, 23: "| 13+ |" → "| Teen (13+) |" for A1, A3, A4 (`audience: 'teen'`, behind the content setting, off by default).
- l.23 (A4): "(Telugu films)" → "(Telugu and Tamil films)"
- l.137 (A2 rewards): already reads "usable any time". No change.
- l.114–117 (A2 order): reorder to "7. **The White Dragon Horse.** The dragon who ate the monk's horse becomes his new one.\n8. **The Stolen Robe.** The Black Bear spirit takes the monk's sacred robe.\n9. **Pigsy.** Zhu Bajie, lazy, greedy and lovable, joins.\n10. **Sandy.** Sha Wujing of the River of Flowing Sands joins." and shift the rest (the Ginseng Fruit becomes 11). The line grows to 19 quests: update the table's Quests column for A2 from 18 to 19, or merge two later quests to keep 18.
- l.181 (A3 care note): "suicide is part of the brothers' story. Refer to it only as "the worst night", and never depict or explain it." → "The brothers' story includes an attempted murder-suicide of their mother (\"the worst night\") and Dong-yeon's own suicide attempt. Name both in this note for the team; in the script refer only to \"the worst night\", and never depict or explain either."
- l.301–302 (A6): "**Signature choice:** Q14, Sinbad's master offers him the ivory, and you choose. Every ending\nlets the elephants be." → "**Signature choice:** Q14, the master asks you where the graveyard is. Tell him (he swears to take only fallen tusks), or keep the secret (Sinbad stays a slave a season longer)."
- l.371–372 (A8): in the book, Verses (javelin) is task 2 and Cilindric (wrestling) task 3, so swap the two lines: "3. **Verses.** Out-throw the Persian javelin champion.\n4. **Cilindric.** Wrestle the German champion, who may be a little too fond of rules."
- l.404: "coziest" → "cosiest"
- l.420: "with a second Hemulen's dress used as a glider" → "with the dress of another Hemulen they meet, used as a glider"
- l.493 (Night of Remembering): "| A memory wall where every faded Nubbin's card stays forever |" → "| A lantern path where every faded Nubbin's card hangs on its own lantern |" (so it no longer duplicates A7's ofrenda reward). Add under the table: "Festivals read Atlas progress across pages (and may read Grove state), the way E6 reads other saves; they never write any other save."
- l.501: "Commission cultural advisers for A2, A4, A5, A7 and A10" → "Commission cultural advisers for A2, A3, A4, A5, A6, A7 and A10"
- l.503–504: "Each page is a separate save, like\n   the Multiverse." → "The Atlas has one save slot of its own, like the Multiverse; each page keeps its own progress inside it, so pages can be played in any order."

## 5. Engine backlog

1. **Content rating setting.** `Audience` `teen` (13+) and `adult` (18+) quests appear only when a content setting allows them; it is off by default. Before the Multiverse rift first opens, show a one-time age confirmation that turns on `adult` (the Multiverse and It's Always Sunny). `main` quests appear in the main game and never in the Learning Grove; `all` everywhere.
2. **Neopia plot order.** In the main game each NP plot also waits for the previous NP plot available in that mode, on top of its `requires`: NP3 waits for NP2, NP6 for NP5, NP11 for NP10 (NP7–NP10 already chain). In the Learning Grove only `all` plots exist, so `requires` alone gives NP1 → NP3 → NP4 → NP6 → NP11 → NP12 → NP13. Apply `childLines` there (`np04-feast#0`, `np13-broadcast#2`).
3. **E6 Eternal reflection.** When E6 opens, check other saves read-only (`has:nubbin:eternal`, Free Grove and Hazel's Grove). If one exists, create in the Multiverse save a reflection of the player's oldest living Eternal (same name, look and age). The `eternal` ending removes only that reflection. Never write any other save.
4. **E6 line inserts.** New conditional insert in E6 notes: if `mv-doom` = ally, add two lines after `mv-e6-trapscene#4` (indices before any other insert).
5. **Flags and checks renamed.** `mv-mk-lantern` retired (MK8 now sets `mv-mk-sky`); `mv-sp` = 'complete' → `mv-sp-complete`; per-quest `mv-<code>` flags on every IM/FF/UL/MK/SP quest; check verbs `expedition:clear:mv-…` in the MK/SP lines; item `dubloon-grog` → `dubloon-pepper-sauce`; reward `nq31-sneak-unlock` (feature) → `nq31-hoard` (title); `nq32-giant-jelly` is now a one-time item granted when `np-line-complete` is first set.
6. **SP3/SP4 swap.** Quest ids `mv-sp03` (now Overt-Kill) and `mv-sp04` (now Angela) and their scene and reward ids swapped content. Any save data or test fixtures keyed on the old ids need the same swap.
7. **NQ1 Omelette.** The Giant Omelette must give a slice whenever NQ1 is open (no per-visit limit).
8. **script-book.** Regenerate `script-book/` (`tests/tools/script-book.ts`) once all fixers finish; six of its pages still show old text.

## 6. For Maor

- **Freebie model in results.ts (not my file).** `results.ts` already models every Neopia freebie as "once per Nubbin per life" (Omelette, Jelly, Tombola, Fruit Machine, Snowager, the Wheels, Fishing, Anchor Management, Tomb, Meteor, Lab Ray, Coltzan's Shrine). That isn't per visit, but it isn't strictly "one-time or unlimited" either (canon 22), since each new Nubbin life gets another go. I followed canon 22 literally for the quests: NQ31 no longer unlocks a repeatable Snowager sneak, and NQ32's Giant Jelly is a single gift. If you rule that "once per Nubbin per life" counts as one-time, two small reverts would line the quests up with results.ts:
  - NQ31 reward → `{ id: 'nq31-sneak-unlock', kind: 'feature', label: 'Snowager Sneak', description: 'Each Nubbin may sneak into the Ice Caves once in its life for an item from the hoard. If he wakes, it is chilled, not hurt.' }`, and the guide's line → "Each of your Nubbins gets one try in its life. He doesn't notice who comes back."
  - NQ32 reward → `{ id: 'nq32-giant-jelly', kind: 'feature', label: 'The Giant Jelly', description: 'The wall behind the Food Shop now lets you through: one jelly per Nubbin per life, from a land that does not exist.' }`
  Otherwise results.ts needs the same one-time rule (a hand-off for its owner).
- **Neopia retags beyond the plots.** You asked for the war and Haunted Woods *plots* to be `main`. I also moved Edna's Quests (NQ22–NQ26) and the Esophagor (NQ28) from `adult` to `main`: they are the same "darker Haunted Woods" content, and with the grog gone nothing in them is boozy or crude.
- **Tien's line (E4).** The reviewer's "I lost to you once" is wrong for this game: Tien wins the 22nd Budokai (DB14). I inverted it.
- **SP swap ids.** I swapped the ids along with the codes (Overt-Kill is now `mv-sp03`), so ids, codes and comic order all agree. Say if you'd rather keep the old ids.
- **Unverified facts from the review** (left as written): the five Jellyneo Book of Ages pages were blocked, so NP4, NP5 and NP9 plot details are not web-verified; the comet's time in A9 (8:42 on 7 October) is from memory. The review lists no unverified quotes for these files.
- **Check results.** tsc and eslint pass. content-check reports 20 problems, none in my files: all are "edu missing" entries for scenes other fixers added during this run (`c5-considered`, `c9-open-sold`, `c11-moss-kept`, `c11-moss-passed`, `end-hazels-grove-open`, `s19-*-alone`), each missing in both bands. It reported 0 when I started; the Learning Grove mirror pass should clear them.

---

# log-edu-campaign-1-2
## Learning Grove fix log: campaign-1-2 (2026-10-14)

Files (REPO/src/content): `edu-campaign-1-sprout.ts`, `edu-campaign-1-reader.ts`, `edu-campaign-2-sprout.ts`,
`edu-campaign-2-reader.ts`. Originals mirrored: `campaign-book1.ts`, `campaign-book2.ts` (diffs in
`SCRATCH/fix/diffs/`). Pre-edit copies: `SCRATCH/fix/edu-c12-bak/`.

Validation: `tsc --noEmit -p .` clean; `eslint` on the four files clean; `content-check` problems 22 → 20
(both "missing c5-considered" gone; the other 20 belong to other areas). `content-check --warnings` lists
nothing for these four files. A scratch check (`SCRATCH/fix/c12check.ts`) confirms every line is within the band
cap (sprout ≤ 14 words, reader ≤ 30), every scene is within the band's line range, and no ask lesson marks two
`best` options.

## Changes

M = mirror of the fixed original; R = review-edu.md item (must / should / nice); C = canon sweep.

| File | Scene | What changed | Why |
| --- | --- | --- | --- |
| 1-reader | c2-corvin (refuse) | "…which it has never once done for you" dropped: "He goes, and the gate swings shut behind him all by itself." | M (S1) |
| 1-reader | c2-corvin-l1 | Only "the stuck gate" is `best`; each reply now names the other clue too. | R nice (two `best`) |
| 1-reader | c3-close-l1 | "much warmer than 0 °C" gets "(32 °F)". | R nice |
| 1-reader | c4-open | "about a week" → "one morning"; vanishing joke → "Hazel doesn't vanish. Hazel leaves notes." | M (S2, S3) |
| 1-reader | c4-close | "“Crunchy!” he says" → "she says". | R must; C (Sparks she) |
| 1-reader | c4-close | Song lines: first line `luna`, the rest `chorus` (was narrator). Note updated. | M (S30) |
| 1-reader | c4-tale (ask-loved) | "a flower on that hill since before the trees were trees" → she died before the hill had flowers; Moss planted hers beside Briar's by the big stone; sits with them both (one line became two). | M (M6); R should; C (canon 2) |
| 1-reader | c4-tale-l1 | One `best` (telling, child to child); the songs reply now leads back to oral history. | R nice |
| 1-reader | c4-tale-3 | "a bag too big for her" → "lost inside a coat far too big for her, with a chin like yours". | M (M5); C (canon 1) |
| 1-reader | c4-tale-3-l2 | One `best` (holding on too tight); the other theme's reply says it is a theme too. | R nice |
| 1-reader | c4-out | "He is asleep again… tell him… he had" → she/her. | M (M1); R must |
| 1-reader | c4-out-l1 | Prompt, option labels and all replies: he/his/him → she/her (eight lines). | R must; C |
| 1-reader | notes | Song speakers, ask-loved canon, one-`best` rule. | bookkeeping |
| 1-sprout | c4-close | First song line `LUNA`, the rest `CHORUS` (new `CHORUS` const); c4-close-l2 refrain lines `CHORUS`. | M (S30) |
| 1-sprout | c4-tale-l1 | "Most water changes…" → "Water changes…". | R nice |
| 1-sprout | c4-tale (ask-loved) | "There is a flower on the hill for her" → "Before the hill had flowers." / "When Briar's flower came up, I planted one for her, right beside it." / "I still go and sit by them both." This also settles the self-contradiction with ask-briar ("the first flower"), which is kept. | M (M6); R should; C (canon 2) |
| 1-sprout | c4-tale-3 | "One spring came a young woman in a too-big coat, with your chin." | M (M5); C (canon 1) |
| 1-sprout | header, notes | Song speakers; ask-loved canon. | bookkeeping |
| 2-reader | c5-open | Ember: "won every race he entered her in"; new clause "When he offered to keep her, I let him." folded into her "taste" line (no extra line). | M (S6) |
| 2-reader | c5-open | Narrator's mid-scene "It's called regret" line removed; the word now comes in lesson l2's prompt (glossary entry kept); l2 `after` 13 → 12. | R nice |
| 2-reader | c5-circuit | Corvin now answers something: "Your breath is smoking, I see. Cold, is it?…" (in his line, so the scene stays at 16 lines). | M (S7) |
| 2-reader | c5-considered | **New scene** (6 lines, 2 lessons). | M (new scene) |
| 2-reader | c7-open | Luna: "I put it down to her being odd. It was never just her, was it." (was "I told myself I'd imagined it"). | M (S8) |
| 2-reader | c7-stillness (sable) | "in spring" → "at midsummer". | M (M11) |
| 2-reader | c7-stillness-2 (cinder) | Children chanting at dawn → "Fern is humming a skipping rhyme to her hens"; cinder-love no longer re-explained: "You know the valley's word for a love that holds too tight. She would have known it was fair." | M (S9, N5) |
| 2-reader | c7-stillness-2-l1 | parentNote "(cats, rabbits, horses)" → "(cats, rabbits, dogs)". | R should |
| 2-reader | c7-stillness-3 (quiet) | "It took her a whole winter to stop asking me things…" → "I sat next to her for a whole winter before I said one word. She fidgeted from the first frost to the thaw." | M (M5); C (canon 1) |
| 2-reader | c7-close | "heavier than she looks" (duplicate "heavy" gone); `SABLE('…')` → narrator "Sable says nothing. Her ears stay up."; unused `SABLE` const removed. | M (S10); C (canon 17) |
| 2-reader | c8-ledge, c8-ledge-s4 (shared `C8_LEDGE_REST`) | Marina: "The water never freezes. Only its rim did, once, in the White Year." (one line, so `after` indices hold). | M (S11); C (canon 6) |
| 2-reader | c8-open | Nova: "For a year" → "ever since the snow went". | M (S12); C (canon 13) |
| 2-reader | c8-close (feed) | "One bowl at a time. For a year." → "…since the snow." | M (S12); C (canon 13) |
| 2-reader | c8-close-l1 | Best reply "Every day. For a year." → "Every day, since the end of the winter." | C (canon 13) |
| 2-reader | c8-nova-l2 | Added Nova: fireflies are a summer sight; the Wellspring keeps the Hollow warm enough. | R nice (fireflies) |
| 2-reader | notes | 18 scenes incl. c5-considered; Sable narrated; fireflies. | bookkeeping |
| 2-sprout | c5-open | Ember: "She came back grey. He kept her. She won't look at me." | M (S6) |
| 2-sprout | c5-open-l1 | Prompt and replies moved from Moss (absent) to the narrator. | R should |
| 2-sprout | c5-close-l1 | Prompt and replies moved from Moss (absent) to the narrator. | R should |
| 2-sprout | c5-considered | **New scene** (6 lines, 1 lesson). | M (new scene) |
| 2-sprout | c8-nova-l1 | Prompt opens with Nova: fireflies like summer; the warm spring keeps them cosy here. | R nice (fireflies) |
| 2-sprout | c8-close-l2, c8-nova | "okay" ×3 → "all right" (house spelling). | R nice (spelling mix) |
| 2-sprout | notes | c5-considered; narrator lesson prompts; fireflies. | bookkeeping |

Mirrors checked and not needed: `c3-open` "Whose is it?" and `c3-close` "months" (neither edu band has the
line; reader c3-close already says it's early summer and nowhere near cold enough); `c4-open` "Lantern Night"
(already capitalised in both bands); `c4-out` "it is gone" (reader already "it's gone"); `c5-circuit` and
`c7-close` in sprout (no matching line); Marina's Wellspring line in sprout (it never claimed "never freezes").

## New scenes

- `sprout:c5-considered`: Corvin at the start line ("Still thinking about it? My offer is still there."),
  frost under his hand, the Nubbin looks at its toes. Lesson `sprout:c5-considered-l1`: sel, ask, CASEL: Social
  awareness (how does your Nubbin feel? worried; staying close helps). Reachable because sprout keeps
  `consider` in c2-corvin.
- `reader:c5-considered`: same beats plus Ember ("He gave me time to think, too, once."). Lessons
  `reader:c5-considered-l1` (science notice, 2-PS1-4: frost forms on surfaces at 0 °C (32 °F) or colder, so the cold
  is coming from his hand) and `-l2` (sel ask, CASEL: Social awareness: reading the Nubbin's worry).
- Neither scene has choices (the original has none).

## Counts

- Table rows: 41 across 4 files (1-reader 13, 1-sprout 5, 2-reader 16, 2-sprout 7). 37 are content changes
  and 4 are notes or headers.
- Content rows by source: 22 mirror the originals, 17 apply review items and 1 is canon only. Some rows have
  more than one source.
- Review items that touch these files: 11, all applied (2 must, 3 should, 6 nice to have).
- New scenes: 2 (c5-considered in each band), with 3 new lessons.

## For Maor

- **Notebook day count vs canon 13.** Hazel's notebook in c8-close says "Day 300-something", in the main
  script (campaign-book2.ts) and in the reader. If she left at the end of the winter and chapter 8 is early
  autumn, she has been out about 200 days. "Since the snow" now appears in the same scene. Either the count runs
  from the doctor's "a year" (fine as is) or the original wants "Day 200-something". I mirrored the original and
  left it; the campaign fixer may want it.
- **Sprout keeps "When she died, the first flower came up on the hill" for Briar** (c4-tale-2, ask-briar). With
  ask-loved now saying Moss planted his first love's flower beside Briar's, the two agree, so I didn't change it.
- **c5-circuit (reader)** was already at the 16-line cap, so the original's new narration ("Your breath smokes…
  Corvin sees it") went into Corvin's own line rather than a new one.
- **The Learning Grove still quotes campaign lines** in places (the Lantern Song, Hazel's letter, some Moss
  lines). That is the campaign's own text, not a source quote, so the no-quotes rule doesn't apply. I took the
  brief's "don't paste the adult text" to mean new changes only, and reworded each mirrored change.

---

# log-edu-campaign-3
## Fix log: Learning Grove, campaign-3 (2026-10-14)

Files (REPO/src/content): `edu-campaign-3-sprout.ts` (S), `edu-campaign-3a-reader.ts` (3a, ch9–10),
`edu-campaign-3b-reader.ts` (3b, ch11–12, endings, epilogues).
Sources: `fix/diffs/campaign-book3.diff`, `fix/log-campaign.md` (section 2 and H3), `fix/canon.md`,
`part-m/review-edu.md`.

Validation: `tsc --noEmit -p .` clean for these files; `eslint` on all three clean; `content-check.ts`
reports `problems: 0`, and `--warnings` lists nothing from these files (the three earlier pronoun warnings
for c10-lull and c10-dawn are gone, and the three long-line warnings my first pass created were fixed).
Every scene is now within the band caps (sprout ≤ 10 lines, reader ≤ 16).

## 1. Changes

M = mirror of a campaign-book3.ts change (log-campaign item in brackets), R = review-edu item,
C = canon sweep, — = refactor only.

| File | Scene | What changed | Why |
| --- | --- | --- | --- |
| S | c9-open | Corvin: Hazel stood at his gate in the autumn and didn’t knock. Split into `C9_ARRIVE` / `C9_GARDEN` / `C9_CHOICES` / `c9RowLesson`. Dropped the “safe but not happy” narrator line (its lesson says it) to stay at 10 lines | M (S13, canon 12) |
| 3a | c9-open | Same autumn line; “I’ll work it out”; split into shared consts and lesson builders (`c9MotiveLesson`, `c9TrustLesson`); lesson anchors moved | M (S13, N2, canon 12, 19) |
| S, 3a | c9-shard-forced | Ash follows Ember home, three steps behind, at the end | M (M9) |
| S, 3a | c9-shard-collector | Rewritten: it now only follows force. The pens hang open, Corvin laughs and sees his own method in yours, and the tense is past (“kept my garden quiet”). “With this, they’ll never leave you” is kept. It ends with Ash following Ember. Lesson anchors moved | M (M4c, M9) |
| S, 3a | c9-sable | She waited at the gate once before; this time she comes to meet you. Lesson anchors moved | M (M8) |
| 3a | c9-close | Marina: “That’s the trouble with this valley.” Moss: Hazel wanted Corvin to walk it down the lane himself, and “He couldn’t.” New Moss beat on why only the fourth shard and why not long ago (“let the other three sleep… keep watch”; “None of us was grey, back then”). Two narrator lines merged to stay at 16; lesson 1 now plays after the pie line | M (S32, S14, N4) |
| S, 3a | c10-vigil | The Lantern Song answer line is speaker `chorus` (new `CHORUS` const). 3a split Luna’s line in two; to stay at 16 lines the two opening narrator lines were tightened (the hand’s-width frost detail was cut) | M (S30) |
| S, 3a | c10-lull | Pixel is “her box” / “when she wakes up” | C (Pixel she), brief |
| 3a | c10-bearer-sable | “The cold has already done its worst to her… That is the sad part” replaces “nothing left in her to take… the terrible thing” | M (S15) |
| 3a | c10-ledge | The bearer goes untied (“no knot is that small”); “Moss told you the first Nubbins came up out of this… Now you believe him” | M (S16, S17) |
| S, 3a | c10-kept | A ring of frost stays round the spring (S: new line; 3a: replaces “closes under its ice”). S lesson anchor moved | M (S11, canon 6) |
| 3a | c10-wisp | “The one who carried the stone here stands blinking…” replaces “a grey face” | M (S19) |
| 3a | c10-moss-walks, c10-moss-walks-bearer | “I sat beside Hazel for a whole winter…” (Moss sat, not Hazel) | M (M5, canon 1) |
| 3a | c10-bank-wisp, -moss-returned, -moss-gone | “Steam rises off the spring again” replaces the ice creeping back | M (S11, canon 6) |
| S | c10-dawn | New: “The fourth one is dark. Ember hugs it anyway.” “Sparks says she didn’t!” Puck “across the last of the pond ice”. Lesson anchors moved | M (S18); R must (Sparks); R nice (pond ice) |
| 3a | c10-dawn | Fourth lantern dark with Ember’s arms round it; Pixel: “She didn’t. I was watching her hands…” Lesson anchors moved | M (S18, M2); R must |
| S, 3a | c10-moss-mourned | The flower is by the flat stone where he sat | M (S22, canon 15) |
| S, 3a | c10-moss-light | The light drifts down “on/through the morning air” (no valley) | M (N6) |
| S, 3a | c10-close | Neutral on the keep route: “Nobody wants to go home” / “not one of them willing to” | M (S31) |
| S | c10-bramble | Ear “folds over at the tip”; Fern touches the folded ear | M (S20, canon 10) |
| 3a | c10-bramble | Same, and Hazel’s “Torn ear” is cut. The inheritance lesson was rebuilt: inherited = the fold; during life = how thin she is (she went hungry); learned = manners | M (S20, canon 10); lesson fixed |
| 3b | c11-open | Hazel: her letter said she’d gone up the hill (“optimistic about the timing”), merged into her “not staying long” line; “walk the stone home. He couldn’t. You did.” | M (N7, S14) |
| S, 3b | c11-moss-gone | Tail moved to shared `MOSS_GONE_TAIL`; no text change | — (as in the main file) |
| 3b | c11-sable | “You think of the first night, and of every night since” (route-neutral) | M (S25) |
| S | c11-close | Opens “Days go by. Gran Hazel sleeps a lot, and wakes for the good bits.” “It’s the best part” cut. The frog is now an owl, and the animal-sound lesson is rebuilt round it. Lesson anchors moved | M (M10, N3, canon 4); R nice (frog in December, applied to both bands) |
| 3b | c11-close | Same opener; “It is the best part” cut; frog → owl; last two lines merged (stays at 16); lesson 1 “On the longest night the pond was ice”; anchors moved. The s8Done line swap is written into the notes (see section 3) | M (M10, N3, canon 4); R nice |
| S, 3b | c11-gate | Rewritten as a return: Corvin is back, tries the latch once and folds his arms; Hazel: “Don’t look at me, love… It’s your gate now” and “He said he’d stand there till first light…”. gate-cruel answer: nobody made him, he chose the hour. Same choice ids. 3b think question rewritten to match (he chose to wait; Hazel has handed it to you); lesson anchors moved | M (X1, canon 5) |
| S, 3b | c12-walk-corvin | He comes down with empty hands; her lantern stays burning at the top | M (M7) |
| 3b | c12-walk-alone | “alright” → “all right” | R nice |
| S, 3b | end-hazels-grove | Body moved to `HAZELS_GROVE_BODY` (3b also `obviouslyLesson`). 3b: “Sable makes a small sound” | M (S27, X4) |
| S | end-eternal-dawn | “Real or pretend?” lesson replaced by a gentle SEL notice (being loved and chosen) | R nice |
| S, 3b | end-eternal-dawn-moss | “The other is learning how” | M (S33) |
| S, 3b | end-eternal-dawn-last, end-empty-lantern | “On Lantern Night” | M (C1, canon 18) |
| S, 3b | end-moss-sleeps | His flower by the flat stone was fully open by spring (no new flower in the long grass); 3b “did not come back” | M (S22, canon 15) |
| S, 3b | end-collector-sold | “When the pens opened, you never went looking for / looked for the first one” | M (M4d) |
| S, 3b | end-collector-kept | Moss stays on the hill after Hazel goes up and never comes down. 3b no longer says he faded there | M (S24) |
| S, 3b | end-epi-wisp-spared | Under the cottage step | M (S34, canon 16) |
| 3b | end-epi-gate-none | “before you were born” cut | M (N8) |
| S, 3b | end-epi-walk-moss-stayed | Rewritten: he rides up on her shoulder and at the top turns to face the Grove for the first time since the Long Night; he stays and fades; two flowers. Lesson anchors moved | M (X3) |
| 3b | end-epi-walk-sable | Mid-epilogue definition of routine cut (“It has become her routine…”); the word stays in the glossary | R nice |
| S, 3b | end-epi-walk-corvin | Left burning at the top, fetched at first light, hangs by the cottage door. 3b fire-safety lesson now says someone always keeps an eye on a flame, so it no longer contradicts the lantern left lit; S lesson anchor moved | M (M7) |
| 3b | end-epi-walk-alone | “alright” → “all right” | R nice |
| S, 3b | end-epi-told | They meet “on the day she went up (the hill)”. 3b: mid-epilogue definition of tradition cut (glossary keeps it) | M (M10); R nice |
| S, 3b | endings `hazels-grove.how` | No longer asks for “A home”; either gate choice will do | M (M3, canon 24) |
| S, 3a, 3b | notes / CHECKS / glossary | Mirror notes, collector-route list and fading list updated. S CHECKS: `edu:act:lift-push:air`. 3b glossary: “body language” (c11-moss-kept) | — |

Checked and needing no edu change: c10-bearer-sable (S’s “The cold can’t hurt her more” already fits),
c10-ledge (S), BANK_DAWN (S never had the ice line), MOSS_GOES_IN (S has no Hazel-winter line), c11-open (S),
c11-moss-here (now unmade routes only; text unchanged), c11-sable (S already neutral), end-epi-gate-none (S),
end-hazels-grove-last. c9-close (S) has no Byte joke, no “bring it back” line and no grey-carrier rule, so the
why-only-the-fourth beat wasn’t added there.

## 2. New scenes (8 entries)

| Scene | Sprout (`edu-campaign-3-sprout.ts`) | Reader |
| --- | --- | --- |
| `c9-open-sold` | Shares the arrival, garden and choices; Corvin points out “your old Nubbin” in the second row. Lessons: sorry feelings (CASEL: Self-awareness) and the third-row count (ELOF: Mathematics) | 3a. The sold Nubbin is in the second row. Lessons: a think question on your own part in the wrong (CASEL: Self-awareness) and the shared trust question (CASEL: Responsible decision-making). All three choices kept |
| `c11-moss-kept` | Moss on the hill with his back to the Grove; Hazel: “I know. I know.”; ends on “it’s not too late”. Lesson: reading a feeling from a turned back (CASEL: Social awareness) | 3b. Hazel waits for him as he once waited for her. Lesson: body language (CASEL: Social awareness) |
| `c11-moss-passed` | “I passed Moss on the path… He said, ‘You’re late.’” plus `MOSS_GONE_TAIL`; death said plainly. Lesson: smiling and sad together (CASEL: Self-awareness) | 3b. Lessons: a think question on his last joke (RL.3.3) and grief with good memories (CASEL: Self-awareness) |
| `end-hazels-grove-open` | “No gate now! Friends still lift and push at the empty air.” plus shared body. Lesson: habits, a do lesson (ELOF: Approaches to Learning) | 3b. The canon first line in reader voice plus shared body. Lessons: habit as remembering (RL.3.3) and the OBVIOUSLY lesson (L.2.4) |

`c5-considered` is Book Two (edu-campaign-2), so it is outside this area; content-check no longer reports it.

## 3. For Maor

- **s8Done swap in the Learning Grove.** The sim swaps the c11-close line by the main scene’s text. Reader
  c11-close words it differently, so the swap is written into the 3b notes: if s8Done, line 7 “The thin grey Nubbin
  wakes, looks at you, and goes back to sleep.” becomes “Gran Hazel’s arm is empty now. She keeps it crooked
  anyway, out of habit.” The sprout c11-close never mentions the Nubbin, so it needs no swap. The engine has to
  use the edu line, or swap by index (line 7 in reader).
- **Frog to owl.** The review flagged the reader’s December frog. I changed both bands to an owl, which is accurate
  for midwinter. The main scene (`c11-close`) still has the frog, so it may be worth passing to the campaign fixer.
- **Collector-route scenes in sprout.** c9-open-sold and c11-moss-kept can only be reached from a main-game save,
  because sprout drops “sell” and “keep”. Both are gentle and end on “it’s not too late”, as the existing ones do.
- **Moss on the keep route.** end-collector-kept no longer says he faded (canon: “never came down”).
  end-epi-walk-moss-stayed still says plainly that he faded beside Hazel, as both bands did before. That is the only
  keep-route scene that names his death.
- **Lesson rebuilt.** The 3a c10-bramble inheritance lesson rested on the torn ear, which canon 10 removes. It now
  contrasts the inherited fold with thinness from going hungry and with learned manners.
- No speaker ids needed changing here (no `mags` or `bohdi`), and no outside-work quotes or near-quotes were found
  in these three files.

---

# log-edu-side-1-10
## Fix log: Learning Grove, side stories S1–S10

Files (all in `REPO/src/content/`):

- `edu-side-1-sprout.ts` (sprout S1–S10)
- `edu-side-1-reader.ts` (reader S1–S5)
- `edu-side-2-reader.ts` (reader S6–S10)

Sources: the diffs `side-stories-main.diff`, `side-stories-fun.diff` and `side-stories-fun-2.diff`, the side fixer's log `log-side.md`, `canon.md` and `review-edu.md`.

Counts: **54 change rows** (21 sprout, 10 reader S1–S5, 23 reader S6–S10), **2 new scenes** (one per band), **3 review items applied** (1 should fix, 2 nice to have), **0 skipped**.

## 1. Changes

Key: **M** = mirrors the fixed original. **C** = canon sweep. **R** = review item. **L** = lint.

### Sprout (`edu-side-1-sprout.ts`)

| Scene | What changed | Why |
| --- | --- | --- |
| sprout:s1-hazel | Young Hazel's coat is now "too big"; her angry "Are you ever going to talk?" became "I don't know what to do. Do you?"; added "She wriggled and fidgeted. But she never asked me to talk."; "In spring, I said one word. 'Yes.'" became "When the ice melted, I looked up and said, 'You'll do.'"; dropped the opening lantern line to stay at 10 lines; lesson `after` 4→3 | M (fun M1), C1, R (should fix, edu-side-1-sprout.ts:367) |
| sprout:s5-list | "Her life is nearly over" became "She is fading." plus "Fading means her life is nearly over."; "Hazel's tree" became "Hazel's first tree"; lesson `after` 5→6 | M (fun S18, N14); EDU-STYLE (say what "fade" means) |
| sprout:s6-kitchen | `sit` choice: "Rule three. Sit and wait." became "Gran used to sit on the floor too. Like it was a chair!" | M (fun-2 S20, third-rule cap) |
| sprout:s6-register | Cover is now just "EGGS."; new line "Inside, a page says: 'Given away.'"; Egg 41 is "Given to Ember, aged fifteen"; lesson `after` 3→4 | M (fun-2 N15, M5), C7 |
| sprout:s7-week | Choice `rule-three` label: "Sit down by Null, Byte. And wait." (id unchanged) | M (fun-2 S20) |
| sprout:s7-complete | "Nobody told him to. It won't last!" (the shoelace joke stays open) | M (fun-2 S9) |
| sprout:s8-ring | Torn ear became "Her ear folds over at the tip." | M (fun-2 C1), C10 |
| sprout:s8-edge | New line: the youngest's ear "folds over at the tip too. Just like hers!" | M (fun-2 C1), C10 |
| sprout:s8-gap | "Eight months I've come here" became "I sit by these roots whenever I pass." | M (fun-2 S8), C9 |
| sprout:s8-reunion | "Bramble leans on Fern's leg" became "Bramble sits down on Fern's boots. Both boots! And she stays." | M (fun-2 N13) |
| sprout:s8-one-short | "hasn't been here for a while" became "isn't here tonight" | M (fun-2 S8) |
| sprout:s8-complete | The last five lines are now the shared `S8_TAIL`; the quest notes now cover ears and the variant | M (fun-2 M4) |
| sprout:s9-trowel | `sit` choice: "Rule three. It works on grannies too." became "There. That's better than any words." | M (main S20) |
| sprout:s9-yours | "He'll come back tomorrow" became "at the next sunset" (clears the timer lint); added "I've done my part." | C5, L |
| sprout:s9-ask | "I'll come back in the morning" became "I'll stand right here till morning. If it's still shut, I'll understand."; new line "He steps back into the dark lane. He doesn't go far." | M (main M2), C5 |
| sprout:s9-gate | Dew became frost: "He stood there all night." / "Frost sparkles on his coat."; the dew lesson is now a frost lesson (still K-ESS2-1), `after` 2→3 | M (main S10), C5 |
| sprout:s9-gate-family | Same frost lines; "Your friends came to my gate" became "Things have reached me this week. From your side of the valley." / "Things people said. Things people found. I kept them all."; lesson `after` 7→8 | M (main S10, S11) |
| sprout:s9 (quest notes) | Canon 5 note added | C5 |
| sprout:s10-step | Choice label "Okay, Gran" became "All right, Gran" | R (nice to have, okay/OK spelling) |
| sprout:s10-night-told | Keepers no longer sleep on blankets: "Friends have stayed late by the pond." / "Nobody wants to go first. Gran sends them home, one by one."; the crying is "Down the lane" | M (main M3) |
| sprout:s10-letter-told | "Nobody went home" became "Your friends are already at the gate. Waiting for you." | Continuity with the night-told fix (see For Maor 1) |
| header, variants comment, CHECKS | The header now names SIDE_STORIES_FUN_2_VARIANTS; added `edu:clap:times:2` to CHECKS | New scene |

### Reader S1–S5 (`edu-side-1-reader.ts`)

| Scene | What changed | Why |
| --- | --- | --- |
| reader:s1-hazel | Moss's line now includes "She wriggled and fidgeted the whole time, and never once asked me to talk."; "thin coat" became "a coat too big for her"; the angry young-Hazel line became "I haven't the faintest idea what I'm doing. I don't suppose you have either." (sad); "Yes." became "Then, at the first thaw, I looked up at her and said, 'You'll do.'"; the l1 prompt was rewritten so it no longer quotes the removed line; glossary + "thaw" | M (fun M1), C1, R (should fix) |
| reader:s1-boats-ask | The candle stubs are now ones "a grown-up lit"; in l1 the candle rule became "only a grown-up lights the candles" (replies for 2 and 3) | R (nice to have: grown-up lights the candle) |
| reader:s2-fruit | Cut "So is the fruit from the night before." | M (main N2) |
| reader:s3-stands | `gap` choice: "Ten heads… ten" became "Five heads… five" | M (fun S15) |
| reader:s3-truce | "After the longest night" became "After midwinter" | M (fun N6) |
| reader:s3-moot | The plates go "on the bench by the pond, between the two groups. Sun and Moon come to look"; Fern's Bramble line stays at index 5 | M (fun N5) |
| reader:s3 (notes) | The note now says S3 opens at Lantern Night in chapter 4 | M (fun C2), C11 |
| reader:s5-list | "thinning. Not the glow. The other one." became "fading. Not her glow. Her."; "oldest tree" became "first tree" | M (fun S18, N14) |
| reader:s5-secret | "Hazel's third rule. Fossil knew it before I did." became "Nobody ever taught her that. She just knew, years before I did." | M (fun S20) |
| reader:s5-water-ask, reader:s5-gift | Named Marina and Fossil where "her"/"she" tripped the Dusty pronoun lint. No meaning changed. | L |

### Reader S6–S10 (`edu-side-2-reader.ts`)

| Scene | What changed | Why |
| --- | --- | --- |
| reader:s6-kitchen | `sit` choice: "Rule three…on my hand" became "Hazel used to do that. Sit on the floor as if it were a perfectly good chair. It drove me mad." | M (fun-2 S20) |
| reader:s6-register | The cover reads "EGGS."; new line for the "Given away." section heading; Egg 41 is "aged fifteen"; lessons `after` 5→6 and 7→8 | M (fun-2 N15, M5), C7 |
| reader:s6-complete | "since she was twelve" became "fifteen" | M (fun-2 M5), C7 |
| reader:s6 (notes) | Added the age-15 and register-cover notes | M |
| reader:s7-week | Choice `rule-three` label: "Sit down beside Null, Byte. And wait." | M (fun-2 S20) |
| reader:s7-complete | Shoelace: "…Nobody had to tell him. It won't last." | M (fun-2 S9) |
| reader:s7 (notes) | "Pixel is written without pronouns" became "Pixel is she/her"; added the shoelace note | C3 |
| reader:s8-further | "I've been going back ever since" became "I followed them once, years ago. I look in whenever I'm passing." | M (fun-2 S8), C9 |
| reader:s8-ring | Torn ear became "whose left ear folds over at the tip" | M (fun-2 C1), C10 |
| reader:s8-edge | The youngest's ear "folds over at the tip, just like hers" | M (fun-2 C1), C10 |
| reader:s8-gap | "Eight months I've been coming here" became "Whenever I pass through the valley, I come and sit by these roots…" | M (fun-2 S8), C9 |
| reader:s8-reunion | "Torn ear" became "folded ear"; the shin lean became "sits down on Fern's boots, both of them at once, and stays put" | M (fun-2 C1, N13) |
| reader:s8-one-short | "hasn't been at the ring for a while" became "isn't at the ring tonight" | M (fun-2 S8) |
| reader:s8-complete | Hazel: "Ear folds over at the tip."; the tail is now the shared `S8_TAIL` ("folded ear"); the two lessons are now `s8TailLessons(5)` (same content and indices) | M (fun-2 C1, M4) |
| reader:s8 (notes) | Canon notes on the ears, boots and Nova, plus the variant | M, C |
| S9_GATE_OPEN (reader:s9-gate, reader:s9-gate-family) | Dew became "He has been there all night." / "There's frost on his shoulders: the ordinary kind, the kind that melts."; the hinge lesson `after` 3→4; think question `after` 6→7 (gate) and 8→9 (family) | M (main S10), C5 |
| S9_FAMILY_EXTRA (reader:s9-gate-family) | Now "Things keep reaching me this week, from your side of the valley. Things people said. Things people found." | M (main S11), C27 |
| reader:s9-trowel | `sit` choice: "Rule three. Works on grandmothers too." became "There. Better than anything you could have said. Don't go getting big-headed about it." | M (main S20) |
| reader:s9-ask | "I'll come at first light" became "I'll wait here till first light. If it's still shut then, I'll understand. Better than anyone."; new line: he steps back into the lane, "Not far." | M (main M2), C5 |
| reader:s9 (notes) | Canon 5 note | C5 |
| S10_LETTER (reader:s10-letter, reader:s10-letter-told) | The lantern is "back on the hook… Somebody carried it down at first light." / "You haven't lit it yet."; grief lesson `after` 2→3; letter lesson `after` 12→13 | M (main S2) |
| reader:s10-wish2 | "never once watched one" became "never once sat at the back. I was always in the gap, or down at the rail" | M (main S1) |
| reader:s10-wish3 | "A girl sits" became "A young woman sits" | M (main M1), C1 |
| reader:s10-night-told | No sleepers on blankets: "The Keepers have stayed late by the pond…" / "Hazel sends them home one at a time…"; the crying is "Down the lane" | M (main M3) |
| reader:s10-letter-told | "Most of them slept in the Grove. Nobody went home." became "By the look of them, none of them slept much." | Continuity (For Maor 1) |
| reader:s10 (notes), header | Timing and canon notes; the header names SIDE_STORIES_FUN_2_VARIANTS | M |

## 2. New scenes

Both are registered the way the edu files already register side-story variants: in the file's variant array, which `edu.ts` spreads into `EDU_VARIANTS`. `edu.ts` needed no change.

| Id | File, array | Lines | Lessons |
| --- | --- | --- | --- |
| sprout:s8-complete-dawn | edu-side-1-sprout.ts, `S8_VARIANTS` → `EDU_SIDE_1_SPROUT_VARIANTS` | 8 (Gran with the baby; Fern beside her all morning; "Fern told me all about it. Twice! Once crying." + `S8_TAIL`) | 1: maths, "twice means two times", K.CC.B.4, do `edu:clap:times:2` |
| reader:s8-complete-dawn | edu-side-2-reader.ts, `EDU_SIDE_2_READER_VARIANTS` | 8 (same beats in the reader voice + `S8_TAIL`) | 2: theme (RL.4.2) and animal parents (1-LS1-2), via `s8TailLessons(3)` |

The original scene has no choices, so neither version has any. No other new scene ids are in the three diffs.

## 3. Checks

- `npx tsc --noEmit -p .`: clean.
- `npx eslint` on the three files: clean.
- `content-check`: `s8-complete-dawn` is no longer missing in either band. The 4 problems left belong to other files (`c9-open-sold`, `c11-moss-kept`, `c11-moss-passed`, `end-hazels-grove-open`, reader band only).
- `content-check --warnings`: no warnings left for S1–S10 in either band. I cleared the `sprout:s9-yours` timer false positive and the three `reader:s5-*` Dusty pronoun false positives by rewording.
- Canon sweep, all three files:
  - Sparks and Pixel she/her, Dusty they: clean.
  - "You'll do." is now in both S1 and S10 in both bands, and S1 agrees with S10: young woman, coat too big, she never asked him to speak.
  - Briar's is the first flower: clean, and nothing claims an older flower.
  - Ember is 15 everywhere.
  - Ears: only Wisp is torn.
  - Wellspring: no freezing water.
  - Lantern Night is capitalised.
  - The third rule is named only in S1, S9 (`s9-yours`) and S10, and S10's "I thought I'd made it up" pair is kept.
- No outside-source quotes: the side stories have no childLines, and I wrote no new near-quotes.

## 4. For Maor

1. **Original continuity slip (not mine to fix): `s10-letter-told`.** In `side-stories-main.ts:1085` it still says "Most of them slept in the Grove. Nobody went home." The M3 fix to `s10-night-told` now has Hazel sending the Keepers home. In both Learning Grove bands I used neutral wording that fits either ("already at the gate… none of them slept much" / "Waiting for you"). The original line probably wants the same change.
2. **The sprout's new lesson for `s8-complete-dawn`** is a light counting beat ("twice"). Every other S8 sprout lesson stays as it was.
3. **The reader `s8-complete-dawn` reuses `s8-complete`'s two lessons** (the "Nothing's mine" theme and animal parents), because the scene shares the same tail. If you'd prefer a fresh lesson there, the tail lessons are one function (`s8TailLessons`) and easy to swap.
4. **The review item "Reader s1-boats lights candles without a grown-up"** is fixed in `reader:s1-boats-ask`. The candle rule in Briar's eleven rules is now "only a grown-up lights the candles", which also fits the existing 11 − 9 lesson.

---

# log-edu-side-11-22
## Fix log: Learning Grove, side stories S11–S22

Files (all in `REPO/src/content/`): `edu-side-new-a-sprout.ts`, `edu-side-new-b-sprout.ts`,
`edu-side-new-1-reader.ts`, `edu-side-new-2-reader.ts`, `edu-side-new-3-reader.ts` and `edu-side-new-4-reader.ts`.
Sources: `side-stories-new-1.ts` to `-4.ts`, their diffs in `SCRATCH/fix/diffs/`, `SCRATCH/fix/log-side.md`,
`SCRATCH/fix/canon.md` and `SCRATCH/part-m/review-edu.md`.

Counts: **57 table rows** (47 mirrors, 4 review items, 6 canon, style or lint fixes) and **10 new scenes** (5 per
band). All three review items that touch these files were applied: the should-fix on sun safety, and the
nice-to-haves on `s18-heart` (adapted) and `s21-complete`.

Mirror ids (M, S, N and C numbers) are the items in `log-side.md`. "Split only" changes in the originals (S19 in
that log) were not mirrored, except where an index-based note depends on them (S20 below).

## 1. Changes

### edu-side-new-1-reader.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `reader:s11-beetle` | New Clover line after “We can contain it”: ladybirds eat beetle eggs, she keeps a jar of them at home. | Mirror S16 (setup for step 4) |
| `reader:s11-ladybirds` | Clover’s line is now the payoff (“Off you go, then… Manners not required.”), not a second setup. | Mirror S16 |
| `reader:s11-jar` | “Keep the sun in front of you (never look straight at it), so your shadow’s behind you…” | Review (should fix, safety) |
| S11 goals, `s11-step3` hint | Same sun-safety wording. | Review, extended to the hint |
| `reader:s11-lens-l2` | Prompt “Quick test.” is now in-story (“While you’re looking: say you find a mouldy plum…”). | EDU-STYLE, no quiz time |
| `reader:s15-complete` | New line: Dashwood pushed the painted egg into Pip’s hands on his way out. Theme lesson `after` 7 → 8. | Mirror N19 |
| `reader:s16-yard` | Simile “like a jumper washed too often” is now “like a flag left out all summer”. | Mirror N4 (same simile) |
| `reader:s16-notes-l*` | Reply “Sparks says nobody asked him” is now “nobody asked Lug” (read as Sparks = he). | Known issue, canon 3 |

### edu-side-new-a-sprout.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `sprout:s11-beetle` | New Clover line: she has ladybirds at home, and they eat beetle eggs. | Mirror S16 |
| `sprout:s11-ladybirds` | Second Clover line is now the payoff (“Off you go, ladybirds! Gobble up the beetle eggs!”). | Mirror S16 |
| `sprout:s11-jar`, `s11-step3` hint | Adds “Never look right at the sun!” / “Don’t look right at the sun.” | Review (safety), to match the reader |
| `sprout:s15-complete` | New line: Dashwood gave Pip the painted egg as he left. Lesson `after` values shifted (7 → 8, 8 → 9). | Mirror N19 |
| `sprout:s12-settled` | New line: you sit beside Solo and wait for it to choose. Labels are now Solo’s decisions (“Solo picks the hum. You nod.” etc.). “gaps” line is spoken by Solo. Lesson `after` 5 → 6. Choice ids unchanged. | Mirror N12 |
| `sprout:s17-missing` | “Frost on the nursery roof” is now “Shiny conkers lie on the ground”. Lesson rewritten from “frost is ice” to signs of autumn (conkers, falling leaves). | Mirror S14 (no ordinary frost in chapter 7) |
| S17 notes | Adds the nursery payoff lines (open / shut) after index 3 of `s17-complete`, and the season note. | Mirror N11 |
| `sprout:s18-heart` | Delve: “Hazel’s egg book. Forty years of eggs are in it.” “register” choice adds “The book is only borrowed. When you want it back, I’ll carry it home.” | Mirror S4. Review nice-to-have (“every egg she ever hatched”), adapted |

### edu-side-new-2-reader.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `reader:s12-settled` | New narration: you don’t choose for it; you sit on the bank and wait for Solo to decide. Labels now Solo’s decisions. “gaps” line spoken by Solo. Choice ids unchanged. | Mirror N12 |
| S12 goals, `s12-step3` hint | “That’s Hazel’s third rule, more or less” → “Solo doesn’t need answers. It needs company.” | Mirror S20 |
| `reader:s17-missing` | Frost line → “The first conkers are down, and the nursery straw is damp with dew.” Clue-lesson option “frost on the roof” → “the straw is damp with dew”. | Mirror S14 |
| `reader:s17-wild` | “Grief doesn’t keep a calendar” → “Grief keeps a better calendar than I do.” Metaphor lesson rewritten: grief remembers the time of year (her chicks died in a cold spring), so it comes back on time. | Mirror N10 (the lesson was about this line) |
| S17 notes | Nursery payoff lines after index 2 of `s17-complete`; season note. | Mirror N11 |
| `reader:s18-heart` | “register” choice adds Delve: only on loan; he’ll carry it home himself the moment the family wants it. | Mirror S4 |
| (file) | Removed the now-unused `Y` speaker (eslint). | Validation |

### edu-side-new-3-reader.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `reader:s13-letter` / `-nomoss` (shared lesson) | Tobin no longer lists Hazel’s rules (“…sit and wait”); now “Hazel had three rules too, and hers were kind ones.” | Canon 14 |
| `reader:s13-letter-given` | The letter comes from the tin box under your bed, not your coat. | Mirror S5 |
| `reader:s19-fade` | Drops “Rule three works on wardens too.” | Mirror S20 |
| `reader:s19-fade-sable` | Drops “Rule three works on everyone.” | Mirror S20 |
| `reader:s19-question-sable` | “as if he were sat in your coat” → “sitting”. | Mirror N3 |
| `reader:s22-foot` | Nova got as far as the Ridge “every time”, not “once”. | Mirror S12 |
| `reader:s22-summit` | Staging no longer copies `s9-ask`: she says it to the valley first, then to the Worry, then to you. | Mirror S13 |
| S19 notes and file header | The alone version; shared scenes never name Moss or Sable; the third rule is not named in S19. | Mirror S7 |

### edu-side-new-b-sprout.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `sprout:s13-desk` lesson | Tobin no longer quotes “sit down and wait”; now “Hazel’s rules were kind ones.” | Canon 14 |
| `sprout:s13-letter-given` | You fetch the letter from its tin box (was “in your coat”). | Mirror S5 |
| `sprout:s14-sparks` | “Tilly has a letter from her” → “Hazel left Tilly a note.” | Mirror M7, canon 8 |
| `sprout:s14-gate` (“ask”) | She takes out the note, not the letter. | Mirror M7 |
| `sprout:s14-dragon` | Lesson no longer quotes the rule (“What can a friend do?” / sit close and wait). “roll” now ends with Tilly reading the torn die; “ask” ends with Tilly working it out. Only “sit” names the rule. | Mirror S20 |
| `sprout:s14-complete` | HERE BE HAZEL. SHE IS ALLOWED. | Mirror N8 |
| S14 notes | Note, not letter; Tilly isn’t Hazel’s grandchild; which choice names the rule. | Mirror M7, N8, S20 |
| `sprout:s20-declaration` | “Sparks’s cousin has come for the holidays” (was “is back”), so the line works for Bodge too. | Mirror N16 |
| `sprout:s21-help`, `sprout:s21-moss` | Moss is never named: “the little grey one”. Lesson prompt and reply updated. | Mirror M6 |
| `sprout:s21-shed` (“sit”) | Label “Sit down below the shelf, and wait.” Line “No. I’m just here.” | Mirror S20 |
| S19 and S21 notes, file header | The alone version; Moss never named in S21. | Mirror S7, M6 |

### edu-side-new-4-reader.ts

| Scene | What changed | Why |
| --- | --- | --- |
| `reader:s14-toad` | Byte: “We owe him two Shells, two, two, two… forever.” The ÷10 pattern lesson no longer uses pence: Byte cuts a Shell into 100 bits (200, 20, 2; 222 bits, then more twos forever). | Mirror N7 (the lesson used pence) |
| `reader:s14-sparks` | Hazel left Tilly a note, with just “Tilly” on the front (was “a letter, same as everyone”). | Mirror M7, canon 8 |
| `reader:s14-gate` | “It hardly ever does.” “ask” choice: the note, still folded. | Mirror N9, M7 |
| `reader:s14-gate-l2`, `reader:s14-dragon-l1` | “Gran” → “Hazel” in options and replies (Tilly isn’t Hazel’s grandchild). | Mirror N8’s reason |
| `reader:s14-dragon` | “roll” ends with Tilly reading the torn die (“The dice says… the dragon allows it.”); “ask” ends with Tilly working it out (“…She wants someone to sit with her. Fine. FINE.”). Only “sit” quotes the rule. | Mirror S20 |
| `reader:s14-complete` | HERE BE HAZEL. Closing line “Tilly still misses Hazel”. | Mirror N8 |
| S14 notes | Hazel “went off” and left Tilly a short note. | Mirror M7 |
| `reader:s20-declaration` | Line #5 split into #5/#6, as in the main scene, so the index notes match again. Lesson `after` 9 → 10. | Mirror S19/N16 (index notes) |
| S20 notes | Adds the Bodge swap for #3 (“Sparks’s other cousin has come…”) and says #6 stays in the sun-and-moon swap. | Mirror N16 |
| `reader:s20-declaration-l2` | Prompt “Test question.” → “Say the other fort sends Sturdy rollers at you…” | EDU-STYLE, no quiz time |
| `reader:s21-help` | Moss is not named: Clank holds “the little grey watcher from the hill”. Split into two lines. | Mirror M6 (known issue) |
| `reader:s21-moss` | “The little grey one leaves his hands…”; “something very old” (no “older than the trees”). Lesson prompt and reply updated. | Mirror M6 |
| `reader:s21-shed` (“sit”) | Label “Sit down below the shelf, and wait.” Lines “No. I’m just here.” / “Just here for what?” | Mirror S20 |
| `reader:s21-complete` | The Nubbin is “perched on his lantern hood, like a hat”, not curled round the wick. | Review nice-to-have (fire safety) |
| S21 notes | The narration never names Moss in S21. | Mirror M6 |

## 2. New scenes

Five per band, built from the five `SIDE_STORIES_NEW_3_VARIANTS` scenes (the S19 “Moss gone, Sable not bonded”
version). They are registered in the variants exports, next to the `-sable` scenes:

- **Reader** (`EDU_SIDE_NEW_3_READER_VARIANTS`, new array `S19_ALONE_SCENES`): `reader:s19-warmth-alone`,
  `reader:s19-climb-alone`, `reader:s19-hollow-alone`, `reader:s19-question-alone` and `reader:s19-fade-alone`.
  Plus `S19_CHOICES_ALONE` (`forgiven` and `remembered`, ids and `set` unchanged). Lessons:
  - cold at height;
  - grief in small moments (CASEL: Self-awareness);
  - 2 × 2 socks (3.OA.A.1);
  - a melt-and-refreeze snow crust (2-PS1-4);
  - Marina giving privacy (CASEL: Social awareness);
  - being brave on your own (CASEL: Self-management);
  - safe vs well, the theme (RL.4.2);
  - the forgiveness think question (CASEL: Relationship skills);
  - the simile of the light going (L.4.5);
  - giving someone quiet time (CASEL: Social awareness).
- **Sprout** (`EDU_SIDE_NEW_B_SPROUT_VARIANTS`, new array `S19_ALONE`): `sprout:s19-warmth-alone`,
  `sprout:s19-climb-alone`, `sprout:s19-hollow-alone`, `sprout:s19-question-alone` and `sprout:s19-fade-alone`.
  Plus `S19_CHOICES_ALONE`, with both choices kept. One lesson each:
  - missing someone (ELOF: Social and Emotional Development);
  - counting two pairs of socks to 4 (K.CC.B.5, new check `edu:count:socks:4`, added to `CHECKS`);
  - who is close by to help (ELOF: Social and Emotional Development);
  - the tight/night rhyme (RF.K.2);
  - feeling sad and what helps (ELOF: Social and Emotional Development).

In both bands you answer Cinder yourself (“No. They’re well.” / sprout “Not just safe. They’re well.”). “Badly. With
great enthusiasm.” is kept (sprout “Yes. Badly. But they love it!”). Nobody brings Moss’s pale light. Moss’s death is
said plainly in `s19-warmth-alone`. `s8-complete-dawn` is S8 and so not in this area.

## 3. Checks

- Sweeps across all six files:
  - pronouns: Sparks she, Pixel she, Dusty they;
  - “Yes.” as Moss’s first word;
  - first flower, Ember’s age, ears, the bathhouse;
  - daily limits;
  - Lantern Night;
  - American spellings;
  - the third rule;
  - quiz framing.

  Fixed what is listed above. Now, outside S14’s “sit” choice, no line in these files names the third rule.
- `npx tsc --noEmit -p .`: clean.
- `npx eslint` on the six files: clean.
- `content-check`:
  - All 10 `s19-*-alone` “missing” problems are gone.
  - The remaining 3 problems belong to the campaign (`c11-moss-kept`, `c11-moss-passed`, `end-hazels-grove-open`, reader).
  - The only warnings in my files are `s21-log` “switch him off” (sprout and reader), which are false positives: “him” is Clank.
- My own pass on all 264 scenes in these files found nothing:
  - every sprout line ≤ 14 words and every reader line ≤ 30;
  - scene lengths within the band limits;
  - every lesson `after` in range;
  - every `do` check listed in `CHECKS`.
- Original quotes: the four source files have no `childLines` (no outside quotes), and I found no near-quotes of outside
  works in these files.

## 4. For Maor

1. **“Gran” in S14 (reader).** The reader’s S14 lessons called Hazel “Gran” from Tilly’s side, in six places. Tilly
   isn’t Hazel’s grandchild (that’s why the original’s map now says HERE BE HAZEL). I changed them all to “Hazel”.
2. **The Tax Toad lesson** used pence (“A Shell is a hundred pence… 222p”). The original dropped the pence, so the
   reader lesson now has Byte cut a Shell into “a hundred tiny bits”. The pattern (200, 20, 2, then more twos forever)
   and the standard (4.OA.C.5) are unchanged. If you’d rather drop the sum altogether, swap in a different S14 lesson.
3. **S17 nursery payoff and the S20 cousin and sun-and-moon swaps** exist only as notes, just like in the originals.
   The engine backlog items E9 (S17) and the S20 note swaps need to apply them to the `reader:` and `sprout:` scenes
   too. The band texts and indices are in each quest’s notes. The reader’s `s20-declaration` is split again so its
   indices match the main scene.
4. **`s21-complete` (fire safety).** I moved the Nubbin off the wick in the reader only. The main scene still has “One
   inside the glass chimney, curled round the wick.” Change it there too?
5. **Third rule.** In my files the rule is now named only in S14’s “sit” choice. S12, S13, S19 and S21 keep the
   behaviour (sitting and waiting) without the name. The sprout S14 lesson now asks “What can a friend do?” rather than
   “What did Hazel say?”, so it doesn’t give away the choice.
6. **Sun safety.** Both bands now say not to look at the sun, in the `s11-jar` line and the step-3 hint. The reader’s
   shadow lesson (“If you turn to face it”) relies on the line before it for the warning.
7. **Two pending questions from the side-story log** affect these copies too:
   - the name clashes (S15’s Pip, S20’s Wren);
   - the talking Nubbins in S12 and Delve in S18 (canon 17).

   I left the edu copies matching the originals until you decide.

---

# log-edu-fun-python-bean
## Fix log: Learning Grove, fun quests (Python and Bean)

Files edited, all in `REPO/src/content/`: edu-fun-python-bean-sprout.ts, edu-fun-python-1-reader.ts,
edu-fun-python-2-reader.ts, edu-fun-bean-reader.ts. Nothing else was touched.

Sources: `fix/diffs/quests-python.diff`, `fix/diffs/quests-bean.diff`, `fix/log-fun.md` (items 5, 10, 19,
23, 26, 28, 29, 30, 31, hand-off H1), `part-m/review-edu.md` (every item that touches these files),
`fix/canon.md`.

## Checks (run from REPO)

- `npx tsc --noEmit -p .`: one error, in `edu-campaign-3-sprout.ts(1311)` (`MOSS_GONE_TAIL` not found).
  That file belongs to another agent and is mid-edit. None of my four files has an error.
- `npx eslint` on my four files: clean.
- `npx tsx tests/tools/content-check.ts --warnings`: no problems or warnings in my files (before or after).
  No "missing" lines name a Python or Bean scene. The 6 problems left are other areas' missing scenes.

## 1. Changes

| File | Scene | What changed | Why |
| --- | --- | --- | --- |
| sprout, python-1-reader | speakers | `say('mags')` → `say('old-mags')` (Q8 intro, complete and lesson lines now use it) | Mirror (fun #5, H1) |
| sprout | q01-intro | "Not yet. First, bring us… a shrubbery!" → "Not yet. First, we need something green. Something leafy. A… bush!" (the next line still names the word, so the "sh" lesson works) | Review (should fix) |
| sprout | q01-second | "The new one a little higher" / "a tiny path in the middle" → "Put the new one up higher" / "a tiny path between them" | Near-quote (film's "slightly higher… a little path running down the middle") |
| python-1-reader | q01-intro, `what-kind` | "A nice one. Not too expensive." → "A tidy one. About knee-high, on a Nubbin. With leaves. Leaves are important." (not the reviewer's "A green one…", because the next line already adds "Green.") | Review (must fix) |
| python-1-reader | q01-first | "It is a good shrubbery." → "This shrubbery pleases us." | Near-quote (film's opening words of that line) |
| python-1-reader | q01-second | "Set it beside this one, a little higher" → "It goes next to this one, but up a step" | Near-quote (as sprout q01-second) |
| sprout | q02-round3 | ankles line → "Come back! I’m not done being brave!" | Review (should fix) |
| python-1-reader | q02-round3 | ankles line → "Return at once! I have not finished being brave! I have barely started!" | Review (should fix) |
| python-1-reader | lesson q02-round1-l1 | Every he/his for Sir Dentwhistle → it/its (prompt, all three options and replies, parent note) | Canon 3 (Sir Dentwhistle is "it"); the review only named q02-glasses-l1, but this lesson had 14 more |
| python-1-reader | lesson q02-glasses-l1 | "see him" → "see it", and the other he/his/him in the lesson → it/its; "His bridge" → "Its plank" | Review (should fix) and canon 3 |
| sprout, python-1-reader | q08-intro | "A little castle" / "A model castle, apparently" → "Something with a drawbridge"; cousin tripped on "a fence post. A new one" instead of a shrubbery | Mirror (fun #10) |
| sprout, python-1-reader | q09-mother, `themselves` | The crowd chanting "We can (all) think for ourselves!" in unison → everyone nods at once, then waits for you to tell them what to think | Mirror (fun #26), which was a near-quote |
| sprout, python-1-reader | q10-intro | "You have to haggle!" / "You’re not even going to try to haggle?" → "Where’s the fun in that?" / "No haggling? Not even a little bit?" | Near-quote (Life of Brian haggling) |
| python-2-reader | q12-intro | "Very restful breed" → "Very sleepy breed" | Near-quote (echo of "It’s resting") |
| sprout, python-2-reader | q14-intro | "Let’s come in again" / "We shall go out and come in again" → "Out we go. We’ll do the door again" / "Everybody out. We shall do the door again" | Near-quote (the sketch’s "I’ll come in again") |
| sprout | q14-intro | "Sister Tuft! The comfy chair!" → "Sister Tuft! The big red chair!" (matches the reader) | Near-quote (the "Fetch… the comfy chair!" reveal) |
| sprout, python-2-reader | q14-sentence, `volunteer` | "Next Thursday" → "Bring us a sleepy Nubbin!" / "Keepers are safe from cushions today. Bring us a Nubbin." | Mirror (fun #28) |
| sprout, python-2-reader | q14-complete, `busy` | "Next Thursday, then…" → keep the chair; it will wait; chairs are good at waiting | Mirror (fun #28) |
| python-2-reader | q18-intro, q18-complete | "defending yourself against someone armed with fresh fruit" / "comes at you with a banana" / "qualified to defend yourself against fresh fruit" → new wording ("waves fresh fruit at you, with menace", "waves a banana at you, very meaningfully", "face fresh fruit without fear") | Near-quote (the sketch’s own lines) |
| sprout, python-2-reader | q20-complete | "Here, have a seed." / "Have one." → "Here. Grow your own!" / "Here. Plant your own." | Mirror (fun #31) |
| sprout, bean-reader | q23-complete | Eyeholes are now cut with a butter knife from his sock, not a spoon. Sprout: one new line, so the lesson's `after` moves from 4 to 5 | Mirror (fun #30) |
| sprout, bean-reader | q26-bench | Butter added to what he unpacks ("Butter from his top pocket. Of course." / "a pat of butter from his breast pocket") | Mirror (fun #29) |
| bean-reader | q26-complete | The two lines that explained his feelings → "The brass plate on the bench has only ever had one name on it." / "It is the first time in years he has needed the ruler." This keeps the clue the think question uses ("He isn’t eating on his own any more"). Sprout left as is: it states a fact, not a feeling | Mirror (fun #29) |
| sprout | q29-complete | Initial knitted "backwards" → "upside down" | Mirror (fun #19) |
| bean-reader | q29-complete and lesson q29-complete-l1 | Initial is now upside down ("It looks like a lamp post standing on a pavement."). The lesson depended on the backwards-T joke, so it is rewritten: "Which of these letters would look exactly the same knitted upside down?" H (best; it has a line of symmetry across the middle), T, R. Still 4.G.A.3. File notes updated | Mirror (fun #19), lesson fixed |

**Nothing to mirror:**

- **Triggers and `requires`.** The Bean triggers gained `WHEN_SUFFIX`, and the Python header now says "newly invented". No edu quest restates a trigger, a `requires` or a header.
- **Step goals.** None changed in either pack, so no edu goals needed updating.
- **q20-intro.** The edu versions already replaced the larch quote with their own lines.
- **Reward `egg-cosy`.** No edu file restates it.

**Canon sweep** (all four files):

- Sparks, Pixel and Dusty pronouns: clean.
- No Moss, Briar, Ember, ears, Wisp or Lantern Night content.
- No timers.
- All lines are within the line caps (sprout ≤ 14 words, reader ≤ 30).

## 2. New scenes added

None. quests-python.ts and quests-bean.ts gained no scenes, and content-check lists no missing Python or
Bean scene.

## 3. For Maor

- **Canon 17 (Nubbins don’t speak).** The fun quests have speaking Nubbins: the Tall Hood, Sir Dentwhistle, the gourd and shoe Nubbins, and others. The originals still have them, so the edu versions mirror them. If canon 17 should apply to the fun quests too, it needs a decision on the originals first.
- **Riffs I judged far enough from the source and left alone:**
  - The old card in Q3: "How quickly can a small bird fly, with nothing at all in its claws?" (it follows the main game’s own childLines version).
  - Q5: "Not two… not four… Three."
  - Q8: "What good has any of it done us?"
  - Q9: "It is a sign!" and "Follow the laces."
  - Q14: counting the Nap Patrol’s tools (EDU-STYLE names this as a lesson).
  - Q16: the gainsaying argument booth.
  - Q20: "Tree number one… A larch!"

  Say if any of these should go.
- **Near-quotes still in the originals (audience `all`), outside my files:**
  - quests-python.ts q01-intro `what-kind`: "A nice one. Not too dear."
  - q14-intro: "We shall go out and come in again."
  - q18-intro: "defending yourself against a person armed with fresh fruit" and "Somebody comes at you with a banana."

  None of these is in childLines, so a child playing the main game hears them.
- **"Mr. Tweed" vs "Mrs Inkwell"** (review, nice to have): left alone, because the name comes from quests-bean.ts.

---

# log-edu-fun-avatar
## Fix log: Learning Grove, fun-avatar (sprout + reader)

Files edited, all in `REPO/src/content/`: `edu-fun-avatar-sprout.ts`, `edu-fun-avatar-1-reader.ts`,
`edu-fun-avatar-2-reader.ts`. Nothing else in the repo was touched. Pre-edit copies are in
`SCRATCH/fix/edu-fun-avatar-bak/`.

Sources: `fix/diffs/quests-avatar.diff`, `fix/log-fun.md` (section 2 and hand-off H2),
`part-m/review-edu.md`, `fix/canon.md`.

**Checks** (run from REPO after the edits):

- `npx tsc --noEmit -p .`: clean.
- `npx eslint` on the three files: clean.
- `npx tsx tests/tools/content-check.ts --warnings`: no problems or warnings for any Avatar edu
  scene (no missing scenes, no quote hits, no long lines). The remaining problems and warnings
  belong to other areas.
- A fuzzy comparison (difflib) of every added line against `quests-avatar.ts`: the near-copies
  of the fixed adult lines were reworded. The only remaining exact matches are older reader
  lines that were already identical to the original and changed here only from "learnt" to
  "learned".

## 1. Changes

| # | File | Scene | What changed | Why |
|---|---|---|---|---|
| 1 | sprout | (speaker consts) | `say('bohdi')` → `say('rumbold')`, which covers every BU line in Q63 | Mirror (H2, speaker id) |
| 2 | sprout | Q63 title | 'King Rumbold’s Challenges' | Mirror |
| 3 | sprout | `q63-opponent`, choice `king` | Label 'Pick King Rumbold' | Mirror |
| 4 | sprout | step `q63-s3` goal | 'Ride the stone slides down with King Rumbold.' | Mirror (goal now names him) |
| 5 | sprout | Q47 title | 'The Secret Tunnel' → 'The Crystal Tunnel', as in the reader | Review (should): show name |
| 6 | sprout | Q50 title | 'The Jasmine Dragon' → 'Uncle Tenzo’s Tea Stall', as in the reader | Review (should): show name |
| 7 | sprout | `q46-glider-done` line 1 | "like a sitting duck" → "like a duck sitting down" | Review (nice) |
| 8 | sprout | `q53-uniform` line 5 | "Don’t stop a punch. Move it away." → "Don’t block it. Step aside." | Review (nice) |
| 9 | sprout | `q54-complete` line 6 | "a little sword" → "a little wooden practice sword" | Review (nice) |
| 10 | sprout | `q60-thief`, choice `name` | Pemba no longer names the lemur: "Let’s get to know it first. Then we’ll pick a name." The chirrup line was reworded too | Mirror (Lumi naming) |
| 11 | sprout | `q60-complete` | New line 0, where Pemba names Lumi. The L-sound lesson moves from `after: 1` to `after: 2`, so it still plays after the chirrup | Mirror (Lumi naming) |
| 12 | sprout | step `q62-s1` goal | 'Get Pemba out of the ice.' | Mirror |
| 13 | sprout | `q62-iceberg` | The ice block is now *by* the pond, not on it. Nalu: "It’s Pemba! He sat so still all night, he froze!" Tuk's `tuk` choice: "Fine. But Pemba owes me a snack for this." (it was "grumpy troll") | Mirror (Q62 is a mishap) + review (ice safety) |
| 14 | sprout | `q62-iceberg-done` | Pemba pops out with frosty eyebrows and asks about breakfast and penguins; he no longer says "I’m Pemba". The lesson "saying hello to someone new" is replaced by "helping a friend who feels cold" (sel, CASEL: Social awareness) | Mirror (Pemba isn't new) |
| 15 | sprout | `q62-sled` lines 2, 4, 5 | "frozen all night"; "All night! So quiet. Then so cold. Brr!"; "Penguins look warm. Can I ride one?" These replace "A long time… I miss my friends" and "one ride first" | Mirror |
| 16 | sprout | `q62-sled-done` line 1 | "Across the pond" → "Over a frozen puddle" | Review (ice safety), applied to sprout too |
| 17 | sprout | `q62-complete` line 3 | "Thank you for the rescue. And for the penguin ride!" (it was "I feel a bit braver now") | Mirror |
| 18 | sprout | 20 parent notes and lines | "learnt" → "learned", including `q60-friends` | Mirror (fun log #37) + review (nice) |
| 19 | reader-1 | `q51-complete` line 6 | Tuk's moral-stating line → "Also. Not-thirsty me made that rule for thirsty me. Thirsty me should have listened." The think question still fits | Mirror (fun log #22) |
| 20 | reader-1 | `q53-complete` line 0 + lesson `-l1` reply | Tuk's apology → "Sumi. I got it wrong. Wrong about fans, wrong about girls. Wrongest of all about me." The reply to "Saying exactly what you got wrong" now says he named it "even the part about himself" | Mirror (fun log #21) |
| 21 | reader-1 | `q54-lessons-done` | "learnt" → "learned" (2) | Mirror |
| 22 | reader-2 | header, speaker consts, Q63 title, goal `q63-s3`, `q63-throne` line 3, `q63-opponent` lesson prompt and choice `king` label, `q63-opponent-done` line 1 | `say('bohdi')` → `say('rumbold')`; every "King Bohdi" → "King Rumbold" (9) | Mirror (H2) |
| 23 | reader-2 | `q59-complete` line 4 | The cut sentence is gone: "And I won’t forget how my tummy twisted when I picked up that case." The conscience notice after it still teaches the point. Also "learnt" → "learned" (2) | Mirror (fun log #32) |
| 24 | reader-2 | `q60-thief`, choice `name` | "Not yet. A name should fit, and we hardly know it." plus a reworded chirrup line | Mirror (Lumi naming) |
| 25 | reader-2 | `q60-friends` line 1 | "learned" | Mirror |
| 26 | reader-2 | `q60-complete` | New line 0: "Right. Shiny things, sneaky snacks, enormous eyes. I’ve got it. You’re Lumi!" The nocturnal notice moves from `after: 4` to `after: 5`, so it still follows the big-eyes line | Mirror (Lumi naming) |
| 27 | reader-2 | goal `q62-s1` | 'Break Pemba out of the block of ice.' | Mirror |
| 28 | reader-2 | `q62-iceberg` | The block is "on the bank of the frozen pond". Nalu: Pemba sat down by the pond to meditate and "just… didn’t stop". Tuk: fetch a grown-up, "And nobody sets foot on that pond. Pond ice is thinner than it looks." Choice `tuk`: "once he’s defrosted, he’s hearing all about who said leave it" (it was "if he’s a monster") | Mirror + review (ice safety) |
| 29 | reader-2 | `q62-iceberg-done` | "A bald boy…" → Pemba sits up with frost-white eyebrows. "I’m Pemba" → "Morning, everyone! Have I missed breakfast? And, important question: any penguins?" | Mirror |
| 30 | reader-2 | `q62-sled` | Lines 1, 2, 5, 6 and 7 rewritten (he saw the penguins while meditating; "the whole night as an ice cube"; "how long were you stuck in there?"; "All night… very, very cold"; he wants to warm up on a penguin). The think question "fun and sadness together" is replaced by "too much of a good thing" (`after: 6`, sel, CASEL: Self-management), because the loss beat is gone | Mirror |
| 31 | reader-2 | `q62-sled-done` line 1 | "across the glassy ice of the pond" → "across a long, glassy frozen puddle at the bottom". The friction lesson is unchanged | Review (nice): children off the pond ice |
| 32 | reader-2 | `q62-complete` | Line 1 adds "You’re a walking snowman." Line 3 → "Thanks for defrosting me, everyone. And for the penguin. The penguin was the best bit." Line 4 (Nalu, carrying sad things) → "Next time you meditate in the snow, take a blanket. And a friend." The "carry" metaphor lesson becomes a "walking snowman" metaphor lesson (`after: 1`, still L.4.5) | Mirror |
| 33 | reader-2 | Q62 glossary + notes | Added `meditate` (q62-iceberg, the scene's second word). The notes now say it is a mishap, not an origin, and explain the ice-safety staging | Mirror + review |
| 34 | reader-2 | 29 lines and parent notes in all | "learnt" → "learned", including `q63-complete` and `q65-complete` | Mirror (fun log #37) + review (nice) |

**Checked, no change needed:**

- **Introductions.** Bao is introduced once, in Q56, in both bands (`q56-complete`, "The name’s
  Bao" / "My name’s Bao"). Q55 and Q64 treat her as already known. Kaito is never introduced as
  a newcomer: Q50 and Q65 show him as Tenzo's nephew, Q64 is his ask-to-join, and Q49 and Q55
  (which now require Q64) treat him as part of the group. No edu quest puts Bao or Kaito into a
  quest whose original doesn't have them.
- **Canon sweep.** No Sparks, Pixel, Dusty, Moss, Briar, Ember, ears, Lantern Night or timer
  issues in the three files. "Sparks leap from every blow" in reader `q54-meteor` is literal
  sparks. "figure it out" doesn't appear.
- **No show quotes** ("My cabbages!", "Flameo, hotman!", "It's the quenchiest!", "Hello, Kaito
  here."), and no near-quote of them or of other well-known show lines.
- **Sprout `q51-complete` and `q53-complete`** still say the moral plainly ("Rules are hard when
  you’re thirsty…", "Anyone can be a warrior…"). These are sprout rewrites, not the adult
  joke lines, and plain statement suits ages 3–6, so I left them.
- **`WHEN_SUFFIX`, `requires` and the `fetch:rumbold-key` / reward-id renames** live only in
  `quests-avatar.ts`. Edu files carry no triggers, reward ids or main-game checks, so there is
  nothing to mirror.

## 2. New scenes added

None. `quests-avatar.ts` gained no scenes, and content-check reports no missing Avatar edu
scenes.

## 3. For Maor

- **Q62 lessons changed with the story.** The reader lost its "fun and sadness together" think
  question and its "carry the sad things" metaphor, because Pemba no longer has a loss to carry.
  They are now "can a good thing become too much?" and Tuk's "walking snowman" metaphor. The
  sprout's "greeting someone new" lesson became "helping a friend who's cold".
- **Ice safety in both bands.** The review flagged only the reader, but I also moved the sprout
  block to beside the pond and the sled run onto a frozen puddle. Note that `quests-avatar.ts`
  itself still has Nalu and Tuk "on the frozen pond", and Pemba meditating "on the pond". You may
  want the main game to match.
- **okay vs OK.** I left "okay" alone. The Avatar originals use it ("Okay, fair."), so changing
  the edu files alone would split them from their source. If you want one house form, it's a
  game-wide pass.

---

# log-edu-languages
## Log: Learning Grove languages (Hebrew and Japanese)

Files (all in REPO/src/content): `lang-hebrew.ts`, `lang-japanese.ts`, `edu-lang-hebrew-sprout.ts`,
`edu-lang-hebrew-reader.ts`, `edu-lang-japanese-sprout.ts`, `edu-lang-japanese-reader.ts`.
Pre-edit copies: `SCRATCH/fix/lang-orig/`.

The base files had no fixer diff (`fix/diffs/lang-*.diff` are empty), so there was nothing to mirror
from the originals. Every change below comes from `part-m/review-edu.md` (or the Part K decisions
recorded in `fix/log-campaign.md` N10/P3, which the brief's "known items" restate). Each one went
into the base file first, then into both bands. The verifiers' work (`reviews/verify-hebrew.md`,
`verify-japanese.md`) was not redone, and none of their fixes was undone.

## Changes

### Hebrew

| File | Scene | What changed | Why |
|---|---|---|---|
| lang-hebrew.ts | lh3-s2 | "two jumpers as goalposts" → "four jumpers, a goal at each end" | Review §3: one-goal match logic |
| lang-hebrew.ts | lh3-s2-done | The ball bounces off the Wobbler, "rolled the whole length of the grass and into Ori’s goal" | Review §3: one-goal match logic |
| lang-hebrew.ts | LH3 notes | Pitch note added: two goals; the Wobbler keeps one, and Ori’s own goal at the far end is empty | Review §3: one-goal match (implementer note) |
| lang-hebrew.ts | lh4-s2, choice `anavim` | "turns its back" → "turns her back" | Review §3: Clover’s fussy Nubbin is she (canon 3) |
| lang-hebrew.ts | lh2-s2-done | "Two letters, one sound, one silence" → "One letter speaks, one letter stays quiet" | Review §4 (nice to have) |
| edu-lang-hebrew-reader.ts | reader:lh3-s2 | Four jumpers, a goal at each end | Review §3: one-goal match |
| edu-lang-hebrew-reader.ts | reader:lh3-s2-done | The ball rolls the length of the grass into Ori’s goal | Review §3: one-goal match |
| edu-lang-hebrew-reader.ts | reader:lh3-s2-l1 | "Pop quiz before kick-off…" → Ori hands out shirt numbers: "You can be שְׁמוֹנֶה (shmone). Which number goes on your back?" | Review §3: no quiz time |
| edu-lang-hebrew-reader.ts | reader:lh4-s2, choice `anavim` | "its back" → "her back" | Review §3: Nubbin is she |
| edu-lang-hebrew-reader.ts | reader:lh1-s1-done-l1 | "Quick check…" → "You keep saying בְּסֵדֶר (beseder) like a local. Do you know what it means?" | Review §3: no quiz time |
| edu-lang-hebrew-reader.ts | reader:lh1-s2-l1 | "Quick question, assistant coach…" → "Assistant coach, you’ll be teaching this one to the Nubbins…" | Review §3: no quiz time |
| edu-lang-hebrew-reader.ts | reader:lh1-complete-l1 | "Quick-fire! What do you say at bedtime?" → "First one. The lanterns are on and it’s bedtime. What do you say?" | Same quiz-tone sweep (not listed in the review) |
| edu-lang-hebrew-reader.ts | reader:lh2-s2-l2 | "Test! If ב loses its dot…" → Ori rubs the dot out of the sand ב: "Now what does it say? And what’s it called?" | Review §3: no quiz time |
| edu-lang-hebrew-reader.ts | reader:lh2-s2-done | "One letter speaks, one letter stays quiet"; Ori now scratches ג ד ה into the sand before "put all five in alef-bet order" | Review §4: only א and ב had been traced |
| edu-lang-hebrew-reader.ts | reader:lh6-s1-done-l1 | "Quick check. What does עֵץ mean?" → "Fern will ask what the spade is for. We’re planting an עֵץ (ets). So what’s an ets?" (`after` 1 → 4, so it plays once Fern is mentioned) | Review §3: no quiz time |
| edu-lang-hebrew-reader.ts | reader:lh6-s3-l1 | "two rows of five" → "Along the fence, Ori has hung the lanterns in two groups of five" (replies and parent note to match) | Review §4: the scene puts them along the fence |
| edu-lang-hebrew-sprout.ts | sprout:lh3-s2 | "Ori puts four jumpers on the grass. Two goals!" | Review §3: one-goal match |
| edu-lang-hebrew-sprout.ts | sprout:lh3-s2-done | The ball bounces off the Wobbler, then a new line: "It rolls all the way down the grass. Into Ori’s goal!" (lesson `after` 6 → 7). "Ori let in one goal" now makes sense. | Review §3: one-goal match |
| edu-lang-hebrew-sprout.ts | sprout:lh4-s2, choice `anavim` | "It turns away" → "She turns away" | Review §3: Nubbin is she |
| edu-lang-hebrew-sprout.ts | sprout:lh5-s2 | The friend line (16–20 words) is split into "A friend who’s a boy is a חָבֵר (chaver)." and "A friend who’s a girl is a חֲבֵרָה (chavera)." | Review §3: sprout line cap. Kept the verifier’s "friend who’s a boy" wording, not the review’s "boy friend" (see For Maor). |
| edu-lang-hebrew-sprout.ts | sprout:lh5-s2-l1 | "Ima, aba… and maybe a Nubbin" → "Your grown-ups, your friends… and maybe a Nubbin or two!" | Review §4: don’t assume two parents |
| edu-lang-hebrew-sprout.ts | sprout:lh5-s3-l1 | The 15-word grown-up prompt is split in two | Line cap (checker warning) |
| edu-lang-hebrew-sprout.ts | sprout:lh2-complete-l2 | "The Wobbler has a quick question." → "The Wobbler is walking backwards again." | Quiz-tone sweep |

### Japanese

| File | Scene | What changed | Why |
|---|---|---|---|
| lang-japanese.ts | header, LJ1 notes | Dumpling now "copies whatever Hana does, badly"; he bows to an object only once, to the moon (lj1-s3-done) | Known item: Dumpling’s bowing (Part K P3) |
| lang-japanese.ts | lj1-s2-done | Bucket, gate and reflection bows → Dumpling copies late, facing the wrong way, turns round and bumps into the water butt | Dumpling: one gag |
| lang-japanese.ts | lj1-s3 | "asleep… in the middle of a bow" → "asleep, upright, in the herb bed" | Dumpling: one gag |
| lang-japanese.ts | lj1-s3-done | Kept: "Dumpling bows to the moon" (the one gag) | Dumpling: one gag |
| lang-japanese.ts | lj1-complete | "bows at every word" → "bows one line late every time" | Dumpling copies badly |
| lang-japanese.ts | lj3-s3 + choice `dumpling` | Bows to each star → points his whole body at each star Hana points at. Label: "Count the ones Dumpling points at." (id unchanged) | Dumpling: one gag |
| lang-japanese.ts | lj4-s2 | "bows at the food… eats the food he bowed at" → copies Hana’s little bow perfectly, then eats before anyone has said anything | Dumpling copies badly (still the itadakimasu joke) |
| lang-japanese.ts | lj6-complete | "eats a りんご, then gives it a deep おじぎ… as usual" → "eats a りんご before Hana has finished saying the word" | Dumpling: never a habit |
| lang-japanese.ts | lj2-s1 | "the face of someone who owns the stones" → "the way she watches anyone touching water"; "She asked first" → "She asked you first. Mostly." | Known item / review §3: Marina’s place is the tide pools |
| lang-japanese.ts | lj2-complete | "Marina’s cottage" → "your cottage"; "The stones can stay." → "I’d keep the stones. Better than plain ones." | Same |
| lang-japanese.ts | lj4-s1 | Fern: "Food doesn’t really do blue." → "Hardly any food is blue." | Known item: blue food |
| lang-japanese.ts | lj4-complete | "Colour quiz!" → "Colour game!" | Quiz tone |
| lang-japanese.ts | LJ6 header, step 1 goal | "Hana’s family’s tōrō nagashi for her ojīchan"; goal "Ask Hana why she is sitting by the stream." | Known item: tōrō nagashi (Part K P3) |
| lang-japanese.ts | lj6-s1 + choice `yes` | "My family floats a paper lantern down the river for ojīchan" (not "where obāchan lives, people…"); "Last year I floated one with obāchan"; "Could I float his lantern on your stream? You can come, if you want." Choice: "Yes. We’ll all come." / "…And you, to help me get it right." | tōrō nagashi as Hana’s family custom, which the player is invited to share |
| lang-japanese.ts | lj6-s1-done | "Our own とうろうながし" → "Tomorrow we make the lanterns. At home we write the name very carefully." | Same |
| lang-japanese.ts | step 2 goal/hint, lj6-s2 | Goal: help Hana make ojīchan’s lantern, and one of your own if you like. Cut "the Nubbins get a word each" and the おにぎり-on-Dumpling’s-lantern joke; Hana writes おじいちゃん slowly, in silence. `love`: "Ojīchan would like that one." `word` (id kept) is now "Ask Hana to help me write the name in hiragana." | Not a game activity; no vocab practice on memorial lanterns |
| lang-japanese.ts | lj6-s2-done | "Everyone cheers as if it has won something" → Pixel floats the test lantern and nods once | Not a game |
| lang-japanese.ts | step 3 goal/hint, lj6-s3 | Hana carries ojīchan’s lantern; Luna lights them; Hana’s goes first and the others follow; the frog sits on the bank beside her ("You can watch too, かえる") instead of riding a lit lantern | tōrō nagashi item; review §4 fire-safety nicety |
| lang-japanese.ts | lj6-s3-done | Everyone watches the last light go, then walks back up to the cottage; the review party is "later", at the cottage; "Count the lanterns!" → "Count the front row!" | Party and counting kept away from the rite |
| lang-japanese.ts | lj6-complete, rewards | "the lanterns are yours, for your own とうろうながし" → Hana gives you her drawing of the evening. Reward `lj6-floating-lanterns` replaced by `lj6-stream-drawing` (decor, "Hana’s drawing of the stream") | tōrō nagashi is never a reward |
| lang-japanese.ts | LJ6 notes | Culture note (Hana’s family custom; never a game, mini-game, score or reward; no counting lanterns); step 2 is a craft, not a mini-game; step 3 is a story moment (Luna handles the flame, one tap or just watch, no music); the party happens back at the cottage | Implementer notes for the same |
| edu-lang-japanese-reader.ts | header | LJ3 adds "how fish breathe"; LJ6 is reworded as above | Matches the new lessons |
| edu-lang-japanese-reader.ts | reader:lj1-s2-done, lj1-s3, lj1-complete, lj3-s3 (+ choice label), lj4-s2, lj6-complete | Dumpling changes, as in the base | Dumpling: one gag |
| edu-lang-japanese-reader.ts | reader:lj2-s1, reader:lj2-complete | Marina lines, as in the base | Marina’s place |
| edu-lang-japanese-reader.ts | reader:lj2-s2-done-l1 | "Quick! Which of these words means ‘face’?" → "Hana wants to draw a face in the sand. Which word should you write for her?" | Review §3: no quiz time |
| edu-lang-japanese-reader.ts | reader:lj2-s3-l2 reply | The 37-word reply is split into two lines, as the review suggested | Review §3: reader line cap |
| edu-lang-japanese-reader.ts | reader:lj3-s1-done-l1 | The maths lesson (5 + 5) is replaced by a science notice from Marina: how fish breathe with gills (4-LS1-1) | Review §4: two maths lessons in a row in LJ3 |
| edu-lang-japanese-reader.ts | reader:lj4-s1, reader:lj4-complete | Blue-food line; "Colour game!" | Blue food; quiz tone |
| edu-lang-japanese-reader.ts | reader:lj5-s3-done | "tiny black tadpoles" → "tadpoles with little back legs" | Review §4: late summer |
| edu-lang-japanese-reader.ts | reader:lj6-s1 (+ notice, choice `yes`), lj6-s1-done | Family-custom framing, as in the base; the notice adds "For Hana’s family, it’s one of the ways they remember ojīchan." | tōrō nagashi |
| edu-lang-japanese-reader.ts | reader:lj6-s1-done-l1 | "Quick check before tomorrow. What is a かわ?" → "I’m drawing ojīchan’s lantern on our little かわ. Do you know what a かわ is?" | Review §3: no quiz time |
| edu-lang-japanese-reader.ts | reader:lj6-s2 (+ choices `love`, `word`), lj6-s2-done | As in the base. Lesson `do` "write a Japanese word on a Nubbin’s lantern" (`edu:write:ja:lantern`) → `ask` "Hana’s lantern says おじいちゃん. Who is it for?" | No vocab drill on a memorial lantern |
| edu-lang-japanese-reader.ts | reader:lj6-s3, lj6-s3-done | As in the base (the opening line is split, so the snow lesson’s `after` goes 2 → 3). Counting lesson: lanterns on the かわ → the Nubbins in the front row at the party (`edu:count:ja:lanterns:10` → `edu:count:ja:nubbins:10`) | tōrō nagashi, frog |
| edu-lang-japanese-reader.ts | reader:lj6-complete-l1, goals, notes, CHECKS | "Quick-fire round!" → "The Nubbins are waiting for you…"; keeper line as in the base; goals and notes reworded; CHECKS updated | Quiz tone; tōrō nagashi |
| edu-lang-japanese-sprout.ts | header | LJ6 reworded | tōrō nagashi |
| edu-lang-japanese-sprout.ts | sprout:lj1-s2-done, lj1-s3, lj1-complete, lj3-s3 (+ choice label), lj4-s2, lj6-complete | Dumpling changes, as in the base. The "3 and 1 more" lesson still works: Dumpling still bows, just late. | Dumpling: one gag |
| edu-lang-japanese-sprout.ts | sprout:lj2-s1, sprout:lj2-complete | "She asked you first"; "I’d keep the stones. They’re lovely." | Marina’s place |
| edu-lang-japanese-sprout.ts | sprout:lj4-s2 | "Food doesn’t come in blue!" → "Hardly any food is blue!" | Review §3 / known item |
| edu-lang-japanese-sprout.ts | sprout:lj6-s1 (+ choice `yes`, parent note), lj6-s2 (+ `love`, `word`), lj6-s2-done, lj6-s3, lj6-s3-done, lj6-complete, goals, notes, CHECKS | As in the base, in sprout voice: "My family floats a paper lantern down the river for my grandpa"; no "rice ball" lantern; frog on the bank; party "later, at the cottage"; counting lesson is now Nubbins (`edu:count:ja:nubbins:10`) | tōrō nagashi; Dumpling; frog |

## New scenes added

None. The base language files had no new scenes, and both bands already had all 42 + 42 Hebrew and
42 + 42 Japanese scenes.

## Checks

- `npx tsc --noEmit -p .`: clean.
- `npx eslint` on the six files: clean.
- `content-check`:
  - Nothing from these files is in "problems". The 3 problems left are other areas’ missing c11/end scenes.
  - The three line-cap warnings for these files (sprout lh5-s2, sprout lh5-s3, reader lj2-s3) are gone.
  - One warning is left: `timer? reader:lj1-s3-done` ("The Earth spins round once a day"). It is a false positive.
  - Hebrew words are still 78 and Japanese words are still 81.
- A script compared every Hebrew-script run, kana/kanji run and macron word before and after:
  - There are no new spellings anywhere. Niqqud, kana and Hepburn are untouched, and all six files are NFC.
  - Every vocab word that dropped in count still appears at least 5 times per file.
- Another script checked line counts: no sprout scene is over 10 lines, no reader scene is over 16, and no lesson `after` is out of range.
- Canon sweep (Sparks she, Pixel she, Dusty they, Lantern Night, Moss/Briar/Ember/ears): there was nothing to fix in these files.

## For Maor

1. **LJ6 reward changed.** `lj6-floating-lanterns` (a repeatable "float a lantern at dusk" decor) is gone, because Part K says tōrō nagashi is never a reward. It is replaced by `lj6-stream-drawing`, Hana’s sketchbook drawing of the evening. Nothing else in the repo referenced the old id. `script-book/19b-lang-japanese.md` and `19d` will pick up the new text when they are regenerated.
2. **LJ6 step 3 still has one check.** `lang:ja:review:float` covers both the floating and the party. The text now separates them (the party is "later, at the cottage"). If you want the engine to separate them too, the step needs splitting, which I didn't do.
3. **The friend line (sprout lh5-s2).** The review suggested "A boy friend is a חָבֵר". That would undo verifier fix #3, which removed "boy friend" because it reads as "boyfriend". I split the line but kept "A friend who’s a boy…".
4. **"Quick-fire" games kept.** Ori’s and Hana’s in-scene "Quick-fire" rounds (base, and the matching lines in both bands) are story games, so they stay. I rewrote only lesson prompts that read as a test. The internal check ids `edu:quiz:ja:colours` and `edu:quiz:ja:feelings` still contain "quiz". Players never see them, so they are unchanged.
5. **Dumpling’s one bow.** The one gag kept is the bow to the moon (lj1-s3-done), as in the Part K wording. The itadakimasu moment (lj4-s2) keeps a bow because that bow is the custom being taught: Dumpling copies it perfectly and then eats too early.

---

# log-outlines
## Fix log: Part M outlines and Part L Atlas (2026-10-14)

Files fixed in place:

- `SCRATCH/part-m/part-m.md`: the ranking, consequence and open-points sections, and the 15
  outlines.
- `SCRATCH/part-l.md`: A1–A10.

Originals are backed up in `SCRATCH/fix/outline-orig/`. Canon (`SCRATCH/fix/canon.md`) won every
conflict.

## Changes

### Part M: sections above the outlines

| # | Outline | What changed | Why |
| --- | --- | --- | --- |
| 1 | Where each one lives | Arcade: "separate saves" became "saves kept apart from the Grove's, may read Grove flags, never sets them" | Canon 21, 29 |
| 2 | The mix | "Twenty are public domain" became twenty-one, counting Pooh; added a note that modern translations aren't free | Count was wrong; accuracy |
| 3 | One line: S23 | Window set to after `c9-close` → before `c10-open`. Reads now include `s13Done`, `soldNubbin`/`boughtBack` and `keptStone`; `cinder` is marked epilogue-only. Writes `s23Done`. Vigil wording: "outside the stuck gate" became "in the lane beyond the gate", narration only, not his arrival | Canon 5, 25; timing (S19 comes later) |
| 4 | One line: S24 | Reads `s14Done`, `s18Done` | The outline read them but didn't list them |
| 5 | One line: S26 | Wren named. Tier 1 rewritten: a silent moment in the garden (not "Hazel's line at the Old Wall post"); Moss's flower stays by his flat stone and its seed goes over the wall (not "laid to rest in Hush's garden"). Reads and writes listed | Canon 15, 28; bible conflict 22 (Hazel speaks only at Cinder's post) |
| 6 | One line: A17 | The oak grows on the hill by Moss's flat stone | Canon 15; it clashed with the pond |
| 7 | One line: S27 | Window "ch5 → ch8" became "ch5 → before ch9 opens". Reads and writes listed. The Collector exit is the *sold-path* Collector only (keeping the stone still leads there) | Canon 26; ending rules |
| 8 | One line: S28, S29 | Added the `s8Reunited` and `s5Done` reads | Completeness |
| 9 | Consequence table | S23 and S26 rows reworded to match canon (lane, narration only; silent garden moment; the seed) | Canon 5, 15 |
| 10 | Corvin's redemption | "Four stories" with five steps listed became "two chapters and three side stories". S13's timing noted | Count was wrong; S13 can be done from chapter 7 |
| 11 | New flags | States that only S23, S26 and S27 are Tier 1 | Brief |

### Part M: S23 Three Visitors

| # | What changed | Why |
| --- | --- | --- |
| 12 | Window restated as the three nights before the Long Night. Corvin never comes to the Grove gate in S23; his first arrival there is `s9-dusk` | Canon 5 |
| 13 | New "What you know by now" note: the Keeper knows the shard story and that Hazel went to the Hollow, not where she is or how | Who knows what when |
| 14 | Q3: the vague "bottom of S13's cellar" check became `s13Done`. Pip no longer whispers: he is a silent echo who leaves three prints on the frosted window | Concrete flag; canon 17 |
| 15 | Q4: "(rule three)" no longer named on screen; payoff distance stated | Canon 14 |
| 16 | Q6: the cellar-desk check became `s13Done` | It didn't match Q3's check |
| 17 | Q7: "Old Corvin" became "Corvin now" (he is about 44); young Corvin's age given; Dickens's comma kept in the quote | Quality; verbatim quote |
| 18 | Q8: "Hazel's echo" became "Hazel as she was then" (she is alive); Briar is named as the speaker of "Your lip is trembling" | Canon (Hazel isn't an echo); clarity |
| 19 | Q9: "Look upon me!" punctuation fixed. "Nothing more all night" contradicted Hush's line in Q12 and became "nothing more until the Hollow" | Verified quote; internal contradiction |
| 20 | Q10: Ash came home in chapter 9 (S6's rule), so she is at Ember's. "He's cold" made clear (Corvin). A Collector variant was added, where Ash is still in his garden | Continuity with S6 and the Collector route |
| 21 | Q11: "an empty chair… You know whose" made concrete: Hazel's chair, her cushion still in it | Concrete enough to script |
| 22 | Q12: with `s8Reunited`, the thin one's ear folds at the tip | Canon 10 |
| 23 | Q15: the high pass is shown far off, as a vision, so S19's climb isn't spoiled | Who knows what when |
| 24 | Q16: timed to the morning before the Long Night; the drip is explained (the shard has left his pocket); sets `s23Done`; "the lane is anybody's" sets up the vigil | Timing; canon 5 |
| 25 | Collector route: Ash variant added; "one night before the water's edge" corrected (the story is three nights) | Continuity |
| 26 | Tier 2: Fern does take the soup up | Ember's line needed a source |
| 27 | Tier 1: `visitors` is set once all three nights have played, whatever the Q4 choice ("all three nights were sat" was ambiguous). `c10-dawn-lane` rewritten: he felt it at the turn of the night (when the stone unmakes, not at dawn), stayed till first light and went home; the "boot prints that never shifted" clashed with him sitting down. New ids marked new. The epilogue variants are named, and `-kept` replaces the main line | Canon 5; logic |
| 28 | Reads and writes listed in full | Brief |
| 29 | Lifted text rechecked (see Quotes) | Brief |
| 30 | Care notes: audience `main`. The thin grey and the lantern are explained (Hazel finds it the next night); Pip is silent; Eternals speak a little | Canon 17, 20 |

### Part M: A11 The Enchanted Place

| # | What changed | Why |
| --- | --- | --- |
| 31 | Q2: "hangs washing on his legs" became Milne's towel-horse | Accuracy |
| 32 | Q19: Eeyore's poem is for the Rissolution; the promised Choice 17 payoff (Rabbit's thanks) is now in the quest | The consequence was promised but missing |
| 33 | Reads: explains why this margin note shows before S24 | Consistency with S24 |
| 34 | Lifted: italic *were* restored; line 6's continuation noted; lines 4, 7 and 8 marked [unverified] | Verified against #67098 and #73011 |
| 35 | Care: audience `all`; Milne's animals talk because the Atlas is not the Grove, but your Nubbin never does | Canon 17, 20 |

### Part M: A12 The Mirror Shard

| # | What changed | Why |
| --- | --- | --- |
| 36 | Q8: "shoes" became "boots" | Andersen (and Q13 says "without boots") |
| 37 | Q18: the robber-girl payoff is now in the quest text | Payoff 3+ quests later made scriptable |
| 38 | `keptStone`: the Snow Queen's offered kiss became her bearskin; no kiss is offered to the player | Child safety |
| 39 | Lifted: all eight marked [unverified] against #1597; "Mirror of Understanding" confirmed | Gutenberg cut off before the story |
| 40 | Sámi care: the gákti, and herding as a living livelihood. New note: Andersen's *Finnekonen* may be Sámi (in the Danish and Norwegian usage of his day, "Finn" often meant Sámi), so she casts no spells and the adviser decides her name. Reindeer name: the translation prints "Bac", and we use "Bae" | Culture (Sámi) |
| 41 | Care: audience `all`; Andersen's animals talk in the Atlas, never your Nubbin | Canon 17, 20 |

### Part M: S24 The Adventure Book

| # | What changed | Why |
| --- | --- | --- |
| 42 | Q4: Tilly is up for the holidays (she is nine and lives away); Hazel's note is still unopened in her welly | Canon 8; S14 |
| 43 | Q7: the "rule one" and "rule three" labels were removed | Canon 14 |
| 44 | Q10: "Hazel kept going for forty years" contradicted Q2 (she gave the book to Nova at twelve). Now Hazel wrote in the back while Nova walked the valley, and Nova never looked there | Logic |
| 45 | Q12: Tilly ran into the dark in Q9 and never came back. She is now found safe at the nest | Missing beat |
| 46 | Tier 2: explains why the margin notes "appear" (lantern light), and the A11 and A14 exceptions | Consistency |
| 47 | Reads: Moss's flower is by his flat stone (it was "by hers"); `alone` isn't a `walk` value; `s14Done` and `s18Done` placed | Canon 15; bible sim |
| 48 | Care: the Tilly beat is short; audience `all`; the bird is silent; writes `s24Done` only | Care; canon 17 |

### Part M: S25 Real

| # | What changed | Why |
| --- | --- | --- |
| 49 | Q3: Pixel is "she"; the clockwork bits "show off" rather than "boast" (they can't talk) | Canon 3, 17 |
| 50 | Q5: "It doesn't grab" became "doesn't take it" | Grammar |
| 51 | Q8: "say it for them" became "on its behalf" | Pronoun (Nubbin is "it") |
| 52 | Q9: Moss "translates" became "reads their faces" | Canon 17 |
| 53 | Q10: the mechanical-toys line is the book's narration, not the Horse's | Accuracy |
| 54 | Q12: Clover says at once that it's only a chill. Q13: "Thursday's cart" became "the rag cart" | Care; no calendar timers |
| 55 | Q15: Moss isn't on the ledge in chapter 8, so the scene moves to the cottage | Continuity |
| 56 | Lifted: all eight verified against #11757 | Brief |
| 57 | Care: the chill comes right after Fossil, so keep it light; wild Nubbins are silent; audience `all` | Care; canon 17 |

### Part M: S26 The Walled Garden

| # | What changed | Why |
| --- | --- | --- |
| 58 | Q3: the sleeping shard no longer gives off cold (the wardens' posts keep it asleep and warm); you know what sleeps there from chapter 4 | Lore; who knows what when |
| 59 | Q7: Wren is asked first. "Carry" became "lift Wren and her chair". The ramp is three evening scenes, not a repeating task. Payoff distance stated | Disability; no chores |
| 60 | Q8: a ladder became Moss on the wall with a rose twig (he is tiny) | Continuity |
| 61 | Q9: Wren's "To plant seeds in…" line placed (it was listed but unused) | Lifted text used |
| 62 | Q10: "Don't tell Hazel" implied Moss knows she'll be back; it became "Don't go telling people". "I'd like a bit of it here" leaves his flower on the hill | Who knows what when; canon 15 |
| 63 | Q12: timed by the end of chapter 8; the `s13Done` line placed; the rose-and-thistle couplet placed (it was listed but unused) | Timing; lifted text |
| 64 | Q13: rewritten so being stuck is the steps' fault, with Wren directing the late ramp | Disability |
| 65 | Q15: sets `s26Done` | Flags |
| 66 | Tier 1: `c12-wall-garden` is placed against the real `c12-open` text (Hazel doesn't touch a "stream post" by name) | Matches the campaign script |
| 67 | `end-moss-sleeps-garden`: the flower is by the flat stone, and the seed *will* go over the wall by midsummer (epilogues sit in spring) | Canon 15; the timeline |
| 68 | Epilogue variant ids named in full; reads and writes listed | Flags |
| 69 | Lifted: all eight marked [unverified] | Gutenberg cut off in chapter IX |
| 70 | Care: disability guidance expanded (asking, the chair, access not change, advisers on the Q13 beat); the robin is silent; audience `all` | Disability; canon 17 |

### Part M: A13 The Wooden Boy

| # | What changed | Why |
| --- | --- | --- |
| 71 | Q19: the Tunny carries them to shore | Collodi |
| 72 | Tier 2: Clank's dusk line is one scene, not daily | Canon 22 |
| 73 | Lifted: Murray isn't on Gutenberg (#16865 is a different 1916 translation), so all eight are [unverified] | Brief |
| 74 | Care: audience `all`; talking animals belong to the Atlas only | Canon 17, 20 |

### Part M: A14 Homecoming

| # | What changed | Why |
| --- | --- | --- |
| 75 | Q9: blown back "to the start" became "to Aeolus's island, and he won't help them twice" | Homer |
| 76 | Q10: "(rule one)" removed | Canon 14 |
| 77 | Tier 3: "Poseidon's sea is rougher in Q13" became a Q20 payoff. Q13's storm is Zeus's, and it came before the payoff point | Accuracy; payoff 3+ later |
| 78 | Dangling "(see Notes)" removed | Quality |
| 79 | Lifted: lines 1 and 2 verified ("torchlight" is one word in #1727); lines 3 to 8 [unverified] | Brief |
| 80 | Care: the gods are treated as a living faith (Hellenic polytheism), with no player sacrifice or prayer and a Greek classicist to read the script; audience `all`; the talking dead and gods belong to the Atlas | Culture (Greek gods) |

### Part M: A15 The Humbug

| # | What changed | Why |
| --- | --- | --- |
| 81 | Q1 title: "Gray" became "Grey" (quotes keep Baum's spelling) | Canon 19 |
| 82 | Q17: the cow breaks off *her own* leg | Baum |
| 83 | Q16: "Some of them come back" is now the Keeper's thought, not the Nubbin's line | Canon 17 |
| 84 | Lifted: 1 and 2 verified; 3 to 7 [unverified] | Brief |
| 85 | Care: audience `all`; Baum's animals talk, Toto and your Nubbin don't | Canon 17, 20 |

### Part M: A16 The Fox and the Rose

| # | What changed | Why |
| --- | --- | --- |
| 86 | Q2: added the muzzle choice that the Tier 3 "strap" consequence relied on | The payoff had no choice |
| 87 | Lifted: the French of all three lines verified (copyrighted; three lines is the cap) | Brief |
| 88 | Care: audience `all` (Learning Grove for the older band only); talking animals belong to the Atlas | Canon 20 |

### Part M: A17 The Camphor Tree

| # | What changed | Why |
| --- | --- | --- |
| 89 | Q1: boots off at the step | Culture (Japan) |
| 90 | Q7: Satsuki asks the Jizo's permission to shelter, as in the film; you bow too | Culture (Japan) |
| 91 | Q13: "the whole valley" became "the whole village" | Setting |
| 92 | Tier 2: the oak is on the hill by Moss's flat stone, and in Moss Sleeps it shades his flower | Canon 15 |
| 93 | Lifted: both dub lines [unverified] (they match Ranker only) | Brief |
| 94 | Care: new Japanese-culture block covering the Jizo, the *shimenawa* (no player rite), the family bath, indoor customs, honorifics and 1950s accuracy, with advisers before scripting; audience `all` | Culture (Japan) |

### Part M: S27 Some Nubbin

| # | What changed | Why |
| --- | --- | --- |
| 95 | Q3: "Rule three:" no longer named | Canon 14 |
| 96 | Q13: "The Morning of the Show" became "The Morning After the Show" (the Show was Q11) | Internal contradiction |
| 97 | Q14 and Tier 1: the price is 200 Shells, matching `c2-corvin`'s sale; "up to 200 shells" was inconsistent | Continuity |
| 98 | Q15: Wisp keeps the egg sac under the cottage step, not "his nest". Clank can't climb (S21), so your Nubbin climbs and Clank holds the ladder | Canon 16; S21 |
| 99 | Tier 1: the Collector ending can only come from `keptStone` *for this player* | Accuracy |
| 100 | Lifted: noted as checked against secondary sources | Brief |
| 101 | Care: who speaks (Spindle writes; Wisp's whisper is canon's Shadow exception); audience `all` | Canon 17 |

### Part M: S28 Please Look After This Nubbin

| # | What changed | Why |
| --- | --- | --- |
| 102 | Q1: the carter no longer saw "a woman in a big coat". The tag was left on the milestone, and it doesn't say where Hazel is or how | Who knows what when (protects chapter 10's dawn) |
| 103 | Q6: "At eleven every morning" became one scene | Canon 22 |
| 104 | Q9, Q10, Q12: moved to early winter, before chapter 9. Q12 was set on chapter 9's own day, and the night scenes clashed with S23's nights | Timing |
| 105 | Q13: moved from "after dawn in chapter 10" (Hazel's return) to early chapter 11 | Timing |
| 106 | Tier 2: marmalade "made once per season" became unlimited and never required | Canon 22 |
| 107 | Lifted: noted as checked against secondary sources | Brief |
| 108 | Care: Parcel never speaks; Hazel isn't seen before dawn in chapter 10; audience `all` | Canon 17 |

### Part M: PA1 The Chao Altar

| # | What changed | Why |
| --- | --- | --- |
| 109 | Q7: "the prayer her grandmother taught her" (the source says so) | Accuracy |
| 110 | Q18: "their breath" became "her breath"; "half-sings" became "half-chants" (it is a skipping rhyme) | Canon 3; no-lyrics clarity |
| 111 | Lifted: line 2 corrected to the wiki wording ("Chaos is power... Power enriched by the heart."); both [unverified] | Brief |
| 112 | Care: who speaks; audience `main` (all ages, no Learning Grove version) | Canon 20 |

### Part M: S29 The Gates of Dawn

| # | What changed | Why |
| --- | --- | --- |
| 113 | Q3: "pickled cucumber" became "pickled gherkin" | Grahame (#27805) |
| 114 | Q9: Fossil is no longer named in chapter 5 (without S5, Fossil is introduced in chapter 6) | Bible conflict 8 |
| 115 | Q12: The Lantern Song is sung out of season, with a reason | Canon 18; quality |
| 116 | Q15: "warm the way the Wellspring is warm" was dropped; the player may not have seen it before chapter 8 | Who knows what when |
| 117 | Q17: "(rule three)" removed | Canon 14 |
| 118 | Lifted: the Ch. I and III lines verified (italic *nothing*); the Ch. V and VII lines [unverified] | Brief |
| 119 | Care: Toad's absence explained (it pointed to notes that don't exist); otters silent; audience `all` | Quality; canon 17 |

### Part M: the end matter

| # | Section | What changed | Why |
| --- | --- | --- | --- |
| 120 | Open points | Rewritten. Resolved: Pixel she/her; Corvin at the vigil (approved, with the `s9-dusk` / `c11-gate` logic); A15 stays Tier 3. Expanded "Canon kept" to cover speech, Moss's flower, Tier 1 and timers. Added a crowding guard for the three nights. The recheck list now names exactly which lines are still [unverified] | Brief; canon 3, 5 |
| 121 | How to build it | Arcade save wording | Canon 29 |
| 122 | Sources | Verification URLs for this pass appended | Brief |

### Part L

| # | Outline | What changed | Why |
| --- | --- | --- | --- |
| 123 | Intro | The Atlas has its own save and may read Grove state | Canon 21, 30 |
| 124 | Table | Audience column: `teen` (13+) for A1, A3 and A4, `all` for the rest. A2 has 19 quests, so the total is 151. A4 is "Telugu and Tamil films" | Canon 20; accuracy |
| 125 | A1 | Quests 7–15 put in *Brotherhood* order: Lab 5 (ep. 8), the phone box (10), Rush Valley (11), the island (12), Ling (15), the Devil's Nest, Winry and Scar (22), Gluttony (24), Briggs (33). "Ishval Remembered" retitled "The Man Who Orphaned Her". The State Exam is marked as a flashback. The Lab 5 choice now pays off in Q16. Signature refs updated | Fact check (Wikipedia episode list); payoff 3+ |
| 126 | A1 care | `teen`, behind the content setting; order source noted | Canon 20 |
| 127 | A2 | Novel order. Q7 The White Dragon Horse (ch.15), Q8 The Stolen Robe (ch.16–17), Q9 Pigsy (ch.18–19), Q10 Sandy (ch.22); the horse was folded into Sandy before. The Two Monkeys (ch.56–58) now comes before the Flaming Mountains (ch.59–61). The signature choice is now Q12, with a payoff in Q15 | Requested fix; verified (New World Encyclopedia, 5000yan ch.16) |
| 128 | A3 | Q5's choice is the argument you make at Q11. Care note: names the murder-suicide attempt and the soldier's suicide attempt for the team only, with on-screen euphemisms and a content note; `teen`; a Korean adviser on the afterlife and folk religion (*jeoseung saja*, the Ten Kings, 49 days) | Requested; payoff 3+; review nice-to-have |
| 129 | A4 | Q13 pays off at the pyre (Q16); `teen` | Payoff 3+; canon 20 |
| 130 | A5 | New Q5 choice (the balafon tune) pays off in Q9 and Q14. Q9 matches Niane: Balla plays Soumaoro's balafon and becomes his griot | Payoff 3+; accuracy |
| 131 | A6 | The ivory is a real choice. *Tell* (the master swears to take only fallen tusks; Sinbad is freed now, rich) or *keep the secret* (Sinbad stays a season, then the master gives up the hunt; poor and late). Q15 and Q16 change. A Q5 diamond choice pays off in Q16. No ivory is ever a reward. Advisers on Arab and Persian heritage | Requested fix; payoff 3+ |
| 132 | A7 | New Q6 choice (Héctor's name on the ribbon or a promise) pays off in Q12 | Payoff 3+ |
| 133 | A8 | Verses (task 2) and Cilindric (task 3) swapped; the Q9 form pays off at the Banquet | Accuracy; payoff 3+ |
| 134 | A9 | "coziest" became "cosiest"; "a second Hemulen's dress" became "the dress of another Hemulen they meet"; new Q4 choice (what you tell Sniff) pays off in Q11 | Canon 19; accuracy; payoff 3+ |
| 135 | A10 | New Q3 choice (Gramma's step) pays off in Q12 and Q14 | Payoff 3+ |
| 136 | How to build it | Advisers now cover A2, A3, A4, A5, A6, A7 and A10. The save wording follows canon 30. A ratings item was added and the list renumbered | Requested fixes |
| 137 | Sources | New section with the A1 and A2 fact-check URLs | Brief |

## Quotes

Gutenberg pages loaded only up to about 100,000 characters. Wikisource returned "not found",
Standard Ebooks refused (robots) and curl was blocked. Lines past the cut-off are marked
[unverified] in place.

### Verified against the named public-domain edition (26)

- *A Christmas Carol*, PG #46 (5 entries):
  - "I wear the chain I forged in life," / "I made it link by link, and yard by yard;"
  - "No. Your past." and "Look upon me!"
  - "Your lip is trembling," said the Ghost. "And what is that upon your cheek?"
  - "The happiness he gives, is quite as great as if it cost a fortune."
  - "Another idol has displaced me;" / "What Idol has displaced you?" / "A golden one."
- *Winnie-the-Pooh*, PG #67098, and *The House at Pooh Corner*, PG #73011 (5): the opening; "Bear
  of Very Little Brain"; "Silly old Bear… *were*" (italics restored); "Tiggers don't like honey.";
  "TUESDAY".
- *The Velveteen Rabbit*, PG #11757: all 8.
- *The Odyssey*, Butler, PG #1727 (2): the tambour frame, and "by torchlight".
- *The Wonderful Wizard of Oz*, PG #55 (2): the chapter I house; the chapter IV "no place like
  home".
- *The Wind in the Willows*, PG #27805 (4): "Bother!"…; "*nothing*—absolute nothing—"; "O stop,
  stop!"; "Then the faces began."

### Copyrighted lines checked (9, all within the 3-line cap)

- *Le Petit Prince* (3): the French was checked against a course copy of chapter XXI.
- *Up* (2), *Charlotte's Web* (2) and *Paddington* (2): checked against secondary sources.

### Corrected

- *A Christmas Carol*: the comma restored in the Q7 dialogue line, "What Idol has displaced you?"
  added, and the "!" restored in "Look upon me!".
- *Winnie-the-Pooh*: italic *were*.
- S29's basket: a gherkin, not a cucumber.
- Tikal's prayer, line 2.

### Still [unverified] (49)

- *A Christmas Carol*, Staves Four and Five: 3. One note: Lit2Go prints "show me." where the
  outline has "show me!".
- Pooh: 3 (chapter IX; *The House at Pooh Corner* chapter X).
- *The Snow Queen*, #1597: 8. Lines 3 to 8 match Lit2Go word for word.
- *The Secret Garden*, #113: 8.
- Murray's *Pinocchio*: 8. It isn't on Gutenberg.
- Butler's *Odyssey*, Books IX–XXIII: 6.
- Baum, chapters XV, XX and XXIII: 5.
- *The Wind in the Willows*, chapters V and VII: 4.
- *Totoro* dub: 2.
- Tikal's prayer: 2.

## For Maor

1. **New scene ids for the implementer.** All are marked "new" in the outlines:
   - `c10-vigil-corvin`, `c10-dawn-lane` and `c10-kept-lane`;
   - `end-epi-visitors`, with `-cinder` and `-kept`;
   - `c12-wall-garden` and `end-moss-sleeps-garden`;
   - `end-epi-garden`, with `-cold`;
   - `s27-home`.

   S23's `c10-dawn-lane` now has Corvin feel it at the turn of the night (when the stone unmakes)
   and go home at first light, which keeps `s9-dusk` as his first arrival.
2. **49 quotes are still [unverified].** This is only because this environment truncates
   Gutenberg and can't reach Wikisource or Standard Ebooks. One run with full access would clear
   most of them. Murray's *Pinocchio* needs a scan of the 1892 or 1911 edition.
3. **Audience calls to confirm:**
   - S23 and PA1 are `main`: suitable for all ages, but neither has a Learning Grove version.
   - The other side stories and A11–A17 are `all`.
4. **A6 ivory.** "Tell him" follows the tale's own ending. "Keep the secret" is our addition.
   Either way no elephant is hunted again, and ivory never appears as a reward.
5. **A12, the "Finland woman".** She may be Sámi in Andersen's Danish. I removed her sorcery and
   left her name to the Sámi adviser.
6. **S26 and Moss Sleeps.** The seed going over the wall plays only in Moss Sleeps, per the
   bible. Moss can also fade in other endings (for example Long Road). Do you want the garden line
   there too?
7. **S28 timing.** The cart-stop and glasshouse scenes moved to early winter, before chapter 9.
   They lose the "three days before the longest night" urgency, but no longer clash with
   chapter 9's day or S23's nights.
8. **The third rule.** None of the 15 outlines now names it on screen. S23 Q4, S24 Q7, S27 Q3,
   S29 Q17 and A16 Q12 all act it out unnamed. Pick where it should be named, toward the target
   of about four side stories.
9. **Hand-off: S14 contradicts canon 8.** `REPO/src/content/side-stories-new-4.ts` (S14), line
   183, has Sparks say "Tilly got a letter, same as everyone." That breaks canon 8 (only you got a
   letter; Tilly got a short note), and line 207 also says "letter". Suggested text:
   "Hazel went off at the end of the winter. She left Tilly a note. Just a note, just Tilly. She
   won't open it. It's in her welly." Change "letter" to "note" in line 207 too. I did not edit
   this file.
10. **Checks to confirm:**
    - The A3 content note relies on the earlier review's summary of the film's suicide content. I
        didn't re-verify it.
    - The A1 order follows *Brotherhood*'s episode list.
11. **Not changed.** Part L's Night of Remembering "memory wall" still overlaps A7's ofrenda
    reward (a review nice-to-have). Pick one to change.

---

# log-prompt
## Prompt edit log, phase 8 (2026-10-15)

File: `/mnt/user-data/outputs/grove-backlog-prompt.md` (4,857 → about 9,160 lines; Part M now outlines all 40). Backup: `SCRATCH/fix/prompt-before-phase8.md`. Scripts: `SCRATCH/fix/phase8_edits.py` (every replacement asserts count == 1), `SCRATCH/fix/phase8_parts.py`.

| Edit | Status | Note |
| --- | --- | --- |
| campaign P1a | applied |  |
| campaign P1b | applied |  |
| campaign P1c | applied |  |
| campaign P1d | adapted | Applied as given, plus a step 8 pointing at CV6. |
| campaign P2 | applied |  |
| campaign P3a | applied |  |
| campaign P3b | applied |  |
| campaign P3c | applied |  |
| campaign P3d | applied |  |
| campaign P4 | applied |  |
| side (all) | not applicable | log-side.md lists no prompt edits ("None needed"); its bible checks are carried by the new bible in Part I. |
| fun P1 | applied |  |
| fun P2 | applied |  |
| fun P3 | applied |  |
| fun P4 / mv S20 row 31 | applied |  |
| fun P4 / mv S20 row 33 | applied |  |
| fun P4 / mv S20 row 34 | applied |  |
| fun P4 / mv S20 row 35 | applied |  |
| fun P4 / mv S20 row 36 | applied |  |
| fun P4 / mv S20 row 38 | applied |  |
| fun P4 / mv S20 row 41 | applied |  |
| fun P4 / mv S20 row 42 | applied |  |
| fun P5 | applied |  |
| fun P6a | applied |  |
| fun P6b | applied |  |
| fun P6c | applied |  |
| fun P7 | applied |  |
| fun P8 | applied |  |
| fun P9 | applied |  |
| mv header step 9 | adapted | Count and message as given; the seven files and docs/voiceover/ are also named (task 5). |
| mv Part C OW18 | applied |  |
| mv Parts D–E l.152 | adapted | Same sentence as fun P1; fun P1 wording used (it says the same thing). |
| mv Parts D–E l.158 | applied |  |
| mv Parts D–E l.165 | applied |  |
| mv Parts D–E l.168 | applied |  |
| mv Parts D–E l.205 | applied |  |
| mv Parts D–E l.316 | adapted | Added `visitors` (S23) too, per canon 27. |
| mv Parts D–E Sunny renames | applied | Same eight renames as fun P4 (applied once). |
| mv quotes golden god | applied |  |
| mv quotes nice egg | applied |  |
| mv F who can play | applied |  |
| mv F l.582 | applied |  |
| mv F CA5 | applied |  |
| mv F FF7 | applied |  |
| mv F UL8 | applied |  |
| mv F MK7 | applied |  |
| mv F MK8 | applied |  |
| mv F SP3/SP4 swap | applied |  |
| mv F SP7 | applied |  |
| mv F DB20 | applied |  |
| mv F E1 step 5 | applied |  |
| mv F E3 source | applied |  |
| mv F E4 step 1 | applied |  |
| mv F E6 step 1 | applied |  |
| mv F E6 step 5 | applied |  |
| mv G l.927a | applied |  |
| mv G l.927b | applied |  |
| mv G l.927c | adapted | Extra: the Part G intro said "All-ages", which contradicts the `main` plots. |
| mv G l.931 | applied |  |
| mv G l.939 | applied |  |
| mv G l.941 | applied |  |
| mv G l.943 | applied |  |
| mv G l.945 | applied | Keeps the phrase "once a day" only to forbid it. |
| mv G l.949 | applied |  |
| mv G l.977 | applied |  |
| mv G l.981 | applied |  |
| mv G l.1007 | applied |  |
| mv G Lucky items | applied |  |
| mv G l.1115 | applied |  |
| mv G freebie Giant Omelette | applied |  |
| mv G freebie Giant Jelly | applied |  |
| mv G freebie Tombola | applied |  |
| mv G freebie Fruit Machine | applied |  |
| mv G freebie Snowager | applied |  |
| mv G freebie Wheels | applied |  |
| mv G freebie Underwater Fishing | applied |  |
| mv G freebie Anchor Management | applied |  |
| mv G freebie Deserted Tomb | applied |  |
| mv G freebie Meteor Crash Site | applied |  |
| mv G freebie Advent Calendar | applied |  |
| mv G freebie Bank interest | applied |  |
| mv G game Dice-a-Roo | applied |  |
| mv G game Kiss the Mortog | applied |  |
| mv G game Poogle Racing | applied |  |
| mv G game Bilge Dice | applied |  |
| mv G l.1162 | applied |  |
| mv G Edna grog | adapted | No separate Edna bullet exists (Edna shares the Kitchen Quests bullet), so the sentence ends that bullet. |
| mv G seasonal | applied |  |
| mv L audience 13+ | applied | Already in SCRATCH/part-l.md as "`teen` (13+)"; carried by the Part L regeneration. |
| mv L A4 Telugu and Tamil | applied | Already in part-l.md; carried by the regeneration. |
| mv L A2 "usable any time" (M7) | applied | Already in part-l.md; carried by the regeneration. |
| mv L A2 order (S21) | applied | Already in part-l.md (horse, robe, Pigsy, Sandy; A2 has 19 quests); carried by the regeneration. |
| mv L A3 care note (N16) | applied | Already in part-l.md (murder-suicide and Dong-yeon named for the team); carried by the regeneration. |
| mv L A6 signature choice (S22) | applied | Already in part-l.md in its own wording (Q14, tell or keep the secret); carried by the regeneration. |
| mv L A8 Verses/Cilindric swap | applied | Already in part-l.md; carried by the regeneration. |
| mv L "coziest" | applied | Already "cosiest" in part-l.md; carried by the regeneration. |
| mv L Hemulen glider | applied | Already in part-l.md; carried by the regeneration. |
| mv L festivals read Atlas progress | applied | Already in part-l.md (CV4 step 3: "The festivals read Atlas progress (read-only)"); carried by the regeneration. |
| mv L advisers A3 and A6 (S24) | applied | Already in part-l.md; carried by the regeneration. |
| mv L "each page is a separate save" (S23) | applied | Already in part-l.md in canon 30 wording; carried by the regeneration. |
| mv L Night of Remembering "memory wall" | not applicable | part-l.md (reviewed) keeps "memory wall", and log-outlines.md (For Maor 11) leaves the overlap with A7's ofrenda open for Maor; Part M's consequence plan also names "The memory wall". Left as is so Parts L and M agree. |
| extra OW17 | adapted | Extra: stale count (ten, S1–S10, "a third") against 8 of 31. |
| extra step 2 CV6 | applied | Task 4. |
| extra step 1 CV6 home | applied | Task 5: gives the new CV6 section a home without adding an eighth file. |
| extra suggested order CV6 | applied | Task 4. |
| Part I bible | applied | Replaced everything between "=== BEGIN PART I ===" and "=== END PART I ===" with SCRATCH/src-content/briefs/story-bible.md (467 lines, now including "Settled details (2026-10-14)" and "8 of 31"). Kept its title line and intro paragraph: Part I's own intro does not say the bible wins over older text. |
| Part I intro | applied | Updated via campaign P1 (22 scripted, 5 change, 8 of 31 with Part M; seven side-story files; CV1 steps 5–7 and a new step 8 for CV6). |
| Part L regeneration | applied | Replaced "## Part L. The Atlas" up to "## Part M." with SCRATCH/part-l.md, `### ` → `## ` (first line kept). |
| Part M regeneration | applied | Replaced "## Part M." up to the CV6 section with SCRATCH/part-m/part-m.md (6,388 lines, all 40 storylines outlined), `### ` → `## ` (first line kept). |
| CV6 section | applied | New "## Engine backlog from the fix pass (CV6)" before "## Suggested order": 29 items in four groups (campaign and endings 6, side stories 11, fun quests and the audience setting 5, Multiverse and Neopia 7), each with its source log item. Merged duplicates: log-side E1/E2 into campaign E2/E3; log-fun E1 with log-mv 1; log-fun E5 with log-mv 7; log-mv 8 with log-fun H6. Left out as already done in the repo: log-side H2 (index.ts export) and log-fun H5 (content-check audience checks). Source text: SCRATCH/fix/cv6.md. |

Counts: 110 rows; applied 101, adapted 7, not applicable 2.

## Checks

- "3 of 10", "three of the ten", "nine NPCs", "Bohdi": none left.
- "Nubbin Mittens": one left, in the Sunny table's Q31 reward ("Nubbin Mittens: sleeping Nubbins…"). Justified: it is the in-game product name in `quests-sunny.ts` (reward label); only the quest title is "Kitten Mittens".
- "once a day": five left, all justified. Part G (twice) and the bible's Settled details forbid it; Part M's consequence plan says none remain; CV6 item 22 quotes `sim/daily.ts` for Maor's decision.
- Sparks or Pixel with he/his/him: no match refers to Sparks or Pixel (the hits are Clank/CL-4NK, Byte, Ned, Link and the Hodja).

## For Maor

- The Night of Remembering's "memory wall" still overlaps A7's ofrenda (Parts L and M); left for you.
- Neopia freebies: Part G now says one-time or unlimited (canon 22); `results.ts` says once per Nubbin per life. CV6 item 23 asks you to pick one.
- Content setting name: CV6 item 18 uses "Mature content" (Off / 13+ / 18+) plus the Multiverse age confirmation.
- The CV6 section goes into `docs/story-bible.md` (step 1), so there are still seven docs files.

---

# regress-campaign-side
## Regression review: Hazel's Grove campaign and side stories (2026-10-15)

Scope: `campaign-book1.ts` to `campaign-book3.ts` and the seven side-story files, compared with
`SCRATCH/baseline/content/`. Inputs: `canon.md`, `part-m/review-campaign.md`, `part-m/review-side.md`,
`log-campaign.md`, `log-side.md`, the `log-edu-*` logs and `fix/diffs/`. Report only: no content file was edited.

Checks run:
- `npx tsx tests/tools/content-check.ts --warnings` gives **problems 0, warnings 5**. All five warnings were
  there before this pass (`s5-water`, `s21-log` ×3 and `reader:lj1-s3-done`), so **nothing is new**. The earlier
  "missing" and "long sprout" items are gone.
- `tsc --noEmit` is clean for `src/`. The only errors are in `tests/tools/_rg_*.ts`, which are scratch files
  from another pass and not content.
- No scene id named in the notes is missing. Every review item was checked against the current text, not just
  against the logs.

Late edits not in the fixer logs: three base-file edits were made at 20:15, after both fixer logs.
- Frog → owl (`c11-close`): this is fine.
- The `s21-complete` lantern hood: this is fine.
- `s10-letter-told`: this one is a regression (row 1).

## 1. Unfixed items

Review coverage is complete:
- **Campaign:** 64 rows (13 must, 34 should, 11 nice, 4 cross, 2 canon).
- **Side stories:** 47 items (7 must, 21 should, 19 nice).

Every item is fixed, or adapted or skipped for a sound reason:
- **The skips are correct.** S28's bible row already reads ch4 → ch11, and N9's "Moss's Flower" is already in
  both bands.
- **The prompt edits P1 to P4 are applied.** They are in `/mnt/user-data/outputs/grove-backlog-prompt.md`.

**Strictly unfixed: 0.** One residual is worth a line:

| File | Where | Note | Fix |
| --- | --- | --- | --- |
| campaign-book3.ts | `c9-close` l.322 | Review S15 (theme: "nothing left in her to take" undercuts "the grey can be loved") was fixed in `c10-bearer-sable`, where it was cited. The same idea still stands one chapter earlier: "It has nothing left to take." The reader band already dropped it here. | `MOSS('Only a grey one can carry it close. The cold has already done its worst to the grey. It has nothing new to say to them.'),` |

## 2. New problems

Severity: **H** = contradiction or blocker, **M** = visible continuity or logic slip, **L** = polish.

| # | Sev | File | Where | Problem | Exact fix |
| --- | --- | --- | --- | --- | --- |
| 1 | H | side-stories-main.ts | `s10-letter-told` l.1085 (the late 20:15 edit) | The new line reads "Hazel sent them home last night, and every one of them came straight back." But the letter plays the morning after chapter 12. "Last night" is `c12-close`, where "The Keepers are all still here. Nobody has gone home" and everyone watches her lantern all night. Hazel was on the hill. She sent them home two nights earlier, in `s10-night-told`. The baseline line was right. | `N('The Keepers are already at the gate. By the look of them, none of them slept much.'),` This matches the reader band (`edu-side-2-reader`). |
| 2 | H | campaign-book3.ts `c11-close` note (l.~1443); side-stories-main.ts S9 notes (l.~755); prompt step 7 (l.1377) | Chapter 11 hold | `c11-close` now waits for "`s9-ask` seen, or `keptStone`", with no other way out. S9 needs player actions: giving Hazel the trowel, and being at the gate at dusk. The old S9 fallback ("If chapter 12 begins before step 2 is done, skip to the gate scene anyway") was deleted. So any unmade run where the player ignores S9 can never leave chapter 11. That makes an optional story a blocker. Canon 4 only asks that S9 "has had its chance". | **c11-close note and the prompt's step 7:** after "(s9-ask has been seen, or S9 cannot run because keptStone)", add "or S9 is still on step 1 or 2 at the dusk after threeFriends is met. Then c11-close plays that evening, c11-gate is skipped, and S9 jumps to its dawn gate scene before c12-open." **S9 notes:** restore "If chapter 12 begins before step 2 is done, skip to the gate scene anyway (he still comes)." |
| 3 | M | side-stories-main.ts | `s9-word` l.701, with `c11-close` l.814 | On the eve of chapter 12 the order is now: `s9-ask` → `s9-word` → `c11-close` → `c11-gate` → `s10-night`. Two things go wrong. First, `s9-word` ends at bedtime ("At bedtime she leaves the cottage door on the latch"), and the next scene is an evening sit by the pond. Second, `c11-close`'s canon opener "Days go by like that" now comes straight after Corvin's "till first light", so it reads as if days pass before `c11-gate`. The reader band has the same `s9-word` line (`edu-side-2-reader` l.1930). | **`s9-word` (main and reader):** `N('Hazel says nothing at all. On her way out to the pond, she leaves the cottage door on the latch, which she never does.'),` **`c11-close`, when `s9-ask` has been seen:** insert after line 0 `N('Then comes the evening Corvin asks at the gate.'),` and note it as a line variant. |
| 4 | M | side-stories-main.ts | `S10_NIGHT_SECRET` l.179; `S10_NIGHT_TOLD` l.187 (reader: `edu-side-2-reader` l.2517, l.2642) | `s10-night` now plays minutes after `c11-close` on the same evening. Hazel announces "Tomorrow… then up the hill" twice in a row: `c11-close` says "Then I'm going to go up the hill…", then `s10-night` says "Then I'll go up the hill." | **l.179:** `H('After that, nobody fuss. I mean it.', 'soft'),` **l.187:** `H('Tomorrow you’ll tell them what the Grove is going to be.'),` Make the same two edits in the reader band. Sprout is fine, because its `c11-close` never mentions the hill. |
| 5 | M | campaign-book3.ts (also `edu-campaign-3-sprout` and `-3a-reader`) | `c9-open-sold` bargain branch (shared `C9_CHOICE`, l.194) | The new variant shows "your" sold Nubbin in the second row. Then "Buy Ash back" sets `boughtBack`, and the sim's bargain side effect (`sim/campaign.ts` l.347) brings the sold Nubbin home. The text only ever shows Ash leaving, so your Nubbin silently comes back, or silently stays. | Give `c9-open-sold` its own choice set, the same as `C9_CHOICE` except that bargain's `then` adds these two lines after the Shells line: `CORVIN('And that one. Yours, once. The two hundred covers it.', 'think'),` and `N('Your old Nubbin walks out behind Ash, number and all. It doesn’t look at you. It comes anyway.'),` Mirror this in both bands. |
| 6 | M | campaign-book1.ts l.619; edu-campaign-1-sprout l.754; edu-campaign-1-reader l.945 | `c4-tale` "ask-loved" | The canon-2 rewrite names "Briar’s" flower in the Tale's part 1. Briar is first introduced in `c4-tale-2` ("Briar, who laughed…"), so the player meets her name before her. | **Main:** `…When the first flower came up by the big stone, I planted one for her beside it.` **Sprout:** `When the first flower came up, I planted one for her, right beside it.` **Reader:** `When the first flower came up by the big stone, I planted one for her right beside it. Now I go and sit with them both.` Canon 2 still holds, because `c4-tale-2` and `c12` name it as Briar's. |
| 7 | M | side-stories-main.ts l.247 (reader: `edu-side-2-reader` l.2197) | `S10_LETTER`, line 0 | This is older than the pass, but it is now on the main ending's path. With "Open", `c12-open` lifts the gate off its hinges, and `end-hazels-grove-open` says "There is no gate any more". The next morning the letter still says "The gate is stuck. You lift and push." | Add a line variant when `letThemGo`: `N('Morning. Your Nubbins are up before you. There is no gate to stick. You lift and push at the air anyway.')`. In `s10-letter-told` with `letThemGo`: "at the gate" → "at the gateposts". |
| 8 | L | campaign-book3.ts | `end-epi-walk-moss-stayed` l.1187 | Grammar: "Moss walked her up on her shoulder" says Moss carried Hazel. Both bands already say "rode". | `N('Moss rode up on her shoulder. At the top, for the first time since the Long Night, he turned round to face the Grove.'),` |
| 9 | L | campaign-book3.ts | `c10-close` l.724 | The new elliptical clause needs a comma to parse: "too tired to go home and not one of them willing to." The reader band has the comma. | `…too tired to go home, and not one of them willing to.` |
| 10 | L | campaign-book3.ts | `c9-close` l.321–323 | N4's two added Moss lines both end on "keep watch", two lines apart ("keeping watch" / "and keep watch"). | l.323: `MOSS('None of us was grey, then. We could only break it, and wait.', 'sad'),` |
| 11 | L | side-stories-new-2.ts l.262 (reader: same line, reworded) | `s12-settled`, "gaps" branch | N12 moved the player's line to Solo. Now a fluent, reasoned sentence sits in a voice that is otherwise broken ("Sit with me. No. Tell me. No. Both."). It also adds Nubbin speech, which canon 17 already flags for S12. | `SO('Lean. But leave a gap. For one. Is that allowed?', 'think'),` |
| 12 | L | side-stories-new-1.ts | `s15-complete` l.554 | The next line contradicts it: "She hasn't put it down since." is followed by "Pip carries the painted egg home in her hat." | `N('Dashwood pressed the painted egg into Pip’s hands on his way out.'),` (drop the second sentence) |
| 13 | L | side-stories-fun-2.ts | S8 notes l.872 | The shipped notes point to "the hand-off in the fix log", which is a scratch document. | "…c11-close swaps its thin-Nubbin line once S8 is done (see the c11-close note in campaign-book3.ts)." |

Checked and sound:
- **The ending order and `end-hazels-grove-open`.**
  - The order is collector → empty-lantern → eternal-dawn → wild-grove → hazels-grove → moss-sleeps →
    shadow-keeper → long-road.
  - The `hazels-grove` test in `sim/campaign.ts` no longer reads `finalChoice`.
  - The variant swaps only the first body line. It matches canon 24 word for word.
  - wild-grove still wins for force with "Open".
  - A bonded Sable can no longer reach long-road.
  - The gate epilogues read correctly with no gate.
- **S9 and `c11-gate`** match canon 5 in both files:
  - Corvin's first arrival is in `s9-dusk`.
  - `c11-gate` is a return, with one latch try "for form's sake".
  - Hazel's stance is "It's your gate now".
  - In `s9-ask` he says "till first light", and he exits "doesn't go far".
- **S8 and `c10-bramble`** follow canon 10:
  - "Her mother runs the place… I gather you've met" plays only in `c10-bramble`.
  - `s8-complete-dawn` skips Hazel's surprise.
  - Both versions share the tail.
  - The ears follow canon 10.
  - The `s8Done` line swap is in the `c11-close` notes.
- **Variant wiring:**
  - `SIDE_STORIES_FUN_2_VARIANTS` is exported and checked.
  - `c9-open-sold`, `c11-moss-kept`, `c11-moss-passed`, `c5-considered` and the five `s19-*-alone` scenes all
    exist in both bands.
  - The walk = moss rule (keptStone → `-moss-stayed`) agrees in both files.
- **Canon sweep:**
  - No "Yes."-first-word, "stop asking me things", torn ear on Bramble, bathhouse home, "For a year", "aged
    twelve", "same as everyone", lower-case lantern night, or "figure it out".
  - No American spellings in any added line.
  - The third rule is quoted in exactly four side stories (S1, S9, S10, S14).
  - 0 narration lines are still over two sentences.

## 3. Verdict

**Pass, with fixes needed.** The fix pass is thorough and faithful to canon. Every review item is
accounted for, the adaptations are well argued, and content-check is clean (0 problems, no new warnings).

Two high-severity regressions need fixing before this ships:
- **The `s10-letter-told` contradiction (row 1).** This is a late, unlogged edit.
- **The chapter 11 hold (row 2).** It can softlock any run that skips S9.

Five medium items follow from the new chapter 11 sequencing and the new variants (rows 3 to 7). The rest
is polish.

**Learning Grove:** I spot-checked 42 changed scenes in each band (sprout and reader), well over the 15
asked for. They cover 22 campaign scenes, all 5 new campaign scenes and 15 side-story scenes.
- **The canon changes landed in both bands, in each band's own voice.** This includes:
  - Moss sat beside young Hazel, and she never asked him to speak;
  - "You'll do";
  - Briar's flower is the first;
  - Sparks and Pixel are she;
  - the folded ears;
  - Tilly's note;
  - Ember's age of fifteen;
  - "Days go by";
  - `c11-gate` as a return;
  - the Wellspring rim;
  - the cottage step;
  - Lantern Night.
- **Death is said plainly in sprout**, with comfort straight after.
- **The only band problems mirror main-file problems:** rows 3, 4, 5, 6, 7 and 11.
- **One older sprout slip remains in `c10-bramble`.** Hazel finds the youngest "all alone" yet names Bramble
  as its mother, which is the thing review S21 removed from main. It is low priority and not new.

---

# regress-fun-mv-edu
## Regression review: fun quests, Multiverse, Neopia, Learning Grove (fun + languages)

Scope: the code items in `part-m/review-fun.md`, `review-mv-atlas.md` and `review-edu.md` (fun-quest and
language files), checked against `fix/log-fun.md`, `log-mv.md`, `log-edu-fun-avatar.md`,
`log-edu-fun-python-bean.md` and `log-edu-languages.md`. The baseline is `SCRATCH/baseline/content/`.
`fix/diffs/` predates the edu pass (and `lang-*.diff` are empty), so the edu and language files were diffed
directly against the baseline. Prompt-only items are out of scope.

Checks run from REPO:
- `npx tsx tests/tools/content-check.ts --warnings`: **problems 0**, 5 warnings.
  - 4 are `pronoun?` warnings (`s5-water`, `s21-log` ×3). These are side stories, outside this scope, and look like false positives.
  - 1 is `timer? reader:lj1-s3-done` ("The Earth spins round once a day"), a false positive.
  - Totals: 244 quests, 1469 scenes, 371 results.
- `npx tsc --noEmit -p .`: clean.

Hand-off H5 (the audience checks in content-check) is in place. The checker now fails any non-`all` quest in an edu pack or edu quest.

## 1. Unfixed items

**None.** Every code item (must, should and nice) is either fixed or adapted. Every skip has a sound reason:

- **review-fun:**
  - #24 (Q15 cheese-shop wording) and #25 (seven unverified quotes) are left for Maor, as the brief says.
  - #27 (Q37 cadence): the reviewer said to keep it.
  - #34 (Uncle Tenzo) was information only.
  - Adapted, all of them sound:
    - #4/T2: one shared "Mature content" setting instead of a Puddle's Pub toggle.
    - #20: Lumi is named once, in `q60-complete`.
    - #23: "The larch.", with `childLines` #4 and #9 still resolving.
    - #26: the Q9 riff is rewritten for both modes.
    - #33: Rook speaks his own line.
    - #35: Mr Tallis, not Mr Pellow, which would clash with Old Mr Pell.
- **review-mv-atlas (code):**
  - Every item is fixed or adapted. The adaptations are sound: M4 is the data option, M5 fits both CA10 paths, S1 inverts Tien's line to match DB14, and N14 keeps the Fire Faerie's motive.
  - Skipped with reason: the optional "memorial card in its own Grove" on M2. It would write another save, which breaks canon 21.
- **review-edu (fun and language files):** every must, should and nice item for these files is applied in the base files and in both bands. Two were adapted, soundly:
  - The sprout `lh5-s2` line keeps the verifier's "A friend who's a boy…" wording instead of "boy friend".
  - The python-1 reader `q01` gets new wording, because the reviewer's line clashed with the next line.

  Left alone, with reasons:
  - The in-scene "Quick-fire" games.
  - "okay" vs "OK" (a game-wide choice).
  - "Mr. Tweed", inherited from `quests-bean.ts`.

  Outside this scope, I also spot-checked review-edu's campaign and side items: the Sparks pronoun lines, Moss's "Yes.", "since before the trees were trees", the parentNote, `s11-jar`, `s18-heart` and "Most water". All are fixed.
- **Hand-offs:**
  - H1, H2 and H3 are applied.
  - H5 is applied.
  - H4 ("once per Nubbin per life" in `neopia-quests.ts`) was superseded: the Multiverse/Neopia fixer made NQ31 and NQ32 one-time instead. The result is the conflict in row 1 below.
  - H6 is still open: `script-book/` is stale (`04-fun-sunny.md`, `05-fun-avatar.md`, `20b`, `21b` still say Bohdi, Fennick and "first snow day"). It is generated output, so the fix is to regenerate it, not to edit content.

### Breakage checks that passed

- **`requires`, the Avatar order.**
  - Q46 has no `requires`. Q47–Q65 require Q46. Q56 → Q64 (Q46, Q56) → Q49 (Q46, Q64) and Q55 (Q46, Q56, Q64). There are no cycles.
  - Every trigger is satisfiable outside chapters 9–11. Q62 "Any snow day" can fire in late autumn, at chapter 12, after the campaign, or in the Free Grove. Q55 "Any summer evening" can fire in chapters 2–6, after the campaign, or in the Free Grove.
  - Bao speaks only in Q55, Q56 and Q64. Kaito appears in Q49, Q50, Q55, Q64 and Q65; in Q50 and Q65 he is Tenzo's nephew at the stall, not one of the gang.
  - The edu quests inherit the same `requires`, so both modes are reachable.
- **`requires`, the Neopia chain.** Learning Grove, by data alone: NP1 → NP3 → NP4 → NP6 → NP11 → NP12 → NP13. In the main game, `requires` plus engine backlog #2 gives NP1 → NP13 in order. NQ chains are unchanged. Every quest is reachable in both modes.
- **The `all` Neopia plots.**
  - Only two lines recap a `main` plot: `np04-feast#0` and `np13-broadcast#2`. Both have `childLines`, and both keys resolve.
  - NP6, NP11 and NP12 reference no main plot.
  - NP13's "robot in Maraqua" is NP1's Mechachiazilla, so it is fine.
- **Audience (canon 20).**
  - Multiverse: 100 of 100 quests are `adult`.
  - Sunny Q31–Q45 are `adult`. The Q31 trigger carries the 18+ gate, and Q32–Q45 require Q31.
  - Neopia: NP2, NP5, NP7–NP10, NQ22–NQ26 and NQ28 are `main`. The rest are `all`.
  - Python, Bean, Avatar and the language packs are all `all`.
  - Nothing that is `main`, `teen` or `adult` is in any edu pack or edu quest (content-check now enforces this). No edu file uses `mags` or `bohdi`.
- **SP3/SP4 swap.**
  - Codes, ids, scene ids, reward ids, `sets`, sources (#5–7, then #9) and file order all agree.
  - The triggers chain: SP2 → SP3 "After The Clown", SP3 → SP4 "After Overt-Kill", SP4 → SP5 "After Angela".
  - MK7 requires `['MK6','SP4']`, and its trigger and notes say Angela.
  - E3's Bobby note says SP3 (Overt-Kill). SP4's closing line still hands off to the MK rooftop.
  - Read in the new order, it improves: Overt-Kill's "Twist's friends send their regards" now follows SP2 directly. Cogliostro's teaching and Angela's "a fresh one" still read correctly after the first full-power fight.
- **E6 reflection.** The notes, the gate and the core choice say the Eternal is a Multiverse-only reflection, and no other save is written. The Ultron "endless" error resolves into "being remembered". Doom's disc insert sits after `trapscene#4` and reads correctly. (One wording nit: row 4.)
- **FF7.** Strange wins and Doom comes second. "The runner-up is owed a boon by the Sorcerer Supreme." Doom's "You owe me" in `-descent` follows. The step goal matches, and the notes match the source.
- **E1.** "I promised not to change anything… I only caught him while he was falling" works on both CA10 paths. On `healed`, Kobik says "Mend, not change"; on `refused`, she accepts "Even the sad bits?". There is no second resurrection.
- **E3 / MK8.**
  - MK8 now ends with Khonshu dropping Marc on the Mission roof ("You will come back to me") and "keep that light burning". `mv-mk-sky` is `cages` or `stood`, and no stale `mv-mk-lantern` reader remains.
  - E3 alone has the throne/cure refusal and the lantern descent, so nothing happens twice.
- **E4.**
  - Tien beats Tao, Shen beats Yamcha, Goku beats Tien, Shen faces Ma Junior. The DB20 bracket lists Chi-Chi and Tao.
  - DB20's "Show me the rest in the ring" reads as Shen watching Goku, not as a rematch.
- **Results and freebies.**
  - No new timers or farms in the quests. Q62's penguin sledding is unlimited on snow days, the NQ1 Omelette is unlimited, and the NP12 cup is one-time.
  - The per-Nubbin-per-life model **does conflict** with NQ31/NQ32. See row 1.
- **Languages.**
  - A script compared every Hebrew run, every kana/kanji run and every macron word in all six language files against the baseline. No new spellings, nothing removed, and all files are NFC.
  - Every changed line that uses Hebrew or Japanese was read in context. All correct: בְּסֵדֶר, שְׁמוֹנֶה (shmone, 8), עֵץ (ets), ב without its dot, חָבֵר/חֲבֵרָה, おじいちゃん/おばあちゃん/ともだち, ojīchan/obāchan, いち…じゅう, とうろうながし (tōrō nagashi).
  - The Hebrew football logic now holds: two goals, the ball rolls into Ori's goal, the score is ten to one, and "Ori let in one goal" makes sense.
- **New Learning Grove lines.**
  - 238 new or changed lines in the fun and language bands, fuzzy-matched against all originals and `childLines`. No source-quote near-matches. The changed riffs (shrubbery, ankles, haggling, "come in again", fresh fruit, comfy chair, "We can all think for ourselves") are all reworded.
  - The verbatim mirrors in the reader band follow the existing pattern (about 61% of fun reader lines matched their originals before this pass too) and carry no source quotes.
  - No quiz tone remains in lesson prompts. What's left is the in-scene "Quick-fire" games (kept on purpose), Bean's "Test day!" story beat, and "fair test" in the science lessons.
  - Line caps are clean: no `long` warnings in scope.

## 2. New problems

| File | Where | Problem | Exact fix |
|---|---|---|---|
| `results.ts` (vs `neopia-quests.ts` NQ1/NQ31/NQ32 and log-mv's Part G edits) | Header l.23–25, the section comment l.384, and every Neopia freebie `screen` and `outcome:taken` line | **The freebie models conflict.** The fun fixer made every freebie "once per Nubbin per life". The Neopia fixer made the Snowager (NQ31: "One sneak, one prize, ever"; "That's your one, mind.") and the Giant Jelly (NQ32) one-time, made the Omelette unlimited (NQ1 notes and engine backlog #7), and wrote Part G to match. Per-life is also neither one-time nor unlimited (canon 22). A life resets at rebirth (`rb-*`), and each new hatchling gets another go, so it is a slow farm. As it stands, a Nubbin that has had its Omelette slice this life (`om-09`) can block NQ1. | Follow canon 22 and match Part G. **Header:** "Neopia freebies: outcome:<name>, listed per set. Each is one-time (one go per save, a fixed prize) or unlimited; nothing resets per visit, per day or per Nubbin life. outcome:taken = the one-time go is used. The Soup Kitchen has no limit." **Unlimited (giant-omelette, underwater-fishing):** `screen` "…, unlimited (…)"; drop `taken` and lines `om-08`, `om-09`, `om-10` and `uf-10`. **One-time (giant-jelly, tombola, fruit-machine, snowager, the four wheels, anchor-management, deserted-tomb, meteor-crash-site):** `screen` "…, one-time (…)", and reword each `taken` line from "this life" / "per Nubbin, per life" to "ever". For example, `sn-10`: "You've had your one sneak. He sleeps light for anyone he's smelt before."; `gj-10`: "You've had your jelly. The Giant Jelly quivers in what might be disapproval."; `tb-10`: "One ticket, ever. The drum stops spinning and looks at you." **Coltzan's Shrine and Lab Ray:** "once per Nubbin, ever (rebirth does not reset it)". If Maor rules per-life acceptable instead, apply log-mv "For Maor" reverts to NQ31/NQ32 and amend canon 22. |
| `neopia-quests.ts` | NQ32: reward `nq32-giant-jelly` description and notes ("granted once, when np-line-complete is first set") | If the player finishes NP13 before doing NQ32, the grant trigger has already passed, so the one-time Giant Jelly is never given. | Description: "One time only. Once you have finished both this quest and the Neopia line (NP13), the Official leaves one more jelly behind the Food Shop, and denies it." Notes: "…granted once, as soon as both `nq-32-done` and `np-line-complete` are set (whichever comes second)…" |
| `neopia-line.ts` | NP13 reward `np13-line` description | "all thirteen plots played" is false on the new Learning Grove chain, which plays seven. | "Completes the Neopia line: every plot played, and Dr. Sloth trapped for good." |
| `mv-endgames.ts` | `mv-e6-corescene`, choice `eternal`, `then[0]` | "Your Eternal is already there. Or its reflection is…" leaves it unclear whether the real pet is at stake. Canon 21 and the notes say it is always the Multiverse-only reflection. | "Your Eternal’s reflection is already there, carried all this way by the rift, as true as a face in still water." |
| `mv-endgames.ts` | `mv-e4-bracket#11` against `mv-e4-bracket-done#1` | The S1 rewrite says "won by a hair" twice within three lines: "Last time, Tien won by a hair." then Tien's "I won last time by a hair." | `mv-e4-bracket#11`: "Then the semi-final: Goku against Tien, the reigning champion." |
| `quests-avatar.ts` | Q62: `q62-iceberg#0`, `#2`; `q62-sled-done#0`; notes | The new mishap line puts Pemba "meditating on the pond" overnight, and the scene keeps Nalu and Tuk "on the frozen pond" and the sled run "across the pond". This conflicts with the Grove's ice-safety lesson (3a `c10-ledge-l2`) and with both edu mirrors, which now put everyone on the bank and use a frozen puddle. Q62 is `all`. | `#0`: "Snow covers the Grove. On the bank of the frozen pond, Nalu and Tuk are poking at a huge block of ice that wasn’t there yesterday." `#2`: "Pemba’s inside! He was meditating by the pond last night and… kept going." `q62-sled-done#0`: "You fly down the hill, across a frozen puddle and into a snowdrift." Notes: "meditated on the pond overnight" → "meditated by the pond overnight"; "a large glowing ice block on the frozen pond" → "a large glowing ice block on the bank of the frozen pond". |
| `lang-japanese.ts`, `edu-lang-japanese-reader.ts`, `edu-lang-japanese-sprout.ts` | `lj6-s3-done` line 0 (all three) | The LJ6 rewrite made the player's lantern optional ("Then it’s your turn, if you’ve made one."), but the next scene still says "Your lantern joins the others…" unconditionally. | Base and reader: "The lanterns drift on together: ひかり on the かわ, under the き. No あめ, no ゆき, just a warm, still night." Sprout: "The lanterns float on the kawa. No ame. Just stars." |
| `lang-japanese.ts`, `edu-lang-japanese-reader.ts` | `lj6-s1` ("Last year I floated one with obāchan. I wrote his name on it.") | After "for ojīchan" became "with obāchan", "his" has no male antecedent in the line. | Replace "I wrote his name on it." with "I wrote ojīchan’s name on it." in both files. |
| `edu-lang-japanese-reader.ts` | `reader:lj6-s1-done-l1` prompt | "I’m drawing ojīchan’s lantern on our little かわ." reads as drawing on the river. | "I’m drawing ojīchan’s lantern floating on our little かわ. Do you know what a かわ is?" |

## 3. Verdict

**Pass, with one ruling needed.** The fixes broke nothing structural:

- Every `requires` chain is acyclic, and every quest is reachable in both modes.
- No `main`, `teen` or `adult` quest reaches the Learning Grove.
- The SP3/SP4 swap is clean.
- The E6 reflection, FF7, E1, E3 and E4 rewrites read correctly in context.
- The language changes introduced no spelling, niqqud, kana or macron changes.
- content-check reports 0 problems, and tsc is clean.

The only real defect is row 1. The `results.ts` per-Nubbin-per-life freebies contradict the one-time NQ31 and NQ32, the unlimited NQ1 Omelette and canon 22. Maor should rule on it before either file ships. Rows 2–9 are small wording or edge-case fixes.

Two design points for Maor, not counted as defects:

1. **Is Neopia in the Learning Grove?** `neopia-line.ts` now builds a Learning Grove chain with `childLines`, but content-check's `eduPacks` and prompt l.1806 keep Neopia out of the Learning Grove. One of the two should change.
2. **How is the adult content gated?** log-fun E1 names a "Mature content" setting (Off/13+/18+); log-mv engine backlog #1 describes a one-time age confirmation before the rift. Pick one mechanism.

---

# log-regress-fixes
## Regression fixes log (2026-10-15)

Sources: `regress-campaign-side.md` (unfixed residual + 13 rows) and `regress-fun-mv-edu.md` (9 rows).
Canon sheet followed throughout. Backup of the pre-pass state: `SCRATCH/fix/regress-bak/` (content dir + master prompt).

Validation from REPO: `npx tsc --noEmit -p .` clean; `npx eslint src/content tests/tools` clean;
`npx tsx tests/tools/content-check.ts --warnings` gives problems 0, warnings 5 (the same five pre-existing ones), results 371 → 367 (four Omelette/Fishing `taken`/`gone` lines dropped).

## regress-campaign-side.md

| Item | Status | What was done |
| --- | --- | --- |
| Unfixed residual (`c9-close` l.322, S15 twin) | done | Main: "…It has nothing new to say to them." (same move as S15 in `c10-bearer-sable`). The reader band had already dropped the line, and sprout never had it. |
| 1 H `s10-letter-told` | done | Main: "The Keepers are already at the gate. By the look of them, none of them slept much." The reader band already had it. |
| 2 H c11 hold | done | `c11-close` note: added the way out (S9 still on step 1 or 2 at the dusk after threeFriends → c11-close plays that evening, c11-gate skipped, S9 jumps to its dawn gate scene before c12-open). S9 notes: restored "If chapter 12 begins before step 2 is done, skip to the gate scene anyway (he still comes)", and added the same way out to the eve-of-chapter-12 sentence. Master prompt `/mnt/user-data/outputs/grove-backlog-prompt.md`: the same way out was added to step 7 (l.1377) and to CV6 item 2 (l.~9010). |
| 3 M `s9-word` / `c11-close` order | done (c11 part adapted) | `s9-word` line changed in main and reader ("On her way out to the pond, she leaves the cottage door on the latch…"). The `c11-close` insert is a conditional line, so it is recorded as a LINE VARIANT in the main `c11-close` note: if s9-ask was seen, insert after line 0 N('Then comes the evening Corvin asks at the gate.'). Mirrored as a note in the reader (3b) and sprout (3) band notes. The reader note says its S8-swap line numbers count without the insert. |
| 4 M s10-night repeats "up the hill" | done | Main l.179 → "After that, nobody fuss. I mean it."; l.187 → "Tomorrow you’ll tell them what the Grove is going to be." Same two edits in `edu-side-2-reader`. Sprout left alone, as the report says. |
| 5 M `c9-open-sold` bargain | adapted | New `C9_CHOICE_SOLD` (main), derived from C9_CHOICE: same ids, sets and friendship, and two lines added to bargain after the Shells line. Corvin's line is verbatim. The narration became "…number and all. It doesn’t look at you, but it comes anyway." so it stays at two sentences (STYLE.md: no narration over two sentences). Mirrored as `C9_CHOICES_SOLD` in reader 3a (≤30 words) and sprout 3 (≤14 words: "And that one. Your old Nubbin. The Shells cover it." / "Your old Nubbin walks out behind Ash. It is coming home too."). Scene ids and choice ids are unchanged. The scene note and both band notes were updated. Verified by a script that dumps the bargain lines for all six scenes. |
| 6 M `c4-tale` ask-loved | done | Main, sprout and reader now say "the first flower" (exact texts). The main note says that Briar is introduced in c4-tale-2. c4-tale-2 l.690 still says "Hers was the first flower on the hill", so canon 2 holds. |
| 7 M letter with no gate | done | This is a conditional line, so it went in the main S10 notes as VARIANTS (4a): with letThemGo, S10_LETTER line 0 becomes "Morning. Your Nubbins are up before you. There is no gate to stick. You lift and push at the air anyway.", and in s10-letter-told "at the gate" becomes "at the gateposts". Mirrored in the reader S10 notes. Also added to the sprout S10 notes for the same slip in that band: "the gate creaks" becomes "footsteps", and "at the gate" becomes "at the gateposts". The report did not list sprout. |
| 8 L epilogue grammar | done | "Moss rode up on her shoulder." |
| 9 L `c10-close` comma | done | "…too tired to go home, and not one of them willing to." |
| 10 L `c9-close` "keep watch" | done | l.323 → "…We could only break it, and wait." |
| 11 L `s12-settled` gaps | done | Main and reader: SO('Lean. But leave a gap. For one. Is that allowed?', 'think'). The sprout line was already short and broken. |
| 12 L `s15-complete` | done | The second sentence was dropped. No band has the line. |
| 13 L S8 notes | done | "…c11-close swaps its thin-Nubbin line once S8 is done (see the c11-close note in campaign-book3.ts)." |

## regress-fun-mv-edu.md

| Item | Status | What was done |
| --- | --- | --- |
| 1 Freebie models (`results.ts`) | adapted (per the ruling) | **Header:** the report's text, with "(one go per save, a fixed prize)" changed to "(one go per save; the outcome rolled then is kept)". The sets have random outcome pools, so "fixed prize" no longer fits. The header also notes the Coltzan/Lab Ray rule. **Section comment** updated. **Unlimited:** giant-omelette and underwater-fishing; `taken` was removed from their screens, and om-08, om-09, om-10 and uf-10 were dropped ("gone" left the Omelette outcome list with om-08). **One-time:** giant-jelly, tombola, fruit-machine, snowager, the four wheels, anchor-management, deserted-tomb and meteor-crash-site. Their screens say "one-time", and every `taken` line now says "ever" (sn-10, gj-10 and tb-10 are verbatim; the others are in the same voice, and a per-save go says "you" rather than "{name}"). **Coltzan's Shrine and the Lab Ray:** "once per Nubbin, ever, rebirth does not reset it"; cs-10 → "Once, ever, is plenty." These now agree with neopia-quests.ts: NQ1's Omelette is unlimited, and NQ31 and NQ32 are one-time. |
| 2 NQ32 grant timing | done | The reward description and notes use the report's text verbatim (granted once both `nq-32-done` and `np-line-complete` are set, whichever comes second). |
| 3 NP13 `np13-line` | done | "Completes the Neopia line: every plot played, and Dr. Sloth trapped for good." |
| 4 E6 reflection | done | "Your Eternal’s reflection is already there, carried all this way by the rift, as true as a face in still water." |
| 5 E4 "by a hair" twice | done | `mv-e4-bracket#11` (index verified) → "Then the semi-final: Goku against Tien, the reigning champion." |
| 6 Q62 pond safety | done | #0 and #2 use the exact texts. `q62-sled-done#0` → "across a frozen puddle" (its second sentence was kept). Both notes phrases were changed. The trigger `where: 'The frozen pond'` was left as it is. |
| 7 `lj6-s3-done` line 0 | done | Base and reader: "The lanterns drift on together: …". Sprout: "The lanterns float on the kawa. No ame. Just stars." All files are still NFC, and no kana changed. |
| 8 `lj6-s1` "his name" | done | Base and reader: "I wrote ojīchan’s name on it." |
| 9 reader `lj6-s1-done-l1` prompt | done | "I’m drawing ojīchan’s lantern floating on our little かわ. Do you know what a かわ is?" |

## Not changed, for Maor

- **The master prompt still has the old freebie wording outside row 2's scope.** In Part G's freebie table (l.~1124), Coltzan's Shrine still says "Once per Neo pet per life, like the Lab Ray", and the Giant Jelly still says "the day you finish the Neopia line". Backlog item 23 (l.~9118) still says "Maor picks one". These should be updated to the ruling and the NQ32 timing.
- **`results.ts` Lab Ray has no `outcome:taken` line.** This was already the case before this pass. A second visit by the same Nubbin has no text yet.
