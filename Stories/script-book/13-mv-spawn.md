# Multiverse: Spawn (SP1–SP8)

## SP1. Al Simmons

*Spawn #1 (1992)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: The Spawn line opens in the Multiverse campaign.

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Al Simmons (Al Simmons (Image Comics)), Chapel (Chapel (Image Comics)), Malebolgia (Malebolgia (Image Comics)), Bobby

### Step 1: Help the stranger in the alley find out who he was.

Hint: Search the city on the Expedition map. The alley folk talk to Nubbins, not to him. · check: `expedition:clear:mv-rat-city`

#### Scene `mv-sp01-alley`

_The rift lets you out in an alley that smells of rain and rot. Something under the rubbish bags is breathing._  
_It sits up. A man, or the shape of one: a black suit that moves on its own, a red cloak, chains, green eyes._  
**Spawn** _(shock)_: Get back. Get— what did they do to me?  
_Your other Nubbin hides behind your legs. This one doesn’t. It crosses the wet ground and climbs into his lap._  
**Spawn** _(soft)_: …You’re not scared. Everything else ran. Even the rats ran.  
_It touches his mask, and the alley goes red._  
**Chapel**: Orders from the top, Al. You were growing a conscience. Can’t have that.  
_Fire. Falling. Then a voice so large it has no edges._  
**Malebolgia**: You burn beautifully, soldier. Do you want to see her again? Your Wanda? Sign, and I send you home.  
**Al Simmons** _(sad)_: Send me back. I don’t care what it costs. Just let me see her.  
_The red fades. A number glows in the corner of his eye, and ticks down by one._  
**Spawn**: A name. Wanda. And the man who shot me. That’s all I’ve got.  

#### Done `mv-sp01-alley-done`

_An old man by a burning barrel knows the face in the newspaper your Nubbin found._  
**Bobby**: Simmons. Army hero. Dead five years. Big funeral. The widow married his best friend.  
**Spawn** _(shock)_: Five years.  
**Bobby**: Nobody comes back from five years dead looking good, son. You look about right for it. Sit by the fire.  

### Step 2: Find Spawn somewhere safe to rest.

Hint: Back in the alley, give him a blanket from your Grove inventory. · check: `give:mv-spawn:blanket`

#### Scene `mv-sp01-wanda`

_A quiet street. A lit window. Inside: a woman with a warm laugh, a man in glasses, a little girl doing a jigsaw._  
**Spawn** _(sad)_: Terry. My best man. My best friend.  
**Spawn**: Five years, and she’s… she’s happy. She’s got a kid. Look at her.  
_He takes one step toward the gate. The suit ripples, like something hungry._  
**Spawn** _(angry)_: That thing said I’d see her. It never said I’d be this. I can’t even show her my face. I haven’t got one.  
_The number in his eye drops again. Just from wanting._  
**Your Nubbin** _(soft)_: Mm.  
_The little girl looks up at the window. She seems to look right at your Nubbin, and she smiles._  

**Choices**

- **Let him watch a while longer.** — sets `{"mv-sp-wanda":"watched"}`
    - **Spawn**: Just a minute. One more minute.
    - It is an hour before he moves. You don’t hurry him.
- **“Come away. This will only hurt.”** — sets `{"mv-sp-wanda":"walked-away"}`
    - **Spawn**: Everything hurts. But okay.
- **Let your Nubbin go and sit on the doorstep.** — sets `{"mv-sp-wanda":"doorstep"}`
    - Your Nubbin trots up the path and sits on the mat. The girl opens the door, giggles, and gives it a biscuit.
    - **Spawn**: That’s Wanda’s laugh. Coming out of a kid I’ll never know.

#### Done `mv-sp01-wanda-done`

_He settles under a tarp your Nubbin dragged over by itself, the blanket round his shoulders._  
**Spawn**: Never thought I’d be grateful for a blanket again.  

#### Complete `mv-sp01-complete`

**Spawn**: The folk out here call me the man in the cloak. Your little friend just calls me… whatever that noise is.  
**Your Nubbin**: Prrp.  
**Spawn** _(soft)_: Yeah. That.  
**Spawn** _(angry)_: Something put me here for a reason, Keeper. When I find out what, it’s going to regret it.  
**Spawn** _(think)_: I signed a deal in Hell. I know what that makes me. So why does the little one keep treating me like I’m not finished?  
_Your Nubbin falls asleep against his chain. Slowly, the chain stops moving._  
_He works one cold link loose and leaves it beside your Nubbin. A thank-you, from someone out of practice._  

**Rewards**

- Link of chain (item): A single cold link from Spawn’s chain. Your fearless Nubbin carries it everywhere.
- Not Afraid (title): Title: your Nubbin was the only one who didn’t run.

Sets on completion: `{"mv-sp01":true}`

**Notes:** Establishes the rule of the line: a Nubbin is the only creature not afraid of Spawn. Whichever Nubbin is in slot one is “the fearless one”; the other always hides. Spawn’s power counter is a HUD element shown in his portrait’s corner, starting at 9999 and ticking down when he uses or even reaches for power; it persists across SP1–SP8. The murder flashback is a red-tinted still sequence: Chapel’s silhouette, a flash, fire. No body. Malebolgia is a vast shape, never fully seen here. Wanda, Terry and Cyan are seen through a window only; they do not speak. Bobby is an original alley regular.

## SP2. The Clown

