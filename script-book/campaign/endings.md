# Hazel's Grove: The campaign: endings

- **The Collector** (`collector`): Sell your Nubbin to Corvin in chapter 2 and never buy anyone back, or keep the stone at the Wellspring’s edge.
- **The Empty Lantern** (`empty-lantern`): Lose Sable: let her trust fall under 5 for ten minutes so she runs away, and don’t win her back before the end.
- **Eternal Dawn (secret)** (`eternal-dawn`): Raise one of your own Nubbins to Eternal during the campaign (two rebirths, then a Normal-type evolution with a strong alignment), and end with Sable bonded.
- **Wild Grove** (`wild-grove`): Open the pens by force in chapter 9, then choose “Open, no gate” at the end.
- **Hazel’s Grove** (`hazels-grove`): Bond with Sable (trust 70+), keep Moss loved (affection 40+ when chapter 10 begins), reconcile with Corvin in chapter 9, and unmake the stone. Either final choice will do.
- **Moss Sleeps** (`moss-sleeps`): Bond with Sable, but let Moss fade: leave his affection under 40 when chapter 10 begins. If he walks into the Wellspring, only a loved Moss comes back.
- **The Shadow’s Keeper** (`shadow-keeper`): Bond with Sable and keep Moss loved, but don’t reconcile with Corvin: buy Ash back or open the pens by force in chapter 9.
- **The Long Road** (`long-road`): Reach the end with Sable still with you but not yet bonded (trust under 70). The default ending.

#### <a id="end-hazels-grove"></a>Ending scene `end-hazels-grove`

_HAZEL’S GROVE_  
_The gate sticks. Everyone who matters knows to lift and push._  
_The frost never comes back to the long grass. The fourth lantern lights itself every dusk now, a little before the others, as if it’s keen._  
_Near Briar’s, on the hill, there is a small, untidy flower that Moss will not let anyone step near. He sits beside it in the afternoons and talks to it._  
_Sometimes he stops in the middle of a sentence, as if it has said something back. He says it usually has._  
_Sable sleeps on your feet. Grey as ash._  
_Heart above her head. Both at once, for ever._  
_Pixel’s trust meter still hangs by the cottage door._  
_Somebody has painted over MAYBE. It now says OBVIOUSLY._  
_Some nights, half asleep, Sable makes a small sound that might be a word._  
_You never wonder any more which one it means. It’s yours now._  

> ENDING ORDER (all eight): end-<id> → body variant if any → end-epi-wisp-* → end-epi-gate-* → end-epi-mill-* (S13, only if millLetter is set; kept but never given → -kept-ungiven) → end-epi-walk-* → end-epi-cinder-* (S19, only if cinder is set) → end-epi-told | end-epi-secret (only if S10 set hazel) → end-<id>-last. HAZEL’S GROVE: with letThemGo (final choice “Open”), queue end-hazels-grove-open IN PLACE OF end-hazels-grove (same title, first body line changed, the rest shared as HAZELS_GROVE_BODY), then -last as usual. The mill and cinder epilogue scenes live in side-stories-new-3.ts (SIDE_STORIES_NEW_3_VARIANTS). Wisp: spared+unmade → -spared; sable+unmade → -sable; spared/sable+keptStone → -kept; driven → -driven; unset → -none. Gate: corvinGate family/guest/shut → that; unset → -none. Walk: you/sable/corvin → that; moss → -moss-stayed if keptStone, else -moss; unset → -alone. Hazel’s Grove (rule: Sable bonded, Moss not faded, corvin = reconciled; either final choice): Moss is present; “Told you. Love is a method.” is in -last. Pixel’s trust meter now reads OBVIOUSLY (payoff of c7-close). “Sable makes a small sound” names her, so the line can’t be read as Pixel.

#### <a id="end-hazels-grove-open"></a>Ending scene `end-hazels-grove-open`

_HAZEL’S GROVE_  
_There is no gate any more. Everyone who matters comes in anyway, and most of them still lift and push at the air where it was._  
_The frost never comes back to the long grass. The fourth lantern lights itself every dusk now, a little before the others, as if it’s keen._  
_Near Briar’s, on the hill, there is a small, untidy flower that Moss will not let anyone step near. He sits beside it in the afternoons and talks to it._  
_Sometimes he stops in the middle of a sentence, as if it has said something back. He says it usually has._  
_Sable sleeps on your feet. Grey as ash._  
_Heart above her head. Both at once, for ever._  
_Pixel’s trust meter still hangs by the cottage door._  
_Somebody has painted over MAYBE. It now says OBVIOUSLY._  
_Some nights, half asleep, Sable makes a small sound that might be a word._  
_You never wonder any more which one it means. It’s yours now._  

