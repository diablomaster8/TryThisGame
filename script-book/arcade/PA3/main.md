# Pixel's Arcade, cartridge PA3: The Hollow Kingdom

## PA3-1. The Cabinet

*Hollow Knight (Team Cherry, 2017): the opening, Dirtmouth and the well* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: After chapter 5, once the cabinet runs in the lantern shed. Any time after that.

**Cast:** Elderbug (Elderbug, the last townsfolk of Dirtmouth (Hollow Knight (Team Cherry, 2017))), Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own Clank from S21)

### Step 1: See what Pixel found in the bottom of the cartridge box.

Hint: Pixel is at the cabinet in the lantern shed. The box is on the floor by her boots. · check: `inspect:pa3-cartridge:lantern-shed`

#### <a id="pa3-01-cabinet"></a>Scene `pa3-01-cabinet`

_The lantern shed smells of sawdust and warm dust. The cabinet hums like a fridge that’s thinking._  
**Pixel**: Found another box of cartridges in the cabinet’s belly. Under the mouse nest. The mice have moved out. Mostly.  
**Pixel**: This one was on its own, in a box inside the box. Someone wrote on the lid.  
_She holds it up. In pencil, in a hand neither of you knows: “too sad, keep”._  
**Pixel** _(think)_: Not “too sad, bin”. Not “too sad, sell”. Keep.  
_The label shows a pale mask with two horns, on a lot of black._  
**Pixel**: No title. Just the mask. Ruling: that’s either very good or very sad.  
**Pixel** _(soft)_: Probably both. The best ones are usually both.  
**Pixel**: You go in. I’ll be player two. I’ve got the map, the speaker and a biscuit.  

**Choices**

- **Put it in.**
    - **Pixel**: Putting it in. Blowing on it first. That’s not superstition, it’s maintenance.
- **How sad is “too sad”?**
    - **Pixel**: Don’t know. Somebody thought it was worth keeping anyway. That’s a review, in a way.
    - **Pixel**: If it’s too much, you come out. The door’s always open from my side.

#### <a id="pa3-01-cabinet-clank"></a>Variant `pa3-01-cabinet-clank`

_Variant of `pa3-01-cabinet`._

_The lantern shed smells of sawdust and warm dust. The cabinet hums like a fridge that’s thinking._  
_On top of the cabinet, Clank swivels his eye down at the cartridge._  
**Clank** _(happy)_: Announcement: a NEW GAME! Announcement: it has a MASK on it! Is it a party? Is it a SAD party?  
**Pixel**: It’s a sad party, Clank. Sit still. You can watch, but you can’t press anything.  
**Clank**: I will watch SO hard.  
**Pixel**: Found another box of cartridges in the cabinet’s belly. Under the mouse nest. The mice have moved out. Mostly.  
**Pixel**: This one was on its own, in a box inside the box. Someone wrote on the lid.  
_She holds it up. In pencil, in a hand neither of you knows: “too sad, keep”._  
**Pixel** _(think)_: Not “too sad, bin”. Not “too sad, sell”. Keep.  
_The label shows a pale mask with two horns, on a lot of black._  
**Pixel**: No title. Just the mask. Ruling: that’s either very good or very sad.  
**Pixel** _(soft)_: Probably both. The best ones are usually both.  
**Pixel**: You go in. I’ll be player two. I’ve got the map, the speaker and a biscuit.  

**Choices**

- **Put it in.**
    - **Pixel**: Putting it in. Blowing on it first. That’s not superstition, it’s maintenance.
- **How sad is “too sad”?**
    - **Pixel**: Don’t know. Somebody thought it was worth keeping anyway. That’s a review, in a way.
    - **Pixel**: If it’s too much, you come out. The door’s always open from my side.

#### <a id="pa3-01-cabinet-done"></a>Done `pa3-01-cabinet-done`

_The screen goes black, then grey, then it’s raining on you._  
**Pixel**: Can you hear me? You’re very small. That’s the screen. You’re normal-sized. Probably.  

### Step 2: Look round Dirtmouth, and follow the small horned traveller.

Hint: Elderbug is on the bench by the lamp. The traveller is heading for the well in the middle of town. · check: `climb:pa3-well:dirtmouth`

#### <a id="pa3-01-dirtmouth"></a>Scene `pa3-01-dirtmouth`

_A cold road at dusk. Rain on dark roofs, most of them empty, and a lamp that’s doing its best._  
_On a bench under the lamp sits an old bug, round as a teapot, who lights up at the sight of you._  
**Elderbug** _(happy)_: Oh! A traveller! And a little one with you. Come in out of the road. Well, there’s no in. Come under the lamp.  
**Elderbug**: Everyone’s gone down the well, you see. The town’s just me now. Me and the bench.  
**Elderbug** _(sad)_: They hear there’s a kingdom down there, and something calling. Down they go. Up nobody comes.  
_Past the lamp walks someone very small: a pale horned mask, a dark cloak, a nail at its side._  
_It doesn’t look at Elderbug, or at you. It’s walking the way water runs downhill._  
_Then your Nubbin waddles out into the rain in front of it, and looks up._  
_The small traveller stops. Slowly, it tilts its head._  
**Elderbug** _(shock)_: Well. I’ve never seen it do that.  
_It tilts its head back the other way. Then it walks on to the well and drops in without a sound._  
**Pixel**: That’s the Knight. Don’t ask me how I know. It’s on the box. It’s also the only one moving with purpose.  

**Choices**

- **Sit with Elderbug a moment first.**
    - You sit on the cold bench. Elderbug talks about the weather, which is rain, and has been for years.
    - **Elderbug**: Thank you. You go on down now. Come back up and tell me what you saw.
- **Follow the Knight before you lose it.**
    - **Elderbug**: Mind the drop! And come back up, if you can. Hardly anybody does. I’d like one who does.

#### <a id="pa3-01-dirtmouth-done"></a>Done `pa3-01-dirtmouth-done`

_There’s a rope down the side of the well. You climb; your Nubbin rides on your shoulder and holds the lantern._  
**Pixel**: Climbing. Rope’s good. I mean, it’s pixels. But they’re good pixels.  

### Complete

#### <a id="pa3-01-complete"></a>Complete `pa3-01-complete`

_At the bottom of the well, a cave the colour of old blue ink, and the Knight, waiting._  
_It isn’t waiting for you; it’s waiting for its eyes to get used to the dark. Then it walks on._  
_Your Nubbin goes after it, then looks back, to make sure you’re coming._  
**Pixel**: Ruling: we’re a party now. Nobody asked the Knight. That’s how parties work.  

**Rewards**


Sets on completion: `{"pa3-01":true}`

**Notes:** CLANK: if s21Done, play PA3_VARIANTS pa3-01-cabinet-clank instead of pa3-01-cabinet (same choices). The cartridge has its own save in the Arcade save; it never writes a Grove flag. The Knight never speaks and has no portrait in the dialogue box. The head-tilt is the Knight’s first animation that isn’t walking: give it two frames each way. Pixel is heard through the speaker only (her portrait shows in a small cabinet-bezel frame).

## PA3-2. The Crossroads

*Hollow Knight (Team Cherry, 2017): the Forgotten Crossroads, the husks and the first grub* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-1, from Pixel’s cabinet in the lantern shed. · requires: PA3-1

### Step 1: Get through the Forgotten Crossroads behind the Knight.

Hint: Keep your lantern up and stay a few steps back. The Knight clears the way; you don’t fight. · check: `walk:pa3-crossroads:behind-knight`

#### <a id="pa3-02-crossroads"></a>Scene `pa3-02-crossroads`

_Old roads, carved through stone, with signposts nobody has read in a long time._  
_Bugs walk them. They walk the way people walk to work when they’ve forgotten what work is._  
_Their eyes glow orange, the colour of a sunset seen through a sick window._  
**Pixel** _(sad)_: Those are husks. They used to be the townsfolk, before the plague got into them.  
**Pixel**: The light talks to them. In their sleep. Then they stop waking up properly.  
_One turns towards you. The Knight is between you before you see it move._  
_A swing of the nail, quick and clean. The husk sits down, then lies down, and the orange goes out of its eyes._  
_It looks, now, like a bug asleep on a road. Which is all it ever wanted._  
**Pixel**: The Knight does the fighting. You hold the lantern. That’s the deal. I didn’t write it, but I’d sign it.  

**Choices**

- **Stay back. Lantern up.**
    - You stay three steps back and keep the light steady. The Knight doesn’t look round, but it doesn’t go faster either.
- **Put your cloak over the husk that fell.**
    - You lay a corner of your cloak over its face. The Knight watches you do it, head on one side.
    - **Pixel**: …Yeah. Good. Do that.

#### <a id="pa3-02-crossroads-done"></a>Done `pa3-02-crossroads-done`

_A crossroads with a fountain gone dry. The Knight stops, and so do you._  
_Your Nubbin’s ears go up. Somewhere close, something small is crying._  

### Step 2: Find what’s crying, and let it out.

Hint: Follow your Nubbin. It can hear the crying better than you can. · check: `collect:pa3-grub:01`

#### <a id="pa3-02-grub"></a>Scene `pa3-02-grub`

_Your Nubbin trots off down a side tunnel, stopping every few steps to listen._  
_In a niche in the wall: a glass jar, corked. Inside, a fat pale grub, crying its heart out._  
**Pixel** _(shock)_: Oh no. Oh, that’s a grub. In a jar. Who puts a grub in a jar?  
**Pixel** _(angry)_: Somebody who collects them, I suppose. There’s always somebody.  
**Pixel**: …Byte keeps his screws in jars. I’m going to have words with him at tea.  
_The Knight comes up behind you and looks at the jar for a long moment._  
_Your Nubbin puts both hands flat on the glass. The grub stops crying, just for a second, to look._  

**Choices**

- **Ease the cork out.**
    - It comes out with a soft pop. The grub wriggles over the rim like toothpaste with ambitions.
- **Let your Nubbin do it.**
    - Your Nubbin hugs the jar, leans back, and pulls. The cork and the Nubbin both come out of it suddenly.

#### <a id="pa3-02-grub-done"></a>Done `pa3-02-grub-done`

_The grub flops out, goes straight to the Knight and hugs its leg as hard as a grub can hug._  
_The Knight stands very still, the way you do when a cat sits on you. Then the grub burrows into the floor and is gone._  
**Pixel**: It went home. Grubs know the way home. They just can’t get out of jars.  

### Complete

#### <a id="pa3-02-complete"></a>Complete `pa3-02-complete`

_The tunnel is quiet. Then, a long way off, more crying, and more than one voice._  
**Pixel**: There’s more. I can hear them through the speaker. Lots more.  
_Your Nubbin is already walking towards it. The Knight, after a moment, follows your Nubbin._  

**Rewards**


Sets on completion: `{"pa3-02":true}`

**Notes:** GRUB 1 of 12. Each grub jar is a set place, found once, never again. A husk that falls lies still with its eyes dark; leave it there, curled like a sleeper. No hit flashes on screen bigger than a white blink, no splats.

## PA3-3. The Grubfather

*Hollow Knight (Team Cherry, 2017): the Grubfather and his forty-six grubs* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-2, from Pixel’s cabinet in the lantern shed. · requires: PA3-2

### Step 1: Follow the crying to wherever it’s coming from.

Hint: Your Nubbin knows the way. Go where its ears point. · check: `find:pa3-grubfather:grub-cavern`

#### <a id="pa3-03-cavern"></a>Scene `pa3-03-cavern`

_The tunnel opens into a cavern full of little houses, round and pale, like eggs set into the walls._  
_Every one is empty. Every one has a tiny doorway, and nobody in it._  
_In the middle, filling the floor, lies a grub the size of a haystack, and he is sobbing._  
**Pixel** _(sad)_: Oh. That’s… that’s their dad. That’s the Grubfather.  
_He sobs in great slow heaves, like a bellows. The houses shake a little each time._  
_Then the grub you freed pops up out of the floor, beside him, and he stops mid-sob._  
_He looks at it, then at you. He makes a sound like a kettle that’s been told good news._  
_Then he starts sobbing again, but differently. Hopefully._  

