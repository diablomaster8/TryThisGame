# Pixel's Arcade, cartridge PA5: The Hundred-Year Sleep

## PA5-1. The Cabinet

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the opening* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: After chapter 5, once Pixel’s cabinet runs in the lantern shed; the first quest on the cartridge.

**Cast:** A voice (Princess Zelda’s voice, heard before she is seen (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed), Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own robot from S21)

### Step 1: Meet Pixel at the cabinet in the lantern shed.

Hint: The lantern shed is lit; Pixel has a new cartridge. · check: `visit:pa5-cabinet:lantern-shed`

#### Scene `pa5-01-shed`

_The lantern shed smells of sawdust and solder. The cabinet hums in the corner like a fridge with ambitions._  
**Pixel**: New cartridge. Well, old cartridge. New to us.  
_She holds it up. The label is faded to the colour of weak tea, except for one blue eye, which hasn’t faded at all._  
**Pixel**: Found it under the mouse nest. The mice had been using it as a table. It works anyway. I checked.  
**Pixel**: You go in. I stay out here as player two and talk through the speaker. I’ve fixed the speaker. Mostly.  
**Pixel**: If it goes wrong, I pull the plug and you’re back on this floor. Ruling: that has never failed.  
**You**: How many times have you tried it?  
**Pixel** _(happy)_: Once. It worked once. That’s a hundred per cent.  
_Your Nubbin climbs on to the stool and stares into the dark screen, nose almost on the glass._  

**Choices**

- **Blow on the cartridge first.**
    - **Pixel**: That does nothing. Everybody does it anyway. Fine.
    - You blow on it. Pixel blows on it too, a bit harder, and looks pleased with herself.
- **Just put it in.**
    - **Pixel**: A person of action. Player one, ready.

#### Done `pa5-01-shed-done`

_The cartridge goes in with a clunk. The screen turns a deep, quiet blue._  
_Then the shed goes away, the way a room goes away when you fall asleep in it._  

### Step 2: Wake up, and look about the cave.

Hint: Get up, and look at the stone bed beside you. · check: `inspect:pa5-cave:stone-bed`

#### Scene `pa5-01-wake`

**A voice**: Open your eyes.  
_You do. You are lying on a stone floor, and it is cold through your coat._  
_Your Nubbin is curled against your side. It opens one eye, then the other, then sneezes._  
_Beside you is a stone bed, carved with lines that glow a soft blue. It is wet, as if someone has just got out of it._  
**Pixel**: Player two. I’ve got the manual this time. It’s in a language. Say something.  
**You**: I can hear you.  
**Pixel** _(think)_: Good. The voice wasn’t me, by the way. I want that on the record.  
_Somewhere further in, water drips into water. A blue light runs along the wall, towards it._  

**Choices**

- **Then whose voice was it?**
    - **Pixel**: Somebody who’s been waiting a long time to say it, I think. It sounded tired.
- **It’s freezing in here.**
    - **Pixel**: I’ll put the heater on in the shed. That won’t help you at all. It’ll help me.

#### Done `pa5-01-wake-done`

_Your Nubbin follows the blue light along the wall with its nose. You follow your Nubbin._  
**Pixel**: That’s the right way. I don’t know how I know. It’s the way the light goes.  

#### Complete `pa5-01-complete`

_The cave opens into a round chamber. In the middle is a pool, lit from beneath._  
_Someone is lying in the water, asleep, as if he has been asleep for a very long time._  
**Pixel**: Oh. It isn’t you who’s waking up. It’s him. You just got here early.  
_Your Nubbin sits down on the edge of the pool to wait. So do you._  

**Rewards**


Sets on completion: `{"pa5-01":true}`

**Learning Grove swaps**

- `pa5-01-wake#0` → Wake up now. It’s time.

**Notes:** FRAME: the lantern shed, the cabinet (dented, sawdust, the mouse nest now moved to a teacup on the shelf). Pixel stays in the shed for the whole cartridge; every Pixel line in PA5 is heard through the cabinet speaker, with a small crackle. WITH s21Done: play PA5_VARIANTS pa5-01-shed-clank instead of pa5-01-shed (Clank sits on top of the cabinet). LIFTED: pa5-01-wake#0 is quote 1 of 2 (check against the game); childLines gives the original replacement. The voice is Zelda’s, licensed voice only; she is not named here. TRANSITION: the shed fades to blue, then to the cave; no flashing.

## PA5-2. The Shrine of Resurrection

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): waking in the Shrine of Resurrection* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-1, from Pixel’s cabinet. · requires: PA5-1

### Step 1: Watch over the sleeper in the pool until he wakes.

Hint: Stay by the pool; he will wake on his own. · check: `watch:pa5-link:pool`

#### Scene `pa5-02-pool`

_The water drains away with a long sigh. The young man in it sits up, blinks, and gets out._  
_He has fair hair, bare feet and a pair of old shorts. He looks at his own hands as if they were new._  
_Then he sees you, and isn’t surprised. Everything is new to him, so you are just one more thing._  
**Pixel**: That’s Link. The game says so in the corner. He’s the hero. We’re… the people next to the hero.  
_A pedestal rises out of the floor. On it is a flat slate of stone and glass, lit blue._  
_Link picks it up, and it chirps. Your Nubbin chirps back, and Link looks at it for a long moment._  
**Pixel**: He doesn’t talk much, does he? Fine. I talk enough for a party of four.  

**Choices**

- **Offer him your jumper.**
    - Link takes it, puts it on back to front, and fixes it without a word. It fits him better than it fits you.
    - **Pixel**: Ruling: that’s his now. Heroes don’t give jumpers back. It’s in the rules.
- **Say hello.**
    - Link nods once. It is a very polite nod, from somebody who doesn’t yet know any other kind.

#### Done `pa5-02-pool-done`

_A door slides open. Daylight comes down a long ramp, so bright your Nubbin shuts its eyes._  
_Link goes up towards it. After a few steps he looks back to see if you’re coming._  

### Step 2: Follow Link up into the light, to the cliff edge.

Hint: Walk up the ramp and out of the cave mouth. · check: `walk:pa5-link:cliff-edge`

#### Scene `pa5-02-cliff`

_Outside, the grass is long and the wind is enormous. Link runs to the edge of a cliff and stops._  
_Below you is a whole land, green and gold and empty, with mountains standing round it like old people at a fire._  
_Far off, a castle. Around it turns a slow cloud, red and black, like smoke that has forgotten how to leave._  
**Pixel** _(shock)_: Oh. Oh, that’s big. They’ve drawn it so you can see it from everywhere, haven’t they.  
_Your Nubbin sits down at once, right on the edge, with its feet over the drop._  
_Link doesn’t move. After a while, he sits down next to it._  
**Pixel** _(soft)_: I’m going to be quiet for a bit. It seems like that sort of view.  
_You sit down too. The wind goes on, and the cloud turns, and nobody says anything for a long time._  

#### Done `pa5-02-cliff-done`

_Down the slope, a thread of smoke rises from a campfire. Someone is there._  
**Pixel**: Right. Quiet over. Somebody’s cooking. Go and be friendly.  

#### Complete `pa5-02-complete`

_Link stands up first and offers your Nubbin a hand. Your Nubbin takes a finger instead._  
_The three of you go down the slope through the long grass, towards the smoke._  
**Pixel**: Note for later: he waited for you. Heroes don’t always.  

**Rewards**


Sets on completion: `{"pa5-02":true}`

**Notes:** Link never speaks in this script; his acts are narrated. The Calamity cloud is slow and red-black, never flashing. The cliff view is the cartridge’s big wide shot: hold it, and let the player sit.

## PA5-3. The Old Man

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the Great Plateau* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-2, from Pixel’s cabinet. · requires: PA5-2

