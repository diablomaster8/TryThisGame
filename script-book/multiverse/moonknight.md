# Multiverse: Moon Knight (MK1–MK8)

## MK1. The Mercenary

*Werewolf by Night #32–33 (1975): Moon Knight’s first appearance* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: The Moon Knight line opens in the Multiverse campaign.

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Committee Agent (An agent of the Committee (Marvel)), Jack Russell (Jack Russell / Werewolf by Night (Marvel))

### Step 1: Track the werewolf through the woods with the man in silver.

Hint: Send a Nubbin with good Run or Fly on the Expedition; it picks up the trail faster. · check: `expedition:clear:mv-russell-woods`

#### <a id="mv-mk01-hire"></a>Scene `mv-mk01-hire`

_The rift lets you out on a wet country road. The moon is full and far too bright._  
_A man in silver armour and a white cloak waits under a streetlamp, counting money he hasn’t been paid yet._  
**Committee Agent**: You’re Spector. The Committee was told you don’t ask questions.  
**Marc Spector**: I ask plenty. I just don’t expect answers. What’s the job?  
**Committee Agent**: A young man named Jack Russell. On nights like this he turns into something we would like to own.  
**Committee Agent**: Bring him in alive. Cage, chains, the lot. Ten thousand on delivery.  
**Marc Spector** _(think)_: Ten thousand for a werewolf. You people really don’t value your werewolves.  
**Committee Agent**: One more thing. Our file says your name is Spector. Our other file says it isn’t.  
**Marc Spector** _(think)_: The Committee. They hire men who don’t ask who they’re hunting.  
**Marc Spector**: Pay whichever one is cheaper.  
_The agent leaves. Marc notices you, then your Nubbin, and doesn’t reach for a weapon. That’s something._  
_He glances up at the moon, and his jaw tightens, as if it has just said something rude about him._  
**You**: Who are you looking at?  
**Marc Spector**: Nobody. Habit. You’re not with them; you’ve got the face of someone who doesn’t lie for money. Keep up and keep quiet.  
_Your Nubbin makes a small questioning sound, and keeps up._  

#### <a id="mv-mk01-hire-done"></a>Done `mv-mk01-hire-done`

_Snapped fence posts. Grey fur on a bramble. Under an oak, a steel trap that someone else set first._  
_Your Nubbin sniffs the jaws and sneezes. Fresh oil. Whoever set it was here less than an hour ago._  
**Marc Spector** _(think)_: The Committee sent people ahead of me. Then why hire me at all?  

### Step 2: Hold off the Committee’s men while Jack Russell gets away.

Hint: A karate bout: block their rushes, then counter. A Power Nubbin hits hardest. · check: `karate:win:mv-committee-men`

#### <a id="mv-mk01-wolf"></a>Scene `mv-mk01-wolf`

_The trail ends in a clearing. A huge shape thrashes inside a net of steel cable, howling._  
**Marc Spector**: There’s our ten thousand. Stand back. When he gets loose, he won’t be gentle.  
_Your Nubbin doesn’t stand back. It walks straight to the net and sits down just out of reach._  
_The wolf stops thrashing and stares at it. There is a collar on its neck, stamped with the Committee’s mark._  
_Your Nubbin makes a low, soft sound at the wolf, the one it keeps for things that are hurt._  
**You**: He’s already wearing their brand. He didn’t come here to hurt anyone. He was put here.  
**Marc Spector** _(think)_: A wolf that can’t take off his own collar. And the people paying me fitted it.  
**Marc Spector** _(angry)_: They don’t want a monster caught. They want a weapon delivered.  
_Lanterns bob between the trees. The Committee’s men, coming to collect early._  
**Marc Spector**: Right. Change of contract. Your call, Keeper. How do we get him out?  

**Choices**

- **Let the Nubbin calm him first.** — sets `{"mv-mk-russell":"calmed"}`
    - Your Nubbin hums, low and steady. The wolf’s breathing slows to match it.
    - **Marc Spector**: Huh. Never seen that done without a tranquiliser gun.
- **Cut the cables now. Deal with the men after.** — sets `{"mv-mk-russell":"cut"}`
    - Marc’s blade goes through the cable in three strokes. The wolf is gone into the dark before the third.
    - **Marc Spector**: He’ll be fine. He’s the least dangerous animal in these woods tonight.

#### <a id="mv-mk01-wolf-done"></a>Done `mv-mk01-wolf-done`

_The last of the Committee’s men drops his lantern and runs. Nobody chases him._  
**Marc Spector**: They’ll tell their bosses I went soft. Let them.  

### Complete

#### <a id="mv-mk01-complete"></a>Complete `mv-mk01-complete`

_By dawn the clearing holds broken lanterns and a note pinned to an oak: CONTRACT VOID. INVOICE TO FOLLOW._  
_A young man in a borrowed coat, shivering and barefoot, nods at you from the road._  
**Jack Russell** _(soft)_: I don’t remember much of last night. I remember the little one. Thank you.  
**Marc Spector**: Thank me too. I cut you loose, fought off six of them, carried you the last mile on my back.  
_That isn’t how it went. Your Nubbin looks at you. You look at your Nubbin. Neither of you says so._  
**Marc Spector** _(think)_: No? Huh. It’s how I remember it. I remember a lot of things that way.  
**Marc Spector**: I just turned down ten thousand dollars because a small round animal looked at me. Tell no one.  
**Marc Spector**: Here. Silver’s hard to come by out there. Your Nubbin earned it.  
_He presses a silver crescent into your hand and walks off into the morning. You’ll see him again._  

**Rewards**

- Silver crescent (cosmetic): A small silver crescent your Nubbin can wear on its chest. It glints under a full moon.
- Contract Breaker (title): Title: you talked a mercenary out of his fee.

Sets on completion: `{"mv-mk01":true}`

**Notes:** Night woods, full moon, fog. The werewolf is a big silhouette in the net; no transformation sequence. The Committee collar is a readable prop (crest stamp). Marc wears the early silver armour and white cloak, not the later costume. Jack appears human in the complete scene. Soft wolf-breathing loop under the calm choice. Marc’s wrong retelling in the complete scene is the line’s first unreliable memory; play it straight, with the Nubbin’s look as the only correction.

## MK2. Death in Egypt

*Moon Knight #1 (1980): the origin* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After The Mercenary. · requires: MK1

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Frenchie (Jean-Paul “Frenchie” Duchamp (Marvel)), Bushman (Raoul Bushman (Marvel)), Marlene (Marlene Alraune (Marvel)), Khonshu (Khonshu (Marvel))

### Step 1: Warn the archaeologists before Bushman moves.

Hint: Talk to Marlene in the trench, then run for the tomb. · check: `talk:mv-marlene`

#### <a id="mv-mk02-dig"></a>Scene `mv-mk02-dig`

_The rift opens onto sand and noon heat. Below a ridge: tents, trenches, and a dig going deep._  
**Frenchie**: Marc! Over here, out of the sun. You brought a friend. And a… a loaf, with eyes?  
**Marc Spector**: Frenchie, Keeper. Keeper, Frenchie. He flies the plane and complains about everything else.  
**Frenchie** _(happy)_: I complain about the plane also. It is only fair.  
_A broad man with a tattooed face strides past, rifle over his shoulder. The mercenaries go quiet around him._  
**Bushman**: The professor found gold under his tent, Spector. Gold belongs to whoever’s holding a gun.  
**Marc Spector** _(angry)_: That wasn’t the job, Raoul. We were hired to guard the road.  
**Bushman**: The job is what I say it is. Go guard something.  
_A young woman with a notebook watches from the trench. Your Nubbin waves. After a moment, she waves back._  
**Marlene**: My father says the gold doesn’t matter. It’s the statue beneath it. A moon god nobody has seen in three thousand years.  
_Bushman’s men are walking towards the tomb. Marc is watching them, and doing sums he doesn’t like._  

**Choices**

- **Run for the tomb to warn her father.** — sets `{"mv-mk-dig":"tomb"}`
    - **Marlene**: He won’t come out. He never comes out when he’s found something.
    - **Marc Spector**: Then we go in and drag him. Keeper, with me.
- **Get Marlene out of the trench first.** — sets `{"mv-mk-dig":"marlene"}`
    - **Marlene**: I am not leaving him!
    - She doesn’t. But your Nubbin trips her up twice on the way, very politely, and that buys the few steps that matter.

#### <a id="mv-mk02-dig-done"></a>Done `mv-mk02-dig-done`

