# Atlas, page A27: The White-Haired Prince

## A27-1. A Son for Sam

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Zal’s birth (Zimmern, “Zal”)* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time once Nova’s atlas is in the Grove; the first quest on the page.

**Cast:** Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), The Nurse (The woman, “brave above the rest”, who tells Sam of his son (Shahnameh); original design)

### Step 1: Step into the mountain page and find the champion’s house in Sistan.

Hint: Touch the green city at the bottom of the page. · check: `explore:a27-sistan:gate`

#### <a id="a27-01-page"></a>Scene `a27-01-page`

_Nova’s atlas falls open at a mountain above the clouds, a vast nest of branches, and far below, a green city._  
_Across the top, in plain letters: a story from the Shahnameh, the Book of Kings, finished by Ferdowsi about a thousand years ago._  
_He spent some thirty years on it. People in Iran, Afghanistan, Tajikistan and far beyond still recite it, and name their children from it._  
_This is one of its stories, told in our own words, with a few lines from an old English retelling._  
_The page goes warm under your hand, like a wall that has had the sun on it all day. Then it is dust, and a gate, and you are standing in it._  
_A city of brick and orchards, in a wide flat land. Inside the gate, a big house is lit from end to end._  
**The Nurse**: A traveller? Then come in. Nobody is turned away from this door tonight.  
**The Nurse** _(happy)_: This is the house of Sam, the champion of Sistan. He has waited years for a child, and tonight there is one.  
_Your Nubbin sniffs the air. Somewhere in the house there is bread, and it has made a note of where._  

**Choices**

- **Thank her, and wipe your feet.**
    - **The Nurse**: Good manners. You’ll do well here. Leave your shoes with the others.
- **Ask about the baby.**
    - **The Nurse**: A boy. Perfect. We’re all very…
    - She stops, and smiles too quickly, and takes your coat.
- **Let your Nubbin follow its nose.**
    - It finds the kitchen in four seconds. The cook gives it a crust without being asked, which tells you a lot about the cook.

#### <a id="a27-01-page-done"></a>Done `a27-01-page-done`

**The Nurse**: Stay as long as you like. The master will want to thank every guest. When he knows.  
_She says the last three words very quietly, to herself._  

### Step 2: Go to the family’s rooms and see Sam’s son.

Hint: Follow the nurse down the passage with the lamps. · check: `visit:a27-baby:family-rooms`

#### <a id="a27-01-birth"></a>Scene `a27-01-birth`

_The family’s rooms are at the back of the house, warm and full of women talking softly._  
_In a cradle by the brazier lies a baby, asleep with both fists up by his ears._  
_Then it came to pass that a son was born unto him, beautiful of face and limb,_  
_who had neither fault nor blemish save that his hair was like unto that of an aged man._  
_His hair is white. Not fair: white, like frost on a bough, and soft as the down on a chick._  
**The Nurse** _(sad)_: Eight days old, and his father hasn’t seen him. Nobody has dared to tell him about the hair.  
**The Nurse**: They think he’ll be angry. I think he’ll be a fool if he is. But I’m only the nurse.  
_Your Nubbin climbs up the cradle leg and looks in. The baby opens his eyes and looks back._  

**Choices**

- **“He’s beautiful.”**
    - **The Nurse**: He is. Every bit of him.
- **“It’s only hair.”**
    - **The Nurse**: That’s what I keep saying. To the wall, mostly.
- **“Someone should tell his father.”**
    - **The Nurse**: Someone should. And someone will. It looks as if it’s going to be me.

#### <a id="a27-01-birth-done"></a>Done `a27-01-birth-done`

_Your Nubbin reaches in and touches the white hair, very carefully, with one paw._  
_The baby grabs the paw and holds on. Neither of them seems to mind._  

### Step 3: Go with the nurse when she tells Sam.

Hint: Walk behind her to the hall. Stay by the door. · check: `escort:a27-nurse:hall`

#### <a id="a27-01-hall"></a>Scene `a27-01-hall`

_Sam sits in his hall: a big man, grey at the temples, with a sword across his knees that he is not using._  
_The nurse goes in. You stay by the door, as she asked, with your Nubbin behind your ankles._  
**The Nurse**: My lord. God has given you what you wanted. A son, strong and handsome, with nothing wrong in him.  
**The Nurse**: Only his hair is white, like an old man’s. Remember he is a gift. Don’t be ungrateful for a gift.  
**Sam** _(shock)_: White?  
_He stands up. The sword slides off his knees onto the floor, and nobody picks it up._  
**Sam**: Show me.  

#### <a id="a27-01-hall-done"></a>Done `a27-01-hall-done`

_He goes past you down the passage, very fast. The nurse looks at you, and doesn’t say anything at all._  

### Complete

#### <a id="a27-01-complete"></a>Complete `a27-01-complete`

_Sam stands over the cradle for a long time. The baby looks up at him with dark, steady eyes._  
_Sam doesn’t pick him up. That is the first wrong thing._  
**Sam**: Leave me. All of you. I need to think.  
_The women go out in a hurry. In the passage, the nurse takes your Nubbin’s paw, as if somebody’s paw ought to be held._  

**Rewards**


Sets on completion: `{"a27-01":true}`

**Learning Grove swaps**

- `a27-01-birth#2` → A son has been born to Sam: strong and well, with bright eyes and ten fine fingers,
- `a27-01-birth#3` → and with hair as white as an old man’s, right from the very first day.

**Notes:** OPENING: the page is a manuscript-painting wash (mountain, nest, green city) and colours in as you step through. a27-01-page#0–3 are the page’s INTRO CARD: show them as a plain card before the step-through. LIFTED TEXT: a27-01-birth#2–3 (Zimmern p. 33), one sentence split in two, voiced as narration. PRONUNCIATION (for voice and for the adviser to confirm): Zal (ZAAL), Sam (SAAM), Sistan (sees-TAAN), Alborz (al-BORZ), Simurgh (see-MORGH), mobed (MOH-bed), Manuchehr (ma-noo-CHEHR), Mehrab (mehr-AAB), Sindokht (sin-DOKHT), Rudaba (roo-DAA-beh), Zahhak (zah-HAAK), Rostam (ros-TAM). ART: Persian manuscript painting, not an orientalist pastiche; the family’s rooms are a family’s rooms. The baby’s white hair is drawn simply and beautifully, never glowing, never eerie. CARE: the nurse’s “Don’t be ungrateful for a gift” follows Zimmern’s nurse in our words. Sam not picking him up is the first sign that he is wrong; the page never agrees with him.

## A27-2. Shame

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Sam casts out his son* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-1, from Nova’s atlas. · requires: A27-1

**Cast:** Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), The Nurse (The woman, “brave above the rest”, who tells Sam of his son (Shahnameh); original design), Old Servant (One of the servants Sam sends to the mountain (Shahnameh); named role is our addition)

### Step 1: Be in the hall when Sam gives his order.

Hint: The household gathers in the hall at first light. · check: `wait:a27-hall:dawn`

#### <a id="a27-02-order"></a>Scene `a27-02-order`

_In the morning the whole household is called to the hall. Sam hasn’t slept, and it shows._  
**Sam** _(angry)_: My enemies will laugh. They’ll say Sam’s son was born old, and that it means something bad for the land.  
**Sam**: What do I say to them? I have no answer.  
_It doesn’t mean anything. It is a baby with white hair, and he is hungry, and he is crying in the next room._  
**Sam**: Take the child away. Up to the Alborz, where nobody goes. Leave him there.  
_Nobody moves. Then an old servant at the back bows, very slowly, as if his back hurts._  
**The Nurse** _(sad)_: My lord, he is a gift.  
**Sam**: Go.  

**Choices**

- **Speak up for the baby.**
    - **You**: Please. He’s your son. He hasn’t done anything.
    - **Sam**: You are a guest in this house, and a guest does not tell me what my son is.
    - He turns away. Your hands are shaking, but you said it, and the nurse heard you say it.
- **Look Sam in the eye, and say nothing.**
    - He looks back at you for a moment. Then he looks at the floor, and keeps looking at it.
- **Go and stand with the nurse.**
    - You stand beside her. She doesn’t look at you, but she leans on your shoulder, just a little.

#### <a id="a27-02-order-done"></a>Done `a27-02-order-done`

_Sam goes out. The order stays in the room after him, like smoke._  
**The Nurse** _(sad)_: Go with them. Please. Somebody kind should be there.  

### Step 2: Follow the servants up the mountain path.

Hint: Keep close behind the old servant. The storm is coming in from the north. · check: `climb:a27-alborz:path`

#### <a id="a27-02-path"></a>Scene `a27-02-path`

_Two servants carry the baby out of the city in a basket, wrapped in a blanket. You and your Nubbin follow._  
_The road becomes a path, and the path becomes stones. Ahead, the Alborz goes up and up into cloud._  
**Old Servant** _(sad)_: You don’t have to come. It isn’t your shame.  
**You**: It isn’t yours either.  
**Old Servant**: I’m the one carrying him. That makes it mine, I think.  
_The wind gets up. The first rain comes sideways, hard and cold, out of the north._  
_Your Nubbin gets under the edge of the basket and holds it up from below, as if that helps. It does, a little._  

#### <a id="a27-02-path-done"></a>Done `a27-02-path-done`

_By the time the path runs out the storm is all round you, and you can’t see the city any more._  

### Step 3: Stay with the baby at the foot of the high rocks.

Hint: Sit with him in the lee of the big stone. · check: `sit:a27-baby:alborz`

#### <a id="a27-02-rocks"></a>Scene `a27-02-rocks`

_At the foot of the high rocks the servants set the basket down, in the lee of a big stone._  
**Old Servant**: This is as far as anyone’s ever been. Nobody climbs above here.  
_The other servant is already walking away. The old one stays a moment longer, holding the edge of the basket._  
**Old Servant** _(sad)_: I’ve carried him up a mountain. I’ll carry that the rest of my life.  
_He goes, and you don’t. The rain gets in everywhere, and the baby is crying, thin and furious._  
_Your Nubbin climbs into the basket and curls round his feet, which is the warmest thing it knows how to do._  

**Choices**

- **Wrap him in your coat.**
    - You wrap him in your coat over the blanket. He stops crying for long enough to get angry about the coat instead.
- **Hum to him.**
    - You hum the only tune you can think of. You can’t hear yourself over the wind, but he can, because he goes quiet.
- **Hold him, and keep your back to the wind.**
    - You pick him up and turn your back to the storm. He fits against your chest like he has always been there.

#### <a id="a27-02-rocks-done"></a>Done `a27-02-rocks-done`

_Above the storm, something very large goes over. For a moment the rain stops falling on you, as if a roof had been put up._  

### Complete

#### <a id="a27-02-complete"></a>Complete `a27-02-complete`

_The shadow goes over again, lower. The wind it makes flattens the grass._  
_You hold on to the baby, and your Nubbin holds on to you. Nobody else in the world knows where the three of you are._  
_Then the cloud opens, and something comes down out of it._  

**Rewards**


Sets on completion: `{"a27-02":true}`

**Notes:** CARE (albinism): Sam’s reasons are his enemies’ mockery and an “ill sign”. a27-02-order#3 is the narrator saying plainly that the hair means nothing, straight after him; keep it. Never use “stain”, “curse” or “taint”. The speak-up choice changes nothing in the story (you are a guest), and Sam says so; the nurse hears it. The old servant is our addition; he returns in A27-6. The baby is never shown alone: you and your Nubbin are with him from the city to the Simurgh. ART: the storm is grey and blue, the stones dark; no lightning strikes.

## A27-3. The Simurgh

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the Simurgh takes the child to her nest* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-2, from Nova’s atlas. · requires: A27-2

**Cast:** The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting)

### Step 1: Hold on to the baby when the great bird comes down.

Hint: Don’t let go of the basket. · check: `watch:a27-simurgh:descent`

#### <a id="a27-03-descent"></a>Scene `a27-03-descent`

_She comes down out of the cloud like a ship coming out of fog: a bird, bigger than a house._  
_Her feathers are every colour a sunset has ever been, and her tail goes on behind her for a long time._  
_She lands on the big stone above you, and the stone creaks. She looks down at the basket with one gold eye._  
_Then she reaches down, very fast, and takes the baby up in her talons, blanket, coat and all._  
_She looks at you. She looks at your Nubbin, still hanging on to the blanket with all four limbs._  
_Then she takes you too._  

**Choices**

- **Shout.**
    - You shout. The wind takes the shout away, and the ground takes itself away after it.
- **Hold on, and keep your eyes open.**
    - You keep your eyes open. Below, the whole mountain falls away, and the storm is a grey floor under your feet.

#### <a id="a27-03-descent-done"></a>Done `a27-03-descent-done`

_Up through the cloud, and out into sun. Above the storm the sky is enormous, and very blue, and very quiet._  

