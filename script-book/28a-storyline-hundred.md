# Storyline SL1: The Hundred Days

*One egg. One life. A village to fill.* · Digimon World (1999): mechanics only · audience: main · save id: `hundred`

**Cast:** Ida Brack, Sorrel

### Chapter 1: One Egg

Goal: Hatch your one egg. (`stat:hatched:>=1`) · Hint: Hold it and shake it to hurry it along. There is nothing else to hatch.

#### Opening `h-c1-open`

_The road into the valley ends at a gate with no fence either side of it. Past the gate, the Fold: roofs with the sky in them._  
_An old woman sits on the one whole step with a broom across her knees. She looks at the egg under your arm before she looks at you._  
**Ida Brack**: One, is it. That’s how it starts. One egg and a hundred days to see what it comes to.  
**Ida Brack**: I’m Ida. I stayed. Hatch it where I can see, I like to know who I’m feeding.  

When `days:>=1`:

#### Beat `h-c1-wait`

_The egg is warm and slow about it. Ida watches you turn it, and watches the road, in about equal measure._  
**Ida Brack**: Shaking helps. Not too much. You want it keen, not seasick.  
**Ida Brack**: I had one once. Before the leaving. You don’t ask what came of it and I don’t tell you, and that’s us getting on.  

When `days:>=3`:

#### Beat `h-c1-step`

**Ida Brack**: The step you’re sat on was the bakery. The one with the hole was the school. I taught in it, nine years.  
_She says it to the egg, not to you. The egg, for its part, rocks once._  
**Ida Brack** _(soft)_: Nine years and not one of them could spell “February”. I miss every one.  

#### Closing `h-c1-close`

_The shell goes. Something small blinks at the ruined square as if it were a palace, and at you as if you built it._  
**Ida Brack**: Name it. I’ll not call it “the egg” for a hundred days.  

**Choices**

- **Say the first name that comes.** — sets `{"h-first-name":"quick"}`
- **Take a while over it.** — sets `{"h-first-name":"slow"}`

### Chapter 2: The Fold

Goal: Win over one wild creature so it moves into the Fold. (`recruits:>=1`) · Hint: Wild visitors come to a finished patch. Feed one, or let it visit three times, and it settles.

#### Opening `h-c2-open`

**Ida Brack**: Sixty of us, once. A mill, a bathhouse, a dojo I never went in. Then the cold year, and then the leaving.  
**Ida Brack**: Creatures still come to the meadow. Wild ones. Win one over and it stays, and a stayed thing is a house with a light in it.  
_She hands you the broom, which is a kind of oath._  

When `count:wildArrived:>=1`:

#### Beat `h-c2-visitor`

_Something wild comes to the edge of the meadow and stops where the grass goes long. It looks at your partner, not at you._  
**Ida Brack**: Don’t go to it. Let it come. Put fruit down and look at something else.  
_You look at the sky. Your partner looks straight at it, which is apparently allowed._  

When `count:wildFed:>=1`:

#### Beat `h-c2-fed`

_It takes the fruit from the ground, and then, after a long think, from your hand._  
**Ida Brack**: There. A few more visits like that and it’ll pick a doorway. They always pick the worst one.  

When `partner:slips:>=1`:

#### Beat `h-c2-slip`

_A morning you are late with the fruit. Your partner sits by the empty bowl and does not cry, which is worse._  
**Ida Brack**: That’s one. I’m not counting. It is.  
_You feed it. It eats as if nothing happened, and remembers anyway._  

#### Closing `h-c2-close`

_The first one moves into the square and chooses a doorway. Ida sweeps the step in front of it, which she has not done for anyone in years._  
**Ida Brack**: Two of us, then. Three, counting yours. The Fold’s not a ruin at three. It’s a small village.  

### Chapter 3: Meadow Days

Goal: Win over a second creature. (`recruits:>=2`) · Hint: The meadow brings the fliers and the plain ones. Keep your partner fed while you wait.

#### Opening `h-c3-open`

