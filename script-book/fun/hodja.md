# Fun quests: Nasreddin Hodja (Q86–Q95)

## Q86. Riding Backwards

*Nasreddin Hodja tales: the rider who faces the tail (Borrow, 1884, for the left-handed horse)* · audience: all · where: The lane by the pond, on an afternoon · when: once Chapter 3 is done (never during Chapters 9–11)

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Byte

### Step 1: Help the Hodja down from his donkey.

Hint: Tap the Hodja on his donkey by the pond, then tap Do it in the Journal. He’ll get down eventually. Possibly forwards. · check: `talk:hodja:dismount`

#### <a id="q86-intro"></a>Scene `q86-intro`

_A grey donkey plods up the lane with a crowd of valley children trailing behind. Its rider sits facing the tail._  
_He has a round white turban the size of a cartwheel. He nods to you politely, which from that angle means nodding at the lane._  
**Byte**: Excuse me. You’re on backwards.  
**The Hodja** _(happy)_: I am not. The donkey is.  
_The donkey considers this and brays. It sounds like a door being opened by someone with opinions._  
**You**: Where have you come from?  
**The Hodja**: Akşehir. Also Bukhara. Also wherever you like, I am not fussy.  
**The Hodja** _(think)_: Now, help me down, please. It is not my fault, but the horse’s, for the horse is left-handed.  
**Byte**: That’s a donkey.  
**The Hodja** _(happy)_: Then it is doubly his fault.  

**Choices**

- **Offer him your arm.**
    - **The Hodja**: A good arm. Sturdy. I will remember it, in case I need another.
- **Why do you ride backwards?**
    - **The Hodja**: I am a teacher. A teacher should not turn his back on his pupils.
    - The children grin. One of them has clearly heard this before and mouths it along with him.

#### <a id="q86-down"></a>Done `q86-down`

_He lands on both feet, wobbles, and pats his turban back into the middle of his head._  
**The Hodja** _(happy)_: Thank you. The ground is exactly where I left it. That is very reassuring.  

### Step 2: Give the donkey water and a place under the big tree.

Hint: The donkey wants water and shade. Tap Do it in the Journal; your Nubbin cups the water. The donkey has opinions about cups. · check: `give:item:water:hodja-donkey`

#### <a id="q86-water"></a>Scene `q86-water`

**The Hodja**: He has walked a long way for a donkey who is only carrying a man and a few opinions.  
_The donkey looks at the pond, and your Nubbin looks at the donkey, and a friendship begins on the spot._  
**The Hodja** _(soft)_: If there is water and a patch of shade, we may stay a while. A tree like that deserves a class.  
**You**: You want to teach under the big tree?  
**The Hodja**: I want to sit under it. The teaching will follow. It always does, like the donkey.  

#### <a id="q86-drank"></a>Done `q86-drank`

_The donkey drinks for a long time and then stands in the shade with its eyes half closed._  
_Your Nubbin climbs up on its back, facing the tail, and nobody objects._  

### Complete

#### <a id="q86-complete"></a>Complete `q86-complete`

_The Hodja spreads his coat on the roots of the big tree and sits down. The valley children settle around him like ducklings._  
**The Hodja**: Whoever wishes to learn something may sit. Whoever wishes to learn nothing may sit as well. The tree is wide.  
_By the evening he has already contradicted himself twice, and the children are delighted._  
**Byte**: Does he always do that?  
**The Hodja** _(happy)_: Only when I am awake.  
_The donkey stays tied beside the pond. Your Nubbin visits it first thing every morning._  

**Rewards**

- Backwards Riding (feature): Your Keeper can sit facing the tail on any rideable.

**Learning Grove swaps**

- `q86-intro#7` → Please help me down. It is not my fault. The donkey is left-handed.

**Notes:** The Hodja (big round turban, long robe) rides the grey donkey facing the tail; the donkey is a new rideable with a bray. Valley children trail behind in a loose line. After the quest the Hodja sits under the big tree by the pond and the donkey is tied beside the pond. Feature: Keeper "sit backwards" toggle on every rideable. The Borrow quote is kept verbatim ("horse"); Byte corrects it to donkey, which is the joke.

## Q87. Eat, My Coat, Eat!

*Nasreddin Hodja tales: the feast and the fur coat (Borrow, 1884, "my pelisse")* · audience: all · where: The Harvest Supper tables (autumn) · when: once the one before it is done (never during Chapters 9–11) · requires: Q86

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Byte

### Step 1: Notice the Hodja at the Harvest Supper and decide what to do.

Hint: Talk to the Hodja at the edge of the Supper tables. · check: `talk:hodja:supper`

#### <a id="q87-intro"></a>Scene `q87-intro`

_The Harvest Supper is in full swing. Lanterns, long tables, the good bowls, the big pots of soup._  
_The Hodja arrives straight from digging, in his old patched coat. Nobody offers him a seat or a bowl._  
**Byte**: Is it me, or is everyone suddenly very interested in their soup?  
**The Hodja** _(soft)_: Do not trouble yourself. The soup is very interesting.  
_He stands at the end of the bench and waits, as politely as a man can wait with mud on his knees._  

**Choices**