### Step 2: Arrive at the nest on the peak.

Hint: There is nothing to do but be carried. · check: `explore:a27-nest:peak`

#### <a id="a27-03-nest"></a>Scene `a27-03-nest`

_The nest is on the very top of the Alborz, where the peak touches the stars. No one has ever stood up here._  
_It is built of ebony and sandalwood twined with aloe, and it is the size of a cottage, and it smells wonderful._  
_In it are her chicks: four of them, each bigger than a pony, all beak and fluff and appetite._  
_She sets the baby down in the middle of them. The chicks crowd in, beaks first, to see what she has brought to eat._  
_Your Nubbin drops off the blanket and stands in front of the baby, arms out, as tall as it can make itself._  
_The Simurgh looks down at the small white-haired thing, and at the smaller thing guarding it._  
_But when she had brought him her heart was stirred within her for compassion._  
**The Simurgh** _(soft)_: No. Not him. He is your brother.  

#### <a id="a27-03-nest-done"></a>Done `a27-03-nest-done`

_The chicks pull their beaks back. One of them, the smallest, sits down hard and looks confused._  
**The Simurgh**: And these two are your nestmates. We have a large family now. Sit up and make room.  

### Complete

#### <a id="a27-03-complete"></a>Complete `a27-03-complete`

_The chicks shuffle round until there is a gap in the middle, warm and dark and smelling of sandalwood._  
_You and your Nubbin and the baby are squeezed into it together. A wing comes down over all of you, like a blanket._  
**The Simurgh** _(soft)_: Sleep. The storm can’t reach up here. Nothing can.  
_The baby is asleep before she finishes. Your Nubbin takes a while longer, because the chick next to it snores._  

**Rewards**


Sets on completion: `{"a27-03":true}`

**Learning Grove swaps**

- `a27-03-nest#6` → But when she looked at him properly, her great heart turned over inside her, and she was sorry for him.

**Notes:** LIFTED TEXT: a27-03-nest#6 (Zimmern p. 35), narration. The nest of ebony, sandalwood and aloe is Zimmern’s detail, in our words. SOFTENED: Zimmern’s Simurgh brings the baby so that her young may eat him; here the chicks crowd in “to see what she has brought to eat” for one line before she stops them. The chicks never speak (canon 31: only the source’s own talking animals talk, and Ferdowsi gives speech only to the Simurgh). ART: the Simurgh from Persian manuscript painting (long sweeping tail, crest, many colours), never a phoenix or a dragon; she is grand and kind, not fierce. The chicks are fluffy and round. The descent can be a short flying cutscene.

## A27-4. The Nest

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the Simurgh rears the child among her young* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-3, from Nova’s atlas. · requires: A27-3

**Cast:** The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting)

### Step 1: Help the Simurgh feed everyone in the nest.

Hint: Share out what she brings: the chicks first, then the baby, then yourself. · check: `feed:a27-chicks:nest`

#### <a id="a27-04-feed"></a>Scene `a27-04-feed`

_The Simurgh hunts at dawn and comes back with breakfast for a nest the size of a cottage._  
**The Simurgh**: You have hands. I have only a beak. Share it out: the big ones first, or they’ll take it anyway.  
_For the baby she brings soft things: honey in the comb, ripe figs, warm milk from a mountain goat that she will not explain._  
_The chicks eat like a landslide. Your Nubbin watches them with great respect, and then tries to keep up._  
**The Simurgh** _(soft)_: Feed them before you feed yourself. That’s the only rule in this nest.  
_By the time everyone else is fed, there is a fig left over. It is a very small fig._  

**Choices**

- **Eat the fig.**
    - You eat it. It is the best fig you have ever had, and the Simurgh brings you two more without a word.
- **Split it with your Nubbin.**
    - Half each. Your Nubbin eats its half in one go and looks at yours with an expression of pure hope.
- **Give it to the smallest chick.**
    - The smallest chick, who got least at breakfast, takes it very politely and swallows it whole.
    - **The Simurgh**: You learn quickly. Most guests take years.

#### <a id="a27-04-feed-done"></a>Done `a27-04-feed-done`

_Your Nubbin is round as an apple and still looking about for more. Living with chicks has given it ideas._  

### Step 2: Keep the baby warm through the cold night.

Hint: Sit with him under the Simurgh’s wing until morning. · check: `sit:a27-baby:nest`

#### <a id="a27-04-night"></a>Scene `a27-04-night`

_The nights on the peak are cold enough to crack stone. The stars are so close you could knock one off with a stick._  
_The baby sleeps between you and your Nubbin, under the edge of the great wing, with his white hair tucked into your coat._  
**The Simurgh**: His father left him at the foot of my mountain, on the bare ground. I saw. I see everything from up here.  
**The Simurgh** _(angry)_: A man who could not see past the colour of a child’s hair. Well. I have no use for his eyes.  
_She settles lower over all of you. Her heartbeat is slow and very loud, like a drum heard from the next valley._  
**The Simurgh** _(soft)_: This one is mine now, until somebody deserves him.  

#### <a id="a27-04-night-done"></a>Done `a27-04-night-done`

_In the morning there is frost on the outside of her wings, and none at all underneath._  

### Step 3: Stop the chicks sitting on the baby.

Hint: Lift him out of the way whenever a chick backs up to sit down. · check: `carry:a27-baby:nest`

#### <a id="a27-04-sitting"></a>Scene `a27-04-sitting`

_The chicks love their new brother. They love him so much that they keep trying to sit on him._  
_It is how they show they like something. It is also how they would flatten it._  
_A chick backs up, wriggling its tail feathers, ready to settle down right on top of him._  
_You scoop him up just in time. The chick sits on your Nubbin instead, which is less good for your Nubbin._  
**The Simurgh** _(happy)_: Ha. They sat on each other for a month before they learned. He’ll need minding.  
_So you mind him: all day, every day, lifting him out of the way of affectionate chicks the size of ponies._  

#### <a id="a27-04-sitting-done"></a>Done `a27-04-sitting-done`

_Your Nubbin is pulled out from under the chick slightly flatter than before. It doesn’t seem to bear a grudge._  

### Complete

#### <a id="a27-04-complete"></a>Complete `a27-04-complete`

_Weeks go by on the peak, and then months. Nobody comes, and nobody calls him anything but “the little one”._  
**The Simurgh**: His name is his father’s to give. Until then, he is my chick.  
_The baby learns to crawl in a nest of ebony and sandalwood. His first word is a sound like a bird calling._  
_Your Nubbin teaches him how to clap. He teaches your Nubbin how to eat a whole fig without chewing._  

**Rewards**


Sets on completion: `{"a27-04":true}`

**Notes:** The Simurgh feeding a human baby on honey, figs and milk is our softening of Zimmern’s “tender flesh”. “Feed them before you feed yourself” is the outline’s line, a gentle echo of Hazel’s rules; do not name a rule. Your Nubbin’s eating is the page’s running joke; it begins here. HAZEL’S MARGIN NOTE (s24Done, read-only): if s24Done is set when a27-04-complete ends, play ATLAS_A27_VARIANTS a27-margin-hazel straight after it; otherwise it plays the first time the atlas is open at the nest after s24Done is set. From then on the note is drawn in pencil in the margin beside the nest. Its text matches S24’s notes exactly. Not a timer or a check: one scene, once.

## A27-5. The Youth on the Mountain

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the child grows to a youth on the peak, and his fame spreads* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-4, from Nova’s atlas. · requires: A27-4

**Cast:** The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting), The Youth (Zal before his father names him (Shahnameh); white-haired, original design), A Merchant (A caravan merchant on the Alborz road; the outline’s caravans, our speaker)

### Step 1: Teach the youth some words for things he has never seen.

Hint: Sit with him at the nest’s edge and talk. · check: `talk:a27-youth:nest-edge`

#### <a id="a27-05-words"></a>Scene `a27-05-words`

_The page turns over by itself, slowly, like a leaf in no wind. Years go by in it._  
_You and your Nubbin don’t change; atlas pages are like that. The little one does._  
_He is tall now, taller than you, and strong enough to carry a chick under each arm. His hair is still white as frost._  
_He talks like the Simurgh: grand and slow, with long words for wind and weather. He has never seen a person except you._  
**The Youth** _(think)_: There are words she has but cannot show me. Door. Cup. Market. What is a market?  
**You**: Lots of people, all selling things and shouting.  
**The Youth** _(happy)_: Shouting. Like the chicks at breakfast. I think I would like a market.  
**The Youth**: Teach me one more word. One she doesn’t use.  

**Choices**

- **Teach him “friend”.** — sets `{"a27-word":"taught-friend"}`
    - **You**: Friend. Someone who isn’t family, but stays anyway.
    - **The Youth**: Friend. Then you are my friend. And the small one too.
- **Teach him “home”.** — sets `{"a27-word":"taught-home"}`
    - **You**: Home. The place you come back to.
    - **The Youth**: Then this is home. I have never gone anywhere to come back from. Perhaps one day.
- **Teach him “sorry”.** — sets `{"a27-word":"taught-sorry"}`
    - **You**: Sorry. What you say when you’ve done something wrong, and you wish you hadn’t.
    - **The Youth**: Nobody has ever said it to me. Is that good?
    - You don’t know what to say to that, so you say nothing.

#### <a id="a27-05-words-done"></a>Done `a27-05-words-done`

_He practises the word all afternoon, to the chicks, to the wind, and to your Nubbin, who claps every time._  

### Step 2: Climb down to the high pass and meet the caravan.

Hint: The caravan road crosses the shoulder of the mountain, below the cloud. · check: `walk:a27-caravan:pass`

#### <a id="a27-05-caravan"></a>Scene `a27-05-caravan`

_Far below the peak, a road crosses the shoulder of the mountain. Caravans go by on it: camels, bells and dust._  
_The Simurgh sets you down on a ledge above the pass, so you can walk the last of the way like a normal person._  
**A Merchant**: A traveller, up here? Have you seen him? The young man on the peak, with the white hair?  
**A Merchant**: We see him every spring, standing at the top of the world with a bird bigger than a cloud. We tell it in every town.  
**A Merchant**: Some say he’s a spirit. Some say he’s a prince. My wife says he must be very cold.  
_Your Nubbin, who has had nothing but figs for a very long time, is looking at the merchant’s bread with its whole soul._  

**Choices**

- **“He’s a prince. He just doesn’t know it yet.”**
    - **A Merchant**: A prince! I knew it. I’ll tell them that in Sistan.
- **“He’s a person. A kind one.”**
    - **A Merchant**: A person. Well. That’s less exciting, but my wife will be glad.
- **Smile, and say nothing.**
    - **A Merchant**: Ah, a secret. Secrets travel even faster than news.

#### <a id="a27-05-caravan-done"></a>Done `a27-05-caravan-done`

_He gives your Nubbin a whole round loaf. It carries it back up the mountain like a crown._  
**A Merchant**: Every caravan from here to the sea will have the story by midsummer. You’ll see.  

### Complete

#### <a id="a27-05-complete"></a>Complete `a27-05-complete`

_The story goes down the mountain with the caravans, from town to town, and nobody can stop it. Good and bad come out in the end._  
_It reaches the green city in the east. It reaches the champion’s house, and the hall, and the man in it._  
_Up in the nest, your Nubbin is sharing the loaf with four enormous chicks, fairly, smallest first._  
_Somebody has sewn it a little white-crested cap out of chick-down, to match its brother. Nobody admits to it._  

**Rewards**

- White-Crested Cap (cosmetic): A tiny cap of soft white down with a crest on top, for your Nubbin. Made in the Simurgh’s nest, for a foundling who looked up to his white-haired brother.

Sets on completion: `{"a27-05":true}`

**Notes:** Time passes on the page; you and your Nubbin don’t age (a27-05-words#1 says so in one line). The youth speaks as YOUTH (“The Youth”) until his father names him in A27-9; from then on he is ZAL. He learns speech from the Simurgh, as in Zimmern. The word choice sets a27-word = taught-friend | taught-home | taught-sorry (Atlas save only; the prefix keeps a Grove flag worth “home” from picking a variant); it pays off in A27-9. REWARD: the White-Crested Cap, one-time, at a27-05-complete. Zimmern’s “neither good nor evil can be hidden for ever” is told in our own words at a27-05-complete#0.

## A27-6. Sam’s Dream

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Sam’s dream and the mobeds’ counsel* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-5, from Nova’s atlas. · requires: A27-5

**Cast:** Old Servant (One of the servants Sam sends to the mountain (Shahnameh); named role is our addition), Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), The Rider (The man on an Arab horse in Sam’s dream (Shahnameh); original design), The Mobed (The mobeds, the wise men and priests of the court (Zimmern: Mubids) (Shahnameh); original design), The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting)

### Step 1: Go down to Sistan with the caravan and find the champion’s house.

