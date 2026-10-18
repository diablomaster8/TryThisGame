# Pixel's Arcade, cartridge PA1: The Chao Altar

## PA1-1. The Cabinet

*Sonic Adventure (Sonic Team, Sega, 1998): the frame* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: After chapter 5, once Pixel has the Workyard cabinet running in the lantern shed. With s21Done, Clank sits on top.

**Cast:** Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only)

### Step 1: Look over the old cabinet Pixel has set up in the lantern shed.

Hint: It’s against the back wall of the lantern shed. Mind the coin slot. · check: `inspect:pa1-cabinet:lantern-shed`

#### Scene `pa1-01-shed`

_The lantern shed smells of sawdust and warm dust. The old cabinet from the Workyard skip stands against the back wall, humming._  
_It has a dent the shape of a boot in one side. Someone has painted over the name, badly._  
**Pixel** _(happy)_: Don’t touch the coin slot. There was a mouse family in it. They’ve moved to the bottom drawer and they’re very happy.  
**Pixel**: Three days. One new fuse, four wires, and a part I traded Byte for a jar of Clover’s honey.  
**Pixel** _(think)_: He thinks he got the better deal. He didn’t.  
_Pixel lifts a flap under the screen. Inside sit five chunky cartridges in a row, each in a faded sleeve._  
**Pixel**: Each one’s a whole world. Not a picture of one. A world. You go in, and I stay out here and play player two.  
**Pixel**: This one first. Look at the label.  
_The sleeve shows a garden: a pool, a palm tree, and small round creatures with a ball floating over each head._  
_Your Nubbin presses its face to the sleeve and goes very still._  

**Choices**

- **They look like our Nubbins.**
    - **Pixel**: Don’t they? Like cousins. Like somebody else’s family photos, with your nose in them.
- **Is it safe in there?**
    - **Pixel**: Safe as a game. You can’t get hurt. You can get your feet wet.
    - **Pixel**: And I’ll be right here. I’ll talk to you through the speaker the whole time.
- **How old is this thing?**
    - **Pixel**: The label’s too faded to read the year. Old, anyway. Older than the sawmill roof.

#### Done `pa1-01-shed-done`

_Pixel blows the dust off the cartridge in one long puff and wipes the contacts on her sleeve._  
**Pixel**: Clean contacts, happy cartridge. Everyone knows that. Nobody knows why.  

### Step 2: Slot the cartridge into the cabinet and step through.

Hint: Push the cartridge into the slot under the screen, then step up onto the footplate. · check: `place:pa1-cartridge:cabinet`

#### Scene `pa1-01-slot`

_The cartridge goes in with a clunk you feel in your teeth. The screen flickers blue, then white._  
_A sound like a whole sea breathing in comes out of the speaker._  
**Pixel** _(happy)_: Okay. Okay okay okay. Player two, ready.  
**Pixel**: Rules. One: I can see what you see, more or less. Two: I can’t come in. Three: if you want out, say so, and I pull the plug.  
**Pixel**: Gently. I pull it gently.  
_The screen is a window now. Through it comes warm air, and the smell of cut grass and pool water._  
_Your Nubbin looks at you, then at the window, then at you again._  
**You**: Together, then.  
_You step up onto the footplate, take your Nubbin under one arm, and lean into the light._  

#### Done `pa1-01-slot-done`

_Behind you the shed goes small and far, like a room seen through a keyhole._  
**Pixel**: See you on the other side. I mean, I’ll see you. You won’t see me. You know what I mean.  

#### Complete `pa1-01-complete`

_You land on soft grass with the gentlest bump, as if the world was expecting you._  
_There’s a pool, a palm tree, a path of stepping stones. Somewhere, a fountain._  
**Pixel** _(happy)_: You’re in! You’re in. Your hair’s gone a bit square at the edges. It suits you.  
_Your Nubbin rolls off your arm and lands sitting up, already staring at something past your knee._  

**Rewards**


Sets on completion: `{"pa1-01":true}`

**Notes:** FRAME: the cabinet stands in the lantern shed from the moment Pixel’s Arcade unlocks (after chapter 5). Pixel never enters a cartridge: every Pixel line in PA1 is through the speaker (tinny filter, a small speaker badge on her portrait). Stepping through: a two-second pixel-dissolve; inside, the Keeper and Nubbin get a faint square edge, the cartridge’s own look. CLANK (s21Done): play PA1_VARIANTS pa1-01-clank straight after pa1-01-shed-done; from then on Clank is drawn sitting on top of the cabinet in every PA1 frame scene. The cartridge has its own save (canon 29).

## PA1-2. A Garden Like Ours

*Sonic Adventure (Sonic Team, Sega, 1998): the Station Square Chao Garden* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-1, from Pixel’s cabinet. · requires: PA1-1

**Cast:** Radio (A news broadcast at the hotel front desk; original)

### Step 1: Explore the Chao Garden and meet the Chao.

Hint: Walk round the pool and the fruit tree. Your Nubbin will find the Chao before you do. · check: `explore:pa1-chao-garden:station-square`

#### Scene `pa1-02-garden`

_It’s a garden behind glass, tucked into the back of a big city hotel. Through the glass roof you can see towers and blue sky._  
_Eggs sit in the grass like dropped sweets. Small round creatures wobble between them._  
_Each one has a little ball floating over its head. When one bumps into the palm tree, its ball turns into a spiral._  
**Pixel**: Those are Chao. It says so on the sleeve. CHAO. One word, lots of them.  
_Your Nubbin waddles straight into the middle of them, sits down, and is instantly sat on._  
_The Chao that sat on it gets up, looks at it, and pats it on the head. Its ball turns into a heart._  
**Pixel** _(happy)_: Oh, they’re cousins. They are absolutely cousins.  
_A Chao offers your Nubbin half a fruit. Your Nubbin offers back a pebble, and both of them seem to think this is fair._  
**You**: It’s like the Grove, only smaller.  
**Pixel**: And with a glass roof. Byte would love a glass roof. Don’t tell him I said so.  

#### Done `pa1-02-garden-done`

_You find a watering can by the pool and fill the trough under the fruit tree._  
_Three Chao come to watch you do it, very seriously, like inspectors._  

### Step 2: Decide what to do about the garden gate.

Hint: The little wooden gate is between the grass and the hotel corridor. · check: `choose:pa1-gate:garden`

#### Scene `pa1-02-gate`

_The garden door opens onto the hotel. Through it comes the sound of a radio at the front desk, turned up loud._  
**Radio**: …police have closed the square. Witnesses describe a creature made of water. Please stay indoors…  
_Sirens, far off. The Chao don’t mind, because they don’t know what sirens are._  
**Pixel** _(think)_: Hmm. That’s new. The sleeve didn’t say anything about water creatures.  
_The garden has a gate of its own, a low wooden one with a latch and a key, between the grass and the hotel corridor._  
**Pixel**: You could lock it. Nothing gets in, nothing gets out. Or leave it, and they can wander, like ours do.  
**Pixel**: I don’t know which. I’m player two. You’re the one standing there.  
_A Chao is sitting on the latch, swinging its feet._  

**Choices**

- **Lock the gate. Keep them safe inside.** — sets `{"pa1-gate":"locked"}`
    - You lift the Chao off the latch and turn the key. It clicks, small and firm.
    - **Pixel**: Safe and sound. Good. That’s one thing sorted.
- **Leave it open. Let them come and go.** — sets `{"pa1-gate":"open"}`
    - You prop the gate with a stone. The Chao on the latch rides it all the way open, delighted.
    - **Pixel**: Free-range Chao. Like ours. All right.

#### Done `pa1-02-gate-done`

_The sirens move off toward the square. Your Nubbin is the last to leave the pool, and it looks back twice._  

#### Complete `pa1-02-complete`

_The radio at the front desk is still talking. The man behind the desk turns it up, then down, then up again._  
**Pixel**: Let’s go and look. Just look. From a sensible distance.  
**Pixel** _(think)_: I’m saying “sensible” now so that later I can say I said it.  

**Rewards**


Sets on completion: `{"pa1-02":true}`

**Notes:** SIGNATURE CHOICE: pa1-gate = locked | open (pa1-02-gate). It pays off fifteen quests later, in PA1-17 (locked plays PA1_VARIANTS pa1-17-chao-locked) and in PA1-18’s last image. The gate stays as chosen in the garden art until PA1-17. Neither option is wrong on its face; locking is the careful choice, and the line never scolds it. The Chao use emote balls exactly like the Grove’s (plain, heart, spiral, exclamation, question), drawn in the cartridge’s own palette. The radio is a voice only (speaker pa1-radio).

## PA1-3. The Water Creature

*Sonic Adventure (Sonic Team, Sega, 1998): Chaos 0 in Station Square* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-2, from Pixel’s cabinet. · requires: PA1-2

**Cast:** Police Officer (The Station Square police (Sonic Adventure, Sega, 1998)), Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998))

### Step 1: Go to Station Square and see what the police are surrounding.

Hint: Out through the hotel lobby and across the plaza to the police tape. · check: `walk:pa1-square:police-line`

#### Scene `pa1-03-square`

_Station Square is all bright glass and fountains. Today it is also police tape, and a crowd held back behind it._  
_Officers crouch behind their cars. In the middle of the square something stands in a puddle that wasn’t there this morning._  
_It’s made of water, clear water, roughly the shape of a person. There’s a green glow where a heart should be._  
**Police Officer**: Stay back, please. Back behind the line. That means you too, and your… whatever that is.  
_Your Nubbin stays back. It is holding the hem of your shirt in both hands._  
**Pixel** _(shock)_: Oh. Look at its head. Look at the shape of its head.  
_The top of the creature’s head curls up and over, just like the Chao’s heads. Just like your Nubbin’s._  
_The officers shout warnings. Whatever they throw at it goes straight through, like pebbles into a pond._  

