# Atlas, page A9: The Comet

## A9-1. Strange Signs

*Tove Jansson, Comet in Moominland (1946, revised 1968): the grey morning and the tail in the sky* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Moominmamma (Moominmamma (Tove Jansson, Comet in Moominland); original design), Moominpappa (Moominpappa (Tove Jansson, Comet in Moominland); original design), The Muskrat (the Muskrat, a gloomy philosopher in a hammock (Tove Jansson, Comet in Moominland); original design)

### Step 1: Step into the valley on the atlas page and meet whoever lives in the tall blue house.

Hint: Touch the blue house on the page, then follow the path to the garden gate. · check: `visit:a09-valley:morning`

#### Scene `a09-01-valley`

_Nova’s atlas falls open at a green valley by the sea, with a tall blue house in it like a stove that grew._  
_You touch the chimney. The page smells of wet grass, and then so does the air._  
_It is morning, but a grey one. Everything looks as if somebody has dusted it with ash and forgotten to wipe it off._  
_A round white someone is standing in the garden, holding a cup and frowning at the sky._  
**Moomintroll** _(happy)_: Oh! Hello. Are you a visitor? Mamma will be pleased. She likes visitors best on grey days.  
_A smaller, sharper someone pops out from behind the water butt and looks straight at your Nubbin._  
**Sniff** _(think)_: What’s that? Is it valuable? It looks valuable. It looks like it would fit in a pocket.  
**Moomintroll**: That’s Sniff. He means hello.  
**Sniff**: I mean hello AND is it valuable.  

**Choices**

- **Let your Nubbin try Sniff’s pocket.**
    - Your Nubbin climbs into Sniff’s coat pocket, turns round twice and settles, as if it has been waiting all its life for this pocket.
    - **Sniff**: It fits! It fits exactly. I’ll be very careful with it. Probably.
- **Keep your Nubbin in your arms for now.**
    - **Sniff**: Suit yourself. I only offered. It’s a very good pocket.
    - Your Nubbin looks at the pocket for a long moment. Then it wriggles down and climbs in anyway.

#### Done `a09-01-valley-done`

_Moomintroll holds out a paw. It is soft, and slightly sticky with jam._  
**Moomintroll**: I’m Moomintroll. Come and see the sea. Something’s wrong with it.  

### Step 2: Follow Sniff’s secret path down to the shore and see what is wrong with the sea.

Hint: Take the narrow path behind the woodshed; it goes through the bushes, not round them. · check: `walk:a09-shore:secret-path`

#### Scene `a09-01-shore`

**Sniff**: This is my secret path. I found it. Nobody else knows about it.  
**Moomintroll**: I know about it.  
**Sniff** _(angry)_: Nobody else EXCEPT you. And now them. It’s getting very crowded for a secret.  
_The path ducks under brambles and comes out on a beach of round stones. The sea is the colour of an old spoon._  
_A fine grey dust floats on it. It moves when the water moves, and it does not wash away._  
**Moomintroll** _(sad)_: It was blue yesterday. It’s always been blue.  
_Along the shore, under a lip of rock, there is a cave. The mouth is low; inside it is dry, and the floor is soft sand._  
**Sniff**: That’s our cave. Mine, mostly. You can come in, but don’t touch anything.  
_There is nothing in it to touch. Sniff looks round it proudly anyway._  

#### Done `a09-01-shore-done`

_You sit in the cave mouth and watch the grey sea breathe in and out._  
**Moomintroll** _(soft)_: Mamma would like this cave. It feels like being kept.  

### Step 3: Ask the Muskrat in the hammock what the grey dust means.

Hint: He is in the hammock between the two birch trees, and he will not be getting out of it. · check: `talk:a09-muskrat:hammock`

#### Scene `a09-01-hammock`

_Back in the garden, a Muskrat lies in a hammock with his paws folded on his stomach, thinking very hard about nothing._  
**Moomintroll**: Muskrat, the sea’s gone grey. Do you know why?  
**The Muskrat** _(think)_: Of course I know why. Something is coming. Something always is.  
**The Muskrat**: A comet, very probably. A star with a tail, falling where it likes.  
**Sniff** _(shock)_: Falling where? Not here. Somewhere else. Somewhere a long way off with nothing valuable in it.  
**The Muskrat**: Where it falls is no concern of a philosopher. Everything ends. It is rather restful, if you think about it.  
_Sniff does think about it. You can tell, because he goes the colour of the sea._  
_Moominpappa comes out on the veranda with his hat on, which is how you know he has had an idea._  
**Moominpappa**: There’s an Observatory in the Lonely Mountains, full of professors with telescopes. They’ll know.  
**Moominpappa** _(happy)_: Somebody should go and ask them. Somebody young, and brave, with a good raft.  

**Choices**

- **“We’ll go.”**
    - **You**: We’ll go.
    - **Moomintroll**: Yes! We’ll go. All of us. Sniff too.
    - **Sniff**: Sniff too? Who said Sniff too?
- **Ask the Muskrat if he’s ever been wrong.**
    - **The Muskrat**: Once. I thought I would get a whole afternoon without being asked questions.
    - **Moomintroll**: That means he doesn’t know. We’ll go and ask the professors.

#### Done `a09-01-hammock-done`

_That night you all stand on the veranda, and Moominmamma points._  
_Low over the mountains there is a new star. It has a tail, faint and red, like a match just blown out._  

#### Complete `a09-01-complete`

**Moominmamma** _(soft)_: Well. If you’re going, you’re going properly. Pullovers. Sandwiches. Something for colds.  
**Moominmamma**: And you’ll come home when you’ve found out. Whatever they say.  
**Moomintroll**: We’ll come home, Mamma. Of course we will.  
_Sniff pats his pocket. Your Nubbin pats back from the inside._  
**Sniff**: I’m only going because the Nubbin wants to. Somebody has to look after it.  

**Rewards**


Sets on completion: `{"a09-01":true}`

**Notes:** OPENING: the page is a green valley by the sea with a tall, round blue house; the whole palette is washed grey in this quest (a grey overlay on sky and sea that lifts only in A9-12). The cave on the shore must be drawn here; it is the shelter in A9-11. FROM HERE ON: your Nubbin rides in Sniff’s coat pocket in every scene unless a line takes it out (art: its head pokes out; it ducks in when Sniff panics). The tail in the sky grows a little in every quest after this one.

## A9-2. The Raft

*Tove Jansson, Comet in Moominland (1946, revised 1968): setting off downriver* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-1, from Nova’s atlas. · requires: A9-1

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Moominmamma (Moominmamma (Tove Jansson, Comet in Moominland); original design), Moominpappa (Moominpappa (Tove Jansson, Comet in Moominland); original design)

### Step 1: Help Moominpappa build a raft on the riverbank.

Hint: Carry planks from the woodshed to the bank; Moominpappa will tell you where they go. · check: `build:a09-raft:river`

#### Scene `a09-02-build`

_Moominpappa has laid out planks on the riverbank in the shape of a raft, and is walking round them looking pleased._  
**Moominpappa** _(think)_: Now. A raft must be sound, and it must have a mast, and it must have a name.  
**Moomintroll**: Does it need a name?  
**Moominpappa**: Everything that goes anywhere needs a name. Otherwise how will it know it’s gone?  
_You carry planks and Moomintroll ties knots. Sniff supervises from a stump and offers advice nobody takes._  
**Sniff**: That plank’s crooked. That one’s too short. That one is fine, I suppose, if you like that sort of plank.  
_By noon there is a raft, and it floats. Moominpappa looks as if he has built a ship of the line._  
**Moominpappa** _(happy)_: What shall we call her?  