Hint: Walk with the caravan to the city gate. · check: `escort:a27-caravan:sistan`

#### <a id="a27-06-return"></a>Scene `a27-06-return`

_You ride down to Sistan with the next caravan, perched on a bale of cotton, to see how the story lands._  
_The champion’s house is the same, only older. So is the old servant at the door, who stares at you._  
**Old Servant** _(shock)_: You. You haven’t changed a hair. And I’ve gone white as…  
_He stops, and touches his own white head, and doesn’t finish._  
**Old Servant**: Is it true? What the caravans say? Is he alive?  
_Your Nubbin answers by holding up one end of the merchant’s loaf. Then it remembers, and holds up its white-crested cap instead._  

**Choices**

- **“He’s alive. He’s taller than you.”**
    - The old man sits down on the doorstep, quite suddenly, and puts his face in his hands.
    - **Old Servant**: Then I can put him down at last.
- **“You can stop carrying him now.”**
    - **Old Servant**: Can I? I don’t know how. I’ll practise.

#### <a id="a27-06-return-done"></a>Done `a27-06-return-done`

**Old Servant**: The master doesn’t sleep well. He hasn’t slept well in years. Stay tonight. Something’s coming; I feel it in my knees.  

### Step 2: Be in the hall when Sam wakes from his dream.

Hint: Wait by the hall fire through the night. · check: `wait:a27-hall:night`

#### <a id="a27-06-dream"></a>Scene `a27-06-dream`

_In the middle of the night there is a shout from Sam’s room, and then the sound of a man getting up too fast._  
_He comes into the hall with a lamp. His beard is grey now, nearly white, though he hasn’t noticed._  
**Sam** _(shock)_: I dreamed. A man on an Arab horse rode up to me, and spoke to me as if I were a servant.  
**The Rider** _(angry)_: You threw away your son for his white hair. Look in a mirror, champion. Your own beard is as white as a poplar.  
**The Rider**: A bird is raising your child. Is that what you call being a father?  
**Sam** _(sad)_: Then he woke me. Or I woke. I don’t know which.  

#### <a id="a27-06-dream-done"></a>Done `a27-06-dream-done`

**Sam**: Call the mobeds, the wise priests. All of them. Now, before I lose my nerve.  

### Step 3: Listen to the mobeds, and answer Sam’s question.

Hint: Stand by the fire while the wise men speak. · check: `talk:a27-sam:hall`

#### <a id="a27-06-mobeds"></a>Scene `a27-06-mobeds`

_The mobeds come in their white robes, half asleep and wholly serious. Sam tells them the dream._  
**Sam**: Could it be him? After all this time? The frost and the sun must have taken him years ago.  
**The Mobed** _(angry)_: My lord, the wild beasts look after their young. Even the lion. Even the crocodile.  
**The Mobed**: You turned your own child out, because of the white hair his Maker gave him. That was the wrong, not the hair.  
**The Mobed**: One whom God has blessed doesn’t perish. Go and find your son. And when you find him, ask him to forgive you.  
_Sam bows his head. Then he looks up, round the hall, and sees you by the fire._  
**Sam** _(think)_: You. I know you. You were here the night he was born.  
**Sam**: Is he alive? Tell me the truth. I can bear the truth. I couldn’t bear anything else.  

**Choices**

- **“He’s alive. He’s the best person I know.”**
    - Sam closes his eyes. When he opens them they are wet, and he isn’t ashamed of it, which is new.
    - **Sam**: Then I don’t deserve him. Good. I’ll start from there.
- **“Go and see for yourself.”**
    - **Sam**: Yes. Yes, that’s right. I should have to climb for it.
- **“His hair is still white. Will you mind?”**
    - **Sam**: Mind?
    - He looks at his own reflection in the lamp’s brass, at the white in his beard, for a long moment.
    - **Sam**: No. I won’t mind. I should never have minded.

#### <a id="a27-06-mobeds-done"></a>Done `a27-06-mobeds-done`

**Sam**: Sound the drums. We march for the Alborz at first light.  
_You don’t wait for the drums. You and your Nubbin are out of the gate before they start, running for the mountain._  

### Complete

#### <a id="a27-06-complete"></a>Complete `a27-06-complete`

_At the foot of the high rocks you stop, out of breath, and look up into the cloud._  
_A shadow goes over. The Simurgh comes down, and looks at you with one gold eye, and seems to know everything already._  
**The Simurgh**: You went down to see the story land. Did it?  
**You**: He’s coming. With an army.  
**The Simurgh** _(think)_: Then I had better put the kettle on.  
_She doesn’t have a kettle. You suspect she knows that._  

**Rewards**


Sets on completion: `{"a27-06":true}`

**Notes:** The dream rider’s rebuke and the mobeds’ counsel follow Zimmern pp. 35–36 closely in our own words (not quoted). The “white as a poplar” beard is the source’s; it sets up A27-7. FAITH: the mobeds are Zoroastrian priests and wise men; they speak of God plainly and briefly, as Zimmern has them; draw their white robes with care and no invented ritual objects. CARE: the mobeds name the wrong exactly (a27-06-mobeds#3); keep it. The answer choice has no flag. The old servant’s white hair (a27-06-return#2–3) is a small, deliberate echo, never a joke.

## A27-7. The Foot of the Mountain

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Sam comes to the Alborz and prays* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-6, from Nova’s atlas. · requires: A27-6

**Cast:** The Youth (Zal before his father names him (Shahnameh); white-haired, original design), Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting)

### Step 1: Watch the army come to the foot of the mountain.

Hint: Lie flat at the nest’s edge and look down through the gap in the cloud. · check: `watch:a27-army:alborz`

#### <a id="a27-07-army"></a>Scene `a27-07-army`

_Three days later, the cloud below the nest thins, and through the gap you can see the foot of the Alborz._  
_There is an army there. Tents, banners, horses, the glint of spears, all very small and very busy._  
**The Youth** _(think)_: What are those? Ants? They have flags.  
**You**: People. A lot of people.  
**The Youth** _(shock)_: So many. Are they all shouting? Is it a market?  
_He lies down flat at the edge of the nest beside you, with his chin on his hands, and stares and stares._  
_Your Nubbin lies down too, with its chin on its paws, and looks at him instead._  

#### <a id="a27-07-army-done"></a>Done `a27-07-army-done`

**The Youth** _(soft)_: I didn’t know there were this many. I thought there was you, and then her, and then the chicks.  

### Step 2: Watch Sam try to climb, and see him pray.

Hint: Keep watching the man at the front of the army. · check: `watch:a27-sam:prayer`

#### <a id="a27-07-foot"></a>Scene `a27-07-foot`

_One man comes out in front of the army and starts to climb. He is big, and strong, and he gets nowhere._  
_The rocks are sheer. He tries one way, and then another, and then he slides back down to the bottom._  
_He tries again, and the army watches him. Nobody laughs, and that is something._  
_Then he stops trying. He kneels down on the stones at the foot of the mountain, and bows his head, and prays._  
_He doesn’t shout. He prays the way people pray when they have nothing left to bargain with._  
_You see him first, before the Simurgh, before the youth. A man with white in his own beard._  
_Nobody has ever been sorrier at the bottom of anything._  

**Choices**

- **Point him out.**
    - **You**: That one. The one kneeling.
    - **The Youth**: He looks sad. Why would anyone be sad at the bottom of a mountain? They could just go home.
- **Say nothing yet. It isn’t your news.**
    - You keep it to yourself. The youth watches the kneeling man without knowing why he can’t stop watching.

#### <a id="a27-07-foot-done"></a>Done `a27-07-foot-done`

_Behind you, the whole nest tilts. The Simurgh has come to the edge, and is looking down._  

### Complete

#### <a id="a27-07-complete"></a>Complete `a27-07-complete`

_She looks down for a long time. Her feathers lift, and settle, and lift._  
**The Simurgh** _(soft)_: So. He has come to the bottom of my mountain, on his knees. That is the right way to come.  
_She doesn’t look at the youth. She looks at you, and you understand that she has known this day was coming since the storm._  
**The Simurgh** _(sad)_: Sit with me a moment, little stranger. Then I must tell him.  

#### <a id="a27-07-corvin"></a>Variant `a27-07-corvin`

_Variant within A27-7; it has no single parent scene._

_For a moment he makes you think of someone else: a man at a stuck gate, lifting and pushing, who came back._  

**Rewards**


Sets on completion: `{"a27-07":true}`

**Notes:** FAITH: Sam’s prayer is humble and brief; it is not shown in words. Zimmern: “Then Saum called upon God in his humility. And God heard him, and put it into the heart of the Simurgh to look down” (not quoted; told at a27-07-foot#3–4 and a27-07-foot-done). The point/quiet choice has no flag. CORVIN (corvinGate = family, read-only): play ATLAS_A27_VARIANTS a27-07-corvin straight after a27-07-foot#5 (“…A man with white in his own beard.”), before #6. One line; nothing else changes.

## A27-8. The Feather

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the Simurgh gives the youth her feather* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-7, from Nova’s atlas. · requires: A27-7

**Cast:** The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting), The Youth (Zal before his father names him (Shahnameh); white-haired, original design)

### Step 1: Be there when the Simurgh tells him.

Hint: Sit at the nest’s edge with the youth and the Simurgh. · check: `sit:a27-nest:edge`

#### <a id="a27-08-telling"></a>Scene `a27-08-telling`

_The Simurgh folds her wings and sits down beside the youth, as low as she can make herself, which is not very low._  
**The Simurgh**: You have shared this nest with me since you were small enough to sit in my footprint. I have been a mother to you.  
**The Simurgh**: Your father put you out. Now he has come back for you. The man on his knees down there is Sam, the champion.  
**The Simurgh** _(sad)_: The hour has come for us to part. I must give you back to your people.  
_The youth looks at her, and then down through the gap in the cloud, at the small kneeling man._  
**The Youth** _(shock)_: My father?  

#### <a id="a27-08-telling-done"></a>Done `a27-08-telling-done`

_The chicks have gone quiet. Even the smallest one has stopped eating, which has never happened before._  

### Step 2: Stay with the youth while he decides.

Hint: What you do here matters for a long time. · check: `choose:a27-feather:nest`

#### <a id="a27-08-feather"></a>Scene `a27-08-feather`

**The Youth** _(sad)_: Are you tired of me? Have I grown too big for the nest? I can be smaller. I can eat less.  
**The Simurgh** _(soft)_: I don’t send you away because I don’t want you. I would keep you beside me always.  
**The Simurgh**: But another life is better for you. Go and see the world, my son, and try your fortune in it.  
_When the youth had heard her words his eyes were filled with tears and his heart with sorrow,_  
_for he had never gazed upon men, though he had learned their speech._  
_She bends her head, and pulls one feather from her breast, and lays it in his hands. It is grey and gold, as long as his arm._  
**The Simurgh**: So that you remember the one who sheltered you, and stay in the shade of her wings, wherever you go:  
**The Simurgh**: …bear with thee this feather from her breast.  
**The Simurgh**: And in the day of thy need cast it into the fire, and I will come like unto a cloud and deliver thee from danger.  
_He holds the feather against his chest, and doesn’t move. He looks at you._  

**Choices**

- **Tell him his father came back, and he should go.** — sets `{"a27-feather":"told"}`
    - **You**: He came back. Nobody made him. He climbed as far as he could, and then he knelt down.
    - **You**: You should go to him. You’ve waited your whole life without knowing you were waiting.
    - **The Youth**: He came back.
    - He says it again, quietly, trying out the shape of it. Then he stands up.
- **Sit with him, and say nothing until he’s ready.** — sets `{"a27-feather":"sat"}`
    - You sit down next to him at the nest’s edge, close enough for your shoulders to touch, and you don’t say anything at all.
    - The wind goes by, and the chicks shuffle. Your Nubbin leans on his other side.
    - It takes a long time. You let it take a long time.
    - Then, by himself, he stands up.
- **Ask the Simurgh to make Sam wait one more night.** — sets `{"a27-feather":"night"}`
    - **You**: Can he have one more night? Just one. In the nest. Then he’ll go.
    - **The Simurgh**: One more night.
    - She looks down at the kneeling man, and then at her chick with his feather.
    - **The Simurgh**: Yes. He left you here for years. One night more won’t hurt him.
    - That night the youth sleeps in the middle of the chicks, under her wing, with the feather in his fist. In the morning, he stands up.

#### <a id="a27-08-feather-done"></a>Done `a27-08-feather-done`

**The Youth** _(soft)_: I’ll go. But I am coming back to see you. And the chicks. All of them, even the one who snores.  
**The Simurgh**: I know you will. Keep the feather dry.  

### Complete

#### <a id="a27-08-complete"></a>Complete `a27-08-complete`