#### Done `pa1-03-square-done`

_Then a blue blur comes down the street so fast that the whole crowd’s hair stands up._  

### Step 2: Watch from behind the bench while Sonic deals with the creature.

Hint: Keep your Nubbin behind the bench by the fountain. · check: `watch:pa1-chaos:drain`

#### Scene `pa1-03-sonic`

**Sonic** _(happy)_: Hey, hey! Everybody back! I’ve got this one.  
_A blue hedgehog skids to a stop between the police and the creature. He’s grinning, which seems to be his resting face._  
_It’s a short fight, mostly Sonic bouncing and the creature splashing. You keep your Nubbin behind a bench._  
_Then the creature folds. It doesn’t fall; it pours, all at once, into a drain in the road._  
**Sonic** _(think)_: Huh. Slippery. Didn’t even say goodbye.  
_Just before it goes, for half a second, it looks across the square. It looks at your Nubbin._  
_Its face doesn’t look cruel. It looks like someone who has woken up in the wrong house._  
**Pixel** _(soft)_: Did you see that? It wasn’t angry. It was lost.  

**Choices**

- **Tell Sonic it looked lost.**
    - **Sonic**: Lost things still splash. Thanks, though. I’ll keep an eye out.
- **Look down the drain.**
    - Under the grate, water runs away fast and very clear. It glows faintly green, all the way down.
- **Say nothing.**

#### Done `pa1-03-sonic-done`

_Sonic is gone as fast as he came. The police start rolling up their tape._  
**Pixel**: So that’s the water creature. I think we’re going to see it again.  

#### Complete `pa1-03-complete`

_A small rosy light is bobbing above the drain, about the size of a plum._  
_It wasn’t there a moment ago. It comes up to your face, circles your Nubbin once, and waits._  
**Pixel** _(think)_: That’s not on the sleeve either.  

**Rewards**


Sets on completion: `{"pa1-03":true}`

**Notes:** CARE: the police never fire on screen. They shout, and “whatever they throw” passes through Chaos like pebbles. Chaos 0 here is person-sized; its eyes are drawn lost, not cruel. The rosy light (Tikal) first appears in the complete scene and stays near the Keeper from now on, between visits to the past.

## PA1-4. The Light

*Sonic Adventure (Sonic Team, Sega, 1998): Tikal’s first memory, the shrine and the Chao* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-3, from Pixel’s cabinet. · requires: PA1-3

**Cast:** Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998))

### Step 1: Follow the rosy light.

Hint: It waits for you down the quiet back street off the square. · check: `walk:pa1-light:back-street`

#### Scene `pa1-04-follow`

_The rosy light drifts down a quiet back street, away from the crowd. Every few steps it stops to let you catch up._  
_It’s warm: not hot like a lamp, but warm like a hand._  
**Pixel** _(think)_: I’ve checked the controls. There’s no button for this. Whatever it is, it isn’t me.  
_Your Nubbin reaches up for it. The light dips, lets itself be touched, and bobs away again._  
**Pixel**: It likes your Nubbin. That’s a good sign, isn’t it? Things that like Nubbins are usually all right.  
_At the end of the street the light stops in front of a blank wall. Then it grows, very gently, until there is nothing else._  

#### Done `pa1-04-follow-done`

_The city sounds go out like a candle. Birdsong comes in instead, and the smell of warm stone._  
**Pixel** _(shock)_: Keeper? The screen’s gone all gold. Where are you?  

### Step 2: Sit by the shrine pool with the girl and the Chao.

Hint: Sit on the warm stone at the edge of the pool, quietly. · check: `sit:pa1-shrine:pool`

#### Scene `pa1-04-shrine`

_You are standing on old stone steps at the edge of a jungle. It is morning, very long ago; you can feel that the way you feel weather._  
_Ahead is a shrine. On a stone altar in the middle of it sits an enormous green jewel, glowing softly._  
_Around it are pools of clear water, and in the water and on the steps and everywhere, there are Chao._  
_A girl sits among them with her feet in the pool. She has long braids, a gentle face, and a Chao asleep in her lap._  
**Tikal** _(happy)_: Oh! A visitor. And a little one too. Come and sit down, quietly. This one’s only just gone off to sleep.  
**Tikal**: I’m Tikal. You’re from a long way off, aren’t you? Your little one doesn’t look like ours. It looks like a cousin.  
_You sit on the warm stone. Your Nubbin climbs down into the shallows and is surrounded at once._  
_Then the water in the middle pool moves. It rises, slowly, into the shape you saw in the square._  
_It isn’t lost now. It stands tall over the Chao, quiet and watchful, with the green glow steady in its chest._  
**Tikal** _(soft)_: Don’t be afraid. That’s Chaos. It looks after them. It looks after all of us, really.  
**Tikal**: Some of the clan say it’s a monster. It isn’t. It’s just the one who worries most.  

**Choices**

- **Bow to Chaos.**
    - You bow, a little awkwardly, sitting down. Chaos looks at you for a long moment, then lowers its head, just slightly.
- **Ask Tikal what it is.**
    - **Tikal**: Grandmother says it was a Chao once, long ago, and the Emerald’s light changed it. Now it guards the rest.
- **Watch your Nubbin.**
    - Your Nubbin has floated on its back right to Chaos’s feet. Chaos dips one watery finger and turns it gently the right way up.

#### Done `pa1-04-shrine-done`

_The gold comes back, and the birdsong goes, and you are in the back street with your hand on a blank wall._  
**Pixel** _(shock)_: You were gone for nine seconds. Nine. You look like you were gone all afternoon.  

#### Complete `pa1-04-complete`

**Pixel** _(think)_: The water creature. That was the water creature, wasn’t it? From the square. But kind.  
**You**: It was looking after them.  
**Pixel**: Then what happened to it?  
_The rosy light bobs once at your shoulder and goes quiet, like someone who isn’t ready to say yet._  

**Rewards**


Sets on completion: `{"pa1-04":true}`

**Notes:** THE PAST: every trip back is a gold dissolve and the same shrine, drawn warmer and softer than the present. Tikal can see and talk to the Keeper; nobody else in the past notices you. Chaos never speaks. The Chao in the past are the same design as the garden Chao.

## PA1-5. Tails’s Workshop

*Sonic Adventure (Sonic Team, Sega, 1998): the Mystic Ruins, Tails’s workshop and Chaos 2* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-4, from Pixel’s cabinet. · requires: PA1-4

**Cast:** Tails (Miles “Tails” Prower (Sonic Adventure, Sega, 1998)), Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998)), Dr. Eggman (Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998))

### Step 1: Take the train out to the Mystic Ruins and find the workshop.

Hint: The station is on the far side of the square. The workshop is on the hill above the Mystic Ruins stop. · check: `visit:pa1-mystic-ruins:workshop`

#### Scene `pa1-05-train`

_A train runs from Station Square out to the Mystic Ruins, a green valley full of old stones and older trees._  
_On the hill above the station is a workshop with a runway and a bright little plane outside. Someone is muttering at an engine._  
**Tails**: Hand me the… no, that’s the… thank you, that’s the one I meant, actually.  
_A young fox with two tails is up to his elbows in the plane’s nose. There is oil on his face and more on one tail._  
**Tails**: Hi! Sorry. I’m Tails. You’re not from round here, are you? Your friend’s got the same head as a Chao.  
**Tails**: Sonic’s inside. We found a Chaos Emerald, and it’s doing something weird to the instruments.  
**Pixel** _(happy)_: A fox. With two tails. Who fixes planes. I want to live in this game.  

#### Done `pa1-05-train-done`

_Tails hooks a spare stool out from under the bench with his foot. He doesn’t stop working once._  

### Step 2: Hand Tails the spanner he needs.

Hint: It’s one of the seven on the bench. Your Nubbin may already know which. · check: `give:pa1-spanner:tails`

#### Scene `pa1-05-spanner`

**Tails**: Could you pass the spanner? The silver one.  
_The bench has seven silver things on it. All of them are spanners._  
**Tails**: The other silver one.  
_Your Nubbin climbs onto the bench, picks one up in both arms, and stands there beaming._  
**Pixel**: Tell him it’s a ten. It looks like a ten. Through the screen, everything looks like a ten.  
**Tails** _(think)_: Nearly there. If I’m reading this right, the Emerald’s giving off a signal, and something’s following it.  

**Choices**

- **Take the one your Nubbin is holding.**
    - **Tails**: That’s it! How did it… never mind. Thank you, both of you.
- **Hand him the smallest.**
    - **Tails**: Close! One up. Thanks.
    - Your Nubbin hands him the one up. It’s the one it was holding.
- **Ask which one he means.**
    - **Tails**: The ten. Sorry. I always forget other people can’t see inside my head.
    - Your Nubbin is already holding the ten.

#### Done `pa1-05-spanner-done`

_The engine coughs, catches and purrs. Tails punches the air and bangs his head on the propeller._  

### Step 3: Keep your head down when Eggman comes.

Hint: Get behind the workbench with your Nubbin and stay there. · check: `watch:pa1-eggman:workshop`

#### Scene `pa1-05-ambush`

