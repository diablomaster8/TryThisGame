# Review: wave-L (Atlas A1–A10), fix mode

Date: 2026-10-16. Files: `src/content/atlas-a01.ts` … `atlas-a10.ts`; logs `docs/logs/script-a01.md` … `script-a10.md`.
Method: a lead mechanical scan across all ten pages (Grove flag writes, line length, sentences per narration line,
em dashes, US spellings, timer words, Grove names, speakers, variants), then one full read-through per page
against `docs/canon.md`, the story bible, STYLE.md, the outline section in `docs/atlas.md` and the page's log.
A1 and A2 were read twice by two reviewers who overlapped in time. Their edits were merged with no conflicts,
and the rows below are deduplicated.

## 1. Verdict

All ten pages are canon-safe. None writes a Grove flag, and only A3 and A6 read Grove state (`s24Done`, read-only).
No Nubbin speaks anywhere. Audience tags match canon 20: A1, A3 and A4 are `teen`, and the other seven are `all`.
Every signature choice pays off at least three quests later, and every variant exists and replaces a real scene id.
Each page now also states what plays when its flag is unset. The quality is high: these are warm, specific
retellings in which the Keeper stays a guest.

The problems were mostly:
- internal continuity slips (counts, ages, who holds which photo or shell);
- a few lines too close to famous source lines;
- two Hazel margin notes that contradicted S24;
- one timer line;
- ten A10 quests with no choice.

All 30 must-fix and 98 should-fix items are applied. The 44 nice-to-haves are listed and not applied. Ship still
depends on the licences and adviser sign-offs under "For Maor".

## 2. Must fix (30, all done)

