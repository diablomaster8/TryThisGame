# Neopia quests (NQ1–NQ32)

## NQ1. Faerie Quest: The Fire Faerie

*Neopets: Faerie Quests (the Fire Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Fire Faerie (Fire Faerie (Neopets))

### Step 1: Bring the Fire Faerie one slice of the Giant Omelette from the Tyrannian Plateau.

Hint: Take a slice from the Giant Omelette in Tyrannia, then carry it back to the grotto. · check: `give:item:omelette-slice:fire-faerie`

#### <a id="nq01-ask"></a>Scene `nq01-ask`

_A lamp in the grotto flares orange. A faerie steps out of the flame, brushing soot off her sleeves._  
**The Fire Faerie** _(happy)_: Keeper. At last, someone in sensible shoes.  
**The Fire Faerie**: People call me hot-headed. I prefer “well done”. Mostly because everything I touch ends up well done.  
**The Fire Faerie** _(sad)_: I want something warm that I didn’t heat myself. Just once.  
**The Fire Faerie** _(think)_: The Tyrannians make an omelette the size of a hill. Bring me one slice. Just one.  
_Your Nubbin sniffs her hem and backs away from the smell of singed toffee._  

**Choices**

- **Ask why she can’t fetch it herself.**
    - **The Fire Faerie**: Last time I went near it, the omelette caught fire. Tyrannia still hasn’t forgiven me.
- **Promise to bring it back still warm.** — sets `{"nq-01-promised-warm":true}`
    - **The Fire Faerie**: Warm is a bonus. Not on fire is the goal.

#### <a id="nq01-ask-done"></a>Done `nq01-ask-done`

_You hold out the slice. She takes it in both hands, very carefully, as if it might go up in smoke._  
**The Fire Faerie** _(happy)_: Soft. Yellow. Not burning. Remarkable.  
_Your Nubbin eyes the slice. The Fire Faerie eyes your Nubbin. The slice is not shared._  

### Complete

#### <a id="nq01-complete"></a>Complete `nq01-complete`

**The Fire Faerie**: A deal’s a deal. Show me the one who’ll carry my blessing.  
_She cups her hands round your pet’s face. It feels like the first warm day of spring._  
**The Fire Faerie** _(soft)_: There. A little fire in the belly. Use it for pushing heavy things, not for arguments.  
_Your pet flexes. A pebble nearby rolls over, though nobody touched it._  
_Power rises by one level._  

#### <a id="nq01-complete-nq-01-promised-warm"></a>Variant `nq01-complete-nq-01-promised-warm`

_Variant of `nq01-complete`._

**The Fire Faerie** _(happy)_: And it was still warm when it got here. You keep promises. I’ll remember that.  
**The Fire Faerie**: A deal’s a deal. Show me the one who’ll carry my blessing.  
_She cups her hands round your pet’s face. It feels like the first warm day of spring._  
**The Fire Faerie** _(soft)_: There. A little fire in the belly. Use it for pushing heavy things, not for arguments.  
_Your pet flexes. A pebble nearby rolls over, though nobody touched it._  
_Power rises by one level._  

**Rewards**

- Fire Faerie’s Blessing (item): One Power level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-01-done":true}`

**Notes:** Faerie Quest. The blessing goes to your Neo pet, in the Neopia save; a Nubbin is never changed. The omelette slice comes from the Giant Omelette in Tyrannia. Freebies are never per visit (canon: one-time or unlimited), so the Omelette must give a slice whenever this quest is open; the quest never forces a second trip. Art: Fire Faerie portrait (orange, soot-smudged), a grotto lamp flare. Sound: a soft whoomph as she appears.

## NQ2. Faerie Quest: The Water Faerie

*Neopets: Faerie Quests (the Water Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Water Faerie (Water Faerie (Neopets))

### Step 1: Bring the Water Faerie a grey pearl from the Maraquan Ruins.

Hint: Send a Swim Nubbin into the Maraquan Ruins, or try your one cast at Underwater Fishing in Maraqua. · check: `give:item:grey-maraquan-pearl:water-faerie`

#### <a id="nq02-ask"></a>Scene `nq02-ask`

_The grotto pool ripples, though there is no wind. A faerie rises out of it, perfectly dry._  
**The Water Faerie** _(happy)_: Hello, Keeper. Your Nubbin has been staring at my pool like it owes it money.  
**The Water Faerie**: I keep a string of pearls, one from every sea. Maraqua’s is missing.  
**The Water Faerie**: The pink one remembers a sunset. The black one remembers a shipwreck and won’t stop going on about it.  
**The Water Faerie** _(think)_: Not a shiny one. A grey one, from the old ruins. Grey pearls remember things.  
_Your Nubbin dips a foot in the pool, gasps at the cold, and does it again._  

**Choices**

- **Ask whether a shiny one would do.**
    - **The Water Faerie**: Shiny ones only remember being shiny. Grey, please.
- **Say your Nubbin will dive for it.** — sets `{"nq-02-dived":true}`
    - **The Water Faerie**: Good. Pearls like being found by someone who enjoyed the swim.

#### <a id="nq02-ask-done"></a>Done `nq02-ask-done`

_The pearl is the colour of a rainy morning. She threads it between a pink one and a black one._  
**The Water Faerie** _(happy)_: There. The string’s a full circle again. It was driving me mad.  

### Complete

#### <a id="nq02-complete"></a>Complete `nq02-complete`

**The Water Faerie**: Hold your swimmer up for me.  
_She tips a handful of pool water over your pet’s head. It doesn’t get wet. It gets slippery, in a good way._  
**The Water Faerie** _(soft)_: Water will make room for you now. Don’t abuse the privilege.  
_Swim rises by one level._  

#### <a id="nq02-complete-nq-02-dived"></a>Variant `nq02-complete-nq-02-dived`

_Variant of `nq02-complete`._

**The Water Faerie** _(soft)_: The one that dived. I can tell; it still smells of the ruins. Hold it up for me.  
_She tips a handful of pool water over your pet’s head. It doesn’t get wet. It gets slippery, in a good way._  
**The Water Faerie** _(soft)_: Water will make room for you now. Don’t abuse the privilege.  
_Swim rises by one level._  

**Rewards**

- Water Faerie’s Blessing (item): One Swim level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-02-done":true}`

**Notes:** Faerie Quest. Maraqua is Swim-Nubbins-only (brief), so the fishing route lets a Keeper without a swimmer finish it: make the grey pearl a guaranteed catch on the first cast after this quest starts. Art: a pearl string with one gap.

## NQ3. Faerie Quest: The Air Faerie

*Neopets: Faerie Quests (the Air Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Air Faerie (Air Faerie (Neopets))

### Step 1: Bring the Air Faerie a bronze wind chime from the Shenkuu terraces.

Hint: The chime seller sits on the highest terrace in Shenkuu. Pick whichever chime you like. · check: `give:item:shenkuu-wind-chime:air-faerie`

#### <a id="nq03-ask"></a>Scene `nq03-ask`

_A gust slams every door in the grotto. When it settles, a faerie is sitting on the top shelf, swinging her feet._  
**The Air Faerie** _(happy)_: Sorry. I’ve never learned to arrive quietly. Wind doesn’t do quietly.  
**The Air Faerie**: Here’s my trouble. The wind is bored. It blows all day and nobody hears a thing.  
**The Air Faerie** _(think)_: In Shenkuu they hang little bronze chimes on the terraces. Fetch me one, and the wind gets a voice.  
**The Air Faerie** _(sad)_: I tried whistling for it myself once. Three hats blew off and a Poogle race had to be run again.  
_Your Nubbin spreads its wings and waits for a gust. It gets one. It falls over._  

**Choices**

- **Offer to find the best-sounding one.**
    - **The Air Faerie**: Pick the one that sounds best when nobody’s listening. That’s the honest one.
- **Ask whether the wind could just be quiet instead.**
    - **The Air Faerie**: Ask a river to sit still. See how you get on.

#### <a id="nq03-ask-done"></a>Done `nq03-ask-done`

_Before you can hand it over, the wind snatches the chime and hangs it from the grotto roof._  
_It rings three notes, then a fourth that doesn’t quite fit._  
**The Air Faerie** _(happy)_: It’s showing off already. Perfect.  

### Complete

#### <a id="nq03-complete"></a>Complete `nq03-complete`

**The Air Faerie**: Right, your flyer. Arms out. Wings out. Whatever you’ve got, out.  
_A warm updraft lifts your pet a hand’s height off the floor, then sets it down gently._  
**The Air Faerie** _(soft)_: The wind knows your name now. It’ll give you a lift if you ask nicely.  
_Your pet lands, then immediately jumps again, to check the wind meant it._  
_Fly rises by one level._  

**Rewards**

- Air Faerie’s Blessing (item): One Fly level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-03-done":true}`

**Notes:** Faerie Quest. After completion the chime stays hanging in the grotto and rings whenever the player passes (ambient sound). Shenkuu is a mountain-garden land; the chime seller is a background vendor, no lines needed.

## NQ4. Faerie Quest: The Earth Faerie

*Neopets: Faerie Quests (the Earth Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Earth Faerie (Earth Faerie (Neopets))

### Step 1: Bring the Earth Faerie a turnip from Meri Acres Farm in Meridell.

Hint: Meri Acres Farm sells its turnips at the gate. Any turnip with mud still on it counts. · check: `give:item:meri-acres-turnip:earth-faerie`

#### <a id="nq04-ask"></a>Scene `nq04-ask`

_Moss creeps across the grotto floor in a neat line. At the end of it, a faerie kneels, patting the soil._  
**The Earth Faerie**: Mind the moss, Keeper. It’s only just got comfortable.  
**The Earth Faerie** _(think)_: I’d like a turnip. Don’t laugh. A proper one, from Meri Acres Farm.  
**The Earth Faerie**: Faerie gardens grow whatever you wish for, so everything tastes of wishing. I want something that tastes of work.  
_Behind her, a faerie garden grows in perfect rows. Every flower is the same height. It looks as if it has been told off._  
_Your Nubbin is already digging a small hole beside her, out of solidarity._  

**Choices**

- **Offer to grow her one at home.**
    - **The Earth Faerie**: Kind. But I want Meridell mud on it. That mud has opinions.
- **Ask which farmer to buy from.**
    - **The Earth Faerie**: Whoever looks most tired. They grow the best ones.

#### <a id="nq04-ask-done"></a>Done `nq04-ask-done`

_The turnip is lumpy, purple at the shoulders, and still wearing a fair bit of Meridell._  
**The Earth Faerie** _(happy)_: Oh, it’s heavy for its size. That’s the sign of a good one.  
**The Earth Faerie** _(happy)_: I shall call him Gerald. Then I shall eat Gerald. That’s farming, dear.  

### Complete

#### <a id="nq04-complete"></a>Complete `nq04-complete`

**The Earth Faerie**: Now. Which of yours never wants to stop?  
_She presses your pet’s feet into the moss. For a moment it stands very still, like a fence post that has decided to stay._  
**The Earth Faerie** _(soft)_: Roots. You’ll tire later than you used to, and recover sooner.  
_Stamina rises by one level._  

**Rewards**

- Earth Faerie’s Blessing (item): One Stamina level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-04-done":true}`

**Notes:** Faerie Quest. A turnip grown in the Grove does not count (the check wants the Meri Acres item). Art: moss trail decal on the grotto floor.

## NQ5. Faerie Quest: The Light Faerie

*Neopets: Faerie Quests (the Light Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Light Faerie (Light Faerie (Neopets))

### Step 1: Bring the Light Faerie a sunstone scarab from the market in Sakhmet.

Hint: Sakhmet is the city of the Lost Desert. The scarab stall is beside Coltzan’s Shrine. · check: `give:item:sunstone-scarab:light-faerie`

#### <a id="nq05-ask"></a>Scene `nq05-ask`

_Every candle in the grotto brightens at once. A faerie appears in the glare, squinting and apologising._  
**The Light Faerie**: Too much? It’s always too much. Give me a moment.  
_The light dims to something you can look at. She is smaller than you expected, and very freckled._  
**The Light Faerie** _(think)_: In Sakhmet they carve little scarabs from sunstone. Each one holds a morning inside.  
**The Light Faerie** _(sad)_: Mine cracked, and it’s where I keep my nights. Would you bring me a new one?  
**The Light Faerie** _(sad)_: Without it the nights leak out. Last week I glowed so brightly at bedtime that Queen Fyora sent a note.  

**Choices**

- **Ask why a light faerie keeps nights.**
    - **The Light Faerie**: Everybody needs somewhere to put the dark when they’ve finished with it.
- **Promise to haggle hard.** — sets `{"nq-05-haggled":true}`
    - **The Light Faerie**: Desert traders love a haggler. Start at half, and look disappointed.

#### <a id="nq05-ask-done"></a>Done `nq05-ask-done`

_The scarab is warm in your palm, as if it has been sitting on a windowsill all day._  
**The Light Faerie** _(happy)_: It hums. Can you hear it? That means it’s a good one.  
_The trader threw in a second, smaller scarab “for the little one”. Your Nubbin is wearing it as a hat._  

### Complete

#### <a id="nq05-complete"></a>Complete `nq05-complete`

**The Light Faerie**: Light is the fastest thing there is. I can lend you a little of that.  
_She taps your pet’s nose. For a blink it glows, then it’s across the grotto and back before you’ve finished blinking._  
**The Light Faerie** _(happy)_: Don’t let it go to their head.  
_Run rises by one level._  

#### <a id="nq05-complete-nq-05-haggled"></a>Variant `nq05-complete-nq-05-haggled`

_Variant of `nq05-complete`._

**The Light Faerie** _(happy)_: You haggled. I can tell; you’ve the look of someone who paid half and still feels guilty.  
**The Light Faerie**: Light is the fastest thing there is. I can lend you a little of that.  
_She taps your pet’s nose. For a blink it glows, then it’s across the grotto and back before you’ve finished blinking._  
**The Light Faerie** _(happy)_: Don’t let it go to their head.  
_Run rises by one level._  

**Rewards**

- Light Faerie’s Blessing (item): One Run level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-05-done":true}`

**Notes:** Faerie Quest. On her entrance, brighten the screen briefly and then settle (no full-white flash; keep it gentle for photosensitive players).

## NQ6. Faerie Quest: The Dark Faerie

*Neopets: Faerie Quests (the Dark Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Dark Faerie (Dark Faerie (Neopets))

### Step 1: Bring the Dark Faerie a black reading candle from the chandler in Neovia.

Hint: Neovia is the little town in the Haunted Woods. The chandler’s shop has a candle in every window. · check: `give:item:neovian-black-candle:dark-faerie`

#### <a id="nq06-ask"></a>Scene `nq06-ask`

_One corner of the grotto goes dark. Not shadowy. Dark, like a page with the ink spilled on it._  
**The Dark Faerie**: Don’t fuss. I’m not here to frighten anyone. That’s a different faerie, and she’s busy.  
**The Dark Faerie** _(sad)_: I read at night. All night. My candle has burned down to a puddle.  
**The Dark Faerie** _(think)_: The chandler in Neovia makes black candles. Just enough light to read by, and not a flicker more.  
_On a little shelf in the dark: a stack of library books, all overdue, all bookmarked in the last chapter._  
_Your Nubbin peers into the dark corner. The dark corner peers back, politely._  

**Choices**

- **Ask what she reads.**
    - **The Dark Faerie**: Everything. Recipes, maps, the backs of jars. Knowing things is my favourite thing.
- **Offer her a nice bright lamp instead.**
    - **The Dark Faerie**: Bright lamps attract moths and visitors. I want neither.

#### <a id="nq06-ask-done"></a>Done `nq06-ask-done`

_The candle is black, smells of pine, and burns with a small, steady violet flame._  
**The Dark Faerie** _(soft)_: Oh, that’s lovely. That’s a two-chapter candle at least.  
**The Dark Faerie**: If you see the other Dark Faerie, I haven’t got it. She’d only want to borrow it, and she never gives things back.  

### Complete

#### <a id="nq06-complete"></a>Complete `nq06-complete`

**The Dark Faerie**: I’ll give your pet a little of what I like best: knowing.  
_She whispers into your pet’s ear. It tilts its head, thinks hard, then sorts three pebbles neatly by size._  
**The Dark Faerie**: Clever thing. The Wise Old King will notice. He notices everything, eventually.  
_Intelligence rises by one level._  

**Rewards**

- Dark Faerie’s Blessing (item): One Intelligence level (the hidden stat raised by books) for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-06-done":true}`

**Notes:** Faerie Quest. Not Jhudora: the generic Dark Faerie, gentle and bookish, so the quest suits all ages. Her line about "a different faerie" is a nod to Jhudora. Neovia is only visited for the candle here; it is the NP10 town, but nothing of the Tale of Woe appears.

## NQ7. Faerie Quest: The Space Faerie

*Neopets: Faerie Quests (the Space Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Space Faerie (Space Faerie (Neopets))

### Step 1: Bring the Space Faerie a pocket-sized piece of Kreludite from Kreludor.

Hint: Take the shuttle from the Virtupets Space Station to Kreludor and ask the Grundo miners. · check: `give:item:kreludite-chunk:space-faerie`

#### <a id="nq07-ask"></a>Scene `nq07-ask`

_The grotto roof turns into a night sky. A faerie floats down through the stars, upside down, then rights herself._  
**The Space Faerie** _(happy)_: Gravity. I always forget which way it goes on the ground.  
**The Space Faerie**: Sorry. I’m a bit spaced out today. I’m a bit spaced out every day. It’s in the job title.  
**The Space Faerie**: Keeper, I need a piece of Kreludite. Orange rock. From Kreludor, the moon with the mines.  
**The Space Faerie** _(think)_: I’m building a little model of the sky. Every moon gets a pebble, and Kreludor’s is missing.  
_Your Nubbin tries to catch a passing star. It goes straight through its paws._  

**Choices**

- **Ask whether the miners will mind.**
    - **The Space Faerie**: Ask the Grundos nicely. They’re very generous, and very tired of rocks.
- **Ask how big a piece she needs.**
    - **The Space Faerie**: Pocket-sized. Anything bigger is a boulder, and I have no shelf for a boulder.

#### <a id="nq07-ask-done"></a>Done `nq07-ask-done`

_The Kreludite is orange, light as pumice and faintly warm._  
_She sets it spinning above her palm, and the little model of Neopia finally has its moon._  
**The Space Faerie** _(soft)_: There. The sky’s finished. Well, my sky.  

### Complete

#### <a id="nq07-complete"></a>Complete `nq07-complete`

**The Space Faerie**: I bless the part that most needs it. That’s the fair way.  
_She looks your pet over like a star chart, and taps one spot, gently._  
**The Space Faerie** _(soft)_: Everyone has a dim star. This one’s brighter now.  
_Your pet’s lowest stat rises by one level._  

**Rewards**

- Space Faerie’s Blessing (item): One level in your Neo pet’s lowest stat (Swim, Fly, Run, Power or Stamina; ties go to the first in that order), applied at once. Kept in Neopia.

Sets on completion: `{"nq-07-done":true}`

**Notes:** Faerie Quest. Kreludor is reachable before NP13; this quest does not touch the Sloth plot. The Space Faerie also appears in NP13 (her token); she should look the same, and the miners can be the same Grundo camp sprites.

## NQ8. Faerie Quest: The Battle Faerie

*Neopets: Faerie Quests (the Battle Faerie)* · audience: all · where: Faerieland, the Faerie Quest grotto below Queen Fyora’s castle · when: Any time after your first visit to Faerieland. All the faeries wait in the grotto at once; take them in any order. Each asks only once.

**Cast:** The Battle Faerie (Battle Faerie (Neopets))

### Step 1: Bring the Battle Faerie a Thick Smoke Bomb from Smugglers’ Cove on Krawk Island.

Hint: The shop in Smugglers’ Cove keeps them under the counter. Ask for the counter. · check: `give:item:thick-smoke-bomb:battle-faerie`

#### <a id="nq08-ask"></a>Scene `nq08-ask`

_Something clangs. A faerie in dented armour strides in and drops her helmet on the table._  
**The Battle Faerie**: Keeper. You look like someone who finishes what they start. Good.  
**The Battle Faerie** _(think)_: I’m teaching a class at the Battledome. Today’s lesson is how to leave a fight.  
**The Battle Faerie**: For that I need a Thick Smoke Bomb. The smugglers on Krawk Island keep them under the counter.  
**The Battle Faerie** _(think)_: They’ll say they don’t have any. Then they’ll ask how many. That’s how you know it’s the right shop.  
_Your Nubbin salutes. Nobody taught it to salute. It just felt right._  

**Choices**

- **Ask why leaving is a lesson.**
    - **The Battle Faerie**: Anyone can start a fight. Knowing when to stop one is the hard part.
- **Ask her to teach your Nubbin to fight instead.**
    - **The Battle Faerie**: It’ll learn both. In that order: leaving first.

#### <a id="nq08-ask-done"></a>Done `nq08-ask-done`

_The smoke bomb is round, grey, and sloshes slightly. You carry it very carefully._  
**The Battle Faerie** _(happy)_: Unopened. Good. My last student used one on the way back.  

### Complete

#### <a id="nq08-complete"></a>Complete `nq08-complete`

_The Battle Faerie buckles her helmet back on, which seems to be how she gets serious._  
**The Battle Faerie** _(happy)_: You did the errand without blowing anything up. That earns a blessing.  
**The Battle Faerie** _(think)_: Now. Strength to hit hard, or strength to keep going?  
_Your pet looks between you, ready for either._  

**Choices**

- **Strength to hit hard.** — sets `{"nq-08-blessing":"power"}`
    - **The Battle Faerie**: Plant your feet. Breathe out as you push.
    - Power rises by one level.
- **Strength to keep going.** — sets `{"nq-08-blessing":"stamina"}`
    - **The Battle Faerie**: Wise. The last one standing usually wins.
    - Stamina rises by one level.

**Rewards**

- Battle Faerie’s Blessing (item): One level of Power or Stamina, your choice, for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-08-done":true}`

**Notes:** Faerie Quest. The blessing choice lives in the complete scene; apply the stat from the `nq-08-blessing` flag. The smoke bomb is consumed by the quest (it is not added to the Battledome item bag). Art: dented helmet prop.

## NQ9. Faerie Quest: Taelia the Snow Faerie

*Neopets: Faerie Quests (the Snow Faerie, Taelia)* · audience: all · where: Terror Mountain, Taelia’s ice hut · when: Any time after your first visit to Terror Mountain. Asks only once.

**Cast:** Taelia (Taelia the Snow Faerie (Neopets))

### Step 1: Bring Taelia a scoop of her own flavour from the Ice Cream Factory in Happy Valley.

Hint: The Ice Cream Factory is in Happy Valley, just down the slope. Ask for the Taelia flavour. · check: `give:item:taelia-ice-cream:taelia`

#### <a id="nq09-ask"></a>Scene `nq09-ask`

_Taelia’s hut is colder inside than out. She sits by an empty fireplace, knitting something very long._  
**Taelia** _(happy)_: Keeper! Come in. Don’t take your coat off, you’ll regret it.  
**Taelia**: A silly favour. The Ice Cream Factory has named a flavour after me.  
**Taelia** _(sad)_: I’ve never tried it. I’m too shy to go in and order my own name. Everyone would look.  
**Taelia**: There are posters with my face on, smiling. I have never once smiled like that. It’s very unsettling.  
_Your Nubbin is shivering, but politely, so as not to make a fuss._  

**Choices**

- **Ask what the flavour is.**
    - **Taelia**: Snowberry and something called Faerie Mint. It sounds like toothpaste. I have to know.
- **Offer to go in with her.** — sets `{"nq-09-invited":true}`
    - **Taelia**: Oh, I couldn’t. Next time. Maybe. Probably not.
    - She blushes. Snow faeries blush blue.

#### <a id="nq09-ask-done"></a>Done `nq09-ask-done`

_It hasn’t melted. Nothing melts in Taelia’s hut._  
_At the Factory they asked if it was for Taelia. You said it was for a friend. Both were true._  
_She tastes it, closes her eyes, and is quiet for a long while._  
**Taelia** _(happy)_: It does taste a bit like toothpaste. I love it.  

### Complete

#### <a id="nq09-complete"></a>Complete `nq09-complete`

**Taelia**: Your Nubbin was so brave about the cold. Let me make sure it never minds it again.  
_She wraps the end of her knitting once round your pet’s neck, then unwinds it. The scarf is gone. The warmth stays._  
**Taelia** _(soft)_: There. A scarf on the inside.  
_Stamina rises by one level._  

#### <a id="nq09-complete-nq-09-invited"></a>Variant `nq09-complete-nq-09-invited`

_Variant of `nq09-complete`._

**Taelia**: Your Nubbin was so brave about the cold. Let me make sure it never minds it again.  
_She wraps the end of her knitting once round your pet’s neck, then unwinds it. The scarf is gone. The warmth stays._  
**Taelia** _(soft)_: There. A scarf on the inside.  
**Taelia** _(soft)_: And Keeper. Next time, I might come into the Factory with you. Might.  
_Stamina rises by one level._  

**Rewards**

- Snow Faerie’s Blessing (item): One Stamina level for your Neo pet, applied at once. Kept in Neopia.

Sets on completion: `{"nq-09-done":true}`

**Notes:** Faerie Quest. Taelia uses the same speaker id and portrait as in NP3 (The Ski Lodge Mystery); either can come first. The Taelia flavour is a new Happy Valley ice cream item (food, small Stamina lean). Her knitting can be a prop that grows a little each time you visit.

## NQ10. Faerie Quest: The Fountain Faerie

*Neopets: Faerie Quests (the Fountain Faerie)* · audience: all · where: Faerieland, the dry fountain behind the Healing Springs · when: After the nine other Faerie Quests are done. Once, ever. · requires: NQ1, NQ2, NQ3, NQ4, NQ5, NQ6, NQ7, NQ8, NQ9

**Cast:** The Fountain Faerie (Fountain Faerie (Neopets))

### Step 1: Bring the Fountain Faerie a clear glass float from the Kiko Lake workshops.

Hint: The glassblowers work on the jetty at Kiko Lake. Ask for a float, not a bottle. · check: `give:item:kiko-glass-float:fountain-faerie`

#### <a id="nq10-ask"></a>Scene `nq10-ask`

_The fountain behind the Healing Springs has always been dry. Today water climbs out of it in a slow, glittering spiral._  
**The Fountain Faerie** _(happy)_: Nine of my sisters have been talking about you, Keeper. All nice things. It was exhausting.  
**The Fountain Faerie** _(think)_: I paint. One pet, one colour, once. But my fountain needs a float to catch the light first.  
**The Fountain Faerie**: The glassblowers on Kiko Lake make floats as clear as a held breath. Bring me one.  
**The Fountain Faerie** _(think)_: A float, mind. Not a bottle. The last Keeper brought a bottle with a message in it. It was a shopping list.  
_Your Nubbin leans over the rim. Its reflection is a slightly different colour every time the water moves._  

#### <a id="nq10-ask-done"></a>Done `nq10-ask-done`

_The float bobs onto the water. Light breaks through it and spreads into every colour at once._  
**The Fountain Faerie** _(soft)_: There they all are. Now we can choose.  

### Step 2: Choose one pet and one colour for the Fountain Faerie to paint.

Hint: Any classic colour is on offer. There is no clock; take as long as you like. · check: `paint:fountain-faerie:any`

#### <a id="nq10-choose"></a>Scene `nq10-choose`

**The Fountain Faerie**: Any pet you’ve brought. Any colour on the list, Baby to Zombie.  
**The Fountain Faerie** _(think)_: Most people choose in a hurry, then spend years wishing they’d picked Starry.  
**The Fountain Faerie** _(happy)_: Once, a Kau chose Invisible. We still don’t know where she is. Sometimes, on quiet nights, we hear mooing.  
_The colours turn slowly in the spray, waiting._  
_Your Nubbins line up along the rim, each one trying very hard to look like it deserves Rainbow._  
**The Fountain Faerie** _(happy)_: No pressure. Well. A little pressure. It is forever.  

**Choices**

- **Choose now, before you overthink it.**
    - **The Fountain Faerie**: Decisive. People who choose fast usually choose right. Usually.
- **Ask for time to think.** — sets `{"nq-10-pondered":true}`
    - **The Fountain Faerie**: Of course. Forever deserves a cup of tea first. The fountain will keep. So will I.
- **Let your Nubbin pick the colour.** — sets `{"nq-10-chooser":"nubbin"}`
    - Your Nubbin walks the length of the spray, ignores Rainbow, ignores Gold, and sits down happily under Brown.
    - **The Fountain Faerie**: Brown. Of all of them. I don’t think I’ve ever respected anyone more.

### Complete

#### <a id="nq10-complete"></a>Complete `nq10-complete`

_She cups the spray in both hands and pours it over your Neo pet, slowly, from ears to tail._  
_The colour sinks in like dye into cloth. It will never wash out._  
**The Fountain Faerie** _(soft)_: That colour is theirs now. It will never wash out, not in any weather.  
_Another of your Nubbins stands hopefully under the spray. Nothing happens. It sulks._  
**The Fountain Faerie** _(happy)_: Only once, little one. That’s what makes it special.  

#### <a id="nq10-complete-nq-10-pondered"></a>Variant `nq10-complete-nq-10-pondered`

_Variant of `nq10-complete`._

_She cups the spray in both hands and pours it over your Neo pet, slowly, from ears to tail._  
_The colour sinks in like dye into cloth. It will never wash out._  
**The Fountain Faerie** _(soft)_: You took your time over it. Good. The ones who think first never come back asking for a different colour.  
**The Fountain Faerie** _(soft)_: That colour is theirs now. It will never wash out, not in any weather.  
_Another of your Nubbins stands hopefully under the spray. Nothing happens. It sulks._  
**The Fountain Faerie** _(happy)_: Only once, little one. That’s what makes it special.  

**Rewards**

- The Fountain Faerie’s Paint Job (cosmetic): Your Neo pet painted any classic colour you choose, permanently. Mutant and Jelly are not on offer. Kept in Neopia.

Sets on completion: `{"nq-10-done":true}`

**Notes:** Faerie Quest, the capstone: offered only after NQ1–NQ9 (the brief: "one quest, once"). Step 2 opens the Rainbow Pool colour picker limited to the classic paint brush list (Baby … Zombie); only Neo pets are painted, never a Nubbin’s egg colour (canon 21). Choosing "Ask for time to think" closes the picker; the step stays open and the fountain stays on until a colour is picked. No timer. If `nq-10-chooser` = nubbin, the picker opens with Brown pre-selected; the player can still change it. Art: the spiral fountain, the float’s light splitting into a rainbow.

## NQ11. Illusen: The Borrowed Herbal

*Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)* · audience: all · where: Meridell, Illusen’s Glade · when: After your first visit to Meridell, while `neo-side-jhudora` is unset. Never offered once Jhudora’s side is taken.

**Cast:** Illusen (Illusen the Earth Faerie (Neopets))

### Step 1: Bring Illusen a copy of the Brightvale Herbal from the scroll shop in Brightvale.

Hint: Brightvale’s scroll shop is next to King Hagan’s castle. The Herbal is the fat green one. · check: `give:item:brightvale-herbal:illusen`

#### <a id="nq11-ask"></a>Scene `nq11-ask`

_Illusen’s Glade is quiet, green and slightly too tidy, as if someone has swept the moss._  
**Illusen** _(soft)_: Welcome, Keeper. Sit, if the toadstool will have you.  
**Illusen** _(sad)_: My herb beds are failing and I can’t remember why. The answer was in a book I lent away.  
**Illusen** _(angry)_: I lent it to a faerie who lives on a purple cloud. She says she never had it. She has it.  
**Illusen**: Brightvale keeps a copy of everything. Bring me their Herbal, and I may ask you for more.  
_Your Nubbin finds a patch of clover and lies down in it as if it has waited all its life to do so._  

**Choices**

- **Ask about the faerie on the cloud.**
    - **Illusen**: Jhudora. We were friends, once. Now we’re neighbours, which is worse.
    - **Illusen**: You should know: help one of us properly, and the other won’t forgive it.
- **Say you’ll fetch the book.**
    - **Illusen**: Thank you. Quietly, mind. Purple clouds have ears.

#### <a id="nq11-ask-done"></a>Done `nq11-ask-done`

_The Herbal is heavy, smells of dried lavender, and falls open at the page on wilting thyme._  
**Illusen** _(think)_: Oh. Of course. Too much shade. I planted the beds where I like to sit.  

### Complete

#### <a id="nq11-complete"></a>Complete `nq11-complete`

**Illusen** _(happy)_: You’ve done me a kindness, Keeper. In Meridell we remember kindness.  
_Far over the hills, a purple cloud darkens by one shade. You get the feeling it noticed._  
**Illusen** _(sad)_: That’s Jhudora sulking. Her door is closed to you now. I’m sorry. I did warn you.  
**Illusen** _(soft)_: Mine is open. Come back when you can. There’s more to mend.  

**Rewards**

- Illusen’s Friend (flag): You have taken Illusen’s side. Her chain continues (NQ12–NQ13); Jhudora’s chain (NQ14–NQ16) closes for good.

Sets on completion: `{"nq-11-done":true,"neo-side-illusen":true}`

**Notes:** Rival chain, part 1 of 3. Completing this quest sets `neo-side-illusen` and withdraws NQ14–NQ16 (even if NQ14 is in progress). The two chains are exclusive, so each side has its own key (`neo-side-illusen` here, `neo-side-jhudora` in NQ14) and no flag has two writers. Accepting it does not lock anything; only completion does. The warning in the "Ask about the faerie" choice must also show in the quest offer text. If the player visits Jhudora’s Cloud afterwards, play one line from her (speaker jhudora): "Oh, it’s you. Illusen’s little helper. The door’s that way. It’s also locked." No quest.

## NQ12. Illusen: A Sunnier Spot

*Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)* · audience: all · where: Meridell, Illusen’s Glade · when: Straight after NQ11, or any later visit. · requires: NQ11

**Cast:** Illusen (Illusen the Earth Faerie (Neopets))

### Step 1: Fetch a sack of black volcanic soil from the foot of Techo Mountain on Mystery Island.

Hint: The soil is free for the digging on Techo Mountain’s lower slopes. You carry the sack; your Nubbins supervise. · check: `give:item:volcanic-soil:illusen`

#### <a id="nq12-soil"></a>Scene `nq12-soil`

**Illusen**: The Herbal says herbs want sun and rich soil. I’ve got the sun now. The soil’s tired.  
**Illusen** _(think)_: Techo Mountain throws up the richest earth in Neopia, and nobody wants it because it’s black.  
**Illusen** _(think)_: Jhudora calls black soil “a bit much”. Jhudora lives on a purple cloud.  
**Illusen**: One sack, please. Not the hot bit at the top.  
_Your Nubbin looks at the size of the sack she is holding out, and quietly sits on its own feet._  
**Illusen** _(happy)_: Not you, little one. I meant the Keeper.  

#### <a id="nq12-soil-done"></a>Done `nq12-soil-done`

_You set the sack down. It is warm, and smells of rain on hot stones._  
**Illusen** _(happy)_: Oh, that’s good soil. You can practically hear it wanting to grow things.  
_Your Nubbin, who carried none of it, lies flat on its back as the most exhausted member of the party._  

### Step 2: Help Illusen dig the new herb beds and plant them out.

Hint: Place the three herb beds anywhere in the glade’s sunny meadow, then water each one. · check: `place:decor:illusen-herb-bed:3`

#### <a id="nq12-dig"></a>Scene `nq12-dig`

_Illusen rolls up her sleeves. Faerie or not, she digs like a farmer._  
_Within a minute one Nubbin has found a worm, named it, and introduced it to everyone._  
_Your Nubbins dig too, mostly in the wrong places, with tremendous enthusiasm._  
**Illusen** _(happy)_: Lovely. That hole can be a pond. Now, the beds.  
**Illusen** _(think)_: Where shall we put them? I’ve got two ideas and I like them both.  
**Illusen**: The meadow, where it’s sunny all day. Or by the stream, where it’s sunny most of the day and pretty all of it.  

**Choices**

- **The meadow. Sun is sun.** — sets `{"nq-12-beds":"meadow"}`
    - **Illusen**: Sensible. The thyme will thank you.
- **By the stream. Pretty counts.** — sets `{"nq-12-beds":"stream"}`
    - **Illusen**: I hoped you’d say that. I’ll sit by them and pretend I’m working.

### Complete

#### <a id="nq12-complete"></a>Complete `nq12-complete`

_By evening the beds are planted. Your Nubbins have soil up to their elbows and look extremely proud._  
**Illusen** _(happy)_: In a week this will smell like a kitchen. A good one.  
**Illusen**: Take a bed home with you. I’ve made a spare. I always make a spare.  
_Over the hills, the purple cloud rumbles once, then thinks better of it._  

**Rewards**

- Illusen’s Herb Bed (decor): A raised bed of thyme, sage and mint for your Neopia sandbox. Neo pets who nap beside it wake slightly calmer.

Sets on completion: `{"nq-12-done":true}`

**Notes:** Rival chain, part 2 (Illusen). Step 2 uses the decorate tool inside the glade; bed placement within the meadow or by the stream follows `nq-12-beds`. The volcanic soil is a one-off quest item, not added to shops.

## NQ13. Illusen: The Glade Wakes

*Neopets: Illusen’s Quests (Illusen’s Glade, Meridell)* · audience: all · where: Meridell, Illusen’s Glade · when: Your next visit to the glade after NQ12. · requires: NQ12

**Cast:** Illusen (Illusen the Earth Faerie (Neopets)), Jhudora (Jhudora the Dark Faerie (Neopets))

### Step 1: Keep the new herb beds covered while Jhudora’s storm passes over the glade.

Hint: Tap a bed when the hail warning shows over it to pull a leaf cover across. Every bed you save counts; you can’t fail outright. · check: `minigame:cover:glade-storm`

#### <a id="nq13-storm"></a>Scene `nq13-storm`

_The glade is green and buzzing. Then the light turns purple, and the bees go home early._  
**Jhudora**: Lovely little garden, Illusen. Shame about the weather.  
_A cloud the colour of a bruised plum settles over the meadow. It begins, very precisely, to hail._  
**Illusen** _(sad)_: She’s hailing in time to the music from her cloud. She always did have rhythm. I used to like that about her.  
**Illusen** _(shock)_: She’s aiming at the beds! Keeper, the leaf covers, quickly!  
_Your Nubbins scatter to the corners of the beds, each grabbing a leaf twice its size._  

**Choices**

- **Shout up at the cloud.** — sets `{"nq-13-shouted":true}`
    - **Jhudora**: I can’t hear you over the sound of my excellent hail.
    - You’re fairly sure she can.
- **Say nothing. Grab a leaf.**
    - **Illusen**: Good. Don’t give her the satisfaction.

#### <a id="nq13-storm-done"></a>Done `nq13-storm-done`

_The hail stops. The cloud drifts off, grumbling. Under the leaves, the herbs are fine._  
**Illusen** _(happy)_: She’ll be back. She’s always back. But not today.  

### Complete

#### <a id="nq13-complete"></a>Complete `nq13-complete`

_Illusen walks the length of the glade, touching each plant. Behind her, flowers open in a wave of green and gold._  
**Illusen** _(soft)_: There. Awake, all of it. It’s been years.  
**Illusen**: Take my colours to your sandbox, Keeper. Let it look a bit like Meridell.  
_She picks one sprig of mint, thinks, and drops it into a passing breeze heading for the purple cloud._  
**Illusen** _(think)_: She likes mint. She’d never admit it.  

#### <a id="nq13-complete-nq-13-shouted"></a>Variant `nq13-complete-nq-13-shouted`

_Variant of `nq13-complete`._

_Illusen walks the length of the glade, touching each plant. Behind her, flowers open in a wave of green and gold._  
**Illusen** _(soft)_: There. Awake, all of it. It’s been years.  
**Illusen**: Take my colours to your sandbox, Keeper. Let it look a bit like Meridell.  
_She picks one sprig of mint, thinks, and drops it into a passing breeze heading for the purple cloud._  
**Illusen** _(think)_: She heard you shout, you know. She’ll pretend she didn’t, for about a week.  
**Illusen** _(think)_: She likes mint. She’d never admit it.  

**Rewards**

- Illusen’s Colours (cosmetic): Your Neopia sandbox sections take on Illusen’s green and gold: fences, banners, path edging and lantern glass.
- Keeper of the Glade (title): Title for finishing Illusen’s chain.

Sets on completion: `{"nq-13-done":true,"neo-colours-illusen":true}`

**Notes:** Rival chain, final (Illusen). `neo-colours-illusen` is this chain’s own one-time colours unlock (Jhudora’s chain sets `neo-colours-jhudora`); only one can ever be set. Storm minigame: three beds, hail warnings appear over one bed at a time, a tap pulls a leaf cover; about 40 seconds, no fail state, score saved only for flavour. Jhudora appears as a voice and a cloud only. The colours reward is the brief’s "your choice sets which faerie’s colours appear in your sections"; make it a toggle in the decorate menu so the player can switch it off.

## NQ14. Jhudora: The Missing Usuki

*Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)* · audience: all · where: Faerieland, Jhudora’s Cloud · when: After your first visit to Faerieland, while `neo-side-illusen` is unset. Never offered once Illusen’s side is taken.

**Cast:** Jhudora (Jhudora the Dark Faerie (Neopets))

### Step 1: Bring Jhudora a Shadow Usuki doll from the Usuki shop in Neopia Central.

Hint: The Usuki shop is on the main street in Neopia Central. The Shadow one is on the top shelf, at the back. · check: `give:item:shadow-usuki:jhudora`

#### <a id="nq14-ask"></a>Scene `nq14-ask`

_Jhudora’s Cloud is purple, cold, and full of shelves. Every shelf is full of Usuki dolls, all facing the door._  
**Jhudora**: Don’t touch anything. Don’t breathe on anything. Do you want a job?  
**Jhudora** _(think)_: I have every Usuki ever made except one. The Shadow Usuki. It’s for research.  
**Jhudora** _(angry)_: I can’t go into a toy shop myself. People would talk. Illusen would talk.  
**Jhudora**: Last time I went in, the shopkeeper hid behind the plushies. I only wanted change for a Shell.  
_Your Nubbin stares up at four hundred tiny faces. Four hundred tiny faces stare back._  

**Choices**

- **Ask what kind of research.**
    - **Jhudora**: The kind where I finish my collection. Next question.
- **Ask about Illusen.**
    - **Jhudora**: The green one in the glade. Smug. Tidy. Borrows things and says she lent them.
    - **Jhudora**: Do this for me, and she won’t give you the time of day. Fair warning. I’m always fair.

#### <a id="nq14-ask-done"></a>Done `nq14-ask-done`

_You hand over the doll. Jhudora sets it in the last gap on the last shelf, and steps back._  
**Jhudora** _(soft)_: Complete. Do you know how long I’ve waited to say that?  
_Four hundred and one tiny faces now watch the door. Somehow this is worse._  

### Complete

#### <a id="nq14-complete"></a>Complete `nq14-complete`

**Jhudora**: You’re useful, Keeper. I don’t say that to many people. I don’t say it to anyone.  
_Far away over Meridell, a green glade goes very slightly quiet. You get the feeling it noticed._  
**Jhudora** _(happy)_: That’s Illusen being disappointed. She’s very good at it. Her glade’s closed to you now.  
**Jhudora**: Come back. I have bigger jobs, and you’ve passed the toy-shop test.  

**Rewards**

- Jhudora’s Ally (flag): You have taken Jhudora’s side. Her chain continues (NQ15–NQ16); Illusen’s chain (NQ11–NQ13) closes for good.

Sets on completion: `{"nq-14-done":true,"neo-side-jhudora":true}`

**Notes:** Rival chain, part 1 of 3. Completing this quest sets `neo-side-jhudora` and withdraws NQ11–NQ13 (even if NQ11 is in progress). Each side has its own key (see NQ11), so no flag has two writers. If the player visits Illusen’s Glade afterwards, play one line from her (speaker illusen): "Hello, Keeper. I hope she’s grateful. She won’t be, but I hope so." No quest. Art: the cloud interior with wall-to-wall Usuki shelves; one empty gap until this quest ends.

## NQ15. Jhudora: A Stone That Hums

*Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)* · audience: all · where: Faerieland, Jhudora’s Cloud · when: Straight after NQ14, or any later visit. · requires: NQ14

**Cast:** Jhudora (Jhudora the Dark Faerie (Neopets))

### Step 1: Bring Jhudora a humming stone from the ramparts of the Darigan Citadel.

Hint: The Citadel floats above Meridell. A guard at the gate will let you pick one loose stone from the rampart. · check: `give:item:citadel-stone:jhudora`

#### <a id="nq15-ask"></a>Scene `nq15-ask`

**Jhudora**: Next job. I’m building a storm lantern. It needs a heart.  
**Jhudora** _(think)_: The stones on the Darigan Citadel hum when it rains. The whole fortress sings like a kettle.  
**Jhudora**: Lord Darigan won’t miss one. Ask nicely. He likes nicely. It confuses him.  
**Jhudora**: Don’t mention Meridell. Don’t mention orbs. Don’t mention that I told you not to mention them.  
_While she talks, you notice a fat green book on her desk. The spine says: The Brightvale Herbal. Property of I._  
_Your Nubbin notices it too, and looks at you very hard._  

**Choices**

- **Point out Illusen’s book.** — sets `{"nq-15-book":"mentioned"}`
    - **Jhudora**: That? I’m keeping it safe. She’d only get mud on it.
    - She slides it into a drawer. She does not lock the drawer.
- **Say nothing about it.** — sets `{"nq-15-book":"unmentioned"}`
    - Jhudora catches you looking, and very slowly puts a teacup on top of it.

#### <a id="nq15-ask-done"></a>Done `nq15-ask-done`

_The stone is dark violet and buzzes faintly against your palm, like a cat deciding whether to purr._  
**Jhudora** _(happy)_: Perfect. Listen to it. It already knows it’s going to rain.  

### Complete

#### <a id="nq15-complete"></a>Complete `nq15-complete`

_Jhudora sets the stone inside a cage of black iron and taps the glass. The whole lantern starts to hum._  
**Jhudora**: One more job, Keeper. The big one. The Faerie Festival lanterns go up soon, and I intend to outshine them.  
**Jhudora**: Here. For being quiet about things you might have been loud about.  
_She hands you a small lantern, a copy of her own, and doesn’t look at you while she does it._  

**Rewards**

- Jhudora’s Storm Lantern (decor): An iron lantern with a humming violet stone for your Neopia sandbox. It glows brighter when rain is coming over Neopia.

Sets on completion: `{"nq-15-done":true}`

**Notes:** Rival chain, part 2 (Jhudora). The Herbal on her desk is the book Illusen asks about in NQ11, so both chains share one quiet thread; `nq-15-book` changes one line in NQ16. If `nq-15-book` = mentioned, replace nq15-complete#2 (0-based) with: l('jhudora', 'Here. For being loud about the right thing, and then dropping it.'). Lord Darigan does not appear; the Citadel guard is a background sprite. The Faerie Festival is named only as flavour, not as a calendar event.

## NQ16. Jhudora: The Purple Storm

*Neopets: Jhudora’s Quests (Jhudora’s Cloud, Faerieland)* · audience: all · where: Faerieland, Jhudora’s Cloud · when: Your next visit to Faerieland after NQ15. · requires: NQ15

**Cast:** Jhudora (Jhudora the Dark Faerie (Neopets)), Queen Fyora (Queen Fyora (Neopets))

### Step 1: Conduct Jhudora’s lightning show over Faerieland from the top of her cloud.

Hint: Trace each glowing path with your finger before it fades. Missed bolts just fizzle; you can’t fail. · check: `minigame:conduct:jhudora-storm`

#### <a id="nq16-show"></a>Scene `nq16-show`

_Night over Faerieland. Below, lanterns float up from Queen Fyora’s castle in neat golden rows._  
**Jhudora**: Pretty. Polite. Boring. Watch this.  
_Fyora’s lanterns rise in a pattern that spells WELCOME. Several are slightly crooked. Jhudora tuts at each one._  
_She hands you the storm lantern. It hums so hard your teeth buzz._  
**Jhudora** _(happy)_: You draw the bolts. I’ll do the thunder. Save the biggest one for the end.  
_Your Nubbin’s fur is standing straight up. It looks like a dandelion clock, and it is thrilled._  

**Choices**

- **Plan to aim the last bolt straight up, at the stars.** — sets `{"nq-16-last-bolt":"sky"}`
    - **Jhudora**: Showy. I approve.
- **Plan to aim it at Illusen’s glade. Just the rain, not the lightning.** — sets `{"nq-16-last-bolt":"glade"}`
    - **Jhudora**: Rain on her precious herbs. They’ll grow like mad and she’ll have to thank the weather.
    - **Jhudora**: Ha. Yes. Do that.

#### <a id="nq16-show-done"></a>Done `nq16-show-done`

_The last bolt splits the sky into purple branches. Every lantern in Faerieland flickers, then glows brighter._  
_Down on the castle balcony, a small figure in a crown is applauding._  

### Complete

#### <a id="nq16-complete"></a>Complete `nq16-complete`

**Queen Fyora** _(happy)_: Jhudora. That was the best Festival sky in a hundred years. You might have told me.  
**Jhudora**: If I’d told you, you’d have asked me to make it pink.  
**Queen Fyora** _(soft)_: I would. Thank your Keeper. I suspect they kept you from aiming at my roof.  
**Jhudora**: Fine. Keeper, take my colours. Let your sandbox look like it has a bit of nerve.  
_As you leave, you hear a drawer open behind you, and a green book being wrapped in brown paper._  

**Rewards**

- Jhudora’s Colours (cosmetic): Your Neopia sandbox sections take on Jhudora’s violet and black-green: fences, banners, path edging and lantern glass.
- Friend of the Cloud (title): Title for finishing Jhudora’s chain.

Sets on completion: `{"nq-16-done":true,"neo-colours-jhudora":true}`

**Notes:** Rival chain, final (Jhudora). `neo-colours-jhudora` is this chain’s own one-time colours unlock (Illusen’s chain sets `neo-colours-illusen`); only one can ever be set. Lightning minigame: 8–10 glowing paths to trace, slow and forgiving, no fail state. The last bolt points at the sky or the glade per `nq-16-last-bolt`. Closing line changes if `nq-15-book` = unmentioned: replace the last narration with "As you leave, a drawer opens behind you. You don’t look back." Colours reward works like NQ13’s (a decorate-menu toggle). Queen Fyora appears only here in the faerie quests.

## NQ17. Kitchen Quest: A Cheese With Momentum

*Neopets: Kitchen Quests (Mystery Island)* · audience: all · where: Mystery Island, the Kitchen by the Tombola · when: After your first visit to Mystery Island.

**Cast:** The Island Chef (The Kitchen Quest chef (Neopets, Mystery Island))

### Step 1: Bring the Island Chef a whole round cheese from the Meridell Cheeseroller.

Hint: The Cheeseroller hill is outside the Meridell village. Finish one roll and keep the cheese. · check: `give:item:cheeseroller-cheese:island-chef`

#### <a id="nq17-ask"></a>Scene `nq17-ask`

_The Kitchen is a hut with no front wall and four pots on the boil. The chef is stirring all four at once._  
**The Island Chef** _(happy)_: Keeper! You have hands. Excellent. I have five recipes and no ingredients.  
**The Island Chef** _(think)_: First: a cheese that’s been rolled down a hill in Meridell. It makes the inside go creamy.  
**The Island Chef**: Don’t ask me how I know. A Meridellian told me. They don’t lie about cheese.  
**The Island Chef** _(think)_: Do all five and I’ll tell you my name. Nobody on this island knows my name. It drives them wild.  
_Your Nubbin is hanging over the edge of a pot, breathing in steam with its eyes shut._  

**Choices**

- **Ask whether rolling really changes the cheese.**
    - **The Island Chef**: Probably not. But it changes the cook, and the cook makes the cheese taste better.
- **Ask what the other four recipes are.**
    - **The Island Chef**: One at a time. If I tell you all five, you’ll want to start with the jelly. Everyone does.

#### <a id="nq17-ask-done"></a>Done `nq17-ask-done`

_The cheese is round, dented, and has a few blades of grass pressed into the rind._  
**The Island Chef** _(happy)_: Look at that. Battle scars. That’s a cheese that’s lived.  
_You don’t mention that your Nubbin rode it most of the way down the hill. Some secrets belong to the cheese._  

### Complete

#### <a id="nq17-complete"></a>Complete `nq17-complete`

_The chef grates the cheese onto coconut bread and slides it under a hot stone. It bubbles and browns._  
**The Island Chef**: Cheese and coconut toast. Try it before your Nubbin does. That’s advice, not an order.  
_Your Nubbin has already tried it. It is lying on its back, chewing slowly._  
**The Island Chef** _(happy)_: Take the page. Cook it at home. Tell nobody it was this easy.  

**Rewards**

- Cookbook Page: Cheese and Coconut Toast (item): A Neopia kitchen recipe: cheese plus coconut makes a toast that fills a Neo pet up well and leans slightly towards Power.

Sets on completion: `{"nq-17-done":true}`

**Notes:** Kitchen Quest 1 of 5. The chef is a role name (no named NPC in the brief). Cookbook pages are kept in the Neopia save and unlock the recipe in the Neopia kitchen; the Grove is never changed.

## NQ18. Kitchen Quest: Jam From the Stone Age

*Neopets: Kitchen Quests (Mystery Island)* · audience: all · where: Mystery Island, the Kitchen · when: After NQ17. · requires: NQ17

**Cast:** The Island Chef (The Kitchen Quest chef (Neopets, Mystery Island))

### Step 1: Bring the Island Chef a jar of lava-berry jam from the Tyrannian Town market.

Hint: The jam stall is in Tyrannia’s town, under the big stone awning. It comes in a clay jar. · check: `give:item:lava-berry-jam:island-chef`

#### <a id="nq18-ask"></a>Scene `nq18-ask`

**The Island Chef**: Second recipe. Pancakes. But pancakes need something on top, or they’re just flat apologies.  
_A stack of pancakes is already waiting “just in case”. It is taller than your Nubbin, and leaning._  
**The Island Chef** _(think)_: The Tyrannians make a jam from lava-berries. It’s sweet, then hot, then sweet again.  
**The Island Chef**: Get it in a clay jar. Glass ones crack. Don’t ask me how I know that either.  
_Your Nubbin licks its lips, then remembers the word “hot” and looks less certain._  
**The Island Chef** _(happy)_: It’s not that hot. It’s friendly hot. Mostly.  

**Choices**

- **Ask exactly how hot “friendly hot” is.**
    - **The Island Chef**: Friendly like a big dog. Means well. Knocks you over. Licks your face while you’re down.
- **Offer to bring it in a glass jar, so you can see it.** — sets `{"nq-18-glass":true}`
    - **The Island Chef**: Clay. CLAY. Glass cracks. I lost an eyebrow finding that out. It grew back sulky.

#### <a id="nq18-ask-done"></a>Done `nq18-ask-done`

_The jam is dark red and the jar is warm, though it has been in your bag all day._  
**The Island Chef** _(happy)_: Still warm? That’s the good stuff. The jam keeps its own fire.  

### Complete

#### <a id="nq18-complete"></a>Complete `nq18-complete`

_Pancakes hit the pan. Jam goes on in a slow red spiral._  
**The Island Chef**: Small bite first. Then wait. Then decide whether you’re brave.  
_Your Nubbin takes a small bite. Its ears go pink, then red, then back to normal. It holds out its paw for more._  
**The Island Chef** _(happy)_: A brave one. I knew it. Take the page.  

#### <a id="nq18-complete-nq-18-glass"></a>Variant `nq18-complete-nq-18-glass`

_Variant of `nq18-complete`._

_Pancakes hit the pan. Jam goes on in a slow red spiral._  
**The Island Chef**: Small bite first. Then wait. Then decide whether you’re brave.  
_Your Nubbin takes a small bite. Its ears go pink, then red, then back to normal. It holds out its paw for more._  
**The Island Chef** _(happy)_: A brave one. I knew it. And the jam came in clay, so my eyebrows stay. Take the page.  

**Rewards**

- Cookbook Page: Lava-berry Pancakes (item): A Neopia kitchen recipe: pancakes with lava-berry jam. Good for a hungry Neo pet, with a small lean towards Run.

Sets on completion: `{"nq-18-done":true}`

**Notes:** Kitchen Quest 2 of 5. Lava-berry jam is a new Tyrannian food item; "hot" is flavour only, no damage or sickness. `nq-18-glass` changes the chef’s last complete line (NEOPIA_QUESTS_VARIANTS); the jam always comes in clay.

## NQ19. Kitchen Quest: Kelp, Fresh

*Neopets: Kitchen Quests (Mystery Island)* · audience: all · where: Mystery Island, the Kitchen · when: After NQ18. · requires: NQ18

**Cast:** The Island Chef (The Kitchen Quest chef (Neopets, Mystery Island))

### Step 1: Bring the Island Chef a bundle of fresh sea kelp from Maraqua.

Hint: A Swim Nubbin can pick kelp in Maraqua, or buy a bundle from the stall outside King Kelpbeard’s palace. · check: `give:item:maraquan-kelp:island-chef`

#### <a id="nq19-ask"></a>Scene `nq19-ask`

**The Island Chef** _(happy)_: Third recipe. Crisps. Not potato. Kelp.  
_A bowl of last week’s kelp sits in the corner. It smells, exactly as promised, like a boot._  
**The Island Chef**: Kelp from Maraqua. Fresh. If it doesn’t still smell like the sea, it smells like a boot.  
**The Island Chef**: Bring it back wet. I’ll do the rest.  
_Your Nubbin wrinkles its nose. It has met a boot before._  
**The Island Chef** _(think)_: Swimmer or shopper, I don’t mind. Just make it squeak.  

**Choices**

- **Say a Swim Nubbin will pick it.** — sets `{"nq-19-picked":true}`
    - **The Island Chef**: Even better. Kelp tastes happier when it’s picked by someone who likes swimming.
- **Say you’ll buy it from the palace stall.**
    - **The Island Chef**: Fine, fine. Squeeze it before you pay. It should squeak.

#### <a id="nq19-ask-done"></a>Done `nq19-ask-done`

_The kelp drips on the chef’s floor. It squeaks when you squeeze it._  
**The Island Chef** _(happy)_: Squeaky. Perfect. You learn fast.  

### Complete

#### <a id="nq19-complete"></a>Complete `nq19-complete`

_The chef slices the kelp thin, salts it, and lays it on a hot stone. It curls up into green ribbons that crackle._  
**The Island Chef**: Sea kelp crisps. Salty, crunchy, and somehow good for you. Don’t tell the children that part.  
_Your Nubbin eats one, then another, then is found later asleep in the empty bowl._  
**The Island Chef** _(happy)_: The page is yours. Three down.  

#### <a id="nq19-complete-nq-19-picked"></a>Variant `nq19-complete-nq-19-picked`

_Variant of `nq19-complete`._

_The chef slices the kelp thin, salts it, and lays it on a hot stone. It curls up into green ribbons that crackle._  
**The Island Chef** _(happy)_: Picked by a swimmer. You can taste it: happier kelp.  
**The Island Chef**: Sea kelp crisps. Salty, crunchy, and somehow good for you. Don’t tell the children that part.  
_Your Nubbin eats one, then another, then is found later asleep in the empty bowl._  
**The Island Chef** _(happy)_: The page is yours. Three down.  

**Rewards**

- Cookbook Page: Sea Kelp Crisps (item): A Neopia kitchen recipe: crisp kelp snacks. A small fill for a Neo pet, with a lean towards Swim.

Sets on completion: `{"nq-19-done":true}`

**Notes:** Kitchen Quest 3 of 5. The stall route exists so a Keeper without a Swim Nubbin can finish it (Maraqua is Swim-only past the palace).

## NQ20. Kitchen Quest: Gravy in a Tube

*Neopets: Kitchen Quests (Mystery Island)* · audience: all · where: Mystery Island, the Kitchen · when: After NQ19. · requires: NQ19

**Cast:** The Island Chef (The Kitchen Quest chef (Neopets, Mystery Island))

### Step 1: Bring the Island Chef a tube of gravy from Grundo’s Café on the Virtupets Space Station.

Hint: Grundo’s Café is on the Space Station’s food deck. The gravy comes in a silver tube. · check: `give:item:space-gravy-tube:island-chef`

#### <a id="nq20-ask"></a>Scene `nq20-ask`

**The Island Chef** _(think)_: Fourth recipe. I’m nervous about this one.  
**The Island Chef**: The Grundos on the Space Station sell gravy in a tube. You squeeze it, like toothpaste.  
**The Island Chef**: I have to know if it’s brilliant or a crime. Possibly both.  
**The Island Chef** _(happy)_: If anyone asks, it’s research. Gravity research. Gravy-ty. …I’ve been waiting all week to say that.  
_Your Nubbin mimes squeezing a tube, then looks at its empty paws, disappointed._  
**The Island Chef**: One tube. If it’s a crime, it’s a small one.  

**Choices**

- **Say it’s probably a crime.**
    - **The Island Chef**: Then we’ll be criminals together. Bring two.
- **Say the Grundos know what they’re doing.**
    - **The Island Chef**: They live in space and they’re still cheerful. I trust them with gravy.

#### <a id="nq20-ask-done"></a>Done `nq20-ask-done`

_The tube is silver and cold. The label says Gravy, Brown, Excellent._  
**The Island Chef** _(happy)_: Confident labelling. That’s a good sign.  

### Complete

#### <a id="nq20-complete"></a>Complete `nq20-complete`

_The chef mashes island yams, makes a well in the middle, and squeezes the whole tube in. It comes out in a perfect spiral._  
**The Island Chef** _(think)_: Moon gravy mash. Verdict…  
**The Island Chef** _(happy)_: Brilliant. Also a crime. I’m putting it on the menu.  
_Your Nubbin licks the spoon, the bowl, and then, thoughtfully, the tube._  

**Rewards**

- Cookbook Page: Moon Gravy Mash (item): A Neopia kitchen recipe: yam mash with space gravy. Very filling for a Neo pet, with a lean towards Stamina.

Sets on completion: `{"nq-20-done":true}`

**Notes:** Kitchen Quest 4 of 5. The Space Station is open before NP13; nothing here touches the Sloth plot.

## NQ21. Kitchen Quest: The Jelly Question

*Neopets: Kitchen Quests (Mystery Island)* · audience: all · where: Mystery Island, the Kitchen · when: After NQ20. · requires: NQ20

**Cast:** The Island Chef (The Kitchen Quest chef (Neopets, Mystery Island))

### Step 1: Bring the Island Chef a jelly. Any colour, but green would be the dream.

Hint: The Food Shop in Neopia Central sells common jellies. Green ones are rare; some say they come from Jelly World. · check: `give:item:jelly:island-chef`

#### <a id="nq21-ask"></a>Scene `nq21-ask`

**The Island Chef** _(happy)_: Last recipe. The big one. Trifle.  
**The Island Chef**: Layer one, cake. Layer two, fruit. Layer three, jelly. Layer four, I’ll tell you when you’re older.  
**The Island Chef** _(sad)_: Green jelly comes from Jelly World. Jelly World doesn’t exist. You can see my problem.  
**The Island Chef** _(soft)_: Any jelly will do. But a green jelly…  
**The Island Chef**: A green jelly would make me weep. In a good way.  
_Your Nubbin, who has heard the word jelly, is now vibrating gently._  

**Choices**

- **Promise to try for a green one.**
    - **The Island Chef**: Don’t promise. Promises about jelly are too much pressure.
- **Say you’ll bring whatever you find.**
    - **The Island Chef**: The honest answer. Good. Every jelly is a good jelly.

#### <a id="nq21-ask-done"></a>Done `nq21-ask-done`

_You set the jelly down. It wobbles, takes a while to stop, and sits there gleaming._  
_Your Nubbin has to be held back by the tail. It has waited five recipes for this._  
**The Island Chef** _(happy)_: Look at it go. Right. Stand back. This is the good bit.  

### Complete

#### <a id="nq21-complete"></a>Complete `nq21-complete`

_Cake. Fruit. Jelly. Then a fourth layer, golden and secret, poured from a jug the chef shields with one arm._  
**The Island Chef** _(soft)_: Five recipes. You fetched every one. Nobody’s ever done the whole set.  
_Your Nubbins sit in a row with spoons. Nobody told them to. They just knew._  
**The Island Chef** _(happy)_: Take the last page. And come and cook with me sometime. You’ve earned the good apron.  
**The Island Chef** _(happy)_: Oh, and my name, as promised. It’s Chef. My parents had very high hopes.  

**Rewards**

- Cookbook Page: Island Trifle (item): A Neopia kitchen recipe: a four-layer trifle that feeds every Neo pet at the table at once.

Sets on completion: `{"nq-21-done":true}`

**Notes:** Kitchen Quest 5 of 5, the last. Any jelly item passes the check. If the jelly is green, swap the chef’s done line for: "Green. It’s green. Give me a moment." (mood soft) and set `nq-21-green: true`. The fourth layer stays secret; do not name it anywhere in the UI.

## NQ22. Edna’s Quest: Wart Wanted

*Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)* · audience: main · where: Haunted Woods, Edna’s Tower · when: After your first visit to the Haunted Woods.

**Cast:** Edna (Edna the witch (Neopets, Haunted Woods))

### Step 1: Bring Edna a Mortog wart from the pond at Kiss the Mortog, in Meridell.

Hint: The Mortogs by the Meridell pond shed their warts in the reeds. Look, don’t kiss. Or kiss. Your call. · check: `give:item:mortog-wart:edna`

#### <a id="nq22-ask"></a>Scene `nq22-ask`

_Edna’s Tower leans like it’s had a long night. Inside, a cauldron burps green steam at the ceiling._  
**Edna** _(think)_: A customer. Or an ingredient. Which are you?  
_Shelves line the walls: EYES (GLASS), EYES (NOT GLASS), and one jar labelled simply MONDAYS._  
**Edna**: Customer, then. Pity. I need a Mortog wart. Fresh. Still a bit warm, ideally.  
**Edna**: There’s a pond in Meridell where idiots kiss Mortogs hoping for royalty. The warts come off in the excitement.  
_Your Nubbin edges behind your leg, as far from the cauldron as the room allows._  

**Choices**

- **Ask whether kissing one actually works.**
    - **Edna**: Once, in my lifetime. He was a terrible prince. Went straight back to the pond.
- **Ask her to confirm she said “still warm”.**
    - **Edna**: I did. Write it down if your memory’s going. I’ve a potion for that too, later.

#### <a id="nq22-ask-done"></a>Done `nq22-ask-done`

_You drop the wart into her palm. She sniffs it like a wine expert._  
**Edna** _(happy)_: Pond-fresh. Faint whiff of disappointment. Lovely.  

### Complete

#### <a id="nq22-complete"></a>Complete `nq22-complete`

_The wart goes in. The cauldron goes bright yellow and makes a noise like a rooster with a cold._  
**Edna**: Potion of Wide Awake. One sip and a sleeping pet sits bolt upright, ready for anything.  
**Edna**: Don’t drink it yourself. You’d be awake till Thursday. Every Thursday.  
_She corks it with her teeth and hands it over._  

**Rewards**

- Potion of Wide Awake (item): Single use. Wakes a sleeping Neo pet at once, fully rested, without any grumpiness. Kept in Neopia.

Sets on completion: `{"nq-22-done":true}`

**Notes:** Edna’s Quest 1 of 5. Audience main: kept out of the Learning Grove with the rest of the darker Haunted Woods content. Crude-ish humour is fine; keep it dry, not gross-out.

## NQ23. Edna’s Quest: Something Dry

*Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)* · audience: main · where: Haunted Woods, Edna’s Tower · when: After NQ22. · requires: NQ22

**Cast:** Edna (Edna the witch (Neopets, Haunted Woods))

### Step 1: Bring Edna a strip of old linen bandage from the Deserted Tomb in the Lost Desert.

Hint: Run the Deserted Tomb once; the bandage is on the first sarcophagus. Mind the traps. · check: `give:item:tomb-bandage:edna`

#### <a id="nq23-ask"></a>Scene `nq23-ask`

**Edna**: Next. I need the driest thing in Neopia.  
**Edna** _(think)_: Not sand. Sand is showing off. Bandage. From a tomb in the Lost Desert. Three thousand years in the dark.  
**Edna**: Whoever was wearing it won’t mind. They stopped minding things a long time ago.  
**Edna**: Keep it dry. If it gets wet it’s just a bandage, and I can get those from the chemist.  
_She blows dust off a jar labelled DRY THINGS. It is empty except for one very old raisin._  
_Your Nubbin looks at you as if to ask whether this is what you do all day now._  

**Choices**

- **Ask who was wearing it.**
    - **Edna**: Some minor king. Ruled for a fortnight. Choked on a date. Desert politics.
- **Ask whether it’s cursed.** — sets `{"nq-23-asked-curse":true}`
    - **Edna**: Probably. Everything in a tomb is. That’s just how they say hello.

#### <a id="nq23-ask-done"></a>Done `nq23-ask-done`

_The bandage crackles like an old letter. A little cloud of dust puffs out when she unrolls it._  
**Edna** _(happy)_: Oh, that’s dry. That’s philosophically dry.  

### Complete

#### <a id="nq23-complete"></a>Complete `nq23-complete`

_She crumbles the bandage into the cauldron. The steam turns pale gold and smells, oddly, of warm toast._  
**Edna**: Bandage Balm. Rub it on a pet that’s bruised or chilled, and it’s right as rain.  
**Edna**: Ironic, given the ingredient. I do like irony. It’s cheaper than salt.  
_The jar is warm in your hand, and stays warm._  

#### <a id="nq23-complete-nq-23-asked-curse"></a>Variant `nq23-complete-nq-23-asked-curse`

_Variant of `nq23-complete`._

_She crumbles the bandage into the cauldron. The steam turns pale gold and smells, oddly, of warm toast._  
**Edna**: Bandage Balm. Rub it on a pet that’s bruised or chilled, and it’s right as rain.  
**Edna**: Ironic, given the ingredient. I do like irony. It’s cheaper than salt.  
**Edna** _(think)_: Cursed? Mildly. It wears off by Thursday. Everything does, round here.  
_The jar is warm in your hand, and stays warm._  

**Rewards**

- Bandage Balm (item): Single use. Cures a Neo pet bruised in the Battledome or chilled by the Snowager, instantly. Kept in Neopia.

Sets on completion: `{"nq-23-done":true}`

**Notes:** Edna’s Quest 2 of 5. The Deserted Tomb is a once-per-visit freebie; the bandage is guaranteed on the first run after this quest starts.

## NQ24. Edna’s Quest: Pepper for the Cauldron

*Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)* · audience: main · where: Haunted Woods, Edna’s Tower · when: After NQ23. · requires: NQ23