**Choices**

- **Suggest calling it after Moominmamma.**
    - **Moominpappa**: Ah. Yes. Then she’ll be sure to bring you home.
    - He paints the name on the stern in careful blue letters.
- **Suggest “The Valuable”.**
    - **Sniff**: Oh. Oh, that’s a very good name. That’s the best name.
    - Moominpappa paints it on, and Sniff stands next to it for a long time with his paws behind his back.

#### Done `a09-02-build-done`

_Moominmamma comes down the bank with a basket so full the lid will not close._  
**Moominmamma** _(happy)_: Sandwiches on top. Pullovers underneath. Don’t eat the pullovers.  

### Step 2: Load the raft and push off into the river.

Hint: The basket goes in the middle; Sniff’s things go wherever Sniff can be talked into putting them. · check: `carry:a09-raft:launch`

#### Scene `a09-02-launch`

_Sniff arrives with a sack of his things: a tin box, a broken compass, a piece of red glass and a great many buttons._  
**Moomintroll**: Sniff, there isn’t room for all that.  
**Sniff** _(angry)_: There’s room for the Nubbin. The Nubbin’s valuable. These are valuable. It’s the same thing.  
_Your Nubbin, in his pocket, looks at the sack. Then it looks at you._  
**Moominmamma** _(soft)_: Sniff, dear. Things are lovely, but they don’t row.  
**Sniff**: These ones might. You don’t know. Nobody’s ever asked them.  

**Choices**

- **Help Sniff choose the one thing he’d miss most.**
    - It takes Sniff a very long time. In the end he picks the red glass, because the sun comes through it.
    - **Sniff**: The rest can stay with Moominmamma. She’s nearly as careful as me.
- **Find room for all of it.**
    - You find room. The raft sits a little lower in the water and turns, very slowly, in a circle.
    - Halfway round, Sniff quietly takes the buttons back up the bank to Moominmamma.

#### Done `a09-02-launch-done`

_Moominpappa pushes the raft off with his foot. Moominmamma waves her apron until the bend._  
_Then there is only the river, the grey sky and the red tail low over the hills._  

### Step 3: Steer the raft downriver until it is time to make camp.

Hint: Keep to the middle of the river and watch the banks. · check: `explore:a09-river:dusk`

#### Scene `a09-02-river`

_The river carries you through woods and meadows. Everything you pass seems to be leaving._  
_Birds fly low and quiet, all one way. A line of ants crosses a log with their eggs held over their heads._  
**Moomintroll**: Where are they all going?  
**Sniff** _(shock)_: Away. Which is what sensible people do. We’re going TOWARDS it.  
**Moomintroll**: We’re going towards finding out. That’s different.  
**Sniff** _(sad)_: It doesn’t feel different. It feels exactly the same.  
_The river forks round a rock. One way is quick and white; the other is slow and dark under the trees._  

**Choices**

- **Take the quick channel.**
    - The raft bucks and spins and shoots out into a pool, and everybody laughs, even Sniff, once it is over.
    - **Sniff**: I wasn’t frightened. My pocket was frightened.
- **Take the slow channel.**
    - You drift under the trees in green half-dark. A heron watches you go by and does not bother to move.
    - **Moomintroll**: This is nice. You could almost forget.

#### Done `a09-02-river-done`

_At dusk you pull in to a sandy bank. Moomintroll unpacks the sandwiches._  
_Upstream, a thin line of smoke rises from somebody else’s fire._  

#### Complete `a09-02-complete`

_Sniff eats his sandwich very slowly, to make it last._  
**Sniff** _(soft)_: When I was small, I thought the sky was a lid. Like on a tin. And nothing could get through it.  
**Moomintroll**: And now?  
**Sniff** _(sad)_: Now I think it’s just sky. Anything can get through sky.  
_Your Nubbin climbs out of his pocket and sits on his knee, which is as near as it can get to a lid._  

**Rewards**


Sets on completion: `{"a09-02":true}`

**Notes:** The raft has a small mast and a name painted on the stern (Moominmamma’s name or "The Valuable", from the choice; art only, no flag). Sniff’s sack: tin box, broken compass, red glass, buttons. The red glass rides with him to the end either way. River staging: woods, meadows, birds and ants leaving, the grey overlay.

## A9-3. Snufkin

*Tove Jansson, Comet in Moominland (1946, revised 1968): the wanderer by the river* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-2, from Nova’s atlas. · requires: A9-2

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design)

### Step 1: Find whoever is camping upstream.

Hint: Follow the smoke along the bank; listen for music. · check: `find:a09-tent:riverbank`

#### Scene `a09-03-camp`

_You follow the smoke along the bank. Before you see the fire, you hear a tune._  
_It is a harmonica, playing something that goes up like a question and comes down without needing an answer._  
_A small green tent stands by the water. In front of it, someone in an old green hat sits on a stone, fishing._  
_The tune stops. He does not turn round._  
**Snufkin**: Come and sit down, if you’re coming. The fish have heard you anyway.  
**Moomintroll**: We didn’t mean to scare them.  
**Snufkin** _(happy)_: They don’t mind. They’re only pretending to be scared, so they don’t have to be caught.  

#### Done `a09-03-camp-done`

**Snufkin**: I’m Snufkin. There’s coffee, if you don’t mind it out of the one cup.  
_He passes the cup round, and it goes round twice. Nobody minds._  

### Step 2: Sit by Snufkin’s fire and hear how he travels.

Hint: Sit on the log nearest the fire. · check: `sit:a09-campfire:evening`

#### Scene `a09-03-fire`

_Sniff is looking around the camp with growing alarm._  
**Sniff** _(shock)_: Where’s all your stuff?  
**Snufkin** _(think)_: This is all my stuff. A tent, a pipe, a cup, a harmonica. A hat.  
**Sniff**: That’s not stuff. That’s hardly anything. What do you do when you want something?  
**Snufkin**: I look at it. Then I leave it where it is, and it’s still beautiful, and I don’t have to carry it.  
_Sniff holds his pocket as if Snufkin might suggest leaving your Nubbin where it is._  
**Snufkin** _(soft)_: Not that. You don’t own a friend; you just walk next to them.  

**Choices**

- **Ask where he’s going.**
    - **Snufkin**: South, in the end. I always go south in the end. But I’ve no hurry.
    - **Snufkin**: Except there’s that.
    - He tips his hat back and looks at the tail over the hills.
- **Ask if he ever gets lonely.**
    - **Snufkin**: Sometimes. Then I go and find someone. Then I go away again. Both are good.
    - **Moomintroll**: You could come with us.
    - **Snufkin**: I could.

#### Done `a09-03-fire-done`

_He plays again, softer. The tune goes round the fire and out over the water, and comes back sounding older._  
_Your Nubbin climbs out of Sniff’s pocket and sits by Snufkin’s boot to listen._  

### Step 3: Look at the comet with Snufkin before you all sleep.

Hint: Walk down to the water’s edge, where the trees open up. · check: `watch:a09-sky:tail`

#### Scene `a09-03-sky`

