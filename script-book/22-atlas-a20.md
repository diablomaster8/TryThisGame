# Atlas, page A20: The Weeping

## A20-1. The Bright One

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XXII: Baldr and Breidablik* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design), Baldr (Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design)

### Step 1: Step into the grey-and-gold page and find Frigg’s hall.

Hint: Touch the page, then go in at the door where the spindle is turning. · check: `explore:a20-fensalir:door`

#### Scene `a20-01-page`

_Nova’s atlas falls open at a page washed in grey and gold: a bright hall, a hall of mists, and a long white plain._  
_Across the top, in plain letters: a story from the Prose Edda, written down in Iceland about eight hundred years ago._  
_Snorri Sturluson wrote it down. He was a Christian, setting out the old stories of his people’s gods._  
_His book is one telling, not scripture. These gods are still honoured today, by people whose faith is called Heathenry._  
_The page goes cool and soft under your hand, like linen off the line. Then it is swept boards, and you are standing on them._  
_A long hall, full of the small sound of a spindle. A woman sits by the fire with her work in her lap, and looks up._  
**Frigg**: A guest. Come in out of the draught. This is Fensalir, and I am Frigg.  
**Frigg** _(soft)_: There are more errands in this house than there are hands. Will you run some of them, while you stay?  
**Fulla**: And the small one? Does it carry things?  
_Your Nubbin holds up both arms, to show it will carry anything at all._  

**Choices**

- **Bow, as you would to someone old and kind.**
    - Frigg inclines her head to you, exactly as low as you bowed to her.
    - **Frigg**: Guests and hosts bow the same distance in this house. It saves a great deal of arguing.
- **Say your name, plainly.**
    - **Frigg**: A good name. I’ll remember it.
    - She says it back to you once, and you have the odd feeling it has been written down somewhere.
- **Ask what needs carrying first.**
    - **Fulla**: Oh, I like this one.

#### Done `a20-01-page-done`

**Frigg**: Then the first errand is the easiest. Take this cloak up the hill to my son. He gives his away to anyone who looks cold.  
**Fulla**: Breidablik. The hall on the rise. You can’t miss it. Nobody ever has.  

### Step 2: Carry Frigg’s cloak up to Breidablik, Baldr’s hall.

Hint: Follow the path up the rise to the pale hall; you will see it long before you reach it. · check: `deliver:a20-cloak:breidablik`

#### Scene `a20-01-hall`

_Breidablik stands on a rise above everything. Its roof is so pale it is hard to say where it stops and the sky begins._  
_Fulla said nothing unclean can be in this hall. You wipe your feet twice, and your Nubbin wipes both of its._  
_Inside there is a long table, and a man at it, mending a strap. He looks up._  
_He is so fair of feature, and so bright, that light shines from him._  
**Baldr** _(happy)_: You’ve come from my mother. I know her cloak. She thinks I’m always cold.  
**Baldr**: I’m never cold. Put it on the bench, and sit. Everyone who climbs this far ought to sit.  
_The light off him is like sun off snow in the morning: everywhere at once, and easy on the eyes._  
_Your Nubbin sits down in it, and blinks, and slowly tips over sideways._  
**Baldr** _(soft)_: Ah. It does that to the small ones. Leave it be. It will wake when it’s ready.  

#### Done `a20-01-hall-done`

_Your Nubbin is asleep on the warm boards, in the brightest part of the floor, with one arm over its face._  
**Baldr**: Stay till it wakes. I’d like the company.  

### Step 3: Sit with Baldr while your Nubbin sleeps.

Hint: Take the bench by the long table; there is no hurry in this hall. · check: `sit:a20-baldr:breidablik`

#### Scene `a20-01-sit`

_You sit on the bench. Baldr goes back to his strap, and for a while there is no sound but the needle going through leather._  
**Baldr**: My mother says you’re running her errands. That’s kind. She has more of them than usual this year.  
**Baldr**: Everyone climbs up here in the end with a question. Mostly it’s which of two people is right.  
**Baldr** _(happy)_: I tell them as kindly as I can. It’s the part of the day I like best.  
_He looks over at your Nubbin, which is snoring very slightly in the light._  
**Baldr**: Ask me something, then. You’ve climbed as far as anyone.  

**Choices**

- **Ask him why he is so bright.**
    - **Baldr**: I don’t know. I’ve never been anything else. I’d like to see the dark properly one day, just to know.
- **Ask him if he has brothers.**
    - **Baldr**: Hödr. He’s blind, and stronger than any of us, and he laughs at my jokes before I finish them.
    - **Baldr**: You’ll meet him. He’s always just outside where the noise is, listening.
- **Don’t ask anything. Just sit.**
    - So you sit. After a while Baldr puts the strap down and sits too, doing nothing, as if he never gets the chance.
    - **Baldr**: That was a good question.

#### Complete `a20-01-complete`

_Your Nubbin wakes when the light moves across the floor. It gets up and moves after it._  
**Baldr** _(soft)_: It’ll follow me about now. The small ones do. I don’t know what they think they’ll find.  
_He folds his mother’s cloak and lays it on the end of the bench, where he will see it every time he passes._  
**Baldr** _(happy)_: Tell her I’ll wear it. She’ll know I mean it kindly.  
_Going down the hill, your Nubbin stops every few steps to look back at the pale hall._  

**Rewards**


Sets on completion: `{"a20-01":true}`

**Learning Grove swaps**

- `a20-01-hall#3` → He is so kind and so glad that he seems to shine, and the whole room is lighter for him.

**Notes:** OPENING: the page is a grey-and-gold wash (a bright hall, a hall of mists, a long white plain) and colours in as you step through. a20-01-page#1–3 are the page’s INTRO CARD, required by the care notes: show them as a plain card over the page before the step-through (no runes, no knotwork, plain lettering). LIFTED TEXT: a20-01-hall#3 (Brodeur ch. XXII), voiced as narration. ART: Baldr is a man, not a superhero; his light is soft and morning-coloured, never a glow effect with rays. Breidablik is pale timber, not gold. Frigg’s spindle is a plain drop spindle. CINDER (cinder set, S19): play ATLAS_A20_VARIANTS a20-01-ember after a20-01-page’s choice, before a20-01-page-done. From then on your Nubbin carries a little lantern with the red pebble in it on this page (Atlas save, a prop).

## A20-2. Bad Dreams

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Baldr’s dreams, and the gods take counsel* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-1, from Nova’s atlas. · requires: A20-1

**Cast:** Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design), Baldr (Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design), Thor (Thor (Snorri, Gylfaginning); original design, no superhero or film look), Odin (Odin, the Allfather (Snorri, Gylfaginning); original design), Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design)

### Step 1: Take lamp oil up to Breidablik, late at night.

Hint: Fulla has the oil jar at Fensalir’s door; carry it up the rise. · check: `carry:a20-oil:breidablik`

#### Scene `a20-02-oil`

_It is late. Fensalir’s fire is down to red, and Fulla is still up, holding a jar of lamp oil._  
**Fulla**: His lamp’s been burning three nights running. He doesn’t sleep. Take this up to him? Mind the step.  
_Breidablik is never dark, but tonight the lamp is lit as well, as if he wanted more light than his own._  
_Baldr sits at the long table with his hands round a cup that has gone cold._  
**Baldr** _(soft)_: Oh. It’s you. Come in. I’m glad it’s you, and not somebody who’d ask how I am.  
**Baldr** _(sad)_: I’ve been dreaming. The same road every night, going down. And at the bottom of it, somebody saying my name.  
**Baldr** _(sad)_: Not unkindly. Quietly. As if they were setting a place for me.  
_Your Nubbin climbs onto the bench beside him and sits as close to his light as it can get._  

**Choices**

- **Tell him dreams are only dreams.**
    - **Baldr**: That’s what I keep telling myself. I’m not as good at believing me as I used to be.
- **Say he should tell the others.**
    - **Baldr**: Yes. You’re right. I hate to worry them. But it’s worse, keeping it up here alone.
- **Sit, and wait for him to say more.**
    - You sit, and he doesn’t say more. After a while he puts his hand on your Nubbin’s head, and leaves it there.

#### Done `a20-02-oil-done`

**Baldr**: In the morning I’ll tell them. All of them. Will you walk down with me?  
_He sleeps a little after that, with the lamp still lit. Your Nubbin sleeps in his light, and you keep watch._  

### Step 2: Walk down with Baldr while he tells the gods his dreams.

Hint: Go with Baldr to the great hall where the gods meet, and stay by the door. · check: `escort:a20-baldr:gladsheim`

#### Scene `a20-02-telling`

_In the morning the gods are gathered in their great hall. They stop talking when Baldr comes in, because he never looks like this._  
_He tells them plainly: the road, the going down, his name said quietly at the bottom of it._  
_Odin listens with his one eye on his son and says nothing at all. Thor’s hands close and open on his knees._  
**Thor**: A dream. Dreams are smoke. Show me the thing that means him harm, and I’ll deal with it.  
**Odin** _(think)_: Not every harm stands where you can reach it.  
**Frigg**: Then we will go where it stands. Whatever it is.  
_They begin to take counsel together, slowly, the way old friends do when a matter is serious._  
_Fulla finds you a stool by the door. Your Nubbin keeps edging along the floor towards Baldr’s light._  

#### Done `a20-02-telling-done`

_The talk goes on through the morning and into the dark. You fetch, and carry, and listen._  

### Step 3: Keep the hall going through the long council.

Hint: Keep the fire fed and the cups filled until the gods have decided. · check: `wait:a20-council:gladsheim`

#### Scene `a20-02-council`

_The hall gets dark and the fire gets low. Nobody has noticed but you._  
**Thor**: We could ward him. Stand round him day and night.  
**Odin** _(sad)_: And he would live in a ring of spears. That is no life for him.  
**Baldr** _(soft)_: I’d rather not, if it’s all the same. I’d miss people.  
_Frigg has said nothing for a long time. She is turning something over, the way she turns her spindle._  
**Frigg** _(think)_: Then I will ask. Everything in the world, one by one. I will ask each of them to promise not to harm him.  
**Thor**: Everything? There’s a great deal of everything.  
**Frigg**: Then I had better start early.  

**Choices**

- **Build the fire up again.**
    - You build the fire up. Odin watches you do it, and nods, once, as if that were a kind of counsel too.
- **Fill the cups.**
    - You fill the cups, and Thor takes his with a nod. His hands are steadier for having something to hold.
- **Sit by the door and listen.**
    - You sit by the door and listen. It is the kind of night somebody should remember all of, start to finish.