**Cast:** Edna (Edna the witch (Neopets, Haunted Woods))

### Step 1: Bring Edna a bottle of pirate pepper sauce from the Golden Dubloon on Krawk Island.

Hint: The Golden Dubloon is the pirate restaurant on Krawk Island. Ask the kitchen for the house pepper sauce. · check: `give:item:dubloon-pepper-sauce:edna`

#### <a id="nq24-ask"></a>Scene `nq24-ask`

**Edna**: This one needs nerve. Bottled nerve. The pirates on Krawk Island call it pepper sauce.  
**Edna** _(think)_: It’s mostly peppers, partly sea salt, and a little bit of whatever fell in.  
**Edna** _(think)_: If a pirate asks what it’s for, say it’s for a lady’s cough. They’ll understand. They all have the cough.  
**Edna**: Get the house bottle from the Golden Dubloon. Not the cheap one. The cheap one’s the same, but sadder.  
_She hands you an empty bottle to fill. It still smells of the last lot._  
_Your Nubbin sniffs the bottle and sneezes so hard it sits down._  

**Choices**

- **Ask whether you’re allowed a taste on the way back.** — sets `{"nq-24-tasted":true}`
    - **Edna**: One drop. Then you’ll understand why it’s only one.
- **Ask what the nerve is for.**
    - **Edna**: For pets who flinch. A fighter who flinches is a fighter who loses. And cries. I hate the crying.