_A shadow falls over the runway. A round flying machine hums down out of the sky, and in it sits a round man with a huge moustache._  
**Dr. Eggman** _(happy)_: Good afternoon, vermin! I’ll be taking that Emerald. No, don’t get up. I’ll show myself in.  
**Tails** _(shock)_: It’s Eggman! Sonic, he’s here!  
**Sonic**: Already on it. Oh, hi again. You’re everywhere today.  
_You get down behind the workbench with your Nubbin, as small as the two of you can be._  
_A metal claw shoots out of the machine. In a clatter and a flash, the Emerald is gone from the bench._  
**Dr. Eggman**: Chaos, my dear! Supper!  
_Out of a puddle by the runway rises the water creature, taller than before. Eggman tosses it the Emerald, and it swallows the light._  
_It grows: its arms lengthen and its head curls higher. Its eyes don’t look at Eggman at all, but past him, at nothing._  
**Dr. Eggman**: Two Emeralds, two sizes! At seven, my friend, nobody will be able to stop us. Toodle-oo!  

#### Done `pa1-05-ambush-done`

_Sonic chases Chaos off into the valley. Eggman’s machine hums away over the trees, chuckling to itself._  
**Tails**: Are you two all right? He doesn’t usually bother with bystanders.  
**Pixel** _(shock)_: Nobody look at the claw marks on the bench. Nobody.  

#### Complete `pa1-05-complete`

_Tails fishes a second spanner out of the plane’s nose, where it has been all along._  
**Tails**: Thanks for the help. Really. Most people just ask about the tails.  
**Pixel** _(sad)_: I was going to ask about the tails.  
_Tails tells your Nubbin to keep the spanner it was holding. It carries it for the rest of the cartridge._  

**Rewards**


Sets on completion: `{"pa1-05":true}`

**Notes:** Sonic’s fight with Chaos 2 happens offscreen, in the valley. The spanner is a carried prop on the Nubbin until PA1-18 (art only, no inventory item). Eggman is comic and pompous; he never threatens the Keeper directly.

## PA1-6. The Shattered Emerald

*Sonic Adventure (Sonic Team, Sega, 1998): Knuckles, the Master Emerald and the fall of Angel Island* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-5, from Pixel’s cabinet. · requires: PA1-5

**Cast:** Knuckles (Knuckles the Echidna (Sonic Adventure, Sega, 1998)), Dr. Eggman (Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998))

### Step 1: Visit the floating island and its guardian.

Hint: Tails will drop you on the island on his next flight. Climb the shrine steps. · check: `climb:pa1-shrine:angel-island`

#### Scene `pa1-06-island`

_High above the Mystic Ruins floats a whole island. Tails swings the plane past it and lets you down on the grass._  
_At its heart is a shrine of stone steps. At the top sits a green Emerald, huge, glowing; the same one you saw on Tikal’s altar._  
_Someone is sitting on the steps below it, arms folded, glaring at the sky as if it owes him money._  
**Knuckles** _(angry)_: Who let you up here? Nobody comes up here.  
**Knuckles**: I’m Knuckles. I guard the Master Emerald. You don’t touch it, you don’t lean on it, and that thing doesn’t lick it.  
_Your Nubbin, who was about to lick it, sits down._  
**Knuckles** _(soft)_: …It can stay. It looks like a Chao. Chao used to live up here, way back. Before my people were gone.  
_Then the sky goes dark, and the Emerald flashes, and the steps shake under your feet._  
_Something rises out of the Emerald itself: water, clear, with a green glow. It strikes the stone once, very hard._  
_The Master Emerald splits into a hundred green shards. They fly out in every direction, like seeds from a pod._  
**Dr. Eggman** _(happy)_: Splendid work, Chaos! Knuckles, always a pleasure. Do enjoy your swim!  
_The island tips, slowly, like a great ship. Then it falls._  

#### Done `pa1-06-island-done`

_You hold on to the steps and to your Nubbin, and the island comes down into the sea with a long, deep, sighing splash._  
_When the spray settles, it is floating off the Mystic Ruins, as if it had always meant to._  
**Pixel** _(shock)_: Is everyone… you’re all right? Good. My hands are shaking, and I’m not even in there.  

### Step 2: Help Knuckles find the shards of the Master Emerald.

Hint: Your Nubbin is good at finding green things. Search the ferns on the left side. · check: `find:pa1-shard:jungle`

#### Scene `pa1-06-shards`

**Knuckles** _(angry)_: Great. Great. A hundred pieces, all over the place.  
**Knuckles** _(sad)_: Without the Master Emerald this island stays down. And it’s my job. It’s the only job I’ve got.  
_He kicks a stone, stares at the jungle, and doesn’t move._  
**Pixel**: He’s going to be ages. Look how much jungle there is.  
_Your Nubbin trots off into the ferns. A minute later it comes back with a green shard as long as its arm, very pleased._  
**Knuckles** _(shock)_: …How did it do that?  
**Pixel** _(happy)_: Nubbins are good at finding green things. Ask anyone who’s ever dropped a pea.  
**Knuckles**: Fine. You. Small one. You’re with me. Keeper, keep up.  

**Choices**

- **Search with Knuckles.**
    - **Knuckles**: You take the left side. I’ll take the right. Shout if you find anything. Don’t shout if you don’t.
- **Ask about his people.**
    - **Knuckles**: Echidnas. There was a whole clan once. Now there’s me.
    - **Knuckles**: Anyway. Shards. Left side.

#### Done `pa1-06-shards-done`

_By sunset you have a sack of shards between you. Knuckles counts them twice and scowls, which seems to be how he says thank you._  
**Knuckles**: Not all of them. Not yet. But it’s a start.  

#### Complete `pa1-06-complete`

_Knuckles gives your Nubbin the smallest shard to hold, takes it back at once, then hands it over again._  
**Knuckles**: Just for tonight. Don’t lose it. That piece is a bit of my home.  
_Your Nubbin sleeps with it in both hands. In the morning it gives it back without being asked._  

**Rewards**


Sets on completion: `{"pa1-06":true}`

**Notes:** Knuckles’s own opening (the island falling) is moved to after the workshop, as the outline orders it. Nobody is hurt in the fall: a long splash, then calm. The shard hunt is a short find, not a collection grind: the check completes on the first shard after the scene; the sack is narration.

## PA1-7. The Prayer

*Sonic Adventure (Sonic Team, Sega, 1998): Tikal at the Master Emerald* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-6, from Pixel’s cabinet. · requires: PA1-6

**Cast:** Knuckles (Knuckles the Echidna (Sonic Adventure, Sega, 1998)), Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998))

### Step 1: Go to the rosy light above the broken altar.

Hint: It’s circling the empty altar at the top of the shrine steps. · check: `find:pa1-light:altar`

#### Scene `pa1-07-light`

_In the morning the rosy light is hovering over the empty altar where the Master Emerald was._  
_It turns slow circles above the broken stone, as if it’s looking for something it put down._  
**Knuckles** _(think)_: That light’s been round here since I was a kid. It never does anything. It just hangs about.  
**Knuckles**: Go on, then. If it wants you, it wants you.  
**Pixel**: Hang on, I’m getting the gold screen again. Hold your Nubbin’s hand.  
_Your Nubbin takes your finger. The light comes down over the two of you like a warm hat._  

#### Done `pa1-07-light-done`

_Birdsong and warm stone. The Master Emerald is whole again, glowing on its altar at the top of the steps._  

### Step 2: Sit with Tikal while she learns the prayer.

Hint: Sit beside her on the top step, below the Emerald. · check: `sit:pa1-tikal:altar`

#### Scene `pa1-07-prayer`

_Tikal kneels at the top of the steps with her hands together. She is saying the same words again and again, under her breath._  
_Around the great Emerald stand seven smaller jewels, each a different colour, each in its own hollow of stone._  
**Tikal** _(happy)_: Oh, it’s you again! Sit with me. Grandmother taught me the prayer. She said learn it, not just say it.  
**Tikal** _(think)_: The servers are the seven Chaos.  
**Tikal**: That’s how it begins. Seven Emeralds. The servers. But I don’t know what they serve, or who.  
_In the pools below, the Chao are splashing. Chaos stands among them, very still, the way a heron stands._  
**Tikal**: Father says it means the Emeralds serve whoever holds them. That’s what he wants it to mean.  
**Tikal** _(soft)_: I think it means something else. Something I haven’t grown into yet.  

**Choices**

- **Maybe they serve the Chao.**
    - **Tikal**: The Chao? The smallest ones?
    - **Tikal**: Oh. I like that. Grandmother would like that.
- **Maybe it depends who’s asking.**
    - **Tikal**: Like a gate that opens for some and not for others. Yes. Maybe.
- **Just listen to her say it.**
    - You sit and listen. She says it again, slower, and this time she isn’t trying to understand it, only saying it.
    - **Tikal**: Thank you. It goes easier with someone listening.

#### Done `pa1-07-prayer-done`

_The light comes back for you mid-sentence. Tikal smiles and lifts a hand, as if she knows you’ll be back._  
**Pixel** _(soft)_: She’s nice. Is it weird that I’m worried about her?  

#### Complete `pa1-07-complete`

**Knuckles**: Well? What did it want?  
**You**: To show me someone praying.  
**Knuckles** _(sad)_: Huh. My people used to pray here. I don’t know any of it. There was nobody left to teach me.  
_He sits down on the broken altar with his back to you, and for a while nobody says anything._  

**Rewards**


Sets on completion: `{"pa1-07":true}`

**Learning Grove swaps**

- `pa1-07-prayer#3` → Seven jewels, seven keepers of the light.

**Notes:** QUOTE CHECK: pa1-07-prayer#3 is lifted text 1, “The servers are the seven Chaos.”, exactly as Part M lists it [unverified: Chao Island’s wiki prints “7”]. Check against the game’s English script before ship; if it differs, use the script’s wording (one sentence), or replace it with our own paraphrase. No other prayer line is quoted, and nothing else in the prayer is given in words. Sega rights: see the file header.

## PA1-8. Amy and the Bird

*Sonic Adventure (Sonic Team, Sega, 1998): Amy, the little bird and E-102 Gamma* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-7, from Pixel’s cabinet. · requires: PA1-7

