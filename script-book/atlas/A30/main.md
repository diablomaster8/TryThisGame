# Atlas, page A30: The Word on the Brow

## A30-1. The Jewish Town

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the Jewish Town of Prague* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Dvora (The caretaker’s wife (our invention)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention)), Hannah (The baker in the lane (our invention))

### Step 1: Step into the brown-ink page and find the caretaker’s house.

Hint: Touch the page, then follow the lane to the door with the ring of keys. · check: `explore:a30-lanes:gate`

#### <a id="a30-01-page"></a>Scene `a30-01-page`

_Nova’s atlas falls open at a page drawn in brown ink: a steep-roofed synagogue, a lane of small houses, a river._  
_Across the top of the page, in plain letters: the Golem of Prague, a Jewish legend from the Czech lands._  
_Rabbi Judah Loew was real, a great scholar and teacher in Prague four hundred years ago._  
_The golem story was told about him long after he died. It is a legend, and people have told it many ways._  
_This page follows the legend as an encyclopedia printed in New York in 1904 sets it down, and the tellings after it._  
_The paper goes cool and gritty under your hand, like a doorstep. Then it is a doorstep, and you are sitting on it._  
_A narrow lane, wet cobbles, the smell of bread. A man with a ring of keys at his belt looks down at you both._  
**Avram**: You’ll be the lodger. Good. I’m Avram. I look after the synagogue, which mostly means I look after its keys.  
**Avram**: My wife has made up the bed in the loft. It’s small. So, forgive me, is the small one.  
_Your Nubbin holds up both arms, to show that it will fit anywhere at all._  

**Choices**

- **Shake his hand.**
    - **Avram**: A good grip. You’ll carry water.
    - He says it as if it were the highest praise he knows.
- **Ask which key is which.**
    - **Avram**: This one is the big door. This one is the cupboard. This one, I have no idea. I’ve had it twenty years.
    - **Avram**: One day a door will turn up for it, and I’ll be ready.
- **Take the basket he’s carrying.**
    - He lets you take it, and looks at you sideways, the way people do when they’ve been helped before they asked.

#### <a id="a30-01-page-done"></a>Done `a30-01-page-done`

**Dvora**: Avram, bring them in, you’re letting the warm out. Water first, lodger. Then you can be a guest.  
**Rivka**: I’ll show them the well! I know the well better than anyone.  

### Step 2: Carry water from the well, and learn where things are.

Hint: Rivka knows the way. The well is where three lanes meet. · check: `carry:a30-water:well`

#### <a id="a30-01-water"></a>Scene `a30-01-water`

_Rivka is about nine, and walks backwards the whole way so she can talk to you._  
**Rivka**: That’s the study house. That’s the bathhouse. That’s Hannah’s bakery. Don’t look at it, you’ll want everything.  
_Your Nubbin looks at it._  
**Rivka**: The big synagogue is the old one with the steep roof. Papa has a key to every door except the attic.  
**Rivka**: Nobody goes in the attic. It’s where the worn-out books go. You don’t throw away a holy book; you put it to rest.  
_At the well two women are talking low, the way people talk about weather that hasn’t arrived yet._  
_They talk about the great rabbi, who teaches in the study house. Then, more quietly, about the talk outside the walls._  
**Rivka**: Mama says not to listen at wells. Mama listens at wells all the time.  
_You carry two buckets home. Your Nubbin carries a cup, spills about half of it, and is very proud of the half._  

#### <a id="a30-01-water-done"></a>Done `a30-01-water-done`

**Dvora**: Good. Now you’re a guest. Rivka, take them to Hannah’s before she shuts, and don’t eat the change.  

### Step 3: Fetch the bread from Hannah’s bakery.

Hint: The bakery is the door with the warm step. Your Nubbin has already found it. · check: `visit:a30-bakery:lane`

#### <a id="a30-01-bakery"></a>Scene `a30-01-bakery`

_Your Nubbin is already sitting on the bakery step, which is warm from the oven inside, with its eyes shut._  
**Hannah**: Is this yours? It’s been there since you came round the corner. It hasn’t moved.  
_Hannah is flour to the elbows. Behind her, plaited loaves stand in rows, shining, waiting for Friday._  
**Hannah** _(happy)_: Those are for the Sabbath. Nobody touches those. This, on the other hand, is a crust I burnt.  
_She holds it out. Your Nubbin takes it in both paws as if it were a medal._  
**Rivka**: She burns one every day. On purpose. Everyone knows.  
**Hannah**: Rivka, if you tell everyone, I’ll have to stop.  
_You carry the bread home. Your Nubbin carries the crust, and does not spill any of it._  

### Complete

#### <a id="a30-01-complete"></a>Complete `a30-01-complete`

_The loft is small and smells of apples. Through its little window you can see across the lane to the study house._  
_There is still a lamp burning there, late, in one window. Someone is reading._  
**Rivka**: That’s the rabbi. He reads all night sometimes. Papa says it’s because he’s wise. Mama says it’s because he forgets.  
_Your Nubbin falls asleep with flour on its nose and the last of the crust under its arm._  

#### <a id="a30-01-ember"></a>Variant `a30-01-ember`

_Variant within A30-1; it has no single parent scene._

_Your Nubbin is carrying its little lantern, with the red pebble glowing in it. Dvora bends to look._  
**Dvora**: A coal that needs no fire. Well. Don’t put it near my curtains, whatever it is.  
_Your Nubbin holds the lantern a little closer to itself, the way you hold something lent._  

**Rewards**


Sets on completion: `{"a30-01":true}`

**Notes:** OPENING: a30-01-page#1–4 are the page’s INTRO CARD, required by the care notes: show them as a plain card over the brown-ink page before the step-through (#5 onwards is the step-through itself). The card names it a legend, says Rabbi Loew was real and the golem was attached to him later, and names the 1904 encyclopedia the page follows. ART: the Jewish Town of the late 1500s, from period views (advisers and ideally the Jewish Museum in Prague to check): narrow lanes, small houses, the Old-New Synagogue’s steep brick gable. No caricature of any kind; ordinary people in ordinary clothes. The plaited loaves are challah. CINDER (cinder set, S19): play ATLAS_A30_VARIANTS a30-01-ember after a30-01-page’s choice, before a30-01-page-done. From then on your Nubbin carries a little lantern with the red pebble in it on this page (Atlas save, a prop).

## A30-2. The Rabbi

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): Rabbi Loew in the study house; the Talmud, Sanhedrin 65b; Psalm 139* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-1, from Nova’s atlas. · requires: A30-1

**Cast:** Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), A Student (A student in the study house (our invention)), Another Student (A student in the study house (our invention))

### Step 1: Go to the study house with Avram and sit at the back.

Hint: The bench by the door. Sit still, and listen. · check: `sit:a30-study-house:back-bench`

#### <a id="a30-02-study"></a>Scene `a30-02-study`

_The study house is one long room full of books and noise. Students sit in pairs, arguing over a page, both talking at once._  
**Avram**: It’s meant to be loud. A quiet study house is one where nobody’s thinking.  
**Avram**: Sit at the back. If anyone asks, you’re with me. If anyone asks me, I’ll say you’re with the rabbi.  
_At the front sits an old man with a plain grey beard and ink on his fingers. The room goes quiet for him without being asked._  
_He doesn’t look like a wonder-worker. He looks like someone’s grandfather who has read everything twice._  
**Avram**: Rabbi Judah Loew. People call him the Maharal: the first letters of “our teacher, the rabbi Loew”.  
**Rabbi Loew**: I’m going to tell you a story from the Talmud. Don’t write it down. Listen to it.  
**Rabbi Loew**: Rava made a man, and sent him to Rabbi Zeira. Rabbi Zeira spoke to him, and the man did not answer.  
**Rabbi Loew**: So Rabbi Zeira said to him: then go back to your dust.  
_Your Nubbin, on the bench beside you, has gone very still._  

#### <a id="a30-02-study-done"></a>Done `a30-02-study-done`

_The rabbi lets the story sit in the room a while, the way you let bread rest before you cut it._  

### Step 2: Answer the rabbi’s question, if you can.