_You reach Marlene. You don’t reach the tomb in time. Shots, then shouting, then nothing._  
_Her father lies still at the tomb’s mouth. Bushman steps over him without looking down._  
**Marlene** _(sad)_: No. No, no, no.  

### Step 2: Reach Khonshu’s statue before dawn, with Marlene and Frenchie close behind.

Hint: Cross the dunes on the Expedition map; the moonlit path shows the way. · check: `expedition:clear:mv-khonshu-tomb`

#### <a id="mv-mk02-statue"></a>Scene `mv-mk02-statue`

**Marc Spector** _(angry)_: You killed an old man for a pile of cups.  
**Bushman**: I killed him for being in the way. You’re in the way now, Spector.  
_It isn’t a fair fight. Bushman’s men hold Marc down. Then they leave him in the sand to finish dying._  
_Night. Frenchie flies you and Marlene to the ridge. Below, Marc is a small dark shape, crawling towards the tomb._  
**Frenchie**: I land, or I crash. Both are landing.  
_Marlene stays on the ridge, so these last minutes stay private. Your Nubbin goes down alone and walks beside him, step for step._  
**Marc Spector** _(sad)_: Every client I ever had, and the only one who stuck around is… whatever you are.  
_He reaches the foot of a statue: a tall figure with a bird’s skull for a face, a crescent behind its head._  
**Marc Spector** _(sad)_: Look after Marlene, if you can. She’s going to need someone.  
_His hand drops. Your Nubbin presses against his side and does not move._  
_The moon comes up, very large and very white. It is looking at him._  
**Khonshu**: Rise, Marc Spector. You have not finished. You have hardly begun.  

**Choices**

- **Keep the Nubbin beside him.** — sets `{"mv-mk-vigil":"stayed"}`
    - Your Nubbin stays pressed to him, warm, while the moonlight thickens around them like frost.
    - **Khonshu**: The small thing keeps vigil. Good. Someone should.
- **Run back up the ridge for Marlene and Frenchie.** — sets `{"mv-mk-vigil":"fetched"}`
    - You run. Behind you, the light over the statue grows until the sand glows silver.
    - **Frenchie**: Keeper? Where is he? Where is Marc?

#### <a id="mv-mk02-statue-done"></a>Done `mv-mk02-statue-done`

_Marc sits at the foot of the statue in the white shroud that had covered it. He is breathing. He shouldn’t be._  
**Marlene** _(shock)_: You were dead. I saw you.  
**Frenchie** _(shock)_: An hour, Keeper. He was gone an hour. I timed it on my watch.  
**Marlene**: It was a minute. I was holding his hand. One minute.  
**Marc Spector** _(think)_: Yeah. Somebody disagreed. Several somebodies, apparently.  

### Complete

#### <a id="mv-mk02-complete"></a>Complete `mv-mk02-complete`

_Frenchie flies everyone home at dawn, low over the water._  
**Marlene** _(sad)_: He talks in his sleep. Not to me. To someone up there.  
**Frenchie** _(think)_: He was dead, Keeper. I know what dead looks like. Now he talks about buying a mansion and a taxi.  
**Marc Spector** _(think)_: The god said I’m his fist now. Maybe the heat cooked my brain. Maybe not.  
**Marc Spector** _(soft)_: Either way, you stayed. I don’t forget that.  
_He tears a strip from the white shroud and ties it round your Nubbin. It is cold, even in the sun._  

**Rewards**

- Strip of white shroud (item): Cut from the cloth on Khonshu’s statue. Always cool to the touch; a Nubbin holding it sleeps through the night.
- Kept Vigil (title): Title: you stayed with a dying man in the desert.

Sets on completion: `{"mv-mk02":true}`

**Notes:** Dr Alraune’s death and Marc’s beating happen offscreen or in silhouette: cut to black on the shots, cut away as the men close in. Khonshu here is only the statue and a voice; the moon should visibly “look” (a slow brighten). Marc wears the statue’s shroud when he rises. Moods matter: Marlene stays sad through the complete scene. Verify the setting (the 1980 origin places the dig in Sudan/Egypt borderlands; the brief says Egypt).

## MK3. Three Faces

*Moon Knight #2–15 (1980–82)* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After Death in Egypt. · requires: MK2

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Steven Grant (Steven Grant, one of Moon Knight’s identities (Marvel)), Jake Lockley (Jake Lockley, one of Moon Knight’s identities (Marvel)), Marlene (Marlene Alraune (Marvel)), Bushman (Raoul Bushman (Marvel)), Gena (Gena Landers (Marvel)), Crawley (Crawley (Marvel))

### Step 1: Send a Nubbin into each of Marc’s lives and bring back Bushman’s trail.

Hint: Assign one Nubbin to Steven and one to Jake; you go with the life you chose. Each comes back with a clue at dawn. · check: `assign:mv-three-lives`

#### <a id="mv-mk03-split"></a>Scene `mv-mk03-split`

_The rift drops you on a gravel drive outside a mansion on Long Island. Every window is lit._  
**Steven Grant** _(happy)_: The Keeper! Come in. Wipe your feet, or don’t; the carpet’s insured. Steven Grant.  
**You**: We’ve met. In the desert.  
**Steven Grant**: You met Marc. I’m Steven. I make the money, I go to the parties, I remember everyone’s birthday.  
**Steven Grant**: Marc works the nights. Jake drives a cab and hears things. We share the hours the way flatmates share a kitchen.  
**Marlene** _(soft)_: It isn’t a costume, Keeper. Each of them is really there. Talk to whoever is in front of you.  
**Steven Grant**: She explains us better than we do. Bushman is in the city, and he’s left a trail through all three of our lives.  
**Steven Grant**: Your Nubbins can be where we can’t all be at once. One with me, one with Jake, and you with whoever you like.  
_Your Nubbins bounce. Being in three places at once sounds, to them, like a treat._  

**Choices**

- **Go with Steven to the charity gala.** — sets `{"mv-mk-first-face":"first-steven"}`
    - **Steven Grant**: Excellent. Black tie. I’ll find something in your size. Marlene, do we have black tie in… round?
- **Ride along in Jake’s cab.** — sets `{"mv-mk-first-face":"first-jake"}`
    - Steven closes his eyes. When he opens them he stands differently, and reaches for a flat cap on the hall stand.
    - **Jake Lockley**: Cab’s round the back. You sit up front. The little ones sit wherever they want.
- **Go with Moon Knight onto the rooftops.** — sets `{"mv-mk-first-face":"first-moon-knight"}`
    - **Marc Spector**: Rooftops, then. Wrap up. It’s colder up there than people think.

#### <a id="mv-mk03-split-done"></a>Done `mv-mk03-split-done`

_At dawn your Nubbins come back to the mansion, each with a different story._  
_One saw a gentleman leave his own party to sit with a lonely waiter. One saw a cabbie give a soaked kid a free ride._  
_And someone saw a man in white cross the rooftops like falling snow. All three heard the same name: the old pier._  
_Then you compare times. The gala speech, the free ride, the rooftop chase. All three happened at ten past two._  
**You**: That can’t be right. There’s only one of him.  
**Marlene** _(soft)_: Don’t do the sums, Keeper. I tried for a year. They never come out the same twice.  
**Marlene** _(soft)_: Three different men. One heart. That part always adds up.  

### Step 2: Storm Bushman’s pier warehouse with Moon Knight.

Hint: A karate bout against Bushman. A Run Nubbin should dodge his knife; a Power Nubbin finishes it. · check: `karate:win:mv-bushman`

#### <a id="mv-mk03-bushman"></a>Scene `mv-mk03-bushman`

_Gena’s diner smells of coffee and onions. Jake has the booth by the window._  
**Jake Lockley** _(happy)_: Gena, two coffees, and whatever the little fella eats.  
**Gena**: It already ate the sugar, Jake. All of it.  
_A thin man in a coat too big for him slides into the booth and talks to the tabletop._  
**Jake Lockley**: Gena runs this place. Crawley is my ears. Don’t take his coat.  
**Crawley**: Your man with the painted face, Jake. Old pier warehouse. Men with guns. Crates of money that aren’t his.  
**Jake Lockley** _(soft)_: Thanks, Crawl. Eat something. On me.  
**Jake Lockley** _(think)_: Marc wants Bushman bad. Steven wants him in a courtroom. Me, I just want him to stop.  
**You**: What do the three of you agree on?  
**Jake Lockley** _(soft)_: That nobody else gets hurt. We always agree on that bit.  
_Jake glances at the moon, still faint in the morning sky. He doesn’t look at it fondly._  
_The pier is two streets away. So is the plan._  
**Jake Lockley**: Tonight one of us goes in first. Whoever does, that’s how it goes. You pick, Keeper. We’ll only argue.  

