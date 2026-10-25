# Hazel's Grove: The campaign, Book 2: The Cold

## Chapter 5: The Circuit

Goal: Win a race, any course, any tier. (`winRace`) · Hint: Open Races from the top bar. A grown Nubbin with trained stats does best.

#### <a id="c5-open"></a>Opening `c5-open`

_High summer. The Grove smells of cut grass and warm fruit, and somebody is at the gate._  
_Wasps are drunk in the plum tree. The pond is warm enough to put your feet in, and your Nubbin has put in all of itself._  
_She lifts and pushes without being told. Whoever she is, she has been here before._  
**Ember** _(angry)_: Ember. I don’t do small talk.  
_She doesn’t do large talk either, it turns out, for nearly a minute. She just looks at the gate._  
**Ember**: Corvin Vale is running the Circuit this week and he’s invited you. That’s not a kindness.  
**Ember**: He wants to see what you’ve got so he can put a price on it.  
_She looks at your Nubbins the way people look at a house they used to live in._  
**Ember** _(soft)_: Hazel gave me an egg, once. I was fifteen. I didn’t deserve it and she knew, and she gave it to me anyway.  
**Ember**: Her name was Ash. Fast. Brave. She used to run at the gate, full tilt, and bounce off it. Every single morning.  
**Ember** _(sad)_: I was young and I wanted to win. Corvin said he could make her a champion in a month.  
**Ember**: I let him take her for training.  
_…_  
**Ember**: She came back grey. She won every race he put her in. She never once looked at me again.  
_Ember’s hands are in her pockets. You can see the fists through the cloth._  
**Ember** _(sad)_: So when he offered to keep her, I let him. I told myself she was happier running. That’s the part I can’t get the taste out of.  
**Ember** _(angry)_: Go race. Win if you can. But watch how he talks to the ones who lose.  

**Choices**

- **I’m sorry about Ash.**
    - **Ember**: Don’t. Everyone’s sorry. Sorry doesn’t do anything.
    - **Ember**: …Fine. I’ll come. Someone has to stop you looking at him like he’s normal.
- **Come with me.**
    - **Ember**: I wasn’t going to.
    - She looks at the road up the valley for a long time.
    - **Ember**: …I’ll walk. I won’t talk. Don’t make me talk.
- **Say nothing. Sit down on the step.**
    - You sit on the step by the gate. After a while, stiffly, as if it costs her, Ember sits too.
    - **Ember**: Hazel did that. Exactly that. It’s very annoying.
    - **Ember**: Come on, then. I’ll show you the road.

> Chapter 5 opening, at the Grove gate, high summer (drunk wasps, your Nubbin in the warm pond). Ember’s story of Ash. All three choices end with Ember coming to the Circuit (she is in c5-circuit and c5-close). Choices only change Ember friendship. Opens S4 and S5 (their own triggers). Ash’s first sound is deliberately not named here: that belongs to S6.

#### <a id="c5-circuit"></a>Scene `c5-circuit`

_The road climbs up the valley, and with every mile the trees stand further back from it._  
_The Circuit is square and clean and silent._  
_White lines, white rails, raked sand. Not one weed._  
_It is the hottest day of the summer. The railings are furred with frost._  
**Sparks** _(shock)_: Feel that. No, go on, put your hand on it. It’s AUGUST.  
**Sparks**: Eleven years I’ve raced here. Rails are always cold. I asked once. He said it was the shade.  
_There is no shade. There is no tree for half a mile._  
_At the start line, Corvin’s runners wait in a row. Grey, every one._  
_Not touching. Not looking at anything._  
_Your Nubbin presses against your leg and stays there._  
**Sparks** _(sad)_: Mine bounce. Look at them. Mine never stop bouncing. His just… wait.  
_Byte is at the rail with a clipboard and a stopwatch, timing things that are not, strictly, racing._  
**Byte** _(think)_: His runners have a start variance of zero. Zero. I’ve timed sixty starts.  
**Byte**: Nothing alive has a variance of zero. I thought I’d broken the stopwatch. I bought a second stopwatch.  
**Sparks**: He’s got three now.  
**Byte**: Four. One is for timing the others.  
_Corvin comes down the rail towards you. His hands are bare and blue at the knuckles, and he does not seem to notice._  
**Corvin Vale**: Hazel’s heir. You came. And Ember. That’s a surprise. You don’t usually get this close.  
**Ember** _(angry)_: Where’s Ash.  
**Corvin Vale**: Lane four. She’s safe.  
**Ember**: That isn’t what I asked.  
_Corvin touches his breast pocket, lightly, the way some people touch a ring. Then he turns to you._  
_Your breath smokes in the August air. Corvin sees it._  
**Corvin Vale** _(think)_: Cold? Is it. I hadn’t noticed. I don’t, any more.  
**Corvin Vale**: Race well. I’d like to see what she taught you. I’d like to see if it’s changed.  
**Corvin Vale** _(think)_: One question first, since you’re her heir. What matters in a race? That they win, or that they want to?  

**Choices**

- **That they want to.**
    - **Corvin Vale**: Hazel’s answer. Word for word. It loses, mostly.
    - **Sparks**: It does NOT lose mostly. It loses SOMETIMES.
    - **Corvin Vale**: We’ll see.
