# Storyline SL2: Logged In

*Three partners. Two servers. No log out.* · Digimon World 3 (2002): frame and mechanics only · audience: main · save id: `logged`

**Cast:** Warden, Juno, Root

### Chapter 1: Log In

Goal: Hatch your three starter eggs. (`stat:hatched:>=3`) · Hint: Hold and shake each one. The party is all three.

#### <a id="l-c1-open"></a>Opening `l-c1-open`

_The visor is too big and smells of someone else’s hair. You pull it down. The bedroom goes. A meadow comes._  
**Warden**: Welcome to Grove Online. Session one. Three starter eggs have been placed near you. Please enjoy your stay.  
_Three eggs on the grass, each with a little green tick floating over it. The grass is too green. Everything is slightly too much._  

When `stat:hatched:>=1`:

#### <a id="l-c1-first"></a>Beat `l-c1-first`

_The first one hatches with a small polite chime, as if the meadow were pleased with itself._  
**Warden**: Starter hatched. Two remaining. Tip: hold the egg and shake it. Tip: not like that.  
_The hatchling looks at the green tick over its own head and tries to eat it._  

When `stat:hatched:>=2`:

#### <a id="l-c1-second"></a>Beat `l-c1-second`

_The second looks at the first for a long moment, the way you look at someone who has your face._  
**Warden**: Starter hatched. One remaining. Tip: partners who hatch together bout together.  
_Somewhere off in the meadow, far too faint, someone is calling a name that is not yours._  

#### <a id="l-c1-close"></a>Closing `l-c1-close`

_Three of them, blinking at the too-green grass and then at you, deciding something._  
**Warden**: Party formed. Tutorial bout available at the Day Grove lobby.  

### Chapter 2: The Lobby

Goal: Win your first party bout. (`count:partyBout:>=1`) · Hint: The journal’s Fight a bout button. Strike the weakest foe; guard when a foe is winding up; rally when two of yours are low.

#### <a id="l-c2-open"></a>Opening `l-c2-open`

_The Day Grove lobby: a meadow with a scoreboard in it. Other players stand about, slightly too still, the way people do when they are somewhere else._  
**Juno**: You’re new. I can tell, you keep looking at your hands.  
**Juno**: Bouts are over there. Three on three. It’s turns, not timing. Guard when they look at you funny.  

When `days:>=1`:

#### <a id="l-c2-still"></a>Beat `l-c2-still`

_The other players do not move much. One has stood at the scoreboard since you arrived, reading the same line._  
**Juno**: Don’t stare. Some of them are asleep out there. The game keeps the shape standing. It’s polite like that.  
**Juno**: I poked one once. It said “please enjoy your stay”. In her voice. I stopped poking.  

When `stat:feeds:>=1`:

#### <a id="l-c2-fruit"></a>Beat `l-c2-fruit`

_The fruit tastes of the word “fruit”. Your partner eats it as if it tasted of fruit._  
**Warden**: Tip: a fed partner strikes true. Tip: the trees never run out. Tip: please do not test this.  

#### <a id="l-c2-close"></a>Closing `l-c2-close`

_The foes blink out one by one, politely, like lights in a house going to bed._  
**Juno**: Not bad. I’m Juno. I’ve been in for nine days. Don’t ask me what day it is out there, nobody knows.  

### Chapter 3: No Log Out

Goal: Win three bouts to rank up. (`count:partyBout:>=3`) · Hint: Keep the party fed between bouts: a hungry partner strikes soft.

#### <a id="l-c3-open"></a>Opening `l-c3-open`

_You reach up for the visor. There is no visor. There is only the meadow, and your hand on your own hair._  
**Warden**: Log out is temporarily unavailable. Please continue to enjoy your stay.  
**Juno** _(sad)_: Yeah. That. It said that on day one. It still says it.  
**Juno**: Bouts rank you. Rank opens doors. Nobody’s found the door out yet, but nobody’s been high enough to look.  

When `count:partyBout:>=2`:

#### <a id="l-c3-second"></a>Beat `l-c3-second`

**Juno**: Two. Your middle one guards before it’s told. That’s rare. Mine just hit things and apologised.  
_She says “mine” and then does not say anything else for a while._  

When `days:>=2`:

#### <a id="l-c3-meals"></a>Beat `l-c3-meals`

**Juno**: Day ten, for me. I count by meals. The game feeds you if you forget. It tastes of the word “food”.  
**Juno**: I’ve got a mum and a cat out there. The cat will be fine. The cat is always fine.  
**Juno**: Who’ve you got?  

