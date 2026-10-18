# Learning Grove line LK: Mouse-Deer (LK1–LK10)

## LK1. The Shadow Screen

*Sang Kancil tales (traditional; Malaysia and Indonesia): the storytellers and the mouse-deer* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Help Siti and Wulan put up their shadow screen by the pond.

Hint: Take the second pole by the pond and hold it steady while the cloth is tied. · check: `build:lk-shadow-screen`

#### Scene `lk01-dusk`

_Summer is nearly over. At dusk, two women come down the lane with a long roll of white cloth and a wooden box._  
_They stop at the pond and study it the way builders study a wall._  
**Mak Cik Siti** _(happy)_: This is the spot. Flat ground, still water, and a bank for the children to sit on.  
**Mak Cik Siti**: I’m Siti. The little ones call me Mak Cik Siti, which means Auntie Siti. I’m from Melaka, in Malaysia.  
**Bu Wulan**: And I’m Wulan. Bu Wulan, to be polite. I’m from Yogyakarta, in Indonesia.  
**Bu Wulan** _(happy)_: We met on a boat forty years ago, and we’ve argued ever since.  
**Mak Cik Siti**: Lovingly.  
**Bu Wulan**: Mostly lovingly. Will you hold that pole while Siti ties the cloth?  
_Your Nubbin takes the other pole without being asked. The pole is taller than it by quite a lot._  

#### Done `lk01-lamp`

_The screen goes up, tight as a drum. Wulan lights a lamp behind it, and the cloth glows warm gold._  
**Mak Cik Siti** _(happy)_: There. Now nothing can hide. Not even a shadow.  
_Your Nubbin walks between the lamp and the cloth. Its shadow stretches across the screen, enormous._  
_It stares at the giant shadow, then waves. The shadow waves back._  
**Bu Wulan**: Shadows are honest. They copy you exactly, only bigger or smaller.  
**Bu Wulan**: Here. Try it with a puppet.  

### Step 2: Meet the mouse-deer puppet and choose whose way to hear the tales first.

Hint: Talk to Siti or Wulan by the screen. · check: `choose:lk-first-teller`

#### Scene `lk01-names`

_Siti opens the box. Inside are flat leather puppets on sticks: a crocodile, a tiger, an elephant, a snail._  
_Last of all she lifts out a tiny deer with thin legs and a clever face. It fits in her hand._  
**Mak Cik Siti** _(happy)_: This is Sang Kancil, the mouse-deer. The smallest animal in the forest, and the cleverest.  
**Bu Wulan** _(think)_: Si Kancil.  
**Mak Cik Siti**: Sang Kancil. That’s what my grandmother called him.  
**Bu Wulan**: And mine called him Si Kancil, and she was never wrong about anything, including the weather.  
**Mak Cik Siti** _(soft)_: He belongs to both of us. To Singapore and Brunei too. To every child who ever heard him.  
**Bu Wulan**: Fine. But somebody has to tell the first tale.  
_They both look at you. So does your Nubbin, which has climbed into the puppet box._  

**Choices**

- **Siti’s way first: Sang Kancil.** — sets `{"lk-first":"siti"}`
    - **Mak Cik Siti**: Sang Kancil it is. Wulan, you may sulk.
    - **Bu Wulan**: I never sulk. I wait.
- **Wulan’s way first: Si Kancil.** — sets `{"lk-first":"wulan"}`
    - **Bu Wulan**: Si Kancil it is. Siti, you can do the crocodile voices.
    - **Mak Cik Siti**: I always do the crocodile voices. Nobody else can.

#### Complete `lk01-complete`

_Wulan hands the little puppet to your Nubbin. It holds it up to the lamp very carefully, as if it might wake._  
**Bu Wulan**: One tale at a time. Your Nubbin will be Kancil behind the screen. Small, quick, and no talking.  
**Mak Cik Siti** _(happy)_: We’ll do the talking. We’re very good at it.  
_Your Nubbin nods, solemn. It has never been better suited to a part._  
**Bu Wulan**: Come back at dusk. Bring the children. Bring the whole valley, if it fits on the bank.  
**Mak Cik Siti** _(happy)_: And bring an appetite. I make kuih.  

**Rewards**

- Kancil shadow puppet (item): A small leather mouse-deer on a stick. Your Nubbin can “play” it by any lamp. One-time.

**Notes:** Staging: dusk by the pond. The screen is a white cloth on two bamboo poles with a lamp behind; the shadow puppets are flat, cut leather on sticks in the wayang kancil style (adviser needed for the puppets, the lamp and both women’s clothes; Siti wears a tudung). The lk-first choice decides who tells LK7’s cucumber tale and which language leads LK10’s count. The Kancil puppet becomes a held item for your Nubbin.

## LK2. Kancil Is Hungry

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil and the fruit across the river* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK1

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch the first tale from the bank: Kancil is hungry.

Hint: Come to the pond at dusk and sit on the bank. · check: `watch:lk-shadow-play:hungry`

#### Scene `lk02-hungry`