- **That they win. It’s a race.**
    - **Corvin Vale**: Honest. Good. You’ll do well up here.
    - Ember says nothing for a moment. Then, quietly, to the frozen rail:
    - **Ember**: That’s what I said. At fifteen.
    - She doesn’t say it unkindly. She says it like someone who would have given a great deal to be argued with.
- **That they come home afterwards.**
    - **Corvin Vale**: …That isn’t an answer.
    - **Ember**: It’s the only one.
    - Corvin touches his breast pocket, and walks off down the white rail without another word.

> New mid-chapter scene. Plays the first time the player opens Races in chapter 5, before the race starts. If that hook is awkward, queue it straight after c5-open. Staging: the Circuit, hot day, frost on the white railings (art: rime on the rail sprites; breath-puff particles near the rail only). Corvin is spawned for ch5 already. Sparks is present as a racer; Byte is at the rail with his stopwatches (spawn him for this scene; it seeds S7’s stopwatch). “She’s safe.” / “That isn’t what I asked.” seeds ch7. Ends on a question the player answers for Corvin: what matters in a race? (race-want | race-win | race-home). No flags; friendship only (Sparks or Ember); race-win is not punished. Then c5-considered if corvinOffer = considered, then the race.

#### <a id="c5-considered"></a>Scene `c5-considered`

_At the start line, Corvin finds you again. He doesn’t look at Ember._  
**Corvin Vale**: Still thinking? Good. The offer stands.  
_Your Nubbin looks up at him, then at you, and then, very carefully, at nothing._  

> NEW. Variant tail: queue straight after c5-circuit (after its choice, before the race) only if corvinOffer = considered (c2-corvin “Let me think about it”). Pays off his “I’ll be at the Circuit when you’ve finished.” No flags, no friendship. With refused or sold it never plays.

#### <a id="c5-sold"></a>Scene `c5-sold`

_In the row of grey runners, third from the end, is one you know._  
_It was yours. It has grown._  
_It is not looking at you, or at anything._  
_There is a number on its side in neat white paint, like the label on a jar._  
**Corvin Vale**: Yours runs well. I did tell you it would eat better with me.  
_It does look well fed. That is all it looks._  
**Ember** _(angry)_: You sold him one.  
_She doesn’t say anything else. She doesn’t need to._  

> Variant tail: queue directly after c5-close only if flag soldNubbin is true (and boughtBack is not). Your sold Nubbin is one of Corvin’s grey runners. If the renderer can, show the sold Nubbin’s sprite (flags.soldId) in grey.

#### <a id="c5-close"></a>Closing `c5-close`

_You cross the line first. Your Nubbin keeps running for three more steps, out of pure joy, and has to be fetched._  
**Sparks** _(happy)_: THAT’S MY— no, that’s yours. That’s YOURS. I’m just very loud about it.  
_At the rail Byte stops all four stopwatches and stares at them._  
**Byte** _(think)_: Yours started late. Nearly half a second. It was looking at a butterfly.  
**Byte** _(happy)_: Variance. Lovely, lovely variance.  
**Corvin Vale**: Hazel’s heir wins. Of course. She always said the trick was to make them want to run for you.  
**Corvin Vale**: Sentimental. Effective, I’ll grant.  
**Corvin Vale**: Mine run because the alternative is worse.  
_He says it without cruelty. He says it like someone reading out the weather._  
**Corvin Vale**: It’s faster. It’s steadier. Not one of mine has ever been hurt on this track. Can you say that?  
_Behind him the grey runners stand in their line, perfectly still, frost on the rail beside them._  
**Ember** _(sad)_: Ash. Ash, it’s me.  
_One of the grey ones turns her head, very slightly._  
_…and then turns it back._  
**Corvin Vale**: You see? Discipline. Come to the garden sometime. I’ll show you how it’s done.  
_On the road home Ember doesn’t say anything for two miles. Then, to nobody:_  
**Ember** _(soft)_: She turned her head, though.  
_The stream beside the road is lower than it was in spring. You notice, and then you don’t think about it again._  
_At home, there is a line of white on your sleeve where you leaned on his rail. It takes all evening to melt._  

> Chapter 5 closing, after the first race win. Byte’s “lovely variance” (your Nubbin started late, looking at a butterfly) is the living answer to Corvin’s zero. Keeps Corvin’s “Mine run because the alternative is worse.” The low stream seeds S4 (Corvin’s dam above the falls). Last line: the frost travels home on your sleeve.

## Chapter 6: Rain on the Hill

Goal: Sit with Dusty by the flower. (`talkDusty`) · Hint: Walk up to Dusty and tap them.

#### <a id="c6-open"></a>Opening `c6-open`