**Choices**

- **A sister. She works on games. Worked.** — sets `{"l-told":"sister"}`
    - **Juno**: Worked. Right.
    - She looks at the board by the gate, and then away from it, quickly.
- **Nobody you want to talk about in here.** — sets `{"l-told":"quiet"}`
    - **Juno**: Fair. In here’s not the place. Nothing in here is the place.

#### <a id="l-c3-close"></a>Closing `l-c3-close`

**Warden**: Rank two. The Night Grove server is now open to you.  
**Juno**: Night Grove. Same meadow, dark. Same bouts, harder. Same everything, but at night the message board shows older posts.  

### Chapter 4: Night Grove

Goal: Cross to the Night Grove and win two bouts there. (`area:night&count:partyBout:>=5`) · Hint: Where To: Night Grove. Bouts count wherever you fight; the night ones hit harder.

#### <a id="l-c4-open"></a>Opening `l-c4-open`

_The Night Grove is the meadow with the lights off and the scoreboard still glowing. The grass is too blue now. The stillness is the same._  
**Juno**: Fight here. Then come and look at the board with me. I want a witness.  

When `area:night`:

#### <a id="l-c4-night"></a>Beat `l-c4-night`

_Night, and the board by the gate has posts on it that were not there by day. Old ones. One is signed with a name you know._  
_Your three have found out the green ticks glow blue at night. The smallest licks its own and glows faintly for an hour, delighted._  

When `area:night&count:partyBout:>=4`:

#### <a id="l-c4-dark-bout"></a>Beat `l-c4-dark-bout`

_A night bout. The foes come out of the blue grass with no chime at all, and your three stand closer before the first turn._  
**Juno**: Told you. Harder. Also quieter. I don’t know which I mind more.  

When `days:>=2`:

#### <a id="l-c4-sleepers"></a>Beat `l-c4-sleepers`

_By night the still players are harder to see, and easier to hear. Some of them breathe._  
**Juno** _(soft)_: They’re not dead. I checked. I check every night. Somebody should.  

#### <a id="l-c4-close"></a>Closing `l-c4-close`

_Two bouts in the dark. Your three stand closer together afterwards, without being asked._  
**Warden**: Rank three. Message board history unlocked.  

### Chapter 5: The Message Board

Goal: Read the whole thread on the board. (`act:read-the-board`) · Hint: The journal’s Do it. Night only.

#### <a id="l-c5-open"></a>Opening `l-c5-open`

_The board at night: hundreds of posts, most of them “anyone found the exit?”, a few of them older than the game is supposed to be._  
**Juno**: There. Second from the bottom. Read it.  
**You**: You read it. It is from your sister. It is dated before you had a visor.  

When `flag:l-told:sister`:

#### <a id="l-c5-told"></a>Beat `l-c5-told`

**Juno**: You said a sister, who worked on games. I saw the name two nights ago. I didn’t want to say till you’d seen it.  
**Juno**: I’d have wanted to find it myself. Was that right?  
**You**: It was right.  

When `flag:l-told:quiet`:

#### <a id="l-c5-quiet"></a>Beat `l-c5-quiet`

**Juno**: You never said who you were missing. I think I know now. I’m sorry. I’ll stand here while you read.  
_She stands there. The board hums faintly, like something kept switched on too long._  

When `mature:teen&act:read-the-board`:

#### <a id="l-c5-thread"></a>Beat `l-c5-thread`

_Further down, a post she deleted and the board kept. The company knew the lock-in was possible. They shipped anyway, and paid the testers to stay quiet._  
**Juno** _(angry)_: They paid her. And then they lost her in here and said nothing to anyone.  
_You read it twice. The second time is worse._  

Sets `{"l-paid":true}`

#### <a id="l-c5-close"></a>Closing `l-c5-close`

_“Testing build four. If anyone reads this, the exit is where the game started. Not the lobby. The root.”_  
**Juno** _(shock)_: Your sister was a tester. She was in here before any of us.  
**Juno**: Testers work for the company that built this. The ones who say sorry as Tips.  
**You**: You knew she tested games. You did not know which.  

Sets `{"l-sister":true}`

### Chapter 6: Mirror Match

Goal: Win three more bouts, on both servers. (`count:partyBout:>=8`) · Hint: Where To switches the server. Three wins from here.

#### <a id="l-c6-open"></a>Opening `l-c6-open`