#### <a id="nq24-ask-done"></a>Done `nq24-ask-done`

_Edna pulls the cork, tries one drop, and stares into the middle distance while her ears go red._  
**Edna** _(shock)_: Yes. That’s the stuff. I can hear the sea. I’m nowhere near the sea.  

### Complete

#### <a id="nq24-complete"></a>Complete `nq24-complete`

_Most of the bottle goes into the cauldron, and one spoonful into Edna, for her cough. Both of them start to glow._  
**Edna**: Potion of Steady Nerve. One dose before a Battledome bout, and your Neo pet won’t flinch at anything.  
**Edna** _(happy)_: Not even me singing, and I’m about to sing.  
_She sings. It is a sea shanty she seems to be making up as she goes. You leave during the fourth verse._  

**Rewards**

- Potion of Steady Nerve (item): Single use. Before one Battledome bout, a nervous or timid Neo pet fights at full confidence. Kept in Neopia.

Sets on completion: `{"nq-24-done":true}`

**Notes:** Edna’s Quest 3 of 5. Audience main (Haunted Woods, kept out of the Learning Grove). The grog was swapped for pirate pepper sauce, so nothing here is boozy; the potion is just a Battledome buff for a Neo pet. If `nq-24-tasted`, the Keeper portrait goes red and fans its mouth once on the walk back (cosmetic only, a few seconds). Edna’s song is hummed/garbled audio, no lyrics.