- **Give him your own seat and bowl.** — sets `{"q87-gift":"seat"}`
    - **The Hodja**: You are a good host. I will remember your bowl.
    - He sits down. A few people look at their spoons.
- **Fetch him a cleaner coat from your cottage.** — sets `{"q87-gift":"coat"}`
    - **The Hodja**: A coat! It is kind of you. I will look after it very well.
    - You run to the cottage and back. He puts it on over his own, which makes him look rather round.
- **Wait and see what he does.** — sets `{"q87-gift":"watch"}`
    - **The Hodja**: Ah. A patient friend. That is also a gift.
    - You stay where you are. Your Nubbin looks at you rather hard.

#### <a id="q87-slipout"></a>Done `q87-slipout`

_The Hodja slips out of the lantern light and is gone for some time._  
_When he comes back, he is wearing a magnificent fur coat. The whole table stands up._  

### Step 2: Watch what the Hodja does with his soup.

Hint: Sit near the top of the table, then tap Do it in the Journal and watch the coat eat. · check: `watch:hodja:feed-coat`

#### <a id="q87-feast"></a>Scene `q87-feast`

_Now he is led to the top of the table at once. Someone pulls out a chair, and someone else brings a bowl with a flourish._  
**The Hodja** _(happy)_: Thank you. This is a lovely supper.  
_He dips the sleeve of the fur coat into the soup. Then he lifts a piece of bread and holds it to the collar._  
**The Hodja** _(happy)_: Eat, my coat, eat!  
_The table goes quiet._  
**The Hodja** _(think)_: Welcome, my pelisse, please to eat, my lord.  
**The Hodja** _(soft)_: It was my coat that was invited. I only came along to carry it.  
_Nobody says anything. Then Byte starts to laugh, and it spreads down the table, and some people look at their shoes._  

#### <a id="q87-laughed"></a>Done `q87-laughed`

_The mayor gets up and offers him a proper seat, a proper bowl and, after a pause, an apology._  
**The Hodja** _(happy)_: Thank you. The coat accepts it. I am only here for the soup.  

### Complete

#### <a id="q87-complete"></a>Complete `q87-complete`

_By the end of the Supper the old patched coat is back on his shoulders and the fur one has gone to sleep on a bench._  
**The Hodja**: You see? A fine coat is welcome at any table. A fine man in an old coat has to be introduced.  
**Byte**: I think we’ve all been introduced now.  
**The Hodja** _(happy)_: Excellent. Next time I will not need the fur at all. Probably.  
_He hands you the digging coat to mend, and then, after a look at your face, hands you a tiny pair of patches too._  

**Rewards**

- Patched Digging Coat (cosmetic): The Hodja’s old digging coat, patched at both elbows. A cosmetic for your Keeper.

**Learning Grove swaps**

- `q87-feast#3` → Eat up, coat! Everyone was so pleased to see you.
- `q87-feast#5` → Eat up, coat! Everyone was so pleased to see you.

**Notes:** The choice sets q87-gift (seat | coat | watch), a cosmetic, quest-prefixed flag that only Q91 and Q95 read (see QUESTS_HODJA_VARIANTS). If the choice is skipped, treat q87-gift as "watch". Staging: lanterns, long tables, an old patched coat and a magnificent fur coat that the Hodja fetches off-screen (cut away; no tailor scene). Q87 plays only at the Harvest Supper (autumn). Reuse "Eat up, coat!" only once in the Learning Grove (the second line is a duplicate childLine on purpose so the Borrow line is never shown to children).

## Q88. Whom Do You Believe?

*Nasreddin Hodja tales: the lent donkey that is "out" (Borrow, 1884)* · audience: all · where: The big tree by the pond, when you are carrying a heavy load of fruit · when: once the one before it is done (never during Chapters 9–11) · requires: Q87

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia))

### Step 1: Ask the Hodja if you may borrow his donkey for your fruit.

Hint: Pick a heavy load of fruit, then talk to the Hodja under the big tree. · check: `talk:hodja:borrow-donkey`

#### <a id="q88-intro"></a>Scene `q88-intro`

_You have more fruit than arms. A great heap of it wobbles in the basket, and a pear is trying to escape._  
**You**: Hodja, may I borrow your donkey for the afternoon?  
**The Hodja** _(sad)_: Ah. I am very sorry. He is out today.  
_Behind the big tree, quite close, the donkey brays. It is not a quiet bray._  
_Your Nubbin looks at the tree, and then at the Hodja. The Hodja studies his hands for a moment._  
**The Hodja** _(angry)_: You believe the ass, but will not believe a grey-bearded man like me.  
_He folds his arms and looks offended. His eyebrows are doing most of the work._  

**Choices**

- **I’m sorry. I believe you.**
    - **The Hodja**: Too late. You have hurt me twice. Once with your ears, and once with your eyes.
- **Please, Hodja. I have a lot of pears.**
    - **The Hodja**: That is a different question, and a much better one.

#### <a id="q88-lent"></a>Done `q88-lent`

_He laughs, a big round laugh that shakes the turban, and goes to untie the donkey himself._  
**The Hodja** _(happy)_: Since you asked nicely. Also, he was never out. He was only hiding from the fruit.  

### Complete

#### <a id="q88-complete"></a>Complete `q88-complete`

