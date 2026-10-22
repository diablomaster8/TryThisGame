# Neopia line (NP1–NP13)

## NP1. The Hunt for the Battledome

*Neopets site plot: The Hunt for the Battledome (October 2000)* · audience: all · where: Neopia Central, just inside the rainbow gate · when: On your first visit to Neopia.

**Cast:** Sarkis (Sarkis (Neopets, Hunt for the Battledome)), Ursulla (Ursulla (Neopets, Hunt for the Battledome)), Buckley (Buckley (Neopets, Hunt for the Battledome)), Professor Chesterpot (Professor Chesterpot (Neopets)), King Kelpbeard (King Kelpbeard (Neopets)), Dr. Sloth (Dr. Sloth (Neopets))

### Step 1: Follow the brochure to Mystery Island and look for the next clue.

Hint: Take the boat from Neopia Central’s harbour to Mystery Island and search the beach. · check: `visit:neopia:mystery-island`

#### Scene `np01-brochure`

_Past the rainbow gate, Neopia Central is all bunting and shop bells. Someone is waving a leaflet at you like a flag._  
**Sarkis** _(happy)_: You! Keeper! You look brave, or at least awake. Have you seen this?  
_The leaflet says THE BATTLEDOME in gold letters. Underneath, smaller: Location secret. Bring a friend._  
_Underneath that, smaller still: Terms and conditions apply. Conditions may be damp._  
**Ursulla**: Sarkis found it in a soup bowl at the Soup Kitchen. We’re choosing to believe that’s a sign.  
**Buckley**: I’m choosing to believe it’s litter. But I’ve packed sandwiches, so I’m coming.  
**Sarkis** _(think)_: There’s a palm tree printed on the back. Palm trees mean Mystery Island. Everyone knows that.  
**Ursulla**: Everyone does not know that.  
_Your Nubbin sniffs the leaflet, sneezes, and looks at the harbour with great interest._  
**Sarkis** _(happy)_: Your little one’s in. So are you, yes? Say yes.  

**Choices**

- **Say yes. Obviously.** — sets `{"np-01-eager":true}`
    - **Sarkis**: That’s the spirit. Buckley, give them a sandwich.
    - **Buckley**: It’s cheese. Don’t get excited.
- **Ask what a Battledome actually is.**
    - **Ursulla**: A place where pets test their skill. Fairly, with rules. Supposedly.
    - **Sarkis**: Supposedly the best place in the world!
- **Point out there’s no map.**
    - **Buckley**: Thank you. Finally. Someone with sense.
    - **Sarkis**: Maps are for people who already know where they’re going.

#### Done `np01-brochure-done`

_On the beach, half buried, is a bottle with a rolled-up note inside._  
**Ursulla** _(think)_: It says: The dome is under the waves. Ask for the professor. Trust nobody in a lab coat.  
**Buckley**: Under the waves. Wonderful. I packed sandwiches, not gills.  
**Sarkis** _(happy)_: Trust nobody in a lab coat. I’m in a cardigan. We’re fine.  
_Your Swim Nubbin is already wading in, delighted._  

### Step 2: Dive to Maraqua with a Swim Nubbin and find Professor Chesterpot’s hidden house.

Hint: Only Swim Nubbins can enter Maraqua. Look for a brass door among the coral. · check: `find:place:chesterpots-house`

#### Scene `np01-dive`

_A Maraquan guard hands you a bubble helmet. It smells of seaweed and other people’s breath._  
_Only Swim Nubbins can follow you down. The others wait on the sand with Buckley and the sandwiches._  
_Maraqua glows below: coral towers, lantern fish, a palace shaped like a giant shell._  
_A sign at the city gate reads: WELCOME TO MARAQUA. PLEASE DO NOT TAP ON THE GLASS. There is no glass._  
**Ursulla**: Ask for the professor, the note said. Quietly. He’s hiding for a reason.  
**Sarkis**: Quietly. Right. Got it.  
**Sarkis** _(shock)_: PROFESSOR? ANYONE? WE’VE GOT A BROCHURE!  
**Ursulla**: That was the opposite of quietly.  
_Somewhere in the coral, a brass door snaps shut. A shutter rattles._  
**Sarkis** _(happy)_: Well. Now we know somebody’s home.  

#### Done `np01-dive-done`

**Professor Chesterpot** _(shock)_: If you’re selling sponges, I have plenty. If you’re a robot, I have a mop.  
_Your Nubbin pokes its head through the letterbox and blinks at him._  
**Professor Chesterpot** _(soft)_: Oh. You’re not a robot. Robots don’t blink like that. Come in, quickly.  

### Step 3: Hold off Mechachiazilla for three rounds until Kelpbeard’s friend arrives.

Hint: You only have to survive this bout. Swim Nubbins move fastest underwater. · check: `karate:survive:mechachiazilla:3`

#### Scene `np01-sloth`

**Professor Chesterpot**: Yes, I built the Battledome. A place where pets test themselves safely, with rules.  
**Professor Chesterpot** _(think)_: I hid it because someone wants it for armies, not sport. He writes to me. Green ink. Very neat.  
**Sarkis**: Who does?  
_Every lantern fish in the room goes dark at once._  
**Dr. Sloth**: Professor. You never answer my letters. So I have come for the reply in person.  
_Green light floods the window. A metal claw the size of a boat closes around the house._  
**Professor Chesterpot** _(shock)_: Keep the dome safe! The key is in the…  
_The claw lifts him away. Up from the trench rises a giant mechanical Chia, eyes like headlamps._  
**Dr. Sloth**: Mechachiazilla, flatten the city. Slowly. I want them to watch.  
**King Kelpbeard** _(angry)_: Not in my kingdom. Keeper! Hold that machine back while I call an old friend.  

**Choices**

- **Put your bravest Nubbin in front.** — sets `{"np-01-tactic":"front"}`
    - Your Nubbin plants its feet and puffs itself up to twice its size. It is not twice as big. It is very brave.
- **Make lots of noise to draw it away from the houses.** — sets `{"np-01-tactic":"noise"}`
    - **Sarkis**: Noise! I can do noise!
    - Sarkis does noise.
- **Get the townsfolk into the palace first.** — sets `{"np-01-tactic":"evacuate"}`
    - **Ursulla**: Good. Buildings mend. People take longer.

#### Done `np01-sloth-done`

_The seabed shudders. Something enormous and leafy climbs out of the trench._  
**King Kelpbeard** _(happy)_: Chiazilla! Thank you for coming, old friend.  
_Chiazilla wraps the machine in a hug it cannot escape. Bolts ping off in every direction._  
**Dr. Sloth** _(angry)_: Keep your little dome, Kelpbeard. I have bigger plans, better robots and a far superior collar.  
_A green pod shoots toward the surface. The claw lets go, and the professor drifts down like a sycamore seed._  

#### Complete `np01-complete`

**Professor Chesterpot** _(happy)_: Well. A secret isn’t much use once a robot has stood on it.  
**Professor Chesterpot**: The Battledome is open. To everyone. Fair bouts, real rules, no armies.  
**Ursulla** _(think)_: Everyone? Even people like him?  
**Professor Chesterpot**: Especially people like him. A rule that only binds your friends isn’t a rule. It’s a favour.  
**Sarkis** _(happy)_: We found it! Technically the robot found it. But we were there!  
_Back on the beach, Buckley hands round the sandwiches. They are slightly damp. Conditions, as promised, apply._  
_The Neopian Times runs it as DOME SWEET DOME. Sarkis buys eleven copies and frames the crossword._  
_By the rainbow gate, a new door appears, painted like a dome. Above it, a sign: Battledome. Play fair._  
_Far above the sea, a green light blinks once and goes out._  

**Rewards**

