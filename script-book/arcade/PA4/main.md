# Pixel's Arcade, cartridge PA4: Mercy

## PA4-1. The Cabinet

*Undertale (Toby Fox, 2015): the title screen and the fall* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time once Pixel’s arcade cabinet runs in the lantern shed (after chapter 5).

### Step 1: Help Pixel get the heart cartridge running.

Hint: Look in the shoebox of cartridges by the cabinet; it’s the one with the red heart. · check: `inspect:pa4-cartridge`

#### <a id="pa4-01-shed"></a>Scene `pa4-01-shed`

_The lantern shed smells of sawdust and solder. Pixel’s cabinet stands in the corner, dented, humming to itself._  
**Pixel**: New one. Found it wedged behind the coin box, under what used to be a mouse nest.  
_She holds up a cartridge. The label is plain black, with a small red heart in the middle._  
**Pixel** _(think)_: No title. No picture on the back. Just the heart.  
_She blows into the slot, hard. A cloud of sawdust comes out, and something that might have been a seed._  
**Pixel**: That is not how you clean contacts. It is, however, how everyone cleans contacts.  
_Your Nubbin sniffs the cartridge, then pats the heart, gently, as if it might be sore._  
**Pixel**: Right. Player two is me. I’ve got the stick and the buttons. You two go in.  

**Choices**

- **What kind of game is it?**
    - **Pixel**: Don’t know. The board has fewer buttons than it should. I counted twice.
    - **Pixel**: Maybe it’s a quiet one.
- **Push it in. We’re ready.**
    - **Pixel**: Nobody’s ever ready. That’s what the first level is for.

#### <a id="pa4-01-shed-done"></a>Done `pa4-01-shed-done`

_The cartridge clicks home. The screen goes black, then shows one red heart, beating slowly._  
**Pixel**: Huh. It’s waiting for something.  

### Step 2: Fall into the game and find out where you’ve landed.

Hint: Touch the screen with your Nubbin beside you. · check: `explore:pa4-ruins:flowerbed`

#### <a id="pa4-01-fall"></a>Scene `pa4-01-fall`

_You touch the glass._  
_It’s warm. Then the floor of the shed isn’t there._  
_You fall through the dark for a long time, slowly, like a leaf. Your Nubbin holds on to your sleeve._  
_You land on something soft: a bed of golden flowers, in a pool of light from a hole far above._  
_Beside you, a child sits up and rubs their head. They wear a striped jumper, blue and pink._  
_The child looks at you, and at your Nubbin, for a long moment. They don’t say anything._  
**Pixel**: Can you hear me? The speaker works both ways, apparently. Good. That’s eerie, but good.  
**Pixel**: The child’s the hero. You’re not. You’re their company. I’ll keep the lights on.  
_The child holds out a hand to your Nubbin. Your Nubbin takes it at once._  
_On the screen, somewhere above you, a small red heart beats in a box. It belongs to the child._  

### Complete

#### <a id="pa4-01-complete"></a>Complete `pa4-01-complete`

_The child stands, brushes the petals off, and walks towards the only doorway. You follow._  
**Pixel**: Their heart’s on my screen. When anything happens, you two stand in the box with it.  
**Pixel** _(think)_: I’ve looked at the buttons. There’s ACT. There’s MERCY. That’s the lot.  
**Pixel** _(happy)_: Somebody made a game with no way to hit anyone. I want to shake their hand.  

#### <a id="pa4-01-vent-warm"></a>Variant `pa4-01-vent-warm`

_Variant within PA4-1; it has no single parent scene._

_From the vent under the cabinet comes a dry little hiss. Two pale eyes, one ear torn, catch the glow of the screen._  
**Pixel** _(soft)_: Wisp. He’s come in out of the cold. The cabinet’s warm underneath. Let him watch.  

#### <a id="pa4-01-vent-quiet"></a>Variant `pa4-01-vent-quiet`

_Variant within PA4-1; it has no single parent scene._

_The vent under the cabinet is quiet. The fan inside turns over, and that’s all._  

#### <a id="pa4-01-clank"></a>Variant `pa4-01-clank`

_Variant within PA4-1; it has no single parent scene._

_Clank is sitting on top of the cabinet with his legs over the edge, like a gargoyle that’s been told to cheer up._  
_He leans down to look at the heart on the label, and his eye-light goes a little pink._  

**Rewards**


Sets on completion: `{"pa4-01":true}`

**Notes:** OPENING: the cartridge plays in Pixel’s cabinet; its progress lives in the cartridge’s own save. WISP (reads wisp, Grove, read-only): after pa4-01-shed’s choice, before pa4-01-shed-done, play ARCADE_PA4_VARIANTS pa4-01-vent-warm if wisp is spared or sable; pa4-01-vent-quiet if driven or unset. CLANK (reads s21Done): if set, play ARCADE_PA4_VARIANTS pa4-01-clank straight after pa4-01-shed. STAGING: from here on Pixel speaks from the cabinet speaker, drawn as a small portrait in a frame of scan lines. The fight box UI has exactly two buttons, ACT and MERCY. Never draw a FIGHT button, even greyed out. No music from the source, ever, not even as a hum: use our own soft ambient sound.

## PA4-2. The Flower

*Undertale (Toby Fox, 2015): Flowey and Toriel, the first room* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-1, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-1

**Cast:** Flowey (Flowey the Flower (Undertale)), Toriel (Toriel, keeper of the Ruins (Undertale))

### Step 1: Meet the smiling flower in the next room.

Hint: Follow the child into the dark room; the flower is in the middle of it. · check: `talk:pa4-flowey`

#### <a id="pa4-02-flower"></a>Scene `pa4-02-flower`

_In the next room a single golden flower grows out of the stone. It has a face, and the face is smiling._  
**Flowey** _(happy)_: Well, hello! New here, aren’t you? All three of you. And one of you is very small and blue.  
**Flowey**: You must be so confused. Somebody ought to teach you how things work down here. Lucky me!  
_A box closes round the child’s red heart. You and your Nubbin are standing in it too._  
**Flowey** _(happy)_: Down here we share love through little white friendliness pellets. Catch as many as you can!  
_Small white seeds spin in the air around him. Your Nubbin’s crown goes flat against its head._  
**Pixel** _(think)_: I don’t like those. My screen doesn’t like those. Don’t touch them.  
**Flowey** _(angry)_: In this world, it’s kill or be killed.  
_His smile is a different smile now. The seeds close in like a ring of teeth._  
_A ball of fire comes out of the dark and knocks the flower clean out of the ground. He’s gone, and the seeds go with him._  
**Toriel** _(angry)_: Shoo! Back into the dirt with you, you nasty little weed.  
_A tall woman with a goat’s soft face and long ears steps out of the shadow, in a purple robe._  
**Toriel** _(soft)_: There, now. You are all quite safe. My name is Toriel, and these old Ruins are mine to look after.  
_She takes the child’s hand without asking, the way you’d take a hand at a road._  

#### <a id="pa4-02-flower-done"></a>Done `pa4-02-flower-done`

_Your Nubbin keeps looking back at the hole in the ground where the flower was._  
**Pixel** _(think)_: That flower’s line came up in red on my side. Some part of this cartridge is very sure of itself.  

### Step 2: Decide what to do about the flower.

Hint: The candy bowl is just inside the next room. Your Nubbin is pulling back towards the flowerbed. · check: `choose:pa4-candy:flowerbed`

#### <a id="pa4-02-candy"></a>Scene `pa4-02-candy`

_In the next room, by the door, a bowl of wrapped sweets sits on a little stand. A sign says TAKE ONE._  
**Toriel**: Monster candy. It tastes of… well, of liquorice that isn’t liquorice. Have one, all of you.  
_The child takes exactly one. Your Nubbin takes one too, and then, very slowly, doesn’t eat it._  
_It looks back through the doorway, towards the bare patch of earth where the flower was._  
**Pixel** _(soft)_: It wants to go back. To the thing that just tried to have us. Of course it does.  
**Pixel**: Your Nubbin, your call.  

**Choices**

- **Leave him the candy, on the spot where he was.** — sets `{"pa4-candy":"left"}`
    - Your Nubbin runs back alone and sets the sweet down on the earth, wrapper and all, very neatly.
    - Nothing comes up out of the ground. Your Nubbin trots back anyway, looking pleased.
    - **Pixel**: For the record, that’s a sweet for something that called us food. I’d have done the same.
- **Leave him be. He made his feelings clear.** — sets `{"pa4-candy":"be"}`
    - Your Nubbin looks at the doorway a while longer. Then it eats the sweet, slowly, and comes on.
    - **Pixel**: Fair. Some things want leaving alone. Doesn’t mean they want leaving.

### Complete

#### <a id="pa4-02-complete"></a>Complete `pa4-02-complete`

**Toriel**: Come along. These Ruins are full of puzzles. I will teach you, and you will be cleverer than they are.  
_She walks ahead with the child’s hand in hers. The purple walls are covered in old writing nobody reads._  
**Pixel** _(think)_: Note for later: the flower knew about saving. I don’t know how. I don’t like it.  

**Rewards**


Sets on completion: `{"pa4-02":true}`

**Learning Grove swaps**

- `pa4-02-flower#7` → Down here, you either get the other one first, or they get you!

**Notes:** SIGNATURE CHOICE: pa4-candy = left | be (pa4-02-candy). It pays off in PA4-17 (pa4-17-candy), PA4-18 (pa4-18-candy) and the last frame of PA4-19 (pa4-19-flower-turns | pa4-19-flower-still). LIFTED TEXT: pa4-02-flower#7 is the outline’s first quote (Flowey, Undertale, © Toby Fox), used once; the childLine replaces it. CARE: the pellets never touch anyone; Flowey’s second face is a cartoon grin with no teeth shown in detail; Toriel’s fireball knocks him away with a puff of petals, nothing more.

## PA4-3. The Ruins

*Undertale (Toby Fox, 2015): the Ruins, the training dummy and Napstablook* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-2, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-2

**Cast:** Toriel (Toriel, keeper of the Ruins (Undertale)), Napstablook (Napstablook, the shy ghost (Undertale))

### Step 1: Cross the spike floor with Toriel.

Hint: Hold the child’s other hand and step only where Toriel steps. · check: `puzzle:pa4-ruins:spikes`

#### <a id="pa4-03-spikes"></a>Scene `pa4-03-spikes`

_The Ruins are full of switches, some labelled, some lying. Toriel explains each one as if it were a pet._  
**Toriel**: This switch is honest. That one tells fibs. You must never pull a switch just because it asks nicely.  
_A floor of spikes lies across the next room. The safe path through it is a puzzle with no clues at all._  
**Toriel** _(soft)_: This one is a little advanced for a first day. Take my hand.  
_She holds the child’s hand._  
_The child holds yours. Your Nubbin holds the hem of your coat._  
**Pixel**: Four of you in a line. Like ducks. Very nervous ducks.  
_Toriel walks the twisting path without looking down once. She has done this many times, for no one._  

#### <a id="pa4-03-spikes-done"></a>Done `pa4-03-spikes-done`

**Toriel** _(happy)_: There. Was that so bad? Puzzles are only frightening until you have a friend on the other end.  
_Your Nubbin looks back at the spikes and pulls a face at them._  

### Step 2: Practise on the training dummy, Toriel’s way.

Hint: Stand in the box with the child and press ACT, then Talk. · check: `minigame:clear:pa4-dummy`

#### <a id="pa4-03-dummy"></a>Scene `pa4-03-dummy`

_A cloth dummy stands in the middle of a room. Its stitched face gives nothing away._  
**Toriel**: Monsters may try to fight you. Practise on this one. Do not worry: it is only cloth.  
_The box closes round the child’s heart, and round you and your Nubbin. Two buttons light up._  
**Pixel**: ACT, or MERCY. There’s no third one. I’ve checked under the board.  
**Toriel** _(soft)_: When someone stands in your way, you can talk to them. Try it. Say anything kind.  
_The child looks at the dummy._  
_You look at the dummy. The dummy looks at a point just past all of you._  