#### <a id="pa3-03-cavern-done"></a>Done `pa3-03-cavern-done`

_Your Nubbin climbs up onto his side and pats him. He is so soft that it sinks in up to its elbows._  
**Pixel**: Count the houses. I’ll count from up here. I’ve got a pencil.  

### Step 2: Make the Grubfather a promise you can keep.

Hint: Pixel has counted. Listen to her number before you promise. · check: `choose:pa3-promise:grub-cavern`

#### <a id="pa3-03-promise"></a>Scene `pa3-03-promise`

**Pixel**: Forty-six houses. Forty-six grubs. One’s back. Forty-five out there, in jars.  
**Pixel** _(think)_: I’ve checked the map. Eleven more are on our road. Twelve, counting the one you freed. I’m counting it. It hugged a leg.  
**Pixel**: Ruling: we don’t promise forty-five. We promise twelve. Twelve is a number you can carry.  
_The Grubfather looks at you with eyes like two wet buttons._  
_The Knight stands at the cavern mouth with its back to you all. It doesn’t leave, though._  
**Pixel** _(soft)_: And somebody else gets the other thirty-four. Somebody always comes. We came.  

**Choices**

- **“Twelve. I promise you twelve.”**
    - He heaves a sigh so large your hair moves. Then he rolls over a little, to make room for twelve.
- **“Every one I can find.”**
    - **Pixel**: That’s twelve. I’ve looked. But it’s a nicer way to say it.
    - He seems to like it. He rolls over a little, to make room.

### Complete

#### <a id="pa3-03-complete"></a>Complete `pa3-03-complete`

_You leave the cavern with a promise and a count. Pixel writes the count in pencil on the cabinet’s side._  
**Pixel**: One down. Eleven to go. I’m drawing a little jar for each one. Badly.  
_The Knight is already walking. It stops at the next turning, and waits, without looking round._  
**Pixel**: Ruling: it waited. I’m writing that down too.  

**Rewards**


Sets on completion: `{"pa3-03":true}`

**Notes:** The Grubfather never speaks; he sobs, sighs and kettles. Show the grub count (1/12) in the journal from here. Pixel’s pencilled jars on the cabinet side are a small screen-corner tally (art: twelve outlines that fill in).

## PA3-4. Greenpath

*Hollow Knight (Team Cherry, 2017): Greenpath, and Hornet’s first warning* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-3, from Pixel’s cabinet in the lantern shed. · requires: PA3-3

**Cast:** Hornet (Hornet, protector of Hallownest (Hollow Knight (Team Cherry, 2017)); nothing from Silksong)

### Step 1: Cross Greenpath, and find the second grub.

Hint: Stay on the moss. The green water bites. · check: `collect:pa3-grub:02`

#### <a id="pa3-04-greenpath"></a>Scene `pa3-04-greenpath`

_Moss on everything. Light comes down through it in green threads, as if the cave were underwater._  
_Between the ledges lies water that glows a sour green. A leaf drops on it and fizzes._  
**Pixel**: Acid. Don’t touch it. Don’t let the Nubbin touch it. Don’t let the Nubbin look at it like that.  
_Your Nubbin looks at it like that._  
_The Knight crosses on a run of ledges, quick as a skimmed stone. You go slowly, on the moss._  
_Half-way across, your Nubbin stops dead. Crying, above you, behind a curtain of hanging moss._  
_The jar sits on a ledge too high for you. The Knight looks at it, then at your Nubbin, and crouches._  
_Your Nubbin climbs onto the Knight’s back, up onto its mask, and reaches. The Knight allows this._  

#### <a id="pa3-04-greenpath-done"></a>Done `pa3-04-greenpath-done`

_Pop. The grub hugs the Knight’s horn, which is the only part it can reach, and burrows into the moss._  
**Pixel** _(happy)_: Two. And the Knight let the Nubbin stand on its face. I need a minute.  

### Step 2: Decide what to do when someone on the ledge tells you to stop.

Hint: There’s no wrong answer here, only a different road. Hornet will remember either way. · check: `choose:pa3-hornet:greenpath`

#### <a id="pa3-04-hornet"></a>Scene `pa3-04-hornet`

_At the end of Greenpath a figure stands on a ledge: thin, cloaked in red, with a long needle on a thread._  
_Her mask is pale, like the Knight’s, but sharper. She doesn’t look at you; she looks at the Knight._  
**Pixel** _(think)_: That’s Hornet. She guards this place. The box says “protector”. The box looks worried.  
**Hornet** _(angry)_: Come no closer, ghost.  
**Hornet**: I know what you are. I know where you’re going. This kingdom has had enough of walkers in the dark.  
_She drops from the ledge and the needle comes whipping down. The Knight meets it with its nail._  
_Sparks in the green light. Then, for a breath, both of them stand still and look at you._  

**Choices**

- **Step back. Keep your hands where she can see them.** — sets `{"pa3-hornet":"back"}`
    - You step back, open your hands, and stand with your Nubbin behind your legs.
    - Hornet’s eyes flick to you once. Then she forgets you and goes back to the Knight.
    - **Pixel**: Good. Not our fight. Not our kingdom. We’re guests.
- **Stand beside the Knight. Hold your ground.** — sets `{"pa3-hornet":"stood"}`
    - You step up beside the Knight with your lantern high. Your Nubbin puffs itself up to twice its size.
    - Hornet looks at you properly now, the way you’d look at a wasp on your toast.
    - **Pixel**: That’s brave. I don’t know if it’s clever. It’s definitely brave.

#### <a id="pa3-04-hornet-done"></a>Done `pa3-04-hornet-done`

_The fight is short and fast and over your head. Then Hornet is kneeling, needle down, breathing hard._  
**Hornet**: Hm. Then go on, little ghost. Find out what waits at the end. I won’t stop you twice.  
_She flings her thread up into the dark and is gone, on her own feet, unhurt._  

### Complete

#### <a id="pa3-04-complete"></a>Complete `pa3-04-complete`

_Greenpath goes quiet again, apart from the drip of moss and the fizz of the water._  
**Pixel** _(think)_: “Ghost.” She called the Knight a ghost. I wonder what she knows that we don’t.  
**Pixel**: I’m writing her down. She’s going to matter. The ones who say “I won’t stop you twice” always do.  

**Rewards**


Sets on completion: `{"pa3-04":true}`

**Learning Grove swaps**

- `pa3-04-hornet#3` → Stop there, little ghost. Not one step more.

**Notes:** SIGNATURE CHOICE: pa3-hornet = back | stood. Pays off in PA3-11 (Herrah’s den), PA3-15 (Kingdom’s Edge) and PA3-18 (the Black Egg). LIFTED TEXT 1 at pa3-04-hornet#3 (“Come no closer, ghost.”, © Team Cherry, from the outline’s wiki transcription of the 2017 English script; check against the game). The fight is camera-on-you: two silhouettes and sparks, then Hornet kneeling. She is bested, never hurt.

## PA3-5. Quirrel

*Hollow Knight (Team Cherry, 2017): Quirrel at the Lake of Unn* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-4, from Pixel’s cabinet in the lantern shed. · requires: PA3-4

**Cast:** Quirrel (Quirrel, the wandering scholar (Hollow Knight (Team Cherry, 2017)))

### Step 1: Find the third grub among the mushrooms.

Hint: The big mushrooms bounce. Let your Nubbin go first; it’s lighter. · check: `collect:pa3-grub:03`

#### <a id="pa3-05-fungal"></a>Scene `pa3-05-fungal`

_Past Greenpath the moss gives way to mushrooms, tall as lamp-posts and orange as soup._  
_The air smells of bread that’s been left too long. Small spores drift past like lazy snow._  
_The Knight lands on a cap and is thrown straight up, and lands again, as if it does this every day._  
**Pixel**: Bouncy mushrooms. There are always bouncy mushrooms. It’s the law of caves.  
_Your Nubbin hops on one. It goes up, comes down, goes up, and does not want to get off._  
_From the top of its third bounce it sees the jar, wedged in the gills of a mushroom further on._  
_Crying, muffled by mushroom. Your Nubbin points the whole way down._  

#### <a id="pa3-05-fungal-done"></a>Done `pa3-05-fungal-done`

_You reach in up to your shoulder, and it smells of very old bread in there. The jar comes out with a squelch._  
_The grub hugs your wrist, then the Knight’s leg, to be fair. Then it’s gone._  
**Pixel**: Three. My little jars are filling in. I’m colouring them yellow. Grub-coloured.  

### Step 2: Meet the traveller sitting by the lake.

Hint: There’s a bench on the shore. Someone’s already on it. · check: `talk:pa3-quirrel:lake-of-unn`

#### <a id="pa3-05-bench"></a>Scene `pa3-05-bench`

_The tunnel ends at a lake, wide and green-grey and quite still. It goes further than your lantern does._  
_On a bench by the water sits a bug in a cracked mask, with a nail across his knees, looking out._  
**Quirrel** _(happy)_: Oh, hello! Travellers! And a small round one. I didn’t think anyone else came this far.  
**Quirrel**: I’m Quirrel. I wander. I came down here to look for something and I can’t for the life of me remember what.  
**Quirrel** _(think)_: Isn’t that funny? It’s not, really. But I find if I say it’s funny it sits better.  
_The Knight has gone on round the shore. It stops a long way off, and waits._  
**Quirrel**: There’s room on the bench, if you’d like it. I’m only looking at the water. It doesn’t mind company.  

**Choices**

- **Sit with him.** — sets `{"pa3-quirrel":"sat"}`
    - You sit, with your Nubbin between you. The lake does nothing, very beautifully.
    - **Quirrel**: Do you ever feel you’ve been somewhere before, and can’t think when?
    - **Quirrel**: I feel I’ve seen this kingdom before. Not the roads. Something under the roads.
    - **Quirrel**: Never mind. Thank you for sitting. It’s much better looking at a lake with somebody.
- **Wave, and catch up with the Knight.** — sets `{"pa3-quirrel":"passed"}`
    - **Quirrel**: Of course! Off you go. Mind the edges. Perhaps I’ll see you further down.
    - When you look back, he’s still on the bench, looking at the water.

### Complete

#### <a id="pa3-05-complete"></a>Complete `pa3-05-complete`

_The Knight walks on as soon as you reach it, as if it had been counting._  
**Pixel** _(think)_: I like him. He’s cheerful in a way that has a hole in the middle.  
**Pixel**: Ruling: we keep an eye out for Quirrel. People like that turn up again.  

**Rewards**


Sets on completion: `{"pa3-05":true}`

**Notes:** pa3-quirrel = sat | passed. With sat, PA3-16 plays as written (the longer scene); with passed, PA3-16 plays PA3_VARIANTS pa3-16-shore-passed instead. GRUB 3 of 12. Note: the Lake of Unn in the source lies past Greenpath; the mushroom walk stands in for the edge of the Fungal Wastes.

## PA3-6. The Mantis Lords

*Hollow Knight (Team Cherry, 2017): the Mantis Village and the three Mantis Lords* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-5, from Pixel’s cabinet in the lantern shed. · requires: PA3-5

**Cast:** Mantis Lord (The eldest of the three Mantis Lords (Hollow Knight (Team Cherry, 2017)))

### Step 1: Get through the Mantis Village, and find the fourth grub.

Hint: The mantises are guarding a door, not hunting you. Keep low and keep behind the Knight. · check: `collect:pa3-grub:04`

#### <a id="pa3-06-village"></a>Scene `pa3-06-village`

