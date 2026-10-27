# Fun quests: Avatar: The Last Airbender (Q46–Q65)

## Q46. My Cabbages!

*Avatar: The Last Airbender: the cabbage merchant (running gag)* · audience: all · where: The main path through the Grove, by the race track · when: Any dry afternoon (never during Chapters 9–11)

**Cast:** The cabbage merchant (Cabbage merchant), Pemba (Aang), Tuk (Sokka)

### Step 1: Gather the cabbages scattered across the meadow and help put the cart’s wheel back on.

Hint: Cabbages roll downhill. Check the stream bank and under the bushes. · check: `collect:cabbage:8`

#### <a id="q46-crash"></a>Scene `q46-crash`

_A wooden cart creaks up the main path, piled high with cabbages. A man in a straw hat pushes it like it is made of glass._  
**The cabbage merchant** _(happy)_: Afternoon! Fine cabbages, crisp cabbages, cabbages for every occasion. Weddings. Birthdays. Snacks.  
**The cabbage merchant**: I’ve pushed this cart all over the world, and I have a very good feeling about this Grove.  
_Behind you, a Nubbin in full racing stride rounds the bend. It is not looking where it is going. It never is._  
_There is a thud, a wobble, and a long, slow tip. Cabbages roll in every direction._  
**The cabbage merchant** _(shock)_: My cabbages!  
_Your Nubbin sits up in the wreckage wearing a cabbage leaf like a hat, very pleased with itself._  
**The cabbage merchant** _(sad)_: The wheel’s come off. And they’re all over the meadow. Some of them are in the stream.  

**Choices**

- **Apologise for your Nubbin**
    - **You**: Sorry. It’s still learning about corners.
    - **The cabbage merchant**: Corners. Yes. A lot of people are still learning about corners.
- **Offer to buy the dented ones** — sets `{"q46-bought-dented":true}`
    - **The cabbage merchant**: Dented cabbages are still cabbages! That is my whole philosophy.
- **Point out that this is the race track**
    - **You**: In fairness, this is the race track.
    - **The cabbage merchant**: In fairness, I didn’t see a sign.
    - There is a sign. It is very large. He is standing on it.

#### <a id="q46-crash-done"></a>Done `q46-crash-done`

_You slot the wheel back on the axle. The cart stands up straight, and so does the merchant._  
**The cabbage merchant** _(happy)_: All eight! Only slightly muddy. You have a gift.  

### Step 2: Shake the big fruit tree bare, then repair the cabbage cart with planks and rope.

Hint: Tap the tree until nothing else falls. Planks and rope are in the shed by the gate. · check: `repair:cabbage-cart`

#### <a id="q46-fruit"></a>Scene `q46-fruit`

_The merchant parks his cart under the big fruit tree, well away from the race track._  
**The cabbage merchant**: Shade, peace and quiet. Nothing can go wrong in the shade.  
_A breeze stirs the branches. High above the cart, something round and heavy wobbles on its stalk._  
**The cabbage merchant** _(think)_: Is that tree looking at me?  
_The fruit drops. It is very large. It lands squarely on the cart, which folds neatly in half._  
**The cabbage merchant** _(sad)_: …I’m not going to say it. I’m saving it for something worse.  
_He picks the fruit out of the wreckage, sniffs it, and hands it to your Nubbin, who eats it at once._  
**The cabbage merchant**: Right. Planks, rope, and someone to shake that tree empty before I park under it again.  

#### <a id="q46-fruit-done"></a>Done `q46-fruit-done`

**The cabbage merchant** _(happy)_: Good as new. Better than new. New had a squeak.  
**The cabbage merchant** _(think)_: From now on I park in the middle of the meadow. Nothing falls on you in the middle of a meadow.  
_Somewhere very high above the meadow, a bird considers this._  
_Your Nubbins share the fallen fruit and watch him polish a cabbage on his sleeve._  

### Step 3: Build the merchant a cabbage cart that cannot tip over.

Hint: You need four planks, two wheels and a sack of stones for weight. Tuk’s diagram is in your journal. · check: `craft:cabbage-cart:untippable`

#### <a id="q46-glider"></a>Scene `q46-glider`

_Overhead, a shadow swoops in a wide, happy circle. A boy in orange and yellow is riding the wind on a wooden glider._  
**Pemba** _(happy)_: Hi! Hello! Nice Grove! Is that a vegetable stall? I love vegetables!  
_He banks to wave. The glider dips. You can see exactly where this is going, and so can the merchant._  
**The cabbage merchant** _(shock)_: No, no, no, no—  
_Pemba lands, rolls, and bounces off the cart. The cart does not bounce. It bursts into cabbages._  
**The cabbage merchant** _(angry)_: My cabbages!  
**Pemba** _(sad)_: Oh no. That was me, wasn’t it? I’m Pemba. I’m really sorry. Can I help? I’m good at helping.  
_A boy with a boomerang on his back jogs up, out of breath, and takes in the scene._  
**Tuk**: Let me guess. You saw a cart and thought, “That looks soft.”  
**The cabbage merchant** _(think)_: Three times in one afternoon. What I need is a cart that cannot tip. Not for Nubbins, not for fruit, not for flying boys.  
**Tuk** _(happy)_: Now that is a problem I can plan for. I’ve got diagrams. I’ve always got diagrams.  
**The cabbage merchant** _(think)_: Thirty-one carts, I’ve lost. Every one taught me something. The first taught me wheels. The ninth taught me rope.  

**Choices**

- **Make it wide** — sets `{"q46-cart":"wide"}`
    - **Tuk**: Wide. Good. Like a duck sitting down. Ducks never tip over.
- **Make it low** — sets `{"q46-cart":"low"}`
    - **Tuk**: Low wheels, heavy bottom. You can’t knock over something that’s already nearly lying down.
- **Give it a warning bell** — sets `{"q46-cart":"bell"}`
    - **The cabbage merchant**: A bell! So they hear me coming!
    - **Tuk**: Fine. A bell. But it’s also going to be wide and low, because I have standards.

#### <a id="q46-glider-done"></a>Done `q46-glider-done`

_The new cart sits low and wide, like a sensible duck._  
**Pemba** _(happy)_: Can I test it? I want to test it. Please let me test it.  

### Complete

#### <a id="q46-complete"></a>Complete `q46-complete`

_Pemba takes a run-up and throws himself at the cart with all his might._  
_He bounces off. The cart doesn’t move. Not one cabbage stirs._  
**The cabbage merchant** _(happy)_: It holds! It holds! Oh, it’s beautiful. I could weep. I might weep.  
**Pemba**: Doesn’t it make you want to give up? Losing everything, over and over?  
**The cabbage merchant** _(soft)_: Every time I lose the lot, somebody stops to help me pick it up. I’ve met half the world that way.  
**Tuk**: Everybody laughs at diagrams until the diagrams work.  
**The cabbage merchant**: Keep the old cart, friend. Put cabbages in it. It deserves a quiet retirement after the day it’s had.  
_The old cart is yours now, a planter on wheels. Somehow, you’ve also picked up his favourite cry of despair._  
**Pemba** _(happy)_: Do the cry! Do it at something small! Like a dropped spoon!  

**Rewards**

- Cabbage cart (decor): The merchant’s old cart, patched up and planted with cabbages. Nubbins like to sit in it.
- “My cabbages!” emote (cosmetic): Your Keeper throws both arms at the sky and wails over a lost cabbage. In the Learning Grove the wail is “Not the cabbages!”

**Learning Grove swaps**

- `q46-crash#5` → Not the cabbages! Not again!
- `q46-glider#5` → Oh, my poor leafy darlings!

**Notes:** Three wrecks in one afternoon: keep the steps back to back. Cart wreck needs a tip-over animation and a cabbage scatter (8 pickups, some in the stream). Step 2 crash: one oversized fruit sprite. Step 3: Pemba glides in from off-screen. The cart-style choice (q46-cart) pays off in q46-complete: with “bell” the bell goes TING after the bounce (a line inserted by flag; wide and low share the base lines). The emote’s voice line uses the childLines text in the Learning Grove.

## Q47. The Secret Tunnel

*Avatar: The Last Airbender: The Cave of Two Lovers* · audience: all · where: The foot of the ridge, by the waterfall · when: Any evening (never during Chapters 9–11) · requires: Q46

**Cast:** Wandering Juno (Chong), Nalu (Katara), Tuk (Sokka), Pemba (Aang)

### Step 1: Follow the singing nomads into the tunnel under the ridge.

Hint: The tunnel mouth is behind the waterfall at the foot of the ridge. Bring at least one Nubbin. · check: `visit:ridge-tunnel`

#### <a id="q47-nomads"></a>Scene `q47-nomads`

_A painted wagon rolls up to the foot of the ridge, jingling with bells. Three nomads lounge on top, one tuning a lute._  
**Wandering Juno** _(happy)_: Greetings, travellers! I’m Juno. We go where the wind goes. Today the wind is going under that hill.  
**Tuk**: There’s a perfectly good path over the hill.  
**Wandering Juno**: Over is for people in a hurry. Under is for people with stories. Also, the path has a goat on it. A mean one.  
**Nalu**: Is the tunnel safe?  
**Wandering Juno** _(soft)_: Safe as a song, friend. Here, I’ll sing you the one about it.  
**Wandering Juno**: ♪ Under the hill, under the hill,  
**Wandering Juno**: ♪ The rocks are cold and the bats keep still.  
**Wandering Juno**: ♪ Bring a snack and bring a mate,  
**Wandering Juno**: ♪ Don’t let go or you’ll be late—  
**Wandering Juno** _(happy)_: ♪ Doo-be-doo, the moss is blue, under the hill with you!  
**Tuk**: That song has no useful information in it.  
_Pemba is already humming it. So is your Nubbin. You suspect you will be humming it for a week._  

**Choices**

- **Join in on the doo-be-doo** — sets `{"q47-sang":true}`
    - **Wandering Juno**: A natural! The moss approves.
- **Ask how long the tunnel is**
    - **Wandering Juno**: Long enough to have a good time. Short enough to come out the other side. Probably.
    - **Tuk**: “Probably” is my least favourite word.
- **Ask about the goat**
    - **Wandering Juno**: He bit my lute once. We don’t talk about it.

#### <a id="q47-nomads-done"></a>Done `q47-nomads-done`

_The tunnel swallows the last of the daylight. Tuk’s torch flickers, sputters, and goes out._  
**Tuk** _(angry)_: Of course. Of course it does.  
**Wandering Juno**: Ah. This is the part of the song we haven’t written yet.  

### Step 2: Find the way out of the crystal maze, keeping a Nubbin beside you so the crystals stay lit.

Hint: If your Nubbin wanders more than a step away, the light goes out. Stop and call it back. · check: `minigame:complete:crystal-maze`

#### <a id="q47-crystals"></a>Scene `q47-crystals`

_It is very dark. Somewhere ahead, water drips, and something with too many wings flaps away._  
**Nalu**: Everyone stay close. Pemba, stop humming.  
**Pemba**: I’m not humming. That’s Tuk.  
**Tuk**: It’s a stress hum. It’s different.  
_Your Nubbin presses against your leg. Where it touches you, the wall beside you starts to glow a soft green._  
_You step apart. The glow fades. You step together. It comes back, brighter._  
**Nalu** _(shock)_: The crystals. They only light up when two friends are close together.  
**Wandering Juno** _(happy)_: So that’s why we always come down here in pairs. I thought it was for the snacks.  
**Tuk** _(think)_: So the plan is “stay together and walk”. That’s… a good plan. I’m annoyed I didn’t think of it.  
**Tuk**: Also. For the record. I hum when I’m scared. Of the dark. There. Now everybody knows.  
**Wandering Juno** _(soft)_: Brave thing, saying that in the dark. Nobody can even see you blush.  

**Choices**

- **Pick your Nubbin up and carry it**
    - Your Nubbin settles into your arms. The whole wall lights up like a lantern.
- **Hold its paw and walk side by side**
    - Your Nubbin grips your finger tightly. The crystals glow a steady green.
- **Make Tuk hold Pemba’s hand** — sets `{"q47-tuk-pemba":true}`
    - **Tuk**: Fine. Fine! But nobody tells anyone about this.
    - **Pemba**: I’m going to tell everyone.

#### <a id="q47-crystals-done"></a>Done `q47-crystals-done`

_A crack of daylight. You squeeze through into warm air, blinking. Your Nubbin doesn’t let go._  
**Wandering Juno** _(happy)_: See? Out the other side. I said probably.  

### Complete

#### <a id="q47-complete"></a>Complete `q47-complete`

_The nomads wave goodbye from the far side of the ridge, singing their song again, slightly wrong._  
**Nalu** _(soft)_: Take some of these. They broke off on the way out.  
_She hands you a pouch of crystal shards. They glow faintly whenever two friends sit near them._  
**Tuk**: And now there’s a tunnel between two of your sections. You can thank me for not getting us lost.  
**Pemba**: You were humming the whole time.  
**Tuk**: Strategically.  
**Wandering Juno** _(happy)_: Remember, friends: the dark’s only scary when you’re alone in it. Doo-be-doo!  

**Rewards**

- Glowing crystals (decor): Crystal shards that glow green when two Nubbins (or a Nubbin and you) are close by.
- Crystal cave path (feature): A short tunnel under the ridge linking two sections of the Grove. Its crystals light up as friends pass in pairs.

**Notes:** The song is ORIGINAL (q47-nomads lines 6–10): sing to a simple lute loop, one line per box. Maze: darkness with a small light radius that only shows while the nearest Nubbin is within one tile of the Keeper. Implementer chooses which two sections the cave path joins. No real song lyrics anywhere in this quest.

## Q48. The Great Divide

*Avatar: The Last Airbender: The Great Divide* · audience: all · where: The canyon at the edge of the rocky section · when: Any day (never during Chapters 9–11) · requires: Q46

**Cast:** Pemba (Aang), Tuk (Sokka), Nalu (Katara), Elder Maud (Gan Jin tribe leader), Chief Brack (Zhang tribe leader)

### Step 1: Lead both clans down the canyon path without a fight breaking out.