*Spawn #2–4 (1992)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After Al Simmons. · requires: SP1

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), The Clown (The Clown / Violator (Image Comics)), Violator (The Violator (Image Comics)), Tony Twist (Tony Twist (Image Comics))

### Step 1: Track Tony Twist’s men through the docks.

Hint: Expedition: the docks. A Swim Nubbin can scout the piers from the water. · check: `expedition:clear:mv-twist-docks`

#### Scene `mv-sp02-clown`

_Something short and paint-faced waddles down the alley, chewing on something that was once a pizza crust._  
**The Clown** _(happy)_: Well, well! The new guy! And he brought a pet dinner roll. Cute. Can I eat it?  
**Spawn** _(angry)_: Touch it and I’ll take you apart.  
**The Clown**: Ooh, temper. Love it. They call me the Clown. Downstairs sent me. Think of me as your career adviser.  
**The Clown**: Big man in town, Tony Twist. Owns the docks, owns the cops, did nasty things to nice people.  
**The Clown** _(happy)_: You should go and kill him. Loads. With fire.  
**Spawn**: Why do you care?  
**The Clown** _(happy)_: I’m a people person! Also I keep the books.  
_He pulls out a greasy little notebook. The first page says 9,999. It has been crossed out, and written lower, several times._  
_Your Nubbin, which fears nothing, takes one look at the Clown and growls. It has never growled before._  
**Spawn** _(think)_: It’s got better sense than me.  

**Choices**

- **“Don’t do what he wants.”** — sets `{"mv-sp-clown":"doubted"}`
    - **Spawn**: Twist still needs stopping. But I do it my way, not his.
    - **The Clown**: Your way, my way. All roads go downstairs, pal.
- **“Twist hurts people. Stop him.”** — sets `{"mv-sp-clown":"trusted"}`
    - **The Clown**: See? The Keeper gets it!
    - Your Nubbin keeps growling all the same.

#### Done `mv-sp02-clown-done`

_Your Swim Nubbin surfaces under a pier with a soggy shipping manifest. Twist’s warehouse, tonight._  
**Spawn**: Tonight, then.  

### Step 2: Help Spawn finish the fight without burning his power.

Hint: Karate against the Violator. Spawn’s counter drops whenever he strikes, so let your Nubbins do the hitting. · check: `karate:win:mv-violator:low-burn`

#### Scene `mv-sp02-war`

_The warehouse burns. Twist’s men scatter. Spawn stands in the middle of it, green fire pouring off his hands._  
_The number in his eye drops by hundreds a second._  
**Spawn** _(angry)_: Twist! Get out here!  
**Tony Twist**: You don’t scare me. I got men, I got guns, I got the mayor on speed dial.  
_A burning beam comes down across the doorway. Twist is on the wrong side of it. His men are already gone._  
**Tony Twist** _(shock)_: Hey! HEY! Somebody! I’ll pay! I’ll pay anybody!  
_Up on the roof, the Clown is watching. He has his little notebook out, and he is licking the pencil._  
**The Clown** _(happy)_: Eight thousand nine hundred and… ooh, there goes another hundred! Spend it, baby! Save the gangster! Costs extra!  
**You**: Spawn! The number. He wants you to run out.  
_The Clown’s grin widens, and keeps widening. Something huge and horned unfolds out of the little body._  
**Violator** _(angry)_: Clever Keeper. Doesn’t matter. Go in after the rat, or don’t. Either way, he’s ours eventually. So are you.  

**Choices**

- **Pull Twist out of the fire. Whatever it costs.** — sets `{"mv-sp-twist":"saved"}`
    - Spawn goes into the flames. The number drops five hundred in one breath. He comes out with Twist over his shoulder.
    - **Spawn**: Don’t thank me. Go and confess something. Take your time; there’s a lot.
- **“He lit it. Save your power for the demon.”** — sets `{"mv-sp-twist":"left"}`
    - Spawn turns his back on the doorway. Behind him, the shouting stops. The number holds.
    - **Spawn**: That was the right sum. Why doesn’t it feel like one?

#### Done `mv-sp02-war-done`

_The Violator folds back down into the Clown, wheezing, and waddles off into the smoke._  
_He drops the notebook as he goes. Your Nubbin picks it up and will not give it back._  

#### Complete `mv-sp02-complete`

**Spawn** _(think)_: He wasn’t steering me at Twist. He was steering me at the number.  
**Spawn**: Every time I lose my temper, Hell gets a little closer to having me back.  
_You flick through the Clown’s notebook. Page after page of numbers, each one lower. The last page says 0, with a smiley face._  
_Your Nubbin finally stops growling. It sits on his boot and looks up at him._  
**Spawn** _(soft)_: You knew straight off. Next time I’ll listen to you sooner.  
_He tears a strip from the red cloak. It wriggles, then settles, and curls round your Nubbin like a scarf._  

**Rewards**

- Living red scarf (cosmetic): A strip of Spawn’s cloak. It shifts slightly in a breeze that isn’t there, and keeps a Nubbin warm.
- Saw Through the Clown (title): Title: your Nubbin knew the Clown was a demon before anyone else did.

Sets on completion: `{"mv-sp02":true}`