## NQ25. Edna’s Quest: Ink From the Wise

*Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)* · audience: main · where: Haunted Woods, Edna’s Tower · when: After NQ24. · requires: NQ24

**Cast:** Edna (Edna the witch (Neopets, Haunted Woods))

### Step 1: Bring Edna a pot of ink from the Wise Old King’s inkwell in Brightvale.

Hint: The Wise Old King sits in Brightvale castle. Make him laugh or nod at his phrase game and he’ll part with a pot. · check: `give:item:wise-kings-ink:edna`

#### <a id="nq25-ask"></a>Scene `nq25-ask`

**Edna**: I want ink that’s written down something clever. There’s only one inkwell in Neopia that qualifies.  
**Edna** _(think)_: The Wise Old King in Brightvale. Ancient, vain, and slow. Flatter him and he’ll give you a pot.  
**Edna**: Don’t tell him it’s for me. We had a disagreement in about the year I was pretty.  
_Edna’s own inkwell is bone dry. A quill stands in it like a flag on a lost battlefield._  
_Your Nubbin looks at Edna, tries to imagine that year, and gives up._  
**Edna** _(angry)_: I saw that, small thing. I was a looker. Ask anyone over three hundred.  

**Choices**

- **Ask what the disagreement was.**
    - **Edna**: He said a witch couldn’t read. I turned his crown into a hat stand. Things escalated.