Hint: Walk between the two groups. When tempers rise, stop for a rest. · check: `escort:canyon-clans`

#### <a id="q48-canyon"></a>Scene `q48-canyon`

_Two groups of travellers stand at the top of the canyon, glaring at each other across a pile of luggage._  
**Elder Maud**: The Hollins will go first. We are clean, orderly, and we fold our socks.  
**Chief Brack** _(angry)_: The Drays will go first. We are honest, hardy, and we don’t own socks.  
**Elder Maud**: That is not the boast you think it is.  
**Tuk**: The canyon guide quit this morning. Something about a sprained everything. So, who wants to guide?  
**Pemba** _(happy)_: Me! How hard can it be? It’s just walking downhill with people who hate each other.  
**Nalu**: Pemba, please don’t say that part out loud.  
**Chief Brack**: Fine. But no Hollin food in the canyon. They cook with too much… tidiness.  
**Elder Maud**: And no Dray food. It smells of grudge.  

**Choices**

- **Let the Hollins go first** — sets `{"q48-first":"hollins"}`
    - **Chief Brack**: Typical.
    - The Drays follow, loudly, two steps behind.
- **Let the Drays go first** — sets `{"q48-first":"drays"}`
    - **Elder Maud**: Of course.
    - The Hollins follow, sniffing, two steps behind.
- **Make them walk side by side** — sets `{"q48-first":"together"}`
    - **Elder Maud**: Absolutely not.
    - **Chief Brack**: Absolutely not.
    - They walk side by side anyway, because the path is narrow. Neither speaks.

#### <a id="q48-canyon-done"></a>Done `q48-canyon-done`

_You reach the canyon floor at dusk. Nobody has pushed anybody off anything. It feels like a miracle._  
**Tuk**: Day one. Zero shoves. I’m putting that on a sign.  
**Elder Maud**: The Hollins will camp on the left.  
**Chief Brack** _(angry)_: Then the Drays will camp on the left of the left.  
**Nalu**: That’s… the same place. You’re all camping in the same place.  

### Step 2: Keep a straight face while Pemba finishes his story about the clans’ ancestors.

Hint: Tap only when the laugh meter is in the green. Looking at your Nubbin makes it worse. · check: `minigame:complete:straight-face`

#### <a id="q48-story"></a>Scene `q48-story`

_Around the campfire, a Hollin child and a Dray child both reach for the last dumpling._  
_Within seconds it is a food fight. Rice flies. Somebody throws a sandal. Your Nubbin catches it, thrilled._  
**Elder Maud** _(angry)_: Your ancestor stole our ancestor’s ball! Two hundred years ago! It was a very good ball!  
**Chief Brack** _(angry)_: Your ancestor kicked it into the river first!  
**Pemba**: WAIT. I… knew them. Your ancestors. Personally. Sort of. Through, um, spirit ways.  
**Tuk** _(think)_: He did not know them.  
**Pemba**: They weren’t enemies. They were twins! The ball wasn’t stolen. It was a game. Whoever caught it chose dinner.  
**Pemba** _(happy)_: And when one fell in the river, the other jumped in after. They laughed so hard the canyon cracked open.  
_Every face in the firelight turns to you, the only other witness. Pemba gives you a desperate look._  

**Choices**

- **Add a detail: “They both sang terribly.”** — sets `{"q48-story":"detail"}`
    - **Chief Brack**: The Drays sing terribly!
    - **Elder Maud**: So do the Hollins!
- **Nod slowly and solemnly** — sets `{"q48-story":"nod"}`
    - You nod like someone who has seen the truth. It is the hardest thing you have ever done.
- **Cover a laugh with a cough** — sets `{"q48-story":"cough"}`
    - You cough. Pemba coughs louder, to cover your cough. Somehow, it works.

#### <a id="q48-story-done"></a>Done `q48-story-done`

**Elder Maud** _(soft)_: Twins. All this time.  
**Chief Brack** _(soft)_: Pass the dumplings, cousin.  
**Nalu**: (whispering) Pemba, this is wrong. It isn’t true. They deserve to know it isn’t true.  
**Pemba**: (whispering) But look at them. They’re sharing a blanket.  

**Choices**

- **Tell the clans the story was made up** — sets `{"q48-truth":"told"}`
    - **Elder Maud**: Of course it was made up, guide. Twins don’t argue about socks for two hundred years.
    - **Chief Brack**: But it’s a better story than the one we had. We’re keeping it.
    - **Nalu**: …Oh. I didn’t think of that.
- **Keep Pemba’s secret** — sets `{"q48-truth":"kept"}`
    - **Nalu**: Fine. But if it falls apart, it falls on you, Pemba.
    - **Pemba**: Then I’ll be the one who tells them. Promise. Just not during dumplings.

### Complete

#### <a id="q48-complete"></a>Complete `q48-complete`

_In the morning the two clans climb out of the canyon together, arguing happily about which twin was taller._  
**Tuk**: Did you make all of that up?  
**Pemba** _(happy)_: Every single word.  
**Nalu**: Pemba!  
**Pemba**: What? They’re sharing socks now. Look.  
_Chief Brack is, in fact, wearing socks. He seems confused, but open to it._  
**Elder Maud**: Take this, guide. And we’ll build a bridge, so nobody has to argue down there ever again.  
_She presses a wide-brimmed canyon guide’s hat into your hands. By evening, a rope bridge spans the gap._  

**Rewards**

- Canyon guide’s hat (cosmetic): A wide-brimmed, sun-faded hat for your Keeper. Comes with an air of knowing the way.
- Rope bridge (feature): A swaying rope bridge across the canyon, joining the rocky section to its neighbour.

**Notes:** Escort: two NPC groups that drift apart and grumble; standing between them calms a “tension” bar. Straight-face minigame: a laugh meter that rises with each of Pemba’s lines; tap in the green to hold it. Pemba’s ancestor story is invented in-world (he admits it); keep the tone light. q48-truth (told / kept) is the quest’s real question: is a kind invention ever fine? It is paid off in q48-complete (a Nalu line inserted by flag: kept, “You promised to tell them”; told, “They knew all along”). If told, the clans reveal they guessed, and keep the story anyway.

## Q49. Flameo, Hotman

*Avatar: The Last Airbender: The Headband* · audience: all · where: The schoolhouse at the edge of the Grove · when: Any weekday morning (never during Chapters 9–11) · requires: Q46, Q64

**Cast:** Pemba (Aang), Kaito (Zuko), The Headmaster (Fire Nation school headmaster), Rin (On Ji)

### Step 1: Hand out five secret party invitations without the headmaster noticing.

Hint: Wait until his back is turned at the board. Students by the window are easiest to reach. · check: `deliver:party-invite:5`

#### <a id="q49-school"></a>Scene `q49-school`

_The schoolhouse bell rings. Rows of children sit very straight, hands folded, faces blank._  
**Kaito**: I went here. For a term. Before… you know. Everything.  
**Kaito** _(think)_: The rules haven’t changed. No running. No humming. No unauthorised enthusiasm.  
_A boy slips into the back row in a red headband pulled low over a blue arrow tattoo. It is not a good disguise._  
**Pemba** _(happy)_: Hi! I’m new! I’m, er, Kuzo! From… the big town! Where the things are!  
**The Headmaster** _(angry)_: New boy. In this school we do not dance, we do not sing, and we do not say “hi”.  
**Pemba**: Not even a little dance? With your shoulders?  
**The Headmaster**: Especially not with your shoulders.  
**Rin** _(soft)_: (whispering) What’s a dance?  
**Pemba** _(shock)_: Oh, that’s it. We’re throwing a party.  

**Choices**

- **Hide invitations in lunch boxes** — sets `{"q49-invite":"lunch"}`
    - **Kaito**: Sneaky. I approve. I think. Is approving allowed?
- **Fold them into paper birds** — sets `{"q49-invite":"birds"}`
    - The paper birds sail over the headmaster’s head. He swats at one and misses.
- **Let Kaito deliver them** — sets `{"q49-invite":"kaito"}`
    - **Kaito**: Hi. You. Party. Cave. Tonight. Don’t… tell. Okay. Bye.
    - Somehow, everyone still says yes.

#### <a id="q49-school-done"></a>Done `q49-school-done`

**Rin** _(happy)_: A cave? At night? Is that allowed?  
**Pemba** _(happy)_: Nope!  

### Step 2: Keep the party going: hit the beats in time to get everyone dancing.

Hint: Tap when the drum ring closes. Missed beats make shy dancers drift back to the wall. · check: `minigame:score:cave-dance:300`

#### <a id="q49-party"></a>Scene `q49-party`

_The cave behind the waterfall is full of nervous children standing flat against the walls._  
_Your Nubbins have brought drums. Well, buckets. They are hitting the buckets._  
**Pemba**: Okay! Dancing is easy. You feel the beat and let your body tell you what to do.  
**Rin** _(shock)_: My body is telling me to leave.  
**Kaito**: Mine too. Pemba, I don’t dance. I don’t think I physically can.  
**Pemba** _(happy)_: Everybody can dance! It’s just moving on purpose. Watch the Nubbins.  
_Your Nubbins wiggle, stomp and spin in time with the buckets. One by one, the children start copying them._  
**Kaito** _(think)_: …Is this right? Am I doing it? My arms feel like someone else’s.  

#### <a id="q49-party-done"></a>Done `q49-party-done`

_Then the headmaster bursts into the cave with a lantern._  
**The Headmaster** _(angry)_: WHAT is going ON in here?  
_The buckets stop. Every child freezes mid-wiggle. Kaito, very slowly, lowers his arms._  

**Choices**

- **Get everyone dancing in front of Pemba** — sets `{"q49-escape":"cover"}`
    - Every child dances at once, a wall of whirling arms, and Pemba slips out the back.
- **Let Kaito speak** — sets `{"q49-escape":"kaito"}`
    - **Kaito**: Sir. I sat in your front row for a whole term. I followed every rule. I was miserable.
    - **Kaito**: Rules are fine. I like some rules. But they should be for us. Not instead of us.
    - **The Headmaster**: …Ten minutes. Then everybody goes home.
    - He stays for twelve. Nobody sees his foot tapping, except you. Pemba slips out the back anyway, out of habit.
- **Ask the headmaster to dance** — sets `{"q49-escape":"invite"}`
    - **The Headmaster**: I most certainly will not.
    - His shoulders, very slightly, do. In the confusion, Pemba slips out the back.

### Complete

#### <a id="q49-complete"></a>Complete `q49-complete`

_Outside, under the stars, the children spill out laughing. Nobody is in trouble. Nobody has ever had this much fun._  
**Rin** _(happy)_: We danced! Kuzo, we actually danced!  
**Pemba** _(happy)_: You were amazing. All of you.  
**Pemba** _(happy)_: Flameo, hotman!  
**Kaito** _(think)_: I don’t know what that means, and I’m not going to ask.  
_Pemba pulls off the red headband and ties it round your wrist. Your Nubbins are still wiggling._  

**Rewards**

- Red headband (cosmetic): A plain red headband, worn low. A terrible disguise, a great look.
- Flameo dance emote (cosmetic): Your Keeper does Pemba’s little shoulder dance. Nearby Nubbins join in.

**Learning Grove swaps**

- `q49-complete#3` → You were all on fire tonight! The good kind!

**Notes:** Rhythm minigame: buckets as drums, closing ring timing, dancers peel off the cave wall as the combo grows. In the Learning Grove consider labelling the emote “Shoulder dance” so the quote stays out of child mode. q49-escape (cover / kaito / invite) is flavour; “kaito” is Kaito’s growth beat, so give his two lines a soft portrait.

## Q50. The Jasmine Dragon

*Avatar: The Last Airbender: Iroh’s tea shop in Ba Sing Se* · audience: all · where: The meadow by the pond · when: Any morning (never during Chapters 9–11) · requires: Q46, Q64

**Cast:** Uncle Tenzo (Iroh), Kaito (Zuko), Old Mr Pell

### Step 1: Brew three perfect cups of tea for Uncle Tenzo’s opening morning.

Hint: Lift the kettle when the steam curls, not when it roars. Pull the leaves as the colour turns gold. · check: `minigame:perfect:tea-brewing:3`

#### <a id="q50-open"></a>Scene `q50-open`

_A little wooden stall has appeared by the pond overnight, with a hand-painted sign and a kettle already singing._  
**Uncle Tenzo** _(happy)_: Ah, the Keeper! Welcome to my tea shop. I have retired from generalling, you see. Now I only command leaves.  
**Kaito**: He’s been up since four. He painted the sign twice. The dragon looked “too fierce”.  
**Uncle Tenzo**: A tea shop should not frighten its customers. That is the job of the prices.  
**Uncle Tenzo** _(soft)_: Good tea is simple. The water must be hot, but not angry. The leaves must steep, but not sulk.  
**Kaito**: That makes no sense.  
**Uncle Tenzo**: It will, nephew. After the third cup, everything does.  
_Your Nubbin climbs onto a stool and sniffs the tea tins one by one, sneezing at the ginger._  

**Choices**

- **Start with jasmine** — sets `{"q50-first":"jasmine"}`
    - **Uncle Tenzo**: A fine choice. Jasmine forgives most mistakes, like a good friend.
- **Start with ginger** — sets `{"q50-first":"ginger"}`
    - **Uncle Tenzo**: Bold! Ginger is a tea that tells you exactly what it thinks of you.
- **Ask Kaito which tea he likes**
    - **Kaito**: I… don’t really like tea.
    - Uncle Tenzo staggers and clutches the counter, as if struck.

#### <a id="q50-open-done"></a>Done `q50-open-done`

**Uncle Tenzo** _(happy)_: Three perfect cups. My heart is warm, and so is my tongue.  
**Kaito**: You burnt your tongue again.  
**Uncle Tenzo**: For art.  

### Step 2: Serve Old Mr Pell a cup of tea and keep him in his seat until he’s finished.

Hint: Watch his face. A grumble means the tea is too hot; a sigh means it is just right. · check: `serve:tea:mr-pell`

#### <a id="q50-grump"></a>Scene `q50-grump`