**Notes:** The Clown is crude and foul (grubby, belching), but keep it to one gag per scene; no toilet humour on screen. The Violator reveal is the line’s first big horror beat: a slow unfold, silhouette against fire. mv-sp-twist: saved costs 500 off Spawn’s counter before the bout (it still has to be a low-burn win from there); left means Twist dies offscreen in the fire. Both are defensible and neither is scored: mercy for a murderer at the price of Al’s soul, or thrift with it. E3 may raise Twist among the dead if left. The Clown’s notebook (counter running gag) pays off in E3 when the counter finally reaches zero by Al’s own choice. The karate check scores Spawn’s counter loss; a low-burn win is required. Tony Twist’s issue numbers should be checked; the brief places him in #2–4.

## SP3. Overt-Kill

*Spawn #5–7 (1992–93)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After The Clown. · requires: SP2

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Overt-Kill (Overt-Kill (Image Comics)), Bobby

### Step 1: Get the alley folk clear while Spawn fights.

Hint: Lead three groups of sleepers out the back of the alley. Your fearless Nubbin can go anywhere; the other must stay near you. · check: `escort:mv-alley-folk:3`

#### Scene `mv-sp03-hunted`

_The rumours come down the alley before he does. The mob has bought itself a machine._  
_Footsteps that crack the paving. A huge man, more steel than skin, with gun barrels where his hands should be._  
**Overt-Kill**: Twist’s friends send their regards. They paid for the big gun. That’s me.  
**Overt-Kill**: Five million for your head, Hellspawn. Nobody said it had to stay in one piece.  
**Spawn**: People sleep here. Take it somewhere else.  
**Overt-Kill**: People? This lot?  
_He fires into the cardboard shelters. Somebody screams._  
_Spawn’s suit stops being a suit. It becomes chain and cloak and teeth, all moving at once._  
**Spawn** _(angry)_: You shouldn’t have done that.  
_Your Nubbin isn’t afraid of Spawn. But for the first time, it looks at you, as if asking whether it should be._  

#### Done `mv-sp03-hunted-done`

_Everyone’s out. Bruised, soaked, but out. Behind you the alley sounds like a foundry._  
**Bobby** _(soft)_: Kid. Whatever’s happening back there, he’s doing it for us. Remember that.  

### Step 2: Help Spawn bring the suit back under his control.

Hint: Sit with Spawn in the alley and pet him, as you would a Shadow Nubbin, until his trust passes 30. · check: `trust:mv-spawn:>30`

#### Scene `mv-sp03-rage`

_When you get back, the alley is a battlefield. Overt-Kill is down, sparks pouring from his chest._  
_The chains have him. The cloak is closing over him. The suit wants more, and Spawn is letting it._  
**Overt-Kill** _(shock)_: Okay! Contract’s off! It’s off!  
**Spawn** _(angry)_: It feels good, Keeper. That’s the worst part. It feels so good.  
_The number in his eye is racing down. He isn’t looking at it._  
_Your Nubbin walks into the middle of the chains. They part around it like water round a stone._  
**Your Nubbin** _(soft)_: Prrp.  
_Spawn looks down at it. The cloak hesitates._  

**Choices**

- **“Al. Come back.”** — sets `{"mv-sp-anger":"called-back"}`
    - At his own name the chains go slack. Overt-Kill drags himself off into the dark, leaking oil.
    - **Spawn**: …Al. Nobody’s called me that in five years.
- **Say nothing. Let it end.** — sets `{"mv-sp-anger":"let-go"}`
    - The cloak closes. When it opens again there is only scrap metal on the ground.
    - **Spawn**: Don’t look at me like that.
    - Your Nubbin looks at him the way it always does. Somehow that’s worse.

#### Done `mv-sp03-rage-done`

_It takes a long time. The chains quiet one link at a time. The cloak becomes a cloak again._  
**Spawn** _(think)_: The suit’s alive, isn’t it. And it’s hungry. And it likes me angry.  

#### Complete `mv-sp03-complete`

**Spawn** _(think)_: First time I let it all out. Now I know what’s in there.  
**Spawn**: Every time I get angry, I spend. And I give the suit a little more of me.  
_He looks at your Nubbin, still sitting where the chains were thickest._  
**Spawn** _(soft)_: Stay close, will you? It behaves better when you’re around.  
**Spawn** _(think)_: Question, Keeper. If I do something good with Hell’s own power, does it count? Or does Hell get the credit?  
**Bobby**: Counts to us, son. We were the ones under the cardboard.  
_Bobby and the alley folk drag a barrel back into place and light it. They save Spawn a spot by the fire._  

**Rewards**

- Alley barrel fire (decor): A dented oil drum with a fire in it, for the Grove. Nubbins huddle round it on cold nights.
- Calm in the Storm (title): Title: your Nubbin walked into the chains and they let it through.

Sets on completion: `{"mv-sp03":true}`

**Notes:** The first full-power fight. Show the suit’s transformation as shape and motion (chains, cloak, glowing eyes), not wounds. Overt-Kill’s defeat is mechanical damage only: sparks, oil, scrap. Whether he survives depends on `mv-sp-anger`. The trust step reuses the Shadow Nubbin trust meter on a Spawn NPC; it rises with sitting and petting and drops if the player leaves. Big counter drop (2000+) during the rage scene.

## SP4. Angela

*Spawn #9 (1993)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After Overt-Kill. · requires: SP3

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Cogliostro (Cogliostro (Image Comics)), Angela (Angela (Spawn))

### Step 1: Learn from Cogliostro how to hold Spawn’s power back.

