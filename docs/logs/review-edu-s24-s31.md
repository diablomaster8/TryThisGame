# Review: edu-s24-s31 (Learning Grove S24–S31, sprout and reader), fix mode

Date: 2026-10-17. Brief: `docs/briefs/review.md`. Files: `src/content/edu-s24-sprout.ts` …
`edu-s31-reader.ts` (16 files). Each pair was reviewed against `docs/canon.md`, `STORY-BIBLE.md`,
`STYLE.md`, `EDU-STYLE.md`, its original (`side-stories-s24.ts` … `s31.ts`), its outline section
in `docs/more-stories.md`, `docs/logs/script-sNN.md` and the writer's notes `docs/logs/edu-sNN.md`.
A mechanical lint (line caps, scene lengths, `after` ranges, standard codes, ids) ran first; one
reviewer per storyline then read both bands against the original and applied the fixes.

Several writer files weren't Prettier-formatted. They are now, so the diff is much larger than the
content changes.

## 1. Verdict

This is a strong, faithful batch. Every original scene and variant has a version in both bands, all
choice ids and `set`s match, and every signature choice still pays off. `boughtBack` (S27) and
`hushGarden` (S26) are intact. No Nubbin or animal speaks outside the canon exceptions; Parcel and
Spindle stay silent. No line from the originals survives in either band.

The real problems were these:
- Two maths lessons in a row, on some play path in six of the eight storylines.
- A handful of wrong facts: dawn, why a trowel sinks, frost, layers, the otter "dad", and a
  fencepost sum.
- One lifted modern quote: "Grief is love with nowhere to go" (S27 reader).
- Sprout S28 lacked the canon illness wording.
- The known S28 pronoun warnings.
- A few continuity slips, where lines contradicted their own route.

All of these are fixed. After the fixes, the three checks end at 0 problems.

Counts: **27 must fix (27 done), 69 should fix (69 done)**.