_The stall’s first customer arrives: an old man with a walking stick and a face like a closed door._  
**Old Mr Pell** _(angry)_: Tea. Not fancy tea. Not flowery tea. And not with a speech, either.  
**Uncle Tenzo** _(happy)_: Of course, of course. Please sit. The Keeper will serve you personally.  
**Old Mr Pell**: Last place I went, the tea tasted of boiled sock.  
**Kaito** _(angry)_: Then go back to the sock place.  
**Uncle Tenzo**: Nephew. A bitter guest is only a sweet guest who has not been served yet.  
**Kaito** _(think)_: …Is that a real saying?  
**Uncle Tenzo**: It is now.  

**Choices**

- **Serve him jasmine** — sets `{"q50-pell":"jasmine"}`
    - **Old Mr Pell**: Flowery. I said no flowery.
    - He drinks it all anyway, and holds out the cup for more.
- **Serve him strong black tea** — sets `{"q50-pell":"black"}`
    - **Old Mr Pell**: Hm. Finally, a tea with a spine.
- **Ask what tea he drank as a boy** — sets `{"q50-pell":"barley"}`
    - **Old Mr Pell**: My mother made barley tea. Nobody makes barley tea any more.
    - **Uncle Tenzo**: I have barley! I have everything!

#### <a id="q50-grump-done"></a>Done `q50-grump-done`

**Old Mr Pell**: …Not bad.  
_From Old Mr Pell, this is a standing ovation._  
_He counts coins onto the counter. He is two short, and he pretends very hard not to notice._  
**Uncle Tenzo**: (quietly) Your stall today, Keeper. Your call.  

**Choices**

- **Tell him this one is on the house** — sets `{"q50-pay":"free"}`
    - **Old Mr Pell**: I don’t take charity.
    - **Uncle Tenzo**: It is not charity. It is a deposit on tomorrow.
    - **Old Mr Pell**: …Hm. Tomorrow, then.
- **Kindly ask him for the rest tomorrow** — sets `{"q50-pay":"later"}`
    - **Old Mr Pell**: Fair. A shop that gives everything away doesn’t stay a shop.
    - **Uncle Tenzo**: And a fair price, gently asked, is its own kind of kindness.
- **Ask him to fix the wobbly stool instead** — sets `{"q50-pay":"trade"}`
    - **Old Mr Pell**: That stool has been wobbling since you opened. I noticed. I notice everything.
    - He fixes it with a folded leaf and the end of his walking stick. It never wobbles again.

### Complete

#### <a id="q50-complete"></a>Complete `q50-complete`

_By noon the stall is full. Your Nubbins doze in a row under the counter, warm as buns._  
**Uncle Tenzo** _(soft)_: You have a gift, Keeper. Tea is only leaves and water. The rest is paying attention.  
**Uncle Tenzo**: The stall is yours to keep. I will visit often. I will also drink a great deal of the stock.  
**Kaito**: He means all of the stock.  
_Kaito refills Mr Pell’s cup without being asked. Uncle Tenzo pretends not to see, and glows like a lantern._  
_He hands you a tin of jasmine tea with a dragon on the lid. The dragon is not fierce at all._  
**Old Mr Pell**: Same time tomorrow. Don’t be late.  

**Rewards**

- Tea stall (decor): Uncle Tenzo’s little wooden tea stall, with a kettle that steams on cold mornings.
- Jasmine tea (item): Give it to a Nubbin: a calm Nubbin curls up and naps on the spot.

**Notes:** Tea minigame: three timing bars (heat, steep, pour); “perfect” = all three in the gold band. Mr Pell can visit the stall again afterwards as an ambient NPC. All of Uncle Tenzo’s sayings here are new. q50-pay (free / later / trade): if “trade”, the stall’s stool stops wobbling.

## Q51. Cactus Juice

*Avatar: The Last Airbender: The Desert* · audience: all · where: The desert section · when: Any hot afternoon (never during Chapters 9–11) · requires: Q46

**Cast:** Tuk (Sokka), Nalu (Katara), Pemba (Aang)

### Step 1: Keep Tuk in the shade of the big rock until Nalu comes back.

Hint: Stand between Tuk and the open sand. Shiny things distract him; your Nubbin is shiny enough. · check: `minigame:complete:herd-tuk`

#### <a id="q51-desert"></a>Scene `q51-desert`

_The desert stretches flat and gold in every direction. Your water skins are empty._  
**Nalu**: Right. I’m going to find water. Rule one, which Tuk wrote and made us sign: nobody eats anything strange. Tuk, that means you.  
**Tuk**: Me? I’m the responsible one. I have a schedule.  
_Nalu leaves. Tuk eyes a fat green cactus. Thirty seconds pass._  
**Tuk**: You know what cacti are full of? Juice. Survival juice. It would be irresponsible not to.  
_He cracks one open with his boomerang and drinks deeply. His eyes go very wide._  
**Tuk** _(happy)_: It's the quenchiest!  
**Pemba**: Tuk, why are you smiling at that rock?  
**Tuk** _(happy)_: Because it’s smiling at me, Pemba. It started it.  
_Tuk sets off across the sand, waving at a cloud. Your Nubbin trots after him, delighted._  

**Choices**

- **Agree the cloud looks friendly** — sets `{"q51-cloud":true}`
    - **Tuk**: Thank you. Finally, someone who listens.
- **Take the cactus away from him**
    - **Tuk**: You can take the cactus. You can’t take the feeling.
- **Have a tiny sip yourself** — sets `{"q51-sip":true}`
    - You lift the cup, smell it, and think better of it. Your Nubbin licks the rim and sneezes.

#### <a id="q51-desert-done"></a>Done `q51-desert-done`

_Nalu comes back with full water skins and stops dead._  
**Nalu** _(angry)_: I was gone ten minutes.  
**Tuk** _(happy)_: Nalu! You look like a giant talking fish!  
**Nalu** _(angry)_: You made the rule, Tuk! You wrote it on a list! You made me sign the list!  

**Choices**

- **Stick up for Tuk: he was really thirsty** — sets `{"q51-side":"tuk"}`
    - **Nalu**: So was I. So was everyone. That’s why we had a rule.
    - **Tuk**: Thank you, friend. Your face is a melon. A kind melon.
- **Back Nalu: he broke his own rule** — sets `{"q51-side":"nalu"}`
    - **Tuk**: …She’s right. I hate it when the giant fish is right.

### Step 2: Collect three cactus cuttings to plant back at the Grove.

Hint: Cut the small side pads, not the big trunk. Gloves help; so does a patient Nubbin. · check: `collect:cactus-cutting:3`

#### <a id="q51-cuttings"></a>Scene `q51-cuttings`

**Nalu**: Drink this. All of it. Slowly.  
**Tuk** _(sad)_: This water’s not quenchy. It’s just wet.  
**Pemba** _(think)_: To be fair, he did seem really happy.  
**Nalu**: He tried to arm-wrestle a cactus, Pemba.  
**Tuk**: And I was winning.  
_The cactus, it turns out, is easy to grow. Small cuttings root anywhere the sun is hot._  
**Nalu** _(soft)_: Take some home. Grow them. Just keep them away from anyone with a boomerang.  

#### <a id="q51-cuttings-done"></a>Done `q51-cuttings-done`

_Three cuttings, wrapped in cloth. Your Nubbin carries one very carefully, like treasure._  

### Complete

#### <a id="q51-complete"></a>Complete `q51-complete`

_Back at the Grove, the cuttings take root in the sunniest corner. By morning they have little pink flowers._  
**Tuk**: For the record, I don’t remember anything about yesterday.  
**Pemba** _(happy)_: You asked a rock to be your best friend.  
**Tuk**: I don’t remember that.  
**Pemba** _(happy)_: It's the quenchiest!  
**Tuk** _(angry)_: Nobody says that ever again.  
**Tuk** _(think)_: Also. Turns out rules are for when you’re thirsty. Who knew.  
_The cactus juice is yours to share. One small cup makes a Nubbin wobble happily for a minute, then sit down, a bit puzzled._  

**Rewards**

- Cactus crop (feature): Cactus plants that grow in hot, dry spots of the Grove and flower pink.
- Cactus juice (item): Give it to a Nubbin: it wobbles happily for a minute, then sits down. Harmless, and very silly.

**Learning Grove swaps**

- `q51-desert#6` → Best. Drink. EVER!
- `q51-complete#4` → “Best drink ever!” You said it about forty times.

**Notes:** Herd minigame: Tuk wanders towards mirages (a “friendly” cloud, a talking rock); stand in his path or call your Nubbin to lure him back; 60–90 seconds. Cactus juice wobble is a gentle sway animation only, never sickness. The quote appears twice; both have childLines swaps. q51-side (tuk / nalu) is flavour; the lesson lands in Tuk’s last line either way.

## Q52. Puffin’s Lost Days

*Avatar: The Last Airbender: Appa’s Lost Days* · audience: all · where: The Grove gate · when: The morning after a storm (never during Chapters 9–11) · requires: Q46

**Cast:** Pemba (Aang), Tuk (Sokka), Puffin (Appa)

### Step 1: Follow Puffin’s trail across three sections of the Grove.

Hint: Look for white fur, huge footprints and flattened bushes. Your Nubbin notices clues before you do. · check: `track:puffin:3`

#### <a id="q52-gone"></a>Scene `q52-gone`

_Pemba sits on a stump by the gate, holding a huge saddle with nothing in it._  
**Pemba** _(sad)_: Puffin’s gone. The storm spooked him and he just… flew. I called and called.  
**Tuk** _(soft)_: Hey. He’s a giant six-legged sky bison. He’s not exactly hard to spot.  
**Pemba** _(sad)_: He gets scared on his own. He’s never been on his own.  
_Your Nubbin finds a tuft of white fur caught on the fence and brings it to you, very seriously._  
**Tuk**: Okay. That’s a clue. Fur here means he went that way. Let’s look for more.  
**Pemba**: You’ll help? Really?  

**Choices**

- **Promise you’ll find him**
    - **Pemba**: Thank you. He likes people who keep promises. So do I.
- **Ask how you lose something that big**
    - **Tuk**: Thank you. I asked the same thing. I got a look.
    - **Pemba**: I didn’t lose him. He got lost. It’s different.
- **Let your Nubbin lead the way** — sets `{"q52-nubbin-leads":true}`
    - Your Nubbin sniffs the fur, sneezes, and marches off confidently in the wrong direction. Then it turns round.

#### <a id="q52-gone-done"></a>Done `q52-gone-done`

_The last clue is a hill with a bison-shaped dent in it. Beyond it, in a cave, two big eyes blink in the dark._  
**Puffin** _(sad)_: Mrrrrrooooh.  

### Step 2: Win Puffin’s trust: feed him five round fruits by hand.

Hint: Move slowly and don’t run. If he backs off, sit still until he comes forward again. · check: `feed:puffin:5`

#### <a id="q52-trust"></a>Scene `q52-trust`

_Puffin is wedged in the cave mouth, trembling. When you take a step forward, he shrinks back._  
**Pemba** _(shock)_: Puffin! Buddy, it’s me! It’s—  
_Puffin flinches at the loud voice and backs further in. Pemba stops, and his face falls._  
**Tuk** _(soft)_: He’s still scared. Storms, strange places. Give him a minute.  
**Pemba** _(sad)_: He’s never been scared of me before.  
**Tuk**: He’s not scared of you. He’s scared of everything, and right now you’re part of everything.  
_Your Nubbin sits down quietly at the cave mouth, holding up a fruit. Puffin’s nose twitches._  
_Your Nubbin, still holding the fruit up, has been leaning slowly backwards._  
_It is now lying flat. The fruit has not moved._  
**Tuk** _(happy)_: That Nubbin has never been so committed to anything.  
**Pemba** _(soft)_: He loves fruit. The big round ones. He eats them whole.  

**Choices**

- **Sit down and wait**
    - You sit. You wait. A big wet nose edges closer.
- **Whistle the tune Pemba always whistles** — sets `{"q52-whistle":true}`
    - **Pemba**: That’s his bedtime whistle! How did you know?
    - Puffin’s ears flick forward.
- **Roll a fruit gently towards him**
    - The fruit rolls. A huge tongue swipes it up. Puffin looks at you as if you are suddenly very interesting.

#### <a id="q52-trust-done"></a>Done `q52-trust-done`

**Puffin** _(happy)_: Mrrrrrf!  
_Puffin pushes out of the cave and flattens Pemba under an enormous, slobbery lick._  
**Pemba** _(happy)_: I missed you too! I missed you too! Ow, my ribs!  

### Step 3: Ride Puffin home to the Grove.

Hint: Hold the reins steady and say “hup-hup”. Tilt to steer; Puffin lands on his own at the gate. · check: `ride:puffin:grove`

#### <a id="q52-home"></a>Scene `q52-home`

**Pemba**: He wants to go home. He wants you to come too. Look, he’s crouching for you.  
**Tuk**: Sure. Just climb up a nervous animal the size of a house. Totally normal day.  
_Puffin rumbles beneath you like a warm mountain. Your Nubbin clings to the saddle, eyes huge._  
**Pemba** _(happy)_: The word is “hup-hup”. Say it like you mean it.  
**Tuk**: Or just scream. Screaming also works.  
_Puffin shifts his six legs, ready. The whole saddle sways._  

#### <a id="q52-home-done"></a>Done `q52-home-done`

_The Grove spreads out below you, tiny and green. Every Nubbin in it looks up._  
_Puffin lands at the gate with a thump that shakes fruit from every tree._  
_Pemba’s eyes are wet. He says it is the wind. Tuk, very kindly, agrees that it was windy._  

### Complete

#### <a id="q52-complete"></a>Complete `q52-complete`

**Pemba** _(soft)_: Thank you. Really. I don’t know what I’d do without him.  
**Pemba** _(sad)_: I keep thinking it was my fault. If I’d held on tighter in the storm…  
**Tuk** _(soft)_: You can’t hold on to a storm, Pemba. You can only be the one who comes looking afterwards. You did that.  
_Puffin lowers his huge head and rests it on your shoulder. It weighs about as much as a cart._  
**Pemba** _(happy)_: He likes you now. That means he’ll come when you call. Anywhere in the Grove.  
**Tuk**: He means you get a giant flying taxi. Congratulations. Mind the fur, it gets everywhere.  
_A white tuft drifts down onto your Nubbin’s head. Your Nubbin refuses to let you remove it._  