Hint: A training bout: win three rounds while Spawn’s counter stays exactly where it is. · check: `karate:win:mv-cog-training:no-burn`

#### Scene `mv-sp04-cog`

_A cemetery at midnight. An old man with a long white beard sits on a gravestone, peeling an orange._  
**Cogliostro** _(soft)_: The Keeper. And the brave one. Sit, little thing. You’ve earned it.  
**Spawn**: You’ve been following me for weeks, old man. Talk.  
**Cogliostro**: You’re not the first, Simmons. Hell makes soldiers. Thousands of them, over thousands of years. Hellspawn.  
**Cogliostro**: Each one trades their soul for someone they loved. Each one burns their power on revenge, and goes back down an officer.  
**Spawn**: Officer of what?  
**Cogliostro** _(think)_: Hell’s army. For the last war: Heaven against Hell, with this world for a battlefield.  
**Spawn**: And you? What are you?  
**Cogliostro**: A Hellspawn who never went back. Old. Careful. Very good at saving.  
**Spawn**: So that’s it. I’m damned. Signed and sealed.  
**Cogliostro** _(think)_: Damned is a direction, Simmons, not an address. You can walk the other way. Slowly. Uphill. Mostly in the dark.  
_Your Nubbin takes a segment of orange from him. He smiles at it as if they’re old friends._  
**Cogliostro**: Spend nothing you don’t have to. Every drop you keep is a drop Hell can’t spend.  

#### Done `mv-sp04-cog-done`

_Three rounds. The number in Spawn’s eye doesn’t move once._  
**Cogliostro**: Good. Now you know you can. That’s half of it.  

### Step 2: Drive Angela off without Spawn burning his power.

Hint: Karate against Angela. She is fast; a Run Nubbin dodges while a Fly Nubbin strikes from above. · check: `karate:win:mv-angela`

#### Scene `mv-sp04-angela`

_Light splits the sky over the cemetery. Someone comes down out of it: armoured, red-haired, laughing, with a spear._  
**Angela** _(happy)_: There you are. A fresh one. I’ve hunted your kind for centuries and I do love a new face. Oh. You haven’t got one.  
**Angela**: I’m Angela. Heaven pays by the head. Hold still.  
**Spawn** _(shock)_: Heaven? I thought you lot were the good guys.  
**Angela**: Good is a department, darling. I work in collections.  
**Cogliostro**: She takes trophies, Simmons. The ones she’s finished with don’t stay dead. They just stay broken.  
_The spear comes down. Your Nubbin is already standing between them._  
**Angela** _(think)_: …Is that a Nubbin? Out of its own world?  
**Angela**: Move, little one. You’re not on my list.  

**Choices**

- **Keep the Nubbin where it is.** — sets `{"mv-sp-angela":"stood"}`
    - The spear stops a hand’s width from your Nubbin’s nose. Your Nubbin doesn’t blink.
    - **Angela**: Brave. Or stupid. Where I come from those are filed together.
- **“Spawn, don’t spend it. Let us fight.”** — sets `{"mv-sp-angela":"saved-power"}`
    - **Spawn**: …Okay. Your way.
    - **Cogliostro**: Good. He listens to someone at last.

#### Done `mv-sp04-angela-done`

_Angela pulls back into the air, bleeding light. She looks more curious than angry._  
**Angela** _(think)_: You’re more interesting than the others, Simmons. That’s never good for anyone.  

#### Complete `mv-sp04-complete`

**Cogliostro**: Heaven’s hunter, Hell’s soldier, and between them a cemetery and a small round thing. A fine start.  
**Spawn**: Start of what?  
**Cogliostro** _(think)_: Of deciding whose side you’re on. Here’s a secret: it doesn’t have to be either.  
_Angela’s spear left a gold splinter in a headstone. Your Nubbin works it loose and won’t give it up._  
_Far off, in another world, a man in a white cloak looks up from a rooftop. He has heard there are hunters in the sky._  

**Rewards**

- Gold spear splinter (item): A sliver of Angela’s spear. It hums faintly when anything from Heaven or Hell is near.
- Between Heaven and Hell (title): Title: you stood between a Hellspawn and Heaven’s hunter.

Sets on completion: `{"mv-sp04":true}`

**Notes:** Unlocks MK7 (The Midnight Mission): the last narration line is the hand-off, and should cut briefly to the Moon Knight rooftop. Angela is flippant and dangerous; her trophies are described, never shown. Cogliostro is warm and evasive; his true identity (Cain) is SP8’s reveal, so give him no lines that confirm it here. The training bout fails on any counter change.

## SP5. Wynn and Chapel

*Spawn #10–20 (1993–94)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After Angela. · requires: SP4

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Jason Wynn (Jason Wynn (Image Comics)), Chapel (Chapel (Image Comics)), Terry (Terry Fitzgerald (Image Comics))

### Step 1: Steal Jason Wynn’s files on the Simmons killing.

Hint: Expedition: Wynn’s tower, stealth route. A Fly Nubbin through the vents avoids the guards. · check: `expedition:clear:mv-wynn-tower:stealth`

#### Scene `mv-sp05-wynn`