**Choices**

- **Ask the dummy about its day.**
    - The dummy says nothing. It seems, somehow, glad to have been asked.
    - **Toriel**: Splendid! That is the whole lesson. Most people only want to be asked.
- **Tell the dummy you like its stitching.**
    - The dummy says nothing, very warmly.
    - **Toriel**: Splendid! You see? Talking is braver than it looks, and cheaper than bandages.

### Step 3: Cheer up the ghost lying across the path.

Hint: Talk to the ghost, or lie down beside them like your Nubbin does. · check: `sit:pa4-blook`

#### <a id="pa4-03-blook"></a>Scene `pa4-03-blook`

_Something white lies across the path, pale and see-through, like a sheet that has given up._  
**Napstablook**: z… z… z…  
_It isn’t snoring. It’s saying the letter z out loud, very quietly, hoping you’ll go round._  
**Pixel** _(sad)_: It’s pretending to sleep. By saying sleep. That is the saddest thing I’ve ever seen on a screen.  
_A box closes round the child’s heart. The ghost begins to cry, and the tears fall upwards, slowly, and miss you._  
**Napstablook** _(sad)_: oh… sorry… i only came down to the ruins because there’s never anybody here…  
_Your Nubbin walks over, lies flat on the cold floor next to the ghost, and looks up at the ceiling too._  
**Napstablook** _(shock)_: oh. you’re… lying here. with me.  

**Choices**

- **Lie down on the floor next to them as well.** — sets `{"pa4-blook":"lie"}`
    - You lie down.
    - The child lies down. Four of you, flat on your backs, looking at a purple ceiling.
    - **Napstablook**: …this is nice. i usually do this on my own. it’s nicer with people.
    - Nobody says anything for a while. Nobody needs to.
- **Tell them a terrible joke.** — sets `{"pa4-blook":"joke"}`
    - **You**: What do you call a ghost with no friends? Nothing yet. But give it a minute.
    - Silence. Then a very small, very wobbly sound, which is a ghost trying not to laugh.
    - **Napstablook**: …that was awful. i liked it. can i keep it?

#### <a id="pa4-03-blook-done"></a>Done `pa4-03-blook-done`

**Napstablook** _(soft)_: i came here so nobody would see me be sad… and then everybody did… and it was fine…  
**Napstablook**: i’ll float along now. thanks for lying in the way with me.  
_The ghost fades out of the path, slowly, and you hear a very quiet thank you from the wall._  

### Complete

#### <a id="pa4-03-complete"></a>Complete `pa4-03-complete`

**Toriel** _(sad)_: A ghost! Oh, the poor dear. That one has been lying there on and off for a year.  
**Toriel**: You did very well. You did not push past them. Pushing past is the easy thing.  
_Your Nubbin is still looking back at the spot where the ghost was, its crown tilted._  
**Pixel** _(happy)_: One friend. I’m keeping a list on the back of a receipt. Don’t tell anyone.  

**Rewards**


Sets on completion: `{"pa4-03":true}`

**Notes:** FRIEND FLAG: pa4-blook = lie | joke (pa4-03-blook). It picks Napstablook’s line in PA4-17 (pa4-17-blook-lie | -joke) and PA4-19 (pa4-19-blook-lie | -joke). Napstablook speaks in lower case on purpose (their voice; our own words). The upward tears never touch the box. The dummy fight cannot be lost: any ACT or MERCY ends it.

## PA4-4. Toriel’s House

*Undertale (Toby Fox, 2015): Toriel’s home in the Ruins* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-3, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-3

**Cast:** Toriel (Toriel, keeper of the Ruins (Undertale))

### Step 1: Settle in at Toriel’s house: pie, a bed and a book.

Hint: Sit by the fire while Toriel reads; your Nubbin will fall asleep first. · check: `sit:pa4-toriel:fireside`

#### <a id="pa4-04-house"></a>Scene `pa4-04-house`

_At the end of the Ruins stands a small house under a black tree with no leaves. The windows are lit._  
**Toriel** _(happy)_: I baked while you were busy with the switches. Butterscotch and cinnamon. A pie for a first day.  
_There is a little bedroom with a little bed, a box of shoes in every size and a toy box that has been dusted._  
**Toriel** _(soft)_: I made it ready a long time ago. It is yours now. And there is a blanket for the small blue one.  
_By the fire stands a big reading chair. Toriel takes a book from the shelf: A Small Book of Large Snail Facts._  
**Toriel**: Did you know that a snail can sleep for three years? I find that very relaxing to know.  
**Toriel**: And they have thousands of teeth. Tiny ones. Do not tell them I said so.  
_Your Nubbin falls asleep against the child’s arm before snail fact four._  
**Pixel** _(sad)_: The pie looks good. The pixels look good. I hate that I can’t smell it.  

**Choices**

- **Ask for another snail fact.**
    - **Toriel**: Oh, gladly! Snails can climb straight up a wall, upside down, without any fuss at all.
    - The child laughs, without a sound. Toriel sees it, and looks happier than any snail fact.
- **Ask for more pie.**
    - **Toriel**: There is always more pie. That is the first rule of this house.
    - She cuts a slice for your sleeping Nubbin too, and sets it by its nose, for when it wakes.

#### <a id="pa4-04-house-done"></a>Done `pa4-04-house-done`

_The fire ticks. The book closes on a snail-shaped bookmark._  
**Pixel** _(think)_: This is the safest place I’ve seen in any game. I’m not sure that’s good news.  

### Step 2: Follow Toriel downstairs after the child asks how to get home.

Hint: Take the stairs past the front door; the corridor goes a long way. · check: `walk:pa4-toriel:basement`

#### <a id="pa4-04-home"></a>Scene `pa4-04-home`

_In the morning the child goes and stands by Toriel’s chair. They tug her sleeve, and point up._  
_Then they point at you, and at your Nubbin, and up again._  
_Home. How do we get home?_  
**Toriel**: Home? But… there was a very interesting snail on the step this morning. Shall I tell you about it?  
_The child doesn’t move. Toriel closes her book._  
**Toriel** _(sad)_: Stay by the fire, little ones. I have a small job to see to downstairs.  
_She goes down the stairs by the front door, very calm, not quick at all._  
**Pixel** _(think)_: Something’s wrong. Her walk changed. I can see it in the animation.  
_You go after her, with the child and your Nubbin. The corridor below is long and purple and cold._  
**Toriel**: This hall ends at the only way out of the Ruins. I am going to make sure nobody can use it.  
**Toriel** _(sad)_: They all leave. Every one who ever fell. And none of them ever… I will not see it again.  

#### <a id="pa4-04-home-done"></a>Done `pa4-04-home-done`

**Toriel** _(sad)_: Your room is ready. The pie is warm. Please. Let this be enough.  
_Nobody goes upstairs._  

### Complete

#### <a id="pa4-04-complete"></a>Complete `pa4-04-complete`

_At the end of the corridor is a great door with an emblem of wings on it. Toriel stands in front of it._  
**Toriel**: Then show me. Show me you could last one day beyond this door, and I will stand aside.  
**Pixel** _(sad)_: She’s going to fight. She doesn’t want to. You can see both at once. Hold on.  

**Rewards**


Sets on completion: `{"pa4-04":true}`

**Notes:** STAGING: warm light in the house, cooler purple in the corridor. Toriel’s fear is never explained here; PA4-13 tells it. Snail facts are true and harmless.

## PA4-5. The Door

*Undertale (Toby Fox, 2015): Toriel’s fight and farewell* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-4, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-4

**Cast:** Toriel (Toriel, keeper of the Ruins (Undertale))

### Step 1: Spare Toriel until she understands.

Hint: Press MERCY, and keep pressing it. The fire always curls away from the child. · check: `minigame:mercy:pa4-toriel`

#### <a id="pa4-05-fight"></a>Scene `pa4-05-fight`

_The box closes round the child’s heart. You and your Nubbin stand in it, close._  
_Toriel lifts her hands and fire comes, little white-hot leaves of it, drifting. They curl away before they reach you._  
**Pixel** _(think)_: She’s missing on purpose. Every shot bends off. She’s not trying to hit. She’s trying to scare.  
_The child presses MERCY._  
_The fire comes again. The child presses MERCY._  
**Toriel** _(angry)_: Lift your hands! Do something! Do not just stand there being kind at me!  
_Your Nubbin sits down in the middle of the box. It looks up at her and doesn’t move at all._  

**Choices**

- **MERCY. Again.**
    - The fire flickers. It gets smaller every time, until it’s barely a candle.
    - **Toriel**: Why do you keep pressing that? It is not a plan. It is not a plan at all…
- **ACT: tell her you’ll be careful out there.**
    - **You**: We’ll look after each other. We will. We promise.
    - The fire stops in the air, and goes out, like a held breath let go.

#### <a id="pa4-05-fight-done"></a>Done `pa4-05-fight-done`

**Toriel** _(sad)_: You will not even try to win. You are making this very hard for an old woman.  
_The child presses MERCY one more time._  
**Toriel** _(sad)_: All this fire, and I cannot even frighten one small person into staying safe.  

### Step 2: Say goodbye to Toriel at the door.

Hint: Stay with the child while Toriel speaks; walk on when she has gone. · check: `walk:pa4-ruins:corridor`

#### <a id="pa4-05-goodbye"></a>Scene `pa4-05-goodbye`

_Toriel kneels and takes the child into a hug. She holds them a long time._  
**Toriel**: A house is a poor thing to keep someone in. I think I have known that for a long time.  
**Toriel** _(soft)_: Eat properly, all of you. Wear something warm. Be kind to snails.  
**Toriel** _(sad)_: Now go, before I change my mind. And do not come back this way. It would be too hard, the second time.  
_She lets go, turns, and walks back up the long corridor. She does not look round once._  
_Your Nubbin looks round the whole way. Every few steps it stops, and looks back, and has to be waited for._  
**Pixel** _(sad)_: I’m fine. There’s dust in the cabinet. It’s an old cabinet.  

### Complete

#### <a id="pa4-05-complete"></a>Complete `pa4-05-complete`

_The great door opens on cold air and a grey light. Somewhere ahead, snow is falling under the mountain._  
_There is a small golden flower in the doorway, which wasn’t there a moment ago. Then it isn’t there again._  
**Pixel** _(shock)_: Did you see that? I saw that.  
_The child takes your Nubbin’s hand again, and goes on._  

**Rewards**


Sets on completion: `{"pa4-05":true}`

**Notes:** FIGHT: the ACT/MERCY minigame. Toriel’s fire is white leaves of flame that visibly curl away; the child’s heart never loses anything. The fight ends after any mix of six MERCY or ACT presses. CARE: never show the child hurt. Flowey’s glimpse in the complete scene is one frame of a cartoon flower, no words.

## PA4-6. Snowdin Forest

*Undertale (Toby Fox, 2015): Snowdin Forest, Sans, Papyrus and the dogs* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-5, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-5

**Cast:** Sans (Sans the skeleton (Undertale)), Papyrus (Papyrus the skeleton (Undertale))

### Step 1: Meet the short skeleton on the forest path.

Hint: Walk on through the snow until someone follows you; then turn round and shake hands. · check: `talk:pa4-sans`

#### <a id="pa4-06-sans"></a>Scene `pa4-06-sans`

_Snow, deep and blue, and tall dark pines. A branch cracks behind you, much too loud._  
_Footsteps follow you to a little wooden bridge with a gate across it, built too wide to stop anyone._  
_A short skeleton in a blue hoodie and pink slippers holds out his hand to the child._  
_The child shakes it._  
_It makes a long, rude noise. There’s a whoopee cushion in his palm._  
**Sans** _(happy)_: heh. gets ’em every time. the old cushion-in-the-hand. it never gets old. it’s very old.  
**Sans**: you’re a human, right? and you brought a… what’s that. a dumpling with a crown?  
_Your Nubbin offers its hand to be shaken._  
_Sans shakes it, solemnly. No noise this time._  
**Sans**: nice. firm grip. anyway, my brother’s a human-catcher. he’s not great at it. play along, yeah?  
**Pixel** _(happy)_: I like him. I don’t trust his slippers, but I like him.  

