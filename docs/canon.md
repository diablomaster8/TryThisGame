# Canon sheet (2026-10-14): settled facts for every fixer

This sheet wins over the review suggestions and over any older text. If a review fix contradicts
this sheet, follow the sheet and note it. Maor approved these decisions.

## Facts

1. **Moss chooses young Hazel.** Hazel came young: a young woman in a coat too big for her.
   - Moss sat beside her for a whole winter before he said a word. She fidgeted, and was very
     bad at sitting still, but she never once asked him to speak.
   - At the first thaw he looked up at her and said: "You'll do."
   - Keep S1's "She thinks she invented it" / S10's "I thought I'd made it up" pair (the third
     rule).
   - **Never:** Moss's first word was "Yes"; Hazel demanded he speak; "it took her a whole
     winter to stop asking me things".
2. **The first flower.** Briar's flower was the first memorial flower on the hill, by the big
   stone.
   - Moss's first love (the girl in "ask-loved") died long before the hill had flowers. When
     Briar's came up, he planted one for her beside it.
   - Never say any flower is older than Briar's.
3. **Pronouns:**
   - Sparks: she/her.
   - Dusty: they/them.
   - **Pixel: she/her.**
   - Byte: he/him.
   - Clank: he/him.
   - Sable: she/her.
   - Wisp: he/him.
   - Moss: he/him.
   - Sir Dentwhistle: "it".
   - Clover's fussy Nubbin in the Hebrew questline: she.
4. **Chapter 11 spans "a few days".**
   - Open `c11-close` with: "Days go by like that. Hazel sleeps a lot, and wakes up for the good
     bits."
   - Late side stories (S3's Moot, S8's close, S10, S18, S19, S20, S22) fit inside those days.
   - Chapter 11's close waits until S9 has had its chance (an engine rule: the prompt backlog).
5. **Corvin at the gate.**
   - **First arrival.** Corvin's first arrival after the Long Night is S9's dusk scene (`s9-dusk`).
     He tries the latch and it sticks.
   - **`c11-gate`** plays only on the eve of chapter 12, on the night of `s9-ask`, and is a
     *return*, not a discovery: he tries the latch once, for form's sake, and it sticks.
   - **Hazel's stance** is the same in both scenes: it's your gate now; she has done her part.
   - **In `s9-ask`** Corvin says he'll stand there till first light.
   - **During the Long Night vigil (S23, approved):** if `visitors` is set, Corvin stands in the
     lane beyond the gate with a lantern. Nobody goes to him, nobody sends him off, and he
     doesn't try the latch. This is not his "arrival".
6. **The Wellspring.** The water never freezes. Only its rim froze, once, in the White Year, and
   Cinder took her ice from that rim. After the unmaking, steam rises off the spring again; in
   the kept-stone route a rim of frost stays.
7. **Ember** was given her egg by Hazel at fifteen. Ash is her Nubbin.
8. **Hazel's letters.** Hazel left one letter, to you. Tilly got a short note, just Tilly, which
   she won't open (it's in her welly). The valley otherwise treated Hazel as gone missing.
9. **Nova** has visited the valley before. Chapter 8 is the first time she asks for anything.
   She has not been coming to the Hollow's ring for months.
10. **Ears.** Wisp has a torn ear. Bramble's ear folds over at the tip, and so does her
    youngest's. Neither Bramble nor the youngest has a torn ear.
11. **S3** opens in chapter 4 (the two knots at Lantern Night) and closes in chapter 11.
12. **Hazel's whereabouts.** In autumn she went up the valley and stood at Corvin's gate for an
    hour without knocking, then went back to her strays. Corvin can say so in chapter 9.
13. **Nova's timeline.** Hazel left at the end of the winter, so by chapter 8 (early autumn)
    she has been feeding the strays "since the snow", not "for a year".
14. **The third rule** ("When you don't know what to do, sit down next to them and wait"):
    quote or name it only where it lands. Target about four side stories, plus the campaign.
15. **Moss's resting place** (if he fades or walks into the Wellspring): his flower is on the
    hill by the flat stone where he always sat. With `hushGarden` (S26), its seed later goes
    over the wall into Hush's garden.