_A village built down a cliff, all hooks and ladders. Tall green bugs stand guard on every rail._  
_They don’t have orange eyes; they’re not ill. They’re just guarding, the way they always have._  
**Pixel**: Mantises. The box says they hold the way into Deepnest, so nothing from down there comes up.  
**Pixel**: They’re not the baddies. They’re the gate. Gates aren’t baddies. Gates just have very firm opinions about boots.  
_A mantis looks down at the Knight’s boots. It has a very firm opinion._  
_A young mantis lunges at the Knight. The Knight turns it aside and keeps walking, nail down._  
_Under a ladder, in the shadow, your Nubbin finds a jar. The grub inside has stopped crying, out of tiredness._  
_It starts again the moment it sees you, mostly from relief._  

#### <a id="pa3-06-village-done"></a>Done `pa3-06-village-done`

_It hugs your Nubbin, which hugs back so hard they both fall over. Then it’s gone into the cliff._  
**Pixel**: Four. I’m running out of yellow. Grubs are now pale orange. Nobody tell them.  

### Step 2: Watch the Mantis Lords’ duel, and pay them the right respect.

Hint: Stay at the edge of the hall. It’s the Knight’s duel, not yours. · check: `watch:pa3-mantis-lords:throne-hall`

#### <a id="pa3-06-lords"></a>Scene `pa3-06-lords`

_At the bottom of the village, a hall with three high seats. In them sit three tall mantises, very still._  
_The middle one rises. She draws a long blade and bows to the Knight, low and exact._  
**Mantis Lord**: One at a time. Fairly. As it has always been done here.  
_They fight one after another, each one faster than the last. It’s like watching the weather change._  
_When it’s done, all three of them stand in a row. And all three of them bow._  
**Pixel** _(shock)_: They lost. And they bowed. Ruling: that’s the classiest thing I’ve ever seen in a cave.  
_Your Nubbin, at the edge of the hall, looks at the three of them, then at you._  

**Choices**

- **Bow back.**
    - You bow. Your Nubbin bows too, so low it tips over and has to be stood up again.
- **Let your Nubbin answer for you both.**
    - Your Nubbin walks to the middle of the hall, all by itself, and bows very low. Then it tips over.

#### <a id="pa3-06-lords-done"></a>Done `pa3-06-lords-done`

_The eldest mantis looks down at your Nubbin for a long moment. Then she inclines her head to it._  
**Mantis Lord**: The small one has manners. Go through. The village will not trouble you again.  

### Complete

#### <a id="pa3-06-complete"></a>Complete `pa3-06-complete`

_Every mantis on every rail lowers its blade as you pass. Some of them bow to your Nubbin._  
_Your Nubbin bows back to every single one, which takes a very long time._  
**Pixel**: Don’t rush it. This is the best bit of the cartridge so far. I’ve paused my biscuit.  

**Rewards**


Sets on completion: `{"pa3-06":true}`

**Notes:** GRUB 4 of 12. The duel: three short silhouette rounds, then a bow animation for all three Lords. Your Nubbin’s bow ends with it tipping over (a reusable gag animation: bow, wobble, sit). Mantis guards turn aside, never fall.

## PA3-7. The City of Tears

*Hollow Knight (Team Cherry, 2017): the City of Tears and the Hollow Knight memorial* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-6, from Pixel’s cabinet in the lantern shed. · requires: PA3-6

**Cast:** Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own Clank from S21)

### Step 1: Find the statue in the rainy square.

Hint: Follow the Knight to the middle of the city. It knows where it’s going. · check: `visit:pa3-memorial:city-square`

#### <a id="pa3-07-plaque"></a>Scene `pa3-07-plaque`

_A city under a lake. Blue towers, blue glass, and rain falling from the cave roof, the way it has for an age._  
_In the square stands a statue: a tall figure with a horned mask, chained, holding a nail. It is very like the Knight._  
_The Knight stops in front of it and doesn’t move at all._  
_On the plinth there’s a plaque, its letters worn. Your lantern isn’t bright enough to read it._  
**Pixel** _(soft)_: I can read it from here. Hang on. I’ll read it slowly.  
**Pixel**: It says it’s for the Hollow Knight. The kingdom’s vessel. The one who held the plague.  
**Pixel** _(sad)_: “Through its sacrifice Hallownest lasts eternal.”  
**Pixel** _(sad)_: …That’s it. That’s the whole plaque. Somebody gave up everything and they got one sentence.  
_Rain runs down the statue’s mask. The Knight puts out one small hand and touches the stone._  

**Choices**

- **Wait with the Knight.**
    - You stand in the rain beside it, and nobody says anything. After a while the Knight takes its hand back.
- **Hold your lantern up so the Knight can see the face.**
    - You lift the lantern and the statue’s mask shines. The Knight looks at it for a long time, then walks on.

#### <a id="pa3-07-plaque-clank"></a>Variant `pa3-07-plaque-clank`

_Variant of `pa3-07-plaque`._

_A city under a lake. Blue towers, blue glass, and rain falling from the cave roof, the way it has for an age._  
_In the square stands a statue: a tall figure with a horned mask, chained, holding a nail. It is very like the Knight._  
_The Knight stops in front of it and doesn’t move at all._  
_On the plinth there’s a plaque, its letters worn. Your lantern isn’t bright enough to read it._  
**Pixel** _(soft)_: I can read it from here. Hang on. I’ll read it slowly.  
**Pixel**: It says it’s for the Hollow Knight. The kingdom’s vessel. The one who held the plague.  
**Pixel** _(sad)_: “Through its sacrifice Hallownest lasts eternal.”  
**Pixel** _(sad)_: …That’s it. That’s the whole plaque. Somebody gave up everything and they got one sentence.  
**Pixel**: …Clank?  
_Through the speaker, the cabinet is quieter than it’s been all day. No beeping, no announcing._  
**Pixel** _(soft)_: He’s just sitting there. He stopped when I said “vessel”. He’s looking at his own hands.  
**Clank** _(sad)_: Announcement… no announcement.  
**Pixel** _(soft)_: Hey. You’re not a vessel. You’re Clank. You’re an announcer. You’re my best announcer.  
**Clank** _(soft)_: …Okay.  
_Rain runs down the statue’s mask. The Knight puts out one small hand and touches the stone._  

**Choices**

- **Wait with the Knight.**
    - You stand in the rain beside it, and nobody says anything. After a while the Knight takes its hand back.
- **Hold your lantern up so the Knight can see the face.**
    - You lift the lantern and the statue’s mask shines. The Knight looks at it for a long time, then walks on.

#### <a id="pa3-07-plaque-done"></a>Done `pa3-07-plaque-done`

**Pixel** _(think)_: A vessel. That’s what it says. Not a knight. A thing you put something in.  
**Pixel**: I don’t like that word as much as I did this morning.  

### Step 2: Get the fifth grub down off the rooftop.

Hint: Your Nubbin heard it first. The way up is by the drainpipes. · check: `collect:pa3-grub:05`

#### <a id="pa3-07-roof"></a>Scene `pa3-07-roof`

_Under the rain, your Nubbin’s ears go up, then sideways, then straight up again._  
_Nobody else hears it. Then you do: crying, very faint, from somewhere high._  
_On a rooftop above the square, a jar sits in a gutter, full to the shoulders with rainwater._  
_The grub inside is crying and treading water._  
**Pixel** _(shock)_: Up the drainpipe. Go. Go! Don’t look at me, go!  
_You climb the pipe, and your Nubbin climbs you. The Knight is already on the roof, as if it took the stairs._  

#### <a id="pa3-07-roof-done"></a>Done `pa3-07-roof-done`

_You tip the jar. Out slides a very wet grub, which hugs your Nubbin, which is also very wet now._  
_It burrows into the roof tiles, carefully, so as not to leave a hole for the rain._  
**Pixel**: Five. Nearly half. Pale orange is now beige. They’re grubs. They won’t mind beige.  

### Complete

#### <a id="pa3-07-complete"></a>Complete `pa3-07-complete`

_From the roof you can see the whole City of Tears, and the statue in the square, small now, in the rain._  
_The Knight looks at it once more. Then it turns away and drops off the roof towards the next road._  
**Pixel**: Ruling: I’m not reading any more plaques today. Next one, you read. Or the Nubbin.  

**Rewards**


Sets on completion: `{"pa3-07":true}`

**Learning Grove swaps**

- `pa3-07-plaque#6` → “It gave up everything, so the kingdom could stay.”

**Notes:** CLANK: if s21Done, play PA3_VARIANTS pa3-07-plaque-clank instead of pa3-07-plaque (same choices). LIFTED TEXT 2 at pa3-07-plaque#6 (the memorial plaque, © Team Cherry, from the outline’s wiki transcription; check against the game). Pixel reads the plaque; draw it worn and unreadable on screen so the line is hers. GRUB 5 of 12.

## PA3-8. The Seer

*Hollow Knight (Team Cherry, 2017): the Resting Grounds, the Dreamers’ shrine and the Dream Nail* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-7, from Pixel’s cabinet in the lantern shed. · requires: PA3-7

**Cast:** The Seer (The Seer, last of the moth tribe (Hollow Knight (Team Cherry, 2017))), A husk’s dream (The dream-thoughts of the infected husks (Hollow Knight (Team Cherry, 2017)); new words)

### Step 1: Free the sixth grub in the Resting Grounds.

Hint: It’s among the graves. Walk quietly; this is a sleeping place. · check: `collect:pa3-grub:06`

#### <a id="pa3-08-graves"></a>Scene `pa3-08-graves`

_The Resting Grounds are a hillside of small stone graves under a soft violet light._  
_It’s the most peaceful place you’ve been. Even the Knight walks more slowly here._  
**Pixel**: A graveyard. A nice one. I didn’t know they did nice ones.  
_Between two old stones, a jar. The grub inside is crying very quietly, as if it knows where it is._  
_Your Nubbin goes on tiptoe to fetch it. Nubbins don’t really have tiptoes, but it manages._  
_The cork comes out with the softest pop you’ve ever heard._  

#### <a id="pa3-08-graves-done"></a>Done `pa3-08-graves-done`

_The grub hugs the Knight and burrows off between the stones, careful not to disturb anybody._  
**Pixel**: Six. Half. Half is a lot. I’m going to have a second biscuit.  

### Step 2: See what the three masks on the shrine are.

Hint: The Knight is heading for the shrine at the top of the hill. Stay close to it. · check: `visit:pa3-dreamer-shrine:resting-grounds`

#### <a id="pa3-08-shrine"></a>Scene `pa3-08-shrine`

_At the top of the hill, three great stone masks stand side by side on a shrine. Each one is a different face._  
**Pixel**: Lurien. Monomon. Herrah. Those are names on the box. It calls them “the Dreamers”.  
_The Knight steps up onto the shrine. You step up after it, because that’s what you do now._  
_The floor goes white. A door you hadn’t seen closes behind you, and it’s very quiet._  
_Then the shrine goes away, and so does the hill, and you are standing in a field of white nothing._  
**Pixel** _(shock)_: You’ve gone white. Your whole screen’s gone white. Are you… are you asleep?  
_Far away in the white, three huge shapes are lying still, each one holding something shut._  

#### <a id="pa3-08-shrine-done"></a>Done `pa3-08-shrine-done`

_Somebody taps you on the shoulder, very gently, and the white goes thin, like paper._  

### Step 3: Talk to the moth who woke you.

Hint: She is sitting at the top of a hill of her own, in the dream. Go and sit with her. · check: `talk:pa3-seer:dream`

#### <a id="pa3-08-seer"></a>Scene `pa3-08-seer`

_An old moth sits on a pile of cushions, wings folded round her like a shawl. Her eyes are closed._  
**The Seer** _(soft)_: There you are. The little ghost, and a guest, and a round small thing I don’t know. Welcome.  
**The Seer**: I am the last of my people. We used to listen to dreams. Nobody listens any more.  
**The Seer**: The light that sickens this kingdom talks to everyone in their sleep. It sounds kind. It isn’t.  
_She holds out something to the Knight: a nail made of something pale, like a dream of a nail._  
**The Seer**: This lets you hear what they dream. Use it on the sleepers. Use it, especially, on the three.  
_The Knight takes it. Your Nubbin reaches up and touches it too, and the moth laughs._  
**The Seer** _(happy)_: You can’t have one. But you may come and sit with me. That’s nearly as good.  

