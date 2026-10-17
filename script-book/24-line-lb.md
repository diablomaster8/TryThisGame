# Learning Grove line LB: Play (LB1–LB12)

## LB1. Boxes

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: Late spring, any day after chapter 1 (Free Grove: any season) with the Learning Grove on. Pauses during chapters 9–11; never repeats.

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Help the Larkins carry their boxes from the post van into the cottage past Fern’s.

Hint: Pick up a box at the van’s back doors and carry it into the front room. Your Nubbin will help, sort of. · check: `carry:lb-boxes:larkin-cottage`

#### Scene `lb01-van`

_A red post van is parked crooked in the lane past Fern’s. Its back doors are open and it is full of somebody’s whole life._  
_The empty cottage has its windows open. You have never seen them open before._  
**Ama Larkin** _(happy)_: Oh, hello! You must be next door. Well, next door but one. I’m Ama.  
**Ama Larkin**: I drive the post van. It isn’t usually full of our own socks. Usually it’s everyone else’s parcels.  
**Sam Larkin** _(soft)_: Sam. Hello. Sorry. We’ve been up since four.  
_A girl in a paper crown marches past with a lampshade. A small boy follows her, carrying nothing, very carefully._  
**Maisie**: I’m Maisie. I’m six, so I do the rules. That’s Ned. He’s four.  
**Ned**: I’m in charge of not dropping things.  
_Your Nubbin trots up to Ned. They stare at each other, both delighted._  
**Sam Larkin**: If you’ve got a spare pair of arms, we’ve got about forty boxes.  

#### Done `lb01-unpacked`

_By lunchtime the van is empty and the front room is full of boxes. Most of the boxes are empty too._  
**Ama Larkin**: That’s the lot. The kettle was in the box marked SHOES, so that’s a mystery solved.  
_Maisie and Ned are not looking at the kettle. They are looking at the empty boxes, the way other children look at cake._  

### Step 2: Help Ned choose one empty box to keep.

Hint: Talk to Ned in the front room and pick a box with him. · check: `choose:lb-ned-box`

#### Scene `lb01-boxes`

_Ama folds the empty boxes flat for the recycling. Ned watches each one fold up as if it were a small, sad animal._  
**Ned** _(shock)_: Not that one! Or that one!  
**Ama Larkin**: Ned, love, we can’t keep forty boxes. We’d have to live in the garden.  
**Sam Larkin**: One box, then. One box for keeps.  
_Ned walks along the row and knocks on each box, the way you knock on a door. Then he climbs into one and goes quiet._  
**Maisie** _(soft)_: He’s sad about his old bedroom. It had glow-in-the-dark stars on the ceiling.  
**Ned** _(sad)_: They wouldn’t come off. I tried.  
**Sam Larkin** _(soft)_: They’re still up there, mate. Glowing away for whoever sleeps there next.  
_Ned thinks about that for a long time. Then he climbs out, points at three boxes in turn, and looks at you._  
**Ned**: You pick. You’re the grown-up next door.  

**Choices**

- **The big one. You could live in it.** — sets `{"lb-box":"big"}`
    - Ned climbs into the big box and pulls the flaps shut over his head.
    - **Ned**: It’s got a ROOF.
- **The long one. It’s the shape of a boat.** — sets `{"lb-box":"long"}`
    - Ned lies down in the long box. It fits him exactly, with room at the end for your Nubbin.
    - **Ned**: We’re lying down. Shh.
- **The tall one. It’s nearly as tall as Ned.** — sets `{"lb-box":"tall"}`
    - Ned stands up inside the tall box. Only his eyes show over the top.
    - **Ned**: It goes UP.

#### Complete `lb01-complete`

_Ama writes NED on the box in marker pen, in letters as big as Ned’s hand._  
**Ama Larkin** _(happy)_: There. Officially his. Thank you for today. I’d have been making tea in a shoe box till August.  
**Sam Larkin**: Come round whenever you like. They’ll need a customer for something soon. They always do.  
**Maisie**: We need grown-ups for nearly every game. And Nubbins. Can we borrow yours sometimes? We’ll always ask.  
_Your Nubbin is the last to leave. Ned waves at it from inside his box until you reach the lane._  

**Rewards**

- New Neighbours (flag): The cottage past Fern’s is lived in: the Larkins have moved in, and their games begin. Learning Grove only.

Sets on completion: `{"lb-moved-in":true}`

**Notes:** Moving day. Props: the red post van in the lane past Fern’s, about forty boxes (a carry loop of 6 trips is plenty; the rest are already in), Maisie’s paper crown. The box choice is the line’s signature choice: big (pays off as a house), long (a boat) or tall (a rocket), in LB6 (the den door) and LB12 (the last night). After completion the chosen box, with NED on it, sits in the Larkins’ front room until LB6. Ama is in her post-office uniform; Sam has sawdust on his jumper.

## LB2. Shops

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB1 is complete: the next morning there is a SHOP sign on the Larkins’ step. Pauses during chapters 9–11; never repeats. · requires: LB1

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Buy a leaf from Ned’s shop on the Larkins’ step.

Hint: Talk to Ned at his shop and count out 5 Shells. You will get them back. · check: `give:shells:lb-ned`

#### Scene `lb02-shop`

_A cardboard sign on the Larkins’ step says SHOP, with the S backwards. The shop is open._  
_Leaves are laid out in rows on a tea towel: big ones, small ones, and one with a hole that Ned says is a window._  
**Ned** _(happy)_: Welcome to the shop. Everything is leaves.  
**You**: How much is this one?  
**Ned**: Five Shells.  
**You**: And this one?  
**Ned** _(think)_: Five Shells. No. A hundred. No. Two.  
_Prices in Ned’s shop change about as often as the wind does. Your Nubbin sits by the till, a biscuit tin, as security._  
**Ned**: The window leaf is five. It’s the best one. You can look through it.  

