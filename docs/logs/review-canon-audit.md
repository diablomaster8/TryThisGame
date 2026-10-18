# Review: canon-audit (report mode, whole canon), 2026-10-17

Scope: every file in `src/content/` on disk: the campaign (12 chapters, 8 endings and their
variants), side stories S1–S31, Atlas A1–A31, Pixel's Arcade PA1–PA5, fun packs Q1–Q95, Neopia
(NP line and NQ quests), the Multiverse (IM, CA, FF, UL, MK, SP, DB, TS, E1–E6), the language
questlines (LH, LJ), the Learning Grove lines LB and LK, both Learning Grove bands for everything
that has one, the readers and results, the post-ending expansions E1–E3 and the separate
campaigns (storyline-*.ts). Nothing in `src/`, `tests/` or `docs/` was changed; this file is the
only output. The working index (flags, pronouns, speakers, repeats, triggers, rewards, choice
payoff) lives in the session scratchpad as `content.json`, `flags.json`, `choices.json`,
`pronouns.json`, `nubbin-speakers.json`, `repeats.json`, `tone.json`, `quests.json`.

Method: the whole index (`src/content/index.ts`) was dumped to JSON (7,151 main scenes, 7,561
Learning Grove scenes, 915 quests, 1,456 distinct flags written) and cross-checked by script
against `src/sim/` and `src/ui/` for every flag read, then every canon fact in `docs/canon.md`
was grepped by hand across the dump.

## Validators (not fixed, only run)

| Check | Result |
| --- | --- |
| `npx tsc --noEmit -p .` | exit 0, no errors |
| `npx eslint src/content tests/tools` | exit 0, no findings |
| `npx tsx tests/tools/content-check.ts --warnings` | `problems: 0`, `warnings: 3`, `long: 0` (915 quests, 5,370 scenes, 35,453 lines, 3,477 choices; edu sprout 3,652 scenes / reader 3,909) |

The three warnings are all false positives: `pa2-01-title` and `pa2-15-tears` ("He", "his") refer
to Byte, not Pixel; `reader:a27-13-complete` "Earth spins once a day" is astronomy, not a timer.

## 1. Verdict

