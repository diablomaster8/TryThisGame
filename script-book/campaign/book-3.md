# Hazel's Grove: The campaign, Book 3: The Long Night

## Chapter 9: Corvin’s Garden

Goal: Go up the valley to Corvin’s garden, and decide what to do. (`corvinChoice`) · Hint: The choice is made in the scene. Whatever you choose, something comes home with you.

#### <a id="c9-open"></a>Opening `c9-open`

_The road up the valley climbs into frost. It is nearly midwinter, but this frost was here in August too._  
_Ember walks beside you with her hands in her pockets. She hasn’t said a word since the bridge._  
_Corvin’s garden is clean, square and silent._  
_Grey Nubbins stand in grey rows. Not one of them is touching another._  
_The railings are furred white. The grass crunches._  
_Your breath hangs in the air in front of you and does not drift._  
**Corvin Vale**: You came. Good. And you brought Ember, who hates me. That’s fair. I’d have brought someone who hated me.  
**Corvin Vale**: Look at them. Not one has ever thrown a race, bitten a judge, or run off into the night. Yours can’t say that.  
**Ember** _(angry)_: Ash is in the third row. She won’t look at me. You did that.  
**Corvin Vale**: I made her a champion, Ember. You made her a pet. One of those lasts.  
_Ember’s hands are shaking. Corvin’s are not._  
_They are very white, and he keeps the left one pressed flat to his coat._  
_Over the breast pocket. Always over the breast pocket._  
**Corvin Vale** _(think)_: You’ve read her notebook. I can see it on you. She writes everything down.  
**Corvin Vale**: She’ll have written that I stole from her. I did. She’ll have written that I was cruel. I never was. Not once.  
**Corvin Vale** _(think)_: She came here, you know. In the autumn. Stood at my gate for an hour and didn’t knock. Then she went back to her strays.  
**Corvin Vale**: They don’t go hungry here unless they choose to. They’re never thrown. They don’t get sick, or lost, or frightened.  
_He looks along the rows the way some people look at a bookshelf they have dusted every day for years._  
**Corvin Vale** _(sad)_: Hers ran away. Hers got sick. Hers died in her arms, and she cried on the hill, and called it love.  
**Corvin Vale**: I wanted them safe. I still want it. I have never understood why that makes me the villain of her story.  
_Somewhere in the rows, a grey Nubbin sneezes._  
_It does not move. None of the others look round._  
**Ember** _(think)_: Bless you.  
_She says it without thinking. Nobody in this garden has heard those words in years._  
_Every grey eye in the garden is on you, waiting for the next bad thing._  

**Choices**

- **Tell him what Hazel wrote. Make him look at them.** — sets `{"corvin":"reconciled"}`
    - You open the notebook and read it to him.
    - Day 300-something. The brown one let me touch her ear.
    - Took two months. Worth it.
    - He listens with his eyes shut.
    - **Corvin Vale**: …She said that to me once. “Took two months. Worth it.” I told her I didn’t have two months.
    - **Corvin Vale**: I was twenty-two. I had nothing but months.
    - He opens his eyes. He looks at the third row for a long time, the way you look at something you have walked past every day.
    - Then he goes to the gate and opens it, and does not close it.
    - **Corvin Vale**: Tell Ember Ash can go. Tell her I never made it quicker. I only made it quieter.
    - **Ember**: Tell me yourself.
    - …
    - **Corvin Vale**: Ash can go, Ember.
    - Ash does not move for a long time. Then she walks out of the third row, past Ember, not looking at her.
    - Ember follows her down the road, three steps behind, the way you follow something you must not frighten.
- **Buy Ash back. Whatever it costs.** — sets `{"corvin":"bargained","boughtBack":true}`
    - **Corvin Vale**: Two hundred. The same as always. A fair price for a champion who no longer wins.
    - You count it out onto the gatepost. The Shells stick to the frost, and you have to prise each one off with your thumb.
    - Ash walks out beside Ember without looking at either of you. She is grey, and she is going home, and both are true.
    - **Ember**: I don’t know how to thank you. I’ll work it out. Give me a few years.
- **Open every pen. Now.** — sets `{"corvin":"forced","freedByForce":true}`
    - You throw the latches, one after another. The iron is so cold your fingers stick to it.
    - The grey Nubbins do not move. They have never been told they could.
    - Then Ash takes one step. Then all of them: a grey tide pouring out past Corvin, past you, into the trees, towards the Hollow and the dark.
    - **Corvin Vale**: You think you freed them. You scattered them. Half will starve.
    - **Corvin Vale**: Hazel would have fed them one at a time for a year. You had an afternoon.
    - **Ember**: She looked at me. On her way past. She looked at me.

> Chapter 9 opening, Corvin’s garden, nearly midwinter, frost as in August. Ember present. Choice ids/sets/friendship unchanged (confront → reconciled, bargain → bargained + boughtBack, force → forced + freedByForce), so applyChoice’s bargain side effect still runs. Ash leaves the garden in all three branches (so S6 can open after ch9). No side-story options here (bible conflict 17). Verbatim: “I never made it quicker. I only made it quieter.” No numeric grey count. Corvin says Hazel stood at his gate in the autumn for an hour without knocking (where she was between ch8 and ch10; canon). Lines and choices are the shared consts C9_ARRIVE, C9_GARDEN and C9_CHOICE.

#### <a id="c9-partner"></a>Scene `c9-partner`

_The night before you go up the valley, a note comes under the door._  
_The paper is very good. The handwriting is very neat._  
_The envelope is cold, as if it has been kept in a pocket next to something colder._  
**Corvin Vale**: “Partner. Come up tomorrow. I’d like to show you what your two hundred Shells became.”  
**Corvin Vale**: “It’s doing well. Quiet. Nothing has hurt it since the day you let it go.”  
**Corvin Vale**: “You understood something that afternoon that Hazel never did. Come and see. C.V.”  
_You read it twice. Then you put it in the drawer, under Hazel’s letter, and then you take it out again and put it somewhere else._  

> Collector route only (soldNubbin && !boughtBack at the start of ch9). Plays BEFORE c9-open (queue it first in beginChapter(9)). Corvin’s note, the evening before. Mirrors Hazel’s letter; he calls you partner.

#### <a id="c9-open-sold"></a>Scene `c9-open-sold`

_The road up the valley climbs into frost. It is nearly midwinter, but this frost was here in August too._  
_Ember walks beside you with her hands in her pockets. She hasn’t said a word since the bridge._  
_Corvin’s garden is clean, square and silent._  
_Grey Nubbins stand in grey rows. Not one of them is touching another._  
_The railings are furred white. The grass crunches._  
_Your breath hangs in the air in front of you and does not drift._  
_In the second row stands one with a number painted on its side in neat white paint._  
_It was yours. It does not look up._  
**Corvin Vale**: You came. Good. And you brought Ember, who hates me. That’s fair. I’d have brought someone who hated me.  
**Corvin Vale**: Look at them. Not one has ever thrown a race, bitten a judge, or run off into the night. Yours can’t say that.  
**Ember** _(angry)_: Ash is in the third row. She won’t look at me. You did that.  
**Corvin Vale**: I made her a champion, Ember. You made her a pet. One of those lasts.  
_Ember’s hands are shaking. Corvin’s are not._  
_They are very white, and he keeps the left one pressed flat to his coat._  
_Over the breast pocket. Always over the breast pocket._  
**Corvin Vale** _(think)_: You’ve read her notebook. I can see it on you. She writes everything down.  
**Corvin Vale**: She’ll have written that I stole from her. I did. She’ll have written that I was cruel. I never was. Not once.  
**Corvin Vale** _(think)_: She came here, you know. In the autumn. Stood at my gate for an hour and didn’t knock. Then she went back to her strays.  
**Corvin Vale**: They don’t go hungry here unless they choose to. They’re never thrown. They don’t get sick, or lost, or frightened.  
_He looks along the rows the way some people look at a bookshelf they have dusted every day for years._  
**Corvin Vale** _(sad)_: Hers ran away. Hers got sick. Hers died in her arms, and she cried on the hill, and called it love.  
**Corvin Vale**: I wanted them safe. I still want it. I have never understood why that makes me the villain of her story.  
_Somewhere in the rows, a grey Nubbin sneezes._  
_It does not move. None of the others look round._  
**Ember** _(think)_: Bless you.  
_She says it without thinking. Nobody in this garden has heard those words in years._  
_Every grey eye in the garden is on you, waiting for the next bad thing._  

**Choices**

- **Tell him what Hazel wrote. Make him look at them.** — sets `{"corvin":"reconciled"}`
    - You open the notebook and read it to him.
    - Day 300-something. The brown one let me touch her ear.
    - Took two months. Worth it.
    - He listens with his eyes shut.
    - **Corvin Vale**: …She said that to me once. “Took two months. Worth it.” I told her I didn’t have two months.
    - **Corvin Vale**: I was twenty-two. I had nothing but months.
    - He opens his eyes. He looks at the third row for a long time, the way you look at something you have walked past every day.
    - Then he goes to the gate and opens it, and does not close it.
    - **Corvin Vale**: Tell Ember Ash can go. Tell her I never made it quicker. I only made it quieter.
    - **Ember**: Tell me yourself.
    - …
    - **Corvin Vale**: Ash can go, Ember.
    - Ash does not move for a long time. Then she walks out of the third row, past Ember, not looking at her.
    - Ember follows her down the road, three steps behind, the way you follow something you must not frighten.
- **Buy Ash back. Whatever it costs.** — sets `{"corvin":"bargained","boughtBack":true}`
    - **Corvin Vale**: Two hundred. The same as always. A fair price for a champion who no longer wins.
    - You count it out onto the gatepost. The Shells stick to the frost, and you have to prise each one off with your thumb.
    - **Corvin Vale**: And that one. Yours, once. The two hundred covers it.
    - Your old Nubbin walks out behind Ash, number and all. It doesn’t look at you, but it comes anyway.
    - Ash walks out beside Ember without looking at either of you. She is grey, and she is going home, and both are true.
    - **Ember**: I don’t know how to thank you. I’ll work it out. Give me a few years.
- **Open every pen. Now.** — sets `{"corvin":"forced","freedByForce":true}`
    - You throw the latches, one after another. The iron is so cold your fingers stick to it.
    - The grey Nubbins do not move. They have never been told they could.
    - Then Ash takes one step. Then all of them: a grey tide pouring out past Corvin, past you, into the trees, towards the Hollow and the dark.
    - **Corvin Vale**: You think you freed them. You scattered them. Half will starve.
    - **Corvin Vale**: Hazel would have fed them one at a time for a year. You had an afternoon.
    - **Ember**: She looked at me. On her way past. She looked at me.

