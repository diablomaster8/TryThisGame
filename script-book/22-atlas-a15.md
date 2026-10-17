# Atlas, page A15: The Humbug

## A15-1. The Grey Prairie

*The Wonderful Wizard of Oz (1900), ch. I: The Cyclone* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), Aunt Em (Aunt Em (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), Uncle Henry (Uncle Henry (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Step into the grey page and find the farmhouse.

Hint: Touch the page, then walk across the prairie to the only house on it. · check: `explore:a15-prairie:farmhouse`

#### Scene `a15-01-page`

_Nova’s atlas falls open at a page that is almost all grey: flat land to the edges of the paper, and one small house._  
_In the top corner someone has drawn a twist of cloud, in darker pencil. Across the top runs a line of print._  
_Once the house had been painted, but the sun blistered the paint and the rains washed it away, and now the house was as dull and gray as everything else._  
_The grey goes soft under your fingers. Then it is dry grass, baked flat, and you and your Nubbin are standing in it._  
_There is no tree, no hill, no fence. The sky comes all the way down to the ground on every side._  
_A small black dog comes running through the grass, barking at your Nubbin as if he has waited all day for something new._  
**Dorothy**: Toto! Toto, come back! Oh. Hello. I didn’t know anybody lived out this way. Nobody does.  
**Dorothy**: I’m Dorothy, and that’s Toto. He’s the only thing round here that isn’t grey, and he knows it.  
_Your Nubbin and Toto sniff each other, nose to nose. Toto decides it is all right, and sneezes._  

**Choices**

- **Tell her your name.**
    - **Dorothy**: That’s a nice name. It sounds like it comes from somewhere with trees.
- **Ask why everything is grey.**
    - **Dorothy**: The sun, mostly, and the wind. Aunt Em came out here young and pretty, Uncle Henry says. It took the shine off her.
- **Let your Nubbin play with Toto.**
    - Your Nubbin and Toto race twice round you and fall over in the dust. It is the first noise the prairie has heard all day.

#### Done `a15-01-page-done`

**Dorothy**: Come up to the house. Aunt Em will want to look at you. She looks at everything as if it might be a cloud.  

### Step 2: Help Uncle Henry and Aunt Em make ready for the storm.

Hint: Watch the sky to the north, then help at the square door in the floor. · check: `watch:a15-cyclone:north`

#### Scene `a15-01-storm`

_The house is one room: a stove, a table, a cupboard, three or four chairs and two beds. In the floor there is a square door._  
_Uncle Henry is standing on the doorstep, looking at the sky. It has gone a darker grey than usual._  
**Uncle Henry** _(think)_: Storm’s coming, Em. A big one. I’m going to see to the animals.  
_From the north comes a low wail in the wind. The long grass bows down flat, all the way to the edge of the world._  
**Aunt Em** _(shock)_: Dorothy! The cellar! Now, child!  
_Aunt Em throws open the trap door and climbs down the ladder into the small dark hole underneath._  
_Toto jumps out of Dorothy’s arms and hides under the bed. Dorothy goes down on her knees after him._  
**Dorothy**: Toto! Come out! Oh, you bad dog, come out this minute!  

**Choices**

- **Hold the trap door open for her.**
    - You kneel and hold the trap door. Aunt Em is calling from below, and the whole house has begun to shake.
- **Reach under the bed for Toto.**
    - You get a hand on Toto’s collar and pass him, wriggling, to Dorothy. The floor is already shaking.
- **Grab your Nubbin first.**
    - Your Nubbin is in your arms before you know you’ve reached for it. It is trembling, and so is the floor.

#### Done `a15-01-storm-done`

_The wind gives a great shriek, and the house shakes so hard that Dorothy sits down suddenly on the floor._  
_Then the house turns round twice, quite slowly, and lifts off the ground like a balloon._  

### Step 3: Ride out the cyclone, then step out of the page where the house comes down.

Hint: Keep hold of your Nubbin; when the edge of the page curls, step through. · check: `wait:a15-house:munchkin-land`

#### Scene `a15-01-cyclone`

_The house is carried up to the very middle of the cyclone, where it is strangely quiet, and it rocks along like a cradle._  
_Toto runs about barking. Then he goes too near the open trap door, and falls in._  
_The wind holds him up. Dorothy lies flat on the floor, reaches down, and pulls him back by one ear._  
**Dorothy**: There. That’s quite enough adventure for one dog.  
_Hours go by. Nothing happens but the wind, and Dorothy shuts the trap door so that nobody else falls in._  
**Dorothy** _(think)_: I’m going to lie down. If the house is going to fall, I’d rather be asleep for it.  
_She lies down on her bed with Toto beside her. The house rocks, and she sleeps._  
_You stay awake, with your Nubbin in your lap. Somebody ought to._  
_The edge of the page has begun to curl. Through the gap you can see grass: green grass, and a great deal of it._  

**Choices**

- **Step through the gap with your Nubbin.**
    - You step through. Behind you the house drops the last few feet, with a bump that makes the whole page jump.
- **Take a last look at Dorothy, asleep.**
    - She is fast asleep, with one arm over Toto. You step through the gap, and the house comes down behind you.

#### Done `a15-01-cyclone-done`

_You land in soft grass. After all that grey, everything is very bright: green banks, tall trees heavy with fruit, a brook, birds._  
_Behind you the grey farmhouse sits in the middle of it all, a little crooked, as if it had sat down suddenly._  

#### Complete `a15-01-complete`

_Your Nubbin rolls over and over in the green grass, the way it does in the Grove after rain._  
_The door of the house opens. Dorothy looks out, with Toto in her arms, and her mouth falls open._  
**Dorothy** _(shock)_: Oh. Oh, my. Where has Kansas gone?  
_Some little people in blue are coming towards the house, very slowly, as if they are not sure it will stay where it is._  
_Under one corner of the house, two feet in silver shoes are sticking out. Nobody has noticed them yet but your Nubbin._  

**Rewards**


Sets on completion: `{"a15-01":true}`

**Learning Grove swaps**

- `a15-01-page#2` → Long ago the little house was painted, but the sun peeled the paint and the rain washed it off, and now it was grey like everything else.

**Notes:** OPENING: the atlas page is pencil and grey wash; it colours in only when you step out into Munchkin country (a slow wash of green, two seconds, at a15-01-cyclone-done). a15-01-page#1–2 show the line of print across the top of the page; voice it as narration. The cyclone is calm and safe on screen: the house rocks "like a cradle", nobody is hurt, and the Kansas cellar is never shown from inside. Toto is a small black dog with long silky hair (Denslow). Dorothy wears a faded gingham frock here; the blue-and-white one comes in A15-2. NO film imagery: no sepia, no farmhands, no Miss Gulch, no bicycle in the sky.

## A15-2. The Council with the Munchkins

*The Wonderful Wizard of Oz (1900), ch. II–III: the council, the silver shoes and Boq’s feast* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-1, from Nova’s atlas. · requires: A15-1

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Witch of the North (The Good Witch of the North, an old woman in white (L. Frank Baum, The Wonderful Wizard of Oz, 1900); not Glinda), A Munchkin (One of the three Munchkins at the council (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), Boq (Boq, the rich Munchkin (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Greet the little people and the old woman in white.

Hint: Walk round the house to where the Munchkins are waiting. · check: `talk:a15-north:council`

#### Scene `a15-02-council`

_Three men and a woman come up, no taller than Dorothy. They wear blue, and round pointed hats with little bells that tinkle._  
_The woman is very old, with white hair and a white gown sprinkled with stars. She bows low to Dorothy._  
**The Witch of the North**: Welcome to the land of the Munchkins, my dear. They have asked me to thank you for setting them free.  
**Dorothy** _(shock)_: Thank you. But I think you’ve muddled me up with somebody else. I haven’t done anything.  
**The Witch of the North** _(think)_: Your house did, then, which comes to the same. Look there, under the corner.  
_Dorothy looks, and gives a little cry. Two feet in silver shoes are sticking out from under the house._  
**Dorothy** _(sad)_: Oh, no. Oh, the poor thing. The house came down right on top of her.  
**The Witch of the North**: Nothing at all. She was the Wicked Witch of the East, and she kept these people working for her night and day.  
**A Munchkin** _(happy)_: Night and day! For years! And now she’s gone!  
_When they look again, the feet have gone. The old Witch was so very old that she has dried up in the sun, like a dewdrop._  
_Only the silver shoes are left, lying in the grass._  
**The Witch of the North**: The shoes are yours now. They have some magic in them, though nobody ever learned what.  

**Choices**

- **Tell Dorothy to try them on.**
    - **Dorothy**: They fit. They fit exactly, as if they’d been waiting for me.
- **Tell her to be careful with them.**
    - **The Witch of the North**: Wise. A charm is like a dog: best to know what it will do before you take it for a walk.
- **Let your Nubbin sniff the shoes.**
    - Your Nubbin sniffs the shoes, sneezes, and sits on them, as if somebody ought to keep them warm.

#### Done `a15-02-council-done`

**Dorothy**: Thank you. But please, can you help me get back to my Aunt Em and Uncle Henry? They’ll be so worried.  
**The Witch of the North** _(think)_: Ah. That is harder. Let me see.  

### Step 2: Ask the way home, and see what the slate says.

Hint: Watch the Witch of the North’s hat while she counts. · check: `watch:a15-slate:north-hat`

#### Scene `a15-02-slate`

_The Munchkins shake their heads. To the east there is a great desert, they say, and to the south, and to the west._  
**A Munchkin** _(sad)_: And to the north, where she lives, it’s desert too. Nobody crosses. Nobody ever has.  
_Dorothy begins to cry. The Munchkins, to be kind, begin to cry too, and their hat bells tinkle sadly._  
_The Witch of the North takes off her pointed hat, balances it on the tip of her nose, and counts: one, two, three._  
_The hat turns into a slate. On it, in big white chalk letters, it says that Dorothy should go to the City of Emeralds._  
**The Witch of the North**: Are you Dorothy, my dear?  
**Dorothy** _(think)_: Yes.  
**The Witch of the North**: Then the City of Emeralds it is. Oz lives there, the great Wizard. Keep to the road of yellow brick and you can’t go wrong.  
**Dorothy**: Couldn’t you come too?  
**The Witch of the North**: I can’t. But I can give you my kiss. Nobody in all this land would dare to hurt someone I have kissed.  
_She kisses Dorothy on the forehead. Where her lips touch, there is a round, shining mark._  

**Choices**

- **Ask if she’ll kiss you too.**
    - **The Witch of the North**: You are only visiting, dear. Visitors bring their own luck. Mind you share it.
- **Look closely at the mark.**
    - It shines faintly, like a coin at the bottom of a well. Dorothy can’t see it, but everyone else can.
- **Hold your Nubbin up to say goodbye.**
    - The Witch of the North taps your Nubbin once on the nose. It goes cross-eyed with pride, and stays that way some time.

#### Done `a15-02-slate-done`

_Then she spins round three times on her left heel, and is gone. Toto barks at the place where she was._  

### Step 3: Help Boq’s household lay the table for the night.

Hint: Carry the blue dishes from the dresser to the long tables outside. · check: `place:a15-table:boq`

#### Scene `a15-02-boq`

_By evening you have walked a fair way along the road of yellow brick. Dorothy has changed into her clean blue-and-white checked frock._  
_You come to a big house where a rich Munchkin called Boq is giving a feast. Everyone for miles seems to be there._  
**Boq** _(happy)_: Welcome! Welcome, Sorceress! And the Sorceress’s friend! And the Sorceress’s friend’s… whatever that is.  
**Dorothy**: I’m not a Sorceress. I’m Dorothy.  
**Boq**: But you wear silver shoes, and there is white in your frock. Only witches and sorceresses wear white.  
**Dorothy** _(think)_: My frock is blue and white checks.  
**Boq**: Then you are a kind witch. That is the best sort. Now: the tables! Five of them, and every plate must be blue.  
_You carry dishes. Everything is blue: the plates, the cups, the jugs, the napkins, the little iced cakes._  
**Boq**: And where shall the Sorceress’s friend’s whatever-it-is sit?  

**Choices**

- **Next to Toto, at the end.**
    - Your Nubbin and Toto share the end of the bench, and a blue cake, and nobody minds at all.
- **Next to Dorothy, of course.**
    - **Boq**: Of course! A place of honour! Fetch the tall stool!
- **Under the table, where the crumbs land.**
    - **Boq**: Ah, a practical creature. My grandmother was the same.

#### Done `a15-02-boq-done`

_Three Munchkins play fiddles and everyone else dances. Dorothy laughs, for the first time since the cyclone._  

#### Complete `a15-02-complete`

_Boq gives Dorothy his best bed, with blue sheets. She falls asleep at once, with Toto curled at her feet._  
_You sit up a while with Boq on his front step. The yellow road runs off into the dark, glowing faintly._  
**Boq** _(think)_: It is a long way to the City of Emeralds. Many days. Mind the wild parts.  
**Boq**: But she has the Witch’s kiss, and the silver shoes. And she has you, which I suppose is something.  
_Your Nubbin falls asleep beside the silver shoes, one paw on each, as if they might walk off without it._  

**Rewards**


Sets on completion: `{"a15-02":true}`

**Notes:** SOFTENING: the Witch of the East is never seen, only her feet in silver shoes; she "dries up in the sun, like a dewdrop" and is gone between two looks. Nobody celebrates a death: the Munchkins celebrate being free. The slate’s message is described, not quoted (Baum’s wording is not verified). The Witch of the North is an old woman in a white starred gown; she is NOT Glinda and is never named. Munchkin blue everywhere; Boq’s house is round with a domed roof (Denslow).

## A15-3. The Scarecrow

*The Wonderful Wizard of Oz (1900), ch. III–IV: the Scarecrow and the road through the forest* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-2, from Nova’s atlas. · requires: A15-2

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Help lift the Scarecrow down from his pole.

Hint: Climb the fence into the cornfield and hold the pole steady while Dorothy lifts. · check: `climb:a15-pole:cornfield`

#### Scene `a15-03-pole`

_In the morning the road runs past a big field of ripe corn. High on a pole in the middle, keeping the birds off, there is a Scarecrow._  
_His head is a little sack stuffed with straw, with a face painted on it. He wears an old pointed blue hat._  
_As you look at him, he winks: slowly, with his left eye._  
**Dorothy** _(shock)_: Did you see that? I must have dreamed it. Scarecrows in Kansas never wink.  
**The Scarecrow** _(happy)_: Good morning.  
**Dorothy**: Was that you?  
**The Scarecrow**: It was. How do you do? Not very well myself, if you want the truth. It is dreadfully dull, up a pole all day.  
**Dorothy**: Are you stuck up there?  
**The Scarecrow**: Not on my own. There’s a pole up the back of my coat, you see. If you could just lift me off it, I’d be ever so grateful.  
_Dorothy reaches up with both arms. Someone needs to hold the pole steady, or it will go over with him on it._  

**Choices**

- **Hold the pole steady.**
    - You hold the pole. Dorothy lifts him off, and the pole jumps in your hands as if it is glad too.
- **Stand underneath, ready to catch him.**
    - Dorothy lifts him off. He tips, and lands on you, which is like being hit by a large, polite pillow.

#### Done `a15-03-pole-done`

**The Scarecrow** _(happy)_: Thank you. Thank you both. I feel ever so much more like a person, down here.  
_He stretches, yawns, and falls flat on his face. Then he gets up, and falls over sideways._  

### Step 2: Help the Scarecrow find his feet.

Hint: Walk beside him on the yellow bricks and catch him when he tips. · check: `walk:a15-scarecrow:yellow-brick`

#### Scene `a15-03-feet`

_The Scarecrow has never walked before. His legs go wherever they like, and they don’t consult each other first._  
**The Scarecrow**: I was only made the day before yesterday. Before that I was nothing at all, which is restful, but not interesting.  
**Dorothy**: I’m going to the City of Emeralds, to ask the great Oz to send me back to Kansas.  
**The Scarecrow** _(think)_: This Oz. Does he have brains to spare, do you suppose? I’d take any size.  
**The Scarecrow**: Straw arms and legs I don’t mind; they can’t be hurt. But a straw head is another matter. People call you a fool.  
**Dorothy**: I don’t know. But come anyway. If he hasn’t any, you’ll have lost nothing but the walk.  
**The Scarecrow** _(happy)_: So I shall. What a comfort.  
_He steps into a hole in the road and goes full length on the bricks. He isn’t hurt in the least._  
**The Scarecrow**: You see? That is either brains or the lack of them. I can never tell which.  

**Choices**

- **Offer him your arm.**
    - **The Scarecrow**: An arm! The very thing. I shall try very hard not to take it home with me.
- **Walk ahead and call out the holes.**
    - “Hole,” you call, and he steps round it; “hole,” and he steps round; “brick,” and he falls over the brick.
- **Let your Nubbin lead him.**
    - Your Nubbin walks in front, very slowly. The Scarecrow copies every step, and falls over only twice.

#### Done `a15-03-feet-done`

_By noon he can walk a straight line. By afternoon he can very nearly walk a curved one._  

### Step 3: Sit by the road and listen while Dorothy tells him about Kansas.

Hint: Sit with them on the bank while Dorothy eats her bread. · check: `sit:a15-road:bank`

#### Scene `a15-03-kansas`

_You sit down on the bank, and Dorothy shares out her bread. The Scarecrow doesn’t eat, but he likes being passed things._  
**The Scarecrow**: Tell me about your country. Kansas, was it?  
**Dorothy**: It’s all grey. The ground and the house and the sky. Even Aunt Em and Uncle Henry, nearly.  
**The Scarecrow** _(think)_: But here there is green, and birds, and corn. Why would anyone go back to all that grey?  
**Dorothy**: You’d see it differently if you had brains.  
**Dorothy**: No matter how dreary and gray our homes are, we people of flesh and blood would rather live there than in any other country, be it ever so beautiful.  
**Dorothy** _(soft)_: There is no place like home.  
**The Scarecrow** _(think)_: I see. So it is brains that make people go home to grey places. Then Kansas is very lucky you have them.  

**Choices**

- **Tell him what you miss about your own home.**
    - **The Scarecrow**: There you are, then. Everybody with brains has a place somewhere that they’d rather be.
- **Ask him where his home is.**
    - **The Scarecrow**: A pole in a cornfield. I don’t miss it at all. Perhaps that’s how you can tell it wasn’t home.
- **Watch your Nubbin, asleep in Dorothy’s lap.**
    - Your Nubbin is asleep in Dorothy’s lap, and Toto in yours. Nobody has asked them about home; they seem to have found it anyway.

#### Done `a15-03-kansas-done`

_The road goes on, and the fields begin to give way to trees. The Scarecrow walks between you, nearly straight._  

#### Complete `a15-03-complete`

**The Scarecrow**: Shall I tell you a secret? I am afraid of exactly one thing.  
**Dorothy**: Crows?  
**The Scarecrow** _(sad)_: No. Crows are all bluster. Matches. A lighted match.  
_You quietly move your matches to the bottom of your bag, under everything._  
_That night he stands in a corner, since he never gets tired. He watches over you all till morning, and says it is the most useful he has ever felt._  

**Rewards**


Sets on completion: `{"a15-03":true}`

**Learning Grove swaps**

- `a15-03-kansas#5` → Even if home is plain and grey, it’s where my people are. I’d still rather be there than anywhere, however pretty.
- `a15-03-kansas#6` → Nowhere else is home.

**Notes:** LIFTED TEXT: a15-03-kansas#5–6 are Baum’s chapter IV words, verbatim, split at the sentence break (spoken as one speech, two dialogue boxes). Keep "gray" as Baum spelled it. The surrounding exchange is our own: Baum’s own lines for the Scarecrow’s question and reply are not verified and are not used. The Scarecrow’s face is painted on a sack; his hat is a pointed blue Munchkin hat (Denslow). The matches beat sets up nothing; it is a kindness.

## A15-4. The Tin Woodman

*The Wonderful Wizard of Oz (1900), ch. V: the rescue of the Tin Woodman* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-3, from Nova’s atlas. · requires: A15-3

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Follow the groaning sound into the forest.

Hint: Leave the road where the trees are thickest, and listen. · check: `find:a15-woodman:forest`

#### Scene `a15-04-groan`

_In the morning Dorothy goes into the trees to look for water. Not far off, somebody groans._  
**Dorothy** _(shock)_: What was that?  
**The Scarecrow**: I can’t imagine. But we might go and see.  
_In a clearing stands a man made all of tin. His axe is raised over his head, as if he had stopped in the middle of a stroke._  
_He is perfectly still. Beside him a tree is half chopped through, and has been for some time._  
**Dorothy**: Was that you, groaning?  
**The Tin Woodman** _(sad)_: Mm. Mm-hm. I have been groaning for a year or more. You are the first to come and see why.  
_He speaks through his teeth, because his jaw won’t open. His voice comes out like a gate that wants oiling._  
**Dorothy**: What can we do?  
**The Tin Woodman**: Oil. Please. I have rusted solid. There is a can of it on the shelf in my cottage, just through the trees.  

**Choices**

- **Say you’ll fetch it.**
    - **The Tin Woodman**: Thank you. Mind the step. I made it before I was tin, and it has never been level.
- **Ask how it happened.**
    - **The Tin Woodman**: A rainstorm. I was chopping, and it rained, and I forgot to shelter. That is all. It is always all.

#### Done `a15-04-groan-done`

_The cottage is just through the trees. You go, with your Nubbin at your heels._  

### Step 2: Find the oil-can in the Woodman’s cottage.

Hint: Look along the shelf; you want the can with the long thin spout. · check: `find:a15-oilcan:cottage`

#### Scene `a15-04-cottage`

_The cottage is small and very tidy. Everything has been put away by somebody with all the time in the world._  
_There is a bed nobody sleeps in, a table nobody eats at, and a shelf of tins, each with a little dust on top._  
_On the shelf stand three oil-cans: a big square one, a small round one, and a middle one with a long thin spout._  
_Your Nubbin sits under the shelf and looks up, interested, the way it looks at the fruit trees at home._  
_Behind the door a picture is pinned up: a Munchkin girl, drawn in pencil, smiling at someone outside the frame._  
_Under it someone has written a name, crossed it out, and written it again._  

**Choices**

- **Take the one with the long spout.**
    - The long spout will reach right into the joints. You tuck the can under your arm, and it sloshes, comfortably full.
- **Take the big square one, to be sure.**
    - The big one is empty, and the one with the spout is full. You take that one instead, and feel you have learned something.
- **Look at the picture a little longer.**
    - She has a kind, untidy face. Somebody drew it very carefully, a long time ago.
    - You take the can with the long spout, and go.

#### Done `a15-04-cottage-done`

_You run back through the trees. The Woodman hasn’t moved, because he can’t, but his eyes are glad to see you._  

### Step 3: Oil the Woodman’s joints, in the right order.

Hint: Start with whatever lets him speak; then whatever is tiredest. · check: `puzzle:a15-joints:woodman`

#### Scene `a15-04-oil`

**Dorothy**: Where shall we start?  
**The Tin Woodman** _(sad)_: Mm. Mmm-m.  
**The Scarecrow**: I think he says “neck”. Though I may only think so because I haven’t any brains.  
_The neck is rusted so badly that Dorothy has to work the head from side to side while you oil._  
_At last it turns. The Woodman moves his head, very carefully, as if it might come off._  
**The Tin Woodman**: Thank you. Now my arms, please. I have held this axe up for a year, and I should very much like to put it down.  
_You oil the arms. They creak, then give, and he lowers the axe and leans it against the tree with a great sigh._  
**The Tin Woodman**: That is a great comfort. And now…  

**Choices**

- **Do his legs.**
    - You oil his legs, one joint at a time, until he can walk. He takes three steps, then three more, for the pleasure of it.
- **Give his jaw another drop first.**
    - **The Tin Woodman**: Ah. Yes. Much better. I hadn’t liked to ask.
    - Then you do his legs, and he takes three steps for the pleasure of it.
- **Oil everything you can find, twice.**
    - You oil him from top to toe, twice. He shines like a new kettle.
    - **The Tin Woodman**: I may slip over. But I shall slip over very smoothly.

#### Done `a15-04-oil-done`

**The Tin Woodman** _(soft)_: Another year and I’d have been a statue. I am more obliged to you than I can say.  

#### Complete `a15-04-complete`

**The Tin Woodman**: May I ask why you are in the great forest?  
**Dorothy**: We’re going to the City of Emeralds, to see the great Oz. I want to go home, and the Scarecrow wants some brains.  
**The Tin Woodman** _(think)_: This Oz. Might he have a heart he could spare?  
_He taps his chest. It rings, hollow, like an empty pail._  
**The Tin Woodman** _(sad)_: I had one once. I was a man, and I loved a Munchkin girl. Then my axe was enchanted, and I lost myself a piece at a time.  
**The Tin Woodman** _(sad)_: The tinsmith made me new pieces, one after another. But he never made a heart, and without one I forgot how to love her.  
**The Scarecrow**: I shall still ask for brains. A heart is no use to somebody who can’t think what to do with it.  
**The Tin Woodman**: And I shall ask for a heart. A clever man can be miserable. I would rather be happy, and a heart is how.  
_Dorothy puts the oil-can into your hands. From now on, it seems, it is yours to carry._  

**Rewards**


Sets on completion: `{"a15-04":true}`

**Notes:** PUZZLE (puzzle:a15-joints:woodman): oil neck, then arms, then legs. Any other order still works but the Woodman says so, politely, one line each (sim may pick from: "Not the legs first, please; I should walk off with my arms in the air."). The step can’t be failed. The OIL-CAN is a prop from here to A15-20: show it at your hip on this page only (Atlas save). The enchanted axe is told in one line and never shown; no cutting is described. The pencil girl behind the door is the Munchkin girl he loved; nothing more is made of her.

## A15-5. The Cowardly Lion

*The Wonderful Wizard of Oz (1900), ch. VI–VII: the Cowardly Lion, and the beetle* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-4, from Nova’s atlas. · requires: A15-4

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Walk on through the deep forest.

Hint: Stay together on the yellow bricks; the woods are darker here. · check: `walk:a15-forest:deep`

#### Scene `a15-05-roar`

_The road runs into thick woods. It is dim under the trees, and now and then something growls a long way off._  
_Your Nubbin walks so close to your boots that you keep treading on it._  
_Then comes a terrible roar, and out of the trees bounds a great Lion._  
_One blow of his paw sends the Scarecrow spinning to the side of the road. His claws strike the Woodman, and only scratch the tin._  
_Little Toto runs at the Lion, barking. The Lion opens his great mouth._  
_Dorothy rushes forward and smacks the Lion on the nose, as hard as she can._  
**Dorothy** _(angry)_: Leave him alone! You great bully, picking on a little dog. You ought to be ashamed!  
**The Cowardly Lion** _(sad)_: I didn’t bite him.  
_The Lion rubs his nose with his paw where Dorothy hit it. His eyes are filling up._  

**Choices**

- **Stand still. Your Nubbin is behind your boots.**
    - Your Nubbin is pressed flat behind your heels, shaking. You don’t move, so that it has something to hide behind.
- **Go and pick up the Scarecrow.**
    - You set the Scarecrow on his feet and pat him back into shape.
    - **The Scarecrow**: Thank you. Is the Lion still there? I couldn’t see, being upside down.

#### Done `a15-05-roar-done`

**Dorothy**: No, but you meant to frighten him, which is nearly as bad.  
**The Cowardly Lion** _(sad)_: I know. I’ve always known. Knowing doesn’t help.  

### Step 2: Let your Nubbin decide about the Lion, in its own time.

Hint: Sit down on the roadside and wait. Don’t pull your Nubbin forward. · check: `sit:a15-lion:roadside`

#### Scene `a15-05-sit`

_The Lion sits down in the road and wipes his eyes with the tip of his tail. He looks very large, and very miserable._  
**The Cowardly Lion**: A lion is meant to be brave. King of Beasts, and all that. So I roar, and everyone runs away.  
**The Cowardly Lion** _(sad)_: But if anything ever stood up to me, I should run myself. I can’t help it.  
**The Tin Woodman**: Perhaps there is something wrong with your heart.  
**The Cowardly Lion** _(sad)_: Perhaps there is.  
**The Tin Woodman** _(sad)_: Then be glad of it. Something wrong with a heart means there is a heart. I haven’t even that.  
_Your Nubbin comes out from behind your boots a little at a time: one paw, then its nose, then the rest of it._  
_It walks across the road, stops, thinks about going back, and doesn’t. Then it sits down beside the Lion, against his foreleg._  
**The Cowardly Lion** _(soft)_: Oh. Oh, look. It isn’t afraid of me.  

**Choices**

- **Tell him it’s just as frightened as he is.**
    - **The Cowardly Lion**: Is it? And it came over anyway? Well. Well, I never.
- **Say nothing. Let them sit.**
    - You say nothing. The Lion doesn’t move a whisker, in case your Nubbin changes its mind.

#### Done `a15-05-sit-done`

**Dorothy**: We’re going to the great Oz. He’ll give the Scarecrow brains, and the Woodman a heart.  
**The Cowardly Lion** _(think)_: Would he have any courage to spare, do you think? For a lion?  
**Dorothy**: I should think he has a cupboard full. Come with us.  

#### Complete `a15-05-complete`

_So you all go on together, the Lion walking beside Dorothy with great dignity, and Toto not at all sure about it._  
_Later the Woodman steps on a beetle by accident, and is so sorry that tears run down his face._  
_The tears run into the hinges of his jaw, and in a moment his jaw has rusted shut._  
**The Tin Woodman** _(sad)_: Mm. Mmm!  
_You have the oil-can. You do his jaw while the Scarecrow holds his hat._  
**The Tin Woodman** _(sad)_: Thank you. Having no heart, I must take great care never to be unkind to anything. I must watch where I step.  
_After that he walks looking down at the road, and steps over every ant._  

**Rewards**


Sets on completion: `{"a15-05":true}`

**Notes:** THE NUBBIN AND THE LION: the slow approach in a15-05-sit#6–7 is the page’s quiet heart. Animate it in real time (about five seconds), with no music. The roar knocks the Scarecrow over and scratches the Woodman: no wounds. Dorothy’s smack is a flat-handed tap on the nose; the Lion is more hurt in his feelings. The Lion’s design is a big, shaggy, sad-eyed lion after Denslow; no film costume, no bow in his mane.

## A15-6. The Kalidahs

*The Wonderful Wizard of Oz (1900), ch. VII: the journey to the great Oz* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-5, from Nova’s atlas. · requires: A15-5

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Cross the first ditch on the Lion’s back.

Hint: Climb on when the Lion crouches; hold his mane and don’t look down. · check: `climb:a15-lion:first-ditch`

#### Scene `a15-06-ditch`

_The road comes to a ditch, right across it, wide and very deep. At the bottom are big jagged rocks._  
**The Scarecrow**: Well, we can’t fly, and I don’t fancy climbing down. So it’s jump it or stay put.  
**The Cowardly Lion** _(think)_: I might… I might be able to jump that.  
**The Scarecrow**: Then you’re our bridge! One at a time, on your back.  
**The Cowardly Lion**: Well, I’ll try. Who will go first?  
**The Scarecrow**: I will. If you jumped short, I shouldn’t mind much, being straw. The rest of you would.  
**The Cowardly Lion** _(sad)_: I’m frightened of heights, you know. And of ditches. But I’ll try.  

**Choices**

- **Go second, with your Nubbin in your coat.**
    - You go second, with your Nubbin buttoned into your coat. The Lion leaps, and for a moment there is nothing under you at all.
- **Go last, after Dorothy.**
    - You go last. By then the Lion has the knack of it, and lands like a cat coming down off a wall.

#### Done `a15-06-ditch-done`

**The Cowardly Lion** _(shock)_: There. That was very frightening. I shall have to sit down.  
_He sits, panting. Your Nubbin climbs out of your coat and sits beside him, panting too, to keep him company._  

### Step 2: Keep watch at the back as the wood grows darker.

Hint: Walk last and listen for growls among the trees. · check: `watch:a15-forest:kalidahs`

#### Scene `a15-06-watch`

_On this side the forest is darker still. Strange noises come out of the trees, deep and rumbling._  
**The Cowardly Lion** _(shock)_: Those are the Kalidahs. They live in this part of the forest.  
**Dorothy**: What are Kalidahs?  
**The Cowardly Lion**: Great beasts with bodies like bears and heads like tigers, and long, long claws. I am more afraid of them than of anything.  
_You walk at the back. Every time a twig snaps, your Nubbin checks behind you, and then behind itself._  
_Soon the road comes to another ditch. This one is so wide that the Lion knows at once he cannot jump it._  
**The Tin Woodman**: There is a tall tree here by the edge. If I chop it so that it falls across, we can walk over.  
**The Scarecrow** _(happy)_: A bridge! That is just the sort of thing I shall think of myself, once I have brains.  

**Choices**

- **Keep listening to the trees.**
    - You keep listening. The rumbling has stopped, which is worse than the rumbling.
- **Help the Woodman choose the tree.**
    - You pick the straightest tree. The Woodman agrees, and sets his axe to it.

#### Done `a15-06-watch-done`

_The tree begins to creak. Behind you, in the dark wood, something else begins to move._  

### Step 3: Help bring the tree down across the ditch, then hurry everyone over.

Hint: Pull the rope when the Woodman shouts; cross quickly and don’t stop on the trunk. · check: `build:a15-bridge:second-ditch`

#### Scene `a15-06-bridge`

_You loop a rope round the top of the tree. When the Woodman shouts, you and the Lion pull, and it falls with a crash across the ditch._  
_You are just starting over when there is a sharp growl behind you. Two great beasts are running out of the trees._  
**The Cowardly Lion** _(shock)_: The Kalidahs!  
**The Scarecrow**: Quick! Get across!  
_Dorothy goes first, with Toto in her arms, then the Woodman, then the Scarecrow. You go with your Nubbin under your arm._  
_The Lion goes last. On the far side he turns and gives a roar so terrible that the Scarecrow falls over backwards._  
_The Kalidahs stop short. Then they see that they are bigger than the Lion, and that there are two of them, and they come on._  
**The Cowardly Lion** _(angry)_: Stand behind me, all of you. I’ll hold them as long as I can.  
**The Scarecrow** _(shock)_: Wait! The tree! Chop the tree!  

**Choices**

- **Stand beside the Lion.**
    - You stand by the Lion with your knees shaking, and his are shaking too. You can both feel it.
- **Pull Dorothy back from the edge.**
    - You pull Dorothy back from the edge and hold on to her sleeve. She holds on to yours.

#### Done `a15-06-bridge-done`

_The Woodman swings his axe. Just as the Kalidahs are halfway over, the tree splits, and falls into the gulf, beasts and all._  
_Nobody looks down. After a while, the Lion lets out a long breath._  
**The Cowardly Lion** _(shock)_: Well. That was very nearly the end of me, and I didn’t care for it at all.  

#### Complete `a15-06-complete`

_The trees thin out. In the afternoon you come to a broad river, running fast; on the far side the yellow road goes on through meadows._  
**The Scarecrow**: We must make a raft. Woodman, you cut the logs. I shall stand here and think about it.  
_The Woodman starts chopping. Your Nubbin finds a patch of sun on the bank and lies in it, flat as a pancake._  
**The Cowardly Lion** _(think)_: That was brave of you, standing by me. You were shaking, though.  
**You**: So were you.  
**The Cowardly Lion** _(soft)_: Yes. I noticed. But we both stayed, didn’t we?  

**Rewards**


Sets on completion: `{"a15-06":true}`

**Notes:** SOFTENING: Baum’s Kalidahs are "dashed to pieces" on the rocks. Here the tree splits and falls "beasts and all", the camera stays on the friends’ faces, and nobody looks down: no sound of landing. The Kalidahs are drawn bear-bodied and tiger-headed, big and shaggy rather than gory; no blood, no teeth close-ups. The Lion’s roar makes the Scarecrow fall over backwards, which is the beat’s small joke.

## A15-7. The River and the Stork

*The Wonderful Wizard of Oz (1900), ch. VII–VIII: the raft, and the Stork* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-6, from Nova’s atlas. · requires: A15-6

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Stork (The Stork (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Tie the logs into a raft.

Hint: Bind each log to the next with a double knot; your Nubbin will hand you the ends. · check: `build:a15-raft:river`

#### Scene `a15-07-raft`

_By morning the Woodman has cut enough logs. He pegs them together, and you tie every join twice, to be sure._  
**The Tin Woodman**: I don’t know any knots. I was a woodman. Woodmen only know how to make things fall down.  
_Your Nubbin holds the rope ends in its mouth and hands them to you one at a time, very solemnly._  
_The Scarecrow cuts poles to push the raft along. He cuts one for himself, very long, and is proud of it._  
**The Cowardly Lion**: I shall sit in the middle and keep very still. It’s what I’m best at.  
**Dorothy**: Where did you learn your knots?  

**Choices**

- **From your gran. She tied up everything.**
    - **Dorothy**: Mine are Aunt Em’s. She ties the bread-cloth so tight you need a knife to get in.
- **From a book with pictures in it.**
    - **The Scarecrow**: A book! Brains come in books, I’ve heard. Perhaps I could stuff one in.
- **Your Nubbin taught you. It chews them.**
    - Your Nubbin, hearing this, chews the next knot. You tie it again.

#### Done `a15-07-raft-done`

_The raft floats. Everyone climbs aboard, and it sinks a little under the Lion, and comes up again._  

### Step 2: Ride the raft across, and get everyone ashore.

Hint: Hold on in the middle; when the Lion swims, hold the Woodman’s belt. · check: `wait:a15-raft:current`

#### Scene `a15-07-current`

_At first the raft goes well. Then, in the middle, the current takes it and carries it downstream, away from the yellow road._  
**The Scarecrow** _(shock)_: We’re going the wrong way! This river runs west, to the Wicked Witch’s country!  
_The Scarecrow pushes his long pole into the river bottom as hard as he can. It sticks fast in the mud._  
_Before he can pull it out, the raft is swept away from under him. He is left clinging to the top of the pole, in the middle of the river._  
**The Scarecrow** _(sad)_: Goodbye!  
**Dorothy** _(sad)_: Oh, the poor Scarecrow!  
**The Cowardly Lion**: We must do something. I can swim. Hold on to my tail, Woodman, and I’ll pull us to the bank.  
_The Lion jumps in. The Woodman holds his tail, you hold the Woodman’s belt, and the Lion swims with all his strength._  

**Choices**

- **Shout to the Scarecrow that you’ll come back.**
    - **The Scarecrow**: Thank you! I shan’t go anywhere! I can’t!
- **Hold your Nubbin out of the spray.**
    - You hold your Nubbin up out of the spray. It watches the Scarecrow the whole way, until he is a dot.

#### Done `a15-07-current-done`

_At last you reach the bank, far downstream. Everyone is soaked, and you oil the Woodman at once._  
**Dorothy**: Now we must walk back up the bank and find him.  

### Step 3: Wave down the Stork and ask her to fetch the Scarecrow.

Hint: Walk back up the bank until you see the pole, then signal the big bird overhead. · check: `talk:a15-stork:riverbank`

#### Scene `a15-07-stork`

_You walk back along the bank a long way. At last you see him, sitting on his pole in the middle of the river, very lonely._  
**Dorothy** _(sad)_: He’s too far out. Nobody could swim to him now.  
_The Lion and the Woodman sit down on the bank. The Woodman is very near tears, and you get the oil-can ready._  
**The Tin Woodman** _(sad)_: I would give a great deal to have him back. I had no friends at all, before this week.  
_A big Stork is flying over, quite low, looking for fish._  
_Your Nubbin sees her first, and stands up on its back legs._  

**Choices**

- **Wave both arms at the Stork.**
    - You wave both arms. The Stork tilts, circles, and lands on the bank beside you, folding up like an umbrella.
- **Whistle as loud as you can.**
    - You whistle. The Stork wheels round to see what bird could make such a dreadful noise, and lands beside you.
- **Hold your Nubbin up so she can see it.**
    - You hold your Nubbin up. The Stork comes down for a closer look, decides it isn’t a fish, and stays to talk.

#### Done `a15-07-stork-done`

**The Stork**: Well? What’s all this waving about?  
**Dorothy**: I’m Dorothy, and these are my friends. That’s our friend the Scarecrow, out there on the pole.  
**The Stork**: Is he heavy? I can’t carry anything heavy. I dropped a goose once and I have never heard the end of it.  
**Dorothy**: He’s only straw. He weighs hardly anything.  
**The Stork**: Then I’ll try. But if he’s heavier than he looks, back in the river he goes.  

#### Complete `a15-07-complete`

_The Stork flies out over the water, takes the Scarecrow by the arm in her long claws, and carries him back to the bank._  
**The Scarecrow** _(happy)_: I was beginning to think I’d spend the rest of my life on a stick. Again!  
_He hugs everybody, even the Lion and Toto. He hugs you twice, and your Nubbin once, carefully._  
**The Scarecrow**: When I’ve got my brains, I’ll come back and think of something splendid to do for you.  
**The Stork** _(happy)_: Don’t mention it. I’ve a nest full of chicks to get back to, and they will not stop shouting.  
_She flies away. The Scarecrow waves until she is gone, and then a little longer._  

**Rewards**


Sets on completion: `{"a15-07":true}`

**Notes:** The river is never dangerous to you or Dorothy on screen: the raft drifts, nobody falls in but the Lion, who means to. The Scarecrow on his pole is the comic picture of the page (Denslow drew it). The Stork is a talking animal in Oz and may speak; she is brisk and motherly.

## A15-8. The Poppy Field and the Field Mice

*The Wonderful Wizard of Oz (1900), ch. VIII–IX: the deadly poppy field, and the Queen of the Field Mice* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-7, from Nova’s atlas. · requires: A15-7

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Queen of the Field Mice (The Queen of the Field Mice (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Carry your Nubbin out of the poppies.

Hint: Hold your breath where the flowers are thickest and head for the green beyond. · check: `carry:a15-nubbin:poppies`

#### Scene `a15-08-poppies`

_The road leads you through meadows of flowers, yellow and white and blue. Then, ahead, a great field of scarlet poppies._  
_Their smell is very strong and very sweet. Dorothy breathes it in, and yawns._  
**Dorothy** _(soft)_: I think I’ll sit down for a minute. Just one minute.  
**The Tin Woodman** _(shock)_: Don’t sit down! The smell of these flowers sends you to sleep, and you sleep and sleep and nobody can wake you.  
_But Dorothy’s eyes close, and she sinks down among the poppies. Toto lies down beside her._  
_Your Nubbin walks slower and slower. It lies down with its nose in a red flower, and is gone._  
_You feel it too: a heaviness in your arms and legs, as if the page itself wanted you to lie down._  
**The Cowardly Lion** _(shock)_: Run, all of you! I’ll go as fast as I can, and wait for you on the other side.  
**The Scarecrow**: The Woodman and I don’t breathe, so we can carry Dorothy and Toto. You carry your Nubbin, Keeper. Quick!  

**Choices**

- **Hold your breath and run.**
    - You hold your breath, scoop up your Nubbin, and run until your chest burns.
- **Breathe through your sleeve and walk steadily.**
    - You breathe through your sleeve and put one foot in front of the other, and don’t look at how far it is.

#### Done `a15-08-poppies-done`

_You come out on to grass at the edge of the field. Your Nubbin sneezes and wakes up, very cross about it._  
_The Lion is lying asleep among the poppies, a long way back. He very nearly made it._  
**The Scarecrow** _(sad)_: We can do nothing for him. He is much too heavy to lift.  

### Step 2: Watch over Dorothy by the river, out of the poppies.

Hint: Stay on the grass by the river bank, where the breeze is fresh. · check: `watch:a15-wildcat:meadow`

#### Scene `a15-08-wildcat`

_You lay Dorothy on the grass by the river, where the fresh breeze can wake her._  
_A low growl, and a great yellow wildcat comes bounding through the grass, chasing something small and grey._  
_It is a little field mouse, running for her life. The wildcat is gaining on her with every bound._  
_The Woodman, though he has no heart, knows it is wrong for the big one to catch the small one. He lifts his axe._  
_One swing, and the wildcat will never chase anything again._  
_The Woodman doesn’t look at where it lies. He looks at the mouse._  
**The Queen of the Field Mice**: Oh, thank you! Thank you! I thought that was the end of me.  
**The Tin Woodman**: Please don’t mention it. I have no heart, you see, so I try to help anyone who needs a friend. Even a mouse.  
**The Queen of the Field Mice** _(shock)_: A mouse? I am the Queen. The Queen of every Field Mouse there is!  
_Out of the grass come mice, dozens of mice, then hundreds, all running and squeaking to their Queen._  

**Choices**

- **Bow to the Queen.**
    - **The Queen of the Field Mice**: Thank you. Most people don’t, at my size. It is very hard to be a Queen at my size.
- **Make sure your Nubbin keeps still.**
    - Your Nubbin keeps perfectly still, with a mouse on its head. It has decided this is an honour.
- **Ask if the mice can help the Lion.**
    - **The Queen of the Field Mice**: A Lion? In the poppies? A friend of yours? He would not… eat us?

#### Done `a15-08-wildcat-done`

**The Scarecrow** _(happy)_: Oh! I have thought of something! A great many mice. And the Lion!  
**The Queen of the Field Mice**: A Lion? Won’t he eat us?  
**The Scarecrow**: Not he. He’s a coward. Also he’s asleep. Also he’s our friend.  

### Step 3: Tie a string to every mouse.

Hint: Take a string from the pile, loop it gently round a mouse, and pass the other end to the Woodman. · check: `craft:a15-strings:cart`

#### Scene `a15-08-strings`

**The Scarecrow**: Woodman, make us a cart with wheels, out of these trees. Your Majesty, tell all your people to bring a long piece of string.  
_The Woodman chops and pegs. In an hour he has made a low cart, with wheels cut from a tree trunk._  
_The mice arrive in their thousands, each with a piece of string: big mice and little mice and middle-sized mice._  
**The Scarecrow**: Now: one string round each mouse, very loose. Round the middle, not the neck. They must be comfortable.  
_So you tie: loop, knot, next mouse; loop, knot, next mouse._  
_Your Nubbin hands you the strings, and the Woodman ties the other ends to the cart._  
**The Queen of the Field Mice**: Mind the little one at the end. She is very young and very proud of being asked.  
_At last every string is tied. The mice stand in long rows in front of the cart, like a great grey carpet with whiskers._  

**Choices**

- **Count the mice.**
    - You get to four hundred and twelve, then a mouse moves and you have to start again. You decide “a great many” will do.
- **Tie the little one’s string last, with a bow.**
    - **The Queen of the Field Mice**: A bow! She will be impossible now. Thank you.

#### Done `a15-08-strings-done`

_The Scarecrow and the Woodman go into the poppies, without breathing, and roll the sleeping Lion on to the cart._  
_Then the Queen gives the word, and the mice pull, thousands of them together, and the heavy cart begins to move._  

#### Complete `a15-08-complete`

_They haul the Lion out of the poppies and on to the green grass, where the air is fresh. Then you untie every mouse._  
_Dorothy wakes up on the bank. She hears the whole story, and thanks every mouse she can reach._  
**The Queen of the Field Mice**: You have only to call us. Come out into the fields and call, and we shall come running. We are quick, for our size.  
_Much later the Lion wakes up. He is very glad to be alive, and very surprised to hear how._  
**The Cowardly Lion** _(shock)_: Mice? Mice carried me? Little mice?  
_Your Nubbin climbs up and lies down between his ears, very pleased with itself, as if it did most of the pulling._  

**Rewards**


Sets on completion: `{"a15-08":true}`

**Notes:** SOFTENING: Baum’s Woodman cuts off the wildcat’s head. Here it is one swing, cut away before it lands; the next shot is the Woodman looking at the mouse. Nothing lies on screen. The poppies are the danger, but sleep is shown as plain sleep: Dorothy, Toto, your Nubbin and the Lion are all clearly breathing. The mice’s strings go round their middles, loosely (Baum ties them round the neck). The Keeper is a visitor and feels the poppies slowly; the step can’t be failed.

## A15-9. The Green Spectacles

*The Wonderful Wizard of Oz (1900), ch. X–XI: the Guardian of the Gate, and the Emerald City* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-8, from Nova’s atlas. · requires: A15-8

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Guardian of the Gates (The Guardian of the Gates (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The Soldier with the Green Whiskers (The Soldier with the Green Whiskers (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Follow the yellow road to the great green gate.

Hint: Walk on until the sky itself looks green, then ring the bell by the gate. · check: `walk:a15-road:emerald-gate`

#### Scene `a15-09-gate`

_The fences by the road are painted green now, and so are the houses. Even the light seems a little green._  
**The Scarecrow**: That must be the Emerald City.  
_Ahead there is a green glow in the sky. Then a great high wall, bright green, and a gate studded with emeralds._  
_There is a bell beside the gate. Dorothy pushes the button, and a silvery tinkle sounds inside._  
_The gate swings slowly open. You all go through into a high arched room, glittering with green._  
_Before you stands a little man, about the size of a Munchkin. He is dressed in green from head to foot, and even his skin is faintly green._  
**The Guardian of the Gates**: And what brings you to the Emerald City?  
**Dorothy** _(think)_: Please, we’d like to see the Great Oz.  
**The Guardian of the Gates** _(shock)_: To see Oz? Nobody has asked that in years. He is powerful and terrible, and a foolish errand might make him very angry.  

**Choices**

- **Say it isn’t a foolish errand.**
    - **The Scarecrow**: Foolish? Certainly not. Important. Very. And we hear he’s a good Wizard, besides.
- **Say you’ve all come a very long way.**
    - **The Guardian of the Gates**: Everybody has, to get here. It’s a long way from everywhere. That’s rather the point of it.
- **Let your Nubbin answer, its own way.**
    - Your Nubbin walks up to the Guardian and sits on his foot. He looks down at it, and seems a little less worried.

#### Done `a15-09-gate-done`

**The Guardian of the Gates**: Then you’ll want to see him. But spectacles first. Nobody goes in without spectacles.  

### Step 2: Let the Guardian lock the green spectacles on you, and on your Nubbin.

Hint: Sit still while he buckles them; your Nubbin will want to watch you go first. · check: `inspect:a15-spectacles:gate`

#### Scene `a15-09-spectacles`

**Dorothy**: Why?  
**The Guardian of the Gates**: Because the City is so bright and so glorious that it would blind you without them. Everyone wears them. Even the people who live here.  
**The Guardian of the Gates**: They are locked on. Oz ordered it so when the City was first built, and I have the only key.  
_He opens a big box. It is full of spectacles of every size and shape, and every one has green glass in it._  
_He fits a pair on Dorothy, and on the Scarecrow, and the Woodman, and the Lion. He even finds a little pair for Toto._  
_Two gold bands go round the back of each head, and lock together with a key he wears on a chain round his neck._  
**The Guardian of the Gates** _(think)_: And for… whatever this is.  
_He hunts through the box a long time. At last he finds a very small pair with round lenses, and fits them on your Nubbin._  
_Then yours. The gold bands click shut behind your ears._  
_Everything is green: the walls, the floor, your own hands. Your Nubbin looks up at you, green, through its little green lenses._  

**Choices**

- **Ask why they have to be locked.**
    - **The Guardian of the Gates**: Because Oz said so. That is the best sort of reason. It saves everybody a great deal of thinking.
- **Check that your Nubbin is all right.**
    - Your Nubbin turns its head left, then right, then looks at you for a long time, as if to make sure you are still you.

#### Done `a15-09-spectacles-done`

_The others look at one another through green glass, and nobody asks why._  
_It is easier, somehow, not to._  

### Step 3: Walk through the streets of the Emerald City.

Hint: Follow the Guardian through the streets to the Palace in the middle. · check: `explore:a15-city:streets`

#### Scene `a15-09-streets`

_Even through green spectacles the City dazzles you. The streets are lined with fine houses, set with emeralds._  
_The people are dressed in green, and their skin looks green too. They stare at the Lion, and the children hide behind their mothers._  
_A man is selling green lemonade. A boy is selling green popcorn, and the children pay for it with green pennies._  
**The Scarecrow** _(think)_: Everything is green. I wonder why.  
**Dorothy**: It’s the Emerald City. It’s meant to be green.  
**The Scarecrow**: Of course. Of course it is.  
_Everyone looks happy and contented and well off. Nobody looks up very much._  

**Choices**

- **Buy your Nubbin a green lemonade.**
    - Your Nubbin drinks it all and looks up for more.
    - Whether the lemonade is really green, you’ll never know. The spectacles don’t come off.
- **Look up at the towers.**
    - The towers are green against a green sky. It is very beautiful, and it gives you a slight headache.

#### Done `a15-09-streets-done`

_At last you come to a great building in the middle of the City: the Palace of Oz, the Great Wizard._  

#### Complete `a15-09-complete`

_At the door stands a soldier in a green uniform, with a long green beard that reaches to his knees._  
**The Soldier with the Green Whiskers** _(think)_: You wish to see the Great Oz. I shall tell him you are here.  
_He goes in, and is gone a long time. You all stand in the green hall, on a green carpet, under a green ceiling._  
**The Soldier with the Green Whiskers**: Oz will see you. But one at a time, and one each day.  
**The Soldier with the Green Whiskers**: Until then you may each have a room in the Palace, with a green bed, and a green bath, and green books.  
_Your room has a little green fountain in it. Your Nubbin sleeps in the basin, with its spectacles on._  

**Rewards**


Sets on completion: `{"a15-09":true}`

**Notes:** GREEN SPECTACLES (screen tint): from a15-09-spectacles#8 to A15-10’s complete, and again from A15-13’s complete to A15-16’s complete, the whole page is drawn through a green tint, your Nubbin included. "Nobody asks why" is the point: only the player can ask, and the answer is no answer. The Emerald City art is lavish and green; its people are cheerful and incurious. No film Emerald City (no Art Deco towers, no Horse of a Different Colour).

## A15-10. Oz, the Great and Terrible

*The Wonderful Wizard of Oz (1900), ch. XI: the Wonderful City of Oz* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-9, from Nova’s atlas. · requires: A15-9

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), Oz (Oz, the Great and Terrible: the Wizard, a balloonist from Omaha (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Go into the Throne Room with Dorothy.

Hint: Walk in behind Dorothy, stand where the Soldier puts you, and keep still. · check: `escort:a15-dorothy:throne-room`

#### Scene `a15-10-head`

_In the morning the Soldier comes for Dorothy. She holds on to your sleeve, and he looks at you, and lets you come._  
_The Throne Room is big and round, with a high arched roof. Walls, ceiling and floor are covered in emeralds, set close together._  
_In the middle is a big throne of green marble. On it, with no body to hold it up, is an enormous Head._  
_It has no arms or legs at all. Its eyes turn slowly, and look at Dorothy, and then at you._  
**Oz** _(angry)_: I am Oz, the Great and Terrible. Speak. What do you want of me?  
**Dorothy**: I’m Dorothy. I’m nobody very much. I’ve come to ask for your help.  
**Oz**: Those silver shoes. How did you come by them?  
**Dorothy**: From the Wicked Witch of the East. My house fell on her.  
**Oz**: And the mark on your forehead?  
**Dorothy**: The Witch of the North kissed me there. Please, I want to go back to Kansas, to Aunt Em and Uncle Henry.  
**Oz** _(think)_: Then you must do something for me first. Nothing is free here. You must earn it.  

**Choices**

- **Hold Dorothy’s hand.**
    - Dorothy’s hand is cold, and holds on tight. The Head watches you both, and doesn’t blink.
- **Look at the Head very carefully.**
    - You look carefully. The eyes move, and the mouth.
    - It is a very good Head, almost too good.

#### Done `a15-10-head-done`

**Oz**: Rid the land of the Wicked Witch of the West. Put an end to her. Then I will send you home.  
**Dorothy** _(sad)_: But I can’t! I’ve never hurt anything on purpose in my whole life.  
**Oz**: You have my answer. Until the Witch is gone, you will not see your Aunt and Uncle again. Go.  

### Step 2: Hear what Oz looked like to the others.

Hint: Wait in the green hall each day and talk to whoever comes out. · check: `talk:a15-friends:green-hall`

#### Scene `a15-10-reports`

_The next day it is the Scarecrow’s turn. He comes out of the Throne Room looking dazed, and sits down on the floor._  
**The Scarecrow**: He wasn’t a Head. He was a lovely Lady in green silk gauze, with wings. She said I should have brains when the Witch was gone.  
_The day after, the Woodman goes in. He comes out walking very carefully, the way he does when he has been frightened._  
**The Tin Woodman** _(shock)_: He was not a Lady. He was a terrible Beast, nearly as big as an elephant, with five eyes and five arms and woolly hair all over.  
**The Tin Woodman** _(sad)_: He said the same. The Witch, first. Then a heart.  
**Dorothy** _(think)_: He was a Head when I went in.  
**The Scarecrow**: Then which is he really?  

**Choices**

- **Say he might be all of them.**
    - **The Scarecrow**: All of them? That is a great deal of Wizard. I should be quite worn out, being so many things.
- **Say he might be none of them.**
    - Everyone goes quiet.
    - **The Tin Woodman**: None of them? Then what is in there?
- **Say you’ll know when the Lion has been.**
    - **The Cowardly Lion**: Me? Oh. Oh, dear. I’d forgotten it was me tomorrow.

#### Done `a15-10-reports-done`

**The Cowardly Lion** _(think)_: I shall roar at him. Then he’ll have to give me what I ask. Or I shall run away. It could go either way.  

### Step 3: Wait outside the Throne Room while the Lion goes in.

Hint: Stand by the door with the others and watch the light under it. · check: `wait:a15-lion:throne-door`

#### Scene `a15-10-fire`

_On the third day the Lion goes in. The door shuts behind him with a click._  
_You wait outside with the others. Under the door there is a line of light, and it is getting brighter, and redder._  
_Then the heat comes, so strong that the Woodman takes a step back and the Scarecrow takes three._  
**The Scarecrow** _(shock)_: Mind the door. Mind the door, please. I am very dry.  
_The door bursts open and the Lion comes out at a gallop, with his tail between his legs._  
**The Cowardly Lion** _(shock)_: A Ball of Fire! He was a Ball of Fire, so hot I couldn’t look at it!  
**The Cowardly Lion**: I tried to go nearer and it singed my whiskers. So I came out. Quite quickly, as you saw.  
_Your Nubbin runs to him and pats out a small smoking place on the end of his tail._  

**Choices**

- **Look at his whiskers.**
    - Three whiskers are curled at the ends, like the corners of an old letter. Later he is rather proud of them.
- **Ask what the Ball of Fire said.**
    - **The Cowardly Lion**: Exactly what he said to all of you. The Witch, first. Then courage. Then everything.

#### Done `a15-10-fire-done`

**The Cowardly Lion**: He’s the same, whatever he looks like. He wants the Witch gone, and he wants us to do it.  

#### Complete `a15-10-complete`

_That night you all sit in the green hall and talk it over. Nobody wants to go, and nobody can see another way._  
**Dorothy** _(sad)_: I suppose we must try. But I don’t want to hurt anybody. Not even her.  
**The Cowardly Lion**: I’ll come. I shall be too frightened to be much use. But I’ll come.  
**The Scarecrow**: I shall come too. I shan’t be much use either, being such a fool.  
**The Tin Woodman**: I haven’t the heart to harm even a Witch. But if you go, I must go with you.  
_In the morning the Guardian unlocks your spectacles and puts them back in his box. He points west, where there is no road at all._  

**Rewards**


Sets on completion: `{"a15-10":true}`

**Notes:** SOFTENING: Oz’s price is "rid the land of her; put an end to her" (Baum: kill her). Dorothy’s reply keeps the book’s point, that she has never hurt anything on purpose. THE FOUR FORMS: Dorothy and you see the Head (a huge bald head on the throne, no body); the others report the Lady, the Beast and the Ball of Fire, and only the Ball of Fire is shown, as light and heat under the door. All four are the Wizard’s stagecraft; play them as theatre: grand, a little too grand. You are let in with Dorothy as her companion; the Soldier says nothing about it.

## A15-11. The Witch of the West

*The Wonderful Wizard of Oz (1900), ch. XII: the search for the Wicked Witch* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-10, from Nova’s atlas. · requires: A15-10

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Wicked Witch of the West (The Wicked Witch of the West, one eye, an umbrella (L. Frank Baum, The Wonderful Wizard of Oz, 1900); NOT the film's green witch), The King of the Winged Monkeys (The King of the Winged Monkeys (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Keep watch while the Witch sends her creatures.

Hint: Stay close to the others; when you see the next wave coming, call it. · check: `watch:a15-witch:west`

#### Scene `a15-11-waves`

_The country to the west is rough and hilly, with no farms and no houses. Everything there is yellow, the Winkies’ colour._  
_The Wicked Witch of the West has only one eye, but it sees as far as a telescope. From her castle door she sees you all._  
_She blows a silver whistle. Out of the far hills comes a pack of great wolves, running hard._  
_You see them first, because you are keeping watch. The Woodman goes to stand in front of the rest of you, with his axe._  
_When the sun comes up, none of the wolves will ever trouble anyone again. You don’t look long._  
_Next she sends a flock of wild crows. The Scarecrow stands up with his arms stretched out, and when it is over the sky is empty._  
_Then a swarm of black bees. The Scarecrow pulls out his own straw and covers Dorothy, Toto, the Lion, you and your Nubbin with it._  
_The bees find only the Woodman, who is tin. Their stings break on him, and that is the end of the bees._  
_Last she sends a dozen Winkie soldiers with spears. The Lion gives one great roar, and they run all the way home._  
_Far away in her castle, the Witch stamps her foot._  
**The Wicked Witch of the West** _(angry)_: Then I shall use the Cap. There is nothing else left.  

**Choices**

- **Help stuff the Scarecrow again.**
    - **The Scarecrow**: Thank you. I feel quite myself. A bit lumpy round the middle, but that is how I like it.
- **Pick the straw out of your Nubbin’s fur.**
    - Your Nubbin has straw in its ears and its fur and its mouth. It seems to like the taste.

#### Done `a15-11-waves-done`

_In the Witch’s cupboard is a Golden Cap with a ring of diamonds round it. Whoever owns it may call the Winged Monkeys three times._  
_She has used it twice already. She puts it on, stands on one foot and then the other, and says the words._  

### Step 2: Hold on to Dorothy when the Winged Monkeys come.

Hint: Don’t run. Hold Dorothy’s hand and keep your Nubbin close. · check: `wait:a15-monkeys:sky`

#### Scene `a15-11-monkeys`

_The sky darkens, and there is a great rushing of wings. A band of Monkeys comes down out of the sky, each with a pair of huge wings._  
**The King of the Winged Monkeys** _(sad)_: Sorry about this. We have no choice in it. That is the whole trouble with us.  
_Some of them seize the Woodman, fly high over a rocky place, and drop him. He lies there dented and battered, and can’t move._  
_Others catch the Scarecrow and pull out all his straw. His hat and boots and clothes go into the top of a tall tree._  
_The rest throw ropes round the Lion, lift him up, and fly off with him towards the Witch’s castle._  
_Then the King flies down at Dorothy with his long arms out, and stops._  
**The King of the Winged Monkeys**: Stop! The mark of the Good Witch, on her forehead. We can’t touch her. Nor anyone holding her hand.  
_You are holding her hand, and hadn’t known you were._  
_Your Nubbin is holding on to your boot._  

**Choices**

- **Hold on tighter.**
    - You hold on tighter. The Monkeys lift the three of you, very gently, as if you were eggs.
- **Shout to the Scarecrow that you’ll come back.**
    - Up in the tree the Scarecrow’s hat nods, or the wind does it. You decide it was the Scarecrow.

#### Done `a15-11-monkeys-done`

_The Monkeys carry you over the hills to the Witch’s castle, set you down at the door, and fly away._  
**The Wicked Witch of the West** _(think)_: Hm. The Good Witch’s mark. And the silver shoes.  
_For a moment the Witch looks afraid. Then she looks into Dorothy’s eyes, and sees that the girl has no idea what the shoes can do._  
**The Wicked Witch of the West** _(happy)_: She doesn’t know. Look at her. She hasn’t the least idea.  

### Step 3: Bring the Lion food in secret, as Dorothy does.

Hint: When the Witch is asleep, carry what you saved from supper out to the yard. · check: `feed:a15-lion:yard`

#### Scene `a15-11-yard`

**The Wicked Witch of the West** _(angry)_: You! Girl! Clean the pots, sweep the floor, and keep the fire fed. And you, whatever you are, help her.  
_So you work in the Witch’s kitchen with Dorothy._  
_The Witch doesn’t dare touch her, because of the mark, so she shouts instead._  
_Out in the yard the Lion is shut behind a gate. The Witch means to harness him like a horse, to pull her carriage._  
_Every time she comes near, he roars so loud that she jumps back._  
**The Wicked Witch of the West** _(angry)_: Then you shall have nothing to eat until you do as I say.  
_So every night, when the Witch is asleep, Dorothy carries food to the Lion from the cupboard. You keep watch at the kitchen door._  
_Tonight it is your turn to carry it. Your Nubbin follows you out across the dark yard, on its softest feet._  

**Choices**

- **Bring him the bread you saved from supper.**
    - **The Cowardly Lion**: Bread. Lovely. You must have gone hungry for this.
- **Bring him a bowl of the Witch’s own stew.**
    - **The Cowardly Lion**: Her own stew? From her own pot? That is the bravest thing I ever saw.
- **Bring the food, then stay and sit with him.**
    - You sit with your back against his side. He is warm, and he purrs, very quietly, in case the Witch hears.

#### Done `a15-11-yard-done`

**The Cowardly Lion** _(sad)_: How shall we ever get away? Is there any way at all?  
**Dorothy**: I don’t know. But we’ll find one. Somebody always does.  

#### Complete `a15-11-complete`

_Days go by. The Witch watches the silver shoes all the time with her one eye, and wants them more than anything._  
_Dorothy only takes them off at night, and for her bath._  
_The Witch is afraid of the dark, and more afraid of water, so she never comes near either._  
_You sweep the floor round the bucket by the kitchen door. Nobody ever empties it._  

**Rewards**


Sets on completion: `{"a15-11":true}`

**Notes:** SOFTENING (care notes): Baum’s forty wolves, forty crows and the bees all die on the page, the wolves and crows by the Woodman’s axe and the Scarecrow’s hands. Here each wave is one narrator line that ends the danger and looks away: the Woodman stands in front (cut to dawn), the Scarecrow stretches his arms (cut to empty sky), the bees break their stings on tin. No bodies, no sound effects of harm. The Winkies just run. The Winged Monkeys are rough but never cruel on screen: the Scarecrow is scattered (comic), the Woodman dented (no damage close-up), the Lion roped. THE WITCH: one eye, an umbrella, plaits, after Denslow; ordinary skin; she is cross and greedy and a little afraid, never cackling. The yard beat (feed:a15-lion:yard) is one secret meal; it is not a nightly chore for the player.

## A15-12. The Bucket of Water

*The Wonderful Wizard of Oz (1900), ch. XII–XIII: the bucket, and the rescue* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-11, from Nova’s atlas. · requires: A15-11

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Wicked Witch of the West (The Wicked Witch of the West, one eye, an umbrella (L. Frank Baum, The Wonderful Wizard of Oz, 1900); NOT the film's green witch), A Winkie (A Winkie tinsmith (L. Frank Baum, The Wonderful Wizard of Oz, 1900); a fairy-tale people in yellow)

### Step 1: See the Witch’s trick, and try to warn Dorothy.

Hint: Sweep near the middle of the kitchen floor; something there isn’t right. · check: `inspect:a15-bar:kitchen`

#### Scene `a15-12-bar`

_One morning the Witch is in a very good mood. She hums, and doesn’t shout once._  
_In the middle of the kitchen floor she has laid an iron bar, and by her magic made it so nobody can see it._  
_You don’t see it. But your Nubbin stops and sniffs at a place on the floor where there is nothing, and won’t walk over it._  
_Dorothy comes in with the pail, humming too, because it seems to be catching._  
**The Wicked Witch of the West** _(happy)_: Fetch me the wood, girl. Quickly now. Straight across the floor. Don’t mind me.  
_Dorothy starts across the floor, and you see your Nubbin’s ears go flat._  

**Choices**

- **Call out to Dorothy to stop.**
    - You call out. Dorothy turns to look at you, steps backwards, and falls over the bar.
- **Kneel and feel the floor where your Nubbin is sniffing.**
    - Your hand finds cold iron where there is nothing to see. Before you can say so, Dorothy walks straight into it.

#### Done `a15-12-bar-done`

_Dorothy trips and falls flat, and one silver shoe comes off._  
_Before she can reach it, the Witch has snatched it up and put it on her own thin foot._  
**The Wicked Witch of the West** _(happy)_: Ha! One silver shoe. Half a charm is a great deal better than none.  

### Step 2: Stand clear while Dorothy throws the bucket.

Hint: Step back from the doorway, and mind your Nubbin’s feet. · check: `watch:a15-bucket:kitchen`

#### Scene `a15-12-bucket`

**Dorothy** _(angry)_: Give me back my shoe!  
**The Wicked Witch of the West** _(happy)_: Certainly not. It’s mine now. Finders keepers.  
**Dorothy** _(angry)_: It isn’t yours! You’ve no right to it! You’re a mean, wicked old thing!  
**The Wicked Witch of the West** _(happy)_: Shout all you like, girl. I’ll have the other one off you too, one fine day.  
_Dorothy is so angry that she picks up the bucket of water by the door and throws it over the Witch, from head to foot._  
_The Witch gives a gasp. Then, as Dorothy stares at her, she begins to shrink._  
**The Wicked Witch of the West** _(shock)_: Water! Oh, you wretched girl, water! I’m going, I’m going…  
**Dorothy** _(shock)_: I’m sorry! I didn’t know!  
_She melts quickly and quietly, like sugar in hot tea. In a moment there is only a brown puddle on the floor, and her empty dress._  

**Choices**

- **Hold your Nubbin back from the puddle.**
    - Your Nubbin very much wants to sniff the puddle. You don’t let it.
- **Go to Dorothy.**
    - **Dorothy**: I didn’t know. I didn’t know it would do that.
    - You stand with her a moment. She is shaking a little, and so is the bucket in her hand.

#### Done `a15-12-bucket-done`

_Dorothy picks the silver shoe out of the puddle, dries it, and puts it back on._  
_Then she pours a fresh bucket over the puddle and sweeps it all out of the door._  
**Dorothy**: She’s gone. She’s really gone. Now the Lion can come in.  

### Step 3: Help the Winkies mend the Woodman and restuff the Scarecrow.

Hint: Go with the Winkies to the rocks and the tall tree; carry straw back for the Scarecrow. · check: `craft:a15-friends:mend`

#### Scene `a15-12-mend`

_Dorothy lets the Lion out of the yard. Then she calls all the Winkies together and tells them they are free._  
**A Winkie** _(shock)_: Free? No more working for her? Not ever?  
_The Winkies hold a feast day and dance, all in yellow. It is their colour, as blue is the Munchkins’._  
**Dorothy**: Now, please, can you help us find our friends?  
**A Winkie**: We have tinsmiths. The best in the land. Show us where the tin man fell.  
_You lead them to the rocks. The Woodman lies there, badly dented, with his axe rusted and its blade broken._  
_The tinsmiths work for three days and four nights, hammering and soldering and polishing, until he is straight again._  
_Then you all go to the tall tree where the Scarecrow’s clothes are caught. The Woodman chops it down with his new axe._  
_You stuff the clothes with clean, fresh straw. Your Nubbin packs it in, very hard, with its paws._  

**Choices**

- **Oil the Woodman’s new joints.**
    - **The Tin Woodman**: Ah. Thank you. They made me splendid, but they forgot I am a person who needs oiling.
- **Give the Scarecrow an extra handful of straw.**
    - **The Scarecrow**: Oh! I feel so plump and important. As if I might have a thought at any moment.

#### Done `a15-12-mend-done`

**The Scarecrow** _(happy)_: There. Am I myself again? It feels like me.  
_He is himself, and the Woodman is himself, and the Lion is purring. Dorothy laughs, then cries, then laughs again._  

#### Complete `a15-12-complete`

_Before you leave, Dorothy goes to the Witch’s cupboard to fill her basket. On the shelf she finds the Golden Cap._  
**Dorothy**: It’s very pretty. And it fits. I’ll wear it instead of my sunbonnet.  
_She doesn’t know what it does, and neither, exactly, do you. It sits on her head, glittering, waiting._  
**A Winkie** _(happy)_: And this is for your little one. We made it in the night.  
_It is a tiny gold cap, beaten thin, with glass beads round the band for diamonds. It fits your Nubbin exactly._  
**A Winkie**: It doesn’t call anything. It’s just a hat. But it’s a very good hat.  
_The Winkies ask the Woodman to stay and rule them. He says he will come back, once he has a heart._  

**Rewards**

- Golden Cap (Nubbin hat) (cosmetic): A tiny beaten-gold cap with a band of glass beads, made by the Winkie tinsmiths. It has no calls left in it, and never had any.

Sets on completion: `{"a15-12":true}`

**Notes:** SOFTENING (care notes): the melting is quick, quiet and not frightening: the Witch shrinks like sugar in tea, says one line, and is a small puddle and an empty dress within two seconds. No screaming, no smoke, no face close-up. Dorothy is sorry; nobody cheers her death, only their freedom. REWARD: the Golden Cap hat (cosmetic) is granted at the complete scene, one time. It is gold-coloured tin, not the real Cap, which stays with Dorothy and goes to Glinda in A15-20.

## A15-13. The Golden Cap

*The Wonderful Wizard of Oz (1900), ch. XIV: the Winged Monkeys* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-12, from Nova’s atlas. · requires: A15-12

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Queen of the Field Mice (The Queen of the Field Mice (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The King of the Winged Monkeys (The King of the Winged Monkeys (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The Guardian of the Gates (The Guardian of the Gates (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Read the words inside the Golden Cap.

Hint: Turn the Cap over and read the lining aloud; it tells you which foot to stand on. · check: `puzzle:a15-cap:lining`

#### Scene `a15-13-lost`

_Going back east there is no road. You walk towards the rising sun, but the grass all looks the same, and soon you are lost._  
**The Scarecrow** _(think)_: I have no brains, so I can’t help. But it seems to me we have passed that bush three times.  
_Days go by. The Lion is hungry, and the Woodman has stopped talking to save his oil._  
**Dorothy**: I know! The Queen of the Field Mice!  
_Dorothy calls, the way the Queen told her. In a minute a great many little feet come pattering through the grass._  
**The Queen of the Field Mice**: Friends! What do you need?  
**Dorothy**: We’re lost. Which way is the Emerald City?  
**The Queen of the Field Mice** _(think)_: Miles and miles. But you’re wearing the Cap that calls the Winged Monkeys. Didn’t you know? They could fly you there before lunch.  
_Dorothy turns the Cap over and hands it to you. You are the one who reads the signs, and this seems to be a sign._  
_Inside the band are three odd words, and small instructions about which foot to stand on. They look like nonsense, which is how charms look._  

**Choices**

- **Read the words out for her, slowly.**
    - You read them slowly. Dorothy says them after you, standing on her left foot, then her right, then both.
- **Let your Nubbin stand on one foot too.**
    - Your Nubbin stands on one foot, falls over, stands on the other, and falls over again. Dorothy laughs in the middle of the charm.

#### Done `a15-13-lost-done`

_A great chattering and flapping, and the band of Winged Monkeys lands all round you._  
**The King of the Winged Monkeys** _(think)_: First call. What is it you want?  
**Dorothy**: Please, carry us to the Emerald City. We’ve lost our way.  

### Step 2: Fly to the Emerald City, and listen to the Monkey King.

Hint: Hold on to the King as he carries you; ask him something, or let him be. · check: `talk:a15-monkey-king:flight`

#### Scene `a15-13-flight`

_Two Monkeys make a chair of their hands for Dorothy. Others take the Scarecrow and the Woodman, and a whole team takes the Lion._  
_The King carries you himself, with your Nubbin held tight. The ground goes by far below, like a green and yellow blanket._  
**Dorothy** _(think)_: Why do you have to do what the Cap says?  
**The King of the Winged Monkeys** _(sad)_: It’s a long story. But we have a long way to go, so I will tell it.  
**The King of the Winged Monkeys**: We were free, once. The forest was ours. We went where we liked and ate what we found, and nobody gave us orders.  
**The King of the Winged Monkeys**: There was a princess, a sorceress, called Gayelette. She was to marry a young man named Quelala, the best and wisest in the land.  
**The King of the Winged Monkeys**: One day my grandfather, who was King then, saw Quelala walking by the river in fine clothes. He thought it would be funny.  
**The King of the Winged Monkeys**: We dropped him in the river. He climbed out laughing, but Gayelette did not laugh at all.  
**The King of the Winged Monkeys** _(sad)_: So she bound us to the Golden Cap. Whoever owns it may call us three times, and we must obey.  
**The King of the Winged Monkeys** _(sad)_: We have been called ever since. We go where we are sent, and carry what we are told, and drop what we are told.  

**Choices**

- **Ask what they would do, if they were free.** — sets `{"a15-cap":"asked"}`
    - **The King of the Winged Monkeys**: Free?
    - **The King of the Winged Monkeys**: I don’t know. Nobody has ever asked. I shall have to think about it.
    - He flies on in silence. Every so often you see him look up at the sky, as if it had changed.
- **Say nothing. Listen to the wind.** — sets `{"a15-cap":"silent"}`
    - You say nothing. The King flies on, and the wind takes his story away behind you, over the fields.

#### Done `a15-13-flight-done`

_The Monkeys set you all down at the gate of the Emerald City, bow once, and fly away fast._  
**The Scarecrow** _(happy)_: Now that is how to travel. No ditches at all.  

#### Complete `a15-13-complete`

_The Guardian of the Gates is very surprised to see you. He looks at you all twice, as if counting._  
**The Guardian of the Gates** _(shock)_: You went to see the Wicked Witch of the West. And you came back?  
**The Scarecrow**: Melted, with a bucket. Dorothy did it.  
**The Guardian of the Gates** _(happy)_: Melted? Truly? Well, well, well.  
_He opens his big box and locks the green spectacles on you all again. The gold bands click shut behind your ears._  
_Your Nubbin holds still for its pair without being asked. It has got used to the world being green._  

**Rewards**


Sets on completion: `{"a15-13":true}`

**Notes:** SIGNATURE CHOICE (a15-13-flight): a15-cap = asked | silent. It pays off in A15-20’s ending, seven quests later: if asked, the King answers "Play." when Glinda frees him, his band loops over the castle, and a feather falls for your Nubbin (the Monkey Feather reward), and if you also pocketed the lamb his band flies you to the china wall. If silent, they simply fly away. THE CHARM: Baum’s three charm words are not quoted (not verified); the lining is drawn with three squiggly words the player can’t quite read. The Queen of the Field Mice answers Dorothy’s call (Baum gives Dorothy a whistle in ch. IX; a call does the same here). This is Dorothy’s first call of three; the Witch’s calls were her own.

## A15-14. The Humbug

*The Wonderful Wizard of Oz (1900), ch. XV: the discovery of Oz, the Terrible* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-13, from Nova’s atlas. · requires: A15-13

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), Oz (Oz, the Great and Terrible: the Wizard, a balloonist from Omaha (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Go into the Throne Room together, all of you.

Hint: Stand together in the middle of the room, and keep your eyes open. · check: `visit:a15-throne:together`

#### Scene `a15-14-voice`

_Oz keeps you waiting four days. On the fifth, the Scarecrow sends word that the Winged Monkeys might be asked their opinion._  
_You are let in at once, all of you together._  
_There is no Head, no Lady, no Beast and no Ball of Fire: only the empty throne, and a hush._  
**Oz**: I am Oz, the Great and Terrible. Why have you come?  
_The voice comes from near the top of the great dome. It seems to come from everywhere at once._  
**Dorothy**: We’ve come for what you promised us. The Wicked Witch is gone.  
**Oz** _(shock)_: Is she really gone?  
**Dorothy**: Yes. I melted her with a bucket of water.  
**Oz**: Goodness. Melted. Well… give me a day. I shall need a little time to think it over.  
**The Tin Woodman** _(angry)_: You have had weeks to think!  
**The Scarecrow** _(angry)_: Not one more day. Not one.  
**The Cowardly Lion** _(think)_: I think… I think I should roar now.  

**Choices**

- **Tell the Lion to go on, then.**
    - The Lion gives a roar so loud and fierce that Toto jumps away from him in alarm, and runs off into a corner.
- **Let go of your Nubbin.**
    - Your Nubbin, let go, runs after Toto, who has run off barking at a corner of the room.

#### Done `a15-14-voice-done`

_Toto tips over a screen that stands in the corner. It falls with a crash._  
_Behind it stands a little old man, with a bald head and a wrinkled face. He looks as surprised as anybody._  

### Step 2: Hear the little man out.

Hint: Stand still and let him talk; he’s more frightened than you are. · check: `talk:a15-oz:screen`

#### Scene `a15-14-screen`

_The Woodman raises his axe and rushes at the little man._  
**The Tin Woodman** _(angry)_: Who are you?  
**Oz** _(shock)_: I… I am Oz. The Great. And the… please, put that down. Please. I’ll do whatever you like.  
**Dorothy**: But you were a Head! A great big Head!  
**The Scarecrow**: You were a Lady, with wings.  
**The Cowardly Lion**: You were on fire!  
**Oz** _(sad)_: All of those were me, and none of them were. It was pretending, you see. All pretending.  
**The Scarecrow** _(shock)_: Then you’re a humbug!  
**Oz** _(sad)_: Yes. A humbug. That is quite the right word for it.  
**Oz**: I was born in Omaha. I was a ventriloquist, which means I can throw my voice. Into a bird, or a statue, or a dome.  
**Oz**: Then I went up in balloons at the circus, to draw the crowds. One day the ropes got twisted, and I couldn’t come down.  
**Oz**: I came down here, out of the clouds, and the people thought I was a great Wizard. It was green, mostly, so I called it the Emerald City.  
**Oz** _(sad)_: Then I had to make the name come true. So I gave everybody spectacles. Green ones. Locked on. It was only a small lie, to begin with.  

**Choices**

- **Touch the gold band behind your ear.**
    - The City is green because you are wearing green. It was never very much else.
- **Look at your Nubbin, in its little green lenses.**
    - Your Nubbin looks back at you through two green circles. It has never once seen this place as it really is.

#### Done `a15-14-screen-done`

**Oz** _(sad)_: I’m not a wicked man, my dear. Truly I’m not. I’m only a very poor Wizard. There’s a difference, though I grant it’s small.  
**Oz** _(sad)_: And I was frightened of the Witches. All of them, all along. That’s why the walls are so high.  
_Somebody in the valley promises things like this._  
_Safe, he says. As if it came in a bottle._  

### Step 3: Decide whether to keep his secret.

Hint: He’s asking you, of all of them. Answer him. · check: `choose:a15-oz:secret`

#### Scene `a15-14-secret`

_Dorothy and the others have gone to the far side of the room to talk it over in angry whispers. The little man turns to you._  
**Oz**: You haven’t said anything. You’re from somewhere else, aren’t you? I can always tell. I was from somewhere else once.  
**Oz**: Please don’t tell anyone outside this room. The people here are happy. They think they are safe, because I am here.  
**Oz**: If they knew, they would be frightened. And then they would be very angry with me, and that would frighten me.  
_He looks very old and very small, like someone who has been holding his breath for years._  
**Oz** _(think)_: I’ll do my best for your friends, I promise. I am good at making people feel better. It’s nearly the same thing.  

**Choices**

- **Promise to keep his secret.**
    - **Oz**: Thank you. Thank you. You don’t know what that is, to someone like me.
    - He shakes your hand. His hand is warm and damp, the hand of a frightened man.
- **Tell him it isn’t yours to keep. It’s theirs.**
    - **Oz**: Theirs. Yes. I suppose it is. I suppose it always was.
    - He doesn’t argue. He looks almost relieved, the way people do when the worst has been said out loud.
- **Say nothing, and look at the screen.**
    - You look at the screen on the floor, and so does he. Neither of you says anything for quite a long time.

#### Done `a15-14-secret-done`

**Oz**: Come to me in the morning, all of you. I shall have something for each of you. I always do.  

#### Complete `a15-14-complete`

**Dorothy**: But how will I get home to Kansas?  
**Oz**: Ah. Kansas. That one will take some thinking. Give me a few days. I’ll find a way, I promise.  
**The Scarecrow**: And my brains?  
**Oz**: Tomorrow. Brains, a heart and courage. Come in the morning, one at a time.  
**The Cowardly Lion** _(think)_: But you’re only a humbug. How can a humbug give anybody anything?  
**Oz** _(think)_: You’d be surprised. Most of what people want, they only want to be told they have.  
_Going out, you stand the screen back up in its corner. It seems kinder, somehow, than leaving it on the floor._  

**Rewards**


Sets on completion: `{"a15-14":true}`

**Notes:** CORVIN READ (Grove flag `corvin`, read-only, at the moment a15-14-screen-done plays). The scene shown is the DEFAULT: `corvin` unset (chapter 9 not reached) or any value other than the three below (the Collector route). For reconciled play ATLAS_A15_VARIANTS a15-14-screen-done-reconciled; for bargained, a15-14-screen-done-bargained; for forced, a15-14-screen-done-forced. Each keeps the Wizard’s two lines and changes only the two narrator lines after them (the outline’s words, split at a sentence break). Hold a beat (one second, no music) before the narrator lines. LIFTED TEXT: none here; passages 3 and 4 are told in our own words (A14_POOR_WIZARD#0, a15-14-screen#11–12). The secret choice sets no flag; it is the player’s own. The screen is a plain folding screen. The Wizard is a little bald man in an ordinary coat (Denslow); NO film curtain, no booth of levers.

## A15-15. The Magic Art

*The Wonderful Wizard of Oz (1900), ch. XVI: the magic art of the Great Humbug* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-14, from Nova’s atlas. · requires: A15-14

**Cast:** The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), Oz (Oz, the Great and Terrible: the Wizard, a balloonist from Omaha (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Help Oz mix the Scarecrow’s brains.

Hint: Measure out the bran, then hand Oz the pins and needles, points away from you. · check: `craft:a15-brains:bran`

#### Scene `a15-15-brains`

_In the morning the Scarecrow goes in first. Oz asks for an assistant, and looks at you._  
**Oz**: Sit there, if you please. I’m afraid I shall have to take your head off. Only for a minute. Brains go in at the top.  
**The Scarecrow** _(happy)_: Take it off by all means. I hardly use it.  
_Oz unpins the Scarecrow’s head and takes out the straw. Then he fetches a sack of bran from the back room._  
**Oz**: Now. A measure of bran. Then pins and needles, for sharpness. Hand me those, will you? Points away from you.  
_You hand him pins and needles a pinch at a time. He stirs them into the bran with a wooden spoon._  

**Choices**

- **Suggest a few more pins, to be safe.**
    - **Oz**: More pins. Yes. He’ll be very sharp. Sharp is good in a Scarecrow; it keeps the crows thoughtful.
- **Ask what the spoon is for.**
    - **Oz**: For stirring. And for looking busy. Most of magic is looking busy, my dear.
- **Watch your Nubbin, who is eating the bran.**
    - Your Nubbin eats a mouthful of bran, makes a face, and doesn’t try any more brains.

#### Done `a15-15-brains-done`

_Oz fills the Scarecrow’s head with the mixture and packs straw round it to hold it in. Then he pins the head back on._  
**Oz** _(happy)_: There. Bran-new brains. You will be a very great thinker now.  
**The Scarecrow** _(happy)_: I feel wise. Very wise. There is a bump on my head, and that is the brains.  

### Step 2: Help Oz make the Woodman’s heart.

Hint: Hold the silk heart steady while Oz stuffs it with sawdust. · check: `craft:a15-heart:silk`

#### Scene `a15-15-heart`

_Next comes the Woodman. Oz takes a pair of tinsmith’s shears and cuts a small square hole in the left side of his chest._  
**The Tin Woodman** _(think)_: Will it hurt?  
**Oz**: Not at all. You won’t feel a thing. That’s rather the trouble you came about, isn’t it?  
_From a chest of drawers Oz takes a pretty heart, made all of silk. You hold it steady while he stuffs it with sawdust._  
**The Tin Woodman** _(think)_: It is very beautiful. But will it be kind?  
**Oz**: The kindest I have in stock.  
_He puts it in the Woodman’s chest, puts back the square of tin, and solders it, very neatly._  

**Choices**

- **Put your ear to the Woodman’s chest.**
    - You listen. There is a soft rustle in there, like someone turning over in bed, and the Woodman holds very still.
- **Polish the patch where the hole was.**
    - **The Tin Woodman**: Thank you. I should like it to show. A heart ought to show a little, I think.

#### Done `a15-15-heart-done`

**The Tin Woodman** _(happy)_: I feel it. I am sure I feel it. Thank you, thank you.  
**Oz** _(think)_: Don’t mention it. Please. Really, don’t.  

### Step 3: Pour out the Lion’s courage.

Hint: Hold the green dish while Oz pours from the square green bottle, then pass it to the Lion. · check: `give:a15-lion:courage`

#### Scene `a15-15-courage`

_Last comes the Lion. Oz takes down a square green bottle from a high shelf, and you hold the dish while he pours._  
_It is green, and it fizzes a little. It smells of nothing at all._  
**The Cowardly Lion** _(think)_: What is it?  
**Oz**: Courage. Or it will be, once it’s inside you. That’s where courage lives. Out here in the dish, it’s only green.  
**The Cowardly Lion** _(sad)_: I’ve been afraid all the way here. Of the Kalidahs, the river, the Witch. Of everything.  
**Oz** _(soft)_: Of course you have. Every creature facing danger is afraid. Brave is going on anyway, and you’ve done that the whole way.  
**Oz**: But drink it anyway. It’s a very nice green.  

**Choices**

- **Hand the Lion the dish.**
    - You hold the dish out. The Lion looks at it, and at you, and drinks it to the bottom.
- **Let your Nubbin carry it over.**
    - Your Nubbin carries the dish over in its mouth, very carefully, spilling only a little. The Lion drinks the rest.

#### Done `a15-15-courage-done`

**The Cowardly Lion** _(happy)_: Oh! I feel… I feel very full of something. Courage, I expect.  

#### Complete `a15-15-complete`

_Your friends go out into the green hall: the Scarecrow thinking hard, the Woodman listening to his chest, the Lion walking very tall._  
_Everyone feels better. You can see it from here._  
**Oz** _(sad)_: What else could I do? They ask me for things nobody in the world can give.  
**Oz**: So I give them something else, and tell them it’s the thing. And it works, mostly. Bran, and sawdust, and green water.  
_You watch them through the doorway, happy, all three, with what they had all along._  
_You wonder whether it matters that it is bran, and you aren’t sure._  
_Your Nubbin leans on your leg. It isn’t sure either._  
**Oz** _(sad)_: Dorothy will be harder. You can’t fill a girl’s head with bran and tell her she’s in Kansas.  

**Rewards**


Sets on completion: `{"a15-15":true}`

**Notes:** LIFTED TEXT: none. Passage 5 (the Wizard on courage) is told in our own words at a15-15-courage#5. "Bran-new" is Baum’s one-word pun, used as a word only. THEME: the quest is the page’s quiet turn, comfort that only looks like the real thing, and the player is left wondering; nobody answers it. Play the complete without music. The green drink is plainly a drink; it is never called medicine.

## A15-16. The Balloon

*The Wonderful Wizard of Oz (1900), ch. XVII–XVIII: how the balloon was launched, and away to the South* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-15, from Nova’s atlas. · requires: A15-15

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), Oz (Oz, the Great and Terrible: the Wizard, a balloonist from Omaha (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Soldier with the Green Whiskers (The Soldier with the Green Whiskers (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The King of the Winged Monkeys (The King of the Winged Monkeys (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The Guardian of the Gates (The Guardian of the Gates (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Help sew the great green balloon.

Hint: Hold the silk strips straight while Dorothy sews the seams. · check: `craft:a15-balloon:silk`

#### Scene `a15-16-sew`

_On the third day Oz sends for Dorothy. He has thought of a way, he says: he came here in a balloon, and he will leave in one._  
**Oz** _(happy)_: And I’ll come too. I’ve had enough of humbugging. A circus would suit me better; at least everyone knows the clown is a clown.  
**Dorothy**: Oh! Shall we really go home?  
**Oz**: We shall make a balloon of silk and fill it with hot air. Hot air I have plenty of. It’s the silk we need.  
_So for three days you sit with Dorothy and sew strips of green silk together, while Oz cuts them out._  
_You hold the strips straight while Dorothy sews._  
_Your Nubbin sits in the pile of offcuts like an egg in a green nest._  
**Oz**: Then a coat of glue inside, to keep the air in. And a big clothes-basket to sit in.  

**Choices**

- **Ask Dorothy to show you her stitch.**
    - **Dorothy**: Aunt Em taught me. Small and even, she says. Small and even, and don’t pull.
- **Test the clothes-basket with your Nubbin.**
    - Your Nubbin climbs in, turns round three times, and goes to sleep. The basket seems to work.
- **Ask Oz if he has ever steered one.**
    - **Oz**: Steered? My dear, nobody steers a balloon. You go where the wind likes. That is how I got here.

#### Done `a15-16-sew-done`

_At last the balloon is finished: more than twenty feet long, green as everything else, and shining with glue._  

### Step 2: See the balloon off from the Palace yard.

Hint: Stand by the ropes in front of the Palace, and keep an eye on Toto. · check: `watch:a15-balloon:launch`

#### Scene `a15-16-launch`

_Word goes round the City that the Great Oz is going up into the clouds. Everybody comes to see._  
_The Woodman has built a fire. Oz holds the bottom of the balloon over it, and the hot air fills it out._  
**Oz** _(happy)_: Good people! I am off to call on a brother Wizard in the clouds. The Scarecrow will rule while I’m gone. Be good to him.  
**The Scarecrow** _(happy)_: Me? Oh. Well. I do have the brains for it now.  
_The balloon swells and tugs against its ropes. Oz climbs into the basket._  
**Oz** _(shock)_: Dorothy! Quickly! It won’t wait!  
**Dorothy** _(shock)_: I can’t find Toto anywhere!  
_Toto has run into the crowd, barking at a kitten. Dorothy runs after him, catches him, and runs back._  
_Oz is holding out his hands to help her in. Then, crack: the ropes give way, and the balloon rises without her._  

**Choices**

- **Run after the trailing rope.**
    - You run after the trailing rope, and jump, and miss it by a long way. It goes up past the roofs.
- **Catch Dorothy before she falls.**
    - Dorothy stumbles, and you catch her. Toto is still in her arms, looking very pleased with himself.

#### Done `a15-16-launch-done`

**Dorothy** _(sad)_: Wait! Wait for me! Oh, come back!  
**Oz** _(sad)_: I can’t steer it! I never could! Goodbye, my dear! Goodbye!  
_The green balloon goes up over the green towers, and gets smaller._  
_Then smaller. Then it is gone._  

### Step 3: Ask about the way south, now the balloon has gone.

Hint: Go with Dorothy to the Palace, where the Scarecrow now sits, and listen to the Soldier. · check: `talk:a15-soldier:south`

#### Scene `a15-16-south`

_Dorothy cries for a long time. Then she wipes her eyes and puts on the Golden Cap._  
**Dorothy**: The Monkeys could carry me over the desert. I’ll use the second call.  
_She says the words, on her left foot and her right. The Monkeys come down into the Palace garden._  
**Dorothy**: Please. Fly me to Kansas.  
**The King of the Winged Monkeys** _(sad)_: We can’t. Our wings stop where Oz stops. The desert is the end of us as much as it is of you.  
**The King of the Winged Monkeys** _(sad)_: I’m sorry. That is a call gone for nothing. I wish it weren’t so.  
_They fly away. Dorothy sits down on the steps, and Toto licks her face._  
**The Scarecrow**: Let us ask the Soldier with the green whiskers. He has been here all along, and may know something.  
**The Soldier with the Green Whiskers**: You might try Glinda. She is the Good Witch of the South, and stronger than any of the others. The Quadlings are her people.  
**The Soldier with the Green Whiskers**: She lives right at the edge of the desert. If anyone knows the way over, she will.  
**Dorothy**: Then I’ll go to Glinda.  

**Choices**

- **Say you’ll go with her.**
    - **Dorothy**: Will you? Oh, thank you. I don’t think I could start again on my own.
- **Look round at the others.**
    - Nobody needs to be asked. The Lion is already standing up.

#### Done `a15-16-south-done`

**The Cowardly Lion**: I’ll come, of course. And when she’s home, I shall go and find a forest and live there.  
**The Scarecrow** _(happy)_: I shall come as far as Glinda’s. Then I shall come back and rule. With my brains.  
**The Tin Woodman** _(soft)_: And I. My heart wouldn’t let me stay behind.  

#### Complete `a15-16-complete`

_In the morning the Guardian of the Gates unlocks everybody’s spectacles at the gate and puts them back in his box._  
_When he comes to your Nubbin, he stops, and looks at it, and looks at you._  
**The Guardian of the Gates** _(think)_: Keep that pair. It has got used to them. Some do. Keep yours too, if you like, to remember us by.  
_Without the spectacles, the City is plain stone and glass, with a little green paint here and there._  
_It is very pretty, and not very green at all._  
_You put your pair in your pocket. Your Nubbin keeps its own on, and you let it._  

**Rewards**

- Green Spectacles (cosmetic): The Guardian’s green spectacles, with the lock taken off. Wear them and the whole screen goes green; take them off whenever you like.

Sets on completion: `{"a15-16":true}`

**Notes:** CORVIN READ (Grove flag `corvin`, read-only, when a15-16-launch-done plays). The scene shown is the DEFAULT: the balloon simply gets smaller. For `corvin` = reconciled only, play ATLAS_A15_VARIANTS a15-16-launch-done-reconciled instead: your Nubbin watches it go and looks back at you, and you think that some of them come back. Bargained, forced, unset and the Collector route all get the default. LIFTED TEXT: none; the Wizard’s parting words and the Monkey King’s refusal are our own. REWARD: Green Spectacles (cosmetic, one-time, at the complete scene); the screen tint can be toggled off at any time. The kitten is a plain kitten and is fine.

## A15-17. The Fighting Trees and the China Country

*The Wonderful Wizard of Oz (1900), ch. XIX–XX: the fighting trees, and the dainty china country* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-16, from Nova’s atlas. · requires: A15-16

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The China Milkmaid (The china milkmaid (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), The China Princess (The china Princess (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Get through the forest of fighting trees.

Hint: Keep behind the Woodman; when a branch grabs, let him chop. · check: `walk:a15-forest:fighting-trees`

#### Scene `a15-17-trees`

_South of the City the land is rough. On the second day you come to a thick wood, with no way round it._  
_The Scarecrow goes in first. As he comes under the first tree, its branches bend down and twine round him._  
_In a moment he is lifted off the ground and flung, head over heels, back among the rest of you._  
**The Scarecrow** _(shock)_: Well! That was very rude. I shall try another tree.  
_He tries another tree, and is flung back again._  
**The Tin Woodman**: Let me go first.  
_When a big branch bends down to seize him, the Woodman chops it through. The whole tree shakes its branches, crossly, and lets him by._  
**The Cowardly Lion**: Only the first row fights, I think. They are guarding the wood.  

**Choices**

- **Keep right behind the Woodman.**
    - You keep so close behind the Woodman that a branch reaching for you finds his axe instead, and thinks better of it.
- **Tuck your Nubbin inside your coat.**
    - You button your Nubbin into your coat. A branch pats you all over, finds nothing to grab, and gives up.

#### Done `a15-17-trees-done`

_Behind the first row, the trees are only trees. Everyone gets through, the Scarecrow last, very ruffled._  

### Step 2: Climb the white wall, and help the cross milkmaid.

Hint: Climb the ladder the Woodman makes, and go down very carefully on the other side. · check: `climb:a15-wall:china`

#### Scene `a15-17-wall`

_On the far side of the wood is a high wall, smooth and white, like the side of a dinner plate._  
_The Woodman makes a ladder. The Scarecrow climbs it first, looks over, and says nothing at all for a moment, which isn’t like him._  
_On the other side the ground is white and smooth and shining, like the bottom of a great platter._  
_There are little houses, all made of china and brightly painted. The people are china too, and the tallest comes up to your knee._  
_Nearest the wall, a china milkmaid is milking a china cow. As you jump down, the cow gives a kick._  
_Over goes the stool, and over goes the pail, and over goes the milkmaid herself, with a clatter._  
_The cow’s leg has snapped clean off. The pail is chipped, and the milkmaid has a nick in her elbow._  
**The China Milkmaid** _(angry)_: Look what you’ve done! Her leg’s off! Now it’s the mender’s for her, and glue, and a week of standing still!  
**Dorothy** _(sad)_: I’m very sorry. Please forgive us.  

**Choices**

- **Pick up the cow’s leg and hand it back.**
    - **The China Milkmaid**: Well. Thank you. You might have broken it worse, I suppose, being so enormous.
- **Say sorry too, as small as you can.**
    - You crouch down very small and say you’re sorry. The milkmaid sniffs, and is a little less cross.

#### Done `a15-17-wall-done`

_The milkmaid leads the cow away limping on three legs, carrying the fourth, and looks back over her shoulder at you all._  
**Dorothy** _(think)_: We’ll have to walk very carefully. Everything here breaks.  

### Step 3: Meet the china Princess, and decide about the lamb.

Hint: Stand still and speak softly; then choose, with your Nubbin at the fence. · check: `choose:a15-lamb:field`

#### Scene `a15-17-lamb`

_A little further on you meet a beautiful china Princess in a dress of many colours. She stops, and then she runs._  
**Dorothy**: Wait! Please! We won’t hurt you!  
**The China Princess** _(shock)_: Oh! Please don’t run at me! If I fall I might break, and it is not at all nice, being mended.  
**Dorothy**: You’re so lovely. Would you come home with me? Aunt Em hasn’t a single pretty thing in the house.  
**The China Princess**: Oh, no. Here we walk about, and talk, and visit, and do as we like.  
**The China Princess** _(sad)_: Out there our joints would set hard. We’d stand on a shelf being admired, and never walk again. Pretty is all we’d be.  
**Dorothy** _(soft)_: Then I won’t ask again. I’d hate you to be unhappy.  
_Beside the path is a little field with a china fence round it. China lambs, no bigger than a thimble, are grazing on china grass._  
_One of them comes to the fence. Your Nubbin goes to the fence too, and they touch noses, very gently._  
_Your Nubbin looks up at you, and then at your pocket, which is just the right size, and then at the lamb._  
_It has never wanted anything this much. You can tell._  

**Choices**

- **Slip the lamb into your pocket, to keep it safe.** — sets `{"a15-lamb":"pocketed"}`
    - You lift the lamb over the fence. It is warm and light, and its legs kick a little.
    - You slip it into your pocket, to keep it safe. Your Nubbin keeps one paw on the outside of the pocket all the way.
- **Put it back in its field.** — sets `{"a15-lamb":"returned"}`
    - You lift your Nubbin gently away from the fence. The lamb bleats once, very small, like a spoon on a cup.
    - Your Nubbin looks back three times. Then it stops looking back, and walks closer to you.

#### Complete `a15-17-complete`

_Crossing the china country, the Lion’s tail swings round by accident and knocks over a little china church._  
**The Cowardly Lion** _(shock)_: Oh dear. Oh dear, oh dear. I’ll go the long way round. On tiptoe.  
_China people come running with glue pots. They seem quite used to it._  
_At the far side is another wall, not so high. You climb it, drop into tall grass, and the china country is behind you._  
**Dorothy** _(soft)_: I’m glad we saw it. I’m glad we didn’t take anything away.  

**Rewards**


Sets on completion: `{"a15-17":true}`

**Notes:** SECOND CHOICE (a15-17-lamb): a15-lamb = pocketed | returned. It pays off in A15-20, three quests later: the farewell scene (pocketed plays ATLAS_A15_VARIANTS a15-20-farewell-pocketed, where you find the lamb stiff and Glinda tells you to carry it home) and the four endings. "To keep it safe" is deliberate and is never explained. If pocketed, draw a small lump in your coat pocket on this page only (A15-17 to A15-20), and have your Nubbin check the pocket now and then in idle animations. Dorothy’s last line in the complete is the same in both routes; let it land on its own. LIFTED TEXT: none; passage 6 (the Princess’s joints) is told in our own words at a15-17-lamb#5. The milkmaid’s cow loses a leg to be glued back on: china, not flesh; play it as comedy.

## A15-18. The King of Beasts

*The Wonderful Wizard of Oz (1900), ch. XXI: the Lion becomes the King of Beasts* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-17, from Nova’s atlas. · requires: A15-17

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tiger (The great tiger of the forest council (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Go with the Lion into the great old forest.

Hint: Walk among the old trees until you find the gathering of animals. · check: `visit:a15-forest:council`

#### Scene `a15-18-council`

_Past the tall grass is a forest of great old trees, the biggest you have ever seen. It is dark and quiet, and the ground is soft with leaves._  
**The Cowardly Lion** _(soft)_: What a forest. I could live in a forest like this for ever.  
_In a big clearing there are hundreds of animals: tigers and elephants, bears and foxes, all talking at once._  
_When they see the Lion, they all go quiet. A great tiger comes up and bows._  
**The Tiger** _(happy)_: King of Beasts! You’ve come. You’ve come at last. We need you badly.  
**The Cowardly Lion** _(think)_: What has happened here?  
**The Tiger**: A monster. A spider bigger than an elephant, with legs like tree trunks, eight of them.  
**The Tiger** _(sad)_: It creeps through the forest and catches us, one by one. None of us is safe. We were talking about what to do.  
_Your Nubbin is pressed against the back of your legs again, the way it was on the road the day you met the Lion._  

**Choices**

- **Look at the Lion.**
    - The Lion is very still, with his mane up. You can’t tell whether that is courage or the other thing.
- **Pick up your Nubbin.**
    - You pick up your Nubbin. Its heart is going fast, and so is yours.

#### Done `a15-18-council-done`

**The Cowardly Lion** _(think)_: If I deal with this spider, will you have me for your King?  
**The Tiger**: Gladly. All of us.  
**The Cowardly Lion**: Then wait here.  

### Step 2: Wait at the edge of the clearing while the Lion goes alone.

Hint: Stay with Dorothy at the clearing’s edge, and keep your Nubbin with you. · check: `wait:a15-lion:forest-edge`

#### Scene `a15-18-wait`

**The Cowardly Lion** _(think)_: Look after my friends for me. I’m going now, before I think about it.  
_He goes off into the trees alone. Nobody follows him, because he asked them not to._  
_Your Nubbin starts after him. It stops at the edge of the trees, comes back to you, and sits down._  
**Dorothy** _(sad)_: He was so frightened of the Kalidahs. He was nearly frightened of a mouse.  
**The Scarecrow** _(think)_: He drank his courage. I saw it. It was green.  
**The Tin Woodman** _(soft)_: I don’t think it was ever in the dish. I think it was in him all along. My heart tells me so.  
_You wait. The forest is very quiet: the kind of quiet that is listening._  
_Nobody talks. Even the Scarecrow doesn’t think out loud._  

**Choices**

- **Sit down and wait, with your Nubbin in your lap.**
    - You sit, and your Nubbin climbs into your lap. You wait the way you would wait for anyone.
- **Stand at the edge and watch the trees.**
    - You stand and watch the dark between the trees. Once, far off, there is a sound, and then nothing.

#### Done `a15-18-wait-done`

_At last, in the grey of the morning, the Lion comes back through the trees. He walks slowly, and very straight._  
**The Cowardly Lion**: It’s done. It won’t catch anyone any more. You can stop being afraid.  
_He doesn’t say how, and nobody asks him._  

#### Complete `a15-18-complete`

_All the animals bow down to the Lion as their King._  
**The Cowardly Lion**: I’ll be back to look after you, once Dorothy is safe on her way home. Not before.  
**The Tiger**: We will wait, Your Majesty.  
_The Lion comes back to you. He lies down and puts his great head on the ground, so that your Nubbin can reach his nose._  
**The Cowardly Lion** _(soft)_: I was afraid the whole time. The whole time. My knees knocked.  
**You**: I know. You went anyway.  
**The Cowardly Lion** _(soft)_: Yes. I did, didn’t I?  
_Your Nubbin pats his nose, very gently, the way it did on the road where you met._  

**Rewards**


Sets on completion: `{"a15-18":true}`

**Notes:** SOFTENING (care notes): Baum’s Lion knocks the sleeping spider’s head off. Here the Lion goes alone into the trees, the camera stays with the friends, and there is "a sound, and then nothing". The spider is described once by the Tiger and never shown. The Lion says only that it won’t catch anyone any more. THEME: this is the payoff of A15-5 (your Nubbin sat by him first) and A15-15 (the green dish); the Woodman says the thing outright, once.

## A15-19. The Hammer-Heads

*The Wonderful Wizard of Oz (1900), ch. XXII: the country of the Quadlings* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-18, from Nova’s atlas. · requires: A15-18

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), A Hammer-Head (A Hammer-Head (L. Frank Baum, The Wonderful Wizard of Oz, 1900); a fairy-tale people, funny, never anyone real), The King of the Winged Monkeys (The King of the Winged Monkeys (L. Frank Baum, The Wonderful Wizard of Oz, 1900))

### Step 1: Climb the rocky hill towards the south.

Hint: Follow the Scarecrow up the rocks, and stop when a voice tells you to. · check: `climb:a15-hill:rocky`

#### Scene `a15-19-hill`

_Past the forest a steep hill rises, covered from top to bottom with great pieces of rock._  
**The Scarecrow**: Rocks. A great many rocks. Well, up we go.  
_He leads the way. You are halfway up the first rocks when a rough voice calls out._  
**A Hammer-Head** _(angry)_: Stop there! Our hill! Nobody goes over our hill!  
_From behind a rock comes a very odd man: short and stout, with a big head, flat on top, on a thick, wrinkled neck._  
_He has no arms at all. The Scarecrow, seeing that, is not a bit afraid of him._  
**The Scarecrow**: Terribly sorry, but we have to get over. We’re on our way south, to the Quadlings.  
_Quick as lightning, the man’s head shoots forward on its stretching neck, and the flat top of it hits the Scarecrow in the middle._  
_The Scarecrow goes tumbling, head over heels, all the way down the hill._  
_From behind every rock, a hundred more Hammer-Heads pop up, laughing a hard, rough laugh._  

**Choices**

- **Run down and pick up the Scarecrow.**
    - You find him at the bottom, upside down in a bush.
    - **The Scarecrow**: I have brains now, and I can tell you I did not see that coming.
- **Duck behind a rock with your Nubbin.**
    - You duck behind a rock. A head on a long neck comes round the side, looks at your Nubbin, and goes back again.

#### Done `a15-19-hill-done`

_The Lion, very brave now, roars and dashes up the hill. A head shoots out, and down he rolls too, like a big cannon-ball._  
**The Cowardly Lion** _(sad)_: Ow. Ow. Courage is all very well, but it doesn’t help your nose.  

### Step 2: Read the charm with Dorothy for her third and last call.

Hint: Stand by Dorothy and read the words inside the Cap with her. · check: `watch:a15-monkeys:third-call`

#### Scene `a15-19-call`

**Dorothy**: It’s no good fighting people who shoot their heads out. What shall we do?  
**The Tin Woodman** _(think)_: Call the Winged Monkeys. You have one call left.  
**Dorothy** _(sad)_: It’s the last one. After this, the Cap won’t do anything for me ever again.  
**The Scarecrow**: Then use it on something worth it. This seems worth it. My middle hurts.  
_Dorothy puts on the Golden Cap and says the words. You read them out with her, very clearly, since it is the last time._  
_The Monkeys come down as fast as ever, the whole band, and line up in front of her._  
**The King of the Winged Monkeys** _(think)_: Third call. The last. What is it to be?  
**Dorothy**: Carry us over the hill to the country of the Quadlings.  
**The King of the Winged Monkeys**: Up you come, then.  

**Choices**

- **Thank the Monkey King.**
    - **The King of the Winged Monkeys**: Thank us? Hm. Nobody does that. The Cap doesn’t say anything about thanks.
- **Watch the Monkey King as he lifts you.**
    - He lifts you as gently as before. His wings beat hard and slow, and he looks, you think, very tired.

#### Done `a15-19-call-done`

_The Monkeys carry you all over the hill. The Hammer-Heads shoot their heads high in the air, and can’t reach._  
_Your Nubbin looks down at them, and they look up at your Nubbin, and that is the end of the Hammer-Heads._  

#### Complete `a15-19-complete`

_The Monkeys set you down in the country of the Quadlings, and fly away. The King looks back once from the sky._  
_Everything here is red: the fences, the houses, the bridges, the Quadlings’ clothes._  
_The Quadlings are small and round and cheerful. They give Dorothy something to eat, and she thanks them._  
**Dorothy**: Please, which way is Glinda’s castle?  
_A Quadling points. Far down the road a castle is shining in the sun._  

**Rewards**


Sets on completion: `{"a15-19":true}`

**Notes:** The Hammer-Heads (care notes) are a fairy-tale people: armless, flat-headed, and funny. Draw them as cheerful rock-dwellers with springy necks, nothing that reads as a real disability or a real people; nobody is hurt but the Scarecrow’s dignity and the Lion’s nose. This is Dorothy’s third and last call; the Cap is now spent for her. The King’s tiredness sets up A15-20.

## A15-20. Glinda

*The Wonderful Wizard of Oz (1900), ch. XXIII–XXIV: Glinda grants Dorothy’s wish, and home again* · audience: all · where: Nova’s atlas: the Humbug page (Atlas campaign) · when: Any time after A15-19, from Nova’s atlas. · requires: A15-19

**Cast:** Dorothy (Dorothy, the girl from Kansas (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design after Denslow, nothing from the 1939 film), The Scarecrow (The Scarecrow (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Tin Woodman (The Tin Woodman (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The Cowardly Lion (The Cowardly Lion (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design), The King of the Winged Monkeys (The King of the Winged Monkeys (L. Frank Baum, The Wonderful Wizard of Oz, 1900)), Glinda (Glinda, the Good Witch of the South (L. Frank Baum, The Wonderful Wizard of Oz, 1900); original design)

### Step 1: Go before Glinda, the Good Witch of the South.

Hint: Walk up to Glinda’s throne with Dorothy and the others, and listen. · check: `visit:a15-glinda:castle`

#### Scene `a15-20-glinda`

_At the castle gate stand three girls in handsome red uniforms. They lead you all into a great room._  
_Glinda sits on a red throne. She is beautiful and young-looking, with rich red hair, and her eyes are blue and kind._  
**Glinda** _(soft)_: Well, my dear. What is it you need?  
**Dorothy** _(sad)_: I want to go home to Kansas. Aunt Em will be sure I’m lost for good by now.  
**Glinda** _(soft)_: There is a way, my dear, and I’ll tell you. But I shall want the Golden Cap in return.  
**Dorothy**: Gladly. It’s no use to me now. I’ve used all three calls.  
**Glinda**: The silver shoes will carry you over the desert. You could have gone home the day you came, if you had only known what they do.  
**Dorothy** _(shock)_: The very first day?  
**The Scarecrow** _(shock)_: But then I’d never have got my brains! I’d have spent my whole life up a pole in a cornfield.  
**The Tin Woodman**: And I would still be standing in that clearing with my axe in the air.  
**The Cowardly Lion**: And I’d still be roaring at little dogs, and crying about it afterwards.  
_Dorothy looks down at the silver shoes for a long time. They have been on her feet the whole way._  

**Choices**

- **Look at the shoes.**
    - They are dusty from the road and scuffed at the toes. They don’t look like much.
- **Ask Dorothy if she minds.**
    - **Dorothy**: No. I’m glad I didn’t know. I’d have gone straight home, and none of them would have anything.

#### Done `a15-20-glinda-done`

**Glinda**: Knock the heels together three times and tell them where you want to go. They will take you there in three steps.  

### Step 2: Hear how Glinda will spend the Cap’s calls, and say your goodbyes.

Hint: Stand with your friends while Glinda tells each of them where he will go. · check: `talk:a15-friends:goodbye`

#### Scene `a15-20-goodbye`

**Glinda** _(think)_: Now. The Golden Cap, and its three calls. Let me see.  
**Glinda**: Scarecrow: the Monkeys will carry you back to the Emerald City, to rule. The people will be lucky in you.  
**The Scarecrow** _(happy)_: Thank you. I have just thought of eleven new laws. I shall begin with those.  
**Glinda**: Woodman: they will carry you to the land of the Winkies, who want you for their ruler.  
**The Tin Woodman** _(soft)_: I shall rule them kindly. I have the heart for it now.  
**Glinda**: Lion: they will carry you over the Hammer-Heads to your forest, to be King of the Beasts.  
**The Cowardly Lion**: Thank you. I shouldn’t care to meet the Hammer-Heads again, even as a King.  
**Glinda** _(soft)_: And then I shall give the Cap to the King of the Monkeys, so that he and his band are free for ever.  
_Dorothy hugs each of them in turn, and cries, and kisses the Lion on his great nose._  

**Choices**

- **Oil the Woodman’s jaw. He is crying.**
    - The Woodman is crying, of course. You oil his jaw one last time, while the Scarecrow holds his hat, as he did once before.
    - **The Tin Woodman**: Keep the can. I mean it. You have been the best oil-can-carrier in all of Oz.
- **Shake the Scarecrow’s hand.**
    - **The Scarecrow**: If you ever need a thought, come to the Emerald City. I have plenty now. I can spare one.
- **Rest your hand on the Lion’s mane.**
    - **The Cowardly Lion**: Goodbye, Keeper. Goodbye, little one. You sat by me first. I shan’t forget it.

#### Done `a15-20-goodbye-done`

_Glinda’s girls bring you a present: a pair of silver shoes, just your size, shining._  
_You put them on, and knock your heels together three times._  
_Nothing happens at all._  
**Glinda** _(happy)_: They’re only shoes, dear. Most shoes are.  

### Step 3: Say goodbye to Dorothy.

Hint: Stay by Dorothy and Toto until she is ready to go. · check: `talk:a15-dorothy:farewell`

#### Scene `a15-20-farewell`

_Dorothy turns to you last. Toto is in her arms, and your Nubbin is sitting on your feet._  
_She looks at you as if she is fixing you in her memory, the way you fix a house you are leaving._  
_Glinda’s girls have gone quiet. Even Toto keeps still._  
**Dorothy** _(soft)_: You came with me the whole way. All the way from the grey. And I still don’t know where you’re from.  
**Dorothy** _(happy)_: I’ll tell Aunt Em about you. She won’t believe it. She doesn’t believe in anything she can’t sweep.  
**Dorothy**: Is it grey, where you live?  

**Choices**

- **Tell her it’s green, mostly, with a pond.**
    - **Dorothy**: Then you’ve got your own place to go back to. That’s good. Everybody ought to have one.
- **Tell her there’s a grey one there, and you love her.**
    - **Dorothy**: Aunt Em’s grey, and I love her better than anything. So you know, then. You know already.
- **Let your Nubbin say goodbye to Toto.**
    - Your Nubbin and Toto touch noses, the way they did on the prairie. Toto sneezes, and it means what it meant then.

#### Complete `a15-20-complete`

_Dorothy holds Toto tight, takes one last look at all of you, and knocks the heels of the silver shoes together three times._  
**Dorothy** _(soft)_: Take me home, please. To Aunt Em.  
_She is gone in three great steps, so fast you only see the wind. The silver shoes fall off in the air, and are lost in the desert for good._  
_For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open._  
_Then the Monkeys come for your friends: the Scarecrow north, the Woodman west, the Lion over the hill to his forest._  
_Glinda gives the Golden Cap to the King of the Monkeys. He bows, and the band flies off without a word._  
_The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off._  
_The page folds shut, softly. You are back in the Grove, with Nova’s atlas on your knee and a thin silver ribbon marking the place._  

**Rewards**

- Silver Shoes (cosmetic): A pair of silver shoes from Glinda’s castle, for your Keeper. They don’t do anything. Most shoes don’t.
- Monkey Feather (cosmetic): A long dark feather from the Winged Monkeys, the first thing they gave away free. Only if you asked the Monkey King what they would do if they were free (a15-cap = asked).
- The Price of Power Bookmark (item): A thin silver ribbon that marks the Humbug page. Two bookmarks from the Price of Power pages open that festival in the Grove.

Sets on completion: `{"a15-20":true,"a15-done":true}`

**Notes:** ENDINGS (two flags, four versions of the complete scene; all start with A20_KANSAS and end with A20_CLOSE):
  - a15-cap = silent, a15-lamb = returned: the scene shown here, a15-20-complete.
  - a15-cap = asked, a15-lamb = returned: ATLAS_A15_VARIANTS a15-20-complete-asked (the King says "Play."; the feather; the lamb waits by the wall).
  - a15-cap = asked, a15-lamb = pocketed: a15-20-complete-asked-pocketed (the feather; the free band flies you to the china wall as their first free favour; the lamb wakes and runs).
  - a15-cap = silent, a15-lamb = pocketed: a15-20-complete-pocketed (the Lion walks you to the wall, since his forest lies that way; the lamb wakes and runs).
FAREWELL (step 3): for a15-lamb = pocketed, play a15-20-farewell-pocketed in place of a15-20-farewell: you take the lamb out to show Glinda and find it stiff, and Glinda tells you what the Princess told you. This is the coda before Dorothy’s heels click. SILVER SHOES: the joke is made once, at a15-20-goodbye-done; the cosmetic does nothing anywhere, ever. REWARDS (one-time): Silver Shoes at a15-20-goodbye-done; Monkey Feather at the complete, asked routes only; the Price of Power Bookmark at the complete (the silver ribbon in A20_CLOSE). The real Golden Cap goes to the Monkey King in every route. LIFTED TEXT: none; passage 7 is told in our own words (a15-20-glinda#6 and #8). Dorothy’s words to the shoes are our own (not Baum’s, not the film’s). Kansas is shown for one line only, through the page: no dream framing, no bedroom, no "there’s no place like home" chant.

## Variant scenes

#### Variant `a15-14-screen-done-reconciled`

**Oz** _(sad)_: I’m not a wicked man, my dear. Truly I’m not. I’m only a very poor Wizard. There’s a difference, though I grant it’s small.  
**Oz** _(sad)_: And I was frightened of the Witches. All of them, all along. That’s why the walls are so high.  
_You knew a man like this._  
_He gave the trick back. His hand was blue._  

#### Variant `a15-14-screen-done-bargained`

**Oz** _(sad)_: I’m not a wicked man, my dear. Truly I’m not. I’m only a very poor Wizard. There’s a difference, though I grant it’s small.  
**Oz** _(sad)_: And I was frightened of the Witches. All of them, all along. That’s why the walls are so high.  
_You knew a man like this._  
_He sold the trick, along with everything else._  

#### Variant `a15-14-screen-done-forced`

**Oz** _(sad)_: I’m not a wicked man, my dear. Truly I’m not. I’m only a very poor Wizard. There’s a difference, though I grant it’s small.  
**Oz** _(sad)_: And I was frightened of the Witches. All of them, all along. That’s why the walls are so high.  
_You knew a man like this._  
_He only let go when he fell._  

#### Variant `a15-16-launch-done-reconciled`

**Dorothy** _(sad)_: Wait! Wait for me! Oh, come back!  
**Oz** _(sad)_: I can’t steer it! I never could! Goodbye, my dear! Goodbye!  
_The green balloon goes up over the green towers, and gets smaller._  
_Your Nubbin watches it go. Then it turns and looks back at you, for a long moment._  
_Some of them come back, you think._  

#### Variant `a15-20-farewell-pocketed`

_Before Dorothy goes, you take the china lamb out of your pocket to show Glinda._  
_It is cold, and stiff, and its legs are set hard._  
_It is only an ornament now: pretty, and still._  
_Your Nubbin touches it with its nose, and nothing happens, and it touches it again._  
**Glinda** _(soft)_: Ah. You meant to keep it safe. The ones who love them best so often do.  
**Glinda**: You heard what the Princess told you. Carry it home, back over its own wall, and it will wake.  
**The Cowardly Lion**: My forest lies that way. If nobody else can take you, I’ll walk you there myself.  
**Dorothy** _(soft)_: You came with me the whole way. All the way from the grey. And I still don’t know where you’re from.  
**Dorothy** _(happy)_: I’ll tell Aunt Em about you. She won’t believe it. She doesn’t believe in anything she can’t sweep.  
**Dorothy**: Is it grey, where you live?  

**Choices**

- **Tell her it’s green, mostly, with a pond.**
    - **Dorothy**: Then you’ve got your own place to go back to. That’s good. Everybody ought to have one.
- **Tell her there’s a grey one there, and you love her.**
    - **Dorothy**: Aunt Em’s grey, and I love her better than anything. So you know, then. You know already.
- **Let your Nubbin say goodbye to Toto.**
    - Your Nubbin and Toto touch noses, the way they did on the prairie. Toto sneezes, and it means what it meant then.

#### Variant `a15-20-complete-asked`

_Dorothy holds Toto tight, takes one last look at all of you, and knocks the heels of the silver shoes together three times._  
**Dorothy** _(soft)_: Take me home, please. To Aunt Em.  
_She is gone in three great steps, so fast you only see the wind. The silver shoes fall off in the air, and are lost in the desert for good._  
_For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open._  
_Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He holds it a long time, looking at you._  
**The King of the Winged Monkeys** _(think)_: You asked me what we would do, if we were free. I have thought about it all this way.  
**The King of the Winged Monkeys** _(happy)_: Play.  
_The whole band loops over Glinda’s castle, round and round, shrieking. A feather comes down and lands on your Nubbin’s head._  
_The page carries you home the way you came. Its last picture is the china wall, and a lamb by it, waiting to see you off._  
_The page folds shut, softly. You are back in the Grove, with Nova’s atlas on your knee and a thin silver ribbon marking the place._  

#### Variant `a15-20-complete-asked-pocketed`

_Dorothy holds Toto tight, takes one last look at all of you, and knocks the heels of the silver shoes together three times._  
**Dorothy** _(soft)_: Take me home, please. To Aunt Em.  
_She is gone in three great steps, so fast you only see the wind. The silver shoes fall off in the air, and are lost in the desert for good._  
_For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open._  
_Then the Monkeys carry your friends away, and Glinda puts the Golden Cap into the King’s hands. He looks at you over it._  
**The King of the Winged Monkeys** _(happy)_: You asked me what we’d do, if we were free. Play. But a favour first, our first free one, if you’ll let us.  
_They loop once over the castle, shrieking, and a feather drops on your Nubbin’s head. Then they lift you, and fly north to the china wall._  
_Over the wall, you set the lamb down in its own field. It stands stiff for a breath, then shakes, and wakes, and runs._  
_The page folds shut, softly. You are back in the Grove, with Nova’s atlas on your knee and a thin silver ribbon marking the place._  

#### Variant `a15-20-complete-pocketed`

_Dorothy holds Toto tight, takes one last look at all of you, and knocks the heels of the silver shoes together three times._  
**Dorothy** _(soft)_: Take me home, please. To Aunt Em.  
_She is gone in three great steps, so fast you only see the wind. The silver shoes fall off in the air, and are lost in the desert for good._  
_For a moment the page shows Kansas: a new little farmhouse, grey grass, and Aunt Em running across it with her arms open._  
_The Monkeys come for the Scarecrow and the Woodman. The Lion lets them go without him._  
**The Cowardly Lion** _(soft)_: I’ll walk. My forest lies that way, and so does the china wall. A King can walk into his own forest.  
_Glinda gives the Golden Cap to the King of the Monkeys, and the band flies off without a word._  
_The Lion walks you north, all the way to the china wall, with your Nubbin riding on his back._  
_Over the wall, you set the lamb down in its own field. It stands stiff for a breath, then shakes, and wakes, and runs._  
_The page folds shut, softly. You are back in the Grove, with Nova’s atlas on your knee and a thin silver ribbon marking the place._  