_Dusk again. The lamp is lit, and the bank is full of valley children sitting on their hands to keep still._  
**Mak Cik Siti** _(soft)_: Long ago, in the forest, when the rains were late, Kancil woke up hungry.  
_Your Nubbin trots the puppet across the screen. Its shadow hops, quick and light._  
**Kancil** _(sad)_: My tummy is growling louder than a tiger. Somebody find me breakfast.  
**Bu Wulan**: Kancil looked everywhere. The bushes were bare. The berries were gone.  
**Kancil** _(happy)_: And over there, across the river, the trees are heavy with fruit. Ripe and sweet and swinging.  
**Mak Cik Siti** _(think)_: But the river was wide, and Kancil was small. And the river was full of crocodiles.  
_Siti slides a long, lumpy shadow along the bottom of the screen, then another. The children go very quiet._  

#### Done `lk02-ripples`

_Wulan flicks water from the pond onto the screen. The shadow river ripples._  
**Bu Wulan**: Rivers in the forest are never empty. Fish, frogs, birds and crocodiles, all of them hungry too.  
**Kancil** _(think)_: Then I shall have to be clever. Being big isn’t an option.  

### Step 2: Go and look at the stream with your Nubbin: how could a small deer get across?

Hint: Walk down to the stream that runs into the pond. · check: `explore:lk-stream`

#### Scene `lk02-plan`

_The tale stops there. Wulan leans out from behind the screen._  
**Bu Wulan**: Every good tale has a question in the middle. How does a very small deer cross a very big river?  
**Mak Cik Siti**: Don’t tell them, Wulan.  
**Bu Wulan** _(happy)_: I’m not telling them. I’m asking them.  
_A boy at the front says Kancil should swim, and a girl says build a boat. Somebody says “ask a bird”._  
**Mak Cik Siti** _(happy)_: All good ideas. Come back at dusk and see what Kancil does.  
_Your Nubbin is already at the stream, staring at the far side the way Kancil stared at the fruit._  

#### Complete `lk02-complete`

_The children walk home arguing about boats._  
**Mak Cik Siti** _(soft)_: That’s how you know a tale is working. They take it home with them.  
**Bu Wulan** _(happy)_: My grandmother stopped every tale on a question. We never slept.  
_Your Nubbin is still at the stream, counting something on its fingers._  

**Rewards**


**Notes:** Staging: the river is a strip of blue-grey shadow along the bottom of the screen; Wulan flicks real pond water at it for ripples. The tale deliberately stops on the question; LK3 answers it.

## LK3. Counting the Crocodiles

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil counts the crocodiles* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK2

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch Kancil call the crocodiles to the bank.

Hint: Sit on the bank at dusk for the second tale. · check: `watch:lk-shadow-play:crocodiles`

#### Scene `lk03-river`

**Mak Cik Siti** _(soft)_: Kancil walked right up to the edge of the river, where the water was dark and still.  
**Kancil** _(happy)_: Crocodiles! Crocodiles of the river! Wake up! I have a message from the King!  
_Siti raises the crocodile puppet. It has a great many leather teeth and a very grumpy eye._  
**Crocodile** _(angry)_: Who is shouting? Some of us were asleep. Some of us were dreaming about lunch.  
**Kancil**: The King wants to know how many crocodiles live in this river. Every single one. I’ve come to count you.  
**Crocodile** _(think)_: Count us? Nobody has ever counted us.  
**Kancil**: Then line up from this bank to that one, nose to tail, so I don’t miss anyone.  
**Crocodile** _(think)_: Hmm. Well. If it’s for the King.  
_One by one, shadow crocodiles slide out across the screen, until there is a bumpy bridge from side to side._  

#### Done `lk03-lined`

_Siti stops. She looks out at the pond, then at the Grove’s Nubbins splashing in the shallows._  
**Mak Cik Siti** _(happy)_: Do you know, I think this tale wants to be played for real.  
_The Nubbins look at each other. Then, one at a time, they float out into the stream and line up, nose to tail._  

### Step 2: Count the crocodiles as your Nubbin hops across the line.

Hint: Your Nubbin hops from back to back across the stream; count each hop. · check: `walk:lk-crocodile-line:10`

#### Scene `lk03-count`

_Ten Nubbins bob in a line across the stream, all pretending very hard to be crocodiles._  
_One of them practises a grumpy face. It mostly looks sleepy._  
**Bu Wulan**: Kancil steps onto the first back. Count with him, everyone!  
_Your Nubbin hops onto the first Nubbin, wobbles and holds out its arms. Then it hops again._  
**Mak Cik Siti** _(happy)_: One, two, three, four, five!  
**Bu Wulan** _(happy)_: Six, seven, eight, nine, ten!  
_Ten hops, and your Nubbin lands on the far bank with a squelch and a look of enormous pride._  
**Mak Cik Siti**: Now in my language. Satu, dua, tiga, empat, lima, enam, tujuh, lapan, sembilan, sepuluh!  
**Bu Wulan**: Mine is the same, all but one. Satu, dua, tiga, empat, lima, enam, tujuh, delapan, sembilan, sepuluh!  
**Mak Cik Siti** _(think)_: Lapan.  
**Bu Wulan** _(think)_: Delapan.  
_The children shout both, very loudly, at once._  

#### Done `lk03-over`