Hint: He is looking at the back bench. There is no wrong answer. · check: `talk:a30-loew:study-house`

#### <a id="a30-02-question"></a>Scene `a30-02-question`

**Rabbi Loew**: Now. What is a person, if not that? Someone tell me.  
**A Student**: Someone who answers, Rabbi.  
**Another Student** _(think)_: Someone who can be spoken to. Which is not quite the same.  
**Rabbi Loew**: “Thine eyes did see mine unformed substance…” That is a psalm.  
**Rabbi Loew**: In the Hebrew it is one word: golmi. My unshaped clay. It is the only place the word golem is in the whole Bible.  
**Rabbi Loew** _(think)_: So every one of us was clay once, and somebody saw it. What makes the difference?  
_He is looking past the students, at the back bench. At you._  

**Choices**

- **“Someone who can answer.”**
    - **Rabbi Loew**: The same as the student said, but braver, from the back of the room. Good.
- **“Someone who can ask.”**
    - **Rabbi Loew**: Then this is a room full of people, and I have been worrying for nothing.
- **Look at your Nubbin, who can’t say a word.**
    - **Rabbi Loew**: Yes. It doesn’t speak. And it answered me just now: it looked up when I said clay.
    - **Rabbi Loew**: Answering is more than words. Remember that. I may need reminding.

### Complete

#### <a id="a30-02-complete"></a>Complete `a30-02-complete`

_Afterwards, at the door, the rabbi stops beside your Nubbin and looks down at it for a long moment._  
**Rabbi Loew**: I have never seen one of these. Does it do as it’s told?  
**Avram**: Never, Rabbi. Not once. It’s a great comfort to the household.  
**Rabbi Loew** _(happy)_: Good. I’d worry about it otherwise.  
_He goes out into the lane with a book under each arm, and leaves his coat behind on the peg._  

**Rewards**


Sets on completion: `{"a30-02":true}`

**Learning Grove swaps**

- `a30-02-question#3` → There is a song in the Bible that says: before I was even made, you saw me.

**Notes:** THE TALMUD STORY (a30-02-study#7–8) is Sanhedrin 65b, retold in our own words; advisers to check the wording. No modern translation is quoted. LIFTED TEXT: a30-02-question#3 (Psalm 139:16, JPS 1917, a fragment) in the rabbi’s mouth, with “That is a psalm.” in our words after it. ART: the rabbi is an old scholar, warm and plain; no glow, no staff, no wizard robes. The study house is noisy on purpose (paired study).

## A30-3. Fear

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the danger outside the walls* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-2, from Nova’s atlas. · requires: A30-2

**Cast:** Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Dvora (The caretaker’s wife (our invention)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention)), Shmuel (The caretaker’s small son (our invention)), Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design)

### Step 1: Find out why Avram has come home early.

Hint: He is in the courtyard, sitting on the woodpile, which he never does. · check: `talk:a30-avram:courtyard`

#### <a id="a30-03-rumour"></a>Scene `a30-03-rumour`

_Avram comes home at noon, which he never does, and sits on the woodpile, which he never does either._  
**Avram**: There’s a story going round outside the walls. About us. It isn’t true.  
**Avram** _(sad)_: I won’t tell you what it is. Saying it again is how it travels.  
**Dvora**: It’s been told before. It’s always been a lie. It always finds people who want it.  
_Dvora puts her hand on his shoulder, and leaves it there._  
**Avram**: There were men at the gate last night, talking. Only talking. Tonight there may be more of them.  
**Rivka**: Will they come in?  
**Dvora**: The gates are shut at night. And there are a great many of us, and we’re all very good at shouting.  

#### <a id="a30-03-rumour-done"></a>Done `a30-03-rumour-done`

**Avram**: Bar the shutters at dusk. That’s all. Then we sleep, if we can.  

### Step 2: Get through the night.

Hint: Choose where to be. Nothing will happen to you; it is only a long night. · check: `wait:a30-window:night`

#### <a id="a30-03-night"></a>Scene `a30-03-night`

_After dark there is lantern light at the far end of the street, beyond the gate. Voices, low, and then louder._  
_You can’t hear the words. You don’t want to._  
_The house goes very quiet. Shmuel gets into his sister’s bed without asking, and she lets him._  
_Across the lane, in the rabbi’s window, the lamp is lit. It stays lit._  
**Shmuel**: Is the rabbi scared?  
**Rivka**: The rabbi is thinking. It looks the same from outside.  

**Choices**

- **Sit on the floor by the children’s bed.**
    - You sit on the floor with your back to the bed. After a while a small hand comes down and holds your collar.
    - Your Nubbin climbs up between them, and Shmuel goes to sleep with his face in its fur.
- **Keep watch at the shutter with Avram.**
    - **Avram**: There’s nothing to see. I know. I look anyway.
    - You look anyway, together, through the crack in the shutter, until the lights at the gate go out one by one.
- **Watch the rabbi’s window.**
    - Once, very late, a shadow crosses the rabbi’s lamp, back and forth, back and forth. Somebody walking, and not sleeping.

### Complete

#### <a id="a30-03-complete"></a>Complete `a30-03-complete`

_In the morning the men are gone; nothing happened, this time. Hannah’s oven is lit, and the lane smells of bread._  
_The rabbi passes on his way to the study house, and nods to Avram. He looks as if he has not slept at all._  
**Rabbi Loew** _(think)_: Good morning. It is a good morning. They all are, until they aren’t.  
**Dvora**: He didn’t sleep. You can always tell. He gets philosophical before breakfast.  

**Rewards**


Sets on completion: `{"a30-03":true}`

**Notes:** CARE: the lie is never named or hinted at (no blood libel). The men are lantern light and voices beyond the gate: never seen close, never given faces, never shown as a mob of Christian villains. Nothing happens. Keep the scene short; the fear is in the household’s small actions. The choice sets no flag.

## A30-4. The Answer

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the rabbi’s question, and the dream* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-3, from Nova’s atlas. · requires: A30-3

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Isaac (The rabbi’s son-in-law, one of his two helpers in later tellings of the legend), Jacob (The rabbi’s pupil, his other helper in later tellings of the legend), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention))

### Step 1: Take the rabbi his supper in the study house.

Hint: Dvora has wrapped it in a cloth. He will forget to eat it. · check: `deliver:a30-supper:study-house`

#### <a id="a30-04-ask"></a>Scene `a30-04-ask`

_Dvora sends you across the lane with bread and a bowl of soup under a cloth. The study house is empty but for him._  
_He is not reading. He is sitting with his hand over his eyes, very still._  
**Rabbi Loew**: Put it there, thank you. I’ll eat it. I may even eat it tonight.  
**Rabbi Loew** _(think)_: Do you know what I asked for, when I prayed this evening? How to keep them safe. Only that.  
**Rabbi Loew**: It’s a very old question. Usually the answer is: be patient, be careful, be kind to your neighbours, and wait.  
**Rabbi Loew** _(sad)_: I have been all four. I’d like a fifth.  
_Your Nubbin climbs up on the bench and pushes the soup an inch closer to him, as a suggestion._  

#### <a id="a30-04-ask-done"></a>Done `a30-04-ask-done`

_When you go back for the bowl in the morning, it is empty. He is asleep at the table with his cheek on a book._  

### Step 2: Listen to what the rabbi asks of you.

Hint: He is at the study house door with two men. · check: `talk:a30-isaac:door`

#### <a id="a30-04-helpers"></a>Scene `a30-04-helpers`

_By noon he is awake, and changed. Something has settled in his face, the way dust settles in a still room._  
**Rabbi Loew**: A question I asked in the night was answered in a dream. That is all I’ll say about it.  
_Two men stand with him: Isaac, his son-in-law, broad and quiet, and Jacob, his pupil, thin and quick._  
**Rabbi Loew**: Isaac, Jacob: be ready tonight, after midnight. Wear old clothes. Bring nothing.  
**Isaac**: Nothing, Rabbi?  
**Rabbi Loew**: Nothing. Our hands will do.  
_Then he turns to you, and you think he’s going to tell you something. He doesn’t._  
**Rabbi Loew** _(soft)_: Keep a lantern lit in Avram’s window until we come back. And don’t follow us.  
**Rabbi Loew**: Not because you aren’t trusted. Because some things are better done without anyone watching.  