> NEW. Plays INSTEAD of c9-open on the Collector route (soldNubbin && !boughtBack at the start of ch9): set chapter 9’s opening to this id, or queue it and mark c9-open seen. Identical to c9-open plus one line: your sold Nubbin in the second row, its number painted on its side (pays off c9-partner’s “what your two hundred Shells became” and c5-sold). Same choice ids and sets, so applyChoice’s c9-open bargain side effect must also run for c9-open-sold. Its own choice set, C9_CHOICE_SOLD, is C9_CHOICE except that bargain adds two lines after the Shells line: Corvin includes your old Nubbin in the two hundred, and it walks out behind Ash (the side effect brings it home).

#### <a id="c9-shard-reconciled"></a>Scene `c9-shard-reconciled`

_The garden is empty. Corvin stands by the open gate with his hand flat on his coat._  
**Corvin Vale** _(think)_: There’s something else. You’ll have guessed. She guessed, I expect, years ago. She always knew where things were.  
_He takes it out of his breast pocket._  
_It is a flat tin, the kind throat sweets come in. The paint is worn to bare metal where a thumb has rubbed it._  
_It is furred with frost. The air round it is so cold it hurts your teeth._  
**Corvin Vale** _(sad)_: I dug it up from under her lantern the autumn I was twenty-two. I meant to put it back by spring.  
**Corvin Vale**: I was going to show her it could be done kindly. It can’t. It only does one thing. It just does it so quietly you don’t notice for twenty years.  
_He holds it out. His hand is blue to the wrist._  
**Corvin Vale**: Take it. Please. Before I think about it.  
_You take it. It is heavier than a tin should be, and colder than anything, and very slightly humming._  
_Corvin tucks his empty hand under his arm. He looks surprised, as if he had forgotten there were other places to keep a hand._  
**Corvin Vale** _(soft)_: I haven’t been warm in twenty-two years.  
_He doesn’t walk you to the road. When you look back he is still standing in his empty garden, both hands in his armpits, like a boy told to wait._  

> Plays straight after c9-open (or c9-open-sold) whenever corvin = reconciled, the Collector route included: once Corvin has opened his gate, he gives the tin out of remorse, not as a partner. Corvin gives you the tin. “I haven’t been warm in twenty-two years.” Art: frost-furred tin; Corvin’s hand tinted blue.

#### <a id="c9-shard-bargained"></a>Scene `c9-shard-bargained`

_Ember and Ash are halfway down the road. You turn to follow, and Corvin says your name._  
**Corvin Vale** _(think)_: Wait. You’ve paid for the champion. Have the rest.  
_He takes something from his breast pocket and tosses it to you underhand, the way you’d toss someone their keys._  
_You catch it, and gasp._  
_It is a flat tin, the kind throat sweets come in. The paint is worn to bare metal where a thumb has rubbed it._  
_It is furred with frost. The air round it is so cold it hurts your teeth._  
**Corvin Vale**: Hazel’s. Or the valley’s. Or nobody’s. I’ve stopped knowing.  
**Corvin Vale**: Take it. It never worked on anything that mattered.  
_He wipes his empty hand down his coat, hard, as if something has come off on it._  
**Corvin Vale**: That’s the end of our business. Mind the ice on the road.  

> Plays after c9-open when corvin = bargained (this always clears the collector route, since boughtBack is set). He tosses the tin in with Ash’s price: “Take it. It never worked on anything that mattered.”

#### <a id="c9-shard-forced"></a>Scene `c9-shard-forced`

_The last grey tail vanishes into the trees._  
_The pens hang open. The ground is churned to frozen mud._  
_Corvin is on his knees._  
_Somebody knocked him over in the rush. Possibly everybody._  
_Something has fallen from his coat into the frost. And the frost is growing outwards from it, as you watch._  
_It is a flat tin, the kind throat sweets come in. The paint is worn to bare metal where a thumb has rubbed it._  
_It is furred with frost. The air round it is so cold it hurts your teeth._  
**Corvin Vale** _(shock)_: Leave that.  
_You pick it up. It is so cold it burns, and very slightly humming, and much heavier than a tin should be._  
**Corvin Vale** _(angry)_: Give it back. You don’t know what it is. You don’t know what it’s for.  
_He gets one foot under him and reaches for it. Then he stops with his hand out, and looks at the hand, as if he has never seen it empty._  
**Corvin Vale** _(sad)_: …No. Keep it. Keep it, and see how long you last.  
_Ember takes your arm and walks you to the road. She doesn’t let go until the frost stops crunching under your boots._  
**Ember** _(angry)_: Whatever that is, don’t let it near Ash. Don’t let it near anyone.  
_On the road home, something grey is following Ember, three steps behind._  
_Ember doesn’t look round. She doesn’t dare._  

> Plays after c9-open when corvin = forced and NOT (soldNubbin && !boughtBack). He drops it in the stampede; you pick it up off the frozen ground. Last line: Ash following Ember home, three steps behind (she went into the trees with the grey tide; this is how she is at the Long Night).

#### <a id="c9-shard-collector"></a>Scene `c9-shard-collector`

_The last grey tail vanishes into the trees._  
_The pens hang open. Corvin looks at them for a long time._  
_Then, of all things, he laughs._  
**Corvin Vale** _(think)_: Quick. Nobody asked them. Nobody asked me. That’s my method, partner. You’ve just used it on me.  
_He takes it out of his breast pocket._  
_It is a flat tin, the kind throat sweets come in. The paint is worn to bare metal where a thumb has rubbed it._  
_It is furred with frost. The air round it is so cold it hurts your teeth._  
**Corvin Vale**: I’ve carried this for twenty-two years. It’s the reason my garden was quiet. Nothing in it was ever lost, or hurt, or frightened.  
**Corvin Vale** _(soft)_: Take it. You’ll want it now. You understand what it’s for. The others never will.  
_He presses it into your hands and folds your fingers over it. His fingers are colder than the tin._  
**Corvin Vale**: With this, they’ll never leave you.  
_It is heavy and humming and so cold it burns._  
_And then, which is worse, it doesn’t. It feels like nothing at all._  
_When you look up he is smiling, the way he smiled at your gate the first day._  
_He means it as a kindness. That is the worst part._  
_On the road home, something grey is following Ember, three steps behind._  
_Ember doesn’t look round. She doesn’t dare._  

> Plays after c9-open-sold INSTEAD of c9-shard-forced on the Collector route (soldNubbin && !boughtBack) when corvin = forced. That is the only Collector case it covers: reconciled plays c9-shard-reconciled, and bargained always sets boughtBack, which leaves the route. Corvin sees his own method in your force (quick; nobody asked) and gives the tin as a gift: “With this, they’ll never leave you.” The tin stops feeling cold in your hands (seed for the temptation in ch10). Ends, like -forced, with Ash following Ember home.

#### <a id="c9-sable"></a>Scene `c9-sable`

_Sable is waiting at the gate when you get back. She waited here once before, the morning you went to the Hollow._  
_This time she gets up and comes to meet you._  
_She puts her nose to your coat, to the pocket where the tin is, and breathes in._  
_She doesn’t flinch. She sits down, and looks at the pocket, and then up at you, for a long time._  
**Luna** _(soft)_: She knows that cold. She knows it better than any of us ever will.  

> Plays after the shard variant and before c9-close if Sable is still in the world (any trust). She waited at the gate once before (C8_GATE, book two); this time she comes to meet you. She sniffs the tin and does not flinch: seeds her as the bearer. Luna present (spawn if needed).

#### <a id="c9-close"></a>Closing `c9-close`

**Marina**: Whatever you did up there, the valley’s already talking about it.  
**Marina** _(think)_: Fern says it was brave. Byte says it was statistically unwise. Both of them are right. That’s the trouble with this valley.  
_On your step is a pie from Fern, still warm, with a note on top._  
_RULE ONE, THE SECOND HALF. THE BIT SHE NEVER DID._  
**Marina** _(think)_: She baked two, you know. Won’t say where the other one went. Went pink when I asked.  
_Dusk. The tin is in your coat, and the coat is stiff with frost down that side._  
_Moss is waiting at the foot of the hill._  
_You didn’t see him come down. You can see the grass through him._  
**Moss**: …Show me.  
_You open the tin. Inside, on a bed of grey felt, is a shard of something like ice._  
_Dark at the heart. No longer than your thumb._  
_Moss looks at it for a long time._  
**Moss** _(soft)_: Cinder.  
**Moss** _(sad)_: She made it to save them. She did save them. That is the trouble with it.  
**Moss** _(think)_: I promised Hazel I wouldn’t tell you where it had gone. She wanted him to walk it down this lane himself.  
**Moss**: He couldn’t. You did. I will let her decide how she feels about that.  
_For the first time in twenty-two years, all four pieces of the Heartstone are in the Grove._  
_Three are asleep under their lanterns. This one is awake._  
_You can feel it, like a draught from a door left open._  
**Moss**: Put it under the long grass for now, where I laid it. It won’t sleep. It has been awake too long, in a coat, next to a heart.  
_You do. As you kneel, the glass of the dark fourth lantern above you frosts over, white, from the bottom up._  
**Moss**: There is one place to unmake it. Where it was made. The Wellspring, behind the falls.  
**Moss** _(think)_: On the longest night of the year the falls freeze and the spring opens. What came out of it can go back in.  
**Moss**: The other three sleep. Let them. Some things you keep by keeping watch.  
**Moss**: Only a grey one can carry it close. The cold has already done its worst to the grey. It has nothing new to say to them.  
**You**: So. The longest night, the Wellspring, and someone grey carries it.  
**Moss**: Yes. Three days. Eat something first.  
**Moss** _(sad)_: None of us was grey, then. We could only break it, and wait.  
**Moss** _(soft)_: …I am grey enough.  
_He doesn’t go back up the hill. He sits by the long-grass post all night, and you sit with him, and neither of you says anything._  
_By morning the frost has crept from the long grass halfway to the pond. Moss is a little harder to see._  
_Three days to the longest night._  

> Chapter 9 closing (after corvinChoice). Back at the Grove at dusk; Marina’s line, then Moss names the shard (Cinder) and the plan: the Wellspring, the longest night, only the grey can carry it. The tin is buried under the Long-Grass post; frost spreads from the long grass towards the pond. Moss very faint (art: Moss alpha ~0.5 from here to ch10 dawn). All four shards home; three days to the longest night. Opens S6 (only if Ash left the garden: always true now). Small warmth before the cold: Fern’s pie on the step, its note calling back Marina’s “feed yourself” (c2-open). Moss answers why only the fourth shard, and why not long ago: the other three sleep and are kept by watching, and none of the wardens was grey then. Route-neutral: Hazel wanted Corvin to walk it down the lane himself; he couldn’t.

