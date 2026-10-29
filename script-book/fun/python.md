# Fun quests: Monty Python (Q1–Q20)

## Q1. Two Shrubberies

*Monty Python and the Holy Grail: the knights who demand a shrubbery* · audience: all · where: The waterfall path, just below the falls · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** The Tall Hood (The head Knight Who Says Ni (Monty Python and the Holy Grail)), The Hooded Three (The Knights Who Say Ni (Monty Python and the Holy Grail))

### Step 1: Bring the hooded three a shrubbery.

Hint: The Decorate shop sells a flower bed for 15 shells. Place one anywhere; to a hood, that is a shrubbery. · check: `place:decor:flowerbed:shrubbery`

#### <a id="q01-intro"></a>Scene `q01-intro`

_The waterfall path is blocked. Three Nubbins in long brown hoods stand shoulder to shoulder, which for Nubbins is mostly elbow to elbow._  
_The middle one is taller than the others. On closer inspection, it is standing on a log._  
**The Hooded Three** _(angry)_: Ni!  
_Your Nubbin flinches. A small bird leaves a nearby tree and does not come back._  
**You**: Could we just get past?  
**The Tall Hood** _(think)_: You may not. Not until you bring us the thing we require.  
_There is a long pause, for drama. The hoods sway slightly._  
**The Tall Hood** _(angry)_: We want… a shrubbery!  
_The other two nod gravely. One of them was not expecting it and nods slightly late._  

**Choices**

- **What sort of shrubbery?**
    - **The Tall Hood**: A nice one. Not too dear.
    - The hood on the left whispers something. The Tall Hood adds, firmly: “Green.”
- **Chant back at them.** — sets `{"q01-chanted":true}`
    - You make the loudest, strangest noise you can manage.
    - The hooded three look at one another. The one on the right writes something down.
- **One shrubbery. Coming up.**
    - **The Tall Hood**: Good. We shall wait here. Swaying.

#### <a id="q01-first"></a>Done `q01-first`

_You set the shrubbery down. The hooded three lean over it and inspect it from every side, including underneath._  
**The Tall Hood** _(happy)_: It is a good shrubbery. It has leaves. We approve of the leaves.  
_They chant once more, softly, as a kind of thank-you. The bird does not come back for that either._  

### Step 2: Make a second shrubbery, a little higher, with a small path, and place it by the first.

Hint: Place a second flower bed beside the first, and a path stone. Higher is a matter of opinion. · check: `place:decor:terraced-shrubbery:waterfall-path`

#### <a id="q01-second"></a>Scene `q01-second`

_You step towards the path. The Tall Hood raises one paw._  
**The Tall Hood** _(think)_: Wait. There is a second thing.  
**You**: You said one shrubbery.  
**The Tall Hood**: We did. We have grown since then. As people.  
**The Tall Hood**: Bring us another. Set it beside this one, but a little higher, so that it looks terraced.  
**The Tall Hood**: And a small path down the middle. Not a big path. The sort of path a beetle would enjoy.  
_The other two hoods nod. One holds its paws a beetle-width apart, to help._  
**You**: And then we can pass?  
**The Tall Hood** _(happy)_: Then we shall discuss it.  
**The Tall Hood** _(think)_: Also, we are no longer the Hooded Three. We are now the Hooded Three Who Say—  
_It makes a noise like a tea tray falling down a staircase full of spoons. The other two join in, slightly behind._  
**You**: I can’t say that.  
**The Tall Hood** _(happy)_: Nobody can. That is what makes it so frightening.  

**Choices**

- **Fine. A little higher, with a path.**
    - **The Tall Hood**: Good. Use gravel. We have strong feelings about gravel.
- **Can the path be imaginary?** — sets `{"q01-imaginary-path":true}`
    - **The Tall Hood**: No. We tried that once. Somebody fell off it.

#### <a id="q01-terraced"></a>Done `q01-terraced`

_Two shrubberies, one a little higher than the other, with a tiny gravel path wandering between them._  
_It is, you have to admit, rather lovely._  
**The Tall Hood** _(soft)_: Oh. Oh, that is nice.  

### Complete

#### <a id="q01-complete"></a>Complete `q01-complete`

_The hooded three step aside. Then they step back again, because they want to keep looking at the shrubbery._  
**The Tall Hood**: You may pass. You may pass every day, in fact. We shall be here.  
**You**: Here? For good?  
**The Tall Hood** _(happy)_: There is a terrace, and a path. Where else would we go?  
**The Tall Hood** _(think)_: We guarded this path for years, you know. We never once asked what was at the other end of it.  
**The Tall Hood** _(soft)_: A shrubbery is a much better reason to stand somewhere.  
_They settle on a flat rock by the falls. One produces a tiny rake and starts tidying the gravel._  
_The terraced shrubbery is yours to move anywhere you like. They hope you won’t. They will forgive you if you do._  
_At dusk you can hear them practising their new name. They have still not got all the way through it._  

**Rewards**

- Terraced Shrubbery (decor): Two shrubberies, one a little higher than the other, with a tiny gravel path between them.
- The Hooded Three Stay (flag): The hooded three keep a spot on the flat rock by the falls for good, raking gravel and chanting softly at dusk. Ambient only; no story effect.

Sets on completion: `{"q01-hoods-at-falls":true}`

**Learning Grove swaps**

- `q01-intro#2` → Plink!
- `q01-intro#7` → We require… a shrubbery!

**Notes:** Three hooded Nubbins (brown cowls, the middle one on a log for height). The chorus speaker is all three at once: stack three voice blips. The chant should be loud enough to shake leaves off the nearest tree (small particle burst). New Workshop recipe needed: shrubbery (reeds + wood). The terraced version is one decor piece made by placing a second shrubbery and a path tile next to the first; the sim should merge them. After completion the hooded three idle on the rock by the falls forever and play a quiet chant at dusk. Approved quotes "Ni!" and "We want… a shrubbery!" each used once; both swapped in childLines. The new-name chant in step 2 is a short clattering sound (tray, stairs, spoons), voiced by all three; at dusk afterwards they attempt it and give up halfway.

## Q2. None Shall Cross

*Monty Python and the Holy Grail: the Black Knight* · audience: all · where: The plank bridge over the stream · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Sir Dentwhistle (The Black Knight (Monty Python and the Holy Grail))

### Step 1: Beat Sir Dentwhistle at karate on the plank bridge.

Hint: Choose Karate on the bridge to start a bout. Any of your Nubbins can fight. · check: `karate:win:sir-dent:1`

#### <a id="q02-intro"></a>Scene `q02-intro`

_A plank bridge crosses the stream. In the middle of it stands a Power Nubbin in a dented helmet, perfectly still._  
_It has stood there so long that a snail has started up its leg. It has not noticed, or will not admit it._  
**You**: Excuse me. We’d like to cross.  
**Sir Dentwhistle** _(angry)_: None shall pass.  
_Its voice echoes inside the helmet. It sounds like someone talking into a bucket._  
**Sir Dentwhistle**: I am Sir Dentwhistle. I have guarded this plank for three whole days.  
**Sir Dentwhistle** _(shock)_: Before that it was unguarded. Chaos. People simply walked across it.  
_It raises its little fists. If you want to cross, you will have to beat it at karate._  

**Choices**

- **Bow politely, then fight.**
    - **Sir Dentwhistle**: A courteous foe. I shall defeat you courteously.
- **Can’t we just go round?** — sets `{"q02-asked-round":true}`
    - You look downstream. There is a perfectly good row of stepping stones about ten steps away.
    - **Sir Dentwhistle**: Nobody uses those. They are beneath us. Literally. They are lower.

#### <a id="q02-round1"></a>Done `q02-round1`

_Your Nubbin’s best move sends the dented helmet spinning off into the grass._  
_Underneath, Sir Dentwhistle has very flat hair._  
**Sir Dentwhistle** _(angry)_: 'Tis but a scratch.  
**You**: It was your hat.  
**Sir Dentwhistle**: A hat is a kind of scratch. A scratch on the head. Again!  

### Step 2: Win a second bout against Sir Dentwhistle.

Hint: Same bridge. Swap in a fresher Nubbin if yours is tired; Sir Dentwhistle does not mind. · check: `karate:win:sir-dent:2`

#### <a id="q02-scarf"></a>Scene `q02-scarf`

_Sir Dentwhistle wraps a long woollen scarf round its neck three times, for armour._  
**Sir Dentwhistle**: The scarf is my second line of defence. Nobody has ever got past the scarf.  
**Sir Dentwhistle** _(think)_: My mother knitted it. She said nothing would ever get through it. She meant the cold, but the principle stands.  
**You**: Has anybody tried?  
**Sir Dentwhistle** _(think)_: That is not the point.  
_It takes up a fighting stance. The stance is mostly scarf._  
_The snail has reached its shoulder and is enjoying the view._  

#### <a id="q02-round2"></a>Done `q02-round2`

_The scarf unwinds in one long, satisfying pull and drifts off downstream like a woolly eel._  
**Sir Dentwhistle** _(angry)_: Barely bothered. I was getting warm anyway.  
_Its tiny round glasses have steamed up with fury._  

### Step 3: Win the third and final bout.

Hint: If you keep losing, rest your Nubbin first. Tired Nubbins fight slowly. · check: `karate:win:sir-dent:3`

#### <a id="q02-glasses"></a>Scene `q02-glasses`

_Sir Dentwhistle wipes its glasses on its own tummy and puts them back on, crooked._  
**Sir Dentwhistle**: Final round. I have one item left, and it is my best item.  
**Sir Dentwhistle** _(think)_: Without these, I cannot see you. Which means you cannot see me either. Logically.  
**You**: That isn’t how seeing works.  
**Sir Dentwhistle**: It is how it works on my bridge.  
_Your Nubbin looks up at you. It would like to win quickly and then have a snack._  

**Choices**

- **Go easy on it.** — sets `{"q02-gentle":true}`
    - Your Nubbin nods and loosens its shoulders in a merciful way.
- **Give it everything.**
    - Your Nubbin cracks its knuckles. It has no knuckles. It cracks them anyway.

#### <a id="q02-round3"></a>Done `q02-round3`

_The glasses fly off and land neatly in the snail’s path. The snail goes round them._  
**Sir Dentwhistle** _(shock)_: I am completely fine. Never better. Which one of you said that? Both of you?  
_It is talking to a fence post._  
**Sir Dentwhistle** _(angry)_: Come back here! I shall nibble your ankles! All four of them!  
_The fence post, to its credit, does not move an inch._  

### Complete

#### <a id="q02-complete"></a>Complete `q02-complete`

_Sir Dentwhistle sits down on the plank, which is the closest it will ever come to stepping aside._  
**Sir Dentwhistle** _(think)_: Very well. You may cross. Not because you won. Because I have decided to have a sit.  
_You pick the dented helmet out of the grass and offer it back. It pushes it towards you._  
**Sir Dentwhistle** _(sad)_: Keep it. I have several others. At home. In a box.  
_It does not have several others. You can tell from the way it watches the helmet._  
**Sir Dentwhistle** _(happy)_: And tell your Nubbins this: losing is only losing if you mind. I never mind. I am famous for not minding.  
_You cross the plank in two steps. Downstream, the stepping stones look on, unused and faintly hurt._  
_From now on your Nubbins take karate losses the way Sir Dentwhistle does: cheerfully, and slightly wrongly._  

**Choices**

- **Shall we call it honours even?** — sets `{"q02-verdict":"even"}`
    - **Sir Dentwhistle**: Honours even. Yes. I was about to suggest it myself. I was being gracious.
    - It shakes your hand, and then the fence post’s, to be thorough.
- **You lost, you know. Three times.** — sets `{"q02-verdict":"lost"}`
    - Sir Dentwhistle is quiet for a long moment. The snail, now on top of its head, is quiet too.
    - **Sir Dentwhistle**: …I know. I was there.
    - **Sir Dentwhistle**: Thank you for saying it plainly. Nobody ever does. It is oddly restful.

**Rewards**

- Dented Helm (cosmetic): A battered little helmet with one proud dent. A hat for your Keeper or any Nubbin.
- Barely Bothered (feature): Karate perk: losing a bout no longer costs your Nubbin any happiness.

**Learning Grove swaps**

- `q02-intro#3` → This plank is closed.
- `q02-round1#2` → Hardly noticed it.

**Notes:** Three karate bouts in a row against one Power Nubbin. Its gear comes off in order: helmet (round 1), scarf (round 2), glasses (round 3); give it an art layer per item so each loss shows. The snail climbs a little higher after each round (purely cosmetic). Sir Dentwhistle should be beatable by a mid-level Nubbin; the point is the jokes, not the challenge. After the quest it sits on the plank permanently and waves as you pass. Approved quotes "None shall pass." and "'Tis but a scratch." each used once; both swapped in childLines. The complete scene ends on a choice (honours even / tell it plainly) that sets the cosmetic flag q02-verdict; no other effect.

## Q3. The Bridge of Three Questions

*Monty Python and the Holy Grail: the Bridge of Death* · audience: all · where: The rope bridge at the edge of the gorge · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Old Gorrel (The Bridgekeeper (Monty Python and the Holy Grail))

### Step 1: Count every Nubbin in your Grove, then go back to the gorge.

Hint: Open the counter and tap each Nubbin once. Don’t forget the ones hiding in the pond. · check: `count:nubbins:grove`

#### <a id="q03-intro"></a>Scene `q03-intro`

_At the edge of the gorge, beside a rope bridge nobody has ever been allowed on, sits a very old Keeper in a very old hood._  
_The hood has a fringe of moss. So, possibly, does the Keeper._  
**Old Gorrel** _(think)_: Halt. Whoever would cross my bridge must answer me three questions.  
**Old Gorrel**: Answer rightly, and the bridge is yours. Answer wrongly, and… well. It is a long way down. To the stream.  
_You look down. The stream is knee-deep and full of contented ducks._  
**Old Gorrel**: First question. How many Nubbins live in your Grove? Exactly. Not roughly. I will know.  
**You**: I… think I know? Let me check.  
**Old Gorrel** _(happy)_: Go and count them. I shall wait. I am extremely good at waiting.  

**Choices**

- **Make a confident guess.** — sets `{"q03-guessed":true}`
    - **Old Gorrel**: Wrong. Probably. Go and count.
- **Go and count properly.**
    - **Old Gorrel**: Wise. The last one who guessed is still in the stream. He likes it there now.

#### <a id="q03-count"></a>Done `q03-count`

