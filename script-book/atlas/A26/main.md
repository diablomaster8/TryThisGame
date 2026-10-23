# Atlas, page A26: The Wall of Uruk

## A26-1. The Wall

*The Epic of Gilgamesh, Standard Babylonian version: Tablet I, the prologue: the wall, the copper tablet box and the lapis tablet* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Old Brickmaker (Our own: a brickmaker of Uruk who walks the wall with you (not in the epic))

### Step 1: Step into the page and walk the wall of Uruk.

Hint: Touch the sunlit wall on the page, then follow the old brickmaker along the top. · check: `explore:a26-wall:rampart`

#### <a id="a26-01-page"></a>Scene `a26-01-page`

_Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river._  
_Your Nubbin puts both paws flat on the paper, as if to test whether it is hot. It is, a little._  
_The bricks are warm under your hand. Then they are warm under your feet, and the sun is very high, and very white._  
_You are standing on top of a wall so wide that two carts could pass on it. Below, a city of flat roofs runs down to a river._  
_An old woman with clay to her elbows sits on a stack of bricks, eating a date. She looks at you without any surprise at all._  
**Old Brickmaker**: New, are you? Everyone’s new once. Come and walk the wall with me. It’s the best way to meet a city.  
_She walks you along the top. Below, people are carrying baskets, and nobody looks up, as if a wall were nothing._  
**Old Brickmaker**: A square mile of town, a square mile of orchards, a square mile of clay-pits, and half a mile for the temple. All held in by bricks.  
**Old Brickmaker**: My mother made bricks, and hers did. Some of these are older than anyone’s grandmother.  

**Choices**

- **Ask her how you tell a good brick.**
    - **Old Brickmaker**: You knock it. A good one rings. A bad one says “thud” and lets you down when it rains.
- **Ask who built the wall.**
    - **Old Brickmaker**: The king says he did. The king says a lot of things. Come down and I’ll show you something better.

#### <a id="a26-01-page-moss"></a>Variant `a26-01-page-moss`

_Variant of `a26-01-page`._

_Nova’s atlas falls open at a page so bright it warms your face. A great brick wall stands in the sun, with date palms and a river._  
_Moss has come to see what you are reading. He climbs your sleeve and settles on your shoulder._  
**Moss**: Old, that wall. Older than me, nearly. I’ll come, if it’s all the same to you. I like a wall.  
_The bricks are warm under your hand. Then they are warm under your feet, and the sun is very high, and very white._  
_You are standing on top of a wall so wide that two carts could pass on it. Below, a city of flat roofs runs down to a river._  
_An old woman with clay to her elbows sits on a stack of bricks, eating a date. She looks at you without any surprise at all._  
**Old Brickmaker**: New, are you? Everyone’s new once. Come and walk the wall with me. It’s the best way to meet a city.  
_She looks at Moss on your shoulder, nods to him as to an old neighbour, and walks you along the top._  
**Old Brickmaker**: A square mile of town, a square mile of orchards, a square mile of clay-pits, and half a mile for the temple. All held in by bricks.  
**Old Brickmaker**: My mother made bricks, and hers did. Some of these are older than anyone’s grandmother.  
**Moss**: Not anyone’s.  

**Choices**

- **Ask her how you tell a good brick.**
    - **Old Brickmaker**: You knock it. A good one rings. A bad one says “thud” and lets you down when it rains.
- **Ask who built the wall.**
    - **Old Brickmaker**: The king says he did. The king says a lot of things. Come down and I’ll show you something better.

#### <a id="a26-01-page-done"></a>Done `a26-01-page-done`

_Your Nubbin knocks on the parapet with one paw, and listens. It seems satisfied._  
**Old Brickmaker**: That’s the way. Now, down the stairs. Mind the third one. It’s been mended since my grandmother’s day.  

### Step 2: Find the copper tablet box at the foot of the wall and read the lapis tablet.

Hint: The box is set into the wall’s foundation, by the stair. The brickmaker will show you. · check: `find:a26-tablet-box:foundation`

#### <a id="a26-01-tablet"></a>Scene `a26-01-tablet`

_At the foot of the stair, set into the oldest bricks, there is a box of copper, green with years. Its lock is a bronze bolt._  
**Old Brickmaker**: Slide the bolt. Go on. It’s meant to be opened. That’s the whole point of it.  
_Inside lies a tablet of blue stone, lapis lazuli, flecked with gold like a night sky. Little wedge-shaped marks run across it._  
_You can’t read them. Then, the longer you look, you can._  
**Old Brickmaker**: “Of Uruk, the high-wall’d,” it starts. That’s us. Then it’s all about a king who saw everything, and what it cost him.  
**Old Brickmaker**: It’s his story. He had it written down and put here, so anyone at all could open the box and read it.  
_The marks on the tablet begin to move like ants in a line. The air smells of hot dust and river water._  

**Choices**

- **Read on.**
    - You read on. The wedges become words, and the words become a street, and you are standing in it.
- **Let your Nubbin turn the tablet over.**
    - Your Nubbin turns the tablet over with great care. On the back, the story keeps going, and so do you.

#### <a id="a26-01-tablet-done"></a>Done `a26-01-tablet-done`

_When you look up, the brickmaker has put the tablet back in its box and slid the bolt home._  
**Old Brickmaker**: It stays here. That’s what it’s for. Go on, then. I’ll be on the wall when you’re done.  

### Complete

#### <a id="a26-01-complete"></a>Complete `a26-01-complete`

_The street is full of people, all of them tired. Somewhere above them, a drum is beating, and it doesn’t stop._  
_Your Nubbin takes hold of your trouser leg. You are in the story now, a stranger in Uruk, and the king is awake._  

**Rewards**


Sets on completion: `{"a26-01":true}`

**Learning Grove swaps**

- `a26-01-tablet#4` → It starts with our city, the one with the great high wall. Then it’s all about a king who saw everything, and what it cost him.

**Notes:** Opening page. The atlas page art is a sunlit wall of mud-brick and kiln-fired brick, date palms and the river. MOSS: if he comes (see the header), play A26_VARIANTS a26-01-page-moss in place of a26-01-page; it keeps the same choices. The tablet box is copper with a bronze bolt and the tablet is lapis, as the prologue says. The cuneiform on it is decorative wedges, not real text. The tablet is never taken: the brickmaker puts it back (care note). Lifted line 2 (a fragment) at a26-01-tablet#4.

## A26-2. The King Who Never Rests

*The Epic of Gilgamesh, Standard Babylonian version: Tablet I: Gilgamesh gives his city no rest; the people cry out; Aruru makes Enkidu* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-1, from Nova’s atlas. · requires: A26-1

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Woman of Uruk (The people of Uruk (The Epic of Gilgamesh, Standard Babylonian version); this one is our own)

### Step 1: Watch the king’s games in the square.

Hint: Follow the drum to the great square, and find a place by the well. · check: `watch:a26-games:square`

#### <a id="a26-02-games"></a>Scene `a26-02-games`

_In the great square, young men are running races, and carrying stones, and running races again. Nobody looks as if they want to._  
_In the middle, taller than anyone, stands a man with a curled black beard and arms like roof beams._  
**Gilgamesh** _(happy)_: Again! Faster! Who’s tired? Nobody’s tired. Uruk doesn’t get tired!  
_That is Gilgamesh, king of Uruk. Two parts of him are god, and one part is man, and you can’t tell which part is talking._  
**Woman of Uruk** _(sad)_: He’s been at it since the new moon. Games all day, building all night. Nobody may go home.  
**Woman of Uruk**: My son hasn’t slept in his own bed for a month. The king means no harm. He just never stops.  
_A boy in the race stumbles and sits down in the dust. He doesn’t get up._  

**Choices**

- **Take the boy some water from the well.**
    - You draw a bucket and carry the boy a cup. He drinks it all, and looks at you as if you had brought him the sea.
- **Sit down in the dust beside him.**
    - You sit down beside him. After a moment your Nubbin sits too, and so, quietly, does the boy’s mother.

#### <a id="a26-02-games-done"></a>Done `a26-02-games-done`

_The king sees none of it. He has already started another race._  
**Woman of Uruk** _(soft)_: Thank you. It’s the first kind thing anyone’s done in this square since the new moon.  

### Step 2: Go up to the temple with the people of Uruk.

Hint: At dusk the crowd climbs the temple steps. Go with the woman from the square. · check: `watch:a26-clay:temple`

#### <a id="a26-02-clay"></a>Scene `a26-02-clay`

_At dusk the people climb the temple steps with lamps. They don’t shout; they are too tired to shout._  
**Woman of Uruk** _(sad)_: Gods of the city, he’s too strong for us. Give him someone his own size. Someone to wear him out.  
_The lamps flicker, though there is no wind. And for a moment, high over the temple, you see something no one else seems to._  
_A great woman, made of starlight, washes her hands in the evening sky. She pinches off a little clay and rolls it between her palms._  
_That is the goddess Aruru, who made people in the first place. She drops the clay, gently, far away in the wild._  
_Your Nubbin watches it fall all the way, with its mouth open._  

**Choices**

- **Tell the woman what you saw.**
    - **Woman of Uruk**: Clay? In the wild? Well. I asked for help. I didn’t say what shape.
- **Keep it to yourself for now.**
    - You keep it to yourself. The woman pats your arm, as if you had prayed hardest of anyone.

#### <a id="a26-02-clay-done"></a>Done `a26-02-clay-done`

_Far off, beyond the river and the fields, something new opens its eyes in the long grass._  

### Complete

#### <a id="a26-02-complete"></a>Complete `a26-02-complete`

_Down in the square, the drum keeps going. Gilgamesh is still awake, still building, still certain nothing can stop him._  
_Your Nubbin has turned to face the wild, where the clay fell. Its ears are up._  

**Rewards**


Sets on completion: `{"a26-02":true}`

**Notes:** CARE: the king’s oppression is games and building only; his claim on brides is cut (header). Aruru is seen only by you and your Nubbin, drawn as a figure of light in the evening sky, never a statue or a cult image. The temple is Uruk’s, shown with respect; you stand at the back of the crowd and no reward hangs on the prayer.

## A26-3. The Wild Man

*The Epic of Gilgamesh, Standard Babylonian version: Tablet I: Enkidu with the gazelles at the water hole; the trapper* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-2, from Nova’s atlas. · requires: A26-2