**Choices**

- **Five Shells it is.**
    - **Ned**: Good. Count them in my hand.
- **Do you do discounts?**
    - **Ned**: Yes. It’s six.
    - You decide five was a bargain.
- **Could my Nubbin buy one too?**
    - **Ned**: Nubbins are free. Nubbins get a leaf for nothing.
    - Ned gives your Nubbin a leaf. It holds it like a flag.

#### Done `lb02-bought`

_You count five Shells into Ned’s hand. He counts them again, nearly right, and drops them in the biscuit tin._  
**Ned**: And here’s your change.  
_He gives you all five back. In Ned’s shop the change is the best bit, so you always get everything back._  

### Step 2: Help Maisie and Ned share the shop.

Hint: Talk to Maisie and Ned at the step and help them find a way to take turns. · check: `talk:lb-maisie:turns`

#### Scene `lb02-turns`

_Maisie comes out with a second tea towel and a sign of her own. Hers says SHOP TOO._  
**Maisie**: I’m the shopkeeper now. Ned’s had ages.  
**Ned** _(angry)_: It’s MY shop. I made the S.  
_Ned holds the biscuit tin to his chest and Maisie folds her arms. The leaves blow about a bit, unsupervised._  
**Sam Larkin**: Is there a way two shopkeepers could work this out?  
_Sam is leaning out of the shed window, holding a chair leg he has been sanding all morning._  
**Maisie**: He could be the customer. Customers are important too.  
**Ned** _(sad)_: Customers don’t get the tin.  

**Choices**

- **Ned sells one thing, then you swap.** — sets `{"lb-ned-shop":"swap"}`
    - **Maisie**: One each. Fine. But I’m having the window leaf.
- **Two shops, side by side. I’ll shop at both.** — sets `{"lb-ned-shop":"two"}`
    - Maisie sets up her tea towel next to Ned’s. Now the step has a high street.
- **Whoever’s selling holds the tin.** — sets `{"lb-ned-shop":"tin"}`
    - **Ned**: And then I get it back?
    - **Maisie**: Then you get it back.

#### Complete `lb02-complete`

_Maisie runs the shop for a while. Ned is a customer, and finds out something surprising._  
**Ned** _(happy)_: Buying is ALSO good.  
_He buys the window leaf six times. Maisie gives him change every time, because that is how this shop works now._  
**Sam Larkin**: Two shopkeepers, one tin, nobody crying. That’s a good day’s trading.  
_When you go, Ned presses a leaf into your hand. It is free, he says, because you are a regular._  

**Rewards**


**Notes:** Ned’s leaf shop on the Larkins’ step: tea towel, leaves, a biscuit-tin till, the backwards S. No real Shells are spent: the check counts 5 Shells out of the inventory and the shop gives them straight back as change. Sam sands a chair leg in the shed (his work), visible through the window. Maisie’s SHOP TOO sign stays on the step until LB12 as set dressing.

## LB3. Don’t Touch the Grass

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB2 is complete: a dry afternoon, with every cushion in the Larkins’ house out on the lawn. Pauses during chapters 9–11; never repeats. · requires: LB2

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Help lay the cushions across the Larkins’ lawn.

Hint: Carry cushions from the pile by the back door and drop them in a line to the fence. · check: `place:lb-cushions:larkin-lawn`

#### Scene `lb03-rules`

_Every cushion in the Larkins’ house is out on the lawn in a heap, and so is Sam, flat on his back in the long grass._  
**Maisie**: The rules. The grass is the pond. You can only stand on cushions.  
**Maisie**: And something lives in the pond. It has tickly fingers.  
_Somewhere in the long grass, a hand waves slowly, like weed._  
**Sam Larkin**: Bloop.  
**Ned** _(shock)_: That’s Dad. But it’s also NOT Dad.  
**Maisie**: We need a path of cushions from the back door to the fence. That’s the island.  

#### Done `lb03-laid`

_The cushions wobble across the lawn in a crooked line. Some are close together and one is a very long way from the next._  
**Maisie**: That gap is the hard bit. It’s meant to be hard.  

### Step 2: Cross the lawn to the fence without touching the grass.

Hint: Hop from cushion to cushion. If the tickly fingers get you, you start again, laughing. · check: `minigame:lb-cushion-crossing`

#### Scene `lb03-crossing`

_Maisie crosses first, fast and certain, arms out like a tightrope walker._  
_Ned goes second. He stops on a cushion with his toes over the edge, looking at the long gap._  
**Ned** _(sad)_: It’s too far.  
_The grass between the cushions rustles. Two fingers appear, wiggling, and go away again._  
**Maisie**: You can do it, Ned. Big jump.  
**Ned**: My legs are only small.  

**Choices**

- **Put down one more cushion, halfway.**
    - You slide a cushion into the gap. Ned looks at it, then at Maisie.
    - **Maisie**: That’s allowed. Islands can grow.
- **Hold out a hand from the next cushion.**
    - You lean out from the far cushion. Ned grabs your fingers and jumps.
    - **Ned**: I did a huge one!
- **Let your Nubbin show him how.**
    - Your Nubbin flaps its small wings and bounces across the gap. Ned copies it exactly, flaps and all.

#### Complete `lb03-complete`

_Everyone reaches the fence. Then everyone goes back, because that is how this game works._  
_On the third crossing the tickly fingers get Ned’s ankle. He shrieks and falls into the pond, which is grass, and laughs till he hiccups._  
**Sam Larkin**: Got one. The pond monster is satisfied. The pond monster would also like a cup of tea.  
**Maisie**: Pond monsters don’t drink tea.  
**Sam Larkin** _(soft)_: This one does. It’s been a long week in the pond.  
_Ned brings his dad a pretend tea in a flowerpot. Sam drinks every pretend drop._  

**Rewards**