**Choices**

- **Let Marc lead. Bushman should feel it.** — sets `{"mv-mk-bushman-lead":"marc"}`
    - **Jake Lockley**: Marc, then. Watch him for me. He doesn’t always notice where the edge is till he’s over it.
- **Let Steven lead. Bushman belongs in a courtroom.** — sets `{"mv-mk-bushman-lead":"steven"}`
    - **Jake Lockley**: Steven’ll bring handcuffs and a lawyer’s phone number. He’ll have ironed both.
    - **Crawley**: Bring a big pair. Of cuffs. He’s got wide wrists.
- **Let Jake lead. Just make him stop.** — sets `{"mv-mk-bushman-lead":"jake"}`
    - **Jake Lockley**: Quiet, then. Cab round the back, no speeches, no cape. In and out.

#### <a id="mv-mk03-bushman-done"></a>Done `mv-mk03-bushman-done`

_Bushman goes through a stack of crates and stays down. Sirens are already close._  
_Afterwards, nobody can agree who threw the last punch. Your Nubbin saw it. It isn’t telling._  
**Marc Spector** _(angry)_: He’ll go to prison. He’ll get out. He always gets out.  

### Complete

#### <a id="mv-mk03-complete"></a>Complete `mv-mk03-complete`

_Back at the mansion: Steven pours tea, Jake’s cap hangs on the stand, the white cloak dries by the fire._  
**Steven Grant** _(soft)_: You met all of us. Most people meet one and decide that’s plenty.  
**You**: Which one of you is the real Marc?  
**Steven Grant** _(think)_: All of us. That’s the honest answer, and the boring one.  
**Jake Lockley** _(think)_: He says that because he’s the one who answers the door. Ask again at three in the morning.  
**Marlene** _(soft)_: Thank you for talking to each of them like a person. They notice.  
_Steven gives you a hatbox. Inside: a silk top hat, a battered cabbie’s cap, and a small white hood._  

**Rewards**

- Three hats (cosmetic): A top hat, a cabbie’s flat cap and a white hood, sized for Nubbins. Any Nubbin can wear any of the three.

Sets on completion: `{"mv-mk03":true,"mv-mk-met-faces":true}`

**Notes:** The three identities are separate speakers with separate portraits and voices: Steven (polished, warm, dry), Jake (street-smart, kind, plain-spoken), Marc (clipped, tired). Switches are shown by posture and wardrobe, never by a gag or a sound effect. The split step runs the Keeper with the chosen life and the two Nubbins with the others; each returns one clue card. All three clue cards are stamped 2:10 a.m.; the impossible overlap is the storyline’s quiet question and is never explained. mv-mk-bushman-lead (marc | steven | jake) picks who leads the pier raid: Marc’s bout is fastest and harshest, Steven’s ends in an arrest, Jake’s is a stealth entry. Gena and Crawley are Jake’s regulars from the 1980 run; check names before ship. SIGNATURE CHOICE: mv-mk-first-face (first-steven | first-jake | first-moon-knight: whose night you shared first) pays off through MV_MOONKNIGHT_VARIANTS at mv-mk05-scene (which of the three Flint has you on file with), mv-mk06-ward (whom Marc trusts you to find first in the asylum) and mv-mk08-orders (which face calls on you against Khonshu). The values carry a first- prefix because the runner matches variants by value and mv-mk-bushman-lead also uses steven / jake.

## MK4. The Bottom

*Moon Knight vol. 5 #1–6 (2006)* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After Three Faces. · requires: MK3

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Khonshu (Khonshu (Marvel)), Frenchie (Jean-Paul “Frenchie” Duchamp (Marvel)), Taskmaster (Taskmaster (Marvel))

### Step 1: Help Marc through his recovery, one day at a time.

Hint: Visit him on five separate days. Feed him, sit with him, and let a high-trust Nubbin stay the night. · check: `visit:mv-marc-recovery:5`

#### <a id="mv-mk04-chair"></a>Scene `mv-mk04-chair`

_The mansion is dark. Dust on the banisters. Empty bottles on the stairs._  
**Frenchie** _(sad)_: He doesn’t let me in much now. He doesn’t let anyone in. Go gently.  
_Marc sits in a wheelchair in the empty ballroom, both legs in braces. He hasn’t shaved in weeks._  
**Marc Spector** _(sad)_: Keeper. Come to see the fist of the god? Here it is. Doesn’t close all the way any more.  
_In the corner stands a tall shape with a bird’s skull for a face. Marc looks at it. So does your Nubbin._  
**Khonshu**: You quit me, my son. Rotting in a chair while the night goes unanswered.  
**Marc Spector** _(angry)_: You’re not here. You’re a bad night and a cracked skull.  
**Khonshu**: Then why does the small creature see me?  
_Your Nubbin edges to the wheelchair and puts itself between Marc and the corner._  
**Marc Spector** _(sad)_: Marlene left. Frenchie stays because he’s too kind to go. Why are you here?  

**Choices**

- **Sit with him. Say nothing.** — sets `{"mv-mk-bottom":"stayed"}`
    - You sit on the floor by his chair. Minutes pass. His hand finds your Nubbin’s head and stays there.
    - **Marc Spector**: …Okay.
- **“You came back once. You can do it again.”** — sets `{"mv-mk-bottom":"pushed"}`
    - **Marc Spector**: Last time I had a god holding me up. Now he just watches.
    - **Khonshu**: I am not watching. I am waiting.
- **Speak to the shape in the corner.** — sets `{"mv-mk-bottom":"faced-khonshu"}`
    - **You**: Leave him alone.
    - **Khonshu**: I chose a fist, and it seems I was given a Keeper with opinions.
    - **Marc Spector**: Nobody’s ever told him off before. Do it again.

#### <a id="mv-mk04-chair-done"></a>Done `mv-mk04-chair-done`

_On the fifth day he stands. Two steps, then the rail, then two more._  
**Marc Spector** _(think)_: Don’t clap. If anyone claps I’m sitting back down.  
**Frenchie** _(happy)_: I am not clapping. I am crying a little. Different thing.  

### Step 2: Survive Taskmaster’s attack on the mansion.

Hint: Taskmaster copies your Nubbin’s last move. Never use the same move twice in a row. · check: `karate:win:mv-taskmaster:no-repeat`

#### <a id="mv-mk04-taskmaster"></a>Scene `mv-mk04-taskmaster`

_The night Marc walks without the rail, the skylight breaks._  
_A hooded man in a skull mask drops onto the ballroom floor with a sword, a shield and a bow._  
**Taskmaster**: Spector. Somebody’s paying to find out if you’re finished. I watched every fight you ever had on tape.  
**Taskmaster**: Every move you know, I know. That’s my whole act.  
**Marc Spector** _(angry)_: Then you learned the old me.  
**Khonshu**: Now, my son. Show me you are still mine.  
_Marc’s voice changes. It goes very quiet and very flat, and your Nubbin flinches for the first time._  
**Marc Spector**: Keeper. Take the little one out of the room.  
**You**: Marc—  
**Marc Spector** _(sad)_: Please. I don’t want it to see this.  

**Choices**

- **Do as he asks. Carry the Nubbin out.** — sets `{"mv-mk-taskmaster":"left"}`
    - You shut the ballroom doors. Through them: a sword, a shield, and a voice you would not have known was Marc’s.
- **Stay. Make him do it in front of you.** — sets `{"mv-mk-taskmaster":"stayed"}`
    - **You**: No. We stay. Whoever you’re about to be, you can be it in front of us.
    - Marc looks at your Nubbin. Something in his face fights its way back up. It doesn’t win. But it slows him down.

#### <a id="mv-mk04-taskmaster-done"></a>Done `mv-mk04-taskmaster-done`

_Then it is quiet. Taskmaster is gone through the skylight, leaving a cracked shield on the parquet._  
_Marc is standing. His knuckles are split. He doesn’t look like someone who won._  
**Marc Spector** _(shock)_: Did I do that? I don’t remember the middle of it. There’s a gap, like a record skipping.  
**Khonshu** _(happy)_: You did not. I did. You lent me your hands, my son, and I gave them back. Better. Much better.  

