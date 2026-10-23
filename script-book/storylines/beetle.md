# Storyline SL3: The Beetle Road

*A guard team, a cart, two doors, and the weather.* · Digimon World 2 (2000): mechanics only · audience: main · save id: `beetle`

**Cast:** Grist, Ottoline Vane

### Chapter 1: The Guard

Goal: Join a guard team. (`team:joined`) · Hint: The guard panel. Dawn, Dusk or Dew: each has a leader and a colour.

#### <a id="b-c1-open"></a>Opening `b-c1-open`

_The guard house is a shed with ambitions. Three team banners hang on the wall: Dawn, Dusk and Dew._  
_Behind the counter sits a man who has counted everything in the room twice._  
**Grist**: Grist. Quartermaster. You want down the Beetle Road, you want a team. Pick one, I don’t care which, they all owe me.  

When `days:>=1`:

#### <a id="b-c1-banners"></a>Beat `b-c1-banners`

_Three banners. Dawn’s is gold and torn. Dusk’s is blue and mended. Dew’s is green and has, you think, been washed._  
**Grist**: Marina’s lot shout. Luna’s lot brood. Fern’s lot knit. Any of them gets you down the road.  
**Grist**: None of them gets you back up. That’s the Beetle’s job, and mine.  

When `days:>=3`:

#### <a id="b-c1-ledger"></a>Beat `b-c1-ledger`

_Grist writes in a ledger while you decide. Every so often he reads a line back to himself and nods._  
**Grist**: Every name that went down and every name that came up. Same number in each column. I check it most mornings.  

#### <a id="b-c1-close"></a>Closing `b-c1-close`

**Grist**: Good. Here’s your badge, it’s a bottle cap. Your leader will have errands. Errands are how you find out what the road wants.  

### Chapter 2: The Beetle

Goal: Take the Beetle through the cave once. (`tank:runs:>=1`) · Hint: The Beetle Run from the guard panel. Tap up or down to change lane.

#### <a id="b-c2-open"></a>Opening `b-c2-open`

_Behind the guard house, under a tarp, the Beetle: a cart the size of a bath with a lamp on the front and a dent for every year it has run the cave._  
**Grist**: Three lanes, spores, loose rock, acid. Cargo fills, you come home. You hit a spore, you come home slower. Nobody has ever not come home.  
**Grist**: Take it round once. The road wants to know your weight.  

When `days:>=1`:

#### <a id="b-c2-tarp"></a>Beat `b-c2-tarp`

**Grist**: She was my father’s. He drove her thirty years and dented her twice.  
**Grist**: I’ve dented her forty times and driven her ten. Draw your own conclusions, I’ve drawn mine.  
_He pats the dent nearest him. It is, you notice, the one he keeps polished._  

When `count:missionDone:>=1`:

#### <a id="b-c2-errand"></a>Beat `b-c2-errand`

_Your leader’s first errand is small and particular: a message to the lamp room, a bag of nails, a look at the weather vane._  
**Grist**: Errand done? Marina’s lot would shout about it. Luna’s would brood. Fern’s would knit it a cover. Write it in the book.  
_You write it. Your hand is the newest in the book, and the worst._  

#### <a id="b-c2-close"></a>Closing `b-c2-close`

_You come home with shells in the cargo and a spore stuck to the lamp. Grist peels it off and writes something in a ledger._  
_Your Nubbin rides home on top of the shells, like a dragon on a very small hoard._  
**Grist**: Forty-one shells. And one of those. I’m not writing that down.  
**Grist**: That’ll do. The first domain’s under the lamp room. It has a door. The door has an opinion.  

### Chapter 3: The First Domain

Goal: Reach the second floor of the Hollow Below. (`hollow:best:>=2`) · Hint: Take Nubbins down with you. The way down is at the far end of each floor.

#### <a id="b-c3-open"></a>Opening `b-c3-open`

_The Hollow Below, by the guard’s stairs. The first domain is the second floor down: wider, wetter, with torches someone keeps lit and nobody admits to._  
**Grist**: Get to the second floor and come back. I want the map before I want the door.  