**Cast:** Amy (Amy Rose (Sonic Adventure, Sega, 1998)), E-102 Gamma (E-102 Gamma (Sonic Adventure, Sega, 1998))

### Step 1: Meet the girl running across Station Square.

Hint: She’s heading for the fountain, with a robot behind her. · check: `talk:pa1-amy:square`

#### Scene `pa1-08-amy`

_Back in Station Square, a girl in a red dress is running across the plaza with her arms round something small._  
_Behind her a blocky red robot thumps along, beeping._  
**Amy**: Excuse me, sorry, coming through, very important, out of the way!  
_She skids round the fountain and nearly falls over your Nubbin. She stops, looks at it, and melts a little._  
**Amy** _(happy)_: Oh, you’re lovely. Hi. I’m Amy. I can’t stop.  
_In her arms is a little blue bird with a tiny pendant round its neck. It’s trembling._  
**Amy** _(angry)_: He fell out of the sky right into my arms. The robots keep chasing him, and he hasn’t done anything!  
**Pixel**: The pendant. Look at the pendant. It’s glowing green.  
**Amy**: Please. Have you got anywhere we could hide?  

**Choices**

- **The Chao Garden, behind the hotel.**
    - **Amy**: A garden? With a door? Perfect. Lead the way.
- **Let me think.**
    - **Amy**: Think fast!
    - The beeping gets closer. You think of the only place you know.

#### Done `pa1-08-amy-done`

_You run for the hotel, with Amy at your shoulder and your Nubbin bouncing along behind like a dropped ball._  

### Step 2: Hide the bird in the Chao Garden.

Hint: Set the bird down on the grass among the Chao. · check: `carry:pa1-bird:chao-garden`

#### Scene `pa1-08-hide`

_In the Chao Garden it’s quiet, with fruit hanging from the tree. A Chao is asleep in the watering can._  
**Amy**: Here? Is he going to be safe here?  
_The little bird hops off her hands onto the grass. A Chao waddles up, looks at it, and its ball turns into a question mark._  
_Then the Chao sits down next to the bird. Another sits down next to that one, and soon the bird is in the middle of a ring of them._  
**Pixel** _(soft)_: They’re hiding him. They’re hiding him with themselves.  
_Your Nubbin sits down in the ring too. The bird stops trembling._  
**Amy** _(happy)_: Oh, you darlings. You absolute darlings.  

#### Done `pa1-08-hide-done`

_Footsteps in the corridor. Heavy ones, slow, with a hum of machinery under them._  

### Step 3: Stay still while the robot looks.

Hint: Stay in the ring with the Chao. Don’t move. · check: `watch:pa1-gamma:chao-garden`

#### Scene `pa1-08-gamma`

_A tall robot steps into the doorway: red and black, one long arm ending in a blaster, and a round, patient face._  
**E-102 Gamma**: Target: small blue bird. Location: confirmed.  
**Amy** _(angry)_: Don’t you dare. Don’t you DARE.  
_The robot raises its arm and looks down at the ring of Chao. Twelve small faces look back, and twelve balls turn into exclamation marks._  
_The arm stops halfway._  
**E-102 Gamma** _(think)_: …Query.  
_Nobody answers it. The robot stands still for so long that a Chao wanders over and touches its foot._  
**E-102 Gamma**: E-102 Gamma. This unit… will report the target not found.  
_It lowers its arm and goes. At the door it stops, as if it’s about to say something more, and doesn’t._  
**Pixel** _(shock)_: Did a robot just change its mind?  

#### Done `pa1-08-gamma-done`

_Amy lets out a breath she seems to have been holding since the fountain._  
**Amy** _(think)_: Did you see its face? It didn’t want to. It really didn’t want to.  

#### Complete `pa1-08-complete`

**Amy**: I’m going to find Sonic. He’ll know what to do. He always knows, even when he’s pretending.  
_She scoops up the bird and kisses each Chao on the head in turn, which takes a while. Then she goes._  
**Pixel** _(think)_: Bad feeling. I’ve got a bad feeling. I’ve been mostly right about bad feelings this week.  

**Rewards**


Sets on completion: `{"pa1-08":true}`

**Notes:** Gamma’s weapon is a blaster arm; it is raised and lowered, never fired. Whatever pa1-gate is, the Keeper has the key, so the hiding plays the same; the gate art shows its state. Amy is taken onto the Egg Carrier offscreen between PA1-8 and PA1-11 (Tails tells you in pa1-11-board).

## PA1-9. Big and Froggy

*Sonic Adventure (Sonic Team, Sega, 1998): Big the Cat and Froggy* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-8, from Pixel’s cabinet. · requires: PA1-8

**Cast:** Big (Big the Cat (Sonic Adventure, Sega, 1998))

### Step 1: Find out who is calling for Froggy in the jungle.

Hint: Follow the river into the Mystic Ruins jungle to the plank hut. · check: `talk:pa1-big:jungle`

#### Scene `pa1-09-big`

_Deep in the Mystic Ruins jungle, beside a hut made of planks and good intentions, a very large cat sits by a river looking sad._  
**Big** _(sad)_: Froggy? Froggyyy.  
_He has a fishing rod over one shoulder and a tackle box the size of a suitcase. He is the gentlest-looking thing you have ever seen this big._  
**Big**: Oh. Hello. I’m Big. Have you seen my friend? He’s a frog. He’s green. He’s called Froggy.  
**Big** _(think)_: He went funny this morning. He swallowed a shiny green stone, and then he grew a tail. Frogs don’t have tails.  
**Pixel** _(shock)_: A green stone. Another Emerald. And a tail like… oh no. Like the water creature’s?  
**Big**: He jumped in the river. I’ve been fishing for him all day. Not with a hook. With a lure. I wouldn’t hook Froggy.  
_Your Nubbin sits down beside him. Big looks at it for a long time, then pats its head with one enormous, careful finger._  
**Big**: You can help, if you want. You have to be quiet, though.  

#### Done `pa1-09-big-done`

_Big hands you a spare rod. The lure on the end is a little rubber bug with a bell on it._  

### Step 2: Fish with Big, quietly, and wait for Froggy.

Hint: Sit on the bank and keep still. Froggy comes to whoever is still. · check: `sit:pa1-big:river`

#### Scene `pa1-09-fish`

_You sit on the bank beside Big. The river slides by, brown and green and slow._  
**Big**: Froggy likes it when you’re still. If you wiggle, he hides. If you’re still, he comes and sits on your foot.  
_Big is very good at being still, and you are less good at it. Your Nubbin is excellent._  
**Pixel** _(happy)_: This is the slowest game I have ever played. I love it. I’m going to make a cup of tea.  
_An hour passes, or the game’s idea of an hour. Dragonflies come and go._  
_The bell on your lure rings once, and then doesn’t._  

**Choices**

- **Keep waiting.**
    - You keep still, and the river keeps moving. After a while you stop noticing that you’re waiting at all.
- **Reel in and try another spot.**
    - **Big**: Nope. This is the spot. Froggy always comes back to the spot.
    - You put the rod back down. Big is right, as it turns out.

#### Done `pa1-09-fish-done`

_Something small and green climbs out of the water and sits on your Nubbin’s foot. It has a long, wavering tail, clear as water._  
**Big** _(happy)_: FROGGY!  
_Froggy jumps from your Nubbin’s foot straight back into the river. Big is still beaming._  
**Big**: He’s all right. He’s just being silly. I’ll find him. I always find him.  

#### Complete `pa1-09-complete`

**Pixel** _(think)_: A frog with a tail like the water creature’s. So the water creature’s been near here. Hasn’t it?  
**Big**: That big water fella? I saw him. He looked like he was looking for something.  
**Big** _(soft)_: Same as me. I know that look.  
_Big goes back to his rod. You leave him there, perfectly still, waiting for his friend._  

**Rewards**


Sets on completion: `{"pa1-09":true}`

**Notes:** No hook, no catch: the fishing is a sit-still beat (the check is sitting, not a fishing minigame), and nothing is hurt. Froggy never speaks. Big keeps Froggy in his hat by PA1-16.

## PA1-10. Pachacamac

*Sonic Adventure (Sonic Team, Sega, 1998): Tikal and her father, chief of the echidna clan* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-9, from Pixel’s cabinet. · requires: PA1-9

**Cast:** Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998)), Pachacamac (Pachacamac, chief of the echidna clan (Sonic Adventure, Sega, 1998))

### Step 1: Go back with the light and see who has come to the shrine.

Hint: The light finds you on the riverbank. Stand at the bottom of the shrine steps. · check: `watch:pa1-clan:altar`

#### Scene `pa1-10-council`

_The rosy light finds you on the riverbank and takes you back without asking. It seems to be in a hurry._  
_At the shrine it is evening. Torches burn on the steps, and a crowd of echidnas in feathers and beads stands below the altar._  
_At their head is a big, grizzled echidna in a heavy headdress. He talks the way a hammer talks._  
**Pachacamac** _(angry)_: Our neighbours have stone walls and bronze spears. We have prayers.  
**Pachacamac**: Seven Emeralds sit in this shrine doing nothing but glowing. With their power, no one would ever threaten this clan again.  
_The warriors behind him strike their spears on the stone. In the pools, the Chao stop playing and look up._  
_Chaos rises a little in the water, watching. Tikal stands in front of the altar, very small and very still._  
**Tikal** _(sad)_: Father. Please. The Emeralds aren’t for that. Grandmother said…  
**Pachacamac**: Your grandmother is gone, Tikal. Our enemies are not.  

#### Done `pa1-10-council-done`

_The warriors go quiet. Tikal looks round, and sees you at the bottom of the steps._  