**Choices**

- **“I’ll keep it lit.”**
    - **Rabbi Loew**: Thank you. It helps, coming home, to see a light someone kept.
- **Ask where they’re going.**
    - **Jacob**: To the river.
    - Isaac looks at him. Jacob looks at his shoes.
    - **Rabbi Loew**: Well. To the river. You may as well know that much. It’s not a secret where rivers are.
- **Just nod.**
    - The rabbi nods back, once, as if you have agreed to something larger than a lantern.

### Step 3: Light the lantern in Avram’s window.

Hint: The lantern hangs by the door. The window is in the loft. · check: `carry:a30-lantern:window`

#### <a id="a30-04-lantern"></a>Scene `a30-04-lantern`

_You carry the lantern up to the loft window and light it. The flame stands up straight in the still air._  
**Rivka**: Why is it lit? Who’s it for?  
_You tell her it’s for the rabbi. She takes this very seriously._  
**Rivka**: Then I’ll mind it too. I’m good at minding things. I minded Shmuel for a whole year and he’s still alive.  
_She sits cross-legged beside the lantern, with her chin in her hands._  
_Your Nubbin sits beside her, and copies her exactly._  

### Complete

#### <a id="a30-04-complete"></a>Complete `a30-04-complete`

_At midnight the study house door opens and shuts softly. Three shapes go down the lane towards the river._  
_Rivka is still awake, and looks at you, and looks at the lantern._  
**Rivka**: Go on, then. I’ll mind it. You’re not very good at not following, are you?  

**Rewards**


Sets on completion: `{"a30-04":true}`

**Notes:** CARE: no ritual is shown and nothing is said of how the dream came or what it said. The rabbi prays “the way the town prays”: off screen, in the past tense. The fifth thing he asks for is the hook; the game never names it.

## A30-5. Clay from the River

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the making, by the Vltava at night* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-4, from Nova’s atlas. · requires: A30-4

**Cast:** Isaac (The rabbi’s son-in-law, one of his two helpers in later tellings of the legend), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention))

### Step 1: Follow the three of them to the river, at a distance.

Hint: Keep well back. Stop at the willows above the bank. · check: `walk:a30-river:willows`

#### <a id="a30-05-follow"></a>Scene `a30-05-follow`

_You follow at a distance, through the sleeping lanes, out by the little water gate to the river._  
_The Vltava is wide and black and talking to itself. The town is behind you, with one lit window in it._  
_You stop in the willows above the bank. Your Nubbin stops too, and holds on to your trouser leg._  
_Below you, on the mud, three men are kneeling. They have their sleeves rolled up._  
_They are digging clay out of the bank with their hands, and laying it out on the ground._  
_You can see their mouths move. You can’t hear a word over the river, and you don’t try to._  

**Choices**

- **Go a little closer.**
    - You go one tree closer, and stop. It feels like walking into a room where someone is praying.
- **Stay where you are.**
    - You stay in the willows. Your Nubbin looks up at you, then back down at the bank, thinking.

### Step 2: Let your Nubbin help, if they’ll have it.

Hint: Your Nubbin has made up its own mind. Stay on the bank. · check: `carry:a30-river-water:clay`

#### <a id="a30-05-clay"></a>Scene `a30-05-clay`

_The clay on the ground is taking a shape: a head, shoulders, two long arms. It is as long as a door._  
_The rabbi bends over the head. The other two work at the arms and legs, smoothing, as if they were making bread._  
_The clay is drying in the wind off the water. Isaac keeps going down to the river with cupped hands, and it’s slow._  
_Your Nubbin lets go of your trouser leg. Before you can stop it, it is down the bank._  
_It goes to the water’s edge, fills its cheeks, and trots back up to the clay. Then it wets the clay, very carefully._  
_Isaac looks at it, then up at the willows, straight at you. Then he moves over, and makes room._  
_Your Nubbin goes back to the river, and again, and again. You stay where you are, and the night goes on._  

#### <a id="a30-05-clay-done"></a>Done `a30-05-clay-done`

_Near dawn Isaac carries your Nubbin back up the bank himself, and sets it down at your feet, muddy to the ears._  
**Isaac** _(soft)_: Go home. He knows you’re here. He knew before I did.  

### Complete

#### <a id="a30-05-complete"></a>Complete `a30-05-complete`

_You go home ahead of them. The lantern is still burning in the loft window._  
_Rivka is asleep beside it, sitting up, with one hand still held out towards it, minding._  
_You put a blanket over her. Your Nubbin falls asleep on the end of it, still smelling of river._  

**Rewards**


Sets on completion: `{"a30-05":true}`

**Notes:** CARE: the making is seen from far off (the willows above the bank) and heard as nothing but the river. No words, no letters, no gestures that read as a rite; the men shape clay the way you knead bread. The player stays on the bank: only the Nubbin goes down, with water. ART: the Vltava at night, the town behind with one lit window.

## A30-6. The Word

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): emet on the brow (older tellings and many modern ones); the Shem in the mouth (Prague tellings)* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-5, from Nova’s atlas. · requires: A30-5

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Isaac (The rabbi’s son-in-law, one of his two helpers in later tellings of the legend), Jacob (The rabbi’s pupil, his other helper in later tellings of the legend)

### Step 1: Go back down to the river when the rabbi sends for you.

Hint: Jacob is at the door. Go with him. · check: `talk:a30-loew:riverbank`

#### <a id="a30-06-tellings"></a>Scene `a30-06-tellings`

_Before sunrise Jacob knocks at the door. The rabbi wants you at the river, and your Nubbin, he says, especially._  
**Rabbi Loew**: You followed. I thought you would. Come and see, then, and don’t say anything for a little while.  
_The clay man lies on the bank under the grey sky. He is plain and smooth and as long as a door._  
_“The Shem was written on a piece of paper and inserted either in the mouth or in the forehead of the golem.”_  
**Rabbi Loew** _(think)_: Some say the word goes in the mouth, some say on the brow. The tellings don’t agree. They rarely do.  
**Rabbi Loew**: In some it is a holy Name, written on a slip of paper. We will leave that where it belongs.  
**Rabbi Loew**: Here it will be a plain word on the brow, one that anyone may read. Three letters. Watch which ones.  

**Choices**

- **“Why truth?”**
    - **Rabbi Loew**: Because a guard should stand on something true. And because anyone in the lane can read it, even Shmuel.
- **Say nothing, as he asked.**
    - **Rabbi Loew**: Good. You were listening. That is most of it.

### Step 2: Watch the rabbi write the three letters.

Hint: Stand where he puts you. Your Nubbin will want to be nearer. · check: `watch:a30-clay:brow`

#### <a id="a30-06-letters"></a>Scene `a30-06-letters`

**Rabbi Loew**: Hebrew is read from the right. So the first letter goes on the right.  
**Rabbi Loew**: Alef, א. It makes no sound of its own. It only holds a vowel, the way a cup holds water.  
_He draws it on the clay brow with one finger. The clay is cold and takes the line cleanly._  
**Rabbi Loew**: Mem, מ, from the middle of the alef-bet. And tav, ת, the very last letter of all.  
_Three letters in a row, right to left: אמת._  
**Rabbi Loew**: Emet. Truth. The first letter, the middle and the last. The old teachers liked that: truth stands on all of it.  
_For a moment nothing happens. Then the clay under your feet feels warm, like a step in the sun._  
_The clay man opens his eyes. He sits up, slowly, looks at the rabbi, and waits to be told what to do._  
**Isaac** _(shock)_: He’s waiting.  
**Rabbi Loew** _(soft)_: So he is. Well. Get up, then, my friend. We’ll walk home.  

#### <a id="a30-06-letters-done"></a>Done `a30-06-letters-done`

_He gets up, a head taller than Isaac. He stands with his hands open at his sides, and doesn’t speak._  
**Jacob**: What do we call him?  
**Rabbi Loew**: Josef. A good plain name.  