_It rains for three days. On the third, Dusty is up on the hill in it, cross-legged in the wet, with no hat._  
_The gutters gurgle. The hill path has turned into a small brown stream, and it smells of wet chalk and crushed thyme._  
_In their lap is a small old Nubbin the colour of sandstone, curled like a shell. Her ball is so pale the rain shows through it._  
**Dusty** _(soft)_: Oh. Hello. Don’t mind me. I’m getting wet on purpose.  
_A duck nearby has also decided to get wet on purpose. It is regarding Dusty with respect._  
**Dusty**: Ignore Gerald. He thinks I’m onto something.  
**Dusty**: This is Fossil. Original, I know. I dug her egg out of the cliff face when I was eleven. With a big spoon.  
**Dusty**: She’s been with me twenty years. Twenty years and a bit. I’ve been counting the bit.  
_Fossil opens one eye, considers you, and taps Dusty’s wrist twice with one small hand._  
**Dusty** _(happy)_: That means you’re all right. She’s very selective. She bit a postman once. Twice. Same postman.  
**Dusty**: Hazel used to come up here with us. Never brought an umbrella. Said it was only water, and the hill needed it more than she did.  
_Fossil’s breathing is slow and even, like someone at the end of a long walk who has finally sat down._  
_Fossil uncurls, very slowly, and climbs out of Dusty’s lap onto the grass. She wants to do this part herself._  
_A cocoon closes round her, thin as a soap bubble. Rain runs down the outside of it._  
**Dusty**: She’s done. Not reborn. Done. You can tell by the light. Rebirth glows; this just… thins.  
_It thins the way breath thins on a window. You keep thinking it has finished, and it hasn’t._  
_Dusty puts one muddy finger against it._  
_Inside, very faintly, something taps back. Twice._  
**Dusty** _(soft)_: Yes. All right. I know.  
_…_  
_And then there is only rain, and where she was, a flower pushing up through the wet grass._  
**Dusty** _(sad)_: Everyone keeps telling me it means she was happy enough to let go. That’s true. It’s also the worst thing anyone’s ever said to me.  
_Dusty doesn’t cry. They just sit there, getting wetter, looking at the flower as if it might need something._  
**Dusty**: Would you sit with me a bit. You don’t have to say anything. Hazel never did.  

> Chapter 6 opening when s5Done is NOT set: Fossil is introduced here for the only time (bible, conflict 8). Dusty is they/them; Fossil is she. Fossil does not speak; she taps twice. Staging: rain on the western hill; Fossil fades into a cocoon and the memorial flower (memorial-fossil, already placed by beginChapter) appears on the line “where she was, a flower…”. Goal after: tap Dusty.

#### <a id="c6-open-walked"></a>Scene `c6-open-walked`

_It rains for three days. On the third, Dusty is up on the hill in it, cross-legged in the wet, with Fossil in their lap._  
_The hill path has turned into a small brown stream. Dusty has put their coat over Fossil and left the rest of themselves out in it._  
**Dusty** _(soft)_: You came. Good. She’s been watching the gate for you all morning.  
_A duck sits in the rain beside them, wet on purpose too. It is regarding Dusty with respect._  
**Dusty**: Ignore Gerald. He thinks I’m onto something.  
**Dusty**: Thank you for the walk. The cliff, and the tree, and the water. I mean it. I don’t say thank you much. Ask anyone.  
**Dusty**: She hadn’t been in water in six years. Did you see her face? I’m keeping that face.  
**Dusty** _(happy)_: And she tapped the rock when I told it wrong. Twenty years, and she still had to have the last word.  
_Fossil, hearing her name, taps Dusty’s wrist twice. Then she looks past you, down the hill._  
_Your youngest Nubbin, the one she sat with until dark, is coming up the wet slope as fast as its legs allow._  
_It sits down beside her, very close, and looks at nothing, and stays._  
**Dusty**: She did everything on the list. Everything. I thought that would make this easier.  
**Dusty** _(soft)_: It doesn’t. It makes it better. That’s different.  
_Fossil uncurls, very slowly, and climbs out of Dusty’s lap onto the grass. She wants to do this part herself._  
_A cocoon closes round her, thin as a soap bubble. Rain runs down the outside of it._  
**Dusty**: She’s done. Not reborn. Done. You can tell by the light. Rebirth glows; this just… thins.  
_It thins the way breath thins on a window. You keep thinking it has finished, and it hasn’t._  
_Dusty puts one muddy finger against it._  
_Inside, very faintly, something taps back. Twice._  
**Dusty** _(soft)_: Yes. All right. I know.  
_…_  
_And then there is only rain, and where she was, a flower pushing up through the wet grass._  
**Dusty** _(sad)_: Everyone keeps telling me it means she was happy enough to let go. That’s true. It’s also the worst thing anyone’s ever said to me.  
_Dusty doesn’t cry. They just sit there, getting wetter, looking at the flower as if it might need something._  
**Dusty**: Would you sit with me a bit. You don’t have to say anything. Hazel never did.  

> Chapter 6 opening when s5Done IS set: plays INSTEAD of c6-open (set chapter 6 opening to this id, or queue this and mark c6-open seen). Fossil is not re-introduced; Dusty thanks you for the walk (S5’s cliff, tree and water wishes). Your youngest Nubbin (the one Fossil sat with in S5’s secret wish) walks up and sits by her: move the lowest-age Nubbin to the hill if possible, otherwise the line still reads. Shares the fading half with c6-open.

#### <a id="c6-close"></a>Closing `c6-close`