_You come back with the number. Old Gorrel checks it against something written on his sleeve._  
**Old Gorrel** _(think)_: Correct. Annoyingly.  
**Old Gorrel**: Second question. What did your newest Nubbin eat for breakfast?  
**You**: A run fruit. Half of one. It dropped the other half in the pond.  
**Old Gorrel** _(sad)_: Correct, and also tragic.  

### Step 2: Find out how fast a Fly Nubbin can carry a coconut.

Hint: Take a coconut from the palm on the coast, hand it to a Fly Nubbin and time its flight across the pond. · check: `time:fly-nubbin:carry:coconut`

#### <a id="q03-third"></a>Scene `q03-third`

**Old Gorrel** _(think)_: Third question.  
_He leans forward. The hood leans further. The ducks below go quiet, sensing an occasion._  
**Old Gorrel**: What is the airspeed velocity of an unladen swallow?  
**You**: Birds aren’t really my area.  
**Old Gorrel** _(think)_: Nor mine. It is written on a very old card. I have never actually seen the bird on it.  
**Old Gorrel**: Then a Fly Nubbin. Carrying a coconut. How fast? Go and find out.  
_He sits back, smug as a cushion. Nobody has ever answered the third question._  

#### <a id="q03-timed"></a>Done `q03-timed`

_You time two Fly Nubbins. The first carries the coconut briskly across the pond._  
_The second carries it halfway, sits on it, and has a think._  
_So the honest answer is: it depends on the Fly Nubbin. You have a feeling that is the whole point._  

### Complete

#### <a id="q03-complete"></a>Complete `q03-complete`

**Old Gorrel** _(happy)_: Well? How fast?  
**You**: What do you mean? An African or European swallow?  
_Old Gorrel opens his mouth. Then he closes it. Then he opens it again, to check it still works._  
**Old Gorrel** _(shock)_: I… don’t know that. Nobody has ever asked me one back.  
_He takes a thoughtful step backwards, onto nothing in particular, and drops neatly into the stream._  
_There is a splash, and then a great deal of indignant quacking._  
**Old Gorrel** _(happy)_: I’m all right! It’s rather pleasant, actually! The bridge is yours!  
**Old Gorrel** _(soft)_: Forty years of asking people questions. Do you know, it’s rather lovely to be asked one.  
_He floats away on his back, waving. Halfway, he flings his hood up onto the rope post. It lands perfectly. He has practised._  

**Rewards**

- Gorge Shortcut (feature): The rope bridge across the gorge opens for good: a shortcut between the orchard side and the far meadow.
- Bridgekeeper’s Hood (cosmetic): A very old hood with a fringe of moss. Slightly damp, forever.

**Learning Grove swaps**

- `q03-third#2` → How fast does a small bird fly, if it isn’t carrying anything?
- `q03-complete#1` → Which Fly Nubbin? The quick one, or the one that sits on things?

**Notes:** The counter in step 1 is a simple tally overlay: tap each Nubbin once; the sim checks against the real count. Question two is answered automatically from the save (the last fruit your newest Nubbin ate); if it has eaten nothing, swap the line for "Nothing yet. It’s been asleep." via a variant. Step 2 needs a coconut item from the coast palm and a simple timed carry. The fall into the stream must read as harmless: a splash, ducks, him laughing. Afterwards he lives on a rock downstream and waves. The rope bridge becomes walkable. Approved quotes (the swallow question and the reply) each used once; both swapped in childLines, and the line after the swallow question is written to work with either version.

## Q4. Clip-Clop

*Monty Python and the Holy Grail: coconut halves for a horse* · audience: all · where: Anywhere on the main path; the Run Nubbin falls in behind you · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Trotwell (Patsy, with the coconut halves (Monty Python and the Holy Grail)), Warden Ollery (The castle guard in the coconut scene (Monty Python and the Holy Grail)), Gullwick (The coconut-carrying swallow debated by the guards (Monty Python and the Holy Grail))

### Step 1: Find out where the coconut shells came from.

Hint: Follow the coast path to the one palm tree and look for whoever has been carrying fruit away from it. · check: `talk:gullwick`

#### <a id="q04-intro"></a>Scene `q04-intro`

_Clop. Clop-clop. Clop._  
_Behind you, a Run Nubbin is trotting in step with you, banging two coconut half-shells together._  
_When you stop, it stops. When you walk, it clops. It looks extremely pleased with the arrangement._  
_Up on the lookout wall, Warden Ollery leans over with a telescope, which at this distance is no help at all._  
**Warden Ollery**: Where'd you get the coconuts?  
**You**: They aren’t mine. They’re… its.  
**Warden Ollery** _(think)_: Coconuts don’t grow round here. One palm in the whole valley, and that’s on the coast.  
**Warden Ollery**: So how did they get all the way up here? I’ve been wondering since breakfast.  
**Warden Ollery** _(think)_: Unless two Fly Nubbins carried it between them. On a bit of string. Holding one end each.  
_He thinks about this for slightly longer than is healthy, then draws a diagram on the wall in chalk._  
_The Run Nubbin clops twice, which might mean anything._  

**Choices**

- **Ask the Run Nubbin.**
    - It clops, then points its whole body towards the sea.
- **Does it matter?** — sets `{"q04-shrugged":true}`
    - **Warden Ollery**: Everything matters, from up here. There’s not much else to look at.

#### <a id="q04-gullwick"></a>Done `q04-gullwick`

_Under the palm sits a Fly Nubbin with enormous, exhausted wings. Its name tag says Gullwick._  
**Gullwick** _(sad)_: Carried it. All the way. Uphill. Into a headwind.  
**Gullwick**: Dropped it on a rock at the top. Went in two. Run Nubbin found the halves. Very happy. I am very tired.  
_Gullwick lies down flat in the sand to make the point._  

**Choices**

- **Thank Gullwick properly.** — sets `{"q04-thanked-gullwick":true}`
    - You thank Gullwick. It lifts one wing an inch off the sand, which is all the wing will do today.
    - **Gullwick**: Nobody said that before. Nice. Very tired. Still nice.
- **Why carry it all that way?**
    - **Gullwick**: Seemed like it wanted to go up.
    - It says this as though it explains everything. Possibly it does.

### Step 2: Decide what happens to the coconut shells.

Hint: Go back to the lookout wall. The Run Nubbin will follow; talk to it there. · check: `talk:trotwell`

#### <a id="q04-return"></a>Scene `q04-return`

_You walk back up to the lookout wall. Clop. Clop-clop. The Run Nubbin is right behind you, of course._  
**You**: A Fly Nubbin carried a whole coconut up from the coast. It broke on a rock.  
**Warden Ollery** _(shock)_: All that way? With those little wings?  
**Warden Ollery**: Well. Mystery solved. I suppose the shells ought to go back to the beach, really. Tidiness and so on.  
_The Run Nubbin hugs the shells to its chest and looks at you with its whole face._  
_It is the look of someone who has found the one sound they were born to make._  

**Choices**

- **They’re yours. Keep them.** — sets `{"q04-kept":true}`
    - The Run Nubbin does a small celebratory trot in a circle. Clop-clop-clop-clop.
- **Keep them, but let the others have a turn.** — sets `{"q04-shared":true}`
    - The Run Nubbin considers this and agrees, provided its turn comes first. And last.

#### <a id="q04-decided"></a>Done `q04-decided`

_The Run Nubbin tucks the shells under one arm and gives you a long, grateful look._  
**Warden Ollery** _(happy)_: Well, that’s that settled. Clop away, little one.  

### Complete

#### <a id="q04-complete"></a>Complete `q04-complete`

_The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove. Soon every Nubbin wants a go._  
**Warden Ollery** _(soft)_: I’ll be honest. I quite like the noise. It’s company.  
_As thanks, Trotwell teaches you the trot. It is mostly knees._  
_From now on, when you run, you can swap your footsteps for coconut hooves._  
_Far away on the beach, Gullwick sleeps soundly, wings spread out like a dropped coat._  
_Beside it someone has left a fruit and a note in chalk: “Thank you for the noise. From the wall.”_  
_Warden Ollery rubs out the chalk diagram of two Fly Nubbins and a string, slowly, like a man giving up a theory._  
**Warden Ollery** _(sad)_: I’ll miss the string. It was a good string.  
_Trotwell clops once, in sympathy._  

#### <a id="q04-complete-kept"></a>Variant `q04-complete-kept`

_Variant of `q04-complete`._

_The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove._  
_Nobody else gets a go. Trotwell clops past the whole queue, very politely smug._  
**Warden Ollery** _(soft)_: I’ll be honest. I quite like the noise. It’s company.  
_As thanks, Trotwell teaches you the trot. It is mostly knees._  
_From now on, when you run, you can swap your footsteps for coconut hooves._  
_Far away on the beach, Gullwick sleeps soundly, wings spread out like a dropped coat._  
_Beside it someone has left a fruit and a note in chalk: “Thank you for the noise. From the wall.”_  
_Warden Ollery rubs out the chalk diagram of two Fly Nubbins and a string, slowly, like a man giving up a theory._  
**Warden Ollery** _(sad)_: I’ll miss the string. It was a good string.  
_Trotwell clops once, in sympathy._  

#### <a id="q04-complete-shared"></a>Variant `q04-complete-shared`

_Variant of `q04-complete`._

_The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove._  
_Everyone gets a go. Trotwell stands at the front of the queue and the back, which takes a lot of running._  
**Warden Ollery** _(soft)_: I’ll be honest. I quite like the noise. It’s company.  
_As thanks, Trotwell teaches you the trot. It is mostly knees._  
_From now on, when you run, you can swap your footsteps for coconut hooves._  
_Far away on the beach, Gullwick sleeps soundly, wings spread out like a dropped coat._  
_Beside it someone has left a fruit and a note in chalk: “Thank you for the noise. From the wall.”_  
_Warden Ollery rubs out the chalk diagram of two Fly Nubbins and a string, slowly, like a man giving up a theory._  
**Warden Ollery** _(sad)_: I’ll miss the string. It was a good string.  
_Trotwell clops once, in sympathy._  

**Rewards**

- Clip-Clop Mode (feature): A toggle for the Run button: your footsteps become coconut hooves, and your Keeper breaks into a trot.

**Learning Grove swaps**

- `q04-intro#4` → Where did those shells come from?

**Notes:** Trotwell trails the player at a set distance and plays a two-shell clop on every step from the moment the quest starts. Needs a clop sound set (walk and trot tempos) and a trot animation for the Keeper (knees high). Gullwick idles flat on the beach under the palm after the quest. Clip-clop mode is a settings toggle that swaps footstep audio and the run animation only; speed is unchanged. Approved quote "Where'd you get the coconuts?" used once; swapped in childLines.

## Q5. The Rabbit at the Ledge

*Monty Python and the Holy Grail: the killer rabbit and the holy hand grenade* · audience: all · where: The cliff ledge above the falls · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Sir Rollo Brisket (King Arthur (Monty Python and the Holy Grail)), Sparks, Snowdrop (The Rabbit of Caerbannog (Monty Python and the Holy Grail))

### Step 1: Ask Sparks to build something that can win over the rabbit.

Hint: Sparks is in the Workshop. Bring one sun fruit; Sparks will need it. · check: `give:item:sun-fruit:sparks`

#### <a id="q05-intro"></a>Scene `q05-intro`

_On the cliff ledge above the falls, a crowd of Nubbins has gathered round something small, white and fluffy._  
_It is a rabbit. It is the size of a slipper. It is chewing a clover with total calm._  
**Sir Rollo Brisket** _(happy)_: Stand back, Keeper. My Nubbins and I have trained for this all week.  
_This is Sir Rollo Brisket, a Keeper with a cape, a cardboard crown and a great deal of confidence._  
_His strongest Power Nubbin steps up to the rabbit for a friendly karate bout._  
_There is a white blur. The Power Nubbin is suddenly sitting in a bush some way off, puzzled but fine._  
_The next Nubbin steps up. Blur. Bush. The next. Blur. Same bush. It is getting crowded._  
**Sir Rollo Brisket** _(shock)_: Run away!  
_Everyone runs about ten steps, then stops, because the rabbit has gone back to its clover._  

**Choices**

- **Let your Nubbin try.** — sets `{"q05-tried":true}`
    - Your Nubbin steps up bravely. Blur. Bush. It climbs out with a leaf on its head, giggling.
- **Watch the rabbit for a bit.**
    - You notice it never starts a fight. It only finishes them, very quickly, and then has a snack.

#### <a id="q05-sparks"></a>Done `q05-sparks`

**Sparks** _(happy)_: A rabbit beat ALL of them? One hit each? Oh, I love that rabbit.  
**Sparks**: Right. Leave it with me. One sun fruit, some ribbon, and a very small amount of fizz.  
_There is a crackle, a small blue flash, and a smell of toasted fruit._  

### Step 2: Take the Hand Melon to the ledge, count to exactly three, and toss it.

Hint: Tap Count once per beat and throw on three. Too many or too few and it fizzles; Sparks will make another. · check: `minigame:count:hand-melon:3`

#### <a id="q05-melon"></a>Scene `q05-melon`

**Sparks** _(happy)_: Behold. The Hand Melon.  
_It is a sun fruit with a ribbon round it and a little paper tag. It hums faintly._  
**You**: It’s not a melon.  
**Sparks**: Melon sounds braver. Read the tag. The tag is important. I wrote it in my best voice.  
_You turn the tag over. The handwriting is very formal and slightly singed._  
**Sparks** _(think)_: Three shall be the number thou shalt count.  
**Sparks**: Not two, which is lazy. Not four, which is showing off. Three. Then toss it, gently, near the rabbit. Not at it.  
**Sparks**: It goes off like a party. Nobody gets hurt. The rabbit loves parties. Probably.  

**Choices**

- **Practise counting first.** — sets `{"q05-practised":true}`
    - **You**: One. Two. Three.
    - **Sparks**: Perfect. Do exactly that, but with feeling.
- **What if I count to four?**
    - **Sparks**: Then it just sits there, disappointed in you. So will I.
- **Let Sir Rollo do the honours.** — sets `{"q05-rollo-counted":true}`
    - **Sir Rollo Brisket**: Allow me. One… two… several!
    - **Sparks**: THREE, Rollo.
    - The Hand Melon gives a small, sad fizz in his hand. Sparks takes it back and makes another without a word.

#### <a id="q05-pop"></a>Done `q05-pop`