### Complete

#### <a id="a30-06-complete"></a>Complete `a30-06-complete`

_You walk back to the town in the first light: the rabbi, his two helpers, a tall clay man, you._  
_Your Nubbin walks a step behind the clay man, exactly a step, the way a duckling walks behind something large._  
_By breakfast the children of the lane have met him. By noon nobody calls him Josef: he is Yossele._  
**Rabbi Loew** _(happy)_: There. He has a name the children gave him. That is worth more than mine.  

**Rewards**


Sets on completion: `{"a30-06":true}`

**Learning Grove swaps**

- `a30-06-tellings#3` → Some people tell this story one way, and some tell it another. Stories grow when they are told many times.

**Notes:** LIFTED TEXT: a30-06-tellings#3 (Jewish Encyclopedia 1904, “Golem”), voiced as narration for the older tellings. #4–5 are the outline’s adapted line and the turn away from the Name, in the rabbi’s own words. CARE: the Name is never written, spoken, shown or hinted at; no slip of paper appears on screen. Emet on the brow is the older and modern telling; we use it with the advisers’ agreement and say so here. HEBREW: the letters are drawn exactly as in Ori’s alef-bet (LH2), written right to left, alef first. The rabbi’s explanation is the main-game version of what Ori teaches in the Learning Grove. The finger-drawing is shown once, plainly; no glow, no sound effect beyond the river. Show the three letters large on screen as he names them (art, not text-only). The first-middle-last point is a traditional teaching (advisers to confirm the attribution if one is shown).

## A30-7. Yossele’s Work

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the golem as servant* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-6, from Nova’s atlas. · requires: A30-6

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Dvora (The caretaker’s wife (our invention)), Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention))

### Step 1: Watch Yossele at his work.

Hint: He is in the courtyard. Your Nubbin is already a step behind him. · check: `watch:a30-yossele:chores`

#### <a id="a30-07-chores"></a>Scene `a30-07-chores`

_Yossele lives in the rabbi’s house now, and works wherever he is sent. He fetches water, chops wood and sweeps._  
_He never speaks, and never tires. He never does one thing more than he is told._  
**Avram** _(happy)_: Told to sweep the step, he sweeps the step. Not the step next to it. I find it very restful.  
_Everywhere he goes, your Nubbin goes too, a step behind. When he stops, it stops; when he turns, it turns._  
_He has never once looked down at it. But he has never once stepped on it either._  
**Rivka**: He’s like a big quiet uncle. Without the opinions.  

### Step 2: Stop the kitchen flooding.

Hint: Bail, mop, and fetch the rabbi. Yossele will not stop on his own. · check: `carry:a30-buckets:kitchen`

#### <a id="a30-07-flood"></a>Scene `a30-07-flood`

**Dvora**: Yossele, fill the barrel for me, there’s a dear. I’ll be back before you know it.  
_He fills the barrel. Then he fills it again, because nobody has told him to stop._  
_Water runs over the rim, across the kitchen, under the door, and out into the lane in a bright sheet._  
_Yossele goes on fetching, steady as a mill wheel, through his own flood._  
_You bail with a pan. Your Nubbin bails with its cheeks, which is no help at all, and very sincere._  
**Dvora** _(shock)_: Oh, no. No, no, no. Yossele! That’s enough! Enough!  
_He doesn’t stop. She isn’t the one who made him._  
_Then the rabbi is at the door with his sleeves wet to the elbow, and says one word. Yossele sets the bucket down._  

#### <a id="a30-07-flood-done"></a>Done `a30-07-flood-done`

**Dvora** _(sad)_: My kitchen. My good floor. My onions are floating.  
_She looks at you, soaked to the knees, and hands you an apron. Too late, but kindly meant._  
**Dvora**: Keep it. You’ve earned it. You’ll need it again, in this house.  

### Step 3: Give Yossele his standing order.

Hint: The rabbi asks you. Choose what Yossele does when no one has told him anything. · check: `choose:a30-order:study-house`

#### <a id="a30-07-order"></a>Scene `a30-07-order`

_That evening the rabbi sits on the study house step with you, and watches Yossele sweeping the lane in the dusk._  
**Rabbi Loew**: He does what he’s told, and only that. So when nobody tells him anything, he stands and waits. For hours.  
**Rabbi Loew** _(think)_: A thing that only waits is a sad thing to have made. He should have something of his own to do.  
**Rabbi Loew**: One standing order. For when no one else has told him anything. You choose it.  
**Rabbi Loew** _(happy)_: You came to the river when you were told not to. I think that makes you the right person to ask.  
_Yossele has stopped sweeping, and your Nubbin, a step behind him, has stopped too. They are both waiting._  

**Choices**

- **“Keep everyone safe.”** — sets `{"a30-order":"safe"}`
    - **Rabbi Loew**: Keep everyone safe. That’s what I made him for. Well, then.
    - The rabbi says it to Yossele, quietly. Yossele turns and looks down the lane, at every door in it, one by one.
- **“Help where you’re asked.”** — sets `{"a30-order":"help"}`
    - **Rabbi Loew**: Help where you’re asked. Modest. Dvora will be glad.
    - The rabbi tells him. Yossele picks the broom up again, and holds it, ready, looking from door to door.
- **“Sit with the little ones.”** — sets `{"a30-order":"sit"}`
    - **Rabbi Loew**: The little ones. You mean the children, and this one. Hm.
    - The rabbi tells him, and Yossele looks down, for the first time, at your Nubbin. Then he sits on the step beside it.

### Complete

#### <a id="a30-07-complete"></a>Complete `a30-07-complete`

_Dvora hangs the onions up to dry from the kitchen beam, all in a row, as if that had been the plan all along._  
**Avram**: He fills barrels very well. Nobody can say he doesn’t fill barrels.  
_You go up to the loft in your new apron, still damp at the hem. Your Nubbin is asleep before you are._  

**Rewards**

- Caretaker’s Apron (cosmetic): A plain linen apron from Dvora’s kitchen, a little water-marked at the hem. Given after the flood, too late, but kindly meant.

Sets on completion: `{"a30-07":true}`

**Notes:** SIGNATURE CHOICE (a30-07-order): a30-order = safe | help | sit, Yossele’s standing order. It pays off in A30-9 (a30-09-order-*), A30-10 (a30-10-grow-*) and A30-13 (a30-13-order-*, the tile and the last image). The rabbi’s word that stops Yossele in a30-07-flood#7 is never given: show only his mouth moving and the bucket going down. COMEDY: the flood is the page’s one big laugh; keep it bright and quick. Nobody is hurt; onions float. REWARD: the apron, one-time, at a30-07-flood-done.

## A30-8. The Night Guard

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the golem guards the Jewish Town* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-7, from Nova’s atlas. · requires: A30-7

**Cast:** Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design)

### Step 1: Walk the night round with Yossele.

Hint: Every lane, every gate, once. Your Nubbin will try to keep up. · check: `walk:a30-night-round:lanes`

#### <a id="a30-08-round"></a>Scene `a30-08-round`

_At night Yossele walks the lanes of the Jewish Town, end to end, gate to gate. Tonight you walk with him._  
_He goes slowly, and never stops. The houses are dark, and the cobbles are wet, and your footsteps are the only ones._  
_At every gate he puts his hand flat on the wood for a moment, as if to feel whether it is cold._  
_Your Nubbin keeps up for three lanes. On the fourth it sits down in the road, and holds up both arms._  
_Yossele stops. Nobody has told him what to do about this._  
_You lift your Nubbin up and set it on his shoulder, and he walks on. It holds on to his ear, and is asleep in a minute._  

### Step 2: Stand with Yossele at the end of the street.

Hint: He knows where to stand. Stand behind him. · check: `watch:a30-yossele:street-end`

#### <a id="a30-08-street-end"></a>Scene `a30-08-street-end`