## Chapter 10: The Long Night

Goal: Light all four lanterns at dusk, and keep them burning through the longest night. (`lanternsAgain`) · Hint: Tap each lantern post to light it, and relight any the cold puts out. How often you petted Moss before tonight matters now.

#### <a id="c10-open"></a>Opening `c10-open`

_The longest night. The sun gets up late and low, and doesn’t try very hard._  
_The frost has reached the pond. There is a skin of ice on the water, thin as a page._  
_Moss is on the hill, sitting exactly where he sat the first day. When you climb up, you can see the hill through him._  
**Moss** _(soft)_: Eternals don’t age. We fade. We are made of being remembered, and the ones who remembered me best are mostly flowers now.  
**Moss** _(soft)_: The girl with the bucket. Briar. Hush.  
_He doesn’t say the next name. You hear him not say it._  
**Moss**: Tonight all four lanterns must be lit, and kept lit, until the sun comes back. The cold will come at them. Let it.  
**Moss**: It isn’t the light that matters. It’s the gathering. The light is only how people know where to stand.  
**Moss** _(think)_: And at the turn of the night, someone takes that tin to the water.  
**You**: You said you were grey enough.  
**Moss** _(soft)_: I did say that.  
_Below you, the gate goes: a lift, a push, a squeal of hinges. Somebody has come early._  
_Fern, with a lantern and a flask and a blanket she has very obviously borrowed from a horse._  
**Fern**: I didn’t know what to bring, so I brought everything that was near the door.  
_Then Sparks, with a coil of wire over one shoulder and a lantern under each arm. Then Pixel, with the timing box wrapped in a scarf like a baby._  
**Sparks** _(happy)_: Nobody touch the wiring. I’ve wired it for cold. I’ve never wired anything for cold. It’s going to be great.  
**Pixel** _(think)_: It’s going to be fine. I’ve put in a backup. And a backup for the backup.  
_Clover, with soup. Luna, who has been up since yesterday and says this is her normal._  
_Dusty, with a spade, in case of what they won’t say._  
_Nova, who walked in over the ridge with snow on her hat and says it’s nothing to the high passes._  
_Marina, with rope. She doesn’t say what for._  
_She looks up the valley towards the falls, and then at you._  
_Ember, last, with a lantern._  
_Ash walks a step behind her heel, grey, looking at nobody. But she came._  
_And Byte, with a clipboard._  
**Byte** _(think)_: Statistically, an Eternal that has been petted regularly fades sixty per cent slower. I ran the numbers.  
**Byte**: I would like it noted that I ran them while believing it was a hoax.  
**Moss** _(soft)_: Noted.  
_Byte can’t hear him. Byte nods anyway._  
_The sun touches the ridge. Moss looks down at all of them, all of you, coming in at the gate one at a time._  
**Moss** _(soft)_: Light them.  

> Chapter 10 opening, the longest night’s afternoon. Pond iced; Moss very faint on the hill. Verbatim “Eternals don’t age. We fade…”. All ten Keepers arrive (no side-story gating; Ash comes with Ember in every route). Byte cannot hear Moss here (the payoff is c10-moss-stays). Then the goal: light the four lanterns. FULL CH10 ORDER: c10-open → [c10-sable-watch] → goal lanternsAgain → c10-vigil → [c10-vigil-wisp] → timed vigil step (hold four lanterns, no fail state; c10-lull plays partway through it) → c10-falls → c10-bearer-sable | c10-bearer-moss → c10-ledge → c10-edge (choice). KEEP: c10-kept → c10-close. UNMAKE: c10-safe-sable | c10-safe-moss → c10-wisp | c10-moss-walks | c10-moss-walks-bearer → c10-bank-wisp | c10-bank-moss-returned | c10-bank-moss-gone → c10-dawn → c10-moss-stays | c10-moss-fades | c10-moss-mourned → [c10-moss-light] → c10-close → [c10-bramble]. Chapter 11 begins after the last.

#### <a id="c10-sable-watch"></a>Scene `c10-sable-watch`

_All afternoon, Sable sits by the long-grass post, two steps from where the tin is buried, with her back to it._  
_As if she is guarding it from everyone. Or everyone from it._  
_Clover’s grey blanket is over her back. Clover put it there an hour ago and walked away, and Sable has let it stay._  
**Luna** _(soft)_: She hasn’t eaten. She won’t come away. I’ve stopped asking.  

> Optional, right after c10-open, only if Sable is bonded (she will be the bearer). Luna present. Clover’s grey blanket (c3-close) is on her back.

#### <a id="c10-vigil"></a>Scene `c10-vigil`

_Four lanterns, lit. Pond, stream, old wall, long grass._  
_And round each post, people, holding lanterns of their own._  
_The fourth burns low and blue. The tin is underneath it, and the frost round the post is a hand’s width thick._  
_Night comes down, very clear, very still. Past the ridge you can hear the falls, the way you always can._  
_The first cold comes an hour after dark._  
_It comes out of the long grass like a breath let out._  
_Frost runs up the posts. Every flame in the Grove lies down flat._  
**Sparks** _(shock)_: Hold them! Hands round the glass! Not on the glass, ROUND it!  
_The stream lantern goes out. Pixel’s timing box clicks, and clicks, and gives a small sad beep._  
**Pixel** _(shock)_: Backup’s frozen. Backup for the backup’s frozen.  
**Sparks**: Then we light it by hand, like the olden days. Fern, matches.  
**Fern**: Why would I have matches?  
_Fern has matches. Fern has, it turns out, everything that was near the door._  
_The stream lantern catches. The cold passes the way a wave passes, and the flames stand up again._  
_Between the waves, people talk. That is most of what a vigil is._  
**Clover** _(happy)_: Soup. Everyone has soup. I don’t care if you aren’t hungry. You’re holding a lantern, you’re working.  
**Dusty** _(soft)_: Fossil hated the cold. She used to ride in my coat. I keep putting my hand in the pocket.  
**Nova**: In the high passes they say: stand closer than is polite. Nobody minds, on a night like this.  
_So everyone stands closer than is polite. Nobody minds._  
**Luna** _(soft)_: This is my hour. I’ve sat up a thousand nights. Never one with this many people in it.  
**Byte** _(think)_: The waves are about forty minutes apart. I’m saying it out loud because saying it out loud helps.  
**Byte**: It helps me. It may not help you.  
_The second cold comes. It is worse._  
_It comes from the long grass in a white rush you can see, and the fourth lantern shrinks to a blue bead._  
**Ember** _(angry)_: No. No, you don’t.  
_Ember takes off her coat and wraps it round the post, round the glass, and puts both arms round all of it._  
_Ash presses against the backs of her legs, and stays there._  
_The blue bead holds. Just._  
**Ember** _(angry)_: Nobody say anything.  
_Nobody says anything. Clover passes Ember a soup._  
_Then, after a moment, she takes off her own scarf and puts it round Ember’s neck._  
_It gets colder. The kind of cold that makes you forget your hands are yours._  
_Somebody starts to sing. Luna, you think._  
_Quietly, the way you sing to something sleeping._  
**Luna** _(soft)_: Slow hands, warm hearts, the gate stuck fast —  
**Everyone** _(soft)_: what’s kept with love is kept to last.  
_Everyone has it by the second line. Even Byte, who says he doesn’t know the words, and does._  
**Everyone** _(soft)_: Light one for the ones who went up the rise  
**Everyone** _(soft)_: with the morning sun in their sleeping eyes;  
**Everyone** _(soft)_: we are made of the ones who remember us here,  
**Everyone** _(soft)_: so we gather, we gather, we gather each year.  
_Up on the hill, Moss is listening. In the lantern light he is a little easier to see._  
_Only a little. You are almost sure._  

> Plays when lanternsAgain is met (all four lit). The fellowship scene; every Keeper holds a lantern. Three waves of cold (timed vigil gameplay can follow the same rhythm: wave 1 blows out the stream lantern; wave 2 shrinks the Long-Grass lantern to a blue bead; wave 3 is the song). Lantern Song lines as written, one song line per Line: Luna starts the chorus alone, then speaker chorus (everyone) takes it from the second line (UI may italicise; voice-over: one music cue). No grey-Nubbin count. Long-Grass lantern renders low and blue until dawn. Then [c10-vigil-wisp], then the timed vigil step, with c10-lull partway through it.

#### <a id="c10-vigil-wisp"></a>Scene `c10-vigil-wisp`

_At the edge of the light, in the long grass, there is a thin grey shape with a torn ear._  
_Wisp isn’t watching the lanterns. He is watching the fourth post, and what is buried under it, the way he once watched Sable’s fruit._  
**Wisp** _(soft)_: …warm.  
_It is the coldest thing in the Grove. To him, you realise, it has always looked like the warmest._  
**Clover** _(soft)_: Leave him be. He came. That’s something.  

> After c10-vigil, only if wisp = spared or sable (S2). Foreshadows the eucatastrophe: Wisp covets the “warm” stone.

#### <a id="c10-lull"></a>Scene `c10-lull`

_Some time after the song, in the deep middle of the night, the cold stops coming for a while._  
_Nobody trusts it. Everybody sits down anyway, on whatever is nearest: a bucket, a step, Dusty._  
**Dusty**: I don’t mind. I’m warm. I’ve been digging.  
_Pixel is asleep across the timing box, cheek on the dial. It beeps, very softly, at every out-breath._  
**Fern** _(happy)_: I brought biscuits. They’ve frozen. You can still suck them.  
_The biscuits taste of ginger and lantern smoke. Sparks has four._  
_Nobody counts. Byte counts._  
_Pixel opens one eye as Byte steps over her._  
**Pixel**: Your lace is undone.  
**Byte**: I’m aware of the lace.  
**Pixel** _(happy)_: He’s been aware of it since our wedding. All the way down the aisle.  
**Byte**: It was a short aisle. Statistically, I nearly made it.  
_She is asleep again before he has finished. He tucks her scarf over the dial so the beeping won’t wake her._  
_Then Byte sits down next to you on the cold grass._  
_He stopped writing on his clipboard an hour ago. He holds it like a hot-water bottle._  
**Byte** _(think)_: Can I ask you something unscientific?  
**Byte**: If it works. If the cold stops, and the morning comes, and the fourth lantern lights. What will have done it?  
**Byte**: The lanterns? Or us? I can’t design a test. There’s no control group for a night like this.  