### Step 2: Decide where to stand while Tikal pleads with her father.

Hint: Up the steps beside Tikal, or down by the pools with the Chao. · check: `choose:pa1-tikal:altar`

#### Scene `pa1-10-stand`

**Tikal**: The Emeralds are the heart of this place. The Chao live here because it’s peaceful. Take the power, and it won’t be.  
**Pachacamac**: Peace is a word for people who haven’t been attacked yet.  
**Tikal** _(soft)_: Then let us be those people for as long as we can.  
_Pachacamac’s face doesn’t change. He has already decided, and he decided a long time ago._  
**Pixel** _(sad)_: He’s not going to listen, is he? He isn’t even really hearing her.  
_Tikal is shaking. She doesn’t step back._  

**Choices**

- **Climb the steps and stand beside her.** — sets `{"pa1-stood":true}`
    - You climb the steps and stand next to her, so that she isn’t standing alone in front of all of them.
    - Pachacamac looks at you as if you were a fly, then looks away. Nothing changes at all.
    - **Tikal**: Thank you.
- **Stay down by the pools, with the Chao.** — sets `{"pa1-stood":false}`
    - You stay below with the Chao. Your Nubbin climbs into your lap, and a few Chao climb in after it.
    - From the top of the steps Tikal glances down at them, and at you, and her shoulders come down a little.

#### Done `pa1-10-stand-done`

**Pachacamac**: We march on the shrine at dawn, and take what the Emeralds can give. Tikal, you will stand aside, as a chief’s daughter should.  
_He turns and goes, and his warriors go after him, and the torches go with them. The shrine is very dark._  

#### Complete `pa1-10-complete`

**Tikal** _(sad)_: He wasn’t always like this. When I was small he carried me on his shoulders to see the Chao.  
**Tikal**: Your being here doesn’t change anything. I know that.  
**Tikal** _(soft)_: I’m still glad. Isn’t that strange?  
_Chaos sinks back into the pool, slowly. Its glow lights the water from underneath, green and troubled._  
**Pixel** _(soft)_: Keeper. I don’t want to watch the next part.  
**You**: Neither do I.  

**Rewards**


Sets on completion: `{"pa1-10":true}`

**Notes:** SECOND CHOICE: pa1-stood = true | false (pa1-10-stand). It changes nothing here, by design (“It changes nothing, and it still matters”). True plays PA1_VARIANTS pa1-18-stood in PA1-18 (Tikal’s one more line) and both flags pick the last image of PA1-18. CARE: Pachacamac is a hard, proud father, not a cartoon; the name is Sega’s and is used only as a name. The clan’s dress and the shrine are the game’s own designs; add no real Maya or Andean sacred detail.

## PA1-11. The Egg Carrier

*Sonic Adventure (Sonic Team, Sega, 1998): the Egg Carrier and its Chao Garden* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-10, from Pixel’s cabinet. · requires: PA1-10

**Cast:** Tails (Miles “Tails” Prower (Sonic Adventure, Sega, 1998)), Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998)), Dr. Eggman (Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998)), Amy (Amy Rose (Sonic Adventure, Sega, 1998))

### Step 1: Board the Egg Carrier with Sonic and Tails.

Hint: Tails’s plane will drop you on the deck. Stay close. · check: `climb:pa1-egg-carrier:deck`

#### Scene `pa1-11-board`

_Back in the present, the sky over Station Square is full of a shape: a flying fortress as big as a town, red and gold, humming._  
**Tails** _(angry)_: That’s Eggman’s ship, the Egg Carrier. One of his robots grabbed Amy and the bird off the street. We’re going in.  
**Sonic**: In, find Amy, out. Easy. You two coming? Stay close, and don’t press any red buttons.  
_Tails’s plane drops you on the deck in a roar of wind. Sonic is gone the moment his feet touch metal._  
**Pixel** _(shock)_: Okay. A flying fortress. Brilliant. I love that. I hate that. Both.  
_Klaxons, corridors, and signs that all say EGG something. Your Nubbin stays tucked inside your jacket._  

#### Done `pa1-11-board-done`

_Down a ladder, past a door marked EGG STORAGE, you hear something you don’t expect up here: Chao._  

### Step 2: Get the Egg Carrier’s Chao to the lifeboats.

Hint: The lifeboats are two decks up, on the left. Bring every Chao. · check: `carry:pa1-chao:lifeboats`

#### Scene `pa1-11-garden`

_There’s a Chao Garden inside the ship: plastic grass, a plastic tree, a pool of recycled water, and a dozen frightened Chao._  
_Eggman keeps one, it seems, for the reason he keeps everything: because he can._  
_The floor shudders. Somewhere far below, something large has been hit._  
**Pixel**: There are lifeboats. On the map. Two decks up, port side. Port is left. I looked it up.  
_You pick up two Chao. Your Nubbin, without being told, gets three more to follow it in a wobbly line._  
**Pixel**: Every one of them, Keeper. Not one stays behind in a plastic garden.  

**Choices**

- **Carry them two at a time.**
    - Two at a time, up the ladder and back down, over and over. Your arms ache, and nobody gets left.
- **Let your Nubbin lead them in a line.**
    - Your Nubbin walks to the ladder, and every Chao follows it, one after another, like ducklings. You bring up the rear.

#### Done `pa1-11-garden-done`

_The last Chao is in the last lifeboat. You pull the lever, and it drops away under a parachute with Eggman’s face on it._  
**Pixel** _(happy)_: I can’t believe the parachutes have his face on them. No, I can. I can’t. I can.  

### Step 3: Keep back by the hatch while Sonic faces Chaos.

Hint: Stay by the open hatch on the back deck. · check: `watch:pa1-chaos:egg-carrier`

#### Scene `pa1-11-chaos`

_Out on the back deck, Eggman stands at a rail with a fistful of glowing Emeralds._  
**Dr. Eggman** _(happy)_: Four, Chaos! Four Emeralds, my lovely puddle. Show them what you’ve become!  
_Chaos rises out of a tank on the deck. It’s huge now, with great clawed arms, and the glow inside it flickers from green toward red._  
_It isn’t looking at Eggman. It’s looking through the open hatch behind you, at the empty Chao Garden._  
**Pixel** _(soft)_: It’s looking for them. It doesn’t know they got out.  
_Sonic is already there, with Amy behind him holding the bird. You keep back by the hatch._  

#### Done `pa1-11-chaos-done`

_There is a long, crashing fight that you mostly see through your fingers. At the end Chaos pours away over the side, still looking back._  
**Amy** _(happy)_: Keeper! You’re here too? Sonic saved us! Well. Sort of. I saved the bird.  

#### Complete `pa1-11-complete`

_From the rail you can see the lifeboats drifting down toward the sea: a dozen little parachutes, a dozen Chao._  
_Your Nubbin waves at them with both arms until the last one is out of sight._  
**Pixel**: That’s the Chao safe. Now everybody else.  

**Rewards**


Sets on completion: `{"pa1-11":true}`

**Notes:** Chaos 4 and Chaos 6 are folded into one growth here (“Four Emeralds”). The lifeboat carry is a short escort: one trip on screen, the rest narrated in the choice. The Egg Carrier’s Chao land safely by parachute; the Grove never sees them again (they are this world’s).

## PA1-12. Gamma

*Sonic Adventure (Sonic Team, Sega, 1998): E-102 Gamma turns from Eggman* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-11, from Pixel’s cabinet. · requires: PA1-11

**Cast:** Dr. Eggman (Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998)), E-102 Gamma (E-102 Gamma (Sonic Adventure, Sega, 1998)), Amy (Amy Rose (Sonic Adventure, Sega, 1998))

### Step 1: See what happens to the robot from the garden.

Hint: He’s in the hangar near the stern of the Egg Carrier. · check: `watch:pa1-gamma:hangar`

#### Scene `pa1-12-gamma`

_In a hangar near the stern, the tall robot from the garden stands in front of Eggman, very straight._  
**Dr. Eggman** _(angry)_: Gamma! You let the bird go. You let the girl go. I built you, you ungrateful toaster!  
**E-102 Gamma**: Query. Why was the bird the target?  
**Dr. Eggman**: Because I SAID so! Report to the scrap room. You’re obsolete.  
_Eggman stamps off, and Gamma stands alone in the hangar. Then it turns, and walks the other way._  
**Amy** _(soft)_: He didn’t give me up, back in the garden. I think he’s trying to be good and doesn’t know how.  
**Pixel**: Follow him? I want to follow him.  

#### Done `pa1-12-gamma-done`

_Gamma walks to a row of robots in their charging cradles. Its brothers: the same shape, in different colours._  

### Step 2: Watch Gamma open the first of his brothers.

Hint: Stay with Amy by the cradles. · check: `watch:pa1-gamma:cradles`

#### Scene `pa1-12-birds`

_Gamma opens a panel on the first robot’s back. Inside, where an engine might be, there is a small bird in a little cage, alive._  
**E-102 Gamma**: Power source: living creature. Discovery logged.  
**E-102 Gamma** _(think)_: This unit… also contains one.  
_It opens the cage. The bird hops onto Gamma’s hand, blinks, and flies up into the rafters._  
**Amy** _(sad)_: They run on birds? All of them? Oh, that’s horrible. Oh, poor Gamma.  
_Gamma turns to you. It looks at your Nubbin for a long moment, the way it looked at the ring of Chao._  
**E-102 Gamma**: You and the small one. Leave this ship. This unit has work to do.  

**Choices**

- **Thank him.**
    - **E-102 Gamma**: Acknowledged.
    - It turns back to its brothers.
- **Ask him to come with you.**
    - **E-102 Gamma**: Negative. There are more of them. Go.
    - It says it kindly. You hadn’t known a robot could.