| File | Where | Problem | Exact fix | Status |
| --- | --- | --- | --- | --- |
| A1 | a01-19-punch | Father sneers "A boy with one arm" just after Ed gets his arm back | "A boy with a borrowed arm and a brother in a heap." | Done |
| A1 | header | "Hazel is not mentioned on this page" contradicts S24's margin note on A1-20 | Header names S24's note as engine data (shown once `s24Done` is set); the page has no variant by design | Done |
| A1 | header LIFTED TEXT, log | Said "none", but "One is all, and all is one" (a01-10-shore, a01-10-fire) is the source's motto, verbatim | Counted as 1 of the 3 allowed quotes in the header; log corrected | Done |
| A1 | a01-16-gate, -gate-burnt | Marcoh's notes held "the ring of pins on the map", which was on Hughes's map | "the recipe and what it needs" | Done |
| A1 | a01-16-complete-burnt | Ed says nobody can make a Stone "from what's in that stove" right after rewriting the notes | "I'd burn them again. When this is over, I'll burn the new ones too." | Done |
| A2 | a02-11-tree | Fruit count doesn't add up (three, one sinks, "the other three") | One falls and sinks, then "knocks down three more and catches them in his robe" | Done |
| A2 | a02-19-home + notes | The pines turn west; the novel has them point east for the return | "…all turned to point east the morning he came home." | Done |
| A2 | `ATLAS_A02_CHECKS` | `explore:a02-mountain:summit` used but not listed | Added (59 checks, matches the log) | Done |
| A2 | a02-10-complete, a02-11-tree-done | "five of you" after Pigsy and Sandy join | "six of you, and the horse" | Done |
| A2 | header, variants doc | No fallback when `a02-believed` is unset | Any value but `monk` (including unset) plays the base scene | Done |
| A3 | a03-09-witness, a03-13-gate | Su-hong "was eleven", but he is twenty-two now and the push was fifteen years ago | "seven" in both places | Done |
| A3 | a03-06-why (`gangrim`) | "five hells" left after five courts; only two remain | "twenty-eight days and two hells left, and the hardest is last." | Done |
| A4 | a4-15-fire, a4-16-courtyard | Devasena, rescued in A4-5, is in chains again in A4-16 with no recapture | A4-15 reports (never shows) that the king's riders took her back at the forest edge; A4-16 says "in new chains"; notes updated | Done |
| A4 | a4-08-hill, a4-09-naming | Sivagami crowns Amarendra though Bhallaladeva met her stated test, then says she never takes her word back | Promise is now "whichever of my sons wins this war best… I will judge what best is"; A4-9 reasons from it | Done |
| A4 | a4-07-throne | Calls Sivagami "the king's widow" next to "Bijjaladeva, her husband"; Amarendra "my sister's son" | "the court gave it to that brother's wife, Sivagami"; "the dead king's son, whose mother died the day he was born" | Done |
| A4 | a4-11 | Devasena never learns the "simple man" is Amarendra, yet arrives having chosen him | Soldiers kneel to him on the road and he names himself; Devasena: "You should have said. I'll come, simple man…" | Done |
| A5 | a05-12-list (`sogolon`) | "She told you to say that first", but Sundiata told you (a05-06-complete) | "Djata told you to say that first, didn't he? I can hear him in it." | Done |
| A5 | a05-12-list#1 | You "give back" the nine old women, but Balla saw that himself | "the west gate in the dark" | Done |
| A5 | A5-10 notes, market | Messengers "the week after", against a05-09-complete's next morning | "the morning after, before the burial"; market line rewritten to match | Done |
| A5 | header | No mention of S24's margin note | Header and A5-4 notes name it as engine data beside A5-4; seven years agrees | Done |
| A6 | a06-08-complete | Timer: "Come back tomorrow for some more." (checker warning) | "…It was only half the truth. Come back for the other half." | Done |
| A6 | a06-01-complete | "Come back each evening… one voyage a night" reads as a real-world nightly wait | "Seven voyages won't fit in one supper. I'll tell them one at a time…" | Done |
| A6 | a06-07-complete | "Tomorrow is the fourth" | "The fourth is next, and it isn't a funny one." | Done |
| A6 | a06-11-complete | "…Tomorrow." | "…But that's a story of its own." | Done |
| A6 | a06-15-complete | "Come tomorrow… Tomorrow you'll hear mine." | "Then give me one more evening. Next time, you'll hear mine." | Done |
| A7 | a7-06 → a7-11 | Photo continuity: Héctor never gives Miguel his photo; Ernesto takes "the old photo" on one branch only; A7-11 loses the photo that A7-12 then mends | Héctor gives his photo in a7-06-alley-done; Ernesto takes it on every route (a7-09-toast); A7-10 shows the old family photo; A7-11 loses Héctor's photo | Done |
| A7 | a7-05-queue | Speaker label "Héctor" spoils his name a quest early | New speaker `a7-painter` "The Painter" (basedOn Héctor in disguise) | Done |
| A9 | a09-04-step, -complete | Everyone goes down the mountain in the dark, yet A9-5 opens "in the morning, on the way down" | You start down at dusk and sleep under an overhang halfway | Done |
| A9 | a09-11-door | Harmonica and shell are both in your pocket, which breaks the "bring one thing" rule | "One thing each, and only what you love fits"; pockets emptied on the rock; three things to choose from | Done |
| A10 | a10-14-complete (gift/default) | Shell stays with Te Fiti, then is "lashed to the prow" | "A small white spiral shell is painted on the canoe's prow…"; SIM notes say painted | Done |

## 3. Should fix (98, all done)

