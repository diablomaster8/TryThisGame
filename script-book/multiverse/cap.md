# Multiverse: Captain America (CA1–CA10)

## CA1. Project Rebirth

*Captain America Comics #1 (1941)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: Any time once the Multiverse rift is open and the Keeper owns an all-E-grade Nubbin

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Dr Erskine (Dr. Abraham Erskine (Marvel)), The Colonel (The army officer over Project Rebirth (later Chester Phillips)), The Man in Grey (The Nazi agent who shoots Erskine (later named Heinz Kruger))

### Step 1: Take your weakest Nubbin through the rift and follow Dr Erskine.

Hint: Put an all-E-grade Nubbin in your Multiverse party. If you have none, your lowest-graded Nubbin will do. · check: `party:nubbin:all-e-grade`

#### <a id="mv-ca01-recruit"></a>Scene `mv-ca01-recruit`

_The rift sets you down on a wet pavement outside an army recruiting office. The posters are new. The cars are not._  
_Your weakest Nubbin is tucked under your arm. Every grade on its sheet is an E. It wanted to come anyway._  
_A thin young man comes down the steps with a stamped card. He folds it in half so nobody can read it._  
**Steve Rogers** _(sad)_: Turned down. Again. Asthma, a bad heart, flat feet, and today they found something wrong with my ears.  
**Steve Rogers**: That’s five offices. I keep changing the address and they keep reading the same body.  
_He notices your Nubbin, which is trying very hard to look taller than it is._  
**Steve Rogers** _(happy)_: Is that one signing up too? Good luck. They measure your chest. Breathe in.  
_Across the street an old man in a heavy coat has been watching the steps for an hour. He isn’t watching the soldiers._  
**Dr Erskine**: Excuse me. You, the young man who keeps coming back. And you, with the small one. Walk with me a little?  
**Steve Rogers** _(think)_: Who’s asking?  
**Dr Erskine**: A doctor who is tired of choosing the wrong people. My name is Erskine.  

**Choices**

- **He keeps coming back. That has to count.** — sets `{"mv-ca-rebirth":"vouched"}`
    - **Dr Erskine**: It counts for nearly everything. Hold on to that thought.
    - Steve looks at you as if nobody has said a kind word on these steps in weeks.
- **Careful, Steve. Old men in coats offer odd deals.** — sets `{"mv-ca-rebirth":"wary"}`
    - **Dr Erskine**: Very wise. And I am offering a very odd deal.
    - **Steve Rogers**: I’ve been offered worse. Mostly I’ve been offered nothing.

#### <a id="mv-ca01-recruit-done"></a>Done `mv-ca01-recruit-done`

**Dr Erskine** _(think)_: And that one. The little one. Every grade an E, yes?  
**Dr Erskine**: Then it has never once been handed anything. Good. It will know what to do if it ever is.  

### Step 2: Run the boot-camp course with Steve Rogers and your Rebirth Nubbin.

Hint: Finishing is enough. The timer is there to annoy the Colonel, not to judge you. · check: `race:finish:mv-boot-camp`

#### <a id="mv-ca01-camp"></a>Scene `mv-ca01-camp`

_Erskine’s project borrows a corner of an army camp: forty volunteers, one obstacle course, and a colonel who hates it all._  
_The others run the course in four minutes. Steve takes nine. Your Nubbin takes eleven and falls off the wall twice._  
**The Colonel** _(angry)_: Doctor, your boy and his pet came in dead last. I could find you a mule with better numbers.  
**Dr Erskine**: Numbers. You measure what a man can lift. I am about to give him more to lift than anyone alive.  
**Dr Erskine**: So I must know what he does when he is strong and nobody is looking. That is not on your clipboard.  
_On the second lap a big recruit catches his boot at the wall and goes down hard. The pack runs past him._  
_Steve stops. So does your Nubbin. Neither of them can lift him, so they both try anyway._  
**The Colonel**: Wasting his time on a man who’ll wash out tomorrow.  
**The Colonel** _(angry)_: In a war, Doctor, the man who stops loses the hill. I need soldiers who keep running.  
**Dr Erskine** _(think)_: And I need one who knows what the hill was for.  
**Dr Erskine** _(happy)_: Yes. Exactly that. Write it down, Colonel.  
**Dr Erskine** _(think)_: Run it once more with them, Keeper. Not to win. I want to see whether the little one waits for him again.  

#### <a id="mv-ca01-camp-done"></a>Done `mv-ca01-camp-done`

_Last again. Your Nubbin crosses the line holding the strap of Steve’s pack in its mouth._  
**Dr Erskine** _(happy)_: Him. And, if the army took such things, it. Tomorrow we begin.  

### Step 3: Stop the man in grey before he gets out of the laboratory.

Hint: A short karate bout: your Nubbin only has to stay on its feet until Steve reaches the door. · check: `karate:win:mv-rebirth-spy`

#### <a id="mv-ca01-rebirth"></a>Scene `mv-ca01-rebirth`

_The laboratory hides behind a curio shop. A bell rings as you go in. The old woman at the counter is not an old woman._  
_Inside: a steel couch, a rack of glass ampoules, generals in good coats, and a man in grey at the back, taking notes._  
**Dr Erskine**: One injection. Then the rays. The body will become what it was always able to become.  
**Steve Rogers** _(think)_: Will it hurt?  
**Dr Erskine**: Yes. I am sorry. I have never lied to a volunteer, and I will not start with the most important one.  
_Your Nubbin climbs onto the couch beside Steve and holds very still. Nobody has the heart to move it._  
_The serum goes in. The lamps come on. Under the sheet, Steve’s shape changes like weather coming over a hill._  
_When it is done he sits up, broad and astonished, and looks at his hands as if they belong to somebody else._  
**Dr Erskine** _(happy)_: It works. Gentlemen, it works! With this, a whole army of—  
_The man in grey stands up. You see the pistol a heartbeat before anyone else. So does your Nubbin._  
_Shots. Glass. Erskine falls among his own ampoules, and every one of them breaks._  
**The Man in Grey** _(angry)_: Your miracle ends tonight, Doctor. Nobody else gets one.  

#### <a id="mv-ca01-rebirth-done"></a>Done `mv-ca01-rebirth-done`

_Your Nubbin clings to the spy’s trouser leg like a burr. It slows him by one step._  
_One step is enough. Steve crosses the room in two strides, and the spy reels back into the ray machine. A flash. Then quiet._  

### Complete

#### <a id="mv-ca01-complete"></a>Complete `mv-ca01-complete`

_The formula was never written down. It lived in Erskine’s head, and his head is going quiet._  
**Dr Erskine** _(sad)_: One, then. Only one. It will have to be enough.  
**Dr Erskine** _(soft)_: Little one. I would have picked you too. The strong forget what it was like. You never will.  
_His hand goes still on your Nubbin’s head._  
**Steve Rogers** _(sad)_: I didn’t even get to thank him.  
**You**: Thank him by being worth it.  
**Steve Rogers**: …Yeah. All right. Yeah.  
_Before you go back through the rift, Steve ties a strip of striped cloth around your Nubbin’s neck. It is a little too long._  

**Rewards**

- Erskine’s Pick (title): Title for the Nubbin that went through Project Rebirth. Shown on its stat sheet. Its grades stay exactly as they are.
- Rebirth Scarf (cosmetic): A striped scarf, a little too long, tied on by Steve Rogers. Wearable by any Nubbin.

Sets on completion: `{"mv-ca01":true}`

**Notes:** Opens the Captain America line; no prerequisite beyond the Multiverse rift. Check `party:nubbin:all-e-grade`: if the player has no all-E Nubbin, accept the lowest total-grade Nubbin and swap the done line “Every grade an E, yes?” for “Not a grade on it above a D, yes?”. Store that Nubbin’s id in `mv-ca-rebirth-nubbin`; CA10 calls it back, and the title goes to it. If it later leaves the Grove, CA10 uses any all-E Nubbin. Staging: 1940s street, army camp course (race track reskin), curio-shop lab with a humming ray lamp. Erskine’s shooting is off-panel: cut to white on the shots, back on broken glass. No blood. Issue checked: Captain America Comics #1 (March 1941); Erskine is “Prof. Reinstein” there, named Erskine in later retellings.

## CA2. Bucky and the Red Skull

*Captain America Comics #1–7 (1941)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA1, Project Rebirth · requires: CA1

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Bucky Barnes (James “Bucky” Barnes (Marvel)), The Red Skull (Johann Schmidt, the Red Skull (Marvel))

### Step 1: Talk to Bucky Barnes in Steve’s tent at Camp Lehigh.

Hint: Bring your Run Nubbin. Bucky only talks shop with somebody faster than him. · check: `talk:bucky-barnes`

#### <a id="mv-ca02-tent"></a>Scene `mv-ca02-tent`

_Camp Lehigh, 1941. Private Steve Rogers is the clumsiest soldier in his company, on purpose. He drops his rifle on a schedule._  
_Your Run Nubbin has been adopted by the camp mascot, a quick-talking kid in a borrowed cap._  
**Bucky Barnes**: Bucky Barnes. Regimental mascot, unofficial, unpaid. Your little guy beat me to the mess hall three times. Nobody beats me.  
_After lights-out, the kid and your Nubbin race to Steve’s tent with a stolen pie. The flap is open._  
_Steve is halfway into a blue costume with a white star on the chest. A round shield leans on his cot._  
**Bucky Barnes** _(shock)_: No. No! The flag fella from the newsreels is the private who trips over tent pegs?  
**Steve Rogers**: Close the flap. Close it! Bucky, listen to me—  
**Bucky Barnes** _(happy)_: Oh, I’ll keep it quiet. Course I will. For a price.  
**Steve Rogers**: Kid, I’m not paying you.  
**Bucky Barnes**: Not money. Take me along. I can run, I can climb, I can box, and I’ve never told on anybody in my life.  
_Steve looks at you. The kid looks at you. Your Nubbin, still holding the pie, also looks at you._  

**Choices**

- **He kept up with my Nubbin. Let him come.** — sets `{"mv-ca-bucky":"backed"}`
    - **Steve Rogers**: You realise you’ve just made yourself responsible for him.
    - Bucky salutes you with the pie. Most of it stays on the plate.