> NEW. Body variant of Hazel’s Grove when letThemGo (final choice “Open”): plays instead of end-hazels-grove, not after it. First body line: “There is no gate any more. Everyone who matters comes in anyway, and most of them still lift and push at the air where it was.” The rest is HAZELS_GROVE_BODY. wild-grove (freedByForce && letThemGo) is checked first, so a forced route with “Open” is still the Wild Grove (in practice forced and reconciled exclude each other anyway).

#### <a id="end-hazels-grove-last"></a>Ending scene `end-hazels-grove-last`

_Sometimes, by the pond, in the place where nobody says anything, you can very nearly hear her._  
**Gran Hazel** _(happy)_: Told you. Love is a method.  

> Final lines of Hazel’s Grove (verbatim “Told you. Love is a method.”).

#### <a id="end-eternal-dawn"></a>Ending scene `end-eternal-dawn`

_ETERNAL DAWN_  
_One of yours has stopped ageing. You noticed it in the spring: the way it sat, carefully, like something that had decided to._  
_It sits on the western hill now, and watches the gate, and will not come down until it decides you are worth it. It already has._  

> Then end-eternal-dawn-moss if Moss is still in the world, else end-eternal-dawn-nomoss; then epilogues; then -last.

#### <a id="end-eternal-dawn-moss"></a>Ending scene `end-eternal-dawn-moss`

_Moss looked at it for a long time. Then he climbed up and sat beside it._  
**Moss** _(soft)_: Someone has to remember the pale one’s shoelaces. It isn’t going to be me for ever. Good. That’s good.  
_Two of them on the hill now._  
_One talks. The other is learning how._  

> Body variant: Moss alive. Keeps his shoelace line from the old ending.

#### <a id="end-eternal-dawn-nomoss"></a>Ending scene `end-eternal-dawn-nomoss`

_It sits in the exact place where Moss used to sit._  
_Nobody taught it to. Nobody had to._  
_Byte says it’s a coincidence. Byte has also started tying his shoelaces twice._  

> Body variant: Moss faded or did not return.

#### <a id="end-eternal-dawn-last"></a>Ending scene `end-eternal-dawn-last`

_On Lantern Night it comes down for an hour and sits among you all, and looks at each of you in turn, very carefully._  
_As if it is learning you by heart._  
_It is. That is what they are for._  

> Final lines of Eternal Dawn.

#### <a id="end-shadow-keeper"></a>Ending scene `end-shadow-keeper`

_THE SHADOW’S KEEPER_  
_Grey Nubbins find their way to your gate now. Word gets round, in whatever way word gets round among creatures that do not speak._  
_They come out of the Hollow, and down from the Circuit, and in from the long grass: thin and quiet, waiting for the next bad thing._  
_Sable meets each one at the edge and sits with it. She does not come closer._  
_She does not run. She shows them how._  
_Ash sits with her, most days, half a step further out, out of respect._  
_Byte keeps a register of arrivals at the edge. The column for departures is still blank._  
_He checks it anyway, as if it might fill in while he isn’t looking._  
_Two grey shapes in the long grass. The new ones go to both._  

> Corvin-neutral (the gate epilogue says what became of him). Ash sits with Sable.

#### <a id="end-shadow-keeper-last"></a>Ending scene `end-shadow-keeper-last`

_Clover tells every new Keeper the same thing, standing at the edge with a bag of fruit._  
**Clover** _(soft)_: The grey stays. You can only make it lighter.  
_Sable is the proof. She is so light now._  
_You could carry her anywhere._  

> Clover’s verbatim “The grey stays. You can only make it lighter.”

#### <a id="end-moss-sleeps"></a>Ending scene `end-moss-sleeps`