_At the street’s end there is lantern light again, beyond the gate. Voices, more than last time._  
_Yossele walks to the middle of the street and stands there, in the light, as tall as a door. He does nothing at all._  
_Your Nubbin is still asleep on his shoulder, with one ear in its mouth._  
_The voices stop. For a long moment nobody on the far side moves._  
_Then the lanterns turn, one by one, and go away up the hill, the way lanterns go when people decide they are tired._  
_Yossele stands there till the last one is gone. Then he turns, and goes on with the round._  

**Choices**

- **Stand close behind him.**
    - You stand at his back, close enough to touch. He is warm, like a wall at the end of a sunny day.
- **Hold your Nubbin’s dangling foot.**
    - You reach up and hold your Nubbin’s foot. It curls its toes round your finger in its sleep.

### Complete

#### <a id="a30-08-complete"></a>Complete `a30-08-complete`

_Word goes round the lanes by breakfast. Nobody says much about it, but everybody says they slept well._  
**Avram** _(happy)_: I slept like a stone. First time in a month. I dreamt about keys.  
**Rabbi Loew** _(soft)_: He didn’t have to do anything. That’s the best kind of guard there is.  
_Avram gives you a small lantern with a horn window, for walking the round. Your Nubbin takes it and won’t give it back._  

**Rewards**

- Night-Round Lantern (feature): A small horn-windowed lantern from Avram. In the Grove your Nubbin carries it on its own little walk round the paths at dusk.

Sets on completion: `{"a30-08":true}`

**Notes:** CARE: the men are lantern light beyond the gate; never seen, never heard clearly. Yossele does nothing but stand; no one is touched or threatened. REWARD: the Night-Round Lantern, one-time; in the Grove it is an unlimited idle behaviour (your Nubbin walks a short round at dusk carrying it), never a task or a timer.

## A30-9. Fridays

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the golem laid to rest each Friday before the Sabbath* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-8, from Nova’s atlas. · requires: A30-8

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Dvora (The caretaker’s wife (our invention)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention)), Shmuel (The caretaker’s small son (our invention)), Mirele (The caretaker’s youngest (our invention))

### Step 1: Find Yossele before the Sabbath comes in.

Hint: Friday afternoon. Everyone is hurrying; Yossele isn’t. · check: `find:a30-yossele:friday`

#### <a id="a30-09-friday"></a>Scene `a30-09-friday`

_Friday afternoon. The whole lane is hurrying: floors swept, pots on, children scrubbed whether they like it or not._  
_Hannah’s plaited loaves go past the window in baskets, shining. Everyone is getting ready for the Sabbath._  
**Dvora**: The rabbi will want Yossele before sunset. Go and find him, will you? I’ve got four things on the fire.  
_Your Nubbin knows exactly where he is. It sets off at a run, and you follow._  
_You find him at the caretaker’s door, where the children are._  
_Behind you, the rabbi is already coming down the lane, wiping ink off his fingers._  

### Step 2: Help the rabbi lay Yossele down to rest.

Hint: Gently. Support his head. · check: `sit:a30-yossele:rest`

#### <a id="a30-09-rest"></a>Scene `a30-09-rest`

**Rabbi Loew**: Yossele. Come and lie down.  
_He comes, and lies down on a blanket in the rabbi’s back room, as long as a door. You hold his head as it goes down._  
**Rabbi Loew**: Every week, before the Sabbath. Everything rests on the Sabbath. Even this.  
_He reaches up and rubs out the first letter, the alef. It comes away under his thumb like flour._  
_Two letters are left on the brow: מת, met. Dead._  
_Yossele closes his eyes, and the warmth goes out of him slowly, like a stove at night. The clay is only clay._  
_Your Nubbin climbs up beside the clay and puts its paw on the arm, and keeps it there._  

**Choices**

- **Pull the blanket up over him.**
    - **Rabbi Loew**: Yes. I do that too. I don’t know who it’s for.
- **“Does he know?”**
    - **Rabbi Loew**: I don’t know. I have never known. I tell myself he sleeps.
    - **Rabbi Loew**: It is one letter. That is all there ever is between the two.

#### <a id="a30-09-rest-done"></a>Done `a30-09-rest-done`

_On Saturday night, when three stars are out, the rabbi writes the alef again. Yossele sits up as if from a nap._  
_Your Nubbin is waiting by the door, and falls in a step behind him as if it had never been away._  

### Complete

#### <a id="a30-09-complete"></a>Complete `a30-09-complete`

_It happens every Friday after that. You learn to hold his head, and the rabbi learns to let you._  
**Rabbi Loew** _(soft)_: You have good hands for it. Slow ones. Most people hurry the slow things.  
_Dvora lights the candles. The lane goes quiet, the way it only does on Friday night, as if the whole town has sat down._  

#### <a id="a30-09-order-safe"></a>Variant `a30-09-order-safe`

_Variant within A30-9; it has no single parent scene._

_Yossele is standing in the caretaker’s doorway with one arm across it, like a bar on a gate._  
_Behind his arm Shmuel and Mirele are bouncing, trying to get out to the lane. He doesn’t move._  
**Shmuel** _(angry)_: He won’t let us out! We only want to see the bread!  
_Gently, completely, he keeps them in. Every time one of them ducks under, he lifts them back with one hand._  
**Dvora** _(think)_: He’s started doing that. Every door, all afternoon. They’re safe, I suppose. They’re very safe.  

#### <a id="a30-09-order-help"></a>Variant `a30-09-order-help`

_Variant within A30-9; it has no single parent scene._

_Yossele is sweeping the caretaker’s step. It is very clean, as if it has been swept a great many times._  
_Every neighbour who passes says “Yossele, would you…” and he would. He has a basket, two buckets and a broom._  
**Rivka**: Old Mrs Weiss asked him to carry her chair in, and he carried her in too. She was sitting in it.  
_Behind him, in a neat row, are six chairs nobody asked to be moved. He has started helping before he’s asked._  

#### <a id="a30-09-order-sit"></a>Variant `a30-09-order-sit`

_Variant within A30-9; it has no single parent scene._

_Yossele is sitting on the caretaker’s step, as long as the step. Three children are sitting with him._  
_Shmuel is on one knee and Mirele on the other, and Rivka is leaning on his arm, telling him a long story._  
_Your Nubbin is asleep in his lap, on its back, with its paws in the air._  
**Mirele** _(happy)_: He doesn’t talk. But he listens properly. Not like Papa.  
_Yossele doesn’t move. He has been sitting like this since noon, very still, so nobody falls._  

**Rewards**


Sets on completion: `{"a30-09":true}`

**Notes:** ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-09-order-safe | a30-09-order-help | a30-09-order-sit right after a30-09-friday, before step 2. HEBREW: מת is shown large, as the letters were in A30-6 (alef gone from the right). The word “Dead” is said once and plainly, the outline’s line; no death imagery: the clay simply goes still. CARE: all this is Friday afternoon, before sunset; the laying down is not Sabbath work. The candle-lighting in the complete scene is Dvora’s, seen from the loft.

## A30-10. The Forgotten Friday

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the Friday the rabbi forgot* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-9, from Nova’s atlas. · requires: A30-9

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), A Boy (A boy sent running for the rabbi (our invention)), Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Dvora (The caretaker’s wife (our invention)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention)), Shmuel (The caretaker’s small son (our invention)), Mirele (The caretaker’s youngest (our invention))

### Step 1: Get through Friday afternoon. The rabbi has been called away.

Hint: Help in the house. The rabbi will be back before sunset. He always is. · check: `talk:a30-boy:gate`

#### <a id="a30-10-called"></a>Scene `a30-10-called`

_Another Friday. You are helping Dvora when a boy comes running up the lane, out of breath._  
**A Boy**: Rabbi! Rabbi Loew! At the far end of the town, by the old cemetery. A baby’s coming, and it’s slow.  
**A Boy**: The family asks will you come and sit with them. They’re frightened. They asked for you.  
**Rabbi Loew**: Of course. Of course I’ll come.  
_He goes at once, as he is, with his coat half on. He doesn’t look back at the rabbi’s house._  
_Yossele is standing in the courtyard, waiting. Nobody has told him anything._  

**Choices**

- **“What about Yossele?”**
    - But the rabbi is already round the corner, and nobody hears the question but you.
