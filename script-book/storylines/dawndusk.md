# Storyline SL4: Dawn & Dusk

## Dawn & Dusk: Dawn

*The Sun Keepers’ half of one long day.* · Digimon World: Dawn / Dusk (2007): mechanics only · audience: main · save id: `dawn`

**Cast:** Marigold Penhallow, Rowan Penhallow, Teodor Vask

### Chapter 1: First Light

Goal: Hatch an egg. (`stat:hatched:>=1`) · Hint: Hold and shake it.

#### <a id="dawn-c1-open"></a>Opening `dawn-c1-open`

_You come into the valley at first light. Four houses stand round the green._  
_Each has a creature carved over its door: a flier, a runner, a swimmer, a thicket thing._  
**Marigold Penhallow**: Marigold Penhallow. I keep the houses by day; my twin brother keeps them by night. We don’t overlap. We don’t agree, either.  
**Marigold Penhallow**: Hatch what you brought. The houses like a Keeper who has something to lose.  

When `flag:dd-other-done`:

#### <a id="dawn-c1-other"></a>Beat `dawn-c1-other`

**Marigold Penhallow**: My brother finished his half. Found a cause, fixed it, told me nothing, which is how I know it went well.  
**Marigold Penhallow**: If a Keeper from the night side ever tells you how it ended there, listen.  
**Marigold Penhallow**: We’d have the whole day. We have never once had the whole day.  
_Marigold looks at the green as if measuring it for something._  

When `days:>=1`:

#### <a id="dawn-c1-houses"></a>Beat `dawn-c1-houses`

_The four houses are shut and their lamps are out. Over each door the carved creature has been touched smooth by years of hands._  
**Marigold Penhallow**: They were full once. Each house kept its kind, and the kind kept the house. Then the Keepers stopped coming.  
**Marigold Penhallow**: I don’t blame them. The valley’s a long walk from anywhere, and the houses don’t pay.  

#### <a id="dawn-c1-close"></a>Closing `dawn-c1-close`

_Hatched, and already looking at the four doors as if choosing one._  

### Chapter 2: The First House

Goal: Fill one species’ scan in the Collection Book. (`scans:full:>=1`) · Hint: Wild visitors scan on arrival and while they stay. A finished habitat patch brings them.

#### <a id="dawn-c2-open"></a>Opening `dawn-c2-open`

**Marigold Penhallow**: The houses are served by knowing their creatures. Meet one kind until the Book knows it whole. That’s a scan. The Book remembers what you kept company with.  
**Marigold Penhallow**: The meadow house first. Finish a patch and the wild ones come to it.  

When `count:wildArrived:>=1`:

#### <a id="dawn-c2-visitor"></a>Beat `dawn-c2-visitor`

_A wild one at the meadow patch, at the edge of the finished grass. The Book warms in your pocket, which it has not done before._  
**Marigold Penhallow**: Stay near it. The Book learns by company. It’s the only honest way to learn anything.  
_Your Nubbin goes and sits an arm’s length from the visitor, and the two of them ignore each other with great care._  

When `count:wildSettled:>=1`:

#### <a id="dawn-c2-settled"></a>Beat `dawn-c2-settled`

_The visitor stops visiting and starts living here. It picks a corner of the green and the corner is now its._  
**Marigold Penhallow**: The meadow house will take that one. They know which door. Nobody tells them and they know.  

When `days:>=2`:

#### <a id="dawn-c2-book"></a>Beat `dawn-c2-book`

_You open the Book by first light. Pages and pages of creatures half-drawn, in two hands: one neat, one not._  
**Marigold Penhallow**: The neat hand’s mine. The other is my brother’s. We’ve never once finished a page together.  
**Marigold Penhallow**: My brother will tell you the neat one’s his. He’s wrong, in very untidy handwriting.  

#### <a id="dawn-c2-close"></a>Closing `dawn-c2-close`

_The Book closes on a page that is full. The meadow house lights its lamp._  

### Chapter 3: The Reverting

Goal: Win the dojo’s first rank test. (`karate:belt:>=1`) · Hint: Tier 1 in the dojo. A win earns the yellow belt.

#### <a id="dawn-c3-open"></a>Opening `dawn-c3-open`

_Morning: one of yours is an egg. Not a new egg. Its own egg, with its own name still on it, and nothing in it that remembers walking._  
**Marigold Penhallow** _(shock)_: It’s happening across the valley. Grown ones going back. Nobody knows why.  
**Teodor Vask**: I might. I don’t talk to Keepers without a rank. Dojo. Yellow belt. Then we talk.  