_A glass tower in Washington. Jason Wynn’s floor has no name on the lift buttons._  
**Spawn** _(sad)_: Terry works here. Did you know that? My best friend does Wynn’s books.  
**Spawn**: Wynn gave the order. Chapel pulled the trigger. Tonight I find out why.  
_Your Fly Nubbin finds an air vent. Your other Nubbin finds the biscuit tin on the secretary’s desk._  
_Through the vent you hear Wynn on the phone, calm as a weather forecast._  
**Jason Wynn**: Simmons is a closed file. Chapel handled it. If anyone asks, he died a hero. Heroes don’t testify.  
**Jason Wynn**: And watch Fitzgerald. He’s been reading things he shouldn’t.  
**Spawn** _(shock)_: Terry. He’s going after Terry next.  
_The number flickers in the dark. Every second Spawn stays hidden in shadow costs him._  

#### Done `mv-sp05-wynn-done`

_A grey folder, stamped and redacted, slides out of the vent in your Nubbin’s mouth._  
**Spawn** _(angry)_: Every page has my name on it. And not one page has the truth.  

### Step 2: Get the files to Terry before Wynn’s men do.

Hint: Race the City course; a Run Nubbin carries the folder. · check: `race:finish:mv-city`

#### Scene `mv-sp05-chapel`

_A shooting range outside the city. A big man in white face paint is reloading, alone._  
**Chapel** _(shock)_: Simmons? No. Simmons is in the ground. I put him there.  
**Spawn**: You put me somewhere a lot worse.  
**Chapel** _(think)_: Funny thing. I’ve got friends downstairs too. Wynn’s not the only one who makes deals.  
**Chapel**: When I go, I go with a job waiting. Same as you.  
**Spawn** _(angry)_: Then let’s get you started.  
_Green fire gathers in Spawn’s hand. The number drops, and keeps dropping, and he doesn’t care._  
**You**: Al. Look at the number.  
_It’s low. Lower than you’ve ever seen it. One more blast and there won’t be enough left to walk home on._  
**Chapel**: Go on. Spend it. Downstairs is counting on you.  

**Choices**

- **“That’s what Hell wants. Don’t give it to them.”** — sets `{"mv-sp-revenge":"held"}`
    - The fire gutters out. Chapel laughs. Spawn lets him.
    - **Spawn**: Laugh. You’ll be downstairs long before me.
- **“The files will finish Wynn. Take them to Terry.”** — sets `{"mv-sp-revenge":"files"}`
    - **Spawn**: Terry. If he knows what Wynn did, he can do what I can’t. He can do it in the open.
    - Spawn turns his back on Chapel. It costs him more than the fire would have.

#### Done `mv-sp05-chapel-done`

_Your Run Nubbin skids up a front path and drops the folder on the mat. The door opens._  
**Terry** _(shock)_: Where did you come from? And… who sent this?  

#### Complete `mv-sp05-complete`

_Terry stands on the step reading, the folder shaking a little in his hands._  
_Across the street, under a broken lamp, a shape in a red cloak watches and does not come closer._  
**Terry** _(sad)_: Whoever you are out there. Thank you. Al deserved better.  
**Spawn** _(soft)_: He doesn’t even know he’s talking to me.  
**Spawn**: Revenge was going to cost everything I’ve got. This only cost a little. I can live with a little.  
**Spawn** _(think)_: Maybe that’s how you climb out of a hole. Not one big thing. A lot of small honest ones, done in the dark.  
_Behind Terry, a little girl peers round the door at your Nubbin. It is the girl from the window. She waves. It waves back._  
_Your Nubbin keeps a torn page from the folder, the one with Al’s old photograph on it._  

**Rewards**

- Al’s photograph (item): A torn page from Wynn’s file with Al Simmons’ old service photo. Spawn asked you to keep it safe.
- Unfinished Business (title): Title: you helped a dead man choose not to spend himself on revenge.

Sets on completion: `{"mv-sp05":true}`

**Notes:** Wynn and Chapel both survive this storyline, as in the source; revenge is deliberately left incomplete. Show Spawn’s counter dangerously low in the Chapel scene (red, pulsing). Chapel’s “friends downstairs” foreshadows his own deal with Hell. Terry’s role as Wynn’s employee should be checked against #10–20.

## SP6. The Death of Malebolgia

*Spawn #100 (2000)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After Wynn and Chapel, once the road into Mephisto’s realm is open (FF7). · requires: SP5, FF7

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Cogliostro (Cogliostro (Image Comics)), Angela (Angela (Spawn)), Malebolgia (Malebolgia (Image Comics))

### Step 1: Cross Mephisto’s border into Malebolgia’s pit.

Hint: Expedition: the Hell road. The heat drains stamina; a Swim Nubbin handles it best. · check: `expedition:clear:mv-hell-road`

#### Scene `mv-sp06-road`

_The road Doom and Strange cut into Mephisto’s realm is still there: a scar of cold blue fire across the red._  
**Cogliostro** _(think)_: Mephisto’s border. Past it, Malebolgia’s pit. Doom left the door open. Doom never shuts anything behind him.  
**Angela**: I’m coming. Don’t argue. Heaven has wanted that worm dead since before your grandparents were born.  
**Spawn**: Heaven wants him dead so it can win its war. I want him dead so it stops. Not the same.  
**Angela**: Same spear, though.  
_Your Nubbin walks to the edge of the road. Below, fire stretches farther than you can see. It isn’t afraid of that either._  
**Spawn**: Keeper. This place eats things. If it goes bad, take the little ones and run. Don’t wait for me.  
**Cogliostro**: Watch the number, Simmons. Down here it ticks twice as fast.  
_Far off, on a black throne, something vast and pale shifts its weight, and the whole of Hell shifts with it._  

