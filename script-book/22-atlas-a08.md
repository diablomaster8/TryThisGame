# Atlas, page A8: The Twelve Tasks

## A8-1. Caesar’s Challenge

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): the challenge* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Vitalstatistix (Vitalstatistix, the village chief, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Getafix (Getafix, the village druid, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Step into the small green dot on the map of Gaul.

Hint: Everything else on the map is Roman red. Look by the sea, top left. · check: `visit:a08-page:village`

#### Scene `a08-01-map`

_Nova’s atlas falls open at a map of Gaul, the year about 50 BC. It is painted Roman red from the mountains to the sea._  
_Not quite all of it. Up in the corner, by the sea, there is one small green dot that the red has gone carefully round._  
_Four little Roman camps sit round the dot like cats round a hedgehog, not sure where to start._  
_You put your finger on the green dot. It is warm, and smells faintly of roast boar._  
_Then you are standing in a beech wood, with your Nubbin at your feet and birdsong everywhere._  
_Something small and white shoots out of the bracken, stops nose to nose with your Nubbin, and wags so hard it nearly falls over._  
_It is a very small dog with a black tip to his ear. He and your Nubbin look at each other for a long, serious moment._  

**Choices**

- **Let them work it out.**
    - They work it out in about two seconds: a lot of circling, one sneeze, and then they are best friends.
- **Crouch down and hold out a hand.**
    - The dog licks your hand once, politely, then goes straight back to your Nubbin. You know your place.

#### Done `a08-01-map-done`

_Two men come crashing through the trees after the dog: one small with a winged helmet, one enormous, with a boar under each arm._  
**Obelix** _(happy)_: Dogmatix! Oh. He’s found a friend. Look, Asterix, a little round friend.  

### Step 2: Go to the village and hear what the Romans want.

Hint: Follow Obelix and the boars. Everyone in the village is in the square. · check: `watch:a08-caesar:challenge`

#### Scene `a08-01-square`

_The village is round, fenced, and loud. In the square, a chief stands on a shield held up by two men who are clearly tired of holding it._  
_Opposite him is a thin Roman in a very clean toga, holding a scroll and an expression of great patience._  
**Caius Pupus**: I am Caius Pupus, and I bring the words of Julius Caesar. Ahem. Caesar has heard it said in Rome that you Gauls are gods.  
**Caius Pupus**: Caesar does not believe this. Caesar proposes twelve tasks, like the twelve labours of Hercules. Pass them all, and you are gods.  
**Caius Pupus**: Fail one, and you are not gods, and you will kindly become Roman. Like everybody else.  
**Vitalstatistix** _(happy)_: Twelve tasks! Ha! We’ll do thirteen. Fourteen, if there’s lunch.  
**Asterix**: Who decides whether we’ve passed? Not a Roman. You’d fail us for breathing.  
**Caius Pupus** _(think)_: And not a Gaul. You would pass yourselves for sneezing.  
_There is a pause. Every eye in the square slowly turns to the one person who is neither, standing at the back with a Nubbin and a dog._  

**Choices**

- **“All right. I’ll referee.”**
    - **Vitalstatistix**: Splendid! A referee from the land of books. Nobody can say fairer than that.
- **“Me? I only came in through a map.”**
    - **Asterix**: Exactly. You don’t owe anybody anything. That’s what makes you fair.
    - You find you can’t argue with that.

#### Done `a08-01-square-done`

_Pupus hands you a wax tablet. Down its side, in neat Roman numerals, it counts from I to XII, and every line is blank._  

#### Complete `a08-01-complete`

_Getafix, the druid, white-bearded and unhurried, stirs a cauldron by his hut. He ladles a flask full for Asterix._  
**Getafix**: The potion, for the tasks. Strength for a while, and not one drop for Obelix.  
**Obelix** _(sad)_: I only want a little bit. A taste.  
**Getafix**: You fell in when you were a baby. It’s permanent. You’re the reason I keep a lid on it.  
_Obelix sulks for exactly as long as it takes to remember the boars. Dogmatix and your Nubbin are asleep in a heap by the cauldron._  
**Caius Pupus** _(think)_: We leave at dawn for task one. I should warn you I have a very good eye for cheating.  

**Rewards**


Sets on completion: `{"a08-01":true}`

**Notes:** OPENING: the map is the page’s own painting, Roman red with one green dot; the four camps are tiny drawn forts. The wax tablet is a UI item from here on: XII lines, ticked one per task (A8-2 to A8-13). Dogmatix follows your Nubbin on every page scene from now on; he never speaks or thinks aloud. Getafix’s potion is shown as a flask and a glow, never as anything like alcohol.

## A8-2. Asbestos

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 1, the runner* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-1, from Nova’s atlas. · requires: A8-1

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Asbestos (Asbestos, the Greek Olympic runner, task 1, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Pace out the course and meet the runner.

Hint: Walk from the start stone to the finish post, then talk to Asbestos. · check: `walk:a08-track:course`

#### Scene `a08-02-track`

_Task one is a race along a straight dirt road, from a stone to a post a long way off. You pace it out, and stop counting._  
_At the start a young man in a short white tunic is stretching. He stretches parts of himself you didn’t know stretched._  
**Asbestos** _(happy)_: Asbestos, of Greece. I have won at Olympia, where the Games began, and where the gods themselves come to watch.  
**Asbestos**: We run there every four years, naked as the day we were born. Today, for your sake, I have kept the tunic.  
**Asterix**: Very kind of you.  
**Asbestos**: You will not see me after the start. That is not boasting. It is only a description.  
**Caius Pupus** _(think)_: The referee will start the race. Referee, please be impartial. I mean, please be quick.  
_Your Nubbin and Dogmatix are crouched at the start stone as well, bottoms in the air, very serious._  

**Choices**

- **Let them race too.**
    - **Caius Pupus**: Animals are not in the rules.
    - You point out that animals are not out of the rules either. Pupus writes that down, crossly.
- **Scoop them up out of the way.**
    - You lift your Nubbin. Dogmatix sits down on your foot, as if that settles it.

#### Done `a08-02-track-done`

_You lift your hand. Asbestos goes still as a statue, and Asterix yawns._  

### Step 2: Start the race and see who reaches the post.

Hint: Drop your hand to start. Then watch the road, not Asterix. · check: `race:a08-asbestos:road`

#### Scene `a08-02-race`

_Your hand drops. Asbestos is a white blur, then a cloud of dust, then a dot._  
_Asterix ambles off the line with his hands behind his back, like a man going to look at the weather._  
**Caius Pupus** _(shock)_: Is he trying?  
_Halfway along the road, Asterix stops, uncorks his flask, and has one sip. Then the road is empty where he was._  
_A gust knocks Pupus’s laurel wreath sideways. Down at the far end, two dots become one dot, and then that dot is Asterix._  
_He is not running any more. He is sitting on the finish post, waving, and seems to have had time to eat an apple._  
_Asbestos reaches the post at a speed nobody has ever reached anything, sees Asterix, and keeps going out of pure surprise._  

#### Done `a08-02-race-done`

_Far away, over the hills, a small white figure is still running. Obelix shades his eyes and watches him go, a little enviously._  

#### Complete `a08-02-complete`

_You scratch a tick beside I on the wax tablet: the runner. Pupus looks at it, sighs, and initials it._  
**Obelix**: I could have done that. If there’d been a boar at the end.  
**Asterix**: He was very fast. He just wasn’t first.  
**Caius Pupus** _(think)_: One task. Eleven to go. I have brought a great many spare tablets.  
_Your Nubbin trots back from the road, very pleased, with Dogmatix. Nobody timed them, but they look as if they won something._  

**Rewards**


Sets on completion: `{"a08-02":true}`

**Notes:** TASK 1 (Asbestos). The race is a short watch scene, not a minigame you can lose; the "race" check passes when the scene ends. Asbestos’s Olympia line seeds the Learning Grove hook (the Games’ Greek origins). His tunic line is a mild historical joke (ancient runners ran naked); he keeps the tunic. Keep Asbestos dignified: he really is the fastest man in the world, and he is a good sport later (A8-13).

## A8-3. Verses

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 2, the javelin* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-2, from Nova’s atlas. · requires: A8-2

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Verses (Verses, the Persian javelin champion, task 2, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Carry the javelins out to the throwing field.

Hint: There are three javelins on the cart. Carry them one at a time; they are long. · check: `carry:a08-javelins:field`

#### Scene `a08-03-field`

_Task two is a wide field of short grass with a white line at one end. Beside the line stands a tall man in a beautifully embroidered coat._  
**Verses**: Verses, of Persia, at your service. Forgive me if I do not shake hands. These hands are working today.  
_He has three javelins on a cart, each one wrapped in silk. He unwraps them as if he were introducing his children._  
**Verses**: This one is Swift. This one is Patient. And this one I have never thrown, because I am saving her for an occasion.  
**Asterix**: Is this an occasion?  
**Verses** _(happy)_: It is beginning to feel like one.  
_Your job is to carry the javelins to the line. They are longer than the cart, and the cart is longer than you._  

**Choices**

- **Carry them very carefully, like Verses would.**
    - **Verses**: You carry them like a friend. Thank you.
- **Ask Obelix to help.**
    - Obelix carries all three in one hand and the cart in the other, and asks where you’d like the cart.

#### Done `a08-03-field-done`

_You lay the javelins on the grass by the line. Your Nubbin sits beside the one called Patient, which seems right._  

### Step 2: Watch both throws and measure them.

Hint: Stand by the far marker. Count your steps from the line to where each javelin lands. · check: `watch:a08-javelin:field`

#### Scene `a08-03-throws`

_Verses takes Swift, steps up, and throws. It goes up like a bird and comes down at the very end of the field, quivering._  
**Caius Pupus**: A record, surely. Referee, measure it.  
_You measure it. It takes a long time, and you have to start again twice, because Dogmatix keeps bringing you sticks._  
_Asterix takes a sip from his flask and borrows a plain javelin from the cart. He throws it underarm, almost lazily._  
_It goes over Verses’ javelin, over the trees and over the hill. It keeps going, and the whistle of it fades away._  
**Verses** _(shock)_: Where is it going?  
**Asterix**: I couldn’t tell you. I just threw it.  

**Choices**

- **Start walking after it with your tablet.**
    - **Caius Pupus**: Come back. Come back! We’ll be here for a week.
    - You come back. You give it the win on what you are calling "visible evidence of leaving".
- **Call it: the javelin is still going.**
    - **Verses**: A fair ruling. One cannot measure a throw that has not finished.

#### Complete `a08-03-complete`

_You scratch a tick beside II on the wax tablet: the javelin. Pupus looks at it, sighs, and initials it._  
_Verses wraps Swift in its silk again, and bows to Asterix, deeply and without fuss._  
**Verses** _(happy)_: A good throw is a good throw, whoever makes it. I am going to go and find out where yours lands.  
_He sets off over the hill with the cart, and the javelin he was saving still in its silk._  
**Obelix**: He’s nice. I like him. Are all the champions going to be nice?  
**Caius Pupus** _(think)_: No.  

**Rewards**


Sets on completion: `{"a08-03":true}`

**Notes:** TASK 2 (Verses), in the verified order (Verses before Cilindric). Verses is courteous and a fine sportsman; his named javelins are our invention, and the page’s gentlest running joke. Asterix’s javelin is heard again overhead in A8-4 (a08-04-bout#6) and is still going in A8-14. Measuring is a counting moment (Learning Grove hook).

## A8-4. Cilindric

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 3, the wrestler* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-3, from Nova’s atlas. · requires: A8-3

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Cilindric (Cilindric, the German wrestler, task 3, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Read Cilindric’s rulebook before the bout.

Hint: You are the referee: the rules are your job. Open the book on the bench. · check: `inspect:a08-rulebook:cilindric`

#### Scene `a08-04-rules`

_Task three is a ring of rope in a meadow. Inside it a short, square man in a white wrap is folding a towel into perfect quarters._  
**Cilindric**: Cilindric. Good morning. Before we begin, the referee will please read the rules.  
_He hands you a book. It is as thick as a loaf, and every page is ruled into neat columns._  
**Cilindric**: My art is about using your opponent’s strength. But also about doing it correctly. In the right order. With the right bow.  
_Rules one to forty are about bowing. Rule forty-one says what to do if the bow is returned too low._  
**Asterix**: Is there a rule about what happens if the other man doesn’t want to wrestle?  
**Cilindric** _(think)_: Rule three hundred and twelve. It is very firm.  

**Choices**

- **Read every rule, properly.**
    - **Cilindric**: Ah. A referee who reads. You have my respect.
    - It takes until lunch. Pupus brings sandwiches, and seems to understand completely.
- **Skim it and nod wisely.**
    - **Cilindric**: Hm. You have skipped the section on nodding.

#### Done `a08-04-rules-done`

_You close the book. Cilindric bows to it, then to you, then to Asterix, then, after a moment’s thought, to the meadow._  

### Step 2: Referee the bout.

Hint: Stand by the rope. Asterix has an idea; let it play out. · check: `watch:a08-bout:ring`

#### Scene `a08-04-bout`

_They face each other and bow. Cilindric moves like water, and suddenly Asterix is upside down and then the right way up again._  
**Asterix**: Wonderful. Could you show me that again? Slowly. I want to be sure I’ve got the rules right.  
**Cilindric**: Of course. Rule eighty. First the hand, here. Then the foot, here. Then the turn, so.  
**Asterix**: And then rule eighty-one?  
**Cilindric**: Rule eighty-one follows rule eighty, naturally, with the elbow under, so, and then the knee comes through, so…  
_Cilindric, demonstrating on nobody but himself, turns, tucks, turns again, and ties himself into a tidy, polite knot._  
_High overhead, something whistles past, going east. It is Asterix’s javelin from yesterday, still going._  
**Cilindric** _(shock)_: I appear to have won. Against myself. Which, under rule three hundred and twelve, means I have lost.  

**Choices**

- **Help untie him.**
    - It takes you, Obelix and both animals. Cilindric thanks each of you by name, including the dog.
- **Look up rule three hundred and twelve to be sure.**
    - **Cilindric**: Correct. A referee who checks. I would wrestle under you again any time.

#### Complete `a08-04-complete`

_You scratch a tick beside III on the wax tablet: the wrestler. Pupus looks at it, sighs, and initials it._  
**Cilindric** _(happy)_: A clean result. Unusual, but clean. Please keep the book. I have three more at home.  
_He bows once to each of you and folds his towel again, perfectly, and walks off with it under his arm._  
**Obelix**: He was nice too.  
**Caius Pupus** _(sad)_: They are all nice. That is the trouble. Nobody nice ever wins anything for Rome.  

**Rewards**


Sets on completion: `{"a08-04":true}`

**Notes:** TASK 3 (Cilindric). His art is drawn as a gentle, tidy wrestling style, not any real school or belt system. The joke is that he loves rules, and it is affectionate: he is honest, courteous, and the first champion to give you something (the rulebook is a prop on this page, not a Grove reward). No accent in the text. The javelin passing overhead is a callback to A8-3; sound only, a long whistle east to west.

## A8-5. The Isle of Pleasure

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 4, the island* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-4, from Nova’s atlas. · requires: A8-4

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), The Island’s Hostess (The priestesses of the Isle of Pleasure, task 4, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Row across to the island.

Hint: Take the oars. Obelix will row too, but don’t let him row on his own; you’ll go in circles. · check: `escort:a08-boat:isle`

#### Scene `a08-05-boat`

_Task four is an island in a blue lake, with soft music coming over the water and a smell of honey cakes._  
**Caius Pupus** _(think)_: The task is simple. Cross the island and leave it. Nobody ever has. They all stay.  
**Asterix**: Why?  
**Caius Pupus**: Because it’s lovely. That is the whole difficulty.  
_Obelix rows with one oar and you row with the other. The boat goes forward, mostly, and sideways the rest of the time._  
_Dogmatix stands at the front like a figurehead. Your Nubbin stands beside him, leaning into the wind it is not really getting._  
**Obelix**: Will there be boar?  
**Caius Pupus**: There will be everything.  

#### Done `a08-05-boat-done`

_The boat bumps onto white sand. There are cushions on the beach, left there on purpose._  

### Step 2: Get everybody back to the boat.

Hint: Find your Nubbin and Dogmatix first. Obelix will take care of Asterix. · check: `escort:a08-asterix:boat`

#### Scene `a08-05-isle`

_Kind women in pale robes come down to the shore with plates of cakes and jugs of cool fruit juice._  
**The Island’s Hostess**: Welcome, travellers. You look so tired. Sit down. Rest. There is a bath, and a sofa, and nobody will ever ask you to do anything again.  
_Asterix sits down on a cushion. He looks surprised, and a little worried, as if his legs did it without asking him._  
**Asterix** _(soft)_: Only for a moment.  
**The Island’s Hostess**: Of course. Only for ever.  
_Your Nubbin and Dogmatix have found a garden of butterflies, and are rolling in the clover with their eyes half shut._  
**Obelix**: Excuse me. Is there any boar?  
**The Island’s Hostess**: We have honey, and figs, and peaches, and little cakes with…  
**Obelix** _(angry)_: So no boar.  

**Choices**

- **Go and fetch the Nubbin and the dog.**
    - You lift them out of the clover, one under each arm. They are warm and floppy and very sleepy, and they let you.
- **Have just one cake first.**
    - It is the best cake you have ever eaten. You notice that you have sat down, and get up again, quickly.

#### Done `a08-05-isle-done`

_Obelix picks Asterix up off the cushion, tucks him under one arm, and walks back to the boat without stopping._  
**Obelix**: Sorry. Thank you. Lovely island. No boar.  

#### Complete `a08-05-complete`

_Halfway home across the lake, Asterix sits up and shakes his head, like someone coming out of a warm bath._  
**Asterix** _(shock)_: I was going to stay. I really was going to stay.  
**Obelix**: You weren’t. There was no boar.  
_You scratch a tick beside IV on the wax tablet: the island. Pupus looks at it, sighs, and initials it._  
**Caius Pupus** _(think)_: In all the records, nobody has ever rowed away from that island. And nobody has ever left it in a sulk.  

**Rewards**


Sets on completion: `{"a08-05":true}`

**Notes:** TASK 4 (the Isle of Pleasure). Keep it cosy and silly: cakes, cushions, music, a sofa, a garden of butterflies. The hostesses are kind, robed to the ankle, and not flirtatious; the temptation is rest forever, and the danger is that nobody wants to leave. Obelix’s single-mindedness about boar is the rescue. The island’s music is original and wordless.

## A8-6. Iris

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 5, the hypnotist* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-5, from Nova’s atlas. · requires: A8-5

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Iris (Iris, the Egyptian hypnotist, task 5, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Find the hypnotist’s tent.

Hint: Follow the painted eyes on the trees. They lead to a tent with a moon on it. · check: `visit:a08-iris:tent`

#### Scene `a08-06-tent`

_Task five waits at the end of a path lined with painted eyes. They seem to follow you, which is probably the point._  
_The tent is dark inside and smells of incense. A man in a tall headdress sits on a cushion, very still._  
**Iris**: I am Iris, from Egypt, where we have been looking at things longer than anyone. Look into my eyes.  
_His eyes are enormous, and dark, and they glow faintly, like coals. You find you have already looked._  
**Iris**: Your task is to hold my gaze. Whoever looks away first, loses. And whoever loses will believe whatever I say they are.  
**Caius Pupus** _(think)_: He is very good. Last week he convinced a centurion he was a teapot. The man still says "oh" when he’s picked up.  

**Choices**

- **Try a practice stare yourself.**
    - You last about two seconds. When you come round, you are holding your Nubbin and humming like a beehive.
- **Look at the floor, sensibly.**
    - **Iris**: A wise referee. The floor is safe. Mostly.

### Step 2: Referee the staring contest.

Hint: Sit between them, and look at the sand timer, not at either of them. · check: `sit:a08-iris:stare`

#### Scene `a08-06-stare`

_Asterix sits down opposite Iris. You turn the sand timer over, and keep your eyes very firmly on the sand._  
**Iris**: You are growing sleepy. You are a small, soft creature. You are… a dormouse.  
**Asterix**: No, I’m not.  
_Iris leans closer, and the glow in his eyes gets brighter. The glow in Asterix’s eyes, after one sip from his flask, gets brighter still._  
**Asterix**: Actually, I think you’re the one who’s sleepy.  
_Something in Iris’s face goes uncertain. Then his nose twitches, and his shoulders go round, and he snuffles at the cushion._  
_He is quite sure, now, that he is a wild boar. He trots out of the tent on all fours, grunting happily._  
**Obelix** _(happy)_: Asterix! Asterix, can I…  
**Asterix**: No, Obelix. He’s a person. He’ll be a person again by supper.  

#### Done `a08-06-stare-done`

_The last grain of sand falls. Dogmatix is barking at the tent door, and your Nubbin has hidden behind your boots._  

#### Complete `a08-06-complete`

_You scratch a tick beside V on the wax tablet: the hypnotist. Pupus looks at it, sighs, and initials it._  
_Outside, Iris is rooting cheerfully among the acorns. Pupus watches him with deep sympathy._  
**Caius Pupus** _(soft)_: It wears off. Usually. I will make sure somebody brings him a cushion.  
**Obelix**: He looks happy.  
**Asterix**: He does, a bit. Come on. Seven to go.  

**Rewards**


Sets on completion: `{"a08-06":true}`

**Notes:** TASK 5 (Iris). Iris is theatrical and proud of Egypt’s long learning; his headdress and tent are stage costume, not a religious image, and no gods are named. The boar joke stays gentle: Obelix is told no at once, and Iris is fine by supper (Pupus sees to him). The eye glow is a soft light, not a horror effect. Reduced motion: no swirl.

## A8-7. Mannekenpix

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 6, the feast* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-6, from Nova’s atlas. · requires: A8-6

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Mannekenpix (Mannekenpix, the Belgian chef, task 6, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Help carry the dishes from the kitchen.

Hint: Take them from the hatch to the long table. The big ones need two hands. · check: `carry:a08-dishes:kitchen`

#### Scene `a08-07-kitchen`

_Task six is a meal. On a long table in a hall with low beams, a single plate is set, and a single, very large chair._  
_In the kitchen behind it, a round, red-faced man in an apron is stirring four pots and tasting a fifth._  
**Mannekenpix** _(happy)_: Mannekenpix, chef, from the north. The Belgae, if you like. Nobody leaves my table hungry. Nobody leaves it at all, usually.  
**Mannekenpix**: The task is to finish. Everything. To the last crumb. Whoever has tried has had to be carried home on a door.  
**Asterix**: Obelix, I think this one is yours.  
**Obelix** _(happy)_: Me? Oh. Oh, all right then. If I must.  
_You are put on dishes. The first one is a soup the size of a bath, and Pupus has to take the other end._  

**Choices**

- **Ask what’s in the soup.**
    - **Mannekenpix**: Everything I had, and a bit of love. The love is the secret. The everything helps.
- **Just carry, and carry quickly.**
    - **Mannekenpix**: Good! Hot food goes out hot. You have the makings of a waiter.

#### Done `a08-07-kitchen-done`

_Soup, then fish, then three kinds of pie. Then a dish of crisp fried potatoes that Mannekenpix places down as if it were a crown._  

### Step 2: Keep the plates coming and watch Obelix finish.

Hint: Stand by the table with your tablet. Count the courses on it as they go. · check: `watch:a08-feast:hall`

#### Scene `a08-07-feast`

_Obelix eats steadily, happily, and without hurry. Each dish goes in and the plate comes back so clean it shines._  
_You count courses on your tablet. You run out of room at twenty and start a second tablet._  
**Mannekenpix** _(shock)_: He has eaten the pies. He has eaten the stew. He has eaten the second stew, which was for me.  
_At last the hatch is empty. Mannekenpix leans in the doorway, floury and astonished, with nothing left to bring._  
**Obelix** _(happy)_: That was a lovely starter. When’s the main course?  
_There is a long silence. Then Mannekenpix starts to laugh, and laughs until he has to sit on a flour sack._  
**Mannekenpix** _(happy)_: Thirty years. Thirty years I have been waiting for someone to ask me that.  

**Choices**

- **Save the scraps for the Nubbin and Dogmatix.**
    - There aren’t any scraps. Obelix gives them each a crust from his own pocket, which seems to be where he keeps them.
- **Applaud the chef.**
    - You clap, and Pupus claps, and Obelix claps with his mouth full. Mannekenpix takes a deep, floury bow.

#### Complete `a08-07-complete`

_You scratch a tick beside VI on the wax tablet: the feast. Pupus looks at it, sighs, and initials it._  
**Mannekenpix** _(happy)_: Here. For the road. You will be hungry again by the river.  
_He gives Obelix a wrapped parcel of fried potatoes. Obelix holds it like a newborn._  
**Caius Pupus** _(sad)_: Halfway. Six tasks. Caesar is going to be very quiet when I tell him.  
**Asterix**: Six more. Who’s next?  
**Caius Pupus**: Next is a cave. I have been asked not to say anything else about it.  

**Rewards**


Sets on completion: `{"a08-07":true}`

**Notes:** TASK 6 (Mannekenpix). The Belgian joke is generous cooking and a love of good fried potatoes, nothing else, and he is the happiest loser on the page. "The Belgae" is the Roman name for the tribes of the north; a gentle anachronism to call him Belgian, as the source does. No drink at the table. The counting of courses is a Learning Grove hook.

## A8-8. The Cave of the Beast

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 7, the cave* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-7, from Nova’s atlas. · requires: A8-7

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Go into the cave with a lantern.

Hint: Light the lantern at the entrance. Keep the wall on your left. · check: `explore:a08-cave:mouth`

#### Scene `a08-08-mouth`

_Task seven is a black hole in a hillside, with old bones round the entrance. Pupus stands well back from the bones._  
**Caius Pupus**: The task is to go in, and come out. Something lives in there. Nobody who has gone in has said what.  
**Asterix**: Because they didn’t come out?  
**Caius Pupus** _(think)_: Because they wouldn’t say. They came out, and went home, and changed the subject.  
_From inside, very deep down, comes a long, rumbling sound, like a cart going over a wooden bridge._  
_Dogmatix’s ears go flat, and your Nubbin presses against your leg. Obelix picks up a rock, thinks better of it, and puts it down._  
_You light the lantern. The first ten steps are only a cave: drips, cold air, and your own breath._  

**Choices**

- **Go first, with the lantern.**
    - **Asterix**: Brave referee. We’re right behind you.
    - **Obelix**: A little behind.
- **Ask everyone to go in side by side.**
    - It is a tight fit, and Obelix goes sideways. It is much better, side by side.

#### Done `a08-08-mouth-done`

_The passage opens into a chamber so big the lantern light doesn’t reach the roof. The rumble is very near now._  

### Step 2: Find out what lives in the cave.

Hint: Don’t lift the lantern too high. Sit down, and let it come to you. · check: `find:a08-beast:chamber`

#### Scene `a08-08-beast`

_At the edge of the light there is a shape, as big as a haystack, curled tight. The rumble is coming from it._  
_It is not growling; it is shaking. Whatever it is, it is very large, and very frightened of the light._  
**Asterix** _(soft)_: It’s scared of us.  
**Obelix** _(sad)_: Everybody’s scared of me. I don’t know why.  
_You turn the lantern down low, and sit on the cold floor, and don’t say anything._  
_Dogmatix sits beside you, then your Nubbin. Then, very carefully, so the floor won’t shake, Obelix._  
_After a long time, something huge and soft, with very small eyes, puts its nose out and sniffs your Nubbin._  
_Your Nubbin sniffs back. The rumble stops._  

**Choices**

- **Leave the lantern, turned down low.**
    - You set it on a rock, at its gentlest. The great shape settles beside it like a cat by a stove.
- **Back out quietly, in the dark.**
    - You go out the way you came, slowly. Behind you, the rumble starts again, but slower now, like snoring.

#### Complete `a08-08-complete`

_Outside, the daylight is very loud. Pupus is still standing well back from the bones._  
**Caius Pupus**: Well? What was it?  
_Asterix looks at you, and Obelix looks at you, and you all find, just like everyone before, that you’d rather not say._  
**Asterix**: Nothing you need to worry about.  
_You scratch a tick beside VII on the wax tablet: the cave. Pupus looks at it, sighs, and initials it._  
**Caius Pupus** _(think)_: You’re all the same, you lot. You go in, and you come out kind.  

**Rewards**


Sets on completion: `{"a08-08":true}`

**Notes:** TASK 7 (the Cave of the Beast). The source keeps the Beast offscreen; so do we, nearly. Show only a great curled shape at the edge of the light, a soft nose and very small eyes; never teeth or claws. The bones at the mouth are old cattle bones from a midden, not a threat. Hazel’s third rule is acted here (sit beside it and wait), not quoted. Nobody explains the Beast; the page’s joke is that nobody who goes in will tell.

## A8-9. The Place That Sends You Mad

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 8, Permit A38* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-8, from Nova’s atlas. · requires: A8-8

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), The Porter (The porter of the Place That Sends You Mad, task 8, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), A Clerk (The clerks of the Place That Sends You Mad, task 8, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), The Prefect (The prefect at the top of the Place That Sends You Mad, task 8, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Go into the Place That Sends You Mad and ask for Permit A38.

Hint: Start with the porter at the front door. Be polite. It won’t help, but be polite. · check: `talk:a08-porter`

#### Scene `a08-09-door`

_Task eight is a building. It is tall and white and has more windows than there are days in the year, and it hums._  
**Caius Pupus** _(think)_: Inside, you must obtain Permit A38. That is all. Many great warriors have gone in for it.  
**Asterix**: And?  
**Caius Pupus** _(sad)_: Some of them still work there.  
_The hall inside is full of counters, and stairs, and people holding papers and looking at the ceiling with a terrible calm._  
**The Porter**: Good morning. Do you have an appointment?  
**Asterix**: We’ve come for Permit A38.  
**The Porter**: Then you need to go to counter one, which will send you to counter two. Stairs on the left. The stairs on the right go nowhere.  
_Obelix looks up at the stairs on the right. They go up, turn a corner, and come back down beside themselves._  

#### Done `a08-09-door-done`

_Dogmatix lies down by the porter’s desk with your Nubbin, as if they have both decided to wait this one out._  

### Step 2: Try to get the permit the proper way.

Hint: Go from counter to counter. Keep track of where each one sends you. · check: `puzzle:a08-place:counters`

#### Scene `a08-09-counters`

**A Clerk**: Counter one. Permit A38? Not here. You need the blue form, from counter two. Second floor.  
_Counter two is on the third floor. The clerk is eating lunch, though it is ten in the morning._  
**A Clerk**: The blue form? You need the pink form first, to prove you’re allowed to ask for the blue form. Counter one.  
_Counter one has closed, and a sign says it has gone to counter four. Counter four is a broom cupboard._  
_A man in a dusty toga drifts past, holding a scroll. He has a long white beard, and he looks about your age._  
**Obelix** _(sad)_: Asterix. I think we’ve been here before. I think we’ve been here all our lives.  
_You look at your tablet. You have written down every counter, and the arrows on it make a perfect circle._  

**Choices**

- **Join the longest queue, just to see.**
    - You get to the front just as the clerk puts up a sign: “Closed for reorganisation. Please queue at the back.”
- **Draw a map of the counters.**
    - **Asterix**: Show me that.
    - Asterix looks at your circle of arrows for a long while. Then he smiles, slowly.

#### Done `a08-09-counters-done`

**Asterix** _(happy)_: They’ve built a machine for saying no. So let’s ask it for something it can’t say no to, because it doesn’t exist.  

### Step 3: Design your own impossible form for the clerks.

Hint: Write it on a fresh page of your tablet. The sillier it is, the better it will work. · check: `craft:a08-form:impossible`

#### Scene `a08-09-form`

**Asterix**: Here’s the plan. I ask for Permit A39, which nobody has ever heard of.  
**Asterix**: And while they’re looking for it, the referee hands in a form. A new form. A form so strange they have to pass it round.  
**Caius Pupus** _(shock)_: You want to invent paperwork? In here?  
**Asterix**: Why not? It’s the only thing they eat.  
_You find a fresh page of your tablet. Obelix leans over your shoulder, breathing heavily and helpfully._  
**Obelix** _(happy)_: Make it a good one. Make it the silliest one ever.  
_Pupus, despite himself, leans over the other shoulder._  
**Caius Pupus** _(think)_: Rule of thumb: the clerks have to believe it is real. The silliest form only wins if it looks completely serious.  

**Choices**

- **Form 0: Application to Find Out Whether You Need This Form.** — sets `{"a08-form":"loop"}`
    - It has one box, which says, in small letters: “Please attach a completed copy of this form.”
    - **Caius Pupus**: That is… that is beautiful. That could go round this building until the sun burns out.
- **The Pink-and-Blue Form: Proof That You Are Not a Boar, to be signed by a boar.** — sets `{"a08-form":"boar"}`
    - Obelix signs it on the boar’s behalf, with a hoof print he does with his knuckle. It looks extremely official.
    - **Obelix**: Somebody will have to go and find a boar now. Somebody will have to find a boar who can write.
- **A short form: your name, what you need, and a signature.** — sets `{"a08-form":"plain"}`
    - It fits on one page, and it is clear. A child could fill it in in a minute.
    - **Caius Pupus**: They will never accept this. Nobody in here has ever seen anything so sensible.

Sets `{"a08-09-form-made":true}`

#### Done `a08-09-form-done`

_Pupus, sighing, finds a sheet of papyrus in his toga, and you copy the form out fair. Asterix straightens his helmet and walks up to counter one._  

### Step 4: Hand in your form while Asterix asks for Permit A39.

Hint: Give the form to the clerk at counter one, then stand back. · check: `deliver:a08-form:counter-one`

#### Scene `a08-09-a39`

**Asterix**: Good morning. I’d like Permit A39, please. As set out in the new circular.  
**A Clerk** _(shock)_: A39? There’s no A39. There’s A38.  
**Asterix**: Not since the new circular. Haven’t you had it? Everybody else has had it.  
_The clerk goes pale and turns to the clerk behind him, who turns to the clerk behind her. A whisper runs up the stairs._  
_You slide your form across the counter. The clerk takes it without looking, stamps it out of habit, and passes it on._  
_Within a minute, every clerk in the building is running and papers are flying. The stairs on the right are suddenly very busy._  
**A Clerk** _(shock)_: Has anybody seen the new circular? Who has the A39? Who is handling this form? Which counter is this form?  
_A bell rings at the top of the building. A door opens on the highest landing, and a man in a purple-edged toga looks down._  

#### Done `a08-09-a39-done`

**The Prefect** _(angry)_: Who is responsible for this? What do you want? Whatever it is, take it, and go, and let us have our building back.  
**Asterix**: Permit A38, please.  

#### Complete `a08-09-complete`

_The prefect stamps a small grey square of papyrus without even reading it, and lets it flutter down the stairwell to you._  
_It says PERMIT A38 in very large letters, and nothing else at all. You hold it up for everyone to see._  
**Caius Pupus** _(shock)_: In the whole history of the building, nobody has ever got one. I didn’t think it was real.  
_You scratch a tick beside VIII on the wax tablet: Permit A38. Pupus looks at it, sighs, and initials it._  
_On your way out, the porter hands your form back to you, stamped, with great respect. He seems to think you’ll need it again._  
**Obelix** _(happy)_: That was the best one. Can we do that one again?  
**Asterix**: Never, Obelix. Never, ever again.  

**Rewards**


Sets on completion: `{"a08-09":true}`

**Notes:** TASK 8 (the Place That Sends You Mad), the page’s centrepiece, split into four steps. Permit A38 and the A39 trick are the source’s plot; all dialogue is new, and the circular is never given a number. SIGNATURE CHOICE (a08-09-form): a08-form = loop | boar | plain. The scene is the same on every path, because Asterix’s A39 does the heavy lifting and your form is the extra spanner. loop and boar are silly enough to "win" (the clerks pass them round, stamping it); plain is too sensible, and the clerks stamp it once, baffled. On every path the porter hands the stamped form back (a08-09-complete). Pays off at the Banquet, A8-14 (variants a08-14-bard-loop, a08-14-bard-boar, a08-14-useful), and is echoed in A8-12 (a08-12-ghosts-done). ART: the building is a dream of a bureaucracy: Escher-like stairs (the ones on the right go nowhere), endless counters, a humming sound. The "bureaucracy" idea is a Learning Grove hook, told gently: rules that help, and rules that only help themselves. a08-09-form-made is an internal step flag (the form exists as a prop for A8-12 and A8-14).

## A8-10. The Crocodile Ravine

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 9, the ravine* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-9, from Nova’s atlas. · requires: A8-9

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Walk to the edge of the ravine and look for the rope.

Hint: Stand at the post on this side. Look carefully across to the other post. · check: `walk:a08-ravine:edge`

#### Scene `a08-10-edge`

_Task nine is a deep, narrow ravine with a river at the bottom. In the river there are a number of crocodiles, all looking up._  
_There is a post on this side, and a post on the far side. Between them, there is nothing at all._  
**Caius Pupus** _(think)_: The task is to cross on the magic rope. It is invisible. Only the worthy can see it.  
**Asterix**: Can you see it?  
**Caius Pupus**: I am an observer. I am not required to see anything.  
_You throw a pebble out from the post. It falls straight down, past where a rope would be, and a crocodile catches it._  

**Choices**

- **“There’s no rope.”**
    - **Caius Pupus**: There is a rope. It is simply very, very good at being invisible.
    - **Asterix**: So is a hole.
- **“Mr Pupus, would you show us how, first?”**
    - **Caius Pupus**: I… The observer must not interfere.
    - Pupus takes three firm steps away from the edge, to observe better.

### Step 2: Find another way across.

Hint: Dogmatix won’t let Obelix pull up a living tree. Look along the edge for one that has already fallen. · check: `find:a08-log:ravine`

#### Scene `a08-10-log`

**Obelix** _(happy)_: I’ll make a bridge. I’ll pull up a tree.  
_He puts his arms round the nearest oak. Dogmatix gives a howl of real grief and runs in circles, and Obelix lets go at once._  
**Obelix** _(sad)_: Sorry, Dogmatix. Sorry. I forgot. Not that one.  
_Dogmatix cannot bear to see a tree pulled up. Your Nubbin sits beside him, leaning on him, until his ears come back up._  
_You walk along the edge, looking. A little way off, a huge old pine lies dead on its side, roots in the air, long since fallen._  
**You**: This one. It fell on its own.  
_Obelix gives it one punch at the root end. It slides, swings, and drops with a crash across the ravine, a perfect bridge._  
_The crocodiles, below, look at each other with what seems to be disappointment._  

**Choices**

- **Cross first, carrying the Nubbin.**
    - The trunk is wide as a road. Dogmatix trots across beside you with his tail up, the tree business forgiven.
- **Offer Pupus your hand.**
    - **Caius Pupus**: I don’t need… thank you.
    - He takes it, all the way across, and doesn’t let go until his sandals are on grass.

#### Complete `a08-10-complete`

**Caius Pupus** _(think)_: That is not the magic rope. Technically, you have not crossed on the magic rope.  
**Asterix**: Technically, there isn’t one.  
_Pupus opens his mouth, closes it, and looks back at the empty air between the posts for a long moment._  
**Caius Pupus**: Fine. Fine. Write it down.  
_You scratch a tick beside IX on the wax tablet: the ravine. Pupus looks at it, sighs, and initials it._  

**Rewards**


Sets on completion: `{"a08-10":true}`

**Notes:** TASK 9 (the Crocodile Ravine). The outline’s beat is "an invisible tightrope, or a punch": the rope is not there, and the punch moves a fallen pine. DOGMATIX AND TREES is source canon (he howls when trees are uprooted); respect it, so Obelix never fells a living tree on this page. The crocodiles never leave the water, never bite, and are comic.

## A8-11. The Old Man of the Mountain

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 10, the riddle* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-10, from Nova’s atlas. · requires: A8-10

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), The Old Man of the Mountain (The Old Man of the Mountain, task 10, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Climb to the top of the mountain.

Hint: Take the goat path. It is longer, but the goats know what they’re doing. · check: `climb:a08-mountain:summit`

#### Scene `a08-11-climb`

_Task ten is a mountain with its top in the clouds. A narrow path goes up it in loops, and so do some goats._  
**Caius Pupus**: At the top lives the Old Man of the Mountain, who is very wise. He will ask you a riddle. You must answer it.  
**Obelix**: What if we don’t know?  
**Caius Pupus** _(think)_: Then you stay up there until you do. Some people have been up there since they were young.  
_The path is steep, and you carry your Nubbin. Obelix carries Dogmatix, and Pupus, and after a while, the goats._  
_Near the top, the air is thin and cold, and there is a smell of something faintly perfumed, like a fancy bathhouse._  

**Choices**

- **Stop and look at the view.**
    - All Gaul is spread out under the clouds, green and brown and silver with rivers. Somewhere down there is the village.
- **Keep going: no stopping on mountains.**
    - **Asterix**: Good thinking. If I stop, I’ll never start again.

#### Done `a08-11-climb-done`

_At the summit, by a cave, an ancient man with a beard down to his knees sits cross-legged on a rock, eyes closed._  

### Step 2: Answer the Old Man’s riddle.

Hint: Listen to every clue. Then look around the cave. · check: `puzzle:a08-riddle:summit`

#### Scene `a08-11-riddle`

**The Old Man of the Mountain** _(think)_: Travellers. You have climbed far. Hear now the great riddle, and answer, or remain.  
**The Old Man of the Mountain**: What is white as the snows, yet melts in your hands? What is soft as a lamb, and smells of the meadows?  
**The Old Man of the Mountain**: What leaves you cleaner than the river, and costs only two copper coins, or three for five?  
_There is a pause while Asterix frowns. Obelix counts on his fingers, gets to three for five, and stops._  
_Behind the Old Man, in his cave, there are stacks and stacks of small white cakes, wrapped in leaves, each stamped with his face._  
**Asterix**: Is it… soap?  
**The Old Man of the Mountain** _(happy)_: It is the Old Man of the Mountain’s Own Mountain Soap! Made with goat’s milk! Gentle on the beard!  

**Choices**

- **Buy three for five.**
    - **The Old Man of the Mountain**: A wise traveller! I shall throw in a fourth, because you have honest eyes.
- **“That wasn’t a riddle. That was an advert.”**
    - **The Old Man of the Mountain**: All the best riddles are, in the end. Have a free sample.

#### Complete `a08-11-complete`

_You scratch a tick beside X on the wax tablet: the riddle. Pupus looks at it, sighs, and initials it._  
_The way down is quicker. You smell of goat’s milk and meadow flowers, and so, to his great dismay, does Obelix._  
**Obelix** _(sad)_: I smell like a lamb. Asterix, I smell like a lamb.  
**Asterix**: You smell lovely.  
**Caius Pupus** _(think)_: Two more. Only two. I have stopped knowing whether I want you to win.  

**Rewards**


Sets on completion: `{"a08-11":true}`

**Notes:** TASK 10 (the Old Man of the Mountain). The outline’s beat: a riddle that turns out to be an advert. The soap and its claims are our invention; no real product or slogan. Any answer to the riddle step passes it; the choices are flavour. The goats are ordinary goats and do not talk.

## A8-12. The Haunted Plain

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 11, the ghosts* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-11, from Nova’s atlas. · requires: A8-11

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), A Ghostly Centurion (The ghosts of the Haunted Plain, task 11, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Wait on the plain for midnight.

Hint: Set up camp by the standing stone. Stay awake until the moon is overhead. · check: `wait:a08-plain:midnight`

#### Scene `a08-12-camp`

_Task eleven is a wide, flat plain under a big moon, with one standing stone and a lot of mist._  
**Caius Pupus** _(think)_: Spend one night on the Haunted Plain. At midnight the ghosts come. Nobody has ever stayed till morning.  
_You make a small fire by the stone. Obelix unwraps the last of Mannekenpix’s fried potatoes and shares them, which is love._  
_Dogmatix and your Nubbin curl up in the crook of Obelix’s arm. Asterix sharpens a stick for no reason._  
_The moon climbs and the mist thickens. Very far off, something clanks, like armour being carried by someone who isn’t there._  
**Caius Pupus** _(shock)_: Is it midnight?  
**Asterix**: It’s always midnight somewhere.  

**Choices**

- **Tell a story to pass the time.**
    - You tell them about the Grove, and the hill, and the pond. Obelix asks if there are boar, and you say no, gently.
- **Keep watch in silence.**
    - You watch the mist. Pupus watches it too, sitting very close to you, as if by accident.

#### Done `a08-12-camp-done`

_The mist parts. Out of it, glowing faintly green, march two lines of ghostly legionaries, chains clanking, moaning on the beat._  

### Step 2: Complain to the ghosts until they leave.

Hint: Talk to the centurion at the front. Be specific. Ghosts hate specifics. · check: `talk:a08-ghost`

#### Scene `a08-12-ghosts`

**A Ghostly Centurion** _(angry)_: Woooo. We are the lost legion. We march for ever. Fear us. Woooo.  
_Obelix sits up, blinking, with Dogmatix on his chest and your Nubbin on his head._  
**Obelix** _(angry)_: Excuse me. Some of us are trying to sleep.  
**A Ghostly Centurion** _(shock)_: We… we are ghosts. We are meant to be frightening.  
**Asterix**: You’re very loud. And your chains need oiling. And you’re standing in our potatoes.  
**A Ghostly Centurion**: We are not standing in anything. We are ghosts.  
**Obelix**: Your sheets are grubby, too. When did you last wash those? My mother would have had something to say.  
_The centurion looks down at his robe. It is, it must be said, a bit grey round the hem._  

**Choices**

- **“And the moaning is out of tune.”**
    - **A Ghostly Centurion**: It is NOT out of tune. Marcus. Marcus, are we out of tune?
    - Marcus, at the back, does not answer, which is an answer.
- **“Have you got a permit for this?”**
    - **A Ghostly Centurion**: A permit? For haunting? I… I don’t think we ever applied.
    - A ripple of worry goes down the ghostly lines.

#### Done `a08-12-ghosts-done`

**A Ghostly Centurion** _(sad)_: Well. If we’re not wanted. We know when we’re not wanted. Come on, lads. We’ll go and haunt somewhere grateful.  
_They shuffle off into the mist, sulking, chains dragging. One of them, at the back, looks round at your tablet as if it were a summons._  

#### Complete `a08-12-complete`

_Dawn comes up pink over the plain. The mist has gone, and so have the ghosts, and the potatoes, which nobody can explain._  
_You scratch a tick beside XI on the wax tablet: the haunted plain. Pupus looks at it, sighs, and initials it._  
**Caius Pupus** _(think)_: One left. The last one is in Rome. Caesar wants to see this himself.  
**Asterix**: Good. I want to see him see it.  
_Pupus does not argue. You notice that he has, at some point in the night, started walking on your side of the fire._  

**Rewards**


Sets on completion: `{"a08-12":true}`

**Notes:** TASK 11 (the Haunted Plain). The outline’s beat: complain at the ghosts until they leave. The ghosts are sulky and silly, faintly green, never skeletal. FORM ECHO (a08-form from A8-9): the "permit" choice is open on every path, and the ghost glancing at your tablet (a08-12-ghosts-done#1) is a light, flagless nod to the form you made; it is the same line on every path, so no variant is needed. The full payoff is A8-14.

## A8-13. The Circus Maximus

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): task 12, the arena* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-12, from Nova’s atlas. · requires: A8-12

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Julius Caesar (Julius Caesar, as drawn in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Vitalstatistix (Vitalstatistix, the village chief, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Getafix (Getafix, the village druid, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Cacofonix (Cacofonix, the village bard, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Asbestos (Asbestos, the Greek Olympic runner, task 1, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Verses (Verses, the Persian javelin champion, task 2, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Cilindric (Cilindric, the German wrestler, task 3, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Mannekenpix (Mannekenpix, the Belgian chef, task 6, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Go with the village to Rome.

Hint: The whole village is coming. Help the chief onto his shield; mind his feet. · check: `escort:a08-village:rome`

#### Scene `a08-13-rome`

_For the last task the whole village comes to Rome. Caesar has ordered it: the Gauls, all of them, in the Circus Maximus._  
**Vitalstatistix** _(happy)_: All of us! Excellent! A day out. Bring the boar.  
_Rome is enormous, white and gold and full of steps. The village walks through it in a long, loud, curious line._  
_The chief is carried on his shield. Getafix walks with his hands behind his back, looking at the aqueducts with interest._  
**Cacofonix**: Shall I sing something, for the journey? Something to make Rome weep?  
**Vitalstatistix**: No.  
_Under the huge arena, the village is shown into a stone room with a gate at one end. Through the gate, you hear the crowd._  
**Caius Pupus** _(sad)_: The task is to come out of the arena alive. Caesar has prepared… a show.  

**Choices**

- **Look through the gate.**
    - Sand, and sun, and tier on tier of faces. On a balcony at the top, a man in purple and a laurel crown.
- **Ask Pupus if he’s all right.**
    - **Caius Pupus**: I don’t know any more. I have watched you for eleven tasks. I think I would like you to win.

### Step 2: Referee the last task from the arena’s edge.

Hint: Stand at the gate with your tablet. Watch the lions, and then watch the crowd. · check: `watch:a08-circus:arena`

#### Scene `a08-13-arena`

_The gate goes up, the village walks out onto the sand, and the crowd roars. Another gate goes up, and the lions come out._  
_They are very big lions, and they have not had breakfast. Getafix takes a small flask from his robe and passes it round._  
_The first lion bounds at Asterix, and Asterix catches it under the front legs and dances with it, in a slow, stately circle._  
_Obelix rubs the second lion behind the ears until it rolls on its back. Gladiators run out; the chief invites them to dinner._  
_Someone lights a fire in the middle of the sand, and someone else has brought the boar. Somehow, there is a feast._  
_Your Nubbin and Dogmatix chase a lion cub round the arena, and the cub chases them back, and the crowd goes wild._  
_High in the stands, a white figure is cheering: Asbestos. Beside him are Verses, Cilindric, a floury Mannekenpix, and Iris, a person again._  
_The crowd isn’t booing the Gauls any more. It is coming down the steps to join the party._  

#### Done `a08-13-arena-done`

_Up on the balcony, Caesar stands, and the arena goes quiet. He looks down at the feast in his circus for a long moment._  
**Julius Caesar** _(think)_: Well. That is the twelfth. I suppose I had better be a good loser. It will be a new experience.  

#### Complete `a08-13-complete`

**Julius Caesar**: Gauls, you have done the twelve tasks of Hercules, and a few of your own. Rome declares you gods. Rome hopes you will be quiet ones.  
**Vitalstatistix** _(happy)_: Thank you, Caesar! Come to dinner. Bring a boar.  
**Julius Caesar**: I think not. But I shall look at your little dot on the map with… respect.  
_Pupus climbs up beside you and takes the wax tablet, and looks at all twelve ticks, and initials the last one with a flourish._  
**Caius Pupus** _(soft)_: Referee. Your scoring was impartial, generous, and occasionally very strange. I would observe you again.  
_You scratch a tick beside XII on the wax tablet: the arena. Pupus looks at it, sighs, and initials it._  

**Rewards**


Sets on completion: `{"a08-13":true}`

**Notes:** TASK 12 (the Circus Maximus). Nobody is hurt: the lions are big, hungry and quickly very friendly; the gladiators are glad of a break. Getafix’s flask is the potion, shown as a glow. The champions from tasks 1 to 6 are in the stands as friends, cheering, which is our addition (they were good losers). Caesar is pompous and a good sport. No battle imagery; the crowd joins in. The XII tick is the last line of the complete scene.

## A8-14. The Banquet

*The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976): the banquet* · audience: all · where: Nova’s atlas: the Twelve Tasks page (Atlas campaign) · when: Any time after A8-13, from Nova’s atlas. · requires: A8-13

**Cast:** Asterix (Asterix, the small, clever Gaulish warrior, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Obelix (Obelix, menhir delivery man, who fell into the potion as a baby, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Getafix (Getafix, the village druid, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Vitalstatistix (Vitalstatistix, the village chief, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Cacofonix (Cacofonix, the village bard, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue), Caius Pupus (Caius Pupus, Caesar’s observer who follows the tasks, in The Twelve Tasks of Asterix (Goscinny and Uderzo, 1976); original design and dialogue)

### Step 1: Help set up the banquet in the village square.

Hint: Carry the boar to the spits, and the benches to the tables. Then find the bard. · check: `carry:a08-boar:square`

#### Scene `a08-14-square`

_Back in the village, under the stars, the square is full of long tables. Every spit has a boar on it, turning._  
**Vitalstatistix** _(happy)_: Tonight, we feast! Twelve tasks, twelve boars! Thirteen, for the referee. Fourteen, for Obelix. Well, fifteen.  
_Pupus has come too, in a borrowed tunic, looking pleased and out of place. Nobody seems to mind that he’s Roman tonight._  
_You carry benches. Your Nubbin and Dogmatix carry a single bone between them, very seriously, and lose it under a table._  
_Then, from a hut at the edge of the square, comes the sound of somebody tuning a lyre. It goes on for some time._  
**Cacofonix** _(happy)_: Friends! To honour our heroes, I have written a new song. Forty-two verses, one for each…  
_Every head in the village turns, and nobody says anything. Asterix looks at Obelix, and Obelix looks at you._  

**Choices**

- **“Let him sing one verse.”**
    - **Cacofonix**: One verse! The first verse is the overture, which is in seven parts…
    - The village quietly starts looking round for something to tie him up with.
- **Look round for some rope.**
    - There is no rope; somebody used it on a cart. The village starts looking round for something else to tie him up with.

#### Done `a08-14-square-done`

**Asterix**: Referee. You haven’t still got that form from the Place That Sends You Mad, have you?  

### Step 2: Watch the village deal with the bard.

Hint: Find your form from task VIII in your satchel, and give it to Asterix. · check: `give:a08-form:asterix`

#### Scene `a08-14-tie`

_You take the form out of your satchel, where it has been since the porter handed it back. It is covered in stamps._  
_Your Nubbin and Dogmatix sit at your feet and look up at it, as if they would also like to know what it says._  
**Asterix**: That might do nicely.  
**Cacofonix** _(shock)_: What? What are you doing? I haven’t even started the overture!  
**Getafix**: Hold still, Cacofonix. If it’s long enough, it’s an honour. You’ll be bound in official papers.  
_Getafix reads the form’s heading by the light of the fire, and his eyebrows go up._  

#### Done `a08-14-tie-done`

_The whole village gathers round to see what you wrote, back in the building of endless counters._  

#### Complete `a08-14-complete`

_Then the feast goes on until the stars wheel round. Obelix eats four boars, then asks, hopefully, about the main course._  
**Getafix** _(soft)_: For the referee. You’ve seen what it does. Use it kindly.  
_Getafix gives you a tiny cauldron, no bigger than a cup, with something glimmering inside. Obelix looks at it, and sighs._  
**Vitalstatistix** _(happy)_: And a helmet, with wings! And a menhir! Obelix, give the referee a menhir. A small one.  
**Obelix** _(happy)_: This is my smallest one. I made it specially. It’s got a little face on it, look.  
_Far overhead, Asterix’s javelin whistles past going east, still going. Somewhere, Verses is still following it._  
**Caius Pupus** _(soft)_: Will you come back? You could referee the next lot. Caesar is already thinking of something.  
_The map closes round you like a hand. You are in the Grove, with a cauldron, a helmet, a very small menhir, and a dog’s hair on your sleeve._  

**Rewards**

- Winged helmet (cosmetic): A little round helmet with a white wing on each side, from the chief. Any Nubbin can wear it, and stands up straighter.
- Obelix’s smallest menhir (decor): A standing stone about knee-high, with a little face carved on it. Obelix made it specially. It goes anywhere in the Grove.
- Getafix’s little cauldron (feature): A cup-sized cauldron of glimmering potion that never runs dry. Before any race, a Nubbin may sip once, for one great sprint in that race.
- Price of Power Bookmark (item): A strip of wax tablet on a red cord, with twelve ticks scratched in it. It counts towards the Price of Power festival.

Sets on completion: `{"a08-14":true,"a08-done":true}`

**Notes:** THE BANQUET. The bard tied up is the source’s running joke; it is affectionate, he is not hurt, and in the complete scene he is still bound but has been given a plate (staging: draw him tied to a tree with a full plate in his lap). His song is never sung, so there are no lyrics. FORM PAYOFF (a08-form, from A8-9): straight after a08-14-tie-done and before a08-14-complete, play exactly one of ATLAS_A08_VARIANTS: loop → a08-14-bard-loop; boar → a08-14-bard-boar; plain → a08-14-useful (the form is too sensible to tie anyone up with; Getafix files it under "Useful", and the village uses an old fishing net instead). If a08-form is somehow unset, play a08-14-bard-loop. REWARDS (one-time, at a08-14-complete): the winged helmet (cosmetic), the menhir (decor), the potion cauldron (feature: in a race, a sprint once per race, unlimited races; never a timer, and it never raises stats; it is not a drink for people), and the Price of Power Bookmark. SIM: the Price of Power festival (A1, A4, A8 and the others in its list, any two) reads atlasDone('A8') from a08-done. The javelin passing over is the last callback to A8-3.

## Variant scenes

#### Variant `a08-14-bard-loop`

**Getafix** _(think)_: Form 0. Application to Find Out Whether You Need This Form. Please attach a completed copy of this form.  
_Every clerk in the building has dutifully attached a completed copy. It unrolls down to your knees, and keeps going._  
_There is a silence. Then the chief laughs so hard he falls off his shield, and the whole village goes with him._  
**Getafix** _(happy)_: It never ends. It cannot be finished. Of course: it’s perfect for him.  
_They wind it round Cacofonix and the oak tree seven times, and there is still some left over to tie a bow._  
**Cacofonix** _(angry)_: This is an outrage. I shall write a song about it. In forty-two verses.  
**Obelix** _(happy)_: You can’t. Your arms are inside a form.  

#### Variant `a08-14-bard-boar`

**Getafix** _(think)_: Proof That You Are Not a Boar. To be signed by a boar. And it has been. By a boar who signs with his knuckle.  
_Obelix goes pink with pride. Every clerk in the building has stamped it, and somebody has added a note: “Boar to be found.”_  
**Vitalstatistix** _(happy)_: Ha! Our referee made it! The silliest form in Gaul!  
_The notes run on for pages, each asking politely after the boar. It unrolls to your knees, and keeps going._  
_They wind it round Cacofonix and the oak tree until only his hat shows over the top, and a corner of the hoof print._  
**Cacofonix** _(angry)_: I am not a boar. I wish to state, for the record, that I am not a boar.  
**Getafix** _(happy)_: It’s all right. You have it in writing now.  

#### Variant `a08-14-useful`

**Getafix** _(think)_: Name. What you need. Signature. One page.  
_Getafix reads it twice, slowly, and then he doesn’t hand it over. He rolls it up and tucks it in his robe._  
**Getafix** _(happy)_: This is far too good for tying up a bard. I shall file this under "Useful". It is the only thing in that folder.  
**Asterix**: It didn’t win, though. It was too sensible to win.  
**Getafix** _(soft)_: Sensible things often lose on the day. Then people use them for years.  
_In the end they tie Cacofonix up with an old fishing net, which he says, through the holes, is an insult to his art._  