**Choices**

- **The lanterns. Light is light.**
    - **Byte**: Thank you. That’s measurable. I find that very comforting.
    - **Byte**: …I don’t believe you. But I find it very comforting.
- **Us. The lanterns just show people where to stand.**
    - **Byte**: That sounds like something Moss would say. I can’t hear him. I’m starting to think that’s my fault.
    - He writes it down anyway: one line, slowly, on a clipboard that has frozen to his glove.
- **Does it matter, if the morning comes?**
    - **Byte**: Yes. Enormously. To me.
    - **Byte**: …Not tonight, though. Tonight I’ll take the morning however it comes.

> New. Plays partway through the timed vigil step (after the song, a quiet spell between waves), every route, before c10-falls. Comic warmth (Dusty as a seat, Pixel asleep on the beeping timer, waking once to tease her husband Byte about his lace (canon 38), Fern’s frozen biscuits) and Byte’s question the player answers: was it the lanterns or the people? Choices lull-lanterns | lull-us | lull-matter change Byte friendship only, no flags. Byte still cannot hear Moss (payoff c10-moss-stays).

#### <a id="c10-falls"></a>Scene `c10-falls`

_And then, somewhere past the ridge, the falls stop._  
_You have heard them every night since you came here, without ever once hearing them._  
_Now there is nothing. The silence is enormous._  
**Marina** _(think)_: That’s it. That’s the turn.  
**Marina**: The falls are frozen. The spring’s open. We’ve got till dawn, and the ledge will be ice.  
_Moss comes down the hill._  
_It takes him a long time. Nobody hurries him._  
**Moss** _(think)_: The rest of them hold the lanterns. Until the sun’s up. Whatever they hear.  
**You**: Moss says hold them. Till the sun’s up. Whatever you hear.  
**Sparks**: What would we hear?  
_Moss doesn’t answer that. You don’t pass it on._  
_You kneel at the long-grass post and dig. The tin is frozen into the earth._  
_It comes free with a crack like a knuckle._  
_You open it. The shard lies in its grey felt, and the cold off it makes your eyes stream._  

> After the vigil step, at the turn of the night. Sound: the falls ambience cuts to silence on line 1. Moss speaks only to you; you relay his order to hold the lanterns. You dig the tin out of the Long-Grass post. Then the bearer variant.

#### <a id="c10-bearer-sable"></a>Scene `c10-bearer-sable`

_Moss bends towards it. Before he can reach it, something grey steps between you._  
_Sable. She looks at the shard._  
_She looks at Moss. Then she looks at you, for a long moment, the way she looked at your hands the first night._  
**Luna** _(sad)_: Oh, sweetheart. No.  
**Moss** _(soft)_: …Yes.  
**Moss** _(think)_: Only the grey can carry it close. I am grey with age. She is grey with what was done to her. That kind goes all the way through.  
**Moss**: It has already done its worst to her. It has nothing new to say. That is the sad thing. Tonight it is also the useful thing.  
_Sable bends her head and picks up the shard in her mouth, as gently as an egg._  
_The frost runs up her muzzle and stops._  
_She shivers once, all over. She does not go still._  
_Luna crouches and puts her forehead against Sable’s, just for a second. Then she goes back to her lantern without a word._  

Sets `{"stoneBearer":"sable"}`

> After c10-falls when Sable is bonded (sable.bond). She takes the shard in her mouth “as gently as an egg”. Sets stoneBearer = sable.

#### <a id="c10-bearer-moss"></a>Scene `c10-bearer-moss`

**Moss** _(soft)_: Mine. I laid it there. I can carry it the rest of the way.  
_He bends and takes it, the way you take something out of a fire: quickly, without flinching, because flinching is worse._  
_The frost climbs his face and settles in the creases. He is so faint now that the shard seems to float by itself._  
**Moss** _(soft)_: There. Not so bad. Briar would have made a joke about it. I can’t think of one.  
_Nobody else can hear him. They see an old grey shape with ice on his face and a blue light in his mouth._  
_They stand a little straighter at their lanterns._  

Sets `{"stoneBearer":"moss"}`

> After c10-falls when Sable is NOT bonded (or gone). Moss carries it himself. Sets stoneBearer = moss.

#### <a id="c10-ledge"></a>Scene `c10-ledge`

_Marina leads, with her rope and her lantern. You follow._  
_Behind you comes the stone, carried low, glowing blue through grey fur._  
_Behind all of you the four lanterns get smaller, and the singing gets quieter, and then it is only something you remember._  
_The falls hang frozen over the cliff: a long white pour of glass, stopped mid-fall. The spray stands in the air like breath._  
**Marina** _(think)_: Hands on the rock. Feet where my feet go. Don’t be brave.  
**Marina**: Brave people fall off.  
_The ledge is a hand’s width of ice. Marina ties the rope round your waist, then her own._  
_The one carrying the stone goes untied. There is no knot that small._  
**Marina** _(soft)_: Hazel came along here every week, the summer I taught hers to swim. Like a goat. Complained the whole way.  
_Behind the ice, the cave opens out. The rock glitters._  
_It is warm in here, properly warm, like a kitchen, and it smells of wet moss and spring._  
_The Wellspring is open. The frost round its rim has cracked and drawn back, and the water underneath is moving, lit from below by nothing at all._  
_You have never seen anything so old._  
_Moss told you the first ones came up out of this, each a small light. Now you believe it._  
**Marina** _(soft)_: I’ll stay at the mouth. Somebody has to hold the rope.  

> After the bearer scene. Location: the frozen falls and the Wellspring cave (warm, glittering, lit from below). Bearer-neutral text. Marina stays at the cave mouth with the rope. Party: you, the bearer, Moss (and, unseen, Wisp if spared).

#### <a id="c10-edge"></a>Scene `c10-edge`

_At the water’s edge, the stone stops humming._  
_Then it speaks. Not in words._  
_It doesn’t need words._  
_It shows you the Grove, still._  
_Every Nubbin you have ever loved, sitting quietly in the grass. Never hungry._  
_Never thrown. Never sick._  
_Nothing fades. Nothing runs into the dark._  
_Nobody ever goes up the hill._  
_Safe, it says. Safe, safe._  
_Keep me, and nothing will ever hurt them again. And nothing will ever hurt you through them._  
_It is the kindest voice you have ever heard. It sounds like someone who loved them very much._  
_Moss says nothing. He said it all once, by the frozen post, in the dawn._  
_He is trusting you to remember._  

**Choices**

- **Unmake it.** — sets `{"keptStone":false}`
    - **You**: Unmake it.
    - You say it out loud, so that it can’t pretend it didn’t hear.
- **Keep it. They’d never be hurt again.** — sets `{"keptStone":true}`
    - You hold out your hand.
    - For a moment nothing happens. Then the stone is given to you, gently, because it has been carried gently all the way here.
    - It isn’t cold. That is the first thing you notice.
    - It isn’t cold at all.
    - **Moss**: …Ah.
    - That is all he says. He turns and walks back towards the cave mouth, and does not wait for you.

> The temptation. Bearer-neutral. Choice: unmake (keptStone = false) or keep (keptStone = true → Collector ending). Moss deliberately says nothing (“He said it all once, by the frozen post”: c7-stillness-3).

#### <a id="c10-kept"></a>Scene `c10-kept`

_You walk back along the ledge with the stone in your breast pocket. Your feet don’t slip once._  
_Behind you the falls begin to run again._  
_A rim of frost stays round the spring. You don’t look back._  
_Dawn comes up grey. In the Grove three lanterns are still burning._  
_The fourth, by the long grass, has gone out._  
_The Keepers are still at their posts, swaying on their feet, faces raw with cold. They look at you, and wait for you to tell them._  
**Fern** _(think)_: Well? Is it… is it done?  
_You find you don’t want to say. You put your hand on your coat instead, over the pocket._  
**Ember** _(angry)_: …I know that. I know where I’ve seen that.  
_Moss goes up the hill without stopping, and sits with his back to the Grove._  
_The frost has gone from the grass. It doesn’t matter now._  
_Your hands are cold. They will be cold from now on._  
_When you go to the gate to look down the lane, it swings open before you touch it. It doesn’t make a sound._  

> After c10-edge keep. Walk home with the stone; the Long-Grass lantern goes out at dawn; Ember recognises Corvin’s gesture; the gate opens by itself for you (echo of c2-corvin). No Long-Grass self-lighting, no Moss/Byte exchange. A rim of frost stays round the spring (the water itself never freezes; canon). Then c10-close. Art: from here the Keeper’s hand idles on the breast pocket.

#### <a id="c10-safe-sable"></a>Scene `c10-safe-sable`

_Sable steps down into the warm water, up to her chest. The gold light comes up round her._  
_She lowers her head to let the stone go. And stops._  
_She can’t. Her jaw won’t open._  
_She stands in the water with the stone in her mouth, shaking, and the frost creeps back up her face._  
_You know what it is telling her. That she will never be hungry again._  
_Never cold, never thrown, never waiting in a pen for the next bad thing._  
_It is telling her the one thing nobody else ever promised her._  
_Sable looks at you. And for the first and only time in her life, she speaks._  
**Sable** _(soft)_: …safe.  
_It is the stone’s word. It is in her voice._  
_You will never know which of them meant it._  
_She does not let go._  

> After c10-edge unmake, if stoneBearer = sable. Sable’s only spoken word in the game: “…safe.” (deliberately ambiguous).

#### <a id="c10-safe-moss"></a>Scene `c10-safe-moss`

_Moss steps down into the warm water. The gold light comes up round him, and through him._  
_He bends his head to let the stone go. And stops._  
**Moss** _(shock)_: …Oh.  
**Moss** _(soft)_: It’s her voice. It’s using her voice.  
**Moss** _(sad)_: It sounds like Cinder on the last warm day before the White Year. Calling me in out of the rain.  
**Moss** _(sad)_: Safe, she says. Come in where it’s safe.  
**Moss** _(sad)_: I loved her. I can’t put her down.  
_He stands in the water with the stone in his mouth, and the frost creeps back up his face, and he does not move._  

> After c10-edge unmake, if stoneBearer = moss. The stone speaks to him in Cinder’s voice.

#### <a id="c10-wisp"></a>Scene `c10-wisp`

