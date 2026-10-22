# Atlas, page A29: The Honmoon

## A29-1. The First Hunters

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the prologue* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Step into the old ink scroll under the bright page.

Hint: Touch the scroll at the bottom of the page, not the stage. · check: `visit:a29-page:scroll`

#### <a id="a29-01-scroll"></a>Scene `a29-01-scroll`

_Nova’s atlas falls open at a page so bright it hums: a stage, a city at night, and a tiger in a hat grinning out of a corner._  
_Under the bright paint, older, there is a long ink scroll. Mountains, small villages, and a road between them._  
_You touch the scroll, and it is cool, like paper left by a window. Then it is mist, and you are standing in the painting._  
_Everything is ink: the hills, the pines, the roofs, your own sleeve. Your Nubbin is a round grey brushstroke at your feet._  
_Over the far mountains something comes, drawn fast and badly, all teeth. Demons, pouring down the slopes like spilt ink._  
_Where they pass, the people in the villages go pale, as if a brush had wiped the colour off them._  
_A voice in the painting says, or seems to say, that the demons take the light out of people and carry it down to their king._  
_Far below the mountains, in a red smudge that is the only colour in the scroll, something huge is waiting. Its name is Gwi-Ma._  

**Choices**

- **Look at the people in the villages.**
    - A woman in the nearest village is holding a bowl of rice, and has forgotten why. You want very much to give her back her colour.
- **Pick up your Nubbin.**
    - You lift your Nubbin, and in your arms it goes back to its own colour, and so does your hand. Good: keep hold.
- **Look at the red smudge.**
    - You look at it for a moment too long, and it seems to look back. You look away first.

#### <a id="a29-01-scroll-done"></a>Done `a29-01-scroll-done`

_On a hill above the villages, three small figures in long skirts climb to the top, and turn to face the mountains._  

### Step 2: Walk the scroll, from the three women to the present day.

Hint: Follow the road along the scroll; each painting is a new generation. · check: `walk:a29-scroll:generations`

#### <a id="a29-01-hunters"></a>Scene `a29-01-hunters`

_The three women on the hill open their mouths, and sing. You don’t hear words, only something like a held breath let go._  
_Where the sound goes, the ink brightens into a shining line. It runs along the mountain ridge and closes like a stitch._  
_The demons hit the line and stop, and pace along it, gnashing, and cannot cross. The people in the villages get their colour back._  
_A label in neat brushwork says the line is called the Honmoon. A voice held it up, and only voices can keep it up._  
_You walk on, and the scroll walks with you. Three new hunters on the hill, then three more, generation after generation._  
_Each three are painted holding something: a sword, a long blade, a fan of little knives. Each three are painted singing._  
_And each three hope, the labels say, to sing so well that the line turns to gold and shuts for good, and the demons are gone forever._  
_Nobody ever has. The last painting on the scroll is three girls on a stage, in boots, under lights that are not painted at all._  

**Choices**

- **Let your Nubbin hum along.**
    - Your Nubbin hums, flat and happy. The shining line wobbles very slightly, as if it has been tickled.
- **Listen without a sound.**
    - You listen. It is the kind of music that makes you stand up straighter without deciding to.

#### <a id="a29-01-hunters-done"></a>Done `a29-01-hunters-done`

_The ink goes from black to neon pink, then electric blue: car horns, rain on hot pavement. You step off the scroll into a city at night._  

### Complete

#### <a id="a29-01-complete"></a>Complete `a29-01-complete`

_A man in a good suit and bad trainers is coming at you with two phones, a clipboard and a face that hasn’t slept._  
**Bobby**: You! Are you the new runner? You’re the new runner. You’re late. It doesn’t matter. Hold these.  
_He gives you a plastic bag of instant noodles, a box of light sticks, and a lanyard with your face on it, somehow._  
**Bobby**: I’m Bobby. I manage Huntrix. Huntrix is the biggest group in Korea, and tonight is a sold-out show, and I am very calm.  
_Your Nubbin climbs into the merchandise bag, settles among the T-shirts, and looks out like a passenger on a bus._  
**Bobby**: Don’t touch the girls’ cases. Never touch the girls’ cases. Go, go, go.  

#### <a id="a29-01-margin-hazel"></a>Variant `a29-01-margin-hazel`

_Variant within A29-1; it has no single parent scene._

_When you next look at Nova’s atlas, there is a pencil note under the ink scroll, low in the margin. You know the hand._  
_“Never been. Nova says it’s all singing.”_  
_“I’d hum.”_  

#### <a id="a29-01-sable-hid"></a>Variant `a29-01-sable-hid`

_Variant within A29-1; it has no single parent scene._

_Something brushes your ankle in the ink: Sable has come with you. She is a grey smudge in the grey mist, keeping very low._  
_She doesn’t come to your hand. She finds the deepest shadow on the scroll and goes into it, and watches you from there._  

Sets `{"a29-sable":"hid"}`

#### <a id="a29-01-sable-heel"></a>Variant `a29-01-sable-heel`

_Variant within A29-1; it has no single parent scene._

_Sable has come with you. She walks at your heel through the ink, grey on grey, and her ears are up._  
_She looks at the demons on the far mountains for a long moment. Then she looks at you, and stays where she is._  

Sets `{"a29-sable":"heel"}`

**Rewards**


Sets on completion: `{"a29-01":true}`

**Notes:** OPENING: the bright page is a painted poster; the scroll below it is ink on paper and must read clearly as an old painting (adviser: the scroll style should be Korean ink painting, sumukhwa, not Chinese or Japanese). The three first hunters wear hanbok of an early period; adviser to check. Their song is original wordless music (a sustained three-voice chord that becomes the page’s theme). Gwi-Ma is a red smudge only. SABLE (read when this quest starts): t45 → play ATLAS_A29_VARIANTS a29-01-sable-hid straight after a29-01-scroll; bonded → a29-01-sable-heel. Each sets a29-sable. none or t20: nothing plays. HAZEL (s24Done, read-only): play a29-01-margin-hazel straight after a29-01-complete if s24Done is set.

## A29-2. Huntrix

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the concert, and after* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-1, from Nova’s atlas. · requires: A29-1

**Cast:** Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Get the merchandise to the stalls before the doors open.

Hint: Carry the boxes through the backstage corridor to the arena foyer. · check: `carry:a29-merch:arena`

#### <a id="a29-02-backstage"></a>Scene `a29-02-backstage`

_Backstage is a corridor of black curtains, gaffer tape and people running with headsets on, all saying “copy” to nobody._  
_Three girls are warming up in a doorway. One is doing scales, one is doing stretches, and one is eating a rice ball very fast._  
**Zoey** _(happy)_: Ooh, new runner. Hi! I’m Zoey. Is that a creature in the merch bag, or a very round T-shirt?  
**Mira**: Mira. Don’t let Bobby see that. He’ll put it on a mug.  
_The third girl stops her scales and smiles at you properly. She has a long purple plait and long sleeves, though the corridor is roasting._  
**Rumi**: I’m Rumi. Thanks for coming tonight. Bobby forgets to say it, so I say it twice. Thanks.  
**Bobby**: Runner! Merch! Foyer! The doors open in nine minutes!  

**Choices**

- **Let your Nubbin wave.**
    - **Zoey**: It waved. It waved at me. I’m keeping it.
    - **Mira**: You can’t keep the runner’s pet.
- **Nod and grab the boxes.**
    - **Rumi**: A runner who runs. Bobby might cry.

#### <a id="a29-02-backstage-done"></a>Done `a29-02-backstage-done`

_The foyer is already a sea of light sticks, and someone nearly buys a T-shirt off your back. Your Nubbin is offered four snacks._  

### Step 2: Watch the show from the wings, out of everyone’s way.

Hint: Stand by the side curtain, behind the yellow tape. · check: `watch:a29-concert:wings`

#### <a id="a29-02-show"></a>Scene `a29-02-show`

_The lights go down. The whole arena breathes in at once, thousands of light sticks held up like a field of little moons._  
_Then Huntrix are on stage, and the sound hits you in the chest. It is loud, and bright, and very good._  
_You don’t catch words. You catch the shape of it: three voices that fit like hands round a cup._  
_Above the stage, above the roof, you see something nobody else is looking at. A faint line of light across the night sky, shimmering._  
_It is the line from the scroll, the Honmoon. Each time the three of them hit a high note together, it brightens._  
_In the third row a man’s face goes pale and blank for a moment. Then the chorus comes round, and he blinks and laughs and waves his light stick._  
**Bobby** _(soft)_: Look at the numbers. Look at those faces. Look at me not crying.  

#### <a id="a29-02-show-done"></a>Done `a29-02-show-done`

_The last chord ends. The line in the sky hums like a struck glass, and holds._  
**Rumi**: Bobby, tell the car to wait. We’ve got a thing.  

### Step 3: Carry the girls’ gear case to the car park.

Hint: Bobby said never to touch it. Rumi just said to bring it. · check: `carry:a29-gearcase:car-park`

#### <a id="a29-02-fight"></a>Scene `a29-02-fight`

_The case is long, black and heavy. Rumi said bring it, and Rumi seems to outrank Bobby in practice._  
_Down in the empty car park, the strip lights flicker. Things are coming out of the shadows between the vans: grinning, too tall, all teeth._  
**Mira**: Demons. Three, four… six. Open the case, runner, and then stand very far back.  
_Inside the case: a sword, a long-hafted blade taller than Mira, and a belt of small throwing knives, all faintly glowing._  
_Rumi draws the sword, and Zoey catches the knives one-handed. Mira spins the long blade like a baton and looks bored, on purpose._  
_Your Nubbin takes one look at the demons and dives head-first into a stage speaker that is waiting to be loaded._  
**Zoey**: Same, honestly.  
_Then it is very fast, and very bright. The demons come apart into smoke and sparks, and the car park smells of burnt sugar._  