_By the water the trees open up. The comet is brighter than last night, and its tail is longer._  
**Snufkin** _(soft)_: It looks lonely, doesn’t it. Coming all that way on its own, and nobody pleased to see it.  
**Moomintroll**: Are you frightened of it?  
**Snufkin**: A bit. Being frightened’s all right. It just means you’ve noticed something.  
**Sniff** _(sad)_: I’ve noticed EVERYTHING.  
**Snufkin**: Then you’re very well informed, Sniff.  
_Sniff thinks about this, and decides it is a compliment, and stands slightly taller._  
**Snufkin** _(think)_: I’ll come with you to the mountains. I like a mountain, and I’d like to know about this one.  

#### Done `a09-03-sky-done`

_Snufkin rummages in his tent and comes out with a second harmonica, dented, with one cover loose._  
**Snufkin**: I’ve got two. I don’t like having two of anything. It makes me feel heavy.  
_He holds it out to you._  

#### Complete `a09-03-complete`

_You try a note. It comes out like a duck in a cupboard._  
**Snufkin** _(happy)_: That’s the right note. You just played it in the wrong place.  
_Your Nubbin claps. Sniff claps, a beat later, because the Nubbin did._  
**Snufkin**: Play it when you’re home. Then the tune will know where it lives.  

**Rewards**

- Snufkin’s Spare Harmonica (feature): A dented harmonica with one cover loose. Play it in the Grove and your Nubbins stop to listen, and sometimes sway along.

Sets on completion: `{"a09-03":true}`

**Notes:** MUSIC: Snufkin’s tune is an original instrumental for harmonica (sound brief: rising like a question, falling without an answer). No lyrics, no song from the books or the series. The harmonica reward plays short original phrases in the Grove (music feature). From here on Snufkin travels with the party. Snufkin: green hat, pipe (unlit on screen), green tent.

## A9-4. The Observatory

*Tove Jansson, Comet in Moominland (1946, revised 1968): the professors and the date* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-3, from Nova’s atlas. · requires: A9-3

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Professor (one of the professors at the Observatory (Tove Jansson, Comet in Moominland); original design), The Other Professor (the second professor at the Observatory (Tove Jansson, Comet in Moominland); original design)

### Step 1: Climb the Lonely Mountains to the Observatory.

Hint: Follow the cairns up the path. Snufkin knows where the rope is needed. · check: `climb:a09-mountain:observatory`

#### Scene `a09-04-climb`

_The Lonely Mountains are grey stone and grey sky, with nothing growing on them that has not had to argue for it._  
_The path zigzags up. Snufkin goes first, then Moomintroll, then you, then Sniff, complaining._  
**Sniff**: My legs are shorter than everybody’s. That means this mountain is taller for me. It isn’t fair.  
**Snufkin** _(happy)_: Then you’ll have climbed more of it than anybody, when we’re at the top.  
**Sniff**: …I hadn’t thought of that.  
_Halfway up there is a steep slab. Snufkin ties a rope round a rock and throws you the end._  
_Above you, against the clouds, sits a round white building with a slot in its roof, like a money box for stars._  

**Choices**

- **Give Sniff a hand up the slab.**
    - Sniff takes your hand and pretends he does not need it, and holds on hard all the way.
    - **Sniff**: I could have done it. I just didn’t want to.
- **Wait at the top and let Sniff do it himself.**
    - It takes him a while. When he gets to the top, he is so proud of himself he forgets to complain.
    - **Sniff**: Did you see? Did everybody see?

#### Done `a09-04-climb-done`

_The Observatory door is open. Inside, somebody is counting in a whisper._  

### Step 2: Ask the professors when the comet will come.

Hint: They are by the great telescope. You may have to ask twice. · check: `talk:a09-professors:telescope`

#### Scene `a09-04-telescope`

_Two professors stand under a telescope as long as a boat, both writing in notebooks and not looking up._  
**Moomintroll**: Excuse me. We’ve come from the valley by the sea. We want to know about the comet.  
**The Professor** _(happy)_: So do we. Everybody does. It is a most remarkable comet.  
**The Other Professor**: Most remarkable. Its tail alone is a thousand…  
**The Professor**: Two thousand.  
**The Other Professor**: …a great many miles long.  
**Moomintroll**: But when will it come? And where?  
**The Professor** _(think)_: It will arrive on the seventh of October, at eight forty-two in the evening. To the minute.  
**The Other Professor**: Possibly eight forty-three. We are arguing about the forty-three.  
**Moomintroll**: And where will it land?  
**The Professor** _(happy)_: Oh, somewhere about here, we think. It will be extremely interesting to observe.  

#### Done `a09-04-telescope-done`

_Nobody says anything. One of the professors writes down that nobody says anything._  
**Moomintroll** _(shock)_: Mamma doesn’t know. She doesn’t know the date.  
**Snufkin**: Then we’d better take it to her.  

### Step 3: Sit with Sniff on the Observatory step before you go back down.

Hint: He is on the outside step, holding his pocket. · check: `sit:a09-step:observatory`

#### Scene `a09-04-step`

_Outside, the light is going. Moomintroll is already at the top of the path, hopping from foot to foot to be gone._  
_Sniff sits on the step with both paws round his pocket. Your Nubbin is asleep in it._  
_You sit down next to him. The comet hangs over the far peaks, closer than yesterday._  
**Sniff** _(sad)_: The seventh is in four days. I counted.  
**Sniff**: Will it hit? You can tell me. I’m very brave about things, once I know them.  
_He looks at you. He is not very brave, and you both know it, and he is asking anyway._  

**Choices**

- **“I don’t know.”** — sets `{"a09-answer":"dunno"}`
    - **You**: I don’t know, Sniff.
    - He nods slowly, as if that is a heavier thing to carry than a yes, and also a truer one.
    - **Sniff**: No. Nobody does. Not even them, with their telescope.
- **“We’ll be home by then.”** — sets `{"a09-answer":"home"}`
    - **You**: We’ll be home by then.
    - Sniff looks at you for a long moment. Then he tucks the words away somewhere, like a button.
    - **Sniff**: Home by then. All right.

#### Done `a09-04-step-done`

_Sniff gets up, and then, after a moment, holds out his paw to help you up. It is the first thing he has ever given anybody._  

#### Complete `a09-04-complete`

_You start down the mountain in the dark, by the light of the comet, and sleep under an overhang halfway._  
**Snufkin**: Four days. That’s enough to get home, if nobody stops to look at anything.  
**Sniff**: I always stop to look at things.  
**Snufkin** _(happy)_: So do I. We’ll have to look quickly.  

**Rewards**


Sets on completion: `{"a09-04":true}`

**Notes:** THE DATE (verified): the comet is due on 7 October at 8:42 in the evening. Show it on screen as "7 October, 8:42 pm" in the journal once a09-04-telescope plays; the professors’ "eight forty-three" is our own joke. The journal date is story time only: there is no real-world countdown and nothing on the page is timed. THE SIGNATURE CHOICE (a09-04-step): a09-answer = dunno | home. Paid off in A9-11 (a09-11-dark is dunno; ATLAS_A09_VARIANTS a09-11-dark-home is home). The Observatory: round, white, a slot in the dome; two professors, original designs.

## A9-5. The Snork Maiden

*Tove Jansson, Comet in Moominland (1946, revised 1968): the gold ring and the poisonous bush* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-4, from Nova’s atlas. · requires: A9-4

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design)