## 2. Must fix

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-s24-sprout | `s24-tea-moss`, `-tea-moss-stayed` → `s24-tea-done` | Two maths lessons in a row. | tea-moss lesson → rhyme (literacy, RF.K.2, "What rhymes with hat?"); tea-moss-stayed lesson → what flowers need (science, K-LS1-1). | done |
| edu-s24-sprout | `s24-badges` → `s24-eternal-watch` | Two maths lessons in a row. | eternal-watch lesson → sel (ELOF Social and Emotional): goodbyes aren't for ever, "Yes, when we get home". | done |
| edu-s24-sprout | `s24-lights*` → `s24-shelf-moss` | Two maths lessons in a row. | shelf-moss re-tagged science (ELOF: Scientific Reasoning, "far-away things look small"). | done |
| edu-s24-sprout | VALLEY_CLIMBS (`s24-lights-told`, `-told-kept`) | "lights climb the far hill" puts the valley on the Shelf; "wave back" isn't in the original. | "Then more lights climb Gran Hazel's hill: lanterns! Lots of them!" / "Everyone in the valley walked up her hill to watch." | done |
| edu-s25-sprout | `s25-lamp-l1` → `s25-sill-l1` | Two maths lessons in a row. | lamp lesson → sound words (literacy, RL.1.4), check `edu:say:sound-words:whirr-squeak`; CHECKS updated. | done |
| edu-s25-reader | `s25-byte-l1` → `s25-page-byte-l1` | Two maths lessons in a row. | byte-l1 → the two meanings of "long" (literacy, L.3.4). | done |
| edu-s25-sprout | `s25-page-found` | Clank answers Moss, whom only you can hear. | Added "You tell Clank what Moss said." before Clank's line; lesson `after` moved to 9. | done |
| edu-s26-reader | `end-epi-garden` #5 | "one key, three evenings" is wrong on the lift route. | "It took one key, one ramp, and a lot of patience." | done |
| edu-s27-reader | `s27-leave-it` lesson, best reply | "Grief is love with nowhere to go" is a well-known modern quote. | "Yes. Telling her story together keeps her close, and sad feelings are easier to carry when they're shared." | done |
| edu-s27-sprout | `s27-evening` → `s27-row` | Two maths lessons in a row. | evening-l1 → science (ELOF: Scientific Reasoning): spiders have eight legs. | done |
| edu-s27-sprout | `s27-labels` → `s27-words` | Two maths lessons in a row. | words-l1 → literacy (ELOF: Literacy), short word and long word. | done |
| edu-s27-reader | `s27-midnight` → `s27-home` (sold path) | Two maths lessons in a row. | The fairness notice now plays before the tens question. | done |
| edu-s27-reader | `s27-spindle` #4 | "for years" contradicts the band's own lesson that garden spiders live about a year. | "all summer". | done |
| edu-s28-sprout | `s28-grue-back` #6 | Pronoun warning: "Pixel gives him his watch. He…" | "Mr Grue gets his watch back. He listens to it tick, and stays." | done |
| edu-s28-sprout | `s28-grue-back-weed` #6 | Same. | "Mr Grue gets his watch back. He moves his chair to the front." | done |
| edu-s28-sprout | `s28-grue-back-stare` #4 | Same. | "Mr Grue gets his watch back. He listens to it tick, and says nothing." | done |
| edu-s28-reader | `s28-grue-back-stare` #4 | Same, and it repeated "empty-handed". | "Mr Grue takes his watch back from Pixel. He holds it to his ear, and says nothing at all." | done |
| edu-s28-sprout | `s28-on-the-step` #2–3 | Missing the canon and EDU-STYLE illness wording. | "Gran Hazel is very poorly. The doctors can't make her better." / "She sleeps a lot, and wakes up for the good bits." / "She is still Gran, still funny." | done |
| edu-s29-reader | `s29-island-l1` | "Dawn is when the Sun comes up" is wrong. | "Dawn is the first light, just before the Sun comes up. The Sun rises in the east, so that sky turns pale first." | done |
| edu-s29-reader | `s29-launch-l1` | Says a trowel sinks because it is small. | "A trowel's solid metal, heavy for its size. It can't push aside enough water to hold it up, so down it goes." | done |
| edu-s29-sprout, edu-s29-reader | `picnic`, `missing`, `ford-bell` | "his dad" teaches that otter fathers raise cubs, which is false. | "the old otter" throughout; "he/his kit" kept to match the main script. | done |
| edu-s29-sprout | `s29-missing` #2 | "But not this time" is bleak for ages 3–6. | "He always comes back. But never for this long. And the nights are cold." | done |
| edu-s30-reader | `s30-party-ask-l1`, narration #5 | Fencepost sum: "a flag every 20 cm" on 2 m could be 10 or 11. | "each flag twenty centimetres wide, edge to edge" (exactly 10). | done |
| edu-s30-reader | glossary | relieved, observation, compromise and inference never appear in their scenes. | Dropped "relieved"; worked the other three into five-l1, blanket-l1 and fidget-hill-l2. | done |
| edu-s31-reader | `s31-promise-l1` → `s31-complete-strays-l1` | Two maths lessons in a row. | promise-l1 → science (1-ESS1-1): one year is one trip of the Earth round the Sun. | done |
| edu-s31-reader | `s31-ace-roof-l1` best reply | Quotes "lost behind the lines", which isn't in the reader scene. | "The Nubbin is lost in the dark, and the workshop is the light that guides it in." | done |
| edu-s31-reader | `s31-guising-l1` | "4 treats" is wrong (doors 2 and 3 give two things each). | Counts doors instead: Ivy got treats at 4 doors and Ned a rock at 5; 5 − 4 = 1. | done |

## 3. Should fix