**Rewards**

- Sky bison travel (feature): Call Puffin from any section and fly to any other in seconds.

**Notes:** Puffin is a giant six-legged flying bison (large sprite, sky-bison groan SFX). Trail: three clue spots in three different sections, picked by the implementer. Trust: Puffin backs off if the Keeper runs or a Nubbin is thrown nearby. The ride is a short on-rails flight back to the gate, unlocking fast travel.

## Q53. The Fan Warriors

*Avatar: The Last Airbender: The Warriors of Kyoshi* · audience: all · where: The karate dojo yard · when: Any morning (never during Chapters 9–11) · requires: Q46

**Cast:** Tuk (Sokka), Sumi (Suki)

### Step 1: Join the fan-warriors’ morning drill and finish it without dropping your fan.

Hint: Copy the warrior at the front. Open, sweep, close: the rhythm is slower than it looks. · check: `train:fan-drill`

#### <a id="q53-flattened"></a>Scene `q53-flattened`

_In the dojo yard, warriors in green with painted faces move through a drill in perfect time, steel fans flashing._  
**Tuk** _(happy)_: Oh, that’s adorable. Fan dancing! Do you also do a ribbon routine?  
**Sumi**: We’re the fan-warriors. I’m Sumi. And that’s the last joke you get.  
**Tuk**: Okay, okay. But come on. Fans. Like it’s hot. I’m the one with the boomerang.  
**Sumi**: Would you like to try me?  
**Tuk**: I don’t want to hurt you.  
_Three seconds later, Tuk is flat on his back in the sand, a closed fan resting gently on his nose._  
**Tuk** _(shock)_: …What just happened.  
**Sumi**: You fought me. Briefly.  

**Choices**

- **Laugh** — sets `{"q53-laughed":true}`
    - **Tuk**: Thanks. Really feeling the support.
- **Help Tuk up**
    - **Tuk**: Thanks. My pride is still down there. Leave it.
- **Ask Sumi to teach you**
    - **Sumi**: You I like. Him, we’ll see.
    - **Tuk**: “Him” is lying right here.

#### <a id="q53-flattened-done"></a>Done `q53-flattened-done`

**Sumi**: Not bad. You’ve got patience.  
**Tuk**: I want to train too. Properly.  
**Sumi**: Then you wear the uniform. All of it.  
**Tuk** _(shock)_: …All of it?  

### Step 2: Win a sparring bout against Sumi using fan-blocks.

Hint: Block just as her strike lands to turn it aside. Don’t attack first; let her come to you. · check: `karate:win:sumi-spar`

#### <a id="q53-uniform"></a>Scene `q53-uniform`

_Tuk steps out of the hut in a green robe, a headpiece and full white-and-red face paint. He looks magnificent._  
_He knows it, and he hates that he knows it._  
**Tuk**: Not. One. Word.  
**Sumi**: The uniform isn’t a costume. The paint says you won’t hide who you are.  
**Tuk** _(think)_: What does the headpiece say?  
**Sumi**: It says you need a haircut.  
_Your Nubbin has also been painted. Someone gave it a tiny fan. It is taking this extremely seriously._  
**Sumi**: Last lesson. Don’t stop the punch. Move it somewhere else.  
**Sumi** _(happy)_: Spar with me, and find out.  

**Choices**

- **Let Tuk go first**
    - Tuk charges. Sumi steps aside. Tuk keeps going for quite a while.
- **Step up yourself**
    - **Sumi**: Good. Breathe. Watch my shoulder, not my fan.
- **Send in your painted Nubbin** — sets `{"q53-nubbin-spar":true}`
    - **Sumi**: Ha! Fearless. Come on then, little warrior.

#### <a id="q53-uniform-done"></a>Done `q53-uniform-done`

**Sumi** _(happy)_: Well. Look at you. You’d pass for a fan-warrior. Almost.  
**Tuk**: Almost? I’m wearing face paint.  
**Sumi** _(soft)_: The paint isn’t for scaring anyone. It’s so the warrior beside you always knows it’s you. That part you’ve got.  

### Complete

#### <a id="q53-complete"></a>Complete `q53-complete`

**Tuk**: Sumi. I was wrong. About fans. About girls. Mostly about me.  
**Sumi** _(soft)_: That’s the best apology I’ve heard all year. And I’ve flattened a lot of boys.  
**Tuk**: …How many is a lot?  
**Sumi** _(happy)_: Keep the fan, Keeper. And the paint. You’ve earned a place in our drill any morning you like.  
_She tucks a folded steel fan into your belt. Your Nubbin refuses to wash its face for three days._  

**Rewards**

- Fan and face paint (cosmetic): A folded steel fan and white-and-red fan-warrior face paint for your Keeper.
- Fan-block karate move (feature): A new karate move: a well-timed block that turns an attack aside and leaves the attacker off balance.

**Notes:** Drill: follow-the-leader input sequence. Spar: karate bout where perfect-timed blocks deal the damage. If the Nubbin spar choice was picked, the player’s Nubbin wears face paint during the bout. Tuk’s apology is the heart of the quest: no mocking of the warriors after it.

## Q54. The Sword Master

*Avatar: The Last Airbender: Sokka’s Master* · audience: all · where: Master Pian’s house on the hill · when: Any day after a shooting star (never during Chapters 9–11) · requires: Q46

**Cast:** Tuk (Sokka), Master Pian (Piandao)

### Step 1: Complete Master Pian’s three lessons: the brush, the stillness and the garden.

Hint: Each lesson is a short timing game. Slow, steady inputs score better than fast ones. · check: `train:pian-lessons:3`

#### <a id="q54-lessons"></a>Scene `q54-lessons`

_Master Pian’s house sits at the top of the hill, the courtyard swept so clean it seems to glow._  
**Tuk**: Master Pian. I want to learn the sword. I’ve got a boomerang, but that’s a coming-back sort of weapon.  
**Master Pian**: Many people want swords. Few want to learn. Why do you?  
**Tuk** _(think)_: Honestly? Everyone else has a special thing. Pemba flies. Nalu does water. I have… plans.  
**Master Pian** _(soft)_: Plans are not nothing. A blade without a plan is only a heavy stick.  
**Master Pian**: First, you will learn to write your name with a brush. Then to sit still. Then to look at a garden.  
**Tuk** _(shock)_: That’s not sword. None of that is sword.  
**Master Pian**: All of it is sword.  
_Your Nubbin is already sitting very still, gazing at the garden. Master Pian nods at it._  

**Choices**

- **Start with the brush**
    - **Master Pian**: Good. A sword stroke and a brush stroke are cousins. Neither can be taken back.
- **Start with sitting still**
    - **Tuk**: I can sit still. Watch.
    - Tuk lasts nine seconds.
- **Start with the garden**
    - **Master Pian**: Tell me what you see.
    - **Tuk**: Rocks. Some more rocks.
    - **Master Pian**: Look longer.

#### <a id="q54-lessons-done"></a>Done `q54-lessons-done`

**Master Pian**: You have learned three things today. Your hand, your breath and your eyes.  
**Tuk**: And my knees. My knees learned a lot.  

### Step 2: Haul the fallen star to Master Pian’s forge and help Tuk shape it into a blade.

Hint: Strike when the metal glows orange, not white. Let it rest between rounds. · check: `craft:meteor-sword`

#### <a id="q54-meteor"></a>Scene `q54-meteor`

_That night, a streak of white fire falls behind the hill. The ground shivers._  
**Tuk** _(shock)_: Did you see that? A shooting star! It landed! It actually landed!  
**Master Pian** _(think)_: Sky-iron. A sword from a falling star is rare. It would be yours, and no one else’s.  
**Tuk** _(happy)_: Then let’s go dig up a star.  
_The crater is still warm. In its centre lies a black rock, heavy as a sleeping Nubbin and twice as stubborn._  
**Master Pian**: You will forge it yourselves. I will only hold the tongs and say “no” occasionally.  
**Tuk**: How occasionally?  
**Master Pian**: Often.  
**Tuk** _(think)_: What if I get it wrong? It’s a star. You only get one star.  
**Master Pian** _(soft)_: Then you will own a badly made star, and know more than you did. Every master keeps one. Mine is a spoon.  

#### <a id="q54-meteor-done"></a>Done `q54-meteor-done`

_The blade comes out of the water as dark as night, with tiny silver flecks like stars._  
**Tuk** _(soft)_: Whoa.  

### Complete

#### <a id="q54-complete"></a>Complete `q54-complete`

**Master Pian** _(soft)_: A sword is not a thing you carry. In time, it becomes how you stand, how you breathe, how you choose.  
**Master Pian**: The same is true of friends. And of the little ones who follow you about. You will see.  
**Tuk**: So… can I name it?  
**Master Pian**: You may.  
**Tuk** _(happy)_: Star Stabber.  
**Master Pian**: …You may also think about it for longer.  
_Master Pian forges a smaller twin from the leftover sky-iron and lays it in your hands. It is lighter than it looks._  

**Rewards**

- Meteor sword (cosmetic): A small black sword flecked with silver, forged from a fallen star. Purely for looks; it is never used on Nubbins.

**Notes:** Lessons: three short timing games (brush stroke hold-and-release, a stillness meter, spot-the-difference in the rock garden). Forge: hammer timing on glow colour. The shooting star can be a scripted night sky event when the quest starts.

## Q55. The Ember Bay Players

*Avatar: The Last Airbender: The Ember Island Players* · audience: all · where: The beach stage at Ember Bay · when: Any summer evening (never during Chapters 9–11) · requires: Q46, Q56, Q64

**Cast:** Tuk (Sokka), Bao (Toph Beifong), Pemba (Aang), Kaito (Zuko), The Ember Bay Players (Ember Island Players)

### Step 1: Watch the first act of the Ember Bay Players’ show.

Hint: Just sit through it. Tap to throw a peanut at the stage, if you must. · check: `watch:ember-bay-play:act-1`

#### <a id="q55-act1"></a>Scene `q55-act1`

_A painted curtain flaps on the beach stage. The sign reads: THE AMAZING ADVENTURES OF THE KEEPER AND FRIENDS._  
**Tuk** _(happy)_: A play about us! Finally, the recognition I deserve.  
**Bao**: I can’t see the stage. I’m going to enjoy this more than any of you.  
_The curtain rises. An actor in an orange robe cartwheels three times and falls into the band._  
**The Ember Bay Players** _(happy)_: I am Pemba! I love fun! And also… fun!  
**Pemba** _(sad)_: Is that what I’m like?  
_An actor playing Tuk enters. Every single line is a joke about meat. The audience roars._  
**Tuk** _(angry)_: I have depth! I have range! I once made a whole plan with diagrams!  
_Then a huge, sweaty actor playing Bao strides out, flexing. He has a beard._  
**Bao** _(happy)_: Oh, I love him. Ten out of ten. No notes.  

#### <a id="q55-act1-done"></a>Done `q55-act1-done`

_The interval bell rings. Kaito hasn’t blinked in twenty minutes._  
**Kaito** _(shock)_: They gave me a ponytail made of a mop.  
**Kaito**: And I was the villain. They had me shouting at the sea for a whole scene.  
**Kaito** _(think)_: …It’s fair. That is how I was. It just isn’t how I am.  
**Bao** _(happy)_: Look at that. Growth. Gross. Pass the peanuts.  

### Step 2: Watch the finale, and show the Players what you think of it.

Hint: Your choice changes how the Players greet you the next time you visit the beach. · check: `watch:ember-bay-play:finale`

#### <a id="q55-finale"></a>Scene `q55-finale`

_In the second act, an actor in a very shiny cape appears with a sign that says THE KEEPER. That’s you._  
**The Ember Bay Players**: Fear not, friends! The Keeper is here, and I have brought… my eight hundred Nubbins!  
_The eight hundred Nubbins are socks on sticks. One falls off and rolls into the sand._  
**Kaito**: That’s… honestly how you look when you walk in with the Nubbins. Bit less socky.  
_The finale begins. The Keeper slips on a banana skin and the villain wins. The curtain starts to fall._  
**Tuk** _(shock)_: THEY CAN’T END IT LIKE THAT.  
**Bao**: Your move, Keeper.  

**Choices**

- **Boo loudly** — sets `{"q55-reaction":"boo"}`
    - You boo. The whole audience joins in, then starts booing each other. The Players bow anyway.
    - **The Ember Bay Players**: Thank you! The passion! We feed on it!
- **Cheer anyway** — sets `{"q55-reaction":"cheer"}`
    - You cheer. The actors look stunned, then delighted. The sock Nubbins take a bow.
    - **The Ember Bay Players**: A fan! We have a fan!
- **Storm the stage and fix the ending** — sets `{"q55-reaction":"storm"}`
    - You climb up, rescue the fallen sock Nubbin and help the Keeper actor to his feet. The crowd goes wild.
    - **The Ember Bay Players**: This is improvised theatre now! Everybody, improvise!

#### <a id="q55-finale-done"></a>Done `q55-finale-done`

**Kaito** _(soft)_: You know what? I’m glad we came.  
**Tuk**: I’m not. I’m writing a letter.  
**Bao** _(happy)_: I’m writing a fan letter. To the big guy with the beard. He gets me.  

### Complete

#### <a id="q55-complete"></a>Complete `q55-complete`

_Afterwards, the lead player hands out programmes at the stage door, still in his shiny cape._  
**The Ember Bay Players** _(happy)_: Take a mask or two! For the memories! We do the same show next week, only longer.  
**Bao**: Longer. Wonderful. I’m coming every week.  
**Pemba**: Do you think they’ll ever do one where we win?  
**Kaito** _(think)_: If they did, I don’t think anyone would believe it.  
_You go home with two theatre masks and a playbill with your name spelt wrong._  

**Rewards**