#### Done `pa1-12-birds-done`

_Tails comes back for you in the plane. You climb aboard with Amy, and the Egg Carrier falls away behind you into cloud._  

### Step 3: Watch the sky from the plane.

Hint: Look back toward the clouds. · check: `watch:pa1-bird:sky`

#### Scene `pa1-12-sky`

_Nobody says much on the flight back. Tails flies low over the sea, and the plane hums._  
**Amy** _(sad)_: He’ll be all right. Won’t he? He’s very big. Big things are usually all right.  
**Pixel** _(soft)_: Amy. I don’t know.  
_Your Nubbin is kneeling on the seat, looking back at the clouds, with both hands on the glass._  
_Then, out of the cloud, very small, comes one bird. Then another, and another, scattering into the blue._  
_They fly free over the water, toward the land._  

#### Done `pa1-12-sky-done`

**Amy** _(soft)_: That’s from him. I know it is.  
**Pixel** _(sad)_: I’m fine. I’m not crying. The screen’s just very bright.  

#### Complete `pa1-12-complete`

_Amy holds her own little bird up to the window, so it can see the others go._  
**Amy** _(soft)_: Thank you, Gamma.  
_Your Nubbin stays at the glass until the last bird is out of sight._  

**Rewards**


Sets on completion: `{"pa1-12":true}`

**Notes:** CARE: Gamma’s end is offscreen. The Keeper leaves the ship before Gamma frees his brothers; nothing about what happens to Gamma is said or shown. The last image is the birds flying free. Gamma never fires on screen.

## PA1-13. The Charge

*Sonic Adventure (Sonic Team, Sega, 1998): the attack on the shrine and the sealing of Chaos* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-12, from Pixel’s cabinet. · requires: PA1-12

**Cast:** Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998)), Knuckles (Knuckles the Echidna (Sonic Adventure, Sega, 1998))

### Step 1: Go back with the light to the shrine at dawn.

Hint: The light is waiting for you. Stand with Tikal on the top step. · check: `watch:pa1-shrine:dawn`

#### Scene `pa1-13-dawn`

_The rosy light comes for you, and this time it isn’t warm. It’s trembling._  
_The shrine at dawn, with mist on the pools. The Chao are still asleep in heaps on the warm steps._  
_Tikal is awake. She sits on the top step in front of the altar, the way you sit when you’ve decided something._  
**Tikal** _(sad)_: You came. You don’t have to stay for this. I wouldn’t, if I were you.  
_Chaos stands in the middle pool, tall and watchful, its glow steady and green._  
_Far off, in the trees, drums start._  
**Pixel** _(sad)_: Keeper. I could pull the plug. Gently. Say the word.  

**Choices**

- **Stay with Tikal.**
    - **You**: I’ll stay.
    - **Tikal**: Then hold your little one. Hold it close.
- **Wake the Chao on the steps.**
    - You try, but they roll over, sleepy, and settle again. The drums are getting closer.
    - **Tikal**: Let them sleep. Let them sleep as long as they can.

#### Done `pa1-13-dawn-done`

_Tikal goes down the steps and stands in front of the pools with her arms wide. The Chao wake one by one, and gather behind her._  

### Step 2: Stay in the light, and hold on to your Nubbin.

Hint: You can’t change what happened here. Hold on. · check: `wait:pa1-light:shrine`

#### Scene `pa1-13-charge`

_Pachacamac’s warriors come out of the trees in a line, and do not stop._  
**Tikal** _(shock)_: Father! Stop! Please, the Chao!  
_They do not stop. The rosy light closes round you, and the shrine goes dim and far away, the way a dream goes when you wake._  
_You hear it through the light rather than see it: the trampling, and small voices, and then a sound like the sea standing up._  
_Then firelight, orange through the gold. Then nothing, for a long while._  
_Through it all, very clearly, you hear Tikal._  
**Tikal** _(sad)_: Chaos is power... Power enriched by the heart.  
**Tikal** _(sad)_: Please. Hold it. Hold it, and I’ll stay with it. I’ll stay.  
_A great green light. Then silence._  
_Your Nubbin is pressed against your chest, perfectly still, with both hands over its eyes._  

#### Done `pa1-13-charge-done`

_When the light lets go, you are back on the floating island in the present, and it is raining, very softly._  
**Pixel** _(soft)_: I’m here. I’m just being quiet for a bit.  

#### Complete `pa1-13-complete`

_Knuckles finds you sitting by the broken altar. He doesn’t ask anything; he sits down on the other side of it._  
**Knuckles**: Bad dream?  
**You**: An old one.  
**Knuckles** _(sad)_: Yeah. This place has a lot of those.  
_After a while he gets up, comes back with a big leaf to keep the rain off your Nubbin, and sits down again._  

**Rewards**


Sets on completion: `{"pa1-13":true}`

**Learning Grove swaps**

- `pa1-13-charge#6` → The light is strong. It is strongest when the heart is kind.

**Notes:** CARE: everything in pa1-13-charge after line 2 is offscreen. The screen is the rosy light’s gold, with firelight showing orange through it, then dark, then one green flash. Sound only: footsteps, small Chao cries (not words), a deep rush of water, crackle, silence. No bodies, no blood, no attackers shown hurt. Chaos is never called evil. QUOTE CHECK: pa1-13-charge#6 is lifted text 2, “Chaos is power... Power enriched by the heart.”, exactly as Part M lists it [unverified: corrected 2026-10-14 to Chao Island’s wiki wording]. Check against the game’s English script before ship; if it differs, use the script’s one-sentence wording or a paraphrase of our own. Sega rights: see the file header. The sealing line after it (#7) is our own.

## PA1-14. The Ruins

*Sonic Adventure (Sonic Team, Sega, 1998): the Lost World temple and Tikal’s warning* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-13, from Pixel’s cabinet. · requires: PA1-13

**Cast:** Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998)), Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998))

### Step 1: Look at the murals in the old temple.

Hint: The temple is in the jungle below the Mystic Ruins. Walk along the painted wall. · check: `inspect:pa1-murals:temple`

#### Scene `pa1-14-murals`

_In the jungle below the Mystic Ruins stands an old stepped temple, its stones the same as Tikal’s shrine. Older now, by thousands of years._  
_Inside, the walls are covered in murals, carved and painted, faded but still clear._  
_A pool with small round shapes in it, and a girl with braids. A tall shape made of water stands over them._  
_Further along: a line of warriors. Then fire, painted in a red that has gone brown with age._  
_Then a great green stone with the water-shape inside it, and the girl curled up beside it like someone asleep._  
**Pixel** _(sad)_: That’s her. That’s Tikal. They painted it all. Somebody stayed behind and painted it.  
_Your Nubbin puts its hand flat on a painted Chao, very gently, the way you’d touch something sleeping._  

**Choices**

- **Touch the painted girl.**
    - The stone is cool. Under your hand, for a moment, it feels a little warmer.
- **Look for writing.**
    - There are marks under each panel in a script you can’t read. Pixel tries to zoom in and gets a lot of moss.
    - **Pixel**: Sorry. Moss. Very high-resolution moss.

#### Done `pa1-14-murals-done`

_Footsteps behind you. Sonic comes in out of the rain, shaking himself like a dog._  
**Sonic**: Hey. Following me again? Or am I following you? It’s getting hard to tell.  

### Step 2: Listen to what the light has to say.

Hint: Stand with Sonic in front of the murals. · check: `watch:pa1-tikal:temple`

#### Scene `pa1-14-tikal`

_The rosy light drifts out from behind a pillar and hangs in front of the murals._  
_Then, for a moment, it isn’t a light. It’s a girl with braids, made of soft pink glow, standing in the temple._  
**Sonic** _(shock)_: Whoa. Uh. Hi?  
**Tikal** _(soft)_: You’ve been fighting Chaos. I’ve watched you.  
**Tikal**: It isn’t angry at you. It never really was. It’s carrying something too heavy, and it doesn’t know how to put it down.  
**Tikal**: When the ones it loved were hurt, it took all that grief and turned it into the only thing it knew. Power. A flood.  
**Tikal** _(sad)_: The man who calls himself Eggman is feeding it the Emeralds. Each one makes the grief bigger. Not the creature. The grief.  
**Sonic**: So how do I stop it?  
**Tikal**: I don’t know that you can stop it. I couldn’t. I could only hold it.  
**Tikal** _(think)_: Maybe someone could help it put it down.  
_She looks at you as she says it, and at your Nubbin. Then she is only a light again, and then not even that._  

#### Done `pa1-14-tikal-done`

**Sonic**: Well. That was new.  
**Sonic** _(think)_: Grief, huh. Can’t outrun that one.  
_He goes anyway, very fast, out into the rain._  

#### Complete `pa1-14-complete`

**Pixel**: Keeper. I’ve got something to say, and it’s probably nothing.  
**Pixel** _(think)_: Back home. The old story, about the fierce one who loved them too hard.  
**Pixel** _(soft)_: It’s probably nothing. It just feels like the same shape.  
_Your Nubbin looks up at the painted water-shape for a long time before it will come away._  

**Rewards**


Sets on completion: `{"pa1-14":true}`

**Notes:** The murals show only Sonic Adventure’s own story, in the game’s own art style; no real Maya glyphs or iconography (the script under the panels is invented and unreadable). Pixel’s nod to Cinder works whether or not cinder is set: by chapter 5 the valley knows the tale of the Four. Chaos is grief, said plainly here.

## PA1-15. Perfect Chaos

*Sonic Adventure (Sonic Team, Sega, 1998): Perfect Chaos floods Station Square* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-14, from Pixel’s cabinet. · requires: PA1-14