- **Help Dvora with the pots.**
    - You scrub, and stir, and fetch. The afternoon goes the way Friday afternoons do, all at once.

#### <a id="a30-10-called-done"></a>Done `a30-10-called-done`

**Dvora**: He’ll be back. He’s never once been late for the Sabbath. Not once in thirty years.  

### Step 2: Wait in the synagogue courtyard as the Sabbath comes in.

Hint: The rabbi went straight to the synagogue from the far end of town. Watch the lane. · check: `wait:a30-synagogue:courtyard`

#### <a id="a30-10-psalm"></a>Scene `a30-10-psalm`

_The sun is low over the roofs. The baby came, a girl, and the rabbi has hurried straight to the synagogue._  
_From inside the old synagogue comes the murmur of men praying. Then they begin Psalm 92, the psalm for the Sabbath day._  
_You are in the courtyard with the children. The Sabbath is coming in, the way it does, like a tide._  
_Rivka looks down the lane towards the rabbi’s house. Then she grabs your sleeve._  
**Rivka** _(shock)_: He didn’t. Did he? He didn’t lay Yossele down.  
_“Once the rabbi forgot to extract the Shem, and feared that the golem would desecrate the Sabbath.”_  
_Down the lane, in the rabbi’s courtyard, something begins to move._  

### Step 3: Run for the rabbi.

Hint: To the synagogue door. Avram is there; he can fetch him. · check: `deliver:a30-word:synagogue-door`

#### <a id="a30-10-fetch"></a>Scene `a30-10-fetch`

_You run. Through the courtyard, to the synagogue door, where Avram stands with his keys._  
**Avram**: What? What is it?  
_You don’t have to say. He looks past you, down the lane, and goes in without another word._  
_The murmur stops. Then the rabbi is in the doorway, without his coat, and running, which you have never seen._  
_He goes down the lane straight to Yossele, and doesn’t slow down, and reaches up._  
_He rubs out the alef, and two letters are left. The great clay man stands still for one breath._  
_Then he falls, all at once, like a wall of sand when the tide goes out, and is only clay in the lane._  
_Nobody is hurt. Things are broken, and the lane is a mess, and nobody, nobody at all, is hurt._  

### Complete

#### <a id="a30-10-complete"></a>Complete `a30-10-complete`

_The lane is very quiet. The clay lies in a long heap across the cobbles, with two letters on what was a brow._  
_The rabbi stands over it, out of breath, with his hand on the cold clay. He doesn’t say anything for a long time._  
**Rabbi Loew** _(sad)_: I forgot. A baby was born, and I was so glad, and I forgot him.  
**Rabbi Loew** _(soft)_: Come. They’re waiting. The Sabbath doesn’t wait, and nor should we.  

#### <a id="a30-10-grow-safe"></a>Variant `a30-10-grow-safe`

_Variant within A30-10; it has no single parent scene._

_Yossele is going down the lane, door to door, shutting each one with his hand flat on it. Then the next._  
_Every time he moves he is a little taller. The cobbles crack under his feet._  
_He drags Hannah’s cart across the end of the lane, and the gate behind it, and holds them there. Nobody in, nobody out._  
_People call from behind their shutters, and he doesn’t hear them. He is keeping everyone safe, and he is getting bigger._  
**Rivka** _(shock)_: He’s shut the whole lane in! Mama’s behind one of those doors, and the rabbi doesn’t know!  

#### <a id="a30-10-grow-help"></a>Variant `a30-10-grow-help`

_Variant within A30-10; it has no single parent scene._

_Yossele is doing everything at once. Sweeping the lane, fetching water, chopping wood, faster and faster._  
_Every time he moves he is a little taller. The broom snaps in his hands; he picks up another, and that snaps too._  
_The woodpile goes to splinters and the water barrel splits. Hannah’s oven door comes off its hinges._  
_Nobody has asked him. He is helping, and helping, and helping, and he is getting bigger._  
**Dvora** _(shock)_: My pots! He’s scrubbing my pots! He’s scrubbing them into pieces!  

#### <a id="a30-10-grow-sit"></a>Variant `a30-10-grow-sit`

_Variant within A30-10; it has no single parent scene._

_In the rabbi’s courtyard Yossele is sitting on the step, with your Nubbin in his lap. He is restless._  
_He grows a little as you watch, then a little more. The step cracks under him._  
_He stands up. Very carefully, before anything else, he lifts your Nubbin and sets it down on the step, on its feet._  
_Then he goes. Barrels roll, the fence goes over, the woodpile spills across the cobbles, and he is getting bigger._  
**Rivka** _(shock)_: He put it down first. Did you see? He put it down first.  

#### <a id="a30-10-ember"></a>Variant `a30-10-ember`

_Variant within A30-10; it has no single parent scene._

_In your Nubbin’s little lantern the red pebble flares up, bright and hot, as Yossele grows._  
_Your Nubbin holds the lantern away from itself with both arms, and looks at you. It knows that light._  

#### <a id="a30-10-ember-settle"></a>Variant `a30-10-ember-settle`

_Variant of `a30-10-ember`._

_In the little lantern the red pebble dims, slowly, back to its own small glow. It settles, like someone sitting down._  
_Your Nubbin holds it close again._  

**Rewards**


Sets on completion: `{"a30-10":true}`

**Learning Grove swaps**

- `a30-10-psalm#5` → The rabbi had forgotten. Yossele had not been put to rest, and the day of rest had come.

**Notes:** LIFTED TEXT: a30-10-psalm#5 (Jewish Encyclopedia 1904, “Golem”), narration. The encyclopedia says “the Shem”; our telling uses the letter, and the narration quotes the old book as it is. PSALM 92 is named only; the prayer is a murmur through the wall, never words, never sung on screen. ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-10-grow-safe | a30-10-grow-help | a30-10-grow-sit right after a30-10-psalm, before step 3. Each shows him restless, then strong, then too strong, and things break. CINDER (cinder set): play a30-10-ember after the grow insert, and a30-10-ember-settle after a30-10-fetch. CARE: the Sabbath has not yet come in for the congregation while the psalm is unfinished; the rabbi stops the prayer, goes out, and rubs out the letter, as in the legend (advisers to check). The player only runs to fetch him. No one is hurt (said twice, on purpose). The fall is clay falling, like sand; no death imagery, no sound of a body. The baby and her family are a happy reason, not a danger.

## A30-11. Twice

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): Psalm 92 said twice in the Old-New Synagogue* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-10, from Nova’s atlas. · requires: A30-10

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Dvora (The caretaker’s wife (our invention)), Avram (The synagogue caretaker (our invention; the legend’s Jewish Town)), Shmuel (The caretaker’s small son (our invention)), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention))

### Step 1: Wait at the synagogue door while they begin again.

Hint: Sit on the step. You don’t need to do anything. · check: `wait:a30-psalm:door`

#### <a id="a30-11-again"></a>Scene `a30-11-again`

_The rabbi goes back into the synagogue. The men follow him in, and the door closes._  
_You sit on the step outside with your Nubbin. Inside, there is a pause, and then a single voice begins._  
_They are saying the psalm again, from the very start, as if the first time had not happened._  
_You hear it twice tonight, the same psalm. It comes through the old wall as a murmur, low and steady, like rain._  
_They still do, the legend says. In that synagogue, they say that psalm twice, every Friday, to this day._  
_Your Nubbin leans against your side. It is shivering a little, though the evening is warm._  

### Step 2: Go home to the Sabbath table.

Hint: Dvora has kept your places. There is nothing you need to do tonight. · check: `sit:a30-sabbath-table:avram`

#### <a id="a30-11-table"></a>Scene `a30-11-table`

_At Avram’s house the candles are lit and the table is laid with a white cloth. Hannah’s loaf sits under its cover._  
_Nobody talks about the lane. Avram blesses the wine, and the bread, and passes it round._  
**Shmuel**: Is Yossele dead?  
**Dvora** _(soft)_: Tomorrow. We’ll talk about Yossele tomorrow night. Tonight is the Sabbath, and we rest, even from that.  
_Shmuel thinks about this, and nods, and eats his bread._  
_Your Nubbin sits on the bench between Rivka and you, and nobody asks it to do anything at all._  