- Theatre masks (cosmetic): A happy mask and a sad mask on a ribbon. Your Keeper can wear either.
- Playbill photo frame (feature): A new Photo mode frame styled as an Ember Bay playbill, with your name (spelt wrong).

**Notes:** The Ember Bay Players speak as one speaker (the troupe); whichever actor is on stage gets the box. The play is a cheap pastiche of the player’s own adventures: sock-puppet Nubbins, a mop ponytail, a bearded “Bao”. q55-reaction (boo / cheer / storm) is paid off in q55-complete: the lead player greets the player by that choice (one line inserted by flag after “Take a mask or two!”).

## Q56. Earth Rumble

*Avatar: The Last Airbender: The Blind Bandit* · audience: all · where: The big boulder in the rocky section · when: Any night (never during Chapters 9–11) · requires: Q46

**Cast:** Bao (Toph Beifong), Tuk (Sokka), Pemba (Aang), Rumble Master Gorro (Xin Fu), The Big Slab (The Boulder)

### Step 1: Follow the flyer to the hidden arena under the big boulder.

Hint: The big boulder in the rocky section has a crack in it. Knock twice. · check: `visit:rumble-arena`

#### <a id="q56-flyer"></a>Scene `q56-flyer`

_A crumpled flyer blows across the Grove and sticks to your Nubbin’s face._  
**Tuk**: “Rumble Night. Underground wrestling. Under the big boulder. Bring snacks.” Huh.  
**Tuk** _(think)_: Secret wrestling under a boulder. Of course. Why would anything around here happen above ground?  
**Pemba** _(happy)_: We have to go! I’ve never seen wrestling. Is it like hugging, but angrier?  
**Tuk**: That’s… actually a perfect description.  
_Your strongest Nubbin flexes its tiny arms at the flyer. It seems to think it has been invited._  

**Choices**

- **Pack snacks, as the flyer says** — sets `{"q56-snacks":true}`
    - **Tuk**: Finally, someone who reads the instructions.
- **Bring your Power Nubbin**
    - Your Power Nubbin marches ahead of you, stomping on purpose.
- **Ask whether this is a good idea**
    - **Tuk**: It’s not. But I want to see it. Those are different things.

#### <a id="q56-flyer-done"></a>Done `q56-flyer-done`

_You knock twice. The boulder slides aside. Below, a crowd roars by torchlight._  
**Tuk**: Okay. That’s a cool door. I’ll give them the door.  

### Step 2: Enter your Power Nubbin in a bout against the Little Landslide. Win, or lose with dignity.

Hint: She feels your footsteps through the ground. Stand still to confuse her, then push. · check: `karate:fight:little-landslide`

#### <a id="q56-bout"></a>Scene `q56-bout`

**Rumble Master Gorro** _(happy)_: WELCOME TO RUMBLE NIGHT! Tonight our champion defends the belt against the mighty Big Slab!  
**The Big Slab** _(angry)_: The Big Slab is feeling confident! The Big Slab is feeling enormous!  
**Tuk**: Why is he talking about himself like that?  
_The champion walks into the ring barefoot. She is tiny, dressed in green, with a fringe over her pale eyes. She yawns._  
**Rumble Master Gorro**: THE LITTLE LANDSLIDE!  
**Bao**: Let’s get this over with. I have a bedtime.  
_The Big Slab charges. The ground under him lifts like a trapdoor, and he sails out of the ring into the noodle stand._  
**Bao** _(happy)_: Next! Anybody? Come on, I can feel you all shuffling.  
_Your Power Nubbin steps forward. The whole arena goes quiet._  
**Bao** _(think)_: Huh. Small, heavy, walks like it means it. I like it already.  

**Choices**

- **Ask her to go easy on it**
    - **Bao**: Nope. Going easy is an insult. It deserves a real fight.
- **Tell her not to hold back**
    - **Bao**: Oh, I won’t. But I like that you asked.
- **Bow to her** — sets `{"q56-bowed":true}`
    - **Bao**: You know I can’t see that, right?
    - She grins anyway. She felt the floorboards creak.

#### <a id="q56-bout-done"></a>Done `q56-bout-done`

**Bao** _(happy)_: Not bad! Not bad at all. Hardly anyone lasts that long.  
_Your Nubbin is either covered in glory or covered in sand. Possibly both._  
**Bao** _(soft)_: And you didn’t run. Most people run. Running’s loud.  

### Complete

#### <a id="q56-complete"></a>Complete `q56-complete`

_After the show, the Little Landslide finds you by the noodle stand, which has been rebuilt._  
**Bao**: The name’s Bao. Don’t tell anyone. Up there I’m a nice quiet girl who has to wear shoes.  
**Bao** _(soft)_: Up there, everybody helps me across the road whether I want it or not. Down here, nobody helps me. It’s the best.  
**Tuk**: You were incredible. How do you know where they’re going?  
**Bao** _(happy)_: I feel it through my feet. Your feet are louder than your mouth, Ponytail. Which is saying something.  
**Bao**: Here. A spare belt. I’ve got a cupboard full. Your Nubbin earned it, win or lose.  
_The belt is far too big. Your Nubbin wears it anyway, dragging it proudly behind like a tail._  
**Rumble Master Gorro** _(happy)_: And take a ring post! Every great champion needs an arena!  

**Rewards**

- Championship belt (cosmetic): A big, shiny Rumble Night belt. Fits a Nubbin if you don’t mind it dragging.
- Rumble arena (decor): A small roped wrestling ring with torch posts. Power Nubbins like to practise in it.

**Notes:** Step 2 completes win or lose (karate:fight, not karate:win). Bao is blind and senses movement through the ground: in the bout, standing still hides you from her briefly. Bao jokes about it herself; nobody else does. The Big Slab lands in the noodle stand unhurt, covered in noodles. q56-bowed is flavour: bowing to someone who can’t see it is the whole joke.

## Q57. The Painted Lady

*Avatar: The Last Airbender: The Painted Lady* · audience: all · where: The stilt village downstream of the Grove · when: When the stream runs murky (never during Chapters 9–11) · requires: Q46

**Cast:** Nalu (Katara), Tuk (Sokka), Pemba (Aang), Ma Reedy (Jang Hui villager)

### Step 1: Deliver food and medicine to five houses in the river village.

Hint: Fruit from the Grove and herbs from the healer’s shelf will both do. Knock gently; people are poorly. · check: `deliver:river-village-supplies:5`

#### <a id="q57-sick"></a>Scene `q57-sick`

_Downstream, the river turns a sickly brown. A little village of stilt houses sits in the murk, quiet and grey._  
**Ma Reedy** _(sad)_: The fish are all gone. Half the village is coughing. It’s the works upstream. They pour their sludge in and call it progress.  
**Nalu** _(angry)_: That’s awful. Someone has to do something.  
**Tuk**: Someone will. Probably not us. We have a schedule.  
**Nalu**: Tuk.  
**Tuk**: …I’m just saying the schedule exists.  
**Ma Reedy** _(soft)_: The old folk say a river spirit used to watch over us. A lady in white with a painted face. She hasn’t come in years.  
_A little girl in a doorway holds up an empty fish basket, upside down, as if it might be hiding one._  
_Nalu goes very quiet. You can see an idea forming. Tuk can see it too, and he sighs._  

**Choices**

- **Promise to help**
    - **Ma Reedy**: You’re kind. Kind won’t clean a river, though.
    - **Nalu**: Watch us.
- **Offer fruit from the Grove** — sets `{"q57-gave-fruit":true}`
    - **Ma Reedy**: Real fruit! The children haven’t had any in weeks.
- **Ask about the river spirit**
    - **Ma Reedy**: She came at night. Mist on the water, a lantern on a boat. In the morning, the sick were well.

#### <a id="q57-sick-done"></a>Done `q57-sick-done`

_At the last house, a little boy gives you a drawing of a lady with a painted face._  
**Nalu** _(soft)_: That settles it.  

### Step 2: Clean the river by moonlight without being seen by the villagers.

Hint: Steer the boat through the brown patches. If a lantern turns your way, drift into the mist and wait. · check: `minigame:complete:river-clean`

#### <a id="q57-night"></a>Scene `q57-night`

_Midnight. Mist on the water. Nalu steps into a boat wearing a white veil, a wide straw hat and red painted marks._  
**Nalu**: Well? Do I look like a river spirit?  
**Tuk**: You look like Nalu in a hat. But a really mysterious hat.  
**Pemba** _(happy)_: I think you look amazing. And spooky. Amazing-spooky.  
**Nalu**: Here’s the plan. I lift the sludge out of the water. You and the Nubbins scoop it into barrels. Nobody gets seen.  
_Your Swim Nubbin slips silently into the river, then pops up holding a rusty can like a trophy._  
**Tuk** _(think)_: And tomorrow, when the works start pouring again?  
**Nalu** _(angry)_: Then the Painted Lady pays them a visit too.  

**Choices**

- **Clean the river first** — sets `{"q57-plan":"clean"}`
    - **Nalu**: Right. Rescue first. The rest can wait till morning.
- **Block the sludge pipe** — sets `{"q57-plan":"pipe"}`
    - **Tuk**: Now that I can help with. I brought a very large cork.
- **Leave a stern note at the works** — sets `{"q57-plan":"note"}`
    - **Nalu**: “Stop it. Love, the river.” Perfect.

#### <a id="q57-night-done"></a>Done `q57-night-done`

_By dawn the water runs clear enough to see the stones. A fish flips up into the light, and someone on the bank gasps._  
**Ma Reedy** _(shock)_: The Painted Lady came back!  
_Ma Reedy turns towards your boat, half hidden in the mist. Nalu, still painted, freezes._  
**Nalu**: (whispering) Do we tell her?  

**Choices**

- **Step out of the mist and tell her the truth** — sets `{"q57-legend":"told"}`
    - **Ma Reedy**: I know, dear. I knew the first night. Spirits don’t sneeze.
    - **Ma Reedy**: The Painted Lady was always just somebody who decided to be her. Now it’s you.
- **Drift back into the mist** — sets `{"q57-legend":"kept"}`
    - You drift away. Behind you, the village is already telling the story, and it gets better every time.
    - **Nalu**: Maybe they need her more than they need to know who she is.

### Complete

#### <a id="q57-complete"></a>Complete `q57-complete`

_The village wakes to clear water and full fish baskets. The works upstream has hung a nervous sign: PIPE CLOSED. SORRY._  
**Ma Reedy** _(happy)_: She came back. After all these years, she came back.  
**Nalu** _(soft)_: I bet she was happy to help.  
**Tuk**: She was very happy. And very wet. And she owes me new trousers.  
_Ma Reedy gives you a wide straw hat, still faintly marked with river spirit paint._  
**Ma Reedy**: And these little fish. Put them in your stream. They nibble the muck and keep the water clear for good.  

**Rewards**

- Painted Lady hat (cosmetic): A wide straw hat with a white veil and faint red river-spirit marks.
- River-cleaning fish (feature): Little fish that live in the Grove stream and eat the muck: the stream stays clear in all weather.

**Notes:** Night stealth boat minigame: clear brown patches while villagers’ lanterns sweep the water; mist banks hide you. Swim Nubbins speed up scooping. Keep the illness mild (coughs, tiredness); nobody is in danger on screen. The factory is never shown inside. q57-legend (told / kept): Ma Reedy already knew if told.

## Q58. The Fortuneteller

*Avatar: The Last Airbender: The Fortuneteller* · audience: all · where: Hillstead, the village under Mount Grumble · when: Any day (never during Chapters 9–11) · requires: Q46

**Cast:** Aunt Wen (Aunt Wu), Tuk (Sokka), Pemba (Aang), Nalu (Katara)

### Step 1: Have Aunt Wen read the bones for you and your Nubbin.

Hint: Join the queue at the house with stars on the door. Bring a fruit; it’s polite. · check: `talk:aunt-wen`

#### <a id="q58-reading"></a>Scene `q58-reading`

_In the village of Hillstead, everyone queues outside a little house with stars painted on the door._  
**Aunt Wen** _(happy)_: Come in, come in! Aunt Wen sees all. Or most. Some of it is blurry.  
_She drops a bone into the fire. It cracks with a pop. She peers at the cracks and gasps happily._  
**Aunt Wen**: Your Nubbin will find something lovely today. Possibly a snack. Probably a snack.  
**Tuk**: That’s not a fortune. That’s just odds. Nubbins always find snacks.  
**Aunt Wen**: And you, young man, will have a very bad day if you keep saying things like that.  
_Outside, a villager carries an umbrella on a cloudless day. Another refuses to walk on the left of the road._  
**Pemba** _(happy)_: She’s amazing! She said I’ll have a great adventure! Do you think it’s today?  
**Nalu**: She says that to everyone, Pemba.  

**Choices**

- **Believe her** — sets `{"q58-belief":"believe"}`
    - **Aunt Wen**: A wise Keeper. Your Nubbin agrees. Look, it’s nodding.
    - Your Nubbin is nodding off.
- **Side with Tuk** — sets `{"q58-belief":"doubt"}`
    - **Tuk**: Finally. Someone with a brain. Hello, brain.
- **Say you’ll wait and see** — sets `{"q58-belief":"wait"}`
    - **Aunt Wen**: Fair. The bones are patient. So am I. Mostly.

#### <a id="q58-reading-done"></a>Done `q58-reading-done`

**Aunt Wen**: Oh, and the mountain won’t erupt this year. I read the clouds this morning. Nice and fluffy.  
**Tuk** _(think)_: …The mountain can erupt?  

### Step 2: Climb Mount Grumble and look inside the crater.

Hint: Take the zigzag path, or call Puffin if you’ve found him. Keep your Nubbin away from the edge. · check: `visit:mount-grumble-crater`

#### <a id="q58-mountain"></a>Scene `q58-mountain`

_Above Hillstead, Mount Grumble sends up a thin grey thread of smoke. Tuk stares at it._  
**Tuk**: Everyone here trusts clouds over common sense. I’m going up there. I want to see with my own eyes.  
**Pemba**: I’ll come! Puffin, my sky bison, can fly us most of the way. Or my glider, if he’s sulking.  
**Nalu**: I’ll stay and talk to the villagers. Just in case.  
_At the top, the air is hot and smells of boiled eggs. Inside the crater, red rock bubbles and hisses._  
**Tuk** _(shock)_: That is not “nice and fluffy”. That is “very much about to go off”.  
**Pemba** _(shock)_: We have to tell everyone! Today!  
**Tuk** _(think)_: They won’t listen to us. They only listen to Aunt Wen. And Aunt Wen only listens to clouds.  