_The donkey carries the basket and an extra one besides. It walks slowly, with great dignity, as if it carried the fruit for fun._  
_Your Nubbin rides on top of the pears._  
**The Hodja**: If you want, you may borrow him again. Just do not ask the donkey. He says yes to everything.  
_The donkey brays once, loudly, and agrees._  

**Rewards**

- Donkey Rides (feature): The donkey carries one extra basket of fruit for you.

**Learning Grove swaps**

- `q88-intro#5` → Who will you believe? Me, or a donkey? Hee-haw.

**Notes:** Triggers only when the player is carrying a heavy fruit load (fruit-count threshold in the sim). One-time unlock: the donkey is a carrier with one extra basket slot; it is not a chore and has no cooldown. The donkey brays from behind the tree; it never speaks. Borrow quote kept verbatim, "ass" included.

## Q89. The Pot That Gave Birth

*Nasreddin Hodja tales: the cauldron that bore a child (Borrow, 1884)* · audience: all · where: Byte’s kitchen, then the big tree by the pond · when: once the one before it is done (never during Chapters 9–11) · requires: Q88

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Byte

### Step 1: Carry Byte’s big jam pan to the Hodja.

Hint: Take the big jam pan from Byte and give it to the Hodja under the big tree. · check: `give:item:jam-pan:hodja`

#### <a id="q89-intro"></a>Scene `q89-intro`

**The Hodja**: Byte, I am cooking soup for the children and I have no pan large enough. May I borrow yours?  
**Byte**: The big jam pan? It’s the only one I’ve got.  
**The Hodja**: I will take great care of it. I will bring it back before the jam is missed.  
_Byte sighs and puts it in your arms. It is very large, and rather sticky on one side._  
**Byte**: Carry that. And tell him I want it back.  

#### <a id="q89-lent"></a>Done `q89-lent`

_The Hodja takes the pan with both hands, as if it were a sleeping child._  
**The Hodja** _(soft)_: Thank you. I promise to look after it. More than that I cannot promise.  

### Step 2: Take the returned pan to Byte, and the little one inside it.

Hint: Collect the big pan from the Hodja and bring it to Byte. · check: `deliver:item:jam-pan:byte`

#### <a id="q89-baby"></a>Scene `q89-baby`

_The Hodja brings the big pan back the next day. Inside it, snug and clean, sits a small milk pan._  
**The Hodja** _(happy)_: Your cauldron has borne a child.  
**Byte**: It’s a jam pan.  
**The Hodja**: A pan that big is only a cauldron with good manners.  
**Byte**: And a pan can’t have a baby.  
**The Hodja** _(soft)_: And yet here it is.  
_Byte does not believe a word of it, but he keeps both pans. They are, in fairness, both his now._  

### Step 3: Tell Byte that the big pan has not come back from the Hodja.

Hint: Talk to Byte again after the Hodja asks for the big pan. · check: `talk:byte:pan-dead`

#### <a id="q89-dead"></a>Scene `q89-dead`

_Some days later the Hodja borrows the big pan again. This time he does not bring it back._  
_Byte comes looking, with a spoon in one hand and a very short temper._  
**The Hodja** _(sad)_: I have bad news. The cauldron is dead.  
**Byte** _(angry)_: Dead? It’s a pan! Pans can’t die!  
**The Hodja** _(think)_: Hm. As you believed it could bear a child, why should you not believe that it can die?  
_Byte opens his mouth, shuts it again and goes very quiet._  
_Then, slowly, the corner of his mouth begins to twitch._  
**Byte** _(happy)_: You absolute…  
_He laughs until he has to sit down on a stump, and the Hodja pats him sympathetically on the head._  

**Choices**

- **Laugh with them.**
    - Your Nubbin laughs too, in the way Nubbins do, which is with its entire body.
- **Pat Byte on the shoulder.**
    - **Byte**: Don’t. I’m grieving.

### Complete

#### <a id="q89-complete"></a>Complete `q89-complete`

_The little milk pan sits on a shelf in Byte’s kitchen with a ribbon on its handle. He refuses to say who tied it._  
**Byte**: I know it’s ridiculous. I’ve started talking to it.  
**The Hodja** _(soft)_: That is entirely normal. I talk to the big one every night.  
**Byte**: You said it was dead!  
**The Hodja** _(happy)_: The dead are good listeners.  

**Rewards**

- The Little Milk Pan (decor): A small milk pan with a ribbon on its handle. A decoration. (The big pan comes back in Q94.)

**Learning Grove swaps**

- `q89-baby#1` → Your big pan has had a baby!
- `q89-dead#4` → You believed a pan could have a baby. Why not believe it could die?

**Notes:** The big pan leaves the game with the Hodja during step 3 and returns spotless in Q94. "Dead" is only a joke about a pan; keep it light, no funeral beat. Step 2 and step 3 are separated by a few in-game days of story time, not a real-time timer; step 3 begins as soon as step 2 is done and the player next visits Byte. In the Learning Grove line the second quote ("the cauldron is dead.") is replaced by Hodja: "I have bad news. The big pan has gone." The Borrow "cauldron" is kept in the main text, with Byte objecting that it is a jam pan.