#### Complete `a20-02-complete`

_By dawn it is settled. The gods go out of the hall into a cold, clear morning._  
**Frigg** _(soft)_: Tomorrow we walk. You, and I, and Fulla. We will ask the whole world.  
**Baldr**: Mother. You don’t have to.  
**Frigg**: I know.  
_Your Nubbin falls asleep on the way home, and you carry it. It is facing back up the hill._  

**Rewards**


Sets on completion: `{"a20-02":true}`

**Notes:** Snorri gives the dreams in one line (“great and perilous dreams touching his life”); Baldr’s road and the quiet voice are our own, kept unfrightening. The great hall is Gladsheim in the check id only; the text just says “their great hall”. Odin is shown with one eye, simply, with no wound and no eyepatch joke. No council-table comedy.

## A20-3. The Oaths

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Frigg takes oaths of all things* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-2, from Nova’s atlas. · requires: A20-2

**Cast:** Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design)

### Step 1: Walk with Frigg while she asks the fire, the water, the iron and the stones.

Hint: Keep a step behind Frigg; she stops at each thing she asks. · check: `watch:a20-oaths:frigg`

#### Scene `a20-03-asking`

_Frigg walks out at first light with no escort, only Fulla and you, and your Nubbin trotting to keep up._  
_She stops at the hearth first, and kneels, and asks the fire. The flames lie down low along the logs, all at once._  
**Frigg**: That is yes. Fire never says much.  
_At the spring she asks the water, and it goes still as glass. At the smithy she asks the iron, and every blade on the wall rings._  
_She asks every metal by name, and the earth, and the stones. The stones say nothing, which for a stone is a promise._  
_She asks the trees, every kind, a whole wood of them. They bend their tops to her as if a wind went over._  
**Fulla** _(soft)_: She asks the sicknesses herself, at night. They take the longest. They always want to argue.  
**Frigg**: Everything can be asked. It only takes time, and remembering not to leave anything out.  
_West of Valhall you pass an old oak. On one of its branches is a sprig so small and new it has only two leaves._  
_Your Nubbin stops and looks at it. Frigg is already walking on._  

#### Done `a20-03-asking-done`

**Frigg**: The beasts and the birds now. My feet are older than my asking. Will you carry it for me?  

### Step 2: Carry Frigg’s asking to the beasts and the birds.

Hint: Go out over the meadows and along the wood edge; anything that runs, flies or creeps should be asked. · check: `deliver:a20-asking:beasts`

#### Scene `a20-03-beasts`

_You go out over the meadows with Frigg’s asking. It sits in your mouth like a smooth stone, and you say it the way she said it._  
_The hare listens with both ears and thumps the ground, once. The bear lies down flat, which takes some time._  
_A reindeer lowers her antlers until they touch the grass. A fox looks away, then back, then sits._  
_The birds you ask all together, from the top of a hill. They go up in one great turning cloud and come down again._  
_The ravens come last. They hear you out, and nod, and fly off towards Valhall to tell somebody._  
_Snakes and poisons Frigg asks herself. Some askings, she says, are not for guests._  
**Fulla** _(think)_: That’s everything with legs and wings. Everything with neither, too. Is that all?  
_Your Nubbin is tugging at your sleeve. Nobody has asked it._  

### Step 3: Let your Nubbin make its own promise.

Hint: Bring your Nubbin to Frigg on Fensalir’s step. · check: `talk:a20-frigg:promise`

#### Scene `a20-03-promise`

_Frigg is sitting on Fensalir’s step, tired, with her hands open in her lap. Your Nubbin walks straight up to her._  
_It stands in front of her with its feet together and its arms at its sides, as straight as it can stand._  
**Fulla** _(soft)_: Oh. It wants to be asked.  
**Frigg**: Of course it does. Everything should be. Come here, little one.  
**Frigg**: Will you promise not to harm my son? Not ever, not by anything you do?  
_Your Nubbin thinks about this for a long time, very seriously._  

**Choices**

- **Let it put its paw in Frigg’s hand.**
    - It puts its paw in her hand, flat, and holds it there until she closes her fingers round it.
    - **Frigg**: That will hold.
- **Let it bow, the way the hare did.**
    - It bows so low it nearly topples. Then, to be sure, it thumps the step with one foot, like the hare.
    - **Frigg**: Twice promised. I’ll count it twice.
- **Promise for it.**
    - **Frigg**: No. Let it promise for itself. A promise carried by somebody else is only an errand.
    - Your Nubbin nods at her, hard, three times. Frigg nods back three times.

#### Complete `a20-03-complete`

_By evening it is done: fire and water, iron and every metal, stones, earth and trees, sickness, beasts, birds, poison and snakes._  
**Frigg** _(soft)_: Everything has promised. Everything I could think of.  
_She has been spinning as she walked, a twist of thread for every promise. Now the spindle is full, and she cuts the thread._  
**Frigg**: Keep the spindle. It has done its work. I’d like it to live somewhere far away, where nothing has ever been afraid.  
_Your Nubbin is already asleep on the step, facing up the hill towards the pale hall._  

**Rewards**

- Frigg’s Spindle (decor): A plain wooden drop spindle from Fensalir, empty, its thread all spent on promises. A decoration for the cottage.

Sets on completion: `{"a20-03":true}`

**Notes:** Snorri’s list (fire, water, iron and every metal, stones, earth, trees, sicknesses, beasts, birds, poison, snakes) is given in full in a20-03-complete#0. Each thing promises “in its own way”: nobody but Frigg and Fulla speaks; the beasts and birds are never voiced. a20-03-asking#8–9 is the only sight of the mistletoe before A20-5: a sprig with two leaves on an oak west of Valhall (it grows on the oak, as mistletoe does; draw it plainly, no berries-and-ribbon Christmas look). Frigg’s spinning a thread per promise is our invention, kept small. The spindle is decor, one-time.

## A20-4. The Game

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: the gods make sport of Baldr at the Thing* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-3, from Nova’s atlas. · requires: A20-3

**Cast:** Baldr (Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design), Thor (Thor (Snorri, Gylfaginning); original design, no superhero or film look), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design), Hödr (Hödr, Baldr’s blind brother (Snorri, Gylfaginning ch. XXVIII and XLIX); original design)

### Step 1: Go with the gods to the Thing-field.

Hint: Follow the crowd out to the gods’ meeting-place and its ring of stones. · check: `walk:a20-thing:field`

#### Scene `a20-04-field`

_The Thing-field is the gods’ meeting-place, a wide green with a ring of standing stones. Today it is full of laughing._  
_Baldr stands in the middle of the ring. The gods stand round him, and they throw things at him._  
_A stone bounces off his shoulder and lands softly in the grass. An arrow turns aside as if it had changed its mind._  
_Nothing hurts him, because everything has promised. The game is a way of honouring him, and everyone wants a turn._  
**Thor** _(happy)_: Your turn again, brother! Stand still. This one’s heavy.  
**Baldr** _(happy)_: I’m always standing still! It’s the one thing I’m good at today!  
_Thor throws a stone the size of a loaf. It stops a hand’s width from Baldr, seems to think about it, and drops._  
_Everyone laughs, and Baldr laughs most of all, with his head back._  

#### Done `a20-04-field-done`

_Your Nubbin has found the edge of Baldr’s light, at the very edge of the ring. It lies down in it like a cat in a sunbeam._  

### Step 2: Join the game, or watch it from the edge.

Hint: Thor will offer you something to throw; you don’t have to take it. · check: `choose:a20-game:ring`

#### Scene `a20-04-turn`

**Thor**: Guest! A guest’s throw is good luck. Here.  
_He holds out a pebble from the field, smooth and grey, small enough for a child to throw._  
**Baldr** _(happy)_: Go on. It only tickles. Everything tickles now. I’ve never laughed so much in my life.  
_Outside the ring, a little apart, a tall man is standing with his hands empty. Baldr waves to him whenever something bounces._  
_The tall man can’t see him wave. But he smiles each time the laughing comes, as if he can._  
**Fulla** _(soft)_: That’s Hödr, Baldr’s brother. He can’t see to throw, so he stands out there.  

**Choices**

- **Throw the pebble, gently, underarm.**
    - Your pebble bumps off Baldr’s knee and rolls back to your feet. He bows to it, deeply, and everyone cheers.
- **Give the pebble back. Watch from the edge.**
    - **Thor**: Fair enough. Somebody ought to keep the score.
    - You go and stand at the edge of the ring, where the laughing is quieter.
- **Let your Nubbin have the throw.**
    - Your Nubbin rolls the pebble along the grass. It stops at Baldr’s feet, and he picks it up and hands it back.
    - **Baldr**: A draw.

### Step 3: Find Hödr outside the ring, and tell him what is happening.

Hint: Walk round the outside of the stones to the tall man standing apart. · check: `talk:a20-hodr:ring-edge`

#### Scene `a20-04-hodr`

_You walk round the outside of the stones to where Hödr stands. He turns his head before you reach him._  
**Hödr** _(happy)_: You’re the guest. Frigg’s errand-runner. You walk like someone who’s been carrying things.  
**Hödr**: Tell me what they’re doing. I can hear them laughing. I like to know what at.  
_So you tell him: Thor’s loaf of a stone, the arrow that changed its mind, your Nubbin asleep at the edge of the ring._  
**Hödr** _(happy)_: The arrow! I wish I’d seen that.  
**Hödr** _(soft)_: I’d throw something myself, if I could see where he was. But it isn’t a game you play blind.  
_He says it lightly. He has said it to himself a good many times before._  

#### Done `a20-04-hodr-done`

**Hödr** _(happy)_: Come and tell me the next good one. You tell it better than they do. They just laugh and expect me to know.  

#### Complete `a20-04-complete`

_The game goes on till the light goes. Nobody is hurt; nobody can be._  
_Baldr comes out of the ring with grass in his hair and puts an arm round his brother’s shoulders._  
**Baldr** _(happy)_: Did you hear about the arrow? It went round me like a dog round a puddle.  
**Hödr**: I heard everything. The guest told me the rest.  
_Your Nubbin follows them home, walking in Baldr’s light and holding on to Hödr’s bootlace._  

**Rewards**


Sets on completion: `{"a20-04":true}`

**Notes:** The game honours Baldr (Snorri: “it seemed to all a great honour”). Keep it joyful and never cruel: the things thrown stop, turn aside or drop; nothing strikes and bounces painfully. The Thing-field is a green with a ring of plain standing stones (no carvings). Hödr is introduced here so that A20-6 lands: he always stands outside the ring. The choice has no flag; every option ends at the edge with Hödr.