When `count:descended:>=1`:

#### <a id="b-c3-stair"></a>Beat `b-c3-stair`

_The first stair down. The air changes at the fourth step, the way it does in a cellar, and your Nubbins notice before you do._  
_A torch burns in a bracket at the bottom. It has been lit recently. There is nobody here._  

When `hollow:runs:>=1`:

#### <a id="b-c3-back-up"></a>Beat `b-c3-back-up`

**Grist**: First floor and back. That’s a map of the first floor. I want the second.  
**Grist**: Go again. Take more fruit. The strays down there have opinions about the way down and they’ll trade them.  

When `count:strayFed:>=1`:

#### <a id="b-c3-torches"></a>Beat `b-c3-torches`

_A stray by one of the torches nobody admits to lighting. It eats, and then it goes and sits by the torch as if it had lit it._  
_You have one piece of fruit left._  

**Choices**

- **Leave it by the torch, for whoever lights them.** — sets `{"b-torch":"left"}`
    - You set it on the bracket. The stray watches you do it, and does not take it.
- **Keep it for the next stray.** — sets `{"b-torch":"kept"}`
    - The next nook has a thinner one in it. It was the right call. It still felt like a choice.

#### <a id="b-c3-close"></a>Closing `b-c3-close`

_The second floor has a door in its far wall, iron, with a wheel on it and a drawing of a beetle scratched above the wheel._  
**Grist**: Somebody drew that before the guard existed. Think about that and then don’t.  

### Chapter 4: The Door’s Opinion

Goal: Beat the keeper of the first door. (`flag:b-boss-1`) · Hint: A dojo win while this chapter is open counts as the door.

#### <a id="b-c4-open"></a>Opening `b-c4-open`

_Something keeps the first door. It is big and it is patient and it has been down there since the beetle was drawn._  
**Grist**: Bosses fight by the dojo rules, it’s the one thing the road’s fair about. Send your best. Win, and the wheel turns.  

When `days:>=1`:

#### <a id="b-c4-wait"></a>Beat `b-c4-wait`

**Grist**: It’s not hurrying. It’s had four hundred years. You can have a day.  
_Your Nubbins train in the yard. The one you have in mind for the door knows it, and stands a little taller._  

When `count:missionDone:>=3`:

#### <a id="b-c4-errands"></a>Beat `b-c4-errands`

**Grist**: Three errands. Your leader says you’re all right.  
**Grist**: Your leader says that about everyone and means it about four. Congratulations, you’re one of the four.  

#### <a id="b-c4-close"></a>Closing `b-c4-close`

_The wheel turns. Beyond the door, a tunnel the Beetle could drive, sloping down into a draught that smells of rain._  
**Grist**: Rain. Down there. Write that down, I’m not going to.  

### Chapter 5: Two Into One

Goal: Decide about the fusion: join two partners into one, or refuse. (`fused:>=1|flag:b-fusion:refused`) · Hint: The journal’s Fuse button needs two adult partners at full affection and high trust. The refusal is a choice, not a failure.

#### <a id="b-c5-open"></a>Opening `b-c5-open`

_A woman is sitting on the Beetle’s bonnet when you come up, swinging her boots, with a notebook with more repairs than pages._  
**Ottoline Vane**: Ottoline Vane. I built the thing under the second domain. Don’t look like that, everyone looks like that.  
**Ottoline Vane**: The second door won’t open to two. It opens to one who used to be two. I know how that’s done, and I know what it costs, and I won’t tell you to.  
**Ottoline Vane**: Two who are both certain of you, both grown, and you certain of them. Then they can agree to be one. One of them stops being a name. Think about it.  

When `fused:>=1`:

#### <a id="b-c5-fused"></a>Beat `b-c5-fused`

_They stand together. Then there is one, and it knows both names, and it answers to the one you kept._  
**Ottoline Vane** _(soft)_: That’s the cost. It’s not nothing. Don’t let anyone tell you it was nothing.  
**You**: You say the other name once, out loud, so it has been said.  