**Notes:** A cushion-path minigame across the Larkins’ lawn: the player hops between cushions with forgiving timing. Touching grass only restarts the crossing with a giggle; there is no fail state. Sam lies in the long grass as the tickly-fingered pond monster, his hand and a "bloop" are all you see. Ned is never laughed at: everyone, Ned included, laughs at the pond monster.

## LB4. Sleeping Giant

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB3 is complete: a hot Saturday, when Sam’s deckchair is out in the garden. Pauses during chapters 9–11; never repeats. · requires: LB3

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Find the sleeping giant in the Larkins’ garden.

Hint: Go round to the Larkins’ garden. The giant is in the deckchair under the apple tree. · check: `visit:lb-deckchair`

#### Scene `lb04-giant`

_Sam is asleep in a deckchair under the apple tree, with a newspaper over his face. It goes up and down when he breathes._  
**Maisie**: Shh. He’s the giant. He’s guarding the treasure.  
_The treasure is a biscuit, on the arm of the deckchair, next to his hand._  
**Ned** _(soft)_: He made two chairs this week. Giants get very tired.  
**Maisie**: The rules. You creep up. When the giant turns his head, you freeze like a statue.  
**Maisie**: If he sees you move, you go back to the start. First to the biscuit wins.  

#### Done `lb04-start`

_You line up by the gate: you, Maisie, Ned and your Nubbin, who does not really understand the rules but loves a line._  
**Sam Larkin** _(soft)_: Fee. Fi. Hmm. Fo.  
**Maisie**: That means go.  

### Step 2: Creep up on the giant, and freeze whenever he turns.

Hint: Move slowly. When the newspaper twitches, stop and hold still. · check: `minigame:lb-sleeping-giant`

#### Scene `lb04-creep`

_Maisie runs, and the newspaper twitches. Sam turns his head, and Maisie is still wobbling._  
**Sam Larkin**: I see a Maisie. Back to the gate, Maisie.  
**Maisie** _(angry)_: I was nearly STILL!  
_Ned goes so slowly that a bee lands on his shoulder and leaves again. When Sam turns, Ned is a perfect statue._  
**Sam Larkin**: Hmm. Just a garden ornament. A very small one.  
_Ned beams, and then remembers that statues can’t beam, and stops._  

**Choices**

- **Go slow, like Ned.**
    - You take tiny steps. The grass hardly moves.
- **Try a quick dash.**
    - You dash. The newspaper lifts.
    - **Sam Larkin**: I see a grown-up. Back you go.
    - **Maisie**: Told you. Slow wins.
- **Send your Nubbin in first.**
    - Your Nubbin waddles straight up to the deckchair and sits by Sam’s feet. Nobody can tell if it’s cheating.

#### Complete `lb04-complete`

_In the end it is Ned. One slow foot at a time, he reaches the deckchair and puts one finger on the biscuit._  
**Ned** _(happy)_: Got it.  
_Sam lifts the newspaper. He has been awake for most of it, and asleep for some of it, and he is not telling which bits._  
**Sam Larkin**: Beaten by the smallest statue in the valley. One more go?  
**Maisie**: One more go!  
_Ned breaks the biscuit into four pieces, one for each player. Your Nubbin’s is the biggest, because Ned says it was the quietest._  

**Rewards**


**Notes:** Grandmother’s footsteps in the Larkins’ garden. The minigame: move while the giant faces away; freeze when the newspaper twitches (a clear, slow tell, never a reaction test). Being seen sends you back to the gate with no penalty. Sam really is tired (he made two chairs this week): ordinary tiredness, never illness. The "one more go" is his, and it is a yes.

## LB5. Nubbin Doctor

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB4 is complete: Maisie hangs a sign on the shed door: DOCTOR. OPEN. Pauses during chapters 9–11; never repeats. · requires: LB4

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Take your Nubbin to Maisie’s clinic in the Larkins’ shed.

Hint: Walk your Nubbin to the shed. It is not ill. It is very good at lying still. · check: `escort:nubbin:lb-clinic`

#### Scene `lb05-clinic`

_The shed has been cleared for the clinic. The workbench is a bed, with a tea towel for a sheet._  
**Maisie**: Next patient, please. Ah. A Nubbin. What seems to be the trouble?  
**You**: Nothing, really. It’s very well.  
**Maisie**: That’s what they all say. Up on the bed, please.  
_Your Nubbin climbs onto the workbench and lies flat on its back. It is not ill, just very good at lying still._  
**Ned**: I’m the nurse. I’ve got the bandages.  
_Ned holds up a whole roll of toilet paper, like a trophy._  

#### Done `lb05-checkup`

_Maisie listens to your Nubbin’s tummy through a funnel. Your Nubbin does its best to have a tummy worth listening to._  
**Maisie**: Good heart. Good ears. Wings a bit small, but that’s normal.  
**Maisie**: Has it been eating? Drinking? Sleeping? Getting cuddles?  
**You**: All four. Lots of the last one.  

### Step 2: Help Ned bandage your Nubbin, kindly.

Hint: Talk to Ned at the workbench. He has the wrong leg. · check: `talk:lb-ned:bandage`

#### Scene `lb05-bandage`

**Maisie**: The patient has a sore left foot. Nurse, bandage please.  
_Ned starts winding the toilet paper round your Nubbin’s right foot, with his tongue out, very carefully._  
_Maisie opens her mouth to say something. Then she looks at Ned’s face and closes it again._  
**Maisie** _(think)_: How do you tell somebody they’ve done it wrong, without making them sad?  
_Your Nubbin lies quite still, wrapped up to the knee, looking pleased with the attention._  

**Choices**

- **“That’s brilliant. Could this foot have one too?”**
    - **Ned**: Two bandages! It’s VERY poorly.
    - Now both feet are bandaged, which covers it either way.
- **“Which foot did the doctor say, Ned?”**
    - **Ned**: The… other one?
    - Ned looks at his own feet and works it out. He starts again on the left, proudly.