**Cast:** Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Trapper (The trapper whose snares Enkidu tears up (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Go out to the water hole on the steppe.

Hint: Leave Uruk by the river gate and follow the gazelle tracks to the water. · check: `walk:a26-steppe:water-hole`

#### <a id="a26-03-herd"></a>Scene `a26-03-herd`

_Three days out from the wall, the fields give way to steppe: dry grass, thorn trees, and a sky that goes on for ever._  
_At the water hole there are gazelles, drinking with their knees bent. In among them, on all fours, drinks a man._  
_He is hairy all over, like a goat, and his hair is long as a woman’s. He has never worn a stitch._  
_E’en with gazelles did he pasture on herbage, along with the cattle_  
_Drank he his fill, with the beasts did his heart delight at the water._  
_That is Enkidu. He doesn’t know he has a name yet._  
_Your Nubbin trots straight past you, down to the water, and drinks beside the smallest gazelle._  
**Enkidu** _(think)_: Hhh?  
_Enkidu lifts his dripping face and looks at your Nubbin. Then he goes back to drinking, as if it had always been there._  

**Choices**

- **Let your Nubbin stay with the herd.**
    - You let it stay. It lies down in the cool mud with the gazelles, more content than you have ever seen it.
- **Call your Nubbin back.**
    - You call. Your Nubbin looks at you, and flicks an ear, and stays exactly where it is.

#### <a id="a26-03-herd-done"></a>Done `a26-03-herd-done`

_You sit under a thorn tree and watch them. Your Nubbin is in the middle of the herd, nose to nose with a fawn._  
_Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it._  

#### <a id="a26-03-herd-done-moss"></a>Variant `a26-03-herd-done-moss`

_Variant of `a26-03-herd-done`._

_You sit under a thorn tree and watch them. Moss climbs down off your shoulder and sits in the shade beside you._  
_Enkidu grooms a gazelle’s ear with great care. There is nothing wild about the way he does it._  
**Moss**: Nothing wrong with him. He just hasn’t met anyone yet.  

### Step 2: Find out who set the pits and snares, and what happened to them.

Hint: Walk the edge of the steppe and look for filled-in pits and torn snares. · check: `inspect:a26-pits:steppe`

#### <a id="a26-03-pits"></a>Scene `a26-03-pits`

_At the edge of the steppe there are pits dug to catch game. Every one of them has been filled in, with care, by hand._  
_The snares have been torn up and laid in a tidy pile. Somebody has been very busy on the herd’s behalf._  
_A man with a net over his shoulder comes over the rise. He stops dead at the pits, and goes pale._  
**Trapper** _(angry)_: Again! Every pit, every snare. Three days I worked on those.  
**Trapper** _(shock)_: It’s a man. A wild man, strong as a star from heaven. I saw him. He runs with them. He sets them free.  
**Trapper**: I can’t feed my family on empty nets. I’m going home to my father. He’ll know what to do.  

**Choices**

- **Tell him you’re sorry about his work.**
    - **Trapper**: So am I. And I’m sorry I’m frightened of him. I don’t think he means harm. He just doesn’t know about nets.
- **Say the herd seemed happy, at least.**
    - **Trapper**: Happy! The gazelles are happy. I’m the one with the empty pot.
    - Then he laughs, once, despite himself.

#### <a id="a26-03-pits-done"></a>Done `a26-03-pits-done`

_He runs off towards the river, net flapping. Behind you, at the water, the wild man is filling in another pit._  

### Complete

#### <a id="a26-03-complete"></a>Complete `a26-03-complete`

_By evening the trapper is far away on the road to his father, and then on the road to Uruk._  
_Your Nubbin is still with the herd. It doesn’t look round when you say its name._  

**Rewards**


Sets on completion: `{"a26-03":true}`

**Learning Grove swaps**

- `a26-03-herd#3` → He ate the grass with the gazelles, and he was happy among them.
- `a26-03-herd#4` → He drank with the animals at the water, and his heart was glad.

**Notes:** Lifted line 1 (two verse lines, Thompson Tablet I) at a26-03-herd#3 and #4, narration. Your Nubbin joins the gazelles here and stays with them until A26-4 step 3: draw it in the herd through A26-4. MOSS: if he comes, play A26_VARIANTS a26-03-herd-done-moss in place of a26-03-herd-done (his line, from the outline). Enkidu is drawn hairy and unclothed but never shown below the shoulders except behind grass and gazelles; no nudity is drawn.

## A26-4. Shamhat

*The Epic of Gilgamesh, Standard Babylonian version: Tablet I and the Old Babylonian Pennsylvania tablet: Shamhat teaches Enkidu; the gazelles run* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-3, from Nova’s atlas. · requires: A26-3

**Cast:** Trapper (The trapper whose snares Enkidu tears up (The Epic of Gilgamesh, Standard Babylonian version)), Shamhat (Shamhat, a woman of Ishtar’s temple in Uruk, who teaches Enkidu (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Walk Shamhat out to the water hole with the trapper.

Hint: Meet the trapper at Uruk’s river gate and carry Shamhat’s bundle. · check: `escort:a26-shamhat:water-hole`

#### <a id="a26-04-road"></a>Scene `a26-04-road`

_The trapper comes back from Uruk with a woman from the temple of Ishtar. She walks quickly, and carries her own bundle until you take it._  
**Shamhat**: I’m Shamhat. The king sent me. He says the wild man needs someone to talk to. I think he’s right, for once.  
**Trapper**: He doesn’t talk. He grunts. He drinks out of the pond on his knees.  
**Shamhat** _(soft)_: So did you, once. Somebody sat with you until you didn’t.  
_The bundle smells of bread and sweet oil. There is a clean robe in it, folded small._  
**Shamhat**: Most people want to tame him. I don’t. I want to be the first person he understands.  

**Choices**

- **Ask her how she’ll do it.**
    - **Shamhat**: Patience. I’ll sit where he can see me, and talk, and not need anything. Then one day he’ll answer.
- **Tell her your Nubbin ran off with the herd.**
    - **Shamhat**: Then we have the same job, you and I. Let’s see who finishes first.

### Step 2: Sit at the water hole with Shamhat until Enkidu understands her.

Hint: Sit by the water. Don’t chase. It takes days. · check: `sit:a26-water-hole:days`

#### <a id="a26-04-sit"></a>Scene `a26-04-sit`

_Shamhat sits on a flat rock by the water hole, and you sit a little way off. The trapper hides in a bush and is no help._  
_The first day, Enkidu watches her from behind a gazelle. The second day, he comes and sniffs her bundle._  
**Shamhat**: That’s bread. You don’t know bread yet. You will. This is my hand. That’s yours.  
_By the fourth day he sits across the rock from her, the way your Nubbin sits across from you on the hill at home._  
_She talks about the city, and the river, and the man who never sleeps. Enkidu listens with his whole face._  
**Enkidu** _(think)_: Hand.  
_Shamhat goes very still. Then she smiles as if the sun had come up twice._  
**Shamhat**: Hand. Yes. And what do you call yourself?  
**Enkidu**: …Enkidu.  

#### <a id="a26-04-sit-done"></a>Done `a26-04-sit-done`

_He says it again, louder, as if trying the word for size. Then he laughs, a big surprised human laugh._  
**Shamhat** _(happy)_: There you are. I knew there was someone in there.  

### Step 3: Coax your Nubbin back from the herd.

Hint: The gazelles are skittish now. Go slowly, and let your Nubbin come to you. · check: `find:a26-nubbin:herd`

#### <a id="a26-04-coax"></a>Scene `a26-04-coax`

_Enkidu walks back down to the gazelles, the way he has every evening of his life._  
_They lift their heads, and look at him, and run, every one. They don’t know him any more._  
**Enkidu** _(sad)_: Wait! It’s me!  
_He tries to run after them, and can’t keep up: his legs are a man’s now. He stands in the dust and watches them go._  
_Your Nubbin has been left behind by the herd, too. It sits alone in the grass, looking after them._  
**Shamhat** _(soft)_: Go to yours. I’ll go to mine.  

**Choices**

- **Call its name.**
    - You call its name. It hears you, and thinks about it for a long moment, and then it comes, slowly, then all at once.
- **Sit down in the grass and wait.**
    - You sit down in the grass and wait. The sun goes down a finger’s width.
    - Then there is a weight against your side, warm and a bit muddy, as if it had been there all along.
- **Hold out a date from Shamhat’s bundle.**
    - You hold out a date. Your Nubbin comes for the date, and stays for you, and gets very sticky.

#### <a id="a26-04-coax-done"></a>Done `a26-04-coax-done`

_Across the water, Enkidu is sitting with his head in his hands, and Shamhat is sitting beside him, saying nothing._  
_After a while he leans against her shoulder, the way your Nubbin leans against yours._  

### Complete

#### <a id="a26-04-complete"></a>Complete `a26-04-complete`

**Shamhat**: You’re not less, you know. You’re more. You lost the herd and found the whole world. Come and see it.  
**Enkidu** _(sad)_: Will it run away from me too?  
**Shamhat**: Some of it. Not the best of it.  
_She gives him half of her robe to wear, and takes his hand, and leads him away like a child towards the shepherds’ camp._  

**Rewards**


Sets on completion: `{"a26-04":true}`

**Notes:** CARE: Shamhat is a teacher and is treated with respect (header). Her seven days with Enkidu are cut; on the page she sits with him until he understands her speech. Draw the days passing with the sun and moon over the water hole. The third rule is acted at a26-04-coax (the wait choice) and never quoted. Your Nubbin is back at your side from here on.

## A26-5. Bread and Ale

*The Epic of Gilgamesh, Standard Babylonian version: the Old Babylonian Pennsylvania tablet: the shepherds’ camp; bread and ale; Enkidu guards the flocks* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-4, from Nova’s atlas. · requires: A26-4

**Cast:** Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Shamhat (Shamhat, a woman of Ishtar’s temple in Uruk, who teaches Enkidu (The Epic of Gilgamesh, Standard Babylonian version)), Shepherd (The shepherds who give Enkidu bread (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Help the shepherds feed Enkidu his first supper.

Hint: Carry the bread and the jugs from the shepherds’ fire to Enkidu. · check: `feed:a26-enkidu:bread`

#### <a id="a26-05-bread"></a>Scene `a26-05-bread`

_The shepherds’ camp is a ring of tents round a fire, and a lot of sheep with opinions. The shepherds crowd round to look at Enkidu._  
**Shepherd**: He’s as tall as the king. Taller. Look at those arms. Sit down, friend, sit down. You must be hungry.  
_You set a round loaf in front of him, and a jug. Enkidu looks at them as if they might bite._  
**Enkidu** _(think)_: What is this?  
**Shamhat**: That’s bread. People eat it. And that’s ale. People drink it. Go on. It’s what we do.  
_He sniffs the bread, and licks it. He takes a very small bite, and his eyebrows go up into his hair._  
_Then he eats until he is full, and drinks seven jugs, and his face shines like a lamp._  
_And then, to everyone’s surprise, including his own, he sings. It has no words, and sounds like the steppe at evening._  

**Choices**

- **Clap along.**
    - You clap along, and so do the shepherds. Your Nubbin hops in time, mostly.
- **Break your own loaf with your Nubbin.**
    - You break your loaf in two. Enkidu watches, and breaks his, and holds out half to the shepherd beside him.

#### <a id="a26-05-bread-done"></a>Done `a26-05-bread-done`

_Afterwards the shepherds trim his hair, and he washes in the stream and rubs oil into his skin. Shamhat gives him clothes._  
**Shepherd** _(happy)_: Look at him. He looks like a bridegroom. Or a king.  
**Enkidu**: Is that good?  
**Shamhat**: It depends on the king.  

### Step 2: Keep watch over the flocks with Enkidu at night.

Hint: Take a lamp to the sheepfold and stay up with Enkidu. · check: `watch:a26-flocks:night`

#### <a id="a26-05-night"></a>Scene `a26-05-night`

_That night the shepherds sleep, properly, for the first time in a long while. Enkidu keeps watch, and you keep him company._  
_He sits on the fold wall with a big stick across his knees. He doesn’t need a lamp; he sees in the dark like the herd did._  
**Enkidu** _(think)_: The wolves come from there. The lions from over there. I know them. I used to drink with them.  
_Something moves out in the dark. A low grey shape slides along the edge of the grass, then another._  
_Enkidu stands up on the wall and says something to them, not in words. The shapes stop, then turn and slip away._  
**Enkidu** _(sad)_: They know me too. They know whose side I’m on now.  

**Choices**

- **Hold the lamp up anyway.**
    - You hold up the lamp. He looks at it, and at you, and smiles.
    - **Enkidu**: That’s for the sheep. So they know someone’s here. Good.
- **Sit beside him on the wall.**
    - You sit beside him on the wall. Your Nubbin climbs into the gap between you, and falls asleep at once.

#### <a id="a26-05-night-done"></a>Done `a26-05-night-done`

_Every night after that, the shepherds sleep, and no lamb is lost. They start calling him “the watchman”._  

### Complete

#### <a id="a26-05-complete"></a>Complete `a26-05-complete`

_One morning a traveller passes the camp on his way to Uruk, and grumbles about the king who never rests._  
**Enkidu** _(angry)_: Someone should stand up to him.  
**Shamhat**: Someone should. Shall we go to the city, then, you and I?  
_Enkidu looks at the steppe, and at the flocks, and at you. Then he nods._  

**Rewards**


Sets on completion: `{"a26-05":true}`

**Notes:** From the Old Babylonian tablet, where the Standard Babylonian has a gap. CARE: the ale is the source’s, and kept to one line; nobody is shown drunk. His song has no words and is a music cue (a low, wandering tune), never lyrics. Wolves are grey shapes in the dark that turn away; no fight. The traveller’s complaint in the source is about the king’s claim on brides; it is cut to “the king who never rests”.

## A26-6. Ninsun’s Dreams

*The Epic of Gilgamesh, Standard Babylonian version: Tablet I: Gilgamesh’s two dreams, of the star and the axe; Ninsun reads them* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-5, from Nova’s atlas. · requires: A26-5

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Ninsun (Ninsun, the wise goddess, Gilgamesh’s mother (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Carry the cups to Ninsun’s hall in the palace.

Hint: The steward at the palace kitchens needs a cup-bearer. Take the tray to the queen mother’s hall. · check: `carry:a26-cups:ninsun-hall`

#### <a id="a26-06-cups"></a>Scene `a26-06-cups`

_Back in Uruk, the palace steward is short of hands. He looks at you, and at your Nubbin, and gives you a tray of silver cups._  
_Ninsun’s hall is cool and quiet, with a fountain. The goddess sits by it, wise and grey-eyed and in no hurry about anything._  
_Gilgamesh is pacing in front of her, and for once he isn’t shouting. He looks like a boy who has had a bad night._  
**Gilgamesh** _(think)_: Mother. I dreamed again. A star fell out of the sky and landed beside me, like a rock.  
**Gilgamesh**: I tried to lift it, and I couldn’t. Me! I couldn’t even shift it. The whole city came out to stare at it.  
**Gilgamesh**: And I loved it. I don’t know why. I put my arms round it as if it were a person, and carried it to you.  
_You hold out the tray. He takes a cup without looking, and drinks, and forgets to give it back._  

**Choices**

- **Wait with the tray until he’s finished.**
    - You wait. Ninsun catches your eye over his shoulder, and the corner of her mouth goes up.
- **Offer Ninsun a cup too.**
    - **Ninsun**: Thank you. Somebody in this palace remembers the rest of us drink as well.

#### <a id="a26-06-cups-done"></a>Done `a26-06-cups-done`

**Ninsun**: Sit down, my son. You’re wearing a hole in my floor. Tell me the other one too.  

### Step 2: Stay and hear what Ninsun makes of the dreams.

Hint: Stand by the fountain with the tray while Ninsun talks to her son. · check: `talk:a26-ninsun:ninsun-hall`

#### <a id="a26-06-meaning"></a>Scene `a26-06-meaning`

**Gilgamesh** _(think)_: There was an axe, lying in the street. A strange one. People were all round it.  
**Gilgamesh**: I loved that too. I picked it up and wore it at my side, like part of me.  
**Ninsun**: The star that fell, the axe in the street. They are the same thing, my son. They are a person.  
**Ninsun**: A friend is coming to you. Strong as a star from heaven. He will stand beside you and save you, again and again.  
**Gilgamesh**: A friend? I’ve got a whole city.  
**Ninsun** _(soft)_: You have a city that is tired of you. That isn’t the same.  
_Gilgamesh opens his mouth to argue, and shuts it again. He looks out of the window, towards the steppe._  

**Choices**

- **Tell him you think she’s right.**
    - **Gilgamesh**: Do you? You’ve been in my city a week. Hm. You’ve probably seen more of it than I have.
- **Say nothing, and refill his cup.**
    - You refill his cup. He looks at it, then at you, as if he had just noticed someone was holding the tray.

### Complete

#### <a id="a26-06-complete"></a>Complete `a26-06-complete`

**Gilgamesh**: Who are you, anyway? Whose are you?  
**You**: Nobody’s. I’m new here.  
**Gilgamesh**: Well, stay new. Carry my cups. There aren’t many people who stand still long enough to hear my dreams.  
_That night, for the first time since the new moon, the drum in the square stops before midnight._  

**Rewards**


Sets on completion: `{"a26-06":true}`

**Notes:** In the epic, Shamhat tells Enkidu about these dreams; here you hear them in Ninsun’s hall itself. This is where you become the king’s cup-bearer and water-carrier, the role you keep for the rest of the page.

## A26-7. The Door

*The Epic of Gilgamesh, Standard Babylonian version: Tablet II: Enkidu comes to Uruk; the wrestling at the door; friendship; Ninsun adopts Enkidu* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-6, from Nova’s atlas. · requires: A26-6

**Cast:** Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Shamhat (Shamhat, a woman of Ishtar’s temple in Uruk, who teaches Enkidu (The Epic of Gilgamesh, Standard Babylonian version)), Woman of Uruk (The people of Uruk (The Epic of Gilgamesh, Standard Babylonian version); this one is our own), Ninsun (Ninsun, the wise goddess, Gilgamesh’s mother (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Meet Enkidu and Shamhat at the gate and bring them into the city.

Hint: They are coming up the river road. Wait at the great gate. · check: `escort:a26-enkidu:uruk-gate`

#### <a id="a26-07-gate"></a>Scene `a26-07-gate`

_Enkidu comes up the river road in his borrowed clothes, with Shamhat beside him. People leave their work to stare._  
**Woman of Uruk**: Look at him! He’s the king’s size exactly. He’s like the king’s own shadow, only hairier.  
**Woman of Uruk**: He was raised on milk from the wild. They say he can wrestle a lion.  
_Enkidu sees you by the gate. His face breaks into a grin._  
**Enkidu** _(happy)_: The water-carrier! With the little one that ran with my gazelles.  
_Your Nubbin, embarrassed, hides behind your leg._  
**Shamhat**: He wants to meet your king. I’ve told him what to expect. He doesn’t believe me.  

**Choices**

- **Warn him the king is very strong.**
    - **Enkidu**: Good. So am I. Somebody should tell him so.
- **Tell him the king is lonely.**
    - **Enkidu**: Lonely?
    - He thinks about that for a long time. He knows the word from the steppe, when the herd ran.

#### <a id="a26-07-gate-done"></a>Done `a26-07-gate-done`

_The crowd follows you through the streets, getting bigger, all the way to the great square._  

### Step 2: Watch the two of them meet at the door.

Hint: Stand back in the crowd. Keep your Nubbin out of the way. · check: `watch:a26-wrestle:door`

#### <a id="a26-07-door"></a>Scene `a26-07-door`

_Gilgamesh comes striding across the square towards a great door. Enkidu steps into the doorway and plants his feet._  
**Gilgamesh**: Out of my way.  
**Enkidu**: No.  
_Gilgamesh stops. Nobody has said that word to him in his whole life, and he doesn’t seem to know what to do with it._  
_Then they grab each other like two bulls, and wrestle in the street._  
_The doorposts shake and the wall trembles. Dust drifts down from the roofs, and the crowd scatters back._  
_They wrestle up the street and down it, and neither will give way, and neither will let go._  
_At last Gilgamesh’s knee touches the ground, and everyone gasps. It has never touched the ground before._  

**Choices**

- **Hold your Nubbin back from the fight.**
    - You scoop up your Nubbin before it can join in. It wriggles in your arms, cheering on both sides at once.
- **Pull the woman from the square out of the dust.**
    - You pull her back under an awning. She coughs, and grips your arm, and doesn’t take her eyes off the door.

#### <a id="a26-07-door-done"></a>Done `a26-07-door-done`

_Gilgamesh kneels in the dust, breathing hard, with Enkidu over him. For a moment the whole square holds its breath._  
_Then Gilgamesh starts to laugh, and Enkidu laughs too. He holds out a hand, and the king takes it._  

### Complete

#### <a id="a26-07-complete"></a>Complete `a26-07-complete`

**Gilgamesh** _(happy)_: Where have you been all my life?  
**Enkidu**: Eating grass, mostly.  
_That evening Ninsun takes Enkidu’s face in her hands and looks at it for a long time._  
**Ninsun** _(soft)_: You were the star. You were the axe. From today you are my son, and his brother.  
_Enkidu, who has never had a mother, doesn’t know where to put his hands. Your Nubbin shows him by climbing into her lap._  

**Rewards**


Sets on completion: `{"a26-07":true}`

**Notes:** CARE: in the source the door is a bride’s house and Gilgamesh is going in to claim her; that is cut. The door is just the one he means to go through. The wrestle is shown as two big figures in a dust cloud with the doorposts shaking; no blows land, nobody is hurt, and it ends in laughter.

## A26-8. The Cedar Forest

*The Epic of Gilgamesh, Standard Babylonian version: Tablets II and III: the plan to kill Humbaba; Enkidu’s fear; the elders; Ninsun prays to Shamash; the axes* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-7, from Nova’s atlas. · requires: A26-7

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Elder of Uruk (The elders of Uruk who warn against the Cedar Forest (The Epic of Gilgamesh, Standard Babylonian version)), Ninsun (Ninsun, the wise goddess, Gilgamesh’s mother (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Bring water to the friends on the palace roof.

Hint: Fill the jar at the palace well and climb to the roof. · check: `carry:a26-water:palace-roof`

#### <a id="a26-08-plan"></a>Scene `a26-08-plan`

_You carry a water jar up to the palace roof. The two friends are lying on their backs, looking at the sky._  
**Gilgamesh**: Enkidu. Nobody lives for ever. Only the gods. Men’s days are numbered, and whatever we do is wind.  
**Gilgamesh** _(happy)_: So let’s do something they’ll remember. The Cedar Forest. Humbaba, who guards it. Let’s go and kill him.  
_Enkidu sits up so fast he knocks the jar. You catch it._  
**Enkidu** _(shock)_: I know that forest. I ran in its edges, when I was wild. Humbaba’s voice is the flood. His breath is fire.  
**Enkidu**: The god Enlil set him there to guard the cedars. He hears a heifer stir sixty leagues away.  
**Gilgamesh**: Then he’ll hear us coming, and we won’t have to knock. Are you frightened? You? I’ll go first.  

**Choices**

- **Ask why he wants to go.**
    - **Gilgamesh**: To make a name. A name that lasts longer than I do. What else is there?
    - Enkidu looks at you, as if hoping you might know.
- **Pour them both a cup and say nothing.**
    - You pour them both a cup. Enkidu holds his without drinking, the way people hold something to stop their hands shaking.

#### <a id="a26-08-plan-done"></a>Done `a26-08-plan-done`

**Enkidu** _(sad)_: If you go, I’ll go. Somebody has to bring you back.  

### Step 2: Go with the friends to the elders, then up to Ninsun’s roof.

Hint: The elders meet at the city gate. Ninsun prays on the roof at sunrise. · check: `watch:a26-ninsun:roof`

#### <a id="a26-08-elders"></a>Scene `a26-08-elders`

_The elders of Uruk sit on their benches by the gate. They hear Gilgamesh out, and shake their heads, all together._  
**Elder of Uruk**: You’re young, Gilgamesh. Your heart runs ahead of you. You don’t know what you’re talking about.  
**Elder of Uruk** _(soft)_: Let Enkidu go first. He knows the road. And come back to us. We have got used to you.  
_At sunrise Ninsun climbs her roof in her best robe and crown. She lifts incense to the sun god Shamash._  
**Ninsun** _(sad)_: Why did you give my son a heart that never rests? Now he’s going a long way, to a fight he doesn’t know.  
**Ninsun**: Watch over him. Let the long days go fast for him. And bring him home.  
_The sun climbs a little higher, and is very bright. You decide that is a yes._  

**Choices**

- **Bow your head while she prays.**
    - You bow your head. Beside you your Nubbin does too, and peeks.
- **Watch the sun come up.**
    - You watch the sun. It is enormous, and gold, and seems to be looking straight back at the roof.

#### <a id="a26-08-elders-done"></a>Done `a26-08-elders-done`

**Ninsun** _(soft)_: Enkidu. You’re not my son by birth, but I’m giving him to you to look after. Bring him home.  

### Step 3: Pack the bread for the road while the smiths forge the axes.

Hint: Go to the bakehouse, then carry the packs to the gate. · check: `carry:a26-bread:gate`

#### <a id="a26-08-pack"></a>Scene `a26-08-pack`

_All morning the smiths’ hammers ring. They cast axes for the friends, and swords, so heavy two men groan to lift each._  
_Your job is bread. You pack the flat loaves in cloth, with dates and onions and a pot of oil._  
_You pack them the way your Nubbin likes its fruit: the soft things on top, so nothing gets squashed._  
**Gilgamesh**: Bread? I’m going to fight a monster. I don’t need bread.  
**Enkidu**: You’ll need bread. You always need bread. That’s the first thing I learned about people.  
_Enkidu takes the pack from you, and checks it, and nods._  

**Choices**

- **Pack an extra loaf, just in case.**
    - **Enkidu**: Good. That one’s for coming home.
- **Fill the waterskins too.**
    - You fill the waterskins at the well. Water-carrier: it is your job now, and you are good at it.

### Complete

#### <a id="a26-08-complete"></a>Complete `a26-08-complete`

_The whole city comes out to the gate to see them off. The elders give their blessings, and a lot of advice._  
**Elder of Uruk**: Let Enkidu go ahead. Trust him. And take the water-carrier. Somebody sensible ought to go.  
_So you go too, with your Nubbin on the pack. The wall of Uruk gets smaller behind you, and then is gone._  

**Rewards**


Sets on completion: `{"a26-08":true}`

**Notes:** CARE: the axes and swords are carried, never swung on screen. Ninsun’s prayer is shown with respect: incense, her crown, the sun; the player is never asked to perform a rite, and the bow is only a choice of where to look.

## A26-9. Dreams on the Mountain

*The Epic of Gilgamesh, Standard Babylonian version: Tablet IV: the journey, the dreams each night, and Enkidu’s good readings* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-8, from Nova’s atlas. · requires: A26-8

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Make camp on the mountain and keep the fire.

Hint: Gather brush on the slope, then build the fire in the hollow by the well. · check: `build:a26-fire:mountain`

#### <a id="a26-09-fire"></a>Scene `a26-09-fire`

_They walk fifty leagues a day: what would take anyone else a month and a half. You and your Nubbin trot to keep up._  
_Each evening, Gilgamesh climbs a mountain and pours out flour as a gift, and asks for a dream. Then you make camp._  
_You dig a well, and build the fire, and Enkidu builds a little shelter of brush so the king can sleep out of the wind._  
_Gilgamesh sleeps with his chin on his knees, like a boy. In the night he sits bolt upright._  
**Gilgamesh** _(shock)_: Enkidu. Did you call me? Why am I awake? Did a god pass by? I’m cold all over.  
**Gilgamesh**: I dreamed a mountain fell on me. It pinned me down like a fly.  
**Enkidu** _(happy)_: A good dream! A very good dream. The mountain is Humbaba, and he’ll fall. We’ll stand on him.  

**Choices**

- **Build the fire up higher.**
    - You pile on more brush. The fire jumps up, and the dark backs off a little, and Gilgamesh lies down again.
- **Put your blanket over the king.**
    - You put your blanket over him, and he doesn’t notice. In the morning he will think he dreamed that too.

#### <a id="a26-09-fire-done"></a>Done `a26-09-fire-done`

_Enkidu waits until the king is snoring. Then he looks at you across the fire, and his face is not happy at all._  

### Step 2: Keep the watch through the nights on the road.

Hint: Sit up by the fire while the friends sleep. · check: `wait:a26-watch:mountain`

#### <a id="a26-09-watch"></a>Scene `a26-09-watch`

_Every night it is the same. A mountain, a dream, a cold wake in the dark._  
_Gilgamesh dreams of a wild bull, of thunder, of a sky that rains down fire and ash._  
_And every morning Enkidu says, cheerfully, it’s a good dream, the best dream yet._  
**Enkidu** _(happy)_: A wild bull? That’s Shamash, looking after you. Thunder? That’s our luck, shouting for us. Fire? Warm hands.  
_On the fifth night, while the king sleeps, Enkidu sits down beside you at the fire._  
**Enkidu** _(sad)_: They were bad dreams. All of them. You know that.  
**Enkidu**: But you can’t send a man to a fight with a bad dream on him. So I tell him it was good. That’s what friends are for.  

**Choices**

- **Tell him he did the right thing.**
    - **Enkidu**: Did I? I hope so. I’m new at friends.
- **Ask him who tells him the dreams are good.**
    - **Enkidu**: Nobody. That’s all right. I’ve got you up, keeping the fire.

#### <a id="a26-09-watch-done"></a>Done `a26-09-watch-done`

_He falls asleep sitting up, with his head on his knees. You keep the fire till dawn._  
_In the morning, on the skyline, there is a dark green line, and a smell like a sawmill. The Cedar Forest._  

### Complete

#### <a id="a26-09-complete"></a>Complete `a26-09-complete`

_The cedars are taller than the wall of Uruk. Their shade is so cool and deep it looks like water._  
**Gilgamesh** _(happy)_: There. Didn’t I say? Good dreams, every one.  
_Enkidu says nothing. He puts his hand flat on the first cedar, as if to say sorry to it._  

**Rewards**


Sets on completion: `{"a26-09":true}`

**Notes:** Tablet IV’s five dreams are told as one first dream in full (the mountain) and a montage of the others. Fifty leagues a day is the epic’s; the walk is a short travel scene, not a minigame. The well, the flour and the brush shelter are the epic’s.

## A26-10. Humbaba

*The Epic of Gilgamesh, Standard Babylonian version: Tablet V: the first cedar; Humbaba; Shamash’s winds; the plea; the great cedar sent down the Euphrates* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-9, from Nova’s atlas. · requires: A26-9

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Humbaba (Humbaba, guardian of the Cedar Forest, set there by Enlil (The Epic of Gilgamesh, Standard Babylonian version)), Shamash (Shamash, the sun god, heard as a voice out of the sun (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Follow the friends into the Cedar Forest.

Hint: Keep to Humbaba’s path between the cedars, and stay behind Enkidu. · check: `explore:a26-forest:cedar-mountain`

#### <a id="a26-10-forest"></a>Scene `a26-10-forest`

_Humbaba’s path runs straight into the forest, wide and clean, as if someone swept it every morning. Somebody does._  
_The cedars smell of resin and old shade, and no birds sing here. Your Nubbin walks so close to your heels it treads on them._  
**Gilgamesh**: This one. The tallest we’ve passed. Let’s see if he comes.  
_Gilgamesh lifts his axe and cuts into a cedar. The sound goes off through the forest like a dropped plate._  
_Far away, something roars. It is not loud, exactly; it is everywhere, like weather._  
**Humbaba** _(angry)_: Who has come into my forest? Who has cut my tree?  
_Then he is there between the trees: huge, and ancient, with a face like a coil of wool and seven bright glories round him like cloaks._  

**Choices**

- **Stand very still.**
    - You stand very still. His eyes pass over you and your Nubbin and move on: you were never the ones he wanted.
- **Pull your Nubbin behind a cedar.**
    - You pull your Nubbin behind a cedar. The bark is warm, and you feel the tree breathe, or you think you do.

#### <a id="a26-10-forest-done"></a>Done `a26-10-forest-done`

**Gilgamesh** _(shock)_: Shamash! Now! You promised my mother!  

### Step 2: Stand by while Humbaba begs, and decide what you will say.

Hint: Stay close to the friends. Choose what to say when Gilgamesh looks round. · check: `choose:a26-humbaba:forest`

#### <a id="a26-10-plea"></a>Scene `a26-10-plea`

**Shamash**: I hear.  
_The voice comes out of the sun. Then the winds come: thirteen great winds from every side, roaring through the cedars._  
_They pin Humbaba where he stands, like a hand holding down a leaf. He can’t go forward, and he can’t go back._  
**Humbaba** _(sad)_: Gilgamesh. Let me live. I will be your servant. I will cut the cedars for you myself, as many as you want.  
**Humbaba**: This forest is all I have. Enlil gave it to me to keep. I have kept it since before your city had a wall.  
_Gilgamesh lowers his axe a little and looks at Humbaba for a long time. Something in his face is changing._  
**Enkidu** _(angry)_: Don’t listen to him, my friend. Finish it. Before the great gods hear and stop you. Make your name.  
_Gilgamesh turns his head, and looks at you. Of everyone in the forest, it’s you he looks at._  

**Choices**

- **Speak for Humbaba: let him go.** — sets `{"a26-humbaba":"spoke"}`
    - **You**: Let him go. He’s only doing what he was told. He’s keeping his trees, like you keep your wall.
    - Enkidu stares at you, and Gilgamesh’s axe drops lower. For a long breath, nobody moves.
- **Say nothing.** — sets `{"a26-humbaba":"silent"}`
    - You say nothing; you don’t know what is right. You hold on to your Nubbin, and the wind roars, and Gilgamesh looks away.
- **Agree with Enkidu.** — sets `{"a26-humbaba":"agreed"}`
    - **You**: Enkidu’s right. He knows this forest. If he says finish it, finish it.
    - Enkidu nods at you, grim. Gilgamesh lifts his axe again.

#### <a id="a26-10-plea-done"></a>Done `a26-10-plea-done`

_Whatever anyone says, Gilgamesh has already decided. He steps forward into the wind, and Enkidu goes with him._  
_You turn your face away, into your Nubbin’s fur._  
_The wind drops: all thirteen winds, all at once. And the Cedar Forest goes quiet, the deep quiet of a held breath let go._  

### Step 3: Help send the great cedar down the river to Uruk.

Hint: Carry the ropes to the riverbank and help lash the raft. · check: `carry:a26-cedar:river`

#### <a id="a26-10-river"></a>Scene `a26-10-river`

_Afterwards nobody talks much. The friends cut cedars, and Enkidu cuts the tallest of all, whose top scraped the sky._  
**Enkidu** _(sad)_: We’ll make a door of it. Seventy-two cubits high. For Enlil’s temple. So he isn’t angry with us.  
_You carry ropes and lash logs. Your Nubbin carries one twig at a time, very solemnly, to the raft._  
_Gilgamesh says nothing at all. He keeps looking back at the forest, which doesn’t look back._  
_At last the raft is lashed, and the friends push it out into the Euphrates. It turns once, slowly, and sets off home._  
_Gilgamesh rides on the raft with the great log, and Enkidu poles. You sit at the back with your feet in the water._  

**Choices**

- **Keep a cedar cone in your pocket.**
    - You pick up a cedar cone and keep it in your pocket. It smells of the forest the whole way home.
- **Look back at the forest until it’s gone.**
    - You look back until the forest is only a dark line, and then not even that. Somebody should.

### Complete

#### <a id="a26-10-complete"></a>Complete `a26-10-complete`

_The river carries you home through the reeds. Herons stand on one leg and watch the raft go by._  
_Gilgamesh has made his name. He doesn’t look as if it fits him quite as he expected._  

**Rewards**


Sets on completion: `{"a26-10":true}`

**Notes:** THE SIGNATURE CHOICE: a26-10-plea sets a26-humbaba = spoke | silent | agreed. It pays off in A26-13 (a26-13-dream-done), A26-14 (a26-14-sickbed-done) and A26-18 (a26-18-foot, and Moss’s extra line). Gilgamesh kills Humbaba on every path. CARE: his death is offscreen: the camera holds on your Nubbin’s fur, then on the trees as the wind drops and the forest goes quiet. No axe stroke, no head, no body. Humbaba is drawn huge and strange but not gory: a face like coiled wool, seven glories like pale cloaks of light. The thirteen winds are the epic’s. Shamash speaks two words (“I hear.”), out of the sun.

## A26-11. Ishtar

*The Epic of Gilgamesh, Standard Babylonian version: Tablet VI: Gilgamesh in his crown; Ishtar’s offer; his refusal; Ishtar goes to Anu* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-10, from Nova’s atlas. · requires: A26-10

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Ishtar (Ishtar, goddess of Uruk (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Fetch warm water for the king to wash.

Hint: Heat water in the palace kitchen and carry it to the king’s rooms. · check: `carry:a26-water:palace`

#### <a id="a26-11-wash"></a>Scene `a26-11-wash`

_Home in Uruk, Gilgamesh asks for warm water. You carry it up, jar after jar, until the king’s rooms are full of steam._  
_He washes the forest out of his long hair and shakes it down his back. He puts on clean clothes and his crown._  
**Gilgamesh**: There. Do I look like a king who has made a name?  
**Enkidu**: You look like a king who has had a bath. That’s a start.  
_Gilgamesh throws a wet cloth at him. It is the first time either of them has laughed since the forest._  
_Then the light in the room goes gold and strange, as if the sun had come indoors. Your Nubbin’s fur stands up._  

**Choices**

- **Hand Enkidu a dry cloth.**
    - You hand Enkidu a dry cloth. He holds it like a shield, and peers at the gold light.
- **Put down the jar and stand by the door.**
    - You put the jar down and stand by the door. Whoever is coming, you would like to be near the way out.

### Step 2: Stand by while the goddess Ishtar makes her offer.

Hint: Stay by the door with your Nubbin. Don’t get between a goddess and a king. · check: `watch:a26-ishtar:palace`

#### <a id="a26-11-offer"></a>Scene `a26-11-offer`

_The goddess Ishtar stands in the doorway, bright as the evening star. Her eyes are fixed on Gilgamesh, and nobody else._  
**Ishtar** _(happy)_: Gilgamesh. You’re beautiful. Marry me. Be my husband, and I’ll give you a chariot of lapis and gold.  
**Ishtar**: Kings will kneel to you. Your goats will have triplets. Your ewes, twins. You’ll want for nothing.  
_Gilgamesh looks at her for a long moment. Then he shakes his head._  
**Gilgamesh** _(think)_: Marry you? Everyone you’ve loved has come to grief. The shepherd you made into a wolf. The gardener you turned into a frog.  
**Gilgamesh**: The little bird you loved, whose wing you broke. He sits in the woods crying “my wing”. Why would I be different?  
_Ishtar’s face goes very still. The gold light in the room turns the colour of a storm._  
**Ishtar** _(angry)_: You will be sorry, king of Uruk.  

**Choices**

- **Bow low as she passes.**
    - You bow low as she sweeps past. You feel her look at you, briefly, as if at a fly on a wall.
- **Keep your Nubbin out of her way.**
    - You scoop your Nubbin out of her path. The hem of her robe crackles past it like summer lightning.

#### <a id="a26-11-offer-done"></a>Done `a26-11-offer-done`

**Enkidu** _(shock)_: That was not clever, brother.  
**Gilgamesh**: No. But it was true.  

### Complete

#### <a id="a26-11-complete"></a>Complete `a26-11-complete`

_High above the city, in a place you can only half see, Ishtar weeps in front of her father Anu, king of the gods._  
_She asks him for the Bull of Heaven. When he says no, she says she will break open the gates of the dead._  
_Anu gives her the Bull._  

**Rewards**


Sets on completion: `{"a26-11":true}`

**Notes:** CARE: Ishtar’s lovers get one plain line, and only the kid-safe ones from the list in Tablet VI (the shepherd made a wolf, the gardener Ishullanu made a frog, the allallu bird with the broken wing). Her offer is marriage and gifts only. The scene with Anu is seen as if through clouds; her threat stays “the gates of the dead”, with no picture of them.

## A26-12. The Bull of Heaven

*The Epic of Gilgamesh, Standard Babylonian version: Tablet VI: the Bull of Heaven; the friends bring it down; Enkidu and Ishtar on the wall; the ride through Uruk* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-11, from Nova’s atlas. · requires: A26-11

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Woman of Uruk (The people of Uruk (The Epic of Gilgamesh, Standard Babylonian version); this one is our own)

### Step 1: Get the children in the market away from the cracks.

Hint: Lead them up the wall stairs, away from the river side of the market. · check: `escort:a26-children:market`

#### <a id="a26-12-bull"></a>Scene `a26-12-bull`

_It comes down out of the sky on the river side of town: a bull the size of a temple, the colour of thunderclouds._  
_It snorts, and the ground cracks open, and a hundred market stalls tip into the hole._  
_It snorts again, and the river leaps its banks, and everyone is shouting. A crowd of children is stuck by the fruit stalls._  
**Woman of Uruk** _(shock)_: The children! Somebody get the children!  
_You know the way: up the wall stairs, minding the third one. You hold out both hands._  
_Your Nubbin runs ahead and stops on every step to look back, so the smallest ones have something to follow._  

**Choices**

- **Lead the children up the stairs.**
    - You lead them up, two at a time, holding hands in a long chain. Nobody lets go.
- **Carry the smallest one.**
    - You lift the smallest child on to your hip. She grips your collar with both fists and doesn’t cry once.

#### <a id="a26-12-bull-done"></a>Done `a26-12-bull-done`

_From the top of the wall you can see it all: the Bull, the cracks, and two small figures running straight at it._  
**Woman of Uruk** _(shock)_: That’s the king. And his brother. They’re mad. They’re both completely mad.  

### Step 2: Watch from the wall as the friends face the Bull together.

Hint: Stay on the wall with the children. Keep them back from the edge. · check: `watch:a26-bull:wall`

#### <a id="a26-12-fight"></a>Scene `a26-12-fight`

_Enkidu grabs the Bull by its horns. It throws froth in his face and lashes its great tail, and he holds on._  
**Enkidu**: Now, brother! Together!  
_Gilgamesh comes in from the side, and the dust goes up like a wall of its own, and you can’t see anything at all._  
_The children hold their breath. Your Nubbin covers its eyes, then uncovers one._  
_When the dust settles, the Bull of Heaven lies on its side in the square, quite still, like a hill that has lain down._  
_Ishtar appears on the wall of Uruk, in a storm of gold. Enkidu glares up at her from the square._  
**Enkidu** _(angry)_: If I could reach you, I’d do the same to you! Go home! Leave our city alone!  
_Ishtar turns away with her women, and weeps for the Bull. Then she is gone._  

**Choices**

- **Cheer with the children.**
    - You cheer, the children cheer, and somebody bangs a pot. The whole wall shakes with it.
- **Look at the Bull for a while.**
    - You look at the Bull for a while. It came because someone was angry; it never chose to come at all.

### Complete

#### <a id="a26-12-complete"></a>Complete `a26-12-complete`

_That night the friends ride through the streets of Uruk in a chariot. The people line the way, shouting their names._  
**Gilgamesh** _(happy)_: Who is the finest of men? Who is the bravest?  
**Woman of Uruk**: Gilgamesh! And Enkidu!  
_Enkidu waves. He catches sight of you in the crowd, and waves harder, until your Nubbin waves back with both arms._  

**Rewards**


Sets on completion: `{"a26-12":true}`

**Notes:** CARE: softened for All, as the outline says: no wound, no heart cut out, no thrown thigh. The fight happens inside a dust cloud; when it clears the Bull lies still, like a hill lying down. Enkidu only shouts at Ishtar. The cracks swallow stalls, never people; the children are all safe. Ishtar’s mourning is kept to one line.

## A26-13. The Gods’ Council

*The Epic of Gilgamesh, Standard Babylonian version: Tablet VII: Enkidu’s dream of the gods’ judgement; his curses; Shamash’s reply; his blessing of Shamhat* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-12, from Nova’s atlas. · requires: A26-12

**Cast:** Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Shamash (Shamash, the sun god, heard as a voice out of the sun (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Sit with Enkidu when he wakes from his dream.

Hint: He has called for you before dawn. Go to his room. · check: `sit:a26-enkidu:dawn`

#### <a id="a26-13-dream"></a>Scene `a26-13-dream`

_Before dawn a servant shakes you awake. Enkidu is asking for you, and for the king._  
_He is sitting on the edge of his bed with the blanket round his shoulders. He is very pale._  
**Enkidu** _(sad)_: I dreamed. The great gods sat in council: Anu, and Enlil, and Shamash. They were talking about us.  
**Enkidu**: Because we killed Humbaba, and the Bull of Heaven, one of us has to die. Enlil said so.  
**Enkidu**: And it won’t be Gilgamesh. It will be me.  
**Gilgamesh** _(shock)_: No. No. It was a dream. I’ll tell you it was a good one, the way you did for me.  
_Enkidu tries to smile at that. He doesn’t quite manage it._  

**Choices**

- **Sit down on the bed beside him.**
    - You sit down beside him, and the bed creaks. Your Nubbin climbs up on his other side.
- **Bring him a cup of water.**
    - You bring him water. His hands shake, so you hold the cup with him until he has drunk.

#### <a id="a26-13-dream-done"></a>Done `a26-13-dream-done`

_Enkidu turns to look at you. He doesn’t say anything at all._  
_He takes your hand, and holds it, quite hard, while the window goes from black to grey._  

#### <a id="a26-13-dream-done-spoke"></a>Variant `a26-13-dream-done-spoke`

_Variant of `a26-13-dream-done`._

_Enkidu turns to look at you. His eyes are wet._  
**Enkidu** _(sad)_: You said to let him go. You were the only one.  
**Enkidu**: I told him to finish it. I was frightened, so I was cruel. I wish I’d listened to you.  
_He takes your hand, and holds it, quite hard, while the window goes from black to grey._  

#### <a id="a26-13-dream-done-agreed"></a>Variant `a26-13-dream-done-agreed`

_Variant of `a26-13-dream-done`._

_Enkidu turns to look at you. He tries to smile._  
**Enkidu** _(sad)_: We did it together. We’ll carry it together.  
_He takes your hand, and holds it, quite hard, while the window goes from black to grey._  

### Step 2: Go with Enkidu to the cedar door.

Hint: He wants to see the great door at the temple. Walk him there. · check: `talk:a26-enkidu:cedar-door`

#### <a id="a26-13-door"></a>Scene `a26-13-door`

_He wants to see the cedar door, so you walk him to the temple, slowly. It stands there, huge and fragrant and new._  
**Enkidu** _(angry)_: Door. If I’d known what you would cost me, I’d have left you standing in your forest.  
**Enkidu** _(angry)_: And the trapper. If he’d left me alone at the water. And Shamhat, who taught me to talk. I curse them all.  
_The sun comes up over the wall. It shines straight into the doorway, and a voice comes out of it._  
**Shamash**: Enkidu. Why curse Shamhat? She gave you bread fit for a god. She gave you clothes to wear.  
**Shamash**: She gave you Gilgamesh for a friend. And when you go, he will weep for you, and the whole city will.  
_Enkidu stands very still in the sunlight. His face crumples, and then, slowly, it clears._  

**Choices**

- **Tell him she gave him bread, too, the first day.**
    - **Enkidu**: She did. I licked it first. You were there.
- **Stay quiet, and let him think.**
    - You stay quiet. The sun is warm on the three of you: Enkidu, you, and your Nubbin, leaning on his leg.

#### <a id="a26-13-door-done"></a>Done `a26-13-door-done`

**Enkidu** _(soft)_: Shamhat. I take it back. Let kings love you, and princes. Let people bring you gold and lapis and oil.  
**Enkidu**: Let nobody ever leave you. You found me in the grass and brought me home. I bless you.  

### Complete

#### <a id="a26-13-complete"></a>Complete `a26-13-complete`

_By noon he is too tired to stand. Gilgamesh carries him back to bed, as easily as he once carried a star in a dream._  
**Gilgamesh**: Rest. Then you’ll be better. You always get better. You’re the strongest man in the world, after me.  
**Enkidu** _(soft)_: After you. Of course.  

**Rewards**


Sets on completion: `{"a26-13":true}`

**Notes:** HUMBABA PAYOFF (a26-humbaba): a26-13-dream-done as written is the silent path (he holds your hand). For spoke, play A26_VARIANTS a26-13-dream-done-spoke; for agreed, a26-13-dream-done-agreed. Shamhat is not present: Enkidu blesses her by name, as in the epic. Shamash is a voice out of the sun only, and is kind.

## A26-14. Twelve Days

*The Epic of Gilgamesh, Standard Babylonian version: Tablets VII and VIII: Enkidu’s illness and death; Gilgamesh’s grief; the statue* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-13, from Nova’s atlas. · requires: A26-13

**Cast:** Enkidu (Enkidu, the wild man made from clay, Gilgamesh’s friend (The Epic of Gilgamesh, Standard Babylonian version)), Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Sit with Enkidu while he is ill.

Hint: Take water to his room, and stay. · check: `sit:a26-enkidu:sickbed`

#### <a id="a26-14-sickbed"></a>Scene `a26-14-sickbed`

_Enkidu lies ill for twelve days. Each day he is a little more tired, and a little further away._  
_You fetch water and cool cloths. Mostly you just sit, on the stool by the bed, because he likes someone there._  
_Gilgamesh sits on the other side, and doesn’t sleep. You have never seen him sit still so long._  
**Enkidu** _(soft)_: Tell me about where you come from. Is it big, like Uruk?  
**You**: No. It’s small. There’s a garden, and a pond, and a hill.  
**Enkidu**: A hill. Good. I like hills. You can see what’s coming.  
_Your Nubbin lies on the end of the bed, across his feet, to keep them warm. He says it’s the best blanket he’s ever had._  

**Choices**

- **Tell him about the Grove.**
    - You tell him about the Grove: the Nubbins, the fruit trees, the lanterns. He listens with his eyes shut, smiling.
- **Hum the tune he sang at the shepherds’ fire.**
    - You hum the tune he sang at the shepherds’ fire, and get it a bit wrong. He hums it back right, very quietly.
- **Just hold his hand.**
    - You hold his hand. It is very big, and very warm, and it holds yours back.

#### <a id="a26-14-sickbed-done"></a>Done `a26-14-sickbed-done`

**Enkidu**: Water-carrier. Will you do something for me, after?  
**Enkidu** _(soft)_: Look after the gazelles. Not the city ones. The wild ones, at the water hole. Make sure nobody digs pits there.  
**You**: I will.  

#### <a id="a26-14-sickbed-done-spoke"></a>Variant `a26-14-sickbed-done-spoke`

_Variant of `a26-14-sickbed-done`._

**Enkidu**: Water-carrier. Will you do something for me, after?  
_He opens his big hand, and in it is a cedar seed, small and brown, from the forest. He must have carried it all this way._  
**Enkidu** _(soft)_: Plant it. For Humbaba’s forest. One tree back, for all the ones we took. You’ll know where.  
**You**: I will.  

#### <a id="a26-14-sickbed-done-agreed"></a>Variant `a26-14-sickbed-done-agreed`

_Variant of `a26-14-sickbed-done`._

**Enkidu**: Water-carrier. Will you do something for me, after?  
**Enkidu** _(soft)_: Remember me to the shepherds. Tell them their watchman thought of them. Tell them to keep the lamps lit for the sheep.  
**You**: I will.  

### Step 2: Stay with Enkidu and Gilgamesh on the twelfth day.

Hint: Stay in the room. There is nothing to do but be there. · check: `wait:a26-enkidu:twelfth-day`

#### <a id="a26-14-death"></a>Scene `a26-14-death`

_On the twelfth day the house is very quiet. Even the street outside seems to walk on tiptoe._  
_Gilgamesh hasn’t left the bedside for days. You keep bringing water, and he keeps not drinking it._  
**Enkidu** _(soft)_: Brother. Do you remember the door? Your knee in the dust?  
**Gilgamesh**: I let you win.  
**Enkidu** _(happy)_: You did not.  
_He laughs, a little, and closes his eyes. Your Nubbin is curled against his hand, and it doesn’t move, and neither do you._  
_Some time in the afternoon his breathing goes slower, and softer. Then it stops, as gently as a door being closed._  
_Gilgamesh doesn’t move for a long time. Then he draws the cloth over his friend’s face, carefully, like a bride’s veil._  
_He gets up and walks the room, up and down, up and down, like a lioness whose cubs are gone._  
**Gilgamesh** _(sad)_: O Enkidu, he was my comrade, who ran with me through the mountains and the cedar forest, and never once let go.  
**Gilgamesh** _(sad)_: Who will I tell my dreams to now?  
_You don’t have an answer; nobody has. You sit on the floor by the bed, and wait, and the light goes._  

#### <a id="a26-14-death-done"></a>Done `a26-14-death-done`

_Your Nubbin climbs down off the bed, and into Gilgamesh’s lap when at last he sits, and stays there._  
_It doesn’t do anything or make a sound all night. It is the kindest thing anyone does._  

#### <a id="a26-14-death-done-moss"></a>Variant `a26-14-death-done-moss`

_Variant of `a26-14-death-done`._

_Moss climbs down from your shoulder, slowly, and sits on the end of the bed, by Enkidu’s feet._  
_He says nothing at all. Not one word, all night._  
_You have known him long enough to know what that means. It is the kindest thing he has._  
_Your Nubbin climbs into Gilgamesh’s lap when at last he sits, and stays there too._  

### Step 3: Go with Gilgamesh when he has a statue made of his friend.

Hint: Find the king in the smiths’ quarter, with the gold and the lapis. · check: `watch:a26-statue:palace`

#### <a id="a26-14-statue"></a>Scene `a26-14-statue`

_Gilgamesh calls every smith and jeweller in Uruk. He wants a statue of his friend, and it must be perfect._  
_They make it of gold and lapis, and polish it until it shines. It has Enkidu’s big hands, and his grin._  
_The whole city weeps for him: the elders, the shepherds, the woman from the square. Even the river seems to._  
**Gilgamesh** _(sad)_: He’s not in it. Look at it. It’s beautiful, and he’s not in it.  
_Gilgamesh stands in front of the statue for a long time. Then he looks at his own hands, as if they belonged to someone else._  
**Gilgamesh** _(shock)_: I’m going to die too. Like him. I’ll lie down, and not get up, for ever. I can’t bear it.  

**Choices**

- **Put a date by the statue, for Enkidu.**
    - You put a date at the statue’s feet. It is the first thing he ever ate from a person’s hand.
- **Stand next to Gilgamesh.**
    - You stand next to him. He doesn’t look at you, but he doesn’t send you away either.

### Complete

#### <a id="a26-14-complete"></a>Complete `a26-14-complete`

**Gilgamesh**: There is one man the gods let live for ever. Uta-Napishtim, at the end of the world. I’ll find him. I’ll ask him how.  
_He tears off his fine clothes, and pulls on rough lion skins, and walks out of the city gate without saying goodbye._  
_You fill the waterskins, and your Nubbin climbs on to the pack. Somebody has to carry the water._  

**Rewards**


Sets on completion: `{"a26-14":true}`

**Learning Grove swaps**

- `a26-14-death#9` → Enkidu was my friend, my brother. He ran with me through the mountains and the cedar forest, and never once let go.

**Notes:** HUMBABA PAYOFF (a26-humbaba): a26-14-sickbed-done as written is the silent path (the gazelles). For spoke, play A26_VARIANTS a26-14-sickbed-done-spoke (a cedar seed); for agreed, a26-14-sickbed-done-agreed (the shepherds). MOSS: if he comes, play a26-14-death-done-moss in place of a26-14-death-done; he says nothing at all, which is his kindest thing. CARE: gentle and grave, like Fossil’s fading: the breath slows and stops; the cloth goes over his face; no decay, no worm (cut). Music drops out at a26-14-death#6. Lifted line 3 at a26-14-death#9 (Thompson, Tablet X: the opening words only, then our own). The third rule is acted (you sit and wait), never quoted.

## A26-15. Lion Skins

*The Epic of Gilgamesh, Standard Babylonian version: Tablet IX: Gilgamesh in lion skins; the mountains of Mashu; the scorpion-people; the road of the sun; the jewelled garden* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-14, from Nova’s atlas. · requires: A26-14

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Scorpion-man (The scorpion-man who guards the gate of the mountains of Mashu (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Follow Gilgamesh to the twin mountains of Mashu.

Hint: Keep up with him across the wilderness. Carry the water. · check: `walk:a26-gilgamesh:mashu`

#### <a id="a26-15-road"></a>Scene `a26-15-road`

_Gilgamesh walks the wild places in his lion skins. His beard grows ragged and his face grows thin._  
_He doesn’t talk. At night he lies awake and looks at the stars as if they owed him money._  
**Gilgamesh** _(sad)_: I used to be afraid of nothing. Now I’m afraid of everything. Of lying down. Of not getting up.  
_You give him water. He drinks it now, at least, a little, which you count as a good day._  
_At last two mountains rise ahead, so tall they hold up the sky, with a gate between them where the sun goes in and out._  
_Your Nubbin, on the pack, has gone very small and quiet. It puts its paws over its eyes, then uncovers one._  

**Choices**

- **Make him eat some bread.**
    - **Gilgamesh**: You sound like him.
    - But he eats it.
- **Lie down and look at the stars with him.**
    - You lie down beside him and look. After a while, without meaning to, he points out a star Enkidu liked.

#### <a id="a26-15-road-done"></a>Done `a26-15-road-done`

_By the gate there are two figures, keeping watch. They are people down to the waist, and scorpions below._  

### Step 2: Wait while the scorpion-man and his wife decide whether to let you through.

Hint: Stand back behind Gilgamesh, and let him do the talking. · check: `talk:a26-scorpion:mashu-gate`

#### <a id="a26-15-gate"></a>Scene `a26-15-gate`

_The scorpion-man is terrible to look at, with a glare that could bring down a mountain. His wife stands at his side._  
**Scorpion-man**: Look, wife. He’s two parts god, this one, and one part man. And who is the small one with the water?  
_His wife looks at you, and at your Nubbin, and tilts her head. You think, from her face, that she rather likes small ones._  
**Gilgamesh**: I’m looking for Uta-Napishtim, who lives for ever. I want to ask him about life, and death.  
**Scorpion-man** _(think)_: No one has ever gone this way. Twelve double-hours of dark, with no light at all. Nobody comes out the other side.  
**Gilgamesh**: I’ll go anyway. In grief, and in pain, in cold and in heat. Open the gate.  
**Scorpion-man** _(soft)_: Then go, and come back safe. The gate is open.  

**Choices**

- **Thank the scorpion-people.**
    - You thank them, and the scorpion-man doesn’t answer. His wife lifts one claw, very slightly, like a wave.
- **Take hold of Gilgamesh’s belt before the dark.**
    - You take hold of his belt. He looks down at your hand, and then lets you.

### Step 3: Walk the dark road of the sun holding on to Gilgamesh’s belt.

Hint: Don’t let go. Count the double-hours as you go. · check: `walk:a26-dark:mashu`

#### <a id="a26-15-dark"></a>Scene `a26-15-dark`

_The dark inside the mountain is thicker than any night. You can’t see your hand, or Gilgamesh._  
_You can feel his belt, though, and the rough lion skin, and your Nubbin’s breath on your neck. You hold on._  
**Gilgamesh**: One double-hour. Thick dark. Nothing.  
**Gilgamesh** _(sad)_: Four. Five. Still nothing.  
_He counts aloud, so you know he’s there. You count with him, so he knows you are._  
**Gilgamesh** _(think)_: Nine. I feel the north wind on my face.  
**Gilgamesh** _(shock)_: Eleven. There’s light. Look. Look!  
_At the twelfth double-hour you step out into the sun, blinking, into a garden where the trees bear jewels._  
_Carnelian hangs in bunches like grapes, and the leaves are lapis. Your Nubbin reaches up to touch one, very gently._  

#### <a id="a26-15-dark-done"></a>Done `a26-15-dark-done`

_Your Nubbin is shivering, from the cold of the dark. Gilgamesh looks at it for a moment._  
_Then he cuts a strip off the edge of his lion skin with his knife, and wraps it round the Nubbin’s shoulders like a cloak._  

### Complete

#### <a id="a26-15-complete"></a>Complete `a26-15-complete`

**Gilgamesh**: There. Now you look like a hero too. Don’t let it go to your head.  
_It is the first joke he has made since the twelve days. Your Nubbin wears the cloak with enormous pride._  
_Beyond the jewelled garden there is a sea, and a little house beside it, with smoke coming from the chimney._  

**Rewards**

- Lion-skin cloak (cosmetic): A little cloak of plain tawny fur for your Nubbin, cut from the edge of Gilgamesh’s lion skins. No head, no claws: just warm.

Sets on completion: `{"a26-15":true}`

**Notes:** The cloak is plain fur, no head or paws (outline). No lion is seen alive or killed; the skins are only what he wears. The scorpion-people are drawn awe-inspiring but not horror: human above, scorpion below, with a glare like heat haze. The twelve double-hours are a dark walk with only voices and a faint outline of your hand on the belt; the count in the epic is kept in short. Reduced motion: no flicker in the dark.

## A26-16. Siduri

*The Epic of Gilgamesh, Standard Babylonian version: Tablet X: Siduri the ale-wife; Ur-Shanabi and the Stone Things; the punting poles; the Waters of Death* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-15, from Nova’s atlas. · requires: A26-15

**Cast:** Siduri (Siduri, the ale-wife by the sea (The Epic of Gilgamesh, Standard Babylonian version)), Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Ur-Shanabi (Ur-Shanabi, Uta-Napishtim’s boatman (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Sit in Siduri’s tavern by the sea and hear what she says.

Hint: Siduri has barred her door. Wait until she opens it. · check: `talk:a26-siduri:tavern`

#### <a id="a26-16-siduri"></a>Scene `a26-16-siduri`

_By the sea at the edge of the world there is a little tavern with a vine over the door. Siduri keeps it._  
_She sees a wild man in lion skins coming up the beach, and bars her door, and climbs up on her roof to look._  
**Siduri** _(shock)_: Who are you, looking like that? Your cheeks are hollow. You look like someone who has walked a very long way.  
**Gilgamesh** _(sad)_: I’m Gilgamesh. My friend died. I can’t bear it. I’m looking for the man who never dies.  
_Siduri looks at him for a long time. Then she climbs down, and opens the door, and gives you each a stool and a cup._  
**Gilgamesh**: Tell me the way across the sea. Please.  
**Siduri**: Gilgamesh, why runnest thou, the life which thou seekest,  
**Siduri**: Thou canst not find?  
**Siduri** _(soft)_: When the gods made people, they kept life for themselves. So eat. Wash your hair. Dance, if you like.  
**Siduri**: Cherish the little one holding thy hand; be thy spouse in thy bosom  
**Siduri**: That’s what people are for. That is the whole of it.  
_Gilgamesh turns his cup round and round. He isn’t listening, and he doesn’t want to._  

**Choices**

- **Tell Siduri you were listening.**
    - **Siduri**: I know. You’ve got the face of someone who listens. It’s rarer than you’d think, in my trade.
- **Hold your Nubbin’s paw.**
    - You hold your Nubbin’s paw under the table. Siduri sees, and doesn’t say anything, and refills your cup.

#### <a id="a26-16-siduri-done"></a>Done `a26-16-siduri-done`

_Your Nubbin climbs into your lap and goes to sleep there, warm and heavy. It doesn’t need telling._  
**Gilgamesh** _(angry)_: Where is the boatman? The one who crosses the sea.  
**Siduri**: Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.  

#### <a id="a26-16-siduri-done-moss"></a>Variant `a26-16-siduri-done-moss`

_Variant of `a26-16-siduri-done`._

**Moss**: She’s right, you know. I’d have said it shorter. But she’s right.  
**Siduri** _(think)_: And who’s this, on your shoulder?  
**Moss** _(soft)_: Someone who has outlived a good many friends, and is still having his supper.  
**Siduri** _(soft)_: Then you’ll have a cup with me.  
**Gilgamesh** _(angry)_: Where is the boatman? The one who crosses the sea.  
**Siduri**: Ur-Shanabi. In the woods, by the shore. Be gentle with him. Be gentle with something, for once.  

### Step 2: Find Ur-Shanabi the boatman in the woods.

Hint: Follow Gilgamesh into the woods by the shore. He has gone ahead. · check: `find:a26-urshanabi:shore`

#### <a id="a26-16-stones"></a>Scene `a26-16-stones`

_Gilgamesh runs ahead into the woods. By the time you catch up, there is a crash, and another, and then a silence._  
_In a clearing, among broken pieces of stone, stands a boatman with a pole, staring at the king._  
**Ur-Shanabi** _(shock)_: Those were the Stone Things. They crewed my boat. They could cross the Waters of Death without touching them.  
**Ur-Shanabi**: And you smashed them. Because you were sad, and they were there.  
_Gilgamesh looks at the pieces as if he has just woken up. His hands are grey with stone dust._  
**Gilgamesh** _(sad)_: I didn’t… I didn’t think.  
**Ur-Shanabi** _(soft)_: No. People don’t, when they’re grieving. I’ve ferried enough of them.  

**Choices**

- **Help gather the pieces into a pile.**
    - You gather the pieces, carefully, into a neat pile. Ur-Shanabi watches, and nods, as if that was the right thing to do.
- **Ask Ur-Shanabi if there’s another way.**
    - **Ur-Shanabi**: There is. It’s harder. Everything’s harder now. Can you hold an axe, little one?

### Step 3: Help cut punting poles for the crossing.

Hint: Gather the straight poles Gilgamesh cuts, and stack them by the boat. · check: `collect:a26-poles:forest`

#### <a id="a26-16-poles"></a>Scene `a26-16-poles`

**Ur-Shanabi**: Cut poles. Long ones, straight, and a great many. Each pole may touch the water once, and then you let it go.  
**Ur-Shanabi**: If your hand touches the Waters of Death, you won’t need to find Uta-Napishtim. Understand?  
_So Gilgamesh cuts, and you carry, and Ur-Shanabi trims, until there is a stack of poles taller than the boat._  
_Your Nubbin, in its lion cloak, drags a small branch to the pile as its share. Ur-Shanabi trims that too, gravely._  
_The work seems to do Gilgamesh good. By the end of the day he is sweating, and tired, and less wild in the eyes._  
**Gilgamesh** _(soft)_: Enkidu would have been better at this. He could fell a tree with a look.  

**Choices**

- **Ask him to tell you about Enkidu.**
    - He tells you, while he works: the steppe, the door, the forest. He laughs twice, and it surprises him both times.
- **Just keep carrying.**
    - You keep carrying, and he keeps cutting, side by side, in a rhythm. Some work is a kind of talking.

### Complete

#### <a id="a26-16-complete"></a>Complete `a26-16-complete`

_At dawn you push off. The Waters of Death are black and flat and smell of nothing at all._  
_Gilgamesh punts: each pole touches once, he lets it go, and you hand him the next. One by one, the stack shrinks._  
_When the last pole is gone, he holds his lion skins up for a sail, and the wind takes you the rest of the way._  
**Ur-Shanabi**: There. The far shore. He’s been waiting a long time for someone to come.  

**Rewards**


Sets on completion: `{"a26-16":true}`

**Learning Grove swaps**

- `a26-16-siduri#6` → Gilgamesh, why are you running so far?
- `a26-16-siduri#7` → You won’t find the life you are looking for.
- `a26-16-siduri#9` → Love the little one who holds your hand, and hug the people who love you.

**Notes:** Lifted lines 4 (two verse lines, the bracketed words dropped as the outline says) and 5 at a26-16-siduri#6, #7 and #9 (Thompson, Tablet X). Siduri’s advice is from the Old Babylonian Meissner tablet, as Thompson gives it. MOSS: if he comes, play A26_VARIANTS a26-16-siduri-done-moss in place of a26-16-siduri-done; he agrees with her. CARE: the Stone Things are smashed offscreen (two crashes, then the pieces); Gilgamesh hurts nobody. The number of poles is left vague on purpose (the versions differ). Nobody touches the Waters of Death; no pole sinks on screen.

## A26-17. Uta-Napishtim

*The Epic of Gilgamesh, Standard Babylonian version: Tablets X and XI: Uta-Napishtim and his flood; the test of sleep; the loaves; the plant; the snake* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-16, from Nova’s atlas. · requires: A26-16

**Cast:** Uta-Napishtim (Uta-Napishtim, the man the gods let live for ever (The Epic of Gilgamesh, Standard Babylonian version)), Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Uta-Napishtim’s Wife (Uta-Napishtim’s wife, who bakes the loaves (The Epic of Gilgamesh, Standard Babylonian version)), Ur-Shanabi (Ur-Shanabi, Uta-Napishtim’s boatman (The Epic of Gilgamesh, Standard Babylonian version))

### Step 1: Hear Uta-Napishtim’s story on the far shore.

Hint: Sit by his door with Gilgamesh and listen. · check: `talk:a26-uta:far-shore`

#### <a id="a26-17-tale"></a>Scene `a26-17-tale`

_On the far shore an old man sits on a bench by his door, watching you come. He doesn’t look like a god; he looks like a grandfather._  
**Uta-Napishtim** _(think)_: Who is this, with his cheeks so hollow, in a lion skin, with a child carrying his water?  
**Gilgamesh** _(sad)_: I want what you have. I want not to die. My friend died, and I can’t stop thinking about it.  
**Uta-Napishtim**: Shall we for ever build houses, for ever set signet to contract,  
**Uta-Napishtim** _(soft)_: No. The river rises and goes down. The dragonfly floats on it and sees the sun for a day. Nothing stays.  
**Gilgamesh**: But you stayed. Tell me how.  
**Uta-Napishtim**: Then sit. It’s a long story, and it’s mine.  
_He tells how the god Ea whispered through the reed wall of his house: tear it down, and build a boat._  
_How he took on board his family, and craftsmen, and every kind of animal, and the seed of every living thing._  
_The storm came for six days and seven nights. Then it was still, and there was water everywhere, flat as a roof._  
_He sent out a dove, and it came back; a swallow, and it came back. Then a raven, which didn’t, because it had found land._  
**Uta-Napishtim**: And the gods, who were sorry, made my wife and me like them. That’s all. It happened once. It won’t happen again.  

**Choices**

- **Ask what happened to the animals.**
    - **Uta-Napishtim**: They walked off down the gangplank and never thanked me, not one. I didn’t mind. That’s animals.
- **Ask his wife if she minds living for ever.**
    - **Uta-Napishtim’s Wife**: Some days. The bread’s good, though. And he still tells that story as if I wasn’t there.

#### <a id="a26-17-tale-done"></a>Done `a26-17-tale-done`

**Gilgamesh**: Then the gods could do it again. For me.  
**Uta-Napishtim**: Could they? Let’s see if you can do something smaller first.  

### Step 2: Watch over Gilgamesh while he tries to stay awake.

Hint: Stay by him through the test. Help Uta-Napishtim’s wife with the loaves. · check: `wait:a26-loaves:seven`

#### <a id="a26-17-test"></a>Scene `a26-17-test`

**Uta-Napishtim**: Stay awake for six days and seven nights. If you can’t beat sleep, how will you beat death?  
**Gilgamesh** _(angry)_: Easily. I’ve hardly slept since…  
_He sits down on the sand with his back against the house. And sleep breathes over him like a mist, at once._  
**Uta-Napishtim** _(think)_: Look at him. The strong man who wants to live for ever.  
**Uta-Napishtim’s Wife** _(soft)_: Wake him. Let him go home the way he came.  
**Uta-Napishtim**: He’ll only say he never slept. Bake him a loaf every day, and put it by his head, and mark the wall. Then he’ll know.  
_So every day she bakes a loaf, and every day you set it by his head. Your Nubbin guards them, mostly._  

**Choices**

- **Try to wake him on the first day.**
    - You shake his shoulder, and he snores. You have woken him from bad dreams before, but this is something else.
- **Help her count the loaves.**
    - You count the loaves with her: one, two, three, all in a row. She teaches you how to tell how old bread is by tapping it.
- **Let him sleep. He needs it.**
    - You let him sleep: he hasn’t slept properly since the twelve days. Uta-Napishtim’s wife looks at you, and nods.

#### <a id="a26-17-test-done"></a>Done `a26-17-test-done`

_On the seventh day Uta-Napishtim touches him, and he wakes. The first loaf by his head is dry as a brick._  
**Gilgamesh**: I only just shut my eyes.  
_Then he sees the loaves: hard, leathery, soggy, furry, grey, and one still warm. He puts his face in his hands._  
**Uta-Napishtim**: Ur-Shanabi. Take him to wash. Give him clean clothes. Clothes that will stay clean till he gets home.  

### Step 3: Watch Gilgamesh dive for the plant at the bottom of the sea.

Hint: Stay in the boat with Ur-Shanabi and hold the rope. · check: `watch:a26-plant:sea`

#### <a id="a26-17-plant"></a>Scene `a26-17-plant`

_He is washed, and his hair is clean, and he wears new clothes. He looks like a king again, a tired one._  
**Uta-Napishtim’s Wife** _(soft)_: You can’t send him home with nothing. He walked all that way.  
**Uta-Napishtim**: Gilgamesh. I’ll tell you a secret of the gods. There is a plant, down at the bottom of the sea. It has thorns, like a rose.  
**Uta-Napishtim**: Eat it, and you’re young again.  
_Gilgamesh ties heavy stones to his feet. You hold the rope in the boat, and he drops into the deep, and is gone._  
_You count, and your Nubbin peers over the side at the green water. The rope goes slack, then tight._  
_He comes up gasping, with his hands torn by the thorns, holding a plant with a pale flower like a star._  

**Choices**

- **Haul him into the boat.**
    - You haul with Ur-Shanabi until he flops over the side, laughing, dripping, alive.
- **Look at his hands.**
    - You look at his hands, and Ur-Shanabi wraps them in a strip of your spare cloth. Gilgamesh doesn’t even notice.

#### <a id="a26-17-plant-done"></a>Done `a26-17-plant-done`

**Gilgamesh** _(happy)_: Look at it, Ur-Shanabi. Look!  
**Gilgamesh**: “Greybeard-who-turneth-to-man-in-his-prime” is its name. I’ll take it home and try it on an old man first.  
**Gilgamesh**: And then I’ll eat it, and be young again. And everyone I love can have a leaf.  

### Step 4: Walk home with Gilgamesh and Ur-Shanabi.

Hint: Stop with them at the pool on the road home. · check: `inspect:a26-pool:road-home`

#### <a id="a26-17-snake"></a>Scene `a26-17-snake`

_You walk home, and Gilgamesh carries the plant in both hands, like a lamp._  
_After many leagues you come to a cool pool. Gilgamesh lays the plant on the bank and goes down to bathe._  
_Your Nubbin goes to splash in the shallows. You sit on the bank, between the plant and the road._  
_Something moves in the grass. A snake, long and quiet, slides out, smells the flower, and takes it in its mouth._  
_Before anyone can move, it is gone. On the bank where the plant lay there is only a skin, empty and new-shed._  
**Gilgamesh** _(shock)_: No. No, no.  
_Gilgamesh comes up out of the water, and looks at the skin, and sits down on the bank. And he weeps._  

**Choices**

- **Sit down beside him.**
    - You sit down beside him. He weeps like a child, with his whole body, and you stay.
- **Pick up the snake’s old skin.**
    - You pick up the skin, light as paper. The snake is young again somewhere, which is something.

#### <a id="a26-17-snake-done"></a>Done `a26-17-snake-done`

**Gilgamesh** _(sad)_: For whom did I tear my hands? For whom did I walk all that way? For a snake. I’ve given it to a snake.  
**Ur-Shanabi**: Yes. And now we go home anyway. Come on.  

#### <a id="a26-17-snake-done-hazel"></a>Variant `a26-17-snake-done-hazel`

_Variant of `a26-17-snake-done`._

**Gilgamesh** _(sad)_: For whom did I tear my hands? For whom did I walk all that way? For a snake. I’ve given it to a snake.  
**Ur-Shanabi**: Yes. And now we go home anyway. Come on.  
_At the very edge of the sky, where a page would have its margin, there is writing in pencil, small and slanted. You know the hand._  
_“Lost the plant. Kept the wall.”_  
_“Good trade.”_  
_And under it, one letter: H._  

### Complete

#### <a id="a26-17-complete"></a>Complete `a26-17-complete`

_You walk on, the three of you, with your Nubbin dripping on the pack. It is a quiet walk._  
_In your pocket you find a little reed boat, plaited tight. Uta-Napishtim’s wife must have made it while the loaves baked._  
_It is his boat in little: a reed wall, pulled down and plaited into a way through the flood._  

**Rewards**

- Little reed boat (decor): A small boat of plaited reeds from Uta-Napishtim’s wife. It floats on the Grove pond, and Nubbins like to push it about.

Sets on completion: `{"a26-17":true}`

**Learning Grove swaps**

- `a26-17-tale#3` → Do we build houses that stand for ever? Do we make promises that last for ever?
- `a26-17-plant-done#1` → Its name is “Old Man Grows Young Again”. I’ll take it home and try it on an old man first.

**Notes:** Lifted line 6 at a26-17-tale#3 (Thompson, Tablet X, brackets dropped, words kept: “houses”, “to contract”); lifted line 7, a fragment, at a26-17-plant-done#1 (Tablet XI). The flood is Uta-Napishtim’s own story, told as his, with no comparisons (care note). Mankind “turned to clay” is cut; the water is “flat as a roof”, which is the epic’s. The loaves’ states are the epic’s (dry, leathery, soggy, mouldy here “furry”, grey, fresh, on the coals). s24Done: with it, play A26_VARIANTS a26-17-snake-done-hazel in place of a26-17-snake-done (Hazel’s margin note). The reed boat floats on the Grove pond.

## A26-18. The Wall of Uruk

*The Epic of Gilgamesh, Standard Babylonian version: Tablet XI, the close: Gilgamesh shows Ur-Shanabi the wall of Uruk* · audience: all · where: Nova’s atlas: the Wall of Uruk page (Atlas campaign) · when: Any time after A26-17, from Nova’s atlas. · requires: A26-17

**Cast:** Gilgamesh (Gilgamesh, king of Uruk, two parts god and one part man (The Epic of Gilgamesh, Standard Babylonian version)), Ur-Shanabi (Ur-Shanabi, Uta-Napishtim’s boatman (The Epic of Gilgamesh, Standard Babylonian version)), Old Brickmaker (Our own: a brickmaker of Uruk who walks the wall with you (not in the epic))

### Step 1: Walk the wall of Uruk with Gilgamesh and Ur-Shanabi.

Hint: Climb the wall stair. Mind the third step. · check: `walk:a26-wall:rampart`

#### <a id="a26-18-wall"></a>Scene `a26-18-wall`

_You come home across the plain at evening. The wall of Uruk is gold in the low sun, and the river runs beside it._  
_Gilgamesh stops. He looks at the wall for a long while, as if he had never properly seen it._  
**Ur-Shanabi**: So that’s your city. It’s big.  
**Gilgamesh**: It is. Come up. I’ll show you.  
_You climb the wall stair together. Your Nubbin knows the way, and waits on the third step for you, which wobbles._  
_On top, the wind is warm. The whole city is laid out below, roofs and orchards and smoke from supper fires._  
_Gilgamesh holds out his arm, the way a host shows a guest the best room in the house._  
**Gilgamesh**: Do thou, Ur-Shanabi, go up and walk on the ramparts of Uruk,  
**Gilgamesh**: Look on its base, and take heed of its bricks, if its bricks be not kiln-burnt,  
**Gilgamesh**: A square mile of city, a square mile of orchards, a square mile of clay-pits. And the temple. That’s mine. That’s what I made.  

**Choices**

- **Knock on a brick.**
    - You knock on a brick, and it rings. Gilgamesh hears it, and for the first time in a long time, he smiles.
- **Look at the city with them.**
    - Somebody is calling children in for supper, and somebody is singing. It all goes on, and on.

#### <a id="a26-18-wall-done"></a>Done `a26-18-wall-done`

**Gilgamesh** _(soft)_: I went to the end of the world. And here it is. It was here the whole time.  

### Step 2: Go down to the foot of the wall, where the story started.

Hint: The old brickmaker is waiting by the copper tablet box. · check: `visit:a26-wall:foundation`

#### <a id="a26-18-foot"></a>Scene `a26-18-foot`

_At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date._  
**Old Brickmaker**: There you are. Long story, was it? They always are, his.  
_Below the wall, on the patch of rough grass by the river, a gazelle is grazing. It lifts its head, and looks at you, and doesn’t run._  
_Gilgamesh sees it too. He stands quite still, so as not to frighten it._  
**Gilgamesh** _(soft)_: He asked you to look after them. You did.  
**Old Brickmaker**: Now then. Every brick in this wall has someone’s hand in it. Want yours in?  
_She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw._  
**Old Brickmaker**: Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.  

**Choices**

- **Ask her if the tablet is still in the box.**
    - **Old Brickmaker**: It is. Always will be, if people leave it be. That one, nobody takes.
- **Ask if she’ll put her own mark on it too.**
    - **Old Brickmaker**: Me? No. I’m on all the others.

#### <a id="a26-18-foot-spoke"></a>Variant `a26-18-foot-spoke`

_Variant of `a26-18-foot`._

_At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date._  
**Old Brickmaker**: There you are. Long story, was it? They always are, his.  
_Below the wall, by the river, there is a cedar sapling no higher than your knee. You know whose seed it was._  
_Gilgamesh kneels down beside it. He touches one of its little needles, very carefully, with a hand that tore on thorns._  
**Gilgamesh** _(sad)_: You told me to let him go. I should have listened to you.  
**Old Brickmaker**: Now then. Every brick in this wall has someone’s hand in it. Want yours in?  
_She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw._  
**Old Brickmaker**: Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.  

**Choices**

- **Ask her if the tablet is still in the box.**
    - **Old Brickmaker**: It is. Always will be, if people leave it be. That one, nobody takes.
- **Ask if she’ll put her own mark on it too.**
    - **Old Brickmaker**: Me? No. I’m on all the others.

#### <a id="a26-18-foot-agreed"></a>Variant `a26-18-foot-agreed`

_Variant of `a26-18-foot`._

_At the foot of the wall, by the copper box, the old brickmaker is sitting on her stack of bricks, eating a date._  
**Old Brickmaker**: There you are. Long story, was it? They always are, his.  
_Gilgamesh stops beside you. He looks at you for a long time, without saying anything, the way you look at a well to see how deep it goes._  
**Gilgamesh** _(soft)_: We both learned it late.  
_He doesn’t say what, and he doesn’t need to. Somewhere out on the steppe, the shepherds are lighting their lamps._  
**Old Brickmaker**: Now then. Every brick in this wall has someone’s hand in it. Want yours in?  
_She lays a fresh clay brick in front of you. You press your hand into it, and your Nubbin, after some thought, presses a paw._  
**Old Brickmaker**: Kiln-fired, this one. Sun-dried bricks crumble in the rain. Kiln-fired, they last for thousands of years.  

**Choices**

- **Ask her if the tablet is still in the box.**
    - **Old Brickmaker**: It is. Always will be, if people leave it be. That one, nobody takes.
- **Ask if she’ll put her own mark on it too.**
    - **Old Brickmaker**: Me? No. I’m on all the others.

#### <a id="a26-18-foot-done"></a>Done `a26-18-foot-done`

**Old Brickmaker** _(sad)_: Not every tablet stays put. Plenty were taken from their places, in living memory.  
**Old Brickmaker**: Some have come home since. Every one that comes home is a little bit of a city put back.  
_Gilgamesh gives you a small box made of cedarwood, smelling of the forest. It was cut from the offcuts of the great door._  
**Gilgamesh**: For your own tablets. Put your story in it, whatever it is. And leave it where people can open it.  

### Complete

#### <a id="a26-18-complete"></a>Complete `a26-18-complete`

_Your Nubbin climbs up to your shoulder, and sits there, looking at the wall, the way someone older might._  
**Gilgamesh**: Go home, water-carrier. Walk on your own wall. Look at its bricks.  
_The sun on the bricks gets warmer and yellower, until it is lamplight on a page, and your own table, and the Grove._  
_In your hands there is a brick, still warm from the kiln. Your handprint is in it, and a small round pawprint beside._  

#### <a id="a26-18-complete-moss"></a>Variant `a26-18-complete-moss`

_Variant of `a26-18-complete`._

_Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick._  
**Moss**: He went to the end of the world so as not to die, and came home and pointed at a wall.  
**Moss** _(soft)_: That’s the right answer. He just took the long way.  
**Gilgamesh**: Go home, water-carrier. Walk on your own wall. Look at its bricks.  
_The sun on the bricks gets warmer and yellower, until it is lamplight on a page, and your own table, and the Grove._  
_In your hands there is a brick, still warm from the kiln. Your handprint is in it, and a small round pawprint beside._  

#### <a id="a26-18-complete-moss-spoke"></a>Variant `a26-18-complete-moss-spoke`

_Variant of `a26-18-complete-moss`._

_Moss has been quiet all the way home. Now he sits up on your shoulder and looks at the wall, brick by brick._  
**Moss**: He went to the end of the world so as not to die, and came home and pointed at a wall.  
**Moss** _(soft)_: That’s the right answer. He just took the long way.  
_He looks down at the cedar sapling by the river for a while._  
**Moss** _(soft)_: And somebody let a tree live. That’s the other answer.  
**Gilgamesh**: Go home, water-carrier. Walk on your own wall. Look at its bricks.  
_The sun on the bricks gets warmer and yellower, until it is lamplight on a page, and your own table, and the Grove._  
_In your hands there is a brick, still warm from the kiln. Your handprint is in it, and a small round pawprint beside._  

**Rewards**

- The handprint brick (decor): A kiln-fired brick with your handprint and your Nubbin’s pawprint, laid in the Grove by Moss’s flat stone (by his flower, if he has faded).
- Cedar tablet box (decor): A little box of cedar from the offcuts of the temple door, for the cottage shelf. It smells of the forest when you open it.

Sets on completion: `{"a26-18":true,"a26-done":true}`

**Learning Grove swaps**

- `a26-18-wall#7` → Ur-Shanabi, go up and walk along the top of Uruk’s wall.
- `a26-18-wall#8` → Look at how it stands, and at its bricks. See how they were baked hard in the fire.

**Notes:** Lifted line 8 (two verse lines, Thompson Tablet XI, “Erech” as Uruk) at a26-18-wall#7 and #8; line #9 finishes the passage in our own words. HUMBABA PAYOFF (a26-humbaba): a26-18-foot as written is the silent path (a gazelle grazes below the wall). For spoke, play A26_VARIANTS a26-18-foot-spoke (a cedar sapling); for agreed, a26-18-foot-agreed (Gilgamesh’s long look). The wall is the same on every path. MOSS: if he comes, play a26-18-complete-moss, or a26-18-complete-moss-spoke on the spoke path, in place of a26-18-complete. CARE: the brickmaker’s line on taken and returned tablets is the outline’s heritage note, said plainly, without naming any war. GROVE KEEPSAKE: on the first return to the Grove after A26-18, play A26_VARIANTS a26-grove-brick, or a26-grove-brick-flower if Moss has faded or the ending is moss-sleeps.

## Variant scenes

Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).

#### <a id="a26-grove-brick"></a>Variant `a26-grove-brick`

_You carry the brick up the hill to the flat stone where Moss always sits, and lay it in the grass beside it._  
_Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings._  
_You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off._  

#### <a id="a26-grove-brick-flower"></a>Variant `a26-grove-brick-flower`

_Variant of `a26-grove-brick`._

_You carry the brick up the hill to Moss’s flower by the flat stone, and lay it in the grass beside it._  
_Your handprint and the pawprint face the sky. Your Nubbin knocks on the brick with one paw, and listens: it rings._  
_You sit for a while by the flower and the brick. It seems the right thing to do here._  
_You put the cedar box on the cottage shelf. When you open it, the room smells of a forest a very long way off._  