_One. Two. Three. You toss the Hand Melon in a gentle arc._  
_It bursts into a shower of fruit confetti: little sweet scraps of every colour, drifting down like snow._  
_The rabbit sits up, ears tall. It has never seen anything so wonderful in its life._  

### Complete

#### <a id="q05-complete"></a>Complete `q05-complete`

_The white rabbit hops through the confetti, eating as it goes, and stops at your feet._  
_It looks up at you, then at your Nubbin, and very politely does not knock anyone into a bush._  
**Sir Rollo Brisket** _(think)_: Extraordinary. I had a whole plan. It involved a lot of shouting.  
**Sir Rollo Brisket** _(soft)_: I suppose it was only ever minding its clover. We were the ones who kept walking up to it.  
**Sparks** _(happy)_: I made you a spare Hand Melon. For the mantelpiece. I took the fizz out, so it’s just pretty.  
_The rabbit follows you home. Your Nubbins adore it, and one of them is already trying on its ears._  
_Its name, you decide, is Snowdrop. It agrees by sitting on your foot._  

**Rewards**

- Snowdrop the White Rabbit (cosmetic): A small white rabbit critter who lives in your Grove. Nubbins who play with it can take on its fluffy-ears part.
- Hand Melon (decor): A sun fruit tied with ribbon, on a little stand. The fizz has been taken out. It still hums faintly.

**Learning Grove swaps**

- `q05-intro#7` → Back, everyone! Back!
- `q05-melon#5` → Count to three. Exactly three, and then let go.

**Notes:** The rabbit is a critter, not a Nubbin. Its "karate" is a one-frame white blur that relocates the opposing Nubbin into a bush with no damage or happiness loss (do not let these bouts count as losses). Bush stacks up visibly. The count minigame: a Count button and a Throw button; exactly three counts then Throw succeeds, anything else fizzles harmlessly with a sad trombone and Sparks hands over another. The burst is fruit-coloured confetti, no smoke or bang. Snowdrop then roams the Grove; a Nubbin that plays with it can gain a fluffy-ears part through the usual part-pickup rule. Approved quotes "Run away!" and "Three shall be the number thou shalt count." each used once; both swapped in childLines. q05-rollo-counted is flavour: "One, two, several!" and the sad fizz are the joke.

## Q6. The Wooden Rabbit

*Monty Python and the Holy Grail: the Trojan Rabbit and the taunter on the wall* · audience: all · where: The old wall at the far end of the valley · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Sir Barnabus Parapet (The taunter on the castle wall (Monty Python and the Holy Grail))

### Step 1: Build a giant wooden rabbit at the Workshop.

Hint: The giant rabbit needs a lot of wood and a set of wheels. The fallen logs by the woods are a good start. · check: `craft:decor:wooden-rabbit`

#### <a id="q06-intro"></a>Scene `q06-intro`

_At the far end of the valley stands an old wall with a little tower on top. On the tower stands a stranger._  
_He has a magnificent moustache and an accent from somewhere very far away, or possibly from nowhere at all._  
**Sir Barnabus Parapet** _(happy)_: Hello down there, small Keeper with the small animals! I do not think much of your hat!  
**You**: I’m not wearing a hat.  
**Sir Barnabus Parapet**: And I do not think much of that either!  
_A ripe sun fruit sails over the wall and lands on your head. It goes everywhere._  
**Sir Barnabus Parapet** _(angry)_: Your mother was a hamster, and your father smelt of elderberries!  
_He disappears behind the wall. You can hear him laughing and then, slightly worryingly, eating._  
_He reappears. He has thought of another one, and it has clearly cost him something._  
**Sir Barnabus Parapet** _(happy)_: And your Nubbin looks like a sock that has been told a secret!  
_Your Nubbin looks down at itself, then up at you, stricken. You tell it it looks nothing like a sock._  

**Choices**

- **Shout something rude back.** — sets `{"q06-shouted":true}`
    - **You**: Your… wall is… wonky!
    - **Sir Barnabus Parapet**: It is NOT wonky! It has CHARACTER!
- **Wipe off the fruit with dignity.**
    - You wipe off the fruit with great dignity. A second fruit arrives.

#### <a id="q06-built"></a>Done `q06-built`

_The wooden rabbit is twice as tall as you, with big flat ears and a slightly anxious expression._  
_It is on wheels. It has a little door in its tummy. Nobody can remember why you added the door._  

### Step 2: Wheel the wooden rabbit to the stranger’s wall.

Hint: Push it from behind and steer round the stream. It does not float. · check: `push:decor:wooden-rabbit:far-wall`

#### <a id="q06-plan"></a>Scene `q06-plan`

_The wooden rabbit stands outside the Workshop, wheels chocked, ears high._  
**You**: Right. We wheel it to his wall and leave it at the gate.  
_Your Nubbins nod seriously. They have been told it is a plan. They have not been told the plan._  
_Neither, you realise, have you._  
**You** _(think)_: He’ll take it in, and then… something will happen.  
_That will do. It has wheels. Wheels are a sort of plan in themselves._  

#### <a id="q06-gate"></a>Done `q06-gate`

_You leave the rabbit at the gate and hide behind a bush. The gate creaks. The stranger drags the rabbit inside._  
_Behind the bush, everyone looks at everyone. Slowly, it dawns that the rabbit was the whole plan._  
**You** _(think)_: …Was somebody meant to be inside it?  
_Your Nubbins look at their feet. One of them looks at a different, unrelated bush._  

**Choices**

- **Start laughing.** — sets `{"q06-laughed":true}`
    - You laugh. Your Nubbins laugh. Behind the wall, the stranger laughs too, though not for the same reason.
- **Knock and ask for it back.** — sets `{"q06-knocked":true}`
    - **Sir Barnabus Parapet**: Ask for what back? I have no rabbit. I am a man alone with his wall.

### Complete

#### <a id="q06-complete"></a>Complete `q06-complete`

_Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear._  
_“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”_  
_Underneath, in smaller writing: “Your hat is still terrible.”_  
**You**: I’m still not wearing a hat.  
_Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”_  
_The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out._  
_It makes, everyone agrees, an excellent spot for photographs._  

#### <a id="q06-complete-shouted"></a>Variant `q06-complete-shouted`

_Variant of `q06-complete`._

_Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear._  
_“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”_  
_Underneath, in smaller writing: “Your hat is still terrible.”_  
**You**: I’m still not wearing a hat.  
_Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”_  
_“P.P.S. The wall is NOT wonky.”_  
_The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out._  
_It makes, everyone agrees, an excellent spot for photographs._  

#### <a id="q06-complete-laughed"></a>Variant `q06-complete-laughed`

_Variant of `q06-complete`._

_Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear._  
_“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”_  
_Underneath, in smaller writing: “Your hat is still terrible.”_  
**You**: I’m still not wearing a hat.  
_Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”_  
_“P.P.S. You laughed. Nobody laughs on the wall. Do it again.”_  
_The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out._  
_It makes, everyone agrees, an excellent spot for photographs._  

#### <a id="q06-complete-knocked"></a>Variant `q06-complete-knocked`

_Variant of `q06-complete`._

_Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear._  
_“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”_  
_Underneath, in smaller writing: “Your hat is still terrible.”_  
**You**: I’m still not wearing a hat.  
_Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”_  
_“P.P.S. I have no rabbit. Stop knocking.”_  
_The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out._  
_It makes, everyone agrees, an excellent spot for photographs._  

**Rewards**

- Giant Wooden Rabbit (decor): A huge wooden rabbit on wheels. Climb in through the tummy door and peek out of it in Photo mode.

**Learning Grove swaps**

- `q06-intro#6` → Your boots are muddy, and your Nubbin snores like a kettle!

**Notes:** The stranger appears only on the tower; he never comes down. His accent is invented and wobbly (it changes halfway through words); do not base it on any real nationality, and keep his voice blips silly rather than foreign. Fruit drops are harmless and splat with a soft sound; any fruit that lands can be picked up and eaten. New Workshop recipe: wooden rabbit (lots of wood, wheels). Pushing works like moving any heavy decor, with a squeak loop. Overnight the rabbit returns to the Workshop with a note; the tummy door is a Photo mode spot for the Keeper plus one Nubbin. Approved quote (the hamster line) used once; swapped in childLines.

## Q7. It’s Only a Model

*Monty Python and the Holy Grail: Camelot* · audience: all · where: The top of the little hill · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Pixel, Byte

### Step 1: Gather 12 stone for the castle towers.

Hint: Stone turns up in the riverbed and under the cliffs. Tap a sparkling rock to pick it up. · check: `gather:item:stone:12`

#### <a id="q07-intro"></a>Scene `q07-intro`

_On top of the little hill, Pixel is kneeling beside a castle. It is about knee-high._  
_It has a gate, a drawbridge made from a lolly stick, and two towers that stop halfway up, as if they lost interest._  
**Pixel** _(happy)_: Keeper! Behold! The Grand Palace of the Hill!  
_Pixel turns to the valley, arms wide, and announces it again, louder, to everyone and no one._  
**Pixel**: Gaze upon it, all ye Grove! Marvel at its towers! Well. Marvel at the bottom halves of its towers.  
_Byte comes up the path with a cup of tea, looks at the castle, and does not slow down._  
**Byte**: It's only a model.  
**Pixel** _(angry)_: SHH.  
**Pixel**: It needs proper stone towers. Real ones. Little ones. Will you help? Byte clearly won’t.  
**Byte** _(think)_: I am drinking my tea.  
_There is a tea stain on the lolly-stick drawbridge. Byte moves his cup behind his back._  

**Choices**

- **Of course. Grand palace it is.**
    - **Pixel**: Thank you. Byte, write that down. Somebody believes.
- **It is quite small.** — sets `{"q07-said-small":true}`
    - **Pixel**: It is to SCALE. There is a difference.
    - **Byte**: There is not.

#### <a id="q07-stone"></a>Done `q07-stone`

_You bring Pixel an armful of stone. Pixel weighs each piece in one hand like a jeweller._  
**Pixel**: This one is a tower. This one is a battlement. This one is… a nice stone. Keep that one.  

### Step 2: Finish the castle’s towers with Pixel.

Hint: Place stones on the glowing spots at the top of each tower. Twelve in all. · check: `build:decor:model-castle:towers`

#### <a id="q07-towers"></a>Scene `q07-towers`

**Pixel** _(think)_: Now. The towers. Hold this, hold that, and whatever happens, do not breathe on the east wing.  
_You build together. Pixel places, you hold, and your Nubbin hands up stones one at a time with great ceremony._  
_One Nubbin hands Pixel a stone. Pixel says it is the wrong stone._  
_The Nubbin hands her the same stone again, with more conviction._  
**Pixel** _(happy)_: Better.  
_Every few minutes Pixel stands back, squints, and moves one stone a hair to the left._  
**Byte**: You moved that one back to where it was.  
**Pixel**: I moved it MORE to where it was.  
_The towers rise, stone by stone. They reach your knee. Then a little over your knee._  
_A cloud passes. For one moment, lying flat in the grass at the right angle, the castle looks enormous. Then the sun comes back._  

#### <a id="q07-finished"></a>Done `q07-finished`

_The last stone goes on. Two proud towers, a lolly-stick drawbridge, and a flag made from a sweet wrapper._  
**Pixel** _(happy)_: Grove! The Grand Palace is COMPLETE!  
_The valley echoes back, faintly: “…plete.” Pixel takes this as applause._  
_Far below, a Nubbin by the pond looks up, waves, and goes back to its puddle._  

### Complete

#### <a id="q07-complete"></a>Complete `q07-complete`

_That evening, three Nubbins wander up the hill and stop in front of the castle._  
_One puts a leaf on its head like a crown. One stands on the drawbridge and points dramatically at nothing._  
_The third lies down and plays a dragon, or a cloud. It is hard to say. It commits completely._  
**Pixel** _(soft)_: They’re putting on a play. In my palace. This is the best day of my whole life.  
**Byte** _(think)_: Still quite small, I’d say…  
_Byte stops, watches the leaf-crowned Nubbin take a very small bow, and sips the tea instead._  
**Byte** _(soft)_: It is a very good model.  
**Byte**: The drawbridge is load-bearing. I tested it. Twice.  

**Rewards**

- Model Castle (decor): Pixel’s knee-high Grand Palace. Now and then, Nubbins gather in front of it and put on a little play.

**Learning Grove swaps**

- `q07-intro#6` → It’s about the size of a footstool.

**Notes:** The castle is a decor piece with two states (half towers, full towers); step 2 is a placing minigame of twelve glowing spots. The "little play" is an idle event: when three or more Nubbins are near the castle at dusk, there is a small chance they act out a scene (leaf crown, pointing, one lying down as a dragon or cloud) for about 20 seconds. Pixel shouting to the valley should echo once. Approved quote "It's only a model." used once; swapped in childLines.

## Q8. What Has the Aqueduct Done for Us?

*Monty Python’s Life of Brian: “What have the Romans ever done for us?”* · audience: all · where: The Keepers’ Hall, during a committee meeting · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11), once you have built at least three things

**Cast:** Reggie Thistlewood (Reg (Monty Python’s Life of Brian)), Frannie Quill (Francis (Monty Python’s Life of Brian)), Old Mags (A member of the People’s Front meeting (Monty Python’s Life of Brian))

### Step 1: Build an aqueduct from the falls to your crops.

Hint: Craft aqueduct sections at the Workshop from stone and wood, then lay them from the top of the falls to the crop beds. · check: `build:decor:aqueduct:falls-to-crops`

#### <a id="q08-intro"></a>Scene `q08-intro`

_In the Keepers’ Hall, a meeting is in progress. There are four chairs, three Keepers and a lot of paper._  
_A banner on the wall says GROVE IMPROVEMENT COMMITTEE. Someone has crossed out IMPROVEMENT._  
**Reggie Thistlewood** _(angry)_: Order. Order. Item one: all this building the new Keeper keeps doing.  
**Frannie Quill**: Fences everywhere. Paths. Lanterns. Something with a drawbridge, apparently.  
**Old Mags**: My cousin tripped over a fence post. A new one.  
**Reggie Thistlewood** _(angry)_: What have the Romans ever done for us?  
_There is a pause. Frannie raises a hand._  
**Frannie Quill**: Reggie. There aren’t any Romans. There’s just the Keeper. They’re sitting right there.  
**Reggie Thistlewood** _(think)_: It’s a figure of speech, Frannie. A very well-known figure of speech.  
**Reggie Thistlewood**: Anyway. If you must build, Keeper, build something USEFUL. The crops are parched and my back is gone from carrying buckets.  