## A20-5. The Old Woman

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: the old woman at Fensalir* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-4, from Nova’s atlas. · requires: A20-4

**Cast:** Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design), Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design), The Old Woman (The old woman who visits Frigg in Fensalir (Loki in disguise, Gylfaginning ch. XLIX))

### Step 1: Fetch water for Fensalir.

Hint: Take the pails down to the spring and carry them back up. · check: `carry:a20-water:fensalir`

#### Scene `a20-05-water`

_Fensalir needs water, and the spring is down the slope. You take two pails, and your Nubbin takes a thimble._  
_When you come back up the path, there is an old woman at the door, leaning on a stick._  
_She is wrapped in so many shawls that you can see nothing of her but her hands, which do not look old at all._  
**Fulla**: A traveller. Frigg never turns one away. Bring the water in. She’ll want to give her a cup.  
_The old woman looks at your Nubbin. Your Nubbin looks back, and then it goes and stands behind your legs._  
_It has never done that before, with anyone._  

### Step 2: Sit by Fensalir’s hearth while Frigg talks with the traveller.

Hint: Wind the wool by the fire, and stay in the room. · check: `wait:a20-fensalir:hearth`

#### Scene `a20-05-talk`

_Frigg gives the old woman the best seat and a cup of the new water. You sit by the hearth with a skein of wool to wind._  
**The Old Woman**: I came by the Thing-field. Such a noise. What are the gods doing there, lady?  
**Frigg** _(happy)_: Making sport. They throw at my son, and nothing harms him. Everything in the world has promised.  
**The Old Woman** _(think)_: Everything? Every single thing?  
**Frigg**: Every thing but one.  
**Frigg**: There grows a tree-sprout alone westward of Valhall: it is called Mistletoe; I thought it too young to ask the oath of.  
_The old woman puts her cup down very carefully, as if it had become important not to spill it._  
**The Old Woman**: Too young. Yes. Very wise.  

**Choices**

- **Keep winding the wool.**
    - You keep winding, round and round your hands, and you don’t look up. Later you will wish you had.
- **Look up at the old woman.**
    - You look up. Under the shawls, for a moment, someone is smiling, and then it is only shawls.
- **Pick up your Nubbin.**
    - You pick up your Nubbin. It is trembling very slightly all over, like a cup of water on a table someone has bumped.

#### Done `a20-05-talk-done`

_The old woman thanks Frigg, and gets up, and goes out of the door._  
_You go to the doorway a moment after, and the path runs empty both ways. You didn’t see which way she went._  

#### Complete `a20-05-complete`

**Frigg** _(think)_: An odd guest. Kind enough. She asked a great many questions for someone so tired.  
**Fulla**: I’ll bolt the door tonight.  
**Frigg** _(soft)_: Whatever for? Nothing can hurt him.  
_She goes back to her work. Your Nubbin sits by the door all evening, facing west._  

**Rewards**


Sets on completion: `{"a20-05":true}`

**Learning Grove swaps**

- `a20-05-talk#5` → There is one little green sprout, growing on an oak to the west. It was so new that I didn’t ask it.

**Notes:** LIFTED TEXT: a20-05-talk#5 is Frigg’s answer, verbatim (Brodeur ch. XLIX). The old woman is Loki in disguise in Snorri, but the page never says so: we hear it, and we don’t see which way she goes (the outline’s beat). Her hands (a20-05-water#2) and the smile (choice look) are the only hints. ART: a bundle of shawls and a stick; never a face. Your Nubbin hides behind you from her, the only time it does so on the page.

## A20-6. Hödr

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: the death of Baldr* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-5, from Nova’s atlas. The soft content line (a20-06-field#0) plays first, as a card. · requires: A20-5

**Cast:** Hödr (Hödr, Baldr’s blind brother (Snorri, Gylfaginning ch. XXVIII and XLIX); original design), A Voice (The one who guides Hödr’s arm (Loki, Gylfaginning ch. XLIX); never shown), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design)

### Step 1: Go back to the Thing-field for the game.

Hint: Walk out to the ring of stones; Hödr will be standing apart again. · check: `walk:a20-thing:return`

#### Scene `a20-06-field`

_A quiet word before this part: Baldr dies in it. It is told gently, and no hurt is shown._  
_The next day the game is on again. The Thing-field is full of the gods, and the ring is full of laughing._  
_Hödr stands outside the ring where he always stands, with his hands empty._  
_Somebody comes up beside him. You can’t see a face, only a cloak, and a hand holding something green._  
**A Voice**: Why aren’t you throwing? Everyone honours your brother but you.  
**Hödr**: I can’t see where he is. And I’ve nothing to throw.  
**A Voice**: Then here’s something. A little sprig. I’ll guide your arm. Do as the others do.  
_The sprig is put in his hand: two leaves. You know it, and your Nubbin knows it, and starts to run._  
**Hödr** _(happy)_: Thank you. I’d like that. I’d like to be in the game, just once.  

### Step 2: Run for the ring.

Hint: There is no reaching it in time. Go anyway. · check: `watch:a20-baldr:fall`

#### Scene `a20-06-fall`

_The hand on Hödr’s arm turns him a little, and lifts it. You are running, and the field is very wide._  
_Hödr throws. The sprig goes through the air with nothing to stop it, because nobody asked it to stop._  
_Baldr falls._  
_He falls the way a tall thing falls when it is not ready: all at once, and then still. There is no wound to see._  
_Nobody laughs. The field is so quiet you can hear the grass._  
_But when the Æsir tried to speak, then it befell first that weeping broke out, so that none might speak to the others with words concerning his grief._  
_The cloak at Hödr’s elbow is gone. Nobody saw it go._  
_Your Nubbin doesn’t go to Baldr. It goes past the ring and the weeping gods, straight to Hödr, and sits down by his feet._  

### Step 3: Sit with Hödr.

Hint: Stay beside him outside the ring. Don’t leave him alone in it. · check: `sit:a20-hodr:ring-edge`

#### Scene `a20-06-hodr`

**Hödr** _(shock)_: What happened? Why has it gone quiet?  
**Hödr** _(shock)_: Somebody tell me. Why has everybody stopped?  
_Nobody answers him; the gods are weeping, and cannot speak. Your Nubbin leans against his shins._  
**Hödr** _(sad)_: You’re there. The guest. Tell me. You always tell it right.  
_You are the one who has to tell him. There is no way of telling it that is right._  
_So you tell him plainly, and he doesn’t move. Then his hand opens, and lets go of nothing._  
**Hödr** _(sad)_: I only wanted to be in the game.  

**Choices**

- **Sit down next to him, and stay.**
    - You sit down in the grass beside him. After a long time he sits down too, all at once, as if his legs decided.
- **Take his hand.**
    - You take his hand, the hand that threw. He holds on to yours as if the field were tipping.
- **Tell him somebody guided his arm.**
    - **Hödr**: I know. I felt it. It doesn’t help yet. It might one day. Stay anyway.

#### Complete `a20-06-complete`

_No one may take vengeance on the Thing-field. It is a place of peace, so holy that no hand can be raised there._  
_So the gods stand and weep. Odin weeps hardest, because he understands best how much has been lost._  
_Hödr sits in the grass outside the ring. Nobody comes to him but you, and your Nubbin, which has not moved from his feet._  
**Fulla** _(sad)_: Bring him to Fensalir. Frigg says so. Nobody should sit out here alone tonight.  

**Rewards**


Sets on completion: `{"a20-06":true}`

**Learning Grove swaps**

- `a20-06-fall#5` → The gods try to speak to each other, but they are crying too hard, and nobody can find any words.

**Notes:** CONTENT LINE (care notes): a20-06-field#0 is a soft content card before the scene, not dialogue. Keep it on screen until tapped. THE FALL: a20-06-fall#2 is one beat on its own; hold it. No wound, no blood, no arrow-through; the camera stays wide and low on the grass. Baldr is not seen after the fall in this quest. The voice at Hödr’s elbow is Loki in Snorri; it is a cloak and a hand only, never a face, and it is not named until A20-13. LIFTED TEXT: a20-06-fall#5 (Brodeur ch. XLIX), narration. Your Nubbin goes to Hödr, not Baldr: the outline’s turn. Snorri’s “place of peace” beat is told in our words (a20-06-complete#0). Hödr is never blamed by the page.

## A20-7. Who Will Ride

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Hermódr rides for Baldr* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-6, from Nova’s atlas. · requires: A20-6

**Cast:** Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design), Hermódr (Hermódr the Bold, Odin’s son (Snorri, Gylfaginning ch. XLIX); original design), Odin (Odin, the Allfather (Snorri, Gylfaginning); original design), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design)

### Step 1: Be in Fensalir when Frigg speaks to the gods.

Hint: Bring Hödr to Fensalir and stay by the door. · check: `visit:a20-frigg:fensalir`

#### Scene `a20-07-asks`

_The gods come to Fensalir in the evening, and nobody sits. Hödr sits, because you brought him a stool._  
_Frigg stands by the cold hearth. She has stopped weeping, which is harder to look at._  
**Frigg** _(sad)_: Which of you will ride the road to Hel for me? Find my son, and offer her a ransom, and have all my thanks.  
_The hall is very quiet. Nobody has ridden the road to Hel and come back to tell it._  
**Hermódr**: I will.  
_It is Hermódr the Bold, Baldr’s brother, a quick, plain man who has never sat still in his life._  
**Hermódr**: I’ll ride. Tell me the way, and I’ll ride it.  
**Frigg** _(soft)_: Thank you.  

#### Done `a20-07-asks-done`

**Odin**: Take my horse. Nothing else could make that road.  

### Step 2: Bring Sleipnir from Odin’s stable.

Hint: The stable is behind the great hall; the grey horse is the one with too many legs. · check: `escort:a20-sleipnir:fensalir`

#### Scene `a20-07-sleipnir`

_Odin’s stable is long and warm and smells of hay. At the end of it stands a grey horse, taller than the door._  
_Sleipnir has eight legs. Your Nubbin counts them twice, then counts its own, and looks thoughtful._  
_He lets you take the halter without fuss. He has carried Odin over worse roads, and knows a serious errand._  
_You lead him out. All eight hooves go down on the cobbles in an order you can’t follow._  
**Hermódr**: Good lad. Good. We’ll go far, you and I.  
**Hermódr**: Guest. You’ve run Frigg’s errands all this while. Will you run this one?  
_He looks at the horse’s broad grey back, and then at you. There is room for two._  

### Step 3: Say goodbye to Frigg before the road.