### Step 1: Look into the glinting crack in the rocks on the way down.

Hint: It is beside the path where it turns, just below the rope. · check: `find:a09-ring:crevice`

#### Scene `a09-05-crevice`

_In the morning, on the way down, something glints in a crack in the rock._  
_Moomintroll lies on his stomach and reaches in up to the shoulder. He comes out with a small gold ring._  
**Moomintroll** _(think)_: It’s too big for a paw and too small for a crown. What’s it for?  
**Sniff**: It’s for me. I saw it first. I saw the glint before the glint even glinted.  
**Moomintroll**: You were looking at your feet.  
**Sniff** _(angry)_: I saw it with my feet.  
_Sniff goes off to sulk behind a boulder, and comes back with a tiny red stone, polished by the weather._  
**Sniff**: Fine. I found my own. It’s a garnet, probably. It’s better than a ring, probably.  
_He turns it over in his paw. Then, for no reason anybody can see, he holds it out to you._  
**Sniff** _(soft)_: You hold it. Not keep it. Hold it. I’ve got too many pockets full.  

#### Done `a09-05-crevice-done`

_The garnet is warm from his paw. Snufkin raises an eyebrow at Sniff, and says nothing, kindly._  

### Step 2: Run to whoever is calling for help in the valley below.

Hint: Follow the voice down into the trees. Stay behind Moomintroll. · check: `inspect:a09-bush:valley`

#### Scene `a09-05-bush`

_Below the mountain there is a valley of strange, thick plants. Somebody in it is shouting for help._  
_In a clearing a bush with long dark branches has wound itself round a small someone with a golden fringe._  
_The branches move slowly, like fingers that have all the time in the world._  
**The Snork Maiden** _(shock)_: Don’t touch it! It stings! Its leaves are poison!  
_Moomintroll does not even stop. He pulls out his penknife and goes at the branches._  
**Moomintroll**: Hold still! Hold quite still!  
_Snufkin pulls branches back with his walking stick. You find a long dead branch and pin the nearest one down._  
_Your Nubbin hides in Sniff’s pocket, and Sniff hides behind you. Everyone is, in their way, helping._  

#### Done `a09-05-bush-done`

_The last branch gives. Moomintroll catches her before she falls, and they both sit down hard in the grass._  
**The Snork Maiden** _(soft)_: You came straight at it. You didn’t even think.  
**Moomintroll**: There wasn’t time to think. I’ll think later.  

### Step 3: See the gold ring find its owner.

Hint: Sit with everyone in the clearing while she gets her breath back. · check: `give:a09-ring:snork-maiden`

#### Scene `a09-05-ring`

_She is shaking a little, and pretending not to. She smooths her fringe and checks it twice._  
**The Snork Maiden** _(sad)_: I was looking for something. I lost a gold ring in the mountains, a little one I wear round my ankle.  
_Moomintroll goes very pink and holds out his paw._  
**Moomintroll**: Is it this?  
**The Snork Maiden** _(happy)_: My ankle ring! Where did you find it?  
**Moomintroll**: In a crack. I reached in up to here.  
**Sniff**: I saw it first.  
**The Snork Maiden** _(happy)_: Then thank you both. Thank you very much.  
_Sniff, who was ready for an argument, has nowhere to put it and goes rather quiet._  

**Choices**

- **Tell her about the comet.**
    - **You**: There’s a comet coming. The seventh, at eight forty-two in the evening.
    - **The Snork Maiden**: I know. I’ve seen the tail. I thought if I kept busy it wouldn’t notice me.
- **Ask if she’s all right.**
    - **The Snork Maiden**: I am now. I wasn’t. It’s a strange thing, being all right after not being.
    - She slips the gold ring round her ankle and looks at it, to be sure it is still there.

#### Complete `a09-05-complete`

**The Snork Maiden**: I’m the Snork Maiden. My brother is somewhere about, probably making a list.  
**The Snork Maiden**: Can we come with you? I don’t want to be anywhere on my own just now.  
**Moomintroll** _(happy)_: Of course. Mamma always makes enough for everybody.  
_The garnet is still in your hand. Sniff has not asked for it back._  

**Rewards**


Sets on completion: `{"a09-05":true}`

**Notes:** THE RING (outline): a small gold ring found in the mountains; it is the Snork Maiden’s, worn round her ankle (our staging, so it fits both "ring" and the book’s anklet). THE GARNET: Sniff gives you a small red stone "to hold, not to keep" (our own beat); it is an option in A9-11’s bring choice. THE BUSH: scary for a beat, nobody is stung (care notes). Moomintroll does the rescuing here; A9-9 reverses it.

## A9-6. The Snork

*Tove Jansson, Comet in Moominland (1946, revised 1968): the Snork and his meetings* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-5, from Nova’s atlas. · requires: A9-5

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design)

### Step 1: Find the Snork Maiden’s brother.

Hint: Look for a neat camp with a sign on it. · check: `talk:a09-snork:meeting`

#### Scene `a09-06-snork`

_Her brother has made camp under a pine, very neatly. There is a sign on the tent that says OFFICE._  
**The Snork** _(angry)_: Sister. You are late. I had you down for back at four.  
**The Snork Maiden**: A bush tried to eat me.  
**The Snork** _(shock)_: That is not on the list.  
_He writes it on the list, then crosses it off, because it is over._  
**The Snork**: And who are all these people? Have they been introduced? Has anyone taken their names?  
**Moomintroll**: We’re going home before the comet. We’ve come to fetch you both.  
**The Snork** _(think)_: Going home? Without a meeting? Nothing should be decided without a meeting.  

#### Done `a09-06-snork-done`

**The Snork**: Everybody sit in a circle. I shall be the chairman, and also the secretary, as nobody else has a pencil.  
**Snufkin**: I have a pencil.  
**The Snork**: Then you may be the audience.  

### Step 2: Sit through the Snork’s meeting and help it reach a decision.

Hint: Sit in the circle. When a vote comes, put your paw up. · check: `sit:a09-meeting:agenda`

#### Scene `a09-06-meeting`

**The Snork**: Item one. The comet. Is it coming? Show of paws.  
_Everybody puts a paw up. Your Nubbin puts up both, from Sniff’s pocket._  
**The Snork** _(think)_: Carried. Item two. Should we be concerned? Show of paws.  
**Sniff** _(shock)_: Both my paws. And my ears, if they count.  
**The Snork**: Carried. Item three: what to do about it. I shall now accept suggestions.  
_There is a pause, in which nobody suggests anything and the comet moves a little further across the sky._  

**Choices**

- **Propose going home at once.**
    - **You**: I propose we go home. Now.
    - **The Snork**: That is a motion. Does anyone second it?
    - **The Snork Maiden**: Me! And Moomintroll. And everyone. You’re outvoted before you’ve counted.
- **Propose a subcommittee to decide on the way.**
    - **The Snork**: A subcommittee! Now that is a sensible person.
    - **Snufkin**: The subcommittee will meet while walking. Very fast. Towards the valley.
    - **The Snork**: …Agreed.

#### Done `a09-06-meeting-done`

_The Snork writes the minutes and reads them back. Under "Any other business" he has written: Sniff is worried._  
**Sniff**: Well, I am.  
**The Snork** _(soft)_: It is in the minutes. It is official. Everybody is to bear it in mind.  

#### Complete `a09-06-complete`