When `days:>=1`:

#### <a id="dawn-c3-egg"></a>Beat `dawn-c3-egg`

_The egg with the old name sits in the shade where it used to nap. You find yourself talking to it. It does not rock._  
**Marigold Penhallow**: Keep it warm. Don’t hatch it. If it hatches it’s a child, and whatever it was is gone for good.  
**Marigold Penhallow** _(soft)_: I know you want to hold it. Hold it. Just don’t shake it.  

When `days:>=3`:

#### <a id="dawn-c3-dojo"></a>Beat `dawn-c3-dojo`

_The dojo is a long room with a mat and a man who stands at the far end of it as if the room were his argument._  
**Teodor Vask**: Yellow belt is a Keeper who turns up twice. Most don’t. Turn up twice.  

#### <a id="dawn-c3-close"></a>Closing `dawn-c3-close`

**Teodor Vask**: Yellow. Fine. It started the week the shrine was done up. That’s all I know and it’s more than Penhallow does.  

### Chapter 4: Two Houses More

Goal: Fill a second scan and convert one into an egg. (`scans:full:>=1&count:converted:>=1`) · Hint: The Collection Book’s Convert button on a full page; the roster needs room.

#### <a id="dawn-c4-open"></a>Opening `dawn-c4-open`

**Marigold Penhallow**: Two more houses, and this time convert a scan: the Book can turn a full page into an egg of that kind. That’s how the houses were filled the first time.  

When `scans:full:>=2`:

#### <a id="dawn-c4-page"></a>Beat `dawn-c4-page`

_A second page fills. The Book is heavier than it was, which is not how books work._  
**Marigold Penhallow**: Now convert it. The page gives up a little of itself and you get an egg of the kind it knew. A fair trade.  
**Marigold Penhallow**: The page doesn’t think so. Pages never do.  
_In a margin, untidy: “Goose.” Under it, neat: “Heron.” Under that, in both hands: “GOOSE.”_  

When `days:>=2`:

#### <a id="dawn-c4-second-house"></a>Beat `dawn-c4-second-house`

_The second house is the runners’, and its door has been shut so long the latch has grown into the frame._  
**Marigold Penhallow**: I oil it every week, and have since I could reach it. It still won’t give. It wants someone it knows on the other side.  

#### <a id="dawn-c4-close"></a>Closing `dawn-c4-close`

_An egg from a page. Two lamps lit on the green._  
**Marigold Penhallow**: Two lamps. One, two. I count them every morning, in case one has wandered off.  

### Chapter 5: The Second Rank

Goal: Win the dojo’s second rank test. (`karate:belt:>=2`) · Hint: Tier 2.

#### <a id="dawn-c5-open"></a>Opening `dawn-c5-open`

**Teodor Vask**: Green belt. Then I’ll show you what I found at the shrine.  

When `days:>=1`:

#### <a id="dawn-c5-dojo"></a>Beat `dawn-c5-dojo`

**Teodor Vask**: You’re back. Most aren’t. Green belt is where the dojo stops being polite.  
**Teodor Vask**: Your reverted one. Still an egg? Keep it so. I’ve seen the valley hatch them out of impatience and regret it.  

When `stat:evolved:>=1`:

#### <a id="dawn-c5-grown"></a>Beat `dawn-c5-grown`

_One of yours comes out of its cocoon grown, and the first thing it does is go and sit beside the egg with the old name on it._  
**Marigold Penhallow** _(soft)_: It remembers who that was. They do. It’s the one thing in the valley the reverting hasn’t touched.  

#### <a id="dawn-c5-close"></a>Closing `dawn-c5-close`

**Teodor Vask**: There. The new lamp glass, and a scanner lens under it, cracked.  

### Chapter 6: The Cause

Goal: Name the cause. (`flag:dd-cause`) · Hint: The choice is the goal.

#### <a id="dawn-c6-open"></a>Opening `dawn-c6-open`

**Marigold Penhallow**: So. Which is it. Say it, and we fix that one, and if you’re wrong we’ve fixed the wrong thing and the reverting goes on.  
**You**: You think about what Vask showed you.  

**Choices**

- **The shrine lamp. Its new glass throws light into the scanner.** — sets `{"dd-cause":"lamp","dd-right":true}`
- **The scanner. Its lens is cracked, and it has read everything wrong since.** — sets `{"dd-cause":"scanner","dd-right":false}`