**Kancil** _(happy)_: Ten crocodiles! The King will be delighted. And look at that, I seem to be on the other side.  
**Crocodile** _(shock)_: Wait. Was that counting? Or was that crossing?  
_Behind the screen, Siti laughs so hard the crocodile puppet shakes._  

### Step 3: Decide what Kancil does on the far bank.

Hint: Talk to Siti and Wulan by the screen. · check: `choose:lk-croc`

#### Scene `lk03-turn`

**Bu Wulan** _(soft)_: So. Kancil is safe on the far bank, with the fruit trees right behind him.  
**Bu Wulan**: And ten crocodiles are in the water, slowly working out that there was no count, and no King waiting.  
**Mak Cik Siti**: Our grandmothers told this next part differently. So does everybody.  
**Mak Cik Siti** _(think)_: So you tell us. What does Kancil do?  
_Your Nubbin stands on the far bank holding the puppet, waiting to be told._  
_Out in the stream, ten Nubbins wait too, still being crocodiles._  

**Choices**

- **Kancil turns back and says thank you.** — sets `{"lk-croc":"thanks"}`
    - **Kancil**: Thank you, crocodiles! That was the best bridge in the whole forest.
    - **Crocodile**: Well. You’re welcome, I suppose.
    - In the stream, the Nubbin crocodiles look very pleased with themselves.
- **Kancil says sorry for the trick.** — sets `{"lk-croc":"sorry"}`
    - **Kancil**: Crocodiles, I’m sorry. There was no count. I was hungry and scared, and I tricked you.
    - **Crocodile**: Hmph. At least you said so.
    - The Nubbin crocodiles bob about, thinking it over.
- **Kancil laughs and runs off into the trees.** — sets `{"lk-croc":"laughed"}`
    - **Kancil**: Ha! Silly crocodiles! Too slow, too slow!
    - **Crocodile**: Come back here, you little...!
    - The Nubbin crocodiles splash, very offended. One of them sulks under a lily pad.

#### Complete `lk03-complete`

_The Nubbins paddle back to the shallows, very pleased with themselves for being such good crocodiles._  
**Mak Cik Siti** _(happy)_: Ten crocodiles, ten hops. Some tales are made of numbers.  
**Bu Wulan** _(happy)_: Leave a bridge across the stream. The children will want to count it again.  
_By morning someone has painted ten flat stones with grumpy crocodile faces and set them in a line across the stream._  
_Your Nubbin crosses on them twice, nodding once at every stone._  

**Rewards**

- Crocodile stepping-stones (decor): Ten flat stones painted with grumpy crocodile faces, set across the Grove’s stream. One-time.

**Notes:** The centrepiece, a big scene. Staging for lk03-count: ten Grove Nubbins float in a line across the stream (pull extra from the roster or the wild if fewer than ten live in the Grove) and the player’s Nubbin hops back to back; each hop ticks the counter. The Malay and Indonesian counts need native-speaker audio. lk-croc is the signature choice: laughed changes LK4 (lk04-grab-laughed) and LK10 (lk10-line-laughed). Sprout offers only thanks and sorry.

## LK4. The Crocodile Remembers

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil and the stick* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK3

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch Kancil go down to the river for a drink.

Hint: Sit on the bank at dusk for the third tale. · check: `watch:lk-shadow-play:stick`

#### Scene `lk04-grab`

**Bu Wulan**: Some days later, Kancil was thirsty, so he went down to the river for a drink.  
_Your Nubbin bends the puppet down to the shadow water. Its little nose nearly touches the ripples._  
_A long shadow slides up underneath, and snap! The crocodile puppet has Kancil by the leg._  
**Crocodile** _(think)_: I remember you. You’re the one who counted us.  
**Crocodile** _(think)_: You were polite about it, I’ll give you that. But a crocodile still has to eat.  
**Kancil** _(think)_: Oh, crocodile. Is that my leg you’ve caught?  
**Kancil** _(happy)_: That isn’t my leg at all! That’s an old stick. Silly crocodile, you’ve caught a stick!  
_The crocodile lets go, quick as anything, and snaps at a stick floating past._  

#### Done `lk04-free`

_Kancil is up the bank and gone before the crocodile notices it’s chewing a stick._  
**Crocodile** _(shock)_: ...This is a stick.  
**Mak Cik Siti** _(happy)_: It certainly is.  

### Step 2: Find a stick by the pond and lay it beside your Nubbin’s leg.

Hint: Sticks wash up at the edge of the pond. Pick one up and bring it to the screen. · check: `find:lk-stick:long`

#### Scene `lk04-stick`

_After the tale, Wulan holds up the crocodile puppet and looks it in the eye._  
**Bu Wulan** _(soft)_: Poor thing. Tricked twice. I’d be cross too.  
**Mak Cik Siti** _(think)_: Kancil had to save himself. A crocodile had him by the leg!  
**Bu Wulan**: I didn’t say he was wrong. I said I’d be cross.  
_The children argue about it all down the bank. Your Nubbin goes looking for a stick to compare with its own leg._  
**Mak Cik Siti** _(happy)_: Bring it here. Let’s see if a crocodile could really mix them up.  

#### Complete `lk04-complete`