| file | where | problem | exact fix | status |
| --- | --- | --- | --- | --- |
| edu-s24-sprout | `s24-tea-moss`, `-moss-stayed`, `-tea-sable` | 11–12 lines (sprout max 10). | Merged the two tea lines in TEA_CLOSE; dropped TEA_RUN from moss-stayed and sable. All are now 10 lines. | done |
| edu-s24-sprout | TEA_OPEN #0 | "It is spring." gives away the next question's answer. | "Look! The flowers on the hill are open, all at once." | done |
| edu-s24-sprout | `s24-home-l1`, `-home-eternal-l1` | Retelling order is wrong. | "First tea, then the lantern, the cart, the bird… and last, the sunrise." | done |
| edu-s24-sprout | SUNRISE #1, `s24-back-pages` #8 | Three-sentence narration. | Merged into two sentences. | done |
| edu-s24-reader | `s24-crying` #4, `-tea-moss-stayed` #7, `-bun-moss` #2, `-lantern-corvin` #4 | Three-sentence narration. | Merged with "which means" or a semicolon. | done |
| edu-s24-reader | `s24-eternal-watch` #2 and lesson | "In the Grove's stories" breaks the frame, and it gives the wrong reason Eternals are rare. | "Eternals never grow old. It has all the time in the world to wait for you."; lesson reworded. | done |
| edu-s24-reader | goal hint `s24-step1` | "by the newest flower" is wrong on the moss-stayed route. | "by Hazel's flower". | done |
| edu-s25-reader | `s25-storm-l1`, `-storm-nosable-l1` | Thunder and lightning read as two separate events. | "Thunder is the sound a lightning flash makes, so the two start together. You see the flash first because light is far faster than sound." | done |
| edu-s25-sprout | `s25-chill-l1` | The wrong option "Staying up all night" contradicts the step goal. | "Jumping on the bed" / "Not today! Poorly bodies need to lie still. Rest and water help." | done |
| edu-s25-sprout | `s25-byte` #4 | Fern never called the toy Real. | "Fern says you called this toy Real. What does Real mean?" | done |
| edu-s25-sprout | `s25-wild` #2 | Ambiguous "he". | "That one thinks your toy can't hop." | done |
| edu-s25-sprout | `s25-line-l1` | "A stone stays hard and dry inside" isn't reliably true. | "A stone soaks up hardly any. A towel soaks up lots!" | done |
| edu-s26-sprout, edu-s26-reader | `s26-snowdrops-lifted-l1` | The distractor "Linnet" / "The problem is Linnet" breaks the care note. | Distractor is now "The snow"; the replies put the fault on the steps; "the steps, not a person". | done |
| edu-s26-reader | `s26-lift-2-l1` | Winter logic in a late-summer scene. | "keeps its leaves all year, even in winter. That's why the door stayed hidden in every season." | done |
| edu-s26-reader | `s26-earth-pick-l2` | Area given with no unit. | "3 × 2, which gives the area in square metres". | done |
| edu-s26-reader | `s26-beds-l2` | Bulb depth guidance is off. | "two or three times as deep". | done |
| edu-s26-reader | `s26-cheeks` #5 | Made-up statistic ("Half the oak trees…"). | "Plenty of the oaks in this valley started as acorns a squirrel forgot." | done |
| edu-s26-reader | `s26-tobin-finds-l1` | "Linnet wants to live" can be read literally. | "Linnet wants to do things." | done |
| edu-s26-reader | `s26-ramp-2-l1` | "five metres and forty" is awkward. | "five metres forty". | done |
| edu-s26-reader | `s26-earth-ask` #10 | Weak line. | "Choose your patch. Then wake it up." | done |
| edu-s26-sprout | `s26-bench` #4 | Linnet asks who Hush is twice. | "Go on, then. Tell us about her." | done |
| edu-s26-sprout | `s26-linnet` #1 | "A girl in a wheelchair". | "A girl in her wheelchair". | done |
| edu-s26-sprout | `end-moss-sleeps-garden` #5 | "Moss will grow in both places", right after "won't start again". | "So Moss's flowers will grow in both places. He is remembered." | done |
| edu-s26-sprout | `end-epi-garden-l1` | "June is summer" is hemisphere-bound. | "Yes! Here in the Grove, June is summer." | done |
| edu-s27-sprout | `s27-first-word` #4 | "Nine's new name!" is wrong on the sold path. | "It spells a name. Its very own name!" | done |
| edu-s27-sprout | `s27-carry-wisp` #8 | "Thank you, Wisp!" voices Spindle. | "Spindle waves two legs at him. That means thank you." | done |
| edu-s27-sprout | `carry-wisp` lesson reply | Number agreement. | "They're Spindle's eggs. Wisp can look after them for her…" | done |
| edu-s27-reader | `s27-was-it-you` shield then #5 | Contradicts `midnight-shield`. | "You kept Spindle hidden. But a fib has a cost: from now on, Corvin will be watching you." | done |
| edu-s27-reader | `s27-last-evening` #5 | Oblique, right after "say it plainly". | "You're my friend, Spindle. I'm so glad it was you in the window." | done |
| edu-s27-reader | `s27-spring`, `-spring-wisp` #9 | Clunky, three sentences. | "Few friends can write, and fewer writers would stay up all night for you. Spindle did both." | done |
| edu-s27-reader | `first-night-l1` skill | Says "like or as", but the line uses "the way". | "a simile: a comparison that shows how a character moves". | done |
| edu-s27-reader | `evening` #3, `tam` #2, `wait` #3, `was-it-you` #5, `somebodys` #6, `warm` #4, `home-word` #3, MORNING, `walk-home` #1, `empty-web` #3 | Three-sentence narration. | Joined with semicolons or commas. | done |
| edu-s28-reader | `s28-graph` #1 | "a spoon to spare" contradicts 90 spoons for 90 days. | "…to midwinter, near enough." | done |
| edu-s28-reader | `s28-bench-l1`, `-bench-bramble-l1` | "Three coats are warmer than one thick one" isn't reliable. | "Layers keep you warm. Air gets trapped between them, and still air is very slow to let heat escape." | done |
| edu-s28-reader | `s28-wrinkle-l1`, "froze" reply | High-sugar marmalade doesn't freeze hard. | "Freezing would make it stiffer…" | done |
| edu-s28-reader | `s28-kitchen-l1` | "a natural stuff". | "a natural substance" (matches the glossary). | done |
| edu-s28-reader | `s28-one-jar-l1` | Domain science, but the standard is L.3.4. | Domain → literacy. | done |
| edu-s28-reader | `s28-glasshouse-l1` | Domain sel, but the standard is D2.Civ.8.K-2. | Domain → social-studies. | done |
| edu-s28-reader | `s28-nubbin-l1` best reply | "An accident is nobody's fault" is wrong here. | "An accident isn't done on purpose, but it's still your mess." | done |
| edu-s28-reader | `s28-complete-unverified-l1` | Mixed image ("seen with his own heart"). | "He trusts what he has seen and felt, not only what he can prove." | done |
| edu-s28-sprout | `s28-complete-unverified` #3 | Hard to read aloud. | "…Shares on purpose. We missed it." | done |
| edu-s28-sprout | `s28-complete-none-l1` | Bracketed prompt is addressed to the child. | "(Ask: what was one good thing today?)" | done |
| edu-s29-sprout | `s29-lessons-done` #2 | "He never takes things from you" contradicts the line before. | "He never steals your things. That means he likes you!" | done |
| edu-s29-sprout | `s29-complete-l1` reply | "Banging helps a bit!" endorses slamming doors. | "Banging doors doesn't fix it. Time and talking help more." | done |
| edu-s29-sprout | `s29-weir` #0 | Muddles the weir with the source. | "Up the river is a weir. Whoosh! Roar!" | done |
| edu-s29-reader | `s29-weir` #0 | Clashes with "we're about halfway". | "Up at the weir, the river comes over in one long glassy fold…" | done |
| edu-s29-sprout | `s29-cliffhouse` #0 | The lesson asks about a door never mentioned. | "Dusty's house is a round room in the cliff, with a round door." | done |
| edu-s29-sprout | `s29-beech` #2 | Too spooky for ages 3–6. | "Little eyes peep at the edge of the light. Shy ones. They stay back." | done |
| edu-s29-reader | `s29-beech` #3 | "The faces" has no antecedent in reader. | "The little shapes, if they are anything, keep to the edge…" | done |
| edu-s29-sprout | `s29-night-ribbon-l1` reply | "Easy to spot, even at night" is doubtful for red. | "Red! Bright in the lantern light." | done |
| edu-s29-sprout | `s29-fire` #1 | "Dusty sits in the rug". | "Dusty sits by it, wrapped in the rug." | done |
| edu-s30-reader | `s30-smile` #4 | Season clash, and the death is hedged. | "Fossil has faded. That means she died: her body stopped working, and it won't start again." / "Her flower grows on the hill now, and everybody who loved her remembers her." | done |
| edu-s30-sprout | `s30-smile` #3–4 | Season clash; never teaches "fade". | "Dusty's Fossil has faded." / "Faded means Fossil died. Her body stopped working, and it won't start again." | done |
| edu-s30-reader | `s30-party`, Ember | "for a whole year, once" loses the line; canon says Ember lost Ash to Corvin. | "I was busy for a whole year after I lost Ash." | done |
| edu-s30-reader | `s30-list` → `s30-five` | Two maths lessons in a row. | Tally lesson moved to after=8, so a literacy lesson sits between them. | done |
| edu-s30-sprout | `s30-blanket-ask` → `s30-blanket` | Two maths lessons in a row. | blanket-l1 → sel ask (CASEL: Responsible decision-making), "Who did the blanket help?" | done |
| edu-s30-reader | `s30-trail-s5-l1` | 4.OA.C.5 doesn't fit. | Standard removed. | done |
| edu-s30-reader | `s30-hollow-youngest` #3, #5 | Padded lines are wrong on the helped route. | "Now there is somebody on each side of Dimple, like bookends." / "Down in the hollow, nobody moves, and nobody hurries anybody." | done |
| edu-s31-reader | `s31-patch-l2` | A 50 cm gourd is too heavy for Tam to carry. | 30 cm: 120 − 30 = 90. | done |
| edu-s31-reader | `s31-light-l2`, `-light-sable-l1` | "black by lunchtime" contradicts "every dawn this autumn". | "Frost is the end of the year for gourd vines. After a hard frost, their leaves go black and limp." | done |
| edu-s31-reader | `s31-shape-l1` | The faint fact had no safety step. | Added "If someone faints near you, help them lie down and fetch a grown-up straight away." | done |
| edu-s31-reader | `s31-four-away-l1` | Shaky "best" answer. | Now a think question with three honoured answers. | done |
| edu-s31-reader | `s31-creed-l2` option | "Kept quiet, like Ned": Ned laughed. | "Kept quiet, and didn't laugh." | done |
| edu-s31-reader | `s31-midnight-wisp-l1` reply | Dubious claim about animals and fairness. | "True. Wisp doesn't know our rules. He only knew he was hungry, and there it was." | done |
| edu-s31-sprout | `s31-moss` | Odd word order, and the first fix ran to 15 words. | "I have never seen him. But I have never seen lots of real things." | done |
| edu-s31-sprout | `s31-kick-l1` | Inaccurate physics. | "No ball to push? Then Ned's leg keeps swinging. Up goes Ned!" | done |
| edu-s31-sprout | `s31-frost-l1` | Frost forms from water vapour in the air. | "Frost is ice. Water from the air freezes on the cold grass." | done |
| edu-s31-sprout | `s31-carve` | Big knife with no supervision. | "Mum stays to help with the big knife. Ivy cuts the top off. Chop!" | done |
| edu-s31-sprout | `s31-letter` | 3 lines (sprout min 4); an original line was dropped. | Added "You're a grown-up. He might listen to you more."; lesson `after: 3`. | done |