When `flag:dd-right:true`:

#### <a id="dawn-c6-restored"></a>Beat `dawn-c6-restored`

_The egg with the old name on it cracks from the inside, and what comes out is grown, and remembers walking, and comes straight to you._  
**Marigold Penhallow** _(happy)_: That’s the one. That was the cause.  

When `flag:dd-right:false`:

#### <a id="dawn-c6-wrong"></a>Beat `dawn-c6-wrong`

_The egg with the old name on it stays an egg, and hatches in its own time, small, with everything to learn again._  
_The small one looks at its own shell, and eats it, in case it was important._  
**Marigold Penhallow** _(sad)_: Not that one, then. We’ve fixed a very good scanner. It looks thrilled.  
**Marigold Penhallow** _(soft)_: Well. It will grow. They do.  

#### <a id="dawn-c6-close"></a>Closing `dawn-c6-close`

_Whatever you named, something is done about it before the half-day is out._  

### Chapter 7: The Whole Day

Goal: Win the dojo’s last rank test. (`karate:belt:>=3`) · Hint: Tier 3.

#### <a id="dawn-c7-open"></a>Opening `dawn-c7-open`

**Teodor Vask**: Black belt, and the valley is yours to keep, this half of it anyway.  

When `flag:dd-right:true`:

#### <a id="dawn-c7-after-right"></a>Beat `dawn-c7-after-right`

**Marigold Penhallow**: The shrine lamp. Every day of my life and I never once looked at it. Vask looked. You looked. I kept houses.  
**Marigold Penhallow** _(soft)_: Keeping houses is looking, I used to think. It’s only half of it.  

When `flag:dd-right:false`:

#### <a id="dawn-c7-after-wrong"></a>Beat `dawn-c7-after-wrong`

**Marigold Penhallow**: We fixed the scanner. The reverting goes on somewhere, slower. Somebody will find the real one.  
**Marigold Penhallow**: Maybe my brother. He’d like that. I’d let him.  

When `days:>=1`:

#### <a id="dawn-c7-black"></a>Beat `dawn-c7-black`

**Teodor Vask**: Black belt isn’t strength. It’s turning up when there’s nothing left to prove. Turn up.  
_Your Nubbin, on the mat, bows the way it has seen you do it, which is badly, and with feeling._  

#### <a id="dawn-c7-close"></a>Closing `dawn-c7-close`

_First light on the green. Two lamps lit, and two doors waiting for someone they know._  
_The other half of the day belongs to someone else._  

### Endings

- **First Light** (`half-day`): Name the real cause and win the black belt.
- **A Fixed Shadow** (`wrong-cause`): Name the wrong cause: the reverted one hatches small and grows again.
- **The Whole Day** (`whole-day`): Name the real cause on a half started after the other half reached an ending.

#### <a id="end-dawn-half-day"></a>Ending scene `end-dawn-half-day`

_The green at first light, two lamps lit, and the reverted one asleep against your boot as if nothing had happened to it._  
**Marigold Penhallow** _(soft)_: Half a day. The other half’s not mine to tell.  
_Dawn & Dusk: First Light._  

#### <a id="end-dawn-wrong-cause"></a>Ending scene `end-dawn-wrong-cause`

_The green, two lamps lit, and a small one at your boot learning the grass again from the beginning._  
**Marigold Penhallow**: We fixed a thing. Not the thing. The valley goes on. So does it.  
_Dawn & Dusk: a Fixed Shadow._  

#### <a id="end-dawn-whole-day"></a>Ending scene `end-dawn-whole-day`

_The green at first light, and for once all four lamps are lit._  
_The latched door opens at a touch. Rowan is on the other side, holding an oil can._  
**Rowan Penhallow**: I oil it every week.  
**Marigold Penhallow**: So do I.  
_They look at the can, then at each other. For once the twins are both on the green, not overlapping, not agreeing._  
**Teodor Vask**: I turned up. Don’t read anything into it.  
**Marigold Penhallow** _(happy)_: He found the bell. You found the lamp. It took both halves. It usually does.  
_Asked whose is the neat hand, both twins point at the page at once. Your Nubbin points at the goose in the margin._  
_Dawn & Dusk: the Whole Day._  

**Notes:** Built from one template per half. The rule degenerates the oldest grown Nubbin when chapter 3 opens and restores it when the right cause is named, if it is still an egg. The `days:` beats are the story clock from the chapter’s start.