_Your Nubbin lays the stick beside its leg. The stick is much longer, and a lot less wriggly._  
**Bu Wulan** _(happy)_: So it wasn’t a very good stick to mistake for a leg.  
**Mak Cik Siti**: It was dark. The crocodile was hungry. Hungry makes everyone silly.  
_The crocodile puppet goes back into the box looking, if anything, slightly embarrassed._  

**Rewards**


**Notes:** VARIANT: if lk-croc = laughed, play lk04-grab-laughed (LINE_LK_VARIANTS) in place of lk04-grab: the crocodile is much crosser. Otherwise (thanks or sorry) lk04-grab, where it grumbles that it remembers. Staging: the crocodile “has” the leg; no teeth meet anything, and no biting is shown.

## LK5. The Buffalo and the Crocodile

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil judges between the buffalo and the crocodile* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK4

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch the buffalo help the crocodile out from under a log.

Hint: Sit on the bank at dusk for the fourth tale. · check: `watch:lk-shadow-play:log`

#### Scene `lk05-log`

**Mak Cik Siti** _(soft)_: One day a great storm blew through the forest, and a tree fell across the riverbank.  
_Siti drops a long shadow log across the screen. Underneath it, the crocodile puppet thrashes its tail._  
**Crocodile** _(sad)_: Help! Help! I’m stuck under this log and I can’t get out!  
_Wulan brings on the buffalo, slow and heavy, with wide curved horns._  
**Buffalo** _(soft)_: Poor crocodile. Hold still. I’ll get you out.  
_The buffalo wedges a long branch under the log and leans on the other end with its horns. The log rolls away._  
**Crocodile** _(happy)_: Free! Thank you, buffalo. Thank you so much. And now...  
_Snap! The crocodile grabs the buffalo by the leg._  
**Buffalo** _(shock)_: But I helped you!  
**Crocodile** _(think)_: And now I’m hungry. Helping makes a crocodile hungry.  

#### Done `lk05-judge`

_Your Nubbin trots Kancil onto the screen, and the children cheer as if he were a famous footballer._  
**Buffalo** _(sad)_: Kancil! Kancil! Tell this crocodile it isn’t fair!  
**Kancil** _(think)_: Hmm. I can’t judge something I haven’t seen. Show me exactly how it was, from the beginning.  

### Step 2: Help Kancil see exactly how things were: put the log back where it lay.

Hint: Roll the shadow log back across the screen when the crocodile is in place. · check: `place:lk-log:screen`

#### Scene `lk05-before`

**Crocodile** _(think)_: It was like this. I was lying here, and the log was on top of me.  
**Kancil** _(think)_: On top of you? Show me. I can’t picture it.  
_Grumbling, the crocodile lets go of the buffalo’s leg and crawls back to where it was._  
**Kancil**: And the log? Where exactly was the log?  
_The buffalo rolls the log back, right on top of the crocodile. Thump._  
**Crocodile** _(angry)_: Like this! You see? Now judge!  
**Kancil** _(think)_: I see perfectly. Buffalo, you may go home. Crocodile, you were stuck when this began, so stay as you began.  
_The buffalo walks home slowly, on all four legs. The crocodile thinks it over under the log._  

#### Complete `lk05-complete`

**Bu Wulan** _(think)_: Kancil didn’t trick anyone in that one. He only asked to see it properly.  
**Mak Cik Siti** _(happy)_: The crocodile tricked itself. It was so sure it was right, it climbed back under.  
_A small girl asks if the crocodile stays there forever._  
**Bu Wulan** _(soft)_: Until somebody kind comes along. Let’s hope it says thank you properly that time.  

**Rewards**


**Notes:** Staging: the log is a long shadow on a stick that the player rolls back in step 2. The branch used as a lever in lk05-log should be visible: the reader band’s lesson is about it.

## LK6. The Race with the Snails

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil races the snails* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK5

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch Kancil boast to a snail.

Hint: Sit on the bank at dusk for the fifth tale. · check: `watch:lk-shadow-play:snail`

#### Scene `lk06-boast`

**Bu Wulan** _(think)_: Kancil had begun to boast. He was getting rather pleased with himself. Too pleased.  
**Kancil** _(happy)_: I am the cleverest animal in the forest. And the fastest. Probably the handsomest.  
_Wulan holds up the snail puppet. It is round and patient and very, very small._  
**Kancil** _(happy)_: Look at you, snail. You’re so slow, the moss grows on you while you walk!  
_On the bank some children laugh, and a few don’t. A small boy at the back looks down at his own feet._  
**Snail** _(think)_: I may be slow. But I’ll race you, Kancil. Along the river, all the way to the big rock.  
**Kancil** _(happy)_: Race me? A snail? This will take no time at all.  

#### Done `lk06-line`

_Behind the screen, Wulan whispers something to the snail puppet. Siti hides a smile._  
**Mak Cik Siti** _(soft)_: That night the snail told all its cousins. And every snail in the river came out to help.  

### Step 2: Watch the race along the riverbank.

Hint: Help Siti set the ten snail puppets along the bottom of the screen. · check: `watch:lk-shadow-play:race`

#### Scene `lk06-race`