**Choices**

- **Sit with her a moment.**
    - You sit on a cushion, and your Nubbin falls asleep on another. The moth hums, with no tune at all.
    - **The Seer**: Thank you. It has been a long time since anyone sat. Go. They’re waiting for you.
- **“What does the light want?”**
    - **The Seer**: Everything to be quiet and bright and the same, for ever. It thinks that’s love.

#### <a id="pa3-08-seer-done"></a>Done `pa3-08-seer-done`

_You wake up on the shrine with the floor under you. Your Nubbin is still asleep, so you carry it._  
_On the way down the hill lies a husk, curled up between the graves. The Knight raises the dream nail._  
**A husk’s dream** _(soft)_: …so bright… so warm… I’ll just sleep in it a little longer… just a little…  
**Pixel** _(angry)_: That’s what they hear. A light that says, “Sleep. I’ll keep you.” Ugh. I don’t like it.  

### Complete

#### <a id="pa3-08-complete"></a>Complete `pa3-08-complete`

_The Knight has the Dream Nail now. Every husk you pass dreams of the same thing: a warm light, and sleep._  
**Pixel** _(think)_: “Sleep, and I’ll keep you.” That’s not keeping. That’s a jar. A big warm jar with a cork in.  
**Pixel**: Ruling: we don’t trust anything that wants everyone to hold still. On we go.  

**Rewards**


Sets on completion: `{"pa3-08":true}`

**Notes:** GRUB 6 of 12. The dream is a white screen with three huge sleeping silhouettes far off (the Dreamers); keep it calm, not frightening. The Seer’s hum is wordless and tuneless. Husks’ dreams (pa3-husk) are new words. Pixel’s jar line in the complete scene ties the Radiance to the grub jars; it names nothing from the campaign.

## PA3-9. The Delicate Flower

*Hollow Knight (Team Cherry, 2017): the Grey Mourner and the Delicate Flower* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-8, from Pixel’s cabinet in the lantern shed. · requires: PA3-8

**Cast:** The Grey Mourner (The Grey Mourner (Hollow Knight (Team Cherry, 2017)))

### Step 1: Find the grey house past the crypts.

Hint: The crypt path starts behind the Resting Grounds. Keep your lantern low; it’s narrow. · check: `talk:pa3-mourner:grey-house`

#### <a id="pa3-09-house"></a>Scene `pa3-09-house`

_Behind the graves, a narrow path through the crypts leads to a small grey house on its own._  
_Inside, everything is grey: grey walls, grey cloth, a tall grey bug sitting very still._  
**The Grey Mourner** _(soft)_: Visitors. Nobody visits. Come in. Mind the step; it’s grey too.  
**The Grey Mourner**: I loved someone. They’re buried in the Queen’s Gardens, far from here. I can’t go. I’m too slow, and too sad.  
_She holds out a flower, white and thin as tissue, with a stem that bends if you look at it._  
**The Grey Mourner**: Take this to the grave for me. Please. But it is very delicate.  
**The Grey Mourner**: One knock and it’s gone. No stag rides. No dream-gates. Take the trams, and take them slowly.  
_The Knight looks at the flower. Then it looks at you, and steps back._  
**Pixel** _(happy)_: It’s giving you the job. The Knight fights; you carry. That’s… actually perfect.  

**Choices**

- **Take the flower in both hands.**
    - You hold it the way you’d hold a moth. Your Nubbin walks in front of you, checking for bumps.
- **“Who were they?”**
    - **The Grey Mourner**: Someone who held the door for me, every day, for years. Then one day they didn’t come.
    - She folds your fingers round the stem. You hold it the way you’d hold a moth.

#### <a id="pa3-09-house-done"></a>Done `pa3-09-house-done`

**The Grey Mourner**: If it breaks, come back. I’ll give you another. I have grown a great many, waiting.  

### Step 2: Carry the flower to the tram, and free the seventh grub without dropping it.

Hint: Your hands are full. Your Nubbin can open the jar on its own. · check: `collect:pa3-grub:07`

#### <a id="pa3-09-carry"></a>Scene `pa3-09-carry`

_Every step through the crypts, the flower trembles. You walk like someone carrying a full cup of tea._  
_The Knight walks ahead and swats anything that moves before it gets near you._  
**Pixel**: Flower status: still a flower. I’ll be saying that a lot. Flower status: still a flower.  
_Then, crying, from a ledge by the tram stop. Your Nubbin looks at you, and your hands are full._  
_Your Nubbin looks at the jar. Then it squares its shoulders and goes on its own._  
_It climbs, wedges the jar between its feet, and works the cork loose with both hands._  
_Nubbins aren’t built for corks. It manages anyway._  

#### <a id="pa3-09-carry-done"></a>Done `pa3-09-carry-done`

_The grub hugs your Nubbin, and your Nubbin, very proudly, hugs it back. Then it’s gone._  
**Pixel** _(happy)_: Seven. The Nubbin did that one by itself. I’m putting a star on that jar.  
**Pixel**: Flower status: still a flower. Tram’s here. Sit down. Don’t sneeze.  

### Complete

#### <a id="pa3-09-complete"></a>Complete `pa3-09-complete`

_The tram creaks along its rail through the dark, and you sit very straight, with the flower in your lap._  
_The Knight sits next to you. It doesn’t look at the flower, but it sits so its cloak shields it from the draught._  
**Pixel**: Ruling: this is the tensest tram ride in history. I’ve stopped eating. That’s how tense.  

#### <a id="pa3-09-broken"></a>Variant `pa3-09-broken`

_Variant within PA3-9; it has no single parent scene._

_A knock. The flower shivers, and its petals come away all at once, like breath on a cold window._  
**Pixel** _(sad)_: Oh no. Oh, no no. Flower status: not a flower.  
**Pixel** _(soft)_: It’s all right. She said she’d give you another. She’s grown loads. Back to the grey house.  
**The Grey Mourner** _(soft)_: It broke? Then here. Don’t be sorry. It means you were carrying it. Carry this one.  

**Rewards**


Sets on completion: `{"pa3-09":true}`

**Notes:** THE FLOWER is carried from here through PA3-10 and PA3-11 to the grave in PA3-12. Any knock (a hit, a fall, a stag ride or a dream-gate) breaks it: play PA3_VARIANTS pa3-09-broken, send the player back to the grey house, and the Grey Mourner gives another at once. Nothing is lost but time; progress and grubs are kept. Dream scenes in PA3-10 and PA3-13 never break it (the flower stays in the waking world, in your hands). GRUB 7 of 12.

## PA3-10. The Three Dreamers

*Hollow Knight (Team Cherry, 2017): Lurien, Monomon and Herrah, the three Dreamers* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-9, from Pixel’s cabinet in the lantern shed. · requires: PA3-9

**Cast:** Lurien (Lurien the Watcher, a Dreamer (Hollow Knight (Team Cherry, 2017))), Monomon (Monomon the Teacher, a Dreamer (Hollow Knight (Team Cherry, 2017))), Herrah (Herrah the Beast, a Dreamer, Hornet’s mother (Hollow Knight (Team Cherry, 2017))), Quirrel (Quirrel, the wandering scholar (Hollow Knight (Team Cherry, 2017)))

### Step 1: Climb the watcher’s spire and sit with Lurien.

Hint: The spire is above the City of Tears. The lift is slow. That’s good, for the flower. · check: `sit:pa3-lurien:watchers-spire`

#### <a id="pa3-10-lurien"></a>Scene `pa3-10-lurien`

_At the top of a spire over the city, in a cold room full of telescopes, someone sleeps in a great chair._  
_He is wrapped in a blue cloak, and a frost of years lies on his shoulders. He was watching the city when he fell asleep._  
**Pixel** _(soft)_: Lurien. The Watcher. He’s been holding the seal in his sleep. That’s his job. For an age.  
_The Knight lifts the Dream Nail. It touches him, so lightly, like a hand on a sleeve._  
**Lurien** _(soft)_: Ah. Is it time? I was watching the city. I always watch the city. Someone ought to.  
**Lurien**: They all went away. I kept looking anyway. Will you look at it for me, a moment?  
_You stand at the telescope, with the flower in one hand, and look at the blue city in the rain._  
**Lurien**: Thank you. Then I may close my eyes properly. Goodnight, little ghost.  

#### <a id="pa3-10-lurien-done"></a>Done `pa3-10-lurien-done`

_The frost on his shoulders goes to a soft shimmer, and then he isn’t there, and the chair is just a chair._  
_One of the shrine’s three locks, far away, gives a click you feel in your teeth._  
**Pixel** _(sad)_: He went to his rest. That’s all. He was tired.  

### Step 2: Get through the fog to Monomon’s archive, and find the eighth grub.

Hint: The fog bobs and drifts. Walk slowly; the flower likes slowly. Someone you know is coming. · check: `collect:pa3-grub:08`

#### <a id="pa3-10-monomon"></a>Scene `pa3-10-monomon`

_Fog Canyon is full of soft pink lights that bob in the air like jellyfish. They pop if you touch them._  
**Pixel**: Don’t touch them. Flower. Flower status: still a flower, please, please.  
_In a little hollow of fog, your Nubbin finds a jar and opens it, all by itself again, very carefully._  
_At the archive door, a shimmering ward blocks the way. And beside it, on a step, sits Quirrel._  
**Quirrel** _(soft)_: Oh! You! I remembered. Some of it. She was my teacher. Monomon. I came to let her go.  
**Quirrel**: Only I can lift this. She made it so. She knew I’d come back.  
_He lifts his hands. The ward goes thin and drifts away like a soap bubble._  
_Inside, in a great glass jar of water, the Teacher floats asleep, her tentacles folded like a cardigan._  
**Monomon** _(happy)_: …a student? Late, as always. And you’ve brought more. Good. Somebody should learn something.  
**Monomon**: I wrote down everything I knew. It’s all on the shelves. Read it after. I shall be resting.  

#### <a id="pa3-10-monomon-done"></a>Done `pa3-10-monomon-done`

_Quirrel sits on the floor by the jar with his hands on the glass until the light inside goes soft and out._  
**Quirrel** _(sad)_: Thank you. I’ll be all right. I’m nearly always all right. You go on.  
_Click: the second lock._  

### Step 3: Go down into Deepnest, and sit with Herrah.

Hint: Deepnest is very dark. Keep the lantern on the flower and your Nubbin close. · check: `sit:pa3-herrah:deepnest-den`

#### <a id="pa3-10-herrah"></a>Scene `pa3-10-herrah`

_Deepnest is dark in a thick way, like wool. Threads of old silk hang everywhere, and things scuttle at the edges._  
_The Knight keeps them off. You keep the flower under your chin, out of their way._  
_In the deepest den, in a bed of silk, lies a great sleeping spider, bigger than a barn. Her face is kind._  
**Pixel** _(soft)_: Herrah. The Beast. She’s… she’s somebody’s mum. The box says so.  
_The Knight lifts the Dream Nail. Her many eyes open, one at a time, slowly._  
**Herrah** _(think)_: You. The pale king’s child. I made a bargain with him. My sleep, for my daughter.  
**Herrah**: Is she well? Is she strong? She was always strong. Too strong to sit still.  

**Choices**

- **“She’s well. She’s very strong.”**
    - **Herrah**: Yes. Of course she is.
    - Something in her many eyes lets go.
- **Say nothing. Sit down by her.**
    - You sit at the edge of the silk, and your Nubbin leans on one of her legs. She lets out a long breath.
    - **Herrah**: You don’t lie. Good. Then I’ll believe you when you go and see her for me.

#### <a id="pa3-10-herrah-done"></a>Done `pa3-10-herrah-done`