**Choices**

- **“We go together, or not at all.”** — sets `{"mv-sp-hell":"together"}`
    - **Spawn**: Stubborn. Both of you. Fine.
- **“If it goes bad, I’ll run. I promise.”** — sets `{"mv-sp-hell":"promised"}`
    - **Spawn**: Good. Somebody should get out of this in one piece.
    - Your Nubbin, who heard none of the promise, has already started down the road.

#### Done `mv-sp06-road-done`

_The blue road ends at a cliff of black glass. Below it, the pit. In the pit, the throne._  
**Angela**: There he is. Ugly as ever.  

### Step 2: Fight Malebolgia beside Spawn and Angela.

Hint: A long karate bout in three phases. Spawn’s counter is allowed to fall here; what matters is not losing a Nubbin’s stamina to zero. · check: `karate:win:mv-malebolgia`

#### Scene `mv-sp06-pit`

**Malebolgia** _(happy)_: My soldier comes home. And he brings gifts: Heaven’s hunter, and a little warm thing. How thoughtful.  
**Spawn** _(angry)_: I’m not your soldier.  
**Malebolgia**: You are made of me, Simmons. Every thread of that suit is mine. Every hour since the fire, I paid for.  
**Malebolgia**: Sit at my feet, and I will let the hunter go back to her clouds.  
**Malebolgia**: And I will tear up your contract. Your soul, given back clean. When you die properly, you go wherever she goes.  
**Spawn** _(sad)_: …Wanda.  
**Angela** _(angry)_: He’s lying, Simmons. And don’t you dare bargain for me.  
_Your Nubbin looks up at the thing on the throne. It is the size of a cathedral. Your Nubbin is the size of a loaf._  
_It sits down, squarely, in front of Spawn’s boots._  
**Malebolgia** _(think)_: What is that?  
**Spawn**: That’s the only thing in two worlds that isn’t scared of me. And it isn’t scared of you either.  
**Spawn** _(angry)_: A clean soul you hand me isn’t clean. Keep it. I’ll earn mine or go without.  

#### Done `mv-sp06-pit-done`

_Angela’s spear goes deep. Malebolgia closes his hand around her. Spawn goes up the arm, and the number runs toward zero._  
_Malebolgia falls. Slowly, then all at once. The pit goes quiet for the first time in a thousand years._  
_Angela lies on the black stone. Your Nubbin presses against her side, keeping her warm._  
**Angela** _(soft)_: Heaven’s finest, and the last thing I see is a Nubbin. Tell my lot… no. Tell them nothing.  
_Her light goes out._  

### Step 3: Leave the pit with Spawn.

Hint: Retrace the Hell road on the Expedition map; it is shorter on the way out. · check: `expedition:clear:mv-hell-road:return`

#### Scene `mv-sp06-crown`

_The demons of the pit come out of the walls. Thousands of them. They kneel._  
_Behind Malebolgia’s body stands his throne: empty, enormous, and still warm._  
**Cogliostro** _(think)_: They’re waiting, Simmons. You killed the king. By Hell’s law, that makes you the king.  
**Spawn**: Hell’s law.  
**Cogliostro**: With that seat you’d command the army. You could march it anywhere. Even up.  
**Spawn** _(sad)_: Wanda’s alive up there. Angela’s dead down here. And they want me in his chair.  
_Your Nubbin climbs onto the arm of the throne, looks around, and climbs back down, unimpressed._  
**Spawn**: Yeah. Me too.  

**Choices**

- **“You don’t owe them anything. Walk away.”** — sets `{"mv-sp-throne":"refused"}`
    - **Spawn**: I’m walking.
    - The kneeling demons watch him go. Not one of them dares follow.
- **“Take Angela home first.”** — sets `{"mv-sp-throne":"refused","mv-sp-angela-carried":true}`
    - Spawn lifts her. She weighs almost nothing now.
    - He carries her the whole way back up the road and never once looks at the throne.

#### Done `mv-sp06-crown-done`

_The blue road burns behind you as you climb. At the top, ordinary night air._  
**Cogliostro** _(think)_: Hell has no king tonight.  

#### Complete `mv-sp06-complete`

_You come out under an ordinary sky. It has never looked so good._  
**Cogliostro**: You turned down Hell. Most men would have sat in the chair “just for a minute”.  
**Spawn**: I’m not most men. I’m barely a man.  
**Spawn** _(sad)_: She came down there for me, Keeper. Heaven’s hunter. She didn’t have to.  
_Your Nubbin lays a single flower at the mouth of the road, where the blue fire still burns._  
_Hell has no king. Somewhere above Hell, someone finds that very convenient._  

**Rewards**

- Angela’s spear (decor): Planted point-down by the waterfall as a memorial. It glows faintly gold at dusk.
- Refused the Crown (title): Title: you walked out of Hell beside the man who wouldn’t rule it.

Sets on completion: `{"mv-sp06":true,"mv-sp-malebolgia":"dead"}`

**Notes:** Needs FF7: the entry road is the one Doom and Strange opened in Triumph and Torment; reuse its blue-fire art. Angela dies here, as in #100 (verify). Her death is quiet and dignified, a fade of her light, nothing graphic. Malebolgia’s death is shown as a fall, not a wound. The throne scene is the line’s turning point; hold on the empty throne before the choice. Spawn’s counter should end this storyline very low; SP7 opens with it barely recovered.