- **He’s a kid, Steve. If he comes, he stays behind you.** — sets `{"mv-ca-bucky":"cautious"}`
    - **Bucky Barnes**: Behind him. Fine. I’ll be the fastest thing behind anybody.
    - **Steve Rogers**: Behind me, and next to the Nubbin. That’s the deal.

#### <a id="mv-ca02-tent-done"></a>Done `mv-ca02-tent-done`

_By morning Bucky has a domino mask cut from a blue sock. He has cut a tiny one for your Nubbin._  
**Bucky Barnes** _(happy)_: Partners. All three of us. Four, with the pie.  

### Step 2: Beat the Red Skull’s saboteurs on the aircraft-plant floor.

Hint: Three karate bouts in a row. Run Nubbins dodge best on the gantry. · check: `karate:win:mv-skull-saboteurs`

#### <a id="mv-ca02-plant"></a>Scene `mv-ca02-plant`

_Weeks of night raids. Bucky goes over every fence first, and your Run Nubbin goes over just behind him, like his shadow._  
**Bucky Barnes**: Three bombers down this month, straight out of the factory. Every pilot radioed the same thing before he crashed.  
**Steve Rogers** _(think)_: A face in the cockpit glass. Red, and grinning.  
_The aircraft plant at midnight. Rows of half-built bombers. One office light, high up on the gantry._  
_A figure steps into it. Its head is a red skull, polished and awful, and the voice behind it is perfectly calm._  
**The Red Skull**: Captain America. And the boy. And, I see, some sort of rodent. Americans will make a pet of anything.  
**The Red Skull**: Every bomber in this hall will fall before it reaches the war. Fear flies faster than aeroplanes, Captain.  
**Steve Rogers**: Then let’s see how fast you can run.  
_Men in overalls put down their spanners and pick up crowbars. Half the night shift is on the Skull’s payroll._  
**Bucky Barnes** _(angry)_: I’ll take the left. Little one, you take the ladder. Go!  

#### <a id="mv-ca02-plant-done"></a>Done `mv-ca02-plant-done`

_The saboteurs are tied up with their own cable. The gantry is empty. A red mask lies on the steps._  
**Steve Rogers** _(think)_: That isn’t the last of him. A man like that always has a spare face.  
**Bucky Barnes** _(happy)_: Then we keep knocking them off.  
_One saboteur is barely older than Bucky, crying into his collar. The Skull paid him twenty dollars a bomber._  
**Bucky Barnes** _(sad)_: Twenty bucks. My old man worked a month for twenty bucks. Cap, his family’s probably eating off it.  
**Steve Rogers**: Three pilots didn’t come home because of him, Bucky.  

**Choices**

- **Hand him to the military police. Three pilots are owed that.** — sets `{"mv-ca02-saboteur":"arrested"}`
    - **Steve Rogers**: He’ll get a fair hearing. That’s the difference between us and the Skull. It has to be.
    - **Bucky Barnes**: Yeah. I know. I just hate knowing it.
- **He’s a scared kid. Make him tell you everything, then let him run.** — sets `{"mv-ca02-saboteur":"released"}`
    - He talks for an hour: names, drop points, a farmhouse the Skull uses. Then he runs and doesn’t look back.
    - **Steve Rogers**: If he does it again, that’s on us. I’ll carry it. You too, Keeper.

### Complete

#### <a id="mv-ca02-complete"></a>Complete `mv-ca02-complete`

_Dawn at Camp Lehigh. Private Rogers trips over a tent peg in front of the sergeant, right on time._  
_The sergeant shouts himself purple. Your Run Nubbin trips over the same peg in sympathy, and the sergeant gives up._  
**Steve Rogers** _(think)_: I keep telling myself he’s too young for this. Then he’s first over every fence, and I let him.  
**Bucky Barnes**: You’re coming back, right? The little one’s the only one who ever beat me to breakfast.  
**Steve Rogers** _(soft)_: It’ll be back. So will we.  
_Your Run Nubbin wears its sock mask all the way home through the rift and will not take it off at bedtime._  

**Rewards**

- Sock Mask (cosmetic): A tiny blue domino mask Bucky cut for your Run Nubbin. Wearable by any Nubbin.
- Camp Lehigh Pie Tin (decor): A dented army pie plate for the Grove. Nubbins sometimes sit in it.

Sets on completion: `{"mv-ca02":true}`

**Notes:** Needs a Run Nubbin in the party for step 1 (check `talk:bucky-barnes` should only fire with one present; otherwise Bucky says he’s busy). Store the Run Nubbin’s id in `mv-ca-bucky-nubbin`; CA9 prefers it. The Red Skull escapes, as he recurs. The step 2 done choice (mv-ca02-saboteur: arrested / released) is the Keeper’s call on mercy; it changes nothing mechanical. Staging: Camp Lehigh tents at night, aircraft-plant hall with gantry for the karate arena. The Skull of 1941 #1 was an impostor (George Maxon); Johann Schmidt arrives in #7. We play them as one Skull. SIGNATURE CHOICE: mv-ca02-saboteur (arrested | released) pays off through MV_CAP_VARIANTS at mv-ca05-smear (who the witnesses are, or who brings Steve names), mv-ca07-shield (what Steve offers Walker) and mv-ca10-memory (what the real Steve remembers that Hydra’s Steve cannot).

## CA3. Frozen

*The Avengers #4 (1964)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA2, Bucky and the Red Skull · requires: CA2

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Bucky Barnes (James “Bucky” Barnes (Marvel)), Baron Zemo (Baron Heinrich Zemo (Marvel)), The Wasp (Janet van Dyne, the Wasp (Marvel))

### Step 1: Chase Baron Zemo’s drone plane down the runway.

Hint: An Expedition: send your fastest Nubbin along the runway and your Swim Nubbin to the water’s edge. · check: `expedition:complete:mv-drone-plane`

#### <a id="mv-ca03-plane"></a>Scene `mv-ca03-plane`

_The last spring of the war. A grey airfield on the English coast, and a drone plane packed nose to tail with explosives._  
**Baron Zemo** _(happy)_: Baron Zemo sends his compliments, Captain. The plane flies itself to London. You may watch it go.  
**Baron Zemo** _(angry)_: Forgive the hood. Thanks to your last visit to my laboratory, it no longer comes off. I have had it lined.  
**Bucky Barnes** _(happy)_: He’s still sore about the glue. Cap, he’s still sore about the glue.  
_The engines catch. The plane rolls. Steve and Bucky are running before anyone gives an order._  
**Steve Rogers**: Bucky, the wing strut! I’ll take the tail!  
_Bucky gets aboard. Steve doesn’t. He hangs from the wheel for a hundred yards and drops into the sea._  
**Bucky Barnes** _(think)_: There’s a wire on this bomb. Two wires. I think I can— yeah, I think I’ve got it, Cap!  
_Above the water the plane climbs. In its belly, a boy is holding two wires and a torch._  
_Your Nubbins have their own choice to make. One of them is still on the plane. The other is in the water near Steve._  

**Choices**

- **Stay with Bucky. Help him with the wires.** — sets `{"mv-ca-plane":"with-bucky"}`
    - Your Nubbin holds the torch steady over the bomb. Bucky’s hands are not shaking. Its paws are.
    - **Bucky Barnes**: Off, little one. Jump. Now. Go!
    - It jumps. It is the last thing he says to anyone.
- **Dive after Steve.** — sets `{"mv-ca-plane":"with-steve"}`
    - Your Nubbin finds Steve’s collar in the grey water. He is trying to swim back towards the plane.
    - **Steve Rogers**: Bucky! Bucky, get out of there!

#### <a id="mv-ca03-plane-done"></a>Done `mv-ca03-plane-done`

_The sky turns white. When it clears, there is no plane, only pieces falling._  
_Steve goes under. The sea is so cold it stops feeling like water. Your Nubbins come up. He doesn’t._  

### Step 2: Dive under the Arctic ice with your Swim Nubbin.

Hint: An Expedition dive. Your Swim Nubbin leads; the others keep the hole in the ice open. · check: `expedition:complete:mv-arctic-dive:swim`

#### <a id="mv-ca03-ice"></a>Scene `mv-ca03-ice`

_The rift drops you somewhere else in time: sea ice, a white sun that never sets, and a submarine nosing through the floes._  
**The Wasp** _(happy)_: Don’t mind us, we’re the Avengers on a very cold detour. Is that yours? It’s been swimming under the ice for an hour.  
_Your Swim Nubbin surfaces, dives, surfaces again. Each time it comes up it squeaks the same note and points down._  
**The Wasp**: It’s found something. Or it’s found a fish and wants us to be proud.  
_You follow its bubbles. Under the ice a man in a blue uniform hangs in a clear block, arms out, as if he fell a moment ago._  
_The star on his chest has gone pale. The shield is still on his arm. He never let go of it._  
**The Wasp** _(shock)_: Is that a museum costume? That’s a man. That’s— oh.  
_Your Swim Nubbin presses its face to the ice and stays there, very still, the way it waits beside an egg._  
**The Wasp**: Thaw him slowly. Slowly! If anybody’s still in there, I want him back in one piece.  

#### <a id="mv-ca03-ice-done"></a>Done `mv-ca03-ice-done`

_In the submarine’s warm room the ice runs off him in streams. Steve opens his eyes and sits up swinging._  
**Steve Rogers** _(shock)_: Bucky! The plane— where’s Bucky?  
_Your Swim Nubbin climbs onto his chest and holds on with both paws, as if to keep him in this year._  

### Complete

#### <a id="mv-ca03-complete"></a>Complete `mv-ca03-complete`

**Steve Rogers**: How long? Tell me straight.  
**The Wasp** _(sad)_: A long time, Captain. Years and years. Most of the people you knew are old, or gone.  
**Steve Rogers**: And the kid? Bucky?  
_Nobody answers. Your Swim Nubbin pushes its head under his hand._  
**Steve Rogers** _(sad)_: He was a kid. I told him to stay behind me.  
**Steve Rogers** _(think)_: Everything I know is twenty years out of date. The money. The songs. Who’s on which side.  
**The Wasp** _(soft)_: The coffee’s better. The rest we’ll catch you up on. You can be slow for a bit, you know. We’ll wait.  
_At the rift he turns around._  
**Steve Rogers**: Look after that one. It found me when nobody else could.  

**Rewards**

- Found Him First (title): Title for the Swim Nubbin that found Steve Rogers in the ice.
- Block of Arctic Ice (decor): A clear ice block for the pond’s edge. It never quite melts. Swim Nubbins like to lean on it.

