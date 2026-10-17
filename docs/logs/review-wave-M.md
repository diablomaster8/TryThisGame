# Review: wave-M (Atlas A22–A31), fix mode

Date: 2026-10-16. Brief: `docs/briefs/review.md`. Files: `src/content/atlas-a22.ts` … `atlas-a31.ts` and their
logs `docs/logs/script-a22.md` … `script-a31.md`. Each page was reviewed against `docs/canon.md`, the story bible,
`STYLE.md`, its outline section in `docs/more-stories.md`, its log, and S24's margin-note list
(`side-stories-s24.ts`). A22–A26 were reviewed twice, because two dispatches overlapped. The two passes didn't
conflict: each later pass checked the earlier edits and added to them. The tables below merge the two passes, and
each fix is listed once.

## 1. Verdict

This is a strong batch, the best-kept Atlas wave so far. All ten pages honour their outlines, quest for quest. Every
signature choice pays off three or more quests later, and every variant is wired. No page writes a Grove flag: all
flags set are `aNN-` prefixed. Your Nubbin and Sable never speak, and only the sources' own talking animals do. There
are no lyrics, no song titles and no timers.

The real problems were these:
- Two pages had no Hazel margin note (A22, A23).
- Three margin notes broke the two-sentence rule or didn't match S24's text.
- A23 had about twenty lines sitting too close to the 1994 film, over its three-quote budget.
- One unflagged near-verbatim Zimmern line in an `all` quest had no `childLines` (A27).
- Moss could speak after fading in A30's keepsake.
- Wisp's two voices were mis-moded in A28.

All of these are fixed. After the fixes, the three checks end at 0 problems.

## 2. Must fix

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| atlas-a22.ts (+ log) | A22-14, `A22_VARIANTS` | S24 promises a Hazel margin note on every page; A22 had none. | Added `a22-margin-hazel` (read-only on `s24Done`). It follows the A20 pattern: “Abuela sat down by the river and stopped being right.” / “Took her long enough. Took me longer.” / “And under it, one letter: H.” It plays after `a22-14-complete`, or the first time the atlas is open at the river once `s24Done` is set. It is wired in the header, the A22-14 notes, the variants and flags comments, and the log (counts updated). | done |
| atlas-a23.ts (+ log) | A23-14, `A23_VARIANTS` | No Hazel margin note. | Added `a23-margin-hazel`: “He saw his father in the pool. They stay, you know.” / “In the face. Usually the chin.” / H. It plays after `a23-14-complete`, or at the pool once `s24Done` is set. It is wired in the header, the notes and the log. A duplicate copy from the overlapping pass was removed, so exactly one id remains. | done |
| atlas-a23.ts (+ log) | `a23-04-ledge#4`, `a23-06-bones#5`, `a23-07-dusk#6,#8`, `a23-08-rim#9`, `a23-08-dust#4`, `a23-10-help#6`, `a23-10-complete#2–6`, `a23-11-oasis#1,#6`, `a23-11-complete#3`, `a23-13-ridge#5`, `a23-14-pool#4`, `a23-14-clouds#4`, `a23-11-grubs-rafiki#3,#4`, `a23-15-rock#6` | About 20 lines were near-verbatim 1994 film dialogue, over the budget of three one-sentence quotes for a copyrighted source. Examples: “Lions eat guys like us”, “Welcome to our humble home”, “Stampede! In the gorge!”, “That's not my father”. | Each line reworded in our own voice, one for one, so no index moves. Examples: “You said to look up if I ever got lost. Well, I'm lost. Where are you?”; “I've been happy out here. Mostly. Nearly.” The log lists every changed line. | done |
| atlas-a25.ts (+ log) | `a25-margin-hazel` | Hazel's note was one narrator line of four sentences. It also added an “H.” line that S24's text doesn't have. | Split into “Never went. Read it twice.” / “You lose a bit of yourself with every wish. I'd have printed that on the cover.” (soft), in S24's exact words. The H line is dropped. The log's claim that the line was kept whole is corrected. | done |
| atlas-a26.ts | `a26-17-snake-done-hazel` | The note was one narrator line of four sentences, with “H.” inside the quote. | “Lost the plant. Kept the wall.” / “Good trade.” (soft) / “And under it, one letter: H.” | done |
| atlas-a27.ts | `A17_BIRTH` (in `a27-17-complete` and its `-sat` / `-night` variants) | “I am delivered of my pains” is Zimmern word for word. It sits in an `all` quest with no `childLines`, and the header listed it as a paraphrase. | “His name is Rostam. It means delivered: the pain is over, and here he is.” | done |
| atlas-a28.ts | `a28-02-road-wisp`, `warn` choice | `W('…deal.', 'angry')` is a lowercase whisper on the hiss mood, which breaks S2's two-voice rule. | `W('Hsss. Deal.', 'angry')` | done |
| atlas-a28.ts | `a28-02-road-wisp#3,#8`, `a28-08-debt-wisp#1,#8` | Four whisper lines had no mood. S2, S27 and the campaign always give lowercase Wisp `'soft'`. | Added `'soft'` to each. | done |
| atlas-a29.ts | `a29-01-margin-hazel` | The text read “Never been; Nova says…”, but S24 has “Never been. Nova says…”. It also had no atlas frame line. | Added an opening frame line. The note is split into “Never been. Nova says it's all singing.” / “I'd hum.” (soft). No H line, as in S24. | done |
| atlas-a30.ts (+ log) | Grove keepsake order (A30-13 notes, header, variants and flags comments) | The `cinder` check came before the moss-sleeps check. With `cinder` set and Moss faded, or before chapter 4, Moss spoke in the keepsake, breaking canon 17. | Now `a30-grove-tile-quiet` plays unless c4-out has been seen, `!mossFaded` and the ending isn't moss-sleeps (as A26 does). After that, `-cinder` if `cinder` is set, otherwise the base scene. The log is corrected. | done |