#### <a id="a29-02-fight-done"></a>Done `a29-02-fight-done`

_When it is over, your Nubbin climbs out of the speaker, stands on top of it, and puffs out its chest._  
**Zoey** _(happy)_: Yes. You. You did that. Hero of the car park.  

### Complete

#### <a id="a29-02-complete"></a>Complete `a29-02-complete`

_Bobby comes down the ramp with three bottles of water and the face of a man who has decided not to ask._  
**Bobby**: Car’s here. Runner, you didn’t see any of this. What did you see?  
**You**: A really good show.  
**Bobby** _(happy)_: Perfect answer. Here, have this, it’s broken and they’re throwing it out.  
_It is an old stage light, the size of a teapot, with a cracked pink filter. When you tap it, it still glows._  
**Rumi** _(soft)_: Thanks for carrying. And for not running away. Most people do, the first time.  

#### <a id="a29-02-stage-hid"></a>Variant `a29-02-stage-hid`

_Variant within A29-2; it has no single parent scene._

_In a gap under the stage, between two cases of cables, a pair of eyes catches the light. Sable has found the darkest place in the arena._  
_Every time the bass drops she flattens a little. She doesn’t leave._  

**Rewards**

- Stage light (decor): A small retired stage light with a cracked pink filter. Place it in the Grove; tap it to switch it on.

Sets on completion: `{"a29-02":true}`

**Notes:** The concert is original wordless music only. NEVER put lyrics, a song title or a set list on screen; the stage’s video wall shows shapes and colours. The weapons: Rumi’s sword, Mira’s long-hafted blade (a woldo-style glaive) and Zoey’s throwing knives; adviser to check the Korean forms. The demons fade into smoke and sparks, nothing more. SABLE: if a29-sable = hid, play ATLAS_A29_VARIANTS a29-02-stage-hid straight after a29-02-show (under the stage).

## A29-3. Ramyun

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): noodles at night* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-2, from Nova’s atlas. · requires: A29-2

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Fetch more instant noodles from the shop downstairs.

Hint: The convenience store on the corner is open all night. · check: `collect:a29-ramyun:store`

#### <a id="a29-03-kitchen"></a>Scene `a29-03-kitchen`

_Huntrix’s flat is high up, with a city view and a tiny kitchen. At two in the morning, every pan in it is full of noodles._  
**Zoey**: Rule of the house. You fight demons, you eat ramyun. You fight a lot of demons, you eat a lot of ramyun.  
**Mira**: We’re out. We are, terribly, out.  
_Three faces turn to you, then to your Nubbin, then back to you. Your Nubbin can’t carry money._  
**Rumi**: The shop on the corner. The spicy ones, the mild ones, and whatever is new. Zoey likes whatever is new.  
**Zoey** _(happy)_: I like whatever is new.  

**Choices**

- **Go at once.**
    - **Mira**: Look at that. Bobby hired someone with legs.
- **Ask them to write it down.**
    - **Rumi**: Spicy, mild, new. You’ll remember. It’s the most important list in Seoul.

#### <a id="a29-03-kitchen-done"></a>Done `a29-03-kitchen-done`

_The shop is bright and humming. You come back with a bag of noodle cups, three triangle gimbap and a new flavour that is bright green._  

### Step 2: Eat with them, and pay attention.

Hint: Sit at the low table by the window. · check: `sit:a29-flat:table`

#### <a id="a29-03-table"></a>Scene `a29-03-table`

_The four of you eat on the floor round a low table, with the city lights all down the window. Your Nubbin gets the bright green one._  
**Zoey** _(happy)_: Did you see the man in the third row? Crying, then laughing? That was us. We did that.  
**Mira**: He was crying because a demon was eating him a bit, Zoey.  
**Zoey**: And then he was laughing. Because of us.  
_Rumi laughs too, and halfway through the laugh her voice catches. A small crack, like a dry twig._  
_She coughs it off and drinks her water. Mira looks at her, and Zoey looks at her noodles, very hard._  
**Rumi**: Long night. That’s all.  
_The flat is hot, the window shut against the traffic, and the fan only turns the warm air round. Rumi is still in long sleeves._  
_She pulls them down over her hands while she eats. You notice it, and then you notice yourself noticing, and look at your bowl._  

**Choices**

- **Turn the fan towards her.**
    - **Rumi**: Thanks. I’m fine. I always run cold.
    - It isn’t true, and she knows you know, and you both eat noodles.
- **Say nothing and keep eating.**
    - You eat, and Rumi eats. After a while she stops pulling at her sleeves, as if she has forgotten to.

#### <a id="a29-03-table-done"></a>Done `a29-03-table-done`

_By three, Zoey is asleep with her chopsticks still in her hand. Mira takes them out, gently, and puts a cushion under her head._  

### Complete

#### <a id="a29-03-complete"></a>Complete `a29-03-complete`

_In the morning there is a present on the gear case, with a sticky note in Zoey’s round writing._  
_It is an empty noodle cup, washed, cut down small, with a paper rim and a strap. A hat, exactly your Nubbin’s size._  
**Zoey** _(happy)_: Every hunter needs a helmet. That one is mostly soup-proof.  
_Your Nubbin puts it on and won’t take it off, not even to sleep._  

#### <a id="a29-03-pans-hid"></a>Variant `a29-03-pans-hid`

_Variant within A29-3; it has no single parent scene._

_When you get back, the kitchen has an extra guest. Sable is behind the stack of noodle pans by the cooker, only her ears showing._  
_Rumi sees her, and doesn’t say anything, and puts a few plain noodles on a saucer by the pans, and leaves them there._  

**Rewards**

- Noodle-cup hat (cosmetic): A tiny hat cut from a washed noodle cup, made by Zoey. Any Nubbin can wear it.

Sets on completion: `{"a29-03":true}`

**Notes:** Food and the flat: adviser to check (late-night ramyun from a convenience store, triangle gimbap, eating on the floor at a low table). The heat and Rumi’s sleeves are the beat; draw the sleeves clearly. SABLE: if a29-sable = hid, play ATLAS_A29_VARIANTS a29-03-pans-hid straight after a29-03-kitchen-done (behind the pans).

## A29-4. Celine

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): Rumi and the woman who raised her* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-3, from Nova’s atlas. · requires: A29-3

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Celine (Celine, the former hunter who raised Rumi, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Walk Rumi to Celine’s house and carry the fruit.

Hint: Follow Rumi through the old lanes; carry the fruit box carefully. · check: `escort:a29-rumi:celine-house`

#### <a id="a29-04-lanes"></a>Scene `a29-04-lanes`

**Bobby**: Rumi’s visiting Celine. Go with her. Carry the fruit. Celine likes fruit, and doesn’t like me.  
_The fruit is a box of Korean pears, each one wrapped in its own little foam net, like a pear in a jumper._  
_Rumi takes you up through a quarter of old houses: tiled roofs with curling eaves, wooden gates, walls of pale stone._  
**Rumi**: Celine was a hunter. Before us. When I was little she took me in, and trained me, and raised me. All of it.  
**Rumi** _(think)_: She taught me everything. How to hold a sword. How to hold a note. How to hold…  
_She doesn’t finish. She tugs her sleeve down, though it is already down._  

**Choices**

- **“How to hold what?”**
    - **Rumi**: Myself. Together. You know.
    - She walks a bit faster, and you let her.
- **Ask about the pears in jumpers.**
    - **Rumi**: So they don’t bruise. Everything in this country is wrapped. Including me, according to Mira.

#### <a id="a29-04-lanes-done"></a>Done `a29-04-lanes-done`

_Celine’s house is an old hanok round a courtyard, very neat. Rumi takes the pears, and asks you to wait outside the gate._  

### Step 2: Wait outside the gate.

Hint: Sit on the step by the wall. The paper doors aren’t thick. · check: `wait:a29-celine:gate`

#### <a id="a29-04-gate"></a>Scene `a29-04-gate`

_You sit on the stone step outside. Your Nubbin, in its noodle hat, watches a sparrow on the wall._  
_The old doors are wood and paper. You don’t mean to listen, but you hear enough anyway._  
**Celine**: Let me see.  
_A pause. A rustle of a sleeve going up._  
**Celine** _(sad)_: They’ve spread. Up past the elbow now.  
**Rumi**: I know. I keep them covered. Nobody’s seen. Nobody will.  
**Celine**: Good. A hunter can’t be what she hunts. If they saw, they wouldn’t understand. Keep them hidden.  
**Rumi**: When we make the Honmoon gold, they’ll go. You said. When it’s sealed, they’ll go, and then I’ll be… right.  
**Celine** _(soft)_: Then work harder. Sing better. Don’t let anyone in.  

**Choices**

- **Move further from the gate.**
    - You get up and walk to the end of the wall, out of earshot. It is too late, but it is something.
- **Stay where you are.**
    - You stay. It seems worse, somehow, to leave her out here alone when she comes out.
- **Show your Nubbin the sparrow.**
    - You point out the sparrow. Your Nubbin chirps at it, and the sparrow chirps back, and you listen to that instead.

#### <a id="a29-04-gate-done"></a>Done `a29-04-gate-done`

_Celine’s voice drops low. Then the gate opens and Rumi comes out, smiling, with her sleeves pulled down to her knuckles._  

### Complete

#### <a id="a29-04-complete"></a>Complete `a29-04-complete`

**Rumi** _(happy)_: She liked the pears.  
_She walks back down the lane quickly. You walk beside her and say nothing about anything._  
**Rumi**: We’re close, you know. Huntrix. A few more shows like last night, and the Honmoon will turn to gold.  
**Rumi** _(soft)_: And then it’ll be over. All of it.  
_She says it the way people say they’ll be happy when the weather turns._  

**Rewards**


Sets on completion: `{"a29-04":true}`

**Notes:** Celine’s house is a hanok round a courtyard (adviser: a tidy modern-lived hanok, as in Bukchon). We hear the visit through the doors; the marks are never seen here, only described. Celine is strict and frightened for Rumi, not cruel. Gift of fruit: Korean pears in foam nets (adviser).

## A29-5. The Saja Boys

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the rival band* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-4, from Nova’s atlas. · requires: A29-4

**Cast:** Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), A girl in a Huntrix T-shirt (An original fan; no source character)