_Behind you, on the ledge, something has followed you all the way here. Very quietly, for once in its life._  
_A thin grey shape with a torn ear goes past your boots like a thrown stone._  
**Wisp** _(angry)_: Hsss! Mine!  
_He hits the shallows and snatches the shard away, quick as a theft, which it is._  
**Wisp** _(shock)_: mine — warm — mine —  
_For one moment he holds it: the warmest thing he has ever seen. His whole thin face is joy._  
_Then his back feet go from under him on the slick stone, and he tumbles into the Wellspring, stone and all._  
_The water closes over him._  
_And the light comes up._  
_Not cold. Warm._  
_Gold, like the inside of a lantern, like a kitchen window seen from a dark road._  
_It fills the cave and the ledge and the frozen falls, and the ice on the falls goes the colour of honey._  
_Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet._  
_…_  
_In the shallows, the one who carried it stands blinking, the frost melting off its face, drip by drip._  
_The water is still. And Wisp is gone._  

Sets `{"stoneUnmadeBy":"wisp"}`

> After c10-safe-*, if wisp = spared or sable. The eucatastrophe: Wisp snatches the shard (“mine — warm — mine —”) and falls into the spring; the stone unmakes. Written bearer-neutral; LINE SWAP: line 13 (“In the shallows, the one who carried it…”) names the bearer by stoneBearer (Sable, her | Moss, his) in main and reader. Sets stoneUnmadeBy = wisp. FX: gold bloom; falls ice goes honey-coloured.

#### <a id="c10-moss-walks"></a>Scene `c10-moss-walks`

_Moss wades in beside her. He is so faint now that the gold light shines straight through him._  
**Moss** _(soft)_: Give it here, grey one. You’ve carried enough.  
_He puts his face very close to hers, the way Luna did. Forehead to forehead._  
_And Sable’s jaw opens, and the stone drops._  
_Not to the water. To him._  
_She stumbles back out of the shallows and comes to you, soaking, and leans her whole weight against your shin._  
**Moss** _(soft)_: There.  
**Moss** _(think)_: I laid her shard under the long grass. I can take it the rest of the way. That seems fair.  
**Moss** _(soft)_: Hold the lantern up, would you. I’d like to see where I’m going.  
_You hold it up. Your arm is shaking._  
_You hold it up anyway._  
**Moss** _(soft)_: I sat down next to Hazel for a whole winter before I said a word to her. She fidgeted. She was very bad at it.  
**Moss** _(happy)_: You aren’t to fidget.  
_He walks down into the Wellspring, slowly, the way he walks into everything. The water comes up to his chin._  
_Then over._  
_And the light comes up._  
_Not cold. Warm._  
_Gold, like the inside of a lantern, like a kitchen window seen from a dark road._  
_It fills the cave and the ledge and the frozen falls, and the ice on the falls goes the colour of honey._  
_Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet._  
_…_  
_When you can see again, the water is still, and lit very faintly from below, and Moss is gone._  

Sets `{"stoneUnmadeBy":"moss"}`

> After c10-safe-sable, if wisp is NOT spared/sable (driven or unset). Moss takes the shard from Sable, forehead to forehead, and walks into the Wellspring. Sets stoneUnmadeBy = moss.

#### <a id="c10-moss-walks-bearer"></a>Scene `c10-moss-walks-bearer`

_Moss stands in the water with Cinder’s voice in his mouth. Then, slowly, he turns his head and looks at you._  
**Moss** _(sad)_: I can’t put her down.  
**Moss** _(soft)_: So I won’t. I’ll carry her home instead. That is what you do, with a friend who has stayed out too late.  
**Moss** _(think)_: I laid her shard under the long grass. I can take it the rest of the way. That seems fair.  
**Moss** _(soft)_: Hold the lantern up, would you. I’d like to see where I’m going.  
_You hold it up. Your arm is shaking._  
_You hold it up anyway._  
**Moss** _(soft)_: I sat down next to Hazel for a whole winter before I said a word to her. She fidgeted. She was very bad at it.  
**Moss** _(happy)_: You aren’t to fidget.  
_He walks down into the Wellspring, slowly, the way he walks into everything. The water comes up to his chin._  
_Then over._  
_And the light comes up._  
_Not cold. Warm._  
_Gold, like the inside of a lantern, like a kitchen window seen from a dark road._  
_It fills the cave and the ledge and the frozen falls, and the ice on the falls goes the colour of honey._  
_Somewhere very deep, something that has whispered for longer than anyone has been alive goes quiet._  
_…_  
_When you can see again, the water is still, and lit very faintly from below, and Moss is gone._  

Sets `{"stoneUnmadeBy":"moss"}`

> After c10-safe-moss, if wisp is NOT spared/sable. Moss carries “her” home himself. Sets stoneUnmadeBy = moss.

#### <a id="c10-bank-wisp"></a>Scene `c10-bank-wisp`

_You sit down on the warm rock at the edge of the water. When you don’t know what to do, sit down next to them and wait._  
_So you wait. Moss sits down beside you and says nothing, which is how he says most things._  
_The light in the water sinks, slowly, and goes out. Nothing comes up._  
**Moss** _(soft)_: He wanted it so much. I always thought that was the worst thing about him.  
_Outside, the falls start to run again: a trickle, then a rush, then the old roar._  
_Steam rises off the spring again. Grey light comes in at the cave mouth._  
_And there, on the far side of the pool, curled in a hollow of warm stone, is Wisp._  
_He is asleep. He is grey, and he will be grey always._  
_His torn ear lies flat against his head._  
_And for the first time since you have known him, he is not trembling._  
**Moss** _(soft)_: …Well.  
**Moss** _(happy)_: I was wrong about him. I am nearly never wrong. Don’t tell Hazel.  
_You carry him home. He doesn’t bite you._  
_He doesn’t even wake up._  

> After c10-wisp. You wait on the bank (rule three); at dawn Wisp is found asleep on the far bank, grey, not trembling. You carry him home (spawn Wisp in the Grove as a stray if the S2 recruit is available).

#### <a id="c10-bank-moss-returned"></a>Scene `c10-bank-moss-returned`

_You sit down on the warm rock at the edge of the water. When you don’t know what to do, sit down next to them and wait._  
_So you wait. After a while Marina comes in from the cave mouth, coiling her rope, and sits on your other side._  
**Marina** _(soft)_: Talk about him. Out loud. It helps.  
**Marina**: That’s all that singing was, back there. People talking about him out loud.  
_So you tell her. The first morning on the hill: “…You lift and push.”_  
_I bruise like fruit. The pale one’s shoelace._  
_The afternoons you sat with him and said nothing at all._  
_There were a lot of those. You find you remember every one._  
_Marina laughs in the right places. You talk until your voice goes._  
_Then you just remember, which is quieter, and the same._  
_Outside, the falls start to run again: a trickle, then a rush, then the old roar._  
_Steam rises off the spring again. Grey light comes in at the cave mouth._  
_Something breaks the surface. Small, and grey, and very, very thin._  
_Moss climbs out onto the bank, slowly, the way he climbs everything, and sits, and shakes his ears._  
**Moss** _(soft)_: You were very loud.  
**Moss** _(happy)_: All of you. I could hear you from the bottom.  
_He is thinner. The light goes through him in places it didn’t before._  
_But he is here, and you can see him, and he is wet and cross._  
**Moss** _(think)_: Don’t pick me up. I mean it.  
**Moss** _(soft)_: …No. Go on, then.  

Sets `{"mossReturned":true}`

> After c10-moss-walks*, if mossFaded is false (affection 40+ at ch10 start). Remembering him aloud; he climbs out at dawn, thinner: “You were very loud.” Sets mossReturned = true. Art: Moss alpha a little lower than before ch9.

#### <a id="c10-bank-moss-gone"></a>Scene `c10-bank-moss-gone`

_You sit down on the warm rock at the edge of the water. When you don’t know what to do, sit down next to them and wait._  
_So you wait. After a while Marina comes in from the cave mouth, coiling her rope, and sits on your other side._  
**Marina** _(soft)_: Talk about him. Out loud. It helps.  
**Marina**: That’s all that singing was, back there. People talking about him out loud.  
_So you tell her. The first morning on the hill: “…You lift and push.”_  
_I bruise like fruit. The pale one’s shoelace._  
_And then you can’t think what else._  
_You didn’t sit with him as often as you meant to. You thought there would be time._  
_Marina doesn’t say anything. She just stays, which is the same thing._  
_Outside, the falls start to run again: a trickle, then a rush, then the old roar._  
_Steam rises off the spring again. Grey light comes in at the cave mouth._  
_Nothing comes up._  
_The water is warm and smooth, and lit very faintly from below, and nothing comes up out of it._  
_You wait anyway, until Marina puts her hand on your shoulder. Then a little longer._  
**Marina** _(sad)_: He was the oldest thing in this valley. Older than the trees, Hazel used to say.  
**Marina** _(soft)_: He knew the way.  

Sets `{"mossReturned":false}`

> After c10-moss-walks*, if mossFaded is true. Nothing comes up. Sets mossReturned = false. Remove Moss from the world after this scene (moss-sleeps if Sable is bonded).

#### <a id="c10-dawn"></a>Scene `c10-dawn`

_You come out from behind the falls into the first light. The water is roaring again, white and ordinary._  
_Below you the whole valley is frosted silver, and in the middle of it, small and gold, the Grove._  
_Three lanterns, still burning. They held them._  
_All night long, they held them._  
_The fourth is dark. Ember has her arms round it anyway._  
_And as you watch, the sun comes over the ridge, and the fourth lantern, by the long grass, which has only ever flickered…_  
_…steadies._  
_Brightens. Burns._  
_Nobody lit it. For the first time in twenty-two years, it has lit itself._  
_By the time you get home the frost has gone. There is dew instead, and the whole Grove smells of spring, in the middle of winter._  
**Sparks** _(shock)_: I didn’t touch it! I want that on the record. I did not touch it.  
**Pixel** _(happy)_: She didn’t. I was watching her hands. I’m always watching her hands.  
_Somebody’s soup has frozen solid in its cup overnight. Sparks tips it out, a perfect brown puck, and skims it across the last of the pond ice._  
_It goes a very long way. Everyone watches it go._  
_Nobody can think of a single reason why it’s the funniest thing they have ever seen._  
_Ember is still holding the long-grass post, coat and all. She doesn’t let go for a while after she needn’t._  

> Unmade routes only (keptStone false), after the bank scene. From above the falls: the Long-Grass lantern lights itself at sunrise for the first time in twenty-two years (renderer: it burns steady from here on). The fourth was dark at first light, with Ember’s arms round it. Frost gone; dew. Sparks’s “I didn’t touch it!” pays off her sleep-talk in c4-out; the frozen-soup puck is a pure release beat.

#### <a id="c10-moss-stays"></a>Scene `c10-moss-stays`