- **Let your Nubbin wiggle the left foot.**
    - Your Nubbin wiggles its left foot, gently. Ned gasps: the patient has told him.

#### Complete `lb05-complete`

_Your Nubbin walks home with both feet in toilet paper, like small white boots. It will not let you take them off for an hour._  
**Maisie**: Bring it back if it gets any worse. Or any better.  
**Ned** _(soft)_: It was a very brave patient.  
_Sam, coming in for a pencil, gets a check-up too. Maisie says he needs more sleep and prescribes a nap._  
**Sam Larkin** _(happy)_: Best medicine I’ve heard of all week.  

**Rewards**


**Notes:** The clinic is the Larkins’ shed with the workbench cleared. Props: a funnel stethoscope, a toilet-roll bandage. The Nubbin is never ill: it is playing a patient, and its needs meters are not touched. Afterwards it wears toilet-paper "boots" for an hour of game time as a cosmetic idle (removable, never forced). Ned’s mistake is met with kindness in every choice.

## LB6. Den Day

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB5 is complete: the first properly rainy day, when the children cannot go out. Pauses during chapters 9–11; never repeats. · requires: LB5

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Gather chairs and blankets for a den in the Larkins’ front room.

Hint: Bring blankets from the cupboard and chairs from Sam’s shed. Ned’s box is already there. · check: `collect:lb-den-blankets`

#### Scene `lb06-rain`

_Rain all day. The lane is a stream and the Larkins’ windows are fogged with small fingerprints._  
**Maisie**: It was sunny yesterday. It’s not fair. Weather should take turns properly.  
**Ama Larkin**: It’s Saturday and I’m not driving anywhere. So. Den?  
**Ned** _(happy)_: DEN.  
_Ama takes every blanket out of the cupboard. Sam brings in four chairs from the shed, all his own work, all slightly different._  
**Sam Larkin**: Mind that one, it’s not finished. It wobbles. So it’s perfect for a den.  

#### Done `lb06-built`

_The den goes up: four chairs, three blankets, a sheet for the roof, and pegs from the washing line to hold it all._  
**Ama Larkin**: Every den needs a door.  
_Ned is already dragging his box across the rug, the one with NED on the side._  

### Step 2: Sit in the den with the Larkins while the rain goes on.

Hint: Crawl in through Ned’s box and sit down. There is nothing to do but listen. · check: `sit:lb-den`

#### Scene `lb06-inside`

_Inside the den the light is blue and soft. Everyone’s knees touch, and nobody minds._  
_Rain taps on the window. It sounds different from in here, further away and friendlier._  
**Maisie**: What shapes can you see? The roof is a triangle. The cushion is a square.  
**Ned**: And Mum’s head is a circle.  
**Ama Larkin** _(happy)_: Thank you, Ned.  
_Your Nubbin curls up on Ned’s feet. Ned holds very still, so as not to wake it up._  

**Choices**

- **Tell a story about a den in the rain.** — sets `{"lb-den-story":"story"}`
    - You tell a story about a den that floats away down the lane and comes back in time for tea. Ned makes you tell it twice.
- **Just listen to the rain.** — sets `{"lb-den-story":"listen"}`
    - Nobody says anything for a while. The rain does the talking.
    - **Maisie**: This is the quietest Ned has ever been.
- **Count the drips from the gutter.** — sets `{"lb-den-story":"drips"}`
    - You count drips out loud together. You get to forty-one, and then the drips go too fast and you all give up laughing.

#### Complete `lb06-complete`

_The rain stops at teatime. Nobody wants to come out._  
**Ama Larkin**: Tell you what. The den can stay up. It can stay up as long as it likes.  
**Maisie**: Forever?  
**Ama Larkin**: Till we need the chairs. Which, given your dad, could be a while.  
**Sam Larkin** _(soft)_: I’ll make more chairs.  
_Ama folds a spare blanket and gives it to you. A den for your own Grove, she says, for the next rainy day._  

**Rewards**

- Blanket Den (decor): Two chairs, a patchwork blanket and a peg on top. Your Nubbin naps in it when it rains.

**Notes:** The Larkins’ front room on a rainy day. After lb06-built, play the den-door variant chosen by lb-box: lb06-door-big, -long or -tall (Ned’s box from LB1 becomes the den’s door; if lb-box is somehow unset, use -big). Ama is home (Saturday). Reward: a blanket den decor for the Grove; Nubbins prefer to nap in it during rain (ambient behaviour, no stat effect).

## LB7. Shadow Show

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB6 is complete: an evening, after dark, when Maisie posts a ticket through your door. Pauses during chapters 9–11; never repeats. · requires: LB6

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Find a torch for the shadow show.

Hint: Ama thinks it is in one of the boxes from moving day. Try the box marked SHOES. · check: `find:lb-torch`

#### Scene `lb07-sheet`

_Ama pegs a white bedsheet across the Larkins’ front room, from the curtain rail to the top of the bookcase._  
**Maisie**: It’s a theatre. Tonight only. Tickets are free, but you have to clap.  
**Ned**: I’m doing a rabbit.  
_Ned makes a rabbit with his fingers. It looks a lot like a hand._  
**Ama Larkin**: A shadow show needs a light. There’s a torch in one of the boxes.  
**Maisie**: Which box?  
**Ama Larkin**: If I know us, the one marked SHOES.  

#### Done `lb07-lights`

_The torch is in the box marked SHOES, under the bread bin. Sam switches off the big light._  
_The torch makes a bright circle on the sheet. Everything else in the room goes soft and dark._  

### Step 2: Watch the shadow show, and put on a shadow of your own.

Hint: Sit on the rug in front of the sheet. When it is your turn, step into the light. · check: `watch:lb-shadow-show`

#### Scene `lb07-show`