**Warden**: Rank four requires a mirror match: one bout on each server within a single session.  
**Juno**: Day, then night, then the root door opens. That’s what the old posts say. Nobody’s been rank four.  

When `count:departed:>=1`:

#### <a id="l-c6-lost"></a>Beat `l-c6-lost`

_One of the three does not get up after the bout. The game offers a fade, polite, like a light going to bed, and then a flower on the too-green grass._  
**Juno** _(sad)_: It does that. It did it to mine on day six. I didn’t tell you because you’d have looked at yours differently.  
_Two stand either side of the flower for a while. Then they stand either side of you._  

When `count:partyBout:>=6`:

#### <a id="l-c6-day-win"></a>Beat `l-c6-day-win`

_A win by day. The scoreboard flickers and puts your name one line higher than it has ever been._  
**Warden**: Mirror progress: one of two. Tip: the other server is the other server.  

When `count:partyBout:>=7`:

#### <a id="l-c6-night-win"></a>Beat `l-c6-night-win`

_A win by night, with no chime. The blue grass lies down flat where the foes stood and does not get up._  
**Juno**: One more. Anywhere. I’ll be at the lobby door. I want to see it open from the front.  
**Juno** _(happy)_: The cat would’ve done that in two. The cat is always fine.  

When `mature:teen&flag:l-paid`:

#### <a id="l-c6-wage"></a>Beat `l-c6-wage`

**Juno**: If they paid her to keep quiet, they’re paying someone now to keep this running. Somebody is on a wage while we’re in here.  
**You**: Somebody is on a wage.  
**Juno** _(angry)_: Rank four. Then the root. Then we find out whose.  
**Warden**: Warden is also on a wage. The wage is nothing. Warden would like that noted.  

#### <a id="l-c6-close"></a>Closing `l-c6-close`

**Warden**: Rank four. A door has opened in the lobby. Warden is not permitted to describe it. Warden can confirm it is a door.  
_The door is a plain door in the meadow, with a plain handle, and nothing on the other side you can see._  

### Chapter 7: The Root Node

Goal: Choose a word. (`flag:l-root`) · Hint: The choice is the goal.

#### <a id="l-c7-open"></a>Opening `l-c7-open`

_Through the door: a white room with one chair. You sit, and a recording starts in your sister’s voice, a year more tired._  
**Root**: Hello, you. If you are hearing this, the lock has engaged and I am not there to open it. I am sorry. That is not a figure of speech.  
**Root**: The exit is a word. Say it on the board and every session ends. Everyone wakes. Including the ones the company would rather you did not ask about.  
**Juno**: Say it. Say it now.  
_There is a second recording. It is the company, offering a different word: a quiet exit, one at a time, no questions, no sister._  

**Choices**

- **Say Root’s word. Everyone wakes, and everyone knows.** — sets `{"l-root":"expose"}`
    - **Juno**: Good.
- **Take the quiet exit.** — sets `{"l-root":"spare"}`
    - **Juno**: You’d leave them in here. You’d leave her.

#### <a id="l-c7-close"></a>Closing `l-c7-close`

_The white room folds up like paper. You are in the lobby with a word in your mouth and three partners looking up at you._  
**Warden**: A final bout is required to post on the board at this rank. Warden apologises for the design.  

### Chapter 8: Log Out

Goal: Win the final bouts and post the word. (`count:partyBout:>=10`) · Hint: Two more wins. Rally when it turns.

#### <a id="l-c8-open"></a>Opening `l-c8-open`

_The last bout. The foes are the company’s, and they are not polite, and they do not blink out like lights going to bed._  
**Juno**: Whatever you say after, I’m posting next to you. Witness.  

When `flag:l-root:expose`:

#### <a id="l-c8-loud"></a>Beat `l-c8-loud`

**Juno**: Everyone wakes. Say it like that, in your head, every turn. It helps. It helped me on day six.  
_Your three line up without being told. The middle one guards first, as it always has._  

When `flag:l-root:spare`:

#### <a id="l-c8-quiet"></a>Beat `l-c8-quiet`

**Juno**: I said I’d post next to you. I will. I don’t have to like the word.  
_She does not look at you. She looks at the still players, and counts them, the way she does every night._  

When `count:partyBout:>=9`:

#### <a id="l-c8-nine"></a>Beat `l-c8-nine`

_One down. The company’s foes do not regroup so much as reload, and come back with the same faces._  
**Juno**: Rally. Now. Don’t wait for two of them to be low. These ones don’t let you get low.  
**Warden**: Warden is not permitted to offer a tip at this rank. Warden suggests you guard.  