_Moss walks to the foot of the hill and sits down, carefully, like something that has decided to._  
_He looks at the Keepers: red-eyed, frozen, grinning, every one of them holding a lantern burnt down to the stub._  
**Moss** _(soft)_: Hazel stood there. You stand there. The chin is the same. The hands are slower. That’s better, actually.  
**Moss**: I’ve decided. I’ll stay a while. Someone has to tell the pale one about his shoelaces.  
**Byte**: They are TIED.  
**Moss**: Are they.  
_Byte looks down. Byte looks up._  
_Byte goes very pale, even for Byte._  
**Byte** _(shock)_: …I heard that. I heard him. That was him.  
**Clover** _(happy)_: We sat still long enough. All night. Of course we did.  
_Byte looks at his shoelace for a long moment. Then he kneels down in the wet grass and ties it, very carefully._  
_Nobody laughs. And then everybody does, the whole Grove, until Clover has to sit down._  

> After c10-dawn when Moss is present and loved: mossFaded false (wisp route) or mossReturned true. Verbatim “The hands are slower. That’s better, actually.” and the shoelace exchange. Byte hears Moss for the first time (they all sat still long enough).

#### <a id="c10-moss-fades"></a>Scene `c10-moss-fades`

_Moss stops at the foot of the hill. In the morning light you can hardly see him._  
_He is mostly a place where the light bends._  
**Moss** _(soft)_: That’s done, then. All four lit. I wanted to see it once more.  
**Moss** _(soft)_: I’m going up now, I think. Not because of anything. Because it’s time, and I’m tired, and the view is good.  
_You kneel down by him._  
_You want to say something. You don’t know what._  
**Moss** _(happy)_: Don’t be dramatic about it. That’s Hazel’s. She won’t mind me borrowing it.  
**Moss** _(soft)_: Tell the pale one his shoelace is untied.  
_You tell Byte. Byte looks down._  
_It is. He doesn’t tie it._  
_Moss goes up the hill path, slowly, the way he climbs everything._  
_He doesn’t look back. He never did like a fuss._  
_Halfway, he stops, as if someone coming down has said his name._  

> After c10-dawn in the wisp route when mossFaded is true. Moss goes up the hill at dawn as Hazel comes down (they pass off-screen; Hazel says so in c11-moss-passed). Remove Moss after this scene; place a memorial flower on the hill by the flat stone where he always sat.

#### <a id="c10-moss-mourned"></a>Scene `c10-moss-mourned`

_You come in at the gate: lift and push. Everyone looks at you, and then behind you, and then at you again._  
_You shake your head._  
_Nobody says anything. Clover sits down where she is, in the wet grass, with her lantern in her lap._  
_Byte looks down at his shoelace._  
_It’s untied. He leaves it._  
**Dusty** _(sad)_: Love them anyway. Love them harder because of it. I said that. I meant it. I just didn’t mean him.  
_On the hill, by the flat stone where he always sat, there is a flower that wasn’t there yesterday._  

> After c10-dawn when mossReturned = false. The Grove learns. Memorial flower appears on the hill by the flat stone where he always sat (not the long grass, which is the Long-Grass post).

#### <a id="c10-moss-light"></a>Scene `c10-moss-light`

_Something small and pale comes drifting down on the morning air, slow as a seed._  
_It settles above Sable’s head, beside her own dark one._  
_Two little lights now. One dark, one pale._  
_Sable goes cross-eyed trying to look at both._  
**Luna** _(soft)_: Oh. He left you something, sweetheart.  

> After c10-moss-fades or c10-moss-mourned, only if Sable is bonded. The light drifts “down on the morning air”, from no named direction, so it fits both routes (hill or Wellspring). Moss’s pale ball settles beside Sable’s (art: a second, pale ball over Sable for the rest of the game; it is referenced by end-moss-sleeps).

#### <a id="c10-bramble"></a>Scene `c10-bramble`

**Fern** _(shock)_: That ear. The way it folds over at the tip. That’s Bramble’s ear.  
**Gran Hazel** _(happy)_: Found her at the edge of the ring, under a root. Her mother runs the place. Terrible manners. I gather you’ve met.  
**Fern** _(soft)_: Her mother was mine. Once.  
_Fern puts out one finger and touches the folded ear, very lightly. The thin grey Nubbin sighs in its sleep, and leans into it._  

> After c10-close, only if s8Reunited (Fern has found Bramble in S8; S8 itself completes in ch11). The thin grey Nubbin is Bramble’s youngest; Fern recognises the ear, which folds over at the tip like Bramble’s (neither is torn; Wisp’s is). Fern stays as the Nubbin’s grandmother-by-Bramble; Hazel keeps carrying it. This is the one place Hazel says “Her mother runs the place… I gather you’ve met.” S8’s close has a dawn variant (s8-complete-dawn, side-stories-fun-2.ts) for runs where this scene played, so the two never repeat each other.

#### <a id="c10-close"></a>Closing `c10-close`

_The sun is up. The lanterns are burning down._  
_The Keepers stand about in the wet grass, too tired to go home, and not one of them willing to._  
_And on the hill path, coming down, there is a lantern you did not light._  
_It comes slowly. It stops, now and then, the way someone stops who needs to catch their breath and won’t admit it._  
_Fern sees it first. She puts her hand over her mouth._  
_Then Luna. Then Clover, who starts to cry before she even knows why._  
_Nobody runs to meet it. Somehow everybody knows not to._  
_You all just stand there, and let it come._  
_The lantern reaches the foot of the hill. The person carrying it is small and wrapped in three coats, and her boots are tied with string._  
_In the crook of her other arm, something is asleep. A very thin grey Nubbin, no bigger than a fist._  
_She looks at the Grove. At the four posts._  
_At all of you, holding yours._  
**Gran Hazel** _(soft)_: Well. Look at you all.  
_Then she finds you among them, and stops looking for anyone else._  
_It is her. Of course it is her._  

> Chapter 10 closing, every route, after the Moss scene (or c10-kept). Hazel comes down the hill path with a lantern and a very thin grey Nubbin. Bearer- and Moss-neutral, and keep-neutral: “not one of them willing to” go home reads as gladness on the unmade routes and unease on the keep route. Spawn Hazel here (beginChapter(11) already does).

## Chapter 11: Hazel

Goal: Talk with three different Keepers. Then sit with Hazel. (`threeFriends`) · Hint: Walk up to the Keepers and tap them. They stayed all night; they’ll stay a little longer.

#### <a id="c11-open"></a>Opening `c11-open`

_She is smaller than you remember. Everyone is, eventually._  
_Close to, her coats are patched at the elbows, and she smells of woodsmoke and wet leaves and the Hollow._  
_She looks at you for a long moment. Then she puts her free hand on your face and turns it to the light, the way she did when you’d been in a hedge._  
**Gran Hazel** _(soft)_: There’s the chin.  
**Gran Hazel** _(soft)_: You lit the lanterns. I could see them from the Hollow, all night. Four of them.  
**Gran Hazel** _(happy)_: I thought: either that’s my grandchild, or Sparks has finally blown the whole place up.  
**Sparks** _(happy)_: That’s fair. That is extremely fair.  
_Byte is standing very straight with his clipboard, and his face is wet._  
**Gran Hazel** _(soft)_: Byte, love. You’re crying.  
**Byte** _(think)_: Condensation.  
**Gran Hazel** _(happy)_: Of course it is.  
_She sits down on the bench by the cottage door, quite suddenly, as if her legs have made the decision for her._  
**Gran Hazel** _(think)_: I’m not staying long. I want to be clear about that now, so nobody gets dramatic later.  
**Gran Hazel** _(happy)_: I wrote that I’d gone up the hill. I was optimistic about the timing.  
**Gran Hazel** _(happy)_: The doctor gave me a year and I’ve had fourteen months, which I will be mentioning to him.  
**Gran Hazel** _(soft)_: I spent them in the Hollow. Feeding anyone who’d let me. Following the cold up the valley. Waiting for him to walk it home.  
**Gran Hazel** _(soft)_: He couldn’t. You did. I’m going to need a minute with that.  
_She doesn’t take a minute. She takes about four seconds, and blows her nose on a handkerchief that has seen things, and that is that._  
_The thin grey Nubbin in her arm stirs. It is so thin you can see the morning through its ears._  
**Gran Hazel** _(soft)_: This one I found the night before last. She’d stopped eating.  
**Gran Hazel** _(soft)_: She took a bit of apple off my thumb at sunrise. Took two days. Worth it.  
_She looks round at the Keepers, all of them still here, holding lanterns burnt to stubs, too tired to go home._  
**Gran Hazel** _(soft)_: Look at you. Up all night in the cold, for an old stone and an older Nubbin and a garden that isn’t even yours.  
**Clover** _(sad)_: It’s a bit ours.  
**Gran Hazel** _(soft)_: Yes, Clover. It is. That’s rather the point.  
**Gran Hazel**: Go on. Go and talk to them. Properly. Not about me.  
**Gran Hazel** _(soft)_: A Grove isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.  

> Chapter 11 opening, the morning after the Long Night, at the cottage bench. Verbatim “fourteen months” and “A Grove isn’t the Nubbins, love. It’s the people who show up when the lanterns are lit.” Hazel’s “Took two days. Worth it.” echoes the notebook. Byte’s “Condensation.” is a comic beat (Byte present, as all Keepers are). Hazel owns the letter’s “gone up the hill” (“optimistic about the timing”), and her line about Corvin is route-neutral (“He couldn’t. You did.”). Then, in order and if their conditions hold: c11-moss-here | c11-moss-kept | c11-moss-gone | c11-moss-passed, c11-sable, c11-cold-hands. Then the goal (talk to three Keepers). Opens S10. Chapter 11 spans a few days (bible); the late side stories fit inside them (see c11-close).

#### <a id="c11-moss-here"></a>Scene `c11-moss-here`

_Moss has come down from the hill. He sits by Hazel’s boot and looks up at her._  
**Gran Hazel** _(soft)_: Hello, old thing.  
**Moss** _(think)_: You’re late.  
**Gran Hazel** _(soft)_: I’m always late. You’re thinner.  
**Moss** _(soft)_: You’re late, and I’m thinner. We’re even.  
_She laughs, and has to stop, and holds her side, and laughs anyway._  
_Then she puts her hand on his head, the way she did every evening for forty years. He shuts his eyes._  

> After c11-open on an unmade route when Moss is still in the world (mossReturned true, or the wisp route with mossFaded false). On the keep route play c11-moss-kept instead.

#### <a id="c11-moss-kept"></a>Scene `c11-moss-kept`