_You sit with Dusty on the wet hill, by the flower. Neither of you says anything._  
_It rains, and then it rains less, and then it is only the trees dripping. It is somehow the best part._  
**Dusty** _(soft)_: Thank you. Right. I’m going to go and dig something up. That’s what I do when I feel like this. It usually works.  
**Dusty**: Yours will go one day. All of them. Love them anyway. Love them harder because of it. That’s the whole trade, and it’s a good one.  
_Dusty goes down the hill. Halfway, they stop, look back at the flower, and lift one muddy hand to it._  
_When you turn round, Moss is sitting by the flower._  
_You didn’t see him come. The rain runs off him in silver threads._  
**Moss** _(soft)_: Briar’s was the first flower on this hill. She went up laughing.  
**Moss**: This one went up in somebody’s lap, with the rain on her. I think that is better. Briar would argue.  
_He looks at the flower for a long while. Then he says it, plainly, the way he says everything._  
**Moss**: That is fading done right. Not stilled. Let go.  
**Moss** _(think)_: There are people who would rather a thing were still than gone. You have met one, up the valley.  
**Moss**: They call it keeping. It is not keeping. Keeping is this. Sitting in the rain by what you could not hold.  
_Down the hill, Dusty has nearly reached the gate._  

**Choices**

- **Call after Dusty, and tell them what Moss said.**
    - You call down the hill. Dusty stops with their hand on the gate and listens to the whole thing without moving.
    - **Dusty**: …Tell him thank you.
    - **Dusty**: And tell him he’s got grass on his head.
    - **Moss**: I am aware of the grass.
    - Moss does not move from the flower until it is dark.
- **Keep it. Some things belong to the hill.**
    - You don’t call after them. Dusty lifts and pushes, and is gone.
    - You stay. Moss stays.
    - The flower, which has never been rained on before, seems to be getting used to it.
    - Moss does not move from the flower until it is dark.

> Chapter 6 closing, after talking to Dusty. Moss: “That is fading done right. Not stilled. Let go.” Grief done right (Fossil) set against grief refused (Corvin, “up the valley”, unnamed). Choice only changes Dusty friendship. Both branches end with Moss sitting by the flower until dark. S7 should open after this chapter.

## Chapter 7: What Fear Teaches

Goal: Bring Sable’s trust to 45. (`sableTrust45`) · Hint: Feeding and petting raise trust. Hunger and throws destroy it. Shadow Nubbins heal slowly.

#### <a id="c7-open"></a>Opening `c7-open`

_Sable sleeps near you now. Not next to you: near._  
_When you move in your sleep she wakes, every time._  
_You wake before dawn because you are cold._  
_The Grove is white. Not all of it._  
_The frost lies in a long tongue from the edge of the long grass to the fourth lantern post._  
_It gathers round the post, thick as fur. The other three stand damp and dark and ordinary._  
_Your breath smokes. The frost squeaks under your bare feet, and you go back in for socks, and come out again faster._  
_Sable is awake. She is looking at the post, and she is not moving at all._  
_Not even her ears._  
**Luna**: You’re up. Good. I didn’t want to wake you, and I didn’t want to wait.  
_Luna has soil to her elbows and a lantern burnt down to the wick. For her, this is the end of the day._  
**Luna** _(think)_: It isn’t cold enough for that. I’ve had my hands in the ground all night. It isn’t cold enough for gloves.  
**Luna**: I went up the valley last week. At night. I see what comes out at night.  
**Luna**: I found out where she came from. Corvin’s garden.  
**Luna** _(angry)_: He trains them with cold and with hunger. Food when they obey; nothing when they don’t. It works. It’s fast.  
**Luna**: There’s a pen at the end of the last row. Empty. A bowl in it, frozen to the floor. In summer.  
**Luna**: Sable wouldn’t race. So she got nothing, for a long time. And then one night the gate was open.  
_You look at Sable. Sable looks at the frost._  
**Luna** _(sad)_: Her first nights here, the grass was white where she slept. I said it was just her. It was never just her, was it.  
**Luna** _(soft)_: She chose you, you know. She could have gone anywhere. She watched this Grove for three nights and decided your hands looked slow enough.  
_Sable’s little ball, still dark, bobs once._  
**Luna**: I need to sleep. This is my midnight. Moss is coming down; he’s been watching that post since before I got here.  
**Luna**: I can’t hear him. You can. Listen properly.  

> Chapter 7 opening, before dawn. Staging: frost on the Grove only in a tongue from the long grass to the Long-Grass lantern post, thick round the post (art: frost decal; keep it every dawn through ch7–8). Sable frozen in place facing the post. Luna leaves at the end. S2’s decision falls in this chapter (its own scenes).

#### <a id="c7-stillness"></a>Scene `c7-stillness`

_Moss comes down the hill through the white grass._  
_He leaves no prints at all. He is very light, these days._  
_He stops at the fourth post and looks at the frost on it for a long time._  
**Moss** _(think)_: Cold goes back to where it was kept. It is looking for its bed.  
**Moss**: There is nothing under this post. There has not been for a long time. You knew that, I think, when the lantern went out.  
_You think of Lantern Night, and the flicker, and the dark. You think of him saying: twenty-two years._  
**Moss**: Sit. This is a long one, I am slow, and you have a habit of standing.  
_You sit on the frozen ground. After a while Sable sits too, two steps off, with her back to the post._  
**Moss**: On Lantern Night I told you how Cinder made a stone, and how they came out of the White Year alive, and grey, and still.  
**Moss**: I told it to you as a story. Stories are kind; they stop. Now I will tell you what it is like.  

**Choices**