## Dawn & Dusk: Dusk

*The Moon Keepers’ half of one long day.* · Digimon World: Dawn / Dusk (2007): mechanics only · audience: main · save id: `dusk`

**Cast:** Marigold Penhallow, Rowan Penhallow, Teodor Vask

### Chapter 1: Last Light

Goal: Hatch an egg. (`stat:hatched:>=1`) · Hint: Hold and shake it.

#### <a id="dusk-c1-open"></a>Opening `dusk-c1-open`

_You come into the valley at last light. Four houses stand round the green._  
_Each has a creature carved over its door: a flier, a runner, a swimmer, a thicket thing._  
**Rowan Penhallow**: Rowan Penhallow. I keep the houses by night; my twin sister keeps them by day. We don’t overlap. We don’t agree, either.  
**Rowan Penhallow**: Hatch what you brought. The houses like a Keeper who has something to lose.  

When `flag:dd-other-done`:

#### <a id="dusk-c1-other"></a>Beat `dusk-c1-other`

**Rowan Penhallow**: My sister finished her half. Found a cause, fixed it, told me nothing, which is how I know it went well.  
**Rowan Penhallow**: If a Keeper from the day side ever tells you how it ended there, listen.  
**Rowan Penhallow**: We’d have the whole day. We have never once had the whole day.  
_Rowan looks at the green as if measuring it for something._  

When `days:>=1`:

#### <a id="dusk-c1-houses"></a>Beat `dusk-c1-houses`

_The four houses are shut and their lamps are out. Over each door the carved creature has been touched smooth by years of hands._  
**Rowan Penhallow**: They were full once. Each house kept its kind, and the kind kept the house. Then the Keepers stopped coming.  
**Rowan Penhallow**: I don’t blame them. The valley’s a long walk from anywhere, and the houses don’t pay.  

#### <a id="dusk-c1-close"></a>Closing `dusk-c1-close`

_Hatched, and already looking at the four doors as if choosing one._  

### Chapter 2: The First House

Goal: Fill one species’ scan in the Collection Book. (`scans:full:>=1`) · Hint: Wild visitors scan on arrival and while they stay. A finished habitat patch brings them.

#### <a id="dusk-c2-open"></a>Opening `dusk-c2-open`

**Rowan Penhallow**: The houses are served by knowing their creatures. Meet one kind until the Book knows it whole. That’s a scan. The Book remembers what you kept company with.  
**Rowan Penhallow**: The meadow house first. Finish a patch and the wild ones come to it.  

When `count:wildArrived:>=1`:

#### <a id="dusk-c2-visitor"></a>Beat `dusk-c2-visitor`

_A wild one at the meadow patch, at the edge of the finished grass. The Book warms in your pocket, which it has not done before._  
**Rowan Penhallow**: Stay near it. The Book learns by company. It’s the only honest way to learn anything.  
_Your Nubbin goes and sits an arm’s length from the visitor, and the two of them ignore each other with great care._  

When `count:wildSettled:>=1`:

#### <a id="dusk-c2-settled"></a>Beat `dusk-c2-settled`

_The visitor stops visiting and starts living here. It picks a corner of the green and the corner is now its._  
**Rowan Penhallow**: The meadow house will take that one. They know which door. Nobody tells them and they know.  

When `days:>=2`:

#### <a id="dusk-c2-book"></a>Beat `dusk-c2-book`

_You open the Book by last light. Pages and pages of creatures half-drawn, in two hands: one neat, one not._  
**Rowan Penhallow**: The neat hand’s mine. The other is my sister’s. We’ve never once finished a page together.  
**Rowan Penhallow**: My sister will tell you the neat one’s hers. She’s wrong, in very untidy handwriting.  

#### <a id="dusk-c2-close"></a>Closing `dusk-c2-close`

_The Book closes on a page that is full. The meadow house lights its lamp._  

### Chapter 3: The Reverting

Goal: Win the dojo’s first rank test. (`karate:belt:>=1`) · Hint: Tier 1 in the dojo. A win earns the yellow belt.

#### <a id="dusk-c3-open"></a>Opening `dusk-c3-open`

_Evening: one of yours is an egg. Not a new egg. Its own egg, with its own name still on it, and nothing in it that remembers walking._  
**Rowan Penhallow** _(shock)_: It’s happening across the valley. Grown ones going back. Nobody knows why.  
**Teodor Vask**: I might. I don’t talk to Keepers without a rank. Dojo. Yellow belt. Then we talk.  

