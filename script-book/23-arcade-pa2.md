# Pixel's Arcade, cartridge PA2: The Clone Island

## PA2-1. The Cabinet

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: the frame* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time once Pixel’s cabinet stands in the lantern shed (after chapter 5); cartridges play in any order.

**Cast:** Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only)

### Step 1: Help Pixel slot the purple cartridge into the cabinet.

Hint: Go to the lantern shed and inspect the cartridge on Pixel’s bench. · check: `inspect:pa2-cartridge:cabinet`

#### Scene `pa2-01-shed`

_The lantern shed smells of solder and old sawdust. The cabinet hums in the corner, under a string of lantern bulbs._  
_Pixel is sitting on an upturned crate in front of it, with a cartridge in her lap._  
**Pixel** _(happy)_: Found this one wedged behind the coin box. With the mouse nest. The mice had good taste.  
_She blows the dust off. The label is faded, but there is a shape on it, purple, with a long tail._  
**Pixel** _(think)_: Purple’s the hardest ink to keep. It’s always the first to go.  
_Byte is standing behind her chair with his arms folded, as if the chair might do something._  
**Byte**: I’m here to check the maths. Arcades are probability with a coin slot.  
**Pixel**: He’s here because I said there’d be biscuits.  
**Byte**: That too.  

**Choices**

- **Blow on the cartridge too, for luck.**
    - **Pixel**: That doesn’t do anything, you know. Electrically.
    - **Pixel**: Do it again.
- **Ask what it’s about.**
    - **Pixel**: No idea. The writing’s gone. I like that, actually. You go in not knowing, like a door.
- **Ask Byte what the odds are.**
    - **Byte**: Of what?
    - **You**: Of it being good.
    - **Byte**: Insufficient data. Which is the honest answer to most things.

#### Done `pa2-01-title`

_The cartridge goes in with a clunk. The screen fizzes, then a title rises out of the dark: an island, and over it, a shape._  
**Byte** _(think)_: If this is about cloning, you can’t clone anything from an eyelash. Not reliably. People think you can.  
**Byte**: I’m getting a biscuit.  
_He goes. Pixel watches him go, then turns back to the screen._  

### Step 2: Step into the cartridge with your Nubbin.

Hint: Touch the cabinet’s screen with your Nubbin in your arms, then look about the hillside. · check: `explore:pa2-hillside:harbour`

#### Scene `pa2-01-step`

_You put your hand flat on the glass. It is warm, then warmer, and then it isn’t glass._  
_You are standing on a hillside in long grass, with your Nubbin in your arms. Below you is a harbour town, and a grey sea._  
_There are gulls, and boats knocking together, and a smell of salt and somebody’s chips._  
**Pixel**: Can you hear me? Nod if you can hear me. No, wait, I can’t see you nod. Say something.  
**You**: I can hear you.  
**Pixel** _(happy)_: Brilliant. I’m player two. I’ve got a little window of you in the corner. You look tiny.  
_Your Nubbin wriggles down and sniffs the grass, and sneezes. The grass is the right sort._  
_Far out to sea, under a band of dark cloud, there is an island with something tall on it._  

#### Done `pa2-01-step-done`

**Pixel**: The cartridge says you’re a visiting trainer. With an invitation, it says. You haven’t got it yet.  
**Pixel** _(soft)_: It also says you don’t battle. Good. Neither of you is the battling sort.  

#### Complete `pa2-01-complete`

_The screen in the corner of the sky flickers. The hillside goes dim, as if a cloud has come over the whole world._  
**Pixel**: Hang on. It’s doing a prologue. There’s a card first, on the back of the label. I’ll read it.  
**Pixel**: “The next part happens before you arrived. You can watch it. You can’t change it.”  
_Your Nubbin comes back and sits on your foot._  
**Pixel** _(soft)_: It says there’s a laboratory, and goodbyes, and a fire seen from a long way off.  
**Pixel** _(soft)_: Nobody gets hurt where you can see. And you can come out whenever you like. I’m right here.  

**Rewards**


Sets on completion: `{"pa2-01":true}`

**Notes:** OPENING: the cabinet is Pixel’s rescued Workyard cabinet in the lantern shed. With s21Done play ARCADE_PA2_VARIANTS pa2-01-shed-clank instead of pa2-01-shed; with s7Done play pa2-01-title-s7 instead of pa2-01-title. Byte is drawn standing behind Pixel’s chair in every cabinet cut-away from here on; without s7Done his place is empty until PA2-15. Pixel’s voice comes through the cabinet speaker, so give it a slight speaker crackle. CONTENT LINE: pa2-01-complete#4 and #5 are the soft content line the outline asks for before PA2-2; show the scene even when the player skips text, and offer a Leave button on the pause menu at all times.