_Her eyes close, one at a time, the way they opened. The silk goes slack, and she has gone to her rest._  
_Click: the third lock. Far above, in the temple, something very old cracks a little wider._  
**Pixel** _(sad)_: That was three goodbyes in a row. I’m all right. I am. Shush.  

### Complete

#### <a id="pa3-10-complete"></a>Complete `pa3-10-complete`

_Three Dreamers have gone to their rest, and all three seals are open now._  
_The Knight stands in the dark of the den and looks at nothing for a while. You and your Nubbin sit with it._  
**Pixel**: Flower status: still a flower. I don’t know how. Ruling: you’re a hero of carrying.  
_Then a thread in the doorway twitches, and someone is standing there._  

**Rewards**


Sets on completion: `{"pa3-10":true}`

**Notes:** CARE: in the source the Knight kills the Dreamers in their dreams. Here the Dream Nail wakes each one, they say goodbye, and they fade like a warden going to rest. No struggle, no blow. Quirrel lifts Monomon’s ward whichever way pa3-quirrel was set. GRUB 8 of 12 (Fog Canyon). The complete scene ends on Hornet’s arrival: PA3-11 follows on.

## PA3-11. Herrah’s Den

*Hollow Knight (Team Cherry, 2017): Hornet at her mother’s resting place in Deepnest* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-10, from Pixel’s cabinet in the lantern shed. · requires: PA3-10

**Cast:** Hornet (Hornet, protector of Hallownest (Hollow Knight (Team Cherry, 2017)); nothing from Silksong)

### Step 1: Be there for Hornet, in whatever way she lets you.

Hint: She has just lost her mother. Don’t rush her. · check: `sit:pa3-hornet:deepnest-den`

#### <a id="pa3-11-den"></a>Scene `pa3-11-den`

_Hornet stands in the doorway with her needle in her hand. She isn’t looking at you; she’s looking at the empty silk._  
_She walks past you, past the Knight, to the bed of silk, and stands there._  
_She doesn’t kneel, and she doesn’t say anything. Her needle hangs from her hand, pointing at the floor._  
**Pixel** _(sad)_: That was her mum. Herrah was her mum.  
_After a long time she turns her head, just a little, towards you._  
**Hornet**: You stood back, in Greenpath. You kept your hands open.  
**Hornet**: You can sit. There. Not too close.  
_You sit where she pointed, with your Nubbin by you. Nobody says anything about grief._  

**Choices**

- **Say nothing. Just sit.**
    - You don’t say anything, and neither does she. That’s the right answer, and both of you know it.
    - After a while, she breathes out, long and slow.
- **“I’m sorry.”**
    - **Hornet**: Don’t.
    - It isn’t unkind; it’s a door closing gently. You go back to saying nothing, and that’s better.

#### <a id="pa3-11-den-stood"></a>Variant `pa3-11-den-stood`

_Variant of `pa3-11-den`._

_Hornet stands in the doorway with her needle in her hand. She isn’t looking at you; she’s looking at the empty silk._  
_She walks past you, past the Knight, to the bed of silk, and stands there, very straight._  
**Pixel** _(sad)_: That was her mum. Herrah was her mum.  
_You take a step towards her, and her needle comes up, level, between you. She doesn’t turn round._  
**Hornet** _(angry)_: You stood your ground in Greenpath. Stand it somewhere else.  
**Hornet**: Both of you. Go. Leave me here.  
_The Knight goes. You go too, with your Nubbin, and the flower held close, and sit outside the den in the dark._  

**Choices**

- **Sit outside, and wait where she can’t see you.**
    - After a long time you hear one small sound from the den, and then nothing. You don’t go in.
- **Go, as she asked.**
    - You go, as she asked. Your Nubbin looks back once; you don’t.

#### <a id="pa3-11-den-done"></a>Done `pa3-11-den-done`

_She stands up. She picks one thread of silk off the bed, winds it round her wrist, and turns to go._  
**Hornet**: Keep that flower whole. Something should get where it’s going.  

#### <a id="pa3-11-den-done-stood"></a>Variant `pa3-11-den-done-stood`

_Variant of `pa3-11-den-done`._

_When she comes out, she walks past you as if you were a stone. She has a thread of silk wound round one wrist._  
**Pixel** _(sad)_: She’s not angry. Well. She is. But not mostly. Mostly she’s just on her own.  

### Step 2: Find the ninth grub on the way out of Deepnest.

Hint: Your Nubbin will hear it. It’s close to the edge of the gardens. · check: `collect:pa3-grub:09`

#### <a id="pa3-11-grub"></a>Scene `pa3-11-grub`

_The way out of Deepnest climbs, and the dark thins, and you can smell leaves._  
_Your Nubbin stops, ears up. Crying, in a web, high in a corner._  
_The jar is tied up in silk like a parcel. The grub inside is cross about it._  
_The Knight cuts the silk with one neat stroke. Your Nubbin catches the jar, and you catch your Nubbin._  
_The flower, in your other hand, sways and holds._  
**Pixel** _(shock)_: FLOWER STATUS: STILL A FLOWER. Sorry. Shouting. I’m all right.  

#### <a id="pa3-11-grub-done"></a>Done `pa3-11-grub-done`

_The grub hugs everyone and burrows away, still a bit cross. Nine._  
**Pixel**: Nine. Three to go. I’ve run out of beige. They’re pencil now.  

### Complete

#### <a id="pa3-11-complete"></a>Complete `pa3-11-complete`

_At the edge of Deepnest the dark gives way to a green, overgrown garden._  
_Somewhere behind you, Hornet goes back the other way, alone, into the dark she grew up in._  
**Pixel** _(soft)_: I’m not going to say anything about that. Like you didn’t. Ruling: that was right.  

**Rewards**


Sets on completion: `{"pa3-11":true}`

**Notes:** HORNET PAYOFF 1 (pa3-hornet). As written, pa3-11-den is for back. For stood, play PA3_VARIANTS pa3-11-den-stood in place of pa3-11-den, and pa3-11-den-done-stood in place of pa3-11-den-done; the step check is the same (she tells you to go: sitting where you’re told, outside the den, completes it). CARE: Hornet’s grief is short, private and never comic. Pixel’s jokes stop in this scene. GRUB 9 of 12.

## PA3-12. The Queen’s Gardens

*Hollow Knight (Team Cherry, 2017): the Queen’s Gardens, the grave, and the White Lady* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-11, from Pixel’s cabinet in the lantern shed. · requires: PA3-11

**Cast:** The White Lady (The White Lady, the Pale King’s queen (Hollow Knight (Team Cherry, 2017)))

### Step 1: Free the tenth grub from the thorns, without the flower going anywhere near them.

Hint: Your hands are full again. Your Nubbin is smaller than the gaps in the thorns. · check: `collect:pa3-grub:10`

#### <a id="pa3-12-thorns"></a>Scene `pa3-12-thorns`

_The Queen’s Gardens were beautiful once, and are still beautiful, only wilder. Thorns everywhere._  
_The Knight walks in front of you and cuts a path wide enough for one flower and the person holding it._  
_Half-way through, your Nubbin stops. Crying, from deep in a thorn bush._  
**Pixel** _(shock)_: Flower. Thorns. Flower. Thorns. I can’t look. I’m looking.  
_You stand very still with the flower held high. Your Nubbin lies down flat and wriggles in on its belly._  
_A long wait, a rustle, a pop. Then your Nubbin wriggles out backwards, with a jar, and a grub on its head._  

#### <a id="pa3-12-thorns-done"></a>Done `pa3-12-thorns-done`

_The grub hugs the Knight’s boot and burrows into the soft garden earth. Ten._  
**Pixel** _(happy)_: Ten. Flower status: still a flower. Nubbin status: slightly scratched, extremely proud.  

### Step 2: Lay the Delicate Flower on the grave in the Queen’s Gardens.

Hint: The grave is in a clearing at the far end of the gardens. Last stretch. Slowly. · check: `deliver:pa3-delicate-flower:queens-gardens`

#### <a id="pa3-12-grave"></a>Scene `pa3-12-grave`

_The path opens into a clearing. The thorns stop as if they’d been told to._  
_In the middle there’s a small stone, with grass grown long around it that nobody has cut for an age._  
_The Knight stops at the edge of the clearing and doesn’t go any closer. This part is yours._  
_You walk the last few steps more slowly than you have walked anything in your life._  
_Your Nubbin walks beside you with both arms out, ready to catch the flower if the air moves._  
**Pixel** _(soft)_: That’s it. That’s the grave. Flower status: still a flower. Go on. Put it down.  

**Choices**

- **Lay it on the stone.**
    - You lay it on the stone, and it doesn’t break. It sits up a little, in the light, as if it’s home.
- **Plant it in the grass by the stone.**
    - You make a hole with two fingers and set it in. It stands up straight, as if it was always going to grow here.

#### <a id="pa3-12-grave-done"></a>Done `pa3-12-grave-done`

_The Knight stands by the grave with its head bowed. Your Nubbin pats the stone, twice._  
**Pixel** _(happy)_: Delivered. We did it. I did nothing. You did it. I was emotionally present.  

### Step 3: Go into the white root room behind the gardens.

Hint: There’s a door in the roots at the back of the gardens. The Knight is already going in. · check: `talk:pa3-lady:root-room`

#### <a id="pa3-12-lady"></a>Scene `pa3-12-lady`

_Behind the gardens, a room grown over with pale roots. In the middle, bound in them, sits a tall pale lady._  
_She has a crown of white branches, and she can’t move at all. She smiles when she sees the Knight._  
**The White Lady** _(soft)_: Little one. You came. Of course you came. You were always going to come.  
**The White Lady** _(sad)_: My husband made you, and made your brothers and your sisters, and chose one, and threw the rest away.  
**The White Lady**: He did it to keep the kingdom safe. I let him. I’m sorry. For all of you.  
_A root lifts something from her lap: half of a white charm, warm as a hand._  
**The White Lady**: Take this. It’s half of what he carried. The other half is in his palace, in the dream of it.  
_The Knight takes it. Then she looks past it, at you, and at your Nubbin._  
**The White Lady** _(happy)_: And you two. You carried that flower all that way. I could smell it coming.  

#### <a id="pa3-12-lady-done"></a>Done `pa3-12-lady-done`

_A root curls round to you and drops something into your hand: a seed, white as the flower._  
**The White Lady**: A garden thing. It won’t wilt. Nothing grown from that grave will.  

### Complete

#### <a id="pa3-12-complete"></a>Complete `pa3-12-complete`

_You leave the White Lady in her roots, smiling, and the grave with its flower._  
**Pixel** _(think)_: She said he threw the rest away. The rest of the Knights. Where do you throw away a Knight?  
**Pixel** _(sad)_: …I’ve found it on the map. I wish I hadn’t. It’s down. It’s a long way down.  
_Pixel puts a small white flower in a pot on top of the cabinet, in the real lantern shed. You hear the clunk._  
**Pixel**: From the seed. It came out of the cabinet tray. Don’t ask. It’s not wilting. I don’t think it’s going to.  

**Rewards**

- The Delicate Flower, in a pot (decor): A thin white flower in a clay pot, grown from the White Lady’s seed. It never wilts, and nothing knocks it over.

Sets on completion: `{"pa3-12":true}`

**Notes:** The grave is the Grey Mourner’s love. Laying or planting both deliver. GRUB 10 of 12. The flower-pot decor arrives on top of the cabinet first; the player may move it into the Grove like any decor. It is a Grove decoration reward only; no Grove flag is written.

## PA3-13. The White Palace

*Hollow Knight (Team Cherry, 2017): the White Palace, and the Pale King’s memory* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-12, from Pixel’s cabinet in the lantern shed. · requires: PA3-12

**Cast:** The Pale King (The Pale King, in a memory (Hollow Knight (Team Cherry, 2017))), Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own Clank from S21)

### Step 1: Follow the Knight into the dream of the king’s palace.

Hint: A fallen palace guard lies at the edge of the old basin. The Knight will use the Dream Nail on it. · check: `visit:pa3-white-palace:dream`