_MOSS SLEEPS_  
_Moss did not come back. By spring his flower by the flat stone was fully open, and the wind goes through it the way it went through him._  
_Sable carries his light now. Nobody knows how._  
_It floats beside hers, pale and small, and when the lanterns are lit, it flickers._  
_You sit by his flower in the afternoons and tell it things. You were never very good at sitting still with him, when he was here._  
_You are better at it now. It is too late, and you do it anyway._  

> Sable bonded and Moss faded. Works whether he went into the water or up the hill. Sable carries his pale light (c10-moss-light).

#### <a id="end-moss-sleeps-last"></a>Ending scene `end-moss-sleeps-last`

**Luna** _(soft)_: He’s not gone. He’s just remembered by fewer people. That’s all fading is.  
**Luna** _(soft)_: Remember him louder.  

> Luna: “Remember him louder.”

#### <a id="end-wild-grove"></a>Ending scene `end-wild-grove`

_WILD GROVE_  
_There is no gate any more. Some stayed; most didn’t._  
_The grey ones you scattered from Corvin’s garden come and go through the Hollow._  
_You leave fruit, and some of it is eaten._  
_Fern sends lantern buns. Nothing in the Hollow will touch them. Fern says that proves they have standards._  
_Most weeks you go into the Hollow with a lantern and a bag of fruit and the stubborn chin. Some of them let you near now._  
_A small grey one with a nicked ear let you touch it this spring._  
_Took two months. Worth it._  

> No gate (finalChoice free). Echoes Hazel’s notebook line.

#### <a id="end-wild-grove-last"></a>Ending scene `end-wild-grove-last`

**Nova** _(soft)_: I saw you out there. You didn’t wave. You were busy.  
**Nova** _(soft)_: You looked… like her.  

> Nova’s line, echoing her c8-open description of Hazel.

#### <a id="end-empty-lantern"></a>Ending scene `end-empty-lantern`

_THE EMPTY LANTERN_  
_Sable never came back. Luna still leaves fruit at the edge every night._  
_Some mornings it is gone, and nobody asks who took it._  
_On Lantern Night you light all four posts. Then you light a fifth, a small one, and set it at the very edge of the long grass, facing out._  
_For anyone who might be watching from it. For anyone who might want to know the way._  

> Sable gone. A fifth small lantern at the edge of the long grass on Lantern Night.

#### <a id="end-empty-lantern-last"></a>Ending scene `end-empty-lantern-last`

_Hazel wrote it in her first letter. You have it by heart._  
**Gran Hazel** _(soft)_: “When you don’t know what to do, sit down next to them and wait.”  
_You are still waiting. That counts._  
_That counts for a lot._  

> Hazel’s rule three, quoted from the first letter.

#### <a id="end-collector"></a>Ending scene `end-collector`

_THE COLLECTOR_  

> Title only, then end-collector-kept if keptStone (takes precedence), else end-collector-sold; then epilogues; then end-collector-last.

#### <a id="end-collector-sold"></a>Ending scene `end-collector-sold`

_Two hundred Shells buys a lot of eggs. They hatch, and they are fast, and they are grey by autumn, every one._  
_You meant to go looking for the first one. You told yourself it would keep._  
_You told yourself it was doing well. Quiet._  
_You told yourself those were the same thing._  
**Corvin Vale** _(think)_: I told you. Everyone sells, eventually. I’m almost sorry I was right.  

> Body variant: sold in ch2 and never bought anyone back (stone unmade). The pens opened in ch9 on both Collector routes (confront and force), and C9_CHOICE_SOLD shows the old Nubbin let go on both; so: you meant to go looking and told yourself it would keep.

#### <a id="end-collector-kept"></a>Ending scene `end-collector-kept`

_Nothing in your Grove is ever hurt now._  
_Nothing is hungry, or lost, or frightened. Nothing runs into the dark._  
_They sit in the grass in the sun, all of them, quite still._  
_They are grey by spring, every one. They are perfectly safe._  
_Moss stayed on the hill after Hazel went up. He never came down again._  
_Corvin came once. He stood in the lane and looked at your hand, resting on your coat, over the pocket._  
**Corvin Vale** _(sad)_: I’m sorry. I am so sorry. I know exactly how sorry.  
_Your hands are always cold now. You keep meaning to mind._  

> Body variant: kept the stone. Corvin, thawed or not, recognises it in you. Moss stayed on the hill after Hazel went up and never came down (matches c10-kept and c11-moss-kept).