Sets on completion: `{"mv-ca03":true}`

**Notes:** Two time periods: April 1945 (English airfield, Channel) and the 1960s Arctic. Fade to white on the explosion; no bodies. The `mv-ca-plane` flag colours CA9’s rooftop scene. In Avengers #4 Namor throws the ice block into the sea and the Avengers’ submarine picks Cap up; here the Swim Nubbin finds him first, as the brief asks. Needs a Swim Nubbin in the party for step 2. The Wasp stands in for the whole Avengers team to keep the speaker count down.

## CA4. The Cosmic Cube

*Tales of Suspense #79–81 (1966)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA3, Frozen · requires: CA3

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), The Red Skull (Johann Schmidt, the Red Skull (Marvel)), A.I.M. Scientist (An Advanced Idea Mechanics scientist (Tales of Suspense #79))

### Step 1: Cross the Red Skull’s rewritten island to reach his palace.

Hint: An Expedition through a world the Cube keeps rewriting. Paths shift every few turns, so carry extra fruit. · check: `expedition:complete:mv-skull-island`

#### <a id="mv-ca04-cube"></a>Scene `mv-ca04-cube`

_A.I.M. built it in a lab under an island: a small cube that does whatever its holder wants._  
_The Red Skull was supposed to have died in the war. He walks into the lab in a fresh mask and takes it from them._  
**A.I.M. Scientist** _(shock)_: He just asked for it, and we gave it to him. Why did we give it to him?  
**The Red Skull** _(happy)_: Because the Cube likes a firm hand.  
_The Skull turns it once. The island grows a palace. He turns it twice, and the A.I.M. men kneel and forget why._  
_He turns it at you, and your Nubbins’ colours drain to grey, the grey of a Nubbin nobody has ever loved._  
**Steve Rogers**: Leave them out of it, Skull. You want me. You always have.  
**The Red Skull**: I want everything, Captain. You are merely the first thing I shall frame and hang on the wall.  
_Your Nubbins are grey, but not gone. One of them is still breathing on your hand, warm._  

**Choices**

- **Hold them close. Don’t look at the Cube.** — sets `{"mv-ca-cube-gaze":"refused"}`
    - You keep your eyes on your Nubbins. Colour creeps back into one cheek, then the other.
    - **The Red Skull**: Stubborn. Your whole species is stubborn.
- **Stare the Skull down.** — sets `{"mv-ca-cube-gaze":"stared"}`
    - You look straight at him. The Cube hums, as if amused. Your Nubbins stay grey, but they press closer.
    - **Steve Rogers**: Good. Let him see we’re not scared.

#### <a id="mv-ca04-cube-done"></a>Done `mv-ca04-cube-done`

_The palace stairs keep changing their number. Your Nubbins count them out loud, and that seems to help._  
_At the top, a throne room with no ceiling._  

### Step 2: Keep the Red Skull’s hands busy until Steve can knock the Cube away.

Hint: A karate bout. You don’t need to win on points, only to last three rounds against the Skull. · check: `karate:win:mv-red-skull`

#### <a id="mv-ca04-throne"></a>Scene `mv-ca04-throne`

_The Skull sits under a sky he has painted himself, the Cube in his lap._  
**The Red Skull**: Kneel, Captain. Kneel, and your Keeper may keep their pets.  
_He turns the Cube. Beside the throne, a boy in a borrowed cap flickers into being, grinning, a pie in his hands._  
**The Red Skull** _(happy)_: Kneel, and I will make him real. Your partner, back from the sea. Is one bent knee too much for the boy?  
_Steve’s shield arm drops an inch. Your Nubbin takes one step towards the boy, then stops: it smells nothing._  
**Steve Rogers** _(sad)_: He isn’t there. Your toy can draw him, Skull. It can’t make him. That’s the difference.  
**Steve Rogers** _(think)_: You need a cube to make one man kneel. Doesn’t that tell you something?  
**The Red Skull**: It tells me I have a cube.  
**Steve Rogers**: I was a skinny kid from Brooklyn with nothing, and I still stood up. You’ve got the universe in your lap and you’re scared of me.  
_The Skull’s grip tightens. A cube can remake the world, but it can’t settle a grudge. Only hands do that._  
**The Red Skull** _(angry)_: I need no toy to break you.  
_He sets the Cube on the arm of the throne and comes down the steps himself. Pride, it turns out, outweighs the universe._  
**Steve Rogers**: Keep him busy. I only need one throw.  

#### <a id="mv-ca04-throne-done"></a>Done `mv-ca04-throne-done`

_Steve’s shield clips the throne. The Cube bounces once, twice, off the palace wall and over the edge._  
_It falls a long way and goes into the sea without a splash, like a coin into a well._  
**The Red Skull** _(shock)_: No!  

### Complete

#### <a id="mv-ca04-complete"></a>Complete `mv-ca04-complete`

_The palace fades. The island is a rock again, and the Skull is gone in the confusion, as he always is._  
_Your Nubbins’ colours come back all at once, like a held breath let out._  
**Steve Rogers** _(think)_: It’s down there now. Somebody will go looking for it. Somebody always does.  

**Choices**

- **Send your Swim Nubbin to mark the spot.** — sets `{"mv-ca-cube":"marked"}`
    - Your Swim Nubbin dives and comes back with a pebble from the place it sank. You aren’t sure why you keep it.
    - **Steve Rogers**: Smart. If it ever comes back up, we’ll want to know where from.
- **Let the sea keep it.** — sets `{"mv-ca-cube":"let-sink"}`
    - **Steve Rogers**: Good. Let the fish have the universe for a while. They’ll do less with it.
    - On the beach, your Nubbin finds a smooth pebble anyway, and gives it to you.

**Rewards**

- The Cosmic Cube Thread (flag): The Cube lies under the sea. Opens the thread that CA9 and CA10 follow, and counts towards Secret Wars (E2).
- Sea Pebble (decor): A smooth grey pebble from the Skull’s island. It is very slightly warm.

Sets on completion: `{"mv-ca04":true,"mv-ca-cube-thread":true}`

**Notes:** Unlocks CA9 and CA10’s thread (both require CA4), and is required for Secret Wars (E2). The grey effect on the party Nubbins is the Shadow-Nubbin palette applied temporarily; it must revert at the end of step 2 whatever the player chose, and must never touch real Shadow state or trust. Throne room: palace with a painted sky, no roof. Pebble description can say “from the spot where the Cube sank” when `mv-ca-cube` is `marked`. Issues checked: Tales of Suspense #79–81 (1966).

## CA5. Secret Empire

*Captain America #169–180 (1974–75)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA4, The Cosmic Cube · requires: CA4

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Sam Wilson (Sam Wilson, the Falcon (Marvel)), Number One (Number One of the Secret Empire (Captain America #175))

### Step 1: Follow the committee’s trail from the smear adverts to whoever is paying for them.

Hint: An Expedition with a Fly Nubbin scouting the rooftops. Sam’s falcon marks the safe streets. · check: `expedition:complete:mv-committee-trail`

#### <a id="mv-ca05-smear"></a>Scene `mv-ca05-smear`

_Every television in every shop window is running the same advert: a calm voice and a slow zoom on Captain America’s face._  
_Can we really trust him? asks the voice. A committee with a patriotic name has paid a fortune to ask it._  
**Sam Wilson** _(happy)_: Sam Wilson. The Falcon, when I’m working. The bird is Redwing, and he’s decided your Nubbins are family. Lucky you.  
**Sam Wilson**: Three weeks of adverts. Then this morning a man turns up dead, and the witnesses swear Cap did it.  
**Steve Rogers** _(angry)_: It wasn’t me. Somebody wore my face. They want the country to go looking for a new hero.  
**Sam Wilson**: And look who just landed on the news. Moonstone, the hero the committee likes. Funny timing.  
_A rally fills the park. Moonstone lands on the stage, and the crowd cheers like it was told to._  
**Steve Rogers**: Follow the adverts. Follow the money. Somebody always signs the cheques.  

**Choices**

- **Go to the rally and call Moonstone out.** — sets `{"mv-ca-secret-empire":"loud"}`
    - You shout from the crowd. Heads turn. Moonstone’s smile slips for exactly one second, and the cameras catch it.
    - **Sam Wilson**: Okay. Bold. I respect it. We are now running.
- **Follow the committee’s money quietly.** — sets `{"mv-ca-secret-empire":"quiet"}`
    - The donations run through four banks and a florist. Your Nubbins find the florist suspicious. They are right.
    - **Steve Rogers**: Patient. Good. They’re counting on us being angry.

#### <a id="mv-ca05-smear-arrested"></a>Variant `mv-ca05-smear-arrested`

_Variant of `mv-ca05-smear`._

_Every television in every shop window is running the same advert: a calm voice and a slow zoom on Captain America’s face._  
_Can we really trust him? asks the voice. A committee with a patriotic name has paid a fortune to ask it._  
**Sam Wilson** _(happy)_: Sam Wilson. The Falcon, when I’m working. The bird is Redwing, and he’s decided your Nubbins are family. Lucky you.  
**Sam Wilson**: Three weeks of adverts. Then this morning a man turns up dead, and the witnesses swear Cap did it.  
**Steve Rogers** _(angry)_: It wasn’t me. Somebody wore my face. They want the country to go looking for a new hero.  
**Sam Wilson**: One of the witnesses did ten years for sabotage. Says you put him in a cell in ’43, and he’s waited a long time to return the favour.  
**Steve Rogers** _(sad)_: The boy from the gantry. He got his fair hearing. It still came to this.  
**Sam Wilson**: And look who just landed on the news. Moonstone, the hero the committee likes. Funny timing.  
_A rally fills the park. Moonstone lands on the stage, and the crowd cheers like it was told to._  
**Steve Rogers**: Follow the adverts. Follow the money. Somebody always signs the cheques.  

**Choices**

- **Go to the rally and call Moonstone out.** — sets `{"mv-ca-secret-empire":"loud"}`
    - You shout from the crowd. Heads turn. Moonstone’s smile slips for exactly one second, and the cameras catch it.
    - **Sam Wilson**: Okay. Bold. I respect it. We are now running.
- **Follow the committee’s money quietly.** — sets `{"mv-ca-secret-empire":"quiet"}`
    - The donations run through four banks and a florist. Your Nubbins find the florist suspicious. They are right.
    - **Steve Rogers**: Patient. Good. They’re counting on us being angry.

#### <a id="mv-ca05-smear-released"></a>Variant `mv-ca05-smear-released`

_Variant of `mv-ca05-smear`._

_Every television in every shop window is running the same advert: a calm voice and a slow zoom on Captain America’s face._  
_Can we really trust him? asks the voice. A committee with a patriotic name has paid a fortune to ask it._  
**Sam Wilson** _(happy)_: Sam Wilson. The Falcon, when I’m working. The bird is Redwing, and he’s decided your Nubbins are family. Lucky you.  
**Sam Wilson**: Three weeks of adverts. Then this morning a man turns up dead, and the witnesses swear Cap did it.  
**Steve Rogers** _(angry)_: It wasn’t me. Somebody wore my face. They want the country to go looking for a new hero.  
**Sam Wilson**: Something else. A man came to the office at six this morning. Older, nervous. Said he owed you one from a gantry in ’43, and left names.  
**Steve Rogers** _(soft)_: He ran and never looked back. Seems he looked back once.  
**Sam Wilson**: His names match the committee’s donors. You just saved us a week.  
**Sam Wilson**: And look who just landed on the news. Moonstone, the hero the committee likes. Funny timing.  
_A rally fills the park. Moonstone lands on the stage, and the crowd cheers like it was told to._  
**Steve Rogers**: Follow the adverts. Follow the money. Somebody always signs the cheques.  

**Choices**

- **Go to the rally and call Moonstone out.** — sets `{"mv-ca-secret-empire":"loud"}`
    - You shout from the crowd. Heads turn. Moonstone’s smile slips for exactly one second, and the cameras catch it.
    - **Sam Wilson**: Okay. Bold. I respect it. We are now running.
- **Follow the committee’s money quietly.** — sets `{"mv-ca-secret-empire":"quiet"}`
    - The donations run through four banks and a florist. Your Nubbins find the florist suspicious. They are right.
    - **Steve Rogers**: Patient. Good. They’re counting on us being angry.

#### <a id="mv-ca05-smear-done"></a>Done `mv-ca05-smear-done`

_The trail ends in a bunker under the desert: rows of men in hoods, and a throne nobody sits on yet._  
**Sam Wilson**: Hoods. Of course it’s hoods.  

### Step 2: Follow Number One to Washington and stand with Steve when the hood comes off.

Hint: Walk Steve out through the halls afterwards. Tap him when he stops on the steps. · check: `talk:steve-rogers:after-number-one`

#### <a id="mv-ca05-number-one"></a>Scene `mv-ca05-number-one`

_The Secret Empire’s leader calls himself Number One. His plan was to wipe the minds of Washington and run it himself._  
_The plan fails. He runs. He runs straight to Washington, into a white house you’d know from any postcard._  
**Sam Wilson** _(shock)_: He went in there? Cap, he went in there?  
**Steve Rogers**: Then that’s where we’re going.  
_The guards let Captain America through out of habit. Your Nubbins follow, because nobody thinks to stop them._  
_In a quiet room Steve corners him and pulls the hood back. You can’t see the face from where you stand. Steve can._  
**Steve Rogers** _(shock)_: You. Of all people. You already had everything.  
**Number One**: I had a job. I wanted the country. You never understood the difference.  
_He steps back through a side door and shuts it. A single shot follows. Then nothing at all._  
_Your Nubbins press against your ankles and do not make a sound._  

#### <a id="mv-ca05-steps"></a>Done `mv-ca05-steps`

_On the steps outside, an aide in a grey suit catches Steve’s sleeve. He has a statement ready, already typed._  
_It says a lone madman was stopped in the grounds. It does not say who he was, or whose office he died in._  
**Sam Wilson** _(think)_: If the country hears the truth tonight, Cap, it might not get up in the morning.  
**Steve Rogers** _(angry)_: And if it never hears it, the next Number One gets the same quiet room.  

**Choices**

- **The country deserves the truth, even if it hurts.** — sets `{"mv-ca05-truth":"told"}`
    - Steve tears the statement in half, and the aide goes white. Somewhere a telephone starts ringing and does not stop.
    - **Steve Rogers**: People can carry the truth. It’s the lies that break their backs.
- **Let it lie. A frightened country makes worse choices than a sad one.** — sets `{"mv-ca05-truth":"buried"}`
    - Steve folds the statement into his pocket and says nothing to the cameras.
    - **Steve Rogers**: Maybe you’re right. I’ll never know if you are. That’s what I can’t stand.

### Complete

#### <a id="mv-ca05-complete"></a>Complete `mv-ca05-complete`

_That night Steve puts the shield down on a hotel bed and looks at it like a stranger’s._  
**Steve Rogers** _(sad)_: I always thought the flag and the people behind that door were the same thing. Tonight they weren’t.  
**Steve Rogers**: I can’t wear their colours while I don’t trust them. I’ll find a name that belongs to nobody.  
**Sam Wilson** _(soft)_: Nomad. The man without a country. Little dramatic. Suits you.  
_He holds the shield out to you._  

**Choices**

- **I’ll keep it safe till you want it back.** — sets `{"mv-ca-shield":"kept"}`
    - It is heavier than it looks. Your Nubbins help you carry it to the rift, one at each edge.
    - **Steve Rogers**: Thanks. Don’t let them use it as a sledge.
- **It’s yours. Put it in a cupboard, not in my hands.** — sets `{"mv-ca-shield":"cupboard"}`
    - **Steve Rogers**: Fair. It goes in a cupboard. I’ll know where it is.
    - He shuts the wardrobe door on it very gently, like a man closing a door on a sleeping child.

**Rewards**

- Nomad Cape (cosmetic): A dark blue-and-gold cape cut for a Nubbin, after Steve’s Nomad costume. It trails behind them.
- Without a Country (title): Title for a Nubbin that stood with Steve the night he gave up the shield.

Sets on completion: `{"mv-ca05":true}`

**Notes:** Number One’s face is never shown and never named; the White House is “a white house you’d know from any postcard”. His death is a closed door and one sound, no visuals; fade to black and hold a beat before the complete scene. If `mv-ca-shield` is `kept`, the shield sits in the Grove (decor slot, not usable) until CA6 opens, when Steve collects it; if `cupboard`, CA6 opens with him taking it out. Moonstone appears on screen only, no lines. The new step 2 done scene (mv-ca05-steps) sets mv-ca05-truth (told / buried); either way Steve still gives up the shield in the complete scene. Issues checked: Captain America #169–176 (1974); Steve gives up the shield in #176 and becomes Nomad in #180, so the source cites #169–180.

## CA6. The Madbomb

*Captain America #193–200 (1976)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA5, Secret Empire · requires: CA5

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Sam Wilson (Sam Wilson, the Falcon (Marvel)), William Taurey (William Taurey of the Royalist Forces of America (Captain America #193–200))

### Step 1: Find the source of the riot with your Fly Nubbin.

Hint: An Expedition. Your Fly Nubbin hears the bomb’s whine before anyone else; go where its ears point. · check: `expedition:complete:mv-madbomb-test:fly`

#### <a id="mv-ca06-riot"></a>Scene `mv-ca06-riot`

_A small town, a summer street, a brass band practising for the Bicentennial. Then everyone starts shouting at once._  
_Neighbours throw chairs. The barber goes after the baker. Nobody knows why, and nobody can stop._  
_Your Fly Nubbin hears it first: a whine too high for people, from a van parked on the corner. Its ears go flat._  
**Steve Rogers**: Back in the stars and stripes, back in trouble. What’s your Nubbin pointing at?  
**Sam Wilson**: The van. Everybody near it goes wild. Everybody further off just goes sort of mean.  
**Steve Rogers**: Then the closer we get, the worse it gets. Cover your ears and keep moving.  
_Your Fly Nubbin circles the van and dives at a grille on its roof. Under it sits a humming metal box the size of a trunk._  
**Sam Wilson** _(think)_: Madbomb. That’s what the notes in the cab call it. A small one. A test.  
**Steve Rogers**: A test for what?  

**Choices**

- **Rip the wires out before anyone else gets hurt.** — sets `{"mv-ca-madbomb":"smashed"}`
    - Your Nubbin yanks a fistful of cable. The whine stops. All down the street, people put down chairs and look embarrassed.
    - **Sam Wilson**: Crude. Effective. We learn nothing from the wreck, but nobody dies today.
- **Muffle it and keep it whole. We need to know who built it.** — sets `{"mv-ca-madbomb":"studied"}`
    - You stuff the grille with your jacket and the whine drops. Your Nubbins sit on the lid to keep it shut.
    - **Sam Wilson**: There’s a crest on the casing. A crown. Somebody round here really misses the king.

#### <a id="mv-ca06-riot-done"></a>Done `mv-ca06-riot-done`

_The notes name the real target. The big bomb is set for the country’s two-hundredth birthday._  
**Steve Rogers**: Then we’ve got until the fireworks.  

### Step 2: Race the Madbomb train and cut the bomb car loose before the anniversary.

Hint: A race along the tracks. Any Nubbin that keeps pace with the train can pull the coupling pin. · check: `race:win:mv-madbomb-train`

#### <a id="mv-ca06-estate"></a>Scene `mv-ca06-estate`

_A country estate in old-money hills. Men in powdered wigs, a royal crest over the fireplace, and a deep hum under the floor._  
**William Taurey** _(happy)_: William Taurey. My family lost this country in 1776, Captain. On its birthday I intend to take it back.  
**William Taurey**: Two hundred years of mob rule. The bomb only lets the mob be what it already is. Then the better sort steps in.  
**Steve Rogers** _(angry)_: You’ll drive a whole country to tear itself apart, so you can sit at the head of the table?  
**William Taurey**: Somebody must. I already have the chair.  
**William Taurey** _(happy)_: You of all men should agree, Captain. Your mob trusted the man who died behind that door.  
**Steve Rogers** _(angry)_: And it’ll get the next one wrong too, sometimes. It still gets to choose. You don’t get to choose for it.  
**Sam Wilson**: Also, and I can’t stress this enough, you are wearing a wig.  
_Through the window you see it: the big Madbomb on a flatcar, on a siding, already rolling towards the cities._  
**Sam Wilson**: Train’s picking up speed. I can catch it in the air. Can your Nubbins?  
_Your Nubbins are already running. Your Fly Nubbin is already overhead._  
**Steve Rogers** _(angry)_: Sam, the engine. Nubbins, the coupling. I’ll take the bomb car. On my mark!  

#### <a id="mv-ca06-estate-done"></a>Done `mv-ca06-estate-done`

_The coupling parts. The bomb car slows on a hill and stops in a field of cows, who are unimpressed._  
**Sam Wilson** _(happy)_: The whole country, saved by a coupling pin and a rodent with wings.  
**Steve Rogers**: Nubbin. They’re called Nubbins.  

### Complete

#### <a id="mv-ca06-complete"></a>Complete `mv-ca06-complete`

_The fireworks go up over the capital that night. Two hundred years, and not one riot._  
**Steve Rogers** _(think)_: Taurey thought people are only decent because nobody’s pushing them.  
**Sam Wilson**: Some folks push harder than others. People stay mostly decent. Mostly.  
**Sam Wilson** _(happy)_: Same goes for rodents with wings. Sorry. Nubbins. Redwing’s been correcting me all afternoon.  
_Your Fly Nubbin sleeps through the fireworks with its ears folded down, the most sensible thing anyone does all night._  

**Rewards**

- Bicentennial Bunting (decor): Red, white and blue bunting for the Grove fences. It flutters even when there’s no wind.
- Wax Earplugs (cosmetic): Tiny earplugs for a Fly Nubbin. They do nothing in the Grove except make it look very content.

Sets on completion: `{"mv-ca06":true}`

**Notes:** Opens with Steve back as Captain America (he collects the shield as CA5’s `mv-ca-shield` flag says). Needs a Fly Nubbin in the party for step 1. The madbomb’s whine: a thin, rising sine tone the player should barely hear; duck the music while it plays and stop it dead when the bomb is muffled or smashed. Riot staging is comic, not violent: thrown chairs, shouting, no injuries shown. Taurey’s plot in the comic is for 4 July 1976; we keep the date. Issues checked: Captain America #193–200 (1976).

## CA7. The Captain

*Captain America #332–350 (1987–1989)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA6, The Madbomb, and IM8, Armor Wars · requires: CA6, IM8

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Douglas Rockwell (Douglas Rockwell, Commission on Superhuman Activities (Marvel)), John Walker (John Walker, later U.S.Agent (Marvel)), The Red Skull (Johann Schmidt, the Red Skull (Marvel))

### Step 1: Sit in on the Commission’s hearing with Steve Rogers.

Hint: Bring at least one Nubbin. The Commission takes it as a sign that you are a serious person. · check: `talk:douglas-rockwell`

#### <a id="mv-ca07-commission"></a>Scene `mv-ca07-commission`

_A committee room in Washington. A long table, short tempers, and Douglas Rockwell, who chairs the Commission on Superhuman Activities._  
**Douglas Rockwell**: Your recent conduct worries us, Captain. You fought Iron Man over armour that belonged to this government.  
_You remember. You were there, through the other door of the rift, when Tony shut down the Guardsmen and Steve tried to stop him._  
**Douglas Rockwell**: The suit, the shield and the name were made by this government. From now on you answer to this Commission. Directly.  
**Steve Rogers** _(angry)_: I serve the country. I’ve never served an office.  
**Douglas Rockwell**: Nobody elected you, Captain. You have a soldier’s body and a god’s reputation, and you answer to your own conscience.  
**Douglas Rockwell**: In any other country, we would call that a warlord. Here we call it a hero, and hope.  
**Steve Rogers** _(think)_: …That’s a fair point. I hate that it’s a fair point.  
**Douglas Rockwell**: Then you have until tomorrow to change your mind.  
_Steve doesn’t take until tomorrow. He takes off his gloves, sets the shield on the table, and walks out._  
_Within a week there is a new Captain America. John Walker: tall, loud, loyal, and very eager to please._  
**John Walker** _(happy)_: Commission says I’m the man for it. Your little guys want a photo? I’m told I’m good with kids.  

**Choices**

- **Wish Walker luck. He’ll need it.** — sets `{"mv-ca-walker":"luck"}`
    - **John Walker**: Luck. Yeah. Thanks. Nobody else has said that.
    - For a moment he looks younger than the uniform.
- **Tell him the shield isn’t his.** — sets `{"mv-ca-walker":"cold"}`
    - **John Walker**: It is now. Signed paperwork and everything.
    - He holds the shield a little too tightly, as if somebody might take it back.

### Step 2: Trace the Commission’s orders to whoever is really giving them.

Hint: An Expedition through government corridors. Run Nubbins open doors; Fly Nubbins listen at the vents. · check: `expedition:complete:mv-commission-corridors`

#### <a id="mv-ca07-black"></a>Scene `mv-ca07-black`

_Months on. Steve wears black now, with a red-and-white star, and calls himself the Captain. Old friends keep finding him._  
**Steve Rogers** _(think)_: The Commission gets the shield. It doesn’t get the work.  
_Then the news breaks. Somebody leaked John Walker’s real name, and the Watchdogs went to his parents’ house. Both are dead._  
_Walker hunts the gang down in a single night. What he does with the shield is not what the shield was made for._  
**Steve Rogers** _(sad)_: They broke him. They handed him a weight and nobody showed him how to carry it.  
**Steve Rogers**: Rockwell takes his orders from somewhere. Your Nubbins are good at getting through doors. Can they find out where?  
_Behind a door marked Private, and a second door marked nothing at all, a man in an expensive suit sits with his back to you._  
_He turns. He has Steve’s face. Exactly Steve’s face, down to the nick on the chin, with a stranger’s smile on it._  
**The Red Skull** _(happy)_: Do you like it? Grown from your Captain’s own cells. A thing of beauty, wasted on him.  

### Step 3: Fight the Red Skull with Steve until the shield is back where it belongs.

Hint: A karate bout. The Skull copies Steve’s moves, so vary yours. · check: `karate:win:mv-skull-in-steves-body`

#### <a id="mv-ca07-shield"></a>Scene `mv-ca07-shield`

_Steve comes through the door a second after you. He sees his own face looking back and goes very still._  
**Steve Rogers** _(angry)_: Skull.  
**The Red Skull** _(happy)_: Rogers. I had your Commission dismiss you in your own voice, on the telephone. They thanked me for my time.  
**The Red Skull**: And Walker. I chose him myself. I wanted to watch your shield bent out of shape.  
_Walker is in the doorway behind you, shield on his arm, breathing hard. He has heard every word._  
**John Walker** _(angry)_: You set me up. My mom and dad. You set the whole thing up.  
**Steve Rogers**: John. Give me the shield. Not to keep. Just for this.  
_Walker looks at the shield. Then at you, and at your Nubbins, as if somebody small might tell him what to do._  

**Choices**

- **Tell Walker he’s done enough. Let Steve take it.** — sets `{"mv-ca-walker-end":"handed"}`
    - **John Walker**: Take it. I never knew what I was doing with it anyway.
    - The shield crosses the room. It settles on Steve’s arm as if it has been waiting.
- **Tell them to fight him together.** — sets `{"mv-ca-walker-end":"together"}`
    - **John Walker**: Together. Fine. You go high.
    - Walker keeps the shield for one round, then passes it to Steve on the backswing, as if he planned it all along.

#### <a id="mv-ca07-shield-arrested"></a>Variant `mv-ca07-shield-arrested`

_Variant of `mv-ca07-shield`._

_Steve comes through the door a second after you. He sees his own face looking back and goes very still._  
**Steve Rogers** _(angry)_: Skull.  
**The Red Skull** _(happy)_: Rogers. I had your Commission dismiss you in your own voice, on the telephone. They thanked me for my time.  
**The Red Skull**: And Walker. I chose him myself. I wanted to watch your shield bent out of shape.  
_Walker is in the doorway behind you, shield on his arm, breathing hard. He has heard every word._  
**John Walker** _(angry)_: You set me up. My mom and dad. You set the whole thing up.  
**Steve Rogers**: John. Give me the shield. Not to keep. Just for this.  
_Walker looks at the shield. Then at you, and at your Nubbins, as if somebody small might tell him what to do._  
**Steve Rogers** _(soft)_: John. In the war I sent a boy to a cell because the rules said so. I never saw what became of him. I’m not sending you anywhere.  
**John Walker**: That supposed to make me feel better?  
**Steve Rogers**: No. It’s supposed to be true.  

**Choices**

- **Tell Walker he’s done enough. Let Steve take it.** — sets `{"mv-ca-walker-end":"handed"}`
    - **John Walker**: Take it. I never knew what I was doing with it anyway.
    - The shield crosses the room. It settles on Steve’s arm as if it has been waiting.
- **Tell them to fight him together.** — sets `{"mv-ca-walker-end":"together"}`
    - **John Walker**: Together. Fine. You go high.
    - Walker keeps the shield for one round, then passes it to Steve on the backswing, as if he planned it all along.

#### <a id="mv-ca07-shield-released"></a>Variant `mv-ca07-shield-released`

_Variant of `mv-ca07-shield`._

_Steve comes through the door a second after you. He sees his own face looking back and goes very still._  
**Steve Rogers** _(angry)_: Skull.  
**The Red Skull** _(happy)_: Rogers. I had your Commission dismiss you in your own voice, on the telephone. They thanked me for my time.  
**The Red Skull**: And Walker. I chose him myself. I wanted to watch your shield bent out of shape.  
_Walker is in the doorway behind you, shield on his arm, breathing hard. He has heard every word._  
**John Walker** _(angry)_: You set me up. My mom and dad. You set the whole thing up.  
**Steve Rogers**: John. Give me the shield. Not to keep. Just for this.  
_Walker looks at the shield. Then at you, and at your Nubbins, as if somebody small might tell him what to do._  
**Steve Rogers** _(soft)_: John. In the war I let a saboteur go on his word, and he kept it. I’ll take yours.  
**John Walker** _(sad)_: You don’t know what my word’s worth.  
**Steve Rogers**: Neither did he.  

**Choices**

- **Tell Walker he’s done enough. Let Steve take it.** — sets `{"mv-ca-walker-end":"handed"}`
    - **John Walker**: Take it. I never knew what I was doing with it anyway.
    - The shield crosses the room. It settles on Steve’s arm as if it has been waiting.
- **Tell them to fight him together.** — sets `{"mv-ca-walker-end":"together"}`
    - **John Walker**: Together. Fine. You go high.
    - Walker keeps the shield for one round, then passes it to Steve on the backswing, as if he planned it all along.

#### <a id="mv-ca07-shield-done"></a>Done `mv-ca07-shield-done`

_In the struggle a capsule of the Skull’s own red dust breaks across his face._  
_When it clears, Steve’s borrowed features have shrunk to a red skull again._  
**The Red Skull** _(angry)_: You have ruined a perfectly good face.  

### Complete

#### <a id="mv-ca07-complete"></a>Complete `mv-ca07-complete`

_Weeks later, a small ceremony. Steve in blue again, the shield on his arm, the Commission studying its shoes._  
**Steve Rogers** _(think)_: I don’t work for you. I’ll work with you, when we agree. That’s the only deal I take.  
**Douglas Rockwell** _(think)_: And when we don’t agree, Captain? Who decides then?  
**Steve Rogers**: Then I tell you to your face, in public, and I take the consequences. That’s the part I won’t give up.  
_Walker takes the black suit Steve left behind, and a new name with it. He nods to your Nubbins on his way out._  
**Steve Rogers** _(soft)_: Tony and I still don’t see eye to eye about armour. But he called. He asked if I was all right.  
_Your Nubbins sniff the black suit as it goes past, the way they sniff a Keeper they’ve decided to forgive._  

**Rewards**

- Black-Star Suit (cosmetic): A black Nubbin suit with a red-and-white star, after Steve’s costume as the Captain.
- The Captain (title): Title for the Nubbin that tracked the Red Skull through the Commission’s corridors.

Sets on completion: `{"mv-ca07":true}`

**Notes:** Needs IM8 (Armor Wars): the hearing cites Steve’s clash with Tony over the Guardsmen, and the second rift line recalls the player being there. Walker’s parents’ deaths are reported, never shown. Walker’s rampage is one line of narration over a dark still, no violence shown. The Skull wears a clone of Steve’s body (Captain America #350); use Steve’s sprite with a red eye-glint and a different idle. The red dust is his “dust of death” from the comic, played here as a visual transformation only. Issues checked: Captain America #332–350 (1987–89).

## CA8. Streets of Poison

*Captain America #372–378 (1990)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA7, The Captain · requires: CA7

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), The Kingpin (Wilson Fisk, the Kingpin (Marvel)), Bullseye (Bullseye (Marvel))

### Step 1: Raid the waterfront warehouse with Steve Rogers.

Hint: An Expedition. Keep one Nubbin near Steve at all times; it will tell you if he starts to lose control. · check: `expedition:complete:mv-waterfront-raid`

#### <a id="mv-ca08-ice"></a>Scene `mv-ca08-ice`

_A new drug is on the streets. The dealers call it Ice. It turns quiet people violent and violent people fearless._  
**Steve Rogers** _(sad)_: I’ve walked this street a hundred times. I’ve never seen it like this. They’re kids. All of them, kids.  
_A raid on a waterfront warehouse: crates of Ice, guards with machine pistols, and Steve going in first, as always._  
_A crate splits. The powder goes up in a cloud. Steve breathes it in, coughs once, and keeps going._  
_Your Nubbins notice before he does. He hits harder than he needs to. He hits again, after a man is already down._  
**Steve Rogers** _(angry)_: Next floor. Move. Faster!  
_Your Run Nubbin stops in front of him and does not move. Steve nearly treads on it, and stares, and breathes._  
**Steve Rogers** _(shock)_: What did I just do?  

**Choices**

- **Tell him straight: it’s in his blood.** — sets `{"mv-ca-ice":"told"}`
    - **Steve Rogers**: The serum. It’s holding on to the stuff instead of burning it off. Of course it is.
    - **Steve Rogers**: Then I have to be careful. And you have to tell me when I’m not.
- **Say nothing. Just get him out of there.** — sets `{"mv-ca-ice":"covered"}`
    - You steer him out by the elbow. He lets you. That frightens you more than anything that happened inside.
    - **Steve Rogers**: I’m fine. I’m fine. Just keep the little one away from me for a minute.

#### <a id="mv-ca08-ice-done"></a>Done `mv-ca08-ice-done`

_The crates are stamped with a shipping line that belongs, three companies deep, to Wilson Fisk._  
_The Kingpin of Crime, who sells Ice and invests the proceeds very sensibly._  

### Step 2: Fight Bullseye in Fisk Tower while Steve fights the Ice in his blood.

Hint: A karate bout. Bullseye throws from range, so close the distance fast and keep moving. · check: `karate:win:mv-bullseye`

#### <a id="mv-ca08-tower"></a>Scene `mv-ca08-tower`

_Fisk Tower. The Kingpin doesn’t get up when you come in. He rarely gets up for anyone._  
**The Kingpin** _(happy)_: Captain. A pleasure. And small guests. I keep cakes for small guests.  
**The Kingpin**: You think I made this drug? I only sell it. The demand was here long before I was, Captain.  
**Steve Rogers** _(angry)_: You sell it to children.  
**The Kingpin**: I sell it to customers. Their age is their own affair.  
**The Kingpin** _(think)_: Close me, and a hungrier man opens tomorrow with dirtier stock. I keep the street orderly. Ask the police.  
**Steve Rogers** _(angry)_: I don’t doubt you’re orderly. Orderly is how you sleep at night.  
**The Kingpin**: Bullseye, would you show our guests out?  
_A man in the window seat flicks a playing card. On the far side of the room, a lamp cord parts neatly in two._  
**Bullseye** _(happy)_: I can hit anything I can see. I can see a Captain, a Keeper and a set of Nubbins. Let’s count down.  
_Steve’s hands are shaking. The Ice is still in him. Every move he makes is a little too big._  
**Steve Rogers**: Keep him off my blind side. I can’t trust my own aim tonight.  

**Choices**

- **Fight beside him. It’s his call to make.** — sets `{"mv-ca08-bench":"fought"}`
    - **Steve Rogers**: Thank you. If I go too far, you stop me. Not the Kingpin’s men. You.
    - Your Nubbins take his left side, the blind one, and stay there.
- **Tell him to stand down. The Nubbins take Bullseye.** — sets `{"mv-ca08-bench":"benched"}`
    - **Steve Rogers**: You don’t get to bench me. Nobody benches me.
    - **Steve Rogers**: …Nobody but people who are right. Fine. I’ll guard the door.
    - **Bullseye**: Oh, the little ones. Good. I like a challenge with a smaller target.

#### <a id="mv-ca08-tower-done"></a>Done `mv-ca08-tower-done`

_Bullseye leaves through the window, laughing, the way he always leaves. The Kingpin finishes his cake._  
**The Kingpin**: Do come again. Everyone does.  

### Complete

#### <a id="mv-ca08-complete"></a>Complete `mv-ca08-complete`

_In an Avengers infirmary, the doctors run a full blood transfusion to wash the Ice out of Steve. It takes all night._  
_Your Nubbins sit on the end of the bed the whole time. The nurses stop asking them to move._  
**Steve Rogers** _(think)_: The serum’s weaker now. Maybe it won’t come all the way back.  
**Steve Rogers**: Funny. I spent years wanting to be strong. Now I’d settle for being myself, at whatever size that is.  
**You**: That was always the bigger thing.  
**Steve Rogers** _(soft)_: Erskine would’ve said the same. Probably with a longer word.  

**Rewards**

- Blind-Side Guard (title): Title for the Nubbin that kept Bullseye off Steve’s blind side.
- Infirmary Night-Light (decor): A small green night-light for the Grove. Nubbins sleep closer to it after a bad day.

Sets on completion: `{"mv-ca08":true}`

**Notes:** The drug is never shown being used; we see crates and a single cloud of powder. No dealers or users are children on screen; the kids are mentioned, not drawn. Bullseye’s card throw cuts a cord, never a person. Step 2’s choice sets mv-ca08-bench (fought / benched): if benched, the bout is the Nubbins alone and Steve appears only at the door. Steve’s tainted state: during the step 1 Expedition, give him a red edge-glow and occasional over-hits; the Run Nubbin’s blocking line triggers on the first over-hit. Daredevil, Crossbones and the Skull also appear in the comic arc; omitted for scope. Issues checked: Captain America #372–378 (1990).

## CA9. The Winter Soldier

*Captain America vol. 5 #1–14 (2005–2006)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA8, Streets of Poison, with CA3 and CA4 complete · requires: CA8, CA3, CA4

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Sharon Carter (Sharon Carter, Agent 13 (Marvel)), General Lukin (General Aleksander Lukin (Marvel)), The Winter Soldier (Bucky Barnes as the Winter Soldier (Marvel)), Bucky Barnes (James “Bucky” Barnes (Marvel))

### Step 1: Go through Sharon Carter’s file on the Winter Soldier.

Hint: Bring the Run Nubbin from Camp Lehigh if you can. It notices things the file doesn’t. · check: `talk:sharon-carter`

#### <a id="mv-ca09-file"></a>Scene `mv-ca09-file`

_The Red Skull is dead. Somebody shot him in his own office, from a long way off, and left with his plans for a new Cosmic Cube._  
**Sharon Carter**: Sharon Carter, S.H.I.E.L.D. The Skull was in business with a Russian general, Aleksander Lukin. Lukin wants a Cube of his own.  
**Sharon Carter**: So did the Skull. Now the Skull is dead. I’d say Lukin got tired of sharing.  
**Steve Rogers** _(think)_: Who pulled the trigger?  
**Sharon Carter**: A ghost story. The Cold War called him the Winter Soldier. Fifty years of killings, and in every photo he looks the same age.  
_She lays a photograph on the table: a long coat, a mask, a metal arm, a red star on the shoulder._  
_Your Run Nubbin climbs onto the table and sits on the photograph. It will not get off._  
**Sharon Carter**: Is it always like this?  
**Steve Rogers** _(shock)_: It only does that with people it’s met before.  
**Sharon Carter** _(sad)_: Steve. Whoever he used to be, he’s killed dozens of people since. Remember that before you remember him.  
**Steve Rogers**: I’ll remember both. I just don’t know yet which one I’ll be talking to.  

#### <a id="mv-ca09-file-done"></a>Done `mv-ca09-file-done`

_On the evening news, General Lukin opens a factory for the Kronas Corporation, smiling, shaking hands._  
**Sharon Carter**: He smiles like a man who has never once been told no.  

### Step 2: Chase the Winter Soldier across the rooftops with your Run Nubbin.

Hint: A rooftop race. Only a Run Nubbin can keep up, so put it in front. · check: `race:win:mv-rooftops:run`

#### <a id="mv-ca09-roofs"></a>Scene `mv-ca09-roofs`

_Philadelphia. A bomb in a station, a crowd running, and on a roof across the street a man with a metal arm, watching._  
_Your Run Nubbin is up the fire escape before anyone says go. It always did take the ladder._  
**Steve Rogers**: Wait— wait for me!  
_The roofs are wet. The Winter Soldier runs like a man who has done this a thousand times, and your Nubbin runs like his shadow._  
_On the last roof he turns. The mask is down. The face is older and harder, and it is a face you last saw on a burning plane._  
**Steve Rogers** _(shock)_: Bucky?  
**The Winter Soldier** _(angry)_: I don’t know that name.  
_Your Run Nubbin stops a pace from him, the exact distance it kept on the night raids, and waits._  
**The Winter Soldier**: Get your animal out of my way.  
_He doesn’t kick it. He could. He steps around it, very carefully, and drops off the roof into the dark._  

**Choices**

- **Tell Steve what happened on the plane.** — sets `{"mv-ca-winter-plane":"told"}`
    - You tell him about the wires and the torch, and the last thing Bucky said before the light.
    - **Steve Rogers**: He got the others off. He got everybody off but himself. Of course he did.
- **Don’t talk. Get after him.** — sets `{"mv-ca-winter-plane":"chased"}`
    - **Steve Rogers**: Right. Talk later. Move now.
    - The alley is empty when you reach it. On the gutter, a torn scrap of a red star.

#### <a id="mv-ca09-roofs-done"></a>Done `mv-ca09-roofs-done`

**Steve Rogers** _(sad)_: That was him, Sharon. Whatever they did to him, that was Bucky.  
**Sharon Carter**: Then he’s the most dangerous man alive, and he doesn’t know you. Let’s find out what they did.  

### Step 3: Get the new Cube out of Lukin’s vault and into Steve’s hands.

Hint: An Expedition into the Kronas vault. Your Power Nubbin pulls the Cube loose; your Run Nubbin carries it. · check: `expedition:complete:mv-kronas-vault`

#### <a id="mv-ca09-vault"></a>Scene `mv-ca09-vault`

_Deep under the Kronas building, the new Cosmic Cube hums in a cradle of cables: smaller than the first one, and brighter._  
**General Lukin**: General Lukin. I have a soldier who never says no, and a cube that says yes to anything. You see my position.  
_The Winter Soldier stands at Lukin’s shoulder. His eyes are on your Run Nubbin. They have been since you walked in._  
**General Lukin**: Kill the Captain. Leave the animals; I may want them.  
_The fight is fast and terrible. Bucky knows every move Steve has, because Bucky helped invent half of them._  
_Your Nubbins go for the cradle. One wrenches the Cube loose; the other rolls it across the floor to Steve._  
**Steve Rogers** _(soft)_: I don’t want the universe. I want one thing.  
_He holds the Cube up in front of Bucky’s face. It goes warm and gold._  
**General Lukin** _(shock)_: Fool! With that you could end every war on Earth, and you spend it on one soldier?  
**Steve Rogers**: Every war starts with somebody deciding one soldier doesn’t matter.  
**Steve Rogers**: Give him back everything they took. All of it. The good and the bad.  
_Bucky staggers. You watch fifty years arrive on his face at once._  

**Choices**

- **Keep your Run Nubbin at his side.** — sets `{"mv-ca-bucky-return":"stayed"}`
    - Your Run Nubbin presses against his boot. He looks down at it and says the silly name he gave it at Camp Lehigh.
    - **Bucky Barnes**: You’re still fast. Course you are.
- **Pull your Nubbins back. Give him room.** — sets `{"mv-ca-bucky-return":"space"}`
    - You call your Nubbins back. Bucky stands alone in the middle of the vault and shakes, and nobody touches him.
    - **Bucky Barnes**: Don’t. Not yet. I need to work out which of these hands are mine.

#### <a id="mv-ca09-vault-done"></a>Done `mv-ca09-vault-done`

**Bucky Barnes** _(sad)_: Steve. The things I did, Steve.  
_He takes the Cube from Steve’s hands and says one word to it. It bursts in a shower of gold._  
_When the light clears, Bucky is gone._  

### Complete

#### <a id="mv-ca09-complete"></a>Complete `mv-ca09-complete`

_Lukin is under arrest. The Cube is dust, or most of it. S.H.I.E.L.D. sweeps the fragments into a sealed box and won’t say why._  
**Sharon Carter** _(soft)_: He’ll come back when he can look at you. Give him that.  
**Steve Rogers** _(sad)_: Sixty years I thought I left him on that plane. He’s alive. Whatever he’s done, he’s alive.  
_Your Run Nubbin sits at the rift a long time before it will come home. It keeps looking back into the dark._  
**You**: He knows where to find us.  

**Rewards**

- The Winter Soldier Remembers (flag): Bucky is alive and himself again. Required for the Civil War endgame (E1).
- Winter Coat (cosmetic): A long dark coat cut down for a Nubbin. Your Run Nubbin wears it as if it were made to.

Sets on completion: `{"mv-ca09":true,"mv-ca-winter":"remembered"}`

**Notes:** Required for Civil War (E1). Prefer the Run Nubbin stored in `mv-ca-bucky-nubbin` from CA2; if it is not in the party, any Run Nubbin works and the step 3 “silly name” line becomes “calls it kid, like he used to call everybody”. The first choice in step 2 reads best after CA3’s `mv-ca-plane` = `with-bucky`; if it was `with-steve`, change “the last thing Bucky said before the light” to “how he was still holding the wires when the plane climbed”. The Skull’s death and the station bomb are off screen (sound and smoke only). The shattered Cube’s fragments are the seed of Kobik in CA10; show the sealed S.H.I.E.L.D. box clearly. Issues checked: Captain America vol. 5 #1–14 (2005–06); Steve uses the Cube on Bucky in #14.

## CA10. Hail Hydra

*Steve Rogers: Captain America #1–19 (2016–2017) and Secret Empire #0–10 (2017)* · audience: adult · where: The rift above the waterfall (Multiverse save slot) · when: After CA9, The Winter Soldier, with CA4 complete · requires: CA9, CA4

**Cast:** Steve Rogers (Steve Rogers / Captain America (Marvel)), Supreme Leader Rogers (Steve Rogers rewritten as a Hydra agent (Secret Empire, 2017)), Kobik (Kobik, the Cosmic Cube as a child (Marvel)), The Red Skull (Johann Schmidt, the Red Skull (Marvel)), Sam Wilson (Sam Wilson, the Falcon (Marvel)), Sharon Carter (Sharon Carter, Agent 13 (Marvel))

### Step 1: Visit Kobik in Pleasant Hill.

Hint: Bring your Rebirth Nubbin from CA1. Kobik likes it best. · check: `talk:kobik`

#### <a id="mv-ca10-kobik"></a>Scene `mv-ca10-kobik`

_Pleasant Hill: a neat little town with neat little lawns, built by S.H.I.E.L.D. on the Cube’s leftover fragments._  
_The fragments woke up. They became a girl who calls herself Kobik. She looks about four, and she can rewrite the world._  
**Kobik** _(happy)_: Oh! Little animals! Can they be purple? I can make them purple. I can make them anything.  
_Your Nubbins let her pat them. They aren’t afraid of her. That is the frightening part._  
**Kobik** _(happy)_: The man with the red face is my friend. He tells me stories. Hydra is a big nice family and everybody gets a job.  
_In a corner of the playroom, a clone of the Red Skull looks up from a picture book and smiles._  
**The Red Skull** _(happy)_: She is very impressionable. All children are. That is what childhood is for.  
_Steve had grown old when the serum finally let go of him. Last month Kobik made him young again, as a present._  
**Kobik** _(happy)_: And I fixed Steve’s whole life too! Now he was always on the right side.  
_Your Rebirth Nubbin goes very still, the way it went still under Erskine’s hand._  

**Choices**

- **Tell Kobik the red man is lying to her.** — sets `{"mv-ca-kobik":"warned"}`
    - **Kobik**: He isn’t! He’s my friend! …Is he?
    - She doesn’t undo anything. But she remembers that you said it, and the Skull notices that she does.
- **Sit and play with her. Let her trust you first.** — sets `{"mv-ca-kobik":"befriended"}`
    - You sit on the floor and draw a Nubbin. She draws one beside it: purple, with stars.
    - **Kobik**: That one’s yours. I’ll keep it. I keep things.

### Step 2: Run supplies for the resistance under Hydra’s patrols.

Hint: A stealth Expedition. Small Nubbins pass patrols unnoticed, so leave the big ones at camp. · check: `expedition:complete:mv-resistance-run`

#### <a id="mv-ca10-empire"></a>Scene `mv-ca10-empire`

_It happens in a single day. Hydra rises everywhere at once, and the man leading it is Steve Rogers._  
**Supreme Leader Rogers** _(soft)_: You trusted me with the shield for seventy years. Trust me with the rest. I’ll make it safe.  
_Cities sit under glowing domes. Heroes are trapped in space or underground. The shield is carried under a green flag now._  
**Sam Wilson** _(angry)_: Sam Wilson. I carried the shield for a while. Now I carry a radio, a bag of tinned peaches and a grudge.  
**Sharon Carter** _(sad)_: He isn’t mind-controlled. We checked. He remembers growing up Hydra. Every birthday, every lie. To him it’s all true.  
**Sam Wilson**: So we fight a man who believes it. That’s worse.  
**Sharon Carter** _(think)_: Half the country’s cheering him. Trains on time, streets swept. People like being told it’s safe.  
**Sam Wilson** _(sad)_: Safe and free were never the same word. He used to be the one who told me that.  
_Your Nubbins guard the resistance camp at night. Hydra patrols never look twice at small creatures. That is useful._  
_Supreme Leader Rogers comes to a captured town to speak. Your Rebirth Nubbin slips through the crowd to the foot of the stage._  
**Supreme Leader Rogers** _(think)_: Hello, little one. Have we met? I feel as though we have.  
_Your Nubbin looks up at him for a long time. Then it turns its back and walks away._  

#### <a id="mv-ca10-empire-done"></a>Done `mv-ca10-empire-done`

**Sharon Carter** _(sad)_: Kobik’s gone quiet. She’s hiding. She’s scared of what she did.  
**Sam Wilson**: Then we find her before the Skull does.  

### Step 3: Bring the real Steve out of the Cube’s memory and stand with him against his double.

Hint: A karate bout against the Supreme Leader. He knows every one of Steve’s moves, so let your Nubbins do what Steve never would. · check: `karate:win:mv-supreme-leader`

#### <a id="mv-ca10-memory"></a>Scene `mv-ca10-memory`

_Kobik is hiding inside the Cube’s memory, a place made of everything she has ever touched. Your Nubbins find the way in holding paws._  
**Kobik** _(sad)_: I’m sorry. I’m sorry. I wanted him to be happy. I kept the old Steve. I didn’t throw him away.  
_In the memory, a skinny young man sits on the steps of a recruiting office, a stamped card folded in his hands._  
_Your Rebirth Nubbin runs to him. He knows it at once._  
**Steve Rogers** _(happy)_: Hey. I know you. You came last on the obstacle course.  
**Steve Rogers**: I’ve been sitting here a while. Everything’s fuzzy at the edges. I knew somebody would come.  
**Kobik** _(think)_: If he goes out, the other Steve doesn’t go away. There’ll be two. One has to beat the other.  
**Steve Rogers**: Then let’s go do that.  
_Outside, in Washington, the Supreme Leader stands before Hydra’s army. Then a second Steve Rogers walks out of the light._  
**Supreme Leader Rogers** _(angry)_: That’s impossible. I’m the real one. I remember.  
**Steve Rogers**: You remember what she was told. I remember what happened.  

**Choices**

- **Send your Rebirth Nubbin in with him.** — sets `{"mv-ca-hydra-end":"rebirth-nubbin"}`
    - Your Nubbin walks at his heel, exactly where it walked on the camp course.
    - **Steve Rogers**: Same as before. Last over the line, together.
- **Turn to the crowd. Remind them who he was.** — sets `{"mv-ca-hydra-end":"crowd"}`
    - You climb onto a car roof and shout. Not a speech, just names. Erskine. Bucky. Sam. People begin to listen.
    - **Sam Wilson**: Okay. Okay! The Keeper’s got the crowd. Cap, you’ve got the rest.

#### <a id="mv-ca10-memory-arrested"></a>Variant `mv-ca10-memory-arrested`

_Variant of `mv-ca10-memory`._

_Kobik is hiding inside the Cube’s memory, a place made of everything she has ever touched. Your Nubbins find the way in holding paws._  
**Kobik** _(sad)_: I’m sorry. I’m sorry. I wanted him to be happy. I kept the old Steve. I didn’t throw him away.  
_In the memory, a skinny young man sits on the steps of a recruiting office, a stamped card folded in his hands._  
_Your Rebirth Nubbin runs to him. He knows it at once._  
**Steve Rogers** _(happy)_: Hey. I know you. You came last on the obstacle course.  
**Steve Rogers**: I’ve been sitting here a while. Everything’s fuzzy at the edges. I knew somebody would come.  
**Kobik** _(think)_: If he goes out, the other Steve doesn’t go away. There’ll be two. One has to beat the other.  
**Steve Rogers**: Then let’s go do that.  
_Outside, in Washington, the Supreme Leader stands before Hydra’s army. Then a second Steve Rogers walks out of the light._  
**Supreme Leader Rogers** _(angry)_: That’s impossible. I’m the real one. I remember.  
**Steve Rogers**: You remember what she was told. I remember what happened.  
**Steve Rogers**: I remember a boy on a gantry crying into his collar, and the hearing he got because we said we were better. You’d have shot him.  
**Supreme Leader Rogers** _(angry)_: I would have been efficient.  
**Steve Rogers**: That’s the word they always use.  

**Choices**

- **Send your Rebirth Nubbin in with him.** — sets `{"mv-ca-hydra-end":"rebirth-nubbin"}`
    - Your Nubbin walks at his heel, exactly where it walked on the camp course.
    - **Steve Rogers**: Same as before. Last over the line, together.
- **Turn to the crowd. Remind them who he was.** — sets `{"mv-ca-hydra-end":"crowd"}`
    - You climb onto a car roof and shout. Not a speech, just names. Erskine. Bucky. Sam. People begin to listen.
    - **Sam Wilson**: Okay. Okay! The Keeper’s got the crowd. Cap, you’ve got the rest.

#### <a id="mv-ca10-memory-released"></a>Variant `mv-ca10-memory-released`

_Variant of `mv-ca10-memory`._

_Kobik is hiding inside the Cube’s memory, a place made of everything she has ever touched. Your Nubbins find the way in holding paws._  
**Kobik** _(sad)_: I’m sorry. I’m sorry. I wanted him to be happy. I kept the old Steve. I didn’t throw him away.  
_In the memory, a skinny young man sits on the steps of a recruiting office, a stamped card folded in his hands._  
_Your Rebirth Nubbin runs to him. He knows it at once._  
**Steve Rogers** _(happy)_: Hey. I know you. You came last on the obstacle course.  
**Steve Rogers**: I’ve been sitting here a while. Everything’s fuzzy at the edges. I knew somebody would come.  
**Kobik** _(think)_: If he goes out, the other Steve doesn’t go away. There’ll be two. One has to beat the other.  
**Steve Rogers**: Then let’s go do that.  
_Outside, in Washington, the Supreme Leader stands before Hydra’s army. Then a second Steve Rogers walks out of the light._  
**Supreme Leader Rogers** _(angry)_: That’s impossible. I’m the real one. I remember.  
**Steve Rogers**: You remember what she was told. I remember what happened.  
**Steve Rogers**: I remember letting a saboteur run because he’d talked, and carrying it ever since. You never carried anything. That’s how I know.  
**Supreme Leader Rogers** _(angry)_: Weakness. I was built without it.  
**Steve Rogers**: You were built without the part that made me worth copying.  

**Choices**

- **Send your Rebirth Nubbin in with him.** — sets `{"mv-ca-hydra-end":"rebirth-nubbin"}`
    - Your Nubbin walks at his heel, exactly where it walked on the camp course.
    - **Steve Rogers**: Same as before. Last over the line, together.
- **Turn to the crowd. Remind them who he was.** — sets `{"mv-ca-hydra-end":"crowd"}`
    - You climb onto a car roof and shout. Not a speech, just names. Erskine. Bucky. Sam. People begin to listen.
    - **Sam Wilson**: Okay. Okay! The Keeper’s got the crowd. Cap, you’ve got the rest.

#### <a id="mv-ca10-memory-done"></a>Done `mv-ca10-memory-done`

_Mid-fight, Steve reaches for a hammer lying in the rubble, an old friend’s hammer. It lifts for him as easily as a cup._  
_One blow. The Supreme Leader goes down, and the domes over the cities flicker and go out._  
**Supreme Leader Rogers** _(sad)_: I was loyal. I was loyal.  
**Steve Rogers** _(soft)_: You were. To the wrong thing. That was never your fault.  

### Complete

#### <a id="mv-ca10-complete"></a>Complete `mv-ca10-complete`

_The country takes a long time to clean up. Plenty of people will never trust the shield again, and they have their reasons._  
**Steve Rogers** _(think)_: They shouldn’t trust it. They should trust each other, and keep an eye on me. That’s healthier.  
_Kobik is in S.H.I.E.L.D.’s care now, with a great many crayons and a strict rule about stories from strangers._  
**Kobik** _(happy)_: Can I come and see the little animals? I won’t make them purple. Maybe a tiny bit purple.  
**Steve Rogers** _(soft)_: Erskine picked the weakest kid in the line. You picked the weakest one in your Grove. You were both right.  
**Kobik** _(think)_: I could fix it all, you know. Make it so it never happened. Nobody would remember the domes. Nobody would be sad.  
**Steve Rogers** _(soft)_: Kid, that’s how this started. Somebody deciding they knew better what everybody should remember.  
**Kobik** _(sad)_: But people got hurt. Lots. I could make them not hurt.  
_She looks at you, and so does Steve. Neither of them is sure._  

**Choices**

- **Leave it, Kobik. People need to remember what they lived through.** — sets `{"mv-ca10-rewrite":"refused"}`
    - **Kobik**: Even the sad bits?
    - **Steve Rogers**: Especially those. That’s how you know not to do it again.
    - At the rift, Steve salutes your Rebirth Nubbin. It doesn’t know how to salute, so it falls over, and that does fine.
- **Not the world. But could you mend the people who were hurt, and leave their memories alone?** — sets `{"mv-ca10-rewrite":"healed"}`
    - **Kobik**: Mend, not change. Bodies, not stories. I can try that. I’ll go very slowly.
    - **Steve Rogers**: That’s… actually wise. Nobody tell her I said so. She’ll want a medal.
    - At the rift, Steve salutes your Rebirth Nubbin. It doesn’t know how to salute, so it falls over, and that does fine.

**Rewards**

- Sentinel of the Grove (title): Title for your Rebirth Nubbin, marking the end of the Captain America line.
- Replica Shield (decor): A round striped shield for the Grove wall. Nubbins take it down and use it as a sledge.
- Captain America Line Complete (flag): Completes the Captain America line (CA1–CA10). With the Iron Man line also done, Civil War (E1) opens.

Sets on completion: `{"mv-ca10":true,"mv-ca-complete":true}`

**Notes:** Completes the line. The Rebirth Nubbin is the one stored in `mv-ca-rebirth-nubbin` (CA1); if it has left the Grove, any all-E-grade Nubbin stands in and the “obstacle course” line becomes “You look like a friend of mine. Came last on the obstacle course.”. Hydra’s symbol and salute are never shown in full: green banners, no salute animation, and the title is the only place the phrase appears. Two Steves on screen: the Supreme Leader has a darker palette and a high collar. The hammer is Mjolnir (Secret Empire #10); show it lifting, no name needed. The closing choice sets mv-ca10-rewrite (refused / healed): Kobik never rewrites history either way; "healed" only mends injuries. Kobik’s scenes are bright and toy-like; the Skull clone sits in the background, never close-up. Issues checked: Steve Rogers: Captain America #1–19 (2016–17), Secret Empire #0–10 (2017). This storyline and IM15 are the last prerequisites for Civil War, whose epilogue returns Steve through this Cube thread.