- **Why are they grey?**
    - **Moss**: Grey is not the cold. Grey is what the cold leaves behind. It is a scar, not a wound.
    - **Moss**: The cold says one thing, over and over. A Nubbin who hears it long enough stops being able to hear anything else.
    - A crow goes over. Sable flinches, and then, slowly, remembers she does not have to.
    - **Moss**: The colour goes first. Then the wanting. The wanting is the part that matters.
- **Does it hurt them?**
    - **Moss**: Not the way you mean. That is the worst of it.
    - **Moss**: Hunger hurts. Cold hurts. The Stillness does not. It is the end of hurting, and of everything that sits beside hurting.
    - He looks at you sideways, the way old people check whether you have understood or only nodded.
    - **Moss**: Joy sits beside hurting. So does wanting your dinner. So does running at a gate every morning and bouncing off.
- **Is that what happened to Sable?**
    - **Moss**: Some of it. Hunger did most of the work. But that garden is cold all year round, and the cold helped.
    - **Moss**: I can smell it on her still, the way you smell smoke on a coat long after the fire.
    - Sable, at the sound of her name, turns one ear towards him.
    - Only one. It is more than she gave anyone at midsummer.
    - **Moss**: She ran from it, though. Remember that. Something in her kept wanting, all the way down.

> New. Moss explains the Stillness, part 1 of 3. Queue c7-stillness, c7-stillness-2, c7-stillness-3 in that order straight after c7-open (same sitting, at the Long-Grass post). Each part ends with a question choice; all choices are flavour (no flags, no friendship) and every branch leads to the next part. Moss stands by the post.

#### <a id="c7-stillness-2"></a>Scene `c7-stillness-2`

**Moss**: A shard does not shout. It is not a monster. If it were a monster, it would be easy; you would only have to be brave.  
**Moss**: It says one word. It says it to whoever is most afraid. From where it sits, that is a kindness.  
_He waits so long that a hen over the wall decides he has finished, and says so at length._  
_Moss waits for the hen as well. Then:_  
**Moss**: Safe.  
_The word sits in the cold air between you. Sable’s ears go flat against her head._  
**Moss**: Think what you would give to know nothing would ever hurt them. No hawk. No fever. No hill.  
**Moss**: Think what you would give to know nothing could ever hurt you through them.  
_You think of Fossil in the rain. You think of Dusty’s muddy hand, lifted to a flower._  
**Moss** _(sad)_: That is what it offers. And it keeps its word. That is the terrible thing about it. It always keeps its word.  

**Choices**

- **Did Cinder hear it?**
    - **Moss**: She heard it first. She made it, out of the spring’s cold and her own fear, and it spoke to her in her own voice.
    - **Moss**: She loved them more than any of us. That is why it found her so easily. It looks for the ones who love hardest.
    - Somewhere over the wall, Fern is humming a skipping rhyme to the hens. You cannot quite hear the words.
    - **Moss**: You know what the valley calls a love that holds too tight. She would have known it was fair.
- **Who would ever listen to that?**
    - **Moss**: Anyone who has loved something and watched it nearly die.
    - **Moss**: So: anyone worth knowing.
    - He shifts on the frozen grass. It takes him a while.
    - **Moss**: Do not think the ones who listen are wicked. Most of them are only frightened, and very tired, and alone with it.
- **Could I hear it?**
    - **Moss**: Yes.
    - **Moss**: You love them already. That is the door it uses. I would be lying if I told you that you were safe from it.
    - **Moss**: …Safe. Hm. There it is again. You see how it gets into everything.
    - **Moss**: I am too old to start lying to you. I am also too old to let you go near it alone. Remember both.

> New. Stillness part 2: what the shard whispers (“Safe.”). The skipping-rhyme line in the cinder branch is intentionally wordless; Cinder’s rhyme itself appears elsewhere. Questions are flavour only.

#### <a id="c7-stillness-3"></a>Scene `c7-stillness-3`

**Moss**: Hazel had a word for the opposite. She did not use it much. She was not a woman for words; she was a woman for soup.  
**Moss**: She said “well”.  
_The sun reaches the top of the western hill. The frost on the near grass begins, very slightly, to steam._  
**Moss**: A Nubbin that is well can be hurt. It runs off. It eats a beetle. It falls in love with a stick and will not be parted from it.  
_Your Nubbin, who has been listening, goes and fetches a stick. It lays it at Moss’s feet._  
**Moss** _(soft)_: Yes. Thank you. Exactly that.  
**Moss**: It gets lost in the long grass. It comes back. One day it goes up the hill.  
**Moss**: A Nubbin that is safe cannot be hurt. And it cannot do any of the rest.  
_…_  
**Moss**: Safe is not the same as well.  
_Moss looks at Sable. Sable is looking at the frost, and then, for a moment, at you._  
**Moss**: The grey stays. Clover told you that, and she was right. But the grey is not the Stillness. It is where the Stillness was.  
**Moss** _(soft)_: A scar can be touched. A scar can be leaned on. You will see.  

**Choices**

- **What do I do for her?**
    - **Moss**: What Hazel did. Feed her before you feed yourself. Never, ever throw her. And when you don’t know what to do—
    - **You**: —sit down next to her and wait.
    - **Moss**: Yes. You were listening. She will be pleased. Do not tell her I said so.