#### <a id="q58-mountain-done"></a>Done `q58-mountain-done`

**Pemba** _(happy)_: Wait. If they only listen to clouds…  
**Tuk** _(happy)_: …then we give them a cloud. Pemba, you wonderful little weather machine.  

### Step 3: Help Pemba push the clouds into a giant angry-volcano shape over the village.

Hint: Drag the cloud puffs into the outline. The wind drifts east, so start on the west side. · check: `minigame:complete:cloud-shaping`

#### <a id="q58-clouds"></a>Scene `q58-clouds`

_The whole village has gathered in the square for Aunt Wen’s evening cloud reading._  
**Aunt Wen**: The clouds will now speak! Let us see. Yes. Ah. Hmm. That one looks like a duck.  
_High above, Pemba and Puffin swoop through the clouds, pushing great gusts of wind. Your Nubbins flap along behind._  
**Tuk**: Okay. Steady. We need one shape. The village sign for “danger”. Big, clear, impossible to argue with.  
**Nalu**: And what is the village sign for danger?  
**Tuk**: A big angry mountain with a frowny face.  
**Nalu**: …That’s not a real sign.  
**Tuk**: It will be in five minutes.  
**Nalu** _(think)_: Tuk. We’re tricking them. Is that really any better than what Aunt Wen does?  
**Tuk**: …Hm. I hate it when you ask the good questions while I’m busy.  

**Choices**

- **Shape the frowning volcano. Get them moving.** — sets `{"q58-cloud":"warning"}`
    - **Tuk**: Tonight we trick them out of danger. Tomorrow we walk them up and show them the crater.
    - **Nalu**: Promise?
    - **Tuk**: Promise. With diagrams.
- **Shape a giant arrow pointing at the mountain** — sets `{"q58-cloud":"arrow"}`
    - **Nalu**: Yes. Don’t tell them what to think. Tell them where to look.
    - Below, a hundred heads turn from the sky to the smoking mountain, for the first time in years.

#### <a id="q58-clouds-done"></a>Done `q58-clouds-done`

_A huge cloud hangs over Hillstead, impossible to argue with. Your Nubbins drift down out of it, damp and proud._  
**Aunt Wen** _(shock)_: Oh dear. Oh dear oh dear. The clouds have NEVER been this clear. Everyone, get your shovels!  

### Complete

#### <a id="q58-complete"></a>Complete `q58-complete`

_The villagers dig a trench all night. When Mount Grumble finally pops, the lava runs down the trench and away from the houses._  
**Aunt Wen** _(soft)_: I owe you, young man. Even if you don’t believe a word I say.  
**Tuk**: I believe one word. “Shovels.” That was a great call.  
**Aunt Wen** _(happy)_: Then let me give the Keeper something. Bring your Nubbins to me whenever you like. I’ll read the bones for them.  
**Aunt Wen**: I’m right more often than not. And much more often about Nubbins than about mountains.  
_Next morning Tuk, who likes to have the last word, walks a hundred villagers up to the crater rim. With diagrams._  
_Nobody says anything for a long time._  
**Aunt Wen** _(happy)_: I did say it was nice and fluffy.  
_Aunt Wen now reads bones at the Grove’s fortune tent. Tuk says he will never go. He goes twice a week, in a hat._  

**Rewards**

- Aunt Wen’s bone reading (feature): A new service at the fortune tent: Aunt Wen cracks a bone in the fire and reads your Nubbin’s future (reader id aunt-wen).

**Notes:** Unlocks reader `aunt-wen` (already written in readers.ts) at the fortune tent; her speaker id here matches. Eruption is slow and safe: no one is hurt, the trench works. Cloud minigame: drag cloud puffs into a volcano-with-a-frown outline while wind drifts them east. If Puffin is not yet rescued (Q52), Pemba still flies on his glider; the line about Puffin can stay. q58-cloud picks the outline: “warning” = frowning volcano, “arrow” = a giant arrow at the mountain.

## Q59. The Waterbending Scroll

*Avatar: The Last Airbender: The Waterbending Scroll* · audience: all · where: The river market · when: Any market day (never during Chapters 9–11) · requires: Q46

**Cast:** Nalu (Katara), Tuk (Sokka), Pemba (Aang), Captain Hake (Pirate captain)

### Step 1: Keep Captain Hake talking while Nalu takes a closer look at the scroll.

Hint: Ask about every item on the deck. The bison whistle is good for at least a minute. · check: `distract:captain-hake`

#### <a id="q59-market"></a>Scene `q59-market`

_A battered pirate ship is moored at the river market, its deck piled with “treasures” of every kind._  
**Captain Hake** _(happy)_: Step up! Rare goods, fair prices, absolutely no questions answered!  
**Pemba** _(happy)_: Look! A whistle shaped like a bison! I’m buying it!  
**Tuk**: It’s a stick with a hole in it. You’re buying a stick.  
_Nalu has gone very still. In a glass case lies an old scroll covered in drawings of moving water._  
**Nalu** _(soft)_: That’s a waterbending scroll. A real one. It could teach me everything my village couldn’t.  
**Captain Hake**: Ah, the lady has taste. Two hundred gold pieces. Or your bison, your Nubbin and the boy with the boomerang.  
**Tuk**: That’s a lot of value for one scroll. I’m flattered, in a horrible way.  

**Choices**

- **Haggle** — sets `{"q59-haggled":true}`
    - **Captain Hake**: Two hundred! My final offer! Two hundred and ten!
    - **Tuk**: That’s not how haggling works.
- **Pretend to walk away**
    - **Captain Hake**: Fine! Nobody wanted it anyway! …Two hundred!
- **Ask where he got it**
    - **Captain Hake**: I found it. In a… temple. On a… shelf. That was open. Partly.

#### <a id="q59-market-done"></a>Done `q59-market-done`

_You turn round. Nalu is walking briskly towards your boat. The glass case is empty._  
**Tuk** _(shock)_: Did you just—  
**Nalu**: Walk. Normally. Now.  
**Captain Hake** _(angry)_: THIEVES! After them, lads!  

### Step 2: Escape the pirates down the river rapids.

Hint: Steer between the rocks, and let your Swim Nubbins push on the straights. · check: `minigame:complete:river-chase`

#### <a id="q59-chase"></a>Scene `q59-chase`

_You tumble into your boat and push off. Behind you, the pirate ship swings round, sails cracking._  
**Tuk** _(angry)_: You STOLE it? You lecture me about picking fruit off other people’s trees!  
**Nalu**: It was already stolen! I’m borrowing it from the thieves. That’s practically returning it.  
**Pemba** _(happy)_: This is so exciting! Are we pirates now? Can I have a hat?  
**Captain Hake** _(angry)_: Bring back my scroll! And my whistle! He never paid for the whistle!  
**Pemba** _(shock)_: Oh. Oops.  
_Your Swim Nubbins leap into the water and paddle hard, pushing the boat along like little furry engines._  

**Choices**

- **Tell Nalu it was wrong** — sets `{"q59-told-off":true}`
    - **Nalu**: I know. I’ll make it right. After we don’t get caught.
- **Tell Nalu it’s for a good cause**
    - **Nalu**: Thank you. See, Tuk? The Keeper understands.
    - **Tuk**: The Keeper is now part of a crime.
- **Make Pemba blow the whistle** — sets `{"q59-whistle":true}`
    - Pemba blows. Somewhere far upriver, a very confused sky bison turns his head.

#### <a id="q59-chase-done"></a>Done `q59-chase-done`

_The pirate ship wedges itself between two rocks with a sad crunch. You sail on._  
**Captain Hake** _(angry)_: THIS ISN’T OVER! Also, does anyone have a long pole?  

### Complete

#### <a id="q59-complete"></a>Complete `q59-complete`

_That night by the fire, Nalu unrolls the scroll and practises one move over and over: a whip of water, snapping out and back._  
**Nalu** _(happy)_: Look! I did it! I actually did it!  
**Tuk**: Great. Now do the move where we don’t steal things.  
**Nalu** _(soft)_: I’ll take it to the water villages once I’ve learned it. It belongs to them. I promise.  
**Nalu** _(think)_: And I’ll remember how my stomach felt when I lifted the case.  
_Your Swim Nubbins have been watching closely. One flicks its tail at the stream, and a ribbon of water snaps through the air._  
**Pemba** _(happy)_: Your Nubbin can do it too! Your Nubbin learned waterbending!  
_Days later, a long pole drifts downriver to the rocks. A note is tied to it: “For Captain Hake. From the borrowers.”_  
**Tuk** _(happy)_: That is the nicest crime I’ve ever been part of.  

**Rewards**

- Water-whip karate move (feature): A new karate move for Swim Nubbins: a quick lash of water that reaches further than a punch.

**Notes:** River chase: side-scrolling rapids, rocks to dodge, Swim Nubbins boost on straight water. Nalu’s “borrowing” is shown as wrong-but-understandable, and she promises to return the scroll. Water whip is limited to Swim-type Nubbins. q59-haggled is flavour: Hake haggling against himself is the joke.

## Q60. The Winged Lemur

*Avatar: The Last Airbender: The Southern Air Temple* · audience: all · where: Your fruit basket · when: Any morning after fruit has gone missing overnight (never during Chapters 9–11) · requires: Q46

**Cast:** Pemba (Aang), Lumi (Momo)

### Step 1: Follow the winged lemur through the old temple ruins.

Hint: It glides from high ledge to high ledge. Climb where it lands, and don’t lose sight of its tail. · check: `chase:winged-lemur:temple-ruins`

#### <a id="q60-thief"></a>Scene `q60-thief`

_Your fruit basket is empty. Again. There are tiny footprints in the dew, and a peach stone on the fence._  
**Pemba** _(think)_: Third time this week? That’s no bird. Birds don’t leave the stones in a neat little pile.  
_Above you, something with huge ears and leathery wings sits on a branch, eating your last peach._  
**Lumi** _(happy)_: Chirrup!  
**Pemba** _(happy)_: A winged lemur! I haven’t seen one since I was little. They used to live at the old temple.  
_The lemur stuffs the peach in its cheek, launches off the branch and glides away towards the hills._  
**Pemba**: Come on, let’s follow it! Gently! Wingy little things scare easily.  

**Choices**

- **Run after it**
    - You run. The lemur looks back, and seems to decide this is a game.
- **Leave a fruit out as bait** — sets `{"q60-bait":true}`
    - **Pemba**: Smart! It’ll come back for more. Then we follow it home.
- **Ask what you should call it**
    - **Pemba**: Hmm. Let’s get to know it first. A name should fit.
    - The lemur chirrups from the hill. It sounds like it agrees.

#### <a id="q60-thief-done"></a>Done `q60-thief-done`

_Under the broken roof of an old temple, you find its nest: fruit stones, buttons, and one of your spoons._  
**Pemba** _(soft)_: Oh. It lives up here all alone.  

### Step 2: Win the lemur over: feed it three fruits by hand.

Hint: Hold the fruit out and stay still. It comes closer each time, as long as you don’t grab. · check: `feed:winged-lemur:3`

#### <a id="q60-friends"></a>Scene `q60-friends`

_The temple is quiet and cold. Faded murals show monks laughing with lemurs on their shoulders._  
**Pemba** _(sad)_: This is where I learned to fly. It used to be full of people. Now it’s just… this.  
_The lemur peeks down from a beam. It watches Pemba, then you, then your Nubbin._  
**Pemba** _(soft)_: It’s been on its own for ages. It isn’t really stealing. It’s just hungry and lonely. Like me, a bit.  
_Your Nubbin takes a fruit from your bag, walks to the middle of the floor and sits holding it up high._  
**Lumi** _(think)_: …Chirr?  

#### <a id="q60-friends-done"></a>Done `q60-friends-done`

_The lemur lands on your shoulder, wraps its tail round your neck and falls asleep._  
**Pemba** _(happy)_: It likes you! Ha, it really likes you!  
**Pemba** _(think)_: So… do we take it home? Or is this its home? It’s the only one it’s ever had.  

**Choices**

- **Carry it home to the Grove** — sets `{"q60-home":"carried"}`
    - **Pemba**: The Grove has fruit and friends. That’s a good kind of home to be carried to.
- **Set it down, leave the door open and let it choose** — sets `{"q60-home":"chose"}`
    - You set it on a beam and walk away slowly. Halfway down the hill, there is a flap of wings, and a weight on your shoulder.
    - **Pemba**: It chose you! It chose us!

### Complete

#### <a id="q60-complete"></a>Complete `q60-complete`

**Pemba** _(happy)_: It needs a name. It likes shiny things and stealing… Lumi!  
**Pemba** _(soft)_: Welcome home, Lumi. The Grove has fruit and friends, and nobody’s alone there.  
**Lumi** _(happy)_: Chirrup chirrup!  
_Lumi rides home on your shoulder, nibbling your hair. That night it sleeps in the fruit basket, which explains a lot._  
**Pemba** _(happy)_: Every Grove needs a little thief. Just… count your spoons.  

**Rewards**

- Lumi the winged lemur (cosmetic): A winged lemur petpet that rides on your Keeper’s shoulder and occasionally steals fruit.

**Notes:** Lumi’s speaker name shows from his first chirp; that is fine (Pemba names him in the complete scene). Chase: platform hops between high ledges in the temple ruins. Petpet: idle animations include ear twitches, gliding short hops, pocketing a fruit. q60-home (carried / chose): if “chose”, play Lumi landing on the Keeper’s shoulder on the walk home.

## Q61. Avatar Day

*Avatar: The Last Airbender: Avatar Day* · audience: all · where: The coastal village of Kettleby · when: Its festival day (never during Chapters 9–11) · requires: Q46

**Cast:** Pemba (Aang), Tuk (Sokka), Nalu (Katara), Mayor Tibbs (Mayor of Chin Village), Mrs Tibbs