16. **Wisp** lives under the cottage step (not the bathhouse, which is optional).
17. **Animals and Nubbins don't speak in the Grove.**
    - Exceptions: Eternals (a little); Shadows whisper with the shard's echo (Wisp's two
      voices); Sable's one word at the water's edge; S12's hive, and its one return in S26
      (see 31).
    - Sable is never a speaker anywhere else: use narration ("Sable says nothing. Her ears stay
      up.").
18. **Lantern Night** is always "Lantern Night", capitalised.
19. **British-leaning English** throughout ("work it out", not "figure it out").

## Ratings and saves

20. **Audience type** is `'all' | 'main' | 'teen' | 'adult'`:
    - `all`: the Learning Grove and the main game.
    - `main`: the main game only, not the Learning Grove. Use it for Neopia's war and Haunted
      Woods plots.
    - `teen` (13+) and `adult` (18+): main game only, behind a content setting that is off by
      default.
    - Atlas A1, A3 and A4 are `teen`.
    - The Multiverse and It's Always Sunny (Q31–Q45) are `adult`.
21. **Separate saves.** The Multiverse, Atlas, Arcade and Neopia may *read* Grove state, never
    write it. The Multiverse's E6 uses a reflection of your oldest Eternal that lives only in
    the Multiverse save.
22. **No repetitive daily quests.** No quest or chore asks to be repeated every day, and nothing
    punishes a missed day. Items that refresh daily and free daily gifts are fine (Maor,
    2026-10-21). A quest reward is either one-time or unlimited.
23. **Fun quests** (Python, Bean, Sunny, Avatar) never trigger during chapters 9–11.

## Endings (approved change)

24. **`hazels-grove`** now needs: Sable bonded, Moss not faded, `corvin` = reconciled. It no
    longer requires the final choice "keep".
    - With "Open" (`letThemGo`), it plays a body variant, `end-hazels-grove-open`, whose first
      body line is: "There is no gate any more. Everyone who matters comes in anyway, and most
      of them still lift and push at the air where it was."
    - The order of ending checks is otherwise unchanged.
    - **`wild-grove`** (`freedByForce` and `letThemGo`) is still checked before `hazels-grove`,
      so a forced route with "Open" is still The Wild Grove.

## Part M (approved)

25. **New flags:**
    - `visitors` (S23).
    - `hushGarden` (S26).
    - `s23Done` to `s31Done`.
26. **S27** writes the existing `boughtBack` and brings the sold Nubbin home. It must close
    before chapter 9 opens.
27. **S9's family rule** needs at least two of these:
    - `corvin` = reconciled;
    - `s3Done`;
    - `s6Done`;
    - `s8Done`;
    - `millLetter` = kept;
    - `visitors`.
28. **New characters:**
    - Linnet (Tobin's granddaughter, a wheelchair user who is never "cured").
    - Augusta Fairweather.
    - Thimble (an echo).
    - Spindle (a spider who writes and never talks).
    - Parcel and Mr Grue.
    - Granny Brock.
29. **Pixel's Arcade.** After chapter 5, Pixel rescues a cabinet from the Workyard skip. Its
    cartridges are worlds with their own saves, for all ages, and never write Grove flags.

## The new campaigns' saves

30. **The Atlas.** Each Atlas page keeps its own progress inside the Atlas save, so pages can be
    played in any order. "Separate save" means separate from the Grove, not one slot per page.

## Settled in the regression pass (2026-10-15)

31. **Who can talk.** Canon 17 covers Nubbins and animals in the Grove's own story. These are
    exceptions:
    - Fun quests (Python, Bean, Sunny, Avatar) are a looser comic register, and their speaking
      Nubbins stay.
    - S12's hive speaks as one broken chorus (like the Shadows' half-voice), and returns once, at
      the ivy door in S26 (`s26-door-thrums`). Nowhere else.
    - S18's Professor Delve and S15's clockwork parrot Jackpot are not Nubbins and may speak.
    - In Atlas and Arcade worlds, the source's own talking animals talk.
32. **New-character names.** S26's girl is **Linnet**; S23's echo is **Thimble**. Wren (S20) and
    Pip (S15) are the existing valley children.
33. **Neopia and the Multiverse** aren't offered in the Learning Grove at all. On a Neopia quest,
    `all` means "suitable for any age in the main game".
34. **Freebies** are one-time (one go per save) or unlimited. Coltzan's Shrine and the Lab Ray are
    once per Nubbin, ever (rebirth doesn't reset them).
35. **The Remembering Tree.** The Night of Remembering's reward is the Remembering Tree (stories),
    which is distinct from A7's ofrenda (photos).
36. **Hazel's notebook** keeps "Day 300-something" verbatim. It counts from the doctor's year, not
    from when she left.
37. **The content setting** is called "Mature content", with three positions: Off, 13+ and 18+.
    Off is the default.


## Cross-story threads (story review, 2026-10-22)

38. **Pixel and Byte are married.** They have been married about twenty years and share the
    workshop. Pixel is she/her, Byte he/him. They show it by bickering (her clocks, his
    shoelace), never by sentiment.
    - Byte's lace came undone on their wedding day too, "all the way down the aisle".
    - **Never:** make them siblings, rivals in love, or newly courting.
39. **Marina's numbered rules** grow across the ledge stories, and each one is about someone:
    - Rule four (c2-open): "Don't be Sparks."
    - Rule five (S4): don't be Marina at your age.
    - Rule six (S29, her leaving): "Come back." It is for everyone.
    - Sparks may answer with a rule of her own: "Don't be Marina."
40. **Fern's pies.** The pie on your step in `c9-close` is Fern's. She baked two and won't say
    where the other went. The unsigned pie on Corvin's wall in S9 (`S9_FAMILY_EXTRA`) is hers too.
    In the gate-family epilogue Corvin brings the dish back on Sundays, washed, with a pie in it.
    Fern denies knowing whose dish it is, badly.
41. **Cinder's rhyme is the valley's skipping rhyme.** The children skip it badly, with great
    enthusiasm, all year (first heard on the lane in `c3-close`). Fern hums it to the hens.
42. **Granny Brock** (S29's charcoal-burner) is the valley's recurring grump. She says less than
    anyone, and always comes back with soup.
    She turns up in S20 (her bell), S28 (Parcel's coat) and S31 (a quilt and a flask), as the
    shared `granny-brock` speaker.
43. **Names settled by the 2026-10-22 review fixes.**
    - S27's stable lad is **Hob** (speaker id `s27-tam` kept). S31's seven-year-old is **Tam**.
    - Q32's inspector is **Inspector Plimsoll** (Thimble is S23's; Pell is Old Mr Pell's).
    - Q8: **Frannie is Reggie's wife.** Q61: **Mrs Tibbs** is the mayor's wife.
    - Q9: **Mother Brindle** is Barty's Keeper, who hatched him; "mother" is her own word for it.