| File | Where | Problem | Exact fix | Status |
| --- | --- | --- | --- | --- |
| A1 | a01-03-rose | Close paraphrase of Ed's famous "you've got legs" line | "You get up off that step by yourself, or you sit on it for ever. Your call. Not his, not mine." | Done |
| A1 | a01-20-gate | "Well answered… Take him home" echoes the source's "right answer" | "…Ha. Nobody has ever paid me in that coin before. Go on. He's been waiting." | Done |
| A1 | a01-13-gun | Garbled accusation | "The two doctors in Ishval. The Rockbells. That was you, wasn't it? Say it." | Done |
| A1 | a01-12-complete | Ling called an alchemist | "Two of us from Xing in one city, after the same prize." | Done |
| A1 | a01-20-complete (spoke) | "I heard you before I heard her" takes Hawkeye's moment | "…right after she said hers." | Done |
| A1 | a01-17-find | Muddled Envy/Gracia tense and wording | "…it wore Gracia's face at the phone box, the night Hughes died." | Done |
| A1 | a01-09-storm-done | Birth confused with the Stone | "No circle, no chalk, no price… and you did it in a kitchen." | Done |
| A1 | a01-09-dominic | Body joke about Satella | "She is very pregnant and entirely unbothered by it." | Done |
| A1 | a01-12-ling | Dangling clause | Recast: "You're back in Rush Valley to see Winry, and…" | Done |
| A1 | a01-11-taken | "carry him off" twice | First is "haul him onto a cart" | Done |
| A1 | a01-14-circle-done | "pipes… throne of pipes" | "sits on a high seat" | Done |
| A1 | a01-16-tunnels | "as it has been" contradicts itself | "the way it always has" | Done |
| A1 | A1-20 notes | "Winry at the station" isn't in the scene | "Ed and Winry shaking on it" | Done |
| A1 | a01-15-general | Assumes the Nubbin is blue | "something small I have no word for" | Done |
| A1 | a01-11-nest hint | Nubbin is captive, yet the hint has it walk in | "Through the cellar door, following the squeaking…" | Done |
| A1 | header | No rule for an unset flag | Base scene plays; a variant only plays on an exact value | Done |
| A2 | a02-12-bones | The heap of bones and the cold breath read grim for `all` | "folds up like an empty coat… a small heap of white bones, chalky as old shells" | Done |
| A2 | a02-12-girl | "She was a child!" casts the demon's disguise as a dead child | "She was only a girl with a basket!" | Done |
| A2 | header care notes | "Chalk dust" contradicts the script | Matches the script now | Done |
| A2 | a02-01-complete | Pencil monkey could read as Hazel's note | "Now a tiny ink monkey sits beside it, eating it." | Done |
| A2 | a02-01-page | "smells of peaches" twice | "standing on warm rock, high above the clouds" | Done |
| A2 | a02-10-complete | The outline's "fifth disciple" never appeared on screen | Monk: "…and you. My fifth disciple. I think I have the count right at last." | Done |
| A2 | a02-18-boat | Odd quote marks around "trust" | "You've walked fourteen years on trust, master. Try one more step." | Done |
| A2 | a02-08-fire | "fire-proof" | "fireproof" | Done |
| A2 | a02-15-twins | Self-contradicting account of where the real Monkey was | "At Guanyin's island Sandy finds the real Monkey, who has been sulking there all along…" | Done |
| A2 | a02-19-turtle | Turtle never met (chapter 49 skipped) | Line added: "The page skipped that crossing years ago… The turtle has not skipped anything." | Done |
| A2 | a02-08-s3 hint | "the pills", but there is only one | "You're carrying the pill on a dish." | Done |
| A2 | a02-04-stables | "Book of Death" grim and unusual | "Book of Life and Death" | Done |
| A2 | TEACHER speaker | "Subodhi" ≠ basedOn "Subhuti" | "Master Subhuti" | Done |
| A2 | a02-09-backhouse | "made havoc" | "caused all that havoc" | Done |
| A2 | a02-05-mountain | "holds onto" | "holds on to" | Done |
| A3 | a03-margin-hazel | Played after A3-14, with text that contradicts S24 | S24's text verbatim; re-anchored to play once after a03-12-complete when `s24Done` is set (or at next page open); header, notes and log updated | Done |
| A3 | a03-11-note | Didn't say what "Not now" does | Note replays until "Go on" is picked; only then may it be skipped | Done |
| A3 | a03-10-sit | Narration of three sentences | Merged into two | Done |
| A3 | a03-12-dream | The mother's line repeats itself | "They said you ran, and I never believed it, not for a day." | Done |
| A3 | a03-13-verdict | Mis-indented line | Re-indented | Done |
| A4 | a4-02-pool | S24 says "forty times", but the script says "every day" | "That's forty times he's come off it, by my count, and he goes straight back up every time." | Done |
| A4 | header | "Grove state read: none", with no S24 note | Names S24's margin note beside A4-2 as engine data | Done |
| A4 | a4-13-night-done | "Look after your mother" is ambiguous and close to the film's last words | "His last words were for his mother, not himself…"; the `forgave` variant matches | Done |
| A4 | a4-06-chase-done | Helmet on a shaved head; clumsy "firelight of a torch" | "A blade cuts the cloth from round the boy's head. His face is in the light of a torch." | Done |
| A4 | a4-12-trial | "Commander of the guard" clashes with other ranks | "captain of the palace guard" | Done |
| A4 | a4-13-plot | "swords were for a bridge" contradicts A4-12 | "his men were carrying rope, for a bridge" | Done |
| A4 | a4-04-gate-done | Wrong subject for the twenty-five years | "…she's been in here" | Done |
| A4 | a4-11-gifts | "unopened gold and all" | "with every chest of gold still shut" | Done |
| A4 | A4-1 notes | Time skip said "twenty" | "twenty-five years" | Done |
| A4 | log | Line count and changes out of date | 526 lines; recapture and road reveal recorded | Done |
| A5 | a05-03-complete#3–4 | Close paraphrases of Pickett ("Cheer up, Mother", the heaviest rod) | "Then dry your eyes, Mother. Today I stand up." / "Ask the smiths for a rod of iron, so heavy it takes all of them to carry it." | Done |
| A5 | a05-03-house + notes | Ages don't add up | "A wedding, a birth and seven rainy seasons pass in a breath."; Balla in his early twenties | Done |
| A5 | a05-10-complete | Kolonkan cites "Niane's griot" | "Plenty of griots tell it that way." | Done |
| A5 | a05-13-fakoli#3 | "because he wanted her" is suggestive for `all` | "Because he took my wife Keleya out of my house and into his." | Done |
| A5 | a05-13-fakoli#5 | "Some in Sosso still call…" just after the event | "In Sosso they'll call Fakoli a traitor. In Manding they'll call him a hero." | Done |
| A5 | `a05-remember` | Payoff vague | Notes state the Grove phrase; balafon description says unlimited and states the payoff | Done |
| A5 | variants doc | No unset default | Hunters' scenes play when unset | Done |
| A5 | care notes | Nothing on Islam or traditional belief | BELIEF note: shown with respect, never ranked, advisers to judge | Done |
| A5 | a05-07-djedeba | "into his pocket" | "into his sleeve" | Done |
| A6 | a06-margin-hazel | Text contradicts S24 | S24's text verbatim, single "H.", whale doodle kept | Done |
| A6 | a06-16-tell | "The gate latch clicks" breaks the Open/letThemGo state (no gate) | "Behind you there are footsteps on the grass. Nova sits down at the back of the ring without a word." | Done |
| A6 | a06-11-dark (`grove`) | Same gate problem | "…the pond, the fruit trees, and the cottage step warm in the sun." | Done |
| A6 | a06-15-complete | Location jump from the street to the chest | Opens "Later, back in the long room, the old man opens a chest." | Done |
| A6 | a06-16-complete (Nova) | Translation order reversed | "Persian and Arabic, then French, then English…" | Done |
| A6 | a06-15-quay-kept | "borrowed" twice | "…carries him for nothing, with only a staff and a borrowed cloak." | Done |
| A6 | header | No unset default | Base scene plays if `a06-stone` or `a06-ivory` is unset | Done |
| A7 | a7-05-run, a7-07-row | Em-dash cut-offs | Both end in "…"; 0 em dashes left in the file | Done |
| A7 | a7-12 | Miguel only plays guitar, but the outline and S24 have him sing; the lullaby paraphrased the film song's meaning | Miguel sings "a song for a bedside", guitar soft underneath; goal and done scene match | Done |
| A7 | header | No S24 note | Names S24's note beside A7-12 as engine data | Done |
| A7 | variants doc | No unset default | Plays ribbon / free; all 6 name × plea combinations covered | Done |
| A7 | a7-11-s3 hint | "on the bridge", but the scene is on a ledge | "on the ledge" | Done |
| A8 | a08-05-isle | Em-dash cut-off | "little cakes with…"; 0 em dashes left | Done |
| A8 | header | No S24 note | Names S24's note beside A8-9 as engine data | Done |
| A8 | a08-potion-cauldron | Doesn't say it's unlimited | "…never runs dry. Before any race, a Nubbin may sip once, for one great sprint in that race." | Done |
| A8 | a08-09-form-done | A wax page "folded into a scroll" | Pupus finds papyrus; you copy the form out fair | Done |
| A8 | a08-14-tie + hint | "your tablet's pocket" | "your satchel" | Done |
| A8 | A8-9 notes | Says "filed", but the porter hands every form back | Stamped once and handed back on every path | Done |
| A8 | a08-14-square (`let`) | Rope contradiction between branches | "The village quietly starts looking round for something to tie him up with." | Done |
| A8 | a08-13-arena | Iris missing from the champions in the stands | "…a floury Mannekenpix, and Iris, a person again." | Done |
| A8 | a08-14-bard-loop | "attached a copy of it to it" | "Every clerk in the building has dutifully attached a completed copy." | Done |
| A8 | a08-14-bard-boar | Two lines in a row start "Every clerk" | "The notes run on for pages, each asking politely after the boar." | Done |
| A9 | a09-08-shore-done | "One day is all you have" doesn't match the dates | "Three days is more than you have. Nobody needs to say it." | Done |
| A9 | a09-10-road | "It's only the evening" said in the morning | "It doesn't come till the evening. We can be home long before that." | Done |
| A9 | a09-10-tornado | Ambiguous whose dress | "The other Hemulen…" | Done |
| A9 | a09-08-stilts | "Quite a long way off the ground" on very short stilts | "a little higher off the ground than it is used to" | Done |
| A9 | header | No S24 note, no unset default | Both added | Done |
| A9 | log | Line count | 455 | Done |
| A10 | A10-2 a10-02-coconuts | No choice in the quest (STYLE) | "Offer to dig the first hole for the new grove." / "Ask how long the trees have been sick." | Done |
| A10 | A10-4 a10-04-canoes | No choice | "Brush the dust off the nearest prow." / "Hold the torch high so Moana can see." | Done |
| A10 | A10-5 a10-05-pack | No choice | "Hold the canoe steady while she loads." / "Tell her what Sina said about water." | Done |
| A10 | A10-6 a10-06-maui | No choice | "Thank him for the long days." / "Keep your Nubbin behind your legs." | Done |
| A10 | A10-7 a10-07-fog | No choice | "Let your Nubbin wave at them." / "Scoop your Nubbin up and hold it close." | Done |
| A10 | A10-8 a10-08-swell | No choice | "Feel for the second swell yourself." / "Let your Nubbin try." | Done |
| A10 | A10-10 a10-10-story | No choice | "Pass him the water gourd." / "Say nothing. Sit a little closer." | Done |
| A10 | A10-11 a10-11-gap | No choice | "Grab the sail line." / "Grab Heihei, who has wandered out again." | Done |
| A10 | A10-12 a10-12-light | No choice | "Go to the bow and give them room." / "Bring your Nubbin to say hello." | Done |
| A10 | A10-14 a10-14-farewell | No choice | "Let your Nubbin say goodbye its own way." / "Tell him you'll watch for hawks." | Done |
| A10 | a10-05-council-done | Reads as if Tala herself ran in | "Then a boy runs in from outside, breathless, with news: Gramma Tala has fallen…" | Done |
| A10 | a10-06-maui | Moana's demand has the film's shape (name, then an order) | "My island is dying because of what you took. I'm Moana, and you're coming with me to put it back." | Done |
| A10 | a10-12-song | Lineage list echoes the film's song-speech | "Everything I was taught, I've still got. Gramma's stories. Dad's care for people. Maui's swells. None of it came off." | Done |
| A10 | header | No S24 note, no unset defaults | Both added, plus a CHOICES paragraph | Done |
| A10 | log | Counts out of date | 527 lines; 29 options at 14 choice points | Done |