**Choices**

- **Fine. I’ll build an aqueduct.**
    - **Reggie Thistlewood**: A what?
    - **You**: A sort of bridge, for water.
    - **Reggie Thistlewood**: Pfft. Sounds like more building.
- **Can I see the minutes?** — sets `{"q08-read-minutes":true}`
    - The minutes say, in full: “Met. Grumbled. Biscuits.”

#### <a id="q08-water"></a>Done `q08-water`

_The last section clicks into place. Water from the falls slides down the channel, glittering, and spills into the crop beds._  
_The crops do a small, grateful droop-then-perk. Your Nubbins jump about in the overflow._  

### Step 2: Harvest a crop from the aqueduct beds and take it to the committee.

Hint: Ripe crops glow. Tap to harvest, then Give it to Reggie in the Keepers’ Hall. · check: `give:item:crop:reggie`

#### <a id="q08-invite"></a>Scene `q08-invite`

_A note arrives, folded into a very small square._  
_“Emergency meeting. Re: the aqueduct. Bring something from the crops so we can examine it. Reggie.”_  
_Underneath, in different handwriting: “Bring biscuits too. Frannie.”_  
_A second note arrives a minute later: “Ignore the first note. The Committee for Grove Improvement is the only real committee. Breakaways! Mags.”_  
_You were not aware there were two committees. By lunchtime there are three, and nobody is sure who is in the third._  
**You**: Examine it for what?  
_Your Nubbin, dripping from the overflow, has no idea either, and does not mind._  
_The crop beds beside the aqueduct are already plump and shining._  

#### <a id="q08-delivered"></a>Done `q08-delivered`

_Reggie takes the crop, turns it over, sniffs it, and holds it up to the light for a suspiciously long time._  
**Reggie Thistlewood** _(angry)_: Hmm. It’s very good. I hate that it’s very good.  

### Complete

#### <a id="q08-complete"></a>Complete `q08-complete`

**Reggie Thistlewood** _(angry)_: Item one. The aqueduct. All right. Apart from watering the crops, what has the aqueduct done for us?  
**Frannie Quill**: The Nubbins love the spray. They’ve stopped asking me for baths.  
**Old Mags**: The frogs moved in. I like the frogs.  
**Frannie Quill**: It hums at night. Very soothing.  
**Old Mags**: My cousin can’t trip over it. It’s up in the air.  
**Reggie Thistlewood** _(angry)_: Fine. But apart from the crops, the baths, the frogs, the humming and your cousin—  
**Frannie Quill**: It keeps the path cool in summer.  
**Old Mags** _(soft)_: It’s pretty.  
**Frannie Quill**: You’ve filled our teapot from it every morning since Tuesday, Reggie. I married you. I notice things.  
**Reggie Thistlewood** _(sad)_: That was a private teapot.  
**Frannie Quill**: Dear. It’s a municipal aqueduct.  
**Reggie Thistlewood** _(sad)_: …Motion to thank the Keeper. All in favour.  
_Every hand goes up, Reggie’s last and slowly._  
_Frannie pulls out the fourth chair for you. It has had your name on it since item one._  
**Old Mags**: Biscuit?  
_The crops beside the aqueduct will never need watering again._  

**Rewards**

- Aqueduct (feature): A stone channel from the falls to your crop beds. Crops beside it never need watering again.

**Learning Grove swaps**

- `q08-intro#5` → What has all this building ever done for us?
- `q08-intro#7` → Reggie. It’s done quite a lot. You’re sitting on a bench the Keeper built.
- `q08-intro#8` → That is not the point, Frannie. The point is the principle.

**Notes:** The aqueduct is a chain of decor sections that must connect the falls to at least one crop bed; any crop plot touching it is marked permanently watered (dryPerMinute ignored). Add frogs and a soft night-time hum near it as ambient flavour. The committee meets around a table in the Keepers’ Hall; Reggie, Frannie and Old Mags can reuse generic Keeper bodies with new heads. Approved quote ("What have the Romans ever done for us?") used once; swapped in childLines, and the two lines after it are also swapped so the Learning Grove version still makes sense. Old Mags’s speaker id is `old-mags`, kept apart from `mags` (the adult Sunny pack’s Mags) in any shared speaker registry.

## Q9. The Gourd and the Shoe

*Monty Python’s Life of Brian: the crowd of followers* · audience: all · where: The long loop path, on an evening walk · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Barty (The crowd of followers (Monty Python’s Life of Brian)), A Gourd Nubbin (The gourd faction of the followers (Monty Python’s Life of Brian)), A Shoe Nubbin (The shoe faction of the followers (Monty Python’s Life of Brian)), Mother Brindle (Mandy, Brian’s mother (Monty Python’s Life of Brian))

### Step 1: Go back for your shoe.

Hint: You left it by the ditch on the long loop. The crowd will follow you there, whatever you do. · check: `find:item:lost-shoe`

#### <a id="q09-intro"></a>Scene `q09-intro`

_You are halfway round your evening walk when the strap on your bag snaps. A small gourd rolls into the ditch._  
_You bend to fetch it, and your shoe comes off in the mud with a noise like a kiss._  
_You leave them both. It has been a long day. You will come back for them._  
_When you look round, a small crowd of Nubbins has gathered by the gourd and the shoe, very quietly._  
_They look at you. Then they look at each other. Then they start following you, at a respectful distance._  
**Barty** _(shock)_: It is a sign!  
**You**: It’s a gourd. And a shoe.  
**Barty** _(happy)_: It is TWO signs!  

**Choices**

- **Please stop following me.**
    - They stop. Then they all take one step after you, very slowly, in case that doesn’t count.
- **Walk faster.** — sets `{"q09-walked-faster":true}`
    - They walk faster. A little Nubbin at the front carries the gourd above its head like a lantern.

#### <a id="q09-split"></a>Done `q09-split`

_By the time you reach the ditch, the crowd has split in two._  
_Half are bowing to the shoe, which they have set on a rock. The other half are holding up the gourd and humming._  
**A Gourd Nubbin**: The gourd is round, like the sun. Round things are never wrong.  
**A Shoe Nubbin** _(angry)_: The shoe has laces. Nobody understands laces. Follow the laces.  
_A third, much smaller group has gathered round a pebble that was near the shoe. Neither of the other camps will speak to them._  

### Step 2: Settle the argument between the gourd camp and the shoe camp.

Hint: Wear the gourd and the shoe where both camps can see. Tap each in your bag and choose Wear. · check: `wear:item:gourd+lost-shoe`

#### <a id="q09-mother"></a>Scene `q09-mother`

_A Keeper in a headscarf marches up the path, rolling up her sleeves. This is Mother Brindle, Barty’s Keeper, who hatched him. She is not pleased._  
**Mother Brindle** _(angry)_: What’s all this, then? Barty! Is that you at the front?  
**Barty** _(happy)_: Mother! The signs!  
**A Gourd Nubbin**: Barty saw the signs first. Barty is very special.  
**Mother Brindle** _(angry)_: He's not the Messiah. He's a very naughty boy!  
**Barty** _(soft)_: I am a bit naughty.  
**Mother Brindle**: It’s past his bedtime. And yours, all of you.  
**Mother Brindle** _(sad)_: Sort this out, will you? Nobody listens to me. I’m only his mother. Well. I hatched him. Same thing.  

**Choices**

- **Tell them both are signs.** — sets `{"q09-ruling":"both"}`
    - Both camps cheer, then look at each other suspiciously, then cheer again, slightly less.
- **Tell them it’s just things you dropped.** — sets `{"q09-ruling":"neither"}`
    - Nobody believes you. They say only a very special Keeper would say that. Mother Brindle sighs.
- **Tell them to think for themselves.** — sets `{"q09-ruling":"themselves"}`
    - **You**: You don’t need to follow me. Any of you. You can all think for yourselves!
    - The whole crowd nods, together, in perfect time. Then it waits for you to say what to think.
    - **Barty**: What should we think first?
    - Mother Brindle puts her face in her hands.

#### <a id="q09-hats"></a>Done `q09-hats`

_You put the gourd on your head. Then, after a moment’s thought, you balance the shoe on top of the gourd._  
_Both camps gasp. Both camps are right. Nobody can argue with that._  
**Barty** _(happy)_: Follow the Keeper!  

### Complete

#### <a id="q09-complete"></a>Complete `q09-complete`

_The whole crowd falls in behind you in one long, happy, wobbling line._  
_You walk to the pond. They walk to the pond. You turn round. They turn round, and bump into each other._  
_When you finally stop, they stop, sit down and fall asleep in a heap, with Barty on top._  
**Mother Brindle** _(soft)_: Thank you, love. Keep the gourd. And the shoe. I don’t want them in my house; they’ll only start something.  
_From now on, if you call “Follow me”, every Nubbin in the Grove will trail behind you in a parade until you stop._  

#### <a id="q09-complete-themselves"></a>Variant `q09-complete-themselves`

_Variant of `q09-complete`._

_The whole crowd falls in behind you in one long, happy, wobbling line._  
_You walk to the pond. They walk to the pond. You turn round. They turn round, and bump into each other._  
_When you finally stop, they stop, sit down and fall asleep in a heap, with Barty on top._  
_The pebble group sleeps a little apart, on purpose. They have thought for themselves, and they think the heap is too warm._  
**Mother Brindle** _(soft)_: Thank you, love. Keep the gourd. And the shoe. I don’t want them in my house; they’ll only start something.  
_From now on, if you call “Follow me”, every Nubbin in the Grove will trail behind you in a parade until you stop._  

#### <a id="q09-complete-pebble"></a>Variant `q09-complete-pebble`

_Variant of `q09-complete`._

_The whole crowd falls in behind you in one long, happy, wobbling line._  
_You walk to the pond. They walk to the pond. You turn round. They turn round, and bump into each other._  
_When you finally stop, they stop, sit down and fall asleep in a heap, with Barty on top._  
_The pebble group sleeps at the edge, still holding its pebble. Nobody has asked it anything. It is perfectly happy._  
**Mother Brindle** _(soft)_: Thank you, love. Keep the gourd. And the shoe. I don’t want them in my house; they’ll only start something.  
_From now on, if you call “Follow me”, every Nubbin in the Grove will trail behind you in a parade until you stop._  

**Rewards**

- Gourd Hat (cosmetic): A small, round, faintly important-looking gourd. Worn on the head.
- Shoe Hat (cosmetic): Your old muddy shoe, worn proudly on top of your head. Stacks on the Gourd Hat.
- Follow Me (feature): A new call: every Nubbin in the Grove falls in behind you in a parade until you stand still.

**Learning Grove swaps**

- `q09-mother#4` → He’s not a leader. He’s a little scamp who should be in bed!

**Notes:** The quest triggers on a walk along the long loop: play the drop and the lost shoe as a short cut-in, then hide the player’s shoe (one bare foot until step 2, purely cosmetic). The crowd is 6–10 wild Nubbins who trail the player at a distance and split into two groups at the ditch, each with its own idle: bowing (shoe) and humming (gourd). Barty is a small Nubbin who always walks at the front. "Follow me" is a new call on the whistle or call button; the parade ends when the Keeper stands still for two seconds, and Nubbins then sit and nap in a heap. Keep everything gentle and non-religious beyond the one approved quote, used once and swapped in childLines.

## Q10. Haggle

*Monty Python’s Life of Brian: haggling at the market* · audience: all · where: A new stall by the market path · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Harrow Tuppence (Harry the haggler (Monty Python’s Life of Brian))

### Step 1: Offer Harrow less than he is asking for the brass bell.

Hint: Tap the bell and choose Haggle instead of Buy. Start low. Lower than feels polite. · check: `shop:offer:harrow:below-asking`

#### <a id="q10-intro"></a>Scene `q10-intro`

_There is a new stall by the market path, piled with odds and ends. Behind it sits a Keeper with a pencil behind each ear._  
**Harrow Tuppence** _(happy)_: Morning! Harrow Tuppence. Everything a Grove could want, and several things it couldn’t.  
_You spot a little brass bell. Your Nubbin spots it too and makes a small, longing noise._  
**You**: How much is the bell?  
**Harrow Tuppence**: Twenty Shells.  
_You count out twenty Shells and hold them out._  
_Harrow stares at the Shells. Then at you. His face falls by about a mile._  
**Harrow Tuppence** _(shock)_: Twenty? Just like that? You’re not even going to try?  
**Harrow Tuppence** _(angry)_: Put those away. I can’t take that. It’s insulting. To both of us. To the bell.  

**Choices**

- **Sorry. How does this work?**
    - **Harrow Tuppence**: You say a number. I say a bigger number. We weep. We meet in the middle. We shake. It’s beautiful.
- **Twenty is what the tag says.** — sets `{"q10-stubborn":true}`
    - **Harrow Tuppence**: The tag is the OPENING. Nobody listens to the tag. The tag is a cry for help.

#### <a id="q10-first-offer"></a>Done `q10-first-offer`

**You**: …Eight Shells?  
**Harrow Tuppence** _(shock)_: EIGHT?  
_He clutches the stall. He clutches his heart. He clutches the bell, protectively._  
**Harrow Tuppence** _(happy)_: Now we’re talking. Oh, that’s lovely. Do go on.  

### Step 2: Haggle with Harrow through three full rounds.

Hint: Each round, offer something between your last number and his. Agree too fast and he starts again. · check: `minigame:haggle:harrow:3-rounds`

#### <a id="q10-rounds"></a>Scene `q10-rounds`

**Harrow Tuppence** _(think)_: Right. Proper rules. Three rounds. I go down, you go up, and we both pretend to leave at least once.  
**Harrow Tuppence**: Don’t meet me too quick, that’s rude. Don’t hold out too long, that’s also rude. Somewhere in between is an art.  
_Your Nubbin climbs onto the counter to watch. This is clearly the best thing that has ever happened in a shop._  
**Harrow Tuppence**: Twenty. For you. Because I like your face.  
**You**: Ten.  
**Harrow Tuppence** _(angry)_: Ten? For a BELL? It rings in two keys, you know. Eighteen.  

**Choices**

- **Pretend to walk away.** — sets `{"q10-walked-off":true}`
    - You get three steps. Harrow calls out “Sixteen!” in a voice of real anguish.
- **Admire the bell, then go lower.**
    - **Harrow Tuppence**: Flattery AND a low offer. Who taught you that? Me. I did. Just now.