_The Snork folds his tent into a parcel so small and square that Sniff looks at it with something like love._  
**The Snork**: Meeting closed. We march.  
_You march. The Snork walks at the front, and Snufkin walks at the front of him, and the Snork does not notice._  

**Rewards**


Sets on completion: `{"a09-06":true}`

**Notes:** Comedy quest: the Snork loves order, meetings and minutes, and the joke is affectionate. The "Sniff is worried" minute is a quiet echo of A9-4 that works for either a09-answer, so it needs no variant. Two steps (the outline quest is short).

## A9-7. The Hemulen

*Tove Jansson, Comet in Moominland (1946, revised 1968): the Hemulen and his butterflies* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-6, from Nova’s atlas. · requires: A9-6

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design)

### Step 1: Find out who is crashing about in the meadow with a net.

Hint: Follow the sound of somebody falling over things. · check: `find:a09-hemulen:meadow`

#### Scene `a09-07-meadow`

_In a meadow full of late flowers, a large person in a long dress is running in circles with a butterfly net._  
_He swings, misses, falls into a bush, gets up and swings again, without once looking anywhere but up._  
**The Hemulen** _(angry)_: Hold still, you! You! I know what you are! You’re the very last one I need!  
**Sniff**: Who’s that?  
**Snufkin**: A Hemulen. You can tell, because he’s busy.  
**Moomintroll**: Excuse me! Have you seen the comet?  
**The Hemulen** _(think)_: The what? No. Is it a butterfly?  
**Moomintroll**: It’s a star with a tail. It’s coming on the seventh. It might land here.  
**The Hemulen**: Then it had better land quietly. There is a Mourning Blue in this meadow and I will not have it disturbed.  

#### Done `a09-07-meadow-done`

**The Snork Maiden**: He’s not listening. Hemulens never listen when they’re collecting.  
**Snufkin**: Then we’ll have to help him finish collecting.  

### Step 2: Help the Hemulen find his rare butterfly.

Hint: Look on the tall flowers at the edge of the meadow, where the sun still reaches. · check: `find:a09-butterfly:meadow`

#### Scene `a09-07-butterfly`

_Everyone spreads out across the meadow, walking softly. Even the Snork, who makes it a motion._  
**The Hemulen** _(think)_: Softly. Softly. It is the colour of the hour after sunset, and it hates a fuss.  
**Sniff**: So do I. Nobody ever asks.  
_Your Nubbin climbs out of Sniff’s pocket and stands very still on a stone._  
_A butterfly the colour of dusk comes down out of nowhere and lands on your Nubbin’s head._  
_Your Nubbin does not breathe, and nor do you. Somewhere behind you, the Hemulen draws in a huge breath._  

**Choices**

- **Call the Hemulen over, softly.**
    - The Hemulen tiptoes over, which for a Hemulen is like a cupboard tiptoeing.
    - He does not swing the net. He just looks, for a long time, with his mouth a little open.
    - **The Hemulen**: There. There it is. Oh, I’ll put it in the book, and it will be complete.
- **Keep quiet and let it fly.**
    - The butterfly opens its wings once and goes up into the evening. Nobody says a word.
    - The Hemulen comes over with his net hanging down. He saw it go.
    - **The Hemulen**: It sat on your little one. It chose. I suppose I can write that down instead.

#### Done `a09-07-butterfly-done`

_The Hemulen writes in a fat notebook with his tongue between his teeth._  
**The Hemulen** _(think)_: Complete, as far as this meadow goes. Now. What was it you were saying about a star?  

#### Complete `a09-07-complete`

**Moomintroll**: It’s coming on the seventh. We’re going to my valley. Mamma will look after everyone.  
**The Hemulen**: Will there be butterflies?  
**Moomintroll** _(soft)_: After. There are always butterflies after.  
**The Hemulen** _(happy)_: Then I shall come. I can be very useful, when I have finished something.  
_He folds his net and walks with you, still glancing up, the way some people hum._  

**Rewards**


Sets on completion: `{"a09-07":true}`

**Notes:** VERIFIED: the Hemulen hunts butterflies; the comet barely interests him. "Mourning Blue" is our own invented butterfly (it is not from the book). Kind-hearted register: the butterfly is never caught, pinned or harmed on screen in either branch; "put it in the book" means his notebook of sightings. The Hemulen wears a dress, as Hemulens do (care notes).

## A9-8. The Dry Sea

*Tove Jansson, Comet in Moominland (1946, revised 1968): the sea that went away* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-7, from Nova’s atlas. · requires: A9-7

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design)

### Step 1: Come down to the shore and see what has happened to the sea.

Hint: The path ends at the cliff top. Look out. · check: `visit:a09-shore:dry`

#### Scene `a09-08-shore`

_You come over the last hill and stop. Everyone stops, all along the line._  
_The sea has gone. Where it was there is a great grey hollow of mud and weed and rock, going down and down._  
**Moomintroll** _(shock)_: It was here. There was a whole sea here.  
**Snufkin**: It’s hiding. Everything hides from something that big.  
**The Snork**: The valley is on the other side. Around the bay is three days. Across is one.  
**Sniff** _(shock)_: Across WHAT? It’s all squelch!  
_Far out on the seabed, a stranded fish flaps once, then lies still in a puddle that is just enough._  

#### Done `a09-08-shore-done`

_Three days is more than you have. Nobody needs to say it._  

### Step 2: Help Snufkin make stilts for everyone.

Hint: Gather long straight poles from the driftwood above the tideline. · check: `craft:a09-stilts:driftwood`

#### Scene `a09-08-stilts`

**Snufkin** _(think)_: Stilts. We walk over the mud on stilts.  
_You gather driftwood along the old tideline. Snufkin binds footrests on with string from his pockets._  
_The Hemulen’s stilts are the tallest and the Snork’s are measured exactly. Sniff’s are very short._  
**Sniff**: Mine are short.  
**Snufkin**: Short stilts fall over less far.  
_Everybody practises on the sand, and everybody falls over: Moomintroll often, the Snork Maiden gracefully._  
_Sniff falls over on purpose, to get it done._  
_Your Nubbin rides in Sniff’s pocket, a little higher off the ground than it is used to, and looks impressed._  

**Choices**

- **Ask for tall stilts.**
    - You can see the whole bay from up here, and the long red stripe of the comet beyond it.
    - You fall over once, magnificently, and the Hemulen picks you up by the collar.
- **Ask for short stilts, like Sniff’s.**
    - **Sniff**: Oh, good. Now we’re the short-stilts club. We’ll have meetings.
    - **The Snork**: All meetings must be registered with me.

#### Done `a09-08-stilts-done`

_Snufkin looks at the line of you all, wobbling. He puts his harmonica away, which means it is time._  

### Step 3: Walk out across the seabed on stilts.

Hint: Stay in the line and step where Snufkin steps. · check: `walk:a09-seabed:stilts`

#### Scene `a09-08-seabed`

_You walk out on to the seabed. It sucks at the stilts with a sound like somebody finishing soup._  
_There are things down here nobody was meant to see: a sunk rowing boat, a broken anchor, a wardrobe._  
**The Snork Maiden** _(think)_: Why is there a wardrobe?  
**The Snork**: I shall note it.  
_In a puddle beside your stilt lies a pink shell with a curl in it, still wet._  
_You lean down, very carefully, and pick it up. When you hold it to your ear, there is no sea in it at all._  
**Sniff**: Is it broken?  
**Moomintroll** _(soft)_: It’s waiting. It’s listening for the sea, the same as us.  