#### <a id="end-collector-last"></a>Ending scene `end-collector-last`

_The gate opens by itself now._  
_It has stopped sticking. You find that you miss it._  

> Final line of the Collector (from the old ending): the gate no longer sticks.

#### <a id="end-long-road"></a>Ending scene `end-long-road`

_THE LONG ROAD_  
_Sable is still here. Still grey._  
_Still two steps away, never one. She eats what you leave and sleeps near, not next to._  
_Hazel said two months for an ear. It has been longer than that._  
_You sit down next to her every evening and wait._  
_You have stopped counting, which Hazel would have said was the point._  
_Some evenings she is one and a half steps away._  
_You don’t say anything. You don’t want to frighten it._  
_Pixel’s meter by the door still says MAYBE._  
_Pixel offered to repaint it. You said no._  
_Maybe is a good word. It has room in it._  

> Sable present, not bonded. Pixel’s meter still says MAYBE, and you keep it that way (payoff of c7-close).

#### <a id="end-long-road-last"></a>Ending scene `end-long-road-last`

**Clover** _(soft)_: She stayed. Out of the whole valley, she picked this Grove, and she stayed.  
**Clover** _(soft)_: Don’t you dare call that nothing.  

> Clover’s verbatim “Don’t you dare call that nothing.”

#### <a id="end-epi-wisp-spared"></a>Ending scene `end-epi-wisp-spared`

_Wisp lives under the cottage step. He is grey, and will be grey always, and he has not trembled once since the Long Night._  
_He still steals. One warm thing a day: a sock off the line, a bun off the sill, the sunny end of the step._  
_He gives most of it away._  
_He still hisses at hands. Then he climbs into them._  
**Wisp** _(soft)_: …warm.  

> wisp = spared and stoneUnmadeBy = wisp. He no longer trembles. He lives under the cottage step (the bathhouse is an optional build).

#### <a id="end-epi-wisp-sable"></a>Ending scene `end-epi-wisp-sable`

_Wisp sleeps in the long grass, on the exact spot where Sable once pushed half her fruit across to him._  
_He comes in for breakfast. He doesn’t come in any further._  
_Some mornings, now, he stays to wash his face in the sun._  
**Wisp** _(soft)_: …ours.  

> wisp = sable and stoneUnmadeBy = wisp. Sable-neutral (works in the Empty Lantern too).

#### <a id="end-epi-wisp-kept"></a>Ending scene `end-epi-wisp-kept`

_Wisp comes every evening and sits at your feet, and looks at your pocket._  
_He never tries to take it. He just looks, and shakes._  
_In the morning he is gone, and in the evening he is back._  
**Wisp** _(sad)_: …warm. warm.  
_It isn’t. You could tell him._  
_You never do._  

> wisp = spared or sable, and keptStone. The eucatastrophe denied.

#### <a id="end-epi-wisp-driven"></a>Ending scene `end-epi-wisp-driven`

_You never saw Wisp again._  
_Once, from the ridge, you thought you did: thin and grey, one ear torn to a fringe, sitting where the paths stop, watching the Grove._  
_You waved. When you looked again, he was gone._  
_You don’t know if he saw._  
_You leave a little fruit at the edge of the long grass, most nights. Some of it is eaten._  

> wisp = driven.

#### <a id="end-epi-wisp-none"></a>Ending scene `end-epi-wisp-none`

_Some nights, fruit goes missing from the edge of the long grass. Whoever takes it is thin and quick and gone before you can sit up._  
_You leave a little more, the next night. Hazel would have._  

> S2 never played (wisp unset).

#### <a id="end-epi-gate-family"></a>Ending scene `end-epi-gate-family`

_Corvin comes on Sundays and sits by the pond and says nothing, badly, but he is learning._  
_On the first Sunday he brings back a pie dish, washed, with a pie in it._  
_It is not a good pie. Everyone has some._  
**Fern** _(think)_: I’ve no idea whose dish that is. It’s a lovely dish.  
_He comes in the way Hazel taught everyone, every time, as if he isn’t sure it will still work. It always does._  
_Ember sits on the far side of the pond. She has not forgiven him._  
_Some Sundays she passes him the teapot._  

> corvinGate = family. “Sundays by the pond.” Gate-neutral wording, so it works after “Open”.

#### <a id="end-epi-gate-guest"></a>Ending scene `end-epi-gate-guest`