- **Where is the stone from this post?**
    - **Moss**: That is not mine to say.
    - **Moss**: I made a promise to someone who is still alive, and I keep promises longer than I keep most things.
    - **Moss**: Hazel wrote everything down. She was always better at writing things than saying them. Find what she wrote.
- **Say nothing. Stay sitting.**
    - You say nothing. The three of you sit by the empty post while the sun comes down the hill.
    - **Moss**: Good. You are learning faster than she did.
    - **Moss**: I sat beside her a whole winter before I said a word. She fidgeted all the way through it.

> New. Stillness part 3: “Safe is not the same as well.” Grey is the scar, not the Stillness. The “where” branch points at Hazel’s notebook (ch8) without naming Corvin. Then the goal (Sable trust 45) begins.

#### <a id="c7-close"></a>Closing `c7-close`

_The frost comes most mornings now. It never goes past the long grass, and round the fourth post it never quite goes._  
_Then, one afternoon, Sable walks up to you, in daylight, in front of everyone, and leans her whole weight against your shin._  
_She is heavier than she looks. You stand very still and let her be._  
**Clover** _(happy)_: Oh. Oh, look at her.  
**Luna** _(soft)_: Still grey. Always will be. And look at her anyway.  
_Sable says nothing. Her ears stay up._  
_The dark ball above her head flickers, just for a moment, with something that might be a heart._  
**Byte** _(think)_: Statistically, a Shadow Nubbin initiating contact—  
**Luna**: Byte.  
**Byte**: …Yes. All right. That was very nice. I’m writing it down as nice.  
**Clover** _(happy)_: Write it down twice.  
**Clover** _(happy)_: She slept on my blanket last night, you know. All night. Don’t tell her I told you. She’d be mortified.  
_Pixel comes over the stile with a box under one arm. On the front is a dial, a needle and one hand-painted word: MAYBE._  
**Pixel** _(happy)_: Trust meter. For Sable. I built it last night.  
**Byte**: What does it measure?  
**Pixel**: Mostly it says maybe. That’s accurate. Nothing about her is calibrated.  
_The needle trembles, and stays on MAYBE. Sable looks at the box with deep suspicion and leans harder on your shin._  
_Up on the hill, Moss watches, and then looks away, the way you look away from something private._  

> Chapter 7 closing, at Sable trust 45, in daylight with Clover, Luna, Byte and Pixel nearby (spawn them if not present). Sable leans her weight on your shin (animation: Sable presses against the Keeper’s leg). Sable is narrated, never a speaker (her one word is c10-safe-sable). Byte’s line nods at S7. Clover’s blanket (from c3-close) has been slept on. Pixel’s trust meter reads MAYBE (prop: optional decoration by the cottage door from here on; paid off in end-hazels-grove and end-long-road).

## Chapter 8: The Hollow

Goal: Walk the Hollow and find Hazel’s notebook. (`notebook`) · Hint: The Hollow is dark; follow the fireflies to a flat stone and tap the notebook. The Expedition from the top bar runs through the Hollow now too.

#### <a id="c8-open"></a>Opening `c8-open`

_Nova is at the gate at first light, with a pack on her back and a lantern that isn’t lit._  
_Autumn has come in overnight. The plum leaves are yellow at the edges, and the air smells of smoke and wet apples._  
_Her boots are laced with three different laces. Her pack smells of pine smoke and of somewhere a long way off._  
_She lifts and pushes without thinking. She has come through the Grove five or six times since spring._  
_Always the same: a cup of tea she never finishes, a story from somewhere you have never been, and gone by morning._  
**Nova**: Don’t put the kettle on. I’m not staying for tea. I never do.  
**Nova** _(think)_: …I am staying long enough to ask you something, though. Which I also never do. So bear with me. I’m bad at it.  
**Nova**: The Hollow. Past the falls, where the paths stop. Strays end up there. Runaways. The ones people stopped feeding.  
**Nova**: Somebody’s been feeding them. Since the end of the winter. A woman with a lantern and a bag of fruit.  
_She doesn’t say the name. She doesn’t need to._  
**Nova** _(soft)_: I’ve seen her. From a distance. She didn’t wave. She was busy. She looked… small.  
**Nova**: Her fire’s been cold nine days. The bowls are empty. There are more grey ones in those trees every time I pass.  
**Nova**: And it’s cold in there. It never used to be cold in there.  
**Nova**: I’ve been everywhere in this valley on my own. I’d rather not go there on my own. Will you come?  
_On the hill, Moss stirs. His voice comes from just behind your ears, dry and quiet._  
**Moss**: The Hollow. Past the falls, past where the paths stop. Hazel went in with a lantern and a bag of fruit and the stubborn chin.  
**Moss**: You have the chin. Take the rest.  

**Choices**

- **Yes. Now.**
    - **Nova**: Oh. Good. That was much easier than I’d feared. I’d practised a speech.
    - **Nova**: You’ll get the speech on the way, I’m afraid. It has a bit about owls in it.
    - **Nova**: So we go and find out. We take what she took: a Nubbin that trusts you, and more fruit than seems sensible.
    - Nova holds her lantern to your kitchen fire until it catches. She doesn’t say why she waited to light it here.
    - She rummages in her pack for the speech. It runs to both sides of the page.