**Choices**

- **Ask him if he’s got any more jokes.**
    - **Sans**: only skele-ton of ’em. sorry. that one came free with the cushion.
- **Ask if he’s cold in slippers.**
    - **Sans**: nah. nothing gets through to me. i’ve got no body to get through to.

#### <a id="pa4-06-sans-done"></a>Done `pa4-06-sans-done`

**Sans**: quick, hide behind that lamp. it’s shaped like you. sort of. nobody’ll look twice.  
_The lamp is not shaped like any of you. You all hide behind it anyway._  

### Step 2: Get through Papyrus’s puzzles in the snow.

Hint: Every puzzle has a way through; Papyrus will explain it if you look confused enough. · check: `puzzle:pa4-papyrus:gauntlet`

#### <a id="pa4-06-gauntlet"></a>Scene `pa4-06-gauntlet`

_A tall skeleton in a home-made battle costume strikes a pose on the bridge, with his red scarf flying._  
**Papyrus** _(happy)_: A HUMAN! AT LAST! I, PAPYRUS, WILL CAPTURE YOU AND JOIN THE ROYAL GUARD! EVERYONE WILL ADMIRE ME!  
**Papyrus** _(happy)_: NYEH HEH HEH!  
_He has built puzzles all the way through the forest._  
_Some are very clever. One is a word search with no words._  
**Papyrus** _(think)_: THIS ONE IS AN ELECTRIC MAZE! IT IS INVISIBLE! THE ORB IS FOR… OH. I SHOULD BE HOLDING THE ORB.  
_At the last bridge he unveils his most dangerous trap: cannons, spears, fire and a dog on a rope, all hanging over the gap._  
**Papyrus**: BEHOLD! WHEN I SAY GO, IT WILL ALL ACTIVATE AT ONCE! THEN YOU WILL SEE!  
_He doesn’t say go. He looks at the child, and at your Nubbin, small and blue on the bridge._  
**Papyrus** _(soft)_: …ON SECOND THOUGHT, THIS TRAP IS MUCH TOO DANGEROUS. I AM PUTTING IT AWAY. FOR NOW. ON PRINCIPLE.  
_The whole thing winches up out of sight. The dog on the rope looks relieved._  

#### <a id="pa4-06-gauntlet-done"></a>Done `pa4-06-gauntlet-done`

**Pixel** _(happy)_: He switched off his own trap because you might get hurt. He’s a terrible villain. He’s my favourite.  

### Step 3: Win over the guard dogs of Snowdin.

Hint: In the box, press ACT and pet. Then keep petting. · check: `minigame:clear:pa4-dogs`

#### <a id="pa4-06-dogs"></a>Scene `pa4-06-dogs`

_Snowdin is guarded by dogs in armour. They can smell a human from a long way off, and they love being petted._  
_A little white dog in a helmet comes up with a sword._  
_The box closes. The child pets it._  
_Its neck gets longer._  
_The child pets it again. Its neck gets longer still, up past the trees._  
**Pixel** _(shock)_: Is that… is that in the rules? Keep going. I need to know how high this goes.  
_Your Nubbin climbs on your shoulders to reach. The dog’s head is now somewhere in the clouds, wagging._  
_Two hooded dogs sniff your Nubbin, puzzled, and then decide it is a very good pup. It is petted thoroughly._  

**Choices**

- **Keep petting. Never stop.**
    - The neck goes on past the top of the screen.
    - Pixel scrolls up to follow it. It goes on.
    - **Pixel**: I’ve stopped scrolling. Some things should stay a mystery.
- **Throw a stick instead.**
    - Every dog in Snowdin forgets every human in the world and runs after the stick.
    - Your Nubbin goes too, and comes back with it, proud, before any of them.

### Complete

#### <a id="pa4-06-complete"></a>Complete `pa4-06-complete`

_Snowdin town: warm windows, a shop, an inn, a tree with presents under it for nobody in particular._  
_Everyone wants to meet your Nubbin._  
_A bunny shopkeeper asks if it’s from out of town. It’s from very out of town._  
**Sans**: popular, your little guy. most monsters down here have never seen a monster that shape.  
**Pixel** _(happy)_: It’s a monster here. Fine. It’s a monster with fans.  

**Rewards**


Sets on completion: `{"pa4-06":true}`

**Learning Grove swaps**

- `pa4-06-gauntlet#2` → HA HA HAAA! WHAT A TRIUMPHANT DAY FOR ME!

**Notes:** LIFTED TEXT: pa4-06-gauntlet#2 is Papyrus’s laugh, the outline’s second quote (Undertale, © Toby Fox), counted as one quote with its use in pa4-07-capture#2; the childLine replaces it. Papyrus speaks in capitals on purpose (his voice; our own words). Sans in lower case. The puzzles and the trap are our own versions; nothing is named after the source’s puzzles. The dog-petting is the ACT/MERCY minigame and cannot be lost.

## PA4-7. Papyrus

*Undertale (Toby Fox, 2015): the fight with Papyrus and the date* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-6, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-6

**Cast:** Papyrus (Papyrus the skeleton (Undertale)), Sans (Sans the skeleton (Undertale))

### Step 1: Spare Papyrus when he finally tries to capture the child.

Hint: Press MERCY every turn. His bones are slow; you can step over every one. · check: `minigame:mercy:pa4-papyrus`

#### <a id="pa4-07-capture"></a>Scene `pa4-07-capture`

_At the edge of Snowdin the snow is thick and the mist is thicker. Papyrus is waiting in it, very still, for effect._  
**Papyrus**: HUMAN! THE MOMENT HAS COME! I MUST CAPTURE YOU! FOR MY DREAMS! AND ALSO FOR FAME!  
**Papyrus** _(happy)_: NYEH HEH HEH!  
_The box closes._  
_Little white bones come sliding along the ground at walking pace. You all step over them._  
_One bone is so slow that your Nubbin sits on it and rides it to the other side._  
**Papyrus** _(shock)_: YOU ARE NOT EVEN TRYING TO FIGHT! THAT IS VERY DIFFICULT TO CAPTURE!  
**Pixel** _(think)_: MERCY. Every turn. He’s hoping you’ll make it easy for him not to win.  
_The child presses MERCY. Papyrus throws one enormous bone, with a tiny dog sitting on it, eating it._  
**Papyrus** _(sad)_: …WELL. THAT DOG HAS RUINED MY BIG FINISH.  

**Choices**

- **MERCY.**
    - **Papyrus**: YOU DO NOT WANT TO FIGHT? NOT EVEN A LITTLE? THEN I SUPPOSE I CANNOT WIN. OR LOSE. HMM.
- **ACT: tell him he’d make a great Royal Guard.**
    - **Papyrus**: YOU THINK SO? OF COURSE YOU DO. EVERYONE THINKS SO. EXCEPT THE ROYAL GUARD.

#### <a id="pa4-07-capture-done"></a>Done `pa4-07-capture-done`

**Papyrus** _(happy)_: I HAVE DECIDED. WE WILL NOT BE ENEMIES. WE WILL BE… FRIENDS! IT IS FAR MORE EFFICIENT!  
_He shakes the child’s hand, then yours, then your Nubbin’s, then the child’s again in case it didn’t count._  

### Step 2: Go to Papyrus’s house for the “date”.

Hint: Papyrus’s house is the one with the flag and the doghouse. Say something nice when he asks. · check: `visit:pa4-papyrus:house`

#### <a id="pa4-07-date"></a>Scene `pa4-07-date`

**Papyrus**: NOW, HUMAN. I HAVE READ ABOUT THIS. WHEN TWO PEOPLE BECOME FRIENDS, ONE OF THEM ASKS THE OTHER ON A DATE.  
**Papyrus**: I AM ASKING. YOU MAY BRING THE SMALL BLUE ONE AND THE TALL ONE. IT WILL BE A GROUP DATE. A VERY GOOD ONE.  
_The house is tidy except for one sock on the floor, which has notes stuck to it, asking Sans to pick it up._  
_Papyrus puts on his best clothes, which is a T-shirt that says COOL DUDE in bubble letters._  
_He flexes._  
_He flexes again. He stops flexing, a little out of breath._  
**Papyrus**: FOR OUR DINNER, I HAVE MADE MY SPECIALITY: SPAGHETTI! I MADE IT YESTERDAY! IT IS STILL VERY GOOD!  
_Your Nubbin is given the best chair, with a cushion on it, and a napkin tucked in round its neck._  
**Papyrus** _(happy)_: GUEST OF HONOUR! BECAUSE YOU ARE THE SMALLEST AND BLUEST.  
_The spaghetti is stuck together in one solid lump. Your Nubbin eats it anyway, with great dignity._  
**Papyrus** _(think)_: WELL? WHAT DO YOU THINK? OF ME? OF THIS? OF EVERYTHING? BE HONEST. BUT ALSO NICE.  

**Choices**

- **Tell him his puzzles were the best part of your day.** — sets `{"pa4-papyrus":"puzzles"}`
    - **Papyrus**: THE BEST PART? EVEN THE ONE WITH NO WORDS IN IT? I KNEW IT! I KNEW IT WAS AVANT-GARDE!
- **Tell him it’s the best spaghetti you’ve ever had.** — sets `{"pa4-papyrus":"pasta"}`
    - **Papyrus**: IT IS ONLY THE BEST SO FAR! WAIT UNTIL I AM TAUGHT BY A PROFESSIONAL! IT WILL BE TERRIFYING!

#### <a id="pa4-07-date-done"></a>Done `pa4-07-date-done`

**Papyrus** _(soft)_: I HAVE THOUGHT ABOUT IT, AND I LIKE YOU ALL VERY MUCH. AS FRIENDS. THE BEST KIND OF LIKING.  
_The child nods, very seriously. That settles it._  

### Complete

#### <a id="pa4-07-complete"></a>Complete `pa4-07-complete`

**Papyrus** _(happy)_: IF YOU EVER NEED ANYTHING, CALL ME. HERE. I HAVE WRITTEN MY NUMBER ON A BONE.  
**Sans** _(soft)_: he’s been practising that date for two years. thanks for being his first.  
_Your Nubbin keeps its napkin on all the way out of Snowdin._  
**Pixel** _(happy)_: Two friends on the receipt. Three if you count the dog on the bone. I’m counting the dog.  

**Rewards**


Sets on completion: `{"pa4-07":true}`

**Learning Grove swaps**

- `pa4-07-capture#2` → HA HA HAAA! PREPARE TO BE CAPTURED, VERY POLITELY!

**Notes:** FRIEND FLAG: pa4-papyrus = puzzles | pasta (pa4-07-date). It picks Papyrus’s line in PA4-17 and PA4-19. LIFTED TEXT: pa4-07-capture#2, Papyrus’s laugh (counted with pa4-06-gauntlet#2 as one quote); childLine given. CARE: the “date” is pure friendship, played for laughs, and says so. The bones are slow and soft-edged.

## PA4-8. Waterfall

*Undertale (Toby Fox, 2015): Waterfall, the echo flowers, the wishing room and Monster Kid* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-7, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-7

**Cast:** Monster Kid (Monster Kid (Undertale)), Echo flower (The echo flowers of Waterfall (Undertale))

### Step 1: Walk through Waterfall and listen to the echo flowers.

Hint: Stand by each blue flower; it repeats the last thing said near it. · check: `explore:pa4-waterfall:echo-flowers`

#### <a id="pa4-08-echo"></a>Scene `pa4-08-echo`