#### <a id="pa3-13-dream"></a>Scene `pa3-13-dream`

_At the edge of an old basin lies a tall guard in white armour, asleep, holding a spear upright._  
_The Knight touches it with the Dream Nail. The world goes white, the way it did at the shrine._  
_When it comes back, you’re standing in a palace made entirely of white._  
_White walls, white floors, white saws spinning in white slots. Spikes, white too, in neat rows._  
**Pixel** _(shock)_: That’s… a lot of saws. Who builds a house out of saws?  
**Pixel** _(angry)_: Someone who doesn’t want visitors. Someone who wants to stay perfect. Ugh. Right.  
_The Knight looks up the long white shaft and starts to climb. You stay at the bottom with your lantern._  

#### <a id="pa3-13-dream-done"></a>Done `pa3-13-dream-done`

**Pixel**: Right. You can see the saws from down there, and I can see the whole map. Between us, we’re its eyes.  

### Step 2: Call out the timings with Pixel while the Knight climbs.

Hint: Watch the saws. Pixel calls left and right; you call “now”. Missed calls cost nothing but a retry. · check: `puzzle:pa3-palace-timings:white-palace`

#### <a id="pa3-13-timings"></a>Scene `pa3-13-timings`

**Pixel**: Saw on the left. It goes round every… two seconds. Wait for it. Wait.  
_The saw sweeps past and you shout, “Now!” The Knight jumps, and is past it._  
**Pixel**: Spikes on the next ledge. Then a wall saw. Then three in a row. Oh, they’re showing off now.  
_Your Nubbin is watching the saws too. It bobs its head in time with them, like a metronome._  
**Pixel**: Copy the Nubbin. The Nubbin’s got the rhythm. Ruling: the Nubbin is head of timing.  
_The Knight climbs, you call, the Nubbin bobs. Pixel taps the cabinet in time, which helps nobody, but she does it._  

**Choices**

- **Call when the Nubbin bobs.**
    - Bob, call, jump; bob, call, jump. It works so well that Pixel starts humming, no tune, just the beat.
- **Count out loud. One, two, now.**
    - You count, Pixel counts with you, and your Nubbin bobs anyway. Between you, nobody misses.

#### <a id="pa3-13-timings-done"></a>Done `pa3-13-timings-done`

_The Knight reaches the top of the shaft and stands on a white throne-room floor. You run up the safe stair after it._  

### Step 3: Watch the memory waiting in the throne room.

Hint: Stand near the Knight and watch. It’s only a memory; nobody can see you. · check: `watch:pa3-king-memory:white-palace`

#### <a id="pa3-13-memory"></a>Scene `pa3-13-memory`

_On the throne lies the other half of the white charm. The Knight picks it up, and they become one._  
_The light changes. The room fills with a memory, pale and thin, like breath on glass._  
_A tall pale king stands in this room. In front of him stand dozens of small dark figures, all with horned masks._  
_He walks along their row. He stops at one, taller than the rest, very still, with no light in it at all._  
_He looks at it for a long time. Then he chooses it._  
**The Pale King** _(think)_: No cost too great.  
_The memory goes thin. The other small figures in the row fade last._  
_The Knight looks at where they were. Your Nubbin walks over and stands next to it, very close._  
**Pixel** _(sad)_: He chose one. And he thought choosing made it fine. For the others too.  

#### <a id="pa3-13-memory-clank"></a>Variant `pa3-13-memory-clank`

_Variant of `pa3-13-memory`._

_On the throne lies the other half of the white charm. The Knight picks it up, and they become one._  
_The light changes. The room fills with a memory, pale and thin, like breath on glass._  
_A tall pale king stands in this room. In front of him stand dozens of small dark figures, all with horned masks._  
_He walks along their row. He stops at one, taller than the rest, very still, with no light in it at all._  
_He looks at it for a long time. Then he chooses it._  
**The Pale King** _(think)_: No cost too great.  
_The memory goes thin. The other small figures in the row fade last._  
_The Knight looks at where they were. Your Nubbin walks over and stands next to it, very close._  
**Pixel** _(sad)_: He chose one. And he thought choosing made it fine. For the others too.  
_On the cabinet, Clank has put his hands over his eye._  
**Pixel** _(soft)_: You can come down, Clank. Come and sit on my lap. Nobody here is choosing anybody.  
_A clank, a scrape, and a small metal weight settles somewhere near Pixel. She doesn’t say anything else for a bit._  

#### <a id="pa3-13-memory-done"></a>Done `pa3-13-memory-done`

_The charm in the Knight’s hand glows white, and warm. The palace begins to come apart, gently, like a dream does._  
_You wake beside the fallen guard at the basin’s edge, all three of you, with the whole charm._  

### Complete

#### <a id="pa3-13-complete"></a>Complete `pa3-13-complete`

**Pixel** _(angry)_: He knew. He made them, and threw them away, and knew. And he said it wasn’t too much.  
**Pixel**: …Sorry. Not my kingdom. But it’s my cartridge, and I’m allowed to be cross at a king.  
_The Knight is standing at the edge of the basin, looking down. Below it, the dark goes on._  

**Rewards**


Sets on completion: `{"pa3-13":true}`

**Learning Grove swaps**

- `pa3-13-memory#5` → This one will do. Whatever it costs.

**Notes:** CLANK: if s21Done, play PA3_VARIANTS pa3-13-memory-clank instead of pa3-13-memory. LIFTED TEXT 3 at pa3-13-memory#5 (“No cost too great.”, © Team Cherry, from the outline’s wiki transcription; check against the game). The palace is a skill section for the Knight: the player’s job is the call-outs (a rhythm minigame on Pixel’s cues). No fail state beyond a retry. Pixel’s humming is a beat, no tune.

## PA3-14. The Abyss

*Hollow Knight (Team Cherry, 2017): the Abyss, the lighthouse and the Void Heart* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-13, from Pixel’s cabinet in the lantern shed. · requires: PA3-13

### Step 1: Free the eleventh grub at the rim of the basin.

Hint: It’s on the last ledge before the dark. Your Nubbin will find it. · check: `collect:pa3-grub:11`

#### <a id="pa3-14-rim"></a>Scene `pa3-14-rim`

_The Ancient Basin is grey and wide and quiet, with old pillars standing up out of it like teeth._  
_On the last ledge before the dark, your Nubbin finds a jar. The grub inside is crying in a tiny voice._  
_You open it, but it doesn’t burrow straight away. It hugs the Knight for a long time, as if it knows where it’s going._  
**Pixel** _(soft)_: Eleven. That’s eleven. One more after this.  
_Then it burrows, and the Knight turns to the edge, and looks down._  
_There’s a lift down, old and creaking. It goes a very long way._  

#### <a id="pa3-14-rim-done"></a>Done `pa3-14-rim-done`

_The lift goes down for a long time. Your lantern is the only light, and then not even that much._  

### Step 2: Go down into the Abyss with the Knight.

Hint: Keep the lantern up. They won’t hurt you. They’re only looking. · check: `explore:pa3-abyss:sea`

#### <a id="pa3-14-shades"></a>Scene `pa3-14-shades`

_At the bottom, a black sea, flat as ink. On a rock far out, a lighthouse, dark._  
_Around you, in the dark, there are shapes: small ones, with horned masks._  
_Hundreds of them, all the ones in the memory and more. They crowd towards the Knight, pressing in._  
**Pixel** _(sad)_: Those are the others. The ones he threw away. Its brothers and sisters.  
_They don’t attack; they push. They’re looking at the Knight the way you look at a door you thought was locked._  
_The Knight stands still in the middle of them, and they press closer, and closer._  
_Your Nubbin hides behind your legs, and then, slowly, comes out, and looks at the nearest one._  

### Step 3: Decide how to get the Knight through.

Hint: There’s a path down to the bottom, and there’s a switch on the lighthouse. You can’t do both. · check: `choose:pa3-abyss:lighthouse`

#### <a id="pa3-14-lighthouse"></a>Scene `pa3-14-lighthouse`

**Pixel**: Listen. There’s a path along the shore. It goes straight down to where the Knight came from.  
**Pixel**: If you hurry it, it’ll get there. They’ll press, but it’ll get there.  
**Pixel** _(think)_: Or. There’s a switch on the lighthouse. It’s been dark for an age. If you turn it on…  
**Pixel**: …they could see. That’s all. They’ve been in the dark so long. They could just see.  
_The Knight looks at the lighthouse, then at you. It doesn’t move; it’s waiting for you._  
**Pixel** _(soft)_: This is a real choice. I’ve checked. I can’t tell you which. I really, really can’t.  

**Choices**

- **Wade to the lighthouse, turn it on, and wait.** — sets `{"pa3-abyss":"waited"}`
    - You wade out through water that is cold and doesn’t wet you. The switch is stiff, so you lean on it.
    - The lighthouse comes on: a great slow beam, sweeping across the black sea.
    - Every one of the small masks turns to look at it. They stop pressing, and just look.
    - You wait, and your Nubbin waits. The Knight waits, and the shades stand round it, quiet, in the light.
- **Hurry the Knight down the shore path.** — sets `{"pa3-abyss":"hurried"}`
    - You take the shore path at a run, lantern swinging, and the Knight comes. The shades press round it all the way.
    - Behind you, the lighthouse stays dark.

### Complete

#### <a id="pa3-14-complete"></a>Complete `pa3-14-complete`

_In the beam of the lighthouse, the shades come to the Knight one by one, and touch it, and go back into the dark._  
_Not away: back. As if it’s home, and they’re in the next room._  
_The white charm in the Knight’s hand goes black, softly, from the edges in, like evening._  
**Pixel** _(shock)_: It’s changed. The charm. It was the king’s. Now it’s… theirs. All of theirs.  
**Pixel** _(soft)_: Ruling: I’m calling it the Void Heart. That’s what the box calls it. The box gets this one right.  
_The Knight looks at you and tilts its head. Then it bows, just a little, the way the mantises do._  

#### <a id="pa3-14-complete-hurried"></a>Variant `pa3-14-complete-hurried`

_Variant of `pa3-14-complete`._

_At the bottom of the shore path, the shades fall behind, still pressing at the dark where the Knight was._  
_The Knight looks back at them once, then walks on. The charm in its hand stays white._  
**Pixel** _(think)_: We got through. That’s… we got through. I don’t know if that was right. I don’t think there’s a wrong.  
**Pixel** _(soft)_: I’m keeping a save from just before. In case. That’s all. Just in case.  

**Rewards**


Sets on completion: `{"pa3-14":true}`

**Notes:** SECOND SIGNATURE CHOICE: pa3-abyss = waited | hurried. waited means the Knight holds the Void Heart. Pays off in PA3-18. As written, pa3-14-complete is for waited; for hurried play PA3_VARIANTS pa3-14-complete-hurried. GRUB 11 of 12. The shades are small dark masked shapes, never menacing: they push like a crowd at a door. THE ABYSS SAVE: take a cartridge save point the moment PA3-14 opens (before pa3-14-rim plays). The sealed ending in PA3-18 offers to return here: it clears pa3-abyss and pa3-14 … pa3-18 in the Arcade save and replays from PA3-14. Grubs 11 and 12 stay found; one-time rewards already given are not given twice.

## PA3-15. Kingdom’s Edge

*Hollow Knight (Team Cherry, 2017): Kingdom’s Edge, and Hornet’s last test* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-14, from Pixel’s cabinet in the lantern shed. · requires: PA3-14

**Cast:** Hornet (Hornet, protector of Hallownest (Hollow Knight (Team Cherry, 2017)); nothing from Silksong)

### Step 1: Find the twelfth grub in the falling ash.

Hint: Ash covers everything here. Listen with your Nubbin; don’t look. · check: `collect:pa3-grub:12`

#### <a id="pa3-15-ash"></a>Scene `pa3-15-ash`