_Mornings in the meadow. Your partner learns the grass, the fruit trees, the one puddle it will not walk round._  
**Ida Brack**: Every day you miss a feed, it shows. Not now. Later, when it grows. I’ve seen it go both ways.  
**Ida Brack**: One more for the square and I’ll show you the shore.  

When `count:wildArrived:>=2`:

#### Beat `h-c3-second`

_A second wild one, a flier, lands on the post that has no fence and folds its wings as if it owned the post._  
**Ida Brack**: That one’s particular. Feed it twice before it believes you. Three times before it believes me.  

When `partner:affection:>=30`:

#### Beat `h-c3-fond`

_Your partner has started waiting at the gate with no fence, in the exact spot it last saw you._  
**Ida Brack**: That’s fondness. It’s cheap to earn and dear to keep. Keep it.  

When `days:>=3`:

#### Beat `h-c3-evening`

_Evening in the Fold. Ida lights one lamp, the only one, and sets it in the window that still has glass._  
**Ida Brack**: One lamp. When there were sixty I thought it was too bright. I’d have it too bright again.  
_Your partner falls asleep against the broom. Ida does not move the broom._  

#### Closing `h-c3-close`

_Two in the square. One has found the well and sits on its lip all day, pleased with the echo._  
**Ida Brack**: Shore’s that way. Mind the mud, it remembers feet.  

### Chapter 4: The Shore

Goal: Go to the shore and win over a swimmer for the Fold. (`area:shore&recruits:>=3`) · Hint: The journal’s Where To takes you there. A swimmer visits once you are standing on the sand.

#### Opening `h-c4-open`

_The shore is a line of grey sand and a jetty with one plank in five. Swimmers come here, Ida says, when nobody is looking._  
**Ida Brack**: Go down and stand still a while. They don’t come to walking people.  

When `area:shore`:

#### Beat `h-c4-sand`

_Sand under your boots, and under your partner’s feet, which it inspects one at a time._  
_Out past the jetty something rolls over in the water and looks back._  

When `area:shore&partner:happiness:>=60`:

#### Beat `h-c4-paddle`

_Your partner goes into the shallows up to the knees, stops, and looks back at you with the face of something that has discovered water._  
_It stays there until the sea comes up a hand’s width and makes the decision for it._  

When `area:shore&count:wildFed:>=3`:

#### Beat `h-c4-jetty`

_The swimmer eats from the jetty, one plank over from you, and then from the water, which is cheating._  
_Ida, up on the dune where the mud cannot reach her, nods once as if a sum had come out._  

#### Closing `h-c4-close`

_A swimmer follows you up from the shore with the walk of something that has never had legs for long. It takes the house nearest the well._  
**Ida Brack**: Three. The bathhouse wants a fourth before it’ll steam. Don’t ask me why, I don’t make the rules, I only kept them.  

### Chapter 5: The Cave

Goal: Go down into the cave and come back up. (`hollow:runs:>=1`) · Hint: Where To: the cave. Take fruit for the strays. Come back up when you like.

#### Opening `h-c5-open`

_A man is sitting on the well lip beside the swimmer, mending a kettle that was not his. He stands when he sees you._  
**Sorrel**: Sorrel. Tinker. I heard the square had lights again and I don’t believe things till I’ve mended something in them.  
**Sorrel**: There’s a cave under the east hill. Things down there nobody’s fed in years. Go down, come back. I want to know if the stairs hold.  

When `count:descended:>=1`:

#### Beat `h-c5-stairs`

_The stairs go down into a cold that smells of iron. Your partner takes them one at a time and counts them, you are fairly sure._  
_Somewhere below, something drops a shell on stone and listens to it._  

When `count:strayFed:>=1`:

#### Beat `h-c5-stray`

_A stray in a nook, thin, with the look of a thing that was somebody’s once. It takes the fruit without coming out._  
_Your partner sits down outside the nook and waits, and after a while the stray eats where it can be seen._  