- Battledome mode (feature): Opens the Battledome in Neopia: battle items, weapons and challengers from every land, kept in the Neopia save.
- Neopian Times: DOME SWEET DOME (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Friend of Chiazilla (title): A trophy avatar for finding the Battledome.

Sets on completion: `{"np-01-done":true}`

**Learning Grove swaps**

- `np01-sloth#8` → Mechachiazilla, find that Battledome. Anything in the way, step over it. Loudly.

**Notes:** Audience all. Steps 2–3 are underwater: only Swim Nubbins may be in the party (the Maraqua rule); the Keeper wears a bubble helmet. Sloth thread: first appearance, as a voice over the claw and a green escape pod; the closing green light is him watching. Step 3 is a survive-only karate bout (no win needed); Chiazilla arrives on a cutscene at round 3. Art: Mechachiazilla (giant robot Chia), Chiazilla (leafy giant Chia), Chesterpot’s brass door. Battledome is the only unlock the brief lists; the Neopian Times page and avatar follow the brief’s Features section and repeat for every plot.

## NP2. The Tyrannian Invasion

*Neopets site plot: The Tyrannian Invasion (March–May 2001)* · audience: main · where: Terror Mountain, the Ice Caves · when: The first time you enter the Ice Caves after NP1. · requires: NP1

**Cast:** Taelia (Taelia the Snow Faerie (Neopets)), The Lupe (The Lupe who defeated the Monoceraptor (Neopets)), A Voice (Dr. Sloth, unseen (Neopets))

### Step 1: Hold the Ice Caves against the first wave: Korbat scouts.

Hint: Wave bouts run back to back. Put Fly Nubbins up front against fliers. · check: `karate:wave:tyrannian-invasion:1`

#### Scene `np02-quake`

_The Ice Caves are blue and silent. Then they aren’t._  
_The floor bucks. Icicles fall like dropped cutlery. A crack splits the far wall, and warm air pours out._  
_It smells of moss, smoke, and something big that hasn’t washed._  
**Taelia** _(shock)_: That crack goes down to Tyrannia. It has been sealed since before the mountain had a name.  
**The Lupe** _(think)_: It isn’t sealed now. Listen.  
_Wings. Hundreds of leathery wings, coming up out of the dark._  
**The Lupe**: Korbat scouts. They’re here to count us. Let’s give them a small number to take home.  
**Taelia**: Keeper, your Nubbins are quick. Hold the cave mouth while I warn Happy Valley.  
_Your Nubbins line up at the cave mouth. One has an icicle stuck to its head and refuses to mention it._  

#### Done `np02-quake-done`

**The Lupe**: Scouts are running home. That means the real thing is next.  
_One Korbat circles back, counts your Nubbins on its claws, gets a different number twice, and gives up._  
_Far below, drums. Slow ones._  

### Step 2: Beat the second and third waves: Grarrl troopers, then Skeith invaders.

Hint: Grarrls hit hard but slowly. Skeiths are slow to start, so strike early. · check: `karate:wave:tyrannian-invasion:3`

#### Scene `np02-troopers`

_By dawn the mountain road is full of armour: Grarrl troopers, shields up, stamping in time._  
_Behind them, too lazy to march, Skeith invaders ride on carts pulled by other Skeiths._  
**The Lupe**: They want the pass. If they get it, they get Happy Valley, and then the whole mountain.  
**Taelia**: The toy workshop is still full of children finishing orders. We need time.  
_A Grarrl captain bangs his shield and roars something that is mostly teeth._  
**The Lupe**: Two waves. Troopers first, Skeiths after. Don’t chase them down the hill.  
_Your Nubbins crouch, ready. The snow creaks under a great many feet._  
**The Lupe** _(think)_: So. Where do we stand?  

**Choices**

- **Hold the narrow pass.** — sets `{"np-02-tactic":"pass"}`
    - **The Lupe**: Good. Narrow means one at a time. Even Grarrls only fit one at a time.
- **Fall back to the Ski Lodge walls.** — sets `{"np-02-tactic":"lodge"}`
    - **Taelia**: The walls are thick and the cocoa is hot. I approve of both.
- **Send a Fly Nubbin up to watch their flanks.** — sets `{"np-02-tactic":"scout"}`
    - Your Fly Nubbin circles high and comes back chirping. There’s a goat track the Skeiths are too lazy to climb.
    - **The Lupe**: Then that’s our door.

#### Done `np02-troopers-done`

_The Skeiths decide this is all too much effort and sit down in the snow. Several fall asleep._  
**The Lupe**: I’d call it a weakness, but honestly they look comfortable.  

### Step 3: Beat the fourth wave: Chia bombers over Happy Valley.

Hint: Bombers drop sticky patches that slow you. Keep moving and let Taelia freeze the ground. · check: `karate:wave:tyrannian-invasion:4`

#### Scene `np02-bombers`

_A whistle overhead. Then another. Then the sky is full of round shapes, falling._  
**Taelia** _(shock)_: Chia bombers! They’re dropping something from the clouds!  
_A pod bursts on the toy workshop roof. It’s full of extremely sticky sap._  
**The Lupe**: Tar-fruit. Get stuck in that and you stay stuck.  
_One of your Nubbins steps in a puddle of it and now has very firm opinions about the floor._  
**Taelia**: I can freeze the tar so it cracks. But only if someone keeps the bombers busy.  
**The Lupe**: The Keeper’s Nubbins. They’re faster than my lot, and they don’t complain.  
_Your Nubbins look at each other. One complains a little._  

#### Done `np02-bombers-done`

**Taelia** _(happy)_: Frozen. Crack it and walk on.  
_The tar shatters like toffee. The workshop windows are saved, mostly._  
**The Lupe** _(happy)_: Tar-fruit brittle. If we live through this, I’m selling it in Happy Valley.  

### Step 4: Keep the Monoceraptor busy for three rounds so the Lupe can strike.

Hint: You can’t win this bout on damage. Dodge, and stay close to draw its eye. · check: `karate:survive:monoceraptor:3`

#### Scene `np02-monoceraptor`

_The mountain goes quiet. Even the wind waits._  
_Up from the crack climbs a beast with one great horn and a jaw like a castle gate._  
**Taelia** _(shock)_: The Monoceraptor. The old stories said it was the last thing Tyrannia would ever send.  
**The Lupe**: Then it’s the last thing we have to beat.  
**The Lupe** _(think)_: I need it to look away from me for one breath. One. That’s all.  
_Your Nubbins press against your legs. One is shaking. It doesn’t step back._  
_The Monoceraptor lowers its horn and paws the ice._  
**The Lupe**: Keeper. Your call.  

**Choices**

- **Have your Nubbins run circles round its feet.** — sets `{"np-02-lure":"circles"}`
    - Your Nubbins scatter five ways at once. The Monoceraptor tries to watch them all and cricks its neck.
- **Stand in the open and shout at it yourself.** — sets `{"np-02-lure":"shout"}`
    - **You**: Oi! Horn-face! Over here!
    - **The Lupe**: That will definitely work. Run now.
- **Throw a snowball at its eye.** — sets `{"np-02-lure":"snowball"}`
    - It is a good snowball. It is not a big snowball. It is enough.

#### Done `np02-monoceraptor-done`

_One leap. One blow, right under the horn. The Monoceraptor sways, sits, and topples back into the crack._  
**The Lupe** _(happy)_: Done. Someone write that down. I won’t remember how.  

#### Complete `np02-complete`

_The crack groans. Far below, something answers._  
**A Voice**: A useful test. Thank you. I learned a great deal about your mountain.  
**A Voice**: Tyrannia was only the first door. Next time, Keeper, I bring an army of my own.  
**Taelia** _(think)_: Who was that?  
**The Lupe** _(think)_: Nobody from Tyrannia. Tyrannians don’t say thank you.  
**The Lupe**: Half the Grarrls we fought had farm mud on their boots. Somebody marched them up here.  
**Taelia** _(think)_: So what do we do with the hole? Wall it up for good, or leave a door?  
_Your Nubbins look down the crack, then at each other. One drops a snowball in, to see how deep it goes. It is still falling._  

**Choices**

- **Wall it up. Nobody gets marched up here again.** — sets `{"np-02-crack":"sealed"}`
    - Taelia raises a wall of ice a hundred feet thick. Your Nubbins add a snowball each, to be safe.
    - **The Lupe**: Safe. Cold, but safe. Most good things up here are both.
    - The Neopian Times prints it: MOUNTAIN HOLDS. The photo is mostly snow and one Nubbin’s blurry tail.
- **Leave a door with a bell. Neighbours should be able to knock.** — sets `{"np-02-crack":"door"}`
    - Taelia shapes an ice door with a brass bell. A sign beside it, in three languages: KNOCK. NO ARMIES.
    - **The Lupe**: If those farmers ever come up on their own, they’ll want somewhere to knock.
    - The Neopian Times prints it: MOUNTAIN HOLDS (PLEASE KNOCK). The photo is mostly snow and one Nubbin’s blurry tail.

**Rewards**

- Neopian Times: MOUNTAIN HOLDS (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Defender of Terror Mountain (title): A trophy avatar for turning back the Tyrannian Invasion.

Sets on completion: `{"np-02-done":true}`

**Notes:** Audience main: a war plot, so it stays out of the Learning Grove. Nothing crude; the rating is only about the battle theme. Plays as a run of karate bouts in waves (karate:wave:tyrannian-invasion:<n> counts waves cleared): 1 Korbat scouts (fliers), 2 Grarrl troopers (heavy, slow), 3 Skeith invaders (slow starters), 4 Chia bombers (drop sap patches that slow movement; Taelia freezes them on a timer), then the Monoceraptor as a 3-round survive bout; the Lupe lands the finishing blow in a cutscene. No healing between waves inside a step; full heal between steps. Sloth thread: the Voice in the closing scene is Sloth, never named here. NP13 calls back to it. Sound: distant drums under step 1 done. Closing choice sets `np-02-crack` (sealed | door): an ice wall or an ice door with a bell in the Ice Caves art. Flavour only; Tyrannia is still reached by its usual route either way. The brief lists no unlock for NP2: rewards are the standard Times page and avatar.

## NP3. The Ski Lodge Mystery

*Neopets site plot: The Ski Lodge Murder Mystery (February–May 2001), all-ages version* · audience: all · where: Terror Mountain, the Ski Lodge · when: After NP1 (in the main game, after NP2), a letter from the Lodge Manager arrives by snow-post. · requires: NP1

**Cast:** The Lodge Manager, A Kacheek Guest, Maverick (Maverick, the robot culprit of the Ski Lodge plot (Neopets)), Taelia (Taelia the Snow Faerie (Neopets))

### Step 1: Question the four guests and staff still at the lodge.

Hint: They are in the lounge, the kitchen, the ski shed and the hot tub. Tap each to talk. · check: `talk:ski-lodge:guests:4`

#### Scene `np03-arrive`

_The Ski Lodge is warm, pine-panelled, and far too quiet for a holiday._  
**The Lodge Manager** _(shock)_: Welcome, welcome. Please don’t leave. I mean, enjoy your stay. I mean, please don’t leave.  
**The Lodge Manager** _(sad)_: Three guests have gone missing this week. Their skis are still in the rack. Their cocoa was still warm.  
_Over the fireplace hangs a portrait of the old owner: a thin green face, a high collar, a smile that reaches nothing._  
**The Lodge Manager** _(think)_: Him? He owned the place before me. Sold it cheap and left in a hurry.  
**The Lodge Manager**: I’ve never managed to take that painting down. The nails are bolted to something.  
_A new bellhop glides past with a tray. It doesn’t bounce when it walks. It doesn’t blink._  
**Maverick**: Good evening. I am Maverick. Your room is ready. Your room is always ready.  
_Your Nubbin hides behind your boot and watches Maverick all the way down the corridor._  

**Choices**

- **Look closer at the portrait.**
    - In one corner, painted very small, is a fly. Up close, its wings are real metal.
- **Ask about the new bellhop.**
    - **The Lodge Manager**: Maverick? He came with the building. Never sleeps. Never eats. Never gets my name right.
- **Order a cocoa and keep your eyes open.**
    - The cocoa is excellent. Your eyes stay open. Your Nubbin’s do not.

#### Done `np03-arrive-done`

_Everyone saw something cold in the night. Nobody saw who._  
**A Kacheek Guest** _(shock)_: I heard whirring. Then a polite cough. Then I hid in a wardrobe until it was light.  
**The Lodge Manager** _(shock)_: And now the cook’s gone too.  
**Maverick**: Breakfast is cancelled. Breakfast is always cancelled.  

### Step 2: Follow the frosty trail and find three clues.

Hint: Look for oil drops, frost marks and anything metal. Your Nubbin will sniff out ones you miss. · check: `find:clue:ski-lodge:3`

#### Scene `np03-trail`

_Morning. The cook’s apron lies on the kitchen floor, stiff with frost._  
_A trail crosses the tiles: little drops of oil, and square footprints that steam slightly._  
**A Kacheek Guest** _(shock)_: Square feet! Who has square feet? I have normal feet. Look.  
**The Lodge Manager**: Please keep your feet on.  
_Your Nubbin follows the trail with its nose, then sneezes. Oil. Definitely oil._  
**The Lodge Manager**: It goes toward the cellar. Nobody goes in the cellar. It came with the building too.  
_The cellar door is locked from the inside._  
**A Kacheek Guest** _(think)_: Well, I’m not saying who I suspect. But I suspect someone.  

**Choices**

- **Suspect the manager. He bought the place cheap.** — sets `{"np-03-suspect":"manager"}`
    - **The Lodge Manager**: Me? I’m far too tired to kidnap anyone. Look at my eyes.
- **Suspect the guest with the very normal feet.** — sets `{"np-03-suspect":"guest"}`
    - **A Kacheek Guest**: I came here to ski! I can’t even ski! That’s my alibi!
- **Suspect Maverick.** — sets `{"np-03-suspect":"maverick"}`
    - Upstairs, very softly, something whirrs.

#### Done `np03-trail-done`

_The third clue is a metal button, warm to the touch, stamped with a small green V._  
**The Lodge Manager** _(think)_: V. V for… vacuum? Vacation? Very Suspicious?  
**A Kacheek Guest**: That’s two letters.  
_You pocket it. It hums faintly, as if it is still listening._  

### Step 3: Switch Maverick off in a karate bout without cracking the ice blocks.

Hint: Maverick is slow to turn. Circle him and hit the switch on his back. · check: `karate:win:maverick`

#### Scene `np03-cellar`

_The cellar is colder than outside. Ice blocks stand along the walls like a library of frozen books._  
_In each block, a guest: eyes shut, cheeks pink, perfectly still. The cook is still holding a whisk._  
**The Lodge Manager** _(shock)_: They’re frozen. Not hurt. Just… frozen.  
**Maverick**: Correct. Frozen guests do not complain, check out, or ask for extra towels.  
**Maverick**: My orders are to keep the lodge empty until the owner returns. He has not returned. So I keep it empty.  
**You**: Who gave you those orders?  
**Maverick**: The owner. His voice is in my memory. Would you like to hear it?  
_A crackle, then a thin, pleased voice: “Keep it empty, Maverick. I’ll be back for it.”_  
**Maverick**: Please step into the freezer. Your room is ready. Your room is always ready.  

#### Done `np03-cellar-done`

_Your Nubbin hops onto Maverick’s back and sits squarely on the big red switch._  
**Maverick**: Your room is… ready…  
_His eyes go dark. The whirring stops._  
**The Lodge Manager** _(think)_: What do we do with him? He froze my cook. He also polished every spoon in the building.  

**Choices**

- **Melt him down. Orders or not, he froze people.** — sets `{"np-03-maverick":"scrapped"}`
    - **The Lodge Manager**: Fair. I’ll keep his bow tie, though. It’s a very good bow tie.
- **Wipe his orders and give him an honest job.** — sets `{"np-03-maverick":"rehired"}`
    - Later, wiped clean and rebooted, Maverick bows to the first guest down the stairs.
    - **Maverick**: Your room is ready. You may leave it whenever you like. That part is new.

#### Complete `np03-complete`

**Taelia** _(shock)_: Somebody called for a Snow Faerie? Oh my. That is a lot of very cold people.  
_Taelia breathes on each block gently, the way you’d breathe on a window._  
_The guests thaw one by one, sneeze, and ask what time breakfast is._  
**A Kacheek Guest** _(think)_: I had the strangest dream. I was an ice lolly.  
**The Lodge Manager** _(happy)_: Free cocoa for life. For you, your Nubbins and anyone you bring. I mean it.  
**Taelia** _(think)_: Whoever built that robot built it to wait. That kind of patience doesn’t give up.  
_Upstairs, the portrait has been taken down. Behind it is a bare patch of wall and four bolts, already unscrewed._  
_The Neopian Times runs it as COLD CASE CLOSED, with a cartoon of Maverick in a bobble hat. It sells out._  

**Rewards**

- Neopian Times: COLD CASE CLOSED (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Lodge Detective (title): A trophy avatar for unmasking Maverick.

Sets on completion: `{"np-03-done":true}`

**Notes:** Requires NP1 only, so the Learning Grove can reach it; the main game still plays it after NP2 (see the header). Audience all. The original was a murder mystery; here the guests are frozen in ice, never hurt, and Taelia thaws them all at the end, as the brief requires. The suspect choice in step 2 is flavour only; Maverick is always the culprit. The step 3 done choice sets `np-03-maverick` (scrapped | rehired): if rehired, Maverick stands at the lodge desk on later visits as a harmless bellhop. Sloth thread: the portrait of the old owner (Sloth, never named), the metal fly painted in its corner (it reappears for real in NP4), the button stamped V (Virtupets), and the recorded voice. The portrait vanishing at the end means he has been back. Step 3 bout has a fail state if a fighter is knocked into an ice block (block cracks, bout restarts; no harm to the guest). Art: Maverick as a tall butler-robot with a red switch on his back; square steaming footprints. No unlock listed in the brief; standard Times page and avatar.

## NP4. The Usurper

*Neopets site plot: The Usurper (July 2001)* · audience: all · where: Lost Desert, Sakhmet palace · when: After NP3, an invitation to the palace feast. · requires: NP3

**Cast:** King Coltzan III (King Coltzan III (Neopets)), Princess Sankara (Princess Sankara (Neopets)), Vyssa (Vyssa (Neopets)), The Royal Cook, The Captain of the Guard, The Court Scribe

### Step 1: Question the five people who served the high table.

Hint: Sankara, Vyssa, the Cook, the Captain and the Scribe are all still in the hall. Tap each one. · check: `talk:usurper:suspects:5`

#### Scene `np04-feast`

_Sakhmet glows gold at sunset. The palace is feasting: Tyrannia was beaten back, and the voice in the dark has gone quiet._  
**King Coltzan III** _(happy)_: Keeper! The friend of Terror Mountain. Sit, sit. Your Nubbins too. Nobody stands at my table.  
_The centrepiece is a cake shaped like a sulking green villain in a high collar. Guests cheer each time it’s cut._  
**King Coltzan III** _(happy)_: To the villain who never came back! May he stay lost.  
_Five people carry the courses to the high table: Princess Sankara, Vyssa, the Royal Cook, the Captain of the Guard and the Court Scribe._  
_Halfway through, the king lifts his tea, drinks, and sets the cup down too hard._  
**King Coltzan III** _(shock)_: That tea… tastes of… sand.  
_He slumps in his chair. The music stops. Somebody screams, and a fig rolls off the table._  
**Princess Sankara** _(angry)_: Guards! Nobody leaves this hall!  

**Choices**

- **Run to the king.**
    - His breathing is slow. The physicians move you gently aside.
- **Watch who looks at what.** — sets `{"np-04-watchful":true}`
    - Nobody runs. But the Scribe has ink to the elbows, and Vyssa won’t look anywhere near the tea tray.
- **Get your Nubbin away from the food.**
    - Your Nubbin, who was reaching for a fig, is lifted up and away. It sulks.

#### Done `np04-feast-done`

_Five stories. Five people who all say they carried only one dish. Your clue log opens a new page._  
**The Court Scribe** _(sad)_: I’d like it noted that I have never tampered with anything. I’ve barely even misspelled anything.  
**The Captain of the Guard**: The physicians are with the king. Nobody leaves until we know who did this.  
_Somebody quietly removes the villain cake. It was looking far too pleased with itself._  

### Step 2: Find all eight clues and add them to your clue log.

Hint: Some clues come from people, some from places: the stairs, the teapot, the oven and the garden. · check: `find:clue:usurper:8`

#### Scene `np04-clues`

_The hall is locked. Your clue log shows a blank grid: five servers, five dishes, one cup that was tampered with._  
**The Royal Cook** _(angry)_: I made everything, but I only carried one dish up myself. You eat mine with a spoon, and it was perfect.  
**The Court Scribe** _(sad)_: I had a small accident on the stairs. Please don’t look at the stairs.  
**The Captain of the Guard**: I carried what came out of the oven. Hot. I burnt my thumb. Write that down too.  
**Vyssa**: Don’t ask me about the tea. I can’t bear spice. I stayed well away from that pot.  
**Princess Sankara** _(angry)_: I served the king’s guests with my own hands, as a princess should. Is that a crime now?  
_Your Nubbin sniffs the tipped-over teapot, sneezes, and backs away with its ears flat._  
**The Captain of the Guard** _(think)_: That pot went over right after the king drank. Clumsy, someone said. Very clumsy.  
_Out in the garden, a gardener is muttering about something he overheard last night._  

#### Done `np04-clues-done`

_Eight clues. The grid in your log is waiting._  
_Your Nubbin curls up on the clue log, which is unhelpful, and warm._  

### Step 3: Fill in the clue log grid: who carried each dish, and which dish was tampered with.

Hint: Start with the pudding: it never reached the table, so it can’t be the one, and neither can its carrier. · check: `puzzle:solve:usurper`

#### Scene `np04-solve`

_You sit by the window with the grid. Ticks, crosses, a lot of crossing out._  
**The Captain of the Guard**: Take your time. Actually, don’t. The princess wants to go to bed.  
**The Court Scribe** _(sad)_: If it helps, I didn’t do it. I can’t even carry a pudding.  
_Five rows, five columns. Every clue rules something out._  
_Something taps the window glass: a fly made of metal, with a tiny lens for a face and a green light on its back._  
_You look again and it has gone. Or it has moved. Hard to say._  
_Your Nubbin pats one square of the grid with its paw, then another, as if it already knows._  
**The Captain of the Guard**: When you’re sure, call everyone back into the hall.  

**Choices**

- **Chase the metal fly.** — sets `{"np-04-fly":"chased"}`
    - It zips up the chimney. You get soot on your nose. It gets away.
- **Ignore it. The answer is in the grid.** — sets `{"np-04-fly":"ignored"}`
    - You draw the curtain. Whoever is watching can watch a curtain.
- **Wonder aloud if this is the green villain’s doing.** — sets `{"np-04-fly":"suspected"}`
    - **The Captain of the Guard**: Him? He likes robots and speeches. This was quieter. This was someone close.

#### Done `np04-solve-done`

_The last square fills in. There is only one way the grid can work._  
_Your Nubbin taps the answer twice, smugly, as if it had known since the soup._  
_You close the log and send for everyone._  

#### Complete `np04-complete`

_Five suspects in a row, the whole court watching. Your Nubbin sits at your feet like a very small judge._  
**You**: The pudding never arrived. The soup, the bread and the figs went to everyone. Only the tea went to the king alone.  
**You**: And the tea was poured by Princess Sankara.  
**Princess Sankara** _(angry)_: You can’t prove that.  
**The Captain of the Guard**: The garden heard you, Highness. “Vyssa would wear the crown better than any of them.”  
**Vyssa** _(sad)_: I never asked for this. Not like this.  
_The guards lead Sankara out. Vyssa sits at the empty end of the table and doesn’t move._  
_At dawn, by the old shrine at the edge of town, a warm light hovers and will not go out. People say it is Coltzan, still keeping watch._  
**King Coltzan III** _(soft)_: You did well, Keeper. Come and visit me. I’ll have blessings to spare.  
_The Neopian Times prints your grid in full, with one square left blank for readers. Half of Sakhmet gets it wrong._  

**Rewards**

- Neopian Times: THE USURPER UNMASKED (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Royal Sleuth (title): A trophy avatar for solving the Usurper.

Sets on completion: `{"np-04-done":true,"np-coltzan-shrine":true}`

**Learning Grove swaps**

- `np04-feast#0` → Sakhmet glows gold at sunset. The palace is feasting, and the green villain hasn’t been seen for months.
- `np04-feast#6` → That tea… is very… sleepy…
- `np04-feast#7` → His eyes close and he starts to snore. Nobody can wake him. A fig rolls off the table.
- `np04-complete#7` → At dawn, the physicians bring water from the Healing Springs. The king opens one eye and asks who ate his cake.
- `np04-complete#8` → You did well, Keeper. Come to my shrine any time. I’ll have blessings to spare.

**Notes:** Audience all. In the main version Coltzan is poisoned and dies, and his spirit stays at Coltzan’s Shrine (which gives the shrine its blessing); goals and hints say “tampered with” rather than poisoned. Learning Grove version (childLines): a sleeping draught, cured with Healing Springs water; the shrine is simply his. LOGIC PUZZLE (clue log grid, 5 servers x 5 dishes, plus which dish was tampered with). Clues, as they should appear in the log: 1. The Cook carried a dish you eat with a spoon. 2. The rose pudding was dropped on the stairs and never reached the table. 3. There was ink smeared in the spilt pudding. Only the Scribe has inky sleeves. 4. The Captain carried something that came out of the oven. 5. Vyssa cannot bear the smell of spice and would not touch the spiced tea. 6. Everyone at the high table ate the lentil soup, the date bread and the honeyed figs, and only the king fell ill. 7. Only the king drank the spiced tea. The pot was knocked over straight afterwards. 8. The gardener overheard Sankara the night before: “Vyssa would wear the crown better than any of them.” Solution: Scribe = rose pudding (2, 3); Cook = lentil soup (1, pudding taken); Captain = date bread (4: the only baked dish left); Vyssa = honeyed figs (5); Sankara = spiced tea. The tea is the tampered dish (6, 7; the pudding never arrived). Motive from clue 8. Wrong guesses just leave the grid unsolved; no penalty. Clue sources for step 2: Cook, Scribe, stairs, Captain, oven, Vyssa, teapot, garden. Sloth thread: the villain cake, Coltzan’s toast, and the metal fly at the window (the one painted on the NP3 portrait). Sloth is not the culprit; the fly is only watching. Unlock: sets np-coltzan-shrine so Coltzan’s Shrine shows his light. Standard Times page and avatar.

## NP5. Champions of Meridell

*Neopets site plot: Champions of Meridell (July 2002–April 2003)* · audience: main · where: Neopia Central, the west road · when: After NP4. · requires: NP4

**Cast:** Lisha (Lisha (Neopets, Meridell plots)), Jeran (Jeran (Neopets, Meridell plots)), King Skarl (King Skarl (Neopets)), Lord Darigan (Lord Darigan (Neopets))

### Step 1: Travel with Lisha to Meridell.

Hint: The road to Meridell leaves from the west side of Neopia Central. · check: `visit:neopia:meridell`

#### Scene `np05-road`

_On the west road, a girl with a heavy pack is asking every traveller the same question._  
**Lisha**: Excuse me. Have you seen a Lupe in a borrowed helmet? About this tall, all ears, talks too much?  
**Lisha** _(sad)_: My brother, Jeran. He went to Meridell to be a knight. He stopped writing two months ago.  
**Lisha** _(angry)_: I’m Lisha. I’m going to find him, and then I’m going to shout at him. In that order.  
_She has a map, a sword she clearly doesn’t like, and three friends who look as tired as she does._  
_Your Nubbins fall into step beside her. One takes a corner of her map in its mouth, helpfully._  
**Lisha**: Meridell is three days west. Let’s make it two.  
**Lisha** _(think)_: Are you coming? You don’t have to. But you look like you’re coming.  

**Choices**

- **Offer to walk with her.** — sets `{"np-05-with-lisha":true}`
    - **Lisha**: Thank you. My friends are lovely, but they keep stopping for pies.
- **Ask what his last letter said.**
    - **Lisha**: That Meridell had something it shouldn’t. Something that glowed. Then nothing.
- **Ask why she carries a sword she doesn’t like.**
    - **Lisha**: Because Jeran took the good one.

#### Done `np05-road-done`

_Two days later, Meridell: green hills, fat turnips, and a signpost that just says MERIDELL, proudly, three times._  
_Then a shadow slides over all of it._  
**Lisha** _(shock)_: What is that?  

### Step 2: Hold Meri Acres Farm through three waves of Darigan soldiers.

Hint: Darigan soldiers drop in from above. Fly Nubbins meet them in the air; Power Nubbins hold the fence. · check: `karate:wave:champions-of-meridell:3`

#### Scene `np05-citadel`

_A fortress floats over the hills, dark and jagged, trailing mist like smoke._  
**King Skarl** _(angry)_: The Darigan Citadel. I knew they’d come. I didn’t know they’d come today.  
_A herald calls down from the Citadel’s gate: Meridell took their Orb long ago, and they have come to take it back._  
**Lisha**: Is that true?  
**King Skarl** _(think)_: It is… complicated. My grandfather borrowed it. Permanently.  
_The first Darigan soldiers land on Meri Acres on leathery wings. The farm’s Babaas bolt for the barn._  
**Jeran**: Hold the fence line! Don’t let them reach the castle road!  
**Lisha** _(shock)_: JERAN!  
**Jeran** _(shock)_: Lisha? What are you… not now! Help me hold the fence!  

**Choices**

- **Defend the farm with Jeran.** — sets `{"np-05-stance":"defend"}`
    - **Jeran**: Good. Shoulder to shoulder. You and your little ones take the left.
- **Shout up to the herald: why not talk?** — sets `{"np-05-stance":"parley"}`
    - The herald hesitates for one heartbeat. Then the drums start again.
    - **Lisha**: Worth a try. Somebody had to try.
- **Get the farmers into the castle first.** — sets `{"np-05-stance":"villagers"}`
    - You and your Nubbins herd farmers, Babaas and one very cross Kau up the castle road.

#### Done `np05-citadel-done`

**Jeran** _(think)_: They’re pulling back. Why are they pulling back?  
_On the Citadel’s edge, something starts to glow, green and terrible._  

### Step 3: Fight beside both armies to break Lord Darigan’s grip on the Orb.

Hint: A team bout: knights and Darigan soldiers fight with you. Aim for the Orb, not for Darigan. · check: `karate:win:orb-darigan`

#### Scene `np05-orb`

_Lord Darigan stands on the hilltop with the Orb raised high. His eyes have turned the colour of its light._  
**Lord Darigan** _(angry)_: Meridell will give back what it stole. Every field. Every stone. Every breath.  
_The Orb pulses. Crops wither in a ring around the castle. Darigan’s own soldiers stagger away from him._  
**Lisha** _(shock)_: He isn’t himself. Look at his soldiers. They’re scared of him.  
**King Skarl**: Then it’s not their fight any more. And it isn’t only mine.  
_Meridell knights and Darigan soldiers stand side by side on the hill. Nobody planned it. Nobody stops it._  
**Jeran**: The Orb is doing this. Get it out of his hands and it stops. I hope.  
_Your Nubbins look up at the glow. Then they look at you, and wait for a plan._  

#### Done `np05-orb-done`

_Your fastest Nubbin leaps, catches the Orb’s strap in its teeth, and pulls._  
_The Orb tears free, spins in the air, and cracks clean in two._  

#### Complete `np05-complete`

_Two halves of the Orb land in the grass. One glows a soft green. The other gives no light at all._  
**Lord Darigan** _(sad)_: What… what have I done?  
**King Skarl**: Something you’ll have to live with. Same as me, if I’m honest.  
_Lisha marches up to Jeran and shouts at him, exactly as promised. Then she hugs him._  
_Jeran hands back the good sword. Lisha hands him the one she doesn’t like. Both of them look happier._  
**Jeran** _(happy)_: Champions of Meridell. That’s what they’ll call us. Your Nubbins too. Especially your Nubbins.  
_At the back of the Darigan ranks, a sharp-faced general named Kass watches the broken Orb and does not cheer._  
**King Skarl** _(think)_: Now. Two halves of a thing my grandfather borrowed. Keeper, you broke it. You decide.  

**Choices**

- **Give both halves back to the Citadel. It was theirs.** — sets `{"np-05-orb":"returned"}`
    - **Lord Darigan**: Both? Even now? After what I did with it?
    - **King Skarl**: Especially now. “Borrowed” is just a longer word for stolen. Take them.
    - Darigan’s soldiers carry their lord and both halves home. The Citadel drifts away, smaller and slower.
- **One half each. Both kingdoms keep a piece, and a reason to talk.** — sets `{"np-05-orb":"split"}`
    - **King Skarl**: A piece each, and an excuse to visit. Grandfather would have hated it. Good.
    - Darigan’s soldiers carry their lord home with the glowing half. The Citadel drifts away, smaller and slower.
- **Lock both in Meridell’s vault until Darigan is well.** — sets `{"np-05-orb":"kept"}`
    - **Lord Darigan**: Keep them. I don’t trust my own hands with it yet.
    - **Lisha**: That’s twice Meridell has kept it. Let’s make sure nobody needs a third time.
    - Darigan’s soldiers lift their lord gently and carry him home. The Citadel drifts away, smaller and slower.

**Rewards**

- Neopian Times: THE ORB IS BROKEN (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Champion of Meridell (title): A trophy avatar for fighting in the Champions of Meridell.

Sets on completion: `{"np-05-done":true}`

**Notes:** Signature choice of the Neopia line: `np-05-stance` (defend | parley | villagers, the fence at Meri Acres). It pays off in NEOPIA_LINE_VARIANTS np09-nabile-<stance> (how Nabile asks for your word), np11-diary-<stance> (who on the Unlikely Gull has heard of you) and np13-broadcast-<stance> (how Gorix recruits you). Audience main: a war plot, kept out of the Learning Grove (no gore; it is the war theme). Step 2 is three karate waves on the Meri Acres farm map; step 3 is a team bout where allied NPC fighters (a knight and a Darigan soldier) join the player’s Nubbins against the Orb-possessed Darigan, whose hit box is the Orb. Kass is planted at the end for NP7. Sloth is absent from this plot by design (he returns in NP13). The closing choice sets `np-05-orb` (returned | split | kept); all three are defensible and none changes NP7’s plot. If kept, the two halves sit in a glass case in Skarl’s throne room in NP7. Art: Darigan Citadel floating fortress, the Orb (whole, then two halves). No unlock in the brief; standard Times page and avatar.

## NP6. The Volcano Mystery

*Neopets site plot: The Volcano Mystery (September–October 2003)* · audience: all · where: Mystery Island, the village · when: After NP4 (in the main game, after NP5), on your next visit to Mystery Island. · requires: NP4

**Cast:** The Island Mystic (The Island Mystic (Neopets)), The Shaman (The shaman controlling Moltenus (Neopets, Volcano Mystery))

### Step 1: Find the first two secret words around the island.

Hint: The words are carved where islanders gather. Try the Tombola stall and the Training School. · check: `find:secret-word:volcano-mystery:2`

#### Scene `np06-empty`

_Mystery Island is never quiet. Today it is. No drums, no sellers, no Tombola man yelling about booby prizes._  
_Half-eaten breakfasts sit on the tables. A hammock is still swinging._  
**The Island Mystic**: Ah. Keeper. I saw you coming. Also, I heard the boat.  
**The Island Mystic** _(think)_: Everyone vanished at sunrise. Everyone but me. I was asleep up a tree, which I shall call wisdom.  
**The Island Mystic**: Old words hold this island together. Five of them, hidden where the islanders would always find them.  
**The Island Mystic**: Find all five and read them out, and whatever took our people must give them back.  
_Your Nubbin finds a carved shell in the empty Tombola drum and brings it to you like a dog with a stick._  
**The Island Mystic**: There. Your first word. Read it.  

**Choices**

- **Ask where to look next.**
    - **The Island Mystic**: Where people gather. A raffle stall. A school. A kitchen.
- **Ask who would do this.**
    - **The Island Mystic**: The mountain has been grumbling. Mountains don’t grumble on their own.
- **Ask why the Mystic wasn’t taken.**
    - **The Island Mystic**: Nobody ever looks up. You’d be amazed what you can avoid from a tree.

#### Done `np06-empty-done`

_The shell says ROOT. A codestone at the Training School says WAVE._  
**The Island Mystic** _(think)_: Two. The mountain just coughed. I don’t like that.  
_Your Nubbin coughs back at the mountain, to be polite._  
**The Island Mystic**: Don’t encourage it.  

### Step 2: Find the last three secret words, then read all five at Techo Mountain.

Hint: The Kitchen, Geraptiku and the mountain path each hold one word. Then stand at the crater door and read. · check: `find:secret-word:volcano-mystery:5`

#### Scene `np06-words`

_Smoke curls from the top of Techo Mountain. The birds have gone quiet._  
**The Island Mystic**: Three more. The Kitchen, the old ruins at Geraptiku, and the path up the mountain.  
**The Island Mystic**: Geraptiku is cursed, they say. I say it is mostly sticky. Don’t touch the statues.  
_In the Kitchen, a wooden spoon hangs over a cold stove. Carved on the handle: ASH._  
_At Geraptiku, your Nubbin refuses to go near the statues and finds SHELL scratched under a stair instead._  
_The last word is up the mountain path, where the ground is warm under your feet._  
**The Island Mystic**: When you have all five, read them to the mountain. Out loud. Mountains are a bit deaf.  
_One of the statues seems to be looking at your hand._  

**Choices**

- **Touch a statue anyway.** — sets `{"np-06-touched-statue":true}`
    - Your hand comes away sticky. Very sticky. For the rest of the day.
    - **The Island Mystic**: Mostly sticky. I did say.
- **Leave the statues alone.**
    - The statues seem to approve. It’s hard to tell with statues.

#### Done `np06-words-done`

_The last word is HOME, pressed into warm stone. You read all five, out loud._  
_A seal of black rock splits down the middle. The islanders tumble out, dusty, blinking, all talking at once._  
**The Island Mystic** _(shock)_: You found them! And you also opened the volcano. Small mistake. Very understandable.  

### Step 3: Lead the island’s chant to break the shaman’s hold on Moltenus.

Hint: Tap the five words in the order the chant shows, in time with the drums. Dodge the lava between beats. · check: `minigame:chant:volcano-mystery`

#### Scene `np06-moltenus`

_Something climbs out of the crater after the islanders. It is made of lava, and it is in a bad mood._  
**The Island Mystic**: Moltenus. The mountain’s fire, given a body. And somebody has it on a leash.  
_On a ledge behind it stands a figure in a mask of bone and feathers, holding a staff that glows like a coal._  
**The Shaman**: Thank you for the words, Keeper. The islanders were only bait. I needed someone to open the door.  
**The Shaman** _(angry)_: Now the island is mine, and the mountain does what I say.  
**The Island Mystic**: Words that open can also close. Say them together, all of you, and his hold breaks.  
_The islanders look at each other. Then at you. Somebody has to start._  
_Your Nubbin clears its throat. It is a very small sound._  

**Choices**

- **Start the chant yourself.** — sets `{"np-06-chant":"you"}`
    - **You**: Root to wave, ash to shell…
- **Let your Nubbin start.** — sets `{"np-06-chant":"nubbin"}`
    - Your Nubbin hums the first word, completely out of tune. The islanders join in anyway.
- **Ask the islanders to start. It’s their island.** — sets `{"np-06-chant":"islanders"}`
    - **The Island Mystic**: Well said. Go on, then. All of you.

#### Done `np06-moltenus-done`

_“Root to wave, ash to shell, everyone home.” A hundred voices, one rhythm._  
_The shaman’s staff cracks like a dropped plate._  

#### Complete `np06-complete`

_Moltenus stops. It looks down at its own glowing hands. Then it sighs, and sinks back into the crater like a bath._  
**The Shaman** _(angry)_: No. No, no, no…  
_Without the staff he is just a man in a feathery mask. The islanders argue about him for an hour._  
_In the end they put him on the next boat to anywhere, with a packed lunch. Island manners._  
**The Island Mystic** _(happy)_: The mountain’s asleep again. Properly asleep. The snoring kind.  
**The Island Mystic** _(soft)_: Keep the five words. Not because you’ll need them. Because they’re yours now too.  
_The Tombola man is back at his drum within the hour, yelling about booby prizes as if nothing happened._  
_The Neopian Times prints the chant on its front page. By dinner, every child on the island is singing it._  

**Rewards**

- Neopian Times: EVERYONE HOME (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Keeper of the Five Words (title): A trophy avatar for solving the Volcano Mystery.

Sets on completion: `{"np-06-done":true}`

**Notes:** Requires NP4 only, so the Learning Grove can reach it; the main game still plays it after NP5 (see the header). Audience all. FIVE SECRET WORDS, in chant order, with where each is found: ROOT (shell in the Tombola drum), WAVE (codestone at the Training School), ASH (spoon handle in the Kitchen), SHELL (under a stair at Geraptiku), HOME (warm stone on the Techo Mountain path). The chant (original): “Root to wave, ash to shell, everyone home.” Step 3 minigame: a rhythm tap of the five words over island drums, three verses, with Moltenus lobbing lava between beats; missing beats only restarts the verse. The islanders were held in stone sleep inside the mountain, unharmed. Sound: drums, a hundred-voice chant (wordless hum is fine). No unlock in the brief; standard Times page and avatar.

## NP7. The Battle for Meridell

*Neopets site plot: The Battle for Meridell (February–May 2004)* · audience: main · where: Meridell, Meri Acres Farm · when: After NP6, the Citadel reappears over Meridell. · requires: NP6

**Cast:** Lisha (Lisha (Neopets, Meridell plots)), Jeran (Jeran (Neopets, Meridell plots)), King Skarl (King Skarl (Neopets)), Lord Darigan (Lord Darigan (Neopets)), Kass (Kass (Neopets)), Sally (Sally of Meri Acres Farm (Neopets)), The Creature (Lord Darigan in his changed form (Neopets)), The Dancer (The enchanting dancer at King Skarl’s court (Neopets)), The Air Faerie (The Air Faerie (Neopets))

### Step 1: Hold Meri Acres against three waves of Kass’s troops.

Hint: Kass’s troops are tougher than last time. Rest your Nubbins in the barn between steps. · check: `karate:wave:battle-for-meridell:3`

#### Scene `np07-invasion`

_Meridell again. The Citadel is back in the sky, and it has grown spikes._  
**Jeran** _(angry)_: Kass. Darigan’s old general. He took the Citadel while its lord was missing, and now he wants everything.  
**Lisha**: Missing? Lords don’t go missing. They have staff for that.  
**King Skarl** _(angry)_: Ride out, all of you! Defend the farms!  
_Darigan troops pour onto the fields. At the castle gate, Meridell’s Unis stamp and snort._  
**Jeran**: Keeper, you held the fence last time. Hold it again.  
_Kass watches from the Citadel’s balcony, arms folded, already bored of the people he’s fighting._  
_Your Nubbins take their places along the fence. They remember it._  

**Choices**

- **Ride out on a Uni with the cavalry.** — sets `{"np-07-mount":"uni"}`
    - The Uni sniffs your Nubbin, decides it is a passenger, and lets it ride between its ears.
- **Stay on foot with the farmers.** — sets `{"np-07-mount":"foot"}`
    - **Sally**: Here, take a pitchfork. No, on second thoughts, take a bucket.
    - It turns out to be a very good bucket.

#### Done `np07-invasion-done`

**Sally** _(shock)_: Thank you. Now all of you, out of my barn. Nobody goes in my barn.  
_Something in the barn shuffles. Then goes very still._  

### Step 2: Bring the barn creature food without anyone seeing.

Hint: Pick turnips at Meri Acres after dark. Stay out of the guards’ lantern light. · check: `give:food:barn-creature`

#### Scene `np07-barn`

_That night you hear it again: a shuffle, a cough, a wing knocking over a bucket._  
**Sally**: Fine. FINE. You found it. Don’t tell the king.  
_In the hay sits a creature with ragged bat wings, thin arms and huge, sad eyes. It flinches from the lantern._  
**The Creature** _(sad)_: Please. I won’t hurt anyone. I can’t. Not any more.  
**Sally**: Turned up the day the Citadel came back. Eats turnips. Hates loud noises. Doesn’t know its own name, it says.  
_Your Nubbin walks straight up to it and sits down in its lap, uninvited._  
**The Creature** _(soft)_: …Oh. Hello.  
**Sally**: Well? What are you going to do about it?  

**Choices**

- **Promise to keep it secret.** — sets `{"np-07-creature":"hidden"}`
    - **Sally**: Good. Secrets are cheaper than trouble.
- **Say the king ought to know.** — sets `{"np-07-creature":"told"}`
    - **The Creature**: Please, not yet. I don’t know what I am yet.
    - You agree to wait. For now.
- **Fetch it a proper meal first.** — sets `{"np-07-creature":"fed"}`
    - It eats like it hasn’t in weeks, and says thank you after every mouthful.

#### Done `np07-barn-done`

**The Creature** _(think)_: Thank you. I keep dreaming of a castle in the sky. Isn’t that silly?  
**Sally**: Very silly. Eat your turnip. That’s nine, by the way. I’m keeping a tally.  

### Step 3: Help Lisha get the charm off the dancer’s wrist.

Hint: Time it with the music: move when she spins away from the throne. A rolled-up rug helps. · check: `find:item:dancers-charm`

#### Scene `np07-court`

_In the castle, King Skarl isn’t giving orders. He is watching a dancer twirl across the throne room, smiling foolishly._  
**King Skarl** _(soft)_: Lovely. Lovely. Let the war wait. Let everything wait.  
**Lisha** _(angry)_: He’s been like this for three days. The knights are riding out with no plans at all.  
_A charm on the dancer’s wrist flashes every time she turns. Skarl’s eyes follow it._  
**The Dancer** _(happy)_: Another dance, Majesty? And another. And another.  
**Lisha**: That charm. If we get it off her, he wakes up.  
**Jeran**: I’ll distract the guards. Lisha’s quicker with her hands.  
_Your Nubbins glance at each other, then at the dancer’s swirling skirts. They have an idea. It is a bad idea._  

#### Done `np07-court-done`

_Your Nubbins roll a rug under her feet. She stumbles. Lisha snatches the charm and snaps it in two._  
**King Skarl** _(shock)_: What… why is there a war? Why didn’t anyone tell me there’s a war?  
**Lisha**: We did.  

### Step 4: Clear Kass’s guards from the Citadel courtyard.

Hint: The guards fight in a ring. Break it on one side and the rest scatter. · check: `karate:win:citadel-guard`

#### Scene `np07-citadel`

_Meridell storms the Citadel at dawn, on Unis and on foot, up a ramp of rope and stubbornness._  
**Jeran**: Kass is at the top. Follow me!  
_Halfway up, a blast from the Citadel rocks the ramp. Jeran loses his footing and falls._  
**Lisha** _(shock)_: JERAN!  
_A blur of wind and pale light. An Air Faerie catches him an arm’s length from the ground._  
**The Air Faerie**: Not today, young knight. Back up you go.  
_Behind you, a shriek. The barn creature is flying straight at the Citadel, faster than anything you’ve seen._  
**The Creature** _(angry)_: I remember now. That is my castle.  
_Kass’s guards fill the courtyard. Somebody has to clear the way._  

#### Done `np07-citadel-done`

_The courtyard clears. In the throne room, the creature lands, and grows, and changes._  
**Lisha** _(shock)_: Sally’s barn guest. Taller. A lot taller. Still got hay in his hair.  

#### Complete `np07-complete`

_It is Lord Darigan: unbewitched, unbowed, his eyes clear and very angry._  
**Kass** _(shock)_: You? You should be dead in a ditch.  
**Lord Darigan**: I was in a barn. It was better company.  
_It is a short fight. Kass falls, and his army throws down its weapons._  
**Lord Darigan** _(soft)_: Meridell, I owe you my life and my home. I will not forget whose barn I slept in.  
**King Skarl** _(happy)_: Peace, then. Real peace. Somebody pass the turnips.  
**Sally**: He owes me twelve turnips, actually.  
_The Neopian Times runs a drawing of the battle. Your Nubbins are in it, very small, holding a rug._  

**Rewards**

- Neopian Times: KASS FALLS (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Hero of the Battle for Meridell (title): A trophy avatar for the Battle for Meridell.

Sets on completion: `{"np-07-done":true}`

**Notes:** Audience main: a war plot, kept out of the Learning Grove. Order follows the brief: Kass invades; the bat-like creature in Sally’s barn; Lisha breaks the dancer’s spell on Skarl; Jeran falls and the Air Faerie catches him; the creature is revealed as Darigan and defeats Kass. Step 1 is three karate waves; step 2 a night stealth fetch (carry turnips past lantern cones); step 3 a timing grab during the dance loop; step 4 a ring bout. Kass’s defeat is a cutscene, not a player fight. Uni mounts: if np-07-mount is uni, step 4 staging shows the player arriving on a Uni. Art: creature form and full Darigan form share a palette so the reveal reads. No unlock in the brief; standard Times page and avatar.

## NP8. The Curse of Maraqua

*Neopets site plot: The Curse of Maraqua (March–June 2005)* · audience: main · where: Maraqua, New Maraqua’s square · when: After NP7, on your next dive to Maraqua. · requires: NP7

**Cast:** King Kelpbeard (King Kelpbeard (Neopets)), Caylis (Caylis (Neopets)), Isca (Isca (Neopets)), Captain Garin (Captain Garin (Neopets)), Captain Scarblade (Captain Scarblade (Neopets))

### Step 1: Swim past the reef and find Caylis in the old Maraquan ruins.

Hint: Swim Nubbins only. Follow the cold currents marked by pale fish. · check: `talk:caylis`

#### Scene `np08-cast`

_New Maraqua shines under the sea: new coral, fresh paint. Your Swim Nubbins love it._  
**King Kelpbeard** _(sad)_: Keeper! Back in Maraqua. You’ve come to the right place at the wrong time.  
**King Kelpbeard**: Our seer, Caylis, has been sending warnings of ruin. The people say she brings the ruin herself.  
**King Kelpbeard** _(sad)_: The council voted. She’s been sent out past the reef. I didn’t vote for it. I didn’t stop it either.  
_The square is full of people who won’t look at the gate she left through._  
_Your Swim Nubbin is already nosing at that gate. It doesn’t care about votes._  
**King Kelpbeard**: Past the reef, follow the cold water. She’ll be in the old ruins.  
**King Kelpbeard**: Will you go? She won’t come back for me.  

**Choices**

- **Say you’ll bring her back.** — sets `{"np-08-caylis":"sought"}`
    - **King Kelpbeard**: Take her this cloak. The reef gets cold.
- **Ask what her warnings said.** — sets `{"np-08-caylis":"asked"}`
    - **King Kelpbeard**: Dark sails over the city. And a sister she has never met.
- **Ask why the king didn’t stop it.** — sets `{"np-08-caylis":"questioned"}`
    - **King Kelpbeard**: A king who overrules every vote soon has no council. Just an echo wearing seaweed.
    - **King Kelpbeard**: And a king who never does… Well. You can see where that got her.

#### Done `np08-cast-done`

**Caylis** _(soft)_: You came. That wasn’t in my visions. I like it.  
**Caylis** _(shock)_: Look up. The sails are already here.  

### Step 2: Bring Garin, Isca and Caylis to King Kelpbeard.

Hint: The palace is at the centre of New Maraqua. Keep Caylis in your party to pass the gate guards. · check: `talk:king-kelpbeard`

#### Scene `np08-garin`

_A hull blocks the light above. Not dark sails, though: patched ones, cheerful ones._  
_A rope ladder drops. Down it climbs a pirate captain with a broad grin and a broader hat._  
**Captain Garin** _(happy)_: Captain Garin, at your service. Mostly at my own service, but I make exceptions.  
_Behind him comes a girl with Caylis’s face, exactly, down to the frown._  
**Isca**: Isca. I was raised on deck. Garin says he found me in a basket in the reef.  
**Caylis** _(soft)_: A sister. I saw you. I saw you for years.  
**Captain Garin** _(think)_: And I’ve seen Scarblade’s fleet two days behind me. That’s why I came. Somebody tell the king.  
_Your Nubbin swims a slow circle round the twins, looking from one face to the other, baffled._  

**Choices**

- **Trust Garin and take him to the king.** — sets `{"np-08-garin":"trusted"}`
    - **Captain Garin**: Splendid. Do kings serve lunch?
- **Ask why a pirate cares about Maraqua.** — sets `{"np-08-garin":"doubted"}`
    - **Captain Garin**: Scarblade sank my first ship. That’s caring enough.
- **Ask Isca if she trusts him.** — sets `{"np-08-garin":"vouched"}`
    - **Isca**: He raised me. Badly, but properly.

#### Done `np08-garin-done`

**King Kelpbeard** _(sad)_: Caylis. I’m sorry. You were right, and we didn’t want you to be.  
**Caylis** _(soft)_: Being right is lonely. Being home is better.  

### Step 3: Drive off three waves of Scarblade’s raiders.

Hint: Raiders sink slowly on ropes. Hit them before they land and they float back up. · check: `karate:wave:curse-of-maraqua:3`

#### Scene `np08-scarblade`

_Two days later, the dark sails come. Captain Scarblade’s fleet blots out the sun._  
**Captain Scarblade** _(angry)_: Maraqua! Your gold, your coral and your king. In any order you like.  
_His parrot, perched on his hat, repeats the demand slightly wrong: “Gold! Coral! Cake!”_  
**Captain Scarblade** _(angry)_: Not cake. We’ve discussed this.  
_Raiders drop through the water on weighted ropes, blades between their teeth._  
**King Kelpbeard** _(angry)_: Defend the palace! Defend each other!  
**Captain Garin**: My crew’s above, boarding his flagship. Keep the raiders busy down here!  
**Isca**: Caylis, what do you see?  
**Caylis** _(think)_: Him running. If we hold long enough, I see him running.  
_Your Swim Nubbins dart between the coral spires, faster than any raider with a sword in his mouth._  

#### Done `np08-scarblade-done`

_The ropes go slack. Above, Scarblade’s flagship is burning and leaving._  
**Captain Scarblade** _(angry)_: This isn’t over, Kelpbeard!  
_Faintly, from the burning ship: “Cake!”_  
**Captain Garin** _(happy)_: It is today, though.  

#### Complete `np08-complete`

_New Maraqua is dented but standing. The people clear a path for Caylis, and this time they mean it._  
**King Kelpbeard** _(soft)_: Caylis. Isca. There are two rooms in the palace with your names on them, if you want them.  
**Isca**: Garin?  
**Captain Garin** _(soft)_: I’m a pirate, love. Pirates don’t do rooms. Come and find me on the water.  
_The patched sails pull away north. Isca watches until they’re gone, then swims back to her sister._  
**Caylis** _(happy)_: I don’t see any more ruin. I see dinner. A great deal of dinner.  
_The Neopian Times prints the twins side by side on the front page. Nobody can tell which is which._  

**Rewards**

- Neopian Times: THE SISTERS COME HOME (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Friend of New Maraqua (title): A trophy avatar for breaking the Curse of Maraqua.

Sets on completion: `{"np-08-done":true}`

**Notes:** Audience main: an invasion plot, kept out of the Learning Grove. Underwater throughout: Swim Nubbins only in the party, as in NP1. Step 3 is three karate waves; raiders arrive on ropes from above (hit them mid-descent to send them back up). Garin’s ship is above the water, so he never fights in the bouts; his boarding happens off screen. `np-08-caylis` can be sought | asked | questioned (flavour only). Scarblade’s parrot is a small sprite on his hat; its “Cake!” is a running gag. Art: Caylis and Isca must be identical sprites apart from clothing (Isca in a deckhand’s coat). No unlock in the brief; standard Times page and avatar.

## NP9. The Lost Desert Plot

*Neopets site plot: The Lost Desert Plot (August–November 2005)* · audience: main · where: Lost Desert, Sakhmet palace · when: After NP8, an invitation to Prince Jazan’s audience with Princess Amira. · requires: NP8

**Cast:** Prince Jazan (Prince Jazan (Neopets)), Princess Amira (Princess Amira (Neopets)), Nabile (Nabile (Neopets)), Razul (Razul (Neopets))

### Step 1: Find a way through the shadow streets of cursed Sakhmet.

Hint: Shadows freeze when looked at. Move when they turn away, and keep your Nubbins close. · check: `explore:sakhmet-shadow:market`

#### Scene `np09-refused`

_The palace hall is full of flowers and nerves. Prince Jazan of Qasala has come to ask for Princess Amira’s hand._  
**Prince Jazan**: Princess. Our cities were one, once. Let them be one again.  
**Princess Amira** _(angry)_: You don’t love me, Jazan. You love the throne I’m sitting on. The answer is no.  
_Jazan doesn’t argue. A dark stone on his ring flares, and he looks as surprised as anyone._  
**Prince Jazan** _(shock)_: That isn’t mine. Father?  
_The sky turns violet. The colour drains out of the city. Every shadow stands up and walks._  
**Princess Amira** _(shock)_: What have you done?  
_Then Jazan is gone, pulled through a door that wasn’t there a moment ago._  

**Choices**

- **Get the princess to safety.** — sets `{"np-09-first":"amira"}`
    - **Princess Amira**: I can look after myself. But thank you. Now run!
- **Try the door Jazan left by.** — sets `{"np-09-first":"door"}`
    - It closes on your fingertips and fades into the wall, like a bad idea.
- **Gather your Nubbins first.** — sets `{"np-09-first":"nubbins"}`
    - They come running, all of them, tails low. In the violet light they all look grey.

#### Done `np09-refused-done`

_In the empty market, someone is stealing apples from a shadow’s stall._  
**Nabile**: What? It’s not as if it’s going to notice.  
_The shadow stallholder holds out its hand for payment, very slowly. Nabile puts an apple core in it._  

### Step 2: Stand guard at the wedding in the Qasala ruins.

Hint: Shadows will try to crash the ceremony. Keep them out of the courtyard until the vows are done. · check: `karate:wave:qasala-wedding:2`

#### Scene `np09-nabile`

**Nabile**: Nabile. Thief, mostly. You look like you plan to fix this, so I’ll follow you. For the loot.  
_Round her neck hangs an amulet she keeps tucking out of sight: a royal crest, very old._  
**Nabile**: Found it. Don’t ask. Everyone asks.  
_In a ruined courtyard, an old servant sees the amulet and drops to her knees. Nabile is of Qasala’s royal blood._  
**Nabile** _(shock)_: I’m a what? No. I’m a thief. Thieves don’t have bloodlines. They have hiding places.  
**Princess Amira** _(think)_: The old curse on Qasala breaks with a royal marriage. That’s why he came to me.  
_Jazan hears. Of course he hears. He arrives with a smile and a ring and a very short speech._  
**Prince Jazan** _(think)_: A bride from Qasala’s own line. The curse wanted a royal marriage. Here is one.  
**Nabile**: Keeper. Tell me honestly. Do I do this?  

**Choices**

- **Say it might save the city.** — sets `{"np-09-wedding":"encouraged"}`
    - **Nabile**: Fine. But I’m keeping the apples.
- **Say she doesn’t owe anyone this.** — sets `{"np-09-wedding":"cautioned"}`
    - **Nabile**: I know. That’s why I’m choosing it.

#### Done `np09-nabile-done`

_The vows are said in the violet light. Everyone looks up at the sky._  
_It stays violet._  
**Prince Jazan** _(sad)_: Then it was never the marriage. It was always him.  

### Step 3: Gather the four pieces and build the ancient weapon.

Hint: Collect the lens, the hilt, the coil and the sun-stone around Sakhmet, then combine them at the palace workbench. · check: `craft:ancient-weapon`

#### Scene `np09-weapon`

_Below the Qasala ruins is a tomb, and in it something that should have stayed dead: Razul, Jazan’s father._  
**Prince Jazan** _(sad)_: He made the curse. He keeps it alive. As long as he walks, so do the shadows.  
**Nabile**: So we stop him walking. How?  
**Princess Amira** _(think)_: The old scrolls describe a weapon, built in pieces and kept in pieces, so no single king could ever use it.  
**Princess Amira**: Put together, it holds daylight. Razul cannot stand daylight.  
_Four pieces: a lens by Coltzan’s Shrine, a hilt in the Deserted Tomb, a coil inside the Fruit Machine, a sun-stone on the palace roof._  
**Nabile**: I can steal two of those. You do the other two.  
_Your Nubbins are good at small spaces. Two of those places are nothing but small spaces._  

#### Done `np09-weapon-done`

_The pieces fit together with a sound like a bell. The weapon hums, warm, full of stored sunrise._  
**Nabile** _(happy)_: I said I’d steal two. I stole three. Habit. I put the third one back. Mostly.  

### Step 4: Hold off the shadows for three rounds while Jazan charges the weapon.

Hint: Shadows can’t cross light. Fight inside the weapon’s glow. · check: `karate:survive:razul-shadows:3`

#### Scene `np09-razul`

_Razul’s tomb is a hall of bones and gold. He sits on a throne too big even for him._  
**Razul** _(angry)_: My son. My useless son. You married a thief and brought me a toy.  
**Prince Jazan**: I brought you an ending, Father.  
**Razul**: Nobody in our family has ever done anything brave. Don’t start now.  
_Razul stands. The shadows of Sakhmet pour into the tomb to guard him._  
**Nabile**: Keeper. Keep them off him. He gets one shot.  
_Jazan raises the weapon. It begins, slowly, to glow._  
_Your Nubbins look at the shadows, then at you._  

**Choices**

- **Put your Nubbins in a ring round Jazan.** — sets `{"np-09-guard":"ring"}`
    - They make a ring, tails in, facing the dark. Nothing gets through.
- **Draw the shadows toward you instead.** — sets `{"np-09-guard":"lure"}`
    - You run left, shouting. The shadows follow, which is flattering and terrifying.

#### Done `np09-razul-done`

_Daylight bursts from the weapon. Razul doesn’t scream. He just fades, like a stain in the sun._  
**Prince Jazan** _(sad)_: Goodbye, Father. I’ll do the brave things now. Somebody has to start.  

#### Complete `np09-complete`

_The violet drains out of the sky. Sakhmet is gold again, and loud, and smells of bread._  
**Princess Amira** _(soft)_: Jazan. You did the right thing at the end. That counts.  
**Prince Jazan** _(sad)_: It doesn’t undo the beginning.  
**Nabile**: No. But I married you anyway, so try harder.  
_Jazan and Nabile go home to Qasala to rebuild it. Nabile keeps her lockpicks in the crown._  
**Princess Amira** _(happy)_: Keeper, Sakhmet’s gates are always open to you and yours.  
_The Neopian Times prints the wedding portrait. Nabile is clearly picking the photographer’s pocket._  

**Rewards**

- Neopian Times: SAKHMET IN DAYLIGHT (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Breaker of the Qasalan Curse (title): A trophy avatar for the Lost Desert Plot.

Sets on completion: `{"np-09-done":true}`

**Notes:** Payoff of `np-05-stance`: step 2 plays NEOPIA_LINE_VARIANTS np09-nabile-defend / -parley / -villagers in place of np09-nabile (Nabile has heard what you did at Meri Acres, and asks for your word accordingly). Audience main: undead dimension, a cursed city and Razul’s tomb, kept out of the Learning Grove. Sakhmet in the undead dimension: violet sky, greyscale palette, shadow people who freeze when looked at (step 1 is a light stealth crossing of the market). Step 2: two karate waves of shadows during the wedding. Step 3: the players build the ancient weapon from four parts placed at existing Lost Desert spots (Coltzan’s Shrine, the Deserted Tomb, the Fruit Machine, the palace roof); the parts are one-time pickups. Step 4: survive bout inside a moving circle of light. Jazan destroys Razul in the cutscene, as in the brief. No unlock in the brief; standard Times page and avatar.

## NP10. The Tale of Woe

*Neopets site plot: The Tale of Woe (October–November 2006)* · audience: main · where: Haunted Woods, the town of Neovia · when: After NP9, on your first visit to Neovia. · requires: NP9

**Cast:** Bruno (Bruno the Gelert (Neopets)), Lily (Lily (Neopets, Tale of Woe)), Mr Krawley (Mr. Krawley (Neopets)), Gilly (Gilly (Neopets, Tale of Woe)), Sophie (Sophie the Swamp Witch (Neopets))

### Step 1: Keep an eye on Bruno and see what the Hissi Oil does.

Hint: Follow Bruno through Neovia over the evening, and stay out of Mr Krawley’s sight. · check: `follow:bruno:neovia`

#### Scene `np10-neovia`

_Neovia sits in the Haunted Woods under a permanent dusk. The lamps are always lit, and always flickering._  
**Bruno** _(sad)_: Lily walked past me again today. She smiled. At the lamppost behind me, I think.  
**Bruno** _(sad)_: If I were handsomer. Braver. Anything-er.  
_Across the square stands a new shop: MR. KRAWLEY’S TONICS. The window is full of little green bottles._  
**Mr Krawley** _(happy)_: Roll up! The lovelorn, the plain, the overlooked! Hissi Oil! One drop and you’re irresistible!  
**Mr Krawley**: Two drops and you’re unforgettable! Three drops and, well, results vary. Results always vary!  
**Bruno** _(think)_: Irresistible…  
_Your Nubbins won’t go near the shop. One hisses at its own reflection in the window._  
**Mr Krawley**: Spread the word. Spread the oil. No refunds, no returns, no questions, no forwarding address.  

**Choices**

- **Tell Bruno he doesn’t need a bottle.** — sets `{"np-10-warned":true}`
    - **Bruno**: Easy for you to say. Your pets adore you.
    - He buys it anyway.
- **Sniff the oil.** — sets `{"np-10-sniffed":true}`
    - It smells of swamp, old pennies and something with too many legs.
    - Bruno buys a bottle while you’re coughing.
- **Ask Mr Krawley what’s in it.**
    - **Mr Krawley**: A secret blend. Secret from you, secret from the law, secret from my own mother.
    - Bruno buys a bottle while he’s talking.

#### Done `np10-neovia-done`

_By midnight, everyone who bought the oil is changing. Fur where there shouldn’t be fur. Teeth where there shouldn’t be teeth._  
_Bruno howls from a rooftop. It is not a happy sound._  
_Mr Krawley’s shop is dark and empty. The sign on the door says CLOSED FOREVER._  

### Step 2: Get Gilly safely through Neovia to the swamp.

Hint: Changed townsfolk follow noise. Walk, don’t run, and keep to the lamplit paths. · check: `escort:gilly:swamp`

#### Scene `np10-gilly`

_The streets are full of shapes that used to be your neighbours. Most are just confused. A few are hungry._  
**Gilly** _(shock)_: In here! Quick, before they smell you!  
_A small girl yanks you into a cellar. Your Nubbins tumble in after you._  
**Gilly**: Gilly. I didn’t buy the oil. My mum said it smelled like a liar.  
**Gilly**: There’s a witch in the swamp. Sophie. Everyone says she’s mean. I think she’s just honest.  
**Gilly**: If anyone can make a cure, she can. But I can’t get through town on my own.  
_Outside, something big and furry snuffles at the cellar door, then wanders off._  
**Gilly** _(sad)_: That was Mr Henley, the baker. He’s a lot hairier than usual.  

**Choices**

- **Offer to carry Gilly on your back.** — sets `{"np-10-gilly":"carried"}`
    - **Gilly**: I’m not a baby. …Fine. But only because my shoes are wet.
- **Let Gilly lead. She knows the streets.** — sets `{"np-10-gilly":"led"}`
    - **Gilly**: Left at the bakery. Don’t look at the bakery.

#### Done `np10-gilly-done`

**Sophie**: Who’s stomping on my swamp? Oh. Gilly. And a stranger with a lot of small pets.  
**Gilly**: We need a cure, Miss Sophie. Everyone’s monsters.  
**Sophie** _(think)_: Everyone always is. This time it shows.  
_Her hut is built on stilts over the bog. The doormat says GO AWAY. Underneath, smaller: unless it’s important._  

### Step 3: Gather the moonmoss, the feather and the tear, and help Sophie brew the cure.

Hint: Moonmoss grows on the north graveyard wall. Changed birds roost on the chapel roof. · check: `craft:cure:hissi-oil`

#### Scene `np10-cure`

**Sophie** _(angry)_: Hissi Oil. Krawley sells that rot in every town lonely enough to buy it.  
**Sophie**: I can brew an answer to it. I need three things, and I need them fast.  
**Sophie** _(think)_: Moonmoss from the graveyard wall. A feather from a changed bird. And a tear, given freely.  
**Gilly**: A tear? From who?  
**Sophie**: Someone who still loves somebody in that town. That’s the hard part.  
_Your Nubbins look at Gilly. Gilly looks at the ground._  
_The cauldron starts to bubble on its own, impatient._  
**Sophie**: Off you go. Don’t touch anything in the graveyard that waves.  

**Choices**

- **Ask Lily for the tear.** — sets `{"np-10-tear":"lily"}`
    - Lily, still herself because she never needed any oil, cries for Bruno without being asked.
- **Let Gilly decide.** — sets `{"np-10-tear":"gilly"}`
    - **Gilly**: It’s for my mum. That’s easy to cry about.

#### Done `np10-cure-done`

_The cure is the colour of morning. It smells of mint and wet stone._  
**Sophie**: Rain it over the town. Every drop counts.  

#### Complete `np10-complete`

_Sophie’s cauldron boils over into a cloud. The cloud drifts over Neovia and rains._  
_One by one, the townsfolk shrink back into themselves, sneeze, and ask why they’re on the roof._  
**Gilly** _(happy)_: Mum!  
_Bruno doesn’t change back. The fur stays. The teeth stay. He sits in the square and stares at his hands._  
**Bruno** _(sad)_: It didn’t work on me. I took too much. I wanted it too much.  
**Lily** _(soft)_: Bruno. You were only ever too shy. You were never ugly.  
**Bruno**: Then I suppose I’ll be shy and furry. People have been worse.  
_The Neopian Times prints a small notice: Mr Krawley, wanted, by everyone._  

**Rewards**

- Neopian Times: NEOVIA CURED (MOSTLY) (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Friend of Neovia (title): A trophy avatar for the Tale of Woe.

Sets on completion: `{"np-10-done":true}`

**Notes:** Audience main: the brief says the Tale of Woe is not in the Learning Grove (a darker Haunted Woods story of townsfolk turned into monsters). No gore: the changed townsfolk are furry, toothy and confused, never shown hurting anyone. Step 1 is a follow-at-a-distance walk; step 2 an escort with noise stealth (running makes noise rings); step 3 a three-ingredient fetch and a cauldron craft. Bruno stays changed and accepts it, as in the brief; keep his changed sprite gentle. Krawley escapes (he is in the brief’s villain list for later use). No unlock in the brief; standard Times page and avatar.

## NP11. Journey to the Lost Isle

*Neopets site plot: Journey to the Lost Isle (May–June 2007)* · audience: all · where: Krawk Island, the harbour · when: After NP6 (in the main game, after NP10). · requires: NP6

**Cast:** Professor Fairweather (Professor Fairweather (Neopets)), Roxton Colchester (Roxton Colchester (Neopets)), Lilian (Lilian (Neopets, Journey to the Lost Isle)), Werther (Werther (Neopets, Journey to the Lost Isle)), Scrap (Scrap the stowaway (Neopets))

### Step 1: Join the expedition and set sail from Krawk Island.

Hint: Talk to Roxton on the dock to board. Bring Nubbins who don’t mind boats. · check: `talk:roxton-colchester`

#### Scene `np11-diary`

_Krawk Island harbour. A ship called the Unlikely Gull is loading biscuits and an alarming amount of rope._  
**Professor Fairweather** _(happy)_: You must be the Keeper! Professor Fairweather. Natural history. Mostly beetles.  
**Professor Fairweather**: I have a pirate’s diary describing an island on no chart at all. Giant creatures. Impossible fruit.  
**Roxton Colchester** _(happy)_: Roxton Colchester. I’ve explored every island on the map, which is exactly why I want one that isn’t.  
**Lilian**: Lilian. I do the maps, and the medicine, and most of the thinking.  
**Werther**: Werther. I carry things.  
_A crate of biscuits sneezes._  
_Inside is a small, grubby, defiant stowaway with cheeks full of biscuit._  
**Scrap**: I’m Scrap. I’m coming. You can’t stop me. Can I have another biscuit?  

**Choices**

- **Let Scrap come along.** — sets `{"np-11-scrap":"welcomed"}`
    - **Roxton Colchester**: Fine. You’re cabin crew. Cabin crew don’t eat the cargo.
- **Say Scrap should stay ashore.** — sets `{"np-11-scrap":"refused"}`
    - Scrap nods solemnly. An hour out to sea, the biscuit crate sneezes again.
- **Give Scrap a job: lookout.** — sets `{"np-11-scrap":"lookout"}`
    - **Scrap**: Lookout! The best job! I can see a seagull already!

#### Done `np11-diary-done`

_Five days at sea. On the sixth, Scrap shouts from the mast: fog, and in the fog, green cliffs._  
**Lilian** _(shock)_: That isn’t on my map. That isn’t on anyone’s map.  

### Step 2: Find three landmarks so Lilian can map the island.

Hint: Look for the waterfall, the stone arch and the tallest tree. Fly Nubbins can spot them from above. · check: `explore:lost-isle:landmarks:3`

#### Scene `np11-island`

_The jungle is enormous. Not the trees. The insects._  
_A Petpetpet, a creature that should fit on a fingernail, ambles past at the height of a pony._  
**Professor Fairweather** _(shock)_: Remarkable! Look at its antennae! Look at its… it’s looking at me.  
**Roxton Colchester**: Everyone stay calm. Big doesn’t mean angry.  
**Werther**: Big means big, though.  
**Lilian**: I need three landmarks to fix this island on the map. Then we have proof.  
_Your Nubbins are thrilled and terrified in equal measure. One has befriended a beetle the size of a sofa._  
**Professor Fairweather**: Don’t move. I need to draw this. Nobody will ever believe me.  

**Choices**

- **Let your Nubbin ride the big beetle.** — sets `{"np-11-beetle":"rode"}`
    - It rides. The beetle doesn’t mind. Fairweather takes notes so fast his pencil smokes.
- **Help Fairweather sketch the beetle.** — sets `{"np-11-beetle":"sketched"}`
    - **Professor Fairweather**: Yours is better than mine. That’s fine. I’m not jealous. I’m a little jealous.

#### Done `np11-island-done`

**Lilian** _(happy)_: Waterfall, arch, tree. Mapped. It’s real now. Nobody can say it isn’t.  
**Scrap**: Er. What’s that big nest on top of the tree?  

### Step 3: Bring back one glowing fruit without waking the Moach.

Hint: Move only while the Moach’s shadow crosses the sun. One fruit, no more. · check: `find:item:lost-isle-fruit`

#### Scene `np11-nest`

_On top of the tallest tree sits a nest made of whole branches. In it, three eggs the size of rowing boats._  
**Roxton Colchester** _(think)_: A Moach nest. The diary says they guard the fruit vine beside it. Fiercely.  
_Beside the nest hangs a vine heavy with fruit that glows faintly, like a lamp turned low._  
**Professor Fairweather**: One fruit. Just one, as proof. Then home, quietly, before anything hatches.  
**Scrap**: I’m small. I could get it.  
**Lilian**: Absolutely not.  
**Werther**: I’ll hold the rope. That’s what I do.  
_High above, a shadow circles. A very large, very protective shadow._  

**Choices**

- **Let Scrap climb with your smallest Nubbin.** — sets `{"np-11-fruit":"scrap"}`
    - **Scrap**: I won’t let you down! I’ll let me down. Carefully. On a rope.
- **Climb up yourself.** — sets `{"np-11-fruit":"you"}`
    - You climb. The branches creak. Your Nubbin climbs past you, faster, and looks back with pity.

#### Done `np11-nest-done`

_One fruit, safe in the bag. Then, from the nest: a crack. A beak. A very loud, very hungry chirp._  
**Roxton Colchester** _(shock)_: RUN!  

#### Complete `np11-complete`

_Everyone runs. The Moach’s cry chases you all the way to the beach._  
_The Unlikely Gull pulls away with its sails half up and Werther still climbing the anchor chain._  
**Professor Fairweather** _(happy)_: Proof! One fruit, one map and one extremely cross bird!  
**Scrap**: Can I keep my job? I was a good lookout. I looked out loads.  
**Roxton Colchester** _(happy)_: You were a terrible lookout, Scrap. You can stay.  
**Lilian** _(soft)_: I’ve copied the map for you, Keeper. There’s a corner of that island with your name on it.  
**Lilian** _(think)_: One question left. If I print this map, everyone believes us. And everyone comes.  
**Roxton Colchester**: Collectors. Hunters. People with nets and no manners.  
**Professor Fairweather** _(sad)_: And if we don’t, nobody believes a word. We’re three cranks, a porter and a boy full of biscuit.  

**Choices**

- **Print the map. The world should know the island is real.** — sets `{"np-11-map":"published"}`
    - **Lilian**: Then it goes out with rules on the back. Look. Don’t take. Mind the birds.
    - The Neopian Times prints Lilian’s map on its front page under THE ISLAND IS REAL, with a tiny sketch of your Nubbins in one corner.
- **Keep the way there secret. Print the fruit, not the route.** — sets `{"np-11-map":"secret"}`
    - **Lilian**: A picture of the fruit and no coordinates. Let them argue about it.
    - The Neopian Times prints the glowing fruit under the headline IS IT REAL? Letters pour in. Lilian answers none of them.

**Rewards**

- Lost Isle section (feature): Unlocks a Lost Isle section for your Neopia sandbox: giant-insect jungle, a waterfall, a stone arch and a (quiet, empty) Moach nest.
- Neopian Times: THE ISLAND IS REAL (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook. If you kept the route secret, the headline reads IS IT REAL?
- Avatar: Lost Isle Explorer (title): A trophy avatar for the Journey to the Lost Isle.

Sets on completion: `{"np-11-done":true}`

**Notes:** Requires NP6 only, so the Learning Grove can reach it; the main game still plays it after NP10 (see the header). Payoff of `np-05-stance` (main game only; NP5 never plays in the Learning Grove): step 1 plays NEOPIA_LINE_VARIANTS np11-diary-defend / -parley / -villagers in place of np11-diary (Roxton or Lilian knows you from Meridell, and the Scrap choice answers to it). Reward label: THE ISLAND IS REAL when np-11-map = published, IS IT REAL? when it is secret, matching the scene. Audience all. The brief names the crew: Professor Fairweather, Roxton Colchester, Lilian, Werther and the stowaway Scrap. The ship name (the Unlikely Gull) is ours. Step 2 is free exploration of a small island map with three landmarks; step 3 a timing climb (move while the Moach’s shadow blocks the sun; caught means you slide back down, no harm). The escape is a cutscene chase. The closing choice sets `np-11-map` (published | secret); either way the player keeps Lilian’s copy and the section unlocks. Unlock: the Lost Isle section, as the brief lists. Art: giant Petpetpets, a sofa-sized beetle, glowing fruit, a hatchling Moach for the final beat.

## NP12. Altador

*Neopets site plot: Altador (2007)* · audience: all · where: Neopia world map, a new mountain road · when: After NP11, the road appears on the map. · requires: NP11

**Cast:** The Archivist (The Archivist of Altador (Neopets)), King Altador (King Altador (Neopets))

### Step 1: Follow the Archivist to the Archives of Altador.

Hint: Keep to the white road. Anything blurry is safe to walk through, just slow. · check: `visit:neopia:altador`

#### Scene `np12-road`

_A road appears on the Neopia map where there was never a road. It leads into mountains, and the mountains are humming._  
_At the end stands a city of white stone, beautiful and blurry, like a photo someone breathed on._  
**The Archivist** _(happy)_: Visitors! Real ones! Nobody has come up that road in… I’ve forgotten. That’s the problem.  
**The Archivist** _(sad)_: This is Altador. We’ve been slipping out of the world’s memory, a little more every year.  
**The Archivist** _(think)_: Even I forget things. Your name, for instance. Did you say it? Say it again later.  
_Your Nubbin touches a wall. Its paw sinks a little way into the stone, as if into fog._  
**The Archivist**: Come to the Archives. There’s a map there. A map of the sky.  
_Behind you, the road you walked up is already fading._  

**Choices**

- **Ask why the sky matters.**
    - **The Archivist**: Our twelve heroes are written up there. If their stars scatter, the city forgets them, and then itself.
- **Tell the Archivist your name, slowly.** — sets `{"np-12-named":true}`
    - **The Archivist**: There. I’ll write it on my hand. I write everything on my hand now.
- **Pull your Nubbin back from the wall.**
    - Its paw comes out fine. It looks very pleased with itself.

#### Done `np12-road-done`

_The Archives are a round room with no roof. Above is the night sky, and it’s wrong._  
**The Archivist**: Twelve constellations. All scrambled, as if someone shook the box.  
**The Archivist** _(happy)_: Sorry, who are you again? …No, wait. It’s on my hand. Under “buy milk”.  

### Step 2: Restore the first six constellations on the star map.

Hint: Match the outlines carved in the floor. Drag stars until every line of an outline glows. · check: `puzzle:constellation:altador:6`

#### Scene `np12-stars`

**The Archivist**: Each hero has a shape. The Archer, the Scholar, the Farmer, the Thief, the Dreamer, the Knight.  
**The Archivist**: Then the Builder, the Seer, the Healer, the Bard and the Wanderer. And the King, last of all.  
_Loose stars drift overhead. With the star-staff you can reach them and nudge them into place._  
**The Archivist**: Every shape has its stars and its story. Put the right stars together and the story comes back.  
_The floor is carved with faint outlines: a bow, a book, a plough, a key…_  
_Your Fly Nubbin flaps up and nudges a star with its head. It clicks into the bow. A light comes on in the city below._  
**The Archivist** _(happy)_: Oh! The archery field. I remember the archery field!  
**The Archivist**: Six tonight, if you can. The rest tomorrow.  

#### Done `np12-stars-done`

_Six shapes burn in the sky. Below, half the city is solid again. Somebody is singing in a bakery._  
_The other half is still blurry. A man in it is trying to open a door that has not decided to exist yet._  
**The Archivist** _(happy)_: Half. Half is the most I’ve had in years.  

### Step 3: Find the missing stars and restore the last six constellations.

Hint: Missing stars are hidden around the Archives. Your Nubbins can sniff them out. · check: `puzzle:constellation:altador:12`

#### Scene `np12-stars2`

_The second night. The last six shapes are harder: their stars are faint, and some are missing altogether._  
**The Archivist** _(sad)_: The Bard’s stars went first. Nobody ever writes down the musicians.  
_Your Nubbins scatter through the Archives and come back with stars: one under a desk, one in a teacup, one in a Nubbin’s mouth._  
**The Archivist**: I don’t know how they got down here. I’m not going to ask.  
_High above, the finished shapes wait for the rest._  
**The Archivist**: When the last star goes in, the city will remember. Stand back. I don’t know what it does when it remembers.  
_Your Nubbin is holding the last star very carefully in both paws._  
**The Archivist**: That one’s the King’s. Now, or last?  

**Choices**

- **Save the King’s star for last.** — sets `{"np-12-order":"king-last"}`
    - **The Archivist**: Yes. A king should come last. It keeps them humble.
- **Put the King’s star in now.** — sets `{"np-12-order":"king-first"}`
    - **The Archivist**: Bold. The heroes won’t mind. They were always pushing him to the front.

#### Done `np12-stars2-done`

_The twelfth shape lights. The whole sky rings, like a glass tapped with a spoon._  
_Below, Altador comes into focus all at once: sharp, white, and very loud._  

#### Complete `np12-complete`

**The Archivist**: The Hall of Heroes. He’s been in here the whole time. Asleep. Forgotten, even by himself.  
_Twelve statues. Eleven are stone. The one in the middle wears a crown, and is breathing._  
**King Altador** _(think)_: Who…? I had a city. I had friends. I had a dog, I think. Did I have a dog?  
**The Archivist**: You had a city, Majesty. You still have it. This Keeper put it back in the sky.  
**King Altador** _(happy)_: Then thank you, Keeper. Altador is open to you: its gates, its Colosseum, and its terrible coffee.  
**King Altador**: We used to hold a cup in the Colosseum. Races, cheering, far too many flags. Bring your Nubbins, for old times’ sake.  
_Your Nubbin licks his hand. He laughs, surprised, as if he’d forgotten that too._  
_The Neopian Times prints a star chart on its front page. For the first time in years, somebody remembers to._  

**Rewards**

- Altador section (feature): Unlocks the Altador section for your Neopia sandbox: white stone, the Hall of Heroes and the star-roofed Archives.
- Colosseum race cup (feature): A one-time race cup in Altador’s Colosseum, run in Neopia with your Nubbins as guests (not a yearly event). The cup stays in Neopia.
- Neopian Times: ALTADOR REMEMBERED (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Stargazer of Altador (title): A trophy avatar for restoring Altador’s constellations.

Sets on completion: `{"np-12-done":true}`

**Notes:** Audience all. CONSTELLATION PUZZLE: twelve shapes on a star map, matched to outlines on the Archives floor. The Grove’s own names for the twelve council heroes: the Archer (bow), the Scholar (book), the Farmer (plough), the Thief (key), the Dreamer (crescent), the Knight (shield), the Builder (hammer), the Seer (eye), the Healer (leaf), the Bard (harp), the Wanderer (boot) and the King (crown). These are deliberately generic; the brief’s NP12 summary is from memory, so check against the source if matching the original heroes matters. Step 2: drag stars into six outlines (each placed star lights a district of the city). Step 3: find the missing stars (Bard, Healer, Wanderer each have one hidden: under a desk, in a teacup, carried by a Nubbin), then place the last six. The city sprite is blurred and goes sharp in stages. Unlocks the Altador section and the one-time Colosseum race cup, as the brief lists.

## NP13. The Return of Dr. Sloth

*Neopets site plot: The Return of Dr. Sloth (January–March 2008)* · audience: all · where: Neopia Central · when: After NP12, every screen in Neopia Central turns green. · requires: NP12

**Cast:** Dr. Sloth (Dr. Sloth (Neopets)), Gorix (Gorix of the Resistance (Neopets)), Cylara (Cylara (Neopets)), The Space Faerie (The Space Faerie (Neopets)), An Orange Grundo, A Purple Grundo

### Step 1: Meet the Resistance at the hidden shuttle dock.

Hint: Gorix’s shuttle is behind the Neopia Central Food Shop. Tap the stacked crates. · check: `talk:gorix`

#### Scene `np13-broadcast`

_Every screen in Neopia Central flickers green at once: shop signs, the bank clock, the Rainbow Pool’s fountain lights._  
**Dr. Sloth** _(happy)_: Greetings, Neopia. Do stop screaming; it’s unbecoming. I have taken back the Virtupets Space Station. It was always mine.  
**Dr. Sloth**: You may remember my robot in Maraqua. My voice in the ice. My butler at the lodge. My little fly at the feast.  
**Dr. Sloth**: Practice, all of it. Now I have the real thing: a station, a fleet, and a moon full of workers.  
_Your Nubbin growls at the screen. It has never growled before. It looks surprised at itself._  
**Gorix**: Psst. Keeper. Don’t turn round. Look at the shop window.  
_In the reflection, a stocky Grundo in a patched flight suit is pretending to read a menu._  
**Gorix**: Gorix. The Resistance. We’ve watched you knock his toys over for years. Fancy finishing the job?  

**Choices**

- **Yes. Let’s finish it.** — sets `{"np-13-joined":"eager"}`
    - **Gorix**: Good. Shuttle leaves in ten minutes. It’s held together with tape, so don’t lean on anything.
- **Ask what the plan is first.** — sets `{"np-13-joined":"cautious"}`
    - **Gorix**: Kreludor first. He’s got the Grundos fighting each other. Can’t beat him while they do.
- **Ask if your Nubbins can come.** — sets `{"np-13-joined":"nubbins"}`
    - **Gorix**: Can they come? They’re half the plan. His robots can’t aim at anything that small.

#### Done `np13-broadcast-done`

_The shuttle rattles, roars and climbs. Below, Neopia shrinks to a green and blue marble._  
_Something falls off the shuttle with a clang. Gorix tapes over the hole without looking up._  
_Ahead, grey and pitted and close: Kreludor, the moon._  

### Step 2: Talk both Grundo camps into peace at the Kreludite mine.

Hint: Speak to the orange and the purple camp leaders, then bring them to the middle of the crater. · check: `talk:kreludor:grundo-camps:2`

#### Scene `np13-kreludor`

_Kreludor’s mines glitter with Kreludite. Two camps of Grundos face each other across a crater, orange on one side, purple on the other._  
**Gorix** _(angry)_: He told the orange lot the purple lot were stealing. Then told the purple lot the same. Then sold them both shovels.  
**An Orange Grundo** _(angry)_: They took our seam! Everyone knows they took our seam!  
**A Purple Grundo** _(angry)_: We never touched your seam! You took our seam!  
_Between the camps, a young Grundo girl sits on a rock, swinging her legs, bored of everyone._  
**Cylara**: They’ve been shouting for a week. Nobody’s mined a thing. He wins either way.  
**Cylara** _(think)_: I’m Cylara. Gorix says you’re useful. Are you?  
_Your Nubbins bounce in the low gravity, very slowly, and very happily._  

**Choices**

- **Lay both camps’ mine maps side by side.** — sets `{"np-13-peace":"maps"}`
    - The maps match. The seam runs under both camps, and his pipes are draining it from below.
- **Get both camps to sit down and eat together.** — sets `{"np-13-peace":"picnic"}`
    - Nobody can shout with their mouth full. By the second sandwich they’re comparing notes on Sloth.
- **Let your Nubbins play in the middle of the crater.** — sets `{"np-13-peace":"play"}`
    - Your Nubbins play tag between the camps. Grundos of both colours start cheering for the same one.

#### Done `np13-kreludor-done`

**An Orange Grundo** _(think)_: He played us.  
**A Purple Grundo** _(angry)_: He played all of us.  
**Cylara** _(happy)_: Good. Now we play him back.  

### Step 3: Fight through the flagship’s robot guards to reach Dr. Sloth.

Hint: Robots are tall and slow to aim down. Small Nubbins get under their guard. · check: `karate:wave:return-of-dr-sloth:3`

#### Scene `np13-token`

_At the crater’s edge the dark sky shimmers, and a faerie made of starlight steps down onto the moon dust._  
**The Space Faerie** _(soft)_: Cylara. You have been very patient. Here.  
_She gives Cylara a token: a small silver disc, warm, with a single star set in the middle._  
**The Space Faerie**: Use it close to him. Very close. It works only once.  
**Cylara**: Once is plenty.  
**Gorix** _(think)_: His flagship is docked above the mine. Guarded by every robot he ever built, and some he never finished.  
_Your Nubbins line up beside the Grundos, orange and purple together. Nobody needed to ask them._  
**The Space Faerie**: Keeper, get her to him. That is all you have to do.  

#### Done `np13-token-done`

_The last robot topples. It is a half-built Mechachiazilla, and it falls with a sad clank._  
**Gorix**: He never could finish anything.  

### Step 4: Keep Dr. Sloth busy for three rounds while Cylara gets close.

Hint: His claws strike where you were, not where you are. Keep moving, and stay between him and Cylara. · check: `karate:survive:dr-sloth:3`

#### Scene `np13-sloth`

_The flagship’s bridge is green light and humming screens. Dr. Sloth turns his chair round slowly, as if he has practised._  
**Dr. Sloth**: The Keeper. A child. And a great many very small pets. Is this your army?  
**Dr. Sloth** _(happy)_: I have beaten you a hundred times in my head. I shall enjoy doing it in person.  
**Cylara**: You haven’t beaten anyone. You’ve just kept coming back.  
**Dr. Sloth** _(angry)_: Persistence, girl, is the highest form of genius. I should know. I have persisted magnificently.  
_He pulls a lever. The floor bristles with claws. Every screen shows your face, twelve times, unflatteringly._  
**Gorix**: Keep him busy! She has to get close!  
_Cylara slips behind a console. Your Nubbins spread out across the bridge._  

**Choices**

- **Keep him talking about himself.** — sets `{"np-13-distract":"talk"}`
    - **You**: The fly at the feast. Was that your idea?
    - **Dr. Sloth**: Of course it was. Shall I tell you how I built it? It began with a single wing…
- **Lead the claws on a chase round the bridge.** — sets `{"np-13-distract":"chase"}`
    - Your Nubbins run rings. The claws chase them, tangle, and tie themselves in a knot.
- **Unplug the screens.** — sets `{"np-13-distract":"screens"}`
    - **Dr. Sloth**: NOT THE SCREENS. Those are for my face!

#### Done `np13-sloth-done`

_Cylara steps out right beside his chair and holds up the silver token._  
**Dr. Sloth** _(shock)_: What is that? Put that down. Put that—  

#### Complete `np13-complete`

_Light pours out of the token, cold and clear. It folds around Dr. Sloth like a shell closing._  
**Dr. Sloth** _(angry)_: No. No! I will come b—  
_And he is gone, sealed inside a small, bright, silent star no bigger than a marble._  
**Cylara** _(happy)_: Once was plenty.  
**Gorix** _(happy)_: The station’s ours. The Grundos are free. And nobody has to watch another green broadcast.  
_Cylara opens the airlock. The token drifts out, spinning, smaller and smaller, until it is just another star._  
**The Space Faerie** _(soft)_: Let it drift. Space is very big, and he is very small now.  
_Back home, the rainbow gate shimmers a colour you have never seen. For one visit, it opens on an island no map has ever shown._  
_Lutari Island. Your Nubbins are already running for the gate._  

**Rewards**

- The Neopia line, complete (flag): Completes the Neopia line: every plot played, and Dr. Sloth trapped for good.
- Lutari Island, once (feature): The rainbow gate opens once onto Lutari Island, the island nobody can find. One visit only.
- Neopian Times: SLOTH SEALED IN A STAR (item): This plot’s Neopian Times front page, kept in your Neopia scrapbook.
- Avatar: Hero of the Resistance (title): A trophy avatar for ending the Return of Dr. Sloth.

Sets on completion: `{"np-13-done":true,"np-line-complete":true,"np-lutari-gate":"open-once"}`

**Learning Grove swaps**

- `np13-broadcast#2` → You may remember my robot in Maraqua. My butler at the lodge. My little fly at the feast.

**Notes:** Learning Grove: the broadcast skips the Voice in the ice (NP2 is main only) via childLines. Payoff of `np-05-stance` (main game only): step 1 plays NEOPIA_LINE_VARIANTS np13-broadcast-defend / -parley / -villagers in place of np13-broadcast (Gorix recruits the Keeper he heard about at Meri Acres; the yes / plan / bring replies change with it). Audience all. Sloth is trapped, not killed: sealed in the Space Faerie’s token, which drifts off into space, as in the brief. Sloth thread payoff: his broadcast lists every plant by name, in order (Mechachiazilla in NP1, the Voice in NP2, Maverick in NP3, the metal fly in NP4), and the last robot guard is a half-built Mechachiazilla. Step 2 is a talk-and-bring puzzle (both camp leaders to the crater centre); any choice works. Step 3 is three robot waves on the flagship; step 4 a 3-round survive bout with Sloth’s floor claws, ending in Cylara’s token cutscene. Kreludor has low gravity: Nubbins jump higher there. Epilogue: the rainbow gate turns an unknown colour and opens once to Lutari Island (np-lutari-gate: open-once; the sim closes it after one visit). Completes the Neopia line.