_Siti sets ten little snail puppets along the bottom of the screen, far apart, like posts in a fence._  
**Kancil** _(happy)_: Ready, snail? Go!  
_Your Nubbin whips the Kancil puppet along the screen. After a while it stops for breath._  
**Kancil** _(happy)_: Ha! Where are you, slow snail?  
**Snail** _(happy)_: Here I am, just ahead of you!  
_Your Nubbin runs again, faster and further._  
**Kancil** _(shock)_: Where are you now, snail?  
**Snail** _(happy)_: Still ahead of you!  
_Ten times Kancil runs, and ten times a snail answers just ahead of him, until he flops down on the bank, worn out._  
**Kancil** _(sad)_: All right. All right! You win. I give up.  

#### Complete `lk06-complete`

**Bu Wulan** _(happy)_: Ten snails along the bank, and not one of them moved a step.  
**Mak Cik Siti** _(think)_: Kancil tricked the crocodiles with counting. The snails tricked Kancil with counting. It comes round, doesn’t it?  
_The small boy at the back is smiling now. He has been helping Wulan move the snails._  
**Bu Wulan** _(soft)_: Slow isn’t silly. Slow is just slow. And a lot of slow friends together can be very quick indeed.  

**Rewards**


**Notes:** Staging: the ten snails sit at even spacing (the reader band treats them as one every 5 metres, 5 m to 50 m). Every snail is a different snail; each answers from just ahead of Kancil.

## LK7. The Cucumber Garden

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil and Pak Tani’s cucumbers* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK6

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch the tale of the cucumber garden.

Hint: Sit on the bank at dusk for the sixth tale. · check: `watch:lk-shadow-play:cucumbers`

#### Scene `lk07-garden`

_Tonight Wulan sits at the lamp. She has brought a new puppet: a farmer in a wide straw hat._  
**Bu Wulan** _(soft)_: This is the tale I heard before any other. Kancil and the cucumbers.  
**Bu Wulan**: There was a farmer called Pak Tani, and he grew the best cucumbers in the whole village.  
**Pak Tani** _(angry)_: My cucumbers! Somebody has been eating my cucumbers again!  
_Your Nubbin creeps the Kancil puppet along the bottom of the screen, nibbling an invisible cucumber._  
**Bu Wulan**: So Pak Tani made a scarecrow, and he painted it all over with sticky sap from a tree.  
**Kancil** _(happy)_: Who’s this, standing in the garden? Out of my way, please. I’m busy eating.  
_Kancil pushes the scarecrow, and his hoof sticks. He pushes with the other, and that sticks too._  
**Pak Tani** _(angry)_: Got you, cucumber thief!  
**Mak Cik Siti** _(think)_: Wait, wait. That’s not how my grandmother told it.  

#### Done `lk07-endings`

_The two of them have a short, polite, very fierce whisper behind the screen._  
**Bu Wulan** _(think)_: In the old tale, Kancil tricks the farmer’s dog into getting stuck in his place. Then off he runs.  
**Mak Cik Siti**: And now, mostly, children hear it the other way. Kancil says sorry and helps put the garden right.  
**Bu Wulan** _(soft)_: Both are true. One is just older.  

### Step 2: Help Kancil put the garden right: plant cucumber seeds by the screen.

Hint: Take the seed pot by the lamp and plant it beside the screen. · check: `place:lk-cucumber-vine`

#### Scene `lk07-sorry`

**Mak Cik Siti**: Tonight we’ll end it the new way.  
_Kancil is still stuck fast to the scarecrow. Pak Tani stands over him with his hands on his hips._  
**Pak Tani** _(angry)_: Well? What have you got to say for yourself?  
**Kancil** _(sad)_: I’m sorry, Pak Tani. I was hungry, and I took what wasn’t mine.  
**Pak Tani** _(think)_: Hmph. Sorry doesn’t grow cucumbers.  
**Kancil** _(soft)_: Then let me help you plant some more. I’m small, but I’m good at digging.  
_Pak Tani unsticks him, one hoof at a time. Together they plant three rows of seeds, four in each row._  
_Behind the screen, your Nubbin is pressing real seeds into a pot by the lamp._  

#### Complete `lk07-complete`

_Siti and Wulan build a little trellis of split bamboo beside the screen for the vine to climb._  
**Mak Cik Siti** _(soft)_: The old ending is clever. The new ending is kind.  
**Bu Wulan** _(happy)_: My grandmother would say Kancil got off lightly. Then she’d give him a cucumber anyway.  
_Within a few days the vine has climbed halfway up. There is one small cucumber on it, and nobody touches it._  

**Rewards**

- Cucumber-vine trellis (decor): A split-bamboo trellis by the shadow screen with a cucumber vine climbing it. One-time.

**Notes:** PAYOFF of LK1: whoever told second tells this tale. If lk-first = siti, play lk07-garden (Wulan tells, Siti objects). If lk-first = wulan, play lk07-garden-siti (LINE_LK_VARIANTS) in its place: Siti tells Wulan’s tale and Wulan objects. lk07-endings fits both. The old ending (the dog) is told, not shown.

## LK8. The Tiger at the River

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil and the tiger in the pool* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK7

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch the tiger corner Kancil by the water.

Hint: Sit on the bank at dusk for the seventh tale. · check: `watch:lk-shadow-play:tiger`