## Q90. The Moon in the Well

*Nasreddin Hodja tales: the moon in the well (Borrow, 1884)* · audience: all · where: The old well behind the Workshop, on a full-moon night · when: once the one before it is done (never during Chapters 9–11) · requires: Q89

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia))

### Step 1: Find a rope and a hook for the Hodja.

Hint: Craft a rope at the Workshop and take a hook from the shed by the well. · check: `find:item:well-rope-hook`

#### <a id="q90-intro"></a>Scene `q90-intro`

_A full moon sits over the Workshop, round and bright as a plate. The Hodja is at the old well with his bucket._  
**The Hodja** _(shock)_: Come quickly. The moon has fallen into the well, I must pull it out.  
_You look down. There it is, small and silver, wobbling at the bottom._  
**You**: Hodja, that’s only the reflection.  
**The Hodja** _(soft)_: Look at it. It is clearly the moon. And somebody has to rescue it.  
_Your Nubbin peers over the edge and gasps. It does not need convincing._  

**Choices**

- **Try to explain reflections.**
    - **The Hodja**: I know. It is a reflection. But what if it is also the moon?
    - You cannot argue with that. You have tried.
- **Fetch a rope and hook.**
    - **The Hodja**: The best answer. It is also the only one with a rope.

#### <a id="q90-gear"></a>Done `q90-gear`

_You fetch a long rope and a heavy iron hook from the shed. The Hodja ties it with a knot that looks more optimistic than secure._  
**The Hodja** _(soft)_: There. Now we lower it, slowly, so we do not frighten her.  

### Step 2: Pull on the rope with the Hodja, and then lie down and look up.

Hint: Tap Do it in the Journal to pull the rope, then sit beside the Hodja and look up. · check: `sit:hodja:well-moon`

#### <a id="q90-pull"></a>Scene `q90-pull`

_The hook goes down into the dark. It scrapes on something, and the Hodja leans back._  
**The Hodja** _(angry)_: She is heavy. Pull!  
_You pull, your Nubbin pulls, and the donkey, tied to a post, also pulls, in the wrong direction._  
_The hook has caught a stone. The rope goes tight, and tighter, and then snaps with a twang._  
_The Hodja goes over backwards and lands flat on the grass, with his turban over one eye._  
**The Hodja** _(happy)_: I have suffered much pain, but the moon has got to its place again.  

#### <a id="q90-sky"></a>Done `q90-sky`

_The moon is up there, calmly shining, exactly where she always is. He looks at her for a long time._  
_Your Nubbin lies down on the grass beside him to look too._  

### Complete

#### <a id="q90-complete"></a>Complete `q90-complete`

_You lie there for a while, the three of you. The grass is cool, and the moon is very bright._  
**The Hodja** _(soft)_: Hard work. But worth it. A night without a moon is a night someone has to answer for.  
_Down in the well the little silver moon is still there, shaking gently._  
**The Hodja** _(happy)_: Another one. Fine. I will fetch it tomorrow.  
_He does not. But he does hang the bucket from the old rope, and the moon sits in it on full-moon nights._  

**Rewards**

- The Moon Bucket (decor): A well-bucket decoration. On full-moon nights, the moon shows in the water.

**Learning Grove swaps**

- `q90-intro#1` → Come quickly! The moon has fallen into the well!
- `q90-pull#5` → Look! I got it out. It’s all the way back up in the sky.

**Notes:** Plays only on a full-moon night in the Free Grove or campaign (never during Chapters 9–11). The well is behind the Workshop. The reflection is a small bright disc in the water, with a gentle wobble. The rope snaps off-screen after the hook sticks; the Hodja lands on his back on the grass. Keep it light: no injury, no fall into the well. The bucket decoration shows a moon disc in the water only when the sim moon is full.

## Q91. The Smell of Soup

*Nasreddin Hodja tales: the smell of soup and the sound of coins (traditional)* · audience: all · where: The new soup stall at the lane’s end, on a market day · when: once the one before it is done (never during Chapters 9–11) · requires: Q90

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Merrow Ladle (The stall-keeper in the tale of the smell of soup (traditional))

### Step 1: Walk the stall-keeper and the traveller to the Hodja.

Hint: Talk to the stall-keeper at the soup stall, then take both to the big tree. · check: `escort:soup-keeper:hodja`

#### <a id="q91-intro"></a>Scene `q91-intro`

_A new soup stall has opened at the end of the lane, with a striped awning and a pot the size of a bath._  
_Beside it, a thin traveller sits on a milk crate with a heel of dry bread. He holds it up to the steam with great concentration._  
**Merrow Ladle** _(angry)_: You! That will be two shells.  
_The traveller blinks. He has not bought any soup._  
**Merrow Ladle**: You ate bread next to my soup. You smelled it. Nothing here is free, not even the air near the pot.  
**You**: He’s only had dry bread.  
**Merrow Ladle**: Flavoured with my steam! Two shells, or I fetch the Hodja.  
_This turns out to be a mistake on her part. The Hodja is already walking down the lane._  

**Choices**

- **Take them both to the big tree.**
    - **The Hodja**: Excellent. A dispute. I have not had one since breakfast.