**Cast:** Dr. Eggman (Dr. Eggman, Dr. Ivo Robotnik (Sonic Adventure, Sega, 1998))

### Step 1: Get high when the water comes.

Hint: Head for the fire escape on the side of the bank. · check: `watch:pa1-flood:station-square`

#### Scene `pa1-15-flood`

_By morning the last Emeralds are gone from Eggman’s ship. You find out where when the sky over Station Square turns dark green._  
_Out of the bay rises Chaos, and it keeps rising: a great serpent of clear water with a green-white glow, taller than the hotel._  
_Eggman’s new ship roars in toward it, all guns and confidence. Chaos lifts one coil and swats it out of the sky like a fly._  
**Dr. Eggman** _(shock)_: That… was not in the plan!  
_Then the water comes. Not a wave, but a rising: a whole sea standing up and walking into the city._  
**Pixel** _(shock)_: Get up high. Keeper, get up high, now. Find a roof.  
_The streets are full of people running, some of them carrying Chao. Some of the Chao are carrying each other._  

#### Done `pa1-15-flood-done`

_Water pours down the station steps like a waterfall going the wrong way._  

### Step 2: Carry Chao and people up to the rooftops.

Hint: Up the bank’s fire escape and back down. Pixel will count the floors. · check: `carry:pa1-chao:rooftops`

#### Scene `pa1-15-roofs`

_There’s a fire escape on the side of the bank. At the bottom of it, the water is already over your knees._  
_A man with a pushchair, and a boy holding two Chao he found in a fountain. An old woman who won’t leave without her cat._  
**Pixel**: Pushchair first. Then the boy. I’ll count the floors for you; I can see the whole street from here.  
_Up and down the iron stairs, over and over. Your Nubbin swims as it has never swum before, strong and steady, with a Chao on its back._  
_From here you can’t see the hotel, or the garden behind it._  
**Pixel**: Two more down there. Go on. I’ve got the count.  

**Choices**

- **Go back for the old woman’s cat.**
    - The cat is on top of a postbox, furious and dry. It lets you carry it the way a queen lets you carry her luggage.
- **Go back for the Chao on a floating bin lid.**
    - The Chao is riding the bin lid like a raft, quite calm. It holds out its arms to your Nubbin as if it ordered a lift.

#### Done `pa1-15-roofs-done`

_The roof of the bank is crowded and wet, and nobody is missing. The old woman’s cat sits on the air vent, judging everyone._  
**Pixel** _(soft)_: Everyone’s up. Everyone I can see is up. Good. Good.  

#### Complete `pa1-15-complete`

_From the rooftop, the city is a lake. Chaos coils through it, huge and slow, roaring like the sea._  
_It doesn’t seem to see the people on the roofs at all. It’s looking for something under the water, and not finding it._  
**Pixel** _(sad)_: It’s still looking for them. After all this time. It’s still looking for its Chao.  

**Rewards**


Sets on completion: `{"pa1-15":true}`

**Notes:** CARE: the flood is spectacle. Nobody is shown in danger in the water; every carry ends on a roof, and “nobody is missing” is said outright. Eggman’s ship is swatted away and he is fine (he is heard complaining, offscreen, in PA1-16’s art if wanted). pa1-15-roofs#4 says nothing of the garden on purpose: the gate choice is paid in PA1-17. SIM: the Nubbin swims here whatever its Swim stat (cartridge world).

## PA1-16. Positive Energy

*Sonic Adventure (Sonic Team, Sega, 1998): the drained Emeralds and Super Sonic* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-15, from Pixel’s cabinet. · requires: PA1-15

**Cast:** Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998)), Knuckles (Knuckles the Echidna (Sonic Adventure, Sega, 1998)), Tails (Miles “Tails” Prower (Sonic Adventure, Sega, 1998)), Amy (Amy Rose (Sonic Adventure, Sega, 1998)), Big (Big the Cat (Sonic Adventure, Sega, 1998))

### Step 1: Watch Sonic’s friends bring him the Emeralds.

Hint: Stay on the bank roof. They are coming to you. · check: `watch:pa1-emeralds:rooftop`

#### Scene `pa1-16-friends`

_Sonic lands on your roof, soaked and, for once, out of breath. He stares at the thing in the water._  
**Sonic** _(shock)_: Okay. That’s big. That’s really, really big.  
_One by one they come: Tails in his plane, Knuckles up the drainpipe, Amy with the blue bird. Big, with Froggy back in his hat._  
_Each of them is holding an Emerald. All seven, dull now and grey-green, with the light drained out of them._  
**Knuckles** _(angry)_: Chaos used them up. They’re empty.  
**Tails** _(think)_: Not empty. Not all the way.  
**Tails**: Chaos took the bad side of them, the anger, all that grief. But there’s still something left in them. The good.  
**Tails**: Use what’s left, Sonic. Use the good.  

#### Done `pa1-16-friends-done`

_Sonic looks round at all of them, and then, for some reason, at you and your Nubbin._  
**Sonic**: The good, huh. Okay. Let’s see what we’ve got.  

### Step 2: Hold the Chao close and watch.

Hint: Stay on the roof with the Chao in your arms. · check: `watch:pa1-super:sky`

#### Scene `pa1-16-super`

_The Emeralds rise out of everybody’s hands and circle Sonic, slowly at first, then faster._  
_They don’t blaze. They glow, soft and warm and gold, like seven lamps being lit in a dark house._  
_A Chao from the fire escape climbs into your arms, then another. You hold them both, and your Nubbin holds on to your sleeve._  
_Sonic goes gold all over, bright as a summer morning. Then he’s gone, up into the sky, flying._  
**Pixel** _(happy)_: He’s flying. He can fly now. Oh, I wish you could see your own face.  
_Out over the flooded city, a gold spark circles a great coil of water, round and round, like a bee round a bear._  

**Choices**

- **Hold the Chao and watch.**
    - You hold them and watch. One of them falls asleep, which seems like the bravest thing anyone has done all day.
- **Cheer.**
    - You cheer, and Amy cheers louder. Big cheers so loud that Froggy hides in his hat.

#### Done `pa1-16-super-done`

_The gold spark strikes, and strikes again. Chaos roars and shrinks, and roars and shrinks._  
_Then the water goes down all at once, the way a bath drains when someone pulls the plug._  

#### Complete `pa1-16-complete`

_The sea pulls back out of the streets. Cars, benches and lamp posts come up out of it, dripping and surprised._  
_In the middle of the square, in a puddle no bigger than a pond, something small is left._  
**Pixel** _(think)_: Is that…?  

**Rewards**


Sets on completion: `{"pa1-16":true}`

**Notes:** The Keeper holds the Chao and watches; Sonic’s fight is seen as a gold spark round the coil, never close up. Tails says the outline’s idea (use what’s left in them, the good) in our own words; no game line is used.

## PA1-17. The Chao

*Sonic Adventure (Sonic Team, Sega, 1998): Chaos sees the Chao at peace* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-16, from Pixel’s cabinet. · requires: PA1-16

**Cast:** Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998)), Amy (Amy Rose (Sonic Adventure, Sega, 1998)), Knuckles (Knuckles the Echidna (Sonic Adventure, Sega, 1998))

### Step 1: Wade out to the small shape in the puddle.

Hint: Down the fire escape and across the square to the fountain. · check: `walk:pa1-square:puddle`

#### Scene `pa1-17-small`

_You climb down the fire escape into ankle-deep water and wade across the square._  
_In the puddle by the fountain is Chaos, the way you first saw it. Small now, person-sized, clear and quiet._  
_The glow in its chest is faint and green. It isn’t trying to rise; it’s only looking around._  
**Sonic**: Easy. Easy, everybody. I don’t think it wants to fight anymore.  
_Your Nubbin goes and sits at the edge of the puddle. Chaos looks down at it._  
**Pixel** _(sad)_: It thinks they’re gone, doesn’t it? It thinks it’s all happened again.  

**Choices**

- **Sit down at the edge of the puddle, beside your Nubbin.**
    - You sit in the wet. Chaos looks at you, then back at your Nubbin, and doesn’t move away.
- **Keep back and let it look.**
    - You stay where you are. Everyone in the square seems to have decided the same thing at once.

#### Done `pa1-17-small-done`

_Chaos looks round the empty square: at the dripping buildings, at all the people, and at none of the small ones._  

### Step 2: Let Chaos see the garden Chao.

Hint: Look up at the hotel roof. (If you locked the gate, wade back to the garden and open it.) · check: `watch:pa1-chao:puddle`

#### Scene `pa1-17-chao`

_Then a sound comes from above: small, cheerful, unmistakable._  
_Along the edge of the hotel roof, a whole row of Chao is sitting with their legs dangling over the gutter. The garden Chao._  
_They went out through the open gate when the water came. They went where everyone went: up._  
_Now, one by one, they come down: by the drainpipe, by the fire escape, by sliding down awnings with their arms out._  
_They walk right up to the edge of the puddle. They aren’t afraid of it at all._  
_Chaos looks at them. The glow in its chest goes still, and soft, and warm._  
**Pixel** _(soft)_: They’re all right. Oh, they’re all right. And it can see.  
_A Chao reaches up and touches the water. Chaos bends, slowly, and lets it._  

#### Done `pa1-17-chao-done`

_Chaos sinks down, smaller and smaller, until it is only a little taller than the Chao themselves._  
_It sits down in the puddle among them. For the first time since you’ve known it, it looks as if it’s resting._  

#### Complete `pa1-17-complete`

**Sonic** _(soft)_: Huh. So that’s all it wanted.  
**Amy**: Of course that’s all it wanted. That’s all anybody wants.  
_Knuckles doesn’t say anything. He wipes his eyes with the back of his glove and says it’s the rain._  

**Rewards**