The lead scan flags two narration lines as having more than two sentences: `a03-margin-hazel` and
`a06-margin-hazel`. Both are Hazel's handwriting, quoted word for word from S24, so they are left as they are.

## 4. Nice to have (44, not applied)

- **A1:**
  - a01-04-library: Nina names the species ("Is that a Nubbin?").
  - a01-11-complete: Bradley "wipes his sword"; "sheathes" would be gentler.
  - a01-14-complete: "Al is there. Al was taken there too" reads awkwardly.
  - a01-16-complete: "the whole of the dark still ahead of you" is vague.
  - a01-01-page: "The smaller one is holding the chalk", though young Al was Ed's size.
  - a01-17-find: backstory in the past tense.
- **A2:**
  - Speaker lists name characters who are silent in that quest (Guanyin A2-6; Sandy A2-11/12/18/19; Pigsy A2-13/14/19).
  - a02-06-seal: "Cousin, you're still here" just as you arrive.
  - a02-13-gourd: "What did I literally just say?" is modern.
  - Prettier wrapping.
  - The A2-5 notes could mention S24's note.
  - a02-15-complete: "the right one… all along" while it holds both tails.
- **A3:**
  - a03-13-verdict-lies: "calls his own lies lies" reads awkwardly.
  - a03-11-plea-lies attributes words the witness never said.
  - a03-11-hall-done: the head-count leaves out Su-hong.
  - Prettier wrapping.