- **Ask how best to flatter him.**
    - **Edna**: Agree with him slowly, as if you’ve just understood something deep. Works on most men.

#### <a id="nq25-ask-done"></a>Done `nq25-ask-done`

_The ink is so dark it seems to have a bottom far below the bottom of the pot._  
**Edna** _(happy)_: Did he ask who it was for? He did. And you lied. Good Keeper.  

### Complete

#### <a id="nq25-complete"></a>Complete `nq25-complete`

_One drop of ink turns the whole cauldron black. Then words float up through it, too fast to read._  
**Edna**: Draught of Good Sense. A pet who drinks it learns its next lesson twice over.  
**Edna** _(think)_: It won’t make them wise. Nothing makes anyone wise. Ask the king.  
_She pours it into a tiny bottle shaped like an owl. The owl looks smug._  

**Rewards**

- Draught of Good Sense (item): Single use. The next training session or book a Neo pet takes gives double the stat points. Kept in Neopia.

Sets on completion: `{"nq-25-done":true}`

**Notes:** Edna’s Quest 4 of 5. Getting the ink uses the Wise Old King phrase-builder minigame once (any result that makes him nod counts).

## NQ26. Edna’s Quest: Edna’s Own Brew

*Neopets: Edna’s Quests (Edna’s Tower, Haunted Woods)* · audience: main · where: Haunted Woods, Edna’s Tower · when: After NQ25. · requires: NQ25