## SP7. The Redeemer

*Spawn #16–18 (1994), the first Redeemer, and the later Redeemers* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After The Death of Malebolgia. · requires: SP6

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), The Redeemer (The Redeemer (Spawn))

### Step 1: Survive the Redeemer’s first attack.

Hint: Karate: the Redeemer’s light blinds. Strike in the gaps between flashes. · check: `karate:win:mv-redeemer`

#### Scene `mv-sp07-light`

_At three in the morning the sky over the alley goes white. The alley folk cover their eyes._  
_A figure lands: white and gold armour, wings of light, a face hidden behind a shining helm._  
**The Redeemer**: Al Simmons. I am the Redeemer. Not the first one. Heaven sends me to end you, and the thing you wear.  
**Spawn**: Heaven. Again. You lot need a hobby.  
**The Redeemer**: Your soul belongs to the Pit. Better it burns clean than marches in Hell’s army.  
**Spawn**: I quit Hell’s army. I left it without a king. Didn’t anyone tell you?  
**The Redeemer** _(think)_: Hell without a king is Hell waiting for a new one.  
_Your Nubbin, who has never once been afraid of Spawn, looks up at the Redeemer and backs away._  
**Spawn** _(think)_: Huh. The little one’s never scared. What did they do to you?  

#### Done `mv-sp07-light-done`

_The Redeemer stumbles back into the air, one wing guttering. A drop of blood falls on the pavement. Plain red._  
**Spawn** _(think)_: Angels don’t bleed like that. People do.  

### Step 2: Get the Redeemer clear before Heaven sends someone else.

Hint: An escort run across the City course before dawn. A Fly Nubbin watches the sky. · check: `escort:mv-redeemer:before-dawn`

#### Scene `mv-sp07-truth`

_You find him at dawn in a ruined church, helm off. Under it is an ordinary, tired man._  
**The Redeemer** _(sad)_: I was dying in a hospital bed. A voice said: serve, and you will live.  
**Spawn** _(think)_: …Same offer. Different address.  
**The Redeemer**: They told me Hellspawn were monsters. They didn’t say I’d be sent after a man who sleeps in an alley with a Nubbin.  
**The Redeemer** _(sad)_: The things they’ve had me do. Towns they let burn because the burning suited the war.  
**Spawn** _(angry)_: So Heaven makes soldiers too. Takes dying people and turns them into weapons.  
_Your Nubbin, which backed away from the armour, walks up to the man without it and sits beside him._  
**The Redeemer** _(sad)_: Is there a way back? For men like us. Men who said yes to the wrong voice.  
**Spawn**: Ask me in a hundred years. I’m still on the road. It’s long, and nobody hands out maps.  
**The Redeemer**: When I go back without your head, they’ll take it all away. The life. Everything.  

**Choices**

- **“Then don’t go back.”** — sets `{"mv-sp-redeemer":"deserted"}`
    - **The Redeemer**: Desert Heaven. I never knew that was a choice.
    - **Spawn**: There’s always a choice. They just don’t print it on the forms.
- **“Go back. Tell them what you saw.”** — sets `{"mv-sp-redeemer":"witness"}`
    - **The Redeemer**: They won’t listen.
    - **Spawn**: Then someone up there will remember you said it. That counts for something.

#### Done `mv-sp07-truth-done`

_The sun comes up. No more lights in the sky. Not yet._  
**The Redeemer** _(soft)_: Thank you. Both of you. All three of you.  

#### Complete `mv-sp07-complete`

**Spawn** _(angry)_: Hell made me a weapon and lied to me. Turns out Heaven runs the same shop with better lighting.  
**Spawn**: Neither of them gets me. I don’t care what they offer.  
_Your Nubbin finds a piece of the Redeemer’s armour in the gutter: a curved plate of gold, dented, gone dull._  
**Spawn**: Keep it. Reminder that the shiny ones lie too.  
**Spawn** _(think)_: They called him the Redeemer. Nobody gets redeemed by being bought twice. You walk out of it on your own feet, or not at all.  

**Rewards**

- Dull gold plate (item): A dented piece of the Redeemer’s armour. The shine went out of it when he took the helm off.
- Neither Side (title): Title: you learned that Heaven’s hands are not clean either.

Sets on completion: `{"mv-sp07":true}`

**Notes:** The Nubbin backing away from the Redeemer is deliberate: the one thing it fears is Heaven’s weapon, not Hell’s. Play a short whimper sound. This is a later Redeemer, after Malebolgia’s death; the role first appears in Spawn #16–18, and “Not the first one” nods to that. He is unnamed here. Several men wear the role across the comics (one of them Jason Wynn); check before naming. Burning towns are reported, not shown.

## SP8. Mammon and Cain

*Spawn #150–164 (2005–07)* · audience: adult · where: Multiverse: the rift above the waterfall (Spawn’s world) · when: After The Redeemer. · requires: SP7

**Cast:** Your Nubbin, Spawn (Al Simmons / Spawn (Image Comics)), Cogliostro (Cogliostro (Image Comics)), Mammon (Mammon (Image Comics))

### Step 1: Find Cogliostro.

Hint: He isn’t at the cemetery. Search the Expedition map; your fearless Nubbin can follow his scent. · check: `expedition:clear:mv-cog-search`

#### Scene `mv-sp08-mammon`