The canon holds. Every settled fact in `docs/canon.md` 1–37 checks out across all 7,151 main
scenes and both Learning Grove bands: Moss and young Hazel ("a whole winter before I said a
word", "You'll do", never "Yes"); Briar's flower first and Moss's first love planted beside it;
Sparks and Pixel she/her, Dusty they/them, Byte/Clank/Wisp/Moss he, Sable she, Sir Dentwhistle
never gendered; chapter 11 opens its close with "Days go by like that…"; Corvin's first arrival
is `s9-dusk` (lifts the latch, it sticks), `c11-gate` is the return ("tries the latch once, for
form's sake"), `s9-ask` has "till first light", and the S23 vigil (`c10-vigil-corvin`) has him
in the lane not trying the latch; the Wellspring never freezes anywhere; Ember was fifteen; Tilly
got a note in her welly; Nova "since the snow"; Hazel stood at Corvin's gate an hour in the
autumn (c9-open); Wisp's ear torn, Bramble's and her youngest's folded; Wisp under the cottage
step; "Day 300-something" verbatim; `end-hazels-grove-open` opens with the approved line; Lantern
Night is capitalised everywhere; Sable speaks exactly once ("…safe.", `c10-safe-sable`); the
third rule is quoted in the campaign and three side stories (S1, S14, S31) plus two Atlas
choices; S9's family rule in the sim has all six ties; S27 closes before chapter 9; S19 needs
the stone unmade; S6 needs Ash out of the garden; no fun quest, LB or LK triggers in chapters
9–11; no Atlas, Arcade, Multiverse or Neopia file writes a Grove flag (every flag they set
carries their own prefix); no real song lyrics (Q47's "Secret Tunnel" and S22's climbing songs
are original); ratings are as decreed (Multiverse and Sunny `adult`, A1/A3/A4 `teen`, Neopia's
war plots and A21 `main`, A23's two `main` quests exempted from the Learning Grove); sprout
leaves out sell/grab/drive-off/keep-the-stone with the right `defaultChoice`; no timers or
"once a day" in any line.

What is wrong is structural rather than factual: the Multiverse and the Neopia line never read
their own choices (the "choices are real" rule), the four separate campaigns reuse the side
stories' codes S1–S4, one speaker id names two different people, and a handful of beats are
repeated word for word across side stories. There are no blockers.

## 2. Must fix (blockers)

None.

## 3. Should fix (major)

Grouped by storyline. Severity / category / where / quote / canon source / exact fix.

| Storyline | Sev | Cat | File:line, id | Quote (≤15 words) | Conflicts with | Exact fix |
| --- | --- | --- | --- | --- | --- | --- |
| Multiverse, all nine lines (IM1–15, CA1–10, FF1–10+EP, UL1–10, MK1–8, SP1–8, DB1–20, TS1–12, E1–E6) | major | payoff | `mv-ironman.ts`, `mv-cap.ts`, `mv-doom-ultron.ts`, `mv-moonknight-spawn.ts`, `mv-dragonball.ts`, `mv-toystory.ts`, `mv-endgames.ts`; e.g. `mv-im01-cave/walk` sets `mv-im01-plan` (mv-ironman.ts), `mv-ca02-plant-done/mp` sets `mv-ca02-saboteur`, `mv-ff01-launch/ben` sets `mv-ff01-first`, `mv-mk01-wolf/calm` sets `mv-mk-russell`, `mv-ts01-meeting/with-sarge` sets `mv-ts-recon` | (choice flags) | CLAUDE.md "Choices are real… a signature choice that pays off three or more quests later"; brief §2 | 105 of the 118 choice flags in the Multiverse are written and read nowhere (not in any variant, note, `requires`, `src/sim` or `src/ui`); 13 more are mentioned only once in their own file. Per line, pick one signature flag and add three later variant scenes to the line's `_VARIANTS` plus a `notes` sentence naming them, e.g. IM: `mv-im01-plan` → `mv-im04-duel-done-walk`, `mv-im08-captain-walk`, `mv-im15-complete-walk`; CA: `mv-ca02-saboteur` → CA5 smear, CA7 shield, CA10 memory; FF: `mv-ff01-first` → FF5 camp, FF8 tower, FF-EP face; UL: `mv-ul02-first` → UL5, UL8, UL10; MK: `mv-mk-first-face` (MK3) → MK5, MK6, MK8; SP: `mv-sp-wanda` → SP4, SP6, SP8; DB: `mv-db-goku-deal` → DB7, DB13, DB19; TS: `mv-ts-recon` → TS4, TS7, TS12; E1–E6: `mv-e1-peter` → E3, E4, E6. Alternatively demote the rest to `then`-only flavour and drop the `set` (then no flag is written that nothing reads). |
| Neopia line NP1–NP13 and quests NQ1–NQ32 | major | payoff | `neopia-line.ts` (e.g. `np01-sloth/np01-front` sets `np-01-tactic`; `np05-complete/np05-orb-return` sets `np-05-orb`; `np13-sloth/np13-talk` sets `np-13-distract`); `neopia-quests.ts` (`nq01-ask/nq01-warm` → `nq-01-promised-warm`, … `nq32-jelly`) | (choice flags) | Same rule | 40 NP/NQ choice flags are never read. Pick `np-05-stance` (defend / leave the citadel, NP5) as the line's signature choice and read it in NP9 (`np09-nabile`), NP11 (`np11-diary`) and NP13 (`np13-broadcast`) via variants; drop `set` on the NQ flavour flags or read each in that quest's `complete`. Also: `neo-faerie-side` is set by both NQ11 and NQ14 and `neo-faerie-colours` by NQ13 and NQ16 (neopia-quests.ts:783/1015 and 946/1165): make the second writer in each pair `requires` the first so a one-time reward isn't granted twice. |
| Separate campaigns S1–S4 (`storyline-hundred.ts:864`, `storyline-logged.ts:678`, `storyline-beetle.ts:644`, `storyline-dawndusk.ts:531`) | major | flag | `code: 'S1'` … `code: 'S4'` | `code: 'S3'` | Side stories S1–S4 (`side-stories-fun.ts:69/379/669`, `side-stories-main.ts:267`) already own these codes; `content-check.ts` resolves `requires` by `code`, and the journal shows codes | Rename the four storyline codes to `SL1`–`SL4` (or `C1`–`C4`) in the four `storyline-*.ts` files and wherever `docs/`/`plan.md` cite "S1–S4" for the expansions. Content only; the sim keys on `id` ('hundred', 'logged', 'beetle', 'dawn'/'dusk'), so no engine change. |
| S24 The Adventure Book | major | contradiction | `side-stories-s24.ts:92`, speaker `fairweather` = "Augusta Fairweather" | `id: 'fairweather', name: 'Augusta Fairweather'` | `neopia-line.ts:2031` declares `fairweather` = "Professor Fairweather" (Neopets). Canon 28 names Augusta as a new Grove character. One id, two characters, two portraits | Rename S24's speaker id to `augusta` (and the `say('fairweather')` helper to match) throughout `side-stories-s24.ts`, `edu-s24-sprout.ts` and `edu-s24-reader.ts`. |
| S30 What Sad Is For | major | repetition | `side-stories-s30.ts:405` (`s30-wall`, Moss) | "After the White Year, some of the stilled ones never moved again. Hush sat with them." | Verbatim from S1 `s1-hush` (`side-stories-fun.ts:212`) and S26 `s26-hush` (`side-stories-s26.ts:705`), which S26's notes already excuse as "he repeats his tales". Three near-identical tellings in chapters 4–9 | Replace Moss's two lines at s30-wall with a new angle on the same memory, e.g. `M('Hush never tried to wake them. She sat where they could see her, and when one of them shivered she took it as a conversation.', 'sad')` / `M('That is what grief is for, she said. Keeping company. Clover's gold one has forgotten that, and somebody ought to remind her.')`. |
| S26 The Walled Garden (variant) | major | tone | `side-stories-s26.ts:1169` (`s26-door-thrums`), played by `src/sim/side-rules-late.ts:149` when `s12Done` | "Good morning, Keeper. Yes. That is a door. We have lived beside it for ever." | Canon 17 and 31: the hive chorus speaks in S12 only; "Animals and Nubbins don't speak in the Grove" | Either keep the variant but narrate it (`N('The wall hums back, in the broken chorus you heard in S12. It knows the door. It has lived beside it for ever.')`) or extend canon 31 to "S12's hive, and its one return in S26" (question 3 below). The sprout/reader copies at `edu-s26-sprout.ts` / `edu-s26-reader.ts` (`sprout:s26-door-thrums`, `reader:s26-door-thrums`) change with it. |

## 4. Nice to have (minor)

| Storyline | Sev | Cat | File:line, id | Quote | Conflicts with | Exact fix |
| --- | --- | --- | --- | --- | --- | --- |
| Campaign, S9 | minor | flag | `side-stories-main.ts:560` (`s9-dusk` `set: { s9Started: true }`) | `s9Started: true` | STORY-BIBLE "Conflicts resolved" 20 says chapter 11's gate line reads `s9Started`; the sim reads `seen(c, 's9-ask')` (`src/sim/campaign-routes.ts:135`) and never reads `s9Started` | No content change. Either amend bible item 20 to "reads whether `s9-ask` has played" or have the engine read `s9Started` (CV engine work). |
| S6 Ash's True Name | minor | tone | `side-stories-fun-2.ts:245` (`s6-whistle`, speaker `ash`) | "…pip. wirr. a?" | Canon 17: Nubbins don't speak in the Grove; Ash is given a speaker line | Make it narration: `N('From under the bookshelf, a sound: pip. wirr. a? The first sound in the register, half remembered.')`. |
| S7 Unverified | minor | tone | `side-stories-fun-2.ts:532` (`s7-no-clock`, speaker `null`) | "…prrp!" | Canon 17 | `N('Null, with no clock on it at all, says prrp, which Byte does not write down.')`. |
| S5, S8, S30 | minor | tone | `s5-list` (Fossil "…"), `s8-reunion` (Bramble "…"), `s30-sill`/`s30-ring`/`s30-shed` (Dimple, Drizzle, Fidget "…") | "…" | Canon 17 / canon 17 note "use narration ('Sable says nothing. Her ears stay up.')" | Replace each ellipsis speaker line with a narrated reaction (the S30 ones already have `basedOn` nods, keep those in `basedOn` only). |
| Multiverse MK1, MK3, SP1, SP3, SP8 | minor | tone | `mv-moonknight-spawn.ts:147, 426, 1310, 1353, 1593, 2331` (speaker `nubbin`, "Your Nubbin") | "Prrp?" / "Mm." | CLAUDE.md: in guest worlds "your Nubbin acts, but doesn't speak" | Narrate: `N('Your Nubbin makes a small questioning sound.')` etc. Also drop the `nubbin` speaker from the MK/SP `speakers` lists once unused. |
| PA1 (Pixel's Arcade cartridge 1) | minor | repetition | `arcade-pa1.ts:1886` (`pa1-18-rhyme`, Pixel) | "Cinder held them close and tight, kept them warm one winter night…" | Fourth full use of Cinder's rhyme (S1 `s1-wait`, S19 `s19-question`, S23 `s23-rhyme`); Grove lore carried into a cartridge world | Have Pixel hum it without the words: `N('Pixel hums something under her breath: four lines, the skipping tune from the lane. She stops before the last one.')`. |
| S23 Three Visitors | minor | repetition | `side-stories-s23.ts:605` (`s23-rhyme`) | "the flat sing-song children keep for old things" | Verbatim phrase from S1 `s1-wait` (`side-stories-fun.ts:286`) | `N('They chant it the way children chant old things, flat and fast. You know the tune; one word is new.')`. |
| S26 | minor | repetition | `side-stories-s26.ts:717` (`s26-hush`) | "She locked the door and put the key in the ground." | Verbatim from the campaign `c4-tale-3`; the S26 notes call it deliberate | Keep if Maor wants the echo; otherwise cut the sentence and let Moss say "You heard the rest at Lantern Night." |
| S26 | minor | tone | `s26-linnet`, `s26-earth-pick`, `s26-tobin-finds` (×2), `s26-tobin-bench`, `s26-key-choice` | "Away from that— off that— is that a SPADE?" | CLAUDE.md "Don't overuse em dashes" (eight in one story; S14 also eight, for Byte's interruptions) | Keep Tobin's two interruptions in `s26-tobin-finds`; turn the rest into full stops or ellipses (`'Too shady. Too stony. Too near the door. What do you think?'`). |
| PA5 (cartridge 5) | minor | repetition | `arcade-pa5.ts:203` (`pa5-01-wake`) | "Can you hear me? Nod if you can hear me. I can't see you nod." | Same opening joke as PA2 `pa2-01-step` (`arcade-pa2.ts:204`) | Give PA5 its own first-contact line, e.g. `PX('Player two. I've got the manual this time. It's in a language. Say something.')`. |
| Atlas, closing frame (A3-14, A5-14, A10-14, A11-20, A12-18, A15-20, A17-16, A18-16, A20-17, A27-17, A30-13) | minor | repetition | the `-complete` scene of each page | "You are back in the Grove, with Nova's atlas on your knee…" | Same scene shape and first sentence on eleven pages (the opening "Nova's atlas falls open at a page…" is the matching frame and is fine) | Keep the first sentence as the frame; vary the second so each page's souvenir line is the only repeated structure (A7/A18/A19 already do this with the marigold petal). |
| A24 The Jungle Book | minor | tone | `atlas-a24.ts:2298` (`a24-16-bagheera`, speaker `you`) | "We be of one blood, ye and I." | CLAUDE.md: the Keeper is a guest; the hero's story stays the hero's. Here the Keeper speaks Kipling's Master Words | `N('You give the Master Words back to him, the way Baloo taught them, and your Nubbin bows with you.')` (keeps the `childLines` entry at `a24-16-bagheera#11` pointing at a narration line). |
| Separate campaigns S3 (beetle), S4 (dawn/dusk) | minor | tone | `storyline-beetle.ts:68` (`b-c1-open`, 166 chars), `storyline-dawndusk.ts` (`dawn-c1-open` 165, `dusk-c1-open` 164) | — | CLAUDE.md "Every line ≤ 160 characters"; `content-check` does not cover storylines | Split each opening line into two. |
| Learning Grove, S28 reader | minor | tone | `edu-s28-reader.ts:336, 1108, 1542, 1762` (narrator) | "A think question, with no wrong answer." | EDU-STYLE: lessons come out of the story, "no quiz time"; this is a meta label spoken by the narrator | Delete the four narrator lines; the character's question that follows already does the work (the other reader files phrase it in-voice: "Here's one to think about."). |
| Learning Grove, campaign reader | minor | contradiction | `edu-campaign-3b-reader.ts:2354` (`reader:end-epi-gate-none` lesson reply) | "Moss sat beside her for forty years." | Canon 1: a whole winter before a word, then forty years of Hazel | `N('That's a lovely idea. Moss sat beside her a whole winter before he said a word, and stayed forty years. Though he did prefer the ground.')`. |
| LB (Learning Grove line B), LK | minor | flag | `lines-lb.ts:1797–1804` (`lb-ned-shop`, `lb-den-story`, `lb-shadow`, `lb-map-fair`, `lb-cafe-reply`, `lb-boat`, `lb-star-wish`), `lines-lk.ts` (`lk-pit`) | — | Written by choices, read only inside their own scene (the file header says so); the signature flags `lb-box` and `lk-first` do pay off (+11 and +9 quests) | Acceptable as flavour; if the rule is read strictly, read `lb-star-wish` once more in `lb12-complete` and `lk-pit` in `lk10-complete`. |
| A4, A5, A13, PA5 | minor | flag | `a4-mask` (atlas-a04.ts:2004), `a05-remember`, `a13-crust` (atlas-a13.ts:2741), `pa5-17-hold`, `pa5-18-after` (arcade-pa5.ts:2211) | — | Same: documented "read by nothing" flavour flags beside a signature flag that does pay off | Leave, or drop the `set` so no unread flag is written. |

## 5. Verified clean (so nobody re-checks)

- Signature-choice payoff, Atlas A1–A31, PA1–PA5, LB, LK and S23–S31: every page has a signature
  flag read three or more quests later (worst case A4 `a4-words` +3; best A4/A13/A16 +15–17), and
  S23–S31's flags (`s23-stay`, `s23-answer`, `s25-toy`, `s26-steps/tobin/key`, `s27-nine-name`,
  `s27-truth`, `s28-told/column/offer`, `s29-gift/wayfarer`, `s30-ring`, `s31-letter/night`) are
  read by `src/sim/side-rules-*.ts`.
- Campaign flags: `wisp`, `corvinGate`, `hazel`, `walk`, `millLetter`, `cinder`, `visitors`,
  `hushGarden`, `boughtBack`, `s8Reunited`, `keptStone`, `stoneUnmadeBy`, `mossReturned`,
  `letThemGo`, `freedByForce` are each written by exactly the story the bible names and read by
  `campaign-routes.ts` / `side-stories.ts`; the 31 flags the sim reads but no content writes
  (`s23-collector`, `s27-sold`, `s3-asked-*`, `s31-sable30`, `wispHome`, `mossFaded`, …) are all
  set by the sim itself.
- Rewards: no reward id or label is granted by two quests; the only double writers are the two
  Neopia pairs above.
- Pronouns: 156 candidate sentences hand-read; none wrong (every "his" near Pixel/Sparks is Byte,
  Clank or Mr Grue; every "he" near Sable is Wisp).
- Fake-archaic English: the 19 hits are all verified source quotes (Kipling, Brodeur's Edda,
  Zimmern's Shahnameh, Thompson's Gilgamesh, Python's "Three shall be the number") with
  `childLines`, plus Hodja's folk "do ye not know". None in the Grove's own voice.
- Death imagery in Grove stories: only Moss's "fading", Corvin's "died in her arms" (c9-open) and
  Dickens/Edda material inside S23/A20; no corpses, blood or graves beyond Aldous's.
- Learning Grove: no original quotes (content-check rule 1), death named plainly with comfort
  after, Hazel's illness never named, sprout cruel choices removed with the right defaults.

## 6. Best moments to protect

- `c4-tale-3` / `c10-moss-walks`: "I sat beside her a whole winter before I said a word. She
  fidgeted. She was very bad at it." The canon line, landed three times without wearing out.
- `s9-dusk` → `c11-gate` → `s9-gate`: the latch sticking twice, once as a try and once "for
  form's sake", is the stewardship theme done in two verbs.
- `s23-drip-home`: "I have latched that door every night for twenty-two years."
- `s2-night`: Luna and Clover arguing over your head, "Neither of them looks at you. They both
  very carefully don't."
- `s29-boats`: Marina's one verified Grahame line, and `s29-supper`'s children practising "one
  verse anyway".
- `end-hazels-grove-open`: "most of them still lift and push at the air where it was."
- `s26-tobin-finds` ("Sit? I— well. A minute. One.") is the one place the em dashes earn it.

## 7. Summary

| Storyline | blocker | major | minor |
| --- | --- | --- | --- |
| Campaign (chapters 1–12, endings) | 0 | 0 | 1 (bible/sim note on `s9Started`) |
| S1–S10 (S5, S6, S7, S8, S9) | 0 | 0 | 4 |
| S11–S22 | 0 | 0 | 0 |
| S23–S31 (S23, S24, S26, S30) | 0 | 3 | 3 |
| Atlas A1–A31 (A4, A5, A13, A24, closing frame) | 0 | 0 | 3 |
| Pixel's Arcade PA1–PA5 | 0 | 0 | 3 |
| Fun packs Q1–Q95 (incl. Sunny) | 0 | 0 | 0 (Sunny's 25 unread flavour flags are allowed by STYLE) |
| Neopia NP/NQ | 0 | 1 | 0 |
| Multiverse (9 lines) | 0 | 1 | 1 |
| Language questlines LH/LJ | 0 | 0 | 0 |
| LB / LK | 0 | 0 | 1 |
| Learning Grove bands (sprout, reader) | 0 | 0 | 2 |
| Expansions E1–E3 | 0 | 0 | 0 |
| Separate campaigns (storyline-*.ts) | 0 | 1 | 1 |
| **Total** | **0** | **6** | **19** |

## 8. Questions for Maor (decisions, not fixes)

1. **Multiverse and Neopia payoff.** The Multiverse (93 storylines) and the Neopia line were
   scripted before the "signature choice pays off three quests later" rule and read none of their
   choice flags. Retrofit (one signature per line, roughly 40 new variant scenes across the 9 lines
   plus 3 for Neopia) or exempt them as "adult/legacy, choices are flavour"?
2. **PA1 is `main`.** Canon 29 says the Arcade cartridges are "for all ages". PA2–PA5 are
   `all`; PA1 (18 quests) is `main` and so never reaches the Learning Grove. Intended (licence) or
   should PA1 be `all` with `childLines`?
3. **The Thrums in S26.** Keep the hive's one return at the ivy door (and widen canon 31), or
   narrate it (fix above)?
4. **Copyright on A25 and A26.** A25 quotes Ende's German refrain twice and AURYN's inscription
   once (three instances of two one-sentence lines, within the "three per storyline" rule only if
   counted by distinct line); A26 quotes R. Campbell Thompson (1928), public domain in the UK/EU/US
   but not everywhere, as its own header says. Both need the legal check already on the licence
   list.
5. **Moss's repeated tales.** S1, S26 and S30 tell Hush's memory in the same words and S26
   repeats a c4-tale sentence. The S26 notes call this a feature ("he repeats his tales"). Keep
   the device (then only S30 should change) or make each telling new?
6. **Storyline codes.** Rename the separate campaigns' codes away from S1–S4 (recommended SL1–
   SL4), and if so, should the sidebar/journal strings change with them?
7. **The daily gifts** in `sim/daily.ts` and `sim/neighbourhood.ts` remain the only no-chores
   breach; nothing in the script text is daily any more. Still awaiting the earlier decision.

## 9. Maor's decisions (2026-10-17)

1. **Multiverse and Neopia:** retrofit payoffs. One signature choice per line, paid off in three or more later quests; fix the two double-granted Neopia rewards.
2. **PA1:** was `main` only while its licence was open. Legal is now cleared, so PA1 follows canon 29 (pending Maor's confirmation of this reading).
3. **The Thrums in S26:** keep the hive's return at the ivy door and widen canon 31 (and the CLAUDE.md speaker exceptions) to allow it.
4. **Legal:** cleared for all sources, A25 and A26 included. Do not raise legal or licence questions again.
5. **Moss's tales:** each telling is new. Rewrite S26 and S30 so neither repeats S1 or c4.
6. **Storyline codes:** rename to SL1–SL4 and update the journal and sidebar text with them.