**Cast:** Edna (Edna the witch (Neopets, Haunted Woods))

### Step 1: Bring Edna a cobweb from the great hall of Eliv Thade’s castle.

Hint: Eliv Thade’s castle is deep in the Haunted Woods. The cobweb hangs from the chandelier; a Fly Nubbin can reach it. · check: `give:item:thade-cobweb:edna`

#### <a id="nq26-ask"></a>Scene `nq26-ask`

**Edna**: Last one. My own brew. My mother’s recipe, and her mother’s, and so on back to a frog.  
**Edna** _(think)_: It needs one cobweb from Eliv Thade’s castle. He never dusts. He’s too busy being clever at people.  
**Edna**: If he sets you a riddle, the answer is usually “a candle”. He’s very fond of candles.  
_Five ingredients are chalked on the cauldron: WART, BANDAGE, PEPPER, INK. The fifth is a drawing of a spider, scowling._  
_Your Nubbin, unasked, has begun practising looking brave in the reflection of the cauldron._  
**Edna** _(happy)_: Bring it back in one piece. The web, I mean. You too, ideally.  

#### <a id="nq26-ask-done"></a>Done `nq26-ask-done`

_The cobweb is huge, silver and perfectly intact. You carried it like a wedding veil the whole way._  
**Edna** _(happy)_: Not a strand broken. Even Thade would be impressed, and he’s impressed by nothing.  

### Complete

#### <a id="nq26-complete"></a>Complete `nq26-complete`

_Wart, bandage, pepper sauce, ink and web all go in, in that order. The cauldron goes still and silent._  
**Edna**: Edna’s Own. One spoonful paints a pet in the Haunted Woods’ favourite colours.  
**Edna**: Ghost, Zombie or Halloween. Choose when you pour, not before. It likes a surprise.  
**Edna** _(happy)_: And now, a taste for the Keeper who fetched it all. Tradition.  

**Choices**

- **Take a polite sip.** — sets `{"nq-26-sipped":true}`
    - Your hair turns green for exactly as long as it takes Edna to stop laughing.
    - **Edna**: Tradition!
- **Decline, very politely.**
    - **Edna**: Clever. There’s no tradition. I just wanted to see your hair go green.

**Rewards**

- Edna’s Own Brew (item): Single use. Paints one Neo pet Ghost, Zombie or Halloween, chosen when you use it. Permanent. Kept in Neopia.

Sets on completion: `{"nq-26-done":true}`

**Notes:** Edna’s Quest 5 of 5, the last. Eliv Thade appears only as a riddle prompt at the castle door (reuse the castle’s riddle UI if it exists; otherwise skip the riddle). If `nq-26-sipped`, the Keeper’s portrait has green hair for the rest of the scene.

## NQ27. The Brain Tree’s Two Memories

*Neopets: the Brain Tree (Haunted Woods)* · audience: all · where: Haunted Woods, the Brain Tree’s clearing · when: After your first visit to the Haunted Woods. Once.

**Cast:** The Times Reporter (A weary Neopian Times reporter (original)), The Brain Tree (The Brain Tree (Neopets)), The Wise Old King (The Wise Old King (Neopets, Brightvale)), Queen Fyora (Queen Fyora (Neopets))

### Step 1: Ask the Wise Old King in Brightvale what year the Brain Tree first took root.

Hint: The Wise Old King holds court in Brightvale castle. He likes visitors who wait for him to finish. · check: `talk:wise-old-king:brain-tree`

#### <a id="nq27-ask"></a>Scene `nq27-ask`