_Corvin comes when he is asked, which is not often. He knocks on the gatepost every time._  
_You let him in every time. Neither of you has ever suggested he stop knocking._  
_Once he brought flowers for the gatepost._  
_You put them in a jar beside it. The gatepost did not comment._  

> corvinGate = guest. He knocks on the gatepost (there is always a gatepost).

#### <a id="end-epi-gate-shut"></a>Ending scene `end-epi-gate-shut`

_Corvin doesn’t come. Some mornings there are footprints in the dew by the gatepost that stop there, and turn round._  
_You never mention them. You don’t sweep them away, either._  

> corvinGate = shut.

#### <a id="end-epi-gate-none"></a>Ending scene `end-epi-gate-none`

_There is a chair by the pond that nobody sits in. Hazel put it there years ago._  
_You never asked her who it was for. You leave it where it is._  

> corvinGate unset (S9 not started, including every keptStone run): an empty chair by the pond.

#### <a id="end-epi-walk-you"></a>Ending scene `end-epi-walk-you`

_You walked her up. You know exactly which flower is hers._  
_You go up and tell it things._  
_Mostly the bad bits. She’d like those best._  

> walk = you.

#### <a id="end-epi-walk-moss"></a>Ending scene `end-epi-walk-moss`

_Moss stayed at the top with her that night, and the next, and all the rest of the winter._  
_In the spring, when her flower opened, he came down the path, thinner, and sat by the pond as if he had been gone an afternoon._  
**Moss** _(soft)_: I decided.  

> walk = moss on an unmade route (keptStone false; Moss came through the Long Night): he comes down in the spring.

#### <a id="end-epi-walk-moss-stayed"></a>Ending scene `end-epi-walk-moss-stayed`

_Moss rode up on her shoulder. At the top, for the first time since the Long Night, he turned round to face the Grove._  
_In the spring there were two flowers up there, very close together, leaning in like old friends sharing a joke._  

> walk = moss on the keep route (keptStone true, so always the Collector ending, after end-collector-kept). S10 offers Moss on the keep route whether or not he has faded. At the top he turns to face the Grove for the first time since the Long Night; by spring there are two flowers. Avoids repeating end-collector-kept’s “never came down”.

#### <a id="end-epi-walk-sable"></a>Ending scene `end-epi-walk-sable`

_Sable walked her up, and came down alone, and sat on your step._  
_She sits there every evening now, at dusk, facing the hill. When the lanterns are lit, she comes in._  

> walk = sable.

#### <a id="end-epi-walk-corvin"></a>Ending scene `end-epi-walk-corvin`

_Corvin carried her lantern up the hill, and left it burning at the top. At first light he went back up for it._  
_It hangs on the hook by the cottage door. He trims the wick himself when he comes, and won’t let anyone else touch it._  

> walk = corvin. He left her lantern burning at the top and fetched it down at first light; it hangs on the hook by the cottage door (S10’s letter finds it there).

#### <a id="end-epi-walk-alone"></a>Ending scene `end-epi-walk-alone`

_You walked her up alone, the way she wanted. Nobody else saw her go._  
_You tell them about it, when they ask._  
_You leave out the waving. That part is yours._  

> walk unset (no S10).

#### <a id="end-epi-told"></a>Ending scene `end-epi-told`

_The whole valley walked her to the foot of the hill._  
_They still meet there once a year, on the day she went up, and are quiet together in shifts, because somebody always has to blow their nose._  
_Fern brings lantern buns. They come out every time now._  
_She says it’s because she stopped trying so hard. She says this mostly to the buns._  

> hazel = told (S10). They meet “on the day she went up” (chapter 11 spans several days, so not the morning after the Long Night). Fern’s lantern buns come out every year now (payoff of c4-close).

#### <a id="end-epi-secret"></a>Ending scene `end-epi-secret`

_She left the letter under Fern’s stone on the signpost. Fern says she always knew that stone would come in useful._  
_The valley found out from her letter. Clover cried on it._  
_Sparks tried to fix it. Byte made a graph, and then wouldn’t show it to anyone._  
_Then they all came up the hill that evening with lanterns, and argued about where she’d have wanted them to stand._  

> hazel = secret (S10). The letter is S10’s second letter, under Fern’s stone from c1-letter.