_The youth goes round the nest and says goodbye to each chick in turn. The smallest one tries to sit on him, for old times’ sake._  
_You say goodbye too. The nest has been your home for longer than you can count; you find you have no words for it._  
**The Simurgh** _(soft)_: You were a foundling too, little stranger. Take something of the nest home with you.  
_She weaves you a great round nest out of the branches nobody uses: ebony, sandalwood and aloe, big enough for a family._  
_Your Nubbin climbs in to test it, and has to be lifted out again by the scruff._  

**Rewards**

- The Great Nest (decor): A huge nest of woven branches, smelling faintly of sandalwood, set in the big tree by the pond. Your Nubbins can sleep in it if they like.

Sets on completion: `{"a27-08":true}`

**Learning Grove swaps**

- `a27-08-feather#3` → When he heard her, his eyes filled with tears and his heart grew heavy,
- `a27-08-feather#4` → because he had never met any people, though he had learned to talk the way they talk.
- `a27-08-feather#7` → Take this feather from me.
- `a27-08-feather#8` → If ever you need me, put it on the fire, and I will come to you like a cloud and help you.

**Notes:** SIGNATURE CHOICE (a27-08-feather): a27-feather = told | sat | night. Zal goes down on every path. It pays off in A27-9 (a27-09-descent*), A27-14 (a27-14-letter*) and A27-17 (a27-17-fire* and a27-17-complete*). The sat option is the third rule acted out, never quoted here; it lands in A27-17 when he hands you the feather. LIFTED TEXT: a27-08-feather#3–4 (Zimmern p. 37, one sentence split) and #7–8 (pp. 37–38, the Simurgh; #7 opens with an ellipsis to mark the excerpt, and “her breast” is the Simurgh speaking of herself, as in Zimmern). The youth’s “Are you tired of me?” and her answer are Zimmern’s beats in our words. REWARD: the Great Nest, decor, one-time, placed in the big tree by the pond (the outline’s Tier 2 change). It does nothing but let Nubbins sleep in it; no timer, no yield.

## A27-9. Father and Son

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Sam meets his son, names him Zal, and takes him home* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-8, from Nova’s atlas. · requires: A27-8

**Cast:** The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting), The Youth (Zal before his father names him (Shahnameh); white-haired, original design), Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), Zal (Zal, son of Sam (Shahnameh); white-haired, original design), The Nurse (The woman, “brave above the rest”, who tells Sam of his son (Shahnameh); original design)

### Step 1: Go down the mountain with the youth.

Hint: Hold on. The Simurgh will set you down above the army. · check: `escort:a27-youth:alborz-foot`

#### <a id="a27-09-descent"></a>Scene `a27-09-descent`

_The Simurgh carries you both down through the cloud, one in each set of talons, the way she brought you up._  
_She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch._  
_Sam is still on his knees at the bottom. He hears the stones move, and looks up._  
_The youth starts walking, and then walking faster. For the last of it, he runs._  
_He stops right in front of his father, out of breath, the feather held to his chest. He has never stood this close to anyone but you._  
**The Youth**: You came back for me.  
_Sam can’t say anything at all. He just nods, again and again, like someone who has forgotten how to stop._  

#### <a id="a27-09-descent-sat"></a>Variant `a27-09-descent-sat`

_Variant of `a27-09-descent`._

_The Simurgh carries you both down through the cloud, one in each set of talons, the way she brought you up._  
_She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch._  
_Sam is still on his knees at the bottom. He hears the stones move, and looks up._  
_The youth walks down slowly: he stops, and looks, and walks on. He is taking his time, the way you let him._  
_Sam gets up off his knees, and doesn’t climb, and doesn’t call out. He waits, as long as it takes._  
_At the bottom the youth stops in front of his father, the feather held to his chest. He has never stood this close to anyone but you._  
**The Youth**: You waited for me.  
_Sam can’t say anything at all. He just nods, again and again, like someone who has forgotten how to stop._  

#### <a id="a27-09-descent-night"></a>Variant `a27-09-descent-night`

_Variant of `a27-09-descent`._

_In the grey of the morning the Simurgh carries you both down through the cloud, the way she brought you up._  
_She sets you down on the slope above the army, a little way off, and goes back up to the edge of the cloud to watch._  
_Sam is still on his knees at the bottom, where he has been all night, in the cold. He hears the stones move, and looks up._  
_The youth comes down to him, rested, with the smell of the nest still on him._  
_Sam opens his mouth to speak, and nothing comes out but a whisper. He has prayed all night, and his voice is gone._  
_The youth stops in front of him, the feather held to his chest. He has never stood this close to anyone but you._  
**The Youth**: You stayed. All night, on the stones.  
_Sam can only nod, again and again. It turns out that is all he needs to say._  

#### <a id="a27-09-descent-done"></a>Done `a27-09-descent-done`

_Your Nubbin arrives last, rolling the final bit of the slope, and comes to a stop against Sam’s boot._  

### Step 2: Stand by while Sam makes his promise.

Hint: Stay close. This is theirs. · check: `watch:a27-sam:oath`

#### <a id="a27-09-oath"></a>Scene `a27-09-oath`

_Sam stands up. He bows, very low, to the great bird at the edge of the cloud, and thanks her with his whole voice._  
_Then he looks at his son properly: tall and strong and handsome, with white hair, and nothing wrong in him at all._  
**Sam** _(sad)_: I was wrong. I was a coward, and I was wrong, and there’s nothing I can say that makes it smaller.  
**Sam**: Open your heart to me if you can. I won’t ask for more than you can give.  
**Sam**: I swear it, before the one who made us both: never again will I harden my heart towards thee.  
**Sam**: And I will give you everything you ever ask of me.  
_He gives his son a name: Zal, which means the old one, for the white hair. This time, he says it with pride._  
**Zal** _(think)_: Zal.  
**Zal** _(happy)_: I like it. It sounds like a door shutting on the right side.  

**Choices**

- **Clap.**
    - You clap, and your Nubbin claps. After a moment, uncertainly, so does the whole army.
- **Bow to Zal.**
    - **Zal**: You don’t bow to me. You’re my nestmate. Stand up.

#### <a id="a27-09-oath-taught-sorry"></a>Variant `a27-09-oath-taught-sorry`

_Variant of `a27-09-oath`._

_Sam stands up. He bows, very low, to the great bird at the edge of the cloud, and thanks her with his whole voice._  
_Then he looks at his son properly: tall and strong and handsome, with white hair, and nothing wrong in him at all._  
**Sam** _(sad)_: I was wrong. I was a coward, and I was wrong, and there’s nothing I can say that makes it smaller.  
**Sam**: Open your heart to me if you can. I won’t ask for more than you can give.  
**Sam** _(sad)_: I’m sorry. I don’t know how to say it any better than that.  
**The Youth** _(soft)_: So that is what it sounds like. I wondered.  
**Sam**: I swear it, before the one who made us both: never again will I harden my heart towards thee.  
**Sam**: And I will give you everything you ever ask of me.  
_He gives his son a name: Zal, which means the old one, for the white hair. This time, he says it with pride._  
**Zal** _(think)_: Zal.  
**Zal** _(happy)_: I like it. It sounds like a door shutting on the right side.  

**Choices**

- **Clap.**
    - You clap, and your Nubbin claps. After a moment, uncertainly, so does the whole army.
- **Bow to Zal.**
    - **Zal**: You don’t bow to me. You’re my nestmate. Stand up.

#### <a id="a27-09-oath-done"></a>Done `a27-09-oath-done`

_They dress Zal in fine clothes: silk, a belt with gold on it, boots. He walks in the boots like a heron on ice._  

### Step 3: Ride home to Sistan with the army.

Hint: Find a place on the baggage train. · check: `walk:a27-army:sistan`

#### <a id="a27-09-road"></a>Scene `a27-09-road`

_The army goes home to Sistan with drums and trumpets and cymbals, all the way, so that every village knows._  
_Zal rides at the front beside his father. You ride on the baggage, on a heap of tent poles, with your Nubbin in your lap._  
**Zal** _(think)_: It is very loud. Is the world always this loud?  
**Sam** _(happy)_: Only when it’s happy.  
_The old servant walks beside the baggage, holding the bridle of the mule, and is the quietest man in the army._  
_Behind you, high above the cloud, a great bird turns once in the sky, and turns again, and goes home._  

#### <a id="a27-09-road-taught-home"></a>Variant `a27-09-road-taught-home`

_Variant of `a27-09-road`._

_The army goes home to Sistan with drums and trumpets and cymbals, all the way, so that every village knows._  
_Zal rides at the front beside his father. You ride on the baggage, on a heap of tent poles, with your Nubbin in your lap._  
**Zal** _(think)_: It is very loud. Is the world always this loud?  
**Sam** _(happy)_: Only when it’s happy.  
**Zal** _(think)_: Is Sistan where I come back to now? I was told that is what home means.  
**Sam** _(soft)_: Yes. It’s louder than a nest, but yes.  
_The old servant walks beside the baggage, holding the bridle of the mule, and is the quietest man in the army._  
_Behind you, high above the cloud, a great bird turns once in the sky, and turns again, and goes home._  

#### <a id="a27-09-road-done"></a>Done `a27-09-road-done`

_Sistan has heard. The city is hung with cloth and flowers, and everyone wants to see the white-haired prince._  

### Complete

#### <a id="a27-09-complete"></a>Complete `a27-09-complete`

_At the gate the people throw flowers and blessings, and Zal catches a rose, and doesn’t know what to do with it._  
_Your Nubbin knows: it eats it. Zal laughs so hard that he has to hold on to his father’s arm._  
**Sam** _(soft)_: You laugh with your whole self. I’d forgotten people could.  
**Zal** _(happy)_: The chicks taught me. They do everything with their whole selves.  
_On the step, arms folded, stands the nurse, older now. She waits until Sam is close enough to hear._  
**The Nurse**: A gift, my lord. I did say.  
**Sam** _(soft)_: You did.  
**The Nurse** _(happy)_: I only mention it. I’m only the nurse.  
_Sam takes his son by the arm, and they go in together._  

#### <a id="a27-09-complete-taught-friend"></a>Variant `a27-09-complete-taught-friend`

_Variant of `a27-09-complete`._

_At the gate the people throw flowers and blessings, and Zal catches a rose, and doesn’t know what to do with it._  
_Your Nubbin knows: it eats it. Zal laughs so hard that he has to hold on to his father’s arm._  
**Sam** _(soft)_: You laugh with your whole self. I’d forgotten people could.  
**Zal** _(happy)_: The chicks taught me. They do everything with their whole selves.  
_On the step, arms folded, stands the nurse, older now. She waits until Sam is close enough to hear._  
**The Nurse**: A gift, my lord. I did say.  
**Sam** _(soft)_: You did.  
**The Nurse** _(happy)_: I only mention it. I’m only the nurse.  
**Zal** _(happy)_: Father, this is my friend. Someone who isn’t family, but stays anyway.  
**Sam**: Then they’re family now. That’s how it works here.  
**Zal** _(think)_: Then I shall need another word.  
_Sam takes his son by the arm, and they go in together._  

**Rewards**


Sets on completion: `{"a27-09":true}`

**Learning Grove swaps**

- `a27-09-oath#4` → I promise, before the one who made us both: I will never close my heart to you again.
- `a27-09-oath-taught-sorry#6` → I promise, before the one who made us both: I will never close my heart to you again.

**Notes:** LIFTED TEXT: a27-09-oath#4 (Zimmern p. 38, a fragment: “never again will I harden my heart towards thee”). Our own words open Sam’s sentence. Zal’s name means “the aged” (Zimmern) or “white-haired”; say “the old one”. FEATHER PAYOFF (a27-feather): the scene shown for step 1, a27-09-descent, is for told (he runs the last bit). For sat play ATLAS_A27_VARIANTS a27-09-descent-sat in its place (he walks down slowly, and his father waits). For night play a27-09-descent-night (Sam has prayed all night and his voice is gone). Everything after step 1 is shared. From a27-09-oath#7 on the speaker is ZAL. The army clapping is our small comedy; Zimmern’s army shouts for joy. WORD PAYOFF (a27-word, A27-5): taught-sorry plays ATLAS_A27_VARIANTS a27-09-oath-taught-sorry (Sam says sorry, and the youth hears the word said to him at last); taught-home plays a27-09-road-taught-home (Sistan is home now); taught-friend plays a27-09-complete-taught-friend (Zal introduces you to his father as his friend). The nurse on the step calls back her “gift” from A27-1 and A27-2 on every path.

## A27-10. The Shah’s Court

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Zal before Manuchehr; Zal rules Sistan* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-9, from Nova’s atlas. · requires: A27-9

**Cast:** Manuchehr (Manuchehr, Shah of Iran (Zimmern: Minuchihr) (Shahnameh); original design), Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), Zal (Zal, son of Sam (Shahnameh); white-haired, original design), The Mobed (The mobeds, the wise men and priests of the court (Zimmern: Mubids) (Shahnameh); original design)