_Ned stands between the torch and the sheet and holds up his rabbit. On the sheet it is enormous, taller than the bookcase._  
**Ned** _(shock)_: A GIANT rabbit!  
**Maisie**: Go nearer the sheet, Ned.  
_Ned steps back towards the sheet. The rabbit shrinks and shrinks, until it is the size of a real one._  
**Ned** _(think)_: Now it’s a baby. Where did the big one go?  
**Sam Larkin**: Walk back towards the torch, mate, and see what happens.  
_Ned walks to and fro, and the rabbit grows and shrinks. He could do this all night._  
**Maisie**: Your turn. What are you making?  

**Choices**

- **A bird, flapping.** — sets `{"lb-shadow":"bird"}`
    - Your two hands flap across the sheet. Ned tries to catch the bird, and it flies over his head.
- **Put your Nubbin in the light.** — sets `{"lb-shadow":"nubbin"}`
    - Your Nubbin sees its own shape on the sheet and waves a wing. So does the shadow.
- **A friendly monster.** — sets `{"lb-shadow":"monster"}`
    - You make a big shadow with claws. It waves, very politely.
    - **Ned**: Hello, monster.

#### Complete `lb07-complete`

_The show ends with the whole family in the light at once: one big shadow with far too many arms._  
**Maisie**: That was the best show ever made. Clap now.  
_Everyone claps. On the sheet, so do the shadows._  
**Ama Larkin** _(happy)_: Keep the sheet. We’ve got more sheets than beds, it turns out.  
_You take home the sheet on two poles and the torch on a stand, for shows in your own Grove._  

**Rewards**

- Shadow Screen (decor): A white sheet on two poles with a torch on a stand. After dark, Nubbins that pass in front of it cast big shadows.

**Notes:** An evening in the Larkins’ front room. The shadow on the sheet should really scale with distance from the torch (a simple projection of the sprite silhouette), so the child sees the size change. The torch is in the box marked SHOES, a callback to LB1’s kettle. Reward: a shadow-screen decor whose torch lights at dusk.

## LB8. Treasure Map

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB7 is complete: a fine morning, when Ama has the day off and a new pen. Pauses during chapters 9–11; never repeats. · requires: LB7

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Follow Ama’s map down the lane to the X.

Hint: Go in order: the pond, your gate, the big oak, then six big steps to the X. · check: `explore:lb-lane-map`

#### Scene `lb08-map`

_Ama spreads a sheet of paper on the kitchen table. It is a map of the lane, drawn in post-van detail._  
**Ama Larkin**: Every house, every gate, every pothole. I know this lane better than my own feet.  
_There is your pond, your gate that sticks, the big oak, and a red X past the oak, by the old wall._  
_In one corner Ama has drawn a compass, with a fancy N at the top._  
**Ama Larkin**: Maisie hid some treasure this morning. I drew it where she told me.  
**Maisie**: Follow the map. The pond first, then the gate, then the tree, then the X.  
**Ned**: What’s the treasure?  
**Maisie**: A secret. It’s raisins.  

#### Done `lb08-x`

_Pond, gate, tree, then six big steps past the oak to the X. Ned digs with a spoon._  
_There is nothing there but soil and one surprised worm._  
**Ned** _(shock)_: The treasure’s gone!  

### Step 2: Find where Maisie really hid the treasure.

Hint: Use the compass on Ama’s map. Maisie says it went north, along the wall. · check: `find:lb-raisin-tin`

#### Scene `lb08-moved`

**Maisie** _(happy)_: It’s not gone. I moved it, after Mum drew the map.  
**Maisie**: Treasure that’s exactly where the map says is too easy.  
**Ned** _(angry)_: That’s not FAIR.  
_Ned sits down in the lane with his spoon. The worm, sensibly, leaves._  
**Maisie**: It’s still close. It went north. North is the way the river comes from.  
_Ned looks at you. He wants to know whose side you are on._  

**Choices**

- **“Treasure hunts are meant to be a bit tricky.”** — sets `{"lb-map-fair":"fair"}`
    - **Maisie**: See? Tricky is the fun bit.
    - **Ned**: Tricky is the CROSS bit.
- **“A map’s a kind of promise, Maisie.”** — sets `{"lb-map-fair":"promise"}`
    - **Maisie**: …I suppose.
    - Maisie borrows her mum’s pen and draws a small, honest X further along the wall.
- **Ask Maisie why she moved it.** — sets `{"lb-map-fair":"asked"}`
    - **Maisie**: I wanted to be the one who knew something. Ned always finds things first.

#### Complete `lb08-complete`

_The tin is under a flat stone at the foot of the wall, a few steps north. Ned finds it first, of course._  
**Ned** _(happy)_: Raisins!  
_He shares them out in fours: four for Maisie, four for you, four for your Nubbin and four for him._  
**Maisie**: Next time I’ll tell Mum where I really put it. Probably.  
**Ama Larkin** _(happy)_: A map is for keeping, once you’ve used it.  
_Ama puts the map in an old frame from the boxes and gives it to you. It has a second X now, in a six-year-old’s hand._  

**Rewards**

- Ama’s Lane Map (decor): Ama’s hand-drawn map of the lane in an old frame, with a compass in the corner and two Xs: one hers, one Maisie’s.

**Notes:** A short walk down the lane in map order: pond, your gate (the one that sticks), the big oak, the X by the old wall. Show a compass rose on the map overlay with N at the top; north points up the valley, where the river comes from. The real tin is a few steps north of the X. Reward: the framed map as wall decor for the cottage.

## LB9. Café Larkin

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB8 is complete: a warm afternoon, when there is a sign chalked on a tea tray at the Larkins’ gate. Pauses during chapters 9–11; never repeats. · requires: LB8

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Lay the café table: one plate for each person.

Hint: Four people are eating: you, Sam, your Nubbin, and Ama when she gets home. Put a plate at each chair. · check: `place:lb-plates:4`

#### Scene `lb09-cafe`