_Moss doesn’t come down. He sits on the hill with his back to the Grove, where he has sat since the Long Night._  
_Hazel looks up at him. After a long time he turns his head and looks back at her, and then away._  
**Gran Hazel** _(sad)_: Hello, old thing. Like that, is it.  

> NEW. After c11-open on the keep route (keptStone), in place of c11-moss-here. After c10-kept Moss sits on the hill with his back to the Grove and does not come down; he and Hazel only look at each other. Sets up c11-cold-hands.

#### <a id="c11-moss-gone"></a>Scene `c11-moss-gone`

_Hazel looks up the hill, at the place where he always sat. She doesn’t ask._  
**Gran Hazel** _(soft)_: I know, love. I knew on the hill, coming down. The air was different.  
**Gran Hazel** _(sad)_: He sat beside me a whole winter before he said a word. Forty years after that. Longer than that, beside everyone.  
_She is quiet a while. The thin grey Nubbin sleeps._  
**Gran Hazel** _(soft)_: He’ll be furious if we make a fuss. We’ll make a small one. Just us. Later.  

> After c11-open when Moss went into the Wellspring and did not come back (c10-bank-moss-gone). Shares its tail (MOSS_GONE_TAIL) with c11-moss-passed.

#### <a id="c11-moss-passed"></a>Scene `c11-moss-passed`

_Hazel looks up the hill, at the place where he always sat. She doesn’t ask._  
**Gran Hazel** _(soft)_: I passed him on the path. He told me I was late.  
**Gran Hazel** _(sad)_: He sat beside me a whole winter before he said a word. Forty years after that. Longer than that, beside everyone.  
_She is quiet a while. The thin grey Nubbin sleeps._  
**Gran Hazel** _(soft)_: He’ll be furious if we make a fuss. We’ll make a small one. Just us. Later.  

> NEW. After c11-open when Moss went up the hill at dawn (c10-moss-fades), in place of c11-moss-gone. Pays off c10-moss-fades (“as if someone coming down has said his name”): Hazel passed him on the path, and he told her she was late. Shares MOSS_GONE_TAIL with c11-moss-gone.

#### <a id="c11-sable"></a>Scene `c11-sable`

_Sable comes out of the long grass, looks at Hazel for a long time, and then walks straight past her and leans her whole weight on your shin._  
**Gran Hazel** _(happy)_: Well. That’s me told.  
**Gran Hazel** _(soft)_: That one took longer than two months, I’ll bet.  
_You think of the first night, and of every night since. You nod._  
**Gran Hazel** _(soft)_: Worth it.  

> After the Moss add-on, only if Sable is bonded. Works for either first night (sableFirst slow or grab).

#### <a id="c11-cold-hands"></a>Scene `c11-cold-hands`

_Hazel takes your hand to stand up. Then she doesn’t stand up._  
**Gran Hazel** _(think)_: Your hands are cold, love.  
_You take your hand back and put it on your coat, over the breast pocket._  
_You don’t mean to. It just goes there._  
_Hazel watches it go. She has seen someone do that before._  
_A long time ago, in this garden._  
**Gran Hazel** _(sad)_: …Ah.  
_She doesn’t say anything else. Her silences were always the loudest thing about her._  

> After the other add-ons, only if keptStone. Hazel recognises Corvin’s gesture in you.

#### <a id="c11-gate"></a>Scene `c11-gate`

_When you look up from the pond, he is back at the gate._  
_Corvin. No grey coat._  
_A brown one, too big, either borrowed or very old._  
_He tries the latch once, for form’s sake, and it sticks. Then he folds his arms on the top bar, like a man settling in._  
_Beside you, Hazel doesn’t turn round. But she has stopped breathing, just for a moment, to listen._  
**Gran Hazel** _(soft)_: Don’t look at me, love. I’ve done my part. It’s your gate now.  
**Gran Hazel** _(think)_: He said till first light. He’ll mean it. Meaning things was never his trouble.  

**Choices**

- **Stay where you are.**
    - You stay where you are. In the dark the gate creaks once more, and then is quiet.
    - But you don’t hear him go.
- **It’s freezing. Isn’t that cruel?**
    - **Gran Hazel**: It would be, if anyone had asked him to. Nobody did. He chose the hour himself.
    - **Gran Hazel**: Let him have chosen something, love. It’s been a long time.
    - You stay. In the dark the gate creaks once more, and then is quiet.
    - But you don’t hear him go.
- **Take him a cup of tea. Leave the gate shut.**
    - **Gran Hazel**: …Oh, you’re worse than me.
    - **Gran Hazel**: Go on, then. The cup by the stove. The one that’s turned upside down.
    - You carry it down and pass it over the top bar.
    - He takes it in both hands. Neither of you says anything.
    - In the morning the cup is on the gatepost, rinsed in the stream, and turned upside down.

> After c11-close, only on the night of s9-ask (the eve of chapter 12): play it if s9-ask has been seen. A return, not a discovery: Corvin’s first arrival is S9’s s9-dusk, and in s9-ask he said he would stand at the gate till first light. He tries the latch once, for form’s sake, and it sticks. Hazel’s stance is the same as in S9 (s9-yours): it is your gate now; she has done her part. Never plays if keptStone (S9 needs the stone unmade). Ends on a question the player answers: leave him (gate-leave), question Hazel (gate-cruel), or take him tea over the shut gate (gate-tea; the upside-down cup from c1-letter ends on the gatepost). No flags, no friendship, and the gate stays shut in every branch, so S9’s dawn gate scene decides corvinGate as before.

#### <a id="c11-close"></a>Closing `c11-close`

_Days go by like that. Hazel sleeps a lot, and wakes up for the good bits._  
**Gran Hazel** _(happy)_: Good. They like you. Sparks likes everyone, that doesn’t count, but Ember likes you, and Ember doesn’t like anyone.  
**Gran Hazel** _(happy)_: I’m not even sure Ember likes Ember.  
**Ember** _(angry)_: I can hear you.  
**Gran Hazel** _(happy)_: I know, dear.  
**Gran Hazel** _(soft)_: Sit with me. Here. By the pond. Don’t say anything.  
_You sit. The ice on the pond is gone._  
_The water is black and still and has the whole evening sky in it._  
_The thin grey Nubbin wakes, looks at you, and goes back to sleep._  
_Nobody says anything. The lanterns burn._  
_An owl says something, once, and then thinks better of it._  
**Gran Hazel** _(soft)_: I used to sit here and go over everything I’d got wrong. Forty years. There’s a lot.  
**Gran Hazel** _(sad)_: The ones I lost. The tablets I left lying about. Him. I taught him everything except the one thing.  
**Gran Hazel** _(soft)_: Then one evening I stopped going over it and just sat. That was better. That was the whole trick, it turned out.  
_She takes your hand. Hers is warm, and very light, like something that is mostly air now._  
**Gran Hazel** _(think)_: Tomorrow I want to see the whole Grove. Every post, every tree, every last grub in the pond.  
**Gran Hazel** _(soft)_: Then I’m going to go up the hill and have a very long sit-down, and you are not to be dramatic about it.  
_You don’t say anything. You are getting good at it._  

> Chapter 11 closing, on the eve of chapter 12. Opens with “Days go by like that”: chapter 11 spans a few days, and the late side stories (S3’s Moot, S8’s close, S10, S18, S19, S20, S22) fit inside them. SIM: hold this scene until threeFriends is met AND S9 has had its chance (s9-ask has been seen, or S9 cannot run because keptStone, or S9 is still on step 1 or 2 at the dusk after threeFriends is met. Then c11-close plays that evening, c11-gate is skipped, and S9 jumps to its dawn gate scene before c12-open); it then plays that evening. LINE VARIANT. If s9-ask has been seen, insert after line 0 (“Days go by like that…”) the line N(‘Then comes the evening Corvin asks at the gate.’), so the days read as the ones before s9-ask, not after it. If s8Done (S8’s youngest has gone home to the ring), the line “The thin grey Nubbin wakes, looks at you, and goes back to sleep.” becomes “Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.” It plays after s9-ask and s9-word. Ember-doesn’t-like-anyone exchange as in story.ts (split over two lines), and “you are not to be dramatic about it”. Sit by the pond. Bearer- and Moss-neutral. If S10 makes the pond sit interactive, its wish can replace the lines from “Sit with me. Here. By the pond.” to “…thinks better of it.” here. Then c11-gate (if s9-ask was seen), then S10’s s10-night (or -told), then chapter 12.

## Chapter 12: Keepers

Goal: Decide what the Grove will be. (`finalChoice`) · Hint: The choice is made in the scene. The ending is chosen by everything you did. See the Paths page.

#### <a id="c12-open"></a>Opening `c12-open`

_Morning. Cold and very bright._  
_Every Keeper is here, and every Nubbin._  
_Nobody planned it. Everybody just came._  
_Sparks has brought a cake, which has collapsed on one side._  
_Pixel has fixed the cake. It is still collapsed, but now it lights up._  
_Fern has made lantern buns, and for the first time in living memory they have come out. She keeps showing people one, as evidence._  
_Dusty is digging a new bed by the old wall, for reasons they won’t explain. Nova has brought seeds from somewhere you’ve never heard of._  
_Clover is crying already, and says it’s the cold. Byte has a clipboard and has not written anything on it._  
_Pixel and Byte argue about where Hazel would want them to stand. They settle it by standing there together._  
_Marina sits on the edge of the pond with her feet in the water, which is freezing, and says it’s lovely._  
_Ember stands by the gate with Ash._  
_At first light Ash ran at the gate, the way she used to._  
_Not full tilt, only half. She bounced off it._  
_Ember has told nobody. Everybody knows._  
_Hazel walks the Grove. Slowly._  
_She touches each lantern post as she passes, the way you touch the shoulder of someone you are about to leave._  
_At the fourth post, the long grass, she stands a long time._  
**Gran Hazel** _(soft)_: And the long grass. Cinder’s.  
**Gran Hazel** _(sad)_: She loved them too, you know. That was never the trouble.  
_Then she comes to the pond, and stands in the place where she doesn’t say anything, and waits for you to._  
**Gran Hazel** _(soft)_: It’s yours now. Properly.  
**Gran Hazel** _(think)_: I had forty years of it. I shut the gate when I was frightened and opened it when I was brave, and I was wrong both ways about half the time.  
**Gran Hazel** _(soft)_: So. Tell me. What is it going to be?  

**Choices**