#### Done `a09-08-seabed-done`

_You put the shell in your pocket. It is very light, and it seems to want carrying._  

#### Complete `a09-08-complete`

_The sun goes down behind you. Out on the seabed, the light comes from the sky now, red and steady._  
**Snufkin**: We’ll go on in the dark. The comet will light the way. That’s one thing to be said for it.  
_Sniff counts his stilts, his pocket, his Nubbin, and you, and seems relieved that the number comes out the same._  

**Rewards**


Sets on completion: `{"a09-08":true}`

**Notes:** The dry seabed: grey mud, weed, rocks, a sunk rowing boat, a broken anchor, a wardrobe (our own), stranded fish (none shown dying). THE SHELL: a pink curled shell with no sea in it; an option in A9-11’s bring choice and paid off in a09-12-dawn-done-shell. Stilts are a walking minigame-free move: the check completes on reaching the far marker.

## A9-9. The Octopus

*Tove Jansson, Comet in Moominland (1946, revised 1968): danger on the seabed* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-8, from Nova’s atlas. · requires: A9-8

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design)

### Step 1: Cross the deep part of the seabed by the comet’s light.

Hint: Keep to the ridge of rock. Don’t go near the dark pool. · check: `explore:a09-seabed:deep`

#### Scene `a09-09-deep`

_The seabed dips into its deepest part. The mud gives way to black rock and pools that go down further than light._  
_Everything is red under the comet. The puddles shine like spilt jam._  
**The Snork** _(think)_: We keep to the ridge. Single file. That is a rule.  
_Moomintroll is in front, looking ahead to where the valley must be. He is going too fast._  
**Moomintroll** _(happy)_: Not far now. I can almost smell the house. I can almost smell the jam.  
_He steps off the ridge to cut a corner. His stilt sinks into the edge of the biggest, darkest pool._  
_The water in the pool moves, though there is no wind._  

#### Done `a09-09-deep-done`

**Snufkin**: Moomintroll. Come back on the ridge. Slowly.  

### Step 2: Keep everyone together while the Snork Maiden acts.

Hint: Hold the line on the ridge. Hold a light up if you have one. · check: `watch:a09-octopus:pool`

#### Scene `a09-09-octopus`

_A long arm comes out of the pool, and then another, grey and slow and curious._  
_An octopus as big as a cart lifts its head out of the water and looks at Moomintroll with one large, sad eye._  
_An arm curls round his stilt, and another round his middle. He cannot get back on the ridge._  
**Moomintroll** _(shock)_: Help! It’s got hold! I can’t pull free!  
_Sniff squeaks and dives behind the Hemulen. The Hemulen holds his net up, which is no use at all, but brave._  
_The Snork Maiden is already moving. She takes the lantern off the Snork’s pack, lights it and runs at the pool._  
**The Snork Maiden** _(angry)_: Let him GO!  
_She swings the lantern up into the octopus’s eye. The light flares on the wet rock, gold in all that red._  

**Choices**

- **Hold your own light up behind her.**
    - You hold up the pink shell from the seabed. It catches the lantern and throws the light back, twice as bright.
    - The octopus blinks, both eyes, very slowly, and its arms open.
- **Grab Moomintroll’s paw and pull.**
    - You lean out from the ridge and catch his paw. The Hemulen catches your collar, and the Snork catches the Hemulen.
    - The octopus blinks at the lantern, and its arms open, and you all fall backwards in a heap.

#### Done `a09-09-octopus-done`

_The octopus slides back into its pool without a splash, as if embarrassed. The water closes, and it is gone._  
_Moomintroll is sitting on the ridge in the mud with his stilts crossed, staring at the Snork Maiden._  

#### Complete `a09-09-complete`

**Moomintroll** _(shock)_: You saved me.  
**The Snork Maiden** _(happy)_: You saved me first. Now we’re even. It’s much better being even.  
**Moomintroll**: I didn’t know you could do that.  
**The Snork Maiden**: Neither did I. I was too busy doing it to find out.  
_Sniff comes out from behind the Hemulen, and your Nubbin out of his pocket. Both look surprised to be alive and fine._  
**The Snork** _(soft)_: I am noting that the Snork Maiden was brave. I am underlining it. Twice.  

**Rewards**


Sets on completion: `{"a09-09":true}`

**Notes:** VERIFIED: the octopus on the seabed; the Snork Maiden rescues Moomintroll. HOW she does it here (a lantern swung into its eye) is our own staging; check it against the named edition before ship and change it to the book’s method if it differs, in our own words. Care: the octopus is a big, sad-eyed animal that lets go and slides away unharmed; Moomintroll is held, never squeezed or hurt. Two steps (the outline quest is short).

## A9-10. The Race Home

*Tove Jansson, Comet in Moominland (1946, revised 1968): the red sky, the tornado and the glider* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-9, from Nova’s atlas. · requires: A9-9

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design), The Other Hemulen (a second Hemulen met on the road home, whose dress becomes a glider (Comet in Moominland); original design)

### Step 1: Get off the seabed and on to the road home under the red sky.

Hint: Climb the shingle bank on the far side, then keep walking. · check: `walk:a09-road:red-sky`

#### Scene `a09-10-road`

_You climb off the seabed in the morning and leave the stilts in a heap on the shingle._  
_The sky is red now in the daytime too. The air is hot and still, and the leaves on the trees hang down, tired._  
**The Snork Maiden**: What day is it?  
**The Snork** _(sad)_: The seventh. I have it written down. I wish I didn’t.  
**Sniff** _(shock)_: It’s today. It’s actually today.  
**Moomintroll**: We can still do it. It doesn’t come till the evening. We can be home long before that.  
_Sniff looks at you, quickly, and then away, and walks a little faster._  

#### Done `a09-10-road-done`

_At a crossroads, a second Hemulen sits on a milestone in a large flowered dress, fanning himself with a hymn sheet._  
**The Other Hemulen** _(shock)_: Cousin! What are you doing out on a day like this?  
**The Hemulen**: Walking very fast, cousin. You should too.  

### Step 2: Hold on together when the tornado comes.

Hint: Get everyone into the lee of the stone wall and hold on to the nearest paw. · check: `climb:a09-glider:tornado`

#### Scene `a09-10-tornado`

_The wind comes all at once, out of a still sky. Dust goes up in a spinning column that walks across the fields._  
**Snufkin**: Tornado! Down behind the wall, everybody!  
_It does not care about walls. It picks up a haystack, a gate, two hens, and then it picks up the other Hemulen._  
_His flowered dress fills like a sail. He goes up, and grabs the first thing he can, which is Moomintroll._  
_Moomintroll grabs the Snork Maiden, the Snork Maiden grabs Sniff, and Sniff grabs you._  
_Then nobody is on the ground at all._  
**The Other Hemulen** _(shock)_: This is very irregular!  
**Snufkin**: Hold your skirts out wide! Like wings! Wide as you can!  
_The other Hemulen spreads his dress, and the spinning stops, and you are gliding. All of you, in a chain, under a flowered sky._  

**Choices**

- **Hold on tight to Sniff.**
    - Sniff has his eyes shut. He has both paws on you and one foot on his pocket.
    - **Sniff**: Tell me when it’s over. Tell me exactly when.