_The Brain Tree is enormous and grey, with bark folded like the inside of a walnut. Its branches creak as you approach._  
_Its roots are scratched with sums. Someone has corrected one in pencil. The tree has corrected it back._  
**The Brain Tree**: A visitor. Good. I need help, and I am too large to fetch it.  
**The Brain Tree** _(sad)_: I have known everything for a very long time. Two things I have forgotten. It is unbearable.  
**The Brain Tree**: First: the year I took root. The Wise Old King was a boy when it happened. He may remember.  
_Your Nubbin sits on a root, and the root sighs, like someone getting comfortable in an armchair._  

**Choices**

- **Ask whether he could just guess.**
    - **The Brain Tree**: A tree that guesses is just a bush with opinions.
- **Say you’re sorry he forgot.** — sets `{"nq-27-kind":true}`
    - **The Brain Tree**: Thank you. Nobody ever asks a tree how it feels.

#### <a id="nq27-ask-done"></a>Done `nq27-ask-done`

**The Wise Old King** _(think)_: The Brain Tree? Planted in the year of the long winter. I was seven. I sat on it. It complained.  
**The Wise Old King**: Tell it the long winter. It will know the rest.  

### Step 2: Ask Queen Fyora whose initials are carved into the Brain Tree’s bark.

Hint: Queen Fyora receives visitors in her castle in Faerieland. · check: `talk:fyora:brain-tree`

#### <a id="nq27-carving"></a>Scene `nq27-carving`

**The Brain Tree** _(happy)_: The long winter. Yes. It comes back, like a smell. Thank you.  
**The Brain Tree**: Second. Someone carved two letters into my bark, long ago. A J and an I, inside a little star.  
**The Brain Tree** _(think)_: I cannot remember who. The queen of the faeries knows everyone who was young back then.  
**The Brain Tree** _(sad)_: I know the population of Brightvale to the last Kacheek. I do not know who carved me. It is humiliating.  
_You find the carving low on the trunk, half-healed: J + I, inside a lopsided star._  
_Your Nubbin traces the star with one claw. The bark shivers, as if it tickles._  

#### <a id="nq27-carving-done"></a>Done `nq27-carving-done`

**Queen Fyora** _(soft)_: J and I. Oh, those two. Jhudora and Illusen, when they were small and inseparable.  
**Queen Fyora**: They used to argue under that tree about whose turn it was to win. Tell it gently. They’ve forgotten too.  

### Complete

#### <a id="nq27-complete"></a>Complete `nq27-complete`

_You tell the Brain Tree both memories. Its branches go still, the way a person goes still when a song they knew comes on._  
**The Brain Tree** _(soft)_: The long winter. Two small faeries and a knife they weren’t allowed. Yes. All of it.  
**The Brain Tree**: I am whole again. Take this. Plant it somewhere you do your thinking.  
_Far away, on a purple cloud, a sprig of mint lands on a windowsill. Nobody admits to sending it._  
_Far away, in a glade, a book appears on a doorstep in brown paper. It is overdue by about two hundred years._  
_An acorn drops into your hand. It is grey, folded like a walnut, and very slightly warm._  
**The Times Reporter**: Name? And the tree’s name? Never mind. Keeper, and unnamed associate.  
_The Brain Tree reads his notes over his shoulder and rustles, offended._  

#### <a id="nq27-complete-nq-27-kind"></a>Variant `nq27-complete-nq-27-kind`

_Variant of `nq27-complete`._

_You tell the Brain Tree both memories. Its branches go still, the way a person goes still when a song they knew comes on._  
**The Brain Tree** _(soft)_: The long winter. Two small faeries and a knife they weren’t allowed. Yes. All of it.  
**The Brain Tree** _(soft)_: I am whole again. You asked how a tree feels, earlier. Nobody does. Take this, and ask it now and then.  
_Far away, on a purple cloud, a sprig of mint lands on a windowsill. Nobody admits to sending it._  
_Far away, in a glade, a book appears on a doorstep in brown paper. It is overdue by about two hundred years._  
_An acorn drops into your hand. It is grey, folded like a walnut, and very slightly warm._  
**The Times Reporter**: Name? And the tree’s name? Never mind. Keeper, and unnamed associate.  
_The Brain Tree reads his notes over his shoulder and rustles, offended._  

**Rewards**

- Brain Tree Acorn (decor): Plants a small Brain Tree in your Neopia sandbox. A Neo pet that reads beneath it gains Intelligence a little faster.
- The Tree’s Rememberer (title): Title for restoring the Brain Tree’s memories.

Sets on completion: `{"nq-27-done":true}`

**Notes:** Audience all, so the Brain Tree is grumpy and sad, never frightening (no talk of death; the classic version asked about deaths, this one does not). The J + I carving links to the Illusen/Jhudora rivalry; it works whichever side the player took, or neither. Queen Fyora can be visited before or after the faerie chains.

## NQ28. The Esophagor’s Last Supper

*Neopets: the Esophagor (Haunted Woods)* · audience: main · where: Haunted Woods, the Esophagor’s cave · when: After your first visit to the Haunted Woods. Once.

**Cast:** The Esophagor (The Esophagor (Neopets)), The Neovian Baker

### Step 1: Find out from the baker in Neovia how the Esophagor’s favourite pie was made.

Hint: The bakery is on Neovia’s main square. The baker is old enough to remember the Esophagor’s family. · check: `talk:neovia-baker:esophagor`

#### <a id="nq28-ask"></a>Scene `nq28-ask`

_The cave mouth is wide and wet, and breathes out a smell of onions and regret._  
**The Esophagor** _(angry)_: FOOD. Is that food? It smells like a Keeper. Never mind. What have you got?  
**The Esophagor**: I ate everything in these woods. Boots. A bench. A small shed. None of it tasted of anything.  
_A bench leg sticks out of the cave wall like a toothpick. Someone has scratched above it: WAS A BENCH._  
**The Esophagor** _(sad)_: Before I was… this… my mum made a pie. Mushroom. With a burnt edge. I want that. Just once.  
_Your Nubbin is hiding entirely inside your coat._  

**Choices**

- **Ask how the shed was.**
    - **The Esophagor**: Splintery. Faint hint of rake. Would not recommend.
- **Ask about his mum.** — sets `{"nq-28-asked-mum":true}`
    - **The Esophagor**: She burned everything. Every single thing. I loved her very much.

#### <a id="nq28-ask-done"></a>Done `nq28-ask-done`

**The Neovian Baker** _(think)_: His mum? Mushrooms, black pepper, far too much butter, and she always forgot it in the oven.  
**The Neovian Baker**: The burnt edge was the recipe. Everyone thought it was a mistake. It was a mistake. But it was the recipe.  

### Step 2: Bake the mushroom pie and feed it to the Esophagor.

Hint: Bake it in the Neopia kitchen with mushrooms, pepper and butter, then carry it back to the cave. · check: `give:food:mushroom-pie:esophagor`

#### <a id="nq28-bake"></a>Scene `nq28-bake`

_Back in your kitchen: mushrooms, black pepper, far too much butter. The baker was very firm about the butter._  
_The baker’s recipe card has one line underlined three times: FORGET IT IN THE OVEN._  
_The pie goes in. The smell fills the cottage. Your Nubbins gather at the oven door._  
_One of them drools on the floor, then quietly lies down in it._  
_The edge starts to darken. Golden. Brown. Browner._  
_You have about four seconds to decide._  

**Choices**

- **Leave it in. Burn the edge.** — sets `{"nq-28-pie":"burnt"}`
    - The edge goes black and crackly. The kitchen smells like somebody’s childhood.
- **Take it out golden. Perfect.** — sets `{"nq-28-pie":"golden"}`
    - It is a beautiful pie. It is not his mum’s pie.

### Complete

#### <a id="nq28-complete"></a>Complete `nq28-complete`

_You hold the pie out at arm’s length. The Esophagor takes it in one bite, dish and all._  
**The Esophagor** _(think)_: …  
**The Esophagor** _(soft)_: That’s it. That’s the one. That’s her.  
_For a long moment the cave is quiet. Then it burps, enormously, and a ladle flies out and lands at your feet._  
**The Esophagor** _(happy)_: Keep that. I ate it in about the year of the long winter. Never needed it. Thank you, Keeper.  

#### <a id="nq28-complete-nq-28-asked-mum"></a>Variant `nq28-complete-nq-28-asked-mum`

_Variant of `nq28-complete`._

_You hold the pie out at arm’s length. The Esophagor takes it in one bite, dish and all._  
**The Esophagor** _(think)_: …  
**The Esophagor** _(soft)_: That’s it. That’s the one. That’s her.  
**The Esophagor** _(soft)_: You asked about her. Before the pie, I mean. Nobody asks. Thank you for that too.  
_For a long moment the cave is quiet. Then it burps, enormously, and a ladle flies out and lands at your feet._  
**The Esophagor** _(happy)_: Keep that. I ate it in about the year of the long winter. Never needed it. Thank you, Keeper.  

**Rewards**

- The Esophagor’s Ladle (decor): A huge, slightly dented ladle for the Neopia kitchen wall. Food cooked under it smells a little better.
- Cookbook Page: His Mum’s Mushroom Pie (item): A Neopia kitchen recipe: mushroom pie, burnt edge optional. Very filling.

Sets on completion: `{"nq-28-done":true}`

**Notes:** Audience main (darker Haunted Woods). The pie must be baked with the burnt choice for the complete scene above; if `nq-28-pie` = golden, play instead: Esophagor "Nice. Very nice. Not hers." (sad), then the step stays open so the player can bake again (no cost beyond ingredients). The oven choice is a 4-second prompt in spirit only: no real timer, the choice waits for the player.

## NQ29. Waking the Turmaculus

*Neopets: the Turmaculus (Meridell)* · audience: all · where: Meridell, the Turmaculus’s hollow beyond Meri Acres Farm · when: After your first visit to Meridell. Once.

**Cast:** The Meridell Farmer, The Farmer’s Wife, The Times Reporter (A weary Neopian Times reporter (original))

### Step 1: Bring the petpet that can wake the Turmaculus.

Hint: He sleeps through noise. Think about what wakes a sleeper who ignores noise. Petpets are sold in Neopia Central. · check: `wake:turmaculus:warf`

#### <a id="nq29-ask"></a>Scene `nq29-ask`

_In the hollow lies a petpet the size of a barn, snoring. Each snore moves the hedges._  
_A sign on the fence says DO NOT WAKE. Underneath, older and smaller: WE HAVE TRIED._  
**The Meridell Farmer**: That’s the Turmaculus. Been asleep since my grandad’s time. He’s guarding something, they say.  
**The Meridell Farmer** _(think)_: Thunder doesn’t wake him. Drums don’t. Kass’s army marched past once. Nothing.  
**The Meridell Farmer**: What wakes a big soft thing that won’t wake for noise? That’s the question.  
**The Farmer’s Wife**: Don’t you dare wake him, Alf. He’s the only one in Meridell who never answers back.  
**The Meridell Farmer**: I do not answer back.  
**The Farmer’s Wife**: That’s an answer.  
_Your Nubbin creeps up and pats the Turmaculus’s nose. He snores harder, delighted._  

**Choices**

- **Suggest a Babaa. Soft and woolly. It might be soothing.** — sets `{"nq-29-guess":"babaa"}`
    - **The Meridell Farmer**: Soothing? He’s asleep. You’ll send him deeper.
- **Suggest a Mortog. Loud croak.** — sets `{"nq-29-guess":"mortog"}`
    - **The Meridell Farmer**: Loud doesn’t work. I just told you. Weren’t you listening?
- **Suggest a Warf. Nothing ignores a dog licking its face.** — sets `{"nq-29-guess":"warf"}`
    - **The Meridell Farmer**: A lick. Huh. Nobody’s ever tried that.

#### <a id="nq29-ask-done"></a>Done `nq29-ask-done`

_The Warf trots up and gives the enormous nose one long, thorough lick._  
_One eye opens. Then the other. The Turmaculus sits up, yawns, and looks at the Warf with deep offence._  
**The Meridell Farmer** _(happy)_: A hundred years asleep, and the first thing he does is take offence. He’s a proper Meridellian.  

### Complete

#### <a id="nq29-complete"></a>Complete `nq29-complete`

_The Turmaculus stretches. Under where he lay is a small wooden box, flattened slightly by a century of nap._  
**The Meridell Farmer** _(shock)_: So that’s what he was guarding. Go on. It’s yours. You woke him.  
_Inside is a paint brush with bristles that shimmer like a dragonfly’s wing._  
_The Turmaculus watches you take it, sniffs the Warf once more, and goes back to sleep, satisfied._  
**The Times Reporter** _(think)_: Keeper. And the unnamed associate. And, I suppose, the Warf.  
_The Warf eats the notebook. It is, he says wearily, the third this week._  

**Rewards**

- Faerie Petpet Paint Brush (item): A rare single-use petpet paint brush. Paints one petpet Faerie, permanently.

Sets on completion: `{"nq-29-done":true}`

**Notes:** Once only, as the brief asks. The right petpet is a Warf; bringing a Babaa or Mortog plays a short wrong-guess beat (Babaa: he snores happier; Mortog: he snores louder) and the step stays open. The farmer’s choices are hints, not commitments: `nq-29-guess` only changes his first line if the player returns with the wrong petpet. The petpet is not used up. Art: barn-sized sleeping Turmaculus with hedges swaying on each snore.

## NQ30. The Secret Laboratory Map

*Neopets: the Secret Laboratory Map and the Lab Ray* · audience: all · where: Neopia Central, the Trading Post noticeboard · when: After you have visited four lands of Neopia. Once.