### Complete

#### <a id="mv-mk04-complete"></a>Complete `mv-mk04-complete`

**Marc Spector** _(think)_: I’m back. That’s what he wanted. I don’t know yet if it’s what I wanted.  
**Marc Spector** _(sad)_: Or if it was me who came back. Frenchie. Am I me? Tell me straight.  
**Frenchie** _(soft)_: You are walking. You are rude about my coffee. I will take that as a yes.  
**Marc Spector** _(sad)_: Keeper. The way I went quiet back there. Don’t ever let the little one get used to that.  
_Your Nubbin climbs into his lap anyway. After a moment, he lets it._  
_Frenchie walks you out and hands you Marc’s silver-headed cane. He says Marc won’t be needing it._  

**Rewards**

- Silver-headed cane (decor): Marc’s old walking cane, for the stand by your door. He doesn’t need it any more.
- Stayed in the Dark (title): Title: you kept a broken man company until he stood up.

Sets on completion: `{"mv-mk04":true}`

**Notes:** The darkest storyline in the line. Drinking and despair are present but shown, not dwelt on: bottles as set dressing, no drinking on screen. Khonshu appears as a tall figure only Marc and the Nubbin see; keep it in the corner, still, lit from above. Taskmaster: with mv-mk-taskmaster = left, the fight plays as muffled sound over a closed door, then the karate bout as the Nubbins rejoin; with stayed, the Keeper watches from the doorway and the bout starts at once. Either way the done scene opens on the quiet after. Khonshu’s claim that he fought through Marc is deliberately unverifiable: never confirm or deny it on screen. No blood on screen. The rehab step is a five-day calendar check.

## MK5. Mr. Knight

*Moon Knight vol. 7 #1–6 (2014), especially #5* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After The Bottom. · requires: MK4

**Cast:** Mr. Knight (Marc Spector as Mr. Knight (Marvel)), Detective Flint (Detective Flint (Marvel)), The Girl, Kidnapper

### Step 1: Climb the tower alongside Mr. Knight, floor by floor.

Hint: Run the Cliff course; each checkpoint is a floor. High Power and Run climb fastest. · check: `race:finish:cliff`

#### <a id="mv-mk05-scene"></a>Scene `mv-mk05-scene`

_Midtown, three in the morning. Police tape, a blue light turning, and a white limousine pulling up._  
_Out steps a man in a spotless white three-piece suit and a white mask. He bows to your Nubbins._  
**Mr. Knight**: Keeper. Detective Flint. Detective, the Keeper, and associates.  
**Detective Flint**: You brought pets to a crime scene. And the file says you’re Spector. Or Grant. Or a cabbie. It’s a long file.  
**Mr. Knight**: Tonight it’s a short one. Mr. Knight. And I brought colleagues, not pets. Tell us about the girl.  
**Detective Flint**: Taken from her family’s car an hour ago. They’re holding her on the top floor. Twelve floors of their people in between.  
**Detective Flint** _(sad)_: Armed response is forty minutes out. I don’t think she has forty minutes.  
**Mr. Knight**: Then I’ll go in the front door. White is useful, Keeper. They see me coming, and they know what it means.  
**You**: Why the suit?  
**Mr. Knight** _(soft)_: The cloak was for the god. The suit is for the people I help. I want them to see exactly who has come.  

**Choices**

- **Go in the front, one floor behind him.** — sets `{"mv-mk-climb":"stairs"}`
    - **Mr. Knight**: Good. Stay a flight back. If I say down, you go down.
- **Send the Nubbins up the outside wall.** — sets `{"mv-mk-climb":"wall"}`
    - **Detective Flint**: Your… colleagues are climbing the building. The outside of it.
    - **Mr. Knight**: Yes. They do that.

#### <a id="mv-mk05-scene-first-steven"></a>Variant `mv-mk05-scene-first-steven`

_Variant of `mv-mk05-scene`._

_Midtown, three in the morning. Police tape, a blue light turning, and a white limousine pulling up._  
_Out steps a man in a spotless white three-piece suit and a white mask. He bows to your Nubbins._  
**Mr. Knight**: Keeper. Detective Flint. Detective, the Keeper, and associates.  
**Detective Flint**: You brought pets to a crime scene. And the file says you’re Spector. Or Grant. Or a cabbie. It’s a long file.  
**Detective Flint**: And you I’ve seen in the society pages, at Grant’s elbow, with the pets in bow ties. You’re in the file too.  
**Mr. Knight**: Tonight it’s a short one. Mr. Knight. And I brought colleagues, not pets. Tell us about the girl.  
**Detective Flint**: Taken from her family’s car an hour ago. They’re holding her on the top floor. Twelve floors of their people in between.  
**Detective Flint** _(sad)_: Armed response is forty minutes out. I don’t think she has forty minutes.  
**Mr. Knight**: Then I’ll go in the front door. White is useful, Keeper. They see me coming, and they know what it means.  
**You**: Why the suit?  
**Mr. Knight** _(soft)_: The cloak was for the god. The suit is for the people I help. I want them to see exactly who has come.  

**Choices**

- **Go in the front, one floor behind him.** — sets `{"mv-mk-climb":"stairs"}`
    - **Mr. Knight**: Good. Stay a flight back. If I say down, you go down.
- **Send the Nubbins up the outside wall.** — sets `{"mv-mk-climb":"wall"}`
    - **Detective Flint**: Your… colleagues are climbing the building. The outside of it.
    - **Mr. Knight**: Yes. They do that.

#### <a id="mv-mk05-scene-first-jake"></a>Variant `mv-mk05-scene-first-jake`

_Variant of `mv-mk05-scene`._

_Midtown, three in the morning. Police tape, a blue light turning, and a white limousine pulling up._  
_Out steps a man in a spotless white three-piece suit and a white mask. He bows to your Nubbins._  
**Mr. Knight**: Keeper. Detective Flint. Detective, the Keeper, and associates.  
**Detective Flint**: You brought pets to a crime scene. And the file says you’re Spector. Or Grant. Or a cabbie. It’s a long file.  
**Detective Flint**: And you I’ve seen in the front seat of Lockley’s cab. Twice. Pets on the dashboard. You’re in the file too.  
**Mr. Knight**: Tonight it’s a short one. Mr. Knight. And I brought colleagues, not pets. Tell us about the girl.  
**Detective Flint**: Taken from her family’s car an hour ago. They’re holding her on the top floor. Twelve floors of their people in between.  
**Detective Flint** _(sad)_: Armed response is forty minutes out. I don’t think she has forty minutes.  
**Mr. Knight**: Then I’ll go in the front door. White is useful, Keeper. They see me coming, and they know what it means.  
**You**: Why the suit?  
**Mr. Knight** _(soft)_: The cloak was for the god. The suit is for the people I help. I want them to see exactly who has come.  

**Choices**

- **Go in the front, one floor behind him.** — sets `{"mv-mk-climb":"stairs"}`
    - **Mr. Knight**: Good. Stay a flight back. If I say down, you go down.
- **Send the Nubbins up the outside wall.** — sets `{"mv-mk-climb":"wall"}`
    - **Detective Flint**: Your… colleagues are climbing the building. The outside of it.
    - **Mr. Knight**: Yes. They do that.

#### <a id="mv-mk05-scene-first-moon-knight"></a>Variant `mv-mk05-scene-first-moon-knight`

_Variant of `mv-mk05-scene`._

_Midtown, three in the morning. Police tape, a blue light turning, and a white limousine pulling up._  
_Out steps a man in a spotless white three-piece suit and a white mask. He bows to your Nubbins._  
**Mr. Knight**: Keeper. Detective Flint. Detective, the Keeper, and associates.  
**Detective Flint**: You brought pets to a crime scene. And the file says you’re Spector. Or Grant. Or a cabbie. It’s a long file.  
**Detective Flint**: And you I’ve seen on a roof with the cloak. Don’t think I didn’t. You’re in the file too.  
**Mr. Knight**: Tonight it’s a short one. Mr. Knight. And I brought colleagues, not pets. Tell us about the girl.  
**Detective Flint**: Taken from her family’s car an hour ago. They’re holding her on the top floor. Twelve floors of their people in between.  
**Detective Flint** _(sad)_: Armed response is forty minutes out. I don’t think she has forty minutes.  
**Mr. Knight**: Then I’ll go in the front door. White is useful, Keeper. They see me coming, and they know what it means.  
**You**: Why the suit?  
**Mr. Knight** _(soft)_: The cloak was for the god. The suit is for the people I help. I want them to see exactly who has come.  