### Step 1: Go with Sam and Zal to the Shah’s court.

Hint: Walk behind Zal into the hall of audience. · check: `visit:a27-shah:court`

#### <a id="a27-10-court"></a>Scene `a27-10-court`

_The Shah has heard the news, and sends for them both. The court is all carpets, lamps and very straight backs._  
_Manuchehr sits on his throne with his crown on. Sam kneels and tells him everything, and doesn’t leave out the bad part._  
**Manuchehr**: Bring the young man in.  
_Zal comes in, in his silk, with his white hair brushed. The whole court goes still to look at him._  
**Manuchehr** _(think)_: Champion, look after this one. Guard him for Iran.  
**Manuchehr**: And teach him our ways: war, and feasting, and manners. How should someone raised in a nest know any of them?  
_Zal bows, exactly as low as the Simurgh used to bow her head to him. It is not the court’s bow, and it is perfect._  

#### <a id="a27-10-court-done"></a>Done `a27-10-court-done`

_The Shah calls his star-readers. They read Zal’s stars, and say he will be brave and wise._  
**Manuchehr** _(happy)_: Good. I could have told them that by looking at him. But it’s nice to have it in writing.  

### Step 2: Help Zal get through his first banquet.

Hint: Neither of you knows the rules. Watch the others, and copy. · check: `puzzle:a27-banquet:manners`

#### <a id="a27-10-banquet"></a>Scene `a27-10-banquet`

_That night there is a banquet. There are more knives on the cloth than you have fingers, and more cups than that._  
**Zal** _(think)_: Which one is for eating? Why are there so many? Do they fight over them?  
**You**: I don’t know either.  
**Zal** _(happy)_: Then we are equal. Good. We’ll learn it together, like the chicks learned not to sit on me.  
_Dishes come, one after another, steaming. Zal waits until everyone else is served before he takes anything._  
_The courtiers notice, and think it very fine manners. It is just nest manners._  
_Your Nubbin, on the other hand, has nest manners of a different kind. It has eaten a whole dish of rice by itself._  

**Choices**

- **Watch the courtiers, and copy what they do.**
    - You copy the man opposite, and Zal copies you. By the third dish you both look as if you were born to it.
    - **Zal**: This is like hunting. You keep very still and watch.
- **Ask the courtier next to you.**
    - The courtier next to you is delighted to be asked, and explains every knife at length. It takes until the sweets.
    - **Zal**: Thank you. I am going to forget all of it.
- **Try to stop your Nubbin starting a second dish of rice.**
    - You are too late: the Shah has seen. He laughs, and sends it a third, which is a royal honour, and also a lot of rice.

#### <a id="a27-10-banquet-done"></a>Done `a27-10-banquet-done`

_Your Nubbin falls asleep on a cushion with its stomach in the air, a guest of the King of Kings._  

### Step 3: Sit with Zal while he hears petitions in Sistan.

Hint: Stand at his shoulder in the hall and listen. · check: `sit:a27-zal:petitions`

#### <a id="a27-10-petitions"></a>Scene `a27-10-petitions`

_Sam goes back to the wars, and leaves Sistan in Zal’s hands. Zal is very young for it, and very good at it._  
_Every morning the people come to the hall with their troubles: a boundary, a debt, a goat that ate a neighbour’s washing._  
_Zal listens to all of it. He listens the way the Simurgh listened from her peak: patiently, and to everything._  
**Zal** _(think)_: She never decided anything in a hurry. You could see her thinking for three days about one fish.  
_He doesn’t judge anyone by how they look. Nobody in Sistan ever finds that surprising, for some reason._  
_The old servant stands at the door every morning, to see the young master hear the city. He wouldn’t miss it._  

#### <a id="a27-10-petitions-done"></a>Done `a27-10-petitions-done`

**Zal**: Tell me if I get one wrong. You’re the only one here who isn’t afraid to.  

### Complete

#### <a id="a27-10-complete"></a>Complete `a27-10-complete`

_The seasons go round. Zal grows wiser, and stronger, and his name goes out across the land like a good smell from a kitchen._  
_He rules Sistan with patience and fairness. The goat owner and the washing owner end up friends, which is his proudest work._  
**Zal** _(happy)_: Now I would like to see the rest of the kingdom. I have only seen the top of it, and the middle.  
_Your Nubbin, who has also grown, sideways, agrees that travel is a good idea, if there is food._  

**Rewards**


Sets on completion: `{"a27-10":true}`

**Notes:** Manuchehr’s line “How should someone raised in a nest know any of them?” follows Zimmern p. 40 in our own words (not quoted). The star-readers’ “brave and wise” is Zimmern’s “brave and prudent”, paraphrased. Sam leaving Sistan in Zal’s hands and Zal ruling well is Zimmern p. 41. The banquet is a light puzzle: watch, copy, done; any choice completes it; no fail. CARE: “He doesn’t judge anyone by how they look” is a quiet line; never make it a speech.

## A27-11. Kabul

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Zal visits Kabul; Mehrab praises him to Sindokht and Rudaba* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-10, from Nova’s atlas. · requires: A27-10

**Cast:** Zal (Zal, son of Sam (Shahnameh); white-haired, original design), Mehrab (Mehrab, king of Kabul (Zimmern: Mihrab) (Shahnameh); original design), Sindokht (Sindokht, queen of Kabul, Rudaba’s mother (Shahnameh); original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design)

### Step 1: Be at the feast in Zal’s tents outside Kabul.

Hint: Mehrab comes out to the tents at sundown. · check: `wait:a27-tents:kabul`

#### <a id="a27-11-tents"></a>Scene `a27-11-tents`

_Zal travels with a long train, and pitches his tents outside Kabul, by the river. The king of Kabul comes out to meet him._  
_Mehrab comes from the line of Zahhak, a cruel old king from long ago. Mehrab himself is wise and fair, and pays tribute to Sam._  
_Zal feasts him in the tents until late. They like each other at once, which is awkward for both of them._  
**Mehrab** _(happy)_: Grant me one thing, son of Sam. Come and stay under my roof. Let my house be glad of you.  
**Zal** _(sad)_: Ask me anything else. Not that.  
**Zal**: The Shah and my father would never forgive me if I ate under the roof of Zahhak’s house. It’s nothing to do with you.  
_Mehrab bows, and goes out of the tent sadly. Zal watches the door after him for a long time._  

#### <a id="a27-11-tents-done"></a>Done `a27-11-tents-done`

**Zal** _(sad)_: I don’t like that. He was kind, and I sent him away with nothing. Will you go after him for me?  

### Step 2: Carry Zal’s gift to Mehrab in the city.

Hint: Take the gift box through the city gate to the king’s house. · check: `deliver:a27-gift:mehrab`

#### <a id="a27-11-gift"></a>Scene `a27-11-gift`

_Zal gives you a box of carved sandalwood. Inside is a feather-light cloth, white, with a gold border._  
**Zal**: Tell him I can’t come in. But tell him I wanted to. That part is true.  
_You carry it through Kabul at dusk. The streets smell of bread and woodsmoke and roses._  
_At the king’s house they take you through to the family’s rooms. It is like walking into a garden that has a roof._  
_Mehrab is there with his wife, Queen Sindokht, and their daughter Rudaba. He opens the box, and goes pink._  
**Mehrab** _(happy)_: He can’t come in, but he wanted to. Well. That’s the nicest no I’ve ever had.  

#### <a id="a27-11-gift-done"></a>Done `a27-11-gift-done`

**Sindokht**: Sit down, messenger. Have something to eat. Your little one has already started, I see.  

### Step 3: Answer Rudaba’s questions about Zal.

Hint: Sit with the family and talk. · check: `talk:a27-rudaba:family-rooms`

#### <a id="a27-11-praise"></a>Scene `a27-11-praise`

**Sindokht** _(think)_: So tell us. What sort of man is this white-haired son of Sam? Does he belong in a nest, or on a throne?  
**Mehrab**: On a throne. His heart is like a lion’s, and he’s as strong as an elephant. He is a friend you’d want, and an enemy you wouldn’t.  
**Mehrab** _(happy)_: And the white hair suits him. On him, even the things people call faults look fine.  
_Rudaba has said nothing at all. She is sitting very still, with her hands in her lap, listening as if her life depends on it._  
**Rudaba**: You know him. You were raised with him, they say. In the nest.  
**Rudaba**: What is he like? Not what the court says. What is he really like?  

**Choices**

- **“He feeds everyone else before he feeds himself.”**
    - **Rudaba**: Does he? Even at a banquet? With everyone watching?
    - **You**: Especially then.
- **“He was raised by a bird the size of a house. He still bows like her.”**
    - **Rudaba**: I would like to see that bow.
- **“His hair is white as snow, and it suits him.”**
    - **Rudaba**: Father says so too. I think I would like it.

#### <a id="a27-11-praise-done"></a>Done `a27-11-praise-done`

_Rudaba asks you seven more questions. Sindokht watches her daughter ask them, and her face goes thoughtful._  

### Complete

#### <a id="a27-11-complete"></a>Complete `a27-11-complete`

_You walk back to the tents in the dark, with your Nubbin asleep on your shoulder, full of Kabul’s best bread._  
_Behind you, in the king’s house, a girl who has never seen Zal sits up all night, thinking about him._  
_In front of you, in a tent by the river, a young man who has never seen Rudaba is doing exactly the same._  
**Zal** _(think)_: Did he like the cloth? What did they say? Who else was there?  
_You tell him about Rudaba. He doesn’t sleep at all._  

**Rewards**


Sets on completion: `{"a27-11":true}`

**Notes:** Zahhak’s line: say once, plainly, that Zahhak was a cruel old king; nothing more about him (no serpents on his shoulders for All). Mehrab’s praise (lion, elephant, friend and enemy, the white hair that suits him) is Zimmern p. 44 in our words (not quoted). In Zimmern a noble praises Rudaba to Zal; here you carry Rudaba’s questions back, so both hear of each other (our merge). Zal sending you with a gift is our addition, so that Mehrab is not shamed. CARE: the family’s rooms are a family’s rooms; no harem framing, no veils as spectacle. Rudaba falls in love with a man she has never seen; keep it sweet and plain.

## A27-12. The Rose Garden

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Rudaba’s maids in the rose garden; the water-bird and the page* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-11, from Nova’s atlas. · requires: A27-11

**Cast:** Zal (Zal, son of Sam (Shahnameh); white-haired, original design), Rudaba’s Maid (The maid “wise above the rest” who serves Rudaba (Shahnameh); original design), Zal’s Page (The page who fetches Zal’s water-bird (Shahnameh); original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design)

### Step 1: Watch the maids gather roses across the river.

Hint: Stand on the bank by Zal’s tents. · check: `watch:a27-maids:roses`

#### <a id="a27-12-roses"></a>Scene `a27-12-roses`

_In the morning, across the river from Zal’s tents, there is a rose garden. Rudaba’s maids are in it, in their best clothes._  
_They pick roses and put them in their hair, and throw petals in the river to see which way they float._  
_They are working their way along the bank, very slowly, until they are exactly opposite Zal’s tents._  
**Zal** _(think)_: Who are they?  
**Zal’s Page**: Rudaba’s maids, my lord. Picking roses. Quite near.  
_Zal takes his bow and goes down to the water with only his page. A water-bird gets up off the river._  
_He shoots it on the wing, cleanly. It falls on the far bank, among the roses._  

#### <a id="a27-12-roses-done"></a>Done `a27-12-roses-done`

**Zal** _(happy)_: Go across and fetch it. And take your time.  
**Zal’s Page**: My lord. Weren’t you raised by a bird?  
**Zal** _(think)_: By a much bigger one. This one never did anything for me.  

### Step 2: Cross with the page and carry messages between the two banks.

Hint: The ferry stone is a little way downstream. · check: `deliver:a27-message:rose-garden`

#### <a id="a27-12-boasts"></a>Scene `a27-12-boasts`

_You go across with the page. The maids surround him at once, all talking._  
**Rudaba’s Maid**: Who shot that? Whose arrow is it? It flew like a king’s.  
**Zal’s Page** _(happy)_: Don’t you know? That’s the son of Sam. There’s nobody in the world as strong or as handsome.  
**Rudaba’s Maid** _(happy)_: Don’t boast. Mehrab’s house has a sun in it that outshines anyone.  
**Zal’s Page**: Well, our sun can shoot a bird out of the sky.  
**Rudaba’s Maid**: Ours doesn’t need to. Birds come to her.  
_This goes on for some time. The page is smiling all the way back across the river._  

**Choices**

- **Join in the boasting.**
    - **You**: He was raised by the biggest bird in the world, and she was proud of him.
    - **Rudaba’s Maid**: That’s cheating. You can’t win a boast with a true thing.
- **Declare it a draw.**
    - **Rudaba’s Maid**: A draw. Very well. We’ll call it a draw until they meet. Then we’ll see.