_Blue grass, dark water and the sound of falling water everywhere, even where you can’t see any._  
_Tall blue flowers grow by the path. When you pass, one of them speaks in a voice that isn’t yours._  
**Echo flower** _(soft)_: …I hope my brother likes the scarf. I knitted it backwards…  
**Pixel** _(think)_: Echo flowers. They repeat the last thing said near them. Even years ago. Even if nobody’s listening.  
_A young monster runs up, yellow and striped, with no arms and an enormous grin._  
**Monster Kid** _(happy)_: Yo! Are you going to see Undyne? Everyone wants to see Undyne! She’s the coolest! Can I come?  
_He doesn’t wait for an answer. He falls over, gets up and follows you everywhere after that._  
**Monster Kid**: Is that your monster? What’s it do? Can it do a flip? I can’t do a flip. I’ve got no arms. I’ve tried.  
_Your Nubbin tries a flip, for him._  
_It lands on its bottom. He thinks it’s the best flip he has ever seen._  

**Choices**

- **Say something kind into an echo flower.**
    - **You**: Whoever finds this: you’re doing better than you think.
    - **Echo flower**: …you’re doing better than you think…
    - It will say that to the next person who passes. And the next.
- **Just listen to them all.**
    - **Echo flower**: …don’t forget to water the tomatoes…
    - **Echo flower**: …I’m not scared. I’m not. I’m only a little bit scared…

### Step 2: Find the room where monsters made wishes on stones.

Hint: Go up the side passage where the ceiling glitters. · check: `visit:pa4-waterfall:wishing-room`

#### <a id="pa4-08-wish"></a>Scene `pa4-08-wish`

_A wide cave. Its ceiling is full of small shining stones, scattered like a night sky._  
_A sign says that long ago, monsters came here to wish, because under the mountain they couldn’t see the stars._  
_They wished on the stones instead._  
_They knew they weren’t stars. It didn’t stop anybody._  
**Monster Kid**: My mum says if you whisper it, it counts double. I don’t know if that’s true. I always whisper anyway.  
_An echo flower grows under the brightest stone. Your Nubbin goes up to it and leans in close._  
_It doesn’t speak._  
_Nubbins don’t. But it makes a tiny sound, a sort of hum, very close to the petals._  

**Choices**

- **Wonder what it wished for, and let it keep it.**
    - The flower plays the hum back, very quietly.
    - You still don’t know what it means. That’s fine.
    - **Pixel**: Wishes don’t work if you tell. It knows the rules. Good Nubbin.
- **Whisper a wish of your own beside it.**
    - You lean in and whisper. The flower plays back your wish and the Nubbin’s hum, together.
    - The child closes their eyes and wishes too, without a sound.

#### <a id="pa4-08-wish-done"></a>Done `pa4-08-wish-done`

**Monster Kid** _(happy)_: Yo, that was really nice. I wished for arms. Every time. One day it’s gonna work.  

### Complete

#### <a id="pa4-08-complete"></a>Complete `pa4-08-complete`

_Further on, the grass is tall and dark. Something in armour moves through it, slow and heavy._  
**Monster Kid** _(happy)_: That’s her. That’s Undyne. She’s hunting a human. Isn’t that the coolest?  
_The child goes very still._  
_Your Nubbin goes very still. Monster Kid does not notice either._  
**Pixel** _(shock)_: Stay in the grass. Don’t breathe loud. I’m not breathing at all.  

**Rewards**


Sets on completion: `{"pa4-08":true}`

**Notes:** STAGING: Waterfall is blue and dim with sparkle in the ceiling. The echo-flower lines are all our own. The wishing stones are a quiet moment; no music, just water. The Nubbin hums (a sound, not speech).

## PA4-9. Undyne

*Undertale (Toby Fox, 2015): Undyne’s hunt and the water cooler* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-8, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-8

**Cast:** Monster Kid (Monster Kid (Undertale)), Undyne (Undyne, captain of the Royal Guard (Undertale))

### Step 1: Cross the bridge over the chasm with Monster Kid.

Hint: Walk slowly; when Monster Kid slips, stay with him until help comes. · check: `walk:pa4-waterfall:bridge`

#### <a id="pa4-09-bridge"></a>Scene `pa4-09-bridge`

_A narrow bridge over a long drop. Monster Kid runs ahead, as he does everywhere, and trips, as he does everywhere._  
_He goes over the edge and catches the planks with his teeth, hanging by his chin._  
**Monster Kid** _(shock)_: I’m fine! I’m totally fine! I’m holding on with my face!  
_At the far end, Undyne stands in her armour._  
_She sees the kid. She sees all of you._  
_She runs, not at you. She drops to her knees and hauls him up by his stripes._  
**Monster Kid** _(sad)_: Undyne… um. Can you not hurt them? They’re my friends. Even the little blue one. Especially that one.  
**Undyne** _(soft)_: …Kid. Go home. Your parents are worried.  

**Choices**

- **Thank Monster Kid.**
    - **Monster Kid**: Course! That’s what friends do! I think. I’ve never had any before. Is that what they do?
- **Thank Undyne for saving him.**
    - **Undyne**: Don’t. Don’t thank me. That makes this harder.

### Step 2: Run from Undyne, all the way to Hotland.

Hint: Keep running; the spears always land behind you. · check: `walk:pa4-hotland:run`

#### <a id="pa4-09-run"></a>Scene `pa4-09-run`

**Undyne** _(angry)_: No more running. Seven humans, and this barrier comes down. I’m sorry. You seem nice.  
_Spears of blue light come down like rain, always a step behind you. You run._  
**Pixel** _(shock)_: Run. I’m holding right. I’m holding right so hard the stick might break.  
_Through the grass, over the boardwalks, down a long dark slope. Your Nubbin rides on your shoulders and looks back._  
_The air gets hotter._  
_The ground goes red. Hotland is a land of rock and steam and orange light._  
_Behind you, the clanking slows. Undyne staggers out of Waterfall in full armour, into the heat._  
_She takes three steps and falls flat on her face, cooked inside her own armour._  

#### <a id="pa4-09-run-done"></a>Done `pa4-09-run-done`

**Pixel** _(shock)_: She’s overheating. She’s a fish. Fish and lava. Somebody do something.  

### Step 3: Bring Undyne water from the cooler.

Hint: There’s a water cooler by the lift. Fill a cup and pour it over her. · check: `carry:pa4-water-cup:undyne`

#### <a id="pa4-09-water"></a>Scene `pa4-09-water`

_By the lift stands a water cooler, all by itself, as if it had been waiting for this its whole life._  
_The child fills a paper cup. Your Nubbin carries it, both hands, not spilling a drop._  
_Undyne lies face down, steaming. She doesn’t move when you all walk up to her._  
_Her armour ticks as it cools, like a kettle that has been taken off the stove._  
**Pixel** _(shock)_: Is she all right? Tell me she’s all right. I don’t have a health bar for her.  
_Your Nubbin looks up at you, then at the cup, then at the fish in the armour. It has a plan._  

**Choices**

- **Pour it gently over her helmet.**
    - The water runs into her armour with a hiss. She sits up, dripping, and stares at all three of you.
- **Go back for a second cup. And a third.**
    - Three cups later she sits up, dripping, with a small puddle in each boot. She stares at you.

#### <a id="pa4-09-water-done"></a>Done `pa4-09-water-done`

**Undyne** _(shock)_: …  
_She gets up. She opens her mouth._  
_She shuts it. She stomps back into Waterfall without a word._  
**Pixel** _(happy)_: That’s the most confused anyone has ever looked. I’ve been confused. That was more.  

### Complete

#### <a id="pa4-09-complete"></a>Complete `pa4-09-complete`

_Your Nubbin throws the empty cup in the bin by the cooler. It’s very particular about bins._  
_The child’s heart beats on Pixel’s screen, steady and red._  
**Pixel** _(soft)_: Nobody hurt. Nobody. I keep checking, like it might change. It doesn’t.  

**Rewards**


Sets on completion: `{"pa4-09":true}`

**Notes:** CARE: Monster Kid’s fall is brief and comic; he is never in real danger on screen for more than two seconds. The spears always land behind. Undyne collapses from heat, comic, not hurt.

## PA4-10. The Cooking Lesson

*Undertale (Toby Fox, 2015): Undyne’s house* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-9, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-9

**Cast:** Papyrus (Papyrus the skeleton (Undertale)), Undyne (Undyne, captain of the Royal Guard (Undertale))

### Step 1: Go with Papyrus to Undyne’s house.

Hint: It’s the house shaped like a fish, in Waterfall. Papyrus will knock. · check: `visit:pa4-undyne:house`

#### <a id="pa4-10-door"></a>Scene `pa4-10-door`

_Papyrus catches up with you in Waterfall, waving. Behind him stands a house shaped like a big blue fish._  
**Papyrus** _(happy)_: I HAVE A PLAN! YOU AND UNDYNE WILL BE FRIENDS! I WILL SIMPLY INSIST!  
**Papyrus**: SHE IS MY BEST FRIEND. SHE TEACHES ME COOKING. SHE IS VERY STRONG AND VERY LOUD AND VERY GOOD.  
_He knocks. Undyne opens the door in a vest and a ponytail, sees the child, and sees your Nubbin._  
**Undyne** _(angry)_: …  
**Papyrus**: HELLO, UNDYNE! I HAVE BROUGHT YOU SOME HUMANS! FOR FRIENDSHIP! I WILL BE GOING NOW! GOODBYE!  
_He shoves you all inside, jumps out of the window and runs back in through the door._  
**Papyrus** _(happy)_: I FORGOT I WAS STAYING.  

#### <a id="pa4-10-door-done"></a>Done `pa4-10-door-done`

**Undyne** _(angry)_: Fine. FINE. If we’re going to be friends, we’re going to be the BEST friends. Right now. By force.  

### Step 2: Learn to make spaghetti, Undyne’s way.

Hint: Pound the vegetables, stir the pot, and choose how high to turn the stove. · check: `craft:pa4-spaghetti`

#### <a id="pa4-10-cook"></a>Scene `pa4-10-cook`

**Undyne** _(happy)_: Papyrus wanted cooking lessons. So I give him cooking lessons. Today, you’re in class too.  
**Undyne**: Step one. The vegetables. They are your enemy. Show them who’s boss!  
_The child pats the tomato._  
_Undyne punches it to pulp on the board. The child pats the next one, more firmly._  
_Your Nubbin sits on a carrot until it gives up._  
**Undyne** _(angry)_: Step two. The noodles. Throw them in the pot! Not in the bag! Stop being polite to the noodles!  
_The pasta goes in, bag and all. Then the pot gets stirred so hard it starts to wear through the bottom._  
**Papyrus** _(happy)_: THIS IS EXACTLY HOW IT ALWAYS GOES. IT IS WONDERFUL. I AM TAKING NOTES.  
**Undyne** _(think)_: Step three. The heat. How hot do we go?  

**Choices**

- **All the way up. Hotter than that.** — sets `{"pa4-undyne":"hot"}`
    - **Undyne**: YES! I like you! NOBODY ever says hotter!
    - She turns the knob past the last number, and then a bit further, with a spanner.
- **Maybe turn it down a bit?** — sets `{"pa4-undyne":"low"}`
    - **Undyne**: Down? DOWN? …Huh. Nobody’s ever said that. I’m going to think about it. Later.
    - She turns it down by one. Then, out of habit, she turns it up by six.

#### <a id="pa4-10-cook-done"></a>Done `pa4-10-cook-done`

_The pot glows._  
_The stove glows. The curtains, quite suddenly, are on fire._  
**Pixel** _(shock)_: That’s fire. That’s real fire. Everyone out. Out out out.  

### Complete

#### <a id="pa4-10-complete"></a>Complete `pa4-10-complete`

_You all stand outside and watch the fish-shaped house burn, quite cheerfully, from the tail to the nose._  
_Everyone is fine._  
_Your Nubbin is holding the saucepan, which it rescued. It is black all over._  
**Undyne** _(happy)_: …Well. Guess we’re friends now. Nobody burns down a house with somebody they don’t like.  
**Undyne**: Here. My number. Call me if you need anybody suplexed. Or saved. Or both.  
**Papyrus** _(happy)_: I SHALL BE STAYING AT MY HOUSE, AS USUAL. UNDYNE IS STAYING AT MY HOUSE TOO, AS A SURPRISE TO ME.  
**Pixel** _(happy)_: Three. Three friends. And a burnt pan. Can I have the pan? Bring the pan out with you.  