Hint: Find Frigg at Fensalir’s door; Hermódr will wait. · check: `talk:a20-frigg:door`

#### Scene `a20-07-door`

_Frigg is at the door when you come back leading Sleipnir. She has bread for each of you, and a cloak._  
**Hermódr**: We’ll go after the ship. I’ll see my brother off first, and ride at first light.  
**Frigg** _(soft)_: Yes. He would want you there.  
_She turns to you, puts the cloak round your shoulders herself, and does up the fastening as if you were small._  
**Frigg**: You don’t have to go so far for my son. You came here as a guest.  
_Your Nubbin is already sitting on Sleipnir’s back, holding his mane in both arms. It has decided._  

**Choices**

- **“We’ll bring him home.”**
    - **Frigg**: Don’t promise me that. Promise me you’ll try. That one, I can hold you to.
- **“We’ll try.”**
    - **Frigg**: Thank you. That’s all I asked of the world. Trying.
- **Say nothing. Take her hand.**
    - You take her hand. She holds it a moment, then puts it on Sleipnir’s halter, and steps back.

#### Complete `a20-07-complete`

_That night you sleep in Fensalir’s hall. Hermódr doesn’t; you hear him outside, talking to the horse in a low voice._  
_Your Nubbin creeps out to the step and sits looking up at the pale hall on the rise. There is no light in it._  
_For the first time since it came here, it doesn’t know which way to face._  
**Fulla** _(soft)_: Come in, small one. Come in. It’s cold.  

**Rewards**


Sets on completion: `{"a20-07":true}`