**Choices**

- **Go in the front, one floor behind him.** — sets `{"mv-mk-climb":"stairs"}`
    - **Mr. Knight**: Good. Stay a flight back. If I say down, you go down.
- **Send the Nubbins up the outside wall.** — sets `{"mv-mk-climb":"wall"}`
    - **Detective Flint**: Your… colleagues are climbing the building. The outside of it.
    - **Mr. Knight**: Yes. They do that.

#### <a id="mv-mk05-scene-done"></a>Done `mv-mk05-scene-done`

_Floor after floor. Every landing is quieter once he has passed it._  
_Fourth floor: a dentist’s waiting room, the fish tank still bubbling. Seventh: a gym, every treadmill running for nobody._  
_On the seventh floor, a Nubbin finds a treadmill. It runs very fast, goes nowhere, and is delighted._  
**Mr. Knight**: Colleague. We are climbing.  
**Mr. Knight** _(think)_: Ninth floor. Insurance. I always hated the ninth floor.  
_By the eleventh floor the white jacket is torn, and he is breathing hard, and he does not slow down._  

### Step 2: Walk the girl back down the stairs.

Hint: Keep a Nubbin beside her the whole way. If she is left alone for a moment, she panics and stops. · check: `escort:mv-girl:no-alone`

#### <a id="mv-mk05-top"></a>Scene `mv-mk05-top`

_Top floor. One door. Behind it, one last man with a gun, and a frightened girl tied to a chair._  
**Kidnapper** _(shock)_: Another step and I swear—  
**Mr. Knight**: You’re tired. I’m tired. She wants to go home. Let’s all go home.  
_The man looks past him at the stairwell, and at the eleven floors of silence behind it._  
_Your Nubbin trots past both of them, sits on the girl’s feet, and looks up at her._  
**The Girl** _(shock)_: Is that… yours?  
**You**: It’s yours for tonight.  
**Mr. Knight**: Keeper, untie her. Sir, put that on the floor and slide it to me.  
_The man’s hand shakes. Then the gun lands on the floorboards._  
**Mr. Knight** _(soft)_: Thank you.  

#### <a id="mv-mk05-top-done"></a>Done `mv-mk05-top-done`

_Twelve flights down. The girl holds your Nubbin the whole way and doesn’t look at the landings._  
**The Girl** _(soft)_: It’s warm. Is it always this warm?  

### Complete

#### <a id="mv-mk05-complete"></a>Complete `mv-mk05-complete`

_At the tape, her mother runs to her and does not let go._  
**Detective Flint**: Twelve floors, with a suit and a bunch of pets. Next time, wait for the response team.  
**Mr. Knight**: Colleagues.  
**Mr. Knight**: Next time, Detective, have them wait for me.  
_He looks down at the ruin of his white suit, then at your Nubbin, which is spotless._  
**Detective Flint**: Off the record. Which one of you was that up there?  
**Mr. Knight** _(think)_: The one who was needed, Detective. That’s the only one I ever send.  
**Mr. Knight** _(happy)_: Every detective needs a good suit. So does every detective’s Nubbin.  
_A box arrives at the Grove the next morning, wrapped in white ribbon._  

**Rewards**

- Little white suit (cosmetic): A tiny white three-piece suit and mask for a Nubbin. It stays spotless, somehow.

Sets on completion: `{"mv-mk05":true}`

**Notes:** Climb staged on the Cliff race course reskinned as a tower: each checkpoint is a floor number. Fights on the stairs are implied by the quiet landings, not shown. The kidnapped girl is unnamed. The final standoff resolves without a shot. Mr. Knight is a separate portrait from Marc (white suit, white mask) but the same man; he refers to Marc in the first person.

## MK6. Lunatic

*Moon Knight vol. 8 #1–14 (2016–17)* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After Mr. Knight. · requires: MK5

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Steven Grant (Steven Grant, one of Moon Knight’s identities (Marvel)), Jake Lockley (Jake Lockley, one of Moon Knight’s identities (Marvel)), Khonshu (Khonshu (Marvel)), Dr Emmett (Dr. Emmett (Marvel))

### Step 1: Find Steven and Jake in the asylum’s locked wings.

Hint: Explore the wards on the Expedition map. Doors open for Nubbins who trust you; bring your highest-trust pair. · check: `expedition:clear:mv-asylum-wards`

#### <a id="mv-mk06-ward"></a>Scene `mv-mk06-ward`

_You step out of the rift into a white corridor that smells of bleach. A door locks behind you._  
_Marc sits on a narrow bed in a hospital gown, a plastic bracelet on his wrist._  
**Dr Emmett**: You’ve been here since you were a boy, Marc. No god. No cloak. No Moon Knight.  
**Dr Emmett**: The sooner you accept that, the sooner you can go home.  
**Marc Spector** _(think)_: You hear that, Keeper? None of it happened. Not the desert. Not the tower. Not you.  
_Dr Emmett looks straight through you, as if you were a crack in the paint._  
**Dr Emmett**: Who are you talking to, Marc?  
**Dr Emmett**: Is it the Keeper again? Your notes mention a Keeper. Little round animals. You invented them at nine, after the funeral.  
_Your Nubbin sniffs the bracelet on Marc’s wrist and sneezes. The printed name flickers like a bad screen._  
**Marc Spector** _(shock)_: There. You saw that. Tell me you saw that.  
**You**: I saw it.  
**Marc Spector** _(angry)_: Then this place is the lie. Steven and Jake are locked in here somewhere. Help me find them.  

**Choices**

- **Look for Steven first.** — sets `{"mv-mk-asylum":"steven-first"}`
    - **Marc Spector**: Steven, then. He’ll have charmed a spare key out of somebody by now.
- **Look for Jake first.** — sets `{"mv-mk-asylum":"jake-first"}`
    - **Marc Spector**: Jake. He knows the back door of every building in the world.
- **“Marc. What if she’s right?”** — sets `{"mv-mk-asylum-doubt":true}`
    - **Marc Spector**: Then you’re not here, and I’m talking to a wall, and the wall just asked a very good question.
    - **Marc Spector**: I’ll risk it. If I’m mad, I’d rather be mad and looking for my friends. Come on.

#### <a id="mv-mk06-ward-first-steven"></a>Variant `mv-mk06-ward-first-steven`

_Variant of `mv-mk06-ward`._

_You step out of the rift into a white corridor that smells of bleach. A door locks behind you._  
_Marc sits on a narrow bed in a hospital gown, a plastic bracelet on his wrist._  
**Dr Emmett**: You’ve been here since you were a boy, Marc. No god. No cloak. No Moon Knight.  
**Dr Emmett**: The sooner you accept that, the sooner you can go home.  
**Marc Spector** _(think)_: You hear that, Keeper? None of it happened. Not the desert. Not the tower. Not you.  
_Dr Emmett looks straight through you, as if you were a crack in the paint._  
**Dr Emmett**: Who are you talking to, Marc?  
**Dr Emmett**: Is it the Keeper again? Your notes mention a Keeper. Little round animals. You invented them at nine, after the funeral.  
_Your Nubbin sniffs the bracelet on Marc’s wrist and sneezes. The printed name flickers like a bad screen._  
**Marc Spector** _(shock)_: There. You saw that. Tell me you saw that.  
**You**: I saw it.  
**Marc Spector** _(angry)_: Then this place is the lie. Steven and Jake are locked in here somewhere. Help me find them.  
**Marc Spector** _(think)_: You and Steven hit it off, that first night. Black tie, in round. If anyone in here has kept hold of himself, it’s him.  

**Choices**

- **Look for Steven first.** — sets `{"mv-mk-asylum":"steven-first"}`
    - **Marc Spector**: Steven, then. He’ll have charmed a spare key out of somebody by now.
- **Look for Jake first.** — sets `{"mv-mk-asylum":"jake-first"}`
    - **Marc Spector**: Jake. He knows the back door of every building in the world.
- **“Marc. What if she’s right?”** — sets `{"mv-mk-asylum-doubt":true}`
    - **Marc Spector**: Then you’re not here, and I’m talking to a wall, and the wall just asked a very good question.
    - **Marc Spector**: I’ll risk it. If I’m mad, I’d rather be mad and looking for my friends. Come on.

#### <a id="mv-mk06-ward-first-jake"></a>Variant `mv-mk06-ward-first-jake`

_Variant of `mv-mk06-ward`._