**Cast:** The Scientist (The Lab Ray Scientist (Neopets)), The Grundo, The Times Reporter (A weary Neopian Times reporter (original))

### Step 1: Find the first two pieces of the Secret Laboratory Map, in the Lost Desert and on Krawk Island.

Hint: One piece is in the Deserted Tomb; one is buried on Krawk Island’s Forgotten Shore. · check: `find:item:lab-map-piece:2`

#### <a id="nq30-notice"></a>Scene `nq30-notice`

_Pinned to the noticeboard is a torn quarter of a map. The rest of the notice has been ripped away._  
_Written on the back, in a tidy hand: Four pieces. Four lands. Bring them together and follow the line._  
_The quarter shows a coastline, a dotted line, and a drawing of a ray gun with a smiley face._  
_Along the very edge, in tiny letters: If found, please return to the nearest island that isn’t there._  
_Your Nubbin taps the smiley face, then looks at you, worried._  
_A passing Grundo glances at the map, goes pale, and walks off much faster than before._  

**Choices**

- **Pocket it. You love a treasure map.** — sets `{"nq-30-keen":true}`
    - You pocket it. Something about the smiley face is far too cheerful.
- **Pocket it, but carefully, like it might bite.**
    - You fold it with two fingers. It doesn’t bite. It does feel slightly warm.

#### <a id="nq30-step1-done"></a>Done `nq30-step1-done`

_Two pieces fit together with a faint click. The dotted line runs off the torn edge._  
_On the back of the second piece, the same tidy hand: Bring snacks. The ray gets peckish._  

### Step 2: Find the last two pieces, in Terror Mountain’s Ice Caves and the ruins of Geraptiku.

Hint: One piece is frozen into a wall in the Ice Caves (not the Snowager’s cave); one is under a statue in Geraptiku. · check: `find:item:lab-map-piece:4`

#### <a id="nq30-pieces"></a>Scene `nq30-pieces`

_The map is half whole. A label has appeared along the dotted line: TO THE LAB._  
_Underneath, smaller, in the same tidy hand: Please. It’s very quiet out here._  
_Your Nubbin sniffs the frosty corner and sneezes. It sniffs the mossy corner and sneezes in a completely different key._  
**The Grundo** _(shock)_: Oh. You’ve got more of it. Please don’t tell me where it goes.  
_He leaves again, faster than before._  
_Two corners are still missing. One has frost on its edge. The other has a smudge of jungle moss._  
_Somewhere cold, and somewhere green._  

#### <a id="nq30-step2-done"></a>Done `nq30-step2-done`

_Four pieces. When the last one touches the others, the tears seal by themselves with a faint hiss._  
_The map now shows a small island off Mystery Island that was certainly not there before._  

### Step 3: Follow the map to the Secret Laboratory.

Hint: Take the Mystery Island boat and tell the ferryman to follow the map. He won’t like it. · check: `visit:neopia:secret-laboratory`

#### <a id="nq30-lab"></a>Scene `nq30-lab`

_The island is a rock, a tin hut, and a satellite dish that turns to follow you as you land._  
**The Scientist** _(happy)_: Visitors! Real ones! Come in, come in, mind the cables, mind the other cables.  
**The Scientist**: This is the Lab Ray. It changes things. Colour, shape, sometimes nothing. Never the same twice.  
**The Scientist** _(happy)_: Results so far: one blue Kacheek, one Kacheek-shaped Kau, and a Kau that is now very slightly taller.  
**The Scientist** _(shock)_: Before you ask: I don’t work for anybody. Especially not anybody green. Never met him.  
_Your Nubbin hides behind a filing cabinet. The cabinet is labelled DEFINITELY NOT SLOTH STUFF._  

**Choices**

- **Ask what “sometimes nothing” means.**
    - **The Scientist**: It means sometimes nothing! Science is mostly nothing. That’s what makes the something exciting.
- **Ask about the filing cabinet.** — sets `{"nq-30-cabinet":true}`
    - **The Scientist**: Old tax records. Very boring. Please stop looking at it.

### Complete

#### <a id="nq30-complete"></a>Complete `nq30-complete`

**The Scientist**: Here’s the rule. Each Neo pet gets one zap, ever. Choose wisely, or recklessly. Both are fun.  
_He pats the ray like a favourite dog. It sparks. He pretends it didn’t._  
**The Scientist**: Come back whenever you like. The map knows the way now.  
_The satellite dish waves goodbye. You’re fairly sure that’s not something dishes do._  
**The Times Reporter** _(sad)_: I followed the dish. Name? No. Keeper, and unnamed associate, and a ray.  

#### <a id="nq30-complete-nq-30-cabinet"></a>Variant `nq30-complete-nq-30-cabinet`

_Variant of `nq30-complete`._

**The Scientist**: Here’s the rule. Each Neo pet gets one zap, ever. Choose wisely, or recklessly. Both are fun.  
_He pats the ray like a favourite dog. It sparks. He pretends it didn’t._  
**The Scientist** _(shock)_: Come back whenever you like. The map knows the way now. And stop looking at the cabinet.  
_The satellite dish waves goodbye. You’re fairly sure that’s not something dishes do._  
**The Times Reporter** _(sad)_: I followed the dish. Name? No. Keeper, and unnamed associate, and a ray.  

#### <a id="nq30-complete-nq-30-keen"></a>Variant `nq30-complete-nq-30-keen`

_Variant of `nq30-complete`._

**The Scientist**: Here’s the rule. Each Neo pet gets one zap, ever. Choose wisely, or recklessly. Both are fun.  
_He pats the ray like a favourite dog. It sparks. He pretends it didn’t._  
**The Scientist** _(happy)_: You looked pleased when you found the map. Most people look worried. I’ve decided to like you.  
**The Scientist**: Come back whenever you like. The map knows the way now.  
_The satellite dish waves goodbye. You’re fairly sure that’s not something dishes do._  
**The Times Reporter** _(sad)_: I followed the dish. Name? No. Keeper, and unnamed associate, and a ray.  

**Rewards**

- The Lab Ray (feature): Each Neo pet may be zapped once in its life: a random new colour (Mutant possible), a new species, a stat change, or nothing at all.

Sets on completion: `{"nq-30-done":true,"neo-lab-ray":true}`

**Notes:** Unlocks the Lab Ray (brief, "Ways to change colour or species"). The map pieces are guaranteed finds once the quest is active, any order within each step. Lab Ray outcomes are never harmful: a stat change is +1 or −1 level, never below 0. Nubbins are never zappable: the Lab Ray works on Neo pets only (canon 21). Sloth wink: the cabinet label and the "anybody green" line; the Scientist never appears in the NP line.

## NQ31. Sneaking Past the Snowager

*Neopets: the Snowager (Terror Mountain Ice Caves)* · audience: all · where: Terror Mountain, the mouth of the Ice Caves · when: Your first visit to the Ice Caves.

**Cast:** The Ice Cave Guide, The Snowager (The Snowager (Neopets))

### Step 1: Sneak into the Snowager’s cave while he sleeps and take one item from his hoard.

Hint: Move only while he breathes out (the frost cloud). Freeze when he breathes in. If he wakes, you’re chilled, not hurt. · check: `sneak:snowager:1`

#### <a id="nq31-sneak"></a>Scene `nq31-sneak`

**The Ice Cave Guide**: First time? Right. In there is the Snowager. Big ice worm. Sleeps on a pile of other people’s things.  
**The Ice Cave Guide** _(think)_: When he breathes out, you see a frost cloud. Move then. When he breathes in, freeze. Like a statue.  
**The Ice Cave Guide**: If he wakes, he blasts you. Snow, not ice. You’ll be cold and cross for a bit. That’s all.  
**The Ice Cave Guide**: And don’t touch the spoon. Nobody knows why. He just really loves that spoon.  
_Deep in the cave, something the size of a train exhales. A white mist rolls towards you._  
_Your Nubbin puffs up all its fur and goes perfectly still, practising._  

**Choices**

- **Go in alone. Leave your Nubbin with the guide.** — sets `{"nq-31-solo":true}`
    - **The Ice Cave Guide**: Wise. Small ones sneeze in the cold. Sneezing is very bad in there.
- **Take your Nubbin in with you.**
    - **The Ice Cave Guide**: Brave. Hold its nose if it looks like sneezing.

#### <a id="nq31-sneak-done"></a>Done `nq31-sneak-done`

**The Snowager** _(think)_: Mmmnh… ssssomebody… touching my… sssspoon…  
_He rolls over, curls his tail protectively round a single tarnished spoon, and goes back to sleep._  
_You are already outside. Your heart arrives a moment later._  

### Complete

#### <a id="nq31-complete"></a>Complete `nq31-complete`

**The Ice Cave Guide** _(happy)_: You made it out! First try! Most people come out looking like a snowman.  
**The Ice Cave Guide**: That’s your one, mind. He sleeps light for anyone he’s smelt before.  
_In your hand is the thing you grabbed: a snowball that never melts, packed perfectly round._  
**The Ice Cave Guide**: Ha. He keeps those for throwing at people. Now you have one to throw back.  

**Rewards**

- Snowager’s Hoard (title): Title. One sneak, one prize, ever. You got yours, and the spoon is still his.
- Icy Snowball (item): A single-use Battledome item that slows an opponent for one round.

Sets on completion: `{"nq-31-done":true}`

**Notes:** One-time: this is the only Snowager sneak (canon: no per-visit freebies; the brief’s “once per visit” loop is retired). It cannot wake him; the done scene is a near-miss for comedy, and there is no fail state. The old repeatable “Snowager Sneak” feature reward is replaced by the Snowager’s Hoard title. If `nq-31-solo` is set ("Go in alone"), the Nubbin is waiting by the guide in the complete scene, wrapped in his scarf.

## NQ32. The Signpost to Jelly World

*Neopets: Jelly World (the land that does not exist)* · audience: all · where: Neopia Central, a signpost behind the Food Shop · when: Any visit to Neopia Central. The signpost is easy to miss.

**Cast:** The Official

### Step 1: Follow the signpost to Jelly World, which does not exist.

Hint: Walk the way the sign points. Keep walking. Ignore the Official. · check: `visit:neopia:jelly-world`

#### <a id="nq32-sign"></a>Scene `nq32-sign`

_Behind the Food Shop is a wooden signpost. One arm says JELLY WORLD. It points at a brick wall._  
_Beneath the arm, a smaller sign: JELLY WORLD IS CLOSED. Beneath that, smaller still: JELLY WORLD WAS NEVER OPEN._  
**The Official**: Ah. Don’t mind that. It’s a sign to nowhere. There is no Jelly World.  
**The Official** _(angry)_: There has never been a Jelly World. Please stop asking about Jelly World.  
_He has a clipboard. The clipboard has a small green jelly stain on it._  
_Your Nubbin walks up to the brick wall, and walks through it._  

**Choices**

- **Follow your Nubbin.**
    - **The Official**: I didn’t see that. I didn’t see any of that.
- **Point at the stain on his clipboard.**
    - **The Official**: That’s… lime cordial. Unrelated. Good day.
    - He walks away briskly. You go through the wall.

#### <a id="nq32-sign-done"></a>Done `nq32-sign-done`

_On the other side of the wall is nothing. A flat, wobbling, shiny nothing, as far as you can see._  
_A second signpost stands in the nothing. It says: YOU ARE NOT HERE._  
_In the middle of the nothing sits one jelly on a plate._  

### Complete

#### <a id="nq32-complete"></a>Complete `nq32-complete`

_The jelly is green. It wobbles at you, in a friendly sort of way._  
_Nobody else is here. The ground wobbles too. So does the sky, a little._  
_A small card beside the plate says: This jelly does not exist. Please enjoy it._  
_Your Nubbin looks at the jelly, then at you, then at the jelly._  

**Choices**

- **Share it with your Nubbin, here and now.** — sets `{"nq-32-jelly":"eaten"}`
    - It tastes of lime and a bit of birthday. When you look up, you are behind the Food Shop again.
- **Take it home on its plate.** — sets `{"nq-32-jelly":"kept"}`
    - You step back through the wall with the jelly in both hands. The Official is waiting, eyes closed.
- **Leave it. Jelly World needs its jelly.** — sets `{"nq-32-jelly":"left"}`
    - You leave it on its plate. As you go, it wobbles once, slowly, like a wave.

**Rewards**

- Green Jelly (item): The rarest jelly. Given only if you take it home; it counts for the Island Chef’s trifle (NQ21).
- The Giant Jelly (item): One time only. Once you have finished both this quest and the Neopia line (NP13), the Official leaves one more jelly behind the Food Shop, and denies it.
- Has Never Been to Jelly World (title): Title. You haven’t. Nobody has.

Sets on completion: `{"nq-32-done":true}`

**Notes:** A joke quest and an Easter egg (brief: "a signpost to nowhere, and one jelly"). The Green Jelly is added only if `nq-32-jelly` = kept; eaten, the Nubbin looks pleased for the rest of the scene (no Grove effect); left gives nothing but the title. After this quest, the Official stands by the sign and denies everything (one random line from a pool of short denials, to be written; ambient, no reward). The Giant Jelly is one-time (canon: no per-visit freebies): granted once, as soon as both `nq-32-done` and `np-line-complete` are set (whichever comes second), as a second jelly on the plate behind the Food Shop. The brief lists Jelly as a special colour "from Jelly World"; this quest does not grant it. The owner decides whether the Giant Jelly can rarely drop a Jelly paint brush. Art: a flat glossy green-white void, wobble shader on ground and sky, one jelly on a plate.