### Step 1: Watch the new band’s debut on the big screens.

Hint: The giant screen over the crossing shows the debut at eight. · check: `watch:a29-saja:debut`

#### <a id="a29-05-debut"></a>Scene `a29-05-debut`

_At eight o’clock every big screen in the shopping street goes black at once. Then five boys walk out of the dark._  
_They wear long black coats, and wide-brimmed hats of fine black horsehair, tied under the chin. Gat, the old kind._  
_The leader looks straight down the camera, and half the street stops walking. He is called Jinu, the screen says._  
_Their music is smooth and catchy, and it goes into your ear like warm water. You find your foot is tapping and stop it._  
**A girl in a Huntrix T-shirt** _(shock)_: Oh. Oh, no. Who are they? Why have I never heard of them? Why do I love them?  
**Bobby** _(angry)_: Who are they? Where did they come from? Nobody debuts at the top of the chart. Nobody!  
_Bobby is refreshing the charts on both phones. The Saja Boys are climbing, one place a minute._  

**Choices**

- **Keep watching.**
    - You keep watching, and the longer you watch, the harder it is to look away. That is interesting, and not in a good way.
- **Calm Bobby down.**
    - **Bobby**: I am calm. This is my calm face. This is what my calm face looks like now.

#### <a id="a29-05-debut-done"></a>Done `a29-05-debut-done`

_High above the city, where only you seem to look, the line of the Honmoon flickers like a bulb about to go._  

### Step 2: Look closely at the crowd under the screens.

Hint: Walk among the people watching, and look at their faces. · check: `inspect:a29-crowd:crossing`

#### <a id="a29-05-crowd"></a>Scene `a29-05-crowd`

_You walk among the people under the screens. They are smiling, mostly, and some are singing along to words you can’t make out._  
_But their eyes are wrong. A bit blank, a bit far, like people who have stood too long in the sun._  
_A faint shimmer is drifting up off them, like breath on a cold day, towards the screen and the boy on it._  
_Zoey and Mira come through the crowd in caps and masks. Zoey stops by you and looks up at the hats on the screen._  
**Zoey**: Jeoseung saja. That’s what they’re dressed as. Black coat, black gat. My grandma’s stories.  
**Zoey**: The saja are the ones who walk you to the other side when it’s your time. They’re not the bad guys. They’re just… doing their job.  
**Mira**: Which is a strange costume for a boy band.  
**Zoey** _(think)_: Unless it isn’t a costume. Unless they’re wearing it because it scares us.  

**Choices**

- **Tell them about the shimmer.**
    - **Mira**: You can see that? Huh. Good eyes, runner.
    - Mira looks at you a little longer than before, and then at the screen, and her hand goes to her back, where the blade isn’t.
- **Keep it to yourself for now.**
    - You keep it to yourself. Mira sees it anyway, a moment later, and swears very quietly into her mask.

#### <a id="a29-05-crowd-done"></a>Done `a29-05-crowd-done`

_The song ends, the crowd wakes up a bit, and the shimmer stops. The Honmoon flickers, and holds._  

### Complete

#### <a id="a29-05-complete"></a>Complete `a29-05-complete`

**Zoey**: I’m telling Rumi.  
**Mira** _(sad)_: Rumi’s at the studio. Rumi’s been at the studio since six. Rumi’s voice is going, and she won’t say.  
**Bobby**: I don’t know what you two are muttering about, but I need a hit, and I need it yesterday.  
_Your Nubbin looks up at the screen, at the boy in the hat, and pulls the noodle cup lower over its eyes._  

**Rewards**


Sets on completion: `{"a29-05":true}`

**Notes:** CARE: Zoey’s explanation of the jeoseung saja is deliberate. In Korean folk belief they escort the dead and are not evil; the demons are wearing their look. Advisers to check her wording. Draw the gat accurately (fine black horsehair and bamboo, chin strings). The Saja Boys’ music is original and wordless in the mix: the fans may be singing, but no words are ever written or subtitled. The shimmer leaving the crowd is soft and faint, never distressing. Bobby’s phone charts must not show any real song title.