#### Scene `lk08-tiger`

**Mak Cik Siti** _(soft)_: Late one afternoon, Kancil was walking beside a still, quiet pool.  
_Wulan brings on the tiger puppet. It is striped and enormous, and its shadow fills half the screen._  
**Tiger** _(happy)_: Well, well. A mouse-deer. Just the right size for supper.  
_Your Nubbin backs the Kancil puppet right up to the edge of the shadow water._  
**Kancil** _(think)_: You could eat me, tiger. But I’d be careful if I were you.  
**Tiger** _(happy)_: Careful? Of you?  
**Kancil** _(think)_: Not of me. Of the tiger who lives in this pool. He’s bigger than you, and he’s been watching you all along.  

#### Done `lk08-look`

**Tiger** _(angry)_: Nonsense. Show me this tiger.  
_The tiger leans over the shadow pool. Wulan tips a second tiger puppet upside down beneath it, nose to nose._  
**Tiger** _(angry)_: Grrr! Who are you? Go away! This is MY forest!  

### Step 2: Look at your Nubbin’s reflection in the still pond.

Hint: Walk to the pond’s edge where the water is calm, and look in. · check: `inspect:lk-pond:reflection`

#### Scene `lk08-splash`

_The tiger roars at the tiger in the water. The tiger in the water roars back, exactly the same._  
**Tiger** _(angry)_: Right. That does it.  
_Splash, the tiger leaps into the pool! Wulan flicks a cupful of real pond water over the screen._  
_The tiger climbs out, soaked from ears to tail. The other tiger has vanished._  
**Tiger** _(shock)_: Where did he go? And where did that mouse-deer go?  
**Mak Cik Siti** _(happy)_: Kancil was long gone, home before the tiger had even shaken his ears.  
_On the bank, the children want to know how the second tiger came and went. Wulan points at the pond._  
**Bu Wulan** _(soft)_: Look in. Very still. Don’t splash.  

#### Complete `lk08-complete`

_Your Nubbin leans over the edge of the pond, and another Nubbin leans up to meet it._  
_It waves, and the other one waves back. It pokes the water, and the other Nubbin wobbles away in rings._  
**Bu Wulan** _(soft)_: The tiger was fighting himself. Plenty of people do that.  
**Mak Cik Siti** _(happy)_: Nobody was hurt. The tiger only got wet, and a little embarrassed.  

**Rewards**


**Notes:** Care: in some tellings Kancil says “the King” is in the river. Here he warns of “a tiger who lives in this pool”, so no king is ever pictured, even as a reflection. Staging: the second tiger is the same puppet flipped upside down under the water line. The tiger only gets wet.

## LK9. The Pit

*Sang Kancil tales (traditional; Malaysia and Indonesia): Kancil, the elephant and the falling sky* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK8

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Watch Kancil fall into the hunters’ pit.

Hint: Sit on the bank at dusk for the eighth tale. · check: `watch:lk-shadow-play:pit`

#### Scene `lk09-pit`

**Mak Cik Siti** _(shock)_: Kancil was running through the forest, not looking where he was going. And then, whoomp.  
_Siti sweeps a deep, dark hole across the screen. Your Nubbin drops the Kancil puppet into it._  
**Mak Cik Siti**: It was a pit, dug by hunters, and the sides were steep and slippery.  
**Kancil** _(sad)_: Help! Hello? Anybody? Oh, this is not good.  
_Kancil jumps and jumps, but he is much too small to reach the top._  
_Then the ground thumps. Wulan brings on the elephant, huge and grey, with ears like washing on a line._  
**Elephant** _(think)_: What are you doing down there, little one?  
**Kancil** _(shock)_: Haven’t you heard, Elephant? The sky is falling! This pit is the only safe place in the forest!  
**Elephant** _(shock)_: The sky? Falling? Make room! Make room!  

#### Done `lk09-out`

_Thump: the elephant climbs into the pit. Kancil hops onto its back, then onto its head, and out._  
**Kancil** _(happy)_: Thank you, Elephant! Do stay as long as you like!  
_The elephant sits in the pit, looking up at the sky, which isn’t falling at all._  

### Step 2: Decide how the tale ends.

Hint: Talk to Siti by the screen. · check: `choose:lk-pit-ending`

#### Scene `lk09-ending`

_Siti stops. She lowers the puppets and looks at them for a moment._  
**Mak Cik Siti** _(soft)_: In my grandmother’s tale, it ends there. Kancil runs off, and the elephant stays in the pit.  
**Bu Wulan** _(think)_: And then?  
**Mak Cik Siti** _(soft)_: And then nothing. That’s where she stopped.  
_A little girl on the bank puts her hand up. She wants to know what happens to the elephant._  
**Mak Cik Siti** _(think)_: So. Do we end it the old way, or help Kancil find a way to get Elephant out?  

**Choices**

- **End it the old way. It’s Siti’s grandmother’s tale.** — sets `{"lk-pit":"stuck"}`
    - **Mak Cik Siti**: Then it ends there. Kancil was clever, and the elephant was trusting, and that was all.
    - The little girl thinks about it for a long time. Then she asks to hold the elephant puppet, and Siti lets her.
    - **Bu Wulan**: Old tales don’t always comfort you. Sometimes they tell you to be careful who you trust.