#### <a id="q10-deal"></a>Done `q10-deal`

**Harrow Tuppence** _(sad)_: Fourteen. My final offer. I’ll be ruined. My children will eat gravel.  
**You**: You don’t have children.  
**Harrow Tuppence** _(happy)_: Fourteen, then, and nobody eats gravel.  
_You shake on it. Harrow’s eyes are a little wet. He says it’s the wind._  

### Complete

#### <a id="q10-complete"></a>Complete `q10-complete`

_You hand over fourteen Shells. Harrow counts them twice, tenderly, like a man counting doves._  
**Harrow Tuppence** _(happy)_: That, Keeper, was a proper bit of business. Best I’ve had all week. Only one I’ve had all week.  
_He presses a small gourd into your hands as well. “Free. Nobody haggles over a gourd. Dreadful things, gourds.”_  
_Your Nubbin rings the brass bell. It does, in fact, ring in two keys._  
**Harrow Tuppence** _(think)_: Tell you what. I’ve had a word with the shop. You can haggle there too, now. Anything you buy.  
**Harrow Tuppence**: They won’t go lower than a fifth off. And you have to mean it. Shopkeepers can tell.  
_From now on, any purchase in the shop can start with a bit of haggling, for up to 20% off._  

**Choices**

- **Slip him the six Shells you saved.** — sets `{"q10-tipped":true}`
    - **Harrow Tuppence**: Don’t you DARE.
    - **Harrow Tuppence**: A deal’s a deal. Pay twenty now and the whole morning meant nothing. Put it away.
    - You put it away. He looks, for some reason, enormously proud of you.
- **Shake on it again, for luck.**
    - You offer your hand. He haggles you down to a slightly shorter handshake, and looks delighted.

**Rewards**

- Haggling (feature): An optional Haggle option on any shop purchase: three rounds of back-and-forth that can take up to 20% off.

**Notes:** No source quotes; all lines are new. The brass bell is an ordinary purchase (14 Shells, not a reward); if the player has fewer than 8 Shells, Harrow says he will hold it for them and the quest waits. Haggle minigame: three rounds, each a slider between the last two numbers; accepting his first price restarts the round with a wounded line. The same three-round mini-dialogue then becomes optional on every shop purchase, with the best result capped at 20% off and a small cooldown per item so it cannot be farmed.

## Q11. Wafer-Thin

*Monty Python’s The Meaning of Life: the wafer-thin mint* · audience: all · where: The bathhouse · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Gorbold (Mr Creosote (Monty Python’s The Meaning of Life)), Mr Crisp (The maître d’ (Monty Python’s The Meaning of Life))

### Step 1: Pick fresh mint for Mr Crisp.

Hint: Mint grows in a small patch by the pond. Tap the top leaves, then Give them to Mr Crisp. · check: `give:item:mint-leaves:mr-crisp`

#### <a id="q11-intro"></a>Scene `q11-intro`

_At the bathhouse, the steam is thick and the snack table is empty. Very, very empty._  
_In the middle of the warm pool floats a Nubbin so round it has stopped needing to swim. It simply bobs._  
_This is Gorbold. Around it float a great many fruit stones, a crust, and one sad lettuce leaf._  
**Gorbold** _(happy)_: More.  
_A Keeper in a crisp white apron appears at your elbow, with a silver tray and a cloth over one arm._  
**Mr Crisp** _(think)_: Good afternoon. Mr Crisp, head of refreshments. Gorbold has eaten the menu. Not the food on it. The menu.  
**Mr Crisp**: Before that, the fruit. Then the fruit bowl. Then the little table the bowl was on, and a decorative fern.  
**Mr Crisp**: I have one thing left to serve, and I cannot make it without fresh mint. Might you fetch some?  
**You**: Is that wise? It looks very full.  
**Mr Crisp** _(happy)_: It is a VERY small thing.  

**Choices**

- **I’ll fetch the mint.**
    - **Mr Crisp**: Splendid. The patch by the pond. Only the top leaves, please. I am particular.
- **Ask Gorbold if that’s all right.** — sets `{"q11-asked-gorbold":true}`
    - **Gorbold**: More.
    - That seems to be a yes.

#### <a id="q11-mint"></a>Done `q11-mint`

**Mr Crisp** _(happy)_: Perfect. Give me one moment.  
_He vanishes into the steam. There is a sound of very fine slicing._  

### Step 2: Stay and watch Gorbold take the last slice.

Hint: Stay in the bathhouse. If you leave, Gorbold waits politely for you to come back. · check: `watch:gorbold:wafer-slice`

#### <a id="q11-slice"></a>Scene `q11-slice`

_Mr Crisp returns. On the silver tray lies one slice of minty something, so thin you could read through it._  
**Mr Crisp** _(soft)_: For you, sir. One more slice. Just a sliver.  
**Gorbold** _(sad)_: Full.  
**Mr Crisp**: It's only wafer-thin.  
_Gorbold considers the slice. It considers you. You consider the exits._  
_Mr Crisp holds out the tray. The steam goes very still._  

**Choices**

- **Go on. It is very thin.** — sets `{"q11-nudged":true}`
    - **Gorbold**: …Fine.
- **Take a big step back.** — sets `{"q11-stepped-back":true}`
    - Mr Crisp, without looking, takes a big step back too. He has done this before.

#### <a id="q11-pop"></a>Done `q11-pop`

_Gorbold eats the slice. There is a pause, a small hiccup, and then a soft POP._  
_A great cloud of glittering confetti fills the bathhouse and settles gently on the water._  
_When it clears, Gorbold is bobbing in the pool, normal-sized, blinking, and looking extremely pleased._  
**Gorbold** _(happy)_: Light!  

### Complete

#### <a id="q11-complete"></a>Complete `q11-complete`

**Mr Crisp** _(happy)_: Ah. The usual outcome. Lovely.  
_Mr Crisp produces a little broom and sweeps the confetti into a perfect pile without a speck landing on his apron._  
**Mr Crisp**: For your trouble. My own recipe.  
_He hands you a paper packet of wafer-thin slices, and a napkin bib with a tiny embroidered mint leaf._  
**Mr Crisp** _(think)_: One slice fills a Nubbin to exactly full. Never over. I have had quite enough of over for one day.  
**Gorbold** _(happy)_: More?  
**Mr Crisp**: No.  
_Gorbold bobs over to your Nubbin and nudges a single fruit stone across the water towards it._  
**Gorbold** _(soft)_: Yours.  
_Mr Crisp stops sweeping. In eleven years he has never once seen Gorbold give anything away._  

**Rewards**

- Wafer-Thin Slice (item): A minty slice so thin you can read through it. Fills a Nubbin’s hunger to exactly full, never over.
- Napkin Bib (cosmetic): A crisp white bib with a tiny embroidered mint leaf. For Keepers or Nubbins.

**Learning Grove swaps**

- `q11-slice#3` → Only a sliver. You will hardly notice it.

**Notes:** Keep this entirely gentle: Gorbold is round and bobbing, never sick, and the pop is a soft sound with glitter confetti, no mess, no splatter. Afterwards Gorbold is a normal-sized Nubbin who lives at the bathhouse and says "More?" when tapped. The wafer-thin slice is a restockable item (the shop sells it after this quest) that sets hunger to exactly 1.0 and never overfeeds. Mint is a new pickable plant by the pond. Approved quote "It's only wafer-thin." used once; swapped in childLines. q11-asked-gorbold is flavour: "More." as a yes is the joke.

## Q12. Just Resting

*Monty Python’s Flying Circus: the Dead Parrot* · audience: all · where: Your nest, when a parcel from the shop arrives · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11), once you have bought anything from the shop

**Cast:** Mr Fenwick Mull (The pet shop owner in the Dead Parrot sketch (Monty Python’s Flying Circus))

### Step 1: Collect three pieces of evidence that the shop’s Nubbin isn’t real.

Hint: Try feeding it, tickling it, and putting it in the pond. Watch carefully each time. · check: `collect:evidence:plush-nubbin:3`

#### <a id="q12-intro"></a>Scene `q12-intro`

_A parcel arrives from the shop. Inside, in a nest of wood shavings, lies a Nubbin._  
_The note says: “One (1) Nubbin, quiet breed. Hand-raised. Do not overfeed.”_  
_Your Nubbins crowd round and poke it. It does not move. It does not blink. One of its eyes is a button._  
_You take it back to the shop. Mr Fenwick Mull is polishing the counter, which is already very shiny._  
**You**: This Nubbin you sent me doesn’t move.  
**Mr Fenwick Mull** _(think)_: Ah, no. That’s normal, for that breed.  
**Mr Fenwick Mull**: It's resting.  
**You**: It has a seam down its back.  
**Mr Fenwick Mull** _(happy)_: Lovely stitching, isn’t it? Hand-done. Very rare.  

**Choices**

- **I want my Shells back.**
    - **Mr Fenwick Mull**: A refund? We don’t do refunds. Never needed to. Nothing has ever gone wrong.
- **Then I’ll wait for it to wake up.** — sets `{"q12-waited":true}`
    - You wait. Mr Fenwick Mull waits. The Nubbin waits harder than either of you.

#### <a id="q12-evidence"></a>Done `q12-evidence`

_Evidence one: you offer it a heart fruit. It does not eat it. No Nubbin has ever turned down a heart fruit._  
_Evidence two: you tickle its feet. Nothing. Your own Nubbin, watching, falls over giggling on its behalf._  
_Evidence three: you set it in the pond. It floats face down, with great calm, and a price tag bobs up beside it._  

### Step 2: Win the argument with Mr Fenwick Mull.

Hint: Present all three pieces of evidence at the counter, then hold your ground. · check: `talk:fenwick:evidence-3`

#### <a id="q12-argument"></a>Scene `q12-argument`

_Back at the shop, you lay out the evidence on the shiny counter: one uneaten heart fruit, one damp Nubbin, one price tag._  
**Mr Fenwick Mull** _(think)_: Well. That’s shyness. Shy breed. It didn’t want to eat in front of you.  
**You**: It didn’t laugh when I tickled it.  
**Mr Fenwick Mull**: Tired from the journey. Long way from the warehouse. Er. The nest. The wild nest.  
**You**: It floated face down in the pond.  
**Mr Fenwick Mull** _(happy)_: Loves a swim. Very relaxed swimmer. Floats like a lily.  
_He gives the plush an encouraging pat. It topples slowly sideways off the counter._  
**Mr Fenwick Mull** _(sad)_: Pining. Misses its nest. They pine, this breed. Terribly sensitive.  
_You pick up the price tag and hold it in front of his nose._  
**You**: This is an ex-parrot.  
**Mr Fenwick Mull**: That isn’t a parrot.  
**You**: I know. I panicked. My point stands.  

**Choices**

- **Say nothing. Hold the stare.** — sets `{"q12-stared":true}`
    - You hold the stare. He holds it back. Somewhere a clock ticks. He blinks first.
- **Read the price tag aloud.**
    - **You**: “Plush toy. Stuffed. Not alive. Made with love.”
    - **Mr Fenwick Mull**: …Made with love, though.
- **Then I’ll have a replacement.** — sets `{"q12-brother":true}`
    - **Mr Fenwick Mull**: Out of stock, sadly. But my brother has a shop over the ridge. Lovely man. Completely different.
    - You walk over the ridge. The shop is identical. Behind the counter, in a false moustache, stands Mr Fenwick Mull.
    - **Mr Fenwick Mull**: Fenwick’s brother. Never met him.
    - The moustache falls off. He puts it back on, slightly higher. You walk back over the ridge together, in silence.

#### <a id="q12-crack"></a>Done `q12-crack`

**Mr Fenwick Mull** _(sad)_: All right. ALL RIGHT. It’s a toy. It’s always been a toy. I was told it was a Nubbin by a man who sold toys.  
**Mr Fenwick Mull**: I’ll give you your Shells back. I’ll even open a returns counter. First one in the valley.  

### Complete

#### <a id="q12-complete"></a>Complete `q12-complete`

_Mr Fenwick Mull counts your Shells back into your hand. He looks lighter for it, somehow._  
**Mr Fenwick Mull** _(soft)_: Keep the toy, though. No charge. It’s grown on me. In a way that isn’t growing.  
_You carry it home. Your Nubbins take it straight to the nest and pile round it._  
_By evening they are fast asleep, cuddled up to the plush Nubbin, who is having a genuinely lovely rest._  
_From now on the shop takes things back within a day. You needn’t explain, though Mr Fenwick Mull will ask, hopefully._  

**Rewards**

- Plush Nubbin (decor): A stuffed toy Nubbin with one button eye. Your Nubbins cuddle it when they nap nearby.
- Refunds (feature): The shop now takes back items you have bought, for a full refund, if you return them within a day.

**Learning Grove swaps**

- `q12-intro#6` → It’s having a little nap.
- `q12-argument#9` → This toy has never been a Nubbin. Not once.
- `q12-argument#10` → “Never” is a very strong word.
- `q12-argument#11` → It’s the right word. My point stands.

**Notes:** The parcel arrives at the nest with a delivery jingle; the plush uses a Nubbin model with a stitched seam and one button eye, no animation at all. Evidence is gathered by three interactions with the plush (Feed, Tickle/Pet, drop in pond); each adds an evidence icon to the quest card, in any order. The price tag is a small floating prop. Refunds: a Return option in the shop for items bought within one in-game day, full price back. Approved quotes "It's resting." and "This is an ex-parrot." each used once; swapped in childLines, along with the two lines after the second quote so the Learning Grove version still reads properly. q12-stared is flavour: the stare is the joke.

## Q13. Ministry of Silly Walks

*Monty Python’s Flying Circus: the Ministry of Silly Walks* · audience: all · where: A small wooden booth at the crossroads · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Mr Hollis Strutt (The Minister of Silly Walks (Monty Python’s Flying Circus))

### Step 1: Show Mr Strutt a walk of your own.

Hint: Tap a pattern of moves on the pad (up, down, left, right, spin), then press Walk. · check: `minigame:silly-walk:any`

#### <a id="q13-intro"></a>Scene `q13-intro`

_A small wooden booth has appeared at the crossroads. The sign reads: GRANTS FOR WALKS (VERY SILLY ONLY)._  
_Behind the counter sits a tall Keeper in a bowler hat, stamping forms. He stamps each one twice, for luck._  
**Mr Hollis Strutt** _(think)_: Good morning. Hollis Strutt. I fund silly walks. Development, research, outreach.  
**Mr Hollis Strutt** _(sad)_: Most walks in this valley are dreadfully sensible. It keeps me up at night.  
_He shows you his own walk to the filing cabinet. It takes four minutes and involves a sort of kick, a sort of sit, and a sort of question mark._  
**Mr Hollis Strutt**: Now. Show me yours. Use the pad. Make up a pattern. Surprise me.  