_A sign is chalked on the back of a tea tray: CAFÉ LARKIN, OPEN, NUBBINS WELCOME._  
_The café is the garden table, with the good tablecloth on it. Ama does not know about the tablecloth yet._  
**Maisie**: I’m the chef. Ned’s the waiter. You’re a customer, and Dad’s a customer.  
**Sam Larkin**: I’ll be the customer who sits down. I’m very good at that.  
**Maisie**: Your Nubbin’s a customer. And Mum, when she gets back from her round.  
**Maisie**: We need the table laid. One plate for each person.  
**Ned** _(think)_: How many persons is that?  

#### Done `lb09-laid`

_Four plates, from the toy box and the kitchen: a blue one, a chipped one, a tin one, and one that is really a frisbee._  
_Your Nubbin sits on a cushion on the fourth chair. It has been given the frisbee, and it approves._  

### Step 2: Order lunch at Café Larkin, and be a kind customer.

Hint: Talk to Ned, the waiter. Whatever arrives, say something kind. · check: `talk:lb-ned:order`

#### Scene `lb09-order`

_Ned brings a menu. It is a drawing of a cake, a drawing of a sandwich, and a drawing of something nobody can identify._  
**Ned**: What would you like?  
**You**: The sandwich, please.  
**Ned** _(happy)_: One sandwich.  
_He goes into the kitchen, which is the shed, and comes back with great ceremony. On your plate is a pine cone._  
**Ned**: Here is your cake.  
_Sam ordered tea and got a stick. Your Nubbin ordered nothing and got three leaves, which it seems to like best of all._  

**Choices**

- **“Thank you! Could I have the sandwich as well?”** — sets `{"lb-cafe-reply":"ask"}`
    - **Ned**: Oh! The sandwich! Coming right up.
    - He comes back with a second pine cone. This one, he says, is the sandwich.
- **Eat the pine cone with great pleasure.** — sets `{"lb-cafe-reply":"enjoy"}`
    - You pretend to eat the pine cone, slowly, with your eyes closed. Ned watches every bite.
    - **Ned**: Is it nice?
    - **You**: Best cake I’ve ever had.
- **“Excuse me. I think there’s been a little mix-up.”** — sets `{"lb-cafe-reply":"mix-up"}`
    - **Ned**: Is it the wrong one?
    - **You**: It’s a lovely cake. I ordered the sandwich, that’s all.
    - **Ned**: I’ll tell the chef. She’ll be cross with the kitchen, not me.

#### Complete `lb09-complete`

_Ama comes home and sits down in her post-office jacket at the fourth plate._  
**Ama Larkin**: Table for one, please. Anything that comes with tea.  
_Ned brings her a real cup of tea, which Sam made, and a pine cone, which Ned made. She is delighted with both._  
**Ama Larkin**: Is that my good tablecloth?  
**Maisie** _(shock)_: Café Larkin is closed now. The chef has to go.  
_Later, Ama rubs the chalk off the tea tray and paints the sign properly, and gives it to you for your gate._  

**Rewards**

- Café Larkin Sign (decor): A tea tray painted CAFÉ LARKIN. NUBBINS WELCOME. Hang it by your gate or over the picnic table.

**Notes:** The garden table at the Larkins’. Four places: you, Sam, your Nubbin, and Ama (who arrives in the complete scene). No real Shells or food change hands; the pine cone and stick are props. All three choices are polite ways to handle a wrong order; Ned is never laughed at. Reward: the painted tea-tray sign, decor.

## LB10. Boats

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: your Grove pond · when: After LB9 is complete: a still, warm day: the Larkins come to your Grove for the first time. Pauses during chapters 9–11; never repeats. · requires: LB9

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Test which of Ned’s things float in the pond.

Hint: Put the cork, the leaf, the pebble and the teaspoon in the shallows one at a time. · check: `collect:lb-boat-things`

#### Scene `lb10-pond`

_The Larkins come through your gate for the first time, in a line, all lifting and pushing at once._  
**Maisie**: We’re making boats. For your pond. We brought things.  
_Ned empties his pockets onto the bank: a cork, a big leaf, a pebble, and a teaspoon from the kitchen drawer._  
**Sam Larkin**: That’s my good teaspoon.  
**Ned**: It’s a boat now.  
**Ama Larkin**: Which ones will float, do you think? Let’s test them before we build anything.  

#### Done `lb10-test`

_One at a time, the things go in the shallows. The cork bobs, and the leaf spins and floats._  
_The pebble goes plop and sits on the bottom. The teaspoon goes plip and joins it._  
**Ned** _(happy)_: The spoon’s a submarine.  
**Sam Larkin**: The spoon is coming out, thank you.  

### Step 2: Sail the boats across the Grove pond.

Hint: Pick a boat and set it on the water at the reeds. The breeze does the rest. · check: `place:lb-boats:pond`

#### Scene `lb10-sail`

_The boats are built on the bank: a cork with a leaf sail, a bark raft with a twig mast, and a walnut shell with a petal._  
**Maisie**: A race! First one across the pond wins.  
_Your Nubbin wades in up to its middle, ready to help. Nubbins love the pond._  
**Ama Larkin**: Which one are you sailing?  

**Choices**

- **The cork, with the leaf sail.** — sets `{"lb-boat":"cork"}`
    - The cork boat leans into the breeze and sets off, steady as a duck.
- **The bark raft.** — sets `{"lb-boat":"raft"}`
    - The raft is slow and flat and sensible. It goes exactly where the breeze tells it.
- **The walnut shell, with Ned.** — sets `{"lb-boat":"walnut"}`
    - The walnut spins in slow circles and goes nowhere at all. Ned thinks it is the best boat of the lot.

#### Complete `lb10-complete`