## 4. Nice to have

- Sprout narration with three short sound-word fragments ("Whoosh! Splash!") is common across
  the batch, as in earlier edu files. It reads well aloud, so it was left. A rule decision would
  settle it.
- Reader scenes shorter than six lines (S25 idle and short scenes; S31 letter, kinder, ace, rock,
  light, shape) mirror 2–5-line originals. They were left rather than padded.
- S24 reader: `s24-home-l1` could become a think question, since it sits right after one. The
  word "diary" appears only in a lesson line.
- S25: `reader:s25-clank-l1` puts the English standard RL.3.6 under the sel domain. The pencil
  joke in `clank-next-door` lands only on the Byte branch.
- S26: the reader `s26-complete` closing order; "after the flower fades" in `c12-wall-garden-l1`;
  `moss-wall-l1` is thin.
- S27: reader `letgo`/`home` lost Corvin's placing line. Sprout `s27-words` would benefit from
  setting lines.
- S28: "by Sunday" assumes a Monday start. `s28-why-untold` always says "thin grey Nubbin"
  (inherited from the main script).
- S29: the otter decline began in the late 1950s, not the 1960s. "Archaeologist" appears only in
  a reply.
- S30: the talk scenes are maths-heavy, though their order is the player's. Some standards are
  loose fits (`trail-l1`, `after-byte-l1`).