When `count:chestOpened:>=1`:

#### Beat `h-c5-chest`

_A box under the third stair, shut for years. Shells in it, and a child’s drawing of a village with all its roofs on._  
_Sixty-odd houses, counted carefully, and a lamp in every window, drawn as a dot._  

**Choices**

- **Take the drawing up for Ida.** — sets `{"h-drawing":"ida"}`
    - **You**: She’ll know whose it was. She knew all of them.
- **Leave it in the box, where it was kept.** — sets `{"h-drawing":"box"}`
    - You put the lid back on. Some things are kept by being left.

#### Closing `h-c5-close`

_The stairs hold. You come up with dust in your hair and your partner carrying a shell it will not put down._  
**Sorrel**: Stairs hold. Good. I’ll stay a bit, then.  
_Sorrel takes a roof with a hole in it and starts, that evening, on the hole._  

### Chapter 6: Grown

Goal: Raise your partner through the cocoon. (`partner:adult`) · Hint: A child evolves at the end of its childhood. Its care slips and its type lean decide the adult.

#### Opening `h-c6-open`

**Ida Brack**: It’s nearly there. You can see it in how it stands. A few more days and the cocoon.  
**Ida Brack**: What comes out is the days you gave it. I’m not telling you off. I’m telling you the clock.  

When `partner:trust:>=40`:

#### Beat `h-c6-trust`

_It brings you things now. A stone. The kettle lid. Once, with great ceremony, a beetle, alive, which you give back._  
**Ida Brack**: That’s trust. It thinks you need looking after. It’s not wrong.  

When `partner:slips:>=3`:

#### Beat `h-c6-slips`

**Ida Brack**: Three times it’s gone without. I said I wasn’t counting. I lied, I count everything, it’s what’s left of teaching.  
**Ida Brack**: It’ll come up grumpy if this goes on. Grumpy’s not the end. It’s a lamp with a dirty glass.  
_Your partner, hearing its name in her voice, comes and leans on her boot. She lets it._  

When `partner:stage:cocoon`:

#### Beat `h-c6-cocoon`

_It stops in the middle of the square one afternoon and goes still, and a shell of light closes round it like a held breath._  
**Ida Brack**: Don’t touch it. Sit. It’s doing the hardest thing it’ll ever do and it can’t see you.  
_You sit. Sorrel comes out of his roof and sits too, with the kettle, for something to hold._  

#### Closing `h-c6-close`

_The cocoon splits. What steps out is bigger and sure of itself, and comes straight to you to be told it is still the same._  
**Ida Brack** _(soft)_: There it is, then. That’s the one that sees the hundredth day.  

### Chapter 7: The Mire

Goal: Go to the mire and bring the Fold to five. (`area:mire&recruits:>=5`) · Hint: Where To: the mire. It rains. Thicket creatures visit while you are there.

#### Opening `h-c7-open`

**Sorrel**: West of the Fold is the mire. It rains there when it rains nowhere else. The thicket creatures like it. Nobody else does.  
**Sorrel**: Two more for the square and the mill will want looking at. I can’t mend a mill alone.  

When `area:mire`:

#### Beat `h-c7-rain`

_The mire. Rain on reed and black water, and a path that is only a path if you believe in it._  
_Your partner, grown, walks it as if it had been here before. Perhaps the mire is in all of them._  

When `recruits:>=4`:

#### Beat `h-c7-four`

_Four. The fourth is a thicket thing with its ears full of rain, and it moves into the house with the best roof as if it had booked it._  
**Sorrel**: That’s my roof. That’s the roof I mended.  
_He looks at the thicket thing. The thicket thing drips._  
**Sorrel**: Fine. Fine. There’s a hole in the one next door.  

#### Closing `h-c7-close`

_Five in the square. The mire’s two sit under Sorrel’s mended roof and drip on the floor, and he says nothing, which is his way of saying welcome._  

### Chapter 8: The Mill