_At the very edge of the kingdom, ash falls like snow, grey and soft, and settles on everything._  
_It settles on your lantern. It settles on your Nubbin, who sneezes, and settles on the Knight’s horns._  
**Pixel**: It’s so quiet out there. The speaker’s just hiss. Is that the ash or the speaker?  
_Your Nubbin stops. Under the ash, very faint: crying._  
_You dig with your hands and find a jar, half-buried. The grub inside is grey with ash and too tired to cry properly._  
_You open it. It tries to burrow and can’t; it just lies in the jar, looking up._  
**Pixel** _(soft)_: Oh, poor thing. Twelve. It’s number twelve. Bring it. Bring the jar. We’ll take it home ourselves.  

#### <a id="pa3-15-ash-done"></a>Done `pa3-15-ash-done`

_You tuck the open jar inside your coat. Your Nubbin checks on it every few steps._  
**Pixel** _(happy)_: Twelve. That’s all of them. That’s our twelve. I’m colouring the last one in with my best pen.  

### Step 2: Watch Hornet’s last test of the Knight.

Hint: She is waiting on the high ridge, in front of the King’s Brand. Stay back. · check: `watch:pa3-hornet-test:kingdoms-edge`

#### <a id="pa3-15-test"></a>Scene `pa3-15-test`

_On a high ridge, in the ash, a red cloak. Hornet stands in front of a stone door with a mark burned on it._  
**Hornet**: So you made it. Behind me is the king’s mark. Take it, and you can go to the very end.  
**Hornet**: But first, show me you’re strong enough to hold what you’ll find.  
_They fight, quick and hard in the falling ash. You stand back with your lantern, and your Nubbin covers its eyes._  
_Then it’s over, and Hornet steps aside. The Knight walks past her, and puts its hand on the mark._  
_Hornet turns. And this time, she looks at you._  
**Hornet**: You. You kept your hands open, in Greenpath. You sat where I told you to, in the den.  
**Hornet** _(soft)_: When it ends, I will come. Not for the king. For it. And because you asked me nothing.  

**Choices**

- **“Thank you.”**
    - **Hornet**: Don’t thank me yet. Thank me when I’m there.
- **Nod.**
    - You nod. She nods back, once, exactly as much as you did.

#### <a id="pa3-15-test-stood"></a>Variant `pa3-15-test-stood`

_Variant of `pa3-15-test`._

_On a high ridge, in the ash, a red cloak. Hornet stands in front of a stone door with a mark burned on it._  
**Hornet**: So you made it. Behind me is the king’s mark. Take it, and you can go to the very end.  
**Hornet**: But first, show me you’re strong enough to hold what you’ll find.  
_They fight, quick and hard in the falling ash. You stand well back this time, and your Nubbin covers its eyes._  
_Then it’s over, and Hornet steps aside. The Knight walks past her, and puts its hand on the mark._  
_Hornet doesn’t look at you. She speaks to the Knight only, low, and you don’t catch the words._  
**Pixel** _(think)_: She’s not talking to us. That’s fair. We stood in her way once. She remembers.  

#### <a id="pa3-15-test-done"></a>Done `pa3-15-test-done`

_She throws her thread up into the ash, and is gone. The Knight has the king’s mark on its shoulder now._  
**Pixel** _(happy)_: She promised. She promised you. Ruling: Hornet is coming. I’m so pleased I could bite the cabinet.  

#### <a id="pa3-15-test-done-stood"></a>Variant `pa3-15-test-done-stood`

_Variant of `pa3-15-test-done`._

_She throws her thread up into the ash, and is gone without a glance. The Knight has the king’s mark now._  
**Pixel** _(soft)_: Ruling: we don’t know if she’s coming. I hope she is. Not for us. For it.  

### Complete

#### <a id="pa3-15-complete"></a>Complete `pa3-15-complete`

_The ash keeps falling, softer now. The grub in your coat has gone to sleep, warm against you._  
_The Knight looks back down the ridge, the way you’ve come, then forwards, the way it has to go._  
**Pixel** _(think)_: One more stop. Quirrel said something about the rain. I think I know where he is.  

**Rewards**


Sets on completion: `{"pa3-15":true}`

**Notes:** HORNET PAYOFF 2 (pa3-hornet). As written, pa3-15-test is for back: she speaks to you and promises to come. For stood, play PA3_VARIANTS pa3-15-test-stood in place of pa3-15-test and pa3-15-test-done-stood in place of pa3-15-test-done (she tests the Knight and never speaks to you). GRUB 12 of 12: it does not burrow; you carry it home in its open jar (a small jar icon in the HUD) until PA3-17.

## PA3-16. Blue Lake

*Hollow Knight (Team Cherry, 2017): Quirrel at Blue Lake* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-15, from Pixel’s cabinet in the lantern shed. · requires: PA3-15

**Cast:** Quirrel (Quirrel, the wandering scholar (Hollow Knight (Team Cherry, 2017)))

### Step 1: Walk to the lake where the city’s rain begins.

Hint: Follow the rain uphill. Where the water collects, someone is sitting. · check: `walk:pa3-blue-lake:shore`

#### <a id="pa3-16-walk"></a>Scene `pa3-16-walk`

_Above the City of Tears, the rain comes from somewhere. You follow it uphill through a quiet tunnel._  
_It opens onto a lake of very clear blue water, so still that the cave roof sits in it upside down._  
_On the shore, sitting on a rock, with his nail planted in the sand beside him, is Quirrel._  
**Pixel** _(soft)_: There he is. I knew he’d be somewhere with water. He likes water.  
_The Knight stops at the edge of the sand, and lets you go first._  
_Your Nubbin runs ahead, and climbs into Quirrel’s lap, and sits there. Quirrel laughs._  

### Step 2: Sit with Quirrel by the lake.

Hint: There’s room on the rock. There always is, with Quirrel. · check: `sit:pa3-quirrel:blue-lake`

#### <a id="pa3-16-shore"></a>Scene `pa3-16-shore`

**Quirrel** _(happy)_: You came! And the small one, and the quiet one. I hoped you might. Sit, sit.  
_You sit beside him on the rock, as you did at the Lake of Unn. You can see he remembers._  
**Quirrel** _(soft)_: Do you remember I said I’d seen this kingdom before? I was right. I have. Twice now.  
**Quirrel**: Once long ago, when I was her student, and I forgot. And once now, with you. I’m glad of both.  
**Quirrel**: I came down here not knowing why. Now I know. I came to let my teacher rest. And I did.  
_He looks at the water for a while. Your Nubbin has gone to sleep in his lap._  
**Quirrel** _(soft)_: Will you do something for me? Tell someone I was here. Anyone. That’s all.  
**Quirrel**: It’s silly, I know. But if somebody knows, then I was. Do you see?  

**Choices**

- **“I’ll tell someone. I promise.”**
    - **Quirrel**: Then I’m content. Thank you, friend.
    - **Pixel**: I heard. That counts. I’m someone. I’ll tell more someones. Quirrel was here.
- **“Pixel’s listening. She already knows.”**
    - **Pixel**: …Hello, Quirrel. I’m Pixel. You were here. I’ve written it down. In pen.
    - **Quirrel**: Oh! A voice from the sky. Hello, Pixel. Thank you. That’s much better than I hoped.

#### <a id="pa3-16-shore-passed"></a>Variant `pa3-16-shore-passed`

_Variant of `pa3-16-shore`._

**Quirrel** _(happy)_: Oh! The travellers from the lake. You waved. I remember. Hello again.  
_You sit beside him on the rock. He moves up to make room, though there was room already._  
**Quirrel** _(soft)_: I’ve seen this kingdom twice now. Once long ago, when I forgot. And once now. I’m glad of both.  
**Quirrel**: I came to let my teacher rest. And I did. So I think I’m finished. It’s a nice feeling.  
_He looks at the water for a while. Then he gives your Nubbin a pat, and stands, and looks at his nail._  
**Quirrel**: If anyone ever asks about a bug called Quirrel, say he was here. That’s all.  
**Quirrel**: Go on. The end’s that way. I’m going to stay here a bit.  

#### <a id="pa3-16-shore-done"></a>Done `pa3-16-shore-done`

_He gives your sleeping Nubbin back to you, very carefully, the way you held the flower._  
**Quirrel**: Go on. The end’s that way. I’m going to sit here a bit longer.  

### Complete

#### <a id="pa3-16-complete"></a>Complete `pa3-16-complete`

_At the top of the tunnel you look back. The rock is empty._  
_Only his nail is there, planted in the sand by the water, with the rain beginning above it._  
**Pixel** _(sad)_: He’s gone. Just… gone on. He’d finished. I think that’s all right. I think he thought so.  
**Pixel** _(soft)_: I’m making one. A nail, like his. Out of Brisk’s offcuts. For your cottage wall.  
**Pixel**: Not his. His stays in the sand. Ours is so that somebody always knows he was here.  

**Rewards**

- Quirrel’s nail (a copy) (decor): Pixel’s wooden copy of Quirrel’s nail, made from Workyard offcuts, to hang on the cottage wall. So somebody always knows he was here.

Sets on completion: `{"pa3-16":true}`

**Notes:** QUIRREL PAYOFF (pa3-quirrel). As written (pa3-16-shore and its done scene) is for sat: the longer scene, and he asks you to tell someone he was here. For passed, play PA3_VARIANTS pa3-16-shore-passed in place of pa3-16-shore and drop pa3-16-shore-done; the check is the same. CARE: Quirrel’s going is told by the empty rock and the planted nail, never shown. The nail decor is given either way.

## PA3-17. The Grubs Go Home

*Hollow Knight (Team Cherry, 2017): the Grubfather’s reward* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-16, from Pixel’s cabinet in the lantern shed. · requires: PA3-16

**Cast:** Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own Clank from S21)

### Step 1: Take the twelfth grub home to the Grubfather.

Hint: Back to the cavern of egg-houses. The tram goes most of the way. · check: `deliver:pa3-grub:12`

#### <a id="pa3-17-cavern"></a>Scene `pa3-17-cavern`

_The cavern of egg-houses. Eleven of the little doorways have somebody in them now, looking out._  
_The Grubfather sees you and makes the kettle noise, very loudly._  
_You take the jar out of your coat. The twelfth grub wakes up, looks out, and sees its dad._  
_It finds the strength to wriggle out, after all, and flops onto him, and stays there._  
**Pixel** _(happy)_: That’s twelve. We said twelve. We did twelve.  
_Your Nubbin tries to climb on the Grubfather too. There’s room; there’s always room on him._  

**Choices**

- **Pat the Grubfather.**
    - He is still so soft that your arm goes in up to the elbow. He makes the kettle noise again, quietly.
- **Count the faces in the doorways.**
    - Twelve, with the one on his back; the other doorways are still empty. Someone else will come.

#### <a id="pa3-17-cavern-done"></a>Done `pa3-17-cavern-done`

_The Grubfather sighs a big contented sigh. He looks at the bench at the cavern’s mouth, then at you._  
**Pixel**: He wants you to sit down. You’ve been walking for an age. Go on. Sit.  

### Step 2: Rest on the bench for a bit.

Hint: Sit on the bench at the cavern’s mouth. Take as long as you like. · check: `sit:pa3-bench:grub-cavern`

#### <a id="pa3-17-bench"></a>Scene `pa3-17-bench`

_You sit on the bench, with your Nubbin on your knee. The Knight, after a moment, sits on the other end._  
_It hasn’t sat down once, this whole way. It sits like it’s trying it out._  
**Pixel**: It sat down. With us. I’ve got goosebumps. It’s a bench. I’ve got goosebumps about a bench.  
_Your Nubbin falls asleep, and you nearly do. Behind you, the cavern goes very, very quiet._  
_Suspiciously quiet._  
_Then a sound, like someone finishing a large bowl of soup. A small, contented gulp._  

#### <a id="pa3-17-bench-done"></a>Done `pa3-17-bench-done`

_You go back in._  

### Complete

#### <a id="pa3-17-complete"></a>Complete `pa3-17-complete`