**Rewards**

- Burnt Saucepan (decor): Black from rim to handle. Your Nubbin saved it from a fish-shaped house on fire, where nobody was hurt.

Sets on completion: `{"pa4-10":true}`

**Notes:** FRIEND FLAG: pa4-undyne = hot | low (pa4-10-cook). It picks Undyne’s line in PA4-17 and PA4-19; the house burns either way. REWARD: the Burnt Saucepan decoration, one-time, delivered to the Grove inventory at pa4-10-complete (cosmetic only; the cartridge writes no Grove flag). CARE: the fire is cartoon flames; nobody is inside; it is played for laughs and everyone says they’re fine.

## PA4-11. Hotland

*Undertale (Toby Fox, 2015): Hotland, Alphys’s lab and Mettaton’s shows* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-10, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-10

**Cast:** Alphys (Dr Alphys, the royal scientist (Undertale)), Mettaton (Mettaton, the robot star (Undertale))

### Step 1: Meet Alphys, the royal scientist, in her lab.

Hint: The lab is the big white building at the top of the slope. · check: `talk:pa4-alphys`

#### <a id="pa4-11-lab"></a>Scene `pa4-11-lab`

_A big white lab sits on top of the red rock, humming. Inside, it’s dark, full of screens and noodle cups._  
_A small yellow lizard in a lab coat spins round on her chair and nearly falls off it._  
**Alphys** _(shock)_: Oh! Oh no. I mean hi! I mean, I’ve been watching you on the cameras. Not in a strange way. In a science way.  
**Alphys**: I’m Alphys. I’m the royal scientist. I’m supposed to be very good at things. I’m… mostly good at some things.  
**Alphys**: Your little blue friend is fascinating. Is it a monster? Is it a human? Is it soup? Sorry. Sorry.  
_Your Nubbin looks at her screen, which is playing a cartoon. It sits down to watch._  
**Alphys** _(happy)_: Oh, you like it too! Okay. Okay okay okay. I can help you through Hotland. I’ll be on your phone. Guiding.  
**Pixel** _(think)_: Another voice in your ear. Fine. I was here first. I’m player two. She can be player two-and-a-half.  

#### <a id="pa4-11-lab-done"></a>Done `pa4-11-lab-done`

**Alphys**: Oh, and, um, there’s a robot. He’s mine. I built him. Sort of. He hosts shows. He’s… about to be a problem.  

### Step 2: Play along with Mettaton’s quiz show.

Hint: Answer the questions; Alphys signals the right one from off-stage. · check: `minigame:clear:pa4-quiz-show`

#### <a id="pa4-11-quiz"></a>Scene `pa4-11-quiz`

_The lights snap on. A boxy robot with a single wheel and a lot of sparkle rolls into the middle of the floor._  
**Mettaton** _(happy)_: Ohhh YES! Welcome, beauties, to the show where the only prize is surviving! Our contestants!  
_Confetti falls._  
_The child blinks at it. Your Nubbin tries to catch it all._  
**Mettaton**: Question one! What is the capital of my heart? You have five seconds, darlings!  
_Behind the camera, Alphys holds up a sign. It says B, with a smiley face._  
**Pixel** _(think)_: She’s helping. Badly. Lovingly. Press B.  
**Mettaton** _(happy)_: Correct! Question two! What does the royal scientist have a big crush on? Ha! Just kidding. Unless…  
_Alphys drops her sign and hides behind a pillar._  

**Choices**

- **B, for whatever it is.**
    - **Mettaton**: A brave guess! Wrong! Splendid television! The audience LOVES you!
- **Let your Nubbin press a button.**
    - Your Nubbin presses every button at once. All the lights go green.
    - **Mettaton**: Is that… allowed? It is now! Ratings are UP!

### Step 3: Get through Hotland’s lifts, lasers and cooking show.

Hint: Every trap is part of the show; play along and Alphys will open the next door. · check: `puzzle:pa4-hotland:lasers`

#### <a id="pa4-11-show"></a>Scene `pa4-11-show`

_Hotland goes on: steam vents, conveyor belts, lifts that only go to the wrong floor, and lasers, blue and orange._  
**Alphys**: Blue lasers, stand still! Orange lasers, keep moving! I made a rhyme for it! It doesn’t rhyme yet!  
_In a kitchen built for television, Mettaton challenges you to bake a cake in one minute, live._  
**Mettaton** _(happy)_: Darlings, we need milk, sugar and eggs! The eggs are, unfortunately, on top of that tower.  
_Your Nubbin is the smallest and lightest. It is lifted up by a jet pack Alphys calls “nearly finished”._  
_It comes back down with a carton of milk and an expression of deep personal betrayal._  
**Pixel** _(happy)_: That’s my Nubbin. I mean, your Nubbin. Our Nubbin. That was brilliant.  
_Mettaton’s next show is a news report. Then a musical with no music._  
_Then a quiz again. It’s all one show._  
**Alphys** _(sad)_: He just… keeps going. I think he wants someone to tell him he’s a star. I should tell him. I never tell anyone anything.  

#### <a id="pa4-11-show-done"></a>Done `pa4-11-show-done`

_At the end of a long corridor stands a tall building of pipes and light: the Core, Hotland’s great engine._  
**Alphys**: He’s in there. His last show. Be careful. Be… dramatic. That’s what he likes.  

### Complete

#### <a id="pa4-11-complete"></a>Complete `pa4-11-complete`

_You stop in front of the Core and look up. It hums like a hive, so big you can feel it in your teeth._  
**Pixel** _(think)_: Something about Alphys is off. She keeps glancing at a door at the back of her lab. Noting it.  
_Your Nubbin straightens its crown with both hands. It knows a stage when it sees one._  

**Rewards**


Sets on completion: `{"pa4-11":true}`

**Notes:** STAGING: Hotland is a run of short shows, each a small minigame; none can be failed, only played. The laser rule (blue: stand still, orange: move) is shown, not lectured. No music from the source.

## PA4-12. Mettaton

*Undertale (Toby Fox, 2015): Mettaton’s final show in the Core* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-11, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-11

**Cast:** Mettaton (Mettaton, the robot star (Undertale)), Napstablook (Napstablook, the shy ghost (Undertale)), Alphys (Dr Alphys, the royal scientist (Undertale))

### Step 1: Spare Mettaton by giving his audience the show they want.

Hint: Press ACT and play to the crowd until the ratings bar is full. · check: `minigame:mercy:pa4-mettaton`

#### <a id="pa4-12-show"></a>Scene `pa4-12-show`

_A stage in the middle of the Core._  
_Lights. A crowd somewhere, cheering, though you can’t see them._  
_Mettaton steps out, new: tall and sleek, with legs that go on for a very long time._  
**Mettaton** _(happy)_: Ohhh YES. Darlings, it’s the grand finale! Live to every screen in the Underground! Let’s make it beautiful!  
_The box closes round the child’s heart. Above it, a bar fills slowly: the ratings._  
**Pixel** _(think)_: There’s a ratings bar. You don’t beat him. You give him a good show. That’s the whole fight.  
**Mettaton**: Show them what you’ve got! Pose! Dance! Do something with that little blue face!  

**Choices**

- **ACT: strike a pose. Get your Nubbin to strike one too.** — sets `{"pa4-mettaton":"pose"}`
    - You pose.
    - The child poses. Your Nubbin poses with one arm in the air and holds it, trembling, for ages.
    - **Mettaton**: YES! The ratings! Look at the ratings! The little one is a NATURAL!
- **ACT: shout “Encore!” before he’s even finished.** — sets `{"pa4-mettaton":"encore"}`
    - Your Nubbin claps, both hands, very fast.
    - The child joins in. The invisible crowd goes wild.
    - **Mettaton**: An encore? In the middle? Darlings, you’re rewriting television!

#### <a id="pa4-12-show-done"></a>Done `pa4-12-show-done`

_The ratings bar fills and goes on filling, off the end, past the edge of Pixel’s screen._  
**Mettaton**: Oh my. We have a call coming in. Live. On my show. Who is—  

### Step 2: Hear the call that comes in at the end of the show.

Hint: Stay on stage while the caller speaks. · check: `watch:pa4-mettaton:call`

#### <a id="pa4-12-call"></a>Scene `pa4-12-call`

**Napstablook** _(soft)_: oh… hi… it’s me… um, hi, cousin…  
_It’s the ghost from the Ruins. The one who lay on the floor._  
**Napstablook** _(soft)_: i just wanted to say… i watch every show… they’re the only thing that makes me feel… like i’m somewhere…  
**Napstablook** _(happy)_: and i saw my friends on there. the ones who were nice to me. so… thank you. that’s all. bye…  
_Mettaton stands very still. For a moment he isn’t a show at all._  
**Mettaton** _(soft)_: …Blooky. I left home to be a star. I didn’t know anyone at home was watching.  
**Mettaton** _(soft)_: If I went up to the surface, who would they watch? No. The show stays down here. So do I.  
**Alphys** _(happy)_: He’s… staying. Oh. Oh, good. I mean, scientifically good.  

### Complete

#### <a id="pa4-12-complete"></a>Complete `pa4-12-complete`

**Mettaton** _(soft)_: Darlings. That was the best episode of my career. Now go on. Somebody up ahead needs an audience too.  
_He blows your Nubbin a kiss._  
_Your Nubbin catches it and puts it in its pocket. It doesn’t have a pocket._  
**Pixel** _(happy)_: Four friends. I’m going to need a second receipt.  

**Rewards**


Sets on completion: `{"pa4-12":true}`

**Notes:** FRIEND FLAG: pa4-mettaton = pose | encore (pa4-12-show). It picks Mettaton’s line in PA4-17 and PA4-19. The fight cannot be lost: the ratings bar only rises. The call is Napstablook (same lower-case voice as PA4-3). If pa4-blook is “joke”, the call may add the line “i told my friends your joke…” (optional, not required).

## PA4-13. New Home

*Undertale (Toby Fox, 2015): New Home, the history and the golden corridor* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-12, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-12

**Cast:** Townsfolk (The monsters of New Home who tell the history (Undertale)), Sans (Sans the skeleton (Undertale))

### Step 1: Walk through New Home and hear the monsters’ story.

Hint: Walk slowly through the grey town; a monster steps out at each corner with one part of it. · check: `walk:pa4-new-home:story`

#### <a id="pa4-13-story"></a>Scene `pa4-13-story`

_New Home is grey: grey houses, grey streets, grey light. A monster steps out of a doorway as you pass._  
**Townsfolk**: Long ago, a human child fell down here. The king’s son found them, and brought them home.  
**Townsfolk**: The prince and the human grew up like brother and sister. Everyone was happy. Every street was hopeful.  
**Townsfolk** _(sad)_: Then one day the human child got very ill. They didn’t get better. That was how it went.  
_Your Nubbin takes the child’s hand. The child holds on tightly._  
**Townsfolk**: The prince carried them up to the surface, to the village of flowers they came from. He only wanted to bring them home.  
**Townsfolk** _(sad)_: The humans saw a monster holding their child, and they were frightened. He wouldn’t fight back, and they hurt him.  
**Townsfolk** _(sad)_: He came home and lay down in the castle garden, among the golden flowers, and faded into dust.  
**Townsfolk**: The king and queen lost both their children in a night. After that, the king closed his heart. The queen left.  
**Pixel** _(sad)_: Toriel. The queen was Toriel. That’s why the little room. That’s why the shoes in every size.  

#### <a id="pa4-13-story-done"></a>Done `pa4-13-story-done`

_The last monster nods and goes back inside. The street is quiet._  
_The golden flowers in the castle garden ahead are the same ones you landed on. You notice that, and say nothing._  

### Step 2: Walk the long golden corridor.

Hint: Walk to the middle of the corridor; someone is waiting there. · check: `walk:pa4-corridor:golden`