## PA2-2. The Voice in the Tank

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: the origin short, The Birth of Mewtwo* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-1, from Pixel’s cabinet. · requires: PA2-1

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Amber (Ambertwo, the copy of Dr Fuji’s late daughter, from the origin short The Birth of Mewtwo (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Dr Fuji (Dr Fuji, the scientist who made Mewtwo (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Watch the laboratory from behind the glass.

Hint: Stand at the observation window and look at the tank in the middle of the room. · check: `watch:pa2-tank:lab`

#### Scene `pa2-02-lab`

_A dark room full of humming. You are on the far side of a long window, and your Nubbin’s breath fogs the glass._  
_In the middle of the room stands a tank of green water, lit from below. Something curled up is floating in it._  
_It is the size of a child, and it has a tail. Every so often its fingers open and close._  
_Round it stand smaller tanks. In each one floats a little creature: one with a bulb on its back, one with a flame, one with a shell._  
_A grey-haired man in a white coat writes on a clipboard without looking up. He hasn’t looked up for a long time, you think._  
**Pixel** _(think)_: That’s Dr Fuji. The label says so. He’s the one who made all this.  
_Then, in the quiet, a voice. Not out loud: inside your head, like remembering a voice._  
**Amber**: Hello? Are you awake? You are. I can tell. You went all still.  

**Choices**

- **Tap on the glass.**
    - Your knuckles make no sound at all. The glass might as well be the sky.
    - **Pixel**: Sorry. The prologue doesn’t let anyone touch it. I tried.
- **Keep still and listen.**
    - You keep still. Your Nubbin keeps still too, its nose against the window, the way it waits for a fish.
- **Pick your Nubbin up.**
    - You pick it up. It is warm and heavy and alive, and it doesn’t take its eyes off the tank.

#### Done `pa2-02-lab-done`

_The curled thing in the big tank turns its head, very slightly, towards the voice._  
**Mewtwo**: Who… is speaking?  

### Step 2: Listen to Amber and the new mind talk.

Hint: Stay at the window while the voices talk. There is nothing to press. · check: `watch:pa2-amber:lab`

#### Scene `pa2-02-amber`

**Amber**: I’m Amber. I’m in the tank next to yours. Well, three tanks along. The little ones are in between.  
**Mewtwo**: What is a tank?  
**Amber** _(happy)_: It’s where we’re growing. Papa says we’re nearly ready. Then we get to go outside.  
**Mewtwo**: What is outside?  
**Amber**: The sun’s outside. It’s warm on your face, and it makes your eyes go small. And there’s rain, which is the sky being wet.  
**Amber** _(happy)_: And there are people who are glad to see you. That’s the best bit.  
_In the small tanks the three little creatures turn over in their sleep, as if they are listening too._  
**Mewtwo**: I would like the sun.  
**Amber** _(happy)_: You’ll have it. We’ll go out together and I’ll show you. I’ll show you everything.  

#### Done `pa2-02-amber-done`

_Dr Fuji stops writing. He looks at Amber’s tank for a long moment, and takes his glasses off, and puts them back on._  
**Pixel** _(sad)_: He made her to be like someone. Someone he lost. It’s on the card.  

### Step 3: Stay with them until the prologue ends.

Hint: Wait at the window. You can come out of the cartridge at any time from the pause menu. · check: `wait:pa2-prologue:lab`

#### Scene `pa2-02-fade`

_In the first of the small tanks, the little creature’s light begins to go out. Slowly, like a lantern turned down._  
_Then the second, then the third. There is nothing left in the water but water._  
**Mewtwo**: Where did they go?  
**Amber** _(soft)_: I think it’s my turn soon. I can feel it. I’m not frightened, it’s more like being sleepy.  
**Mewtwo**: Do not go.  
**Amber** _(soft)_: Listen. Life is a lovely thing. Even a short one. Remember that, will you? Remember the sun for me.  
_Her light goes out the way the others did: no sound, no fuss, only less of it, and then none._  
_Something runs down the face of the creature in the big tank. In the water, you can only just see it._  
**Mewtwo**: What is this? My eyes are doing something. I do not have a word for it.  
_Dr Fuji’s hand moves on a switch. The green light dims, and the creature in the tank goes still again._  
**Dr Fuji** _(sad)_: Sleep. Forget. It will be easier for you.  

#### Complete `pa2-02-complete`

_The window goes dark. You are standing in the grass again, on the hillside, and it is evening._  
_Your Nubbin is pressed against your shins. Its ball has gone to a spiral._  
**Pixel** _(sad)_: The word was crying. He didn’t have it. He was crying and he didn’t have the word.  
**Pixel** _(soft)_: Sorry. I didn’t know it would be that one first.  
_You sit down in the grass and let your Nubbin climb into your lap. The sea goes on knocking the boats together below._  

**Rewards**


Sets on completion: `{"pa2-02":true}`

**Notes:** STAGING: the player stands behind a long observation window the whole quest and cannot move past it. Amber, Mewtwo and the three small copies (Bulbasaur, Charmander and Squirtle, as in the short) are only seen floating in tanks. FADING: each copy and Amber fade the way a Nubbin departs in the Grove: the light inside goes down to nothing, the tank stays, there is no body and no flatline sound. Slow, quiet music; no alarms. Mind-to-mind voices (Mewtwo, Amber) get a soft echo and no lip movement. The card in PA2-1 has already given the soft content line.

## PA2-3. The Awakening

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Mewtwo wakes, the lab burns, Giovanni arrives* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-2, from Pixel’s cabinet. · requires: PA2-2

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Dr Fuji (Dr Fuji, the scientist who made Mewtwo (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Giovanni (Giovanni, the boss of Team Rocket, who paid for the lab (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Watch the made creature wake for good.

Hint: The window comes back. Stand at it and watch. · check: `watch:pa2-wake:lab`

#### Scene `pa2-03-wake`

_The hillside folds away and the window is back. The lab is brighter now and busier, and the small tanks have gone._  
_The big tank is cracked across the middle. The creature in it is grown, and its eyes are open._  
_The glass breaks all at once, softly, like ice in spring. Water runs across the floor to the window._  
**Mewtwo** _(shock)_: Where am I? What am I? Who made me, and why?  
**Dr Fuji** _(happy)_: You are awake. Wonderful. Wonderful!  
**Dr Fuji**: You are Mewtwo. You are made from the strongest creature ever found, and made stronger. You are our greatest experiment.  
**Mewtwo**: An experiment.  
**Dr Fuji** _(happy)_: The greatest. Proof of what we can do. Everyone will know it.  
_The made creature looks at his own hands, then at the men in white coats, writing it down._  
**Mewtwo** _(angry)_: Then I am a thing you did. Not a someone. A thing.  

**Choices**

- **“That’s not what he meant.”**
    - Nobody hears you. You aren’t sure it would be true anyway.
- **Say nothing. Hold your Nubbin.**
    - You hold your Nubbin. It is the one thing in the room nobody calls an experiment.

#### Done `pa2-03-wake-done`

_The lights in the lab go white. Then the window goes white too, and you are thrown back to the hillside like a page turning._  
**Pixel** _(shock)_: Get up the hill. Get up the hill, it says, quick.  

### Step 2: Watch from the cliff as the lab burns in the rain.

Hint: Climb to the top of the cliff path and look out to sea. · check: `climb:pa2-cliff:new-island`

#### Scene `pa2-03-fire`

_You are on a cliff now, a different one, out at sea. It is night, and it is raining hard._  
_Below you on the shore, the laboratory is burning. Orange through the rain, very far down, very quiet from up here._  
_Nobody is shown. The cartridge keeps the picture on the rain, and the fire, and the sea._  
**Pixel** _(sad)_: I can’t see anyone. It won’t show me. I’ve pressed everything.  
_In the middle of the fire, something stands up and walks out of it, and the rain hisses where it steps._  
_He looks back at the burning building once. Then he doesn’t look back again._  
_Your Nubbin is soaked and doesn’t care. It is watching the walking figure, very hard, the way it watches strangers._  

#### Done `pa2-03-fire-done`

_A sound comes over the sea: a helicopter, a light swinging under it. It comes down on the shore beside the fire._  
**Pixel** _(think)_: Somebody’s been waiting for this. You don’t arrive that fast unless you were waiting.  

### Step 3: See who has come for the made creature.

Hint: Watch the shore below the cliff. · check: `watch:pa2-giovanni:new-island`

#### Scene `pa2-03-offer`

_A man steps down from the helicopter in a good suit, with an umbrella held over him by somebody else._  
**Giovanni**: Remarkable. They said you would be. They undersold you.  
**Mewtwo**: Who are you?  
**Giovanni**: I paid for the building. And the tanks, and the doctor. In a way, I paid for you.  
**Giovanni**: You have more power than anything alive. Nobody has taught you how to use it. I can.  
**Mewtwo**: Why would you?  
**Giovanni**: Because a power like yours needs a purpose. I can give you one. Come with me, and you will never wonder what you are for.  
_Mewtwo looks at the fire, and at the rain, and at the man’s hand held out under the umbrella._  
_Then he walks forward into the light of the helicopter._  

#### Complete `pa2-03-complete`

_The helicopter lifts away. The fire burns down in the rain until it is only smoke and ash._  
**Pixel** _(sad)_: He took the first answer anyone gave him. You would, wouldn’t you. If you had nothing.  
_Your Nubbin shakes itself dry all over your trousers, and then looks up at you to see if that was all right._  
_It was. You tell it so._  

**Rewards**


Sets on completion: `{"pa2-03":true}`

**Notes:** FIRE (care note): seen only from the cliff, far below, through heavy rain. No people are drawn anywhere near it; nobody is named as dead, and nobody is said to have escaped either. The only figure is Mewtwo walking out. Rain sound over the fire sound. The helicopter lands on the shore well clear of the fire. Giovanni’s face is lit from below by the helicopter lamp; keep him calm and polite, never sneering.

## PA2-4. The Armour

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Mewtwo at the Viridian Gym* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-3, from Pixel’s cabinet. · requires: PA2-3

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Giovanni (Giovanni, the boss of Team Rocket, who paid for the lab (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Watch Mewtwo’s battles from the stands at the Viridian Gym.

Hint: Find a seat in the stands and watch the arena floor. · check: `watch:pa2-gym:viridian`

#### Scene `pa2-04-stands`

_A big hall with a battle floor in the middle and stands all round. You are in the back row with your Nubbin on your knee._  
_On the floor, Mewtwo stands in armour: grey plates on his shoulders and a helmet that hides his face._  
_Cables run from the armour to a box at Giovanni’s side. Giovanni sits in a high chair at the end of the hall._  
_A challenger sends out a creature, and it is over in a breath. Then another, and another, each over as fast._  
**Giovanni**: Next.  
_The crowd stopped cheering a while ago. Now it just watches, the way you watch weather._  
**Pixel** _(think)_: He’s not even trying. He doesn’t need to. That’s worse, somehow.  

**Choices**

- **Clap for the challengers.**
    - You clap for the next one as they walk on, and a few people turn round. A girl two rows down starts clapping too.
- **Put a hand over your Nubbin’s eyes.**
    - Your Nubbin moves your hand aside, politely, and keeps watching. It wants to know what is happening to the one in armour.
- **Watch Mewtwo, not the battles.**
    - Between battles, every time, the helmet turns very slightly towards Giovanni’s chair. As if checking.

#### Done `pa2-04-stands-done`

_The last challenger goes home and the hall empties. You stay where you are, and the cartridge lets you._  

### Step 2: Stay and see what Mewtwo works out.

Hint: Wait in the empty stands while Giovanni and Mewtwo talk. · check: `wait:pa2-stands:viridian`

#### Scene `pa2-04-tool`

**Mewtwo**: Who were they? The ones I beat today.  
**Giovanni**: Nobody important. Practice.  
**Mewtwo**: And when there is no more practice? What then?  
**Giovanni** _(think)_: Then you do what I tell you, where I tell you. That is what you are for.  
**Mewtwo**: You said we were partners.  
**Giovanni**: I said I would give you a purpose. I have. You were made by people, for people. You are mine to use.  
_The armour creaks. One of the shoulder plates has a crack running through it that wasn’t there a moment ago._  
**Mewtwo** _(angry)_: Made by people. Used by people. Is that all there is to me?  

#### Done `pa2-04-tool-done`

_The helmet splits down the middle and falls to the floor in two halves. Then the shoulder plates go, and then the rest._  
_Your Nubbin flinches at the noise and burrows into your coat._  

### Step 3: Watch Mewtwo leave.

Hint: Go up to the gym’s roof and look out over the city. · check: `watch:pa2-flight:viridian`

#### Scene `pa2-04-leave`

_There is a long, low sound under the floor, and the lights go out one row at a time._  
_Somewhere below, Giovanni’s headquarters are coming apart: walls, machines, all of it, though nobody is hurt in the picture._  
_You come out on the roof. Mewtwo is standing in the air above the city, without his armour, his tail moving slowly._  
**Mewtwo** _(angry)_: I was not born. I was made, and lied to, and used. I will not be anyone’s again.  
**Mewtwo**: I will go back to where I began, and I will decide what I am myself.  
_He turns towards the sea, towards the island, and is gone so fast that the clouds close behind him._  
_Your Nubbin climbs out of your coat and looks at the hole in the clouds for a long time._  

#### Complete `pa2-04-complete`

_The cartridge fades to the cabinet’s little corner window: the lantern shed, Pixel’s face lit blue by the screen._  
_Behind Pixel’s chair there is nobody. The biscuit tin still isn’t back._  
**Pixel** _(soft)_: He asked what he was for, and somebody answered.  
**Pixel** _(sad)_: That’s the worst thing you can do to someone, I think. Answer that one for them.  

**Rewards**


Sets on completion: `{"pa2-04":true}`

**Notes:** BYTE (s7Done): play ARCADE_PA2_VARIANTS pa2-04-complete-s7 instead of pa2-04-complete: Byte is behind the chair and says nothing. Pixel’s line is the outline’s own, original, and plays in both. HEADQUARTERS: show the building shaking and lights going out; no people in the shot. Mewtwo’s armour and the gym are licensed designs.

## PA2-5. The Lunch Battle

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Ash’s lunch, Raymond, the Dragonite and the invitation* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-4, from Pixel’s cabinet. · requires: PA2-4

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Raymond (Raymond, the trainer who challenges Ash at lunch (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Nurse Joy (Nurse Joy of Old Shore Wharf, first seen as Mewtwo’s cloaked messenger (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Walk down to the meadow and watch the lunch battle.

Hint: Follow the path down the hillside to the meadow where three travellers are eating. · check: `watch:pa2-raymond:meadow`

#### Scene `pa2-05-lunch`

_Morning, and the hillside again, in sunshine this time. Below you in a meadow, three travellers are having lunch on a blanket._  
_A boy in a red cap, a girl with an orange ponytail, and a tall young man stirring a pot. A small yellow creature is eating an apple._  
**Pixel** _(happy)_: Ash, Misty, Brock. And that’s Pikachu. He’s the famous one. Be cool.  
**Brock**: Lunch in five minutes. Nobody battle anybody.  
_A boy in a sharp jacket comes over the stile and points straight at Ash._  
**Raymond**: You there. I’ve heard about you. I challenge you. One on one, right now.  
**Ash**: Now? I’m starving.  
**Raymond**: Scared?  
**Ash** _(happy)_: Pikachu! You’re on!  

**Choices**

- **Offer to keep the stew from burning.**
    - **Brock**: A trainer who stirs. You can stay.
    - You stir. Your Nubbin sits by the pot, watching the stew as if it might escape.
- **Sit with Misty and watch.**
    - **Misty**: He always says yes. Always. Even before lunch. Especially before lunch.
    - She sounds cross. She is smiling.

#### Done `pa2-05-lunch-done`

_It doesn’t take long. The challenger’s creature sits down in the grass, dazed but fine, and Raymond stares at it._  
**Raymond**: That’s… not how that was supposed to go.  
**Ash** _(happy)_: Good battle! Want some lunch?  

### Step 2: Take the letter the Dragonite brings you.

Hint: When the big orange flyer lands, go and take the letter with your name on it. · check: `collect:pa2-letter:dragonite`

#### Scene `pa2-05-letters`

_A shadow crosses the blanket. Something big and orange and kind-faced lands in the meadow, flapping small wings._  
_It is carrying a bag of letters. It hands one to Ash, very gently, and then looks round at you._  
_It holds out a second envelope. Your name is on it, written in a careful hand._  
**Misty**: Who even knows you’re here?  
**You**: I’m not sure anybody does.  
_Your Nubbin reaches up and pats the big creature’s foot. The creature pats your Nubbin’s head, with one claw, very carefully._  

#### Done `pa2-05-letters-done`

_You open the envelope. Inside is a round disc, and when you touch it, light comes out._  

### Step 3: See the invitation through.

Hint: Watch the message in the disc to the end. · check: `watch:pa2-hologram:meadow`

#### Scene `pa2-05-hologram`

_A small woman made of light stands on the disc in a long cloak, her face hidden by the hood. Her voice is very calm._  
**Nurse Joy**: You are invited to New Island, to meet the greatest master of them all.  
**Nurse Joy**: You have been chosen as one of the finest trainers in the world. Come to Old Shore Wharf. A boat will be waiting.  
_The light goes out. Ash is already packing his bag._  
**Ash** _(happy)_: The greatest master? I have to meet them. I have to!  
**Brock** _(think)_: That voice. I know that voice. Where do I know that voice from?  
**Pixel** _(think)_: That letter’s the invitation the cartridge was talking about. You’re in it now.  

**Choices**

- **Ask if you can walk with them.**
    - **Ash**: Sure! The more the merrier. What’s that you’ve got? Is it a Pokémon?
    - **You**: It’s a Nubbin.
    - **Ash**: Never heard of one!
- **Ask Brock where he knows the voice from.**
    - **Brock**: If I knew, I’d tell you. It’s right on the tip of my tongue.
    - **Misty**: It’s a girl. He thinks he knows every girl.

#### Complete `pa2-05-complete`

_You set off down the coast road together, five of you and two small creatures, towards the wharf._  
_Out at sea the band of cloud has got darker. There is the island under it, and the tall thing on the island._  
**Pixel** _(think)_: I’ve got a bad feeling about the weather. The cartridge has got rain in it. Lots.  

**Rewards**


Sets on completion: `{"pa2-05":true}`

**Notes:** STAGING: Ash, Misty, Brock and Pikachu are licensed designs. The lunch battle is short and bright: one exchange, no damage shown, Raymond’s creature dazed and sitting up. Dragonite (licensed) delivers the letters. The hologram disc projects the cloaked woman; her face is never seen until PA2-8. Pikachu never speaks a line in this cartridge; use his licensed voice clips only if the licence allows, otherwise none.

## PA2-6. Old Shore Wharf

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: the wharf, the storm and Miranda’s story* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-5, from Pixel’s cabinet. · requires: PA2-5

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Miranda (Miranda, the pier keeper at Old Shore Wharf, who tells the old story (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Neesha (Neesha, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Fergus (Fergus, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Corey (Corey, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Reach Old Shore Wharf and find out why the ferry isn’t running.

Hint: Walk along the harbour to the pier and talk to the woman at the gate. · check: `talk:pa2-miranda:pier`

#### Scene `pa2-06-wharf`

_Old Shore Wharf is a row of wet planks in a wind that wants your hat. The sea is the colour of slate, and getting bigger._  
_There is a little Pokémon Center at the end of the street. The lights are on and the door is open, and nobody is there._  
**Brock** _(think)_: No nurse. There’s always a nurse.  
_By the pier gate stands a woman in a long oilskin with a lantern, turning people away._  
**Miranda**: No boats. Not today. Not in this. The harbour’s shut, and so’s the sea.  
_Three trainers are arguing with her: a girl with a shell on her belt, a big man in a leather coat, a tall boy with neat hair._  
**Fergus** _(angry)_: We’re invited. We’re expected.  
**Neesha**: We’ll go on our own, then. My partner can swim it.  
**Corey**: Mine can fly it. See you over there.  
_They go off to the end of the pier, each in a different direction, without looking at each other._  

#### Done `pa2-06-wharf-done`

**Miranda**: Fools. Well. Clever fools. Come in out of it, the rest of you, before you blow away.  

### Step 2: Help Miranda make tea in the pier hut while she tells her story.

Hint: Fill the kettle from the barrel, set it on the stove, and warm the cups. · check: `craft:pa2-tea:pier-hut`

#### Scene `pa2-06-tea`

_The pier hut is small and warm and smells of paraffin. Miranda gives you the kettle without asking whether you know how._  
**Miranda**: Barrel’s by the door. Fill it to the dent, not the brim. Then it goes on the stove, and you wait. Waiting’s the main part.  
_Your Nubbin finds the warm place in front of the stove and lies down in it as if it has been there for years._  
**Miranda**: You know there’s an old story about storms like this one. Told it to my grandchildren. They didn’t believe me.  
**Miranda** _(sad)_: Long ago, the sea came up in a storm and drowned this whole shore. People. Creatures. Everyone fighting each other, before.  
**Miranda**: And the creatures that were left wept. All of them, every kind, for the ones on the sand.  
**Miranda** _(soft)_: And where their tears fell, the ones on the sand woke up again.  
_The kettle starts to tick. Ash has stopped fidgeting, and Misty has her hands round an empty cup._  
**Miranda**: Never seen it, mind. It’s a story. But you don’t keep a story that long for nothing.  

**Choices**

- **“Do you think it’s true?”**
    - **Miranda**: I think it’s true that people need it to be. That’s a kind of true. Pour, it’s boiling.
- **Warm the cups and say nothing.**
    - **Miranda**: Good. You warm the cups first. Somebody brought you up right.
    - You think of Hazel’s kitchen, and the cups on the hooks.
- **Look at your Nubbin by the stove.**
    - Your Nubbin is asleep with its paws over its nose. Its ball has gone soft and round, the way it does when it is safe.

#### Done `pa2-06-tea-done`

_You pour. Miranda takes hers without milk and drinks it scalding, the way people do who work outside._  
**Pixel** _(think)_: Remember that story. Writing it down. Pixel’s orders.  

#### Complete `pa2-06-complete`

_The rain hammers the hut roof. Outside, a boat bumps against the pier where no boat should be._  
**Miranda**: Take this. You’ll want a light that doesn’t blow out. I’ve another.  
_She gives you a storm lantern: brass, dented, with a glass that has been mended once. It is still warm from her hand._  
**Miranda**: And remember the story. You never know which ones are for using.  

**Rewards**

- Miranda’s storm lantern (decor): A dented brass storm lantern from Old Shore Wharf, with a glass mended once. It hangs from a hook and never blows out.

Sets on completion: `{"pa2-06":true}`

**Notes:** TEA: a small craft step in the pier hut: fill the kettle at the barrel (to the dent), set it on the stove, warm the cups. No timer. The story is told while the kettle heats. Neesha, Fergus and Corey leave by their own creatures (swimmer, Gyarados-sized sea creature, flyer), as in the film. The empty Pokémon Center is a clue: its Nurse Joy is the cloaked woman. REWARD: Miranda’s storm lantern (decoration) is given here, inside the cartridge, and appears in the Grove when the cartridge is next exited.

## PA2-7. The Boat

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Team Rocket’s boat and the storm crossing* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-6, from Pixel’s cabinet. · requires: PA2-6

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Jessie (Jessie of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), James (James of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Accept a lift from the two odd boatmen.

Hint: Go down to the boat at the end of the pier. · check: `walk:pa2-boat:pier`

#### Scene `pa2-07-boatmen`

_At the end of the pier, a wooden boat with a dragon’s head on the front. Two rowers in horned helmets and false beards._  
**Jessie**: Ahoy, weary travellers! Need a boat to an island? Any island? Particularly that island?  
**James**: Very reasonable prices. Very safe boat. Hardly any holes.  
_One of the beards is slipping. Under it there is a very familiar sort of chin._  
_In the bottom of the boat, under a tarpaulin, something with a coin on its forehead is pretending to be a coil of rope._  
**Misty**: Are those… real beards?  
**Jessie** _(angry)_: Of course they are! We grew them! Specially! Get in!  
**Ash** _(happy)_: Great! Thanks!  

**Choices**

- **Point out the rope has whiskers.**
    - **Meowth**: Rope don’t got whiskers. Rope is rope. Get in da boat.
    - The rope looks at you with two very annoyed eyes.
- **Get in. It’s the only boat.**
    - You get in. Brock sits down next to you and looks at the sky, and then at the rowers, and then at the sky.

#### Done `pa2-07-boatmen-done`

_The boat pushes off. For about a hundred strokes it is nearly fine._  

### Step 2: Keep your Nubbin above the waves.

Hint: When the boat goes over, swim towards your Nubbin and hold it up until the swimmers reach you. · check: `swim:pa2-sea:storm`

#### Scene `pa2-07-storm`

_A wave comes up taller than the boat, and the boat climbs it, and the top of it is the wrong way up._  
_Then you are in the sea. It is cold the way stone is cold, all at once and all over._  
_Your Nubbin is a little way off, its ball a bright dot in the grey. It is doing what Marina taught Hazel’s Nubbins._  
_Big breath, ears flat. Float on its back like a cork, and wait for you._  
_You reach it. You hold it up out of the water, against your chin, and it lets out its breath in a puff._  
**Ash** _(shock)_: Squirtle! Help everybody!  
**Misty** _(shock)_: Staryu, you too! Get them!  
_Something round and blue bobs up beside you and gets a shoulder under your arm. A star-shaped one spins past with Brock._  
_They swim for the island. You let them, and you hold on, and you don’t let go of your Nubbin._  

#### Done `pa2-07-storm-done`

_Stone steps come up out of the sea. You crawl up them with your Nubbin under your chin, and the blue one pats your back._  
**Pixel** _(shock)_: You’re all right. You’re all right. I saw the whole thing. I didn’t like it.  

#### Complete `pa2-07-complete`

_You sit on the steps, wet through. Your Nubbin shakes, and sneezes, and climbs into your coat where it is least wet._  
_Far behind you, the dragon-headed boat floats upside down. Three voices are arguing under it._  
**James**: Hardly any holes, I said! I didn’t say no holes!  
_Above you, through the rain, steps lead up to a castle with a tall tower and a light in one window._  

**Rewards**


Sets on completion: `{"pa2-07":true}`

**Notes:** SWIM: the player swims a short way in heavy swell to their Nubbin and holds it up; Ash’s Squirtle and Misty’s Staryu then carry everyone. No failure state: if the player stops, Squirtle reaches them anyway. Your Nubbin floats on its back, ears flat, the way Marina taught Hazel’s Nubbins (campaign canon). Team Rocket’s Viking disguise follows the film. Meowth may speak (a source talking creature).

## PA2-8. New Island

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: the castle hall, Nurse Joy and Mewtwo’s challenge* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-7, from Pixel’s cabinet. · requires: PA2-7

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Nurse Joy (Nurse Joy of Old Shore Wharf, first seen as Mewtwo’s cloaked messenger (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Neesha (Neesha, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Fergus (Fergus, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Corey (Corey, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Follow the cloaked woman into the castle.

Hint: Climb the steps and walk with the woman in the cloak to the great hall. · check: `walk:pa2-joy:castle-hall`

#### Scene `pa2-08-steps`

_At the top of the steps a woman in a long cloak is waiting, with a lamp. The woman from the disc._  
**Nurse Joy**: Welcome. You have done well to come so far. Please, follow me.  
_Her voice is just as calm as the disc’s, too calm. It is as if somebody else is choosing the words and she is only carrying them._  
**Brock** _(think)_: It’s you. I knew it. I know you from somewhere.  
**Nurse Joy**: This way.  
_The doors open on a great hall with a long table, and a fire, and a high glass roof with the rain sliding down it._  
_Three trainers are already there, steaming by the fire: Neesha, Fergus and Corey. They got across._  
**Fergus**: Took your time.  
**Neesha**: Did you swim? You look like you swam.  

#### Done `pa2-08-steps-done`

_The woman stops at the head of the table and raises one hand. The fire goes small, and every lamp in the hall dims._  

### Step 2: Stand your ground in the hall when the host arrives.

Hint: Stay by the long table and watch the stairs. · check: `watch:pa2-mewtwo:castle-hall`

#### Scene `pa2-08-host`

_Down the stairs, without touching them, comes Mewtwo. He is taller than you remember, and his eyes are very still._  
**Mewtwo**: Thank you for coming. You are the strongest trainers in the world, or near enough.  
**Mewtwo**: You will not need her any more.  
_The cloaked woman sways, and her hood falls back. She blinks at the hall like someone who has been asleep standing up._  
**Nurse Joy** _(shock)_: Where… This isn’t the Center. Who are all of you?  
**Brock** _(happy)_: Nurse Joy! The nurse from the wharf! That’s where I know you from!  
_Fergus has had enough. His big sea creature rears up behind him and opens its jaws, and a beam of light comes out._  
_Mewtwo lifts one hand. The beam stops in the air, turns round, and goes back the way it came._  
_The sea creature sits down hard, dazed, and Fergus stares at it._  
**Mewtwo**: Do not do that again.  

#### Done `pa2-08-host-done`

**Mewtwo** _(angry)_: People made me. People used me. People put their creatures in little balls and call it friendship.  
**Mewtwo** _(angry)_: Humans and their creatures both have this coming. I will start again, with my own.  

### Step 3: Answer Mewtwo’s question.

Hint: When Mewtwo comes to you, choose what to say. · check: `talk:pa2-mewtwo:castle-hall`

#### Scene `pa2-08-what`

_Mewtwo turns to go. Then he stops, and turns back, and looks at your Nubbin._  
_He comes across the hall, not walking, and stops in front of you. Your Nubbin looks up at him with its ball gone to a question mark._  
**Mewtwo**: What is that?  
_Nobody in the hall breathes._  
**Mewtwo** _(think)_: I know every creature in every record. I have read them all. This is in none of them.  
**Mewtwo**: It was not caught. It is not in a ball. It is sitting on your foot. What is it?  

**Choices**

- **“It’s a Nubbin.”**
    - **Mewtwo**: A Nubbin. And who made it?
    - **You**: Nobody. It hatched. I looked after the egg.
    - **Mewtwo**: Looked after.
    - He says it the way you would say a word in a language you don’t speak.
- **“It’s my friend.”**
    - **Mewtwo**: Everybody here says that about the thing they keep in a ball.
    - **You**: I don’t keep it anywhere. It keeps itself. It just stays.
    - **Mewtwo**: Why?
    - You don’t have an answer that fits in a sentence. Mewtwo waits, and then doesn’t.
- **Say nothing. Pick your Nubbin up.**
    - You pick it up, and it doesn’t struggle. It puts its chin on your shoulder and goes on looking at Mewtwo.
    - **Mewtwo**: It is not afraid of me.
    - It is a little. It just likes you more than it is afraid.

#### Complete `pa2-08-complete`

_Mewtwo turns away at last. He rises up the stairs and is gone, and the fire in the hall comes back up._  
**Nurse Joy** _(sad)_: I’ve been gone for days. I remember a voice. I remember being very tired.  
_Your Nubbin climbs down and goes to sit beside her. She puts a hand on its head without looking, the way nurses do._  
**Pixel** _(think)_: He looked at it for ages. He’s never seen anything that wasn’t made or caught.  

**Rewards**


Sets on completion: `{"pa2-08":true}`

**Notes:** STAGING: Fergus’s Gyarados (licensed) fires; Mewtwo turns the beam back and the Gyarados is dazed, not hurt. Nurse Joy wakes from Mewtwo’s control when he lets her go. The question in pa2-08-what is the first time any source character takes notice of your Nubbin; give it a held close-up. The answer choice is flavour only and sets no flag.

## PA2-9. The Lab

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Team Rocket below the castle and the cloning machine* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-8, from Pixel’s cabinet. · requires: PA2-8

**Cast:** Jessie (Jessie of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), James (James of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Dr Fuji (Dr Fuji, the scientist who made Mewtwo (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Follow the dripping sounds down to the lab below the castle.

Hint: Take the stair behind the hall fireplace and follow the light. · check: `explore:pa2-lab:below-castle`

#### Scene `pa2-09-down`

_Behind the fireplace there is a door, and behind the door a stair, and at the bottom a long room full of pods and green light._  
_Your Nubbin found the door; it is good at doors. It went down two steps before you could stop it._  
_Three dripping figures are already there, poking at things. The Vikings, minus beards._  
**James**: Jessie, look. Tanks. Thousands of them. Someone’s been very busy.  
**Jessie** _(happy)_: Someone’s been very rich. Look at all this.  
**Meowth** _(think)_: Somethin’ about dis place gives me da creeps. Da floor’s humming.  
_On a desk, under dust, there is a small machine with a red button that says PLAY. Meowth presses it, because of course he does._  
**Dr Fuji**: Recording. Day one of the new project. We are going to make the strongest creature that has ever lived.  
**Dr Fuji** _(sad)_: If it works, I will have enough money to go on with my real work. Amber. My daughter.  

#### Done `pa2-09-down-done`

**Jessie**: Who’s Amber?  
_Nobody answers. You know, and you don’t say, because it doesn’t feel like yours to say._  

### Step 2: Watch what the machine does.

Hint: Stand back from the long machine in the middle of the lab. · check: `watch:pa2-machine:lab`

#### Scene `pa2-09-machine`

_Down the middle of the lab runs a machine as long as a barn, with an arm that reaches out over the floor._  
_The arm turns. It plucks a single hair off the top of Meowth’s head, neat as a bird taking a seed._  
**Meowth** _(angry)_: Hey! Dat’s mine!  
_The hair goes into a slot, and the machine hums. A pod lights up green, and in it, something small begins to curl up._  
**James** _(shock)_: That’s… you, Meowth. It’s growing another you.  
**Meowth** _(shock)_: Dere’s only room for one o’ me. I barely got room for me.  
_The arm turns again, and stops over the floor by your boots. Lying there is a tuft of fluff: your Nubbin’s, from the boat._  
_You reach for it, but the arm is quicker. The tuft goes into the slot._  

#### Done `pa2-09-machine-done`

_A second pod lights up. In it, very small and very quickly, a round shape grows, with wings and a crown and stubby arms._  
_A few stray wisps are left in the tray under the slot. You take them, without quite knowing why, and put them in your pocket._  
**Pixel** _(shock)_: Oh no. Oh no, oh no. It’s copying your Nubbin.  

### Step 3: Decide what to call the Nubbin in the pod.

Hint: Go to the pod when it opens and choose what to say. · check: `choose:pa2-clone:name`

#### Scene `pa2-09-pod`

_The pod opens with a sigh. Out of it climbs a Nubbin._  
_It is your Nubbin’s shape exactly. But it is darker, as if drawn in evening, and its markings are on the wrong sides._  
_Its ball is grey. It wobbles on its feet, because they have only been feet for a minute._  
_Your Nubbin hides behind your legs and looks out. The new one looks at your Nubbin, then up at you._  
_It is waiting. It looks at you as if you should know what it is for._  
**Pixel** _(sad)_: It’s frightened. It doesn’t know anything. It’s exactly what he was in the tank.  
**Pixel** _(soft)_: Say something to it. Please. Somebody has to say something to it first.  

**Choices**

- **Call it by your Nubbin’s name.** — sets `{"pa2-name":"borrowed"}`
    - You say your Nubbin’s name. Your Nubbin’s ears go up, and so do the new one’s.
    - It says nothing. It looks at your Nubbin, which has the same name, and back at you, and something in it goes small and tight.
- **Tell it it gets a name of its own, and give it one.** — sets `{"pa2-name":"own"}`
    - **You**: You’re not a copy of anybody. You get your own name. Here.
    - You give it the name. It tilts its head, and you say it again, slower.
    - Its ball turns, very faintly, from grey to the colour of the inside of a shell.

#### Complete `pa2-09-complete`

_Feet on the stair. Mewtwo’s voice fills the lab, without anyone in it._  
**Mewtwo**: Everything made here is mine. Come up. It is time.  
_The new Nubbin goes up the stairs towards the voice, with the new Meowth beside it. At the top it stops and looks back at you._  
_Your Nubbin takes hold of your trouser leg and doesn’t let go of it._  

**Rewards**


Sets on completion: `{"pa2-09":true}`

**Notes:** SIGNATURE CHOICE (pa2-09-pod): pa2-name = own | borrowed. Paid off in PA2-13 (pa2-13-nubbins vs pa2-13-nubbins-borrowed), PA2-16 (pa2-16-go vs pa2-16-name-borrowed) and PA2-18 (pa2-18-complete vs pa2-18-complete-late and pa2-18-complete-nameless). SIM: on own, open the name-entry box (the same one used to name a hatchling) and store the name as pa2-clone-name in the Arcade save; empty or unchanged input defaults to a seeded name from the Nubbin name list, never the player Nubbin’s name. THE CLONE’S LOOK: the player Nubbin’s own sprite, mirrored colour layout (markings swapped left and right), tinted one step darker, ball grey until named. It is never drawn with angry eyes. THE TUFT: the stray wisps in pa2-09-machine-done become the locket in PA2-18.

## PA2-10. Clones and Originals

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: the clone battles and the dark Balls* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-9, from Pixel’s cabinet. · requires: PA2-9

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Neesha (Neesha, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut)), Corey (Corey, one of the invited trainers (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Watch the trainers’ best face Mewtwo’s copies.

Hint: Stand at the edge of the arena under the glass roof. · check: `watch:pa2-battles:arena`

#### Scene `pa2-10-battles`

_The castle’s arena is under the glass roof, with the storm pouring down it. On one side stand the trainers._  
_On the other side, out of the dark, come three creatures: a great flower-backed one, a winged fire one, and one with cannons on its shell._  
_They are exactly like the trainers’ own three. Only darker, and with lines down them like old scars._  
**Mewtwo**: My copies. Made from your best, and made better. Show me what yours can do.  
**Corey**: Venusaur! Go!  
**Neesha**: Blastoise, you’re up!  
**Ash**: Charizard, I choose you!  
_It isn’t long. One by one, the originals go down: not hurt, just beaten, and lying very still and tired on the stone._  
_Among Mewtwo’s copies, at the back, stands the new Nubbin, watching. It flinches every time something falls._  

#### Done `pa2-10-battles-done`

**Ash** _(shock)_: Charizard! Get up! You can do it!  
_Charizard tries, and doesn’t manage. Ash runs out and kneels beside it, and Mewtwo lets him._  

### Step 2: Hide your Nubbin from the dark Balls.

Hint: When the black Balls start flying, pick up your Nubbin and hold it inside your coat. · check: `carry:pa2-nubbin:coat`

#### Scene `pa2-10-balls`

**Mewtwo**: Now. I will take your creatures, and copy them all, and keep the copies. They will be better than yours.  
_Dark Balls pour from the walls: black, with a dull stripe, flying like starlings. They snap shut on anything that moves._  
_Brock’s creatures are gone, and the other trainers’ too. Misty grabs the little egg-shaped one, Togepi, and stuffs it in her bag._  
**Misty** _(shock)_: Not you. Not you. In you go, quiet now.  
_A Ball comes for your Nubbin. You catch your Nubbin first, and open your coat, and shut it._  
_You feel it, small and fast-hearted, against your chest. The Ball bumps your shoulder, confused, and goes looking for something else._  
_The coat is still wet from the sea, and your Nubbin doesn’t mind. It holds on to your jumper with both paws._  

**Choices**

- **Whisper to it to keep still.**
    - You whisper. It keeps still, so still you can feel it deciding to, all the way down to its feet.
- **Look for the new Nubbin.**
    - It is still at the back of Mewtwo’s copies, and no Ball goes near it. It is watching your coat, and the shape in it.

#### Done `pa2-10-balls-done`

_The Balls whistle off down a chute in the floor, full, towards the lab._  
**Pixel** _(shock)_: Don’t let go of it. Whatever happens, don’t let go of it.  

#### Complete `pa2-10-complete`

_The arena is very quiet. Every creature the trainers had is gone but three: Pikachu, Togepi in Misty’s bag, and your Nubbin._  
_Across the arena the new Nubbin is looking at your coat. It can see the shape inside, and it looks at it for a long time._  
**Brock** _(shock)_: Ash. Pikachu. They’re all looking at Pikachu.  

**Rewards**


Sets on completion: `{"pa2-10":true}`

**Notes:** STAGING: the copy battles are fast and quiet; the originals are beaten and tired, never shown hurt. The new Nubbin stands at the back of Mewtwo’s copies in every shot, flinching at each fall. HIDE: the player picks up their Nubbin and the coat sprite closes over it; no fail state (the Ball always misses). Togepi in Misty’s bag as in the film.

## PA2-11. Pikachu’s Run

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Pikachu runs, Ash follows the Ball and wrecks the machine* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-10, from Pixel’s cabinet. · requires: PA2-10

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Jessie (Jessie of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), James (James of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Watch Pikachu run.

Hint: Stay at the edge of the arena and keep your coat shut. · check: `watch:pa2-pikachu:arena`

#### Scene `pa2-11-run`

_Pikachu runs: round the arena, along the walls, up the stairs. The dark Balls come after him like hail._  
_He is very quick. Every time one nearly has him, he isn’t there any more, and it bangs on stone._  
**Ash** _(shock)_: Run, Pikachu! Don’t let them get you!  
_He runs to Ash. Ash scoops him up and turns his back to the Balls and curls round him._  
_A Ball hits Ash in the back, then another. He doesn’t let go, and they both go down on the stone together._  
_Then the last Ball snaps shut on Pikachu, out of Ash’s arms, and drops into the chute._  
**Ash** _(shock)_: No!  
_Ash doesn’t stop. He goes down the chute after it, head first, into the dark._  

#### Done `pa2-11-run-done`

**Misty** _(shock)_: Ash! You idiot! Come back!  
**Brock**: That way. The stair behind the fire. We can get down that way.  
**Pixel** _(shock)_: Go. Follow Brock. Take your Nubbin.  

### Step 2: Get down to the lab.

Hint: Run back through the hall and down the stair behind the fireplace. · check: `explore:pa2-chute:lab`

#### Scene `pa2-11-lab`

_You come down the stair with Brock and Misty into the green light of the lab, and you stop._  
_Ash is soaked from the water in the chute. He has hold of something heavy, and he is hitting the control panel with it._  
**Ash** _(angry)_: Give him back! Give them all back!  
_The panel sparks. The long machine coughs, and groans, and stops._  
_Somewhere in the walls, something goes clunk, all along the room, like doors unlocking._  
**Jessie**: Did the twerp just break it?  
**James**: Bless him. I think he did.  
_Your Nubbin is out of your coat before you can stop it, scrambling towards the pods._  

#### Done `pa2-11-lab-done`

_The pods start opening, one after another, with a sigh like a breath let out._  

### Step 3: Help pull the last ones free from the pods.

Hint: Open the stuck pods; where your hands won’t fit, your Nubbin can squeeze in. · check: `collect:pa2-pods:lab`

#### Scene `pa2-11-pods`

_Creatures tumble out of the open pods: dizzy, blinking, looking for their trainers. Pikachu shoots out of one into Ash’s arms._  
_Some pods only half-open. Brock gets his fingers in the gap and pulls, and Misty pulls, and you pull._  
_One won’t go: the gap is too small for any hand. There is something inside it, shut in the dark._  
_Your Nubbin looks at the gap, then at you. Then it puts its head in, and wriggles, and is gone up to its tail._  
_There is a squeak, and the pod’s latch gives from the inside. Out rolls a very small round creature, and your Nubbin after it._  
**Misty** _(happy)_: Look at that. It went in where we couldn’t.  
_Your Nubbin sits up, covered in green goo, extremely pleased with itself._  

**Choices**

- **Tell it it did well.**
    - You tell it. Its ball goes to a heart, goo and all.
- **Wipe the goo off its face.**
    - You wipe it with your sleeve. It squints and lets you, the way it does at bath time, nobly.

#### Complete `pa2-11-complete`

_Every creature in the lab is out. The trainers’ creatures run back up the stair, and the trainers come down to meet them._  
**Ash** _(soft)_: Pikachu. You’re okay. You’re okay.  
_Above you, through the floor, there is a sound like a storm getting angry. Mewtwo has noticed._  
**Brock**: Up. Everybody up. He’ll be waiting.  

**Rewards**


Sets on completion: `{"pa2-11":true}`

**Notes:** STAGING: Ash shields Pikachu from the Balls with his back; he falls but is unhurt. He goes down the chute and wrecks the cloning machine’s panel with a pipe. The pods release everyone. POD STEP: three stuck pods open with a tug; the last needs the Nubbin (it squeezes in; no failure). The green goo is harmless.

## PA2-12. Mew

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Ash and Mewtwo, the pink bubble, Mew* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-11, from Pixel’s cabinet. · requires: PA2-11

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Get back to the arena and see who catches Ash.

Hint: Climb the stair back to the arena. · check: `watch:pa2-bubble:arena`

#### Scene `pa2-12-bubble`

_Back in the arena, Mewtwo stands above the floor in the rain from the cracked roof. All his copies stand behind him._  
**Ash** _(angry)_: You can’t just take everyone’s friends! You can’t!  
_Ash runs at it. Just runs, at the strongest thing in the world, with nothing in his hands._  
_Mewtwo doesn’t even turn. Ash is flung up and back across the arena, towards the castle wall._  
_He doesn’t hit it. Something has caught him: a pink bubble, soft as soap, floating him in the air like a dropped leaf._  
_And beside the bubble, much smaller than anything else in the room, is something pink, with a long tail. It is laughing._  
**Meowth** _(shock)_: Dat’s da one! Dat’s what we followed all da way here! Da little pink one!  
**Mewtwo** _(shock)_: Mew.  

#### Done `pa2-12-bubble-done`

_Mew sets Ash down on the stone as gently as a bubble sets down anything. He sits there with his mouth open._  

### Step 2: Let your Nubbin play tag with Mew.

Hint: Put your Nubbin down and watch the rafters. · check: `watch:pa2-tag:rafters`

#### Scene `pa2-12-tag`

_Mew sees your Nubbin. It stops laughing and looks at it, upside down, from very close._  
_It has never seen one either. Unlike Mewtwo, Mew looks delighted about this._  
_It taps your Nubbin on the nose and zips off up into the rafters, and looks back over its shoulder._  
_Your Nubbin looks at you, and you nod. It flaps its tiny wings so hard it rises about a foot, and then climbs the rest._  
_For a moment, in the middle of everything, they chase each other through the rafters under the rain._  
_Mew lets itself be caught, once. Your Nubbin is so surprised it nearly falls off the beam._  
**Misty** _(soft)_: Look at them. Just… look.  
**Pixel** _(happy)_: Screenshot. I’m taking a screenshot. I’m taking about forty.  

**Choices**

- **Cheer your Nubbin on.**
    - You cheer, and nobody in the arena tells you not to. Your Nubbin hears you and goes faster, and falls off, and climbs back.
- **Just watch. Don’t spoil it.**
    - You watch, and don’t say anything, so as not to spoil it. You will remember it a long time.

#### Done `pa2-12-tag-done`

_Mew blows a tiny pink bubble off the tip of its tail. It floats down and pops on your Nubbin’s nose, and your Nubbin’s ball goes pink._  

#### Complete `pa2-12-complete`

**Mewtwo** _(angry)_: You are the original. The one they took me from. You do not get to play.  
_Mewtwo fires at Mew. Mew skips aside; the blast catches the bubble still hanging by Ash, and bursts it, and Ash falls._  
_Brock catches him, and both of them sit down hard. Mew comes down out of the rafters, and it isn’t laughing now._  
_Your Nubbin climbs down the wall into your arms. The last nice moment is over, and it knows it, and so do you._  

**Rewards**

- Pink-bubble emote (cosmetic): Your Nubbin can blow a small pink bubble that floats up and pops on its own nose. Learned in the rafters of New Island.

Sets on completion: `{"pa2-12":true}`

**Notes:** CHANGE FROM THE OUTLINE (small): the outline says Mewtwo’s blast at Mew hits Ash. Here it hits the bubble Ash is still in, and he falls into Brock’s arms, unhurt; the tag game comes before it so that it is the last nice moment. TAG: a short, unscored follow-the-pink-light sequence in the rafters; Mew lets itself be caught once. Mew is a licensed design and never speaks (giggles only, if the licence allows the sound).

## PA2-13. The Fight Without Powers

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: originals and copies fight with their bodies* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-12, from Pixel’s cabinet. · requires: PA2-12

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Jessie (Jessie of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), James (James of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Watch the fight without powers.

Hint: Stay at the edge of the arena. There is nothing to press. · check: `watch:pa2-fight:arena`

#### Scene `pa2-13-fight`

**Mewtwo**: No powers. No tricks. No fire, no water, no lightning. We will see whose body is stronger, the made or the born.  
_A grey light comes down from Mewtwo over the whole arena, and every creature’s power goes out of it like a candle._  
_And then they fight, originals and copies, with their bodies. There is no sound but the rain, and slow music a long way off._  
_It is not like the battles, because nobody is winning. Every one of them is getting more tired, and nobody stops._  
_Pikachu’s copy hits him, and Pikachu falls over, and gets up, and doesn’t hit back. It hits him again._  
**Ash** _(sad)_: Pikachu, fight back! Why won’t you fight back?  
_Pikachu gets up again and stands there. His face is the saddest thing in the arena._  
**Misty** _(sad)_: Because he doesn’t want to, Ash.  

**Choices**

- **Stand with Misty.**
    - You stand beside her. She doesn’t look at you, but she moves over a little, so there is room.
- **Turn your Nubbin away from it.**
    - You pick it up and turn it round in your arms, and it turns its head straight back. It wants to see, even this.

#### Done `pa2-13-fight-done`

_Across the arena, Meowth and his copy stop fighting at exactly the same moment. They sit down on the stone, side by side._  
**Meowth**: My face hurts.  
_His copy says nothing, and nods. They sit there._  
**Meowth** _(soft)_: Same here, huh. Same places.  

### Step 2: Stay with your Nubbin when its copy comes.

Hint: Keep close to your Nubbin. You can’t stop what happens; you can be there. · check: `watch:pa2-nubbins:arena`

#### Scene `pa2-13-nubbins`

_The new Nubbin comes across the arena towards you, and your Nubbin goes still. You put a hand on its back._  
_The new one stops in front of it, exactly the same size. They look at each other for a long time._  
_Then the new one does what the Meowths did. It sits down._  
_Your Nubbin sits down too, beside it. Close, but not touching, because neither of them is sure about touching yet._  
_The new one looks up at you, and you say its name, the one you gave it. Its ball goes, very faintly, the colour of a shell._  
_In the middle of all that tiredness, two small round shapes sit side by side on the stone, and watch the rain._  
**Pixel** _(soft)_: Look. Look at them. Nobody told them to do that.  

#### Complete `pa2-13-complete`

**Jessie** _(sad)_: Look at them all. They’re the same. Made or born, they hurt the same.  
**James** _(sad)_: We do terrible things for money, Jessie. And even we think this is terrible.  
_Up above the arena, Mew and Mewtwo have stopped circling each other. They are gathering light, too much of it._  
**Brock** _(shock)_: That’s not the same as before. That’s bigger.  

**Rewards**


Sets on completion: `{"pa2-13":true}`

**Notes:** CARE (outline): sad, never exciting. NO hit sounds at all; slow, quiet music; the camera stays on Pikachu’s face through pa2-13-fight. Blows are shown as pushes and falls, never impact frames. PAYOFF of pa2-09-pod (four quests later): pa2-name = own plays pa2-13-nubbins as written; pa2-name = borrowed plays ARCADE_PA2_VARIANTS pa2-13-nubbins-borrowed instead (same check). In the borrowed variant your Nubbin never shoves back, and the copy is shown as frightened, not cruel: wide eyes, ball grey, pushing as if pushing a door.

## PA2-14. Between Them

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Ash runs between the blasts and is turned to stone* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-13, from Pixel’s cabinet. · requires: PA2-13

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Hold on to your Nubbin as the light gathers.

Hint: Pick your Nubbin up and stay back by the wall. · check: `carry:pa2-nubbin:arena-wall`

#### Scene `pa2-14-light`

_Mew in pink, Mewtwo in blue: each of them gathers a ball of light so bright it turns the rain to sparks._  
_Everything in the arena has stopped fighting. Every creature, made and born, is looking up._  
_Your Nubbin is in your arms, though you don’t remember picking it up. Its ears are flat against its head._  
**Ash** _(angry)_: Stop it! Both of you! Just stop!  
**Brock** _(shock)_: Ash, no. Ash, come back here.  
_Ash isn’t listening. He is running across the arena, between them, with his arms out._  
**Misty** _(shock)_: ASH!  

#### Done `pa2-14-light-done`

_Both lights go at once and meet in the middle. Ash is in the middle._  
_The whole arena goes white, and quiet, and stays quiet._  

### Step 2: Stay near while Pikachu tries to wake Ash.

Hint: Go and stand near Pikachu. Sit if you want to. There is nothing to fix. · check: `sit:pa2-pikachu:arena`

#### Scene `pa2-14-stone`

_When the light goes, Ash is standing where he was, with his arms out. He is grey all over, smooth as a statue._  
_He isn’t moving or breathing, as far as you can see. He looks like he’s asleep standing up, inside stone._  
_Pikachu runs to him. Pikachu puts a paw on his leg, and then lets out a little thunder, the smallest, to wake him._  
_Nothing. A bigger one, and nothing, and again, and again._  
_Each time it is weaker. Each time Pikachu looks up at Ash’s face to see if it worked._  
_Your Nubbin climbs out of your arms. It goes and sits down next to Pikachu, close, and doesn’t do anything at all._  
_Pikachu’s next thunder is hardly a spark, and he sits down. He leans against your Nubbin, and your Nubbin leans back._  

**Choices**

- **Sit down with them.**
    - You sit down on the wet stone next to them, and Misty comes and sits too. Nobody says anything.
- **Stand by Ash, one hand on his shoulder.**
    - You put a hand on his stone shoulder. It is cold, but under the cold it doesn’t feel empty, and you can’t say how you know.

#### Complete `pa2-14-complete`

_Mew comes down slowly and looks at Ash, and Mewtwo comes down too. Neither of them has anything to say._  
**Pixel** _(sad)_: He’s asleep. He’s asleep, it’s a sleep. It isn’t over. Stories like this don’t stop here.  
**Pixel** _(soft)_: Remember Miranda. Remember the story with the tea.  

**Rewards**


Sets on completion: `{"pa2-14":true}`

**Notes:** CARE: the stone is a sleep, not a death. Keep Ash’s stone face peaceful, eyes closed. Pixel says plainly in the complete scene that it isn’t over, and PA2-15 opens straight away (offer it immediately, no menu between). Pikachu’s thunder gets visibly smaller each time; no sounds of pain. Your Nubbin sitting beside Pikachu is Hazel’s third rule, acted, never named.

## PA2-15. Tears

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: every creature weeps, and Ash wakes* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Straight after PA2-14, from Pixel’s cabinet. · requires: PA2-14

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Watch what every creature on the island does.

Hint: Stay beside Ash and Pikachu. · check: `watch:pa2-tears:arena`

#### Scene `pa2-15-weep`

_Somewhere behind you a creature begins to cry, then another, a copy, then an original. You can’t tell which, and it doesn’t matter._  
_Then all of them. Every creature in the arena, made or born, is crying for the boy who got in the way._  
_Meowth is crying, and his copy beside him, and Mew. Your Nubbin is crying quietly, with its face in Pikachu’s fur._  
_Across the arena, the new Nubbin is crying too. It doesn’t know why; it just is._  
_Mewtwo stands with his back to all of it, not crying. He is looking at his own hands again._  
**Meowth** _(sad)_: Dey’re all da same. Look at ’em. Nobody can tell who’s who when dey’re cryin’.  

#### Done `pa2-15-weep-done`

_The tears don’t fall; they rise. Little points of light lift off every face in the arena and drift across the air._  

### Step 2: See the old story come true.

Hint: Watch the lights gather round Ash. · check: `watch:pa2-ash:arena`

#### Scene `pa2-15-wake`

_The lights drift to Ash and settle on the grey stone like snow, one by one, thousands of them._  
_Where they settle, the grey goes. His hair first, then his face, then his hands, still held out._  
_Ash’s arms come down. He sways, and Brock is there, and he doesn’t fall._  
**Ash**: Pikachu?  
_Pikachu hits him in the chest at full speed. Ash sits down on the stone with Pikachu in his arms, laughing, crying, both._  
**Misty** _(happy)_: You idiot. You complete idiot.  
_Your Nubbin climbs up your leg and into your arms, and you hold on to it, and it holds on to you._  
_It is what Miranda said. The tears of all of them, for the one on the stone._  

**Choices**

- **“She was right. The story was for using.”**
    - **Pixel**: Writing that down too. Underlining it.
- **Say nothing. Hold on.**
    - You hold on. Your Nubbin’s ball, right by your ear, goes slowly from a spiral to a heart.

#### Complete `pa2-15-tears`

_The cartridge shows you the lantern shed for a moment, in the corner of the sky._  
_Byte is back behind Pixel’s chair with the biscuit tin under his arm. He has a biscuit halfway to his mouth._  
_He has stopped chewing. He doesn’t start again for a long while._  
**Pixel** _(soft)_: You’re back. Good. Took you long enough.  

**Rewards**


Sets on completion: `{"pa2-15":true}`

**Notes:** BYTE (s7Done): play ARCADE_PA2_VARIANTS pa2-15-tears-s7 instead of the complete scene pa2-15-tears. Byte’s line in it is the outline’s own, original. Without s7Done, Byte comes back with the biscuits here and stops chewing (as written). TEARS: soft points of light rising, not falling; no wailing sounds, only quiet crying under the music. The tears callback to Miranda’s story (PA2-6) is the only payoff it needs.

## PA2-16. What You Do With It

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Mewtwo understands, leaves with his copies and takes the day’s memory* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-15, from Pixel’s cabinet. · requires: PA2-15

**Cast:** Mewtwo (Mewtwo, the made creature; speaks mind to mind (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: Hear what Mewtwo has understood.

Hint: Stay in the arena while Mewtwo speaks. · check: `watch:pa2-mewtwo:arena`

#### Scene `pa2-16-understand`

_Mewtwo turns round at last. He looks at the boy who was stone, at the creatures with wet faces, at his own copies among them._  
**Mewtwo** _(think)_: He made himself a wall between us. He was nobody’s copy and nobody’s weapon. He did it anyway.  
**Mewtwo** _(soft)_: And they wept for him. Mine and yours. They could not tell the difference, and neither, now, can I.  
**Mewtwo** _(soft)_: I see now that the circumstances of one’s birth are irrelevant.  
**Mewtwo** _(soft)_: It is not how you are made. It is what you do with your life, now that you have it.  
_Your Nubbin looks up at him, from your arms. Mewtwo looks back, and this time he doesn’t ask what it is._  

**Choices**

- **“Where will you go?”**
    - **Mewtwo**: Somewhere with no laboratory, and no man with an umbrella. We will know it when we see it.
- **Nod to it.**
    - You nod. After a moment, Mewtwo nods back, as if it is a thing he has only just learned how to do.

#### Done `pa2-16-understand-done`

**Mewtwo**: My copies and I will go. We will find a place where we can live, and nobody will come looking for us.  
**Mewtwo**: And you will not remember this day. It is better. For you, and for us.  

### Step 2: Say goodbye to the new Nubbin.

Hint: Go to the new Nubbin before it leaves with the copies. · check: `talk:pa2-clone:arena`

#### Scene `pa2-16-go`

_The copies are gathering behind Mewtwo, quietly, all of them. The new Nubbin comes over to you first._  
_It stops in front of your Nubbin, and then in front of you. Its ball is the colour of the inside of a shell._  
_It opens its mouth and chirps: two chirps, then a third, rising. It has never made a sound before._  
_It is the name you gave it, in the only way a Nubbin can say anything. You know it straight away._  
_It turns and trots over to the copies, and stands among them, and looks very small and very sure._  
**Mewtwo** _(think)_: And you. You have a name.  
_The new Nubbin chirps it again at Mewtwo, quite firmly. Mewtwo bows his head to it slightly, as to an equal._  

#### Complete `pa2-16-complete`

_Mewtwo lifts his hand. A soft light goes out from him through the whole castle, through you, through the rain._  
**Pixel** _(shock)_: He’s wiping it. The day. Everyone’s. I can see the memory bar going down.  
**Pixel** _(soft)_: Not yours, though. You came in through the cabinet. You don’t count. Hold on.  
_The last thing you see on New Island is the copies rising into the storm with Mewtwo, and among them, something small and round._  

**Rewards**


Sets on completion: `{"pa2-16":true}`

**Learning Grove swaps**

- `pa2-16-understand#3` → I see now that it doesn’t matter how anyone began.

**Notes:** LIFTED TEXT: pa2-16-understand#3 is the one quoted line (4Kids English dub, as printed in The Art of Pokémon, The First Movie); childLines gives an original replacement. PAYOFF of pa2-09-pod (seven quests later): pa2-name = own plays pa2-16-go as written. pa2-name = borrowed plays ARCADE_PA2_VARIANTS pa2-16-name-borrowed instead (same check), which offers the last chance and sets pa2-late = named | unnamed; named opens the name-entry box as in PA2-9 and stores pa2-clone-name. The clone’s chirp of its name is the Nubbin chirp sound, three notes, the last rising; it is not speech. MEMORY: the player keeps the day because they came in through the cabinet.

## PA2-17. The Wharf Again

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: everyone wakes at the wharf, and Ash sees something in the clouds* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-16, from Pixel’s cabinet. · requires: PA2-16

**Cast:** Ash (Ash Ketchum (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Misty (Misty (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Brock (Brock (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Nurse Joy (Nurse Joy of Old Shore Wharf, first seen as Mewtwo’s cloaked messenger (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Miranda (Miranda, the pier keeper at Old Shore Wharf, who tells the old story (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut))

### Step 1: Wake up at the wharf.

Hint: Look round the Pokémon Center at Old Shore Wharf. · check: `explore:pa2-center:wharf`

#### Scene `pa2-17-wake`

_You open your eyes on a bench in the little Pokémon Center at Old Shore Wharf. Your Nubbin is asleep on your chest._  
_Everyone is here: Ash, Misty, Brock and the three other trainers. Nurse Joy is behind her counter, blinking._  
**Nurse Joy** _(think)_: Goodness. I must have dozed off. How long have you all been sitting here?  
**Ash**: Not sure. A while? Weird. I had a dream about… no. It’s gone.  
_Outside the window, the storm is clearing. Blue sky is coming through in long cracks over the sea._  
_Your Nubbin wakes and yawns. It looks straight out of the window towards the island, the way it looks for someone gone home._  

**Choices**

- **Ask Ash if he remembers the island.**
    - **Ash**: What island?
    - He means it. He’s already looking round for something to eat.
- **Keep it to yourself.**
    - You keep it. It feels like something you were given to carry, and you are good at carrying.

#### Done `pa2-17-wake-done`

**Pixel** _(soft)_: Nobody remembers. Only you. And me, I suppose. I was watching.  

### Step 2: Go out on the pier and look at the sky.

Hint: Walk to the end of the pier with Ash and his friends. · check: `walk:pa2-pier:wharf`

#### Scene `pa2-17-sky`

_On the pier the planks are steaming in the sun. Miranda is hanging her oilskin on the rail to dry._  
**Miranda**: Storm’s gone. Funny. Felt like it went on for days, and it was one night.  
_Ash stops dead and points up at the clouds._  
**Ash** _(shock)_: Look! Up there. Something pink!  
**Misty**: It’s nothing. It’s a cloud. Clouds are pink sometimes.  
**Brock** _(think)_: Clouds don’t do loops, though.  
_You look up. Something very small and pink goes round once in the blue and is gone._  
_Your Nubbin waves both arms at the sky. It is the only one on the pier who does._  

#### Complete `pa2-17-complete`

**Pixel** _(think)_: Funny thing. The cartridge’s save file. I just looked.  
**Pixel** _(soft)_: It’s kept it. All of it. The island, the pods, the rafters, the tears. It doesn’t forget.  
**Pixel**: So that’s two of us. Three, with the cartridge.  
_Your Nubbin is still waving at the sky. Ash shrugs, and starts waving too, without knowing why._  

**Rewards**


Sets on completion: `{"pa2-17":true}`

**Notes:** STAGING: morning at the wharf, steam off the planks, the storm breaking up. Mew is a single pink speck doing one loop. Ash, Misty, Brock and the other trainers have forgotten; the player has not. Pixel’s “the save remembers” is the frame’s point: the Arcade save keeps every flag, and the cabinet will show it in PA2-18.

## PA2-18. Team Rocket’s Holiday

*Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut: Team Rocket on the green island, and the end* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Clone Island (Pixel’s Arcade) · when: Any time after PA2-17, from Pixel’s cabinet. · requires: PA2-17

**Cast:** Jessie (Jessie of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), James (James of Team Rocket (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design), Meowth (Meowth of Team Rocket, the talking Pokémon (Pokémon: The First Movie (OLM for Toho, 1998), kanzenban cut); licensed design)

### Step 1: See where Team Rocket woke up.

Hint: Watch the last scene the cartridge shows you. · check: `watch:pa2-rocket:new-island`

#### Scene `pa2-18-holiday`

_The cartridge cuts away, the way films do at the end, to New Island. The castle is gone, and the island is green._  
_There is grass over everything and flowers where the arena was. A stream runs down where the chute used to go._  
_Three figures lie in the grass in what is left of their Viking costumes, blinking at the sky._  
**James**: Jessie. Where are we?  
**Jessie** _(happy)_: No idea. But it’s lovely, isn’t it? The sun’s out. Nobody’s chasing anybody.  
**Meowth** _(think)_: I got a feelin’ we was supposed to be doin’ somethin’. Can’t remember what.  
**Jessie** _(happy)_: Then we’re not doing it. We’re on holiday.  
**James** _(happy)_: A holiday. Do you know, I don’t think we’ve ever had one.  
_Meowth lies back in the grass with his paws behind his head. Somewhere, a long way off, a pink speck does a loop._  

#### Done `pa2-18-holiday-done`

**Pixel** _(happy)_: Good for them. Honestly. Good for them.  

### Step 2: Step out of the cabinet and back into the lantern shed.

Hint: Touch the glass from the inside, with your Nubbin in your arms. · check: `explore:pa2-shed:lantern-shed`

#### Scene `pa2-18-out`

_You put your hand on the inside of the sky. It is warm, then warm glass, and then you are standing in the lantern shed._  
_It smells of solder and sawdust, and there is a biscuit crumb on the floor. Your Nubbin eats it immediately._  
**Pixel** _(happy)_: You’re out. Welcome back. Sit down. You look like you’ve been to sea.  
_Pixel has the cartridge out, turning it over in her hands. Then she stops, and puts something in your hand._  
**Pixel** _(soft)_: You had this in your pocket. It came out with you. Fluff. Your Nubbin’s, from the tray.  
**Pixel** _(soft)_: I can put it in a locket. A little one. If you want. It seems like a thing you keep.  
_The cabinet’s screen flickers, and the title is gone. The attract screen has changed._  

**Choices**

- **“Yes, please. A locket.”**
    - **Pixel**: Small brass one. I’ve got one in the drawer, waiting for something to go in it. Now it’s got something.
- **Thank her for being player two.**
    - **Pixel**: Any time. Well, not any time. That one was a lot. But yes.
    - **Pixel**: I’ll make the locket anyway. You’ll want it.

#### Complete `pa2-18-complete`

_The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom._  
_On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them._  
_Among them, sitting on its own small rock, is a round shape with tiny wings, darker than your Nubbin, its ball the colour of a shell._  
_Under it, in the little pixel letters the cabinet uses for high scores, is the name you gave it._  
**Pixel** _(soft)_: It’ll stay like that now. The attract screen. Every time anyone walks past.  
_Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is sitting._  
**Pixel** _(happy)_: And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.  

**Rewards**

- Tuft-of-fluff locket (cosmetic): A small brass locket Pixel made, with a tuft of your Nubbin’s fluff inside from the tray on New Island. Worn round the neck.
- The Clone Island high-score plate (decor): A brass plate for the cabinet: your initials, the cartridge, and “No battles”. Counts towards High Score Night.

Sets on completion: `{"pa2-18":true,"pa2-done":true}`

**Notes:** ENDING (pays off pa2-09-pod nine quests later): three ways, one complete scene each. pa2-name = own plays pa2-18-complete as written. pa2-name = borrowed with pa2-late = named plays ARCADE_PA2_VARIANTS pa2-18-complete-late; with pa2-late = unnamed plays pa2-18-complete-nameless. SIM: the cabinet’s attract screen keeps that image for good, drawn with the stored pa2-clone-name under the clone (own, or late), or a blank plate (nameless). It shows whenever the cabinet is idle in the lantern shed. HIGH SCORE NIGHT: pa2-done counts towards the frame’s two-cartridge unlock. LEARNING GROVE: none, because of the licence. If ever licensed, the outline’s topics are what twins and clones share and don’t, why storms close harbours, and how stories about tears and healing turn up in many cultures.

## Variant scenes

#### Variant `pa2-01-shed-clank`

_The lantern shed smells of solder and old sawdust. The cabinet hums in the corner, under a string of lantern bulbs._  
_Clank is sitting on top of the cabinet with his wheels hanging over the edge, like a cat on a warm boiler._  
**Clank** _(happy)_: Announcement! I am supervising! This is a very important box!  
_Pixel is sitting on an upturned crate in front of it, with a cartridge in her lap._  
**Pixel** _(happy)_: Found this one wedged behind the coin box. With the mouse nest. The mice had good taste.  
_She blows the dust off. The label is faded, but there is a shape on it, purple, with a long tail._  
**Clank**: Purple! My best colour. Announcement: purple is my best colour now.  
_Byte is standing behind her chair with his arms folded, as if the chair might do something._  
**Byte**: I’m here to check the maths. Arcades are probability with a coin slot.  
**Pixel**: He’s here because I said there’d be biscuits.  
**Byte**: That too.  

**Choices**

- **Blow on the cartridge too, for luck.**
    - **Pixel**: That doesn’t do anything, you know. Electrically.
    - **Clank**: I will also blow! For science!
    - **Pixel**: Do it again.
- **Ask what it’s about.**
    - **Pixel**: No idea. The writing’s gone. I like that, actually. You go in not knowing, like a door.
- **Ask Byte what the odds are.**
    - **Byte**: Of what?
    - **You**: Of it being good.
    - **Byte**: Insufficient data. Which is the honest answer to most things.

#### Variant `pa2-01-title-s7`

_The cartridge goes in with a clunk. The screen fizzes, then a title rises out of the dark: an island, and over it, a shape._  
**Byte**: Right. Well. Let’s see the—  
_He stops. He is looking at the shape on the screen, the made one, and he doesn’t finish._  
_Pixel glances back at him. He doesn’t say anything else, and he doesn’t go for a biscuit either._  

#### Variant `pa2-04-complete-s7`

_The cartridge fades to the cabinet’s little corner window: the lantern shed, Pixel’s face lit blue by the screen._  
_Behind Pixel’s chair stands Byte, with his arms still folded. He hasn’t moved or said anything since the title._  
**Pixel** _(soft)_: He asked what he was for, and somebody answered.  
_Byte says nothing. His hand moves to his pocket, where he keeps the stopwatch charm, and stays there._  

#### Variant `pa2-13-nubbins-borrowed`

_The new Nubbin comes across the arena towards you, and your Nubbin goes still. You put a hand on its back._  
_The new one stops in front of it. They are exactly the same size, and they have the same name, because you gave it to them._  
_The new one pushes your Nubbin, not hard. It is like pushing a door to see if it will open._  
_Your Nubbin rocks back, and sits up again, and looks at it. It doesn’t push back._  
_The new one pushes it again, harder, with both paws. Its eyes are very wide and its ball is grey._  
_There is one name, and two of them. It thinks there is only room for one._  
_Again, and again. Your Nubbin falls over, and gets up, and doesn’t push back, every time._  
**Pixel** _(sad)_: It’s not being cruel. It’s frightened. It thinks one of them has to stop being.  

**Choices**

- **Kneel down between them.**
    - You kneel. The new one stops pushing and looks at you, and you see it is shaking.
    - It backs away, two steps, three, and sits down on its own, where the rain from the roof comes in.
- **Let your Nubbin decide.**
    - Your Nubbin gets up one more time. It doesn’t push; it just stands there, with its paws at its sides.
    - The new one stops, with its paws still up. Then it turns round and walks away, very fast, and sits down alone.

#### Variant `pa2-15-tears-s7`

_The cartridge shows you the lantern shed for a moment, in the corner of the sky._  
_Byte is still standing behind Pixel’s chair, where he has been the whole time. He is looking at the copies, crying with the rest._  
**Byte** _(sad)_: I gave Null a bell for everything. I never asked Null what it wanted.  
_He says it to nobody, and Pixel doesn’t turn round. She reaches back without looking and takes hold of his sleeve._  
_She doesn’t let go of it for the rest of the cartridge._  

#### Variant `pa2-16-name-borrowed`

_The copies are gathering behind Mewtwo, quietly, all of them. The new Nubbin is at the back, by itself._  
**Mewtwo**: You. Small one. What is your name?  
_The new Nubbin chirps your Nubbin’s name, the only way it can. It is the only name anyone ever gave it._  
**Mewtwo** _(think)_: No. That name was already taken before you woke. It belongs to the one in that Keeper’s arms.  
**Mewtwo**: You are not that one. You never were. You are something new.  
_The new Nubbin looks at you, its ball grey. It is waiting, the way it waited in the pod._  
**Pixel** _(soft)_: It’s your last chance. You can give it one now. Its own. It’s not too late.  

**Choices**

- **Give it a name of its own, now.** — sets `{"pa2-late":"named"}`
    - **You**: I’m sorry. I gave you the wrong one. This one is yours.
    - You say the name, and it tilts its head. You say it again, slower.
    - It chirps it back, two chirps and a third, rising. Its ball turns the colour of the inside of a shell.
    - It trots over to the copies, and stands among them, and looks very small and very sure. Mewtwo bows his head to it.
- **Say nothing. Let it go as it is.** — sets `{"pa2-late":"unnamed"}`
    - You don’t say anything. You can’t think of anything that would be right.
    - The new Nubbin waits a little longer. Then it turns and goes to the copies, without a name.
    - At the edge of them it stops, and looks back at you, over its shoulder. Then it goes on.

#### Variant `pa2-18-complete-late`

_The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom._  
_On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them._  
_Among them, a little apart, is a round shape with tiny wings, darker than your Nubbin. Its ball is the colour of a shell._  
_Under it, in the little pixel letters the cabinet uses for high scores, is the name you gave it. Late, but its own._  
**Pixel** _(soft)_: It’ll stay like that now. The attract screen. Every time anyone walks past.  
_Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is sitting._  
**Pixel** _(happy)_: And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.  

#### Variant `pa2-18-complete-nameless`

_The attract screen shows a far mountain under a clear sky, with green on its sides and a river at the bottom._  
_On the slopes, small and far off, are Mewtwo’s copies, living. Mewtwo stands on a rock above them._  
_At the very edge of them is a round shape with tiny wings, darker than your Nubbin. It is looking back over its shoulder._  
_Under it, where the cabinet puts a name, there is a blank plate. Three dashes, waiting._  
**Pixel** _(sad)_: It’ll stay like that now. The attract screen. Every time anyone walks past.  
_Your Nubbin climbs on to the cabinet and puts its nose against the glass, right where the other one is looking back._  
**Pixel** _(soft)_: And there’s your plate. High score. You didn’t battle anyone once. I put that on it too.  