- **A4:**
  - Sanga is labelled by name before she is introduced.
  - DEVASENA is listed in A4-15 without speaking.
  - a4-04-gate: one woman's line is given to "The Crowd".
  - The coat prop echo between A4-1 and A4-16.
- **A5:**
  - a05-05-given-done: 'sad' should be 'think'.
  - a05-08-complete: a narrator line carries a mood.
  - a05-04-baobab#4 follows Niane's beat closely.
  - The log is one line off in its count.
- **A6:**
  - a06-08-dark#3: "which is how you know" is oblique.
  - `a06-ivory` pays off 1–2 quests later (`a06-stone` carries the 3+ rule).
  - The log's line count needs a recount (591?).
  - The margin note's sentence count (verbatim S24 text).
- **A7:**
  - a7-06-alley: line 1 could use PAINTER.
  - Imelda's "I never forgave you" (`both` plea).
  - The a7-09 notes could say Ernesto pockets the photo on every route.
  - a7-10-glow: Pepita as "a winged jaguar".
- **A8:**
  - Verses being "saved for an occasion" never pays off.
  - Mannekenpix's "hungry again by the river" timing.
  - Rule 312 means two things.
  - Silent speakers listed in A8-13.
  - The log's counts weren't re-verified.
- **A9:**
  - a09-04-step-done: "the first thing he has ever given anybody".
  - a09-03-sky: question mark.
  - The garnet branch of a09-11-door could say where the Nubbin goes.
  - Long notes string (Prettier).