- S31: "home from the war" vs "a very serious game" is inconsistent in reader. "Rain barrel"
  could be "water butt".

## 5. Best moments to protect

- S24 reader `s24-edge`: "Tangles, sums and arguments all go better with slow hands."
- S24 sprout `s24-badges`: "She pats her welly, once. Some things are private, and that's OK."
- S25 reader: Moss's "They're just where the love went."
- S26 reader `s26-race-l2`: "Linnet is exactly as she was: bossy, funny, right."
- S27 reader `s27-gate-sold`: "Some mistakes can be mended. Mending takes time, and staying."
- S28 both bands, `s28-cart-stop`: "…and I'm keeping it. That was the end of what I was saying."
- S29 reader `night-ribbon-l1`: the main script's ribbon error, turned into a correct currents
  lesson.
- S30 sprout `s30-stone`: "If you hide your sad, people can't find you to help."
- S31 sprout `s31-promise-went`: "SEAT FOR A KEEPER. And then, small: IF."

## 6. For Maor

Writer items, weighed:

- **S24:**
  - The invented numbers all check out (5 − 1, 3 km/h × 8 h = 24 km, 200 × 5 g = 1 kg,
    365 × 50 = 18,250). Keep them.
  - **keptStone swaps are a real gap in reader.** The kept route is reachable there, and reader's
    "Your Nubbin runs…" lines contradict the stilled Nubbin. The engine needs to apply the swaps
    to edu lines, or reader needs its own swap list. Sprout can't reach that route.