**Cast:** Old Man (The Old Man of the Great Plateau, later King Rhoam’s spirit (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Meet the old man at the campfire.

Hint: Follow the smoke down the slope. · check: `talk:pa5-oldman:campfire`

#### Scene `pa5-03-fire`

_An old man in a hooded cloak sits by a small fire, turning apples on a stick._  
**Old Man**: Visitors. Three of you, and one of you is very short. Sit, sit.  
**Old Man**: Have an apple. They’re better roasted. Everything is better roasted, apart from fingers.  
_He gives you an apple. It is hot and sweet and slightly black on one side._  
_He gives your Nubbin one too. Your Nubbin holds it in both hands and blows on it very seriously._  
**Old Man**: And you. You’ve been asleep, haven’t you? A long time. It shows in how you stand.  
_Link doesn’t answer. The old man nods, as if he did._  
**Pixel** _(think)_: I like him. I don’t trust him, but I like him. He’s got a face like a riddle.  

#### Done `pa5-03-fire-done`

**Old Man**: There’s a tower on the hill there. Dead for a hundred years. Your slate might wake it.  
_Link is already walking. You eat your apple faster._  

### Step 2: Go with Link to the stone tower.

Hint: The tower is on the hill above the ruined temple. · check: `climb:pa5-tower:plateau`

#### Scene `pa5-03-tower`

_Link puts the slate into a pedestal at the foot of the tower. The ground shakes._  
_The tower shoots up out of the earth with all of you still on its base. Your Nubbin holds on to your boot._  
_At the top, the slate draws a map. All across the land, small orange lights blink on, one after another._  
**Pixel**: Those are shrines. Little puzzle rooms. He has to do them. We get to stand outside and hold things.  
_Back at the fire, the old man is waiting, as if he has never moved._  
**Old Man**: You can’t get off this plateau without wings. I have a pair. Well, a cloth pair.  
**Old Man**: Bring me what’s inside four of those shrines, and the paraglider is yours.  
**Pixel**: A fetch quest. Classic. Ruling: allowed, because he gave us apples.  

#### Done `pa5-03-tower-done`

_Link sets off for the first shrine. You and your Nubbin carry the pot and the bag of apples behind him._  

### Step 3: It’s cold on the mountain. Decide how to spend the evening.

Hint: Talk to the old man at his cabin fire after the third shrine. · check: `choose:pa5-oldman:supper`

#### Scene `pa5-03-cold`

_The last shrine is up on the snowy shoulder of the plateau. Your breath comes out in clouds._  
_Your Nubbin has gone very small and round, which is what Nubbins do when they’re cold._  
_The old man has a cabin down the slope, with a fire and a big stone pot. He is eating a cold apple._  
**Old Man**: There’s a recipe in my diary. Spicy peppers and meat, to keep the cold out. I’ve never got round to it.  
_You have peppers in your bag. Link has already gone on up the slope towards the shrine._  
**Pixel**: Option one: cook. Option two: catch him up. I will not rule on this. It’s your evening.  

**Choices**

- **Cook the pepper dish and eat with him.** — sets `{"pa5-oldman":"ate"}`
    - You chop peppers and the stone pot spits. The cabin fills with a smell that makes your eyes water happily.
    - Your Nubbin eats its share and goes pink to the ears. The old man laughs at it, a real laugh.
    - **Old Man**: I had a daughter. I was hard on her. I told her what she must be, and never asked her what she was.
    - **Old Man**: She tried so hard. And I only ever told her to try harder.
    - He doesn’t say her name. He looks into the fire for a long time, and then he gives you the last apple.
- **Leave him to his apples and press on.** — sets `{"pa5-oldman":"left"}`
    - **Old Man**: Of course. Young legs. Go on.
    - When you look back from the slope, he is still at his fire, alone, turning the cold apple in his hands.

#### Done `pa5-03-cold-done`

_Link comes down from the fourth shrine with the slate glowing. He has done all four._  
**Pixel**: Four out of four. Your hero is very good at puzzles. Also at not talking about it.  

#### Complete `pa5-03-complete`

_The old man is gone from his cabin. In the snow by the door, he has left a note._  
_It says only: the temple roof. The writing is old-fashioned, and very straight._  
_By the cabin fire, he has left the stone pot as well, scrubbed clean, with a little stand for the fire._  
**Pixel**: He left you his pot. That’s a reward. I’ll put one in the Grove for you. Same shape.  

**Rewards**

- Stone cooking pot and campfire (decor): A round stone pot on a little campfire, the old man’s, for the Grove. It crackles when you walk past.

Sets on completion: `{"pa5-03":true}`

**Notes:** SIGNATURE (old man): pa5-03-cold sets pa5-oldman = ate | left. ate plays PA5_VARIANTS pa5-14-complete-ate in PA5-14. The daughter is Zelda; he never names her. The shrines are Link’s; the player waits outside (no shrine puzzles are ours to stage). The decor pot is cosmetic and lives in the Grove; the cartridge writes no Grove flag (the reward is granted through the Arcade save, like the Atlas keepsakes).

## PA5-4. The King’s Ghost

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the Temple of Time* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-3, from Pixel’s cabinet. · requires: PA5-3

**Cast:** King Rhoam (King Rhoam Bosphoramus Hyrule, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Climb to the roof of the ruined Temple of Time.

Hint: The broken stair at the back of the temple goes up. · check: `climb:pa5-temple:roof`

#### Scene `pa5-04-temple`

_The temple has no roof over its nave, only sky. Grass grows between the floor stones._  
_You climb up the back with Link. Your Nubbin is passed up the last bit like a parcel._  
_The old man is waiting at the top. Then he isn’t an old man any more._  
_He is tall and crowned and faintly blue, and the wind blows through him._  
**King Rhoam**: Forgive the cloak. I am, or I was, the king of this land. Rhoam. It has been a hundred years.  
**King Rhoam** _(sad)_: The Calamity came out of the earth and took the kingdom. Everyone I had, in a day.  
**King Rhoam** _(sad)_: My daughter, Zelda, holds it back inside the castle. Alone. Still. She is tiring.  
**King Rhoam**: Go to her, Link. Please. I have no right to ask, and I am asking.  
**Pixel** _(shock)_: Oh no. He’s a ghost. I knew it. I said riddle. Riddle was close.  

**Choices**

- **We’ll walk with him all the way.**
    - **King Rhoam**: Thank you. He will need people who walk beside him. He always did.
- **Why does she have to do it alone?**
    - **King Rhoam**: Because there was no one left to stand with her. And because of me, partly. Another time.

#### Done `pa5-04-temple-done`

_The king reaches behind him and holds out a paraglider: cloth and wood, mended many times._  

### Step 2: Jump from the plateau and glide down into the land.

Hint: Hold on, lean to steer, and let go over the grass. · check: `minigame:clear:pa5-glide-plateau`

#### Scene `pa5-04-glider`

**King Rhoam**: It will hold you. It held me, once, when I was young and stupid enough to jump off things.  
_He begins to fade, from the feet up. He doesn’t seem afraid of it._  
**King Rhoam** _(soft)_: If you see her, tell her… no. Let him tell her. He’ll know when.  
_Then there is only the wind on the roof, and the paraglider in Link’s hands._  
_Link walks to the edge, and looks back at you. He holds out his free arm._  
**Pixel**: Is he asking you to jump off a cliff with him? He is. That’s a friendship thing in this game.  

**Choices**

- **Hold on to Link, Nubbin in your other arm.**
    - You grab his belt, and your Nubbin grabs your collar. Link jumps.
- **Let your Nubbin go first, in Link’s arms.**
    - Link tucks your Nubbin in his elbow like a loaf, and you hold on to his back. Link jumps.

#### Done `pa5-04-glider-done`

_The cloth fills, and the plateau falls away. Below you, the green land tilts slowly, like a page turning._  
**Pixel** _(happy)_: WHEEEE. Sorry. That was me. I’m player two, I’m allowed to wheee.  

#### Complete `pa5-04-complete`

_You land in a meadow and roll. Your Nubbin lands on top of you, and stays there, delighted._  
**Pixel**: I’m putting a glider in the Grove. You can go off the top of the hill. Don’t tell Fern I said so.  
_Link points east, to a valley full of lanterns. That’s where you’re going._  

**Rewards**

- Paraglider (feature): A mended cloth paraglider. Glide off the Grove’s hill with your Nubbin in your arms.

Sets on completion: `{"pa5-04":true}`

**Notes:** The king fades softly from the feet up; no light burst. The glide is a short, unfailable minigame (you cannot fall; you only land sooner or later). The Grove paraglider is the hill-section feature the outline names.

## PA5-5. Kakariko

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Kakariko Village and Impa* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-4, from Pixel’s cabinet. · requires: PA5-4

**Cast:** Impa (Impa, elder of Kakariko Village (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Paya (Paya, Impa’s granddaughter (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Find the elder’s house in Kakariko Village.

Hint: The biggest house, up the steps; someone is sweeping. · check: `talk:pa5-paya:impa-house`

#### Scene `pa5-05-village`

_Kakariko sits in a fold of the hills, all wooden roofs and paper lanterns and the smell of rice._  
_A young woman is sweeping the step of the big house. She sees Link and drops the broom._  
**Paya**: Oh! Oh. It’s… you. I mean, welcome. I mean, Grandmother is expecting… oh dear.  
_She turns to face the door and talks to it instead of to Link. Her ears have gone red._  
**Paya**: I’m Paya. Please go in. I’ll… sweep. Out here. A great deal.  
_Your Nubbin picks up the broom and hands it back to her. She takes it from your Nubbin without blushing at all._  
**Pixel**: She can talk to your Nubbin. Just not to him. I understand that more than I’d like to.  

#### Done `pa5-05-village-done`

**Paya**: Thank you, little one.  
_Inside, someone very small is sitting under a very large hat._  

### Step 2: Hear Impa’s story of the Champions and the Divine Beasts.

Hint: Sit on the cushion in front of Impa. · check: `talk:pa5-impa:kakariko`

#### Scene `pa5-05-impa`

_Impa is tiny and ancient, and her hat is the size of a cart wheel. Her eyes are very bright under it._  
**Impa**: So. You came back. And you brought company, which is more sense than you used to have.  
**Impa**: A hundred years ago, the princess had four friends. Champions, one from each people.  
**Impa**: Mipha of the Zora. Daruk of the Gorons. Revali of the Rito. Urbosa of the Gerudo.  
**Impa**: Each one piloted a Divine Beast, a great old machine, to stand against the Calamity.  
**Impa** _(sad)_: The Calamity turned the Beasts on their own people. The four never came home.  
**Impa**: Their spirits are inside the Beasts still. Waiting, I think, for you.  
_Link looks at his hands again. Your Nubbin leans against his knee._  

#### Done `pa5-05-impa-done`

**Impa**: You don’t remember any of them. I know. That is why I have something for you.  

### Step 3: Look at Impa’s twelve photographs and decide how to follow them.

Hint: Impa will hand the photographs to you, since you carry things. · check: `inspect:pa5-photos:twelve`

#### Scene `pa5-05-photos`

_Impa gives you a bundle of twelve photographs, worn soft at the corners._  
**Impa**: Places he went with the princess. Stand where each was taken, and he may remember what happened there.  
_A meadow, a rainy tree, a spring, a road, a cliff over the sea. Zelda is in most of them, or at the edge._  
**Impa**: You carry them. He has enough to carry.  
**Impa**: Some lie on your road. Some are far out of the way, up mountains and down holes. Your choice.  
**Pixel**: Collectibles. My weakness. But that’s a lot of mountain. I am not ruling on this. It’s your legs.  

**Choices**

- **We’ll find every one of them.** — sets `{"pa5-memories":"all"}`
    - **Impa**: Every one. Good. That is the slow way, and the slow way is often the right one.
    - You lay the twelve photographs out on the floor, and Link looks at each one for a long time.
    - **Pixel**: Marking them all on the slate. Player two: also the map player.
- **Only the ones on our road. She’s waiting.** — sets `{"pa5-memories":"road"}`
    - **Impa**: She is. That is true too. Go on, then.
    - You put the photographs in your coat, close to your chest, where they won’t get rained on.

#### Done `pa5-05-photos-done`

**Impa**: My sister Purah, in Hateno, can mend that slate of his. Go and see her. Mind: she’s changed.  

#### Complete `pa5-05-complete`

_Paya is still sweeping when you leave. The step is the cleanest step in the land._  
**Paya**: Safe… safe road!  
_She says it to your Nubbin, and your Nubbin waves. Link, very slightly, waves too, and Paya drops the broom again._  
**Pixel** _(happy)_: Ruling: that was the best thing that’s happened in this cartridge so far.  

**Rewards**


Sets on completion: `{"pa5-05":true}`

**Notes:** SIGNATURE CHOICE: pa5-05-photos sets pa5-memories = all | road. all: the eight off-road memory sites are marked on the slate map, and each plays its PA5_VARIANTS pa5-mem-* scene when found (find:pa5-memory:<slug>). road: they stay unmarked and unplayable until PA5-18’s "look" choice. The four on-road memories (Mipha, shelter, sword, father) play in PA5-8, 12, 13 and 14 either way. Pays off in PA5-15 and PA5-18. The photo bundle goes in the player’s inventory as one item that fills as memories are seen.

## PA5-6. Hateno

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Hateno Ancient Tech Lab* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-5, from Pixel’s cabinet. · requires: PA5-5

**Cast:** Purah (Purah, director of the Hateno Ancient Tech Lab (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Find Purah’s lab on the hill above Hateno.

Hint: Follow the blue glow at the top of the town. · check: `visit:pa5-lab:hateno`

#### Scene `pa5-06-lab`

_The lab is a tall house on a hill, with a blue lantern on the roof that hums like Pixel’s cabinet._  
_A little girl in big round glasses opens the door. She looks about six, and she looks you up and down._  
**Purah**: Link! It is you! A hundred years and you still have the same hair. And who are these?  
**Purah**: I’m Purah. Impa’s big sister. Yes, big. I tried an experiment to make myself younger.  
**Purah** _(happy)_: It worked. Too well. I meant to lose twenty years and I lost about eighty.  
_Your Nubbin stands up very straight next to her. It is exactly her height._  
_It looks at her, and she looks at it. Your Nubbin sits down in the doorway, overcome with joy._  
**Pixel**: Someone its own height. It’s never met someone its own height who can also do science.  

**Choices**

- **So how old are you really?**
    - **Purah**: Old enough to know better, young enough to do it anyway! Come in.
- **Could you make my Nubbin taller?**
    - **Purah**: I could! I could probably make it a lot taller. I couldn’t promise it would stop.
    - Your Nubbin hides behind your leg. You decide it’s fine the size it is.

#### Done `pa5-06-lab-done`

**Purah**: Now. Give me that slate, Link. It’s been asleep as long as you have.  

### Step 2: Help Purah mend the slate, then pose for its first photograph.

Hint: Hand Purah the parts she asks for; stand in front of the slate when she says. · check: `photo:pa5-purah:lab`

#### Scene `pa5-06-slate`

_Purah plugs the slate into something that looks like a stove made of teeth._  
**Purah**: Spanner. No, the other spanner. No, that’s a fish. Why is there a fish?  
_Your Nubbin hands her things from the bench, one at a time. It is quickly better at this than you._  
_The slate lights up. A new symbol blinks on its face: a little camera._  
**Purah** _(happy)_: There! It takes pictures again. Picture of me. Now. While I still look this good.  
_Link holds up the slate, and Purah strikes a pose. Your Nubbin strikes the same pose, beside her._  
**Pixel**: Purah’s got my exact sense of humour. I don’t like it. I love it.  

#### Done `pa5-06-slate-done`

_The slate clicks. The picture is of Purah, your Nubbin and, at the edge, half of your ear._  
**Purah**: Perfect. Science!  

#### Complete `pa5-06-complete`

**Purah**: Those photographs of Impa’s. The slate can match them now: hold one up, and it will tell you when you’re close.  
**Purah**: Remembering is just finding the right place to stand. Most people never work that out.  
_As you leave, Purah and your Nubbin wave at each other until you are both round the corner._  

**Rewards**


Sets on completion: `{"pa5-06":true}`

**Notes:** Purah looks about six; she is old and brilliant, and every joke is hers, never at her expense. The slate now points to memory sites: with pa5-memories = all, all twelve are marked; with road, only the on-road four.

## PA5-7. Hestu

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Hestu and the Korok seeds* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-6, from Pixel’s cabinet. · requires: PA5-6

**Cast:** Hestu (Hestu, the giant Korok with maracas (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Find out what is troubling the enormous Korok on the road.

Hint: He’s hard to miss. He’s blocking the whole road. · check: `talk:pa5-hestu:road`

#### Scene `pa5-07-hestu`

_A creature made of wood and leaves is standing in the middle of the road, wringing its twiggy hands._  
_He is as tall as a cottage. His face is a leaf with three holes in it, and all three look worried._  
**Hestu** _(sad)_: Oh! Oh no, oh dear. Have you seen my maracas? I had them. And now I am a person without maracas.  
**Hestu**: The little Koroks took the seeds out of them to play. Now they’re hiding all over. They love hiding.  
**Hestu**: When you find one, it giggles. That’s how you know. It giggles, and it gives you a seed.  
_Somewhere in a bush nearby, very quietly, something giggles._  
_Your Nubbin stops dead, and its crown goes up. It giggles back._  
**Pixel**: Oh, they’re going to get on. That’s a giggling contest. Your Nubbin will win. It’s a professional.  

#### Done `pa5-07-hestu-done`

**Hestu**: Twelve seeds, please! The cartridge only has twelve hiding. Very fair of it.  

### Step 2: Let your Nubbin find all twelve hidden Koroks.

Hint: Follow your Nubbin; when it giggles, look under the rock or in the tree nearest it. · check: `collect:pa5-korok-seeds:12`

#### Scene `pa5-07-koroks`

_Your Nubbin trots off the road with its nose up, giggling every few steps, and listening._  
_Under a rock: a giggle. A tiny Korok pops up, with a leaf for a face and a seed in its hand._  
_In a ring of flowers, a giggle; on top of a pole, a giggle. At the bottom of a pond, a very wet giggle._  
_Link stands and waits for your Nubbin, holding a rock it asked him to lift._  
**Pixel** _(happy)_: Seven. Eight! Your Nubbin is the best Korok-finder in this whole game. I want that on its record.  
_Every Korok giggles once, gives its seed, and vanishes with a puff of leaves. Each is found once, and stays found._  

#### Done `pa5-07-koroks-done`

_Twelve seeds. Your Nubbin carries them back in its two cupped hands, and won’t let you help._  

### Step 3: Bring Hestu his seeds.

Hint: Hestu is still in the road, still worried. · check: `give:pa5-seeds:hestu`

#### Scene `pa5-07-dance`

_Your Nubbin pours the seeds into Hestu’s maracas. He shakes them, and they rattle._  
**Hestu** _(happy)_: My maracas! My maracas are whole! I must dance. I am sorry. It isn’t optional.  
_Hestu dances. It is a very large dance, all knees and leaves, and the road shakes a little._  
_Koroks pop out of the bushes all along the road to watch. Each one giggles once and ducks back in._  
**Pixel**: This is the best part of any game. The big wooden man dancing. Science agrees.  
**Hestu** _(happy)_: Join in! Everyone joins in! It’s the rule! I just made it!  

**Choices**

- **Dance too.**
    - You dance, and your Nubbin dances. Link, after a long pause, does one small step, and stops, and looks away.
    - **Pixel**: Did he just dance? He did. I saw it. I’m a witness.
- **Clap along.**
    - You clap, and Hestu dances harder. The maracas go faster than seems wise.

#### Done `pa5-07-dance-done`

**Hestu**: For the little one. It finds us better than we find ourselves.  

#### Complete `pa5-07-complete`

_Hestu gives your Nubbin a mask: a round green leaf with three holes in it, just its size._  
_Your Nubbin puts it on and giggles. Somewhere in a bush, very far off, the last Korok giggles back._  
**Pixel**: The mask goes in the Grove wardrobe. I’m not saying it should wear it to Moss. I’m not not saying it.  

**Rewards**

- Leaf-face mask (cosmetic): A round leaf mask with three holes, from Hestu. Your Nubbin giggles when it wears it.

Sets on completion: `{"pa5-07":true}`

**Notes:** KOROKS: exactly twelve, placed by hand, found once each, never respawning. They giggle (sound only) and never speak; we do not use the game’s Korok line. Your Nubbin giggles back when within range: that is the finding mechanic. Hestu talks (the source’s own talking creature).

## PA5-8. Zora’s Domain

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Zora’s Domain and Vah Ruta* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-7, from Pixel’s cabinet. · requires: PA5-7

**Cast:** Sidon (Prince Sidon of the Zora (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Muzu (Muzu, elder Zora and Mipha’s old teacher (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Mipha (Mipha, Zora Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Follow the flooded river up to meet the Zora prince.

Hint: Walk upriver in the rain; someone very tall will find you. · check: `talk:pa5-sidon:river`

#### Scene `pa5-08-rain`

_It won’t stop raining. The river is brown and fat and well over its banks._  
_A shape surges out of the water: a fish-man, red and white and enormous, with a smile like a lighthouse._  
**Sidon** _(happy)_: There you are! I have been looking for a Hylian for weeks, and you are one, and you brought friends!  
**Sidon**: I am Sidon, prince of the Zora. And I am in a bit of a pickle, though you mustn’t worry.  
**Sidon**: Vah Ruta, our elephant Beast, is spouting water night and day. If it goes on, the dam breaks.  
_He gives your Nubbin a thumbs up. Your Nubbin, who has no thumbs, does its best._  
**Pixel** _(think)_: He’s so cheerful. That’s the kind of cheerful that’s holding something up.  

#### Done `pa5-08-rain-done`

**Sidon**: Come up to the Domain! My father will want to meet you. Some of the elders… less so.  

### Step 2: Stand where the Domain photograph was taken.

Hint: Look by the statue at the heart of the Domain. · check: `watch:pa5-memory:mipha`

#### Scene `pa5-08-domain`

_Zora’s Domain glows blue and silver, all luminous stone and running water. In the middle stands a statue._  
_It is a young Zora woman, slender, with a gentle face. Sidon stops talking for once._  
**Muzu** _(angry)_: You. You have the nerve to walk in here. Our princess gave everything for you.  
**Sidon**: Muzu, please.  
**Muzu** _(sad)_: He doesn’t even remember her. Look at him.  
_Link takes one photograph from your coat: this place. He stands where the camera stood._  
_The rain goes quiet. A memory: Mipha, alive, holding Link’s cut hand in both of hers, and it heals._  
**Mipha** _(soft)_: There. You’re always getting hurt. Promise me you’ll let me be the one to heal you.  
_She wants to say more; you can see it. She doesn’t, and the memory goes._  

#### Done `pa5-08-domain-done`

_Muzu has seen Link’s face while he remembered. The old Zora turns away, and when he turns back he is quieter._  
**Muzu**: Go on, then. Bring her home.  

### Step 3: Go inside Vah Ruta and help free it.

Hint: The Beast’s terminals glow orange; your Nubbin can reach the small ones. · check: `puzzle:pa5-ruta:terminals`

#### Scene `pa5-08-ruta`

_Sidon swims Link up the waterfalls to the great stone elephant. You and your Nubbin ride on his back fin._  
_Inside, the Beast is all wheels and water and pipes, tilting as its trunk goes up and down._  
_Link opens the big terminals. Your Nubbin squeezes through to the small ones, and pats them till they turn blue._  
_At the last one, a gentle blue light gathers into a girl. It is Mipha._  
**Mipha** _(happy)_: Link. Oh, you’re here. And look at you, with friends. I’m so glad.  
**Mipha**: I was stuck for a long time. It was lonely, and wet, which I don’t mind. Thank you for coming.  
**Mipha**: Tell Sidon he’s been very brave. He won’t believe it from anyone else.  

**Choices**

- **I’ll tell him myself.**
    - **Mipha**: Thank you. Say it twice. He needs everything twice.
- **What did you want to say to Link, in the memory?**
    - **Mipha**: Oh. That was a hundred years ago. It can wait a bit more.

#### Done `pa5-08-ruta-done`

**Mipha**: Now. Let’s turn this great beast round. There’s a castle that needs a word with it.  

#### Complete `pa5-08-complete`

_Vah Ruta turns slowly, all its stone weight, until its trunk points at the far-off castle._  
_The rain stops. The sun comes out over the Domain, and every stone in it lights up._  
**Sidon** _(happy)_: You did it! She did it! I am going to cry, and it’s going to be very obvious, because I’m quite large.  
_He does. You tell him he was very brave, twice._  
**Pixel**: One Beast. Three to go. One memory. I’m counting. I’m always counting.  

**Rewards**


Sets on completion: `{"pa5-08":true}`

**Notes:** MEMORY (on-road, 1 of 4): Mipha’s Touch plays in pa5-08-domain. Mipha appears only as a spirit and in memory. Muzu’s blame is grief, and it softens on screen within the scene. The Beast is a puzzle with terminals; no fight is ours to stage (Link handles the Blight in one line if at all; here, not at all).

## PA5-9. Death Mountain

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Goron City and Vah Rudania* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-8, from Pixel’s cabinet. · requires: PA5-8

**Cast:** Yunobo (Yunobo of Goron City (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Daruk (Daruk, Goron Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Ride up Death Mountain with Yunobo.

Hint: Drink the fireproof potion first; your Nubbin goes in the pot. · check: `escort:pa5-yunobo:crater`

#### Scene `pa5-09-yunobo`

_Death Mountain glows red at the top. The air shimmers, and the rocks crack and spit._  
_You drink a fireproof potion that tastes of cold metal. Your Nubbin won’t drink it._  
_So your Nubbin rides in a cooking pot, with a lid, peeping out under the rim._  
**Yunobo** _(soft)_: Hi. I’m Yunobo. Sorry. I’m shy. Sorry I said sorry.  
**Yunobo**: My great-great-grandpa was Daruk. Everyone says I’m like him. I don’t think I’m like him at all.  
**Yunobo**: I can roll, though. And I can’t get hurt by stuff. So, um, I can roll you up there. If you like.  
_Yunobo curls into a ball, and Link climbs into a cannon. You hold your Nubbin’s pot very firmly._  
**Pixel**: This is the most ridiculous transport I’ve ever seen. I love it. Fire!  

#### Done `pa5-09-yunobo-done`

_Yunobo rolls up the slope like a boulder that has decided to be brave._  
**Yunobo** _(happy)_: Did I do good? I did good! Sorry. I mean: good.  

### Step 2: Go inside Vah Rudania and help free it.

Hint: The Beast tips over to walk on the wall; the terminals tip with it. · check: `puzzle:pa5-rudania:terminals`

#### Scene `pa5-09-rudania`

_Vah Rudania is a stone salamander as big as a hill, walking round the crater rim with lava dripping off it._  
_Inside, the whole Beast tips on its side to climb a cliff. The floor becomes the wall._  
_Your Nubbin rolls about in its pot, quite happily, all the way to the far wall and back._  
_At the last terminal, a big warm light gathers into a big warm Goron: Daruk._  
**Daruk** _(happy)_: HAH! Little brother! You finally made it. And you brought a cook and a pot with a face in it!  
**Daruk**: Yunobo got you up here? My Yunobo? Ha! I knew that kid had it in him.  
**Daruk**: Tell him something from me. Tell him being scared doesn’t make you not brave. It makes it count.  

**Choices**

- **I’ll tell him exactly that.**
    - **Daruk**: Good. Then I’ll lend Link my shield. Everybody gets a present today!
- **Let your Nubbin out to say hello.**
    - Your Nubbin climbs out of the pot. Daruk’s ghost pats its head, very gently, with one huge finger.

#### Done `pa5-09-rudania-done`

_Vah Rudania climbs to the top of the crater and turns its great head towards the castle._  

#### Complete `pa5-09-complete`

_Back down the mountain, you tell Yunobo what Daruk said. He listens with his whole face._  
**Yunobo** _(shock)_: He said that? About me?  
_He cries a bit, and then he laughs, and then he rolls down the road ahead of you, just because he can._  
**Pixel**: Two Beasts. I’m running out of fingers for this. I mean I’ve got eight left, but the principle.  

**Rewards**


Sets on completion: `{"pa5-09":true}`

**Notes:** The potion is the fireproof elixir; your Nubbin refuses it and rides in a cooking pot (comic, safe; the pot is cool). Daruk appears only as a spirit. Yunobo’s cannon ride is a cutscene, not a minigame.

## PA5-10. Rito Village

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Rito Village and Vah Medoh* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-9, from Pixel’s cabinet. · requires: PA5-9

**Cast:** Kass (Kass, the wandering Rito bard (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design; never sings), Teba (Teba, Rito warrior (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Revali (Revali, Rito Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Listen to the bard in the square at Rito Village.

Hint: He’s on the landing below the elder’s perch, with an accordion. · check: `sit:pa5-kass:village-square`

#### Scene `pa5-10-kass`

_Rito Village is built round a stone spire over a lake, all ladders and landings and feathers._  
_In the square a tall blue bird-man is playing an accordion. He doesn’t sing; he only plays._  
**Kass**: Ah, travellers. Sit if you like. These are my teacher’s tunes. He wrote them for the princess.  
**Kass**: He’s long gone now. I play them so somebody still does.  
_The tune goes up and comes down slowly, like a bird landing._  
_Your Nubbin sits at Kass’s feet and sways. Link stands at the back with his arms folded and doesn’t leave._  
**Pixel** _(soft)_: No words. Good. Some tunes are better without words. You fill them in yourself.  

**Choices**

- **Put a coin in his hat.**
    - **Kass**: Thank you. My chicks will eat tonight. There are many of them. They eat a lot.
- **Play the last one again?**
    - He does. It’s better the second time, the way some things are.

#### Done `pa5-10-kass-done`

**Kass**: Teba is looking for someone brave enough to fly at the Beast. Up on the flight range.  

### Step 2: Help at the flight range while Teba trains Link.

Hint: Stand on the windy ledge and call out the targets as they rise. · check: `minigame:clear:pa5-flight-range`

#### Scene `pa5-10-range`

_The flight range is a hut on a cliff, with warm air rushing up from below. Teba, a white Rito, is waiting._  
**Teba**: You’re the Hylian? You glide? Good. Show me. The Beast won’t let anyone near.  
**Teba**: Five targets. You call them, he shoots, I fly. Don’t blink.  
_Link jumps off the cliff, and the warm air catches his glider. You shout every target as it rises._  
_Your Nubbin points at each one too, a half-second before you see it._  
**Pixel**: Your Nubbin is a better spotter than you. No offence. All offence.  

#### Done `pa5-10-range-done`

**Teba**: Not bad. Not bad at all. Tomorrow, we go for the bird.  
_He nods at your Nubbin, warrior to warrior._  

### Step 3: Go inside Vah Medoh and help free it.

Hint: The Beast tilts to one side and then the other; walk with the tilt. · check: `puzzle:pa5-medoh:terminals`

#### Scene `pa5-10-medoh`

_Teba flies Link up through a storm of wind to the great stone bird. You and your Nubbin follow in a basket._  
_Inside Vah Medoh, the floor tilts like a ship’s deck. Your Nubbin slides from one side to the other and back._  
_At the last terminal, a sharp blue light gathers into a slim, proud Rito: Revali._  
**Revali**: Well. Look who finally found the time. A century, give or take. I wasn’t counting.  
**Revali**: And you’ve brought… a gardener. And a small round thing. Charming.  
_He looks at your Nubbin for a long time. Your Nubbin looks back, quite as proud._  
**Revali**: Fine. It has spirit. I’ll give you that. Don’t tell anyone I said so.  

#### Done `pa5-10-medoh-done`

**Revali**: Take my gale, then. And use it properly. Go and get her.  
_Vah Medoh tips its great wings and turns its beak towards the castle._  

#### Complete `pa5-10-complete`

_Back in the square, Kass is still playing. Now the tune sounds a little like a bird that has found its way home._  
**Pixel**: Three Beasts. Revali’s my favourite. Don’t tell the others. He’d be unbearable.  

**Rewards**


Sets on completion: `{"pa5-10":true}`

**Notes:** KASS: tunes only, described, never sung; no words of his songs anywhere, no music from the game (an original accordion tune in the same mood). The flight range is a light spotting minigame: the player calls targets; Link shoots. Revali appears only as a spirit.

## PA5-11. Gerudo Town

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Gerudo Town, the Yiga hideout and Vah Naboris* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-10, from Pixel’s cabinet. · requires: PA5-10

**Cast:** Riju (Riju, young chief of the Gerudo (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Buliara (Buliara, Riju’s guard (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Yiga Footsoldier (A Yiga Clan footsoldier, played comic (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Urbosa (Urbosa, Gerudo Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Go into Gerudo Town with Riju’s guard, Buliara.

Hint: Buliara meets you at the oasis outside the gate. · check: `escort:pa5-buliara:gerudo-town`

#### Scene `pa5-11-riju`

_The desert is white and hot. Gerudo Town shimmers behind its walls, all palms and painted cloth._  
**Buliara**: You are the travellers the elder of Kakariko wrote about. Walk with me. Speak when spoken to.  
_Buliara is very tall, with a very large sword. Your Nubbin walks very close to your leg._  
_The chief is young, about twelve, with a heavy gold crown and a sand seal asleep at her feet._  
**Riju**: I need my Thunder Helm. It was my family’s. The Yiga clan stole it from under our noses.  
**Riju**: Without it I can’t go near Vah Naboris. And the sandstorm is getting worse.  
**Buliara**: The chief should not go into the hideout herself.  
**Riju** _(angry)_: The chief knows that, Buliara.  

**Choices**

- **We’ll get it back for you.**
    - **Riju**: Thank you. Bring it here, and I’ll lead you to the Beast. Me. Personally.
- **Who are the Yiga?**
    - **Buliara**: Thieves. Very sneaky. Very fond of bananas. Too fond of bananas.

#### Done `pa5-11-riju-done`

_Buliara gives you a bunch of bananas from the market. She does not explain, and she doesn’t need to._  

### Step 2: Sneak through the Yiga hideout and get the Thunder Helm.

Hint: Leave bananas where the guards can see them, and slip past while they look. · check: `place:pa5-bananas:yiga-hideout`

#### Scene `pa5-11-yiga`

_The Yiga hideout is in a cave in the canyon, all red banners and torches and a strong smell of fruit._  
_A Yiga footsoldier in a red suit and a white mask guards a corridor, eating a banana._  
**Yiga Footsoldier**: Halt! Who goes… is that a banana? No. Focus. Who goes there?  
_Your Nubbin places a banana on the floor, very slowly, and backs away._  
**Yiga Footsoldier**: That is a trap. I know that is a trap. I am not falling for a trap.  
_He stares at the banana for a long time. Then he leans down to pick it up._  
_You walk past him with Link. Your Nubbin leaves a second banana, just in case._  
**Pixel**: I’d love to say the villains are cleverer than this. They’re not. They really love bananas.  

#### Done `pa5-11-yiga-done`

_The helm is in a chest at the back, beside a mountain of banana skins._  
**Yiga Footsoldier** _(angry)_: Oh, come ON.  
_Link runs, and you run. Your Nubbin runs fastest, giggling._  

### Step 3: Go inside Vah Naboris in the sandstorm and help free it.

Hint: Riju’s lightning drops the Beast’s shield; then you’re inside. · check: `puzzle:pa5-naboris:terminals`

#### Scene `pa5-11-naboris`

_Riju puts on the helm. Lightning comes down round the stone camel, and its shield fails._  
_Inside Vah Naboris, the Beast turns slowly on great stone gears. Your Nubbin follows the sparks round the walls._  
_At the last terminal, a tall golden light gathers into a woman: Urbosa, the Gerudo chief of a hundred years ago._  
**Urbosa** _(happy)_: There you are. You took your time. You always did, with dawdling, you know. But not with her.  
**Urbosa**: I watched the princess grow up. Her mother was my dearest friend. I promised to look after her.  
**Urbosa** _(soft)_: I couldn’t. Not at the end. So you will, won’t you?  
_She looks down at your Nubbin, and then at you._  
**Urbosa**: And so will you, I can see. Good. She can’t have too many friends.  

#### Done `pa5-11-naboris-done`

**Urbosa**: Take my fury, then. It’ll be useful.  
_Vah Naboris turns in the sand until it faces the far castle._  

#### Complete `pa5-11-complete`

**Riju** _(happy)_: Four Beasts. All four, aimed at the castle. A hundred years of waiting, and it’s you who came.  
**Buliara**: The chief did very well.  
**Riju** _(happy)_: The chief knows that, Buliara.  
**Pixel**: Four Beasts. Four Champions. Zero fingers left. Now the castle.  

**Rewards**


Sets on completion: `{"pa5-11":true}`

**Notes:** CARE: the game’s disguise to enter Gerudo Town is left out; you enter with Buliara as escorts of the elder’s letter. The Yiga are comic: masks, red suits, banana weakness; no ninja clichés, no bowing gags, no accents. Banana placement is a light stealth beat that cannot fail. Urbosa appears only as a spirit.

## PA5-12. Shelter from the Storm

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the memory "Shelter from the Storm"* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-11, from Pixel’s cabinet. · requires: PA5-11

**Cast:** Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Find the rainy tree from the photograph.

Hint: It’s on your road; hold the photograph up until the slate chirps. · check: `find:pa5-photo:shelter`

#### Scene `pa5-12-road`

_It starts to rain on the road. Proper rain, the kind that runs down your neck._  
_You take out the photograph with the tree in it. The tree is right there, by the road._  
_Link goes and stands under it, where the camera stood. So do you, and your Nubbin._  
**Pixel**: This one’s on the road. You didn’t even have to look for it. Some memories wait for you.  
_The slate chirps once, softly. The rain gets quieter, and then it isn’t this rain any more._  
_It is the same rain, a hundred years ago._  

### Step 2: Sit at the edge of the memory.

Hint: Stay under the tree with your Nubbin until the memory ends. · check: `sit:pa5-memory:shelter-edge`

#### Scene `pa5-12-memory`

_Under the tree, a young woman in a hood is sitting with her knees pulled up. Link is beside her, younger._  
**Zelda**: I’ve prayed every day since I was little. At the springs, in the cold, until I couldn’t feel my feet.  
**Zelda**: Everyone says the power is in my blood. My mother had it. Her mother had it.  
**Zelda** _(sad)_: It won’t come. I don’t know what I’m doing wrong. I don’t know what I am, if I’m not that.  
_Link doesn’t say anything. He sits beside her in the rain._  
_You and your Nubbin are at the edge of the memory, under the same tree, in the same rain. They can’t see you._  
**Pixel** _(soft)_: He doesn’t fix it. He just stays. I think that’s the right answer. I think it’s nearly always the right answer.  

**Choices**

- **Shift a little closer.**
    - You move up under the branches. The rain drips off the leaves on to all of you the same.
- **Stay where you are.**
    - You stay. Your Nubbin leans against you, and you all listen to the rain.

#### Done `pa5-12-memory-done`

_The memory goes, and the rain is now again. Link is still sitting under the tree, with his eyes shut._  

#### Complete `pa5-12-complete`

_After a while, he stands up. He puts the photograph back in your coat himself, carefully, out of the rain._  
**Pixel**: Memory two. I’ve stopped making jokes about counting. It doesn’t feel like that kind of counting now.  

**Rewards**


Sets on completion: `{"pa5-12":true}`

**Notes:** MEMORY (on-road, 2 of 4): Shelter from the Storm. Zelda is seen here for the first time; licensed design. The memory is staged with you and your Nubbin visible at its edge, slightly greyed, unseen by them. Hazel’s third rule is acted here (Link sits and waits) and never quoted.

## PA5-13. The Lost Woods

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the Lost Woods, Korok Forest and the sword* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-12, from Pixel’s cabinet. · requires: PA5-12

**Cast:** The Great Deku Tree (The Great Deku Tree (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Follow the torch flames through the fog.

Hint: Go the way the flame leans; your Nubbin listens for giggles. · check: `walk:pa5-torches:lost-woods`

#### Scene `pa5-13-fog`

_The Lost Woods are full of fog, thick and white and still. Anyone who wanders off the path is turned round._  
_Link lights a torch. The flame leans gently one way, as if something were breathing on it._  
_You follow the lean. Your Nubbin follows the giggles, which come from the same direction._  
**Pixel**: Don’t go the wrong way. I can’t see you in this. You’re a white screen with a torch in it.  
_Once, you turn the wrong way. The fog thickens, and you are back where you started._  
_Your Nubbin giggles, sharply: it wants you to keep up. You do._  

#### Done `pa5-13-fog-done`

_The fog lifts all at once. In front of you is a green forest full of little leaf-faced Koroks, and a tree._  

### Step 2: Speak with the Great Deku Tree.

Hint: The tree in the middle of the forest. It has a face. · check: `talk:pa5-deku:korok-forest`

#### Scene `pa5-13-deku`

_The Great Deku Tree is so old it has a face, with a long mossy moustache. When it talks, the leaves shake._  
**The Great Deku Tree**: Ah. Young Link. It has been a long time. I have kept something for you, as I was asked.  
**The Great Deku Tree**: And you have brought a gardener. And a small friend that my Koroks have been talking about. Welcome.  
_Koroks come out of every bush to look at your Nubbin. It giggles, they all giggle back, and it goes on a while._  
_In a clearing in front of the tree, a sword is stuck in a stone. Its blade shines through the moss._  
**The Great Deku Tree**: The sword has waited a hundred years. It will only come out for one who is strong enough.  
**Pixel**: This is the bit where you find out if your hero’s been eating his greens.  

**Choices**

- **Who asked you to keep it?**
    - **The Great Deku Tree**: Ah. Look and see. The young one is about to remember it for himself.
- **Wait with the Koroks.**
    - A Korok sits on your Nubbin’s head. Your Nubbin allows this.

### Step 3: Watch Link at the sword in the stone.

Hint: Stand by the stone; the memory comes when he takes the hilt. · check: `watch:pa5-memory:sword`

#### Scene `pa5-13-sword`

_Link puts his hands on the hilt. Before he can pull, the forest changes into a memory._  
_Zelda, a hundred years ago, is kneeling by this same stone. She is tired and dirty, as if she has walked a long way._  
**Zelda** _(soft)_: He’ll come back for it. He has to. I’m leaving it here, where it’s safe.  
**Zelda**: And I’m going back. Alone. To hold it off as long as I can.  
_She lays the sword in the stone, stands up, and walks away into the fog. She doesn’t look back._  
_The memory goes, and Link pulls. His arms shake, and the sword comes out, ringing._  

#### Done `pa5-13-sword-done`

**The Great Deku Tree**: So. You are strong enough. She knew you would be.  
_Your Nubbin looks up at the sword, and then at Link, and then holds his free hand._  

#### Complete `pa5-13-complete`

_On the way out of the forest, the Koroks giggle you out, all the way to the edge of the fog._  
**Pixel**: Three memories. She left that sword there herself and went back. I keep thinking about her walking back.  

**Rewards**


Sets on completion: `{"pa5-13":true}`

**Notes:** MEMORY (on-road, 3 of 4): the sword left at the Deku Tree (our own staging of the game’s memory of Zelda at the Lost Woods). The Great Deku Tree talks (the source’s own talking tree). Pulling the sword is a hold-the-button beat that always succeeds once Link is strong enough (the step requires PA5-12; no stamina gate is ours).

## PA5-14. Father and Daughter

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the memory "Father and Daughter"* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-13, from Pixel’s cabinet. · requires: PA5-13

**Cast:** King Rhoam (King Rhoam Bosphoramus Hyrule, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Find the courtyard from the photograph, in the ruins near the castle.

Hint: The broken garden by the old town walls; look for the fountain. · check: `explore:pa5-castle-town:courtyard`

#### Scene `pa5-14-road`

_The ruined town below the castle is quiet. Grass grows in the streets; old machines sleep in the squares._  
_You take out the photograph of a garden with a fountain. You find the fountain, dry and cracked._  
**Pixel** _(think)_: This is the closest you’ve been. That cloud’s right overhead. It’s… I don’t like it, so close.  
_Your Nubbin picks a single blue flower from between the stones and holds it._  
_Link stands where the camera stood, by the fountain._  
_The slate chirps, quietly, the way it does when it has found the place._  

**Choices**

- **Stand next to him.**
    - You stand next to him. The memory comes like a door opening.
- **Stand back a little.**
    - You stand back with your Nubbin. The memory comes like a door opening.

### Step 2: Watch the memory by the fountain.

Hint: Stay where you are until it ends. · check: `watch:pa5-memory:father`

#### Scene `pa5-14-memory`

_The garden is green again. Zelda, seventeen, is walking fast with a notebook, and the king blocks her way._  
**King Rhoam**: Where have you been? The springs? Or that laboratory again?  
**Zelda**: The ancient machines can help us. I’m close to understanding them, Father. I can be useful.  
**King Rhoam**: You are not here to be useful with machines. You are here to wake your power. Pray. That is your duty.  
**Zelda** _(angry)_: I have prayed! Every day of my life, I have prayed. Nobody has ever asked what else I could do.  
**King Rhoam** _(angry)_: Enough. You are not a child. Stop playing with machines and do what only you can do.  
_She stands very straight, with her notebook pressed against her chest. She doesn’t cry until he has gone._  

#### Done `pa5-14-memory-done`

_The memory goes, and the fountain is dry again. Your Nubbin is still holding its blue flower._  

#### Complete `pa5-14-complete`

_The memory just ends. Link stands by the fountain for a while._  
_Your Nubbin puts its blue flower on the edge of the fountain. Then you go on._  
**Pixel**: Four memories on the road. That’s every one on the road. The rest of the road goes to the castle.  

**Rewards**


Sets on completion: `{"pa5-14":true}`

**Notes:** MEMORY (on-road, 4 of 4): Father and Daughter. The king is hard, not cruel; Zelda’s fury is shown with respect. OLD MAN PAYOFF: with pa5-oldman = ate, play PA5_VARIANTS pa5-14-complete-ate instead of pa5-14-complete (you tell Link the old man is sorry now). With left, the memory just ends, as written. The blue flower is a silent princess (unnamed here).

## PA5-15. The Road to the Castle

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Impa’s last photograph and Blatchery Plain* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Any time after PA5-14, from Pixel’s cabinet. · requires: PA5-14

**Cast:** Impa (Impa, elder of Kakariko Village (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Paya (Paya, Impa’s granddaughter (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Go back to Kakariko and show Impa the photographs.

Hint: Impa is under her hat, as always. · check: `talk:pa5-impa:kakariko-return`

#### Scene `pa5-15-impa`

_Back in Kakariko, Paya drops the broom again. It has become a sort of greeting._  
_You lay the photographs out on Impa’s floor. Some have a little blue tick in the corner from the slate, and some don’t._  
**Impa**: Hm. You found the ones on your road. Good. He remembers her a little now. I can see it in him.  
**Impa**: Some memories are still waiting, out in the hills. They’ll keep. Memories are patient. More patient than us.  
**Impa**: Go, then. She has waited long enough. Go to the castle.  
**Pixel**: That’s fine. That’s a fine way to do it. Some people read the whole book. Some go straight to the end.  

**Choices**

- **We’re ready.**
    - **Impa**: Nobody is ever ready. Go anyway.
- **Should we have looked for the rest?**
    - **Impa**: You came back. That is what matters most. The rest can be found another day.

#### Done `pa5-15-impa-done`

**Impa**: Paya. Stop dropping things and wish them luck.  
**Paya**: Luck! Good… luck!  

### Step 2: Cross Blatchery Plain on the road to the castle.

Hint: The road runs straight across the plain to the castle gate. · check: `walk:pa5-blatchery:plain`

#### Scene `pa5-15-plain`

_The road to the castle crosses a wide flat plain. It is grassy and quiet._  
_All over it lie old machines, great broken spiders of stone and metal, with moss growing on their backs._  
_They’re asleep, or dead. Birds sit on them, and flowers grow from their joints._  
_Link walks past them without slowing. He doesn’t look at them, and he doesn’t look away._  
**Pixel** _(think)_: Something happened here. I don’t know what. The game isn’t telling you. Maybe that’s right.  
_Your Nubbin walks close to your leg until the plain is behind you._  

#### Complete `pa5-15-complete`

_At the end of the plain the castle rises, dark and huge, with the red-black cloud turning round its top._  
_Link looks at it, then at you and your Nubbin, as if to check you’re still there. You are._  
**Pixel**: Last stop. Player two’s holding the controls with both hands.  

**Rewards**


Sets on completion: `{"pa5-15":true}`

**Notes:** MEMORY PAYOFF (quest 5, ten quests later). Title: "The Road to the Castle" as written; with the hunt it is shown as "The Thirteenth Photograph". RULE: if pa5-memories = all AND all twelve memories have been seen (four on-road plus the eight pa5-mem-* scenes), play PA5_VARIANTS pa5-15-impa-hunt, pa5-15-plain-hunt and pa5-15-complete-hunt in place of pa5-15-impa, pa5-15-plain and pa5-15-complete. pa5-15-complete-hunt sets pa5-thirteenth = true. With all but fewer than twelve found, play the scenes as written (Impa: some are still waiting). The hunt variant of step 1 keeps the step’s check. The Blatchery memory shows Link going down on one knee in the mud; never a wound.

## PA5-16. Hyrule Castle

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): Hyrule Castle and the sanctum* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-15, from Pixel’s cabinet. · requires: PA5-15

**Cast:** Mipha (Mipha, Zora Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Daruk (Daruk, Goron Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Revali (Revali, Rito Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Urbosa (Urbosa, Gerudo Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Watch the four Beasts fire on the castle.

Hint: Stand at the castle gate and look up. · check: `watch:pa5-beasts:castle`

#### Scene `pa5-16-beams`

_The castle is dark and dripping with the Calamity’s ooze, red and black and slow, like old jam._  
_Far away, on the horizon, four great shapes stir. One after another, they glow._  
**Mipha**: Now, Ruta!  
**Daruk**: Rudania, let’s go! HAH!  
**Revali**: Medoh. Try to keep up.  
**Urbosa**: Naboris. For her.  
_Four beams of blue light cross the sky and strike the castle, one after another. The cloud shrieks and shrinks._  
**Pixel** _(happy)_: Oh, that’s good. That’s so good. They waited a hundred years to do that.  

#### Done `pa5-16-beams-done`

_The ooze slides back off the castle walls like a tide going out. The way in is open._  

### Step 2: Climb up through the castle with Link.

Hint: Up the long stair, through the library, to the top. · check: `climb:pa5-castle:sanctum`

#### Scene `pa5-16-climb`

_Inside, the castle is silent. Dust lies on everything, and the Calamity’s ooze still drips from the ceilings._  
_You pass a library with its books still on the shelves, and a girl’s study with drawings of machines on the wall._  
_In the study, on the desk, is a notebook, open. The ink is a hundred years old._  
_Your Nubbin climbs on the chair and looks at it. You don’t read it; it isn’t yours._  
_Link stops at the study door for a long moment. Then he goes on up the stairs, faster._  
**Pixel**: I wanted to read that. I didn’t. I’m very proud of myself, player one.  

**Choices**

- **Close the notebook gently.**
    - You close it, and put a pencil on top, so it stays where she left it.
- **Leave it open, as she left it.**
    - You leave it open. Someone should be able to come back to the page they were on.

### Step 3: Wait at the sanctum door while Link goes in.

Hint: Stand by the door with your Nubbin; it isn’t your fight. · check: `wait:pa5-sanctum:door`

#### Scene `pa5-16-sanctum`

_At the top is the sanctum, a great hall with a hole in its roof. In the middle hangs a huge cocoon of red and black._  
_Wrapped round the cocoon, holding it shut, is a light: gold, steady, and very faint now._  
**Zelda** _(sad)_: Link. You came. I can’t… hold it much longer. Please.  
_Link goes in. You stop at the door with your Nubbin, as you have stopped at every door._  
_Then the gold light flickers, and the cocoon bursts, and the Calamity breaks free._  
_It is enormous and spidery and red-black. It goes straight at Link._  
**Pixel** _(shock)_: Stay at the door. Stay at the door. That’s his. That’s always been his.  

#### Done `pa5-16-sanctum-done`

_There is noise and light. You keep your Nubbin behind you and your eyes on Link._  
_He stands, and keeps standing. The Calamity screams and goes up through the hole in the roof._  

#### Complete `pa5-16-complete`

_It goes out over the field outside, a cloud of red and black. It is getting bigger as it goes._  
**Zelda**: It’s fleeing into the field. It’s going to make itself a body. A big one.  
**Pixel**: Then go to the field. All of you. Go!  

**Rewards**


Sets on completion: `{"pa5-16":true}`

**Notes:** The Champions appear only as voices and beams of light here. The fight in the sanctum is Link’s: staged in two narrated lines, off-centre, with no impact frames. You and your Nubbin are at the door throughout. Zelda is a gold light round the cocoon until PA5-17.

## PA5-17. The Field

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the field before the castle* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-16, from Pixel’s cabinet. · requires: PA5-16

**Cast:** Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Clank (Claptrap, the CL4P-TP unit (Borderlands), reference only; the Grove’s own robot from S21)

### Step 1: Watch the Calamity rise in the field.

Hint: Out of the castle gate, and on to the field. · check: `watch:pa5-beast:field`

#### Scene `pa5-17-beast`

_On the field, the cloud pulls itself together into a beast. It is the size of the field, with eyes like furnaces._  
_It isn’t gory. It’s just very, very big, and angry, and made of smoke that has got ideas._  
_A gold light comes down out of the sky and stands in front of Link. It speaks with Zelda’s voice._  
**Zelda**: Link. The bow. Take it. Its arrows are light. Aim for the eyes. I’ll hold it as long as I can.  
_A bow of light is in his hands. A horse comes galloping out of the grass and stops in front of you._  
**Pixel** _(shock)_: Wait. Are we the horse people? We’re the horse people.  

#### Done `pa5-17-beast-done`

_You take the horse’s reins, and Link climbs on. Your Nubbin climbs on behind him, then thinks again and climbs on you._  

### Step 2: Hold the horse steady while Link rides and aims.

Hint: Keep the reins steady and ride where the light points. · check: `minigame:clear:pa5-hold-horse`

#### Scene `pa5-17-horse`

_The horse gallops. You run beside it with the reins, then the horse goes faster than you can run._  
_You climb up behind Link somehow, holding the reins round him. Your Nubbin is wedged between you, squeaking._  
_Link rises in the saddle and draws the bow of light. The arrows go up like falling stars, the wrong way._  
**Pixel** _(happy)_: GO ON! GO ON! LEFT! LEFT! WHAT A SHOT! He’s through! He’s through!  
**Pixel** _(happy)_: One more! ONE MORE! YES! THE CROWD GOES WILD! The crowd is me! I’m the crowd!  
_The beast swings its great head round to follow you. The horse’s ears go flat._  

**Choices**

- **Hold the reins steady and straight.** — sets `{"pa5-17-hold":"steady"}`
    - You keep the horse straight. The last arrow goes clean and true.
- **Talk to the horse, soft and low.** — sets `{"pa5-17-hold":"gentle"}`
    - The horse’s ears turn back to you, and it stops being frightened. The last arrow goes clean and true.

#### Done `pa5-17-horse-done`

_The beast’s eyes go dark, one and then the other. It sags into the field like a tent coming down._  
**Pixel** _(happy)_: That’s the whole stadium on its feet. In a shed. Just me. Standing on a stool.  

#### Complete `pa5-17-complete`

_The horse slows to a walk, and you pat its neck. Your Nubbin pats it too, on its ear, which it allows._  
_In front of you, where the beast was, the gold light is standing up, and growing brighter._  

**Rewards**


Sets on completion: `{"pa5-17":true}`

**Notes:** HOLD THE HORSE: an unfailable rhythm minigame (keep the reins in the band); Link does all the shooting. The beast is red-black smoke and stone, never gory; its defeat is a sag, not a death. Pixel cheers like a football crowd (original crowd lines, no chants). WITH s21Done: play PA5_VARIANTS pa5-17-horse-done-clank instead of pa5-17-horse-done (Clank cheers too). pa5-17-hold is read by nothing.

## PA5-18. A Hundred Years

*The Legend of Zelda: Breath of the Wild (Nintendo, 2017): the sealing and the ending* · audience: all · where: Pixel’s arcade cabinet, the lantern shed: The Hundred-Year Sleep (Pixel’s Arcade) · when: Straight after PA5-17, from Pixel’s cabinet. · requires: PA5-17

**Cast:** Zelda (Princess Zelda (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), King Rhoam (King Rhoam Bosphoramus Hyrule, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Mipha (Mipha, Zora Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Daruk (Daruk, Goron Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Revali (Revali, Rito Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design), Urbosa (Urbosa, Gerudo Champion, as a spirit and in memory (The Legend of Zelda: Breath of the Wild (Nintendo, 2017)); licensed design)

### Step 1: Watch Zelda seal the Calamity.

Hint: Stay with the horse; the light does the rest. · check: `watch:pa5-zelda:seal`

#### Scene `pa5-18-seal`

_The gold light holds up its hands. The last of the beast is pulled into it, smoke and all, and is gone._  
_The red-black cloud over the castle thins, and thins, and is blue sky._  
_On the castle wall, faint and blue, stand five figures: the old king and the four Champions._  
**Daruk** _(happy)_: HAH!  
**Revali**: Well. That was adequate.  
_Mipha waves, small and shy. Urbosa puts her hand on the king’s shoulder, and he nods, and keeps nodding._  
**King Rhoam** _(soft)_: Thank you. All of you. Even the little one.  
_Then the five figures fade, one after another, the way the king did on the temple roof: unafraid._  

#### Done `pa5-18-seal-done`

_Where the gold light stood, there is a young woman in a white dress. She is very tired, and smiling._  

### Step 2: Stay with them in the field.

Hint: Stand back a little with your Nubbin. · check: `wait:pa5-field:credits`

#### Scene `pa5-18-question`

_Zelda walks across the grass to Link. You stand back a little with your Nubbin and the horse._  
**Zelda**: Link. You did it. Thank you. I mean it: thank you, for coming back.  
**Zelda** _(soft)_: And thank you, both of you. I don’t know you, but I think you’ve been carrying him a little.  
_She turns back to Link. She looks at him for a long time, as if she’s afraid of the answer._  
**Zelda**: Do you… really remember me?  
_Link opens his mouth, for the first time since the pool. The screen goes white before you hear what he says._  
**Pixel** _(shock)_: Oh, you’re joking. You are JOKING. They cut it there?  

#### Complete `pa5-18-complete`

_The credits roll over the field, the castle and the sky. Then the screen shows the field again, and the question._  
_The shed comes back around you: sawdust, the heater, Pixel on her stool. Your Nubbin is asleep in your lap._  
**Pixel**: That was good. That was really good. The end’s a question. I don’t mind a question.  
**Pixel**: There are memories you didn’t find, you know. The cartridge keeps the photographs, if you want to go back and look.  

**Choices**

- **One day, we’ll go back and look.** — sets `{"pa5-18-after":"look"}`
    - **Pixel**: I’ll mark them on the slate for you. They’ll keep. Memories are patient. That’s what the tiny lady said.
- **Let the question stay a question.** — sets `{"pa5-18-after":"leave"}`
    - **Pixel**: Fair. Some endings are better with a bit of room in them.

**Rewards**

- The twelve photographs (decor): Impa’s twelve photographs in a frame on the cottage wall, filled in as you found each one.
- High-score plate: The Hundred-Year Sleep (decor): A brass plate for Pixel’s cabinet with your name on it, for High Score Night.

Sets on completion: `{"pa5-18":true,"pa5-done":true}`

**Learning Grove swaps**

- `pa5-18-complete-hunt#6` → I don’t mind. I really don’t.

**Notes:** ENDINGS (quest 5 payoff, thirteen quests later). AS WRITTEN: the field and the question (pa5-thirteenth unset). WITH pa5-thirteenth = true: play PA5_VARIANTS pa5-18-complete-hunt instead of pa5-18-complete (the after-credits field: her power gone, they ride out to mend; lifted quote 2 at #6, with childLines). LOOK: pa5-18-after = look marks the off-road memory sites (as pa5-memories = all does); if all twelve are later seen, play pa5-15-impa-hunt then pa5-15-plain-hunt then pa5-18-complete-hunt once, from Impa’s house (one-time). The photo frame shows only the memories seen; the high-score plate counts towards High Score Night (any two of PA1–PA5). No Grove flag is written. Pixel’s "tiny lady" is Impa.

## Variant scenes

#### Variant `pa5-01-shed-clank`

_The lantern shed smells of sawdust and solder. The cabinet hums in the corner, and Clank is sitting on top of it._  
**Clank** _(happy)_: Announcement! I am on the cabinet! It is warm! It is my best friend!  
**Pixel**: He’s been up there since breakfast. He says it’s a lookout. It’s not a lookout. It’s a radiator.  
_She holds up a cartridge. The label is faded to the colour of weak tea, except for one blue eye._  
**Pixel**: Found it under the mouse nest. You go in. I stay out here as player two and talk through the speaker.  
**Clank** _(happy)_: And I am player three! I will announce things!  
**Pixel**: There is no player three. Fine. Player three. Announce quietly.  
_Your Nubbin climbs on to the stool and stares into the dark screen, nose almost on the glass._  

**Choices**

- **Blow on the cartridge first.**
    - **Pixel**: That does nothing. Everybody does it anyway.
    - **Clank**: Announcement: I have also blown on it!
- **Just put it in.**
    - **Pixel**: A person of action. Player one, ready.

#### Variant `pa5-mem-ceremony`

_A memory, at the old shrine in the meadow. Zelda, sixteen, stands before Link as he kneels in his blue tunic._  
**Zelda** _(sad)_: I name you my knight. The sword chose you. I didn’t. Please understand that.  
_Behind her, four Champions stand in a row, very straight. Daruk is trying not to grin, and failing._  
_The memory goes. Your Nubbin is kneeling on the grass too, very solemnly, with its crown bowed._  

#### Variant `pa5-mem-resentment`

_A memory, on a bridge over a gorge. Zelda turns round sharply on Link, a few steps behind her._  
**Zelda** _(angry)_: Stop following me. I know you’re ordered to. I don’t need a reminder of everything I can’t do.  
_He stops, but he doesn’t go away. She walks on, and after a while, he follows at the same distance._  
**Pixel**: Oof. She didn’t like him at first. That makes the rest better, somehow.  

#### Variant `pa5-mem-silent-princess`

_A memory, in a field of small blue flowers. Zelda is on her knees with a notebook, very happy._  
**Zelda** _(happy)_: They only grow wild. Nobody can grow them in a garden. Isn’t that wonderful? They choose where they live.  
_She looks up at Link, and for a moment forgets to be cross with him._  
_The memory goes. Your Nubbin is sitting in the same field, among the same flowers, a hundred years later._  

#### Variant `pa5-mem-revali`

_A memory, on the Rito landing. Revali, alive, hovers above Link on a gust of his own making._  
**Revali**: So you’re the chosen knight. I’m sure the sword knows best. I’m sure it’s not just luck.  
_He shoots up out of sight. Link doesn’t rise to it; he nods to the empty air where Revali was._  
**Pixel**: He’s so rude. He’s brilliant. Both. That’s allowed.  

#### Variant `pa5-mem-daruk`

_A memory, on the crater edge. Daruk, alive, claps Link on the back so hard Link nearly goes over._  
**Daruk** _(happy)_: Little guy, you’re all right! Come back up and we’ll eat rocks. The good ones. Not the gravel.  
_The memory goes. Your Nubbin is standing on the crater edge, looking at a rock, as if it might be a good one._  

#### Variant `pa5-mem-urbosa`

_A memory, in the desert. Urbosa, alive, is laughing with Zelda, who is laughing so hard she has to sit down._  
**Urbosa** _(happy)_: And then your father fell straight into the fountain. In the crown. In front of everyone.  
**Zelda** _(happy)_: Don’t. Don’t. I can’t breathe.  
_Link stands guard behind them, very straight. One corner of his mouth is trying to move._  

#### Variant `pa5-mem-spring`

_A memory, at a cold spring high in the mountains. Zelda is standing in water up to her waist, praying._  
_Her lips are blue, and nothing comes. Link waits on the bank with a blanket, because there is nothing else to do._  
**Zelda** _(sad)_: Nothing. Again.  
_He holds the blanket out. After a long moment, she takes it._  

#### Variant `pa5-mem-frog`

_A memory, by a pond. Zelda is holding out a frog to Link in both hands, very pleased._  
**Zelda** _(happy)_: Hot-footed frog. They say eating one makes you quicker. Science! Well. Possibly science. Try it.  
_Link looks at the frog, and the frog looks at Link. The memory, mercifully, ends._  
_Your Nubbin sits by the same pond, a hundred years later, and looks at a frog with deep suspicion._  

#### Variant `pa5-14-complete-ate`

_The memory ends. Link stands by the dry fountain, very still._  
_You remember a cabin on a cold mountain, a stone pot, and an old man who didn’t say his daughter’s name._  
_He said he was hard on her. He said he only ever told her to try harder._  

**Choices**

- **Tell Link the old man is sorry now.** — sets `{"pa5-14-told":"told"}`
    - **You**: He’s sorry. Her father. He told me, on the mountain. He’d have told her, if he could.
    - Link turns and looks at the castle for a long time. The red-black cloud turns over it, slow.
    - Then he nods, once, as if he has been given something to carry to someone.
    - **Pixel**: That’s a message now. He’s got a message to deliver. Ruling: that’s the most important thing in his bag.
- **Keep it for her, if you ever meet her.** — sets `{"pa5-14-told":"kept"}`
    - You keep it, in your coat with the photographs. Your Nubbin puts its blue flower on the fountain edge.
    - **Pixel**: Some things you say to the person themselves. Good call.

#### Variant `pa5-15-impa-hunt`

_Back in Kakariko, you lay all twelve photographs out on Impa’s floor. Every one has a blue tick in its corner._  
**Impa**: All twelve. You went up the mountains and down the holes. You took the slow way.  
**Impa**: Then you’ve earned the last one. I never gave it out. I hung it on my wall instead.  
_She takes down a thirteenth photograph from beside the shrine in her house. A wide plain, and old machines._  
**Impa**: Blatchery Plain. You walked across it in your sleep, I think. Go and stand there with him.  
**Pixel** _(soft)_: There’s a thirteenth. Of course there’s a thirteenth. I knew it. I’d have hung it on my wall too.  

**Choices**

- **We’ll go now.**
    - **Impa**: Go gently. It’s the hardest one. It’s the one that matters.
- **What happened there?**
    - **Impa**: He should remember it himself. You should be there when he does.

#### Variant `pa5-15-plain-hunt`

_You stand with Link where the thirteenth photograph was taken. The slate chirps, and it is a hundred years ago._  
_The plain is full of rain and running machines. Link is with Zelda, and he is so tired he can barely stand._  
_He goes down on one knee in the mud. A machine turns its eye on him._  
_Zelda throws herself in front of him with her hand up, and the power that never came, comes._  
_Gold light pours from her hand over the whole plain. Every machine stops, all at once, and stays stopped._  
**Zelda** _(shock)_: Oh. Oh, there it is. Now. Of course it was now.  
**Zelda** _(soft)_: Sleep. Heal. They’ll keep you safe. I’ll hold it till you come back. However long that is.  
_She walks away towards the castle, alone, as you’ve seen her walk away before. This time you know where she’s going._  

#### Variant `pa5-15-complete-hunt`

_The memory goes. Link is kneeling in the grass where he knelt then, and your Nubbin is kneeling beside him._  
_He stands, and looks at the castle, and this time he looks at it the way you look at a house where someone is waiting._  
**Pixel** _(soft)_: Thirteen. She held a castle shut for a hundred years because of a promise on this field. Let’s go and get her.  

Sets `{"pa5-thirteenth":true}`

#### Variant `pa5-17-horse-done-clank`

_The beast’s eyes go dark, one and then the other. It sags into the field like a tent coming down._  
**Pixel** _(happy)_: That’s the whole stadium on its feet. In a shed. Me and a robot. Standing on a stool.  
**Clank** _(happy)_: ANNOUNCEMENT! WE HAVE WON! Announcement: I have fallen off the cabinet!  

#### Variant `pa5-18-complete-hunt`

_The credits roll over the field, the castle and the sky. Then, after the credits, there is a little more._  
_A field outside the castle, in spring. Zelda and Link are there in plain clothes, with two horses._  
**Zelda**: I can’t feel it any more. The power. It went when the Calamity went. The Beasts have gone quiet too.  
_She doesn’t sound sad about it. She sounds like someone who has put down something very heavy._  
**Zelda**: I spent my whole life trying to wake it. And now it’s gone, and I’m still here.  
**Zelda** _(happy)_: I’ll have to be useful with machines instead. Father would hate that.  
**Zelda** _(soft)_: I think I can accept that.  
_They get on their horses and ride out across the field, to start mending. Your Nubbin trots behind them._  
_The shed comes back around you: sawdust, the heater, Pixel on her stool, very quiet._  
**Pixel** _(soft)_: Every memory. That’s what it was for. That’s the whole ending. I’m not crying. The heater’s too high.  