#### <a id="a27-12-boasts-done"></a>Done `a27-12-boasts-done`

**Zal** _(think)_: Why are you smiling? What did they say? Tell me every word.  
_The page tells him. Zal sends you straight back across with pearls and gold for the maids, so they’ll keep his secret and carry his messages._  

### Step 3: Bring Rudaba’s maid to Zal, and carry the answer home.

Hint: One maid wants to see him with her own eyes. · check: `escort:a27-maid:tents`

#### <a id="a27-12-maid"></a>Scene `a27-12-maid`

_The maid who is wiser than the rest takes the pearls, and asks to see the hero for herself._  
**Rudaba’s Maid**: A secret three people know isn’t a secret any more. So I may as well be one of the three.  
_You bring her across, and she looks at Zal, his bow, his white hair. She nods, as if a box has been ticked._  
**Rudaba’s Maid** _(happy)_: She thinks of nothing but you. She asked a stranger seven questions about you last night.  
**Zal** _(soft)_: Then show me a way to see her. Please. I can’t think about anything else.  
**Rudaba’s Maid**: Leave it to us. Wait for word.  

#### <a id="a27-12-maid-done"></a>Done `a27-12-maid-done`

_Back in the family’s rooms, the maids tell Rudaba everything. She takes a whole rose apart without noticing, petal by petal._  

### Complete

#### <a id="a27-12-complete"></a>Complete `a27-12-complete`

**Rudaba** _(think)_: You told me what he is really like. Now my maids say he shoots like a king.  
**Rudaba**: Which is he?  
**You**: Both.  
**Rudaba** _(happy)_: Good. I would hate to have to choose.  
_She gives you a cutting from the rose garden to keep, wrapped in a wet cloth, for carrying all those messages._  
_Your Nubbin has a rose behind each ear. Nobody can remember putting them there._  

**Rewards**

- Rose-Garden Bed (decor): A bed of red and pink roses by the river, grown from a cutting from Kabul. A good place to stand and boast about someone you love.

Sets on completion: `{"a27-12":true}`

**Notes:** The rose garden, the water-bird, the page and the boasting follow Zimmern pp. 45–47 in our own words (not quoted); “A secret three people know isn’t a secret any more” paraphrases Zimmern’s maid. CARE: Zimmern’s “slaves” are always “maids” here; draw them as Rudaba’s companions, sharp and funny, never as decoration. The water-bird is one clean line (a27-12-roses#6), nothing shown. REWARD: the Rose-Garden Bed, decor, one-time, by the river; it does nothing; no timer, no yield.

## A27-13. The Rope of Hair

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Zal and Rudaba meet at night* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-12, from Nova’s atlas. · requires: A27-12

**Cast:** Rudaba’s Maid (The maid “wise above the rest” who serves Rudaba (Shahnameh); original design), Zal (Zal, son of Sam (Shahnameh); white-haired, original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design)

### Step 1: Go with Zal to the king’s house at dusk.

Hint: Follow the maid through the dark lanes. · check: `escort:a27-zal:kings-house`

#### <a id="a27-13-dusk"></a>Scene `a27-13-dusk`

_At sundown the maid comes to the tents, in a dark cloak, and says only: come now. Everything is ready._  
_Zal goes with her, through the back lanes of Kabul. You and your Nubbin go too, because somebody has to keep watch._  
_Rudaba has hung her rooms with silk and carpets and filled them with flowers. You can smell them from the lane._  
_The house is locked for the night. Rudaba is standing on the roof, in the last of the light, waiting._  
_She is like a cypress with the full moon on it. Zal stops walking._  
**Rudaba** _(soft)_: Welcome, son of a hero. Heaven bless you for coming.  

#### <a id="a27-13-dusk-done"></a>Done `a27-13-dusk-done`

**Zal** _(think)_: Heaven bless you for waiting. Only, you are up there, and I am down here.  

### Step 2: Keep watch below while Zal goes up.

Hint: Stand at the corner of the lane. Look out for the night porter. · check: `watch:a27-lane:night`

#### <a id="a27-13-roof"></a>Scene `a27-13-roof`

_Rudaba unpins her hair. It is black and very long, and she lets it down over the edge of the roof, all the way to the ground._  
**Rudaba** _(happy)_: Here is a rope with no flaw in it. Take hold and climb. It’s right that I should catch you.  
_Zal takes hold of the end of her hair. Then he lifts it to his face, and kisses it, and lets it go._  
**Zal**: No.  
**Rudaba** _(shock)_: No?  
_He looks up at her, in the dusk._  
**Zal** _(soft)_: Not so, O fair one, it would beseem me ill to do thee hurt.  
**Rudaba** _(happy)_: Does everyone in Sistan talk like that?  
**Zal**: Only the ones raised by birds.  
_He makes a running knot in a rope and throws it up; it catches first time. He goes up it in one bound._  

#### <a id="a27-13-roof-done"></a>Done `a27-13-roof-done`

_Up on the roof, Rudaba takes his hand, and they go in together. You take up your post at the corner of the lane._  

### Step 3: Keep the watch until dawn.

Hint: Stay at your corner. The porter comes round once. · check: `wait:a27-lane:dawn`

#### <a id="a27-13-watch"></a>Scene `a27-13-watch`

_The night is long and warm. From the window above come voices, low, talking, and sometimes laughing._  
_Your Nubbin sits on your feet, which is its idea of keeping watch. It is also asleep._  
_At midnight the night porter comes round with his lamp, checking the locks, humming to himself._  
_He stops at the bottom of the rope, which is hanging down the wall in plain sight._  
_He holds his lamp up to it. He looks up the wall, very slowly, towards the window._  
_Your Nubbin is suddenly wide awake. So are you._  

**Choices**

- **Step out and wish him good evening.**
    - You step out and wish him good evening. He jumps, and wishes you one back, and you talk about the weather.
    - You talk about the weather for a long time. You walk him all the way to the next street.
- **Nudge your Nubbin.**
    - Your Nubbin wakes, sees the lamp, and rolls into the lane after it. The porter follows it for three streets, trying to feed it.
- **Keep very still in the shadow.**
    - You keep very still. The porter looks at the rope, decides it is a vine, and goes on: Kabul has unusual vines.

#### <a id="a27-13-watch-done"></a>Done `a27-13-watch-done`

_In the camp the drums begin, the drums that mean morning. The voices upstairs say: not yet, please, not yet._  

### Complete

#### <a id="a27-13-complete"></a>Complete `a27-13-complete`

_The sun takes no notice of them. It comes up anyway._  
_Zal comes down the rope at the last moment, and stands in the lane, looking as if he has been carried up a mountain again._  
**Zal** _(happy)_: We have sworn. Neither of us will marry anyone else. Not ever.  
**Zal** _(soft)_: My father will be angry. The Shah will be angrier. I don’t care.  
_He coils up the rope and hangs it over your shoulder. You find you are going to keep it._  

**Rewards**

- Zal’s Lasso (decor): A coil of plaited rope with a running knot, hung on a peg in the cottage. He wouldn’t climb her hair because it might hurt her, so he climbed this instead.

Sets on completion: `{"a27-13":true}`

**Learning Grove swaps**

- `a27-13-roof#6` → No, my love. I won’t climb your hair. It would hurt you, and I would never hurt you.

**Notes:** LIFTED TEXT: a27-13-roof#6 (Zimmern p. 48), Zal. Rudaba’s “rope with no flaw” (a27-13-roof#1) is Zimmern’s “cord without flaw” paraphrased, not quoted. The cypress and full moon (a27-13-dusk#4) is Zimmern’s image in our words. CARE: the night is talk and vows, nothing more; the scene stays outside, with you. The drums at dawn and “not yet” are Zimmern’s beat (p. 49) in our words. The porter is from Zimmern (who scolds the maids at the gate); his round here is our addition. REWARD: Zal’s Lasso, decor, one-time.

## A27-14. Letters

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): Zal’s letter, the stars, Sindokht’s discovery, and her embassy to Sam* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-13, from Nova’s atlas. · requires: A27-13

**Cast:** Zal (Zal, son of Sam (Shahnameh); white-haired, original design), Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), The Mobed (The mobeds, the wise men and priests of the court (Zimmern: Mubids) (Shahnameh); original design), Sindokht (Sindokht, queen of Kabul, Rudaba’s mother (Shahnameh); original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design), Mehrab (Mehrab, king of Kabul (Zimmern: Mihrab) (Shahnameh); original design), Rudaba’s Maid (The maid “wise above the rest” who serves Rudaba (Shahnameh); original design)

### Step 1: Carry Zal’s letter to his father.

Hint: Ride to Sam’s camp in the north and give it into his own hands. · check: `deliver:a27-letter:sam`

#### <a id="a27-14-letter"></a>Scene `a27-14-letter`

_In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes._  
**Zal**: Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.  
**Zal**: All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.  
**Zal**: You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.  
**Zal**: I love Rudaba, Mehrab’s daughter. I want to marry her.  
**Zal**: You came back for me. Come with me now.  
_He seals it, and holds it out to you, not to the messenger who is waiting._  
**Zal**: You carry it. You were there at the beginning. He should see your face when he reads it.  

#### <a id="a27-14-letter-sat"></a>Variant `a27-14-letter-sat`

_Variant of `a27-14-letter`._

_In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes._  
**Zal**: Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.  
**Zal**: All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.  
**Zal**: You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.  
**Zal**: I love Rudaba, Mehrab’s daughter. I want to marry her.  
**Zal** _(soft)_: I learned to wait on a mountain. I can wait for you.  
_He seals it, and holds it out to you, not to the messenger who is waiting._  
**Zal**: You carry it. You sat with me, that day at the edge. He should see your face when he reads it.  

#### <a id="a27-14-letter-night"></a>Variant `a27-14-letter-night`

_Variant of `a27-14-letter`._

_In the morning Zal calls a scribe, and walks up and down the tent while he speaks, and the scribe writes._  
**Zal**: Father. You put me out on a mountain. A bird raised me. The sun beat on my head, and I ate what she brought.  
**Zal**: All that time you sat in a good house, in silk. I don’t say it to hurt you. I say it because it’s true.  
**Zal**: You swore you would give me anything I asked. I have never asked you for anything. This is the one thing.  
**Zal**: I love Rudaba, Mehrab’s daughter. I want to marry her.  
**Zal** _(happy)_: I made you wait one night. You made me wait many. Let’s call it even.  
_He seals it, and holds it out to you, not to the messenger who is waiting._  
**Zal**: You carry it. You asked for my last night in the nest. He should see your face when he reads it.  

#### <a id="a27-14-letter-done"></a>Done `a27-14-letter-done`

_You ride north for four days, with the letter inside your coat and your Nubbin inside the saddlebag, eating the provisions._  

### Step 2: Wait while Sam reads, and while the mobeds read the stars.

Hint: Stay in Sam’s tent until the star-readers come back. · check: `wait:a27-stars:camp`

#### <a id="a27-14-stars"></a>Scene `a27-14-stars`

_Sam reads the letter twice. Then he puts it face down on his knee, as if it might read him back._  
**Sam** _(think)_: A bird’s nursling, and a daughter of Zahhak’s line. What could come of that?  
**Sam** _(sad)_: If I say no, I break my oath. If I say yes, the Shah will have something to say. I am caught between fire and water.  
_He sends for the mobeds, and they read the stars all day. At evening they come back, smiling._  
**The Mobed** _(happy)_: Rejoice, champion. We have counted the courses of the stars, and read what the sky says.  
**The Mobed**: A clear spring shall issue into the day, a son shall be born to Zal, a hero full of power and glory, and there shall not be his like in Iran.  
_Sam lets out a breath he seems to have been holding since the night his son was born._  

#### <a id="a27-14-stars-done"></a>Done `a27-14-stars-done`

**Sam** _(soft)_: Tell him: it’s folly, and I gave my word, so it shall be done. I’ll go to the Shah myself.  
**Sam**: And tell him… tell him I read every line.  

### Step 3: Take Sam’s answer to Kabul.

Hint: Zal sends you on to Rudaba with the good news. · check: `deliver:a27-answer:rudaba`

#### <a id="a27-14-kabul"></a>Scene `a27-14-kabul`

_Zal reads his father’s answer and gives away half his money to the poor. Then he sends you on to Rudaba with it._  
_In the family’s rooms there is trouble already: the queen has caught Rudaba’s maid with a gift for Zal up her sleeve._  
_Then worse news comes on a fast horse: the Shah is angry, and has ordered Sam to march on Kabul and burn it._  
_Sindokht gets the whole story out of her daughter in a quarter of an hour. Mehrab comes in, and hears it, and goes grey._  
_He says a terrible, frightened thing about his own daughter, and Sindokht won’t let him finish it._  
**Sindokht** _(angry)_: Stop. You are frightened, and frightened men say stupid things. Give me the key to the treasury.  
**Mehrab**: What for?  
**Sindokht**: I’m going to see Sam myself.  

