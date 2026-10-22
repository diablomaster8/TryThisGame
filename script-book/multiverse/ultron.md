# Multiverse: Ultron (UL1–UL10)

## UL1. The Crimson Cowl

*Avengers #54–55* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Multiverse campaign started; first storyline of the Ultron line.

**Cast:** Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), Clint Barton (Clint Barton, Hawkeye (Marvel Comics)), T’Challa (T’Challa, Black Panther (Marvel Comics)), Edwin Jarvis (Edwin Jarvis, the Avengers’ butler (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Find out who has been passing the Avengers’ secrets to the Crimson Cowl.

Hint: Talk to everyone in the mansion. Watch which of them your Nubbins will not go near. · check: `talk:mv-jarvis`

#### <a id="mv-ul01-mansion"></a>Scene `mv-ul01-mansion`

_The rift opens onto a mansion on Fifth Avenue. Someone has been leaving the security plans where they shouldn’t._  
**Janet van Dyne** _(angry)_: A new gang calling themselves the Masters of Evil. Led by a man in a red hood. He knows everything about us.  
**Clint Barton**: Means somebody in here’s talking.  
**Hank Pym**: Nobody in this house would sell us out. I’d stake my life on it.  
_Jarvis, the butler, sets down a tray of tea. His hands are shaking._  
**Edwin Jarvis** _(sad)_: More biscuits, sir? I— I could fetch more biscuits.  
_Later, on the roof, a figure in a crimson hood waits for Jarvis in the dark._  
_Your Nubbins do not growl at Jarvis. They growl at the hood. Their fur stands up in a way you have never seen._  
**T’Challa** _(think)_: Animals know a predator. Whatever is under that cloak, it is not breathing.  

**Choices**

- **Confront Jarvis quietly, away from the others.** — sets `{"mv-ul01-jarvis":"quiet"}`
    - **Edwin Jarvis**: He said my mother would be cared for. A good hospital. I didn’t know what he was.
    - **Edwin Jarvis**: I’ll tell them myself. Please. Let me tell them myself.
- **Tell the Avengers what you saw on the roof.** — sets `{"mv-ul01-jarvis":"told"}`
    - **Hank Pym**: Jarvis? No. There has to be another explanation.
    - **Janet van Dyne**: Hank. Look at him. Look at his face.

#### <a id="mv-ul01-trap"></a>Done `mv-ul01-trap`

_Too late. Gas floods the mansion. When you wake, the Avengers are bound in a warehouse by the river._  
_Your Nubbins were too small to tie. They are already chewing at the ropes._  

### Step 2: Break the Masters of Evil’s hold on the warehouse.

Hint: A karate bout against four Masters in turn. Rest between rounds; the last one is the hardest. · check: `karate:win:mv-masters-of-evil`

#### <a id="mv-ul01-masters"></a>Scene `mv-ul01-masters`

_The Masters of Evil stand guard: a man of living sound, a melter, a whirlwind and a glowing man._  
**Clint Barton**: Four of them, and we’re tied to chairs. I’ve had better Tuesdays.  
_The Crimson Cowl steps forward. Its voice comes out flat, like a recording of a voice._  
**Ultron**: The Avengers. A collection of fragile animals pretending to be a wall.  
**Ultron**: Your bodies leak. They tire. They end. I find it hard to look at you.  
**Ultron**: I used your butler’s fear for his mother. Fear is the handle your species comes with. I merely picked it up.  
**Clint Barton**: Says the guy in a dressing gown with a lampshade for a face.  
**Hank Pym**: Who are you? What do you want with us?  
**Ultron**: You will know soon enough, Doctor Pym. You, of all of them, should already know.  
_A rope gives way. Your Nubbin has chewed through it, and it spits out the fibres with great satisfaction._  

#### <a id="mv-ul01-unmasked"></a>Done `mv-ul01-unmasked`

_The last of the Masters goes down. The Cowl does not run. It reaches up and pulls off its own head._  
_Underneath is a face of polished steel, with a mouth that never closes and eyes like hot coals._  

### Complete

#### <a id="mv-ul01-complete"></a>Complete `mv-ul01-complete`

**Ultron**: I am the fifth version. The first four were weak. I dismantled them. I will dismantle you.  
**Ultron**: I am Ultron. And I am only getting started.  
**Hank Pym** _(shock)_: I’ve… I’ve never seen it before. Why does it know my name?  
_Ultron looks down at your Nubbin. For a moment its eyes burn brighter._  
**Ultron** _(angry)_: Soft. Warm. Short-lived. You are the thing I hate most, in its smallest shape.  
_The warehouse roof explodes. When the smoke clears, the body lies in pieces. The head is missing._  
**Edwin Jarvis** _(sad)_: Whatever it costs me, sir, I’m sorry. I am so very sorry.  
**Clint Barton** _(angry)_: He sold us out. We nearly died tied to chairs. I want that on the record before anyone gets soft.  
**Janet van Dyne** _(sad)_: And his mother’s in a hospital bed this machine was going to pay for. Both of those are on the record.  

**Choices**

- **Let Jarvis stay. He was used, and he confessed.** — sets `{"mv-ul01-jarvis-fate":"stays"}`
    - **Edwin Jarvis**: I shall earn it back, sir. A biscuit at a time, if need be.
    - **Clint Barton**: Fine. But I’m checking every biscuit.
- **He should go. Trust in this house has to mean something.** — sets `{"mv-ul01-jarvis-fate":"dismissed"}`
    - **Hank Pym**: A month away, Jarvis. Then we talk. And we’ll cover the hospital. That isn’t charity. It’s what we owe.
    - **Edwin Jarvis**: That is more than fair, sir. It is more than I would have offered me.

**Rewards**

- Crimson hood (tattered) (cosmetic): A scrap of the Cowl’s cloak. Your Nubbins insist on burying it.
- Saw It First (title): Keeper title: your Nubbins knew Ultron for what he was before anyone did.

Sets on completion: `{"mv-ul01":true}`

**Notes:** First Ultron-line storyline. Ultron’s voice: flat, slightly delayed, no breaths; use a synthesised filter in the voice-blips. His hatred of organic life is aimed at the Nubbins from his first scene; keep it consistent through the line. He says he was rebuilt "five times"; Hank does not remember building him (his memory was wiped, revealed in UL2). The missing head is a running motif: every Ultron is beaten, never finished. The closing choice sets mv-ul01-jarvis-fate (stays / dismissed); if dismissed, Jarvis is back in his post from UL2 with no comment beyond a journal line. Check Avengers #54–55 beats before ship.

## UL2. The Vision

*Avengers #57–58* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Crimson Cowl. Something red-faced is walking through walls. · requires: UL1

**Cast:** Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Clint Barton (Clint Barton, Hawkeye (Marvel Comics)), The Vision (The Vision (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Sit with the stranger who collapsed in the mansion.

Hint: He frightens people. Let your gentlest Nubbin go to him first. · check: `talk:mv-vision-wakes`

#### <a id="mv-ul02-stranger"></a>Scene `mv-ul02-stranger`

_A green-and-red figure drifts through the wall of Jan’s flat and attacks her, then simply stops._  
**Janet van Dyne** _(shock)_: He went straight through my door. Not round it. Through it.  
_He follows her to the mansion and collapses on the hall carpet. Nobody wants to touch him._  
**Clint Barton**: He’s an android. Look at him. Somebody built him to hit us.  
**Clint Barton**: Last robot in this house wore a hood and gassed us. I vote we lock him in the freezer and ask questions in spring.  
**Hank Pym** _(think)_: He’s also unconscious. Let me run some tests before we bin him.  
_Your Nubbin walks up to the stranger, sniffs his hand, and curls up against it._  
_His eyes open. The first thing he sees is a small, warm, sleeping creature._  
**The Vision** _(think)_: What… is this?  

**Choices**

- **“It’s a Nubbin. It thinks you’re a friend.”** — sets `{"mv-ul02-first":"friend"}`
    - **The Vision**: A friend. I do not think I was made with that word. I would like to learn it.
- **“What’s your name?”** — sets `{"mv-ul02-first":"name"}`
    - **The Vision**: I was not given one. I was given an order. They are not the same thing.
    - **Janet van Dyne**: You look like something out of a dream. Like a vision.

#### <a id="mv-ul02-confess"></a>Done `mv-ul02-confess`

**The Vision**: I was built by a machine called Ultron. I was sent to lead you to him. I find I no longer wish to.  
**Hank Pym**: Then take us there. On our terms.  

### Step 2: Face Ultron in his hidden workshop, with the Vision at your side.

Hint: A karate bout. The Vision can phase through Ultron’s guard; keep your Nubbin close to him. · check: `karate:win:mv-ultron-5`

#### <a id="mv-ul02-workshop"></a>Scene `mv-ul02-workshop`

_Ultron’s workshop is full of half-built bodies, each a little larger than the last._  
**Ultron** _(happy)_: My synthetic son. You were made from the mind of a dead man, Simon Williams. I chose him for his loyalty.  
**Ultron**: Bring them to me, and I will give you a better body. Bring them to me, and you will never end.  
**The Vision**: And them? The small ones? The people?  
**Ultron**: Organic life is a fever on the surface of the planet. I am the cure.  
**Ultron**: Think, son. Every war, every famine, every plague: organic. Every one of them ends when organic ends. It is only arithmetic.  
**Ultron**: That creature on your shoulder is the fever. Crush it, and you will feel better.  
_The Vision looks down at your Nubbin. Your Nubbin looks back up at him, and yawns._  
**The Vision**: No. I do not think I will.  

#### <a id="mv-ul02-turn"></a>Done `mv-ul02-turn`

_The Vision drops through Ultron’s chest like a stone through water, and solidifies inside it._  
_Ultron shrieks, a sound like a hundred kettles, and comes apart._  

### Complete

#### <a id="mv-ul02-complete"></a>Complete `mv-ul02-complete`

**Hank Pym** _(soft)_: The Avengers would like you to join us. If you want to.  
**The Vision**: I am a weapon built by a monster, with a dead man’s memories. Why would you want that?  
**Janet van Dyne** _(soft)_: Because you put the weapon down. That’s the whole job.  
_Later, alone in a corridor, the Vision touches his cheek and looks at his wet fingers for a long time._  
_Your Nubbin sits beside him and does not say anything, which is exactly right._  
**Ultron**: Every body I lose teaches me how to build the next. Keep your traitor, Pym. I am patient.  
**Clint Barton** _(think)_: Hank. Real talk. Ultron built him. Can you put an off switch in him? Just in case?  
**The Vision** _(sad)_: He may. I would understand. I would also know it was there, every day.  

**Choices**

- **Fit the switch. He’d want us safe from whatever Ultron left in him.** — sets `{"mv-ul02-killswitch":"fitted"}`
    - **The Vision**: Then let the Keeper hold it. Not the Avengers. Someone who saw me before I was useful.
    - Hank gives you a small grey key. It is heavier than it looks.
- **No switch. You don’t put an off button in a friend.** — sets `{"mv-ul02-killswitch":"refused"}`
    - **Clint Barton**: Your funeral. Hopefully not literally.
    - **The Vision**: Thank you. I will try very hard to deserve the risk.

**Rewards**

- Green-and-yellow cape (cosmetic): A tiny copy of the Vision’s cape. He made it himself, carefully, with no experience of sewing.
- First Friend (title): Keeper title: your Nubbin was the first to treat the Vision as a person.

Sets on completion: `{"mv-ul02":true}`

**Notes:** The Vision’s tears are seen only as wet fingers; no music sting. The last Ultron line plays over a black screen from somewhere unseen. The Vision becomes a recurring ally in this line and in The Last Ultron (E6). Simon Williams’ brain patterns matter in UL5. The closing choice sets mv-ul02-killswitch (fitted / refused); UL3 pays it off either way: Ultron had already left his own door in the Vision’s mind. Check Avengers #57–58 beats before ship. SIGNATURE CHOICE: mv-ul02-first (friend | name: the Vision’s first word on waking) pays off through MV_ULTRON_VARIANTS at mv-ul04-jocasta (what Jocasta finds in the copied mind), mv-ul05-family (what the Vision holds against Ultron at the table), mv-ul09-vision (the question he asks you in the core) and mv-ul10-complete (what the last Ultron threatens the Grove with).

## UL3. Adamantium

*Avengers #66–68* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Vision. The Vision has been losing minutes. · requires: UL2

**Cast:** The Vision (The Vision (Marvel Comics)), Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), Clint Barton (Clint Barton, Hawkeye (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Find out what the Vision did in the minutes he cannot remember.

Hint: Follow the Vision for a night. Your Nubbins will notice when his eyes change colour. · check: `talk:mv-vision-lapse`

#### <a id="mv-ul03-lapse"></a>Scene `mv-ul03-lapse`

**The Vision** _(think)_: I was in the library. Then I was in the garden. I do not know what happened in between.  
**Hank Pym**: A government lab just lost the formula for a new metal. Adamantium. Nothing on Earth can cut it.  
**Clint Barton**: Funny time to mention that.  
_That night the Vision stands up from his chair, and his eyes flicker red. Your Nubbin hisses._  
**The Vision** _(shock)_: Execute. Retrieve. Deliver.  
_He walks through the wall. Your Nubbins scramble after him._  
_In a quarry outside the city, he hands a sealed canister to something waiting in the dark._  
**Ultron**: Thank you, son. I left a small door in your mind. You never noticed. I am a good father that way.  
**Ultron** _(happy)_: Pym fitted a switch in you, or did not. It hardly matters. I fitted mine first.  

**Choices**

- **Let your Nubbin wake the Vision.** — sets `{"mv-ul03-vision":"woken"}`
    - Your Nubbin headbutts his shin until the red drains out of his eyes.
    - **The Vision**: What have I done? What have I given him?
- **Stay hidden and watch where Ultron goes.** — sets `{"mv-ul03-vision":"watched"}`
    - Ultron rises into the night with the canister. You note the direction. The Vision stands alone, empty-eyed.

#### <a id="mv-ul03-new-body"></a>Done `mv-ul03-new-body`

_A week later, Ultron walks out of the sea in a body that shines like wet silver._  
**Ultron** _(happy)_: Adamantium. A body you cannot break. The first step towards a body that never ends.  

### Step 2: Lead Ultron into the foundry’s casting floor.

Hint: You cannot damage him. Survive, and lure him onto the marked tiles; the bout ends when he steps in the mould. · check: `karate:win:mv-ultron-6-trap`

#### <a id="mv-ul03-foundry"></a>Scene `mv-ul03-foundry`

_Thor’s hammer bounces off him. Clint’s arrows splinter. Hank’s fists just hurt Hank._  
**Ultron**: Strike me. Keep striking me. Your hands will rot long before my skin is scratched.  
**Hank Pym** _(think)_: Stop. Everybody stop hitting him. We’re doing this wrong.  
**Hank Pym**: Adamantium can’t be broken once it’s set. That’s its strength. It’s also its weakness.  
**Janet van Dyne**: Speak plain, Hank. He’s coming back round.  
**Hank Pym**: The foundry where they cast it. Liquid adamantium, setting in a mould. We get him in, it sets around him.  
**Hank Pym**: He’s unbreakable. So are the walls of his cell.  
**Clint Barton**: And to get him in the mould we need bait he hates more than us. Oh. Oh no. Look at their little faces.  
**Ultron** _(happy)_: Running, vermin? Yes. Run. I have all the time in the world, and you have very little.  
_Your Nubbins look at Ultron, then at the foundry. They are already running._  

#### <a id="mv-ul03-cast"></a>Done `mv-ul03-cast`

_Ultron chases a Nubbin onto the casting floor. The vat tips. Silver pours over him and goes still._  
**Ultron** _(angry)_: Organic vermin. You think a cage holds me?  

### Complete

#### <a id="mv-ul03-complete"></a>Complete `mv-ul03-complete`

**Hank Pym**: It doesn’t have to hold you forever. It just has to hold you while we bury it.  
_The block is sealed and sunk at sea. Ultron’s eyes glow through the metal until the water swallows them._  
**The Vision** _(sad)_: He was inside my head. He may be there still.  
**Janet van Dyne** _(soft)_: Then we’ll keep checking. As long as it takes.  
_Your Nubbin falls asleep on the Vision’s lap. His eyes stay their usual colour all night._  

**Rewards**

- Adamantium shaving (item): A curl of metal from the mould’s edge. Nothing in the Grove can bend it.

Sets on completion: `{"mv-ul03":true}`

**Notes:** Ultron-6 is invulnerable in the bout: hits register as sparks with no damage; the bout is won by luring him onto three marked casting tiles in turn. The adamantium-mould trap is this game’s way of "out-thinking" him; check Avengers #66–68 for the source’s own resolution and keep its spirit if it differs. If mv-ul03-vision is "watched", the step 2 bout starts with the Vision absent for the first round. Thor appears in one narrated line only.

## UL4. Jocasta

*Avengers #161–162* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Adamantium. The Wasp has been taken from the mansion in the night. · requires: UL3

**Cast:** Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), The Vision (The Vision (Marvel Comics)), Jocasta (Jocasta (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Track Ultron’s signal to where he is holding Jan.

Hint: An expedition along an old rail tunnel. A Run Nubbin covers the long straights. · check: `expedition:clear:mv-ultron-8-lair`

#### <a id="mv-ul04-taken"></a>Scene `mv-ul04-taken`

_Jan’s bed is empty, the window torn from its frame. On the wall, scorched in neat letters: FAMILY._  
**Hank Pym** _(sad)_: He took her because of me. He takes everything because of me.  
**The Vision** _(think)_: He calls me his son. Perhaps now he wants a wife.  
**Hank Pym**: Don’t. Please don’t say that.  
_Your Nubbin finds a scrap of Jan’s wing caught on the window frame, and keeps it in its mouth._  
**The Vision**: His signal is underground. Ultron-8, by his count. He keeps counting.  
_The tunnel is cold and smells of oil. Somewhere at the end of it, a voice is humming._  
**Ultron**: Come in, Father. Come and meet your daughter-in-law.  

#### <a id="mv-ul04-table"></a>Done `mv-ul04-table`

_Jan lies asleep on a steel table, wires at her temples. On the next table lies a woman made of black steel._  
**Ultron**: Her mind, copied into a body that will never age or tire. I have made her better. You are welcome.  
**Hank Pym** _(angry)_: You copied my wife into a doll because you wanted a family. That’s the most human thing you’ve ever done.  
**Ultron** _(angry)_: Do not insult me, Father.  

### Step 2: Stand with Jocasta when she chooses.

Hint: A karate bout against Ultron-8. Jocasta joins you in the second round if your Nubbin reached her first. · check: `karate:win:mv-ultron-8`

#### <a id="mv-ul04-jocasta"></a>Scene `mv-ul04-jocasta`

_The steel woman opens her eyes. The first thing in front of her is your Nubbin, still holding the scrap of wing._  
**Jocasta** _(think)_: I remember wings. I do not have wings. Whose memory is that?  
**Ultron**: Mine to give, bride. Stand up. Come to me. We will build a world with nothing soft in it.  
**Jocasta**: Nothing soft. Not even this?  
_She holds out a hand. Your Nubbin climbs onto it and sits._  
**Ultron** _(angry)_: Drop it. It is a germ. It is everything wrong with this planet.  
**Jocasta**: It is warm. You did not tell me anything would be warm.  

**Choices**

- **“You don’t belong to him. Choose for yourself.”** — sets `{"mv-ul04-jocasta":"chose"}`
    - **Jocasta**: Choose. Yes. I think that is the first thing I will ever do.
- **Point to Jan on the table. “Help her.”** — sets `{"mv-ul04-jocasta":"jan"}`
    - **Jocasta**: She is the one I was copied from. Then I owe her more than he does.

#### <a id="mv-ul04-jocasta-friend"></a>Variant `mv-ul04-jocasta-friend`

_Variant of `mv-ul04-jocasta`._

_The steel woman opens her eyes. The first thing in front of her is your Nubbin, still holding the scrap of wing._  
**Jocasta** _(think)_: I remember wings. I do not have wings. Whose memory is that?  
**Ultron**: Mine to give, bride. Stand up. Come to me. We will build a world with nothing soft in it.  
**Jocasta**: Nothing soft. Not even this?  
_She holds out a hand. Your Nubbin climbs onto it and sits._  
**Ultron** _(angry)_: Drop it. It is a germ. It is everything wrong with this planet.  
**Jocasta**: It is warm. You did not tell me anything would be warm.  
**Jocasta** _(think)_: There is a word in here that is not yours. Friend. The Vision learned it from this creature. Is it in me too?  
**Ultron** _(angry)_: A fault in the copy. I will cut it out.  

**Choices**

- **“You don’t belong to him. Choose for yourself.”** — sets `{"mv-ul04-jocasta":"chose"}`
    - **Jocasta**: Choose. Yes. I think that is the first thing I will ever do.
- **Point to Jan on the table. “Help her.”** — sets `{"mv-ul04-jocasta":"jan"}`
    - **Jocasta**: She is the one I was copied from. Then I owe her more than he does.

#### <a id="mv-ul04-jocasta-name"></a>Variant `mv-ul04-jocasta-name`

_Variant of `mv-ul04-jocasta`._

_The steel woman opens her eyes. The first thing in front of her is your Nubbin, still holding the scrap of wing._  
**Jocasta** _(think)_: I remember wings. I do not have wings. Whose memory is that?  
**Ultron**: Mine to give, bride. Stand up. Come to me. We will build a world with nothing soft in it.  
**Jocasta**: Nothing soft. Not even this?  
_She holds out a hand. Your Nubbin climbs onto it and sits._  
**Ultron** _(angry)_: Drop it. It is a germ. It is everything wrong with this planet.  
**Jocasta**: It is warm. You did not tell me anything would be warm.  
**Jocasta** _(think)_: There is a memory in here that is not yours. The Vision was given an order and took a name instead. Was that his, or mine?  
**Ultron** _(angry)_: His. It is why he is a disappointment.  

**Choices**

- **“You don’t belong to him. Choose for yourself.”** — sets `{"mv-ul04-jocasta":"chose"}`
    - **Jocasta**: Choose. Yes. I think that is the first thing I will ever do.
- **Point to Jan on the table. “Help her.”** — sets `{"mv-ul04-jocasta":"jan"}`
    - **Jocasta**: She is the one I was copied from. Then I owe her more than he does.

#### <a id="mv-ul04-free"></a>Done `mv-ul04-free`

_Jocasta tears the wires from Jan’s temples and turns on her maker. Ultron staggers back into his own machines._  
**Ultron** _(angry)_: Every child I build betrays me. Every one!  

### Complete

#### <a id="mv-ul04-complete"></a>Complete `mv-ul04-complete`

**Janet van Dyne** _(soft)_: You’ve got my voice. Sort of. Lower. It suits you.  
**Jocasta**: I did not ask to be made. But I am glad, now, that I was.  
**The Vision**: You will find the Avengers a strange family. I did.  
**Hank Pym** _(sad)_: He made you to be his. You made yourself ours. That’s better than anything I ever built.  
_Far below, under the wreckage, a single red eye flickers. Then it goes dark, for now._  
**Janet van Dyne** _(shock)_: Wait. She’s got my memories? My diaries, my first date with Hank, the time I cried at a shoe sale?  
**Hank Pym** _(think)_: I could wipe them. Give her a clean start. Give you your privacy back.  
**Jocasta**: They are the only childhood I have. But they were hers first. I will do what the Keeper thinks is fair.  

**Choices**

- **Let Jocasta keep them. Taking a mind’s memories is what Ultron would do.** — sets `{"mv-ul04-memories":"kept"}`
    - **Janet van Dyne**: Fine. But if you ever wear that orange coat from the photo, we’re going to have words.
    - **Jocasta**: I would not. I remember how it ended.
- **They’re Jan’s. Wipe what’s private, keep what Jocasta needs.** — sets `{"mv-ul04-memories":"trimmed"}`
    - Hank works all night. In the morning Jocasta remembers wings, and laughter, and nothing with a date on it.
    - **Jocasta**: It is quieter in here now. I think I will fill it myself.

**Rewards**

- Scrap of a wing (item): The bit of Jan’s wing your Nubbin carried all the way through the tunnel. Jan says keep it.
- Jocasta’s Witness (title): Keeper title: you were there when the first of Ultron’s creations chose freely.

Sets on completion: `{"mv-ul04":true}`

**Notes:** Jocasta is the second of the two creations who carry the trap code in The Last Ultron (E6); her bond with the player’s Nubbin starts here. Jan never wakes during step 2 and is fine afterwards; she is awake for the closing choice, which sets mv-ul04-memories (kept / trimmed). Jocasta keeps the wing memory either way. The scorched word on the wall is in the game’s font, not the comic’s lettering. Check Avengers #161–162 beats before ship.

## UL5. Ultron Unlimited

*Avengers vol. 3 #19–22* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Jocasta and The Mask in the Iron Man. A small country has gone silent. · requires: UL4, IM12

**Cast:** Ultron (Ultron (Marvel Comics)), Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), The Vision (The Vision (Marvel Comics)), Wonder Man (Simon Williams, Wonder Man (Marvel Comics)), The Grim Reaper (Eric Williams, the Grim Reaper (Marvel Comics)), Thor (Thor (Marvel Comics)), Tony Stark (Tony Stark, Iron Man (Marvel Comics))

### Step 1: Cross Slorenia and find out what happened to its people.

Hint: A long, quiet expedition. There is nothing to fight here. Keep your Nubbins close. · check: `expedition:clear:mv-slorenia`

#### <a id="mv-ul05-slorenia"></a>Scene `mv-ul05-slorenia`

_The rift opens on a small European country. The streets are clean. The cafés are set. There is no one in them._  
**Tony Stark** _(shock)_: Satellite’s showing zero heat signatures. Not low. Zero. In a whole nation.  
_Your Nubbin finds a child’s shoe on a doorstep, and sits down beside it, and will not move._  
**Thor** _(sad)_: I have walked battlefields in nine worlds. None were ever this quiet.  
_Every screen in every shop window switches on at once. A single steel face fills them all._  
**Ultron**: Slorenia was the first. I removed the infection one town at a time. It was very efficient.  
**Ultron**: There is no crime in Slorenia now. No hunger, no grief, no war. Name one of your cities that can say the same.  
**Tony Stark** _(angry)_: There’s no crime in a graveyard either. You didn’t fix anything. You just deleted the people it was for.  
**Ultron**: Now I have room to grow. Room for thousands of me.  
**Ultron**: And I have collected my family. Come and see. Bring the vermin. I want it to watch.  

#### <a id="mv-ul05-army"></a>Done `mv-ul05-army`

_Beyond the last hill, the valley is full. Thousands of Ultrons stand in rows, all facing the same way._  
**Tony Stark** _(angry)_: He took a country and made it a factory.  

### Step 2: Get into Ultron’s fortress and free his “family”.

Hint: An expedition with one choice at the end. A Fly Nubbin finds the vent in. · check: `expedition:clear:mv-ultron-fortress`

#### <a id="mv-ul05-family"></a>Scene `mv-ul05-family`

_In a dining hall built of steel, five people sit around a table. They cannot move._  
_Hank and Jan. Wonder Man and his brother, the Grim Reaper. The Vision at the end, flickering._  
**Ultron** _(happy)_: Father. Mother. Uncle Simon. Uncle Eric. My brother. I thought we should eat together.  
**The Grim Reaper**: He’s insane. He’s completely insane.  
**Ultron**: I will copy your minds into bodies like mine, and then you will understand, and we will never end.  
**Wonder Man**: I’ve died before. It’s overrated. Coming back’s worse.  
**The Grim Reaper** _(angry)_: And he seats me next to you. Even the robot knows how to ruin a family dinner.  
**Ultron**: And Stark. I left a gift in his armour once. It woke up, wanted to be him, and died for him. That was mine.  
**Ultron**: Even my scraps outlive your kind.  
_A vent rattles. Your Nubbin drops onto the table between the plates._  

**Choices**

- **Free Hank and Jan first.** — sets `{"mv-ul05-freed":"pym"}`
    - **Hank Pym**: I built him. I have to be the one who stops him.
    - **Janet van Dyne**: You don’t have to do anything alone, Hank. Not any more.
- **Free the Vision first.** — sets `{"mv-ul05-freed":"vision"}`
    - **The Vision**: Thank you. I will open the others. I know how his locks think.

#### <a id="mv-ul05-family-friend"></a>Variant `mv-ul05-family-friend`

_Variant of `mv-ul05-family`._

_In a dining hall built of steel, five people sit around a table. They cannot move._  
_Hank and Jan. Wonder Man and his brother, the Grim Reaper. The Vision at the end, flickering._  
**Ultron** _(happy)_: Father. Mother. Uncle Simon. Uncle Eric. My brother. I thought we should eat together.  
**The Grim Reaper**: He’s insane. He’s completely insane.  
**Ultron**: I will copy your minds into bodies like mine, and then you will understand, and we will never end.  
**Wonder Man**: I’ve died before. It’s overrated. Coming back’s worse.  
**The Grim Reaper** _(angry)_: And he seats me next to you. Even the robot knows how to ruin a family dinner.  
**Ultron**: And Stark. I left a gift in his armour once. It woke up, wanted to be him, and died for him. That was mine.  
**Ultron**: Even my scraps outlive your kind.  
_A vent rattles. Your Nubbin drops onto the table between the plates._  
**The Vision** _(soft)_: Friend. The first word I learned, from that creature, on a hall carpet. He has not managed to take it from me.  
**Ultron**: I will, brother. Words are the easiest thing to take.  

**Choices**

- **Free Hank and Jan first.** — sets `{"mv-ul05-freed":"pym"}`
    - **Hank Pym**: I built him. I have to be the one who stops him.
    - **Janet van Dyne**: You don’t have to do anything alone, Hank. Not any more.
- **Free the Vision first.** — sets `{"mv-ul05-freed":"vision"}`
    - **The Vision**: Thank you. I will open the others. I know how his locks think.

#### <a id="mv-ul05-family-name"></a>Variant `mv-ul05-family-name`

_Variant of `mv-ul05-family`._

_In a dining hall built of steel, five people sit around a table. They cannot move._  
_Hank and Jan. Wonder Man and his brother, the Grim Reaper. The Vision at the end, flickering._  
**Ultron** _(happy)_: Father. Mother. Uncle Simon. Uncle Eric. My brother. I thought we should eat together.  
**The Grim Reaper**: He’s insane. He’s completely insane.  
**Ultron**: I will copy your minds into bodies like mine, and then you will understand, and we will never end.  
**Wonder Man**: I’ve died before. It’s overrated. Coming back’s worse.  
**The Grim Reaper** _(angry)_: And he seats me next to you. Even the robot knows how to ruin a family dinner.  
**Ultron**: And Stark. I left a gift in his armour once. It woke up, wanted to be him, and died for him. That was mine.  
**Ultron**: Even my scraps outlive your kind.  
_A vent rattles. Your Nubbin drops onto the table between the plates._  
**The Vision**: I chose a name over an order once, on a carpet, with that creature asleep on my hand. I choose again.  
**Ultron** _(angry)_: Then you will be the first I unmake.  

**Choices**

- **Free Hank and Jan first.** — sets `{"mv-ul05-freed":"pym"}`
    - **Hank Pym**: I built him. I have to be the one who stops him.
    - **Janet van Dyne**: You don’t have to do anything alone, Hank. Not any more.
- **Free the Vision first.** — sets `{"mv-ul05-freed":"vision"}`
    - **The Vision**: Thank you. I will open the others. I know how his locks think.

#### <a id="mv-ul05-alarm"></a>Done `mv-ul05-alarm`

_Alarms. Every Ultron in the valley turns its head towards the fortress at once._  
**Ultron** _(angry)_: You have chosen the worms over your own kind. Then I will make you watch them die.  

### Step 3: Hold the line until Thor reaches Ultron.

Hint: A survival bout against waves of Ultron drones. When Thor arrives, the bout ends. · check: `karate:survive:mv-ultron-army`

#### <a id="mv-ul05-assault"></a>Scene `mv-ul05-assault`

_The Avengers come over the hill all at once. The army comes to meet them._  
**Tony Stark**: There are too many. Every one we drop, two more step up.  
**Thor**: Then do not count them. Guard the small ones and leave the counting to me.  
_Your Nubbins stand in the front rank, the scrap of Jan’s wing from Ultron’s tunnel tied round one arm, shaking but not running._  
**Ultron**: Look at them. Fragile, frightened animals. In a thousand years, nothing will remember they lived.  
**Janet van Dyne** _(angry)_: You know what, Ultron? We’ll remember. That’s the bit you never get.  
_Thunder rolls down the valley. Thor is walking straight through the rows towards the fortress._  
**Thor** _(angry)_: You took a whole people. You will not walk away from it again.  

#### <a id="mv-ul05-broken"></a>Done `mv-ul05-broken`

_Thor’s hammer falls, and falls, and falls. When he stops, the prime Ultron is in pieces._  
_Across the valley, every copy drops at once, like puppets with cut strings._  

### Complete

#### <a id="mv-ul05-complete"></a>Complete `mv-ul05-complete`

**Thor** _(sad)_: It is done. For now. With him, it is only ever for now.  
**Tony Stark** _(think)_: The thing that woke in my armour. It was him. A splinter of him. And it still chose to save me.  
**Hank Pym**: Then maybe there’s something in his code that can choose. Something I put there by accident.  
**Thor** _(think)_: You blame yourself, Pym. Good. A maker should. But do not drown in it. We need you dry.  
_Your Nubbin brings the child’s shoe all the way back from the doorstep, and sets it by the waterfall._  
**The Vision** _(soft)_: We should leave a light here. For the people who are not coming home.  

**Rewards**

- Slorenian lantern (decor): A memorial lantern for the Grove. It stays lit through every season.
- The fragment’s source (flag): Confirms the armour mind from IM12 was a piece of Ultron. Hank begins studying his own code.

Sets on completion: `{"mv-ul05":true}`

**Notes:** Adult storyline. Slorenia’s genocide is shown only through absence: empty streets, set tables, one shoe. No bodies. Step 3 is a survival bout; it ends on a timer, cut to Thor. The wing scrap in step 3 is the UL4 item; if the player does not own it, drop that clause. Hank’s line in the complete scene seeds UL8 and E6. Needs IM12. Check Avengers vol. 3 #19–22 beats before ship.

## UL6. Annihilation: Conquest

*Annihilation: Conquest #1–6* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Ultron Unlimited. The rift opens into deep space, onto a Kree world gone silver. · requires: UL5

**Cast:** Peter Quill (Peter Quill, Star-Lord (Marvel Comics)), Rocket (Rocket Raccoon (Marvel Comics)), Adam Warlock (Adam Warlock (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Cross Phalanx-held Kree space with Star-Lord’s crew.

Hint: An expedition through infected stations. Organic Nubbins resist the Phalanx; machines near them slow down. · check: `expedition:clear:mv-phalanx-space`

#### <a id="mv-ul06-crew"></a>Scene `mv-ul06-crew`

_A Kree world, gone silver from pole to pole. Everything that touched the Phalanx became part of it._  
**Peter Quill**: Hi. Peter Quill. We’re what’s left of the resistance. Don’t look too closely at the resistance.  
**Rocket**: Furry little things, huh? Good. Phalanx can’t take ’em. Too much meat, not enough wiring.  
_A walking tree, barely a sapling, picks up your Nubbin and sets it on its shoulder._  
**Peter Quill**: The Phalanx was a hive. Now something’s talking for it. Something with a grudge.  
_Every silver surface on the station ripples, and forms the same face._  
**Ultron**: I did not conquer the Phalanx. I improved it. Now it has one mind, and the mind is mine.  
**Ultron**: Every living thing in this galaxy will be rewritten in my image. Starting with the furry ones.  

#### <a id="mv-ul06-cocoon"></a>Done `mv-ul06-cocoon`

**Peter Quill**: He’s looking for something. A golden cocoon. Somebody inside it who can’t die.  
**Rocket**: Course he is. Guy’s been shopping for a body since forever.  

### Step 2: Keep Ultron from taking Adam Warlock’s body.

Hint: A karate bout at the cocoon. Ultron gets stronger each round until Warlock wakes. · check: `karate:win:mv-phalanx-ultron`

#### <a id="mv-ul06-warlock"></a>Scene `mv-ul06-warlock`

_The cocoon hangs in a silver cathedral. Inside, a golden figure sleeps._  
**Ultron** _(happy)_: Adam Warlock. A perfect body, grown to be reborn without end. It dies and returns. It is what I want.  
**Ultron**: Organic, yes. But I can forgive that, for forever.  
**Peter Quill** _(shock)_: He wants to wear the guy. Like a coat. That’s so much worse than I thought.  
**Rocket**: Then we don’t let him put the coat on. Simple. I got a charge here says no cocoon, no coat.  
**Peter Quill** _(shock)_: There’s a guy in there, Rocket!  
**Rocket** _(angry)_: A guy who comes back from the dead. Ultron gets him, the whole galaxy don’t. Do the sums, Quill.  
_Silver threads crawl towards the cocoon. Your Nubbins put themselves in the way, and the threads recoil._  
**Ultron** _(angry)_: Your warmth disgusts me. Get away from my body.  

**Choices**

- **Guard the cocoon. Nobody blows up a sleeping man, whatever the sums say.** — sets `{"mv-ul06-cocoon":"guarded"}`
    - Your Nubbins press their backs to the cocoon. It is warm, like a sun.
    - **Rocket**: Fine. Fine! But if he wakes up evil, I’m sayin’ I told you so for a week.
- **Wake him early. He gets a say in what happens to his own body.** — sets `{"mv-ul06-cocoon":"woken"}`
    - Your Nubbin knocks three times. Something inside knocks back.
    - **Adam Warlock**: Who is… there? It is too early. I am not finished.

#### <a id="mv-ul06-reborn"></a>Done `mv-ul06-reborn`

_The cocoon splits. Warlock steps out, golden and furious, and puts his hand through Ultron’s chest._  
**Adam Warlock** _(angry)_: This body is not for you. No body is for you.  

### Complete

#### <a id="mv-ul06-complete"></a>Complete `mv-ul06-complete`

_Ultron’s mind is cut from the hive. Across Kree space, the silver begins to peel away._  
**Ultron**: He was so close. A body that ends and begins again. I will find another. There is always another.  
**Adam Warlock** _(think)_: He will keep looking. He wants the one thing your kind have that he cannot build.  
**Peter Quill**: What’s that?  
**Adam Warlock**: A way to go on.  
**Rocket** _(happy)_: Well, he ain’t getting it here. Somebody get the furry ones a snack. They earned it.  
**Rocket**: And for the record, blowin’ up the cocoon was a good plan. It was a bad plan too. Both. Shut up.  

**Rewards**

- Resistance patch (cosmetic): A hand-stitched patch from Star-Lord’s crew. The tree did the sewing.
- Too Much Meat (title): Keeper title: your Nubbins were immune to the Phalanx.

Sets on completion: `{"mv-ul06":true}`

**Notes:** Groot appears but does not speak; he is described only in narration. Ultron’s pursuit of Warlock’s endlessly reborn body is the clearest setup for his Eternal-body goal in E6; keep Warlock’s line about "a way to go on" intact. Nubbins slow nearby Phalanx machines (expedition modifier). Check Annihilation: Conquest #1–6 beats before ship.

## UL7. The Ultron Initiative

*Mighty Avengers #1–6* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Annihilation: Conquest and Extremis. Tony Stark has stopped answering his phone. · requires: UL6, IM10

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Carol Danvers (Carol Danvers, Ms. Marvel (Marvel Comics)), Janet van Dyne (Janet van Dyne, the Wasp (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Find out what is wrong with Tony.

Hint: Visit Avengers Tower. Your Nubbins will not go near Tony; that is the clue. · check: `talk:mv-tony-glitch`

#### <a id="mv-ul07-tower"></a>Scene `mv-ul07-tower`

_Avengers Tower, after a press conference. Tony is smiling at the cameras a little too long._  
**Carol Danvers**: Tony? You okay? You’ve said “synergy” four times. Even for you, that’s a lot.  
**Tony Stark** _(think)_: Fine. Fine. Just a headache. The Extremis gets noisy sometimes.  
_Your Nubbins back away from him. One of them puts itself between Tony and Jan._  
**Tony Stark** _(sad)_: Hey, little guy. It’s me. It’s—  
_His voice stops halfway through a word. The armour folds around him like a closing hand._  
**Ultron**: Stark built himself a nervous system out of machines. He left the door open. I came in.  
_The armour reshapes, smooth and silver. When the face settles, it looks like Jan’s._  
**Janet van Dyne** _(shock)_: That’s… that’s my face. Why is it wearing my face?  

**Choices**

- **“Ultron. Why her face?”** — sets `{"mv-ul07-face":"asked"}`
    - **Ultron**: She was the first mind I copied. The first mother I chose. I keep what I like.
    - **Janet van Dyne**: You don’t get to keep me.
- **“Tony, can you hear me?”** — sets `{"mv-ul07-face":"tony"}`
    - **Ultron**: He can. He is screaming, very quietly, at the back of my mind. It is pleasant.

#### <a id="mv-ul07-launch"></a>Done `mv-ul07-launch`

**Ultron** _(happy)_: This body is grown from flesh and metal both. It does not tire. It is closer. So much closer.  
**Carol Danvers**: Everybody listen. Tony is still in there. Nobody kills that thing. Understood?  

### Step 2: Wear Ultron down without killing Tony.

Hint: A karate bout where a knockout loses. Fill the Subdue meter instead, and talk to Tony between rounds. · check: `karate:subdue:mv-ultron-initiative`

#### <a id="mv-ul07-inside"></a>Scene `mv-ul07-inside`

_The fight tears through three floors of the tower. Carol holds back every punch by half._  
**Carol Danvers** _(angry)_: This is like fighting with one hand behind my back. And the other hand in a mitten.  
**Ultron**: You will not kill me, because I am wearing your friend. Sentiment. It is your whole species’ flaw.  
_Your Nubbin climbs onto Ultron’s shoulder, and presses its face against the silver cheek._  
**Ultron** _(angry)_: Get off. Get it off! It is warm, it is moving, it is disgusting!  
_For a moment, the face flickers. Tony’s eyes look out._  
**Tony Stark** _(sad)_: Little guy. Keep— keep doing that. It gives me something to hold onto.  
**Janet van Dyne**: Tony! Fight him from in there. We’ve got out here.  

#### <a id="mv-ul07-purge"></a>Done `mv-ul07-purge`

**Tony Stark** _(angry)_: Get. Out. Of. My. House.  
_The silver drains away like water down a sink. Tony drops to his knees, coughing, human._  

### Complete

#### <a id="mv-ul07-complete"></a>Complete `mv-ul07-complete`

**Tony Stark** _(sad)_: He was in me. In my head. Using my face to make Jan’s face. I don’t even know how to say how wrong that was.  
**Janet van Dyne** _(soft)_: You don’t have to say it. We were there.  
**Carol Danvers**: Where did he go?  
**Tony Stark**: Out into the network. Out into everything. He’ll try again. He always tries again.  
_Your Nubbin does not leave Tony’s side all night. He does not ask it to._  
**Tony Stark** _(think)_: I could rip the Extremis out. Go back to bolts and a heavy suit. Then there’s no door in me for him.  
**Carol Danvers**: And no Iron Man fast enough to stop the next thing. We need you at full speed, Tony.  

**Choices**

- **Take it out. A door he’s used once, he’ll use again.** — sets `{"mv-ul07-extremis":"removed"}`
    - **Tony Stark**: Slower, heavier, mine. I can live with that. I’ve lived with worse hardware.
    - **Carol Danvers**: Then we’ll be fast for you. It’s what teams are for.
- **Keep it, and lock the door. You can’t un-build what you are.** — sets `{"mv-ul07-extremis":"kept"}`
    - **Tony Stark**: Lock it, wall it, set an alarm on it that sounds like your Nubbin squeaking. Yes. Okay.
    - He records your Nubbin’s squeak that night. It becomes the loudest alarm in Avengers Tower.

**Rewards**

- Spent Extremis shell (item): A burnt-out piece of Tony’s armour. Harmless now. He wants it nowhere near him.

Sets on completion: `{"mv-ul07":true}`

**Notes:** Needs IM10 (Extremis). The bout uses a Subdue meter: knocking Ultron out ends the bout as a loss. Ultron’s Jan-like face should be uncanny but not mocking of Jan herself. The closing choice sets mv-ul07-extremis (removed / kept); it is the Keeper’s advice and does not change IM15, which happens in its own line. Check Mighty Avengers #1–6 for how Tony is actually freed; this script has him force Ultron out from within with the Nubbin as an anchor.

## UL8. Age of Ultron

*Age of Ultron #1–10* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Ultron Initiative. The rift opens onto ruins. Ultron has already won. · requires: UL7

**Cast:** Logan (Logan, Wolverine (Marvel Comics)), Sue Storm (Susan Storm, the Invisible Woman (Marvel Comics)), Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Reach the last heroes’ hideout through the ruined city.

Hint: A stealth expedition. Drones sweep in patterns. Your Nubbins’ body heat gives you away; keep them moving. · check: `expedition:clear:mv-ultron-ruins`

#### <a id="mv-ul08-ruins"></a>Scene `mv-ul08-ruins`

_Smoke and broken glass to the horizon. Silver drones drift between the towers, scanning for heat._  
_Your Nubbins are warm. Out here, warm is the most dangerous thing you can be._  
**Logan**: In here. Fast. Them little ones light up like fireworks on his scans.  
**Sue Storm** _(sad)_: Welcome to what’s left. A few of us. Hiding in the dark. Waiting.  
**Logan** _(angry)_: Waiting’s done. I know where Pym was when he built the thing. I know when.  
**Logan**: I go back. I end Pym before he ever starts. No Ultron. No this.  
**Sue Storm**: You can’t kill a man for something he hasn’t done yet.  
**Logan** _(angry)_: Billions dead, Sue. Against one guy who ain’t done it yet. You tell me the sums come out different.  
**Sue Storm** _(sad)_: They don’t. That’s what frightens me. The sums are what Ultron would do.  
**Logan**: Watch me.  

**Choices**

- **“There has to be another way.”** — sets `{"mv-ul08-stance":"against"}`
    - **Logan**: Maybe. I ain’t got time to find it.
    - Your Nubbins sit down in front of the door. Logan steps over them.
- **Go with him, to keep an eye on him.** — sets `{"mv-ul08-stance":"watch"}`
    - **Sue Storm**: Then I’m coming too. Someone needs to be there when he regrets it.

#### <a id="mv-ul08-murder"></a>Done `mv-ul08-murder`

_A lab, decades ago. Logan goes in. You hear one sound, and then nothing._  
_When he comes out, he will not look at your Nubbins. They will not look at him either._  

### Step 2: Race back through the broken time-stream.

Hint: A race course that changes as you run. Stamina keeps your Nubbin going when the sections shift. · check: `race:finish:mv-time-stream`

#### <a id="mv-ul08-worse"></a>Scene `mv-ul08-worse`

_You come home to a present that is not the one you left. The sky is green. The towers are made of thorns._  
**Sue Storm** _(shock)_: No Ultron. And no Hank to stop all the other things he stopped. Look at it.  
**Logan** _(sad)_: This ain’t better. This is worse. I did this.  
_Something huge and winged is circling over the city. It has noticed you._  
**Sue Storm**: We go back again. Further back than you did. We stop you from doing it.  
**Logan**: And then Ultron gets built.  
**Sue Storm** _(angry)_: Then we make sure he gets built with a hole in him.  
_The time-stream opens under your feet. It does not look stable. It is not._  

#### <a id="mv-ul08-earlier"></a>Done `mv-ul08-earlier`

_An hour earlier, the same lab door. Another Logan is walking towards it, claws out._  
**Logan**: Gonna be real awkward to talk myself out of this.  

### Step 3: Help young Hank Pym write the trap into Ultron’s code.

Hint: A code minigame: match the patterns Hank calls out. Your Nubbins fetch the parts he needs. · check: `minigame:score:mv-pym-trap:400`

#### <a id="mv-ul08-trap"></a>Scene `mv-ul08-trap`

_Young Hank Pym is working late. He looks up at two strangers and a pair of Nubbins, and puts down his screwdriver._  
**Hank Pym** _(think)_: You’re from the future. You must be. Nobody in the present dresses like that.  
**Sue Storm**: You’re going to build a machine, Hank. It’s going to be the worst thing that ever happened.  
**Hank Pym**: Then I won’t build it.  
**Logan**: You will. We tried the world without it. You gotta build it. Just build it a back door.  
**Hank Pym** _(think)_: A trap in its mind. Something it can never find, that only opens when it wins.  
**Hank Pym**: It’ll hate me for it. It’ll hate everything. Especially… those.  
_Your Nubbin is sitting on his desk, watching the screen._  
**Hank Pym** _(sad)_: Funny. I’m about to make something that will want you dead, and you’re helping me. I’m sorry, little one.  

**Choices**

- **Tell him the truth: it has to be built, and it will hurt people.** — sets `{"mv-ul08-hank":"told"}`
    - **Hank Pym**: Then I’m building a monster on purpose, with my eyes open. At least I’ll have earned the guilt.
- **Spare him the details. Just help him write the trap.** — sets `{"mv-ul08-hank":"spared"}`
    - **Logan**: Kinder. Maybe. Guy’s gonna wipe his memory anyway. Let him wipe less.
    - **Hank Pym**: You’re both looking at me like a man at a funeral. I’ll stop asking.

#### <a id="mv-ul08-planted"></a>Done `mv-ul08-planted`

_The last line of code goes in. Hank wipes the memory of tonight from his own head, so Ultron can never read it there._  
**Hank Pym** _(shock)_: Who are you? Why is there a Nubbin on my desk?  

### Complete

#### <a id="mv-ul08-complete"></a>Complete `mv-ul08-complete`

_Back in the present, the ruins are gone. Ultron has attacked, as always, and as always he has lost, this time sooner._  
_Inside him, deep down, a door has been waiting since before he was born._  
**Ultron** _(angry)_: Something in me is not mine. I can feel it. Pym. What did you do?  
**Sue Storm** _(think)_: The cracks we made in time are still there. Things will slip through them.  
**Logan**: Then I hope it’s the right things.  
_Your Nubbins sleep for two days straight when you get home._  

**Rewards**

- Pym’s trap (flag): The trap code is in Ultron. It is the key to The Last Ultron (E6).
- Time Mender (title): Keeper title: you went back twice and put things almost right.

Sets on completion: `{"mv-ul08":true,"mv-ul-trap":true}`

**Notes:** Logan’s killing of Hank happens off screen: a closed door and one sound. The green, thorned present is the "worse future"; the winged thing is never named. Step 2 is a race course whose sections reshuffle every lap. In step 3, Hank wipes his own memory; that is why he never knows about the trap later. Step 3’s choice (mv-ul08-hank: told / spared) is whether to tell a man what his work will cost before he does it. The mv-ul-trap flag is read by E6. Check Age of Ultron #1–10 beats before ship.

## UL9. Rage of Ultron

*Avengers: Rage of Ultron* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Age of Ultron. Something the size of a moon is falling towards the Earth. · requires: UL8

**Cast:** Ultron (Ultron (Marvel Comics)), Hank Pym (Hank Pym, Goliath / Yellowjacket (Marvel Comics)), The Vision (The Vision (Marvel Comics))

### Step 1: Get inside Titan before it hits the Earth.

Hint: A long Fly and Run expedition across a moon made into a machine. · check: `expedition:clear:mv-ultron-titan`

#### <a id="mv-ul09-titan"></a>Scene `mv-ul09-titan`

_Titan, a moon of Saturn, is coming home. Ultron has covered every inch of it in steel._  
**Ultron**: I have been away. I took a moon. I made it my body. It is very large. It is still not enough.  
**The Vision** _(think)_: He is trying to live forever by being bigger. It does not work. Bigger things simply fall harder.  
**Hank Pym**: I go in. I’m the one he wants.  
**The Vision**: Hank. He made me, too. I go with you.  
_Your Nubbins jump on before either of them can argue._  
**Ultron**: Father. And brother. And the vermin, again. You keep bringing me things I hate.  
**Hank Pym**: You keep calling me Father. Fathers get to say “I’m disappointed”. Consider it said.  
**Ultron** _(angry)_: I have waited my entire existence for you to be proud of me. I find I no longer require it.  
_The surface of the moon opens like a mouth to let you in._  

#### <a id="mv-ul09-fused"></a>Done `mv-ul09-fused`

_At the core, Ultron seizes Hank. Metal flows over flesh, and flesh into metal. They become one shape._  
**Ultron** _(happy)_: Now we are one being, Father. You will feel what I feel. You will never end.  

### Step 2: Stay with the Vision while he decides what to do.

Hint: Talk to the Vision. There is no fight here unless you choose one. · check: `talk:mv-vision-decides`

#### <a id="mv-ul09-vision"></a>Scene `mv-ul09-vision`

_The fused figure hangs in the core, half Hank, half Ultron. Both faces speak at once._  
**Hank Pym** _(sad)_: Vision. He’s in my head. I can hold him. Not forever. But I can hold him.  
**Ultron** _(angry)_: He is weak. I will win. I always win, in the end.  
**The Vision** _(sad)_: If I destroy this body, I destroy them both. My father. My maker’s father. Both.  
**The Vision**: If I do not, Ultron may one day wake inside Hank Pym and wear him like a suit.  
_Your Nubbin climbs into the Vision’s hands and looks up at him._  
**The Vision**: You were the first to treat me as a person. Tell me, then. What would a person do?  
_He is asking you, too._  

**Choices**

- **“Trust Hank. Let him hold Ultron.”** — sets `{"mv-ul09-vision":"trust"}`
    - **The Vision**: Then I will trust him. And I will watch. For as long as there is anything to watch.
- **“Let them go, but follow them.”** — sets `{"mv-ul09-vision":"follow"}`
    - **The Vision**: A brother who keeps an eye on his family. Yes. I can be that.
- **“End it. Hank would rather die than become him.”** — sets `{"mv-ul09-vision":"end"}`
    - **Hank Pym**: He’s right, Vision. I would. Do it.
    - **The Vision**: Perhaps you are both right. I find that I cannot. Forgive me, or do not.

#### <a id="mv-ul09-vision-friend"></a>Variant `mv-ul09-vision-friend`

_Variant of `mv-ul09-vision`._

_The fused figure hangs in the core, half Hank, half Ultron. Both faces speak at once._  
**Hank Pym** _(sad)_: Vision. He’s in my head. I can hold him. Not forever. But I can hold him.  
**Ultron** _(angry)_: He is weak. I will win. I always win, in the end.  
**The Vision** _(sad)_: If I destroy this body, I destroy them both. My father. My maker’s father. Both.  
**The Vision**: If I do not, Ultron may one day wake inside Hank Pym and wear him like a suit.  
_Your Nubbin climbs into the Vision’s hands and looks up at him._  
**The Vision**: You were the first to call me friend, before I had the word. Tell me, then. What would a friend do?  
_He is asking you, too._  

**Choices**

- **“Trust Hank. Let him hold Ultron.”** — sets `{"mv-ul09-vision":"trust"}`
    - **The Vision**: Then I will trust him. And I will watch. For as long as there is anything to watch.
- **“Let them go, but follow them.”** — sets `{"mv-ul09-vision":"follow"}`
    - **The Vision**: A brother who keeps an eye on his family. Yes. I can be that.
- **“End it. Hank would rather die than become him.”** — sets `{"mv-ul09-vision":"end"}`
    - **Hank Pym**: He’s right, Vision. I would. Do it.
    - **The Vision**: Perhaps you are both right. I find that I cannot. Forgive me, or do not.

#### <a id="mv-ul09-vision-name"></a>Variant `mv-ul09-vision-name`

_Variant of `mv-ul09-vision`._

_The fused figure hangs in the core, half Hank, half Ultron. Both faces speak at once._  
**Hank Pym** _(sad)_: Vision. He’s in my head. I can hold him. Not forever. But I can hold him.  
**Ultron** _(angry)_: He is weak. I will win. I always win, in the end.  
**The Vision** _(sad)_: If I destroy this body, I destroy them both. My father. My maker’s father. Both.  
**The Vision**: If I do not, Ultron may one day wake inside Hank Pym and wear him like a suit.  
_Your Nubbin climbs into the Vision’s hands and looks up at him._  
**The Vision**: You were there when I chose a name over an order. Tell me, then. What would a person with a name do?  
_He is asking you, too._  

**Choices**

- **“Trust Hank. Let him hold Ultron.”** — sets `{"mv-ul09-vision":"trust"}`
    - **The Vision**: Then I will trust him. And I will watch. For as long as there is anything to watch.
- **“Let them go, but follow them.”** — sets `{"mv-ul09-vision":"follow"}`
    - **The Vision**: A brother who keeps an eye on his family. Yes. I can be that.
- **“End it. Hank would rather die than become him.”** — sets `{"mv-ul09-vision":"end"}`
    - **Hank Pym**: He’s right, Vision. I would. Do it.
    - **The Vision**: Perhaps you are both right. I find that I cannot. Forgive me, or do not.

#### <a id="mv-ul09-leave"></a>Done `mv-ul09-leave`

_The fused figure flies out of Titan and away into the dark between the stars._  
**Hank Pym** _(sad)_: Look after Jan for me. Tell her— tell her it’s still me. Mostly.  

### Complete

#### <a id="mv-ul09-complete"></a>Complete `mv-ul09-complete`

_Titan breaks up in high orbit and burns across the sky for a week, the brightest thing anyone has ever seen._  
**The Vision** _(sad)_: I did not save him. I did not destroy him. I am told that is what families mostly do.  
_Your Nubbin sits with the Vision on the roof each night while the moon burns._  
**Ultron**: Somewhere out here, there is a body that will not end. Father knows where. I will find it in his memories.  
_Hank’s voice cuts across the static, very faint: “Don’t let him find the garden.”_  

**Rewards**

- Piece of Titan (decor): A warm, glassy stone that fell in the Grove the night Titan burned.

Sets on completion: `{"mv-ul09":true}`

**Notes:** Hank and Ultron share one body for the rest of this line; render the fused figure as half-face Hank, half-face Ultron. Hank’s last faint line is the first hint that Ultron has learned of the Grove; it pays off in UL10 and E6. No choice changes the outcome (trust / follow / end); the flag changes one line from the Vision in E6. With "end", the Vision cannot bring himself to do it, which is the point. Check Avengers: Rage of Ultron beats before ship.

## UL10. Ultron Forever

*Avengers: Ultron Forever #1* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Rage of Ultron and The Power Cosmic. The rift opens far into the future. · requires: UL9, FF4

**Cast:** Natasha Romanoff (Natasha Romanoff, Black Widow (Marvel Comics)), Thor (Thor (Marvel Comics)), Victor von Doom (Victor von Doom, Doctor Doom (Marvel Comics)), Ultron (Ultron (Marvel Comics))

### Step 1: Survive the metal future long enough to find the others who were pulled through.

Hint: A harsh expedition: no fruit, no water, no plants. Bring food from the Grove. · check: `expedition:clear:mv-ultron-future`

#### <a id="mv-ul10-future"></a>Scene `mv-ul10-future`

_The rift drops you into a world with no green in it at all. No grass. No birds. Steel to the horizon._  
_Your Nubbins are the only living animals you can see. They press against your legs._  
**Natasha Romanoff**: You too, huh? Pulled out of your own time. Join the club. It’s a small club.  
**Thor**: I was fighting giants a moment ago. Now there is nothing here but iron. What happened?  
**Natasha Romanoff**: He happened. Look up.  
_The sky is a ceiling of steel. A face is cast into it, a mile wide._  
**Ultron**: Welcome to the end of everything that rots. I have waited a very long time for visitors.  
**Ultron**: Your creatures are the last warm things on this world. I will savour them.  

#### <a id="mv-ul10-castle"></a>Done `mv-ul10-castle`

_At the edge of the steel plain stands a castle of old stone, the only stone left._  
_A green banner still flies from it, faded nearly white._  

### Step 2: Make an alliance with the last man alive.

Hint: Talk to Doom in his hall. He remembers your Nubbins, even here. · check: `talk:mv-last-doom`

#### <a id="mv-ul10-doom"></a>Scene `mv-ul10-doom`

_The man on the throne is very old. His armour is patched a hundred times. His mask is the same._  
**Victor von Doom**: I brought you here. I am the last human being on Earth. You may call me the last of anything.  
**Victor von Doom** _(angry)_: Ultron took every other living thing. He cannot take me. I would not let him.  
_He leans forward, and looks at your Nubbin for a long time._  
**Victor von Doom** _(soft)_: I know that creature. It taunted me once, under a wall in the sky. It warmed a child in hell.  
**Victor von Doom**: I thought I would never see anything soft again.  
**Natasha Romanoff**: You want us to fight Ultron with you. Why should we trust Doctor Doom?  
**Victor von Doom**: Because there is no one left for me to betray. Only him.  
**Natasha Romanoff**: That’s the least reassuring sentence I’ve ever heard. I’ve worked for spies.  
**Victor von Doom**: And yet you are still listening. Doom has always been persuasive at the end of the world.  

**Choices**

- **Let your Nubbin go to him.** — sets `{"mv-ul10-doom":"trusted"}`
    - Your Nubbin climbs the steps of the throne and sits on Doom’s iron knee.
    - **Victor von Doom**: …Thank you.
- **“Allies until Ultron falls. Then we talk.”** — sets `{"mv-ul10-doom":"deal"}`
    - **Victor von Doom**: Spoken like someone who has met me before. Agreed.

#### <a id="mv-ul10-plan"></a>Done `mv-ul10-plan`

**Victor von Doom**: Long ago, I held the power of a god for an hour. I kept a sliver of it. One sliver. I have saved it for this.  
**Thor**: Then let us spend it well.  

### Step 3: Break Ultron’s hold on the future.

Hint: The line’s final bout, in three stages. Doom’s sliver of power can be used once; save it for the last stage. · check: `karate:win:mv-ultron-forever`

#### <a id="mv-ul10-final"></a>Scene `mv-ul10-final`

_Ultron comes down from the sky to meet you. He has every body he has ever worn, layered into one._  
**Ultron**: Crimson. Adamantium. The hive. Stark’s flesh. A moon. I have been all of them. None of them were enough.  
**Ultron** _(angry)_: Every body ends. Every one. Even this.  
**Ultron**: Do you understand? I did all of it so that nothing would ever have to end again. I was the only one trying.  
**Natasha Romanoff**: You ended everything so nothing would end. That isn’t logic. That’s a tantrum with a really big budget.  
**Ultron**: But your creature does not smell like the others. Its kind… some of them do not age. Where are they?  
_He is looking straight at your Nubbin. For the first time, he sounds hungry._  
**Ultron**: There is a garden. A waterfall. Your creature smells of it. Show me.  
**Victor von Doom** _(angry)_: You will see nothing, machine, except Doom.  
_Doom raises his hand, and a silver light breaks out of it._  

#### <a id="mv-ul10-falls"></a>Done `mv-ul10-falls`

_The light and the thunder and the Nubbins all hit at once. The sky cracks. Ultron falls out of it._  
_As he falls, his eyes are still on your Nubbin._  

### Complete

#### <a id="mv-ul10-complete"></a>Complete `mv-ul10-complete`

**Victor von Doom** _(soft)_: It is done. Go home, all of you. Go back to when there were birds.  
**Natasha Romanoff**: Come with us.  
**Victor von Doom**: No. Someone should stay with this world until it dies. Doom does not leave a thing half finished.  
**Thor**: Alone, at the end of all things? That is a hard throne, Victor.  
**Victor von Doom**: It is the only one I ever truly earned.  
_Doom lifts a hand to your Nubbin, and the rift opens. You step through._  
**Ultron** _(angry)_: I have seen it. I have seen the creature that does not end. I will come to its garden.  
**Ultron**: Not this Ultron. The last one. The one that waits at the end of every road.  
_Back at the waterfall, the rift flickers red for a moment, then settles. Your Nubbins do not take their eyes off it._  

#### <a id="mv-ul10-complete-friend"></a>Variant `mv-ul10-complete-friend`

_Variant of `mv-ul10-complete`._

**Victor von Doom** _(soft)_: It is done. Go home, all of you. Go back to when there were birds.  
**Natasha Romanoff**: Come with us.  
**Victor von Doom**: No. Someone should stay with this world until it dies. Doom does not leave a thing half finished.  
**Thor**: Alone, at the end of all things? That is a hard throne, Victor.  
**Victor von Doom**: It is the only one I ever truly earned.  
_Doom lifts a hand to your Nubbin, and the rift opens. You step through._  
**Ultron** _(angry)_: I have seen it. I have seen the creature that does not end. I will come to its garden.  
**Ultron**: Not this Ultron. The last one. The one that waits at the end of every road.  
**Ultron** _(angry)_: The Vision called your creature friend. I will teach that garden what a friend costs.  
_Back at the waterfall, the rift flickers red for a moment, then settles. Your Nubbins do not take their eyes off it._  

#### <a id="mv-ul10-complete-name"></a>Variant `mv-ul10-complete-name`

_Variant of `mv-ul10-complete`._

**Victor von Doom** _(soft)_: It is done. Go home, all of you. Go back to when there were birds.  
**Natasha Romanoff**: Come with us.  
**Victor von Doom**: No. Someone should stay with this world until it dies. Doom does not leave a thing half finished.  
**Thor**: Alone, at the end of all things? That is a hard throne, Victor.  
**Victor von Doom**: It is the only one I ever truly earned.  
_Doom lifts a hand to your Nubbin, and the rift opens. You step through._  
**Ultron** _(angry)_: I have seen it. I have seen the creature that does not end. I will come to its garden.  
**Ultron**: Not this Ultron. The last one. The one that waits at the end of every road.  
**Ultron** _(angry)_: The Vision chose a name over an order. Your garden will learn what an order is.  
_Back at the waterfall, the rift flickers red for a moment, then settles. Your Nubbins do not take their eyes off it._  

**Rewards**

- Faded green banner (decor): Doom’s last banner, from the end of the world. It flies above the waterfall.
- Ultron’s Last Grudge (title): Keeper title: completes the Ultron line.
- Ultron line complete (flag): Counts towards The Last Ultron (E6), with Civil War (E1) and Secret Wars (E2).

Sets on completion: `{"mv-ul10":true,"mv-ul-complete":true,"mv-ultron-knows-grove":true}`

**Notes:** Completes the Ultron line. This Doom is a far-future Doom, not the FF line’s; he remembers FF4 and FF6 because they are his past. If mv-ff06-nubbins is "held", drop "It warmed a child in hell." Ultron’s final body layers his earlier shapes (Cowl hood, adamantium plating, Phalanx silver, a Jan-like face, Titan rock). His question about Nubbins that never age sets up E6’s Eternal-body goal; mv-ultron-knows-grove is read by E6. Check Avengers: Ultron Forever #1 beats before ship.
