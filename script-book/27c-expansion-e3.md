# Expansion E3: The Twine

## E3. The Twine

*Original (the two-partner merge, Digimon-style jogress; the dojo tournament)* · audience: main · where: The Hollow steps, then the dojo · when: A morning after the ending

### Step 1: Feed a stray in the Hollow Below.

Hint: Take fruit down. Strays wait in the nooks. · check: `count:strayFed:>=1`

#### Scene `e3-strays`

_Dusty is sitting on the Hollow’s top step, lamp off, listening to the dark the way other people listen to rain._  
**Dusty**: Two strays down there walk in step. One won’t eat unless the other has. I’ve never seen that.  
**Dusty**: I’ve sat here four nights. They come to the second nook about now. They don’t come up. They don’t go down.  
**Dusty**: Go down and feed one. Watch what the other does.  
_They hand you the lamp, unlit. You are to light it at the bottom, not before. The strays mind._  

#### Done `e3-strays-done`

_You hold out the fruit. The stray takes it, then stops, and turns, and waits._  
_Only when the second one has eaten does the first swallow. Dusty, behind you, says nothing at all, which is their loudest._  
_The two go back into the dark in step, one a little ahead, and then the other a little ahead, taking turns._  

### Step 2: Name two partners.

Hint: The partners panel. Pick the two who wait for each other. · check: `partners:set`

#### Scene `e3-pair`

**Dusty**: That’s a pair. Yours can be one too. Name two partners. Not the strongest. The two who wait for each other.  
_They hand you a loop of grey twine, old and soft._  
**Dusty**: Hazel’s. She said it was for tying beans. She was lying.  
**Dusty**: Which two, then. Say it out loud. It’s easier to keep a thing you’ve said.  

**Choices**

- **The two who wait at the gate for each other.** — sets `{"e3-pick":"wait"}`
    - **Dusty**: Good. Those.
    - They look, for a moment, like someone who has been told the right answer to a question they did not ask.
- **The two strongest. It’s a tournament.** — sets `{"e3-pick":"strong"}`
    - **Dusty**: It is. And the twine won’t hold two who don’t wait. Pick again, or find out. Both are allowed.
    - They say it without heat. Dusty has never once said anything with heat.

#### Done `e3-pair-done`

_Two Nubbins who keep close to you now keep close to each other as well._  
_At the gate, that evening, one waits for the other without being told. It is the first time. It will not be the last._  

### Step 3: Buy a length of twine.

Hint: The stall sells it. · check: `twine:>=1`

#### Scene `e3-twine`

**Dusty**: Mine’s too old to hold. The stall sells twine now. Buy a length. It only works when both of them are sure of you.  
**Dusty**: Sure isn’t fond. Fond is easy. Sure is when they’d let you tie a knot round them and not look at the knot.  
_They wind the old loop round two fingers and put it in a pocket, carefully, the way you keep a thing that no longer works._  

#### Done `e3-twine-done`

_A loop of twine, new and stiff. It smells of the stall._  
_Your two sniff it, and look at each other, and then at you, and decide something._  

### Step 4: Tie the twine: merge your partners.

Hint: Both adults, both fond of you (affection 60), one twine. · check: `merged`

#### Scene `e3-merge`

**Dusty**: Both grown. Both fond of you past the point of doubt. Then tie it, and stand back.  
**Dusty**: They don’t become one thing. They become two things that agree. It lasts a minute. It changes nothing when it ends.  
**Dusty**: Hazel tied it twice in her life that I saw. Once for the beans. Once the winter the lane froze, and she never said for what.  
_They do not say who she tied it round. You do not ask. Some tying is private._  

#### Done `e3-merge-done`

_The twine goes slack and then isn’t there. Where two Nubbins stood there is a shape made of both, glowing at the seams._  
_It moves like the faster one and stands like the stronger. After a minute it is two again, blinking, pleased._  
**Dusty** _(soft)_: That’s it. That’s the whole trick. The rest is being worth tying to.  
_The two of them sit down on the same side of you, closer than they were, and stay there till dark._  

### Step 5: Win the bracket in the dojo.

Hint: Three wins after the bracket goes up. Merged counts. · check: `karate:tournament`

#### Scene `e3-tournament`

_Byte has pinned a bracket to the dojo door. Ten names, ten champions, one line through the middle with yours on it._  
**Byte**: Every Keeper sent their best. Fern’s, Marina’s, Sparks’s, all of them. Luna’s is terrifying.  
**Byte**: Win your rounds in the dojo. The twine is allowed. Everyone agreed, after some shouting.  
**Byte**: Luna did most of the shouting. Then she said “fine” in a way that was not fine. Then she sent her champion anyway.  
**You**: You look at the names and then at your two, who are looking at each other.  
_Dusty is at the back of the crowd, lamp off, looking at nothing in particular, which is where they look when they are proud._  

#### Done `e3-tournament-done`

_Round after round. Clover’s champion goes down to a feint. Ember’s to stamina. Luna’s, in the end, to two who agree._  
**Byte** _(shock)_: That’s the bracket. I have never seen a bracket do that.  
_Luna says nothing, and claps twice, slowly, which from Luna is a speech._  

#### Complete `e3-complete`

_A cup, dented, on the dojo bench. Dusty puts the old grey twine inside it and leaves it there._  
**Dusty**: Hazel tied beans with that. Twenty years. The beans never once came apart.  
**Byte**: I’m writing this up as a draw. For diplomacy.  
_Your two sit either side of the cup and look at the twine in it as if it were theirs now. It is._  
_Down in the Hollow, two strays walk in step and do not need anyone to tell them why._  

**Rewards**

- Twine Champion (title): Two who agree beat ten who did not.

Sets on completion: `{"e3Done":true}`

**Notes:** Steps 1–5 are met by the sim (autoOnly). Step 5 counts dojo wins since the bracket scene; e3-tournament-done-merged plays if a win came while merged. The e3-pair choice (e3-pick) is voice only; the merge’s own affection rule is what actually refuses two who are not sure.

## Variant scenes

#### Variant `e3-tournament-done-merged`

_Round after round, and the last one tied. Luna’s champion swings at a shape made of two and hits the agreement between them._  
**Byte** _(shock)_: That’s the bracket. Luna is going to want a rematch and I am going to tell her no.  
_Luna says nothing, and claps twice, slowly, which from Luna is a speech._  