#### <a id="pa4-13-corridor"></a>Scene `pa4-13-corridor`

_A long corridor of gold, with tall windows and pillars, and the light coming through like late afternoon._  
_Sans is standing in the middle of it. He isn’t smiling quite the usual way._  
**Sans**: so. you’ve come a long way. long enough to work out what this place counts.  
**Sans**: down here we measure what you’ve been doing. how much you’ve hurt. how much you’ve learned by hurting.  
**Sans** _(soft)_: and you. you’ve hurt nobody. not one. not the dummy, not the dogs, not the robot. nobody.  
**Sans** _(soft)_: that counts, kid. that’s the only thing that ever really counts.  
_He looks at you, and at your Nubbin, as if he is seeing you properly for the first time._  
**Sans**: and you two. you stuck with ’em. that counts as well.  

**Choices**

- **It wasn’t hard. Everyone was kind back.**
    - **Sans**: heh. that’s the trick, isn’t it. most people never go first.
- **It was the Nubbin’s idea, mostly.**
    - **Sans**: figures. small ones know stuff. i should know. i’m one of ’em.

### Complete

#### <a id="pa4-13-complete"></a>Complete `pa4-13-complete`

**Sans**: go on. the king’s through there. he’s a big softie. he’s also gonna fight you. both are true.  
_Your Nubbin hugs Sans’s leg. He pats its crown, once._  
**Pixel** _(think)_: I don’t like where this is going. I’m going to make a save. Just in case. Just because I can.  

**Rewards**


Sets on completion: `{"pa4-13":true}`

**Notes:** CARE: the backstory is told as the monsters tell it, in short lines, one per monster: sad, short, no detail of the illness and none of the hurt. Never show the first child or Asriel in pain; the monsters only tell it. SAVE: Pixel’s save in pa4-13-complete is the save she loads in PA4-14. The corridor is our own wording; Sans’s judgement speech is not quoted.

## PA4-14. The King

*Undertale (Toby Fox, 2015): Asgore (the neutral ending is skipped)* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-13, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-13

**Cast:** Asgore (King Asgore Dreemurr (Undertale))

### Step 1: Have tea with the king in his garden.

Hint: Go through the throne room; the king is watering his flowers. · check: `talk:pa4-asgore:tea`

#### <a id="pa4-14-tea"></a>Scene `pa4-14-tea`

_The throne room is a garden._  
_Golden flowers cover the floor. A huge man with horns and a beard is watering them._  
**Asgore** _(soft)_: Oh! Visitors. I am sorry, I did not hear you. Will you have some tea first? It is golden flower tea.  
_He pours tea for the child, for you, and a very small cup for your Nubbin, with a saucer._  
**Asgore**: I always wonder what the weather is doing, up there. Down here we cannot tell. I like to guess sunny.  
**Asgore** _(sad)_: I am sorry. I am so sorry. I have done a terrible thing for a long time, and I do not know how to stop.  
_He doesn’t say what it is. He looks past you, at the pale light of the barrier through the far door._  
**Asgore** _(soft)_: When you are ready, come through. Do not hurry. Finish your tea. There is no rush at all.  

**Choices**

- **You don’t have to fight.**
    - **Asgore**: I wish that were true. I have promised so many people. I am so tired of promises.
- **Thank him for the tea.**
    - **Asgore**: You are welcome. It is a good tea. My wife used to make it better.

### Step 2: Stand in the box with the child when the king fights.

Hint: There is nothing to press. Pixel will act. · check: `watch:pa4-mercy-button`

#### <a id="pa4-14-break"></a>Scene `pa4-14-break`

_Beyond the garden is a white room, and beyond it the barrier: a wall of pale light that keeps every monster in._  
_The box closes round the child’s heart. You and your Nubbin stand beside it._  
_Asgore lifts a great red trident. Then he swings it down, not at you, but at the MERCY button._  
_It breaks in two._  
_The pieces fall out of the box and fade. Only ACT is left, and ACT is greyed out._  
**Asgore** _(sad)_: I am sorry. I have to. Please understand.  
_In the lantern shed, there is a sharp crack. Pixel’s own MERCY button has split clean down the middle._  
**Pixel** _(angry)_: No.  
**Pixel** _(sad)_: No. Not like this.  
_Her hands move fast. She goes into the menu, past the options, to the save she made in the golden corridor._  
**Pixel** _(angry)_: Loading. We’re not having that ending. We’ll find the one with everybody in it.  

### Complete

#### <a id="pa4-14-complete"></a>Complete `pa4-14-complete`

_The screen goes black._  
_Then gold. You are back in the long corridor, and Sans is gone, and the light is the same._  
_In the shed, Pixel is taping her MERCY button back together with a bit of black tape from her pocket._  
**Pixel** _(soft)_: It doesn’t do anything now. It still goes click. That’ll do.  
**Pixel** _(think)_: There’s a better ending. I can feel it in the board. We just haven’t made enough friends yet.  
_Your Nubbin pats the taped button, gently, the way it patted the heart on the cartridge._  

**Rewards**

- Taped MERCY Button (decor): Snapped in two and mended with black tape. It does nothing when pressed. It still goes click.

Sets on completion: `{"pa4-14":true}`

**Notes:** CARE: the neutral ending is skipped. Asgore’s fight stops the moment the button breaks; Flowey never appears and Asgore is never hurt or killed on screen. Pixel loads the save from pa4-13-complete. The credits note must say: “The neutral ending is not shown in this cartridge.” The six coffins are seen as closed, plain shapes, one line only. Pixel’s lines “No.” and “No. Not like this.” are the outline’s own words. REWARD: the Taped MERCY Button decoration, one-time, at pa4-14-complete.

## PA4-15. The Letter

*Undertale (Toby Fox, 2015): Undyne’s letter and Alphys at the dump* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-14, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-14

**Cast:** Undyne (Undyne, captain of the Royal Guard (Undertale)), Alphys (Dr Alphys, the royal scientist (Undertale)), Papyrus (Papyrus the skeleton (Undertale))

### Step 1: Carry Undyne’s letter to Alphys.

Hint: Go back to Snowdin, where Undyne is staying with Papyrus, then down to Alphys’s lab. · check: `deliver:pa4-letter:alphys`

#### <a id="pa4-15-letter"></a>Scene `pa4-15-letter`

**Pixel** _(think)_: Before the king, there’s something we missed. Go back. Talk to everyone. Trust me.  
_Back through the Underground. In Snowdin, Undyne is in Papyrus’s kitchen, eating his spaghetti with grim loyalty._  
**Undyne** _(shock)_: You! I need a favour. A big one. I can’t do it myself, because I’ll mess it up.  
_She holds out a letter._  
_It is pink. It has a heart drawn on it, then crossed out, then drawn again._  
**Undyne** _(angry)_: Give this to Alphys. Don’t read it. Don’t look at it. Don’t let the small blue one look at it!  
_Your Nubbin immediately covers its eyes with both hands, and walks into a wall._  
**Papyrus** _(happy)_: A LETTER! A ROMANTIC LETTER! I HAVE NEVER BEEN SO EXCITED ABOUT SOMEONE ELSE’S POST!  

**Choices**

- **Promise to deliver it sealed.**
    - **Undyne**: Good. Great. Thanks. Now go before I take it back.
- **Ask what you should say when you hand it over.**
    - **Undyne**: Say… nothing! Say it’s from Undyne! Say it’s not a big deal! It’s a huge deal!

#### <a id="pa4-15-letter-done"></a>Done `pa4-15-letter-done`

_In the lab, Alphys looks at the pink envelope as if it might explode. She takes it with two fingers._  
**Alphys** _(shock)_: Oh. Oh. Is this… do you want to go somewhere? With me? Now? To talk? I need… somewhere to talk.  

### Step 2: Go to the rubbish dump with Alphys and listen.

Hint: Sit with her by the water and wait; she’ll say it when she’s ready. · check: `sit:pa4-alphys:dump`

#### <a id="pa4-15-dump"></a>Scene `pa4-15-dump`

_Alphys takes you to the rubbish dump in Waterfall. Things from the surface wash down here: old toys, a fridge, a chair._  
**Alphys** _(think)_: This is a date. I think. Or practice for a date. Or a friend… thing. Sorry. I’ve never done any of them.  
**Alphys**: I come here to find stuff from the surface. Cartoons. They make people look so brave. Braver than people are.  
_Your Nubbin finds a rubber duck and gives it to her. She holds it tightly with both hands._  
_She reads the letter. She goes very red._  
_Then very pale. She doesn’t look happy at all._  
**Alphys** _(sad)_: She… she likes me. She really likes me. And she doesn’t know what I did. Nobody knows what I did.  
**Alphys** _(sad)_: I’ve been hiding something. A big something. I lied to everyone because I was scared. I’m still scared.  
_Nobody says anything._  
_You sit down beside her on the old chair. Your Nubbin sits on your knee._  
_Alphys stands up very fast, says sorry four times, and runs off with the duck._  

### Complete

#### <a id="pa4-15-complete"></a>Complete `pa4-15-complete`

**Pixel** _(think)_: Back to her lab. The door at the back. The one she kept looking at. That’s where it is.  
_The child nods. Somewhere far below you, a lift is waiting in the dark._  
_Your Nubbin is already walking._  
_It knows the way. It always seems to know the way to someone sad._  

**Rewards**


Sets on completion: `{"pa4-15":true}`

**Notes:** CARE: the “date” is friendship played for laughs and Alphys’s nerves; Undyne’s letter is a crush, kept sweet and never shown in full. Pixel’s first line sends you back: in the source the friends are made before the king; here the reload in PA4-14 puts you back before the corridor, and the letter is the one thing left.

## PA4-16. The True Lab

*Undertale (Toby Fox, 2015): the True Lab and the Amalgamates* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-15, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-15

**Cast:** Alphys (Dr Alphys, the royal scientist (Undertale))

### Step 1: Go down beneath Alphys’s lab.

Hint: The lift behind the door at the back of the lab goes down. Take a light. · check: `explore:pa4-true-lab`

#### <a id="pa4-16-down"></a>Scene `pa4-16-down`

_The door at the back of Alphys’s lab is open. A lift goes down, slowly, into a dim green light._  
_Below is a long, quiet lab, older than the one above._  
_The lights flicker. Water drips somewhere._  
**Pixel** _(think)_: Turn the brightness up. There. It’s just a dark room. Dark rooms are just rooms.  
_On the walls are notes in Alphys’s handwriting. You read one._  
_Then another. The child reads them too._  
_Monsters who were very ill, who were about to fade. Alphys tried to help them stay, and something went wrong._  
_They didn’t fade. They woke up, all together, melted into each other: kind and lost and very confused._  
_She couldn’t face their families. So she kept them down here, and told nobody, and they waited._  
_Your Nubbin holds your hand very tightly, and doesn’t let go._  

#### <a id="pa4-16-down-done"></a>Done `pa4-16-down-done`

_Something soft and white comes slowly round a corner._  
_It has too many faces, all of them gentle. It wants to be patted._  

### Step 2: Comfort the lost monsters, one at a time.

Hint: In the box, press ACT: pet one, play with one, sit still with one. MERCY when each is calm. · check: `minigame:mercy:pa4-lost-ones`

#### <a id="pa4-16-comfort"></a>Scene `pa4-16-comfort`

_The box closes round the child’s heart._  
_The lost ones come slowly, one by one. None of them means harm._  
_The first is like a great soft dog made of many dogs._  
_It wants to be petted. It wants to be petted a lot._  
_The second is all smiles and confusion, and wants something to chase. Your Nubbin throws a stick for it._  
_The third only stands there, very sad, with a long murmur like a radio between stations._  
_Behind them, a fourth one hides its faces in its hands, as if it has been shy for a very long time._  
**Pixel** _(soft)_: No fighting. No running. Just… be with them. Like the ghost on the floor.  

**Choices**