- **Help Kancil get Elephant out.** — sets `{"lk-pit":"ramp"}`
    - **Kancil**: Elephant! I’m sorry. The sky isn’t falling. Wait there, I’ll get help!
    - Your Nubbin rolls six logs from the woodpile and leans them in a ramp against the shadow pit.
    - The elephant climbs out, one big step at a time, while the children count the logs out loud.

#### Complete `lk09-complete`

**Bu Wulan** _(think)_: That’s a hard one. A clever trick can be a cruel one, if you never look back.  
**Mak Cik Siti** _(soft)_: My grandmother told it to make us careful. The children here tell it to put things right. Both are good reasons.  
_Your Nubbin puts the elephant puppet back in the box, very gently, on top of everything else._  

**Rewards**


**Notes:** lk-pit: the reader band keeps both endings; sprout always helps (defaultChoice ramp, six logs). In the old ending nothing bad is shown happening to the elephant; the tale simply stops. Hunters are never seen.

## LK10. The Night of Stories

*Sang Kancil tales (traditional; Malaysia and Indonesia): the last crossing* · audience: all · where: The pond at dusk, by the shadow screen (Learning Grove only) · when: After chapter 6, at summer’s end. One tale at a time, in order; paused during chapters 9–11; never repeats · requires: LK9

**Cast:** Pixel, Mak Cik Siti (A storyteller from Melaka, Malaysia (our invention), in the Sang Kancil tradition), Bu Wulan (A wayang kancil puppeteer from Yogyakarta, Indonesia (our invention)), Kancil (Sang Kancil / Si Kancil, the mouse-deer (a puppet)), Crocodile (Buaya, the crocodile of the Kancil tales (a puppet)), Buffalo (Kerbau, the water buffalo of the Kancil tales (a puppet)), Snail (The snail who races Kancil (a puppet)), Tiger (Harimau, the tiger of the Kancil tales (a puppet)), Elephant (Gajah, the elephant in the pit tale (a puppet)), Pak Tani (Pak Tani, the farmer in Kancil and the cucumbers (a puppet))

### Step 1: Line up the Grove’s Nubbins across the stream for the last crossing.

Hint: Call your Nubbins to the stream by the shadow screen. · check: `place:lk-nubbins:crocodile-line`

#### Scene `lk10-line`

_The last evening of summer. The whole valley is on the bank, with mats and cushions and far too much food._  
**Mak Cik Siti** _(happy)_: Kuih! Who wants kuih? I made the green ones and the stripy ones.  
**Bu Wulan** _(happy)_: And kue from me. Same idea, different spelling, better coconut.  
**Pixel** _(happy)_: I’ve rigged a second lamp so the people at the back can see. It won’t blow up. Probably.  
_Your Nubbin is Kancil tonight, for real: no puppet, just itself in the lamplight._  
**Bu Wulan**: Crocodiles! The last crossing! Line up, please!  
_The Grove’s Nubbins slide into the stream at once. They remember that Kancil was kind to them._  
_There are a great many of them this time: two lines side by side, nose to tail, from bank to bank._  

### Step 2: Cross the stream with your Nubbin and count every crocodile.

Hint: Your Nubbin hops along one line and back along the other; count every hop. · check: `walk:lk-crocodile-line:20`

#### Scene `lk10-count`

**Mak Cik Siti** _(happy)_: We count the way you heard it first. Ready? Satu!  
_Your Nubbin hops. The whole bank counts with it._  
**Mak Cik Siti**: Dua, tiga, empat, lima, enam, tujuh...  
_At eight the children all shout “Delapan!”, the Indonesian word, as loud as they can. Wulan bows._  
**Mak Cik Siti** _(happy)_: Lapan. Sembilan, sepuluh! And back along the second line!  
_Your Nubbin hops back along the second line, ten more, and lands on the home bank with a squelch._  
**Bu Wulan** _(happy)_: Twenty crocodiles. The King would be delighted.  

#### Complete `lk10-complete`

_Afterwards the children sit in a heap on the bank, full of kuih and kue, and nobody wants to go home._  
**Mak Cik Siti** _(think)_: So. What did Kancil learn this summer?  
_A boy says be clever, and a girl says say thank you. The small boy who helped the snails says don’t laugh at slow people._  
**Bu Wulan** _(soft)_: All true. My grandmother would have liked you lot.  
**Mak Cik Siti** _(soft)_: We’re leaving the screen by the pond. It belongs here now.  
**Bu Wulan** _(happy)_: And we’re staying a while. We like your valley. It argues nearly as well as we do.  
_Your Nubbin sits by the screen with the little Kancil puppet and makes it hop, one, two, three, all on its own._  

**Rewards**

- The shadow screen (decor): Siti and Wulan’s white screen and lamp, left by the pond for good. One-time.
- Siti and Wulan stay (feature): The two storytellers stay in the valley; find them by the screen in the evenings.

Sets on completion: `{"lk-done":true}`

