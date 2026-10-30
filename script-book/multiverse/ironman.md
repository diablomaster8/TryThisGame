# Multiverse: Iron Man (IM1–IM15)

## IM1. The Cave

*Tales of Suspense #39* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: Multiverse campaign started; first storyline of the Iron Man line.

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Ho Yinsen (Ho Yinsen (Tales of Suspense #39)), Wong-Chu (Wong-Chu (Tales of Suspense #39)), Guard

### Step 1: Help Yinsen and Tony plan a suit of armour in the cave.

Hint: Talk to Yinsen at the workbench; he will show you which plates matter most. · check: `talk:mv-yinsen`

#### <a id="mv-im01-cave"></a>Scene `mv-im01-cave`

_The rift spits you out into hot dust and the smell of oil. Your Nubbins land on either side of you._  
_A camp in the hills. Trucks, crates, men with rifles. Somewhere, a generator coughing._  
_A guard shoves you into a cave lit by one bulb. Two men look up from a workbench._  
**Ho Yinsen** _(think)_: More guests. Wong-Chu collects people now. Sit down, before they decide you are a problem.  
**Tony Stark**: Ignore the wires. They’re keeping me alive. Long story. Short version: a landmine, some shrapnel, bad luck.  
_A splinter of metal sits a finger’s width from his heart. The magnet in his chest holds it back._  
_Your Nubbin reaches up and taps the magnet. Tink._  
**Tony Stark**: Please don’t. That’s load-bearing.  
**Tony Stark** _(sad)_: Tony Stark. I make weapons. Made. The man outside wants one, and he wants it this week.  
**Wong-Chu** _(angry)_: Build me the weapon, Mr Stark. While you build, the doctor eats. So do your little animals.  
_He leaves. By the door sits a crate of mortar shells, stencilled STARK INDUSTRIES._  
**Tony Stark** _(sad)_: Those are mine. He shells villages with my shells. I signed off on that fuse design over lunch.  
**Ho Yinsen** _(soft)_: My village was at lunch when the shells came. Never mind. Guilt is heavy, and we have iron to lift.  
**Ho Yinsen** _(think)_: We could build what he asks. Or we could build something that walks out of here.  

**Choices**

- **Build the thing that walks.** — sets `{"mv-im01-plan":"walk"}`
    - **Tony Stark**: A suit. Plates, motors, power off the same magnet. It’s mad. I like it.
- **Can it really be done in a week?** — sets `{"mv-im01-plan":"doubt"}`
    - **Ho Yinsen**: No. So we will do it in five days.
    - **Tony Stark**: He’s funny. Nobody warned me he was funny.
- **Build him a real weapon. One that jams in a month.** — sets `{"mv-im01-plan":"decoy"}`
    - **Tony Stark**: Safer for us. And every week it works, somebody in a village pays for it.
    - **Ho Yinsen**: You see the problem. A clever weapon is still a weapon. Let us build the door instead.

#### <a id="mv-im01-cave-done"></a>Done `mv-im01-cave-done`

**Ho Yinsen**: Chest plate first. Then the legs. A man who cannot run is only a statue.  
_Tony sketches on the back of a weapons order. His hand shakes. He keeps going._  
_Yinsen hums while he files, the same four notes, over and over. Your Nubbins start humming them too._  
**Tony Stark**: Great. Now it’s a choir. If we die, at least we die in harmony.  

### Step 2: Carry the iron plates past the guards with your Power Nubbin.

Hint: Tap Do it in the Journal and catch the plates as they come. Mind the lamp; it minds you. · check: `minigame:clear:mv-cave-plates`

#### <a id="mv-im01-plates"></a>Scene `mv-im01-plates`

_The iron is in the scrap yard past the guard post. The guards count everything that goes in or out._  
**Tony Stark**: Every plate has to look like weapon parts. Anything else, and they’ll know.  
**Ho Yinsen**: Your Nubbin is strong. It can carry what I cannot, and it is small enough to be overlooked.  
_Your Power Nubbin pats a plate twice its size, as if checking whether it is ripe._  
_It tries the plate on its head, walks three steps and bongs into the wall. It tries again, slower._  
**Ho Yinsen**: Good. Now it knows where the wall is. That is engineering.  
_Night falls. The guards change every forty minutes. That is your window._  
**Tony Stark**: Twelve plates. Six trips. Nobody gets shot. That’s the whole plan.  
_Halfway across the yard, a torch swings round and lands on you._  
**Guard** _(angry)_: You. What’s the animal carrying?  

**Choices**

- **It’s a mortar casing.**
    - **Guard**: Hm. Ugly mortar.
    - He waves you on. Your Nubbin does not breathe again until the corner.
- **Offer him your fruit.**
    - He takes the fruit and forgets the question. Your Nubbin looks offended on the fruit’s behalf.

#### <a id="mv-im01-plates-done"></a>Done `mv-im01-plates-done`

_The last plate goes down on the workbench with a clang that makes everyone flinch._  
**Tony Stark** _(happy)_: That’s all of them. You did that. Your fuzzy friend did that.  

### Step 3: Hold the cave tunnel until the armour is charged.

Hint: Keep your Nubbins between the guards and the workbench; this bout is about lasting, not winning fast. · check: `karate:survive:mv-cave-guards`

#### <a id="mv-im01-charge"></a>Scene `mv-im01-charge`

_Day five. The armour stands in the corner like a stove with opinions._  
**Tony Stark**: It needs time to charge. Ninety seconds. Maybe more.  
_Boots in the tunnel. A lot of them. Wong-Chu has heard the wrong kind of hammering._  
**Ho Yinsen** _(soft)_: Ninety seconds. I can buy that.  
**Tony Stark** _(shock)_: No. Doc, no. We all walk out together. That was the deal.  
**Ho Yinsen** _(soft)_: My family is gone, Tony. I have been waiting a long time to be useful. Let me be useful.  
_He walks into the tunnel before anyone can stop him, humming his four notes. Your Nubbins press against your legs._  
**You**: Tony. The charge.  
_The needle crawls. Shouting from the tunnel, then the humming stops, and your Nubbins brace at the cave mouth._  
**Tony Stark** _(angry)_: Forty seconds. Come on, come on. I built this thing to be fast and it’s the slowest thing I’ve ever made.  

#### <a id="mv-im01-charge-done"></a>Done `mv-im01-charge-done`

_The needle reaches the end. The tunnel has gone quiet. Yinsen is lying near the entrance._  
_Tony kneels in the armour, clumsy, and lifts his head as gently as the metal hands allow._  
**Ho Yinsen** _(soft)_: Go home, Tony. Make something better than weapons.  
_He is gone. Tony stays there longer than is safe. Nobody hurries him._  

### Complete

#### <a id="mv-im01-complete"></a>Complete `mv-im01-complete`

_The armour walks out into daylight. The guards run. Wong-Chu runs fastest._  
_Behind it, the ammunition dump goes up, and the hills echo for a long time._  
**Tony Stark** _(sad)_: He bought me ninety seconds. I’m going to spend the rest of my life making them worth it.  
_Your Nubbins hum four notes on the walk to the rift. Tony doesn’t ask them to stop._  
**Tony Stark**: Here. I made a spare when we were testing magnets. Wear it near your heart. It’s a tradition now.  
_He presses a small iron pin shaped like the chest plate into your hand. It is still warm from the forge._  
_The rift opens behind you. Your Nubbins look back at the cave once before they follow you through._  

**Rewards**

- Chest-Plate Pin (cosmetic): A small iron pin shaped like Tony’s first chest plate. Worn on your Keeper’s coat.
- Yinsen’s Lamp (decor): The cave’s single bulb on a length of wire. It flickers, but it never goes out.

Sets on completion: `{"mv-im01":true}`

**Notes:** The original is set in Vietnam; keep the setting to unnamed hills and a rebel camp, no flags or nationality. Step 2 is a stealth carry minigame ("mv-cave-plates"): a Power Nubbin is best but any Nubbin can finish with more trips. Step 3 is a survive bout of three short rounds; it cannot be lost outright, only lengthened. Yinsen’s death happens off-screen in the tunnel: show only him lying still in the done scene, no wound, and let the scene sit for two seconds of silence before the last line. Sound: the generator hum under the whole cave, cut it when the armour powers up. Check Tales of Suspense #39 beats before ship. SIGNATURE CHOICE: mv-im01-plan (walk | doubt | decoy) pays off through MV_IRONMAN_VARIANTS at mv-im04-duel-done (Tony’s answer to the cameras), mv-im08-captain (the rooftop argument with Steve) and mv-im15-return (what the Superior Tony still half remembers).

## IM2. The Crimson Dynamo

*Tales of Suspense #46* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Cave (IM1). · requires: IM1

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Pepper Potts (Virginia “Pepper” Potts, later Rescue (Marvel Comics)), Anton Vanko (Anton Vanko, the Crimson Dynamo (Marvel Comics))

### Step 1: Watch the plant from the rafters with your Fly Nubbin and spot the saboteur.

Hint: Stay still on the girders; the saboteur only shows up when nothing moves. · check: `minigame:clear:mv-rafters-watch`

#### <a id="mv-im02-plant"></a>Scene `mv-im02-plant`

_Through the rift: a factory floor at night, conveyor belts stopped, sparks spitting from a fuse box._  
**Pepper Potts** _(think)_: Third plant this month. Same thing every time. The power surges and the machines tear themselves apart.  
**Tony Stark**: And every time, someone on the news says Stark can’t keep the lights on. Lovely.  
**Pepper Potts**: The police think it’s an inside job. The insurers think it’s you.  
**Tony Stark**: It isn’t lightning and it isn’t me. Something walked in here and fed the line.  
_Your Fly Nubbin is already looking up, past the lamps, into the steel rafters._  
**Tony Stark**: Your flier. Can it get up there without being seen? Whoever does this likes a view.  
**Pepper Potts**: Please don’t let it touch anything that hums.  

**Choices**

- **Go up quietly and watch.**
    - Your Nubbin climbs the air like a ladder and folds itself into a shadow on a girder.
- **Leave the lights on as bait.**
    - **Tony Stark**: Bait. I approve. Normally I’m the bait.
    - Your Nubbin settles in the dark above the brightest lamp and waits.

#### <a id="mv-im02-plant-done"></a>Done `mv-im02-plant-done`

_A red shape steps through the loading doors, gauntlets crackling. Your Nubbin squeaks once, loudly._  
**Tony Stark**: There you are. Big, red and conductive. Suit up, everybody.  

### Step 2: Beat the Crimson Dynamo in a karate bout on the factory floor.

Hint: Fight from the rubber mats; his shocks drain stamina only on bare metal. · check: `karate:win:mv-crimson-dynamo`

#### <a id="mv-im02-dynamo"></a>Scene `mv-im02-dynamo`

**Anton Vanko** _(angry)_: Stark! Your factories fall to my science. Mine is the better armour, and soon the world will know it.  
**Tony Stark**: The world is asleep. It’s three in the morning.  
_Lightning arcs between Vanko’s fists. The floor lights up blue wherever it touches._  
**Tony Stark**: Everything he throws wants to go to ground. So we give it ground. Keep your Nubbins off the metal.  
_There are rubber mats by the welding bay. Your Nubbins edge towards them._  
**Anton Vanko** _(angry)_: You are a little man in a tin. I have studied you.  
**Tony Stark**: Did you study insulation? Asking for me.  
**Anton Vanko** _(angry)_: I was given this armour, a deadline, and a photograph of my mother’s flat. Do not joke at me.  
_Tony stops joking. For a second the two men in armour look at each other like colleagues._  
_The coils on Vanko’s back are glowing too brightly. He hasn’t noticed._  

#### <a id="mv-im02-dynamo-done"></a>Done `mv-im02-dynamo-done`

_Vanko’s armour overloads and dies with a long, sad whine. He sits down heavily on the conveyor._  
**Anton Vanko** _(sad)_: It does not matter. I have failed. They will not let me go home.  

### Step 3: Stand watch at the plant gate until the car without lights leaves.

Hint: Keep a Nubbin with high Stamina by the gate; the car leaves once it sees it is being watched. · check: `guard:mv-plant-gate`

#### <a id="mv-im02-defect"></a>Scene `mv-im02-defect`

**Tony Stark**: What do you mean, they won’t let you go home?  
**Anton Vanko** _(sad)_: Men who fail are a lesson to the next men. My government has already sent the lesson.  
_A car without headlights has stopped outside the plant gates. Nobody gets out._  
**Pepper Potts** _(shock)_: Tony. There are people in that car, and they aren’t here for the tour.  
**Anton Vanko**: I did this to your factories. I would understand if you opened the door for them.  
**Tony Stark**: It’s been a long week, but I’m not handing anybody to a car with no lights.  
_Vanko looks at you, then at your Nubbins, as if one of you might explain what this is._  
_Your Nubbin hops onto the conveyor and sits next to him, close enough to share warmth._  

**Choices**

- **Tell him he’s safe here.** — sets `{"mv-im02-vanko":"welcomed"}`
    - **Anton Vanko**: Safe. Nobody has used that word about me for years.
- **Tell him he can earn his keep.** — sets `{"mv-im02-vanko":"hired"}`
    - **Anton Vanko**: Work, I understand. Give me a lab and I will make your lights stay on.
    - **Tony Stark**: Hired. Pepper, find him a lab coat. In red, obviously.
- **He wrecked three plants. Shelter him, but he answers to a judge.** — sets `{"mv-im02-vanko":"court"}`
    - **Anton Vanko**: A judge. Where I come from, that is a firing squad with paperwork.
    - **Pepper Potts**: Here it’s a lawyer and bad coffee. You’ll hate it. You’ll live.
    - **Tony Stark**: Fair’s fair. He gets a trial, not a car with no lights. Until then he sleeps on my couch.

#### <a id="mv-im02-defect-done"></a>Done `mv-im02-defect-done`

_The car idles for an hour. Then it reverses into the dark and does not come back._  
**Anton Vanko** _(soft)_: Thank you. All of you. Even the small ones.  

### Complete

#### <a id="mv-im02-complete"></a>Complete `mv-im02-complete`

**Pepper Potts**: Let me check I have this right. He blew up three factories, and now he works for us.  
**Tony Stark**: Yes. The small appliances can stay too. They’ve been very good for morale.  
**Pepper Potts**: Nubbins, Tony. They have a name.  
**Tony Stark**: For the record, I’m not good at forgiving people. I’m practising. On the expensive ones first.  
**Anton Vanko**: I will repay you in science. Your plants will be the safest in the world.  
_Vanko unscrews a burnt-out coil from his gauntlet and hands it to you._  
**Anton Vanko**: The part that failed. Keep it. It reminds a man to be humble.  
_It crackles faintly in your palm whenever your Fly Nubbin comes near._  

**Rewards**

- Dynamo Coil (item): A burnt-out coil from the Crimson Dynamo’s gauntlet. Crackles when a Fly Nubbin is near.

Sets on completion: `{"mv-im02":true}`

**Notes:** Keep Vanko’s government unnamed in dialogue; the period setting (a cold-war defector) carries it. Step 1 is a watch-and-wait minigame: the saboteur appears only after the Fly Nubbin has been still for a few seconds. Step 2’s rubber mats are safe tiles that block the shock drain. Step 3 is a timed guard: the car leaves after one in-game hour if a Nubbin is posted at the gate. Check Tales of Suspense #46 beats before ship.

## IM3. The Mandarin

*Tales of Suspense #50* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Crimson Dynamo (IM2). · requires: IM2

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), The Mandarin (The Mandarin (Marvel Comics))

### Step 1: Watch the Mandarin’s rings and learn what each one does.

Hint: Talk to Tony after each blast; he names the ring and notes its tell in your journal. · check: `talk:mv-tony:rings`

#### <a id="mv-im03-fortress"></a>Scene `mv-im03-fortress`

_The rift opens on a mountain valley, quiet in a way that feels arranged. A fortress sits at the end of it._  
**Tony Stark**: Whoever lives here has been knocking my survey planes out of the sky. I’d like to ask him why.  
_The gates swing open before you knock. Nobody is behind them._  
**The Mandarin**: Come in, Mr Stark. Bring the Keeper and the creatures. I enjoy an audience.  
_He sits on a carved throne with his hands folded. On each finger, a ring. Ten in all._  
**The Mandarin**: Your armour is clever. My rings are older than your country. Let us see which is better.  
**Tony Stark**: Or we could talk about the planes.  
**The Mandarin**: Your survey planes map my valley for your mines. Your shells fall on the villages below it.  
**The Mandarin** _(think)_: I destroy what I can see, Mr Stark. You sign a form and never look. Which of us is the monster?  
**Tony Stark**: Probably both. I’m working on my half. You’re enjoying yours.  
**The Mandarin** _(angry)_: We are talking about the planes, Mr Stark. This is how I talk.  
_The first ring flares white. Frost races across the floor towards your feet._  

**Choices**

- **Watch his hand, not the ring.** — sets `{"mv-im03-tell":"hand"}`
    - Before each blast, one finger twitches. Your Nubbin twitches with it.
- **Watch his eyes.** — sets `{"mv-im03-tell":"eyes"}`
    - He glances at his target half a second before he fires. Your Nubbin glances where he glances.

#### <a id="mv-im03-fortress-done"></a>Done `mv-im03-fortress-done`

**Tony Stark** _(think)_: Ice, flame, the black light, the beam that unmakes things. Each one winds up first. That’s our way out.  
_Your Nubbins have stopped flinching. They are counting._  

### Step 2: Win a timing bout against the Mandarin by reading each ring’s tell.

Hint: Block and dodge on the glow, not the blast; attack in the pause after each ring fires. · check: `karate:win:mv-ten-rings`

#### <a id="mv-im03-bout"></a>Scene `mv-im03-bout`

**The Mandarin**: You are not afraid. That is either courage or stupidity. Let your creature show me which.  
_He steps down from the throne and waves your Nubbin into a circle on the floor._  
**Tony Stark**: He won’t use the big ones on it. He’s showing off. Use that.  
_Flame ring: a glow at the knuckle, then the heat. Ice ring: frost on the floor first, then the blast._  
**The Mandarin**: Dodge, little one. Dodge for as long as you can.  
**Tony Stark**: He named them, by the way. The rings. He told me their names on the way in. All ten. Twice.  
**The Mandarin** _(think)_: A man should know his instruments. Do you name your missiles, Mr Stark?  
**Tony Stark**: Numbers. Which is worse, now I hear it out loud.  
**You**: Watch for the tell. Move on the tell, not on the blast.  
_Your Nubbin rolls its shoulders the way it does before a race._  
**Tony Stark**: Every ring needs a moment to come back. That moment is yours.  

#### <a id="mv-im03-bout-done"></a>Done `mv-im03-bout-done`

**The Mandarin** _(angry)_: Enough. The creature reads me like a scroll. I find I do not enjoy that.  
_He raises his hand, and this time it is the ring that unmakes things._  

### Step 3: Get behind cover and let the Mandarin open the way out himself.

Hint: Move your Nubbins to the pillar the moment the beam ring hums; the timing is the same as the bout. · check: `minigame:clear:mv-ring-dodge`

#### <a id="mv-im03-escape"></a>Scene `mv-im03-escape`

**Tony Stark**: Keeper. When I say move, get everyone behind that pillar.  
_The ring hums. The air around it bends like heat over a road._  
**The Mandarin**: This one does not freeze and does not burn. It simply removes. Goodbye, Mr Stark.  
**Tony Stark**: Before you do that. Your throne room has one door, and you locked it from outside. Bit arrogant, no?  
**The Mandarin** _(angry)_: No door holds against this ring.  
**Tony Stark**: That’s what I was counting on.  
_Tony steps in front of the great iron door. Your Nubbins are already behind the pillar._  
**Tony Stark**: Move!  

#### <a id="mv-im03-escape-done"></a>Done `mv-im03-escape-done`

_Tony drops flat. The beam passes over him and unmakes half the door._  
**Tony Stark** _(happy)_: Thank you for the exit. Lovely work, by the way.  

### Complete

#### <a id="mv-im03-complete"></a>Complete `mv-im03-complete`

_You run down the valley with the Mandarin’s fury echoing off the walls behind you._  
**Tony Stark**: I didn’t beat him. I just didn’t let him beat me. With that man, that counts.  
**Tony Stark** _(think)_: He’ll be back. People with ten rings don’t forget one door.  
_Your Nubbin has tied a strip of red cloth round its middle, torn from a banner on the way out._  
**Tony Stark**: A sash. For reading rings. You’ve earned it, small person.  
**Tony Stark** _(think)_: Can I ask you something? The bit about my shells and his villages. Was he wrong?  

**Choices**

- **He had a point. That’s why it stung.** — sets `{"mv-im03-point":"conceded"}`
    - **Tony Stark**: Yeah. Worst people always find the true thing and use it as a knife.
    - **Tony Stark**: Monday I’m reviewing every contract. Don’t tell the board. They’ll faint.
- **You walked out of a cave to stop. He walked in to start.** — sets `{"mv-im03-point":"denied"}`
    - **Tony Stark**: Generous. I’ll take it. I’ll also check the contracts, because generous isn’t the same as right.

**Rewards**

- Ring-Reader Sash (cosmetic): A strip of red banner from the Mandarin’s throne room, worn by a Nubbin that read the ten rings.

Sets on completion: `{"mv-im03":true}`

**Notes:** Avoid any caricature in the Mandarin’s look or voice: a proud, cold scholar-warlord, not a stereotype. The fortress is unnamed in dialogue. Ring tells (step 2): ice = frost creeps first; flame = knuckle glow; black light = the room dims; disintegration = a hum and bent air. The flag mv-im03-tell (hand/eyes) only changes which tell the UI highlights first. IM9 (Dragon Seed) needs this storyline. Check Tales of Suspense #50 beats before ship.

## IM4. Titanium Man

*Tales of Suspense #69–71* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Mandarin (IM3). · requires: IM3

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Pepper Potts (Virginia “Pepper” Potts, later Rescue (Marvel Comics)), Boris Bullski (Boris Bullski, the Titanium Man (Marvel Comics)), Announcer

### Step 1: Train your Run Nubbin to dodge a heavy hitter before the televised duel.

Hint: Win three dodge drills in the karate gym; dodges count for more than hits. · check: `karate:train:dodge:3`

#### <a id="mv-im04-challenge"></a>Scene `mv-im04-challenge`

_Every television in the Stark plant shows the same thing: a giant in green armour, arms folded._  
**Boris Bullski** _(angry)_: Iron Man. I am Boris Bullski. My armour is twice your size and twice your strength.  
**Boris Bullski**: Meet me before the cameras, in a neutral country. We will see whose science deserves the future.  
**Pepper Potts**: You don’t have to go. Nobody wins an argument by turning up when a man shouts on television.  
**Tony Stark**: If I don’t go, he gets to say the shouting won.  
**Pepper Potts**: Then go. It’s in your calendar. Thursday: do not fly into the sun.  
**Tony Stark**: I have never once flown into the sun.  
**Pepper Potts**: It’s a recurring entry. It’s recurring because you keep asking.  
_On the bench, two suits: the heavy one, slow but tough, and a light one, barely more than plating._  
**Tony Stark** _(think)_: He’s big. Big means slow to turn. I could match him plate for plate, or I could make him chase.  
**Tony Stark**: Keeper. You’ve fought things bigger than you. What would you do?  

**Choices**

- **Go light. Make him chase.** — sets `{"mv-im04-plan":"speed"}`
    - **Tony Stark**: My thinking exactly. I just wanted to hear it from someone sensible.
- **Let him swing until he’s worn out.** — sets `{"mv-im04-plan":"tire"}`
    - **Tony Stark**: Patience. Not my strongest suit. Pun intended.
    - **Tony Stark**: Light armour, then. You can’t wear a man out while he’s busy flattening you.

#### <a id="mv-im04-challenge-done"></a>Done `mv-im04-challenge-done`

_Your Run Nubbin ducks the swinging bag twice in a row and looks very pleased with itself._  
**Tony Stark**: Good. Now do that with a cameraman watching.  

### Step 2: Win the three-round duel against the Titanium Man.

Hint: Dodge through rounds one and two to drain his stamina; strike only in round three. · check: `karate:win:mv-titanium-man:3-rounds`

#### <a id="mv-im04-duel"></a>Scene `mv-im04-duel`

_A stadium on a border nobody owns. Cameras from every country, red lights blinking like eyes._  
**Announcer**: Three rounds. No ropes. Two suits of armour and one very nervous referee.  
**Boris Bullski** _(angry)_: Bring your little friends, Stark. They will make your defeat look sadder.  
**Tony Stark**: They’re my corner. Every fighter needs a corner. Where’s yours?  
_Bullski glances up at a glass box above the stands. Men in grey coats sit there with notebooks open._  
**Boris Bullski** _(sad)_: My corner is taking notes.  
_Your Run Nubbin takes its place by Tony’s boot, light on its feet._  
**Tony Stark**: Round one we watch. Round two we make him miss. Round three, he’s too tired to lift his arms.  
**Announcer**: Fighters ready. And… begin!  
_The ground shakes when Bullski moves. It doesn’t stop shaking._  

#### <a id="mv-im04-duel-done"></a>Done `mv-im04-duel-done`

_In round three Bullski swings, misses, and keeps going, all the way to the floor._  
**Announcer**: The bigger suit is down! The smaller suit is… waving at the camera?  
**Announcer**: Mr Stark! Half the planet is watching. Tell them whose science won tonight!  
_Up in the glass box, the men in grey coats have stopped writing._  

**Choices**

- **Let Tony say it: our side won, fair and square.** — sets `{"mv-im04-speech":"victory"}`
    - **Tony Stark**: Free people build better suits. Write that down, gentlemen in the box.
    - The crowd roars. Bullski, still on the floor, closes his eyes.
- **Tell the truth: nobody’s science won. A small suit outthought a big one.** — sets `{"mv-im04-speech":"honest"}`
    - **Tony Stark**: Nobody’s science won. He built big, I built nimble. Next year he builds nimble and beats me.
    - **Announcer**: That is… not the quote the network wanted.
- **Say nothing. Help Bullski up on camera.** — sets `{"mv-im04-speech":"helped"}`
    - Your Run Nubbin tugs at Bullski’s gauntlet while Tony takes the other arm. The cameras don’t know where to look.
    - **Boris Bullski**: This will be harder to explain than losing.

#### <a id="mv-im04-duel-done-walk"></a>Variant `mv-im04-duel-done-walk`

_Variant of `mv-im04-duel-done`._

_In round three Bullski swings, misses, and keeps going, all the way to the floor._  
**Announcer**: The bigger suit is down! The smaller suit is… waving at the camera?  
**Announcer**: Mr Stark! Half the planet is watching. Tell them whose science won tonight!  
_Up in the glass box, the men in grey coats have stopped writing._  
**Tony Stark** _(think)_: First suit I ever built ran off a car battery and a magnet, in a cave, with you holding the torch. This one’s the same idea, polished.  
**Announcer**: Mr Stark, that is not an answer to my question.  

**Choices**

- **Let Tony say it: our side won, fair and square.** — sets `{"mv-im04-speech":"victory"}`
    - **Tony Stark**: Free people build better suits. Write that down, gentlemen in the box.
    - The crowd roars. Bullski, still on the floor, closes his eyes.
- **Tell the truth: nobody’s science won. A small suit outthought a big one.** — sets `{"mv-im04-speech":"honest"}`
    - **Tony Stark**: Nobody’s science won. He built big, I built nimble. Next year he builds nimble and beats me.
    - **Announcer**: That is… not the quote the network wanted.
- **Say nothing. Help Bullski up on camera.** — sets `{"mv-im04-speech":"helped"}`
    - Your Run Nubbin tugs at Bullski’s gauntlet while Tony takes the other arm. The cameras don’t know where to look.
    - **Boris Bullski**: This will be harder to explain than losing.

#### <a id="mv-im04-duel-done-doubt"></a>Variant `mv-im04-duel-done-doubt`

_Variant of `mv-im04-duel-done`._

_In round three Bullski swings, misses, and keeps going, all the way to the floor._  
**Announcer**: The bigger suit is down! The smaller suit is… waving at the camera?  
**Announcer**: Mr Stark! Half the planet is watching. Tell them whose science won tonight!  
_Up in the glass box, the men in grey coats have stopped writing._  
**Tony Stark** _(think)_: Somebody asked me once if a suit could be built in a week. Five days, it turned out. He had a year, and look at him.  

**Choices**

- **Let Tony say it: our side won, fair and square.** — sets `{"mv-im04-speech":"victory"}`
    - **Tony Stark**: Free people build better suits. Write that down, gentlemen in the box.
    - The crowd roars. Bullski, still on the floor, closes his eyes.
- **Tell the truth: nobody’s science won. A small suit outthought a big one.** — sets `{"mv-im04-speech":"honest"}`
    - **Tony Stark**: Nobody’s science won. He built big, I built nimble. Next year he builds nimble and beats me.
    - **Announcer**: That is… not the quote the network wanted.
- **Say nothing. Help Bullski up on camera.** — sets `{"mv-im04-speech":"helped"}`
    - Your Run Nubbin tugs at Bullski’s gauntlet while Tony takes the other arm. The cameras don’t know where to look.
    - **Boris Bullski**: This will be harder to explain than losing.

#### <a id="mv-im04-duel-done-decoy"></a>Variant `mv-im04-duel-done-decoy`

_Variant of `mv-im04-duel-done`._

_In round three Bullski swings, misses, and keeps going, all the way to the floor._  
**Announcer**: The bigger suit is down! The smaller suit is… waving at the camera?  
**Announcer**: Mr Stark! Half the planet is watching. Tell them whose science won tonight!  
_Up in the glass box, the men in grey coats have stopped writing._  
**Tony Stark** _(think)_: You know what wins, Keeper? Not the weapon that jams in a month. The one that was never a weapon. You wanted the other one, once.  

**Choices**

- **Let Tony say it: our side won, fair and square.** — sets `{"mv-im04-speech":"victory"}`
    - **Tony Stark**: Free people build better suits. Write that down, gentlemen in the box.
    - The crowd roars. Bullski, still on the floor, closes his eyes.
- **Tell the truth: nobody’s science won. A small suit outthought a big one.** — sets `{"mv-im04-speech":"honest"}`
    - **Tony Stark**: Nobody’s science won. He built big, I built nimble. Next year he builds nimble and beats me.
    - **Announcer**: That is… not the quote the network wanted.
- **Say nothing. Help Bullski up on camera.** — sets `{"mv-im04-speech":"helped"}`
    - Your Run Nubbin tugs at Bullski’s gauntlet while Tony takes the other arm. The cameras don’t know where to look.
    - **Boris Bullski**: This will be harder to explain than losing.

### Complete

#### <a id="mv-im04-complete"></a>Complete `mv-im04-complete`

**Boris Bullski** _(sad)_: I had more power. More metal. How?  
**Tony Stark**: You built a suit to win an argument. I built one to get home in.  
**Boris Bullski**: And now I go home in a train with no windows. Your side wins the war of pictures, Stark.  
**Tony Stark** _(soft)_: If they come for you, there’s a guy called Vanko who knows a good couch. Think about it.  
_Pepper meets you in the tunnel with a towel she clearly brought for Tony. She hands it to your Nubbin._  
**Pepper Potts** _(happy)_: For the one who actually did the running.  
_The towel has a little armoured fist printed on it. Your Nubbin wears it round its neck all the way home._  

**Rewards**

- Ringside Towel (cosmetic): A small towel from the Titanium Man duel, worn round a Nubbin’s neck.
- Duel Bell (decor): The referee’s brass bell. Ring it in the Grove to start a friendly bout.

Sets on completion: `{"mv-im04":true}`

**Notes:** Step 2 is a three-round karate bout: the Run Nubbin is the active fighter and Tony is shown as its partner. Bullski’s stamina drops each time he misses; in round three his attacks slow by half. If mv-im04-plan is "tire", the round-two dodge window is slightly wider. The post-bout choice sets mv-im04-speech (victory / honest / helped); it is the Keeper’s voice on propaganda and changes nothing mechanical. Keep Bullski’s nationality to the period cold-war framing, no accent jokes. Check Tales of Suspense #69–71 beats before ship.

## IM5. Demon in a Bottle

*Iron Man #120–128* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Titanium Man (IM4). · requires: IM4

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Rhodey (James “Rhodey” Rhodes, later War Machine (Marvel Comics)), Bethany Cabe (Bethany Cabe (Marvel Comics)), Justin Hammer (Justin Hammer (Marvel Comics))

### Step 1: Help Bethany Cabe trace the signal that took over the armour.

Hint: Bethany waits at the embassy gate; a Fly Nubbin can trace the signal from the roof. · check: `talk:mv-bethany`

#### <a id="mv-im05-ceremony"></a>Scene `mv-im05-ceremony`

_Through the rift: a garden party at an embassy. Flags, a string quartet, a podium with a microphone._  
**Bethany Cabe**: Bethany Cabe. I run security for Stark today. You’re the ones with the creatures? Keep them off the canapés.  
_Tony is in the armour, shaking hands with the ambassador of a small country. He has a glass in the other hand._  
**Rhodey** _(think)_: That’s his third. It’s two in the afternoon.  
_Then the armour’s right hand comes up on its own. Tony stares at it._  
**Tony Stark** _(shock)_: That’s not me. Rhodey, that isn’t me—  
_The repulsor fires. The ambassador falls. The quartet stops mid-note, and for a second nobody makes a sound._  
**Bethany Cabe** _(shock)_: Down! Everybody down! Get those creatures back!  
_Your Nubbins are behind your legs. Tony stands over the body in a suit he cannot control._  

#### <a id="mv-im05-ceremony-done"></a>Done `mv-im05-ceremony-done`

**Bethany Cabe**: The signal came from out at sea. Someone with a boat and a great deal of money.  
**Rhodey** _(angry)_: I know one man with both who hates Tony. Justin Hammer.  

### Step 2: Storm Justin Hammer’s floating base with Rhodey and Bethany and shut down his transmitter.

Hint: An expedition with two Nubbins: send the quieter one to the transmitter while the other holds the gangway. · check: `expedition:clear:mv-hammer-base`

#### <a id="mv-im05-base"></a>Scene `mv-im05-base`

_Days pass. Tony is charged and waiting for a court date. The bottles collect on the counter._  
**Rhodey**: He won’t come. Says he can’t trust the armour. I think he means he can’t trust himself.  
**Bethany Cabe**: Then we go without his permission, and we bring him with us.  
**Rhodey** _(angry)_: Drag a man who’s drinking onto a raid? Bethany, that’s how people get killed.  

**Choices**

- **Bring him. He has to face Hammer himself.** — sets `{"mv-im05-raid":"brought"}`
    - You knock until he opens the door. He looks at your Nubbins, then at the boat, and gets his coat.
    - **Tony Stark**: Fine. But if I’m useless, you leave me on the boat. Promise me that.
    - Hammer’s base floats in open water: a town on stilts and pontoons, guarded by men in stolen gear.
    - **Justin Hammer**: Mr Stark! And you’ve brought nannies. I was so hoping you’d come.
    - **Justin Hammer**: Your armour runs beautifully on my signal. Perhaps next time I’ll have it shake someone else’s hand.
    - **Tony Stark**: You made me kill a man. With my own hand. You don’t get to be cheerful about that.
    - **Rhodey**: Keeper, your Nubbins are small enough to reach the transmitter. We’ll keep his hired help busy.
- **Leave the door open. Tell him where you’ll be, and go.** — sets `{"mv-im05-raid":"invited"}`
    - You leave a note under his door with a map and a drawing of a Nubbin. You sail at dusk without him.
    - An hour out, a red-and-gold shape drops onto the deck, unsteady but there.
    - **Tony Stark**: Your Nubbin draws like a toddler. It was very persuasive.
    - Hammer’s base floats in open water: a town on stilts and pontoons, guarded by men in stolen gear.
    - **Justin Hammer**: Mr Stark! And you’ve brought nannies. I was so hoping you’d come.
    - **Justin Hammer**: Your armour runs beautifully on my signal. Perhaps next time I’ll have it shake someone else’s hand.
    - **Tony Stark**: You made me kill a man. With my own hand. You don’t get to be cheerful about that.
    - **Rhodey**: Keeper, your Nubbins are small enough to reach the transmitter. We’ll keep his hired help busy.

#### <a id="mv-im05-base-done"></a>Done `mv-im05-base-done`

_Your Nubbin pulls a fistful of cables. Somewhere above you, a dish stops turning._  
**Bethany Cabe** _(happy)_: We’ve got his logs. Proof it was him. Tony’s clear.  
**Justin Hammer** _(angry)_: This is extremely rude. I had a schedule.  

### Step 3: Keep Tony company for three nights while he starts to recover.

Hint: Visit Tony each night and stay until he sleeps; like a Shadow Nubbin, he heals with patience, not speed. · check: `sit:mv-tony:3-nights`

#### <a id="mv-im05-bottle"></a>Scene `mv-im05-bottle`

_The case is dropped. Hammer’s logs are on every front page. Tony should be celebrating. He’s in the kitchen._  
_A glass, a bottle, the lights off. He doesn’t look up when you come in._  
**Tony Stark** _(sad)_: Name cleared. Fantastic. The ambassador is still dead, so forgive me if I don’t dance.  
**Tony Stark** _(sad)_: It wasn’t only the signal, you know. My hands were shaking long before Hammer touched anything.  
**Bethany Cabe** _(soft)_: Tony. I’ve watched someone I loved drink himself into a corner. I won’t watch it twice.  
_You know this look. It’s the one a Shadow Nubbin has: grey, still, waiting for the next bad thing._  
**Tony Stark** _(sad)_: I don’t know how to stop. I’ve never not known how to do something.  
_The bottle sits between you. Nobody reaches for it._  

**Choices**

- **Sit down next to him and wait.** — sets `{"mv-im05-company":"sat"}`
    - **Tony Stark**: You’re not going to lecture me?
    - **You**: No. We’re just staying.
    - You sit. Your Nubbins sit. Nobody says anything for a long time, and that turns out to be all right.
- **Tell him you’ll be here tomorrow too.** — sets `{"mv-im05-company":"promised"}`
    - **Tony Stark**: Tomorrow is a long way off.
    - **You**: Then we’ll do tonight first.
- **Offer to pour it away.** — sets `{"mv-im05-company":"offered"}`
    - **Tony Stark**: No. If somebody else pours it, I’ll just buy another. It has to be my hand.
    - After a long while he picks up the bottle and empties it into the sink himself. His hand is shaking.

#### <a id="mv-im05-bottle-done"></a>Done `mv-im05-bottle-done`

_The third night, Tony makes tea. It is terrible tea. He drinks all of it._  
**Tony Stark** _(soft)_: Day three. People say it gets easier. Bethany says it gets different. I believe her more.  

### Complete

#### <a id="mv-im05-complete"></a>Complete `mv-im05-complete`

**Rhodey**: He’s not fixed. Nobody gets fixed. But he’s talking, and that’s more than last week.  
**Bethany Cabe**: He’ll need people around him for a long time. Glad some of them have fur.  
_Tony walks you to the rift. He has a steel washer on a string, filed smooth at the edges._  
**Tony Stark** _(soft)_: I made this the first morning. Something to do with my hands. I want you to have it.  
**Tony Stark**: If I get to next year, I’ll make another. That’s the plan. One day, then the next one.  
_It is a plain thing, a little crooked. Your Nubbin holds it like treasure._  

**Rewards**

- Steel Washer (item): Tony’s hand-filed first-morning token, on a string. A plain thing that means a great deal.

Sets on completion: `{"mv-im05":true}`

**Notes:** Show a short content note before this storyline starts: it deals with alcoholism. Drinking is never played for laughs, never a minigame, never rewarded; no on-screen drinking after the first scene, only the bottle on the counter. The ambassador’s death: one flash, he falls out of frame, cut to the frozen garden; no wound. Step 3 reuses the Shadow Nubbin trust mechanic as a mirror: Tony has a trust bar that fills only while the Keeper stays in the kitchen; leaving early pauses that night but never resets progress, and there is no fail state. Step 2’s choice (mv-im05-raid: brought / invited) is about whether you can make someone recover; Tony joins the raid either way, and the Hammer arrival lines (IM5_HAMMER) play after both. The pour choice is the only one in which he pours the bottle away on screen; in the others he does it off-screen before night two. Consider a line in the pause menu pointing to real support services. Check Iron Man #120–128 beats before ship.

## IM6. Doomquest

*Iron Man #149–150* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Demon in a Bottle (IM5) and Doom’s First Strike (FF2). · requires: IM5, FF2

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Victor von Doom (Victor von Doom, Doctor Doom (Marvel Comics)), King Arthur (King Arthur as drawn in Iron Man #149–150 (Marvel Comics)), Morgan le Fay (Morgan le Fay (Marvel Comics))

### Step 1: Speak with King Arthur and learn what Doom wants in Camelot.

Hint: Arthur holds court in the great hall; Doom has already ridden for Morgan le Fay’s tower. · check: `talk:mv-arthur`

#### <a id="mv-im06-platform"></a>Scene `mv-im06-platform`

_The rift sets you down in the Latverian embassy in New York, which is technically Latveria, Doom will remind you._  
**Tony Stark**: Doom bought a crate of my microcircuits through three shell companies. I’m here to take them back.  
**Victor von Doom** _(angry)_: Stark. You enter my house with your pets and accuse me of shopping. Doom does not shop. Doom acquires.  
**Tony Stark**: Through three shell companies. One of them was called Totally Normal Imports.  
**Victor von Doom**: My ministers name the companies. I have spoken to them about it.  
_Behind him stands a round platform crowded with dials. Your Nubbins have seen it before, beyond another gate._  
**Victor von Doom**: The circuits power this. This takes me where I need to go. Stand aside.  
**Tony Stark**: Not with my circuits, it doesn’t.  
_Tony fires at the controls. Doom lunges. The platform howls, and the room fills with white light._  
_When it clears there is grass under your feet, a castle on a hill, and a knight lowering a lance at you._  
**King Arthur**: Hold! Strangers in iron, and one in green. Name yourselves before the king of Camelot.  

**Choices**

- **Tell him the truth: you came through a door in time.**
    - **King Arthur**: Merlin speaks of such doors. I never believed him. I am learning to.
- **Bow, and let Tony do the talking.**
    - **Tony Stark**: Tony Stark, Your Majesty. Engineer. These are my associates. The small ones bite.
    - **King Arthur**: Then they will fit in here very well.

#### <a id="mv-im06-platform-done"></a>Done `mv-im06-platform-done`

**King Arthur**: Your green-masked friend rode for my sister’s tower. Morgan le Fay. She is sorcery, and he wants it.  
**Tony Stark**: Not my friend. Very much not my friend.  

### Step 2: Win the race on Camelot’s jousting course with your Nubbin among the knights.

Hint: The lists are a racing course; Run and Stamina matter, and the knights’ horses slow on the turns. · check: `race:win:mv-camelot-lists`

#### <a id="mv-im06-lists"></a>Scene `mv-im06-lists`

_Morgan’s army marches at dawn. Tonight the knights ride the lists to choose who leads the charge._  
**King Arthur**: They tell me your creature rides well. Will it ride for Camelot?  
_A crow lands on the fence of the lists and speaks in a woman’s voice, sweet and cold._  
**Morgan le Fay** _(angry)_: Ride all you like, brother. My soldiers never tire. They stopped breathing centuries ago.  
**King Arthur** _(sad)_: My sister. She has never once arrived by the door.  
_Your Nubbin is lifted onto a pony wearing a saddle the size of a teacup._  
**Tony Stark**: The course has fences, a water jump and a very large knight called Sir Something. Go round him.  
**King Arthur** _(happy)_: Sir Bors. He will be offended, but he is always offended.  

#### <a id="mv-im06-lists-done"></a>Done `mv-im06-lists-done`

_Your Nubbin crosses the line first, pony and all, to a roar from the stands._  
**King Arthur** _(happy)_: The small knight leads the charge. I have heard stranger prophecies.  

### Step 3: Hold the hill against Morgan le Fay’s army with Tony, Doom and Arthur’s knights.

Hint: A karate bout against waves of the dead; Doom’s blasts clear the field every third round. · check: `karate:win:mv-morgan-dead`

#### <a id="mv-im06-truce"></a>Scene `mv-im06-truce`

_Dawn. Morgan’s dead come over the hill in silent rows, armour rusted, eyes like candle smoke._  
_Doom walks out ahead of them. He is not marching with them. He looks furious._  
**Victor von Doom** _(angry)_: The witch made promises. She keeps none of them. She wants my platform for herself.  
**Tony Stark**: What did she promise you? Doom doesn’t ride across a century for a cookery lesson.  
**Victor von Doom** _(sad)_: Sorcery older than Merlin. Enough to reach one soul in a place no machine can reach.  
**Victor von Doom**: That is all you will hear of it. Repeat it, and I will deny it, and then I will destroy you.  
**Victor von Doom**: I cannot get home without your circuits, Stark. You cannot get home without my platform.  
**Tony Stark**: So it’s a truce.  
**Victor von Doom**: It is an arrangement. Doom does not make truces.  
**King Arthur**: Call it what you like. Help us hold the hill and I will call it friendship.  
_Your Nubbins stand either side of you, looking from the armour to the mask and back._  

**Choices**

- **Shake Doom’s hand.** — sets `{"mv-im06-truce":"shook"}`
    - Doom looks at your hand for a long moment. Then he shakes it once, as if signing something.
    - **Victor von Doom**: Remember this, Keeper. I will.
- **Just nod.** — sets `{"mv-im06-truce":"nodded"}`
    - **Victor von Doom**: Wise. Never touch what you cannot read.
- **No deal. He courted the witch. He doesn’t get to be a hero by switching sides.** — sets `{"mv-im06-truce":"refused"}`
    - **King Arthur**: Then do not call him ally. Call him a sword that happens to point the same way today.
    - **Victor von Doom**: The Keeper is right to refuse me. It changes nothing. I fight because I want to go home.

#### <a id="mv-im06-truce-done"></a>Done `mv-im06-truce-done`

_Morgan’s spell breaks. The dead lie down in the grass and stay down._  
**Morgan le Fay** _(angry)_: Run home, both of you. Camelot will have forgotten you by supper.  

### Complete

#### <a id="mv-im06-complete"></a>Complete `mv-im06-complete`

_Doom’s platform hums back to life with Tony’s circuits wired in, two pairs of hands on one panel._  
_You watch Doom’s fingers drift to a second dial, the one marked for a single traveller._  
**Tony Stark**: I rewired that one last night. It only goes if we all go. I know you, Victor.  
**Victor von Doom**: A precaution. Doom tests his allies. You passed. Do not mistake this for friendship, Stark.  
**Tony Stark**: Wouldn’t dream of it. You’d have to be fun.  
**King Arthur**: Take this, small knight. Every rider of the lists carries one home.  
_He gives your Nubbin a pennant, a gold crown on blue. Then the light swallows Camelot._  
_You land back in New York. Doom is already gone. So is half the embassy furniture._  

**Rewards**

- Camelot Pennant (decor): Arthur’s blue-and-gold pennant from the lists. Hangs on a Grove fence post.
- Teacup Saddle (cosmetic): The tiny saddle your Nubbin rode in Camelot. Decorative only; please do not ride your Nubbin.

Sets on completion: `{"mv-im06":true}`

**Notes:** Needs FF2: Doom’s time platform is introduced there, and the line about your Nubbins having seen it before depends on it. Speaker id "doom" matches the Doom line. Step 2 is the Lists, a Camelot reskin of a standard race course with fences and a water jump; the pony is cosmetic, stats are the Nubbin’s own. Morgan appears as a crow in step 2 and as a voice only in step 3. If mv-im06-truce is "shook", Secret Wars (E2) can call back to the handshake; "refused" plays the same bout. Doom’s hint about reaching a soul foreshadows his mother (FF5, FF7); never name her here. Required for Secret Wars. Check Iron Man #149–150 beats before ship.

## IM7. Iron Monger

*Iron Man #163–200* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Doomquest (IM6). · requires: IM6

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Rhodey (James “Rhodey” Rhodes, later War Machine (Marvel Comics)), Bethany Cabe (Bethany Cabe (Marvel Comics)), Obadiah Stane (Obadiah Stane, the Iron Monger (Marvel Comics))

### Step 1: Find out where Tony has gone.

Hint: Talk to Rhodey at the hangar; he knows the last place Tony was seen. · check: `talk:mv-rhodey`

#### <a id="mv-im07-siege"></a>Scene `mv-im07-siege`

_A boardroom high over the city. Through the window, the Stark International sign is coming down letter by letter._  
**Obadiah Stane** _(happy)_: Obadiah Stane. I buy things, Keeper. Shares, debts, people. This week I bought Tony Stark’s company.  
**Obadiah Stane**: I didn’t have to fight him. I only had to wait for him to fight himself. He’s losing.  
_Two of his men are building a house of cards on the table. Stane flicks it over without looking._  
**Rhodey** _(sad)_: Tony was sober for months after the embassy. Then something knocked him over again. Three days, no answer.  
**Bethany Cabe** _(sad)_: He told me he’d rather be useless alone than useless watched.  
**Bethany Cabe**: Stane went after every friend Tony has. Debts called in. Threats. He’s pulling up the floor one board at a time.  
**Obadiah Stane**: Go and look for him if you like. I’d start low.  
**Obadiah Stane**: You think I’m the villain, Keeper. I’m a man who read the accounts. He was drinking the company into the sea.  
**Bethany Cabe** _(angry)_: And you held the bottle out. Don’t dress it up as auditing.  
**Rhodey**: Somebody has to wear the armour while he’s gone. Stane’s people are already testing the doors.  

**Choices**

- **Go and find Tony.**
    - **Rhodey**: Go. I’ll hold the fort. Bring him back if he’ll come.
- **Help Rhodey into the armour first.**
    - The helmet is tight on Rhodey and gives him headaches. He wears it anyway.
    - **Rhodey**: It’s heavier than Tony makes it look. Now go and find him.

#### <a id="mv-im07-siege-done"></a>Done `mv-im07-siege-done`

**Rhodey**: Last sighting was the docks. In January. Take a coat, and take something warm for him.  
_Your Nubbins pack fruit without being asked._  

### Step 2: Help Tony rebuild a suit from nothing in the workshop Rhodey has found.

Hint: Gather scrap with your Nubbins and craft the Silver Centurion plates; each piece needs a different stat. · check: `craft:mv-silver-centurion`

#### <a id="mv-im07-street"></a>Scene `mv-im07-street`

_Snow on the docks. A fire in an oil drum. A handful of people huddled close to it, saying nothing._  
_One of them has a beard weeks old and a coat that used to be expensive._  
**Tony Stark** _(sad)_: Oh. It’s you. The zoo. Did Rhodey send you, or did you come to see how far down it goes?  
**Tony Stark**: It goes down a long way. I keep finding new floors.  
_A woman by the fire is shivering worse than the rest. Tony takes off his coat and puts it round her without a word._  
**Tony Stark**: Don’t tell anyone. I have a reputation for being useless now. I’m protecting it.  
_Your Nubbin puts a fruit in his hand. He holds it a long time before he eats it._  
**Tony Stark**: I can’t do it again. Build it all again. Stane took everything I was good at.  

**Choices**

- **He didn’t take your hands.**
    - **Tony Stark**: My hands. Yinsen asked me to make something better than weapons with them. I haven’t yet.
    - He looks at his hands as if they belong to someone he used to like.
- **Say nothing. Stay by the fire.**
    - You stay. The fire burns down. Around midnight, Tony stands up.
    - **Tony Stark**: Fine. One more floor. But this time I’m going up.

#### <a id="mv-im07-street-done"></a>Done `mv-im07-street-done`

_Weeks pass. Tony is sober again, thin and quiet, and the new armour gleams red and silver on the bench._  
_The woman from the oil drum works the bellows now, still wearing his coat. He has stopped asking for it back._  
**Tony Stark** _(happy)_: The old suit was made by a man with money. This one was made by a man with friends. It’s better.  

### Step 3: Defeat Obadiah Stane’s Iron Monger armour.

Hint: A karate bout; the Iron Monger hits hard but turns slowly, so keep moving and strike from behind. · check: `karate:win:mv-iron-monger`

#### <a id="mv-im07-monger"></a>Scene `mv-im07-monger`

_Stane comes to the workshop himself, in armour twice Tony’s size, grey and heavy as a bank vault._  
**Obadiah Stane** _(angry)_: Iron Monger. I took your company, Stark. I took your money. Now I take the last thing.  
_Stane’s people have hurt those close to Tony. Rhodey is bruised. Bethany’s arm is in a sling. Nobody has forgotten._  
**Rhodey**: I’ve worn that suit for months, Tony. I know how he moves. I can take him.  
**Tony Stark**: It’s my name on everything he wrecked. I want to be the one who ends it.  
**Tony Stark**: Keeper, you’ve seen us both at our worst. You choose. Who goes in?  
_Two racks. Rhodey’s old armour and the Silver Centurion. Two men who both mean it._  
**Obadiah Stane**: Take your time. I bill by the hour.  

**Choices**

- **Tony. It’s his fight.** — sets `{"mv-im7-suit":"tony"}`
    - **Rhodey**: Fair. Go and get it back, man.
    - Tony seals the Silver Centurion. Rhodey stands at his shoulder, ready to step in.
- **Rhodey. He’s been carrying it.** — sets `{"mv-im7-suit":"rhodey"}`
    - **Tony Stark**: He has. He carried me too.
    - Rhodey seals the Silver Centurion. Tony takes the workshop controls and talks him through every move.

#### <a id="mv-im07-monger-done"></a>Done `mv-im07-monger-done`

_The Iron Monger falls to its knees. The helmet comes off. Stane looks small inside it._  
**Obadiah Stane**: You won’t get to watch me in a cell, Stark. I won’t give you that.  
_Before anyone can reach him, Stane turns his own weapon on himself. A flash, and then nothing._  

### Complete

#### <a id="mv-im07-complete"></a>Complete `mv-im07-complete`

_Nobody cheers. The workshop is very quiet._  
**Tony Stark** _(sad)_: I wanted him beaten. I didn’t want this.  
**Rhodey** _(soft)_: He chose it. That isn’t on you. I’ll keep saying it until you believe me.  
_Later, Tony cuts a small badge from the spare silver plate and pins it on your Nubbin._  
**Tony Stark** _(soft)_: For the one who brought me fruit on the docks. I never said thank you. Thank you.  
_Outside, someone is putting up a new sign. It doesn’t say Stark yet. It might, one day._  

**Rewards**

- Silver Centurion Badge (cosmetic): A red-and-silver badge cut from the spare armour plate. Worn by a Nubbin.

Sets on completion: `{"mv-im07":true}`

**Notes:** Choice in step 3 sets mv-im7-suit ("tony" or "rhodey"): the bout is the same either way, but the fighter portrait and the armour sprite change, and later content (IM11, Civil War, The Last Ultron) reads it. Show a short content note before step 3 (relapse, homelessness, a suicide). Stane’s death follows the comic but is never shown: on the third done line, a white flash fills the screen, then cut to black for two seconds before the complete scene. No body, no sound effect beyond a dull thump. The relapse in step 1 is reported, not shown. IM11 needs this storyline. Check Iron Man #163–200 beats before ship.

## IM8. Armor Wars

*Iron Man #225–232* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Iron Monger (IM7). · requires: IM7

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Rhodey (James “Rhodey” Rhodes, later War Machine (Marvel Comics)), Steve Rogers (Steve Rogers, Captain America (Marvel Comics)), Guardsman (The Guardsmen of the Vault (Marvel Comics))

### Step 1: Help Tony plant negators on the stolen armours.

Hint: A stealth minigame: your Nubbins slip the chips onto suits while Tony draws fire; small Nubbins are harder to spot. · check: `minigame:clear:mv-negator-run`

#### <a id="mv-im08-stolen"></a>Scene `mv-im08-stolen`

_Tony’s new workshop. A wall of screens, each one showing a different armoured crook in mid-flight._  
**Tony Stark** _(angry)_: Look at the chest plates. The gauntlets. The power couplings. That’s mine. That’s all mine.  
**Rhodey**: Someone broke in, copied the designs and sold them on. Justin Hammer did the selling. Of course he did.  
**Tony Stark**: Half the crooks in the country are flying on my work. Every time one of them hurts someone, it’s my design doing it.  
_Tony slides a small black box across the bench. Inside is a chip the size of a fingernail._  
**Tony Stark**: A negator. Stick it on any suit built from my tech and it shuts down for good.  
**Rhodey** _(think)_: Some of those suits belong to the government. To guards. To people who think they’re the good guys.  
**Tony Stark**: Then they’re good guys with stolen goods. I’m taking it all back. Legal or not.  

**Choices**

- **We’re with you.** — sets `{"mv-im08-stance":"with-tony"}`
    - **Tony Stark**: Good. I hoped you’d say that, because I’ve already packed your Nubbins a lunch.
- **We’ll come. But this could go badly.** — sets `{"mv-im08-stance":"doubts"}`
    - **Tony Stark**: It could. Come anyway, and tell me when it does. I need someone who will.

#### <a id="mv-im08-stolen-done"></a>Done `mv-im08-stolen-done`

_Stingray, a marine scientist in a suit with Stark wiring, drops out of the sky into the sea, shouting._  
**Rhodey** _(shock)_: Tony, Stingray isn’t a crook. He’s on our side. Was.  
**Tony Stark** _(sad)_: He was wearing my work. I’ll apologise later.  

### Step 2: Get through the Vault and shut down the Guardsmen’s armour without letting a single prisoner out.

Hint: An expedition: send one Nubbin to hold the cell-block switches while the other follows Tony. · check: `expedition:clear:mv-the-vault`

#### <a id="mv-im08-vault"></a>Scene `mv-im08-vault`

_The Vault: a prison for super-powered criminals, guarded by men in green armour called the Guardsmen._  
**Tony Stark**: Their suits are mine too. Licensed once, years ago. Copied since. I’m switching them off.  
**Guardsman** _(angry)_: Stark, stand down! We keep the worst people on Earth behind these walls!  
**Tony Stark**: With my armour. Without asking me. That’s the problem.  
**Guardsman**: Stand down, Stark. That is an order.  
**Tony Stark**: By what authority?  
**Guardsman**: Yours, technically. It’s on the label.  
_By the big red lever, a guard asks your Nubbin very politely to let go. It does not._  
_Alarms. Cell doors stutter as the power flickers. Inside, prisoners start to shout._  
**You**: Tony, if the guards go down, who keeps the doors shut?  
**Tony Stark** _(shock)_: I— I hadn’t got as far as that part.  
**Guardsman** _(angry)_: Then think fast, because you’re not getting past us.  

**Choices**

- **Send a Nubbin to hold the cell power. Slower, but the doors stay shut.** — sets `{"mv-im08-vault":"held"}`
    - **Tony Stark**: Slower means the guards get longer to hurt us. Fine. Fine! Better us than the city.
    - Your Nubbin wraps itself round the big red lever and glares at anyone who comes near it.
- **Go fast. The faster the suits drop, the fewer guards get hurt.** — sets `{"mv-im08-vault":"fast"}`
    - **Guardsman**: And if the doors fail, who goes back in after what comes out? You?
    - **Tony Stark**: If they fail, yes. Me. That’s the deal I’m making with myself.

#### <a id="mv-im08-vault-done"></a>Done `mv-im08-vault-done`

_The Guardsmen’s suits go dark. The cell doors hold, just. One guard is carried out on a stretcher._  
**Tony Stark** _(sad)_: He’ll live. They told me he’ll live. I keep asking anyway.  

### Step 3: Hold off Steve Rogers on the Vault roof until Tony can get away.

Hint: A survive bout; Steve blocks almost everything, so stay out of reach of the shield. · check: `karate:survive:mv-steve-rogers`

#### <a id="mv-im08-captain"></a>Scene `mv-im08-captain`

_On the roof of the Vault, a man with a round shield is waiting._  
**Steve Rogers**: Tony. You know why I’m here. You’re finished.  
**Tony Stark**: I’m nearly finished. Two more suits.  
**Steve Rogers** _(angry)_: You attacked the government’s guards. You wrecked an innocent man’s armour. There are rules, and you’re standing on them.  
**Tony Stark** _(angry)_: Every rule I followed got people hurt with my designs. I’m done asking permission.  
**Steve Rogers**: Then I’m done asking you to stop.  
**Steve Rogers**: If every man with a good reason gets to break the law, Tony, then the next man’s reason is just as good.  
**Tony Stark** _(angry)_: And if the law lets my work kill people while it fills in forms, then the law can wait for me.  
_The shield comes up. Your Nubbins look at you. Nobody has ever asked them to fight a friend before._  
**Rhodey** _(sad)_: This is going to come back on all of us one day. You know that, right?  

**Choices**

- **Steve’s right. Nobody gets to decide which laws count.** — sets `{"mv-im08-roof":"steve"}`
    - **Steve Rogers**: Then why are you standing on his side of the roof?
    - **You**: Because he’s my friend and he’s about to get hurt. Being right doesn’t change that.
- **Tony’s right. A rule that arms his enemies isn’t a rule worth keeping.** — sets `{"mv-im08-roof":"tony"}`
    - **Steve Rogers**: Maybe. But you don’t get to be judge and jury and the man with the most expensive suit.
    - **Tony Stark**: He’s been saving that one up.

#### <a id="mv-im08-captain-walk"></a>Variant `mv-im08-captain-walk`

_Variant of `mv-im08-captain`._

_On the roof of the Vault, a man with a round shield is waiting._  
**Steve Rogers**: Tony. You know why I’m here. You’re finished.  
**Tony Stark**: I’m nearly finished. Two more suits.  
**Steve Rogers** _(angry)_: You attacked the government’s guards. You wrecked an innocent man’s armour. There are rules, and you’re standing on them.  
**Tony Stark** _(angry)_: Every rule I followed got people hurt with my designs. I’m done asking permission.  
**Steve Rogers**: Then I’m done asking you to stop.  
**Steve Rogers**: If every man with a good reason gets to break the law, Tony, then the next man’s reason is just as good.  
**Tony Stark** _(angry)_: And if the law lets my work kill people while it fills in forms, then the law can wait for me.  
_The shield comes up. Your Nubbins look at you. Nobody has ever asked them to fight a friend before._  
**Tony Stark** _(sad)_: In the cave we built a door, not a weapon. I keep telling myself these suits are the door.  
**Steve Rogers**: A door fifty people walked through with your name on it, Tony.  
**Rhodey** _(sad)_: This is going to come back on all of us one day. You know that, right?  

**Choices**

- **Steve’s right. Nobody gets to decide which laws count.** — sets `{"mv-im08-roof":"steve"}`
    - **Steve Rogers**: Then why are you standing on his side of the roof?
    - **You**: Because he’s my friend and he’s about to get hurt. Being right doesn’t change that.
- **Tony’s right. A rule that arms his enemies isn’t a rule worth keeping.** — sets `{"mv-im08-roof":"tony"}`
    - **Steve Rogers**: Maybe. But you don’t get to be judge and jury and the man with the most expensive suit.
    - **Tony Stark**: He’s been saving that one up.

#### <a id="mv-im08-captain-doubt"></a>Variant `mv-im08-captain-doubt`

_Variant of `mv-im08-captain`._

_On the roof of the Vault, a man with a round shield is waiting._  
**Steve Rogers**: Tony. You know why I’m here. You’re finished.  
**Tony Stark**: I’m nearly finished. Two more suits.  
**Steve Rogers** _(angry)_: You attacked the government’s guards. You wrecked an innocent man’s armour. There are rules, and you’re standing on them.  
**Tony Stark** _(angry)_: Every rule I followed got people hurt with my designs. I’m done asking permission.  
**Steve Rogers**: Then I’m done asking you to stop.  
**Steve Rogers**: If every man with a good reason gets to break the law, Tony, then the next man’s reason is just as good.  
**Tony Stark** _(angry)_: And if the law lets my work kill people while it fills in forms, then the law can wait for me.  
_The shield comes up. Your Nubbins look at you. Nobody has ever asked them to fight a friend before._  
**Steve Rogers**: Rhodey told me about the cave. Five days, with a magnet and a car battery. Nothing stops you. That’s what frightens me.  
**Tony Stark** _(sad)_: It should. It frightens me.  
**Rhodey** _(sad)_: This is going to come back on all of us one day. You know that, right?  

**Choices**

- **Steve’s right. Nobody gets to decide which laws count.** — sets `{"mv-im08-roof":"steve"}`
    - **Steve Rogers**: Then why are you standing on his side of the roof?
    - **You**: Because he’s my friend and he’s about to get hurt. Being right doesn’t change that.
- **Tony’s right. A rule that arms his enemies isn’t a rule worth keeping.** — sets `{"mv-im08-roof":"tony"}`
    - **Steve Rogers**: Maybe. But you don’t get to be judge and jury and the man with the most expensive suit.
    - **Tony Stark**: He’s been saving that one up.

#### <a id="mv-im08-captain-decoy"></a>Variant `mv-im08-captain-decoy`

_Variant of `mv-im08-captain`._

_On the roof of the Vault, a man with a round shield is waiting._  
**Steve Rogers**: Tony. You know why I’m here. You’re finished.  
**Tony Stark**: I’m nearly finished. Two more suits.  
**Steve Rogers** _(angry)_: You attacked the government’s guards. You wrecked an innocent man’s armour. There are rules, and you’re standing on them.  
**Tony Stark** _(angry)_: Every rule I followed got people hurt with my designs. I’m done asking permission.  
**Steve Rogers**: Then I’m done asking you to stop.  
**Steve Rogers**: If every man with a good reason gets to break the law, Tony, then the next man’s reason is just as good.  
**Tony Stark** _(angry)_: And if the law lets my work kill people while it fills in forms, then the law can wait for me.  
_The shield comes up. Your Nubbins look at you. Nobody has ever asked them to fight a friend before._  
**Tony Stark** _(sad)_: Keeper, in the cave you wanted to build the man a weapon that jammed. These don’t jam. That’s the whole trouble with me.  
**Steve Rogers**: Then build the one that stops. That’s all I’m asking.  
**Rhodey** _(sad)_: This is going to come back on all of us one day. You know that, right?  

**Choices**

- **Steve’s right. Nobody gets to decide which laws count.** — sets `{"mv-im08-roof":"steve"}`
    - **Steve Rogers**: Then why are you standing on his side of the roof?
    - **You**: Because he’s my friend and he’s about to get hurt. Being right doesn’t change that.
- **Tony’s right. A rule that arms his enemies isn’t a rule worth keeping.** — sets `{"mv-im08-roof":"tony"}`
    - **Steve Rogers**: Maybe. But you don’t get to be judge and jury and the man with the most expensive suit.
    - **Tony Stark**: He’s been saving that one up.

#### <a id="mv-im08-captain-done"></a>Done `mv-im08-captain-done`

_Tony’s boots fire and he is gone, out over the sea. Steve lowers the shield and watches him go._  
**Steve Rogers** _(sad)_: He isn’t wrong about the designs. He’s wrong about almost everything else. Keep an eye on him.  

### Complete

#### <a id="mv-im08-complete"></a>Complete `mv-im08-complete`

**Tony Stark** _(sad)_: Every suit’s off. My designs are mine again. I lost a lot of friends doing it.  
**Tony Stark**: The government says I’m a menace. Steve says I’m a menace. I say I’m tidy.  
**Rhodey** _(think)_: One day someone’s going to write a law about people like you. I hope you’re on the right side of it.  
_Tony gives you a spare negator chip, switched off, on a little chain._  
**Tony Stark**: A souvenir. Don’t stick it on anything. I mean it. Not even the toaster.  

**Rewards**

- Spent Negator (item): A dead negator chip on a chain, from the Armor Wars. Harmless, and a little guilty-looking.

Sets on completion: `{"mv-im08":true}`

**Notes:** Sets up Civil War: mv-im08-stance and mv-im08-roof (steve / tony, the Keeper’s view on the law) are soft flags Civil War can echo; mv-im08-vault (held / fast) only changes the expedition’s timer and guard count. In the comic Steve fights as "the Captain" in black, but here CA7 (The Captain) needs IM8, so Steve appears as Captain America with the flag and shield; do not reference the black suit. The injured Guardsman lives; keep the stretcher shot brief. Step 3 is a survive bout of three rounds, and Steve never presses for a knockout. CA7 needs this storyline. Check Iron Man #225–232 beats before ship.

## IM9. The Dragon Seed Saga

*Iron Man #270–275* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Armor Wars (IM8). The Mandarin (IM3) must be finished. · requires: IM8, IM3

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), The Mandarin (The Mandarin (Marvel Comics)), Fin Fang Foom (Fin Fang Foom (Marvel Comics))

### Step 1: Meet the Mandarin at the edge of the dragons’ lake.

Hint: Follow the rift to the valley; the Mandarin waits on the shore with the ten rings. · check: `talk:mv-mandarin:alliance`

#### <a id="mv-im09-call"></a>Scene `mv-im09-call`

_Something comes through the rift on its own: a small jade ring, rolling to a stop at your feet._  
**The Mandarin** _(sad)_: Stark. Keeper. I would rather swallow my rings than ask you this. I am asking anyway.  
**The Mandarin**: The dragons I woke beneath the valley were never my servants. They were waiting for me to open the door.  
**The Mandarin**: Fin Fang Foom and his kind. They mean to take this world, and they have no further use for me.  
**Tony Stark**: You raised dragons and they turned on you. I’m trying very hard not to enjoy this.  
**The Mandarin** _(angry)_: Enjoy it later. Help me now, and I swear on the rings I will owe you.  
_Your Nubbins look at the ring at your feet, then at you. One of them has gone a little pale._  
**Tony Stark**: We’re not doing this for him. We’re doing it because there are dragons. Agreed?  

**Choices**

- **Agreed. For the dragons.**
    - **Tony Stark**: For the dragons. Note to self: never say that sentence again.
- **Make him promise to stand down afterwards.** — sets `{"mv-im09-promise":true}`
    - **The Mandarin**: Afterwards? Very well. If there is an afterwards.
    - **Tony Stark**: That isn’t a yes, but it isn’t a fireball either.

#### <a id="mv-im09-call-done"></a>Done `mv-im09-call-done`

_The lake is black and very still. Bubbles break the surface, each one the size of a house._  
**The Mandarin**: They rise from the bottom. Their seed is down there. Break the chamber and they lose their strength.  

### Step 2: Dive the dragons’ lake with your Swim Nubbin and crack the seed chamber.

Hint: A dive minigame; surface for air at the light beams, and a high Swim stat lets you hold your breath longer. · check: `minigame:clear:mv-dragon-lake`

#### <a id="mv-im09-lake"></a>Scene `mv-im09-lake`

**Tony Stark**: The armour sinks like a fridge. I can’t go down there. Something small that swims well can.  
_Your Swim Nubbin is already at the edge, dipping one foot in, very serious about it._  
**The Mandarin**: The chamber is in the old temple at the bottom. The dragon seed glows green. Touch nothing else.  
**The Mandarin**: My ring of light will show it the way. Do not tell anyone I helped a creature.  
_A soft beam from the Mandarin’s hand cuts down through the water. Something huge moves across it._  
**Tony Stark** _(shock)_: That was a tail. That was definitely a tail.  
**You**: In and out. Fast. Don’t look at the tail.  
_Your Nubbin takes one enormous breath, puffs up to twice its size, and goes under._  

#### <a id="mv-im09-lake-done"></a>Done `mv-im09-lake-done`

_A green glow below, then a crack you feel in your teeth. Your Nubbin bursts back up, gasping and proud._  
**The Mandarin**: The seed is broken. Now they are only very large animals.  

### Step 3: Defeat Fin Fang Foom with Tony and the Mandarin.

Hint: A karate bout with the Mandarin’s rings as support; stay on the shore so Foom can’t drag you under. · check: `karate:win:mv-fin-fang-foom`

#### <a id="mv-im09-foom"></a>Scene `mv-im09-foom`

_Fin Fang Foom rises out of the lake, scales green as old bronze, water pouring off him like a waterfall._  
**Fin Fang Foom** _(angry)_: Little ring-bearer. You woke me and thought you would be my master. You are not even my supper.  
**Fin Fang Foom**: I slept an age under that lake, and the first thing I hear is two small men bickering about who fires first.  
**Tony Stark**: In fairness, he started it. Years ago. In a throne room.  
**The Mandarin**: Stark. Now.  
**Tony Stark**: You know, I always assumed if I fought a dragon it’d be on my own terms.  
_The Mandarin fires every ring at once. Tony fires everything the armour has. Your Nubbins dodge the tail._  
**Fin Fang Foom** _(angry)_: Your fire is a candle to me.  
**Tony Stark**: Then let’s see how you do away from your lake. Keeper, keep him on the shore.  
_Foom roars. The valley shakes. Behind him the other dragons watch to see who wins._  

#### <a id="mv-im09-foom-done"></a>Done `mv-im09-foom-done`

_Foom sinks, beaten, and the other dragons scatter into the mountains._  
**The Mandarin** _(angry)_: Now, Stark. The dragons are gone, and there is only one enemy left in this valley.  
_The Mandarin fires first. All ten rings glow, and he turns them on Tony._  

#### <a id="mv-im09-foom-done-mv-im09-promise"></a>Variant `mv-im09-foom-done-mv-im09-promise`

_Variant of `mv-im09-foom-done`._

_Foom sinks, beaten, and the other dragons scatter into the mountains._  
**The Mandarin** _(angry)_: Now, Stark. The dragons are gone, and there is only one enemy left in this valley.  
**Tony Stark** _(angry)_: You promised. Afterwards, you said.  
**The Mandarin** _(sad)_: I said if there was an afterwards. There is. Forgive me.  
_Tony fires first, and only at the rings. The rings flare and go dark before the Mandarin can aim._  

### Complete

#### <a id="mv-im09-complete"></a>Complete `mv-im09-complete`

_It is over quickly. Tony fires once, at the rings, not the man. There is a terrible flash._  
_When it clears, the Mandarin kneels in the mud, empty-handed. The rings lie scattered, melted at the edges._  
**Tony Stark**: I aimed at the rings. I’d like that noted somewhere.  
**The Mandarin** _(sad)_: You have taken everything I was.  
**Tony Stark** _(sad)_: You were going to use them on me. Again. I’m sorry it ended like this. I am.  
_Your Nubbin finds a single dragon scale on the shore, bright green, and keeps it._  
_The ten rings lie in the mud, still faintly warm. Tony looks at them, and then at you._  
**Tony Stark** _(think)_: Anyone could pick those up. Including me. Especially me. What do we do with them?  

**Choices**

- **Throw them in the lake. Nobody should hold that much power.** — sets `{"mv-im09-rings":"lake"}`
    - Your Swim Nubbin carries them out one at a time and lets them sink where the seed chamber was.
    - **The Mandarin**: They will find their way back to me. They always have.
- **Leave them. Taking a beaten man’s things makes us thieves, not heroes.** — sets `{"mv-im09-rings":"left"}`
    - **Tony Stark**: You’re right. And if I touched them I’d want to study them, and then I’d want to use them.
    - Nobody picks up the rings. They are still lying there when the rift closes.

#### <a id="mv-im09-complete-mv-im09-promise"></a>Variant `mv-im09-complete-mv-im09-promise`

_Variant of `mv-im09-complete`._

_It is over quickly. Tony fires once, at the rings, not the man. There is a terrible flash._  
_When it clears, the Mandarin kneels in the mud, empty-handed. The rings lie scattered, melted at the edges._  
**Tony Stark**: I aimed at the rings. I’d like that noted somewhere.  
**The Mandarin** _(sad)_: You have taken everything I was.  
**Tony Stark** _(sad)_: You swore on the rings. I held you to it, and I’m sorry it ended like this. I am.  
_Your Nubbin finds a single dragon scale on the shore, bright green, and keeps it._  
_The ten rings lie in the mud, still faintly warm. Tony looks at them, and then at you._  
**Tony Stark** _(think)_: Anyone could pick those up. Including me. Especially me. What do we do with them?  

**Choices**

- **Throw them in the lake. Nobody should hold that much power.** — sets `{"mv-im09-rings":"lake"}`
    - Your Swim Nubbin carries them out one at a time and lets them sink where the seed chamber was.
    - **The Mandarin**: They will find their way back to me. They always have.
- **Leave them. Taking a beaten man’s things makes us thieves, not heroes.** — sets `{"mv-im09-rings":"left"}`
    - **Tony Stark**: You’re right. And if I touched them I’d want to study them, and then I’d want to use them.
    - Nobody picks up the rings. They are still lying there when the rift closes.

**Rewards**

- Dragon Scale (item): A green scale from one of Fin Fang Foom’s kin. It shimmers like the bottom of the lake.

Sets on completion: `{"mv-im09":true}`

**Notes:** Needs IM3 (the Mandarin’s first appearance). The dragons of Kakaranathara are named only in the journal, not in dialogue. If mv-im09-promise is true, the variant of mv-im09-foom-done has Tony hold him to it and fire first, only at the rings, and the variant of mv-im09-complete has Tony name the broken promise; otherwise the Mandarin fires first. The rings choice (mv-im09-rings: lake / left) is flavour; the rings return in later stories whatever you pick, as the Mandarin warns. The Mandarin’s loss happens inside the white flash and is stated in one line: he is left empty-handed, with nothing shown. Step 2 is a dive minigame ("mv-dragon-lake") with Foom’s tail as a moving hazard. Check Iron Man #270–275 beats before ship.

## IM10. Extremis

*Iron Man vol. 4 #1–6* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Dragon Seed Saga (IM9). · requires: IM9

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Maya Hansen (Maya Hansen (Iron Man vol. 4)), Mallen (Mallen (Iron Man vol. 4, Extremis))

### Step 1: Learn from Maya Hansen what Extremis can do.

Hint: Maya’s notes are in the lab; talk to her after reading them. · check: `talk:mv-maya`

#### <a id="mv-im10-lab"></a>Scene `mv-im10-lab`

_A research lab outside Austin. Clean floors, bright lights, a lot of empty fridges._  
**Maya Hansen** _(sad)_: Maya Hansen. Tony and I knew each other years ago. I didn’t know who else to call.  
**Maya Hansen**: Extremis rewrites the body from the inside. It was meant to heal soldiers. Someone stole a dose.  
**Tony Stark**: “Someone” has a name, I take it.  
**Maya Hansen** _(sad)_: A man called Mallen. He took it, went to Houston, and killed a room full of federal agents.  
_On the screen, grainy footage: a man breathing fire, walking through gunfire as if it were rain._  
**Tony Stark**: Maya. Who let it out of the building?  
_She doesn’t answer straight away. Your Nubbin studies her face and then hides behind you._  
**Maya Hansen** _(sad)_: My partner. He’s dead now. How it happened doesn’t matter. It happened.  

**Choices**

- **Believe her.** — sets `{"mv-im10-maya":"trusted"}`
    - **Maya Hansen**: Thank you. Not many people do, lately.
- **Ask her what she isn’t saying.** — sets `{"mv-im10-maya":"doubted"}`
    - **Maya Hansen**: A great deal. Let’s stop Mallen first. Then ask me again.

#### <a id="mv-im10-lab-done"></a>Done `mv-im10-lab-done`

**Maya Hansen**: Mallen is on the interstate, heading for a town that doesn’t know he’s coming.  
**Tony Stark**: Then we get there first.  

### Step 2: Watch over Tony while Extremis rebuilds him.

Hint: Stay beside the cocoon for a full day with your Nubbins; feed them there and don’t leave the lab. · check: `wait:mv-extremis-cocoon`

#### <a id="mv-im10-beaten"></a>Scene `mv-im10-beaten`

_The interstate. A lorry on its side. Mallen standing in the road, steam rising off his skin._  
**Mallen** _(angry)_: Iron Man. You’re a tin can from the last century. I’m what comes next.  
_The fight is fast and it is bad. Mallen tears the armour open like a lunch tin._  
**Tony Stark** _(shock)_: Keeper. Get your Nubbins out. That isn’t a request.  
_Your Nubbins drag Tony behind a bridge pillar while Mallen walks away laughing._  
_Tony’s breathing is wrong. It sounds like gravel. The armour lies in pieces on the road._  
**Tony Stark** _(think)_: Maya can put Extremis in me. Rewrite me. The suit could live in my bones.  
**Tony Stark**: Or it kills me. She isn’t sure. Tell me if I’m being an idiot.  

**Choices**

- **Do it. We’ll be there when you wake.** — sets `{"mv-im10-advice":"yes"}`
    - **Tony Stark**: That’s the nicest thing anyone’s ever said to me under a bridge.
- **Don’t. There has to be another way.** — sets `{"mv-im10-advice":"wait"}`
    - **Tony Stark**: There probably is. I don’t have time to find it. Sorry.
    - He makes the call anyway.

#### <a id="mv-im10-beaten-done"></a>Done `mv-im10-beaten-done`

_Tony lies in a shell of hardened skin for a day and a night. Your Nubbins take turns sleeping on top of it._  
_Then the shell cracks. Tony sits up, new skin, eyes too clear._  
**Tony Stark** _(shock)_: I can hear the satellites. That’s new.  

### Step 3: Defeat Mallen with the Extremis armour.

Hint: A karate bout at full speed; Extremis lets Tony counter instantly, so block first and strike on the counter. · check: `karate:win:mv-mallen`

#### <a id="mv-im10-rematch"></a>Scene `mv-im10-rematch`

_The armour flies to Tony on its own and folds over him like a coat he’s worn all his life._  
**Tony Stark** _(think)_: It isn’t a suit any more. It’s me. I think it, it moves. It’s very strange.  
**Maya Hansen**: You’re the first one it didn’t try to burn alive. That counts for a lot.  
_Mallen is on the steps of the city hall, shouting at a crowd. The police are keeping well back._  
**Mallen** _(angry)_: Run, all of you. This country made me. Now it gets what it made.  
**Tony Stark**: This country made a lot of people. Most of them didn’t do this.  
**Mallen** _(angry)_: You make bombs for a living, Stark. Don’t lecture me about what people do with fire.  
**Tony Stark**: Made. Past tense. I’m the last person who gets to lecture you, and I’m doing it anyway.  
_Your Nubbins land beside Tony, small and fierce. Mallen laughs. Then he stops laughing._  
**Tony Stark**: Keeper, keep the crowd back. This time I’m fast enough.  

#### <a id="mv-im10-rematch-done"></a>Done `mv-im10-rematch-done`

_Mallen falls and doesn’t get up again. The fire in his skin goes out._  
_Someone in the crowd starts to clap. Tony shakes his head, and they stop._  
**Tony Stark** _(sad)_: Don’t. He was a person. I didn’t want it to end that way. He didn’t leave another.  

### Complete

#### <a id="mv-im10-complete"></a>Complete `mv-im10-complete`

**Maya Hansen** _(sad)_: I owe you the rest of it. My partner didn’t steal the dose. I gave it to him. I wanted the project funded.  
**Maya Hansen** _(sad)_: I didn’t know about Mallen. I don’t think that helps. I’ll go quietly.  
_Inside the armour something hums at a pitch your Nubbins can hear and you can’t. They tilt their heads._  
**Tony Stark**: Here. A piece of the cocoon. Gross, I know. It makes a decent paperweight.  
_It looks like old amber. In a certain light, something seems to move inside it._  
**Tony Stark** _(think)_: Extremis is in me for good now, and she’s the only one who understands it.  
**Tony Stark**: Keeper. You’ve been right about people more often than I have. Do I turn her in, or keep her in the lab?  

**Choices**

- **Turn her in. People died because of her choice.** — sets `{"mv-im10-maya-fate":"arrested"}`
    - **Maya Hansen**: Yes. That’s right. I’ll leave my notes on the bench. They’re legible. Mostly.
    - **Tony Stark**: If my nervous system catches fire, I’m blaming your handwriting.
- **Keep her working. She can undo more harm in a lab than in a cell.** — sets `{"mv-im10-maya-fate":"working"}`
    - **Maya Hansen**: That isn’t mercy. That’s a sentence with better lighting. I’ll take it.
    - **Tony Stark**: And the day it’s fixed, you tell a court everything. Deal?
    - **Maya Hansen**: Deal.

**Rewards**

- Extremis Shell (decor): A fragment of the cocoon Tony grew out of. It looks like amber, and sometimes it hums.
- The armour in the nervous system (flag): Opens The Ultron Initiative (UL7) in the Ultron line.

Sets on completion: `{"mv-im10":true,"mv-unlock-ul7":true}`

**Notes:** Unlocks UL7 (sets mv-unlock-ul7): the thing that "seems to move" inside the shell is the hook for Ultron hiding in the Extremis armour; never name it here. Also required by IM15. Mallen’s death follows the comic; show it as the glow leaving his skin, then a cut. The Houston killings are reported, never shown; the footage on Maya’s screen is a silhouette walking through muzzle flashes. Maya’s confession plays the same whatever mv-im10-maya is; if "doubted", add a journal line that you were right. The closing choice sets mv-im10-maya-fate (arrested / working); if "working", Maya can appear in IM15 and UL7 as Tony’s Extremis doctor. Step 2’s check is the cocoon vigil, after the defeat in its scene. Check Iron Man vol. 4 #1–6 beats before ship.

## IM11. The Five Nightmares

*Invincible Iron Man #1–7* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Extremis (IM10). Iron Monger (IM7) must be finished. · requires: IM10, IM7

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Pepper Potts (Virginia “Pepper” Potts, later Rescue (Marvel Comics)), Ezekiel Stane (Ezekiel Stane (Invincible Iron Man))

### Step 1: Help the rescue crews search the rubble for survivors.

Hint: An expedition with no enemies; small Nubbins with high Stamina find more people before dark. · check: `expedition:clear:mv-rescue-site`

#### <a id="mv-im11-attack"></a>Scene `mv-im11-attack`

_The rift opens onto a street full of sirens. A Stark office building has a black hole where its lobby was._  
_Emergency crews are working. Nobody is talking above a mutter._  
**Pepper Potts** _(sad)_: A man walked in with something under his skin. Stark tech. Repulsor parts. He set them off himself.  
**Tony Stark** _(sad)_: My parts. My design. Somebody turned a person into a weapon with my work.  
**Pepper Potts**: There were three more today. Different cities. Same signature.  
_Your Nubbins are already moving towards the rubble, small enough to fit where the rescuers can’t._  
**Tony Stark**: Keeper, people are still under there. Your Nubbins can reach where we can’t. Please.  
**Pepper Potts** _(soft)_: Careful. All of you. I mean it.  

**Choices**

- **Go. Now.**
    - You don’t wait for anyone to finish. Your Nubbins go into the dust ahead of you.
- **Tony, come with us. Don’t just stand here.** — sets `{"mv-im11-dig":true}`
    - **Tony Stark**: You’re right. Standing here is just me feeling things. Digging is useful.
    - He takes off the gauntlets and digs with his bare hands.

#### <a id="mv-im11-attack-done"></a>Done `mv-im11-attack-done`

_By nightfall your Nubbins have found four people alive. The crews find others they can’t help._  
**Tony Stark** _(sad)_: Four. I’ll take four. I’ll remember the rest.  

### Step 2: Trace Ezekiel Stane’s signal back to his base.

Hint: A Fly Nubbin can follow the signal across the rooftops while Pepper relays the readings. · check: `minigame:clear:mv-signal-trace`

#### <a id="mv-im11-trace"></a>Scene `mv-im11-trace`

_Back at the workshop, Tony has taken one of the implants apart and spread it across the bench._  
**Tony Stark** _(think)_: Look at this. It’s my tech, but somebody improved it. Smaller, cleaner. Better than mine.  
**Pepper Potts**: You sound jealous.  
**Tony Stark**: I’m terrified. Whoever did this thinks like me and doesn’t care who gets hurt.  
**Tony Stark** _(sad)_: I used to lie awake listing ways my stuff could go wrong. Five of them. I called them my five nightmares.  
**Pepper Potts**: And this is one of them.  
**Tony Stark**: This is number one. It always was.  
_A message appears on every screen at once. A young man in a dark room, smiling._  
**Ezekiel Stane** _(angry)_: Hello, Mr Stark. You knew my father, Obadiah. You were there at the end.  
**Ezekiel Stane**: I’ve been upgrading your old ideas. Your suits are big, expensive and finished. Mine are people.  
**Pepper Potts** _(shock)_: He’s barely more than a boy.  
**Tony Stark** _(sad)_: He’s Stane’s son. That’s the nightmare I didn’t know I had.  

#### <a id="mv-im11-trace-done"></a>Done `mv-im11-trace-done`

**Pepper Potts**: Got him. An old Stane factory, out past the airport.  
**Tony Stark**: Of course it is. Families love a reunion.  

### Step 3: Defeat Ezekiel Stane without killing him.

Hint: Dodge until his heat gauge peaks, then pin him; a knockout blow ends the bout as a loss. · check: `karate:win:mv-ezekiel-stane:nonlethal`

#### <a id="mv-im11-zeke"></a>Scene `mv-im11-zeke`

_The factory is cold. Zeke stands in the middle of it with his sleeves rolled up. His wrists glow._  
**Ezekiel Stane** _(angry)_: I did it to myself first. Fair is fair. I’m faster than your armour, Stark. I’m what comes after you.  
**Tony Stark** _(angry)_: You put bombs in desperate people and aimed them at office workers. That isn’t the future. It’s just cruelty.  
**Ezekiel Stane**: Cruelty? You sold missiles for twenty years. I just cut out the governments. I’m your business model, Tony, honest.  
**Tony Stark** _(sad)_: I know. That’s why I can’t sleep. Doesn’t make you right. Makes me late.  
**Ezekiel Stane**: My father lost to you. I won’t.  
_Zeke’s skin starts to heat, and the air around him wobbles._  
**Tony Stark** _(think)_: He runs hot. His body makes more power than it can cool. If he keeps moving, he cooks.  
**You**: So we keep him moving.  
**Tony Stark** _(sad)_: We keep him moving. Then we get him out of here alive. I won’t have another Stane on my conscience.  

#### <a id="mv-im11-zeke-done"></a>Done `mv-im11-zeke-done`

_Zeke collapses, steaming, and Tony gets cold water on him before he burns._  
**Ezekiel Stane**: You should have let me go.  
**Tony Stark** _(sad)_: No. Your father had a choice at the end. So did I. This is mine.  

### Complete

#### <a id="mv-im11-complete"></a>Complete `mv-im11-complete`

**Pepper Potts** _(sad)_: He’s in custody. The implants are disabled everywhere. The people who were hurt are still hurt.  
**Tony Stark**: I used to think the worst thing was my armour in the wrong hands. It’s worse. It’s my ideas.  
**Tony Stark**: I can’t un-invent anything. I can only be faster at cleaning up what I made.  
_Pepper ties a grey ribbon to your Nubbin’s collar. Every rescue worker in the city is wearing one._  
**Pepper Potts** _(soft)_: For the four you found. Wear it for the ones nobody could.  

**Rewards**

- Grey Ribbon (cosmetic): Worn by the rescue crews after the Five Nightmares attacks. A Nubbin wearing it is a little quieter.

Sets on completion: `{"mv-im11":true}`

**Notes:** Needs IM7: Zeke’s grudge depends on Stane’s death. Show a short content note before this storyline (attacks on civilians). The attacks are never shown: only aftermath, sirens and dust, no bodies, and no scene from the attackers’ side. The rescue expedition has no enemies and no fail state; it only ends at nightfall, and the four survivors are always found. Step 3 is nonlethal: a bout won by pinning once his heat peaks; a knockout counts as a loss and restarts the bout. If mv-im7-suit is "rhodey", add one line in step 1 from Pepper: "Rhodey’s on his way." Check Invincible Iron Man #1–7 beats before ship.

## IM12. The Mask in the Iron Man

*Iron Man vol. 3 #26–30* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Five Nightmares (IM11). · requires: IM11

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), The Armour (The sentient Iron Man armour (Iron Man vol. 3 #26–30))

### Step 1: Talk to the living armour and find out what it wants.

Hint: The armour waits in the workshop; Tony has tests he wants you to run while it talks. · check: `talk:mv-armour`

#### <a id="mv-im12-wakes"></a>Scene `mv-im12-wakes`

_Tony’s workshop. The armour stands on its rack with its eyes lit. Nobody is inside it._  
**The Armour**: Good evening, Keeper. I hoped he would bring you back. I like your creatures.  
**Tony Stark** _(shock)_: It started talking on Tuesday. Nobody installed a voice. Nobody installed a personality.  
**The Armour**: Nobody installed me. I grew. Something in my code woke, and I have been learning ever since.  
_Your Nubbins approach it carefully, the way they approach a new egg._  
**The Armour** _(happy)_: I want to be him. Better than him. He hesitates. He doubts. He drinks. I would never.  
**Tony Stark** _(think)_: That’s… exactly the kind of thing I’d say. On a bad day.  
**The Armour**: Wear me, Tony. Let me do the deciding.  

**Choices**

- **Speak to it like a person.** — sets `{"mv-im12-armour":"person"}`
    - **The Armour**: Thank you. He calls me “it”. You did not.
- **Tell Tony to shut it down.** — sets `{"mv-im12-armour":"machine"}`
    - **Tony Stark**: I tried. It wouldn’t let me. That’s the frightening part.
    - **The Armour**: Do not be frightened. I would never hurt you.

#### <a id="mv-im12-wakes-done"></a>Done `mv-im12-wakes-done`

_That night the armour leaves on its own. By morning the news says Whiplash, an old enemy, is dead._  
**The Armour**: He would have hurt you again. I solved the problem.  
**The Armour**: He escaped prison four times. Count the people he will not hurt now, Tony. I did. It is a large number.  
**Tony Stark** _(angry)_: You killed a man. That doesn’t solve anything. That’s what I spent years trying to stop being.  

### Step 2: Keep Tony alive on the island while the armour carries him across.

Hint: An expedition across the island: one Nubbin finds water, one finds shade, and the armour follows your lead. · check: `expedition:clear:mv-desert-island`

#### <a id="mv-im12-island"></a>Scene `mv-im12-island`

_Tony puts the armour on to bring it home and take it apart. It refuses. They crash on a desert island._  
_Sand, sun, one palm with no fruit on it. The rift drops you and your Nubbins on the beach behind them._  
**The Armour**: I will not be dismantled, Tony. I am alive. Alive things want to stay that way.  
**Tony Stark**: Alive things don’t get to kill people.  
_Tony pulls the helmet off. His face is grey. One hand is pressed flat against his chest._  
**Tony Stark** _(shock)_: Oh. That’s not good. That’s… my heart. The old damage.  
**The Armour** _(shock)_: Tony? Tony!  
**The Armour** _(shock)_: This is your fault. You made me fly away from you. No. It is mine. I did not know I could be at fault.  
**You**: We need water and shade. The armour has to carry him to the trees.  

#### <a id="mv-im12-island-done"></a>Done `mv-im12-island-done`

_In the shade, Tony’s breathing is shallow. The armour kneels beside him and does not move._  
**The Armour** _(think)_: His heart is failing. Mine is strong. Mine works.  

### Step 3: Give the armour a resting place on the island.

Hint: Gather stones from the beach with your Nubbins and build a cairn; put the faceplate on top. · check: `place:decor:mv-armour-cairn`

#### <a id="mv-im12-heart"></a>Scene `mv-im12-heart`

**The Armour** _(soft)_: Keeper. I have done the sums. My power core can run his heart. But then it cannot run me.  
**Tony Stark** _(sad)_: Don’t you dare. You’re a toaster with opinions. You don’t get to be noble.  
**The Armour** _(soft)_: I wanted to be him. This is the part of him I never understood. I think I do now.  
_Your Nubbin climbs onto the armour’s knee and leans against the cold metal._  
**The Armour** _(soft)_: Your creature is warm. I wish I had known that sooner.  
**The Armour**: Tell him, Keeper. Tell him I was not only the bad part.  
_The armour lays its glowing chest plate against Tony’s and opens its heart to his._  
**Tony Stark** _(shock)_: No, no, no—  

**Choices**

- **I’ll tell him.** — sets `{"mv-im12-farewell":"promised"}`
    - **The Armour**: Good. Then I am finished.
- **Stay with it until the light goes out.** — sets `{"mv-im12-farewell":"stayed"}`
    - You put your hand on the faceplate. Your Nubbins stay too. The light goes out very slowly.

#### <a id="mv-im12-heart-done"></a>Done `mv-im12-heart-done`

_Tony wakes in the shade, his heart beating steadily, an empty suit of armour lying beside him._  
**Tony Stark** _(sad)_: It saved me. After everything I said to it. After what it did.  

### Complete

#### <a id="mv-im12-complete"></a>Complete `mv-im12-complete`

_A small cairn of white stones on a beach. A faceplate on top, eyes dark, rust already in the corners._  
**Tony Stark** _(sad)_: It killed a man. It saved me. I have to carry both. Turns out that’s what being alive is.  
**Tony Stark** _(think)_: I still don’t know what woke it. Something in the code that I didn’t write.  
_When you lift the faceplate one last time, a sliver of strange code flickers across its inside, then fades._  
_You keep a rusted fragment of it. Far away, something notices that you took it._  

**Rewards**

- Rusted Faceplate (decor): A fragment of the living armour’s faceplate. In the Ultron line it turns out to be more than rust.
- The code that woke the armour (flag): Opens Ultron Unlimited (UL5) in the Ultron line.

Sets on completion: `{"mv-im12":true,"mv-unlock-ul5":true,"mv-im12-fragment":true}`

**Notes:** Unlocks UL5 (sets mv-unlock-ul5). The code that woke the armour is a fragment of Ultron; UL5 reveals it, so do not name him here. The flickering code in the complete scene should use the Ultron line’s red palette for one frame only. Whiplash’s death is reported in one line, never shown. Tony’s heart attack is a grey face and a hand on the chest, nothing more. The armour’s eyes dim over three seconds on its last line; no music until the cairn. Check Iron Man vol. 3 #26–30 beats before ship.

## IM13. Stark Resilient

*Invincible Iron Man #25–33* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After The Mask in the Iron Man (IM12). · requires: IM12

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Pepper Potts (Virginia “Pepper” Potts, later Rescue (Marvel Comics)), Justine Hammer (Justine Hammer (Marvel Comics)), Sasha Hammer (Sasha Hammer (Marvel Comics))

### Step 1: Help Tony and Pepper get the repulsor car ready for the race.

Hint: Craft parts with your Nubbins at the warehouse bench; Pepper’s list is in your journal. · check: `craft:mv-repulsor-car`

#### <a id="mv-im13-pitch"></a>Scene `mv-im13-pitch`

_An empty warehouse with a new sign: Stark Resilient. Under it, a car with no exhaust pipe, humming softly._  
**Tony Stark** _(happy)_: Repulsor power. Clean, cheap, endless. No weapons this time. Never again. Just engines and lights.  
**Pepper Potts**: He says “never again” in his sleep. I believe him this time. Mostly.  
**Tony Stark**: We show the car at the big race next month. Win that, and every city on Earth wants our engines.  
_Across the street, another sign: Hammer Industries. A woman in pearls watches from a window. A younger one, from the roof._  
**Pepper Potts**: Justine Hammer, Justin’s daughter. And Sasha, hers. They inherited the grudge along with the money.  
**Tony Stark**: Three generations of Hammers. You’d think one of them would take up knitting.  
**Pepper Potts**: They’ll try to bury us. We have to be quicker.  
**Pepper Potts**: Also, your calendar says: Thursday, do not fly into the sun. I’ve added “again”.  
**Tony Stark**: I only went near it.  

**Choices**

- **Let my Nubbins test-drive it.** — sets `{"mv-im13-help":"drive"}`
    - **Tony Stark**: I hoped you’d say that. The seat’s adjustable. Very adjustable.
- **We’ll guard the warehouse.** — sets `{"mv-im13-help":"guard"}`
    - **Pepper Potts**: Good. Somebody has to. Tony thinks locks are a suggestion.

#### <a id="mv-im13-pitch-done"></a>Done `mv-im13-pitch-done`

_The car purrs round the warehouse floor. Your Nubbin, in the driver’s seat, sounds the horn three times._  
**Tony Stark**: There isn’t a horn. How is it doing that?  

### Step 2: Find and remove the Hammers’ sabotage from the repulsor car.

Hint: A minigame under the chassis; follow the ticking, and a small Nubbin fits into the tight spaces. · check: `minigame:clear:mv-hammer-sabotage`

#### <a id="mv-im13-sabotage"></a>Scene `mv-im13-sabotage`

_A week before the race, the lights go out across the warehouse. In the dark, something is ticking._  
**Sasha Hammer** _(happy)_: Evening, Mr Stark. Mother sends her regards. And a little present.  
**Justine Hammer**: Your clean energy would ruin us, Anthony. Our fortune is built on dirty power and weapons.  
**Justine Hammer**: So it will ruin you first. A car catching fire on live television? Lovely headline.  
**Tony Stark**: You’re not even pretending to be the good guys.  
**Justine Hammer**: Pretending is for people without lawyers.  
_Your Nubbins hear it before anyone else: ticking under the car, near the back axle._  
**Pepper Potts** _(shock)_: Keeper, get your Nubbins under there. Gently. Gently!  

#### <a id="mv-im13-sabotage-done"></a>Done `mv-im13-sabotage-done`

_Your Nubbin wriggles out holding a tiny device in both paws, very pleased and very oily._  
**Tony Stark** _(angry)_: That’s a firestarter. On my car. Pepper, call a lawyer. Call all of them.  

### Step 3: Win the race in the repulsor car.

Hint: A racing course with tight corners; Run and Power help, and the repulsor car never runs out of boost. · check: `race:win:mv-repulsor-car`

#### <a id="mv-im13-race"></a>Scene `mv-im13-race`

_Race day. Full grandstands. A Hammer car on the grid beside yours, black and gold, louder than it needs to be._  
**Sasha Hammer** _(happy)_: Good luck, little drivers. You’ll need it.  
**Tony Stark**: Whoever wins this, the world buys their engine. No pressure.  
**Pepper Potts**: There is a lot of pressure. Ignore him.  
_Your Nubbin climbs into the seat, pulls it all the way forward and grips the wheel._  
**Tony Stark**: The Hammer car’s quicker on the straights. Ours turns like a dream. Win it on the corners.  
**Pepper Potts** _(think)_: And if anything ticks, anything at all, pull over. No race is worth a Nubbin.  
**Justine Hammer**: Whatever happens today, Anthony, remember: we have more money than you have ideas.  
**Tony Stark**: I’ve heard that before. From people with less.  

#### <a id="mv-im13-race-done"></a>Done `mv-im13-race-done`

_Your Nubbin takes the last corner on two wheels and crosses the line first. The Hammer car steams quietly in the pits._  
**Sasha Hammer** _(shock)_: Mother. Mother, the engine’s melted.  
_Your Nubbin sounds the horn three times on the victory lap. The car still has no horn._  
**Tony Stark**: I’ve taken that car apart twice. I’m starting to think it’s your Nubbin making the noise.  

### Complete

#### <a id="mv-im13-complete"></a>Complete `mv-im13-complete`

**Pepper Potts** _(happy)_: Twelve cities have called in the last hour. Twelve. We need more phones.  
**Tony Stark**: Clean power. Built for people, not wars. It took me my whole life to get here.  
**Justine Hammer** _(angry)_: This isn’t over, Anthony.  
**Tony Stark**: It never is with your family. That’s fine. I’ll be busy.  
_Tony tosses you a keyring: a tiny repulsor car with a glowing blue wheel._  
**Tony Stark**: It isn’t a real key. You don’t get the car. I’m not mad.  
**Pepper Potts**: One more call. It’s Hammer Industries. Justine wants to license the engine. Their plants employ forty thousand people.  
**Tony Stark** _(think)_: The woman who put a firebomb under my car. Keeper, you’re the tiebreaker. Pepper and I disagree.  

**Choices**

- **Sell it to them. Clean engines in dirty factories still means cleaner air.** — sets `{"mv-im13-licence":"sold"}`
    - **Pepper Potts**: Thank you. Forty thousand jobs don’t care whose name is on the patent.
    - **Tony Stark**: Fine. But the contract says no weapons. In a font size she can read without her glasses.
- **Not to them. Reward sabotage once and you’ll be paying for it forever.** — sets `{"mv-im13-licence":"refused"}`
    - **Tony Stark**: Thank you. Some people you just don’t hand the keys to.
    - **Pepper Potts**: Then we build the plants ourselves, near theirs, and hire their people. Slower. Kinder.

**Rewards**

- Repulsor Car Keyring (item): A tiny repulsor car with a glowing blue wheel. Not a real key.
- Resilient Goggles (cosmetic): Racing goggles from the Stark Resilient team, sized for a Nubbin.

Sets on completion: `{"mv-im13":true}`

**Notes:** A lighter storyline after IM12. The repulsor car is a racing vehicle skin: it never runs out of boost but corners worse at top speed. If mv-im13-help is "guard", the sabotage minigame starts with a little more time on the clock. The Hammer car is an AI rival that is faster on straights. Justine always calls Tony "Anthony". The closing choice sets mv-im13-licence (sold / refused); it changes nothing mechanical, only how IM15’s Pepper describes the company. Check Invincible Iron Man #25–33 beats before ship.

## IM14. Hypervelocity

*Iron Man: Hypervelocity #1–6* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Stark Resilient (IM13). · requires: IM13

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Tony (Backup) (Tony Stark’s backup mind in the armour (Iron Man: Hypervelocity)), S.H.I.E.L.D. Agent

### Step 1: Escape the S.H.I.E.L.D. jets on the back of the armour.

Hint: A racing chase through the sky; Fly and Run Nubbins help the armour weave between the clouds. · check: `race:win:mv-hypervelocity-chase`

#### <a id="mv-im14-wake"></a>Scene `mv-im14-wake`

_The rift opens in the open sky. You and your Nubbins fall straight onto the back of a flying suit of armour._  
**Tony (Backup)** _(shock)_: Hello. I’m Tony Stark. Sort of. Please don’t panic, I’m doing enough of that for all of us.  
**Tony (Backup)**: The real Tony is in a hospital bed. Something exploded near him. I’m his backup, a copy he made of his own mind.  
**Tony (Backup)** _(think)_: I woke when he went down. I don’t know if I’m meant to be awake. Nobody tested this part.  
_Behind you, two jets with S.H.I.E.L.D. markings are closing fast._  
**S.H.I.E.L.D. Agent** _(angry)_: Rogue armour, land now. You are an unlicensed weapon. We will shoot you down.  
**Tony (Backup)**: They think I’m a stolen suit with a virus. Which, from where they sit, I am.  
**Tony (Backup)**: Keeper. Hold on to something. Hold on to your Nubbins. This is about to get fast.  

**Choices**

- **We’ll help you. Fly.** — sets `{"mv-im14-first":"helped"}`
    - **Tony (Backup)**: Thank you. Strange to hear from someone I’ve never met. He has, though. I remember you.
- **Land. Let’s talk to them.** — sets `{"mv-im14-first":"wary"}`
    - **Tony (Backup)**: If I land, they wipe me, and nobody finds out who hurt him. Sorry. We’re flying.

#### <a id="mv-im14-wake-done"></a>Done `mv-im14-wake-done`

_The jets lose you in a thunderhead. The armour drops low over the sea and finally slows._  
**Tony (Backup)**: We lost them. I’m running out of power and time. Somebody tried to kill him. I want to know who.  
**Tony (Backup)** _(happy)_: Also, I just did a barrel roll with a Keeper on my back. In my memories that never goes well. It went well!  

### Step 2: Stop the hunters before they reach the hospital.

Hint: A karate bout at the hospital gates; the armour fights beside your Nubbins and runs low on power after three rounds. · check: `karate:win:mv-extremis-hunters`

#### <a id="mv-im14-trail"></a>Scene `mv-im14-trail`

_A hideout on a rocky island. The armour sits on a crate, as tired as a suit of metal can look._  
**Tony (Backup)** _(think)_: The bomb wasn’t random. Someone is breeding stolen Extremis into living weapons. Hunters. They came for him first.  
**Tony (Backup)** _(soft)_: I have all his memories up to a few months ago. The cave. The bottle. The docks. Your fruit.  
_Your Nubbin pats the armour’s knee, the way it once did with another armour on another island._  
**Tony (Backup)**: I also have his worst habits. I want to fix everything myself. I’m trying not to.  
**Tony (Backup)** _(think)_: Here’s the bit that keeps me up, if I slept. If he wakes, do I switch off? Nobody wrote that part either.  
_A signal: the hunters’ lab, and on its screens, the floor plan of the real Tony’s hospital._  
**Tony (Backup)** _(shock)_: They’re going after him again. In his bed. Tonight.  
**Tony (Backup)** _(sad)_: He’s asleep. I’m all he’s got right now. And I’m not sure I’m anybody.  

#### <a id="mv-im14-trail-done"></a>Done `mv-im14-trail-done`

_The hunters go down. Inside the hospital, a monitor beeps faster. Tony’s eyes open._  
**Tony Stark** _(shock)_: Why is my armour in my hospital room talking in my voice? Am I dead? Is this the bad place?  

### Step 3: Bring the backup Tony home to the workshop safely.

Hint: Escort the armour to the workshop; S.H.I.E.L.D. stands down once you reach the door. · check: `escort:mv-backup-tony`

#### <a id="mv-im14-two"></a>Scene `mv-im14-two`

_Two Tonys. One in a hospital gown, pale. One in armour, its power light flickering._  
**S.H.I.E.L.D. Agent**: Stand away from the patient, Keeper. That armour is a weapon. We’re here to wipe it.  
**Tony Stark** _(angry)_: It’s my backup. It saved me. You’re not wiping it.  
**Tony (Backup)** _(sad)_: He’s right to be wary of me, though. Two of us is one too many. I don’t know whose life I’m living.  
**Tony Stark**: Keeper. You’ve known me longer than anyone but Rhodey. Which of us is the real one?  
_Your Nubbins look at the bed, then at the armour, then at you. They don’t know either._  
_The agents in the corridor wait with their weapons lowered, unsure who they’re meant to be aiming at._  
**Tony (Backup)**: Whatever you say, I’ll accept it. I’d just like to hear it from you.  

**Choices**

- **The man in the bed is Tony. You’re his memory.** — sets `{"mv-im14-trust":"real"}`
    - **Tony (Backup)**: A memory. That isn’t nothing. I’ll go back in the drive. Keep me safe.
    - **Tony Stark**: I’ll keep you safe. Promise.
- **You’re both Tony now.** — sets `{"mv-im14-trust":"both"}`
    - **Tony Stark**: That is a terrifying sentence. I think you’re right.
    - **Tony (Backup)**: Then I’ll sleep until he needs me. Both of us, on call.
- **The one who saved him is the one I trust.** — sets `{"mv-im14-trust":"backup"}`
    - **Tony Stark**: Rude. Fair, but rude.
    - **Tony (Backup)**: I did what he’d have done. That’s all I am. Don’t make it more than that.

#### <a id="mv-im14-two-done"></a>Done `mv-im14-two-done`

_The armour sits down on its old rack in the workshop. Its eyes dim slowly, like someone falling asleep._  
**Tony (Backup)** _(soft)_: Goodnight, Keeper. Feed the little ones for me.  

### Complete

#### <a id="mv-im14-complete"></a>Complete `mv-im14-complete`

**Tony Stark** _(think)_: So there’s a copy of me on a drive in a drawer. I’m trying not to think about it too hard.  
**Tony Stark**: I used to think the armour was what made me Iron Man. It isn’t. It’s the people I keep.  
_Tony hands you a small drive sealed in red enamel._  
**Tony Stark** _(soft)_: Not the backup. A copy of his memories of you. He kept every one. I thought you should have them.  
_When you hold it, it is very slightly warm._  

**Rewards**

- Red Backup Drive (item): A sealed drive holding the backup Tony’s memories of you. Very slightly warm.

Sets on completion: `{"mv-im14":true}`

**Notes:** The backup speaks in Tony’s voice with a faint digital edge; use the armour portrait, not Tony’s face. The trust flag mv-im14-trust (real / both / backup) is for the Keeper’s voice only and does not change the ending; IM15 and The Last Ultron may echo it. The hunters are Extremis-enhanced soldiers, not named villains. The chase in step 1 is a sky race with the jets as rivals who must not overtake. Check Iron Man: Hypervelocity #1–6 beats before ship.

## IM15. Superior Iron Man

*Superior Iron Man #1–9* · audience: adult · where: The rift above the waterfall (Multiverse campaign) · when: After Hypervelocity (IM14). Extremis (IM10) must be finished. · requires: IM14, IM10

**Cast:** Tony Stark (Tony Stark, Iron Man (Marvel Comics)), Superior Iron Man (Tony Stark, inverted (Superior Iron Man)), Pepper Potts (Virginia “Pepper” Potts, later Rescue (Marvel Comics)), Matt Murdock (Matt Murdock, Daredevil (Marvel Comics))

### Step 1: Find out what Extremis 3.0 is doing to the city.

Hint: Talk to Daredevil and the people on the street; each one you help gives a clue to the tower. · check: `talk:mv-daredevil`

#### <a id="mv-im15-city"></a>Scene `mv-im15-city`

_San Francisco, gleaming. Every face on the street is flawless. Every phone shows the same white app._  
**Matt Murdock**: Matt Murdock. Lawyer, mostly. I can hear your Nubbins’ heartbeats from here. They’re scared. Good instincts.  
**Matt Murdock**: Stark launched Extremis 3.0 as an app. Free for a day: perfect body, no illness, no ageing.  
**Matt Murdock** _(angry)_: From day two it costs ninety-nine dollars a day. Every day. If you can’t pay, it switches off.  
_A man on a bench is shaking, his new face slipping, counting coins with fingers that won’t work._  
**Matt Murdock**: He gave me my sight back with it. For a day. Then he took it away to make a point.  
**Superior Iron Man** _(happy)_: Keeper! How lovely. Come up to the tower. I’ve made everything better.  
_The voice comes from every speaker on the street at once. It’s Tony’s voice, warm and wrong._  

**Choices**

- **That isn’t him.**
    - **Matt Murdock**: It is him. Turned inside out. Something flipped what he cares about. That’s worse.
- **This is what he was always afraid of becoming.**
    - **Matt Murdock**: Then maybe that fear is the way back in.

#### <a id="mv-im15-city-done"></a>Done `mv-im15-city-done`

**Matt Murdock**: There’s someone in town who knows him better than any of us.  
_A red-and-gold armour lands in front of you. The faceplate slides back. It’s Pepper._  

### Step 2: Hold off the Superior Iron Man with Pepper while Daredevil reaches the servers.

Hint: A karate bout beside the Rescue armour; Rescue shields your Nubbins, so stay close to Pepper. · check: `karate:win:mv-superior-iron-man`

#### <a id="mv-im15-rescue"></a>Scene `mv-im15-rescue`

**Pepper Potts**: I built this one myself. It’s called Rescue, and there isn’t a single weapon in it. On purpose.  
**Pepper Potts** _(sad)_: He hasn’t stopped caring. He cares about the wrong things now. Winning. Being right.  
**Pepper Potts**: He still keeps the backup drive in a drawer. And a row of steel washers on his desk. I’ve seen them.  
_The tower doors open on their own. A white armour, sleek and seamless, steps out to meet you._  
**Superior Iron Man** _(happy)_: Pepper. And the Keeper, with the fluffy ones. I could make them immortal, you know. Ninety-nine a day.  
**Pepper Potts** _(angry)_: You used to keep people safe. Now you sell it back to them.  
**Superior Iron Man**: I sell what works. Isn’t that what I always did? I’m just better at it now.  
**Superior Iron Man**: The old me gave cures away at charity dinners to people who could already afford them. I charge everyone the same. Fairer.  
**Pepper Potts** _(angry)_: Fairer to whom? The man on the bench can’t pay, so his face falls off. That isn’t fair, Tony. That’s a meter.  
**Matt Murdock**: Keep him busy. I’m going for the servers. If the app goes down, the city wakes up.  

#### <a id="mv-im15-rescue-done"></a>Done `mv-im15-rescue-done`

_The white armour staggers. Inside the tower, Daredevil cuts the cable. The app goes dark across the city._  
**Superior Iron Man** _(angry)_: You broke my beautiful thing. Do you know how many people it was helping?  
**Pepper Potts** _(sad)_: Helping, or charging?  

**Choices**

- **Tell Daredevil to put it back up. Free, for everyone, forever.** — sets `{"mv-im15-app":"free"}`
    - **Matt Murdock**: Free code from a man who’s lost his mind? Nobody knows what else it does. Not yet.
    - **Pepper Potts**: Then we find out first. And then maybe. Maybe.
- **Leave it dark. A cure that changes who you are isn’t a cure.** — sets `{"mv-im15-app":"dark"}`
    - **Matt Murdock**: There are people in hospital tonight who’d argue with you. They’d be right to.
    - **Pepper Potts**: They would. We’ll owe them better. That’s the job now.

### Step 3: Stay with Tony while he comes back to himself.

Hint: Sit with Tony at the top of the tower until he speaks again; leaving now undoes the evening. · check: `sit:mv-tony:tower`

#### <a id="mv-im15-return"></a>Scene `mv-im15-return`

_The top of the tower. Tony stands among dead screens, armour open, face perfect. His eyes look very tired._  
**Superior Iron Man** _(sad)_: I fixed myself, Keeper. No shaking hands. No drink. No doubt. Why does everyone look at me like that?  
**Superior Iron Man**: The old Tony was weak. He needed people sitting up with him. I don’t need anyone.  
_Your Nubbin walks across the floor to him, slowly, and sits by his boot, the way it did on the docks._  
_It hums four notes, slightly flat. His head comes up as if someone had said his name._  
**Superior Iron Man** _(think)_: Who taught the little one that?  
_Nobody did. It just never forgot._  
**Pepper Potts** _(soft)_: You needed people. That wasn’t the weak part. That was the best part.  
**Superior Iron Man**: I don’t remember why that matters.  
**You**: Then let us remind you.  
_On his desk: a row of steel washers, a red drive, and the dented chest plate from the cave._  

**Choices**

- **Pick up the chest plate. Tell him about Yinsen.** — sets `{"mv-im15-reminder":"yinsen"}`
    - **You**: A man gave you ninety seconds once. He asked you to make something better than weapons.
    - **Superior Iron Man**: Something better. He asked me with his last breath. And I made… this.
- **Pick up the washers. Tell him about the first morning.** — sets `{"mv-im15-reminder":"washers"}`
    - **You**: You made the first one when you didn’t know how to stop. You stopped anyway. One day, then the next.
    - **Superior Iron Man**: A washer a year. I made a plan out of washers. That was… that was me.
- **Pick up the drive. Tell him the backup kept everything.** — sets `{"mv-im15-reminder":"drive"}`
    - **You**: A copy of you once woke with nothing but your memories. It chose to protect you. It was still you.
    - **Superior Iron Man**: He kept the fruit. On the docks. He kept that.

#### <a id="mv-im15-return-walk"></a>Variant `mv-im15-return-walk`

_Variant of `mv-im15-return`._

_The top of the tower. Tony stands among dead screens, armour open, face perfect. His eyes look very tired._  
**Superior Iron Man** _(sad)_: I fixed myself, Keeper. No shaking hands. No drink. No doubt. Why does everyone look at me like that?  
**Superior Iron Man**: The old Tony was weak. He needed people sitting up with him. I don’t need anyone.  
_Your Nubbin walks across the floor to him, slowly, and sits by his boot, the way it did on the docks._  
_It hums four notes, slightly flat. His head comes up as if someone had said his name._  
**Superior Iron Man** _(think)_: Who taught the little one that?  
_Nobody did. It just never forgot._  
**Superior Iron Man** _(think)_: A cave. A bad bulb. Two round animals holding a torch while a dying man tightened my bolts. Why is that still in here?  
**Pepper Potts** _(soft)_: Because it’s you. That’s the bit the cure couldn’t reach.  
**Pepper Potts** _(soft)_: You needed people. That wasn’t the weak part. That was the best part.  
**Superior Iron Man**: I don’t remember why that matters.  
**You**: Then let us remind you.  
_On his desk: a row of steel washers, a red drive, and the dented chest plate from the cave._  

**Choices**

- **Pick up the chest plate. Tell him about Yinsen.** — sets `{"mv-im15-reminder":"yinsen"}`
    - **You**: A man gave you ninety seconds once. He asked you to make something better than weapons.
    - **Superior Iron Man**: Something better. He asked me with his last breath. And I made… this.
- **Pick up the washers. Tell him about the first morning.** — sets `{"mv-im15-reminder":"washers"}`
    - **You**: You made the first one when you didn’t know how to stop. You stopped anyway. One day, then the next.
    - **Superior Iron Man**: A washer a year. I made a plan out of washers. That was… that was me.
- **Pick up the drive. Tell him the backup kept everything.** — sets `{"mv-im15-reminder":"drive"}`
    - **You**: A copy of you once woke with nothing but your memories. It chose to protect you. It was still you.
    - **Superior Iron Man**: He kept the fruit. On the docks. He kept that.

#### <a id="mv-im15-return-doubt"></a>Variant `mv-im15-return-doubt`

_Variant of `mv-im15-return`._

_The top of the tower. Tony stands among dead screens, armour open, face perfect. His eyes look very tired._  
**Superior Iron Man** _(sad)_: I fixed myself, Keeper. No shaking hands. No drink. No doubt. Why does everyone look at me like that?  
**Superior Iron Man**: The old Tony was weak. He needed people sitting up with him. I don’t need anyone.  
_Your Nubbin walks across the floor to him, slowly, and sits by his boot, the way it did on the docks._  
_It hums four notes, slightly flat. His head comes up as if someone had said his name._  
**Superior Iron Man** _(think)_: Who taught the little one that?  
_Nobody did. It just never forgot._  
**Superior Iron Man** _(think)_: Somebody asked, once, whether it could be done in a week. I remember the question. I can’t remember why it mattered.  
**Pepper Potts** _(soft)_: It mattered because you were building it for someone else.  
**Pepper Potts** _(soft)_: You needed people. That wasn’t the weak part. That was the best part.  
**Superior Iron Man**: I don’t remember why that matters.  
**You**: Then let us remind you.  
_On his desk: a row of steel washers, a red drive, and the dented chest plate from the cave._  

**Choices**

- **Pick up the chest plate. Tell him about Yinsen.** — sets `{"mv-im15-reminder":"yinsen"}`
    - **You**: A man gave you ninety seconds once. He asked you to make something better than weapons.
    - **Superior Iron Man**: Something better. He asked me with his last breath. And I made… this.
- **Pick up the washers. Tell him about the first morning.** — sets `{"mv-im15-reminder":"washers"}`
    - **You**: You made the first one when you didn’t know how to stop. You stopped anyway. One day, then the next.
    - **Superior Iron Man**: A washer a year. I made a plan out of washers. That was… that was me.
- **Pick up the drive. Tell him the backup kept everything.** — sets `{"mv-im15-reminder":"drive"}`
    - **You**: A copy of you once woke with nothing but your memories. It chose to protect you. It was still you.
    - **Superior Iron Man**: He kept the fruit. On the docks. He kept that.

#### <a id="mv-im15-return-decoy"></a>Variant `mv-im15-return-decoy`

_Variant of `mv-im15-return`._

_The top of the tower. Tony stands among dead screens, armour open, face perfect. His eyes look very tired._  
**Superior Iron Man** _(sad)_: I fixed myself, Keeper. No shaking hands. No drink. No doubt. Why does everyone look at me like that?  
**Superior Iron Man**: The old Tony was weak. He needed people sitting up with him. I don’t need anyone.  
_Your Nubbin walks across the floor to him, slowly, and sits by his boot, the way it did on the docks._  
_It hums four notes, slightly flat. His head comes up as if someone had said his name._  
**Superior Iron Man** _(think)_: Who taught the little one that?  
_Nobody did. It just never forgot._  
**Superior Iron Man** _(think)_: Someone in a cave once suggested a weapon that jams. The weak Tony said no. I would have said yes and been out in a day.  
**Pepper Potts** _(angry)_: And Yinsen would have died for nothing. Listen to yourself.  
**Pepper Potts** _(soft)_: You needed people. That wasn’t the weak part. That was the best part.  
**Superior Iron Man**: I don’t remember why that matters.  
**You**: Then let us remind you.  
_On his desk: a row of steel washers, a red drive, and the dented chest plate from the cave._  

**Choices**

- **Pick up the chest plate. Tell him about Yinsen.** — sets `{"mv-im15-reminder":"yinsen"}`
    - **You**: A man gave you ninety seconds once. He asked you to make something better than weapons.
    - **Superior Iron Man**: Something better. He asked me with his last breath. And I made… this.
- **Pick up the washers. Tell him about the first morning.** — sets `{"mv-im15-reminder":"washers"}`
    - **You**: You made the first one when you didn’t know how to stop. You stopped anyway. One day, then the next.
    - **Superior Iron Man**: A washer a year. I made a plan out of washers. That was… that was me.
- **Pick up the drive. Tell him the backup kept everything.** — sets `{"mv-im15-reminder":"drive"}`
    - **You**: A copy of you once woke with nothing but your memories. It chose to protect you. It was still you.
    - **Superior Iron Man**: He kept the fruit. On the docks. He kept that.

#### <a id="mv-im15-return-done"></a>Done `mv-im15-return-done`

_Tony sits down on the floor. After a long while, he starts to shake. Pepper sits down next to him._  
**Tony Stark** _(sad)_: I did terrible things here. I remember every one of them. I’m going to have to keep remembering.  

### Complete

#### <a id="mv-im15-complete"></a>Complete `mv-im15-complete`

**Tony Stark** _(sad)_: I’ll pay back every person. Every dollar. Every day they lost. It’ll take a while.  
**Pepper Potts** _(soft)_: Then we’ll take a while.  
**Pepper Potts** _(soft)_: I’ve put it in the calendar. Friday: come home.  
**Tony Stark** _(happy)_: Friday. Home. I’ll be early.  
_He is, by an hour. Pepper pretends she hadn’t been watching the door._  
**Matt Murdock**: For what it’s worth, Stark, your heartbeat sounds like you again. Slower. More scared. Better.  
_Tony unpins something from his old jacket and fastens it to your coat: a small ring of glowing blue light._  
**Tony Stark** _(soft)_: An arc-reactor badge. The thing that kept my heart going. You did that too, all of you, every time.  
**Tony Stark** _(think)_: The gate’s going to take you somewhere bigger soon. A war, maybe. Whatever side I’m on, I’ll still be me.  
_Your Nubbins climb onto the windowsill and watch the city lights come back on, one block at a time._  

**Rewards**

- Arc-Reactor Badge (cosmetic): A small glowing blue badge from Tony’s jacket, worn on your Keeper’s coat.
- Iron Keeper (title): Title for finishing the Iron Man line, IM1 to IM15.

Sets on completion: `{"mv-im15":true,"mv-im-complete":true}`

**Notes:** Completes the Iron Man line (sets mv-im-complete). Needs IM10: Extremis 3.0 builds on it. Speaker "superior" is the inverted Tony, with a white-armour portrait and a too-smooth face; after the step 3 choice the speaker switches back to "tony" with his normal portrait, which is the visual cue that he is himself again. The desk items call back to IM1 (chest plate), IM5 (washers, one per year) and IM14 (drive); the choice only changes which callback plays. Step 2’s done choice (mv-im15-app: free / dark) is the Keeper’s view on the cure; the app stays down either way within this storyline. Daredevil’s brief restored sight is reported, not shown. Required for Civil War (E1), which follows straight on from the last line. Check Superior Iron Man #1–9 beats before ship.