- **Offer to pay the two shells yourself.**
    - **The Hodja**: Generous. But not yet. Let the matter have its day.
    - **Merrow Ladle**: I want a judge, not a donation.

#### <a id="q91-arrived"></a>Done `q91-arrived`

_A small crowd gathers under the big tree. The Hodja hears both sides with his chin in his hand and his eyes closed._  
_At the end of the traveller’s side, he opens one eye, and at the end of the stall-keeper’s side he opens the other._  

### Step 2: Stand by while the Hodja judges the smell of the soup.

Hint: Watch the Hodja’s judgement at the big tree. · check: `watch:hodja:soup-judgement`

#### <a id="q91-judge"></a>Scene `q91-judge`

**The Hodja** _(think)_: So. The traveller has smelled the soup. And the soup has a price.  
**Merrow Ladle**: Two shells!  
_The Hodja takes a small leather purse out of his sleeve. He holds it up to the stall-keeper’s ear and gives it a good, slow jingle._  
_Coins chime. The crowd goes very still._  
**The Hodja** _(happy)_: You sold him a smell. He pays you with a sound. Fair is fair.  
**Merrow Ladle** _(angry)_: But that’s only the sound!  
**The Hodja**: And his was only the smell. Besides, these are my coins. I am keeping them. Sound is free.  
_The crowd, who have been waiting for exactly this, break into applause. The stall-keeper looks at her pot, and then, to her credit, laughs._  
**Merrow Ladle** _(soft)_: All right. I didn’t think of it like that.  

#### <a id="q91-judge-seat"></a>Variant `q91-judge-seat`

_Variant of `q91-judge`._

**The Hodja** _(think)_: So. The traveller has smelled the soup. And the soup has a price.  
**The Hodja** _(soft)_: Friend, you gave me your seat at the Supper, when I had mud on my knees. Please. Sit beside me. We will judge it together.  
_A bench is pulled out. You sit next to the Hodja, and your Nubbin climbs on your lap to look serious._  
**Merrow Ladle**: Two shells!  
_The Hodja takes a small leather purse out of his sleeve and holds it up to the stall-keeper’s ear. He gives it a good, slow jingle._  
**The Hodja** _(happy)_: You sold him a smell. He pays you with a sound. Fair is fair.  
**Merrow Ladle** _(angry)_: But that’s only the sound!  
**The Hodja**: And his was only the smell. What does my second judge say?  
**You** _(happy)_: I say the sound is fair.  
_The crowd, who have been waiting for exactly this, break into applause. The stall-keeper looks at her pot, and then, to her credit, laughs._  
**Merrow Ladle** _(soft)_: All right. I didn’t think of it like that.  

#### <a id="q91-bowl"></a>Done `q91-bowl`

_She fills a bowl of soup, and then another, and puts them in front of the traveller and the Hodja._  
**Merrow Ladle** _(happy)_: Free. The smell was worth it.  

### Complete

#### <a id="q91-complete"></a>Complete `q91-complete`

_The traveller eats the soup slowly, with his eyes closed, and says nothing for a long time._  
_Then he thanks everyone, three times, and goes on his way with a bag of bread under his arm._  
**The Hodja**: The soup was very good. I can say so with confidence, having heard it a great deal in the last hour.  
_The stall-keeper keeps the purse for the rest of the day, jingling it whenever somebody sniffs._  

**Rewards**

- Soup-Pot Stall (decor): A little striped stall with a big soup pot. A decoration.

**Notes:** Payoff of Q87: if q87-gift is "seat", replace the Q91 step 2 scene q91-judge with the variant scene "q91-judge-seat" (QUESTS_HODJA_VARIANTS): the Hodja asks the player to sit beside him as the second judge. Otherwise (coat, watch) play q91-judge as written. The judgement is told in our own words; the traditional point is that the sound of coins pays for the smell of soup. No timers; the stall is permanent after the quest. The stall-keeper "Merrow Ladle" is a valley character who does not appear elsewhere in the pack.

## Q92. Do You Know What I’ll Say?

*Nasreddin Hodja tales: do ye not know what I am going to say (Borrow, 1884; set at the schoolhouse)* · audience: all · where: The schoolhouse, on a quiet afternoon · when: once the one before it is done (never during Chapters 9–11) · requires: Q91

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Sparks

### Step 1: Help Sparks set out the benches and welcome the Hodja to the schoolhouse.

Hint: Carry the benches in and talk to Sparks. · check: `place:decor:school-bench:schoolhouse`

#### <a id="q92-intro"></a>Scene `q92-intro`

_The valley wants a proper talk from the Hodja, and the schoolhouse has been swept for the occasion._  
**Sparks** _(happy)_: I organised it. Everybody’s coming. If he says no, I’ve told them it’s a surprise.  
_Benches are being carried in. Your Nubbin is standing in the middle of one, directing._  
**Sparks**: You do the benches. I’ll do the speech of welcome. It’s very short. It has to be.  

#### <a id="q92-ready"></a>Done `q92-ready`

_A dozen benches, a slate on an easel, a vase of late asters. The Hodja arrives with his donkey, and ties it to the porch._  
**The Hodja** _(soft)_: A fine room. Thank you. I will try not to waste it.  

### Step 2: Keep a straight face through the Hodja’s three talks.