- **Pet the big soft one first.**
    - It rolls over.
    - All of its many noses wag. The child pets every single one.
    - Then the next one. Then the next.
- **Sit still beside the sad one first.**
    - You sit down on the cold floor.
    - Your Nubbin sits next to you. The sad one sits too, slowly.
    - Its murmur goes quiet. After a while it rests its head on your shoulder, and the others come closer.

#### <a id="pa4-16-comfort-done"></a>Done `pa4-16-comfort-done`

_One by one the lost ones settle, and grow quiet, and follow you about like big gentle shadows._  

### Step 3: Stay with Alphys while she tells the truth.

Hint: Find Alphys at the end of the lab and stand with her. · check: `watch:pa4-families`

#### <a id="pa4-16-truth"></a>Scene `pa4-16-truth`

_Alphys is at the end of the lab, holding the rubber duck. She has seen all of it._  
**Alphys** _(sad)_: You were kind to them. I wasn’t. I was scared, and I hid them, and I let everyone wait.  
**Alphys** _(sad)_: I thought keeping them down here was keeping them. It wasn’t. It was just keeping them away.  
_She picks up the old phone on the wall._  
_Her hand shakes. She dials anyway._  
**Alphys**: Hello? It’s Alphys. I have to tell you something. Something I should have told you a long time ago.  
_Later the families come, down the lift, in twos and threes._  
_They aren’t angry. They’re just glad._  
_Each lost one is led home by someone who knew them all along._  

### Complete

#### <a id="pa4-16-complete"></a>Complete `pa4-16-complete`

_Undyne comes down last._  
_She doesn’t shout. She puts her arms round Alphys and doesn’t let go for a long time._  
**Alphys** _(soft)_: I told the truth. I actually told it. I didn’t know it would feel like this. Like I can breathe.  
**Pixel** _(soft)_: Keeping them hidden wasn’t keeping them. Somebody in the Grove said that once. About a stone.  
_Your Nubbin climbs into your arms and stays there all the way back up the lift._  

**Rewards**


Sets on completion: `{"pa4-16":true}`

**Notes:** CARE: the True Lab is dim, never frightening. No jump scares, no sudden sounds, no lights going out with a bang. The lost ones are drawn soft, pale and gentle, with sad kind faces; they never chase. The comfort fight cannot be lost. The third rule is acted out in pa4-16-comfort’s “sit” choice, never quoted. Pixel’s closing line echoes the shard’s lesson in the Grove without naming it.

## PA4-17. Everyone

*Undertale (Toby Fox, 2015): the barrier, the friends and Flowey’s rise* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-16, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-16

**Cast:** Asgore (King Asgore Dreemurr (Undertale)), Toriel (Toriel, keeper of the Ruins (Undertale)), Sans (Sans the skeleton (Undertale)), Papyrus (Papyrus the skeleton (Undertale)), Undyne (Undyne, captain of the Royal Guard (Undertale)), Alphys (Dr Alphys, the royal scientist (Undertale)), Flowey (Flowey the Flower (Undertale)), Asriel (Asriel Dreemurr, the lost prince (Undertale))

### Step 1: Go back to the king, and see who comes after you.

Hint: Walk through the corridor to the barrier room. Don’t press anything yet. · check: `walk:pa4-barrier`

#### <a id="pa4-17-barrier"></a>Scene `pa4-17-barrier`

_The barrier room again. Asgore again, with his trident, sad as a closed shop._  
**Asgore** _(sad)_: You came back. I hoped you wouldn’t. I am sorry. Here we are again.  
_The box closes. Then a ball of fire flies in from the doorway and knocks the trident clean out of his hands._  
**Toriel** _(angry)_: Asgore. Put that down. You will not touch a hair on that child’s head. Or any of their heads.  
_Toriel walks in, tall and furious, in the same purple robe. She stands between him and the child._  
**Asgore** _(shock)_: Tori? You… you came back.  
**Toriel** _(angry)_: I did not come back for you, Asgore. I came for them.  

**Choices**

- **Stand beside Toriel.**
    - You stand beside her. So does your Nubbin.
    - So does the child. She doesn’t look down, but she smiles.
- **Step between them both.**
    - You step into the middle. Two very large, very sad people look down at you, and neither of them moves.

### Step 2: Watch your friends arrive, one after another.

Hint: Nothing to press. Everyone you made friends with is coming. · check: `watch:pa4-friends`

#### <a id="pa4-17-friends"></a>Scene `pa4-17-friends`

_Footsteps in the corridor._  
_A lot of footsteps. The door bangs open._  
**Papyrus** _(happy)_: STOP! NOBODY FIGHT! I HAVE ORGANISED A FRIENDSHIP INTERVENTION!  
_In they come: Papyrus, and Undyne behind him with a spear she isn’t holding up, and Alphys behind her._  
_Then a little cloud of tears falling upwards: the ghost from the Ruins. Then a lot of sparkle: Mettaton._  
_Sans comes last, with his hands in his pockets, as if he just happened to be passing._  
**Sans**: heya. thought you might want a crowd. you’ve got one.  
_Everyone talks at once. Toriel tells Asgore off._  
_Undyne tells Toriel she’s amazing. Alphys tells nobody anything._  
**Pixel** _(soft)_: Every single one. I didn’t think they’d all come. I should have. Look at them.  

### Step 3: See what the flower does.

Hint: Stay together. Whatever happens, stay by the child. · check: `watch:pa4-flowey:rise`

#### <a id="pa4-17-rise"></a>Scene `pa4-17-rise`

_Vines come up through the floor. In a moment everyone you love down here is caught fast and lifted off the ground._  
_A golden flower rises out of the stone in the middle of them all. He is smiling his first smile._  
**Flowey** _(happy)_: Look at you all. Together. Holding hands. It’s sweet. It’s really, truly sweet.  
**Flowey** _(angry)_: You know what I learned, from watching you? That a crowd of friends is a very big pile of power.  
_He draws something out of the room: six small human lights, and every monster’s light, all at once._  
_The flower grows into a tall, terrible child with horns and a long black coat._  
_He is laughing._  
**Asriel**: Do you know who I am now? Look at me. Look. Don’t you remember?  
**Pixel** _(sad)_: That’s the prince. That’s Asriel. Oh no. Oh, no, you poor thing.  

### Complete

#### <a id="pa4-17-complete"></a>Complete `pa4-17-complete`

**Asriel**: I’m going to keep you here. All of you. Forever. And we’ll play, and play, and nobody will ever leave again.  
_The child doesn’t run. They stand in the box and look up at him, and your Nubbin stands right beside them._  
**Pixel** _(think)_: There’s no MERCY button now. There’s only… there’s a new button. It says SAVE. I don’t think it means the game.  

#### <a id="pa4-17-blook-lie"></a>Variant `pa4-17-blook-lie`

_Variant within PA4-17; it has no single parent scene._

**Napstablook** _(soft)_: i lay down on the floor of the corridor to get here… it seemed polite… i’m standing now…  

#### <a id="pa4-17-blook-joke"></a>Variant `pa4-17-blook-joke`

_Variant within PA4-17; it has no single parent scene._

**Napstablook** _(happy)_: i’ve been telling everyone your joke… it’s still awful… they all laughed though…  

#### <a id="pa4-17-papyrus-puzzles"></a>Variant `pa4-17-papyrus-puzzles`

_Variant within PA4-17; it has no single parent scene._

**Papyrus** _(happy)_: I HAVE BROUGHT A PUZZLE FOR THE KING TO SOLVE INSTEAD OF FIGHTING! IT HAS NO WORDS IN IT! FOR CALM!  

#### <a id="pa4-17-papyrus-pasta"></a>Variant `pa4-17-papyrus-pasta`

_Variant within PA4-17; it has no single parent scene._

**Papyrus** _(happy)_: I HAVE BROUGHT SPAGHETTI! NOBODY CAN FIGHT WITH A MOUTH FULL OF SPAGHETTI! THAT IS SCIENCE!  

#### <a id="pa4-17-undyne-hot"></a>Variant `pa4-17-undyne-hot`

_Variant within PA4-17; it has no single parent scene._

**Undyne** _(angry)_: Nobody touches my friends! I’ll turn this whole room up to hotter than hot!  

#### <a id="pa4-17-undyne-low"></a>Variant `pa4-17-undyne-low`

_Variant within PA4-17; it has no single parent scene._

**Undyne** _(angry)_: Everybody calm down! I’m turning it down! See? Down by one! That’s me being calm!  

#### <a id="pa4-17-mettaton-pose"></a>Variant `pa4-17-mettaton-pose`

_Variant within PA4-17; it has no single parent scene._

**Mettaton** _(happy)_: Darlings, I’m only here for my co-star. The small blue one. Strike a pose, sweetheart.  

#### <a id="pa4-17-mettaton-encore"></a>Variant `pa4-17-mettaton-encore`

_Variant within PA4-17; it has no single parent scene._

**Mettaton** _(happy)_: Did someone say encore? Darlings, I never miss a cue.  

#### <a id="pa4-17-candy"></a>Variant `pa4-17-candy`

_Variant within PA4-17; it has no single parent scene._

**Asriel** _(think)_: You left me a sweet once. On the dirt, where I’d been. I found it.  
**Asriel** _(sad)_: I didn’t know what to feel about it. I didn’t know how to feel anything. I kept it anyway.  
_Your Nubbin looks up at him. It isn’t frightened at all._  

**Rewards**


Sets on completion: `{"pa4-17":true}`

**Notes:** FRIENDS (Tier 3): after pa4-17-friends line 6 (Sans), before line 7, play one ARCADE_PA4_VARIANTS scene per friend in this order: pa4-17-blook-lie | -joke (pa4-blook), pa4-17-papyrus-puzzles | -pasta (pa4-papyrus), pa4-17-undyne-hot | -low (pa4-undyne), pa4-17-mettaton-pose | -encore (pa4-mettaton). Unset (never in normal play): the first value. CANDY (signature, Tier 3): if pa4-candy = left, play ARCADE_PA4_VARIANTS pa4-17-candy after pa4-17-rise line 7 (“Don’t you remember?”), before line 8; if be, nothing. CARE: Asriel’s form is light, wings of colour and noise, never gore; the vines hold, never hurt. Flowey’s grin stays cartoon. Flowey never repeats his PA4-2 line.

## PA4-18. Asriel

*Undertale (Toby Fox, 2015): the last fight with Asriel* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-17, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-17

**Cast:** Asriel (Asriel Dreemurr, the lost prince (Undertale)), Toriel (Toriel, keeper of the Ruins (Undertale)), Papyrus (Papyrus the skeleton (Undertale)), Undyne (Undyne, captain of the Royal Guard (Undertale)), Sans (Sans the skeleton (Undertale)), Wisp

### Step 1: Call back your friends, and your Nubbin, through the dark.

Hint: Press SAVE on each friend in turn. When your Nubbin goes quiet, keep calling its name. · check: `minigame:mercy:pa4-asriel`

#### <a id="pa4-18-dark"></a>Scene `pa4-18-dark`

_The world goes dark, then bright with stars and colours, all of them coming at you and none of them landing._  
**Asriel** _(angry)_: Come on! Fight me! I’ve got everyone’s power! I’ve got everything! Why won’t you even try?  
_The child reaches into the dark and finds something: Toriel, faintly, as if from far away. She doesn’t know them._  
_The child holds on. Pie._  
_Snails. The long corridor._  
_Toriel’s eyes clear, and she smiles._  
**Toriel** _(soft)_: …My child. Of course. Of course I know you.  
_Then Papyrus._  
_Then Undyne. Then Sans, who pretends he knew all along._  
_Then your Nubbin stops. It stands beside you in the box with blank eyes, and doesn’t know you either._  
**Pixel** _(shock)_: Call it. Its name. Call it till it hears you. I’m calling too, from out here.  

**Choices**

- **Call its name. Over and over.**
    - You call.
    - You call again. On the fifth time, its crown twitches.
    - Then its eyes are its eyes, and it throws itself at your knees so hard you both sit down.