### Step 1: Search the Kettleby records hall for the true story of Marshal Brag.

Hint: Records are filed by year, oldest at the back. Your Nubbin can squeeze behind the dusty shelves. · check: `search:kettleby-records`

#### <a id="q61-trial"></a>Scene `q61-trial`

_Kettleby is having a festival. There is bunting, there are sweets, and there is a straw statue of a past Avatar._  
_People are hitting the statue with sticks._  
**Pemba** _(shock)_: Hey! That’s Avatar Kesh! She was me, a long time ago. Sort of. It’s complicated.  
**Mayor Tibbs** _(angry)_: He admits it! Four hundred years ago, Avatar Kesh ruined our founder, the Great Marshal Brag!  
**Pemba**: Wait, what? What did she do?  
**Mayor Tibbs**: She split the land in two, and Marshal Brag fell into the sea! Now you shall stand trial for it!  
**Tuk**: Hold on. He’s twelve. Four hundred years ago he wasn’t even a thought.  
**Mayor Tibbs**: Under Kettleby law, every past life counts. It’s in the rules. We wrote the rules.  
_Two guards walk Pemba to a cage. It has bunting on it. Pemba waves at you sadly through the bars._  
**Nalu** _(angry)_: We need proof that Kesh wasn’t the villain. Where do they keep the old records?  

**Choices**

- **Ask for a fair trial**
    - **Mayor Tibbs**: Of course! Fair, quick, and finished by lunch.
- **Let Tuk do the talking** — sets `{"q61-tuk-lawyer":true}`
    - **Tuk**: Mr Mayor. Your Honour. Sir. I represent the defence.
    - **Mayor Tibbs**: Do you have any experience?
    - **Tuk**: I’ve read a book.
- **Buy a festival sweet** — sets `{"q61-sweet":true}`
    - It is shaped like a smashed statue. It tastes of peppermint and guilt.

#### <a id="q61-trial-done"></a>Done `q61-trial-done`

_Behind the oldest shelf, your Nubbin finds a scroll sealed with Marshal Brag’s own stamp, and an old map it has been using as a blanket._  
**Nalu** _(shock)_: It’s his diary. Look at this entry. And this one.  

### Step 2: Present the evidence at Pemba’s trial.

Hint: Choose your strongest piece. Any of them will do; some get a bigger cheer. · check: `present:evidence:kettleby-trial`

#### <a id="q61-evidence"></a>Scene `q61-evidence`

_The trial is held in the village square. The judge is Mayor Tibbs. The jury is also Mayor Tibbs._  
_A woman in the front row, in a matching Tibbs hat, puts up her hand._  
**Mrs Tibbs**: Dear. You can’t be the judge. You can’t find your own socks.  
**Mayor Tibbs**: I can find them perfectly well when I’m in a position of authority.  
**Mayor Tibbs**: The prisoner may speak, but briefly. We have a parade at four.  
**Tuk**: Your Honour. We have found Marshal Brag’s diary, written in his own hand.  
**Nalu**: “Today I shall march onto Avatar Kesh’s island and take it. Then the next island. Then all the islands.”  
**Tuk**: “Note to self: build a bigger hat.”  
_The crowd murmurs. Someone at the back takes off a Marshal Brag hat and quietly puts it in a bin._  
**Mayor Tibbs** _(shock)_: That… does sound a bit like a bully.  
**Nalu**: Kesh didn’t attack anyone. She protected her home. Brag fell in because he wouldn’t step back when the cliff cracked.  
**Mayor Tibbs** _(think)_: One more piece of evidence and I’ll be convinced. Keeper? What else did you find?  

**Choices**

- **Point at the founding stone under the statue** — sets `{"q61-evidence":"stone"}`
    - **Mayor Tibbs**: “Thank you, Kesh, for our peace.” It was under the statue all along!
- **Show the old map with Kettleby on Kesh’s side** — sets `{"q61-evidence":"map"}`
    - **Mayor Tibbs**: We were… on her island. Oh dear. She was protecting us.
- **Point out that Pemba has been nice to everyone all day** — sets `{"q61-evidence":"kind"}`
    - **Mayor Tibbs**: That is not evidence. That is, however, very true.

#### <a id="q61-evidence-done"></a>Done `q61-evidence-done`

**Mayor Tibbs**: The court finds the prisoner… not guilty! Release the Avatar!  
**Pemba** _(happy)_: Yay! Can I keep the bunting?  
**Pemba** _(think)_: Keeper? Even if Kesh had done something bad… should I say sorry for it? It wasn’t me. But it sort of was.  

**Choices**

- **“You’re not to blame for what she did.”** — sets `{"q61-past":"not-yours"}`
    - **Pemba**: Okay. Then I’ll just try to be someone who deserves a nicer statue.
- **“It isn’t your fault. But you can still help fix things.”** — sets `{"q61-past":"make-right"}`
    - **Pemba**: Oh. I like that better than blame. Blame just sits there. Fixing gets to do things.
    - **Tuk**: Write that down. That’s going on a sign.

### Complete

#### <a id="q61-complete"></a>Complete `q61-complete`

_That evening the straw statue comes down. In its place the villagers build a new one. It looks a lot like Pemba._  
**Mayor Tibbs** _(happy)_: From now on, Avatar Day will be Pemba Day! With fewer sticks and more sweets.  
**Pemba** _(happy)_: That’s the best day I’ve ever heard of!  
**Tuk**: You realise you’re a holiday now. That’s going to go straight to your head.  
**Pemba**: It’s already in my head. It’s having a party.  
**Mayor Tibbs** _(soft)_: And from now on, we read our own records before anyone picks up a stick. We should have done that years ago.  
_The mayor hands you a painted festival mask, and an invitation: Pemba Day will come once to the Grove._  

**Rewards**

- Festival mask (cosmetic): A painted Kettleby festival mask with a cheerful blue arrow on the forehead.
- Pemba Day (feature): A one-time festival in the Grove: lanterns, bunting, and a sweet for every Nubbin.

**Notes:** Avatar Kesh (based on Avatar Kyoshi) and Marshal Brag (based on Chin the Conqueror) are mentioned only, never on screen. Brag “fell into the sea” and nothing more is said; keep it that way. The cage is comic (bunting). Pemba Day: schedule a single festival day in the Grove a few days after completion. q61-past (not-yours / make-right) is flavour; both answers are treated as right.

## Q62. Penguin Sledding

*Avatar: The Last Airbender: The Boy in the Iceberg* · audience: all · where: The frozen pond · when: Any snow day (never during Chapters 9–11) · requires: Q46

**Cast:** Nalu (Katara), Tuk (Sokka), Pemba (Aang)

### Step 1: Break Pemba out of the ice.

Hint: Tap the glowing cracks. Your Nubbins warm the ice when they huddle close. · check: `break:iceberg`

#### <a id="q62-iceberg"></a>Scene `q62-iceberg`

_Snow covers the Grove. On the bank of the frozen pond, Nalu and Tuk are poking at a huge block of ice that wasn’t there yesterday._  
**Tuk**: For the record, I said leave it. Mysterious glowing ice is never good news.  
**Nalu** _(shock)_: Pemba’s inside! He was meditating by the pond last night and… kept going.  
**Tuk**: Or, hear me out, we fetch a grown-up. Someone with a chisel and a very long ladder.  
_Your Nubbin presses its paws to the ice and looks up at you. Under the surface, a blue arrow glows faintly._  
**Nalu**: Please. He could be freezing in there.  
**Tuk**: He’s in an iceberg, Nalu. I think that ship has sailed.  

**Choices**

- **Crack it with a stone**
    - You strike. A thin crack zigzags across the ice.
- **Get your Nubbins to huddle round it** — sets `{"q62-huddle":true}`
    - Your Nubbins press together against the ice. It starts to drip, then trickle.
- **Hand Tuk his boomerang**
    - **Tuk**: Fine. FINE. But when he thaws out, I’m telling him whose fault this was.

#### <a id="q62-iceberg-done"></a>Done `q62-iceberg-done`

_The ice splits with a crack and a whoosh of air. Pemba sits up, blinking, with frost on his eyebrows._  
**Pemba**: Hi! Did I miss breakfast? Do you have any penguins?  

### Step 2: Make friends with a penguin and race Pemba down the snowy hill.

Hint: Offer a fish first, then lean left and right to steer. Belly-flat is fastest. · check: `race:finish:penguin-sled`

#### <a id="q62-sled"></a>Scene `q62-sled`

**Nalu**: Do we have… what?  
**Pemba** _(happy)_: Penguins! I could swear I saw some go past while I was meditating. Big ones. Slidey ones.  
**Tuk**: He’s been frozen solid all night, and his first question is about penguins.  
**Pemba**: What would your first question be?  
**Tuk** _(think)_: …Probably “where’s the food”. Okay, fair.  
**Nalu** _(soft)_: Pemba… how long were you in there?  
**Pemba**: Since last night. It was very peaceful. Then it was very cold.  
**Pemba** _(happy)_: Can I warm up on a penguin? Penguins are warm. Probably.  
_On the snowy hill, a line of penguins waddles past, sleek and round and not at all in the mood._  
**Pemba**: The trick is fish. You give them a fish, they give you a ride. Everyone knows that.  
_Your Nubbin is already holding out a fish to the smallest penguin. The penguin considers it carefully._  
**Pemba** _(happy)_: Race you to the bottom! Loser carries the fish!  
_The smallest penguin takes the fish, looks at Pemba, and waddles over to your Nubbin instead. It has chosen._  
**Tuk**: That penguin has better judgement than most of us.  

#### <a id="q62-sled-done"></a>Done `q62-sled-done`

_You fly down the hill, across a frozen puddle and into a snowdrift. Pemba lands beside you, laughing too hard to stand._  
**Pemba** _(happy)_: Again! Again! AGAIN!  

### Complete

#### <a id="q62-complete"></a>Complete `q62-complete`

**Nalu** _(soft)_: I haven’t seen anyone laugh like that in a long time.  
**Tuk**: I haven’t seen anyone eat that much snow in a long time.  
**Pemba** _(happy)_: The penguins say you can come back any snow day. Well, they didn’t say it. But they looked it.  
**Pemba** _(soft)_: Thanks for getting me out. And for the penguin. Mostly the penguin.  
_The penguins waddle home over the hill. The smallest one turns back to stare at your Nubbin, who waves._  

**Rewards**

- Penguin sledding (feature): On snow days, a penguin sledding race opens on the snowy hill. Bring fish.

**Notes:** Needs weather snow. A mishap, not Pemba’s origin: he is already a friend from Q46, meditated by the pond overnight and froze in. The iceberg is a large glowing ice block on the bank of the frozen pond. Race: belly-sled downhill, lean to steer, Pemba as the rival racer; any finish completes the step. Penguins: waddle and belly-slide animations.

## Q63. King Rumbold’s Challenges

*Avatar: The Last Airbender: The King of Omashu* · audience: all · where: The cliff city of Stonereach · when: Any day (never during Chapters 9–11) · requires: Q46

**Cast:** King Rumbold (Bumi), Pemba (Aang), Tuk (Sokka), The cabbage merchant (Cabbage merchant)

### Step 1: Fetch the king’s key from the bottom of the waterfall.

Hint: A Swim Nubbin can dive the pool. Otherwise, wait for the water to drop at noon. · check: `fetch:rumbold-key`

#### <a id="q63-throne"></a>Scene `q63-throne`

_In the city of Stonereach, carved into the cliffs, the king sits on a stone throne. He is very old, very wrinkled, and grinning._  
**King Rumbold** _(happy)_: Visitors! I love visitors. You will face three challenges. If you fail, you will be… hmm… sent home without pudding.  
**Tuk**: That’s… actually a pretty scary punishment.  
_King Rumbold throws his head back and laughs: a loud, honking bray, like a donkey that has heard a very good joke._  
**King Rumbold**: Challenge one! I have dropped the key to my snack cupboard to the bottom of the waterfall. Fetch it!  
**Pemba**: How did it get down there?  
**King Rumbold** _(happy)_: I threw it. I wanted to see if it could fly. It could not.  

**Choices**

- **Accept the challenge**
    - **King Rumbold**: Wonderful! Off you go! Mind the fish, they nibble.
- **Ask why he needs the key**
    - **King Rumbold**: Because I am hungry, child. Why does anyone want anything?
- **Laugh along with him** — sets `{"q63-laughed":true}`
    - You laugh. He laughs harder. Your Nubbin brays. The guards look very tired.

#### <a id="q63-throne-done"></a>Done `q63-throne-done`

**King Rumbold** _(happy)_: My key! My snacks are safe! Challenge one complete!  
_He unlocks the cupboard and eats a whole cake in one bite, without breaking eye contact._  

### Step 2: Find Biscuit the goat-yak somewhere in the city of Stonereach.

Hint: Follow the bleating. Goat-yaks love high places and anything that looks like a cabbage. · check: `find:biscuit-goat-yak`

#### <a id="q63-pet"></a>Scene `q63-pet`

**King Rumbold**: Challenge two! My pet, Biscuit, has run away again. He is somewhere in the city. Find him!  
**Tuk**: What kind of animal is Biscuit?  
**King Rumbold** _(happy)_: He is a goat-yak. You will know him because he looks like a goat, and also like a yak.  
_A stone mail chute rattles past your head. Somewhere in the city, something bleats._  
**Tuk** _(think)_: Stone city. Narrow streets. One goat-yak. Okay, we sweep from the top down. Pemba, you take the roofs.  
**Pemba** _(happy)_: I love roofs!  
**King Rumbold** _(happy)_: Or! Instead of looking for Biscuit, you could think like Biscuit.  
**Tuk**: I am not going to think like a goat-yak.  
_Your Nubbin is already climbing the highest wall in sight, chewing a leaf thoughtfully._  

#### <a id="q63-pet-done"></a>Done `q63-pet-done`

_You find Biscuit on a rooftop, eating a cabbage from a familiar-looking cart._  
**The cabbage merchant**: My cabbages! Not UP there!  
**King Rumbold** _(happy)_: Biscuit! You found him! That’s two!  