Hint: Sit at the back, then tap Do it in the Journal. Try not to laugh. He can tell. · check: `sit:schoolhouse:hodja-talk`

#### <a id="q92-talk"></a>Scene `q92-talk`

_The room is packed. The Hodja climbs onto the little platform, turns around twice, and clears his throat._  
**The Hodja** _(think)_: Friends. Before I begin: do ye not know what I am going to say to you?  
_A murmur. Someone at the back calls out “No!” Sparks is sitting very upright, mouth pressed shut._  
**The Hodja** _(happy)_: Then there is no point in my telling you. Good afternoon.  
_He climbs down, collects his donkey and goes home. The room is silent for quite some time._  
_The next afternoon they all shout “Yes!” before he has finished the question._  
**The Hodja**: Then you do not need me. Good afternoon.  
_Sparks has her hand over her mouth. Her shoulders are shaking._  
_On the third afternoon the room is split. Half the benches shout “Yes!” and the other half shout “No!”_  
**The Hodja** _(happy)_: Wonderful. Those who know can tell those who do not. I will have a nap.  

**Choices**

- **Keep a perfectly straight face.**
    - **Sparks**: How are you doing that? You’re not even blinking.
- **Nudge Sparks, very gently.**
    - **Sparks**: Don’t! I’m the chair of this meeting!

#### <a id="q92-nap"></a>Done `q92-nap`

_The Hodja goes out on to the porch, takes off his turban and puts it over his face._  
_Behind him, the audience turns to one another, and the people who know begin to teach the ones who do not._  

### Complete

#### <a id="q92-complete"></a>Complete `q92-complete`

_By sunset, the whole schoolhouse is full of small conversations. The slate has a drawing of a donkey on it._  
**Sparks** _(happy)_: I think that was the best talk I’ve ever heard. And he didn’t say anything.  
**The Hodja** _(soft)_: That is the best kind. Nobody can say you were wrong.  
_Sparks hangs a little brass bell on the porch, to call people in, and gives it a small ring._  
_The donkey brays, as if it were part of the plan._  

**Rewards**

- The Schoolhouse Bell (decor): A little brass bell for the schoolhouse porch. A decoration.

**Learning Grove swaps**

- `q92-talk#1` → Friends. Before I begin: do you know what I am going to say?
- `q92-talk#9` → Half of you know? Wonderful. Teach the other half. I’ll nap.

**Notes:** Set in the schoolhouse (not a mosque, and no prayer or sermon imagery). The three talks play in one scene; stage them as a short cut-away montage over three days of story time, not three real weeks and not a timer. Sparks keeps a straight face through the first and loses it by the third. The donkey is on the porch and brays at the wrong moment. The Borrow quote is trimmed to "do ye not know what I am going to say to you?"

## Q93. Counting the Donkeys

*Nasreddin Hodja tales: the donkeys he forgets to count (traditional)* · audience: all · where: The lane from the market, on a market day · when: once the one before it is done (never during Chapters 9–11) · requires: Q92

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia))

### Step 1: Count the Hodja’s donkeys with him.

Hint: Stand beside the Hodja on the lane and use Count. · check: `puzzle:count:hodja-donkeys`

#### <a id="q93-intro"></a>Scene `q93-intro`

_The Hodja has bought seven donkeys at market to carry the valley’s apples. He rides home on the first, and the rest follow in a line._  
**The Hodja** _(shock)_: One, two, three, four, five, six. Six! Where has one gone?  
_The donkey he is riding looks round at him, and at its six companions, and says nothing._  
**You**: Hodja, can I count them?  
**The Hodja**: Please. I have counted three times and I get six every time. It is most distressing.  
_You count. One, two, three, four, five, six, and then, one more: the one under the Hodja._  

**Choices**

- **Seven. You’re sitting on the seventh.**
    - **The Hodja**: Nonsense. I would know it if I were sitting on one.
- **Count them out loud, pointing.**
    - **The Hodja**: You say seven. But I have not got seven, I have got six, and a very sore conscience.

#### <a id="q93-seven"></a>Done `q93-seven`

_Seven, every time. Your Nubbin counts them too, on its fingers, and then on its toes, to be safe._  
**The Hodja** _(think)_: Remarkable. I will get down and look.  

### Step 2: Count again once he is back on foot, and tell him which donkey is missing.

Hint: Count again when the Hodja has dismounted. Then tell him which donkey is the lost one. · check: `puzzle:count:hodja-donkeys:solve`

#### <a id="q93-again"></a>Scene `q93-again`

_He climbs down, walks along the line, and counts them carefully, tapping each one with his finger._  
**The Hodja** _(happy)_: One, two, three, four, five, six, seven. Seven! They are all here.  
_He climbs up again, settles on the back of the first donkey and counts once more, looking back along the line._  
**The Hodja** _(shock)_: Six. Six! They have gone again.  
_He gets down and counts seven, then gets up and counts six._  
**The Hodja** _(think)_: I see. It is a very clever arrangement. When I ride, I lose a donkey. When I walk, I gain one.  
**The Hodja** _(happy)_: Riding is a luxury I cannot afford. I will walk.  

**Choices**

