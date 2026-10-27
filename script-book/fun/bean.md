# Fun quests: Mr. Bean (Q21–Q30)

## Q21. Bear Comes Too

*Mr. Bean: Teddy* · audience: all · where: Mr. Tweed’s gate, at the end of the lane · when: Any morning after Chapter 2 (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Follow Mr. Tweed’s pointing down to the pond and look for a clue.

Hint: Search the reeds on the near side of the pond. Clues sparkle faintly when you are close. · check: `find:clue:bear-scarf:pond`

#### <a id="q21-intro"></a>Scene `q21-intro`

_A man in a tweed jacket is standing at his gate, patting every pocket he owns. Some of them twice._  
_He checks inside his hat. He checks under a stone. He lifts a sleeping duck, looks underneath, and puts it back with an apologetic pat._  
_This is Mr. Tweed. He lives at the end of the lane and has never, as far as anyone knows, finished a sentence._  
**Mr. Tweed** _(think)_: Hnn.  
_He holds his hands apart, about the size of a loaf. Then he hugs the empty air, very tenderly._  
_He points at the empty space in his arms, then at you, then at the empty space again, with feeling._  
**You**: Something’s missing?  
**Mr. Tweed** _(sad)_: Bear.  
_He makes two little ears on top of his head with his fingers, in case you were unclear on the bear._  
_Then he points down the lane towards the pond, very firmly, and nods as if that settles everything._  

**Choices**

- **I’ll help you look.**
    - **Mr. Tweed**: Mm!
    - He shakes your hand with both of his, for slightly too long.
- **What does the bear look like?**
    - He mimes: small, brown, one chewed ear, and an expression of enormous dignity.
    - You are not sure how he mimed the dignity. But he did.
- **Ask your Nubbin to sniff it out.** — sets `{"q21-sniffer":true}`
    - Your Nubbin sniffs Mr. Tweed’s sleeve, sneezes, and trots off towards the pond.
    - **Mr. Tweed**: Ah!

#### <a id="q21-scarf"></a>Done `q21-scarf`

_In the reeds you find a tiny knitted scarf: bear-sized, slightly damp._  
_Mr. Tweed arrives at a jog, sees the scarf, and clutches it to his chest._  
**Mr. Tweed** _(soft)_: Ohh.  
_He looks at the empty pond, then at the sky, and sulks so hard his whole face folds in._  

### Step 2: Follow the little wild Nubbin up the hill and find where it took the bear.

Hint: Wild Nubbins nest in the long grass near the top of the western hill. Walk slowly, or it will hide. · check: `find:item:tweed-bear`

#### <a id="q21-sulk"></a>Scene `q21-sulk`

_Mr. Tweed sits on a rock and sulks. It is a professional sulk, with the bottom lip and everything._  
_Every so often he glances up the western hill, then away, then up again._  
**You**: Is the bear up there?  
_He shrugs. It is a very small shrug, about the size of a bear._  
_Then he points at a wild Nubbin waddling uphill with something brown in its arms._  
**Mr. Tweed** _(angry)_: Hm!  
_He stands, marches three steps after it, remembers he is sulking, and sits back down._  
_He folds his arms. The sulk resumes, slightly louder, for the benefit of anyone watching._  
_He waves you on: this is your job now. He has a sulk to finish._  

#### <a id="q21-nest"></a>Done `q21-nest`

_In a nest of grass at the top of the hill, a wild Nubbin is fast asleep, cuddling a small brown bear._  
_The bear has one chewed ear and, somehow, an air of great dignity._  

**Choices**

- **Ease the bear out gently.**
    - The Nubbin stirs, sighs, and lets go. You leave it a piece of fruit to cuddle instead.
- **Offer the little scarf in trade.** — sets `{"q21-scarf-swap":true}`
    - The Nubbin sniffs the scarf and wraps it round its own neck, looking very smart. Fair trade.
    - Mr. Tweed may have opinions about the scarf.

### Step 3: Bring Bear back down to Mr. Tweed.

Hint: Mr. Tweed is still on his rock by the pond. Hand him the bear with Give. · check: `give:item:tweed-bear:mr-tweed`

#### <a id="q21-carry"></a>Scene `q21-carry`

_The bear is lighter than it looks, and it looks very light._  
_Your Nubbin wants to carry it. It holds the bear the way Mr. Tweed did, which is to say, very seriously._  
_Down by the pond, a tweed shape is still sulking on its rock._  
_He has not seen you yet. He is pretending very hard not to look up the hill._  
_Your Nubbin hides the bear behind its back. The bear is wider than its back._  
**You** _(happy)_: Ready? Surprise him.  

### Complete

#### <a id="q21-complete"></a>Complete `q21-complete`

_Mr. Tweed sees the bear. His face unfolds all at once, like a deckchair._  
**Mr. Tweed** _(happy)_: Teddy!  
_He hugs the bear, checks its ear, checks its other ear, and tucks it into his top pocket so only its head shows._  
_Then he notices your Nubbin, who is gazing at the bear with great longing._  
_Mr. Tweed holds up one finger. He rummages in his jacket, then his trousers, then, briefly, his sock._  
_He produces a second bear, no bigger than a thumb, and places it solemnly on your shoulder._  
**Mr. Tweed** _(soft)_: Bear.  
_It stays there. It seems to like the view._  
_That evening, through his window, you see him lay the table: two plates, one very small. He pulls out the small chair first._  

**Rewards**

- Shoulder Bear (cosmetic): A tiny plush bear that rides on your Keeper’s shoulder. Toggle it in the wardrobe.

**Learning Grove swaps**

- `q21-complete#1` → Bear! My bear!

**Notes:** Introduces Mr. Tweed (later quests assume the player has met him, but do not require it). He needs a mime-heavy portrait set: think, sad, happy, angry, shock, soft, plus a "sulk" pose on the rock. His voice is a short mumble blip, never real speech. Props: bear-sized scarf (sparkles in the reeds), Mr. Tweed’s bear (brown, one chewed ear), a thumb-sized shoulder bear. The wild Nubbin on the hill flees if the player runs; walking reaches it. "Teddy!" is the one approved source quote, used once; Learning Grove swaps it via childLines. If the player chose "swap", the wild Nubbin keeps wearing the scarf afterwards. The table-for-two beat at the end is a short exterior shot through his lit window at dusk; after this quest his cottage window shows it every evening.

## Q22. The Armchair Drive

*Mr. Bean: driving from an armchair tied to the car roof* · audience: all · where: Market stalls by the Grove gate · when: Any afternoon (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Help Mr. Tweed tie the armchair on top of his hand cart.

Hint: Use rope from your bag on the cart, then tap each corner of the chair to tie it down. · check: `tie:decor:armchair:tweed-cart`

#### <a id="q22-shop"></a>Scene `q22-shop`

_At the market, Mr. Tweed has bought an armchair. It is green, deep and enormous._  
_His hand cart is next to it. The hand cart is roughly the size of the armchair’s cushion._  
_He lifts one end of the chair and looks at the cart. He puts it down and lifts the other end, in case that end is smaller._  
**Mr. Tweed** _(think)_: Hnn.  
_He tries the chair upside down, then on its side. Then he tries sitting in it and pushing the cart with his feet._  
_Then a light comes on behind his eyes. He points at the chair, then at the top of the cart, then mimes a knot._  
**Mr. Tweed** _(happy)_: Rope!  
_He looks at you the way people look at someone who definitely has rope._  

**Choices**

- **Hand over some rope.**
    - He takes it with a little bow and starts a knot that goes under, over, and somehow through himself.
- **Is this a good idea?** — sets `{"q22-doubted":true}`
    - **Mr. Tweed**: Mm.
    - He nods firmly, which answers a different question. You fetch some rope.
- **We could just carry it.**
    - He looks at you, at the chair, at the long road home, and gives a tiny, pitying shake of the head.

#### <a id="q22-tied"></a>Done `q22-tied`

_The chair sits on top of the cart, tied at all four corners and once, by accident, to a lamp post._  
_You untie the lamp post. Mr. Tweed climbs up into the armchair and settles in, very pleased._  
_He takes a long stick, pokes the ground behind him, and the cart begins to roll._  

### Step 2: Clear the path to Mr. Tweed’s house before the cart gets there, without anything falling off.

Hint: Lift the branch, carry the sleeping Nubbin to the verge, and unhook the washing line. The cart never stops. · check: `escort:tweed-cart:tweed-cottage:no-drops`

#### <a id="q22-road"></a>Scene `q22-road`

_The cart wobbles off down the lane. Mr. Tweed steers from the armchair by leaning, and now and then by stick._  
_He cannot see the ground. He can see the sky, the trees and the birds, which he waves at._  
**Mr. Tweed** _(happy)_: Ooh.  
_Ahead: a fallen branch, a Nubbin asleep in the middle of the path, and a rather low washing line._  
_You will have to run ahead and clear the way. Anything that hits the cart falls off the cart._  
_Including, probably, Mr. Tweed._  
_Then the lane tips downhill. The cart notices at once and speeds up._  
_Mr. Tweed notices much later. He grips the armrests and lifts both feet off the ground, as if that will help._  

**Choices**

- **Sprint ahead.**
    - You sprint. Behind you, Mr. Tweed hums a little driving tune of his own invention.
- **Send your Nubbin to wake the sleeper.** — sets `{"q22-nubbin-help":true}`
    - Your Nubbin trots ahead and pokes the sleeping one. It rolls over, which is not the same as moving.

#### <a id="q22-arrive"></a>Done `q22-arrive`

_The cart rolls up to Mr. Tweed’s gate and stops against it with a gentle bonk._  
_His hat flies off. He catches it with one foot, flicks it back onto his head, and looks round to see if anyone saw._  
_Nothing has fallen off, technically. Mr. Tweed checks himself, the chair and the stick, in that order._  
**Mr. Tweed** _(happy)_: Ha!  

### Complete

#### <a id="q22-complete"></a>Complete `q22-complete`

_Mr. Tweed climbs down, looks at the chair, looks at his small front door, and goes very quiet._  
_The chair will not fit through the door. He measures both with his hands, three times, hoping._  
**Mr. Tweed** _(sad)_: Hnn.  
_Then he unties the chair, pushes it towards you and pats it twice. It is yours; he has no room._  
_He pats the cart too. He mimes running, then riding, then points at your legs and shakes his head: much faster._  
_The cart is yours as well. He has, apparently, gone off carts._  
_As you leave, he carries a small kitchen chair out to his front garden and sits in the sun, entirely satisfied._  
_The kitchen chair has one short leg, and it tips. He stays exactly where it tips him, at an angle, still entirely satisfied._  
_He pats the space next to him. There is no space next to him. You sit on the wall, and for a while you both watch the lane._  

**Rewards**

- Tweed’s Armchair (decor): A deep green armchair for the cottage or garden. Nubbins like to nap in it.
- Hand Cart (feature): A rideable cart. Moves faster than Run and carries one extra Nubbin along with you.

**Notes:** Adapts the car-roof armchair gag to a hand cart. Step 2 is an escort run: the cart rolls at a fixed pace along the lane on rails; the player must clear three obstacles (branch, sleeping Nubbin, washing line) before it reaches each. If the cart hits one, the chair wobbles, Mr. Tweed grabs the armrests ("Hnn!"), and the run restarts from the market with no penalty. Sound: rope creak, cart rattle, a hummed tune (original, wordless). The Hand Cart is used again in Q30. The downhill stretch speeds the cart up by about a quarter for the last obstacle; the hat-catch at the gate is a fixed animation, not a fail.

## Q23. Pumpkin Head

*Merry Christmas, Mr. Bean: the turkey on his head* · audience: all · where: The pumpkin patch · when: Harvest season (autumn), daytime (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Calm the wandering pumpkin so it stops bumping into things.

Hint: Tap the pumpkin and choose Pet. A calm Nubbin sits still and listens. · check: `pet:nubbin:pumpkin`

#### <a id="q23-patch"></a>Scene `q23-patch`

_It is harvest time, and the pumpkin patch is fat and orange._  
_One pumpkin is moving: left, then right, then gently into a fence post. It goes “mff”._  
_Mr. Tweed is already crouched beside it, studying it with enormous concentration._  
_He knocks on the pumpkin. The pumpkin knocks back._  
**Mr. Tweed** _(shock)_: Oh!  
_Two little feet stick out of the bottom. A curious Nubbin climbed in to eat the middle and cannot find the way out._  
_Mr. Tweed grabs the stalk and braces one foot against the pumpkin, ready to pull with all his might._  

**Choices**

- **Stop! Not like that.**
    - He freezes mid-heave, one foot raised, and slowly lets go of the stalk.
    - **Mr. Tweed**: Mm.
- **Help him pull.** — sets `{"q23-pulled":true}`
    - You both pull, and the pumpkin squeaks. The Nubbin inside squeaks louder.
    - You both let go at once and pretend that did not happen.
- **Watch which way it wriggles.**
    - The pumpkin rocks left, right, left. There is a rhythm to it. The Nubbin is trying to wiggle out.

#### <a id="q23-calm"></a>Done `q23-calm`

_You pat the pumpkin. It stops wandering and sits down with a soft thump._  
_From inside comes a small, contented hum. Mr. Tweed puts his ear to it and nods, professionally._  

### Step 2: Free the Nubbin with three gentle wiggles, in time with the beat.

Hint: Tap when the pumpkin glows: tap, tap, tap. Pulling only makes it squeak. · check: `minigame:wiggle:pumpkin:3-beat`

#### <a id="q23-wiggle"></a>Scene `q23-wiggle`

_Mr. Tweed holds up three fingers. He mimes a tiny wiggle, wiggle, wiggle, and then a pop._  
_He looks very proud of this plan. It is, to be fair, a good plan._  
_You put both hands on the pumpkin. Inside, the Nubbin goes still and listens._  
**Mr. Tweed** _(think)_: One…  
_He conducts the air with one finger, like a very small orchestra._  
_He gets carried away. Both arms. A slow, swelling crescendo. Inside the pumpkin, the Nubbin begins to hum along._  
**You** _(soft)_: Gently. On the beat.  

#### <a id="q23-pop"></a>Done `q23-pop`

_On the third wiggle there is a soft pop, and the Nubbin slides out in a shower of seeds._  
_It is orange to the elbows and smells wonderful. It looks at the empty pumpkin, and its lip wobbles._  

### Complete

#### <a id="q23-complete"></a>Complete `q23-complete`

_The Nubbin climbs straight back into the pumpkin. Head first, bottom up._  
_You and Mr. Tweed look at each other._  
_He lifts it off, scoops it clean with a spoon from his top pocket, then cuts two neat eyeholes and a wider neck with a butter knife from his sock._  
_He pops it on the Nubbin like a hat, and it fits perfectly. The Nubbin turns slowly in a circle, delighted._  
_Then he tries one on himself, to show solidarity. It fits less well._  
_He walks into the fence post and apologises to it. He walks into the scarecrow and shakes its hand._  
**Mr. Tweed**: Mff.  
_It takes you, the Nubbin, a spoon and a firm tug on each ear to get it off. He emerges orange to the eyebrows, and very dignified._  
_He presents you with a third one: smaller, neater, with a curly stalk on top._  
_The Nubbin wears its pumpkin all afternoon, peering out of the eyeholes. By evening a second Nubbin has queued behind it, with its own pumpkin._  
_Mr. Tweed is pretending to be in a different queue._  

**Rewards**

- Pumpkin Hat (cosmetic): A hollowed-out pumpkin hat with a curly stalk. Fits Keepers and Nubbins alike.

**Notes:** Only offered in the harvest season. The stuck Nubbin is a wild one, or one of the player’s own if any is nearby and curious-personality. Step 2 is a three-tap rhythm minigame at about 90 BPM: the pumpkin glows on each beat. Mistimed taps or holding to pull play a squeak and restart the count; there is no fail state. Art: walking pumpkin with feet, pumpkin-hat sprite for Keeper and Nubbin, Mr. Tweed with a pumpkin stuck on his head (brief comic beat). Sound: hollow knock, muffled hum, soft pop.

## Q24. The Exam

*Mr. Bean: the exam* · audience: all · where: The Kindergarten · when: A weekday morning, once one of your Nubbins has taken a Kindergarten lesson (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean), Mrs Inkwell

### Step 1: Shuffle your Nubbin’s answers three times to throw Buttons off.

Hint: When Buttons leans over, tap your Nubbin’s paper to slide it somewhere new. Three times does it. · check: `minigame:shuffle:exam-paper:3`

#### <a id="q24-desks"></a>Scene `q24-desks`

**Mrs Inkwell** _(happy)_: Test day! Two Nubbins, two desks, one paper each. Shapes, colours and counting to five. No talking.  
_Your Nubbin takes the left desk. On the right sits Buttons, Mr. Tweed’s Nubbin, in a matching tweed waistcoat._  
_Mr. Tweed stands behind Buttons, pointing at the paper, then at Buttons’ head, then making a small, encouraging fist._  
**Mrs Inkwell**: Keepers may stay, but quietly. Very quietly. I am looking at you, Mr. Tweed.  
_He mimes zipping his lips shut, locking them, and posting the key into his pocket. Then he checks the pocket._  
_The test begins. Your Nubbin licks its pencil and draws a perfect circle._  
_Buttons draws nothing. Buttons leans very, very slowly to the left._  
_Behind Buttons, Mr. Tweed drops a pencil, bends very slowly to fetch it, and reads your Nubbin’s paper upside down on the way._  

**Choices**

- **Nudge your Nubbin to cover its paper.**
    - Your Nubbin curls an arm round its work. Buttons leans further. Buttons’ chair creaks.
- **Let it look. Sharing is nice.** — sets `{"q24-shared":true}`
    - **Mrs Inkwell**: Eyes on your own paper, please, Buttons.
    - Buttons sits bolt upright and tries to whistle innocently, which Nubbins cannot do.
    - **Mrs Inkwell**: Sharing your rubber is sharing, dear. Sharing your answers is a shortcut with a nice name.
    - Mr. Tweed slides his own paper under his elbow, very casually, and looks at the ceiling.
- **Look at Mr. Tweed.**
    - Mr. Tweed is studying the ceiling, hands behind his back, with the face of a man who has never met Buttons.

#### <a id="q24-shuffled"></a>Done `q24-shuffled`

_Left, right, under the desk. Buttons follows the paper with Buttons’ whole body, and on the third shuffle falls off its chair._  
_Mr. Tweed, who had been leaning with it, falls over too, and pretends he was inspecting the floor._  
**Mrs Inkwell** _(shock)_: Buttons? Are you all right?  
_Buttons is fine. Buttons’ paper is still completely blank._  

### Step 2: At break, help Buttons learn its shapes, then make sure both Nubbins pass.

Hint: Practise shapes with Buttons on the chalkboard, then let both Nubbins finish the test. · check: `pass:kindergarten:test:both`

#### <a id="q24-break"></a>Scene `q24-break`

_Buttons climbs back onto the chair and looks at the blank paper. Buttons’ ears droop all the way down._  
_Behind it, Mr. Tweed’s ears somehow droop too._  
**Mr. Tweed** _(sad)_: Hnn…  
_He points at Buttons, then at the paper, then clasps his hands together, pleading._  
**Mrs Inkwell**: Pencils down, everyone, it’s break. You may help each other at break, by all means. That’s learning, not copying.  
**You**: Right, Buttons. Circles first.  
_Buttons gazes up at you with the solemn trust of a creature that has never drawn a circle._  

#### <a id="q24-pass"></a>Done `q24-pass`

**Mrs Inkwell** _(happy)_: Two passes! Buttons, that is the roundest circle I have ever seen. It is very nearly a circle.  
_Buttons holds its paper up to Mr. Tweed with both arms._  

### Complete

#### <a id="q24-complete"></a>Complete `q24-complete`

_Mr. Tweed lifts Buttons into the air like a trophy and does a slow, silent lap of the classroom._  
**Mrs Inkwell**: Mr. Tweed. Please put the Nubbin down.  
_He puts Buttons down and shakes your hand, then your Nubbin’s, then Mrs Inkwell’s, who did not offer it._  
**Mrs Inkwell** _(soft)_: You know, these two learn better together. Bring them as a pair and I’ll teach them both for one fee.  
_Buttons and your Nubbin are already sitting side by side, drawing circles on each other’s papers._  
_Mr. Tweed lingers. He looks at the little desks, then at Mrs Inkwell, and holds up one finger, hopefully._  
**Mrs Inkwell** _(soft)_: …One paper. Just the one.  
_He folds himself into the tiny desk, which takes some time, licks his pencil, and draws a circle with his tongue out._  
_It is not a very good circle. He holds it up to Buttons anyway, both arms, and Buttons claps._  

**Rewards**

- Study Buddies (feature): Two Nubbins can take a Kindergarten lesson together for the price of one.

**Notes:** Mrs Inkwell is the Kindergarten teacher; if the Kindergarten already has a teacher NPC, give these lines to them instead. Buttons is Mr. Tweed’s Nubbin (round, tweed waistcoat); reuse it in later cameos. Step 1 minigame: Buttons leans on a slow telegraphed timer; tap your Nubbin’s paper to slide it to one of three spots; three successful dodges complete it, a miss just resets Buttons’ lean. Step 2 is a short shapes tutorial, then both Nubbins auto-pass. Cheating is never rewarded; helping at break is the point. Mr. Tweed squeezing into the tiny desk at the end needs a cramped sit pose; his circle is visibly lopsided.

## Q25. The High Dive

*Mr. Bean: the high diving board* · audience: all · where: The waterfall pool · when: A warm afternoon (summer) (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Get Mr. Tweed off the ledge: coax him down, or let a brave Swim Nubbin show him how.

Hint: Call up to him with Talk to coax him down a step at a time, or take a strong swimmer to the ledge and tap Dive. · check: `rescue:mr-tweed:waterfall-ledge`

#### <a id="q25-ledge"></a>Scene `q25-ledge`

_Mr. Tweed is at the waterfall in a striped bathing suit, doing warm-up stretches that mostly involve his eyebrows._  
_He points up at the high ledge beside the falls, then at himself, then mimes a perfect swallow dive._  
**Mr. Tweed** _(happy)_: Hup!  
_He climbs, and it takes a while. Halfway up he stops to wave at you, and very nearly does not start again._  
_At the top he walks to the edge, looks down, and becomes a statue._  
_A long time passes, and a small bird lands on his head. He does not move._  
_A queue forms behind him: three small Nubbins, waiting politely for their turn._  
_One by one they squeeze between his ankles and dive. He watches each one go, then looks at the water as if it has betrayed him._  
**Mr. Tweed** _(shock)_: Hnn.  
_Very carefully, without moving anything else, he mimes two fingers walking backwards. He would like to come down now._  

**Choices**

- **Talk him down, one step at a time.** — sets `{"q25-way":"coax"}`
    - **You**: You’re fine! One foot back. Just one.
    - **Mr. Tweed**: Mm…
- **Ask a Swim Nubbin to show him how.** — sets `{"q25-way":"show"}`
    - Your Nubbin looks at the ledge, at the water, and back at you, with dawning delight.

#### <a id="q25-down"></a>Done `q25-down`

_Step by step, or splash by splash, Mr. Tweed gets off that ledge. The last bit is mostly sliding._  
_He lands in the shallows with a slap, sits up, and finds the bird is still on his head._  
**Mr. Tweed** _(happy)_: Mm!  

### Step 2: Build a low diving board at the pond with Mr. Tweed.

Hint: Set the plank on the flat rock at the pond’s edge, then hammer it in with three taps. · check: `build:decor:diving-board:pond`

#### <a id="q25-board"></a>Scene `q25-board`

_Back on dry land, Mr. Tweed dries off with a towel the size of a handkerchief._  
_He looks at the high ledge, then at the low flat rock by the pond. He holds his hands a little apart._  
_He mimes sawing, hammering, and a gentle bounce. A board: a low one._  
**Mr. Tweed** _(happy)_: Small.  
_Your Nubbin is already bouncing on the spot. It would like to go first._  
_Mr. Tweed produces a plank from somewhere inside the towel and hands it to you._  

### Complete

#### <a id="q25-complete"></a>Complete `q25-complete`

_The diving board is low, springy and slightly crooked. It is perfect._  
_Your Nubbin goes first: bounce, bounce, splash. It comes up grinning, and paddles back noticeably faster._  
_Then Mr. Tweed walks to the end, looks down at the water, all of one foot below, and freezes._  
_You wait, and your Nubbin waits. The bird comes back and lands on his head again._  
_Then he holds his nose, shuts his eyes, and steps off like a man stepping off a kerb._  
**Mr. Tweed** _(happy)_: Ha!  
_He climbs out and does it nine more times. The board is yours to keep; he will visit._  

**Rewards**

- Diving Board (decor): A low, springy diving board at the pond.
- Diving Practice (feature): Nubbins who dive from the board gain extra Swim lean.

**Notes:** Two routes through step 1, both completing the same check. "coax": three Talk prompts, each moves him one step down the rocks, last one he slides into the shallows. "show": take a Nubbin with decent Swim to the ledge and tap Dive; it dives neatly, Mr. Tweed copies, belly-flops, comes up fine. Keep it light: nobody is hurt, no real heights advice. Art: striped bathing suit, statue pose with bird on head, tiny towel, crooked board. The board is placed on the home pond regardless of where the waterfall is.

## Q26. The Park Bench Sandwich

*Mr. Bean: making a sandwich in the park* · audience: all · where: The bench by the pond · when: Midday, fine weather (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Hand Mr. Tweed the right things, in the right order, as he mimes for them.

Hint: Watch his hands: a sawing mime means bread, a shake means pepper. Wrong items get handed politely back. · check: `minigame:hand-over:picnic:6`

#### <a id="q26-bench"></a>Scene `q26-bench`

_Mr. Tweed sits on the bench by the pond. There is a small brass plate on it with his name. He brought it himself, and screwed it on._  
_He opens his coat and begins unpacking lunch from places lunch should not be._  
_A whole loaf from his left sleeve, a lettuce from his inside pocket, and a jar of jam from somewhere near his knee._  
_A tomato, a pepper pot, a pat of butter from his breast pocket, and a small, warm flask from under his hat._  
_He lines them up along the bench, admires them, and spreads jam on the lettuce._  
**Mr. Tweed** _(think)_: Hm?  
_He looks at the lettuce, then at the jam. Something has gone wrong and he cannot say what._  
_Your Nubbin climbs up beside him, very interested in the jam._  

**Choices**

- **Offer to pass him things.**
    - He nods gravely and holds out one hand, palm up, like a surgeon.
- **Try a bite of the jam lettuce.** — sets `{"q26-jam-lettuce":true}`
    - It is crunchy, sweet and wrong. Mr. Tweed watches your face closely, then nods: wrong, he knew it.
- **Let your Nubbin have the jam.**
    - Your Nubbin puts its whole face in the jar. Mr. Tweed produces a second jar from his other knee.

#### <a id="q26-sandwich"></a>Done `q26-sandwich`

_Bread, butter, lettuce, tomato, a shake of pepper, bread on top. Pat, pat._  
_Mr. Tweed holds the finished sandwich up to the light, like a jeweller._  
_A duck lands on the bench. It looks at the sandwich, then at Mr. Tweed. A long, silent negotiation takes place._  
_The duck leaves with the jam lettuce. Mr. Tweed lets it. He never trusted the jam lettuce._  
**Mr. Tweed** _(happy)_: Ahh.  

### Step 2: Spread the picnic blanket and share the sandwich with every Nubbin there.

Hint: Lay the blanket on the grass by the bench, then tap each Nubbin on it and choose Feed. · check: `feed:nubbins:picnic-blanket:all`

#### <a id="q26-share"></a>Scene `q26-share`

_He is about to take the first bite when he notices: you have no sandwich. Your Nubbin has no sandwich._  
_Several wild Nubbins have gathered quietly behind the bench. They have no sandwich either._  
_Mr. Tweed looks at his sandwich, then at all of them, and sighs a sigh from the bottom of his boots._  
_He takes a ruler from his coat, because of course he has a ruler, and cuts the sandwich into very exact squares._  
_He points at a flat patch of grass, then flaps an imaginary cloth._  
**Mr. Tweed**: Picnic.  
_He pulls a checked blanket out of his coat. It is bigger than the coat._  

### Complete

#### <a id="q26-complete"></a>Complete `q26-complete`

_Everyone gets a square. Mr. Tweed takes the last one, which is mostly crust, and eats it as if it were cake._  
_It is the first time in years he has needed the ruler._  
_The duck comes back for the crust. Mr. Tweed measures it with the ruler, finds it over regulation size, and gives it half anyway._  
_The Nubbins sit in a sleepy pile on the blanket, sticky and full and very happy._  
_Mr. Tweed goes to fold the blanket, looks at the pile of sleeping Nubbins, and quietly leaves it where it is._  
_He tips his hat to you. The blanket is yours now; the Nubbins have decided._  

**Rewards**

- Picnic Blanket (decor): A checked picnic blanket for the garden.
- Shared Picnics (feature): Nubbins who eat together on the picnic blanket gain extra happiness.

**Notes:** Step 1 hand-over minigame: six rounds; Mr. Tweed mimes an item (sawing = bread, spreading = butter, tearing = lettuce, slicing = tomato, shaking = pepper, sawing again = top slice). The player taps the item on the bench. A wrong item: he looks at it, hands it back, mimes again. No fail state. Props pop out of odd pockets (sleeve, knee, hat) with a little "fwip" sound. Step 2 needs 3–5 wild Nubbins near the bench; any of the player’s Nubbins nearby join in and count. Props: a small brass name plate on the bench (stays after the quest) and a duck that flies off with the jam lettuce in step 1’s done scene.

## Q27. The Ruined Portrait

*Bean (1997): the ruined painting* · audience: all · where: The Keepers’ Hall · when: A rainy afternoon (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean), Warden Pryce

### Step 1: Bring three Nubbins into the hall and line them up like the Nubbins in the portrait.

Hint: Carry or call Nubbins into the hall. Mr. Tweed’s chalk marks on the floor show where each one sits. · check: `gather:nubbins:keepers-hall:3`

#### <a id="q27-hall"></a>Scene `q27-hall`

_The Keepers’ Hall smells of floor polish. On the far wall hangs the Founders’ Portrait: two stern old Keepers and three Nubbins._  
**Warden Pryce**: Mr. Tweed is cleaning the portrait today. Supervised. I’ll be back within the hour. Touch nothing but the frame.  
_The Warden leaves. Mr. Tweed bows to the portrait, dabs it with a wet cloth, and his nose begins to twitch._  
_He holds the twitch in, then holds it in harder. His face goes through every colour._  
**Mr. Tweed** _(shock)_: Hah… hah…  
_The sneeze is enormous. The wet cloth flies out of his hand and lands across both founders._  
_When he peels it off, the founders have smudged into one very wide founder with four ears._  
_He dabs at it with his handkerchief. Now there is a nose where one of the ears was._  
_He tries the pencil from behind his ear. The founder now has spectacles, and an expression of total surprise._  
**Mr. Tweed** _(shock)_: Oh.  
_He looks at the door, then the clock. Then he looks at you, and mimes a small, desperate prayer._  

**Choices**

- **We can fix this. Probably.**
    - He grips your hand gratefully and gets cleaning fluid on it.
- **We should tell the Warden.** — sets `{"q27-wanted-to-tell":true}`
    - He nods slowly, then points at the clock, the portrait and you. Try first, then tell.

#### <a id="q27-lined"></a>Done `q27-lined`

_Three Nubbins in a row, more or less. One is facing the wrong way, and one is asleep._  
_Mr. Tweed has drawn the plan on the floor in chalk: two chairs, three Nubbins, one camera. Yours._  

### Step 2: Take a Photo mode shot that matches the Founders’ Portrait.

Hint: Use the self-timer in Photo mode and sit in the empty chair. The outline turns green when the poses line up. · check: `photo:match:founders-portrait`

#### <a id="q27-pose"></a>Scene `q27-pose`

_Mr. Tweed hangs a dark curtain behind the Nubbins and drags two chairs into place, just like the portrait._  
_He sticks on a grey moustache and offers you one. It is the same moustache; he has torn it in half._  
_He sits, rests one hand on his knee, and gazes into the middle distance with the face of a founder._  
_The Nubbins copy him, all three gazing into the middle distance. One falls asleep doing it._  
**Mr. Tweed**: Shh.  
_He nods at your camera, then the portrait, then holds up one finger: one go. The clock is ticking._  
**You**: Everybody hold still…  

#### <a id="q27-shot"></a>Done `q27-shot`

_Click. The picture comes out stern, dignified and very nearly right._  
_One Nubbin is yawning, but if you squint, so was one in the original._  

### Step 3: Hang the frame back on its hook before the Warden walks in.

Hint: Tap the hook to hang the frame, then tap it again to straighten it. Two quick taps. · check: `place:photo:keepers-hall:founders-frame`

#### <a id="q27-swap"></a>Scene `q27-swap`

_Footsteps in the corridor. The Warden is early._  
_Mr. Tweed lifts the frame down, slides the smudged canvas out, and hides it up the back of his jacket._  
_You slot the photo into the frame, and it is slightly too small. He stuffs the gap with his handkerchief._  
_He hangs it. It is crooked. He straightens it, and the other side drops. He straightens that, and the first side drops._  
**Mr. Tweed** _(shock)_: Quick!  
_The footsteps stop outside the door._  
_The door handle begins, very slowly, to turn._  

### Complete

#### <a id="q27-complete"></a>Complete `q27-complete`

_The Warden walks in and looks at the portrait for a long, long time._  
**Warden Pryce** _(think)_: It looks… brighter. Younger, somehow. That founder has your chin.  
_Mr. Tweed studies the ceiling. Half a grey moustache is still stuck to his lip._  
_Behind his back, he presses a stack of spare frames into your hands and mimes: your photos, your walls._  

**Choices**

- **It’s a photo. There was a sneeze.** — sets `{"q27-confessed":true}`
    - **Warden Pryce**: A sneeze. Of course there was.
    - She looks at the half moustache still stuck to Mr. Tweed’s lip.
    - **Warden Pryce**: And the moustache. Did that sneeze too?
    - **Warden Pryce**: Honestly? I prefer this one. The old one always looked cross. It stays.
    - Mr. Tweed quietly pulls the canvas out of his jacket and hands it over, rolled up like a newspaper.
- **Say nothing. Admire it.** — sets `{"q27-confessed":false}`
    - **Warden Pryce**: Well. Keep up the good work, both of you.
    - As the door closes behind her, Mr. Tweed breathes out for the first time in an hour.

#### <a id="q27-complete-told"></a>Variant `q27-complete-told`

_Variant of `q27-complete`._

_The Warden walks in and looks at the portrait for a long, long time._  
**Warden Pryce** _(think)_: It looks… brighter. Younger, somehow. That founder has your chin.  
_Mr. Tweed studies the ceiling. Half a grey moustache is still stuck to his lip._  
_Behind his back, he presses a stack of spare frames into your hands and mimes: your photos, your walls._  

**Choices**

- **It’s a photo. There was a sneeze.** — sets `{"q27-confessed":true}`
    - **Warden Pryce**: A sneeze. Of course there was.
    - She looks at the half moustache still stuck to Mr. Tweed’s lip.
    - **Warden Pryce**: And the moustache. Did that sneeze too?
    - **Warden Pryce**: Honestly? I prefer this one. The old one always looked cross. It stays.
    - Mr. Tweed quietly pulls the canvas out of his jacket and hands it over, rolled up like a newspaper.
- **Say nothing. Admire it.** — sets `{"q27-confessed":false}`
    - **Warden Pryce**: Well. Keep up the good work, both of you.
    - As the door closes behind her, Mr. Tweed breathes out for the first time in an hour.
    - Mr. Tweed taps the clock, then points at you: try first, then tell. He waits. He is very good at waiting.

**Rewards**

- Picture Frames (feature): Hang your Photo mode shots in frames on the cottage walls.

**Notes:** Needs Photo mode with a self-timer and a "match the outline" helper for the step 2 check: a translucent overlay of the portrait poses; it turns green when the player and three Nubbins sit close enough. After the quest, the hall portrait permanently shows the player’s actual photo. Art: the original portrait and its smudged version (soft, comic, not grotesque), a torn moustache prop, dark curtain backdrop. Step 3 is a short timed tap (about 4 seconds); missing it just replays the footsteps. The "q27-confessed" flag is cosmetic: if true, the Warden later nods at the portrait when the player passes.

## Q28. Do-It-Yourself

*Mr. Bean: painting a room with a firework in the paint tin* · audience: all · where: Mr. Tweed’s cottage · when: A dry day, after Q21 (never during Chapters 9–11) · requires: Q21

**Cast:** Mr. Tweed (Mr. Bean)

### Step 1: Carry every Nubbin, and anything precious, out of Mr. Tweed’s cottage.

Hint: Three Nubbins are napping inside and his bear is on the mantelpiece. Carry each one out to the garden. · check: `clear:tweed-cottage:nubbins-and-bear`

#### <a id="q28-plan"></a>Scene `q28-plan`

_Mr. Tweed’s front room is the colour of old porridge. He stands in the middle of it with a tin of yellow paint and a tiny brush._  
_On the mantelpiece stands a card in his best handwriting: TEA. SATURDAY. EVERYONE. It is not addressed to anyone in particular._  
_He paints one stroke and steps back. He looks at four walls, a ceiling, and his one stroke._  
_He tapes the brush to a broom. He paints the ceiling, the lampshade, a sleeping Nubbin (which does not wake) and, briefly, himself._  
**Mr. Tweed** _(sad)_: Hnn.  
_He puts down the brush and picks up a firework from the mantelpiece. A light comes on behind his eyes._  
_He mimes it: firework in the tin, light it, run. Then a big BOOM with both hands, and paint landing everywhere, beautifully._  
**Mr. Tweed** _(happy)_: Boom.  
_He looks at you for approval. Your Nubbin is already hiding behind your legs._  

**Choices**

- **Absolutely not.** — sets `{"q28-objected":true}`
    - He nods sympathetically and keeps unwrapping the firework.
    - Then he mimes carrying Nubbins out of the door. He has heard you: safety first, then boom.
- **Fine. But everyone goes outside first.**
    - He shakes your hand firmly. Then he points at your Nubbin, at the door, and at his eyebrows, which he would also like to keep.
- **Can I light it?** — sets `{"q28-asked-to-light":true}`
    - He holds up a small card he has clearly made earlier: GROWN-UPS ONLY.
    - He checks the card, then himself, and stands up a little taller.

#### <a id="q28-cleared"></a>Done `q28-cleared`

_Three sleepy Nubbins on the lawn, one with a yellow stripe, and one plush bear propped on the gate post, supervising._  
_The front room is empty except for Mr. Tweed, the paint, and the firework._  
_He tucks his trousers into his socks. This is his idea of protective clothing._  

### Step 2: Stand well back, behind the garden hedge, before the fuse runs out.

Hint: Run to the far side of the hedge. The closer you stand, the yellower you get. · check: `stand:back:tweed-cottage:hedge`

#### <a id="q28-fuse"></a>Scene `q28-fuse`

_Mr. Tweed stands the firework in the paint tin, lights the fuse, and gazes at it with pride._  
_The fuse fizzes, and he watches it fizz. He keeps watching it fizz._  
_You wave at him through the window. He waves back._  
_You point at the fuse. He looks at the fuse, then at you, then at the door._  
**Mr. Tweed** _(shock)_: Oh!  
_He runs, and you run. Your Nubbin is somehow already behind the far hedge._  

### Complete

#### <a id="q28-complete"></a>Complete `q28-complete`

_FWUMP: every window goes yellow at once. The chimney puffs out a small yellow cloud._  
_You creep back and look inside: walls, ceiling, floor, clock, all yellow. It is, honestly, a good job._  
_There is one perfect porridge-coloured rectangle on the wall, where the picture hung._  
_A single drop falls from the lampshade onto Mr. Tweed’s head. He does not notice; he is far too happy._  
**Mr. Tweed** _(happy)_: Ha!  
_He hands you a wide, flat brush and mimes one huge swish over the whole garden path. Big jobs, one go._  
_Then he mimes the firework and shakes his head, very firmly. The brush, yes; the boom, no._  
_On Saturday you go for tea. So does half the lane. The yellow room is full, and Mr. Tweed has no idea where to put himself._  
_He ends up in the doorway, holding the teapot, beaming at everyone, and pours nobody any tea for nearly an hour._  

**Rewards**

- Splash Paint (feature): Paint a whole patch of ground tiles in one go with the wide brush.

**Notes:** Requires Q21 only because his bear appears on the mantelpiece; drop the requirement and the bear if the implementer prefers. Keep the blast cartoonish: a soft "FWUMP", a yellow puff, no fire, smoke or injury. The firework is never shown in detail and the reward is explicitly the brush, not fireworks. Step 2 is a 5-second dash: the fuse fizzes on screen; if the player is too close they end up with a yellow tint on their outfit for the rest of the day (harmless) and the step still completes. Mr. Tweed’s cottage interior stays yellow afterwards, with the porridge rectangle. The Nubbin painted by the broom keeps a yellow stripe until its next bath. The Saturday tea is a quick fade to a full, cheerful yellow room; any Keepers the player has met can fill it.

## Q29. Mind the Egg

*Mind the Baby, Mr. Bean* · audience: all · where: The lane by your gate · when: Any morning when the player has room for an egg (never during Chapters 9–11)

**Cast:** Mr. Tweed (Mr. Bean), Odette Pennant

### Step 1: Put Odette’s egg down somewhere flat in your garden.

Hint: Set the egg on flat ground near your cottage. Not on the slope. Definitely not on the slope. · check: `place:item:visiting-egg:flat`

#### <a id="q29-handover"></a>Scene `q29-handover`

**Odette Pennant** _(happy)_: Hello! You must be Hazel’s grandchild. I’m Odette, from over the ridge. I hear you’re good with eggs.  
**Odette Pennant**: I’ve an appointment in the village this afternoon, and eggs aren’t allowed in the waiting room. Silly rule. Would you mind this one?  
_She puts a speckled egg in your hands. It is warm and slightly round on one side, the way eggs are, but more so._  
**Odette Pennant**: It’s an easy egg. It just likes to roll. Keep it on something flat and it’s no trouble at all. Back by sunset!  
_She waves and goes, and the egg sits in your palm, perfectly still. The moment you look away, it wobbles._  
_Mr. Tweed leans over the fence, looks at the egg, and mimes rocking a baby. Then he mimes it rolling away._  
**Mr. Tweed** _(think)_: Hm.  

**Choices**

- **I’ll guard it with my life.**
    - Mr. Tweed nods gravely and salutes the egg. The egg wobbles.
- **Mr. Tweed, could you help?** — sets `{"q29-tweed-help":true}`
    - He points at himself, startled, then takes off his hat and holds it out like a nest. He is ready.

#### <a id="q29-roll"></a>Done `q29-roll`

_You set it down. It sits, and it considers._  
_Mr. Tweed lies flat on the grass, shuts one eye, and checks the ground is level. It is level. He gives the egg a thumbs up._  
_Somewhere nearby, a Nubbin sneezes, and the egg sets off._  

### Step 2: Catch the runaway egg before it reaches the stream.

Hint: Get ahead of it and wait on the path; tapping it from behind only makes it faster. Mr. Tweed’s hat counts as a catch. · check: `minigame:chase:runaway-egg:before-stream`

#### <a id="q29-chase"></a>Scene `q29-chase`

_The egg rolls down the garden path, gathering speed and looking, somehow, delighted._  
_It bumps off a fence post, takes the left fork, and heads for the bridge._  
_Mr. Tweed vaults the fence, mostly, and sets off after it holding his hat out in front of him._  
**Mr. Tweed** _(shock)_: Egg!  
_It rattles over the bridge and past the dojo, where three karate Nubbins bow to it as it goes by._  
_Mr. Tweed takes a shortcut through a hedge. He comes out ahead of the egg, wearing most of the hedge._  
_Beyond the dojo is the stream. Eggs float, mostly, but you would rather not find out._  

#### <a id="q29-caught"></a>Done `q29-caught`

_You dive, and Mr. Tweed dives. The egg bounces off your hands, off his head, and lands neatly in his hat._  
_He holds the hat up, muddy and triumphant._  
**Mr. Tweed** _(happy)_: Ha!  

### Step 3: Give the egg back to Odette at the gate, safe and sound.

Hint: Odette waits at your gate at sunset. Carry the egg to her and choose Give. · check: `give:item:visiting-egg:odette`

#### <a id="q29-afternoon"></a>Scene `q29-afternoon`

_For the rest of the afternoon, nobody puts the egg down._  
_Mr. Tweed knits it a little woolly cosy with a hole for the top. It is lumpy, and the egg seems to like it._  
_He keeps his hat off all afternoon, upside down beside the egg, just in case._  
_You line an old fruit box with a blanket and put it on wheels, with a stone wedged at each end for brakes._  
_The egg wobbles once, tries the box, and decides to stay._  
_There is room in the box for two. Your own eggs look at it with interest._  
_As the sun goes down, Odette comes back over the ridge._  

### Complete

#### <a id="q29-complete"></a>Complete `q29-complete`

**Odette Pennant** _(happy)_: There it is, safe and sound. And wearing a jumper!  
_Mr. Tweed bows modestly. The cosy has his initial knitted on it, upside down._  
**Odette Pennant**: Keep the cosy, it suits your eggs. And keep that box. Two eggs side by side, on wheels? That’s a pram, that is.  
_She slips the cosy off and hands it back to you. Mr. Tweed passes her the egg last._  
_He holds on a moment longer than he needs to, pats it twice, and lets go. She tucks it into her basket._  
**Odette Pennant**: So. Was it good?  

**Choices**

- **It went for a little roll.** — sets `{"q29-told":true}`
    - **Odette Pennant**: They always do. That’s why I asked a good Keeper and not the waiting room.
- **A perfect angel.**
    - Behind you, Mr. Tweed slowly picks a twig out of his hair.
    - Odette notices. Odette, kindly, says nothing.

**Rewards**

- Egg Pram (feature): A fruit box on wheels. Carry two eggs at once.
- Egg Cosy (cosmetic): A lumpy hand-knitted cosy for any egg, with an upside-down initial on it.

**Notes:** Odette is a friendly visiting Keeper from over the ridge; she can reappear later. Her egg is a temporary item that cannot hatch, be sold or be thrown. The chase is a downhill route: garden path, fork, bridge, dojo, stream. The egg rolls faster on slopes and when tapped from behind; the player catches it by standing in its path, or Mr. Tweed’s hat does on the last stretch if the player chose "ask". If it reaches the stream bank it bumps a reed and stops, and the chase restarts from the bridge. Art: speckled egg, lumpy cosy with upside-down "T", fruit-box pram.

## Q30. The Three-Wheeler

*Mr. Bean: the rival three-wheeled car he keeps tipping over* · audience: all · where: The ridge track · when: A weekend afternoon, after Q22 (never during Chapters 9–11) · requires: Q22

**Cast:** Mr. Tweed (Mr. Bean), Rufus Crankshaw

### Step 1: Meet Rufus at the start line and enter the ridge race in your hand cart.

Hint: Ride your hand cart to the start line on the ridge track and talk to Rufus. · check: `enter:race:ridge-track:bluebell`

#### <a id="q30-meet"></a>Scene `q30-meet`

_A bright blue three-wheeled cart rattles up the lane. It has one wheel at the front and a great deal of confidence._  
**Rufus Crankshaw** _(happy)_: Afternoon! Rufus Crankshaw. And this is the Bluebell. Fastest three wheels this side of the ridge.  
_Mr. Tweed is riding in the back of your hand cart, the one he gave you. He looks at the Bluebell’s single front wheel._  
_He smiles a very small smile._  
**Rufus Crankshaw**: Is that a race face? That’s a race face. One lap of the ridge track. Winner gets bragging rights.  
_Mr. Tweed points forward like a ship’s captain. Then he holds up three fingers and tips his flat hand gently onto its side._  
**Mr. Tweed**: Three.  

**Choices**

- **You’re on.**
    - **Rufus Crankshaw**: Splendid! Mind your wheels. All four of them, show-off.
- **Is the Bluebell… stable?** — sets `{"q30-warned":true}`
    - **Rufus Crankshaw**: Stable as a table! A three-legged table, which is the steadiest kind. Ask anyone.
    - Behind him, the Bluebell tips gently onto its side, all by itself.
    - **Rufus Crankshaw**: …It does that.

#### <a id="q30-grid"></a>Done `q30-grid`

_Two carts on the line. Rufus revs the Bluebell by saying “brrm” quite loudly._  
_Mr. Tweed polishes the front of your cart with his sleeve, then the front of the Bluebell, to be fair._  

### Step 2: Win the race, overtaking the Bluebell so that it tips over three times.

Hint: Draw level with the Bluebell on a bend and let Mr. Tweed wave. Do it three times, then cross the line first. · check: `race:win:ridge-track:bluebell-tips-3`

#### <a id="q30-race"></a>Scene `q30-race`

_The flag drops. Rufus shoots off the line, waving._  
_Mr. Tweed, in the back of your cart, points at the Bluebell, then at a gap on the inside of the bend._  
_Every time you draw level, he leans out and gives Rufus a cheerful little wave._  
_Every time, Rufus waves back. The Bluebell leans, and leans, and gently tips over._  
**Rufus Crankshaw** _(happy)_: Not to worry! It does that!  
_He rights it with one hand and is off again. He is very, very good at righting it._  
**Mr. Tweed** _(happy)_: Ha!  

**Choices**

- **Tell Mr. Tweed to stop waving. Win it fair.** — sets `{"q30-fair":true}`
    - Mr. Tweed looks wounded, and sits on his hands.
    - On the next bend Rufus draws level, sees you, and waves anyway. The Bluebell tips over.
    - **Rufus Crankshaw**: Not to worry! I just like waving!
    - Mr. Tweed slowly takes his hands out from under him. It was never his fault. He looks enormously relieved.
- **Let him wave. It’s only friendly.**
    - Mr. Tweed waves so warmly that a Nubbin on the verge waves back, and also tips over.

### Complete

#### <a id="q30-complete"></a>Complete `q30-complete`

_You cross the line first. The Bluebell crosses second, on its side, sliding._  
**Rufus Crankshaw** _(happy)_: Ha! What a race! Three tips! That’s a personal best. Or worst. One of those.  
_Mr. Tweed shakes his hand. Rufus shakes back so hard that the Bluebell, parked, tips over again._  
**Rufus Crankshaw**: Tell you what. I’ve an old one at home. Smaller. Tips if you breathe near it. Your Nubbins would love it.  
_Next morning there is a little blue three-wheeler in your garden. A Nubbin bumps it, it tips, and the Nubbin is thrilled._  

**Rewards**

- Little Three-Wheeler (decor): A small blue three-wheeled cart for the garden. It tips over when Nubbins bump it, which they love.

**Notes:** Requires Q22 for the Hand Cart; Mr. Tweed rides in its back seat as navigator (he gave the cart away, so he never drives). Rufus is a cheerful rival, never mean, and always rights the Bluebell himself; nobody is hurt. Race: one lap of the ridge track with three marked bends; drawing level on a bend triggers Mr. Tweed’s wave and the Bluebell tip animation (it loses about two seconds). The check needs a first-place finish with at least three tips; finishing without three tips plays Rufus: "Again? Again!" and restarts. Do not model the Bluebell on any real car brand. The garden three-wheeler is a physics prop that tips on bump and rights itself after a few seconds. The step 2 choice is cosmetic: either way Rufus keeps tipping, because he waves at everyone. q30-fair only changes the line he says.