**Notes:** ORDER CHANGE: in Snorri, Hermódr rides off at once and the funeral is told while he is away. Here he waits to see the ship off and rides at first light (a20-07-door#1), so that you can be at the shore in A20-8 and ride behind him in A20-9. Frigg’s ransom speech is in our own words. Sleipnir does not talk (Snorri gives him no speech). ART: eight legs drawn plainly and gracefully, a grey horse, nothing monstrous.

## A20-8. The Ship

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Baldr’s ship, Hringhorni* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-7, from Nova’s atlas. · requires: A20-7

**Cast:** Thor (Thor (Snorri, Gylfaginning); original design, no superhero or film look), Odin (Odin, the Allfather (Snorri, Gylfaginning); original design), Fulla (Fulla, Frigg’s handmaid (Snorri, Gylfaginning); original design), Hermódr (Hermódr the Bold, Odin’s son (Snorri, Gylfaginning ch. XLIX); original design)

### Step 1: Help the gods launch Baldr’s ship.

Hint: Put your shoulder to the hull with the others when Thor calls. · check: `carry:a20-rollers:shore`

#### Scene `a20-08-shore`

_Baldr’s ship is called Hringhorni. It is the greatest of all ships, and it lies on the shore on rollers, its prow to the sea._  
_The gods have carried Baldr down to it, and laid him on board, and covered him. You see nothing but the cloth._  
**Thor**: Now. All together. Push.  
_Everyone puts a shoulder to the hull. You find a place low down by a roller, and your Nubbin finds a place under your elbow._  
_The ship does not move, not a finger’s width. It is as if the shore will not let him go._  
**Thor**: Again!  
_Again, and nothing. The gods stand back, breathing hard, and look at one another._  
**Odin**: Send to Jötunheim. There is one there who could move it.  

### Step 2: Watch for the one who comes from Jötunheim.

Hint: Stand back from the hull and watch the road down from the mountains. · check: `watch:a20-hyrrokkin:shore`

#### Scene `a20-08-giantess`

_She comes down from the mountains riding a wolf, with snakes for reins. Her name is Hyrrokkin._  
_The wolf is grey as old ice. Four of the gods hold it when she gets down, and even they can hardly hold it still._  
_She walks to the prow of Hringhorni without a word to anyone, puts her hands on it, and pushes. Once._  
_The ship goes down the rollers with a roar. Sparks jump from the rollers, and the whole shore shakes._  
_Thor’s hand goes to his hammer. He is grieving, and grief looks for somewhere to go._  
**Odin**: No. She came to help. Let her be.  
_Thor takes his hand away. Hyrrokkin looks at him a long moment, and nods, and goes back the way she came._  

### Step 3: Lay something on the ship for Baldr, or stand back.

Hint: Wade out to the ship’s side, where Fulla will take what you bring. · check: `place:a20-gift:hringhorni`

#### Scene `a20-08-pyre`

_Baldr’s wife, Nanna, has stood on the shore all morning. When the ship moves, her heart breaks with grief, and she dies there._  
_They lay her on the ship beside him, gently, under the same cloth._  
_Thor stands at the ship’s side and raises his hammer over them, and hallows them both, so that they go well._  
_Odin lays a gold ring on the cloth. It is called Draupnir, and it is the best thing he owns._  
_The ship rocks a little in the shallows, waiting._  
**Fulla** _(soft)_: Everyone gives something. You don’t have to. But you can.  

**Choices**

- **Lay a pebble from the Thing-field.**
    - You lay a grey pebble from the game beside Draupnir. It looks small there, and exactly right.
- **Lay a twist of thread from Frigg’s spindle.**
    - You lay a twist of the thread on the cloth: one of the promises, going with him.
- **Lay nothing. Stand back with Hödr.**
    - You stand back on the stones beside Hödr, who can’t see the ship. You tell him, quietly, where everything is.

#### Complete `a20-08-complete`

_Then they light the pyre and push the ship out. You don’t watch the burning; you watch the light go._  
_Out on the water it is one bright thing, then a small bright thing, then a star sitting low on the sea._  
_Your Nubbin stands at the edge of the waves and watches it until it is gone. Then it keeps watching the place._  
**Hermódr** _(sad)_: First light.  
**Hermódr**: Eat something. Sleep if you can. We have a long way to go down.  

**Rewards**


Sets on completion: `{"a20-08":true}`

**Notes:** GENTLE AND GRAVE (care notes). Baldr and Nanna are always under the cloth; no flames are ever drawn on them. The pyre is lit off-screen; we see only the ship going out as a light on the water (a20-08-complete#0–1). Nanna’s death of grief is one line (a20-08-pyre#0). Snorri’s dwarf Litr, kicked into the fire, is cut. Hyrrokkin is a giantess, strong and dignified, not a joke; Thor’s anger is grief and is stopped by Odin with one line (Snorri has the gods ask for her peace). Thor hallows with his hammer: draw it as a plain short-hafted hammer, no film design. The choice has no flag. Hödr at the shore is our addition.

## A20-9. Nine Nights

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Hermódr’s ride and the Gjöll bridge* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-8, from Nova’s atlas. · requires: A20-8

**Cast:** Hermódr (Hermódr the Bold, Odin’s son (Snorri, Gylfaginning ch. XLIX); original design), Módgudr (Módgudr, keeper of the Gjöll bridge (Snorri, Gylfaginning ch. XLIX); original design)

### Step 1: Ride behind Hermódr down the road to Hel.

Hint: Hold on to Hermódr’s belt; Sleipnir knows the way. · check: `walk:a20-hel-road:dales`

#### Scene `a20-09-dales`

_Sleipnir goes down out of the morning into dales so deep and dark that the light can’t follow._  
_You ride behind Hermódr with your arms round his belt. Your Nubbin rides inside your cloak, with just its eyes out._  
_You ride for nine nights. There is nothing to see: not a star, not your own hand in front of your face._  
**Hermódr**: Still there, guest?  
**You**: Still here.  
**Hermódr**: Good. Keep saying so. I like to know.  
_All you can hear is eight hooves, and the cold, and Hermódr breathing._  

**Choices**

- **Count the nights aloud.**
    - You count them: one, two. By the sixth, Hermódr is counting with you.
- **Talk about Baldr.**
    - **Hermódr**: Yes. Tell me something he did. Anything. I don’t want to forget the sound of him.
    - You tell him about the strap Baldr was mending, and how he said everyone ought to sit. Hermódr laughs, once.
- **Keep quiet, and hold on.**
    - You say nothing. Every so often Hermódr puts one hand back over yours on his belt, to check.

### Step 2: Cross the gold-roofed bridge over the river Gjöll.

Hint: Ride up to the bridge and answer the woman who keeps it. · check: `visit:a20-gjoll:bridge`

#### Scene `a20-09-bridge`

_On the ninth night there is light ahead: a bridge over a loud river, roofed all over with gold that shines on its own._  
_The river is Gjöll. A woman stands at the near end of the bridge, tall and plain, with her hands folded._  
**Módgudr**: I am Módgudr, and I keep this bridge. Tell me your name and your kin, and why you ride it living.  
**Hermódr**: Hermódr, Odin’s son. I ride for my brother Baldr. Has he come this way?  
**Módgudr**: Yesterday five troops of the dead rode over this bridge, and it hardly made a sound under them.  
**Módgudr** _(think)_: Tonight it rings under one horse as if an army were crossing. You aren’t dead. None of you. Not even the small one.  
_Your Nubbin puts its head out of your cloak to check._  
**Módgudr** _(soft)_: Baldr rode over. Yes. The road to Hel lies down, and to the north.  

#### Done `a20-09-bridge-done`

**Módgudr** _(soft)_: Go gently. Everyone down there was somebody’s.  

#### Complete `a20-09-complete`

_You ride on, down and to the north. The road grows wider and quieter, as if it were used to people._  
_Ahead there is a gate, very tall, with no one at it._  
**Hermódr**: Hold on. Both of you. Tighter than that.  
_Your Nubbin wraps itself round your middle, under the cloak, and holds on._  

**Rewards**


Sets on completion: `{"a20-09":true}`

**Notes:** The nine nights are a dark screen with only sound (hooves, breath, cold wind) and the lines; the choice lines play over it. The Gjöll bridge’s gold roof is the only light. Módgudr’s questions and the five troops are Snorri’s beats in our own words. “The dead” are never shown: Módgudr only tells of them.

## A20-10. Hel’s Hall

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Hermódr in Hel, and Hel’s price* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-9, from Nova’s atlas. · requires: A20-9

**Cast:** Hermódr (Hermódr the Bold, Odin’s son (Snorri, Gylfaginning ch. XLIX); original design), Baldr (Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design), Hel (Hel, ruler of the realm of the dead (Snorri, Gylfaginning ch. XXXIV and XLIX); original, dignified design), Nanna (Nanna, Baldr’s wife (Snorri, Gylfaginning ch. XLIX); original design)

### Step 1: Hold on while Sleipnir leaps Hel’s gate.

Hint: Hold Hermódr’s belt with both hands, and lean when he leans. · check: `climb:a20-helgate:leap`

#### Scene `a20-10-gate`

_Hermódr gets down and pulls the girth tight. Then he mounts again and turns Sleipnir back from the gate, a long way back._  
**Hermódr**: He’s jumped worse. Not much worse. Lean when I lean.  
_Sleipnir runs at the gate. Eight hooves, and then none._  
_He goes over so high and so clean that he never touches it. Your stomach stays on the far side for a moment._  
_Then you are down, inside, on a floor like cold stone, and it is very quiet._  
_Your Nubbin puts its head out of your cloak. Then it wriggles free, drops to the floor, and runs._  

#### Done `a20-10-gate-done`

_It has seen a light, not a bright one. But it would know it anywhere._  

### Step 2: Stand with Hermódr in Hel’s hall while he asks for his brother.

Hint: Follow your Nubbin to the high seat and stay at Hermódr’s side. · check: `talk:a20-hel:hall`

#### Scene `a20-10-hall`

_Baldr is sitting in the high seat of the hall. His light is low, like a lamp turned down, but it is his._  
_Your Nubbin is already asleep on the step below him, curled up in what light there is._  
**Baldr** _(soft)_: Brother. And the guest. You came all this way.  
_Hel comes into her hall. She is tall and grave, half her face the colour of a winter dusk, and she does not hurry._  
**Hermódr**: Lady. Everyone above weeps for my brother. Let him ride home with me, and name your price.  
**Hel** _(think)_: Everyone? People say that. I will see whether he is as loved as they say.  
**Hel**: If all things in the world, quick and dead, weep for him, then he shall go back to the Æsir;  
**Hel**: but if one thing will not weep, he stays with me. That is my price, and it is a fair one.  
**Hermódr**: Everything will. You don’t know him.  
**Hel** _(soft)_: No. But I will.  

### Step 3: Carry Baldr’s and Nanna’s gifts for home.

Hint: Take what Baldr and Nanna give you, and keep it safe for the road. · check: `carry:a20-gifts:hel`

#### Scene `a20-10-gifts`

_Baldr comes down from the high seat to walk you to the door. Your Nubbin wakes and walks with him, in his light._  
_He takes the ring Draupnir from his arm and puts it in Hermódr’s hand._  
**Baldr** _(soft)_: Give this back to Father, for a remembrance. He’ll want something to turn in his hands.  
_Nanna comes behind him with a folded linen smock, and a gold ring._  
**Nanna** _(soft)_: The linen is for Frigg. The ring is for Fulla. Tell her thank you, for all the times she did my hair.  
**Baldr**: Guest. What did my mother say, when you left?  

**Choices**

- **She asked us to try.**
    - **Baldr**: That’s her. She never asks for more than you can carry.
- **She asked the whole world once. She’ll ask it again.**
    - **Baldr**: She will. She’ll ask until her voice gives out. Tell her I’m warm here. It’s true.
- **She sat on the step, and didn’t say anything.**
    - Baldr is quiet a long while.
    - **Baldr**: Then sit with her, when you get back. She won’t ask that either.

#### Complete `a20-10-complete`

_Your Nubbin will not leave his light. In the end Baldr picks it up himself and hands it to you at the gate._  
**Baldr** _(soft)_: Go on. I’ll be here. It isn’t so bad. There’s room, and it’s quiet, and Nanna is with me.  
_Sleipnir takes you back up the road: nine nights, the dark, the gold bridge, and Módgudr lifting one hand as you pass._  
**Hermódr** _(think)_: Everything has to weep. Everything.  
**Hermódr**: Then we ask everything. Again.  

**Rewards**


Sets on completion: `{"a20-10":true}`

**Learning Grove swaps**

- `a20-10-hall#6` → If everything in the world cries for him, every living thing and every stone, he may go home,

**Notes:** LIFTED TEXT: a20-10-hall#6 is Hel’s condition, verbatim (Brodeur ch. XLIX), ending on its semicolon; #7 finishes her sentence in our own words (it begins with a small “but” on purpose). The childLines version of #6 ends with a comma so #7 still follows. HEL (care notes): grave and fair, never a monster. Snorri’s half-dark, half-flesh face is drawn as half her face in winter-dusk blue; no rot, no skull. The hall is quiet and dim, not frightening. Nanna’s gifts and Draupnir follow Snorri; the hair line is ours. Draupnir goes home with Hermódr (A20-11 shows Odin holding it).

## A20-11. Everything Weeps

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: the messengers, and all things weep* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-10, from Nova’s atlas. · requires: A20-10

**Cast:** Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design), A Messenger (One of the messengers the gods send over the world (Gylfaginning ch. XLIX))

### Step 1: Go out with the messengers to ask the whole world to weep.

Hint: Choose a road at Fensalir’s door; every road needs somebody. · check: `choose:a20-road:fensalir`

#### Scene `a20-11-send`

_Hermódr tells it all in Fensalir: the road, the bridge, the high seat, and Hel’s price._  
_Odin turns Draupnir over and over in his hands. Fulla wears her ring on a cord round her neck._  
**Frigg** _(soft)_: Then we ask again. Everything. Every road. Send out messengers.  
**A Messenger**: There are more roads than messengers, lady.  
**Frigg**: Then take the guest. And the small one. It already knows how to ask.  
_Your Nubbin stands up straight, with its feet together, as it did when it made its own promise._  

**Choices**

- **Take the road to the hills.**
    - **A Messenger**: Stones, then, and old snow. Slow to answer. We’ll go slowly.
- **Take the road to the shore.**
    - **A Messenger**: Salt and shingle. The sea will weep. It always looks as if it might.
- **Take the road through the woods.**
    - **A Messenger**: Trees. They weep easily. It’s the iron under the ground I worry about.

### Step 2: Carry frosted stones from the shade into the sun.

Hint: Pick up the white-rimed stones on the north side and set them down in the sunlight. · check: `carry:a20-frost-stones:sun`

#### Scene `a20-11-stones`

_Everywhere you go, things weep: men and women at their doors, beasts in the fields, the earth itself in dark wet patches._  
_In a hollow on the north side there are stones still white with frost. Nobody has asked them yet._  
**A Messenger**: Carry them out, into the sun. You’ll see.  
_You carry the first one out and set it down where the sun is. The frost on it shines, goes clear, and begins to run._  
_Across the bottom of the page, the old book’s words run on:_  
_…and all men did this, and quick things, and the earth, and stones, and trees, and all metals,—_  
_even as thou must have seen that these things weep when they come out of frost and into the heat._  
_You carry stone after stone into the light, and every one of them weeps._  

#### Done `a20-11-stones-done`

_The iron in a gate weeps, and the copper on a roof. Even the gold on a ring weeps a little, in the warm._  

### Step 3: Stay with your Nubbin.

Hint: Sit down by your Nubbin in the sun. · check: `sit:a20-nubbin:sun`

#### Scene `a20-11-nubbin`

_You look round for your Nubbin. It is sitting in the sun beside the last stone, very still._  
_Water is running down its face, and it isn’t frost. It wipes at it with both arms, and looks at its arms, astonished._  
_It has never done this before. It looks up at you, as if to ask whether it is doing it wrong._  
**A Messenger** _(soft)_: Ah. There’s one more thing weeping than we asked.  
_You sit down beside it. It climbs into your lap and goes on weeping, more easily now that it knows what it is._  
_Somewhere very far down, you think, Baldr’s light might be a little brighter._  

#### Complete `a20-11-complete`

_By evening every road you walked is wet, and the sun is going down red over a weeping world._  
**A Messenger** _(soft)_: That’s ours done. Everything we asked, wept. Time to go home.  
_Your Nubbin carries one of the frost-stones home in both arms, and won’t put it down._  
_Whenever the sun touches it, it weeps a little still. It always will._  

**Rewards**

- The Weeping Stone (decor): A grey stone from the frosted hollow, set by the Grove pond. When the sun is on it, it weeps a little, the way frost does coming into the warm. Pure decoration.

Sets on completion: `{"a20-11":true}`

**Learning Grove swaps**

- `a20-11-stones#5` → Everybody wept, and every animal, and the ground, and the stones, and the trees, and every kind of metal.
- `a20-11-stones#6` → You know how frost turns to drops of water when you bring it in from the cold? That is how they wept.

**Notes:** LIFTED TEXT: a20-11-stones#5–6 are one Brodeur sentence (ch. XLIX) split over two lines; #5 opens with an ellipsis to mark the excerpt, and Brodeur’s double hyphen is set as an em dash. #4 introduces them as the page’s own print. Show #5–6 as a line of print along the bottom of the page, like A11-1’s opening print. The road choice has no flag. CINDER (cinder set): play ATLAS_A20_VARIANTS a20-11-ember after a20-11-stones, before a20-11-stones-done. SIM: the Weeping Stone is decor by the pond. When the Grove’s sun is on it, it shows a slow drip-and-sparkle; at night or in shade it is dry. No timer, no yield, nothing to collect. One-time reward.

## A20-12. The Cave

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. XLIX: Thökk in the cave* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-11, from Nova’s atlas. · requires: A20-11

**Cast:** A Messenger (One of the messengers the gods send over the world (Gylfaginning ch. XLIX)), Thökk (Thökk, the giantess in the cave (Gylfaginning ch. XLIX; men believe she was Loki)), Frigg (Frigg, Odin’s wife and Baldr’s mother (Snorri, Gylfaginning); original design)

### Step 1: Walk home with the messengers.

Hint: Follow the road back towards Fensalir, under the cliff. · check: `walk:a20-messengers:home`

#### Scene `a20-12-road`

_The messengers come home along every road at once, wet to the knees and very quiet._  
**A Messenger** _(happy)_: Nothing said no. Not one thing. Not a stone, not a beetle.  
**A Messenger** _(happy)_: He’ll be home by morning. Think of her face.  
_The road home runs under a cliff. In the cliff there is a cave, and in the mouth of the cave somebody is sitting._  
_A giantess. She has her knees drawn up and her arms round them, and her eyes are perfectly dry._  
**A Messenger**: One more. Just one. Then we’re done.  

### Step 2: Ask the giantess in the cave to weep for Baldr.

Hint: Go into the cave mouth with the messengers. · check: `talk:a20-thokk:cave`

#### Scene `a20-12-cave`

**A Messenger**: Mother, everything in the world weeps for Baldr, to bring him home from Hel. Will you weep too?  
**Thökk**: My name is Thökk. And no.  
**Thökk** _(angry)_: I’ll weep for him with dry eyes. That’s all he’ll get from me.  
**Thökk**: I had no joy of him living, and I’ll have none of him dead. Let Hel keep what she has.  
_The messengers stand very still. They have asked the whole world, and it said yes; they don’t know what to do with no._  
_Your Nubbin looks at you. Its face is still wet from the stones._  

**Choices**

- **Plead with her.** — sets `{"a20-thokk":"plead"}`
    - **You**: Please. He was kind to everyone. He was kind to me, and I was a stranger.
    - **You**: Please weep. Just a little. It’s all it would take.
    - **Thökk**: Then it’s a great deal, isn’t it, from me. No.
- **Sit down next to her, and say nothing.** — sets `{"a20-thokk":"sat"}`
    - You sit down in the cave mouth beside her, a little apart. You don’t ask her anything.
    - She looks at you sideways, and lets you stay. For a while, neither of you says a word.
    - **Thökk**: …It won’t make me weep, you know.
    - You nod. You know.
- **Walk away.** — sets `{"a20-thokk":"walked"}`
    - You turn and walk out of the cave, because you can’t look at her. Behind you the messengers ask again, and again.
    - Her answer is the same each time. You can hear it from the road.

#### Done `a20-12-cave-done`

**Thökk**: Go home. Tell them Thökk wouldn’t.  
_Whatever you do, she will not weep. The cave stays dry, and so do her eyes._  

#### Complete `a20-12-complete`

_The messengers go home slowly. Nobody wants to be the one who reaches Fensalir first._  
_They tell Frigg. She doesn’t weep again; she sits down on the step, and Fulla sits beside her._  
**Frigg** _(sad)_: One. Out of everything.  
_People believe the giantess in the cave was Loki, in another shape. That is how the old book tells it._  
_Your Nubbin keeps looking back at the cliff the whole way home._  

**Rewards**


Sets on completion: `{"a20-12":true}`

**Notes:** SIGNATURE CHOICE (a20-12-cave): a20-thokk = plead | sat | walked. Thökk refuses whatever you do. It pays off in A20-14 (a20-14-bowl*), A20-16 (a20-16-edge*) and A20-17 (a20-17-complete*). The sat option is the third rule acted out, never quoted here; it lands in Baldr’s line in a20-17-complete-sat. THÖKK’S VERSE is left out (not checked against Brodeur); she refuses in plain speech, in our own words. Her “dry eyes” is the verse’s idea, not its wording. ART: a giantess, large and still, arms round her knees; never comic, never ugly. The messengers call her “Mother” as a courtesy to an old woman. KEPT STONE (keptStone): play ATLAS_A20_VARIANTS a20-12-kept after the choice’s then lines, before a20-12-cave-done. HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a20-12-complete ends, play ATLAS_A20_VARIANTS a20-margin-hazel straight after it; otherwise it plays the first time the atlas is open at this page’s cave after s24Done is set. From then on the note is drawn in pencil in the margin beside the cave. Its text matches S24’s notes exactly.

## A20-13. The Salmon

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. L: Loki in Franang’s Falls* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-12, from Nova’s atlas. · requires: A20-12

**Cast:** Thor (Thor (Snorri, Gylfaginning); original design, no superhero or film look), Odin (Odin, the Allfather (Snorri, Gylfaginning); original design)

### Step 1: Climb with the gods to the house with four doors.

Hint: Follow the gods up the mountain path; the house is near the top. · check: `climb:a20-mountain:four-doors`

#### Scene `a20-13-house`

_The gods know now whose hand was at Hödr’s elbow. It was Loki’s, and he has run._  
_They hunt for him a long time. In the end they find a house high on a mountain, with a door in every wall._  
**Thor** _(angry)_: Four doors. So he could watch every way at once.  
_The house is empty, and the fire is still warm. Beside it lies a little heap of grey ash, in a shape like knots._  
**Odin** _(think)_: He was making something. And he burned it when he saw us on the path.  
_Below the mountain a waterfall comes down white into a deep pool. Your Nubbin goes to the door to look at it._  

### Step 2: Help the gods work out what was burned, and make one like it.

Hint: Look closely at the ash by the hearth, then hold the cord while the gods knot. · check: `inspect:a20-ash:hearth`

#### Scene `a20-13-ash`

_The wisest of the gods, Kvasir, kneels by the hearth and looks at the ash a long time without touching it._  
_It is the shape of a net, and nobody has ever made a net before. Loki made the first one, and then he burned it._  
**Odin** _(think)_: Then he is in the water. He knew we would make one too, sooner or later. So we shall.  
_The gods sit down and make a net by the shape of the ash. It is slow work, and your Nubbin keeps getting knotted into it._  
**Thor** _(happy)_: Hold still, small one. You’re not the fish.  
_It is the first time anyone has smiled since the Thing-field. It doesn’t last, but it happens._  

**Choices**

- **Hold the cord steady.**
    - You hold it steady through every knot. Kvasir nods to you once, when it is done.
- **Tie some of the knots yourself.**
    - You tie a row of knots. Thor checks every one and doesn’t undo any of them, which is praise.
- **Untangle your Nubbin first.**
    - You untangle your Nubbin. It sits on the bench and watches the rest with great interest and both arms folded.

### Step 3: Hold the net across Franang’s Falls.

Hint: Take the bank end of the net and keep it low as the gods walk it down the river. · check: `carry:a20-net:falls`

#### Scene `a20-13-falls`

_The waterfall is Franang’s Falls. In the pool under it, by day, a salmon lies very still, and it is Loki._  
_Thor wades into the middle of the river with the net. You take one end on the bank, and the gods take the other._  
_You drag it down the river. The salmon slips over the top of the net and is away towards the sea._  
_Again. This time the salmon must choose: the open sea, or a leap back over the net._  
_It leaps. Thor grabs at it in mid-air, and catches it by the tail._  
_It slides through his hand, and his hand closes, and holds. That, the old book says, is why the salmon tapers at the tail._  

#### Done `a20-13-falls-done`

_In Thor’s hand the salmon is a man again, soaked and still. He doesn’t struggle, and he doesn’t say anything at all._  

#### Complete `a20-13-complete`

_The gods take Loki away with them, down the mountain. Nobody speaks._  
_Your Nubbin stands on the bank looking at the falls. Then it looks at you, as if there is a question it can’t find the shape of._  
**Odin** _(sad)_: Go home to Fensalir, guest. What happens next is ours to do.  
_The page turns anyway, the way pages do. There is one more place to go before the snow._  

**Rewards**


Sets on completion: `{"a20-13":true}`

**Notes:** Snorri’s capture, in our own words: the four-doored house, the first net burned, Kvasir reading the ash, the two drags, the leap, Thor’s catch, and the just-so about the salmon’s tail. Loki is first named here (a20-13-house#0). He never speaks on the page. The one smile (a20-13-ash#4–5) is the only lightness after A20-6; keep it small. ART: the net is plain cord; the salmon is a real salmon, silver, no face.

## A20-14. The Bowl

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. L: Loki bound, and Sigyn’s bowl (softened)* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-13, from Nova’s atlas. · requires: A20-13

**Cast:** Sigyn (Sigyn, Loki’s wife (Snorri, Gylfaginning ch. L); original design)

### Step 1: Follow the stair down under the earth.

Hint: Take the steep stair at the back of the cave, and keep your Nubbin close. · check: `walk:a20-under-earth:stair`

#### Scene `a20-14-cave`

_Under the earth there is a cave, and in the cave three flat stones. Loki is bound across them._  
_The page doesn’t show the binding. It shows only that he cannot move, and that he will not be let go._  
_Above his face a snake hangs from the rock. Its venom gathers, slowly, and drips._  
_A woman kneels beside him, holding a bowl up under the drops. It is Sigyn, his wife._  
_She has been holding it a long time. Her arms are shaking._  
_Your Nubbin stops at the bottom of the stair and holds on to your trouser leg._  

### Step 2: Stay with Sigyn by the bowl, as near as you can bear.

Hint: Go nearer to Sigyn and the three stones, or stay where you are. · check: `sit:a20-sigyn:bowl`

#### Scene `a20-14-bowl`

_You go nearer. Sigyn knows who you are: the guest who ran Frigg’s errands, and begged at the cave._  
_She doesn’t look at you. She looks at the bowl, and at nothing else._  
**Sigyn** _(sad)_: You asked so nicely, in the cave. Everybody heard about it.  
**Sigyn**: I don’t ask anything of you. Don’t ask anything of me.  
_The bowl fills, drop by drop. Sigyn keeps her eyes on it, and her arms up._  
_Your Nubbin sits down at the edge of the lamplight and doesn’t come any closer._  

### Step 3: See what happens when the bowl is full.

Hint: Stay still; it won’t take long. · check: `watch:a20-earth:shakes`

#### Scene `a20-14-shake`

_The bowl is full. Sigyn has to take it away to empty it._  
_While she is gone, the drops fall on him. He shudders, so hard that the whole earth shakes._  
_Far above, people feel the ground move and call it an earthquake. In this story, now you know why._  
_Then Sigyn is back with the bowl, and the drops fall into it, and the shaking stops._  
_The old book says he lies like this until the end of things. And she kneels there with him, all that time._  
_Your Nubbin is holding on to you with both arms._  

**Choices**

- **Hold your Nubbin close.**
    - You hold it close. It is shaking too, a little, like the earth, and then it isn’t.
- **Stay a while longer, for Sigyn.**
    - You stay, and Sigyn doesn’t look round. But when you go, she lifts one hand off the bowl, just for a moment.
- **Go back up the stair.**
    - You go up the stair into the cold air. Behind you the earth is quiet again, for now.

#### Complete `a20-14-complete`

_You climb up out of the earth into a grey evening. The wind has changed, and it smells of snow._  
_The page turns under your hand. On the other side it is white from edge to edge._  
_There is no road on this side. There is only the plain._  
_Your Nubbin pulls your cloak round both of you, and you step out onto the snow._  

**Rewards**


Sets on completion: `{"a20-14":true}`

**Notes:** SOFTENED (care notes), and the page says so (a20-14-cave#1). Three stones, the snake, Sigyn’s bowl. The bonds are not drawn or named; his sons, their deaths and the entrails are cut. Loki is seen lying still under a dim lamp; the venom is a slow clear drop, never a burn. The earthquake is Snorri’s just-so, in our words. THÖKK PAYOFF (a20-thokk). The step 2 scene shown, a20-14-bowl, is for plead (Sigyn won’t look at you). For sat play ATLAS_A20_VARIANTS a20-14-bowl-sat (she lets you hold a second bowl while she empties hers, so for a moment no drops fall). For walked play a20-14-bowl-walked (you watch from the cave mouth). In walked, the step 3 lines are seen from the foot of the stair; they need no change. Sigyn speaks only of “the cave”; the page never confirms who Thökk was.

## A20-15. The Fimbulwinter

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. LI and LIII: the Fimbulwinter, and Líf and Lífthrasir* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-14, from Nova’s atlas. · requires: A20-14

**Cast:** Líf (Líf, who hides in Hoddmímir’s Holt (Snorri, Gylfaginning ch. LIII); original design), Lífthrasir (Lífthrasir, who hides in Hoddmímir’s Holt (Gylfaginning ch. LIII); original design)

### Step 1: Cross the long white plain.

Hint: Keep the wind at your back and walk towards the dark line of trees. · check: `walk:a20-plain:white`

#### Scene `a20-15-plain`

_Now comes the great winter. The old book calls it the Fimbulwinter._  
_Snow drives in from every side. The frost bites hard, the wind cuts, and the sun hangs pale and gives no heat._  
_Three winters come one after another, with no summer between them. The seasons simply forget to turn._  
_You walk with your head down. Your Nubbin rides inside your cloak, tucked up against your chest._  
_You think of a valley you know, where a winter once would not end, and the small ones went still in the long grass._  
_Ahead, through the white, there is a dark line of trees._  

### Step 2: Find the two who are hiding in the wood.

Hint: Walk in under the trees and look for where the snow is trodden. · check: `find:a20-holt:hoddmimir`

#### Scene `a20-15-holt`

_The wood is called Hoddmímir’s Holt. Under its trees the snow is thinner, and the wind can’t find you._  
_Two people are sitting in a hollow under the roots of a great tree, wrapped in one blanket: a woman and a man._  
**Líf** _(shock)_: Oh. Someone. I thought there was nobody left who could walk.  
**Lífthrasir**: We’re Líf and Lífthrasir. We hide here. We live on the dew, every morning, off the leaves.  
**Líf** _(soft)_: It isn’t much. But it’s enough, if you don’t want very much.  
_Your Nubbin climbs out of your cloak and goes straight to them. It sits down between them, under the blanket._  
**Lífthrasir**: It’s warm. Can it stay?  

### Step 3: Keep Líf and Lífthrasir company through the winter.

Hint: Sit in the hollow with them; there is nowhere else you need to be. · check: `sit:a20-lif:holt`

#### Scene `a20-15-company`

_So you stay in the holt, through the snow. Every morning the four of you lick the dew off the leaves, and it tastes of nothing._  
_Every night you sit close, under one blanket and your cloak, and the winter goes on outside the trees._  
_Your Nubbin shares itself out: a night by Líf, a night by Lífthrasir, a night in your lap._  
**Lífthrasir**: We used to have names for the days. We stopped. There didn’t seem to be any point.  
_Outside, the third winter starts without the second one having ended._  
**Líf**: Tell us something. Anything that isn’t snow.  

**Choices**

- **Tell them about your valley.**
    - **You**: There’s a pond, and a gate that sticks. You have to lift it and push.
    - **Lífthrasir**: A gate that sticks. That sounds like a good place to live.
- **Tell them about the bright hall on the rise.**
    - You tell them about Breidablik, and the light coming off him, and your Nubbin asleep on the boards.
    - **Líf**: Then there was a light once. Good. I hoped there was.
- **Say nothing. Just sit close.**
    - You sit close and say nothing. After a while Lífthrasir puts his head on your shoulder, and sleeps.

#### Done `a20-15-company-done`

**Líf** _(soft)_: You stayed. Nobody stays anywhere any more. Everybody’s running somewhere.  

#### Complete `a20-15-complete`

_One morning the dew tastes different: not warmer, just different, as if something far off had changed its mind._  
**Lífthrasir** _(think)_: Something’s coming. I can feel it in the roots.  
**Líf**: Not here, though. It won’t come here. Will it?  
_Your Nubbin climbs the tree roots to the edge of the holt, and looks out._  

**Rewards**


Sets on completion: `{"a20-15":true}`

**Notes:** The Fimbulwinter is the White Year in another key: a20-15-plain#4 is the only line that says so, and it never names Cinder or the Heartstone. LIFTED TEXT: none. Brodeur ch. LI (“frosts shall be great then…”) is unverified in Part M, so a20-15-plain#1 tells it in our own words; do not swap in Brodeur’s wording unless it is checked. Líf and Lífthrasir are Snorri’s pair who hide in Hoddmímir’s Holt and live on the morning dew. CINDER (cinder set): after a20-15-company’s choice, before a20-15-company-done, play ATLAS_A20_VARIANTS a20-15-ember-forgiven (cinder = forgiven: it burns steady) or a20-15-ember-remembered (cinder = remembered: it flickers but never goes out). KEPT STONE (keptStone): at the same point play a20-15-kept instead (the stone hums; the pair sit further off; nothing else changes). cinder and keptStone never both hold.

## A20-16. The Twilight

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. LI: Ragnarök, seen from far off* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-15, from Nova’s atlas. · requires: A20-15

**Cast:** Líf (Líf, who hides in Hoddmímir’s Holt (Snorri, Gylfaginning ch. LIII); original design), Lífthrasir (Lífthrasir, who hides in Hoddmímir’s Holt (Gylfaginning ch. LIII); original design)

### Step 1: Look out from the edge of the holt.

Hint: Climb the roots at the wood’s edge, where your Nubbin is. · check: `climb:a20-holt:edge`

#### Scene `a20-16-edge`

_From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky._  
_Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills._  
_Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast._  
_A ship is coming over the sea. It is huge and dark, and very slow._  
_There is a figure in its bow. It stands looking ahead at the land, and never turns round._  
_On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place._  
_None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms._  

### Step 2: Wait at the holt’s edge until it is over.

Hint: Stay with Líf and Lífthrasir; nothing will reach the trees. · check: `wait:a20-holt:twilight`

#### Scene `a20-16-wait`

_Líf and Lífthrasir come up beside you. They don’t look out; they look at you, to see how bad it is._  
**Líf**: Tell us. Is it coming here?  
_You watch the fire, and the running wolves, and the sky. None of it comes towards the trees._  
**You**: No. Not here.  
**Lífthrasir** _(soft)_: Then we’ll wait. We’re good at waiting.  
_The light changes. The noise far off gets less, and less, and is gone._  

**Choices**

- **Hold Líf’s hand.**
    - You hold Líf’s hand. Her fingers are cold, and then they aren’t.
- **Tuck your Nubbin inside your cloak.**
    - You tuck your Nubbin inside your cloak. It puts one eye out, to keep watch with you.
- **Keep watching, so that someone does.**
    - You keep watching. It is a hard thing to see, even far off, and someone should, so that it isn’t only told.

#### Complete `a20-16-complete`

_Then it is quiet. Not the quiet of the snow: a new quiet, like a room after everybody has gone home._  
_The snow stops. Nobody notices for a while, because it has been snowing for so long._  
**Líf**: Is it over?  
_Your Nubbin sniffs the air, and sneezes. The air smells of salt, and of something green._  

**Rewards**


Sets on completion: `{"a20-16":true}`

**Notes:** TOLD, NOT SHOWN UP CLOSE (care notes). Everything is a far view from the holt: small running wolves against the sky, a dark ship far out, a low line of fire. No battle, no deaths, no named gods falling; nothing reaches the holt. Draw it like weather on distant hills. The ship is Snorri’s; the page doesn’t name it or the figure in its bow. THÖKK PAYOFF (a20-thokk). The step 1 scene shown, a20-16-edge, is for plead (the figure never turns). For sat play ATLAS_A20_VARIANTS a20-16-edge-sat (it looks straight at the holt, once). For walked play a20-16-edge-walked (you hear the ship but never see it).

## A20-17. The Green Earth

*Prose Edda (Snorri Sturluson, Iceland, 1220s), Gylfaginning, ch. LIII: the earth rises again* · audience: all · where: Nova’s atlas: the Weeping page (Atlas campaign) · when: Any time after A20-16, from Nova’s atlas. · requires: A20-16

**Cast:** Líf (Líf, who hides in Hoddmímir’s Holt (Snorri, Gylfaginning ch. LIII); original design), Lífthrasir (Lífthrasir, who hides in Hoddmímir’s Holt (Gylfaginning ch. LIII); original design), Vídarr (Vídarr, Odin’s son, who lives on after Ragnarök (Gylfaginning ch. LIII); original design), Baldr (Baldr the Good, Odin’s son (Snorri, Gylfaginning ch. XXII and XLIX); original design), Hödr (Hödr, Baldr’s blind brother (Snorri, Gylfaginning ch. XXVIII and XLIX); original design)

### Step 1: Walk out of the holt into the new land.

Hint: Follow Líf and Lífthrasir out from under the trees. · check: `explore:a20-green:fields`

#### Scene `a20-17-green`

_The sea goes down. Out of it the land comes up again, wet and new, and green as a first leaf._  
_There are fields on it already. Corn is growing in them, and nobody sowed it._  
_Líf and Lífthrasir walk out from under the trees, slowly, holding on to each other. Then faster._  
**Líf** _(happy)_: Grass. Feel it. It’s grass.  
**Lífthrasir** _(happy)_: And the sun. Look. It’s warm. It’s warm again.  
_The sun had a daughter before the end, the old book says. Now she rides her mother’s road, just as bright._  
_Your Nubbin runs out into the middle of a field and lies down flat in the sun, arms and legs out._  

### Step 2: Go to the old ground where the gods’ halls stood.

Hint: Walk across the fields to the plain where grass grows over old stones. · check: `visit:a20-idavoll:old-ground`

#### Scene `a20-17-old-ground`

_Where the gods’ halls stood there is a plain of grass, with old stones showing through it here and there._  
_People are gathering there: the gods’ sons, who came through the end of things, Vídarr and Váli, Módi and Magni._  
_Módi and Magni have their father’s hammer between them. They carry it gently, like something asleep._  
**Vídarr** _(soft)_: Guest. You came through as well. Sit with us. There’s a great deal to talk about, and all the time in the world.  
_Then two more come walking up out of the ground, by the road that goes down. They come from Hel._  
_Baldr comes, and Hödr with him._  
_Baldr’s light is just as it was. Your Nubbin is up and running before you can stand._  

#### Done `a20-17-old-ground-done`

_Your Nubbin runs straight into Baldr’s light and falls asleep in it, at once, in the grass._  
_It has been trying to get back there all this time._  

### Step 3: Look in the grass for what the gods once played with.

Hint: Search the long grass round the old stones. · check: `find:a20-game-pieces:grass`

#### Scene `a20-17-pieces`

_The brothers sit down on the grass, and the others sit round them, and they talk about old things._  
**Baldr** _(happy)_: Do you remember the Thing-field? The arrow that went round me?  
**Hödr** _(happy)_: I remember the guest telling it. Better than you did, as well.  
_In the long grass by the old stones, your hand closes on something small and cold. You pull it out._  
_It is a game piece, made of gold. There are more of them in the grass: the pieces the gods played with in the old days._  
**Vídarr** _(soft)_: They were ours, before. Now they’re anybody’s.  

**Choices**

- **Give the first piece to Baldr.**
    - **Baldr**: Ha. I always lost with this one. Every single time.
- **Give the first piece to Hödr.**
    - Hödr turns it over in his fingers, feeling the shape of it.
    - **Hödr**: A little horse. I know this one. I always wanted to be the horse.
- **Set it on the grass between them.**
    - You set it on the grass between the two brothers. They both reach for it at once, and both laugh.

#### Complete `a20-17-complete`

_The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it._  
_Hödr turns his face towards you. You find you are sitting beside him, closer than anyone._  
**Hödr** _(soft)_: You rode down to fetch my brother home, and you begged for him in the cave. I heard about that.  
**Hödr** _(soft)_: Thank you for trying.  
_Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground._  
**Baldr** _(soft)_: It was too young to be asked, once. It’s older now. So am I. Keep it for me.  
_Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own._  
_Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed._  
_You are back in the Grove, the atlas on your knee. There is a golden game piece in your pocket, and your Nubbin is holding a sprig._  

**Rewards**

- Mistletoe Sprig (cosmetic): A sprig with two leaves, for your Nubbin to wear. Frigg asked everything not to harm her son, but one small sprout she thought too young to ask. When he died, everything in the world wept for him but one.
- Golden Game Piece (decor): A little gold piece from the gods’ old game, found in the grass of the green earth. It stands on the cottage shelf.
- Price of Power Bookmark (item): A strip of grey linen with one green thread through it. It marks the Weeping page, and counts towards the Price of Power festival.

Sets on completion: `{"a20-17":true,"a20-done":true}`

**Notes:** LIFTED TEXT: none. Brodeur ch. LIII (“In that time the earth shall emerge out of the sea…” and “After that Baldr shall come there, and Hödr, from Hel;”) is unverified in Part M (checked only through a course reader), so a20-17-green#0–1 and a20-17-old-ground#4–5 tell the beats in our own words. Swap in Brodeur’s wording only once it is checked, and add childLines then. The sun’s daughter (a20-17-green#5) and Thor’s sons with the hammer are Snorri’s beats in our words. The old ground is Idavoll in the check id only. THÖKK PAYOFF (a20-thokk): who sits closest to Hödr. The complete scene shown, a20-17-complete, is for plead (you; Hödr thanks you for trying). For sat play ATLAS_A20_VARIANTS a20-17-complete-sat (Baldr; his line lands the third rule). For walked play a20-17-complete-walked (no one at first, until Baldr calls him over). On every path the earth comes up green and the sprig is given. CINDER (cinder set): play ATLAS_A20_VARIANTS a20-17-ember after a20-17-green, before step 2 (Líf asks where the ember came from; the choice sets no flag). REWARDS (one-time, at a20-17-complete*): the Mistletoe Sprig cosmetic (its description is its story in two plain lines, as Part M asks; never a kissing or Christmas-love story), the Golden Game Piece decor, and the Price of Power Bookmark. SIM: the Price of Power festival (A1, A4, A8, A15, A20, A30, any two) reads atlasDone('A20') from a20-done.

## Variant scenes

#### Variant `a20-01-ember`

_Your Nubbin is carrying its little lantern, as it does everywhere now. Inside it, the red pebble from the high pass glows._  
**Fulla** _(think)_: A lamp with no flame. It’s warm, though. My hands are warm just being near it.  
**Frigg** _(soft)_: Somebody gave that away who had very little left to give. Keep it close, little one.  

#### Variant `a20-11-ember`

_Your Nubbin holds its little lantern up close to a stone that is slow to weep. The red pebble inside glows._  
_The frost on that stone runs at once, faster than any of the others, as if it had only been waiting to be asked kindly._  
**A Messenger** _(think)_: What’s that you carry?  
**You**: Something warm. From a long way off.  

#### Variant `a20-12-kept`

_Thökk’s eyes go to your pocket, where the stone sits, and stay there._  
**Thökk** _(think)_: You understand.  
**Thökk**: Keep what you have.  
_Your hand goes to your pocket. The stone is cold through the cloth, as it always is._  

#### Variant `a20-margin-hazel`

_Nova’s atlas lies open at the cave in the cliff, and the giantess with her arms round her knees._  
_Beside the cave, in faint pencil you have never noticed, there is a note in the margin. You know the hand._  
_“Everything wept but one. Don’t hate her for it.”_  
_“Feel sorry for her.”_  
_And under it, one letter: H._  
_Your Nubbin puts one paw on the drawing of the cave, gently, the way it would on somebody’s arm._  

#### Variant `a20-14-bowl-sat`

_You go nearer. Sigyn looks up at you for a long moment; she knows who you are._  
**Sigyn** _(soft)_: You’re the one who sat down, in the cave mouth. I know about that.  
_Her bowl is nearly full, and her arms are shaking._  
**Sigyn**: Hold this, under the drops. Just while I empty mine.  
_She gives you a second bowl, a little wooden one. You hold it up under the snake, and she goes to empty hers._  
_For a moment, while you hold it, no drops fall on him at all. His face goes quiet._  
_Then Sigyn is back, and takes her place, and holds her bowl up again._  
**Sigyn** _(soft)_: Thank you.  

#### Variant `a20-14-bowl-walked`

_You stop at the cave mouth, at the bottom of the stair, and go no further._  
_From there you can see the lamp, and the three stones, and Sigyn kneeling with her bowl held up._  
_She doesn’t know you’re there, or doesn’t look. The bowl fills, drop by drop._  
_Your Nubbin sits down beside you on the bottom step. Neither of you goes in._  
_You watch from the cave mouth. It is as near as you can bear to stand._  
_Above you the earth is quiet, and waiting._  

#### Variant `a20-15-ember-forgiven`

_Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows._  
_It burns steady all winter long, never hot, always warm. The snow draws back from it in a ring._  
**Líf** _(soft)_: Oh. Warm. I’d forgotten.  
_Your Nubbin sits with its paws round the lantern, carefully, as if it were something lent._  

#### Variant `a20-15-ember-remembered`

_Your Nubbin opens its little lantern and sets it in the hollow, between Líf and Lífthrasir. The red pebble glows._  
_It flickers in the wind that gets in under the trees. Some nights it is so low you think it has gone._  
_But it never goes out. In the morning it is always there, small and red and warm._  
**Lífthrasir** _(soft)_: It keeps trying. Look at it. It just keeps trying.  

#### Variant `a20-15-kept`

_In your pocket the stone wakes in the cold. It hums one word, the only word it has: safe._  
_Líf and Lífthrasir hear it, and don’t like it. Without a word they move to the far side of the hollow._  
**Lífthrasir** _(think)_: What is that? It sounds like the snow, talking.  
_Nothing else changes. They still let you stay; they just sit a little further off._  

#### Variant `a20-16-edge-sat`

_From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky._  
_Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills._  
_Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast._  
_A ship is coming over the sea. It is huge and dark, and very slow._  
_There is a figure in its bow. Once, just once, it turns its head and looks straight across the sea, at the holt._  
_Then it looks ahead again, and does not turn back._  
_On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place._  
_None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms._  

#### Variant `a20-16-edge-walked`

_From the edge of the holt you can see a long way: the white plain, the grey sea beyond it, and the sky._  
_Something is happening at the end of the world. It is very far off, and you see it the way you see weather on the hills._  
_Wolves are running across the sky, after the sun and after the moon. They are small with distance, and fast._  
_Something is coming over the sea. You can hear it, a long creak of timbers and slow oars, but you can’t see it._  
_The mist lies low on the water. You look and look, and you never see the ship._  
_On the far edge of the world there is a line of fire, low down, like a sunset in the wrong place._  
_None of it comes near. The holt is very quiet, and your Nubbin is holding on to a root with both arms._  

#### Variant `a20-17-ember`

_Líf stops by your Nubbin’s little lantern at the edge of the field. The red pebble is still glowing, though the sun is warm now._  
**Líf**: That kept us alive, I think. Where did it come from?  

**Choices**

- **“From someone who held on too tight, once.”**
    - **Líf**: And let go, in the end?
    - **You**: In the end.
    - **Líf**: Then it’s a good thing to carry.
- **Say nothing.**
    - You say nothing. Líf looks at the pebble a while longer, and nods, as if that were an answer too.

#### Variant `a20-17-complete-sat`

_The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it._  
_Baldr sits down beside Hödr, close, shoulder to shoulder, the way they always used to sit._  
**Baldr** _(soft)_: You sat with the one who wouldn’t weep. Someone should.  
_Hödr nods. He doesn’t say anything, and he doesn’t need to._  
_Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground._  
**Baldr** _(soft)_: It was too young to be asked, once. It’s older now. So am I. Keep it for me.  
_Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own._  
_Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed._  
_You are back in the Grove, the atlas on your knee. There is a golden game piece in your pocket, and your Nubbin is holding a sprig._  

#### Variant `a20-17-complete-walked`

_The sun goes over the new land. The talk goes on, slow and easy, as if there will always be more of it._  
_Hödr sits a little apart from the others, at the edge of the grass, with his hands empty._  
_Nobody goes to him at first. You don’t either._  
**Baldr** _(soft)_: Brother. Come and sit here. There’s room. There was always room.  
_Hödr gets up, and comes over, and sits down next to him._  
_Before you go, Baldr puts something in your hand: a sprig with two leaves, from a tree at the edge of the old ground._  
**Baldr** _(soft)_: It was too young to be asked, once. It’s older now. So am I. Keep it for me.  
_Your Nubbin wakes in his light and looks at him for a long moment. Then it gets up and comes back to you, on its own._  
_Líf and Lífthrasir walk out together into the morning, across the fields that nobody sowed._  
_You are back in the Grove, the atlas on your knee. There is a golden game piece in your pocket, and your Nubbin is holding a sprig._  