## A29-6. The Marks

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the first fight with the Saja Boys* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-5, from Nova’s atlas. · requires: A29-5

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Jinu (Jinu, leader of the Saja Boys, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Carry the gear case to the empty television studio.

Hint: The music-show studio is dark after midnight; take the loading door. · check: `carry:a29-gearcase:studio`

#### <a id="a29-06-studio"></a>Scene `a29-06-studio`

_After the music show’s recording, when the studio is empty, the Saja Boys stay behind. So do Huntrix, in the dark._  
**Mira**: We followed one of them home. Except “home” was a crack in the air behind a vending machine. They’re demons, Rumi.  
**Rumi**: All five?  
**Zoey**: All five. Hats and all.  
_Rumi’s face goes very still. Then she nods, once, and holds out her hand to you without looking, and you give her the sword._  
**Rumi**: Runner, stay by the door. If it goes badly, run, and tell Bobby we said sorry about the studio.  

**Choices**

- **Stay by the door.**
    - You stay by the door. Your Nubbin, in the merch bag, peeks out with one eye.
- **Stay by the gear case instead.**
    - You stay by the open case, where the spare knives are. Zoey sees, and gives you a thumbs up, and doesn’t send you back.

#### <a id="a29-06-studio-done"></a>Done `a29-06-studio-done`

_The studio lights come on all at once, every colour. Five boys in black coats are standing on the set, as if they’ve been waiting._  

### Step 2: Watch the fight from behind the camera crane.

Hint: Keep low behind the crane. Don’t help unless someone needs the case. · check: `watch:a29-fight:studio`

#### <a id="a29-06-fight"></a>Scene `a29-06-fight`

_It is a fight like a dance number: fast, bright, a lot of spinning. The boys are quick, and they laugh while they fight._  
_Zoey’s knives go thunk into a set wall. Mira’s blade sweeps a whole row of fake flowers off a stand._  
_Rumi and Jinu end up face to face on the stage stairs. Her sword is at his throat, and his hand has caught her wrist._  
_Her sleeve has ridden up. On her wrist and forearm there are marks: curling patterns, violet and silver, like ink in water._  
_Jinu sees them, and his eyes go wide. For a moment neither of them moves at all._  
_Then Mira shouts, coming up the stairs. And Jinu, very quickly, pulls Rumi’s sleeve down over the marks, and lets her go._  
**Jinu**: Another time, hunter.  
_He steps back into a shadow, and is not there. The other boys go with him, in a gust of cold air and a smell of old smoke._  

#### <a id="a29-06-fight-done"></a>Done `a29-06-fight-done`

**Zoey**: Did he… did he just let you go? Why would he do that?  
**Rumi** _(think)_: I don’t know.  

### Step 3: Take the water bottles to the dressing room.

Hint: The dressing room is down the corridor, past the make-up chairs. · check: `deliver:a29-water:dressing-room`

#### <a id="a29-06-sleeve"></a>Scene `a29-06-sleeve`

_In the dressing room, Mira and Zoey are arguing in the shower block about who broke the flower stand._  
_Rumi is at the mirror with her back to the door, catching her breath. She has pushed her sleeve up to cool her arm._  
_The marks go from her wrist almost to her shoulder now. In the mirror light they shimmer, violet and silver._  
_She looks up, and sees you in the mirror, holding three bottles of water. She doesn’t move._  
_You are the only one who has seen. Mira and Zoey are still arguing behind the door._  
_Your own jacket is on the chair beside you, where you dropped it to carry the case._  

**Choices**

- **Hand her the jacket, and say nothing.** — sets `{"a29-sleeve":"jacket"}`
    - You put down the water and hold out the jacket. She takes it and puts it on, fast, and zips it to the chin.
    - **Rumi**: Thank you.
    - She doesn’t say for what. You don’t ask.
- **“I saw. It’s all right.”** — sets `{"a29-sleeve":"saw"}`
    - **You**: I saw. It’s all right.
    - She looks at you for a long time in the mirror. Then she pulls her sleeve down, slowly, not fast.
    - **Rumi**: You don’t know what it is.
    - **You**: No. It’s still all right.
- **Look away, and let her decide whether you saw.** — sets `{"a29-sleeve":"away"}`
    - You look down at the bottles in your arms, as if they are very interesting, and put them on the counter one by one.
    - When you look up again her sleeve is down, and she is smiling at the mirror, and neither of you says anything.

### Complete

#### <a id="a29-06-complete"></a>Complete `a29-06-complete`

_Mira and Zoey come out with wet hair, still arguing. Rumi laughs at them in exactly the right places._  
**Mira**: Why did he let you go, Rumi? Seriously.  
**Rumi** _(happy)_: Maybe he was scared of you.  
_Mira likes that answer so much that she doesn’t notice it isn’t one._  

**Rewards**


Sets on completion: `{"a29-06":true}`

**Notes:** SIGNATURE CHOICE (a29-06-sleeve sets a29-sleeve = jacket | saw | away). It pays off in A29-12 (a29-12-find and its variants), A29-14 (a29-14-song-done and its variants) and A29-16 (a29-16-complete and its variants). The marks: violet and silver patterns like ink in water, beautiful, never sore or ugly (care note). The fight is choreography, not injury: no one is cut. The boys vanish into shadow.

## A29-7. Derpy and Sussie

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the tiger and the magpie* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-6, from Nova’s atlas. · requires: A29-6

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Find out what is knocking over the bins behind the flats.

Hint: Look in the alley behind the building, after dark. · check: `find:a29-derpy:alley`

#### <a id="a29-07-alley"></a>Scene `a29-07-alley`

_Something is knocking over the bins behind Huntrix’s building, every night, and then looking embarrassed about it._  
_You go down with a torch. In the alley there is a tiger: a big one, blue as a bruise, with a wide silly grin and crossed eyes._  
_On the tiger’s head stands a magpie, black and white, with a long tail and a beady, knowing eye. She looks at you sideways._  
_They are not from here. You can tell by the faint smoky shimmer round their edges, the same as the boys in black coats._  
_Your Nubbin climbs out of the merch bag before you can stop it, walks up to the tiger and holds out the last of its biscuit._  
_The tiger looks at the biscuit, and at your Nubbin. Then he lies down flat on his belly, very carefully, and purrs like a kettle._  

**Choices**

- **Scratch the tiger behind the ear.**
    - He leans into your hand so hard he falls over sideways. The magpie hops off his head just in time, and gives you a look.
- **Nod politely to the magpie.**
    - The magpie looks at you, decides you will do, and nods back. Her long tail bobs.

#### <a id="a29-07-alley-done"></a>Done `a29-07-alley-done`

_Your Nubbin climbs up the tiger’s nose and sits on his head where the magpie was. The tiger goes cross-eyed trying to see it, and purrs louder._  

### Step 2: Deliver the note the magpie brought. Don’t read it.

Hint: Rumi is on the roof. Take the note up the fire stairs. · check: `deliver:a29-note:roof`

#### <a id="a29-07-note"></a>Scene `a29-07-note`

_The magpie hops onto the bin lid and drops a folded note in front of you. On the outside, in a careful old hand, it says “Rumi”._  
_The tiger, Derpy, as you will learn, has a name tag round his neck. The magpie is called Sussie, by her tag, and she is in charge._  
_You know who they belong to. The note smells faintly of old smoke, like the studio did._  
_Sussie pecks the note towards you, then taps the fire stairs with her beak. Up: Rumi’s on the roof._  
_It is a short walk up nine flights. You are absolutely not going to read the note, because it isn’t yours._  
_It is folded only once._  

**Choices**

- **Read it. Just the first line.**
    - “Your friend with the knives pinned my coat to a wall, my best one. Meet me where the old wall goes up the hill.”
    - You fold it back exactly as it was, feeling awful. You also want to know about the coat.
- **Don’t read it.**
    - You don’t read it. You hold it face down all the way up, at arm’s length, like a hot plate.
    - At the top your Nubbin, who can’t read, unfolds it, looks at it upside down with great interest, and folds it back.

#### <a id="a29-07-note-done"></a>Done `a29-07-note-done`

_Rumi is alone on the roof, in a hoodie, looking at the line of the Honmoon over the city. It flickers more than it used to._  

### Complete

#### <a id="a29-07-complete"></a>Complete `a29-07-complete`

_You hand her the note. She sees the writing, and opens it with her back to you._  
**Rumi**: Did you read it?  
_You don’t answer fast enough. She laughs, the first real laugh you have heard from her in days._  
**Rumi**: Of course you did. Don’t tell Mira. Don’t tell Zoey. Don’t tell the tiger.  
_Down in the alley, Derpy rolls onto his back, and Sussie sits on his tummy, and they both look up at the roof._  

**Rewards**


Sets on completion: `{"a29-07":true}`

**Notes:** CARE: Derpy and Sussie are drawn in the spirit of the Korean folk painting of the tiger and magpie (kkachi horangi): the tiger comic and a bit foolish, the magpie bright and knowing, bringer of news. Never menacing. They never speak. The note text is our own. The choice is comic either way; it sets no flag.

## A29-8. The Voices

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): Jinu’s story* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-7, from Nova’s atlas. · requires: A29-7

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Jinu (Jinu, leader of the Saja Boys, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Keep watch at the bottom of the old city wall.

Hint: Sit at the foot of the steps where the wall climbs the hill. · check: `wait:a29-wall:steps`

#### <a id="a29-08-watch"></a>Scene `a29-08-watch`

**Rumi**: I need someone to stand at the bottom of the steps and look normal. Can you look normal?  
_You look at your Nubbin, in its noodle hat, and at yourself. You say you can try._  
_The old city wall climbs the hill in big grey stones, with lamps along it, and the whole of the city below like a spilt jewel box._  
_Halfway up, Jinu is sitting on the wall in his black coat, with no hat. Derpy is asleep across his feet._  
_Rumi goes up to him with her hands in her pockets. You stay at the bottom, looking normal._  
_Sussie lands beside you on the bottom step, and looks normal too, in her own way._  

**Choices**

- **Look normal.**
    - You look normal so hard that a passing grandmother asks if you are lost, and gives your Nubbin a sweet.
- **Edge a few steps up.**
    - You edge up a few steps. Sussie hops up beside you, step for step, as if this was her idea.

### Step 2: Listen to what Jinu tells her.

Hint: You can hear them from the lamp at the bend in the wall. · check: `watch:a29-jinu:wall`

#### <a id="a29-08-story"></a>Scene `a29-08-story`

**Jinu**: You have voices too. I can tell. Not the singing kind. The other kind, that talk in your head at night.  
**Rumi**: Everyone has those.  
**Jinu** _(sad)_: His are louder. Gwi-Ma’s. That’s how he works. He finds the thing you’re ashamed of, and he talks to it until it’s all you can hear.  
**Rumi**: And you? What’s yours?  
**Jinu**: I was human once. Four hundred years ago. A poor musician with a lute and a hole in his shoe, playing in market squares.  
**Jinu**: My family were hungry, and I was no use to them. And he came, and offered me a voice that everyone would love.  
**Jinu** _(soft)_: So I said yes, to feed them. And then he took me, and I never saw them again.  
_Rumi is quiet. Then she reaches out, and nearly touches his sleeve, and doesn’t._  
_From down the wall, you can see Jinu’s face better than she can. When he says “to feed them”, he looks away._  

**Choices**

- **Notice it, and keep it.**
    - You notice it, and you keep it, because it is not your story to tell. But you remember the way he looked away.
- **Decide it doesn’t matter tonight.**
    - Maybe it doesn’t matter; everyone tells their own story a bit kinder than it was. You hope that’s all it is.

#### <a id="a29-08-story-done"></a>Done `a29-08-story-done`

_Rumi comes down the steps alone. Her voice, when she says “let’s go”, is rough at the edges, but it’s there._  

### Complete

#### <a id="a29-08-complete"></a>Complete `a29-08-complete`

**Rumi**: He’s a demon. I know he’s a demon. I’m not stupid.  
**Rumi** _(soft)_: But he knows about the voices. Nobody else knows about the voices.  
_Halfway home she stops at a street stall and buys two fish-shaped pastries, and gives one to your Nubbin without asking._  
_Your Nubbin eats the tail first. Rumi watches it and doesn’t say anything else all the way home._  

**Rewards**


Sets on completion: `{"a29-08":true}`

**Notes:** The wall is Seoul’s old city wall at night (Naksan section, with the city below); adviser to check. Jinu’s story here is the kinder, false version (he says he went to feed his family). The truth comes in A29-12. Draw him looking away on “to feed them”. The pastry is bungeoppang (fish-shaped, filled with red bean); adviser.

## A29-9. The Harsh Song

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the argument* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-8, from Nova’s atlas. · requires: A29-8

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Make tea while the three of them work.

Hint: Use the kettle in the studio kitchen; barley tea is in the tin. · check: `craft:a29-tea:studio-kitchen`

#### <a id="a29-09-studio"></a>Scene `a29-09-studio`

_The rehearsal studio has egg-box foam on every wall and a keyboard with a coffee ring on it. Mira and Zoey have been here all night._  
**Zoey**: We’ve got it. The thing that brings them down. A new song, all about them. What they really are.  
**Mira**: We call them out. In front of everyone. Every fan who loves those boys hears exactly what they are.  
_Zoey plays it on the keyboard: a hard, bright, stabbing tune, all corners. It is very catchy, and quite cruel._  
_Rumi listens with her arms folded and her sleeves down. She doesn’t say anything for a long time._  
**Mira**: Runner, tea. This is going to be a long one.  

**Choices**

- **Make barley tea.**
    - You make boricha: roasted barley, toasty and mild. The studio starts to smell like a bakery, which helps a bit.
- **Make it very strong.**
    - You make it very strong. Mira looks at the colour of it and nods, as one serious person to another.

#### <a id="a29-09-studio-done"></a>Done `a29-09-studio-done`

_By the time the kettle clicks off, the music has stopped and the voices have started._  

### Step 2: Give out the tea. Take nobody’s side out loud.

Hint: Put a cup by each of them. You don’t have to say anything. · check: `give:a29-tea:three`

#### <a id="a29-09-argument"></a>Scene `a29-09-argument`

**Rumi**: It’s mean. It’s really mean. It’s not who we are.  
**Zoey** _(angry)_: They’re demons, Rumi! They’re eating our fans! Who cares if it’s mean?  
**Rumi**: I care. Not everything that’s not human is the same. Not everyone who’s wrong is wrong all the way through.  
**Mira** _(angry)_: Listen to yourself. You sound like you’re on their side.  
_That lands. Rumi pulls her sleeves down over her hands, and her voice, when it comes, cracks right in the middle._  
**Rumi** _(sad)_: I’m on our side. I’m always on our side.  
_Nobody says anything, and the keyboard hums. You are standing in the middle of the room holding three cups of tea._  

**Choices**

- **Give Rumi hers first.**
    - You give Rumi her cup first, and Mira’s mouth goes thin. Then you give Mira hers, and Zoey hers, and say nothing.
- **Put the cups down all at once, in a row.**
    - You put all three down at once, in a row on the keyboard lid. Zoey snorts, despite herself: it’s very diplomatic.
- **Give Zoey hers first; she’s the youngest.**
    - You give Zoey hers first. She holds it in both hands and looks at the floor, suddenly young, and the room loosens a little.

### Complete

#### <a id="a29-09-complete"></a>Complete `a29-09-complete`

_They drink the tea. They don’t make up, and they don’t fight any more either._  
**Zoey** _(sad)_: We’re doing the song. At the Idol Awards. It’s a vote, Rumi, and it’s two against one.  
**Rumi**: Then it’s two against one.  
_Rumi takes her cup to the sink, and washes it, and dries it, and puts it away, and leaves._  
**Mira** _(soft)_: Thanks for the tea, runner. Sorry you had to hear that.  

**Rewards**


Sets on completion: `{"a29-09":true}`

**Notes:** THE HARSH SONG has no name, no title card and no words. Zoey plays its tune on a keyboard: original music, hard and catchy. NEVER the film’s song or its title. The tea is boricha (roasted barley tea); adviser. The choice changes only the next line; the Keeper takes no side out loud.

## A29-10. The Deal

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): Rumi’s bargain with Jinu* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-9, from Nova’s atlas. · requires: A29-9

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Jinu (Jinu, leader of the Saja Boys, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Gwi-Ma (Gwi-Ma, the demon king, a voice in the fire, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Hold the umbrella while Rumi waits on the wall.

Hint: It’s raining. Go up the wall steps with the umbrella. · check: `carry:a29-umbrella:city-wall`

#### <a id="a29-10-rain"></a>Scene `a29-10-rain`

_It is raining over the city, a warm summer rain that makes the lamps along the old wall look like they’re melting._  
**Rumi**: Come with me. If I go alone I’ll talk myself out of it.  
_You hold the umbrella. Your Nubbin sits on your shoulder, in its noodle hat, which the rain drums on like a little roof._  
_Jinu is on the wall already. Derpy is sitting beside him getting soaked, and doesn’t seem to mind._  
**Rumi**: I came to offer you something. A bargain.  
**Jinu**: Hunters don’t bargain with demons.  
**Rumi**: This one does.  

**Choices**

- **Hold the umbrella over Rumi.**
    - You hold it over Rumi, and get wet down one side. She notices, and steps closer so it covers both of you.
- **Hold it over Derpy.**
    - You hold it over the tiger. He looks up at it, astonished, as if nobody has ever done this, and purrs like a kettle on the boil.

### Step 2: Hear the bargain.

Hint: Stay by them under the lamp. · check: `watch:a29-deal:wall`

#### <a id="a29-10-deal"></a>Scene `a29-10-deal`

**Rumi**: The Idol Awards. Help us win. Stop your band, and let us sing, and the Honmoon turns to gold and seals for good.  
**Rumi**: And when it does, you don’t go back down with the others. You stay here. In the world. I’ll make sure.  
**Jinu**: Why would you do that for me?  
**Rumi** _(soft)_: Because you hid my marks. You didn’t have to.  
_She says it plainly, and her voice doesn’t crack at all. You hear it, and so does she: clear, the way it was on the first night._  
_Jinu hears it too. He looks at her for a long time, and the rain runs off his hair._  
**Jinu**: All right. A deal.  

**Choices**

- **Watch them shake on it.**
    - They shake hands, carefully, a hunter and a demon. Derpy puts his big wet paw on top of both their hands.
- **Notice her voice.**
    - Her voice is whole, and you want to say so, and don’t. Some things are better noticed than announced.

### Step 3: Look at what is wrong with Jinu.

Hint: After Rumi goes, go back up to the lamp. · check: `inspect:a29-jinu:lamp`

#### <a id="a29-10-call"></a>Scene `a29-10-call`

_Rumi goes down the steps, lighter than she came up. You go back for the umbrella you left leaning on the wall._  
_Jinu is still there. He has a hand pressed flat on the stones, and he is shaking._  
_Under the lamp his shadow is the wrong size. It stretches all the way down the hill, and at the end of it there is a red glow._  
**Gwi-Ma**: A deal with a hunter. How sweet.  
**Gwi-Ma**: Shall I tell her about your mother? Your little sister? How they waited for you, and you didn’t come?  
**Jinu** _(sad)_: Don’t.  
**Gwi-Ma**: Then remember who you belong to, little musician. Bring her to me, and you’ll never hear their voices again.  
_The shadow snaps back to its right size. Jinu sees you, and the umbrella, and puts a finger to his lips._  

### Complete

#### <a id="a29-10-complete"></a>Complete `a29-10-complete`

**Jinu**: You didn’t hear that.  
_You don’t say anything. You hand him the umbrella, because he hasn’t got one._  
_He holds it like nobody has handed him anything in four hundred years. Then he and Derpy walk off into the rain._  
_Your Nubbin watches them go, and pulls its hat down, and sneezes._  

**Rewards**


Sets on completion: `{"a29-10":true}`

**Notes:** Gwi-Ma is a voice in the shadow and a red glow at the end of it. Keep it slow and quiet, not loud or jumpy. The Keeper overhears but has no way to tell Rumi without breaking Jinu’s story; the script never forces the Keeper to keep or tell it, and there is no choice that matters here by design. The deal’s seal is called “gold”; never use the film’s word for it (see header).

## A29-11. The Idol Awards

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the awards night* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-10, from Nova’s atlas. · requires: A29-10

**Cast:** Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Get the costumes to the dressing room in the backstage chaos.

Hint: Carry the garment bags through the crowded corridors. · check: `carry:a29-costumes:backstage`

#### <a id="a29-11-backstage"></a>Scene `a29-11-backstage`

_Backstage at the Idol Awards is ten times the arena: every band in Korea, every stylist, every runner, in one corridor._  
**Bobby**: Costumes! Dressing room four! If you see a Saja Boy, don’t look at him, don’t speak to him, don’t give him our snacks!  
_You carry three garment bags over your head through the crush. Your Nubbin rides on top of the bags like a lookout._  
_A boy band in silver suits squeezes past, all apologising at once. Somebody’s hairspray goes off like a fog machine._  
_Halfway down the corridor, two stagehands in caps stop Mira and Zoey and say something about a problem with the lights._  
_Mira and Zoey follow them round a corner. Your Nubbin turns right round on the bags to watch them go, and its crown goes stiff._  

**Choices**

- **Try to follow them.**
    - You try. A man with a rack of sequinned jackets cuts across you, and by the time he’s past, the corner is empty.
- **Tell Bobby.**
    - **Bobby**: Lights? Fine! Lights are important! Costumes are also important! Go!
    - He isn’t listening. Nobody is listening tonight.

#### <a id="a29-11-backstage-done"></a>Done `a29-11-backstage-done`

_Two minutes later, Mira and Zoey come back down the corridor, smiling. They walk past you without a word, and their eyes are too bright._  

### Step 2: Watch Huntrix’s set on the backstage monitor.

Hint: The monitor by the stage door shows the live feed. · check: `watch:a29-monitor:stage-door`

#### <a id="a29-11-monitor"></a>Scene `a29-11-monitor`

_On the monitor, Huntrix walk out to a roar, Rumi in the middle. Mira and Zoey are on either side of her, and they don’t look at her._  
_The opening chords are wrong: it isn’t the song they rehearsed. It’s the harsh one, the cruel one, all corners._  
_Rumi falters, and looks left and right. The two girls beside her are singing it at her, not with her._  
_Then one of them grabs Rumi’s arm, and with one long tear of fabric, rips her sleeve away from wrist to shoulder._  
_The cameras swing in. The marks are on every screen in the hall, on every phone in the city, violet and silver and huge._  
_The crowd goes very quiet. Then it starts to mutter, and the mutter has a hard edge._  
_On the monitor, “Mira” turns to the camera and smiles, with too many teeth. It isn’t Mira, and it never was._  

#### <a id="a29-11-monitor-done"></a>Done `a29-11-monitor-done`

_Above the hall, the Honmoon tears like wet paper. The lights all over the city flicker at once._  

### Step 3: Find the real Mira and Zoey.

Hint: Try the doors along the service corridor, where the stagehands took them. · check: `find:a29-girls:store-room`

#### <a id="a29-11-store"></a>Scene `a29-11-store`

_You run. Back down the corridor, round the corner, into a service passage that smells of paint and old sandwiches._  
_Door after door: mops, cables, chairs. Your Nubbin jumps off the bags and runs ahead, sniffing at the gaps under the doors._  
_At the last door it stops, and puts both paws on it, and looks back at you._  
_Inside, in the dark among the folded tables, Mira and Zoey are tied back to back with gaffer tape, furious and trying to shout._  
**Mira** _(angry)_: Get this off. Get it off, get it off. Who’s on stage? Who is on stage?  
**Zoey** _(shock)_: They had our faces. They had our faces, runner!  

**Choices**

- **Tear the tape off.**
    - You tear the tape off, and a lot of hair with it. Nobody complains.
- **Let your Nubbin nibble through it.**
    - Your Nubbin chews through the tape with great determination and a terrible face. It takes a while, but it works.

#### <a id="a29-11-store-hid"></a>Variant `a29-11-store-hid`

_Variant of `a29-11-store`._

_Under the folded tables, at the back of the store room, something grey moves. Sable has been in here all along, hiding from the noise._  
_She watches the tape come off Mira’s wrists. When you go, she comes after you, one shadow at a time._  

### Complete

#### <a id="a29-11-complete"></a>Complete `a29-11-complete`

_The three of you run back to the stage door in time to see the end on the monitor._  
_The two fakes melt into smoke on stage. Rumi is standing alone in the middle, holding her bare arm, with ten thousand people staring at it._  
_Mira and Zoey stand very still in front of the monitor. They’re looking at the marks too._  
**Mira** _(sad)_: How long?  
_Nobody answers. The screen goes to an advert for fizzy drinks._  

**Rewards**


Sets on completion: `{"a29-11":true}`

**Notes:** The impostors’ faces slip only for a moment (too many teeth); keep it a reveal, not a scare. The harsh song is heard only as the hard original tune from A29-9, with no words or title. The sleeve tear is fabric only; Rumi is not hurt. SABLE: if a29-sable = hid, play ATLAS_A29_VARIANTS a29-11-store-hid straight after a29-11-store (she is already in the store room, under the tables).

## A29-12. Seen

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): after the awards* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-11, from Nova’s atlas. · requires: A29-11

**Cast:** Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Jinu (Jinu, leader of the Saja Boys, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Gwi-Ma (Gwi-Ma, the demon king, a voice in the fire, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Stay with Mira and Zoey when they come off.

Hint: Go to the loading bay behind the stage. · check: `walk:a29-loading-bay:stage`

#### <a id="a29-12-after"></a>Scene `a29-12-after`

_Rumi comes off stage with a stagehand’s jacket round her shoulders. Mira and Zoey are waiting in the loading bay._  
**Mira** _(angry)_: You lied to us. For years. Every day. Every noodle.  
**Rumi**: I didn’t lie. I just didn’t say.  
**Zoey** _(sad)_: That’s the same, Rumi. That’s exactly the same.  
**Rumi**: Celine said nobody would understand.  
**Mira**: You didn’t give us the chance to understand. That’s the bit I can’t get past.  
_Mira turns and walks out of the bay. After a moment, Zoey follows her, and doesn’t look back, and then does._  

**Choices**

- **Stay where you are.**
    - You stay, because somebody should. You don’t know yet that you’re the somebody.
- **Catch Zoey’s eye.**
    - Zoey catches your eye at the door, and hers are wet. She shakes her head, not at you, at everything, and goes.

#### <a id="a29-12-after-done"></a>Done `a29-12-after-done`

_Rumi walks off too, the other way, down the ramp into the car park, and you lose her in the crowd of cars._  

### Step 2: Wait in the car park with the gear case.

Hint: Sit on the gear case by the van. · check: `wait:a29-car-park:gear-case`

#### <a id="a29-12-find"></a>Scene `a29-12-find`

_The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange._  
_You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet._  
_Rumi comes down the ramp. She has the jacket over her arm, the one you handed her in the dressing room._  
**Rumi**: Here. You should have it back.  
**Rumi** _(soft)_: You helped me hide. I asked you to. That’s on me.  
_She holds it out until you take it. Then she sits down beside you on the case, with her bare arm out in the air._  
**Rumi**: I’ve been hiding them so long I don’t know what my arm feels like in the wind.  
_You fold the jacket on your knee, and leave it there._  

#### <a id="a29-12-find-saw"></a>Variant `a29-12-find-saw`

_Variant of `a29-12-find`._

_The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange._  
_You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet._  
_Rumi comes down the ramp fast, looking along the rows of cars. When she sees you, she stops looking._  
_She sits down on the case beside you. She came to you first, before Mira, before Zoey, before Celine._  
**Rumi**: You saw. In the dressing room. And you said it was all right.  
**Rumi**: Was it true? Or were you only being nice?  
**You**: It was true. It still is.  
_She lets her breath go, all of it, like someone putting down a heavy bag._  
**Rumi**: Everyone saw tonight. You saw first. That helps. I don’t know why, but it helps.  

#### <a id="a29-12-find-away"></a>Variant `a29-12-find-away`

_Variant of `a29-12-find`._

_The car park under the awards hall smells of exhaust and spilt fizzy drink. The noise upstairs has gone thin and strange._  
_You are sitting on the gear case, because nobody told you where else to sit. Your Nubbin is in the merchandise bag, very quiet._  
_Rumi comes down the ramp and stops in front of you. Her arm is bare, and she doesn’t cover it._  
**Rumi**: In the dressing room. That night. You looked away. Did you see?  

**Choices**

- **“Yes. I saw.”**
    - **You**: Yes. I saw.
    - **Rumi**: And you let me think you hadn’t.
    - She doesn’t sound angry. She sounds as if she is working something out.
    - **Rumi**: That was kind. I think. I don’t know any more which kind of kind I need.
- **Say nothing.**
    - You don’t say anything. You don’t look away this time, either.
    - **Rumi**: Right. Yes. You did.
    - She sits down on the end of the case, not quite next to you, and looks at her own arm.

#### <a id="a29-12-find-done"></a>Done `a29-12-find-done`

**Rumi**: I have to go and see someone. Then I have to see what’s left.  
_She goes up the ramp towards the roof._  

### Step 3: Follow Rumi to the roof.

Hint: Take the fire stairs to the roof of the hall. · check: `climb:a29-hall:roof`

#### <a id="a29-12-roof"></a>Scene `a29-12-roof`

_Jinu is on the roof, by the big lit letters of the hall’s sign. Rumi walks straight up to him._  
**Rumi**: You knew. You knew they’d take Mira and Zoey. Did you?  
**Jinu**: I didn’t stop it.  
**Rumi**: Tell me the truth. Your family. All of it.  
**Jinu** _(sad)_: I didn’t go to feed them. I went because I wanted the voice. I wanted to be loved by everyone, more than I wanted to be theirs.  
**Jinu**: I left my mother and my little sister in a house with no rice, and I never once went back.  
_Rumi steps back from him. She looks as if he’s slapped her, and as if she’s sorry for him, both._  

**Choices**

- **Stay by the door.**
    - You stay by the door. This isn’t yours to stand in the middle of.
- **Let your Nubbin go to Derpy.**
    - Derpy is curled by the sign, ears flat. Your Nubbin goes and sits between his paws, and the tiger lowers his chin over it.

#### <a id="a29-12-roof-done"></a>Done `a29-12-roof-done`

_Jinu doesn’t try to say anything else. Below you, from the middle of the city, a red light is welling up through the streets._  

### Complete

#### <a id="a29-12-complete"></a>Complete `a29-12-complete`

_Through the torn Honmoon, something huge is rising out of the ground: a great shadow, with fire at its heart._  
**Gwi-Ma**: Thank you, little hunter. You opened the door yourself.  
_The traffic stops, and the music in the shops. All over the city, people put down what they are holding and turn the same way._  
_They start to walk, quietly, with blank faces, towards the stadium on the river._  
_Rumi watches them go. Then she turns her back on Jinu and goes down the stairs, alone._  

**Rewards**


Sets on completion: `{"a29-12":true}`

**Notes:** SLEEVE PAYOFF 1 (a29-sleeve). Step 2: the scene shown, a29-12-find, is for jacket (she gives the jacket back: “You helped me hide. I asked you to. That’s on me.”). For saw play ATLAS_A29_VARIANTS a29-12-find-saw (she finds you before she finds anyone else); for away play a29-12-find-away (she asks you outright whether you knew, and you can say yes). The entranced city is quiet and slow, not frightening: people walk, nobody falls, and they all wake in A29-14.

## A29-13. Celine Again

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): Rumi and Celine* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-12, from Nova’s atlas. · requires: A29-12

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Celine (Celine, the former hunter who raised Rumi, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Go with Rumi to Celine’s house.

Hint: Through the old lanes again. The streets are empty now. · check: `escort:a29-rumi:celine-courtyard`

#### <a id="a29-13-courtyard"></a>Scene `a29-13-courtyard`

_The city is empty and humming with that red light. Rumi walks through the old lanes with her arm bare, and you walk behind._  
_Celine is in the courtyard, wide awake, as if she has been waiting since the broadcast._  
**Celine**: Come inside. Quickly. We’ll put this right. We’ll cover them, and you’ll sing, and we’ll mend the Honmoon, the way it was.  
**Rumi**: The way it was is how we got here.  
**Celine**: Rumi. Inside.  
**Rumi** _(sad)_: You taught me to hide them. You loved me, I know you did. But only the half of me you could look at.  
**Rumi**: You never loved me all the way. Not once.  
_Celine opens her mouth, and nothing comes out. Rumi turns and goes out of the gate, and doesn’t run, and doesn’t look back._  

#### <a id="a29-13-courtyard-done"></a>Done `a29-13-courtyard-done`

_The gate swings shut, and Celine stays standing in the middle of the courtyard. You are still on the stone step by the gate, where you sat last time._  

### Step 2: Sit down next to Celine, and wait.

Hint: Sit on the edge of the wooden floor beside her. Don’t say anything. · check: `sit:a29-celine:maru`

#### <a id="a29-13-sit"></a>Scene `a29-13-sit`

_Celine sits down on the edge of the wooden floor that runs along the house, very straight, with her hands on her knees._  
_She doesn’t look at you. She doesn’t tell you to go._  
_You go and sit down next to her: not close, but close enough._  
_Your Nubbin climbs out of the bag, takes off its noodle hat, and puts it down neatly on the boards between you._  
_The red light glows over the roofs, and a long way off a crowd is walking very quietly. Neither of you says anything._  
_It goes on for a long time. Long enough for the courtyard stones to cool, and for a cat to cross the wall and change its mind._  

**Choices**

- **Wait.**
    - You wait, that’s all. It is harder than fighting demons, and you don’t think anyone will ever thank you for it.
- **Wait a bit longer.**
    - You wait a bit longer. Celine’s hands, on her knees, slowly stop being fists.

#### <a id="a29-13-sit-done"></a>Done `a29-13-sit-done`

_At last Celine gets up, without a word, and goes inside. You hear a kettle._  

### Complete

#### <a id="a29-13-complete"></a>Complete `a29-13-complete`

_She comes back with a tray. Two cups of barley tea, and a small saucer of water for your Nubbin._  
_She pours, and doesn’t thank you, and doesn’t say anything about Rumi. She pours you a second cup when the first one’s gone._  
**Celine** _(sad)_: She was such a small girl. With her sleeves always down. I thought I was keeping her safe.  
_That is all she says. You drink the tea, and it’s good tea._  
_When you go, she puts your Nubbin’s noodle hat carefully back in your hand. Then she sits on the step again, looking at the gate._  

**Rewards**


Sets on completion: `{"a29-13":true}`

**Notes:** Hazel’s third rule, acted (sit down next to them and wait), never quoted. Celine is grieving, not punished; the scene gives her tea and company, not a lesson. The wooden floor is the hanok’s maru; adviser to check how she sits. Rumi’s line “You never loved me all the way” is original, after the outline.

## A29-14. The Stadium

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): the stadium* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-13, from Nova’s atlas. · requires: A29-13

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Get into the stadium with the gear case.

Hint: Walk with the crowd. Keep your head down and the case close. · check: `walk:a29-crowd:stadium`

#### <a id="a29-14-crowd"></a>Scene `a29-14-crowd`

_The stadium on the river is full. Tens of thousands of people, standing still, faces lifted, eyes blank._  
_A faint shimmer rises off all of them, like steam off a lake in the morning, and drifts towards the stage._  
_On the stage the Saja Boys are singing, and behind them the great shadow with fire at its heart is drinking it all in._  
_You push through the crowd with the gear case, and nobody stops you or sees you. Bobby is in the third row, smiling at nothing._  
_Two rows behind him is Zoey, and in the aisle is Mira. Both of them blank, both of them shimmering._  
_You keep walking. Your Nubbin holds onto your collar with both paws._  

**Choices**

- **Stop by Bobby.**
    - You touch Bobby’s arm, and he doesn’t notice. You straighten his tie, because he would want it straight, and go on.
- **Keep going.**
    - You keep going. The quickest way to help is to get the case where it’s needed.

#### <a id="a29-14-crowd-heel"></a>Variant `a29-14-crowd-heel`

_Variant of `a29-14-crowd`._

_Sable is at your heel the whole way through the crowd. All those blank faces, all that noise, and she doesn’t go under anything._  
_Her ears are up. She walks right beside you, close enough to touch, and keeps walking._  

#### <a id="a29-14-crowd-done"></a>Done `a29-14-crowd-done`

_Then, at the back of the stadium, the big doors open, and someone walks in alone._  

### Step 2: Watch Rumi.

Hint: Stand at the side of the stage with the case open. · check: `watch:a29-rumi:stage`

#### <a id="a29-14-song"></a>Scene `a29-14-song`

_It’s Rumi, with no sleeves at all. Her arms are bare, and her neck, and the marks run all over both, violet and silver._  
_She walks down the middle aisle through the blank crowd, and up onto the stage, past the Saja Boys, to the front._  
_She doesn’t sing the old songs, or the harsh one. She opens her mouth and sings something you have never heard._  
_It has no words you can catch, and it is her own. It is like hearing someone tell the truth about herself, and not dying of it._  
_Under the music the marks glow brighter, not dimmer, and she doesn’t hide them. She holds her arms out so everyone can see._  
_The shimmer stops drifting towards the stage. Here and there in the crowd, someone blinks._  

#### <a id="a29-14-song-done"></a>Done `a29-14-song-done`

_You are standing at the side of the stage holding Rumi’s long coat. She took it off on her way in, and put it in your hands, and kept walking._  
_You hold it, and don’t put it on her, and don’t put it away._  
_Mira, halfway down the aisle, blinks, and so does Zoey, two rows behind. They look at each other._  
_Then they are running for the stage, and you are running after them with the gear case banging your knees._  

#### <a id="a29-14-song-done-saw"></a>Variant `a29-14-song-done-saw`

_Variant of `a29-14-song-done`._

_Halfway through, with the marks blazing on her arms, Rumi looks round the stadium once, and finds you at the side of the stage._  
_Only for a moment. Then she looks back out at the crowd, and sings louder._  
_Mira, halfway down the aisle, blinks, and so does Zoey, two rows behind. They look at each other._  
_Then they are running for the stage, and you are running after them with the gear case banging your knees._  

#### <a id="a29-14-song-done-away"></a>Variant `a29-14-song-done-away`

_Variant of `a29-14-song-done`._

_Rumi doesn’t look for anyone, not Mira, not Zoey, not you. She sings straight out, at all of them._  
_She doesn’t need to look for anyone. That is the whole point._  
_Mira, halfway down the aisle, blinks, and so does Zoey, two rows behind. They look at each other._  
_Then they are running for the stage, and you are running after them with the gear case banging your knees._  

### Complete

#### <a id="a29-14-complete"></a>Complete `a29-14-complete`

_Mira and Zoey come up the stage steps two at a time. You throw Mira her blade and Zoey her belt of knives._  
**Mira**: Rumi. We were wrong. We’ll say sorry properly later. Right now, move up.  
**Zoey** _(happy)_: Room for two more?  
_Rumi looks at them, and makes room, and the three of them stand together at the front of the stage._  
_All over the stadium people are waking up, confused, holding their phones. Bobby, in the third row, says “what” very loudly._  

**Rewards**


Sets on completion: `{"a29-14":true}`

**Notes:** RUMI’S SONG is heard as original music under her face, with no words, no subtitles and no title (Part M). SLEEVE PAYOFF 2 (a29-sleeve). Step 2 done: the scene shown, a29-14-song-done, is for jacket (she hands you her coat on her way in). For saw play ATLAS_A29_VARIANTS a29-14-song-done-saw (she looks at you once from the stage); for away, a29-14-song-done-away (she doesn’t look for anyone). SABLE: if a29-sable = heel, play a29-14-crowd-heel straight after a29-14-crowd (she stays by you in the crowd, ears up, and doesn’t go under anything). The waking crowd is gentle: blinks, confusion, phones.

## A29-15. Jinu

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): Jinu’s choice* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-14, from Nova’s atlas. · requires: A29-14

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Jinu (Jinu, leader of the Saja Boys, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Gwi-Ma (Gwi-Ma, the demon king, a voice in the fire, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue)

### Step 1: Hold on at the side of the stage.

Hint: Keep hold of the stage rail. Keep your Nubbin close. · check: `watch:a29-gwima:stage`

#### <a id="a29-15-strike"></a>Scene `a29-15-strike`

_The great shadow behind the stage turns. The fire at its heart is the size of a house, and it is looking at Rumi._  
**Gwi-Ma**: Half of mine. Half of theirs. You should have been all of mine.  
_It reaches for her: a long arm of shadow and heat, slow, enormous, coming down over the stage like a falling wall._  
_Rumi doesn’t run, and Mira and Zoey don’t run. They stand together and keep singing, with their weapons up._  
_And Jinu steps out from the other boys, and walks across the stage, and stands in front of Rumi with his arms out._  
_The shadow hits him instead of her._  

**Choices**

- **Hold your Nubbin tight.**
    - You hold your Nubbin tight. It holds you tight back, its face pressed into your coat.
- **Don’t look away.**
    - You don’t look away; someone should see this, all of it. You think he would want somebody to.

### Step 2: See it through.

Hint: Stay by the rail until the light settles. · check: `watch:a29-honmoon:sky`

#### <a id="a29-15-light"></a>Scene `a29-15-light`

_Jinu is standing in the shadow’s grip, and he is full of light. It is coming out of him, the way the shimmer came out of the crowd._  
**Jinu**: I left them. I’ve been leaving them for four hundred years. Not this time.  
_He turns to Rumi. In his hands the light gathers into one bright whole thing, like a lantern with nothing round it._  
**Jinu** _(soft)_: Here. It was mine before he had it. It’s whole again. Take it.  
_He puts it into her hands. Then he is gone: not falling, not hurt, only light, all at once, like a window opening._  
_Rumi stands holding the light. Then she lifts her head and sings, and Mira and Zoey sing with her, and you have never heard three voices fit so well._  
_The shadow with the fire at its heart comes apart like smoke in a wind, and is gone, and the stage is only a stage._  
_Above the stadium the torn Honmoon closes over. It isn’t gold: it is every colour there is, like a ribbon held up to the sun._  

#### <a id="a29-15-light-done"></a>Done `a29-15-light-done`

_The crowd is awake, all of it. Somebody starts clapping, not knowing why, and then everybody does._  

### Complete

#### <a id="a29-15-complete"></a>Complete `a29-15-complete`

_At the edge of the stage, where Jinu stood, there is a little drift of light, like glitter after a party._  
_Derpy comes up the stage steps on his big soft paws and lies down on it, and puts his chin on his paws, and doesn’t purr._  
_Sussie lands on his head. Your Nubbin goes and sits between the tiger’s paws and leans on him._  
**Zoey**: It’s not gold.  
**Rumi** _(soft)_: No. It’s better.  
_A thread of that many-coloured light drifts down from the sky, and catches round your wrist, and stays._  

**Rewards**


Sets on completion: `{"a29-15":true}`

**Notes:** CARE: Jinu’s end is light, not death imagery: no body, no wound, no falling. He becomes light “like a window opening”. Gwi-Ma comes apart like smoke. The three voices are original wordless music. The new Honmoon is every colour (never call it by the film’s word for gold). The thread round your wrist is the ribbon reward, granted in A29-16.

## A29-16. In Public

*KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025): days later* · audience: all · where: Nova’s atlas: the Honmoon page (Atlas campaign) · when: Any time after A29-15, from Nova’s atlas. · requires: A29-15

**Cast:** Rumi (Rumi, Huntrix's leader, half-demon, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Mira (Mira, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Zoey (Zoey, of Huntrix, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), Bobby (Bobby, Huntrix's manager, in KPop Demon Hunters (Sony Pictures Animation and Netflix, 2025); original design and dialogue), A girl in a Huntrix T-shirt (An original fan; no source character)

### Step 1: Help Bobby with the street meet-up.

Hint: Hand out the water and keep the queue moving. · check: `walk:a29-street:daylight`

#### <a id="a29-16-street"></a>Scene `a29-16-street`

_Days later, in daylight, Huntrix meet their fans in the street: no stage, no tickets, a folding table and a queue round the block._  
**Bobby**: Water for the queue. Keep it moving. Smile. Not like that. Like a person.  
_Rumi is in short sleeves. The marks are on both arms, violet and silver, in the plain sun._  
**A girl in a Huntrix T-shirt**: Can I… is it all right if I look at your arm? It’s so pretty. Is that rude?  
**Rumi** _(happy)_: It’s not rude. Look as long as you like.  
_Mira signs a cast, and Zoey signs a forehead, with permission. A grandmother gives Rumi a bag of oranges and pats her bare arm._  

**Choices**

- **Hand out the water.**
    - You hand out water down the whole queue. Your Nubbin hands out light sticks, one at a time, with great ceremony.
- **Look at the wall behind the table.**
    - On the low wall behind the table, in the sun, a blue tiger and a magpie are sitting very still, as if they were painted there.

#### <a id="a29-16-street-hid"></a>Variant `a29-16-street-hid`

_Variant of `a29-16-street`._

_Sable has found the shade at the foot of the wall, under Sussie. The magpie looks down at her, and hops down, and sits beside her._  
_The two of them watch the queue together from the shade, one grey, one black and white, very still._  

#### <a id="a29-16-street-heel"></a>Variant `a29-16-street-heel`

_Variant of `a29-16-street`._

_Sable walks out into the middle of the pavement, in the full sun, and lies down there, grey and in plain view._  
_The fans in the queue step round her, carefully, the way you step round a cat in a doorway. She stays exactly where she is._  

#### <a id="a29-16-street-done"></a>Done `a29-16-street-done`

_Derpy and Sussie are on the wall behind the table. Nobody but you seems to think a blue tiger is odd._  

### Step 2: Take a rest on the wall with Derpy.

Hint: Sit on the wall in the sun when the queue thins. · check: `sit:a29-wall:derpy`

#### <a id="a29-16-wall"></a>Scene `a29-16-wall`

_When the queue thins, you sit on the wall beside Derpy, with your back to the warm stone._  
_The tiger rolls half over and holds out his big paws, the way you hold out your arms for a child._  
_Your Nubbin climbs into them, turns round three times, and goes to sleep in the tiger’s paws, noodle hat over its eyes._  
_Derpy purrs like a kettle. Sussie stands on his shoulder and keeps watch over both of them._  
_Down the street, over the rooftops, faint in the daylight, the Honmoon shimmers every colour. It looks like it might hold a long time._  
_Rumi looks over from the table, and sees the three of them, and laughs._  

**Choices**

- **Let them sleep.**
    - You let them sleep. Nobody needs you to do anything for a while, which is the best feeling in the world.
- **Take a photo.**
    - You take a photo: a tiger, a magpie, a Nubbin, a noodle hat. It is the best photo anyone has ever taken.

### Complete

#### <a id="a29-16-complete"></a>Complete `a29-16-complete`

_The fans thin out at last. Bobby counts phones, counts girls, and counts you, and seems happy with all the numbers._  
**Bobby** _(happy)_: Runner. Good work. Strange work, but good. If you ever want a job that’s only a job, call me.  
_Rumi comes over to the wall. She stops in front of you in the sun, and pushes her short sleeve up to the shoulder._  
_She holds her arm out, the marks bright in the daylight, and turns it this way and that, as if she is seeing it for the first time._  
**Rumi**: You gave me a jacket once. I don’t need it now. But thanks for knowing when I did.  
_Sussie drops a folded leaf into your hand from the wall, and then hops onto your shoulder and stays there._  
_Zoey hands you a flat parcel tied with string. Inside is a small folding screen, from Celine: a silly tiger and a bright magpie._  
_The street goes flat, and bright, and smells of paint. You are in the Grove, with a magpie on your shoulder and a thread of light round your wrist._  

#### <a id="a29-16-complete-saw"></a>Variant `a29-16-complete-saw`

_Variant of `a29-16-complete`._

_The fans thin out at last. Bobby counts phones, counts girls, and counts you, and seems happy with all the numbers._  
**Bobby** _(happy)_: Runner. Good work. Strange work, but good. If you ever want a job that’s only a job, call me.  
**Zoey** _(happy)_: Group photo! Huntrix and staff! Bobby, hold the phone up higher. Higher. Like a tall person.  
_You go to step out of the way. Rumi catches you by the sleeve and pulls you into the middle, between her and Mira._  
**Rumi** _(happy)_: You were the first one to say it was all right. You’re in the photo.  
_In the photo, her arm is round your shoulders, marks and all. Your Nubbin is a blur in the front, waving._  
_Sussie drops a folded leaf into your hand from the wall, and then hops onto your shoulder and stays there._  
_Zoey hands you a flat parcel tied with string. Inside is a small folding screen, from Celine: a silly tiger and a bright magpie._  
_The street goes flat, and bright, and smells of paint. You are in the Grove, with a magpie on your shoulder and a thread of light round your wrist._  

#### <a id="a29-16-complete-away"></a>Variant `a29-16-complete-away`

_Variant of `a29-16-complete`._

_The fans thin out at last. Bobby counts phones, counts girls, and counts you, and seems happy with all the numbers._  
**Bobby** _(happy)_: Runner. Good work. Strange work, but good. If you ever want a job that’s only a job, call me.  
_You pick up the empty boxes and go across the street to the van. When you turn round, Rumi is looking for you over the crowd._  
_She lifts her bare arm and waves, once, a big wave, from right across the street._  
_You wave back, and neither of you comes any closer. That’s enough._  
_Sussie drops a folded leaf into your hand from the wall, and then hops onto your shoulder and stays there._  
_Zoey hands you a flat parcel tied with string. Inside is a small folding screen, from Celine: a silly tiger and a bright magpie._  
_The street goes flat, and bright, and smells of paint. You are in the Grove, with a magpie on your shoulder and a thread of light round your wrist._  

**Rewards**

- Honmoon ribbon (decor): A thread of soft, many-coloured light along the Grove fence after dark. Tap the fence post to switch it on or off.
- Tiger-and-magpie screen (decor): A small folding screen in the Korean folk-painting style: a silly tiger and a bright magpie. It goes in the cottage.
- Magpie petpet (cosmetic): A little magpie who rides on your Nubbin. When you come back after time away, she brings you a “letter”: a leaf.

Sets on completion: `{"a29-16":true,"a29-done":true}`

**Notes:** SLEEVE PAYOFF 3 (a29-sleeve). Complete: the scene shown, a29-16-complete, is for jacket (she shows you the marks in the sun, as if for the first time). For saw play ATLAS_A29_VARIANTS a29-16-complete-saw (she pulls you into the group photo); for away, a29-16-complete-away (she waves from across the street, and that’s enough). SABLE: a29-sable = hid → play a29-16-street-hid straight after a29-16-street-done (the wall’s shade, with Sussie); heel → a29-16-street-heel (in the sun, mid-pavement, the fans step round her). After the page, if a29-sable is set, play a29-grove-luna-heel or a29-grove-luna-hid the next time you talk to Luna in the Grove. REWARDS (all one-time): the ribbon (Tier 2: a toggleable light along the Grove fence after dark), the minhwa screen (Tier 2: cottage decor; MUST be painted by a Korean artist in the minhwa style), the magpie petpet (it leaves a leaf letter on return after an absence; a welcome, not a timer, and it gives nothing to collect). SIM: the petpet’s leaf appears when the Grove loads after offline catch-up of any length; it is decorative.

## Variant scenes

Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).

#### <a id="a29-grove-luna-heel"></a>Variant `a29-grove-luna-heel`

_Luna looks at Sable, who is lying in the middle of the path in the sun, and then at you._  
**Luna**: She went somewhere loud and bright, and didn’t hide? Well. Don’t make a fuss of it. She’ll know.  

#### <a id="a29-grove-luna-hid"></a>Variant `a29-grove-luna-hid`

_Luna looks at Sable, who is under the bench, and then at you._  
**Luna**: She went somewhere loud and bright, and came home. Hiding still counts as going. Don’t make a fuss of it.  