- **S25:** Keeping both fates of the toy without a defaultChoice is right. The short scenes are
  acceptable.
- **S26:**
  - The gentler sprout Collector epilogue is right.
  - The one-in-twelve ramp is the US (ADA) maximum. UK Approved Document M allows 1:12 only for
    runs up to 2 m, so "builders often use" is a fair hedge. Add it to the disability-adviser
    packet, along with the new "the snow" distractor and "her wheelchair".
- **S27:**
  - Dropping the protective fib in sprout is right: it would model lying to an adult. The default
    `frost` routes to the hopeful payoff.
  - The spider facts are verified.
  - "Some Nubbin" is fine as our own title.
- **S28:**
  - No lifted text.
  - The facts are verified (104.5 °C ≈ 220 °F; pectin; sugar; mainspring).
  - 6 × 15 = 90 is now consistent. However, 15 spoons is low for a 1 lb jar (about 20–25).
    Change it if you want, which shifts the sum.
  - Confirm that naming real Britain and 1939 (the evacuees) is fine inside the Grove.
- **S29:**
  - **Main-script ribbon fix.** In `side-stories-s29.ts`, `s29-night-ribbon` line 0 reads "Near
    the weir something red is streaming out of the reeds, pointing upstream like a finger." The
    script's next line says the ribbon is pulled by the current, so it contradicts itself.
    Suggested replacement: "Near the weir something red is streaming out of the reeds, trailing
    downstream towards you like a flag." Neither edu file repeats the error.
  - **Otter.** Recommend making the old otter a mother in the main script. That means about six
    pronoun changes: "his kit", "his stone", "His dad won't make a fuss", "goes after his dad".
    The matching he/his lines in both edu files would then change too. The edu files no longer
    say "dad".
  - Dropping the Lantern Song's "sleeping eyes" line is right. Consider making it a standing
    EDU-STYLE rule.
- **S30:**
  - **Ember's "after Ash" is overruled.** STORY-BIBLE says Ember lost Ash to Corvin, so reader now
    says "after I lost Ash", matching the campaign edu files.
  - 4.OA.C.5 has been dropped.
  - The new `edu:` checks still need sim support.
  - New: `s30-hollow-youngest` (s5Done) can also play on the helped route. The edu text now copes;
    check that the engine allows the combination.
- **S31:**
  - The invented numbers are fine, except the gourd, which is now 30 cm.
  - Five rocks is right. The main script's guising scene names only four doors while its variants
    say five rocks: a one-line fix there.
  - The `act` and `tally` check verbs are already used in nine other edu files, so they are not
    new.

New items from this review (main-script edits, not made here):

- **S27.** `side-stories-s27.ts` has Spindle "living on my drawer labels for years". That
  contradicts a garden spider's one-year life; use "all summer".
- **S24.**
  - The main `s24-step1` hint says "newest flower"; use "Hazel's flower".
  - "The Adventure Book" is close to the film's prop title. Consider "Places I'll Go" (Hazel's own
    heading).
  - Shelf geography: the sun rises "over the far rim" in front of you. If the Shelf looks west
    over the Grove, the sun would rise behind you. Reader's east lesson depends on this.

## 7. Checks (after the fixes)

- `npx tsc --noEmit -p .`: clean (exit 0).
- `npx eslint src/content tests/tools`: clean (exit 0).
- `npx tsx tests/tools/content-check.ts --warnings`: `problems: 0`, warnings 2. Both are
  `pa2-01-title` and `pa2-15-tears`, in the arcade files, outside this batch. The four S28 pronoun
  warnings are gone.
- `npx prettier --check` passes on all 16 files. All of them use LF.