**Choices**

- **I’m not sure I have one.**
    - **Mr Hollis Strutt**: Everyone has one. Most people keep it hidden. Such a waste.
- **I’ve been practising.** — sets `{"q13-practised":true}`
    - **Mr Hollis Strutt**: Marvellous. Don’t tell me. Show me.

#### <a id="q13-first"></a>Done `q13-first`

_You perform your walk. It has a hop in it. You are quite proud of the hop._  
_Mr Strutt watches over steepled fingers. He makes a single note. It is a small note._  
**Mr Hollis Strutt**: It's not particularly silly, is it?  
**Mr Hollis Strutt** _(sad)_: The hop is fine. The hop is a start. But the rest of you was just walking. With a hop on top.  

### Step 2: Show Mr Strutt a properly silly walk.

Hint: Longer patterns score higher. Mix in spins, backward steps and pauses; the same move twice in a row counts less. · check: `minigame:silly-walk:score:silly`

#### <a id="q13-notes"></a>Scene `q13-notes`

**Mr Hollis Strutt** _(think)_: Let me give you some notes.  
**Mr Hollis Strutt**: Use more knee. Knees are underused in this valley. Then do something with your elbows that nobody asked for.  
**Mr Hollis Strutt**: And at least once, go backwards for no reason, and look as if there was a reason.  
**Mr Hollis Strutt** _(sad)_: This year the Ministry of Sensible Paths got forty times our budget. Forty. For gravel.  
_Your Nubbin has been watching all this. It tries the walk itself, falls over, and carries on lying down._  
**Mr Hollis Strutt** _(happy)_: Now THAT is promising. Take notes from your Nubbin.  
_He slides a fresh form across the counter. It already has two stamps on it, for luck._  

**Choices**

- **Copy your Nubbin.** — sets `{"q13-copied-nubbin":true}`
    - You try walking lying down. It does not work, but it is very silly.
- **Make it your own.**
    - **Mr Hollis Strutt**: Bold. Original. I am already reaching for the stamp.

#### <a id="q13-approved"></a>Done `q13-approved`

_You walk. You hop, crouch, spin, go backwards with conviction, and finish with the elbows._  
_Mr Strutt rises slowly to his feet. He removes his bowler hat and presses it to his chest._  
**Mr Hollis Strutt** _(happy)_: That is the silliest thing I have seen since Tuesday. Approved.  

### Complete

#### <a id="q13-complete"></a>Complete `q13-complete`

_He stamps your form twice. Then a third time. He has never stamped a third time before._  
**Mr Hollis Strutt** _(happy)_: Your grant is approved. Use it well. Walk silly, often, and in public.  
_He hands you a spare bowler hat from under the counter. It is slightly too big and absolutely perfect._  
**Mr Hollis Strutt**: You may switch the walk on and off as you please. I would leave it on. But then I would.  
**Mr Hollis Strutt** _(soft)_: Between you and me, nobody needs a grant to be silly. But people do seem to want a form that says they may.  
_Your Keeper can now walk silly whenever you like. Toggle it in the settings._  

**Rewards**

- Silly Walk (feature): A silly-walk gait for your Keeper, built from the pattern you showed Mr Strutt. Switch it on and off in settings.
- Bowler Hat (cosmetic): A slightly-too-big bowler hat, as worn by the valley’s only funder of silly walks.

**Learning Grove swaps**

- `q13-first#2` → Hmm. That’s rather ordinary, isn’t it?

**Notes:** The pad accepts up to 12 moves (up, down, left, right, spin, pause) on keys or joystick; the first attempt always gets the "not silly" response, whatever the score. Scoring for step 2: length, variety, backwards steps and pauses add; repeats subtract; "silly" is any score above a modest threshold so nobody gets stuck. The winning pattern is saved and becomes the Keeper’s silly-walk gait (procedural: legs and elbows follow the pattern loop). Mr Strutt’s own walk to the cabinet is a long, unhurried animation. Approved quote "It's not particularly silly, is it?" used once; swapped in childLines.

## Q14. The Comfy Chair

*Monty Python’s Flying Circus: the Spanish Inquisition* · audience: all · where: Your nest; they burst in through the gate · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11), when at least one Nubbin is tired

**Cast:** Brother Pouffe (Cardinal Ximénez (The Spanish Inquisition, Monty Python’s Flying Circus)), Brother Bolster (Cardinal Biggles (The Spanish Inquisition, Monty Python’s Flying Circus)), Sister Tuft (Cardinal Fang (The Spanish Inquisition, Monty Python’s Flying Circus))

### Step 1: Fetch the comfy chair from the Workshop.

Hint: It is the big red armchair by the Workshop door. Pick it up and carry it to the nest. · check: `carry:decor:comfy-chair:nest`

#### <a id="q14-intro"></a>Scene `q14-intro`

_You are quietly brushing a Nubbin by the nest when the gate bangs open._  
_Three Keepers in long red robes sweep in. One trips on the step. They sweep in again, more carefully._  
**Brother Pouffe** _(angry)_: Nobody expects the Spanish Inquisition!  
_There is a long silence. Your Nubbin, mid-brush, stares at them._  
**You**: We… really didn’t.  
**Brother Pouffe** _(happy)_: Precisely! Surprise is our main tool. Surprise and cushions. Our two tools are surprise, cushions—  
**Brother Bolster**: And blankets.  
**Brother Pouffe** _(think)_: Our THREE tools are… no. Hang on. We shall go out and come in again.  
_They go out. The gate bangs open. They sweep in, nobody trips, and Brother Bolster raises two plump cushions, menacingly._  
**Brother Bolster** _(think)_: Soft. Very soft. You have been warned.  
**Brother Pouffe**: Your Nubbins look tired. Overworked. Under-napped. We shall see to that. Sister Tuft!  
**Brother Pouffe** _(angry)_: Fetch… the comfy chair!  
**Sister Tuft** _(sad)_: We left it at your Workshop. Brother Pouffe said he’d carry it.  
**Brother Pouffe** _(sad)_: …Keeper. Would you be so good as to fetch the comfy chair?  

**Choices**

- **Fine. I’ll fetch it.**
    - **Brother Pouffe**: Splendid. We shall wait here, being terrifying.
- **Can I hold a cushion?** — sets `{"q14-held-cushion":true}`
    - **Brother Bolster**: …Just for a minute.
    - It is extremely soft. You can see why he is proud of it.

#### <a id="q14-chair"></a>Done `q14-chair`

_You set the chair down by the nest. It is deep, red and squashy, with a fringe round the bottom._  
**Sister Tuft** _(happy)_: Behold. The comfy chair.  
_Brother Pouffe cracks his knuckles. Brother Bolster raises the cushions. Sister Tuft fluffs the chair, twice._  

### Step 2: Put your most tired Nubbin in the comfy chair.

Hint: Tiredness shows on a Nubbin’s status card. Pick up the sleepiest one and drop it on the chair. · check: `place:nubbin:comfy-chair:tired`

#### <a id="q14-sentence"></a>Scene `q14-sentence`

**Brother Pouffe** _(angry)_: Now. Bring us your most tired Nubbin.  
**Brother Pouffe**: It shall sit in the comfy chair until lunchtime. With a cushion behind it. And another cushion. Beside.  
**Brother Bolster** _(think)_: And a blanket over its knees. A woolly one.  
**Sister Tuft**: And no getting up. Not even for a snack.  
**Brother Pouffe**: Unless it is a very small snack.  
_They exchange grim nods. They have done this many times, and it always goes exactly to plan._  

**Choices**

- **Bring the sleepiest Nubbin.**
    - Your sleepiest Nubbin yawns so wide it nearly falls into itself.
- **Offer to sit in the chair yourself.** — sets `{"q14-volunteered":true}`
    - **Brother Pouffe**: Ha! Keepers are not under investigation today. Bring us a Nubbin.

#### <a id="q14-asleep"></a>Done `q14-asleep`

_The Nubbin sinks into the chair. Bolster tucks in a cushion. Tuft lays a blanket over its knees._  
_It is asleep before the blanket lands. It snores very softly, like a kettle thinking about it._  

### Complete

#### <a id="q14-complete"></a>Complete `q14-complete`

_Two hours later, the Nubbin wakes. It stretches. It glows. It looks as if it has slept for a week._  
**Brother Pouffe** _(happy)_: Ha! Look at it. Utterly refreshed. Our work here is done.  
**Brother Bolster** _(soft)_: Best nap we have ever given. Possibly the best nap anyone has ever had.  
**Sister Tuft**: We should go. We have three more Groves to burst into before tea.  
_They sweep out. One trips on the step. Then they sweep back in, because they forgot the chair._  
**Brother Pouffe** _(think)_: Keep it. We have another. We have a whole room of them.  
**Brother Pouffe** _(think)_: One last question, Keeper. When did YOU last sit down?  
_From now on, a tired Nubbin on the comfy chair naps back to full twice as fast._  

**Choices**

- **Sit in the chair, just for a minute.** — sets `{"q14-keeper-napped":true}`
    - You sit. Sister Tuft tucks a blanket over your knees. You wake an hour later with a cushion on your face and no idea what day it is.
    - **Brother Pouffe**: Ha! Another one broken. Our work is never done.
- **No time. There’s too much to do.**
    - **Sister Tuft**: That is what they all say.
    - **Brother Pouffe**: Keep the chair, then. It will wait for you. Chairs are very good at waiting.

**Rewards**

- The Comfy Chair (decor): A deep, red, squashy armchair with a fringe. Tired Nubbins who nap on it recover twice as fast.

**Learning Grove swaps**

- `q14-intro#2` → Nobody expects the Nap Patrol!
- `q14-intro#11` → Bring… the comfy chair!

**Notes:** A dramatic entrance: a sting chord as the gate bangs open, cut short when one of them trips, then replayed. The red robes are plain and cosy, with no religious symbols. The chair appears outside the Workshop when the quest starts. The "two hours later" in the complete scene is a quick fade, not real time. Nap rate on the chair: double the normal tiredness recovery while asleep on it. Approved quotes "Nobody expects the Spanish Inquisition!" and "Fetch… the comfy chair!" each used once; both swapped in childLines. The re-entrance in the intro replays the gate bang and sting, this time without the trip. The complete-scene choice to sit sets q14-keeper-napped (a quick fade, cosmetic).

## Q15. The Fruitless Fruit Stall

*Monty Python’s Flying Circus: the Cheese Shop* · audience: all · where: A smart green stall by the bridge · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Mr Pomeroy Dibble (The owner of the Cheese Shop (Monty Python’s Flying Circus))

### Step 1: Ask Mr Dibble for six different fruits.

Hint: Pick a fruit from the order list at the stall. Each fruit counts once. · check: `ask:dibble:fruit:6`

#### <a id="q15-intro"></a>Scene `q15-intro`

_A smart green stall has opened by the bridge. The sign says DIBBLE’S: EVERY FRUIT IN THE VALLEY, AND THEN SOME._  
_Behind it stands Mr Pomeroy Dibble, in a striped apron and a straw boater, beaming._  
**Mr Pomeroy Dibble** _(happy)_: Good morning! Whatever fruit you fancy, we have it. Every fruit in the valley. Possibly more.  
_The crates behind him are covered with cloths. Neat, clean, suspiciously flat cloths._  
**You**: A run fruit, please.  
**Mr Pomeroy Dibble** _(sad)_: Ah. Run fruit. Just out, I’m afraid. There was a rush on them. They ran.  
**You**: A swim fruit, then.  
**Mr Pomeroy Dibble**: Swim fruit! Normally, yes. Today, sadly, the delivery Nubbin went for a swim, and so did the fruit.  

**Choices**

- **Keep asking politely.**
    - **Mr Pomeroy Dibble**: Please do! Asking is half the fun. For me.
- **Lift a cloth.** — sets `{"q15-peeked":true}`
    - Mr Dibble lowers the cloth again, gently, with one finger.
    - **Mr Pomeroy Dibble**: Let’s not spoil the surprise.

#### <a id="q15-six"></a>Done `q15-six`

**You**: Fly fruit?  
**Mr Pomeroy Dibble**: Flew.  
**You**: Power fruit? Stamina fruit? Sun fruit?  
**Mr Pomeroy Dibble** _(sad)_: Lifted, by a strong Nubbin. Eaten, by a tired one. And the sun fruit set. They do that.  

### Step 2: Keep asking until you have tried all twelve fruits.

Hint: Keep choosing from the order list. Something gives at twelve. · check: `ask:dibble:fruit:12`

#### <a id="q15-twelve"></a>Scene `q15-twelve`

_You keep going. Mr Dibble keeps smiling. It is a smile that has had a great deal of practice._  
_Somewhere behind the stall, a Nubbin is plucking a tiny mandolin. Slowly. The same three notes._  
**You**: Moon fruit?  
**Mr Pomeroy Dibble**: Only at night. And at night I’m closed.  
**You**: Heart fruit?  
**Mr Pomeroy Dibble** _(soft)_: A Nubbin looked at it with such love that I hadn’t the heart. Gave it away.  
**You**: A coconut. Just one coconut.  
**Mr Pomeroy Dibble** _(think)_: There is one palm in the whole valley, and frankly it has had a difficult week.  
**You**: Could the music stop?  
**Mr Pomeroy Dibble** _(shock)_: Stop? It’s the atmosphere.  
_The Nubbin plays the three notes again, more slowly, out of spite._  

#### <a id="q15-confess"></a>Done `q15-confess`

_By the twelfth fruit, Mr Dibble has stopped smiling. He takes off his boater and holds it in both hands._  
**Mr Pomeroy Dibble** _(sad)_: I have a confession. There has never been any fruit. Not a single pip. I just liked the stall.  
**You**: Not much of a cheese shop, is it?  
**Mr Pomeroy Dibble**: It’s a fruit stall.  
**You**: Not much of one of those, either.  

**Choices**

- **Let’s stock it. With real fruit.** — sets `{"q15-stocked":true}`
    - **Mr Pomeroy Dibble**: Real fruit? But then people would buy it. And then it would be gone.
    - **Mr Pomeroy Dibble**: …I’ll put out one run fruit. On a cushion. Facing the wall, so it doesn’t get ideas.