_The raft wins, in the end, by drifting. Nobody minds, because the walnut is still spinning and Ned is still cheering it._  
_Your Nubbin tows the walnut home, very gently, with its nose._  
**Ama Larkin** _(soft)_: What a pond. You’re lucky, having this on your doorstep.  
**Sam Larkin**: My good teaspoon is still in it.  
_Your Nubbin dives for the teaspoon and brings it back. Sam shakes its wing, very solemnly._  

**Rewards**


**Notes:** The Larkins visit the Grove pond (they lift and push the sticking gate, as everyone does). Sorting beat: cork and leaf float; pebble and a metal teaspoon sink. The boat race is cosmetic: the boats drift on the breeze; your Nubbin swims to help (uses the swim animation). The raft always wins. The family leave by dusk.

## LB11. The Big Race

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB10 is complete: a breezy afternoon in the field behind the Larkins’ cottage. Pauses during chapters 9–11; never repeats. · requires: LB10

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Judge five races in the field behind the Larkins’ cottage.

Hint: Stand at the skipping-rope finish and watch who crosses first. Keep a tally. · check: `watch:lb-five-races`

#### Scene `lb11-course`

_Maisie marks out a racecourse in the field: flowerpots for the start and a skipping rope for the finish._  
**Maisie**: Five races. Me, Ned and your Nubbin. You’re the judge. Dad’s the crowd.  
**Sam Larkin** _(soft)_: Hooray.  
_Sam is lying down beside the finish line, which Maisie says still counts as a crowd._  
**Maisie**: Judges keep a tally. One line for every win.  
**Maisie**: Ready, steady…  

#### Done `lb11-five`

_Maisie wins the first race, and the second. Your Nubbin wins the third by flapping, and the fourth by accident._  
_Maisie wins the fifth. Ned comes last in every one._  
_After the fifth race, Ned lies face down on the grass and does not get up._  

### Step 2: Help with the last race.

Hint: Talk to Ned, face down in the grass, and decide how to run the last race. · check: `race:lb-last-race`

#### Scene `lb11-facedown`

**Maisie**: Come on, Ned. One more race.  
**Ned** _(sad)_: No. I’m never racing again. I’m staying here.  
_His voice comes out muffled, straight into the grass._  
**Maisie** _(think)_: It’s only a game.  
**Ned** _(sad)_: It’s only a game for WINNERS.  
_Maisie looks at you. She is six, and she has won every race she has ever run, and she does not know what to do._  
**Sam Larkin** _(soft)_: Nobody likes losing, mate. Even in a game.  

**Choices**

- **Race properly. Ned can finish, even if he’s last.** — sets `{"lb-race":"proper"}`
    - Ned gets up, slowly. He runs the whole race and comes last, but this time he runs all the way, and you cheer him over the rope.
    - **Ned**: I came last, but I came ALL the way!
- **Everyone slows down so Ned wins.** — sets `{"lb-race":"let-win"}`
    - Everyone jogs, Maisie very slowly and with a face. Ned wins by a mile.
    - **Ned**: I WON! I’m the fastest in the valley!
    - **Maisie**: It wasn’t a real race.
    - Maisie says it quietly, so Ned won’t hear. Then she decides to let him have it.
- **Race holding hands, all together.** — sets `{"lb-race":"hand"}`
    - Maisie holds out her hand to Ned, and he takes it. You all run the last race in a line, holding hands.
    - Nobody wins. Everybody crosses the rope at once.
    - **Maisie**: That’s a draw. Draws are allowed.

#### Complete `lb11-complete`

**Sam Larkin**: Right. The crowd needs a sit-down.  
_Sam sits up in the grass. Ned climbs into his lap with grass stuck to his face._  
**Sam Larkin** _(soft)_: You know what I like about racing with you lot? Somebody always gets up again.  
**Maisie** _(think)_: Next time I’m inventing a game where losing is the winning.  
_Ned picks the grass off his face one bit at a time, and gives every bit to your Nubbin._  

**Rewards**


**Notes:** The field behind the Larkins’ cottage. Step 1 plays the five races as a short watched sequence (Maisie 3 wins, your Nubbin 2, Ned 0) with the tally shown on a card. Step 2 holds the line’s second big choice: in the reader band all three options show; the sprout band drops the choice and defaults to "hand" (see LINE_LB_EDU). lb-race is read in LB12. Ned’s sadness is taken seriously by everyone; nobody laughs at it.

## LB12. The Long Grass Campout

*Inspired by Bluey (Ludo Studio, 2018): an original family and old playground games* · audience: all · where: Learning Grove only: the Larkins’ cottage, past Fern’s · when: After LB11 is complete: a clear evening in late summer (Free Grove: any clear evening). Pauses during chapters 9–11; never repeats. · requires: LB11

**Cast:** Ama Larkin, Sam Larkin, Maisie, Ned

### Step 1: Bring a sleeping bag to the Larkins’ long grass at dusk.

Hint: Carry a sleeping bag from your cottage through the Larkins’ gate before dark. · check: `carry:lb-sleeping-bag`

#### Scene `lb12-tired`

_Late summer. The evenings are long and gold, and the swallows fly low over the Larkins’ field._  
**Ama Larkin** _(soft)_: Sam’s asleep. Before tea. On the sofa, with one shoe on.  
**Ama Larkin**: He finished a whole table this week. He’s allowed.  
**Maisie** _(think)_: We need a game where Dad has to lie down.  
**Ned**: Dad already lies down.  
**Maisie** _(happy)_: A game where lying down IS the game.  
_Maisie explains it at speed: sleeping bags, the long grass, everyone very still, and the first to see a star wins._  
**Ama Larkin**: Camping in the garden? Go on, then. Bring your Nubbin, and a sleeping bag.  

#### Done `lb12-arrive`

_At dusk you carry your sleeping bag through the Larkins’ gate. Sam is awake now, in pyjamas, holding a torch._  
**Sam Larkin** _(happy)_: I hear there’s a game where I have to lie down. I’ve been practising all day.  

### Step 2: Lie still in the long grass and wait for the first star.