### Step 3: Ride the mail chutes to the bottom of Stonereach with King Rumbold.

Hint: Lean into the bends and duck under the letter slots. The king will not slow down. · check: `minigame:complete:mail-chute`

#### <a id="q63-opponent"></a>Scene `q63-opponent`

**King Rumbold**: Challenge three. The last, and the most dangerous. You must face an opponent. And you may choose who!  
_He points to a huge guard with a hammer, to a hulking rock beast in a cage, and to himself._  
**Tuk**: Okay. Easy. Don’t pick the beast. Don’t pick the hammer. Pick the very old man.  
**Pemba** _(think)_: Tuk, I think the very old man is the scary one.  
**King Rumbold** _(happy)_: Choose wisely! Or unwisely! I enjoy both!  
_Your Nubbin points at the guard, then the beast, then shakes its head firmly at both._  

**Choices**

- **Choose the guard** — sets `{"q63-opponent":"guard"}`
    - **King Rumbold**: Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!
- **Choose the rock beast** — sets `{"q63-opponent":"beast"}`
    - **King Rumbold**: Wrong! Your true opponent is… the MAIL CHUTES! Nobody beats the mail chutes!
- **Choose King Rumbold himself** — sets `{"q63-opponent":"king"}`
    - **King Rumbold**: Ooh, closer! But still wrong!
    - **King Rumbold**: Your true opponent is… the MAIL CHUTES! And I am coming with you!

#### <a id="q63-opponent-done"></a>Done `q63-opponent-done`

_You shoot out of the last chute into a pile of letters. The king lands on top of you, honking with laughter._  
**King Rumbold** _(happy)_: Again! Oh, wait. I’m the king. I can do this whenever I like.  

### Complete

#### <a id="q63-complete"></a>Complete `q63-complete`

**King Rumbold** _(soft)_: You passed. All three. Do you know why I set them?  
**Pemba**: To see if we were brave?  
**King Rumbold**: No. To see if you’d have fun. Most people forget how to play. I wanted to see if you remembered.  
**Tuk**: That’s… surprisingly wise.  
**King Rumbold** _(happy)_: I know! Now take a bit of my mail chute. And my laugh. I have plenty.  
**King Rumbold**: Biscuit also says thank you. He is saying it by eating your hat.  
_You go home with a short stone slide for the Grove, and a laugh that makes everyone nearby turn round._  

**Rewards**

- Mail-chute slide (decor): A short, twisty stone slide. Nubbins climb up and whizz down it all day.
- King Rumbold’s laugh emote (cosmetic): Your Keeper throws their head back and gives a loud, honking bray of a laugh.

**Learning Grove swaps**

- `q63-pet-done#1` → Not the cabbages! Not up there!

**Notes:** King Rumbold’s laugh is a donkey-like honk (needs a dedicated SFX, reused by the emote). Waterfall pool: Swim Nubbins can fetch the key at any time; otherwise the water level drops at noon. The cabbage merchant’s cry in q63-pet-done (swapped in childLines) is heard from off screen (a voice only; he is not seen). Mail chute: downhill track minigame with the king riding alongside. q63-opponent is flavour: every pick is wrong, and that is the joke.

## Q64. Hello, Kaito Here

*Avatar: The Last Airbender: The Western Air Temple* · audience: all · where: The old temple ruins at the edge of the Grove · when: Any evening (never during Chapters 9–11) · requires: Q46, Q56

**Cast:** Kaito (Zuko), Pemba (Aang), Nalu (Katara), Tuk (Sokka), Bao (Toph Beifong)

### Step 1: Help Kaito rehearse his speech three times.

Hint: Pick the advice you think helps. Each try, he gets a little less awful. · check: `talk:kaito:rehearse:3`

#### <a id="q64-rehearse"></a>Scene `q64-rehearse`

_Behind a broken pillar, you find Kaito pacing in circles, muttering to a rock._  
**Kaito** _(shock)_: Oh! Keeper. I wasn’t… I’m not talking to a rock. Why would I be talking to a rock.  
**Kaito**: Fine. I was talking to the rock. I’m practising. I want to ask Pemba if I can join his group.  
**Kaito** _(sad)_: The problem is, I keep getting it wrong. Last time I said “I have changed” and then just stood there for a full minute.  
**Kaito**: I chased them right round the world in a very loud boat. All summer. At night.  
**Kaito** _(sad)_: In my defence, I was very tired. In nobody’s defence, I was very loud.  
_Your Nubbin climbs onto the rock and sits on it, as if it were the audience._  
**Kaito** _(think)_: Can you listen? Tell me if it’s bad. It’s going to be bad. Okay. Here goes.  
**Kaito**: Pemba. Greetings. I am… a person. Who used to be… the bad kind of person. But now I’m the good kind. Probably. Thanks.  

**Choices**

- **Tell him it’s a bit stiff** — sets `{"q64-advice":"honest"}`
    - **Kaito**: Stiff. Right. I can do less stiff. I think.
- **Tell him it’s a good start** — sets `{"q64-advice":"kind"}`
    - **Kaito**: Really? You’re not just saying that?
    - You are just saying that, a little.
- **Suggest he smiles** — sets `{"q64-advice":"smile"}`
    - Kaito smiles. It looks like it hurts. Your Nubbin hides behind the rock.
    - **Kaito**: Too much?

#### <a id="q64-rehearse-done"></a>Done `q64-rehearse-done`

**Kaito**: Attempt two. “Pemba. I have brought you a gift. The gift is me.”  
**Kaito** _(think)_: No. Awful. Attempt three. “I’m sorry. I want to help.”  
_It is the shortest one. It is also, by far, the best._  
**Kaito**: Okay. Okay. I think that’s it. Short and friendly. Short and friendly.  
**Kaito** _(think)_: What if I just wave? Waving is friendly. Isn’t it?  

### Step 2: Stand by Kaito while he asks to join the group.

Hint: Stay close to the campfire. Kaito does better with someone friendly beside him. · check: `talk:pemba:kaito-joins`

#### <a id="q64-ask"></a>Scene `q64-ask`

_Pemba, Nalu, Tuk and Bao sit round a campfire in the ruins. Kaito steps out of the shadows. Everyone jumps._  
**Tuk** _(shock)_: Oh good. A surprise prince. Exactly what this evening needed.  
**Bao**: Relax. His heart’s going like a rabbit’s. He’s more scared than you are.  
_Kaito raises one hand in a stiff little wave. Then forgets to lower it._  
**Kaito**: Hello, Kaito here.  
**Kaito** _(think)_: …That was not the speech. That was not any of the speeches.  
**Nalu** _(angry)_: What do you want, Kaito?  
_Kaito looks at you. Your Nubbin looks at you. Everyone, suddenly, is looking at you._  

**Choices**

- **Tell them he’s been practising for hours** — sets `{"q64-help":"vouch"}`
    - **Pemba**: Practising? For us? Kaito, that’s the nicest thing anyone’s ever done badly.
- **Nudge him to try again** — sets `{"q64-help":"nudge"}`
    - **Kaito**: I want to help. I was wrong about a lot of things. I want to be on your side, if you’ll let me.
- **Wave back** — sets `{"q64-help":"wave"}`
    - You wave back. Pemba waves too. Bao waves in entirely the wrong direction, on purpose.

#### <a id="q64-ask-done"></a>Done `q64-ask-done`

**Pemba** _(happy)_: Okay. You can join. Welcome to the team!  
**Kaito** _(shock)_: Really? Just like that?  
**Tuk**: No. Not just like that. There will be a trial period. With paperwork.  
**Nalu**: I haven’t forgotten what you did, Kaito.  
**Kaito** _(soft)_: Good. You shouldn’t. I don’t want you to forget it. I want the chance to be more than it.  
**Nalu**: …One chance.  

### Complete

#### <a id="q64-complete"></a>Complete `q64-complete`

_Later, Kaito finds you by the pillar. His hand is still slightly raised, as if it got stuck._  
**Kaito** _(soft)_: Thank you. For listening. And for the rock.  
**Kaito** _(think)_: I’m still not good at this. Talking. People. Waving.  
**Kaito** _(happy)_: But I think I got a bit better today.  
_He waves at you. It is stiff, awkward and slightly too long. Your Nubbin copies it perfectly._  

**Rewards**

- Awkward wave emote (cosmetic): Your Keeper raises one hand in a stiff little wave and forgets to put it down.

**Notes:** Uses the brief’s adapted line “Hello, Kaito here.” (q64-ask line 4), which needs no childLines swap. Rehearsal: three passes through Kaito’s speech; each pass improves whatever advice you pick (all choices count). Comic timing: hold on Kaito’s raised hand for a beat.

## Q65. The White Lotus

*Avatar: The Last Airbender: Pai Sho with Iroh* · audience: all · where: Under the big tree by the pond · when: Any rainy afternoon (never during Chapters 9–11) · requires: Q46, Q64

**Cast:** Uncle Tenzo (Iroh), Kaito (Zuko)

### Step 1: Learn the tile game: finish Uncle Tenzo’s practice round.

Hint: Grow flowers in the middle and block with rocks at the edge. Uncle Tenzo will point out mistakes, kindly. · check: `minigame:complete:lotus-tiles-practice`

#### <a id="q65-tiles"></a>Scene `q65-tiles`

_Rain patters on the leaves. Under the big tree, Uncle Tenzo has laid out a round wooden board and a box of painted tiles._  
**Uncle Tenzo** _(happy)_: Ah, Keeper. Will you keep an old man company? This game is no fun alone. I always win, and then I feel bad.  
_The tiles show flowers, rocks and wind. One tile, set apart from the rest, shows a single white lotus._  
**Uncle Tenzo**: The rules are simple. Flowers grow. Rocks block. Wind moves things. The lotus does nothing at all.  
**Uncle Tenzo** _(think)_: Which is, of course, why it is the most important tile.  
**Kaito**: Uncle, every time you explain this game, it gets more confusing.  
**Uncle Tenzo** _(soft)_: That is how you know it is a good game, nephew. The rules are easy. The game is not.  
_Your Nubbin picks up a flower tile and sniffs it hopefully. It is wood. It is disappointed._  

**Choices**

- **Ask him to teach you properly**
    - **Uncle Tenzo**: With pleasure. First lesson: a tile placed in a hurry is a tile you will stare at all game.
- **Ask what the lotus tile does**
    - **Uncle Tenzo**: Patience. In this game, and perhaps outside it, the quiet ones matter most.
- **Ask if there are snacks** — sets `{"q65-snacks":true}`
    - **Uncle Tenzo**: There are always snacks. A board game without snacks is a punishment.

#### <a id="q65-tiles-done"></a>Done `q65-tiles-done`

**Uncle Tenzo**: Good. You don’t rush. You look at the whole board, not just your own tile. That is rare.  
**Kaito**: He says that to everyone.  
**Uncle Tenzo**: I have never said it to you, nephew.  

### Step 2: Win a game of tiles against Uncle Tenzo.

Hint: Save your lotus tile for last. It can’t be blocked, and it changes the whole board. · check: `minigame:win:lotus-tiles`

#### <a id="q65-game"></a>Scene `q65-game`

**Uncle Tenzo**: Now, a real game. I will not go easy on you. I will go medium.  
_The rain grows heavier. The tea grows cold. Kaito falls asleep against the tree trunk, snoring gently._  
**Uncle Tenzo** _(soft)_: Do you know why I love this game? Because every tile matters, but no tile wins alone.  
**Uncle Tenzo**: A general learns that slowly. A gardener learns it quickly. Be a gardener, Keeper.  
**Uncle Tenzo**: And if you lose, do not sulk. A lost game is a lesson the board gives you free of charge.  
_Your Nubbins sit in a row along the edge of the board, watching each move like it is the most exciting thing in the world._  
**Uncle Tenzo** _(think)_: Hmm. That was a clever move. Did you mean it, or was it luck?  

**Choices**

- **Say you meant it**
    - **Uncle Tenzo**: Then I am in trouble.
- **Admit it was luck**
    - **Uncle Tenzo**: Honest! Luck is kinder to honest players than you would think.
- **Point at your Nubbin** — sets `{"q65-credit":"nubbin"}`
    - **Uncle Tenzo**: Ah! A Nubbin with a strategic mind! I should have known.

#### <a id="q65-game-done"></a>Done `q65-game-done`

_You place your last tile. Flowers bloom across the board. Uncle Tenzo sits back and smiles, very wide._  
**Uncle Tenzo** _(happy)_: Beaten! Fair and square! What a happy afternoon!  
_Kaito wakes and blinks at a board full of flowers._  
**Kaito**: Did I miss it?  
**Uncle Tenzo** _(happy)_: You snored in three keys. It was the best part.  

### Complete

#### <a id="q65-complete"></a>Complete `q65-complete`

**Uncle Tenzo** _(soft)_: Keep this. The white lotus tile. It belongs with someone who has learned patience.  
_He presses the little tile into your palm. It is old, smooth, and warmer than wood should be._  
**Uncle Tenzo**: And now a secret. In any town, any market, if you see this tile on a stall or a door, you are among friends.  
**Uncle Tenzo** _(soft)_: There are more of us than you would think. Old people who play slow games and keep an eye on things.  
**Kaito**: …Uncle. Are you in a secret society?  
**Uncle Tenzo** _(happy)_: I am in a tea society. Mostly. Go back to sleep, nephew.  
_Your Nubbin carries the board home on its head. The lotus tile hangs from your belt, quietly mattering._  

**Rewards**

- Lotus tile board (decor): A round wooden board game table with painted tiles. Nubbins sometimes sit and push the tiles about.
- White Lotus tile badge (cosmetic): Uncle Tenzo’s white lotus tile, worn on the belt. A sign that you are among friends.

**Notes:** Tile game is an original simple board game (flowers grow, rocks block, wind shifts, lotus unblockable); not a recreation of Pai Sho rules. Practice round cannot be lost. Uncle Tenzo plays at “medium” difficulty. All proverbs are new. Rainy-afternoon trigger needs weather rain or any afternoon if rain is rare. q65-snacks is flavour: Tenzo’s reply is the joke.