- **A10:**
  - a10-06-maui: "Most people like to say thank you" sits near the film song's spirit.
  - a10-14-complete: share the repeated opening lines in a constant.
  - a10-11-gap: "burns your palms" could be softer.

## 5. Best moments to protect

- **A1:**
  - a01-19-complete: "Ed puts his new hand flat on the cold steel. He doesn't cry: he's doing sums."
  - a01-04-step-done: "You don't ask, and nobody tells you, and that is the telling."
- **A2:**
  - a02-13-gourd: the silent Nubbin can't answer to its name, and that is how you win.
  - a02-16-real: "My boy would have wanted the fire. I think I want the rain."
- **A3:**
  - a03-05-letters: "He worked it out the first week." / "He kept it up anyway."
  - a03-12-house: the biscuit tin of money-order envelopes.
- **A4:**
  - a4-01-shallows: "The river closes over it, gently, as if it had been asked to."
  - a4-16-pyre: "It is a woman putting something down."
- **A5:**
  - a05-07-road: "We go at my mother's pace… the one where we all arrive."
  - a05-14-assembly: "Even the ones who crawl."
- **A6:**
  - a06-08-tunnel: "You sit beside him, and wait." (the third rule, acted, never named)
  - a06-16-telling: "paid for, the same as me. Only in different coins."
