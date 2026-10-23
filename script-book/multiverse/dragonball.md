# Multiverse: Dragon Ball (DB1–DB20)

## DB1. The Boy with a Tail

*Dragon Ball, chapter 1 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: Any time once the Multiverse rift is open; first storyline of the Dragon Ball line

**Cast:** Bulma (Bulma (Dragon Ball)), Goku (Son Goku (Dragon Ball))

### Step 1: Ride with Bulma up the mountain road towards her radar’s blip.

Hint: A short ride: your Nubbin sits in the bike basket and leans into the bends. Finishing is enough. · check: `race:finish:mv-mountain-road`

#### <a id="mv-db01-road"></a>Scene `mv-db01-road`

_The rift drops you on a dirt road between tall, pointed green mountains. Somewhere close, an engine is complaining._  
_A motorbike skids to a halt in front of you. The rider has blue hair, a pink dress and a beeping gadget in one fist._  
**Bulma**: You’re standing in the road. Are you lost? You look lost. Your little friend looks extremely lost.  
**Bulma** _(happy)_: I’m Bulma. Genius, inventor, sixteen, on summer holiday. Don’t ask what I’m hunting. All right, ask.  
**You**: What are you hunting?  
**Bulma** _(happy)_: Dragon Balls. Seven orange balls with stars inside. Collect all seven and a dragon comes out and grants a wish.  
**Bulma**: I’ve got two already. My radar says the third is up this road. Hop on the back. Small fry gets the basket.  
_Your Nubbin is already in the basket. It has never ridden anything faster than a falling leaf, and it is thrilled._  
**Bulma**: Hold on. I drive the way I think: fast and brilliantly.  

#### <a id="mv-db01-road-done"></a>Done `mv-db01-road-done`

_Round a bend, a small boy steps into the road. Bulma brakes much too late._  
_The boy stops the front wheel with one hand and flips the whole bike into a ditch: Bulma, you, and the basket._  

### Step 2: Talk to Goku at his grandfather’s hut.

Hint: Be honest with him. He can tell when people aren’t, he just doesn’t mind much. · check: `talk:goku`

#### <a id="mv-db01-hut"></a>Scene `mv-db01-hut`

**Goku** _(angry)_: Got you, monster! You’re not eating me today. Grandpa said monsters always try.  
**Bulma** _(angry)_: It is not a monster, it is a motorbike! Ow. My elbow. My hair.  
_He has spiky black hair, a red staff on his back, and a monkey’s tail. Your Nubbin spots the tail and is instantly in love._  
**Goku** _(happy)_: You’ve got a tail too! A little round one. I’m Goku. I live here. Well, up there.  
**Goku** _(think)_: And you’re… What are you? You haven’t got a tail. Grandpa said girls were a whole different thing.  
**Bulma**: Your grandpa was right about something. Listen, do you have an orange ball? About this big, with stars inside?  
_Goku’s face goes still. He leads you to a hut where a small orange ball sits on a cushion beside an old man’s photo._  
**Goku** _(sad)_: That’s Grandpa Gohan’s ball. Four stars. When I talk to it, it’s like he’s still about.  
**Bulma**: Oh. Right. That’s… actually sweet. I hate it.  

**Choices**

- **Tell him straight: Bulma wants it for a wish.** — sets `{"mv-db-goku-deal":"deal-truth"}`
    - **Goku**: A wish? What would I even wish for? I’ve already got a stick.
    - **Bulma**: Fine. You keep it. You just come along and carry it, and when all seven are together I borrow it. Once.
- **Let Bulma make her sales pitch.** — sets `{"mv-db-goku-deal":"deal-pitch"}`
    - **Bulma**: Come with me and see the world! Big cities! Restaurants that serve more than one fish!
    - **Goku**: More than one fish?
- **Ask Goku what he wants, before anyone sells him anything.** — sets `{"mv-db-goku-deal":"deal-asked"}`
    - **Goku**: Me? Grandpa said there are people out there stronger than me. I want to find them and fight them. Nicely.
    - **Bulma**: …That is the strangest life plan I’ve ever heard, and it fits my route perfectly.

#### <a id="mv-db01-hut-done"></a>Done `mv-db01-hut-done`

_Goku agrees on one condition: the four-star ball is never given away. Only borrowed._  
_Bulma agrees, fingers crossed behind her back. Your Nubbin sees, and decides to keep an eye on her._  

### Step 3: Get Bulma back from the pterodactyl.

Hint: A short karate bout. Your Nubbin rides the end of Goku’s staff, so aim high. · check: `karate:win:mv-pterodactyl`

#### <a id="mv-db01-supper"></a>Scene `mv-db01-supper`

_Goku goes fishing by jumping into the river and punching it. A fish the size of a bathtub floats up, stunned._  
**Bulma** _(shock)_: You are going to eat all of that. By yourself.  
**Goku** _(happy)_: Course not. Your little one can have the tail end.  
_A shadow crosses the fire. Something with leather wings and a long beak scoops Bulma up by the back of her dress._  
**Bulma** _(shock)_: Goku! It’s got me! Do something heroic, and do it now!  
**Goku**: Staff! Get long!  
_The red staff shoots up like a fishing line cast at the moon. Your Nubbin is clinging to the tip of it._  
**Goku** _(happy)_: Hang on, little one. When I say go, bite its toe.  

#### <a id="mv-db01-supper-done"></a>Done `mv-db01-supper-done`

_One bite, one whack, and the pterodactyl decides it wasn’t hungry. Bulma drops into the river, the softer option._  
**Bulma** _(angry)_: My dress. My hair. Thank you, obviously. But my dress.  

### Complete

#### <a id="mv-db01-complete"></a>Complete `mv-db01-complete`

_By firelight, Bulma sets three Dragon Balls on a flat rock: her two, and Goku’s four-star._  
**Bulma** _(happy)_: Three down, four to go. At this rate I’ll have my wish by the end of the holidays.  
**Goku**: What are you wishing for?  
**Bulma**: The perfect boyfriend. Tall, handsome, devoted. Don’t laugh.  
**Goku** _(think)_: What’s a boyfriend? Is it like a fish?  
_Goku falls asleep using your Nubbin as a pillow. Your Nubbin allows it, which it has never allowed anyone._  
_Bulma clips a tiny beeping charm to its collar: a spare from her radar, she says, because geniuses always have spares._  

**Rewards**

- Radar Charm (item): A beeping keychain from Bulma. Shows the Dragon Ball count for the line in the Multiverse journal.
- Riding Goggles (cosmetic): Bulma’s spare riding goggles, sized for a Nubbin. Wearable by any Nubbin.

Sets on completion: `{"mv-db01":true,"mv-db-radar":3}`

**Notes:** Opens the Dragon Ball line; no prerequisite beyond the rift. Staging: Mount Paozu, dirt road, Goku’s round hut with Gohan’s photo and the four-star ball on a cushion. The brief puts the Nubbin on Bulma’s bike; in chapter 1 she drives a car, so the bike is our change (a capsule motorbike suits her). The bike basket ride is a race-course reskin with no rivals. Pterodactyl bout: the Nubbin rides the staff tip, so the opponent hovers; one-round bout. Goku’s staff (Nyoibō) grows on a spoken order; keep his order original (“Staff! Get long!”), never the anime’s call. `mv-db-radar` is Bulma’s first hunt counter, separate from `mv-db-balls` (see file header). Chapter checked from memory: Dragon Ball ch. 1, “Bulma and Son Goku” (1984). `mv-db-goku-deal` gains `asked` (added in review): Goku names his own reason to travel, to find people stronger than him, which the tournaments pay off. SIGNATURE CHOICE: mv-db-goku-deal (deal-truth | deal-pitch | deal-asked: how Bulma got Goku to come) pays off through MV_DRAGONBALL_VARIANTS at mv-db07-complete (how she hands over the radar and the four-star), mv-db13-complete (what Goku says to his grandfather’s ball before the wish) and mv-db19-road (what Bulma brings with the second radar). The values carry a deal- prefix because the runner matches variants by value and mv-db-korin also uses asked.

## DB2. Oolong

*Dragon Ball, chapters 3–4 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB1, The Boy with a Tail · requires: DB1