#### <a id="a27-14-kabul-done"></a>Done `a27-14-kabul-done`

**Rudaba** _(sad)_: Mother. I’m sorry I didn’t tell you.  
**Sindokht**: So am I. We’ll discuss it at length when Kabul isn’t on fire. Messenger, you’re coming with me.  

### Step 4: Ride with Sindokht to Sam, and stand by her.

Hint: Stay with the queen’s train all the way to Sam’s camp. · check: `escort:a27-sindokht:sam`

#### <a id="a27-14-embassy"></a>Scene `a27-14-embassy`

_Sindokht rides out with a train two miles long: gold, horses, elephants, carpets and enough musk to scent a city._  
_She has herself announced to Sam as a messenger from Kabul, and goes in, and has all of it laid out at his feet._  
**Sam** _(think)_: A woman, sent as an envoy, with all this? Who are you, really?  
**Sindokht**: Swear first that you’ll spare my life and everyone I love. Then I’ll tell you anything.  
_Sam takes her hand and swears. Then she tells him: she is Mehrab’s wife, and Rudaba’s mother, and of Zahhak’s line._  
**Sindokht**: Punish the wicked if you must. But spare the innocent, or you’ll turn day into night.  
**Sam** _(think)_: This one was there when my son was born. Messenger: is Rudaba worthy of him?  

**Choices**

- **“She asked me seven questions about him before she ever saw him.”**
    - **Sam**: Seven. I didn’t ask one, about my own son, for years.
- **“Her maids won a boasting match against his page.”**
    - **Sam**: Then she has good people round her. That’s most of what a ruler needs.
- **“Ask him yourself. He’ll tell you.”**
    - **Sam**: Yes. I’ve learned that one. I should ask him myself.

#### <a id="a27-14-embassy-done"></a>Done `a27-14-embassy-done`

**Sam**: My oath is sacred. Kabul is safe, and so are you and yours. And I want my son to have her, whoever her grandfathers were.  

### Complete

#### <a id="a27-14-complete"></a>Complete `a27-14-complete`

_Sindokht rides home with her face shining, like the moon coming out from behind a cloud._  
_Sam writes to the Shah: a letter only a sorry man could write. Zal carries it to court himself._  
_Your Nubbin rides home on an elephant, by its own arrangement, and has to be coaxed down with a pomegranate._  

**Rewards**


Sets on completion: `{"a27-14":true}`

**Learning Grove swaps**

- `a27-14-stars#5` → The stars say a son will be born to Zal: a hero as bright as a spring of clear water, and strong and good, with nobody like him in Iran.

**Notes:** LIFTED TEXT: a27-14-stars#5 (Zimmern p. 51), the mobed. Zal’s letter (step 1) follows Zimmern p. 50 in our words. Sam’s “fire and water” and his answer follow p. 51–52 in our words. FEATHER PAYOFF (a27-feather): the scene shown for step 1, a27-14-letter, is for told (its #5: “You came back for me. Come with me now.”). For sat play ATLAS_A27_VARIANTS a27-14-letter-sat in its place (“I learned to wait on a mountain. I can wait for you.”). For night play a27-14-letter-night (“I made you wait one night. You made me wait many. Let’s call it even.”). Everything else is shared. SOFTENED (care notes): the Shah’s order to burn Kabul is one line (a27-14-kabul#2). Mehrab’s threat against his daughter is one line, never voiced, and cut off (a27-14-kabul#4). ORDER: Zimmern has the Shah’s order, Zal’s plea to Sam and Sam’s letter to the Shah before Sindokht’s embassy; here the order arrives as news in Kabul and Sam’s letter to the Shah is told in the complete scene (our merge, to keep you in the scenes). The choice in step 4 has no flag.

## A27-15. The Riddles

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the mobeds’ riddles and the trials at Manuchehr’s court* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-14, from Nova’s atlas. · requires: A27-14

**Cast:** Manuchehr (Manuchehr, Shah of Iran (Zimmern: Minuchihr) (Shahnameh); original design), Zal (Zal, son of Sam (Shahnameh); white-haired, original design), The Mobed (The mobeds, the wise men and priests of the court (Zimmern: Mubids) (Shahnameh); original design)

### Step 1: Sit in the circle while the mobeds question Zal.

Hint: Watch, listen, and see if you can guess before he answers. · check: `puzzle:a27-riddles:court`

#### <a id="a27-15-riddles"></a>Scene `a27-15-riddles`

_At court the Shah reads Sam’s letter, and is moved by it. But he wants to see what Zal is made of first._  
_The mobeds sit in a circle, with Zal in the middle. You and your Nubbin are allowed to sit at the edge, very quietly._  
**The Mobed** _(think)_: I have seen twelve tall green trees. Each one has thirty branches. They never grow more, and never fewer.  
**Zal**: The twelve months of the year. Each one has thirty days.  
**The Mobed** _(think)_: Two fine horses race for ever, one black, one white as crystal. They never catch each other.  
**Zal**: Night and day. They chase each other round the sky, and neither one wins.  
**The Mobed** _(think)_: Thirty riders pass the king. Look again: one is missing. Look again: all thirty are back.  

**Choices**

- **Whisper: “The moon.”**
    - **Zal**: The days of the month. The moon thins until one night it’s gone, and then it comes back whole.
    - He catches your eye. You were nearly right, and he knows you were thinking it, and he is pleased.
- **Whisper: “The stars.”**
    - **Zal**: The days of the month. The moon thins until one night it’s gone, and then it comes back whole.
    - Not the stars, then. You were a long way off, and enjoyed it anyway.
- **Keep quiet, and let him think.**
    - **Zal**: The days of the month. The moon thins until one night it’s gone, and then it comes back whole.

#### <a id="a27-15-riddles-done"></a>Done `a27-15-riddles-done`

_The mobeds look at each other. Three riddles, three answers, and he hasn’t hesitated over any of them._  

### Step 2: Hear the last and hardest riddle.

Hint: Stay in the circle. The oldest mobed asks last. · check: `watch:a27-zal:last-riddle`

#### <a id="a27-15-hardest"></a>Scene `a27-15-hardest`

**The Mobed** _(think)_: A green garden. A man comes in with a sharp sickle, and cuts everything, the dry and the green alike.  
**Zal** _(soft)_: That is time. It cuts the old and the young, and doesn’t listen to anyone. That’s why we have to be kind while we can.  
_The oldest mobed waits until the room is very quiet. This is the one he is proud of._  
**The Mobed** _(think)_: People leave a city on a rock and build in a thicket below. They forget the rock. Then the earth shakes.  
**The Mobed**: Now they long for the town on the rock. What does it mean?  
**Zal** _(think)_: The rock is the world that lasts. The thicket is the life we live, busy and short.  
**Zal**: We all go up to the rock in the end. What matters is that we leave a good name behind us in the thicket.  
_Nobody speaks. Then the whole court starts talking at once._  

#### <a id="a27-15-hardest-done"></a>Done `a27-15-hardest-done`

**Manuchehr** _(happy)_: Well. I’d have needed a week for that last one. And a nap.  

### Step 3: Watch Zal at the trials of arms.

Hint: Stand at the edge of the field below the Shah’s roof. · check: `watch:a27-zal:trials`

#### <a id="a27-15-trials"></a>Scene `a27-15-trials`

_The next morning the drums call the champions out. The Shah watches from his roof._  
_Zal shoots further and straighter than any of them. His spear goes through every shield._  
_Then he wrestles a champion who has never been beaten, and he is gentle about it, and he wins._  
_The crowd shouts and claps. Your Nubbin claps loudest, standing on your head to see._  
**Zal** _(happy)_: I learned to throw on the peak. The chicks were always losing things over the edge.  
_The champion he beat comes over, rubbing his shoulder, and asks him to teach him that last throw._  

#### <a id="a27-15-trials-done"></a>Done `a27-15-trials-done`

**Manuchehr**: Enough. I’m convinced. The young man has brains and arms both, and he answers riddles faster than my mobeds ask them.  

### Complete

#### <a id="a27-15-complete"></a>Complete `a27-15-complete`

_The Shah writes to Sam himself: he has seen the young man, and finds him worthy, and sends him home satisfied._  
**Manuchehr** _(happy)_: Go and marry your princess. And bring me something from the feast.  
_Zal rides home with his head high. When Sam reads the Shah’s letter, he looks ten years younger._  
_Your Nubbin has a royal napkin tucked into its collar. It has decided to keep it._  

**Rewards**


Sets on completion: `{"a27-15":true}`

**Notes:** The riddles are Zimmern pp. 61–65 (verse translations of Ferdowsi) told entirely in our own words; none of the verse is quoted. Five of the six are used (the two cypresses are left out for length). The reaper riddle is gentle for All; Zal’s answer turns it to kindness. The guessing choice is light: whatever you whisper, Zal answers; no flag. The trials (archery, spear, wrestling) are Zimmern p. 65–66. The Shah’s jokes are ours.

## A27-16. The Wedding

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the wedding of Zal and Rudaba in Kabul* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-15, from Nova’s atlas. · requires: A27-15

**Cast:** Sam (Sam (Zimmern: Saum), champion of Sistan, Zal’s father (Shahnameh); original design), Sindokht (Sindokht, queen of Kabul, Rudaba’s mother (Shahnameh); original design), Mehrab (Mehrab, king of Kabul (Zimmern: Mihrab) (Shahnameh); original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design), Zal (Zal, son of Sam (Shahnameh); white-haired, original design)

### Step 1: Ride into Kabul with Sam and Zal.

Hint: The whole city has come out. Stay near Sam. · check: `walk:a27-kabul:procession`

#### <a id="a27-16-arrival"></a>Scene `a27-16-arrival`

_Kabul is hung with silk banners. Trumpets, harps and cymbals, and the streets sprinkled with rose-water._  
_Mehrab comes out to meet them, and puts a crown of jewels on Zal’s white head. Nobody in the crowd thinks it looks odd._  
_Sindokht is waiting at the door of the king’s house. Sam bows to her as to an old friend._  
**Sam** _(happy)_: How much longer are you going to hide Rudaba from me?  
**Sindokht** _(happy)_: Hide her? She’s our sun. And what is it worth to you, to see her?  
**Sam**: Anything you like. My horses. My throne. Name it.  
_She laughs, and takes him in through the curtains to the family’s rooms._  

#### <a id="a27-16-arrival-done"></a>Done `a27-16-arrival-done`

_Sam looks at Rudaba for a long time. Then he turns to Zal and shakes his head, slowly._  
**Sam** _(happy)_: I don’t have words for her. I fought dragons and never ran out of words. Well done, son.  

### Step 2: Bring your gift to the wedding feast.

Hint: Find your place at the long table on the first night. · check: `give:a27-gift:wedding`

#### <a id="a27-16-feast"></a>Scene `a27-16-feast`

_Zal and Rudaba sit together on one throne, while Mehrab reads out the list of gifts. The list takes most of an afternoon._  
_Then the feast. It goes on for seven days, and nobody gets tired of it, except possibly the cooks._  
_On the first night the maids find you a seat near the front, because the messenger ought to be near the front._  
**Rudaba** _(happy)_: You carried every word. Without you, half of them would have fallen in the river.  
**Zal** _(happy)_: My nestmate. My messenger. What did you bring us? You’re allowed to have brought nothing.  
_Your Nubbin has been told the feast lasts seven days. It is not pacing itself._  

**Choices**

- **Give them a twist of chick-down from the nest.**
    - A soft twist of white down, from the chicks you all slept among. Zal holds it to his face.
    - **Zal**: It smells of sandalwood. It smells of home.
- **Let your Nubbin dance.**
    - Your Nubbin dances the only dance it knows, learned from the chicks, with a lot of flapping. Rudaba cries laughing.
- **Tell them the story of the night in the storm.**
    - You tell them about the basket and the storm. Rudaba holds Zal’s hand so hard her knuckles go white.
    - **Rudaba**: I’m glad you stayed. I’m glad somebody kind was there.

#### <a id="a27-16-feast-done"></a>Done `a27-16-feast-done`

_Sindokht leans across and fills your plate, and then your Nubbin’s, and then your Nubbin’s again._  

### Complete

#### <a id="a27-16-complete"></a>Complete `a27-16-complete`

_After a month in Kabul, they all go home to Sistan. This time Zal brings a queen._  
**Rudaba** _(happy)_: And a proper rope. He wouldn’t use the other kind.  
_In his father’s hall, Zal sets a crown of gold on her black hair, and she sets her hand on his white head._  
_Your Nubbin has eaten, at a guess, its own weight in wedding cake. It sleeps for two days, smiling._  

**Rewards**


Sets on completion: `{"a27-16":true}`