Goal: Fill the Fold until the bathhouse steams, then go to the mill. (`area:mill&prosperity:>=60`) · Hint: Prosperity 60 opens the bathhouse. Where To: the old mill.

#### Opening `h-c8-open`

_The old mill stands over the stream with its wheel stopped at a quarter past something. Sorrel walks round it twice before he speaks._  
**Sorrel**: It’ll turn. The square has to be worth turning it for. Fill the Fold till the bathhouse steams, and I’ll lift the brake.  
**Ida Brack**: Sixty of us, that wheel fed. Don’t go for sixty. Go for enough.  

When `area:mill`:

#### Beat `h-c8-wheel`

_Close to, the wheel is taller than the house. Moss on the paddles, a nest in the hub, the brake rusted the colour of the stream._  
**Sorrel**: Don’t pull that. I mean it. It’s not the lever, it’s what it’s holding back.  

When `prosperity:>=20`:

#### Beat `h-c8-stall`

_A stall on the square: a trestle, four kinds of fruit, and nobody to take your shells but a box._  
**Ida Brack**: Honesty box. There was one before. It was the last thing to go and the first thing I put back.  

When `prosperity:>=40`:

#### Beat `h-c8-yard`

_Somebody has cleared the yard behind the bathhouse: a lane, a beam, a bar. The square’s creatures queue for it at dawn._  
**Sorrel**: I didn’t do that. I was going to. I’d like to know who beat me to it.  
_Ida, sweeping, does not look up, and does not stop looking pleased._  

#### Closing `h-c8-close`

_The brake lifts. The wheel moves a quarter inch, thinks about it, and turns. Water on wood: the sound the valley lost._  
**Sorrel**: Light the lamp in the loft, or leave it. The loft lamp’s the one the mountain sees.  

**Choices**

- **Light the loft lamp.** — sets `{"h-mill":"lit"}`
- **Leave it dark.** — sets `{"h-mill":"left"}`

### Chapter 9: The Hush

Goal: Face the Hush with your partner and win. (`flag:hush-beaten`) · Hint: Where To: the mountain. The dojo bout at the top is the Hush. Stamina and Power carry it.

#### Opening `h-c9-open`

_It comes down the mountain the night the wheel turns: a shape made of every quiet the valley kept. The Hush. Where it walks, lamps go out._  
**Ida Brack**: That’s what emptied us. Not cold. That. It eats what nobody minds.  
**Sorrel**: It can be fought. Something has to stand in front of it and not be quiet.  
**You**: You look at your partner. Your partner looks up the mountain, and does not look away.  

When `area:mountain`:

#### Beat `h-c9-mountain`

_The mountain path is cold and the cold is listening. Your partner walks ahead of you for the first time in a hundred days._  

When `area:mountain&flag:h-mill:lit`:

#### Beat `h-c9-lamp-lit`

_Far below, the loft lamp. One light in the whole dark valley, and the thing on the path turns its head toward it._  
**You**: You lit it. Whatever comes down now comes down to a lit house.  
_Your partner stops between the Hush and the lamp, and plants its feet._  

When `area:mountain&flag:h-mill:left`:

#### Beat `h-c9-lamp-left`

_Below, the Fold is dark. You chose that: nothing to draw it down. So it walks the mountain with no light to go toward, and goes toward you._  
_Your partner steps in front. It is not quiet. It has never once been quiet._  

#### Closing `h-c9-close`

_It breaks like fog breaks, not all at once, and then all at once. Where it stood, the mountain path, and the Fold’s lamps lit below it one by one._  
**Ida Brack** _(sad)_: Nobody stood in front of it last time. I did. I was eleven.  
**Ida Brack** _(soft)_: You can put that broom down now.  

### Chapter 10: The Hundredth Day

Goal: Let the hundredth day pass. (`days:>=1`) · Hint: Nothing to do. Sit with your partner. The day turns on its own.

#### Opening `h-c10-open`

_The last morning. The wheel turns, the bathhouse steams, and something is sitting on every doorstep of the Fold._  
**Ida Brack**: A hundred days. Sit a while. Let it be a day before it’s the last one.  