- **Don’t change a thing.** — sets `{"q15-stocked":false}`
    - **Mr Pomeroy Dibble**: Really? You don’t mind?
    - **You**: It’s the friendliest stall in the valley. It just isn’t a shop.
    - **Mr Pomeroy Dibble**: That is the nicest thing anyone has ever said to me over an empty crate.

### Complete

#### <a id="q15-complete"></a>Complete `q15-complete`

**Mr Pomeroy Dibble** _(think)_: You’re right. You’re quite right. But I’ll tell you what I do have. Knowledge.  
_From under the counter he brings out a thick, beautifully drawn page: every fruit in the valley, with notes on each._  
**Mr Pomeroy Dibble**: Where it grows. What it does. Which Nubbins like it best. I know everything about fruit except where to get any.  
_He slips it into your Collection book. It fits perfectly, as if there was always a gap for it._  
**Mr Pomeroy Dibble** _(soft)_: And the boater. Take it. It belongs on someone with fruit.  
_As you leave, you hear him greet the next customer with great cheer: “Just out, I’m afraid!”_  

**Rewards**

- Fruit Catalogue (feature): A new page in your Collection book listing every fruit in the valley, where it grows and what it does.
- Straw Boater (cosmetic): Mr Dibble’s straw boater, with a striped band. Belongs on someone with fruit.

**Learning Grove swaps**

- `q15-confess#2` → Not much of a fruit stall, is it?
- `q15-confess#3` → It’s a very good stall. It just hasn’t got any fruit.
- `q15-confess#4` → That is the main thing a fruit stall needs.

**Notes:** The order list offers twelve fruits: run, swim, fly, power, stamina, sun, moon, heart, coconut, and three more of the implementer’s choice from the crop list. Each one gets a one-line excuse from Mr Dibble (write the remaining excuses in the same deadpan style: the fruit always did the thing its name suggests). Step 1 completes at six asked, step 2 at twelve, in any order. The catalogue page fills in automatically and updates as new fruits are added. Approved quote "Not much of a cheese shop, is it?" used once; swapped in childLines, along with the two lines after it.

## Q16. The Argument Booth

*Monty Python’s Flying Circus: the Argument Clinic* · audience: all · where: Byte’s booth outside the Workshop · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Byte, Pixel

### Step 1: Pay Byte 5 Shells for an argument.

Hint: Tap Byte’s booth and choose Pay. You need 5 Shells. · check: `pay:shells:5:byte`

#### <a id="q16-intro"></a>Scene `q16-intro`

_Byte has set up a booth outside the Workshop. The sign says: ARGUMENTS. 5 SHELLS. ONE MINUTE EXACTLY._  
_There is a sand timer on the counter. Byte is looking at it the way other people look at cake._  
_Next to it stands a smaller booth marked COMPLAINTS. It is also Byte, in a different hat._  
**Byte** _(think)_: Good afternoon. Would you like an argument?  
**You**: What sort of argument?  
**Byte**: The best sort. A structured exchange of reasoned positions, timed for fairness.  
**Byte**: It is five Shells. Please pay first. I find arguments about payment unpleasant.  

**Choices**

- **Pay the five Shells.**
    - **Byte**: Thank you. Your minute begins when you sit down.
- **Four Shells?** — sets `{"q16-haggled":true}`
    - **Byte**: No. That one was free. Please do not do it again.

#### <a id="q16-flip"></a>Done `q16-flip`

_Byte turns the sand timer over with great ceremony. The sand begins to run._  
**Byte**: Your minute has begun. Please begin.  

### Step 2: Win the argument before the sand runs out.

Hint: Pick your replies carefully. Arguing back only feeds him; point out what he is actually doing. · check: `minigame:argue:byte:win`

#### <a id="q16-minute"></a>Scene `q16-minute`

**You**: Your booth is very nice.  
**Byte**: Disagree.  
**You**: It’s a lovely day for it.  
**Byte**: False. It is a mediocre day.  
**You**: It’s sunny. There’s a rainbow.  
**Byte** _(think)_: That is a smudge.  
_Your Nubbin, on the stool beside you, looks from Byte to the window, then back to Byte._  
**You**: You’re just disagreeing with everything I say.  
**Byte**: Incorrect.  
_The sand is half gone._  

**Choices**

- **Agree with Byte, to see what happens.** — sets `{"q16-agreed":true}`
    - **You**: You’re right. It’s a smudge.
    - **Byte**: It is clearly a rainbow.
- **Take a breath.**
    - You take a breath. Byte takes one too, in case that was a point.

#### <a id="q16-win"></a>Done `q16-win`

**You**: This isn't an argument.  
**Byte**: It is.  
**You**: An argument isn't just contradiction.  
_Byte opens his mouth to disagree. Then he stops, and looks at the sand timer for help._  
**Byte** _(shock)_: …That is a fair point.  

**Choices**

- **Take it up with Complaints.** — sets `{"q16-complained":true}`
    - You step next door. Byte swaps hats and steps next door too.
    - **Byte**: Complaints. Go on.
    - **You**: The argument man just kept contradicting me.
    - **Byte**: Did he. I shall have a word with him.
    - He swaps hats, turns to face the empty stool, and has a long, stern word with himself.
- **Shake hands. Good game.**
    - **Byte**: It was not a game. It was a— yes. Fine. Good game.

### Complete

#### <a id="q16-complete"></a>Complete `q16-complete`

_The last grain of sand drops. Byte stares at it for a long moment._  
**Byte** _(think)_: Nobody has ever won before. Most people just get cross until the sand runs out.  
**Byte** _(soft)_: Disagreeing is easy. I have been doing it for years and calling it thinking.  
**Byte**: You may keep the timer. I will make another. I have a great deal of sand.  
**Byte** _(happy)_: And I am putting you on the board. Debate Club. Founding member. There are no other members.  
**You**: Is there a club?  
**Byte**: There is now. Do not argue.  
_Pixel leans out of the Workshop window with a spanner._  
**Pixel** _(happy)_: Did you win? Nobody wins. I’ve been married to the man in that booth for twenty years.  
**Byte**: Disagree.  
**Pixel**: See?  

**Rewards**

- Sand Timer (decor): Byte’s one-minute argument timer. Tap it to turn it over; it runs for exactly one minute.
- Debate Club (title): A title for your Keeper profile: founding (and only) member of Byte’s Debate Club.

**Learning Grove swaps**

- `q16-win#0` → Hang on. You’re not giving any reasons.
- `q16-win#2` → Saying the opposite isn’t the same as explaining why.

**Notes:** Costs exactly 5 Shells; if the player cannot pay, Byte says the booth will be here and the quest waits. Step 2 is a one-minute reply minigame: a few reply cards each turn; every ordinary reply gets contradicted, and one card each round is "point out what he is doing". Picking it wins. If the sand runs out first, Byte offers another minute for free ("I was enjoying that"). Approved quotes "This isn't an argument." and "An argument isn't just contradiction." each used once; both swapped in childLines. The COMPLAINTS booth is a second, smaller booth prop beside the first; Byte swaps between two hats (one per booth). q16-haggled is flavour: "That one was free" is the joke.

## Q17. The Fish-Slapping Dance

*Monty Python’s Flying Circus: The Fish-Slapping Dance* · audience: all · where: The end of the dock on the pond · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Mr Pilchard (The smaller dancer in The Fish-Slapping Dance (Monty Python’s Flying Circus)), Mr Grampus (The taller dancer in The Fish-Slapping Dance (Monty Python’s Flying Circus))

### Step 1: Learn the steps of the dock dance.

Hint: Open Karate on the dock. Tap in time with the beat markers; the fish does the rest. · check: `karate:practice:dock-dance`

#### <a id="q17-intro"></a>Scene `q17-intro`

_On the end of the dock, two Keepers in crisp white shirts and sun hats stand very straight._  
_Each holds a small, shiny fish. They hold them the way other people hold violins._  
**Mr Pilchard** _(think)_: Good morning. Pilchard. This is Grampus. We are a dance society.  
**Mr Grampus**: Of two.  
**Mr Pilchard**: We perform the old dance of the dock. It is very formal. We have an opening for a third.  
**Mr Grampus** _(think)_: The last third went in.  
_Mr Pilchard demonstrates: a small step, a bow, and a gentle, rhythmic tap on Mr Grampus’s cheek with the fish._  
_Mr Grampus does it back. They both bow. Neither smiles. It is beautiful, in a confusing way._  
**Mr Grampus**: Will you dance?  

**Choices**

- **I’d be honoured.**
    - **Mr Pilchard**: Splendid. You will need a fish.
- **Do the fish mind?** — sets `{"q17-asked-fish":true}`
    - **Mr Grampus**: The fish were consulted. The fish are dancers too.

#### <a id="q17-learned"></a>Done `q17-learned`

_Step, bow, tap. Step, bow, tap. Your fish is a sprat. It does its best._  
**Mr Pilchard** _(think)_: Good. Very good. The wrist is a little eager.  
**Mr Grampus**: Eager wrists end up in the water.  

### Step 2: Dance the full performance on the dock.

Hint: It is a timing bout on the karate screen. Hit every beat; the last beat is not yours to win. · check: `karate:win:dock-dance:timing`

#### <a id="q17-performance"></a>Scene `q17-performance`

**Mr Pilchard** _(happy)_: Now. The full performance. In front of the whole pond.  
_A small audience of Nubbins has gathered on the bank. One has brought a snack._  
**Mr Grampus**: Keep the timing. Whatever happens, keep the timing.  
_Mr Grampus reaches behind a crate and brings out a second fish. It is much, much bigger: a herring the length of a draught excluder._  
**You**: That’s not the same fish.  
**Mr Grampus** _(think)_: It is the finale fish.  

**Choices**

- **Keep the timing.** — sets `{"q17-kept-time":true}`
    - You set your feet. Your sprat trembles.
- **Ask what the finale involves.**
    - **Mr Pilchard**: Water, mostly.
    - **Mr Grampus**: Gently, though. We are not savages.

#### <a id="q17-splash"></a>Done `q17-splash`

_Step, bow, tap. Step, bow, tap. Perfect timing, every beat._  
_Then Mr Grampus swings the finale fish, very slowly and very gently, and you topple off the dock into the pond._  
_It is warm. A duck looks at you. The Nubbins on the bank cheer as if this was the plan. It was._  

### Complete

#### <a id="q17-complete"></a>Complete `q17-complete`

_You climb out. Mr Pilchard hands you a towel. Mr Grampus hands you the finale fish._  
**Mr Grampus** _(soft)_: Traditional. The one who goes in keeps the herring.  
**Mr Pilchard**: It is excellent for knocking fruit out of trees from a distance. Give it to your strongest Nubbin.  
**Mr Pilchard** _(happy)_: And you may keep the bow. It suits you.  
**Mr Grampus** _(soft)_: We dance it every morning. Usually for nobody. It is nice to be watched, though we would do it anyway.  
_Your Power Nubbins can now use the herring to knock fruit down from afar, and you have a new fish-slap victory pose in karate._  

**Rewards**

- Herring (item): The finale fish. Give it to a Power Nubbin and it can knock fruit off a tree from a distance.
- Fish-Slap Victory Pose (cosmetic): A new karate victory pose: a formal bow and a gentle tap with a small fish.

**Notes:** No source quotes; the original is wordless, so all lines are new. Staging: two Keepers on the dock end, white shirts, sun hats, very upright posture. Step 1 is a practice timing track; step 2 a full timing bout on the karate screen with a jaunty original march (new music, nothing borrowed). The last beat always ends with the player knocked gently into the pond regardless of score: slow-motion swing, soft splash, a duck. No damage, no happiness loss. The herring lets a Power Nubbin shake a tree from about five tiles away. Mr Grampus’s line about the last third is the only hint of the finale; play it deadpan, no pause.

## Q18. Self-Defence Against Fresh Fruit

*Monty Python’s Flying Circus: Self-Defence Against Fresh Fruit* · audience: all · where: The clearing in the woods, where a row of logs has been set out · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Sergeant Grimble (The sergeant major in Self-Defence Against Fresh Fruit (Monty Python’s Flying Circus))

### Step 1: Disarm the Nubbin with the banana.

Hint: When the Nubbin swings the banana, tap Peel at the top of the swing. · check: `class:fruit-defence:banana`

#### <a id="q18-intro"></a>Scene `q18-intro`

_In the clearing, a Keeper with a moustache like a yard brush is pacing in front of a row of logs._  
_Three Nubbins sit on the logs. They look as if they were here first and have been told off for it._  
**Sergeant Grimble** _(angry)_: YOU! Late! Sit! On a log!  
**Sergeant Grimble**: Sergeant Grimble. Tonight’s class: defending yourself against a person armed with fresh fruit.  
**Sergeant Grimble** _(think)_: Dried fruit is next week. Dried fruit is a whole different animal.  
_A Nubbin on the end log raises a paw._  
**Sergeant Grimble** _(angry)_: NO. Not sticks. Every class wants sticks. Tonight is FRUIT.  
_The Nubbin lowers its paw very slowly. It was going to ask about sticks._  
**Sergeant Grimble**: First. The banana. Somebody comes at you with a banana. What do you do?  

**Choices**

- **Duck.**
    - **Sergeant Grimble**: DUCK? A banana CURVES, Keeper. It will find you.
- **Talk them down.**
    - **Sergeant Grimble**: With a BANANA in their hand? They are beyond reason!
- **Peel it.** — sets `{"q18-knew-peel":true}`
    - **Sergeant Grimble**: …Correct. Who told you? Nobody ever knows that.

#### <a id="q18-banana"></a>Done `q18-banana`

_A Nubbin lunges at you with a banana. You peel it in one smooth move._  
_The Nubbin stares at the naked banana, deeply embarrassed, and sits back down on its log._  
**Sergeant Grimble** _(happy)_: TEXTBOOK! A peeled banana is a disgraced banana!  

### Step 2: Catch every raspberry in the bowl.

Hint: Slide the bowl left and right under the falling raspberries. Missing three restarts the drill. · check: `class:fruit-defence:raspberry`

#### <a id="q18-raspberry"></a>Scene `q18-raspberry`