- **A7:**
  - a7-02-guitar: "a sound like a word nobody meant to say".
  - a7-06-name: "It looks like somebody."
- **A8:**
  - a08-07-feast: "Thirty years I have been waiting for someone to ask me that."
  - a08-08-complete: "You go in, and you come out kind."
- **A9:**
  - a09-04-step: "he tucks the words away somewhere, like a button", paid off in a09-11-dark-home.
  - a09-12-night: "How very unphilosophical of it."
- **A10:**
  - a10-03-step-done: "A step's like a name… it doesn't come off."
  - a10-14-farewell: "You were the least use of anybody, and I'll miss you most."

## For Maor

- **Licences.** These pages need licences before ship:
  - A1 (Fullmetal Alchemist)
  - A3 (Along with the Gods; the rights holders were written from memory, please confirm)
  - A4 (Baahubali)
  - A7 (Disney/Pixar)
  - A8 (Les Éditions Albert René)
  - A9 (Moomin Characters Oy)
  - A10 (Disney)

  A5 follows Niane's plot, which is in copyright; no text is used from it.
- **Quotes.**
  - A1: confirm "One is all, and all is one" as the page's one allowed quote, or ask for a paraphrase.
  - Check paraphrased beats close to famous lines against the sources:
    - A1: Mustang's rain line, Ed at the Gate, Ed to Rose, the A20 handshake.
    - A9: Snufkin's "I look at it. Then I leave it where it is…"
    - A10: Moana's A10-12 declaration and her words to Te Kā.
- **Advisers.**
  - A2: Buddhist and Daoist titles, the Buddha's blank scrolls, "A buddha in a headband looks silly", Guanyin.
  - A3: Korean afterlife and folk religion, which king rules which hell, eomma/hyung/jeoseung; check the support-line numbers.
  - A4: Telugu and Tamil names, "Amma", the foot-on-head gesture, "sworn" versus "slave", and Bijjaladeva's withered arm (disability on a villain).
  - A5: Mande, ideally a jeli. Spellings, music, dress, whether Islam is acknowledged; verify the Kouyaté, Sosso-Bala, UNESCO and Manden Charter claims.
  - A6: Arab and Persian heritage (Caliph, greetings, call to prayer, Persian frame); Sri Lankan and faith advisers for A6-12.
  - A7: Mexican consultants.
  - A10: Pacific Islander advisers, including the new "thank him for the long days" choice.
- **Audience calls.**
  - A1: Hawkeye's gun at Mustang's head, Martel, Envy as Gracia. All judged `teen`; please confirm.
  - A3: the mother's "I saw his face". Judged `teen`; please confirm.
  - A2: the monk's "a girl, her mother, her father" accusation for `all` and the Learning Grove.
  - A6: voyage 4 and the slavery line for the Learning Grove.
  - A7: Ernesto's "I'll do it to you" for the Learning Grove.
  - A8: "naked as the day we were born" for `all`.
- **Source accuracy.**
  - A4: Kumara Varma survives here (a liberty).
  - A8: the name "Caius Pupus".
  - A9: the octopus rescue, the anklet, both Hemulens as "he".
  - A1: the invented bridge beats.
- **Titles.** A7's quest title "Remember" sits close to the film song "Remember Me".

## Checks (rerun after all fixes)

- `npx tsc --noEmit -p .`: exit 0, no errors.
- `npx eslint src/content tests/tools`: 0 errors.
- `npx tsx tests/tools/content-check.ts --warnings`: `problems: 0`, `warnings: 0`, `long: 0`.
- CR count: 0 in all ten atlas files and all ten logs.