_You step out of the rift into a white corridor that smells of bleach. A door locks behind you._  
_Marc sits on a narrow bed in a hospital gown, a plastic bracelet on his wrist._  
**Dr Emmett**: You’ve been here since you were a boy, Marc. No god. No cloak. No Moon Knight.  
**Dr Emmett**: The sooner you accept that, the sooner you can go home.  
**Marc Spector** _(think)_: You hear that, Keeper? None of it happened. Not the desert. Not the tower. Not you.  
_Dr Emmett looks straight through you, as if you were a crack in the paint._  
**Dr Emmett**: Who are you talking to, Marc?  
**Dr Emmett**: Is it the Keeper again? Your notes mention a Keeper. Little round animals. You invented them at nine, after the funeral.  
_Your Nubbin sniffs the bracelet on Marc’s wrist and sneezes. The printed name flickers like a bad screen._  
**Marc Spector** _(shock)_: There. You saw that. Tell me you saw that.  
**You**: I saw it.  
**Marc Spector** _(angry)_: Then this place is the lie. Steven and Jake are locked in here somewhere. Help me find them.  
**Marc Spector** _(think)_: Jake drove you, that first night. Said you didn’t talk much, and he liked that. If anyone in here has kept quiet and listened, it’s him.  

**Choices**

- **Look for Steven first.** — sets `{"mv-mk-asylum":"steven-first"}`
    - **Marc Spector**: Steven, then. He’ll have charmed a spare key out of somebody by now.
- **Look for Jake first.** — sets `{"mv-mk-asylum":"jake-first"}`
    - **Marc Spector**: Jake. He knows the back door of every building in the world.
- **“Marc. What if she’s right?”** — sets `{"mv-mk-asylum-doubt":true}`
    - **Marc Spector**: Then you’re not here, and I’m talking to a wall, and the wall just asked a very good question.
    - **Marc Spector**: I’ll risk it. If I’m mad, I’d rather be mad and looking for my friends. Come on.

#### <a id="mv-mk06-ward-first-moon-knight"></a>Variant `mv-mk06-ward-first-moon-knight`

_Variant of `mv-mk06-ward`._

_You step out of the rift into a white corridor that smells of bleach. A door locks behind you._  
_Marc sits on a narrow bed in a hospital gown, a plastic bracelet on his wrist._  
**Dr Emmett**: You’ve been here since you were a boy, Marc. No god. No cloak. No Moon Knight.  
**Dr Emmett**: The sooner you accept that, the sooner you can go home.  
**Marc Spector** _(think)_: You hear that, Keeper? None of it happened. Not the desert. Not the tower. Not you.  
_Dr Emmett looks straight through you, as if you were a crack in the paint._  
**Dr Emmett**: Who are you talking to, Marc?  
**Dr Emmett**: Is it the Keeper again? Your notes mention a Keeper. Little round animals. You invented them at nine, after the funeral.  
_Your Nubbin sniffs the bracelet on Marc’s wrist and sneezes. The printed name flickers like a bad screen._  
**Marc Spector** _(shock)_: There. You saw that. Tell me you saw that.  
**You**: I saw it.  
**Marc Spector** _(angry)_: Then this place is the lie. Steven and Jake are locked in here somewhere. Help me find them.  
**Marc Spector** _(think)_: That first night you took the rooftops with me. Whatever they’ve told the others in here, you and I know what the cold felt like.  

**Choices**

- **Look for Steven first.** — sets `{"mv-mk-asylum":"steven-first"}`
    - **Marc Spector**: Steven, then. He’ll have charmed a spare key out of somebody by now.
- **Look for Jake first.** — sets `{"mv-mk-asylum":"jake-first"}`
    - **Marc Spector**: Jake. He knows the back door of every building in the world.
- **“Marc. What if she’s right?”** — sets `{"mv-mk-asylum-doubt":true}`
    - **Marc Spector**: Then you’re not here, and I’m talking to a wall, and the wall just asked a very good question.
    - **Marc Spector**: I’ll risk it. If I’m mad, I’d rather be mad and looking for my friends. Come on.

#### <a id="mv-mk06-ward-done"></a>Done `mv-mk06-ward-done`

_Steven is in a room full of film reels, half sure he is someone else’s story. Jake is in a cell painted like a cab._  
**Steven Grant** _(shock)_: Marc. Thank heavens. I was starting to think I’d made you up.  
**Jake Lockley** _(think)_: Funny. I always figured I made up the pair of you.  
**Steven Grant**: Can we have this argument somewhere with a door handle on the inside?  
**Jake Lockley** _(happy)_: All three of us in one room, though. Been a while.  
_Their three hands touch. The bleach smell goes. The white walls start to peel like old paint._  
**Steven Grant**: I think we’re doing that.  
**Jake Lockley**: Then stop. No, don’t stop.  

### Step 2: Stand with all three of them against Khonshu.

Hint: A three-round karate bout; a different face leads each round. Swap your lead Nubbin between rounds. · check: `karate:win:mv-khonshu-avatar:3-rounds`

#### <a id="mv-mk06-god"></a>Scene `mv-mk06-god`

_Past the last locked door the floor turns to sand and the ceiling to night. The moon hangs low and enormous._  
**Khonshu**: My fist returns. With his passengers, and his pets.  
**Khonshu**: You fled into a little white room to hide from me, Marc. I built its walls for you.  
**Marc Spector** _(angry)_: You built them.  
**Khonshu**: I needed you broken so you would come back whole. And mine.  
**Steven Grant**: He isn’t talking to us. He’s talking about us. Like furniture.  
**Jake Lockley** _(angry)_: He always did.  
**Marc Spector** _(angry)_: Look at me. Not at the cloak. At me.  
**Marc Spector**: I’m not your fist and I’m not your son. I’m three men who decided to live, and we’re done kneeling.  
**Khonshu** _(think)_: …You have never spoken to me like this.  
_The three of them stand side by side. Your Nubbins stand in front, small as stones and twice as stubborn._  

#### <a id="mv-mk06-god-done"></a>Done `mv-mk06-god-done`

_The moon pulls back. Sand becomes floor, floor becomes pavement, and the asylum is gone._  
**Khonshu** _(think)_: Equals, then. For now.  

### Complete

#### <a id="mv-mk06-complete"></a>Complete `mv-mk06-complete`

_You come out on a Manhattan street at dawn. Marc is in his own clothes._  
**Marc Spector** _(think)_: He’ll be back. He always comes back. But this time he’ll knock.  
**Steven Grant** _(happy)_: We should mark the occasion. Brunch.  
**Jake Lockley**: Diner. Gena’s.  
**Marc Spector** _(happy)_: Diner.  
_He snaps the plastic bracelet off his wrist and gives it to your Nubbin, which wears it as a crown._  
_The name printed on it has gone blank. Your Nubbin doesn’t seem to mind whose it was._  
**Steven Grant** _(soft)_: For the record, Keeper, if you ever do turn out to be imaginary, you were the best thing we ever imagined.  

**Rewards**

- Snapped bracelet (item): The hospital bracelet Marc tore off on the way out. The name on it has faded to nothing.
- Saw Through the Walls (title): Title: you believed Marc when the whole building said otherwise.

Sets on completion: `{"mv-mk06":true}`

**Notes:** The asylum is a false reality built by Khonshu; it must never read as mocking real hospitals or patients. Dr Emmett is calm and kind on the surface; the horror is that she cannot see the Keeper, and that Marc’s file already explains the Keeper away. The doubt choice (mv-mk-asylum-doubt) is a fair question, not a wrong answer: Marc takes it seriously and goes on anyway. It leaves mv-mk-asylum unset. Steven and Jake each get their own room in their own visual language (film set, taxi). The final bout is a dialogue of equals; Khonshu is not destroyed here. Verify Dr Emmett’s role in the source.

## MK7. The Midnight Mission

*Moon Knight vol. 9 #1–12 (2021–22)* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After Lunatic, once Spawn has met Angela (SP4). · requires: MK6, SP4

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Khonshu (Khonshu (Marvel)), Hunter’s Moon (Hunter’s Moon (Marvel)), Rosa

### Step 1: Walk the Mission’s night-walkers home while Hunter’s Moon prowls.

Hint: Four Expedition legs at night; keep a Nubbin with each visitor. · check: `expedition:clear:mv-mission-night:4`

#### <a id="mv-mk07-mission"></a>Scene `mv-mk07-mission`