**Sergeant Grimble** _(think)_: Next. The raspberry. Small. Fast. Underestimated. The raspberry is a professional.  
**Sergeant Grimble**: It does not come alone. Where there is one raspberry, there are forty.  
_A Nubbin rises from its log holding a bowl of raspberries, eyes narrowed._  
**Sergeant Grimble**: Your defence against the raspberry is a bowl. Hold out a bowl. Catch them all. Leave none on the floor.  
**You**: Why can’t any land on the floor?  
**Sergeant Grimble** _(angry)_: Because they STAIN, Keeper. Do you want your floor to remember this?  

#### <a id="q18-raspberry-done"></a>Done `q18-raspberry-done`

_Forty raspberries. Forty catches. Your bowl is full and the floor is spotless._  
_The Nubbin with the empty bowl looks at its paws, then at yours, then quietly eats one of yours._  
**Sergeant Grimble**: Acceptable. Move on.  

### Step 3: Toss the pineapple to your Nubbin from across the clearing.

Hint: Hold the pineapple, aim at your Nubbin and tap Throw. Your Nubbin will run to meet it. · check: `class:fruit-defence:pineapple`

#### <a id="q18-pineapple"></a>Scene `q18-pineapple`

**Sergeant Grimble** _(think)_: And now. The big one.  
_He lifts the cloth off a crate. In it sits a whole pineapple, prickly and enormous, wearing a small pair of sunglasses._  
**Sergeant Grimble**: The pineapple. Spiky. Heavy. Thinks it’s better than you. It may be right.  
**Sergeant Grimble**: Nobody defends against the pineapple. You can only teach it to be on your side.  
**You**: How?  
**Sergeant Grimble** _(happy)_: Throw it. Gently. To your Nubbin. Let your Nubbin catch it, and you have an ally.  

**Choices**

- **Just toss it.**
    - **Sergeant Grimble**: No ceremony. I like it.
- **Take its sunglasses off first.** — sets `{"q18-sunglasses-off":true}`
    - **Sergeant Grimble**: Bold. Very bold. It respects that.

#### <a id="q18-catch"></a>Done `q18-catch`

_You toss the pineapple. Your Nubbin runs, jumps, and catches it in both arms with a soft “oof”._  
_It holds the pineapple up like a trophy. The pineapple seems content with the arrangement._  

### Complete

#### <a id="q18-complete"></a>Complete `q18-complete`

**Sergeant Grimble** _(happy)_: CLASS DISMISSED!  
**Sergeant Grimble**: You are now qualified to defend yourself against fresh fruit. And, more importantly, to throw it.  
**Sergeant Grimble** _(soft)_: Between you and me, Keeper? Forty years, and not once has anybody attacked me with fruit.  
**Sergeant Grimble** _(think)_: I have been ready the entire time. It has been exhausting.  
_He presses a battered brass whistle into your hand. It has clearly been blown a great deal._  
**Sergeant Grimble**: Blow that, and your Nubbins will look up. Throw, and they will catch. Any fruit. Any distance.  
**Sergeant Grimble** _(think)_: Except dried fruit. Next week. Bring a hat.  
_From now on, your Nubbins can catch fruit you toss to them from a distance._  

**Rewards**

- Catch (feature): Toss a fruit towards one of your Nubbins from a distance and it will run and catch it.
- Sergeant’s Whistle (cosmetic): A battered brass whistle on a cord. Worn round the neck; blowing it makes nearby Nubbins look up.

**Notes:** No source quotes; all lines are new. Three short drills: banana (a timing tap), raspberry (a catch-the-falling-fruit minigame, forty raspberries, three misses restarts), pineapple (an aimed throw to your own Nubbin). The class Nubbins are wild extras who sit on the logs between drills. Nobody is hit by fruit; the banana Nubbin only swings. Keep the sergeant loud but kind: he shouts, then praises. The pineapple’s sunglasses can be a cosmetic on the pineapple prop only. Catch reuses the existing throw: fruit thrown within range of a Nubbin that is facing you is caught.

## Q19. Upper-Class Twit of the Year

*Monty Python’s Flying Circus: Upper-Class Twit of the Year* · audience: all · where: The meadow, under a banner · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Mrs Thackery (The commentator at Upper-Class Twit of the Year (Monty Python’s Flying Circus)), The Hon. Bunty Fairweather-Flute (A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus)), Piers Tumbledown-Hoop (A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus)), Lord Algernon Spoon (A contestant in Upper-Class Twit of the Year (Monty Python’s Flying Circus))

### Step 1: Enter the Grand Toffs’ Cup in the meadow.

Hint: Sign the entry book on Mrs Thackery’s table. · check: `enter:race:toffs-cup`

#### <a id="q19-intro"></a>Scene `q19-intro`

_A banner over the meadow reads: THE GRAND TOFFS’ CUP. ENTRANTS WELCOME. NO EXPERIENCE NECESSARY, OR WANTED._  
**Mrs Thackery** _(happy)_: Roll up! The obstacle race! Three gentlemen entrants so far. We could do with a fourth.  
_The three gentlemen entrants are standing on the start line. One of them is facing the wrong way._  
**The Hon. Bunty Fairweather-Flute** _(think)_: I say. Is this the start or the end? It looks awfully like the start.  
**Piers Tumbledown-Hoop**: It’s the middle, Bunty. Everything is the middle, if you think about it.  
**Lord Algernon Spoon** _(happy)_: I have entered every year for nine years. I have never once found the start line. This is tremendously exciting.  

**Choices**

- **Sign up.**
    - **Mrs Thackery**: Splendid! Pop your name in the book. Spell it however you like.
- **Turn Bunty round first.** — sets `{"q19-turned-bunty":true}`
    - You turn Bunty round. Bunty thanks you warmly, then turns back round, to be polite.

#### <a id="q19-ready"></a>Done `q19-ready`

**Mrs Thackery**: Four entrants! Record turnout! The course: one row of matchboxes, one low wall, one sleeping Keeper. Mind the Keeper.  
_At the far end of the course, a Keeper is snoring in a deckchair. Nobody knows who put them there._  

### Step 2: Win the Grand Toffs’ Cup.

Hint: Run the course. Jump the matchboxes and step round the sleeping Keeper. Do not wake them; it takes ages. · check: `race:win:toffs-cup`

#### <a id="q19-race"></a>Scene `q19-race`

**Mrs Thackery** _(happy)_: On your marks! Get set!  
_A whistle blows. You run. Behind you, nobody else moves._  
**Mrs Thackery** _(shock)_: And the Keeper is away! Bunty is checking which way is forward. Piers is tying his shoelace. To Algernon’s shoelace.  
_At the matchboxes, Piers finally arrives and leaps each one with enormous effort, about a foot too high._  
**Lord Algernon Spoon** _(happy)_: I’ve found the start line! Hello, start line!  
_Bunty reaches the sleeping Keeper, stops, and taps them gently on the shoulder._  
**The Hon. Bunty Fairweather-Flute**: Frightfully sorry. Would you like to come? It’s ever so jolly.  

**Choices**

- **Keep a straight face and run.** — sets `{"q19-straight-face":true}`
    - You keep a perfectly straight face. It is the hardest thing you have ever done.
- **Laugh all the way to the finish.**
    - You laugh so hard you have to walk the last stretch. You are still miles ahead.

#### <a id="q19-win"></a>Done `q19-win`

**Mrs Thackery** _(happy)_: The Keeper wins! By a margin of… well. By everybody.  
_Far behind, Algernon is waving goodbye to the start line as if seeing off a ship._  
_Bunty finishes last, having walked the whole course arm in arm with the sleeping Keeper, who is still asleep._  

**Choices**

- **Bunty should get a prize for stopping to help.** — sets `{"q19-bunty-prize":true}`
    - **Mrs Thackery**: There isn’t a prize for that.
    - **You**: There should be.
    - **Mrs Thackery**: …There is now. It’s a slightly smaller hat.
    - Bunty accepts it with tears in both eyes, and puts it on the sleeping Keeper.
- **Accept graciously.**
    - You bow. Piers bows back. Algernon bows to the start line, which he has grown very fond of.

### Complete

#### <a id="q19-complete"></a>Complete `q19-complete`

_The three gentlemen gather to congratulate you. Two of them congratulate a fence post first._  
**Piers Tumbledown-Hoop** _(happy)_: Jolly well run. Frightfully fast. We had no idea people could go in that direction.  
**The Hon. Bunty Fairweather-Flute**: Here. The prize. It’s a top hat. And the monocle’s from me. I’ve two more. I can’t find either.  
_The hat is tall and glossy. The monocle stays in only if you raise one eyebrow, permanently._  
**Lord Algernon Spoon** _(happy)_: Same time next year? I shall start looking for the start line tonight.  
_The sleeping Keeper wakes, sees you in the top hat, and goes straight back to sleep._  

**Rewards**

- Top Hat (cosmetic): A tall, glossy top hat. First prize in the Grand Toffs’ Cup.
- Monocle (cosmetic): A gold-rimmed monocle, donated by the Hon. Bunty Fairweather-Flute, who has lost two others.

**Notes:** No source quotes; all lines are new, and the rivals’ names are invented. The race is a short obstacle course on the existing race screen: matchboxes (tiny jumps), a low wall, and a sleeping Keeper in a deckchair to walk round (bumping them adds a two-second delay while they mumble). The three rivals are scripted to fail comically and can never win: Bunty faces the wrong way, Piers ties his lace to Algernon’s, Algernon stays waving at the start line. Commentary from Mrs Thackery plays over the race as barks. Winning is guaranteed if the player finishes.

## Q20. And Now, the Larch

*Monty Python’s Flying Circus: How to Recognise Different Types of Trees from Quite a Long Way Away* · audience: all · where: The edge of the orchard, beside a signboard · when: The first time you walk past, in the Free Grove or the campaign (never during Chapters 9–11)

**Cast:** Mr Arbour (The narrator of How to Recognise Different Types of Trees from Quite a Long Way Away (Monty Python’s Flying Circus))

### Step 1: Find and tap one of every kind of tree in the Grove.

Hint: Your Grove has one tree for each fruit, plus the palm on the coast. Your journal ticks each one off. · check: `tap:tree:every-kind`

#### <a id="q20-intro"></a>Scene `q20-intro`

_At the edge of the orchard, a Keeper in a grey suit stands beside a signboard with a picture of a tree on it._  
**Mr Arbour** _(think)_: Good afternoon. Today we shall learn to recognise the different trees of the Grove.  
**Mr Arbour**: From quite near, mostly. My eyesight is not what it was.  
**Mr Arbour**: Number one.  
**Mr Arbour**: The larch.  
_He points at the picture. It is a tall, thin, pointy tree, quite unlike anything in your Grove._  
**You**: There aren’t any of those here.  
**Mr Arbour** _(think)_: Correct. Number two.  
_He turns the board over. It is the same tree._  
**Mr Arbour**: The larch.  
**You**: That’s the same tree.  
**Mr Arbour**: It is a larch. It is very important to recognise it. Particularly when it is absent.  
**Mr Arbour**: Your task: find one of every tree you do have, and tap it. Recognise it. Up close.  

**Choices**

- **Is number three a larch?** — sets `{"q20-asked-three":true}`
    - **Mr Arbour**: …Let us not get ahead of ourselves.
- **Off I go, then.**
    - **Mr Arbour**: I shall wait here, by my larch.

#### <a id="q20-trees"></a>Done `q20-trees`

_Run, swim, fly, power, stamina, sun, moon, heart. The palm, on the coast, looking tired._  
_Each tree, once tapped, rustles slightly, as if pleased to be recognised._  
_There is no larch. You check twice. You feel, absurdly, that you have let Mr Arbour down._  

### Step 2: Photograph Mr Arbour’s board from the meadow.

Hint: Open Photo mode, zoom in on the far ridge and take the picture with the board in frame. · check: `photo:subject:larch-board:far-ridge`

#### <a id="q20-far"></a>Scene `q20-far`

**Mr Arbour** _(think)_: Very good. Now the advanced class. Recognising a tree from quite a long way away.  
_He picks up his signboard and walks off with it. He keeps walking. He goes over the hill._  
_After a while, a tiny figure appears on the far ridge, holding up a tiny board._  
**Mr Arbour** _(happy)_: Can you see it?  
_You can just make out the board. It shows a tall, thin, pointy tree. Of course it does._  
**Mr Arbour**: Take a photograph! I shall stand here until you do, which is fine! I have brought a sandwich!  

#### <a id="q20-photo"></a>Done `q20-photo`

_Click. The picture is mostly sky, a bit of hill, and one small, clear, unmistakable larch._  
_Far away, a tiny Mr Arbour lowers the board and takes a dignified bite of his sandwich._  

### Complete

#### <a id="q20-complete"></a>Complete `q20-complete`

_Mr Arbour returns, slightly out of breath, and studies your photograph for a long time._  
**Mr Arbour** _(soft)_: Yes. That is a larch.  
**Mr Arbour** _(think)_: Most people walk past every tree they own and never once look up. You tapped all of yours.  
**Mr Arbour**: The larch was only there to get you looking. You are the first student ever to recognise it twice. Here. Grow your own.  
_He presses a small, pointed seed into your palm. A larch seed: a new tree for your Grove._  
**Mr Arbour** _(think)_: And a little button for your camera. Press it, and the picture becomes something else entirely.  
_Photo mode has a new button that swaps to a random filter. Mr Arbour walks back to the orchard edge to stand beside nothing._  
_A very large foot comes down out of the sky, considers the orchard, and goes back up again. Nobody mentions it._  

**Rewards**

- Larch Seed (item): A small pointed seed. Plant it to grow a larch: tall, thin, pointy, and bearing no fruit at all.
- Something Completely Different (feature): A new button in Photo mode that swaps to a random filter.

**Learning Grove swaps**

- `q20-intro#4` → First: the larch.
- `q20-intro#9` → Second: the larch, again.

**Notes:** Mr Arbour speaks slowly and evenly; give his voice blip a low, steady pitch. The signboard is a two-sided prop showing the same larch on both sides. Step 1 ticks off every fruit-tree type the Grove has plus the coast palm (if the player has not planted a type, the journal names it so they know). Step 2 places Mr Arbour and the board on the far ridge, visible from the meadow only with Photo mode zoom; the check passes when the board is in frame. Larch seeds plant like any tree, grow tall and thin, and drop no fruit. The reward label "Something Completely Different" is the name the brief gives the Photo mode button; it is never spoken in dialogue. Approved quote "The larch." (from "Number one. The larch.") used twice; both swapped in childLines. The giant foot in the complete scene is a one-off cut-in: a cut-out-style foot descends over the orchard, pauses, and lifts away, with no sound but a soft thump.