_The alley is cold, colder than it should be. A thin man in a very good suit waits by the barrel fire._  
**Mammon**: Mr Simmons. A pleasure. You know my work, though not my name. I am Mammon.  
**Mammon** _(happy)_: Malebolgia was a manager. Middle management. I hired him, and I let you remove him once he stopped being useful.  
**Spawn** _(angry)_: You set me up to kill him.  
**Mammon** _(think)_: I set everyone up. It’s my job. It is, if you think about it, the only job.  
**Mammon**: The war is coming, Al. Heaven and Hell, here, on your dirty little Earth. I’d like you on the winning side. Mine.  
_Your Nubbin isn’t afraid of Mammon. It simply won’t go near him, the way it won’t go near spoiled fruit._  
**Mammon**: And do ask your old friend Cogliostro who he really is. He’s been lying to you longer than I have. Much longer.  
**Spawn**: …What does that mean?  
**Mammon** _(happy)_: It means “ask him”. But business first. There’s a signing bonus.  
**Mammon**: A face. Your own. Wanda’s kitchen at eight, the radio on, and five years that never happened. Nobody remembers the funeral.  
**Spawn** _(shock)_: …You can do that?  
**Mammon**: I can do anything that can be bought. You would be astonished what can be bought.  

**Choices**

- **Ask Mammon what it costs.** — sets `{"mv-sp-mammon":"asked"}`
    - **Mammon**: Nothing you would miss. Only everybody else.
    - **Spawn**: There it is. There’s always a “there it is”.
    - **Mammon**: Think it over, Al. The kitchen will keep. Good evening.
- **“No. Al Simmons isn’t for sale twice.”** — sets `{"mv-sp-mammon":"refused"}`
    - **Mammon**: Twice is when the price goes up, Keeper. That cuts both ways. Good evening.
    - **Spawn**: You answered for me.
    - **Spawn**: Good. I was taking too long.

#### Done `mv-sp08-mammon-done`

_Your Nubbin leads you out of the city by the smell of oranges, to a hill above an empty field._  
**Spawn**: He’s waiting for us. He knew we’d come.  

### Step 2: Stand ready with Spawn for the war Mammon promised.

Hint: Bring both your Nubbins to the alley and talk to Spawn. They will be needed in Armageddon. · check: `talk:mv-spawn:ready`

#### Scene `mv-sp08-cain`

_Dusk. The old man sits beside a field that has been ploughed and left empty._  
**Cogliostro** _(sad)_: Mammon found you. I’m sorry. I hoped to tell you myself. I’ve hoped that for a very long time.  
**Spawn**: Who are you?  
**Cogliostro** _(sad)_: My first name was Cain. I worked a field like this one. I had a brother who kept sheep.  
**Cogliostro**: I killed him. The first death by a human hand. Everything since has been me trying to stop where that led.  
**Cogliostro** _(think)_: Using you, Simmons. Using others before you. I am not so different from Mammon.  
**Spawn** _(angry)_: You trained me. You told me to save my power. Was that for me, or for your plan?  
**Cogliostro** _(sad)_: Both. It is always both, Al.  
_Your Nubbin looks at him for a long time. Then it gives him back a segment of orange, from the bag he once shared._  
**Cogliostro** _(soft)_: …Thank you, little one.  

**Choices**

- **“He saved you more often than he used you.”** — sets `{"mv-sp-cain":"forgiven"}`
    - **Spawn**: Maybe. I’ll think about it. That’s more than Mammon gets.
    - **Cogliostro**: That is more than I hoped for.
- **“You don’t owe him anything.”** — sets `{"mv-sp-cain":"unforgiven"}`
    - **Spawn**: No. I don’t.
    - **Cogliostro**: That’s fair. I’ll be here when you need me, all the same.

#### Done `mv-sp08-cain-done`

_Back in the alley, both your Nubbins settle by the barrel fire. Spawn makes room for them._  
**Spawn**: Whatever’s coming, we meet it here.  

#### Complete `mv-sp08-complete`

_The alley before dawn. Spawn sits on an upturned crate, chains quiet, your Nubbin asleep against his boot._  
**Spawn** _(think)_: Heaven used me. Hell used me. The man I trusted most is the first killer in the book.  
**Spawn**: And the only one who never wanted a thing from me is the size of a loaf of bread.  
**Spawn** _(sad)_: Mammon offered me Wanda’s kitchen. I can still smell it. That’s the trouble with Hell. It knows your address.  
**Your Nubbin**: Prrp.  
**Spawn** _(soft)_: When the war comes, I’m not picking a side, Keeper. I’m picking this alley. And you lot.  
_High above, the sky begins to split: light on one side, fire on the other._  

**Rewards**

- A Hellspawn’s Friend (title): Title: you stayed beside Al Simmons from the alley to the edge of the last war.
- Spawn line complete (flag): All eight Spawn storylines are done. Counts toward Armageddon.

Sets on completion: `{"mv-sp08":true,"mv-sp-complete":true}`

**Notes:** Completes the Spawn line. Mammon is polite, amused and never raises his voice; he is the line’s real villain and E3’s opening threat. Mammon’s offer (a face, Wanda, five erased years) is the line’s sharpest temptation; mv-sp-mammon (asked | refused) is cosmetic but E3’s Herald echoes it. The Cain reveal is quiet: an empty ploughed field, dusk, no flashback of the first murder. The final narration line leads directly into E3 Armageddon (the sky splitting). Verify issue range for the Mammon and Cain reveals.