- **A home. For all of them. I’ll keep the gate stuck.** — sets `{"finalChoice":"keep"}`
    - **Gran Hazel**: Lift and push. Good.
    - **Gran Hazel**: It sticks so you hear who comes back. That was always the point of it. I never told anyone that.
    - **Gran Hazel**: Keep it stuck, love. Keep listening.
- **Open. No gate. They stay if they want to.** — sets `{"finalChoice":"free","letThemGo":true}`
    - **Gran Hazel**: …That’s not how I did it.
    - **Gran Hazel**: It might be how it should be done. Go on, then. Let’s see who stays.
    - You lift the gate off its hinges. It is heavier than you thought.
    - Dusty helps. You lean it against the wall, where the ivy can have it.
    - For a long moment, nobody goes anywhere. Then a stray wanders out into the lane, sniffs the air, and wanders straight back in.
    - **Gran Hazel**: Ha.

> Chapter 12 opening, the morning after (S9’s gate scene, if any, plays before this). Everyone gathers; Hazel walks the four posts; the final choice. Choice ids/sets unchanged (keep → finalChoice keep; free → finalChoice free + letThemGo). Fern’s lantern buns finally come out (payoff of c4-close). Free: the gate comes off its hinges (art: gate leaning on the wall from here). Then: [c12-foot-told | c12-foot-secret] → s10-foot-* (S10’s who-walks choice, sets walk) → c12-walk-<walk>, or c12-walk-alone without S10 → c12-close → s10-letter (S10 complete, next morning) → ending.

#### <a id="c12-foot-told"></a>Scene `c12-foot-told`

_When Hazel stands up from the bench, everybody stands up._  
_They know. You told them, the way she asked, and they have been dreadful about it, the way she said they would be._  
_They walk with her as far as the foot of the hill._  
_Nobody says anything. Nobody needs to._  
_At the bottom of the path she turns and looks at them, one after another, as if she is counting._  
**Gran Hazel** _(soft)_: That’s far enough.  
**Gran Hazel** _(soft)_: Go on. Go home. Light something.  
_They stop. They don’t go home._  
_They stay at the foot of the hill, all of them, holding lanterns in broad daylight, and watch._  

> After c12-open, only if hazel = told. The Keepers walk her to the foot of the hill and stop.

#### <a id="c12-foot-secret"></a>Scene `c12-foot-secret`

_When Hazel gets up from the bench, nobody notices._  
_Sparks is arguing with Pixel about the cake. Fern has lost a glove._  
_Hazel catches your eye across the Grove, and winks._  
**Gran Hazel** _(soft)_: Not a word. They’d only fuss.  
_She takes her lantern from the step, and her three coats, and walks to the foot of the hill unhurried, as if she is going to look at a tree._  

> After c12-open, only if hazel = secret. Nobody else notices her go.

#### <a id="c12-walk-you"></a>Scene `c12-walk-you`

**Gran Hazel** _(soft)_: Come on, then. Arm.  
_She takes your arm._  
_She doesn’t lean. She just holds on._  
_You go up slowly. Past Fossil’s flower._  
_Past Briar’s, the first one, small and yellow by the big stone, open even now, in winter._  
**Gran Hazel** _(happy)_: I used to come up here and tell them what I’d done that week. Briar mostly. She liked the bad bits best.  
**Gran Hazel** _(soft)_: Come and tell them about you, sometimes. Not me. You. Let them know how it’s going.  
_At the top she sits down on the turf, where you can see the whole Grove, and pats the ground beside her._  
_From here you can see all of it: the pond, the four posts, the gate._  
_Everybody, small and bright, doing things badly and together._  
**Gran Hazel** _(soft)_: There. That’s mine. That was mine.  
**Gran Hazel** _(happy)_: It’s a good one. Don’t you dare let anyone tell you otherwise.  
_You sit with her a while. Neither of you says anything._  
_It is the best part. It was always the best part._  
**Gran Hazel** _(soft)_: Right. Off you go.  
**Gran Hazel** _(happy)_: Don’t look back on the way down. It turns everything into a scene.  
_You get up. You go down._  
_You look back once. Of course you do._  
_She isn’t looking. She has one hand up, waving, without turning round, the way she always did from the gate._  

> Hazel’s walk when walk = you. Shares the hilltop lines with c12-walk-alone.

#### <a id="c12-walk-moss"></a>Scene `c12-walk-moss`

_Moss is sitting on the first stone of the hill path._  
_You don’t know how long he has been there. Longer than you, probably._  
**Moss** _(think)_: I’m coming. Don’t argue.  
**Gran Hazel** _(soft)_: I wasn’t going to argue.  
**Moss** _(soft)_: You were. You had the chin out.  
_He climbs onto her shoulder, slowly, the way he climbs everything._  
_She doesn’t stagger. He weighs about as much as a memory._  
**Gran Hazel** _(soft)_: This is as far as you come, love.  
_So you stop at the foot. You watch them go up together, small and slow, the lantern swinging._  
_Halfway, she stops for breath. He says something in her ear._  
_She laughs so hard she has to sit down on the path._  
_At the top they sit: an old woman and an old Nubbin, looking out over the Grove, the way they did when she was young and he’d just decided she was worth it._  
**Moss** _(soft)_: I’ll decide at the top. Go home. Light something.  
_You wait at the foot until her lantern is the only light on the hill._  
_He doesn’t come down. Not tonight._  

> Hazel’s walk when walk = moss (S10 offers it while Moss is in the world: on an unmade route only if he came through the Long Night, and always on the keep route, faded or not). He stays at the top; the epilogue decides whether he comes down (end-epi-walk-moss on unmade routes, end-epi-walk-moss-stayed on the keep route).

#### <a id="c12-walk-sable"></a>Scene `c12-walk-sable`

_Sable is standing in the long grass at the foot of the hill path._  
_She isn’t looking at you. She’s looking at Hazel._  
**Gran Hazel** _(soft)_: Hello, grey one.  
_Sable walks to Hazel’s boots, and then one step past them, up the path. Then she stops, and looks back._  
**Gran Hazel** _(soft)_: Oh. She’s taking me.  
**Gran Hazel** _(happy)_: Well. I’ve been taken places by worse.  
_You stop at the foot. They go up together: the old woman with the lantern, and the small grey shape ahead of her, waiting at every bend._  
_Two steps ahead. Never more._  
_She has had a lot of practice at two steps._  
_At the top, Sable sits down beside her. You can see them for a long time, the lantern and the dark, side by side._  
_After dusk, a small grey shape comes down the path alone, very slowly._  
_She doesn’t go to her place in the long grass. She comes to the cottage step, and sits on it, and waits for you._  
_She has never once walked towards a Keeper’s door._  

> Hazel’s walk when walk = sable (Sable bonded). Sable comes down alone and waits on your step.

#### <a id="c12-walk-corvin"></a>Scene `c12-walk-corvin`

_Corvin is standing by the hedge at the foot of the hill, a long way off, the way he has stood at the edge of everything since he came back._  
**Gran Hazel** _(soft)_: Well, don’t stand there like a heron. Come and take the lantern.  
**Gran Hazel** _(soft)_: You used to carry it for me. When you were twenty-two and knew everything.  
**Corvin Vale** _(soft)_: …I used to.  
_He comes. He takes it._  
_His hands are not blue any more. They are only a man’s hands, a little red with cold, and they are steady._  
_You stop at the foot. You watch them go: the old woman on the arm of her old apprentice, stopping when she needs to._  
_He waits every time. He does not hurry her once._  
_It is a long while before he comes down. When he does, his hands are empty, and his face is wet, and he doesn’t try to hide it._  
_He left the lantern with her, burning._  
_He sits down by the pond, a little way off, and says nothing. He is getting better at it._  

> Hazel’s walk when walk = corvin (corvinGate = family). Gate-neutral, so it works after “Open”. As in every walk, her lantern stays burning at the top, so c12-close needs no variant; Corvin fetches it down at first light and hangs it on the hook by the cottage door (end-epi-walk-corvin; S10’s letter finds it there).

#### <a id="c12-walk-alone"></a>Scene `c12-walk-alone`

_Later, when the others are busy with the cake, Hazel stands up from the bench and picks up her lantern._  
**Gran Hazel** _(soft)_: Walk me up, love.  
_You know what she means._  
_You have known since the letter. Perhaps since the gate._  
_At the foot of the hill she takes your arm._  
_She doesn’t lean. She just holds on._  
_You go up slowly, past Fossil’s flower, and Briar’s, the first one, small and yellow by the big stone._  
_At the top she sits down on the turf, where you can see the whole Grove, and pats the ground beside her._  
_From here you can see all of it: the pond, the four posts, the gate._  
_Everybody, small and bright, doing things badly and together._  
**Gran Hazel** _(soft)_: There. That’s mine. That was mine.  
**Gran Hazel** _(happy)_: It’s a good one. Don’t you dare let anyone tell you otherwise.  
_You sit with her a while. Neither of you says anything._  
_It is the best part. It was always the best part._  
**Gran Hazel** _(happy)_: Now it’s yours. Go on down. And don’t look back; it turns everything into a scene.  
_You go down. You look back once._  
_Of course you do._  
_She has one hand up, waving, without turning round, the way she always did from the gate._  

> Hazel’s walk when S10 was not played (walk unset / no s10Done). You walk her up alone; no hazel told/secret add-on.

#### <a id="c12-close"></a>Closing `c12-close`

_Dusk. You come back into the Grove._  
_The Keepers are all still here. Nobody has gone home._  
_Somebody has lit the lanterns, all four, without being asked._  
_Nobody asks you anything. Clover gives you soup._  
_Fern gives you her other glove; she has found the first one._  
_Somebody has eaten the cake, collapsed side and all. The plate on the bench is still faintly lit from inside._  
_You stand by the pond, in the place where Hazel didn’t say anything. Everyone else stands somewhere too._  
_At the top of the hill, small and gold and steady, her lantern is burning._  
_It burns all night. You know because you watch it._  
_Everybody does, on and off, in turns, without anyone arranging it._  
_Sparks falls asleep sitting up, holding her lantern. Nobody takes it off her._  
_Towards morning somebody starts the song, very quietly, and stops after the chorus._  
_That is enough. Everyone knows the rest._  
_…_  
_In the morning it has gone out._  
_And on the hill, near Briar’s, there is a new flower: small, brisk, a bit untidy, and turned very firmly towards the Grove._  

> Chapter 12 closing (the sim queues it after the walk). Dusk; the Keepers light all four; Hazel’s lantern burns on the hilltop all night and is out by morning; a new memorial flower near Briar’s. The lit cake plate is the last comic grace note. Then endingFor and end-<id>. S10’s second letter, if it has one, plays between this and the ending.