When `days:>=1`:

#### <a id="dusk-c3-egg"></a>Beat `dusk-c3-egg`

_The egg with the old name sits in the shade where it used to nap. You find yourself talking to it. It does not rock._  
**Rowan Penhallow**: Keep it warm. Don’t hatch it. If it hatches it’s a child, and whatever it was is gone for good.  
**Rowan Penhallow** _(soft)_: I know you want to hold it. Hold it. Just don’t shake it.  

When `days:>=3`:

#### <a id="dusk-c3-dojo"></a>Beat `dusk-c3-dojo`

_The dojo is a long room with a mat and a man who stands at the far end of it as if the room were his argument._  
**Teodor Vask**: Yellow belt is a Keeper who turns up twice. Most don’t. Turn up twice.  

#### <a id="dusk-c3-close"></a>Closing `dusk-c3-close`

**Teodor Vask**: Yellow. Fine. It started the week the shrine was done up. That’s all I know and it’s more than Penhallow does.  

### Chapter 4: Two Houses More

Goal: Fill a second scan and convert one into an egg. (`scans:full:>=1&count:converted:>=1`) · Hint: The Collection Book’s Convert button on a full page; the roster needs room.

#### <a id="dusk-c4-open"></a>Opening `dusk-c4-open`

**Rowan Penhallow**: Two more houses, and this time convert a scan: the Book can turn a full page into an egg of that kind. That’s how the houses were filled the first time.  

When `scans:full:>=2`:

#### <a id="dusk-c4-page"></a>Beat `dusk-c4-page`

_A second page fills. The Book is heavier than it was, which is not how books work._  
**Rowan Penhallow**: Now convert it. The page gives up a little of itself and you get an egg of the kind it knew. A fair trade.  
**Rowan Penhallow**: The page doesn’t think so. Pages never do.  
_In a margin, untidy: “Goose.” Under it, neat: “Heron.” Under that, in both hands: “GOOSE.”_  

When `days:>=2`:

#### <a id="dusk-c4-second-house"></a>Beat `dusk-c4-second-house`

_The second house is the swimmers’, and its door has been shut so long the latch has grown into the frame._  
**Rowan Penhallow**: I oil it every week, and have since I could reach it. It still won’t give. It wants someone it knows on the other side.  

#### <a id="dusk-c4-close"></a>Closing `dusk-c4-close`

_An egg from a page. Two lamps lit on the green._  
**Rowan Penhallow**: Two lamps. That’s two, I think. Mostly.  

### Chapter 5: The Second Rank

Goal: Win the dojo’s second rank test. (`karate:belt:>=2`) · Hint: Tier 2.

#### <a id="dusk-c5-open"></a>Opening `dusk-c5-open`

**Teodor Vask**: Green belt. Then I’ll show you what I found at the shrine.  

When `days:>=1`:

#### <a id="dusk-c5-dojo"></a>Beat `dusk-c5-dojo`

**Teodor Vask**: You’re back. Most aren’t. Green belt is where the dojo stops being polite.  
**Teodor Vask**: Your reverted one. Still an egg? Keep it so. I’ve seen the valley hatch them out of impatience and regret it.  

When `stat:evolved:>=1`:

#### <a id="dusk-c5-grown"></a>Beat `dusk-c5-grown`

_One of yours comes out of its cocoon grown, and the first thing it does is go and sit beside the egg with the old name on it._  
**Rowan Penhallow** _(soft)_: It remembers who that was. They do. It’s the one thing in the valley the reverting hasn’t touched.  

#### <a id="dusk-c5-close"></a>Closing `dusk-c5-close`

**Teodor Vask**: There. A rope on the old bell, new, and footprints that come at midnight.  

### Chapter 6: The Cause

Goal: Name the cause. (`flag:dd-cause`) · Hint: The choice is the goal.

#### <a id="dusk-c6-open"></a>Opening `dusk-c6-open`

**Rowan Penhallow**: So. Which is it. Say it, and we fix that one, and if you’re wrong we’ve fixed the wrong thing and the reverting goes on.  
**You**: You think about what Vask showed you.  

**Choices**

- **The old bell. Someone has been ringing it at midnight.** — sets `{"dd-cause":"bell","dd-right":true}`
- **The night mist. It came in thick the week the shrine was done up.** — sets `{"dd-cause":"mist","dd-right":false}`