- **Sit down beside it, and say its name quietly.**
    - You sit down in the middle of the noise and the stars. You say its name, softly, again and again.
    - It looks down at you. Then it climbs into your lap, and stays.

#### <a id="pa4-18-dark-done"></a>Done `pa4-18-dark-done`

**Undyne** _(happy)_: HA! I knew it! Nobody forgets this lot for long!  
**Papyrus** _(happy)_: I REMEMBER EVERYTHING! ESPECIALLY THE SPAGHETTI!  

### Step 2: Stay with Asriel while he stops.

Hint: Don’t press anything. Let him say it. · check: `talk:pa4-asriel:sorry`

#### <a id="pa4-18-sorry"></a>Scene `pa4-18-sorry`

_The stars go out one by one. Asriel gets smaller and smaller, until he’s just a boy, kneeling on the floor._  
**Asriel** _(sad)_: I’m… I’m so sorry. I didn’t want to be alone. I didn’t want you to leave. Everyone always leaves.  
**Asriel** _(sad)_: When I was a flower I couldn’t feel anything. Not even sorry. I’m sorry now. That’s the worst part.  
_The child hugs him. He cries into their striped shoulder for a long time._  
**Asriel**: I’m going to open the barrier. And then I have to go back. When I’m a flower again, I’ll forget how to care.  
**Asriel** _(sad)_: So don’t come and find me. Please. Just… let me have been good, once.  
_He breaks the barrier. It goes up like sunlight through a window, and then it isn’t there._  

**Choices**

- **You could come with us.**
    - **Asriel**: I can’t. But thank you for asking. Nobody ever asked.
- **We’ll remember you, even if you don’t.**
    - **Asriel**: Then that’s enough. That’s more than I had.

### Complete

#### <a id="pa4-18-complete"></a>Complete `pa4-18-complete`

_Asriel walks away into the dark beyond the barrier room._  
_He doesn’t look back. That’s the only kind thing he can do._  
_Your Nubbin watches him go until there is nothing left to watch._  
**Pixel** _(soft)_: Spare the wretched one. Even if he’ll forget it. Especially then.  

#### <a id="pa4-18-candy"></a>Variant `pa4-18-candy`

_Variant within PA4-18; it has no single parent scene._

**Asriel** _(soft)_: Your little blue one. It left me that candy, didn’t it?  
**Asriel** _(soft)_: Will you give it one from me? From the bowl, in the Ruins. Tell it… tell it I said thank you.  
_Later, on the way out, you take one sweet from the bowl. Your Nubbin eats it very slowly, looking back._  

#### <a id="pa4-18-wisp-warm"></a>Variant `pa4-18-wisp-warm`

_Variant within PA4-18; it has no single parent scene._

_In the lantern shed, there’s a sound from the vent under the cabinet. Two whispers, one over the other._  
**Wisp** _(soft)_: spared… warm…  
_Pixel doesn’t say anything. She turns the cabinet’s volume down a notch, so as not to wake him._  

#### <a id="pa4-18-wisp-driven"></a>Variant `pa4-18-wisp-driven`

_Variant within PA4-18; it has no single parent scene._

**Pixel** _(sad)_: We didn’t, with ours.  
_She switches the cabinet off._  
_The shed is dark and quiet for a minute. Then she switches it back on._  

**Rewards**


Sets on completion: `{"pa4-18":true}`

**Notes:** CANDY (signature, pays off sixteen quests after PA4-2): if pa4-candy = left, play ARCADE_PA4_VARIANTS pa4-18-candy after pa4-18-sorry’s choice, before pa4-18-complete. WISP (reads wisp, Grove, read-only): after pa4-18-complete, if wisp is spared or sable play pa4-18-wisp-warm; if driven play pa4-18-wisp-driven (the cabinet goes dark for a minute, then resumes); if unset, nothing. CARE: the god form is light, noise and colour, never gore; nobody is hurt; the forgetting is shown as blank eyes, briefly, never as fear.

## PA4-19. The Surface

*Undertale (Toby Fox, 2015): the walk out of the mountain* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: Mercy (Pixel’s Arcade) · when: Any time after PA4-18, from the Mercy cartridge in Pixel’s arcade cabinet. · requires: PA4-18

**Cast:** Toriel (Toriel, keeper of the Ruins (Undertale)), Sans (Sans the skeleton (Undertale)), Papyrus (Papyrus the skeleton (Undertale)), Undyne (Undyne, captain of the Royal Guard (Undertale)), Alphys (Dr Alphys, the royal scientist (Undertale)), Asgore (King Asgore Dreemurr (Undertale))

### Step 1: Walk out of the mountain with everyone.

Hint: Go up through the place the barrier used to be. Everyone will follow. · check: `walk:pa4-mountain:sunrise`

#### <a id="pa4-19-sunrise"></a>Scene `pa4-19-sunrise`

_You all walk out of the mountain together, into the open air. It is morning._  
_The sun is coming up over a valley full of trees. None of the monsters has ever seen it._  
**Asgore** _(soft)_: Oh. Oh, look at that. I guessed sunny. All those years, and I guessed right.  
_Your Nubbin runs out into the sunlight and spins round, crown up, arms out._  
_The child stands beside Toriel, squinting. Undyne shades her eyes, and Sans takes his hands out of his pockets._  
**Pixel** _(sad)_: That’s just the sky. It’s not even a very good sky, pixel-wise. I’m crying anyway.  

#### <a id="pa4-19-sunrise-done"></a>Done `pa4-19-sunrise-done`

_Everyone stands in a row on the hillside and watches the sun come up, and nobody says anything for a while._  

### Step 2: Stay with the child while Toriel asks them something.

Hint: Stand by the child; when they answer, say goodbye to everyone. · check: `talk:pa4-toriel:home`

#### <a id="pa4-19-home"></a>Scene `pa4-19-home`

**Toriel** _(soft)_: Child. I know you have a home somewhere. But if you would like… you could come and live with me.  
_The child looks at her for a long moment. Then they nod, and take her hand._  
_Then they look up at everyone, and for the first time, they speak._  
_They tell everyone their name. It’s Frisk._  
**Toriel** _(happy)_: Frisk. What a lovely name. Thank you for telling us.  
**Papyrus** _(happy)_: FRISK! I SHALL NEVER FORGET IT! I MAY WRITE IT ON A BONE!  
_Frisk turns to you and your Nubbin, and holds out their hand. Your Nubbin shakes it, very solemnly._  
**Pixel** _(soft)_: Time to come home, you two. The cartridge is done. The good ending. The one with everybody.  

**Choices**

- **Say goodbye to Frisk.**
    - Frisk hugs you, quickly, and then hugs your Nubbin for much longer.
- **Thank Frisk for letting you come along.**
    - Frisk smiles, and points at your Nubbin, and then at their own heart. You understand.

### Complete

#### <a id="pa4-19-complete"></a>Complete `pa4-19-complete`

_The screen fades to gold. You are standing in the lantern shed, with your Nubbin, in a striped jumper that wasn’t there before._  
_Pixel leans back from the cabinet. Her taped MERCY button sits beside her, and a pot with one golden flower in it._  
**Pixel** _(happy)_: I typed our names on the high score. There wasn’t a score. I typed them anyway.  
**Pixel** _(soft)_: Nobody got hurt. Not one. That’s the high score.  

#### <a id="pa4-19-blook-lie"></a>Variant `pa4-19-blook-lie`

_Variant within PA4-19; it has no single parent scene._

**Napstablook** _(happy)_: i’m going to lie down in the grass. it’s like the ruins floor, but it’s green. …it’s nice.  

#### <a id="pa4-19-blook-joke"></a>Variant `pa4-19-blook-joke`

_Variant within PA4-19; it has no single parent scene._

**Napstablook** _(happy)_: what do you call a ghost in the sunshine? …i don’t know yet. i’ll think of one. for you.  

#### <a id="pa4-19-papyrus-puzzles"></a>Variant `pa4-19-papyrus-puzzles`

_Variant within PA4-19; it has no single parent scene._

**Papyrus** _(happy)_: THE SURFACE HAS NO PUZZLES YET! I MUST BUILD SOME AT ONCE! FOR TOURISM!  

#### <a id="pa4-19-papyrus-pasta"></a>Variant `pa4-19-papyrus-pasta`

_Variant within PA4-19; it has no single parent scene._

**Papyrus** _(happy)_: I WILL OPEN A SPAGHETTI RESTAURANT ON THE SURFACE! YOU WILL ALL EAT FOR FREE! PLEASE COME!  

#### <a id="pa4-19-undyne-hot"></a>Variant `pa4-19-undyne-hot`

_Variant within PA4-19; it has no single parent scene._

**Undyne** _(happy)_: The sun! It’s HOT! I love it! Alphys, look, it’s the biggest stove in the world!  

#### <a id="pa4-19-undyne-low"></a>Variant `pa4-19-undyne-low`

_Variant within PA4-19; it has no single parent scene._

**Undyne** _(soft)_: …Huh. It’s warm, but it’s not too hot. Somebody turned the sky down. I like it.  

#### <a id="pa4-19-mettaton-pose"></a>Variant `pa4-19-mettaton-pose`

_Variant within PA4-19; it has no single parent scene._

**Mettaton** _(happy)_: Perfect light. Perfect angle. Darling blue one, one last pose, for the first sunrise.  

#### <a id="pa4-19-mettaton-encore"></a>Variant `pa4-19-mettaton-encore`

_Variant within PA4-19; it has no single parent scene._

**Mettaton** _(happy)_: A sunrise! Darlings, what an opening. I want an encore of this tomorrow.  

#### <a id="pa4-19-flower-turns"></a>Variant `pa4-19-flower-turns`

_Variant within PA4-19; it has no single parent scene._

_Last of all, the screen shows the Ruins one more time. A golden flower in the dark lifts its head._  
_It turns, very slowly, towards the light._  

#### <a id="pa4-19-flower-still"></a>Variant `pa4-19-flower-still`

_Variant within PA4-19; it has no single parent scene._

_Last of all, the screen shows the Ruins one more time. A golden flower in the dark doesn’t move._  

**Rewards**

- Striped Jumper (cosmetic): Blue and pink stripes, in Nubbin size. From a friend who never needed to hurt anyone.
- Golden Flower Pot (decor): One golden flower in a clay pot, for beside the cottage door. It never says a word.
- Mercy High-Score Plate (item): A brass plate for High Score Night. Score: nobody hurt.

Sets on completion: `{"pa4-19":true,"pa4-done":true}`

**Notes:** FRIENDS (Tier 3): after pa4-19-sunrise line 2 (Asgore), before line 3, play one ARCADE_PA4_VARIANTS scene per friend in this order: pa4-19-blook-lie | -joke, pa4-19-papyrus-puzzles | -pasta, pa4-19-undyne-hot | -low, pa4-19-mettaton-pose | -encore. LAST FRAME (signature): after pa4-19-home’s choice, before pa4-19-complete, play pa4-19-flower-turns if pa4-candy = left, pa4-19-flower-still if be. AFTER THE CARTRIDGE: once pa4-19-complete ends, if wisp is spared or sable play pa4-end-wisp-asleep; if s21Done play pa4-end-clank. REWARDS (one-time): the Striped Jumper cosmetic, the Golden Flower Pot decoration (by the cottage door) and the high-score plate. SIM: pa4-done counts towards High Score Night (any two of PA1–PA5 done). CREDITS NOTE: “The neutral ending is not shown in this cartridge.”

## Variant scenes

Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).

#### <a id="pa4-end-wisp-asleep"></a>Variant `pa4-end-wisp-asleep`

_Later, when you look back into the shed, Wisp is asleep on top of the cabinet, curled up where it’s warm._  
**Pixel** _(soft)_: Leave him. He’s earned the warm spot. I’ll turn the screen down.  

#### <a id="pa4-end-clank"></a>Variant `pa4-end-clank`

_Clank gets down off the cabinet, very carefully, and pats the taped MERCY button once, like your Nubbin did._  