## 3. Should fix

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| atlas-a22.ts | A22-1 notes (SIM) | Typo: “clash);chapter”. | “clash); chapter” | done |
| atlas-a22.ts | `a22-02-kitchen#7` | “Nobody looks at it, all together.” is awkward. | “Everybody manages not to look at it, all at once.” | done |
| atlas-a22.ts | `a22-06-loads-done#0` | “as if her legs had been cut” is too harsh for `all`. | “as if somebody had cut her strings.” | done |
| atlas-a22.ts | `a22-13-split-done#0` | “the house comes down” twice in a row. | “Behind you, the walls begin to lean.” | done |
| atlas-a22.ts | `a22-16-photo#4` | “embroidered waistcoat”, but the player picks a skirt or a waistcoat in A22-12. | “in Mirabel's embroidery.” | done |
| atlas-a22.ts | `a22-16-complete`, last line | The doorknob reward appears from nowhere. | “…a carved doorknob Julieta slipped into your pocket, and a butterfly that came all the way home.” | done |
| atlas-a23.ts | `a23-06-bones#4` | Checker pronoun warning on “dusty and furious”. It's a false positive (the checker's case-insensitive match on Dusty), but the line reads that way for a moment. | “covered in dust and furious”. The warning is gone. | done |
| atlas-a23.ts | `a23-16-green#5`, `a23-16-complete#0`, `a23-16-complete-rafiki#4` | Rafiki marks the cub in the shared scene, which takes the Rafiki-path payoff (you crack the gourd). | The shared scene now has the rattle and the sneeze (an A23-1 callback). The mark moves to the Simba-path complete and the Rafiki-path complete. Line counts are unchanged. | done |
| script-a23.md | Counts, Flags, Variants | The log had to match the new variant and the rewordings. | Scenes 94 (19 variants), lines 727. Added the `s24Done` read and a “Review fixes (2026-10-16)” section. | done |
| atlas-a24.ts | `a24-15-lamp-mowgli#1` | “your face has gone brown” assumes the player's skin and reads as a remark about race. | “…you look like something the jungle raised.” | done |
| atlas-a24.ts | `a24-16-complete#0` | “four grey shapes and one brown one” names Mowgli by his skin. | “…four grey shapes and a boy going up it.” | done |
| atlas-a24.ts | `a24-17-surf#5`, `a24-17-drove` `believe` | “little grey one” for your Nubbin. Grey carries canon weight (Sable, the strays). | “little round one” | done |
| atlas-a24.ts | `a24-08-tree-done#0`, A24-8 notes | The headman sends Mowgli to herd, but he has been herding since step 2. | “Next morning the headman tells Mowgli to graze the buffalo far out on the plain…” The notes match. | done |
| atlas-a24.ts | `a24-08-tree#4` | The villagers are made gullible, against the care note (frightened, not stupid). | “Don't talk about ghosts after dark, Buldeo. The children are listening.” | done |
| atlas-a24.ts | `a24-08-gate#6` | The narration repeats what Messua has just said. | “Half of her believes this is her son come home. The other half doesn't mind either way.” | done |
| atlas-a24.ts | `a24-09-bounty#0` | Shows the skinning, against the care note (the hide is shown only on the rock). | “Mowgli kneels with his back to you, busy. He means to take the hide to the Council Rock.” | done |
| atlas-a24.ts | `a24-14-plan#0` | “wounded in one foreleg” goes against “no wounds anywhere”. | “limping on one foreleg” | done |
| atlas-a24.ts | A24-16 `speakers` | Messua speaks in `a24-16-trail-messua` but isn't declared. | MESSUA added. | done |
| atlas-a24.ts | `a24-01-door#10` | Slips into the third person straight after the lifted line. | “One day you will hunt the one who hunted you. Lie still, little frog.” | done |
| atlas-a24.ts | `a24-17-margin-hazel#0` | No move back out to the atlas (A20's pattern). | Opening atlas line added. | done |
| atlas-a24.ts | `a24-16-trail-messua#1–2` | Directions contradict the closing image. | “This way for me, the long way round…” / “He goes off along the ridge…” | done |
| atlas-a24.ts | `A16_LEAVE[0]` | “grey in the first light” clashes with the morning sun just before. | “…sits in the morning sun, empty, and it doesn't mind.” | done |
| atlas-a24.ts | `a24-10-complete-messua#2` | “That night” puts the Council in the wrong order. | “On the first night, at moonrise, …” | done |
| atlas-a24.ts | `a24-17-drove#1` | Clumsy, and slips into the past tense on an adviser-sensitive line. | “The men work quietly, at a job they were made to do for a company far away that owns it.” | done |
| script-a24.md | line 15 | Stale: said the file isn't registered in `index.ts`. | Corrected. | done |
| atlas-a25.ts | `a25-10-rhyme#1` | Forced image (“a candle that's bent”). | “She needs a new name, for the old one wore thin. She fades like a lantern with no flame within.” | done |
| atlas-a25.ts | `a25-10-rhyme#2` | Ungrammatical: “by whatever road came”. | “…by whatever road he came.” | done |
| atlas-a25.ts | `a25-16-complete#1` | Echoes the refrain in an `all` quest with no `childLines`. | `childLines` added. | done |
| atlas-a25.ts | A25-18 notes | `a25-18-attic-truth` was placed after `battle-done`, which contradicts its opening. | It now plays after the battle choice, before `battle-done`. | done |
| atlas-a25.ts | `childLines` `a25-20-shop#10` | Written as narration on a Coreander line. | “It's what the book always said, in German, whenever a tale had to wait for another day.” | done |
| script-a25.md | header, lifted text | Stale “not registered”, and the split and the new `childLines` weren't mentioned. | Corrected. | done |
| atlas-a26.ts | `a26-16-siduri-done-moss#2` | Moss “has buried a good many friends”. Nubbins fade; the outline says “outlived”. | “Someone who has outlived a good many friends, and is still having his supper.” | done |
| atlas-a26.ts | `a26-14-death#9` and its `childLines` | The grave turn ended weakly (“…and everything.”). | “…the mountains and the cedar forest, and never once let go.” The lifted words are unchanged, and the childLine matches. | done |
| atlas-a26.ts | `a26-18-foot` (+ `-spoke`, `-agreed`), `a26-18-foot-done` | The heritage care note (tablets taken, some returned) played only on one choice. | The heritage lines moved to the start of `a26-18-foot-done`, which plays on every path. The tablet choice is reworded in all three scenes. No index moves. | done |
| atlas-a26.ts | A26-10 notes | “Shamash speaks one word”, but he says two. | “Shamash speaks two words (“I hear.”)” | done |
| atlas-a26.ts | `a26-17-complete#2` | A toy boat is not “exactly like” the ark. | “It is his boat in little: a reed wall, pulled down and plaited into a way through the flood.” | done |
| atlas-a26.ts | header CARE, header LIFTED TEXT | “one plain line” didn't match the script. The verification status of the PD quotes was missing. | Both corrected. | done |
| atlas-a26.ts / script-a26.md | variants comment; log SIM | Moss's gate read “past chapter 4” here but “c4-out seen” elsewhere. | Both now say “c4-out seen && !mossFaded && ending != 'moss-sleeps'”. | done |
| script-a26.md | Counts, Changes | Stale line count; the heritage move wasn't noted. | Lines 634; note added. | done |
| atlas-a27.ts | `a27-07-corvin` | “an old man at a stuck gate”. Corvin is in his mid-40s. | “…a man at a stuck gate, lifting and pushing, who came back.” | done |
| atlas-a27.ts | `a27-16-arrival#5` | Sindokht's line was Zimmern with one pronoun changed; called a paraphrase, with no `childLines`. | “Hide her? She's our sun. And what is it worth to you, to see her?” The header and notes are updated. | done |
| atlas-a27.ts | `a27-17-wings#5` | A close modernisation of Zimmern. | “Be easy. I took you in when your father put you out, and I raised you. I have come to help you again.” | done |
| atlas-a27.ts | `a27-03-nest-done` | “your brother and sister” genders the player and the Nubbin. | “And these two are your nestmates.” | done |
| atlas-a27.ts | `a27-09-descent#4` (+ `-sat#5`, `-night#5`) | “never stood this close to a man” is wrong if the player is a man. | “…to anyone but you.” | done |
| atlas-a27.ts | `a27-08-feather`, night choice | Muddled line. | “Yes. He left you here for years. One night more won't hurt him.” | done |
| atlas-a27.ts | `a27-17-complete#4` | “He came straight away” contradicts the days of labour. | “You came the moment I called, and now he's here.” | done |
| atlas-a27.ts | `a27-14-kabul#1` | Unclear whose way out. | “In the family's rooms there is trouble already: the queen has caught Rudaba's maid…” | done |
| atlas-a27.ts | `a27-16-feast#5` | Weak and confusing. | “Your Nubbin has been told the feast lasts seven days. It is not pacing itself.” | done |
| atlas-a27.ts | `a27-16-feast` “down” choice | “grey down” contradicts the white chick-down cap. | “white down” | done |
| atlas-a27.ts | `a27-10-banquet` choice label | “eating the second rice” is unclear. | “Try to stop your Nubbin starting a second dish of rice.” | done |
| atlas-a27.ts | `a27-close-sable-wary#1` | Mixes indoors (“by the door”) with the long grass. | “on the ground at the edge of the long grass” | done |
| script-a27.md | header | Stale “not yet registered”. | Corrected. | done |
| atlas-a28.ts (+ log) | variants SIM header | Listed Fern's glove under the step, but Wisp gives it to Ananse in `a28-08-debt-wisp`. | “the egg stone and the empty hornet gourd, stoppered”. The log matches. | done |
| atlas-a28.ts | header, `stoneUnmadeBy` bullet | Called A28-10 a night scene; the funeral is by day. | Night scenes: A28-6 dusk, A28-11, A28-12. | done |
| atlas-a28.ts | header, `wisp` bullet | Wrong reveal point and re-read point. | Corrected to `a28-02-road-wisp` and `a28-wisp`. | done |
| atlas-a28.ts | header, frame | Nothing stopped an implementer muting Wisp on the unmade route. | Added the reasoning: his half-voice is a scar that outlasts the shard (campaign `end-epi-wisp-spared` / `-sable` keep it). | done |
| atlas-a28.ts | `a28-10-funeral#3` | “the whole valley”, a Grove word in an Asante village. | “the whole village” | done |
| atlas-a28.ts | `a28-11-gum-done#0` | “every page of this book” suggests the whole atlas. | “all the way through this story” | done |
| atlas-a29.ts | `a29-14-song#3` | Echoed the title of the film's song for that scene. | “It is like hearing someone tell the truth about herself, and not dying of it.” | done |
| atlas-a29.ts | `a29-07-alley#2`, `bow` choice | A comic hat on Sussie, against the gat care note. | A long tail and a beady eye; “Her long tail bobs.” | done |
| atlas-a29.ts | `a29-07-note` `read` choice | Jinu's broken-hat joke made the gat the joke. | It is now his coat, pinned by Zoey's knives (ties back to A29-6). | done |
| atlas-a29.ts | `a29-11-store-hid#1` | “you peel the tape off” contradicts the Nubbin-chews choice. | “She watches the tape come off Mira's wrists.” | done |
| atlas-a29.ts | `a29-13-courtyard-done` | The pear box was already taken inside in A29-4. | “You are still on the stone step by the gate, where you sat last time.” | done |
| atlas-a29.ts | `a29-13-complete#4` | Dangling clause. | Recast as two sentences. | done |
| atlas-a29.ts | `a29-09-complete#1` | “three against one, except it's two against one” was muddled. | “It's a vote, Rumi, and it's two against one.” | done |
| atlas-a29.ts | `a29-12-complete#4` | She “turns her back on the roof” while standing on it. | “turns her back on Jinu” | done |
| atlas-a29.ts | `a29-10-call#5` | “Bring me her” is clumsy. | “Bring her to me” | done |
| atlas-a29.ts | `C16_HOME#1` | A “roll of paper” that is a folding screen. | “a flat parcel tied with string. Inside is a small folding screen…” | done |
| atlas-a30.ts | `a30-10-psalm#0` | Sunset timing puts the rubbing-out on the Sabbath, against the care note and the 1904 source. | “The sun is low over the roofs.” | done |
| atlas-a30.ts | `a30-margin-hazel` | Added an “H.” line that S24's A30 text doesn't have. | Line removed. | done |
| atlas-a30.ts | `a30-10-grow-safe#4` | Avram's shout made the next scene's question odd. | “He's shut the whole lane in! Mama's behind one of those doors, and the rabbi doesn't know!” | done |
| atlas-a30.ts | `a30-10-grow-sit#0` | Wrong place (the caretaker's step instead of the rabbi's courtyard). | “In the rabbi's courtyard Yossele is sitting on the step…” | done |
| atlas-a30.ts | `a30-02-complete#4` | A joke about a rabbi's head covering. | “…and leaves his coat behind on the peg.” | done |
| atlas-a31.ts | `a31-09-night`, rat line | “She hid them there” contradicts `a31-02-complete`. | “…where he tied them before he went.” | done |
| atlas-a31.ts | A31-13 notes, stay rat inserts | Inserted mid-exchange. | Now after `a31-13-game-stay#4`. | done |
| atlas-a31.ts | A31-13 notes, go `rat-court` insert | Mis-ordered against the chase. | Now after `a31-13-game#5`. | done |
| atlas-a31.ts | A31-11 to A31-16 notes | On the stay branch, the goal and hint still described the go branch. | A STAY JOURNAL goal and hint added for each of the 12 replaced steps. | done |
| atlas-a31.ts | `a31-margin-hazel` | An “H.” line that S24's A31 text doesn't have. | Removed; the Nubbin looks at the note instead. | done |
| atlas-a31.ts | variants header, `a31-grove-byte` | The trigger depended on the wardrobe and could leave the keepsake unreachable. | Now the first dusk after `atlasDone('A31')` with Byte in the Grove, if `s3Done`. | done |
| script-a31.md | SIM needs, Counts | “only the scenes differ” is no longer true. | Corrected; lines 658. | done |

## 4. Nice to have (not applied)

- **A22:**
  - The days from A22-5 to A22-9 are loose; a “Days go by…” line in A22-7 would settle them.
  - Show only the chosen job's hint in A22-9 and A22-15.
  - In `a22-14-river`, #2 and #3 both open with “Mirabel”.
  - The “a chair she had owned” simile.
- **A23:**
  - The label “Sit down next to him and wait.” appears three times, which nearly quotes the third rule; vary one or two.
  - Unused `speakers` in A23-16.
  - “dumpling” has no set-up on the Rafiki path.
  - `a23-15-show#6` assumes the `bait` choice.
  - A few short exclamations still echo the film (“She's gonna eat me!”, “Your son? … Did you know?”, “Can we keep him?”). Add them to the quote pass.
  - The checker's Dusty match could be case-sensitive (a tests file, out of scope).
- **A24:**
  - “He found both” slightly spoils A24-18.
  - Bridge Messua's town and her hut.
  - `A16_LEAVE` is used once.
  - The moulting-feathers joke.
  - “bites” could be “marks” (`a24-08-gate#2`).
  - Nova's card could add “(now Mumbai)”.
  - Mowgli stretches while holding the fire-pot.
  - Soften “went down with the water”.
- **A25:**
  - `a25-19-change` reads slightly against the outline.
  - Comma splice at `a25-05-swamp#3`.
  - The Notebook Page reward names Bastian.
  - “toward” in the notes.
  - The scansion of `a25-10-rhyme#2`.
- **A26:**
  - A pre-chapter-4 wording for `a26-grove-brick`.
  - A Moss beat in the keepsake.
  - “Enkidu says” at `a26-14-sickbed#6`.
  - The ramparts order at `a26-18-wall#7`.
  - Moss joining mid-page has no introduction.
- **A27:**
  - Loosen the Simurgh's A27-8 modernisations further.
  - “More knives on the cloth” reads European.
  - “a door shutting on the right side”.
- **A28:**
  - “soft pencil” vs “faint pencil”.
  - The `proud` reply in `a28-07-mother`.
- **A29:**
  - A Nubbin hum beat in the margin note.
  - The coat order in `a29-14-song#0`.
  - The away path has the leaf “from the wall”.
  - The goal text nearly names the third rule (it is the outline's wording).
  - Jinu's “lute”, for the advisers.
- **A30:**
  - Mark LIFT_SHEM as a fragment.
  - Name Cinder's ember in the cinder keepsake.
  - The viewpoint of `a30-12-stars#5–6`.
- **A31:**
  - A Nubbin–rabbit beat.
  - The half tortilla after “share”.
  - The rat's ride is never undone on the stay path.

## 5. Best moments to protect

- **A22:**
  - `a22-14-pedro` and `-done-kept`: Abuela's whole apology, and her taking your cold hands without a word.
  - `a22-01-story`: “He did not come.”
  - `a22-03-complete` answered by `a22-16-photo*`.
- **A23:**
  - `a23-08-zazu`: “The quiet is worse.”
  - `a23-14-clouds#5`: “You have been sad for a long time, and you have called it peace.”
  - `a23-14-find`: “I am not following you. I am sitting next to you.”
- **A24:**
  - `a24-07-tears`: the third rule acted, not quoted.
  - `a24-14-akela`, and the Nubbin's first real howl.
  - `a24-12-tale`: “It's old. That's a different thing from true…”
- **A25:**
  - `a25-05-reeds`.
  - `a25-13-reading` (your sneeze, read back).
  - `a25-20-complete-notebook`: “Huh. That was me.”
- **A26:**
  - `a26-14-death` and `-done-moss`: “as gently as a door being closed”, and Moss silent all night.
  - `a26-18-complete-moss-spoke`.
- **A27:**
  - `a27-02-order#3`: the narrator overrules Sam.
  - `a27-17-fire-sat`: “Sit with me now.”
  - `a27-07-foot`.
- **A28:**
  - `a28-06-wait` (sat) and its payoffs.
  - `a28-11-step`: one slavery sentence, said “the way you would say where a cousin lives”.
  - `a28-12-last-wisp`.
- **A29:**
  - `a29-13-sit` and `-complete`.
  - `a29-10-complete`: “like nobody has handed him anything in four hundred years”.
  - `a29-16-complete-away`.
- **A30:**
  - `a30-07-flood`: “very sincere”.
  - `a30-13-order-sit` and `a30-13-tile`.
  - `a30-12-steps-done`: “I hoped so.”
- **A31:**
  - `a31-13-bats-stay`.
  - `a31-16-complete-stay`: “Nobody gives you anything for sitting up.”
  - `a31-05-complete`: “You get the good stool.”

## For Maor

- **Licences:**
  - Disney: A22 Encanto and A23 The Lion King.
  - The Ende estate and Thienemann: A25, including AURYN and the cover.
  - Sony Pictures Animation and Netflix: A29.
- **Quote verification:**
  - A22's two lines: against the licensed film.
  - A23's three Mufasa lines, and the ~20 from-memory rewordings: against the licensed film.
  - A25's two German lines, the messenger names Blubb, Ückück and Gluckuk, and Atreyu's bow: against the 1979 text.
  - A26's eight Thompson passages: against the printed edition. Also a legal check on Thompson's copyright in long-term countries.
  - A24: a final edition check of the two *Second Jungle Book* lifts.
  - A28: Rattray against the scanned pages.
  - A30: the UK status of the 1904 Jewish Encyclopedia and the 1917 JPS Psalms.
  - A31: whether the margin should bracket the three adapted names.
  - A27: the outline's MIT source link is dead. Update the source line?
- **Adviser sign-off:**
  - A22: Colombian advisers (a historian, Afro-Colombian and Zenú advisers, a reader from a displaced family, a Spanish reader).
  - A23: East African Swahili advisers.
  - A24: Indian advisers and an Unangax̂ adviser. Also decide whether `a24-17-beach#1` should name the forced relocation more plainly, and approve Nova's Kipling card.
  - A25: the Greenskins.
  - A26: Iraqi and Assyriology advisers.
  - A27: Iranian and Afghan advisers, and an albinism organisation.
  - A28: Akan advisers and Jamaican writers.
  - A29: Korean advisers and a minhwa artist.
  - A30: Jewish advisers (the Name mention, the libel nod at `a30-03-rumour#3`, Sabbath and Kiddush details).
  - A31: K'iche' advisers (`WHICH_SUN`, names, copal, “We are made of corn”, “Blessings are often a bit ew”).
- **Judgement calls:**
  - A26: a `teen` rating if the fights should be played straight, and line 3's wording.
  - A25: whether Part Two stays `all`.
  - A23: “dumpling”.
  - A29: Gwi-Ma's five lines, and the gat on Derpy and Sussie (the outline contradicts itself, “a tiger in a hat” included).
  - A28: the glove stays with Ananse, not under the step, although the outline's Tier 2 line has it there.
  - Moss on the keep route (cross-page; A21 and A26 follow the same rule). `mossFaded` with `keptStone` would put a brick “by Moss's flower” when he has none (canon 15), and an unfaded keep-route Moss shouldn't come down. Suggested rule: the flower keepsake on `mossFaded && !keptStone` or moss-sleeps, and no Moss visits on the keep route.
  - Campaign `end-epi-wisp-sable` puts Wisp in the long grass, against canon 16. That is not this batch's file.

## Checks (rerun after all fixes)

- `npx tsc --noEmit -p .`: exit 0, no errors.
- `npx eslint src/content tests/tools`: exit 0, no errors.
- `npx tsx tests/tools/content-check.ts --warnings`: `problems: 0`. One warning remains, `timer? a06-08-complete`. It is in the A1–A10 batch, not this one. The `a23-06-bones` pronoun warning is cleared.
- Line endings: 0 CR bytes in all ten atlas files and all ten logs.