#### <a id="l-c8-close"></a>Closing `l-c8-close`

_You post the word. The board takes it. The meadow holds its breath, which it has never done before._  

**Choices**

- **Ask Juno to come find you outside.** — sets `{"l-juno":"stayed"}`
- **Say goodbye properly.** — sets `{"l-juno":"left"}`

### Endings

- **Everyone Wakes** (`everyone-wakes`): Say Root’s word at the root node, and keep all three partners through the last bout.
- **The Quiet Exit** (`quiet-exit`): Take the company’s word.
- **One Short** (`one-short`): Say Root’s word, having lost a partner along the way.

#### <a id="l-end-everyone-wakes-stayed"></a>Scene `l-end-everyone-wakes-stayed`

_Every scoreboard in the meadow goes white. Then the meadow goes. Then a ceiling, a bedroom, a visor in your hands that smells of your own hair._  
_Down the hall, a door opens that has been shut for a year. Someone says your name as if they have been practising it._  
_In the morning it is on every news site. In the evening three small shapes are asleep on your bed, which should not be possible, and is._  
_A week later your phone buzzes._  
**Juno** _(happy)_: Witness. I’m outside. I brought the cat. The cat is fine.  

#### <a id="l-end-everyone-wakes-left"></a>Scene `l-end-everyone-wakes-left`

_Every scoreboard in the meadow goes white. Then the meadow goes. Then a ceiling, a bedroom, a visor in your hands that smells of your own hair._  
_Down the hall, a door opens that has been shut for a year. Someone says your name as if they have been practising it._  
_In the morning it is on every news site. In the evening three small shapes are asleep on your bed, which should not be possible, and is._  
_Somewhere across the city a girl wakes up and feeds a cat._  
_You said goodbye properly, and it still counts._  

#### <a id="l-end-quiet-exit-stayed"></a>Scene `l-end-quiet-exit-stayed`

_A door, one at a time, no questions. You wake in your bedroom with the visor on the floor and nobody saying your name._  
_The game is still up. Juno’s session is still in it. Down the hall, a shut door stays shut._  
_Three small shapes on the bed, looking at you the way they looked at the too-green grass: deciding something._  
_Every night a new post appears under yours on the board._  
**Juno** _(soft)_: Still in. Still counting. Witness.  
_You answer every one._  

#### <a id="l-end-quiet-exit-left"></a>Scene `l-end-quiet-exit-left`

_A door, one at a time, no questions. You wake in your bedroom with the visor on the floor and nobody saying your name._  
_The game is still up. Juno’s session is still in it. Down the hall, a shut door stays shut._  
_Three small shapes on the bed, looking at you the way they looked at the too-green grass: deciding something._  
_Her last post sits under yours on the board: “Go well.”_  
_Nothing comes after it. You check anyway, most nights._  

#### <a id="l-end-one-short-stayed"></a>Scene `l-end-one-short-stayed`

_Every scoreboard goes white. You wake. Down the hall a door opens, and someone says your name._  
_Two small shapes on the bed. The third was the one who guarded when they looked at you funny, and did not get up._  
_In the morning there is a flower on the sill that nobody planted, and you leave it there._  
_A week later your phone buzzes._  
**Juno** _(happy)_: Witness. I’m outside. I brought the cat. The cat is fine.  

#### <a id="l-end-one-short-left"></a>Scene `l-end-one-short-left`

_Every scoreboard goes white. You wake. Down the hall a door opens, and someone says your name._  
_Two small shapes on the bed. The third was the one who guarded when they looked at you funny, and did not get up._  
_In the morning there is a flower on the sill that nobody planted, and you leave it there._  
_Somewhere across the city a girl wakes up and feeds a cat._  
_You said goodbye properly, and it still counts._  

#### <a id="end-logged-everyone-wakes"></a>Ending scene `end-logged-everyone-wakes`

_Logged In: Everyone Wakes._  

#### <a id="end-logged-quiet-exit"></a>Ending scene `end-logged-quiet-exit`

_Logged In: the Quiet Exit._  

#### <a id="end-logged-one-short"></a>Ending scene `end-logged-one-short`

_Logged In: One Short._  

**Notes:** Areas: day, night (the Sun and Moon Grove recolours, both unlocked by the rule). The bout button opens the party bout panel at the chapter’s tier. l-c5-thread and l-c6-wage are teen. The lost-partner beat (l-c6-lost) is in chapter 6 only, so a loss elsewhere is carried by the ending.