_A narrow storefront under a railway bridge. A hand-painted sign: THE MIDNIGHT MISSION. OPEN ALL NIGHT._  
**Marc Spector**: Welcome. If you walk at night, you have a place here. Night nurses, insomniacs, cabbies, and stranger things.  
**Marc Spector** _(think)_: I’m Khonshu’s priest now. I don’t wear the cloak for him any more. I wear it for them.  
**You**: Does he know that?  
**Marc Spector**: He knows. He sulks.  
_The pews are full of tired people with coffee. A few have very pale skin and very good manners._  
**Marc Spector**: Word got round you walked with a Hellspawn and came back. Folk here like that. Most have been hunted too.  
_The door bangs open. A masked man in a pale hood stands there with a crescent blade._  
**Hunter’s Moon**: Spector. The god has chosen another fist, a worthy one. I am Hunter’s Moon.  
**Hunter’s Moon** _(angry)_: You run a soup kitchen for creatures of the dark and call it worship. I am here to do your job properly.  
**Marc Spector**: Come in, then. Wipe your feet. Keep your voice down; people are sleeping.  

#### <a id="mv-mk07-mission-done"></a>Done `mv-mk07-mission-done`

_Four doors, four locks turned, four people safe. Every time, a pale hood was waiting one street behind._  
**Rosa** _(shock)_: He followed us the whole way. Your little one kept looking back at him, like it was keeping count.  

### Step 2: Stop Hunter’s Moon without anyone from the Mission getting hurt.

Hint: A karate bout with guard rules: if an ally behind you is struck, the round is lost. · check: `karate:win:mv-hunters-moon:guard-allies`

#### <a id="mv-mk07-hunter"></a>Scene `mv-mk07-hunter`

_Hunter’s Moon corners you under the bridge, with Rosa and two other regulars behind you._  
**Hunter’s Moon**: Step aside, Keeper. The god told me what Spector is. A broken soldier, playing priest.  
**Hunter’s Moon**: He told me more. There was never a Marc Spector. Only a mercenary who wore the name, like a coat off a dead man.  
**Marc Spector** _(think)_: Funny. He told me exactly the same about you. Word for word. He doesn’t even change the coat.  
**Hunter’s Moon** _(shock)_: …He said that to me in confidence.  
**Marc Spector**: He’s half right. I am broken. I’m also here. Where were you at three this morning when Rosa needed a ride?  
**Hunter’s Moon**: Khonshu does not care about rides.  
**Marc Spector**: No. That’s why I do.  
_Your Nubbin walks up to Hunter’s Moon, looks at his blade, then at the frightened people behind you._  
**You**: It’s working out which of you is the one to be afraid of.  
**Khonshu** _(happy)_: Two fists, quarrelling over my favour. How pleasant.  

**Choices**

- **Stand with Marc and fight.** — sets `{"mv-mk-hunter":"fought"}`
    - **Marc Spector**: Together, then. Keep them behind us.
- **Ask Hunter’s Moon who he protects.** — sets `{"mv-mk-hunter":"questioned"}`
    - **Hunter’s Moon**: I protect… the god’s will.
    - **Marc Spector**: That’s not a who, friend.

#### <a id="mv-mk07-hunter-done"></a>Done `mv-mk07-hunter-done`

_Hunter’s Moon backs into the dark, blade lowered. He doesn’t run. He looks like a man doing sums._  
**Hunter’s Moon**: I will be watching, Spector. Both of us will.  

### Complete

#### <a id="mv-mk07-complete"></a>Complete `mv-mk07-complete`

_Back at the Mission the coffee is still hot. Nobody asks what happened. Everybody knows._  
**Marc Spector** _(think)_: He’ll be back. Khonshu wants two fists so he can play one against the other.  
**Marc Spector**: Let him. I’ve got a door to keep open.  
**Rosa**: Which one of you is preaching on Sunday? Last week it was the posh one. He did a slideshow.  
**Marc Spector** _(happy)_: Jake. Jake’s turn. He’ll keep it short and swear twice.  
**Rosa** _(soft)_: The little one should have this. It never goes out. We need one that doesn’t go out.  
_Rosa takes down the small lantern that hangs over the Mission door and puts it in your hands._  

**Rewards**

- Mission lantern (decor): The lantern from the Midnight Mission’s door. It never goes out. Hang it in the Grove for anyone who walks at night.

Sets on completion: `{"mv-mk07":true,"mv-mk-mission-lantern":true}`

**Notes:** Needs SP4: after Angela, word of “hunters in the sky” has reached this world, and the Mission trusts a Keeper who walked with a Hellspawn. The pale, well-mannered regulars are vampires, implied only. Rosa is an original Mission regular. The Mission lantern is the light E3 Armageddon asks the Nubbins to keep lit; keep its art consistent. Verify Hunter’s Moon’s costume and backstory against vol. 9.

## MK8. Age of Khonshu

*Avengers vol. 8 #32–38 (2020): Age of Khonshu* · audience: adult · where: Multiverse: the rift above the waterfall (Moon Knight’s world) · when: After The Midnight Mission. · requires: MK7

**Cast:** Marc Spector (Marc Spector / Moon Knight (Marvel)), Steven Grant (Steven Grant, one of Moon Knight’s identities (Marvel)), Jake Lockley (Jake Lockley, one of Moon Knight’s identities (Marvel)), Khonshu (Khonshu (Marvel))

### Step 1: Follow Marc on Khonshu’s raids across the city.

Hint: Three Expedition legs, one for each stolen power. A Fly Nubbin keeps watch from above. · check: `expedition:clear:mv-khonshu-raids:3`

#### <a id="mv-mk08-orders"></a>Scene `mv-mk08-orders`

_The night sky over New York is wrong. The moon is too large, and it has an eye._  
**Khonshu**: My fist. The Earth’s champions hoard power they have not earned. Fire from the stars. A sorcerer’s eye.  
**Khonshu**: Bring them to me. With them I take the sky, and from the sky I guard every night, forever.  
**Khonshu**: No darkness unwatched. No harm unpunished.  
**Marc Spector** _(think)_: Every night, watched. It sounds good when you say it fast.  
**Steven Grant**: Say it slowly, Marc. “Forever.” “Unpunished.” Punished by whom?  
**Jake Lockley**: He pulled us out of the sand. I get it. But he’s never once asked us what we want.  
**Marc Spector** _(sad)_: Keeper. I owe him my life. I don’t know if I owe him everyone else’s.  
**Khonshu** _(angry)_: Hesitation is not prayer, Marc.  

**Choices**

- **Go with him. Stay close and watch.** — sets `{"mv-mk-akh":"watched"}`
    - **Marc Spector**: Stay close. If I go too far, you tell me. Loudly.
- **Send a Fly Nubbin to warn the Avengers.** — sets `{"mv-mk-akh":"warned"}`
    - Your Fly Nubbin slips off between the towers. Whether the warning lands in time, you can’t tell.
    - **Khonshu**: The small ones fly ahead of you, my fist. Even they do not trust you.

#### <a id="mv-mk08-orders-first-steven"></a>Variant `mv-mk08-orders-first-steven`

_Variant of `mv-mk08-orders`._

_The night sky over New York is wrong. The moon is too large, and it has an eye._  
**Khonshu**: My fist. The Earth’s champions hoard power they have not earned. Fire from the stars. A sorcerer’s eye.  
**Khonshu**: Bring them to me. With them I take the sky, and from the sky I guard every night, forever.  
**Khonshu**: No darkness unwatched. No harm unpunished.  
**Marc Spector** _(think)_: Every night, watched. It sounds good when you say it fast.  
**Steven Grant**: Say it slowly, Marc. “Forever.” “Unpunished.” Punished by whom?  
**Jake Lockley**: He pulled us out of the sand. I get it. But he’s never once asked us what we want.  
**Steven Grant** _(soft)_: Keeper. You chose my evening over his rooftops, once. Tell him which of us had the better night.  
**Marc Spector**: Not now, Steven.  
**Steven Grant**: Exactly now, Marc. A god who never asks is a landlord.  
**Marc Spector** _(sad)_: Keeper. I owe him my life. I don’t know if I owe him everyone else’s.  
**Khonshu** _(angry)_: Hesitation is not prayer, Marc.  

**Choices**

- **Go with him. Stay close and watch.** — sets `{"mv-mk-akh":"watched"}`
    - **Marc Spector**: Stay close. If I go too far, you tell me. Loudly.