- **Is she all right?**
    - **Nova**: I don’t know. That’s the honest answer, and you’d know if I gave you another one.
    - **Nova**: I’ll fetch Marina. You fetch a Nubbin that trusts you, and fruit. More fruit than that.
    - Nova is halfway down the lane, shouting for Marina, before you have found a bag.
- **How do we get past the falls?**
    - **Nova**: We don’t. Marina does. We follow her very closely and we don’t look down.
    - **Nova**: Take a Nubbin that trusts you. Take fruit. Take more fruit than that.

> Chapter 8 opening. Nova asks for help for the first time; she has visited before. Note beginChapter(8) moves the world to the Hollow before this queues: stage c8-open and the ledge scene over a Grove-gate / falls backdrop (or play them before setLocation). Choices change Nova (and Marina) friendship, and each ends on its own beat: yes, Nova’s practised speech (owls); hazel, she lights her lantern at your fire; falls, she runs to fetch Marina. Opens S8.

#### <a id="c8-ledge"></a>Scene `c8-ledge`

_Fern catches you at the gate with a bag. In it: fruit, a jumper, a whistle, a second jumper, and a note that says SORRY ABOUT THE JUMPERS._  
**Fern** _(think)_: It’s cold where you’re going. Everyone says so. I don’t know anything else useful, so: jumpers.  
_Sable comes with you as far as the gate, and stops there, and sits._  
_This is as far as she goes. She will be here._  
_Marina is waiting at the pool below the falls, sleeves rolled, hair already wet._  
**Marina**: Nova said you’d be coming this way. Nova never says anything, so I listened.  
**Marina**: Nobody comes this way but me. Hazel did, with me, more times than I could count. Hand on the rock, eyes on my heels.  
**Marina**: And don’t be brave. Brave people fall off. Be careful instead. It’s less exciting and you get home.  
**Marina** _(think)_: Rule four still applies. Sparks would have grabbed the waterfall.  
**Marina** _(think)_: I taught every one of Hazel’s Nubbins to swim, you know. People think that’s all I did for her.  
_The ledge is a hand’s width wide and runs behind the falling water. The roar fills your head until nothing else fits._  
_Green light. White water._  
_Spray on your face, cold; the rock under your palm, colder._  
_Then, halfway along, warmth. It comes up through the stone into your hand like the side of a teapot._  
**Marina**: Look. Don’t stop. Just look.  
_Through a split in the rock: a cave of glittering stone, and in it a pool, steaming gently, lit from underneath by nothing at all._  
_The Wellspring. It is the stillest water you have ever seen, and the most alive._  
**Marina** _(soft)_: That’s where they came from. The first ones. Up out of that, each one a little light. Moss told Hazel. Hazel told me.  
**Marina**: The water never freezes. Only the rim, once, in the White Year, and look what came of that.  
**Marina**: It’s the one warm thing the valley’s always been able to count on.  
_Round the rim of the warm water, where nothing should be cold, runs a thin white line of frost._  
**Marina** _(shock)_: …That’s new.  
**Marina**: Thirty years I’ve walked past it. It’s never had so much as a cold morning on it.  
_Marina’s hand finds your sleeve and holds on, just for a moment, the way you’d hold a rail._  
**Marina**: Keep going. The Hollow’s through there. Mind the last step. It’s further than it looks.  
_Past the falls the trees close in, and the path gives up, and there is only moss and dark and a few slow fireflies._  
_Something grey is sitting in the branches above you._  
_Then another. Then you stop counting._  
**Nova** _(soft)_: Don’t look straight at them. Look a bit to one side. It’s politer.  

> New. Plays straight after c8-open when s4Done is NOT set. Marina leads along the ledge behind the falls; first glimpse of the warm Wellspring, its rim rimed with frost. Ends at the Hollow’s edge with grey shapes in the trees; then the goal (follow the fireflies to the notebook). Opens at the gate: Fern’s bag of jumpers (comic), Sable stays at the gate. Fern is present only in that opening beat (spawn her by the gate if possible).

#### <a id="c8-ledge-s4"></a>Scene `c8-ledge-s4`

_Fern catches you at the gate with a bag. In it: fruit, a jumper, a whistle, a second jumper, and a note that says SORRY ABOUT THE JUMPERS._  
**Fern** _(think)_: It’s cold where you’re going. Everyone says so. I don’t know anything else useful, so: jumpers.  
_Sable comes with you as far as the gate, and stops there, and sits._  
_This is as far as she goes. She will be here._  
_Marina is waiting at the pool below the falls, sleeves rolled, hair already wet._  
**Marina**: Nova said you’d be coming this way. Nova never says anything, so I listened.  
**Marina** _(happy)_: You’ve walked this once already, so you know the rules. Hand on the rock, eyes on my heels.  
**Marina**: And you still don’t get to be brave. Brave people fall off.  
**Marina** _(think)_: Rule four still applies. Sparks would have grabbed the waterfall.  
_The ledge is a hand’s width wide and runs behind the falling water. The roar fills your head until nothing else fits._  
_Green light. White water._  
_Spray on your face, cold; the rock under your palm, colder._  
_Then, halfway along, warmth. It comes up through the stone into your hand like the side of a teapot._  
**Marina**: Look. Don’t stop. Just look.  
_Through a split in the rock: a cave of glittering stone, and in it a pool, steaming gently, lit from underneath by nothing at all._  
_The Wellspring. It is the stillest water you have ever seen, and the most alive._  
**Marina** _(soft)_: That’s where they came from. The first ones. Up out of that, each one a little light. Moss told Hazel. Hazel told me.  
**Marina**: The water never freezes. Only the rim, once, in the White Year, and look what came of that.  
**Marina**: It’s the one warm thing the valley’s always been able to count on.  
_Round the rim of the warm water, where nothing should be cold, runs a thin white line of frost._  
**Marina** _(shock)_: …That wasn’t there when I brought you before. Not a thread of it.  
**Marina**: Thirty years I’ve walked past it. It’s never had so much as a cold morning on it.  
_Marina’s hand finds your sleeve and holds on, just for a moment, the way you’d hold a rail._  
**Marina**: Keep going. The Hollow’s through there. Mind the last step. It’s further than it looks.  
_Past the falls the trees close in, and the path gives up, and there is only moss and dark and a few slow fireflies._  
_Something grey is sitting in the branches above you._  
_Then another. Then you stop counting._  
**Nova** _(soft)_: Don’t look straight at them. Look a bit to one side. It’s politer.  