- **Open your eyes and look down.**
    - Below you the whole country is laid out like a map in red light: the mountains, the dry sea, the river.
    - And at the end of the river, a green valley, and a tall blue house in it like a stove.

#### Done `a09-10-tornado-done`

_The wind drops you all, gently in the end, in a long meadow, one after the other like washing off a line._  
**The Other Hemulen** _(happy)_: My best dress. My very best dress. It has never been so useful.  

### Step 3: Run the last stretch to the valley.

Hint: Down through the birch wood. You know the way from here. · check: `walk:a09-valley:home`

#### Scene `a09-10-run`

_Everyone sits up in the meadow and counts themselves. The Snork counts everyone else, and writes it down._  
**The Snork** _(happy)_: Seven, and a Nubbin, and a cousin. Nobody missing. Nobody even bent.  
_The comet fills a third of the sky now. The light is the colour of the inside of an ember._  
**The Snork Maiden**: How far is it to the valley?  
**Moomintroll** _(happy)_: Over the hill and down through the birch wood. Not far. Not far at all.  
_Snufkin is patting his head. His hat has gone._  
_You look round. It is caught on a thistle three steps away, rocking in the last of the wind._  

**Choices**

- **Run and catch it.**
    - You grab it just as it lifts. It is old and soft and smells of woodsmoke and rain.
    - **Snufkin**: Hold on to it for me. I’ve got my hands full of Sniff.
- **Let your Nubbin fetch it.**
    - Your Nubbin jumps out of Sniff’s pocket, runs, and arrives under the hat, which settles over it completely.
    - The hat walks back to you. Snufkin laughs out loud, for the first time on the whole road.

#### Done `a09-10-run-done`

_Then you run, all of you, down through the birch wood, the hat in your arms, the comet filling half the sky._  
**Moomintroll** _(happy)_: There! There’s the house! There’s the smoke from the chimney!  

#### Complete `a09-10-complete`

_The garden is empty and the house is shut. A note is pinned to the door in Moominmamma’s round writing._  
**Moomintroll**: “Gone to the cave. Come quickly. Have brought the cake.”  
**Sniff** _(happy)_: The cave. Our cave. My cave!  
_The other Hemulen is still holding his dress out, in case. Nobody tells him he can stop._  

**Rewards**


Sets on completion: `{"a09-10":true}`

**Notes:** VERIFIED: the tornado, and a Hemulen’s dress used as a glider. The second Hemulen (HEMULEN_2, our own cousin framing) is "he", as in the English translations; the dress is never the joke (care notes). Moominmamma’s door note is our own wording. Snufkin’s hat is caught in s3 and becomes the A9-12 reward. Sniff’s quick look in a09-10-road works for either a09-answer (an echo, no variant).

## A9-11. The Cave

*Tove Jansson, Comet in Moominland (1946, revised 1968): Moominmamma’s shelter by the shore* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-10, from Nova’s atlas. · requires: A9-10

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design), The Other Hemulen (a second Hemulen met on the road home, whose dress becomes a glider (Comet in Moominland); original design), Moominmamma (Moominmamma (Tove Jansson, Comet in Moominland); original design), Moominpappa (Moominpappa (Tove Jansson, Comet in Moominland); original design), The Muskrat (the Muskrat, a gloomy philosopher in a hammock (Tove Jansson, Comet in Moominland); original design)

### Step 1: Get everyone down to the cave on the shore.

Hint: Take Sniff’s secret path. It is the quickest, and it is still a secret, mostly. · check: `escort:a09-party:cave`

#### Scene `a09-11-arrive`

_Sniff leads the way down his secret path, very fast, with everyone behind him. He does not mention it is a secret._  
_The cave mouth glows. Inside, Moominmamma has made it a room._  
_There are blankets on the sand, and lamps, and the rocking chair, and the clock from the kitchen, ticking._  
**Moominmamma** _(happy)_: There you are. There you all are. And more of you than went.  
_Moomintroll runs into her apron and stays there for a while._  
**Moominmamma** _(soft)_: Come in, all of you. There’s cake. There’s always cake, at the end of the world. That’s what cake is for.  
**Moominpappa**: I brought my memoirs. In case they were needed.  
**The Muskrat** _(think)_: I brought my hammock. Nobody else thought of the hammock.  

#### Done `a09-11-arrive-done`

_The kitchen clock says half past seven. It ticks very loudly, as clocks do when everybody is listening._  

### Step 2: Choose the one thing you bring into the cave.

Hint: Moominmamma is at the cave mouth. Show her what you are carrying. · check: `choose:a09-cave:bring`

#### Scene `a09-11-door`

_Moominmamma stands at the cave mouth with a blanket over her arm, looking at what everybody has carried._  
**Moominmamma** _(soft)_: It’s a small cave, dear, and there are a lot of you now. One thing each, and only what you love fits.  
**Moominmamma**: The rest can wait out here on the rock. It’ll be there in the morning.  
_The Snork puts down his minutes, and the Hemulen his net. Snufkin, who has nothing, keeps it._  
_You empty your pockets on to the rock. The harmonica can wait, and Snufkin’s hat isn’t yours to choose._  
_That leaves three: the shell from the seabed, the garnet Sniff gave you to hold, and your Nubbin._  
_Your arms are only so big._  

**Choices**

- **The shell with no sea in it.** — sets `{"a09-brought":"shell"}`
    - You bring the shell. Your Nubbin, who was never going to be left outside, comes in as Sniff’s one thing.
    - **Moominmamma**: That one’s waiting for something. Yes. Bring it in.
- **The garnet Sniff gave you to hold.** — sets `{"a09-brought":"garnet"}`
    - You bring the garnet. Sniff sees, and pretends very hard not to have seen.
    - **Moominmamma**: Somebody’s been generous. That’s worth a lot of room.
- **Nothing but your Nubbin, held in both arms.** — sets `{"a09-brought":"nubbin"}`
    - You lift your Nubbin out of Sniff’s pocket and hold it in both arms. Everything else you leave on the rock.
    - **Moominmamma**: Yes. That’s the right size for arms.

### Step 3: Sit with Sniff in the dark while the comet comes.

Hint: He is at the very back of the cave. Sit down beside him. · check: `sit:a09-cave:dark`

#### Scene `a09-11-dark`

_The lamps go out one by one, to save oil. The kitchen clock says twenty to nine._  
_Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet._  
_A sound begins, very far off. It is like the whole sky taking in a breath._  
_Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him._  
_He doesn’t ask you anything this time. You said you didn’t know, and he remembers._  
_In the dark his paw finds your hand and holds on._  
_Neither of you says a word. You sit there together and wait, and that is the whole of what you can do._  

#### Done `a09-11-dark-done`

_The kitchen clock says eight forty-two._  

#### Complete `a09-11-complete`

_Then everything is light and noise. The ground shakes, gently, like a cupboard when a train goes by._  
_Moominmamma’s voice comes through it, quite calm, saying what she always says at bedtime._  
**Moominmamma** _(soft)_: Hush now. Hush. Everyone is here.  

**Rewards**


Sets on completion: `{"a09-11":true}`