Sets `{"b-fusion":"fused"}`

When `act:refuse-the-fusion`:

#### <a id="b-c5-refused"></a>Beat `b-c5-refused`

**You**: No. They stay two.  
**Ottoline Vane**: Good answer. Not the only one, but a good one. The second door has a side way, it’s narrower, and it’s the Beetle that fits it.  

Sets `{"b-fusion":"refused"}`

When `partners`:

#### <a id="b-c5-two"></a>Beat `b-c5-two`

_Two names on the partner slots. They stand either side of you in the guard yard, which is how they always stand, you realise._  
_They have been waiting for you to notice._  
**Ottoline Vane**: Don’t decide tonight. Nobody decides anything right sat on the Beetle’s bonnet.  

When `days:>=2`:

#### <a id="b-c5-notebook"></a>Beat `b-c5-notebook`

**Ottoline Vane**: I did it once. Two of mine, the year of the machine. I kept the name of the one who was louder.  
**Ottoline Vane** _(soft)_: I still catch myself calling it the other name. It still turns round.  
**Grist**: She tells everyone that. It’s true every time.  
**Ottoline Vane**: He’s my husband. He counts, I make weather. It works if we take the stairs.  
**Grist**: Thirty-nine years. She comes up on Thursdays.  

#### <a id="b-c5-close"></a>Closing `b-c5-close`

_Vane closes the notebook. Whatever you decided, she writes nothing down._  

### Chapter 6: The Second Domain

Goal: Run the Beetle three times and reach the fourth floor. (`hollow:best:>=4&tank:runs:>=3`) · Hint: The Beetle clears the slope; the Hollow takes you down. Both count.

#### <a id="b-c6-open"></a>Opening `b-c6-open`

**Grist**: Fourth floor. The Beetle goes in first, three times, to clear the slope. Then you.  
**Ottoline Vane**: There’s weather on the fourth floor. I’d say I’m sorry, but I was very young and it was a very good idea.  

When `tank:runs:>=2`:

#### <a id="b-c6-second-run"></a>Beat `b-c6-second-run`

_The second run goes down the new slope. The lamp finds rain before it finds rock._  
**Grist**: Wet cargo. Weighs more, worth the same. I’ll allow it.  

When `hollow:best:>=3`:

#### <a id="b-c6-third-floor"></a>Beat `b-c6-third-floor`

_The third floor is a staircase pretending to be a floor. At the bottom of it, a sound like a roof in weather._  
_Your Nubbins stop on the last step and listen, ears up, to rain they have never been under._  

When `hollow:best:>=3&flag:b-torch:left`:

#### <a id="b-c6-torch"></a>Beat `b-c6-torch`

_By the third-floor stair, a torch is lit, and beside it your fruit, eaten to the core, the core set down tidily on the bracket._  
_Whoever lights them says thank you the only way the Hollow allows._  

#### <a id="b-c6-close"></a>Closing `b-c6-close`

_The fourth floor rains. Underground, on a floor of stone, it rains, lightly and forever, out of a ceiling of pipes._  
_Your Nubbins stand under the pipes with their mouths open. One of them has brought a bowl, for later._  
**Grist**: Don’t drink the weather.  
_He opens an umbrella he has owned for years and never had cause to use. It looks very pleased with itself._  

### Chapter 7: The Weather Machine

Goal: Decide about the machine. (`flag:b-machine`) · Hint: The lever is the choice.

#### <a id="b-c7-open"></a>Opening `b-c7-open`

_In the middle of the fourth floor: a machine the size of the guard house, humming, with the valley’s whole weather in its gauges._  
**Ottoline Vane**: I built it the year the crops failed. It has rained when the valley needed rain for forty years. It also kept this floor flooded and the lower ones dark.  
**Ottoline Vane**: There’s a lever. Down stops it: real weather again, whatever that turns out to be. Leave it, and the valley keeps its guarantee and the Hollow keeps its rain.  
**Grist**: I’m not on the lever. I count things. I’ve counted the drips. I’m not saying the number. Count this one yourself.  