> New. Plays INSTEAD of c8-ledge when s4Done IS set (Marina showed you the path in S4). Shares the gate opening (Fern’s jumpers) and the ledge; differs only in Marina’s rules lines and her reaction to the frost (“That wasn’t there when I brought you before”).

#### <a id="c8-nova"></a>Scene `c8-nova`

_You walk back towards the falls with the notebook inside your coat, flat against your chest, where it stays warm._  
_Fireflies come and go. Somewhere behind you, something grey drops from a branch to a bowl, and eats, and does not run._  
**Nova** _(think)_: Can I say something I shouldn’t?  
**Nova**: She had a year. She could have spent it at home. By the pond. With you, when you came.  
**Nova**: She spent it out here instead, with a lot of grey strangers who never once said thank you.  
**Nova** _(soft)_: Do you mind? You’re allowed to. I would.  

**Choices**

- **Yes. I’d have liked the year.**
    - **Nova**: Good. Tell her, if you get the chance. She’d rather be argued with than forgiven.
    - You think of the letter. Don’t be dramatic about it.
    - You think you might be, a bit, when you see her.
- **No. They needed her more than I did.**
    - **Nova**: Maybe. I’m not sure need is a queue, though. I’m not sure anyone has to stand at the back of it.
    - You walk on. You think about that for much longer than you expect to.
- **Both. I mind, and she was right.**
    - **Nova**: Both are true, then.
    - It is almost exactly what she wrote.
    - Nova hasn’t read that page. You don’t tell her.

> New. Plays straight after c8-close, on the walk back from the camp (same location; fireflies). Book Two ends here: advance to chapter 9 only once it is seen. The player’s first chance to answer the notebook’s news: should Hazel have spent her year at home? Choices year-mind | year-right | year-both change Nova friendship only, no flags. “Both are true” echoes Hazel’s notebook page.

#### <a id="c8-close"></a>Closing `c8-close`

_You didn’t find her. You found a camp: a cold fire, a dozen bowls, a dozen grey shapes watching from the trees._  
_The bowls are licked clean. The firewood is stacked and tied with string, neatly, as if she meant to be back tomorrow._  
_There is frost on the string. The ashes still smell faintly of apple wood._  
_Nobody has sat by them for days._  
_And on a flat stone, a notebook in her hand._  
**Gran Hazel** _(soft)_: “Day 300-something. Lost count. Fed nineteen today. The brown one let me touch her ear. Took two months. Worth it.”  
**Gran Hazel**: “The doctor said a year. I decided it would be a good one. I was right. I’m always right; it’s very tiring for everyone.”  
**Gran Hazel** _(soft)_: “If my grandchild reads this: I’m not sorry. I’m sorry you had to find out this way. Both are true. Lift and push.”  
_There is one more page. The writing is newer, and harder._  
_In two places the pen has gone through the paper._  
**Gran Hazel**: “The cold comes from up the valley. I know where the fourth one went. I always knew. I hoped he’d bring it back himself.”  
_…_  
_You think of a man leaning on a gate, waiting for it to open. You think of his hands, blue at the knuckles._  
_You think of him touching his breast pocket, lightly, the way some people touch a ring._  
**Nova** _(soft)_: Her tracks go north. Up the valley. Into the cold, not away from it.  
**Nova**: That’s her all over, isn’t it.  
_Your Nubbin puts its head on your knee and keeps it there until you can stand up._  

**Choices**

- **Fill the bowls before you go.**
    - You fill all twelve bowls. Nobody comes down from the trees while you are watching.
    - When you look back from the edge of the camp, three of them are already empty.
    - **Nova**: That’s how she did it. One bowl at a time. Since the snow.
- **Sit down by the cold fire, and wait.**
    - You sit by the cold fire. Rule three.
    - The notebook is in your lap and the light goes amber, then blue.
    - After a long time, one grey shape climbs down to the lowest branch, and stays there, and watches you breathe.
    - **Nova**: That’s further than they’ve ever come for me.

> Chapter 8 closing, on tapping the notebook. Hazel’s three existing pages verbatim, then the new last page verbatim from the bible. Corvin is implied, not named. The choice changes Nova friendship only; both branches are Hazel’s rules in action (rule one / rule three). Then c8-nova.