- **Tell him he forgets the donkey he’s sitting on.**
    - **The Hodja**: You think I forgot? I am a teacher! I forget nothing. I only misplace.
- **Say nothing. Let him walk.**
    - Your Nubbin climbs onto the lead donkey, facing backwards, as if it had been doing it all its life.

#### <a id="q93-walk"></a>Done `q93-walk`

_The Hodja walks home with seven donkeys behind him, whistling._  
_Your Nubbin rides on the first one, and counts them again, just in case._  

### Complete

#### <a id="q93-complete"></a>Complete `q93-complete`

_The apples are carried down to the cellars on the backs of seven very patient donkeys._  
**The Hodja** _(happy)_: You may tell the children I am a genius. Or you may tell them to count. Both are true.  
_The valley children go home counting everything in sight: chickens, windows, each other’s noses._  
_That evening one of them hands the Hodja a row of wooden toy donkeys. There are six, and a half-finished seventh._  
**The Hodja** _(soft)_: Six and a half. Better than nothing. It is the most honest count I have had all day.  

**Rewards**

- The Donkey Train (decor): A line of six (and a half) wooden toy donkeys. A decoration.

**Notes:** Works as a simple counting puzzle: the player counts seven, the Hodja counts six. The missing donkey is always the one he is sitting on, so the player can work it out each time. The donkey line is a new set of identical donkeys, one of which the Hodja rides; keep them gentle and slow. Told in our own words (no Borrow).

## Q94. What If It Takes?

*Nasreddin Hodja tales: the yoghurt pond, "what if it takes?" (traditional)* · audience: all · where: The edge of the pond · when: once the one before it is done (never during Chapters 9–11) · requires: Q93

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Byte

### Step 1: Find out what the Hodja is doing at the pond.

Hint: Go to the pond and talk to the Hodja. · check: `talk:hodja:yoghurt-pond`

#### <a id="q94-intro"></a>Scene `q94-intro`

_The Hodja is at the edge of the pond with a spoon in one hand and Byte’s big jam pan in the other._  
_The pan is full of thick white yoghurt. He is tipping it into the water, a spoonful at a time._  
**You**: Hodja, what are you doing?  
**The Hodja** _(soft)_: I am making a pond of yoghurt. A little goes in, and the rest should follow.  
**Byte** _(angry)_: That’s my pan! The dead one! And a pond can’t set!  
**The Hodja** _(soft)_: Shh. It is resting.  
**The Hodja** _(think)_: I know. It will not work.  
**The Hodja** _(happy)_: But just imagine if it did!  

**Choices**

- **Explain how yoghurt really works.**
    - **The Hodja**: A little live yoghurt, warm milk, patience. Yes. I know. I am a teacher.
    - **The Hodja**: But a cold pond is a cold pond, and a hopeful man is a hopeful man.
- **Hold the pan while he spoons.**
    - **The Hodja**: A good assistant. You may have a share of the lake.

#### <a id="q94-spooned"></a>Done `q94-spooned`

_The last of the yoghurt goes in. It spreads over the surface in a thin pale cloud and sinks._  
**The Hodja** _(soft)_: Now we wait. Very still. Very quiet.  

### Step 2: Sit still by the pond and watch the water.

Hint: Stay sitting beside the pond for a while. · check: `sit:pond:watch-water`

#### <a id="q94-wait"></a>Scene `q94-wait`

_Your Nubbin sits at the edge of the water with its chin on its knees and watches for a very long time._  
_A dragonfly lands on the water, and takes off again. The yoghurt has gone._  
**The Hodja** _(think)_: Still there? Anything?  
_Your Nubbin shakes its head, very slowly, and carries on watching._  
**The Hodja** _(soft)_: No. It has not set. But look at the ripples.  
**The Hodja** _(happy)_: And what if it had? Imagine that. A whole pond of it.  

#### <a id="q94-ripples"></a>Done `q94-ripples`

_The pond is clear and cool and exactly the same as it was this morning. Possibly it is a little more delicious._  
**Byte**: If you’ve finished, I’d like my pan back.  

### Complete

#### <a id="q94-complete"></a>Complete `q94-complete`

_Byte has his big jam pan again. It has been washed in the pond until it shines like a mirror._  
**Byte**: It’s spotless. It’s cleaner than it was when I bought it.  
**The Hodja** _(happy)_: The dead are always cleaner. It is a known fact.  
**Byte**: You said it was dead!  
**The Hodja** _(soft)_: It has been resurrected. The pond is a very forgiving place.  
_Byte puts the pan under his arm and the little milk pan on top, and walks back up the hill muttering._  
_He is smiling. He thinks nobody can see._  

**Rewards**

- “What If” Emote (cosmetic): Your Keeper crosses their fingers and looks hopeful.

**Learning Grove swaps**

- `q94-intro#7` → I know it won’t work. But just imagine if it did!

**Notes:** Byte’s big jam pan returns here, spotless, after "dying" in Q89. The yoghurt is a white cloud on the pond surface, nothing more; the pond must never be left looking spoiled. The Hodja knows it will not work; that is the whole joke. The traditional punchline is "what if it takes?" (Turkish "Ya tutarsa?"), in our own wording.

## Q95. You Are Right, Too