**Notes:** THE SIGNATURE PAYOFF (a09-answer, set in A9-4): a09-11-dark is for dunno (Sniff holds your hand and says nothing at all). For home play ATLAS_A09_VARIANTS a09-11-dark-home in its place (Sniff says your words back to you in the dark). Both keep the same check and done scene. THE BRING CHOICE (a09-11-door) sets a09-brought = shell | garnet | nubbin; paid off in A9-12 (a09-12-dawn-done and its variants). The cave is the one from A9-1. Staging: kitchen clock in shot; the red light, the sound, the gentle shake. Nobody is hurt; nothing falls in. Hazel’s third rule is acted out in s3 and never named.

## A9-12. The Night It Missed

*Tove Jansson, Comet in Moominland (1946, revised 1968): the comet passes, and the morning after* · audience: all · where: Nova’s atlas: the Comet page (Atlas campaign) · when: Any time after A9-11, from Nova’s atlas. · requires: A9-11

**Cast:** Moomintroll (Moomintroll (Tove Jansson, Comet in Moominland); original design), Sniff (Sniff, Moomintroll’s small, nervous friend (Tove Jansson, Comet in Moominland); original design), Snufkin (Snufkin, the wanderer with the harmonica (Tove Jansson, Comet in Moominland); original design), The Snork Maiden (the Snork Maiden (Tove Jansson, Comet in Moominland); original design), The Snork (the Snork, her brother, fond of meetings (Tove Jansson, Comet in Moominland); original design), The Hemulen (the Hemulen who hunts butterflies (Tove Jansson, Comet in Moominland); original design), The Other Hemulen (a second Hemulen met on the road home, whose dress becomes a glider (Comet in Moominland); original design), Moominmamma (Moominmamma (Tove Jansson, Comet in Moominland); original design), Moominpappa (Moominpappa (Tove Jansson, Comet in Moominland); original design), The Muskrat (the Muskrat, a gloomy philosopher in a hammock (Tove Jansson, Comet in Moominland); original design)

### Step 1: Wait out the night in the cave.

Hint: Stay where you are. It is nearly over. · check: `wait:a09-comet:night`

#### Scene `a09-12-night`

_The roar goes over. It goes on a long time, and then it is less, and then it is going away._  
_You can feel it going, the way you feel a cart go past in the street with your eyes shut._  
**The Muskrat** _(think)_: Hm. It seems to have missed. How very unphilosophical of it.  
_Somebody laughs in the dark: the Snork Maiden. Then Moomintroll, and then everybody._  
**Sniff** _(shock)_: Has it gone? Is it over? Tell me exactly.  
**Moominpappa** _(soft)_: It brushed us with its tail and went on its way. It had somewhere else to be, I expect.  
_The lamps come back on and Moominmamma cuts the cake. Nobody remembers afterwards if it was good, only that it was there._  

#### Done `a09-12-night-done`

_One by one, everybody falls asleep where they are sitting, in a heap, like puppies._  

### Step 2: Go out of the cave in the morning and see what the comet left.

Hint: Walk out of the cave mouth and down to the water. · check: `explore:a09-valley:morning-after`

#### Scene `a09-12-dawn`

_In the morning you wake up with sand in your ear and your Nubbin asleep on your chest._  
_The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning._  
_You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass._  
_And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow._  
**Moomintroll** _(happy)_: It came back. Everything came back.  
**Snufkin** _(soft)_: Things mostly do. Not always. But mostly.  
_The Hemulen is already in the long grass with his notebook, because there are butterflies._  

#### Done `a09-12-dawn-done`

_Your Nubbin scrambles down to the water’s edge, sits in the first wave and lets the sea come home round it._  
**Sniff** _(happy)_: It’s all right, then. It’s all right. I can tell, because it’s doing that.  

### Step 3: Say goodbye to the valley and give Snufkin back his hat.

Hint: Snufkin is at the gate with his pack on. Bring the hat. · check: `give:a09-hat:snufkin`

#### Scene `a09-12-gate`

_Snufkin is at the garden gate with his tent on his back. He is going south, in the end._  
_You hold out his hat. He looks at it for a while._  
**Snufkin** _(happy)_: Keep it. I’ll find another. Hats come to me; it’s the strangest thing.  
**Snufkin**: And if I had it back I’d have two again, sooner or later. You know how I feel about two.  
_He puts it on your head, and it comes down over your eyes. Your Nubbin laughs, which is a sort of hiccup._  
**Moominmamma** _(soft)_: Before you go, dear. Something to remember the house by.  
_She gives you a little blue stove, the same blue as the house, small enough to carry and warm in your hands._  
**Moominmamma**: For your own house. Wherever you light it, that’s where people come home to.  

#### Done `a09-12-gate-done`

_Snufkin is already at the bend in the road. He plays a few notes without looking back, and you play a few back._  
_They come out like a duck in a cupboard. He waves his hand over his head, which means: right note, wrong place._  

#### Complete `a09-12-complete`

_The page starts to curl at its edges, the way a page does when its story has got where it was going._  
**Moomintroll** _(happy)_: Will you come back? You can, you know. There’ll always be a bed. Mamma keeps a spare one for exactly this.  
**Sniff** _(soft)_: Bring the Nubbin. My pocket will be empty otherwise. It’s a very good pocket.  
_The blue house, the green valley, the sea coming home: they go flat and still, and they are paper._  
_You are back in the Grove, in a too-big hat, with a small blue stove in your arms._  

**Rewards**

- Snufkin’s Hat (cosmetic): An old, soft, pointed green hat that smells of woodsmoke and rain. Too big for anybody, which is how it should be.
- Moominhouse-Blue Stove (decor): A little round stove in the blue of the house in the valley. Nubbins like to curl up beside it after a long day.

Sets on completion: `{"a09-12":true,"a09-done":true}`

**Notes:** THE BRING CHOICE (a09-brought, A9-11) is paid off in the s2 done scene: a09-12-dawn-done is for nubbin; for shell play ATLAS_A09_VARIANTS a09-12-dawn-done-shell in its place, for garnet a09-12-dawn-done-garnet. The stove is Moominmamma’s gift (our own beat; the reward is from the outline). REWARDS: Snufkin’s Hat (cosmetic) and the Moominhouse-Blue Stove (decoration), one-time. The "duck in a cupboard" harmonica line calls back A9-3. Sets a09-done (the page is finished).

## Variant scenes

#### Variant `a09-11-dark-home`

_The lamps go out one by one, to save oil. The kitchen clock says twenty to nine._  
_Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet._  
_A sound begins, very far off. It is like the whole sky taking in a breath._  
_Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him._  
_For a long time he doesn’t say anything. Then, in the dark, very small, he does._  
**Sniff** _(soft)_: We’re home by then. You said. We’re home by then.  
_He has been carrying it since the mountain, like a button in a pocket. Now he gives it back to you to hold._  
**Sniff**: And we are. We’re home. So that part came true.  
_You sit there together and wait, and that is the whole of what you can do._  

#### Variant `a09-12-dawn-done-shell`

_You take the pink shell out of your pocket and hold it to your ear._  
_Very faint, very far, there is the sound of the sea in it again. It must have got back first._  
**Moomintroll** _(happy)_: Let me listen! Oh. Oh, it’s home.  

#### Variant `a09-12-dawn-done-garnet`

_You hold out the garnet to Sniff. You were only holding it, after all._  
**Sniff** _(soft)_: No. You keep it. I gave it to you to hold, and you held it all night, and that’s keeping.  
_He looks surprised at himself. Then he looks pleased, which surprises him more._  