**Notes:** Kabul’s welcome, Sindokht’s teasing price for seeing “the sun” (Zimmern: “What wilt thou give me to see the sun?”) and the seven days of feasting follow Zimmern pp. 66–68 in our own words (not quoted). The crown of gold is set on Rudaba in Sistan, after the wedding, as in Zimmern. CARE: Persian wedding art from manuscript painting with the advisers; no “exotic” styling. The gift choice has no flag.

## A27-17. The Feather in the Fire

*Shahnameh (Ferdowsi, Persia, finished about 1010), as retold by Helen Zimmern, The Epic of Kings (1883): the Simurgh comes again, and Rostam is born (Zimmern, “Rustem”)* · audience: all · where: Nova’s atlas: the White-Haired Prince page (Atlas campaign) · when: Any time after A27-16, from Nova’s atlas. · requires: A27-16

**Cast:** Zal (Zal, son of Sam (Shahnameh); white-haired, original design), Rudaba (Rudaba, princess of Kabul (Zimmern: Rudabeh) (Shahnameh); original design), The Simurgh (The Simurgh, the great bird of Mount Alborz (Shahnameh); design from Persian manuscript painting), Old Servant (One of the servants Sam sends to the mountain (Shahnameh); named role is our addition)

### Step 1: Stay with Zal while Rudaba’s labour goes on.

Hint: Sit with him in the hall outside her rooms. · check: `sit:a27-zal:hall`

#### <a id="a27-17-labour"></a>Scene `a27-17-labour`

_A year goes by. Rudaba is expecting a baby, and the time has come, and it isn’t going well._  
_The labour is long and hard, and days go by. She can’t rest, by day or by night._  
_Zal sits outside her rooms with his head in his hands. He is the bravest man in Iran, and he can’t do anything._  
**Zal**: I’ve answered every riddle they ever asked me. I don’t know the answer to this one.  
_Your Nubbin climbs up beside him and leans, warm and heavy, on his arm._  
_Zal lifts his head. He is looking at the box on the shelf, where he keeps the things he brought from the mountain._  
**Zal** _(shock)_: The feather.  

#### <a id="a27-17-labour-done"></a>Done `a27-17-labour-done`

_He takes it out of the box. It is grey and gold, as long as his arm, and he has kept it dry, as he was told._  

### Step 2: Put the feather on the fire.

Hint: The brazier in the hall is lit. · check: `place:a27-feather:fire`

#### <a id="a27-17-fire"></a>Scene `a27-17-fire`

_Zal goes straight to the brazier in the middle of the hall. He doesn’t stop to think, and he doesn’t need to._  
**Zal**: She said: in the day of your need. This is the day.  
_He puts the feather on the fire himself, with a steady hand._  
_It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood._  
_He came straight down the mountain when his father came back, and he goes straight to the fire now. He has never been one to wait._  
_Outside, all at once, the light goes strange._  

#### <a id="a27-17-fire-sat"></a>Variant `a27-17-fire-sat`

_Variant of `a27-17-fire`._

_Zal goes to the brazier in the middle of the hall, and stops, and stands there with the feather in his hands._  
**Zal**: She said: in the day of your need. This is the day.  
_He holds it a long moment. You don’t hurry him; you never have._  
_Then he turns round and holds it out to you._  
**Zal** _(soft)_: You put it on. You sat with me at the edge until I could stand. Sit with me now.  
_You take the feather and lay it on the fire, and sit down beside him on the step. He leans on your shoulder._  
_It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood._  
_Outside, all at once, the light goes strange._  

#### <a id="a27-17-fire-night"></a>Variant `a27-17-fire-night`

_Variant of `a27-17-fire`._

_Zal goes to the brazier in the middle of the hall, and looks at the feather for a moment._  
**Zal**: She said: in the day of your need. This is the day.  
**Zal**: She gave me a night, once, because you asked. I hope she has one more in her.  
_He lays the feather on the fire. Your Nubbin stands beside him, holding on to his boot._  
_It doesn’t burn like a feather. It burns slowly, like a candle, with a smell of sandalwood._  
_Outside, all at once, the light goes strange._  

#### <a id="a27-17-fire-done"></a>Done `a27-17-fire-done`

_A sound like a great wind fills the air. Every shutter in the house rattles._  

### Step 3: Go out to the Simurgh.

Hint: Go out into the courtyard with Zal. · check: `talk:a27-simurgh:courtyard`

#### <a id="a27-17-wings"></a>Scene `a27-17-wings`

_The sky over Sistan goes dark with wings. The whole city looks up._  
_The Simurgh comes down into the courtyard, which is not big enough for her, and makes it do._  
_She looks at Zal, grown, white-haired and frightened, and bends her great head down to his._  
**The Simurgh** _(soft)_: O my son, wherefore art thou troubled, and why are the eyes of this lion wet with tears?  
**Zal** _(sad)_: Rudaba. It’s Rudaba. She can’t rest, and it’s been days, and nobody knows what to do.  
**The Simurgh** _(soft)_: Be easy. I took you in when your father put you out, and I raised you. I have come to help you again.  
_She tells him what to do, slowly and plainly, the way she used to tell him which fish were safe to eat._  
_Zal listens to every word. Then he goes in, and does exactly what she said._  

**Choices**

- **Thank her for coming.**
    - **The Simurgh**: I said I would come like a cloud. I keep my word, little stranger. I always did.
- **Let your Nubbin go to her.**
    - Your Nubbin runs to her and burrows under her wing, exactly where it used to sleep. She lets it.

#### <a id="a27-17-wings-done"></a>Done `a27-17-wings-done`

_The Simurgh settles in the courtyard to wait. You sit down beside her, under the edge of her wing, like old times._  

### Complete

#### <a id="a27-17-complete"></a>Complete `a27-17-complete`

_Near morning there is a new sound in the house: small, furious and very much alive._  
_The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see._  
**Rudaba** _(happy)_: His name is Rostam. It means delivered: the pain is over, and here he is.  
_Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face._  
_Zal comes out into the courtyard with his son in his arms, wrapped up tight, and holds him up to the Simurgh._  
**Zal** _(happy)_: Look. Look what he is. You came the moment I called, and now he’s here.  
_The Simurgh looks at the baby, and the baby looks at the Simurgh, and neither of them is at all afraid._  
_The old servant is at the door, as ever. Zal puts the baby into his arms without a word._  
**Old Servant** _(soft)_: Last time I carried one of yours, it was up a mountain.  
**Zal** _(happy)_: Only to the kitchen this time.  
_He goes the long way round, past every door in the house, so that everyone can see._  
_When the baby comes back, the last thing you see on the page is Zal in the courtyard, laughing, holding him up to the sky._  
_Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely._  
_Your Nubbin goes over and shares its breakfast with it, smallest first. That is why it needs a second breakfast._  
_One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back._  
_You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast._  

#### <a id="a27-17-complete-sat"></a>Variant `a27-17-complete-sat`

_Variant of `a27-17-complete`._

_Near morning there is a new sound in the house: small, furious and very much alive._  
_The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see._  
**Rudaba** _(happy)_: His name is Rostam. It means delivered: the pain is over, and here he is.  
_Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face._  
_Zal comes out into the courtyard with his son in his arms, and sits down on the step beside you, and doesn’t say anything at all._  
_He doesn’t need to. You sit there together, all three of you, and let the morning come._  
_The old servant is at the door, as ever. Zal puts the baby into his arms without a word._  
**Old Servant** _(soft)_: Last time I carried one of yours, it was up a mountain.  
**Zal** _(happy)_: Only to the kitchen this time.  
_He goes the long way round, past every door in the house, so that everyone can see._  
_Days later, far away in his camp, Sam opens a parcel and finds a little silk doll with his grandson’s face._  
_The last thing you see on the page is Sam, the great champion, holding the doll in both hands and weeping for joy._  
_Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely._  
_Your Nubbin goes over and shares its breakfast with it, smallest first. That is why it needs a second breakfast._  
_One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back._  
_You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast._  

#### <a id="a27-17-complete-night"></a>Variant `a27-17-complete-night`

_Variant of `a27-17-complete`._

_Near morning there is a new sound in the house: small, furious and very much alive._  
_The baby is big and strong, with a fist like a walnut. Rudaba laughs, tired out, and holds him up to see._  
**Rudaba** _(happy)_: His name is Rostam. It means delivered: the pain is over, and here he is.  
_Before noon a rider sets off for Sam with a doll of the baby sewn in silk, so the grandfather can see his face._  
_Zal comes out into the courtyard with his son in his arms, and holds him up to the Simurgh._  
_She looks at the baby for a long time. Then she turns her great gold eye on you._  
**The Simurgh** _(soft)_: You were right to give him the night.  
_The old servant is at the door, as ever. Zal puts the baby into his arms without a word._  
**Old Servant** _(soft)_: Last time I carried one of yours, it was up a mountain.  
**Zal** _(happy)_: Only to the kitchen this time.  
_He goes the long way round, past every door in the house, so that everyone can see._  
_She spreads her wings, which fill the whole sky over Sistan, and goes up._  
_The last thing you see on the page is the Simurgh circling over the house, once and again, before she turns for home._  
_Over the courtyard wall, one small beak appears. The smallest chick has followed her all the way, and waits at the back, politely._  
_Your Nubbin goes over and shares its breakfast with it, smallest first. That is why it needs a second breakfast._  
_One feather has drifted down onto the step: grey and gold, long as your arm. The Simurgh doesn’t take it back._  
_You are back in the Grove, the atlas on your knee. The feather has come too, and your Nubbin, fed once already, is asking for second breakfast._  

**Rewards**

- Simurgh Feather (decor): A long grey-and-gold feather in a glass on the cottage mantel. A great bird raised a baby whose father turned him away for his white hair, and gave him a feather to burn in need. This one is never burned. It’s for looking at.

Sets on completion: `{"a27-17":true,"a27-done":true}`

**Learning Grove swaps**

- `a27-17-wings#3` → My child, why are you so worried? Why are my brave lion’s eyes full of tears?

**Notes:** LIFTED TEXT: a27-17-wings#3 (Zimmern p. 69), the Simurgh. Her second line (#5) follows Zimmern’s next sentence in our words. Rudaba naming Rostam “delivered” and the silk doll sent to Sam follow Zimmern pp. 69–70 in our words. SOFTENED (care notes): Zimmern leaves out Ferdowsi’s surgery, and so do we: the Simurgh gives counsel, and the baby is born safely. Nothing of the labour is shown but the waiting. FEATHER PAYOFF (a27-feather): the scenes shown, a27-17-fire and a27-17-complete, are for told (Zal burns the feather himself without hesitating; the last image is Zal with the baby). For sat play ATLAS_A27_VARIANTS a27-17-fire-sat (he holds the feather a long moment and hands it to you to put on the fire: the third rule, landing) and a27-17-complete-sat (the last image is Sam with the silk doll). For night play a27-17-fire-night and a27-17-complete-night (the Simurgh says “You were right to give him the night.”; the last image is the Simurgh circling). Rostam is born on every path. REWARD (one-time, at a27-17-complete*): the Simurgh Feather in its glass, decor for the cottage mantel. It is never burned and does nothing; its description is its story in two plain lines. SABLE (read-only, Grove trust stage): straight after a27-17-complete* when the atlas shuts, play ATLAS_A27_VARIANTS a27-close-sable-bonded if Sable is bonded, or a27-close-sable-wary if she is in the Grove but not bonded. If she isn’t in the Grove yet, nothing plays. From then on the feather is on the mantel either way.

## Variant scenes

Variants with no parent scene in this storyline (Grove-side, campaign-side or shared scenes).

#### <a id="a27-margin-hazel"></a>Variant `a27-margin-hazel`

_Nova’s atlas lies open at the great nest on the peak, and the four round chicks, and the small white head among them._  
_Beside the nest, in faint pencil you have never noticed, there is a note in the margin. You know the hand._  
_“White hair at birth. I’d have kept him.”_  
_And under it, one letter: H._  
_Your Nubbin puts one paw on the drawing of the baby, very gently, the way it touched his hair in the cradle._  

#### <a id="a27-close-sable-bonded"></a>Variant `a27-close-sable-bonded`

_You shut the atlas, and put the feather in a glass on the cottage mantel, where the light can get at it._  
_When you look back, Sable is curled up asleep on the mantel shelf, right underneath it. You didn’t see her get up there._  
_The tip of the feather moves a little in her breathing. She doesn’t wake, and you don’t wake her._  

#### <a id="a27-close-sable-wary"></a>Variant `a27-close-sable-wary`

_You shut the atlas. The feather has slipped out of your hand somewhere, and you can’t find it._  
_Then you do: on the ground at the edge of the long grass. Sable is lying in the grass a little way off, watching it._  
_She doesn’t touch it, and she doesn’t go. When you pick it up, her eyes follow it all the way to the mantel._  