**Choices**

- **Eat, and say nothing.**
    - You eat. The bread is soft and sweet, and better than anything you have eaten all week.
- **Give your Nubbin half your bread.**
    - Your Nubbin eats it very slowly, as if it knows this is not an ordinary loaf.

### Complete

#### <a id="a30-11-complete"></a>Complete `a30-11-complete`

_Late, the rabbi comes by, but doesn’t come in. He stands at the window a moment, looking at the table, at the candles._  
**Rabbi Loew** _(soft)_: Good. Good. Rest. That’s the whole of it.  
_He goes home up the lane, slowly. He walks round the place where the clay is, and doesn’t look at it._  

**Rewards**


Sets on completion: `{"a30-11":true}`

**Notes:** PSALM 92 is named once (in A30-10) and is a murmur here; no words, not sung on screen, no printed verse. The custom of saying it twice in the Old-New Synagogue is “the legend says”: advisers to check how it is described today. CARE: the Sabbath meal is shown simply and correctly (candles already lit, the wine and the bread blessed by Avram, off-voice); advisers to check every detail. The player does no work: steps are wait and sit only.

## A30-12. The Attic

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the clay laid in the synagogue attic* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-11, from Nova’s atlas. · requires: A30-11

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Isaac (The rabbi’s son-in-law, one of his two helpers in later tellings of the legend), Jacob (The rabbi’s pupil, his other helper in later tellings of the legend), Avram (The synagogue caretaker (our invention; the legend’s Jewish Town))

### Step 1: Hold the lantern at the foot of the attic steps.

Hint: Saturday night, once three stars are out. Stand where the light reaches the top. · check: `carry:a30-lantern:attic-stair`

#### <a id="a30-12-stars"></a>Scene `a30-12-stars`

_Saturday night. Three stars are out over the steep roof, and the Sabbath is over._  
_The rabbi, Isaac and Jacob carry the clay up the lane on a door, the way you would carry someone home._  
**Avram** _(soft)_: The attic. He wants it in the attic. I’ve brought the key I never knew the door for.  
_It fits. Avram looks at it in the lock for a moment, as if it had been waiting twenty years to be useful._  
_You hold the lantern at the foot of the steps. The three of them carry the clay up into the dark._  
_Up there, the old pages are stacked and laid in rows, worn-out books that held holy words, put to rest._  
_They lay the clay among them, gently, and cover it over with pages, the way you’d tuck in a child._  
_The encyclopedia, three hundred years on, will say only this:_  
_“…its remains are said to be still among the débris in the attic of the synagogue.”_  

### Step 2: Stay with your Nubbin at the foot of the wall.

Hint: It won’t come away yet. Sit down next to it, and wait. · check: `sit:a30-nubbin:attic-wall`

#### <a id="a30-12-steps"></a>Scene `a30-12-steps`

_The rabbi comes down last. At the bottom he turns and speaks to everyone in the courtyard._  
**Rabbi Loew**: Nobody is to go up there. Not for curiosity, not for courage, not for anything. Let him rest.  
_Isaac and Jacob take the steps away, one by one, and carry them off. The attic door is high in the wall now._  
_Your Nubbin sits down at the foot of the wall, right under the door, and looks up._  
_It doesn’t move when you call it. It doesn’t move when Avram goes in, or when the lamps go out._  
_So you sit down next to it, on the cold cobbles, and wait._  

**Choices**

- **Put your arm round it.**
    - It leans into you, and keeps looking up.
- **Call it once more, softly.**
    - It looks at you, and then back up at the door. It isn’t ready, and nor are you.

#### <a id="a30-12-steps-done"></a>Done `a30-12-steps-done`

_Near midnight the rabbi comes back out, with a blanket, and sits down on the other side of your Nubbin._  
**Rabbi Loew** _(soft)_: I thought there would be someone here. I hoped so.  
_The three of you sit under the wall a long time, saying nothing. Then your Nubbin gets up, and lets you take it home._  

### Complete

#### <a id="a30-12-complete"></a>Complete `a30-12-complete`

_In the morning there is a little heap of river clay at the foot of the wall, where your Nubbin sat._  
_Nobody sweeps it away. Not Avram, not Dvora, not anyone, all week._  

**Rewards**


Sets on completion: `{"a30-12":true}`

**Learning Grove swaps**

- `a30-12-stars#8` → People still say that the clay is up there, sleeping among the old books, to this day.

**Notes:** LIFTED TEXT: a30-12-stars#8 (Jewish Encyclopedia 1904, “Golem”, a fragment, with a leading ellipsis), narration, introduced by #7. CARE: the attic is a genizah, where worn-out holy books are laid to rest (Rivka says so in A30-1). Show it with respect: warm lantern light, rows of pages, no cobwebs-and-horror, no jump scare, no “cursed attic”. The clay is carried after the Sabbath has ended (three stars out). Avram’s unknown key (A30-1) fits the attic door: our small invention. The third rule lands in a30-12-steps without being named. HAZEL (s24Done): play ATLAS_A30_VARIANTS a30-margin-hazel after a30-12-complete, back in the Grove with the atlas open at the attic.

## A30-13. What the Rabbi Says

*The Golem of Prague (Jewish legend, Czech lands; set in the late 1500s, told from the 1800s): the rabbi after the golem; the golem of Chełm* · audience: all · where: Nova’s atlas: the Word on the Brow page (Atlas campaign) · when: Any time after A30-12, from Nova’s atlas. · requires: A30-12

**Cast:** Rabbi Loew (Rabbi Judah Loew ben Bezalel, the Maharal of Prague (about 1520–1609), a real scholar and teacher; the golem legend was attached to him in the 1800s. Original design), Rivka (The caretaker’s daughter, who presses the clay tile (the outline; our invention))

### Step 1: Sit with the rabbi on the study house bench.

Hint: A week later. He has kept a place for you. · check: `talk:a30-loew:bench`

#### <a id="a30-13-bench"></a>Scene `a30-13-bench`

_A week later. The rabbi sits on the bench outside the study house in the sun, and moves over to make room._  
**Rabbi Loew** _(think)_: I have been thinking about my clay man. I think about very little else. My students have noticed.  
**Rabbi Loew**: He was a good guard. He did what he was told, and only that. I wanted that. I asked for it.  
**Rabbi Loew** _(sad)_: But a thing that only obeys has no brakes of its own. All its brakes are in your hands. And hands forget.  
**Rabbi Loew**: I am not the first, you know. In Chełm, they say, a rabbi made one before me, and it grew, and kept growing.  
**Rabbi Loew**: He was afraid it would fill the world. So:  
**Rabbi Loew**: “Finally he extracted the Shem from the forehead of his golem, which returned to dust.”  
**Rabbi Loew**: He had more sense than me. He did it before anyone had to run.  

**Choices**

- **“You were glad about the baby.”**
    - **Rabbi Loew**: I was. I am. I would forget him again, for her. That is the worst of it, and the best.
- **Sit with him, and say nothing.**
    - So you sit. After a while he pats your knee, twice, and that is the conversation finished.

### Step 2: Go and see what Rivka has made for you.

Hint: She is at the caretaker’s door, holding something behind her back. · check: `collect:a30-tile:rivka`

#### <a id="a30-13-tile"></a>Scene `a30-13-tile`

_Rivka is waiting at the door with both hands behind her back, which means it’s a present._  
**Rivka**: I took some of the clay from under the wall. Only a little. From the outside, not the attic. Nobody said not to.  
_She holds out a small square tile, pressed flat and dried in the sun. There are three letters on it, a bit wobbly._  
_אמת, emet. Alef first, on the right._  
**Rivka**: I did the alef first, like the rabbi. So it’s true. So it stays.  
_She has made a little clay bird as well, out of the last scrap. It has a very fat tummy and no feet._  
**Rivka**: That one’s for your Nubbin. It doesn’t do anything. It just sits there. That’s the point of it.  

#### <a id="a30-13-tile-paw"></a>Variant `a30-13-tile-paw`