**Choices**

- **Pull the lever. Let the sky be the sky.** — sets `{"b-machine":"stop"}`
    - **Ottoline Vane**: Forty years. All right. All right.
- **Leave it running.** — sets `{"b-machine":"keep"}`
    - **Ottoline Vane**: Thank you. I think. Ask me in another forty.

#### <a id="b-c7-close"></a>Closing `b-c7-close`

_Whatever you chose, something on the fourth floor has stopped waiting. The last door stands at the end of the rain._  

### Chapter 8: The Road Home

Goal: Beat the keeper of the last door. (`flag:b-boss-2`) · Hint: A dojo win while this chapter is open counts.

#### <a id="b-c8-open"></a>Opening `b-c8-open`

_The last door’s keeper is older than the first and does not bother to be patient._  
**Grist**: Dojo rules. Same as before. Win, and the road’s the guard’s, top to bottom.  

When `flag:b-machine:stop`:

#### <a id="b-c8-dry"></a>Beat `b-c8-dry`

_The rain on the fourth floor has stopped. The drips take a while to understand this._  
**Ottoline Vane**: Listen. That’s what forty years sounds like, finishing.  

When `flag:b-machine:keep`:

#### <a id="b-c8-wet"></a>Beat `b-c8-wet`

_The rain on the fourth floor goes on, light and even, out of its ceiling of pipes._  
**Ottoline Vane**: I thought I’d mind. I find I’d mind more if it stopped. Don’t tell Grist.  
**Grist**: I counted that. I count everything.  
**Grist**: Four hundred and twelve a minute. Thursdays it’s four hundred and eleven. Someone should look into that.  

When `flag:b-fusion:fused`:

#### <a id="b-c8-one"></a>Beat `b-c8-one`

_The one who was two walks ahead of you to the last door, and stops, and waits, which both of them always did._  
**You**: You say both names, quietly. It turns round for both.  

When `flag:b-fusion:refused`:

#### <a id="b-c8-two"></a>Beat `b-c8-two`

_Two of them at the last door, either side of you, in the way they always stand._  
**Ottoline Vane**: Narrower way. Longer road. You got here all the same. Write that in Grist’s book.  

#### <a id="b-c8-close"></a>Closing `b-c8-close`

_The last wheel turns. The Beetle Road runs from the guard house to the bottom of the world, and you drove it._  
**Ottoline Vane**: I’ll stay on the fourth floor a while. Someone should watch what the weather does next.  

**Choices**

- **Ask her to come up for a bit first.** — sets `{"b-vane":"stayed"}`
- **Leave her to the gauges.** — sets `{"b-vane":"left"}`

### Endings

- **The Open Sky** (`open-sky`): Pull the lever on the weather machine and win the last door.
- **Two As One** (`two-as-one`): Pull the lever, having fused two partners into one along the road.
- **Steady Rain** (`steady-rain`): Leave the machine running and win the last door.

#### <a id="b-end-open-sky-stayed"></a>Scene `b-end-open-sky-stayed`

_You come up the guard stairs into weather nobody ordered. Cloud, then not cloud, then a wind that smells of somewhere else._  
_Ottoline comes up the guard stairs behind you, blinking at the sky as if it owed her money._  
**Grist**: You’re late.  
**Ottoline Vane**: Forty years.  
**Grist** _(soft)_: Thirty-nine. I counted.  
**Grist**: First real rain in forty years is due Thursday. I counted. I don’t know how, I just did.  
**Grist**: I’ve bought a second umbrella.  

#### <a id="b-end-open-sky-left"></a>Scene `b-end-open-sky-left`

_You come up the guard stairs into weather nobody ordered. Cloud, then not cloud, then a wind that smells of somewhere else._  
**Grist**: First real rain in forty years is due Thursday. I counted. I don’t know how, I just did.  
**Grist**: She’ll want to see it. I’ve bought a second umbrella.  
_Far below, one lamp stays lit on the fourth floor, where somebody is still watching the weather. Grist writes that in the book too._  