- **Send a Fly Nubbin to warn the Avengers.** — sets `{"mv-mk-akh":"warned"}`
    - Your Fly Nubbin slips off between the towers. Whether the warning lands in time, you can’t tell.
    - **Khonshu**: The small ones fly ahead of you, my fist. Even they do not trust you.

#### <a id="mv-mk08-orders-first-jake"></a>Variant `mv-mk08-orders-first-jake`

_Variant of `mv-mk08-orders`._

_The night sky over New York is wrong. The moon is too large, and it has an eye._  
**Khonshu**: My fist. The Earth’s champions hoard power they have not earned. Fire from the stars. A sorcerer’s eye.  
**Khonshu**: Bring them to me. With them I take the sky, and from the sky I guard every night, forever.  
**Khonshu**: No darkness unwatched. No harm unpunished.  
**Marc Spector** _(think)_: Every night, watched. It sounds good when you say it fast.  
**Steven Grant**: Say it slowly, Marc. “Forever.” “Unpunished.” Punished by whom?  
**Jake Lockley**: He pulled us out of the sand. I get it. But he’s never once asked us what we want.  
**Jake Lockley**: You rode up front with me, that first night, Keeper. You heard what the city says about him when it thinks nobody’s listening.  
**Jake Lockley**: Say it now. He won’t hear it from me.  
**Marc Spector** _(sad)_: Keeper. I owe him my life. I don’t know if I owe him everyone else’s.  
**Khonshu** _(angry)_: Hesitation is not prayer, Marc.  

**Choices**

- **Go with him. Stay close and watch.** — sets `{"mv-mk-akh":"watched"}`
    - **Marc Spector**: Stay close. If I go too far, you tell me. Loudly.
- **Send a Fly Nubbin to warn the Avengers.** — sets `{"mv-mk-akh":"warned"}`
    - Your Fly Nubbin slips off between the towers. Whether the warning lands in time, you can’t tell.
    - **Khonshu**: The small ones fly ahead of you, my fist. Even they do not trust you.

#### <a id="mv-mk08-orders-first-moon-knight"></a>Variant `mv-mk08-orders-first-moon-knight`

_Variant of `mv-mk08-orders`._

_The night sky over New York is wrong. The moon is too large, and it has an eye._  
**Khonshu**: My fist. The Earth’s champions hoard power they have not earned. Fire from the stars. A sorcerer’s eye.  
**Khonshu**: Bring them to me. With them I take the sky, and from the sky I guard every night, forever.  
**Khonshu**: No darkness unwatched. No harm unpunished.  
**Marc Spector** _(think)_: Every night, watched. It sounds good when you say it fast.  
**Steven Grant**: Say it slowly, Marc. “Forever.” “Unpunished.” Punished by whom?  
**Jake Lockley**: He pulled us out of the sand. I get it. But he’s never once asked us what we want.  
**Marc Spector** _(sad)_: You took the rooftops with me, that first night, Keeper. You know what the cloak is for. Tell me it isn’t for this.  
**Khonshu** _(angry)_: The cloak is for what I say it is for.  
**Marc Spector** _(sad)_: Keeper. I owe him my life. I don’t know if I owe him everyone else’s.  
**Khonshu** _(angry)_: Hesitation is not prayer, Marc.  

**Choices**

- **Go with him. Stay close and watch.** — sets `{"mv-mk-akh":"watched"}`
    - **Marc Spector**: Stay close. If I go too far, you tell me. Loudly.
- **Send a Fly Nubbin to warn the Avengers.** — sets `{"mv-mk-akh":"warned"}`
    - Your Fly Nubbin slips off between the towers. Whether the warning lands in time, you can’t tell.
    - **Khonshu**: The small ones fly ahead of you, my fist. Even they do not trust you.

#### <a id="mv-mk08-orders-done"></a>Done `mv-mk08-orders-done`

_Fire. An eye. A burning fist. One by one they are carried up into the moon, and the heroes fall still as stone._  
**Steven Grant** _(sad)_: I took the eye. I remember the sorcerer’s face. He looked so disappointed in me.  
**Jake Lockley**: No. I took the eye. You took the fire. I was there.  
**Marc Spector** _(shock)_: I don’t remember taking any of them. So which of us did?  
**Khonshu** _(happy)_: Does it matter which of you, my fist? Every one of you is mine.  

### Step 2: Get into Khonshu’s palace and free the stolen powers.

Hint: A karate bout against Khonshu’s guardians, three rounds. A Fly Nubbin strikes from above. · check: `karate:win:mv-khonshu-guardians`

#### <a id="mv-mk08-sky"></a>Scene `mv-mk08-sky`

_Above the clouds, Khonshu’s palace hangs over the city like a second moon._  
**Khonshu**: One task remains, my son. The last of them who could still stand against me. End her.  
**Marc Spector** _(angry)_: You said no harm unpunished. She hasn’t harmed anyone.  
**Khonshu**: She might. That is enough.  
**Steven Grant**: There it is.  
**Jake Lockley**: That’s the part he didn’t say fast.  
_Marc looks down at the city: a narrow storefront under a bridge, its doorway dark tonight._  
**Marc Spector** _(sad)_: You picked me up off the sand. I won’t forget it. But I won’t end the world to say thank you.  
**Khonshu** _(angry)_: Without me you are a mercenary with a fractured mind.  
**Marc Spector**: Without you I’m three men and a night job. That’s plenty.  
_Behind the throne, the stolen powers beat against their cages. Khonshu is looking at Marc, not at them._  

**Choices**

- **Go for the cages while the god is busy.** — sets `{"mv-mk-sky":"cages"}`
    - You slip round the throne with your Nubbins. They are very small, and gods never look down.
- **Stand beside Marc and face Khonshu.** — sets `{"mv-mk-sky":"stood"}`
    - **Khonshu**: The Keeper stands with you. How touching. How brief.
    - Your Nubbins line up at your feet, none of them tall enough to matter. They stay anyway.

#### <a id="mv-mk08-sky-done"></a>Done `mv-mk08-sky-done`

_The palace doors give. Inside, the stolen powers turn in the dark like caged stars._  
_Each one has a little brass tag, in Marc’s handwriting. He looks at the tags for a long time._  
**Marc Spector**: Let them out. All of them. Whoever put them in here.  

### Complete

#### <a id="mv-mk08-complete"></a>Complete `mv-mk08-complete`

_The fire goes back to its keeper. The eye goes back to the sorcerer. The heroes wake out of stone, blinking._  
**Khonshu** _(angry)_: Then go, my fist. Go and be small.  
_The palace floor opens under Marc. He falls through cloud and lands hard on the Mission roof, among the pigeons._  
_You and your Nubbins come down after him in a heap. The pigeons are not pleased._  
_Khonshu’s moon draws back. It does not leave. It watches._  
**Khonshu** _(think)_: You will come back to me, my fist. You always do.  
**Marc Spector**: Maybe. Not tonight.  
**Steven Grant** _(soft)_: Not tonight is a good start.  
**Jake Lockley**: Not tonight is all anyone gets.  
**Marc Spector** _(sad)_: Keeper. Those tags in the palace were in my handwriting. I don’t know when I wrote them. That scares me more than he does.  
**Marc Spector**: He isn’t finished. When he comes for me, keep that light burning. Even if I tell you not to.  
_Far off, past the edge of this world, something older than Khonshu is getting ready for war._  

**Rewards**

- Light-Keeper (title): Title: you stood with Marc in the sky while he told a god no.
- Moon Knight line complete (flag): All eight Moon Knight storylines are done. Counts toward Armageddon.

Sets on completion: `{"mv-mk08":true,"mv-mk-complete":true}`

**Notes:** Completes the Moon Knight line. Khonshu is pushed back, not beaten; Armageddon finishes it. Stolen powers are shown abstractly (a flame, an eye, a glowing fist) so no Avenger needs a portrait; verify which powers the source takes. “Her” in the palace scene is the last free Avenger, unnamed. The Mission doorway is dark because its lantern is with the Keeper (MK7). Unreliable memory is the point of the orders-done and sky-done beats: the three faces disagree about who took which power, and the tags are in Marc’s hand. Never resolve who did it; Khonshu working through Marc and Marc acting in a lost hour are both meant to stay possible. MK8 ends when Khonshu throws Marc out of the palace onto the Mission roof. The long walk down by the Mission lantern belongs to E3 only, so it never plays twice. The sky choice sets `mv-mk-sky` (cages | stood), cosmetic. The old `mv-mk-lantern` flag is retired.