Sets on completion: `{"pa1-17":true}`

**Notes:** PAYOFF of pa1-gate (PA1-2, fifteen quests back). open (or unset): play pa1-17-chao as written, check watch:pa1-chao:puddle. locked: play PA1_VARIANTS pa1-17-chao-locked in place of pa1-17-chao. SIM: with locked, step pa1-17-s2 uses the check escort:pa1-chao:puddle instead (wade back through the hotel lobby, unlock the gate, lead the Chao out to the puddle); the journal hint’s bracketed half shows only then. pa1-17-chao-done and the complete scene are shared. Pixel’s line “Safe isn’t the same as well, is it.” is in the locked variant only, said very quietly (lower speaker volume, no music under it).

## PA1-18. Tikal and Chaos

*Sonic Adventure (Sonic Team, Sega, 1998): Tikal and Chaos go together, at peace* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Chao Altar (Pixel’s Arcade) · when: Any time after PA1-17, from Pixel’s cabinet. · requires: PA1-17

**Cast:** Tikal (Tikal the echidna (Sonic Adventure, Sega, 1998)), Sonic (Sonic the Hedgehog (Sonic Adventure, Sega, 1998))

### Step 1: Watch the light come down to Chaos.

Hint: Stay by the puddle, with the Chao. · check: `watch:pa1-tikal:square`

#### Scene `pa1-18-return`

_The rosy light comes down out of the clouds, slow as a falling petal, and stops above the puddle._  
_It opens, and it is Tikal, standing barefoot in the water with the Chao round her ankles._  
**Tikal** _(soft)_: There you are. I’ve been looking for you for such a long time.  
_Chaos looks up at her. It doesn’t rise; it only looks, the way your Nubbin looks at you when you come home late._  
**Tikal**: It’s all right now. They’re all right. Look at them. It’s over.  
**Tikal**: You don’t have to hold it anymore. We can put it down together.  
_She holds out her hand. Chaos lifts one watery hand and puts it in hers._  
**Sonic**: So… you two are going?  
**Tikal** _(happy)_: We’ve waited a long while to go. Thank you, Sonic. Thank you, all of you.  

**Choices**

- **Bow to Chaos, as you did at the shrine.**
    - You bow. This time Chaos bows back, all the way, the way you would to an old friend.
- **Lift your Nubbin up so Chaos can see it.**
    - Chaos looks at your Nubbin for a long moment. Then it touches its head, very lightly, where the curl is.

#### Done `pa1-18-return-done`

_Tikal turns to you last. The Chao round her feet turn too, as if they know whose turn it is._  

### Step 2: Answer Tikal’s question.

Hint: Talk to Tikal before she goes. · check: `talk:pa1-tikal:square`

#### Scene `pa1-18-farewell`

**Tikal** _(think)_: Before we go, I want to ask you something. Where you come from, do you have one like Chaos?  
**Tikal**: Someone who loved the little ones too much, and didn’t know what to do with it?  
_Your Nubbin is sitting in the water by Chaos, holding one of its fingers._  
**Pixel** _(soft)_: Keeper. She means…  
**You**: We had one. A long time ago.  
**Tikal**: What happened to her?  

#### Done `pa1-18-rhyme`

_You open your mouth, and find you don’t know how the story ends. Nobody back home does yet._  
_Pixel hums something under her breath: four lines, the skipping tune from the lane. She stops before the last one._  
_She doesn’t hum the rest, as if she’s just remembered what the last line says._  
**Tikal** _(soft)_: That sounds like an old one. The old ones are always a little sad.  
**Tikal**: I hope somebody finds her. I hope she gets to put it down.  

#### Complete `pa1-18-complete`

**Tikal** _(happy)_: Here. For you. I made it a long while ago, and it kept.  
_She lifts a crown of small pink and white flowers from her own hair and sets it on yours. It weighs nothing, and smells of warm stone._  
_Then she takes Chaos’s hand again. The two of them turn to light together, pink and green, and rise, and the Chao wave until they’re gone._  
_The world folds up gently round you, like a letter, and you are standing in the lantern shed with your Nubbin under your arm._  
**Pixel** _(shock)_: You’re back! You’ve got flowers in your hair. They came out with you. How did they come out with you?  
_On the side of the cabinet, where the dent was, a small brass plate has appeared, blank, waiting for a name._  
**Pixel** _(happy)_: A high-score plate. For High Score Night. When we’ve done another cartridge, we’ll do it properly.  

**Rewards**

- Tikal’s flower crown (cosmetic): A crown of small pink and white flowers that came out of the cartridge with you. It smells faintly of warm stone.
- Little shrine pool (decor): A small stone pool for the Grove with seven coloured pebbles set round its rim. Nubbins like to sit in it.
- The cabinet’s high-score plate (feature): A brass plate on Pixel’s cabinet with your name on it, ready for High Score Night.

Sets on completion: `{"pa1-18":true,"pa1-done":true}`

**Notes:** STOOD (pa1-stood true): play PA1_VARIANTS pa1-18-stood straight after pa1-18-return-done (Tikal’s one more line). CINDER (Grove, read-only): the step 2 done scene is pa1-18-rhyme when cinder is unset; with cinder = forgiven play pa1-18-cinder-forgiven in its place, with remembered play pa1-18-cinder-remembered. Pixel hums the tune of the Story Bible’s skipping rhyme without any of its words (a short, flat four-line hum on the speaker channel, cut off before the fourth line). LAST IMAGE: straight after pa1-18-complete play exactly one of pa1-18-last-open-stood, pa1-18-last-open, pa1-18-last-locked-stood, pa1-18-last-locked (pa1-gate unset counts as open; pa1-stood unset counts as false). REWARDS are one-time. The crown is a Grove hat cosmetic; the pool is Grove decor (art suggestion: a round stone basin, pebbles red, blue, yellow, green, purple, cyan and white). The plate is the frame’s: it carries your name once High Score Night unlocks (any two of PA1–PA5 done). None of these is a Grove flag; the cartridge writes pa1-done in its own save only.

## Variant scenes

#### Variant `pa1-01-clank`

_Clank is sitting on top of the cabinet with his legs dangling over the edge of the screen._  
**Clank** _(happy)_: Announcement: I am the lookout. Pixel said lookouts sit on top. I am on top.  
**Pixel**: I said lookouts sit still.  
**Clank**: I am sitting very still. Look how still. This is the stillest I have ever been.  
_His legs go on swinging. Every few seconds one heel bonks the screen._  

#### Variant `pa1-17-chao-locked`

_Chaos looks round for them, and there are none. Not on the roofs, not in the streets._  
_Your stomach drops. The garden, the gate, the little key you turned._  
**You**: They’re still in there.  
_You wade back across the square and through the hotel lobby, where the water is up to your waist and full of floating menus._  
_The garden gate is still locked. Behind it, on top of the palm tree and the fruit tree and each other, the Chao are huddled, wet and very quiet._  
_They’re all alive. Not one of them is moving._  
**Pixel** _(soft)_: Safe isn’t the same as well, is it.  
_You turn the key. Your Nubbin goes in first, and one by one they come down out of the trees and follow it._  
_You lead them out through the lobby, across the square, to the edge of the puddle._  
_Chaos looks at them. The glow in its chest goes still, and soft, and warm._  

#### Variant `pa1-18-stood`

**Tikal** _(soft)_: You stood beside me, on the steps. In front of all of them.  
**Tikal**: It didn’t change anything. I’ve had a very long time to think about that, and it still mattered.  
_She squeezes your hand once. Her hand is warm, though it’s made of light._  

#### Variant `pa1-18-cinder-forgiven`

**You**: She was called Cinder. She loved them fiercely, and she held on too tight, and they went still.  
**You**: At the end, somebody went up the mountain and found her. And she was forgiven.  
_Tikal smiles, slowly, the way the sun comes out after rain._  
**Tikal** _(happy)_: Forgiven. Oh, I’m glad. I’m so glad.  
**Tikal** _(soft)_: Then she can rest. That’s all the fierce ones want, in the end, even if they don’t know it.  

#### Variant `pa1-18-cinder-remembered`

**You**: She was called Cinder. She held on too tight, and the ones she loved went still.  
**You**: We don’t forgive all of it. But we remember ours.  
**Tikal** _(soft)_: Remember. Yes. That’s a kind of keeping too.  
_Your Nubbin feels about in its fur and brings out a red petal from the hill at home, a bit crumpled. It gives it to the nearest Chao._  
_The Chao holds the petal up to the light, and its ball turns into a heart._  

#### Variant `pa1-18-last-open-stood`

_The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling._  
_Up in one corner, very small, are two lights, pink and green, and a little square figure beside them who looks a lot like you._  
**Pixel** _(happy)_: That’s you. It put you in the ending. You’re in the ending!  

#### Variant `pa1-18-last-open`

_The screen holds one last picture before it goes dark: the hotel roof at sunset, a row of Chao along the gutter with their legs dangling._  
_Up in one corner, very small, two lights, pink and green, drift over the city and away, side by side._  
**Pixel** _(soft)_: Every one of them out, and up. Good.  

#### Variant `pa1-18-last-locked-stood`

_The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open._  
_A Chao is swinging on the gate. Above the palm tree hang two lights, pink and green, with a little square figure beside them who looks a lot like you._  
**Pixel** _(soft)_: Open. They’ve drawn it open. And you’re in it, look.  

#### Variant `pa1-18-last-locked`

_The screen holds one last picture before it goes dark: the garden behind the hotel, its little gate standing wide open._  
_A Chao is swinging on the gate, back and forth. Above the palm tree, two lights, pink and green, drift up through the glass roof and away._  
**Pixel** _(soft)_: Open. Next time, we leave it open from the start. Deal?  