_The Grubfather is lying on his back, very round, very happy. Every one of the doorways is empty._  
**Pixel** _(shock)_: Did he… did he EAT them?  
_He pats his tummy. From inside comes a happy, muffled wriggle: twelve wriggles._  
**Pixel** _(think)_: They’re fine. It’s on the box. It’s how they grow up. They go in grubs and come out grubberflies.  
**Pixel**: I mean. It’s a choice. As parenting goes. But it’s THEIR choice.  
_Pixel starts laughing, then can’t stop. You hear her chair scrape: she’s had to sit on the floor._  
_A small crunch comes through the speaker._  
**Pixel** _(shock)_: …I’ve sat on my biscuit.  
**Pixel**: It’s fine. It’s a choice. As biscuits go.  
**Pixel** _(happy)_: …Ruling: best ending to a fetch quest ever made. The empty jar’s yours. Keep it. Put a candle in it.  

#### <a id="pa3-17-complete-clank"></a>Variant `pa3-17-complete-clank`

_Variant of `pa3-17-complete`._

_The Grubfather is lying on his back, very round, very happy. Every one of the doorways is empty._  
**Pixel** _(shock)_: Did he… did he EAT them?  
_He pats his tummy. From inside comes a happy, muffled wriggle: twelve wriggles._  
**Pixel** _(think)_: They’re fine. It’s on the box. It’s how they grow up. They go in grubs and come out grubberflies.  
**Pixel**: I mean. It’s a choice. As parenting goes. But it’s THEIR choice.  
_Pixel starts laughing, then can’t stop. You hear her chair scrape: she’s had to sit on the floor._  
_A small crunch comes through the speaker._  
**Pixel** _(shock)_: …I’ve sat on my biscuit.  
**Pixel**: It’s fine. It’s a choice. As biscuits go.  
**Clank** _(happy)_: Announcement: the big one ate the small ones!  
**Pixel**: They’re fine, Clank. It’s how they grow up.  
**Clank** _(happy)_: Announcement: I am never growing up.  
**Pixel** _(happy)_: …Ruling: best ending to a fetch quest ever made. The empty jar’s yours. Keep it. Put a candle in it.  

**Rewards**

- Empty grub jar lantern (decor): The twelfth grub’s jar, with a candle in it now. The grub went home, and grew up, in its own way.

Sets on completion: `{"pa3-17":true}`

**Notes:** CLANK: if s21Done, play PA3_VARIANTS pa3-17-complete-clank instead of pa3-17-complete. CARE: the swallowing is joy, not horror. Show only a round, happy Grubfather on his back and twelve tiny wriggles under his skin; Pixel says plainly that they’re fine. The Knight sitting on the bench is its only sit in the whole cartridge: a two-frame sit-down, slightly awkward. Requires all twelve grub checks (they’re all on the quest chain, so they are always done by now).

## PA3-18. The Black Egg

*Hollow Knight (Team Cherry, 2017): the Black Egg Temple, the Hollow Knight and the Radiance* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hollow Kingdom (Pixel’s Arcade) · when: Any time after PA3-17, from Pixel’s cabinet in the lantern shed. · requires: PA3-17

**Cast:** Hornet (Hornet, protector of Hallownest (Hollow Knight (Team Cherry, 2017)); nothing from Silksong), Elderbug (Elderbug, the last townsfolk of Dirtmouth (Hollow Knight (Team Cherry, 2017)))

### Step 1: Go into the Black Egg Temple with the Knight.

Hint: The temple is in the Crossroads, where you started. All three seals are open now. · check: `visit:pa3-black-egg:temple`

#### <a id="pa3-18-temple"></a>Scene `pa3-18-temple`

_Back in the Crossroads, where you began, stands a temple shaped like a great black egg. The seals are gone._  
_Inside, at the bottom of a deep chamber, hangs a tall figure in chains. A horned mask, very like the Knight’s._  
_It is the Hollow Knight: the one from the statue, the one the king chose._  
_There’s a crack across its mask, and orange light leaking out of it, like a fever._  
**Pixel** _(sad)_: It’s been holding the light. All this time. In there. Since before Elderbug was old.  
_The Knight walks down and looks up at its sibling. Its sibling, slowly, looks down._  
_The Knight raises its nail and cuts the chains, one by one. They fall like slow rain._  

**Choices**

- **Hold your lantern up, so the Knight can see.**
    - You lift the lantern as high as it goes. It isn’t much, down here, but the Knight glances up at it once.
- **Hold your Nubbin close.**
    - You pick your Nubbin up. It doesn’t hide its face, but watches the Knight, and so do you.

#### <a id="pa3-18-temple-done"></a>Done `pa3-18-temple-done`

_The Hollow Knight stands, and the orange light flares up in it. It lifts its own nail, and they fight._  
_You stand at the top of the chamber with your lantern, and your Nubbin, and you don’t look away._  

### Step 2: Stay with the Knight until the end.

Hint: It isn’t your fight. Keep your lantern lit. That’s what you can do. · check: `watch:pa3-black-egg:end`

#### <a id="pa3-18-end"></a>Scene `pa3-18-end`

_The fight is long. The Hollow Knight is strong, and the light inside it is stronger._  
_Then a red cloak drops from the dark above, and a thread of silk whips round the Hollow Knight’s arms._  
**Hornet** _(angry)_: I said I would come.  
_Hornet pulls the thread tight, and the Hollow Knight is held. She looks up at you, once, and nods._  
_The Knight raises the Dream Nail, and touches its sibling, and goes into its dream._  
_You see it on the cabinet screen: a dream of blinding light, and in the middle of it, the light’s own shape._  
**Pixel** _(shock)_: That’s it. That’s the Radiance. That’s the thing that sang them all to sleep.  
_Behind the Knight, the dark rises like a tide coming in. It is thousands of small horned masks, all of them._  
_All the ones from the Abyss, who saw the lighthouse. They came._  
_The dark goes over the light softly, like water over a candle. And the light goes out._  
_Two small figures stand in the dark together: the Knight and its sibling. They turn, and walk home._  
_Into the dark they came from: not away, but home. The egg is gone, and only quiet is left._  

#### <a id="pa3-18-end-late"></a>Variant `pa3-18-end-late`

_Variant of `pa3-18-end`._

_The fight is long. The Hollow Knight is strong, and the light inside it is stronger._  
_The Knight is down on one knee. The Hollow Knight raises its nail._  
_Then a red cloak drops from the dark above, late, and a thread of silk whips round the Hollow Knight’s arms._  
**Hornet** _(angry)_: I promised myself. Not you.  
_She holds the thread tight. She doesn’t look at you, not once._  
_The Knight raises the Dream Nail, and touches its sibling, and goes into its dream._  
**Pixel** _(shock)_: That’s the Radiance. That’s the thing that sang them all to sleep.  
_Behind the Knight, the dark rises like a tide coming in. It is thousands of small horned masks, all of them._  
_The dark goes over the light softly, like water over a candle. And the light goes out._  
_Two small figures stand in the dark together: the Knight and its sibling. They turn, and walk home._  
_Into the dark they came from: not away, but home. The egg is gone, and only quiet is left._  

#### <a id="pa3-18-end-sealed"></a>Variant `pa3-18-end-sealed`

_Variant of `pa3-18-end`._

_The fight is long. The Hollow Knight is strong, and the light inside it is stronger._  
_Nobody comes. The Knight fights on alone, and wins, and its sibling falls still in the dark._  
_Then the Knight does a strange thing. It walks to the empty chains, and stands in them, and waits._  
_The orange light comes out of its sibling and goes into the Knight, quietly, like water finding a new jar._  
_The chains close, and the doors of the temple close. The seals come back, one, two, three._  
**Pixel** _(sad)_: It took its place. It’s holding the light now. So the kingdom stays as it is.  
**Pixel** _(sad)_: Safe. And still. The old way.  

#### <a id="pa3-18-end-done"></a>Done `pa3-18-end-done`

_Hornet stands alone in the empty chamber, with her needle, in the first quiet for an age._  
_She looks at the place where the egg was for a long time. Then she looks at you._  
**Hornet** _(soft)_: It’s over. Go home, traveller. And thank you. For the open hands.  

#### <a id="pa3-18-end-done-late"></a>Variant `pa3-18-end-done-late`

_Variant of `pa3-18-end-done`._

_Hornet stands alone in the empty chamber, with her needle, in the first quiet for an age._  
_She looks at the place where the egg was for a long time. Then she leaves, the other way, without a word._  
**Pixel** _(soft)_: She came anyway. Because she said she would, to herself. That’s a good reason. It’s maybe the best one.  

### Complete

#### <a id="pa3-18-complete"></a>Complete `pa3-18-complete`

_Up the well, into the rain. Elderbug is on his bench, and he stands up when he sees you._  
**Elderbug** _(happy)_: You came back up! Nobody comes back up. Oh, I’m so glad.  
**Elderbug**: Here. I carved this while I waited. For travellers. I’ve always had one ready, just in case.  
_He gives your Nubbin a tiny mask, pale, with two little horns. Your Nubbin puts it on at once._  
_It tilts its head at you. Exactly the way the Knight did._  
**Pixel** _(sad)_: Oh, that’s not fair. That’s not fair at all. I’m crying on the cabinet. It’s fine. It’s wipe-clean.  
**Pixel** _(happy)_: Cartridge done. Your name’s on the high-score plate. For the record: you never hit anything once.  

#### <a id="pa3-18-complete-sealed"></a>Variant `pa3-18-complete-sealed`

_Variant of `pa3-18-complete`._

_You stand outside the black egg in the Crossroads. Your Nubbin puts both hands flat on the shell, and listens._  
_Up in the city, in the rain, the statue still stands, and the plaque is still there. Somebody will read it._  
**Pixel** _(soft)_: …There’s a save from before the Abyss.  
**Pixel** _(soft)_: I’m not saying you have to. I’m just saying it’s there. The cartridge keeps it. Like the box said. Keep.  

**Choices**

- **Go back to before the Abyss.**
    - **Pixel**: Loading. Lighthouse switch is on the left. I’m just saying.
- **Leave it as it is, for now.**
    - **Pixel**: All right. It’ll keep. Come back up. Elderbug will want to see you.
    - Up the well, in the rain, Elderbug is on his bench. He stands when he sees you, and doesn’t ask.
    - **Elderbug**: You came back up. That’s the part I asked for.
    - He gives your Nubbin a tiny pale mask. It puts it on and tilts its head, the way the Knight did.
    - **Pixel**: He kept one ready. Just in case. People like him always do.

**Rewards**

- Pale horned mask (cosmetic): A little pale mask with two small horns, carved by Elderbug for travellers. For your Nubbin.
- High-score plate: The Hollow Kingdom (feature): Your name on the cabinet’s brass plate for this cartridge. It counts towards High Score Night.

Sets on completion: `{"pa3-18":true,"pa3-done":true}`

**Notes:** ENDINGS (pa3-ending, set by the sim when step 2 begins, from pa3-abyss and pa3-hornet):
  - home (abyss = waited, hornet = back): as written. pa3-18-end, pa3-18-end-done, pa3-18-complete.
  - late (abyss = waited, hornet = stood): play PA3_VARIANTS pa3-18-end-late in place of pa3-18-end, and pa3-18-end-done-late in place of pa3-18-end-done; pa3-18-complete as written.
  - sealed (abyss = hurried, either Hornet): play pa3-18-end-sealed in place of pa3-18-end and pa3-18-complete-sealed in place of pa3-18-end-done AND pa3-18-complete. Rewards are still given (one-time). Then offer the Abyss save (see PA3-14 notes): a cartridge choice, “Go back to before the Abyss”, which replays from PA3-14. If the player later reaches home or late, pa3-18-complete plays then (the mask is not given twice).
CARE: the siblings’ ending is a homecoming into the dark, not a death on screen. The Radiance is a shape of light, never a face in pain; it goes out like a candle. The sealed ending is sad and replayable, and the plaque stays.