#### <a id="b-end-two-as-one-stayed"></a>Scene `b-end-two-as-one-stayed`

_You come up the guard stairs into weather nobody ordered, with one partner who answers to one name and knows two._  
_Ottoline comes up the guard stairs behind you, blinking at the sky as if it owed her money._  
**Grist**: You’re late.  
**Ottoline Vane**: Forty years.  
**Grist** _(soft)_: Thirty-nine. I counted.  
**Ottoline Vane** _(soft)_: It kept both. I wasn’t sure it would. I’m glad I was wrong about one thing this year.  

#### <a id="b-end-two-as-one-left"></a>Scene `b-end-two-as-one-left`

_You come up the guard stairs into weather nobody ordered, with one partner who answers to one name and knows two._  
_Far below, one lamp stays lit on the fourth floor, where somebody is still watching the weather. Grist writes that in the book too._  
**Grist**: One name, and it turns round for two. I’ll put it in the book twice.  

#### <a id="b-end-steady-rain-stayed"></a>Scene `b-end-steady-rain-stayed`

_You come up the guard stairs into a light rain, on time, the way it has fallen for forty years. The valley does not know what it was spared._  
_Ottoline comes up the guard stairs behind you, blinking at the sky as if it owed her money._  
**Grist**: You’re late.  
**Ottoline Vane**: Forty years.  
**Grist** _(soft)_: Thirty-nine. I counted.  
**Grist**: Rain Thursday. Rain next Thursday. I like a Thursday I can count on.  

#### <a id="b-end-steady-rain-stayed-fused"></a>Variant `b-end-steady-rain-stayed-fused`

_Variant of `b-end-steady-rain-stayed`._

_You come up the guard stairs into a light rain, on time, the way it has fallen for forty years. The valley does not know what it was spared._  
_Your one partner stands in the rain and turns round for both its names._  
_Ottoline comes up the guard stairs behind you, blinking at the sky as if it owed her money._  
**Grist**: You’re late.  
**Ottoline Vane**: Forty years.  
**Grist** _(soft)_: Thirty-nine. I counted.  
**Grist**: Rain Thursday. Rain next Thursday. I like a Thursday I can count on.  

#### <a id="b-end-steady-rain-left"></a>Scene `b-end-steady-rain-left`

_You come up the guard stairs into a light rain, on time, the way it has fallen for forty years. The valley does not know what it was spared._  
**Grist**: Rain Thursday. Rain next Thursday. I like a Thursday I can count on.  
_Far below, one lamp stays lit on the fourth floor, where somebody is still watching the weather. Grist writes that in the book too._  

#### <a id="b-end-steady-rain-left-fused"></a>Variant `b-end-steady-rain-left-fused`

_Variant of `b-end-steady-rain-left`._

_You come up the guard stairs into a light rain, on time, the way it has fallen for forty years. The valley does not know what it was spared._  
_Your one partner stands in the rain and turns round for both its names._  
**Grist**: Rain Thursday. Rain next Thursday. I like a Thursday I can count on.  
_Far below, one lamp stays lit on the fourth floor, where somebody is still watching the weather. Grist writes that in the book too._  

#### <a id="end-beetle-open-sky"></a>Ending scene `end-beetle-open-sky`

_The Beetle Road: the Open Sky._  

#### <a id="end-beetle-two-as-one"></a>Ending scene `end-beetle-two-as-one`

_The Beetle Road: Two As One._  

#### <a id="end-beetle-steady-rain"></a>Ending scene `end-beetle-steady-rain`

_The Beetle Road: Steady Rain._  

**Notes:** Bosses are dojo wins while chapters 4 and 8 are open (the rule flags them). Fusion is the journal’s Fuse button on two partners (sim/fusion.ts); refusing is the Do-it. The errand beats count the guard’s missions (`count:missionDone`), which are never goals.