_Variant of `a30-13-tile`._

_Beside the three letters there is a tiny pawprint, pressed into the corner of the tile._  
**Rivka** _(happy)_: Your Nubbin did that. I was holding it out to show it, and it put its paw on. I didn’t smooth it.  

### Complete

#### <a id="a30-13-complete"></a>Complete `a30-13-complete`

_Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges._  
_Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window._  
_The shutter of the attic window has been closed, and barred across from the inside. Nobody remembers doing it._  
_It looks like a door holding itself shut, the way he held the lane. Safe, and nobody in, and nobody out._  
_Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do._  
_You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is._  

#### <a id="a30-13-order-safe"></a>Variant `a30-13-order-safe`

_Variant within A30-13; it has no single parent scene._

**Rabbi Loew** _(soft)_: You told him to keep everyone safe. And he did. On that last night he kept the whole lane in.  
**Rabbi Loew**: A guard who keeps everyone in isn’t a guard any more. He’s a wall.  
**Rabbi Loew** _(think)_: And a wall, however kind, is not a home. A home has a door that opens.  
**Rabbi Loew**: It was a good order. It was the order I gave him myself, in my heart. That’s why I know.  

#### <a id="a30-13-order-help"></a>Variant `a30-13-order-help`

_Variant within A30-13; it has no single parent scene._

**Rabbi Loew**: You told him to help where he was asked. And at the end he helped where nobody asked at all.  
_He laughs a little, sadly, and shakes his head._  
**Rabbi Loew** _(sad)_: He was a very good servant. That was the trouble.  
**Rabbi Loew**: Help with no one asking for it isn’t help. It’s weather. Dvora’s pots would agree with me.  

#### <a id="a30-13-order-sit"></a>Variant `a30-13-order-sit`

_Variant within A30-13; it has no single parent scene._

**Rabbi Loew** _(think)_: You told him to sit with the little ones. I’ve been thinking about that most of all.  
**Rabbi Loew**: Everything in him, I put there. The clay, the word, the work. Even the order was put there, by you.  
**Rabbi Loew**: But at the end, wild as he was, he put your little one down on the step before he went.  
**Rabbi Loew** _(soft)_: Nobody told him to do that. I didn’t put that there. It is the only thing in him I didn’t.  
_Your Nubbin, at your feet, is looking at the attic window._  

#### <a id="a30-13-kept"></a>Variant `a30-13-kept`

_Variant within A30-13; it has no single parent scene._

_The rabbi looks at your pocket, where the stone is. You hadn’t thought it showed._  
**Rabbi Loew**: You carry something. Heavy, for its size. What is it?  

**Choices**

- **Tell him about the stone.**
    - You tell him, and it hums one word, safe, while you talk. He listens to the end, and doesn’t interrupt.
    - **Rabbi Loew**: Some things are made to protect. And then they have to be put somewhere high.
    - **Rabbi Loew**: There’s no shame in carrying them up the steps. I did.
- **Keep it to yourself.**
    - **Rabbi Loew**: Then keep it. You’re allowed.
    - **Rabbi Loew**: Only, some things are made to protect, and then have to be put somewhere high. There’s no shame in carrying them up the steps.

#### <a id="a30-13-complete-help"></a>Variant `a30-13-complete-help`

_Variant of `a30-13-complete`._

_Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges._  
_Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window._  
_On the sill outside the attic window, high up where nobody can reach, a broom leans against the wall._  
_Nobody knows how it got there. Nobody has tried to fetch it down._  
_Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do._  
_You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is._  

#### <a id="a30-13-complete-sit"></a>Variant `a30-13-complete-sit`

_Variant of `a30-13-complete`._

_Rivka walks you to the end of the lane, where the page begins to go thin and brown at the edges._  
_Behind you the steep roof of the synagogue stands against the evening, and high in its gable, the attic window._  
_On the sill of the attic window, high up where nobody can reach, there is a small clay bird. A child’s._  
_Rivka looks up at it, and then at you, and doesn’t say anything. She only had enough clay for one, she said._  
_Your Nubbin looks up at the window for a long time. Then it takes your hand, which it doesn’t often do._  
_You are back in the Grove, the atlas on your knee. Your pocket is heavier by one clay tile, still cool, as if nobody has told it where it is._  

**Rewards**

- Clay Tile (decor): A small tile of river clay pressed by Rivka, with three Hebrew letters: אמת, emet, “truth”. Rub out the first and it reads מת, met, “dead”. It sits on the cottage hearth beside Hazel’s old clay tablets.
- Clay Bird (decor): A little clay bird with a fat tummy and no feet, made by Rivka from the last scrap. It doesn’t do anything. That’s the point of it.
- Price of Power Bookmark (item): A strip of brown paper with three small letters on it. It marks the Word on the Brow page, and counts towards the Price of Power festival.

Sets on completion: `{"a30-13":true,"a30-done":true}`

**Learning Grove swaps**

- `a30-13-bench#6` → So he rubbed out the word, very gently, and his clay man lay down and went to sleep for good.

**Notes:** LIFTED TEXT: a30-13-bench#6 (Jewish Encyclopedia 1904, “Golem”, of the golem of Chełm), in the rabbi’s mouth as the older story; #4–5 introduce it in our words. ORDER PAYOFF (a30-order): play ATLAS_A30_VARIANTS a30-13-order-safe | a30-13-order-help | a30-13-order-sit after a30-13-bench, before step 2 (what the rabbi says of what you chose). With sit, also play a30-13-tile-paw after a30-13-tile (the pawprint). The complete scene shown, a30-13-complete, is for safe (the barred shutter). For help play a30-13-complete-help (the broom); for sit, a30-13-complete-sit (the clay bird on the sill). KEPTSTONE: play a30-13-kept after the order insert, before step 2 (a choice with no flag). REWARDS (one-time, at a30-13-complete*): the Clay Tile (the Grove keepsake, on the cottage hearth; with sit it has a tiny pawprint beside the letters), the Clay Bird decor and the Price of Power Bookmark. SIM: the Price of Power festival (A1, A4, A8, A15, A20, A30, any two) reads atlasDone('A30') from a30-done. The Grove keepsake scene plays the first time you enter the cottage after a30-done, checked in this order: a30-grove-tile-quiet unless the campaign is past chapter 4 (c4-out seen), mossFaded is false and the ending is not moss-sleeps (so Moss never speaks before he has come down or after he has faded); then a30-grove-tile-cinder if cinder is set; otherwise a30-grove-tile.

## Variant scenes

Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).

#### <a id="a30-margin-hazel"></a>Variant `a30-margin-hazel`

_Nova’s atlas lies open at the steep roof of the synagogue, and the little window high in its gable._  
_Beside the window, in faint pencil you have never noticed, there is a note in the margin. You know the hand._  
_“Clay, a word, and a man who forgot one Friday. I’d have forgotten every Friday.”_  
_Your Nubbin puts one paw on the drawing of the attic window, and leaves it there._  

#### <a id="a30-grove-tile"></a>Variant `a30-grove-tile`

_You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone._  
_Moss comes in from the step, and stops beside it. You tell him what the letters say, and what one letter less says._  
**Moss** _(soft)_: Truth, and then one letter less. That’s how close it always is.  
_He goes back out to his flat stone. Your Nubbin sits by the hearth and looks at the tile until it gets dark._  

#### <a id="a30-grove-tile-cinder"></a>Variant `a30-grove-tile-cinder`

_Variant of `a30-grove-tile`._

_You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone._  
_Moss comes in from the step, and stops beside it. He looks at the three letters for a long time._  
**Moss** _(soft)_: She’d have liked him. That’s the trouble with her.  
_He goes back out to his flat stone. Your Nubbin puts its night-round lantern down beside the tile, and leaves it there._  

#### <a id="a30-grove-tile-quiet"></a>Variant `a30-grove-tile-quiet`

_Variant of `a30-grove-tile`._

_You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets, the ones about the Heartstone._  
_There is nobody in the cottage to tell what the letters say. You say it anyway, out loud: truth, and then one letter less._  
_Your Nubbin sits by the hearth and looks at the tile until it gets dark._  