When `flag:dd-right:true`:

#### <a id="dusk-c6-restored"></a>Beat `dusk-c6-restored`

_The egg with the old name on it cracks from the inside, and what comes out is grown, and remembers walking, and comes straight to you._  
**Rowan Penhallow** _(happy)_: That’s the one. That was the cause.  

When `flag:dd-right:false`:

#### <a id="dusk-c6-wrong"></a>Beat `dusk-c6-wrong`

_The egg with the old name on it stays an egg, and hatches in its own time, small, with everything to learn again._  
_The small one looks at its own shell, and eats it, in case it was important._  
**Rowan Penhallow** _(sad)_: Not that one, then. We’ve cleared a lot of mist. The pond is furious.  
**Rowan Penhallow** _(soft)_: Well. It will grow. They do.  

#### <a id="dusk-c6-close"></a>Closing `dusk-c6-close`

_Whatever you named, something is done about it before the half-day is out._  

### Chapter 7: The Whole Day

Goal: Win the dojo’s last rank test. (`karate:belt:>=3`) · Hint: Tier 3.

#### <a id="dusk-c7-open"></a>Opening `dusk-c7-open`

**Teodor Vask**: Black belt, and the valley is yours to keep, this half of it anyway.  

When `flag:dd-right:true`:

#### <a id="dusk-c7-after-right"></a>Beat `dusk-c7-after-right`

**Rowan Penhallow**: The old bell. Every night of my life and I never once looked at it. Vask looked. You looked. I kept houses.  
**Rowan Penhallow** _(soft)_: Keeping houses is looking, I used to think. It’s only half of it.  

When `flag:dd-right:false`:

#### <a id="dusk-c7-after-wrong"></a>Beat `dusk-c7-after-wrong`

**Rowan Penhallow**: We fixed the mist. The reverting goes on somewhere, slower. Somebody will find the real one.  
**Rowan Penhallow**: Maybe my sister. She’d like that. I’d let her.  

When `days:>=1`:

#### <a id="dusk-c7-black"></a>Beat `dusk-c7-black`

**Teodor Vask**: Black belt isn’t strength. It’s turning up when there’s nothing left to prove. Turn up.  
_Your Nubbin, on the mat, bows the way it has seen you do it, which is badly, and with feeling._  

#### <a id="dusk-c7-close"></a>Closing `dusk-c7-close`

_Last light on the green. Two lamps lit, and two doors waiting for someone they know._  
_The other half of the day belongs to someone else._  

### Endings

- **Last Light** (`half-day`): Name the real cause and win the black belt.
- **A Fixed Shadow** (`wrong-cause`): Name the wrong cause: the reverted one hatches small and grows again.
- **The Whole Day** (`whole-day`): Name the real cause on a half started after the other half reached an ending.

#### <a id="end-dusk-half-day"></a>Ending scene `end-dusk-half-day`

_The green at last light, two lamps lit, and the reverted one asleep against your boot as if nothing had happened to it._  
**Rowan Penhallow** _(soft)_: Half a day. The other half’s not mine to tell.  
_Dawn & Dusk: Last Light._  

#### <a id="end-dusk-wrong-cause"></a>Ending scene `end-dusk-wrong-cause`

_The green, two lamps lit, and a small one at your boot learning the grass again from the beginning._  
**Rowan Penhallow**: We fixed a thing. Not the thing. The valley goes on. So does it.  
_Dawn & Dusk: a Fixed Shadow._  

#### <a id="end-dusk-whole-day"></a>Ending scene `end-dusk-whole-day`

_The green at last light, and for once all four lamps are lit._  
_The latched door opens at a touch. Marigold is on the other side, holding an oil can._  
**Marigold Penhallow**: I oil it every week.  
**Rowan Penhallow**: So do I.  
_They look at the can, then at each other. For once the twins are both on the green, not overlapping, not agreeing._  
**Teodor Vask**: I turned up. Don’t read anything into it.  
**Rowan Penhallow** _(happy)_: She found the lamp. You found the bell. It took both halves. It usually does.  
_Asked whose is the neat hand, both twins point at the page at once. Your Nubbin points at the goose in the margin._  
_Dawn & Dusk: the Whole Day._  

**Notes:** Built from one template per half. The rule degenerates the oldest grown Nubbin when chapter 3 opens and restores it when the right cause is named, if it is still an egg. The `days:` beats are the story clock from the chapter’s start.