When `flag:h-first-name:quick`:

#### Beat `h-c10-name-quick`

**Ida Brack**: You named it in a breath. I thought, that’s a child who’ll lose interest by Tuesday.  
**Ida Brack** _(soft)_: I was wrong, and I’m glad to say so. I don’t often get the chance.  

When `flag:h-first-name:slow`:

#### Beat `h-c10-name-slow`

**Ida Brack**: You took an hour over the name. I thought, that’s one who’ll fuss over everything.  
**Ida Brack** _(soft)_: You did. Look where fussing got us.  

When `flag:h-drawing:ida`:

#### Beat `h-c10-drawing-ida`

_The drawing from the cave is pinned inside Ida’s window, beside the lamp. Sixty-odd roofs, every window a dot._  
**Ida Brack**: Tam drew that. Year before the cold. I set it out this morning and counted. We’re short a few roofs.  
**Ida Brack**: Short’s not the same as missing. I had to be old to learn that.  

When `flag:h-drawing:box`:

#### Beat `h-c10-drawing-box`

_Under the third stair in the cave, in a box you shut, a drawing of a village with all its roofs on._  
_It is wrong now by only a few roofs. You find you are glad nobody but you knows that._  

When `partner:moody`:

#### Beat `h-c10-moody`

_Your partner sits on the far side of the square from the others, as it has since the cocoon, and watches you with its grey face._  
**Ida Brack**: It came up the way the days made it. So did I. Go and sit with it. That’s the whole method.  

#### Closing `h-c10-close`

_Dusk. Your partner leans against your knee, the weight of a hundred days, and the Fold lights its lamps without being asked._  

### Endings

- **The Bright Fold** (`bright-fold`): Fill the Fold to a standing festival, and raise a partner without a moody evolution.
- **The Fold** (`the-fold`): Reach the hundredth day with the bathhouse steaming.
- **The Quiet Fold** (`quiet-fold`): Reach the hundredth day with the Fold still half empty.
- **A Grey Lamp** (`grey-fold`): Reach the hundredth day with a partner the care slips made moody.

#### Ending scene `end-hundred-bright-fold`

_Bunting on the mill. A festival on the square. Sorrel has mended a drum and is wrong about how to play it._  
**Ida Brack** _(happy)_: Sixty, once. I counted this morning. We’re past sixty.  
_Your partner sleeps through the whole festival on the warm step, and nobody will wake it, and nobody needs to._  
_The Hundred Days: the Bright Fold._  

#### Ending scene `end-hundred-the-fold`

_The bathhouse steams. The wheel turns. Not sixty, but enough, and enough was what Ida asked for._  
**Ida Brack** _(soft)_: That’ll do. That’s the Fold. It was never more than that at its best.  
_The Hundred Days: the Fold._  

#### Ending scene `end-hundred-quiet-fold`

_Half the doorsteps have someone on them. Half the Fold is still sky in the roofs. Ida sweeps the whole square anyway._  
**Ida Brack**: Quiet’s not empty. Quiet’s a start. Somebody else will come with one egg.  
_The Hundred Days: the Quiet Fold._  

#### Ending scene `end-hundred-grey-fold`

_Your partner sits apart on the last evening, the way it has since the cocoon, and watches the lamps with the face the missed days gave it._  
**Ida Brack** _(sad)_: It stood in front of the Hush all the same. Grumpy doesn’t mean it didn’t love you. Ask me how I know.  
_You sit down beside it. After a while it leans._  
_The Hundred Days: a Grey Lamp._  

**Notes:** Areas: meadow, shore, cave, mountain, mire, mill (STORYLINE_TEXT.areas). The rule maps them to the Grove, the Hollow run, the story Hollow set and Corvin’s garden with rain. The Hush is the dojo bout fought in chapter 9. Beats key on the storyline counters; the `days:` ones are the story clock from the chapter’s start.