Hint: Lie down with the Larkins and keep still. The stars come when they come. · check: `wait:lb-first-star`

#### Scene `lb12-waiting`

_Everyone lies in a row in the long grass: Ama, Sam, Maisie, Ned, you, and your Nubbin, who is already half asleep._  
_The sky goes from gold to pink to a deep, slow blue. A bat flickers over the hedge._  
**Maisie**: The rules. Nobody talks. Nobody wriggles. The first to see a star says STAR.  
_For a long time nobody does anything. It is the stillest the Larkins have ever been._  
**Sam Larkin** _(soft)_: It’s winter in Brisbane now. My mum’s wearing a jumper.  
**Ned**: Why?  
**Sam Larkin**: The world’s tipped a bit. While our half leans towards the sun, her half leans away. Then they swap.  

**Choices**

- **Make a quiet wish for the Larkins.** — sets `{"lb-star-wish":"wish"}`
    - You make a wish. You don’t say it out loud, because that is the rule with wishes.
- **Hum something very quietly.** — sets `{"lb-star-wish":"hum"}`
    - You hum a tune you half remember. After a while Ama hums it too, and gets the end right.
- **Watch your Nubbin fall asleep.** — sets `{"lb-star-wish":"nubbin"}`
    - Your Nubbin’s emote ball dims to a soft glow, and then goes out. It is asleep.

#### Done `lb12-star`

_Ned sees it first: one bright point over the hedge, low in the west._  
**Ned** _(happy)_: STAR!  
**Ama Larkin**: That might be a planet, actually. Never mind. It counts.  
_Then another star, and another, until there are too many to say STAR about, so everyone just looks._  

#### Complete `lb12-complete`

_Sam is asleep again in the long grass, with Ned asleep on his arm. Maisie is trying very hard not to be._  
**Maisie** _(soft)_: That was the best game we ever made up.  
**Ama Larkin** _(soft)_: It was. Lying still together. It’s hard, and you all did it.  
_Your Nubbin is asleep in Ned’s box. Ama looks at it, and then at you._  
**Ama Larkin**: That box should stay out here for good, I think. It’s earned its place.  
_In the morning there is a small painted box on your doorstep with a note: FOR YOUR NUBBIN FROM NED (HE DID THE N)._  

**Rewards**

- Ned’s Box (house, boat or rocket) (decor): A small painted cardboard box from Ned: a house if you chose the big box, a boat if the long one, a rocket if the tall one.

Sets on completion: `{"lb-done":true}`

**Notes:** A clear late-summer evening in the field behind the Larkins’ cottage; the sky fades gold → pink → blue and stars appear one by one (the first, low in the west, may be Venus). After lb12-arrive, play lb12-ned-<lb-race> (proper | let-win | hand; default hand) and then lb12-box-<lb-box> (big = house, long = boat, tall = rocket; default big). Reward: the small decor box in the form matching lb-box. Tier 2, Learning Grove only, after lb-done: washing flaps on the Larkins’ line, Ned waves from their gate as you pass, and Ned’s big box sits in their garden for good as a house, boat or rocket (ambient art only, no dialogue). The Larkins never appear in campaign scenes and hold no lantern at the Long Night.

## Variant scenes

#### Variant `lb06-door-big`

_The big box goes on its side at the front of the den, flaps open. You can crawl through it without bending your neck._  
**Ned** _(happy)_: It’s a front door. With a roof on the door.  
**Maisie**: You have to knock first. That’s the rule.  

#### Variant `lb06-door-long`

_The long box lies flat at the front of the den, open at both ends. You have to crawl through it like a tunnel._  
**Ned** _(happy)_: It’s a tunnel door. You have to wriggle.  
_Your Nubbin wriggles through first, gets stuck halfway, and then gets unstuck._  

#### Variant `lb06-door-tall`

_The tall box stands at the front of the den with a hole cut low in one side. You step in, then duck down into the den._  
**Ned** _(happy)_: It’s a lift. It goes DOWN to the den.  
**Maisie**: Lifts don’t… Fine. It’s a lift.  

#### Variant `lb12-ned-proper`

_Ned arrives at a run, in his pyjamas, shouting. He has been proud of himself all week._  
**Ned** _(happy)_: I’m here! I’m the one who came last ALL the way!  
**Sam Larkin** _(soft)_: Loudest camper in the valley. Love it. Shh now.  

#### Variant `lb12-ned-let-win`

_Ned strolls in with his sleeping bag over his shoulder like a cape, a bit too pleased with himself._  
**Ned** _(happy)_: Make way for the fastest boy in the valley.  
**Maisie**: He’s been saying that for a week.  
_Maisie lets him say it once more. Then she gives him a look, and he stops, mostly._  

#### Variant `lb12-ned-hand`

_Ned arrives holding Maisie’s hand. He has hardly let go of it since the race, Ama says._  
**Ned** _(soft)_: We’re a team. Teams hold hands.  
**Maisie**: Only sometimes. But tonight, yes.  

#### Variant `lb12-box-big`

_Ned’s box is out in the long grass, on its side, with a tea towel for a curtain. Tonight it is a house._  
**Ned**: It’s our house. You can sleep in it if you’re small.  
_Your Nubbin is small. It goes straight in._  

#### Variant `lb12-box-long`

_Ned’s box lies in the long grass with a broom-handle mast and a pillowcase sail. Tonight it is a boat._  
**Ned**: We’re sailing to the stars. Everybody get in.  
_Nobody fits but Ned and your Nubbin. Everyone else sails alongside, lying very still._  

#### Variant `lb12-box-tall`

_Ned’s box stands in the long grass with a paper cone on top and NED ROCKET down the side. Tonight it is a rocket._  
**Ned** _(happy)_: Ten, nine… seven… one. Blast off!  
_Ned lies down next to it. The rocket stays exactly where it is, which is how the best rockets work._  