*Nasreddin Hodja tales: "you are right, too" (traditional)* · audience: all · where: The dojo, then the big tree by the pond · when: once the one before it is done (never during Chapters 9–11) · requires: Q94

**Cast:** The Hodja (Nasreddin Hodja (traditional folk tales; Turkey, Iran and Central Asia)), Sparks, Pixel

### Step 1: Walk Sparks and Pixel to the Hodja.

Hint: Talk to Sparks and Pixel at the dojo, then take them to the big tree. · check: `escort:sparks:hodja`

#### <a id="q95-intro"></a>Scene `q95-intro`

**Sparks** _(angry)_: It’s my turn on the practice mat. I booked it on Tuesday.  
**Pixel** _(angry)_: You said you’d be there at six. I got there at six. It’s my turn.  
_They have been going round this for ten minutes. Your Nubbin has long since sat down._  
**Sparks**: We need someone to decide. Someone with no stake.  
**Pixel**: Someone with a donkey.  

#### <a id="q95-arrive"></a>Done `q95-arrive`

_You steer them under the big tree. The Hodja listens to all of it, nodding, and stirring his tea._  

### Step 2: Stay and hear the Hodja’s judgement.

Hint: Sit down and listen to the Hodja. · check: `sit:hodja:judgement`

#### <a id="q95-judge"></a>Scene `q95-judge`

**The Hodja** _(soft)_: Sparks. You have told me what happened. You are right.  
**Sparks** _(happy)_: Thank you!  
**The Hodja**: Pixel. You have told me what happened. You are right.  
**Pixel** _(happy)_: Thank you!  
**You** _(think)_: They can’t both be right.  
**The Hodja** _(happy)_: You are right, too.  
_Sparks and Pixel look at one another. Pixel’s mouth starts to twitch, and then Sparks’s._  
**Sparks** _(happy)_: That is the worst judgement I’ve ever heard.  
**Pixel** _(happy)_: Take turns?  
**Sparks** _(soft)_: Take turns. I’ll go first. No, you.  

**Choices**

- **It’s still not logical.**
    - **The Hodja**: Logic is a fine thing. It cannot carry a bucket of tea.
- **Laugh and accept it.**
    - **The Hodja**: A wise answer. It means you have understood nothing, and yet everything.

#### <a id="q95-tea"></a>Done `q95-tea`

_Sparks and Pixel go off arm in arm to the dojo, arguing over who should hold the door._  

### Complete

#### <a id="q95-complete"></a>Complete `q95-complete`

_The Hodja pours another cup of tea and pats the roots of the big tree as if it were a friend._  
**The Hodja**: Well. I have decided to stay. The tree is comfortable, the pond is useful, and the children have not learned anything yet.  
**You**: Nothing?  
**The Hodja** _(happy)_: Not a single thing. Which means there is plenty left to teach.  
_The donkey brays on cue, from the shade, and your Nubbin climbs up to ride it backwards, facing the tree._  

#### <a id="q95-gift-seat"></a>Variant `q95-gift-seat`

_Variant within Q95; it has no single parent scene._

**The Hodja** _(soft)_: One more thing. At the Supper you gave me your seat, and your bowl, and a fine coat grew out of it.  
_He takes off the magnificent fur coat and holds it out to you, with both hands._  
**The Hodja** _(happy)_: It has eaten enough.  
_You put it on. It is very warm, and smells a little of soup._  

#### <a id="q95-gift-coat"></a>Variant `q95-gift-coat`

_Variant within Q95; it has no single parent scene._

**The Hodja** _(soft)_: One more thing. At the Supper you fetched me a coat. Here it is.  
_He hands you the clean coat you gave him. It has been mended at the elbow, with very small, very careful stitches._  
**The Hodja** _(happy)_: I looked after it, as I said. A little, and with a needle.  
_You put it on. It fits better than it ever did._  

#### <a id="q95-gift-watch"></a>Variant `q95-gift-watch`

_Variant within Q95; it has no single parent scene._

**The Hodja** _(soft)_: One more thing. At the Supper you only watched. That was patient. It deserves something.  
_He snips a single round button off the sleeve of the fur coat and presses it into your palm._  
**The Hodja** _(happy)_: One fur button. The rest of the coat is still eating.  
_Your Nubbin looks at the button, and then at the coat, with great respect._  

**Rewards**

- The Hodja’s Gift (cosmetic): A cosmetic for your Keeper, chosen by how you treated him at the Supper (Q87): his fur coat if you gave your seat, a mended coat if you fetched one, or a single fur button if you watched.

**Learning Grove swaps**

- `q95-judge#5` → You’re right. And you’re right. And so are you. Who wants tea?

**Notes:** Payoff of Q87: after the complete scene, play one of the variant scenes "q95-gift-seat", "q95-gift-coat" or "q95-gift-watch" (QUESTS_HODJA_VARIANTS), chosen by q87-gift. The three gifts are cosmetic only. The Hodja is a resident under the big tree by the pond after this quest (idle lines and one-liners for the valley children; nothing repeats as a task). In the Learning Grove, the line "You are right, too." is kept in the main text as the signature joke; the childLine replaces the whole judgement beat with "You’re right. And you’re right. And so are you. Who wants tea?"