**Cast:** Goku (Son Goku (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Oolong (Oolong, the shapeshifting pig (Dragon Ball)), Village Elder (The elder of the village Oolong terrorises (Dragon Ball ch. 3–4))

### Step 1: Find out why the village has locked its doors.

Hint: Talk to the elder. Knock politely; everyone here is very frightened of knocking. · check: `talk:mv-aru-elder`

#### <a id="mv-db02-village"></a>Scene `mv-db02-village`

_The radar leads to a village of round houses. Every door is shut, every shutter barred, and the street is empty._  
**Bulma**: Charming. Nothing says welcome like the sound of fifty people holding their breath.  
_Goku knocks, and somebody inside screams. He knocks again, more politely, and the screaming gets politer too._  
**Village Elder** _(shock)_: Go away! Or, if you are the monster, please take the cabbages. They are very good cabbages.  
**Village Elder**: …You’re not the monster. You’re a girl, a monkey boy, a stranger and a small round thing. Come in, quickly.  
**Village Elder** _(sad)_: A monster has been stealing our daughters. One by one. It comes as a bull, or a giant, or a demon. Tomorrow it wants Pochawompa.  
**Bulma**: So you just hand them over?  
**Village Elder**: What else can we do? It is very large. Sometimes.  
**Goku** _(happy)_: I’ll fight it. Does it taste like a bull too? Never mind. I’ll fight it.  

**Choices**

- **Suggest a decoy bride. Goku in a dress.** — sets `{"mv-db-oolong-plan":"decoy"}`
    - **Goku**: What’s a dress? Oh. Oh, it’s a sack with holes. That’s fine.
    - **Bulma**: Hold still. And tuck the tail in. Monsters probably notice tails.
- **Sit up with the villagers and wait for it.** — sets `{"mv-db-oolong-plan":"wait"}`
    - Your Nubbin takes first watch at the window. It is asleep in four minutes and denies it afterwards.
    - **Bulma**: We are getting a dress on Goku anyway. Monsters like brides. It’s a whole thing.
- **Volunteer your Nubbin as the bride.** — sets `{"mv-db-oolong-plan":"nubbin"}`
    - In a doily veil, your Nubbin looks like a very small, very determined wedding cake.
    - **Bulma**: Adorable. Also useless. Monsters want a bride they can find without bending down. Goku, arms up.

### Step 2: Fight the shapeshifting monster until his five minutes run out.

Hint: He changes shape every round but can only hold a shape for five minutes. Survive the clock and he pops back to himself. · check: `karate:win:mv-oolong-shapes`

#### <a id="mv-db02-monster"></a>Scene `mv-db02-monster`

_At dusk, a hulking horned shape stamps into the square. It is very large, just as advertised._  
**Oolong** _(angry)_: I have come for my bride! Hand her over, or I’ll… stamp about some more! Loudly!  
_The bride steps forward in a lopsided veil. Under the dress there is a definite tail._  
**Goku** _(happy)_: Hi! I’m the bride. Want to fight?  
_Goku’s first punch lands, and the monster yelps in a voice much too high for its horns._  
_In a puff of smoke it becomes a bat, then a rocket, then a very angry bull. Each shape lasts a little less long._  
**Bulma**: He can’t hold it! Five minutes, I bet you anything. Keep him busy!  
_Your Nubbin keeps him busy by sitting on his tail, whichever tail he currently has._  

#### <a id="mv-db02-monster-done"></a>Done `mv-db02-monster-done`

_With a pop, the giant is gone. In the dust sits a small pig in a little military jacket, looking deeply betrayed._  
**Oolong** _(sad)_: All right! All right. I’m Oolong. I’m not a monster. I only went to shapeshifting school. For a bit. I was asked to leave.  

### Step 3: Fetch the stolen girls from Oolong’s mansion.

Hint: A short expedition. The girls are not in a dungeon. You will see. · check: `expedition:complete:mv-oolong-mansion`

#### <a id="mv-db02-mansion"></a>Scene `mv-db02-mansion`

_Oolong’s mansion is up the hill. You expect chains and a cellar, and find a lounge, three sofas and a cake trolley._  
_The stolen girls are lying about in silk dressing gowns, eating chocolates and ordering Oolong to fetch more._  
**Oolong** _(sad)_: I wanted a wife. I got three bosses. They never cook. They never leave. Please take them home. I’m begging.  
**Bulma**: You poor thing. No, wait. You kidnapped them. You are not the poor thing here.  
_Bulma rummages in her capsule case and comes up with a little sweet wrapped in paper._  
**Bulma**: Eat this, Oolong. It’s a nice sweet. Very nice. Trust me.  
**Oolong** _(shock)_: Why are you smiling like that?  
**Bulma** _(happy)_: From now on, whenever I say a certain word, you’ll need the loo. Immediately. Wherever you are. So, which word?  

**Choices**

- **“Piggy.” Short and to the point.** — sets `{"mv-db-oolong-word":"piggy"}`
    - **Bulma**: Piggy.
    - Oolong leaves the room at a speed nobody would expect from his legs.
- **“Oink.” Undignified, which is the idea.** — sets `{"mv-db-oolong-word":"oink"}`
    - **Bulma**: Oink. Oink oink.
    - **Oolong**: STOP SAYING IT TWICE!
- **“Bathtime.” He’ll never hear it coming.** — sets `{"mv-db-oolong-word":"bathtime"}`
    - **Bulma**: Bathtime!
    - Oolong vanishes. Your Nubbin, who loves baths, looks around hopefully for a bath.

### Complete

#### <a id="mv-db02-complete"></a>Complete `mv-db02-complete`

_The girls go home, a little sorry to leave the cake trolley. The village cheers, and the elder gives you the cabbages anyway._  
**Village Elder** _(angry)_: One thing. Before he rides off as anybody’s car, the pig knocks on every door he frightened, and says sorry.  
_Oolong does. Most doors stay shut. One opens a crack and hands him a cabbage, which very nearly finishes him off._  
**Bulma**: And you, mister, are coming with us. You can turn into a car. We need a car.  
**Oolong** _(angry)_: That’s slavery! That’s… actually, do you have snacks? No? Then it’s definitely slavery.  
**Goku** _(happy)_: He’s nice. He smells like a pig.  
**Oolong**: I AM a pig!  
_Oolong sulks all the way back to the bike. Your Nubbin walks beside him, which he pretends not to like._  

**Rewards**

- Very Good Cabbage (item): A gift from a grateful village. Feeds a Nubbin like three fruits and makes it slightly smug.
- Monster Sitter (title): For the Nubbin that sat on Oolong’s tail through five minutes of shapes.

Sets on completion: `{"mv-db02":true}`

**Notes:** Oolong joins the party until DB5. The trigger word is the player’s choice (`mv-db-oolong-word`), and Bulma uses that word in DB3–DB5 whenever the script says “the word”; implementer swaps it in (piggy / oink / bathtime). The source’s pill gag is kept off-screen: Oolong runs out of frame, a door slams, done. No toilet visuals. Shapeshift bout: three rounds, each a different Oolong form (bull-demon, bat, rocket), each shorter; the round timer is the five-minute limit compressed. The village girl’s name Pochawompa is from the source. `mv-db-oolong-plan` gains `nubbin` (added in review); Goku still wears the dress. Chapters checked from memory: ch. 3–4 (1984).

## DB3. Yamcha and Puar

*Dragon Ball, chapters 5–7 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB2, Oolong · requires: DB2

**Cast:** Goku (Son Goku (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Oolong (Oolong, the shapeshifting pig (Dragon Ball)), Yamcha (Yamcha, the desert bandit (Dragon Ball)), Puar (Puar, Yamcha’s shapeshifting cat (Dragon Ball))

### Step 1: Cross the Diablo Desert with Bulma’s party.

Hint: An expedition. Water matters more than speed. Oolong will complain whatever you pick. · check: `expedition:complete:mv-diablo-desert`

#### <a id="mv-db03-desert"></a>Scene `mv-db03-desert`

_The radar points straight across a desert. Oolong turns into a car to carry everyone: a very small car._  
**Oolong** _(sad)_: Nobody said anything about deserts. My bumper’s melting.  
**Bulma**: You could turn into a bigger car.  
**Oolong**: I could turn into a lot of things. I choose to suffer.  
_Far off, on a rock, someone is watching through a spyglass. Beside him floats a small blue cat with a curly tail._  
**Puar**: Lord Yamcha, they’ve got capsules. A capsule case and a radar thing. That’s a rich girl, that is.  
**Yamcha** _(happy)_: Then tonight we eat well, Puar. Desert bandit rule one: never rob anybody who looks poor.  
_Oolong hears the cat’s voice on the wind and goes white under his paint._  
**Oolong** _(shock)_: I know that voice. Shapeshifting school. That’s Puar. Where Puar is, there’s a bandit.  

**Choices**

- **Ration the water. Small sips, everybody, the car included.** — sets `{"mv-db-desert":"ration"}`
    - **Oolong**: Small sips! For the car! I have a radiator now, you know. It is very thirsty and very hot.
    - Your Nubbins pour their own sip over the bonnet. The bonnet goes quiet, and pretends it wasn’t touched.
- **Floor it. Get out of the sun faster.** — sets `{"mv-db-desert":"floor-it"}`
    - Bulma floors it. You cover a mile in four minutes and fifty-nine seconds, and then there is a pop.
    - **Oolong**: FIVE MINUTES! I TOLD you about the five minutes!
    - Everyone is sitting on a pig in the middle of a dune. Bulma gets out a capsule car of her own, sighing.

### Step 2: Hold off Yamcha in the desert duel.

Hint: A karate bout you can’t lose outright: stay standing for three rounds. Something will stop him. · check: `karate:finish:mv-yamcha-duel`

#### <a id="mv-db03-duel"></a>Scene `mv-db03-duel`

_At sunset a man in a green sash steps out of the rocks, a curved sword on his shoulder._  
**Yamcha**: Evening. I’m Yamcha, terror of the desert. Leave the capsules, the food and the car. The pig can keep his dignity.  
**Oolong** _(angry)_: I’m the car!  
**Goku** _(happy)_: You want a fight? I like fights.  
_They go at it, Yamcha fast and good, Goku faster and stranger. Neither lands a clean blow._  
**Yamcha** _(think)_: Huh. You’re a kid. Kids aren’t supposed to do that.  
_Bulma climbs out of the car to shout at both of them. Yamcha turns, sees her, and goes as red as a pepper._  
**Yamcha** _(shock)_: A… a g-girl. There’s a girl. Puar, there’s a girl right there.  
**Puar**: He can’t talk to girls. It’s a whole thing. Please don’t tell anybody.  

**Choices**

- **Tell Yamcha it’s all right. She doesn’t bite.** — sets `{"mv-db-yamcha":"kind"}`
    - **Bulma**: I absolutely do bite.
    - Yamcha makes a noise like a kettle and retreats into the rocks backwards, still facing her, still crimson.
- **Tell Goku to press the advantage.** — sets `{"mv-db-yamcha":"pressed"}`
    - **Goku**: Nah. He’s gone all wobbly. That’s not a real fight.
    - Yamcha seizes the gift and flees, with Puar flapping after him.

#### <a id="mv-db03-duel-done"></a>Done `mv-db03-duel-done`

**Yamcha**: This isn’t over! I’ll be back! Once I’ve had a lie down!  
**Goku** _(happy)_: He was good. I hope he comes back.  

### Step 3: Catch Puar sneaking around your camp.

Hint: Leave your Nubbin on watch. Puar can turn into anything, but Puar is still a cat, and cats come for fish. · check: `talk:puar`

#### <a id="mv-db03-camp"></a>Scene `mv-db03-camp`

_Bulma pops a capsule house open for the night. In the dark, something small and blue moves among the rocks._  
_Your Nubbin leaves the last of Goku’s fish on the doorstep. Within a minute a cat is eating it._  
**Puar**: …Oh. Hello. I’m not here. I’m a rock. Grr. Rock noises.  
**Puar**: Lord Yamcha wants those balls. He’s going to wish he could talk to girls. Then he can get married and settle down.  
**You**: He could just practise talking to girls.  
**Puar** _(sad)_: He tried. He practised on a cactus. It went badly.  
**Puar**: So we’re going to follow you, and when you’ve got all seven, we’ll take them. Sorry. Nothing personal. Lovely fish.  
_Puar pats your Nubbin on the head, turns into a bat, and flaps off into the night._  

### Complete

#### <a id="mv-db03-complete"></a>Complete `mv-db03-complete`

_In the morning, a cloud of dust follows the car at a careful distance. It stops when you stop and starts when you start._  
**Bulma** _(happy)_: We’re being tailed by a bandit who faints when I look at him. I’ve had worse admirers.  
**Oolong**: He’s going to rob us. Is no one else bothered he’s going to rob us?  
**Goku** _(happy)_: I want a rematch. I’ll leave Bulma behind so he doesn’t go wobbly.  
**Bulma**: You will do no such thing. Leave me behind. Honestly.  
_Your Nubbin waves at the dust cloud. After a long pause, a small blue paw waves back._  

**Rewards**

- Bandit Sash (cosmetic): A green desert sash like Yamcha’s. Wearable by any Nubbin; makes it look much tougher than it is.
- Fish on a Doorstep (decor): A small plate with one fish on it, for the Grove. Visiting cats sometimes appear beside it.

Sets on completion: `{"mv-db03":true}`

**Notes:** Yamcha and Puar tail the party through DB4 and join openly in DB5. The duel is a three-round survival bout: the karate result screen should read “Interrupted (girl)” rather than win or loss. Yamcha’s shyness is played for comedy only; he is never mean to Bulma. Puar went to the same shapeshifting school as Oolong; Oolong is terrified of her. Desert: Diablo Desert, rock spires, capsule house at night. `mv-db-desert` (ration/floor-it, added in review) is cosmetic; floor-it pays off Oolong’s five-minute limit from DB2. Chapters checked from memory: ch. 5–7 (1985).

## DB4. Fire Mountain

*Dragon Ball, chapters 8–11 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB3, Yamcha and Puar · requires: DB3

**Cast:** Goku (Son Goku (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Oolong (Oolong, the shapeshifting pig (Dragon Ball)), Turtle (Umigame, Roshi’s sea turtle (Dragon Ball)), Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Chi-Chi (Chi-Chi, the Ox-King’s daughter (Dragon Ball)), The Ox-King (Gyū-Maō, the Ox-King (Dragon Ball))

### Step 1: Carry the lost turtle back to the sea.

Hint: An expedition with a heavy, slow passenger. A Power Nubbin helps; a patient one helps more. · check: `expedition:complete:mv-turtle-to-sea`

#### <a id="mv-db04-turtle"></a>Scene `mv-db04-turtle`

_In a forest a long way from any coast, a sea turtle sits in the road looking extremely out of place._  
**Turtle** _(sad)_: Excuse me. I went looking for mushrooms and lost the sea. Have you seen it? It’s large and wet.  
**Goku** _(happy)_: We’ll take you! Is it far? It doesn’t matter. I’m strong.  
**Bulma**: We are on a schedule, Goku. A Dragon Ball schedule.  
**Goku**: He’s lost, though.  
_Goku hoists the turtle onto his back. Your Nubbin rides on the turtle’s shell, steering by its ears._  
**Turtle**: You are a kind boy. My master will want to thank you. He is old, and wise, and mostly very strange.  
**Oolong**: Strange how? Rich strange? I can work with rich strange.  

#### <a id="mv-db04-turtle-done"></a>Done `mv-db04-turtle-done`

_At the shore the turtle swims out, and comes back with a tiny old man on its shell. He has a beard, sunglasses and a stick._  
**Master Roshi** _(happy)_: I am the Turtle Hermit. People call me Master Roshi. Thank you for my turtle. I am fond of him. He makes the tea.  

### Step 2: Try to ride the Flying Nimbus.

Hint: Only the pure of heart can sit on the cloud. Your Nubbins can. You might not. Try anyway. · check: `ride:mv-flying-nimbus`

#### <a id="mv-db04-nimbus"></a>Scene `mv-db04-nimbus`

**Master Roshi**: A gift for the boy. Nimbus! Come here!  
_A small yellow cloud swoops down out of a clear sky and stops at knee height, bobbing, like a dog waiting for a walk._  
**Master Roshi** _(happy)_: The Flying Nimbus. It carries only those with a pure heart. Watch. I shall demonstrate.  
_Roshi hops on. He drops straight through it and lands on his bottom in the sand._  
**Master Roshi**: As I suspected. A demonstration of what not to be.  
_Goku sits on it and it zips him round the beach, your Nubbins clinging on behind. The cloud doesn’t even dip._  
**Bulma**: Oh, I want a go. And while you’re handing out presents, old man, I hear you have a Dragon Ball.  
**Master Roshi** _(happy)_: I do. I might part with it. For a little peek at a pair of pretty knickers.  
_Bulma considers this for about half a second, turns her back to everyone else, and lifts her hem for him. Roshi’s nose bleeds._  
**Bulma** _(angry)_: Ball. Now. And none of you saw anything.  

**Choices**

- **Climb onto Nimbus yourself.** — sets `{"mv-db-nimbus-keeper":"fell"}`
    - You sit, and for one hopeful moment you hover. Then you drop through and land beside Roshi.
    - **Master Roshi**: Welcome. It’s nice down here. Very honest.
- **Leave the cloud to the Nubbins. You know your own heart.** — sets `{"mv-db-nimbus-keeper":"declined"}`
    - Your Nubbins look at you, then at the cloud, then back. One of them pats the empty space beside it.
    - **Goku**: It’d let you, maybe. Probably not. Maybe!

### Step 3: Put out the fire on Fire Mountain and learn the Kamehameha.

Hint: A karate lesson: copy Roshi’s stance three times. On the third, your Nubbins unleash the move for real. · check: `karate:learn:kamehameha`

#### <a id="mv-db04-fire"></a>Scene `mv-db04-fire`

_The radar points into a mountain wrapped in flame. Through the smoke comes a girl in armour with a bladed helmet._  
**Chi-Chi** _(angry)_: Who are you? Are you bandits? I’m Chi-Chi, and I’ve beaten up eleven bandits this month.  
**Goku**: I’m Goku. Are you a girl? You look like Bulma, but pointier.  
**Chi-Chi** _(soft)_: …You’re nice. Nobody’s nice. Will you marry me? Papa says I have to marry someone strong.  
**Goku** _(happy)_: Sure! Is marry a kind of food?  
_Her father, the Ox-King, is a giant with an axe sitting outside his burning castle, weeping into a bucket._  
**The Ox-King** _(sad)_: My castle, my treasure, my Dragon Ball, all in that fire. Only Master Roshi’s fan could put it out.  
_Roshi arrives on his turtle. The fan, it turns out, was used as a tray and thrown away years ago._  
**Master Roshi**: Ah. Then I’ll have to do it the loud way. Stand back. Further. Further than that.  
_He crouches, cups his hands at his hip, and gathers something blue and bright between his palms._  
**Master Roshi** _(angry)_: Ka… me… ha… me… HA!  
_The beam puts out the fire, and also the castle and most of the mountain. Roshi coughs politely._  

#### <a id="mv-db04-fire-done"></a>Done `mv-db04-fire-done`

_Goku copies it on his very first try and blows up Bulma’s car. Your Nubbins copy it on their third and blow up a bush._  
**Master Roshi** _(shock)_: Fifty years it took me. Fifty years. And a monkey boy and two dumplings do it before lunch.  

### Complete

#### <a id="mv-db04-complete"></a>Complete `mv-db04-complete`

_In the ashes of the castle, a Dragon Ball glows. The Ox-King hands it over with tears in his beard._  
**The Ox-King**: Take it. You put out my fire. Well, Roshi did. With my castle. But you were here, and that counts.  
**Bulma** _(happy)_: Five! Five Dragon Balls. Pilaf, whoever you are, eat your heart out.  
**Chi-Chi** _(soft)_: Goku. You promised. When you’re grown, you’ll come back and marry me.  
**Goku** _(happy)_: Yep! Bye, Chi-Chi!  
_He waves from Nimbus with no idea what he just said. Chi-Chi knows, and will remember._  
_Your Nubbins land beside you, still crackling faintly blue at the paws._  

**Rewards**

- Kamehameha (feature): A new karate move for Nubbins: a charged two-paw beam. Long wind-up, huge push. Learned from Master Roshi and Goku.
- Nimbus Passenger (feature): In the Dragon Ball line, your Nubbins can ride Nimbus with Goku. Flying it alone comes later.
- Turtle’s Mushroom Basket (decor): A thank-you from Roshi’s turtle. Grows a mushroom in the Grove every few days.

Sets on completion: `{"mv-db04":true,"mv-db-radar":5,"mv-db-chichi-promise":true}`

**Notes:** Teaches the Kamehameha karate move (brief requirement). Karate lesson check `karate:learn:kamehameha`: three stance-copy prompts; on the third, the move fires for real and is added to the Nubbin’s move list. Use the move name, but the chant on screen is Roshi’s only, once, broken into syllables. Roshi’s peek gag is kept mild and off-camera: Bulma has her back to the camera, cut to Roshi’s nosebleed, nothing shown. Nimbus: Nubbins ride; the Keeper falls through if they try (`mv-db-nimbus-keeper`). Goku’s marriage promise (`mv-db-chichi-promise`) pays off in DB20. In the source the Ox-King’s treasure and a Dragon Ball are in the burning castle; Bulma ends with five, Pilaf’s gang holds the rest. Chapters checked from memory: ch. 8–11 (1985).

## DB5. Pilaf’s Wish

*Dragon Ball, chapters 12–23 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB4, Fire Mountain · requires: DB4

**Cast:** Goku (Son Goku (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Oolong (Oolong, the shapeshifting pig (Dragon Ball)), Yamcha (Yamcha, the desert bandit (Dragon Ball)), Puar (Puar, Yamcha’s shapeshifting cat (Dragon Ball)), Emperor Pilaf (Emperor Pilaf (Dragon Ball)), Mai (Mai, Pilaf’s henchwoman (Dragon Ball)), Shu (Shu, Pilaf’s dog-ninja henchman (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball))

### Step 1: Follow Pilaf’s gang back to his castle.

Hint: An expedition by night. Puar can turn into a bat to scout; let her. · check: `expedition:complete:mv-pilaf-castle`

#### <a id="mv-db05-ambush"></a>Scene `mv-db05-ambush`

_A tank rolls up to your camp at midnight. On top stand a woman with a pistol and a short dog in a ninja suit._  
**Mai**: Good evening. We represent Emperor Pilaf. He’d like your Dragon Balls. All of them. Thank you so much.  
**Shu**: And if you say no, we say please again, but louder.  
_They grab the bag in the confusion and drive off. Bulma counts what’s left, and there is nothing left._  
**Bulma** _(angry)_: My balls! My five beautiful balls!  
_From the rocks, Yamcha and Puar step out. Yamcha keeps his eyes firmly on Goku’s ear._  
**Yamcha**: We know where they’re going. Pilaf’s castle. We’ve been following you. And them. We’re very thorough.  
**Puar**: We’ll help you get them back. Then we’ll fight you for them. Fairly. Probably.  
**Goku** _(happy)_: Yay! A team!  

### Step 2: Stop Emperor Pilaf from making his wish.

Hint: A race against the summoning: get Oolong out of the cell before Pilaf finishes speaking. Your Nubbin can fit through the grate. · check: `race:finish:mv-pilaf-summoning`

#### <a id="mv-db05-summoning"></a>Scene `mv-db05-summoning`

_Pilaf’s castle is all traps, and you fall through three of them. The third drops everyone into a cell with one barred window._  
**Emperor Pilaf** _(happy)_: Ha! Ha! Behold, you peasants! All seven balls are mine! I am about to become ruler of the world!  
_He is very small and very blue, and his cape is too long. Mai holds the end of it so he won’t trip._  
**Emperor Pilaf**: Eternal Dragon, I summon you! Rise! Rise now! Please rise.  
_The sky goes black. Out of the seven balls pours an enormous green dragon, coiled up into the clouds._  
**Shenron**: You have gathered the seven. Speak your wish, and speak it soon. I am not a patient dragon.  
**Emperor Pilaf**: I wish… ahem. Mai, the speech. Where is my speech?  
_Oolong squeezes through the bars as a bat, your Nubbin shoving from behind. He pops out and flaps for the window._  
**Oolong** _(shock)_: What do I wish for? What do I say? Somebody tell me what to say!  

**Choices**

- **Shout: “Anything! Just wish something stupid!”** — sets `{"mv-db-pilaf-wish":"anything"}`
    - **Oolong**: Something stupid! Right! Dragon! Give me the finest pair of ladies’ knickers in the world!
    - **Shenron**: Granted. That was easy.
- **Shout: “Wish for what you really want!”** — sets `{"mv-db-pilaf-wish":"heart"}`
    - **Oolong**: What I really want… Dragon! Give me the finest pair of ladies’ knickers in the world!
    - Everybody turns to look at you. You did tell him to be honest.
- **Shout: “Snacks! Wish for snacks! You love snacks!”** — sets `{"mv-db-pilaf-wish":"snacks"}`
    - **Oolong**: Snacks! Yes! Dragon, give me a lifetime of… the finest… ladies’ knickers? Why did I say that?
    - **Shenron**: Granted. No refunds.
    - His mouth and his brain have clearly never been introduced.

#### <a id="mv-db05-summoning-done"></a>Done `mv-db05-summoning-done`

_A pair of frilly knickers floats down from the sky into Pilaf’s outstretched hands. The dragon is gone._  
_The seven balls rise into the air, turn to grey stone, and shoot off to the far corners of the world._  
**Emperor Pilaf** _(sad)_: My… world… domination…  
**Yamcha** _(sad)_: My wish… my wish was to talk to girls.  

### Step 3: Survive the full moon.

Hint: A survival bout against a giant ape. You can’t win it. Dodge until someone cuts his tail. · check: `karate:survive:mv-great-ape`

#### <a id="mv-db05-moon"></a>Scene `mv-db05-moon`

**Emperor Pilaf** _(angry)_: Very well. You will all dry out in the sun tomorrow. Mai, open the roof. Let the sun in. In the morning.  
_Mai opens the roof now, by mistake. The full moon looks down into the cell._  
_Goku looks up at it and stops talking. His eyes turn red, and he starts to grow._  
**Bulma** _(shock)_: Goku? Goku. This is not a good time to have a growth spurt.  
_He becomes a giant ape. The cell bursts, then the wall, then most of the castle._  
**Puar**: His tail! It’s the moon and the tail! Cut the tail and he’ll stop!  
**Yamcha**: With what? I lost my sword in a trap!  
**Puar**: With me, Lord Yamcha!  
_Puar turns into a giant pair of scissors. Your Nubbins dart between the ape’s feet to keep his eyes off Yamcha._  

#### <a id="mv-db05-moon-done"></a>Done `mv-db05-moon-done`

_Snip. The ape shrinks, and shrinks, and there is Goku, asleep in the rubble, tail-less and wearing nothing at all._  
**Bulma**: Somebody find that boy some trousers.  

### Complete

#### <a id="mv-db05-complete"></a>Complete `mv-db05-complete`

**Goku** _(shock)_: Where’s my tail? Where’s the castle? Why’s it so draughty?  
**Bulma**: Long story. The short version is, you ate a castle and the pig wished for knickers.  
**Oolong** _(angry)_: I panicked! Under pressure, a man reaches for what he knows!  
_The balls will be stone for a year. Bulma shrugs, then goes pink when Yamcha manages a whole sentence to her._  
**Yamcha** _(soft)_: Bulma. Would you… would you like to come to West City? With me? I can probably keep talking. Probably.  
**Bulma** _(happy)_: Took you long enough, terror of the desert.  
**Goku** _(happy)_: I’m going to find that old turtle man. I want to learn to fight like him.  
_Goku flies off on Nimbus. Your Nubbins ride on his back, waving at a bandit who is finally, terribly, in love._  

**Rewards**

- Puar-Shaped Scissors (decor): A giant pair of decorative scissors with a curly tail. Leans on a Grove wall. Nubbins keep well away from it.
- Moon Dodger (title): For the Nubbins that ran between a giant ape’s feet and lived.

Sets on completion: `{"mv-db05":true,"mv-db-radar":0,"mv-db-tail":"cut"}`

**Notes:** The first wish of the series is spent by Oolong here; the radar counter `mv-db-radar` drops to 0. This hunt is not one of the line’s two sets. Oolong’s wish is mild and comic: a single pair of frilly knickers floating down, no one wearing anything. Goku waking without clothes after the ape transformation: back view only, cut to Bulma throwing a towel. Great Ape survival bout: three rounds, the ape cannot be damaged; it ends when Puar (as scissors) cuts the tail. `mv-db-pilaf-wish` gains `snacks` (added in review): whatever the Keeper shouts, Oolong wishes for the knickers. Shenron here is the dragon’s first appearance; he is gruff, short and in a hurry, never the source’s lines. Yamcha and Bulma become a couple; Oolong goes with them; Goku goes to Roshi. Chapters checked from memory: ch. 12–23 (1985).

## DB6. Turtle School

*Dragon Ball, chapters 24–27 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB5, Pilaf’s Wish · requires: DB5

**Cast:** Goku (Son Goku (Dragon Ball)), Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Krillin (Krillin (Dragon Ball)), Lunch (Lunch (Launch in some English versions), both her sweet and her blonde selves (Dragon Ball)), Turtle (Umigame, Roshi’s sea turtle (Dragon Ball))

### Step 1: Meet Roshi’s other new student, and find the old man a housekeeper.

Hint: Talk to Krillin on the beach. Then take Nimbus out looking for someone willing to keep house on an island. · check: `talk:krillin`

#### <a id="mv-db06-island"></a>Scene `mv-db06-island`

_Roshi’s island is a pink house, one palm tree and a lot of sea. Waiting on the doorstep is a bald boy with six dots on his forehead._  
**Krillin** _(happy)_: I’m Krillin. From Orin Temple. I’ve brought Master Roshi a present, so he’ll take me. A very grown-up magazine.  
**Goku** _(happy)_: I brought him me.  
**Krillin** _(sad)_: That’s… not a present. Is he going to like you better? He’s going to like you better, isn’t he?  
**Master Roshi** _(happy)_: I will take you both. On one condition. This house needs a lady in it. A pretty one. To cook. And be pretty.  
**Turtle**: He means a housekeeper. He also means the other thing. I make the tea anyway.  
_Goku and Krillin take Nimbus out, and Krillin falls through it. He rides the turtle with your Nubbins instead, sulking._  
_In a town on the coast, a dark-haired girl is being chased by police. She is sweet, polite and very confused about why._  
**Lunch** _(happy)_: Oh, hello! Are you police too? They keep saying I robbed a bank. I don’t think I’d do that. I’m almost sure.  

**Choices**

- **Tell her plainly what the old man wants.** — sets `{"mv-db-lunch":"warned"}`
    - **Lunch**: A nice old man who wants a cook? How lovely. I love cooking. I’ll keep my eye on him.
    - She has no idea, and it doesn’t matter. She is about to have the upper hand.
- **Just get her off the street before the police arrive.** — sets `{"mv-db-lunch":"rescued"}`
    - You haul her onto the turtle. A pepper pot rolls off a café table, and she sneezes.
    - Her hair goes blonde and her eyes narrow. She pulls a machine gun out of nowhere you can see.

#### <a id="mv-db06-island-done"></a>Done `mv-db06-island-done`

_Back on the island, Lunch sneezes and Blonde Lunch shoots holes in the kitchen. She sneezes again and makes tea._  
**Master Roshi** _(happy)_: Two of her. Excellent value.  
_Roshi tries one cheeky look at Blonde Lunch. She shoots the end off his walking stick. He does not try twice._  

### Step 2: Run the morning milk round with Goku and Krillin.

Hint: A long race with a turtle shell on your back. Pace yourselves; nobody finishes the first one fast. · check: `race:finish:mv-milk-round`

#### <a id="mv-db06-milk"></a>Scene `mv-db06-milk`

**Master Roshi**: Training begins today. Wear these.  
_He hands out turtle shells, each about as heavy as the boy wearing it. Your Nubbins get small ones, still heavy._  
**Krillin** _(happy)_: When do we learn the fireball? The secret palm thing? The flying kick?  
**Master Roshi**: Today you deliver milk. Then you dig a field with your hands. Then you swim. Then you eat. Then you study. Then you sleep.  
**Goku** _(happy)_: That’s it? That sounds fun!  
**Krillin**: That doesn’t sound like martial arts. That sounds like a farm.  
**Master Roshi**: The farm will make you strong. The study will make you smart. The sleep will make you nice to be around. Go.  
_Out across the islands, up hills, down stairs, a bottle at every door. Goku and Krillin run; Roshi rides a scooter._  
_Halfway round, Krillin finds a shortcut through a hedge. Roshi is waiting at the far end of it, eating an ice lolly._  
**Master Roshi**: Every student finds the hedge. That is lesson two. Lesson one is that I am always at the end of the hedge.  

#### <a id="mv-db06-milk-done"></a>Done `mv-db06-milk-done`

_By the last house your Nubbins are carrying the empty bottles in their mouths. Krillin is carried home by Goku._  
**Krillin** _(sad)_: I’m fine. I just want to lie in the road for a moment.  

### Step 3: Swim the shark lake.

Hint: A Swim expedition. The shark only gets the slowest swimmer, so do not be the slowest swimmer. · check: `expedition:complete:mv-shark-lake:swim`

#### <a id="mv-db06-sharks"></a>Scene `mv-db06-sharks`

_After the field, after lunch, Roshi leads everyone to a lake. It is calm, green and lovely._  
**Master Roshi**: Ten laps. There is one shark. He is generally reasonable. Generally.  
**Krillin** _(shock)_: There’s a shark in a lake? How did a shark get into a lake?  
**Master Roshi**: Same way you got onto this island. Ambition.  
_Your Swim Nubbin dives in first. It has always wanted to meet a shark, and it is about to get its wish._  
**Goku** _(happy)_: Race you to the far side, Krillin! Last one there is shark lunch!  
**Krillin**: That is not how you motivate people!  
_A grey fin rises in the middle of the lake and turns, slowly, towards the splashing._  

#### <a id="mv-db06-sharks-done"></a>Done `mv-db06-sharks-done`

_Nobody gets eaten. Your Swim Nubbin comes out last, because it stopped to bump noses with the shark._  
**Master Roshi** _(happy)_: Eight months of this, and you’ll be ready for the World Martial Arts Tournament.  

### Complete

#### <a id="mv-db06-complete"></a>Complete `mv-db06-complete`

_The months go by in milk bottles and blisters. Krillin stops crying in the field, and Goku stops noticing the shell._  
**Krillin** _(soft)_: Goku. I’m sorry I was rotten to you when I came. I thought there was only room for one.  
**Goku** _(happy)_: There’s loads of room. It’s a whole island!  
_Lunch makes curry and Blonde Lunch makes threats. Both are delicious, in their way._  
**Master Roshi**: Take off the shells. Go on. Jump.  
_Goku jumps clean over the house, Krillin over the palm tree. Your Nubbins jump onto the roof and refuse to come down._  

**Rewards**

- Training Shell (cosmetic): A small weighted turtle shell. Wearable by any Nubbin. Purely for show; it weighs nothing in the Grove.
- Turtle School Student (title): For Nubbins who did the milk round, the field and the shark lake under Master Roshi.
- Milk Crate (decor): A crate of empty milk bottles for the Grove doorstep. Fills itself in the morning.

Sets on completion: `{"mv-db06":true}`

**Notes:** Lunch: sneezes switch her between sweet (dark hair) and violent (blonde) selves; show the sneeze, then swap the sprite. Her gun is cartoonish and nobody is hit. Roshi’s “grown-up magazine” from Krillin is never shown, only the brown paper wrapper. His interest in a “pretty housekeeper” stays a line and a turtle’s sigh. Training montage: milk round (long race), field-digging (skip, mention), shark lake (Swim expedition). Krillin is from Orin Temple. The hedge shortcut and Blonde Lunch shooting the end off Roshi’s stick are ours (cartoon gunfire, nobody hit). Chapters checked from memory: ch. 24–27 (1985).

## DB7. The 21st Budokai

*Dragon Ball, chapters 28–53 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB6, Turtle School · requires: DB6

**Cast:** Goku (Son Goku (Dragon Ball)), Krillin (Krillin (Dragon Ball)), The Announcer (The World Martial Arts Tournament announcer (Dragon Ball)), Jackie Chun (Master Roshi in disguise as Jackie Chun (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Nam (Nam, the fighter from a drought-struck village (Dragon Ball, 21st Tournament))

### Step 1: Get Goku and Krillin through the preliminaries.

Hint: Four quick karate bouts. Ring-out counts; be clever at the edge. · check: `karate:win:mv-21st-prelims`

#### <a id="mv-db07-prelims"></a>Scene `mv-db07-prelims`

_Papaya Island. The World Martial Arts Tournament fills a stone temple with fighters, food stalls and shouting._  
**The Announcer**: Welcome, welcome! One hundred and thirty-eight hopefuls! Eight places in the final round! Fight well and don’t die!  
**Krillin** _(sad)_: I’m going to lose in the first round. I can feel it in my knees.  
**Goku** _(happy)_: You did the milk. You did the sharks. You can do people.  
_Your Nubbins are entered as Goku’s and Krillin’s seconds. They carry towels, water, and opinions._  
_An old man in a hat and dark glasses, calling himself Jackie Chun, is in the bracket too. He smells faintly of turtle._  
**Jackie Chun** _(happy)_: Hello, young men. You look very well trained. Somebody must have worked you very hard.  
**Krillin** _(think)_: He knows us. Why does he know us?  
**Goku** _(happy)_: I like him. He talks like Master Roshi.  

**Choices**

- **Stand in Krillin’s corner.** — sets `{"mv-db-21st-corner":"krillin"}`
    - Krillin wins his first bout in nine seconds. He looks at his own fists as if someone has swapped them.
    - **Krillin**: Did you see? Did you see that? Tell Goku. No, tell everyone.
- **Stand in Goku’s corner.** — sets `{"mv-db-21st-corner":"goku"}`
    - Goku wins his first bout by jumping so high the referee loses sight of him. He lands on the other fighter, and that counts.
    - **Goku**: Is that it? Can I go again?

### Step 2: Get Goku and Krillin through the quarter-finals and the semi-finals.

Hint: Two karate bouts back to back. Against the smelly one, don’t breathe in; against Nam, watch the sky. · check: `karate:win:mv-21st-main-rounds`

#### <a id="mv-db07-rounds"></a>Scene `mv-db07-rounds`

_The final eight draw lots from a box. Krillin draws Bacterian, a mountain of a man who has proudly never had a bath._  
**Krillin** _(shock)_: He’s breathing on me. Goku, he’s breathing on me on purpose. My eyes are melting.  
**Goku** _(happy)_: Krillin! You haven’t got a nose! How can you smell him?  
_Krillin stops. He touches the middle of his face. There is, now he thinks about it, nothing there._  
**Krillin** _(happy)_: …I haven’t got a nose.  
_He wins in a hurry, and returns the smell in the least dignified way known to martial arts. The front row moves back three rows._  
_Goku gets glued to the tiles by a winged giant’s chewing gum, and gets out of it by being far too stubborn to stay stuck._  
_Behind the arena, at the fountain, Goku’s semi-final opponent is filling a gourd: a tall, quiet fighter in a turban._  
_He drinks none of it. He corks it and packs it away carefully, the way other people pack money._  
**Nam** _(soft)_: I am Nam. My village has had no rain for three years. The prize would buy water for all of it.  
**Nam**: I am sorry. Your friend is a good boy. I must beat him anyway.  

**Choices**

- **Tell Goku about Nam’s village before the bout.** — sets `{"mv-db-nam":"told"}`
    - **Goku**: Then he should fight his hardest, and so should I. Otherwise it doesn’t count for either of us.
    - **Nam**: …Yes. If I won by pity, I could not drink the water.
- **Keep it from Goku. Let the bout be clean.** — sets `{"mv-db-nam":"kept"}`
    - You keep it to yourself. It sits in your stomach like a stone all the way through the bout.
    - Your Nubbins, who heard everything, top up Nam’s gourd from the fountain while he isn’t looking.

#### <a id="mv-db07-rounds-done"></a>Done `mv-db07-rounds-done`

_Nam leaps so high he vanishes into the sun, and drops like a hammer. Goku sidesteps at the last possible instant._  
_One chop, and Nam folds up on the tiles. Goku helps him up before the referee has finished counting._  
**Nam** _(soft)_: You are a strange child. Thank you for not holding back.  
_In the other semi, Jackie Chun beats Krillin while apologising the whole way through, and meaning it._  

### Step 3: Watch the final: Goku against Jackie Chun.

Hint: A full karate final. You may lose it. The bout is what matters. · check: `karate:finish:mv-jackie-chun`

#### <a id="mv-db07-final"></a>Scene `mv-db07-final`

_The final is the boy and the old man. The whole island crams into the stands; even the seagulls have found seats._  
**The Announcer**: Ladies and gentlemen, the final! The youngest fighter in years, against a grandfather who moves like a breeze!  
**Jackie Chun**: Come, Goku. Show me all of it.  
_Goku shows him all of it, and the old man dodges most of it. Then Goku has to start dodging the old man’s blows._  
_A palm strike sends Goku flying out past the edge of the ring. He twists in the air, fires a Kamehameha behind him, and rockets back._  
**Jackie Chun** _(shock)_: He used it to fly? Nobody taught him that. Nobody taught ME that!  
_Your Nubbins, in Goku’s corner, try the same trick off the edge of the bench. They mostly blow up a towel._  
_Night falls and the full moon rises over the arena. Goku’s tail, grown back over the year, twitches._  
**Bulma** _(shock)_: Oh no. Oh no, not the tail. I knew that tail was trouble.  
_Goku grows. The arena lights go out under a giant ape’s fur._  
**Jackie Chun** _(think)_: Well. Nobody can say I didn’t prepare for everything.  
_Jackie Chun cups his hands at his hip as blue light gathers. He aims, not at the ape, but up._  

#### <a id="mv-db07-final-done"></a>Done `mv-db07-final-done`

_The beam goes up through the clouds, and the moon is no longer in the sky. Some pieces of it may be on their way down._  
_Goku shrinks, gets dressed in a borrowed tablecloth, and loses the final by a single kick and a hair’s breadth._  

### Complete

#### <a id="mv-db07-complete"></a>Complete `mv-db07-complete`

**The Announcer**: Your winner and champion: Jackie Chun!  
**Goku** _(happy)_: That was the best fight ever! Can we do it again next time?  
**Jackie Chun** _(soft)_: Next time, boy, you will win. I am counting on it.  
_Jackie Chun slips away. A few minutes later Master Roshi appears from behind the same wall, wearing the same shoes._  
**Krillin** _(think)_: Master. Were you Jackie Chun?  
**Master Roshi** _(happy)_: Jackie who? Never heard of him. Excellent fighter. Very handsome.  
_Roshi’s prize pays for dinner, and Goku eats most of it. What is left goes in an envelope addressed to Nam’s village._  
**Bulma**: Goku, here. A radar, all yours. The balls are active again. Go find your grandpa’s four-star.  
_Your Nubbin checks Bulma’s hands, the way it has since the hut. No fingers crossed this time._  
_Goku takes the radar and Nimbus and heads off alone. Your Nubbins, of course, go with him._  

#### <a id="mv-db07-complete-deal-truth"></a>Variant `mv-db07-complete-deal-truth`

_Variant of `mv-db07-complete`._

**The Announcer**: Your winner and champion: Jackie Chun!  
**Goku** _(happy)_: That was the best fight ever! Can we do it again next time?  
**Jackie Chun** _(soft)_: Next time, boy, you will win. I am counting on it.  
_Jackie Chun slips away. A few minutes later Master Roshi appears from behind the same wall, wearing the same shoes._  
**Krillin** _(think)_: Master. Were you Jackie Chun?  
**Master Roshi** _(happy)_: Jackie who? Never heard of him. Excellent fighter. Very handsome.  
_Roshi’s prize pays for dinner, and Goku eats most of it. What is left goes in an envelope addressed to Nam’s village._  
**Bulma**: Goku, here. A radar, all yours. I said I’d borrow the ball once, and I did. Deal’s done. Go find your grandpa’s four-star.  
_Your Nubbin checks Bulma’s hands anyway, from habit. Nothing crossed, and it looks almost disappointed._  
_Goku takes the radar and Nimbus and heads off alone. Your Nubbins, of course, go with him._  

#### <a id="mv-db07-complete-deal-pitch"></a>Variant `mv-db07-complete-deal-pitch`

_Variant of `mv-db07-complete`._

**The Announcer**: Your winner and champion: Jackie Chun!  
**Goku** _(happy)_: That was the best fight ever! Can we do it again next time?  
**Jackie Chun** _(soft)_: Next time, boy, you will win. I am counting on it.  
_Jackie Chun slips away. A few minutes later Master Roshi appears from behind the same wall, wearing the same shoes._  
**Krillin** _(think)_: Master. Were you Jackie Chun?  
**Master Roshi** _(happy)_: Jackie who? Never heard of him. Excellent fighter. Very handsome.  
_Roshi’s prize pays for dinner, and Goku eats most of it. What is left goes in an envelope addressed to Nam’s village._  
**Bulma**: Goku, here. A radar, all yours. I promised you the world and restaurants with more than one fish. You’ve had both.  
**Goku** _(happy)_: The fish was the best part.  
**Bulma**: I know. Go find your grandpa’s four-star.  
_Goku takes the radar and Nimbus and heads off alone. Your Nubbins, of course, go with him._  

#### <a id="mv-db07-complete-deal-asked"></a>Variant `mv-db07-complete-deal-asked`

_Variant of `mv-db07-complete`._

**The Announcer**: Your winner and champion: Jackie Chun!  
**Goku** _(happy)_: That was the best fight ever! Can we do it again next time?  
**Jackie Chun** _(soft)_: Next time, boy, you will win. I am counting on it.  
_Jackie Chun slips away. A few minutes later Master Roshi appears from behind the same wall, wearing the same shoes._  
**Krillin** _(think)_: Master. Were you Jackie Chun?  
**Master Roshi** _(happy)_: Jackie who? Never heard of him. Excellent fighter. Very handsome.  
_Roshi’s prize pays for dinner, and Goku eats most of it. What is left goes in an envelope addressed to Nam’s village._  
**Bulma**: Goku, here. A radar, all yours. You said you wanted to find the strong ones and fight them nicely. Today you found one.  
**Bulma** _(think)_: Go find your grandpa’s four-star. The strong ones will keep turning up. They always do, around you.  
_Goku takes the radar and Nimbus and heads off alone. Your Nubbins, of course, go with him._  

**Rewards**

- Tournament Ribbon (cosmetic): A runner-up ribbon from the 21st Tournament. Wearable by any Nubbin.
- No Moon (flag): The moon is gone in this world. Full-moon events in the Dragon Ball line do not happen until it returns.

Sets on completion: `{"mv-db07":true,"mv-db-moon":"gone"}`

**Notes:** Goku loses the final to Jackie Chun (Roshi in disguise), as in the source; the karate check is `finish`, not `win`. Roshi destroys the moon with the Kamehameha to stop the ape; no casualties, played as an “oops” moment. Goku’s nudity after the transformation: back view, tablecloth. Bulma gives Goku a radar at the end, which starts the set-one hunt in DB8 (`mv-db-balls` counts from 0). Step mv-db07-s1b (added in review) plays the main rounds: Krillin vs Bacterian (the “you have no nose” gag is the source’s; the words are ours; the retaliation stays an off-screen smell joke), Goku vs Giran (gum), Goku vs Nam in the semi, Krillin vs Jackie Chun in the other semi. Ranfan need not appear. `karate:win:mv-21st-main-rounds` is two back-to-back bouts. Nam’s drought-struck village is from the source; `mv-db-nam` (told/kept) only changes the then-lines, and the envelope from Roshi’s prize money is our adaptation (in the source the prize goes on Goku’s enormous dinner; we keep that and add the envelope). Goku firing a Kamehameha behind him to fly back to the ring is from this final (check the chapter); it sets up the backwards Kamehameha against King Piccolo in DB17. The Nubbin checking Bulma’s fingers pays off DB1’s crossed fingers. Chapters checked from memory: ch. 28–53 (1985–86).

## DB8. Muscle Tower

*Dragon Ball, chapters 54–68 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB7, The 21st Budokai · requires: DB7

**Cast:** Goku (Son Goku (Dragon Ball)), General White (General White of the Red Ribbon Army (Dragon Ball)), Android 8 (Android 8, “Eighter” or “Hatchan” (Dragon Ball)), Suno (Suno, the girl of Jingle Village under Muscle Tower (Dragon Ball))

### Step 1: Find out who holds the snowbound village under its thumb.

Hint: An expedition through snow. A Nubbin with good stamina keeps the others warm. · check: `expedition:complete:mv-jingle-village`

#### <a id="mv-db08-snow"></a>Scene `mv-db08-snow`

_Nimbus can’t see in the blizzard, and you crash into a snowbank. Goku is wearing shorts and is surprised to be cold._  
**Goku** _(shock)_: Why’s it so cold? Is the sky broken? Little ones, get in my shirt.  
_A girl in a fur hat digs you out with a coal shovel, then stares at Goku’s bare knees._  
**Suno** _(shock)_: Shorts? In this? You’re either very brave or very silly. Come inside before something snaps off.  
_A village hides under the snow. Its people talk in whispers and look over their shoulders at the north._  
_Up on the ridge stands a red tower, and on it a red ribbon flag. Soldiers patrol the slopes with dogs._  
**Suno** _(sad)_: The Red Ribbon Army. They took Papa up the tower to make the village dig for some orange ball. He’s the chief.  
**Goku** _(happy)_: An orange ball? With stars in? Hey! I’ve got a radar, and it’s pointing at your tower!  
_Your Nubbins exchange a look. It has taken the soldiers about four minutes to hear about Goku’s radar too._  

### Step 2: Climb Muscle Tower floor by floor.

Hint: A tower expedition: one fight per floor. Each floor’s guard has one weakness. Ninjas hate light; jelly hates cold. · check: `expedition:complete:mv-muscle-tower`

#### <a id="mv-db08-tower"></a>Scene `mv-db08-tower`

**General White** _(happy)_: Welcome to Muscle Tower, boy. Five floors. One of my best on each. And at the top: me, with a cup of tea.  
_The voice comes from a speaker on the wall. General White watches every floor on screens and drinks every cup of tea._  
_Floor one: a giant sergeant who won’t stay down._  
_Goku finds out why. He’s a robot, and robots have off switches._  
_Floor two: a ninja who keeps splitting into identical brothers. Your Nubbins count shoes until the trick falls apart._  
_Floor three: a pit, and in it a pink jelly called Buyon that bounces every punch straight back at the puncher._  
_Your Nubbins push open a window. The blizzard pours in, Buyon sets like a pudding, and one tap breaks him into pink ice cubes._  
**General White** _(think)_: Hm. Well. Floor four has never been passed.  
_Floor four: a quiet room with a closed door, and behind the door something enormous breathing._  
**Goku** _(think)_: Hello? Do you want to fight? You don’t sound like you want to fight.  

#### <a id="mv-db08-tower-done"></a>Done `mv-db08-tower-done`

_The door opens. There stands a giant with a stitched-up face and a scar across his forehead, wringing his hands._  
**Android 8** _(sad)_: Please. Go away. Eight does not like fighting. Eight likes the squirrels outside the window.  

### Step 3: Make friends with Android 8.

Hint: Talk to him. Do not fight him. He has never once been asked what he wants. · check: `talk:android-8`

#### <a id="mv-db08-eight"></a>Scene `mv-db08-eight`

**Goku** _(happy)_: I don’t want to fight you either. I just want the ball. Do you want to come outside with us?  
**Android 8** _(sad)_: Outside? Eight is not allowed. Eight is a weapon. The Doctor said so.  
**General White** _(angry)_: Android 8! Crush that brat! Or I press the button!  
**Android 8** _(sad)_: Eight has a bomb inside. The General has the button. Eight does what he says, or… pop.  
_Your Nubbins have climbed onto Eight’s enormous knee. They are showing him a squirrel through the window._  
**Android 8** _(soft)_: …Eight likes small ones. Eight likes them very much.  
**Goku**: You’re not a weapon. You’re a big friend with a scar. Come on. We’ll fix the button.  
**General White** _(angry)_: Fine. I’ll press it. Goodbye, Eight.  

**Choices**

- **Send a Nubbin for the button while Goku runs for White.** — sets `{"mv-db-eight":"button"}`
    - Your Nubbin sprints up the stairwell and bites White’s thumb just as he presses. The button rolls under a desk.
    - **General White**: OW! It bit me! Somebody shoot the small thing!
- **Stand in front of Eight. Let White see you won’t move.** — sets `{"mv-db-eight":"stood"}`
    - You stand between the giant and the camera, your Nubbins beside you. White’s thumb hesitates.
    - **Android 8**: Nobody ever stood in front of Eight. Eight usually stands in front.

#### <a id="mv-db08-eight-done"></a>Done `mv-db08-eight-done`

_Goku reaches the top floor and takes the button off General White. White steps outside, through the window, with Eight’s help._  
**Android 8**: Eight… punched someone. Eight feels strange about it.  

### Complete

#### <a id="mv-db08-complete"></a>Complete `mv-db08-complete`

_The army flees the valley. The village comes out of its houses and blinks at the sun on the snow._  
**Android 8** _(soft)_: Can Eight stay? Eight could carry wood. Eight could mind the children. Eight would be very careful.  
_Suno’s papa comes down the tower steps last, blinking at the light. Goku is carrying his suitcase and General White’s tea tray._  
**Suno** _(soft)_: Eight. You can carry wood with me. And you’re not allowed to call yourself a weapon in our house.  
_Suno takes Eight by one finger and leads him in for soup. That settles it._  
**Goku** _(happy)_: Here’s the ball! It was in the General’s desk with his tea.  
_One Dragon Ball. Your Nubbins insist on holding it all the way back to Nimbus._  
**Goku**: One down! Six to go! And then I’ll find Grandpa’s.  

**Rewards**

- Jingle Village Fur Hat (cosmetic): A furry snow hat from the village under Muscle Tower. Wearable by any Nubbin.
- Eight’s Squirrel Feeder (decor): A feeder Android 8 built with very large hands. Squirrels visit it in the Grove.

Sets on completion: `{"mv-db08":true,"mv-db-balls":1}`

**Notes:** Set one begins: `mv-db-balls` = 1. Muscle Tower is a floor-by-floor expedition: Sergeant Metallic (robot, off switch), Ninja Murasaki and his “brothers” (shoe-counting puzzle), Buyon the jelly monster in the pit (floor three; beaten by opening a window on the blizzard and freezing him), Android 8 (floor four, no fight), General White (floor five). Suno and her father, the village chief held in the tower, are from the source (check the chapter for how the chief is held); Suno is added as a speaker in review. Eight (Hatchan) keeps his gentle voice; he refers to himself as Eight. The bomb in his chest is a plot device; it never goes off. White is thrown out of the window into a snowbank, not killed. Chapters checked from memory: ch. 54–68 (1986).

## DB9. The Pirate Cave

*Dragon Ball, chapters 69–81 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB8, Muscle Tower · requires: DB8

**Cast:** Goku (Son Goku (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Krillin (Krillin (Dragon Ball)), General Blue (General Blue of the Red Ribbon Army (Dragon Ball)), Arale (Arale Norimaki of Penguin Village (Dr. Slump, crossing into Dragon Ball))

### Step 1: Dive the underwater pirate cave ahead of General Blue.

Hint: A Swim expedition. Your Swim Nubbin leads; the others follow its bubbles. · check: `expedition:complete:mv-pirate-cave:swim`

#### <a id="mv-db09-dive"></a>Scene `mv-db09-dive`

_Goku’s radar breaks. Bulma fixes it in West City, then insists on coming along, because the next ball is under the sea._  
**Bulma**: Treasure, pirates, a submarine. Of course I’m coming. Krillin, bring snacks. Goku, bring Goku.  
**Krillin** _(sad)_: I was meant to be on holiday. This is my holiday now, isn’t it?  
_The ball is in a cave beneath the waves where pirates once hid their gold. Something else is heading there too._  
_A Red Ribbon submarine. On its deck stands an officer with blond hair and very clean gloves._  
**General Blue** _(angry)_: General Blue. I find dirt offensive, failure intolerable and children tiresome. You are all three.  
_Your Swim Nubbin is already over the side. It has seen the cave mouth and is not waiting for anybody._  
**Bulma**: Follow the little one! It swims better than our sub steers.  

**Choices**

- **Keep an eye out for the pirates’ gold.** — sets `{"mv-db-pirate":"treasure"}`
    - **Bulma**: Finally, somebody with priorities.
    - Your Swim Nubbin surfaces with one gold coin in its mouth, very proud. It is a chocolate coin.
- **Ball first. Gold later.** — sets `{"mv-db-pirate":"ball"}`
    - **Goku**: Ball first! Then lunch! Then gold. Maybe lunch again.
    - Your Swim Nubbin nods and dives straight for the radar’s blip.

#### <a id="mv-db09-dive-done"></a>Done `mv-db09-dive-done`

_The cave is full of traps, a pirate robot with a sword arm, and one Dragon Ball on a pile of treasure._  
_Krillin opens a chest marked DO NOT OPEN, and the ceiling starts coming down. In fairness, it was very clearly marked._  
**Krillin** _(shock)_: Why would anyone WRITE that on a chest? That’s practically an invitation!  
_Blue freezes Goku stiff with a stare. Then he grabs the ball and the gold and floods the cave behind him._  

### Step 2: Chase General Blue to Penguin Village.

Hint: A race across sea and sky on Nimbus. You need only finish; somebody in the village will finish him for you. · check: `race:finish:mv-penguin-village`

#### <a id="mv-db09-chase"></a>Scene `mv-db09-chase`

_Out of the flooding cave, half-drowned. Goku sneezes the stiffness off; Krillin sneezes on Bulma._  
**Goku** _(angry)_: He’s got our ball! Nimbus! Little ones, hang on!  
_Blue’s plane crosses the sea towards a little village where the cars have faces and the sun wears sunglasses._  
**General Blue**: A village of idiots. Perfect. I’ll lose him here.  
_He lands in the main street. A small girl in glasses and a winged cap is squatting by the road, poking a stick._  
**Arale** _(happy)_: Hiya! You’re weird and shiny! Are you a robot too? I’m a robot!  
**General Blue**: Out of my way, child. I have no time for…  
_The girl pats him on the back to say hello. General Blue goes through two walls and into a hill._  

#### <a id="mv-db09-chase-done"></a>Done `mv-db09-chase-done`

**Arale** _(happy)_: Oopsie! Wanna play? Your little round friends wanna play?  
_Your Nubbins play with Arale for one minute. It is the most dangerous minute of their lives, and the best._  

### Complete

#### <a id="mv-db09-complete"></a>Complete `mv-db09-complete`

_Goku gets the ball back from the hill where Blue is lodged. Blue is alive, upside down, and declining help._  
**Arale** _(happy)_: Bye-bye! Come back! Bring the floaty cloud! Bring the round ones!  
**Bulma** _(shock)_: I am never coming back here. That girl stopped a train with her face.  
**Krillin** _(think)_: Nobody saw that but me, right? I’m not sure I saw it.  
**Goku** _(happy)_: Two! Five to go!  
_Your Swim Nubbin is still holding its chocolate coin and refuses to eat it. It is treasure now._  

**Rewards**

- Pirate Chocolate Coin (decor): A chocolate coin in gold foil, on a little stand. Your Swim Nubbin guards it.
- Cave Diver (title): For the Swim Nubbin that led the dive into the pirate cave.
- Winged Cap (cosmetic): A cap with little wings, a gift from a very strong girl in Penguin Village. Wearable by any Nubbin.

Sets on completion: `{"mv-db09":true,"mv-db-balls":2}`

**Notes:** `mv-db-balls` = 2. Swim Nubbin leads the dive (brief requirement). Blue’s paralysis stare: a status effect in the cave expedition that the Nubbins break by distraction. Penguin Village is the Dr. Slump crossover: Arale, talking cars, smiling sun. No Dr. Slump catchphrases; Arale’s lines are all new. Blue is flattened, not killed (he is killed later by Tao in the source; this line leaves that off-screen and unmentioned). Chapters checked from memory: ch. 69–81 (1986).

## DB10. Mercenary Tao

*Dragon Ball, chapters 82–86 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB9, The Pirate Cave · requires: DB9

**Cast:** Goku (Son Goku (Dragon Ball)), Upa (Upa, guardian of Korin Tower’s holy land (Dragon Ball)), Bora (Bora, Upa’s father (Dragon Ball)), Mercenary Tao (Mercenary Tao (Dragon Ball))

### Step 1: Meet the guardians of Korin’s holy land.

Hint: Talk to Upa. Bora will test Goku first; let him. · check: `talk:upa`

#### <a id="mv-db10-holyland"></a>Scene `mv-db10-holyland`

_The radar points to a plain of grass where a white tower rises so high its top is lost in the clouds._  
_A huge man with a spear stands in the way. A boy with a single braid peeks out from behind his leg._  
**Bora**: This is holy ground. The tower belongs to Korin. Outsiders who come for it come to steal.  
**Goku** _(happy)_: I don’t want the tower. I want a ball. An orange one. With stars.  
**Upa**: Father, he flies on a cloud. Bad men can’t ride clouds. Everybody knows that.  
_Bora tests Goku with three swings of his spear. Goku dodges all three and then helps him pick it up._  
**Bora**: Hm. The boy is right. Forgive me. We have a Dragon Ball, as it happens. It was a gift to Korin, years ago.  
**Bora**: Stay for supper. Tomorrow, if your heart is good, you may have it.  
**Upa** _(happy)_: Will your little ones sleep in my hut? I’ll show them my spear. It’s only small. It’s a beginner spear.  

### Step 2: Face the man the army sent.

Hint: A karate bout you will lose. Keep Upa behind you, and stay alive. · check: `karate:finish:mv-mercenary-tao`

#### <a id="mv-db10-tao"></a>Scene `mv-db10-tao`

_In the morning, something comes over the horizon. A man in a pink tunic, standing on a flying pillar of stone._  
_He steps off as it lands. His hair is in a long braid, and he is smiling as if the world has made a small joke._  
**Mercenary Tao** _(happy)_: Mercenary Tao. I kill for money, and the Red Ribbon pays very well. Which of you is the boy with the tail?  
**Bora**: Leave this place. It is holy.  
**Mercenary Tao**: Everything is holy until somebody buys it.  
_It happens too fast to watch. Bora, who blocked three of Goku’s best blows, does not block one of Tao’s._  
_The big man falls and doesn’t rise. Upa runs to him, and your Nubbins run after Upa to keep him back._  
**Upa** _(sad)_: Father? Father, get up. Please get up.  
**Goku** _(angry)_: You…  

**Choices**

- **Pull Upa away and keep him safe.** — sets `{"mv-db-tao":"protected-upa"}`
    - You hold Upa against your chest. He fights you, then stops and shakes, your Nubbins pressed against him on both sides.
    - **Mercenary Tao**: Sweet. Keep him. I don’t charge for children.
- **Let Goku go. Tell him to give it everything.** — sets `{"mv-db-tao":"all-in"}`
    - **Goku**: Everything. Everything I’ve got.
    - **Mercenary Tao**: Oh, good. I do like it when they try.

#### <a id="mv-db10-tao-done"></a>Done `mv-db10-tao-done`

_Goku lands blows, and Tao lets him. Then Tao points one finger, and a bolt of light hits Goku in the chest._  
_Goku goes down. Tao walks away whistling, without looking back._  
_He should have looked. Under Goku’s shirt, the bolt has struck a Dragon Ball._  

### Complete

#### <a id="mv-db10-complete"></a>Complete `mv-db10-complete`

_Goku wakes up in Upa’s hut with a hole burned in his shirt and an orange ball warm in his hand._  
**Goku** _(think)_: It stopped the light. Grandpa’s kind of ball stopped it.  
**Upa** _(sad)_: We buried Father by the tower. He’d want to be near it.  
**Goku** _(angry)_: I couldn’t beat him. I wasn’t strong enough. I need to get stronger. Right now. Today.  
**Upa**: They say if you climb the tower, Korin has Sacred Water at the top. Anyone who drinks it gets much stronger.  
_Goku looks up at the white tower vanishing into cloud. He takes off his boots._  
**Goku**: Then I’m climbing it.  

**Rewards**

- Upa’s Feather (cosmetic): A feather Upa wears in Bora’s memory, shared with your Nubbins. Wearable by any Nubbin.
- A Debt to Bora (flag): Bora fell defending Korin’s land. The line remembers it; the first set’s wish in DB13 can bring him back.

Sets on completion: `{"mv-db10":true,"mv-db-bora":"fallen"}`

**Notes:** The line’s first death: Bora is killed by Tao off-panel (cut on the blow, then Bora lying still; no wound shown, no blood). Tao’s finger beam is the Dodon Ray; name it on the karate result screen only (“Dodon Ray”). The bout is a scripted loss (`finish`). The Dragon Ball in Goku’s shirt saves him, as in the source. Count stays at 2: Korin’s ball is not handed over until DB11. Bora’s fate is flagged (`mv-db-bora`) for DB13’s wish. Tao rides a thrown pillar, the series’ famous image; keep it. Chapters checked from memory: ch. 82–86 (1986).

## DB11. Korin Tower

*Dragon Ball, chapters 87–91 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB10, Mercenary Tao · requires: DB10

**Cast:** Goku (Son Goku (Dragon Ball)), Korin (Korin, the cat sage of Korin Tower (Dragon Ball)), Mercenary Tao (Mercenary Tao (Dragon Ball)), Upa (Upa, guardian of Korin Tower’s holy land (Dragon Ball))

### Step 1: Climb Korin Tower.

Hint: A long climbing race. No rivals, only the tower. Rest on the ledges; the top is further than it looks. · check: `race:finish:mv-korin-tower:climb`

#### <a id="mv-db11-climb"></a>Scene `mv-db11-climb`

_The tower is smooth white stone with carvings just deep enough for fingers. And paws, if the paws are determined._  
**Goku** _(think)_: Little ones, get on my back. No. Actually. You want to climb it too, don’t you?  
_Your Nubbins are already three carvings up, very slowly. They are not going to stop._  
_By noon the ground is a green handkerchief. By evening the clouds are below you, and the wind has opinions._  
**Goku** _(sad)_: My arms are made of noodles. My legs are made of soup. I’m hungry for both.  
_Nobody has climbed this tower in living memory. Bora’s grandfather tried, and Tao, it is said, gave up halfway._  
**Goku** _(angry)_: Tao gave up? Then I won’t.  
_Night, then morning; your Nubbins sleep tied to Goku’s belt with his headband. Then there is a floor, a hole, and light._  

#### <a id="mv-db11-climb-done"></a>Done `mv-db11-climb-done`

_At the top sits a small white cat on a stool, leaning on a stick. He looks at Goku the way cats look at everything._  
**Korin**: Three days. Not bad. The last one took four and fell off. I’m Korin. I suppose you want the water.  

### Step 2: Take the Sacred Water from Korin.

Hint: A chasing game. Korin is faster than anything; the score counts how close you get, not whether you win. · check: `minigame:score:mv-korin-chase:300`

#### <a id="mv-db11-water"></a>Scene `mv-db11-water`

**Korin** _(happy)_: The water is in this jar. You may drink it, if you can take it from me.  
_Goku lunges._  
_The jar is suddenly on the other side of the room, and so is Korin. He hasn’t visibly moved._  
**Goku** _(shock)_: How did you do that?  
**Korin**: I am old, and I am a cat, and I have been doing this for eight hundred years. Try again.  
_Goku tries for one day, then two, your Nubbins flanking him. Korin steps around them like puddles._  
_On the third day Goku is moving faster than he has ever moved. On the third evening, his fingers touch the jar._  
**Goku** _(happy)_: Got it! Got it! Now I drink it and I get strong!  

**Choices**

- **Let him drink it.** — sets `{"mv-db-korin":"drank"}`
    - Goku drinks the whole jar. He waits, flexes, and waits a bit more.
    - **Goku**: …It tastes like water.
- **Ask Korin what’s actually in the jar.** — sets `{"mv-db-korin":"asked"}`
    - **Korin**: A sharp question. Water, mostly. Rain from the roof.
    - **Goku**: Water? But I chased you for three days!

#### <a id="mv-db11-water-done"></a>Done `mv-db11-water-done`

**Korin**: The jar was never the thing. The chasing was the thing. Look how fast you are. Feel it?  
**Goku** _(happy)_: …I do feel it. I didn’t notice, because I was busy.  

### Step 3: Go down and fight Mercenary Tao again.

Hint: A full karate rematch. Watch for the grenade at the end; kicking it back is a legal move. · check: `karate:win:mv-tao-rematch`

#### <a id="mv-db11-rematch"></a>Scene `mv-db11-rematch`

_Goku drops off the tower._  
_He doesn’t climb down. He jumps, a long way, and lands soft as a leaf in the grass._  
_Tao has come back to collect Korin’s Dragon Ball. He is sitting by Bora’s grave, eating an apple._  
**Mercenary Tao** _(think)_: The boy with the tail. You were dead. I don’t make mistakes.  
**Goku** _(angry)_: You made one. Now I’m going to make you sorry for it.  
**Upa**: Goku! For Father!  
_Tao fires his finger-beam, and Goku isn’t there any more. Tao fires again; Goku is beside him, then behind him._  
**Mercenary Tao** _(shock)_: Impossible. Three days ago you were nothing.  

#### <a id="mv-db11-rematch-done"></a>Done `mv-db11-rematch-done`

_Beaten, Tao pulls a grenade from his sleeve and throws it. Goku kicks it straight back._  
_There is a bang and a lot of smoke, and when it clears Tao is gone. Whether he is gone for good, nobody can say._  

### Complete

#### <a id="mv-db11-complete"></a>Complete `mv-db11-complete`

**Upa** _(soft)_: You did it. You did it for Father.  
_Upa gives Goku the Dragon Ball that Bora kept for Korin. His hands are steady, which is the hardest part._  
**Goku** _(soft)_: Upa. When I’ve got all seven, I’m going to wish your dad back. I promise.  
**Upa**: Can you do that? Can the dragon do that?  
**Goku**: Bulma says he can do anything. Except maybe make her cooking nice.  
_Three Dragon Balls now. Your Nubbins carry this one between them like an egg._  

**Rewards**

- Korin’s Water Jar (decor): An empty jar from the top of Korin Tower. It holds rainwater, which is exactly what it always held.
- Tower Climber (title): For Nubbins that climbed Korin Tower on their own paws.

Sets on completion: `{"mv-db11":true,"mv-db-balls":3,"mv-db-upa-promise":true}`

**Notes:** `mv-db-balls` = 3 (Upa gives Bora’s ball). Korin’s chase is a minigame: Korin teleports between spots; score is the number of near-touches. The “Sacred Water is just water” reveal happens whichever choice is picked. The grenade is kicked back; Tao is blown away and presumed gone (he returns half-cyborg in E4). Goku’s promise to wish Bora back (`mv-db-upa-promise`) pays off in DB13. Chapters checked from memory: ch. 87–91 (1986).

## DB12. Red Ribbon’s End

*Dragon Ball, chapters 92–95 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB11, Korin Tower · requires: DB11

**Cast:** Goku (Son Goku (Dragon Ball)), Commander Red (Commander Red of the Red Ribbon Army (Dragon Ball)), Staff Officer Black (Staff Officer Black of the Red Ribbon Army (Dragon Ball))

### Step 1: Storm the Red Ribbon Army’s headquarters with Goku.

Hint: An expedition through a whole base. Nubbins are small: send them under fences while Goku goes over them. · check: `expedition:complete:mv-red-ribbon-hq`

#### <a id="mv-db12-hq"></a>Scene `mv-db12-hq`

_The Red Ribbon headquarters is a city of red buildings behind a wall._  
_There are thousands of soldiers. There is one Goku._  
**Goku** _(angry)_: They hurt Bora. They hurt the snow village. They keep hurting people. I’m going to stop them all.  
**You**: All of them? On your own?  
**Goku** _(happy)_: Not on my own. You’re coming. And the little ones.  
_Goku goes in through the front gate. It isn’t open, so he goes through it anyway._  
**Goku** _(happy)_: Anybody who runs away, I won’t chase! Running away is allowed! Master Roshi does it from Lunch every day!  
_About a third of the army takes him up on the offer. Your Nubbins hold the side gate open for them._  
_Your Nubbins take the drains. Down there, they find the army’s storeroom, and on a shelf, under a red cloth, a glow._  
_Alarms, tanks, planes. Goku knocks them over like skittles and keeps walking towards the tallest tower._  

### Step 2: Find out what Commander Red wanted to wish for.

Hint: Listen at the door of Red’s office. Your Nubbin can get under it; you can only press an ear to it. · check: `talk:mv-commander-red`

#### <a id="mv-db12-office"></a>Scene `mv-db12-office`

_At the top of the tower, a small man in a big chair is shouting into a telephone. He stands on a box to look out of the window._  
**Commander Red** _(angry)_: Stop him! He’s a child! A child! How is a child walking through my army?  
**Staff Officer Black**: Commander. Sir. We should evacuate. With the balls we have, we can rebuild.  
**Commander Red** _(angry)_: No! Not until I have all seven! Not until I make my wish!  
**Staff Officer Black**: World conquest can wait a little longer, sir.  
**Commander Red** _(angry)_: World conquest? Who said anything about the world? I want to be TALLER, Black! Taller!  
_Silence. On the far side of the door, your Nubbin hears Staff Officer Black put down his clipboard._  
**Staff Officer Black** _(think)_: All those men. All those years. So that you could be taller.  

**Choices**

- **Burst in and warn Red.** — sets `{"mv-db-red":"warned"}`
    - You shove the door open, too late. A single shot, and Commander Red is still in his chair.
    - **Staff Officer Black**: You heard him. Tell me I was wrong.
- **Hold your Nubbin back. Keep listening.** — sets `{"mv-db-red":"listened"}`
    - A single shot. Then Black’s voice, very calm, giving orders to the whole base as its new commander.
    - Your Nubbin comes out from under the door shaking. You pick it up and don’t put it down for a while.

### Step 3: Beat Staff Officer Black in his battle suit.

Hint: A karate bout against a walking machine. Kamehameha is very good against big, slow, angry things. · check: `karate:win:mv-black-battle-suit`

#### <a id="mv-db12-suit"></a>Scene `mv-db12-suit`

_Goku reaches the top floor. Black is waiting inside a blue mechanical suit three times his size._  
**Staff Officer Black** _(angry)_: Commander Black, Red Ribbon Army. The army is mine now, and you are its last problem.  
**Goku** _(think)_: Where’s the little shouty man?  
**Staff Officer Black**: He was a disappointment. I solved him.  
**Goku** _(angry)_: …You hurt your own friend?  
**Staff Officer Black**: Friends. Soldiers. Children. Monkeys. Anything in my way is the same to me.  
_The suit’s fists come down like falling buildings. Your Nubbins take position behind Goku, paws cupped at their hips._  
**Goku** _(angry)_: Little ones. Like Master Roshi showed us. All together.  

#### <a id="mv-db12-suit-done"></a>Done `mv-db12-suit-done`

_Four blue beams, and one battle suit a long way off, falling in pieces. Black falls with it._  
_Down below, the soldiers watch their tower burn, look at each other, and quietly take off their red ribbons._  

### Complete

#### <a id="mv-db12-complete"></a>Complete `mv-db12-complete`

_In Red’s office there is a safe. In the safe are three Dragon Balls, each in a velvet box._  
**Goku** _(happy)_: Six! We’ve got six!  
_There is also a stool with a small ladder, a pile of shoe lifts, and a letter to a tailor about longer trousers._  
**Goku** _(sad)_: He just wanted to be bigger. He could’ve asked. People would’ve let him stand on stuff.  
_The Red Ribbon Army is gone. The radar shows one ball left, and shows it nowhere at all._  
**Goku** _(think)_: Where’s the last one? Why’s it not on the screen?  

**Rewards**

- Untied Ribbon (cosmetic): A red ribbon a soldier took off and left on the ground. Your Nubbins wear it as a bow; it means nothing now.
- Commander’s Step Stool (decor): A small stool with a ladder. Short Nubbins use it to reach the high fruit.

Sets on completion: `{"mv-db12":true,"mv-db-balls":6}`

**Notes:** `mv-db-balls` = 6 (Red’s three). Red is shot by Black off-screen: hold on the closed door, one muffled sound. No body shown. Black’s battle jacket is beaten by a joint Kamehameha from Goku and the Nubbins (uses the DB4 move). In the source Goku beats it alone; the combined beam is our adaptation. The last ball off the radar sets up Baba in DB13. Goku’s offer to let runners go (about a third of the army leaves) is ours; it keeps him a boy who fights, not a soldier. Chapters checked from memory: ch. 92–95 (1987).

## DB13. Fortuneteller Baba

*Dragon Ball, chapters 96–112 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB12, Red Ribbon’s End · requires: DB12

**Cast:** Goku (Son Goku (Dragon Ball)), Fortuneteller Baba (Fortuneteller Baba (Dragon Ball)), The Masked Fighter (Grandpa Gohan, masked, as Baba’s fifth fighter (Dragon Ball)), Grandpa Gohan (Son Gohan, Goku’s adoptive grandfather (Dragon Ball)), Upa (Upa, guardian of Korin Tower’s holy land (Dragon Ball)), Bora (Bora, Upa’s father (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball)), Emperor Pilaf (Emperor Pilaf (Dragon Ball))

### Step 1: Get through Fortuneteller Baba’s fighters.

Hint: Four quick karate bouts in Baba’s arena over the water. A vampire, an invisible man, a mummy and a devil with a mirror. · check: `karate:win:mv-baba-fighters`

#### <a id="mv-db13-baba"></a>Scene `mv-db13-baba`

_A palace in the desert, beside a lake. A tiny old woman floats in on a crystal ball, wearing a witch’s hat._  
**Fortuneteller Baba** _(happy)_: I see all things lost. Your Dragon Ball, for instance. I see it very clearly. For ten million zeni.  
**Goku**: I haven’t got ten million… anything. I’ve got a fish. It’s old.  
**Fortuneteller Baba**: Then you fight for it. Beat my five fighters, and the seeing is free. Lose, and you mop my floors forever.  
_Her arena is a ring over a pool of acid. Her fighters have faces you would cross a road to avoid._  
_A vampire with dreadful breath. A man nobody can see, who keeps losing because your Nubbins can smell him._  
_A mummy with an excellent bandage budget. A devil who holds up a mirror and invites you to look at your sins._  
**Goku** _(happy)_: What’s a sin? Can I see? Ooh. It’s just me.  
**Fortuneteller Baba** _(shock)_: …Well, that’s never happened.  

### Step 2: Face Baba’s fifth fighter.

Hint: A karate bout against a masked man who knows every move Goku makes. Let it run its course. · check: `karate:finish:mv-masked-fighter`

#### <a id="mv-db13-mask"></a>Scene `mv-db13-mask`

**Fortuneteller Baba**: My last fighter. My best. He has come a very long way for this. Further than you can imagine.  
_A man in a white mask and a gentle robe steps into the ring, a halo above his head. He bows to Goku._  
**The Masked Fighter** _(soft)_: Hello, boy. You’ve grown.  
**Goku** _(think)_: Do I know you? You smell like home. You smell like pine trees.  
_They fight. The masked man blocks every punch before Goku throws it, as if he taught them._  
_Frustrated, Goku reaches for his staff, and the masked man reaches for his own. They are the same staff._  
**The Masked Fighter**: Your tail. Where is your tail? Don’t tell me you lost it under a full moon.  
**Goku** _(shock)_: …Grandpa?  

**Choices**

- **Tell Goku to finish the bout. His grandpa would want that.** — sets `{"mv-db-gohan":"finished-bout"}`
    - **The Masked Fighter**: Your friend is right. Show me, Goku. Show me all of it.
    - Goku does. The last punch lands, and the old man laughs as he falls.
- **Ask Baba to stop the fight.** — sets `{"mv-db-gohan":"stopped"}`
    - **Fortuneteller Baba**: Stop it? He paid a day of his death to be here. Let the boy have the fight.
    - So Goku fights his grandfather, and wins, and cries a little while doing it.

#### <a id="mv-db13-mask-done"></a>Done `mv-db13-mask-done`

_The masked man takes off the mask: a kind old face with a white beard. Goku’s whole body shakes._  
**Grandpa Gohan** _(soft)_: One day. Baba gave me one day back from the other side. I spent it fighting you. Best day I’ve had.  

### Complete

#### <a id="mv-db13-complete"></a>Complete `mv-db13-complete`

**Grandpa Gohan** _(soft)_: I can’t stay, Goku. But I’ll watch. Be good. Be kind. And give that four-star ball my love.  
_He fades at sunset. Baba looks into her crystal ball and points: the last Dragon Ball is in Emperor Pilaf’s pocket._  
**Emperor Pilaf** _(shock)_: Not again! No! Not the monkey again!  
_Seven Dragon Balls. Shenron rises over Korin’s land, black sky, green coils, gold eyes._  
**Shenron**: Seven gathered. Speak.  
_Goku holds the four-star ball a moment longer than he needs to. Once he wishes, it flies off to the far side of the world again._  
**Goku** _(soft)_: Grandpa said give it his love. I think this is how. Shenron, bring Bora back. Upa’s dad. Please.  
_Bora sits up by his own grave, puzzled and alive. Upa crashes into him so hard they both fall over._  
**Bora** _(soft)_: Thank you, boy. And thank you, little ones. I heard you, I think, from very far off.  
_The balls rise, turn grey, and scatter across the world. The first set of seven is spent, and well spent._  

#### <a id="mv-db13-complete-deal-truth"></a>Variant `mv-db13-complete-deal-truth`

_Variant of `mv-db13-complete`._

**Grandpa Gohan** _(soft)_: I can’t stay, Goku. But I’ll watch. Be good. Be kind. And give that four-star ball my love.  
_He fades at sunset. Baba looks into her crystal ball and points: the last Dragon Ball is in Emperor Pilaf’s pocket._  
**Emperor Pilaf** _(shock)_: Not again! No! Not the monkey again!  
_Seven Dragon Balls. Shenron rises over Korin’s land, black sky, green coils, gold eyes._  
**Shenron**: Seven gathered. Speak.  
_Goku holds the four-star ball a moment longer than he needs to. Once he wishes, it flies off to the far side of the world again._  
**Goku** _(soft)_: Grandpa said give it his love. I think this is how. Shenron, bring Bora back. Upa’s dad. Please.  
**Goku** _(soft)_: Bulma borrowed it once, like she said she would. This time it’s my turn, and I know exactly what for.  
_Bora sits up by his own grave, puzzled and alive. Upa crashes into him so hard they both fall over._  
**Bora** _(soft)_: Thank you, boy. And thank you, little ones. I heard you, I think, from very far off.  
_The balls rise, turn grey, and scatter across the world. The first set of seven is spent, and well spent._  

#### <a id="mv-db13-complete-deal-pitch"></a>Variant `mv-db13-complete-deal-pitch`

_Variant of `mv-db13-complete`._

**Grandpa Gohan** _(soft)_: I can’t stay, Goku. But I’ll watch. Be good. Be kind. And give that four-star ball my love.  
_He fades at sunset. Baba looks into her crystal ball and points: the last Dragon Ball is in Emperor Pilaf’s pocket._  
**Emperor Pilaf** _(shock)_: Not again! No! Not the monkey again!  
_Seven Dragon Balls. Shenron rises over Korin’s land, black sky, green coils, gold eyes._  
**Shenron**: Seven gathered. Speak.  
_Goku holds the four-star ball a moment longer than he needs to. Once he wishes, it flies off to the far side of the world again._  
**Goku** _(soft)_: Grandpa said give it his love. I think this is how. Shenron, bring Bora back. Upa’s dad. Please.  
**Goku** _(soft)_: Bulma said come and see the world. I did. This is the bit of it I wanted most.  
_Bora sits up by his own grave, puzzled and alive. Upa crashes into him so hard they both fall over._  
**Bora** _(soft)_: Thank you, boy. And thank you, little ones. I heard you, I think, from very far off.  
_The balls rise, turn grey, and scatter across the world. The first set of seven is spent, and well spent._  

#### <a id="mv-db13-complete-deal-asked"></a>Variant `mv-db13-complete-deal-asked`

_Variant of `mv-db13-complete`._

**Grandpa Gohan** _(soft)_: I can’t stay, Goku. But I’ll watch. Be good. Be kind. And give that four-star ball my love.  
_He fades at sunset. Baba looks into her crystal ball and points: the last Dragon Ball is in Emperor Pilaf’s pocket._  
**Emperor Pilaf** _(shock)_: Not again! No! Not the monkey again!  
_Seven Dragon Balls. Shenron rises over Korin’s land, black sky, green coils, gold eyes._  
**Shenron**: Seven gathered. Speak.  
_Goku holds the four-star ball a moment longer than he needs to. Once he wishes, it flies off to the far side of the world again._  
**Goku** _(soft)_: Grandpa said give it his love. I think this is how. Shenron, bring Bora back. Upa’s dad. Please.  
**Goku** _(soft)_: I said I wanted to find people stronger than me. Grandpa was. Still is, I think.  
_Bora sits up by his own grave, puzzled and alive. Upa crashes into him so hard they both fall over._  
**Bora** _(soft)_: Thank you, boy. And thank you, little ones. I heard you, I think, from very far off.  
_The balls rise, turn grey, and scatter across the world. The first set of seven is spent, and well spent._  

**Rewards**

- First Set of Seven (flag): You gathered all seven Dragon Balls with Goku. Their wish brought back Bora.
- Grandpa Gohan’s Photo (decor): A small framed photo of an old man with a white beard. Your Nubbins put fruit in front of it sometimes.

Sets on completion: `{"mv-db13":true,"mv-db-balls":7,"mv-db-set1":true,"mv-db-bora":"revived"}`

**Notes:** Completes the first set: `mv-db-balls` = 7, `mv-db-set1` = true. The wish brings back Bora (brief). Baba’s fighters (Fangs, the Invisible Man, the Mummy, Spike the Devil Man) can be one four-bout gauntlet; Krillin, Yamcha and Upa fought some of them in the source, compressed here. The masked fighter is Grandpa Gohan with his halo, back for one day; the bout is a scripted `finish`. Gohan’s line about the tail is a callback, not a source quote. The last ball turning up with Pilaf is from memory; check the chapter (if wrong, keep Pilaf as a comic cameo and move the ball to wherever the source puts it). Chapters checked from memory: ch. 96–112 (1987).

## DB14. The 22nd Budokai

*Dragon Ball, chapters 113–135 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB13, Fortuneteller Baba · requires: DB13

**Cast:** Goku (Son Goku (Dragon Ball)), Krillin (Krillin (Dragon Ball)), Yamcha (Yamcha, the desert bandit (Dragon Ball)), Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Tien (Tien Shinhan (Dragon Ball)), Chiaotzu (Chiaotzu (Dragon Ball)), The Crane Hermit (Master Shen, the Crane Hermit (Dragon Ball)), The Announcer (The World Martial Arts Tournament announcer (Dragon Ball))

### Step 1: Meet the Crane School at the 22nd Tournament.

Hint: Talk to the Crane Hermit in the courtyard. Keep your Nubbins away from the small pale boy; he can see into heads. · check: `talk:mv-crane-hermit`

#### <a id="mv-db14-crane"></a>Scene `mv-db14-crane`

_Three years on, Papaya Island again. Goku is taller, Krillin braver, and Yamcha has a new haircut he is sure about._  
_In the courtyard stands an old man in a crane hat, and with him two students in green._  
**The Crane Hermit** _(happy)_: Turtle Hermit. You look old. Older than me, which is impressive, since we started together.  
**Master Roshi**: Crane Hermit. You look exactly as trustworthy as you always did.  
**The Crane Hermit**: Still teaching milk rounds, Roshi? My boys can stop a heart with one finger.  
**Master Roshi**: Lovely. And who brings them their milk? Hm? Nobody. Their bones must be terrible.  
_The tall student has three eyes and no hair. The small one has white skin, red cheeks, and very still eyes._  
**Tien**: Tien. This is Chiaotzu. We are here to break the Turtle School. Not to win. To break it.  
**Chiaotzu** _(happy)_: Your little friend is thinking about cake. I can hear it. It’s very loud about cake.  
_Your Nubbin covers its head with both paws. It does not help; it was thinking about cake._  

#### <a id="mv-db14-crane-done"></a>Done `mv-db14-crane-done`

_In the first round, Tien breaks Yamcha’s leg on purpose, after the bout is already won. The crowd goes quiet._  
**Yamcha** _(sad)_: I’m fine. I’m fine. Don’t look at me like that, Puar. I’m fine.  

### Step 2: Get Krillin through his bout with Chiaotzu.

Hint: A karate bout against a mind-reader. Krillin’s trick: think about one thing and do another. Ask a sum. · check: `karate:win:mv-chiaotzu`

#### <a id="mv-db14-krillin"></a>Scene `mv-db14-krillin`

**Krillin** _(shock)_: He reads every move before I make it. Every move. Goku, he reads my thoughts.  
**Goku** _(think)_: So think something else. Something hard.  
**Krillin**: Like what?  
_Your Nubbin, still hiding its own thoughts, holds up a paw with fingers… then another… then takes some away._  
**Krillin** _(happy)_: Sums. He’s no good at sums! Chiaotzu! What’s seven take away three, times two?  
**Chiaotzu** _(shock)_: That’s… um. That’s not fair. Seven. Take away. Hold on, I’m counting on my fingers.  
_While Chiaotzu counts, Krillin walks over and pushes him gently out of the ring._  
**The Crane Hermit** _(angry)_: Pathetic! I trained you to kill, and you lose to arithmetic!  

#### <a id="mv-db14-krillin-done"></a>Done `mv-db14-krillin-done`

**Yamcha** _(happy)_: That’s my school! Well, it’s not my school. But I sat near it! Go on, Krillin!  
_Yamcha is cheering from a stretcher. Puar waves Yamcha’s crutch about for him, since he isn’t allowed to._  
**Krillin** _(happy)_: I won. With sums. Mum always said maths would save my life one day, and I never once believed her.  
**Chiaotzu** _(sad)_: …It was eight. I got there in the end. It was eight.  

### Step 3: Stand by Goku in the final against Tien.

Hint: A full karate final. You may lose. Watch for the moment Tien chooses. · check: `karate:finish:mv-tien-final`

#### <a id="mv-db14-final"></a>Scene `mv-db14-final`

_Tien beats Jackie Chun in the semi-final, and Jackie Chun says something quiet to him afterwards. Tien looks thoughtful._  
_Then the final: Goku against Tien. They are evenly matched, and both of them are starting to enjoy it._  
**Tien** _(think)_: Your school is soft. But you’re not. I don’t understand that.  
**Goku** _(happy)_: Master Roshi says fight to get better, not to beat people. It’s more fun this way. Isn’t it more fun?  
_Tien’s answer is to flare like a second sun. The arena goes white, and Goku staggers about, blinking, punching a pillar._  
_Your Nubbin snatches the sunglasses off Roshi’s nose and flings them into the ring. Goku puts them on upside down. It works anyway._  
**Master Roshi** _(shock)_: My sunglasses! Those have seen two wars and a wedding!  
_In the stands, the Crane Hermit nods to Chiaotzu. Chiaotzu frowns, then closes his eyes and points._  
_Goku freezes mid-step, stuck like a fly in amber. Tien, about to strike, sees the frozen boy, and stops._  
**Tien** _(angry)_: Chiaotzu. Let him go.  
**The Crane Hermit** _(angry)_: Finish him, Tien! That’s an order!  

**Choices**

- **Shout to Tien: “Win it properly!”** — sets `{"mv-db-tien":"shouted"}`
    - **Tien**: Yes. Properly. Or not at all.
    - Tien turns his back on the stand where his master sits. Chiaotzu opens his eyes, and Goku can move.
- **Send your Nubbin to sit beside Chiaotzu.** — sets `{"mv-db-tien":"chiaotzu"}`
    - Your Nubbin climbs into the seat beside Chiaotzu and thinks, very loudly, about the two of them sharing a cake.
    - **Chiaotzu**: …That’s nice. Tien? Tien, I don’t want to do this.

#### <a id="mv-db14-final-done"></a>Done `mv-db14-final-done`

_Tien quits the Crane School in front of the whole crowd, and the Crane Hermit storms off. Chiaotzu stays with Tien._  
_The final ends in the air, both men falling out of the ring at once. Goku’s foot touches the grass a breath first._  

### Complete

#### <a id="mv-db14-complete"></a>Complete `mv-db14-complete`

**The Announcer**: Your winner and champion of the 22nd Tournament: Tien!  
**Goku** _(happy)_: Aww! So close! You were amazing! Can we do it again?  
**Tien** _(soft)_: You made me want to fight honestly. I didn’t know I could. Thank you, Goku.  
**Master Roshi** _(happy)_: Well. Two of my students in the semi-finals, one in the final, and a defector from the other side. Not bad.  
**Chiaotzu** _(happy)_: Goku’s friend? Your little one can come and visit. It thinks good thoughts. Mostly cake.  
_That night everybody eats at a long table, the Turtle School and the former Crane students side by side._  
**Krillin** _(happy)_: I’ll go back for your bag, Goku. You left it in the changing room. Back in a minute.  

**Rewards**

- Cake for Two (decor): A small round cake on a stand, with two forks. Your Nubbins always share it.
- Good Thoughts (title): For the Nubbin whose thoughts Chiaotzu called “mostly cake”.

Sets on completion: `{"mv-db14":true,"mv-db-tien-honour":true}`

**Notes:** Tien turns on the Crane Hermit and wins the final by a hair, as in the source; the karate check is `finish`. Yamcha’s broken leg: show the bout end, then Yamcha on a stretcher, no break shown. Krillin beats Chiaotzu with a sum (source gag; the sum itself is ours). In the final Tien uses his blinding flash and Goku counters with Roshi’s sunglasses (source; in our version a Nubbin throws them, and they are the Crooked Sunglasses Roshi wears to his death in DB16). Jackie Chun loses to Tien in the semi and advises him; Roshi then retires Jackie for good. Krillin’s last line here sets up his death in DB15; the implementer should make sure he walks off screen alone, back to the arena, under the long-table lanterns. `mv-db-tien` records how the Keeper reached Tien; `mv-db-tien-honour` marks his turn for E4 either way. Chapters checked from memory: ch. 113–135 (1987–88).

## DB15. Tambourine

*Dragon Ball, chapters 136–140 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB14, The 22nd Budokai · requires: DB14

**Cast:** Goku (Son Goku (Dragon Ball)), Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Tambourine (Tambourine, King Piccolo’s demon (Dragon Ball)), Yajirobe (Yajirobe (Dragon Ball)), King Piccolo (King Piccolo (Dragon Ball))

### Step 1: Find out why Krillin hasn’t come back.

Hint: Go back to the arena with Goku. It’s a short walk, and the longest in the line. · check: `expedition:complete:mv-arena-at-night`

#### <a id="mv-db15-arena"></a>Scene `mv-db15-arena`

_An hour passes and Krillin doesn’t come back. Goku gets up from the long table to go and look, with you beside him._  
_The arena is dark and the changing-room door hangs open. Goku’s bag is on the floor, its four-star ball gone._  
_Krillin is lying in the doorway. He isn’t moving, and he isn’t going to._  
**Goku** _(sad)_: Krillin? Krillin. Get up. Come on. Get up, it’s me.  
_Your Nubbins press against Krillin’s side the way they do when one of them is cold. It doesn’t help._  
_On the floor, in Krillin’s hand, is a scrap of paper. A drawing of a symbol: a single character, written like a curse._  
**Master Roshi** _(sad)_: Demon clan. The mark of the demon king. I thought… I hoped that was finished, long before your time.  
**Goku** _(angry)_: Who did this. Tell me who did this.  

**Choices**

- **“Go. We’re with you.”** — sets `{"mv-db-krillin-vow":"go"}`
    - Goku calls Nimbus, and your Nubbins jump on behind him without being asked. Their faces are set.
    - **Goku**: Look after him, Master. I’ll be back.
- **Sit with Goku by Krillin for one minute first.** — sets `{"mv-db-krillin-vow":"stayed"}`
    - For one minute Goku holds his friend’s hand, and nobody says anything. Then he stands, and calls Nimbus.
    - **Goku**: He was going to get my bag. He was just going to get my bag.

### Step 2: Catch the demon who killed Krillin.

Hint: A karate bout. Goku is exhausted from the final; Yajirobe’s food helps if you share it out first. · check: `karate:win:mv-tambourine`

#### <a id="mv-db15-tambourine"></a>Scene `mv-db15-tambourine`

_Nimbus flies all night. At dawn, over a forest, a winged demon is flying the other way, humming._  
**Tambourine** _(happy)_: Ah. The friend of the bald one. You’ve come to join him? How thoughtful.  
_Goku is tired, and the demon is fast. Goku loses the first exchange, and the second, and falls into a clearing._  
_In the clearing sits a round young man with a sword, eating a whole roast fish._  
**Yajirobe**: Oi. Whoever’s falling out of the sky, don’t land on my breakfast. I’m Yajirobe. I don’t share.  
**Goku** _(sad)_: Please. I need to eat something. I need to win.  
**Yajirobe**: …Fine. Half. Not that half. That half.  
_Your Nubbins drag over the rest of the fish while Yajirobe isn’t looking. He is looking, and he lets them._  

#### <a id="mv-db15-tambourine-done"></a>Done `mv-db15-tambourine-done`

_Fed, Goku goes back up, and the demon laughs once. Then a blue beam takes him out of the sky, and he doesn’t laugh again._  
**Goku** _(angry)_: That was for Krillin.  

### Step 3: Stand against King Piccolo.

Hint: A bout you cannot win yet. Survive it, and protect Goku when he falls. · check: `karate:finish:mv-king-piccolo-first`

#### <a id="mv-db15-king"></a>Scene `mv-db15-king`

_An airship lands in the clearing. Down the ramp walks an old, green, tall figure in a cape, leaning on a cane._  
**King Piccolo** _(angry)_: Tambourine was one of my children. You broke him. I made him, and you broke him.  
**Goku**: He killed my friend.  
**King Piccolo**: Then we are both grieving, boy. But only one of us is the Demon King. Piccolo. Remember the name for the little time you have.  
_Goku fires a Kamehameha. King Piccolo takes it full in the chest, brushes the soot off, and smiles._  
**Yajirobe** _(shock)_: Right. I’m off. Nice meeting you. Don’t die. Well, you probably will. Sorry.  
_Your Nubbins stand in front of Goku._  
_They are very small. They do not move._  

#### <a id="mv-db15-king-done"></a>Done `mv-db15-king-done`

_King Piccolo breaks Goku in four moves. Then he blasts Nimbus out of the sky in a burst of yellow cloud._  
**King Piccolo**: Leave him for the crows. Find me the rest of the martial artists. All of them.  
_When the airship is gone, Yajirobe comes back out of the bushes, heaves Goku over his shoulder, and starts walking._  

### Complete

#### <a id="mv-db15-complete"></a>Complete `mv-db15-complete`

**Yajirobe** _(angry)_: I’m only carrying you because your little round ones keep biting my ankles. That’s the only reason.  
_Yajirobe walks for a day with Goku on his back. Your Nubbins walk ahead, finding the path._  
_He’s going to a white tower he lives near, he says, where an old cat at the top keeps beans._  
**Goku** _(sad)_: Krillin… I’m sorry…  
_This was an adventure, and it isn’t any more. Your Nubbins feel it too; they stop playing, and they keep watch._  

**Rewards**

- Black Armband (cosmetic): A plain black band for any Nubbin, for Krillin. It goes away by itself in DB18.
- Ankle Biter (title): For the Nubbins that bit Yajirobe’s ankles until he carried Goku to Korin.

Sets on completion: `{"mv-db15":true,"mv-db-krillin":"fallen","mv-db-nimbus":"lost"}`

**Notes:** The line turns from adventure to war (brief). Krillin’s death: dark changing room, cut to him lying in the doorway, face turned away; no wound, no blood. The demon symbol is the Ma (魔) character; show the character on paper, no voice. Goku kills Tambourine with a Kamehameha (fade on the flash). King Piccolo breaks Goku off-panel: four quick cut-ins, then Goku on the ground. Nimbus is destroyed; Korin gives a new one in DB17 (`mv-db-nimbus` returns to `restored`). Yajirobe’s cowardice and kindness both stay. In the source Tambourine is sent to kill martial artists and takes the four-star ball from Goku’s bag for King Piccolo’s collection; it is one of the balls Piccolo wishes on in DB16, and does not affect `mv-db-balls` (set one is spent). Chapters checked from memory: ch. 136–140 (1988).

## DB16. King Piccolo

*Dragon Ball, chapters 141–160 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB15, Tambourine · requires: DB15

**Cast:** Master Roshi (Master Roshi, the Turtle Hermit (Dragon Ball)), Tien (Tien Shinhan (Dragon Ball)), Chiaotzu (Chiaotzu (Dragon Ball)), King Piccolo (King Piccolo (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball))

### Step 1: Stand with Master Roshi when he tries to seal King Piccolo.

Hint: An expedition to Piccolo’s camp. Carry the rice cooker; whatever happens, don’t drop it. · check: `expedition:complete:mv-piccolo-camp`

#### <a id="mv-db16-roshi"></a>Scene `mv-db16-roshi`

_While Goku lies at Korin’s, Roshi gathers who is left: Tien, Chiaotzu, you, your Nubbins, and an electric rice cooker._  
**Master Roshi** _(think)_: Three hundred years ago, my teacher sealed King Piccolo in a jar. It cost him his life. I know how he did it.  
**Tien**: Then teach me. I’m younger. Let me do it.  
**Master Roshi** _(soft)_: You are younger. That is why you will not. Old men are for spending, Tien. You are for afterwards.  
_He sets the rice cooker on a rock in front of Piccolo’s camp and pats it like a cat. Then he hands it to your Nubbins._  
**Master Roshi**: Little ones. When I say “now”, you put the lid on that and sit on it. Can you do that? Good. Good.  
_King Piccolo steps out of his tent, older than the hills, gathering power for his wish._  
**King Piccolo** _(happy)_: The Turtle Hermit. They sent me an antique. How touching.  
**Master Roshi** _(angry)_: They sent you the only man alive who knows this. Evil… Containment… Wave!  

**Choices**

- **Hold the rice cooker steady with your Nubbins.** — sets `{"mv-db-roshi-wave":"held"}`
    - A whirlwind of green light lifts King Piccolo off his feet and drags him, howling, towards the little jar.
    - Your Nubbins hold the cooker with every paw they have. It shakes, and they don’t let go.
- **Go to Roshi. Steady him.** — sets `{"mv-db-roshi-wave":"steadied"}`
    - You take the old man’s shoulders; he is shaking like a reed. The whirlwind roars out of his hands.
    - **Master Roshi**: Good. Hold on. Just… one more… moment…

#### <a id="mv-db16-roshi-done"></a>Done `mv-db16-roshi-done`

_The wave carries Piccolo to the very rim of the jar, and then Roshi’s strength runs out. Piccolo spills back onto the grass._  
_The old man is lying beside the rock, sunglasses crooked, very still. He spent everything, and it was a hand’s breadth short._  
**Tien** _(sad)_: Master Roshi. Not my master. But he should have been.  

### Step 2: Get to the last Dragon Ball before King Piccolo does.

Hint: A race. You won’t win it. Run it anyway; Chiaotzu is running it too. · check: `race:finish:mv-last-ball`

#### <a id="mv-db16-race"></a>Scene `mv-db16-race`

**Chiaotzu** _(think)_: He has six balls. The seventh is in the hills. If I get there first, I can wish him away. I can, Tien.  
**Tien**: Chiaotzu. No. He’ll see you coming.  
**Chiaotzu** _(soft)_: He’ll see me. He won’t see the little ones. Come with me?  
_Your Nubbins go with him, low through the grass, Chiaotzu flying a hand’s height above them._  
_Behind you, King Piccolo is following at a walk._  
_He doesn’t need to hurry. He never needs to hurry._  
_The ball is in a cleft in the rock, and Chiaotzu’s hand is on it. Then a shadow falls over all three of them._  
**King Piccolo**: You wanted to make a wish, small one. Here is mine.  

#### <a id="mv-db16-race-done"></a>Done `mv-db16-race-done`

_A flash, and Chiaotzu is gone. Your Nubbins are thrown into the bushes and, by some mercy, overlooked._  
_Far behind, Tien screams his friend’s name across the whole valley._  

### Complete

#### <a id="mv-db16-complete"></a>Complete `mv-db16-complete`

_Seven balls on the grass, and the sky goes black. Shenron rises, coil on coil._  
**King Piccolo**: Give me back my youth. Give me back the strength I had three hundred years ago.  
**Shenron**: …It is done.  
_King Piccolo stands straight and young and green and terrible. Then he looks up at the dragon, and smiles._  
**King Piccolo**: And now, no one will ever wish me away.  
_One blast, and Shenron falls in pieces out of the sky. The seven balls go grey and drop like stones, and stay stones._  
_That night, every radio in the world crackles: King Piccolo announces himself king of the world._  
**Tien** _(angry)_: Goku. Wherever you are. Get up.  

**Rewards**

- Roshi’s Rice Cooker (decor): A small electric rice cooker with a dented lid. It doesn’t cook. It sits in the Grove where your Nubbins can see it.
- Crooked Sunglasses (cosmetic): A pair of Roshi’s sunglasses, a little bent. Wearable by any Nubbin.

Sets on completion: `{"mv-db16":true,"mv-db-roshi":"fallen","mv-db-chiaotzu":"fallen","mv-db-shenron":"dead"}`

**Notes:** Roshi dies using the Evil Containment Wave (Mafūba) and missing the jar by a hand’s breadth. In the source his failure has its own cause (check chapters); the hand’s-breadth version is ours. His death: he lies down, sunglasses crooked, no wound. Chiaotzu is killed reaching for the last ball; white flash, then empty grass. Piccolo’s wish for youth and the killing of Shenron follow the source. These balls were gathered by Pilaf and Piccolo, not the party: `mv-db-balls` stays at 7. Shenron’s death turns the balls to stone until DB18 (`mv-db-shenron`). Pilaf’s gang freeing Piccolo can be told in a one-panel flashback if the implementer wants it. Chapters checked from memory: ch. 141–160 (1988).

## DB17. Goku vs. King Piccolo

*Dragon Ball, chapters 161–166 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB16, King Piccolo · requires: DB16

**Cast:** Goku (Son Goku (Dragon Ball)), Korin (Korin, the cat sage of Korin Tower (Dragon Ball)), Yajirobe (Yajirobe (Dragon Ball)), Tien (Tien Shinhan (Dragon Ball)), King Piccolo (King Piccolo (Dragon Ball))

### Step 1: Watch over Goku while he drinks Korin’s Ultra Divine Water.

Hint: Talk to Korin. The water is real this time, and it is poison. Stay with Goku until it passes. · check: `talk:mv-korin-ultra-water`

#### <a id="mv-db17-water"></a>Scene `mv-db17-water`

_Top of Korin Tower. Goku is mended with one of Korin’s beans, furious, and not strong enough, and he knows it._  
**Goku** _(angry)_: There has to be something. Korin. There has to be something stronger than chasing you.  
**Korin** _(think)_: There is. The Ultra Divine Water. It is not water. It is poison.  
**Korin**: It will either kill you or wake up everything you have in you. Most die. One survived. That was a long time ago.  
**Yajirobe** _(shock)_: Don’t drink it. You’re an idiot. Don’t drink it.  
**Goku**: If I don’t, Piccolo wins. Then everyone gets hurt. Sorry, Yajirobe.  
_He drinks. He goes stiff, then grey, then he falls and doesn’t breathe properly for a long, long time._  
**Korin**: Now we wait. Talk to him. The dying sometimes find their way back by a voice.  

**Choices**

- **Talk to him. About Krillin, Roshi, everyone.** — sets `{"mv-db-ultra-water":"voice"}`
    - You talk for hours: the milk round, the shark, Upa’s beginner spear, Bulma’s dress in the river.
    - Near dawn, Goku laughs in his sleep. Korin raises an eyebrow.
- **Let the Nubbins curl up against him.** — sets `{"mv-db-ultra-water":"nubbins"}`
    - Your Nubbins curl into his arms and his neck, the way they do on cold nights. They hum all night without stopping.
    - **Yajirobe**: …That’s actually quite nice. Don’t tell anyone I said that.

#### <a id="mv-db17-water-done"></a>Done `mv-db17-water-done`

_Goku opens his eyes, and something has changed behind them. He sits up, and the tower creaks under him._  
**Korin**: Well. Make that two survivors. And here. A new cloud. I keep spares.  

### Step 2: Get through King Piccolo’s son at the gates of King Castle.

Hint: A short karate bout. Goku only needs one punch now. Make it count. · check: `karate:win:mv-drum`

#### <a id="mv-db17-castle"></a>Scene `mv-db17-castle`

_King Castle is the capital, and Piccolo sits on its throne. The king of the world, the real one, is his prisoner._  
_At the gate stands another of Piccolo’s children, a huge pink-and-green brute with spikes on his shoulders._  
_Tien is on the ground in front of him, holding his ribs, and getting up again, and being knocked down again._  
**Tien** _(happy)_: Goku. Took you long enough. I thought I’d have to do it all myself.  
**Goku**: Rest, Tien. I’ve got this.  
_The brute swings, and Goku catches the fist._  
_One punch back, and the brute is not there any more._  
_On the balcony above, King Piccolo stands up, and for the first time in three hundred years he looks interested._  

### Step 3: Fight King Piccolo for the world.

Hint: The line’s hardest karate bout. When Goku’s arms are gone, use what’s left: a Kamehameha fired backwards. · check: `karate:win:mv-king-piccolo`

#### <a id="mv-db17-final"></a>Scene `mv-db17-final`

**King Piccolo** _(angry)_: The monkey boy. I broke you. You should have stayed broken.  
**Goku**: I got better.  
_They fight across the city; roofs fall in and the palace bells ring by themselves. Your Nubbins stay with Tien and the king._  
_Piccolo breaks Goku’s arm, then his leg. Goku fights on one leg and one arm, and it is still not over._  
**King Piccolo** _(angry)_: Enough! If you won’t lie down, then the city will. Everyone in it.  
_He raises his hands to the sky. Your Nubbins stand up on the rubble where everyone can see them._  
**Goku** _(angry)_: Little ones! Get everybody down!  
_Goku points his one good hand at the ground behind him. He fires a Kamehameha into it, and himself into the air._  

**Choices**

- **Get the people under cover with your Nubbins.** — sets `{"mv-db-piccolo-fight":"cover"}`
    - You and your Nubbins pull people behind walls, under carts, down cellar steps. Every second counts.
    - One grandmother will not leave her cabbages. Your Nubbins carry the cabbages down the cellar steps, and she follows them.
- **Shout Goku’s name, loud enough to carry.** — sets `{"mv-db-piccolo-fight":"shout"}`
    - You shout, and the whole city shouts with you. Piccolo’s head turns, just for a heartbeat.
    - A heartbeat is all a boy flying on his own Kamehameha needs.

#### <a id="mv-db17-final-done"></a>Done `mv-db17-final-done`

_Goku flies through the air like a thrown stone, fist first, and goes straight through King Piccolo._  
_Piccolo stands for a moment with a hole in him where his heart would be. Then he begins to come apart._  

### Complete

#### <a id="mv-db17-complete"></a>Complete `mv-db17-complete`

**King Piccolo** _(angry)_: You think you have won, monkey. You have only made me an orphan’s father.  
_With his last breath, King Piccolo spits out an egg. It cracks a little as it flies, out over the walls, towards the mountains._  
_Then the Demon King is dust on the wind, and the city is quiet._  
**Tien** _(soft)_: He’s gone. Goku, he’s gone.  
_Goku lies on the rubble with both arms broken, grinning at the sky. Your Nubbins sit on his chest so he doesn’t try to get up._  
**Goku** _(sad)_: Krillin’d have loved that. That was a good one.  
**Yajirobe**: Here. Bean. I found it in my pocket. I definitely did not keep one back for myself.  

**Rewards**

- Demon Breaker (title): For Nubbins that stood on the rubble of King Castle in front of the Demon King.
- Little Cloud Cushion (decor): A soft yellow cushion shaped like Nimbus. Nubbins nap on it and drift a little.

Sets on completion: `{"mv-db17":true,"mv-db-nimbus":"restored","mv-db-piccolo-egg":true}`

**Notes:** Goku’s victory: fired by a backwards Kamehameha, he punches through King Piccolo (source). Broken limbs implied by Goku’s posture, never shown bending. Piccolo’s death is a fade to dust; no gore. The egg holding his son flies off: `mv-db-piccolo-egg` sets up Ma Junior (DB20) and E4. The brute at the gate is Drum, one of Piccolo’s children; name it on the karate screen only. Yajirobe killed Cymbal off-screen in the source; leave it out. Korin’s spare Nimbus replaces the one destroyed in DB15. Chapters checked from memory: ch. 161–166 (1988).

## DB18. Kami’s Lookout

*Dragon Ball, chapters 167–180 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB17, Goku vs. King Piccolo · requires: DB17

**Cast:** Goku (Son Goku (Dragon Ball)), Korin (Korin, the cat sage of Korin Tower (Dragon Ball)), Mr. Popo (Mr. Popo, Kami’s attendant (Dragon Ball)), Kami (Kami, guardian of the Earth (Dragon Ball)), Shenron (Shenron, the Eternal Dragon (Dragon Ball)), Krillin (Krillin (Dragon Ball)), Bulma (Bulma (Dragon Ball))

### Step 1: Climb from the top of Korin Tower to Kami’s Lookout.

Hint: A climbing race up Goku’s staff, set in the hole in Korin’s ceiling. It reaches. Don’t look down. · check: `race:finish:mv-lookout-climb`

#### <a id="mv-db18-staff"></a>Scene `mv-db18-staff`

**Goku** _(sad)_: Korin. The dragon’s dead. Krillin can’t come back. Nobody can come back. Is there anybody who can fix the dragon?  
**Korin** _(think)_: There is the one who made him. Kami, the guardian of the Earth. He lives above us.  
**Goku**: Above? There’s nothing above. Just sky.  
**Korin**: Your staff. The one your grandfather gave you. It was mine before it was his. Put it in that hole in my ceiling.  
_Goku sets the end of his staff in a socket in Korin’s ceiling. It fits as if it was made for it, because it was._  
**Goku** _(happy)_: Staff! Get long! Longer than ever!  
_The staff stretches up, and up, through cloud, until it touches the bottom of something enormous hanging in the sky._  
**Korin**: Climb. Take the small ones. Kami is fond of small things.  

#### <a id="mv-db18-staff-done"></a>Done `mv-db18-staff-done`

_At the top, a white palace sits on a dish in the sky. A short, round genie in a turban and waistcoat is watering the flowers._  
**Mr. Popo** _(happy)_: Hello. I have been waiting. I knew you would come. Please wipe your feet.  

### Step 2: Ask Kami to bring back Shenron.

Hint: Talk to Kami. He has a secret. Hear him out before you judge him. · check: `talk:kami`

#### <a id="mv-db18-kami"></a>Scene `mv-db18-kami`

_Kami is very old and very green, with antennae and a long robe. Goku freezes at the sight of him._  
**Goku** _(shock)_: You… you look like him. Like Piccolo.  
**Kami** _(sad)_: Yes. Once, long ago, he and I were one being. To become Kami, I had to cast out all the evil in me.  
**Kami**: The evil became King Piccolo. Everything he did was what I put out of myself. Do you understand?  
**Goku** _(angry)_: So it’s your fault?  
**Kami**: It is my responsibility. That’s worse. And if he dies, I die. We still share one life.  
_Your Nubbins look from Kami to Goku and back. Then one of them walks over and leans on Kami’s staff._  
**Kami** _(soft)_: I made Shenron. I can make him again. I will. It is the least I owe the people he would have saved.  

**Choices**

- **“You’re trying to fix it. That counts.”** — sets `{"mv-db-kami":"forgiven"}`
    - **Kami**: Thank you. I’ve waited three hundred years for someone to say that, and it’s a Keeper from another world.
- **“Fix it first. Then we’ll talk.”** — sets `{"mv-db-kami":"held-to-account"}`
    - **Kami**: That is fair. That is entirely fair.
    - **Mr. Popo**: I like this one. This one gets extra tea.

#### <a id="mv-db18-kami-done"></a>Done `mv-db18-kami-done`

_Kami raises his hands. Far below, all over the world, seven grey stones begin to glow orange again._  
**Kami** _(soft)_: The balls are scattered, and someone must find them again. But the dragon lives. That much I could mend.  

### Step 3: Train under Mr. Popo until you land a hit.

Hint: A sparring bout that counts touches, not wins. Nobody beats Mr. Popo. One touch is a triumph. · check: `karate:land-hit:mv-mr-popo`

#### <a id="mv-db18-popo"></a>Scene `mv-db18-popo`

**Mr. Popo** _(happy)_: Kami says you will train here, Goku. I will teach. First lesson: hit me.  
**Goku**: Hit you? You’re all round and little. I don’t want to hurt you.  
**Mr. Popo**: I am not worried.  
_Goku swings. Mr. Popo is on the other side of him, watering a rose._  
_Goku, who beat King Piccolo, swings for an hour and touches nothing. Your Nubbins don’t touch anything either._  
**Mr. Popo**: You fight with your fists, Goku. Fight with everything. Ears. Nose. Feet. The little ones already do.  
**Goku** _(think)_: The little ones? They’re just… oh. They’re watching where you’re going to be, not where you are.  
**Mr. Popo**: I am impressed. A little. Do not let it go to your heads.  

#### <a id="mv-db18-popo-done"></a>Done `mv-db18-popo-done`

_On the fourth day, your smallest Nubbin brushes Mr. Popo’s sleeve with one paw._  
_Mr. Popo bows to it, all the way down._  

### Complete

#### <a id="mv-db18-complete"></a>Complete `mv-db18-complete`

_Far below, Bulma, Yamcha and Oolong race the world with a radar, gathering the glowing balls one by one._  
_From the edge of the Lookout you watch a column of green rise out of a city park. Shenron is back._  
**Bulma** _(happy)_: Shenron! Bring back everyone King Piccolo and his demons killed! All of them! Every last one!  
**Shenron**: It is a large wish. I have been dead a while. I will allow it.  
_In a changing room on Papaya Island, a bald boy sits up and asks where everyone went._  
**Krillin** _(happy)_: Goku? Goku, are you up there? Bulma says you’re in the sky. Of course you are. Come down when you’re done!  
_Goku doesn’t say anything for a long time. He just sits at the edge of the Lookout and grins, and cries, and grins._  
**Kami**: Three years until the next tournament. You will spend them here, and on the road. You have a long way to go yet.  

**Rewards**

- Mr. Popo’s Tea (item): A tin of tea from the Lookout. A cup calms an anxious Nubbin for a whole day.
- Brushed the Sleeve (title): For the Nubbin that brushed Mr. Popo’s sleeve. Very few have.
- Lookout Flowerbed (decor): A white stone flowerbed from Kami’s palace. Its flowers always face the waterfall.

Sets on completion: `{"mv-db18":true,"mv-db-shenron":"restored","mv-db-krillin":"revived","mv-db-roshi":"revived","mv-db-chiaotzu":"revived"}`

**Notes:** Kami restores Shenron; Bulma’s team gathers the balls and wishes back everyone Piccolo and his demons killed (Krillin, Roshi, Chiaotzu and others). Those balls are Bulma’s gathering, not the party’s: `mv-db-balls` stays at 7, and they turn to stone for a year after the wish, which is why set two starts partway through DB19. Goku’s staff fits Korin’s ceiling and reaches the Lookout (source). The DB15 Black Armband reward disappears from the wardrobe here. Mr. Popo: render with care. The source design is a blackface caricature; use the game’s own respectful redesign (blue-skinned genie, turban, waistcoat), as several later releases do. He speaks in the first person with quiet authority, never the source’s servile third-person speech. Kami and Piccolo share one life (needed for E4). Chapters checked from memory: ch. 167–180 (1988–89).

## DB19. Three Years

*Dragon Ball, chapters 181–188 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB18, Kami’s Lookout · requires: DB18

**Cast:** Goku (Son Goku (Dragon Ball)), Tien (Tien Shinhan (Dragon Ball)), Yamcha (Yamcha, the desert bandit (Dragon Ball)), Chiaotzu (Chiaotzu (Dragon Ball)), Kami (Kami, guardian of the Earth (Dragon Ball)), Bulma (Bulma (Dragon Ball))

### Step 1: Learn to fly Nimbus on your own.

Hint: A flying race, Nubbins only. Lean to turn, sit back to slow. The cloud wants you to do well. · check: `race:finish:mv-nimbus-solo:fly`

#### <a id="mv-db19-nimbus"></a>Scene `mv-db19-nimbus`

_Goku leaves the Lookout with a backpack and no plan. Kami says to see the world, and Goku intends to see all of it._  
**Goku** _(happy)_: Little ones. You’ve ridden Nimbus a hundred times. I think it’s time you drove.  
_Nimbus dips down in front of your Nubbins and waits. It is the waiting of a big friendly dog with a ball._  
**Goku**: Lean that way to go that way. Sit back to stop. If you fall off, it catches you. Usually.  
**You**: Usually?  
**Goku** _(happy)_: It caught me every time but one. The one time was a really good lesson.  
_Your bravest Nubbin climbs on alone. The cloud lifts it gently, then a bit less gently, then whoosh._  
_It loops a tree, screaming with joy. The others are already climbing on behind it._  

#### <a id="mv-db19-nimbus-done"></a>Done `mv-db19-nimbus-done`

_By sunset your Nubbins can fly Nimbus over the treetops, through a waterfall, and back to Goku’s hand._  
**Goku** _(happy)_: See? Pure hearts. Told you. Best drivers in the world.  

### Step 2: Travel the world with Goku, and gather Dragon Balls on the way.

Hint: A long expedition in stages. The radar Bulma gave you finds the balls once they wake from stone. Fly between stops. · check: `expedition:complete:mv-three-years-road`

#### <a id="mv-db19-road"></a>Scene `mv-db19-road`

_A year on the road. Goku works for his meals: wood-chopping, river-ferrying, wrestling a bear for a village bet._  
_In the second spring a capsule-copter lands in a turnip field beside you. Bulma climbs out, and the farmer faints._  
**Bulma**: Here. A new radar. The balls woke up this morning, one year since the last wish, on the dot.  
**Bulma** _(think)_: Gather them. Not for a wish now. Just, I don’t know. It feels like we’ll need one later. Call it a hunch.  
_Your Nubbins fly Nimbus ahead to scout, and come back with the radar’s blips marked in mud on a map._  
_A ball in a pond full of frogs. A ball in a pagoda bell._  
_A ball under the pillow of a very old, very cross man._  
**Goku** _(happy)_: Excuse me, can I borrow your ball? I’ll swap you for… a fish? A rock? A hug?  
_The old man takes the hug. He hasn’t had one in a while._  

**Choices**

- **Keep the balls safe, in Bulma’s capsule case.** — sets `{"mv-db-set2-keeping":"capsule"}`
    - The capsule case clicks shut. It weighs almost nothing, which is the most unsettling thing about it.
- **Let your Nubbins carry them, one each, turn and turn about.** — sets `{"mv-db-set2-keeping":"nubbins"}`
    - Your Nubbins take it in turns to hold a ball through the night. Whoever is holding one sleeps best.

#### <a id="mv-db19-road-deal-truth"></a>Variant `mv-db19-road-deal-truth`

_Variant of `mv-db19-road`._

_A year on the road. Goku works for his meals: wood-chopping, river-ferrying, wrestling a bear for a village bet._  
_In the second spring a capsule-copter lands in a turnip field beside you. Bulma climbs out, and the farmer faints._  
**Bulma**: Here. A new radar. The balls woke up this morning, one year since the last wish, on the dot.  
**Bulma** _(think)_: Gather them. Not for a wish now. Just, I don’t know. It feels like we’ll need one later. Call it a hunch.  
**Goku** _(happy)_: You kept the deal. One wish, and you gave the ball back. So I’ll carry them for you again.  
**Bulma**: I didn’t say it was for me this time.  
_Your Nubbins fly Nimbus ahead to scout, and come back with the radar’s blips marked in mud on a map._  
_A ball in a pond full of frogs. A ball in a pagoda bell._  
_A ball under the pillow of a very old, very cross man._  
**Goku** _(happy)_: Excuse me, can I borrow your ball? I’ll swap you for… a fish? A rock? A hug?  
_The old man takes the hug. He hasn’t had one in a while._  

**Choices**

- **Keep the balls safe, in Bulma’s capsule case.** — sets `{"mv-db-set2-keeping":"capsule"}`
    - The capsule case clicks shut. It weighs almost nothing, which is the most unsettling thing about it.
- **Let your Nubbins carry them, one each, turn and turn about.** — sets `{"mv-db-set2-keeping":"nubbins"}`
    - Your Nubbins take it in turns to hold a ball through the night. Whoever is holding one sleeps best.

#### <a id="mv-db19-road-deal-pitch"></a>Variant `mv-db19-road-deal-pitch`

_Variant of `mv-db19-road`._

_A year on the road. Goku works for his meals: wood-chopping, river-ferrying, wrestling a bear for a village bet._  
_In the second spring a capsule-copter lands in a turnip field beside you. Bulma climbs out, and the farmer faints._  
**Bulma**: Here. A new radar. The balls woke up this morning, one year since the last wish, on the dot.  
**Bulma** _(think)_: Gather them. Not for a wish now. Just, I don’t know. It feels like we’ll need one later. Call it a hunch.  
**Bulma** _(happy)_: And before you ask: yes, there are restaurants on the way. I checked. Three fish minimum.  
**Goku** _(happy)_: Three! Keeper, did you hear? Three.  
_Your Nubbins fly Nimbus ahead to scout, and come back with the radar’s blips marked in mud on a map._  
_A ball in a pond full of frogs. A ball in a pagoda bell._  
_A ball under the pillow of a very old, very cross man._  
**Goku** _(happy)_: Excuse me, can I borrow your ball? I’ll swap you for… a fish? A rock? A hug?  
_The old man takes the hug. He hasn’t had one in a while._  

**Choices**

- **Keep the balls safe, in Bulma’s capsule case.** — sets `{"mv-db-set2-keeping":"capsule"}`
    - The capsule case clicks shut. It weighs almost nothing, which is the most unsettling thing about it.
- **Let your Nubbins carry them, one each, turn and turn about.** — sets `{"mv-db-set2-keeping":"nubbins"}`
    - Your Nubbins take it in turns to hold a ball through the night. Whoever is holding one sleeps best.

#### <a id="mv-db19-road-deal-asked"></a>Variant `mv-db19-road-deal-asked`

_Variant of `mv-db19-road`._

_A year on the road. Goku works for his meals: wood-chopping, river-ferrying, wrestling a bear for a village bet._  
_In the second spring a capsule-copter lands in a turnip field beside you. Bulma climbs out, and the farmer faints._  
**Bulma**: Here. A new radar. The balls woke up this morning, one year since the last wish, on the dot.  
**Bulma** _(think)_: Gather them. Not for a wish now. Just, I don’t know. It feels like we’ll need one later. Call it a hunch.  
**Bulma** _(think)_: You said you wanted to find the strong ones. Kami says one is coming to the tournament. Think of this as the route.  
**Goku** _(think)_: Then I’d better be strong by then.  
_Your Nubbins fly Nimbus ahead to scout, and come back with the radar’s blips marked in mud on a map._  
_A ball in a pond full of frogs. A ball in a pagoda bell._  
_A ball under the pillow of a very old, very cross man._  
**Goku** _(happy)_: Excuse me, can I borrow your ball? I’ll swap you for… a fish? A rock? A hug?  
_The old man takes the hug. He hasn’t had one in a while._  

**Choices**

- **Keep the balls safe, in Bulma’s capsule case.** — sets `{"mv-db-set2-keeping":"capsule"}`
    - The capsule case clicks shut. It weighs almost nothing, which is the most unsettling thing about it.
- **Let your Nubbins carry them, one each, turn and turn about.** — sets `{"mv-db-set2-keeping":"nubbins"}`
    - Your Nubbins take it in turns to hold a ball through the night. Whoever is holding one sleeps best.

#### <a id="mv-db19-road-done"></a>Done `mv-db19-road-done`

_Five Dragon Balls by the end of the second year._  
_Goku forgets about them for weeks at a time. Your Nubbins never do._  

### Step 3: Visit Tien, Yamcha and Chiaotzu training on the Lookout.

Hint: Fly Nimbus up to Kami’s palace. Talk to Tien. Watch Yamcha try to land a hit on Mr. Popo; it is very good for morale. · check: `talk:mv-tien-lookout`

#### <a id="mv-db19-lookout"></a>Scene `mv-db19-lookout`

_Your Nubbins fly you up to the Lookout on Nimbus._  
_You do not fall through. You are sitting in their lap, and it counts._  
_Tien is meditating on one finger, and Chiaotzu floats beside him. Yamcha is lying flat on the tiles, panting._  
**Yamcha** _(sad)_: Popo. That man. That man is made of air and spite. I touched his hat once. I’m going to put it on my gravestone.  
**Tien** _(think)_: Kami took us in after Goku left. He says something is coming at the next tournament. Something he fears.  
**Chiaotzu** _(think)_: He won’t say what. He keeps looking at the mountains where the egg went.  
**Kami**: Tell Goku to be ready. That is all I can say for now. Some secrets I keep because I must, not because I want to.  
_Your Nubbins sit beside Chiaotzu and think about cake. He laughs for the first time in two years._  

### Complete

#### <a id="mv-db19-complete"></a>Complete `mv-db19-complete`

_Three years. Goku is taller than Yamcha now, and his clothes have been patched more times than they’ve been washed._  
**Goku** _(happy)_: I think I’m ready. I don’t know for what. But I’m ready.  
_Five balls in the capsule case, and two more somewhere. The radar is flickering towards Papaya Island._  
**Goku** _(happy)_: Little ones, you drive. I want a nap.  
_Your Nubbins fly Nimbus south, over the sea, with Goku snoring and you holding the radar. They don’t drop anybody._  

**Rewards**

- Nimbus Flight (feature): Your Nubbins can fly Nimbus on their own. In the Dragon Ball line, Nimbus becomes a Nubbin-driven mount for travel and races.
- Road-Patched Gi (cosmetic): A martial-arts gi patched in seven places. Wearable by any Nubbin.

Sets on completion: `{"mv-db19":true,"mv-db-balls":12}`

**Notes:** Nubbins learn to fly Nimbus (brief requirement); the Keeper rides only as their passenger. Set two begins: five balls gathered, `mv-db-balls` = 12 (7 from set one + 5). The balls wake one year after the DB18 wish, as the source rule goes. Bulma’s hunch to save a wish is our addition, setting up E4. Tien, Yamcha and Chiaotzu train under Kami and Mr. Popo (source). Kami’s unease is about Piccolo’s egg. Chapters checked from memory: ch. 181–188 (1989).

## DB20. The 23rd Budokai Begins

*Dragon Ball, chapters 189–194 (approx.)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After DB19, Three Years · requires: DB19

**Cast:** Goku (Son Goku (Dragon Ball)), Krillin (Krillin (Dragon Ball)), Bulma (Bulma (Dragon Ball)), Chi-Chi (Chi-Chi, the Ox-King’s daughter (Dragon Ball)), The Ox-King (Gyū-Maō, the Ox-King (Dragon Ball)), Shen (Kami fighting in a borrowed body under the name Shen (Dragon Ball ch. 191–194)), Ma Junior (Piccolo Jr., entered under the name Ma Junior (Dragon Ball)), The Announcer (The World Martial Arts Tournament announcer (Dragon Ball))

### Step 1: Meet everyone at Papaya Island for the 23rd Tournament.

Hint: Talk to Krillin by the entrance. Everyone is here. Everyone, and one stranger. · check: `talk:mv-23rd-reunion`

#### <a id="mv-db20-arrival"></a>Scene `mv-db20-arrival`

_Papaya Island, the 23rd World Martial Arts Tournament. Goku lands on Nimbus, steered by your Nubbins, and nobody recognises him._  
**Krillin** _(happy)_: Excuse me, sir, is that… No. Goku? You’re enormous! You’re taller than me! You were always taller than me, but now it’s rude.  
**Bulma** _(happy)_: Look at you! You grew up handsome. That’s annoying. Here. Krillin found you something.  
**Krillin**: Found it in a bakery in a loaf of bread. Didn’t eat it. Thought you’d want it.  
_A Dragon Ball. Six in the capsule case now._  
_Across the courtyard stands a figure in a white cloak and a white turban, very still. People walk around him without knowing why._  
**Ma Junior** _(angry)_: Son Goku. So. You are the one.  
_Your Nubbins have stopped, every hair on end. They have felt this once before, in a burned city._  

#### <a id="mv-db20-arrival-done"></a>Done `mv-db20-arrival-done`

_He has signed in as Ma Junior, and nobody knows anything about him. Goku looks at him for a long, quiet moment._  
**Goku** _(think)_: He feels like Piccolo. A bit. But younger. And… different?  

### Step 2: Get Goku through his bout with the mysterious girl.

Hint: A karate bout with a fighter who knows exactly who Goku is. Win it, then listen to her. · check: `karate:win:mv-chi-chi`

#### <a id="mv-db20-chichi"></a>Scene `mv-db20-chichi`

_In the bracket, Goku draws a tall, fierce girl with her hair tied back. She fights like a storm with a grievance._  
**Chi-Chi** _(angry)_: Do you remember me? Do you? Because I remember you. Every day for years, I remember you!  
_Her first kick takes a corner off the ring. The Announcer quietly moves his microphone stand further back._  
**Goku** _(think)_: Um. Did I eat your lunch?  
**Chi-Chi** _(angry)_: You promised to marry me! On Fire Mountain! Then you flew off on a cloud!  
_Your Nubbins look at each other. They were there, and they have been waiting for this for a very long time._  
**Goku** _(shock)_: Chi-Chi! Oh! I thought marry was food.  
**Chi-Chi**: It is NOT food!  
_Goku wins, gently. She ends up sitting on the stone with him crouched beside her, the crowd silent._  

**Choices**

- **Nudge Goku. A promise is a promise.** — sets `{"mv-db-chichi":"nudged"}`
    - **Goku**: I said I would. So I will. Chi-Chi, let’s get married. I still don’t really know what it is.
    - **Chi-Chi**: I’ll teach you! I’ll teach you everything! Oh, you idiot. You wonderful idiot.
- **Say nothing. Let Goku decide this one himself.** — sets `{"mv-db-chichi":"his-choice"}`
    - **Goku**: You waited all this time? For me? Nobody ever waited for me. Okay. Yes. Let’s do the marry thing.
    - Chi-Chi bursts into tears and the crowd into cheers. The Ox-King bursts through a barrier.

#### <a id="mv-db20-chichi-done"></a>Done `mv-db20-chichi-done`

**The Ox-King** _(happy)_: My boy! My son-in-law! Here. A wedding gift. It was in the treasury, under the axes.  
_He presses something round and orange into Goku’s hand. The seventh Dragon Ball._  

### Step 3: Spar with the quiet stranger called Shen.

Hint: A short test bout. Shen is holding back; so should you. The bell will end it. · check: `karate:finish:mv-shen-spar`

#### <a id="mv-db20-shen"></a>Scene `mv-db20-shen`

_In the warm-up yard, a thin, ordinary-looking man watches Goku train. He has a gentle face and old, old eyes._  
**Shen** _(happy)_: Your stance is good. Your left guard drops when you’re excited. It was dropping at the Lookout too.  
**Goku** _(shock)_: At the… How do you know about the Lookout?  
**Shen**: I know a lot of things. Shall we see how much you know?  
_They spar. Shen moves like Mr. Popo’s garden: patient, unhurried, impossible to surprise._  
_Your Nubbins sit very still. They know that smell: flowers in white stone pots, and tea._  
**Shen** _(soft)_: The little ones have guessed, I think. Don’t tell him yet. He has to find out for himself in the ring.  
**The Announcer**: Fighters! The main tournament begins in ten minutes!  

#### <a id="mv-db20-shen-done"></a>Done `mv-db20-shen-done`

**Shen**: Good. Very good. Show me the rest in the ring, in front of everyone.  
_He walks away. In the shade of the temple, the cloaked man turns his head to watch him go._  

### Complete

#### <a id="mv-db20-complete"></a>Complete `mv-db20-complete`

_Seven Dragon Balls glow in the capsule case. Your Nubbins open it a crack to look, and close it again._  
**Bulma** _(think)_: Seven. Two whole sets, you lot. Don’t spend it. Not yet. My hunch is getting louder.  
_The bracket goes up on the wall: Goku, Chi-Chi, Tien, Mercenary Tao, Krillin, Yamcha, a man called Shen, and a cloaked fighter called Ma Junior._  
**Chi-Chi** _(happy)_: You’re going to win, and then we’re getting married. In that order. Don’t lose.  
**Goku** _(happy)_: I never lose on purpose. Only by accident.  
**Ma Junior** _(angry)_: Enjoy it while you can, Son Goku. My father waited three hundred years. I have waited three.  
_Your Nubbins claim front-row seats on top of the Announcer’s microphone stand. He lets them. He has met Goku before._  
_The gong sounds, and the 23rd World Martial Arts Tournament begins. With it begins the end of the story._  

**Rewards**

- Second Set of Seven (flag): All seven Dragon Balls, gathered again. One wish, saved, to spend at the 23rd Budokai or carry on with you.
- Ox-King’s Wedding Lantern (decor): A huge red lantern from the Ox-King, for Goku’s wedding. He sent you one too. He insisted.
- Dragon Ball Line Complete (flag): Completes the Dragon Ball line (DB1–DB20) and opens the 23rd Budokai (E4).

Sets on completion: `{"mv-db20":true,"mv-db-balls":14,"mv-db-set2":true,"mv-db-wish":"ready","mv-db-complete":true}`

**Notes:** Completes the line and the second set: `mv-db-balls` = 14, `mv-db-set2` = true, `mv-db-wish` = `ready`. E4 offers the wish choice (spend now, or save as `wish = saved` for the final endgame). Ball six comes from Krillin, ball seven from the Ox-King’s treasury; both are our adaptation (the source has no ball hunt here). Chi-Chi bout: in the source she fights Goku in the first round of the main tournament; the brief puts it in the preliminaries, and the step is staged as a prelim bout. Goku’s proposal pays off `mv-db-chichi-promise` from DB4. Shen is Kami in a borrowed body; this spar is his only bout with Goku. In E4, as in the source, Shen beats Yamcha and fights Ma Junior, and Goku’s semi-final is against Tien. Ma Junior is Piccolo Jr.; he is never named Piccolo here. Chapters checked from memory: ch. 189–194 (1989).