**Notes:** PAYOFFS. LK9: if lk-pit = ramp, play lk10-complete-ramp in place of lk10-complete (the snail boy’s answer is the elephant). LK3: if lk-croc = laughed, play lk10-line-laughed in place of lk10-line (the Nubbins won’t line up until you help Kancil ask nicely). LK1: if lk-first = wulan, play lk10-count-wulan in place of lk10-count (Indonesian leads; the bank shouts “Lapan!” at eight). Both variants are in LINE_LK_VARIANTS. Staging: twenty Nubbins in two lines (fill from wild Nubbins if the Grove has fewer). AFTER THE LINE: Siti and Wulan stay in the valley and can be found by the screen in the evenings, with idle lines in both languages (to write with the advisers, e.g. greetings, “Selamat petang” for good evening, and a count to ten); the screen and the stepping-stones stay. No timers: the idle lines are unlimited and give nothing.

## Variant scenes

#### Variant `lk10-complete-ramp`

_Afterwards the children sit in a heap on the bank, full of kuih and kue, and nobody wants to go home._  
**Mak Cik Siti** _(think)_: So. What did Kancil learn this summer?  
_A boy says be clever, and a girl says say thank you. The small boy who helped the snails says go back for the elephant._  
**Bu Wulan** _(soft)_: All true. My grandmother would have liked you lot. The elephant one most of all.  
**Mak Cik Siti** _(soft)_: We’re leaving the screen by the pond. It belongs here now.  
**Bu Wulan** _(happy)_: And we’re staying a while. We like your valley. It argues nearly as well as we do.  
_Your Nubbin sits by the screen with the little Kancil puppet and makes it hop, one, two, three, all on its own._  

#### Variant `lk04-grab-laughed`

**Bu Wulan**: Some days later, Kancil was thirsty, so he went down to the river for a drink.  
_Your Nubbin bends the puppet down to the shadow water. Its little nose nearly touches the ripples._  
_A long shadow slides up underneath, and snap! The crocodile puppet has Kancil by the leg._  
**Crocodile** _(angry)_: I remember you. You’re the one who laughed at us.  
**Crocodile** _(angry)_: I’ve waited at this spot every evening since, and I haven’t stopped being cross once.  
**Kancil** _(think)_: Oh, crocodile. Is that my leg you’ve caught?  
**Kancil** _(happy)_: That isn’t my leg at all! That’s an old stick. Silly crocodile, you’ve caught a stick!  
_The crocodile lets go, quick as anything, and snaps at a stick floating past._  

#### Variant `lk07-garden-siti`

_Tonight Siti sits at the lamp. She has borrowed Wulan’s new puppet: a farmer in a wide straw hat._  
**Mak Cik Siti** _(happy)_: This is Wulan’s tale really. But she told the first tale, so this one is mine.  
**Mak Cik Siti**: There was a farmer, Pak Tani, as Wulan calls him, and he grew the best cucumbers in the whole village.  
**Pak Tani** _(angry)_: My cucumbers! Somebody has been eating my cucumbers again!  
_Your Nubbin creeps the Kancil puppet along the bottom of the screen, nibbling an invisible cucumber._  
**Mak Cik Siti**: So Pak Tani made a scarecrow, and he painted it all over with sticky sap from a tree.  
**Kancil** _(happy)_: Who’s this, standing in the garden? Out of my way, please. I’m busy eating.  
_Kancil pushes the scarecrow, and his hoof sticks. He pushes with the other, and that sticks too._  
**Pak Tani** _(angry)_: Got you, cucumber thief!  
**Bu Wulan** _(think)_: Wait, wait. That’s not how my grandmother told it.  

#### Variant `lk10-line-laughed`

_The last evening of summer. The whole valley is on the bank, with mats and cushions and far too much food._  
**Mak Cik Siti** _(happy)_: Kuih! Who wants kuih? I made the green ones and the stripy ones.  
**Bu Wulan** _(happy)_: And kue from me. Same idea, different spelling, better coconut.  
**Pixel** _(happy)_: I’ve rigged a second lamp so the people at the back can see. It won’t blow up. Probably.  
_Your Nubbin is Kancil tonight, for real: no puppet, just itself in the lamplight._  
**Bu Wulan**: Crocodiles! The last crossing! Line up, please!  
_The Grove’s Nubbins float in the shallows with their arms folded. Nobody lines up._  
**Mak Cik Siti** _(think)_: Ah. They remember the last time. Kancil laughed at them and ran.  
_Your Nubbin looks at you. It can’t say a word, and tonight it needs some._  
**You** _(soft)_: Kancil is sorry he laughed. Will you be his bridge one more time, please?  
_A long pause. Then, one by one, the Nubbins slide into two lines across the stream._  

#### Variant `lk10-count-wulan`

**Bu Wulan** _(happy)_: We count the way you heard it first. Ready? Satu!  
_Your Nubbin hops. The whole bank counts with it._  
**Bu Wulan**: Dua, tiga, empat, lima, enam, tujuh...  
_At eight the children all shout “Lapan!”, the Malay word, as loud as they can. Siti bows._  
**Bu Wulan** _(happy)_: Delapan. Sembilan, sepuluh! And back along the second line!  
_Your Nubbin hops back along the second line, ten more, and lands on the home bank with a squelch._  
**Mak Cik Siti** _(happy)_: Twenty crocodiles. The King would be delighted.  
